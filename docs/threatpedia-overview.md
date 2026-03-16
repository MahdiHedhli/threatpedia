# THREATPEDIA
## The Definitive Cyber Threat Encyclopedia

**PROJECT OVERVIEW · GOVERNANCE FRAMEWORK · ROADMAP**

| STATUS | PHASE | PRIMARY DOMAIN | DOCUMENT TYPE |
|--------|-------|----------------|---------------|
| FOUNDING | 0 — PRE-LAUNCH | threatpedia.wiki | REFERENCE / DRAFT |

Version 0.1 · March 2026 · Confidential Draft

---

## EXECUTIVE SUMMARY

Threatpedia is a Wikipedia-style, peer-reviewed encyclopedia of cyber history. Its mission is to create the world's most authoritative, structured, and open record of cyber threats — every significant incident, attack campaign, and Advanced Persistent Threat group documented, sourced, framework-mapped, and certified for accuracy by a board of cyber historians, practitioners, and subject matter experts.

The cyber security community has long lacked a single, neutral, comprehensive historical record. Incident knowledge is fragmented across vendor reports, news archives, government advisories, and academic papers — rarely structured, rarely linked, and never peer-reviewed to a common standard. Threatpedia exists to fix that.

This document is a working reference for founding board members, prospective reviewers, and subject matter experts being invited into the project. It covers the vision, proposed governance structure, data schema, framework mapping plan, AI augmentation strategy, and development roadmap. All elements remain open for input and refinement — that is the purpose of this document.

---

## THE PROBLEM WE'RE SOLVING

Despite decades of documented cyber incidents, no authoritative, neutral, open reference exists that:

- Covers the full historical record of significant incidents across sectors and geographies
- Applies a consistent, peer-reviewed data schema to every event
- Maps incidents to industry frameworks (MITRE ATT&CK, NIST, Kill Chain) for structured analysis
- Tracks Advanced Persistent Threat groups with canonical naming across vendor taxonomies
- Provides citation-quality sources for researchers, journalists, and policymakers
- Surfaces trend data and enables cross-incident research at scale

Existing resources — vendor threat reports, CISA advisories, Wikipedia, NVD — are valuable but fragmented, commercially motivated, or insufficiently structured for analytical use. Threatpedia fills the gap as a community-owned, editorially independent, AI-assisted reference platform.

---

## VISION & CORE PRINCIPLES

### Vision Statement

Threatpedia will become the definitive open record of cyber history — the first resource researchers, practitioners, journalists, and policymakers reach for when they need accurate, structured, citable information about a cyber event or threat actor.

### Core Principles

- **Editorial Independence** — no commercial sponsor influences article content or certification decisions
- **Community Ownership** — governed by practitioners, historians, and journalists, not a corporate entity
- **Structured by Default** — every article captures standardized fields enabling cross-incident data analysis
- **Human Verified** — AI assists, but all certified content passes peer review by qualified humans
- **Open Access** — core encyclopedia is free; commercial API tiers fund sustainability
- **Citable** — every article meets academic citation standards with sourced, versioned content

---

## GOVERNANCE & ORGANIZATION

Threatpedia is designed to operate as an editorially independent platform governed by a founding board of recognized cyber professionals. The governance model draws from the Wikipedia Foundation model, adapted for a credentialed expert review process.

### Founding Board Composition

| ROLE | FUNCTION |
|------|----------|
| Cyber Historians | Define historical scope, validate timelines, ensure narrative accuracy of documented events |
| Investigative Journalists | Assess source quality, editorial standards, and media representation of incidents |
| SMEs by Domain | Technical review across ICS/OT, Nation-State, Ransomware, Financial, Supply Chain, and other verticals |
| Legal / Policy Advisors | Guide responsible disclosure, attribution standards, and handling of legally contested events |
| Academic Representatives | Ensure scholarly rigor, data methodology, and suitability for academic citation |
| Industry Representatives | CISO-level practitioners grounding the schema and taxonomy in real-world operational use |

### Review Workforce

Below the board, a tiered workforce of peer reviewers handles day-to-day article evaluation:

- **Junior Reviewers** — assess completeness, source count, and basic factual accuracy
- **Senior Reviewers** — domain-specific technical and narrative review
- **Domain Leads** — final approval authority within their specialty; escalate disputes to the board
- **AI Pre-Screeners** — LLM-assisted first pass for completeness, duplicate detection, and source quality flagging before entering the human review queue

### The Threatpedia Certification Stamp

Articles achieving the **Threatpedia Certified** status must satisfy all of the following:

- Core facts verified: date, actor, impact, and TTPs confirmed against primary sources
- Minimum three independent corroborating sources
- Framework mapping completed (MITRE ATT&CK at minimum for Phase 1)
- Reviewed by two or more qualified reviewers with no major unresolved disputes
- Scheduled for annual re-review as new attribution data or declassified details emerge

---

## DATA SCHEMA

Every Threatpedia record — whether an incident or an APT profile — captures a defined set of structured fields. Required fields are mandatory for certification. Optional fields are captured where available and enable richer analysis.

### Incident Record — Required Fields

| FIELD | DESCRIPTION |
|-------|-------------|
| Event ID | Unique Threatpedia identifier (format: TP-YYYY-NNNN) |
| Common Name | Widely known name (e.g., "SolarWinds", "NotPetya", "WannaCry") |
| Classification | Category and subcategory of event type |
| Date Range | Start / end / discovery date |
| Attribution | Actor(s), confidence level, state affiliation if applicable |
| Targets | Sector(s), geography, named victims (where public) |
| Impact Summary | Data stolen, systems affected, financial impact (estimated) |
| Initial Vector | Method of initial access |
| Source Citations | Minimum three corroborating independent sources |
| Status | Active / Concluded / Evolving |
| Review Status | Draft / Under Review / Threatpedia Certified |

### Incident Record — Optional Fields

| FIELD | DESCRIPTION |
|-------|-------------|
| MITRE ATT&CK | Mapped TTPs with confidence level per technique |
| Kill Chain Stage(s) | Mapping to Lockheed Martin Cyber Kill Chain stages |
| NIST Function(s) | Identify / Protect / Detect / Respond / Recover |
| Diamond Model | Completed adversary diamond for the event |
| Malware / Tools Used | Links to malware registry entries |
| CVEs Exploited | Linked CVE records with exploitation context |
| Remediation / Lessons | Post-incident actions and public lessons learned |
| Legal / Regulatory Outcome | Indictments, sanctions, regulatory actions |
| Related Events | Linked Threatpedia records (campaigns, follow-on attacks) |
| Media Coverage | Curated list of notable reporting with publication details |

### APT Registry — Required Fields

| FIELD | DESCRIPTION |
|-------|-------------|
| APT ID | Unique Threatpedia APT identifier |
| Primary Name | Threatpedia canonical name |
| Aliases | CrowdStrike, Mandiant, Microsoft, Recorded Future designations |
| State Affiliation | Suspected or confirmed sponsoring nation |
| Attribution Confidence | High / Medium / Low / Disputed |
| Active Status | Active / Dormant / Disbanded / Unknown |
| First Observed | Year or date range of first documented activity |
| Known Campaigns | Linked incident records (many-to-many relationship) |
| Primary Motivation | Espionage / Financial / Sabotage / Hacktivism / Multi |
| Known Sectors Targeted | Industry verticals historically targeted |

---

## FRAMEWORK MAPPING PLAN

Structured framework mapping is what elevates Threatpedia from an archive to an analytical platform. By tagging every incident with technique, tactic, and kill chain data, the corpus becomes queryable for trend research, sector risk analysis, and defender tooling.

### Phase 1 Frameworks

- **MITRE ATT&CK** — Techniques, Tactics, and Procedures (highest priority; broadest community adoption)
- **Lockheed Martin Cyber Kill Chain** — Stage-level mapping for each event
- **NIST Cybersecurity Framework** — Function-level mapping (Identify, Protect, Detect, Respond, Recover)

### Phase 2 Frameworks

- **Diamond Model of Intrusion Analysis** — Full adversary diamond per event
- **OWASP Top 10** — For application-layer events
- **VERIS** — Vocabulary for Event Recording and Incident Sharing
- **FAIR** — Quantitative risk model linkage
- **ICS-CERT / IEC 62443** — For OT and ICS events

### Data Exchange Standards

- **STIX 2.1** — Primary export format for threat intelligence sharing
- **TAXII** — Distribution protocol for STIX feeds
- **REST API** — Programmatic access to all certified records

---

## AI AUGMENTATION STRATEGY

AI plays a supporting role in Threatpedia's editorial pipeline — accelerating human reviewers, not replacing them. All AI-generated content requires human review and approval before any article achieves certified status.

### AI-Assisted Workflows

| WORKFLOW | DESCRIPTION |
|----------|-------------|
| News Aggregation | Continuous monitoring of news outlets, blogs, and government advisories to surface new events for potential inclusion |
| Pre-Screening | AI reviews submissions for completeness, source quality, and duplicate detection before entering the human review queue |
| Draft Generation | AI generates a structured first-draft article from aggregated sources; human editors refine and certify |
| Framework Auto-Mapping | AI suggests ATT&CK techniques and kill chain stages from incident narratives; SME confirms or overrides |
| Duplicate Detection | Identifies when two submissions describe the same event under different names or dates |
| Trend Surfacing | AI identifies emerging patterns across the corpus (e.g., rising frequency of a specific TTP across sectors) |
| Source Verification | Checks whether citations are primary sources, have been retracted, or come from low-credibility outlets |

A full audit trail of AI versus human contributions will be maintained per article and displayed to reviewers. AI confidence scores are surfaced to assist — not override — expert judgment.

---

## DEVELOPMENT ROADMAP

Threatpedia is being built in deliberate phases, with each phase dependent on foundational decisions made in the prior one. The founding board's input is particularly critical in Phases 0 and 1.

| PHASE | STATUS | FOCUS AREAS |
|-------|--------|-------------|
| Phase 0 | NOW | Domains secured · Landing page live · Founding interest list building · This document |
| Phase 1 | Q2 2026 | Board formation · Schema finalization · Governance documents · Founding team recruitment |
| Phase 2 | Q3 2026 | Platform build · Seed content (100 landmark events) · Reviewer onboarding · Internal testing |
| Phase 3 | Q4 2026 | Public beta · Community submissions open · Peer review workflow live · APT registry seeded |
| Phase 4 | 2027 | Full public launch · REST API v1 · First annual Threatpedia Threat Report |
| Phase 5 | 2027+ | STIX/TAXII feed · Academic partnerships · International content expansion · Enterprise licensing |

---

## FOUNDING BOARD AGENDA: OPEN QUESTIONS

The following questions are deliberately left open for the founding board to resolve. These decisions will define Threatpedia's character, scope, and credibility for years to come.

### Meeting 1 — Scope & Definition

- What distinguishes a cyber event from a cyber incident from a cyber campaign for inclusion purposes?
- What is the minimum severity threshold? (National significance? Dollar threshold? Novel TTP?)
- How far back does the historical record go — ARPANET era, Morris Worm, or later?
- What are the exclusion criteria for unattributed, unverified, or legally contested events?

### Meeting 2 — Data Schema & Registration

- Are there additional required or optional fields the board believes are essential?
- What is the naming convention for event IDs, and how do we handle common name collisions?
- What source citation standards apply — journalistic, academic, government, or a hybrid?
- How do we handle classified or sensitive details in article content?

### Meeting 3 — Framework Mapping Standards

- What methodology governs framework mapping, and how is confidence scored?
- How do we handle partial or contested technique mappings?
- Which additional frameworks beyond the Phase 1 set should be prioritized?

### Meeting 4 — APT Registry Standards

- What is the formal definition of an APT for registry inclusion purposes?
- How do we handle naming conflicts between CrowdStrike, Mandiant, Microsoft, and other taxonomies?
- What attribution confidence standards govern state sponsorship designations?

---

## SUSTAINABILITY MODEL

Threatpedia's core encyclopedia will remain permanently free and publicly accessible. Sustainability is funded through a tiered commercial model that preserves editorial independence.

- **Free public access** — full article read access, no paywall
- **API access tiers** — free academic / rate-limited commercial / enterprise unlimited
- **Enterprise data licensing** — structured feeds for SIEM, TIP, and security platform integrations
- **Research partnerships** — universities and think tanks co-funding specific corpus development
- **Foundation model** — grants, donations, and government partnerships as the platform matures

---

## DOMAINS & INFRASTRUCTURE

| DOMAIN | STATUS | NOTES |
|--------|--------|-------|
| threatpedia.wiki | Owned | Primary — recommended lead domain for authority signal |
| threatpedia.net | Owned | Technical / API endpoint |
| threatopedia.wiki | Owned | Redirect to threatpedia.wiki |
| threatopedia.net | Owned | Redirect to threatpedia.wiki |

The `.wiki` TLD conveys immediate authority and editorial legitimacy. All other domains will redirect to `threatpedia.wiki` as the canonical public-facing address.

---

## GETTING INVOLVED

Threatpedia is currently in its founding phase. The platform's quality and credibility will be determined by the people who help build it. We are looking for individuals who:

- Have deep domain expertise in at least one area of cyber security, threat intelligence, or cyber history
- Are willing to contribute a modest amount of review time on a periodic basis
- Care about the existence of a neutral, community-owned record of cyber history
- Can bring credibility, a network, or a specific knowledge vertical the platform needs

Board membership is by invitation only. Reviewer and contributor roles are open to qualified applicants via the registration form at [threatpedia.wiki](https://threatpedia.wiki).

To discuss the project further or explore how you might be involved, please reach out directly. This document is a working draft — all feedback is welcome and will be used to shape the platform.

---

*threatpedia.wiki · Version 0.1 · March 2026 · Confidential — For Founding Discussion Only*
