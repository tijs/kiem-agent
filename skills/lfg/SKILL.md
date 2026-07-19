---
name: lfg
description: >-
  Run the whole Kiem-native loop end to end — brainstorm → plan → work → review →
  compound — brute-forcing a feature through with the lean skills, keeping all
  state in Kiem. Use only when the user explicitly asks for hands-off execution of
  a feature in a repo with a `.kiem` marker.
---

# Kiem lfg

Chain the Kiem-native skills into one pass. Every stage reads and writes project
state in Kiem, so the loop is resumable and visible in the app the whole way.

## The loop

1. **brainstorm** *(only if WHAT is unclear)* — write a `brainstorm` note.
2. **plan** — write a `plan` note; its `- [ ]` units become project todos.
3. **work** — execute; check todos, append `decision` notes as you go.
4. **review** — run the curated roster (cap 4); findings become `- [ ]` todos.
5. **Resolve review todos** — loop back to work until the review is clean or a
   bounded number of rounds is reached; record what you couldn't fix.
6. **compound** — capture any hard-won learning as a `solution` note.

## Rules

- **Token-economical:** lean skills, inline work, no fan-out except review
  (cap 4). Don't escalate agent counts to brute-force — brute-force the *loop*,
  not the parallelism.
- **Stop and ask** when a plan is genuinely ambiguous (which plan?), or a
  decision is the user's to make. Autonomy is for execution, not for choosing
  direction.
- **Stays out of release:** commit / push / PR / CI belong to the harness + git,
  not this loop. lfg owns Kiem state (plans, todos, decisions, reviews,
  learnings), nothing in the repo dir.

## Live conversation

For every Kiem note write or todo mutation, report one line as
`Kiem: <status> | <type> | <title> | kiem://note/<id>`. Use `stored`, `updated`,
`removed`, `not stored`, `unknown`, `declined`, or `skipped`; use `—` when no
note exists. Use only tool-returned titles and IDs; render the id as a
`kiem://note/<id>` reference so it is cmd+clickable in the terminal. Commands
still accept either a bare id or a full reference. On read failure, report
`unknown`, stop, and do not invent content. Emit one brief update per attempted
stage, including work-stage todo checks, plan status edits, and decision/progress
notes. Report skipped brainstorms explicitly, then finish with one roll-up of
key findings and remaining work.

## Notes

- Under Pi, each stage prefers its native `kiem_*` tools; the skills above describe
  the shell equivalents for any other agent.
