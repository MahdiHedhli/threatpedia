---
campaignId: "TP-CAMP-2016-0001"
title: "Operation Cloud Hopper: APT10 Managed Service Provider Espionage Campaign"
startDate: 2016-01-01
endDate: 2018-12-20
ongoing: false
attackType: "Cyber Espionage via MSP Pivot"
severity: high
sector: "Technology / Managed Services"
geography: "Global"
threatActor: "APT10"
attributionConfidence: A2
reviewStatus: "draft_ai"
confidenceGrade: B
generatedBy: "dangermouse-bot"
generatedDate: 2026-05-06
cves: []
relatedIncidents: []
tags:
  - "apt10"
  - "cloud-hopper"
  - "msp"
  - "china"
  - "espionage"
  - "managed-service-provider"
  - "menupass"
sources:
  - url: "https://www.ncsc.gov.uk/news/ncsc-supports-doj-indictment-of-two-chinese-nationals"
    publisher: "UK NCSC"
    publisherType: government
    reliability: R1
    publicationDate: "2018-12-20"
    accessDate: "2026-05-06"
    archived: false
  - url: "https://www.cisa.gov/uscert/ncas/alerts/aa21-200b"
    publisher: "CISA"
    publisherType: government
    reliability: R1
    publicationDate: "2021-07-19"
    accessDate: "2026-05-06"
    archived: false
  - url: "https://www.pwc.com/gx/en/issues/cybersecurity/cyber-threat-intelligence/operation-cloud-hopper.html"
    publisher: "PwC"
    publisherType: research
    reliability: R2
    publicationDate: "2017-04-03"
    accessDate: "2026-05-06"
    archived: false
mitreMappings:
  - techniqueId: "T1199"
    techniqueName: "Trusted Relationship"
    tactic: "Initial Access"
    notes: "APT10 exploited trusted access relationships between MSPs and their clients to pivot from MSP environments into client networks without requiring separate initial access per target organization."
  - techniqueId: "T1566.001"
    techniqueName: "Phishing: Spearphishing Attachment"
    tactic: "Initial Access"
    notes: "APT10 used targeted spear-phishing emails with malicious attachments as a primary vector for gaining footholds in MSP environments."
  - techniqueId: "T1078"
    techniqueName: "Valid Accounts"
    tactic: "Defense Evasion"
    notes: "Stolen and compromised MSP administrator credentials were used to access client environments, blending intrusion activity with legitimate administrative traffic."
  - techniqueId: "T1071.001"
    techniqueName: "Application Layer Protocol: Web Protocols"
    tactic: "Command and Control"
    notes: "APT10 used HTTP and HTTPS-based command-and-control communications via tools including RedLeaves and PlugX to blend into normal web traffic patterns."
---

## Executive Summary

Operation Cloud Hopper was a multi-year cyber espionage campaign conducted by APT10, a threat group publicly attributed by the United States, United Kingdom, Australia, Canada, Japan, and New Zealand to the Chinese Ministry of State Security (MSS). The campaign targeted managed service providers (MSPs) as an indirect access route into MSP client organizations across multiple sectors and regions.

Rather than attacking end-target organizations directly, APT10 focused on compromising MSPs and exploiting their trusted, privileged access to client networks. This approach allowed the group to reach a wide range of targets through a contained set of initial intrusions. Public disclosure proceeded in stages between 2017 and 2018, culminating in U.S. Department of Justice indictments of two Chinese nationals and coordinated multi-nation attribution in December 2018.

## Technical Analysis

APT10 gained initial footholds in MSP environments through targeted spear-phishing campaigns using malicious attachments. Once inside an MSP environment, the group deployed custom and modified remote access tools — including RedLeaves, PlugX, and ANEL — to maintain persistence and support lateral movement.

The defining technique of Cloud Hopper was the abuse of trusted administrative relationships between MSPs and their clients. MSPs routinely hold authenticated, privileged access to client networks for support and maintenance. APT10 harvested MSP credentials and leveraged these existing trust relationships to pivot into client environments without requiring separate intrusion operations against each individual target.

Within client networks, operators conducted reconnaissance, sought additional credentials, and collected intelligence material aligned with state espionage priorities. The use of legitimate MSP access pathways made distinguishing intrusion activity from routine administrative traffic more difficult for defenders lacking visibility into MSP-to-client network flows.

RedLeaves functioned as a modular backdoor with extensible capability. PlugX, a remote access tool used across multiple Chinese-nexus intrusion sets, provided persistence in target environments. ANEL served as a staged backdoor deployed during initial access phases in some victim environments. Command-and-control traffic was designed to blend with normal outbound web traffic.

## Attack Chain

### Stage 1: MSP Initial Access via Spear-Phishing

APT10 sent targeted spear-phishing emails to MSP employees with malicious document attachments designed to execute payloads on opening. These emails were crafted to appear relevant to the recipient's role or business context.

### Stage 2: Persistence and Tooling Deployment

After gaining access to an MSP host, the group deployed backdoor tools to maintain persistent access. RedLeaves and PlugX provided command-and-control channels that blended with outbound web traffic from MSP infrastructure.

### Stage 3: Credential Harvesting Within MSP

Operators collected credentials from MSP systems, targeting administrative accounts used for remote management platforms, VPN access, and direct client environment administration.

### Stage 4: Lateral Movement to Client Networks

Using harvested MSP credentials and pre-existing trusted access relationships, the group pivoted into client networks. This step did not require a separate exploitation event in the client environment — legitimate MSP access pathways served as the entry mechanism.

### Stage 5: Reconnaissance and Data Collection in Client Environments

Within client environments, operators conducted network and host reconnaissance, sought additional credentials, and collected data of intelligence value including documents, email, and system configuration information.

### Stage 6: Exfiltration

Collected data was staged and exfiltrated through command-and-control infrastructure. The campaign's objective was sustained intelligence collection rather than disruption of target operations.

## MITRE ATT&CK Mapping

### Initial Access

T1199 - Trusted Relationship: APT10 exploited MSP-to-client trust relationships to access client environments using legitimate MSP credentials and remote administration pathways, bypassing the need for direct exploitation of client-facing systems.

T1566.001 - Phishing: Spearphishing Attachment: Targeted spear-phishing emails with malicious attachments were used to gain initial footholds within MSP environments before pivoting to client networks.

### Defense Evasion

T1078 - Valid Accounts: Stolen MSP administrator credentials were used to access client networks, making intrusion activity harder to distinguish from routine MSP administrative sessions in the absence of behavioral baselining.

### Command and Control

T1071.001 - Application Layer Protocol: Web Protocols: Custom tools including RedLeaves and PlugX used HTTP and HTTPS-based command-and-control to blend their communications with normal web traffic generated by MSP operations.

## Timeline

### 2016-01-01 — Campaign Activity Period Begins

Government advisories and public reporting indicate APT10 Cloud Hopper activity was under way by at least early 2016, targeting MSPs and their clients across multiple countries and sectors.

### 2017-04-03 — PwC and BAE Systems Publish Technical Report

PwC and BAE Systems jointly released a technical report attributing Operation Cloud Hopper to APT10 and documenting the MSP-pivot tradecraft, tooling, and scope of the campaign. This represented the first major public technical characterization of the operation.

### 2018-10-04 — U.S. and Allied Governments Issue MSP Security Advisory

The United States and partner governments published updated guidance for MSPs and their clients on defensive measures and indicators associated with APT10 activity targeting MSP environments.

### 2018-12-19 — U.S. Department of Justice Unseals Indictments

The DOJ indicted Zhu Hua and Zhang Shilong, two Chinese nationals alleged to be members of APT10, on charges related to the Cloud Hopper campaign and other computer intrusion activity conducted on behalf of the Chinese MSS.

### 2018-12-20 — Coordinated Multi-Nation Attribution Statement

The United States, United Kingdom, Australia, Canada, Japan, and New Zealand jointly attributed Operation Cloud Hopper to APT10 and to the Chinese Ministry of State Security. UK NCSC issued a supporting public statement endorsing the attribution and the DOJ indictment.

### 2021-07-19 — CISA Updates Advisory on Chinese State-Sponsored Cyber Operations

CISA published Alert AA21-200B documenting observed TTPs across Chinese state-sponsored cyber operations, including APT10 behaviors associated with Cloud Hopper activity patterns.

## Remediation & Mitigation

Organizations using managed service providers should treat MSP access pathways as high-risk entry points requiring the same scrutiny as direct privileged access.

Review and restrict MSP remote access to only the systems and accounts required for defined service operations. Persistent, broad-scope MSP credentials increase the potential impact of MSP compromise.

Monitor MSP-to-client network sessions for anomalous patterns, including access at unusual hours, access to systems outside the MSP's defined service scope, or bulk data transfers not associated with routine operations.

Require MSPs to implement and demonstrate multi-factor authentication on all accounts with access to client environments. Single-factor authentication on MSP credentials is a critical control gap given the credential-harvesting tradecraft documented in this campaign.

Audit and review third-party software and remote management agent deployments in client environments. MSP agents installed for legitimate purposes can be supplemented with additional tooling once an MSP environment is compromised.

Apply network segmentation to limit lateral movement from MSP access points into broader client environments. Systems accessible via a single MSP credential set represent an expanded exposure surface.

Review CISA Alert AA21-200B and related government advisories for current APT10 indicators and detection guidance applicable to MSP environments.

## Sources & References

- [UK NCSC: NCSC Supports DOJ Indictment of Two Chinese Nationals](https://www.ncsc.gov.uk/news/ncsc-supports-doj-indictment-of-two-chinese-nationals) — UK NCSC, 2018-12-20
- [CISA: Alert AA21-200B — Chinese State-Sponsored Cyber Operations: Observed TTPs](https://www.cisa.gov/uscert/ncas/alerts/aa21-200b) — CISA, 2021-07-19
- [PwC: Operation Cloud Hopper Technical Report](https://www.pwc.com/gx/en/issues/cybersecurity/cyber-threat-intelligence/operation-cloud-hopper.html) — PwC, 2017-04-03
