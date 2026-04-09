# Threatpedia Connector Specifications — Progress Tracker

**Last Updated:** 2026-04-08

---

## Completion Summary

| Phase | Total Sources | Specs Completed | Remaining |
|-------|--------------|----------------|-----------|
| Phase 1 | 7 | 7 | 0 |
| Phase 2 | 9 | 3 | 6 |
| Phase 3 | 7 | 0 | 7 |
| Phase 4 | 11 | 0 | 11 |
| **Total** | **39** (includes 5 category headers excluded) | **10** | **24** |

---

## Phase 1 — Foundational Sources

| # | Source Name | Status | Spec File | Date Completed |
|---|-----------|--------|-----------|----------------|
| 2 | CISA KEV Catalog | DONE | `cisa-kev-connector-spec.md` | 2026-03-24 |
| 9 | Have I Been Pwned (HIBP) | DONE | `hibp-connector-spec.md` | 2026-03-25 |
| 11 | VERIS Community DB (VCDB) | DONE | `vcdb-connector-spec.md` | 2026-03-26 |
| 14 | NIST NVD | DONE | `nist-nvd-connector-spec.md` | 2026-03-27 |
| 15 | CVE / MITRE | DONE | `cve-mitre-connector-spec.md` | 2026-03-30 |
| 25 | MISP (Open Source) | DONE | `misp-connector-spec.md` | 2026-03-31 |
| 27 | MITRE ATT&CK | DONE | `mitre-attack-connector-spec.md` | 2026-04-01 |

## Phase 2 — Regulatory Sources

| # | Source Name | Status | Spec File | Date Completed |
|---|-----------|--------|-----------|----------------|
| 1 | HHS/OCR Breach Portal | DONE | `hhs-ocr-connector-spec.md` | 2026-04-02 |
| 3 | EU GDPR Enforcement Tracker | DONE | `eu-gdpr-enforcement-tracker-connector-spec.md` | 2026-04-03 |
| 4 | Australian OAIC Breaches | DONE | `australian-oaic-connector-spec.md` | 2026-04-08 |
| 5 | UK ICO Enforcement | NEXT | — | — |
| 6 | FTC Enforcement Database | PENDING | — | — |
| 7 | SEC EDGAR Cyber 8-K Filings | PENDING | — | — |
| 8 | California AG Breach DB | PENDING | — | — |
| 10 | Privacy Rights Clearinghouse | PENDING | — | — |
| 13 | ITRC Breach Alert DB | PENDING | — | — |

## Phase 3 — Threat Intelligence Enrichment

| # | Source Name | Status | Spec File | Date Completed |
|---|-----------|--------|-----------|----------------|
| 12 | DataBreaches.net | PENDING | — | — |
| 16 | Exploit-DB | PENDING | — | — |
| 18 | AlienVault OTX | PENDING | — | — |
| 19 | Abuse.ch URLhaus | PENDING | — | — |
| 20 | Abuse.ch MalwareBazaar | PENDING | — | — |
| 23 | AbuseIPDB | PENDING | — | — |
| 26 | CIRCL Threat Intel | PENDING | — | — |

## Phase 4 — Commercial & Advanced Sources

| # | Source Name | Status | Spec File | Date Completed |
|---|-----------|--------|-----------|----------------|
| 17 | VulnDB (vuldb.com) | PENDING | — | — |
| 21 | Shodan | PENDING | — | — |
| 22 | GreyNoise | PENDING | — | — |
| 24 | SecurityTrails | PENDING | — | — |
| 28 | IBM X-Force Exchange | PENDING | — | — |
| 29 | Verizon DBIR | PENDING | — | — |
| 30 | Ponemon/IBM Cost of Breach | PENDING | — | — |
| 31 | Flashpoint (Risk Based Security) | PENDING | — | — |
| 32 | Recorded Future | PENDING | — | — |
| 33 | SecurityScorecard | PENDING | — | — |
| 34 | DeHashed | PENDING | — | — |
| 35 | BreachDirectory / Logoutify | PENDING | — | — |
| 36 | SpyCloud | PENDING | — | — |
| 37 | Enzoic | PENDING | — | — |
| 38 | breach-parse | PENDING | — | — |
| 39 | h8mail | PENDING | — | — |

---

## Run Log

| Date | Source Completed | Notes |
|------|-----------------|-------|
| 2026-03-24 | CISA KEV Catalog | First connector spec. No auth required; direct JSON download with GitHub mirror fallback. |
| 2026-03-25 | Have I Been Pwned (HIBP) | Freemium API. Free `/breaches` endpoint provides full breach catalog; paid key for email lookups. Pwned Passwords API is free/unlimited. Key enrichment gaps: no sector, country, or CVE fields — requires cross-source enrichment. |
| 2026-03-26 | VERIS Community DB (VCDB) | Git-based ingestion (clone + pull). ~9K+ incidents in VERIS JSON schema. Richest structured fields of any source (A4 model: actor, action, asset, attribute). No auth required; GitHub PAT recommended for API rate limits. Key gaps: CVEs/IOCs sparse (<5%), record counts often missing (~60-70% NULL), healthcare sampling bias. Strong cross-enrichment candidate via VCAF→ATT&CK mapping. |
| 2026-03-27 | NIST NVD | Free API key (50 req/30s with key). REST API 2.0 at `services.nvd.nist.gov`. 275K+ CVE records with CVSS v2/v3.1/v4.0 scores, CWE mappings, CPE configurations, and embedded CISA KEV data. Primary enrichment source — no breach data itself; joins to breach records via `cve_id`. Incremental sync via `lastModStartDate`/`lastModEndDate` (120-day max window, 2-hour polling cadence). Key challenges: NVD analysis backlog (many CVEs sit in Awaiting Analysis), CVSS version fragmentation, complex CPE configuration logic. Full Python connector implementation included with retry/backoff. |
| 2026-03-30 | CVE / MITRE | Source of truth for CVE IDs via MITRE's CVE Program. Three access channels: git clone of `cvelistV5` repo (primary, ~250K+ records, 7-min update cadence), CVE Services REST API at `cveawg.mitre.org` (real-time single lookups), and GitHub Releases (hourly/daily zips). No auth for public reads; GitHub PAT recommended. CVE JSON 5.x schema (5.0/5.1/5.2.0) with multi-container architecture (CNA + ADP). Complements NVD — available hours/days earlier but lacks standardized CVSS and CPE enrichment. Key gaps: no sector, country, or breach-impact fields; ~30-40% missing CNA-provided CVSS; free-text vendor/product names need normalization. Full Python connector with git-based delta sync included. |
| 2026-03-31 | MISP (Open Source) | Open-source threat intelligence sharing platform. REST API + PyMISP library. API key auth (per-user). Events contain attributes (200+ IOC types across 16 categories), MISP Objects, Galaxy clusters (ATT&CK, threat actors, malware), Tags/Taxonomies (150+ taxonomies incl. TLP), and Sightings. Key endpoints: `/events/restSearch`, `/attributes/restSearch` with `timestamp`-based delta sync, `limit`/`page` pagination, and `enforceWarninglist` filtering. 30+ default feeds (URLhaus, CIRCL OSINT, Botvrij, etc.). No hard rate limits — instance-dependent. Exports to STIX 2.1, Suricata, Snort, OpenIOC. Key gaps: no native breach-record counts or victim org fields (IOC-centric, not breach-catalog); only ~15-25% of events have sector/country tags; TLP restrictions must be enforced in pipeline; quality varies widely across community contributors. Strong enrichment candidate — CVE attributes join to NVD/KEV, IP attributes to GeoIP, event info to NLP entity extraction. |
| 2026-04-01 | MITRE ATT&CK | **Phase 1 complete.** Global TTP knowledge base — 800+ techniques, 140+ groups, 700+ software across Enterprise/Mobile/ICS domains. Three access channels: GitHub raw download (primary bulk, ~20K STIX objects per domain), TAXII 2.1 server (rate-limited to 10 req/10 min, for single-object lookups), and git clone with pull-based delta sync. No auth required; GitHub PAT recommended. STIX 2.1 format with `stix2` MemoryStore and `mitreattack-python` libraries. Enrichment-only source — no breach records, IOCs, or victim data. Central hub for mapping breaches to adversary behavior via group aliases, technique IDs, and software names. Key gaps: no atomic indicators, sector/country in prose only (NLP needed), quarterly update cadence lags zero-days. Next up: Phase 2 (HHS/OCR Breach Portal). |
| 2026-04-02 | HHS/OCR Breach Portal | **Phase 2 started.** U.S. healthcare-only breach registry ("Wall of Shame") — 6,500+ records back to Oct 2009, ~700 new/year. No API; web scraping required (JSF framework with ViewState). Selenium + BeautifulSoup recommended. Two portal pages: active investigations (`breach_report.jsf`) and archive (`breach_report_hip.jsf`). 9 core fields including entity name, state, covered entity type, individuals affected, submission date, breach type, location, BA involvement, and web description. Archive adds resolution/corrective action details. Key gaps: no CVEs, no IOCs, no incident date (only submission date), no sub-sector granularity, U.S.-only. All records are healthcare sector. Strong cross-enrichment candidate — join to NVD/KEV via entity+date for CVEs, MISP/OTX for IOCs, SEC EDGAR for financial impact. New in Feb 2026: 42 CFR Part 2 SUD breach reports added. Next up: EU GDPR Enforcement Tracker. |
| 2026-04-08 | Australian OAIC Breaches | **Phase 2 continued.** Australia's NDB scheme under Privacy Act 1988. No API — web scraping required (interactive dashboard + half-yearly PDF/HTML reports). ~500–600 notifications per half-year, ~7,500+ cumulative since Feb 2018. Aggregate statistics only (no individual breach records): breach source taxonomy (3-tier: malicious attack/human error/system fault → subcategories → cyber incident types), ANZSIC sector breakdown, PI type categories, individuals-affected brackets, notification timelines. Top sector: Health (19-20%). Ransomware: ~10-12% of notifications. Key gaps: no entity names, no CVEs, no IOCs, no financial impact — purely regulatory/statistical. Strong cross-reference value for AU vs US (HHS/OCR) vs EU (GDPR tracker) jurisdictional comparison. Selenium/BeautifulSoup recommended. Next up: UK ICO Enforcement. |
| 2026-04-08 | MITRE ATT&CK scraper built | `mitre_attack_connector.py` — Live tested: 24,772 STIX objects, 1,757 active records normalized. Full/incremental/lookup modes, relationship graph queries, TAXII fallback. Next scraper: HHS/OCR Breach Portal. |
| 2026-04-09 | HHS/OCR Breach Portal scraper built | `hhs_ocr_connector.py` — requests+BeautifulSoup with optional Selenium fallback. JSF ViewState handling, front-page navigation, "Expand All" column support. Full/incremental/lookup modes. Live tested: 100 records parsed from archive portal, normalization verified. All unit tests passed. Next scraper: EU GDPR Enforcement Tracker. |
| 2026-04-03 | EU GDPR Enforcement Tracker | CMS.Law-maintained database of ~2,800+ GDPR fines totaling ~€5.65B across 31+ EU/EEA countries. No API — web scraping required (Selenium + BeautifulSoup; site uses JS-rendered DataTables). Each record has a permanent ETid. Key fields: ETid, country, authority (DPA), date of decision, fine amount (EUR), controller/processor, quoted GDPR articles, violation type (9 categories), and source link. Filters by country and article. Incremental sync via date-sorted scrape (bi-weekly cadence, ~10-50 new records/month). Key gaps: no records-affected count, no CVEs, no IOCs, no actual incident date (only decision date), sector not always populated. Fine amounts may be "not yet disclosed" or "reprimand" (non-numeric). >70% of cases cite Art. 5, 6, or 32. Strong cross-enrichment candidate — join to HIBP/HHS for breach scale, NVD/KEV for CVEs, SEC EDGAR for financial impact on public companies. Next up: Australian OAIC Breaches. |
