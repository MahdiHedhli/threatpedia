---
name: "FIN11"
aliases:
  - "TA505"
  - "Lace Tempest"
  - "UNC1549"
affiliation: "Unknown (Russia-based)"
motivation: "Financial"
status: active
country: "Russia"
firstSeen: "2016"
lastSeen: "2026"
targetSectors:
  - "Finance"
  - "Healthcare"
  - "Technology"
  - "Pharmaceutical"
  - "Legal"
targetGeographies:
  - "Global"
  - "United States"
  - "Canada"
  - "Europe"
tools:
  - "ClOp Ransomware"
  - "FlawedAmmyy"
  - "FRIENDLYGUEST"
  - "DEWMODE"
  - "MINEBRIDGE"
mitreMappings:
  - techniqueId: "T1190"
    techniqueName: "Exploit Public-Facing Application"
    tactic: "Initial Access"
    notes: "Frequently utilizes zero-day exploits in file transfer appliances, such as the Accellion FTA and GoAnywhere MFT, to gain widespread access."
  - techniqueId: "T1566.001"
    techniqueName: "Phishing: Spearphishing Attachment"
    tactic: "Initial Access"
    notes: "Maintains a high-volume email distribution infrastructure to deliver malicious documents containing macros that install second-stage loaders."
  - techniqueId: "T1048.003"
    techniqueName: "Exfiltration Over Alternative Protocol"
    tactic: "Exfiltration"
    notes: "Utilizes custom exfiltration tools like DEWMODE to steal volumes of sensitive data from compromised file transfer servers before extortion."
attributionConfidence: A2
attributionRationale: "Identified as a distinct Russia-based financial threat cluster by Mandiant (Google Cloud) following its evolution from a high-volume phishing actor to a specialized data extortion group."
reviewStatus: "draft_ai"
generatedBy: "penfold-bot"
generatedDate: 2026-04-16
tags:
  - "fin11"
  - "ta505"
  - "cybercrime"
  - "ransomware"
  - "extortion"
  - "accellion-fta"
sources:
  - url: "https://www.mandiant.com/resources/blog/fin11-email-campaigns-to-ransomware"
    publisher: "Mandiant"
    publisherType: vendor
    reliability: R1
    publicationDate: "2020-10-13"
    accessDate: "2026-04-16"
    archived: false
  - url: "https://www.cisa.gov/news-events/cybersecurity-advisories/aa21-055a"
    publisher: "CISA"
    publisherType: government
    reliability: R1
    publicationDate: "2021-02-24"
    accessDate: "2026-04-16"
    archived: false
  - url: "https://attack.mitre.org/groups/G0117/"
    publisher: "MITRE ATT&CK"
    publisherType: community
    reliability: R1
    publicationDate: "2023-10-21"
    accessDate: "2026-04-16"
    archived: false
  - url: "https://www.microsoft.com/en-us/security/blog/2021/01/21/microsoft-365-defender-data-exfiltration-accellion-fta-vulnerability/"
    publisher: "Microsoft Security"
    publisherType: vendor
    reliability: R1
    publicationDate: "2021-01-21"
    accessDate: "2026-04-16"
    archived: false
---

## Executive Summary

FIN11 is a prolific Russia-based threat actor group that has been active since at least 2016. While historically associated with the broader **TA505** cluster, FIN11 is tracked as a distinct entity due to its specialized focus on high-volume email campaigns and its eventual transition into a double-extortion ransomware and data theft syndicate. The group is primarily motivated by financial gain and is the primary operator of the **ClOp ransomware** and its associated leak site.

The group is characterized by its significant operational scale, at times delivering malicious emails to hundreds of thousands of recipients per day. Since 2020, FIN11 has shifted its focus toward the exploitation of zero-day vulnerabilities in Managed File Transfer (MFT) systems, allowing them to conduct massive data-theft operations that impact hundreds of organizations simultaneously across the legal, pharmaceutical, and financial sectors.

## Notable Campaigns

### Accellion FTA Exploitation (2020-2021)
In late 2020, FIN11 leveraged several zero-day vulnerabilities (including CVE-2021-27101) in the **Accellion File Transfer Appliance (FTA)** to gain initial access to numerous high-profile organizations. The group utilized a specialized web shell dubbed **DEWMODE** to exfiltrate terabytes of sensitive data from these appliances. Victims who refused to pay the extortion demands had their stolen information published on the ClOp data leak site, marking a significant escalation in the group's "extortion-only" methodology.

### High-Volume Dridex and FlawedAmmyy Campaigns
Prior to its shift toward ransomware, FIN11 was one of the world's most active distributors of the **Dridex** banking trojan and the **FlawedAmmyy** remote access trojan (RAT). These massive phishing campaigns utilized thousands of diverse sender domains and frequently pivoted their lures to exploit current events, such as global tax seasons or the COVID-19 pandemic. These operations provided the group with a vast network of initial footholds that they later monetized via secondary access or ransomware deployment.

## Technical Capabilities

FIN11 maintains a versatile and evolving toolset. They are known for their use of custom second-stage loaders مانند **FRIENDLYGUEST** and **MINEBRIDGE**, which are designed to download and execute additional malware while bypassing modern EDR and antivirus products. Their primary exfiltration tool, **DEWMODE**, is a specialized PHP-based web shell capable of interacting directly with database files on compromised appliances to automate the extraction of specific high-value data types.

The group's operational infrastructure is massive, involving thousands of compromised servers and domains. They frequently use **Cobalt Strike** for internal lateral movement and exhibit high technical proficiency in harvesting administrative credentials. FIN11 demonstrated a trailblazing ability to identify and weaponize appliance vulnerabilities at scale, a technique that has since been adopted by many other high-end ransomware groups.

## Attribution

FIN11 is attributed with high confidence to Russia-based cybercriminals, though its core leadership remains unidentified. The group's activities align with business hours in the Russian time zones, and they actively avoid targeting organizations within the Commonwealth of Independent States (CIS). While some security firms treat FIN11 and TA505 as synonymous, most analysts distinguish FIN11 as the specific sub-cluster focused on the monetization of ClOp ransomware and MFT exploitation.

Large-scale analysis by **Mandiant** and **Microsoft** indicates that FIN11 acts as a "monetization engine" for many of the access clusters managed by broader TA505 infrastructure. Despite various law enforcement efforts to disrupt their C2 servers and the arrest of some lower-level money launderers, the group has shown extreme resilience, repeatedly rebuilding its infrastructure and transitioning to new exploit chains.

## MITRE ATT&CK Profile

FIN11 techniques focus on high-volume initial access and specialized data extraction:

- **T1190 (Exploit Public-Facing Application):** Mass-exploitation of zero-day vulnerabilities in enterprise storage and file transfer appliances.
- **T1566.001 (Phishing: Spearphishing Attachment):** Using massive botnet-delivered email campaigns to gain initial footholds.
- **T1048.003 (Exfiltration Over Alternative Protocol):** Rapid, script-based exfiltration of high-value documents to attacker-controlled storage buckets.
- **T1486 (Data Encrypted for Impact):** Using ClOp ransomware to disable victim operations and force extortion payments.

## Sources & References

- [Mandiant: FIN11 — Email Campaigns to Ransomware: Analysis of a Prolific Financial Threat Group](https://www.mandiant.com/resources/blog/fin11-email-campaigns-to-ransomware) — Mandiant, 2020-10-13
- [CISA: Advisory (AA21-055A) — Exploitation of Accellion File Transfer Appliance](https://www.cisa.gov/news-events/cybersecurity-advisories/aa21-055a) — CISA, 2021-02-24
- [MITRE ATT&CK: FIN11 (Group G0117)](https://attack.mitre.org/groups/G0117/) — MITRE ATT&CK, 2023-10-21
- [Microsoft: Analysis of Data Exfiltration via Accellion FTA Vulnerabilities](https://www.microsoft.com/en-us/security/blog/2021/01/21/microsoft-365-defender-data-exfiltration-accellion-fta-vulnerability/) — Microsoft Security, 2021-01-21
- [NCSC UK: Alert — TA505/FIN11 and the threat to the financial sector](https://www.ncsc.gov.uk/news/ta505-fin11-threat-financial-sector) — NCSC UK, 2020-10-13
