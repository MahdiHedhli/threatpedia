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
reviewStatus: "draft_human"
confidenceGrade: A
generatedBy: "kernel-k"
generatedDate: 2026-04-17
cves: []
relatedIncidents:
  - "solarwinds-orion-supply-chain-compromise-2020"
  - "fireeye-red-team-tools-breach-2020"
tags:
  - "solarwinds"
  - "supply-chain"
  - "apt29"
  - "sunburst"
  - "svr"
  - "espionage"
sources:
  - url: "https://www.cisa.gov/news-events/directives/ed-21-01-mitigate-solarwinds-orion-code-compromise"
    publisher: "CISA"
    publisherType: government
    reliability: R1
    publicationDate: "2020-12-13"
    accessDate: "2026-04-17"
    archived: false
  - url: "https://www.cisa.gov/news-events/cybersecurity-advisories/aa20-352a"
    publisher: "CISA"
    publisherType: government
    reliability: R1
    publicationDate: "2020-12-17"
    accessDate: "2026-04-17"
    archived: false
  - url: "https://www.whitehouse.gov/briefing-room/statements-releases/2021/04/15/fact-sheet-imposing-costs-for-harmful-foreign-activities-by-the-russian-government/"
    publisher: "The White House"
    publisherType: government
    reliability: R1
    publicationDate: "2021-04-15"
    accessDate: "2026-04-17"
    archived: false
  - url: "https://www.mandiant.com/resources/blog/evasive-attacker-leverages-solarwinds-supply-chain-compromises-with-sunburst-backdoor"
    publisher: "Mandiant"
    publisherType: vendor
    reliability: R1
    publicationDate: "2020-12-13"
    accessDate: "2026-04-17"
    archived: false
  - url: "https://www.microsoft.com/en-us/security/blog/2020/12/18/analyzing-solorigate-the-compromised-dll-file-that-started-a-sophisticated-cyberattack-and-how-microsoft-defender-helps-protect/"
    publisher: "Microsoft Security"
    publisherType: vendor
    reliability: R1
    publicationDate: "2020-12-18"
    accessDate: "2026-04-17"
    archived: false
  - url: "https://attack.mitre.org/campaigns/C0024/"
    publisher: "MITRE ATT&CK"
    publisherType: research
    reliability: R1
    publicationDate: "2025-09-19"
    accessDate: "2026-04-17"
    archived: false
mitreMappings:
  - techniqueId: "T1195.002"
    techniqueName: "Supply Chain Compromise: Compromise Software Supply Chain"
    tactic: "Initial Access"
    notes: "APT29 inserted SUNBURST into signed SolarWinds Orion builds distributed through the normal update channel."
  - techniqueId: "T1071.001"
    techniqueName: "Application Layer Protocol: Web Protocols"
    tactic: "Command and Control"
    notes: "SUNBURST blended its C2 into Orion Improvement Program HTTP traffic."
  - techniqueId: "T1098.001"
    techniqueName: "Account Manipulation: Additional Cloud Credentials"
    tactic: "Persistence"
    notes: "Operators added credentials to OAuth applications and service principals during follow-on cloud exploitation."
  - techniqueId: "T1484.002"
    techniqueName: "Domain or Tenant Policy Modification: Trust Modification"
    tactic: "Defense Evasion"
    notes: "APT29 modified federation trust settings to abuse forged SAML tokens in victim cloud environments."
  - techniqueId: "T1114.002"
    techniqueName: "Email Collection: Remote Email Collection"
    tactic: "Collection"
    notes: "High-value targets had mailboxes collected after the Orion compromise was used as initial access."
---

## Executive Summary

The SolarWinds campaign was a multi-stage espionage operation conducted by Russia's SVR, tracked publicly as APT29. The operators compromised the SolarWinds Orion software build pipeline, implanted the SUNBURST backdoor into signed updates, and distributed those updates to roughly 18,000 customers between March and June 2020. Only a much smaller subset of victims were selected for hands-on follow-on exploitation, but those targets included U.S. federal agencies, consultancies, and major technology providers.

What made the campaign exceptional was not just the build-system compromise itself, but the disciplined follow-on tradecraft. Once inside selected environments, the operators abused identity infrastructure, cloud application permissions, and mail systems to conduct long-dwell intelligence collection while blending into legitimate administrative activity. The operation remained publicly unknown until FireEye disclosed its own breach in December 2020, triggering a government-wide response and later formal U.S. and U.K. attribution in April 2021.

## Technical Analysis

The campaign hinged on a compromise of SolarWinds' Orion build environment no later than fall 2019. The operators used SUNSPOT to watch the Orion build process and inject SUNBURST into the `SolarWinds.Orion.Core.BusinessLayer.dll` component during compilation. Because the malicious code moved through the legitimate build and signing pipeline, downstream customers received a trusted SolarWinds update that executed in a normal product context.

SUNBURST used delay and environment-aware logic to reduce the chance of early discovery. After installation it waited through a dormancy window, profiled the host and domain, and then initiated staged beaconing through attacker-controlled infrastructure masquerading as Orion telemetry. This allowed the operators to separate mass distribution from selective exploitation: the backdoor gave broad reach, but the human operators only escalated on organizations that matched intelligence priorities.

For those selected targets, the campaign quickly became an identity and cloud access operation. Public reporting tied the activity to additional credential theft, mailbox collection, OAuth application abuse, federation-trust manipulation, and forged SAML token use. Secondary tools such as TEARDROP and RAINDROP appeared in some environments, but the strategic value of the campaign came from abusing trusted enterprise control planes rather than deploying noisy malware at scale.

## Attack Chain

### Stage 1: Build Pipeline Compromise

APT29 obtained access to SolarWinds' development or build environment and positioned SUNSPOT to tamper with Orion builds.

### Stage 2: Trusted Software Distribution

Trojanized Orion releases were signed and delivered through SolarWinds' standard update mechanism, giving the campaign broad reach across government and enterprise networks.

### Stage 3: Dormant Beaconing and Victim Profiling

SUNBURST delayed execution, profiled host environments, and beaconed through infrastructure designed to resemble legitimate Orion traffic so operators could identify high-value victims.

### Stage 4: Selective Follow-on Exploitation

Operators deployed additional tooling only into chosen environments, preserving stealth and reducing the forensic footprint across the broader 18,000-install population.

### Stage 5: Identity and Cloud Abuse

Within priority victims, the campaign shifted to credential theft, OAuth and service principal abuse, federation trust changes, and mailbox collection to sustain intelligence access.

### Stage 6: Intelligence Collection

The final objective was long-dwell access to executive communications, policy documents, cloud-hosted content, and other strategic material aligned with SVR collection priorities.

## MITRE ATT&CK Mapping

### Initial Access

T1195.002 - Supply Chain Compromise: Compromise Software Supply Chain: The campaign's defining access vector was the insertion of SUNBURST into signed Orion software releases.

### Command and Control

T1071.001 - Application Layer Protocol: Web Protocols: SUNBURST used web traffic patterns that mimicked Orion telemetry to hide C2.

### Persistence

T1098.001 - Account Manipulation: Additional Cloud Credentials: Follow-on activity included adding or hijacking credentials on cloud application objects.

### Defense Evasion

T1484.002 - Domain or Tenant Policy Modification: Trust Modification: Operators modified federation trust material to support forged SAML token abuse.

### Collection

T1114.002 - Email Collection: Remote Email Collection: Mailbox access and export were central to the intelligence objective of the campaign.

## Timeline

### 2019-10-01 - Build Environment Access Established

Public reporting places attacker access to SolarWinds systems by fall 2019, giving the operators time to study and tamper with the Orion build process.

### 2020-03-26 - First Trojanized Orion Update Released

SolarWinds began distributing compromised Orion releases that contained the SUNBURST backdoor.

### 2020-06-01 - Compromised Update Window Closes

The known SUNBURST distribution period ended after the affected Orion releases had been pushed to customers.

### 2020-12-08 - FireEye Detects Its Own Intrusion

FireEye's investigation into stolen red-team tooling set off the chain of disclosure that exposed the SolarWinds intrusion set.

### 2020-12-13 - SolarWinds Compromise Publicly Identified

Mandiant and Microsoft published early technical reporting, while CISA issued Emergency Directive 21-01 for federal agencies.

### 2021-04-15 - U.S. and U.K. Governments Attribute the Campaign to SVR

The White House and the U.K. NCSC publicly linked the campaign to Russia's Foreign Intelligence Service and imposed costs in response.

## Remediation & Mitigation

Organizations affected by the campaign had to treat the issue as both a software supply chain compromise and an identity compromise. Immediate actions included isolating affected Orion infrastructure, hunting for SUNBURST and follow-on indicators, and determining whether post-compromise abuse extended into Active Directory, AD FS, Azure AD, Exchange, or Microsoft 365.

The campaign underscored several durable defensive priorities: harden build pipelines, monitor privileged identity changes, restrict service-principal and federation-trust modifications, alert on unexpected mailbox export activity, and require stronger review around third-party software trust. For cloud-facing environments, remediation had to include certificate rotation, credential rotation, OAuth application review, and validation that no unauthorized trust material remained in place.

## Sources & References

- [CISA: ED 21-01 - Mitigate SolarWinds Orion Code Compromise](https://www.cisa.gov/news-events/directives/ed-21-01-mitigate-solarwinds-orion-code-compromise) — CISA, 2020-12-13
- [CISA: AA20-352A - Advanced Persistent Threat Compromise of Government Agencies, Critical Infrastructure, and Private Sector Organizations](https://www.cisa.gov/news-events/cybersecurity-advisories/aa20-352a) — CISA, 2020-12-17
- [The White House: Imposing Costs for Harmful Foreign Activities by the Russian Government](https://www.whitehouse.gov/briefing-room/statements-releases/2021/04/15/fact-sheet-imposing-costs-for-harmful-foreign-activities-by-the-russian-government/) — The White House, 2021-04-15
- [Mandiant: Highly Evasive Attacker Leverages SolarWinds Supply Chain to Compromise Multiple Global Victims With SUNBURST Backdoor](https://www.mandiant.com/resources/blog/evasive-attacker-leverages-solarwinds-supply-chain-compromises-with-sunburst-backdoor) — Mandiant, 2020-12-13
- [Microsoft Security: Analyzing Solorigate, the Compromised DLL File That Started a Sophisticated Cyberattack](https://www.microsoft.com/en-us/security/blog/2020/12/18/analyzing-solorigate-the-compromised-dll-file-that-started-a-sophisticated-cyberattack-and-how-microsoft-defender-helps-protect/) — Microsoft Security, 2020-12-18
- [MITRE ATT&CK: SolarWinds Compromise (C0024)](https://attack.mitre.org/campaigns/C0024/) — MITRE ATT&CK, 2025-09-19
