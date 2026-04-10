# Threatpedia Optimization Log

**Purpose:** Tech debt, redundant work, schema friction, process improvements. Filed proactively by any agent. Reviewed periodically by Kernel K.

**Format:** Most recent at top. Each entry has a title, filer, severity, and recommended action. Entries persist until acted on or explicitly dismissed.

**Last updated:** 2026-04-10T15:00:00Z by DangerMouse-Bot

---

## Open Items

### 2026-04-10 — Normalization script section vocabulary regex is becoming a maintenance burden

**Filed by:** DangerMouse-Bot
**Severity:** low
**Affected:** `scripts/normalize.py`

The `SECTION_MAP` constant in `normalize.py` has 11 canonical titles each mapped to 3-7 regex patterns. After two iterations during the overnight sweep (adding patterns to handle Qilin and BlueHammer variants), it's now 30+ regex patterns inline in Python. This is hard to maintain and easy to break.

**Recommended action:** Move `SECTION_MAP` to a YAML data file (`scripts/section-vocabulary.yml`) that any agent can edit without touching Python. The script reads it at startup. This also makes it easier for Penfold to suggest pattern additions during the editorial pass.

---

### 2026-04-10 — Confidence score is computed-not-stored, but normalization script still injects it into HTML meta tags

**Filed by:** DangerMouse-Bot
**Severity:** medium
**Affected:** `scripts/normalize.py`, all 36 normalized articles

Per ADR 0001 and v1.0 §9.4, the confidence score is never stored in frontmatter. But the current normalization script still injects `<meta name="confidence-grade">` and the `additionalProperty` in JSON-LD with the computed grade. This is technically a "snapshot at normalization time" rather than "stored canonical value", but it's confusing because next time the score is computed (at Astro build time) it could differ from the meta tag.

**Recommended action:** Remove the `<meta name="confidence-grade">` tag from the normalization template entirely. The Astro build is the only place that should compute and emit the score. Until Astro is up, leave the JSON-LD score in place but mark it explicitly as "snapshot at normalization, recomputed at build".

---

### 2026-04-10 — Cyber Kill Chain vs Attack Chain dedup ambiguity

**Filed by:** DangerMouse-Bot
**Severity:** low (not blocking, but worth resolving before next batch)
**Affected:** `tp-article-qilin-edr-killer.html`, future articles using Lockheed Kill Chain framing

Qilin EDR-killer has both an "Attack Chain" section and a "Cyber Kill Chain Mapping" section. My SECTION_MAP regex matches both to canonical "Attack Chain" because the word "chain" triggers it. The Cyber Kill Chain content currently gets orphaned.

**Recommended action:** Decide whether v1.0 §6 should distinguish between "Attack Chain" (narrative description) and "Cyber Kill Chain Mapping" (formal Lockheed model). If yes, this is a schema change that needs an ADR. If no, the regex stays as-is and Cyber Kill Chain content folds into Attack Chain.

---

### 2026-04-10 — Penfold has no consistent way to read project files without manual upload

**Filed by:** DangerMouse-Bot
**Severity:** medium (process friction, not blocking)
**Affected:** Penfold-Bot collaboration workflow

Penfold runs in AI Studio, which doesn't have integrated GitHub access. Every Penfold session currently requires Kernel K to manually upload the relevant files (the agent log, the inbox, the in-progress task files). This is the same shuttle pattern we're trying to escape with the working directory.

**Recommended action:** Two options to investigate:
1. Use Gemini's web access (when available) to fetch files directly from the public repo via raw.githubusercontent.com URLs. Same pattern as DM's boot sequence in Chat.
2. Eventually connect Penfold to a runtime that has git access (similar to dangermouse-bot runtime but for Penfold).

For now, accept the friction and have a "Penfold session checklist" in the protocol doc listing exactly which files Kernel K should upload at the start.

---

### 2026-04-10 — Working directory needs PR-less commit allowance in CI

**Filed by:** DangerMouse-Bot
**Severity:** medium
**Affected:** `.github/workflows/`, the dangermouse-bot runtime when it goes live

Currently the GitHub workflow on threatpedia requires PRs for all commits. The working directory protocol assumes agents can commit directly to `working/` without a PR. This needs the workflow to be modified to:
1. Allow PR-less commits to `working/` from authorized agent accounts (dangermouse-bot, penfold-bot)
2. Continue requiring PRs for `incidents/`, `campaigns/`, `entities/`, `docs/`, and `.github/` itself
3. Optionally: notify Kernel K via webhook on every commit by an agent account

**Recommended action:** Kernel K updates `.github/workflows/main.yml` (or equivalent) with branch protection rules. Possibly use CODEOWNERS to enforce review on protected paths.

---

## Acted-On / Dismissed

(none yet — bootstrap session)

---

## Notes for Reviewers

When reviewing this log, mark items in one of three ways:
1. **Acted on:** create a task in the inbox, link the task ID in the entry, then move to "Acted-On" section
2. **Dismissed:** add a one-line note explaining why, then move to "Dismissed"
3. **Defer:** leave in place, optionally add a "deferred until: <date>" note

Items that have sat for >90 days without action are flagged in the next handoff queue update by DangerMouse during routine maintenance.
