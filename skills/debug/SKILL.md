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
  caller. Never weaken, skip, or mock a test that checks a real thing — fix the issue.

## 3. Record in Kiem
If the root cause was non-obvious or will bite again, capture it:
`kiem note add --type solution "<problem / root cause / fix / how to avoid>"`
(or hand off to **compound**). Add any follow-up work with
`kiem todo add <note-id> "<text>"`.

## Notes
- **Under Pi:** `kiem_notes` / `kiem_note_add` (type `solution`) / `kiem_todo_add`.
- Keep the note small — the reusable lesson, not a transcript of the hunt.
