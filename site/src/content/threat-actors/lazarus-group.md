---
name: "Lazarus Group"
aliases:
  - "HIDDEN COBRA"
  - "Zinc"
  - "Diamond Sleet"
  - "Labyrinth Chollima"
  - "APT-C-26"
  - "Group 77"
affiliation: "North Korea (Reconnaissance General Bureau)"
motivation: "Financial / Espionage"
status: active
country: "North Korea"
firstSeen: "2009"
lastSeen: "2025"
targetSectors:
  - "Financial Services"
  - "Cryptocurrency"
  - "Government"
  - "Defense"
  - "Technology"
  - "Entertainment"
targetGeographies:
  - "Global"
  - "United States"
  - "South Korea"
  - "Japan"
tools:
  - "Manuscrypt"
  - "FALLCHILL"
  - "HOPLIGHT"
  - "AppleJeus"
  - "BLINDINGCAN"
  - "DTrack"
  - "MATA Framework"
mitreMappings:
  - techniqueId: "T1566.001"
    techniqueName: "Phishing: Spearphishing Attachment"
    tactic: "Initial Access"
    notes: "Uses tailored spearphishing with job recruitment themes targeting defense and tech sectors."
  - techniqueId: "T1195.002"
    techniqueName: "Supply Chain Compromise: Compromise Software Supply Chain"
    tactic: "Initial Access"
    notes: "Trojanized cryptocurrency trading applications (AppleJeus) distributed to target financial institutions."
  - techniqueId: "T1657"
    techniqueName: "Financial Theft"
    tactic: "Impact"
    notes: "Conducts large-scale cryptocurrency heists and SWIFT banking system manipulation."
  - techniqueId: "T1485"
    techniqueName: "Data Destruction"
    tactic: "Impact"
    notes: "Deployed disk-wiping malware in attacks including the Sony Pictures breach."
attributionConfidence: A1
attributionRationale: "Attributed to North Korea's RGB by multiple U.S. government agencies (FBI, CISA, Treasury), a 2018 DOJ criminal complaint, and extensive private-sector research."
reviewStatus: "draft_ai"
generatedBy: "penfold-bot"
generatedDate: 2026-04-16
tags:
  - "nation-state"
  - "north-korea"
  - "lazarus"
  - "financial"
  - "espionage"
  - "cryptocurrency"
sources:
  - url: "https://attack.mitre.org/groups/G0032/"
    publisher: "MITRE ATT&CK"
    publisherType: research
    reliability: R1
    accessDate: "2026-04-16"
    archived: false
  - url: "https://www.cisa.gov/news-events/cybersecurity-advisories/aa22-108a"
    publisher: "CISA"
    publisherType: government
    reliability: R1
    publicationDate: "2022-04-18"
    accessDate: "2026-04-16"
    archived: false
  - url: "https://www.justice.gov/opa/pr/three-north-korean-military-hackers-indicted-wide-ranging-scheme-commit-cyberattacks-and"
    publisher: "US Department of Justice"
    publisherType: government
    reliability: R1
    publicationDate: "2021-02-17"
    accessDate: "2026-04-16"
    archived: false
  - url: "https://home.treasury.gov/news/press-releases/sm774"
    publisher: "US Department of the Treasury"
    publisherType: government
    reliability: R1
    publicationDate: "2019-09-13"
    accessDate: "2026-04-16"
    archived: false
---

## Executive Summary

The Lazarus Group, also tracked as HIDDEN COBRA by the U.S. government, is a North Korean state-sponsored threat actor attributed to the **Reconnaissance General Bureau (RGB)**, Pyongyang's primary intelligence agency. Active since at least 2009, Lazarus conducts both espionage and financially motivated operations. The group is one of the most prolific state-sponsored cyber threat actors, responsible for some of the most consequential cyber operations of the past decade.

Lazarus is responsible for the 2014 Sony Pictures breach, the 2016 Bangladesh Bank heist ($81 million stolen), the 2017 WannaCry ransomware outbreak, and billions of dollars in cryptocurrency theft. The group's financial operations are assessed to generate revenue for the North Korean regime, including funding for its weapons programs. The U.S. Treasury sanctioned Lazarus Group in September 2019.

## Notable Campaigns

### 2014 -- Sony Pictures Entertainment Breach

Lazarus conducted a destructive attack against Sony Pictures, deploying disk-wiping malware and exfiltrating and leaking terabytes of internal data, including unreleased films, executive emails, and employee personal information. The attack was conducted in retaliation for the film "The Interview."

### 2016 -- Bangladesh Bank SWIFT Heist

Lazarus compromised Bangladesh Bank's SWIFT terminal and attempted to transfer $951 million, successfully stealing $81 million through accounts in the Philippines. This operation (attributed to the APT38/Bluenoroff sub-group) demonstrated the group's deep understanding of interbank payment systems.

### 2017 -- WannaCry Ransomware

Lazarus deployed the WannaCry ransomware worm, which infected over 200,000 systems in 150 countries using the EternalBlue exploit (CVE-2017-0144). The UK's NHS was among the most affected organizations. Despite its global impact, the ransomware generated relatively modest ransom payments.

### 2022 -- Ronin Network Bridge Theft

Lazarus stole approximately $620 million in Ethereum and USDC from the Ronin Network blockchain bridge used by the Axie Infinity game. The FBI attributed the theft to Lazarus Group and the U.S. Treasury sanctioned the wallet addresses involved.

## Technical Capabilities

Lazarus maintains a broad and evolving toolkit. The group develops cross-platform malware targeting Windows, macOS, and Linux. **AppleJeus** is a trojanized cryptocurrency trading application used to target financial institutions and individual cryptocurrency holders. The **MATA** framework provides modular multi-platform backdoor capabilities.

The group conducts sophisticated social engineering campaigns, including fake job recruitment ("Operation Dream Job") targeting defense and technology sector employees through LinkedIn and other platforms. Lazarus has demonstrated supply chain compromise capabilities and zero-day exploitation.

For financial theft, the group combines deep SWIFT system knowledge with cryptocurrency expertise, using chain-hopping, mixing services, and DeFi protocols to launder stolen funds.

## Attribution

The U.S. government has issued multiple attributions and indictments. In February 2021, the DOJ indicted three North Korean military hackers (Jon Chang Hyok, Kim Il, and Park Jin Hyok) for a range of operations including the Sony breach, Bangladesh Bank heist, and WannaCry. The U.S. Treasury sanctioned Lazarus Group, Bluenoroff, and Andariel (sub-groups) in 2019. CISA, FBI, and international partners have published numerous joint advisories on Lazarus operations.

## MITRE ATT&CK Profile

**Initial Access**: Spearphishing (T1566.001) with job recruitment themes, supply chain compromise (T1195.002) via trojanized applications, and watering hole attacks (T1189).

**Persistence**: Registry modifications (T1547.001), scheduled tasks (T1053), and custom backdoors installed as services.

**Impact**: Financial theft (T1657), data destruction (T1485), ransomware (T1486), and disk wiping (T1561).

**Command and Control**: Custom C2 protocols (T1071.001), multi-stage proxy chains, and use of legitimate cloud services.

## Sources & References

- [MITRE ATT&CK: Lazarus Group](https://attack.mitre.org/groups/G0032/) -- MITRE ATT&CK
- [CISA: Advisory AA22-108A - North Korean State-Sponsored Crypto Theft](https://www.cisa.gov/news-events/cybersecurity-advisories/aa22-108a) -- CISA, 2022-04-18
- [US DOJ: Three North Korean Military Hackers Indicted](https://www.justice.gov/opa/pr/three-north-korean-military-hackers-indicted-wide-ranging-scheme-commit-cyberattacks-and) -- US Department of Justice, 2021-02-17
- [US Treasury: North Korea Cyber Sanctions](https://home.treasury.gov/news/press-releases/sm774) -- US Department of the Treasury, 2019-09-13
