---
eventId: "TP-2026-0020"
title: "WannaCry Ransomware Global Outbreak"
date: 2017-05-12
attackType: "Ransomware"
severity: critical
sector: "Healthcare"
geography: "Global"
threatActor: "Lazarus Group"
attributionConfidence: A2
reviewStatus: "certified"
confidenceGrade: B
generatedBy: "penfold-bot"
generatedDate: 2026-04-15
cves:
  - "CVE-2017-0144"
  - "CVE-2017-0145"
relatedSlugs:
  - "lazarus-group"
tags:
  - "ransomware"
  - "wannacry"
  - "eternalblue"
  - "lazarus-group"
  - "north-korea"
  - "nhs"
  - "smb"
  - "ms17-010"
sources:
  - url: "https://www.cisa.gov/news-events/alerts/2017/05/12/indicators-associated-wannacry-ransomware"
    publisher: "CISA"
    publisherType: government
    reliability: R1
    publicationDate: "2017-05-12"
    accessDate: "2026-04-15"
    archived: false
  - url: "https://www.ncsc.gov.uk/news/uk-and-key-allies-say-north-korea-behind-wannacry-attack"
    publisher: "NCSC UK"
    publisherType: government
    reliability: R1
    publicationDate: "2017-12-19"
    accessDate: "2026-04-15"
    archived: false
  - url: "https://learn.microsoft.com/en-us/security-updates/securitybulletins/2017/ms17-010"
    publisher: "Microsoft"
    publisherType: vendor
    reliability: R1
    publicationDate: "2017-03-14"
    accessDate: "2026-04-15"
    archived: false
mitreMappings:
  - techniqueId: "T1210"
    techniqueName: "Exploitation of Remote Services"
    tactic: "Lateral Movement"
    notes: "WannaCry used the EternalBlue exploit to target SMBv1 for lateral movement."
  - techniqueId: "T1486"
    techniqueName: "Data Encrypted for Impact"
    tactic: "Impact"
    notes: "The primary goal of WannaCry was the encryption of user files and extortion."
---

## Executive Summary

The WannaCry ransomware attack was a global cybersecurity incident that began on May 12, 2017. It represents one of the most significant coordinate cyberattacks in history, impacting over 200,000 systems in 150 countries within its first 72 hours. The campaign utilized the **EternalBlue** exploit, a sophisticated vulnerability in Microsoft's SMBv1 protocol that had been leaked by the "Shadow Brokers" group a month earlier.

The attack had a profound impact on critical infrastructure, crippling the United Kingdom's National Health Service (NHS), where it led to thousands of canceled appointments and the diversion of emergency services. While a "kill switch" was inadvertently activated by researcher Marcus Hutchins (MalwareTech) within 24 hours, the damage was extensive. The attack was subsequently attributed with high confidence to the **Lazarus Group**, a threat actor operating on behalf of the North Korean government.

## Technical Analysis

WannaCry is a multi-component malware consisting of a dropper, a worm for self-propagation, and a specialized ransomware module. Its primary infection vector was the **EternalBlue** (CVE-2017-0144) exploit. EternalBlue targets a buffer overflow vulnerability in the SMBv1 server service on legacy Windows operating systems. By sending a specially crafted packet to an unpatched system, the worm could achieve remote code execution (RCE) with System-level privileges.

Once a single machine on a network was infected, WannaCry scanned the local network and the public internet for other vulnerable SMB ports (TCP 445). It would then use the EternalBlue exploit combined with the **DoublePulsar** backdoor to install itself on additional victims. This worm-like behavior allowed the malware to spread effortlessly across enterprise environments without any user interaction (phishing or link clicks).

The ransomware payload utilized RSA-2048 and AES-128-CBC encryption. It targeted over 170 different file extensions and provided a ransom note in 28 languages, demanding $300 (later $600) in Bitcoin.

## Attack Chain

### Stage 1: Initial Entry
The malware began spreading globally on May 12, 2017. While earlier theories suggested email delivery, investigation found that the initial infections likely occurred via direct exploitation of internet-facing SMB services on unpatched systems.

### Stage 2: Self-Propagation
Once a host was compromised, the WannaCry worm component initiated a scanning process. It used a random IP generation algorithm to find new targets and used the DoublePulsar backdoor to deploy the ransomware payload.

### Stage 3: Encryption and Extortion
The payload executed, encrypted local files, and deleted Volume Shadow Copies to prevent easy recovery. A desktop wallpaper was set, and a GUI window (WanaDecryptor) appeared to facilitate payment.

## MITRE ATT&CK Mapping

| Tactic | Technique ID | Technique Name | Description |
|---|---|---|---|
| Initial Access | T1190 | Exploit Public-Facing Application | Target unpatched SMBv1 services on the internet. |
| Lateral Movement | T1210 | Exploitation of Remote Services | use of EternalBlue across local networks. |
| Impact | T1486 | Data Encrypted for Impact | Mandatory encryption of user data for financial gain. |

## Impact Assessment

The scope of the WannaCry attack was unprecedented for a ransomware campaign. Estimated global losses vary, with some assessments reaching up to $4 billion due to lost productivity and remediation costs. 

In the UK, the NHS was severely impacted; at least 80 of the 236 trusts were affected. Hospitals were forced to turn away patients, cancel surgeries, and revert to paper records for weeks. Other major victims included FedEx (TNT Express), Telefonica, Deutsche Bahn, and Renault.

## Timeline

### 2017-03-14 — Microsoft Patch Release
Microsoft released MS17-010, a critical security update for the SMBv1 vulnerability, roughly one month before the exploit was leaked publicy.

### 2017-04-14 — Shadow Brokers Leak
The Shadow Brokers group leaked a cache of NSA tools, including the EternalBlue exploit and DoublePulsar backdoor.

### 2017-05-12 — Outbreak Begins
WannaCry began spreading rapidly across Europe and Asia, peaking within 24 hours.

### 2017-05-13 — Kill Switch Discovery
Researcher Marcus Hutchins registered a "sinkhole" domain found in the malware's code. This acted as a kill switch, preventing new infections from completing their execution.

## Remediation & Mitigation

The immediate response to WannaCry involved the deployment of the MS17-010 patch to all Windows systems. Microsoft took the extraordinary step of releasing patches for unsupported operating systems, including Windows XP and Windows Server 2003, acknowledging the systemic risk posed by the worm.

Long-term mitigation strategies focused on the complete deactivation of SMBv1, which is now considered a legacy and insecure protocol. Organizations were advised to implement better network segmentation to prevent the spread of self-propagating threats and to maintain offline backups.

## Indicators of Compromise

**Network Indicators:**
- C2 Sinkhole Domain: `iuqerfsodp9ifjaposdfjhgosurijfaewrwergwea.com`
- Scanning activity on TCP Port 445 (SMB)

**Host Indicators:**
- File Extension: `.WNCRY`, `.WNCRYT`, `.WNCYR`
- Ransom Note: `@Please_Read_Me@.txt`
- Dropper Mutex: `Global\MsWinZones\Microsoft.Windows.RemoteExplorer`

## Sources & References

- CISA Alert (AA17-132A): Indicators Associated with WannaCry Ransomware (2017)
- NCSC UK: UK and key allies say North Korea behind WannaCry attack (2017)
- US Department of Justice: North Korean Regime-Backed Programmer Charged with Conspiracy (2018)
- Microsoft Security Bulletin MS17-010 - Critical (2017)
