---
name: "APT38"
aliases:
  - "Bluenoroff"
  - "Stardust Chollima"
  - "BeagleBoyz"
  - "NICKEL GLADSTONE"
affiliation: "North Korea (Reconnaissance General Bureau)"
motivation: "Financial"
status: active
country: "North Korea"
firstSeen: "2014"
lastSeen: "2025"
targetSectors:
  - "Financial Services"
  - "Cryptocurrency"
  - "Banking"
  - "Fintech"
targetGeographies:
  - "Global"
  - "Southeast Asia"
  - "Latin America"
  - "Africa"
  - "Europe"
tools:
  - "DYEPACK"
  - "HERMES"
  - "FASTCash"
  - "NESTEGG"
  - "KEYLIME"
  - "MAPMAKER"
  - "QUICKCAFE"
mitreMappings:
  - techniqueId: "T1657"
    techniqueName: "Financial Theft"
    tactic: "Impact"
    notes: "APT38's primary objective is financial theft from banking and cryptocurrency targets."
  - techniqueId: "T1059.001"
    techniqueName: "Command and Scripting Interpreter: PowerShell"
    tactic: "Execution"
    notes: "Uses PowerShell and custom scripts for payload delivery and post-exploitation."
  - techniqueId: "T1485"
    techniqueName: "Data Destruction"
    tactic: "Impact"
    notes: "APT38 deploys disk-wiping malware to destroy evidence after completing financial theft operations."
attributionConfidence: A1
attributionRationale: "U.S. government reporting and Mandiant research consistently place APT38/Bluenoroff financial intrusions inside the DPRK Lazarus/RGB ecosystem, while still treating the cluster as the regime's dedicated financial theft arm rather than a fully separate state actor."
reviewStatus: "under_review"
generatedBy: "penfold-bot"
generatedDate: 2026-04-16
tags:
  - "nation-state"
  - "north-korea"
  - "financial"
  - "apt38"
  - "banking"
  - "cryptocurrency"
sources:
  - url: "https://attack.mitre.org/groups/G0082/"
    publisher: "MITRE ATT&CK"
    publicationDate: "2025-10-17"
    publisherType: research
    reliability: R1
    accessDate: "2026-04-16"
    archived: false
  - url: "https://www.cisa.gov/news-events/cybersecurity-advisories/aa20-239a"
    publisher: "CISA"
    publisherType: government
    reliability: R1
    publicationDate: "2020-08-26"
    accessDate: "2026-04-16"
    archived: false
  - url: "https://www.justice.gov/opa/pr/north-korean-regime-backed-programmer-charged-conspiracy-conduct-multiple-cyber-attacks-and"
    publisher: "US Department of Justice"
    publisherType: government
    reliability: R1
    publicationDate: "2018-09-06"
    accessDate: "2026-04-16"
    archived: false
  - url: "https://content.fireeye.com/apt/rpt-apt38"
    publisher: "Mandiant"
    publisherType: vendor
    reliability: R1
    publicationDate: "2018-10-03"
    accessDate: "2026-04-16"
    archived: false
---

## Executive Summary

APT38, also known as Bluenoroff and Stardust Chollima, is a North Korean financially motivated intrusion cluster attributed to the **Reconnaissance General Bureau (RGB)** and commonly treated as part of the broader Lazarus ecosystem. Active since at least 2014, APT38 specializes in revenue-generating operations against banks, payment systems, and cryptocurrency services rather than the wider espionage mission usually associated with Lazarus umbrella reporting.

APT38 is estimated to have attempted to steal over $1.1 billion from financial institutions worldwide and has successfully stolen hundreds of millions of dollars. The group targets banks, cryptocurrency exchanges, and financial technology companies across more than 30 countries. APT38's operations are characterized by extensive pre-operation reconnaissance, long dwell times within victim networks, and the use of destructive malware to cover tracks after theft operations.

## Notable Campaigns

### 2016 -- Bangladesh Bank Heist

APT38 compromised Bangladesh Bank's SWIFT infrastructure and attempted to transfer $951 million from its account at the Federal Reserve Bank of New York. While most transfers were blocked, $81 million was successfully stolen through accounts in the Philippines. The operation revealed the group's deep understanding of SWIFT messaging and interbank transfer protocols.

### 2018 -- Banco de Chile Attack

The group compromised Banco de Chile, deploying destructive malware (HERMES variant) across approximately 9,000 workstations and 500 servers as a diversionary tactic while conducting unauthorized SWIFT transfers totaling $10 million.

### 2017-2022 -- Cryptocurrency Exchange Targeting

APT38-adjacent financial intrusion activity expanded into cryptocurrency theft as the broader Lazarus ecosystem shifted toward exchanges, wallet services, and cross-chain infrastructure. Public reporting frequently discusses these thefts alongside APT38 because of the shared financial mission, but the largest cases are often attributed to the wider Lazarus/Bluenoroff ecosystem rather than to APT38 alone.

## Technical Capabilities

APT38 conducts extensive reconnaissance within target financial networks, spending months understanding internal transaction systems, SWIFT configurations, and operational procedures. The group develops custom tools tailored to each financial institution's specific infrastructure.

**FASTCash** enables fraudulent ATM cash withdrawals by intercepting and modifying transaction authorization messages at the application server level. **DYEPACK** modifies SWIFT Alliance Lite2 software to delete transaction records and alter printed confirmations, hiding fraudulent transfers.

The group's operational model follows a distinctive pattern: initial compromise via spearphishing, extended reconnaissance and lateral movement (average 155 days), execution of financial theft, and deployment of disk-wiping malware to destroy forensic evidence.

## Attribution

The U.S. DOJ charged Park Jin Hyok, a North Korean national, in September 2018 for his role in APT38 operations including the Bangladesh Bank heist. CISA advisory AA20-239A (BeagleBoyz) detailed North Korean financial institution targeting with technical indicators. The U.S. Treasury Department has sanctioned multiple entities associated with APT38 operations, and the UN Panel of Experts on North Korea has documented the group's role in sanctions evasion.

## MITRE ATT&CK Profile

**Initial Access**: Spearphishing attachments (T1566.001) targeting bank employees, watering hole attacks (T1189) on financial industry sites, and supply chain compromise of financial software.

**Persistence**: The group maintains long-term access through scheduled tasks (T1053), registry modifications (T1547.001), and backdoors placed on critical financial infrastructure servers.

**Impact**: Financial theft (T1657) through SWIFT manipulation, cryptocurrency theft, and ATM cash-out schemes. Post-operation evidence destruction through data destruction (T1485) and disk wiping (T1561).

**Defense Evasion**: Custom malware designed to evade financial sector security tools, timestomping (T1070.006), and indicator removal (T1070) are standard practices.

## Sources & References

- [MITRE ATT&CK: APT38](https://attack.mitre.org/groups/G0082/) -- MITRE ATT&CK
- [CISA: Advisory AA20-239A - BeagleBoyz](https://www.cisa.gov/news-events/cybersecurity-advisories/aa20-239a) -- CISA, 2020-08-26
- [US DOJ: North Korean Programmer Charged](https://www.justice.gov/opa/pr/north-korean-regime-backed-programmer-charged-conspiracy-conduct-multiple-cyber-attacks-and) -- US Department of Justice, 2018-09-06
- [Mandiant: APT38 Report](https://content.fireeye.com/apt/rpt-apt38) -- Mandiant, 2018-10-03
