---
name: "Scattered Spider"
aliases:
  - "UNC3944"
  - "Roasted 0ktapus"
  - "Starfraud"
  - "Scatter Swine"
  - "Muddled Libra"
affiliation: "Unknown (English-speaking / Western)"
motivation: "Financial"
status: active
country: "United States/United Kingdom (Multi-national)"
firstSeen: "2022"
lastSeen: "2026"
targetSectors:
  - "Gaming"
  - "Hospitality"
  - "Technology"
  - "Telecommunications"
  - "Finance"
targetGeographies:
  - "Global"
  - "United States"
  - "Western Europe"
tools:
  - "EvilGinx2"
  - "Mimecast (exploited)"
  - "Okta (exploited)"
  - "BlackCat Ransomware (Affiliate)"
  - "Cobalt Strike"
mitreMappings:
  - techniqueId: "T1566.003"
    techniqueName: "Phishing: Spearphishing SMS"
    tactic: "Initial Access"
    notes: "Utilizes SMishing and SIM swapping to target employees of telecommunications and technology firms to harvest credentials and session tokens."
  - techniqueId: "T1566.004"
    techniqueName: "Phishing: Voice Phishing (Vishing)"
    tactic: "Initial Access"
    notes: "Masters of help desk impersonation, frequently calling victim IT staff to reset passwords or register new MFA devices."
  - techniqueId: "T1539"
    techniqueName: "Steal Web Session Cookie"
    tactic: "Credential Access"
    notes: "Utilizes Adversary-in-the-Middle (AitM) phishing frameworks to capture valid session tokens, effectively bypassing traditional MFA."
attributionConfidence: A2
attributionRationale: "Identified as a specialized, English-speaking cybercrime cluster by Microsoft and Mandiant (Google Cloud). The group is noted for its high degree of native English fluency and its deep familiarity with Western corporate IT processes, distinct from typical Russian-speaking ransomware gangs."
reviewStatus: "draft_ai"
generatedBy: "penfold-bot"
generatedDate: 2026-04-16
tags:
  - "scattered-spider"
  - "unc3944"
  - "social-engineering"
  - "vishing"
  - "ransomware"
  - "blackcat"
  - "mgm-hack"
sources:
  - url: "https://www.fbi.gov/news/press-releases/fbi-announces-joint-advisory-on-scattered-spider-threat-actors"
    publisher: "FBI"
    publisherType: government
    reliability: R1
    publicationDate: "2023-11-16"
    accessDate: "2026-04-16"
    archived: false
  - url: "https://www.cisa.gov/news-events/cybersecurity-advisories/aa23-320a"
    publisher: "CISA"
    publisherType: government
    reliability: R1
    publicationDate: "2023-11-16"
    accessDate: "2026-04-16"
    archived: false
  - url: "https://www.microsoft.com/en-us/security/blog/2023/10/25/tracking-unc3944-scattered-spider-and-their-evolving-tradecraft/"
    publisher: "Microsoft Security"
    publisherType: vendor
    reliability: R1
    publicationDate: "2023-10-25"
    accessDate: "2026-04-16"
    archived: false
  - url: "https://attack.mitre.org/groups/G1015/"
    publisher: "MITRE ATT&CK"
    publisherType: community
    reliability: R1
    publicationDate: "2023-10-21"
    accessDate: "2026-04-16"
    archived: false
---

## Executive Summary

Scattered Spider, also known as **UNC3944** or **Roasted 0ktapus**, is a highly aggressive and technically proficient cybercrime cluster composed primarily of native English speakers. Emerging in 2022, the group has gained global notoriety for its mastery of social engineering and its ability to bypass sophisticated multi-factor authentication (MFA). Unlike many traditional ransomware gangs, Scattered Spider focuses on identity manipulation and the exploitation of corporate help desk processes to gain deep access to enterprise networks.

The group is characterized by its high operational tempo and its evolution from an initial access brokerage to a full-scale ransomware affiliate. In 2023, they became a primary affiliate for the **BlackCat (ALPHV)** ransomware-as-a-service (RaaS) platform, launching some of the most visible and disruptive cyberattacks of the year.

## Notable Campaigns

### MGM Resorts and Caesars Entertainment Breaches (2023)
In September 2023, Scattered Spider targeted two of the world's largest gaming and hospitality corporations. The group successfully compromised **Caesars Entertainment** (reportedly receiving a multi-million dollar ransom payment) and subsequently launched a massive, destructive attack against **MGM Resorts**. The MGM attack caused a multi-day shutdown of hotel and casino operations across the United States, illustrating the group's ability to transition from credential theft to massive operational disruption.

### The "0ktapus" Campaign Against Technology Firms (2022)
In late 2022, the group (then tracked as "Roasted 0ktapus") launched a massive phishing campaign targeting over 130 organizations, including **Okta**, **Twilio**, and **Cloudflare**. By utilizing targeted SMS-based phishing (SMishing) and transparent reverse-proxies, they successfully harvested thousands of administrative credentials and session tokens, allowing them to compromise downstream clients through the exploited identity providers.

## Technical Capabilities

Scattered Spider's technical edge lies in its **social engineering** tradecraft. They specialize in "Vishing" (voice phishing), where they call corporate IT help desks pretending to be employees who have lost access to their accounts. Due to their native English fluency and deep knowledge of Western corporate culture, they are uniquely effective at convincing IT staff to reset passwords or register new MFA devices under the attacker's control.

Once initial access is achieved, the group demonstrates elite lateral movement capabilities within cloud environments, specifically targeting **Azure** and **AWS** infrastructure. They frequently utilize legitimate administrative tools and "Living off the Land" (LotL) techniques to evade detection. For exfiltration, they often leverage the victim's own cloud backup or file-sharing solutions (such as SharePoint or Google Drive) to move terabytes of data with minimal anomaly detection.

## Attribution

Scattered Spider is a descentralized cluster of English-speaking individuals, many of whom are believed to be part of the "Com" (a diverse community of young cybercriminals active on platforms like Telegram and Discord). Unlike the structured hierarchies of Russian state-sponsored groups, Scattered Spider is composed of loosely affiliated nodes that share tools, techniques, and targets.

In late 2023 and 2024, international law enforcement agencies, including the **FBI** and the **UK National Crime Agency**, announced several arrests of individuals linked to the group in both the United States and the United Kingdom. Despite these arrests, the group's decentralized nature and the widespread availability of its core TTPs within the "Com" community mean that the threat remains highly active and continues to evolve.

## MITRE ATT&CK Profile

Scattered Spider tradecraft is centered on identity exploitation and social manipulation:

- **T1566.004 (Phishing: Voice Phishing):** Impersonating employees during calls to IT help desks to gain initial access.
- **T1098.005 (Account Manipulation: Device Registration):** Registering new attacker-controlled MFA devices to ensure persistent access.
- **T1539 (Steal Web Session Cookie):** Utilizing AitM frameworks to capture session tokens and bypass modern MFA.
- **T1486 (Data Encrypted for Impact):** Deployment of BlackCat (ALPHV) ransomware for final-stage extortion and disruption.

## Sources & References

- [FBI: Joint Advisory on Scattered Spider Threat Actors](https://www.fbi.gov/news/press-releases/fbi-announces-joint-advisory-on-scattered-spider-threat-actors) — FBI, 2023-11-16
- [CISA: Advisory (AA23-320A) — Scattered Spider Tradecraft](https://www.cisa.gov/news-events/cybersecurity-advisories/aa23-320a) — CISA, 2023-11-16
- [Microsoft: Tracking UNC3944 (Scattered Spider) and Their Evolving Tradecraft](https://www.microsoft.com/en-us/security/blog/2023/10/25/tracking-unc3944-scattered-spider-and-their-evolving-tradecraft/) — Microsoft Security, 2023-10-25
- [MITRE ATT&CK: Scattered Spider (Group G1015)](https://attack.mitre.org/groups/G1015/) — MITRE ATT&CK, 2023-10-21
- [Palo Alto Unit 42: Muddled Libra (Scattered Spider) — A deep dive into help desk social engineering](https://unit42.paloaltonetworks.com/muddled-libra-social-engineering-tactics/) — Palo Alto Networks, 2023-06-15
