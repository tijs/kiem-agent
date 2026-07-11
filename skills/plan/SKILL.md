---
name: plan
description: >-
  Produce a lean implementation plan for a feature in a Kiem-bound project and
  save it as a Kiem `plan` note (tagged proj/<slug>). Reads current project state
  from Kiem first — existing plans, decisions, open todos — instead of re-deriving
  from code. Use when the user asks to plan or design a feature, "how should we
  build X", or right after a brainstorm, in a repo that has a `.kiem` marker.
  Token-economical: no large agent fan-out.
---

# Kiem plan

The plan is a Kiem **note**, not a repo file. It lives in Kiem tagged
`proj/<slug>`, so it syncs across machines, is editable in the Kiem app, and the
next agent reads it from Kiem — nothing is written to the project directory.

## 1. Read the state first (don't re-derive from code)
- `kiem project current --json` — confirm the project (`proj/<slug>`); if
  `onboarded` is `false`, the repo isn't onboarded — see **onboard**.
- `kiem notes --type plan` — existing plans (extend one rather than duplicate).
- `kiem notes` — decisions, context, prior learnings.
- `kiem todos` — what's already open.

That is your ground truth. Do at most **one** repo-research pass if the code
itself must be inspected — no multi-agent fan-out for planning.

## 2. Write a lean plan
Keep it decision-dense, not ceremonial. Cover:
- **Goal / problem** and why now.
- **Approach + key decisions** (with rationale), and **scope boundaries** (non-goals).
- **Implementation units** — each a `- [ ]` line so it becomes a project todo.
- **Test scenarios** per feature-bearing unit (specific inputs/outcomes).

## 3. Save it to Kiem
Prefix the markdown with a `status: active` frontmatter fence, then the title
on the next line:
```
---
status: active
---
Plan: <title>
...
```
Write the plan to a file, then `kiem note add --type plan --file plan.md` —
`--file` keeps a body with backticks or `$(...)` intact (inlining raw markdown as a
quoted argument lets the shell interpolate it). The title is still the first
content line (frontmatter doesn't count), and the `- [ ]` unit lines become
open project todos automatically. Keep the plan focused; split genuinely
separate efforts into separate plan notes.

The frontmatter is plain markdown the Kiem app already renders as a callout
and surfaces in its status bar/sidebar — not a Kiem-specific field. `active`/
`completed` matches this user's existing convention across their other repos;
**work** flips it to `completed` when the plan's units are all done.

## Notes
- **Under Pi:** prefer the native tools — `kiem_notes` (with `type`), `kiem_todos`,
  `kiem_note_add` (with `type: "plan"`). The shell commands are the equivalent for
  any other agent.
- Hand off to **work** to execute the plan; it reads this note back from Kiem.
- Do not spin up reviewer/critic subagents here — planning is a single focused pass.
