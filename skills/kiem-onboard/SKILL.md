---
name: kiem-onboard
description: >-
  Onboard an existing repo into Kiem: create the committed `.kiem` marker, add
  the `AGENTS.md` pointer and home note, then offer to import pre-existing
  project-memory markdown (plans, brainstorms, solutions, decisions, reviews)
  into Kiem notes. Use when `kiem project current` shows the repo isn't
  onboarded, or the user says "onboard project", "onboard this repo", "add
  project to kiem", "add this to
  kiem", or asks directly to onboard/register a repo with Kiem.
---

# Kiem onboard

Bring a repo under Kiem's shared memory: one committed marker, one home note,
and (for genuinely new projects) an offer to fold pre-existing markdown notes
into Kiem instead of leaving them scattered in the repo.

## 1. No-op check

`kiem project current --json` — if `onboarded` is `true`, the repo is already
onboarded. Report the current project and stop; don't re-run `add`.

## 2. Near-miss check

Not onboarded yet — run `kiem project list` and compare this repo's obvious
name candidates (directory name, package/project name from a manifest if one
exists) against existing project tags that have real notes. A plausible
near-miss (similar name, different slug, real content) — ask once: is this the
same project under a new name, or a new one? Don't guess silently; a wrong
guess fragments that project's history across two tags. No fuzzy-scoring tool
for this — read `project list`'s output and use judgment.

- **Confirmed same project:** skip step 3's name proposal — run
  `kiem project add "<the existing project's name>"` to bind this repo under
  that existing tag, then continue at step 4.
- **Confirmed new, or no near-miss found:** continue at step 3.

## 3. Name and create

No plausible match — propose a name from the directory name; confirm with the
user only if it's uninformative (`app`, `src`, `web`, a bare single word).
Then `kiem project add "<Project Name>" --json` from the repo root — writes the
committed `.kiem` marker, adds an `AGENTS.md` pointer, and (only for a
genuinely new project tag) creates a home note. Idempotent: re-running just
(re)binds the directory, no duplicate home note.

## 4. Starter content

Only when `add`'s JSON output has a non-null `home_note` (this project tag is
genuinely new, not a re-bind):

- `kiem show <home_note>` for its version. The body ends with a blank line then
  a `#proj/<slug>` tag line (that's what makes the note a project home note) —
  replace only the content lines *above* it (e.g. `kiem edit-lines <home_note>
  1 3` for the fresh 5-line stub `# {name}` / blank / `Project home.` / blank
  / `#proj/<slug>`) with `# <name> roadmap`, one short description line, and
  one empty `- [ ]` stub todo, passing `--expect <version>`. The CLI refuses
  an edit that would drop the note's only tag, so a range that's too wide
  errors instead of silently corrupting the note — but get it right the first
  time and skip the round-trip.
  This home note **is** the roadmap — don't also write a repo file for it.
- Best-effort scan `AGENTS.md`, `README*`, `CLAUDE.md`, `docs/plans/*`,
  `docs/roadmap*` for literal `- [ ]` / `TODO:` lines; `kiem todo add
  <home_note> "<text>"` each one found. Don't summarize prose into tasks —
  literal checklist syntax only.

## 5. Import pre-existing kiem-shaped docs

Same new-project branch, after starter content. Scan the whole repo
(respecting `.gitignore`) for markdown files, but only offer note-like,
ephemeral project-memory docs — not generic repo/docs markdown. A clear H1 or
YAML frontmatter is a quality check, not enough by itself.

- Include only path/filename matches for `plan`/`roadmap` → `plan` ·
  `requirements` or `brainstorm` → `brainstorm` · `solutions` → `solution` ·
  `decision`/`decisions` → `decision` · `review`/`reviews` → `review` ·
  `retro`/`retrospective`, `learning`/`learnings`, or `note`/`notes` → `doc`.
  Multiple keywords match the same path (e.g. `docs/plan-and-decision-review.md`)
  → first match wins, in the order listed above.
- Skip common/living repo files and pure docs by default: `AGENTS.md`,
  `CLAUDE.md`, `README*`, `CHANGELOG*`, `LICENSE*`, `CODE_OF_CONDUCT*`,
  `CONTRIBUTING*`, `SECURITY*`, `SUPPORT*`, plus reference/spec/API/guide docs
  such as `docs/specs/*`, `docs/reference/*`, `docs/api/*`, and `docs/guides/*`.
  These are not import/delete candidates even if they have frontmatter or an H1.
- Note title: frontmatter `title:` if present, else the filename (strip any
  date/number prefix and the `.md` extension). One note per file, no
  grouping. A file already mined for checklist lines in step 4 may still get
  imported whole here too — expected minor overlap, not deduped.
- No candidates found: skip silently, no confirmation prompt needed.
- List every candidate (path + inferred type), ask **once** to import the
  whole batch (`kiem note add --type <kind> "<content>"` per file), then ask
  **once** more for the whole batch: delete the original files (plain `rm`,
  no `git rm`, no auto-commit — leaves it in the user's normal git status) or
  leave them in place.
- Only runs on a genuinely new project (pre-first-note) — no dedup logic
  needed against notes that don't exist yet.

## Notes

- **Under Pi:** `kiem_project_add`, `kiem_show`, `kiem_edit_lines`,
  `kiem_todo_add`, `kiem_note_add` (with `type`) are the same operations as
  first-class tool calls, and already return/accept structured data (no
  `--json` needed). Step 2's `kiem project list` and step 5's repo-wide
  markdown scan have no first-class Pi tool for the *listing* — step 2 needs a
  shell fallback; step 5's file discovery is exactly what the `glob` tool
  does (gitignore-respecting by default).
- Once onboarded, hand off to **kiem-projects** for ongoing session work
  (reading state, recording progress).
