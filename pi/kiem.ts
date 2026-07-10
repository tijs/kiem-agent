/**
 * Kiem extension for Pi.
 *
 * Exposes the `kiem` CLI as native Pi tools so an agent reads and maintains a
 * project's shared state (notes + todos, synced across machines and agents)
 * as first-class tool calls instead of ad-hoc shell commands. Pairs with the
 * `projects` skill, which explains *when* to use these tools.
 *
 * Requires the `kiem` CLI on PATH (set KIEM_BIN to override the binary path).
 *
 * Install:
 *   pi install <path-to>/pi/kiem.ts          # adds to settings (global)
 *   pi install <path-to>/pi/kiem.ts -l       # project-local (.pi)
 *   pi -e <path-to>/pi/kiem.ts               # one-off, this session only
 */

import { execFile } from "node:child_process";
import { promisify } from "node:util";
import type {
	ExtensionAPI,
	AgentToolResult,
} from "@earendil-works/pi-coding-agent";
import { Type } from "typebox";

const execFileAsync = promisify(execFile);
const KIEM = process.env.KIEM_BIN || "kiem";

/** Run `kiem --json <args>` without a shell (args are passed verbatim). */
async function runKiem(args: string[]): Promise<{ ok: boolean; text: string }> {
	try {
		const { stdout } = await execFileAsync(KIEM, ["--json", ...args], {
			maxBuffer: 16 * 1024 * 1024,
		});
		return { ok: true, text: stdout.trim() };
	} catch (e) {
		const err = e as { stderr?: string; message?: string; syscall?: string };
		const stderr = (err.stderr || "").toString().trim();
		// A spawn-level failure (ENOENT/EACCES/ENOTDIR...) means the binary can't be
		// run at all — tell the agent to install it rather than reconstruct state.
		const reason = err.syscall?.startsWith("spawn")
			? `\`${KIEM}\` is not runnable (${err.message}). Install the kiem CLI (Kiem app → Install Command Line Tool, or \`cargo install --path crates/kiem-cli\`) or set KIEM_BIN. Do NOT reconstruct project state from code — ask the user to install kiem.`
			: stderr || err.message || String(e);
		return { ok: false, text: reason };
	}
}

function toResult(
	r: { ok: boolean; text: string },
	whenEmpty = "(no output)",
): AgentToolResult<undefined> & { isError?: boolean } {
	if (!r.ok) {
		return {
			content: [{ type: "text", text: `kiem error: ${r.text}` }],
			details: undefined,
			isError: true,
		};
	}
	return {
		content: [{ type: "text", text: r.text || whenEmpty }],
		details: undefined,
	};
}

function noLeadingDash(value: string, label: string): string | undefined {
	if (value.startsWith("-")) {
		return `${label} cannot start with '-': ${value}`;
	}
	return undefined;
}

const projectParam = Type.Optional(
	Type.String({
		description: "Override the resolved project (a name or proj/<slug>)",
	}),
);
const typeParam = Type.Optional(
	Type.String({
		description:
			"Note kind: plan, brainstorm, review, solution, decision, doc (default: note)",
	}),
);

function validateOptionValue(
	value: string | undefined,
	label: string,
): string[] {
	if (!value) return [];
	const err = noLeadingDash(value, label);
	if (err) throw new Error(err);
	return [value];
}

export function noteAddArgs(params: {
	text: string;
	project?: string;
	type?: string;
}): string[] {
	return [
		"note",
		"add",
		...(params.project
			? ["--project", ...validateOptionValue(params.project, "project")]
			: []),
		...(params.type
			? ["--type", ...validateOptionValue(params.type, "type")]
			: []),
		"--",
		params.text,
	];
}

export default function kiemExtension(pi: ExtensionAPI) {
	pi.registerTool({
		name: "kiem_project_current",
		label: "Kiem: current project",
		description:
			"Resolve which Kiem project the current directory belongs to (the proj/<slug> tag). Errors if the repo isn't onboarded — then run kiem_project_add or ask the user.",
		promptSnippet:
			"Identify the Kiem project for the cwd before reading or writing project state.",
		parameters: Type.Object({}),
		async execute() {
			return toResult(await runKiem(["project", "current"]));
		},
	});

	pi.registerTool({
		name: "kiem_todos",
		label: "Kiem: open todos",
		description:
			"List the current Kiem project's open todos as JSON: [{note_id, index, text}]. The (note_id, index) pairs are the addresses you pass to kiem_todo_set.",
		promptSnippet:
			"Read the project's open task list from Kiem instead of inferring tasks from the code.",
		parameters: Type.Object({ project: projectParam }),
		async execute(_id, params) {
			const args = [
				"todos",
				...(params.project ? ["--project", params.project] : []),
			];
			return toResult(await runKiem(args), "[]");
		},
	});

	pi.registerTool({
		name: "kiem_notes",
		label: "Kiem: project notes",
		description:
			"List the current Kiem project's notes as JSON (decisions, context, plans, learnings). Pass `type` to list only one kind (e.g. plan). Use kiem_show to read a note's full body.",
		promptSnippet:
			"Read the project's notes from Kiem as ground truth for context and prior decisions.",
		parameters: Type.Object({ project: projectParam, type: typeParam }),
		async execute(_id, params) {
			const args = [
				"notes",
				...(params.project ? ["--project", params.project] : []),
				...(params.type ? ["--type", params.type] : []),
			];
			return toResult(await runKiem(args), "[]");
		},
	});

	pi.registerTool({
		name: "kiem_show",
		label: "Kiem: show note",
		description: "Show one Kiem note (metadata + full body) by its note id.",
		parameters: Type.Object({
			note_id: Type.String({
				description: "Note id from kiem_todos / kiem_notes",
			}),
		}),
		async execute(_id, params) {
			return toResult(await runKiem(["show", params.note_id]));
		},
	});

	pi.registerTool({
		name: "kiem_note_add",
		label: "Kiem: add note",
		description:
			"Add a note to the current Kiem project (auto-tagged proj/<slug>). The first line becomes the title; include `- [ ]` lines to create todos. Pass `type` to mark it a plan/brainstorm/review/etc so it groups by kind. Use this to record decisions, findings, and progress so they sync to other agents and devices.",
		promptSnippet:
			"Record decisions, findings, and new task lists back into Kiem.",
		promptGuidelines: [
			"Keep each note small and purposeful — one decision or task list per note.",
		],
		parameters: Type.Object({
			text: Type.String({
				description: "Markdown note text; the first line is the title",
			}),
			project: projectParam,
			type: typeParam,
		}),
		async execute(_id, params) {
			return toResult(await runKiem(noteAddArgs(params)));
		},
	});

	pi.registerTool({
		name: "kiem_todo_add",
		label: "Kiem: add todo",
		description:
			"Append a new open todo to an existing note in one step. Use this to add a task — do NOT read the note and rewrite its whole body. The item is placed after the note's last checkbox; pass plain text (no `- [ ]` prefix needed).",
		promptSnippet:
			"Add a task to a Kiem note with a single call instead of rewriting the note body.",
		parameters: Type.Object({
			note_id: Type.String({
				description:
					"Note to append the todo to (from kiem_todos / kiem_notes)",
			}),
			text: Type.String({
				description: "The task text, e.g. 'Wire up live sync refresh'",
			}),
		}),
		async execute(_id, params) {
			const err = noLeadingDash(params.text, "todo text");
			if (err) return toResult({ ok: false, text: err });
			return toResult(
				await runKiem(["todo", "add", params.note_id, "--", params.text]),
			);
		},
	});

	pi.registerTool({
		name: "kiem_edit_lines",
		label: "Kiem: edit lines",
		description:
			"Replace a 1-based inclusive line range of a note's body with new text (targeted, multibyte-safe). Read the note with kiem_show first to get line numbers and its `version`, pass that version as expect_version, and the edit is rejected if the note changed since — so you never clobber a concurrent change. Prefer this over rewriting the whole body. Empty replacement deletes the range.",
		promptSnippet:
			"Make a targeted line edit to a Kiem note instead of rewriting its whole body.",
		promptGuidelines: [
			"Call kiem_show immediately before this to get the note body and version token.",
			"kiem_show does not return line numbers; derive the 1-based start/end range by counting lines in the body or by piping `kiem show <id>` through `cat -n`.",
			"Pass expect_version so a concurrent change can't be clobbered.",
		],
		parameters: Type.Object({
			note_id: Type.String({
				description: "Note to edit (from kiem_show / kiem_notes)",
			}),
			start: Type.Integer({
				description: "First line to replace (1-based, inclusive)",
			}),
			end: Type.Integer({
				description:
					"Last line to replace (1-based, inclusive; = start for one line)",
			}),
			text: Type.String({
				description:
					"Replacement text; may be multi-line; empty deletes the range",
			}),
			expect_version: Type.Optional(
				Type.String({
					description:
						"The `version` from kiem_show; rejects the edit if the note changed since",
				}),
			),
		}),
		async execute(_id, params) {
			const err = noLeadingDash(params.text, "edit text");
			if (err) return toResult({ ok: false, text: err });
			const args = [
				"edit-lines",
				params.note_id,
				String(params.start),
				String(params.end),
				"--text",
				params.text,
			];
			if (params.expect_version)
				args.push(
					"--expect",
					...validateOptionValue(params.expect_version, "expect_version"),
				);
			return toResult(await runKiem(args));
		},
	});

	pi.registerTool({
		name: "kiem_todo_set",
		label: "Kiem: check/uncheck todo",
		description:
			"Check or uncheck a todo by its (note_id, index) address from kiem_todos. Indices are positional within a note.",
		promptGuidelines: [
			"Always call kiem_todos immediately before this — the note may have changed on another device and a stale index can toggle the wrong item.",
		],
		parameters: Type.Object({
			note_id: Type.String({ description: "The todo's note id" }),
			index: Type.Integer({
				description: "The todo's positional index within the note",
			}),
			checked: Type.Boolean({
				description: "true to check (done), false to uncheck",
			}),
		}),
		async execute(_id, params) {
			const verb = params.checked ? "check" : "uncheck";
			return toResult(
				await runKiem(["todo", verb, params.note_id, String(params.index)]),
			);
		},
	});

	pi.registerTool({
		name: "kiem_project_add",
		label: "Kiem: onboard project",
		description:
			"Onboard the current directory as a Kiem project: writes the committed .kiem marker, adds an AGENTS.md pointer, and creates a home note. Idempotent. Only run when kiem_project_current errors or the user asks.",
		parameters: Type.Object({
			name: Type.String({
				description: "Human project name; slugified to proj/<slug>",
			}),
		}),
		async execute(_id, params) {
			const err = noLeadingDash(params.name, "project name");
			if (err) return toResult({ ok: false, text: err });
			return toResult(await runKiem(["project", "add", "--", params.name]));
		},
	});
}
