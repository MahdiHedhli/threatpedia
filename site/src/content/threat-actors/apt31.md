---
name: "APT31"
aliases:
  - "Zirconium"
  - "Judgment Panda"
  - "Red Keres"
  - "Altair"
  - "BRONZE VINEWOOD"
affiliation: "China"
motivation: "Espionage"
status: active
country: "China"
firstSeen: "2010"
lastSeen: "2026"
targetSectors:
  - "Government"
  - "Political Organizations"
  - "Defense"
  - "Aerospace"
  - "Manufacturing"
  - "Technology"
targetGeographies:
  - "Global"
  - "United States"
  - "Europe"
  - "Vietnam"
  - "Norway"
tools:
  - "SOGU"
  - "DROPOUT"
  - "Snappy"
  - "Cobalt Strike"
  - "MimiKatz"
  - "ScanBox"
mitreMappings:
  - techniqueId: "T1566.002"
    techniqueName: "Phishing: Spearphishing Link"
    tactic: "Initial Access"
    notes: "Frequently utilizes malicious links (sometimes disguised as Google Drive links) to deliver stage-one droppers like SOGU."
  - techniqueId: "T1071.001"
    techniqueName: "Application Layer Protocol: Web Protocols"
    tactic: "Command and Control"
    notes: "APT31 backdoors often utilize HTTP/S for C2 communication, sometimes leveraging legitimate cloud services to blend in with normal traffic."
  - techniqueId: "T1027"
    techniqueName: "Obfuscated Files or Information"
    tactic: "Defense Evasion"
    notes: "Extensive use of packing and custom encryption within the SOGU and DROPOUT malware families to evade automated detection."
attributionConfidence: A1
attributionRationale: "Formally attributed to the Chinese Ministry of State Security (MSS) by the U.S. and UK governments following the indictment of seven hackers in March 2024."
reviewStatus: "draft_ai"
generatedBy: "penfold-bot"
generatedDate: 2026-04-16
tags:
  - "apt31"
  - "zirconium"
  - "china"
  - "mss"
  - "espionage"
  - "election-targeting"
sources:
  - url: "https://www.justice.gov/opa/pr/seven-hackers-associated-chinese-government-charged-computer-intrusions-targeting-perceived"
    publisher: "US Department of Justice"
    publisherType: government
    reliability: R1
    publicationDate: "2024-03-25"
    accessDate: "2026-04-16"
    archived: false
  - url: "https://www.ncsc.gov.uk/news/uk-and-allies-expose-apt31-campaign-targeting-democracies"
    publisher: "NCSC UK"
    publisherType: government
    reliability: R1
    publicationDate: "2024-03-25"
    accessDate: "2026-04-16"
    archived: false
  - url: "https://www.cisa.gov/news-events/cybersecurity-advisories/aa24-085a"
    publisher: "CISA"
    publisherType: government
    reliability: R1
    publicationDate: "2024-03-25"
    accessDate: "2026-04-16"
    archived: false
  - url: "https://attack.mitre.org/groups/G0034/"
    publisher: "MITRE ATT&CK"
    publisherType: community
    reliability: R1
    publicationDate: "2023-10-21"
    accessDate: "2026-04-16"
    archived: false
---

## Executive Summary

APT31, also known as **Zirconium** and **Judgment Panda**, is a prolific nation-state threat actor operating on behalf of the **Chinese Ministry of State Security (MSS)**, specifically the Hubei State Security Department. Active since at least 2010, the group focuses on high-level espionage targeting government officials, political organizations, and strategic industry sectors. Their mandate involves collecting intelligence that supports China's domestic security and foreign policy objectives.

The group gained heightened international visibility in 2024 following a series of coordinated indictments and public attributions by the United States and the United Kingdom. APT31 is particularly noted for its sophisticated targeting of democratic processes, including the infrastructure of major political parties and the personal communications of high-ranking legislators and election officials.

## Notable Campaigns

### Targeting of Democratic Institutions (2020-2024)
Between 2020 and 2024, APT31 conducted a sustained campaign against political figures and institutions in the United States and Europe. This included targeting members of the Inter-Parliamentary Alliance on China (IPAC) and the personal email accounts of U.S. senators and their staff. The group utilized tracking pixels embedded in emails to perform initial reconnaissance and identify vulnerable targets for subsequent exploit delivery.

### Exploitation of Network Infrastructure
APT31 has frequently targeted the home routers and individual internet devices of strategic targets to build a distributed C2 network. By compromising small office/home office (SOHO) routers, the group creates a mesh of "hidden" intermediate proxies that mask the origin of their attacks and allow them to bypass geographical ip-blocking filters.

## Technical Capabilities

APT31 maintains a robust and modular toolset. Their primary implant is **SOGU** (or Snappy), a versatile backdoor capable of file exfiltration, keylogging, and remote shell execution. They also utilize **DROPOUT**, a malware family focused on persistence and stealthy credential theft. The group is known for its ability to rapidly weaponize N-day vulnerabilities in popular enterprise hardware, such as VPN gateways and firewall appliances.

The group's operational tradecraft emphasizes the use of legitimate cloud services (including Google Drive and Dropbox) for staging their second-stage payloads and exfiltrating data. This "living off the cloud" approach allows their traffic to blend into the noise of standard corporate network activity. They also make extensive use of **ScanBox**, a browser-based reconnaissance tool that helps them profile victims' systems before delivering a payload.

## Attribution

APT31 was formally attributed to the Chinese MSS in a landmark 2024 indictment by the **U.S. Department of Justice**. The indictment named seven individuals—Ni Gaobin, Cheng Feng, Zhao Guangzong, Sun Xiaohui, Weng Ming, Cheng Chu, and Zhu Yunqi—as being part of the hacking group operating under the front company **Wuhan Xiaoruizhi Science and Technology (Wuhan XRZ)**.

Coincident with the U.S. indictment, the **United Kingdom's NCSC** and the **CISA** released joint advisories detailing APT31's tradecraft and identifying them as a threat to democratic institutions worldwide. The attribution is supported by extensive technical evidence, including infrastructure overlaps, shared malware code across MSS-linked groups, and the targeting of entities critical to the Hubei provincial government's interests.

## MITRE ATT&CK Profile

APT31's techniques are centered on reconnaissance and stealthy persistence:

- **T1566.002 (Phishing: Spearphishing Link):** Sending tailored emails with links to attacker-controlled sites to harvest credentials or deliver droppers.
- **T1071.001 (Web Protocols):** C2 communication masquerading as standard web traffic to common public services.
- **T1027 (Obfuscated Files or Information):** Using custom packers and multi-stage loading to bypass antivirus products.
- **T1016 (System Network Configuration Discovery):** Using tracking pixels and ScanBox to gather technical intelligence about a target's environment before committing to an attack.

## Sources & References

- [US Department of Justice: Seven Hackers Associated with Chinese Government Charged with Computer Intrusions](https://www.justice.gov/opa/pr/seven-hackers-associated-chinese-government-charged-computer-intrusions-targeting-perceived) — US Department of Justice, 2024-03-25
- [NCSC UK: UK and allies expose APT31 campaign targeting democracies](https://www.ncsc.gov.uk/news/uk-and-allies-expose-apt31-campaign-targeting-democracies) — NCSC UK, 2024-03-25
- [CISA: Advisory (AA24-085A) — PRC State-Sponsored Cyber Activity Against Democratic Institutions](https://www.cisa.gov/news-events/cybersecurity-advisories/aa24-085a) — CISA, 2024-03-25
- [MITRE ATT&CK: APT31 (Group G0034)](https://attack.mitre.org/groups/G0034/) — MITRE ATT&CK, 2023-10-21
- [Microsoft: Zirconium (APT31) targeting of political entities in the US and Europe](https://www.microsoft.com/en-us/security/blog/2020/09/10/strontium-detect-prevent-attacks-targeting-2020-presidential-election/) — Microsoft Security, 2020-09-10
