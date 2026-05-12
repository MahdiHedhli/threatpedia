---
name: "REvil / Sodinokibi"
aliases:
  - "REvil"
  - "Sodinokibi"
  - "GOLD SOUTHFIELD"
  - "Pinchy Spider"
affiliation: "Cybercriminal"
motivation: "Financial / Ransomware Extortion"
status: "unknown"
country: "Unknown"
firstSeen: "2019"
lastSeen: "2021"
targetSectors:
  - "Information Technology"
  - "Managed Service Providers"
  - "Government"
  - "Business Services"
  - "Critical Infrastructure"
targetGeographies:
  - "United States"
  - "International"
tools:
  - "REvil ransomware"
  - "Sodinokibi ransomware"
  - "ConnectWise Control"
mitreMappings:
  - techniqueId: "T1190"
    techniqueName: "Exploit Public-Facing Application"
    tactic: "Initial Access"
    notes: "MITRE reports GOLD SOUTHFIELD exploitation of public-facing applications, including Oracle WebLogic vulnerabilities, for initial compromise."
  - techniqueId: "T1195.002"
    techniqueName: "Compromise Software Supply Chain"
    tactic: "Initial Access"
    notes: "MITRE reports GOLD SOUTHFIELD distribution of ransomware through compromised software supply-chain paths."
  - techniqueId: "T1199"
    techniqueName: "Trusted Relationship"
    tactic: "Initial Access"
    notes: "MITRE reports GOLD SOUTHFIELD compromise of managed service providers to deliver malware to downstream customers."
  - techniqueId: "T1219"
    techniqueName: "Remote Access Tools"
    tactic: "Command and Control"
    notes: "MITRE reports GOLD SOUTHFIELD use of ConnectWise Control to deploy REvil."
  - techniqueId: "T1059.001"
    techniqueName: "PowerShell"
    tactic: "Execution"
    notes: "MITRE reports GOLD SOUTHFIELD staging and execution of PowerShell scripts on compromised hosts."
  - techniqueId: "T1486"
    techniqueName: "Data Encrypted for Impact"
    tactic: "Impact"
    notes: "DOJ described Sodinokibi/REvil deployments that encrypted victim computers, and MITRE maps REvil ransomware to data encryption for impact."
attributionConfidence: "A3"
attributionRationale: "DOJ and FBI sources identify Sodinokibi/REvil ransomware affiliates and alleged operators, while MITRE tracks GOLD SOUTHFIELD as the financially motivated group operating REvil ransomware-as-a-service. Public sources support cybercriminal attribution but do not establish state sponsorship."
reviewStatus: "draft_ai"
generatedBy: "dangermouse-bot"
generatedDate: 2026-05-12
tags:
  - "ransomware"
  - "raas"
  - "revil"
  - "sodinokibi"
  - "supply-chain"
  - "kaseya"
sources:
  - url: "https://www.cisa.gov/news-events/alerts/2021/07/02/kaseya-vsa-supply-chain-ransomware-attack"
    publisher: "CISA"
    publisherType: "government"
    reliability: "R1"
    publicationDate: "2021-07-02"
    accessDate: "2026-05-12"
    archived: false
  - url: "https://www.justice.gov/usao-ndtx/pr/ukrainian-arrested-and-charged-ransomware-attack-kaseya"
    publisher: "U.S. Department of Justice"
    publisherType: "government"
    reliability: "R1"
    publicationDate: "2021-11-08"
    accessDate: "2026-05-12"
    archived: false
  - url: "https://www.fbi.gov/wanted/cyber/yevgeniy-igorevich-polyanin/"
    publisher: "FBI"
    publisherType: "government"
    reliability: "R1"
    publicationDate: "2021-11-04"
    accessDate: "2026-05-12"
    archived: false
  - url: "https://attack.mitre.org/groups/G0115/"
    publisher: "MITRE ATT&CK"
    publisherType: "research"
    reliability: "R1"
    publicationDate: "2025-04-16"
    accessDate: "2026-05-12"
    archived: false
---

## Executive Summary

REvil, also known as Sodinokibi, is a ransomware-as-a-service and extortion operation tracked by MITRE ATT&CK as GOLD SOUTHFIELD. MITRE describes GOLD SOUTHFIELD as a financially motivated threat group that operates REvil ransomware-as-a-service and provides backend infrastructure for affiliates recruited on underground forums.

The operation is associated with ransomware deployment, data-theft extortion, and affiliate-driven intrusions. DOJ and FBI public records identify Sodinokibi/REvil affiliates and alleged operators, including charges and seizure actions announced in November 2021. Those public records support cybercriminal attribution but do not establish state sponsorship for the operation.

## Notable Campaigns

The July 2021 Kaseya VSA supply-chain incident is the principal campaign documented in the cited public sources. [CISA: Kaseya VSA Supply-Chain Ransomware Attack](https://www.cisa.gov/news-events/alerts/2021/07/02/kaseya-vsa-supply-chain-ransomware-attack) stated that CISA was responding to a supply-chain ransomware attack against Kaseya VSA and multiple managed service providers using VSA software. CISA urged affected organizations to review Kaseya guidance and shut down VSA servers.

[U.S. Department of Justice: Ukrainian Arrested and Charged with Ransomware Attack on Kaseya](https://www.justice.gov/usao-ndtx/pr/ukrainian-arrested-and-charged-ransomware-attack-kaseya) later announced charges against Yaroslav Vasinskyi for alleged ransomware attacks including the July 2021 Kaseya attack. DOJ stated that the Kaseya attack involved malicious Sodinokibi/REvil code deployed through a Kaseya product to endpoints on customer networks.

## Technical Capabilities

MITRE ATT&CK reports that GOLD SOUTHFIELD used multiple initial-access paths, including exploitation of public-facing applications, malicious spam, external remote services, managed service provider relationships, and software supply-chain compromise. MITRE also reports use of ConnectWise Control to deploy REvil and staging or execution of PowerShell scripts on compromised hosts.

DOJ described Sodinokibi/REvil deployments in which defendants allegedly accessed victim networks, deployed ransomware, encrypted victim computers, and left ransom notes directing victims to Tor or web addresses for payment instructions. DOJ and FBI sources also describe data-theft pressure in which nonpayment could result in stolen data being posted or claimed to be sold.

## Attribution

Public sources support attribution to a financially motivated cybercriminal ransomware ecosystem. MITRE tracks the associated group as GOLD SOUTHFIELD and lists Pinchy Spider as an associated public name. FBI described Yevgeniy Igorevich Polyanin as one of many Sodinokibi/REvil ransomware affiliates and stated that he is believed to be in Russia, possibly Barnaul.

Named individuals in DOJ and FBI records should be treated as alleged affiliates or operators unless a source states otherwise. The cited public sources do not establish that the entire REvil/Sodinokibi operation was directed by a state intelligence service.

## MITRE ATT&CK Profile

T1190 - Exploit Public-Facing Application: MITRE reports GOLD SOUTHFIELD exploitation of public-facing applications, including Oracle WebLogic vulnerabilities, for initial compromise.

T1195.002 - Compromise Software Supply Chain: MITRE reports GOLD SOUTHFIELD distribution of ransomware through compromised software supply-chain paths.

T1199 - Trusted Relationship: MITRE reports GOLD SOUTHFIELD compromise of managed service providers to deliver malware to downstream customers.

T1219 - Remote Access Tools: MITRE reports GOLD SOUTHFIELD use of ConnectWise Control to deploy REvil.

T1059.001 - PowerShell: MITRE reports GOLD SOUTHFIELD staging and execution of PowerShell scripts on compromised hosts.

T1486 - Data Encrypted for Impact: DOJ described Sodinokibi/REvil ransomware deployments that encrypted victim computers.

## Sources & References

- [CISA: Kaseya VSA Supply-Chain Ransomware Attack](https://www.cisa.gov/news-events/alerts/2021/07/02/kaseya-vsa-supply-chain-ransomware-attack) — CISA, 2021-07-02
- [U.S. Department of Justice: Ukrainian Arrested and Charged with Ransomware Attack on Kaseya](https://www.justice.gov/usao-ndtx/pr/ukrainian-arrested-and-charged-ransomware-attack-kaseya) — U.S. Department of Justice, 2021-11-08
- [FBI: Yevgeniy Igorevich Polyanin](https://www.fbi.gov/wanted/cyber/yevgeniy-igorevich-polyanin/) — FBI, 2021-11-04
- [MITRE ATT&CK: GOLD SOUTHFIELD](https://attack.mitre.org/groups/G0115/) — MITRE ATT&CK, 2025-04-16
