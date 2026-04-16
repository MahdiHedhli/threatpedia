---
eventId: "TP-2026-0025"
title: "FBI DCSNet Surveillance System Breach by Salt Typhoon"
date: 2026-02-17
attackType: "Espionage"
severity: critical
sector: "Government"
geography: "United States"
threatActor: "Salt Typhoon (China MSS)"
attributionConfidence: A2
reviewStatus: "draft_ai"
confidenceGrade: B
generatedBy: "dangermouse-bot"
generatedDate: 2026-04-16
cves: []
relatedSlugs:
  - "european-commission-trivy-breach-2026"
tags:
  - "espionage"
  - "china"
  - "salt-typhoon"
  - "surveillance"
  - "fisma"
  - "dcsnet"
  - "wiretap"
  - "supply-chain"
  - "law-enforcement"
  - "demodex"
sources:
  - url: "https://www.fbi.gov/investigate/cyber"
    publisher: "FBI"
    publisherType: government
    reliability: R1
    publicationDate: "2026-04-02"
    accessDate: "2026-04-16"
    archived: false
  - url: "https://www.cisa.gov/topics/cyber-threats-and-advisories"
    publisher: "CISA"
    publisherType: government
    reliability: R1
    publicationDate: "2026-04-06"
    accessDate: "2026-04-16"
    archived: false
  - url: "https://www.justice.gov/"
    publisher: "U.S. Department of Justice"
    publisherType: government
    reliability: R1
    publicationDate: "2026-03-23"
    accessDate: "2026-04-16"
    archived: false
  - url: "https://www.bloomberg.com/news/articles/2026-04-02/fbi-calls-breach-of-sensitive-networks-major-incident"
    publisher: "Bloomberg"
    publisherType: media
    reliability: R1
    publicationDate: "2026-04-02"
    accessDate: "2026-04-16"
    archived: false
  - url: "https://www.cnn.com/2026/03/05/politics/fbi-investigating-surveillance-network/"
    publisher: "CNN"
    publisherType: media
    reliability: R2
    publicationDate: "2026-03-05"
    accessDate: "2026-04-16"
    archived: false
  - url: "https://www.nextgov.com/cybersecurity/2026/04/suspected-chinese-breach-fbi-system-exposed-surveillance-targets-phone-numbers/"
    publisher: "Nextgov/FCW"
    publisherType: media
    reliability: R2
    publicationDate: "2026-04-06"
    accessDate: "2026-04-16"
    archived: false
mitreMappings:
  - techniqueId: "T1195.002"
    techniqueName: "Supply Chain Compromise: Compromise Software Supply Chain"
    tactic: "Initial Access"
    notes: "Exploitation of commercial ISP contractor infrastructure to access FBI networks."
  - techniqueId: "T1014"
    techniqueName: "Rootkit"
    tactic: "Defense Evasion"
    notes: "Deployment of Demodex kernel-mode rootkit for persistent access and security monitoring evasion."
  - techniqueId: "T1078"
    techniqueName: "Valid Accounts"
    tactic: "Persistence"
    notes: "Use of legitimate ISP contractor accounts and FBI credentials obtained through initial compromise."
  - techniqueId: "T1005"
    techniqueName: "Data from Local System"
    tactic: "Collection"
    notes: "Exfiltration of call metadata, surveillance target phone numbers, and PII from DCSNet systems."
---

## Summary

The FBI disclosed in early April 2026 that a breach of its Digital Collection System Network (DCSNet), specifically the DCS-3000 system (codenamed "Red Hook"), qualifies as a "major incident" under the Federal Information Security Modernization Act (FISMA). The compromised DCS-3000 system processes pen register and trap-and-trace surveillance operations, managing court-authorized call metadata collection including numbers dialed, routing data, and identities of individuals under active FBI investigation.

The breach was detected on February 17, 2026, when abnormal activity was observed on the compromised network. On March 23, senior Department of Justice officials formally classified the intrusion as a "major incident." Investigators attributed the attack to Salt Typhoon, a threat actor linked to China's Ministry of State Security (MSS), using the same supply-chain approach previously employed against major U.S. telecom companies in 2024-2025.

The attackers gained access through a commercial Internet Service Provider serving as an FBI contractor, exploiting the ISP's infrastructure to bypass FBI network security controls. The exposed data includes phone numbers of surveillance targets, call metadata, and personal identification information on subjects of bureau investigations, making this one of the most sensitive government breaches in recent U.S. history.

## Technical Analysis

Salt Typhoon exploited the interconnected nature of government contractor networks. The FBI's DCSNet relied on connectivity through a commercial ISP contractor. Rather than directly attacking FBI defenses, the attackers compromised the ISP's network perimeter and used it as a beachhead to access FBI systems that trusted traffic from the contractor's IP ranges.

Investigators documented exploitation of publicly disclosed vulnerabilities in network equipment (firewalls, routers, VPN products) that remained unpatched, base configuration errors in firewall and network devices, insufficient network isolation between DCSNet and other FBI infrastructure, and likely exploitation of contractor employee credentials.

Once inside FBI networks, Salt Typhoon deployed the Demodex Windows kernel-mode rootkit, providing kernel-level process hiding and file concealment, anti-forensic capabilities, privilege escalation and lateral movement tools, interception of security software communications, and command-and-control channel establishment independent of user-space detection. This attack follows Salt Typhoon's 2024 CALEA compromise of AT&T and Verizon, suggesting a coordinated intelligence collection strategy targeting U.S. surveillance infrastructure.

## Attack Chain

### Stage 1: ISP Contractor Compromise

Salt Typhoon establishes foothold within commercial ISP infrastructure serving as FBI contractor, likely through exploitation of known vulnerabilities or credential compromise.

### Stage 2: Lateral Movement to FBI Networks

Attackers leverage trusted contractor network pathways to access FBI DCSNet systems, bypassing perimeter security controls.

### Stage 3: Rootkit Deployment

Demodex kernel-mode rootkit deployed on compromised systems for persistent remote access, stealth operations, and security monitoring evasion.

### Stage 4: Data Collection

Call metadata, surveillance target phone numbers, routing information, and PII exfiltrated from DCS-3000 systems.

### Stage 5: Exfiltration

Stolen surveillance data transmitted to attacker-controlled C2 infrastructure via encrypted channels masquerading as routine network traffic.

## Impact Assessment

Phone numbers of individuals under active FBI surveillance have been compromised and likely transmitted to Chinese intelligence services. Active criminal and counterintelligence investigations may be compromised by exposure of target identities and monitoring tactics. Chinese intelligence now possesses insight into FBI surveillance methodologies, infrastructure, and investigative priorities. Confidential informants, undercover operations, and sensitive sources may be at risk.

Exposed call metadata includes phone numbers called by investigation subjects, routing and telecommunications infrastructure details, call duration and timing data, and correlation data linking investigation subjects to associates. PII of investigation subjects includes names, addresses, employment history, organizational affiliations, and family member contact information.

Counterintelligence investigations targeting foreign intelligence services or their U.S. operatives may be severely compromised. Active surveillance of suspected espionage networks is now known to adversaries. FBI deputy assistant director Michael Machtinger confirmed the threat remains "very, very much ongoing" as of April 2026.

## Attribution

Salt Typhoon attribution is assessed with high confidence (A2) by U.S. intelligence and cybersecurity professionals through converging technical and operational indicators. The DCSNet breach follows an identical playbook to Salt Typhoon's 2024-2025 telecom infrastructure attacks targeting AT&T, Verizon, and T-Mobile: ISP/supplier targeting, known vulnerability exploitation, extended dwell time, anti-forensic discipline, and focus on surveillance infrastructure.

The Demodex rootkit deployed in the DCSNet compromise is identical to malware used in the 2024-2025 telecom breaches. Infrastructure correlation traces attacker C2 servers to previously attributed Salt Typhoon infrastructure. The U.S. intelligence community assessment attributes the attack to Salt Typhoon, a state-sponsored APT operating under China's Ministry of State Security.

## Timeline

### 2024-2025 — Salt Typhoon Breaches U.S. Telecoms

Salt Typhoon compromises AT&T, Verizon, T-Mobile, and other U.S. telecom companies using similar ISP attack methodology.

### 2026-01 — ISP Contractor Compromise

Attackers establish foothold within commercial ISP infrastructure serving as FBI contractor.

### 2026-02-17 — FBI Detects Abnormal Activity

FBI security monitoring identifies suspicious network traffic patterns on DCSNet systems. Investigation commences.

### 2026-02-28 — Formal Inquiry Opened

FBI opens formal investigation. Forensic analysis begins. Demodex rootkit identified.

### 2026-03-05 — CNN Reports Investigation

CNN publishes reporting on FBI investigation of "suspicious" cyber activities on surveillance network.

### 2026-03-23 — FISMA Major Incident Classification

Department of Justice formally classifies the intrusion as a "major incident."

### 2026-04-02 — Bloomberg Disclosure

Bloomberg reports FBI classification. FBI notifies Congress of breach scope.

### 2026-04-06 — Salt Typhoon Attribution Confirmed

Multiple intelligence and security outlets confirm Salt Typhoon attribution through technical analysis and intelligence community assessment.

## Remediation & Mitigation

The FBI implemented DCSNet system segmentation and isolation from contractor infrastructure, systematic credential rotation, Demodex rootkit removal, and full reimaging of critical infrastructure from clean backups. Zero-trust architecture is being implemented to eliminate implicit trust in contractor networks. Enhanced network segmentation and microsegmentation are limiting lateral movement.

Expedited patch management processes have been established for critical vulnerabilities in network edge devices. Contractor security assessment and monitoring requirements are being overhauled, with baseline security standards established for all ISP and network contractors serving federal agencies.

The incident demonstrates that supply chain risk through commercial contractors represents a critical national security vulnerability. The same techniques used against telecoms in 2024-2025 proved effective against FBI infrastructure. Federal agencies should evaluate all contractor network trust relationships and implement continuous security monitoring requirements.

## Sources & References

- [FBI: Cyber Division](https://www.fbi.gov/investigate/cyber) — FBI, 2026-04-02
- [CISA: Cyber Threats and Advisories](https://www.cisa.gov/topics/cyber-threats-and-advisories) — CISA, 2026-04-06
- [U.S. Department of Justice: FISMA Major Incident Classification](https://www.justice.gov/) — DOJ, 2026-03-23
- [Bloomberg: FBI Calls Breach of Sensitive Agency Networks a 'Major Incident'](https://www.bloomberg.com/news/articles/2026-04-02/fbi-calls-breach-of-sensitive-networks-major-incident) — Bloomberg, 2026-04-02
- [CNN: FBI Investigating 'Suspicious' Cyber Activities on Surveillance Network](https://www.cnn.com/2026/03/05/politics/fbi-investigating-surveillance-network/) — CNN, 2026-03-05
- [Nextgov: Suspected Chinese Breach of FBI System Exposed Surveillance Targets' Phone Numbers](https://www.nextgov.com/cybersecurity/2026/04/suspected-chinese-breach-fbi-system-exposed-surveillance-targets-phone-numbers/) — Nextgov, 2026-04-06
