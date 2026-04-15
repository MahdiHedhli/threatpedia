---
name: "Turla"
aliases:
  - "Snake"
  - "Uroboros"
  - "Venomous Bear"
  - "Waterbug"
  - "Iron Hunter"
  - "KRYPTON"
affiliation: "Russia (FSB)"
motivation: "Espionage"
status: "active"
firstSeen: "2004"
lastSeen: "2024"
country: "Russia"
targetSectors:
  - "Government"
  - "Defense"
  - "Diplomatic"
  - "Research"
  - "Education"
targetGeographies:
  - "Global"
  - "Europe"
  - "United States"
tools:
  - "Snake"
  - "Uroboros"
  - "Carbon"
  - "Gazer"
  - "KopiLuwak"
attributionConfidence: "A1"
attributionRationale: "High-fidelity attribution based on multi-government advisories (CISA AA23-129A) linking the group to Cente 16 of the Russian Federal Security Service (FSB). Persistent use of the specialized Snake rootkit over two decades."
reviewStatus: "under_review"
generatedBy: "penfold-bot"
generatedDate: 2026-04-14
tags:
  - "nation-state"
  - "russia"
  - "espionage"
  - "fsb"
sources:
  - url: "https://attack.mitre.org/groups/G0010/"
    publisher: "MITRE ATT&CK"
    publisherType: "research"
    reliability: "R1"
    accessDate: "2026-04-14"
    archived: false
  - url: "https://www.cisa.gov/news-events/cybersecurity-advisories/aa23-129a"
    publisher: "CISA"
    publisherType: "government"
    reliability: "R1"
    publicationDate: "2023-05-09"
    accessDate: "2026-04-14"
    archived: false
  - url: "https://www.mandiant.com/resources/blog/turlas-advanced-stealth-mechanisms"
    publisher: "Mandiant"
    publisherType: "vendor"
    reliability: "R1"
    publicationDate: "2014-08-07"
    accessDate: "2026-04-14"
    archived: false
---

## Executive Summary
Turla (also tracked as Snake, Uroboros, and Venomous Bear) is a premier Russian state-sponsored espionage group that has been active since at least 2004. Attributed to Center 16 of the Russian Federal Security Service (FSB), Turla is renowned for its extreme technical sophistication, operational longevity, and focus on high-priority diplomatic and government intelligence requirements. The group is most famous for its eponymous **Snake** rootkit, a highly advanced implant that has infected sensitive government networks in over 50 countries for nearly two decades, serving as the flagship tool for Russian signal intelligence and cyber-espionage.

## Notable Campaigns
- **Moonlight Maze (Pre-Turla Roots):** While the group name Turla emerged later, specialized investigators link its origins to Moonlight Maze, the first major, multi-year state-sponsored intrusion campaign against the US Department of Defense in the late 1990s.
- **Global Snake Rootkit Deployment:** For nearly 20 years, Turla operated the Snake network, a global peer-to-peer (P2P) botnet consisting of infected high-value systems. This network allowed them to route commands and exfiltrate data through complex chains to hide the origin of their FSB-controlled infrastructure.
- **European Diplomatic Missions:** Turla frequently targets European Ministries of Foreign Affairs (MFAs) and diplomatic missions using specialized implants (like Carbon and Gazer) to maintain multi-year persistence in highly sensitive communications networks.

## Technical Capabilities
Turla is a Tier 1 adversary with deep expertise in custom rootkits and kernel-level exploitation. Their flagship tool, **Snake**, is a modular P2P implant designed for long-term stealth, utilizing custom network protocols to relay communications through a mesh of other infected systems. They are also known for "Hijacking Satellite Links," a technique where they would monitor unencrypted downstream satellite traffic and inject their own malicious responses to infect systems in remote regions. They rely heavily on **Carbon** (a second-stage backdoor) and **Gazer** (a C++ implant) for post-exploitation, frequently custom-tailoring their payloads for individual high-value targets.

## Attribution
Turla is unequivocally attributed to the Russian Federal Security Service (FSB). Specifically, an international law enforcement operation led by the FBI in May 2023 (Operation MEDUSA) unmasked Turla's affiliation with Center 16 of the FSB, based in Ryazan, Russia. The group adheres to strict operational security, though their activities are consistently aligned with Russian strategic interests, particularly in the collection of political and diplomatic intelligence from NATO nations and former Soviet states.

## Sources & References
- CISA Advisory AA23-129A: Hunting Russian FSB Snake Malware
- MITRE ATT&CK Group G0010: Turla
- Mandiant Analysis of Turla Stealth Mechanisms
