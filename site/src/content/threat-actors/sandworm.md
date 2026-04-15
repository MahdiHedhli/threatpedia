---
name: "Sandworm"
aliases:
  - "Unit 74455"
  - "GTsST"
  - "BlackEnergy Group"
  - "Telebots"
  - "Voodoo Bear"
  - "Iron Viking"
  - "Iridium"
  - "Wormwood"
  - "Seashell Blizzard"
affiliation: "Russia (GRU Unit 74455)"
motivation: "Sabotage / Espionage"
status: active
country: "Russia"
firstSeen: "2009"
lastSeen: "2025"
targetSectors:
  - "Energy"
  - "Government"
  - "Logistics"
  - "Media"
  - "Telecommunications"
  - "Financial Services"
targetGeographies:
  - "Ukraine"
  - "Global"
  - "United States"
  - "Europe"
  - "South Korea"
tools:
  - "BlackEnergy"
  - "Industroyer"
  - "KillDisk"
  - "NotPetya"
  - "GreyEnergy"
  - "Olympic Destroyer"
  - "AcidRain"
  - "CaddyWiper"
mitreMappings:
  - techniqueId: "T1485"
    techniqueName: "Data Destruction"
    tactic: "Impact"
    notes: "Sandworm is notorious for the frequent use of wiper malware to destroy data and sabotage critical infrastructure."
  - techniqueId: "T0817"
    techniqueName: "Bravo Zulu: Industrial Control System (ICS) Impact"
    tactic: "Impact"
    notes: "Specifically developed and deployed Industroyer/CrashOverride to target electrical grids."
  - techniqueId: "T1059.003"
    techniqueName: "Command and Scripting Interpreter: Windows Command Shell"
    tactic: "Execution"
    notes: "Frequent use of cmd.exe and PowerShell for persistence and lateral movement."
attributionConfidence: A1
attributionRationale: "High confidence attribution to the Russian General Staff Main Intelligence Directorate (GRU) Unit 74455 (GTsST), supported by a 2020 U.S. Department of Justice indictment of six officers and consensus among Five Eyes intelligence agencies."
reviewStatus: "draft_ai"
generatedBy: "penfold-bot"
generatedDate: 2026-04-15
tags:
  - "nation-state"
  - "russia"
  - "gru"
  - "sabotage"
  - "sandworm"
  - "ukraine"
  - "wiper"
  - "unit-74455"
sources:
  - url: "https://attack.mitre.org/groups/G0034/"
    publisher: "MITRE ATT&CK"
    publisherType: research
    reliability: R1
    accessDate: "2026-04-15"
    archived: false
  - url: "https://www.justice.gov/opa/pr/six-russian-gru-officers-charged-connection-worldwide-deployment-destructive-malware-and-other"
    publisher: "US Department of Justice"
    publisherType: government
    reliability: R1
    publicationDate: "2020-10-19"
    accessDate: "2026-04-15"
    archived: false
  - url: "https://www.cisa.gov/news-events/cybersecurity-advisories/aa24-109a"
    publisher: "CISA"
    publisherType: government
    reliability: R1
    publicationDate: "2024-04-18"
    accessDate: "2026-04-15"
    archived: false
---

## Overview

Sandworm (also known as Unit 74455 or GTsST) is a prominent Russian state-sponsored threat actor operating within the **General Staff Main Intelligence Directorate (GRU)**. Active since at least 2009, Sandworm is widely considered one of the most dangerous and aggressive cyber-warfare units in the world. Unlike traditional espionage-focused APTs, Sandworm frequently conducts high-impact sabotage operations intended to cause physical-world disruption and psychological impact.

The group is primarily responsible for the most significant cyberattacks against Ukraine's critical infrastructure, including the first-ever cyber-induced power outages in 2015 and 2016, and the devastating NotPetya wiper campaign in 2017. Their mandate extends beyond regional conflict, encompassing global operations such as the targeting of the 2018 Winter Olympics and international investigation bodies like the OPCW.

## Tactics, Techniques & Procedures (TTPs)

### Destructive Tradecraft
Sandworm's signature is the development and deployment of bespoke wiper malware. Families like **KillDisk**, **NotPetya**, and **AcidRain** are designed to overwrite Master Boot Records (MBR) or specifically target the file systems of industrial controllers. They frequently use living-off-the-land techniques (LotL), leveraging legitimate administrative tools like PsExec and WMI to propagate destructive payloads rapidly across enterprise networks.

### Industrial Control Systems (ICS) Focus
The group possesses rare technical expertise in industrial protocols such as IEC 60870-5-104 and IEC 61850. Their **Industroyer** (CrashOverride) malware was the first to specifically automate the control of electrical circuit breakers, allowing for the remote disconnection of power grids without manual intervention.

### Supply Chain and Living-off-the-Land
Sandworm utilizes supply chain compromises to gain initial access to high-value targets. The NotPetya outbreak was initiated via a trojanized update to the M.E.Doc accounting software. They also frequently exploit edge network devices, such as VPNs and routers, to maintain persistence and obfuscate their C2 infrastructure.

## Targeted Industries & Organizations

Sandworm's targeting is strategically aligned with Russian military and geopolitical objectives:

- **Energy & Utilities:** Repeated attacks on the Ukrainian electrical grid and energy providers.
- **Government & Diplomacy:** Targeting of the French Presidential election (2017) and international sporting bodies.
- **Logistics & Transportation:** Disruption of global shipping (Maersk) and Ukrainian transit systems.
- **Media:** Sabotage of Ukrainian television and radio stations during conflict periods.

## Attributable Attacks Timeline

### 2015-12-23 — Ukraine Power Grid Attack
Sandworm used the BlackEnergy 3 malware to gain access to three regional power distribution companies in Ukraine, successfully disconnecting 30 substations and leaving 230,000 residents in the dark.

### 2017-06-27 — NotPetya Ransomware
The group launched the NotPetya wiper attack via a supply chain compromise. Although it appeared to be ransomware, it was a destructive wiper that caused over $10 billion in global damage, the most in history for a single event.

### 2018-02-09 — Olympic Destroyer
During the Pyeongchang Winter Olympics opening ceremony, Sandworm deployed the Olympic Destroyer malware, which disabled the official app, Wi-Fi at the stadium, and the media center's technological systems.

### 2022-02-24 — AcidRain and Viasat
Coinciding with the Russian invasion of Ukraine, Sandworm deployed the AcidRain wiper against Viasat's KA-SAT network, successfully bricking thousands of satellite modems and disrupting communications across Europe.

## Cross-Vendor Naming Reference

| Vendor | Name |
|---|---|
| CrowdStrike | Voodoo Bear |
| Microsoft | Seashell Blizzard (formerly Iridium) |
| Mandiant | Sandworm Team |
| ESET | Telebots / BlackEnergy Group |
| Secureworks | Iron Viking |

## References & Sources

- MITRE ATT&CK: Group G0034 (Sandworm Team)
- US DOJ: Six Russian GRU Officers Charged in Connection with Worldwide Deployment of Destructive Malware (2020)
- NCSC UK: Reckless campaign of cyber attacks by Russian military intelligence Service (GTsST)
- CISA Alert (AA24-109A): Staying Ahead of Sandworm (2024)
- Wired: Sandworm - A New Era of Cyberwar and the Hunt for the Kremlin's Most Dangerous Hackers
- ESET Research: Industroyer- The Biggest Threat to Industrial Control Systems since Stuxnet
