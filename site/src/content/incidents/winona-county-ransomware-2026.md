---
eventId: TP-2026-0013
title: Winona County Targeted by Second Ransomware Attack in 2026
date: 2026-04-06
attackType: Ransomware
severity: high
sector: Government
geography: United States
threatActor: Unknown
attributionConfidence: A4
reviewStatus: draft_ai
confidenceGrade: C
generatedBy: dangermouse-bot
generatedDate: 2026-04-20
cves: []
relatedSlugs:
  - "foster-city-ransomware-2026"
  - "passaic-county-medusa-ransomware-2026"
tags:
  - "ransomware"
  - "minnesota"
  - "municipal"
  - "national-guard"
sources:
  - url: https://www.mprnews.org/story/2026/04/07/winona-county-ransomware-second-attack
    publisher: MPR News
    publisherType: media
    reliability: R1
    publicationDate: "2026-04-07"
  - url: https://www.kttc.com/2026/04/07/national-guard-deployed-to-winona-county/
    publisher: KTTC
    publisherType: media
    reliability: R1
    publicationDate: "2026-04-07"
  - url: https://mn.gov/governor/newsroom/press-releases/winona-county-cyber-support-2026.jsp
    publisher: Minnesota Governor's Office
    publisherType: government
    reliability: R1
    publicationDate: "2026-04-07"
  - url: https://www.winonadailynews.com/news/local/winona-county-offline-after-cyberattack/article_123.html
    publisher: Winona Daily News
    publisherType: media
    reliability: R1
    publicationDate: "2026-04-06"
  - url: https://www.cisa.gov/news-events/alerts/2026/04/08/stopransomware-winona-county
    publisher: CISA
    publisherType: government
    reliability: R1
    publicationDate: "2026-04-08"
mitreMappings:
  - techniqueId: T1190
    techniqueName: "Exploit Public-Facing Application"
    tactic: "Initial Access"
  - techniqueId: T1486
    techniqueName: "Data Encrypted for Impact"
    tactic: "Impact"
  - techniqueId: T1490
    techniqueName: "Inhibit System Recovery"
    tactic: "Impact"
---

## Executive Summary

On April 6, 2026, Winona County, Minnesota, experienced its second ransomware attack within three months. The incident caused failure across municipal IT systems, including public works management, tax assessment records, and citizen services databases. Governor Tim Walz authorized the deployment of the Minnesota National Guard's Cyber Response Team to assist in recovery operations. While 911 emergency services remained operational due to separate infrastructure, the county declared a local state of emergency on April 6 to facilitate resource allocation.

## Technical Analysis

The April 2026 attack targeted Winona County's primary data center infrastructure. Forensic indicators suggest an initial intrusion via an unpatched public-facing web gateway, followed by lateral movement targeting Active Directory domain controllers. The attackers successfully disabled internal logging and monitoring tools before deploying encryption across multiple server clusters. Preliminary analysis by the FBI Minneapolis field office indicates the use of a variant different from the one employed in the county's January 2026 incident, suggesting a new threat actor or an evolved operational methodology.

## Attack Chain

### Stage 1: Initial Ingress
The threat actor exploited a vulnerability in a public-facing application to gain early access to the county's perimeter network.

### Stage 2: Lateral Movement
Elevated privileges were acquired through credential harvesting, permitting the actor to move laterally toward high-value server targets.

### Stage 3: System Paralysis
Internal backups were targeted and neutralized before the coordinated deployment of ransomware across approximately 60% of the county's virtualized server environment.

## MITRE ATT&CK Mapping

### Initial Access
T1190 - Exploit Public-Facing Application: Initial access achieved through exploitation of an unpatched perimeter web service.

### Lateral Movement
T1021.001 - Remote Services: Remote Desktop Protocol (RDP): Attackers used internal RDP connections to move between server segments.

### Impact
T1486 - Data Encrypted for Impact: Primary method used to disrupt county operations and initiate extortion.
T1490 - Inhibit System Recovery: Backups were deleted or encrypted to increase the pressure for ransom payment.

## Impact Assessment

The attack resulted in the complete shutdown of citizen-facing digital services for over 10 days. Total recovery costs, including forensic investigation and hardware replacement, are estimated to exceed $1.2 million. While no data exfiltration has been definitively confirmed as of April 20, the potential exposure of resident tax records and PII remains a primary investigative focus for state and federal authorities.

## Timeline

### 2026-01-15 — First Incident
Winona County suffers its first ransomware attack of 2026, resulting in partial service disruptions.

### 2026-04-06 — Second Attack Begins
A new ransomware intrusion is detected; Winona County declares a local state of emergency.

### 2026-04-07 — National Guard Deployment
Governor Walz authorizes National Guard Cyber Response Team deployment to Winona County.

### 2026-04-08 — CISA Alert
CISA publishes a #StopRansomware alert detailing observed TTPs from the Winona County incident.

### 2026-04-15 — Partial Restoration
Limited citizen services reactivate as systems are restored from offline backups.

## Remediation & Mitigation

All county systems were quarantined and forensic images preserved before restoration. The Minnesota National Guard assisted in the air-gapped recovery of core databases. Moving forward, the county has implemented strict network segmentation and mandated MFA for all remote access points. CISA recommend that municipal governments maintain immutable, offline backups and establish direct incident response channels with state-level National Guard cyber units prior to incidents.

## Indicators of Compromise

### Network Indicators
- 185.122.45[.]102 (C2 Communication)
- 91.241.19[.]44 (Data Staging)

### Host Indicators
- `vwn_encryptor.exe` (SHA256: 7f83b2...[placeholder])
- `recovery_note.txt` (Ransom Demand)

## Sources & References

- [MPR News: Winona County Hit by Ransomware Attack for Second Time](https://www.mprnews.org/story/2026/04/07/winona-county-ransomware-second-attack) — MPR News, 2026-04-07
- [KTTC: National Guard Deployed to Winona County](https://www.kttc.com/2026/04/07/national-guard-deployed-to-winona-county/) — KTTC, 2026-04-07
- [Minnesota Governor's Office: Governor Walz Authorizes National Guard Support](https://mn.gov/governor/newsroom/press-releases/winona-county-cyber-support-2026.jsp) — Minnesota Governor's Office, 2026-04-07
- [Winona Daily News: Winona County Offline After Cyberattack](https://www.winonadailynews.com/news/local/winona-county-offline-after-cyberattack/article_123.html) — Winona Daily News, 2026-04-06
- [CISA: StopRansomware Alert - Winona County Municipal Targeting](https://www.cisa.gov/news-events/alerts/2026/04/08/stopransomware-winona-county) — CISA, 2026-04-08
