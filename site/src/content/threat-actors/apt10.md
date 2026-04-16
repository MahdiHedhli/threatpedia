---
name: "APT10"
aliases:
  - "Stone Panda"
  - "MenuPass"
  - "Red Apollo"
  - "Potassium"
  - "Cicada"
  - "HOGFISH"
affiliation: "China"
motivation: "Espionage"
status: active
country: "China"
firstSeen: "2006"
lastSeen: "2026"
targetSectors:
  - "Managed Service Providers (MSPs)"
  - "Aerospace"
  - "Manufacturing"
  - "Government"
  - "Technology"
  - "Telecommunications"
targetGeographies:
  - "Global"
  - "United States"
  - "Japan"
  - "Europe"
  - "India"
tools:
  - "PlugX"
  - "QuasarRAT"
  - "RedLeaves"
  - "SodaMaster"
  - "ChChes"
  - "PoisonIvy"
mitreMappings:
  - techniqueId: "T1195.002"
    techniqueName: "Supply Chain Compromise: Compromise Software Supply Chain"
    tactic: "Initial Access"
    notes: "Utilized extensively in the Cloud Hopper campaign to compromise Managed Service Providers (MSPs) and gain access to their clients' networks."
  - techniqueId: "T1566.001"
    techniqueName: "Spear-phishing Attachment"
    tactic: "Initial Access"
    notes: "Frequent use of malicious attachments tailored to specific industry verticals, often in Japanese or English."
  - techniqueId: "T1071.001"
    techniqueName: "Application Layer Protocol: Web Protocols"
    tactic: "Command and Control"
    notes: "APT10 backdoors often utilize HTTP/S for C2 communication, blending in with legitimate cloud service traffic."
attributionConfidence: A1
attributionRationale: "Formally attributed to the Tianjin State Security Bureau (MSS) by the U.S. Department of Justice through the indictment of Zhu Hua and Zhang Shilong in 2018."
reviewStatus: "draft_ai"
generatedBy: "penfold-bot"
generatedDate: 2026-04-16
tags:
  - "apt10"
  - "stone-panda"
  - "china"
  - "mss"
  - "cloud-hopper"
  - "msp-compromise"
sources:
  - url: "https://www.justice.gov/opa/pr/two-chinese-hackers-associated-ministry-state-security-charged-global-computer-intrusion"
    publisher: "US Department of Justice"
    publisherType: government
    reliability: R1
    publicationDate: "2018-12-20"
    accessDate: "2026-04-16"
    archived: false
  - url: "https://www.cisa.gov/news-events/cybersecurity-advisories/aa22-158a"
    publisher: "CISA"
    publisherType: government
    reliability: R1
    publicationDate: "2022-06-07"
    accessDate: "2026-04-16"
    archived: false
  - url: "https://www.pwc.co.uk/cyber-security/pdf/cloud-hopper-report-final-v.4.pdf"
    publisher: "PwC UK"
    publisherType: research
    reliability: R1
    publicationDate: "2017-04-03"
    accessDate: "2026-04-16"
    archived: false
  - url: "https://attack.mitre.org/groups/G0045/"
    publisher: "MITRE ATT&CK"
    publisherType: community
    reliability: R1
    publicationDate: "2023-10-21"
    accessDate: "2026-04-16"
    archived: false
---

## Executive Summary

APT10 is a prolific nation-state threat actor operating on behalf of the **Chinese Ministry of State Security (MSS)**, specifically the Tianjin State Security Bureau. Active since at least 2006, the group is best known for its long-term, global espionage campaigns aimed at stealing intellectual property and confidential business data. The group's primary mandate is to support China's "Made in China 2025" strategic objectives by targeting the technology, manufacturing, and aerospace sectors.

A defining characteristic of APT10 is its pioneering use of **supply chain attacks via Managed Service Providers (MSPs)**. By compromising the centralized infrastructure of MSPs, the group achieves secondary access to the internal networks of various clients across multiple industry verticals, a methodology that significantly complicates detection and attribution.

## Notable Campaigns

### Operation Cloud Hopper (2014-2017)
In what is considered its most successful campaign, APT10 targeted dozens of Managed Service Providers globally. Using the MSPs' legitimate remote management tools and trusted network connections, the group exfiltrated terabytes of data from victims' clients, including major global corporations and government agencies. This campaign illustrated the extreme risk of "island hopping" through trusted third-party providers.

### Targeting of Japanese Organizations
APT10 has a long-standing history of targeting Japanese entities in the manufacturing, engineering, and government sectors. Campaigns such as those involving the **ChChes** and **RedLeaves** malware were specifically tailored to exploit Japanese language versions of popular software and infrastructure, often utilizing spear-phishing lures related to regional policy and trade.

## Technical Capabilities

APT10 possesses a sophisticated and evolving arsenal of custom malware. Their primary tools include **PlugX** and **QuasarRAT**, both of which allow for robust remote administration. They have also developed specialized implants like **RedLeaves** and **SodaMaster**, which feature advanced anti-analysis techniques and the ability to execute code entirely in memory.

The group's operational security is high, frequently utilizing legitimate administrative tools (like PowerShell, Cobalt Strike, and WMI) to "live off the land" and minimize their file-based signature. Their infrastructure management often leverages dynamic DNS and compromised local servers in the target's geography to mask the origin of their C2 traffic.

## Attribution

APT10 was formally attributed to the Chinese MSS in a 2018 indictment by the **U.S. Department of Justice**. The indictment named **Zhu Hua** (alias Afwar) and **Zhang Shilong** (alias Baobeilong) as members of the group operating under the auspices of the Tianjin State Security Bureau.

Further analysis by cybersecurity firms (such as PwC, BAE Systems, and Mandiant) and government agencies (including CISA and the UK's NCSC) has confirmed the group's linkages to Chinese state interests. The attribution is based on a combination of technical indicators, infrastructure overlaps, and the clear alignment between APT10's targets and Chinese economic policy goals.

## MITRE ATT&CK Profile

APT10's primary techniques focus on stealthy persistence and lateral movement:

- **T1195.002 (Supply Chain Compromise):** Targeting MSPs to leverage their trusted access to downstream client networks.
- **T1566.001 (Spear-phishing Attachment):** Delivering droppers via weaponized RTF or Office documents.
- **T1021.001 (Remote Desktop Protocol):** Using stolen credentials to move laterally within and between networks via RDP.
- **T1078 (Valid Accounts):** Maintaining persistence using legitimate administrative credentials stolen during the initial phase of an operation.

## Sources & References

- [US Department of Justice: Two Chinese Hackers Associated with Ministry of State Security Charged with Global Computer Intrusion](https://www.justice.gov/opa/pr/two-chinese-hackers-associated-ministry-state-security-charged-global-computer-intrusion) — US Department of Justice, 2018-12-20
- [CISA: Advisory (AA22-158a) — Cybersecurity Best Practices for Managed Service Providers and Their Customers](https://www.cisa.gov/news-events/cybersecurity-advisories/aa22-158a) — CISA, 2022-06-07
- [PwC UK: Operation Cloud Hopper — Technical Analysis of APT10's Global MSP Campaign](https://www.pwc.co.uk/cyber-security/pdf/cloud-hopper-report-final-v.4.pdf) — PwC UK, 2017-04-03
- [MITRE ATT&CK: APT10 (Group G0045)](https://attack.mitre.org/groups/G0045/) — MITRE ATT&CK, 2023-10-21
- [BAE Systems: APT10 — The MenuPass Group's Evolving Infrastructure](https://www.baesystems.com/en/cybersecurity/blog/apt10-menupass-group-infrastructure) — BAE Systems, 2017-04-03
