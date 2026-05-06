---
campaignId: "TP-CAMP-2017-0002"
title: "NotPetya Destructive Campaign: Sandworm Global Wiper Operation (2017)"
startDate: 2017-06-27
endDate: 2017-06-28
ongoing: false
attackType: "Destructive Wiper / Supply Chain Compromise"
severity: critical
sector: "Multi-sector — Finance, Shipping, Pharmaceutical, Energy, Government"
geography: "Global — primary targeting Ukraine; secondary collateral impact worldwide"
threatActor: "Sandworm"
attributionConfidence: A1
reviewStatus: "draft_ai"
confidenceGrade: A
generatedBy: "new-threat-intel-automation"
generatedDate: 2026-05-06
cves:
  - "CVE-2017-0144"
  - "CVE-2017-0145"
relatedIncidents:
  - "notpetya-wiper-attack-2017"
tags:
  - "notpetya"
  - "sandworm"
  - "gru"
  - "russia"
  - "wiper"
  - "supply-chain"
  - "medoc"
  - "eternalblue"
  - "ukraine"
  - "destructive"
sources:
  - url: "https://www.justice.gov/opa/pr/six-russian-gru-officers-charged-connection-worldwide-deployment-destructive-malware-and"
    publisher: "U.S. Department of Justice"
    publisherType: government
    reliability: R1
    publicationDate: "2020-10-19"
    accessDate: "2026-05-06"
    archived: false
  - url: "https://www.ncsc.gov.uk/news/russian-military-almost-certainly-responsible-destructive-2017-cyber-attack"
    publisher: "UK NCSC"
    publisherType: government
    reliability: R1
    publicationDate: "2018-02-15"
    accessDate: "2026-05-06"
    archived: false
  - url: "https://www.cisa.gov/news-events/alerts/2017/07/01/petya-ransomware"
    publisher: "CISA"
    publisherType: government
    reliability: R1
    publicationDate: "2017-07-01"
    accessDate: "2026-05-06"
    archived: false
mitreMappings:
  - techniqueId: "T1195.002"
    techniqueName: "Supply Chain Compromise: Compromise Software Supply Chain"
    tactic: "Initial Access"
    notes: "Sandworm compromised the M.E.Doc software update infrastructure to distribute the NotPetya wiper to organizations that had installed the legitimate Ukrainian accounting software."
  - techniqueId: "T1210"
    techniqueName: "Exploitation of Remote Services"
    tactic: "Lateral Movement"
    notes: "NotPetya used the EternalBlue (CVE-2017-0144) and EternalRomance (CVE-2017-0145) exploits to spread laterally across internal networks by targeting unpatched SMBv1 on reachable hosts."
  - techniqueId: "T1003.001"
    techniqueName: "OS Credential Dumping: LSASS Memory"
    tactic: "Credential Access"
    notes: "NotPetya included a modified Mimikatz component to extract credentials from LSASS memory, enabling lateral movement to hosts that had applied the MS17-010 patch and were not vulnerable to EternalBlue."
  - techniqueId: "T1485"
    techniqueName: "Data Destruction"
    tactic: "Impact"
    notes: "NotPetya overwrote the Master Boot Record and encrypted the Master File Table with a key that was discarded, making recovery cryptographically impossible regardless of ransom payment. The ransom demand UI was a decoy; the operation was destructive by design."
---

## Executive Summary

NotPetya was a destructive wiper campaign deployed on 2017-06-27 by Sandworm, a threat actor assessed by the U.S. Department of Justice and multiple allied governments to be GRU Unit 74455, operating on behalf of the Russian Federation. The operation used a compromised software update channel for M.E.Doc, a Ukrainian accounting application, as the initial distribution vector. After gaining access through the M.E.Doc update, the malware spread laterally using the EternalBlue and EternalRomance SMBv1 exploits and a credential harvesting component, enabling propagation to organizations that had applied the MS17-010 patch.

The operation caused disruption across multiple sectors globally. Confirmed disclosed financial impacts include figures from Maersk, Merck, FedEx's TNT Express subsidiary, and Mondelez International. Although NotPetya presented a ransom demand interface, cryptographic analysis confirmed the encryption was irreversible by design, establishing the operation as a destructive wiper rather than a ransomware campaign.

The UK NCSC attributed the attack to the Russian military in February 2018 in a coordinated statement with allied governments. The U.S. Department of Justice unsealed charges in October 2020 against six named GRU Unit 74455 officers for their roles in NotPetya and related destructive operations. This campaign is operationally and attributionally distinct from the WannaCry ransomware campaign that occurred approximately six weeks earlier: NotPetya is attributed to Sandworm (GRU Unit 74455), used a software supply chain delivery mechanism, and was designed for destruction; WannaCry is attributed to Lazarus Group (assessed as operating on behalf of the Democratic People's Republic of Korea) and used an autonomous worm propagation mechanism without a supply chain component.

## Technical Analysis

NotPetya's delivery chain began with a compromise of the update infrastructure for M.E.Doc, an accounting software product used by Ukrainian organizations for tax compliance. The attacker obtained access to the M.E.Doc update distribution server and modified the update process to deliver a trojanized DLL alongside legitimate software updates. Organizations running M.E.Doc received the malicious component through the normal software update channel, bypassing perimeter controls because the delivery was through a trusted software vendor.

Upon execution, the malicious DLL dropped and ran the NotPetya worm, which used three parallel lateral movement mechanisms. The first used EternalBlue (CVE-2017-0144) and EternalRomance (CVE-2017-0145) to exploit unpatched SMBv1 on reachable hosts, achieving unauthenticated remote code execution. The second used a Mimikatz-derived component to extract credentials from LSASS memory, enabling propagation via Windows Management Instrumentation and PsExec to hosts that had applied the MS17-010 patch and were not vulnerable to the SMB exploits. The third used WMIC for remote execution against hosts reachable through administrative shares.

The destructive payload targeted the Master Boot Record and the Master File Table. The MBR was overwritten with a custom bootloader that displayed a ransom demand on the next system start. The MFT was encrypted with a 128-bit AES key that was generated per-machine and immediately discarded, rendering file recovery cryptographically impossible. The ransom demand displayed a Bitcoin wallet address; no functional decryption capability existed regardless of payment.

The multi-vector lateral movement design meant that both unpatched and patched network segments were reachable: organizations that had applied MS17-010 remained vulnerable to the credential-based propagation component. Ukrainian organizations with M.E.Doc installations served as the initial entry points; lateral movement from those entry points propagated the malware to the international networks of multinational corporations with Ukrainian subsidiaries or business connections.

## Attack Chain

### Stage 1: Supply Chain Compromise of M.E.Doc Update Infrastructure

Sandworm obtained access to the M.E.Doc update distribution server and modified the update delivery process to include a malicious DLL alongside legitimate software updates. Organizations running M.E.Doc received the trojanized component through the normal software update channel.

### Stage 2: Initial Execution and Credential Harvesting

On execution, the malicious DLL dropped and ran the NotPetya worm. The malware enumerated the local network and harvested credentials from LSASS memory using a Mimikatz-derived component, identifying targets for credential-based lateral movement in addition to SMB exploit targets.

### Stage 3: Lateral Movement via SMB Exploitation and Credential Reuse

NotPetya propagated using three parallel mechanisms: EternalBlue and EternalRomance SMBv1 exploits for unpatched hosts; credential-based propagation via WMIC and PsExec to patched hosts; and token impersonation using harvested credentials. This combination allowed the malware to traverse both unpatched and patched network segments.

### Stage 4: Destructive Payload Execution

Upon reaching a host with administrative access, NotPetya scheduled a system reboot and executed the destructive payload prior to the reboot. The payload overwrote the MBR with a custom bootloader and encrypted the MFT with a per-machine AES key that was immediately discarded.

### Stage 5: Reboot and Ransom Demand Display

On reboot, the custom MBR bootloader displayed a screen resembling a ransom demand, requesting approximately $300 in Bitcoin. The displayed wallet address was non-operational and no decryption key existed; recovery was not possible regardless of payment.

## MITRE ATT&CK Mapping

### Initial Access

T1195.002 - Supply Chain Compromise: Compromise Software Supply Chain: Sandworm compromised the M.E.Doc update infrastructure to distribute the NotPetya wiper to organizations that had installed the legitimate Ukrainian accounting software and received the trojanized update.

### Credential Access

T1003.001 - OS Credential Dumping: LSASS Memory: NotPetya included a Mimikatz-derived component that extracted credentials from LSASS memory. Harvested credentials were used for lateral movement to hosts not vulnerable to EternalBlue, enabling propagation across patched network segments.

### Lateral Movement

T1210 - Exploitation of Remote Services: NotPetya used EternalBlue (CVE-2017-0144) and EternalRomance (CVE-2017-0145) to exploit unpatched SMBv1 on reachable hosts, achieving unauthenticated remote code execution for lateral propagation.

T1021.006 - Remote Services: Windows Remote Management: NotPetya used WMIC and PsExec with harvested credentials to execute the malware payload on reachable hosts via administrative shares, enabling propagation to hosts that had applied MS17-010.

### Impact

T1485 - Data Destruction: NotPetya overwrote the Master Boot Record and encrypted the Master File Table using a discarded key, rendering affected systems unrecoverable. The ransom demand interface was non-functional; the operation was destructive by design.

## Timeline

### 2017-04-14 — EternalBlue and EternalRomance Published

A group publicly released a collection of exploits including EternalBlue and EternalRomance, making the SMB exploitation tools publicly available. These tools were subsequently incorporated into NotPetya's lateral movement component.

### 2017-06-27 — NotPetya Deployment via M.E.Doc Update

The compromised M.E.Doc update was distributed, triggering the initial wave of infections across Ukrainian organizations. Within hours, the malware propagated to multinational corporations through lateral movement from Ukrainian entry points. CISA published an alert on indicators associated with the attack on the same day.

### 2017-06-28 — Primary Spread Subsides

Primary propagation activity declined. Security researchers confirmed the malware's MBR and MFT overwrite operations were designed without a viable recovery path, classifying the malware as a wiper.

### 2017-07-04 — M.E.Doc Servers Seized by Ukrainian Cyber Police

Ukrainian authorities seized M.E.Doc's servers as part of a criminal investigation and confirmed the update infrastructure had been compromised to distribute the malware.

### 2018-02-15 — UK NCSC and Allied Governments Attribute NotPetya to Russian Military

The UK NCSC issued a public attribution statement assessing with high confidence that the Russian military was responsible for the NotPetya attack. The statement was coordinated with the United States, Australia, Canada, and the European Union.

### 2020-10-19 — DOJ Indicts Six GRU Unit 74455 Officers

The U.S. Department of Justice unsealed a grand jury indictment charging six named GRU Unit 74455 officers — Yuriy Sergeyevich Andrienko, Sergey Vladimirovich Detistov, Pavel Valeryevich Frolov, Anatoliy Sergeyevich Kovalev, Artem Valeryevich Ochichenko, and Petr Nikolayevich Pliskin — for their roles in NotPetya and related destructive operations.

## Remediation & Mitigation

Applying Microsoft Security Bulletin MS17-010 eliminates the EternalBlue and EternalRomance SMBv1 exploitation vectors used for lateral movement. Organizations should also disable SMBv1 on all systems where it is not operationally required.

Implementing supply chain security controls reduces exposure to software update compromise: validating the integrity and authenticity of software updates before deployment, monitoring for anomalous behavior in update processes, and maintaining the ability to isolate or roll back updates can limit the blast radius of supply chain attacks.

Credential hygiene measures reduce the effectiveness of the credential-based lateral movement component: disabling WDigest authentication prevents plaintext credential storage in LSASS memory; deploying Local Administrator Password Solution (LAPS) ensures unique local administrator passwords per host; and restricting WMIC and PsExec execution via endpoint controls limits the remote execution techniques used by NotPetya.

Network segmentation limits the propagation of worm-style lateral movement. Firewall rules blocking inbound SMB from untrusted network zones and between endpoint segments reduce the reach of EternalBlue-based propagation. Isolating operational technology and critical infrastructure networks from corporate IT networks limits cross-environment propagation.

Maintaining offline, immutable backups with tested restoration procedures is essential for recovery from destructive operations. NotPetya's MBR and MFT overwrite made encrypted files unrecoverable; organizations without offline backups faced complete system rebuilds.

## Sources & References

- [U.S. Department of Justice: Six Russian GRU Officers Charged in Connection with Worldwide Deployment of Destructive Malware](https://www.justice.gov/opa/pr/six-russian-gru-officers-charged-connection-worldwide-deployment-destructive-malware-and) — U.S. Department of Justice, 2020-10-19
- [UK NCSC: Russian Military Almost Certainly Responsible for Destructive 2017 Cyber Attack](https://www.ncsc.gov.uk/news/russian-military-almost-certainly-responsible-destructive-2017-cyber-attack) — UK NCSC, 2018-02-15
- [CISA: Petya Ransomware Alert](https://www.cisa.gov/news-events/alerts/2017/07/01/petya-ransomware) — CISA, 2017-07-01
