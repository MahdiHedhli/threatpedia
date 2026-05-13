---
name: "Kimsuky"
aliases:
  - "APT43"
  - "Black Banshee"
  - "Velvet Chollima"
  - "Emerald Sleet"
  - "THALLIUM"
  - "TA427"
  - "Springtail"
  - "Earth Kumiho"
  - "PatheticSlug"
affiliation: "North Korea (assessed)"
motivation: "Espionage"
status: active
country: "North Korea"
firstSeen: "2012"
targetSectors:
  - "Government"
  - "Think Tanks"
  - "Research"
  - "Education"
  - "Business Services"
  - "Manufacturing"
  - "Nuclear Energy"
  - "Defense"
targetGeographies:
  - "South Korea"
  - "Japan"
  - "United States"
  - "Europe"
  - "Russia"
tools: []
mitreMappings:
  - techniqueId: "T1566.002"
    techniqueName: "Spearphishing Link"
    tactic: "Initial Access"
    attackVersion: "v19"
    confidence: confirmed
    evidence: "CISA Advisory AA20-301A documents Kimsuky conducting spearphishing operations using malicious links, including login-security-alert-themed lures targeting South Korean, Japanese, and US organizations and individuals."
  - techniqueId: "T1189"
    techniqueName: "Drive-by Compromise"
    tactic: "Initial Access"
    attackVersion: "v19"
    confidence: confirmed
    evidence: "CISA Advisory AA20-301A documents Kimsuky employing watering hole attacks as an initial access vector against think tanks, government agencies, and nuclear-sector targets."
  - techniqueId: "T1583.001"
    techniqueName: "Domains"
    tactic: "Resource Development"
    attackVersion: "v19"
    confidence: confirmed
    evidence: "Mandiant's 2023 APT43 report documents the group registering operational infrastructure domains using stolen personally identifiable information to support spearphishing and credential-collection operations."
  - techniqueId: "T1586.002"
    techniqueName: "Email Accounts"
    tactic: "Resource Development"
    attackVersion: "v19"
    confidence: confirmed
    evidence: "Mandiant's 2023 APT43 report documents APT43 creating fraudulent email personas that impersonate diplomats, defense officials, and subject-matter experts to conduct targeted spearphishing."
  - techniqueId: "T1176"
    techniqueName: "Software Extensions"
    tactic: "Persistence"
    attackVersion: "v19"
    confidence: confirmed
    evidence: "CISA Advisory AA20-301A explicitly documents Kimsuky deploying malicious browser extensions against targets as part of its initial access and collection tradecraft."
attributionConfidence: A2
attributionRationale: "CISA, FBI, and US Cyber Command jointly attributed Kimsuky to North Korea in Advisory AA20-301A (2020). Mandiant assesses APT43 collection priorities as aligning with the Reconnaissance General Bureau. MITRE ATT&CK documents Kimsuky (G0094) as a DPRK-based group active since at least 2012. Alias boundaries remain vendor-scoped and should not be merged into Lazarus/APT38 without source support."
reviewStatus: "draft_ai"
generatedBy: "dangermouse-bot"
generatedDate: 2026-05-13
tags:
  - "nation-state"
  - "north-korea"
  - "dprk"
  - "espionage"
  - "kimsuky"
  - "apt43"
  - "korean-peninsula"
  - "nuclear"
sources:
  - url: "https://attack.mitre.org/groups/G0094/"
    publisher: "MITRE ATT&CK"
    publisherType: research
    reliability: R1
    publicationDate: "2026-04-23"
    accessDate: "2026-05-13"
    archived: false
  - url: "https://www.cisa.gov/news-events/cybersecurity-advisories/aa20-301a"
    publisher: "CISA"
    publisherType: government
    reliability: R1
    publicationDate: "2020-10-27"
    accessDate: "2026-05-13"
    archived: false
  - url: "https://cloud.google.com/blog/topics/threat-intelligence/apt43-north-korea-cybercrime-espionage/"
    publisher: "Mandiant"
    publisherType: vendor
    reliability: R1
    publicationDate: "2023-03-28"
    accessDate: "2026-05-13"
    archived: false
---

## Executive Summary

Kimsuky, also tracked as APT43 and under numerous designations including Black Banshee, Velvet Chollima, Emerald Sleet, and THALLIUM, is a North Korean cyber espionage group active since at least 2012. A joint advisory from CISA, the FBI, and US Cyber Command assesses Kimsuky as conducting global intelligence-gathering operations for the North Korean regime, with collection priorities centered on foreign policy and national security issues related to the Korean Peninsula, nuclear policy, and international sanctions.

Targets span South Korean and Japanese government agencies, think tanks, nuclear power operators, educational institutions, and defense-related organizations, extending to entities in the United States, Russia, and Europe. Mandiant assesses APT43's collection priorities as aligning with the Reconnaissance General Bureau (RGB), North Korea's primary foreign intelligence service. A documented distinguishing characteristic is the group's use of cryptocurrency theft and laundering to self-fund espionage infrastructure — a financial model that partially decouples operational tempo from centrally allocated resources.

## Notable Campaigns

### 2012–2020 — Korean Peninsula Intelligence Collection

CISA Advisory AA20-301A documents sustained Kimsuky targeting of South Korean government entities including the Ministry of Unification, think tanks focused on Korean Peninsula policy, nuclear power operators, and defense-related organizations. Operations used spearphishing links, login-security-alert-themed credential harvesting, watering hole attacks, torrent sharing sites, and malicious browser extensions to achieve initial access. Targeting expanded over time to include organizations and individuals in Japan and the United States, reflecting Kimsuky's broadening remit for foreign policy and nuclear intelligence collection.

### 2018–2023 — Espionage Supported by Cryptocurrency Operations

Mandiant tracked APT43 activity from at least 2018 through its 2023 reporting, documenting that the group steals and launders sufficient cryptocurrency to purchase operational infrastructure. APT43 uses hash rental and cloud mining services to convert stolen cryptocurrency into clean funds, removing blockchain traceability from stolen proceeds to infrastructure acquisition. Throughout this period the group conducted credential-collection and intelligence operations against government, education, manufacturing, research, and business services organizations in South Korea, Japan, Europe, and the United States, with targeting aligned to geopolitical and nuclear policy priorities.

## Technical Capabilities

Kimsuky's initial access tradecraft relies on spearphishing and social engineering. CISA Advisory AA20-301A documents use of spearphishing links, login-security-alert-themed lures designed to harvest credentials, watering hole attacks against sites frequented by target communities, torrent sharing sites as delivery vectors, and malicious browser extensions installed on victim machines.

Mandiant characterizes APT43 as operating a persona-based deception infrastructure. The group creates spoofed and fraudulent identities that masquerade as diplomats, defense officials, and subject-matter experts to gain target trust before delivering malicious content or harvesting credentials. Mandiant reports APT43 uses stolen personally identifiable information to register infrastructure domains and create accounts, reducing direct attribution linkage between actors and infrastructure.

The group funds its operational infrastructure through cryptocurrency theft and laundering. Mandiant reports APT43 uses hash rental and cloud mining to launder stolen cryptocurrency, acquiring operationally clean funds that sever the blockchain trail from theft to infrastructure purchase. This criminal self-funding model is a documented differentiator relative to other DPRK intrusion clusters.

## Attribution

CISA Advisory AA20-301A, a joint publication by CISA, the FBI, and US Cyber Command issued on 2020-10-27, attributes Kimsuky to North Korean state sponsorship and characterizes the group as conducting global intelligence gathering in support of North Korean government objectives. The advisory documents Kimsuky's operational focus on Korean Peninsula foreign policy, nuclear policy, and sanctions-related intelligence.

Mandiant independently assesses that APT43's collection priorities align with the Reconnaissance General Bureau, the North Korean agency responsible for foreign intelligence, based on its 2023 reporting covering group activity from at least 2018.

MITRE ATT&CK documents Kimsuky as G0094, a DPRK-based group active since at least 2012, and notes overlap with other North Korean state-sponsored cyber espionage actors. MITRE further notes that some researchers consolidate DPRK activity under the Lazarus Group label. For analytical clarity, Kimsuky/APT43 should be treated as a distinct cluster from Lazarus Group and APT38 (Bluenoroff). Attribution of activity to Kimsuky rather than Lazarus Group or APT38 should rest on documented indicators specific to each cluster rather than the broader DPRK umbrella.

## MITRE ATT&CK Profile

T1583.001 - Domains: APT43 registers operational domains using stolen personally identifiable information. T1586.002 - Email Accounts: APT43 creates fraudulent email accounts with spoofed personas impersonating diplomats and defense officials. Infrastructure acquisition is partially funded through stolen and laundered cryptocurrency, providing a degree of operational self-sufficiency.

T1566.002 - Spearphishing Link: Spearphishing links are a primary documented vector, including login-security-alert-themed lures used to harvest credentials from government, think-tank, and nuclear-sector targets across South Korea, Japan, and the United States. T1189 - Drive-by Compromise: Watering hole attacks provide a secondary initial access path against communities of interest.

T1176 - Software Extensions: CISA documents deployment of malicious browser extensions on victim machines, enabling persistent access and collection within browser sessions after initial compromise.

## Sources & References

- [MITRE ATT&CK: Kimsuky (G0094)](https://attack.mitre.org/groups/G0094/) — MITRE ATT&CK, 2026-04-23
- [CISA: Advisory AA20-301A — Kimsuky](https://www.cisa.gov/news-events/cybersecurity-advisories/aa20-301a) — CISA, 2020-10-27
- [Mandiant: APT43 — North Korean Group Uses Cybercrime to Fund Espionage Operations](https://cloud.google.com/blog/topics/threat-intelligence/apt43-north-korea-cybercrime-espionage/) — Mandiant, 2023-03-28
