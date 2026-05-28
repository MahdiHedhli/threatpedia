---
eventId: TP-2026-0326
title: "GitHub Internal Repository Theft via Compromised Nx Console VS Code Extension (May 2026)"
date: 2026-05-18
attackType: supply-chain
severity: high
sector: Software development / source-code hosting
geography: Global
threatActor: Unknown
attributionConfidence: A4
reviewStatus: draft_ai
confidenceGrade: B
generatedBy: dangermouse-bot
generatedDate: 2026-05-28
cves: []
relatedSlugs: []
tags:
  - github
  - nx-console
  - vscode-extension
  - supply-chain
  - credential-theft
  - repository-exfiltration
mitreMappings:
  - techniqueId: "T1195.002"
    techniqueName: "Compromise Software Supply Chain"
    tactic: "Initial Access"
    notes: "Attack path involved a compromised third-party development extension and downstream credential abuse."
  - techniqueId: "T1552.001"
    techniqueName: "Credentials In Files"
    tactic: "Credential Access"
    notes: "Advisory text describes credential harvesting by malicious extension payload."
  - techniqueId: "T1567"
    techniqueName: "Exfiltration Over Web Service"
    tactic: "Exfiltration"
    notes: "GitHub reported exfiltration activity affecting GitHub internal repositories."
sources:
  - url: "https://www.cisa.gov/resources-tools/resources/defending-against-software-supply-chain-attacks-0"
    publisher: "Cybersecurity and Infrastructure Security Agency"
    publisherType: government
    reliability: R1
    publicationDate: "2023-11-21"
    accessDate: "2026-05-28"
    archived: false
  - url: "https://github.blog/security/investigating-unauthorized-access-to-githubs-internal-repositories/"
    publisher: "GitHub Blog"
    publisherType: vendor
    reliability: R1
    publicationDate: "2026-05-20"
    accessDate: "2026-05-28"
    archived: false
  - url: "https://github.com/nrwl/nx-console/security/advisories/GHSA-c9j4-9m59-847w"
    publisher: "GitHub Advisory Database"
    publisherType: vendor
    reliability: R1
    publicationDate: "2026-05-17"
    accessDate: "2026-05-28"
    archived: false
  - url: "https://risky.biz/risky-bulletin-microsoft-ends-sms-mfa-for-personal-accounts"
    publisher: "Risky Business"
    publisherType: media
    reliability: R2
    publicationDate: "2026-05-22"
    accessDate: "2026-05-28"
    archived: false
---

## Summary

GitHub disclosed unauthorized access to internal repositories after compromise of an employee device linked to a poisoned third-party VS Code extension (Nx Console 18.95.0). GitHub stated the activity involved exfiltration of GitHub-internal repositories and reported no evidence of direct impact to customer repositories outside internal systems at time of disclosure.

## Technical Analysis

The Nx Console advisory describes a brief malicious publication window for compromised extension version `18.95.0` and attributes the publisher-side compromise chain to stolen credentials from an earlier supply-chain event. The advisory also documents extension payload behavior that harvested credentials and fetched additional code.

GitHub reported containment actions including endpoint isolation, incident response activation, and rapid rotation of critical secrets. Public updates indicate the investigation remained active while initial scoping and notifications progressed.

## Attack Chain

### Stage 1: Upstream extension compromise

A malicious Nx Console extension build was published briefly to extension distribution channels.

### Stage 2: Developer endpoint compromise

A GitHub employee installed the compromised extension, resulting in endpoint compromise.

### Stage 3: Credential misuse and internal access

Stolen or exposed credentials were used to access GitHub internal systems and repositories.

### Stage 4: Internal repository exfiltration

GitHub reported exfiltration of internal repositories, with attacker claims of repository volume described as directionally consistent with GitHub's ongoing investigation.

## Impact Assessment

The incident affected GitHub internal repositories and introduced risk to internal code and support-interaction excerpts contained in those repositories. GitHub stated there was no evidence of impact to customer repositories and enterprise data stores outside internal repository scope at the time of the cited updates.

This event also highlights software supply-chain risk through development tooling, especially extension ecosystems and identity/token exposure in developer workflows.

## Attribution

**Threat actor: Unknown.** Public reporting and disclosures describe intrusion mechanics and impact but do not provide sufficient high-confidence attribution to a named actor.

## Timeline

### 2026-05-18 - Compromise detection and containment

GitHub reported detecting and containing compromise tied to poisoned VS Code extension activity.

### 2026-05-20 - Initial public disclosure

GitHub published incident details and initial scope assessment; Nx Console advisory documented malicious extension publication windows and indicators.

### 2026-05-26 - Disclosure update

GitHub posted update noting ongoing investigation and continued response actions.

## Remediation & Mitigation

- Remove compromised extension version `18.95.0` and update Nx Console to vendor-recommended safe releases.
- Rotate potentially exposed credentials from clean systems, prioritizing CI/CD and source-control tokens.
- Audit extension and build-agent telemetry for suspicious outbound behavior and unauthorized workflow activity.
- Strengthen release controls and multi-party approval for extension and package publishing pipelines.

## Sources & References

- [Cybersecurity and Infrastructure Security Agency: Defending Against Software Supply Chain Attacks](https://www.cisa.gov/resources-tools/resources/defending-against-software-supply-chain-attacks-0) — Cybersecurity and Infrastructure Security Agency, 2023-11-21
- [GitHub Blog: Investigating unauthorized access to GitHub's internal repositories](https://github.blog/security/investigating-unauthorized-access-to-githubs-internal-repositories/) — GitHub Blog, 2026-05-20
- [GitHub Advisory Database: Compromised Nx Console version 18.95.0 (GHSA-c9j4-9m59-847w)](https://github.com/nrwl/nx-console/security/advisories/GHSA-c9j4-9m59-847w) — GitHub Advisory Database, 2026-05-17
- [Risky Business: Microsoft ends SMS MFA for personal accounts](https://risky.biz/risky-bulletin-microsoft-ends-sms-mfa-for-personal-accounts) — Risky Business, 2026-05-22
