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
generatedDate: 2026-04-16
cves:
  - "CVE-2020-10148"
relatedSlugs:
  - "apt29"
  - "solarwinds-supply-chain-campaign"
tags:
  - "apt29"
  - "solarwinds"
  - "supply-chain"
  - "svr"
  - "sunburst"
  - "espionage"
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
    publisher: "FireEye/Mandiant"
    publisherType: vendor
    reliability: R1
    publicationDate: "2020-12-13"
    accessDate: "2026-04-16"
    archived: false
mitreMappings:
  - techniqueId: "T1195.002"
    techniqueName: "Supply Chain Compromise: Compromise Software Supply Chain"
    tactic: "Initial Access"
    notes: "SUNSPOT injected SUNBURST into the SolarWinds Orion build pipeline."
  - techniqueId: "T1071.001"
    techniqueName: "Application Layer Protocol: Web Protocols"
    tactic: "Command and Control"
    notes: "SUNBURST C2 communications disguised as legitimate Orion telemetry."
  - techniqueId: "T1550.001"
    techniqueName: "Use Alternate Authentication Material: Application Access Token"
    tactic: "Lateral Movement"
    notes: "Forged SAML tokens for accessing cloud resources without valid credentials."
---

## Summary

The APT29 SolarWinds campaign was a multi-year cyber-espionage operation by Russia's SVR that leveraged a supply chain compromise of the SolarWinds Orion platform. APT29 embedded the SUNBURST backdoor into Orion software updates distributed to approximately 18,000 organizations between March and June 2020. The campaign focused on U.S. federal agencies, with confirmed compromises at the Departments of Treasury, Commerce, Homeland Security, State, Justice, and Energy.

The operation was discovered on December 8, 2020 when FireEye (Mandiant) disclosed that its own network had been breached and its red team tools stolen. Subsequent investigation traced the intrusion to the trojanized SolarWinds Orion update, revealing the full scope of the campaign.

## Technical Analysis

The campaign began with the compromise of SolarWinds' build environment no later than October 2019. APT29 deployed **SUNSPOT**, a build-monitoring implant that detected when the Orion product was being compiled and injected the SUNBURST backdoor into the source code before signing. This ensured the malicious code was distributed with SolarWinds' legitimate digital signature.

SUNBURST implemented multiple anti-detection mechanisms: a randomized dormancy period of 12-14 days, process and domain name checks to avoid security research environments, and C2 communications that mimicked the legitimate Orion Improvement Program (OIP) protocol. The backdoor encoded victim information in DNS subdomains for initial reconnaissance.

For high-value targets, APT29 deployed **TEARDROP** and **Raindrop** as memory-only Cobalt Strike loaders. Post-exploitation focused on compromising AD FS servers, forging SAML tokens, and accessing cloud resources (Exchange Online, SharePoint, Azure AD) using fabricated authentication material.

## Attack Chain

### Stage 1: Build Pipeline Compromise
APT29 established persistent access to SolarWinds' build infrastructure and deployed the SUNSPOT implant.

### Stage 2: Backdoor Distribution
SUNBURST was embedded in Orion updates (versions 2019.4 HF 5 through 2020.2.1) and distributed via SolarWinds' standard update mechanism.

### Stage 3: Target Selection
SUNBURST performed environment reconnaissance and reported findings to C2 infrastructure. APT29 operators selectively chose high-value targets.

### Stage 4: Post-Exploitation
TEARDROP and Raindrop loaded Cobalt Strike beacons for interactive operator access. Credential harvesting and AD FS compromise enabled cloud environment access.

### Stage 5: Intelligence Collection
Operators accessed email systems, document repositories, and source code of targeted organizations, focusing on policy and intelligence-related content.

## Impact Assessment

The campaign compromised the email communications and internal documents of multiple U.S. cabinet-level departments. The full extent of data exfiltration remains classified, but public reporting indicates access to senior official email accounts, internal policy deliberations, and national security-related communications.

FireEye's disclosure of its red team tool theft prompted industry-wide hunting efforts. CISA issued Emergency Directive 21-01 requiring federal agencies to disconnect SolarWinds Orion products. The remediation effort across the U.S. government required months of work to rebuild compromised infrastructure and verify the integrity of cloud environments.

## Attribution

The White House formally attributed the campaign to the SVR in April 2021, imposing sanctions under Executive Order 14024. CISA advisory AA20-352A provided technical details linking the activity to the Russian intelligence service. The UK's NCSC issued a concurrent attribution statement. Private-sector research from Mandiant, Microsoft, CrowdStrike, and Volexity corroborated the attribution.

## Timeline

### 2019-10 -- Build Environment Compromised
APT29 accesses SolarWinds development infrastructure.

### 2020-03-26 -- First Trojanized Update
Orion 2019.4 HF 5 with SUNBURST is distributed.

### 2020-12-08 -- FireEye Disclosure
FireEye discloses breach and theft of red team tools.

### 2020-12-13 -- SUNBURST Public Disclosure
SolarWinds supply chain compromise publicly identified. CISA issues ED 21-01.

### 2021-04-15 -- Formal Attribution
U.S. government attributes campaign to SVR and imposes sanctions.

## Sources & References

- [CISA: Advisory AA20-352A](https://www.cisa.gov/news-events/cybersecurity-advisories/aa20-352a) -- CISA, 2020-12-17
- [White House: Imposing Costs for Russian Activities](https://www.whitehouse.gov/briefing-room/statements-releases/2021/04/15/fact-sheet-imposing-costs-for-harmful-foreign-activities-by-the-russian-government/) -- The White House, 2021-04-15
- [FireEye: SUNBURST Backdoor Analysis](https://www.mandiant.com/resources/blog/evasive-attacker-leverages-solarwinds-supply-chain-compromises-with-sunburst-backdoor) -- FireEye/Mandiant, 2020-12-13
