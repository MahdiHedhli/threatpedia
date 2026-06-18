# Supply Chain Stack Status

Status recorded from current `main` on 2026-06-18.

Result: the Supply Chain corpus, graph primitives, public pages, and 1.0 graph
surface are merged. Production deployment is enabled through the explicit
`ENABLE_SUPPLY_CHAIN_PAGES=true` GitHub Pages build flag.

## Current Production State

- `/supply-chain/` is generated in production builds when the deployment flag is
  enabled.
- The section is still static and corpus-driven: checked-in JSON is compiled at
  build time; the browser consumes `site/public/supply-chain-graph.json`.
- Current graph payload check: 187 nodes, 285 edges, 129 search records.
- Current page test route count: 85 enabled Supply Chain routes.
- Current corpus count: 27 incidents.
- Current relationship-store count: 140 relationships.

## Merged Phase Chain

| Phase | Purpose | Current state |
|---|---|---|
| Phase 0 | Release-event ingestion spine | Merged |
| Phase 1A | Curated incident corpus | Merged |
| Phase 1B | Entity and relationship primitives | Merged |
| Phase 1C | Corpus depth pass | Merged |
| Phase 1D | Feature-flagged static pages | Merged |
| Phase 1E | Public polish | Merged |
| Phase 1F | Featured editorial incident pages | Merged as replacement PR #1139 after #1136 could not be preserved |
| Phase 1G | Public readiness gate | Merged |
| Phase 1H | Preview deploy enablement | Merged |
| Phase 1I | Production public enablement | Merged |
| Phase 1J | Post-launch smoke and rollback gate | Merged |
| Phase 2A | PURL foundation | Merged |
| Phase 2B | Actor/campaign convergence | Merged |
| Phase 2C | Release entity layer | Merged |
| Phase 2D | Maintainer intelligence expansion | Merged |
| Phase 2E | Connectivity-driven corpus expansion | Merged |
| Phase 2F | PURL and edge audit | Merged |
| Phase 2G | Backtest foundation | Merged |
| Phase 2H | Release-spine integrity | Merged |
| S0 | Evidence-gated `SEEDED_BY` propagation edges | Merged |
| G1 | Persistent graph shell and landing-page theme | Merged |
| G2 | Graph core and compiled graph payload | Merged |
| G3 | Technique focus and reflow | Merged |
| G4 | Dive-and-bloom with package/org/release tiers | Merged |
| G5 | Labels and accessibility | Merged |
| G6 | Page-to-graph binding | Merged |
| G7 | Incident propagation page | Merged |
| Post-G7 | Visual hierarchy restoration and graph search/explore mode | Merged |

## Current Validation Snapshot

Run from current `main` on 2026-06-18:

```bash
python3 scripts/validate_supply_chain_incidents.py
```

Result: PASS. Validated 27 supply-chain incidents.

```bash
python3 scripts/validate_supply_chain_graph.py
```

Result: PASS.

```bash
node scripts/build-supply-chain-graph.mjs --check
```

Result: PASS. Checked 187 graph nodes, 285 graph edges, and 129 search records.

```bash
node scripts/test-supply-chain-pages.mjs
```

Result: PASS. Supply Chain page tests passed with 85 routes.

## Current Graph Density

Current generated entity counts:

| Entity type | Count |
|---|---:|
| Incidents | 27 |
| Packages | 21 |
| Releases | 7 |
| Repositories | 11 |
| Organizations | 19 |
| Maintainers | 5 |
| Build systems | 6 |
| Distribution channels | 14 |
| Compromised accounts | 10 |
| Actors | 6 |
| Campaigns | 3 |
| Relationships | 140 |
| `SEEDED_BY` propagation edges | 3 |

## Reality Notes

- The original stacked PR chain was squash-merged in phases. Later branches had
  to be rebuilt onto current `main`; this is why replacement PRs exist for parts
  of the stack.
- The old Phase 1F PR #1136 was closed because its deleted stacked base blocked
  clean preservation. The work was rebuilt and merged through #1139.
- The G5/G6/G7 tail of the 1.0 visualization stack was also rebuilt onto
  current `main` after squash-merge ancestry made the original stacked branches
  misleading.
- Campaign validator warnings may still appear in full Astro builds for
  unrelated campaign records with fewer than the target two related incidents.
  Those warnings are not Supply Chain readiness failures unless the build exits
  non-zero.

## Remaining Boundaries

The merged Supply Chain surface still does not implement:

- scoring or risk ranking
- soak/canary windows
- live package-feed ingestion into public pages
- graph databases
- automated actor attribution
- generated conclusions or policy recommendations

The next work should either deepen the corpus/relationships or add carefully
bounded user-facing drill-downs over already-modeled data. It should not add a
score before the release spine, evidence timestamps, actor/campaign links, and
propagation edges are demonstrably dense enough to support one.
