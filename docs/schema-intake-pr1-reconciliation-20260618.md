# PR1B Schema/Intake Reconciliation Gate

**Scope:** Threatpedia schema/intake foundation PR1B only.
**Status:** Public-safe reconciliation memo.
**Date:** 2026-06-18.
**Public base audited:** current `origin/main` at audit time.

This memo records the PR1B reconciliation decisions needed before PR2 can be
authorized. It intentionally avoids publishing private control-plane paths,
private commit identifiers, local worktree paths, or private sample records in
the public repository.

PR1B makes no schema, validator, corpus, workflow, package, task-data,
pipeline-behavior, or migration-tooling changes. PR2 was not started.

---

## 1. Summary Verdict

**Verdict:** PR2 is ready with conditions.

The public schema audit findings from PR1 remain the governing baseline for
public content:

- Threat-actor content lives under `site/src/content/threat-actors/**`.
- Public content frontmatter is camelCase.
- The lifecycle field is `reviewStatus`.
- Current lifecycle values are `draft_ai`, `draft_human`, `under_review`,
  `certified`, `disputed`, and `deprecated`.
- Sources use `sources[].reliability` with R1-R4 reliability values.
- `attributionConfidence` is live, populated, and should remain accepted.
- `revisions[]`, TP-APT IDs, and external identity anchors are not currently
  populated in public threat-actor content.

The private-state audit did not find a populated private registry that should
override the public content model for PR2. Therefore PR2 should be additive:
define the new adversary/intake structures, validate them when present, and
avoid corpus-wide hard requirements until a reviewed dry-run migration proves
the result.

---

## 2. Public PR1 Findings Confirmed Or Refuted

| PR1 finding | PR1B result | Public evidence |
|---|---|---|
| Content frontmatter is camelCase | Confirmed | `site/src/content.config.ts`; public threat-actor files use `reviewStatus`, not `review_status`. |
| Live collection/path is `site/src/content/threat-actors/**` | Confirmed | Astro content collection loader and existing content tree. |
| Lifecycle field is `reviewStatus` | Confirmed | `site/src/content.config.ts`. |
| Lifecycle values are locked to `draft_ai`, `draft_human`, `under_review`, `certified`, `disputed`, `deprecated` | Confirmed | `site/src/content.config.ts` enum. |
| Sources use `reliability` R1-R4, not `source_rating` | Confirmed | Public source schema in `site/src/content.config.ts`. |
| `revisions[]` is absent publicly | Confirmed | Public threat-actor records and schema do not contain this field. |
| `attributionConfidence` exists publicly and is populated | Confirmed | Public threat-actor records use A-scale attribution confidence values. |
| External IDs / TP-APT / anchor layer appears greenfield in public | Confirmed | Public threat-actor records do not carry populated external anchor objects. |
| Intake/task-layer casing is unresolved/mixed | Confirmed with update | Public content uses camelCase; public pipeline/task JSON uses snake_case operational contracts such as `acceptance_criteria.review_status`. |

---

## 3. Private-State Audit Findings

The private control-plane audit was performed to answer whether PR2 should be
bound to an existing private TP-APT or external-anchor registry. The public
repository should not publish private control-plane paths or private sample
records, so this section records only the reconciliation outcome.

### 3.1 TP-APT Registry

No populated private TP-APT registry was found that should govern PR2.

Decision:

- Treat TP-APT as greenfield operational data for PR2.
- Do not require PR2 to consume a private TP-APT registry.
- Do not generate synthetic TP-APT IDs for existing public actors in PR2.

### 3.2 External Identity Anchors

No populated private external-anchor registry was found for the field families
listed in the PR1B prompt:

- `aptId` / `apt_id`
- `externalIds` / `external_ids`
- `mitreAttackGroup` / `mitre_attack_group`
- `mispGalaxyUuid` / `misp_galaxy_uuid`
- `malpediaActor` / `malpedia_actor`
- `etdaSlug` / `etda_slug`
- `vendorRefs` / `vendor_refs`
- TP-APT identifiers
- STIX intrusion-set identifiers as public threat-actor anchors

Decision:

- External anchors should be optional/additive in PR2.
- Hard-validate anchor fields when present.
- Keep existing records in warning-mode until sourced enrichment/backfill lands.

### 3.3 Public/Private Authority

Where private intent and public implementation differ, PR2 should follow the
live public implementation for public content shape.

Reason:

- `site/src/content.config.ts` is the active public Astro schema.
- Existing public threat-actor records are already authored against that shape.
- No populated private registry was found that should override the public model.

### 3.4 Anchor Model Readiness

The hard/soft anchor model is **greenfield/inert** for existing public data.

PR2 can define optional anchor structures and validators, but the existing
corpus should not become invalid merely because it lacks those new structures.

---

## 4. TP-APT / External-Anchor Registry Decision

1. TP-APT is greenfield for PR2.
2. PR2 may introduce optional `aptId` and `externalIds` structures.
3. Existing legacy records should warn, not fail, when those fields are absent.
4. PR2 should hard-fail malformed anchor fields when they are present.
5. MITRE, MISP, Malpedia, ETDA, and vendor identifiers should remain external
   anchors, not Threatpedia canonical IDs.
6. Anchor population should happen through a separate sourced enrichment pass,
   not as an unsourced PR2 migration.

---

## 5. Content-Layer Canonical Mapping

### 5.1 Canonical Collection And Path

PR2 should use the live public path:

```text
site/src/content/threat-actors/**
```

Do not rename the collection in PR2.

### 5.2 Content Frontmatter Casing

PR2 content frontmatter should use camelCase for new v0.5 adversary fields,
while preserving existing known exceptions such as `framework-mappings`.

### 5.3 v0.5 Field Mapping For PR2

| v0.5 field | PR2 content-layer field |
|---|---|
| `entity_kind` | `entityKind` |
| `is_analytic_construct` | `isAnalyticConstruct` |
| `operating_models` | `operatingModels` |
| `external_ids` | `externalIds` |
| `mitre_attack_group` | `mitreAttackGroup` |
| `misp_galaxy_uuid` | `mispGalaxyUuid` |
| `malpedia_actor` | `malpediaActor` |
| `etda_slug` | `etdaSlug` |
| `vendor_refs` | `vendorRefs` |
| `alias_records` | `aliasRecords` |
| `attribution_claims` | `attributionClaims` |
| `relationship_claims` | `relationshipClaims` |
| `target_type` | `targetType` |
| `target_id` | `targetId` |
| `label_if_unresolved` | `labelIfUnresolved` |
| `first_seen` | `firstSeen` |
| `last_seen` | `lastSeen` |
| `as_of` | `asOf` |
| `last_verified_at` | `lastVerifiedAt` |
| `external_refs` | `externalRefs` |
| `imported_source_confidence` | `importedSourceConfidence` |
| `not_publicly_established` | `notPubliclyEstablished` |
| `canonical_name_source` | `canonicalNameSource` |
| `canonical_name_source_detail` | `canonicalNameSourceDetail` |
| `naming_rationale` | `namingRationale` |
| `review_status` | `reviewStatus` |

### 5.4 Existing Live Fields To Preserve As Legacy/Display Mirrors

These current public fields should remain accepted in PR2:

| Field | PR2 disposition |
|---|---|
| `country` | Preserve as display/legacy mirror. |
| `affiliation` | Preserve as display/legacy mirror. |
| `attributionConfidence` | Preserve as accepted legacy field; see section 7. |
| `attributionRationale` | Preserve as accepted legacy field. |
| `aliases` | Preserve flat display list; structured `aliasRecords` is additive target. |
| `tools` | Preserve display list. |
| `mitreMappings` | Preserve current mapping array. |
| `targetSectors` | Preserve display list. |
| `targetGeographies` | Preserve display list; do not hard-require across legacy corpus in PR2. |

### 5.5 Source Representation

PR2 should preserve the existing public source shape:

```yaml
sources:
  - url: ...
    publisher: ...
    publisherType: research
    reliability: R1
    publicationDate: "YYYY-MM-DD"
```

Do not rename `reliability` to `source_rating`.

Do not introduce Admiralty `source_rating` unless it is explicitly modeled as a
separate concept and mapped from the live public schema.

---

## 6. Intake/Task-Layer Casing Decision

### 6.1 Canonical Recommendation

Use an explicit adapter boundary.

- Public content frontmatter: camelCase.
- External/public task JSON: preserve the existing snake_case task contracts.
- Internal intake/classifier objects: may use v1.2 camelCase.

This avoids silently converting existing pipeline JSON into content-layer style
and reduces the risk that PR2 breaks task-state validators.

### 6.2 Conversion Boundary

Recommended conversion points:

1. Ingest receives external/task JSON in existing snake_case shape.
2. Task normalization converts task JSON into internal classifier input.
3. Classifier/intake logic may operate on camelCase objects.
4. Dispatcher/conductor output serializes back into the established public task
   JSON contract.

### 6.3 Intake v1.2 Field Status

The searched public task data did not show existing populated v1.2 fields for:

- `workIntent`
- `leadClass`
- `kevStatus`
- `effectiveActiveStatus`
- `activeStatusExpiresAt`
- `manualOverride`
- `canonicalSubjectId`
- `entityMatch`

Treat intake v1.2 as greenfield for PR2 unless Kernel K provides a separate
private control-plane source that should govern those fields.

---

## 7. attributionConfidence Disposition

### 7.1 Live Meaning And Scale

Public threat-actor records use `attributionConfidence` with A-scale values.
The populated values found during audit were A1-A4; PR2 should preserve the
broader A1-A6 compatibility unless Kernel K narrows it explicitly.

### 7.2 PR2 Handling

Recommended PR2 disposition:

- Keep `attributionConfidence` as an accepted legacy/display field.
- Warn, do not hard-fail, when legacy records have only
  `attributionConfidence` and no structured `attributionClaims[]`.
- Make `attributionClaims[]` the structured target for new authoring.
- Put any migration mapping into a PR3 dry-run report before corpus mutation.
- Do not remove or rename `attributionConfidence` in PR2.

### 7.3 Coexistence With Other Confidence Models

Use these concepts separately:

| Concept | Field | Scale | Scope |
|---|---|---|---|
| Legacy actor-level attribution confidence | `attributionConfidence` | A1-A6 | Current public display/legacy field. |
| Claim-level analytic confidence | `attributionClaims[].confidence` | A-F | New structured claim target. |
| Source reliability | `sources[].reliability` | R1-R4 | Source quality/reliability. |
| Imported MISP source confidence | `importedSourceConfidence` | 0-100 | Imported MISP confidence only. |

Do not collapse these into one field.

---

## 8. Legacy Warning-Mode Vs Hard-Required Decision

### 8.1 Recommended Validation Posture

For existing threat-actor records:

- Use warning-mode for missing new v0.5 fields.
- Hard-validate malformed new fields when present.
- Require new v0.5 fields for new/changed records once PR2 authoring begins.
- Make corpus-wide hard requirements only after PR3 dry-run and approved
  migration.

### 8.2 Fields That Should Be Warning-Mode Initially

- `entityKind`
- `isAnalyticConstruct`
- `externalIds`
- `aliasRecords`
- `attributionClaims`
- `relationshipClaims`
- `revisions`

### 8.3 Validations That Can Be Hard Immediately When Fields Are Present

- Malformed `malpediaActor` family key.
- Invalid enum values.
- Invalid claim confidence.
- Invalid relationship unresolved/target rules.
- ATT&CK technique without ATT&CK version in new structured v0.5 claim
  fields; do not hard-fail legacy `mitreMappings` before an approved migration.
- External reference actor/target misuse.
- Non-object structured claim entries.
- `importedSourceConfidence` outside 0-100.

---

## 9. Anchor Backfill Ownership

Anchor backfill should be separate from PR2 and PR3 implementation.

Recommended sequence:

1. PR2 implements schema additions, warning-mode compatibility, and validation
   behavior for present structured fields.
2. PR3 produces a dry-run migration report with candidate mappings.
3. Sourced anchor backfill becomes separate EP-orchestrated enrichment work.

If Kernel K later provides a populated private anchor registry, PR2 should
still consume it only through an explicit, reviewed mapping plan. It should not
implicitly rely on hidden registry state.

---

## 10. PR2 Readiness Verdict

PR2 can proceed if Kernel K accepts these conditions:

1. Public content shape is governed by `site/src/content.config.ts`.
2. New content-layer adversary fields use camelCase.
3. Task JSON keeps existing snake_case contracts at the boundary.
4. `sources[].reliability` R1-R4 remains canonical.
5. `attributionConfidence` remains accepted legacy/display data.
6. Structured `attributionClaims[]` is additive and warning-mode for existing
   records.
7. External anchors and TP-APT IDs are optional/additive for PR2.
8. No corpus-wide hard requirement lands before a reviewed PR3 dry-run.
9. Anchor backfill is owned as separate sourced enrichment work.

---

## 11. Exact Blockers Before PR2

No technical blockers were found that should prevent PR2 from being drafted if
Kernel K accepts the conditions above.

PR2 is blocked only on explicit Kernel K acceptance of the reconciliation
decisions in this memo.

---

## 12. Evidence Appendix

This appendix includes public-safe evidence only. Private control-plane evidence
was used to make the reconciliation decision but is not published here.

### 12.1 Public Paths Inspected

- `AGENTS.md`
- `docs/schema-casing-audit-20260618.md`
- `docs/PIPELINE.md`
- `site/src/content.config.ts`
- `site/src/content/threat-actors/**`
- `.github/pipeline/schema/task-schema.json`
- `.github/pipeline/tasks/*.json`
- `scripts/validate-pipeline-tasks.mjs`

### 12.2 Public Search Patterns Used

- `reviewStatus`
- `review_status`
- `attributionConfidence`
- `attributionRationale`
- `revisions`
- `externalIds`
- `external_ids`
- `aptId`
- `apt_id`
- `TP-APT`
- `entityKind`
- `entity_kind`
- `isAnalyticConstruct`
- `is_analytic_construct`
- `aliasRecords`
- `alias_records`
- `attributionClaims`
- `attribution_claims`
- `relationshipClaims`
- `relationship_claims`
- `source_rating`
- `reliability`
- `acceptance_criteria`
- `acceptance`
- `workIntent`
- `leadClass`
- `kevStatus`
- `effectiveActiveStatus`
- `activeStatusExpiresAt`
- `manualOverride`
- `canonicalSubjectId`
- `entityMatch`

### 12.3 Public Counts

| Item | Count/result |
|---|---:|
| Public threat-actor files inspected | 63 |
| Public threat actors with `reviewStatus` | 63 |
| Public threat actors with `review_status` | 0 |
| Public threat actors with `attributionConfidence` | 63 |
| Public threat actors with `revisions` | 0 |
| Public threat actors with populated external anchor families checked here | 0 |
| Public task JSON files inspected | 323 |
| Public task JSON files using `acceptance_criteria.review_status` | 319 |
| Public task JSON files using tolerated legacy `acceptance.review_status` | 4 |
| Public task JSON files with checked v1.2 camelCase intake fields | 0 |

### 12.4 Public Sample Records

Representative public evidence:

- `site/src/content/threat-actors/apt29.md` uses camelCase fields including
  `reviewStatus`, `firstSeen`, `lastSeen`, `targetSectors`,
  `targetGeographies`, `mitreMappings`, `attributionConfidence`, and
  `sources[].reliability`.
- Current public task JSON uses snake_case task metadata and
  `acceptance_criteria.review_status`.

### 12.5 Head Identifiers

The public base was current `origin/main` at audit time. Private head
identifiers are intentionally not published in the public repository; the
private audit conclusion is summarized in section 3.

---

## B. PR2 READY WITH CONDITIONS

PR2 may be drafted only after Kernel K explicitly accepts the conditions in
section 10. This memo does not authorize PR2 by itself.
