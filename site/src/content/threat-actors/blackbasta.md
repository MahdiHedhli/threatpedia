---
name: "BlackBasta"
aliases:
  - "GOLD BOMBARD"
affiliation: "Unknown"
motivation: "Financial"
status: "active"
firstSeen: "2022"
lastSeen: "2025"
country: "Unknown"
targetSectors:
  - "Manufacturing"
  - "Transportation"
  - "Healthcare"
  - "Financial"
targetGeographies:
  - "North America"
  - "Europe"
  - "Oceania"
knownTools:
  - "BlackBasta Ransomware"
  - "Qakbot"
  - "Cobalt Strike"
  - "PrintNightmare"
tags:
  - "financially-motivated"
  - "cybercrime"
  - "ransomware"
---

## Executive Summary
BlackBasta (also tracked as GOLD BOMBARD) is an extremely aggressive Ransomware-as-a-Service (RaaS) operation that rapidly rose to prominence in early 2022. Suspected to be formed by highly experienced operators splintered from the defunct Conti and REvil cartels, BlackBasta quickly established itself as a top-tier threat. They target a diverse array of global enterprises spanning manufacturing, healthcare, and critical infrastructure, utilizing a sophisticated double-extortion model. The group is renowned for its operational security, exclusively recruiting vetted affiliates through private dark web channels rather than public advertising.

## Notable Campaigns
- **American Dental Association (ADA) Compromise:** Among their early high-profile victims, BlackBasta successfully compromised the ADA in 2022, causing significant disruptions to downstream dental practices before exfiltrating and leaking nearly 3GB of internal data.
- **Capita PLC Disruption:** In 2023, BlackBasta crippled the operations of Capita, an enormous outsourcing firm handling critical contracts for the UK government, NHS, and military, resulting in extensive systemic downtime and the theft of highly sensitive pension and personnel data.
- **Ascension Healthcare Attack (2024):** Suspected to be the primary affiliate behind the devastating ransomware attack on Ascension, one of the largest private healthcare systems in the United States, forcing hospitals globally to revert to paper records and diverting emergency services.

## Technical Capabilities
BlackBasta leverages an ecosystem of established Initial Access Brokers (IABs). Historically, they heavily relied on initial infections from the **Qakbot** banking trojan, though following Qakbot's takedown, they pivoted to utilizing DarkGate and Pikabot. Once access is established, the group moves swiftly, utilizing **Cobalt Strike** and relying heavily on the abuse of Windows administrative tools (like PsExec, WMI, and BITSAdmin). They frequently exploit the **PrintNightmare** vulnerability (CVE-2021-34527) for rapid local privilege escalation. Their ransomware payload is written in C++ and utilizes the ChaCha20 algorithm for extremely fast file encryption.

## Attribution
BlackBasta operates as a decentralized, financially motivated cybercrime syndicate. While definitive geographic attribution is difficult due to their strict operational security, security researchers widely agree that the core developers and operators are Russian-speaking. Technical analysis of the BlackBasta malware, leak site infrastructure, and preferred initial access vectors heavily overlap with the infrastructure previously utilized by the Conti ransomware group (Wizard Spider), heavily suggesting it is a successor organization.

## Sources & References
- CISA #StopRansomware Advisory: BlackBasta
- Trend Micro: BlackBasta Profile
- MITRE ATT&CK Group Mapping (Pending)
