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

## Notes
- **Under Pi:** `kiem_notes` / `kiem_show` / `kiem_edit_lines`.
- **Do not touch `plan` notes mid-execution** — work owns those.
- This is the long-term-memory janitor; it never changes code.
