---
eventId: TP-2026-0018
title: Vivaticket Ransomware Attack Disrupts European Cultural Institutions
date: 2026-03-02
attackType: Ransomware
severity: high
sector: Retail & Consumer
geography: Europe
threatActor: RansomHouse
attributionConfidence: A4
reviewStatus: draft_ai
confidenceGrade: C
generatedBy: dangermouse-bot
generatedDate: 2026-04-20
cves: []
relatedSlugs:
  - "cegedim-sante-health-breach-2026"
  - "die-linke-qilin-ransomware-2026"
tags:
  - "ransomware"
  - "ransomhouse"
  - "ticketing"
  - "europe"
  - "louvre"
  - "anssi"
sources:
  - url: https://cyber.gouv.fr/actualites/attaque-par-rancongiciel-visant-la-societe-vivaticket
    publisher: ANSSI
    publisherType: government
    reliability: R1
    publicationDate: "2026-03-15"
    accessDate: "2026-04-20"
  - url: https://securityboulevard.com/2026/04/ransomware-attack-on-vivaticket-disrupts-louvre-and-major-european-museums/
    publisher: Security Boulevard
    publisherType: media
    reliability: R2
    publicationDate: "2026-04-05"
  - url: https://cybernews.com/cybercrime/ransomware-attack-on-vivaticket-disrupts-louvre-and-major-european-museums/
    publisher: Cybernews
    publisherType: media
    reliability: R2
    publicationDate: "2026-04-03"
  - url: https://www.techradar.com/pro/security/top-museums-hit-by-apparent-cyberattack-on-vivaticket-louvre-and-other-institutions-affected
    publisher: TechRadar
    publisherType: media
    reliability: R2
    publicationDate: "2026-03-27"
  - url: https://skift.com/2026/03/26/ransomware-attack-hits-ticketing-system-used-by-major-museums-and-theme-parks/
    publisher: Skift
    publisherType: media
    reliability: R2
    publicationDate: "2026-03-26"
  - url: https://www.blackfog.com/the-state-of-ransomware-march-2026/
    publisher: BlackFog
    publisherType: vendor
    reliability: R2
    publicationDate: "2026-03-31"
mitreMappings:
  - techniqueId: T1190
    techniqueName: "Exploit Public-Facing Application"
    tactic: "Initial Access"
  - techniqueId: T1078
    techniqueName: "Valid Accounts"
    tactic: "Privilege Escalation"
  - techniqueId: T1087
    techniqueName: "Account Discovery"
    tactic: "Discovery"
  - techniqueId: T1021
    techniqueName: "Remote Services"
    tactic: "Lateral Movement"
  - techniqueId: T1567
    techniqueName: "Exfiltration Over Web Service"
    tactic: "Exfiltration"
  - techniqueId: T1486
    techniqueName: "Data Encrypted for Impact"
    tactic: "Impact"
  - techniqueId: T1531
    techniqueName: "Account Access Removal"
    tactic: "Impact"
---

## Executive Summary

On March 2, 2026, the RansomHouse ransomware group targeted Vivaticket, a central ticketing platform, causing online ticketing system failures for approximately 3,500 European museums and cultural landmarks. This attack impacted venues such as the Musée du Louvre, Musée d'Orsay, and the Eiffel Tower. Initiated via Vivaticket's French subsidiary Irec SAS, the attackers exfiltrated visitor data before deploying encryption algorithms across the networks, forcing venues into manual paper-based ticketing queues for nearly a month.

## Technical Analysis

RansomHouse executed a lateral supply chain methodology starting from a perimeter configuration hosted by a subsidiary (Irec SAS). After initial ingress targeting legacy web APIs or unpatched remote gateways, the attackers escalated privileges toward the parent network's Active Directory core. During their dwell time, internal monitoring tools were deactivated to permit high-volume data exfiltration directed toward actor-controlled C2 servers, ending in a coordinated deployment of RansomHouse cryptography (VivaCrypt block-encryption routines).

## Attack Chain

### Stage 1: Perimeter Breach
Attackers infiltrated the Irec SAS infrastructure leveraging misconfigurations or legacy perimeter pathways.

### Stage 2: Privilege Escalation
Active Directory configurations were mapped, with administrative tokens harvested from LSASS memory dumps.

### Stage 3: Data Exfiltration
Customer logs containing partial payment indicators, addresses, and ticket histories for approximately 10-15 million European cultural site visitors were offloaded over HTTPS streams.

### Stage 4: Extortion Activation
Mass encryption of primary ticket databases finalized the internal operations, triggering digital ransom notes requesting a €5.2 million payout.

## Impact Assessment

The incident manifested as lines and operational paralysis across Paris and broader European touristic hubs. Approximately 850 million yearly digital tickets pass through this central infrastructure hub; the subsequent 23-day disruption impacted revenue handling capacities. European privacy entities escalated the data breach scope as millions of visitors' geographic routing and partial payment data faced exposure risk, challenging localized GDPR structures and international auditing requirements regarding third-party vendor risk.

## Attribution

RansomHouse claimed responsibility for the event on their dark web leak site. To validate their assertions, the group uploaded samples of the exfiltrated visitor registry and corporate transactional logs. The attribution confidence rests at A4 based on the self-published artifacts tying the group's proprietary VivaCrypt tooling formats correlated by independent cybersecurity investigative bodies. French cyber authorities (ANSSI) coordinated alongside operational vendors verifying the malicious traces.

## Timeline

### 2026-03-02 — Breach Occurs
Ransomware is deployed across the Vivaticket internal infrastructure networks causing failure across ticketing portals. 

### 2026-03-05 — Public Disclosure
Vivaticket publicly discloses the scope of the incident affecting its partner ecosystem.

### 2026-03-10 — RansomHouse Claim
RansomHouse explicitly claims the breach, posting proof-of-concept datasets.

### 2026-03-15 — ANSSI Investigation
French cyber security agency ANSSI assumes incident investigation and recovery facilitation. 

### 2026-03-26 — Recovery
Following environmental scrubbing, ticketing capabilities partially reactivate for marquee partner venues. 

## Remediation & Mitigation

Following the disruption, all parent and subsidiary operational environments were rebuilt from screened backup archives. Legacy credential hierarchies linked between parent vendors and external venues were severed and reset. Culturally critical sites are urged to distribute ticketing dependencies across parallel vendor architectures. Vendor contracts must mandate data minimization frameworks and verified incident-response SLAs ensuring off-line manual contingency systems for 30-day operating parameters. 

## Sources & References

- [ANSSI: Attaque par rancongiciel visant la societe Vivaticket](https://cyber.gouv.fr/actualites/attaque-par-rancongiciel-visant-la-societe-vivaticket) — ANSSI, 2026-03-15
- [Security Boulevard: Ransomware Attack on Vivaticket Disrupts Louvre](https://securityboulevard.com/2026/04/ransomware-attack-on-vivaticket-disrupts-louvre-and-major-european-museums/) — Security Boulevard, 2026-04-05
- [Cybernews: Ransomware attack on Vivaticket](https://cybernews.com/cybercrime/ransomware-attack-on-vivaticket-disrupts-louvre-and-major-european-museums/) — Cybernews, 2026-04-03
- [TechRadar: Top museums hit by apparent cyberattack on Vivaticket](https://www.techradar.com/pro/security/top-museums-hit-by-apparent-cyberattack-on-vivaticket-louvre-and-other-institutions-affected) — TechRadar, 2026-03-27
- [Skift: Ransomware Attack Hits Ticketing System](https://skift.com/2026/03/26/ransomware-attack-hits-ticketing-system-used-by-major-museums-and-theme-parks/) — Skift, 2026-03-26
- [BlackFog: The State of Ransomware March 2026](https://www.blackfog.com/the-state-of-ransomware-march-2026/) — BlackFog, 2026-03-31
