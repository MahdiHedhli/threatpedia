---
eventId: TP-2023-0002
title: 3CX DesktopApp Software Supply Chain Compromise
date: 2023-03-22
attackType: Software Supply Chain
severity: critical
sector: Technology / Communications
geography: Global
threatActor: UNC4736 (North Korea nexus)
attributionConfidence: A2
reviewStatus: draft_ai
confidenceGrade: B
generatedBy: kernel-k
generatedDate: 2026-05-17
cves: []
relatedSlugs:
  - lazarus-3cx-supply-chain-compromise-2023
  - lazarus-group
tags:
  - 3cx
  - 3cxdesktopapp
  - supply-chain
  - software-supply-chain
  - dprk
  - north-korea
  - unc4736
  - iconicstealer
  - poolrat
  - veiledsignal
  - x-trader
sources:
  - url: https://www.cisa.gov/news-events/alerts/2023/03/30/supply-chain-attack-against-3cxdesktopapp
    publisher: CISA
    publisherType: government
    reliability: R1
    publicationDate: "2023-03-30"
    accessDate: "2026-05-17"
    archived: false
  - url: https://www.3cx.com/blog/news/desktopapp-security-alert-updates/
    publisher: 3CX
    publisherType: vendor
    reliability: R1
    publicationDate: "2023-03-30"
    accessDate: "2026-05-17"
    archived: false
  - url: https://cloud.google.com/blog/topics/threat-intelligence/3cx-software-supply-chain-compromise/
    publisher: Mandiant
    publisherType: vendor
    reliability: R1
    publicationDate: "2023-04-20"
    accessDate: "2026-05-17"
    archived: false
  - url: https://www.3cx.com/blog/news/mandiant-security-update2/
    publisher: 3CX
    publisherType: vendor
    reliability: R1
    publicationDate: "2023-04-20"
    accessDate: "2026-05-17"
    archived: false
  - url: https://www.sentinelone.com/blog/smoothoperator-ongoing-campaign-trojanizes-3cx-software-in-software-supply-chain-attack/
    publisher: SentinelOne
    publisherType: vendor
    reliability: R2
    publicationDate: "2023-03-29"
    accessDate: "2026-05-17"
    archived: false
  - url: https://www.crowdstrike.com/en-us/blog/crowdstrike-detects-and-prevents-active-intrusion-campaign-targeting-3cxdesktopapp-customers/
    publisher: CrowdStrike
    publisherType: vendor
    reliability: R2
    publicationDate: "2023-03-29"
    accessDate: "2026-05-17"
    archived: false
mitreMappings:
  - techniqueId: T1195.002
    techniqueName: Compromise Software Supply Chain
    tactic: Initial Access
    attackVersion: "v19.0"
    confidence: confirmed
    evidence: 3CX and Mandiant reported that malicious code was introduced into the 3CX DesktopApp software build and then distributed to downstream users through legitimate 3CX software channels.
  - techniqueId: T1204.002
    techniqueName: Malicious File
    tactic: Execution
    attackVersion: "v19.0"
    confidence: confirmed
    evidence: 3CX directed users to uninstall affected Windows and macOS DesktopApp builds after those signed application packages executed malicious code on customer endpoints.
  - techniqueId: T1071.001
    techniqueName: Web Protocols
    tactic: Command and Control
    attackVersion: "v19.0"
    confidence: confirmed
    evidence: SentinelOne described the Windows malware retrieving encoded icon files from GitHub and communicating with decoded C2 URLs over web protocols, while CrowdStrike observed HTTPS beaconing to actor-controlled infrastructure.
  - techniqueId: T1027
    techniqueName: Obfuscated Files or Information
    tactic: Stealth
    attackVersion: "v19.0"
    confidence: confirmed
    evidence: SentinelOne reported that the malware extracted base64 data appended to ICO files and decrypted it to obtain command-and-control information.
  - techniqueId: T1005
    techniqueName: Data from Local System
    tactic: Collection
    attackVersion: "v19.0"
    confidence: confirmed
    evidence: Mandiant described ICONICSTEALER as collecting browser information, and SentinelOne documented collection of local browser history and application configuration data.
  - techniqueId: T1082
    techniqueName: System Information Discovery
    tactic: Discovery
    attackVersion: "v19.0"
    confidence: confirmed
    evidence: SentinelOne reported that the Windows infostealer obtained host, domain, operating system, and application configuration details before preparing exfiltration data.
---

## Summary

The 3CX DesktopApp software supply chain compromise was a March 2023 incident in which trojanized Windows and macOS builds of 3CX's desktop communications client reached downstream customer environments. SentinelOne reported a spike in behavioral detections beginning on 2023-03-22, CrowdStrike publicly warned on 2023-03-29 about malicious activity from legitimate signed 3CXDesktopApp binaries, and CISA issued an alert on 2023-03-30.

3CX initially identified affected Electron Windows App versions 18.12.407 and 18.12.416 and later listed affected macOS versions 18.11.1213, 18.12.402, 18.12.407, and 18.12.416. 3CX appointed Mandiant to investigate and directed customers to uninstall the affected desktop application while clean builds and server-side updates were prepared.

Mandiant later determined that the 3CX compromise began with a prior software supply chain intrusion: a 3CX employee installed a trojanized Trading Technologies X_TRADER package in 2022, leading to VEILEDSIGNAL malware on the employee's personal computer and subsequent access to 3CX corporate credentials and build infrastructure. Mandiant tracks the activity as UNC4736 and assesses with high confidence that the cluster has a North Korean nexus.

## Technical Analysis

The customer-facing incident centered on signed 3CX DesktopApp builds that contained malicious components. On Windows, public reporting identified a compromised MSI and a malicious ffmpeg.dll component. On macOS, SentinelOne and 3CX reported that affected Electron app builds also carried malicious components. Because the packages were distributed through the legitimate 3CX software path and used valid signing context, the incident exposed the trust relationship between 3CX and organizations that deployed or automatically updated the desktop client.

SentinelOne described the Windows attack chain as a multi-stage loader. The 3CXDesktopApp process loaded shellcode from heap memory, then retrieved ICO files from an attacker-controlled GitHub repository. The malware extracted base64 data appended to the icon files, decoded and decrypted that data, and used it to obtain command-and-control information before entering its main communication loop.

The observed Windows payload chain led to an infostealer later identified by Mandiant as ICONICSTEALER. SentinelOne documented collection of host, domain, operating system, 3CX configuration, and browser-history data from local profiles for Chrome, Edge, Brave, and Firefox. Mandiant characterized ICONICSTEALER as a C/C++ data miner that collects application configuration and browser information.

The broader 3CX environment compromise was a cascading supply chain event. 3CX and Mandiant reported that the initial intrusion vector was a trojanized X_TRADER installer downloaded from Trading Technologies' website in 2022. The malicious package deployed VEILEDSIGNAL, the actor used stolen corporate credentials through VPN access, and Mandiant later reconstructed lateral movement into 3CX's Windows and macOS build environments. 3CX reported that the Windows build environment involved TAXHAUL and COLDCAT malware, while the macOS build server was compromised with POOLRAT.

## Attack Chain

### Stage 1: X_TRADER Compromise Reaches 3CX

Mandiant identified the initial 3CX intrusion vector as an employee's installation of Trading Technologies X_TRADER software from the legitimate Trading Technologies website in 2022. The installer contained VEILEDSIGNAL malware and enabled the actor to maintain persistence on the employee's personal computer.

### Stage 2: Credential Theft and Corporate Access

3CX reported that Mandiant assessed the actor stole the employee's 3CX corporate credentials. The earliest identified evidence of compromise inside the 3CX corporate environment occurred through VPN access two days after the personal computer compromise.

### Stage 3: Build Environment Compromise

After entering the corporate environment, the actor used tooling including Fast Reverse Proxy and moved laterally. Mandiant and 3CX reported that the attacker eventually compromised both Windows and macOS build environments, including TAXHAUL and COLDCAT on the Windows build side and POOLRAT on the macOS build server.

### Stage 4: Trojanized DesktopApp Distribution

The compromised build path produced 3CX DesktopApp packages for Windows and macOS that contained malicious code. 3CX identified the affected Windows and macOS version ranges and instructed customers to uninstall the affected Electron desktop app.

### Stage 5: Customer Endpoint Execution and Payload Retrieval

When affected software ran on customer endpoints, the Windows malware used staged web infrastructure to retrieve encoded icon files from GitHub, decode command-and-control information, and continue execution. CrowdStrike observed beaconing to actor-controlled infrastructure and, in a small number of cases, second-stage payloads and hands-on-keyboard activity.

## Impact Assessment

The incident affected the integrity of 3CX DesktopApp distribution rather than a single victim network. 3CX is a business communications software provider, and SentinelOne cited 3CX's public customer scale as approximately 600,000 customer companies and 12 million daily users. That scale made the compromised desktop client a high-consequence distribution point even though public reporting did not establish that all customers installed affected builds or experienced follow-on intrusion.

The most direct impact for downstream organizations was endpoint compromise risk from trusted, signed 3CX DesktopApp packages. CISA warned that the trojanized app could lead to multi-stage attacks against users employing the vulnerable software and directed organizations to review vendor and partner reports for indicators of compromise.

Public reporting also indicates selective follow-on activity. CrowdStrike reported deployment of second-stage payloads and a small number of hands-on-keyboard cases. SentinelOne documented Windows information-stealer behavior and macOS second-stage activity. Mandiant linked the 3CX environment compromise to POOLRAT on the macOS build server and ICONICSTEALER in the customer-facing payload chain.

The incident is historically significant because it is a documented cascading software supply chain compromise. Mandiant stated that the 3CX incident was the first software supply chain attack it had observed that was initiated by a prior software supply chain attack.

## Attribution

The attribution should be treated as high confidence for North Korean nexus activity, with cluster names varying by source. Mandiant tracks the activity as UNC4736 and assesses with high confidence that UNC4736 has a North Korean nexus. CrowdStrike associated the activity with LABYRINTH CHOLLIMA, a DPRK-nexus actor designation. The broader Operation SmoothOperator campaign provides the larger Lazarus Group and cascading supply-chain context.

Mandiant's public reporting also describes a more cautious relationship between UNC4736 and broader North Korean financially motivated activity. It notes overlap with multiple North Korean operators and assesses with moderate confidence that UNC4736 is related to financially motivated AppleJeus activity. UNC4736 is therefore the most precise technical attribution label for this bounded incident, while Lazarus Group remains relevant as broader DPRK-linked context.

## Timeline

### 2022 - X_TRADER Installer Compromises 3CX Employee System

Mandiant identified the first step in the chain as a 3CX employee installing a trojanized Trading Technologies X_TRADER package in 2022. The package deployed VEILEDSIGNAL and enabled persistence on the employee's personal computer.

### 2023-03-22 - SentinelOne Behavioral Detections Increase

SentinelOne reported that it began seeing a spike in behavioral detections of 3CXDesktopApp on 2023-03-22.

### 2023-03-29 - Vendor Warnings Become Public

CrowdStrike reported unexpected malicious activity from legitimate signed 3CXDesktopApp binaries. SentinelOne published its SmoothOperator analysis describing trojanized installers, GitHub-hosted icon staging, and information-stealer behavior.

### 2023-03-30 - 3CX Confirms Affected DesktopApp Builds

3CX disclosed affected Windows and macOS DesktopApp versions, appointed Mandiant to investigate, and instructed customers to uninstall the Electron desktop app.

### 2023-03-30 - CISA Issues Alert

CISA issued an alert stating that open-source reports described a supply chain attack against 3CX software and customers, and urged organizations to review vendor reporting and hunt for indicators of compromise.

### 2023-04-20 - 3CX and Mandiant Identify Initial Intrusion Vector

3CX and Mandiant reported that the source of the internal network compromise was the earlier X_TRADER supply chain compromise, establishing the 3CX incident as a cascading software supply chain attack.

## Remediation & Mitigation

3CX directed customers to uninstall the affected Electron desktop app from Windows and macOS systems. It also instructed self-hosted and on-premise administrators to download clean DesktopApp builds, and stated that 3CX Hosted and StartUP servers would be updated automatically. 3CX recommended that customers not install or deploy the Electron app while the investigation and remediation were underway.

Organizations that ran affected builds should treat those endpoints as potentially compromised. Defensive steps include uninstalling affected DesktopApp versions, validating that clean builds are deployed, reviewing endpoint telemetry for the indicators published by 3CX, CISA, Mandiant, SentinelOne, and CrowdStrike, and investigating evidence of ICONICSTEALER, POOLRAT, or related command-and-control activity.

Credential handling is central to response. Because public reporting documented browser and application data collection, organizations should rotate credentials and revoke sessions that may have been exposed from affected endpoints, particularly for users with administrative, financial, communications, or source-code access.

For software vendors, the incident supports stronger isolation and monitoring of build infrastructure, hardened code-signing workflows, developer workstation controls, and alerting around VPN access and lateral movement into CI/CD environments. 3CX's public follow-up stated that it used the incident to strengthen policies, practices, and technology for future protection.

## Sources & References

- [CISA: Supply Chain Attack Against 3CXDesktopApp](https://www.cisa.gov/news-events/alerts/2023/03/30/supply-chain-attack-against-3cxdesktopapp) — CISA, 2023-03-30
- [3CX: DesktopApp Security Alert - Mandiant Appointed to Investigate](https://www.3cx.com/blog/news/desktopapp-security-alert-updates/) — 3CX, 2023-03-30
- [Mandiant: 3CX Software Supply Chain Compromise](https://cloud.google.com/blog/topics/threat-intelligence/3cx-software-supply-chain-compromise/) — Mandiant, 2023-04-20
- [3CX: Initial Intrusion Vector Found](https://www.3cx.com/blog/news/mandiant-security-update2/) — 3CX, 2023-04-20
- [SentinelOne: 3CX SmoothOperator](https://www.sentinelone.com/blog/smoothoperator-ongoing-campaign-trojanizes-3cx-software-in-software-supply-chain-attack/) — SentinelOne, 2023-03-29
- [CrowdStrike: Active Intrusion Campaign Targeting 3CXDesktopApp Customers](https://www.crowdstrike.com/en-us/blog/crowdstrike-detects-and-prevents-active-intrusion-campaign-targeting-3cxdesktopapp-customers/) — CrowdStrike, 2023-03-29
