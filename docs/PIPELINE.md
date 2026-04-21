# Threatpedia Pipeline — End-to-End Flow

**Audience:** Agents (Claude Code, Gemini, humans) operating the pipeline.
**Scope:** The **fresh content** lane (pipeline-led). Historical-landmark and
bulk-support lanes are out of scope here (see ADR 0009).

---

> **Visual overviews.** Four Mermaid diagrams live alongside this doc:
>
> - [`.github/pipeline/diagrams/architecture.md`](../.github/pipeline/diagrams/architecture.md) — system-level (two-repo split, content collections, schema authority)
> - [`.github/pipeline/diagrams/pipeline-flow.md`](../.github/pipeline/diagrams/pipeline-flow.md) — task lifecycle end-to-end
> - [`.github/pipeline/diagrams/discovery-rejection.md`](../.github/pipeline/diagrams/discovery-rejection.md) — discovery + rejection-memory lane
> - [`.github/pipeline/diagrams/dispatcher-guardrails.md`](../.github/pipeline/diagrams/dispatcher-guardrails.md) — dispatcher state machine (config load + four gates)
>
> Themed to match the site (dark surface, IBM Plex Mono, amber accent). GitHub renders Mermaid inline.

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
| `.github/workflows/pipeline-post-merge-audit.yml` | GitHub Actions push workflow — re-validates changed merged content on `main` and opens/updates an audit issue on failure | Push to `main` + manual dispatch |
| `scripts/pipeline-run-task.mjs` | Node script — agent-agnostic task runner and validator | Invoked by the dispatcher, executed under the agent's subscription |
| `scripts/validate-content-corpus.mjs` | Shared content validator for PR gating and post-merge audits | Invoked by workflows, reads newline-delimited changed-file lists |

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
       (tasks now on `main`) or **closed-without-merging** (discarded batch). Both
       cases collapse to: **reset the branch to `origin/main`** so discarded
       branch-only tasks do not linger on the long-lived discovery branch, and
       merged tasks aren't counted as new. Force-push the reset.
   - Calls `node scripts/pipeline-discover.mjs --mode all --days 14 --limit 5 --execute`
   - Script loads `.github/pipeline/config.yml`, installs lane-specific
     headroom limits, then runs the currently supported discovery lanes:
     - **zero-day:** CISA KEV + NVD CVSS enrichment
     - **incident:** CISA alerts/advisories RSS + NCSC News RSS + Microsoft Security Blog RSS
     - **threat-actor promotion:** scans the recent incident corpus within the requested lookback window, skips actors already present in the corpus or pending threat-actor tasks (including known aliases), and promotes only evidence-backed names into new threat-actor tasks
   - Discovery builds dedup indexes against the live corpus and existing tasks
     using CVEs, source URLs, normalized titles, output slugs, and rejected
     candidate keys; allocates a
     year-namespaced exploitId per ADR 0007 for zero-day candidates; and writes
     one `TASK-2026-NNNN.json` per surviving candidate to
     `.github/pipeline/tasks/` **on the branch** (not `main`).
   - Commits and pushes the branch. **Branch protection on `main` is
     respected** — nothing pushes directly to `main`.
   - Opens or updates a PR from `pipeline/discovery` to `main` with the
     `pipeline/discovery` label. The PR body enumerates every task on the
     branch with task ID, type, priority, score, auto-cert eligibility,
     reference, and topic. **Merge** to accept the whole batch; **close without
     merging** to discard the staged batch. To make a rejection durable across
     future discovery runs, use the rejection-memory workflow and merge its PR.
   - If no new candidates this run, no branch change, no PR churn.

2. **Queue backpressure check** (next dispatcher tick)
   - `pipeline-dispatcher.yml` loads all tasks. If the count of tasks with
     `status: pr_open` (plus any legacy `validation | review` stage items) is
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
   - Dispatcher bookkeeping is published on the long-lived
     `pipeline/dispatcher` branch, not pushed directly to `main`.
     The workflow opens or updates a PR labeled `pipeline/dispatcher`
     carrying task-state-only changes (dispatch notes, stale-lock
     releases, dependency blocking). Merge the PR to persist dispatcher
     state; close it to discard the bookkeeping batch and let the next
     run reset `pipeline/dispatcher` back to `origin/main`.
   - If a task already has an open `pipeline/ready` Issue, the dispatcher
     does **not** open a duplicate Issue on the next tick. It records the
     existing Issue number in task history once and moves on.

7. **Agent execution** (under the agent's own subscription)
   - Agent reads the task brief, drafts the article into
     `site/src/content/<type>/<slug>.md` on the `pipeline/TASK-XXXX`
     branch, runs `pipeline-run-task.mjs --task TASK-XXXX --validate`,
     iterates until validation passes, then runs `--open-pr` to create
     (or reuse) the PR and record `status: pr_open` in one step.

8. **Validation gate**
   - `--validate` enforces `.github/pipeline/config.yml` `validation.*`
     rules plus exact section/schema normalization: canonical H2 headings,
     exact source-line format, frontmatter/body source URL parity, canonical
     MITRE tactic casing, canonical publisher aliases, and canonical
     `generatedBy` values.
   - Failure leaves the task locked for agent iteration; success allows the
     agent to record a real open PR number, which moves the task to
     `status: pr_open`.

9. **Human review + merge**
   - `auto_merge.enabled: false` today — every PR goes to Kernel K for
     review. Merge state is no longer trusted from the local CLI. A GitHub PR
     event records the final task transition after the PR is merged (or reverts
     the task to `pending` if the PR is closed without merge).

---

## Guardrail quick reference

| Guardrail | Where it lives | Default | Source of truth |
|---|---|---|---|
| Corpus + task dedup | `pipeline-discover.mjs` | Scans all content collections + all existing tasks using CVEs, URLs, normalized titles, and output slugs | Script |
| Rejection memory (operator veto) | `pipeline-discover.mjs` reads `.github/pipeline/rejected-candidates.json` | Rejected CVEs and non-CVE candidate keys skipped at discovery time | File on `main`; see Rejection memory section |
| Discovery lookback | workflow env `DAYS` → `--days` | 14 days | Workflow input |
| Discovery per-run cap | workflow env `LIMIT` → `--limit` | 5 tasks | Workflow input |
| Discovery lane selection | workflow env `MODE` → `--mode` | `all` | Workflow input |
| Discovery publishes via | `pipeline/discovery` branch + auto-PR | labeled `pipeline/discovery`, no direct push to `main` | Workflow |
| Dispatcher publishes via | `pipeline/dispatcher` branch + auto-PR | labeled `pipeline/dispatcher`, no direct push to `main`; skips duplicate `pipeline/ready` Issues when one is already open | Workflow |
| PR batch review | Human merge (not auto-merge) | Nothing lands on `main` without review | Workflow + branch protection |
| Editorial queue backpressure (hysteresis) | `pipeline-dispatcher.yml` (via `scripts/pipeline-config.mjs`); state tracked via labeled GitHub Issue (`pipeline/backpressure`) | Pause at 50 pending · stay paused until queue < 40 (auto-resume + Issue auto-close) | `config.yml` (`queues.editorial.max_pending` / `backpressure_resume`) |
| Stale-lock timeout | `pipeline-dispatcher.yml` (via `scripts/pipeline-config.mjs`) | 30 minutes | `config.yml` (`scheduling.stale_lock_minutes`) |
| Circuit breaker | `pipeline-dispatcher.yml` (via `scripts/pipeline-config.mjs`) | 3 failures in 120min → Issue + halt; 60min cooldown | `config.yml` (`circuit_breaker.*`) |
| Dependency blocking | `pipeline-dispatcher.yml` | Per-task `depends_on[]` | Task file |
| Validation gates | `pipeline-run-task.mjs --validate` | See `config.yml` `validation.*` | `config.yml` |

**Config authority:** `pipeline-dispatcher.yml` now reads thresholds from
`.github/pipeline/config.yml` via the authoritative reader
`scripts/pipeline-config.mjs`. Every dispatch run logs the resolved config
at the top of the step output (including the `_source` — `file` or
`defaults` with a reason, plus `_path` when sourced from a file). A
single-knob edit in `config.yml` propagates to the dispatcher on the
next run, no code change required.

**Config parser:** `scripts/pipeline-config.mjs` parses `config.yml`
via `js-yaml` (see `scripts/package.json`). Earlier versions shipped a
hand-rolled parser; Slice 4e swapped it after verifying byte-identical
output against the live config. Safe-default fallbacks remain in place
for every failure mode: `file-not-found`, `read-error`, `parse-error`,
and a new `shape-error` (triggered when the parsed root is not a map —
e.g. a stray scalar or array at the top level). The dispatcher never
fails-closed on a config issue; it falls back to `DEFAULTS` and logs
the reason.

**Shared schema enum authority:** JavaScript-side schema enums (currently
`SCHEMA_REVIEW_STATUSES`) live in `scripts/pipeline-schema.mjs` as the
single source of truth for the pipeline scripts. The runner imports it
directly; the shared content validator (`scripts/validate-content-corpus.mjs`)
also imports it and now backs both the PR validator workflow and the
post-merge `main` audit. The ultimate schema authority remains
`site/src/content.config.ts` — the JS mirror must be updated in the same
PR when the Zod schema changes.

**Post-merge integrity backstop:** merged content changes on `main` are
re-audited via `.github/workflows/pipeline-post-merge-audit.yml`. The
workflow reuses the same shared validator as the PR gate, runs a site
build, and opens or updates a standing Issue (`pipeline/audit-failure`)
instead of attempting auto-repair. When a later run returns green, the
workflow closes that Issue automatically.

**Backpressure hysteresis:** the dispatcher pauses draft dispatch when
the editorial queue hits `max_pending` and stays paused until the queue
drains below `backpressure_resume`. State is tracked via a labeled
GitHub Issue (`pipeline/backpressure`) — the same Issue-as-state pattern
the circuit breaker uses — so there's no new persisted file or branch.
Unlike the circuit breaker (which requires operator acknowledgement),
backpressure auto-closes its Issue on the first cycle where the queue
falls below the resume threshold.

One operational value stays intentionally hardcoded: the per-run task
dispatch ceiling (`pendingTasks.slice(0, 3)`) — deliberate cap, not a
tuning knob. Future slice can promote it to `dispatcher.tasks_per_run`
in `config.yml` if the dispatch volume pattern changes.

---

## Task JSON — canonical shape

Tasks in `.github/pipeline/tasks/` follow a canonical shape. **Writers**
(discovery, ingest-issue, any future task emitter) must emit the
canonical form. **Readers** tolerate named legacy aliases for backward
compatibility — no existing task file on disk fails to load.

| Field | Canonical | Tolerated legacy alias | Enforcement |
|---|---|---|---|
| Top-level acceptance block | `acceptance_criteria` | `acceptance` | Runner's `getAcceptance()` reads canonical first, falls back to alias. Dispatcher's Issue-body renderer does the same. |
| Build-pass field (inside acceptance block) | `astro_build` | `build_passes` | Runner displays whichever is present; validator workflow does not key on it. All 112 tasks migrated to canonical (TASK-2026-0066). |
| History creation entry | `action: 'created'` AND `{from: 'none', to: 'pending'}` (both fields on the first entry) | `action`-only, `{from, to}`-only (transition entries only; see below) | Runner's "Created" display finds `h.action === 'created'`; transition rendering uses `{from, to}`. Creation entries migrated to canonical across all 112 task files in Slice 4d; readers still accept legacy shapes on transition entries. |

### Transition history stays legacy-tolerant

Creation entries (`history[0]`) are canonical across the entire corpus
as of Slice 4d. **Transition entries (`history[1..]`) are deliberately
left alone** — readers have always been tolerant of their mixed shapes
(47 × `completed`, 14 × `complete`, 10 × from/to-only across the
corpus), and there is no operator-visible benefit to rewriting them.
Normalizing transition entries is a candidate for a future slice if
there's a forcing function.

### Schema enum authority

JS-side schema enums (currently `SCHEMA_REVIEW_STATUSES`) live in
`scripts/pipeline-schema.mjs` as the single source of truth. The
authoritative schema definition remains `site/src/content.config.ts`
(Zod) — the JS mirror must be updated in the same PR when the
authoritative schema changes. There is no automated sync.

### Writer paths (all emit canonical post-Slice 4b)

| Path | Emits |
|---|---|
| `scripts/pipeline-discover.mjs` | `acceptance_criteria` · `astro_build` |
| `.github/workflows/pipeline-ingest-issue.yml` | `acceptance_criteria` · `astro_build` |
| `.github/pipeline/tasks/*` (corpus, 112 files) | `acceptance_criteria` · `astro_build` |
| `scripts/pipeline-reject.mjs` (via `pipeline-reject.yml`) | `.github/pipeline/rejected-candidates.json` entries — see Rejection memory |
| `scripts/pipeline-history-backfill.mjs` (Slice 4d one-shot migration) | Canonical creation entry on existing `.github/pipeline/tasks/*.json` |

If a new writer lands that emits the legacy alias, readers will still
work — but it should be updated to the canonical form in the same PR.

---

## Rejection memory

Discovery re-surfaces the same CVE on every 6h cron run unless it shows up
as "already known" in dedup. Before Slice 4c, dedup only knew about two
sources: the live corpus and the open task set. Closing an accumulation PR
without merging left no durable signal, so vetoed candidates came back.

Slice 4c adds **rejection memory**: a repo-visible, PR-gated file that
records operator-vetoed discovery candidates. Discovery reads it during
dedup. Removing an entry (via PR edit) restores discovery eligibility.

### Where it lives

- **File:** [`.github/pipeline/rejected-candidates.json`](../.github/pipeline/rejected-candidates.json) on `main`
- **Key:** one of:
  - `cve` — CVE string, normalized to upper-case on both write and read
  - `candidate_key` — stable non-CVE key (for example incident feed + URL)
- **Shape:**
  ```json
  {
    "version": "1.0",
    "description": "...",
    "lastUpdated": "2026-04-18T04:00:00Z",
    "rejected": [
      {
        "cve": "CVE-2026-34197",
        "rejected_at": "2026-04-18T04:10:00Z",
        "reason": "operator veto",
        "topic": "Apache ActiveMQ ...",
        "rejected_via_pr": 60
      },
      {
        "candidate_key": "incident:ncsc_news:https://www.ncsc.gov.uk/news/example",
        "candidate_type": "incident",
        "source_feed": "ncsc_news",
        "rejected_at": "2026-04-21T19:10:00Z",
        "reason": "not a bounded incident",
        "topic": "Example incident candidate"
      }
    ]
  }
  ```

### How rejection happens

1. Operator runs the `Pipeline: Reject Discovery Candidate` workflow
   (`workflow_dispatch`), providing either `cve` or `candidate_key`, plus
   `reason`, and optionally `candidate_type`, `source_feed`, `topic`, and `pr`.
2. The workflow invokes [`scripts/pipeline-reject.mjs`](../scripts/pipeline-reject.mjs)
   on a fresh branch `pipeline/reject-*`, which appends a rejection entry and
   updates `lastUpdated`.
3. The workflow opens a PR against `main` labeled `pipeline/rejection`.
   **No direct push to `main`** — Kernel K reviews and merges.
4. Next discovery run honors the new entry.

**Durable retry path.** The workflow handles pre-existing remote branches
for the same rejection target without operator cleanup:

- If no matching `pipeline/reject-*` branch exists on the remote → clean start.
- If the branch exists and has an **open** rejection PR → the workflow
  errors out with a clear message; the operator resolves that PR (merge
  or close) and re-dispatches.
- If the branch exists but has **no open PR** (previous attempt was
  merged or closed without merge, and the branch was never deleted) →
  the workflow deletes the stale remote ref and creates a fresh branch
  from `main`. No force-push semantics required.

This mirrors the spirit of the stale-branch handling in the discovery
workflow: prior state gets collapsed to a clean starting point before
push.

### How discovery honors the file

`pipeline-discover.mjs` builds `Set<string>` indexes of rejected CVEs and
rejected non-CVE candidate keys at startup, in addition to the corpus +
tasks dedup set. Any candidate whose CVE or candidate key is in
the set is skipped at the filter stage with a `::notice::` for audit
visibility. The per-run summary prints the count of rejection skips
separately from the corpus/task dupe count.

**Compatibility-safe fallback:** if the file is missing or malformed,
discovery logs a `::warning::` and proceeds with an empty rejection set.
The file is never required to exist for discovery to run.

### Re-eligibility

**Manual only.** Operator opens a follow-up PR that removes the entry
from `rejected[]`, KK reviews and merges, next discovery cron re-surfaces
the candidate. There is no automatic timeout — operator veto is sticky
until explicitly reversed. (Rationale: KEV re-issuance of a "rejected"
CVE typically means the rejection was the wrong call; the operator
should reconsider explicitly.)

### Out of scope for this slice

- Validator-side enforcement — rejection is a discovery-time filter only.
- Any automatic rejection paths — only the `workflow_dispatch` route.

---

## Validation rules — `reviewStatus`

`reviewStatus` validation is **stage-aware** in two different places, each
with its own contract. Both paths agree on the same schema enum:

```
draft_ai | draft_human | under_review | certified | disputed | deprecated
```

The authoritative source of this enum is
[`site/src/content.config.ts`](../site/src/content.config.ts). The shared
JS-side mirror lives in
[`scripts/pipeline-schema.mjs`](../scripts/pipeline-schema.mjs) and is
consumed by both the runner (`import`) and the validator workflow (CLI
shell-out via `--key reviewStatuses`). The validator workflow keeps a
local fallback constant only as a safety net in case the shared module
fails to load, with an Actions-level `::warning::` annotation when the
fallback fires. There is no duplicated primary constant.

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

```bash
# From repo root
node scripts/pipeline-discover.mjs --mode all --days 14 --limit 5
node scripts/pipeline-discover.mjs --mode incident --days 7 --limit 3
```

**Run discovery for real** (writes tasks; commit yourself):

```bash
node scripts/pipeline-discover.mjs --mode all --days 14 --limit 5 --execute
git add .github/pipeline/tasks/
git commit -m "chore(pipeline): manual discovery run"
```

**From GitHub Actions** — use the `Pipeline: Automated Discovery` workflow's
**Run workflow** button; choose the lane with `mode` and choose dry-run by
setting `execute: false`.

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

**Open or record a PR in one step**:

```
node scripts/pipeline-run-task.mjs --task TASK-2026-0071 --open-pr
```

**Record an already-open PR by number**:

```
node scripts/pipeline-run-task.mjs --task TASK-2026-0071 --open-pr --pr 123
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
