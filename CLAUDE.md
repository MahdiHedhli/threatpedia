# Threatpedia — Public Repository Context

**For:** Any AI agent operating in this repository (Claude, Gemini, future
agents)

**Read:** When you `cd` into this repo as part of a session.

**Note:** This file is named `CLAUDE.md` by convention (Claude Code auto-loads
it), but its content is generic and applies to any agent. Gemini agents should
also read this file when working in this repo.

**Parity rule:** This file should stay in parity with the sibling `GEMINI.md`
and the relevant root-level `../AGENTS.md` guidance for shared security,
workflow, repo-boundary, and merge-discipline rules. Only agent-specific
startup wording and strictly repo-local guidance should differ. If one of these
files changes, review the others in the same change.

---

## What this repository is

This is the public Threatpedia production repository for
https://threatpedia.wiki.

The current repo shape is:

- **`site/`** — the Astro site
  - `site/src/content/` — Markdown/MDX content collections:
    `incidents`, `campaigns`, `threat-actors`, `zero-days`
  - `site/src/content.config.ts` — authoritative content schema and enums
- **`scripts/`** — pipeline utilities, validators, task helpers
- **`.github/workflows/`** — deploy, discovery, dispatcher, validation, and
  post-merge audit workflows
- **`.github/pipeline/`** — pipeline config, task JSON files, and queue state
- **`docs/`** — standards and process documentation, including
  `docs/DATA-STANDARDS-v1.0.md`

It does **not** contain private coordination state, agent logs, or secrets.
Those belong in `../threatpedia-working/` or at the root workspace level.

---

## Critical context

### The schema authority is split human + machine

`docs/DATA-STANDARDS-v1.0.md` is the human-facing editorial standard.
`site/src/content.config.ts` is the machine-enforced schema used by Astro and
pipeline tooling.

If work changes the content contract, keep those authorities aligned and do not
silently invent new fields or enum values.

### The site is Astro-based now

Do not assume Jekyll, root-level static HTML articles, or “just serve the repo”
preview behavior. Articles are built from `site/` into `site/dist`.

### The pipeline is live

This repo is no longer in a purely frozen reset state. Current public workflow
includes:

- discovery
- dispatcher
- PR validation
- post-merge audit
- Astro deploy

Always check live workflow and PR state before claiming something is blocked,
frozen, or complete.

### Merge discipline is strict

`main` is protected. Public work lands by PR only. Before merge, actionable
`gemini-code-assist[bot]` threads must be fixed, replied to, and resolved.

---

## Working in this repo

### Normal write scope

Scoped PRs are expected for:

- site infrastructure fixes
- pipeline and validator improvements
- approved content task execution
- schema-aligned docs updates

Do not mix unrelated task work into the same branch or PR.

### Content-task workflow

For pipeline task work, prefer the scripted path:

```bash
cd scripts && npm ci --no-audit --no-fund
node scripts/pipeline-run-task.mjs --task TASK-2026-XXXX --lock
node scripts/pipeline-run-task.mjs --task TASK-2026-XXXX --validate
node scripts/pipeline-run-task.mjs --task TASK-2026-XXXX --open-pr
```

`--open-pr` is the finish path. Do not stop at “branch ready.”

### Build and validation

Use the real current commands:

```bash
cd site && npm ci
cd site && npm run build
cd site && npm run preview
cd scripts && npm ci --no-audit --no-fund
node scripts/pipeline-schema.mjs
```

PR validation and post-merge audit reuse the shared validator. Prefer those
paths over one-off local checks.

---

## What to do if you find something wrong

### Schema or content-shape drift

Treat it as a real integrity issue. Fix it in the scoped PR if it is part of
your change, or surface it clearly if it is unrelated legacy drift.

### Broken build / broken CI / broken workflow

This is legitimate infrastructure work. Investigate on a feature branch, patch
the existing workflow or validator path, and open a PR.

### Credential or secret in this repo

Treat it as a security incident. Use
`THREATPEDIA-ROOT/SECURITY-PRACTICES.md`, stop work, and notify Kernel K.

### Suspicious commit, unauthorized push, or compromise signal

Treat it as a security incident and escalate immediately.

---

## Cross-references

- **Operating manual**: `THREATPEDIA-ROOT/AGENT-OPERATING-MANUAL.md`
- **Security practices**: `THREATPEDIA-ROOT/SECURITY-PRACTICES.md`
- **Private repo / working directory**: `../threatpedia-working/working/`
- **Schema**: `docs/DATA-STANDARDS-v1.0.md`
- **Machine schema**: `site/src/content.config.ts`
- **Pipeline guide**: `docs/PIPELINE.md`

---

*Public repo context · Maintained for parity with sibling agent docs*
