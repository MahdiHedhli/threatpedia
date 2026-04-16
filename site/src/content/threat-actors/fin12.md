---
name: "FIN12"
aliases:
  - "Ryuk Gang"
  - "Conti (affiliated)"
affiliation: "Unknown (Russia-based)"
motivation: "Financial"
status: active
country: "Russia"
firstSeen: "2018"
lastSeen: "2026"
targetSectors:
  - "Healthcare"
  - "Education"
  - "Professional Services"
  - "Finance"
targetGeographies:
  - "Global"
  - "United States"
  - "Europe"
  - "Australia"
tools:
  - "Ryuk Ransomware"
  - "Conti Ransomware"
  - "TrickBot"
  - "BazarLoader"
  - "Cobalt Strike"
mitreMappings:
  - techniqueId: "T1486"
    techniqueName: "Data Encrypted for Impact"
    tactic: "Impact"
    notes: "Specializes in high-speed, wide-scale ransomware deployment using the Ryuk and Conti families, often achieving full domain encryption in less than 48 hours."
  - techniqueId: "T1078.002"
    techniqueName: "Valid Accounts: Domain Accounts"
    tactic: "Persistence"
    notes: "Frequently utilizes stolen domain administrator credentials provided by initial access brokers (IABs) to rapidly deploy ransomware across the entire network."
  - techniqueId: "T1021.001"
    techniqueName: "Remote Services: Remote Desktop Protocol"
    tactic: "Lateral Movement"
    notes: "Extensive use of RDP for lateral movement and the staging of ransomware payloads on high-value servers."
attributionConfidence: A2
attributionRationale: "Identified as a Russia-based cybercrime gang by Mandiant (Google Cloud) and Microsoft. The group is characterized by its reliance on IABs and its focus on high-revenue targets in the healthcare and professional services sectors."
reviewStatus: "draft_ai"
generatedBy: "penfold-bot"
generatedDate: 2026-04-16
tags:
  - "fin12"
  - "ryuk"
  - "conti"
  - "ransomware"
  - "healthcare-targeting"
  - "big-game-hunting"
sources:
  - url: "https://www.mandiant.com/resources/blog/fin12-ransomware-healthcare"
    publisher: "Mandiant"
    publisherType: vendor
    reliability: R1
    publicationDate: "2021-10-07"
    accessDate: "2026-04-16"
    archived: false
  - url: "https://www.cisa.gov/news-events/cybersecurity-advisories/aa22-257a"
    publisher: "CISA"
    publisherType: government
    reliability: R1
    publicationDate: "2022-09-14"
    accessDate: "2026-04-16"
    archived: false
  - url: "https://attack.mitre.org/groups/G1002/"
    publisher: "MITRE ATT&CK"
    publisherType: community
    reliability: R1
    publicationDate: "2023-10-21"
    accessDate: "2026-04-16"
    archived: false
  - url: "https://www.microsoft.com/en-us/security/blog/2021/10/07/insights-into-fin12-a-ransomware-group-focused-on-fast-impact/"
    publisher: "Microsoft Security"
    publisherType: vendor
    reliability: R1
    publicationDate: "2021-10-07"
    accessDate: "2026-04-16"
    archived: false
---

## Executive Summary

FIN12 is a financially motivated cybercrime group that specializes in high-impact ransomware operations, often referred to as "Big Game Hunting." Active since at least 2018, the group is primarily based in Russia and is well-known for its frequent use of the **Ryuk** and **Conti** ransomware families. Unlike some other ransomware groups that handle the entire attack lifecycle, FIN12 distinguishes itself by relying heavily on initial access brokers (IABs) to provide them with established footholds in target networks.

A defining characteristic of FIN12 is the speed of its operations. The group frequently transitions from initial access to full domain-wide ransomware deployment in less than two days, significantly faster than the industry average. This high-speed approach is designed to minimize the window for detection and response, ensuring the maximum possible impact on the victim organization.

## Notable Campaigns

### Systematic Targeting of the Healthcare Sector
FIN12 has a long-standing history of targeting healthcare organizations, including large hospital networks and medical service providers. Unlike some ransomware groups that claimed to avoid healthcare targets during the global pandemic, FIN11 continued to launch aggressive operations against medical facilities. These attacks frequently caused significant operational disruption, leading to delayed patient care and the diversion of clinical services.

### Global Professional Services Heists
The group has also focused heavily on professional services firms, including law firms, accounting practices, and consulting agencies. These targets are often selected for their high reliance on digital availability and the sensitive nature of the data they manage. FIN12 utilizes the threat of prolonged downtime—rather than just data exposure—as its primary leverage to force high-value ransom payments.

## Technical Capabilities

FIN12's technical methodology is optimized for speed and efficiency. Their primary payloads, **Ryuk** and **Conti**, are sophisticated ransomware strains designed for high-performance encryption of large file systems. The group does not typically engage in extensive data exfiltration for extortion purposes, instead focusing almost entirely on the disruption caused by encryption to drive their ransom demands.

Once they receive access from an IAB—often via loaders like **TrickBot** or **BazarLoader**—FIN12 operators move with extreme speed. They use **Cobalt Strike** for lateral movement and rapidly harvest administrative credentials using **MimiKatz** or by exploiting unpatched vulnerabilities like Silver Ticket or Golden Ticket attacks. Their reliance on Remote Desktop Protocol (RDP) for internal movement allows them to quickly stage ransomware on domain controllers and high-value file servers.

## Attribution

FIN12 is attributed with high confidence to Russia-based cybercriminals. The group's operational hours and its avoidance of targets within the Commonwealth of Independent States (CIS) are consistent with other major Russian ransomware syndicates. While the group operates as a distinct entity, they maintain close technical and operational ties with the developers of the **TrickBot** botnet and the **Conti** ransomware-as-a-service (RaaS) platform.

Mandiant and Microsoft have both highlighted the group's "agnostic" approach to initial access, noting that FIN12 will utilize any reliable entry point provided by the IAB market to achieve its goals. This professionalization of the attack lifecycle—splitting the work between specialized access brokers and specialized ransomware deployers—is a hallmark of the group's successful business model.

## MITRE ATT&CK Profile

FIN12's tradecraft is focused on rapid lateral movement and large-scale impact:

- **T1486 (Data Encrypted for Impact):** The primary objective—using Ryuk or Conti to disable the victim's business operations.
- **T1078.002 (Valid Accounts: Domain Accounts):** Rapidly acquiring and utilizing administrative credentials to gain total control over the target domain.
- **T1021.001 (Remote Services: Remote Desktop Protocol):** Using RDP to move between systems and stage malicious payloads.
- **T1562.001 (Impair Defenses: Disable or Modify Tools):** Systematically disabling security software and backup services across the network before initiating encryption.

## Sources & References

- [Mandiant: FIN12 — The Ransomware Group Specializing in Healthcare Targeting](https://www.mandiant.com/resources/blog/fin12-ransomware-healthcare) — Mandiant, 2021-10-07
- [CISA: Advisory (AA22-257A) — StopRansomware: Conti Ransomware Indicators and Tradecraft](https://www.cisa.gov/news-events/cybersecurity-advisories/aa22-257a) — CISA, 2022-09-14
- [MITRE ATT&CK: FIN12 (Group G1002)](https://attack.mitre.org/groups/G1002/) — MITRE ATT&CK, 2023-10-21
- [Microsoft: Insights into FIN12 — A Ransomware Group Focused on Fast Impact](https://www.microsoft.com/en-us/security/blog/2021/10/07/insights-into-fin12-a-ransomware-group-focused-on-fast-impact/) — Microsoft Security, 2021-10-07
- [FBI: Alert — Indicators of Compromise Associated with Ryuk Ransomware](https://www.fbi.gov/news/press-releases/fbi-announces-disruption-of-ryuk-infrastructure) — FBI, 2021-01-20
