# ADR 0007 - Entity ID Format Convention

**Date:** 2026-06-18
**Status:** Accepted
**Deciders:** Kernel K
**Supersedes:** Actor-identity portions of `MANIFEST-SPEC.md` and
`DATA-STANDARDS-v1.0.md` that require threat actor content records to use
`entity_id: TP-APT-NNNN` / `apt_id: TP-APT-NNNN` as their primary identity.
**Related:** `docs/schema-intake-pr1-reconciliation-20260618.md`,
`docs/DATA-STANDARDS-v1.0.md`, `site/src/content.config.ts`

---

## Context

Threatpedia's live public site is an Astro static site. Threat actor records
are content files in:

```text
site/src/content/threat-actors/**
```

The active public corpus is slug-addressed through that collection path. Public
threat actor records do not currently carry required `TP-APT-*` identifiers,
`apt_id` values, or populated external anchor registries. The PR1 and PR1B
schema/intake audits confirmed that the live content shape uses camelCase
frontmatter, `reviewStatus` lifecycle values, `sources[].reliability` R1-R4,
and legacy `attributionConfidence`.

Older manifest and data-standard prose described APT/threat-actor entities as
using mandatory `TP-APT-NNNN` identifiers and mandatory `nation_state` /
`attribution_confidence` fields. That prose no longer matches the live Astro
content model or the additive adversary-profile v0.5 compatibility layer.

## Decision

Threat actor content records remain slug-addressed site records under
`site/src/content/threat-actors/**`.

Numeric `TP-APT-*` identifiers and the camelCase `aptId` field, if introduced
or populated later, are compatibility/export identifiers only. They are not the
primary content identity, are optional for legacy records, and must be
introduced only through an approved migration or enrichment plan. Agents must
not mint `TP-APT-*` identifiers silently while drafting, validating, migrating,
or rewriting threat actor content.

Structured attribution moves toward sourced `attributionClaims[]` in the
adversary-profile v0.5 model. Existing `attributionConfidence` remains an
accepted legacy/display field during the phased deprecation period and must not
be hard-removed until migration coverage gates are satisfied.

Threat actor content records must not be made to hard-fail solely because they
lack `aptId`, `TP-APT-*`, `nation_state`, or snake_case
`attribution_confidence` fields.

## Supersession / Manifest Alignment

This ADR supersedes the actor-identity portions of `MANIFEST-SPEC.md` and
`DATA-STANDARDS-v1.0.md` that require APT/threat-actor entities to use
`entity_id: TP-APT-NNNN` or `apt_id: TP-APT-NNNN` and that require
`nation_state` / `attribution_confidence` as mandatory actor fields.

Threat actor content in the live Astro collection remains slug-addressed under
`site/src/content/threat-actors/**`. Numeric `TP-APT-*` / `aptId` identifiers,
if introduced later, are compatibility/export identifiers only. They are
additive, optional for legacy records, and must be introduced only through an
approved migration or enrichment plan.

Structured attribution moves toward sourced `attributionClaims[]`. Legacy
`attributionConfidence` remains accepted during the phased deprecation period
and must not be hard-removed until migration coverage gates are satisfied.

## Consequences

- PR3 migration/rewrite work must preserve slug-addressed actor identity unless
  Kernel K approves a separate actor-ID migration plan.
- Schema and validator work may support optional `aptId` / `externalIds`
  fields, but existing legacy records stay warning-compatible when those fields
  are absent.
- Export layers may map actors to STIX intrusion-set, MITRE ATT&CK group, MISP
  Galaxy, Malpedia, ETDA, or vendor identifiers through external anchors, but
  those anchors do not replace the content slug.
- Historical standards that describe mandatory `apt_id`, `nation_state`, or
  snake_case `attribution_confidence` for actor content should be read as
  superseded for the live Astro threat-actor collection.
