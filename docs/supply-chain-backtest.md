# Supply Chain Backtest Foundation

Threatpedia's supply-chain backtest is a stored-facts replay model. It exists to show when an incident became observable from the corpus data already modeled in the repository.

It does not score incidents, rank risk, infer actors, run machine learning, or recommend policy. Those are later phases. Phase 2G only bridges the curated incident graph to the release-event spine by replaying stored timestamps.

## Replay Inputs

The replay reads only stored corpus fields:

- `releases[].published_at` when a malicious package release is modeled.
- `first_observed_at` only when no release entity exists, such as a source-release artifact case.
- `first_public_warning_at` when the corpus records a warning signal before or at disclosure.
- `disclosed_at` for the public disclosure date.
- `references[].published_at` to separate evidence available at replay time from later-discovered evidence.

The replay does not re-research incidents. If a timestamp is missing, the corpus must be updated through the normal evidence-backed incident workflow before the replay can use it.

## Backtest Modes

By default the replay covers every incident in `data/supply-chain-incidents/incidents.json`.
It emits both:

- timeline measurements for stored publish/warning/disclosure dates
- prior-signal reconstruction against the stored graph relationships

For compatibility with the initial Phase 2G foundation, the three original
incidents can still be replayed with:

```bash
python3 scripts/supply_chain_backtest.py --legacy-required-incidents
```

Those original seed incidents are:

- XZ Utils backdoor attempt: modeled as a source-release artifact case, so the replay uses stored `first_observed_at` as the publication/availability anchor.
- event-stream malicious dependency insertion: modeled with the `flatmap-stream@0.1.1` release and its stored `published_at` value.
- Go BoltDB typosquat module proxy backdoor: modeled with the `github.com/boltdb-go/bolt@v1.3.1` release and its stored `published_at` value.

## Timeline Output

Run:

```bash
python3 scripts/supply_chain_backtest.py
```

The command emits JSON with one timeline per incident:

- `publish_date`
- `publish_date_source`
- `first_warning_signal_at`
- `public_disclosure_at`
- `discovery_latency_days`
- `discovery_latency_basis`
- `available_at_the_time`
- `later_discovered_evidence`
- `undated_evidence`
- `releases`

`discovery_latency_days` is the elapsed days from the publish/availability anchor to `first_public_warning_at` when present, otherwise to `disclosed_at`. This is a measurement only, not a score.

## Prior-Signal Reconstruction

For each incident with `disclosed_at`, the backtest reconstructs the graph as
of the day before disclosure. It then checks whether the incident's linked graph
already carried a public signal in stored data:

- responsible actor already linked to a prior public incident
- related campaign already linked to a prior public incident
- maintainer or account already linked to a prior public incident
- maintainer with a stored dated anchor before disclosure
- package or release already linked to prior public incident data
- `SEEDED_BY` source package or release already present before the current incident

The prior-signal pass uses existing relationship files and entity
`source_incident_ids`. It does not infer actors, guess missing relationships, or
research outside sources. Negative rows are kept in the output because absence
of prior signal is part of the result.

## Evidence Split

The replay preserves the distinction between available-at-the-time evidence and later-discovered evidence.

References with `published_at` on or before the replay date are listed in `available_at_the_time.reference_ids`. References published after the replay date are listed in `later_discovered_evidence.reference_ids`. Undated references are kept separate instead of being silently treated as available.

This split is the foundation for future backtesting. It prevents later knowledge from leaking into a historical replay.

## Analysis Artifact

The current full-corpus run is committed as:

- `docs/supply-chain-backtest-results-20260622.md`
- `docs/supply-chain-backtest-results-20260622.json`

The Markdown artifact summarizes the aggregate and every incident row. The JSON
artifact preserves the machine-readable timelines, signals, lead times, and
evidence references.

## Current Limits

- It reads stored dates and does not fill gaps.
- It does not join live ingestion data yet.
- It does not perform scoring, actor attribution, AI inference, or soak/canary logic.
