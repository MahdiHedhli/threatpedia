---
eventId: "TP-2026-1192"
title: "Checkmarx Jenkins AST plugin supply-chain compromise"
date: 2026-05-09
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
  - url: "https://checkmarx.com/blog/ongoing-security-updates/"
    publisher: "Checkmarx"
    publisherType: vendor
    reliability: R1
    publicationDate: "2026-06-04"
    archived: false
  - url: "https://www.sysdig.com/blog/teampcp-expands-supply-chain-compromise-spreads-from-trivy-to-checkmarx-github-actions"
    publisher: "Sysdig"
    publisherType: research
    reliability: R1
    publicationDate: "2026-03-23"
    archived: false
  - url: "https://thehackernews.com/2026/05/teampcp-compromises-checkmarx-jenkins.html"
    publisher: "The Hacker News"
    publisherType: media
    reliability: R2
    publicationDate: "2026-05-11"
    archived: false
mitreMappings:
  - techniqueId: "T1195.002"
    techniqueName: "Compromise Software Supply Chain"
    tactic: "Initial Access"
    confidence: probable
    evidence: "Mapped from cited source claims."
---
## Summary

<!-- claims: claim-2 --> Checkmarx reported that attackers used access traced to the Trivy supply-chain attack to publish malicious developer-tooling artifacts, including a modified Jenkins AST plugin.

## Technical Analysis

<!-- claims: claim-9 --> This access enabled the publication of malicious code to a number of externally distributed artifacts, including VS Code extensions, GitHub Actions workflows, and a Jenkins plugin.
<!-- claims: claim-11 --> What has not yet been publicly reported is that the same attack pattern subsequently appeared in a second, unrelated GitHub Action for Checkmarx&#x27;s AST .

## Attack Chain

<!-- claims: claim-1 --> Available sources do not establish a detailed attack chain.

## Impact Assessment

<!-- claims: claim-1 --> Available sources do not establish additional facts for this section.

## Attribution

<!-- claims: claim-7 --> Available source evidence connects this incident to actor TeamPCP.
<!-- claims: claim-8 --> Available source evidence connects this incident to campaign TeamPCP Multi-Ecosystem Supply Chain Campaign.

## Timeline

<!-- claims: claim-1 --> Available sources do not establish a complete public timeline.

## Remediation & Mitigation

<!-- claims: claim-10 --> "If you are using Checkmarx Jenkins AST plugin, you need to ensure that you are using the version 2.0.13-829.vc72453fa_1c16 that was published on December 17, 2025 or previously," the cybersecurity company said in a statement over the weekend.

## Sources & References

- [Checkmarx: Update: Ongoing Checkmarx Supply Chain Security Incident](https://checkmarx.com/blog/ongoing-security-updates/) — Checkmarx, 2026-06-04
- [Sysdig: TeamPCP expands: Supply chain compromise spreads from Trivy to Checkmarx GitHub Actions \| Sysdig](https://www.sysdig.com/blog/teampcp-expands-supply-chain-compromise-spreads-from-trivy-to-checkmarx-github-actions) — Sysdig, 2026-03-23
- [The Hacker News: TeamPCP Compromises Checkmarx Jenkins AST Plugin Weeks After KICS Supply Chain Attack](https://thehackernews.com/2026/05/teampcp-compromises-checkmarx-jenkins.html) — The Hacker News, 2026-05-11
