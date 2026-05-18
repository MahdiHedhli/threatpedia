---
campaignId: "TP-CAMP-2018-0001"
title: "AppleJeus DPRK Cryptocurrency Targeting Campaign"
startDate: 2018-08-01
endDate: 2021-04-15
ongoing: false
attackType: "Trojanized Cryptocurrency Application / Financial Theft"
severity: high
sector: "Cryptocurrency / Financial Services / Energy / Government / Technology / Telecommunications"
geography: "Global"
threatActor: "Lazarus Group"
attributionConfidence: A2
reviewStatus: "draft_ai"
confidenceGrade: C
generatedBy: "kernel-k"
generatedDate: 2026-05-05
cves: []
relatedIncidents: []
tags:
  - "applejeus"
  - "lazarus-group"
  - "dprk"
  - "cryptocurrency"
  - "trojanized-applications"
  - "financial-theft"
  - "macos"
  - "windows"
sources:
  - url: "https://www.cisa.gov/news-events/cybersecurity-advisories/aa21-048a"
    publisher: "CISA"
    publisherType: government
    reliability: R1
    publicationDate: "2021-04-15"
    accessDate: "2026-05-05"
    archived: false
  - url: "https://www.cisa.gov/news-events/news/cisa-fbi-and-treasury-expose-latest-tool-north-koreas-cryptocurrency-theft-scheme-applejeus"
    publisher: "CISA"
    publisherType: government
    reliability: R1
    publicationDate: "2021-02-17"
    accessDate: "2026-05-05"
    archived: false
  - url: "https://www.kaspersky.com/about/press-releases/lazarus-enhances-capabilities-in-applejeus-cryptocurrency-attack"
    publisher: "Kaspersky"
    publisherType: vendor
    reliability: R2
    publicationDate: "2020-01-08"
    accessDate: "2026-05-05"
    archived: false
  - url: "https://attack.mitre.org/software/S0584/"
    publisher: "MITRE ATT&CK"
    publisherType: research
    reliability: R1
    publicationDate: "2025-04-16"
    accessDate: "2026-05-05"
    archived: false
mitreMappings:
  - techniqueId: "T1566.002"
    techniqueName: "Spearphishing Link"
    tactic: "Initial Access"
    notes: "CISA reported AppleJeus delivery through phishing links and social engineering paths that led targets to malicious cryptocurrency application sites."
  - techniqueId: "T1204.002"
    techniqueName: "Malicious File"
    tactic: "Execution"
    notes: "AppleJeus depended on victims installing trojanized Windows or macOS cryptocurrency applications that appeared legitimate."
  - techniqueId: "T1543.004"
    techniqueName: "Launch Daemon"
    tactic: "Persistence"
    notes: "CISA and MITRE describe AppleJeus macOS variants using LaunchDaemon property lists for persistence."
  - techniqueId: "T1071.001"
    techniqueName: "Web Protocols"
    tactic: "Command and Control"
    notes: "AppleJeus components communicated with actor infrastructure using web protocols and POST requests."
  - techniqueId: "T1041"
    techniqueName: "Exfiltration Over C2 Channel"
    tactic: "Exfiltration"
    notes: "AppleJeus collected host information and sent it to command-and-control infrastructure."
---

## Executive Summary

AppleJeus is a DPRK-linked campaign family built around malicious cryptocurrency trading and wallet applications. CISA, FBI, and the U.S. Department of the Treasury described AppleJeus as North Korean government malicious activity used to target cryptocurrency exchanges, financial services firms, and other organizations through applications that looked like legitimate trading platforms. MITRE tracks AppleJeus as downloader malware used by Lazarus Group against companies across energy, finance, government, industry, technology, and telecommunications sectors.

Public evidence supports Lazarus Group attribution and a campaign window beginning with AppleJeus reporting in 2018 and extending through multiple versions identified by U.S. government reporting in 2020. AppleJeus is treated as a campaign-level record because available documentation describes repeated tooling, infrastructure, lure patterns, and cross-platform variants rather than a single bounded intrusion.

## Technical Analysis

AppleJeus operators used the trust model around cryptocurrency software as the initial access path. Victims were directed to sites that appeared to represent legitimate cryptocurrency companies or trading applications. The downloaded software presented normal-looking trading or wallet functionality while secondary updater, crash reporter, or daemon components collected host information, contacted command-and-control infrastructure, and prepared additional payload delivery.

The campaign evolved across Windows and macOS implementations. CISA's advisory catalogued seven AppleJeus versions and described Windows MSI installers, macOS DMG packages, valid-looking certificates, updater components, scheduled tasks, LaunchDaemon persistence, and staged command-and-control traffic. Kaspersky's 2020 reporting described AppleJeus activity after the initial 2018 operation, including fake cryptocurrency-related websites, Telegram-linked lures, and a two-stage infection pattern where a downloaded application fetched a later payload from a remote server.

Public reporting ties AppleJeus to cryptocurrency theft objectives, but available documentation does not support treating every DPRK cryptocurrency intrusion as AppleJeus. The campaign label is applied where reporting identifies AppleJeus malware, AppleJeus-branded tooling, or the specific trojanized cryptocurrency application pattern described by CISA, Kaspersky, and MITRE.

## Attack Chain

### Stage 1: Infrastructure and Persona Preparation

The operators built legitimate-looking cryptocurrency business websites and application distribution paths, including domains and hosted downloads that presented as trading or wallet software.

### Stage 2: Social Engineering and Delivery

Targets were lured through phishing, social networking, social engineering, or related cryptocurrency channels to download the trojanized application.

### Stage 3: User Installation

The victim installed a Windows or macOS cryptocurrency application that displayed normal-looking functionality while hiding malicious updater or daemon components.

### Stage 4: Persistence and Host Collection

AppleJeus components established persistence using platform-specific mechanisms such as scheduled tasks, Windows services, or macOS LaunchDaemons, then collected host information for the operator.

### Stage 5: Command-and-Control and Payload Delivery

The malware contacted command-and-control infrastructure over web protocols, sent collected information, and in documented variants attempted to retrieve or launch follow-on payloads.

## MITRE ATT&CK Mapping

### Initial Access

T1566.002 - Phishing: Spearphishing Link: AppleJeus delivery included links that led users toward malicious cryptocurrency application sites.

### Execution

T1204.002 - User Execution: Malicious File: The campaign required victims to install trojanized cryptocurrency applications or installers.

### Persistence

T1543.004 - Create or Modify System Process: Launch Daemon: macOS AppleJeus variants used LaunchDaemon property lists and startup behavior for persistence.

### Command and Control

T1071.001 - Application Layer Protocol: Web Protocols: AppleJeus components communicated with command-and-control servers using web traffic patterns.

### Exfiltration

T1041 - Exfiltration Over C2 Channel: AppleJeus collected host information and transmitted it through the same command-and-control channel.

## Timeline

### 2018-08-01 — Initial AppleJeus Reporting Window

Public reporting in August 2018 described AppleJeus as a Lazarus-linked operation using trojanized cryptocurrency trading software against a cryptocurrency exchange.

### 2019-10-01 — JMT Trading Variant Identified

CISA documented a 2019 AppleJeus variant known as JMT Trading that used legitimate-looking cryptocurrency application branding and distribution infrastructure.

### 2020-01-08 — Kaspersky Reports AppleJeus Sequel Activity

Kaspersky reported that Lazarus continued AppleJeus activity with revised macOS and Windows tradecraft, fake cryptocurrency-related websites, and Telegram-linked lures.

### 2020-12-01 — Ants2Whale Version Identified

CISA described a late-2020 AppleJeus version called Ants2Whale, adding another example of the repeated cryptocurrency-company lure pattern.

### 2021-02-17 — CISA, FBI, and Treasury Publicly Release Joint Advisory

U.S. government agencies released a joint advisory describing AppleJeus malware versions, affected sectors, and recommended mitigation guidance.

### 2021-04-15 — CISA Advisory Revised

CISA revised the AppleJeus advisory, including a MITRE ATT&CK technique update for macOS shell execution.

## Remediation & Mitigation

Cryptocurrency firms and financial services organizations should treat third-party trading tools, wallet applications, and vendor-provided installers as high-risk software until provenance is verified. Application allowlisting, code-signing validation, certificate review, and controlled software distribution reduce the chance that a user can introduce a trojanized trading application into the environment.

Detection should focus on the AppleJeus pattern rather than one indicator set. Defensive coverage should watch for unexpected updater binaries, cryptocurrency-branded applications spawning shell scripts or system services, macOS LaunchDaemon creation from application installers, scheduled tasks tied to trading software, outbound POST traffic from updater components, and communication with newly registered or low-reputation cryptocurrency-themed domains.

Organizations that handle cryptocurrency assets should separate trading and wallet operations from general-purpose workstations, require phishing-resistant authentication for exchange and custody access, and prepare response procedures for rapid token revocation, wallet movement freezes, and endpoint isolation. Users should verify cryptocurrency software directly through trusted vendor channels and avoid installing applications delivered through unsolicited links, social channels, or lookalike websites.

## Sources & References

- [CISA: AppleJeus: Analysis of North Korea's Cryptocurrency Malware](https://www.cisa.gov/news-events/cybersecurity-advisories/aa21-048a) — CISA, 2021-04-15
- [CISA: CISA, FBI, and Treasury Expose Latest Tool in North Korea's Cryptocurrency Theft Scheme - AppleJeus](https://www.cisa.gov/news-events/news/cisa-fbi-and-treasury-expose-latest-tool-north-koreas-cryptocurrency-theft-scheme-applejeus) — CISA, 2021-02-17
- [Kaspersky: Lazarus enhances capabilities in AppleJeus cryptocurrency attack](https://www.kaspersky.com/about/press-releases/lazarus-enhances-capabilities-in-applejeus-cryptocurrency-attack) — Kaspersky, 2020-01-08
- [MITRE ATT&CK: AppleJeus](https://attack.mitre.org/software/S0584/) — MITRE ATT&CK, 2025-04-16
