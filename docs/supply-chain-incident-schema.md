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
- `first_public_warning_at`: optional first public warning date in `YYYY-MM-DD`
  or `null`
- `affected_ecosystems`: ecosystem labels such as `npm`, `pypi`, `windows`,
  `github-actions`, or `vendor-update`
- `affected_components`: structured impacted packages, projects, services, or
  update channels
- `releases`: optional version-addressable package releases with canonical
  versioned PURLs, publish dates, malicious range notes, and local reference IDs
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
- `threat_actors`: optional evidence-backed actor links
- `campaigns`: optional evidence-backed campaign links
- `attribution_confidence`: optional incident-level attribution confidence
- `attribution_evidence`: local evidence records for each actor/campaign edge

Featured incident pages may also carry editorial fields:

- `executive_summary`
- `timeline`
- `attack_chain`
- `affected_ecosystem`
- `defensive_lessons`
- `detection_notes`
- `open_questions`

These fields are optional for ordinary corpus records. Phase 1F requires them
only for the five curated featured incidents rendered as editorial Supply Chain
case studies.

Package components must include a canonical `package_url` PURL. Non-package
software, services, websites, and update channels should use `null`. See
`docs/supply-chain-purl-model.md` for the canonical PURL grammar and validation
contract. `pkg:generic/...` is allowed only for reviewed cross-ecosystem
placeholders and requires `purl_justification`.

Release records are optional in Phase 2C and are used only when public evidence
supports a precise package version and publish date. They use this shape:

```json
{
  "package_name": "flatmap-stream",
  "ecosystem": "npm",
  "purl": "pkg:npm/flatmap-stream@0.1.1",
  "version": "0.1.1",
  "published_at": "YYYY-MM-DD",
  "malicious_range": "0.1.1 or null",
  "references": ["ref-example"],
  "disclosed_at": "YYYY-MM-DD or null"
}
```

Every release must match an affected package component in the same incident.
The `purl` must be canonical, versioned, and backed by local reference IDs.
Generic release PURLs are not accepted because they cannot join cleanly to the
release-event spine.

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

## Attribution Convergence

Phase 2B adds optional actor and campaign convergence fields. These fields are
for explicit, evidence-backed links to existing Threatpedia actor/campaign
records or to provisional operator nodes. They are not automated attribution and
they are not scoring fields.

Attribution confidence values are:

- `confirmed`
- `likely`
- `suspected`
- `disputed`
- `unknown`

Threat actor links use:

```json
{
  "id": "actor-example",
  "name": "Example Actor",
  "actor_type": "public | provisional",
  "confidence": "confirmed | likely | suspected | disputed | unknown",
  "source_refs": ["ref-example"]
}
```

Campaign links use:

```json
{
  "id": "campaign-tp-camp-YYYY-NNNN",
  "campaign_id": "TP-CAMP-YYYY-NNNN",
  "name": "Example Campaign",
  "slug": "example-campaign-slug",
  "confidence": "confirmed | likely | suspected | disputed | unknown",
  "source_refs": ["ref-example"]
}
```

Every actor or campaign link must have a matching `attribution_evidence` record:

```json
{
  "target": "actor-example",
  "relationship_type": "ATTRIBUTED_TO_ACTOR",
  "source_refs": ["ref-example"],
  "summary": "bounded evidence basis for this edge"
}
```

Provisional actor nodes are allowed when public evidence supports a coherent
operator but does not support a named public APT. They must use stable
placeholder identifiers and must not fabricate nation-state or APT labels.

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

- `id` when the reference is used by an editorial field
- `title`
- `publisher`
- `url`
- `published_at`

The validator checks URL shape and date format. It does not fetch references or
make external network calls.

Editorial fields use local `reference_ids` that must resolve to `references[*].id`
inside the same incident record. This keeps editorial prose bound to the
curated corpus evidence and avoids cross-record citation drift.

## Featured Editorial Fields

Editorial fields are structured arrays rather than free-form Markdown. Claim
sections use this shape:

```json
{
  "text": "bounded evidence-backed statement",
  "reference_ids": ["ref-example"]
}
```

`timeline` entries use:

```json
{
  "date": "YYYY-MM-DD or YYYY-MM-DD/YYYY-MM-DD",
  "title": "short event title",
  "text": "bounded evidence-backed event summary",
  "reference_ids": ["ref-example"]
}
```

`attack_chain` entries use:

```json
{
  "stage": "short stage label",
  "text": "bounded evidence-backed stage description",
  "reference_ids": ["ref-example"]
}
```

Validator behavior:

- the five featured incidents must include every editorial field
- non-featured incidents do not need editorial fields
- editorial fields on non-featured records are rejected in Phase 1F
- timeline dates must be valid dates or date ranges
- every editorial item must cite at least one local reference ID
- cited reference IDs must exist in the same incident record

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
