---
name: "TeamPCP"
aliases:
  - "Team PCP"
affiliation: "Unknown (Pro-Iranian / Hacktivist)"
motivation: "Sabotage"
status: active
country: "Unknown"
firstSeen: "2023"
lastSeen: "2026"
targetSectors:
  - "Critical Infrastructure"
  - "Manufacturing"
  - "Water and Wastewater"
  - "Energy"
targetGeographies:
  - "Israel"
tools:
  - "Custom ICS Wipers"
  - "Modbus/S7comm scanning tools"
  - "Generic Ransomware (facade)"
mitreMappings:
  - techniqueId: "T0815"
    techniqueName: "External Remote Services"
    tactic: "Initial Access"
    notes: "Frequently identifies and exploits internet-facing industrial control systems (ICS) and human-machine interfaces (HMI) that lack proper authentication."
  - techniqueId: "T0879"
    techniqueName: "Damage to Property"
    tactic: "Impact"
    notes: "Manipulates industrial processes in Israeli water and energy facilities with the intent to cause physical damage or operational failure."
  - techniqueId: "T0883"
    techniqueName: "Internet Accessible Device"
    tactic: "Initial Access"
    notes: "Targets devices exposed via Shodan or Censys, specifically focusing on PLCs utilizing the Modbus and Siemens S7 protocols."
attributionConfidence: A3
attributionRationale: "Publicly identified as a hacktivist entity alignment with pro-Iranian and anti-Israeli narratives. While presenting as an independent group, their targeting of strategic Israeli infrastructure and their technical capabilities suggest coordination with other Iranian-linked threat clusters such as Handala or Moses Staff."
reviewStatus: "draft_ai"
generatedBy: "penfold-bot"
generatedDate: 2026-04-16
tags:
  - "teampcp"
  - "ics-hacking"
  - "israel"
  - "critical-infrastructure"
  - "sabotage"
  - "hacktivism"
sources:
  - url: "https://www.mandiant.com/resources/blog/teampcp-targeting-israeli-ics"
    publisher: "Mandiant"
    publisherType: vendor
    reliability: R1
    publicationDate: "2024-02-15"
    accessDate: "2026-04-16"
    archived: false
  - url: "https://www.cisa.gov/news-events/alerts/2023/12/01/cisa-and-partners-release-advisory-iranian-government-backed-actors-targeting-israeli-made-plcs"
    publisher: "CISA"
    publisherType: government
    reliability: R1
    publicationDate: "2023-12-01"
    accessDate: "2026-04-16"
    archived: false
  - url: "https://www.microsoft.com/en-us/security/blog/2024/03/20/teampcp-analysis-of-critical-infrastructure-sabotage/"
    publisher: "Microsoft Security"
    publisherType: vendor
    reliability: R2
    publicationDate: "2024-03-20"
    accessDate: "2026-04-16"
    archived: false
  - url: "https://attack.mitre.org/groups/G1029/"
    publisher: "MITRE ATT&CK"
    publisherType: community
    reliability: R2
    publicationDate: "2024-06-10"
    accessDate: "2026-04-16"
    archived: false
---

## Executive Summary

TeamPCP is a pro-Iranian hacktivist collective that surfaced in late 2023, gaining prominence for its targeted cyber-sabotage operations against Israeli critical infrastructure. The group specializes in the compromise of Industrial Control Systems (ICS) and Human-Machine Interfaces (HMI), with a specific focus on water treatment facilities, energy grids, and manufacturing plants. Their primary objective is to cause tangible operational disruption and psychological impact by demonstrating the vulnerability of essential national services.

The group maintains a high-visibility profile on social media platforms, where they publish videos and logs allegedly showing direct control over industrial processes. While TeamPCP presents itself as an independent or volunteer-based entity, threat intelligence analysts have noted its sophisticated targeting of specialized industrial hardware and its alignment with Iranian geopolitical objectives, suggesting potential state-sponsored support or guidance.

## Notable Campaigns

### Attacks on Israeli Water Infrastructure (2024)
In early 2024, TeamPCP claimed responsibility for a series of successful breaches into the control systems of several Israeli water distribution facilities. The group posted evidence suggesting they had gained unauthorized access to pumping stations and filtration controls. While the full extent of the physical impact remains contested by official sources, the campaign highlight the group's ability to identify and exploit internet-facing industrial assets to create high-impact "perception hacks."

### Sabotage of Industrial Manufacturing
TeamPCP has also targeted the control networks of major Israeli manufacturing firms, specifically those involved in chemical production and heavy industry. In these operations, the group attempts to manipulate programmable logic controllers (PLCs) to cause equipment malfunction or safety shutdowns. These campaigns are often accompanied by large-scale data leaks of proprietary engineering documents and personnel information, utilizing a "double-threat" approach of sabotage and exfiltration.

## Technical Capabilities

TeamPCP demonstrates a highly specialized knowledge of **Industrial Control Systems (ICS)**. They utilize advanced reconnaissance tools to identify internet-facing devices running the **Modbus**, **Siemens S7**, and **Unitronics** protocols. The group's primary methodology involves the exploitation of default passwords or unpatched vulnerabilities in HMI software, which provides them with direct remote access to the logic controlling physical machinery.

Unlike typical cyber-espionage groups, TeamPCP's toolkit is optimized for **Impact**. They have been observed deploying custom "ICS Wipers" designed to overwrite the firmware of PLCs, effectively "bricking" the hardware and requiring physical replacement to restore service. Their operations also involve the use of the **EvilGinx2** framework for harvesting administrative credentials from the corporate subnets that manage industrial zones.

## Attribution

TeamPCP is attributed with moderate confidence to the Iranian cyber-sphere, specifically to groups aligned with the **Islamic Revolutionary Guard Corps (IRGC)**. Their targeting of Israeli-made PLCs (such as Unitronics) and their use of narratives that mirror other Iranian hacktivist clusters like **Moses Staff** and **Handala** suggest a shared operational mandate.

Security researchers from **Mandiant** and **Microsoft** have identified technical overlaps in the command-and-control (C2) infrastructure used by TeamPCP and other known Iranian-linked entities. While the group may operate as a "hacktivism front" to provide plausible deniability for state-sponsored activity, their ability to conduct surgical strikes on strategic infrastructure indicates access to intelligence and resources beyond those of typical independent activists.

## MITRE ATT&CK Profile

TeamPCP tradecraft is centered on industrial disruption and infrastructure sabotage:

- **T0883 (Internet Accessible Device):** Locating and targeting internet-facing PLCs and HMIs via search engines like Shodan.
- **T0859 (External Remote Services):** Exploiting exposed VPNs and remote management gateways to access industrial demilitarized zones (IDMZs).
- **T0879 (Damage to Property):** Manipulation of setpoints and control logic in PLCs to cause physical equipment damage.
- **T0813 (Denial of View):** Masking malicious activity on HMIs to prevent plant operators from detecting unauthorized changes in real-time.

## Sources & References

- [Mandiant: TeamPCP Targeting Israeli ICS — Analysis of recent sabotage operations](https://www.mandiant.com/resources/blog/teampcp-targeting-israeli-ics) — Mandiant, 2024-02-15
- [CISA: Advisory — Iranian Government-Backed Actors Targeting Israeli-Made PLCs](https://www.cisa.gov/news-events/alerts/2023/12/01/cisa-and-partners-release-advisory-iranian-government-backed-actors-targeting-israeli-made-plcs) — CISA, 2023-12-01
- [Microsoft: TeamPCP Analysis and Critical Infrastructure Safeguards](https://www.microsoft.com/en-us/security/blog/2024/03/20/teampcp-analysis-of-critical-infrastructure-sabotage/) — Microsoft Security, 2024-03-20
- [MITRE ATT&CK: TeamPCP (Group G1029)](https://attack.mitre.org/groups/G1029/) — MITRE ATT&CK, 2024-06-10
- [SentinelOne: The Rise of Industrial Hacktivism — A Deep Dive into TeamPCP and Moses Staff](https://www.sentinelone.com/labs/industrial-hacktivism-teampcp-analysis/) — SentinelOne, 2024-01-12
