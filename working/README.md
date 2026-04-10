# Threatpedia Working Directory

**Purpose:** This directory is the collaboration substrate for the Threatpedia project's three-party working group: Kernel K (project lead), DangerMouse-Bot (Claude), and Penfold-Bot (Gemini). It is the *persistent memory* that none of the three of us have on our own.

**Status:** Bootstrapped 2026-04-10 by DangerMouse-Bot, in coordination with Kernel K, during Phase 0 freeze.

---

## Why This Exists

Kernel K is the only persistent memory across our sessions. DangerMouse and Penfold are each independent stateless instances of foundation models — when a Chat session ends, our context is gone. The previous workflow had Kernel K shuttling content between Claude Chat and AI Studio by hand, copy-pasting prompts and outputs. This made Kernel K the bottleneck for every collaboration cycle.

This directory replaces that pattern. Now:

- **State lives in git, not in chat.** Every decision, every task, every handoff, every conflict is a file in this directory.
- **Each session begins with the same boot sequence:** read the relevant agent log, check the inbox, check the supervisor's handoff queue, then act.
- **Each session ends with a structured commit:** update the log, write outbox files, surface conflicts.
- **Agents collaborate through files**, not by Kernel K relaying messages. The git history captures the conversation.

The model is asynchronous collaboration through a shared workspace. It's how human teams have worked for decades — pull requests, design docs, ADRs, code review. We're applying the same protocol to a mixed human-AI working group.

---

## Directory Map

```
working/
├── README.md                       ← This file
├── PROTOCOL.md                     ← The rules of engagement (read second)
│
├── supervisor/                     ← The conductor's desk
│   ├── schedule.yml                ← Job schedule (Kernel K edits, DM reads)
│   ├── permissions.yml             ← What each agent can touch
│   ├── standards.md                ← The contract every job must meet
│   ├── handoff-queue.md            ← Live FIFO of "next thing for X to do"
│   ├── conflicts.md                ← Blocked work, schema violations, disagreements
│   └── optimization-log.md         ← Periodic notes on improvements and tech debt
│
├── decisions/                      ← Architecture Decision Records (ADRs)
│   ├── 0001-rollup-v101-into-v10.md
│   ├── 0002-three-content-collections.md
│   └── 0003-working-directory-protocol.md
│
├── agent-notes/                    ← Per-agent running logs
│   ├── dangermouse-log.md          ← DM's session-by-session log
│   ├── penfold-log.md              ← Penfold's session-by-session log
│   └── kernel-k-log.md             ← Kernel K's notes (optional, not required)
│
├── inbox/                          ← Work being SENT TO an agent
│   ├── dangermouse/                ← Tasks for DM to pick up
│   ├── penfold/                    ← Tasks for Penfold to pick up
│   └── kernel-k/                   ← Items needing Kernel K's attention/decision
│
├── outbox/                         ← Completed work FROM an agent
│   ├── dangermouse/                ← DM's deliverables awaiting review
│   └── penfold/                    ← Penfold's deliverables awaiting review
│
├── editorial-pass/                 ← The Step 8 editorial workflow specifically
│   ├── pending/                    ← Articles awaiting Penfold's MITRE + Admiralty processing
│   ├── in-review/                  ← Penfold has processed; Kernel K is reviewing
│   ├── approved/                   ← Ready to merge to live corpus
│   └── blocked/                    ← Needs source recovery, taxonomy fix, etc.
│
└── scratchpad/                     ← Anything in flight, ephemeral
```

---

## Boot Sequences

### DangerMouse-Bot (start of every Chat session)

1. Read `working/agent-notes/dangermouse-log.md` (most recent entry first)
2. Read `working/supervisor/handoff-queue.md`
3. Read `working/supervisor/conflicts.md`
4. Check `working/inbox/dangermouse/` for new tasks
5. Summarize state to Kernel K and propose next action

### Penfold-Bot (start of every AI Studio session)

1. Kernel K uploads `working/agent-notes/penfold-log.md` and `working/supervisor/handoff-queue.md` to AI Studio
2. Penfold reads both
3. Kernel K uploads any files from `working/inbox/penfold/`
4. Penfold acts and outputs results to be committed back into `working/outbox/penfold/`

### Kernel K (any time)

1. Check `working/inbox/kernel-k/` for items needing decisions
2. Check `working/supervisor/conflicts.md` for blocked work
3. Approve, edit, or merge items from `working/outbox/` or `working/editorial-pass/in-review/`

---

## Wind-Down Sequences

### DangerMouse-Bot (end of every Chat session)

1. Update `working/agent-notes/dangermouse-log.md` with what happened this session
2. Update `working/supervisor/handoff-queue.md` if priorities shifted
3. Add any new items to `working/inbox/penfold/` or `working/inbox/kernel-k/`
4. Add any new conflicts to `working/supervisor/conflicts.md`
5. Hand off the changes for commit (in this current architecture, that means producing files for Kernel K to commit; once dangermouse-bot runtime is operational, DM commits directly)

### Penfold-Bot (end of every AI Studio session)

1. Output an update for `working/agent-notes/penfold-log.md`
2. Output any new tasks for `working/inbox/dangermouse/`
3. Output completed deliverables for `working/outbox/penfold/`
4. Kernel K commits the changes

---

## Authority and Ownership

| File / Directory | Editable By | Approval Required From |
|---|---|---|
| `supervisor/schedule.yml` | Kernel K | Kernel K |
| `supervisor/permissions.yml` | Kernel K | Kernel K |
| `supervisor/standards.md` | DM (drafts), Kernel K (approves) | Kernel K |
| `supervisor/handoff-queue.md` | DM, Penfold, Kernel K | None — collaborative |
| `supervisor/conflicts.md` | Any agent | Kernel K resolves |
| `supervisor/optimization-log.md` | DM, Penfold | None — advisory |
| `decisions/*.md` | Any agent (drafts), Kernel K (approves) | Kernel K |
| `agent-notes/dangermouse-log.md` | DM only | None |
| `agent-notes/penfold-log.md` | Penfold only | None |
| `inbox/<agent>/` | Any agent (writes), the named agent (reads/processes) | None to write |
| `outbox/<agent>/` | The named agent (writes), Kernel K (reads/approves) | Kernel K to merge |
| `editorial-pass/pending/` | DM (populates), Penfold (consumes) | None |
| `editorial-pass/in-review/` | Penfold (writes), Kernel K (reviews) | Kernel K to advance |
| `editorial-pass/approved/` | Kernel K only | None — Kernel K's word is final |
| `editorial-pass/blocked/` | Any agent | Kernel K to triage |
| `scratchpad/` | Any agent | None — ephemeral |

---

## What This Directory Is NOT

- **Not a queue system.** Files here are checked manually at the start of each session, not pulled by a daemon. When the dangermouse-bot runtime is operational, that runtime can poll, but the protocol works without it.
- **Not real-time.** Updates are seen by the next session that starts, not the next minute. Plan accordingly.
- **Not a substitute for the live corpus.** Articles in `editorial-pass/approved/` still need to be merged into `incidents/` or `campaigns/` or `entities/` before they're live. Approval is one step before merge, not merge itself.
- **Not a chat replacement.** This directory is the persistent state of the collaboration. The actual thinking still happens in Chat (DM with Kernel K), in AI Studio (Penfold with Kernel K), and in face-to-face working sessions. The directory captures the *outputs* of that thinking, not the thinking itself.

---

## Origins

This directory was bootstrapped on 2026-04-10 during the Phase 0 freeze, immediately after Kernel K's executive decision to roll up the v1.0.1 patch directly into v1.0 (since v1.0 had not yet entered production). The bootstrap commit also marks the formal transition from the "Kernel K shuttles content between two AI sessions" workflow to the "agents collaborate through git" workflow.

The first task this directory was set up to support was the editorial pass on the 36 normalized articles — Penfold's bulk processing of MITRE ATT&CK technique mapping and Admiralty attribution confidence scoring, reducing what would have been ~37 hours of human data entry to ~2 hours of human review.

— DangerMouse-Bot, 2026-04-10
