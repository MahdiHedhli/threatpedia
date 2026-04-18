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
  - "Computrace"
mitreMappings:
  - techniqueId: "T1566.001"
    techniqueName: "Phishing: Spearphishing Attachment"
    tactic: "Initial Access"
    notes: "APT28 uses spearphishing emails with malicious attachments as a primary initial access vector."
  - techniqueId: "T1071.001"
    techniqueName: "Application Layer Protocol: Web Protocols"
    tactic: "Command and Control"
    notes: "Uses HTTP/S for C2 communications across malware families including X-Agent."
  - techniqueId: "T1588.006"
    techniqueName: "Obtain Capabilities: Vulnerabilities"
    tactic: "Resource Development"
    notes: "Known for acquiring and exploiting zero-day vulnerabilities such as CVE-2023-23397."
  - techniqueId: "T1078"
    techniqueName: "Valid Accounts"
    tactic: "Persistence"
    notes: "Harvests credentials via phishing and credential-stuffing to maintain persistent access."
attributionConfidence: A1
attributionRationale: "Attributed to GRU Unit 26165 by the U.S. Department of Justice (2018 indictment of 12 officers), corroborated by Five Eyes intelligence agencies and multiple private-sector firms."
reviewStatus: "under_review"
generatedBy: "penfold-bot"
generatedDate: 2026-04-16
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
    publicationDate: "2025-10-17"
    publisherType: research
    reliability: R1
    accessDate: "2026-04-16"
    archived: false
  - url: "https://www.justice.gov/opa/pr/us-charges-russian-gru-officers-international-hacking-and-related-influence-and"
    publisher: "US Department of Justice"
    publisherType: government
    reliability: R1
    publicationDate: "2018-10-04"
    accessDate: "2026-04-16"
    archived: false
  - url: "https://www.cisa.gov/news-events/cybersecurity-advisories/aa23-108a"
    publisher: "CISA"
    publisherType: government
    reliability: R1
    publicationDate: "2023-04-18"
    accessDate: "2026-04-16"
    archived: false
  - url: "https://www.mandiant.com/resources/apt28-a-window-into-russias-cyber-espionage-operations"
    publisher: "Mandiant"
    publisherType: vendor
    reliability: R1
    publicationDate: "2014-10-27"
    accessDate: "2026-04-16"
    archived: false
---

## Executive Summary

APT28, also tracked as Fancy Bear and Forest Blizzard, is a Russian state-sponsored cyber-espionage group attributed to the **Main Intelligence Directorate (GRU) Unit 26165** of the Russian General Staff. Active since at least 2007, the group conducts strategic intelligence collection operations in support of Russian government interests. APT28 targets government, military, defense, energy, and media organizations worldwide, with a particular focus on NATO member states, the United States, and Ukraine.

The group combines technical sophistication with information warfare capabilities. APT28 has been responsible for some of the most consequential cyber operations of the past decade, including the 2016 breach of the U.S. Democratic National Committee and sustained campaigns against European political institutions. The group demonstrates advanced capabilities in zero-day exploitation, custom malware development, and credential harvesting at scale.

## Notable Campaigns

### 2016 -- United States Democratic National Committee (DNC)

APT28 was one of two GRU-linked groups (alongside APT29) that compromised the DNC networks during 2015-2016. The group exfiltrated internal emails and documents, which were subsequently leaked via the "Guccifer 2.0" persona and the DCLeaks platform. A July 2018 U.S. federal indictment named 12 GRU officers and provided technical details of the operation, including the group's use of X-Agent malware and custom data exfiltration tools.

### 2015 -- German Bundestag Breach

APT28 compromised the German federal parliament (Bundestag) network, exfiltrating at least 16 gigabytes of data including emails from members of parliament. The breach was one of the most significant cyberattacks against European parliamentary infrastructure and led to a German federal arrest warrant for a GRU officer in 2020.

### 2023 -- Cisco Router Exploitation (Jaguar Tooth)

In a joint advisory (AA23-108A), CISA and international partners disclosed APT28's deployment of "Jaguar Tooth" malware targeting Cisco IOS routers. The campaign exploited CVE-2017-6742, an SNMP vulnerability, to establish persistent access to network infrastructure and exfiltrate routing configurations and network traffic.

### 2017-2018 -- Anti-Doping Agency Targeting

APT28 targeted the World Anti-Doping Agency (WADA) and related sports organizations following Russia's state-sponsored doping scandal. The group exfiltrated and selectively leaked athlete medical records in an effort to discredit the anti-doping process.

## Technical Capabilities

APT28 maintains a diverse and evolving toolkit of custom malware. Their primary backdoors include **X-Agent** (also known as CHOPSTICK), which provides cross-platform command-and-control, file exfiltration, and keystroke logging capabilities across Windows, Linux, macOS, iOS, and Android. **X-Tunnel** provides encrypted network tunneling for data exfiltration.

The group develops purpose-built tools for specific operational requirements. **Zebrocy** serves as a high-volume reconnaissance tool deployed through spearphishing campaigns, available in Delphi, AutoIt, C++, C#, and Go variants. **Drovorub**, disclosed by NSA/FBI in 2020, is a Linux rootkit providing persistent access to compromised systems. **CredoMap** is a browser credential-harvesting tool used in campaigns targeting Ukrainian organizations.

APT28 possesses advanced zero-day exploitation capabilities. The group has leveraged vulnerabilities in Microsoft Outlook (CVE-2023-23397), Adobe Flash, Microsoft Office, and network infrastructure products before patches were available. Their C2 infrastructure relies on compromised servers, fast-flux DNS, and legitimate cloud services to evade detection.

## Attribution

Attribution of APT28 to the Russian GRU is supported by government indictments and multi-agency intelligence assessments. In July 2018, a U.S. federal grand jury indicted 12 Russian military intelligence officers of GRU Unit 26165, providing detailed evidence of the group's infrastructure, operational security measures, and coordination. A separate October 2018 indictment named seven GRU officers for operations targeting anti-doping agencies and the Organisation for the Prohibition of Chemical Weapons (OPCW).

Five Eyes intelligence agencies have issued multiple joint advisories attributing APT28 activity to the GRU. Technical indicators including malware code similarities, infrastructure reuse, and operational patterns have been independently corroborated by Mandiant, CrowdStrike, ESET, and Microsoft. The strategic alignment of APT28 targets with Russian foreign policy objectives provides further contextual support for the attribution.

## MITRE ATT&CK Profile

APT28 employs a broad range of techniques across the ATT&CK framework.

**Initial Access**: The group relies on spearphishing with malicious attachments (T1566.001) and exploitation of public-facing applications (T1190), including VPN appliances and web-facing email servers. They have also used valid accounts obtained through credential harvesting (T1078).

**Execution and Persistence**: APT28 uses command and scripting interpreters (T1059), scheduled tasks (T1053), and registry run keys (T1547.001) for execution and persistence. On Linux systems, Drovorub uses kernel modules for rootkit-level persistence.

**Defense Evasion**: The group employs indicator removal (T1070), timestomping, process injection, and delayed activation periods to evade host-based defenses.

**Command and Control**: HTTP/S-based C2 (T1071.001) is the primary channel, with communications designed to mimic legitimate web traffic. The group also uses DNS tunneling (T1071.004) and encrypted channels through custom protocols.

**Exfiltration**: Data is staged in compressed archives and exfiltrated over the C2 channel (T1041) or through alternative protocols including email (T1048).

## Sources & References

- [MITRE ATT&CK: APT28 Group Profile](https://attack.mitre.org/groups/G0007/) -- MITRE ATT&CK
- [US DOJ: Charges Against Russian GRU Officers](https://www.justice.gov/opa/pr/us-charges-russian-gru-officers-international-hacking-and-related-influence-and) -- US Department of Justice, 2018-10-04
- [CISA: Advisory AA23-108A](https://www.cisa.gov/news-events/cybersecurity-advisories/aa23-108a) -- CISA, 2023-04-18
- [Mandiant: APT28 - A Window into Russia's Cyber Espionage Operations](https://www.mandiant.com/resources/apt28-a-window-into-russias-cyber-espionage-operations) -- Mandiant, 2014-10-27
