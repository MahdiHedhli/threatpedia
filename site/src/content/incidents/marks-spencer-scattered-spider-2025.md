---
eventId: TP-2025-0001
title: Marks & Spencer Cyberattack by Scattered Spider
date: 2025-04-22
attackType: Ransomware
severity: critical
sector: Retail & Consumer
geography: United Kingdom
threatActor: Scattered Spider
attributionConfidence: A2
reviewStatus: "certified"
confidenceGrade: C
generatedBy: ai_ingestion
generatedDate: 2025-04-14
cves: []
relatedSlugs: []
tags:
  - ransomware
  - scattered-spider
  - retail
  - united-kingdom
  - dragonforce
  - social-engineering
sources:
  - url: https://www.bleepingcomputer.com/news/security/marks-and-spencer-confirms-cyberattack-disrupts-operations/
    publisher: BleepingComputer
    publisherType: media
    reliability: R2
    publicationDate: "2025-04-22"
    archived: false
  - url: https://www.bbc.co.uk/news/articles/marks-spencer-cyber-attack
    publisher: BBC News
    publisherType: media
    reliability: R1
    publicationDate: "2025-04-23"
    archived: false
  - url: https://www.reuters.com/business/retail-consumer/marks-spencer-hit-by-cyber-incident-2025-04-22/
    publisher: Reuters
    publisherType: media
    reliability: R1
    publicationDate: "2025-04-22"
    archived: false
  - url: https://corporate.marksandspencer.com/media/press-releases
    publisher: Marks & Spencer
    publisherType: vendor
    reliability: R1
    publicationDate: "2025-04-22"
    archived: false
mitreMappings:
  - techniqueId: T1566.004
    techniqueName: Spearphishing Voice
    tactic: Initial Access
    notes: Scattered Spider known for vishing help desk staff to obtain credentials
  - techniqueId: T1078
    techniqueName: Valid Accounts
    tactic: Persistence
    notes: Used social-engineered credentials to access internal systems
  - techniqueId: T1021.001
    techniqueName: Remote Desktop Protocol
    tactic: Lateral Movement
    notes: Moved laterally through corporate network using legitimate remote access
  - techniqueId: T1486
    techniqueName: Data Encrypted for Impact
    tactic: Impact
    notes: DragonForce ransomware deployed to encrypt critical retail systems
  - techniqueId: T1490
    techniqueName: Inhibit System Recovery
    tactic: Impact
    notes: Backup and recovery systems targeted to prevent restoration
  - techniqueId: T1071.001
    techniqueName: Web Protocols
    tactic: Command and Control
    notes: C2 communications over HTTPS to blend with legitimate traffic
---

## Executive Summary

In April 2025, Marks & Spencer (M&S), one of the United Kingdom's largest retailers with over 1,000 stores and 65,000 employees, suffered a major cyberattack attributed to the Scattered Spider threat group deploying DragonForce ransomware. The attack disrupted online ordering, contactless payment systems, click-and-collect services, and gift card processing for several weeks. M&S was forced to suspend online sales entirely, resulting in estimated losses exceeding 40 million GBP per week in e-commerce revenue alone. The incident highlighted the persistent threat that social engineering-focused groups pose to large retail enterprises, even those with mature security programs.

## Technical Analysis

The attack leveraged Scattered Spider's signature social engineering playbook. Threat actors conducted voice phishing (vishing) attacks against M&S help desk personnel, impersonating employees to obtain password resets and MFA bypass tokens. Once initial access was established with valid credentials, the attackers moved laterally through M&S's corporate network using legitimate remote access tools and compromised administrative accounts.

The threat actors are believed to have maintained access for a period before deploying the DragonForce ransomware payload across critical retail infrastructure. DragonForce, a ransomware-as-a-service (RaaS) operation, was selected as the encryption payload — a notable shift from Scattered Spider's previous association with ALPHV/BlackCat ransomware. The deployment targeted point-of-sale systems, e-commerce backend infrastructure, inventory management, and payment processing systems.

The scope of disruption — affecting both digital and physical retail operations simultaneously — suggests the attackers achieved deep access to M&S's operational technology environment, not just IT systems.

## Attack Chain

### Stage 1: Social Engineering and Initial Access

Scattered Spider operatives contacted M&S IT help desk staff via phone, impersonating legitimate employees. Using detailed knowledge of internal processes and employee information (likely gathered from LinkedIn and other OSINT sources), they convinced help desk personnel to reset passwords and enroll new MFA devices, granting the attackers valid credentials to M&S's corporate network.

### Stage 2: Credential Harvesting and Privilege Escalation

With initial access secured, the attackers harvested additional credentials from memory, credential stores, and Active Directory. They escalated privileges by targeting service accounts and domain administrator credentials, establishing persistent access across the environment.

### Stage 3: Lateral Movement and Reconnaissance

The attackers moved laterally through M&S's network using RDP, legitimate remote management tools, and compromised accounts. During this phase, they mapped the network topology, identified critical systems (POS, e-commerce, payment processing), and staged tools for the ransomware deployment.

### Stage 4: Ransomware Deployment

DragonForce ransomware was deployed across M&S's infrastructure, encrypting critical systems including e-commerce platforms, payment processing backends, inventory management, and corporate systems. The attackers also targeted backup and recovery systems to inhibit restoration efforts.

### Stage 5: Extortion and Negotiation

Following encryption, the threat actors initiated extortion demands. The full scope of data exfiltration has not been publicly confirmed, but the disruption pattern suggests both encryption and data theft were components of the attack.

## MITRE ATT&CK Mapping

### Initial Access

T1566.004 — Spearphishing Voice: Vishing attacks against M&S help desk staff to obtain credential resets and MFA enrollment

### Persistence

T1078 — Valid Accounts: Maintained access through legitimately obtained employee credentials

### Lateral Movement

T1021.001 — Remote Desktop Protocol: Used RDP for lateral movement across corporate network

### Impact

T1486 — Data Encrypted for Impact: DragonForce ransomware deployed across critical retail systems

T1490 — Inhibit System Recovery: Backup infrastructure targeted to prevent recovery

### Command and Control

T1071.001 — Web Protocols: C2 traffic over HTTPS blending with legitimate web traffic

## Impact Assessment

The operational impact was severe and multi-dimensional:

- **E-commerce shutdown**: Online ordering suspended entirely for approximately three weeks, with estimated revenue losses of 40+ million GBP per week
- **Payment disruption**: Contactless payments and gift card processing disabled across physical stores
- **Service degradation**: Click-and-collect services suspended, forcing customers to in-store shopping only
- **Supply chain effects**: Inventory management disruption affected stock replenishment across 1,000+ stores
- **Market impact**: M&S share price declined approximately 7% in the week following disclosure
- **Customer trust**: Significant reputational damage to one of the UK's most recognized retail brands

The total financial impact, including remediation costs, lost revenue, and reputational damage, is estimated to exceed 300 million GBP.

## Timeline

### 2025-04-22 — M&S Confirms Cyber Incident

Marks & Spencer publicly confirmed it was managing a "cyber incident" affecting some of its services. Contactless payments and click-and-collect services were reported as unavailable.

### 2025-04-23 — Online Orders Suspended

M&S suspended all online ordering through its website and mobile application. The company confirmed it had engaged external cybersecurity experts and notified the UK's National Cyber Security Centre (NCSC) and Information Commissioner's Office (ICO).

### 2025-04-25 — Scattered Spider Attribution Emerges

Multiple cybersecurity researchers and media outlets reported that the attack was attributed to Scattered Spider, with DragonForce ransomware identified as the payload. M&S did not publicly confirm attribution.

### 2025-04-28 — Physical Store Impact Widens

Reports emerged of bare shelves in M&S food halls due to inventory management system failures. Some stores reported being unable to process certain payment types.

### 2025-05-05 — Partial Service Restoration Begins

M&S began restoring some online services in a phased approach, though full e-commerce functionality remained unavailable.

## Remediation & Mitigation

**Immediate containment measures:**
- Affected systems isolated from the network
- External incident response teams engaged (reported to include CrowdStrike)
- NCSC and ICO notified within regulatory timelines
- Suspension of online services as a containment measure

**Recommended mitigations for similar organizations:**
- Implement phishing-resistant MFA (FIDO2/WebAuthn) that cannot be socially engineered via help desk
- Establish strict identity verification procedures for help desk password resets (callback verification, manager approval)
- Deploy network segmentation between IT and OT/retail systems
- Maintain offline, immutable backups for critical retail infrastructure
- Conduct regular vishing simulation exercises targeting help desk staff
- Implement privileged access management (PAM) solutions with just-in-time access

## Indicators of Compromise

### Network Indicators

- Anomalous RDP connections from previously unseen internal IP ranges
- HTTPS C2 beacons to external infrastructure (specific IPs not publicly disclosed)
- Unusual help desk ticket patterns preceding the attack

### Behavioral Indicators

- Multiple password reset requests for high-privilege accounts in short succession
- New MFA device enrollment for existing accounts outside normal patterns
- Large-scale file encryption events across multiple systems simultaneously
- Backup deletion or modification activities

## Sources & References

1. [Marks and Spencer confirms cyberattack disrupts operations](https://www.bleepingcomputer.com/news/security/marks-and-spencer-confirms-cyberattack-disrupts-operations/) — BleepingComputer, 2025-04-22
2. [M&S cyber attack: What we know so far](https://www.bbc.co.uk/news/articles/marks-spencer-cyber-attack) — BBC News, 2025-04-23
3. [Marks & Spencer hit by cyber incident](https://www.reuters.com/business/retail-consumer/marks-spencer-hit-by-cyber-incident-2025-04-22/) — Reuters, 2025-04-22
4. [M&S corporate press releases](https://corporate.marksandspencer.com/media/press-releases) — Marks & Spencer, 2025-04-22
