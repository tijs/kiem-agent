---
name: introspect
description: >-
  Maintainer-only retro for the Kiem skills themselves. Use after a messy or
  instructive agent run to inspect the conversation and available logs, extract
  skill/process pain points, and record improvement todos in the `proj/kiem_agent`
  Kiem project. Record-only: do not edit skills or run a fixer loop.
---

# Kiem introspect

Look at an agent run and harvest improvements for the **Kiem skills**, not for the
current product project. This is for the maintainer of this skill package.

## When

After a run where the skills or tools were awkward: failed tool calls, retries,
workarounds, unclear handoffs, missing guardrails, ambiguous instructions, or
errors that should be made harder to repeat.

Skip clean runs and ordinary project learnings — those belong in **compound** or
the current project's notes.

## 1. Gather evidence

Use concrete evidence only. Prefer, in order:

- the current conversation context
- an explicit pasted transcript, session id/query, or run/log path from the user
- `session_search` for named past conversations
- readable subagent/run artifacts mentioned in the conversation

If logs are unavailable, say so and use only the transcript. Do not invent
failure modes from vibes.

## 2. Extract skill pain points

For each real pain point, capture:

- **Symptom** — what happened in the conversation/log.
- **Evidence** — quote or summarize the failed call, retry, detour, or error.
- **Skill gap** — which skill instruction was missing, misleading, or too weak.
- **Improvement todo** — the smallest change that would prevent or shorten it.
- **Confidence** — high/medium/low, based on how direct the evidence is.

Prefer one root-cause todo over several symptoms.

## 3. Record in `proj/kiem_agent`

Before writing, check existing Kiem-agent notes/todos so you do not duplicate a
known item.

Write one `review` note to the Kiem-agent project, regardless of the current repo:

```text
Introspection: <run / topic / date>

## Source
<conversation/session/log references used>

## Findings
- <short prose finding>

## Improvement todos
- [ ] <actionable skill improvement, naming the skill/file if known>
```

## Notes

- **Under Pi:** use `kiem_notes(project: "proj/kiem_agent")`,
  `kiem_todos(project: "proj/kiem_agent")`, then `kiem_note_add` with
  `type: "review"` and `project: "proj/kiem_agent"`.
- Record-only by default: do **not** edit skill files, run work, or launch a fixer
  loop unless the user explicitly asks.
- Keep it small. A single high-signal todo beats a retro essay.
