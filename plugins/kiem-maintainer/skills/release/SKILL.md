---
name: release
license: MIT
description: >-
  Maintainer-only release checklist for the Kiem agent packages. Use when the
  maintainer asks to cut, publish, tag, or release `kiem` or `kiem-maintainer`.
  Preflights remote state, versions every host manifest, tests, publishes, and
  verifies branch, tag, package, and GitHub release alignment.
---

# Kiem release

Release one package without letting a tag outrun `main`.

## 1. Choose the target

- `kiem`: public Kiem extension and workflow skills.
- `kiem-maintainer`: `introspect`, `release`, and future maintainer-only skills.

Ask for the target and version when either is ambiguous. Use semver: feature =
minor, compatible fix = patch, breaking change = major.

## 2. Preflight

1. Confirm the intended diff and that unrelated work is absent.
2. Run `git fetch origin --tags`.
3. Require `HEAD == origin/main` before versioning. Reconcile first if they differ.
4. Confirm the release tag does not exist locally, remotely, or on GitHub.

Never create a tag before the release commit is successfully pushed to `main`.

## 3. Version every target manifest

For `kiem`, update together:

- `package.json`
- both root version fields in `package-lock.json`
- `.claude-plugin/plugin.json`
- `.claude-plugin/marketplace.json` descriptions if they mention a version
- `.codex-plugin/plugin.json`
- `.agents/plugins/marketplace.json` descriptions if they mention a version
- `gemini-extension.json`
- the pinned install example in `README.md`

For `kiem-maintainer`, update together:

- `plugins/kiem-maintainer/package.json`
- `plugins/kiem-maintainer/.claude-plugin/plugin.json`
- `plugins/kiem-maintainer/.codex-plugin/plugin.json`
- `plugins/kiem-maintainer/gemini-extension.json`

Use tag `v<version>` for `kiem` and `kiem-maintainer-v<version>` for the
maintainer package.

## 4. Verify and commit

- Run the Pi smoke test from `pi/README.md` for `kiem` changes.
- Run `npm pack --dry-run` at the target package root and verify no other
  package's skills are included.
- Run `git diff --check` and any repo-level lint/test commands.
- Validate JSON and skill frontmatter; run `claude plugin validate` when Claude
  Code is installed.
- Commit only the intended release files.

Fetch again after committing. If `origin/main` advanced, rebase the release
commit and repeat verification.

## 5. Publish in safe order

1. Push `main` and require success.
2. Create the annotated tag on the pushed commit.
3. Push that tag explicitly.
4. Create the GitHub release using a notes file, not an interpolated shell body.

Skip npm unless the project explicitly distributes through npm. This repo uses
GitHub releases and git-based installs by default; npm is an optional mirror.

Do not publish, tag, or create a GitHub release without the user's explicit
release request.

## 6. Verify and record

Require all of these to resolve to the same commit/version:

- local `HEAD`
- `origin/main`
- peeled remote tag
- GitHub release tag
- package and host-manifest versions

Record one concise `solution` note in `proj/kiem_agent` with version, commit, and
release URL. Report commit, push, tag, and GitHub release status explicitly;
mention npm only if npm distribution was requested.
