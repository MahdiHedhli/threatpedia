# Threatpedia — Project Ideas & Planning Document
*Living Document — Last Updated: March 2026*

---

## 🧭 Vision Statement

Threatpedia is the definitive, Wikipedia-style open encyclopedia of cyber history — peer-reviewed, framework-mapped, and AI-augmented. It serves as the authoritative record for researchers, practitioners, journalists, and policymakers to understand the full landscape of cyber threats, past and present.

---

## 🏛️ Governance & Organization

### Board Composition (Proposed)
- [ ] Cyber Historians
- [ ] Investigative Cyber Journalists / Reporters
- [ ] Subject Matter Experts (SMEs) by domain: ICS/OT, Nation-State, Ransomware, Financial, etc.
- [ ] Legal / Policy Advisors
- [ ] Academic Representatives
- [ ] Industry Representatives (CISO-level)

### Review Workforce
- Human Peer Reviewers (tiered: Junior, Senior, Domain Lead)
- AI-Augmented Pre-Screeners (LLM-assisted fact-checking, source aggregation, duplicate detection)
- Editor-in-Chief / Editorial Board for dispute resolution

### The "Threatpedia Stamp" Certification
- Verified accuracy of core facts (date, actor, impact, TTPs)
- Minimum source count (e.g., 3 independent corroborating sources)
- Framework mapping completed
- Reviewed by ≥2 qualified reviewers with no major unresolved disputes
- Annual re-review for evolving attribution or newly declassified details

---

## 📋 Founding Agenda: Initial Board Meetings

### Meeting 1 — Definition & Scope
- What constitutes a "cyber event" vs. "cyber incident" vs. "cyber campaign"?
- Minimum severity threshold for inclusion (e.g., national significance, >$X impact, novel TTPs)
- Categories: Data Breach, Ransomware, Espionage, Sabotage, DDoS, Disinformation, Supply Chain, etc.
- Geographic/geopolitical scope (global from day one vs. phased)
- Historical depth (how far back? First internet worm? ARPANET era?)
- Exclusion criteria: unattributed, unverified, legally contested events

### Meeting 2 — Data Schema & Registration
- Required vs. optional data points (see schema below)
- Event ID / naming convention (e.g., TP-2017-0001 / "WannaCry")
- Source citation standards (journalistic, academic, government)
- Version control & edit history (Wikipedia-style diffs)
- Handling of classified or sensitive details

### Meeting 3 — Framework Mapping Standards
- Which frameworks to map: MITRE ATT&CK, NIST CSF, Cyber Kill Chain, OWASP, Diamond Model, etc.
- Mapping methodology and confidence scoring
- Handling partial or contested mappings
- API / data export format (STIX/TAXII, JSON, CSV)

### Meeting 4 — APT Registry Standards
- Definition of an APT for registry purposes
- Required profile fields (see APT schema below)
- Linking APT records to incident records (many-to-many)
- State sponsorship attribution standards and confidence levels
- Naming conventions (reconciling CrowdStrike, Mandiant, Microsoft naming)

---

## 🗃️ Data Schema

### Incident Record — Required Fields
| Field | Description |
|---|---|
| Event ID | Unique Threatpedia identifier (TP-YYYY-NNNN) |
| Common Name | Widely known name (e.g., "SolarWinds", "NotPetya") |
| Classification | Category/subcategory of event type |
| Date Range | Start / end / discovery date |
| Attribution | Actor(s), confidence level, state affiliation if applicable |
| Targets | Sector(s), geography, named victims (public) |
| Impact Summary | Data stolen, systems affected, financial impact (estimated) |
| Initial Vector | How entry was achieved |
| Source Citations | Minimum 3 corroborating sources |
| Status | Active / Concluded / Evolving |
| Review Status | Draft / Under Review / Threatpedia Certified |

### Incident Record — Optional Fields
| Field | Description |
|---|---|
| MITRE ATT&CK Techniques | Mapped TTPs with confidence level |
| Kill Chain Stage(s) | Mapped to Lockheed Martin Kill Chain |
| NIST Function(s) | Identify / Protect / Detect / Respond / Recover |
| Diamond Model | Completed diamond for the event |
| Malware/Tools Used | Links to malware registry entries |
| CVEs Exploited | Linked CVE records |
| Remediation / Lessons Learned | Post-incident actions taken |
| Legal / Regulatory Outcome | Indictments, sanctions, regulatory actions |
| Related Events | Linked Threatpedia records (campaigns, follow-on attacks) |
| Media Coverage | Curated list of notable reporting |

### APT Registry Record — Required Fields
| Field | Description |
|---|---|
| APT ID | Unique Threatpedia APT identifier |
| Primary Name | Threatpedia canonical name |
| Aliases | CrowdStrike, Mandiant, Microsoft, Recorded Future names |
| State Affiliation | Suspected / Confirmed sponsor nation |
| Attribution Confidence | High / Medium / Low / Disputed |
| Active Status | Active / Dormant / Disbanded / Unknown |
| First Observed | Year or date range |
| Known Campaigns | Linked incident records |
| Primary Motivation | Espionage / Financial / Sabotage / Hacktivism / Multi |
| Known Sectors Targeted | Verticals historically targeted |

### APT Registry Record — Optional Fields
| Field | Description |
|---|---|
| Known Toolset | Malware families, frameworks, LOLbins |
| Known TTPs | MITRE ATT&CK mapping |
| Infrastructure Indicators | Known C2 patterns (at appropriate level) |
| Legal Actions | Indictments, sanctions |
| Analyst Notes | Unresolved attribution debates |

---

## 🗺️ Framework Mapping Plan

### Frameworks to Support (Phase 1)
- **MITRE ATT&CK** — Techniques, Tactics, Procedures (highest priority)
- **Lockheed Martin Cyber Kill Chain** — Stage mapping
- **NIST Cybersecurity Framework** — Function mapping

### Frameworks to Support (Phase 2)
- **Diamond Model of Intrusion Analysis** — Full diamond per event
- **OWASP Top 10** — For application-layer events
- **VERIS** — Vocabulary for Event Recording and Incident Sharing
- **FAIR** — Quantitative risk model linkage
- **ICS-CERT / IEC 62443** — For OT/ICS events

### Data Exchange Standards
- **STIX 2.1** — Export format for threat intelligence sharing
- **TAXII** — Distribution protocol for STIX feeds
- **OpenIOC** — Optional indicator-level exports
- REST API for programmatic access to all records

---

## 🤖 AI Augmentation Strategy

### AI-Assisted Workflows
- **News Aggregation** — Continuous monitoring of news outlets, blogs, government advisories to surface potential new events
- **Pre-Screening** — AI pre-reviews submissions for completeness, source quality, and potential duplicates before human review queue
- **Draft Generation** — AI generates first-draft article from aggregated sources; human editors refine and certify
- **Framework Auto-Mapping** — AI suggests ATT&CK techniques from incident narratives; human SME confirms
- **Duplicate Detection** — Identify when two submissions describe the same event
- **Trend Surfacing** — AI identifies emerging patterns across the corpus (e.g., rising use of a specific TTP)
- **Source Verification** — AI checks if citations are primary sources, have been retracted, or are low-credibility

### Human-in-the-Loop Requirements
- All AI-generated content requires human review before certification
- AI confidence scores displayed to reviewers
- Full audit trail of AI vs. human contributions per article

---

## 📈 Analytics & Research Features

### Planned Data Analysis Capabilities
- Filter incidents by: date range, sector, actor, geography, attack type, CVE, framework technique
- Timeline visualizations of attack campaigns
- Sector heat maps (most targeted industries by year)
- TTP frequency analysis (which techniques appear most across incidents)
- Attribution clustering (events linked to same actor)
- Trend lines: ransomware growth, OT attacks, supply chain compromises over time

### Research Publishing
- Threatpedia Annual Threat Report (generated from structured data)
- Open dataset downloads for academic researchers
- API access (free tier for academics / commercial tier for industry)

---

## 💡 Additional Ideas to Explore

### Content Expansion
- **Malware Registry** — Dedicated pages for malware families (like MalwareBazaar, but encyclopedic)
- **Vulnerability Encyclopedia** — Major CVEs with narrative context beyond NVD descriptions
- **Cyber Law & Policy Tracker** — Legislation, sanctions, international cyber agreements by country
- **Disinformation Campaign Registry** — Information operations documented alongside technical attacks
- **Incident Response Case Studies** — Anonymized or published IR post-mortems
- **ISAC/ISAO Directory** — Reference to sector sharing groups

### Community & Ecosystem
- **Contributor Reputation System** — Peer review credits, expertise badges (like Wikipedia's trusted editor model)
- **Talk Pages** — Structured debate on disputed attribution or contested facts
- **Watchlist / Alerts** — Users subscribe to alerts when pages they follow are updated
- **Citation Export** — Academic citation format (APA, Chicago, BibTeX) for every article
- **Browser Extension** — Highlights mentions of documented threats across the web

### Monetization / Sustainability Options
- Free public access (core mission)
- API access tiers (free academic / commercial SaaS)
- Enterprise data licensing (feeds into SIEM, TIP platforms)
- Research partnerships with universities and think tanks
- Foundation model (donations, grants, government partnerships)
- Certification / continuing education tie-ins for reviewers

### Platform Integrations
- MITRE ATT&CK Navigator (export directly to Navigator layers)
- Splunk / Elastic SIEM integrations
- Threat Intelligence Platforms (MISP, OpenCTI, Anomali)
- GitHub (open dataset repository)
- Academic databases (JSTOR, SSRN partnerships)

### Legal & Ethical Guardrails
- Policy on naming individual threat actors (responsible disclosure)
- Process for handling disputed or legally contested attributions
- Policy for requests to remove or modify entries (government, legal pressure)
- Privacy policy for victim organization data
- Editorial independence policy (protecting against sponsor influence)

---

## 🌐 Domains Registered

| Domain | Status | Notes |
|---|---|---|
| threatpedia.net | ✅ Owned | Primary candidate |
| threatopedia.net | ✅ Owned | Redirect / alternate |
| threatpedia.wiki | ✅ Owned | High-value TLD for authority |
| threatopedia.wiki | ✅ Owned | Redirect / alternate |

**Recommendation:** Lead with `threatpedia.wiki` for the authority signal the .wiki TLD conveys, with all others redirecting. Use `threatpedia.net` as technical/API endpoint.

---

## 🛣️ Rough Roadmap

| Phase | Focus |
|---|---|
| **0 — Now** | Domain secured, landing page live, founding interest list building |
| **1 — Founding** | Board formation, schema finalization, governance documents, founding team hiring |
| **2 — Alpha** | Platform build, seed content (100 landmark events), reviewer onboarding |
| **3 — Beta** | Public beta, community submissions open, peer review workflow live |
| **4 — Launch** | Full launch, API v1, APT registry complete, first annual report |
| **5 — Scale** | Framework expansion, STIX/TAXII feed, academic partnerships, international content |

---

*This is a living document. Items marked with [ ] are open action items.*
