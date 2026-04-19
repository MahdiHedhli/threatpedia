---
name: "Qilin"
aliases: []
affiliation: "Cybercriminal (ransomware-as-a-service)"
motivation: "Financial / Extortion"
status: active
country: "Unknown"
firstSeen: "2024"
lastSeen: "2026"
targetSectors:
  - "Healthcare"
  - "Government"
  - "Manufacturing"
  - "Transportation"
  - "Professional Services"
targetGeographies:
  - "Global"
  - "Europe"
  - "North America"
tools:
  - "Qilin Windows encryptor"
  - "Qilin Linux/ESXi encryptor"
  - "data leak site"
  - "affiliate negotiation panel"
  - "spam and pressure tooling"
mitreMappings:
  - techniqueId: "T1486"
    techniqueName: "Data Encrypted for Impact"
    tactic: "Impact"
    notes: "Qilin affiliates deploy ransomware as the final coercive phase of double-extortion operations."
  - techniqueId: "T1567.002"
    techniqueName: "Exfiltration Over Web Service: Exfiltration to Cloud Storage"
    tactic: "Exfiltration"
    notes: "Public reporting on Qilin repeatedly describes pre-encryption data theft and leak-site pressure."
  - techniqueId: "T1078"
    techniqueName: "Valid Accounts"
    tactic: "Initial Access"
    notes: "Open-source reporting cites credential abuse, phishing, and exposed remote services among common affiliate entry paths."
  - techniqueId: "T1490"
    techniqueName: "Inhibit System Recovery"
    tactic: "Impact"
    notes: "Qilin tradecraft includes deleting or degrading recovery mechanisms before extortion."
attributionConfidence: A4
attributionRationale: "Qilin is well-documented as a ransomware and extortion brand, but public reporting does not cleanly identify a single national operator set behind every affiliate intrusion. The safest current framing is a Russian-speaking criminal ecosystem with uncertain underlying operator composition."
reviewStatus: "draft_ai"
generatedBy: "dangermouse-bot"
generatedDate: 2026-04-18
tags:
  - "qilin"
  - "ransomware"
  - "raas"
  - "double-extortion"
sources:
  - url: "https://www.guidepointsecurity.com/wp-content/uploads/2026/01/GRIT-2026-Ransomware-and-Cyber-Threat-Report.pdf"
    publisher: "GuidePoint Security GRIT"
    publisherType: research
    reliability: R1
    publicationDate: "2026-01-01"
    accessDate: "2026-04-18"
    archived: false
  - url: "https://www.cybereason.com/blog/threat-alert-qilin-seizes-control"
    publisher: "Cybereason"
    publisherType: vendor
    reliability: R2
    publicationDate: "2025-05-01"
    accessDate: "2026-04-18"
    archived: false
  - url: "https://www.cisecurity.org/insights/blog/qilin-top-ransomware-threat-to-sltts-in-q2-2025"
    publisher: "Center for Internet Security"
    publisherType: research
    reliability: R1
    publicationDate: "2025-09-11"
    accessDate: "2026-04-18"
    archived: false
  - url: "https://www.bleepingcomputer.com/news/security/die-linke-german-political-party-confirms-data-stolen-by-qilin-ransomware/"
    publisher: "BleepingComputer"
    publisherType: media
    reliability: R2
    publicationDate: "2026-04-01"
    accessDate: "2026-04-18"
    archived: false
---

## Executive Summary

Qilin is a ransomware-as-a-service extortion brand that rose sharply in prominence through 2025 and early 2026. Public reporting consistently describes a mature affiliate ecosystem built around double extortion, cross-platform encryptors, a leak site, and an operational model that helps affiliates scale quickly across many victim sectors.

The public record is strong on Qilin as a criminal brand and service offering, but weaker on the identity of the people behind every intrusion carried out in its name. The safest current description is a Russian-speaking cybercriminal ecosystem with active affiliates, not a neatly attributable nation-state front or a single uniform team.

## Operational Model

Qilin follows the familiar ransomware-as-a-service pattern: a core group maintains malware, infrastructure, negotiation tooling, and leak-site operations while affiliates perform the individual break-ins. Public reporting indicates affiliates can retain most of the ransom proceeds, with the platform operators taking a smaller percentage in exchange for access to tooling and extortion infrastructure.

Research published in 2025 and 2026 also described the platform broadening beyond a basic encryptor. Analysts reported features such as cross-platform payload support, data-leak hosting, spam or pressure services, and other negotiation support functions that make the ecosystem resemble a service business as much as a malware family.

## Notable Activity

### 2024 - High-Impact Emergence

Qilin gained wider recognition in 2024 through high-impact attacks including the Synnovis disruption in the United Kingdom, which brought the brand into mainstream ransomware tracking.

### 2025 - Rapid Growth

GuidePoint, CIS, and other reporting described major acceleration in victim volume during 2025, with Qilin becoming one of the most prolific ransomware brands observed in public leak-site monitoring.

### 2026 - Political and Public-Sector Targeting

By early 2026, Qilin-linked activity included high-profile extortion against public-sector and politically sensitive targets, including the Die Linke incident in Germany, showing willingness to operate against organizations where the public fallout exceeds ordinary business disruption.

## Technical Capabilities

Public reporting describes Qilin as maintaining both Windows and Linux or ESXi-capable payloads, along with configurable encryption modes, network propagation features, log-cleaning behavior, and other affiliate-friendly options. Analysts also described tooling intended to pressure victims beyond encryption alone, including leak-site publication workflows and spam or negotiation support.

Affiliate intrusion methods vary, which is typical for a RaaS operation. Open reporting cites phishing, valid-account abuse, exposed remote services, and exploitation of public-facing applications as recurring entry paths. That variation is important: many of the tactics belong to affiliates and access brokers as much as they do to the platform maintainers.

## Victimology & Impact

Qilin's victimology is broad rather than niche. Public reporting places the group across healthcare, government, manufacturing, transportation, and professional services, with global reach and particularly visible impact in Europe and North America. The operational model is designed for both encryption and public data theft, which means even organizations that recover technically can still face legal, regulatory, and reputational damage.

The Die Linke incident illustrates why Qilin matters beyond raw victim counts. When a high-volume criminal extortion brand strikes a political party or public institution, the consequences extend beyond recovery costs into democratic-process risk, source-protection concerns, and broader influence opportunities built on stolen internal data.

## Attribution

The evidence supports calling Qilin a real ransomware and extortion brand, but not confidently assigning a single clean country label to every operator working under it. Some reporting describes the ecosystem as Russian-speaking, and some researchers assess the Qilin brand as a rebrand or successor to Agenda-era activity, yet the public record still stops short of a single, stable operator identity.

That is why this profile keeps the country field at `Unknown` while still acknowledging the Russian-speaking ecosystem context in the narrative. The best-supported public claim is about the criminal service model and its tradecraft, not a neat state or national attribution.

## MITRE ATT&CK Profile

### Impact

T1486 - Data Encrypted for Impact: Encryption remains the core coercive act in Qilin operations.

### Exfiltration

T1567.002 - Exfiltration Over Web Service: Exfiltration to Cloud Storage: Double extortion depends on pre-encryption theft and leak-site pressure.

### Initial Access

T1078 - Valid Accounts: Affiliate reporting repeatedly cites credential abuse and remote access as common entry paths.

### Recovery Inhibition

T1490 - Inhibit System Recovery: Qilin playbooks include degrading recovery mechanisms before ransom pressure escalates.

## Sources & References

- [GuidePoint Security GRIT: 2026 Ransomware and Cyber Threat Report](https://www.guidepointsecurity.com/wp-content/uploads/2026/01/GRIT-2026-Ransomware-and-Cyber-Threat-Report.pdf) -- GuidePoint Security GRIT, 2026-01-01
- [Cybereason: Ransomware Gangs Collapse as Qilin Seizes Control](https://www.cybereason.com/blog/threat-alert-qilin-seizes-control) -- Cybereason, accessed 2026-04-18
- [Center for Internet Security: Qilin Top Ransomware Threat to SLTTs in Q2 2025](https://www.cisecurity.org/insights/blog/qilin-top-ransomware-threat-to-sltts-in-q2-2025) -- Center for Internet Security, 2025-09-11
- [BleepingComputer: Die Linke German Political Party Confirms Data Stolen by Qilin Ransomware](https://www.bleepingcomputer.com/news/security/die-linke-german-political-party-confirms-data-stolen-by-qilin-ransomware/) -- BleepingComputer, 2026-04-01
