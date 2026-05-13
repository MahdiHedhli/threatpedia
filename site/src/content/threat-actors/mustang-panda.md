---
name: "Mustang Panda"
aliases:
  - "BRONZE PRESIDENT"
  - "Earth Preta"
  - "HoneyMyte"
  - "RedDelta"
  - "TA416"
  - "PKPLUG"
affiliation: "China (assessed)"
motivation: "Espionage"
status: active
country: "China"
firstSeen: "2012"
lastSeen: "2024"
targetSectors:
  - "Government"
  - "Diplomatic Missions"
  - "Non-Governmental Organizations"
  - "Religious Organizations"
  - "Research Institutes"
targetGeographies:
  - "Southeast Asia"
  - "Europe"
  - "South Asia"
  - "Africa"
tools:
  - "PlugX"
  - "TONEINS"
  - "TONESHELL"
  - "PUBLOAD"
mitreMappings:
  - techniqueId: "T1566.001"
    techniqueName: "Spearphishing Attachment"
    tactic: "Initial Access"
    attackVersion: "v19"
    confidence: confirmed
    evidence: "Cisco Talos documented spearphishing emails with malicious document attachments as the primary initial access vector in Mustang Panda's European targeting campaigns."
  - techniqueId: "T1204.002"
    techniqueName: "Malicious File"
    tactic: "Execution"
    attackVersion: "v19"
    confidence: confirmed
    evidence: "MITRE ATT&CK G0129 documents victim execution of malicious files as a consistent component of Mustang Panda infection chains, triggering the DLL side-loading stage."
  - techniqueId: "T1091"
    techniqueName: "Replication Through Removable Media"
    tactic: "Lateral Movement"
    attackVersion: "v19"
    confidence: confirmed
    evidence: "MITRE ATT&CK G0129 and the Secureworks BRONZE PRESIDENT profile document PlugX propagation via USB removable drives, enabling lateral movement in air-gapped or restricted-connectivity environments."
  - techniqueId: "T1071.001"
    techniqueName: "Web Protocols"
    tactic: "Command and Control"
    attackVersion: "v19"
    confidence: confirmed
    evidence: "MITRE ATT&CK G0129 documents Mustang Panda's use of HTTP and HTTPS for PlugX command-and-control communications."
atlasMappings: []
attributionConfidence: A3
attributionRationale: "Multiple independent assessments from MITRE ATT&CK (G0129), Secureworks (BRONZE PRESIDENT), and Cisco Talos attribute Mustang Panda to a China-based actor based on targeting patterns consistent with Chinese foreign policy interests, Chinese-language artifacts in tooling, and infrastructure analysis. No government indictment or formal official attribution has been issued."
reviewStatus: "draft_ai"
generatedBy: "dangermouse-bot"
generatedDate: 2026-05-13
tags:
  - "nation-state"
  - "china"
  - "espionage"
  - "plugx"
  - "diplomatic-targeting"
  - "southeast-asia"
sources:
  - url: "https://attack.mitre.org/groups/G0129/"
    publisher: "MITRE ATT&CK"
    publisherType: research
    reliability: R1
    publicationDate: "2026-05-12"
    accessDate: "2026-05-13"
    archived: false
  - url: "https://blog.talosintelligence.com/mustang-panda-targets-europe/"
    publisher: "Cisco Talos"
    publisherType: vendor
    reliability: R1
    publicationDate: "2022-09-08"
    accessDate: "2026-05-13"
    archived: false
  - url: "https://www.secureworks.com/research/threat-profiles/bronze-president"
    publisher: "Secureworks"
    publisherType: vendor
    reliability: R1
    publicationDate: "2026-05-13"
    accessDate: "2026-05-13"
    archived: false
  - url: "https://www.cisa.gov/eviction-strategies-tool/info-attack/T1566.001"
    publisher: "CISA"
    publisherType: government
    reliability: R1
    publicationDate: "2026-05-13"
    accessDate: "2026-05-13"
    archived: false
---

## Executive Summary

Mustang Panda is a China-based espionage-focused threat group active since at least 2012. The group is tracked under multiple vendor designations, including BRONZE PRESIDENT (Secureworks), Earth Preta (Trend Micro), RedDelta (Recorded Future), and TA416 (Proofpoint). Mustang Panda targets government, diplomatic, non-governmental organization (NGO), and religious institution networks across Southeast Asia, Europe, South Asia, and Africa.

The group is best known for sustained use of the PlugX backdoor, delivered predominantly through spearphishing campaigns and DLL side-loading infection chains. In a 2022 campaign documented by Cisco Talos, Mustang Panda deployed a newer malware family — TONEINS, TONESHELL, and PUBLOAD — against European diplomatic and government entities, demonstrating continued development of custom tooling. Secureworks documents long-running Mustang Panda (BRONZE PRESIDENT) operations targeting government and NGO entities throughout Southeast Asia.

## Notable Campaigns

### European Diplomatic Targeting (2022)

Cisco Talos documented Mustang Panda operations targeting European government and diplomatic entities. The campaign used spearphishing lures with geopolitically themed documents and deployed three distinct malware components: **TONEINS**, a C++ loader that installs and executes the next stage; **TONESHELL**, a backdoor communicating over a custom TCP-based protocol; and **PUBLOAD**, a stager that retrieves secondary payloads from actor-controlled infrastructure. The infection chain relied on DLL side-loading from legitimate signed executables. Cisco Talos noted that the targeting coincided with European diplomatic engagement around the conflict in Ukraine.

### Southeast Asia Government and NGO Operations

The Secureworks BRONZE PRESIDENT profile documents sustained Mustang Panda operations against government, diplomatic, and NGO entities across Southeast Asia. PlugX is the primary post-compromise implant in these operations, deployed via DLL side-loading. MITRE ATT&CK G0129 additionally documents PlugX propagation via USB removable drives as a lateral movement mechanism used against regional targets.

## Technical Capabilities

Mustang Panda's primary post-compromise tool is **PlugX** (also designated Korplug), a modular backdoor capable of file operations, remote shell access, keylogging, and screen capture. PlugX is delivered predominantly through DLL side-loading: a malicious DLL is placed alongside a legitimate signed executable, which loads the malicious library on launch, reducing behavioral detection signals.

In the 2022 European targeting campaign documented by Cisco Talos, the group deployed a distinct malware family:

- **TONEINS**: a C++ loader responsible for installing and executing TONESHELL
- **TONESHELL**: a backdoor using a custom TCP-based network protocol for C2 communication
- **PUBLOAD**: a stager that retrieves and executes additional payloads from actor-controlled infrastructure

MITRE ATT&CK G0129 and the Secureworks BRONZE PRESIDENT profile both document PlugX distribution via USB removable media, enabling propagation into air-gapped or restricted-connectivity network segments.

Initial access is achieved primarily through spearphishing emails with malicious document attachments that use geopolitically relevant lures to induce victim execution.

## Attribution

Mustang Panda is assessed as a China-based threat actor by multiple independent security research organizations. MITRE ATT&CK G0129 characterizes the group as China-based and active since at least 2012. The Secureworks BRONZE PRESIDENT profile and Cisco Talos reporting similarly attribute activity to a China-based actor, grounded in targeting patterns consistent with Chinese foreign policy interests, Chinese-language artifacts identified in malware and infrastructure, and operational characteristics overlapping with other China-nexus activity clusters.

No government indictment or formal official attribution has been issued for Mustang Panda. Attribution rests on vendor technical assessments and circumstantial evidence from multiple independent sources rather than legal proceedings.

## MITRE ATT&CK Profile

T1566.001 - Spearphishing Attachment: Spearphishing emails with malicious document attachments are the documented primary delivery vector, confirmed by Cisco Talos in the European diplomatic targeting campaign.

T1204.002 - Malicious File: Victims execute malicious files delivered via phishing, triggering the DLL side-loading infection chain, per MITRE ATT&CK G0129.

T1091 - Replication Through Removable Media: PlugX spreading via USB drives is documented in MITRE ATT&CK G0129 and the Secureworks BRONZE PRESIDENT profile, supporting propagation into environments with limited network connectivity.

T1071.001 - Web Protocols: PlugX uses HTTP and HTTPS for C2 communications, as documented in MITRE ATT&CK G0129.

## Sources & References

- [MITRE ATT&CK: Mustang Panda (G0129)](https://attack.mitre.org/groups/G0129/) — MITRE ATT&CK, 2026-05-12
- [Cisco Talos: Mustang Panda Targets Europe](https://blog.talosintelligence.com/mustang-panda-targets-europe/) — Cisco Talos, 2022-09-08
- [Secureworks: BRONZE PRESIDENT Threat Profile](https://www.secureworks.com/research/threat-profiles/bronze-president) — Secureworks, 2026-05-13
- [CISA: T1566.001 Spearphishing Attachment](https://www.cisa.gov/eviction-strategies-tool/info-attack/T1566.001) — CISA, 2026-05-13
