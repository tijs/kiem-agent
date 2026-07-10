---
name: work
description: >-
  Execute a plan that lives in Kiem and record all progress back into Kiem —
  check todos, append decisions, add new todos — for a repo with a `.kiem`
  marker. Reads the plan from Kiem, not from repo files. Use to implement or
  continue a planned feature, or when the user says "work on the plan", "build
  this", or "keep going". Token-economical: inline execution, no fan-out by default.
---

# Kiem work

Execute a plan whose state lives in Kiem, and keep that state current as you go so
the next agent (or the human on another device) picks up exactly where you left off.

## 1. Find and read the plan

- `kiem notes --type plan` — the project's plans. If one is clearly the target
  (context, most recent, the user named it), use it. **If it's ambiguous which
  plan to work on, ask** — don't guess.
- `kiem show <note-id>` — read the full plan. It returns the body and a
  `version` token you'll need for edits, but **not line numbers**; derive the
  1-based line range by counting lines in the body (or pipe `kiem show <id>`
  through `cat -n`).
- `kiem todos` — the open task list; `kiem notes` — prior decisions/context.

## 2. Execute

Work one unit at a time, following existing code patterns. Keep the implementation
inline; only for a genuinely large plan, hand a single unit to one serial subagent.
No parallel fan-out here.

## 3. Record progress in Kiem (the point)

- **Complete a task:** re-run `kiem todos` immediately before acting (indices are
  positional and may have shifted), then `kiem todo check <note-id> <index>`.
- **Record a decision or finding:** `kiem note add --type decision "<text>"`.
- **New work you discover:** `kiem todo add <note-id> "<text>"`.
- **Amend the plan surgically:** from `kiem show` derive the 1-based line
  numbers + `version`, then `kiem edit-lines <id> <start> <end> --text "…"
  --expect <version>`. Never
  rewrite the whole body — targeted edits are safe and cheap.
- **Finishing a plan:** once every implementation unit is checked off, if the
  plan note has a `status: active` frontmatter line, flip it to `status:
  completed` with the same `kiem edit-lines` surgical-edit approach. Skip this
  for older plans that predate the frontmatter convention — don't retrofit it
  unless asked.

## 4. Hand off

Report changed paths, validation results, remaining work, and git state: commit
(hash or uncommitted), push (pushed or local-only), and release (version or not
released). Do not commit, push, or release unless the user asked.

## Notes

- **Under Pi:** prefer native tools — `kiem_notes`, `kiem_show`, `kiem_todos`,
  `kiem_todo_set`, `kiem_todo_add`, `kiem_note_add` (with a `type`),
  `kiem_edit_lines` (pass `expect_version` to avoid clobbering concurrent
  edits).
- Everything you write to Kiem syncs to the user's other devices within moments —
  treat notes as user-visible; keep them small and purposeful.
- Reviewing the result is **review**, not this skill.
