---
name: "Evil Corp"
aliases:
  - "Indrik Spider"
  - "Dridex Gang"
affiliation: "Unknown (Russia-based)"
motivation: "Financial"
status: active
country: "Russia"
firstSeen: "2009"
lastSeen: "2026"
targetSectors:
  - "Finance"
  - "Manufacturing"
  - "Technology"
  - "Media"
  - "Government"
targetGeographies:
  - "Global"
  - "United States"
  - "Europe"
tools:
  - "Dridex"
  - "WastedLocker"
  - "BitPaymer"
  - "Hades"
  - "Phoenix Locker"
  - "Macaw Locker"
  - "LockBit (affiliated)"
mitreMappings:
  - techniqueId: "T1486"
    techniqueName: "Data Encrypted for Impact"
    tactic: "Impact"
    notes: "Historically utilized a series of custom ransomware families (BitPaymer, WastedLocker) to extort large-scale organizations."
  - techniqueId: "T1566.001"
    techniqueName: "Phishing: Spearphishing Attachment"
    tactic: "Initial Access"
    notes: "The group's foundational success was built on the massive distribution of the Dridex banking trojan via malicious email attachments."
  - techniqueId: "T1204.002"
    techniqueName: "User Execution: Malicious File"
    tactic: "Execution"
    notes: "Frequently utilizes weaponized Office documents with malicious macros to initiate the infection chain for Dridex and subsequent ransomware."
attributionConfidence: A1
attributionRationale: "Formally attributed to Maksim Yakubets and Igor Turashev by the U.S. Department of the Treasury and the Department of Justice in 2019."
reviewStatus: "draft_ai"
generatedBy: "penfold-bot"
generatedDate: 2026-04-16
tags:
  - "evil-corp"
  - "indrik-spider"
  - "dridex"
  - "wastedlocker"
  - "cybercrime"
  - "sanctions-evasion"
sources:
  - url: "https://home.treasury.gov/news/press-releases/sm845"
    publisher: "US Department of the Treasury"
    publisherType: government
    reliability: R1
    publicationDate: "2019-12-05"
    accessDate: "2026-04-16"
    archived: false
  - url: "https://www.justice.gov/opa/pr/six-individuals-indicted-wide-ranging-international-conspiracy-deploy-dridex-malware"
    publisher: "US Department of Justice"
    publisherType: government
    reliability: R1
    publicationDate: "2019-12-05"
    accessDate: "2026-04-16"
    archived: false
  - url: "https://www.mandiant.com/resources/blog/unc2165-shifts-to-lockbit"
    publisher: "Mandiant"
    publisherType: vendor
    reliability: R1
    publicationDate: "2022-06-02"
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

Evil Corp, also known as **Indrik Spider**, is one of the world's most infamous and longest-running cybercrime syndicates. Based in Russia, the group is responsible for the development and operation of the **Dridex** banking trojan, which has been used to steal hundreds of millions of dollars from financial institutions and their customers since 2011. The group's leadership, including **Maksim Yakubets**, has been formally indicted by U.S. authorities and is currently under heavy international sanctions.

Following the imposition of sanctions in 2019, Evil Corp transitioned its business model toward high-profile ransomware-as-a-service (RaaS) operations. To evade the legal restrictions that prevent victims from paying sanctioned entities, the group has frequently rebranded its ransomware payloads (under names like **WastedLocker**, **Hades**, and **Phoenix Locker**) and has increasingly utilized the infrastructure of other ransomware gangs, such as LockBit.

## Notable Campaigns

### The Dridex Botnet Era (2014-2019)
At its peak, the Dridex botnet was one of the most prolific financial malware operations globally. Evil Corp utilized the botnet to harvest banking credentials from thousands of victims, primarily in the United States and Europe. The operation was characterized by its massive, automated email campaigns and its ability to rapidly iterate the Dridex code to evade security signatures, resulting in estimated global losses exceeding $100 million.

### WastedLocker Targeting of Garmin (2020)
In July 2020, Evil Corp deployed its **WastedLocker** ransomware against Garmin, a major provider of GPS and wearable technology. The attack caused a multi-day outage of Garmin's online services, including its aviation and fitness platforms. Garmin allegedly paid a multi-million dollar ransom to obtain a decryption key, highlighting the extreme leverage the group can exert over high-revenue technology firms.

## Technical Capabilities

Evil Corp possesses elite malware development capabilities. Their flagship tool, **Dridex**, is a highly modular banking trojan that supports web injections, credential harvesting, and the ability to function as a backdoor for second-stage payloads. Their ransomware families, such as **WastedLocker** and **BitPaymer**, are known for their sophisticated encryption routines and their ability to bypass Endpoint Detection and Response (EDR) systems through advanced obfuscation and anti-debugging techniques.

The group's operational tradecraft is highly disciplined. They frequently utilize compromised infrastructure and legitimate administrative utilities (like PowerShell and WMI) to move laterally within a victim's network. In their recent efforts to evade sanctions, they have demonstrated an ability to rapidly develop "clean-room" versions of their ransomware (like **Macaw Locker**) that remove known technical headers associated with the Evil Corp brand.

## Attribution

Evil Corp is formally attributed to a network of individuals based in Moscow and the surrounding regions, led by **Maksim Yakubets** (alias "aqua") and **Igor Turashev**. In 2019, the **U.S. Department of the Treasury's Office of Foreign Assets Control (OFAC)** designated Evil Corp and its core members under Executive Order 13694, making it illegal for U.S. persons to engage in transactions with them.

The attribution is supported by extensive forensic evidence, including the seizure of C2 servers, financial records linking Yakubets to the group's operations, and cooperation from international law enforcement agencies. Yakubets is also allegedly linked to the Russian Federal Security Service (FSB), further complicating the efforts to disrupt the group's safe haven within Russia.

## MITRE ATT&CK Profile

Evil Corp's tradecraft bridges the gap between traditional banking trojans and modern targeted ransomware:

- **T1566.001 (Phishing: Spearphishing Attachment):** The primary delivery mechanism for the Dridex loader.
- **T1486 (Data Encrypted for Impact):** Deployment of WastedLocker or Phoenix Locker to force high-value ransom payments.
- **T1059.001 (Command and Scripting Interpreter: PowerShell):** Extensive use of PowerShell scripts for internal reconnaissance and the deployment of memory-only payloads.
- **T1078 (Valid Accounts):** Maintaining persistence using legitimate administrative credentials harvested during the initial stages of a compromise.

## Sources & References

- [US Department of the Treasury: Treasury Sanctions Evil Corp, the World's Most Harmful Cyber-Crime Group](https://home.treasury.gov/news/press-releases/sm845) — US Department of the Treasury, 2019-12-05
- [US Department of Justice: Six Individuals Indicted in Wide-Ranging International Conspiracy to Deploy Dridex](https://www.justice.gov/opa/pr/six-individuals-indicted-wide-ranging-international-conspiracy-deploy-dridex-malware) — US Department of Justice, 2019-12-05
- [Mandiant: UNC2165 (Evil Corp) Shifts to LockBit to Evade Sanctions](https://www.mandiant.com/resources/blog/unc2165-shifts-to-lockbit) — Mandiant, 2022-06-02
- [MITRE ATT&CK: Evil Corp (Group G0045)](https://attack.mitre.org/groups/G0045/) — MITRE ATT&CK, 2023-10-21
- [Microsoft: Analysis of WastedLocker and Indrik Spider tradecraft](https://www.microsoft.com/en-us/security/blog/2020/06/23/digital-forensics-and-incident-response-case-study-wastedlocker-ransomware/) — Microsoft Security, 2020-06-23
