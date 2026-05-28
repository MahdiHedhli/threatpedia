---
eventId: TP-2026-0302
title: "West Pharmaceutical Services Ransomware and Data Exfiltration Incident (May 2026)"
date: 2026-05-04
attackType: ransomware
severity: high
sector: Healthcare supply chain / pharmaceutical manufacturing
geography: Global / United States
threatActor: Unknown
attributionConfidence: A4
reviewStatus: draft_ai
confidenceGrade: B
generatedBy: dangermouse-bot
generatedDate: 2026-05-28
cves: []
relatedSlugs: []
tags:
  - ransomware
  - data-exfiltration
  - healthcare
  - manufacturing
  - operations-disruption
mitreMappings:
  - techniqueId: "T1041"
    techniqueName: "Exfiltration Over C2 Channel"
    tactic: "Exfiltration"
    notes: "Company disclosure states that data was exfiltrated by an unauthorized party."
  - techniqueId: "T1486"
    techniqueName: "Data Encrypted for Impact"
    tactic: "Impact"
    notes: "Company disclosure states that certain systems were encrypted during the incident."
sources:
  - url: "https://www.sec.gov/Archives/edgar/data/105770/000010577026000068/wst-20260507.htm"
    publisher: "SEC EDGAR"
    publisherType: government
    reliability: R1
    publicationDate: "2026-05-11"
    accessDate: "2026-05-28"
    archived: false
  - url: "https://www.stocktitan.net/sec-filings/WST/8-k-west-pharmaceutical-services-inc-reports-material-event-121ed3e9725b.html"
    publisher: "Stock Titan (SEC filing mirror)"
    publisherType: media
    reliability: R2
    publicationDate: "2026-05-11"
    accessDate: "2026-05-28"
    archived: false
  - url: "https://www.cybersecuritydive.com/news/west-pharmaceutical-restoring-operations-ransomware-attack/820250/"
    publisher: "Cybersecurity Dive"
    publisherType: media
    reliability: R1
    publicationDate: "2026-05-14"
    accessDate: "2026-05-28"
    archived: false
  - url: "https://dysruptionhub.com/west-pharma-cyberattack-pennsylvania"
    publisher: "Dysruption Hub"
    publisherType: media
    reliability: R3
    publicationDate: "2026-05-13"
    accessDate: "2026-05-28"
    archived: false
---
## Summary

West Pharmaceutical Services disclosed a material cybersecurity incident after detecting an intrusion on May 4, 2026. According to the company's Form 8-K disclosure, an unauthorized party exfiltrated certain data and encrypted certain systems. The company reported temporary global operational disruption while restoring enterprise and site-level processes.

## Technical Analysis

Public disclosures describe a ransomware-style pattern: unauthorized access, data exfiltration, and encryption of systems. West stated it proactively took systems offline for containment, engaged external incident-response support, and continued restoration in phases.

Available public reporting does not provide enough evidence to confirm the initial access vector, malware family, or actor identity at this time.

## Attack Chain

### Stage 1: Intrusion detected

West reported initial detection of intrusion activity on May 4, 2026.

### Stage 2: Data exfiltration and encryption

The company disclosed that certain data was exfiltrated and certain systems were encrypted.

### Stage 3: Containment and shutdown actions

West stated it took systems offline globally for containment and restricted access to enterprise systems while incident response proceeded.

### Stage 4: Progressive restoration

Public updates indicated that core enterprise systems were restored and critical shipping, receiving, and manufacturing processes restarted at some sites, with restoration of remaining sites in progress.

## Impact Assessment

The company reported temporary disruption of global business operations. As of the cited disclosures, the full scope of affected data and the final financial impact had not been determined.

Given West's role in pharmaceutical packaging and delivery components, operational interruptions represented supply-chain risk for downstream healthcare and life-sciences customers.

## Attribution

**Threat actor: Unknown.** Current public sources confirm ransomware-related effects (exfiltration plus encryption) but do not provide sufficient evidence for confident attribution to a specific threat actor or cluster.

## Timeline

### 2026-05-04 - Initial intrusion detection

West detected an intrusion and initiated response procedures.

### 2026-05-07 - Materiality determination

West determined the incident was material and prepared required disclosure.

### 2026-05-11 - Form 8-K disclosure

West filed public disclosure describing data exfiltration, system encryption, and temporary operational disruption.

### 2026-05-14 - Recovery progress reporting

Subsequent reporting indicated partial restoration of critical operations while broader restoration work continued.

## Remediation & Mitigation

- Isolate and segment affected infrastructure during containment.
- Rotate credentials and tokens potentially exposed to compromised systems.
- Validate integrity before restoring business-critical systems.
- Increase monitoring for extortion follow-on activity tied to exfiltrated data.
- Exercise continuity plans for manufacturing and logistics disruptions.

## Sources & References

- [SEC EDGAR: West Pharmaceutical Services Form 8-K (wst-20260507)](https://www.sec.gov/Archives/edgar/data/105770/000010577026000068/wst-20260507.htm) — SEC EDGAR, 2026-05-11
- [Stock Titan (SEC filing mirror): West Pharmaceutical reports material cyberattack | WST 8-K Filing](https://www.stocktitan.net/sec-filings/WST/8-k-west-pharmaceutical-services-inc-reports-material-event-121ed3e9725b.html) — Stock Titan (SEC filing mirror), 2026-05-11
- [Cybersecurity Dive: West Pharmaceutical starts restoring operations after ransomware attack](https://www.cybersecuritydive.com/news/west-pharmaceutical-restoring-operations-ransomware-attack/820250/) — Cybersecurity Dive, 2026-05-14
- [Dysruption Hub: West Pharma cyberattack (Pennsylvania)](https://dysruptionhub.com/west-pharma-cyberattack-pennsylvania) — Dysruption Hub, 2026-05-13
