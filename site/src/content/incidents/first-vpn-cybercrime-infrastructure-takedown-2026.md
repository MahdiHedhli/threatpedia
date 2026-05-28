---
eventId: "TP-2026-0060"
title: "Operation Saffron Disrupts First VPN Cybercrime Infrastructure"
date: 2026-05-21
attackType: "Law Enforcement Disruption"
severity: high
sector: "Cybercrime Infrastructure"
geography: "Global"
threatActor: "Unknown"
attributionConfidence: A4
reviewStatus: "draft_ai"
confidenceGrade: B
generatedBy: "dangermouse-bot"
generatedDate: 2026-05-28
cves: []
relatedSlugs: []
tags:
  - "operation-saffron"
  - "vpn"
  - "ransomware"
  - "infrastructure-seizure"
  - "law-enforcement"
  - "europol"
  - "eurojust"
sources:
  - url: "https://www.europol.europa.eu/media-press/newsroom/news/cybercriminal-vpn-used-ransomware-actors-dismantled-in-global-crackdown"
    publisher: "Europol"
    publisherType: government
    reliability: R1
    publicationDate: "2026-05-21"
    accessDate: "2026-05-28"
    archived: false
  - url: "https://www.eurojust.europa.eu/news/eurojust-coordinated-investigation-shuts-down-criminal-vpn-network"
    publisher: "Eurojust"
    publisherType: government
    reliability: R1
    publicationDate: "2026-05-21"
    accessDate: "2026-05-28"
    archived: false
  - url: "https://www.ic3.gov/CSA/2026/260521.pdf"
    publisher: "FBI Internet Crime Complaint Center (IC3)"
    publisherType: government
    reliability: R1
    publicationDate: "2026-05-21"
    accessDate: "2026-05-28"
    archived: false
mitreMappings:
  - techniqueId: "T1090"
    techniqueName: "Proxy"
    tactic: "Command and Control"
    confidence: probable
    evidence: "Europol and Eurojust describe First VPN as a criminal VPN service used to conceal identities and support cybercriminal operations, including ransomware activity."
---

## Summary

On 19-20 May 2026, law enforcement authorities led by France and the Netherlands, with support from Europol and Eurojust, disrupted a criminal VPN service known as First VPN. Public reporting from Europol and Eurojust states that the service was marketed to cybercriminal users and was tied to ransomware-linked activity.

Authorities reported dismantling more than 33 servers, seizing core domains (`1vpns.com`, `1vpns.net`, `1vpns.org` and associated onion domains), and conducting a search and interview of a suspect in Ukraine. Europol and Eurojust both characterize the operation as a coordinated multinational disruption action.

## Technical Analysis

According to Europol, First VPN was positioned as an anonymity service for cybercriminal operations and appeared in major Europol-supported cybercrime investigations. Eurojust states the service was advertised on known criminal forums and promoted non-cooperation with judicial authorities.

The reported disruption targeted infrastructure rather than a single ransomware family. The public operational outcome was infrastructure seizure and service interruption, with user-notification actions also described by Eurojust.

## Attack Chain

### Stage 1: Criminal Service Operation

First VPN allegedly operated as a criminally oriented anonymity service, including use cases linked to ransomware-supporting activity.

### Stage 2: Cross-Border Investigation Build-Up

French and Dutch authorities, with Europol and Eurojust support, built a multiyear coordination effort, including a JIT and evidence-sharing mechanisms.

### Stage 3: Joint Action Days

On 19-20 May 2026, coordinated actions disrupted infrastructure and seized related domains.

### Stage 4: Post-Seizure Investigative Exploitation

Authorities reported user notification and continued analysis/coordination of seized data.

## Impact Assessment

- **T1090 (Proxy)**: First VPN is publicly described as infrastructure intended to conceal user identity and route activity for criminal operations. That behavior aligns with proxy-like anonymization use in command-and-control and operational traffic masking contexts.

## Attribution

Attribution to a specific named ransomware group is not confirmed in the cited primary sources. This record attributes the disrupted infrastructure to criminal service operators associated with First VPN and keeps the threat actor as `Unknown`.

## Timeline

### December 2021

Europol reports the broader investigation began in December 2021.

### May 2022

Eurojust reports opening a case at the request of French authorities.

### November 2023

Eurojust reports establishment of a Joint Investigation Team (JIT) to support cross-border coordination.

### 19-20 May 2026

Joint action days occurred across participating jurisdictions, including server disruption and domain seizures.

## Remediation & Mitigation

Public statements describe coordinated participation from authorities in France, the Netherlands, Luxembourg, Romania, Switzerland, Ukraine, and the United Kingdom, with Europol and Eurojust support functions. Europol also reported an Operational Taskforce with investigators from multiple countries to analyze seized data and coordinate intelligence sharing.

Both agencies describe the operation as part of long-running cross-border judicial and investigative cooperation, with Eurojust specifically reporting multiple coordination meetings before action days.

Defenders should track operational changes in criminal use of anonymization infrastructure after this disruption, including migration to replacement services and potential short-term changes in intrusion tradecraft.

The operation removed a reported anonymity infrastructure used by cybercriminal actors, including actors linked to ransomware operations. This is significant because such infrastructure can support concealment of operator location and traffic origin during criminal activity.

The disruption may also create investigative value through seized data and service-user identification, as described by Eurojust and Europol. At publication time, public sources did not provide a complete public victim count tied directly to this specific takedown.

## Sources & References

- [Europol: Cybercriminal VPN used by ransomware actors dismantled in global crackdown](https://www.europol.europa.eu/media-press/newsroom/news/cybercriminal-vpn-used-ransomware-actors-dismantled-in-global-crackdown) — Europol, 2026-05-21
- [Eurojust: Eurojust coordinated investigation shuts down criminal VPN network](https://www.eurojust.europa.eu/news/eurojust-coordinated-investigation-shuts-down-criminal-vpn-network) — Eurojust, 2026-05-21
- [FBI Internet Crime Complaint Center (IC3): 260521.pdf](https://www.ic3.gov/CSA/2026/260521.pdf) — FBI Internet Crime Complaint Center (IC3), 2026-05-21
