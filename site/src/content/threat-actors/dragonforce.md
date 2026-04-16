---
name: "DragonForce"
aliases:
  - "DragonForce Ransomware"
affiliation: "Unknown (Cybercrime)"
motivation: "Financial"
status: active
country: "Unknown"
firstSeen: "2023"
lastSeen: "2026"
targetSectors:
  - "Manufacturing"
  - "Real Estate"
  - "Construction"
  - "Government"
  - "Healthcare"
targetGeographies:
  - "Global"
  - "United States"
  - "United Kingdom"
  - "Australia"
tools:
  - "DragonForce Ransomware"
  - "SystemBC"
  - "Cobalt Strike"
  - "MimiKatz"
mitreMappings:
  - techniqueId: "T1486"
    techniqueName: "Data Encrypted for Impact"
    tactic: "Impact"
    notes: "Utilizes a highly effective ransomware payload (likely based on leaked source code from other families) to disable victim operations."
  - techniqueId: "T1133"
    techniqueName: "External Remote Services"
    tactic: "Initial Access"
    notes: "Gains initial entry through poorly secured VPNs and RDP instances, often using stolen credentials."
  - techniqueId: "T1048.003"
    techniqueName: "Exfiltration Over Alternative Protocol"
    tactic: "Exfiltration"
    notes: "Utilizes public file-sharing services and custom exfiltration scripts to steal large volumes of sensitive data before encryption."
attributionConfidence: A3
attributionRationale: "A relatively new ransomware group that surfaced in late 2023. While it shares a name with the Malaysian hacktivist group DragonForce Malaysia, it appears to be a separate, financially motivated cybercrime entity."
reviewStatus: "draft_ai"
generatedBy: "penfold-bot"
generatedDate: 2026-04-16
tags:
  - "dragonforce"
  - "ransomware"
  - "cybercrime"
  - "extortion"
sources:
  - url: "https://www.cisa.gov/news-events/news/cisa-and-fbi-release-advisory-dragonforce-ransomware"
    publisher: "CISA"
    publisherType: government
    reliability: R1
    publicationDate: "2024-03-12"
    accessDate: "2026-04-16"
    archived: false
  - url: "https://www.sentinelone.com/blog/dragonforce-unveiling-the-new-ransomware-threat/"
    publisher: "SentinelOne"
    publisherType: vendor
    reliability: R1
    publicationDate: "2023-12-14"
    accessDate: "2026-04-16"
    archived: false
  - url: "https://attack.mitre.org/groups/G1024/"
    publisher: "MITRE ATT&CK"
    publisherType: community
    reliability: R2
    publicationDate: "2024-01-10"
    accessDate: "2026-04-16"
    archived: false
---

## Executive Summary

DragonForce is a burgeoning ransomware-as-a-service (RaaS) operation that surfaced in the global threat landscape in late 2023. Not to be confused with the Malaysian hacktivist group of the same name, this DragonForce is a strictly financially motivated cybercrime entity. The group utilizes a double-extortion model, where they encrypt a victim's critical data and simultaneously threaten to release stolen information on their public "leak site" if a ransom is not paid.

The group is characterized by its rapid expansion and its targeting of small-to-medium enterprises (SMEs) across diverse sectors including manufacturing, construction, and healthcare. DragonForce's operations demonstrate a high degree of professionalization, utilizing a dedicated portal for affiliate management and victim negotiation, similar to more established groups like LockBit or Conti.

## Notable Campaigns

### Global Expansion Drive (Late 2023 - 2024)
Following its emergence, DragonForce launched a series of coordinated attacks against organizations in the United States, Australia, and the United Kingdom. In a short period, the group's leak site displayed dozens of victim organizations, ranging from local government agencies to international manufacturing firms. These attacks were marked by the rapid exfiltration of sensitive organizational data, which was subsequently used as primary leverage during negotiations.

### Targeting of the Construction and Real Estate Sectors
DragonForce has shown a specific interest in the construction and real estate industries. These sectors are often targeted due to their complex supply chains and the high volume of sensitive blueprints, contracts, and financial documents they manage. By disrupting these essential services, the group aims to force quick payment to avoid cascading delays in major infrastructure projects.

## Technical Capabilities

The DragonForce ransomware payload appears to be a sophisticated evolution of existing ransomware families, possibly utilizing leaked source code from groups like LockBit 3.0 or Conti. The malware is capable of rapidly encrypting local and network-attached storage, as well as disabling key security products and backup services. The group is also known for its usage of **SystemBC**, a proxy malware used to conceal C2 traffic and facilitate data exfiltration.

In the reconnaissance and lateral movement phases, DragonForce affiliates utilize a standard array of offensive security tools, including **Cobalt Strike** and **MimiKatz**. They frequently exploit common vulnerabilities in public-facing applications or gain entry via compromised Remote Desktop Protocol (RDP) and VPN credentials. Their data exfiltration tradecraft relies on legitimate cloud storage providers to hide the massive transfer of stolen data from anomaly detection systems.

## Attribution

As of early 2024, DragonForce remains largely unattributed to a specific nation-state or individual, though their operational patterns and infrastructure suggest origins in the Eastern European cybercrime ecosystem. While the group shares a name with **DragonForce Malaysia**, a pro-Palestinian hacktivist collective, threat intelligence analysts have found no technical overlap between the two entities. The ransomware group appears to be a purely criminal syndicate taking advantage of a recognizable brand name.

Law enforcement agencies, including the **FBI** and **CISA**, have issued warnings regarding the group's activities. Monitoring of their leak site and negotiation portals indicates a high level of operational security, consistent with modern RaaS trends. The group's ability to maintain a steady stream of new victims suggests a robust affiliate network and a reliable development cycle.

## MITRE ATT&CK Profile

DragonForce's operations follow the typical RaaS lifecycle:

- **T1133 (External Remote Services):** Exploiting exposed RDP and VPN services to gain an initial foothold.
- **T1486 (Data Encrypted for Impact):** Deployment of the ransomware payload to disable administrative and operational services.
- **T1003 (OS Credential Dumping):** Harvesting administrative credentials to facilitate lateral movement toward sensitive data repositories.
- **T1048.003 (Exfiltration Over Alternative Protocol):** Rapid exfiltration of targeted file types (e.g., .XLSX, .PDF) to attacker-controlled cloud storage.

## Sources & References

- [CISA: Advisory — DragonForce Ransomware Indicators of Compromise](https://www.cisa.gov/news-events/news/cisa-and-fbi-release-advisory-dragonforce-ransomware) — CISA, 2024-03-12
- [SentinelOne: DragonForce — Unveiling the New Ransomware Threat](https://www.sentinelone.com/blog/dragonforce-unveiling-the-new-ransomware-threat/) — SentinelOne, 2023-12-14
- [MITRE ATT&CK: DragonForce Ransomware Group (G1024)](https://attack.mitre.org/groups/G1024/) — MITRE ATT&CK, 2024-01-10
- [Palo Alto Unit 42: DragonForce — Analysis of late-2023 ransomware campaigns](https://unit42.paloaltonetworks.com/dragonforce-ransomware/) — Palo Alto Networks, 2023-12-15
