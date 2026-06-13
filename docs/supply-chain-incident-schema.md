# Supply-Chain Incident Corpus Schema

Threatpedia maintains a structured supply-chain incident corpus so historical
incidents can inform later graph-schema design, attribution modeling, and
release-event enrichment without mixing those later decisions into the raw
corpus.

Phase 1C keeps the corpus as machine-readable evidence inventory while adding
enough structured depth for graph primitives. It is still not a risk engine.

## Corpus Location

```text
data/supply-chain-incidents/
```

The current corpus is:

```text
data/supply-chain-incidents/incidents.json
```

The schema primitive is:

```text
data/supply-chain-incidents/schema.json
```

## What the Corpus Models

Each incident records a public, documented supply-chain compromise or abuse
pattern using `schema_version: "supply-chain-incident/1"`.

The core fields are:

- `id`: stable identifier using `SC-YYYY-SLUG`
- `title`: short human-readable name
- `summary`: bounded factual summary
- `status`: currently `confirmed`
- `first_observed_at`: earliest known activity date in `YYYY-MM-DD`
- `disclosed_at`: public disclosure date in `YYYY-MM-DD`
- `affected_ecosystems`: ecosystem labels such as `npm`, `pypi`, `windows`,
  `github-actions`, or `vendor-update`
- `affected_components`: structured impacted packages, projects, services, or
  update channels
- `supply_chain_vectors`: normalized vector labels
- `impact_categories`: normalized impact labels
- `references`: public documentation for the incident
- `tags`: additional non-authoritative grouping tags
- `confidence`: `high`, `medium`, or `low` confidence in the structured record
- `evidence_level`: strongest evidence class used for the record: `primary`,
  `vendor`, `researcher`, `media`, or `inferred`
- `attack_stage`: controlled stage label for where the supply-chain abuse
  entered or propagated
- `source_artifact_divergence`: `true`, `false`, or `null` when unknown
- `maintainers`: named maintainers or maintainership handles when directly
  supported
- `repositories`: source repositories tied to the incident
- `build_systems`: build or CI/CD systems tied to the incident
- `distribution_channels`: registries, update channels, CDN scripts, source
  releases, or download paths used by the incident
- `compromised_accounts`: package-registry, source-control, or release-path
  accounts/tokens tied to the incident

Package components may include `package_url` when a PURL is available. Non-
package software, services, websites, and update channels should use `null`.

## Attack Stages

Current `attack_stage` values are:

- `source_compromise`
- `build_compromise`
- `account_compromise`
- `package_publish`
- `dependency_resolution`
- `distribution_compromise`
- `ci_cd_compromise`

These are placement labels for relationship extraction. They are not scoring
labels and do not attribute an actor.

## Evidence Quality

Every incident must carry:

- `confidence`: `high`, `medium`, or `low`
- `evidence_level`: `primary`, `vendor`, `researcher`, `media`, or `inferred`

Use `inferred` only when the structured field is clearly derived from the
documented record and no stronger class applies. Do not use evidence quality as
a severity score.

## Vector Labels

Current `supply_chain_vectors` values are:

- `build_system_compromise`
- `cdn_script_compromise`
- `ci_cd_action_compromise`
- `dependency_confusion`
- `distribution_site_compromise`
- `maintainer_account_compromise`
- `malicious_dependency`
- `package_repository_compromise`
- `protestware`
- `signed_update_compromise`
- `source_repository_compromise`
- `vendor_update_compromise`

These are modeling primitives. They are not actor attribution and do not imply
severity.

## Impact Labels

Current `impact_categories` values are:

- `backdoor`
- `credential_theft`
- `crypto_theft`
- `cryptomining`
- `data_exfiltration`
- `destructive_payload`
- `developer_workstation_compromise`
- `downstream_customer_compromise`
- `malware_distribution`
- `protest_payload`
- `ransomware_delivery`

These describe observed incident effects. They are not scoring labels.

## References

Every incident must have at least one public reference with:

- `title`
- `publisher`
- `url`
- `published_at`

The validator checks URL shape and date format. It does not fetch references or
make external network calls.

## Adding Future Incidents

1. Add a new object to `data/supply-chain-incidents/incidents.json`.
2. Use a stable ID in the form `SC-YYYY-SLUG`.
3. Keep `summary` factual and bounded.
4. Use existing vector and impact labels when possible.
5. Add a new label only when the existing schema cannot represent the incident.
6. Include at least one public reference.
7. Fill evidence-quality and graph-depth fields. Use empty arrays for
   unsupported maintainers, repositories, build systems, distribution channels,
   or compromised accounts.
8. Regenerate graph primitives and run validation:

```bash
python3 scripts/build_supply_chain_entities.py
python3 scripts/validate_supply_chain_incidents.py
python3 scripts/validate_supply_chain_graph.py
python3 -m unittest discover -s tests
git diff --check
```

## Non-Goals

This corpus does not implement:

- scoring
- risk engines
- graph databases
- attribution automation
- dashboards
- UI
- live feeds
- malware detection
- policy recommendations
