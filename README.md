# kiem-agent

Agent integrations for [Kiem](https://github.com/tijs/kiem). They teach a coding
agent to read and maintain **project state — notes, todos, progress — from Kiem**
instead of reconstructing it from the repo on every session.

Kiem itself (the app + Rust core + `kiem` CLI) lives in the `kiem-app` repo. This
repo is optional: you can use Kiem without it. It exists only to make the
agent-facing side installable per ecosystem.

## The model

The **`kiem` CLI is the universal substrate.** Any agent that can run a shell can
participate: it reads `kiem todos` / `kiem notes` and records progress with
`kiem note add` / `kiem todo check`. A repo binds to a Kiem project via a committed
`.kiem` marker (see `kiem-app/docs/specs/kiem-project-marker.md`).

"Plugin" means something different in each ecosystem, so each integration is just a
thin wrapper that points its agent at that CLI:

| Agent | Mechanism | Install |
|-------|-----------|---------|
| **Claude Code** | Plugin / skill (this repo is a marketplace) | `/plugin marketplace add tijs/kiem-agent` → `/plugin install kiem-projects@kiem`. Or, without plugins: `npx openskills install <path-to>/skills/kiem-projects` |
| **Codex** (or any `AGENTS.md` reader) | `AGENTS.md` pointer | Already written into each repo by `kiem project add`; the canonical text is `integrations/AGENTS.md.snippet` |
| **GitHub Copilot** | Repo custom instructions | Copy `integrations/copilot-instructions.md` into a repo's `.github/copilot-instructions.md` |
| **Pi** | Extension (planned) / `AGENTS.md` | See `integrations/pi.md` |

Prerequisite for all of them: the `kiem` CLI on PATH (build from `kiem-app`, or use
the Kiem app's **Install Command Line Tool** menu command).

## Layout

```
.claude-plugin/        Claude Code plugin + marketplace manifests
skills/kiem-projects/  the skill (also usable standalone via openskills)
integrations/          per-agent wrappers (AGENTS.md, Copilot, Pi)
```

## Keeping in sync

The skill describes the CLI's command surface, which lives in `kiem-app`. When that
surface changes, update `skills/kiem-projects/SKILL.md` here. The durable contract
is `kiem-app/docs/specs/kiem-project-marker.md`.
