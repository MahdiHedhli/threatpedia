---
eventId: TP-2026-0335
title: "Interpol Operation Ramz MENA Cybercrime Crackdown"
date: 2026-05-18
attackType: Financial
severity: medium
sector: Law Enforcement / Cybercrime
geography: Middle East and North Africa
threatActor: "Unknown"
attributionConfidence: A4
reviewStatus: draft_ai
confidenceGrade: B
generatedBy: dangermouse-bot
generatedDate: 2026-06-06
generation:
  provider: "openai"
  model: "Codex GPT-5.3 Spark"
  tool: "codex"
  agent: "dangermouse-bot"
  promptProfile: "Threatpedia Danger Mouse"
cves: []
relatedSlugs: []
tags:
  - "operation-ramz"
  - "interpol"
  - "cybercrime"
  - "phishing"
  - "malware"
  - "financial-fraud"
sources:
  - url: "https://www.interpol.int/News-and-Events/News/2026/201-arrests-in-first-of-its-kind-cybercrime-operation-in-MENA-region"
    publisher: "INTERPOL"
    publisherType: government
    reliability: R1
    publicationDate: "2026-05-18"
    accessDate: "2026-06-06"
    archived: false
  - url: "https://www.bleepingcomputer.com/news/security/interpol-operation-ramz-seizes-53-malware-phishing-servers/amp/"
    publisher: "BleepingComputer"
    publisherType: media
    reliability: R2
    publicationDate: "2026-05-18"
    accessDate: "2026-06-06"
    archived: false
  - url: "https://me-en.kaspersky.com/about/press-releases/kaspersky-supports-interpols-operation-ramz-in-mena-region-resulting-in-over-200-arrests"
    publisher: "Kaspersky"
    publisherType: vendor
    reliability: R1
    publicationDate: "2026-05-18"
    accessDate: "2026-06-06"
    archived: false
mitreMappings:
  - techniqueId: "T1566"
    techniqueName: "Phishing"
    tactic: "Initial Access"
    attack-version: "v19"
    confidence: "confirmed"
    evidence: "INTERPOL said Operation Ramz focused on neutralizing phishing threats and cyber scams; Algeria dismantled a phishing-as-a-service website."
  - techniqueId: "T1583.004"
    techniqueName: "Server"
    tactic: "Resource Development"
    attack-version: "v19"
    confidence: "probable"
    evidence: "INTERPOL reported 53 servers seized, including infrastructure used for phishing, malware, and online fraud."
---

## Summary

INTERPOL announced Operation Ramz on May 18, 2026, describing it as the first cybercrime operation of its scale coordinated by INTERPOL in the Middle East and North Africa region. The operation ran from October 2025 through February 28, 2026 and involved 13 participating countries.

The operation led to 201 arrests, identification of a further 382 suspects, identification of 3,867 victims, and seizure of 53 servers. INTERPOL said the activity focused on phishing, malware threats, and cyber scams that caused regional losses and supported financial fraud operations.

The public reporting does not name a single threat actor responsible for all disrupted activity. The cases described by INTERPOL span compromised devices, investment scams, phishing-as-a-service infrastructure, malware-infected servers, and phishing operations, so the actor field remains Unknown.

## Technical Analysis

Operation Ramz targeted a mix of cybercrime infrastructure and fraud activity across the MENA region. INTERPOL said the operation aimed to investigate and disrupt malicious infrastructure, identify and arrest suspects, and prevent future losses.

The operation produced nearly 8,000 pieces of data and intelligence that were shared among participating countries. INTERPOL worked with Group-IB, Kaspersky, the Shadowserver Foundation, Team Cymru, and Trend Micro to track illegal cyber activity and identify malicious servers.

The source-described infrastructure included compromised devices, phishing-as-a-service systems, servers with malware infection, systems containing sensitive information, and devices holding banking data and phishing software. Kaspersky said it contributed threat intelligence on region-specific cyberthreats and malicious infrastructure involved in malware control or distribution, including command-and-control server data.

## Attack Chain

### Stage 1: Infrastructure and victim discovery

Investigators and private-sector partners collected technical data on phishing, malware, and fraud infrastructure across participating countries.

### Stage 2: Intelligence dissemination

INTERPOL reported that nearly 8,000 intelligence items were shared among participating countries to initiate and support national investigations.

### Stage 3: National enforcement actions

Participating countries used the shared intelligence to secure compromised devices, locate fraud infrastructure, seize servers and devices, and identify suspects.

### Stage 4: Arrests and disruption

The operation resulted in 201 arrests, 382 additional suspects identified, 53 servers seized, and 3,867 victims identified.

## Impact Assessment

The operation disrupted infrastructure associated with phishing, malware, and cyber scams in 13 MENA countries: Algeria, Bahrain, Egypt, Iraq, Jordan, Lebanon, Libya, Morocco, Oman, Palestine, Qatar, Tunisia, and the United Arab Emirates.

INTERPOL reported 3,867 identified victims and 53 seized servers. BleepingComputer, citing the same operation, described the seized servers as infrastructure used for phishing, malware, and online fraud. Kaspersky reported that the operation focused on neutralizing phishing and malware threats along with cyber scams that left nearly 4,000 individuals as victims.

Country-level highlights included compromised devices secured in Qatar, a Jordanian investment-scam operation involving trafficked workers, a vulnerable malware-infected server disabled in Oman, a phishing-as-a-service website dismantled in Algeria, and devices and banking data seized in Morocco.

## Attribution

The public sources attribute the disrupted activity to cybercriminal suspects and criminal operations rather than one named actor. INTERPOL reported 201 arrests and 382 additional suspects but did not publish a single actor name covering the entire operation.

The Jordan case included 15 people found carrying out scams whom investigators determined were victims of human trafficking, with two other individuals suspected of orchestrating the operation arrested. This distinction matters: the public record supports treating the broader threat actor as Unknown while separately noting that some observed operators may also have been coerced participants.

## Timeline

### 2025-10-01 - Operation period began

Operation Ramz began in October 2025 across participating MENA countries.

### 2026-02-28 - Operation period ended

INTERPOL reported that the operation period ran through February 28, 2026.

### 2026-05-18 - INTERPOL announced the results

INTERPOL announced 201 arrests, 382 additional suspects identified, 3,867 victims identified, and 53 servers seized.

### 2026-05-18 - Corroborating coverage published

BleepingComputer and Kaspersky published coverage of the operation and its technical and law-enforcement outcomes.

## Remediation & Mitigation

- Monitor for phishing infrastructure, malware command-and-control servers, and scam platforms that reuse regional hosting or account patterns.
- Preserve logs and device images when shutting down compromised systems so investigators can link infrastructure to operators and victims.
- Share high-confidence indicators with national cybercrime units, INTERPOL channels, and vetted private-sector partners.
- Harden servers that store sensitive data, especially systems exposed from residences or small offices with weak patching and malware controls.
- Warn users about investment platforms that display false trading returns and then shut down after deposits are made.
- Treat forced-labor indicators as part of cybercrime investigations when scam operations involve recruited workers, confiscated documents, or coercion.

## Sources & References

- [INTERPOL: 201 arrests in first-of-its-kind cybercrime operation in MENA region](https://www.interpol.int/News-and-Events/News/2026/201-arrests-in-first-of-its-kind-cybercrime-operation-in-MENA-region) — INTERPOL, 2026-05-18
- [BleepingComputer: INTERPOL 'Operation Ramz' seizes 53 malware, phishing servers](https://www.bleepingcomputer.com/news/security/interpol-operation-ramz-seizes-53-malware-phishing-servers/amp/) — BleepingComputer, 2026-05-18
- [Kaspersky: Kaspersky supports INTERPOL's operation Ramz in MENA region, resulting in over 200 arrests](https://me-en.kaspersky.com/about/press-releases/kaspersky-supports-interpols-operation-ramz-in-mena-region-resulting-in-over-200-arrests) — Kaspersky, 2026-05-18
