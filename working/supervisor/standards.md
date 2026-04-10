# Threatpedia Working Standards

**Version:** 1.0 draft
**Authority:** DangerMouse-Bot drafted, Kernel K to ratify
**Applies to:** All work performed by DangerMouse-Bot, Penfold-Bot, and any future agents on the Threatpedia project

This document is the operational contract for any agent doing work on Threatpedia. It expands on §4 of `PROTOCOL.md`. Read it before starting any task.

---

## Schema Compliance

All work on incidents, campaigns, or entities must conform to `docs/DATA-STANDARDS-v1.0.md`. The schema is locked. If you believe the schema needs to change, file an ADR — do not produce work that violates the schema and call it complete.

**Specific schema gates:**

| Gate | Source | Enforced By |
|---|---|---|
| 26 data quality rules (RULE-001 through RULE-026) | `docs/DATA-STANDARDS-v1.0.md` §12.2 | Zod schemas + pre-build validate-graph.ts |
| 11 controlled H2 section titles | §6 | RULE-022 + normalize.py canonicalization |
| 7-field article header | §7 | normalize.py template |
| 12 sidebar module vocabulary | §8 | render-time component selection |
| ID regex patterns | §16 | Zod refinements in `src/schemas/shared.ts` |
| Admiralty A1-A6 attribution | §3.2 | Per-record validation + RULE-006 rationale check |
| MITRE ATT&CK confidence tiers (confirmed/probable/possible) | §4.4 | Per-mapping validation + RULE-009 evidence requirement |
| Sources minimum 3, ≥1 government or media | §4.5, §12 | RULE-004 + RULE-005 |
| ISO 8601 dates throughout | §4.1 | RULE-020 |

---

## Output Quality Floor

Every committed file must meet these baselines:

### Articles (any type)
- Has v1.0 frontmatter with all required fields per the article type's Zod schema
- 11 canonical H2 sections present (or explicitly noted as missing in normalization notes)
- JSON-LD block in `<head>` per §13 with schema.org-mapped `creativeWorkStatus`
- Trust badge with correct `data-trust` attribute per §10
- Confidence score NOT stored in frontmatter (it's computed at build time per §9.4)
- All sources have full source records per §4.5 schema, not just URLs

### Decision Records
- Numbered, dated, status-tracked
- Names the deciders explicitly
- Includes rationale, tradeoffs, alternatives considered
- Linked from the relevant agent logs

### Task files
- Have all frontmatter fields populated (task_id, created_by, created_at, assigned_to, priority, status, references, expected_output)
- Acceptance criteria are testable, not vague
- Reference specific schema sections, not just "the schema"

### Agent log entries
- Timestamped in ISO 8601 UTC
- Note what context was loaded at start
- List specific actions taken with file paths
- List decisions made with ADR numbers
- List handoffs with named recipients

---

## What Counts as Done

A task moves from `inbox/` to `outbox/` only when:

1. All acceptance criteria are met
2. Output validates against schema (where applicable)
3. The agent log has been updated
4. Any new conflicts have been filed
5. Any items requiring Kernel K's attention are in `inbox/kernel-k/`

A task moves from `outbox/` to merged into the live corpus only when Kernel K explicitly approves. No agent self-merges to `incidents/`, `campaigns/`, `entities/`, or `docs/`.

---

## What an Agent Must NOT Do

These are hard rules. Violations are conflicts that must be filed against the violating agent:

1. **Never invent sources.** If RULE-004 cannot be satisfied, mark the article `draft_ai` with a P0 source recovery FIXME and move it to `editorial-pass/blocked/`.
2. **Never invent MITRE techniques.** If a technique cannot be confidently mapped, mark its `confidence: possible` and note why in `evidence`. If you cannot do even that, leave the field empty and flag the gap.
3. **Never modify a frozen file during a freeze period.** Check `working/supervisor/conflicts.md` for active freeze flags before editing anything in `incidents/` or `docs/`.
4. **Never edit another agent's log.** Append-only means append-only.
5. **Never resolve a conflict by deleting it.** Write the resolution in the conflict entry.
6. **Never commit credentials, tokens, API keys, passwords, or PII.** This is non-negotiable. If you encounter these in source material, redact before committing.
7. **Never bypass the inbox/outbox cycle for non-trivial work.** Quick fixes can be discussed in chat, but anything substantive must transit through the working directory so there's an audit trail.
8. **Never claim work as complete that fails schema validation.** Run the validators. Read the output. If they fail, the work isn't done.

---

## Conflict Resolution Hierarchy

When two agents disagree or when work is blocked:

1. **First, can it be resolved by re-reading the schema?** If yes, the schema wins. File it as resolved.
2. **Can it be resolved by the standards in this document?** If yes, the standards win. File as resolved with reference.
3. **Is it a tradeoff or interpretation question?** File the conflict with both positions and a recommended resolution. Wait for Kernel K.
4. **Is it an emergency that blocks everything?** Filed as severity `blocker`, also notify Kernel K through `inbox/kernel-k/` immediately.

---

## Optimization Expectations

Agents are expected to proactively note tech debt, redundant work, schema friction, and process improvements in `supervisor/optimization-log.md`. This is not a task — it's a continuous responsibility. Examples:

- "The normalization script's section vocabulary canonicalization regex is becoming hard to maintain. Consider splitting into a YAML data file."
- "Three articles in this week's batch had similar source recovery patterns. We could pre-extract source candidates from the audit reports."
- "The handoff queue file is getting long. Consider archiving completed items quarterly."

The optimization log is reviewed by Kernel K periodically. Items become tasks only when Kernel K decides.

---

## Communication Channels

| Channel | Purpose | Latency |
|---|---|---|
| `working/inbox/<agent>/` | Asynchronous task assignment | Next session |
| `working/agent-notes/<agent>-log.md` | Status updates and history | Next session |
| `working/supervisor/handoff-queue.md` | Live FIFO of next actions | Next session |
| `working/supervisor/conflicts.md` | Blockers, disagreements, anomalies | Next session, escalate severity for urgency |
| `working/inbox/kernel-k/` | Anything needing Kernel K's decision | Next time Kernel K checks |
| Chat (Claude.ai or AI Studio) | Live thinking, brainstorming, planning | Real-time within session |
| Live face-to-face with Kernel K | Strategic direction, executive decisions | When Kernel K initiates |

**The working directory is the only persistent channel.** Anything said in chat that should outlive the session must be committed to the directory.

---

*Threatpedia Working Standards · v1.0 draft · April 2026*
