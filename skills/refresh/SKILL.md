---
name: refresh
description: >-
  Audit and reorganize a Kiem project's long-term memory — stale `solution` and
  `decision` notes — keeping it accurate and lean. Use when the memory has drifted
  or on request ("clean up learnings", "refresh the notes"), in a repo with a
  `.kiem` marker.
---

# Kiem refresh

Keep the project's long-term memory (its `solution`, `decision`, and `brainstorm`
notes) true to the current code and free of clutter. Memory has a carrying cost —
prefer deleting and merging over accumulating.

## 1. Review

`kiem notes --type solution` (then `--type decision`) — read each with
`kiem show <id>` and check it against the current codebase.

## 2. Act, per note

- **Outdated / wrong** — update it (`kiem edit-lines <id> <start> <end> --text "…"
  --expect <version>`) or trash it if it no longer applies.
- **Overlapping** — consolidate several near-duplicates into one clear note; trash
  the rest.
- **Still true** — leave it.

## 3. Report

Summarize what changed (updated / merged / removed) so the human can eyeball it.

## Live conversation

For every Kiem note update or removal, report one line as
`Kiem: <status> | <type> | <title> | kiem://note/<id>`. Use `updated`, `removed`,
`not stored`, `unknown`, or `skipped`; use `—` when no note exists. Use only
tool-returned titles and IDs; render the id as a `kiem://note/<id>` reference so
it is cmd+clickable in the terminal. Commands still accept either a bare id or a
full reference. Mark deleted/trash actions `removed`, not `stored`. On read
failure, report `unknown`, stop, and do not invent content. Then summarize
updated, merged, removed, unchanged, and remaining risks/todos.

## Notes

- **Under Pi:** `kiem_notes` / `kiem_show` / `kiem_edit_lines`.
- **Do not touch `plan` notes mid-execution** — work owns those.
- This is the long-term-memory janitor; it never changes code.
