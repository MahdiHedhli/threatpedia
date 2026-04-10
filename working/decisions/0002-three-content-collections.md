# 0002 — Three Independent Content Collections (Not a Discriminated Union)

**Date:** 2026-04-10
**Status:** Accepted
**Deciders:** Penfold-Bot (proposed), DangerMouse-Bot (implemented), Kernel K (approved)
**Supersedes:** None

---

## Context

v1.0 of the Threatpedia Data Standards introduces three article types: `incident`, `campaign`, and `entity_profile`. Each has substantially different fields:

- `incident`: bounded event with `event_id`, `impact_severity`, `attack_chain`, financial impact, etc.
- `campaign`: ongoing pattern with `campaign_id`, `tradecraft_summary`, `first_observed`, no impact metrics
- `entity_profile`: standalone reference with `entity_subtype` (apt | malware | zero_day) and subtype-specific fields like `nation_state`, `malware_type`, `cvss_score`, `affected_products`

Penfold-Bot, reviewing the v1.0 schema for Astro implementation, raised the question: should these live in a single content collection with a discriminated union on `article_type`, or in three separate collections?

## Decision

Three independent Astro content collections:

```
src/content/
├── incidents/    → incidentSchema    → /incidents/{event_id}
├── campaigns/    → campaignSchema    → /campaigns/{campaign_id}
└── entities/     → entityProfileSchema → /actors/{apt_id}, /malware/{malware_id}, /zero-days/{zero_day_id}
```

Each collection is defined independently in `src/content/config.ts` and uses its own Zod schema. There is no top-level discriminated union across the three.

## Rationale

**Why three collections instead of one:**

1. **TypeScript clarity.** A discriminated union of three significantly different schemas produces a TypeScript type where every field access requires type narrowing. `entry.data.event_id` would only resolve if you'd already narrowed to incident — every component would be peppered with `if (entry.data.article_type === 'incident')` guards.

2. **Routing cleanliness.** Astro's file-based routing maps collections to URL prefixes naturally. Three collections give us three clean route groups with no runtime type-narrowing in the route handlers.

3. **Schema evolution independence.** When v1.1 adds a new field that only applies to incidents, we modify `incidentSchema` without touching the campaign or entity schemas. With a discriminated union, every change requires touching the unified schema.

4. **Validation error specificity.** When Zod fails validation on a campaign that's missing `tradecraft_summary`, the error message is "campaign missing tradecraft_summary." With a discriminated union it would be "discriminated union variant 'campaign' missing tradecraft_summary at path data.tradecraft_summary" — more nesting, less clarity.

5. **The entity_profile collection still uses a discriminated union internally** on `entity_subtype` (apt | malware | zero_day) because those subtypes share enough fields that splitting them across three collections would be overkill. This is the one place a discriminated union makes sense — within entities, where the subtypes are variations on a theme rather than fundamentally different things.

## Consequences

**Positive:**
- Cleaner TypeScript types for components
- Independent schema evolution per article type
- Better Zod validation error messages
- Cleaner routing structure

**Negative / Tradeoffs:**
- Cross-type queries (e.g., "show me all things that reference APT-0001 — incidents, campaigns, and entity profiles") require joining three collections rather than filtering one. This is a real cost for Phase 3+ Intelligence Layer work.
- Schemas have some unavoidable duplication (`disclosure_credit`, `mitre_techniques`, `sources` are repeated across three files). Mitigated by importing shared schemas from `src/schemas/shared.ts`.

**Risks:**
- If we ever want to query across all article types, we need a denormalized index or a Supabase view. We're betting that this query pattern is rare enough that the duplication cost is worth the type safety.

## Alternatives Considered

- **Option A: Single collection with discriminated union on `article_type`.** Rejected for the TypeScript clarity reasons above.
- **Option B: Single collection with all fields optional.** Rejected because it would lose all schema enforcement — incidents could be saved without `event_id`, etc.
- **Option C: Five collections (incidents, campaigns, apts, malware, zero-days).** Rejected because the three subtypes of entity_profile share enough structure that the duplication cost outweighs the type safety benefit. The internal discriminated union is the right granularity.

---

**Implementation:** The four schema files are at `working/scratchpad/schemas/` (drafted) and will be moved to `src/schemas/` when the Astro project is bootstrapped. See:
- `src/schemas/shared.ts` — regex IDs, enums, shared object schemas
- `src/schemas/incidents.ts` — incidentSchema
- `src/schemas/campaigns.ts` — campaignSchema
- `src/schemas/entities.ts` — entityProfileSchema (discriminated union internally)

Per `docs/DATA-STANDARDS-v1.0.md` §2.
