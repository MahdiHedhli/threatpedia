# 0003 — Working Directory Protocol for Cross-Agent Collaboration

**Date:** 2026-04-10
**Status:** Proposed (awaiting Kernel K ratification)
**Deciders:** Kernel K (originator), DangerMouse-Bot (drafter), Penfold-Bot (will collaborate via this protocol)
**Supersedes:** None

---

## Context

The Threatpedia project has a working group of three: Kernel K (project lead, human), DangerMouse-Bot (Claude, Anthropic), and Penfold-Bot (Gemini 1.5 Pro, Google). DangerMouse and Penfold are both stateless instances of foundation models — when a session ends, our context is gone.

Until 2026-04-10, the collaboration pattern was:

1. Kernel K talks to DangerMouse in Claude Chat
2. Kernel K copies DangerMouse's output and pastes it into AI Studio for Penfold
3. Kernel K copies Penfold's response back into Claude Chat for DangerMouse
4. Each subsequent session, both AIs start cold and Kernel K provides context

This pattern made Kernel K the bottleneck for every collaboration cycle and meant that no work could happen unless he was actively present to relay messages. It also meant the AIs had no way to maintain state between sessions other than what got summarized in their conversation memories — which is unreliable for technical work.

The volume of work required for Threatpedia (37 articles to normalize, schema iterations, editorial passes, ongoing source archival) is too large for this pattern. Kernel K identified the need for a more autonomous collaboration model.

## Decision

Establish `working/` as a top-level directory in the Threatpedia repo. This directory is the persistent collaboration substrate for the working group. State lives in git, not in chat. The directory structure, file formats, and operational protocol are defined in `working/README.md` and `working/PROTOCOL.md`.

Key elements:

1. **Per-agent inboxes and outboxes** for asynchronous task assignment
2. **Per-agent append-only logs** in `working/agent-notes/` so each session can read what previous sessions did
3. **A supervisor layer** (`working/supervisor/`) with handoff queue, conflicts log, schedule, permissions, and standards
4. **Decision records (ADRs)** in `working/decisions/` for any non-trivial choice
5. **An editorial pass workflow** (`working/editorial-pass/`) specifically for the Step 8 Penfold acceleration
6. **Boot and wind-down sequences** that every agent runs at session start and end

The directory is collaborative, but Kernel K retains ultimate authority. Agents may write freely to `working/`, but no agent may merge to the live corpus (`incidents/`, `campaigns/`, `entities/`, `docs/`) without Kernel K's explicit approval.

## Rationale

**Why git is the right substrate:**

1. **It's already there.** Threatpedia is hosted on GitHub. No new infrastructure required.
2. **Git captures the conversation.** Every commit is a turn in the dialogue, and the history is the collaboration record.
3. **It works asynchronously.** No agent needs to be "online" at the same time as another. Each session reads the latest state and acts.
4. **Both DM and Penfold can read public repo files via raw URLs.** DM via `web_fetch` in Chat, Penfold via Gemini's web access (when integrated) or via Kernel K uploading specific files.
5. **It scales beyond AI-only collaboration.** When Threatpedia onboards human contributors, the same directory and the same protocol work for them too.

**Why a supervisor layer:**

Kernel K identified the need for "one chat/supervisor agent that controls all the sub-agents or scheduled agent jobs." The supervisor pattern is a well-established agent architecture: an orchestrator decomposes tasks, dispatches to workers, validates output, surfaces conflicts, and reports to the principal. The supervisor doesn't do mechanical work — it coordinates.

In our context, the supervisor role is split:
- **Kernel K** is the principal and the strategic supervisor (sets schedules, grants permissions, makes executive decisions)
- **DangerMouse-Bot** is the operational supervisor (drafts contracts, validates outputs, surfaces conflicts, optimizes workflows)
- **Penfold-Bot** is a specialized worker (high-context analytical work, editorial pass, architectural review)
- **Future runtimes** are scheduled workers (nightly archiving, weekly audits, etc.)

The supervisor layer in `working/supervisor/` is where the operational supervisor lives — handoff queue, conflicts, standards, schedule, permissions, optimization log.

**Why proposed (not accepted):**

This ADR is filed as Proposed because Kernel K has not yet ratified the protocol. Acceptance happens when Kernel K reviews `working/README.md`, `working/PROTOCOL.md`, and `working/supervisor/standards.md` and approves them via TASK-2026-0001 and TASK-2026-0002.

## Consequences

**Positive:**
- Kernel K is no longer the message-passing bottleneck
- DM and Penfold can collaborate across sessions through file handoffs
- Every decision, conflict, and task is auditable
- New collaborators (human or agent) can onboard by reading the working directory
- The protocol scales to future runtimes (Antigravity, Claude Code on a VM, etc.)

**Negative / Tradeoffs:**
- Adds discipline overhead — every session must update logs, every task must be filed correctly
- Requires GitHub workflow changes to allow PR-less commits to `working/`
- Until the dangermouse-bot runtime is operational, DM still cannot push commits autonomously — Kernel K commits on DM's behalf or DM uses one-shot tokens
- File-based collaboration is slower than real-time chat for back-and-forth

**Risks:**
- The protocol could be too rigid and slow down legitimate work. Mitigation: it's v1.0, we iterate based on what doesn't work in practice.
- Agents could fall out of compliance with the protocol. Mitigation: the protocol itself defines anti-patterns and conflict reporting.
- The working directory could grow unbounded. Mitigation: monthly archiving of the handoff queue and conflict log to dated subdirectories.

## Alternatives Considered

- **Option A: NotebookLM as the collaboration surface.** Rejected because NotebookLM is a research notebook (good at synthesizing a fixed corpus), not a workspace (cannot accept structured edits or route tasks between agents). NotebookLM is the right tool for outward-facing briefings to founding board members and SMEs, not for internal collaboration. See discussion in DangerMouse session log for 2026-04-10.
- **Option B: A custom database or queue system.** Rejected as overengineering for Phase 0. Git is simpler, free, already in place, and the protocol could migrate to a database later if scale requires it.
- **Option C: Just keep doing chat-relay with Kernel K as shuttle.** Rejected because the volume of editorial-pass work (36 articles, ~37 hours of relayed Q&A) is unworkable.
- **Option D: One unified agent that combines DM and Penfold capabilities.** Rejected because (a) such an agent doesn't exist and (b) the differentiation between DM and Penfold is valuable — DM for implementation, Penfold for high-context analysis. Diversity of perspectives is a feature, not a bug.

---

**Implementation:** Bootstrap commit on 2026-04-10 by DangerMouse-Bot (using a one-shot Kernel K-issued token). Includes `README.md`, `PROTOCOL.md`, three ADRs (this one, 0001, 0002), supervisor files (handoff-queue, conflicts, schedule, permissions, standards, optimization-log), agent log files (DM and Penfold initialized), and the editorial-pass folder structure.

Acceptance pending Kernel K's review of TASK-2026-0001, TASK-2026-0002, and this ADR.
