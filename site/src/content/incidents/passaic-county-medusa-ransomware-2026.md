---
eventId: TP-2026-0033
title: Passaic County Ransomware Attack by Medusa Group
date: 2026-03-04
attackType: ransomware
severity: high
sector: Government
geography: United States
threatActor: Medusa
attributionConfidence: A4
reviewStatus: under_review
confidenceGrade: C
generatedBy: penfold-bot
generatedDate: 2026-04-20
cves: []
relatedSlugs:
  - "die-linke-qilin-ransomware-2026"
  - "ummc-medusa-ransomware-2026"
  - "winona-county-ransomware-2026"
tags:
  - "ransomware"
  - "medusa"
  - "government"
  - "municipal"
  - "double-extortion"
  - "new-jersey"
sources:
  - url: https://www.comparitech.com/news/cybercriminals-say-they-hacked-passaic-county-nj-and-demand-ransom/
    publisher: Comparitech
    publisherType: vendor
    reliability: R2
    publicationDate: "2026-03-17"
  - url: https://therecord.media/medusa-ransomware-mississippi-cyber
    publisher: Recorded Future News
    publisherType: media
    reliability: R2
    publicationDate: "2026-03-17"
  - url: https://www.scworld.com/brief/medusa-ransomware-purportedly-hits-university-of-mississippi-medical-center-new-jersey-county
    publisher: SC Media
    publisherType: media
    reliability: R2
    publicationDate: "2026-03-18"
  - url: https://www.cisa.gov/news-events/cybersecurity-advisories/aa25-071a
    publisher: CISA
    publisherType: government
    reliability: R1
    publicationDate: "2025-03-12"
mitreMappings:
  - techniqueId: T1190
    techniqueName: "Exploit Public-Facing Application"
    tactic: Initial Access
  - techniqueId: T1486
    techniqueName: "Data Encrypted for Impact"
    tactic: Impact
  - techniqueId: T1021
    techniqueName: "Remote Services"
    tactic: Lateral Movement
  - techniqueId: T1048
    techniqueName: "Exfiltration Over Alternative Protocol"
    tactic: Exfiltration
  - techniqueId: T1489
    techniqueName: "Service Stop"
    tactic: Impact
  - techniqueId: T1529
    techniqueName: "System Shutdown/Reboot"
    tactic: Impact
---

## Summary

On March 4, 2026, Passaic County, New Jersey — a government entity serving nearly 600,000 residents — disclosed a ransomware attack that disrupted county IT systems and telephone infrastructure. In mid-March, the Medusa ransomware group posted Passaic County on their data leak site, claiming responsibility, demanding an $800,000 ransom, and posting sample documents as proof of data exfiltration. The attack caused sustained service disruptions affecting county operations and citizen services throughout March and into April.

## Technical Analysis

Medusa is a Ransomware-as-a-Service (RaaS) group that conducts double-extortion campaigns against municipal and healthcare infrastructure. While the explicit initial access vector for Passaic County remains unconfirmed, Medusa leverages unpatched remote access protocols, VPN appliances, or public-facing applications (T1190). They are recorded as capable of moving from initial network foothold to full domain encryption and exfiltration within a 24-hour cycle. In this incident, local file shares and active directory structures were encrypted, affecting internal communications and phone lines county-wide.

## Attack Chain

### Stage 1: Initial Compromise

Attackers likely gained access via exploited perimeter devices or compromised remote access portals.

### Stage 2: Lateral Escalation

Attackers moved laterally to discover unsegmented network components linking VoIP systems and core IT servers.

### Stage 3: Data Exfiltration

Prior to initiating malicious encryption, sensitive directories (containing employee and citizen documents) were bundled and exfiltrated to Medusa command infrastructure.

### Stage 4: Extortion & Impact

Systems were forcibly encrypted or shut down, severing internal services. A public extortion loop was then initiated on the open web demanding $800,000.

## Impact Assessment

The incident disrupted digital communication across Passaic County structures. Phone utility was disabled, affecting general administration, building permitting, localized licensing, and tax assessment queries. While 911 services typically reside on segmented systems, general municipal continuity was suspended. The release of sample documents by the hackers creates a data exposition risk affecting an undisclosed portion of the 600,000 regional constituency. The potential PII spillage demands regulatory audit reporting.

## Attribution

Medusa claimed the attack via their data leak portal, providing stolen data samples referencing the county. Based on their standard public escalation format, the correlation is high. Historically, Passaic has remained reticent regarding verifying the Medusa designation, citing ongoing investigations.

## Timeline

### 2026-03-04 — Event

Passaic County issues an official public notice announcing a cyberattack directly degrading all primary phone and centralized IT systems.

### 2026-03-15 — Event

Medusa ransomware operators list Passaic County on their extortion leak site, publishing document proofs alongside an $800,000 payment demand deadline.

### 2026-03-17 — Event

National cybersecurity monitors and specialized media begin tracking the prolonged outage as part of a wider municipal targeting campaign by the Medusa syndicate.

## Remediation & Mitigation

Initial mitigation relied upon total network isolation and engaging digital forensic incident response (DFIR) specialists and federal authorities. Preventative countermeasures necessary for municipalities of this tier strongly require replacing legacy remote administration with strict Zero Trust access patterns mandating Multi-Factor Authentication (MFA). Furthermore, municipalities must separate infrastructural layers (like VoIP) completely away from traditional data housing networks and actively test offline immutable backup parity.

## Sources & References

- [Comparitech: Passaic County NJ Ransomware Attack](https://www.comparitech.com/news/cybercriminals-say-they-hacked-passaic-county-nj-and-demand-ransom/) — Comparitech, 2026-03-17
- [Recorded Future News: Medusa hits New Jersey county](https://therecord.media/medusa-ransomware-mississippi-cyber) — Recorded Future News, 2026-03-17
- [SC Media: Medusa ransomware purportedly hits New Jersey county](https://www.scworld.com/brief/medusa-ransomware-purportedly-hits-university-of-mississippi-medical-center-new-jersey-county) — SC Media, 2026-03-18
- [CISA: Medusa Ransomware Advisory](https://www.cisa.gov/news-events/cybersecurity-advisories/aa25-071a) — CISA, 2025-03-12
