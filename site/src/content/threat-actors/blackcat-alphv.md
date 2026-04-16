---
name: "BlackCat / ALPHV"
aliases:
  - "ALPHV"
  - "Noberus"
  - "UNC4466"
affiliation: "Cybercriminal (Russian-speaking)"
motivation: "Financial"
status: inactive
country: "Russia"
firstSeen: "2021"
lastSeen: "2024"
targetSectors:
  - "Healthcare"
  - "Financial Services"
  - "Technology"
  - "Government"
  - "Critical Infrastructure"
targetGeographies:
  - "Global"
  - "United States"
  - "Europe"
tools:
  - "BlackCat ransomware"
  - "ExMatter"
  - "Eamfo"
  - "Cobalt Strike"
  - "Mimikatz"
  - "Sphynx"
mitreMappings:
  - techniqueId: "T1486"
    techniqueName: "Data Encrypted for Impact"
    tactic: "Impact"
    notes: "BlackCat ransomware encrypts files using AES/ChaCha20 algorithms with per-file keys."
  - techniqueId: "T1567.002"
    techniqueName: "Exfiltration Over Web Service: Exfiltration to Cloud Storage"
    tactic: "Exfiltration"
    notes: "ExMatter exfiltrates data to attacker-controlled cloud storage before encryption."
  - techniqueId: "T1489"
    techniqueName: "Service Stop"
    tactic: "Impact"
    notes: "Stops database services, backup applications, and security tools before encryption."
attributionConfidence: A2
attributionRationale: "FBI and CISA attributed BlackCat/ALPHV as a Russian-speaking ransomware-as-a-service operation. Law enforcement disruption in December 2023 confirmed identity of operators."
reviewStatus: "draft_ai"
generatedBy: "penfold-bot"
generatedDate: 2026-04-16
tags:
  - "ransomware"
  - "raas"
  - "blackcat"
  - "alphv"
  - "healthcare"
  - "double-extortion"
sources:
  - url: "https://www.cisa.gov/news-events/cybersecurity-advisories/aa23-353a"
    publisher: "CISA"
    publisherType: government
    reliability: R1
    publicationDate: "2023-12-19"
    accessDate: "2026-04-16"
    archived: false
  - url: "https://www.justice.gov/opa/pr/justice-department-disrupts-prolific-alphvblackcat-ransomware-variant"
    publisher: "US Department of Justice"
    publisherType: government
    reliability: R1
    publicationDate: "2023-12-19"
    accessDate: "2026-04-16"
    archived: false
  - url: "https://www.ic3.gov/Media/News/2022/220420.pdf"
    publisher: "FBI"
    publisherType: government
    reliability: R1
    publicationDate: "2022-04-19"
    accessDate: "2026-04-16"
    archived: false
  - url: "https://www.microsoft.com/en-us/security/blog/2022/06/13/the-many-lives-of-blackcat-ransomware/"
    publisher: "Microsoft Security"
    publisherType: vendor
    reliability: R1
    publicationDate: "2022-06-13"
    accessDate: "2026-04-16"
    archived: false
---

## Executive Summary

BlackCat (also known as ALPHV and Noberus) was a ransomware-as-a-service (RaaS) operation active from November 2021 until early 2024. The group was the first major ransomware operation to use the Rust programming language, which provided cross-platform capabilities (Windows, Linux, VMware ESXi) and hindered reverse engineering. BlackCat employed a triple-extortion model: data theft, file encryption, and DDoS threats.

The operation accumulated over 1,000 victims globally before an FBI-led disruption in December 2023. BlackCat's affiliates targeted high-value sectors including healthcare, with the February 2024 attack on Change Healthcare (UnitedHealth Group) disrupting healthcare claims processing across the United States. The group is assessed to include former members of the DarkSide/BlackMatter ransomware operations.

## Notable Campaigns

### 2024 -- Change Healthcare Attack

A BlackCat affiliate compromised Change Healthcare, a subsidiary of UnitedHealth Group processing approximately 50% of U.S. medical claims. The attack caused weeks of disruption to pharmacies, hospitals, and insurance billing nationwide. UnitedHealth Group reportedly paid a $22 million ransom. The breach affected protected health information of an estimated 100 million individuals.

### 2023 -- MGM Resorts and Caesars Entertainment

BlackCat affiliates, working with the Scattered Spider group, compromised MGM Resorts International and Caesars Entertainment through social engineering of IT help desks. The MGM attack caused an estimated $100 million in losses from casino and hotel system shutdowns.

### 2022-2023 -- Healthcare Sector Targeting

CISA and FBI issued multiple advisories warning of BlackCat targeting the healthcare sector, with attacks on hospital systems disrupting patient care. The group's healthcare targeting drew particular law enforcement attention.

## Technical Capabilities

The BlackCat ransomware binary was written in Rust, providing cross-platform compilation, memory safety, and resistance to static analysis. The ransomware supported configurable encryption modes (full, fast, auto, smart) and could target Windows, Linux, and VMware ESXi environments from a single codebase.

**ExMatter** served as the group's primary data exfiltration tool, selectively stealing files based on extension and uploading them to attacker-controlled infrastructure before encryption. The **Sphynx** variant (version 2.0) added improved evasion capabilities and embedded tooling for lateral movement.

BlackCat operated as a RaaS, providing affiliates with a customizable ransomware builder, negotiation panel, and data leak site. The operation took a 10-20% commission on ransom payments, with affiliates handling initial access and deployment.

## Attribution

The FBI and CISA attributed BlackCat/ALPHV as a Russian-speaking cybercriminal operation in multiple advisories. In December 2023, the DOJ announced the disruption of BlackCat infrastructure, seizure of the group's Tor-based leak site, and release of decryption keys for approximately 500 victims. The group briefly attempted to resume operations before conducting an apparent exit scam in March 2024 after receiving the Change Healthcare ransom payment.

Analysis by multiple security firms indicates that BlackCat's developers were previously associated with the DarkSide (Colonial Pipeline) and BlackMatter ransomware operations, based on code similarities and operational patterns.

## MITRE ATT&CK Profile

**Initial Access**: BlackCat affiliates use various access methods including valid accounts from access brokers (T1078), exploitation of public-facing applications (T1190), and social engineering of help desk personnel.

**Execution**: The Rust-based ransomware is executed via command line with configuration flags. PowerShell (T1059.001) and PsExec are used for deployment across networks.

**Defense Evasion**: The ransomware deletes volume shadow copies (T1490), terminates security processes (T1562.001), and modifies boot configuration to prevent recovery.

**Exfiltration**: ExMatter exfiltrates selected files to cloud storage (T1567.002) before encryption begins.

**Impact**: File encryption (T1486), service termination (T1489), and data leak site publication for double extortion.

## Sources & References

- [CISA: Advisory AA23-353A - BlackCat/ALPHV](https://www.cisa.gov/news-events/cybersecurity-advisories/aa23-353a) -- CISA, 2023-12-19
- [US DOJ: ALPHV/BlackCat Ransomware Disrupted](https://www.justice.gov/opa/pr/justice-department-disrupts-prolific-alphvblackcat-ransomware-variant) -- US Department of Justice, 2023-12-19
- [FBI: BlackCat/ALPHV Flash Alert](https://www.ic3.gov/Media/News/2022/220420.pdf) -- FBI, 2022-04-19
- [Microsoft: The Many Lives of BlackCat Ransomware](https://www.microsoft.com/en-us/security/blog/2022/06/13/the-many-lives-of-blackcat-ransomware/) -- Microsoft Security, 2022-06-13
