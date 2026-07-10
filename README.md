# kiem

Agent integrations for [Kiem](https://github.com/tijs/kiem). They teach a coding
agent to keep its **project state — notes, todos, plans, reviews, learnings — in
Kiem**, instead of reconstructing it from the repo every session. Every artifact is
a typed note, tagged to the project and editable across machines, so the agent
follows a lean **plan → work → review → compound** loop without scattering state
across gitignored repo files. A separate, optional `kiem-maintainer` companion
contains tooling for maintaining these skills themselves.

Kiem itself — the app, Rust core, and `kiem` CLI — lives in the `kiem-app` repo.
This repo is optional: Kiem works without it. It exists to make the agent-facing
side installable per ecosystem.

## The model

The **`kiem` CLI is the universal substrate.** Any agent that can run a shell can
participate: it reads state with `kiem todos` / `kiem notes` and records progress
with `kiem note add` / `kiem todo check`. A repo binds to a project through a
committed `.kiem` marker (see `kiem-app/docs/specs/kiem-project-marker.md`).

Each integration is just a thin wrapper pointing its agent at that CLI.

## The skills

`onboard` brings a repo in; `projects` is the base contract for
working inside it: read state first, record progress back. The rest are a
Kiem-native take on [Every's Compound Engineering
loop](https://github.com/EveryInc/compound-engineering-plugin) (brainstorm →
plan → work → review → compound, plus `lfg` for the hands-off autopilot run) —
same shape, reimplemented to read/write Kiem notes instead of repo files, with
fewer sub-agents:

| Skill | Does | Writes to Kiem |
|-------|------|----------------|
| **onboard** | Bring an existing repo into Kiem | `.kiem` marker, home note |
| **projects** | Base: read/maintain project state via the CLI | notes, todos |
| **brainstorm** | Explore WHAT to build | `brainstorm` note |
| **plan** | Write a lean implementation plan | `plan` note (its `- [ ]` become todos) |
| **work** | Execute a plan, record progress | checked todos, `decision` notes |
| **review** | Curated lens roster (cap 4), by diff | `review` note + `- [ ]` todos |
| **compound** | Capture a solved problem | `solution` note |
| **debug** | Root-cause a bug, record the lesson | `solution` note |
| **doc-review** | Critique a plan/brainstorm note | edits + todos |
| **refresh** | Keep long-term memory tidy | updates/merges notes |
| **lfg** | Orchestrate the whole loop | all of the above |

### Maintainer companion

Normal users stop at `kiem`. Maintainers can additionally install
`kiem-maintainer`:

| Skill | Does | Writes to Kiem |
|-------|------|----------------|
| **introspect** | Skill-run retro | `review` in `proj/kiem_agent` |
| **release** | Safe package releases | `solution` in `proj/kiem_agent` |

## Pi — the reference integration

[Pi](https://pi.dev) gets the deepest integration: a native **extension** exposing
the CLI as first-class tools, plus the **skills** that say when to reach for them.
This is where CLI and skills are tuned to work as one unit; other agents are
duplicated from here. See **[`pi/README.md`](pi/README.md)**.

The repository root is the public **Pi package**. It installs the Kiem extension
and public workflow skills only:

```bash
pi install git:github.com/tijs/kiem-agent
# pinned to a public release:
pi install git:github.com/tijs/kiem-agent@v0.6.0
```

Maintainers install the separate companion package as well:

```bash
pi install npm:kiem-maintainer
# local development before publication:
pi install /path/to/repo/plugins/kiem-maintainer
```

The two package roots keep maintainer skills out of normal Pi installs.

Prerequisite: the `kiem` CLI on `PATH` (Kiem app → *Install Command Line Tool*,
or `cargo install --path crates/kiem-cli` in the kiem-app repo).

## Other agents

The same Agent Skills are exposed as two installable bundles where the host has a
plugin system, and as individually installable skills everywhere else.

### Claude Code

```text
/plugin marketplace add tijs/kiem-agent
/plugin install kiem@kiem
/plugin install kiem-maintainer@kiem   # maintainers only
```

### Codex / ChatGPT

Add the repository marketplace with `codex plugin marketplace add
tijs/kiem-agent`, then install `kiem` and, for maintainers, `kiem-maintainer`
from the plugin directory. Both plugin roots carry `.codex-plugin` manifests.

### GitHub Copilot

GitHub CLI 2.90+ can install the repository's Agent Skills:

```bash
gh skill install tijs/kiem-agent
```

Choose the public skills normally; maintainers additionally choose `introspect`
and `release`. Copilot also recognizes these skills when copied or linked under
`.agents/skills`, `.github/skills`, or `.claude/skills`.

### Gemini CLI

The repository root is a Gemini extension containing the public skills:

```bash
gemini extensions install https://github.com/tijs/kiem-agent
```

Maintainer skills can be installed directly from the same repository:

```bash
gemini skills install https://github.com/tijs/kiem-agent.git \
  --path plugins/kiem-maintainer/skills/introspect
gemini skills install https://github.com/tijs/kiem-agent.git \
  --path plugins/kiem-maintainer/skills/release
```

The maintainer package also carries a `gemini-extension.json` for local linking.

## Layout

```text
pi/                              Pi extension + smoke test
skills/                          Public Agent Skills
plugins/kiem-maintainer/         Optional maintainer package/plugin + skills
.claude-plugin/                  Claude Code marketplace + public manifest
.codex-plugin/                   Public Codex plugin manifest
.agents/plugins/marketplace.json GitHub Copilot / generic agent marketplace
integrations/                    AGENTS.md pointer for generic agents
```

## Keeping in sync

The skills and extension describe the `kiem` CLI surface, which lives in `kiem-app`.
When that surface changes, update `pi/kiem.ts` and the affected public or
maintainer `SKILL.md`. The durable contract is
`kiem-app/docs/specs/kiem-project-marker.md`.

## License

MIT — see [LICENSE](LICENSE).
