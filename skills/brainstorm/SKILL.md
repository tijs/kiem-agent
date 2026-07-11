---
name: brainstorm
description: >-
  Explore requirements for a feature through dialogue and save a lean requirements
  note (type `brainstorm`) in Kiem. Use when the user wants to think through WHAT
  to build before planning, presents a vague or ambitious idea, or is unsure about
  scope, in a repo with a `.kiem` marker.
---

# Kiem brainstorm

Figure out **what** to build and why (plan handles *how*). The output is a
lean `brainstorm` note in Kiem, tagged to the project.

## 1. Read state first
- `kiem project current`; `kiem notes --type brainstorm` (existing requirements to
  extend); `kiem notes` (decisions and context that constrain the idea).

## 2. Explore (lean dialogue)
Ask **one question at a time**: problem → who it's for and the value → scope and
non-goals → success criteria. Bring alternatives and challenge assumptions; don't
just extract. Stop when the idea is clear enough to plan.

## 3. Save it
Write the note to a file, then `kiem note add --type brainstorm --file note.md` —
`--file` keeps a body with backticks or `$(...)` intact (inlining raw markdown as a
quoted argument lets the shell interpolate it). Cover the problem frame, who
benefits and what changes for them, scope boundaries (explicit non-goals), success
criteria, and any open questions. Keep implementation choices out — that's planning.

## Notes
- **Under Pi:** `kiem_notes` / `kiem_note_add` with `type: "brainstorm"`.
- Hand off to **plan**, which reads this note back from Kiem.
