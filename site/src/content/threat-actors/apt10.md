---
name: "APT10"
aliases:
  - "MenuPass"
  - "Stone Panda"
  - "Red Apollo"
  - "CVNX"
  - "POTASSIUM"
  - "Cicada"
affiliation: "China (Ministry of State Security)"
motivation: "Espionage"
status: active
country: "China"
firstSeen: "2006"
lastSeen: "2024"
targetSectors:
  - "Managed Service Providers"
  - "Technology"
  - "Healthcare"
  - "Aerospace & Defense"
  - "Government"
  - "Telecommunications"
targetGeographies:
  - "Japan"
  - "United States"
  - "United Kingdom"
  - "Global"
tools:
  - "PlugX"
  - "QuasarRAT"
  - "Poison Ivy"
  - "ANEL"
  - "ChChes"
  - "LODEINFO"
  - "SodaMaster"
mitreMappings:
  - techniqueId: "T1199"
    techniqueName: "Trusted Relationship"
    tactic: "Initial Access"
    notes: "APT10 compromised managed service providers to gain access to downstream client networks."
  - techniqueId: "T1560.001"
    techniqueName: "Archive Collected Data: Archive via Utility"
    tactic: "Collection"
    notes: "Used RAR and custom tools to compress stolen data before exfiltration."
  - techniqueId: "T1071.001"
    techniqueName: "Application Layer Protocol: Web Protocols"
    tactic: "Command and Control"
    notes: "C2 communications conducted over HTTPS using PlugX and custom backdoors."
attributionConfidence: A1
attributionRationale: "Attributed to Chinese MSS-affiliated actors by a 2018 U.S. DOJ indictment of two MSS officers, supported by joint advisories from CISA, FBI, and international partners."
reviewStatus: "under_review"
generatedBy: "penfold-bot"
generatedDate: 2026-04-16
tags:
  - "nation-state"
  - "china"
  - "mss"
  - "espionage"
  - "apt10"
  - "supply-chain"
sources:
  - url: "https://attack.mitre.org/groups/G0045/"
    publisher: "MITRE ATT&CK"
    publicationDate: "2025-10-17"
    publisherType: research
    reliability: R1
    accessDate: "2026-04-16"
    archived: false
  - url: "https://www.justice.gov/opa/pr/two-chinese-hackers-associated-ministry-state-security-charged-global-computer-intrusion"
    publisher: "US Department of Justice"
    publisherType: government
    reliability: R1
    publicationDate: "2018-12-20"
    accessDate: "2026-04-16"
    archived: false
  - url: "https://www.cisa.gov/news-events/alerts/2019/04/03/apt10-targeting-managed-service-providers"
    publisher: "CISA"
    publisherType: government
    reliability: R1
    publicationDate: "2019-04-03"
    accessDate: "2026-04-16"
    archived: false
  - url: "https://www.pwc.co.uk/issues/cyber-security-data-privacy/insights/operation-cloud-hopper.html"
    publisher: "PwC"
    publisherType: vendor
    reliability: R1
    publicationDate: "2017-04-03"
    accessDate: "2026-04-16"
    archived: false
---

## Executive Summary

APT10, also known as MenuPass and Stone Panda, is a Chinese state-sponsored cyber-espionage group affiliated with the **Ministry of State Security (MSS)**. Active since at least 2006, the group is best known for its "Operation Cloud Hopper" campaign, which systematically targeted managed service providers (MSPs) worldwide to gain access to the networks of their clients. APT10 has targeted organizations across the technology, healthcare, aerospace, defense, and government sectors, with a sustained focus on Japan.

The group's exploitation of trusted relationships between MSPs and their clients represented a strategic evolution in supply chain compromise tactics. In December 2018, the U.S. Department of Justice indicted two Chinese nationals associated with the MSS for their roles in APT10 operations, which compromised data from organizations in at least 12 countries.

## Notable Campaigns

### 2014-2017 -- Operation Cloud Hopper

APT10 conducted a sustained campaign targeting multiple managed service providers globally. By compromising MSP networks, the group gained indirect access to the networks of hundreds of downstream client organizations across industries including healthcare, finance, biotechnology, and government. The campaign was disclosed jointly by PwC and BAE Systems in April 2017.

### 2009-2018 -- Technology Sector Theft

Over nearly a decade, APT10 targeted U.S. technology companies and the Jet Propulsion Laboratory (NASA JPL), exfiltrating personnel records and proprietary technology data. The 2018 DOJ indictment detailed the theft of data from over 45 technology companies and government agencies.

### 2019-2024 -- LODEINFO Campaign Against Japan

APT10 deployed the LODEINFO backdoor in sustained campaigns against Japanese media, diplomatic, government, and defense organizations. The campaigns used spearphishing emails with Japanese-language lures and demonstrated ongoing evolution of the group's toolset.

## Technical Capabilities

APT10 employs a combination of custom and publicly available malware. **PlugX** serves as a primary backdoor providing remote access, file manipulation, and keylogging capabilities. **LODEINFO** is a more recent fileless backdoor targeting Japanese organizations, loaded through malicious Word documents. **SodaMaster** provides additional C2 capabilities with DLL side-loading for execution.

The group excels at sustained, low-and-slow operations. After gaining access to MSP networks, APT10 operators use legitimate administrative tools (RDP, PsExec) to move laterally without deploying additional malware, making detection difficult. Data exfiltration involves staging in compressed archives and exfiltration during off-hours to avoid detection.

APT10's infrastructure relies on dynamic DNS services, compromised web servers for C2, and domain names mimicking legitimate services. The group regularly rotates infrastructure to evade blocking.

## Attribution

The U.S. DOJ indicted Zhu Hua and Zhang Shilong, two Chinese nationals affiliated with the MSS Tianjin State Security Bureau, in December 2018. The indictment detailed APT10's operations targeting MSPs, technology companies, and government agencies. Multiple governments including the UK, Australia, Canada, and Japan issued statements supporting the attribution.

CISA and FBI jointly published advisories on APT10 activity, providing technical indicators and TTPs. Private-sector firms including PwC, BAE Systems, and Symantec (now Broadcom) independently tracked APT10 operations and corroborated the MSS attribution based on infrastructure analysis and operational patterns.

## MITRE ATT&CK Profile

**Initial Access**: APT10 uses trusted relationships (T1199) through compromised MSPs and spearphishing attachments (T1566.001) with industry-relevant lures for direct targeting.

**Execution**: DLL side-loading (T1574.002) is a hallmark technique, used to execute PlugX, LODEINFO, and SodaMaster through legitimate applications. PowerShell (T1059.001) and Windows Command Shell (T1059.003) support post-compromise activities.

**Persistence**: Scheduled tasks (T1053), registry run keys (T1547.001), and service creation (T1543.003) maintain persistent access.

**Collection and Exfiltration**: Data is compressed using RAR (T1560.001), staged in temporary directories, and exfiltrated over C2 channels (T1041) or via alternative protocols during off-hours.

## Sources & References

- [MITRE ATT&CK: APT10](https://attack.mitre.org/groups/G0045/) -- MITRE ATT&CK
- [US DOJ: Two Chinese Hackers Charged](https://www.justice.gov/opa/pr/two-chinese-hackers-associated-ministry-state-security-charged-global-computer-intrusion) -- US Department of Justice, 2018-12-20
- [CISA: APT10 Targeting Managed Service Providers](https://www.cisa.gov/news-events/alerts/2019/04/03/apt10-targeting-managed-service-providers) -- CISA, 2019-04-03
- [PwC: Operation Cloud Hopper](https://www.pwc.co.uk/issues/cyber-security-data-privacy/insights/operation-cloud-hopper.html) -- PwC, 2017-04-03
