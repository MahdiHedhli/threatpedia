---
name: "RansomHouse"
aliases:
  - "Jolly Scorpius"
affiliation: "Cybercriminal"
motivation: "Financial"
status: active
country: "Unknown"
firstSeen: "2021"
lastSeen: "2026"
targetSectors:
  - "Healthcare"
  - "Manufacturing"
  - "Education"
  - "Financial Services"
  - "Government"
  - "Entertainment / Cultural Heritage"
targetGeographies:
  - "Global"
  - "North America"
  - "Europe"
  - "APAC"
tools:
  - "MarioLocker"
  - "MrAgent"
mitreMappings:
  - techniqueId: "T1078"
    techniqueName: "Valid Accounts"
    tactic: "Initial Access"
    notes: "RansomHouse operations frequently leverage compromised credentials and access-brokered footholds."
  - techniqueId: "T1021.004"
    techniqueName: "Remote Services: SSH"
    tactic: "Lateral Movement"
    notes: "Recent RansomHouse tooling has targeted VMware ESXi environments over SSH for post-compromise operations."
  - techniqueId: "T1562.004"
    techniqueName: "Impair Defenses: Disable or Modify System Firewall"
    tactic: "Defense Evasion"
    notes: "MrAgent capability descriptions include ESXi firewall manipulation to ease ransomware deployment."
  - techniqueId: "T1567"
    techniqueName: "Exfiltration Over Web Service"
    tactic: "Exfiltration"
    notes: "RansomHouse couples data theft with extortion and public leak-site pressure."
  - techniqueId: "T1486"
    techniqueName: "Data Encrypted for Impact"
    tactic: "Impact"
    notes: "The operation evolved from pure extortion into double-extortion campaigns with MarioLocker encryption."
attributionConfidence: A4
attributionRationale: "Tracked by Palo Alto Unit 42 as Jolly Scorpius / RansomHouse, but no public indictments tie named individuals to the full operation at review time."
reviewStatus: "under_review"
generatedBy: "incident-crosslink-gapfill"
generatedDate: 2026-04-18
tags:
  - "ransomhouse"
  - "jolly-scorpius"
  - "ransomware"
  - "raas"
  - "double-extortion"
  - "mariolocker"
  - "mragent"
sources:
  - url: "https://unit42.paloaltonetworks.com/ransomhouse-encryption-upgrade/"
    publisher: "Palo Alto Unit 42"
    publisherType: "vendor"
    reliability: "R1"
    publicationDate: "2025-12-17"
    accessDate: "2026-04-18"
    archived: false
  - url: "https://www.bleepingcomputer.com/news/security/ransomhouse-upgrades-encryption-with-multi-layered-data-processing/"
    publisher: "BleepingComputer"
    publisherType: "media"
    reliability: "R2"
    publicationDate: "2025-12-20"
    accessDate: "2026-04-18"
    archived: false
  - url: "https://www.techradar.com/pro/security/top-museums-hit-by-apparent-cyberattack-on-vivaticket-louvre-and-other-institutions-affected"
    publisher: "TechRadar"
    publisherType: "media"
    reliability: "R2"
    publicationDate: "2026-04-06"
    accessDate: "2026-04-18"
    archived: false
---

## Executive Summary

RansomHouse is a financially motivated extortion and ransomware operation active since late 2021. The group initially gained attention for theft-and-extortion activity without always encrypting victim systems, then evolved into a more conventional double-extortion model that pairs data theft with encryption and leak-site pressure. Palo Alto Unit 42 tracks the operation as Jolly Scorpius and described a substantial tooling upgrade in late 2025 centered on the MarioLocker encryptor and MrAgent deployment framework.

By 2026, RansomHouse activity had affected healthcare, manufacturing, education, financial services, government, and cultural infrastructure. The group’s operations are notable less for a single signature intrusion vector than for consistent post-compromise behavior: credential abuse, lateral movement into virtualization environments, large-scale data theft, and pressure campaigns through public leak infrastructure.

## Notable Campaigns

### 2026 -- Vivaticket Cultural Infrastructure Disruption

RansomHouse claimed responsibility for the Vivaticket incident that disrupted ticketing and reservation operations across major European museums and cultural sites, including high-profile institutions in France. Public reporting tied the operation to double-extortion pressure and significant operational disruption across a wide downstream venue network.

### 2025 -- MarioLocker Upgrade

Unit 42 documented a major upgrade in the operation’s encryption tooling in late 2025. The refreshed MarioLocker variant moved away from simpler linear encryption toward a more complex dual-key process designed to frustrate backup recovery and increase operational leverage over victims.

## Technical Capabilities

Recent reporting ties RansomHouse activity to a combination of data-extortion tradecraft and modern ransomware deployment practices. The operation has been observed targeting VMware ESXi infrastructure, using MrAgent for host enumeration and command execution, and pairing encryption with pre-impact data theft. Public analysis also describes firewall manipulation, credential abuse, and the use of SSH or other remote-management channels after initial compromise.

RansomHouse does not appear to rely on a single stable initial-access method across all cases. Instead, reporting and victim patterns are more consistent with an affiliate or access-broker model in which footholds are obtained through compromised credentials, vulnerable public-facing services, phishing, or third-party access. That ambiguity is why the group is best understood as an extortion operation with a recognizable post-compromise toolkit, rather than as a cluster defined by one exploit chain.

## Historical Context

RansomHouse publicly styled itself as a group exposing weak security, but the operational pattern is extortion, not benevolent disclosure. The operation’s history shows an evolution from leak-site coercion toward broader ransomware enablement while preserving the same core pressure model: steal data, disrupt recovery, and use controlled disclosure to force negotiations.

Public attribution remains moderate rather than confirmed at the individual-operator level. The brand, tooling, and leak-site activity are well documented, but named public defendants or government indictments tying the full operation to specific individuals were not available at review time.

## MITRE ATT&CK Profile

**Initial Access**: Valid Accounts (T1078), public-facing service compromise, and access-brokered footholds.

**Lateral Movement**: Remote Services: SSH (T1021.004), especially against virtualization infrastructure.

**Exfiltration**: Exfiltration Over Web Service (T1567) before extortion.

**Impact**: Data Encrypted for Impact (T1486) and disable-or-modify defensive controls such as firewalls (T1562.004).

## Sources & References

- [Palo Alto Unit 42: From Linear to Complex -- An Upgrade in RansomHouse Encryption](https://unit42.paloaltonetworks.com/ransomhouse-encryption-upgrade/) -- Palo Alto Unit 42, 2025-12-17
- [BleepingComputer: RansomHouse upgrades encryption with multi-layered data processing](https://www.bleepingcomputer.com/news/security/ransomhouse-upgrades-encryption-with-multi-layered-data-processing/) -- BleepingComputer, 2025-12-20
- [TechRadar: Top museums hit by apparent cyberattack on Vivaticket](https://www.techradar.com/pro/security/top-museums-hit-by-apparent-cyberattack-on-vivaticket-louvre-and-other-institutions-affected) -- TechRadar, 2026-04-06
