# Kiem for Pi

The reference integration. Two parts that work as a unit:

1. **Extension** (`kiem.ts`) — registers the `kiem` CLI as native Pi tools, so the
   agent reads and writes project state as first-class tool calls.
2. **Skill** (`../skills/projects/`) — tells the agent *when* to use them
   (read state first, record progress back).

## Prerequisite

The `kiem` CLI on PATH. Install it from the Kiem app (**Install Command Line
Tool**) or `cargo install --path crates/kiem-cli` in the kiem-app repo. Override
the binary with `KIEM_BIN` if it lives elsewhere.

## Install

The repository root is the public Pi package, so one command installs this
extension and every public skill under `skills/`:

```bash
pi install git:github.com/tijs/kiem-agent          # all projects (~/.pi settings)
pi install git:github.com/tijs/kiem-agent -l       # project-local (.pi)
pi -e git:github.com/tijs/kiem-agent               # one session only, no install
```

From a local checkout, install the package by directory (not the single file):

```bash
# Extension + public skills
pi install /path/to/kiem-agent
# Optional maintainer skills
pi install /path/to/kiem-agent/plugins/kiem-maintainer
# Just the extension for one session
pi -e /path/to/kiem-agent/pi/kiem.ts
```

Verify with `pi list` (packages) and `/skill:plan` (etc.) inside a session.

## Tools the extension registers

| Tool | What it does |
| --- | --- |
| `kiem_project_current` | Resolve the project for the cwd (`proj/<slug>`) |
| `kiem_todos` | List open todos `[{note_id, index, text}]` |
| `kiem_notes` | List the project's notes |
| `kiem_show` | Show one note (metadata + body) |
| `kiem_note_add` | Add a note; checkbox lines become todos |
| `kiem_todo_add` | Append one todo without rewriting the note |
| `kiem_todo_set` | Check / uncheck a todo by `(note_id, index)` |
| `kiem_edit_lines` | Replace a guarded line range |
| `kiem_project_add` | Onboard the cwd as a project (writes `.kiem`) |

All shell out to `kiem --json` via `execFile` (no shell), returning structured
results. Errors (incl. a missing `kiem` binary) come back as `isError` results,
not crashes.

## Testing the wiring

`pi/kiem.test.mts` loads the extension against a mock Pi and exercises the
register + execute paths against the real `kiem` binary — no LLM call:

```bash
KIEM_BIN=/path/to/kiem NODE_PATH="$(pi-package-node-modules)" npx tsx pi/kiem.test.mts
```

(See the test file header for the exact `NODE_PATH`.)
