---
name: compound
description: >-
  Document a just-solved problem as a Kiem `solution` note so the project's
  long-term memory compounds instead of scattering into repo files. Use right
  after fixing a non-trivial bug, resolving a tricky integration, or making a
  decision worth remembering, in a repo with a `.kiem` marker.
---

# Kiem compound

Turn a solved problem into durable, searchable project memory — a Kiem `solution`
note tagged to the project, so the next agent (or you, on another machine) finds
it instead of re-solving it.

## When

After something non-obvious was solved: a subtle bug, a root cause that took real
digging, a gotcha that will bite again, a decision with non-obvious rationale.
Skip it for trivial fixes — memory has a carrying cost too.

If the recent run solved more than one non-trivial problem, list the candidates
and ask which to compound. Do not guess.

## Capture (small and purposeful)

One note, covering:

- **Problem** — the symptom, briefly.
- **Root cause** — what was actually wrong (the part worth remembering).
- **Fix** — what resolved it.
- **How to avoid / detect next time** — the reusable lesson.

Write the note to a file, then `kiem note add --type solution --file solution.md` —
`--file` keeps a body with backticks or `$(...)` intact (inlining raw markdown as a
quoted argument lets the shell interpolate it). The first line is the title; keep
it scannable in the app.

## Notes

- **Under Pi:** use `kiem_note_add` with `type: "solution"`.
- Before writing, `kiem notes --type solution` to check an existing note already
  covers it — update rather than duplicate.
- One solution per note; link related ones by mentioning their titles.
