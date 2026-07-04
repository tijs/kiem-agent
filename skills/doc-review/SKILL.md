---
name: doc-review
description: >-
  Review a plan or brainstorm note that lives in Kiem with a lean lens set, and
  record findings back into the note or as todos. Use before executing a plan, or
  when the user asks to review/critique a plan or requirements note, in a repo
  with a `.kiem` marker.
---

# Kiem doc review

Give a `plan` or `brainstorm` note a critical pass **before** it's executed, and
fold the findings back into Kiem.

## 1. Target the doc
- `kiem notes --type plan` (or `--type brainstorm`) to find it; **ask** if it's
  unclear which. `kiem show <note-id>` for the full text with line numbers + a
  `version` token.

## 2. Lenses (lean — 2–3, no persona sprawl)
- **coherence** — internal contradictions, terminology drift, ambiguity where
  readers would diverge.
- **feasibility** — will this survive contact with the actual code? missing
  dependencies, wrong assumptions, unimplementable steps.
- **scope** — unjustified complexity, premature abstraction, missing non-goals.

## 3. Record findings
Amend the note surgically — `kiem edit-lines <id> <start> <end> --text "…"
--expect <version>` — or add `- [ ]` todos for gaps to resolve. Keep it targeted;
don't rewrite the whole doc.

## Notes
- **Under Pi:** `kiem_show` / `kiem_edit_lines` (pass `expect_version`) / `kiem_todo_add`.
- Prefer a few sharp observations over an exhaustive checklist — signal per token.
