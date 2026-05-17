---
eventId: TP-2016-0003
title: Bangladesh Bank SWIFT Heist
date: 2016-02-04
attackType: Financial Theft
severity: critical
sector: Financial Services
geography: Bangladesh
threatActor: Lazarus Group / APT38
attributionConfidence: A1
reviewStatus: draft_ai
confidenceGrade: A
generatedBy: kernel-k
generatedDate: 2026-05-17
cves: []
relatedSlugs:
  - apt38
  - lazarus-group
tags:
  - bangladesh-bank
  - swift
  - financial-theft
  - north-korea
  - lazarus-group
  - apt38
  - interbank-payments
  - spearphishing
sources:
  - url: https://www.justice.gov/archives/opa/pr/north-korean-regime-backed-programmer-charged-conspiracy-conduct-multiple-cyber-attacks-and
    publisher: U.S. Department of Justice
    publisherType: government
    reliability: R1
    publicationDate: "2018-09-06"
    accessDate: "2026-05-17"
    archived: false
  - url: https://www.justice.gov/usao-cdca/press-release/file/1091951/dl
    publisher: U.S. Department of Justice
    publisherType: government
    reliability: R1
    publicationDate: "2018-06-08"
    accessDate: "2026-05-17"
    archived: false
  - url: https://www.newyorkfed.org/newsevents/statements/2016/0623-2016
    publisher: Federal Reserve Bank of New York
    publisherType: government
    reliability: R1
    publicationDate: "2016-06-23"
    accessDate: "2026-05-17"
    archived: false
  - url: https://www.baesystems.com/en-uk/insight/two-bytes-to-951m
    publisher: BAE Systems
    publisherType: vendor
    reliability: R1
    publicationDate: "2016-04-26"
    accessDate: "2026-05-17"
    archived: false
  - url: https://www.swift.com/news-events/press-releases/swift-launches-customer-security-programme-reinforce-security-global-banking-system
    publisher: SWIFT
    publisherType: vendor
    reliability: R1
    publicationDate: "2016-05-27"
    accessDate: "2026-05-17"
    archived: false
  - url: https://attack.mitre.org/groups/G0082/
    publisher: MITRE ATT&CK
    publisherType: research
    reliability: R1
    publicationDate: "2026-05-17"
    accessDate: "2026-05-17"
    archived: false
mitreMappings:
  - techniqueId: T1566.001
    techniqueName: Spearphishing Attachment
    tactic: Initial Access
    attackVersion: "v19"
    confidence: confirmed
    evidence: The DOJ complaint describes spear-phishing messages sent to Bangladesh Bank employees and forensic evidence that payload links were downloaded inside the bank.
  - techniqueId: T1105
    techniqueName: Ingress Tool Transfer
    tactic: Command and Control
    attackVersion: "v19"
    confidence: probable
    evidence: The DOJ complaint describes a backdoor in the Bangladesh Bank network that could transfer files, create archives, and execute files.
  - techniqueId: T1565.001
    techniqueName: Stored Data Manipulation
    tactic: Impact
    attackVersion: "v19"
    confidence: probable
    evidence: BAE Systems described malware built to interact with local SWIFT Alliance Access software and help cover fraudulent payment activity.
  - techniqueId: T1565.002
    techniqueName: Transmitted Data Manipulation
    tactic: Impact
    attackVersion: "v19"
    confidence: probable
    evidence: DOJ reporting described fraudulently authenticated SWIFT messages directing transfer activity through the New York Fed account.
  - techniqueId: T1657
    techniqueName: Financial Theft
    tactic: Impact
    attackVersion: "v19"
    confidence: confirmed
    evidence: DOJ and MITRE ATT&CK both describe the Bangladesh Bank operation as an $81 million theft tied to North Korean financial operations.
---

## Summary

The Bangladesh Bank SWIFT heist was a February 2016 intrusion and fraudulent-transfer operation against Bangladesh Bank, the central bank of Bangladesh. The operators compromised the bank's network, accessed computer terminals connected to its SWIFT processing environment, and sent authenticated-looking payment messages that directed funds from Bangladesh Bank's account at the Federal Reserve Bank of New York to accounts in Asia.

The attempted theft totaled $951 million. Most requested transfers were blocked or later recovered, but $81 million was stolen. The event became a reference case for cyber-enabled financial theft because the operators combined bank-network compromise, knowledge of interbank payment operations, and tooling designed to interfere with local SWIFT records.

The New York Fed stated in June 2016 that the incident was not caused by a breach or compromise of its systems. SWIFT separately stated in May 2016 that its network, software, and core messaging services had not been compromised, while announcing a customer security program focused on customer-managed SWIFT environments.

## Technical Analysis

The public technical record describes an intrusion into Bangladesh Bank rather than a compromise of SWIFT's central network or the New York Fed. DOJ reporting says the operators compromised Bangladesh Bank's network with spear-phishing emails, accessed terminals that interfaced with SWIFT, and then sent fraudulent SWIFT messages directing transfers from the bank's New York Fed account.

The DOJ criminal complaint describes activity that began before the February 2016 transfers. It says spear-phishing links were sent to Bangladesh Bank employees in 2015 and that forensic analysis later found downloads from those payload links. The same complaint describes a backdoor in the bank network that communicated through a protocol designed to resemble TLS traffic, could transfer files, create zip archives, and execute files, and was assessed as sharing traits with Lazarus Group malware.

Before the fraudulent transfer messages were sent, the operators moved laterally toward Bangladesh Bank's SWIFTLIVE system. The complaint describes that system as the core component of the bank's SWIFT processing environment, using SWIFT Alliance Access to transmit and receive financial messages while retaining local copies and print or database records.

BAE Systems identified malware linked to the heist that interacted with local SWIFT Alliance Access software. Its analysis described tooling intended to cover the operators' tracks as forged payment instructions were sent, delaying detection and giving more time for laundering activity after transfers left the victim account.

## Attack Chain

### Stage 1: Targeted Spear-Phishing

The operators sent spear-phishing messages to Bangladesh-based bank employees. The DOJ complaint later tied payload downloads inside Bangladesh Bank to links used in those messages.

### Stage 2: Internal Access and Backdoor Deployment

Forensic analysis described in the DOJ complaint found follow-on movement inside the Bangladesh Bank network and a backdoor that used a FakeTLS-like communication protocol. The malware could transfer files, create archives, and execute files.

### Stage 3: Movement Toward SWIFT Processing

The operators moved from compromised systems toward the bank's SWIFTLIVE system, which handled SWIFT Alliance Access operations for payment-message processing.

### Stage 4: Fraudulent Payment Messages

The operators sent fraudulently authenticated SWIFT messages that instructed the Federal Reserve Bank of New York to transfer funds from Bangladesh Bank's account to recipient accounts in Asia.

### Stage 5: Record Interference and Laundering Window

BAE Systems described local malware designed to interact with SWIFT Alliance Access software and help hide fraudulent activity. That interference likely reduced the chance of immediate detection while money movement and laundering activity proceeded.

## Impact Assessment

The attempted theft was $951 million, with $81 million stolen. The financial loss, the attempted scale, and the targeting of a central bank made the incident a benchmark for cyber-enabled attacks against payment operations.

The operational impact extended beyond Bangladesh Bank. The incident exposed how a compromise of a customer's local banking environment could be used to submit payment messages through legitimate interbank workflows. It also created pressure on banks, payment operators, and central-bank service providers to reassess monitoring, authentication, reconciliation, and incident-response controls around high-value payment systems.

SWIFT's May 2016 customer security program response focused on customer-controlled infrastructure. SWIFT said fraudulent payment cases had occurred in customer local environments and that its network, software, and core messaging services had not been compromised.

## Attribution

The strongest public attribution comes from the U.S. Department of Justice. In September 2018, DOJ unsealed charges against Park Jin Hyok and described him as part of a North Korean government-sponsored hacking team known publicly as Lazarus Group. DOJ identified the Bangladesh Bank theft as one of the conspiracy's operations.

The DOJ complaint linked the Bangladesh Bank activity to Lazarus Group through spear-phishing infrastructure, malware traits, North Korean IP address use, related accounts, and overlaps with other intrusions. MITRE ATT&CK tracks the financial-operations cluster as APT38, a North Korean state-sponsored group associated with the Reconnaissance General Bureau, and lists the 2016 Bank of Bangladesh heist among its operations.

North Korean group labels overlap in public reporting. For this incident, Lazarus Group is the umbrella attribution used in DOJ charging material, while APT38/Bluenoroff is the more specific financial-theft cluster used by MITRE and many industry sources.

## Timeline

### 2015-01-29 to 2015-02-24 — Payload Downloads Observed

The DOJ complaint says at least three Bangladesh Bank computers attempted to download files from links associated with spear-phishing messages during this period.

### 2015-03 — Backdoor Activity Identified

Forensic analysis described in the DOJ complaint found that the operators had moved within Bangladesh Bank's network and saved a backdoor that communicated through a FakeTLS-like protocol.

### 2016-01-29 — Movement Toward SWIFTLIVE

The DOJ complaint says the operators engaged in lateral movement shortly before the fraudulent transfers, including movement to Bangladesh Bank's SWIFTLIVE system.

### 2016-02 — Fraudulent Transfer Operation

The operators sent fraudulent SWIFT payment messages. DOJ later stated that $81 million was stolen from Bangladesh Bank in February 2016.

### 2016-04-26 — BAE Systems Publishes Malware Analysis

BAE Systems published analysis of malware linked to the heist and described tooling that interacted with local SWIFT Alliance Access software.

### 2016-05-27 — SWIFT Announces Customer Security Program

SWIFT announced a customer security program to strengthen security across the financial community and customer-managed SWIFT infrastructure.

### 2016-06-23 — New York Fed Issues Statement

The New York Fed stated that the Bangladesh Bank incident was not caused by a breach or compromise of New York Fed systems and described additional monitoring and broader payment-system security work.

### 2018-09-06 — DOJ Unseals North Korea-Linked Charges

DOJ announced charges against Park Jin Hyok and tied the Bangladesh Bank theft to the same North Korean conspiracy associated with Lazarus Group.

## Remediation & Mitigation

The heist reinforced that payment security depends on both central messaging networks and local customer environments. SWIFT's response emphasized baseline security requirements for customer-managed SWIFT infrastructure, expanded information sharing, stronger security requirements for customer software, and additional protection and detection mechanisms.

Banks operating SWIFT-connected environments should segment payment systems from general user networks, enforce phishing-resistant authentication for payment operators and administrators, monitor for unusual SWIFT message creation or printing behavior, and reconcile outgoing messages against independent business approvals. Logging and monitoring should cover local SWIFT Alliance Access hosts, surrounding databases, file shares, printers, privileged sessions, and outbound command-and-control paths.

Incident response should include procedures for rapidly validating pending payment messages, contacting correspondent banks and central-bank service providers, preserving local SWIFT logs, and coordinating with law enforcement before attackers can erase records or move funds through laundering channels.

## Sources & References

- [U.S. Department of Justice: North Korean Regime-Backed Programmer Charged With Conspiracy to Conduct Multiple Cyber Attacks and Intrusions](https://www.justice.gov/archives/opa/pr/north-korean-regime-backed-programmer-charged-conspiracy-conduct-multiple-cyber-attacks-and) — U.S. Department of Justice, 2018-09-06
- [U.S. Department of Justice: Criminal Complaint Against Park Jin Hyok](https://www.justice.gov/usao-cdca/press-release/file/1091951/dl) — U.S. Department of Justice, 2018-06-08
- [Federal Reserve Bank of New York: Statement Regarding Cyber Efforts](https://www.newyorkfed.org/newsevents/statements/2016/0623-2016) — Federal Reserve Bank of New York, 2016-06-23
- [BAE Systems: Two bytes to $951m](https://www.baesystems.com/en-uk/insight/two-bytes-to-951m) — BAE Systems, 2016-04-26
- [SWIFT: Swift launches customer security programme to reinforce the security of the global banking system](https://www.swift.com/news-events/press-releases/swift-launches-customer-security-programme-reinforce-security-global-banking-system) — SWIFT, 2016-05-27
- [MITRE ATT&CK: APT38](https://attack.mitre.org/groups/G0082/) — MITRE ATT&CK, 2026-05-17
