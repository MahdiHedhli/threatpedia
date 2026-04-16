---
name: "APT29"
aliases:
  - "Cozy Bear"
  - "The Dukes"
  - "NOBELIUM"
  - "Midnight Blizzard"
  - "IRON RITUAL"
  - "Cloaked Ursa"
  - "UNC2452"
affiliation: "Russia (SVR - Foreign Intelligence Service)"
motivation: "Espionage"
status: active
country: "Russia"
firstSeen: "2008"
lastSeen: "2025"
targetSectors:
  - "Government"
  - "Diplomatic"
  - "Think Tanks"
  - "Technology"
  - "Healthcare"
targetGeographies:
  - "United States"
  - "Europe"
  - "NATO"
  - "Global"
tools:
  - "SUNBURST"
  - "SUNSPOT"
  - "TEARDROP"
  - "WellMess"
  - "WellMail"
  - "EnvyScout"
  - "MagicWeb"
  - "FoggyWeb"
  - "Cobalt Strike"
mitreMappings:
  - techniqueId: "T1195.002"
    techniqueName: "Supply Chain Compromise: Compromise Software Supply Chain"
    tactic: "Initial Access"
    notes: "SUNBURST backdoor distributed through trojanized SolarWinds Orion updates."
  - techniqueId: "T1484.002"
    techniqueName: "Domain Policy Modification: Domain Trust Modification"
    tactic: "Defense Evasion"
    notes: "Modified AD FS token-signing certificates to forge SAML tokens for cloud access."
  - techniqueId: "T1078.004"
    techniqueName: "Valid Accounts: Cloud Accounts"
    tactic: "Persistence"
    notes: "Used compromised OAuth application credentials for persistent cloud environment access."
  - techniqueId: "T1550.001"
    techniqueName: "Use Alternate Authentication Material: Application Access Token"
    tactic: "Lateral Movement"
    notes: "Leveraged forged SAML tokens and OAuth tokens to access cloud resources without credentials."
attributionConfidence: A1
attributionRationale: "Attributed to Russia's SVR by joint U.S./UK government statements (April 2021), supported by NSA/FBI/CISA advisory, and multiple private-sector research confirming SVR affiliation."
reviewStatus: "draft_ai"
generatedBy: "penfold-bot"
generatedDate: 2026-04-16
tags:
  - "nation-state"
  - "russia"
  - "svr"
  - "espionage"
  - "apt29"
  - "cozy-bear"
  - "solarwinds"
sources:
  - url: "https://attack.mitre.org/groups/G0016/"
    publisher: "MITRE ATT&CK"
    publicationDate: "2025-10-17"
    publisherType: research
    reliability: R1
    accessDate: "2026-04-16"
    archived: false
  - url: "https://www.whitehouse.gov/briefing-room/statements-releases/2021/04/15/fact-sheet-imposing-costs-for-harmful-foreign-activities-by-the-russian-government/"
    publisher: "The White House"
    publisherType: government
    reliability: R1
    publicationDate: "2021-04-15"
    accessDate: "2026-04-16"
    archived: false
  - url: "https://www.cisa.gov/news-events/cybersecurity-advisories/aa20-352a"
    publisher: "CISA"
    publisherType: government
    reliability: R1
    publicationDate: "2020-12-17"
    accessDate: "2026-04-16"
    archived: false
  - url: "https://www.microsoft.com/en-us/security/blog/2021/05/27/new-sophisticated-email-based-attack-from-nobelium/"
    publisher: "Microsoft Security"
    publisherType: vendor
    reliability: R1
    publicationDate: "2021-05-27"
    accessDate: "2026-04-16"
    archived: false
---

## Executive Summary

APT29, also known as Cozy Bear, NOBELIUM, and Midnight Blizzard, is a Russian state-sponsored cyber-espionage group attributed to the **Foreign Intelligence Service (SVR)** of the Russian Federation. Active since at least 2008, the group conducts strategic intelligence collection targeting government, diplomatic, policy, and technology organizations, with a focus on NATO member states and the United States.

APT29 is responsible for the SolarWinds supply chain compromise (discovered December 2020), one of the most consequential cyber-espionage operations ever identified. The campaign affected approximately 18,000 organizations and led to confirmed compromise of multiple U.S. federal agencies. APT29 is characterized by advanced tradecraft, long dwell times, and sophisticated use of cloud infrastructure and identity federation abuse.

## Notable Campaigns

### 2020 -- SolarWinds Supply Chain Compromise

APT29 compromised the SolarWinds Orion build environment and embedded the SUNBURST backdoor into legitimate software updates distributed to approximately 18,000 organizations. Fewer than 100 organizations were selected for follow-on exploitation, including the U.S. Departments of Treasury, Commerce, Homeland Security, State, and Justice, as well as FireEye (Mandiant) and Microsoft.

### 2016 -- Democratic National Committee

APT29 compromised the DNC network in mid-2015, operating alongside but separately from APT28 (GRU). The group deployed the SeaDaddy and CozyCar backdoors for persistent intelligence collection over several months before discovery.

### 2020 -- COVID-19 Vaccine Research Targeting

APT29 targeted organizations involved in COVID-19 vaccine development in the United States, United Kingdom, and Canada, using WellMess and WellMail malware. The campaign was disclosed in a joint NCSC/CISA/CSE advisory in July 2020.

### 2024 -- Microsoft Corporate Email Compromise

In January 2024, Microsoft disclosed that Midnight Blizzard had compromised its corporate email system through a password spray attack on a legacy test tenant account. The group accessed email accounts of senior leadership and cybersecurity staff, exfiltrating internal communications related to APT29 itself.

## Technical Capabilities

APT29 demonstrates advanced technical capabilities with a focus on stealth and long-term access. The group excels at cloud environment exploitation, including abuse of Azure AD, OAuth applications, SAML token forgery, and identity federation manipulation.

**SUNBURST** used sophisticated anti-detection measures including a two-week dormancy period, environment checks to avoid sandbox execution, and C2 communications designed to mimic legitimate Orion traffic. **FoggyWeb** and **MagicWeb** targeted Active Directory Federation Services (AD FS) servers to forge authentication tokens, enabling persistent access to cloud resources.

The group frequently leverages legitimate cloud services for C2, including Azure, Dropbox, Google Drive, and Notion. APT29 uses residential proxy networks and Tor to obfuscate operational infrastructure, making network-level detection difficult.

## Attribution

In April 2021, the U.S. government formally attributed the SolarWinds campaign to the SVR, supported by the White House, NSA, FBI, and CISA. The UK's NCSC concurrently attributed the activity to APT29/SVR. The attribution was based on technical analysis, intelligence community assessments, and the strategic alignment of targets with SVR collection priorities.

Multiple private-sector firms including Mandiant, Microsoft, CrowdStrike, and Volexity independently tracked the SolarWinds campaign and corroborated the SVR attribution. The operational sophistication, targeting focus on government and diplomatic targets, and avoidance of destructive actions are consistent with a foreign intelligence service mandate.

## MITRE ATT&CK Profile

**Initial Access**: APT29 uses supply chain compromise (T1195.002), spearphishing with links (T1566.002), valid accounts from credential spraying (T1078), and exploitation of public-facing applications (T1190).

**Persistence**: The group abuses cloud account credentials (T1078.004), forges SAML tokens (T1606.002), creates OAuth applications, and deploys AD FS backdoors (MagicWeb, FoggyWeb).

**Defense Evasion**: Domain trust modification (T1484.002), use of legitimate cloud services for C2, residential proxy networks, and steganography in C2 communications.

**Collection**: APT29 targets email collections (T1114) and cloud storage, with a focus on policy documents, intelligence assessments, and internal communications of targeted organizations.

**Exfiltration**: Data exfiltration occurs over C2 channels (T1041) or via legitimate cloud services (T1567.002), with data staged and compressed before transfer.

## Sources & References

- [MITRE ATT&CK: APT29](https://attack.mitre.org/groups/G0016/) -- MITRE ATT&CK
- [White House: Imposing Costs for Russian Activities](https://www.whitehouse.gov/briefing-room/statements-releases/2021/04/15/fact-sheet-imposing-costs-for-harmful-foreign-activities-by-the-russian-government/) -- The White House, 2021-04-15
- [CISA: Advisory AA20-352A](https://www.cisa.gov/news-events/cybersecurity-advisories/aa20-352a) -- CISA, 2020-12-17
- [Microsoft: NOBELIUM Email-Based Attack](https://www.microsoft.com/en-us/security/blog/2021/05/27/new-sophisticated-email-based-attack-from-nobelium/) -- Microsoft Security, 2021-05-27
