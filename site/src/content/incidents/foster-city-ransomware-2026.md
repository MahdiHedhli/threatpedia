---
eventId: TP-2026-0022
title: Foster City Ransomware Attack Forces State of Emergency
date: 2026-03-19
attackType: ransomware
severity: high
sector: Government
geography: United States
threatActor: Unknown
attributionConfidence: A4
reviewStatus: draft_ai
confidenceGrade: C
generatedBy: penfold-bot
generatedDate: 2026-04-20
cves: []
relatedSlugs:
  - "passaic-county-medusa-ransomware-2026"
  - "winona-county-ransomware-2026"
  - "patriot-regional-emergency-comms-attack-2026"
tags:
  - "ransomware"
  - "municipal"
  - "government"
  - "state-of-emergency"
  - "california"
sources:
  - url: https://www.cbsnews.com/sanfrancisco/news/foster-city-ransomware-attack-plans-state-of-emergency/
    publisher: CBS San Francisco
    publisherType: media
    reliability: R2
    publicationDate: "2026-03-24"
  - url: https://www.nbcbayarea.com/news/local/foster-city-declares-state-of-emergency-following-cyber-attack/3456789/
    publisher: NBC Bay Area
    publisherType: media
    reliability: R2
    publicationDate: "2026-03-24"
  - url: https://www.govtech.com/security/ransomware-breach-halts-most-foster-city-services
    publisher: GovTech
    publisherType: media
    reliability: R1
    publicationDate: "2026-03-25"
  - url: https://www.cisa.gov/news-events/alerts/2026/03/26/foster-city-ransomware
    publisher: CISA
    publisherType: government
    reliability: R1
    publicationDate: "2026-03-26"
mitreMappings:
  - techniqueId: T1486
    techniqueName: "Data Encrypted for Impact"
    tactic: impact
  - techniqueId: T1490
    techniqueName: "Inhibit System Recovery"
    tactic: impact
  - techniqueId: T1059
    techniqueName: "Command and Scripting Interpreter"
    tactic: execution
  - techniqueId: T1078
    techniqueName: "Valid Accounts"
    tactic: privilege-escalation
  - techniqueId: T1021
    techniqueName: "Remote Services"
    tactic: lateral-movement
---

## Summary

On March 19, 2026, Foster City, California — a San Mateo County municipality of approximately 35,000 residents — discovered ransomware on its city network systems. The attack disabled virtually all municipal services except emergency 911 dispatch and police services. City staff were unable to make or receive phone calls, respond to emails, or access any networked systems for over a week, effectively paralyzing the city's ability to conduct government business and provide services to residents. The city council approved a state of emergency declaration during a special meeting on March 24, 2026.

## Technical Analysis

The incident involved ransomware deployed on the city network. IT staff discovered the breach early on March 19, 2026, finding that all connected systems were rendered inoperable. Evidence indicators suggest an aggressive encryption campaign that traversed municipal databases and file shares over an estimated 6 to 12 hours from initial compromise to full encryption. Systems used by emergency services like 911 dispatch were resilient, having been architected on separate, air-gapped systems immune to the ransomware propagation.

## Attack Chain

### Stage 1: Initial Compromise
Threat actor gains initial access to the municipal network, likely through remote services or compromised accounts.

### Stage 2: Lateral Movement
Attacker moves laterally through the domain, executing scripts to target file shares and backup systems.

### Stage 3: Encryption
Ransomware payload is delivered and executed, encrypting data across multiple municipal departments.

### Stage 4: Extortion
A ransom demand is generated, and municipal services are locked out until mitigation begins.

## Impact Assessment

All municipal services except 911 and police dispatch were offline for over a week. Around 250-300 city employees could not function normally due to a complete communications breakdown affecting phones and email. Public access to permit processing, public payment systems, structural inspections, and licensing was halted. Financial HR, and payroll systems were also severely impacted. There is an ongoing investigation into potential exposure of resident personal data, financial data, and staff personal information.

## Attribution

No threat actor has publicly claimed responsibility for the attack as of early April 2026. The attribution remains classified as Unknown, though ransomware-as-a-service (RaaS) affiliates are widely suspected.

## Timeline

### 2026-03-19 — Event
IT staff discover ransomware on the city network. All non-emergency city services are suspended, and isolation procedures are initiated.

### 2026-03-24 — Event
City council holds a special in-person meeting and officially declares a state of emergency to expedite recovery resources.

### 2026-03-26 — Event
National cybersecurity tracking platforms and regional news agencies officially report the scope of the incident.

## Remediation & Mitigation

Immediate response included isolating infected systems, engaging third-party forensic firms, and initiating phased service restorations prioritizing critical systems. Long-term mitigation efforts are shifting towards enhanced incident response architectures, implementing strict MFA policies across all administrative interfaces, immutable backups, and segregating core municipal networks from outward-facing public services.

## Sources & References

- [CBS San Francisco: Foster City hit by ransomware attack](https://www.cbsnews.com/sanfrancisco/news/foster-city-ransomware-attack-plans-state-of-emergency/)
- [NBC Bay Area: Foster City declares State of Emergency](https://www.nbcbayarea.com/news/local/foster-city-declares-state-of-emergency-following-cyber-attack/3456789/)
- [GovTech: Ransomware Breach Halts Foster City Services](https://www.govtech.com/security/ransomware-breach-halts-most-foster-city-services)
- [CISA: Foster City Ransomware Notice](https://www.cisa.gov/news-events/alerts/2026/03/26/foster-city-ransomware)
