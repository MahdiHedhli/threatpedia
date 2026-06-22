# Supply Chain 2G Backtest Results - 2026-06-22

This artifact records the Sprint A point-in-time backtest result against current
`origin/main` corpus data. The run uses stored fields only and does not perform
scoring, risk ranking, automated attribution, AI inference, or external
re-research.

Machine-readable output:
`docs/supply-chain-backtest-results-20260622.json`

Command:

```bash
python3 scripts/supply_chain_backtest.py > docs/supply-chain-backtest-results-20260622.json
```

## Aggregate

- Incidents evaluated: 35
- Incidents with prior graph signal: 10
- Incidents without prior graph signal: 25
- Prior-signal rate: 0.286
- Missing disclosure dates: 0
- Average discovery latency: 52.4 days

Signal type counts:

- account: 2
- actor: 6
- campaign: 4
- maintainer: 1
- release: 4
- seeded_by_seed_source: 2

## Interpretation

The current graph carries meaningful prior signal for the TeamPCP/Shai-Hulud
lineage and for a small number of release or maintainer anchored package
incidents. It does not yet carry broad predictive signal across most historical
supply-chain incidents: 25 of 35 evaluated incidents had no prior graph signal
under the conservative stored-fields-only model.

The strongest useful current result is the 2026 TeamPCP cluster. Before several
2026 disclosures, the graph already had actor, campaign, and in two cases
`SEEDED_BY` source-package signal. That supports continuing the grounded
discovery and drafting work, but it also argues against overstating the graph as
a general predictive engine before broader enrichment and backtesting.

## Per-Incident Results

| Incident | Disclosure | Prior signal | Strongest lead | Signal summary |
| --- | --- | --- | ---: | --- |
| `SC-2016-LINUX-MINT-ISO` | 2016-02-21 | no |  | No prior graph signal detected from stored relationships. |
| `SC-2017-CCLEANER` | 2017-09-18 | no |  | No prior graph signal detected from stored relationships. |
| `SC-2017-NOTPETYA-MEDOC` | 2017-07-01 | no |  | No prior graph signal detected from stored relationships. |
| `SC-2018-ESLINT-SCOPE` | 2018-07-12 | no |  | No prior graph signal detected from stored relationships. |
| `SC-2018-NPM-EVENT-STREAM` | 2018-11-26 | yes | 78 | maintainer=right9ctrl (78d); release=flatmap-stream@0.1.1 (78d) |
| `SC-2019-ASUS-SHADOWHAMMER` | 2019-03-25 | no |  | No prior graph signal detected from stored relationships. |
| `SC-2020-OCTOPUS-SCANNER` | 2020-03-09 | no |  | No prior graph signal detected from stored relationships. |
| `SC-2020-SOLARWINDS-ORION` | 2020-12-13 | no |  | No prior graph signal detected from stored relationships. |
| `SC-2021-CODECOV-BASH-UPLOADER` | 2021-04-15 | no |  | No prior graph signal detected from stored relationships. |
| `SC-2021-DEPENDENCY-CONFUSION` | 2021-02-09 | no |  | No prior graph signal detected from stored relationships. |
| `SC-2021-KASEYA-VSA` | 2021-07-02 | no |  | No prior graph signal detected from stored relationships. |
| `SC-2021-NPM-RC` | 2021-11-04 | no |  | No prior graph signal detected from stored relationships. |
| `SC-2021-PHP-GIT-SERVER` | 2021-03-28 | no |  | No prior graph signal detected from stored relationships. |
| `SC-2021-UA-PARSER-JS` | 2021-10-22 | no |  | No prior graph signal detected from stored relationships. |
| `SC-2022-COLORS-FAKER` | 2022-01-09 | no |  | No prior graph signal detected from stored relationships. |
| `SC-2022-NODE-IPC` | 2022-03-16 | no |  | No prior graph signal detected from stored relationships. |
| `SC-2022-PYPI-CTX` | 2022-05-24 | no |  | No prior graph signal detected from stored relationships. |
| `SC-2022-PYTORCH-NIGHTLY` | 2022-12-31 | no |  | No prior graph signal detected from stored relationships. |
| `SC-2023-LEDGER-CONNECT-KIT` | 2023-12-14 | no |  | No prior graph signal detected from stored relationships. |
| `SC-2023-THREE-CX-DESKTOP` | 2023-03-29 | no |  | No prior graph signal detected from stored relationships. |
| `SC-2024-LOTTIE-PLAYER` | 2024-10-31 | no |  | No prior graph signal detected from stored relationships. |
| `SC-2024-POLYFILL-IO` | 2024-06-25 | no |  | No prior graph signal detected from stored relationships. |
| `SC-2024-ULTRALYTICS-PYPI` | 2024-12-11 | no |  | No prior graph signal detected from stored relationships. |
| `SC-2024-XZ-UTILS` | 2024-03-29 | no |  | No prior graph signal detected from stored relationships. |
| `SC-2025-GO-BOLTDB-TYPOSQUAT` | 2025-02-04 | yes | 1191 | release=github.com/boltdb-go/bolt@v1.3.1 (1191d) |
| `SC-2025-NPM-SHAI-HULUD` | 2025-09-16 | yes | 1 | release=@ctrl/tinycolor@4.1.1 (1d); release=@ctrl/tinycolor@4.1.2 (1d) |
| `SC-2025-SHAI-HULUD-2` | 2025-12-09 | yes | 85 | account=victim GitHub tokens (85d); account=compromised npm maintainer tokens (85d) |
| `SC-2025-TJ-ACTIONS-CHANGED-FILES` | 2025-03-15 | no |  | No prior graph signal detected from stored relationships. |
| `SC-2026-AXIOS` | 2026-03-31 | yes | 127 | actor=TeamPCP (127d) |
| `SC-2026-CHECKMARX-JENKINS` | 2026-05-11 | yes | 168 | actor=TeamPCP (168d); campaign=TeamPCP Multi-Ecosystem Supply Chain Campaign (168d); seeded_by_seed_source=aquasecurity/trivy-action (52d) |
| `SC-2026-LITELLM` | 2026-03-24 | yes | 120 | actor=TeamPCP (120d); campaign=TeamPCP Multi-Ecosystem Supply Chain Campaign (120d); seeded_by_seed_source=aquasecurity/trivy-action (4d) |
| `SC-2026-MEGALODON` | 2026-05-28 | yes | 185 | actor=TeamPCP (185d) |
| `SC-2026-MINI-SHAI-HULUD` | 2026-05-13 | yes | 170 | actor=TeamPCP (170d); campaign=TeamPCP Multi-Ecosystem Supply Chain Campaign (170d) |
| `SC-2026-NX-CONSOLE` | 2026-05-28 | no |  | No prior graph signal detected from stored relationships. |
| `SC-2026-TRIVY-CI` | 2026-03-24 | yes | 120 | actor=TeamPCP (120d); campaign=TeamPCP Multi-Ecosystem Supply Chain Campaign (120d) |
