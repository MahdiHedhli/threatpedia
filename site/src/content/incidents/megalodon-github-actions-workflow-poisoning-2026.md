---
eventId: "TP-2026-1859"
title: "Megalodon GitHub Actions repository workflow poisoning campaign"
date: 2026-05-18
attackType: "Supply Chain"
severity: medium
sector: "Technology"
geography: "Global"
threatActor: "Unknown"
attributionConfidence: A6
reviewStatus: "draft_ai"
confidenceGrade: C
generatedBy: "ai_ingestion"
generatedDate: 2026-06-23
tags:
  - "grounded-draft"
  - "incident"
  - "supply-chain"
sources:
  - url: "https://www.stepsecurity.io/blog/megalodon-mass-github-actions-secret-exfiltration-across-5-500-public-repositories"
    publisher: "StepSecurity"
    publisherType: research
    reliability: R1
    publicationDate: "2026-06-23"
    archived: false
  - url: "https://www.cisa.gov/news-events/alerts/2026/05/28/supply-chain-compromises-impact-nx-console-and-github-repositories"
    publisher: "Cybersecurity and Infrastructure Security Agency"
    publisherType: government
    reliability: R1
    publicationDate: "2026-06-23"
    archived: false
  - url: "https://labs.cloudsecurityalliance.org/research/csa-research-note-megalodon-github-actions-cicd-supply-chain/"
    publisher: "Cloud Security Alliance"
    publisherType: research
    reliability: R1
    publicationDate: "2026-06-23"
    archived: false
  - url: "https://www.securityweek.com/over-5500-github-repositories-infected-in-megalodon-supply-chain-attack/"
    publisher: "SecurityWeek"
    publisherType: media
    reliability: R2
    publicationDate: "2026-06-23"
    archived: false
mitreMappings:
  - techniqueId: "T1195.002"
    techniqueName: "Compromise Software Supply Chain"
    tactic: "Initial Access"
    confidence: probable
    evidence: "Included from grounded source packet MITRE candidates."
---
## Summary

<!-- claims: claim-2 --> The Megalodon campaign inserted malicious GitHub Actions workflows into thousands of public repositories to harvest CI/CD secrets and cloud credentials through automated commit activity.

## Technical Analysis

<!-- claims: claim-9 --> On May 18, 2026, a large-scale supply chain attack campaign tracked as Megalodon injected malicious GitHub Actions workflows into over 5,500 open-source repositories within a single six-hour window.
<!-- claims: claim-10 --> Additionally, in a campaign known as “Megalodon,” a cyber threat actor injected malicious GitHub Action workflows to harvest CI/CD secrets, cloud credentials, and tokens, impacting both development and deployment pipelines in public GitHub repositories.
<!-- claims: claim-11 --> [1][2] Megalodon succeeded at scale because thousands of targeted repositories lacked branch protection on .github/workflows/ , granted broad write permissions to external contributors, and stored production secrets in over-privileged CI runner environments.
<!-- claims: claim-12 --> The campaign, dubbed Megalodon, relies on GitHub Actions workflows containing a payload designed to steal credentials, keys, tokens, and other secrets.

## Attack Chain

<!-- claims: claim-9 --> On May 18, 2026, a large-scale supply chain attack campaign tracked as Megalodon injected malicious GitHub Actions workflows into over 5,500 open-source repositories within a single six-hour window.
<!-- claims: claim-10 --> Additionally, in a campaign known as “Megalodon,” a cyber threat actor injected malicious GitHub Action workflows to harvest CI/CD secrets, cloud credentials, and tokens, impacting both development and deployment pipelines in public GitHub repositories.
<!-- claims: claim-11 --> [1][2] Megalodon succeeded at scale because thousands of targeted repositories lacked branch protection on .github/workflows/ , granted broad write permissions to external contributors, and stored production secrets in over-privileged CI runner environments.
<!-- claims: claim-12 --> The campaign, dubbed Megalodon, relies on GitHub Actions workflows containing a payload designed to steal credentials, keys, tokens, and other secrets.

## Impact Assessment

<!-- claims: claim-1 --> The source packet does not establish additional packet-backed facts for this section.

## Attribution

<!-- claims: claim-7 --> The source packet links this candidate to existing actor TeamPCP.
<!-- claims: claim-8 --> The source packet links this candidate to existing campaign Megalodon Supply-Chain Intrusion Campaign in GitHub and npm.

## Timeline

<!-- claims: claim-1 --> The source packet does not establish a complete public timeline.

## Remediation & Mitigation

<!-- claims: claim-1 --> The source packet does not establish additional packet-backed facts for this section.

## Sources & References

- [StepSecurity: Megalodon: Mass GitHub Actions Secret Exfiltration Across 5,500+ Public Repositories - StepSecurity](https://www.stepsecurity.io/blog/megalodon-mass-github-actions-secret-exfiltration-across-5-500-public-repositories) — StepSecurity, 2026-06-23
- [Cybersecurity and Infrastructure Security Agency: Supply Chain Compromises Impact Nx Console and GitHub Repositories \| CISA](https://www.cisa.gov/news-events/alerts/2026/05/28/supply-chain-compromises-impact-nx-console-and-github-repositories) — Cybersecurity and Infrastructure Security Agency, 2026-06-23
- [Cloud Security Alliance: Megalodon: Mass CI/CD Pipeline Poisoning via GitHub Actions &#8211; Lab Space](https://labs.cloudsecurityalliance.org/research/csa-research-note-megalodon-github-actions-cicd-supply-chain/) — Cloud Security Alliance, 2026-06-23
- [SecurityWeek: Over 5,500 GitHub Repositories Infected in &#039;Megalodon&#039; Supply Chain Attack - SecurityWeek](https://www.securityweek.com/over-5500-github-repositories-infected-in-megalodon-supply-chain-attack/) — SecurityWeek, 2026-06-23
