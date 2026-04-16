---
name: "APT31"
aliases:
  - "Zirconium"
  - "Judgment Panda"
  - "Violet Typhoon"
  - "Bronze Vinewood"
affiliation: "China (Ministry of State Security)"
motivation: "Espionage"
status: active
country: "China"
firstSeen: "2010"
lastSeen: "2024"
targetSectors:
  - "Government"
  - "Diplomatic"
  - "Technology"
  - "Financial Services"
  - "Defense"
targetGeographies:
  - "United States"
  - "Europe"
  - "Finland"
  - "Global"
tools:
  - "RAWDOOR"
  - "Trochilus"
  - "DropboxAES RAT"
  - "TOSHY"
  - "China Chopper"
mitreMappings:
  - techniqueId: "T1190"
    techniqueName: "Exploit Public-Facing Application"
    tactic: "Initial Access"
    notes: "Exploits vulnerabilities in web-facing applications including routers and VPN appliances."
  - techniqueId: "T1566.002"
    techniqueName: "Phishing: Spearphishing Link"
    tactic: "Initial Access"
    notes: "Uses spearphishing emails with tracking links and malicious URLs targeting government officials."
  - techniqueId: "T1071.001"
    techniqueName: "Application Layer Protocol: Web Protocols"
    tactic: "Command and Control"
    notes: "Uses legitimate cloud services (Dropbox, Yandex) for encrypted C2 communications."
attributionConfidence: A1
attributionRationale: "Attributed to MSS Hubei State Security Department by a March 2024 U.S. DOJ indictment of seven Chinese nationals, supported by joint Five Eyes advisories."
reviewStatus: "draft_ai"
generatedBy: "penfold-bot"
generatedDate: 2026-04-16
tags:
  - "nation-state"
  - "china"
  - "mss"
  - "espionage"
  - "apt31"
  - "zirconium"
sources:
  - url: "https://attack.mitre.org/groups/G0128/"
    publisher: "MITRE ATT&CK"
    publisherType: research
    reliability: R1
    accessDate: "2026-04-16"
    archived: false
  - url: "https://www.justice.gov/opa/pr/seven-hackers-associated-chinese-government-charged-computer-intrusions-targeting-perceived"
    publisher: "US Department of Justice"
    publisherType: government
    reliability: R1
    publicationDate: "2024-03-25"
    accessDate: "2026-04-16"
    archived: false
  - url: "https://www.cisa.gov/news-events/cybersecurity-advisories/aa21-200a"
    publisher: "CISA"
    publisherType: government
    reliability: R1
    publicationDate: "2021-07-19"
    accessDate: "2026-04-16"
    archived: false
---

## Executive Summary

APT31, also tracked as Zirconium and Judgment Panda, is a Chinese state-sponsored cyber-espionage group attributed to the **Ministry of State Security (MSS) Hubei State Security Department**, based in Wuhan, China. Active since at least 2010, the group conducts espionage operations targeting government agencies, political figures, defense contractors, and technology companies worldwide.

In March 2024, the U.S. Department of Justice indicted seven Chinese nationals associated with APT31 for a 14-year campaign of computer intrusions targeting U.S. and foreign critics of China, government officials, political campaigns, and companies of strategic interest. The indictment also linked APT31 to the compromise of email accounts belonging to members of the Inter-Parliamentary Alliance on China (IPAC).

## Notable Campaigns

### 2020 -- U.S. Presidential Election Targeting

Microsoft disclosed that APT31 (as Zirconium) targeted individuals associated with both the Biden and Trump presidential campaigns using web bugs and spearphishing emails. The campaign used tracking links to conduct reconnaissance on targets before deploying more sophisticated payloads.

### 2021 -- Finnish Parliament Email Compromise

APT31 compromised email accounts of members of the Finnish Parliament (Eduskunta) in a targeted espionage operation. The Finnish Security Intelligence Service (Supo) attributed the intrusion to APT31, leading to diplomatic protests.

### 2010-2024 -- Multi-Year Espionage Campaign

Per the 2024 DOJ indictment, APT31 sent over 10,000 malicious emails to targets across multiple countries over a 14-year period. Targets included White House staffers, U.S. Senators, British parliamentarians, and officials from governments that criticized Chinese policies.

## Technical Capabilities

APT31 uses a combination of custom malware and operational relay box (ORB) networks to conduct operations. The group maintains infrastructure of compromised SOHO routers and VPN devices as proxy chains to obscure their true origin. Custom tools include **RAWDOOR** and **Trochilus** backdoors, as well as RATs that use legitimate cloud storage services (Dropbox, Yandex) for encrypted C2 communications.

The group's spearphishing operations use tracking pixels and invisible images to profile targets before delivering malicious payloads. This reconnaissance-first approach allows APT31 to tailor second-stage attacks and reduce exposure of more sophisticated tools.

APT31 also exploits vulnerabilities in public-facing network devices, including SOHO routers and VPN appliances, both for direct access and to build proxy infrastructure for relaying traffic.

## Attribution

The March 2024 DOJ indictment named seven Chinese nationals and linked them to the MSS Hubei State Security Department. The indictment detailed specific operations, infrastructure, and targeting. The U.S. Treasury Department simultaneously sanctioned the Wuhan Xiaoruizhi Science and Technology Company, identified as a front company for MSS operations.

The UK government attributed the 2021 compromise of the UK Electoral Commission and reconnaissance activity against UK parliamentarians to APT31, issuing sanctions against two of the indicted individuals. The EU and multiple member states have issued formal attributions of APT31 activity.

## MITRE ATT&CK Profile

**Initial Access**: APT31 uses spearphishing links (T1566.002) with tracking capabilities, exploitation of public-facing applications (T1190), and compromised valid accounts (T1078).

**Command and Control**: The group uses legitimate cloud storage services for C2 (T1102), web protocols (T1071.001), and multi-hop proxy chains through compromised network devices (T1090.003).

**Persistence**: Registry modifications (T1547.001), scheduled tasks (T1053), and web shells (T1505.003) maintain access.

**Reconnaissance**: APT31 uses tracking pixels and web bugs (T1598) to profile targets before committing more advanced capabilities.

## Sources & References

- [MITRE ATT&CK: APT31](https://attack.mitre.org/groups/G0128/) -- MITRE ATT&CK
- [US DOJ: Seven Hackers Associated with Chinese Government Charged](https://www.justice.gov/opa/pr/seven-hackers-associated-chinese-government-charged-computer-intrusions-targeting-perceived) -- US Department of Justice, 2024-03-25
- [CISA: Advisory AA21-200A](https://www.cisa.gov/news-events/cybersecurity-advisories/aa21-200a) -- CISA, 2021-07-19
