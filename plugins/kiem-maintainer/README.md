# kiem-maintainer

Maintainer-only companion to [`kiem`](https://github.com/tijs/kiem-agent).
It contains skill retrospectives and release tooling for people who maintain the
Kiem agent packages; normal Kiem users should install only `kiem`.

## Install

Install this companion from the `kiem-agent` GitHub repository. Claude Code
and Codex use the repository marketplace; Copilot and Gemini install the
maintainer skills directly. See the
[root README](https://github.com/tijs/kiem-agent#readme) for the exact commands.

### Pi

Pi has no marketplace concept and installs one package per git root, so it
cannot reach this subpath remotely. Install the public package first, then this
companion from a local checkout:

```bash
pi install git:github.com/tijs/kiem-agent
pi install /path/to/kiem-agent/plugins/kiem-maintainer
```

The `kiem` CLI must be on `PATH`.
