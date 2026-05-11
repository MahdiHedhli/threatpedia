---
name: "Dragonfly"
aliases:
  - "Energetic Bear"
  - "Crouching Yeti"
  - "Group 24"
  - "TEMP.Isotope"
affiliation: "Russian Federation"
motivation: "Espionage"
status: active
country: "Russia"
firstSeen: "2011"
lastSeen: "2019"
targetSectors:
  - "Energy"
  - "Nuclear"
  - "Aviation"
  - "Water and Wastewater"
  - "Critical Manufacturing"
  - "Oil and Gas"
  - "Electric Utilities"
targetGeographies:
  - "United States"
  - "Western Europe"
  - "Turkey"
  - "Switzerland"
tools:
  - "Havex"
  - "Oldrea"
  - "Karagany"
  - "Phishery"
mitreMappings:
  - techniqueId: "T1195.002"
    techniqueName: "Compromise Software Supply Chain"
    tactic: "Initial Access"
    attack-version: "v19"
    notes: "Dragonfly trojanized legitimate ICS software packages from three industrial control system vendors, embedding the Havex RAT into installer packages distributed via vendor update mechanisms."
  - techniqueId: "T1566.001"
    techniqueName: "Spearphishing Attachment"
    tactic: "Initial Access"
    attack-version: "v19"
    notes: "Dragonfly sent spearphishing emails containing malicious Microsoft Office documents and PDF attachments to employees at energy sector organizations."
  - techniqueId: "T1189"
    techniqueName: "Drive-by Compromise"
    tactic: "Initial Access"
    attack-version: "v19"
    notes: "Dragonfly compromised energy-sector and ICS vendor websites to serve malicious content to site visitors, using watering-hole attacks as a secondary delivery mechanism alongside spearphishing."
  - techniqueId: "T1078"
    techniqueName: "Valid Accounts"
    tactic: "Persistence"
    attack-version: "v19"
    notes: "Dragonfly actors harvested and reused legitimate credentials to maintain persistent access to victim environments, as documented in CISA alert TA17-293A."
  - techniqueId: "T1133"
    techniqueName: "External Remote Services"
    tactic: "Initial Access"
    attack-version: "v19"
    notes: "Following credential harvesting, Dragonfly actors used VPN and other remote access services to access victim networks, enabling direct operator-controlled entry into target environments."
  - techniqueId: "T1082"
    techniqueName: "System Information Discovery"
    tactic: "Discovery"
    attack-version: "v19"
    notes: "Dragonfly conducted reconnaissance on victim ICS environments, gathering system configuration and network topology data to map operational technology infrastructure."
attributionConfidence: A2
attributionRationale: "Attributed to Russian government actors by CISA and US government in joint advisory TA17-293A (October 2017). MITRE ATT&CK tracks as G0035. Targeting patterns and tooling are consistent with a state-mandated ICS espionage program."
reviewStatus: "draft_ai"
generatedBy: "dangermouse-bot"
generatedDate: 2026-05-10
tags:
  - "russia"
  - "state-sponsored"
  - "ics"
  - "scada"
  - "energy-sector"
  - "espionage"
  - "critical-infrastructure"
  - "havex"
  - "watering-hole"
  - "supply-chain"
sources:
  - url: "https://attack.mitre.org/groups/G0035/"
    publisher: "MITRE ATT&CK"
    publisherType: research
    reliability: R1
    publicationDate: "2026-05-10"
    accessDate: "2026-05-10"
    archived: false
  - url: "https://www.cisa.gov/ncas/alerts/TA17-293A"
    publisher: "Cybersecurity and Infrastructure Security Agency"
    publisherType: government
    reliability: R1
    publicationDate: "2017-10-20"
    archived: false
  - url: "https://symantec-enterprise-blogs.security.com/blogs/threat-intelligence/dragonfly-energy-sector-cyber-attacks"
    publisher: "Symantec"
    publisherType: vendor
    reliability: R2
    publicationDate: "2017-09-06"
    archived: false
---

## Executive Summary

Dragonfly (also tracked as Energetic Bear, Crouching Yeti, Group 24, and TEMP.Isotope) is a Russian state-linked threat actor that has conducted sustained cyber-espionage operations against energy sector and industrial control system (ICS) targets since at least 2011. The group is assessed to operate in support of Russian government intelligence collection objectives, with operations focused on electric utilities, oil and gas companies, nuclear facilities, and other critical infrastructure sectors in the United States and Western Europe.

Dragonfly gained access to operational technology environments through a three-phase initial access strategy: spearphishing campaigns, watering-hole attacks against sector-specific websites, and the distribution of trojanized ICS software packages containing the `Havex` remote access trojan. A second wave of activity, referred to by Symantec as Dragonfly 2.0, began around 2015 and focused on gaining direct access to ICS control systems, including control room workstations.

The group's activity demonstrates a persistent interest in mapping and accessing critical infrastructure networks, with targeting patterns consistent with a long-term espionage and potential pre-positioning mandate.

## Notable Campaigns

### 2011–2014 — Initial Energy Sector Espionage Campaign

Dragonfly's earliest documented activity targeted defense and aviation firms before pivoting to energy sector organizations. During this period the group deployed the `Havex` RAT through trojanized ICS software installers distributed by three industrial control system vendors. Victims who downloaded legitimate software packages received trojanized versions that established backdoor access. The group also conducted watering-hole attacks against energy-sector websites and sent spearphishing emails to employees at target organizations across the United States and Europe.

### 2015–2017 — Dragonfly 2.0 Campaign

Beginning around 2015, Dragonfly launched a second campaign wave documented by Symantec and referenced in CISA advisory TA17-293A. The Dragonfly 2.0 activity targeted Western energy companies with a focus on gaining access to operational technology systems rather than establishing a presence on enterprise IT networks. Actors used `Phishery`-based credential harvesting, spearphishing with energy-sector-themed lures, and reuse of harvested credentials through VPN and remote access services. Symantec documented cases in which Dragonfly actors accessed control room systems, including screenshots of human-machine interfaces (HMIs) used to manage power generation and distribution equipment.

### 2017 — U.S. Critical Infrastructure Campaign (TA17-293A)

In October 2017, CISA published advisory TA17-293A documenting a Russian government campaign targeting US government entities and multiple critical infrastructure sectors including energy, nuclear, water, aviation, and critical manufacturing. The campaign used a staged approach: actors first compromised trusted third-party organizations connected to the intended targets, then used that access to pivot into primary target networks. Techniques included spearphishing with weaponized documents, credential harvesting, and lateral movement into ICS-adjacent environments.

## Technical Capabilities

Dragonfly's toolset includes both custom malware and publicly available utilities adapted for ICS-targeted intrusions.

**`Havex` / `Oldrea`**: The group's primary remote access trojan, `Havex` (also tracked as `Oldrea`) was used throughout the 2011–2014 campaign. `Havex` includes an OPC (OLE for Process Control) scanning component that enumerates ICS devices and collects configuration data from connected SCADA and DCS systems, transmitting the collected data to attacker-controlled infrastructure.

**`Karagany`**: A secondary backdoor used in parallel with `Havex`, capable of file upload and download, screenshot capture, and loading additional plugins for credential theft and browser data collection.

**`Phishery`**: A credential harvesting tool used during Dragonfly 2.0 to inject SMB authentication requests into Microsoft Word documents, capturing NetNTLM hashes when documents were opened.

**Watering Holes and Supply Chain**: The group demonstrated capability and willingness to compromise third-party infrastructure, including ICS vendor update servers and energy-sector news websites, to deliver malicious payloads without direct engagement of the primary target.

**Credential Reuse**: CISA TA17-293A documented the use of harvested credentials to access victim environments through VPN and remote desktop services, enabling persistent access that blended with legitimate administrator activity.

## Attribution

Dragonfly is attributed to the Russian government by US government authorities. CISA advisory TA17-293A, published jointly with the FBI and Department of Homeland Security in October 2017, directly attributed the documented campaign to "Russian government cyber actors." The advisory described the actors as conducting a sustained multi-year effort targeting US critical infrastructure sectors.

MITRE ATT&CK tracks the group as G0035 under the name Dragonfly. Multiple independent security vendors — including Symantec — have published overlapping technical assessments consistent with a single Russian state-linked actor operating across the documented timeframe.

The group's operational focus on ICS reconnaissance and access — rather than financial theft or ransomware deployment — is consistent with a state espionage mandate oriented toward infrastructure mapping and potential pre-positioning for disruptive operations. No public criminal indictment directly naming Dragonfly operatives was available in the cited source set; the primary government attribution basis is the 2017 CISA/FBI/DHS joint advisory.

## MITRE ATT&CK Profile

**Initial Access**: Dragonfly used three documented initial access vectors: trojanized ICS software update packages delivered via vendor infrastructure (`T1195.002`); spearphishing emails with malicious attachments targeting energy sector employees (`T1566.001`); and watering-hole attacks against energy and ICS vendor websites (`T1189`). Following credential harvesting, actors also entered victim environments directly via VPN and other external remote services using stolen credentials (`T1133`).

**Persistence**: Dragonfly maintained access through harvested and reused legitimate credentials (`T1078`), enabling persistent access that blended with normal administrator activity in target environments.

**Discovery**: The group conducted reconnaissance against victim ICS environments, gathering system configuration details and mapping operational technology infrastructure to identify ICS devices and network topology (`T1082`). The `Havex` RAT's OPC scanning module automated enumeration of connected ICS devices.

**Collection**: `Havex` collected ICS device configuration data through OPC scanning. `Karagany` captured screenshots. `Phishery` collected NetNTLM credential hashes from opened documents.

## Sources & References

- [MITRE ATT&CK: Dragonfly (G0035)](https://attack.mitre.org/groups/G0035/) — MITRE ATT&CK, 2026-05-10
- [Cybersecurity and Infrastructure Security Agency: Alert TA17-293A — Dragonfly: Western Energy Sector Targeted by Sophisticated Attack Group](https://www.cisa.gov/ncas/alerts/TA17-293A) — Cybersecurity and Infrastructure Security Agency, 2017-10-20
- [Symantec: Dragonfly: Western energy sector targeted by sophisticated attack group](https://symantec-enterprise-blogs.security.com/blogs/threat-intelligence/dragonfly-energy-sector-cyber-attacks) — Symantec, 2017-09-06
