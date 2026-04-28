# Pipeline Test Plan

**Version:** 1.0
**Last updated:** 2026-04-14

This document covers validation tests and edge cases for the Threatpedia pipeline.
Tests are organized by component and labeled with expected behavior.

---

## 1. Manual Submission (Issue → Task)

### Happy Path
- [ ] **T1.1** — Submit Issue with all fields populated → task JSON created in `.github/pipeline/tasks/`, Issue gets comment with task ID and `pipeline/queued` label
- [ ] **T1.2** — Submit Issue with only required fields (topic + 1 URL) → task created with defaults
- [ ] **T1.3** — Submit P0 priority → task created with P0, dispatcher prioritizes it first

### Edge Cases
- [ ] **T1.4** — Submit Issue with no topic → Action posts error comment, adds `pipeline/error` label, no task file created
- [ ] **T1.5** — Submit Issue with no source URLs → task created but `sources` array empty (agent must find sources independently)
- [ ] **T1.6** — Submit Issue with malformed CVE (e.g., "CVE-abcd-1234") → CVE filtered out, task created without it
- [ ] **T1.7** — Submit duplicate source URL (already present in corpus/task queue) → no task file created, Issue gets dedup comment + `pipeline/duplicate` label
- [ ] **T1.8** — Submit Issue on a repo fork → Action should not trigger (scoped to main repo)
- [ ] **T1.9** — Two Issues submitted simultaneously → each gets unique task ID (sequential numbering from max existing)

---

## 2. Dispatcher

### Happy Path
- [ ] **T2.1** — Single pending task with no dependencies → dispatcher creates Issue with `pipeline/ready` label
- [ ] **T2.2** — Multiple pending tasks → dispatched in priority order (P0 > P1 > P2 > P3), max 3 per run
- [ ] **T2.3** — Manual trigger with specific `task_id` → only that task dispatched

### Sequencing & Dependencies
- [ ] **T2.4** — Task with `depends_on: [TASK-2026-0001]` where 0001 is `complete` → task dispatched normally
- [ ] **T2.5** — Task with `depends_on: [TASK-2026-0001]` where 0001 is `pending` → task set to `blocked`, not dispatched
- [ ] **T2.6** — Task with `depends_on: [TASK-2026-0001]` where 0001 doesn't exist → task set to `blocked`
- [ ] **T2.7** — Blocked task whose dependency later completes → unblocked on next dispatcher run (verify this works)

### Circuit Breaker
- [ ] **T2.8** — 3 consecutive `failed` tasks within 2 hours → circuit breaker trips, alert Issue created, no tasks dispatched
- [ ] **T2.9** — 3 failed tasks but spread over 6+ hours → circuit breaker does NOT trip (failures not consecutive in time window)
- [ ] **T2.10** — Circuit breaker tripped, alert Issue closed → next dispatcher run resumes normally

### Backpressure
- [ ] **T2.11** — 50+ tasks in editorial stages (draft complete / validation / review) → dispatcher logs backpressure, skips new drafts
- [ ] **T2.12** — Queue drops to 39 → dispatcher resumes dispatching (below backpressure_resume of 40)

### Stale Locks
- [ ] **T2.13** — Task locked 45 minutes ago → lock released, status set back to `pending`
- [ ] **T2.14** — Task locked 10 minutes ago → lock preserved (within 30-minute threshold)
- [ ] **T2.15** — Task locked with no `locked_at` timestamp → treated as stale (defensive)

---

## 3. Automated Discovery (CISA KEV)

### Happy Path
- [ ] **T3.1** — New CVE in KEV catalog added in last 14 days → task created as `zero-day` type, P1 priority
- [ ] **T3.2** — Multiple new CVEs → up to 5 tasks created per run (cap enforced)
- [ ] **T3.3** — Manual trigger with `source: cisa_kev` → only KEV scanned

### Deduplication
- [ ] **T3.4** — CVE already has a task in `.github/pipeline/tasks/` → skipped, no duplicate task
- [ ] **T3.5** — CVE already mentioned in existing article (in `site/src/content/`) → skipped
- [ ] **T3.6** — CVE in both existing task AND existing article → skipped (double-covered)

### Resilience
- [ ] **T3.7** — CISA KEV API returns 500 → Action logs warning, exits cleanly, no crash
- [ ] **T3.8** — CISA KEV API returns malformed JSON → Action catches parse error, exits cleanly
- [ ] **T3.9** — Network timeout on fetch → Action fails gracefully with warning

---

## 4. Validation (PR Check)

### Happy Path
- [ ] **T4.1** — PR with valid article (all checks pass) → comment posted with all green checks, `pipeline/validated` label added
- [ ] **T4.2** — PR with multiple articles → each validated independently, all results in one comment

### Failure Cases
- [ ] **T4.3** — Article missing frontmatter → check fails, `:x:` in report, PR blocked
- [ ] **T4.4** — Article with `reviewStatus: certified` (instead of `draft_ai`) → check fails
- [ ] **T4.5** — Article with < 5 H2 sections → check fails with count shown
- [ ] **T4.6** — Article missing Sources section → check fails
- [ ] **T4.7** — Article missing MITRE mappings in frontmatter → check fails with count 0
- [ ] **T4.8** — EDIT-RULE-030 violation (no blank line before heading) → check flags it

### Build Gate
- [ ] **T4.9** — Article that causes Astro build failure (e.g., invalid frontmatter type) → build step fails, PR blocked
- [ ] **T4.10** — Article that passes validation but build takes > 5 minutes → investigate, but should pass (current build is ~3s)

### Edge Cases
- [ ] **T4.11** — PR with no article changes (e.g., CSS only) → validation step skipped, "no articles detected" comment
- [ ] **T4.12** — PR updated (force push) → validation re-runs, existing bot comment updated (not duplicated)
- [ ] **T4.13** — PR with article in wrong directory (e.g., incident in `zero-days/`) → frontmatter type mismatch caught by schema validation during build

---

## 5. End-to-End Pipeline

### Full Flow
- [ ] **T5.1** — Manual submission → task created → dispatcher runs → Issue created → agent generates article → PR opened → validation passes → merge → deploy → article live
- [ ] **T5.2** — Auto-discovery (KEV) → task created → dispatcher → agent → PR → validate → merge → deploy

### Agent Agnosticism
- [ ] **T5.3** — Task executed by Claude (via generate-article.mjs) → article passes validation
- [ ] **T5.4** — Task executed by a different agent (manually following task file instructions) → article passes same validation checks
- [ ] **T5.5** — Task file contains enough context for an agent with zero prior Threatpedia knowledge to produce a valid article

### Data Integrity
- [ ] **T5.6** — Two agents pick up the same task simultaneously → only one should succeed (lock mechanism)
- [ ] **T5.7** — Agent crashes mid-generation → stale lock released on next dispatcher run, task returns to pending
- [ ] **T5.8** — Generated article has slug collision with existing article → generate-article.mjs appends `-new.md`, validation catches it
- [ ] **T5.9** — Pipeline generates article for CVE that was already covered → dedup in discovery should prevent this; if it slips through, validation should still pass (duplicate content is an editorial concern, not a pipeline failure)

### Concurrency
- [ ] **T5.10** — Dispatcher and discovery run at the same time → no file conflicts (different commit scopes)
- [ ] **T5.11** — Two PRs for different articles open simultaneously → both validate independently, both can merge
- [ ] **T5.12** — PR merge conflicts with main (e.g., manifest changed) → standard git conflict resolution, no data loss

### Recovery
- [ ] **T5.13** — Task fails 3 times → circuit breaker trips → human resolves → closes alert Issue → pipeline resumes
- [ ] **T5.14** — Discovery creates task for something that shouldn't be an article (false positive) → human closes the Issue, marks task as `cancelled`
- [ ] **T5.15** — Validation passes but article has factual errors → this is expected for `draft_ai` status. Human review upgrades or disputes later.

---

## 6. Security & Safety

- [ ] **T6.1** — Issue template rejects submissions without `pipeline/discovery` label (Action `if` guard)
- [ ] **T6.2** — ANTHROPIC_API_KEY not set in secrets → generate-article.mjs fails with clear error, not a leak
- [ ] **T6.3** — Submitted source URL contains malicious content → agent processes text, no code execution risk (LLM generation is text-only)
- [ ] **T6.4** — Pipeline never pushes directly to main → all changes go through PR + validation
- [ ] **T6.5** — Bot commits use `github-actions[bot]` identity → audit trail preserved
- [ ] **T6.6** — Task files never contain secrets → only topic, URLs, metadata

---

## Running Tests

### Manual Validation
Most tests are validated manually during the initial pipeline rollout:

1. Create a test submission via Issue template
2. Verify task file created
3. Trigger dispatcher manually (`workflow_dispatch`)
4. Verify Issue created with `pipeline/ready` label
5. Run `generate-article.mjs` for the task topic on a branch
6. Open PR → verify validation comment
7. Merge → verify deploy

### Automated Regression
Future: create a `.github/workflows/pipeline-test.yml` that:
- Creates a mock task file
- Runs validation against test fixtures (known-good and known-bad articles)
- Verifies frontmatter parsing, field detection, rule checks
- Runs on PR to pipeline workflow files
