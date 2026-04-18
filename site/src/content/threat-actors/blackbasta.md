---
name: "BlackBasta"
aliases:
  - "GOLD BOMBARD"
affiliation: "Unknown"
motivation: "Financial"
status: "active"
firstSeen: "2022"
lastSeen: "2025"
country: "Unknown"
targetSectors:
  - "Manufacturing"
  - "Transportation"
  - "Healthcare"
  - "Financial Services"
targetGeographies:
  - "North America"
  - "Europe"
  - "Oceania"
tools:
  - "BlackBasta Ransomware"
  - "Qakbot"
  - "Cobalt Strike"
  - "PrintNightmare"
mitreMappings:
  - techniqueId: "T1486"
    techniqueName: "Data Encrypted for Impact"
    tactic: "Impact"
    notes: "Black Basta encrypts victim systems after staging data theft for double extortion."
  - techniqueId: "T1078"
    techniqueName: "Valid Accounts"
    tactic: "Initial Access"
    notes: "Affiliates are frequently observed using purchased or stolen credentials for initial access."
  - techniqueId: "T1490"
    techniqueName: "Inhibit System Recovery"
    tactic: "Impact"
    notes: "Operators delete shadow copies and impair recovery controls before large-scale encryption."
attributionConfidence: "A2"
attributionRationale: "CISA and the FBI describe Black Basta as a major financially motivated ransomware operation. Public reporting consistently notes Russian-speaking criminal ecosystem overlap and possible former Conti personnel, but does not establish a named state sponsor or fully confirmed national base."
reviewStatus: "under_review"
generatedBy: "penfold-bot"
generatedDate: 2026-04-14
tags:
  - "financially-motivated"
  - "cybercrime"
  - "ransomware"
sources:
  - url: "https://www.cisa.gov/news-events/cybersecurity-advisories/aa24-131a"
    publisher: "CISA"
    publisherType: "government"
    reliability: "R1"
    publicationDate: "2024-05-10"
    accessDate: "2026-04-14"
    archived: false
  - url: "https://www.elliptic.co/blog/black-basta-ransomware-tracing-100-million-in-stolen-funds"
    publisher: "Elliptic"
    publisherType: "research"
    reliability: "R2"
    publicationDate: "2023-11-20"
    accessDate: "2026-04-14"
    archived: false
  - url: "https://www.trendmicro.com/vinfo/au/security/news/ransomware-spotlight/ransomware-spotlight-blackbasta"
    publisher: "Trend Micro"
    publisherType: "vendor"
    reliability: "R2"
    publicationDate: "2022-09-26"
    accessDate: "2026-04-18"
    archived: false
---

## Executive Summary
BlackBasta (also tracked as GOLD BOMBARD) is a financially motivated ransomware operation that rose rapidly in 2022 and has remained one of the most operationally dangerous extortion crews since. Public reporting frequently links the group to the broader Conti-era criminal ecosystem, but the safest current framing is a Russian-speaking ransomware operation with strong ecosystem overlap rather than a fully proven successor organization. Black Basta targets large enterprises across manufacturing, healthcare, transportation, and critical infrastructure, relying on data theft plus encryption for leverage.

## Notable Campaigns
- **American Dental Association (ADA) Compromise:** Among the group's early high-profile victims, Black Basta hit the ADA in 2022, disrupting downstream dental practices and leaking internal data after extortion failed.
- **Capita PLC Disruption:** In 2023, Black Basta operators severely disrupted Capita, a major UK outsourcing firm supporting public-sector and critical-service contracts, while stealing sensitive pension and personnel data.
- **Ascension Healthcare Attack (2024):** Security reporting and government advisory timelines place Black Basta around the 2024 Ascension healthcare incident, but public attribution remains reported as assessed or suspected rather than judicially confirmed.

## Technical Capabilities
Black Basta leverages an ecosystem of established initial access brokers. Historically, the operation relied heavily on **Qakbot**-enabled intrusions, then adapted after Qakbot disruption by using alternative loaders, social engineering, and purchased access. Once inside a network, operators move quickly with **Cobalt Strike** and common administrative tooling such as PsExec and WMI. Public reporting also documents use of **PrintNightmare**-style privilege escalation and rapid lateral movement consistent with high-tempo ransomware deployment.

## Attribution
Black Basta operates as a decentralized, financially motivated cybercrime syndicate. While definitive geographic attribution remains limited, U.S. government and private-sector reporting consistently describe the operators as Russian-speaking and note strong operational overlap with former Conti personnel and infrastructure. That overlap is historically important, but it is still better framed as ecosystem continuity than as a completely settled one-to-one successor claim.

## MITRE ATT&CK Profile

**Initial Access**: Valid accounts (T1078), Qakbot-enabled access chains, vulnerability exploitation, and social engineering all appear in public reporting on Black Basta intrusions.

**Execution**: PowerShell (T1059.001), PsExec, and other Windows administration tooling are used to move quickly from foothold to domain-wide deployment.

**Impact**: Data encryption (T1486), shadow copy deletion (T1490), and double-extortion publication on the group's leak site are central parts of the operating model.

## Sources & References
- [CISA: #StopRansomware - Black Basta](https://www.cisa.gov/news-events/cybersecurity-advisories/aa24-131a) -- CISA, 2024-05-10
- [Elliptic: Black Basta Ransomware - Tracing $100 Million in Stolen Funds](https://www.elliptic.co/blog/black-basta-ransomware-tracing-100-million-in-stolen-funds) -- Elliptic, 2023-11-20
- [Trend Micro: Ransomware Spotlight - Black Basta](https://www.trendmicro.com/vinfo/au/security/news/ransomware-spotlight/ransomware-spotlight-blackbasta) -- Trend Micro, 2022-09-26
