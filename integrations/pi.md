# Kiem for Pi

Pi consumes skills/extensions differently from Claude Code. Until a dedicated Pi
extension exists, the portable path is the same as every other agent: ensure the
`kiem` CLI is on PATH and point Pi at the project via the repo's `AGENTS.md`
pointer (see `../integrations/AGENTS.md.snippet`, written automatically by
`kiem project add`).

The `kiem` CLI is the universal contract — any Pi session that can shell out can
read `kiem todos` / `kiem notes` and record progress with `kiem note add` /
`kiem todo check`. A native Pi extension wrapping these is a future addition.
