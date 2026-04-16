---
name: "FIN7"
aliases:
  - "Carbanak"
  - "Carbon Spider"
  - "ELBRUS"
  - "Sangria Tempest"
  - "Navigator Group"
affiliation: "Cybercriminal (Eastern European)"
motivation: "Financial"
status: active
country: "Russia"
firstSeen: "2013"
lastSeen: "2025"
targetSectors:
  - "Retail"
  - "Hospitality"
  - "Restaurant"
  - "Financial Services"
  - "Technology"
targetGeographies:
  - "United States"
  - "Europe"
  - "Global"
tools:
  - "Carbanak"
  - "GRIFFON"
  - "BIRDDOG"
  - "BOOSTWRITE"
  - "JSSLoader"
  - "Lizar (Tirion)"
  - "PowerPlant"
  - "Cobalt Strike"
mitreMappings:
  - techniqueId: "T1566.001"
    techniqueName: "Phishing: Spearphishing Attachment"
    tactic: "Initial Access"
    notes: "FIN7 conducts highly targeted spearphishing campaigns with malicious document attachments."
  - techniqueId: "T1059.005"
    techniqueName: "Command and Scripting Interpreter: Visual Basic"
    tactic: "Execution"
    notes: "Uses VBA macros in weaponized Office documents for initial payload delivery."
  - techniqueId: "T1657"
    techniqueName: "Financial Theft"
    tactic: "Impact"
    notes: "Steals payment card data from point-of-sale systems and conducts direct financial theft from banking systems."
attributionConfidence: A1
attributionRationale: "Multiple DOJ indictments of FIN7 members including a 2018 indictment of three Ukrainian nationals and the 2021 arrest and conviction of a high-level manager."
reviewStatus: "draft_ai"
generatedBy: "penfold-bot"
generatedDate: 2026-04-16
tags:
  - "cybercriminal"
  - "fin7"
  - "carbanak"
  - "pos-malware"
  - "financial"
sources:
  - url: "https://attack.mitre.org/groups/G0046/"
    publisher: "MITRE ATT&CK"
    publisherType: research
    reliability: R1
    accessDate: "2026-04-16"
    archived: false
  - url: "https://www.justice.gov/opa/pr/three-members-notorious-international-cybercrime-group-fin7-custody-role-attacking-over-100"
    publisher: "US Department of Justice"
    publisherType: government
    reliability: R1
    publicationDate: "2018-08-01"
    accessDate: "2026-04-16"
    archived: false
  - url: "https://www.cisa.gov/news-events/alerts/2020/03/26/fin7-techniques"
    publisher: "CISA"
    publisherType: government
    reliability: R1
    publicationDate: "2020-03-26"
    accessDate: "2026-04-16"
    archived: false
---

## Executive Summary

FIN7 (also known as Carbanak and Carbon Spider) is a financially motivated cybercriminal group that has been active since at least 2013. The group initially focused on stealing payment card data from point-of-sale (POS) systems at restaurant, hospitality, and retail companies in the United States. FIN7 subsequently expanded to direct financial theft from banking systems (the Carbanak campaigns) and more recently to ransomware affiliate operations.

FIN7 is estimated to have stolen over $1 billion and compromised payment card data from over 1,000 restaurants, hotels, and retailers. Multiple members have been arrested and convicted, including three Ukrainian nationals indicted in 2018 and a high-level manager convicted in 2021. Despite law enforcement actions, the group has continued operations and evolved its tactics.

## Notable Campaigns

### 2015-2018 -- U.S. Restaurant and Retail POS Targeting

FIN7 compromised over 100 U.S. restaurant chains, hotels, and retailers by deploying POS malware through carefully crafted spearphishing campaigns. The group stole millions of payment card numbers, which were sold on underground markets.

### 2013-2016 -- Carbanak Banking Operations

Operating as Carbanak, FIN7 conducted direct attacks on financial institutions, manipulating ATM systems and internal banking applications to steal funds. The campaign affected over 100 banks in 40 countries with estimated losses exceeding $1 billion.

### 2022-2025 -- Ransomware Operations

FIN7 transitioned to ransomware affiliate operations, partnering with REvil, Maze, DarkSide, and BlackBasta. The group created a fake cybersecurity company ("Bastion Secure") to recruit unwitting penetration testers for pre-ransomware intrusion activities.

## Technical Capabilities

FIN7 operates sophisticated spearphishing campaigns using meticulously crafted lure documents tailored to each target's industry. The group uses VBA macros, COM scriptlets, and more recently, LNK files and ISO images to bypass email security controls. Custom JavaScript backdoors (GRIFFON, JSSLoader) and PowerShell frameworks (PowerPlant) provide post-exploitation capabilities.

The group's operational model includes a structured organization with specialized roles: social engineers who craft phishing lures, operators who conduct intrusions, and monetization specialists who process stolen financial data.

## Attribution

Three FIN7 members (Dmytro Fedorov, Fedir Hladyr, and Andrii Kolpakov) were indicted by the U.S. DOJ in 2018. Hladyr was sentenced to 10 years in prison in 2021, and Kolpakov to seven years. A high-level FIN7 manager, Denys Iarmak, was arrested and convicted in 2021. Despite these arrests, FIN7 operations have continued under evolved tactics.

## MITRE ATT&CK Profile

**Initial Access**: Spearphishing attachments (T1566.001) with malicious documents, and more recently malicious USB devices sent through the postal service.

**Execution**: VBA macros (T1059.005), JavaScript (T1059.007), PowerShell (T1059.001) for multi-stage payload delivery.

**Persistence**: Registry modifications (T1547.001), scheduled tasks (T1053), and backdoor installation.

**Impact**: POS malware for payment card theft (T1657), ransomware deployment (T1486), and direct financial system manipulation.

## Sources & References

- [MITRE ATT&CK: FIN7](https://attack.mitre.org/groups/G0046/) -- MITRE ATT&CK
- [US DOJ: Three FIN7 Members Charged](https://www.justice.gov/opa/pr/three-members-notorious-international-cybercrime-group-fin7-custody-role-attacking-over-100) -- US Department of Justice, 2018-08-01
- [CISA: FIN7 Techniques](https://www.cisa.gov/news-events/alerts/2020/03/26/fin7-techniques) -- CISA, 2020-03-26
