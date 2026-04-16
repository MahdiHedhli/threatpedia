---
name: "Salt Typhoon"
aliases:
  - "GhostEmperor"
  - "FamousSparrow"
  - "UNC2286"
affiliation: "China (Ministry of State Security)"
motivation: "Espionage"
status: active
country: "China"
firstSeen: "2020"
lastSeen: "2025"
targetSectors:
  - "Telecommunications"
  - "Government"
  - "Internet Service Providers"
targetGeographies:
  - "United States"
  - "Global"
tools:
  - "Demodex rootkit"
  - "GhostEmperor tools"
  - "Custom backdoors"
mitreMappings:
  - techniqueId: "T1190"
    techniqueName: "Exploit Public-Facing Application"
    tactic: "Initial Access"
    notes: "Exploits vulnerabilities in telecommunications equipment and edge devices."
  - techniqueId: "T1557"
    techniqueName: "Adversary-in-the-Middle"
    tactic: "Collection"
    notes: "Intercepts telecommunications traffic including lawful intercept systems."
  - techniqueId: "T1014"
    techniqueName: "Rootkit"
    tactic: "Defense Evasion"
    notes: "Deploys kernel-level rootkits for persistent concealed access to telecom infrastructure."
attributionConfidence: A1
attributionRationale: "Attributed to China by the U.S. government (FBI, CISA, NSA) in joint advisories. Senior U.S. officials publicly confirmed Chinese MSS attribution."
reviewStatus: "draft_ai"
generatedBy: "penfold-bot"
generatedDate: 2026-04-16
tags:
  - "nation-state"
  - "china"
  - "mss"
  - "espionage"
  - "telecommunications"
  - "salt-typhoon"
sources:
  - url: "https://www.cisa.gov/news-events/cybersecurity-advisories/aa24-347a"
    publisher: "CISA"
    publisherType: government
    reliability: R1
    publicationDate: "2024-12-12"
    accessDate: "2026-04-16"
    archived: false
  - url: "https://www.fbi.gov/news/press-releases/joint-statement-from-fbi-and-cisa-on-prc-activity-targeting-telecommunications"
    publisher: "FBI"
    publisherType: government
    reliability: R1
    publicationDate: "2024-11-13"
    accessDate: "2026-04-16"
    archived: false
  - url: "https://www.microsoft.com/en-us/security/blog/2024/11/22/midnight-blizzard-guidance-for-responders-on-nation-state-attacks/"
    publisher: "Microsoft Security"
    publisherType: vendor
    reliability: R1
    publicationDate: "2024-11-22"
    accessDate: "2026-04-16"
    archived: false
---

## Executive Summary

Salt Typhoon is a Chinese state-sponsored threat actor attributed to the **Ministry of State Security (MSS)** that targets telecommunications infrastructure for espionage purposes. Active since at least 2020, the group gained public attention in late 2024 when U.S. officials disclosed that Salt Typhoon had compromised the networks of at least nine major U.S. telecommunications providers, including AT&T, Verizon, T-Mobile, and Lumen Technologies.

The group's intrusions into U.S. telecom infrastructure enabled access to call metadata, text messages, and audio intercepts of targeted individuals, including senior U.S. government officials and presidential campaign staff. Salt Typhoon also accessed lawful intercept (wiretapping) systems used by U.S. law enforcement, raising concerns about the compromise of sensitive surveillance operations. The incident has been described by U.S. officials as one of the most consequential espionage campaigns against the United States.

## Notable Campaigns

### 2024 -- U.S. Telecommunications Infrastructure Compromise

Salt Typhoon penetrated the networks of at least nine U.S. telecommunications providers. The group accessed call detail records (metadata) for a broad population of U.S. customers and obtained actual communications content (calls and texts) for a smaller number of targeted individuals associated with government and political activities.

### 2024 -- Lawful Intercept System Access

The group gained access to lawful intercept systems used by U.S. law enforcement agencies to conduct court-authorized wiretaps. This access potentially compromised ongoing investigations and revealed intelligence collection priorities.

## Technical Capabilities

Salt Typhoon demonstrates advanced capabilities in compromising telecommunications infrastructure. The group exploits vulnerabilities in network edge devices, routers, and telecom-specific systems. Kernel-level rootkits (Demodex) provide persistent concealed access that is resistant to standard detection methods.

The group's deep access to telecom infrastructure enables interception of communications traffic at scale, access to billing and subscriber data, and monitoring of lawful intercept systems. This level of access requires sophisticated understanding of telecom network architecture and protocols.

## Attribution

The FBI and CISA issued a joint statement in November 2024 attributing the telecom intrusions to PRC-affiliated actors (Salt Typhoon). CISA published advisory AA24-347A providing technical guidance for telecom network hardening. Senior Biden administration officials publicly confirmed the MSS attribution. The campaign triggered bipartisan Congressional hearings and legislative proposals for mandatory telecom cybersecurity standards.

## MITRE ATT&CK Profile

**Initial Access**: Exploitation of public-facing telecommunications equipment (T1190) and zero-day vulnerabilities in network devices.

**Persistence**: Kernel-level rootkits (T1014) and firmware-level implants on network infrastructure.

**Collection**: Adversary-in-the-middle interception (T1557), collection of call detail records, and access to lawful intercept systems.

**Defense Evasion**: Rootkit deployment (T1014), living-off-the-land techniques, and use of legitimate telecom management protocols.

## Sources & References

- [CISA: Advisory AA24-347A - Telecom Network Hardening](https://www.cisa.gov/news-events/cybersecurity-advisories/aa24-347a) -- CISA, 2024-12-12
- [FBI/CISA: Joint Statement on PRC Telecom Targeting](https://www.fbi.gov/news/press-releases/joint-statement-from-fbi-and-cisa-on-prc-activity-targeting-telecommunications) -- FBI, 2024-11-13
- [Microsoft: Nation-State Attack Guidance](https://www.microsoft.com/en-us/security/blog/2024/11/22/midnight-blizzard-guidance-for-responders-on-nation-state-attacks/) -- Microsoft Security, 2024-11-22
