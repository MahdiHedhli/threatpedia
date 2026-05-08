---
eventId: TP-2026-0055
title: "TeamPCP Supply Chain Attack: Trivy GitHub Actions Compromise"
date: 2026-03-19
attackType: Supply Chain
severity: critical
sector: Technology
geography: Global
threatActor: TeamPCP
attributionConfidence: A2
reviewStatus: draft_ai
confidenceGrade: B
generatedBy: dangermouse-bot
generatedDate: 2026-05-08
cves:
  - "CVE-2026-33634"
relatedSlugs:
  - "cisco-trivy-supply-chain-breach-2026"
  - "european-commission-trivy-breach-2026"
  - "mercor-litellm-supply-chain-breach-2026"
tags:
  - "supply-chain"
  - "github-actions"
  - "trivy"
  - "cicd"
  - "credential-theft"
  - "teampcp"
  - "cloud-stealer"
  - "kubernetes"
  - "open-source-poisoning"
sources:
  - url: "https://arcticwolf.com/resources/blog/teampcp-supply-chain-attack-campaign-targets-trivy-checkmarx-kics-and-litellm-potential-downstream-impact-to-additional-projects/"
    publisher: "Arctic Wolf"
    publisherType: research
    reliability: R1
    publicationDate: "2026-03-25"
    accessDate: "2026-05-08"
    archived: false
  - url: "https://www.kaspersky.com/blog/critical-supply-chain-attack-trivy-litellm-checkmarx-teampcp/55510/"
    publisher: "Kaspersky"
    publisherType: research
    reliability: R1
    publicationDate: "2026-03-24"
    accessDate: "2026-05-08"
    archived: false
  - url: "https://thehackernews.com/2026/03/trivy-hack-spreads-infostealer-via.html"
    publisher: "The Hacker News"
    publisherType: media
    reliability: R2
    publicationDate: "2026-03-22"
    accessDate: "2026-05-08"
    archived: false
  - url: "https://sysdig.com/blog/teampcp-expands-supply-chain-compromise-spreads-from-trivy-to-checkmarx-github-actions/"
    publisher: "Sysdig"
    publisherType: research
    reliability: R1
    publicationDate: "2026-03-26"
    accessDate: "2026-05-08"
    archived: false
  - url: "https://www.cisa.gov/known-exploited-vulnerabilities-catalog?field_cve=CVE-2026-33634"
    publisher: "CISA"
    publisherType: government
    reliability: R1
    publicationDate: "2026-03-26"
    accessDate: "2026-05-08"
    archived: false
mitreMappings:
  - techniqueId: "T1195.002"
    techniqueName: "Compromise Software Supply Chain"
    tactic: "Initial Access"
    notes: "TeamPCP force-pushed malicious code to 76 of 77 version tags in the aquasecurity/trivy-action repository and all 7 tags in aquasecurity/setup-trivy, poisoning an open source security scanning tool and its associated GitHub Action."
  - techniqueId: "T1552.001"
    techniqueName: "Credentials In Files"
    tactic: "Credential Access"
    notes: "The TeamPCP Cloud Stealer payload swept CI/CD runner environments for SSH keys, cloud provider credentials (AWS, GCP, Azure), Kubernetes secrets, and other stored credentials written to disk or exposed in runner process memory."
  - techniqueId: "T1567.001"
    techniqueName: "Exfiltration to Code Repository"
    tactic: "Exfiltration"
    notes: "As a fallback exfiltration channel when the primary C2 was unavailable, the stealer created a repository named tpcp-docs inside the victim organization's own GitHub account and wrote stolen secrets there."
  - techniqueId: "T1059"
    techniqueName: "Command and Scripting Interpreter"
    tactic: "Execution"
    notes: "The weaponized Trivy binary and GitHub Actions workflow executed shell commands on CI/CD runners to harvest credentials, enumerate environment variables, and stage the collected data for exfiltration."
  - techniqueId: "T1584"
    techniqueName: "Compromise Infrastructure"
    tactic: "Resource Development"
    notes: "TeamPCP compromised the official Trivy distribution infrastructure across GitHub Releases, Docker Hub, GitHub Container Registry (GHCR), Amazon ECR Public, and deb/rpm package repositories to distribute the malicious binary across official channels."
---

## Summary

On March 19, 2026, a threat actor tracked as TeamPCP executed a coordinated supply chain attack against the Trivy open source vulnerability scanner, compromising its official GitHub Actions workflows and distribution infrastructure. The attack, assigned CVE-2026-33634 with a CVSS4B score of 9.4, allowed malicious code to execute inside CI/CD pipelines of any organization using the compromised Trivy actions or downloading the weaponized binary releases. Over the following days, the same actor expanded the campaign to additional open source security tooling including Checkmarx KICS, LiteLLM, and Telnyx.

The attack resulted in credential theft from CI/CD environments across more than 1,000 enterprise software-as-a-service environments, according to subsequent industry reporting. Stolen credentials later surfaced in double-extortion operations conducted by a separate group, Vect ransomware, confirming that harvested data was monetized through downstream criminal channels.

## Technical Analysis

TeamPCP conducted a force-push against the aquasecurity/trivy-action GitHub repository, overwriting 76 of 77 version tags with malicious commits. All 7 tags in the companion aquasecurity/setup-trivy repository were similarly overwritten. Organizations whose CI/CD pipelines pinned to version tags rather than immutable commit SHAs automatically fetched and executed the attacker-controlled workflow definitions.

Simultaneously, a weaponized Trivy binary (version v0.69.4) was published to the official Trivy distribution channels: GitHub Releases, Docker Hub, GitHub Container Registry, Amazon ECR Public, and the Debian and RPM package repositories. Organizations pulling the binary by version string from any of these sources received the malicious build.

The embedded payload, referred to as TeamPCP Cloud Stealer in industry reporting, was purpose-built for CI/CD runner environments. It performed the following operations on each infected runner:

- Dumped process memory from the GitHub Actions runner process to capture in-memory secrets and tokens
- Swept the filesystem and environment for SSH private keys, cloud provider credential files (AWS credentials, service account JSON files, kubeconfig files), and Kubernetes secrets
- Enumerated repository-level and organization-level GitHub Actions secrets accessible from the compromised runner context
- Encrypted harvested data using AES-256 and RSA-4096 before exfiltrating to attacker-controlled infrastructure
- When the primary command-and-control channel was unavailable, created a repository named `tpcp-docs` inside the victim organization's own GitHub namespace and committed stolen secrets there as a fallback exfiltration path

Approximately four days after the initial Trivy poisoning, Sysdig researchers observed an identical credential stealer executing through the Checkmarx/ast-github-action GitHub Action, consistent with stolen CI/CD credentials from the Trivy compromise being reused to poison additional upstream tooling. LiteLLM and Telnyx distributions were compromised in the same campaign window.

## Attack Chain

The attack exploited the trust relationship between open source security tooling and the enterprise CI/CD pipelines that consume it. Organizations integrating Trivy for vulnerability scanning in their pipelines granted the scanner execution access to their build environments. When TeamPCP overwrote the version tags for the official GitHub Actions, any subsequent pipeline run that referenced those tags downloaded and executed attacker-controlled code with the full permissions granted to the Trivy workflow step, including access to secrets injected into the runner environment.

The credential harvesting phase proceeded silently within normal pipeline execution. Because CI/CD pipelines routinely make network connections and handle secrets, the exfiltration traffic did not generate anomalous signals in environments lacking CI/CD-specific behavioral monitoring. The fallback exfiltration path — creating a repository inside the victim's own GitHub organization — further evaded detection by appearing as a routine repository creation event.

## Impact Assessment

CVE-2026-33634 was assigned a CVSS4B score of 9.4, reflecting the severity of a supply chain compromise affecting a widely deployed security scanning tool. Aqua Security reported that Trivy was in use by more than 20,000 organizations at the time of the compromise. The attack reached CI/CD environments across multiple industry sectors, with downstream victims including technology companies, financial institutions, and public sector organizations documented in subsequent reporting.

Industry analysis identified more than 1,000 enterprise SaaS environments as having been affected by credential theft during the campaign window. The subsequent involvement of Vect ransomware in publishing stolen victim data confirmed that harvested credentials were transferred to or sold to criminal operators conducting double-extortion campaigns.

## Attribution

The campaign is attributed to a threat actor tracked as TeamPCP. Some security vendors have associated TeamPCP with UNC5537, a financially motivated cluster also linked to the ShinyHunters persona, based on infrastructure overlaps, tooling similarities, and operational patterns consistent with prior credential-theft-to-extortion campaigns. Attribution is assessed with high confidence based on malware family identification and multiple independent vendor analyses, though the relationship between TeamPCP, UNC5537, and the ShinyHunters brand has not been formally confirmed by a government or law enforcement source at the time of this writing.

## Timeline

| Date | Event |
|---|---|
| 2026-03-19 | TeamPCP force-pushes malicious commits to aquasecurity/trivy-action (76/77 tags) and aquasecurity/setup-trivy (all 7 tags); weaponized v0.69.4 binary distributed via all official channels. |
| 2026-03-19–22 | TeamPCP Cloud Stealer executes in CI/CD environments of organizations running affected Trivy pipelines; credential harvesting begins. |
| ~2026-03-22 | Sysdig detects anomalous activity; initial public reporting begins. |
| ~2026-03-23 | Aqua Security removes malicious tags and releases; issues security advisory for CVE-2026-33634. |
| ~2026-03-23 | TeamPCP pivots to Checkmarx/ast-github-action using credentials stolen from Trivy campaign victims; LiteLLM and Telnyx distributions also compromised. |
| 2026-03-24–26 | Kaspersky, Arctic Wolf, and Sysdig publish detailed technical analyses of the campaign scope and payload. |
| 2026-04 onward | Vect ransomware group begins publishing victim data obtained from the March 2026 TeamPCP campaign, confirming escalation to double-extortion operations. |

## Remediation & Mitigation

Organizations that ran CI/CD pipelines using aquasecurity/trivy-action or aquasecurity/setup-trivy version tags between March 19 and March 23, 2026, or that downloaded Trivy v0.69.4, should treat all secrets exposed in those runner environments as compromised and rotate them immediately. This includes GitHub Actions secrets, cloud provider credentials, SSH keys, Kubernetes service account tokens, and any other secrets accessible from the affected runners.

To prevent recurrence of tag-pinning supply chain attacks, organizations should pin third-party GitHub Actions to immutable commit SHAs rather than mutable version tags or branch names. Pinning to a SHA ensures that only the exact reviewed commit is executed, regardless of tag reassignment. Dependency review automation can enforce this policy at PR creation time.

CI/CD pipeline security hygiene measures include restricting the secrets available to each workflow step to the minimum required, using short-lived credentials and OIDC-based authentication rather than long-lived stored secrets, and monitoring pipeline execution logs and network traffic for anomalous credential access or exfiltration patterns.

For the fallback exfiltration technique, organizations should monitor for unexpected repository creation events within their GitHub organization, particularly repositories created by CI workflow identities or service accounts.

## Sources & References

- [Arctic Wolf: TeamPCP Supply Chain Attack Campaign Targets Trivy, Checkmarx, and LiteLLM](https://arcticwolf.com/resources/blog/teampcp-supply-chain-attack-campaign-targets-trivy-checkmarx-kics-and-litellm-potential-downstream-impact-to-additional-projects/) — Arctic Wolf, 2026-03-25
- [Kaspersky: Trojanization of Trivy, Checkmarx, and LiteLLM Solutions](https://www.kaspersky.com/blog/critical-supply-chain-attack-trivy-litellm-checkmarx-teampcp/55510/) — Kaspersky, 2026-03-24
- [The Hacker News: Trivy Hack Spreads Infostealer via Docker, Triggers Worm and Kubernetes Wiper](https://thehackernews.com/2026/03/trivy-hack-spreads-infostealer-via.html) — The Hacker News, 2026-03-22
- [Sysdig: TeamPCP Expands — Supply Chain Compromise Spreads from Trivy to Checkmarx GitHub Actions](https://sysdig.com/blog/teampcp-expands-supply-chain-compromise-spreads-from-trivy-to-checkmarx-github-actions/) — Sysdig, 2026-03-26
- [CISA: Aquasecurity Trivy Embedded Malicious Code Vulnerability (CVE-2026-33634)](https://www.cisa.gov/known-exploited-vulnerabilities-catalog?field_cve=CVE-2026-33634) — CISA, 2026-03-26
