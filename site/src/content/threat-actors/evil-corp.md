---
name: "Evil Corp"
aliases:
  - "Indrik Spider"
  - "Dridex Gang"
  - "UNC2165"
  - "Manatee Tempest"
affiliation: "Cybercriminal (Russian)"
motivation: "Financial"
status: active
country: "Russia"
firstSeen: "2014"
lastSeen: "2025"
targetSectors:
  - "Financial Services"
  - "Government"
  - "Healthcare"
  - "Manufacturing"
  - "Technology"
targetGeographies:
  - "Global"
  - "United States"
  - "Europe"
tools:
  - "Dridex"
  - "BitPaymer"
  - "WastedLocker"
  - "Hades"
  - "PhoenixLocker"
  - "PayloadBIN"
  - "Macaw Locker"
  - "LockBit (affiliate)"
mitreMappings:
  - techniqueId: "T1486"
    techniqueName: "Data Encrypted for Impact"
    tactic: "Impact"
    notes: "Deploys multiple ransomware families including WastedLocker and BitPaymer."
  - techniqueId: "T1566.001"
    techniqueName: "Phishing: Spearphishing Attachment"
    tactic: "Initial Access"
    notes: "Dridex banking trojan distributed through malicious email attachments."
  - techniqueId: "T1055"
    techniqueName: "Process Injection"
    tactic: "Defense Evasion"
    notes: "Dridex and subsequent tools use process injection to evade security controls."
attributionConfidence: A1
attributionRationale: "U.S. DOJ indicted Maksim Yakubets and Igor Turashev in 2019. U.S. Treasury sanctioned Evil Corp members and stated Yakubets had provided direct assistance to the Russian FSB."
reviewStatus: "under_review"
generatedBy: "penfold-bot"
generatedDate: 2026-04-16
tags:
  - "cybercriminal"
  - "russia"
  - "ransomware"
  - "evil-corp"
  - "banking-trojan"
  - "dridex"
sources:
  - url: "https://www.justice.gov/opa/pr/russian-national-charged-decade-long-series-hacking-and-bank-fraud-offenses-resulting-tens"
    publisher: "US Department of Justice"
    publisherType: government
    reliability: R1
    publicationDate: "2019-12-05"
    accessDate: "2026-04-16"
    archived: false
  - url: "https://home.treasury.gov/news/press-releases/sm845"
    publisher: "US Department of the Treasury"
    publisherType: government
    reliability: R1
    publicationDate: "2019-12-05"
    accessDate: "2026-04-16"
    archived: false
  - url: "https://www.crowdstrike.com/blog/double-trouble-ransomware-data-leak-extortion-part-1/"
    publisher: "CrowdStrike"
    publisherType: vendor
    reliability: R1
    publicationDate: "2020-10-15"
    accessDate: "2026-04-16"
    archived: false
  - url: "https://www.ncsc.gov.uk/news/uk-and-allies-sanction-more-members-of-russian-cyber-crime-gang"
    publisher: "UK NCSC"
    publisherType: government
    reliability: R1
    publicationDate: "2024-10-01"
    accessDate: "2026-04-16"
    archived: false
---

## Executive Summary

Evil Corp (also tracked as Indrik Spider) is a Russian cybercriminal organization led by Maksim Yakubets, who was indicted by the U.S. Department of Justice in 2019 and sanctioned by the U.S. Treasury Department. Active since at least 2014, the group was initially responsible for the Dridex banking trojan, which caused over $100 million in financial losses. Evil Corp subsequently transitioned to ransomware operations, deploying a succession of ransomware families.

The U.S. Treasury identified Yakubets as having provided direct assistance to the Russian Federal Security Service (FSB), adding a state-nexus dimension to the group's criminal activities without converting Evil Corp into a formal state unit. U.S. sanctions against Evil Corp created complications for victims seeking to pay ransoms, leading the group to rebrand its ransomware repeatedly to circumvent sanctions compliance programs.

## Notable Campaigns

### 2014-2019 -- Dridex Banking Trojan

Evil Corp operated the Dridex banking trojan, one of the most prolific financial malware families, targeting banking credentials through man-in-the-browser attacks. Dridex was distributed through massive spam campaigns and caused estimated losses exceeding $100 million from banks in over 40 countries.

### 2019-2020 -- BitPaymer and WastedLocker Ransomware

The group deployed BitPaymer ransomware against enterprise targets, demanding ransoms of $500,000 to $1 million. Following the 2019 sanctions, Evil Corp transitioned to WastedLocker, which targeted large U.S. corporations including Garmin, which reportedly paid a $10 million ransom.

### 2021-2024 -- Ransomware Rebranding

To evade sanctions, Evil Corp created multiple ransomware rebrands: Hades, PhoenixLocker, PayloadBIN, and Macaw Locker. Each rebrand attempted to distance the group from the sanctioned Evil Corp identity. Mandiant tracked some Evil Corp members operating as LockBit affiliates under the UNC2165 designation.

## Technical Capabilities

Evil Corp maintains a mature malware development capability. **Dridex** evolved through multiple versions, incorporating modular architecture, anti-analysis techniques, and peer-to-peer botnet C2. The group's ransomware families share code lineage, with each rebrand building on the prior version's capabilities.

**WastedLocker** targeted high-value enterprises using SocGholish (fake browser update) initial access, followed by Cobalt Strike for post-exploitation. The ransomware used AES-256 and RSA-4096 encryption and targeted specific high-value file types.

The group demonstrates advanced operational security, repeatedly rebranding to evade sanctions and using affiliates and subcontractors to maintain operational distance from sanctioned individuals.

## Attribution

The December 2019 DOJ indictment named Maksim Yakubets and Igor Turashev as leaders of Evil Corp. The U.S. Treasury simultaneously sanctioned multiple Evil Corp members and identified Yakubets as having worked for the Russian FSB since 2017. The UK's National Crime Agency (NCA) participated in the investigation. In October 2024, the UK and allies sanctioned additional Evil Corp members including Yakubets' father-in-law, a former FSB official.

## MITRE ATT&CK Profile

**Initial Access**: SocGholish fake browser updates (T1189), Dridex email campaigns (T1566.001), and exploitation of public-facing applications (T1190).

**Execution**: PowerShell (T1059.001), WMI (T1047), and custom loaders for ransomware deployment.

**Defense Evasion**: Process injection (T1055), code signing with stolen certificates, and repeated ransomware rebranding to evade detection signatures.

**Impact**: File encryption (T1486), shadow copy deletion (T1490), and service termination (T1489).

## Sources & References

- [US DOJ: Russian National Charged - Evil Corp](https://www.justice.gov/opa/pr/russian-national-charged-decade-long-series-hacking-and-bank-fraud-offenses-resulting-tens) -- US Department of Justice, 2019-12-05
- [US Treasury: Evil Corp Sanctions](https://home.treasury.gov/news/press-releases/sm845) -- US Department of the Treasury, 2019-12-05
- [CrowdStrike: Indrik Spider / Evil Corp Analysis](https://www.crowdstrike.com/blog/double-trouble-ransomware-data-leak-extortion-part-1/) -- CrowdStrike, 2020-10-15
- [UK NCSC: Evil Corp Sanctions](https://www.ncsc.gov.uk/news/uk-and-allies-sanction-more-members-of-russian-cyber-crime-gang) -- UK NCSC, 2024-10-01
