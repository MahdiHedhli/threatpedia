# Threatpedia Pipeline — End-to-End Flow

**Audience:** Agents (Claude Code, Gemini, humans) operating the pipeline.
**Scope:** The **fresh content** lane (pipeline-led). Historical-landmark and
bulk-support lanes are out of scope here (see ADR 0009).

---

## TL;DR

```
┌─────────────────┐   ┌────────────────┐   ┌────────────────┐   ┌──────────┐
│ pipeline-       │──▶│ .github/       │──▶│ pipeline-      │──▶│ PR on    │
│ discovery.yml   │   │ pipeline/      │   │ dispatcher     │   │ main for │
│ (6h cron)       │   │ tasks/*.json   │   │ .yml (2h cron) │   │ KK review│
└─────────────────┘   └────────────────┘   └────────────────┘   └──────────┘
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
   - Prepares the long-lived branch `pipeline/discovery`. Three cases:
     - **Branch doesn't exist** → create from `main`
     - **Branch exists + open PR from it** → accumulate onto the existing branch
       (merge latest `main` in so task files stay compatible with the live schema)
     - **Branch exists + NO open PR** → the previous batch was either **merged**
       (tasks now on `main`) or **closed-without-merging** (rejection). Both
       cases collapse to: **reset the branch to `origin/main`** so rejected
       tasks do not silently resurface on the next run, and merged tasks aren't
       counted as new. Force-push the reset.
   - Calls `node scripts/pipeline-discover.mjs --days 14 --limit 5 --execute`
   - Script fetches CISA KEV (+ NVD CVSS enrichment), builds dedup indexes
     against the live corpus and existing tasks, scores candidates per
     ROAD-011, allocates a year-namespaced exploitId per ADR 0007, and
     writes one `TASK-2026-NNNN.json` per surviving candidate to
     `.github/pipeline/tasks/` **on the branch** (not `main`).
   - Commits and pushes the branch. **Branch protection on `main` is
     respected** — nothing pushes directly to `main`.
   - Opens or updates a PR from `pipeline/discovery` to `main` with the
     `pipeline/discovery` label. The PR body enumerates every task on the
     branch with task ID, type, priority, score, auto-cert eligibility,
     CVE, and topic. **Merge** to accept the whole batch; **close without
     merging** to reject all staged tasks — the branch-reset logic above
     ensures rejection is durable.
   - If no new candidates this run, no branch change, no PR churn.

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
| Discovery publishes via | `pipeline/discovery` branch + auto-PR | labeled `pipeline/discovery`, no direct push to `main` | Workflow |
| PR batch review | Human merge (not auto-merge) | Nothing lands on `main` without review | Workflow + branch protection |
| Editorial queue backpressure | `pipeline-dispatcher.yml` (via `scripts/pipeline-config.mjs`) | 50 pending / resume at 40 | `config.yml` (`queues.editorial.max_pending` / `backpressure_resume`) |
| Stale-lock timeout | `pipeline-dispatcher.yml` (via `scripts/pipeline-config.mjs`) | 30 minutes | `config.yml` (`scheduling.stale_lock_minutes`) |
| Circuit breaker | `pipeline-dispatcher.yml` (via `scripts/pipeline-config.mjs`) | 3 failures in 120min → Issue + halt; 60min cooldown | `config.yml` (`circuit_breaker.*`) |
| Dependency blocking | `pipeline-dispatcher.yml` | Per-task `depends_on[]` | Task file |
| Validation gates | `pipeline-run-task.mjs --validate` | See `config.yml` `validation.*` | `config.yml` |

**Config authority:** `pipeline-dispatcher.yml` now reads thresholds from
`.github/pipeline/config.yml` via the authoritative reader
`scripts/pipeline-config.mjs`. Every dispatch run logs the resolved config
at the top of the step output (including the `_source` — `file` or
`defaults` with a reason). A single-knob edit in `config.yml` propagates
to the dispatcher on the next run, no code change required.

One operational value stays intentionally hardcoded: the per-run task
dispatch ceiling (`pendingTasks.slice(0, 3)`) — deliberate cap, not a
tuning knob. Future slice can promote it to `dispatcher.tasks_per_run`
in `config.yml` if the dispatch volume pattern changes.

---

## Validation rules — `reviewStatus`

`reviewStatus` validation is **stage-aware** in two different places, each
with its own contract. Both paths agree on the same schema enum:

```
draft_ai | draft_human | under_review | certified | disputed | deprecated
```

The authoritative source of this enum is
[`site/src/content.config.ts`](../site/src/content.config.ts). The workflow
and the runner each keep a local copy to avoid requiring Zod in the
Actions environment; a future task-shape-formalization slice will
consolidate.

### Path A — `pipeline-validate.yml` (file-state rule)

Fires on every PR that touches `site/src/content/**/*.md[x]`. It has no
task-id context, so it distinguishes intent from what the git diff shows:

| File state on this PR | Required `reviewStatus` | Rationale |
|---|---|---|
| **New** (added, not on `main` before) | Must be `draft_ai` | Draft-generation — new articles begin as AI drafts awaiting review. |
| **Edited** (existed on `main`, modified) | Any schema-enum value | Review / backfill / reprocess work is allowed to preserve live states. No forced downgrade. |

This is the hard gate a PR must pass before it can merge to `main`. It
covers both pipeline-driven PRs (discovery branch, corpus-review queue)
and manual human edits.

### Path B — `pipeline-run-task.mjs` (declarative rule from task file)

When an agent runs a pipeline task, the runner's `--validate` checks the
frontmatter's `reviewStatus` against the rule declared in the task's
`acceptance.review_status` field:

| Task rule form | Meaning | When to use |
|---|---|---|
| String, e.g. `"draft_ai"` | Exact match required | Discovery / ingest / draft-generation tasks |
| `"*"` (wildcard) | Any schema-enum value accepted | Review / backfill / reprocess tasks that shouldn't force downgrade |
| Array, e.g. `["draft_ai","under_review"]` | Any-of (must also be in the schema enum) | Constrained allow-lists for specific task types |
| Missing / `null` | Defaults to `"draft_ai"` (exact match) | Safe legacy fallback for older task files |

The runner's task-brief output renders the rule it will enforce for the
current task, so agents always see what's expected before they start.

### Two paths, one intent

Path A (workflow) and Path B (runner) are complementary, not redundant:

- **Path B** is what the agent experiences while executing a task — it
  reads the task's declared rule and validates against it locally.
- **Path A** is the final gate at merge time. It doesn't see tasks, only
  files and their git-state, and applies the new-vs-edit rule.

Both paths agree on the end state for draft-generation (must be
`draft_ai`) and both allow review/reprocess work to preserve live
statuses. A PR that satisfies Path B will satisfy Path A as long as the
task's rule is honest about whether the output is new or edited.

### Worked examples

| Scenario | Path A (workflow) | Path B (runner) |
|---|---|---|
| Discovery creates a new zero-day article with `reviewStatus: draft_ai` | File is new → PASS (must be `draft_ai`, and it is) | Task rule is `"draft_ai"` → PASS (exact match) |
| Review task leaves a certified incident at `reviewStatus: certified` | File existed on main → PASS (any schema-enum) | Task rule is `"*"` → PASS (any schema-enum) |
| Review task accidentally changes a certified incident to `reviewStatus: draft_ai` | File existed on main → PASS (still schema-enum) | Task rule is `"*"` → PASS (but this is a semantic downgrade — caught in human review, not validator) |
| Someone submits a new article with `reviewStatus: certified` | File is new → **FAIL** (new must be `draft_ai`) | N/A (no task context) |
| Task file omits `acceptance.review_status` entirely | N/A | Defaults to `"draft_ai"` → exact match required (safe legacy behavior) |

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
