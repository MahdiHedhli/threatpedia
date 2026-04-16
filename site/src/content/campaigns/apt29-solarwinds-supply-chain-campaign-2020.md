---
campaignId: "TP-CAMP-2020-0002"
title: "APT29 (Cozy Bear) SolarWinds Supply Chain Campaign (2019-2020)"
startDate: 2019-10-01
endDate: 2020-12-13
ongoing: false
attackType: "Supply Chain / Espionage"
severity: critical
sector: "Government / Technology"
geography: "Global"
threatActor: "APT29"
attributionConfidence: A1
reviewStatus: "draft_ai"
confidenceGrade: A
generatedBy: "penfold-bot"
generatedDate: 2026-04-16
cves:
  - "CVE-2020-10148"
relatedIncidents:
  - "solarwinds-orion-supply-chain-compromise-2020"
tags:
  - "apt29"
  - "cozy-bear"
  - "solarwinds"
  - "svr"
  - "espionage"
  - "supply-chain"
sources:
  - url: "https://www.cisa.gov/news-events/cybersecurity-advisories/aa20-352a"
    publisher: "CISA"
    publisherType: government
    reliability: R1
    publicationDate: "2020-12-17"
    accessDate: "2026-04-16"
    archived: false
  - url: "https://www.whitehouse.gov/briefing-room/statements-releases/2021/04/15/fact-sheet-imposing-costs-for-harmful-foreign-activities-by-the-russian-government/"
    publisher: "The White House"
    publisherType: government
    reliability: R1
    publicationDate: "2021-04-15"
    accessDate: "2026-04-16"
    archived: false
  - url: "https://www.mandiant.com/resources/blog/evasive-attacker-leverages-solarwinds-supply-chain-compromises-with-sunburst-backdoor"
    publisher: "Mandiant"
    publisherType: vendor
    reliability: R1
    publicationDate: "2020-12-13"
    accessDate: "2026-04-16"
    archived: false
  - url: "https://www.microsoft.com/en-us/security/blog/2020/12/18/analyzing-solorigate-the-compromised-dll-file-that-started-a-sophisticated-cyberattack-and-how-microsoft-defender-helps-protect/"
    publisher: "Microsoft Security"
    publisherType: vendor
    reliability: R1
    publicationDate: "2020-12-18"
    accessDate: "2026-04-16"
    archived: false
  - url: "https://www.ncsc.gov.uk/news/advisory-apt29-targets-organisations-involved-in-covid-19-vaccine-development"
    publisher: "NCSC UK"
    publisherType: government
    reliability: R1
    publicationDate: "2020-07-16"
    accessDate: "2026-04-16"
    archived: false
mitreMappings:
  - techniqueId: "T1195.002"
    techniqueName: "Supply Chain Compromise: Compromise Software Supply Chain"
    tactic: "Initial Access"
    notes: "The SVR compromised the SolarWinds build pipeline to inject the SUNBURST backdoor into signed Orion updates."
  - techniqueId: "T1548.002"
    techniqueName: "Abuse Privilege Escalation Mechanism: Bypass User Account Control"
    tactic: "Privilege Escalation"
    notes: "Attackers utilized UAC bypass techniques to elevate privileges and gain administrative control on target systems."
  - techniqueId: "T1484.002"
    techniqueName: "Domain Policy Modification: Domain Trust Modification"
    tactic: "Defense Evasion"
    notes: "The 'Golden SAML' technique enabled attackers to bypass MFA and access cloud services (Office 365) via forged tokens."
---

## Summary

The APT29 SolarWinds Supply Chain Campaign was a massive, state-sponsored espionage operation conducted by the Russian Foreign Intelligence Service (SVR) between 2019 and 2020. The campaign targeted over 18,000 organizations by compromising the software build pipeline of SolarWinds, a major IT management software provider.

Attributed to **APT29** (also known as Cozy Bear or the Dukes), the operation allowed the SVR to gain long-term, stealthy access to a wide range of government agencies, think tanks, and technology firms. The campaign is notable for its exceptional operational security, its creative use of cloud-based identity exploitation, and its deployment of custom, memory-only malware that left minimal forensic evidence.

## Technical Analysis

The campaign utilized a specialized set of tools designed for stealth and persistence. The entry point was the **SUNSPOT** implant, which was deployed within the SolarWinds build environment to inject the **SUNBURST** backdoor into the `SolarWinds.Orion.Core.BusinessLayer.dll` file. This ensured that the backdoor was digitally signed with legitimate SolarWinds certificates and distributed through official update channels.

For high-priority targets, the SVR deployed follow-on payloads such as **TEARDROP**, **Raindrop**, and **GoldMax**. These were memory-resident Cobalt Strike loaders and custom implants that communicated through HTTPS using domain-matching C2 infrastructure. A key technical feature was the "Golden SAML" attack, where the adversaries modified domain federation settings to issue forged SAML tokens, allowing them to move from on-premise Active Directory environments to cloud-hosted Office 365 tenants without triggering traditional alerts.

## Attack Chain

### Stage 1: Build Pipeline Injection
The SVR established persistence in the SolarWinds network and used SUNSPOT to monitor the build server. When a specific Orion build job started, SUNSPOT temporarily replaced source code files with malicious copies, ensuring the SUNBURST backdoor was compiled into the final product.

### Stage 2: Trojan Distribution
The malicious updates were signed and uploaded to the SolarWinds update portal. Customers who downloaded and installed Orion updates unknowingly deployed the SUNBURST backdoor on their administrative servers.

### Stage 3: Dormancy and Beaconing
SUNBURST remained dormant for 12 to 14 days to evade automated sandboxes. After activation, it performed environmental checks (verifying the system was not a VM or honeypot) and beaconed home to an attacker-controlled domain designed to look like a legitimate SolarWinds infrastructure.

### Stage 4: Cloud Pivot and Data Collection
Once a high-value victim was identified, the SVR used SUNBURST to download TEARDROP and other interactive payloads. They focused on stealing identity provider certificates (SAML signing certificates), which granted them permanent access to the victim's cloud-based email (Outlook) and document repositories (SharePoint/OneDrive).

## Impact Assessment

The campaign’s impact extended to the core of the global technology and defense landscape. Over 18,000 organizations installed the malicious updates, but only a few hundred "high-value" targets faced secondary exploitation. These included the U.S. Departments of Treasury, State, Commerce, Energy, and Homeland Security.

The loss of sensitive intelligence from government agencies and the compromise of major cybersecurity firms (Mandiant/FireEye) forced a radical shift toward supply chain verification and the widespread adoption of multi-factor authentication for administrative accounts. The campaign illustrated that even highly secure, "zero-trust" environments could be circumvented through the compromise of trusted third-party software updates.

## Attribution

In April 2021, the United States and the United Kingdom formally attributed the campaign to the **Russian Foreign Intelligence Service (SVR)**, specifically the threat actor **APT29** (Cozy Bear). This conclusion was reached after a multi-agency investigation involving CISA, the FBI, the NSA, and the NCSC UK.

The attribution was based on a variety of indicators, including the SVR's historical preference for long-term espionage objectives, the specific TTPs used in cloud identity exploitation, and the infrastructure's technical match with previous APT29 activities. The SVR is known for its high level of professionalization, often utilizing custom tools for each target and maintaining strict discipline in its command-and-control operations.

## Timeline

### 2019-10 — Initial Access
Evidence suggests the SVR gained initial access to the SolarWinds network and began testing SUNSPOT code injection.

### 2020-03 — Update Distribution
SolarWinds begins distributing version 2019.2 through 2020.2.1 of the Orion platform, containing the SUNBURST backdoor.

### 2020-12-08 — FireEye Public Disclosure
Mandiant/FireEye announces it has discovered a massive supply chain compromise after its own internal red team tools were stolen.

### 2020-12-13 — CISA Emergency Directive
CISA releases Emergency Directive 21-01, ordering all federal agencies to immediately disconnect SolarWinds Orion software.

### 2021-04-15 — US Government Sanctions
The White House issues Executive Order 14028 and announces sanctions against Russia for the SVR's role in the SolarWinds campaign.

## Sources & References

- [CISA: Alert (AA20-352A) — Advanced Persistent Threat Compromise of Government Agencies, Critical Infrastructure, and Private Sector Entities](https://www.cisa.gov/news-events/cybersecurity-advisories/aa20-352a) — CISA, 2020-12-17
- [The White House: Fact Sheet — Imposing Costs for Harmful Foreign Activities by the Russian Government](https://www.whitehouse.gov/briefing-room/statements-releases/2021/04/15/fact-sheet-imposing-costs-for-harmful-foreign-activities-by-the-russian-government/) — The White House, 2021-04-15
- [Mandiant: Highly Evasive Attacker Leverages SolarWinds Supply Chain Compromises (2020)](https://www.mandiant.com/resources/blog/evasive-attacker-leverages-solarwinds-supply-chain-compromises-with-sunburst-backdoor) — Mandiant, 2020-12-13
- [Microsoft: Analyzing Solorigate – The Compromised DLL File That Started a Sophisticated Cyberattack](https://www.microsoft.com/en-us/security/blog/2020/12/18/analyzing-solorigate-the-compromised-dll-file-that-started-a-sophisticated-cyberattack-and-how-microsoft-defender-helps-protect/) — Microsoft Security, 2020-12-18
- [NCSC UK: Advisory — APT29 targets organizations involved in COVID-19 vaccine development](https://www.ncsc.gov.uk/news/advisory-apt29-targets-organisations-involved-in-covid-19-vaccine-development) — NCSC UK, 2020-07-16
