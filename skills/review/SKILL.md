---
name: review
description: >-
  Review the current changes in a Kiem-bound project with a lean, curated set of
  reviewer lenses, and record findings as a Kiem `review` note plus actionable
  `- [ ]` todos. Use before merging, after finishing a unit, or when the user asks
  for a code review in a repo with a `.kiem` marker. Token-economical: a small
  roster capped at 4 concurrent, right-sized to the diff — not 18 personas.
---

# Kiem review

Review the diff, then record what matters **in Kiem** so findings flow straight
into the project's Todo filter and the next work pass.

## 1. Scope the diff

Determine what changed (e.g. `git diff` against the base branch, plus untracked
files). Right-size the roster to what the diff actually touches.

## 2. Roster (lean — cap 4 concurrent)

Always run the **core three**; add a conditional lens only when the diff touches
its area. Each lens is one focused reviewer; run at most 4 at once.

- **Core (always):** correctness · tests · simplicity (ponytail — flag over-engineering).
  For a docs/prose-only diff (skill files, specs, READMEs — no executable
  surface), reinterpret the tests lens as a verification/edge-case audit of
  the described procedure instead: failure paths, ambiguous branches,
  internal contradictions between sections.
- **Conditional (fire only on a match):**
  - **cross-language parity** — `content.rs`, Pulp's `ContentAnalyzer`, or
    `fixtures/*` changed: verify the Rust and Swift derivations stay byte-identical
    and the shared fixture covers the change.
  - **rust idioms** — `crates/**` changed: clippy-clean, no `unwrap`/`expect` in
    library code, ownership, regex/scalar-index gotchas.
  - **swift / swiftui** — `apple/**` or `pulp/**` changed: `@MainActor`/`@Observable`
    correctness, concurrency, memory, view state.
  - **security** — FFI boundary, P2P/sync, or input parsing touched.

Don't add lenses beyond these; don't run a lens whose area the diff doesn't touch.

## 3. Record findings in Kiem

- Write one `review` note: `kiem note add --type review "<summary + findings>"`.
- **Auto-open the actionable findings as todos** — include `- [ ]` lines in that
  note (they become project todos), or `kiem todo add <note-id> "<fix>"`. This is
  the decided behavior: findings flow into the Todo filter, not an advisory-only
  list.
- Keep advisory/nits in the review note prose; only real fixes become todos.

## Notes

- **Under Pi:** use `kiem_note_add` (with `type: "review"`) and `kiem_todo_add`;
  spawn reviewer lenses with your platform's subagent mechanism, capped at 4.
  Pass `reads: false` to Pi's builtin reviewer because plans live in Kiem, not
  repo-local `plan.md` / `progress.md` files.
- **Under Claude Code:** launch lenses as concurrent subagents. Before fan-out,
  validate available agent names with `subagent action: "list"`; reuse the
  built-in `reviewer` agent with task-specific prompts instead of inventing
  lens-specific agent names.
- **Under Claude Code:** Do **not** use the `Monitor` tool to watch them unless
  you have first loaded its schema with `ToolSearch` and you pass the required
  `description`, `timeout_ms` (milliseconds, not `wait_minutes`), and
  `persistent` fields. Prefer letting the subagent call itself wait and return
  results inline.
- Prefer fewer, sharper reviewers over many shallow ones — the point is signal
  per token.
