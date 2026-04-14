---
name: "FIN11"
aliases:
  - "GOLD WELLINGTON"
affiliation: "Unknown"
motivation: "Financial"
status: "active"
firstSeen: "2017"
lastSeen: "2025"
country: "Unknown"
targetSectors:
  - "Financial"
  - "Retail"
  - "Healthcare"
  - "Technology"
targetGeographies:
  - "United States"
  - "Europe"
tools:
  - "FlawedAmmyy"
  - "CLOP Ransomware"
  - "Dewdrop"
  - "MIXLABEL"
attributionConfidence: "A1"
attributionRationale: "High-fidelity attribution based on distinctive and sustained use of CL0P ransomware and the unique tactic of orchestrating global zero-day exploitation campaigns against enterprise managed file transfer systems."
reviewStatus: "under_review"
generatedBy: "penfold-bot"
generatedDate: 2026-04-14
tags:
  - "financially-motivated"
  - "cybercrime"
  - "ransomware"
sources:
  - url: "https://attack.mitre.org/groups/G0117/"
    publisher: "MITRE ATT&CK"
    publisherType: "research"
    reliability: "R1"
    accessDate: "2026-04-14"
    archived: false
  - url: "https://www.mandiant.com/resources/blog/fin11-emerges-from-the-shadows"
    publisher: "Mandiant"
    publisherType: "vendor"
    reliability: "R1"
    publicationDate: "2020-10-14"
    accessDate: "2026-04-14"
    archived: false
---

## Executive Summary
FIN11 (also tracked as GOLD WELLINGTON) is a prolific, financially motivated threat actor active since at least 2017. Widely assessed to be operating out of the Commonwealth of Independent States (CIS), FIN11 originally functioned as a high-volume email distribution operator (often partnering with the TA505 ecosystem) to distribute point-of-sale malware and banking trojans. However, the group has since evolved into a highly mature cybercrime enterprise focused explicitly on high-value digital extortion. They are most notorious for orchestrating widespread zero-day exploitation campaigns against enterprise managed file transfer (MFT) systems to steal data and demand massive ransom payments, often operating in tandem with the CL0P ransomware cartel.

## Notable Campaigns
- **Accellion FTA Exploitation (2020-2021):** FIN11 utilized zero-day vulnerabilities in the legacy Accellion File Transfer Appliance (FTA) to exfiltrate massive troves of sensitive data from over 100 global organizations. They subsequently attempted to extort the victims by publishing stolen data on the CL0P leak site.
- **GoAnywhere MFT Mass Compromise (2023):** Executed a rapid mass-exploitation campaign using a zero-day in Fortra's GoAnywhere MFT, stealing data from over 130 organizations.
- **MOVEit Transfer Exploitation (2023):** Leveraged a critical zero-day vulnerability (CVE-2023-34362) in Progress Software’s MOVEit Transfer to compromise thousands of organizations globally, representing one of the largest systemic extortion events in history.

## Technical Capabilities
FIN11 historically relied heavily on high-volume, generic spear-phishing campaigns delivering malicious macros that dropped the **FlawedAmmyy** remote access trojan (RAT) and **MIXLABEL**. In recent years, they have radically shifted their initial access strategy to focus almost entirely on the rapid weaponization and exploitation of zero-day vulnerabilities in secure file transfer appliances. Once they compromise an MFT appliance, they immediately deploy their custom **Dewdrop** web shell to export underlying database configurations and exfiltrate all tenant files directly to FIN11-controlled infrastructure.

## Attribution
Mandiant and other threat intelligence firms attribute FIN11 to a financially motivated cybercrime syndicate operating out of the CIS. FIN11 exhibits significant historical overlap with the infrastructure and tooling of TA505; however, they are tracked as a distinct entity due to their specific pivot into MFT zero-day extortion and their specialized relationship with the CL0P ransomware operation.

## Sources & References
- Mandiant Threat Intelligence: FIN11 Profile
- CISA Advisories on Accellion and MOVEit Compromises
- MITRE ATT&CK Group G0116
