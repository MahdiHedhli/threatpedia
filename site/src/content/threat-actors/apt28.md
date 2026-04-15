---
name: "APT28"
aliases:
  - "Fancy Bear"
  - "STRONTIUM"
  - "Sofacy"
  - "Pawn Storm"
  - "Forest Blizzard"
  - "Sednit"
  - "IRON TWILIGHT"
  - "Group 74"
affiliation: "Russia (GRU Unit 26165)"
motivation: "Espionage"
status: active
country: "Russia"
firstSeen: "2007"
lastSeen: "2025"
targetSectors:
  - "Government"
  - "Military"
  - "Defense"
  - "Media"
  - "Energy"
  - "Think Tanks"
targetGeographies:
  - "Global"
  - "NATO"
  - "Europe"
  - "United States"
  - "Ukraine"
tools:
  - "X-Agent"
  - "X-Tunnel"
  - "Zebrocy"
  - "Drovorub"
  - "Jaguar Tooth"
  - "CredoMap"
mitreMappings:
  - techniqueId: "T1566.001"
    techniqueName: "Phishing: Spearphishing Attachment"
    tactic: "Initial Access"
    notes: "APT28 frequently uses spearphishing emails with malicious attachments to gain initial access."
  - techniqueId: "T1071.001"
    techniqueName: "Application Layer Protocol: Web Protocols"
    tactic: "Command and Control"
    notes: "Uses HTTP/S for C2 communications across various malware families like X-Agent."
  - techniqueId: "T1588.006"
    techniqueName: "Obtain Capabilities: Vulnerabilities"
    tactic: "Resource Development"
    notes: "Known for acquiring and utilizing zero-day exploits (e.g., CVE-2023-23397)."
attributionConfidence: A1
attributionRationale: "Attributed with high confidence to the Russian General Staff Main Intelligence Directorate (GRU) Unit 26165 by the U.S. Department of Justice (2018 indictment) and international intelligence partners."
reviewStatus: "certified"
generatedBy: "penfold-bot"
generatedDate: 2026-04-15
tags:
  - "nation-state"
  - "russia"
  - "gru"
  - "espionage"
  - "apt28"
  - "fancy-bear"
sources:
  - url: "https://attack.mitre.org/groups/G0007/"
    publisher: "MITRE ATT&CK"
    publisherType: research
    reliability: R1
    accessDate: "2026-04-15"
    archived: false
  - url: "https://www.justice.gov/opa/pr/grand-jury-indicts-12-russian-intelligence-officers-conspiracy-conspire-aid-2016-presidential"
    publisher: "US Department of Justice"
    publisherType: government
    reliability: R1
    publicationDate: "2018-07-13"
    accessDate: "2026-04-15"
    archived: false
  - url: "https://www.cisa.gov/news-events/alerts/2023/04/18/russian-state-sponsored-and-cyber-criminal-threats-critical-infrastructure"
    publisher: "CISA"
    publisherType: government
    reliability: R1
    publicationDate: "2023-04-18"
    accessDate: "2026-04-15"
    archived: false
---

## Executive Summary

APT28 (Fancy Bear) is a sophisticated Russian state-sponsored threat actor attributed to the **Military Intelligence Service (GRU) Unit 26165**. Active since at least 2007, the group conducts strategic espionage campaigns in support of Russian government interests. Their activities involve targeting government, military, defense, energy, and media organizations globally, with a particular focus on NATO allies, the United States, and Ukraine.

The group is renowned for its technical proficiency and its role in some of the most high-profile influence operations and data breaches of the 21st century. APT28 operates with a dual mandate of information collection and psychological operations (Cyber-enabled Info Ops), often leaking stolen data to influence political outcomes.

## Notable Campaigns

### 2016 — United States Democratic National Committee (DNC)
APT28 was one of two GRU-linked groups (alongside APT29) that compromised the DNC networks. The group exfiltrated internal emails and documents, which were subsequently leaked via personas like "Guccifer 2.0" and platforms like DCLeaks to influence the 2016 U.S. Presidential Election.

### 2015 — German Bundestag Breach
In one of the most significant attacks on European parliamentary infrastructure, APT28 compromised the German Bundestag, stealing at least 16 gigabytes of data, including emails from members of parliament.

### 2023 — Cisco Router Exploitation (Jaguar Tooth)
APT28 demonstrated advanced technical capabilities by targeting Cisco IOS routers with custom malware known as "Jaguar Tooth." The campaign focused on unpatched vulnerabilities to establish persistent access and exfiltrate network traffic from critical infrastructure targets.

## Technical Capabilities

APT28 maintains a diverse and evolving toolkit of custom malware. Their primary backdoors, such as **X-Agent** (CHOPSTICK) and **X-Tunnel**, provide extensive command-and-control, file exfiltration, and lateral movement capabilities. The group is also known for developing specialized tools for specific platforms, such as **Drovorub** for Linux systems and **Zebrocy** for high-volume phishing.

The group possesses significant expertise in zero-day exploitation. They have been observed leveraging vulnerabilities in Microsoft Outlook (CVE-2023-23397), Adobe Flash, and various VPN/firewall solutions to gain initial access before patches are widely available. Their tradecraft includes sophisticated C2 infrastructure using compromised servers and fast-flux DNS to evade detection.

## Attribution

Attribution of APT28 to the Russian GRU is supported by a significant body of evidence from both private sector cybersecurity firms and government agencies. In July 2018, a U.S. Grand Jury indicted 12 Russian intelligence officers of Unit 26165 for their role in the DNC hack. The indictment provided granular details on the group's infrastructure, funding (via cryptocurrency mining), and internal coordination.

Five Eyes intelligence agencies (US, UK, CA, AU, NZ) have issued multiple joint advisories confirming the link between APT28 and the GRU. The attribution is based on technical indicators (TTPs), infrastructure overlaps, and the strategic alignment of their targets with Russian geopolitical objectives.

## MITRE ATT&CK Profile

| Tactic | Technique | Description |
|---|---|---|
| Initial Access | Spearphishing Attachment | Primary infection vector using weaponized documents. |
| Persistence | Scheduled Task/Job | use of Windows Task Scheduler for malware execution. |
| Defense Evasion | Indicator Removal | Deletion of logs and temporary files to hide activity. |
| Exfiltration | Exfiltration Over C2 Channel | Use of X-Tunnel and custom protocols to steal data. |

## Sources & References

- MITRE ATT&CK Group G0007: APT28 Profile
- US DOJ: Grand Jury Indictment of 12 Russian Intelligence Officers (2018)
- CISA AA23-110A: Russian State-Sponsored Exploitation of Cisco Routers (2023)
- Mandiant: APT28 - A Window into Russia's Cyber Espionage Operations (2014)
- NCSC UK: Advisory on APT28 activity targeting UK and international organizations
