# Kiem project (GitHub Copilot)

Copy this into `.github/copilot-instructions.md` in a Kiem-bound repo so Copilot
Chat reads project state from Kiem instead of inferring it from the code.

---

This repository's task list, decisions, and progress live in **Kiem** (a synced
notes store), accessed through the `kiem` CLI — not in the repo's files.

- Read state first: run `kiem project current`, then `kiem todos` and `kiem notes`
  (append `--json` for machine-readable output).
- Record progress: `kiem note add "<markdown>"` for decisions/plans; complete a
  task with `kiem todo check <note-id> <index>` (re-run `kiem todos` first, since
  indices are positional and the note may have changed on another device).
