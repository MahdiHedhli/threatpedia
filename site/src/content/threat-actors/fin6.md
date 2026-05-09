---
name: "FIN6"
aliases:
  - "ITG08"
  - "Skeleton Spider"
affiliation: "Cybercriminal"
motivation: "Financial"
status: active
country: "Unknown"
firstSeen: "2015"
lastSeen: "2022"
targetSectors:
  - "Retail"
  - "Hospitality"
  - "E-commerce"
  - "Financial Services"
targetGeographies:
  - "United States"
  - "Europe"
  - "Global"
tools:
  - "FrameworkPOS"
  - "GratefulPOS"
  - "More_eggs"
  - "Metasploit"
mitreMappings:
  - techniqueId: "T1566.001"
    techniqueName: "Spearphishing Attachment"
    tactic: "Initial Access"
    notes: "FIN6 has used spear-phishing emails with malicious attachments to gain initial access to target environments."
  - techniqueId: "T1059.001"
    techniqueName: "PowerShell"
    tactic: "Execution"
    notes: "FIN6 has used PowerShell for execution and post-exploitation activity within compromised environments."
  - techniqueId: "T1078"
    techniqueName: "Valid Accounts"
    tactic: "Persistence"
    notes: "FIN6 has used legitimate credentials obtained through credential harvesting to maintain persistence and move laterally."
  - techniqueId: "T1003.001"
    techniqueName: "LSASS Memory"
    tactic: "Credential Access"
    notes: "FIN6 has used credential harvesting tools to dump credentials from LSASS memory on compromised hosts."
  - techniqueId: "T1021.001"
    techniqueName: "Remote Desktop Protocol"
    tactic: "Lateral Movement"
    notes: "FIN6 has used RDP to move laterally through victim networks following initial compromise and credential harvesting."
  - techniqueId: "T1021.002"
    techniqueName: "SMB/Windows Admin Shares"
    tactic: "Lateral Movement"
    notes: "FIN6 has used SMB and Windows admin shares for lateral movement within victim environments."
  - techniqueId: "T1056.001"
    techniqueName: "Keylogging"
    tactic: "Collection"
    notes: "FIN6 has used keyloggers as part of its credential and payment card data collection operations."
  - techniqueId: "T1005"
    techniqueName: "Data from Local System"
    tactic: "Collection"
    notes: "FIN6 has used FrameworkPOS and GratefulPOS to scrape payment card data from the memory of point-of-sale processes."
  - techniqueId: "T1074.001"
    techniqueName: "Local Data Staging"
    tactic: "Collection"
    notes: "FIN6 has staged collected payment card data locally before exfiltration."
  - techniqueId: "T1041"
    techniqueName: "Exfiltration Over C2 Channel"
    tactic: "Exfiltration"
    notes: "FIN6 has exfiltrated collected data over the same command-and-control channel used for post-exploitation activity."
  - techniqueId: "T1105"
    techniqueName: "Ingress Tool Transfer"
    tactic: "Command and Control"
    notes: "FIN6 has transferred tools and payloads including FrameworkPOS and GratefulPOS to compromised systems during operations."
  - techniqueId: "T1071.001"
    techniqueName: "Web Protocols"
    tactic: "Command and Control"
    notes: "FIN6 has used HTTP/HTTPS for command-and-control communications in observed intrusions."
attributionConfidence: A3
attributionRationale: "Documented through multiple independent vendor and research investigations with consistent TTPs, tooling, and targeting patterns. No public government indictment or country-level attribution in available reporting."
reviewStatus: "draft_ai"
generatedBy: "dangermouse-bot"
generatedDate: 2026-05-08
tags:
  - "cybercriminal"
  - "fin6"
  - "payment-card-theft"
  - "pos-malware"
  - "ransomware-affiliate"
sources:
  - url: "https://attack.mitre.org/groups/G0037/"
    publisher: "MITRE ATT&CK"
    publisherType: vendor
    reliability: R1
    publicationDate: "2025-01-14"
    accessDate: "2026-05-08"
    archived: false
  - url: "https://cloud.google.com/blog/topics/threat-intelligence/pick-six-intercepting-a-fin6-intrusion"
    publisher: "Google Cloud"
    publisherType: vendor
    reliability: R1
    publicationDate: "2019-11-07"
    accessDate: "2026-05-08"
    archived: false
  - url: "https://ctid.mitre.org/projects/fin6-adversary-emulation-plan/"
    publisher: "MITRE CTID"
    publisherType: vendor
    reliability: R1
    publicationDate: "2020-06-01"
    accessDate: "2026-05-08"
    archived: false
---

## Executive Summary

FIN6 is a financially motivated group active since at least 2015, documented primarily for large-scale theft of payment card data from point-of-sale (POS) systems in retail and hospitality environments. The group is tracked under multiple vendor designations including ITG08 (IBM X-Force) and Skeleton Spider (CrowdStrike). FIN6 has used spear-phishing for initial access, credential harvesting tools for lateral movement, and specialized POS RAM-scraping malware — FrameworkPOS and GratefulPOS — to collect payment card data from the memory of POS processes. Harvested card data has been sold through underground marketplaces.

Beginning around 2018, public reporting documented FIN6 activity associated with ransomware deployment against compromised enterprise environments, representing an operational shift or expansion from card theft to broader extortion. Available evidence does not establish FIN6's country of origin or identify specific operators.

## Notable Campaigns

### 2015–2018 — Payment Card Harvesting Operations

FIN6's documented early operations focused on compromising retail and hospitality organizations to steal payment card data. The group used spear-phishing to obtain an initial foothold, followed by credential harvesting to enable lateral movement across POS infrastructure. FrameworkPOS and GratefulPOS were deployed to scrape card data from the memory of POS processes, with collected data staged locally before exfiltration. MITRE ATT&CK documentation and the Mandiant "Pick Six" intrusion report describe this operational pattern across multiple victim environments.

Stolen payment card data was subsequently advertised and sold on underground markets, indicating a direct monetization pipeline rather than state-directed collection. The consistency of targeting across unrelated retail and hospitality organizations reflects an opportunistic, financially-driven operation.

### 2018–2022 — Ransomware Deployment and Expanded Operations

MITRE ATT&CK reporting documents FIN6 activity associated with the deployment of ransomware, including LockerGoga and Ryuk, against compromised enterprise environments. This expansion — whether representing direct deployment or facilitation through partnerships with ransomware operators — marked a broadening of the group's monetization methods beyond payment card theft. The consistent use of prior FIN6 TTPs for initial access and lateral movement in these cases supports attribution to the same operational cluster.

E-commerce targeting also emerged in this period alongside continued brick-and-mortar retail operations, with the More_eggs JScript backdoor observed as an initial-stage implant in multiple campaigns attributed to FIN6.

## Technical Capabilities

FIN6 achieves initial access primarily through spear-phishing emails with malicious attachments. The More_eggs JScript backdoor has been used as an initial-stage implant to establish a foothold in target environments. Once inside, actors harvest credentials from LSASS memory and use those credentials to move laterally via RDP and SMB shares, ultimately reaching POS systems and other targeted hosts.

FrameworkPOS and GratefulPOS are the group's primary POS RAM-scraping tools. Both target the memory of POS processes to extract payment card track data. Collected card records are staged locally — typically compressed into archives — before exfiltration over the command-and-control channel. Metasploit has been observed in FIN6 intrusions for post-exploitation capability.

Exfiltration occurs over the group's C2 infrastructure using HTTP/HTTPS communications. FIN6 demonstrates consistent operational security awareness, including use of legitimate administrative tools to blend with normal network activity and minimize forensic footprint during lateral movement.

## Attribution

FIN6 is documented by multiple independent security vendors including Mandiant (now part of Google), IBM X-Force, and CrowdStrike, as well as MITRE ATT&CK and the MITRE CTID adversary emulation project. Consistent TTPs, shared tooling, and overlapping targeting across independently investigated intrusions support treatment as a single distinct operational cluster.

No public government indictment or country-level attribution appears in available open-source reporting. The group's monetization model — selling stolen payment card data on underground markets and later deploying ransomware — is consistent with financially motivated cybercriminal operations without identified state nexus.

## MITRE ATT&CK Profile

**Initial Access**: Spear-phishing emails with malicious attachments (T1566.001); use of valid credentials obtained through harvesting for persistent access (T1078).

**Execution**: PowerShell for post-exploitation scripting and payload execution (T1059.001).

**Credential Access**: Credential harvesting from LSASS memory (T1003.001) to obtain domain credentials for lateral movement.

**Lateral Movement**: Remote Desktop Protocol (T1021.001) and SMB/Windows Admin Shares (T1021.002) for traversal to POS systems and targeted hosts.

**Collection**: POS RAM scraping of payment card data from process memory using FrameworkPOS and GratefulPOS (T1005); keylogging for credential and data collection (T1056.001); local staging of harvested card data prior to exfiltration (T1074.001).

**Exfiltration**: Exfiltration of staged data over the C2 channel (T1041).

**Command and Control**: Ingress transfer of tools and payloads to compromised hosts (T1105); HTTP/HTTPS communications for C2 (T1071.001).

## Sources & References

- [MITRE ATT&CK: FIN6 (G0037)](https://attack.mitre.org/groups/G0037/) — MITRE ATT&CK, 2025-01-14
- [Google Cloud: Pick Six: Intercepting a FIN6 Intrusion](https://cloud.google.com/blog/topics/threat-intelligence/pick-six-intercepting-a-fin6-intrusion) — Google Cloud, 2019-11-07
- [MITRE CTID: FIN6 Adversary Emulation Plan](https://ctid.mitre.org/projects/fin6-adversary-emulation-plan/) — MITRE CTID, 2020-06-01
