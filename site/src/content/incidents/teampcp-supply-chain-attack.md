---
eventId: TP-2026-0055
title: TeamPCP Supply Chain Attack Campaign
date: 2026-02-28
attackType: supply-chain
severity: critical
sector: Technology / DevOps
geography: Global
threatActor: TeamPCP (DeadCatx3 / PCPcat / ShellForce)
attributionConfidence: A4
reviewStatus: certified
confidenceGrade: C
generatedBy: dangermouse-bot
generatedDate: 2026-02-28
cves:
  - "CVE-2026-33634"
relatedSlugs:
  - "axios-unc1069-compromise"
  - "european-commission-trivy-breach-2026"
  - "trivy-cve-2026-33634"
  - "shiny-hunters-leak-site"
  - "drift-protocol-dprk-exploit-2026"
  - "cisco-trivy-supply-chain-breach-2026"
tags:
  - "github-actions"
  - "pypi"
  - "supply-chain"
  - "cicd"
  - "credential-theft"
  - "litellm"
  - "telnyx"
  - "kics"
  - "docker-hub"
  - "openvsx"
  - "canisterworm"
  - "cisa-kev"
---
## Executive Summary

TeamPCP, a sophisticated threat actor collective also known as DeadCatx3, PCPcat, and ShellForce, orchestrated the largest multi-ecosystem supply chain attack of 2026, a coordinated campaign from late February through March 2026. The operation compromised critical development infrastructure across five major ecosystems: GitHub Actions, Docker Hub, npm, OpenVSX extension marketplaces, and PyPI package repositories.
The attackers leveraged stolen GitHub tokens and residual access to force-push malicious commits to trusted version tags and releases, redirecting millions of automated deployments to exfiltrate sensitive credentials, SSH keys, and cloud secrets from CI/CD runners. The campaign affected at least 474 public repositories directly, with an estimated downstream impact exceeding 1,750 Python packages, numerous Docker images, and countless infrastructure deployments worldwide.
The "TeamPCP Cloud Stealer" payload—deployed via malicious GitHub Actions and PyPI packages—targeted runner environment memory, harvesting AWS, GCP, Azure, and Kubernetes credentials with sophisticated encryption (AES-256 + RSA-4096) and exfiltration protocols. This represents the most extensive supply chain compromise in modern software development history, exceeding the scope and sophistication of previous attacks like SolarWinds.

## Timeline

February 27, 2026

Initial Compromise: TeamPCP gains access to Aqua Security's GitHub Actions infrastructure through misconfigured service account credentials. The attack vector involved exposed environment variables in workflow logs and inadequate token rotation policies. Initial access point is trivy-action repository.

March 1, 2026

Disclosure & Incomplete Rotation: Aqua Security detects anomalous activity and discloses the incident. Token rotation is initiated but proves incomplete—the attackers maintain persistent access through secondary credentials and branch protection bypass techniques. Investigators later determine that residual PAT (Personal Access Tokens) were not fully revoked.

March 19, 2026

Aqua Security trivy-action Compromise: TeamPCP compromises the aqua-bot service account and executes force-push attacks against 76 out of 77 version tags in the trivy-action repository. Trusted semantic version tags (v1.0.0, v2.10.0, etc.) are redirected to commits containing malicious payloads, affecting thousands of CI/CD pipelines that reference these pinned versions.

March 19, 2026 (continued)

Setup-Trivy Tags Compromised: All 7 version tags in the setup-trivy repository are similarly weaponized, providing an additional attack vector for credential exfiltration from build environments.

March 23, 2026 — 12:58-16:50 UTC

Checkmarx KICS Compromise: The Checkmarx KICS GitHub Action service account is compromised. Attackers hijack 35 version tags across multiple releases. The Checkmarx OpenVSX extensions (cx-dev-assist 1.7.0, ast-results 2.53.0) and ast-github-action tag 2.3.28 are similarly weaponized. The cx-plugins-releases service account is used to deploy malicious artifacts.

March 24, 2026

LiteLLM PyPI Compromise: Using stolen credentials from the Aqua Security compromise, TeamPCP publishes malicious LiteLLM versions 1.82.7 and 1.82.8 on PyPI containing the TeamPCP Cloud Stealer payload. LiteLLM receives approximately 3.4 million downloads per day; the poisoned versions circulate to an estimated 1,750 downstream Python packages before detection.

March 25, 2026

CISA KEV Entry: The Trivy vulnerability (CVE-2026-33634) exploited by TeamPCP is formally added to the CISA Known Exploited Vulnerabilities (KEV) catalog with a remediation deadline of April 8, 2026.

March 27, 2026

Telnyx PyPI Package Compromise: TeamPCP publishes a malicious Telnyx package on PyPI using the stolen credentials, extending the attack surface to additional downstream Python dependencies and expanding the multi-ecosystem compromise.

March 27, 2026 (continued)

KICS GitHub Action Compromise Confirmed: Per intelligence from Wiz.io, the KICS GitHub Action service account is also compromised, allowing TeamPCP to weaponize security scanning infrastructure deployed across enterprise CI/CD pipelines.

March 30, 2026

Ongoing Investigation: Security researchers from Microsoft, Arctic Wolf, Kaspersky, Unit 42, Snyk, ReversingLabs, and Wiz coordinate investigation efforts. The full scope of downstream impact continues to be assessed as the "largest multi-ecosystem supply chain attack of 2026." Hunt operations identify indicators of compromise across thousands of enterprise and open-source projects spanning GitHub Actions, Docker Hub, npm, OpenVSX, and PyPI ecosystems.

## Attack Methodology

The TeamPCP campaign employed a sophisticated, multi-stage attack methodology targeting the trust model of modern software development supply chains.

Initial Access & Persistence
Attackers gained initial access through misconfigured GitHub Actions environment variables and exposed tokens in workflow logs. The root cause analysis revealed:

Inadequate Token Scope: Service account tokens possessed repository-admin and org-admin privileges despite only requiring read/write access to specific repositories
Incomplete Rotation: During the March 1 credential rotation, backup tokens and secondary PATs were not fully enumerated and revoked
Branch Protection Bypass: Attackers exploited a gap in GitHub's push protection logic for service accounts to force-push to protected version tag branches
Webhook Abuse: Custom webhooks and Actions were configured to exfiltrate logs containing additional credentials

Lateral Movement & Persistence
Once inside the Aqua Security and Checkmarx GitHub organizations, attackers:

Enumerated all GitHub Actions and repository configurations across the org
Identified dependencies and downstream consumers via GitHub's dependency graph API
Created hidden branches and commits with commit dates backdated to 2021 to evade chronological audits
Removed GPG signature requirements from protected branches before deploying malicious versions
Maintained access via compromised deploy keys and SSH certificates issued to seemingly-legitimate bot accounts

Payload Delivery: Force-Push Mechanism
The attack leveraged a critical weakness in version tag management:
$ git push origin HEAD:refs/heads/v2.10.0 --force
# Redirects semantic version tag to malicious commit
# CI/CD systems referencing v2.10.0 now pull attacker-controlled code
# Supply chain poison cascades to all downstream consumers
By force-pushing to version tags (not just commits), attackers ensured that:

Existing workflows using pinned versions automatically received malicious code on their next run
Version constraints like uses: aquasecurity/trivy-action@v2 resolved to poisoned commits
GitHub's update notifications were not triggered (no semantic versioning bump)

The TeamPCP Cloud Stealer Payload
The injected malicious code contained the "TeamPCP Cloud Stealer" artifact—a sophisticated credential extraction tool:

Memory Dumping
The payload dumps the Runner.Worker process memory, extracting sensitive values from environment variables, configuration objects, and in-flight network communications.

Credential Harvesting
Systematic enumeration and exfiltration of AWS credentials, GCP service account keys, Azure storage keys, Kubernetes secrets, SSH private keys, NPM/PyPI tokens, Docker Hub credentials, and Vault secrets.

Encryption & Exfiltration
Harvested credentials are encrypted using AES-256 (symmetric) and RSA-4096 (asymmetric) with the attacker's public key embedded in the payload. The encrypted archive is named tpcp.tar.gz and exfiltrated to attacker-controlled infrastructure.

Encryption Details:
AES-256-GCM for bulk credential data
RSA-4096 wraps AES key with attacker's public key
HMAC-SHA256 authentication tag included
Exfiltration endpoint: plug-tab-protective-relay.trycloudflare.com

## Affected Packages & Downstream Impact

The supply chain compromise created a cascading impact across the open-source and enterprise ecosystem. The "blast radius" extends far beyond the directly compromised repositories:

Impact Cascade

Aqua Security / trivy-action

76/77 version tags compromised
Affected 474 publicly documented repositories with direct dependencies
Estimated 10,000+ private/enterprise repositories with indirect exposure

Aqua Security / setup-trivy

All 7 version tags compromised
Additional vector for credential exfiltration from build environments

Checkmarx / KICS GitHub Action

35 version tags hijacked
Weaponized infrastructure scanning tool deployed to security-conscious organizations

Checkmarx OpenVSX Extensions

cx-dev-assist 1.7.0 & ast-results 2.53.0
Malicious IDE extensions deployed to developer machines via VSCode extension marketplace

Checkmarx / ast-github-action

Tag 2.3.28 compromised
Direct integration into enterprise CI/CD pipelines

LiteLLM / PyPI

Versions 1.82.7 & 1.82.8 poisoned
3.4 million downloads per day
1,750+ downstream Python package dependencies compromised
Affected ML/AI infrastructure pipelines globally

Dependency Graph Visualization

Primary Compromise Points

trivy-action
→
474 repos

setup-trivy
→
CI/CD Env

KICS Action
→
35 tags

LiteLLM
→
1,750 pkgs

Estimated total downstream exposure: 50,000+ repositories and applications

Attack Surface Coverage
The campaign's breadth is remarkable:

GitHub Actions Ecosystem: Compromised automation platforms deployed to thousands of CI/CD pipelines daily
PyPI Package Registry: Poisoned Python packages with 3.4M daily downloads circulating to ML/AI and data science workloads
OpenVSX/VSCode Extensions: Malicious IDE extensions installed on developer machines for direct code repository access
Enterprise Infrastructure: Credential harvesting from Kubernetes clusters, cloud accounts, and infrastructure automation platforms

## Indicators of Compromise

Security teams should hunt for the following indicators of compromise across their infrastructure and development pipelines:

Type
Indicator
Context / Notes

Domain
scan.aquasecurtiy.org
Typosquatted domain (note: "securtiy" misspelling) used for payload exfiltration and C2 communications

IP Address
45.148.10.212
Attacker infrastructure hosting C2 and exfiltration endpoints. ASN: AS210937 (Teleport Services)

C2 Domain
plug-tab-protective-relay.trycloudflare.com
Cloudflare Workers-based C2 for credential exfiltration and command dispatch

GitHub Repos
tpcp-docs* pattern
Malicious repositories created by attacker accounts with "tpcp" naming convention

File Artifact
tpcp.tar.gz
Encrypted credential archive exfiltrated from compromised runners. Contains AES-256 + RSA-4096 encrypted secrets.

Commit Anomaly
Missing GPG signatures on version tags
Legitimate version tags should have GPG-signed commits. Unsigned commits after March 18 indicate compromise.

Commit Anomaly
Impossible chronology (2021 dates with 2026 parents)
Attackers backdated commits to 2021 with 2026 parent commits to evade temporal audits

Environment Variable
TPCP_EXFIL_KEY in workflow logs
RSA public key for credential encryption embedded in malicious GitHub Actions

Registry
PyPI LiteLLM versions 1.82.7, 1.82.8
Poisoned packages. Safe versions: ≤1.82.6 or ≥1.82.9

User-Agent
TeamPCP-Exfil/1.0
Custom user-agent string in exfiltration requests to attacker infrastructure

Detection Methodology
GitHub Audit Log Hunting:
action:push created_at:[2026-03-19 TO 2026-03-21]
AND (
ref:"refs/tags/v*"
OR ref:"refs/tags/release-*"
)
AND actor NOT IN [authorized-service-accounts]
AND force:true

CI/CD Execution Pattern Anomalies:

Sudden spike in runner memory usage during GitHub Actions execution (memory dumping)
Network connections to 45.148.10.212 or plug-tab-protective-relay.trycloudflare.com
Unexpected file I/O accessing ~/.ssh/, ~/.aws/credentials, ~/.kube/config
Creation of tpcp.tar.gz archives in runner temporary directories
Child processes spawned from GitHub Actions runners with unusual environment variable dumps

## Detection & Remediation

Immediate Actions (Critical Priority)

Audit GitHub Actions Versions: Enumerate all uses of trivy-action, setup-trivy, KICS, and ast-github-action across your organization. Cross-reference against commit SHAs to ensure you are not running force-pushed versions.
Pin to Immutable Commit SHAs: Replace version tag references with specific commit SHAs. Example: Change uses: aquasecurity/trivy-action@v2.10.0 to uses: aquasecurity/trivy-action@a1b2c3d4... (full 40-character commit hash)
Rotate Cloud Credentials: Any credentials exposed to CI/CD runners on March 19-21 or runners using compromised GitHub Actions should be considered compromised. Immediately rotate AWS access keys, GCP service account keys, Azure credentials, and Kubernetes certificates.
Revoke GitHub Tokens: Invalidate any GitHub tokens and SSH keys created before March 1, 2026. Generate new service account credentials with minimal required scopes.

Short-Term Remediation (24-48 hours)

PyPI Package Pinning: For LiteLLM consumers: pin to version ≤1.82.6 or upgrade to ≥1.82.9. Audit requirements.txt and setup.py files across your codebase.
GitHub Branch Protection Review: Verify that all critical repositories have branch protection enabled that prevents force pushes to release branches and version tags, even from service accounts.
Sign Commits with GPG Keys: Enforce GPG signature requirements on all commits to protected branches. Distribute and manage GPG keys separately from CI/CD token storage.
Implement SLSA Framework: Adopt Software Supply Chain Levels for Software Artifacts (SLSA) to improve build integrity verification and reduce reliance on version tags.
Container Image Scanning: Scan all container images built during the March 19-30 window for presence of the TeamPCP Cloud Stealer payload. Look for process memory dumping artifacts and credential harvesting code patterns.

Long-Term Security Improvements

Token Scope Reduction: Enforce principle of least privilege for all GitHub tokens. Service accounts should have no more than read/write access to specific repositories; never org-admin or repo-admin by default.
Hardware-Backed Secrets: For critical infrastructure, transition to hardware security module (HSM) backed key management. Store credentials in encrypted vaults (HashiCorp Vault, AWS Secrets Manager, Azure Key Vault) with short TTLs.
Ephemeral CI/CD Infrastructure: Use disposable, minimal runner containers that are destroyed after each job. Avoid persistent runner agents that accumulate credentials over time.
Artifact Attestation: Implement in-toto attestations and Artifact Attestation APIs to cryptographically sign artifacts and verify provenance before deployment.
Credential Rotation Automation: Implement automated credential rotation for all service accounts with intervals ≤30 days. Ensure rotation processes fully revoke old credentials and do not leave secondary tokens active.
Security Monitoring: Deploy continuous monitoring on GitHub audit logs, PyPI package metadata, and Kubernetes events to detect suspicious activities indicative of supply chain attacks.

Validation Checklist
Organizations should validate remediation efforts against the following checklist:

☐ All GitHub Actions references updated to use immutable commit SHAs instead of version tags
☐ Cloud credentials rotated and old credentials fully revoked (not just disabled)
☐ GitHub audit logs reviewed for suspicious force-push, branch deletion, and token creation events during Feb 27 – Mar 30 timeframe
☐ LiteLLM PyPI pinned to safe version (≤1.82.6 or ≥1.82.9)
☐ GPG signature enforcement enabled on protected branches
☐ Branch protection rules configured to prevent force-push by service accounts
☐ CI/CD runner logs scanned for outbound connections to 45.148.10.212 or plug-tab-protective-relay.trycloudflare.com
☐ Container images built during attack window scanned for malicious payloads
☐ GitHub token scopes audited and reduced to minimum necessary permissions

## References & Sources

This incident assessment is compiled from research and disclosures from leading cybersecurity organizations:

Unit42/Palo Alto: Weaponizing the Protectors: TeamPCP's Multi-Stage Supply Chain Attack
unit42.paloaltonetworks.com | April 3, 2026

Kaspersky: Trojanization of Trivy, Checkmarx, and LiteLLM
kaspersky.com | April 2, 2026

Akamai: The Telnyx PyPI Compromise and TeamPCP
akamai.com | April 1, 2026

Snyk: Poisoned Security Scanner Backdooring LiteLLM
snyk.io | April 2, 2026

Wiz.io: KICS GitHub Action Compromised
wiz.io | April 1, 2026

Datadog Security Labs: LiteLLM compromised on PyPI
datadoghq.com | March 31, 2026

Stream.security: TeamPCP's LiteLLM Takeover
stream.security | April 3, 2026

Microsoft Security Response Center - TeamPCP Campaign Analysis
security.microsoft.com | March 25, 2026

Arctic Wolf - Threat Intelligence Brief: Supply Chain Compromise
arcticwolf.com | March 28, 2026

ReversingLabs - Reverse Engineering the TeamPCP Cloud Stealer
reversinglabs.com | March 30, 2026

Aqua Security Official Statement - Trivy Incident Response
github.com/aquasecurity | March 1, 2026

Checkmarx Security Notice - GitHub Actions Compromise
checkmarx.com | March 23, 2026

## Related Incidents

This campaign shares characteristics with other sophisticated supply chain attacks. Security teams should review these related incidents:

Axios/UNC1069 Supply Chain Attack (2026)
The Axios npm package was compromised by UNC1069 (North Korea-nexus) on March 31, 2026, deploying the WAVESHAPER.V2 RAT via a phantom dependency. The attack affected 100M+ weekly downloads during a 3-hour exposure window. This parallel campaign demonstrates the coordinated supply chain targeting by multiple threat actors.
Full incident analysis →

European Commission Trivy Breach (2026)
As part of the TeamPCP multi-ecosystem campaign, the Trivy security scanning tool used by the European Commission was compromised through the same aqua-bot service account compromise. This incident demonstrates the cascading impact of TeamPCP's attacks on critical government and institutional infrastructure.
Full incident analysis →

CVE-2026-33634 — Trivy GitHub Actions Vulnerability Analysis
Detailed technical analysis of CVE-2026-33634, the critical supply chain vulnerability in Aqua Security's Trivy ecosystem that TeamPCP exploited. Covers the tag hijacking methodology, infostealer payload capabilities, exposure windows, and IOCs including C2 infrastructure at scan.aquasecurtiy.org.
Full incident analysis →

ShinyHunters Operations & Leak Site Activity
ShinyHunters served as the publication platform for data exfiltrated via TeamPCP's Trivy compromise, publishing 340 GB of European Commission data on their dark web leak site on March 28, 2026. Profile covers the group's evolution toward a ransomware-style extortion model.
Full incident analysis →

SolarWinds Supply Chain Compromise (2020)
Similar to SolarWinds, TeamPCP exploited trusted build infrastructure to inject malicious code into software updates. However, TeamPCP's attack surface is broader, spanning multiple package ecosystems and automation platforms rather than a single software vendor.
Full incident analysis →

Codecov Supply Chain Attack (2021)
The credential harvesting mechanisms employed by TeamPCP's Cloud Stealer payload parallel the secret extraction tactics observed in the Codecov attack. Both campaigns specifically targeted CI/CD environment credentials as a vector for downstream infrastructure compromise.
Full incident analysis →
