---
eventId: "TP-2026-0051"
title: "DragonForce Ransomware Group Multi-Sector Campaign — April 2026"
date: 2026-04-08
attackType: "Ransomware"
severity: high
sector: "Multi-Sector"
geography: "Global"
threatActor: "DragonForce"
attributionConfidence: A3
reviewStatus: "under_review"
confidenceGrade: C
generatedBy: "dangermouse-bot"
generatedDate: 2026-04-16
cves: []
relatedSlugs:
  - "die-linke-qilin-ransomware-2026"
tags:
  - "ransomware"
  - "dragonforce"
  - "raas"
  - "double-extortion"
  - "manufacturing"
  - "hospitality"
  - "utilities"
  - "data-exfiltration"
sources:
  - url: "https://www.cisa.gov/stopransomware"
    publisher: "CISA"
    publisherType: government
    reliability: R1
    publicationDate: "2026-04-09"
    accessDate: "2026-04-16"
    archived: false
  - url: "https://www.darktrace.com/blog/tracking-a-dragon-investigating-a-dragonforce-affiliated-ransomware-attack-with-darktrace"
    publisher: "Darktrace"
    publisherType: vendor
    reliability: R2
    publicationDate: "2026-04-08"
    accessDate: "2026-04-16"
    archived: false
  - url: "https://www.ransomware.live/group/dragonforce"
    publisher: "Ransomware.live"
    publisherType: research
    reliability: R2
    publicationDate: "2026-04-08"
    accessDate: "2026-04-16"
    archived: false
  - url: "https://www.dexpose.io/dragonforce-strikes-at-packaging-in-latest-ransomware-attack/"
    publisher: "DeXpose"
    publisherType: research
    reliability: R2
    publicationDate: "2026-04-07"
    accessDate: "2026-04-16"
    archived: false
  - url: "https://www.hendryadrian.com/dragonforce-breaches-asmar-sutex-bunch-klean-northstar-acme-j-brand-ces-singita-atpkg-congoleum-greenway-fhw/"
    publisher: "HendryAdrian"
    publisherType: research
    reliability: R3
    publicationDate: "2026-04-07"
    accessDate: "2026-04-16"
    archived: false
mitreMappings:
  - techniqueId: "T1486"
    techniqueName: "Data Encrypted for Impact"
    tactic: "Impact"
    notes: "Ransomware encryption deployed across 13 victim organizations in coordinated campaign."
  - techniqueId: "T1567"
    techniqueName: "Exfiltration Over Web Service"
    tactic: "Exfiltration"
    notes: "Large-scale data exfiltration prior to encryption, with individual victims losing over 1 TB."
  - techniqueId: "T1490"
    techniqueName: "Inhibit System Recovery"
    tactic: "Impact"
    notes: "System recovery mechanisms disabled to prevent restoration without ransom payment."
  - techniqueId: "T1078"
    techniqueName: "Valid Accounts"
    tactic: "Initial Access"
    notes: "Initial access via compromised credentials obtained through credential stuffing or dark web purchases."
---

## Executive Summary

Between April 2-7, 2026, the DragonForce ransomware-as-a-service (RaaS) platform claimed responsibility for a coordinated multi-sector campaign targeting 13 organizations spanning manufacturing, packaging, hospitality, utilities, and legal sectors. The campaign represents an escalation in both targeting breadth and claimed data exfiltration volume, with individual victims reportedly losing over 1 terabyte of sensitive business and personal information.

Key confirmed victim AT Packaging (atpkg.com) reported a breach discovered on April 7, 2026. DragonForce claims have been corroborated by multiple threat intelligence sources tracking the group's dark web presence. The campaign employs a double-extortion model: encrypting victim systems while simultaneously threatening to publish exfiltrated data on DragonForce's leak portal if ransom demands are not met.

DragonForce evolved from historically documented Malaysian hacktivist origins into a financially motivated, professionally operated RaaS platform. The group operates with clear operational security practices, victim communication protocols, and affiliate onboarding procedures consistent with mature cybercriminal enterprises.

## Technical Analysis

Based on Darktrace analysis and industry correlation, DragonForce campaigns follow multi-stage intrusion patterns. Initial access is achieved through exploitation of unpatched systems, phishing campaigns targeting IT or administrative personnel, or compromised credentials obtained via credential stuffing or dark web purchases. The attackers establish persistence through backdoors, web shells, or scheduled task implants.

Lateral movement across internal networks targets high-value systems including databases, file servers, and domain controllers. Local privilege escalation vulnerabilities or token impersonation are used to obtain system or domain administrator privileges. Large-scale data collection and exfiltration occurs via web shells, command-and-control infrastructure, or cloud storage service abuse, followed by ransomware payload execution encrypting all accessible file systems.

Confirmed victims include AT Packaging, Asmar, SUTEX, Bunch, Klean, Northstar, Acme, J Brand (claimed 1 TB-plus data exfiltration), CES, Singita, Congoleum, Greenway, and FHW. Claimed exfiltration totals range from single-digit gigabytes to over 1 terabyte per victim.

## Attack Chain

### Stage 1: Reconnaissance

DragonForce affiliates conduct passive intelligence gathering on target organizations, identifying network architecture, security controls, and key business systems.

### Stage 2: Initial Access

Exploitation of unpatched systems, phishing campaigns, or compromised credentials used to gain initial foothold in target networks.

### Stage 3: Persistence and Lateral Movement

Installation of persistence mechanisms followed by internal reconnaissance, privilege escalation, and movement to high-value targets.

### Stage 4: Data Exfiltration

Large-scale data collection and exfiltration across all 13 target organizations via web shells, C2 infrastructure, or cloud storage abuse.

### Stage 5: Ransomware Deployment

Ransomware payload execution encrypts business-critical file systems, followed by ransom demand and threatened data publication.

## Impact Assessment

Direct impacts on victim organizations include operational disruption from encryption of business-critical systems, exposure of sensitive business and personal data, financial losses from ransom demands (typically six to seven figures), incident response costs, and regulatory fines.

Manufacturing and logistics targets (AT Packaging, Congoleum) face downstream supply chain disruption. Retail and hospitality targets (J Brand, Singita, Bunch) face customer personal information and payment card data exposure. Utilities sector targets (Northstar, Greenway) face potential critical infrastructure continuity concerns.

If DragonForce or affiliates execute threatened data publication, anticipated escalations include continued targeting of critical sectors, secondary victimization through sale of data to other cybercriminal groups, and data-driven social engineering campaigns using stolen employee and customer information.

## Historical Context

DragonForce publicly claimed responsibility for all 13 victims on its dark web leak portal. The group's claims have been corroborated by multiple independent threat intelligence sources including DeXpose, HendryAdrian, HookPhish, Ransomware.live, and Darktrace.

DragonForce has historical linkages to Malaysian hacktivist and cybercriminal origins but has evolved into a financially motivated RaaS platform. The affiliate-based operating model means individual attacks may be conducted by different affiliate groups operating under the DragonForce brand. Attribution confidence is moderate (A3) based on the group's public claims and independent verification.

## Timeline

### 2026-04-02 to 2026-04-06 — Multi-Stage Intrusion

DragonForce affiliates establish persistence, escalate privileges, and conduct lateral movement in compromised networks. Data exfiltration occurs across 13 target organizations.

### 2026-04-07 — AT Packaging Breach Discovery

AT Packaging discovers and reports the breach following ransomware deployment. DragonForce announces the campaign on its leak portal.

### 2026-04-08 — Threat Intelligence Corroboration

Multiple threat intelligence vendors publish analysis of the DragonForce campaign. Victim communications and ransom demands documented.

## Remediation & Mitigation

Organizations targeted by DragonForce should activate incident response plans and engage forensic investigators and law enforcement. Isolate affected systems from the network and disconnect backup systems to prevent encryption spread. Reset all domain credentials and force organization-wide password resets. Verify backup integrity and restore only from clean, validated backups.

Conduct comprehensive forensic investigation to identify entry point, lateral movement paths, and exfiltration scope. Patch all systems for known vulnerabilities. Disable unnecessary services and protocols (RDP, SMB, WinRM). Review and restrict administrative accounts using principle of least privilege.

Long-term prevention requires MFA for all remote access, network segmentation, EDR deployment across all endpoints, immutable offline backups with regular restoration testing, proactive threat hunting, and security awareness training for phishing resistance.

## Sources & References

- [CISA: Stop Ransomware Resources](https://www.cisa.gov/stopransomware) — CISA, 2026-04-09
- [Darktrace: Tracking a Dragon — Investigating a DragonForce-Affiliated Ransomware Attack](https://www.darktrace.com/blog/tracking-a-dragon-investigating-a-dragonforce-affiliated-ransomware-attack-with-darktrace) — Darktrace, 2026-04-08
- [Ransomware.live: DragonForce Ransomware Group Profile](https://www.ransomware.live/group/dragonforce) — Ransomware.live, 2026-04-08
- [DeXpose: DragonForce Strikes at Packaging in Latest Ransomware Attack](https://www.dexpose.io/dragonforce-strikes-at-packaging-in-latest-ransomware-attack/) — DeXpose, 2026-04-07
- [HendryAdrian: DragonForce Breaches Multi-Sector Victims](https://www.hendryadrian.com/dragonforce-breaches-asmar-sutex-bunch-klean-northstar-acme-j-brand-ces-singita-atpkg-congoleum-greenway-fhw/) — HendryAdrian, 2026-04-07
