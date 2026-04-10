# Threatpedia Data Standards

**Version:** 1.0
**Status:** Locked — Pre-Migration Reference
**Date:** April 2026
**Supersedes:** v0.1 (March 2026)

---

## Status of This Document

Version 1.0 is the **operating schema** for the freeze-and-sweep normalization pass and the Astro migration that follows. It is locked. Schema changes require an explicit version bump (1.1, 1.2, 2.0). Articles produced or normalized after this date must conform to v1.0 to be eligible for ingestion into the Threatpedia corpus.

When the Founding Board is seated, v1.0 becomes the working draft they review. Their first act is to publish v1.1 with any changes they require. The empty-board period ratifies via Colonel K (project lead), DangerMouse (Claude), and Penfold (Gemini).

---

## What Changed From v0.1

This version closes the gaps surfaced by the April 2026 corpus audit (37 articles, 32 manifest entries, 5 orphans, 17 review-status mismatches, 77 unique H2 section titles, 5 articles with zero sources, **0 articles with schema-compliant Admiralty attribution confidence**, 11KB inline CSS per article).

### Structural changes

1. **Threat actor field split.** `threat_actor_ids` (adversaries only) is now distinct from `disclosure_credit` (researchers, vendors, journalists who surfaced the incident). The previous schema let the BlueHammer article list "Chaotic Eclipse" — a researcher — as the threat actor. This is now structurally impossible.
2. **Temporal model rewritten.** `last_observed` is no longer a writable field on any entity. Sightings are tracked in an append-only `sightings` table; `last_observed` and `active_status` are derived views. A `correction_of_sighting_id` column supports auditable corrections without mutation.
3. **Article type taxonomy.** Three article types are now distinguished: `incident` (named, bounded event), `campaign` (technique- or actor-centric, ongoing pattern), and `entity_profile` (standalone APT, malware, or zero-day). The Qilin EDR-killer drift was caused by the absence of this distinction.
4. **Confidence score added.** Numeric 0–100, computed from deterministic signals only, displayed as an A–F letter grade in public UI. Hidden in v1.0 launch; public in v1.1 with a beta tag.
5. **Section vocabulary locked.** A controlled list of 11 H2 section titles. The audit found 77 unique H2 titles across 37 articles — that drift dies in v1.0.
6. **Header field count locked at 7.** All other metadata moves to sidebar modules or body sections.
7. **Sidebar module controlled vocabulary.** No more ad-hoc "Quick Facts" / "Vulnerability Details" / "Severity & Metrics" labels. 12 named modules, render-if-data-exists.
8. **CSS extracted to external stylesheet.** No more 11KB of inline CSS per article. Single shared `assets/css/incident-report.css` loaded by every article.

### Field changes

9. **`generated_by` is now an enum** with 6 values (was free text — audit found 6 variants of which 2 were the same with naming drift).
10. **`disclosure_credit` field added** (Array of structured discoverer objects).
11. **`article_type` field added** (Enum: `incident | campaign | entity_profile`).
12. **`confidence_score` field added** (Integer 0–100, computed, read-only).
13. **`confidence_grade` derived field** (Enum: A | B | C | D | F).
14. **`og_image_url` field added** (String, status-versioned path).
15. **`json_ld` block required** in HTML head for all articles.
16. **`severity` field locked** to integer 1–5 (audit found 5+ format variants including one article jamming CVSS into severity).

### Rule additions

17. **RULE-013** — `last_observed`, `current`, `ongoing_status` are not writable on APT/Malware/CVE entities.
18. **RULE-014** — Sightings table is append-only; corrections via correction rows.
19. **RULE-015** — Incidents with `status = ongoing` and `date_start` > 180 days ago are flagged for review (configurable threshold; tightens to 90 days post-launch).
20. **RULE-016** — `first_observed` updates require ≥2 corroborating sources.
21. **RULE-017** — Sighting corrections must reference a sighting with the same `entity_id`.
22. **RULE-018** — Sighting correction chains may not be circular.
23. **RULE-019** — `threat_actor_ids` may only reference APT registry entries; never researchers, vendors, or journalists.
24. **RULE-020** — Date formats within a single article must be consistent and ISO 8601 (`YYYY-MM-DD`, `YYYY-MM`, or `YYYY`).
25. **RULE-021** — `article_type` is required and immutable after first save.
26. **RULE-022** — H2 section titles must come from the controlled vocabulary in §6.
27. **RULE-023** — JSON-LD structured data block is required in the page `<head>`.
28. **RULE-024** — `og_image_url` must change when `review_status` transitions from draft to certified.
29. **RULE-025** — Every article must include the required script and style includes per the canonical template.
30. **RULE-026** — `severity` field must be an integer 1–5; CVSS lives in its own field.

---

## 1. Entity Types & Relationships

Threatpedia has six core entity types (was five — `sighting` is now a first-class entity):

```
INCIDENT      ──< USES >─────────────── MALWARE
INCIDENT      ──< ATTRIBUTED_TO >────── APT
INCIDENT      ──< DISCLOSED_BY >─────── DISCLOSURE_CREDIT
INCIDENT      ──< EXPLOITS >─────────── CVE
INCIDENT      ──< MAPS_TO >──────────── TTP (MITRE ATT&CK)
INCIDENT      ──< RELATED_TO >───────── INCIDENT
APT           ──< USES >─────────────── MALWARE
APT           ──< AFFILIATED_WITH >──── NATION_STATE
SIGHTING      ──< OBSERVES >─────────── APT | MALWARE | CVE
SIGHTING      ──< OCCURRED_DURING >──── INCIDENT (optional)
SIGHTING      ──< CORRECTS >─────────── SIGHTING (optional, self-referential)
```

`DISCLOSURE_CREDIT` is a new entity. It records the researchers, vendors, journalists, and government agencies that surfaced an incident. It is structurally separate from `APT` so adversaries and disclosers can never be conflated.

`SIGHTING` is now first-class. Every entity's "is this still active?" answer is computed from the sightings table, never stored.

---

## 2. Article Types

Every article belongs to exactly one type. The type determines which sections are required and which sidebar modules render.

| Type | Description | Examples |
|---|---|---|
| `incident` | Named event with a bounded timeline | FrostArmada, BlueHammer, Die Linke ransomware |
| `campaign` | Technique- or actor-centric pattern, ongoing or recurring | Qilin EDR-killing tradecraft, Lazarus crypto operations |
| `entity_profile` | Standalone profile of an APT, malware family, or zero-day | ShinyHunters profile, RansomHouse operations |

**Rule (RULE-021):** `article_type` is set at creation and is immutable. Reclassification requires creating a new article and deprecating the old one with a redirect.

The Qilin EDR-killer article in the current corpus is a `campaign` type that was misfiled as an `incident`. The ShinyHunters article is an `entity_profile` that was misfiled as an `incident`. Both get reclassified or removed during normalization.

---

## 3. Controlled Vocabularies

### 3.1 Incident Classification

Two-tier, both required.

| Tier 1 | Tier 2 |
|---|---|
| Data Breach | Exfiltration · Exposure · Insider |
| Ransomware | Encryption-only · Double Extortion · Triple Extortion |
| Espionage | Nation-State · Corporate · Political |
| Sabotage | Destructive Malware · Physical-Cyber · ICS/OT |
| Supply Chain | Software · Hardware · Managed Service Provider |
| DDoS | Volumetric · Protocol · Application Layer |
| Financial | BEC · Fraud · Crypto Theft · SWIFT |
| Disinformation | Influence Op · Deepfake · Account Takeover |
| Vulnerability | Zero-Day Exploit · N-Day Exploit · Misconfiguration |
| Access Brokerage | Initial Access Sold · Credential Theft |
| Wiper | Destructive · Pseudo-Ransomware · Geopolitical |
| DeFi Exploit | Oracle Manipulation · Reentrancy · Bridge Compromise · Social Engineering |

**v1.0 additions:** Wiper and DeFi Exploit categories were added based on Stryker/Handala and Drift Protocol incidents in the current corpus that didn't fit existing categories.

### 3.2 Attribution Confidence — Admiralty Scale

| Code | Label | Meaning |
|---|---|---|
| A1 | Confirmed | Official government attribution or perpetrator admission |
| A2 | High | Multiple independent vendors agree, strong technical evidence |
| A3 | Medium | Credible single-vendor attribution with supporting indicators |
| A4 | Low | Circumstantial evidence, TTPs loosely consistent |
| A5 | Disputed | Active disagreement between credible sources |
| A6 | Unknown | Insufficient evidence to attribute |

**Critical gap from audit:** 0 of 37 articles in the current corpus have schema-compliant Admiralty confidence. Several express it informally ("HIGH (80-85%)", "attributed with high confidence"). Every article requires this retrofit during normalization.

### 3.3 Impact Severity (RULE-026)

| Level | Label | Criteria |
|---|---|---|
| 5 | Critical | National infrastructure, >$1B impact, or mass casualty potential |
| 4 | High | Major sector disruption, $100M–$1B impact, or 10M+ records |
| 3 | Significant | Notable disruption, $10M–$100M impact, or 1M–10M records |
| 2 | Moderate | Limited disruption, $1M–$10M impact, or <1M records |
| 1 | Low | Contained, minimal financial or operational impact |

**Audit found:** 8 articles use `CRITICAL`, 7 use `HIGH`, 1 mixed case (`High`), 1 jams CVSS into severity (`CRITICAL (CVSS 9.4)`), and 15 articles have no severity field at all. RULE-026 locks this to integer 1–5; the label is for display only. CVSS lives in `cvss_score`, never in `severity`.

### 3.4 Review Status

| Value | Display | Usage |
|---|---|---|
| `draft_ai` | "AI-Drafted · Awaiting Certification" | Auto-generated, no human review |
| `draft_human` | "Human Draft · Awaiting Review" | Human-authored, peer review pending |
| `under_review` | "Under Peer Review" | Active review in progress |
| `certified` | "Threatpedia Certified · Reviewed by [Name]" | Approved for production |
| `disputed` | "Disputed · Under Re-review" | Post-certification challenge raised |
| `deprecated` | "Deprecated · See [redirect]" | Replaced by another article |

The previous `pending` / `approved` / `null` ad-hoc set is replaced. Migration: `pending` → `draft_ai`, `approved` → `certified` (with caveat — see audit).

### 3.5 Article Status (entity-level, separate from review status)

| Value | Description |
|---|---|
| `ongoing` | Threat actor or campaign active; new sightings expected |
| `disrupted` | Disrupted by takedown, patches, or actor disbandment |
| `concluded` | Activity has ceased; historical record only |
| `evolving` | New developments after initial documentation |
| `unknown` | Insufficient information to determine status |

### 3.6 Generated-By Field (Enum, replaces free text)

| Value | Meaning |
|---|---|
| `manual_human` | Written by a human author end-to-end |
| `manual_research` | Written by a human after independent research |
| `ai_ingestion` | Generated by the standard ingestion pipeline |
| `ai_zeroday` | Generated by the zero-day-specific pipeline |
| `ai_gapfill` | Generated to fill an identified corpus gap |
| `ai_crosslink` | Generated to support relational completeness |

Migration: `new-threat-intel-automation` and `new-threat-intel` both → `ai_ingestion`. `incident-crosslink-gapfill` → `ai_crosslink`. `manual-zero-day-ingestion` → `ai_zeroday`. `manual-intel-extraction` → `manual_research`. `null` → must be assigned during normalization.

### 3.7 Sector Taxonomy

```
Energy & Utilities
Financial Services
Government — Federal
Government — State/Local
Government — Military/Defense
Healthcare & Life Sciences
Critical Infrastructure
Technology
Telecommunications
Transportation & Logistics
Education & Research
Media & Entertainment
Retail & Consumer
Manufacturing & Industrial
Legal & Professional Services
Non-Profit & NGO
AI & ML Infrastructure        ← v1.0 addition
Cryptocurrency & DeFi          ← v1.0 addition
```

### 3.8 Initial Access Vector

Aligned to ATT&CK Initial Access tactic (TA0001).

---

## 4. Incident Record — Field Specification

### 4.1 Required Fields

| Field | Type | Format | Validation |
|---|---|---|---|
| `event_id` | String | `TP-YYYY-NNNN` | Auto-assigned, immutable, RULE-001 |
| `article_type` | Enum | `incident` for this entity | Immutable, RULE-021 |
| `common_name` | String | Title case, max 80 chars | Required, unique |
| `aliases` | Array[String] | Free text | Optional |
| `classification_l1` | Enum | §3.1 | Required |
| `classification_l2` | Enum | Child of L1 | Required |
| `date_start` | Date | ISO 8601 | Required; `YYYY-MM` or `YYYY` if exact unknown |
| `date_discovered` | Date | ISO 8601 | Optional |
| `date_disclosed` | Date | ISO 8601 | Optional |
| `date_end` | Date | ISO 8601 | Optional; null if `status = ongoing` |
| `threat_actor_ids` | Array[APT_ID] | FK to APT registry | Optional, RULE-019 |
| `disclosure_credit` | Array[Object] | See §4.3 | Required, min 1 |
| `attribution_confidence` | Enum | Admiralty A1–A6 | Required |
| `attribution_rationale` | String | Max 500 chars | Required if A1–A4 |
| `target_sectors` | Array[Enum] | §3.7 | Required, min 1 |
| `target_countries` | Array[String] | ISO 3166-1 α-2 | Required, min 1 |
| `target_named_orgs` | Array[String] | Free text | Optional, only if publicly disclosed |
| `impact_severity` | Integer | 1–5, RULE-026 | Required |
| `cvss_score` | Decimal | 0.0–10.0 | Optional, never in severity field |
| `impact_records_exposed` | Integer | Count | Optional |
| `impact_financial_usd` | Integer | USD | Optional |
| `impact_description` | String | Max 1000 chars | Required |
| `initial_access_vector` | Enum | ATT&CK-aligned | Required |
| `cves_exploited` | Array[String] | `CVE-YYYY-NNNNN` | Optional |
| `malware_ids` | Array[Malware_ID] | FK | Optional |
| `mitre_techniques` | Array[Object] | See §4.4 | Required, min 1 |
| `status` | Enum | §3.5 | Required |
| `review_status` | Enum | §3.4 | Required |
| `confidence_score` | Integer | 0–100 | Computed, read-only |
| `confidence_grade` | Enum | A–F | Derived from score |
| `generated_by` | Enum | §3.6 | Required |
| `sources` | Array[Object] | §4.5 | Required, min 3, RULE-004 |
| `og_image_url` | String | Versioned path | Required, RULE-024 |
| `version` | Integer | Auto-increment | Auto-assigned |

### 4.2 Removed Fields

- **`threat_actor` (free text)** — replaced by `threat_actor_ids` (FK array) and `disclosure_credit` (separate field). The audit found one approved article (BlueHammer) using this field to store a researcher's name.

### 4.3 Disclosure Credit Schema

```json
{
  "credit_id": "DC-0001",
  "name": "Lumen Black Lotus Labs",
  "type": "vendor",
  "individual_name": "Danny Adamitis",
  "url": "https://www.lumen.com/blog-and-news/...",
  "credit_role": "discoverer"
}
```

**`type` enum:** `vendor` | `researcher_independent` | `government_agency` | `academic` | `journalist` | `victim_org`

**`credit_role` enum:** `discoverer` | `co_discoverer` | `disclosure_coordinator` | `incident_response` | `attribution_source` | `takedown_partner`

This is the field that would have caught the BlueHammer Chaotic Eclipse error: a researcher belongs in `disclosure_credit` with `type: researcher_independent` and `credit_role: discoverer`, never in `threat_actor_ids`.

### 4.4 MITRE ATT&CK Technique Mapping Schema

```json
{
  "technique_id": "T1190",
  "technique_name": "Exploit Public-Facing Application",
  "tactic": "Initial Access",
  "attack_version": "v15.1",
  "confidence": "confirmed",
  "evidence": "CVE-2023-50224 exploited per DOJ press release"
}
```

**`confidence` enum:** `confirmed` | `probable` | `possible`. Required.

**Required:** `technique_id`, `attack_version`, `confidence`, `evidence`. Speculative mappings without evidence are rejected (RULE-009, RULE-012).

### 4.5 Source Schema

```json
{
  "source_id": "SRC-0001",
  "url": "https://example.com/article",
  "title": "Article title",
  "publisher": "Publisher Name",
  "publisher_type": "media",
  "author": "Author Name",
  "publication_date": "2026-04-07",
  "archived_url": "https://web.archive.org/web/20260407000000/https://example.com/article",
  "archive_status": "archived_wayback",
  "access_date": "2026-04-08"
}
```

**`publisher_type` enum:** `government` | `media` | `vendor` | `academic` | `independent_researcher` | `victim_organization` | `social_media` | `other`

**`archive_status` enum:** `archived_wayback` | `archived_archivetoday` | `text_excerpt_only` | `unarchivable` | `pending`

**RULE-004:** Minimum 3 sources for any article.
**RULE-005:** At least 1 source must have `publisher_type` of `government` or `media`.
**RULE-011:** `archived_url` is required for all sources at certification (not at draft submission).

---

## 5. APT Registry — Field Specification

### 5.1 Required Fields

| Field | Type | Notes |
|---|---|---|
| `apt_id` | String | Format: `TP-APT-NNNN` (was `TP-TA-NNNN` in some places — standardize on `TP-APT-NNNN`) |
| `article_type` | Enum | Always `entity_profile` |
| `canonical_name` | String | Title case, Threatpedia primary name |
| `naming_rationale` | String | Why this name was chosen |
| `vendor_names` | Object | CrowdStrike, Mandiant, Microsoft, Recorded Future |
| `aliases` | Array[String] | All known alternate names |
| `nation_state` | String | ISO 3166-1 α-2, suspected/confirmed sponsor |
| `sub_org_affiliation` | String | e.g., "GRU Unit 74455", "MSS" |
| `attribution_confidence` | Enum | Admiralty A1–A6 |
| `active_since` | Integer | Year, immutable after set (RULE-016) |
| `primary_motivation` | Enum | Espionage / Financial / Sabotage / Hacktivism / Multi |
| `secondary_motivation` | Enum | Same options, optional |
| `known_campaigns` | Array[TP_ID] | FK to incidents, min 1 for certification |
| `known_sectors_targeted` | Array[Enum] | Sector taxonomy, min 1 |
| `diamond_model` | Object | Adversary / Infrastructure / Capability / Victim |
| `known_malware_families` | Array[Malware_ID] | FK, optional |
| `confidence_score` | Integer | 0–100, computed |
| `confidence_grade` | Enum | A–F, derived |

### 5.2 Removed Fields (Now Computed)

| Field | Replacement |
|---|---|
| `last_observed` | Computed view from sightings (§5.3) |
| `active_status` | Computed view from sightings (§5.3) |

### 5.3 Computed Fields (Read-Only Views)

```sql
last_observed = MAX(observed_date)
  FROM sightings
  WHERE entity_id = apt_id
    AND correction_of_sighting_id IS NULL
    AND sighting_id NOT IN (
      SELECT correction_of_sighting_id
      FROM sightings
      WHERE correction_of_sighting_id IS NOT NULL
    )

active_status = CASE
  WHEN last_observed >= NOW() - INTERVAL '12 months' THEN 'active'
  WHEN last_observed >= NOW() - INTERVAL '36 months' THEN 'dormant'
  WHEN last_observed <  NOW() - INTERVAL '36 months' THEN 'historical'
  WHEN explicit_disbanded_flag = TRUE THEN 'disbanded'
  ELSE 'unknown'
END
```

### 5.4 Vendor Names Schema

```json
{
  "crowdstrike": "Fancy Bear",
  "mandiant": "APT28",
  "microsoft": "Forest Blizzard",
  "recorded_future": "TAG-0700",
  "sentinelone": "",
  "secureworks": "IRON TWILIGHT"
}
```

---

## 6. Section Vocabulary (Controlled List of H2 Titles)

The audit found 77 unique H2 titles across 37 articles. The corpus had 14 different ways of saying "Timeline" and 7 different ways of saying "Sources". v1.0 locks the section vocabulary to these 11 titles. All articles must use these exact strings.

| H2 Title | Required For | Notes |
|---|---|---|
| `Executive Summary` | All article types | First section, always |
| `Technical Analysis` | All article types | |
| `Attack Chain` | `incident`, `campaign` | Was inconsistent — only 8/37 articles had it; v1.0 makes it required for incidents and campaigns |
| `MITRE ATT&CK Mapping` | All article types | Was missing in 20/37 articles; v1.0 makes it required |
| `Impact Assessment` | `incident` | |
| `Timeline` | `incident`, `campaign` | Replaces "Attack Timeline", "Incident Timeline", "Campaign Timeline" |
| `Remediation & Mitigation` | `incident`, `campaign` | Replaces "Remediation & Lessons Learned", "Mitigations & Recommendations", "Detection & Remediation" |
| `Indicators of Compromise` | Optional | Render only if non-ephemeral IOCs available |
| `Discrepancies Across Disclosures` | Optional | Render only when multi-source conflict exists |
| `Historical Context` | Optional | Render only when precedent pattern relevant |
| `Sources & References` | All article types | Replaces "References & Sources"; required, min 3 sources |

**RULE-022:** H2 titles outside this vocabulary fail validation.

The 77-to-11 reduction is the single biggest structural cleanup in v1.0. It also makes the unified template trivially renderable from MDX — section components map 1:1 to vocabulary entries.

---

## 7. Header Field Set (Locked at 7 Fields)

Every article header renders these 7 fields. No more, no fewer. Empty values render as "Unknown" or "TBD" — they do not get omitted.

1. **Incident ID** (`event_id` for incidents, `apt_id` for entity profiles, `campaign_id` for campaigns)
2. **Title**
3. **Severity** (color-coded by `impact_severity`)
4. **Review Status badge** (with confidence grade in v1.1+)
5. **Attribution Confidence** (Admiralty A1–A6)
6. **Primary Date** (`date_disclosed` for incidents, falls back to `date_discovered`)
7. **Status** (Ongoing / Disrupted / Contained / Concluded / Evolving)

All other metadata moves to the **Sidebar Modules** in §8.

---

## 8. Sidebar Module Vocabulary (Render-If-Data-Exists)

12 named modules. Render conditionally based on data presence. No empty boxes, no "N/A" placeholders.

| Module | Renders When | Contents |
|---|---|---|
| `key_takeaways` | Always | Anchor-linked summary points |
| `threat_actor_profile` | `threat_actor_ids` non-empty | Name, aliases, affiliation, motive, attribution confidence |
| `disclosure_credit_card` | `disclosure_credit` non-empty | Researchers, vendors, journalists, agencies |
| `cve_card` | `cves_exploited` non-empty | CVE IDs, CVSS, CWE, link to CVE record |
| `linked_zero_day_cta` | Linked zero-day page exists | "Technical Deep Dive →" callout |
| `linked_malware_card` | `malware_ids` non-empty | Malware family, type, capabilities |
| `affected_systems` | Hardware/software targets specified | Vendor, product, version range |
| `peak_scale_metrics` | Quantified impact data exists | Devices, organizations, countries, dollars |
| `takedown_participants` | Multi-party disruption | Agencies, vendors, governments involved |
| `related_campaigns` | Campaign cross-links exist | Linked campaign articles |
| `related_incidents` | `relatedSlugs` non-empty | Cross-linked incidents, structured cards |
| `classification` | Always | L1/L2 classification, sector, geography |

---

## 9. Confidence Score (New)

### 9.1 Computation

The confidence score is a 0–100 integer computed from deterministic, externally-verifiable signals only. No subjective inputs. No agent-influenceable inputs.

| Component | Weight | Source |
|---|---|---|
| Source count (3-6 = 10pts, 6-9 = 18pts, 10+ = 25pts) | 25 | RULE-004 |
| Source publisher diversity (gov + media + vendor + research) | 15 | publisher_type field |
| All CVEs validated against NVD | 15 | NVD API at compute time |
| All ATT&CK techniques exist in declared `attack_version` | 15 | ATT&CK STIX bundle |
| Attribution confidence | 10 | Admiralty A1=10, A2=8, A3=6, A4=4, A5=2, A6=0 |
| All sources have valid `archived_url` | 10 | RULE-011 |
| All required sections present | 10 | §6 |

**Total: 100 points.**

### 9.2 Letter Grade Mapping

| Score | Grade |
|---|---|
| 90–100 | A |
| 80–89  | B |
| 70–79  | C |
| 60–69  | D |
| <60    | F |

### 9.3 Display Rules

- **v1.0 launch:** Score is computed and stored but **not publicly displayed**. Visible only in the editor dashboard for validation.
- **v1.1 launch:** Score is publicly displayed as the letter grade in article header and search results, with hover tooltip showing numeric score and methodology link.
- **Always:** Public methodology page at `/methodology/confidence-score` showing the formula in full.
- **Never:** Score and review status are not the same signal. Both are always displayed together.

### 9.4 Score Update Triggers

The score recomputes when:
- A source is added or removed
- A source's `archive_status` changes
- An ATT&CK technique mapping is added or removed
- A CVE is added or removed
- `attribution_confidence` changes
- `review_status` changes (recomputes once on transition)

---

## 10. Trust Badge & Visual State

Every article renders a trust badge in the header and a border treatment that combines review status and confidence into a single visual signal.

### 10.1 Badge States

| Review Status | Confidence Grade | Border Treatment | Badge Text |
|---|---|---|---|
| `certified` | A or B | Solid green border | "✓ Certified · Reviewed by [Name]" |
| `certified` | C, D, F | Solid amber border | "✓ Certified · [Grade] · Reviewed by [Name]" |
| `under_review` | Any | Solid blue border | "Under Peer Review" |
| `draft_human` | Any | Solid amber border | "Human Draft · Awaiting Review" |
| `draft_ai` | A | Glowing green border | "AI-Drafted · Awaiting Certification · A" |
| `draft_ai` | B | Glowing amber border | "AI-Drafted · Awaiting Certification · B" |
| `draft_ai` | C–F | Pulsing red-dashed border | "Low Confidence Draft · Handle with Care · [Grade]" |
| `disputed` | Any | Solid red border | "Disputed · Under Re-review" |
| `deprecated` | Any | Grey border, low opacity | "Deprecated · See [Link]" |

### 10.2 Search Engine Indexing Rules

- Articles with `review_status = draft_ai` **must** include `<meta name="robots" content="noindex, nofollow">` until certification.
- Articles with `review_status = certified` **must** include canonical URL pointing to themselves.
- Articles with `review_status = deprecated` **must** include canonical URL pointing to the replacement article.

### 10.3 OG Image Rules (RULE-024)

- OG image path is versioned by status: `/og/draft/{event_id}.png`, `/og/certified/{event_id}.png`, `/og/disputed/{event_id}.png`.
- On status transition, the `og_image_url` field is updated to point at the new path.
- A background job pings Facebook Sharing Debugger, Twitter Card Validator, and LinkedIn Post Inspector on every transition.
- Status text is **not** baked into the OG image — it lives in `<meta property="og:description">` to allow lighter-weight updates.

---

## 11. Sightings — New Entity

### 11.1 Schema

```sql
CREATE TABLE sightings (
  sighting_id              UUID PRIMARY KEY,
  entity_id                UUID NOT NULL,
  entity_type              ENUM NOT NULL,            -- 'apt' | 'malware' | 'cve'
  observed_date            DATE NOT NULL,
  sighting_type            ENUM NOT NULL,            -- see §11.2
  source_ref               JSONB NOT NULL,
  incident_id              UUID NULL,
  confidence               ENUM NOT NULL,            -- 'high' | 'medium' | 'low'
  correction_of_sighting_id UUID NULL,
  corrected_by             VARCHAR NULL,
  correction_reason        ENUM NULL,                -- 'typo' | 'source_updated' | 'new_information'
  created_at               TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  created_by               VARCHAR NOT NULL
);
```

### 11.2 Sighting Type Enum (Active Only)

```
new_campaign           — A new attack campaign attributed to the entity
new_iocs               — New indicators of compromise
new_ttp                — A new tactic, technique, or procedure observed
new_infrastructure     — New C2, hosting, or staging infrastructure
new_target             — A previously untargeted sector or geography
new_variant            — A new malware variant or evolution
```

Retrospective mentions, vendor year-in-reviews, and academic citations are **not** sightings. They live on individual article source lists.

### 11.3 Append-Only Constraint (RULE-014)

Sightings rows are immutable. Corrections happen by inserting a new row with `correction_of_sighting_id` set to the original. The computed `last_observed` view skips corrected rows.

### 11.4 Constraint Rules

- **RULE-017:** A correction's `entity_id` must match the corrected sighting's `entity_id`.
- **RULE-018:** Correction chains may not be circular.

---

## 12. Data Quality Rules (Complete List)

| Rule | Check | Origin |
|---|---|---|
| RULE-001 | `event_id` matches `TP-YYYY-NNNN` | v0.1 |
| RULE-002 | `date_start` cannot be in the future | v0.1 |
| RULE-003 | `date_end` must be after `date_start` if both present | v0.1 |
| RULE-004 | `sources` array must contain ≥3 entries | v0.1 |
| RULE-005 | ≥1 source must have `publisher_type` of government or media | v0.1 |
| RULE-006 | `attribution_rationale` required if confidence is A1–A4 | v0.1 |
| RULE-007 | `target_countries` must use ISO 3166-1 α-2 | v0.1 |
| RULE-008 | `cves_exploited` entries match `CVE-YYYY-NNNNN` | v0.1 |
| RULE-009 | All ATT&CK `technique_id` values must exist in declared `attack_version` | v0.1 |
| RULE-010 | `impact_severity` required before article enters review queue | v0.1 |
| RULE-011 | `archived_url` required for all sources at certification | v0.1 |
| RULE-012 | `attack_version` required on all ATT&CK technique mappings | v0.1 |
| RULE-013 | `last_observed`, `current`, `ongoing_status` are not writable on entities | v1.0 |
| RULE-014 | Sightings table is append-only | v1.0 |
| RULE-015 | Incidents with `status=ongoing` and `date_start` >180 days ago are flagged | v1.0 |
| RULE-016 | `first_observed` updates require ≥2 corroborating sources | v1.0 |
| RULE-017 | Sighting corrections must reference same `entity_id` | v1.0 |
| RULE-018 | Sighting correction chains may not be circular | v1.0 |
| RULE-019 | `threat_actor_ids` may only reference APT registry entries | v1.0 |
| RULE-020 | Date formats within an article must be consistent ISO 8601 | v1.0 |
| RULE-021 | `article_type` is required and immutable | v1.0 |
| RULE-022 | H2 section titles must come from §6 controlled vocabulary | v1.0 |
| RULE-023 | JSON-LD structured data block required in page `<head>` | v1.0 |
| RULE-024 | `og_image_url` must change on draft→certified transition | v1.0 |
| RULE-025 | All articles must include canonical script and style includes | v1.0 |
| RULE-026 | `severity` must be integer 1–5; CVSS lives in its own field | v1.0 |

---

## 13. JSON-LD Structured Data Block (RULE-023)

Every article must include this block in the page `<head>`.

```json
{
  "@context": "https://schema.org",
  "@type": "TechArticle",
  "@id": "https://threatpedia.wiki/incidents/{slug}",
  "headline": "{title}",
  "datePublished": "{date_disclosed}",
  "dateModified": "{updated_at}",
  "author": {
    "@type": "Organization",
    "name": "Threatpedia"
  },
  "reviewedBy": {
    "@type": "Person",
    "name": "{reviewer_name}"
  },
  "creativeWorkStatus": "{review_status}",
  "about": {
    "@type": "Thing",
    "name": "Cyber Security Incident"
  },
  "additionalProperty": [
    {"@type": "PropertyValue", "name": "threatpediaEventId", "value": "{event_id}"},
    {"@type": "PropertyValue", "name": "threatpediaReviewStatus", "value": "{review_status}"},
    {"@type": "PropertyValue", "name": "threatpediaConfidenceGrade", "value": "{confidence_grade}"},
    {"@type": "PropertyValue", "name": "admiraltyAttribution", "value": "{attribution_confidence}"},
    {"@type": "PropertyValue", "name": "impactSeverity", "value": "{impact_severity}"}
  ]
}
```

---

## 14. Required HTML Includes (RULE-025)

Every article must include these tags before `</body>`:

```html
<link rel="stylesheet" href="../assets/css/glossary-tooltips.css">
<link rel="stylesheet" href="../assets/css/incident-report.css">
<script src="../assets/js/glossary-tooltips.js" defer></script>
<script src="../assets/site-chrome.js"></script>
<script src="../assets/universal-search.js"></script>
<script src="../assets/incident-ticker.js"></script>
```

And these meta tags in `<head>`:

```html
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<meta name="review-status" content="{review_status enum}">
<meta name="generated-by" content="{generated_by enum}">
<meta name="generated-date" content="{ISO 8601 timestamp}">
<meta name="confidence-grade" content="{A|B|C|D|F}">
<meta name="article-type" content="{incident|campaign|entity_profile}">
```

Plus the JSON-LD block from §13.

**v1.0 also extracts inline CSS to `incident-report.css`.** The audit found ~11KB of inline `<style>` per article (~407KB of duplicated CSS across 37 articles). The shared stylesheet is the migration unblocker.

---

## 15. STIX 2.1 Field Alignment

| Threatpedia Field | STIX 2.1 Object | STIX Field |
|---|---|---|
| Incident record | `x-oca-incident` | OCA extension |
| APT record | `intrusion-set` | `name`, `aliases`, `goals` |
| Malware record | `malware` | `name`, `malware_types` |
| CVE | `vulnerability` | `name`, `external_references` |
| ATT&CK technique | `attack-pattern` | `name`, `external_references` |
| Source | `external-reference` | `url`, `source_name` |
| Disclosure credit | `identity` | `name`, `identity_class` |
| Attribution | `attributed-to` | Relationship object |
| Sighting | `sighting` | Native STIX object |
| Target sectors/countries | `identity` | `sectors`, `country` |

---

## 16. ID Conventions

| Entity | Pattern | Example |
|---|---|---|
| Incident | `TP-YYYY-NNNN` | `TP-2026-0035` |
| Campaign | `TP-CAMP-NNNN` | `TP-CAMP-0001` |
| APT | `TP-APT-NNNN` | `TP-APT-0001` |
| Malware | `TP-MAL-NNNN` | `TP-MAL-0001` |
| Zero-Day | `TP-0DAY-NNNN` | `TP-0DAY-0001` |
| Disclosure Credit | `DC-NNNN` | `DC-0001` |
| Source | `SRC-NNNN` | `SRC-0001` |
| Sighting | UUID | `550e8400-...` |

The previous `TP-TA-NNNN` pattern (used for ShinyHunters) is deprecated. Threat actor profiles use `TP-APT-NNNN`. The audit found ShinyHunters filed as `TP-TA-0008` inside the `incidents` collection — this is a category error and gets corrected during normalization.

---

## 17. Open Items for Founding Board

These remain open for board review when seated. They are **not** blocking v1.0.

- License finalization (currently CC BY-SA 4.0 for content; AGPL-3.0 noted for platform code)
- Whether to add NIST CSF function mapping as a required field for incidents in regulated sectors
- ATT&CK version pinning policy — lock to a version per article, or update mappings on each ATT&CK release?
- Sector taxonomy expansion for emerging verticals (space infrastructure, biotech)
- Confidence score weights — board may rebalance §9.1 component weights
- Whether to add a contributor reputation system tied to the reward program
- Definition of "campaign" vs "incident" in edge cases
- Whether `disputed` status should be a public state or editor-only

---

*Threatpedia Data Standards · Version 1.0 · April 2026*
*Locked for normalization sweep and Astro migration. Next version: 1.1 (post-Founding Board ratification).*
