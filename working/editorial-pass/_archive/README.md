# Editorial Pass Archive

Articles in this folder are deprecated, suspected duplicates, or otherwise excluded from active editorial processing. They are preserved here for reference and audit history only.

## trueconf-cve-2026-3502-zero-day.html

**Reason for archival:** Likely duplicate of `operation-truechaos-trueconf-zero-day-2026.html`. Both reference CVE-2026-3502 in TrueConf. Per Penfold-Bot directive 4 in the overnight execution brief (2026-04-09), this file was archived rather than normalized to avoid wasting compute on a deprecation candidate.

**Decision authority:** Penfold-Bot (architectural review), confirmed by Kernel K (project lead).

**Status:** Archived 2026-04-10, awaiting formal duplicate confirmation under TASK-2026-0011.

**Action required at editorial pass:**
1. Penfold reviews both files (trueconf here in `_archive/`, operation-truechaos in `pending/`)
2. Confirms they cover the same incident
3. If confirmed duplicate: leave this file in `_archive/`, mark `operation-truechaos` as canonical, close CONFLICT-2026-0003 as resolved
4. If actually distinct: pull this file out of `_archive/`, run normalization separately, integrate, close CONFLICT-2026-0003 with the distinction documented
