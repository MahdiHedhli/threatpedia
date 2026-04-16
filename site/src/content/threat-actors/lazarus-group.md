---
name: "Lazarus Group"
aliases:
  - "Hidden Cobra"
  - "Guardians of Peace"
  - "APT38"
  - "BlueNoroff"
  - "Zinc"
affiliation: "North Korea (DPRK)"
motivation: "Financial"
status: active
country: "North Korea"
firstSeen: "2009"
lastSeen: "2026"
targetSectors:
  - "Finance"
  - "Blockchain"
  - "Cryptocurrency"
  - "Defense"
  - "Government"
targetGeographies:
  - "Global"
  - "United States"
  - "South Korea"
  - "Japan"
  - "Vietnam"
tools:
  - "DTrack"
  - "WannaCry Ransomware"
  - "Manuscrypt"
  - "TrickBot (affiliated)"
  - "NukeSped"
mitreMappings:
  - techniqueId: "T1566.001"
    techniqueName: "Phishing: Spearphishing Attachment"
    tactic: "Initial Access"
    notes: "Frequently utilizes tailored phishing lures (e.g., job descriptions, security alerts) to infect high-value targets in the defense and financial sectors."
  - techniqueId: "T1486"
    techniqueName: "Data Encrypted for Impact"
    tactic: "Impact"
    notes: "Attributed to the 2017 WannaCry ransomware attack, which utilized the EternalBlue exploit to cause global disruption."
  - techniqueId: "T1557.001"
    techniqueName: "Adversary-in-the-Middle: LLMNR/NBT-NS Poisoning and SMB Relay"
    tactic: "Credential Access"
    notes: "Utilizes AitM techniques to harvest credentials and move laterally toward systems that control financial transactions and SWIFT infrastructure."
attributionConfidence: A1
attributionRationale: "Formally attributed to the North Korean Reconnaissance General Bureau (RGB) by the U.S. Department of Justice and various international intelligence agencies following several high-profile financial heists and the 2014 Sony Pictures hack."
reviewStatus: "draft_ai"
generatedBy: "penfold-bot"
generatedDate: 2026-04-16
tags:
  - "lazarus-group"
  - "hidden-cobra"
  - "dprk"
  - "financial-crime"
  - "wannacry"
  - "heist"
sources:
  - url: "https://www.justice.gov/opa/pr/north-korean-regime-backed-programmer-charged-conspiracy-conduct-multiple-cyberattacks-and"
    publisher: "US Department of Justice"
    publisherType: government
    reliability: R1
    publicationDate: "2018-09-06"
    accessDate: "2026-04-16"
    archived: false
  - url: "https://www.cisa.gov/news-events/cybersecurity-advisories/aa22-108a"
    publisher: "CISA"
    publisherType: government
    reliability: R1
    publicationDate: "2022-04-18"
    accessDate: "2026-04-16"
    archived: false
  - url: "https://attack.mitre.org/groups/G0032/"
    publisher: "MITRE ATT&CK"
    publisherType: community
    reliability: R1
    publicationDate: "2023-10-21"
    accessDate: "2026-04-16"
    archived: false
  - url: "https://www.mandiant.com/resources/blog/apt38-details-on-north-korean-financial-cyber-threat"
    publisher: "Mandiant"
    publisherType: vendor
    reliability: R1
    publicationDate: "2018-10-03"
    accessDate: "2026-04-16"
    archived: false
---

## Executive Summary

The Lazarus Group, also known as **Hidden Cobra**, is a sophisticated and prolific threat actor group attributed to the North Korean government's **Reconnaissance General Bureau (RGB)**. Active since at least 2009, the group is unique among state-sponsored entities for its heavy dual-focus on both espionage and large-scale financial crime. Their operations range from destructive sabotage against private corporations to the theft of hundreds of millions of dollars from central banks and cryptocurrency exchanges.

The group possesses a vast array of custom-developed malware and has demonstrated the ability to conduct long-term, multi-stage operations that target high-security financial infrastructure, including the **SWIFT** international banking network. Their activities are a critical component of North Korea's strategy to bypass international sanctions and generate hard currency for the regime.

## Notable Campaigns

### The Sony Pictures Hack (2014)
In late 2014, the Lazarus Group (operating under the alias "Guardians of Peace") launched a destructive cyberattack against Sony Pictures Entertainment in retaliation for the film *The Interview*. The attackers exfiltrated terabytes of sensitive data and deployed wiper malware that disabled significant portions of Sony's corporate network. This campaign remains one of the most high-profile examples of state-sponsored commercial sabotage.

### The Bangladesh Bank SWIFT Heist (2016)
In one of the most daring financial heists in history, the Lazarus Group (tracked as **APT38** for this activity) compromised the Bangladesh Central Bank and attempted to steal nearly $1 billion via the SWIFT network. While the majority of the transactions were blocked, the group successfully laundered $81 million, highlighting their deep understanding of global financial protocols and money laundering networks.

### The WannaCry Ransomware Attack (2017)
Lazarus is widely attributed to the development and initial distribution of the **WannaCry** ransomware, which utilized the leaked **EternalBlue** exploit to spread rapidly across the globe. The attack caused billions of dollars in damage, disrupting hospitals in the UK's National Health Service (NHS) and numerous commercial shipping and manufacturing operations.

## Technical Capabilities

The Lazarus Group maintains one of the most diverse and frequently updated toolsets in the cyber-threat landscape. Their hallmark is the use of modular backdoors like **Manuscrypt** and **DTrack**, which are used for reconnaissance and persistent presence. They have also demonstrated elite-level capability in exploiting zero-day vulnerabilities in common software such as Chrome and Adobe Acrobat.

In recent years, the group has specialized in the targeting of **blockchain and cryptocurrency** infrastructure. They utilize highly tailored "social engineering" campaigns (dubbed **Operation Dream Job**) where they pose as recruiters on platforms like LinkedIn to deliver malicious payloads to developers and security professionals. Their technical tradecraft for laundering stolen cryptocurrency—utilizing "mixers" and "bridges"—is considered state-of-the-art in the cybercrime ecosystem.

## Attribution

Lazarus Group is formally attributed to the North Korean state, specifically the RGB, by the **U.S. Department of Justice**, the **FBI**, and numerous international allies. In 2018, the DOJ filed charges against **Park Jin Hyok**, a North Korean programmer allegedly involved in the Sony hack and the WannaCry attacks. Subsequent indictments have linked additional North Korean nationals to the group's financial heists.

The attribution is based on a convergence of evidence, including C2 infrastructure overlaps, shared code blocks across different campaigns, and the group's consistent alignment with North Korean geopolitical and economic objectives. While the group occasionally utilizes infrastructure in other countries (such as China or Russia), their primary operational base is believed to be within North Korea or specialized units stationed abroad.

## MITRE ATT&CK Profile

Lazarus operations are characterized by their multi-stage nature and technical diversity:

- **T1566.001 (Spearphishing Attachment):** The primary method for initial access, often utilizing job-themed lures.
- **T1486 (Data Encrypted for Impact):** Deployment of WannaCry or other custom ransomware to create global chaos or extort funds.
- **T1003 (OS Credential Dumping):** Methodical harvesting of credentials to move toward financial systems or high-value intellectual property.
- **T1571 (Non-Standard Port):** Using custom C2 protocols over non-standard ports to evade network security monitoring.

## Sources & References

- [US Department of Justice: North Korean Regime-Backed Programmer Charged with Multiple Cyberattacks](https://www.justice.gov/opa/pr/north-korean-regime-backed-programmer-charged-conspiracy-conduct-multiple-cyberattacks-and) — US Department of Justice, 2018-09-06
- [CISA: Advisory (AA22-108a) — Cybersecurity Guidance for North Korean State-Sponsored Activity](https://www.cisa.gov/news-events/cybersecurity-advisories/aa22-108a) — CISA, 2022-04-18
- [MITRE ATT&CK: Lazarus Group (G0032)](https://attack.mitre.org/groups/G0032/) — MITRE ATT&CK, 2023-10-21
- [Mandiant: APT38 — Details on North Korean Financial Cyber Threat](https://www.mandiant.com/resources/blog/apt38-details-on-north-korean-financial-cyber-threat) — Mandiant, 2018-10-03
- [Microsoft: Analysis of Zinc (Lazarus) targeting of security researchers](https://www.microsoft.com/en-us/security/blog/2021/01/28/zinc-attacks-against-security-researchers/) — Microsoft Security, 2021-01-28
