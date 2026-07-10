/**
 * Smoke test for the Kiem Pi extension — no LLM, no store mutation.
 *
 * Loads the extension against a mock Pi, asserts every tool registers, then
 * exercises the register + execute paths against the REAL `kiem` binary
 * (success/read + error). typebox (a value import in kiem.ts) is resolved from
 * Pi's bundled node_modules via NODE_PATH.
 *
 * Run (adjust the two paths to your machine):
 *
 *   PKG="$(npm root -g)/@earendil-works/pi-coding-agent"
 *   KIEM_BIN="$(command -v kiem)" NODE_PATH="$PKG/node_modules" npx tsx pi/kiem.test.mts
 *
 * Exits non-zero on any failure.
 */

const EXPECTED = [
	"kiem_edit_lines",
	"kiem_note_add",
	"kiem_notes",
	"kiem_project_add",
	"kiem_project_current",
	"kiem_show",
	"kiem_todo_add",
	"kiem_todo_set",
	"kiem_todos",
].sort();

async function main() {
	const mod: any = await import("./kiem.ts");
	const kiemExtension = mod.default?.default ?? mod.default ?? mod;
	const noteAddArgs = mod.noteAddArgs ?? mod.default?.noteAddArgs;
	if (typeof kiemExtension !== "function")
		throw new Error("extension default export is not a function");
	if (typeof noteAddArgs !== "function")
		throw new Error("noteAddArgs export is not a function");

	const frontmatter = "---\nstatus: active\n---\nPlan: test";

	for (const [label, params, expected] of [
		["text only", { text: frontmatter }, ["note", "add", "--", frontmatter]],
		[
			"with project",
			{ text: frontmatter, project: "proj/kiem_agent" },
			["note", "add", "--project", "proj/kiem_agent", "--", frontmatter],
		],
		[
			"with type",
			{ text: frontmatter, type: "plan" },
			["note", "add", "--type", "plan", "--", frontmatter],
		],
		[
			"with project and type",
			{ text: frontmatter, project: "proj/kiem_agent", type: "plan" },
			[
				"note",
				"add",
				"--project",
				"proj/kiem_agent",
				"--type",
				"plan",
				"--",
				frontmatter,
			],
		],
	] as const) {
		const actual = noteAddArgs(params as any);
		if (JSON.stringify(actual) !== JSON.stringify(expected)) {
			throw new Error(
				`${label}: expected ${JSON.stringify(expected)}, got ${JSON.stringify(actual)}`,
			);
		}
	}

	// Leading-dash project/type should be rejected before invoking kiem.
	for (const [label, params] of [
		["bad project", { text: "x", project: "--evil" }],
		["bad type", { text: "x", type: "--evil" }],
	] as const) {
		try {
			noteAddArgs(params as any);
			throw new Error(`${label}: should have thrown for leading-dash value`);
		} catch (e: any) {
			if (!e.message.includes("cannot start with '-'")) throw e;
		}
	}

	const tools: any[] = [];
	const pi: any = {
		registerTool: (d: any) => tools.push(d),
		registerCommand: () => {},
		registerFlag: () => {},
		on: () => {},
	};
	kiemExtension(pi);

	const names = tools.map((t) => t.name).sort();
	const missing = EXPECTED.filter((n) => !names.includes(n));
	if (missing.length) throw new Error(`missing tools: ${missing.join(", ")}`);
	for (const t of tools) {
		if (!t.parameters || typeof t.execute !== "function")
			throw new Error(`bad tool: ${t.name}`);
	}

	const byName: any = Object.fromEntries(tools.map((t) => [t.name, t]));
	const call = (n: string, p: any) =>
		byName[n].execute("t", p, undefined, undefined, {});

	const todos = await call("kiem_todos", {});
	if (todos.isError)
		throw new Error(`kiem_todos errored: ${todos.content[0].text}`);

	const bad = await call("kiem_show", { note_id: "does-not-exist-zzz" });
	if (!bad.isError)
		throw new Error("kiem_show with a bogus id should be an error result");

	console.log(
		`OK: ${names.length} tools register; success + error paths wired to the kiem binary.`,
	);
}

main().catch((e) => {
	console.error("FAIL:", e.message);
	process.exit(1);
});
