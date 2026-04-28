# Threatpedia Pipeline Architecture

**Version:** 1.0
**Last updated:** 2026-04-14

## Overview

The Threatpedia pipeline automates the lifecycle of threat intelligence articles from discovery to publication. It is designed to be **agent-agnostic** (any AI agent or human can execute any task), **fail-safe** (precondition guards, circuit breakers, backpressure), and **auditable** (all state in git, all transitions logged).

## Pipeline Flow

```
                                ┌─────────────────────┐
                                │   MANUAL SUBMISSION  │
                                │  (GitHub Issue Form) │
                                └──────────┬──────────┘
                                           │
                      ┌────────────────────┤
                      │                    │
         ┌────────────▼──────────┐  ┌──────▼──────────────┐
         │   AUTO DISCOVERY      │  │  INGEST ISSUE       │
         │  (CISA KEV, NVD)      │  │  (Issue → Task JSON)│
         │  Cron: every 6h       │  │  Trigger: on issue  │
         └────────────┬──────────┘  └──────┬──────────────┘
                      │                    │
                      └────────┬───────────┘
                               │
                               ▼
                  ┌────────────────────────┐
                  │     TASK QUEUE         │
                  │ .github/pipeline/tasks │
                  │                        │
                  │  Status: pending       │
                  │  Priority: P0-P3      │
                  │  Dependencies: [...]   │
                  └────────────┬───────────┘
                               │
                               ▼
                  ┌────────────────────────┐
                  │     DISPATCHER         │
                  │  Cron: every 2h        │
                  │                        │
                  │  ✓ Check circuit       │
                  │    breaker             │
                  │  ✓ Check backpressure  │
                  │    (queue < 50)        │
                  │  ✓ Release stale locks │
                  │    (> 30 min)          │
                  │  ✓ Check dependencies  │
                  │  ✓ Priority sort       │
                  └────────────┬───────────┘
                               │
                      Creates GitHub Issue
                      labeled: pipeline/ready
                               │
                               ▼
                  ┌────────────────────────┐
                  │     AGENT EXECUTION    │
                  │                        │
                  │  Any agent can:        │
                  │  1. Read task JSON     │
                  │  2. Read specs         │
                  │  3. Generate article   │
                  │  4. Create branch      │
                  │  5. Open PR            │
                  └────────────┬───────────┘
                               │
                               ▼
                  ┌────────────────────────┐
                  │     VALIDATION         │
                  │  (Automated PR Check)  │
                  │                        │
                  │  ✓ Frontmatter valid   │
                  │  ✓ Required fields     │
                  │  ✓ reviewStatus =      │
                  │    draft_ai            │
                  │  ✓ H2 sections >= 5    │
                  │  ✓ Sources section     │
                  │  ✓ MITRE mappings >= 1 │
                  │  ✓ EDIT-RULE-030       │
                  │  ✓ Astro build passes  │
                  └────────────┬───────────┘
                               │
                        ┌──────┴──────┐
                        │             │
                   All pass      Any fail
                        │             │
                        ▼             ▼
              ┌──────────────┐ ┌──────────────┐
              │  VALIDATED   │ │  BLOCKED     │
              │  Label added │ │  Fix & retry │
              └──────┬───────┘ └──────────────┘
                     │
                     ▼
              ┌──────────────┐
              │   APPROVAL   │
              │  Kernel K    │
              │  merges PR   │
              └──────┬───────┘
                     │
                     ▼
              ┌──────────────┐
              │   DEPLOY     │
              │  main push   │
              │  → Astro     │
              │  → GitHub    │
              │    Pages     │
              │  → LIVE      │
              └──────────────┘
```

## Component Reference

| Component | File | Trigger | Function |
|---|---|---|---|
| **Config** | `.github/pipeline/config.yml` | — | Central configuration for all pipeline values |
| **Task Schema** | `.github/pipeline/schema/task-schema.json` | — | JSON Schema for task file validation |
| **Task Queue** | `.github/pipeline/tasks/*.json` | — | Task files (one per article) |
| **Manual Submission** | `.github/ISSUE_TEMPLATE/discovery-submission.yml` | User opens Issue | Structured form for article leads |
| **Issue Ingestion** | `.github/workflows/pipeline-ingest-issue.yml` | Issue opened with `pipeline/discovery` label | Converts Issue → task JSON |
| **Auto Discovery** | `.github/workflows/pipeline-discovery.yml` | Cron (6h) or manual | Scans CISA KEV for new CVEs |
| **Dispatcher** | `.github/workflows/pipeline-dispatcher.yml` | Cron (2h) or manual | Checks preconditions, assigns tasks |
| **Validation** | `.github/workflows/pipeline-validate.yml` | PR with content changes | Schema + build validation on PRs |
| **Article Generator** | `scripts/generate-article.mjs` | Agent-invoked | Claude API article generation |
| **Deploy** | `.github/workflows/deploy.yml` | Push to main | Astro build → GitHub Pages |
| **Test Plan** | `.github/pipeline/TESTING.md` | — | 40+ test cases and edge cases |

## Failsafe Mechanisms

### Circuit Breaker
3 consecutive task failures within 2 hours → pipeline halts. Alert Issue created automatically. Resolution: close the alert Issue after fixing the root cause. Next dispatcher run resumes.

### Backpressure
Editorial queue limit: **50 articles**. When reached, dispatcher stops dispatching new drafts. Resumes when queue drops below 40. Prevents article generation from outpacing review capacity.

### Stale Lock Recovery
Tasks locked for > 30 minutes are automatically released by the dispatcher. Prevents a crashed agent from permanently blocking a task.

### Dependency Guards
Tasks with `depends_on` are not dispatched until all dependencies are `complete`. Prevents out-of-order execution (e.g., incident article before its threat actor profile).

### Deduplication
- Discovery Action checks existing tasks AND existing articles for CVE coverage
- Prevents duplicate articles for the same vulnerability
- Manual submission ingest also deduplicates by normalized source URL against existing tasks and corpus content
- Manual submissions that collide are labeled `pipeline/duplicate` and do not create a task file

### Validation Gates
Every article PR runs automated checks before merge:
- Frontmatter schema validation
- Required fields per article type
- H2 section count
- Source and MITRE mapping presence
- Formatting rules (EDIT-RULE-030, etc.)
- Full Astro build must pass

## Agent Agnosticism

The pipeline is designed so that **any agent can execute any task**. This is achieved through:

1. **Self-contained task files** — each task JSON contains the topic, source URLs, candidate data, spec references, and acceptance criteria. No external context needed.
2. **Spec references** — tasks point to the exact spec sections to follow. The agent reads those specs and follows them.
3. **Machine-checkable acceptance** — every acceptance criterion is verifiable by the validation Action. If the article passes validation, it meets spec regardless of which agent produced it.
4. **No memory dependency** — tasks don't reference previous sessions, chat histories, or agent-specific state.

### Execution Model: Subscription-Based

The pipeline does **not** call any AI API directly. There is no API key in the pipeline. Instead:

1. Pipeline creates a task (via discovery or manual submission)
2. Agent (or human) picks up the task under their own subscription
3. Agent reads the brief: `node scripts/pipeline-run-task.mjs --task TASK-2026-XXXX`
4. Agent generates the article (using Claude Code, Gemini, ChatGPT, or manual writing)
5. Agent validates: `node scripts/pipeline-run-task.mjs --task TASK-2026-XXXX --validate`
6. Agent opens PR → automated validation → merge

### Task Runner CLI

```bash
# List pending tasks
node scripts/pipeline-run-task.mjs --list

# View full task brief (specs, schema, sources, acceptance criteria)
node scripts/pipeline-run-task.mjs --task TASK-2026-0001

# Lock task for execution (prevents other agents from picking it up)
node scripts/pipeline-run-task.mjs --task TASK-2026-0001 --lock

# Validate generated article (schema + build check)
node scripts/pipeline-run-task.mjs --task TASK-2026-0001 --validate

# Mark complete after PR is opened
node scripts/pipeline-run-task.mjs --task TASK-2026-0001 --complete
```

### Supported Execution Methods

| Method | How |
|---|---|
| **Claude Code** | Point Claude Code at the task brief, it generates the article in your session |
| **generate-article.mjs** | `node scripts/generate-article.mjs --type incident --topic "..."` (requires API key) |
| **Any LLM agent** | Read task brief → generate markdown → commit to branch → open PR |
| **Human** | Write the article manually following the same specs → same PR process |

## Repository Boundaries

```
threatpedia-working (PRIVATE)         threatpedia (PUBLIC)
├── specs/          ─── informs ──→   ├── .github/pipeline/    ← PIPELINE RUNTIME
├── decisions/                        ├── .github/workflows/   ← ACTIONS
├── coordination/   ← legacy queues   ├── scripts/             ← GENERATION
│                                     ├── site/src/content/    ← ARTICLES
│   NOT in execution path.            └── site/dist/           ← DEPLOY
│   Reference material only.
```

The private repo contains specs, ADRs, and coordination design. The public repo contains the pipeline runtime, article content, and deployment. Nothing in the execution path touches the private repo.

## Setup Requirements

Before the pipeline can run:

1. **No API keys needed** — the pipeline orchestrates; agents execute under their own subscriptions
2. **GitHub Labels**: Create labels used by pipeline workflows:
   - `pipeline/discovery`, `pipeline/manual`, `pipeline/queued`, `pipeline/ready`
   - `pipeline/validated`, `pipeline/error`, `pipeline/alert`, `pipeline/circuit-breaker`
   - `type/incident`, `type/campaign`, `type/threat-actor`, `type/zero-day`
   - `priority/p0`, `priority/p1`, `priority/p2`, `priority/p3`
3. **Branch protection**: `main` requires PR review (already configured)
4. **Actions permissions**: `contents: write`, `issues: write`, `pull-requests: write`
