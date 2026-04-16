---
name: "DragonForce"
aliases:
  - "DragonForce Malaysia"
affiliation: "Cybercriminal"
motivation: "Financial / Hacktivism"
status: active
country: "Malaysia"
firstSeen: "2023"
lastSeen: "2025"
targetSectors:
  - "Healthcare"
  - "Retail"
  - "Government"
  - "Manufacturing"
  - "Technology"
targetGeographies:
  - "Global"
  - "United States"
  - "United Kingdom"
  - "Saudi Arabia"
tools:
  - "DragonForce ransomware"
  - "LockBit builder (modified)"
  - "ContiV3 builder (modified)"
  - "SystemBC"
  - "Cobalt Strike"
mitreMappings:
  - techniqueId: "T1486"
    techniqueName: "Data Encrypted for Impact"
    tactic: "Impact"
    notes: "Uses modified LockBit and Conti builders for ransomware deployment."
  - techniqueId: "T1078"
    techniqueName: "Valid Accounts"
    tactic: "Initial Access"
    notes: "Affiliates obtain access through purchased credentials from initial access brokers."
  - techniqueId: "T1021.001"
    techniqueName: "Remote Services: Remote Desktop Protocol"
    tactic: "Lateral Movement"
    notes: "Uses RDP for lateral movement within compromised environments."
attributionConfidence: A3
attributionRationale: "Assessed as Malaysian-origin based on early hacktivist activity and linguistic analysis. Evolved into a RaaS platform. FBI and CISA advisory AA25-071A documented operations."
reviewStatus: "draft_ai"
generatedBy: "penfold-bot"
generatedDate: 2026-04-16
tags:
  - "ransomware"
  - "raas"
  - "dragonforce"
  - "malaysia"
  - "double-extortion"
sources:
  - url: "https://www.cisa.gov/news-events/cybersecurity-advisories/aa25-071a"
    publisher: "CISA"
    publisherType: government
    reliability: R1
    publicationDate: "2025-03-12"
    accessDate: "2026-04-16"
    archived: false
  - url: "https://www.ic3.gov/Media/News/2025/250312.pdf"
    publisher: "FBI"
    publisherType: government
    reliability: R1
    publicationDate: "2025-03-12"
    accessDate: "2026-04-16"
    archived: false
  - url: "https://www.group-ib.com/blog/dragonforce-ransomware/"
    publisher: "Group-IB"
    publisherType: vendor
    reliability: R1
    publicationDate: "2024-11-18"
    accessDate: "2026-04-16"
    archived: false
---

## Executive Summary

DragonForce is a ransomware-as-a-service (RaaS) operation that emerged in 2023, believed to have originated from a Malaysian hacktivist group. The operation evolved from pro-Palestinian hacktivism into a financially motivated ransomware platform, offering affiliates modified versions of leaked LockBit and Conti ransomware builders. DragonForce targets organizations across healthcare, retail, government, and manufacturing sectors worldwide.

By early 2025, DragonForce had claimed responsibility for attacks on over 100 organizations. The group operates a double-extortion model with a Tor-based data leak site. In March 2025, CISA and FBI published a joint advisory (AA25-071A) detailing DragonForce TTPs and providing indicators of compromise.

## Notable Campaigns

### 2025 -- UK Retail Sector Attacks

DragonForce claimed responsibility for attacks against major UK retailers including Marks and Spencer, Co-op, and Harrods in April-May 2025. The M&S attack disrupted online ordering and in-store contactless payment systems for several weeks.

### 2024 -- Healthcare and Government Targeting

The group conducted multiple attacks against healthcare organizations and local government agencies, exfiltrating patient records and government documents.

### 2023 -- Transition from Hacktivism to RaaS

DragonForce transitioned from DDoS attacks and website defacements as part of pro-Palestinian hacktivism (OpsPetir, OpsIsrael) to launching a ransomware affiliate program using leaked ransomware builders.

## Technical Capabilities

DragonForce's ransomware is built on modified versions of leaked LockBit 3.0 and Conti V3 source code. The ransomware supports Windows and Linux/ESXi targets using AES encryption. Affiliates gain initial access through purchased credentials from access brokers, exploitation of VPN vulnerabilities, or phishing.

Post-compromise activities include deployment of SystemBC for tunneling, Cobalt Strike for command and control, and credential harvesting for lateral movement. The group operates a web-based affiliate panel, automated negotiation system, and data leak site.

## Attribution

DragonForce's origins in Malaysian hacktivism are assessed based on early operations, linguistic indicators, and self-identification. The transition to ransomware suggests either an evolution in objectives or adoption of the brand by financially motivated actors. CISA and FBI advisory AA25-071A documents the group's operations without identifying specific individuals.

## MITRE ATT&CK Profile

**Initial Access**: Valid accounts from access brokers (T1078), exploitation of VPN appliances (T1190), and phishing (T1566).

**Lateral Movement**: RDP (T1021.001), SMB/Windows Admin Shares (T1021.002), and PsExec for ransomware distribution.

**Exfiltration**: Data staged and exfiltrated to attacker infrastructure before encryption (T1567.002).

**Impact**: File encryption (T1486), shadow copy deletion (T1490), and backup service disruption.

## Sources & References

- [CISA: Advisory AA25-071A - DragonForce](https://www.cisa.gov/news-events/cybersecurity-advisories/aa25-071a) -- CISA, 2025-03-12
- [FBI: DragonForce Ransomware Indicators](https://www.ic3.gov/Media/News/2025/250312.pdf) -- FBI, 2025-03-12
- [Group-IB: DragonForce Ransomware Analysis](https://www.group-ib.com/blog/dragonforce-ransomware/) -- Group-IB, 2024-11-18
