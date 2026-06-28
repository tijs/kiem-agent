/**
 * Kiem extension for Pi.
 *
 * Exposes the `kiem` CLI as native Pi tools so an agent reads and maintains a
 * project's shared state (notes + todos, synced across machines and agents)
 * as first-class tool calls instead of ad-hoc shell commands. Pairs with the
 * `kiem-projects` skill, which explains *when* to use these tools.
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
import type { ExtensionAPI, AgentToolResult } from "@earendil-works/pi-coding-agent";
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
		const err = e as { stderr?: string; message?: string; code?: string };
		const stderr = (err.stderr || "").toString().trim();
		const reason = err.code === "ENOENT"
			? `\`${KIEM}\` not found on PATH. Install it from the Kiem app (Install Command Line Tool) or set KIEM_BIN.`
			: stderr || err.message || String(e);
		return { ok: false, text: reason };
	}
}

function toResult(r: { ok: boolean; text: string }, whenEmpty = "(no output)"): AgentToolResult {
	if (!r.ok) {
		return { content: [{ type: "text", text: `kiem error: ${r.text}` }], isError: true };
	}
	return { content: [{ type: "text", text: r.text || whenEmpty }] };
}

const projectParam = Type.Optional(
	Type.String({ description: "Override the resolved project (a name or proj/<slug>)" }),
);

export default function kiemExtension(pi: ExtensionAPI) {
	pi.registerTool({
		name: "kiem_project_current",
		label: "Kiem: current project",
		description:
			"Resolve which Kiem project the current directory belongs to (the proj/<slug> tag). Errors if the repo isn't onboarded — then run kiem_project_add or ask the user.",
		promptSnippet: "Identify the Kiem project for the cwd before reading or writing project state.",
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
		promptSnippet: "Read the project's open task list from Kiem instead of inferring tasks from the code.",
		parameters: Type.Object({ project: projectParam }),
		async execute(_id, params) {
			const args = ["todos", ...(params.project ? ["--project", params.project] : [])];
			return toResult(await runKiem(args), "[]");
		},
	});

	pi.registerTool({
		name: "kiem_notes",
		label: "Kiem: project notes",
		description:
			"List the current Kiem project's notes as JSON (decisions, context, plans, learnings). Use kiem_show to read a note's full body.",
		promptSnippet: "Read the project's notes from Kiem as ground truth for context and prior decisions.",
		parameters: Type.Object({ project: projectParam }),
		async execute(_id, params) {
			const args = ["notes", ...(params.project ? ["--project", params.project] : [])];
			return toResult(await runKiem(args), "[]");
		},
	});

	pi.registerTool({
		name: "kiem_show",
		label: "Kiem: show note",
		description: "Show one Kiem note (metadata + full body) by its note id.",
		parameters: Type.Object({
			note_id: Type.String({ description: "Note id from kiem_todos / kiem_notes" }),
		}),
		async execute(_id, params) {
			return toResult(await runKiem(["show", params.note_id]));
		},
	});

	pi.registerTool({
		name: "kiem_note_add",
		label: "Kiem: add note",
		description:
			"Add a note to the current Kiem project (auto-tagged proj/<slug>). The first line becomes the title; include `- [ ]` lines to create todos. Use this to record decisions, findings, and progress so they sync to other agents and devices.",
		promptSnippet: "Record decisions, findings, and new task lists back into Kiem.",
		promptGuidelines: ["Keep each note small and purposeful — one decision or task list per note."],
		parameters: Type.Object({
			text: Type.String({ description: "Markdown note text; the first line is the title" }),
			project: projectParam,
		}),
		async execute(_id, params) {
			const args = ["note", "add", ...(params.project ? ["--project", params.project] : []), params.text];
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
			index: Type.Integer({ description: "The todo's positional index within the note" }),
			checked: Type.Boolean({ description: "true to check (done), false to uncheck" }),
		}),
		async execute(_id, params) {
			const verb = params.checked ? "check" : "uncheck";
			return toResult(await runKiem(["todo", verb, params.note_id, String(params.index)]));
		},
	});

	pi.registerTool({
		name: "kiem_project_add",
		label: "Kiem: onboard project",
		description:
			"Onboard the current directory as a Kiem project: writes the committed .kiem marker, adds an AGENTS.md pointer, and creates a home note. Idempotent. Only run when kiem_project_current errors or the user asks.",
		parameters: Type.Object({
			name: Type.String({ description: "Human project name; slugified to proj/<slug>" }),
		}),
		async execute(_id, params) {
			return toResult(await runKiem(["project", "add", params.name]));
		},
	});
}
