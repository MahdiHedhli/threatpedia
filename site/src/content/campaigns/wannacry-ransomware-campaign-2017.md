---
campaignId: "TP-CAMP-2017-0001"
title: "WannaCry Ransomware Campaign: Global Lazarus Group Worm Operation (2017)"
startDate: 2017-05-12
endDate: 2017-05-15
ongoing: false
attackType: "Ransomware / Self-Propagating Worm via SMB Exploitation"
severity: critical
sector: "Multi-sector — Healthcare, Government, Telecommunications, Transportation, Finance"
geography: "Global"
threatActor: "Lazarus Group"
attributionConfidence: A3
reviewStatus: "draft_ai"
confidenceGrade: B
generatedBy: "new-threat-intel-automation"
generatedDate: 2026-05-06
cves:
  - "CVE-2017-0144"
  - "CVE-2017-0145"
relatedIncidents:
  - "wannacry-ransomware-2017"
tags:
  - "wannacry"
  - "wannacrypt"
  - "ransomware"
  - "lazarus-group"
  - "north-korea"
  - "eternalblue"
  - "ms17-010"
  - "smb"
  - "nhs"
  - "worm"
sources:
  - url: "https://www.justice.gov/opa/pr/north-korean-regime-backed-programmer-charged-conspiracy-conduct-multiple-cyber-attacks-and"
    publisher: "U.S. Department of Justice"
    publisherType: government
    reliability: R1
    publicationDate: "2018-09-06"
    accessDate: "2026-05-06"
    archived: false
  - url: "https://www.ncsc.gov.uk/news/uk-and-key-allies-say-north-korea-behind-wannacry-attack"
    publisher: "UK NCSC"
    publisherType: government
    reliability: R1
    publicationDate: "2017-12-19"
    accessDate: "2026-05-06"
    archived: false
  - url: "https://www.cisa.gov/news-events/alerts/2017/05/12/indicators-associated-wannacry-ransomware"
    publisher: "CISA"
    publisherType: government
    reliability: R1
    publicationDate: "2017-05-12"
    accessDate: "2026-05-06"
    archived: false
mitreMappings:
  - techniqueId: "T1190"
    techniqueName: "Exploit Public-Facing Application"
    tactic: "Initial Access"
    notes: "WannaCry leveraged the EternalBlue exploit (CVE-2017-0144) targeting the SMBv1 protocol on exposed Windows systems to gain initial foothold without user interaction."
  - techniqueId: "T1210"
    techniqueName: "Exploitation of Remote Services"
    tactic: "Lateral Movement"
    notes: "After gaining access, WannaCry used EternalBlue and the DoublePulsar backdoor implant to propagate laterally across internal networks by exploiting SMBv1 on reachable hosts."
  - techniqueId: "T1486"
    techniqueName: "Data Encrypted for Impact"
    tactic: "Impact"
    notes: "WannaCry encrypted user files across infected systems and presented ransom demands denominated in Bitcoin, with a stated deadline for payment before ransom amounts escalated."
  - techniqueId: "T1059.003"
    techniqueName: "Command and Scripting Interpreter: Windows Command Shell"
    tactic: "Execution"
    notes: "The DoublePulsar kernel implant installed by EternalBlue executed WannaCry payloads via Windows command shell mechanisms on compromised hosts."
---

## Executive Summary

WannaCry was a ransomware campaign that began on 2017-05-12 and spread globally within hours, exploiting a vulnerability in the Windows SMBv1 protocol to propagate as a self-replicating worm. The campaign caused disruption to critical infrastructure across multiple sectors, with the UK National Health Service among the most publicly documented victims. The UK National Cyber Security Centre (NCSC), in coordination with allied governments, publicly attributed WannaCry to North Korea in December 2017. The U.S. Department of Justice filed criminal charges in September 2018 against a North Korean national identified as associated with the Lazarus Group, a threat actor assessed to operate on behalf of the North Korean government.

The campaign exploited CVE-2017-0144 and CVE-2017-0145 using the EternalBlue exploit and the DoublePulsar backdoor to infect systems running unpatched SMBv1. A kill switch embedded in the malware was identified by a security researcher on 2017-05-12, which limited the spread of the primary variant. The campaign is operationally distinct from the NotPetya destructive wiper operation, which used overlapping EternalBlue infrastructure but is attributed to a different actor and had a different objective.

## Technical Analysis

WannaCry propagated through exploitation of CVE-2017-0144, a critical vulnerability in the Windows SMBv1 implementation. The exploit, publicly known as EternalBlue, allowed unauthenticated remote code execution on exposed Windows systems. WannaCry scanned for reachable hosts on TCP port 445 and attempted exploitation without requiring any user interaction on target systems.

Upon successful exploitation, WannaCry installed the DoublePulsar kernel-level backdoor implant, which was then used to inject and execute the WannaCry ransomware payload. The payload encrypted files matching a defined list of extensions across accessible drives and network shares. Victims were presented with a ransom demand denominated in Bitcoin, with a stated deadline after which the demanded amount would increase with a threat that files would be permanently deleted.

The malware included a kill switch mechanism: on execution, it queried an unregistered domain. If the domain resolved, the malware exited without proceeding. On 2017-05-12, a security researcher registered the queried domain, which caused subsequently executed instances of the primary WannaCry variant to halt. Existing infections that had already completed the propagation and encryption cycle were not affected by the kill switch registration.

Attribution of WannaCry to the Lazarus Group is based on the NCSC's December 2017 joint advisory with allied partners and the DOJ's September 2018 criminal complaint against Park Jin Hyok, who was charged with conspiracy to conduct destructive cyberattacks and fraud on behalf of the North Korean government.

## Attack Chain

### Stage 1: External SMB Scanning and Exploit Delivery

WannaCry scanned the public internet and internal networks for hosts exposing TCP port 445. On reachable hosts running unpatched SMBv1, the malware used the EternalBlue exploit to trigger CVE-2017-0144 without requiring any credentials or user interaction.

### Stage 2: DoublePulsar Kernel Backdoor Installation

Following successful EternalBlue exploitation, WannaCry installed the DoublePulsar backdoor at the kernel level. DoublePulsar provided a channel for injecting arbitrary code into running processes on the compromised host.

### Stage 3: Ransomware Payload Execution

Using DoublePulsar, WannaCry injected and executed its ransomware payload via Windows command shell mechanisms. The payload scanned accessible local drives and network shares for files matching a defined set of extensions and encrypted them using asymmetric cryptography.

### Stage 4: Ransom Demand Presentation

Encrypted systems displayed a ransom demand note requesting payment in Bitcoin. The note presented a deadline and stated that the demanded amount would increase after a set interval and that files would be deleted after a second interval.

### Stage 5: Lateral Propagation

Concurrently with the encryption and ransom phases, WannaCry continued scanning reachable network ranges for additional SMBv1-exposed hosts, repeating the exploitation and payload delivery cycle to propagate across local networks and internet-exposed systems.

## MITRE ATT&CK Mapping

### Initial Access

T1190 - Exploit Public-Facing Application: WannaCry used the EternalBlue exploit targeting CVE-2017-0144 in the Windows SMBv1 protocol to achieve unauthenticated remote code execution on vulnerable systems exposed to network access, with no user interaction required.

### Execution

T1059.003 - Command and Scripting Interpreter: Windows Command Shell: The DoublePulsar kernel implant facilitated execution of the WannaCry ransomware payload via Windows command shell mechanisms on compromised hosts.

### Lateral Movement

T1210 - Exploitation of Remote Services: WannaCry propagated laterally within internal networks by scanning reachable hosts for SMBv1 exposure and reapplying the EternalBlue/DoublePulsar exploitation chain without requiring credentials or user interaction on target systems.

### Impact

T1486 - Data Encrypted for Impact: WannaCry encrypted user files on infected systems and presented ransom demands denominated in Bitcoin. The encryption rendered affected files inaccessible pending ransom payment or recovery from backup.

## Timeline

### 2017-03-14 — Microsoft Issues Critical Patch for CVE-2017-0144

Microsoft released Security Bulletin MS17-010 addressing CVE-2017-0144 and related SMBv1 vulnerabilities in Windows. Systems that applied the patch before the WannaCry campaign began were not vulnerable to EternalBlue-based exploitation.

### 2017-04-14 — EternalBlue Published

A group publicly released a collection of exploits including EternalBlue and DoublePulsar, which exploited the SMBv1 vulnerabilities that MS17-010 had patched. This public release made the exploitation tools publicly available.

### 2017-05-12 — WannaCry Campaign Begins

WannaCry began spreading globally, exploiting unpatched Windows systems via EternalBlue. CISA published indicators of compromise on the same day. UK NHS trusts began reporting system unavailability. A security researcher identified and registered the kill switch domain embedded in the primary WannaCry variant, limiting subsequent spread of that variant.

### 2017-05-15 — Primary Spread Subsides

The rate of new WannaCry infections declined following kill switch registration and emergency patching efforts. CISA and partner agencies continued issuing guidance for affected organizations.

### 2017-12-19 — Five Eyes Attribution to North Korea

The UK NCSC issued a public statement attributing WannaCry to North Korea, stating that the UK and key allies assessed with high confidence that North Korea was responsible for the WannaCry attack. Partner governments including the United States, Canada, Australia, and New Zealand issued coordinated attribution statements.

### 2018-09-06 — DOJ Criminal Complaint Filed

The U.S. Department of Justice filed a criminal complaint against Park Jin Hyok, a North Korean national, charging him with conspiracy to conduct multiple destructive cyberattacks and financial crimes. The complaint identified Park as an operative of the Lazarus Group working on behalf of the North Korean government and cited WannaCry among the attacks attributed to him.

## Remediation & Mitigation

Organizations should apply Microsoft Security Bulletin MS17-010 to all Windows systems that have not already received this patch. Any system still running SMBv1 and exposed to network access without this patch applied remains vulnerable to EternalBlue-based exploitation.

Disable SMBv1 on all Windows systems where it is not operationally required. SMBv1 is a legacy protocol with no security features present in SMBv2 and SMBv3. Restricting or disabling SMBv1 eliminates the attack surface exploited by EternalBlue.

Implement network segmentation to limit the ability of worm-style propagation to traverse between network zones. WannaCry exploited the ability to reach arbitrary hosts on TCP port 445. Firewall rules blocking inbound SMB from untrusted network zones and between endpoint segments reduce propagation risk.

Apply a regular, tested backup discipline with offline or otherwise isolated backup copies. Ransomware that encrypts accessible drives and mapped network shares cannot reach offline backup media. Verify that backup restoration procedures are tested and documented.

Review CISA Alert indicators for WannaCry for additional indicators, detection guidance, and mitigation actions specific to WannaCry-style SMB exploitation campaigns. Organizations in healthcare and other critical infrastructure sectors should review sector-specific CISA advisories for additional guidance relevant to their environments.

## Sources & References

- [U.S. Department of Justice: North Korean Regime-Backed Programmer Charged in Conspiracy to Conduct Multiple Cyber Attacks and Intrusions](https://www.justice.gov/opa/pr/north-korean-regime-backed-programmer-charged-conspiracy-conduct-multiple-cyber-attacks-and) — U.S. Department of Justice, 2018-09-06
- [UK NCSC: UK and Key Allies Say North Korea Behind WannaCry Attack](https://www.ncsc.gov.uk/news/uk-and-key-allies-say-north-korea-behind-wannacry-attack) — UK NCSC, 2017-12-19
- [CISA: Indicators Associated with WannaCry Ransomware](https://www.cisa.gov/news-events/alerts/2017/05/12/indicators-associated-wannacry-ransomware) — CISA, 2017-05-12
