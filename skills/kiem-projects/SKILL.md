---
name: kiem-projects
description: >-
  Work on a software project whose notes, todos, and progress live in Kiem (a P2P
  notes store) instead of scattered across the repo. Use at the start of any
  session in a repo that contains a `.kiem` marker, or when the user mentions Kiem
  project state, project todos, or asks you to record/track progress in Kiem. The
  interface is the `kiem` CLI; project state is shared across agents, machines, and
  the Kiem app.
---

# Kiem projects

Kiem is the project's shared memory. Its notes and todos sync across machines and
are readable by any agent and by the human (in the Kiem GUI). When you work in a
Kiem-bound repo, **read project state from `kiem` first** — do not reconstruct it
from code or `CLAUDE.md` — and **record progress back into `kiem`** so the next
agent (or the human on another device) picks up where you left off.

A project is the reserved tag `proj/<slug>`. A repo declares its project in a
committed `.kiem` marker; the CLI resolves the current project from it
automatically. You rarely type the tag — just run `kiem` from inside the repo.

## At the start of a session

1. Confirm the project: `kiem project current` (prints `proj/<slug>`). It falls
   back to the directory name even without a committed `.kiem` marker, so also
   check the marker exists (`.kiem` in the repo root) — no marker means not
   onboarded yet, even if this doesn't error. See **kiem-onboard**.
2. Read the state instead of re-deriving it:
   - `kiem todos` — the open task list (each line: `<note-id>  <index>  <text>`).
   - `kiem notes` — the project's notes (decisions, context, plans, learnings).
   - `kiem show <note-id>` — the full body of any note.

   Add `--json` to any read for structured output.

That is your ground truth for "what is this project and what's left."

## While working

- Complete a task: `kiem todo check <note-id> <index>` (undo with `uncheck`).
  Addresses come straight from `kiem todos`. Indices are positional within a note,
  so **re-run `kiem todos` immediately before acting** if the note may have changed
  (another device or the app may have edited it; a stale index can toggle the wrong
  item).
- Add a single task to an existing note: `kiem todo add <note-id> "<text>"`. It
  appends one `- [ ]` item in one step — **do not** read the note and rewrite its
  whole body to add a todo (that is slow and corrupts formatting).
- Change an existing line (edit wording, restructure): `kiem edit-lines <note-id>
  <start> <end> --text "<new lines>"`. `kiem show <note-id>` prints 1-based line
  numbers and a `version`; pass `--expect <version>` so the edit is rejected if
  the note changed since you read it. Prefer this over rewriting the whole body.
- Record a decision, finding, or new plan: `kiem note add "<markdown text>"`. The
  note is tagged into the current project automatically. The first line is the
  title; include `- [ ]` lines to add new todos.
- For longer working docs — plans, brainstorms, reviews, learnings — add
  `--type <kind>` (`plan`, `brainstorm`, `review`, `solution`, `decision`, `doc`),
  or the `type` param on `kiem_note_add`, so they group by kind in the app. Read
  one kind back with `kiem notes --type <kind>`.
- Keep notes small and purposeful — one decision or task list per note — so the
  human can scan them in the app.

## Notes

- The interface is the CLI; everything you write syncs to the user's other devices
  within moments — treat notes as user-visible.
- **Under Pi:** if the Kiem extension is installed, prefer its native tools
  (`kiem_todos`, `kiem_notes`, `kiem_show`, `kiem_note_add`, `kiem_todo_add`,
  `kiem_todo_set`, `kiem_edit_lines`, `kiem_project_current`) — they are the same
  operations as first-class tool calls.
  The shell commands above are the equivalent for any other agent.
- This skill is an agent-agnostic contract: any tool that can run `kiem` can
  participate. The durable spec lives in the kiem-app repo at
  `docs/specs/kiem-project-marker.md`.
