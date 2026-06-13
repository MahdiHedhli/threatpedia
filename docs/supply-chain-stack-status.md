# Supply Chain Stack Status

Status recorded from the rebuilt Phase 1G readiness branch on 2026-06-13.

Result: PASS for the current post-squash stack. Supply Chain remains disabled
by default unless `ENABLE_SUPPLY_CHAIN_PAGES=true` is set by an operator.

## PR Chain Order

| Order | Phase | PR | Branch | Head reviewed | Base | Status |
|---:|---|---|---|---|---|---|
| 1 | Phase 1A incident corpus | [#1130](https://github.com/MahdiHedhli/threatpedia/pull/1130) | `codex/supply-chain-phase1a` | merged before this rebuild | `main` | merged to `main` |
| 2 | Phase 1B graph primitives | [#1131](https://github.com/MahdiHedhli/threatpedia/pull/1131) | `codex/supply-chain-phase1b` | `dca5adc2f127fa788460292b6de7938f0db82405` | `main` | merged to `main` |
| 3 | Phase 1C corpus depth pass | [#1133](https://github.com/MahdiHedhli/threatpedia/pull/1133) | `codex/supply-chain-phase1c` | `52ba1f9fa28591bb5ae44abeba8b133375265b1e` | `main` | merged to `main` |
| 4 | Phase 1D feature-flagged pages | [#1134](https://github.com/MahdiHedhli/threatpedia/pull/1134) | `codex/supply-chain-phase1d` | `a7dbf64842d54cad68ed2e20c01102060d4a4e16` | `main` | merged to `main` |
| 5 | Phase 1E public polish | [#1135](https://github.com/MahdiHedhli/threatpedia/pull/1135) | `codex/supply-chain-phase1e` | folded into #1134 after stacked squash merge | `codex/supply-chain-phase1d` | no separate `main` merge needed |
| 6 | Phase 1F featured editorial pages | [#1139](https://github.com/MahdiHedhli/threatpedia/pull/1139) | `codex/supply-chain-phase1f` | `c6f7f03de6737f4c5666357b4881c6c6e9654ecb` | `main` | merged to `main`; replaces closed #1136 |
| 7 | Phase 1G public readiness gate | [#1138](https://github.com/MahdiHedhli/threatpedia/pull/1138) | `codex/supply-chain-phase1g` | rebuilt on current `main` | `main` | ready after current-head recheck |

## Merge Notes

The original stack was squash-merged in phases. Because squash merges changed
the ancestry of the lower branches, later stacked PRs were rebuilt onto current
`main` before merge rather than merged from stale stacked bases.

- #1135 was already merged into the stacked Phase 1D branch before #1134 was
  rebuilt; its public polish changes are included in the #1134 merge.
- #1136 could not be reopened because its deleted stacked base blocked GitHub
  retargeting. It was rebuilt as #1139 and merged to `main`.
- #1138 is the remaining readiness gate branch. It should be reread against
  live GitHub state before merge and merged only with a current head SHA guard.

## Validation Commands And Results

Run from the rebuilt Phase 1G branch based on `main` after #1139 merged.

```bash
python3 scripts/validate_supply_chain_incidents.py
```

Result: PASS. Validated 25 supply-chain incidents.

```bash
python3 scripts/validate_supply_chain_graph.py
```

Result: PASS. Validated graph primitives: 73 entities and 93 relationships.

```bash
node scripts/test-supply-chain-pages.mjs
```

Result: PASS. Supply Chain page tests passed with 74 routes.

```bash
node --check scripts/check_supply_chain_public_readiness.mjs
```

Result: PASS.

```bash
node scripts/check_supply_chain_public_readiness.mjs
```

Result: PASS. The readiness report was written to
`.worker-state/supply-chain-public-readiness.json`.

```bash
git diff --check
```

Result: PASS.

## Readiness Report Summary

Latest report timestamp: `2026-06-13T17:12:08.137Z`.

```json
{
  "status": "pass",
  "counts": {
    "incidents": 25,
    "packages": 16,
    "repositories": 10,
    "organizations": 17,
    "maintainers": 5,
    "build_systems": 6,
    "distribution_channels": 11,
    "compromised_accounts": 8,
    "relationships": 93,
    "expected_routes": 74,
    "enabled_generated_routes": 74
  },
  "checks": [
    "incident validation: pass",
    "graph validation: pass",
    "page model test: pass",
    "site dependency install: pass",
    "disabled build smoke: pass",
    "enabled build smoke: pass"
  ],
  "failures": []
}
```

Checked featured incident routes:

- `/supply-chain/incidents/SC-2024-XZ-UTILS/`
- `/supply-chain/incidents/SC-2023-THREE-CX-DESKTOP/`
- `/supply-chain/incidents/SC-2020-SOLARWINDS-ORION/`
- `/supply-chain/incidents/SC-2018-NPM-EVENT-STREAM/`
- `/supply-chain/incidents/SC-2021-UA-PARSER-JS/`

## Known Unrelated Warnings

The full Astro builds emit existing campaign validator warnings for campaign
records that have fewer than the target two related incidents. The validator
still exits successfully and reports that campaign validation passed. These
warnings are unrelated to the Supply Chain stack and did not block the disabled
build, enabled build, or readiness gate.

## Merge Plan

1. Reread live state for #1138 after pushing the rebuilt Phase 1G branch.
2. Confirm the PR base is `main`, the head SHA matches the rebuilt branch, and
   changed files are limited to the readiness gate and operator docs.
3. If review requirements remain the only blocker, use the recorded owner
   authorization to admin squash merge with a current head SHA guard.
4. Do not enable `ENABLE_SUPPLY_CHAIN_PAGES=true` by default as part of this
   stack. Public enablement remains an operator/deployment configuration step
   after the readiness gate is merged and passing.
