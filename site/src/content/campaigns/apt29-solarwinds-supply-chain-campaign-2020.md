---
campaignId: "TP-CAMP-2020-0002"
title: "APT29 SolarWinds Supply Chain Campaign"
startDate: 2019-10-01
endDate: 2020-12-13
ongoing: false
attackType: "Supply Chain / Espionage"
severity: critical
sector: "Government"
geography: "United States"
threatActor: "APT29"
attributionConfidence: A1
reviewStatus: "draft_ai"
confidenceGrade: A
generatedBy: "penfold-bot"
generatedDate: 2026-04-15
cves:
  - "CVE-2020-10148"
relatedIncidents:
  - "solarwinds-orion-supply-chain-compromise-2020"
relatedSlugs:
  - "apt29"
tags:
  - "apt29"
  - "solarwinds"
  - "svr"
  - "cozy-bear"
  - "sunburst"
  - "sunspot"
  - "teardrop"
  - "raindrop"
  - "espionage"
sources:
  - url: "https://www.cisa.gov/news-events/cybersecurity-advisories/aa20-352a"
    publisher: "CISA"
    publisherType: government
    reliability: R1
    publicationDate: "2020-12-17"
    accessDate: "2026-04-15"
    archived: false
  - url: "https://www.whitehouse.gov/briefing-room/statements-releases/2021/04/15/fact-sheet-imposing-costs-for-harmful-foreign-activities-by-the-russian-government/"
    publisher: "The White House"
    publisherType: government
    reliability: R1
    publicationDate: "2021-04-15"
    accessDate: "2026-04-15"
    archived: false
  - url: "https://www.mandiant.com/resources/blog/evasive-attacker-leverages-solarwinds-supply-chain-compromises-with-sunburst-backdoor"
    publisher: "Mandiant"
    publisherType: vendor
    reliability: R1
    publicationDate: "2020-12-13"
    accessDate: "2026-04-15"
    archived: false
  - url: "https://www.microsoft.com/en-us/security/blog/2020/12/18/analyzing-solorigate-the-compromised-dll-file-that-started-a-sophisticated-cyberattack-and-how-microsoft-defender-helps-protect/"
    publisher: "Microsoft Security"
    publisherType: vendor
    reliability: R1
    accessDate: "2026-04-15"
    archived: false
  - url: "https://www.ncsc.gov.uk/news/advisory-svr-activity-targeting-government-and-organisations"
    publisher: "NCSC UK"
    publisherType: government
    reliability: R1
    accessDate: "2026-04-15"
    archived: false
mitreMappings:
  - techniqueId: "T1195.002"
    techniqueName: "Supply Chain Compromise: Compromise Software Supply Chain"
    tactic: "Initial Access"
    notes: "SVR actors compromised the SolarWinds Orion build pipeline to inject malicious code into signed DLLs."
  - techniqueId: "T1484.002"
    techniqueName: "Domain Policy Modification: Domain Trust Modification"
    tactic: "Defense Evasion"
    notes: "Known as 'Golden SAML', attackers modified domain federation settings to move from on-premise to cloud environments."
  - techniqueId: "T1071.001"
    techniqueName: "Application Layer Protocol: Web Protocols"
    tactic: "Command and Control"
    notes: "The SUNBURST backdoor used HTTP/S to communicate with its C2 infrastructure using look-alike domains."
---

## Summary

The APT29 SolarWinds campaign was a multi-year, state-sponsored cyber-espionage operation conducted by the **Russian Foreign Intelligence Service (SVR)**. Discovered in late 2020, the campaign is defined by its highly successful supply chain compromise of the SolarWinds Orion Platform, which provided the attackers with initial access to approximately 18,000 organizations.

The SVR's primary objective was the collection of strategic intelligence from high-value government and corporate targets. To achieve this, APT29 (also known as Cozy Bear or the Dukes) demonstrated unprecedented operational security and technical sophistication, utilizing memory-only malware and exploiting domain trust relationships to move seamlessly between on-premise and cloud infrastructures. The campaign represents a fundamental shift in how nation-state actors utilize supply chain vulnerabilities for strategic gain.

## Technical Analysis

The campaign utilized a specialized, multi-stage malware suite designed for extreme stealth. The attack initiated with **SUNSPOT**, a custom implant deployed within the SolarWinds build environment. SUNSPOT monitored the build process and injected the **SUNBURST** (Solorigate) backdoor into the legitimate `SolarWinds.Orion.Core.BusinessLayer.dll` file. Because this DLL was then digitally signed by SolarWinds, it bypassed standard security checks when distributed to customers.

Once SUNBURST was active on a target system, it remained dormant for up to two weeks before performing extensive reconnaissance. If the environment matched the attackers' specific targeting criteria, they deployed follow-on payloads such as **TEARDROP** or **Raindrop**. These were Cobalt Strike loaders that ran entirely in memory, leaving minimal forensic footprints on the hard drive. The SVR also utilized the **Golden SAML** technique, where they stole token-signing certificates from on-premise AD FS servers to bypass multi-factor authentication and gain persistent access to cloud resources like Office 365 and Azure.

## Attack Chain

### Stage 1: Build Pipeline Implementation
The SVR established a long-term foothold in the SolarWinds corporate network, specifically targeting the software build servers. They deployed SUNSPOT to automate the injection of malicious code into Orion software updates.

### Stage 2: Distribution and Dormancy
Trojanized updates were pushed to over 18,000 customers. The SUNBURST backdoor executed on these systems but delayed its C2 activity to evade sandbox detection and automated analysis.

### Stage 3: Targeted Privilege Escalation
For a subset of high-value targets, the SVR utilized SUNBURST to harvest credentials and move laterally. They focused on identity providers (AD FS) to forge SAML tokens, allowing them to impersonate any user within the organization's cloud environment.

### Stage 4: Persistent Cloud Access
With forged tokens, the attackers accessed sensitive emails, internal documents, and strategic plans from government agencies and technology firms, maintaining access for several months without detection.

## Impact Assessment

The campaign’s impact is measured not by breadth—as only ~100 organizations were subjected to follow-on exploitation—but by the depth and seniority of the compromised accounts. Victims included the U.S. Departments of Treasury, Commerce, Justice, and State, as well as the Department of Energy’s National Nuclear Security Administration (NNSA).

Quantified damage includes the theft of proprietary source code from Microsoft and FireEye, and the exposure of sensitive diplomatic and economic communications. The campaign led to a global overhaul of supply chain security policies and the imposition of significant diplomatic and economic sanctions against the Russian government by the United States and its allies.

## Attribution

The campaign is attributed with high confidence to the **Russian Foreign Intelligence Service (SVR)**, specifically the GTsST (Main Center for Special Technologies). In April 2021, the U.S. government formally attributed the operation to the SVR, stating that the intelligence service was responsible for the development of the malware and the selection of targets.

Private sector firms, including Microsoft and Mandiant, identified technical indicators (TTPs) that aligned with previous APT29 activity, such as the focus on cloud-based identity systems and the use of the Dukes malware family in prior operations. The attribution is supported by a consensus among Five Eyes intelligence partners.

## Timeline

### 2019-10 — Initial Builders Compromise
The SVR gains access to SolarWinds and begins testing the SUNSPOT code injection mechanism.

### 2020-03 — Malicious Update Distribution
SolarWinds begins distributing trojanized Orion updates to its global customer base.

### 2020-12-08 — FireEye Public Disclosure
FireEye announces that its Red Team tools were stolen in a sophisticated state-sponsored attack, leading to the discovery of the SolarWinds backdoor.

### 2020-12-13 — SUNBURST Analysis
Mandiant and Microsoft publish detailed technical reports identifying SUNBURST and its link to the SolarWinds update process.

### 2021-04-15 — US Government Attribution
The White House issues an executive order formally attributing the campaign to the SVR and announcing sanctions against Russian technology firms.

## Sources & References

- [CISA: Advanced Persistent Threat Compromise of Government Agencies, Critical Infrastructure, and Private Sector Entities](https://www.cisa.gov/news-events/cybersecurity-advisories/aa20-352a) — CISA, 2020-12-17
- [The White House: Fact Sheet — Imposing Costs for Harmful Foreign Activities by the Russian Government](https://www.whitehouse.gov/briefing-room/statements-releases/2021/04/15/fact-sheet-imposing-costs-for-harmful-foreign-activities-by-the-russian-government/) — The White House, 2021-04-15
- [Mandiant: Highly Evasive Attacker Leverages SolarWinds Supply Chain Compromises with SUNBURST Backdoor](https://www.mandiant.com/resources/blog/evasive-attacker-leverages-solarwinds-supply-chain-compromises-with-sunburst-backdoor) — Mandiant, 2020-12-13
- [Microsoft Security: Analyzing Solorigate — The Compromised DLL File](https://www.microsoft.com/en-us/security/blog/2020/12/18/analyzing-solorigate-the-compromised-dll-file-that-started-a-sophisticated-cyberattack-and-how-microsoft-defender-helps-protect/) — Microsoft Security, 2020
- [NCSC UK: Advisory on SVR Activity Targeting Government and Organizations](https://www.ncsc.gov.uk/news/advisory-svr-activity-targeting-government-and-organisations) — NCSC UK, 2021
