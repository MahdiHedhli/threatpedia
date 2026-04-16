---
name: "APT41"
aliases:
  - "Double Dragon"
  - "BARIUM"
  - "Winnti"
  - "Wicked Panda"
  - "GHOST SPIDER"
  - "LEAD"
affiliation: "China"
motivation: "Hybrid (Espionage & Financial)"
status: active
country: "China"
firstSeen: "2012"
lastSeen: "2026"
targetSectors:
  - "Technology"
  - "Gaming"
  - "Healthcare"
  - "Telecommunications"
  - "Finance"
  - "Education"
targetGeographies:
  - "Global"
  - "United States"
  - "South Korea"
  - "Japan"
  - "India"
tools:
  - "PlugX"
  - "ShadowPad"
  - "Winnti"
  - "Crosswalk"
  - "Cobalt Strike"
  - "MimiKatz"
mitreMappings:
  - techniqueId: "T1195.002"
    techniqueName: "Supply Chain Compromise: Compromise Software Supply Chain"
    tactic: "Initial Access"
    notes: "Historically successful at compromising software vendors (e.g., CCleaner, Asus) to distribute malicious updates to millions of downstream users."
  - techniqueId: "T1203"
    techniqueName: "Exploitation for Client Execution"
    tactic: "Execution"
    notes: "The group frequently weaponizes zero-day and N-day vulnerabilities in popular enterprise software (e.g., Citrix, Confluence) for initial entry."
  - techniqueId: "T1071.001"
    techniqueName: "Application Layer Protocol: Web Protocols"
    tactic: "Command and Control"
    notes: "APT41 backdoors often utilize HTTP/S for C2 communication, frequently masquerading as legitimate administrative traffic to cloud providers."
attributionConfidence: A1
attributionRationale: "Formally attributed to the Chengdu 404 Network Technology Co., Ltd. by the U.S. Department of Justice through the indictment of five hackers in 2020."
reviewStatus: "draft_ai"
generatedBy: "penfold-bot"
generatedDate: 2026-04-16
tags:
  - "apt41"
  - "double-dragon"
  - "china"
  - "mss"
  - "supply-chain-attack"
  - "financial-crime"
sources:
  - url: "https://www.justice.gov/opa/pr/seven-international-cyber-hackers-associated-chinese-intelligence-services-charged-computer"
    publisher: "US Department of Justice"
    publisherType: government
    reliability: R1
    publicationDate: "2020-09-16"
    accessDate: "2026-04-16"
    archived: false
  - url: "https://www.cisa.gov/news-events/cybersecurity-advisories/aa20-258a"
    publisher: "CISA"
    publisherType: government
    reliability: R1
    publicationDate: "2020-09-14"
    accessDate: "2026-04-16"
    archived: false
  - url: "https://www.mandiant.com/resources/blog/apt41-double-dragon-dual-espionage-and-cyber-crime-operations"
    publisher: "Mandiant"
    publisherType: vendor
    reliability: R1
    publicationDate: "2019-08-07"
    accessDate: "2026-04-16"
    archived: false
  - url: "https://attack.mitre.org/groups/G0096/"
    publisher: "MITRE ATT&CK"
    publisherType: community
    reliability: R1
    publicationDate: "2023-10-21"
    accessDate: "2026-04-16"
    archived: false
---

## Executive Summary

APT41, also known as **Double Dragon** and **Winnti**, is a uniquely versatile nation-state threat actor operating on behalf of the **Chinese Ministry of State Security (MSS)**. Based primarily in Chengdu, the group is distinguished by its unique "hybrid" mandate: it conducts state-sponsored espionage operations during the day and engages in financially motivated cybercrime (such as video game currency theft and ransomware deployment) independently or at night.

Active since at least 2012, APT41 is renowned for its high technical proficiency and its successful execution of massive **supply chain attacks**. The group has demonstrated the ability to compromise large-scale software build environments—including those of CCleaner and Asus—to distribute malicious code to millions of end-users globally, making it one of the most prolific threat actors in the modern cyber landscape.

## Notable Campaigns

### Supply Chain Compromises (CCleaner / Asus)
APT41 is credited with some of the most impactful supply chain attacks to date. In the 2017 CCleaner compromise, the group injected a backdoor into the utility's official installer, potentially impacting over 2 million users. Similarly, in the **Operation ShadowHammer** attack (2019), they hijacked the Asus Live Update utility to deliver targeted malware to specific Mac addresses via signed updates. These operations highlighted the group's ability to compromise highly trusted software distribution channels.

### Global Zero-Day Exploit Wave (2020)
In early 2020, APT41 launched a massive global campaign exploiting zero-day vulnerabilities in various enterprise products, including **Citrix (CVE-2019-19781)**, **Zoho ManageEngine (CVE-2020-10189)**, and **Cisco** routers. The group moved with extreme speed to exploit these flaws within days of their disclosure, targeting hundreds of organizations across the manufacturing, healthcare, and government sectors to establish persistent backdoors for long-term intelligence collection.

## Technical Capabilities

APT41 maintains an elite and evolving toolset, often sharing code with other MSS-linked groups like APT10 and APT27. Their signature backdoors include **ShadowPad**—a modular implant used across the Winnti ecosystem—and **Crosswalk**, a beaconing malware used for initial reconnaissance. They are also known for their usage of **Cobalt Strike** and custom loaders that utilize **DLL side-loading** to bypass security products.

The group's operational tradecraft is highly sophisticated. They frequently utilize compromised digital certificates from legitimate software companies to sign their malware, significantly increasing the likelihood of successful infection. In their financially motivated operations, they have demonstrated the ability to manipulate video game internal economies and deploy ransomware while maintaining a low profile within the victim's broader network.

## Attribution

APT41 is formally attributed with high confidence to the **Chengdu 404 Network Technology Co., Ltd.**, a front company for Chinese intelligence services. In 2020, the **U.S. Department of Justice** issued a formal indictment against five Chinese nationals—Zhang Haoran, Tan Dailin, Jiang Lizhi, Qian Chuan, and Fu Qiang—identifying them as members of the group.

The attribution is supported by extensive evidence, including the group's use of infrastructure shared with other MSS assets, the overlap between their espionage targets and Chinese state policy (such as the 13th Five-Year Plan), and technical indicators linking their individual members to the "Chengdu 404" entity. Despite the public exposure, the group remains highly active and continues to evolve its tradecraft.

## MITRE ATT&CK Profile

APT41's techniques are defined by their speed and scale:

- **T1195.002 (Supply Chain Compromise):** Hijacking software distribution channels to achieve massive, automated reach.
- **T1203 (Exploitation for Client Execution):** Rapidly deploying exploits for newly discovered vulnerabilities in internet-facing software.
- **T1574.002 (DLL Side-Loading):** Using legitimate programs to execute malicious payloads and evade EDR solutions.
- **T1583 (Acquire Infrastructure):** Utilizing compromised local infrastructure and legitimate cloud service providers to host C2 servers and stage data.

## Sources & References

- [US Department of Justice: Seven International Cyber Hackers Associated with Chinese Intelligence Charged](https://www.justice.gov/opa/pr/seven-international-cyber-hackers-associated-chinese-intelligence-services-charged-computer) — US Department of Justice, 2020-09-16
- [CISA: Advisory (AA20-258A) — APT41 Exploits Citrix, ManageEngine, and Cisco Vulnerabilities](https://www.cisa.gov/news-events/cybersecurity-advisories/aa20-258a) — CISA, 2020-09-14
- [Mandiant: APT41 (Double Dragon) — Dual Espionage and Cyber Crime Operations](https://www.mandiant.com/resources/blog/apt41-double-dragon-dual-espionage-and-cyber-crime-operations) — Mandiant, 2019-08-07
- [MITRE ATT&CK: APT41 (Group G0096)](https://attack.mitre.org/groups/G0096/) — MITRE ATT&CK, 2023-10-21
- [Microsoft: APT41 (BARIUM) targeting of software supply chains](https://www.microsoft.com/en-us/security/blog/2019/03/25/shadowhammer-asus-update-utility-compromise/) — Microsoft Security, 2019-03-25
