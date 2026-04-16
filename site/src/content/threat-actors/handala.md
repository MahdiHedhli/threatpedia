---
name: "Handala"
aliases:
  - "Handala Hack Team"
  - "Handala Group"
affiliation: "Pro-Palestinian Hacktivist"
motivation: "Hacktivism"
status: active
country: "Iran"
firstSeen: "2023"
lastSeen: "2025"
targetSectors:
  - "Government"
  - "Technology"
  - "Critical Infrastructure"
  - "Financial Services"
targetGeographies:
  - "Israel"
  - "United States"
tools:
  - "Wiper malware"
  - "Custom phishing kits"
  - "DDoS tools"
mitreMappings:
  - techniqueId: "T1485"
    techniqueName: "Data Destruction"
    tactic: "Impact"
    notes: "Deploys wiper malware against Israeli targets."
  - techniqueId: "T1566.002"
    techniqueName: "Phishing: Spearphishing Link"
    tactic: "Initial Access"
    notes: "Targets Israeli organizations with phishing campaigns impersonating security updates."
  - techniqueId: "T1491.002"
    techniqueName: "Defacement: External Defacement"
    tactic: "Impact"
    notes: "Conducts website defacements with pro-Palestinian messaging."
attributionConfidence: A4
attributionRationale: "Self-identified hacktivist group with assessed links to Iranian state-sponsored operations based on infrastructure overlap and timing coordination with other Iran-nexus threat actors."
reviewStatus: "draft_ai"
generatedBy: "penfold-bot"
generatedDate: 2026-04-16
tags:
  - "hacktivist"
  - "iran"
  - "pro-palestinian"
  - "wiper"
  - "israel"
sources:
  - url: "https://www.cisa.gov/news-events/cybersecurity-advisories/aa24-290a"
    publisher: "CISA"
    publisherType: government
    reliability: R1
    publicationDate: "2024-10-16"
    accessDate: "2026-04-16"
    archived: false
  - url: "https://www.dni.gov/files/ODNI/documents/assessments/ATA-2024-Unclassified-Report.pdf"
    publisher: "Office of the Director of National Intelligence"
    publisherType: government
    reliability: R1
    publicationDate: "2024-02-05"
    accessDate: "2026-04-16"
    archived: false
  - url: "https://www.sentinelone.com/labs/handala-hacktivism-iran-israel/"
    publisher: "SentinelOne"
    publisherType: vendor
    reliability: R2
    publicationDate: "2024-04-22"
    accessDate: "2026-04-16"
    archived: false
---

## Executive Summary

Handala (named after the Palestinian cartoon character by Naji al-Ali) is a hacktivist group that emerged in late 2023 in the context of the Israel-Hamas conflict. The group claims to conduct operations in support of the Palestinian cause, targeting Israeli organizations and their international partners. Security researchers have identified infrastructure and operational overlaps suggesting coordination with or direction by Iranian state-sponsored threat actors.

Handala operations include data theft and leaking, website defacements, wiper malware deployment, and DDoS attacks against Israeli government and commercial targets. The group amplifies its operations through social media channels, publishing stolen data and claiming credit for disruptions.

## Notable Campaigns

### 2023-2024 -- Anti-Israel Cyber Operations

Following the outbreak of the Israel-Hamas conflict in October 2023, Handala launched sustained cyber operations against Israeli targets including government agencies, technology companies, and critical infrastructure operators. Operations included data theft, wiper malware deployment, and coordinated DDoS attacks.

### 2024 -- Israeli Cybersecurity Company Targeting

Handala claimed to have compromised Israeli cybersecurity firms, stealing and leaking internal data and source code. These operations targeted the cybersecurity supply chain serving Israeli government and military organizations.

## Technical Capabilities

Handala employs a mix of hacktivist and state-level capabilities. The group conducts phishing campaigns impersonating security advisories (including fake CrowdStrike and radar system updates) to deliver wiper malware and backdoors. DDoS attacks use both rented botnet infrastructure and volunteer-based tools.

The group's wiper malware demonstrates a level of sophistication beyond typical hacktivist operations, leading researchers to assess possible Iranian state sponsorship or at minimum, shared tooling with known Iranian APTs.

## Attribution

Handala presents itself as an independent hacktivist group, but multiple security vendors have identified infrastructure and tooling overlaps with known Iranian state-sponsored operations. CISA advisory AA24-290A documented Iranian cyber operations using hacktivist personas, consistent with the pattern of Iranian intelligence using proxy hacktivist groups. The ODNI 2024 Annual Threat Assessment identified Iran as using cyber proxies to target Israel and its allies.

## MITRE ATT&CK Profile

**Initial Access**: Spearphishing links (T1566.002) impersonating security updates and legitimate services.

**Impact**: Data destruction (T1485) via wiper malware, website defacement (T1491.002), and service disruption through DDoS.

**Exfiltration**: Stolen data published on Telegram channels and dark web forums.

## Sources & References

- [CISA: Advisory AA24-290A - Iranian Cyber Operations](https://www.cisa.gov/news-events/cybersecurity-advisories/aa24-290a) -- CISA, 2024-10-16
- [ODNI: 2024 Annual Threat Assessment](https://www.dni.gov/files/ODNI/documents/assessments/ATA-2024-Unclassified-Report.pdf) -- ODNI, 2024-02-05
- [SentinelOne: Handala Hacktivism Analysis](https://www.sentinelone.com/labs/handala-hacktivism-iran-israel/) -- SentinelOne, 2024-04-22
