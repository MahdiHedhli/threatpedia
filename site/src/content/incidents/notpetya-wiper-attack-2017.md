---
eventId: TP-2017-0002
title: NotPetya Global Wiper Attack
date: 2017-06-27
attackType: Sabotage / Wiper
severity: critical
sector: Cross-Sector
geography: Global
threatActor: Sandworm
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
  - wannacry-ransomware-2017
tags:
  - notpetya
  - wiper
  - sandworm
  - russia
  - gru
  - eternalblue
  - supply-chain
  - ukraine
  - medoc
sources:
  - url: https://www.cisa.gov/news-events/alerts/2017/07/01/petya-ransomware
    publisher: CISA
    publisherType: government
    reliability: R1
    publicationDate: "2017-07-01"
    accessDate: "2026-04-16"
    archived: false
  - url: https://www.justice.gov/opa/pr/six-russian-gru-officers-charged-connection-worldwide-deployment-destructive-malware-and
    publisher: U.S. Department of Justice
    publisherType: government
    reliability: R1
    publicationDate: "2020-10-19"
    accessDate: "2026-04-16"
    archived: false
  - url: https://www.ncsc.gov.uk/news/russian-military-almost-certainly-responsible-destructive-2017-cyber-attack
    publisher: UK NCSC
    publisherType: government
    reliability: R1
    publicationDate: "2018-02-15"
    accessDate: "2026-04-16"
    archived: false
  - url: https://attack.mitre.org/software/S0368/
    publisher: MITRE
    publisherType: research
    reliability: R1
    publicationDate: "2019-01-16"
    accessDate: "2026-04-16"
    archived: false
  - url: https://www.microsoft.com/en-us/security/blog/2017/06/27/new-ransomware-old-techniques-petya-adds-worm-capabilities/
    publisher: Microsoft
    publisherType: vendor
    reliability: R1
    publicationDate: "2017-06-27"
    accessDate: "2026-04-16"
    archived: false
mitreMappings:
  - techniqueId: T1195.002
    techniqueName: "Supply Chain Compromise: Compromise Software Supply Chain"
    tactic: Initial Access
    notes: NotPetya was distributed through a compromised update to M.E.Doc accounting software
  - techniqueId: T1210
    techniqueName: "Exploitation of Remote Services"
    tactic: Lateral Movement
    notes: Used EternalBlue and EternalRomance exploits for SMBv1 lateral movement
  - techniqueId: T1561.002
    techniqueName: "Disk Wipe: Disk Structure Wipe"
    tactic: Impact
    notes: Overwrote MBR and MFT to render systems permanently unbootable
  - techniqueId: T1003.001
    techniqueName: "OS Credential Dumping: LSASS Memory"
    tactic: Credential Access
    notes: Used modified Mimikatz to extract credentials from LSASS for lateral movement
---

## Executive Summary

On 27 June 2017, a destructive malware operation disguised as ransomware struck organizations across Ukraine and rapidly spread worldwide. The malware, designated NotPetya (also tracked as Nyetya, ExPetr, and Diskcoder.C), was distributed through a compromised software update mechanism belonging to M.E.Doc, a Ukrainian tax accounting application used by an estimated 80% of Ukrainian businesses. Within hours of the initial deployment, the malware had propagated to multinational corporations operating in Ukraine and beyond.

NotPetya combined the EternalBlue and EternalRomance SMBv1 exploits with credential harvesting via a modified Mimikatz tool and Windows Management Instrumentation (WMI) and PsExec for lateral movement. Although it displayed a ransom demand, analysis by multiple security vendors confirmed that the malware's encryption was irreversible by design: the installation ID displayed to victims was randomly generated and bore no cryptographic relationship to the encryption keys. NotPetya was a wiper masquerading as ransomware.

The attack caused an estimated $10 billion in global damages, making it the most financially destructive cyberattack in history at that time. Shipping conglomerate Maersk, pharmaceutical company Merck, logistics firm FedEx/TNT Express, food manufacturer Mondelez, and numerous other multinationals sustained losses ranging from hundreds of millions to over a billion dollars each.

## Technical Analysis

NotPetya's initial infection vector was a poisoned update pushed through M.E.Doc's legitimate software update infrastructure. The attackers compromised the M.E.Doc update server and injected malicious code into the software update process. When businesses applied the update, the NotPetya payload executed with the privileges of the M.E.Doc application.

Once executing on a host, NotPetya employed a multi-layered lateral movement strategy. It first extracted credentials from LSASS memory using a modified version of Mimikatz, then attempted to spread using those credentials via WMI remote execution and PsExec. Simultaneously, it scanned the local network for systems vulnerable to CVE-2017-0144 (EternalBlue) and CVE-2017-0145 (EternalRomance), exploiting unpatched SMBv1 services for code execution.

The destructive component overwrote the Master Boot Record (MBR) with a custom bootloader that displayed the ransom note. It also encrypted the Master File Table (MFT) of the NTFS filesystem. The encryption used a randomly generated Salsa20 key, which was then ostensibly encrypted with the attacker's RSA public key. However, the "personal installation key" shown to victims was 60 random bytes unrelated to the actual encryption key, making decryption impossible even if payment was made.

NotPetya scheduled a system reboot 10-60 minutes after infection using the Windows Task Scheduler. Upon reboot, the infected MBR code executed instead of the normal Windows boot process, performing a final pass of MFT encryption and displaying the ransom screen. Systems that were powered off before the scheduled reboot could potentially have their data recovered from the unencrypted disk, though the MBR was already overwritten.

## Attack Chain

### Stage 1: Supply Chain Compromise via M.E.Doc

Attackers compromised the update server of M.E.Doc, a Ukrainian tax accounting application. A malicious DLL was injected into a legitimate software update distributed on 27 June 2017, executing the NotPetya payload on all systems that received the update.

### Stage 2: Credential Harvesting

NotPetya deployed a modified Mimikatz module to extract plaintext passwords, NTLM hashes, and Kerberos tickets from LSASS memory on the infected host. These credentials fueled subsequent lateral movement.

### Stage 3: Network Propagation

Using harvested credentials, NotPetya spread to adjacent systems via WMI remote execution and PsExec. It also scanned the local subnet for hosts vulnerable to EternalBlue (CVE-2017-0144) and EternalRomance (CVE-2017-0145), exploiting SMBv1 for code execution on unpatched systems.

### Stage 4: MBR Overwrite and MFT Encryption

NotPetya overwrote the Master Boot Record with its own bootloader and encrypted the NTFS Master File Table using Salsa20. The "personal installation key" displayed to victims was randomly generated and cryptographically useless for recovery.

### Stage 5: Scheduled Reboot and Destruction

A Windows Scheduled Task triggered a system reboot 10-60 minutes post-infection. The modified MBR code completed MFT encryption and displayed a fake ransom demand for $300 in Bitcoin.

## Impact Assessment

NotPetya caused an estimated $10 billion in total economic damage globally. The primary victims were multinational corporations with operations in Ukraine, though the malware's worm capabilities carried it far beyond the initial target.

Maersk, the world's largest container shipping company, lost access to its entire IT infrastructure: 49,000 laptops, 4,000 servers, and 2,500 applications were destroyed. The company rebuilt its entire IT environment within 10 days, at a cost estimated between $250 million and $300 million. During the recovery period, Maersk conducted port operations manually.

Merck (MSD outside the U.S.) reported $870 million in losses, including production disruption at pharmaceutical manufacturing facilities. The company's insurance claim for NotPetya damages led to a landmark legal dispute over war exclusion clauses in cyber insurance policies.

FedEx subsidiary TNT Express reported $400 million in losses. Mondelez International claimed $100 million in damages. Reckitt Benckiser estimated losses at $129 million. French construction company Saint-Gobain reported EUR 220 million in impact.

In Ukraine, the primary target, government ministries, banks, energy companies, and Kyiv's Boryspil International Airport were affected. The Chernobyl nuclear power plant's radiation monitoring system was taken offline, forcing a switch to manual monitoring.

## Historical Context

The United States, the United Kingdom, Australia, Canada, and the European Union attributed NotPetya to the Russian Federation's Main Intelligence Directorate (GRU), Unit 74455 — the threat actor known as Sandworm.

The UK NCSC assessed in February 2018 that the Russian military was "almost certainly responsible" for the NotPetya attack. The White House issued a statement in February 2018 calling NotPetya "the most destructive and costly cyber-attack in history" and attributing it to the Russian military.

In October 2020, the U.S. Department of Justice indicted six GRU officers assigned to Unit 74455 for their roles in NotPetya and other cyber operations. The indictment named the officers and detailed their specific roles in developing, testing, and deploying the malware.

The attack is assessed as an act of cyber warfare targeting Ukraine, with the global damage representing collateral impact from the worm's indiscriminate propagation capabilities. The timing aligned with Ukraine's Constitution Day celebrations on 28 June 2017.

## Timeline

### 2017-06-27 — NotPetya Deployment via M.E.Doc Update

The compromised M.E.Doc update was distributed at approximately 10:30 UTC, triggering the initial wave of infections across Ukrainian organizations. Within hours, the malware had spread to multinational corporations.

### 2017-06-27 — Global Propagation

Maersk, Merck, Saint-Gobain, Mondelez, and other multinationals reported network-wide outages as NotPetya spread through their corporate networks from Ukrainian subsidiaries.

### 2017-06-28 — Analysis Confirms Wiper Functionality

Security researchers at Kaspersky Lab and Comae Technologies independently confirmed that NotPetya's encryption was irreversible by design, classifying the malware as a wiper rather than ransomware.

### 2017-07-04 — M.E.Doc Servers Seized

Ukrainian Cyber Police seized M.E.Doc's servers as part of the criminal investigation. Analysis confirmed the update infrastructure had been compromised to distribute the malware.

### 2018-02-15 — UK and US Formal Attribution

The UK NCSC and the White House publicly attributed NotPetya to the Russian military, with the White House calling it "the most destructive and costly cyber-attack in history."

### 2020-10-19 — DOJ Indictment of Six GRU Officers

The U.S. Department of Justice unsealed charges against six officers of GRU Unit 74455 for their roles in the NotPetya attack and other destructive cyber operations.

## Remediation & Mitigation

Applying Microsoft security bulletin MS17-010 eliminates the EternalBlue and EternalRomance SMBv1 exploitation vectors. Organizations should disable SMBv1 where it is not operationally required.

Supply chain risk management programs should include validation of software update integrity, monitoring of update distribution infrastructure, and the ability to revoke or isolate updates that exhibit anomalous behavior.

Credential hygiene measures reduce the effectiveness of credential-based lateral movement: disabling WDigest authentication prevents plaintext password storage in LSASS memory; implementing Local Administrator Password Solution (LAPS) ensures unique local administrator passwords per host; and restricting WMI and PsExec execution via Group Policy limits remote execution capabilities.

Network segmentation should isolate critical business systems from general-purpose corporate networks. Systems in high-risk geographies should be further segmented to contain the blast radius of targeted attacks.

Maintaining offline, immutable backups with tested restoration procedures is essential for recovery from destructive attacks. Organizations should plan for complete infrastructure rebuild scenarios, as demonstrated by Maersk's 10-day recovery effort.

## Sources & References

- [CISA: Petya Ransomware Alert](https://www.cisa.gov/news-events/alerts/2017/07/01/petya-ransomware) — CISA, 2017-07-01
- [DOJ: Six Russian GRU Officers Charged](https://www.justice.gov/opa/pr/six-russian-gru-officers-charged-connection-worldwide-deployment-destructive-malware-and) — U.S. Department of Justice, 2020-10-19
- [UK NCSC: Russian Military Responsible for Destructive 2017 Cyber Attack](https://www.ncsc.gov.uk/news/russian-military-almost-certainly-responsible-destructive-2017-cyber-attack) — UK NCSC, 2018-02-15
- [MITRE ATT&CK: NotPetya (S0368)](https://attack.mitre.org/software/S0368/) — MITRE, 2019-01-16
- [Microsoft: New Ransomware, Old Techniques — Petya Adds Worm Capabilities](https://www.microsoft.com/en-us/security/blog/2017/06/27/new-ransomware-old-techniques-petya-adds-worm-capabilities/) — Microsoft, 2017-06-27
