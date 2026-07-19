---
name: debug
description: >-
  Systematically root-cause a bug in a Kiem-bound project and record the finding
  as a Kiem `solution`/`decision` note. Use when debugging errors, test failures,
  or unexpected behavior, or when the user says "debug this", "why is this
  failing", or pastes a stack trace, in a repo with a `.kiem` marker.
---

# Kiem debug

Find the **root cause** (not the symptom), fix it once, and leave the lesson in
Kiem so it isn't re-learned next time.

## 1. Check memory first

`kiem notes --type solution` (and `--type decision`) — has this class of bug been
solved before? Reuse the fix rather than re-deriving it.

## 2. Root-cause it

- Reproduce reliably; form a hypothesis and verify by **predicting** behavior, not
  guessing. Confirm the mechanism before editing.
- Fix at the root: one guard where all callers route through, not a patch per
  caller. Never weaken, skip, or mock a test that checks a real thing — fix the
  issue.

## 3. Record in Kiem

If the root cause was non-obvious or will bite again, capture it:
`kiem note add --type solution "<problem / root cause / fix / how to avoid>"`
(or hand off to **compound**). Add any follow-up work with
`kiem todo add <note-id> "<text>"`.

## Live conversation

For every Kiem note write, report one line as
`Kiem: <status> | <type> | <title> | kiem://note/<id>`. Use `stored`, `updated`,
`removed`, `not stored`, `unknown`, `declined`, or `skipped`; use `—` when no
note exists. Use only tool-returned titles and IDs; render the id as a
`kiem://note/<id>` reference so it is cmd+clickable in the terminal. Commands
still accept either a bare id or a full reference. On read failure, report
`unknown`, stop, and do not invent note content. After recording or declining,
briefly summarize the symptom, verified root cause, fix, validation, and
remaining work.

## Notes

- **Under Pi:** `kiem_notes` / `kiem_note_add` (type `solution`) / `kiem_todo_add`.
- Keep the note small — the reusable lesson, not a transcript of the hunt.
