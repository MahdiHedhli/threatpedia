---
eventId: "TP-2026-0042"
title: "Cisco Development Environment Breach via Trivy Supply Chain Attack"
date: 2026-04-06
attackType: "Supply Chain"
severity: high
sector: "Technology"
geography: "Global"
threatActor: "TeamPCP / ShinyHunters (UNC5537)"
attributionConfidence: A3
reviewStatus: "draft_ai"
confidenceGrade: C
generatedBy: "dangermouse-bot"
generatedDate: 2026-04-16
cves:
  - "CVE-2026-33634"
relatedSlugs:
  - "european-commission-trivy-breach-2026"
tags:
  - "supply-chain"
  - "trivy"
  - "github-actions"
  - "cisco"
  - "source-code-theft"
  - "aws"
  - "shinyhunters"
  - "extortion"
  - "cicd"
sources:
  - url: "https://www.cisa.gov/known-exploited-vulnerabilities-catalog"
    publisher: "CISA"
    publisherType: government
    reliability: R1
    publicationDate: "2026-03-25"
    accessDate: "2026-04-16"
    archived: false
  - url: "https://www.bleepingcomputer.com/news/security/cisco-data-breach-compromised-trivy-github-actions/"
    publisher: "BleepingComputer"
    publisherType: media
    reliability: R2
    publicationDate: "2026-04-06"
    accessDate: "2026-04-16"
    archived: false
  - url: "https://www.csoonline.com/article/cisco-development-environment-breached-trivy-supply-chain/"
    publisher: "CSO Online"
    publisherType: media
    reliability: R2
    publicationDate: "2026-04-06"
    accessDate: "2026-04-16"
    archived: false
  - url: "https://github.com/aquasecurity/trivy-action/security/advisories"
    publisher: "GitHub / Aqua Security"
    publisherType: vendor
    reliability: R1
    publicationDate: "2026-03-20"
    accessDate: "2026-04-16"
    archived: false
  - url: "https://unit42.paloaltonetworks.com/trivy-supply-chain-breach/"
    publisher: "Palo Alto Networks Unit 42"
    publisherType: vendor
    reliability: R1
    publicationDate: "2026-04-07"
    accessDate: "2026-04-16"
    archived: false
mitreMappings:
  - techniqueId: "T1195.002"
    techniqueName: "Supply Chain Compromise: Compromise Software Supply Chain"
    tactic: "Initial Access"
    notes: "TeamPCP compromised Trivy GitHub Actions repository, force-pushing malicious code to 76 of 77 version tags."
  - techniqueId: "T1552.001"
    techniqueName: "Unsecured Credentials: Credentials In Files"
    tactic: "Credential Access"
    notes: "Malicious Trivy versions exfiltrated CI/CD credentials including GitHub PATs and AWS access keys."
  - techniqueId: "T1213"
    techniqueName: "Data from Information Repositories"
    tactic: "Collection"
    notes: "300+ internal Cisco GitHub repositories systematically cloned using stolen credentials."
---

## Summary

Cisco Systems suffered a supply chain attack when threat actors compromised the Trivy GitHub Actions repository (aquasecurity/trivy-action) and used stolen CI/CD credentials to breach Cisco's internal development environment. The attack chain originated with TeamPCP's March 19, 2026 compromise of Trivy, where malicious code was force-pushed to 76 of 77 version tags. This malicious code executed during Cisco's CI/CD pipeline, exfiltrating development credentials that granted access to internal infrastructure.

Using stolen CI/CD credentials, threat actors accessed and cloned over 300 internal Cisco GitHub repositories containing proprietary source code, internal documentation, and development artifacts. Multiple AWS access keys were also stolen and used for unauthorized activities against Cisco's cloud infrastructure. Dozens of developer and lab workstations were identified as compromised, indicating lateral movement within the development environment.

ShinyHunters (affiliated with TeamPCP, tracked as UNC5537) published an extortion post on March 31, 2026, claiming theft of 3 million Salesforce records, Cisco GitHub repositories, and AWS buckets, with an April 3 ransom deadline.

## Technical Analysis

TeamPCP compromised the aquasecurity/trivy-action GitHub Actions repository, which provides container image vulnerability scanning in CI/CD pipelines. The attackers obtained repository access credentials (likely via compromised maintainer account or OAuth token theft) and force-pushed malicious code to 76 of 77 version tags, ensuring widespread impact.

The compromised Trivy action executed during Cisco's CI/CD pipeline runs. Malicious code exfiltrated CI/CD environment credentials including GitHub Personal Access Tokens (PATs), AWS access keys, and other authentication material available in the pipeline execution context. Using stolen GitHub PATs, threat actors systematically cloned 300-plus internal Cisco repositories containing proprietary source code, internal tools, configuration management code, infrastructure-as-code definitions, and documentation.

Multiple AWS access keys were stolen and used to access S3 buckets containing source code artifacts, EC2 instances in development environments, RDS databases, and CloudFormation stacks. Dozens of developer and lab workstations were subsequently identified as compromised, indicating additional lateral movement techniques or credential reuse.

## Attack Chain

### Stage 1: Supply Chain Compromise

TeamPCP compromised the aquasecurity/trivy-action GitHub repository and force-pushed malicious code to 76 of 77 version tags on March 19, 2026.

### Stage 2: CI/CD Credential Theft

Cisco's pipelines executed the compromised Trivy action, triggering exfiltration of GitHub PATs, AWS access keys, and other environment variables.

### Stage 3: Repository Cloning

Using stolen GitHub PATs, threat actors systematically cloned 300-plus internal Cisco repositories containing proprietary source code and documentation.

### Stage 4: Cloud Infrastructure Access

Stolen AWS access keys were used to access S3 buckets, EC2 instances, RDS databases, and CloudFormation stacks within Cisco's cloud environments.

### Stage 5: Lateral Movement

Dozens of developer and lab workstations were compromised, providing persistence and credential harvesting capability.

### Stage 6: Extortion

ShinyHunters published an extortion post on March 31, claiming theft of Cisco data with an April 3 ransom deadline.

## Impact Assessment

The theft of 300-plus GitHub repositories containing proprietary source code represents years of engineering investment. Competitors, nation-state actors, or malicious parties could use the stolen code to identify vulnerabilities, develop countermeasures, or accelerate product development. Stolen CI/CD credentials demonstrate architectural weaknesses in credential isolation within Cisco's development infrastructure.

Multiple AWS access keys provided direct cloud infrastructure access. If production AWS accounts shared keys or followed inadequate credential isolation, production infrastructure may also be at risk. ShinyHunters' claim of 3 million stolen Salesforce records suggests additional compromise of Cisco's CRM system.

The attack originated from Trivy, a widely-used open-source vulnerability scanner. Any organization using Trivy GitHub Actions during March 19-25, 2026 executed the malicious code, creating compounded downstream risk.

## Attribution

The attack was perpetrated by TeamPCP in the initial Trivy compromise, with ShinyHunters (affiliated threat group, tracked as UNC5537 by Mandiant) conducting extortion operations against Cisco. Both are known threat actors with histories of supply chain attacks, data theft, and extortion campaigns.

Attribution confidence is moderate (A3) based on ShinyHunters' public claim of responsibility, technical correlation with known TeamPCP supply chain attack methodology, and the force-push technique matching previous GitHub Actions compromises attributed to this group. The attack demonstrates experienced threat actors familiar with modern development practices and cloud infrastructure.

## Timeline

### 2026-03-19 — Trivy GitHub Actions Compromised

TeamPCP force-pushes malicious code to 76 of 77 version tags in the aquasecurity/trivy-action repository.

### 2026-03-19 to 2026-03-25 — Credential Exfiltration

Organizations using Trivy GitHub Actions execute the compromised action. Cisco's pipelines exfiltrate GitHub PATs and AWS access keys.

### 2026-03-19 to 2026-03-25 — Repository Cloning

Threat actors systematically clone 300-plus internal Cisco repositories using stolen credentials.

### 2026-03-26 to 2026-03-30 — Workstation Compromise

Stolen credentials leveraged for lateral movement to developer and lab workstations.

### 2026-03-31 — Extortion Post Published

ShinyHunters publishes extortion post claiming 3 million Salesforce records, Cisco GitHub repositories, and AWS buckets. April 3 deadline set.

### 2026-04-06 — Public Disclosure

Cisco and threat intelligence community publicly disclose the supply chain attack. Organizations using Trivy advised to rotate credentials.

## Remediation & Mitigation

Audit all GitHub Actions in CI/CD pipelines and verify version pinning using exact commit SHAs rather than version tags. Rotate all credentials exposed in CI/CD environment variables immediately. Implement short-lived credentials (AWS STS temporary credentials) instead of long-lived keys for CI/CD operations. Use GitHub token expiration policies and organization-scoped GitHub Apps instead of user PATs.

Conduct full forensic analysis of compromised workstations and rebuild affected machines from clean OS images. Segment development networks from production systems. Implement privileged access management for elevated credentials in development environments.

Reference actions by commit SHA (e.g., actions/checkout@abc123def456) instead of version tags to prevent future supply chain attacks through tag manipulation. Implement code review processes for GitHub Actions changes and monitor execution logs for suspicious behavior.

## Sources & References

- [CISA: Known Exploited Vulnerabilities Catalog — CVE-2026-33634](https://www.cisa.gov/known-exploited-vulnerabilities-catalog) — CISA, 2026-03-25
- [BleepingComputer: Cisco Data Breach Through Compromised Trivy GitHub Actions](https://www.bleepingcomputer.com/news/security/cisco-data-breach-compromised-trivy-github-actions/) — BleepingComputer, 2026-04-06
- [CSO Online: Cisco Development Environment Breached via Trivy Supply Chain Attack](https://www.csoonline.com/article/cisco-development-environment-breached-trivy-supply-chain/) — CSO Online, 2026-04-06
- [GitHub / Aqua Security: Trivy Action Security Advisories](https://github.com/aquasecurity/trivy-action/security/advisories) — GitHub, 2026-03-20
- [Palo Alto Networks Unit 42: Trivy Supply Chain Breach Analysis](https://unit42.paloaltonetworks.com/trivy-supply-chain-breach/) — Unit 42, 2026-04-07
