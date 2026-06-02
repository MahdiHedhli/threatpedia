---
campaignId: "TP-CAMP-2026-0010"
title: "Megalodon Supply-Chain Intrusion Campaign in GitHub and npm"
startDate: 2026-05-18
endDate: 2026-05-28
ongoing: false
attackType: "Software Supply Chain Compromise / CI Workflow Hijack"
severity: high
sector: "Software development / source-code hosting"
geography: "Global"
threatActor: "Unknown"
attributionConfidence: A5
description: "Campaign involved mass insertion of malicious GitHub Action workflows across open-source repositories."
reviewStatus: "draft_ai"
confidenceGrade: C
generatedBy: "dangermouse-bot"
generatedDate: 2026-06-02
cves: []
relatedIncidents: []
tags:
  - "megalodon"
  - "github-actions"
  - "ci-cd"
  - "supply-chain"
  - "npm"
  - "open-source"
  - "workflow-tampering"
sources:
  - url: "https://safedep.io/megalodon-mass-github-repo-backdooring-ci-workflows"
    publisher: "SafeDep"
    publisherType: vendor
    reliability: R2
    publicationDate: "2026-06-01"
    accessDate: "2026-06-02"
    archived: false
  - url: "https://cybernews.com/security/megalodon-github-5000-repos-backdooring-supply-chain-attack/"
    publisher: "CyberNews"
    publisherType: media
    reliability: R2
    publicationDate: "2026-05-22"
    accessDate: "2026-06-02"
    archived: false
  - url: "https://www.cisa.gov/news-events/alerts/2026/05/28/supply-chain-compromises-impact-nx-console-and-github-repositories"
    publisher: "Cybersecurity and Infrastructure Security Agency"
    publisherType: government
    reliability: R1
    publicationDate: "2026-05-28"
    accessDate: "2026-06-02"
    archived: false
mitreMappings:
  - techniqueId: "T1059"
    techniqueName: "Command and Scripting Interpreter"
    tactic: "Execution"
    confidence: probable
    evidence: "Reports describe injected GitHub Actions workflow files that execute commands in CI/CD contexts when commits are triggered, enabling payload execution through repository automation."
  - techniqueId: "T1090"
    techniqueName: "Proxy"
    tactic: "Command and Control"
    confidence: possible
    evidence: "Threat reporting references use of external infrastructure for workflow-hosted payloading and data exfiltration, which can function as intermediary command-and-control traffic paths in some environments."
  - techniqueId: "T1071.001"
    techniqueName: "Web Protocols"
    tactic: "Command and Control"
    confidence: possible
    evidence: "Campaign descriptions indicate secrets and tokens were exfiltrated by workflow tasks over common web transport channels used by CI systems."
---

## Executive Summary

Threat reporting identifies a coordinated operation dubbed **Megalodon** that modified a large number of public GitHub repositories through CI workflow files. Public reporting describes a wave of activity around **18 May 2026**, with SafeDep reporting over **5,700 malicious commits** and CyberNews describing a spread across **roughly 5,000+ repositories** in a short time window.

The reporting points to tampered GitHub Action workflows as the primary delivery mechanism, with the activity characterized as a software supply-chain intrusion pattern that can contaminate downstream packaging and deployment chains.

## Technical Analysis

The observed pattern shows malicious workflow modifications inserted into multiple repositories so that code execution occurs automatically during CI events. Source reporting states that these workflow replacements were designed to harvest CI/CD secrets and cloud credentials from trusted automation contexts.

SafeDep and CyberNews both describe automated, large-scale repository churn with many workflow file edits and commit-level tampering, which is consistent with campaign-style automation rather than a single victim breach.

## Attack Chain

### Stage 1: Workflow Injection in Build/CI Configuration

Attackers appear to have modified workflow configuration files to alter normal repository automation behavior, replacing expected build steps with malicious workflow logic.

### Stage 2: Secret and Token Collection

Modified workflows are reported to target CI/CD secrets, cloud credentials, and tokens in some cases, creating a high-value credential exposure point in development environments.

### Stage 3: Downstream Cascade via Distribution Channels

The reporting indicates impacted repositories and packages moved beyond GitHub into broader package ecosystems, including npm package versions carrying backdoored components tied to affected repositories.

### Stage 4: Repetition Across Public Repositories

The campaign-style language and scale indicate repeated reuse of the same workflow abuse model across many target repositories, rather than one-off, isolated repository compromise.

## MITRE ATT&CK Mapping

T1059 - Command and Scripting Interpreter: Workflow execution in CI systems reflects attacker-controlled scripting and command execution at build/deployment time.

T1090 - Proxy: Where present, external command infrastructure and traffic paths support proxy-like relay behavior in operational handling of stolen credentials and command flow.

T1071.001 - Web Protocols: Exfiltration and remote coordination in web-based automation pipelines commonly use HTTPS or related web protocols, matching campaign reporting language around web-channel telemetry and transport.

## Timeline

### 2026-05-18 — Mass Workflow Tampering Window

SafeDep attributed a major burst of malicious commits around this date, with a volume indicating campaign-scale automation in repositories.

### 2026-05-22 — Public Reporting Expands

CyberNews reported a similarly large repository impact window and emphasized the supply-chain spread into package registries.

### 2026-05-28 — U.S. Government Acknowledgment

CISA included Megalodon in its supply-chain-focused alerting context, linking the campaign to the broader CI/CD, extension, and workflow abuse trend and recommending urgent defensive actions.

## Remediation & Mitigation

### Impact and Reach

Campaign impact is reported at two layers:

- **Repository layer**: widespread workflow file compromise in public GitHub repositories.
- **Distribution layer**: potential continuation into package ecosystems through compromised repository outputs.

Attribution remains uncertain in the public reporting, and the number of fully confirmed downstream victims varies by report. For this reason, this entry keeps claims bounded to confirmed repository-scale and campaign-pattern indicators.

### Detection and Remediation Signals

Defenders should monitor automated workflow changes and privilege-bearing CI identities with high confidence in unusual author patterns, especially sudden bulk changes to CI config files. Immediate controls include

- restricting workflow permissions, secrets scope, and token usage;
- tracking unusual token usage or access from CI systems;
- validating build artifacts and package outputs before release;
- rotating tokens tied to compromised repositories and connected package publish paths.

## Sources & References

- [SafeDep: Megalodon: Mass GitHub Repo Backdooring via CI Workflows](https://safedep.io/megalodon-mass-github-repo-backdooring-ci-workflows) — SafeDep, 2026-06-01
- [CyberNews: Megalodon stalks over 5,000 GitHub repos in new assault on open source](https://cybernews.com/security/megalodon-github-5000-repos-backdooring-supply-chain-attack/) — CyberNews, 2026-05-22
- [Cybersecurity and Infrastructure Security Agency: Supply Chain Compromises Impact Nx Console and GitHub Repositories](https://www.cisa.gov/news-events/alerts/2026/05/28/supply-chain-compromises-impact-nx-console-and-github-repositories) — Cybersecurity and Infrastructure Security Agency, 2026-05-28
