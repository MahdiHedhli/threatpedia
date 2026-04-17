## Soft-Launch Corpus Review Queue

This queue stages the remaining corpus review work needed to make the live site production-ready for soft launch.

Scope:
- `incidents/` — 55 live articles
- `threat-actors/` — 33 live articles
- `zero-days/` — 18 live articles

Review standard for every batch:
- validate against the latest Astro schema in `site/src/content.config.ts`
- validate against the ratified private specs and ADRs
- correct technical inaccuracies, historical inaccuracies, attribution overreach, ATT&CK mapping drift, taxonomy mistakes, section drift, and source-quality gaps
- if a live article must be removed, merged, or reclassified, create a follow-on pipeline reprocess task before merge so no content is lost

Batch order:

1. `TASK-2026-0153` — Incidents batch 1/6: modern exploit-driven incidents
2. `TASK-2026-0154` — Incidents batch 2/6: 2026 supply-chain, cloud, and breach cluster
3. `TASK-2026-0155` — Incidents batch 3/6: 2025-2026 ransomware and extortion cluster
4. `TASK-2026-0156` — Incidents batch 4/6: landmark enterprise incidents and outages
5. `TASK-2026-0157` — Incidents batch 5/6: state, espionage, and destructive incidents
6. `TASK-2026-0158` — Incidents batch 6/6: taxonomy and canonicalization edge cases
7. `TASK-2026-0159` — Threat actors batch 1/4: PRC state-linked and China-adjacent actors
8. `TASK-2026-0160` — Threat actors batch 2/4: Russian and FSU-linked actors
9. `TASK-2026-0161` — Threat actors batch 3/4: DPRK and ransomware-core actors
10. `TASK-2026-0162` — Threat actors batch 4/4: hybrid, criminal, and emerging actors
11. `TASK-2026-0163` — Zero-days batch 1/2: modern active exploitation set
12. `TASK-2026-0164` — Zero-days batch 2/2: historical and canonicalization set

Completion goal:
- the live corpus should be schema-clean, historically defensible, technically accurate, and free of obvious canonical duplication before soft launch
