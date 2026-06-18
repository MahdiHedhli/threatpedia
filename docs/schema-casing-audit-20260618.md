# PR1 Schema/Casing Audit Report - Threatpedia Schema/Intake Foundation

**Branch:** `codex/schema-intake-pr1-audit-20260618`  
**Head SHA audited before this report:** `5cad0a3e454ed7a558c34e5e747b547712901156` (`origin/main`)
**Repository / checkout:** public `threatpedia` audit clone plus read-only `threatpedia-working` private checkout  
**Audited by:** Codex / Kernel K Dev2  
**Date:** 2026-06-18

> PR1 is audit-only. This report is the only intended PR1 artifact. No schemas, validators, corpus content, workflows, package files, pipeline behavior, or task data were changed.

---

## 0. Scope Control

- [x] No schema changes
- [x] No validator changes
- [x] No corpus/content changes
- [x] No workflow changes
- [x] No package/dependency changes
- [x] No pipeline behavior changes
- [x] No task-data changes
- [x] PR2 not started

---

## 1. Repositories / Branches / Commits Audited

| Repo / checkout | Branch | Commit SHA | Notes |
|---|---|---|---|
| `threatpedia` public | `origin/main` via `codex/schema-intake-pr1-audit-20260618` | `5cad0a3e454ed7a558c34e5e747b547712901156` | Fresh clone at `/tmp/threatpedia-pr1-schema-audit`; report added after audit. |
| `threatpedia-working` private | `codex/ernest-review-lane-identity` | `74fb3bdf604a314349f4cdef4f4ad50e9a2873dc` | Read-only inspection. Checkout was dirty before PR1; no private files were modified. |

Private working tree pre-existing dirty state:

```text
 M working/agent-notes/codex-log.md
 M working/worker-rules/kernel-k-review-heartbeat.md
 M working/worker-rules/threatpedia-dispatcher.md
?? pr1203-brief-short.md
?? working/scratchpad/pr1203.diff
?? working/worker-rules/dangermouse-heartbeat.md
?? working/worker-rules/ernest-penfold-review-heartbeat.md
```

---

## 2. Files Inspected

```text
Attached handoff reference:
  /tmp/threatpedia-pr1-handoff/codex-handoff-threatpedia-schema-intake-foundation-v2/SPEC-ENTITY-ADVERSARY-PROFILE.md
  /tmp/threatpedia-pr1-handoff/codex-handoff-threatpedia-schema-intake-foundation-v2/SPEC-LEAD-INTAKE-CLASSIFICATION.md
  /tmp/threatpedia-pr1-handoff/codex-handoff-threatpedia-schema-intake-foundation-v2/CLAUDE-DANGERMOUSE-PUBLIC-PR1-AUDIT-REFERENCE.md
  /tmp/threatpedia-pr1-handoff/codex-handoff-threatpedia-schema-intake-foundation-v2/PR1-SCHEMA-CASING-AUDIT-TEMPLATE.md
  /tmp/threatpedia-pr1-handoff/codex-handoff-threatpedia-schema-intake-foundation-v2/PR1-RECONCILIATION-GATE-BEFORE-PR2.md

Public schema / standards:
  site/src/content.config.ts
  docs/DATA-STANDARDS-v1.0.md
  docs/DATA-STANDARDS.md

Public corpus:
  site/src/content/threat-actors/*.md
  site/src/content/{incidents,campaigns,zero-days}/**/*.md (targeted searches only)

Public pipeline / validators / docs:
  scripts/validate-content-corpus.mjs
  scripts/generate-article.mjs
  scripts/pipeline-run-task.mjs
  scripts/pipeline-schema.mjs
  scripts/validate-pipeline-tasks.mjs
  .github/pipeline/config.yml
  .github/pipeline/schema/task-schema.json
  docs/PIPELINE.md

Private working state:
  working/decisions/0002-three-content-collections.md
  working/decisions/0005-pipeline-reset-and-spec-first.md
  working/decisions/0007-entity-id-format.md
  working/specs/MANIFEST-SPEC.md
  working/specs/INGESTION-SPEC.md
  working/specs/SOURCE-SPEC.md
  working/specs/EDITORIAL-WORKFLOW-SPEC.md
  working/specs/COORDINATION-SPEC.md
  working/specs/AGENT-TASK-SPEC.md
  working/inbox/penfold/TASK-2026-0055-populate-missing-threat-actors.md
  working/inbox/penfold/TASK-2026-0059-generate-threat-actor-article.md
  working/inbox/dangermouse/TASK-2026-0071-threat-actor-promotion-path.md
  working/supervisor/roadmap-backlog.md
  working/supervisor/legacy-disposition-plan.md
  .worker-state/threatpedia-dispatcher/automation-registry.json
```

---

## 3. Answers To PR1 Questions

### Q1. Is adversary/threat-actor frontmatter snake_case or camelCase?

**Answer:** Current public threat-actor frontmatter is camelCase.

**Evidence:** `site/src/content.config.ts` defines `firstSeen`, `lastSeen`, `targetSectors`, `targetGeographies`, `mitreMappings`, `attributionConfidence`, `attributionRationale`, `reviewStatus`, `generatedBy`, and `generatedDate`. All 63 files under `site/src/content/threat-actors/` contain `reviewStatus`; zero contain `review_status`.

The older public `docs/DATA-STANDARDS-v1.0.md` prose is snake_case (`apt_id`, `review_status`, `attribution_confidence`, `vendor_names`, `nation_state`, `sub_org_affiliation`). This is a standards-vs-live-schema mismatch. PR2 must implement against live `content.config.ts` casing unless Kernel K explicitly approves a migration alias.

### Q2. Is lifecycle field `review_status` or `reviewStatus`?

**Answer:** `reviewStatus`.

**Evidence:** `site/src/content.config.ts` uses `reviewStatus: reviewStatus.default('draft_ai')` for threat actors. All 63 public threat-actor records carry `reviewStatus`; none carry `review_status`.

### Q3. What are the current lifecycle enum values in `content.config.ts`?

**Answer:** The locked values are exactly:

```text
draft_ai | draft_human | under_review | certified | disputed | deprecated
```

**Evidence:** `site/src/content.config.ts` defines:

```ts
const reviewStatus = z.enum([
  'draft_ai',
  'draft_human',
  'under_review',
  'certified',
  'disputed',
  'deprecated',
]);
```

### Q4. How are `sources` currently represented?

**Answer:** Public content uses `sources: z.array(sourceSchema)`, where each source object is:

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

Threat-actor `sources` are defaulted to `[]` by schema, but all 63 current threat-actor records include `sources`.

**Evidence:** `site/src/content.config.ts` `sourceSchema`; parsed frontmatter counts show `sources` present in 63/63 threat-actor records. The live source reliability field is `reliability`, not `source_rating`; the live source date field is `publicationDate`, not `published_at`.

### Q5. Does `revisions[]` already exist globally?

**Answer:** No live global `revisions[]` field exists in public schema or public frontmatter.

**Evidence:** Targeted public search found no schema or frontmatter `revisions` field; the only public match was prose in a zero-day body about product hardware revisions. Private active docs mention editorial revision concepts and `required_revisions[]` in `EDITORIAL-WORKFLOW-SPEC.md`, but not a live content frontmatter `revisions[]` schema.

### Q6. Are `aliases` / `vendor_names` / `nation_state` / `sub_org_affiliation` present today, and under what live names?

**Answer:**

| v0.5 / DATA-STANDARDS concept | Current public live name | Count in 63 threat actors | Notes |
|---|---|---:|---|
| `aliases` | `aliases` | 63 | Flat string array. Not sourced `aliasRecords[]`. |
| `vendor_names` | absent | 0 | No `vendor_names` or `vendorNames` in public records. |
| `nation_state` | closest live field: `country` | 63 | Values are display strings such as `Russia`, `China`, `Unknown`, not ISO-only. |
| `sub_org_affiliation` | closest live field: `affiliation` | 63 | Free text such as `Russia (GRU Unit 26165)` or `Cybercriminal`. |

**Evidence:** Parsed frontmatter counts: `aliases`, `country`, and `affiliation` present in 63/63; `vendor_names`, `vendorNames`, `nation_state`, `nationState`, `sub_org_affiliation`, and `subOrgAffiliation` absent in 63/63.

### Q7. Is `attribution_confidence` / `attributionConfidence` present anywhere?

**Answer:** Yes, as camelCase `attributionConfidence`.

**Evidence:** `site/src/content.config.ts` defines `attributionConfidence = z.enum(['A1','A2','A3','A4','A5','A6'])`; threat actors use `attributionConfidence: attributionConfidence.optional()`. Parsed frontmatter counts show `attributionConfidence` present in 63/63 public threat-actor records and `attribution_confidence` absent in 63/63.

Observed threat-actor distribution:

```text
A1: 19
A2: 13
A3: 22
A4: 9
```

### Q8. How many threat-actor/adversary records would need migration?

**Answer:** 63/63 public threat-actor records need migration or warning-mode compatibility before v0.5 target fields can be hard-required.

**Evidence / command summary:** Parsed all files under `site/src/content/threat-actors/*.{md,mdx}`. Every record is missing `entityKind` / `entity_kind`, `isAnalyticConstruct` / `is_analytic_construct`, `externalIds` / `external_ids`, `aptId` / `apt_id`, `aliasRecords` / `alias_records`, and `relationshipClaims` / `relationship_claims`.

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

Affected files:

```text
site/src/content/threat-actors/akira-ransomware.md
site/src/content/threat-actors/apt1.md
site/src/content/threat-actors/apt10.md
site/src/content/threat-actors/apt27.md
site/src/content/threat-actors/apt28.md
site/src/content/threat-actors/apt29.md
site/src/content/threat-actors/apt31.md
site/src/content/threat-actors/apt32-oceanlotus.md
site/src/content/threat-actors/apt33-elfin.md
site/src/content/threat-actors/apt34-oilrig.md
site/src/content/threat-actors/apt35-charming-kitten.md
site/src/content/threat-actors/apt37-reaper.md
site/src/content/threat-actors/apt38.md
site/src/content/threat-actors/apt40.md
site/src/content/threat-actors/apt41.md
site/src/content/threat-actors/blackbasta.md
site/src/content/threat-actors/blackcat-alphv.md
site/src/content/threat-actors/blacksuit-royal-lineage.md
site/src/content/threat-actors/cl0p-group.md
site/src/content/threat-actors/conti.md
site/src/content/threat-actors/darkhotel.md
site/src/content/threat-actors/darkside.md
site/src/content/threat-actors/dragonfly-energetic-bear.md
site/src/content/threat-actors/dragonforce.md
site/src/content/threat-actors/equation-group.md
site/src/content/threat-actors/evil-corp.md
site/src/content/threat-actors/eviltokens.md
site/src/content/threat-actors/fin11.md
site/src/content/threat-actors/fin12.md
site/src/content/threat-actors/fin6.md
site/src/content/threat-actors/fin7.md
site/src/content/threat-actors/fulcrumsec.md
site/src/content/threat-actors/hafnium.md
site/src/content/threat-actors/handala.md
site/src/content/threat-actors/kimsuky-apt43.md
site/src/content/threat-actors/lapsus.md
site/src/content/threat-actors/lazarus-group.md
site/src/content/threat-actors/lockbit.md
site/src/content/threat-actors/medusa.md
site/src/content/threat-actors/mr-raccoon.md
site/src/content/threat-actors/muddywater.md
site/src/content/threat-actors/mustang-panda.md
site/src/content/threat-actors/play-ransomware.md
site/src/content/threat-actors/qilin.md
site/src/content/threat-actors/ransomhouse.md
site/src/content/threat-actors/ransomhub.md
site/src/content/threat-actors/revil-sodinokibi.md
site/src/content/threat-actors/rhysida.md
site/src/content/threat-actors/salt-typhoon.md
site/src/content/threat-actors/sandworm.md
site/src/content/threat-actors/scattered-spider.md
site/src/content/threat-actors/shinyhunters.md
site/src/content/threat-actors/storm-2372.md
site/src/content/threat-actors/ta505.md
site/src/content/threat-actors/teampcp.md
site/src/content/threat-actors/temp-veles-xenotime.md
site/src/content/threat-actors/transparent-tribe-apt36.md
site/src/content/threat-actors/turla.md
site/src/content/threat-actors/unc3886.md
site/src/content/threat-actors/unc6671-blackfile.md
site/src/content/threat-actors/unc6783.md
site/src/content/threat-actors/volt-typhoon.md
site/src/content/threat-actors/wizard-spider.md
```

### Q10. Which assumptions in v0.5 / v1.2 need casing/name reconciliation?

**Answer:**

1. v0.5 content fields must be translated to camelCase for the live public schema: `entity_kind` -> `entityKind`, `is_analytic_construct` -> `isAnalyticConstruct`, `operating_models` -> `operatingModels`, `external_ids` -> `externalIds`, `alias_records` -> `aliasRecords`, `attribution_claims` -> `attributionClaims`, `relationship_claims` -> `relationshipClaims`, `last_verified_at` -> `lastVerifiedAt`, `external_refs` -> `externalRefs`, `imported_source_confidence` -> `importedSourceConfidence`, `canonical_name_source` -> `canonicalNameSource`, `naming_rationale` -> `namingRationale`, and `review_status` -> `reviewStatus`.
2. The collection must remain `site/src/content/threat-actors/`; do not rename to `adversary`, `adversary-profiles`, or `entities` in PR2.
3. Live display fields `name`, `country`, `affiliation`, `motivation`, `targetSectors`, `targetGeographies`, `tools`, and `mitreMappings` must be preserved unless a later approved migration changes them.
4. `attributionConfidence` is a fully populated live legacy field and must not be hard-removed in PR2.
5. Live `sources[].reliability` must not be renamed to `source_rating`; v0.5's source-rating language maps to the live `reliability` field for current content.
6. v1.2 operational/task records are camelCase by design, but current public task acceptance uses snake_case keys such as `review_status` in `.github/pipeline/tasks/*.json` and `.github/pipeline/schema/task-schema.json`. Intake PR4 must reconcile with the task schema then, not in PR1.
7. `manualOverride`, `kevStatus`, and freshness/reverify fields are operational/task state, not content frontmatter.

### Q11. Does `threatpedia-working` contain a TP-APT registry, external anchor registry, STIX intrusion-set ID layer, or private data model absent from public main?

**Answer:** No active private TP-APT / external anchor / STIX intrusion-set / MISP / Malpedia registry data file was found. The private repo contains historical and design documents that discuss TP-APT and an `entities/manifest.json` concept, but no implemented active registry to preserve for PR2.

**Evidence:**

- Active private registry-like file search, excluding `.git` and `working/_archive`, found only `.worker-state/threatpedia-dispatcher/automation-registry.json`, which is an automation registry, not an entity-anchor registry.
- `working/decisions/0007-entity-id-format.md` says: "Threat Actors | (no numeric ID)" and "Threat-actor IDs remain slug-only per ADR 0002. No numeric ID for actors." It also states "Private repo: N/A - the private repo carries no entity IDs directly (no corpus here)."
- `working/specs/MANIFEST-SPEC.md` describes a future `entities/manifest.json` with `TP-APT-NNNN`, but this is a spec artifact and no corresponding active manifest file exists in private.
- `working/decisions/0005-pipeline-reset-and-spec-first.md` says historical PoC manifests such as `threat-actor-index.json` become reference material, not authoritative live data.
- Private inbox tasks for threat-actor population point workers at public `site/src/content.config.ts` and public `site/src/content/threat-actors/`, using the live camelCase schema.

### Q12. If public and private schemas differ, which is authoritative for PR2?

**Answer:** For PR2 public implementation, `site/src/content.config.ts` and the current public collection path are authoritative. Private docs are reconciliation input, not implementation authority, unless Kernel K explicitly ratifies a private model before PR2.

**Rationale:** The current public Astro build validates against `site/src/content.config.ts`; the public corpus lives at `site/src/content/threat-actors/`; private ADR 0007 says no numeric actor IDs and no private entity IDs; no active private registry exists. Therefore, if no private registry is supplied before PR2, `aptId` and `externalIds` are greenfield additive fields and must be warning-mode/compatibility-mode for legacy public records until PR3 dry-run and approved migration.

---

## 4. Comparison Against Claude/DangerMouse Public PR1 Reference

| Claude/DangerMouse public finding | Verified by Codex? | Public/private delta | Action before PR2 |
|---|---:|---|---|
| public threat-actors appear camelCase | Yes | Private active tasks also point at camelCase public `content.config.ts`; older private specs contain snake_case concepts. | Implement v0.5 concepts in camelCase unless a migration alias is approved. |
| lifecycle field appears `reviewStatus` | Yes | Private operational/task acceptance still uses snake_case `review_status`; content remains `reviewStatus`. | Keep content lifecycle as `reviewStatus`; PR4 must separately reconcile task schema. |
| lifecycle enum matches locked values | Yes | No conflicting active private lifecycle enum found. | Preserve values exactly. |
| sources use `reliability` R1-R4, not `source_rating` | Yes | Private DATA-STANDARDS/MANIFEST prose still says `source_rating`; live schema and tasks use `reliability`. | Map source-rating concept to live `reliability`; do not rename live sources in PR2. |
| `revisions[]` absent | Yes | Private editorial docs mention required revisions, not a live content frontmatter `revisions[]`. | Treat as net-new for PR2, with reviewer-not-author enforcement in separate downstream PR. |
| `attributionConfidence` present/populated | Yes | Private v1.0 prose says `attribution_confidence`; active public records use `attributionConfidence`. | Phase-1 warn + migrate; do not hard-remove. |
| externalIds / TP-APT anchor layer absent in public corpus | Yes | Private has future/historical TP-APT specs but no active registry file; ADR 0007 says threat actors are slug-only. | Treat `externalIds`/`aptId` as greenfield additive unless Kernel K supplies a registry before PR2. |
| all existing public records need migration or warning-mode compatibility | Yes | Private has no alternate migrated corpus. | PR2 must not hard-fail all legacy records. |

---

## 5. Canonical Decisions For PR2

### Field Casing

**Decision:** Use camelCase for public content fields.

**Implementation mapping required:** Translate v0.5 conceptual snake_case names to live camelCase names. Do not introduce parallel snake_case frontmatter in the public content schema unless explicitly approved as a migration alias.

### Collection / Path Naming

**Decision:** Keep `site/src/content/threat-actors/` and the Astro collection name `'threat-actors'`.

**No re-slug / no rename impact:** Do not rename the collection to `entities`, `adversaries`, or `adversary-profiles` in PR2. Public labels may say "Threat Actors" / "Adversary Profiles"; paths stay stable.

### Lifecycle Field / Values

**Decision:** Use `reviewStatus` with:

```text
draft_ai | draft_human | under_review | certified | disputed | deprecated
```

### Source Schema

**Decision:** Preserve current `sourceSchema` and field names. Use `sources[].reliability` (`R1`-`R4`) as the live source reliability field. Do not rename it to `source_rating`.

### Legacy Attribution Confidence

**Decision:** `attributionConfidence` is the live legacy A1-A6 field. PR2 must support Phase-1 warning + migration mapping; it must not hard-remove or confuse this field with claim-level A-F confidence.

### TP-APT / External Anchor Registry

**Decision:** No active private registry exists in the audited private checkout. Default applies: `aptId` and `externalIds` are greenfield additive fields and must not be mandatory blockers for current public records in PR2.

### Required-Field Enforcement Mode For Existing Records

**Decision:** Warning-mode until migration.

**Rationale:** 63/63 public threat-actor records lack the v0.5 target fields. Hard-failing `entityKind`, `isAnalyticConstruct`, `aptId`, `externalIds`, `aliasRecords`, `attributionClaims`, `relationshipClaims`, or `revisions[]` immediately would block the current corpus. PR2 can enforce target shape in dedicated tests/new target fixtures but should not hard-fail legacy records before PR3 dry-run and approved migration.

### Anchor Backfill Ownership

**Decision:** Separate EP-orchestrated enrichment track unless Kernel K supplies a registry before PR2.

**Rationale:** Anchor backfill requires sourced factual research. It is not a mechanical casing migration and should not be invented by a blind script.

---

## 6. Migration Impact Summary

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
```

Review status distribution:

```text
draft_ai:     31
under_review: 31
certified:     1
```

---

## 7. Files That Would Fail v0.5 As Written

All 63 public threat-actor files would fail as written. See Q9 for full file list.

Reason categories:

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

## 8. Required Reconciliation Patches Before PR2

1. Approve the camelCase implementation map for v0.5 content fields.
2. Confirm that `site/src/content/threat-actors/` remains the public collection/path for PR2.
3. Resolve the private spec conflict: DATA-STANDARDS/MANIFEST prose says `TP-APT-NNNN`, but private ADR 0007 and public live schema currently use slug-only threat actors.
4. Confirm `aptId` / `externalIds` are greenfield additive fields unless a private registry is supplied before PR2.
5. Approve warning-mode compatibility for all existing legacy threat-actor records until PR3 migration dry-run and explicit rewrite approval.
6. Confirm source schema mapping: v0.5 `source_rating` language maps to live `sources[].reliability`; no PR2 source-field rename.
7. Confirm `attributionConfidence` Phase-1 warning + migration disposition and ensure claim-level A-F confidence remains separate.
8. Decide anchor backfill ownership. Default recommendation: separate EP enrichment track.
9. For PR4 later, reconcile intake/task casing against `.github/pipeline/schema/task-schema.json`, where current task acceptance uses snake_case such as `review_status` while the v1.2 intake spec uses camelCase operational fields.

---

## 9. Blockers / Unknowns

- PR2 must not start until Kernel K reconciles the decisions in section 8.
- No active private TP-APT/external anchor registry was found; if one exists outside the audited checkout, it must be supplied before PR2 changes the field enforcement plan.
- Private repo was dirty before this audit; findings are read-only and should be treated as a point-in-time inspection of `74fb3bdf604a314349f4cdef4f4ad50e9a2873dc` plus uncommitted local state. No private writes were made.

---

## 10. PR Completion Report

```text
Branch:
  codex/schema-intake-pr1-audit-20260618

Head SHA:
  Filled after commit/push.

PR URL:
  Filled after PR creation.

Checks run:
  git status --short
  rg --files / targeted rg inspections
  ruby YAML frontmatter count over site/src/content/threat-actors/*.{md,mdx}
  private read-only file and content searches

Reviewers requested/tagged:
  To be requested/tagged on PR: @MahdiHedhli, @dangermouse-bot, @ernestpenfold-bot

Exact blockers:
  PR2 not started. Await Kernel K reconciliation/signoff for casing, collection path, TP-APT/external anchor registry status,
  enforcement mode, source field mapping, attributionConfidence disposition, and anchor backfill ownership.
```

---

## 11. Stop Statement

PR2 not started.
