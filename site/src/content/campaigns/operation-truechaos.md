---
campaignId: "TP-CAMP-2026-0005"
title: "Operation TrueChaos: TrueConf Supply Chain Pivot"
startDate: 2026-01-15
endDate: 2026-03-31
ongoing: false
attackType: "Zero-Day Supply Chain / Espionage"
severity: critical
sector: "Government"
geography: "Southeast Asia"
threatActor: "Chinese-nexus (unattributed)"
attributionConfidence: A4
cves:
  - "CVE-2026-3502"
relatedIncidents:
  - "operation-truechaos-trueconf-zero-day-2026"
reviewStatus: "draft_ai"
generatedBy: "dangermouse-bot"
generatedDate: 2026-04-21
tags:
  - "truechaos"
  - "trueconf"
  - "zero-day"
  - "supply-chain"
  - "espionage"
  - "southeast-asia"
  - "cisa-kev"
sources:
  - url: "https://research.checkpoint.com/2026/operation-truechaos-0-day-exploitation-against-southeast-asian-government-targets/"
    publisher: "Check Point Research"
    publisherType: vendor
    reliability: R1
    publicationDate: "2026-03-31"
    accessDate: "2026-04-21"
    archived: false
  - url: "https://nvd.nist.gov/vuln/detail/CVE-2026-3502"
    publisher: "National Vulnerability Database"
    publisherType: government
    reliability: R1
    publicationDate: "2026-03-30"
    accessDate: "2026-04-21"
    archived: false
  - url: "https://www.bleepingcomputer.com/news/security/hackers-exploit-trueconf-zero-day-to-push-malicious-software-updates/"
    publisher: "BleepingComputer"
    publisherType: media
    reliability: R2
    publicationDate: "2026-04-02"
    accessDate: "2026-04-21"
    archived: false
mitreMappings:
  - techniqueId: "T1195.002"
    techniqueName: "Compromise Software Supply Chain"
    tactic: "Initial Access"
    notes: "Adversaries abused the trusted TrueConf on-premises update relationship to distribute a trojanized client package."
  - techniqueId: "T1574.002"
    techniqueName: "DLL Side-Loading"
    tactic: "Defense Evasion"
    notes: "Malicious updates dropped files used for DLL sideloading through legitimate-looking software paths."
  - techniqueId: "T1021.001"
    techniqueName: "Remote Desktop Protocol"
    tactic: "Lateral Movement"
    notes: "Attackers utilized RDP for lateral movement across compromised government networks."
  - techniqueId: "T1071.001"
    techniqueName: "Web Protocols"
    tactic: "Command and Control"
    notes: "The campaign utilized HTTP/S for command-and-control communications, including interactions with Havoc infrastructure."
---

## Executive Summary

Operation TrueChaos is a targeted cyber-espionage campaign that emerged in early 2026, characterized by its abuse of the TrueConf video conferencing platform's update mechanism. The campaign primarily targeted government entities in Southeast Asia, leveraging a high-severity zero-day vulnerability (CVE-2026-3502) to execute a localized supply chain pivot.

The operation is defined by the strategic compromise of customer-operated, on-premises TrueConf servers. By gaining control of these central update sources, the adversary was able to distribute weaponized installer packages to dozens of downstream government agencies. Check Point Research, which discovered the activity, assesses with moderate confidence that the campaign is the work of a Chinese-nexus threat actor focused on regional intelligence collection.

## Technical Analysis

Operation TrueChaos relied on the exploitation of CVE-2026-3502, an improper verification of software updates flaw. The adversary demonstrated significant technical discipline, building malicious packages that successfully upgraded the victim's TrueConf version while simultaneously deploying stealthy post-exploitation components.

The campaign utilized DLL sideloading as its primary defense evasion tactic. The trojanized installers dropped a legitimate binary (`poweriso.exe`) alongside a malicious payload (`7z-x64.dll`). This allowed the attackers to execute arbitrary code within a trusted process context. Following initial entry, the actors engaged in hands-on-keyboard activity, utilizing Havoc command-and-control infrastructure and custom UAC bypass techniques to secure deep persistence and perform reconnaissance across the compromised networks.

## Attack Chain

### Stage 1: Compromise of On-Premises Update Server
The adversary gained control of customer-operated TrueConf servers within Southeast Asian government networks. The method of initial server compromise was not disclosed but provided the necessary foothold to tamper with the update mechanism.

### Stage 2: Malicious Package Distribution
The attacker replaced the legitimate `trueconf_client.exe` with a trojanized version. When connected clients checked for updates, the server advertised the malicious build, which the client downloaded and executed without performing adequate integrity or authenticity verification.

### Stage 3: Execution and Defense Evasion
Upon execution, the weaponized installer successfully updated the TrueConf client while dropping additional malicious files. The actor leveraged DLL sideloading through trusted application paths to bypass endpoint security controls and establish initial C2 communications.

### Stage 4: Post-Exploitation and Espionage
The actors utilized the initial foothold to conduct hands-on-keyboard reconnaissance, credential harvesting, and lateral movement via RDP across the compromised governmental IT infrastructure, aimed at exfiltrating sensitive state communications.

## MITRE ATT&CK Mapping

### Initial Access

T1195.002 - Supply Chain Compromise: Compromise Software Supply Chain: The campaign's core vector involved hijacking the TrueConf update flow from a compromised on-premises server.

### Defense Evasion

T1574.002 - Hijack Execution Flow: DLL Side-Loading: Attackers used a combination of legitimate binaries and malicious DLLs to execute payloads and evade endpoint detection.

### Lateral Movement

T1021.001 - Remote Services: Remote Desktop Protocol: Adversaries were observed using RDP to pivot between agencies within the compromised governmental IT infrastructure.

### Command and Control

T1071.001 - Application Layer Protocol: Web Protocols: The campaign utilized HTTP/S for C2 communications, frequently interacting with the Havoc framework.

## Timeline

### 2026-01-15 — Campaign Emergence
Check Point Research identifies early signs of targeted activity against Southeast Asian government entities utilizing on-premises TrueConf infrastructure.

### 2026-03-30 — Vulnerability Cataloging
CVE-2026-3502 is formally cataloged to describe the improper update verification flaw in the TrueConf Windows client.

### 2026-03-31 — Public Disclosure
Operation TrueChaos is publicly disclosed, providing details on the supply chain pivot and observed TTPs used by the Chinese-nexus adversary.

### 2026-04-02 — CISA KEV Addition
CISA adds CVE-2026-3502 to the Known Exploited Vulnerabilities catalog, mandating remediation for federal agencies by mid-April.

## Remediation & Mitigation

TrueConf has released desktop application version 8.5.3 to address the vulnerability. Organizations are urged to upgrade all Windows clients and audit on-premises TrueConf servers for unauthorized changes in update directories. Additionally, implementing strict API-layer access controls and monitoring for unauthorized RDP activity across internal segments can help mitigate the risk of similar supply chain pivots.

## Sources & References

- [Check Point Research: Operation TrueChaos: 0-Day Exploitation Against Southeast Asian Government Targets](https://research.checkpoint.com/2026/operation-truechaos-0-day-exploitation-against-southeast-asian-government-targets/) — Check Point Research, 2026-03-31
- [National Vulnerability Database: CVE-2026-3502 Detail](https://nvd.nist.gov/vuln/detail/CVE-2026-3502) — National Vulnerability Database, 2026-03-30
- [BleepingComputer: Hackers Exploit TrueConf Zero-Day to Push Malicious Software Updates](https://www.bleepingcomputer.com/news/security/hackers-exploit-trueconf-zero-day-to-push-malicious-software-updates/) — BleepingComputer, 2026-04-02
