---
campaignId: "TP-CAMP-2023-0002"
title: "Lazarus Group Operation SmoothOperator — 3CX Software Supply Chain Compromise"
startDate: 2023-03-01
endDate: 2023-04-30
ongoing: false
attackType: "Software Supply Chain Attack"
severity: critical
sector: "Technology / Financial Services"
geography: "Global"
threatActor: "Lazarus Group"
attributionConfidence: A2
reviewStatus: "draft_ai"
confidenceGrade: B
generatedBy: "dangermouse-bot"
generatedDate: 2026-05-12
cves: []
relatedIncidents: []
tags:
  - "lazarus-group"
  - "dprk"
  - "supply-chain"
  - "3cx"
  - "smoothoperator"
  - "voip"
  - "iconic-stealer"
  - "poolrat"
  - "north-korea"
sources:
  - url: "https://www.cisa.gov/news-events/alerts/2023/03/30/supply-chain-attack-against-3cxdesktopapp"
    publisher: "CISA"
    publisherType: government
    reliability: R1
    publicationDate: "2023-03-30"
    accessDate: "2026-05-12"
    archived: false
  - url: "https://www.sentinelone.com/blog/smoothoperator-ongoing-campaign-trojanized-3cx-software"
    publisher: "SentinelOne"
    publisherType: vendor
    reliability: R2
    publicationDate: "2023-03-29"
    accessDate: "2026-05-12"
    archived: false
  - url: "https://www.mandiant.com/resources/blog/3cx-software-supply-chain-compromise"
    publisher: "Mandiant"
    publisherType: vendor
    reliability: R2
    publicationDate: "2023-04-03"
    accessDate: "2026-05-12"
    archived: false
mitreMappings:
  - techniqueId: "T1195.002"
    techniqueName: "Compromise Software Supply Chain"
    tactic: "Initial Access"
    notes: "Lazarus Group compromised the 3CX build environment via a prior supply chain intrusion involving trojanized Trading Technologies X_TRADER software, enabling injection of malicious code into signed 3CX DesktopApp installers distributed to customers through the official update mechanism."
  - techniqueId: "T1204.002"
    techniqueName: "Malicious File"
    tactic: "Execution"
    notes: "End users installed trojanized 3CX DesktopApp updates through the application's built-in auto-update mechanism, executing malicious builds signed with legitimate 3CX certificates without awareness of the compromise."
  - techniqueId: "T1071.001"
    techniqueName: "Web Protocols"
    tactic: "Command and Control"
    notes: "ICONIC Stealer and POOLRAT communicated with attacker-controlled infrastructure over HTTPS, using GitHub-hosted icon files as an initial staging mechanism to retrieve encrypted C2 configuration before establishing direct command-and-control channels."
---

## Executive Summary

Operation SmoothOperator was a software supply chain attack in which Lazarus Group, a threat actor attributed to the Democratic People's Republic of Korea (DPRK), compromised the build environment of 3CX, a widely deployed enterprise VoIP communications platform. Beginning in late March 2023, trojanized versions of the 3CX DesktopApp were distributed to customers through the software's official signed update mechanism. The malicious builds targeted Windows and macOS systems and delivered a multi-stage payload chain culminating in the ICONIC Stealer infostealer and, in a subset of cases, the POOLRAT backdoor.

CISA issued an alert on March 30, 2023, the day after SentinelOne published initial technical findings. Mandiant subsequently attributed the campaign to UNC4736, a cluster assessed with high confidence as a Lazarus Group sub-operation acting under DPRK direction. The US government confirmed North Korean responsibility and the attack was characterized as a double supply chain compromise: the 3CX build environment was itself seeded through a prior supply chain intrusion involving trojanized Trading Technologies X_TRADER software, which had compromised 3CX developer workstations months earlier.

3CX reported more than 600,000 customers and approximately 12 million daily users at the time of the compromise. The attacker-controlled trojanized builds carried valid 3CX code-signing certificates, allowing them to pass standard endpoint verification controls and reach enterprise environments across financial services, critical infrastructure, and technology sectors worldwide.

## Technical Analysis

The 3CX compromise was a two-stage supply chain attack. The first stage involved the prior infection of at least one 3CX developer workstation through trojanized X_TRADER software from Trading Technologies — an independent software vendor whose installer had been backdoored in a separate Lazarus Group operation. This initial compromise gave the attacker access to the 3CX build environment.

The attacker modified the Windows and macOS 3CX DesktopApp source or build pipeline to inject a malicious DLL. On Windows, the payload was embedded in ffmpeg.dll and d3dcompiler_47.dll, which are legitimate dependencies bundled with the application. On macOS, a dylib variant performed the equivalent function. The modified builds were signed using 3CX's own valid code-signing certificates and distributed through the official 3CX update delivery infrastructure.

Upon execution, the malicious DLL decoded an encrypted payload embedded within an icon file retrieved from a GitHub repository under attacker control. This staging mechanism used GitHub-hosted .ico files as a dead-drop resolver to load the next-stage payload without direct C2 contact at initial execution, reducing the chance of detection by network controls.

The first-stage payload delivered was ICONIC Stealer, which enumerated and exfiltrated browser-stored credentials, session cookies, and system information from compromised hosts. On a subset of targeted systems — assessed by Mandiant as a deliberate secondary-stage selection by the attacker — POOLRAT, a full-featured macOS backdoor with persistent command execution capability, was deployed.

No zero-day vulnerability was used. The attack relied on the trusted distribution channel of a legitimate, signed software update, and on the implicit trust enterprise environments place in vendor-supplied application packages.

## Attack Chain

### Stage 1: Initial Build Environment Compromise

The 3CX build environment was compromised through a prior supply chain intrusion. A 3CX developer workstation was infected with VEILEDSIGNAL malware delivered via a trojanized installer for Trading Technologies X_TRADER, a legitimate financial trading platform software package that had been backdoored in a separate Lazarus Group operation. This workstation access provided the attacker with a foothold sufficient to reach the 3CX software development and build pipeline.

### Stage 2: Malicious Code Injection into 3CX DesktopApp

The attacker injected a malicious component into the 3CX DesktopApp build for both Windows and macOS. On Windows, the ffmpeg.dll bundled with the application was replaced or modified to contain encoded shellcode. On macOS, a malicious dylib was introduced into the build. The resulting installers were signed with 3CX's legitimate code-signing certificates and published via the official 3CX update channel.

### Stage 3: Payload Staging via GitHub Dead Drop

On execution by end users, the malicious component retrieved encrypted payload data embedded in .ico image files hosted in attacker-controlled GitHub repositories. This dead-drop staging mechanism delayed direct C2 contact and allowed the attacker to serve the next-stage payload only to selected systems. The GitHub repositories were taken down following public disclosure.

### Stage 4: ICONIC Stealer Execution

The decoded payload executed ICONIC Stealer, which performed automated collection of browser-stored credentials, session data, and system telemetry from the compromised host and transmitted this data to attacker-controlled infrastructure over HTTPS.

### Stage 5: Selective POOLRAT Deployment

On a subset of compromised hosts assessed as high-priority targets, the attacker deployed POOLRAT, a macOS-focused backdoor providing persistent remote command execution. POOLRAT's deployment pattern indicated manual attacker selection of downstream targets from the broader pool of ICONIC Stealer victims.

## MITRE ATT&CK Mapping

T1195.002 - Compromise Software Supply Chain: Lazarus Group compromised the 3CX build environment via a prior supply chain intrusion involving trojanized Trading Technologies X_TRADER software, enabling injection of malicious code into signed 3CX DesktopApp installers distributed to customers through the official update mechanism.

T1204.002 - User Execution: Malicious File: End users installed trojanized 3CX DesktopApp updates through the application's built-in auto-update mechanism, executing malicious builds signed with legitimate 3CX certificates without awareness of the compromise.

T1071.001 - Application Layer Protocol: Web Protocols: ICONIC Stealer and POOLRAT used HTTPS for command-and-control communication. The initial staging step retrieved encrypted payload data from GitHub-hosted icon files before establishing direct C2 channels.

## Timeline

### 2022 — Trading Technologies X_TRADER Supply Chain Compromise

Lazarus Group backdoored the Trading Technologies X_TRADER installer in a separate operation. This compromised installer infected at least one 3CX developer workstation with VEILEDSIGNAL malware, providing initial access to the 3CX build environment months before the 3CX customer-facing compromise was activated.

### 2023-03-29 — SentinelOne Publishes Initial Findings

SentinelOne published the first public technical report identifying trojanized 3CX DesktopApp builds, naming the operation SmoothOperator. The report documented the malicious DLL loading chain and the GitHub dead-drop staging mechanism.

### 2023-03-30 — CISA Issues Alert

CISA issued an alert advising organizations to review environments for the trojanized 3CX DesktopApp versions and apply mitigations, directing organizations to treat deployed instances of the affected versions as potentially compromised.

### 2023-03-30 — 3CX Acknowledges Compromise

3CX acknowledged that the DesktopApp had been compromised and directed users to uninstall the affected application pending a clean build. 3CX engaged Mandiant to conduct an independent investigation.

### 2023-04-03 — Mandiant Attributes to UNC4736

Mandiant published attribution findings assigning the campaign to UNC4736, a cluster assessed as a Lazarus Group sub-operation acting under DPRK direction. Mandiant's investigation identified the Trading Technologies X_TRADER compromise as the first-stage supply chain intrusion.

### 2023-04-12 — 3CX Releases Clean Build and Remediation Guidance

3CX released updated clean versions of the DesktopApp for Windows and macOS and published remediation guidance for affected customers.

### 2023-04 — Double Supply Chain Link Publicly Confirmed

Mandiant confirmed that the root cause of the 3CX compromise was itself a supply chain attack — the trojanized Trading Technologies X_TRADER installer — establishing Operation SmoothOperator as a double supply chain attack.

## Remediation & Mitigation

CISA and 3CX directed immediate uninstallation of the affected Windows and macOS DesktopApp versions: 18.12.407 and 18.12.416 for Windows; 18.11.1213, 18.12.402, 18.12.407, and 18.12.416 for macOS. Organizations were advised to treat any host that had run the affected versions as potentially compromised and to initiate incident response procedures accordingly.

Recommended actions included auditing affected endpoints for indicators of compromise associated with ICONIC Stealer and POOLRAT; reviewing browser credential stores and rotating any credentials accessible on affected hosts; examining network logs for connections to the GitHub repositories and C2 infrastructure documented in CISA and SentinelOne advisories; and applying enhanced monitoring for POOLRAT persistence mechanisms on macOS systems where the backdoor may have been deployed.

3CX migrated customers to a browser-based PWA client as an interim measure while clean installers were prepared. The Electron-based DesktopApp was phased out to reduce the attack surface presented by the locally installed application.

Broader supply chain security recommendations arising from this incident include: verifying the integrity of third-party software dependencies used in build pipelines; implementing build environment isolation and restricting code-signing access to hardened, audited systems; and auditing developer workstations for access paths to CI/CD and build infrastructure.

## Sources & References

- [CISA: Supply Chain Attack Against 3CXDesktopApp](https://www.cisa.gov/news-events/alerts/2023/03/30/supply-chain-attack-against-3cxdesktopapp) — CISA, 2023-03-30
- [SentinelOne: SmoothOperator — Ongoing Campaign Trojanized 3CX Software](https://www.sentinelone.com/blog/smoothoperator-ongoing-campaign-trojanized-3cx-software) — SentinelOne, 2023-03-29
- [Mandiant: 3CX Software Supply Chain Compromise](https://www.mandiant.com/resources/blog/3cx-software-supply-chain-compromise) — Mandiant, 2023-04-03
