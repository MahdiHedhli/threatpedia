---
name: "APT1"
aliases:
  - "Comment Crew"
  - "Comment Panda"
  - "TG-8223"
  - "BrownFox"
  - "Group 3"
  - "GIF89a"
affiliation: "China (PLA Unit 61398)"
motivation: "Espionage"
status: inactive
country: "China"
firstSeen: "2006"
lastSeen: "2014"
targetSectors:
  - "Technology"
  - "Aerospace & Defense"
  - "Telecommunications"
  - "Energy & Utilities"
  - "Financial Services"
  - "Government"
targetGeographies:
  - "United States"
  - "Canada"
  - "United Kingdom"
  - "Global"
tools:
  - "WEBC2"
  - "BISCUIT"
  - "GLOOXMAIL"
  - "CALENDAR"
  - "GETMAIL"
  - "MAPIGET"
  - "BANGAT"
mitreMappings:
  - techniqueId: "T1566.002"
    techniqueName: "Phishing: Spearphishing Link"
    tactic: "Initial Access"
    notes: "APT1 used spearphishing emails containing links to credential-harvesting sites and malware downloads."
  - techniqueId: "T1059.001"
    techniqueName: "Command and Scripting Interpreter: PowerShell"
    tactic: "Execution"
    notes: "Utilized command-line interfaces and scripting for post-compromise activities."
  - techniqueId: "T1003"
    techniqueName: "OS Credential Dumping"
    tactic: "Credential Access"
    notes: "APT1 used Mimikatz and custom tools to dump credentials for lateral movement."
attributionConfidence: A1
attributionRationale: "Attributed to PLA Unit 61398 by Mandiant's 2013 APT1 report, corroborated by a 2014 U.S. DOJ indictment of five PLA officers."
reviewStatus: "certified"
generatedBy: "penfold-bot"
generatedDate: 2026-04-16
tags:
  - "nation-state"
  - "china"
  - "pla"
  - "espionage"
  - "apt1"
  - "comment-crew"
sources:
  - url: "https://attack.mitre.org/groups/G0006/"
    publisher: "MITRE ATT&CK"
    publicationDate: "2025-04-25"
    publisherType: research
    reliability: R1
    accessDate: "2026-04-27"
    archived: false
  - url: "https://www.justice.gov/opa/pr/us-charges-five-chinese-military-hackers-cyber-espionage-against-us-corporations-and-labor"
    publisher: "U.S. Department of Justice"
    publisherType: government
    reliability: R1
    publicationDate: "2014-05-19"
    accessDate: "2026-04-27"
    archived: false
  - url: "https://www.mandiant.com/resources/apt1-exposing-one-of-chinas-cyber-espionage-units"
    publisher: "Mandiant"
    publisherType: vendor
    reliability: R1
    publicationDate: "2013-02-18"
    accessDate: "2026-04-27"
    archived: false
---

## Executive Summary

APT1, also known as Comment Crew, is a Chinese state-sponsored cyber-espionage group attributed to **People's Liberation Army (PLA) Unit 61398**, based in the Pudong district of Shanghai. The cited public record documents activity from at least 2006 through the 2014 U.S. indictment period, including sustained espionage campaigns targeting more than 140 organizations across 20 industries, with a primary focus on English-speaking countries.

APT1 was the subject of Mandiant's landmark 2013 report, which provided one of the first detailed public attributions of a nation-state cyber-espionage operation to a specific military unit. The report, combined with a 2014 U.S. federal indictment of five PLA officers, marked a turning point in public attribution of state-sponsored cyber operations.

## Notable Campaigns

### 2006-2013 -- Sustained Industrial Espionage

APT1 conducted persistent, long-duration intrusions against organizations in the technology, aerospace, telecommunications, and energy sectors. The group maintained access to compromised networks for an average of 356 days, with one intrusion lasting 1,764 days (nearly five years). The group exfiltrated hundreds of terabytes of data, including proprietary technology designs, business strategies, and negotiation positions.

### 2010 -- U.S. Critical Infrastructure Targeting

The group targeted multiple U.S. companies involved in critical infrastructure, including energy utilities and pipeline operators. The intrusions focused on exfiltrating engineering schematics, SCADA system documentation, and operational procedures.

### 2012 -- Coca-Cola Acquisition Intelligence

During a Coca-Cola acquisition attempt of a Chinese company, APT1 compromised Coca-Cola's network and exfiltrated negotiation strategy documents. The intrusion demonstrated the group's mandate to support Chinese state economic interests.

## Technical Capabilities

APT1 operated a large infrastructure of over 1,000 command-and-control servers, using a combination of custom malware families and publicly available tools. The group's primary backdoors included **WEBC2** (which used hidden web pages for C2 commands), **BISCUIT** (a full-featured remote access tool), and **GETMAIL** for email extraction.

The group relied on spearphishing emails with malicious attachments or links as the primary initial access vector. Once inside a network, APT1 used credential harvesting tools including custom variants of Mimikatz, established persistent access through scheduled tasks and service installations, and moved laterally using Remote Desktop Protocol (RDP) and Windows admin shares.

APT1's operational model was characterized by scale over stealth. The group operated in standard Chinese business hours (Beijing time) and used a relatively small number of malware families across a large target base, which ultimately enabled Mandiant's comprehensive tracking and attribution.

## Attribution

The attribution of APT1 to PLA Unit 61398 rests on multiple lines of evidence. Mandiant's 2013 report traced the group's operations to a specific building in Shanghai's Pudong New Area, matching known PLA Unit 61398 facilities. The analysis correlated C2 infrastructure registration data, operator personas, and operational patterns with the unit.

In May 2014, the U.S. Department of Justice indicted five named PLA officers of Unit 61398 for economic espionage and computer fraud. The indictment identified specific victims and attributed particular intrusions to individual operators. This was the first time the U.S. government brought criminal charges against state-sponsored hackers.

## MITRE ATT&CK Profile

**Initial Access**: APT1 relied on spearphishing links (T1566.002) and spearphishing attachments (T1566.001) as primary initial access vectors. Emails were crafted with industry-specific lures relevant to each target.

**Persistence**: The group used scheduled tasks (T1053), Windows services (T1543.003), and registry run keys (T1547.001) to maintain persistence across system reboots.

**Credential Access**: OS credential dumping (T1003) using custom and publicly available tools enabled the group to harvest domain credentials for lateral movement.

**Lateral Movement**: Remote Desktop Protocol (T1021.001) and SMB/Windows Admin Shares (T1021.002) were the primary lateral movement mechanisms.

**Exfiltration**: Data was staged in RAR archives and exfiltrated over C2 channels (T1041). The group used FTP (T1048.003) as an alternative exfiltration method.

## Sources & References

- [MITRE ATT&CK: APT1](https://attack.mitre.org/groups/G0006/) — MITRE ATT&CK, 2025-04-25
- [U.S. Department of Justice: Charges Against Five Chinese Military Hackers](https://www.justice.gov/opa/pr/us-charges-five-chinese-military-hackers-cyber-espionage-against-us-corporations-and-labor) — U.S. Department of Justice, 2014-05-19
- [Mandiant: APT1 - Exposing One of China's Cyber Espionage Units](https://www.mandiant.com/resources/apt1-exposing-one-of-chinas-cyber-espionage-units) — Mandiant, 2013-02-18
