---
name: "DragonForce"
aliases:
  - "DragonForce Malaysia"
affiliation: "Cybercriminal"
motivation: "Financial / Extortion"
status: active
country: "Unknown"
firstSeen: "2023"
lastSeen: "2026"
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
    notes: "Uses modified LockBit and Conti-derived ransomware builders for extortion operations."
  - techniqueId: "T1078"
    techniqueName: "Valid Accounts"
    tactic: "Initial Access"
    notes: "Affiliates repeatedly obtain access through compromised credentials and access-broker sourced accounts."
  - techniqueId: "T1021.001"
    techniqueName: "Remote Services: Remote Desktop Protocol"
    tactic: "Lateral Movement"
    notes: "RDP access and remote administration remain common movement paths in DragonForce intrusions."
attributionConfidence: A3
attributionRationale: "Public reporting supports DragonForce as an active ransomware and extortion brand with historical Malaysian-linked hacktivist branding, but the current operator base and affiliate composition remain unsettled."
reviewStatus: "under_review"
generatedBy: "penfold-bot"
generatedDate: 2026-04-16
tags:
  - "ransomware"
  - "raas"
  - "dragonforce"
  - "double-extortion"
sources:
  - url: "https://www.group-ib.com/blog/dragonforce-ransomware/"
    publisher: "Group-IB"
    publisherType: vendor
    reliability: R1
    publicationDate: "2024-11-18"
    accessDate: "2026-04-18"
    archived: false
  - url: "https://www.darktrace.com/blog/tracking-a-dragon-investigating-a-dragonforce-affiliated-ransomware-attack-with-darktrace"
    publisher: "Darktrace"
    publisherType: vendor
    reliability: R2
    publicationDate: "2026-04-08"
    accessDate: "2026-04-18"
    archived: false
  - url: "https://www.ransomware.live/group/dragonforce"
    publisher: "Ransomware.live"
    publisherType: research
    reliability: R2
    publicationDate: "2026-04-08"
    accessDate: "2026-04-18"
    archived: false
---

## Executive Summary

DragonForce is a ransomware and extortion brand that emerged in 2023 and later matured into a ransomware-as-a-service (RaaS) operation. Public reporting links the name to early Malaysian-linked hacktivist branding, but current reporting more strongly supports a financially motivated affiliate ecosystem using the DragonForce brand for double-extortion operations. The group has been observed using modified builders derived from leaked LockBit and Conti code while targeting organizations across healthcare, retail, government, manufacturing, and technology sectors.

By 2025-2026, DragonForce had become a recurring leak-site and extortion presence in multi-sector ransomware reporting. Publicly documented incidents and vendor tracking show a consistent double-extortion model, affiliate-style operations, and repeated use of commodity post-exploitation tooling alongside custom ransomware payloads.

## Notable Campaigns

### 2025 -- UK Retail Sector Attacks

DragonForce-branded extortion activity was publicly linked to disruptive attacks affecting major UK retailers including Marks & Spencer, Co-op, and Harrods in April-May 2025. The M&S intrusion caused weeks of disruption to online ordering and payment systems.

### 2024 -- Healthcare and Government Targeting

The group was repeatedly observed in healthcare and public-sector incidents, combining data theft with leak-site pressure and ransomware deployment.

### 2023 -- Transition from Hacktivist Branding to RaaS

Early DragonForce branding was associated with hacktivist and defacement activity, but reporting through 2024-2026 shows the name functioning primarily as a financially motivated extortion and ransomware program.

## Technical Capabilities

DragonForce tooling has been described as drawing on leaked LockBit 3.0 and Conti V3 code, enabling fast repackaging for affiliate operations. Reporting describes Windows and Linux/ESXi targeting, AES-based encryption, and recurring use of common intrusion paths such as purchased credentials, VPN edge-device exploitation, and phishing.

Post-compromise activity includes deployment of SystemBC for tunneling, Cobalt Strike for command-and-control and lateral movement support, and routine credential theft before encryption. DragonForce also maintains a leak portal and extortion workflow consistent with a mature affiliate program.

## Attribution

The safest public framing is that DragonForce has historical Malaysian-linked branding but is now best understood as a ransomware and extortion brand with uncertain underlying operator composition. Current reporting does not publicly identify individual operators, and the strongest evidence supports the existence of the DragonForce brand and its tactics more than a clean, single-country operator model.

## MITRE ATT&CK Profile

**Initial Access**: Valid accounts from access brokers (T1078), exploitation of internet-facing systems (T1190), and phishing (T1566).

**Lateral Movement**: RDP (T1021.001), SMB or Windows Admin Shares (T1021.002), and common administrator tooling are used to spread through victim environments.

**Exfiltration**: Data is staged and exfiltrated to attacker infrastructure before encryption and extortion (T1567.002).

**Impact**: File encryption (T1486), shadow copy deletion (T1490), and leak-site extortion are central to DragonForce operations.

## Sources & References

- [Group-IB: DragonForce Ransomware Analysis](https://www.group-ib.com/blog/dragonforce-ransomware/) -- Group-IB, 2024-11-18
- [Darktrace: Tracking a Dragon — Investigating a DragonForce-Affiliated Ransomware Attack](https://www.darktrace.com/blog/tracking-a-dragon-investigating-a-dragonforce-affiliated-ransomware-attack-with-darktrace) -- Darktrace, 2026-04-08
- [Ransomware.live: DragonForce Ransomware Group Profile](https://www.ransomware.live/group/dragonforce) -- Ransomware.live, 2026-04-08
