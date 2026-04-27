---
eventId: TP-2026-0022
title: Foster City Ransomware Incident Disrupts Municipal Services
date: 2026-03-19
attackType: ransomware
severity: high
sector: Government / Municipal Services
geography: United States (California)
threatActor: Unknown
attributionConfidence: A4
reviewStatus: under_review
confidenceGrade: C
generatedBy: new-threat-intel-automation
generatedDate: 2026-03-19
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
  - url: https://www.fostercity.org/community/page/foster-city-services-impacted-cyber-security-breach
    publisher: Foster City
    publisherType: government
    reliability: R1
    publicationDate: "2026-03-19"
  - url: https://www.fostercity.org/community/page/foster-city-cyber-security-update
    publisher: Foster City
    publisherType: government
    reliability: R1
    publicationDate: "2026-03-20"
  - url: https://www.fostercity.org/community/page/foster-city-restores-full-functionality-public-services
    publisher: Foster City
    publisherType: government
    reliability: R1
    publicationDate: "2026-04-16"
  - url: https://www.nbcbayarea.com/news/local/foster-city-state-emergency-cyber-attack/4057400/
    publisher: NBC Bay Area
    publisherType: media
    reliability: R2
    publicationDate: "2026-03-24"
mitreMappings:
  - techniqueId: T1486
    techniqueName: "Data Encrypted for Impact"
    tactic: Impact
---

## Summary

Foster City, California said on March 19, 2026 that ransomware had been identified on city networks and that public services outside of emergency response had been temporarily paused. The city said 911 and police dispatch remained functional and warned that public information may have been accessed, though that remained uncertain at the time of the initial notice.

On March 20, the city said it had taken most computer systems offline while it worked with independent cybersecurity specialists to investigate and remediate the incident. NBC Bay Area later reported that Foster City declared a state of emergency on March 24, and the city announced on April 16 that full public-service functionality had been restored.

## Technical Analysis

The city's public statements confirm a ransomware-related cybersecurity breach affecting municipal systems, but they do not identify the ransomware variant, intrusion vector, or the internal sequence of compromise. Foster City said it initiated incident-response procedures after identifying suspicious activity and took most systems offline as a containment measure.

The public record remains limited. Claims about initial access, encryption scope, or specific attacker tooling are not supported by the cited public sources.

## Attack Chain

### Stage 1: Ransomware Identified on City Networks

Foster City said information technology staff identified ransomware on city networks in the early hours of March 19, 2026.

### Stage 2: Containment and Service Pause

The city paused public services outside of emergency response and later said it had taken most computer systems offline while it assessed the security of the network.

### Stage 3: Emergency Response and Ongoing Investigation

Foster City said it was working with outside cybersecurity specialists and pursuing a state of emergency to obtain supplementary support. NBC Bay Area reported that the city declared that emergency on March 24.

### Stage 4: Gradual Restoration

The city said services were gradually reactivated over the following weeks, culminating in an April 16 announcement that full public-service functionality had been restored.

## Impact Assessment

The confirmed impact was disruption to municipal operations. Foster City said non-emergency public services were temporarily paused, and NBC Bay Area reported that staff could not make or receive calls or respond to emails after the city took its network offline.

The city also said it was uncertain whether public information had been accessed and advised people who had done business with the city to change personal passwords as a precaution. The public record does not confirm the volume or type of any affected records.

## Attribution

No threat actor had been publicly identified in the cited sources. Foster City's statements focused on response and restoration, and NBC Bay Area reported that the city was not disclosing what had been accessed or what a potential ransom demand involved.

The incident remains unattributed unless future public reporting provides confirmed actor identification.

## Timeline

### 2026-03-19 — Ransomware Identified

Foster City announced that ransomware had been identified on city networks and that non-emergency public services were being paused.

### 2026-03-20 — Systems Taken Offline

The city said it had taken most computer systems offline, initiated incident-response procedures, and engaged independent cybersecurity specialists.

### 2026-03-24 — State of Emergency Declared

NBC Bay Area reported that Foster City declared a state of emergency as the investigation and service disruption continued.

### 2026-04-16 — Full Public-Service Functionality Restored

Foster City announced that full functionality of public services, including key online portals, had been restored.

## Remediation & Mitigation

Foster City said it took most systems offline, worked with independent cybersecurity specialists, and gradually reactivated affected programs and online services as restoration progressed. The city also advised people who had done business with Foster City to change personal passwords as a precaution.

The public reporting underscores the value of offline response options for municipal services, segmented emergency-response systems, and staged restoration of public-facing portals after a ransomware incident.

## Sources & References

- [Foster City: Foster City Services Impacted by Cyber Security Breach](https://www.fostercity.org/community/page/foster-city-services-impacted-cyber-security-breach) — Foster City, 2026-03-19
- [Foster City: Foster City Cyber Security Breach Update](https://www.fostercity.org/community/page/foster-city-cyber-security-update) — Foster City, 2026-03-20
- [Foster City: Foster City Restores Full Functionality of Public Services](https://www.fostercity.org/community/page/foster-city-restores-full-functionality-public-services) — Foster City, 2026-04-16
- [NBC Bay Area: Foster City declares State of Emergency following cyber attack](https://www.nbcbayarea.com/news/local/foster-city-state-emergency-cyber-attack/4057400/) — NBC Bay Area, 2026-03-24
