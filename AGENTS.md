# Threatpedia — Public Repository Context

This file provides guidance to Codex and other OpenAI coding agents when
working in this repository.

## Parity rule

This file should stay in parity with the sibling `CLAUDE.md` and `GEMINI.md`
for shared security, workflow, repository-boundary, and review-discipline
guidance. Only agent-specific auto-load notes and explicitly repo-local
exceptions should differ. If one of these files changes, review the others in
the same change.

## What this repository is

This is the public Threatpedia production repository for
[threatpedia.wiki](https://threatpedia.wiki).

It contains:

- `site/` — the Astro site and all published content collections
- `site/src/content/` — the authoritative article corpus
- `site/src/content.config.ts` — the typed frontmatter schema and enums
- `scripts/` — pipeline utilities, validators, discovery logic, and queue tools
- `.github/pipeline/tasks/` — git-tracked task state for the public pipeline
- `.github/workflows/` — discovery, validation, bookkeeping, audit, and deploy workflows
- `docs/` — operator documentation, including `docs/PIPELINE.md`

It does not contain:

- private coordination state, ADR drafting, or agent logs — those belong in
  `../threatpedia-working/`
- root credentials such as `.env.dmbot` or `.env.epbot`

## Current operating reality

Threatpedia is not running the old Jekyll/static-HTML workflow anymore. The
live production surface is an Astro build with active GitHub Actions pipeline
automation for:

- discovery
- dispatcher / task bookkeeping
- PR validation
- task-state sync
- post-merge audit
- deploy

When this repo and older docs disagree, trust the live code and workflow files
in this repo over historical assumptions.

## Content model

Public content lives in four Astro content collections:

- `site/src/content/incidents/`
- `site/src/content/campaigns/`
- `site/src/content/threat-actors/`
- `site/src/content/zero-days/`

The frontmatter schema is enforced in `site/src/content.config.ts`. Do not
invent fields or relax enums ad hoc.

Current `reviewStatus` enum values are:

- `draft_ai`
- `draft_human`
- `under_review`
- `certified`
- `disputed`
- `deprecated`

## Validation and build

Useful local commands:

```bash
npm --prefix scripts ci --no-audit --no-fund
node scripts/pipeline-schema.mjs
node scripts/pipeline-run-task.mjs --task TASK-2026-0000 --validate
npm --prefix site ci
npm --prefix site run build
npm --prefix site run dev
```

Use the shared validator and task runner paths rather than ad hoc file checks
when working on corpus or pipeline integrity.

## PR and merge discipline

- `main` is protected; land changes by PR only
- before merging any PR, review `gemini-code-assist[bot]` comments, fix
  actionable findings, reply with the applied disposition, and resolve the
  threads
- do not call a PR merge-ready based only on local state; live GitHub PR state
  is the source of truth

## Task isolation discipline

For pipeline tasks and task-scoped content work:

- use one fresh worktree or other clean dedicated checkout per task
- run `node scripts/pipeline-run-task.mjs --task ... --lock` only from that
  clean task-scoped checkout
- if you hit a branch mismatch, unrelated dirty paths, or unexpected spillover,
  stop and rebuild from clean state rather than renaming branches mid-flight or
  carrying cleanup commits
- do not broaden the PR beyond the task scope just to recover local state

Before reporting a task PR as ready, verify all of the following:

- `git status --short` shows only expected task paths
- `gh pr diff --name-only` matches the intended task scope
- local validation passes for every modified article or task file in the branch
- `gh pr checks` is green
- unresolved Gemini review threads are actually zero on the live PR

## Security expectations

- do not read or touch root secret files unless explicitly instructed
- if you encounter a credential leak, unauthorized push, suspicious workflow
  behavior, or other security issue, stop and escalate
- if a workflow or automation is generating noisy failures, inspect the actual
  failing runs rather than assuming it is harmless churn

## Model routing

- default to the cheapest model that can finish the task without repeated
  structural misses or review churn
- escalate for attribution-heavy actor work, canonicalization decisions,
  ambiguous campaign clustering, or architecture changes
- prefer lower-cost models only when the output shape is already explicit and
  the task is tightly bounded

## Cross-references

- `../AGENTS.md` — workspace-level context
- `../GEMINI.md` — workspace-level Gemini startup rules
- `docs/PIPELINE.md` — pipeline behavior and operator guidance
- `../threatpedia-working/` — private control plane and ADR/spec history

*Public repo context · current Astro/pipeline era · maintained for parity with sibling agent docs*
