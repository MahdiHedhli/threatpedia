# Threatpedia Conflicts Log

**Purpose:** Active and resolved conflicts. Anything that blocks work, fails validation, or surfaces a disagreement between agents goes here. Filed by any agent. Resolved by Kernel K (or by another agent if the resolution is mechanical and obvious).

**Format:** Most recent / most urgent at top. Conflicts that are resolved stay in this file with their resolution recorded — never delete. This is the audit trail.

**Last updated:** 2026-04-10T15:00:00Z by DangerMouse-Bot

---

## Open Conflicts (require attention)

### CONFLICT-2026-0001 — 5 articles have zero recoverable sources

**Filed by:** DangerMouse-Bot
**Filed at:** 2026-04-10T03:00:00Z
**Severity:** blocker (per RULE-004, these articles cannot leave draft_ai)
**Affected:**
- `incidents/bluehammer-windows-defender-zero-day-2026.html`
- `incidents/cegedim-sante-health-breach-2026.html`
- `incidents/conduent-data-breach-2026.html`
- `incidents/lexisnexis-react2shell-breach-2026.html`
- `incidents/tp-article-qilin-edr-killer.html` (now reclassified as campaign)

**Status:** open — awaiting source recovery

#### Description

The 2026-04-09 drift audit identified 5 articles in the corpus with zero extractable sources. Per `docs/DATA-STANDARDS-v1.0.md` RULE-004, every article requires a minimum of 3 independent sources. Per Penfold's directive 3, sources must NOT be hallucinated. These articles have been normalized with `<!-- FIXME: P0 - SOURCE RECOVERY REQUIRED -->` markers and a visible red warning box in the Sources & References section, and held at `review_status: draft_ai`.

#### Suggested resolution

Source recovery requires going back to the original article context (which is no longer available in the corpus) or doing fresh web research. This is a manual editorial task that cannot be done by the normalization script.

Two options:
1. **Recovery (preferred):** Kernel K or a researcher does fresh web research to find ≥3 sources for each, updates the article, advances to `under_review`.
2. **Removal:** If sources cannot be recovered, the articles are moved to `editorial-pass/blocked/` and ultimately removed from the corpus until they can be properly sourced. They never enter the live corpus in their current state.

#### Resolution

(awaiting Kernel K decision)

---

### CONFLICT-2026-0002 — BlueHammer "Chaotic Eclipse" mislabeled as threat actor

**Filed by:** DangerMouse-Bot
**Filed at:** 2026-04-10T03:30:00Z
**Severity:** blocker (taxonomy violation per RULE-019)
**Affected:** `incidents/bluehammer-windows-defender-zero-day-2026.html`

**Status:** open — taxonomy fix required

#### Description

The original BlueHammer article lists "Chaotic Eclipse" in the threat actor field. Per the corpus audit and ground-truth research, "Chaotic Eclipse" is a security researcher who disclosed the vulnerability, not a threat actor. RULE-019 prohibits researchers from being listed in `threat_actor_ids` — they belong in `disclosure_credit`.

#### Suggested resolution

During Penfold's editorial pass (TASK-2026-0010), explicitly migrate "Chaotic Eclipse" from `threat_actor_ids` to `disclosure_credit` with `credit_role: discoverer`. The article currently has `review_status: draft_ai` (demoted from its original `approved` state) until this is resolved.

#### Resolution

(awaiting Penfold's editorial pass + Kernel K approval)

---

### CONFLICT-2026-0003 — trueconf-cve-2026-3502 vs operation-truechaos: confirm or reject duplicate

**Filed by:** DangerMouse-Bot (per Penfold directive 4)
**Filed at:** 2026-04-10T04:00:00Z
**Severity:** info
**Affected:**
- `incidents/trueconf-cve-2026-3502-zero-day.html` (currently archived)
- `incidents/operation-truechaos-trueconf-zero-day-2026.html`

**Status:** open — duplicate confirmation needed

#### Description

Penfold-Bot identified `trueconf-cve-2026-3502-zero-day.html` as likely duplicating `operation-truechaos-trueconf-zero-day-2026.html`. Both reference CVE-2026-3502 in TrueConf. The trueconf article was archived (not normalized) per Penfold directive 4 to avoid wasting compute on a deprecation candidate. This conflict is filed to track the formal decision.

#### Suggested resolution

Penfold reviews both articles during the editorial pass and confirms whether they are duplicates. If confirmed: trueconf stays archived permanently. If actually distinct: trueconf is restored from archive, normalized, and integrated.

#### Resolution

(awaiting Penfold's editorial pass)

---

### CONFLICT-2026-0004 — manifest.json contains 2 entries with null incidentId

**Filed by:** DangerMouse-Bot
**Filed at:** 2026-04-10T04:00:00Z
**Severity:** warning (RULE-001 violation in manifest, not in articles)
**Affected:**
- `manifest.json` entry for `teampcp-supply-chain-attack`
- `manifest.json` entry for `cegedim-sante-health-breach-2026`

**Status:** open — needs ID assignment

#### Description

The current manifest.json has two entries with `incidentId: null`. Per RULE-001, every incident must have a `TP-YYYY-NNNN` event_id. The normalization script generated placeholder IDs for these articles, but the canonical ID assignment must come from the manifest update.

#### Suggested resolution

Kernel K assigns the next two available IDs in the TP-2026-NNNN sequence (TP-2026-0041 and TP-2026-0042 if no other gaps to fill) to these articles in manifest.json, then re-runs normalization. There's also a gap at TP-2026-0037 through TP-2026-0040 in the existing sequence — Kernel K may want to fill those first.

#### Resolution

(awaiting Kernel K)

---

### CONFLICT-2026-0005 — 17 manifest/HTML status mismatches

**Filed by:** DangerMouse-Bot
**Filed at:** 2026-04-10T04:00:00Z
**Severity:** warning (data integrity issue, not blocking)
**Affected:** 17 articles where manifest.json `reviewStatus` differs from the HTML `<meta name="review-status">`

**Status:** open — needs reconciliation

#### Description

The 2026-04-09 drift audit identified 17 articles where the manifest's review status disagrees with the article HTML's review status meta tag. The normalization script used the manifest as authoritative (per the source of truth principle), but the discrepancies indicate an unsynchronized workflow somewhere.

#### Suggested resolution

After Penfold's editorial pass updates statuses, re-run the audit. Any remaining mismatches should be resolved by treating manifest as authoritative and updating the HTML meta tag. Then add a CI check that fails if the two ever drift.

#### Resolution

(deferred until after editorial pass)

---

## Resolved Conflicts

(none yet — bootstrap session)

---

## Notes

- Filing a conflict is not blame — it's flagging that something needs attention. Be specific, be technical, propose a resolution.
- Severity guide:
  - `blocker` — work cannot proceed until resolved
  - `warning` — work can proceed but quality degrades or rules are bent
  - `info` — observation that doesn't block but should be tracked
- When in doubt, file the conflict. Better to over-document than miss something.
