# 0001 — Roll up v1.0.1 Patch Directly into v1.0

**Date:** 2026-04-10
**Status:** Accepted
**Deciders:** Kernel K (executive), DangerMouse-Bot (drafter), Penfold-Bot (originator of the catches)
**Supersedes:** None

---

## Context

On 2026-04-09, DangerMouse-Bot completed an overnight normalization sweep applying v1.0 of the Threatpedia Data Standards to the legacy article corpus. Concurrently, Penfold-Bot (acting as Lead Architect) reviewed the v1.0 schema and surfaced 7 architectural catches that would either break during Astro implementation or cause data quality gaps in production.

The catches were:

1. The v1.0 SIGHTINGS table uses SQL CTEs that Astro cannot run natively at build time — requires hybrid MDX + Supabase architecture
2. Three article types (incident, campaign, entity_profile) should live in three separate Astro content collections, not a single discriminated union
3. Zod ID validation should use regex patterns, not plain `z.string()`
4. Confidence score should be computed at render time, never stored in frontmatter
5. JSON-LD `creativeWorkStatus` must use schema.org vocabulary (Draft, Published, Obsolete), not Threatpedia internal status (draft_ai, certified, etc.)
6. The sector and country taxonomies need `Unknown / Undisclosed` and `ZZ` values for early-stage threat ingestion
7. RULE-018 (sighting correction cycle detection) cannot be enforced by Zod and requires a pre-build graph script

DangerMouse drafted these as `DATA-STANDARDS-v1.0.1-PATCH.md`, an additive patch document supplementing the locked v1.0. The intent was to preserve a clean version history.

When Kernel K reviewed the patch on the morning of 2026-04-10, he noted that v1.0 had not yet entered production — it was the operating reference for the freeze-and-sweep but had not been deployed anywhere. Maintaining a patch document for a version that never shipped creates unnecessary version proliferation.

## Decision

Roll up the seven catches in the v1.0.1 patch directly into `docs/DATA-STANDARDS-v1.0.md`. Eliminate `DATA-STANDARDS-v1.0.1-PATCH.md` as a standalone document. The merged v1.0 becomes the locked operating schema.

The audit trail is preserved through:
1. A "Drafting note" callout in the v1.0 document explicitly listing the seven catches and the rollup decision
2. This ADR
3. The DangerMouse and Penfold agent logs for 2026-04-09 and 2026-04-10
4. The git history of the v1.0 doc itself

## Rationale

**Why this is acceptable:**

- v1.0 was never published or deployed. There are no downstream consumers who would experience a breaking change from amending it.
- The freeze is still active. No articles have been ingested under the v1.0 schema in production.
- A separate patch document creates two sources of truth — the schema and the patch — which is cognitive overhead and a potential conflict surface.
- Penfold's catches are universally additive or clarifying. None of them break v0.1 → v1.0 migration paths.

**Why we don't normally do this:**

- Once a schema is published and consumed by external users, amending it without a version bump breaks the implicit contract that "v1.0" means the same thing to everyone. We are doing this only because v1.0 was a draft-locked-for-internal-use, not a published artifact.

## Consequences

**Positive:**
- Single source of truth for the schema
- Cleaner reading experience for new collaborators (one doc, not two)
- The 7 catches are visible in their natural section context, not in a separate "what changed" doc

**Negative / Tradeoffs:**
- We lose the explicit changelog narrative that the patch document provided
- Anyone who downloaded the v1.0 draft between 2026-04-08 and 2026-04-10 will find it doesn't match the current v1.0
- Sets a precedent that "if it hasn't shipped, we can amend in place" — must be careful not to over-apply this

**Risks:**
- If Penfold's catches were not actually correct, we now have them embedded in v1.0 with no easy rollback. Mitigation: they were reviewed by DangerMouse during integration and are demonstrably correct based on the live Astro implementation.

## Alternatives Considered

- **Option A: Keep v1.0.1 patch as a separate doc, treat it as authoritative.** Rejected because it requires every reader to read both docs and mentally merge them.
- **Option B: Bump to v1.1 instead of patching v1.0.** Rejected because v1.0 hasn't shipped, so a v1.1 bump would imply v1.0 was a real version that existed and got superseded, which is misleading.
- **Option C: Wait until Founding Board is seated and let them ratify v1.1 with everything together.** Rejected because the freeze cannot wait for the board, and the normalization sweep needs a stable schema reference now.

---

**Implementation:** Completed 2026-04-10 morning by DangerMouse-Bot. The merged v1.0 document is at `docs/DATA-STANDARDS-v1.0.md` (868 lines, up from 731). The v1.0.1 patch document is no longer maintained.
