# Threatpedia Data Standards

*Version 0.1 · March 2026 · Status: Draft — Open for Founding Board Review*

---

## Overview

This document defines the data standards governing how Threatpedia collects, structures, and validates all content. Adherence to these standards is mandatory for any article to achieve **Threatpedia Certified** status. The schema is designed from the ground up for analytical use — every field is typed, constrained, and aligned to STIX 2.1 and MITRE ATT&CK to ensure the corpus is machine-readable and queryable from day one.

All items marked `[ ]` are open for Founding Board input.

---

## Entity Types & Relationships

Threatpedia has five core entity types. All entities are linked — articles are not standalone documents but nodes in a structured knowledge graph.

```
INCIDENT ──< USES >──────────── MALWARE
INCIDENT ──< ATTRIBUTED_TO >── APT
INCIDENT ──< EXPLOITS >──────── CVE
INCIDENT ──< MAPS_TO >───────── TTP (MITRE ATT&CK)
APT      ──< USES >──────────── MALWARE
APT      ──< AFFILIATED_WITH >─ NATION_STATE
```

---

## Controlled Vocabularies

All categorical fields use locked controlled vocabularies. Free-text classification fields are prohibited — they prevent filtering, correlation, and trend analysis.

### Incident Classification

Two-tier classification. Both tiers are required.

| Tier 1 | Tier 2 Options |
|---|---|
| Data Breach | Exfiltration, Exposure, Insider |
| Ransomware | Encryption-only, Double Extortion, Triple Extortion |
| Espionage | Nation-State, Corporate, Political |
| Sabotage | Destructive Malware, Physical-Cyber, ICS/OT |
| Supply Chain | Software, Hardware, Managed Service Provider |
| DDoS | Volumetric, Protocol, Application Layer |
| Financial | BEC, Fraud, Crypto Theft, SWIFT |
| Disinformation | Influence Op, Deepfake, Account Takeover |
| Vulnerability | Zero-Day Exploit, N-Day Exploit, Misconfiguration |
| Access Brokerage | Initial Access Sold, Credential Theft |

### Attribution Confidence — Admiralty Scale

| Code | Label | Meaning |
|---|---|---|
| A1 | Confirmed | Official government attribution or perpetrator admission |
| A2 | High | Multiple independent vendors agree, strong technical evidence |
| A3 | Medium | Credible single-vendor attribution with supporting indicators |
| A4 | Low | Circumstantial evidence, TTPs loosely consistent |
| A5 | Disputed | Active disagreement between credible sources |
| A6 | Unknown | Insufficient evidence to attribute |

### Impact Severity

| Level | Label | Criteria |
|---|---|---|
| 5 | Critical | National infrastructure, >$1B impact, or mass casualty potential |
| 4 | High | Major sector disruption, $100M–$1B impact, or 10M+ records |
| 3 | Significant | Notable disruption, $10M–$100M impact, or 1M–10M records |
| 2 | Moderate | Limited disruption, $1M–$10M impact, or <1M records |
| 1 | Low | Contained, minimal financial or operational impact |

### Initial Access Vector

Aligned to MITRE ATT&CK Initial Access tactic (TA0001).

| Vector | ATT&CK ID |
|---|---|
| Phishing | T1566 |
| Valid Accounts | T1078 |
| Exploit Public-Facing Application | T1190 |
| Supply Chain Compromise | T1195 |
| Trusted Relationship | T1199 |
| Drive-by Compromise | T1189 |
| Hardware Additions | T1200 |
| External Remote Services | T1133 |
| Replication Through Removable Media | T1091 |

### Incident Status

```
Ongoing      — Active threat activity confirmed
Concluded    — Activity has ceased
Evolving     — New developments after initial documentation
Cold Case    — Unresolved, no recent activity
Disputed     — Facts or attribution actively contested
```

### Sector Taxonomy

Aligned to NAICS, simplified for cyber context.

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
```

---

## Incident Record — Field Specification

### Required Fields

| Field | Type | Format | Validation |
|---|---|---|---|
| `event_id` | String | `TP-YYYY-NNNN` | Auto-assigned, immutable |
| `common_name` | String | Title case, max 80 chars | Required, unique |
| `aliases` | Array[String] | Free text | Optional |
| `classification_l1` | Enum | Controlled vocab | Required |
| `classification_l2` | Enum | Controlled vocab, child of L1 | Required |
| `date_start` | Date | ISO 8601 `YYYY-MM-DD` | Required; `YYYY-MM` or `YYYY` if exact date unknown |
| `date_discovered` | Date | ISO 8601 | Optional |
| `date_disclosed` | Date | ISO 8601 | Optional |
| `date_end` | Date | ISO 8601 | Optional; null if ongoing |
| `attribution_actor_ids` | Array[APT_ID] | Foreign key to APT registry | Optional |
| `attribution_confidence` | Enum | Admiralty A1–A6 | Required |
| `attribution_rationale` | String | Free text, max 500 chars | Required if confidence A1–A4 |
| `target_sectors` | Array[Enum] | Sector taxonomy | Required, min 1 |
| `target_countries` | Array[String] | ISO 3166-1 alpha-2 | Required, min 1 |
| `target_named_orgs` | Array[String] | Free text | Optional; only if publicly disclosed |
| `impact_severity` | Enum | 1–5 scale | Required |
| `impact_records_exposed` | Integer | Count | Optional |
| `impact_financial_usd` | Integer | USD estimate | Optional |
| `impact_description` | String | Free text, max 1000 chars | Required |
| `initial_access_vector` | Enum | ATT&CK T-code aligned | Required |
| `cves_exploited` | Array[String] | `CVE-YYYY-NNNNN` | Optional |
| `malware_ids` | Array[Malware_ID] | Foreign key | Optional |
| `status` | Enum | Controlled vocab | Required |
| `sources` | Array[Source] | See source schema | Required, min 3 |
| `review_status` | Enum | Draft / In Review / Certified | System-managed |
| `created_at` | Datetime | ISO 8601 | Auto-assigned |
| `last_updated` | Datetime | ISO 8601 | Auto-assigned |
| `version` | Integer | Increment on each edit | Auto-assigned |

### Optional Fields

| Field | Type | Description |
|---|---|---|
| `mitre_attack_techniques` | Array[Technique] | See ATT&CK mapping schema |
| `kill_chain_stages` | Array[Enum] | Derived from ATT&CK mapping |
| `nist_functions` | Array[Enum] | Identify / Protect / Detect / Respond / Recover |
| `diamond_model` | Object | Adversary, Infrastructure, Capability, Victim |
| `legal_regulatory_outcome` | String | Indictments, sanctions, regulatory actions |
| `remediation_notes` | String | Post-incident actions and public lessons learned |
| `related_event_ids` | Array[TP_ID] | Linked Threatpedia incident records |
| `media_coverage` | Array[Source] | Curated notable reporting |

---

## Source Schema

Each source is a structured object. URL strings alone are not acceptable.

```json
{
  "source_id": "SRC-0001",
  "url": "https://...",
  "title": "Article or report title",
  "publisher": "Mandiant / Reuters / CISA / etc.",
  "publisher_type": "vendor | government | media | academic | legal",
  "published_date": "YYYY-MM-DD",
  "archived_url": "https://web.archive.org/...",
  "credibility": "primary | secondary | corroborating",
  "notes": "Optional reviewer notes on this source"
}
```

**Archiving requirement:** All sources must be archived via the Wayback Machine at time of publication. URLs rot — archived copies are mandatory for certification.

**Minimum source rules:**
- At least 3 independent corroborating sources required for certification
- At least 1 source must be `publisher_type: government` OR `publisher_type: media`
- Sources from the same parent organization count as a single independent source

---

## MITRE ATT&CK Mapping Standards

### Technique Schema

```json
{
  "technique_id": "T1566.001",
  "technique_name": "Spearphishing Attachment",
  "tactic": "Initial Access",
  "confidence": "confirmed | probable | possible",
  "evidence": "Free text describing evidence for this mapping",
  "attack_version": "v15",
  "mapped_by": "reviewer_id",
  "mapped_date": "YYYY-MM-DD",
  "source_refs": ["SRC-0001", "SRC-0002"]
}
```

### Confidence Tiers

| Tier | Label | Meaning |
|---|---|---|
| confirmed | Confirmed | Direct technical evidence (malware sample, IR report, network capture) |
| probable | Probable | Strong circumstantial evidence from credible source |
| possible | Possible | Inferred from known actor TTPs or partial evidence |

### Mapping Rules

- Every technique mapping must include an `evidence` field — speculative mappings without evidence are rejected
- The `attack_version` field is required — ATT&CK evolves and mappings must be versioned to remain accurate
- Kill Chain stage is derived automatically from ATT&CK tactic — reviewers do not enter both manually
- Sub-techniques (e.g., `T1566.001`) are preferred over parent techniques where evidence supports specificity

---

## APT Registry — Field Specification

### Required Fields

| Field | Type | Format | Notes |
|---|---|---|---|
| `apt_id` | String | `TP-APT-NNNN` | Auto-assigned, immutable |
| `canonical_name` | String | Title case | Threatpedia's primary name |
| `naming_rationale` | String | Free text | Why this canonical name was chosen |
| `vendor_names` | Object | See schema | CrowdStrike, Mandiant, Microsoft, Recorded Future |
| `aliases` | Array[String] | Free text | All known alternate names |
| `nation_state` | String | ISO 3166-1 alpha-2 | Primary suspected/confirmed sponsor |
| `sub_org_affiliation` | String | Free text | e.g., "GRU Unit 74455", "MSS" |
| `attribution_confidence` | Enum | Admiralty A1–A6 | Required |
| `active_status` | Enum | Active / Dormant / Disbanded / Unknown | Required |
| `active_since` | Integer | Year | First observed activity |
| `last_observed` | String | Year or "Ongoing" | |
| `primary_motivation` | Enum | Espionage / Financial / Sabotage / Hacktivism / Multi | Required |
| `secondary_motivation` | Enum | Same options | Optional |
| `known_campaigns` | Array[TP_ID] | Foreign key to incidents | Required, min 1 for certification |
| `known_sectors_targeted` | Array[Enum] | Sector taxonomy | Required, min 1 |
| `diamond_model` | Object | Adversary / Infrastructure / Capability / Victim | Optional |
| `known_malware_families` | Array[Malware_ID] | Foreign key | Optional |

### Vendor Names Schema

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

## Data Quality Rules

Automatically enforced before any article enters the human review queue.

| Rule ID | Check |
|---|---|
| RULE-001 | `event_id` must match pattern `TP-YYYY-NNNN` |
| RULE-002 | `date_start` cannot be in the future |
| RULE-003 | `date_end` must be after `date_start` if both present |
| RULE-004 | `sources` array must contain minimum 3 entries |
| RULE-005 | At least 1 source must be `publisher_type: government` or `media` |
| RULE-006 | `attribution_rationale` required if confidence is A1–A4 |
| RULE-007 | `target_countries` must be valid ISO 3166-1 alpha-2 codes |
| RULE-008 | `cves_exploited` entries must match `CVE-YYYY-NNNNN` format |
| RULE-009 | All ATT&CK `technique_id` values must exist in the declared `attack_version` |
| RULE-010 | `impact_severity` required before article enters review queue |
| RULE-011 | `archived_url` required for all sources at certification (not submission) |
| RULE-012 | `attack_version` required on all ATT&CK technique mappings |

---

## STIX 2.1 Field Alignment

All Threatpedia fields are designed for clean export to STIX 2.1. This enables direct ingestion by MISP, OpenCTI, Anomali, and other TIP platforms.

| Threatpedia Field | STIX 2.1 Object | STIX Field |
|---|---|---|
| Incident record | `x-oca-incident` | OCA extension |
| APT record | `intrusion-set` | `name`, `aliases`, `goals` |
| Malware record | `malware` | `name`, `malware_types` |
| CVE | `vulnerability` | `name`, `external_references` |
| ATT&CK technique | `attack-pattern` | `name`, `external_references` |
| Source | `external-reference` | `url`, `source_name` |
| Attribution | `attributed-to` relationship | |
| Target sectors/countries | `identity` | `sectors`, `country` |

---

## Open Items for Founding Board

- [ ] Additional required or optional fields beyond this spec
- [ ] Naming convention for handling common name collisions (e.g., two events both known as "Operation Aurora")
- [ ] Source citation standards — hybrid of journalistic, academic, and government, or tiered by article type?
- [ ] Policy for handling classified or sensitive details in article content
- [ ] ATT&CK version pinning policy — lock to a version per article, or update mappings on each ATT&CK release?
- [ ] Sector taxonomy additions for emerging verticals (AI systems, space infrastructure)
- [ ] License finalization (currently CC BY-SA 4.0 — open for board ratification)

---

*Threatpedia Data Standards · Version 0.1 · March 2026*
*This document is a working draft. All fields and rules are subject to Founding Board review.*
