# kiem-maintainer

Maintainer-only companion to [`kiem`](https://github.com/tijs/kiem-agent).
It contains skill retrospectives and release tooling for people who maintain the
Kiem agent packages; normal Kiem users should install only `kiem`.

## Pi

Install the public package first, then this companion:

```bash
pi install git:github.com/tijs/kiem-agent
pi install npm:kiem-maintainer
```

For local development:

```bash
pi install /path/to/kiem-agent
pi install /path/to/kiem-agent/plugins/kiem-maintainer
```

The `kiem` CLI must be on `PATH`.
