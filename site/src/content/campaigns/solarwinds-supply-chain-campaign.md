---
campaignId: "TP-CAMP-2020-0001"
title: "SolarWinds Supply Chain Espionage Campaign"
startDate: 2019-10-01
endDate: 2021-01-31
ongoing: false
attackType: "Supply Chain Compromise / Espionage"
severity: critical
sector: "Government"
geography: "Global"
threatActor: "APT29"
attributionConfidence: A1
reviewStatus: "draft_ai"
confidenceGrade: A
generatedBy: "penfold-bot"
generatedDate: 2026-04-16
cves:
  - "CVE-2020-10148"
  - "CVE-2021-35211"
relatedIncidents:
  - "solarwinds-orion-supply-chain-compromise-2020"
relatedSlugs:
  - "apt29"
tags:
  - "solarwinds"
  - "supply-chain"
  - "apt29"
  - "sunburst"
  - "espionage"
  - "svr"
sources:
  - url: "https://www.whitehouse.gov/briefing-room/statements-releases/2021/04/15/fact-sheet-imposing-costs-for-harmful-foreign-activities-by-the-russian-government/"
    publisher: "The White House"
    publisherType: government
    reliability: R1
    publicationDate: "2021-04-15"
    accessDate: "2026-04-16"
    archived: false
  - url: "https://www.cisa.gov/news-events/directives/emergency-directive-21-01"
    publisher: "CISA"
    publisherType: government
    reliability: R1
    publicationDate: "2020-12-13"
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
  - url: "https://attack.mitre.org/campaigns/C0024/"
    publisher: "MITRE ATT&CK"
    publicationDate: "2025-10-17"
    publisherType: research
    reliability: R1
    accessDate: "2026-04-16"
    archived: false
mitreMappings:
  - techniqueId: "T1195.002"
    techniqueName: "Supply Chain Compromise: Compromise Software Supply Chain"
    tactic: "Initial Access"
    notes: "SUNSPOT implant injected SUNBURST backdoor into SolarWinds Orion build pipeline."
  - techniqueId: "T1071.001"
    techniqueName: "Application Layer Protocol: Web Protocols"
    tactic: "Command and Control"
    notes: "SUNBURST C2 mimicked legitimate Orion Improvement Program traffic."
  - techniqueId: "T1484.002"
    techniqueName: "Domain Policy Modification: Domain Trust Modification"
    tactic: "Defense Evasion"
    notes: "Attackers forged SAML tokens to access cloud resources via modified AD FS trust."
---

## Summary

The SolarWinds supply chain campaign was a cyber-espionage operation attributed to Russia's SVR (APT29/Cozy Bear), discovered in December 2020. The attackers compromised the build environment of SolarWinds' Orion IT management platform and embedded the SUNBURST backdoor into legitimate software updates distributed between March and June 2020. Approximately 18,000 organizations installed the trojanized update; fewer than 100 were selected for follow-on exploitation.

Confirmed victims included U.S. federal agencies (Departments of Treasury, Commerce, Homeland Security, State, Justice, and Energy), FireEye (Mandiant), Microsoft, and other technology companies. The campaign demonstrated exceptional tradecraft including a two-week dormancy period, environment-aware execution, and C2 traffic designed to mimic legitimate Orion telemetry.

In April 2021, the U.S. government formally attributed the campaign to the SVR and imposed sanctions and diplomatic expulsions.

## Technical Analysis

The campaign's success depended on a persistent compromise of SolarWinds' build infrastructure dating to at least October 2019. The attackers deployed **SUNSPOT**, a specialized implant that monitored the Orion build process and injected SUNBURST source code into the `SolarWinds.Orion.Core.BusinessLayer.dll` file during compilation. The modified DLL was signed with SolarWinds' legitimate code-signing certificate.

**SUNBURST** (the backdoor in the trojanized DLL) remained dormant for 12-14 days after installation, then performed extensive environment checks including domain name verification, running process enumeration, and security tool detection. If the environment was deemed valuable, SUNBURST initiated C2 communications using a custom steganographic DNS protocol followed by HTTPS callbacks to C2 domains that matched the pattern `*.avsvmcloud.com`.

For high-value targets, the attackers deployed secondary payloads: **TEARDROP** (a memory-only dropper for Cobalt Strike) and **Raindrop** (an alternative loader). Post-exploitation activities focused on lateral movement to cloud environments using forged SAML tokens, compromised OAuth applications, and stolen Azure AD credentials.

## Attack Chain

### Stage 1: Build Environment Compromise

APT29 gained access to SolarWinds' development environment no later than October 2019. The SUNSPOT implant was installed to monitor the Orion build pipeline and inject malicious code during compilation.

### Stage 2: Trojanized Update Distribution

Between March and June 2020, SolarWinds distributed Orion updates containing the SUNBURST backdoor through its standard patch management system. Approximately 18,000 organizations installed the compromised update.

### Stage 3: Dormancy and Target Selection

SUNBURST remained inactive for a randomized dormancy period, then performed environment reconnaissance. The backdoor communicated target information to C2 infrastructure, and operators selected high-value targets for further exploitation.

### Stage 4: Secondary Payload Deployment

For selected targets, TEARDROP or Raindrop loaded Cobalt Strike beacons into memory, providing interactive access for operators.

### Stage 5: Lateral Movement to Cloud

Operators moved laterally from on-premises networks to cloud environments by compromising AD FS servers, forging SAML authentication tokens, and creating or hijacking OAuth applications in Azure AD.

### Stage 6: Data Exfiltration

Targeted email collections and document repositories were accessed and exfiltrated. The focus was on policy documents, intelligence assessments, and communications related to Russia.

## Impact Assessment

The campaign affected U.S. national security at the highest levels. Confirmed compromises included:

- **U.S. Department of the Treasury**: Email accounts of senior officials accessed
- **U.S. Department of Commerce (NTIA)**: Internal email monitoring systems compromised
- **U.S. Department of Homeland Security**: Senior leadership email accessed
- **U.S. Department of State**: Email systems compromised
- **FireEye/Mandiant**: Red team tools stolen and publicly disclosed
- **Microsoft**: Source code repositories accessed

The incident prompted Emergency Directive 21-01 requiring all federal agencies to disconnect SolarWinds Orion products. The total remediation cost across all affected organizations is estimated in the billions of dollars.

## Attribution

The U.S. government formally attributed the campaign to the SVR in April 2021, accompanied by Executive Order 14024 imposing sanctions and expelling Russian diplomats. The UK's NCSC concurrently attributed the activity to APT29/SVR. The attribution was based on intelligence community assessment, technical analysis of the campaign's tradecraft, and the strategic alignment of targets with SVR collection priorities.

Mandiant, Microsoft, CrowdStrike, and Volexity independently tracked the campaign and corroborated the SVR attribution through infrastructure analysis, malware analysis, and operational pattern matching.

## Timeline

### 2019-10 -- Build Environment Compromise
APT29 gained access to SolarWinds' Orion build environment.

### 2020-02-20 -- SUNBURST Injection Begins
SUNSPOT begins injecting SUNBURST into Orion builds.

### 2020-03-26 -- First Trojanized Update Distributed
SolarWinds Orion 2019.4 HF 5 containing SUNBURST is released.

### 2020-06 -- Trojanized Updates End
The last compromised Orion update is distributed.

### 2020-12-08 -- FireEye Discovers Breach
FireEye publicly discloses it was breached and red team tools were stolen.

### 2020-12-13 -- SUNBURST Publicly Identified
FireEye/Mandiant and Microsoft jointly disclose the SolarWinds supply chain compromise. CISA issues Emergency Directive 21-01.

### 2021-01-11 -- SUNSPOT Disclosed
CrowdStrike identifies the SUNSPOT implant used to inject SUNBURST into the build process.

### 2021-04-15 -- U.S. Government Attribution
The White House formally attributes the campaign to SVR and imposes sanctions.

## Sources & References

- [White House: Imposing Costs for Russian Activities](https://www.whitehouse.gov/briefing-room/statements-releases/2021/04/15/fact-sheet-imposing-costs-for-harmful-foreign-activities-by-the-russian-government/) -- The White House, 2021-04-15
- [CISA: Emergency Directive 21-01](https://www.cisa.gov/news-events/directives/emergency-directive-21-01) -- CISA, 2020-12-13
- [Mandiant: SUNBURST Backdoor Disclosure](https://www.mandiant.com/resources/blog/evasive-attacker-leverages-solarwinds-supply-chain-compromises-with-sunburst-backdoor) -- Mandiant, 2020-12-13
- [Microsoft: Analyzing Solorigate](https://www.microsoft.com/en-us/security/blog/2020/12/18/analyzing-solorigate-the-compromised-dll-file-that-started-a-sophisticated-cyberattack-and-how-microsoft-defender-helps-protect/) -- Microsoft Security, 2020-12-18
- [MITRE ATT&CK: SolarWinds Compromise](https://attack.mitre.org/campaigns/C0024/) -- MITRE ATT&CK
