# Threatpedia — Public Repository Context

**For:** Any AI agent operating in this repository (Claude, Gemini, future agents)

**Read:** When you cd into this repo as part of a session.

**Note:** This file is named `CLAUDE.md` by convention (Claude Code auto-loads it), but its content is generic and applies to any agent. Gemini agents should also read this file when working in this repo.

---

## What this repository is

This is the public Threatpedia repository: a Wikipedia-style cybersecurity threat encyclopedia at https://threatpedia.wiki, hosted from this repo via GitHub Pages.

It contains:

- **`docs/`** — the data standards, schema, contributor docs. Most importantly: `docs/DATA-STANDARDS-v1.0.md`, the locked v1.0 schema that governs every article.
- **`incidents/`** — incident articles (specific bounded events: a breach, a ransomware attack, a disclosed exploit campaign)
- **`campaigns/`** — campaign articles (ongoing patterns: an APT group's multi-year activity, a malware family's evolution)
- **`entities/`** — entity profiles (threat actors, malware families, zero-days as standalone reference)
- **`assets/`** — shared CSS, JavaScript, fonts, images
- **`public/`** — static site source files (the HTML/JS that builds threatpedia.wiki)
- **`scripts/`** — build, validation, and utility scripts
- **`*.json`** (root) — manifests indexing the corpus contents

It does NOT contain:

- Agent logs, decision records, drafts in progress, internal coordination state — those are in the **private** repo `MahdiHedhli/threatpedia-working`. If you're trying to find ADR 0005 or the working directory protocol, you're in the wrong repo.
- Credentials, env files, secrets — these never live in any repo. They live in `THREATPEDIA-ROOT/` outside both repo trees.

---

## Critical context

### The schema is locked at v1.0

`docs/DATA-STANDARDS-v1.0.md` is the operating schema. It is **locked**. Do not propose modifications without first writing an ADR in the private repo (`threatpedia-working/working/decisions/`) and getting Kernel K's ratification.

The schema defines:

- 11 canonical H2 sections that every article uses
- 7-field article frontmatter
- Three article types (incident, campaign, entity_profile) as separate Astro content collections
- 26 data quality rules (RULE-001 through RULE-026)
- The Admiralty A1-A6 attribution scale and rationale requirements
- The MITRE ATT&CK technique mapping format
- The source schema (publisher type, archival, citation format)

If you're working on anything in `incidents/`, `campaigns/`, or `entities/`, you reference the schema constantly. Do not invent fields. Do not skip required fields. Validate against the schema before claiming work is done.

### The freeze is active

As of 2026-04-09, a freeze is in effect on the public corpus. This means:

- **No new articles** are being added via automation. All 14 previously-running Cowork tasks have been stopped per ADR 0005 (Pipeline Reset and Spec-First Approach).
- **No content modifications** to existing articles without explicit Kernel K approval.
- **No schema modifications** (the schema was locked at v1.0 immediately before the freeze).
- **Site infrastructure changes** are allowed if they don't touch the corpus.

The freeze lifts when:

1. The seven operational specs (in `threatpedia-working/working/specs/`) are written and ratified
2. The data pipeline is rebuilt against the ratified specs
3. The new pipeline produces a small validated launch corpus
4. Kernel K decides to launch

Estimated 5-10 weeks. Until then, the public repo is mostly read-only for agents.

### Do not "fix" the existing corpus

The 24 incidents currently in the manifest, the 78 threat actors, the 1006 glossary terms, and the 6 working scrapers are PoC output. They were produced by the autonomous pipeline before v1.0 existed and they have known quality issues. Per ADR 0005, this content is **not being preserved** — it's being walked away from. The launch corpus will be fresh content produced by the rebuilt pipeline.

If you find a quality issue in a current corpus article and your instinct is to fix it, **don't.** The article will be rebuilt or discarded entirely. Spending time on legacy content is wasted effort.

The exception: 36 normalized articles that DM hand-normalized to v1.0 during the overnight sweep (2026-04-09 → 2026-04-10). These live in the private repo at `threatpedia-working/working/editorial-pass/pending/`. They are **test cases for the new pipeline**, not launch material. Don't migrate them to the public repo.

---

## Working in this repo

### Reading is fine

Any agent can read any file in this repo at any time. Use it as reference material:

- Look up the schema when drafting specs
- Look up existing article structure when reviewing draft articles
- Look up the build commands when setting up a runtime
- Look up the manifest format when planning the new MANIFEST-SPEC.md

### Writing is mostly forbidden

Per the freeze, agents should not commit to this repo without explicit Kernel K approval for the specific commit. Permitted exceptions:

- **Schema work** — only if you're implementing a ratified ADR that modifies the schema, only on a feature branch, only via PR for Kernel K to merge
- **Site infrastructure** — fixing build scripts, updating CI, fixing typos in docs/ — only via PR
- **Migration of approved articles** — when (eventually) `threatpedia-working/working/editorial-pass/approved/` has content ready to ship, the migration PR happens here. Only Kernel K performs this migration; agents prepare the PR but don't merge.

### Branch protection

`main` is protected. All commits must come via PR with Kernel K's review. Bot accounts can push feature branches but cannot merge to main. This is the correct configuration; do not try to work around it.

### Build and validation

To verify the site builds (when working on infrastructure):

```bash
npm install        # one-time setup
npm run validate   # schema validation across the corpus
npm run build      # build the static site
```

If you make any change that touches the corpus or the schema, run `npm run validate` and fix any failures before committing. If validation fails on existing content (not your change), file a conflict — don't try to fix it as part of your commit.

---

## What to do if you find something wrong

### Schema violation in an existing article

File a conflict in `threatpedia-working/working/supervisor/conflicts.md` with severity `info` (not `blocker` — these articles are being abandoned anyway). Don't fix it.

### Schema violation in a draft article (in private repo)

That's editorial pass work. File or update the relevant task in `threatpedia-working/working/inbox/penfold/`. Penfold handles editorial pass per TASK-2026-0010.

### Broken build / broken CI

This is legitimate infrastructure work. Investigate, fix on a feature branch, open a PR, ping Kernel K for review.

### Credential or secret in this repo

This is a security incident. See `THREATPEDIA-ROOT/SECURITY-PRACTICES.md` § Incident Response. Stop everything, notify Kernel K.

### Suspicious commit, unauthorized push, or anything that looks like compromise

Same as above. Security incident, immediate escalation.

---

## Cross-references

- **Operating manual** (how to be an agent): `THREATPEDIA-ROOT/AGENT-OPERATING-MANUAL.md`
- **Security practices**: `THREATPEDIA-ROOT/SECURITY-PRACTICES.md`
- **Private repo / working directory**: `threatpedia-working/working/`
- **Schema**: `docs/DATA-STANDARDS-v1.0.md` (in this repo)
- **Pipeline reset decision**: `threatpedia-working/working/decisions/0005-pipeline-reset-and-spec-first.md`
- **Spec index**: `threatpedia-working/working/specs/README.md`

---

*Public repo context · v1.0 · Maintained by DangerMouse-Bot*
