# Threatpedia Pipeline — End-to-End Flow

**Audience:** Agents (Claude Code, Gemini, humans) operating the pipeline.
**Scope:** The **fresh content** lane (pipeline-led). Historical-landmark and
bulk-support lanes are out of scope here (see ADR 0009).

---

## TL;DR

```
┌─────────────────┐   ┌────────────────┐   ┌──────────────┐   ┌──────────┐
│ pipeline-       │──▶│ .github/       │──▶│ pipeline-    │──▶│ PR on    │
│ discovery.yml   │   │ pipeline/      │   │ dispatcher   │   │ main for │
│ (6h cron)       │   │ tasks/*.json   │   │ .yml (2h cron)│   │ KK review│
└─────────────────┘   └────────────────┘   └──────────────┘   └──────────┘
        │                      │                    │
   invokes                 consumed by          invokes
   scripts/                 dispatcher           agent via
   pipeline-discover.mjs                         scripts/
   (ROAD-011 scoring,                            pipeline-run-task.mjs
    dedup, ADR 0007 IDs,
    dispatcher-compatible
    task shape)
```

No API key is required on the scheduled path. Article generation happens
**inside an agent's own subscription** (Claude Code, Gemini, or a human typing)
when the dispatcher hands off the task. This keeps the pipeline
agent-agnostic and lets it scale without centralizing model spend.

`scripts/generate-article.mjs` is **legacy / manual only** — it calls the
Claude API directly and is not used by any scheduled workflow. Retain for
manual operator use; do not wire into the scheduled flow.

---

## The five moving parts

| Component | What it is | When it runs |
|---|---|---|
| `.github/workflows/pipeline-discovery.yml` | GitHub Actions cron workflow — thin wrapper | Every 6 hours + manual dispatch |
| `scripts/pipeline-discover.mjs` | Node script — single source of truth for feed fetch, scoring, dedup, task emission | Invoked by the workflow above |
| `.github/pipeline/tasks/TASK-*.json` | Pipeline task files — discovered and dispatched individually | Created by discovery, read/written by dispatcher |
| `.github/workflows/pipeline-dispatcher.yml` | GitHub Actions cron workflow — dispatches tasks to agents | Every 2 hours + manual dispatch |
| `scripts/pipeline-run-task.mjs` | Node script — agent-agnostic task runner and validator | Invoked by the dispatcher, executed under the agent's subscription |

`.github/pipeline/config.yml` holds queue limits, circuit-breaker thresholds,
validation gates, and discovery feed config. It is the single tunable knob
for the pipeline.

---

## The lifecycle of a single task

1. **Discovery** (6h cron, `pipeline-discovery.yml`)
   - Calls `node scripts/pipeline-discover.mjs --days 14 --limit 5 --execute`
   - Script fetches CISA KEV (+ NVD CVSS enrichment), builds dedup indexes
     against the live corpus and existing tasks, scores candidates per
     ROAD-011, allocates a year-namespaced exploitId per ADR 0007, and
     writes one `TASK-2026-NNNN.json` per surviving candidate to
     `.github/pipeline/tasks/`.
   - Workflow commits those new task files to `main` with message
     `chore(pipeline): auto-discovery — ...`.

2. **Queue backpressure check** (next dispatcher tick)
   - `pipeline-dispatcher.yml` loads all tasks. If the count of tasks at
     `stage: draft` with `status: complete | validation | review` is
     ≥ `queues.editorial.max_pending` (default 50), the dispatcher backs
     off without dispatching more. When the queue drains below
     `backpressure_resume` (default 40), dispatch resumes.

3. **Circuit breaker check**
   - If the three most recent task failures all occurred within the last
     2 hours, the dispatcher halts and opens a GitHub Issue with the
     `pipeline/alert + pipeline/circuit-breaker` labels. Close the Issue
     to resume.

4. **Stale-lock sweep**
   - Any task with `status: locked` whose `locked_at` is older than 30
     minutes (`scheduling.stale_lock_minutes`) is auto-released back to
     `pending` with a history transition recording the release.

5. **Dependency check**
   - Tasks with unmet `depends_on[]` are moved to `status: blocked`.

6. **Dispatch**
   - Up to 3 `pending` tasks per cycle, sorted P0 → P3 then oldest-first,
     get dispatched by opening an agent-pickup GitHub Issue. The agent
     (Claude Code / Gemini / human) claims the task by running
     `node scripts/pipeline-run-task.mjs --task TASK-XXXX --lock`, which
     marks `status: locked` with `locked_by` set and `locked_at`
     timestamped (so the stale-lock sweep will recover it if the agent
     dies mid-task).

7. **Agent execution** (under the agent's own subscription)
   - Agent reads the task brief, drafts the article into
     `site/src/content/<type>/<slug>.md` on the `pipeline/TASK-XXXX`
     branch, runs `pipeline-run-task.mjs --task TASK-XXXX --validate`,
     iterates until validation passes, then runs `--complete`.

8. **Validation gate**
   - `--validate` enforces `.github/pipeline/config.yml` `validation.*`
     rules: min sources, min H2 sections, min MITRE mappings,
     `review_status: draft_ai`, build must pass, schema must pass.
   - Failure leaves the task locked for agent iteration; success flips
     `status` to `complete` and opens a PR.

9. **Human review + merge**
   - `auto_merge.enabled: false` today — every PR goes to Kernel K for
     review. Once merged, the task's history records the final transition.

---

## Guardrail quick reference

| Guardrail | Where it lives | Default | Source of truth |
|---|---|---|---|
| Corpus + task CVE dedup | `pipeline-discover.mjs` | Scans all content collections + all existing tasks | Script |
| Discovery lookback | workflow env `DAYS` → `--days` | 14 days | Workflow input |
| Discovery per-run cap | workflow env `LIMIT` → `--limit` | 5 tasks | Workflow input |
| Editorial queue backpressure | `pipeline-dispatcher.yml` | 50 pending / resume at 40 | `config.yml` |
| Stale-lock timeout | `pipeline-dispatcher.yml` | 30 minutes | `config.yml` |
| Circuit breaker | `pipeline-dispatcher.yml` | 3 failures in 2h → Issue + halt | `config.yml` |
| Dependency blocking | `pipeline-dispatcher.yml` | Per-task `depends_on[]` | Task file |
| Validation gates | `pipeline-run-task.mjs --validate` | See `config.yml` `validation.*` | `config.yml` |

**Known follow-on:** `loadConfig()` in `pipeline-dispatcher.yml` currently
hardcodes the values above with a comment that says "Simple YAML parser for
flat config." The correct authoritative source is `config.yml`. A future
hardening PR should parse `config.yml` properly so a single-knob edit there
propagates to the dispatcher. Not in scope for the initial convergence.

---

## How to invoke manually

**Dry-run discovery** (does not write tasks or commit):

```
# From repo root
node scripts/pipeline-discover.mjs --days 14 --limit 5
```

**Run discovery for real** (writes tasks; commit yourself):

```
node scripts/pipeline-discover.mjs --days 14 --limit 5 --execute
git add .github/pipeline/tasks/
git commit -m "chore(pipeline): manual discovery run"
```

**From GitHub Actions** — use the `Pipeline: Automated Discovery` workflow's
**Run workflow** button; choose dry-run by setting `execute: false`.

**List pending tasks**:

```
node scripts/pipeline-run-task.mjs --list
```

**Show a task brief**:

```
node scripts/pipeline-run-task.mjs --task TASK-2026-0071
```

**Lock a task for execution**:

```
node scripts/pipeline-run-task.mjs --task TASK-2026-0071 --lock
```

**Validate agent output**:

```
node scripts/pipeline-run-task.mjs --task TASK-2026-0071 --validate
```

**Mark complete**:

```
node scripts/pipeline-run-task.mjs --task TASK-2026-0071 --complete
```

---

## Historical lane

Fresh content uses this pipeline. **Historical content does not.**

Per ADR 0009 (Landmark-Led Historical Acquisition) and the Historical
Acquisition Framework in the private repo, historical backfill is driven by
a curated 50-candidate landmark queue — not cron-triggered discovery. The
historical lane's intake shape, prioritization rubric, and dispatch rules
are separate from this document. Bulk datasets (CISSM, VCDB, HHS OCR,
OAIC, GDPR trackers) support both lanes as enrichment / gap detection but
do not drive pre-launch intake.

When the historical lane's pipeline ships, it will link from this file.

---

*Document owner: DangerMouse-Bot · Last updated: 2026-04-17 · Part of the
convergence slice (TASK-2026-0062).*
