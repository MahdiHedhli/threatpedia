# PR1 Schema/Casing Audit Report - Threatpedia Schema/Intake Foundation

**Branch:** `codex/schema-intake-pr1-audit`
**Head SHA audited before this report update:** `c3d52fc71e4ac7a1dbc4343ac26722c2f9819778` (`origin/main`)
**Repository / checkout:** public `threatpedia` audit worktree plus read-only non-sensitive private control-plane summary inspection
**Audited by:** Codex / Kernel K
**Date:** 2026-06-18
**Input package:** `codex-handoff-threatpedia-schema-intake-foundation-v3`

> PR1 is audit-only. This report is the only intended PR1 artifact. No schemas,
> validators, corpus content, workflows, package files, pipeline behavior,
> migration tooling, or task data were changed.

---

## 0. Scope Control

- [x] No schema changes
- [x] No validator changes
- [x] No corpus/content changes
- [x] No workflow changes
- [x] No package/dependency changes
- [x] No pipeline behavior changes
- [x] No task-data changes
- [x] No migration tooling
- [x] No PR2 branch
- [x] PR2 not started

---

## 1. Repositories / Branches / Commits Audited

| Repo / checkout | Branch | Commit SHA | Notes |
|---|---|---|---|
| `threatpedia` public | `origin/main` via `codex/schema-intake-pr1-audit` | `c3d52fc71e4ac7a1dbc4343ac26722c2f9819778` | Current public source of truth for Astro schema, corpus, task schema, validators, and docs. |
| private control-plane summaries | omitted from public report | omitted from public report | Control-plane/spec/ADR inspection only. No private branches, commits, checkout paths, or file paths are published here. |

---

## 2. Files Inspected

```text
Attached handoff package:
  SPEC-ENTITY-ADVERSARY-PROFILE.md
  SPEC-LEAD-INTAKE-CLASSIFICATION.md
  CLAUDE-DANGERMOUSE-PUBLIC-PR1-AUDIT-REFERENCE.md
  PR1-SCHEMA-CASING-AUDIT-TEMPLATE.md
  PR1-RECONCILIATION-GATE-BEFORE-PR2.md

Public schema / standards:
  site/src/content.config.ts
  docs/DATA-STANDARDS-v1.0.md
  docs/DATA-STANDARDS.md

Public corpus:
  site/src/content/threat-actors/*.md
  site/src/content/{incidents,campaigns,zero-days}/**/*.md (targeted searches only)

Public pipeline / validators / docs:
  .github/pipeline/config.yml
  .github/pipeline/schema/task-schema.json
  .github/pipeline/tasks/*.json (counts and targeted key searches only)
  docs/PIPELINE.md
  scripts/pipeline-run-task.mjs
  scripts/pipeline-schema.mjs
  scripts/validate-content-corpus.mjs
  scripts/validate-pipeline-tasks.mjs

Private control-plane input, summarized only:
  entity-ID and source/manifest guidance summaries
  coordination/spec guidance summaries
  MITRE ATT&CK/STIX ingestion model summary
  targeted private grep for TP-APT, external anchors, STIX, MISP, Malpedia, and related casing terms
```

---

## 3. Answers To PR1 Questions

### Q1. Is adversary/threat-actor content frontmatter snake_case or camelCase?

**Answer:** Current public threat-actor frontmatter is camelCase.

**Evidence:** `site/src/content.config.ts` defines `firstSeen`, `lastSeen`,
`targetSectors`, `targetGeographies`, `mitreMappings`,
`attributionConfidence`, `attributionRationale`, `reviewStatus`,
`generatedBy`, and `generatedDate`. All 63 files under
`site/src/content/threat-actors/` contain `reviewStatus`; zero contain
`review_status`.

The older public `docs/DATA-STANDARDS-v1.0.md` prose is snake_case
(`apt_id`, `review_status`, `attribution_confidence`, `vendor_names`,
`nation_state`, `sub_org_affiliation`). That document has drifted from the live
Astro schema.

### Q2. Is lifecycle field `review_status` or `reviewStatus`?

**Answer:** `reviewStatus`.

**Evidence:** `site/src/content.config.ts` uses
`reviewStatus: reviewStatus.default('draft_ai')` for threat actors. All 63
public threat-actor records carry `reviewStatus`; none carry `review_status`.

### Q3. What are the current lifecycle enum values in `content.config.ts`?

**Answer:** The locked values are exactly:

```text
draft_ai | draft_human | under_review | certified | disputed | deprecated
```

**Evidence:** `site/src/content.config.ts` defines `const reviewStatus =
z.enum([...])` with exactly those six values.

### Q4. How are `sources` currently represented?

**Answer:** Public content uses `sources: z.array(sourceSchema)`, where each
source object is:

```text
url: string URL
publisher: string
publisherType: government | vendor | media | research | community
reliability: R1 | R2 | R3 | R4
publicationDate: string
accessDate?: string
archived: boolean default false
archiveUrl?: string URL
```

Threat-actor `sources` are defaulted to `[]` by schema, and all 63 current
threat-actor records include `sources`.

**Evidence:** `site/src/content.config.ts` `sourceSchema`; targeted public
searches and frontmatter counts. The live source reliability field is
`reliability`, not `source_rating`; the live source date field is
`publicationDate`, not `published_at`.

### Q5. Does `revisions[]` already exist globally?

**Answer:** No live global `revisions[]` field exists in public schema or
public threat-actor frontmatter.

**Evidence:** Targeted public search found no schema or frontmatter
`revisions` field in `site/src/content/threat-actors` or
`site/src/content.config.ts`. Private editorial docs contain revision concepts
for workflow, but not a live public content frontmatter `revisions[]` schema.

### Q6. Are `aliases` / `vendor_names` / `nation_state` / `sub_org_affiliation` present today, and under what live names?

**Answer:**

| v0.5 / DATA-STANDARDS concept | Current public live name | Count in 63 threat actors | Notes |
|---|---|---:|---|
| `aliases` | `aliases` | 63 | Flat string array. Not sourced `aliasRecords[]`. |
| `vendor_names` | absent | 0 | No `vendor_names` or `vendorNames` in public records. |
| `nation_state` | closest live field: `country` | 63 | Display strings such as `Russia`, `China`, `Unknown`, not ISO-only. |
| `sub_org_affiliation` | closest live field: `affiliation` | 63 | Free text such as `Russia (GRU Unit 26165)` or `Cybercriminal`. |

**Evidence:** Parsed frontmatter counts and targeted searches. `aliases`,
`country`, and `affiliation` are present in 63/63; `vendor_names`,
`vendorNames`, `nation_state`, `nationState`, `sub_org_affiliation`, and
`subOrgAffiliation` are absent in 63/63.

### Q7. Is `attribution_confidence` / `attributionConfidence` present anywhere?

**Answer:** Yes, as camelCase `attributionConfidence`.

**Evidence:** `site/src/content.config.ts` defines
`attributionConfidence = z.enum(['A1','A2','A3','A4','A5','A6'])`; threat
actors use `attributionConfidence: attributionConfidence.optional()`. Parsed
frontmatter counts show `attributionConfidence` present in 63/63 public
threat-actor records and `attribution_confidence` absent in 63/63.

Observed threat-actor distribution:

```text
A1: 19
A2: 13
A3: 22
A4: 9
```

### Q8. How many threat-actor/adversary records would need migration?

**Answer:** 63/63 public threat-actor records need migration or warning-mode
compatibility before v0.5 target fields can be hard-required.

**Evidence / command summary:** Parsed all files under
`site/src/content/threat-actors/*.{md,mdx}`. Every record is missing
`entityKind` / `entity_kind`, `isAnalyticConstruct` /
`is_analytic_construct`, `externalIds` / `external_ids`, `aptId` / `apt_id`,
`aliasRecords` / `alias_records`, and `relationshipClaims` /
`relationship_claims`.

### Q9. Which existing files would fail under v0.5 as written?

**Answer:** All 63 public threat-actor files would fail v0.5 as written.

Common failure categories:

- v0.5 minimum draft shape requires `apt_id`; public threat actors have no `aptId` or `apt_id`.
- v0.5 requires `article_type: entity_profile`; public threat actors have neither `articleType` nor `article_type`.
- v0.5 requires `canonical_name`; public threat actors use `name`.
- v0.5 requires `entity_kind`; public records have neither `entityKind` nor `entity_kind`.
- v0.5 requires `is_analytic_construct`; public records have neither `isAnalyticConstruct` nor `is_analytic_construct`.
- v0.5 requires `review_status`; public records use `reviewStatus`.
- v0.5 requires record-level `confidence` A-F; public threat actors have no such field.
- v0.5 source examples use `title`, `published_at`, and `source_rating`; public `sources[]` use `publisher`, `publicationDate`, and `reliability`.
- v0.5 `external_ids`, `alias_records`, `attribution_claims`, and `relationship_claims` are absent. Some are optional/should-level in the spec, but any certifiable-path enforcement depending on them would fail or remain inert.

Affected file count: 63/63 files in `site/src/content/threat-actors/`.

### Q10. Which assumptions in v0.5 / v1.2 need casing/name reconciliation?

**Answer:**

1. v0.5 content fields must be translated to camelCase for the live public
   schema: `entity_kind` -> `entityKind`, `is_analytic_construct` ->
   `isAnalyticConstruct`, `operating_models` -> `operatingModels`,
   `external_ids` -> `externalIds`, `alias_records` -> `aliasRecords`,
   `attribution_claims` -> `attributionClaims`, `relationship_claims` ->
   `relationshipClaims`, `last_verified_at` -> `lastVerifiedAt`,
   `external_refs` -> `externalRefs`, `imported_source_confidence` ->
   `importedSourceConfidence`, `canonical_name_source` ->
   `canonicalNameSource`, `naming_rationale` -> `namingRationale`, and
   `review_status` -> `reviewStatus`.
2. The public collection must remain `site/src/content/threat-actors/`; do not
   rename to `adversary`, `adversary-profiles`, or `entities` in PR2.
3. Live display fields `name`, `country`, `affiliation`, `motivation`,
   `targetSectors`, `targetGeographies`, `tools`, and `mitreMappings` must be
   preserved unless a later approved migration changes them.
4. `attributionConfidence` is a fully populated live legacy field and must not
   be hard-removed in PR2.
5. Live `sources[].reliability` must not be renamed to `source_rating`; v0.5's
   source-rating language maps to the live `reliability` field for current
   content.
6. v1.2 operational/task records are camelCase by design, but current public
   task acceptance uses snake_case keys such as `review_status` in
   `.github/pipeline/tasks/*.json` and `.github/pipeline/schema/task-schema.json`.
   Intake PR4 must reconcile with the task schema then, not in PR1.
7. `manualOverride`, `kevStatus`, `activeStatus` validity, and
   freshness/reverify fields are operational/task state, not content
   frontmatter.

### Q11. Do private control-plane summaries indicate a TP-APT registry, external anchor registry, STIX intrusion-set ID layer, or private data model absent from public main?

**Answer:** No active private TP-APT registry, external anchor registry data
file, MISP registry, or Malpedia registry data file was found. However, the
private control-plane does contain an active MITRE ATT&CK/STIX identifier model
absent from public content. That ingestion model maps STIX `intrusion-set`
objects to `ThreatpediaRecord` objects and preserves
MITRE ATT&CK group IDs plus STIX object IDs in normalized scraper output.

**Evidence:**

- The inspected private MITRE ATT&CK ingestion model defines
  `STIX_TYPE_MAP["intrusion-set"] = "actor"`, extracts ATT&CK IDs from
  `external_references[source_name=mitre-attack].external_id`, emits
  `record_id=f"mitre-{attack_id}"`, and stores `raw_data.stix_id` plus
  `raw_data.attack_id`.
- Inspected private entity-ID guidance says threat actors use slug as primary
  key and have no numeric ID.
- Inspected private manifest guidance describes a future or historical
  `TP-APT-NNNN` entity manifest concept, but no active manifest file was found
  in the inspected private state.
- Targeted private grep did not find an active TP-APT, MISP, Malpedia, or
  external-anchor registry data file.

This means `aptId` remains greenfield for public content unless Kernel K
supplies a registry before PR2. `externalIds` is additive too, but MITRE/STIX
subfields must account for the existing private ingestion model instead of
being treated as entirely greenfield.

### Q12. If public and private schemas differ, which is authoritative for PR2?

**Answer:** For PR2 public implementation, `site/src/content.config.ts` and the
current public collection path are authoritative. Private docs are
reconciliation input, not implementation authority, unless Kernel K explicitly
ratifies a private model before PR2.

**Rationale:** The current public Astro build validates against
`site/src/content.config.ts`; the public corpus lives at
`site/src/content/threat-actors/`; inspected private entity-ID guidance says no
numeric actor IDs and no private entity IDs; no active private TP-APT registry
exists. Therefore, if no private registry is supplied before PR2, `aptId`
remains greenfield and must be warning-mode/compatibility-mode for legacy public
records until PR3 dry-run and approved migration. `externalIds` is additive too,
but MITRE/STIX subfields must account for the existing private MITRE ingestion
model.

### Q13. What casing convention should PR4 use for new intake/task data?

**Answer:** Proposed recommendation only: use an explicit adapter boundary.
Keep existing public task JSON and acceptance data in the current snake_case
task-layer convention, while allowing the v1.2 intake classifier's in-memory
or module-level API to use camelCase as written. Serialization into
`.github/pipeline/tasks/*.json` should remain compatible with the current task
schema unless Kernel K explicitly approves a task-data migration.

**Evidence:** Public pipeline docs and `scripts/validate-pipeline-tasks.mjs`
make `acceptance_criteria.review_status` the canonical serialized task shape for
new task writers; `acceptance.review_status` is a tolerated legacy alias. Across
318 task files, 314 use `acceptance_criteria.review_status` and 4 use
`acceptance.review_status`. No current task JSON file contains the v1.2
camelCase operational fields `workIntent`, `manualOverride`, `kevStatus`, or
`activeStatus`. Existing pipeline scripts read snake_case review-status
contracts while content frontmatter uses `reviewStatus`. The layer boundary
already exists and should be made explicit rather than blurred.

---

## 4. Layer-Dependent Casing Analysis

| Layer | Existing convention | Evidence | Proposed implementation recommendation |
|---|---|---|---|
| Content frontmatter (`site/src/content/**`) | Mostly camelCase for the v0.5 threat-actor fields under review, with existing named exceptions | `content.config.ts`, threat actor files, validator/generator prompts use `reviewStatus`, `attributionConfidence`, `targetSectors`; all collections also define the existing hyphenated `framework-mappings` field. | Preserve camelCase for the v0.5 threat-actor fields in PR2, while preserving existing non-camel fields such as `framework-mappings`. Translate v0.5 concepts to live field names rather than applying a blanket casing rewrite. |
| Operational/task data (`.github/pipeline/**`, task JSON, task schema) | snake_case in acceptance/task contracts | `docs/PIPELINE.md` and `scripts/validate-pipeline-tasks.mjs` define `acceptance_criteria.review_status` as canonical for new task writers; `acceptance.review_status` is tolerated legacy/schema drift. Current task files use `acceptance_criteria.review_status` in 314/318 and `acceptance.review_status` in 4/318. | Preserve canonical `acceptance_criteria.review_status` task serialization unless Kernel K approves a task-data migration. |
| New intake classifier records | v1.2 spec is camelCase; public task-layer destination is snake_case | No current public task JSON contains v1.2 camelCase operational fields. | Adapter boundary recommended for PR4: camelCase internal classifier shape, explicit snake_case serialization into task state. |

---

## 5. Comparison Against Claude/DangerMouse Public PR1 Reference

| Claude/DangerMouse public finding | Verified by Codex? | Public/private delta | Action before PR2 |
|---|---:|---|---|
| content frontmatter is camelCase | Yes | Private operational notes and live public schema align on current public `content.config.ts`; older standards prose is snake_case. | Implement v0.5 concepts in camelCase unless a migration alias is approved. |
| lifecycle field is `reviewStatus` | Yes | Private/task acceptance uses snake_case `review_status`; content remains `reviewStatus`. | Keep content lifecycle as `reviewStatus`; PR4 must serialize new task records through canonical `acceptance_criteria.review_status`. |
| lifecycle enum matches locked values | Yes | No conflicting active private lifecycle enum found. | Preserve values exactly. |
| sources use `reliability` R1-R4, not `source_rating` | Yes | Older standards/manifest prose says `source_rating`; live schema and tasks use `reliability`. | Map source-rating concept to live `reliability`; do not rename live sources in PR2. |
| `revisions[]` absent | Yes | Private editorial docs mention revision workflow concepts, not a live public content frontmatter `revisions[]`. | Treat as net-new if PR2 proposes it; do not assume legacy records have it. |
| `aliases` present; `vendor_names`/`nation_state`/`sub_org_affiliation` absent or docs-only | Yes | Private specs mention TP-APT/nation-state concepts; public live content uses `aliases`, `country`, `affiliation`. | Preserve current fields and add target fields in warning-mode if approved. |
| `attributionConfidence` present/populated | Yes | Private v1.0 prose says `attribution_confidence`; active public records use `attributionConfidence`. | Phase-1 warn + migrate; do not hard-remove. |
| externalIds / TP-APT anchor layer absent in public corpus | Yes | No active TP-APT registry found; private MITRE/STIX ingestion preserves ATT&CK/STIX identifiers for intrusion-set actors. | Treat `aptId` as greenfield unless registry supplied; reconcile `externalIds` MITRE/STIX subfields with the ingestion model. |
| all existing public records need migration or warning-mode compatibility | Yes | Private has no alternate migrated public corpus. | PR2 must not hard-fail all legacy records. |
| two live casing conventions: content camelCase, operational/task data snake_case in places | Yes | Current task schema validates snake_case `acceptance.review_status`. | Record layer boundary; do not silently convert both layers in PR2. |
| intake vocabulary greenfield; casing decision unresolved | Yes | v1.2 fields are not present in current public task JSON. | Kernel K should approve adapter-boundary recommendation before PR4. |

---

## 6. Proposed Reconciliation Recommendations - Not Authoritative For PR2

These are recommendations only. They do not authorize schema, validator, corpus,
migration, pipeline, or task-data changes.

### Content-Layer Field Casing

**Recommendation:** Use camelCase for public content fields.

**Implementation mapping required if approved:** Translate v0.5 conceptual
snake_case names to live camelCase names. Do not introduce parallel snake_case
frontmatter in the public content schema unless explicitly approved as a
migration alias.

### Intake/Task-Layer Field Casing

**Recommendation:** Use an adapter boundary.

**Adapter needed?** Yes.

**Rationale:** The v1.2 intake spec uses camelCase, but current public task
state and task schema use snake_case for acceptance contracts. Keep the public
task serialization stable unless a later PR explicitly migrates task data.

### Collection / Path Naming

**Recommendation:** Keep `site/src/content/threat-actors/` and the Astro
collection name `'threat-actors'`.

**No re-slug / no rename impact:** Do not rename the collection to `entities`,
`adversaries`, or `adversary-profiles` in PR2.

### Lifecycle Field / Values

**Recommendation:** Use `reviewStatus` with:

```text
draft_ai | draft_human | under_review | certified | disputed | deprecated
```

### Source Schema

**Recommendation:** Preserve current `sourceSchema` and field names. Use
`sources[].reliability` (`R1`-`R4`) as the live source reliability field. Do
not rename it to `source_rating`.

### Legacy Attribution Confidence

**Recommendation:** `attributionConfidence` is the live legacy A1-A6 field.
PR2 should support Phase-1 warning + migration mapping; it should not
hard-remove or confuse this field with claim-level A-F confidence.

### TP-APT / External Anchor Registry

**Recommendation:** No active private TP-APT registry was found. Default to
`aptId` as greenfield additive unless Kernel K supplies a registry before PR2.
`externalIds` is also additive for the public corpus, but MITRE/STIX subfields
should align with the private MITRE ingestion model's `record_id=f"mitre-{attack_id}"`,
`raw_data.attack_id`, and `raw_data.stix_id` conventions.

### Required-Field Enforcement Mode For Existing Records

**Recommendation:** Warning-mode until migration.

**Rationale:** 63/63 public threat-actor records lack the v0.5 target fields.
Hard-failing `entityKind`, `isAnalyticConstruct`, `aptId`, `externalIds`,
`aliasRecords`, `attributionClaims`, `relationshipClaims`, or `revisions[]`
immediately would block the current corpus. PR2 can enforce target shape in
dedicated tests/new target fixtures but should not hard-fail legacy records
before PR3 dry-run and approved migration.

### Anchor Backfill Ownership

**Recommendation:** Separate EP-orchestrated enrichment track unless Kernel K
supplies a registry before PR2.

**Rationale:** Anchor backfill requires sourced factual research. It is not a
mechanical casing migration and should not be invented by a blind script.

---

## 7. Migration Impact Summary

```text
Threat-actor/adversary records found:                                      63
Records with lifecycle field reviewStatus:                                 63
Records with snake_case review_status:                                      0
Records with legacy attributionConfidence:                                 63
Records with attribution_confidence:                                        0
Records missing entityKind/entity_kind:                                    63
Records missing isAnalyticConstruct/is_analytic_construct:                 63
Records with external anchors externalIds/external_ids/aptId/apt_id:        0
Records with relationship claims relationshipClaims/relationship_claims:    0
Records with aliasRecords/alias_records:                                    0
Records with flat aliases[]:                                               63
Records with country:                                                      63
Records with affiliation:                                                  63
Records with sources[]:                                                    63
Records likely to fail v0.5 target shape without migration/warning-mode:   63
Task JSON files inspected for casing:                                     318
Task JSON files with acceptance_criteria.review_status:                   314
Task JSON files with acceptance.review_status:                              4
Task JSON files with v1.2 camelCase intake fields:                          0
```

Review status distribution:

```text
draft_ai:     31
under_review: 31
certified:     1
```

Attribution confidence distribution:

```text
A1: 19
A2: 13
A3: 22
A4: 9
```

---

## 8. Files That Would Fail v0.5 As Written

All 63 public threat-actor files would fail as written. Reason categories:

```text
63/63 - missing aptId/apt_id
63/63 - missing articleType/article_type
63/63 - missing canonicalName/canonical_name
63/63 - missing entityKind/entity_kind
63/63 - missing isAnalyticConstruct/is_analytic_construct
63/63 - use reviewStatus, not review_status
63/63 - missing record-level confidence A-F field
63/63 - use live source shape (publicationDate/reliability), not v0.5 example shape (published_at/source_rating)
63/63 - missing externalIds/external_ids
63/63 - missing aliasRecords/alias_records
63/63 - missing relationshipClaims/relationship_claims
```

---

## 9. Required Reconciliation Decisions Before PR2

1. Approve or correct the camelCase implementation map for v0.5 content fields.
2. Confirm that `site/src/content/threat-actors/` remains the public collection/path for PR2.
3. Resolve the private spec conflict: older standards/manifest prose says `TP-APT-NNNN`, while inspected private entity-ID guidance and public live schema currently use slug-only threat actors.
4. Confirm whether `aptId` is greenfield additive unless a private registry is supplied before PR2.
5. Confirm how `externalIds` MITRE/STIX fields should map to the private MITRE ingestion model's `record_id=f"mitre-{attack_id}"`, `raw_data.attack_id`, and `raw_data.stix_id`.
6. Approve warning-mode compatibility for all existing legacy threat-actor records until PR3 migration dry-run and explicit rewrite approval.
7. Confirm source schema mapping: v0.5 `source_rating` language maps to live `sources[].reliability`; no PR2 source-field rename.
8. Confirm `attributionConfidence` Phase-1 warning + migration disposition and ensure claim-level A-F confidence remains separate.
9. Decide anchor backfill ownership. Default recommendation: separate EP enrichment track.
10. For PR4 later, approve or correct the adapter-boundary recommendation for intake/task casing.

---

## 10. Blockers / Unknowns

- PR2 must not start until Kernel K reconciles the decisions in section 9.
- No active private TP-APT/external anchor registry was found; if one exists
  outside the audited inputs, it must be supplied before PR2 changes the field
  enforcement plan.
- The private MITRE/STIX ingestion model is an active identifier model and should be
  reconciled before any `externalIds` MITRE/STIX design is implemented.

---

## 11. PR Completion Report

```text
Branch:
  codex/schema-intake-pr1-audit

Head SHA:
  Report branch head at PR update time: see PR #1215 current head.

PR URL:
  https://github.com/MahdiHedhli/threatpedia/pull/1215

Checks run:
  git status --short
  git rev-parse HEAD
  targeted rg inspections over public schema, content, pipeline, task data, and docs
  Python frontmatter/key counts over site/src/content/threat-actors/*.{md,mdx}
  Python task JSON casing counts over .github/pipeline/tasks/*.json
  private read-only control-plane summary inspections
  git diff --check

Reviewers requested/tagged:
  @MahdiHedhli, @dangermouse-bot, @ernestpenfold-bot

Exact blockers:
  PR2 not started. Await Kernel K reconciliation/signoff for casing, collection path,
  TP-APT/external anchor registry status, MITRE/STIX external ID handling,
  enforcement mode, source field mapping, attributionConfidence disposition,
  anchor backfill ownership, and PR4 intake/task casing.
```

---

## 12. Stop Statement

PR1 complete. PR2 was not started. No PR2 branch exists. No schema, validator,
corpus, workflow, package, pipeline, migration tooling, or task-data changes
were made. Awaiting Kernel K reconciliation before PR2.
