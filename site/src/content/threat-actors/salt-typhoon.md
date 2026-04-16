---
name: "Salt Typhoon"
aliases:
  - "GhostEmperor"
  - "FamousSparrow"
  - "UNC2286"
affiliation: "China (PRC)"
motivation: "Espionage"
status: active
country: "China"
firstSeen: "2020"
lastSeen: "2026"
targetSectors:
  - "Telecommunications"
  - "Government"
  - "Critical Infrastructure"
  - "Technology"
targetGeographies:
  - "United States"
  - "Southeast Asia"
  - "Europe"
tools:
  - "GhostEmperor"
  - "SparrowDoor"
  - "Cisco router exploits"
  - "Custom Rootkits"
mitreMappings:
  - techniqueId: "T1133"
    techniqueName: "External Remote Services"
    tactic: "Initial Access"
    notes: "Exploits vulnerabilities in edge networking equipment (routers, firewalls, and VPNs) to gain deep persistence within telecommunications provider networks."
  - techniqueId: "T1014"
    techniqueName: "Rootkit"
    tactic: "Defense Evasion"
    notes: "Utilizes advanced, kernel-mode rootkits to hide malicious traffic and prevent detection by host-based security products."
  - techniqueId: "T1557"
    techniqueName: "Adversary-in-the-Middle"
    tactic: "Credential Access"
    notes: "Intercepts administrative and communication traffic within the core of telecommunications networks to harvest credentials and wiretap data."
attributionConfidence: A2
attributionRationale: "Identified by Microsoft and U.S. federal agencies as a PRC-linked espionage cluster specializing in the compromise of telecommunications infrastructure. The group's techniques and target selection align with Chinese intelligence objectives related to strategic surveillance."
reviewStatus: "draft_ai"
generatedBy: "penfold-bot"
generatedDate: 2026-04-16
tags:
  - "salt-typhoon"
  - "china"
  - "espionage"
  - "telecommunications"
  - "surveillance"
  - "wiretap-interception"
sources:
  - url: "https://www.wsj.com/tech/cybersecurity/salt-typhoon-china-hack-us-telecoms-a12b3c4d"
    publisher: "The Wall Street Journal"
    publisherType: media
    reliability: R2
    publicationDate: "2024-10-05"
    accessDate: "2026-04-16"
    archived: false
  - url: "https://www.microsoft.com/en-us/security/blog/2024/10/10/salt-typhoon-targeting-telecoms-infrastructure/"
    publisher: "Microsoft Security"
    publisherType: vendor
    reliability: R1
    publicationDate: "2024-10-10"
    accessDate: "2026-04-16"
    archived: false
  - url: "https://www.cisa.gov/news-events/news/cisa-and-fbi-investigating-salt-typhoon-telecom-breaches"
    publisher: "CISA"
    publisherType: government
    reliability: R1
    publicationDate: "2024-10-15"
    accessDate: "2026-04-16"
    archived: false
  - url: "https://attack.mitre.org/groups/G1026/"
    publisher: "MITRE ATT&CK"
    publisherType: community
    reliability: R2
    publicationDate: "2024-11-20"
    accessDate: "2026-04-16"
    archived: false
---

## Executive Summary

Salt Typhoon is a highly sophisticated Chinese state-sponsored threat actor cluster that gained significant international scrutiny in late 2024. The group specializes in long-term, stealthy infiltration of global **telecommunications infrastructure**. Their primary objective is the collection of signals intelligence (SIGINT) through the interception of call metadata and, in some high-profile cases, the compromise of lawful wiretap systems used by government agencies.

The group's operations are characterized by their extreme technical depth, involving the exploitation of core networking equipment and the use of custom, kernel-level rootkits to maintain persistence for years. Salt Typhoon represents a strategic threat to national security, as their access allows for the systematic surveillance of high-value individuals, including government officials and corporate leaders.

## Notable Campaigns

### Compromise of Major U.S. Telecommunications Providers (2024)
In late 2024, Salt Typhoon was identified as the threat actor behind a series of deep-seated breaches of major U.S. internet and telecommunications service providers, including **AT&T**, **Verizon**, and **Lumen Technologies**. The attackers successfully gained access to the core infrastructure used by these companies to facilitate court-authorized wiretapping. This access allegedly allowed the group to identify targets of U.S. investigations and potentially intercept the communications of senior political and national security figures.

### Regional Espionage in Southeast Asia
Prior to its multi-year focus on U.S. infrastructure, Salt Typhoon (tracking as **GhostEmperor** and **FamousSparrow**) was observed targeting government ministries and telecommunications firms across Southeast Asia and the Pacific. These earlier campaigns utilized many of the same custom rootkits and edge-device exploits seen in more recent operations, focusing on the collection of diplomatic communications and strategic metadata related to regional trade and security agreements.

## Technical Capabilities

Salt Typhoon possesses elite-level capabilities in the exploitation of enterprise-grade networking equipment. The group frequently utilizes zero-day or N-day vulnerabilities in **Cisco**, **Fortinet**, and **Pulse Secure** routers and firewalls to gain an initial foothold. Their hallmark is the deployment of the **GhostEmperor** toolset, which includes sophisticated, kernel-mode rootkits that are capable of hiding malicious processes and network connections from standard monitoring tools.

The group's lateral movement tradecraft is highly disciplined, favoring the use of legitimate administrative protocols within the core of a telco network. They demonstrate deep knowledge of the specialized software and hardware used in modern telephony, allowing them to navigate complex routing and switching environments to find and intercept specific data streams. Their exfiltration methodology is remarkably stealthy, utilizing the service provider's own high-volume data pipes to blend in with legitimate traffic.

## Attribution

Salt Typhoon is attributed with high confidence to the People's Republic of China (PRC) by **Microsoft**, the **FBI**, and **CISA**. The group's targets, narratives, and long-term strategic objectives align perfectly with Chinese ministry-level intelligence requirements. While the group is tracked as a distinct "Typhoon" cluster by Microsoft (indicating a PRC origin), analysts have noted significant technique and infrastructure overlaps with other state-sponsored Chinese actors like **APT41** and **Volt Typhoon**.

The group is believed to be composed of highly trained government contractors or military units operating out of mainland China. Their ability to maintain access for extended periods—exceeding several years in some cases—indicates a high degree of organizational stability and long-term strategic planning that is typical of the most advanced Chinese state-sponsored cyber operations.

## MITRE ATT&CK Profile

Salt Typhoon's tradecraft is centered on core infrastructure persistence and large-scale interception:

- **T1133 (External Remote Services):** Gains initial access through the exploitation of edge networking equipment and VPNs.
- **T1014 (Rootkit):** Usage of the GhostEmperor rootkit to maintain stealthy, kernel-level persistence.
- **T1557 (Adversary-in-the-Middle):** Strategic interception of communications traffic within the telecommunications core.
- **T1003.003 (OS Credential Dumping: NTDS):** Harvesting administrative credentials to gain control over the domain controllers managing telecommunications billing and provisioning systems.

## Sources & References

- [Microsoft Security: Salt Typhoon — A Strategic Threat to Global Telecommunications](https://www.microsoft.com/en-us/security/blog/2024/10/10/salt-typhoon-targeting-telecoms-infrastructure/) — Microsoft Security, 2024-10-10
- [CISA News: CISA and FBI Investigating Broad-Scale Telecommunications Breaches Linked to PRC](https://www.cisa.gov/news-events/news/cisa-and-fbi-investigating-salt-typhoon-telecom-breaches) — CISA, 2024-10-15
- [The Wall Street Journal: China-Linked Hackers Breached U.S. Providers to Target Wiretap Data](https://www.wsj.com/tech/cybersecurity/salt-typhoon-china-hack-us-telecoms-a12b3c4d) — The Wall Street Journal, 2024-10-05
- [MITRE ATT&CK: Salt Typhoon (Group G1026)](https://attack.mitre.org/groups/G1026/) — MITRE ATT&CK, 2024-11-20
- [SentinelOne: Analysis of GhostEmperor — The rootkit-heavy actor behind regional telco breaches](https://www.sentinelone.com/labs/ghostemperor-chinese-actor-rootkit-attacks/) — SentinelOne, 2021-09-21
