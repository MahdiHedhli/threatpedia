---
campaignId: "TP-CAMP-2026-0348"
title: "Red Lamassu Showboat Telecom Intrusion Campaign (2022-2026)"
startDate: 2022-06-01
endDate: 2026-05-21
ongoing: false
attackType: "Malware / Cyberespionage"
severity: high
sector: "Telecommunications / Managed Hosting / Internet Infrastructure"
geography: "Middle East / Central Asia / Southeast Asia / Global Telecommunications Sector"
threatActor: "Red Lamassu"
attributionConfidence: A3
reviewStatus: "draft_ai"
confidenceGrade: C
generatedBy: "dangermouse-bot"
generatedDate: 2026-06-04
generation:
  provider: "openai"
  model: "Codex GPT-5.3 Spark"
  tool: "codex"
  agent: "dangermouse-bot"
  promptProfile: "danger-mouse-dispatcher"
cves: []
relatedIncidents: []
tags:
  - "red-lamassu"
  - "showboat"
  - "jfmbackdoor"
  - "telecommunications"
  - "china-nexus"
  - "linux-malware"
  - "socks5"
sources:
  - url: "https://www.lumen.com/blog/en-us/introducing-showboat-a-new-malware-family-taunts-defenses-and-targets-international-telecom-firms"
    publisher: "Lumen Black Lotus Labs"
    publisherType: research
    reliability: R2
    publicationDate: "2026-05-21"
    accessDate: "2026-06-04"
    archived: false
  - url: "https://www.pwc.com/gx/en/issues/cybersecurity/cyber-threat-intelligence/red-lamassu-open-season.html"
    publisher: "PwC Threat Intelligence"
    publisherType: research
    reliability: R2
    publicationDate: "2026-05-21"
    accessDate: "2026-06-04"
    archived: false
  - url: "https://www.nsa.gov/Press-Room/Press-Releases-Statements/Press-Release-View/Article/4467839/nsa-and-others-release-joint-guidance-addressing-multiple-china-nexus-threat-ac/"
    publisher: "NSA"
    publisherType: government
    reliability: R1
    publicationDate: "2026-04-23"
    accessDate: "2026-06-04"
    archived: false
mitreMappings:
  - techniqueId: "T1105"
    techniqueName: "Ingress Tool Transfer"
    tactic: "Command and Control"
    attack-version: "v19.0"
    confidence: probable
    evidence: "Lumen reported that Showboat includes functions for transferring files to and from infected Linux systems."
  - techniqueId: "T1090"
    techniqueName: "Proxy"
    tactic: "Command and Control"
    attack-version: "v19.0"
    confidence: probable
    evidence: "Lumen reported SOCKS5 and portmap functions that allow operators to connect through compromised systems."
  - techniqueId: "T1059"
    techniqueName: "Command and Scripting Interpreter"
    tactic: "Execution"
    attack-version: "v19.0"
    confidence: possible
    evidence: "PwC reported that JFMBackdoor supports remote shell access, while Lumen described Showboat as able to spawn a remote shell."
atlasMappings: []
framework-mappings: []
---

## Executive Summary

Red Lamassu is a China-based activity cluster that PwC Threat Intelligence tracks as targeting telecommunications and government entities in the Asia-Pacific region. In May 2026, PwC and Lumen Black Lotus Labs published paired research on related Red Lamassu activity. Lumen described Showboat, a Linux post-exploitation framework used against telecommunications organizations, while PwC described JFMBackdoor, a Windows backdoor found in an open directory associated with Red Lamassu operations.

Lumen assessed that Showboat activity had been active since at least mid-2022 and affected telecommunications targets in multiple regions, including a Middle East telecommunications provider and infrastructure impersonating telecommunications firms in Southeast Asia. PwC tied an open directory hosted at 23.27.201[.]160 to Red Lamassu operations and described related tooling that included the Linux-oriented kworker sample that Lumen names Showboat and the Windows JFMBackdoor malware.

The campaign is assessed as high severity because telecommunications providers are high-value targets for espionage, routing visibility, subscriber data access, and downstream supply-chain exposure. Attribution should remain bounded to the source language: PwC names Red Lamassu and describes it as China-based; Lumen describes PRC-aligned clusters and explicitly notes that shared tooling can make actor-level attribution difficult.

## Technical Analysis

Lumen described Showboat as a modular Linux post-exploitation framework. The malware can retrieve configuration material, gather host information, transmit encrypted and encoded host data to command-and-control infrastructure, hide its process, transfer files, maintain service-based persistence, change command-and-control nodes, and provide SOCKS5 and portmap functions. Those functions are consistent with a foothold intended to let operators reach systems that are not directly exposed to the internet.

Lumen's network analysis began with telecom[.]webredirect[.]org resolving to 139.84.227[.]139, which exposed multiple ports and self-signed X.509 certificate metadata. Lumen used certificate fingerprints, open ports, and telemetry to identify primary and secondary activity clusters. The primary cluster included domains impersonating telecommunications organizations, including singtelcom[.]site and kaztelecom[.]shop, and Lumen reported victim telemetry involving an Afghanistan-based ISP and a second victim geolocated in Azerbaijan.

PwC's Red Lamassu research centered on an open directory active between July and October 2025. PwC assessed the directory as almost certainly tied to Red Lamassu operations based on a TLS certificate served by infrastructure it exclusively associated with the actor. The directory contained the Showboat/kworker sample and JFMBackdoor, a Windows backdoor delivered through DLL side-loading with remote shell, file-system, network proxy, screenshot, and self-removal capabilities.

The NSA-led April 2026 joint guidance does not name Showboat or Red Lamassu. It provides relevant defensive context for China-nexus threat activity that uses external covert networks of compromised devices to route operations and obscure attribution. That guidance is used here only for defensive context around infrastructure risk and mitigation, not as direct confirmation of Red Lamassu tooling.

## Attack Chain

### Stage 1: Infrastructure Preparation

Operators used command-and-control infrastructure associated with telecom-themed hostnames, self-signed certificate metadata, and domains impersonating regional telecommunications organizations. Lumen identified clusters using X.509 certificate fingerprints and observed infrastructure that may have served either upstream or testing roles.

### Stage 2: Linux Foothold Establishment

The initial access vector for Showboat was not directly observed by Lumen. After execution, the malware retrieved configuration material, gathered host and process information, and transmitted encrypted host data to command-and-control infrastructure.

### Stage 3: Persistence and Process Hiding

Showboat included functions that could hide the malware process and obtain service-based persistence. Lumen also described use of externally hosted code snippets as a retrieval point for process-hiding code.

### Stage 4: Remote Operations and File Movement

Showboat provided operator functions for file upload and download, command execution through a remote shell capability, and command-and-control node changes. PwC reported that JFMBackdoor supported remote shell access, file-system operations, network proxying, screenshot capture, and self-removal.

### Stage 5: Internal Network Access Through Proxy Functions

Showboat's SOCKS5 and portmap functions allowed operators to interact with systems deeper inside a network. Lumen assessed that these functions were designed to let operators reach machines that were not directly exposed to the public internet.

## MITRE ATT&CK Mapping

### Execution

T1059 - Command and Scripting Interpreter: PwC reported remote shell functionality in JFMBackdoor, and Lumen described Showboat as capable of spawning a remote shell. The mapping is possible because the public reports describe shell access but do not fully document the shell implementation.

### Command and Control

T1105 - Ingress Tool Transfer: Lumen reported Showboat operator functions for transferring files to and from infected hosts. This behavior supports file movement after a foothold has been established.

T1090 - Proxy: Lumen reported SOCKS5 and portmap functions in Showboat. The reported behavior supports using compromised systems as proxy points for access to internal systems.

## Timeline

### 2022-06-01 — Showboat Activity Window Begins

Lumen assessed that the Showboat campaign had been active since at least mid-2022. The exact start date was not publicly fixed, so this record uses June 2022 as an approximate campaign start based on the source language.

### 2025-05-05 — Showboat Sample Submitted to VirusTotal

Lumen reported that the Showboat sample was submitted to VirusTotal on 2025-05-05 and had no detections at the time of submission.

### 2025-07-01 — Red Lamassu Open Directory Active

PwC observed an open directory hosted at 23.27.201[.]160 active between July and October 2025. PwC associated the directory with Red Lamassu operations and found both the kworker/Showboat sample and JFMBackdoor-related files.

### 2025-12-01 — Victim Telemetry From Afghanistan-Based ISP

Lumen reported observing connections from an Outlook server belonging to an Afghanistan-based ISP to Showboat-associated command-and-control infrastructure from 2025-12-01 through 2026-02-03.

### 2026-04-23 — Joint Guidance on China-Nexus Covert Networks

NSA, NCSC, ASD ACSC, and partner agencies released guidance on China-nexus covert networks of compromised devices. The guidance provides relevant mitigation context for defenders facing China-nexus infrastructure routing and attribution challenges.

### 2026-05-21 — Lumen and PwC Publish Coordinated Research

Lumen published Showboat research, and PwC published Red Lamassu research focused on JFMBackdoor and the related open directory. The paired reports provide the primary public basis for this campaign summary.

## Remediation & Mitigation

Telecommunications providers and managed infrastructure operators should hunt for the Showboat indicators published by Lumen and the Red Lamassu indicators published by PwC. Investigations should prioritize Linux servers, externally reachable management services, mail infrastructure, and systems that can act as pivots into provider networks.

Network defenders should review certificate fingerprints, telecom-themed domains, SOCKS5 exposure, unusual outbound traffic from server infrastructure, and command-and-control patterns associated with the published indicators. Proxy and portmap behavior should be treated as a sign that an operator may be attempting to reach internal systems from a compromised host.

Organizations should collect host artifacts from suspected Linux and Windows systems, including process listings, persistence mechanisms, service definitions, suspicious DLL side-loading paths, and command history where available. Where a Showboat or JFMBackdoor infection is suspected, defenders should assume that adjacent systems reachable from the compromised host may have been accessed.

The NSA-led joint guidance on China-nexus covert networks recommends reducing exposure of routers, firewalls, network-attached storage, and internet-of-things devices that can be co-opted into external proxy networks. Apply firmware updates, disable unnecessary internet-facing services, rotate administrative credentials, and monitor for devices that unexpectedly relay traffic.

Because the public reporting describes espionage-oriented access rather than financially motivated disruption, remediation should include credential rotation, review of privileged accounts, network segmentation checks, and logging review across authentication, remote access, DNS, and proxy infrastructure. Organizations should preserve forensic evidence before rebuilding systems.

## Sources & References

- [Lumen Black Lotus Labs: Introducing Showboat: A new malware family taunts defenses and targets international telecom firms](https://www.lumen.com/blog/en-us/introducing-showboat-a-new-malware-family-taunts-defenses-and-targets-international-telecom-firms) — Lumen Black Lotus Labs, 2026-05-21
- [PwC Threat Intelligence: Inside Red Lamassu's JFMBackdoor](https://www.pwc.com/gx/en/issues/cybersecurity/cyber-threat-intelligence/red-lamassu-open-season.html) — PwC Threat Intelligence, 2026-05-21
- [NSA: NSA and Others Release Joint Guidance Addressing Multiple China-Nexus Threat Actors Using External Covert Networks to Facilitate Cyber Activity at Scale](https://www.nsa.gov/Press-Room/Press-Releases-Statements/Press-Release-View/Article/4467839/nsa-and-others-release-joint-guidance-addressing-multiple-china-nexus-threat-ac/) — NSA, 2026-04-23
