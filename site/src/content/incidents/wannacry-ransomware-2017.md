---
eventId: TP-2017-0001
title: WannaCry Ransomware Global Outbreak
date: 2017-05-12
attackType: Ransomware
severity: critical
sector: Healthcare
geography: Global
threatActor: Lazarus Group
attributionConfidence: A1
reviewStatus: under_review
confidenceGrade: A
generatedBy: dangermouse-bot
generatedDate: 2026-04-16
cves:
  - CVE-2017-0144
  - CVE-2017-0145
relatedSlugs:
  - eternalblue-ms17-010-cve-2017-0144
tags:
  - ransomware
  - wannacry
  - lazarus-group
  - north-korea
  - eternalblue
  - smb
  - nhs
  - worm
  - cve-2017-0144
sources:
  - url: https://www.cisa.gov/news-events/alerts/2017/05/12/indicators-associated-wannacry-ransomware
    publisher: CISA
    publisherType: government
    reliability: R1
    publicationDate: "2017-05-12"
    accessDate: "2026-04-16"
    archived: false
  - url: https://www.ncsc.gov.uk/news/uk-and-key-allies-say-north-korea-behind-wannacry-attack
    publisher: UK NCSC
    publisherType: government
    reliability: R1
    publicationDate: "2017-12-19"
    accessDate: "2026-04-16"
    archived: false
  - url: https://www.justice.gov/opa/pr/north-korean-regime-backed-programmer-charged-conspiracy-conduct-multiple-cyber-attacks-and
    publisher: U.S. Department of Justice
    publisherType: government
    reliability: R1
    publicationDate: "2018-09-06"
    accessDate: "2026-04-16"
    archived: false
  - url: https://attack.mitre.org/software/S0366/
    publisher: MITRE
    publisherType: research
    reliability: R1
    publicationDate: "2019-01-16"
    accessDate: "2026-04-16"
    archived: false
  - url: https://www.microsoft.com/en-us/security/blog/2017/05/12/wannacrypt-ransomware-worm-targets-out-of-date-systems/
    publisher: Microsoft
    publisherType: vendor
    reliability: R1
    publicationDate: "2017-05-12"
    accessDate: "2026-04-16"
    archived: false
mitreMappings:
  - techniqueId: T1210
    techniqueName: "Exploitation of Remote Services"
    tactic: Lateral Movement
    notes: WannaCry exploited SMBv1 via EternalBlue to spread across networks
  - techniqueId: T1486
    techniqueName: "Data Encrypted for Impact"
    tactic: Impact
    notes: Encrypted user files and demanded Bitcoin ransom
  - techniqueId: T1570
    techniqueName: "Lateral Tool Transfer"
    tactic: Lateral Movement
    notes: Self-propagating worm component spread payloads to adjacent hosts
---

## Executive Summary

On 12 May 2017, the WannaCry ransomware worm began propagating across global networks, infecting an estimated 230,000 computers in over 150 countries within the first 24 hours. The malware exploited CVE-2017-0144 (EternalBlue), a vulnerability in the Microsoft Server Message Block version 1 (SMBv1) protocol, to achieve remote code execution on unpatched Windows systems. Once inside a network, WannaCry moved laterally without user interaction, encrypting files and displaying a ransom demand of $300-$600 in Bitcoin.

The outbreak caused widespread disruption across multiple sectors. The United Kingdom's National Health Service (NHS) was among the hardest-hit organizations: 80 of 236 NHS trusts in England were affected, leading to cancelled appointments, diverted ambulances, and disrupted patient care. Telefonica in Spain, Deutsche Bahn in Germany, FedEx in the United States, and Renault-Nissan's manufacturing plants were also affected. The attack persisted until security researcher Marcus Hutchins discovered and activated a kill switch domain hardcoded in the malware, which halted further propagation of the initial variant.

The U.S. government, the UK National Cyber Security Centre (NCSC), and multiple allied nations formally attributed WannaCry to the Lazarus Group, a threat actor linked to North Korea's Reconnaissance General Bureau. In September 2018, the U.S. Department of Justice indicted North Korean programmer Park Jin Hyok for his role in the operation.

## Technical Analysis

WannaCry combined a ransomware payload with a worm propagation mechanism. The worm component used the EternalBlue exploit (CVE-2017-0144) — a tool originally developed by the U.S. National Security Agency and leaked by the Shadow Brokers group in April 2017 — to target the SMBv1 service on TCP port 445. The exploit triggered a buffer overflow in the Windows SMB server, allowing arbitrary code execution at the kernel level.

Upon successful exploitation, WannaCry installed the DoublePulsar backdoor (if not already present) to inject the ransomware DLL into the LSASS process. The ransomware component then encrypted files matching 176 file extensions using AES-128-CBC encryption, with per-file AES keys encrypted using a 2048-bit RSA public key. The private key was held by the attackers, making decryption without payment infeasible.

The malware generated random IP addresses and attempted SMB connections on port 445 to spread to other systems. It also scanned the local subnet for additional targets. Before encrypting, WannaCry attempted to contact the domain `iuqerfsodp9ifjaposdfjhgosurijfaewrwergwea[.]com`. If the domain resolved, the malware halted execution — a kill switch mechanism that Marcus Hutchins later exploited by registering the domain on 12 May 2017.

Microsoft had released security bulletin MS17-010 on 14 March 2017, patching the underlying SMBv1 vulnerability two months before the outbreak. Systems that had applied the patch were immune to the worm propagation mechanism.

## Attack Chain

### Stage 1: Initial Access via EternalBlue

WannaCry scanned for internet-facing systems with SMBv1 (TCP port 445) exposed. The EternalBlue exploit sent crafted SMB transaction packets to trigger a heap overflow in the srv.sys driver, achieving kernel-level code execution on unpatched Windows systems ranging from XP through Server 2008 R2.

### Stage 2: DoublePulsar Backdoor Installation

After exploitation, the worm installed the DoublePulsar implant, a kernel-mode backdoor that hooked the SMB transaction dispatch table. This implant provided a covert channel for injecting the ransomware payload into user-mode processes.

### Stage 3: Kill Switch Check

Before proceeding with encryption, the malware issued an HTTP request to a hardcoded domain. If the domain resolved (indicating analysis or sinkholing), the malware terminated. This mechanism was likely intended as an anti-sandbox technique.

### Stage 4: File Encryption

The ransomware enumerated local and mapped network drives, encrypting files matching target extensions. Each file was encrypted with a unique AES-128-CBC key, and the AES keys were encrypted with an embedded RSA-2048 public key. Encrypted files received a `.WNCRY` extension.

### Stage 5: Lateral Movement

Simultaneously with encryption, WannaCry's worm module scanned the local subnet and generated random external IP addresses, attempting EternalBlue exploitation against each reachable host on port 445. This dual scanning strategy enabled rapid propagation within networks and across the internet.

### Stage 6: Ransom Demand

A ransom note was displayed via a custom GUI application (`@WanaDecryptor@.exe`), demanding $300 in Bitcoin with a threat to double the amount after three days and permanently delete files after seven days. Three Bitcoin wallet addresses were hardcoded into the malware.

## Impact Assessment

WannaCry infected approximately 230,000 systems across more than 150 countries. Financial damage estimates range from $4 billion to $8 billion globally.

The UK NHS experienced the most visible impact: 80 NHS trusts and 595 GP practices in England were disrupted. Approximately 19,000 appointments were cancelled, and five hospitals diverted ambulances during the peak of the outbreak. The Department of Health and Social Care estimated the cost to the NHS at GBP 92 million.

Renault-Nissan halted production at five manufacturing plants across Europe. FedEx subsidiary TNT Express sustained an estimated $300 million in losses due to operational disruption. Deutsche Bahn experienced failures in passenger information displays and ticketing systems across Germany. China National Petroleum Corporation disconnected 20,000 gas station payment systems as a precaution.

Despite infecting hundreds of thousands of systems, the WannaCry operators collected only approximately $140,000 in Bitcoin ransom payments — a fraction of the total damage caused. The low ransom yield was attributed to the kill switch activation, rapid public awareness, and law enforcement advisories against payment.

## Historical Context

The United States, the United Kingdom, Australia, Canada, Japan, and New Zealand jointly attributed WannaCry to North Korea in December 2017. The UK NCSC assessed with high confidence that the Lazarus Group, operating under the Reconnaissance General Bureau of North Korea, was responsible for the attack.

In September 2018, the U.S. Department of Justice unsealed an indictment charging North Korean citizen Park Jin Hyok with conspiracy to conduct the WannaCry attack, the 2014 Sony Pictures hack, and the 2016 Bangladesh Bank heist. The indictment detailed Park's employment at Chosun Expo Joint Venture, a North Korean government front company, and provided technical evidence linking the WannaCry code to other Lazarus Group operations.

Code analysis revealed shared code libraries, encryption implementations, and network infrastructure between WannaCry and earlier Lazarus Group tools, including the Destover wiper used against Sony Pictures and the malware used in the SWIFT banking attacks.

## Timeline

### 2017-03-14 — Microsoft Releases MS17-010

Microsoft published security bulletin MS17-010, patching the SMBv1 vulnerability CVE-2017-0144 across supported Windows versions.

### 2017-04-14 — Shadow Brokers Leak EternalBlue

The Shadow Brokers group publicly released a collection of NSA exploitation tools, including EternalBlue and DoublePulsar.

### 2017-05-12 — WannaCry Outbreak Begins

The WannaCry worm began propagating globally, rapidly infecting systems with exposed SMBv1 services. The UK NHS, Telefonica, and other major organizations reported disruptions within hours.

### 2017-05-12 — Kill Switch Activated

Security researcher Marcus Hutchins registered the kill switch domain, halting propagation of the primary WannaCry variant.

### 2017-05-13 — Microsoft Issues Emergency Patch for XP

Microsoft released an emergency patch for Windows XP, Server 2003, and Windows 8 — operating systems that had reached end-of-life and were not covered by the original MS17-010 bulletin.

### 2017-12-19 — Joint Government Attribution to North Korea

The U.S., UK, Australia, Canada, Japan, and New Zealand publicly attributed WannaCry to the North Korean government.

### 2018-09-06 — DOJ Indictment of Park Jin Hyok

The U.S. Department of Justice unsealed charges against North Korean programmer Park Jin Hyok for his role in WannaCry, the Sony Pictures attack, and the Bangladesh Bank heist.

## Remediation & Mitigation

Organizations should apply Microsoft security bulletin MS17-010, which patches CVE-2017-0144 and related SMBv1 vulnerabilities across all supported Windows versions. Microsoft also released emergency patches for end-of-life systems including Windows XP and Server 2003.

Disabling SMBv1 is recommended for environments that do not require it. Microsoft has provided guidance on disabling SMBv1 via Group Policy, PowerShell, and registry modifications. Network segmentation and firewall rules should block SMB traffic (TCP port 445) from traversing between network segments and from reaching the internet.

Maintaining offline backups protects against ransomware encryption. Organizations should test backup restoration procedures and ensure backup systems are isolated from production networks to prevent concurrent encryption of backup media.

Endpoint detection and response (EDR) solutions should be configured to detect EternalBlue exploitation attempts, DoublePulsar implant installation, and mass file encryption behavior. Network intrusion detection systems can identify SMB exploitation traffic using signatures published by Snort, Suricata, and vendor-specific rulesets.

## Sources & References

- [CISA: Indicators Associated with WannaCry Ransomware](https://www.cisa.gov/news-events/alerts/2017/05/12/indicators-associated-wannacry-ransomware) — CISA, 2017-05-12
- [UK NCSC: North Korea Behind WannaCry Attack](https://www.ncsc.gov.uk/news/uk-and-key-allies-say-north-korea-behind-wannacry-attack) — UK NCSC, 2017-12-19
- [DOJ: North Korean Regime-Backed Programmer Charged](https://www.justice.gov/opa/pr/north-korean-regime-backed-programmer-charged-conspiracy-conduct-multiple-cyber-attacks-and) — U.S. Department of Justice, 2018-09-06
- [MITRE ATT&CK: WannaCry (S0366)](https://attack.mitre.org/software/S0366/) — MITRE, 2019-01-16
- [Microsoft: WannaCrypt Ransomware Worm Targets Out-of-Date Systems](https://www.microsoft.com/en-us/security/blog/2017/05/12/wannacrypt-ransomware-worm-targets-out-of-date-systems/) — Microsoft, 2017-05-12
