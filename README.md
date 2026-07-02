# kiem-agent

Agent integrations for [Kiem](https://github.com/tijs/kiem). They teach a coding
agent to read and maintain **project state — notes, todos, plans, reviews,
learnings — in Kiem** instead of reconstructing it from the repo every session,
and give it a lean, token-economical **plan → work → review → compound** workflow
where every artifact lives in Kiem (typed, tagged to the project, editable across
machines) rather than in gitignored repo files.

Kiem itself (the app + Rust core + `kiem` CLI) lives in the `kiem-app` repo. This
repo is optional: Kiem works without it. It exists to make the agent-facing side
installable per ecosystem.

## The model

The **`kiem` CLI is the universal substrate.** Any agent that can run a shell can
participate: it reads `kiem todos` / `kiem notes` and records progress with
`kiem note add` / `kiem todo check`. A repo binds to a project via a committed
`.kiem` marker (see `kiem-app/docs/specs/kiem-project-marker.md`).

Each integration is a thin wrapper that points its agent at that CLI.

## The skills

`kiem-projects` is the base contract (read state first, record progress back). The
rest are a Kiem-native mirror of a compound-engineering workflow — simpler, fewer
sub-agents, and storing every artifact in Kiem as a typed note:

| Skill | Does | Writes to Kiem |
|-------|------|----------------|
| **kiem-projects** | Base: read/maintain project state via the CLI | notes, todos |
| **kiem-brainstorm** | Explore WHAT to build | `brainstorm` note |
| **kiem-plan** | Write a lean implementation plan | `plan` note (its `- [ ]` become todos) |
| **kiem-work** | Execute a plan, record progress | checked todos, `decision` notes |
| **kiem-review** | Curated lens roster (cap 4), by diff | `review` note + `- [ ]` todos |
| **kiem-compound** | Capture a solved problem | `solution` note |
| **kiem-debug** | Root-cause a bug, record the lesson | `solution` note |
| **kiem-doc-review** | Critique a plan/brainstorm note | edits + todos |
| **kiem-refresh** | Keep long-term memory tidy | updates/merges notes |
| **kiem-lfg** | Orchestrate the whole loop | all of the above |

## Pi — the reference integration

[Pi](https://pi.dev) gets the deepest integration: a native **extension** that
exposes the CLI as first-class tools, plus the **skill** that says when to use
them. This is where the CLI + skill are tuned to work as one unit; other agents
are duplicated from here. See **[`pi/README.md`](pi/README.md)**.

```bash
pi install /path/to/kiem-agent/pi/kiem.ts          # native tools
pi --skill /path/to/kiem-agent/skills/kiem-projects # workflow + when-to-use
```

## Other agents (duplicated from Pi as needed)

| Agent | Mechanism | Status |
|-------|-----------|--------|
| **Claude Code** | Plugin / skill (this repo is also a marketplace) | scaffolded — `/plugin marketplace add tijs/kiem-agent` → `/plugin install kiem-agent@kiem`, or `npx openskills install skills/<name>` |
| **Codex** (or any `AGENTS.md` reader) | `AGENTS.md` pointer | `integrations/AGENTS.md.snippet` (written into each repo by `kiem project add`) |
| **GitHub Copilot** | Repo custom instructions | planned |

## Layout

```
pi/                    Pi extension (kiem.ts) + skill install guide + smoke test
skills/                Kiem-native skills (Agent Skills standard; also standalone):
                       kiem-projects, kiem-plan, kiem-work, …
.claude-plugin/        Claude Code plugin + marketplace manifests
integrations/          AGENTS.md pointer for Codex/generic agents
```

## Keeping in sync

The skills and extension describe the `kiem` CLI surface, which lives in `kiem-app`.
When that surface changes, update `pi/kiem.ts` and the affected `skills/*/SKILL.md`
here. The durable contract is `kiem-app/docs/specs/kiem-project-marker.md`.
