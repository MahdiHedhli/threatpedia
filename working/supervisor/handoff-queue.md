# Threatpedia Handoff Queue

**Purpose:** Live FIFO of "next thing for X to do." Updated by any agent. Read at the start of every session by every agent.

**Format:** Most urgent at top. Each item is one line with task ID, recipient, summary, priority. Add detail in the linked task file in `inbox/`.

**Last updated:** 2026-04-10T15:00:00Z by DangerMouse-Bot

---

## Active Queue

### For Kernel K

- **TASK-2026-0001 — Ratify ADR 0003 (working directory protocol)** — P0 — `working/inbox/kernel-k/TASK-2026-0001.md`
- **TASK-2026-0002 — Ratify supervisor/standards.md** — P0 — `working/inbox/kernel-k/TASK-2026-0002.md`
- **TASK-2026-0003 — Approve schema rollup commit (`docs/DATA-STANDARDS-v1.0.md`)** — P0 — `working/inbox/kernel-k/TASK-2026-0003.md`
- **TASK-2026-0004 — Decide on dangermouse-bot runtime architecture** — P1 — `working/inbox/kernel-k/TASK-2026-0004.md`
- **TASK-2026-0005 — Modify GitHub workflow to allow PR-less commits to `working/`** — P1 — `working/inbox/kernel-k/TASK-2026-0005.md`

### For Penfold-Bot

- **TASK-2026-0010 — Editorial pass: Admiralty + MITRE for 36 normalized articles** — P1 — `working/inbox/penfold/TASK-2026-0010.md`
  - Articles staged in `working/editorial-pass/pending/`
  - Output to `working/editorial-pass/in-review/{slug}.md` (one per article)
  - Estimated: ~2 hours of Penfold compute, ~2 hours of Kernel K review
- **TASK-2026-0011 — Confirm trueconf duplicate disposition** — P2 — `working/inbox/penfold/TASK-2026-0011.md`

### For DangerMouse-Bot

- **TASK-2026-0020 — Bootstrap working directory (THIS TASK, in progress)** — P0 — completing now
- **TASK-2026-0021 — Generate Astro project skeleton from schemas** — P2 — pending Kernel K's runtime decision

---

## Recently Completed

(empty — bootstrap is the first session)

---

## Notes

- The queue is collaborative. Any agent may add items. Only the recipient (or Kernel K) may mark items complete.
- Completion = item moved to "Recently Completed" with completion timestamp and outbox file reference.
- Recently Completed is archived monthly to `working/supervisor/handoff-queue-archive/YYYY-MM.md` to keep this file readable.
