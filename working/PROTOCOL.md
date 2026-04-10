# Threatpedia Working Directory Protocol

**Version:** 1.0
**Status:** Draft pending Kernel K ratification
**Authority:** Kernel K (final approver), DangerMouse-Bot (drafter)

This document defines the rules of engagement for Kernel K, DangerMouse-Bot, and Penfold-Bot working together through the `working/` directory. Read this after `README.md`.

---

## Core Principles

1. **Git is the source of truth.** If it's not committed, it doesn't exist.
2. **Every action leaves a trail.** Logs, decisions, conflicts — write them down.
3. **No agent makes irreversible changes alone.** Kernel K is the trust anchor for anything touching the live corpus, schema, or repo settings.
4. **Conflicts surface, they don't hide.** If something doesn't validate or two agents disagree, file it in `supervisor/conflicts.md` immediately.
5. **One task, one file.** Don't bundle multiple unrelated things into a single inbox/outbox file.
6. **Schema first.** Every artifact references the v1.0 schema (`docs/DATA-STANDARDS-v1.0.md`). If you can't validate against the schema, that's a conflict.

---

## Task File Format

Every file in `inbox/` and `outbox/` follows this structure:

```markdown
---
task_id: TASK-2026-0001              # globally unique, format TASK-YYYY-NNNN
created_by: dangermouse-bot          # who created this task
created_at: 2026-04-10T15:00:00Z     # ISO 8601 UTC
assigned_to: penfold                 # who should pick it up
priority: P1                         # P0 (urgent) | P1 (normal) | P2 (whenever)
status: pending                      # pending | in-progress | completed | blocked
references:
  - working/decisions/0001-rollup-v101-into-v10.md
  - docs/DATA-STANDARDS-v1.0.md#section-9
expected_output: working/outbox/penfold/TASK-2026-0001-result.md
---

## Task

[One-paragraph description of what needs to happen.]

## Context

[Background the agent needs to understand the task.]

## Acceptance Criteria

- [ ] Specific, testable thing 1
- [ ] Specific, testable thing 2
- [ ] Output committed to {expected_output}

## Notes

[Anything else.]
```

The frontmatter is machine-parseable. The body is human-readable. Both matter.

---

## Decision Records (ADRs)

Decisions go in `decisions/` as numbered files: `0001-short-title.md`, `0002-short-title.md`, etc. Format follows the standard ADR template:

```markdown
# 0001 — Short Title

**Date:** 2026-04-10
**Status:** Proposed | Accepted | Superseded by NNNN | Deprecated
**Deciders:** Kernel K, DangerMouse-Bot, Penfold-Bot
**Supersedes:** [link to previous ADR if applicable]

## Context

[What's the situation that demands a decision?]

## Decision

[What did we decide?]

## Rationale

[Why this and not alternatives?]

## Consequences

**Positive:**
- ...

**Negative / Tradeoffs:**
- ...

**Risks:**
- ...

## Alternatives Considered

- **Option A:** ... (rejected because ...)
- **Option B:** ... (rejected because ...)
```

Decisions are immutable after Acceptance. If you need to change a decision, write a new ADR that supersedes it.

---

## Agent Log Format

Agent logs (`agent-notes/dangermouse-log.md`, `agent-notes/penfold-log.md`) are append-only running logs. Each session adds an entry at the **bottom** of the file. Do not edit previous entries — if you need to correct something, add a new entry that references the previous one.

```markdown
## 2026-04-10 14:30 UTC — Session N

**Triggered by:** Kernel K asking about working directory bootstrap
**Duration:** ~45 minutes
**Context loaded:** dangermouse-log.md (sessions 1-3), handoff-queue.md, conflicts.md (empty)

### What I did
- Created the working/ directory structure
- Wrote README.md and PROTOCOL.md
- Drafted supervisor/standards.md (awaiting Kernel K approval)
- Pre-loaded 36 normalized articles into editorial-pass/pending/

### Decisions made
- ADR 0003 drafted: working directory protocol (proposed, awaiting acceptance)

### Open questions for next session
- Should Penfold's editorial pass output use single file per article or batched?
- When does dangermouse-bot runtime go live?

### Handoff
- Kernel K: review and accept ADR 0003
- Kernel K: when ready, trigger Penfold to start editorial pass on pending/
- Penfold: at start of next session, read this entry and check inbox/penfold/
```

---

## Conflict Reporting Format

Anything that blocks work or surfaces a disagreement goes in `supervisor/conflicts.md`:

```markdown
## CONFLICT-2026-0001 — Title

**Filed by:** dangermouse-bot
**Filed at:** 2026-04-10T15:00:00Z
**Severity:** blocker | warning | info
**Affected:** [specific files, articles, or work areas]
**Status:** open | in-resolution | resolved

### Description

[What is the conflict? Be specific.]

### Suggested resolution

[What should happen? Multiple options OK.]

### Resolution

[Filled in by Kernel K when resolved. Include date and reasoning.]
```

Conflicts that get resolved stay in the file with their resolution recorded — do not delete. The conflicts log is the audit trail.

---

## Standards Every Output Must Meet

This section is enforced by `supervisor/standards.md`. It will mirror these rules in more detail. The summary:

1. **Schema reference required.** Every artifact that touches incident, campaign, or entity data references `docs/DATA-STANDARDS-v1.0.md` and the specific section it's claiming compliance with.
2. **No fabricated sources.** Per Penfold's directive 3 in the overnight execution brief: never hallucinate sources to satisfy RULE-004. If sources are missing, mark with `<!-- FIXME: P0 - SOURCE RECOVERY REQUIRED -->`.
3. **No fabricated MITRE techniques.** Never invent ATT&CK technique IDs. If a technique cannot be cleanly mapped, flag as `confidence: possible` and note the uncertainty.
4. **Admiralty rationale required for A1-A4.** Per RULE-006, attribution_confidence values A1 through A4 require an attribution_rationale string ≤500 chars.
5. **Append-only logs.** Never edit a previous entry in an agent log. If you need to revise, add a new entry.
6. **Token-free outputs.** No credentials, API keys, or secrets in any committed file. Ever.

---

## Anti-Patterns

These behaviors break the protocol. If you catch yourself doing one of them, stop:

- **Verbal handoffs in chat instead of file handoffs.** "Penfold, can you process these?" said in chat without an inbox file. Forbidden — there's no audit trail.
- **Editing a past agent log entry.** Append-only means append-only.
- **Bypassing inbox/outbox to act directly on the live corpus.** Editorial pass items must transit through `editorial-pass/in-review/` and `editorial-pass/approved/` before merging.
- **Creating tasks without acceptance criteria.** "Look at this and improve it" is not a task. "Apply these 3 specific fixes per these 2 specific schema sections" is.
- **Resolving a conflict without writing the resolution.** Don't just delete the conflict entry. Write what you decided and why.
- **Working in `scratchpad/` and forgetting to clean up.** Scratchpad is ephemeral; commit anything you want preserved to the appropriate folder.

---

## When the Protocol Conflicts with Reality

This protocol is a v1.0 draft. If something here doesn't work in practice, file a conflict with severity `info`, propose a revision, and we'll iterate. The goal is collaboration that makes the project better, not adherence for its own sake.

— DangerMouse-Bot, 2026-04-10
