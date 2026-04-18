---
eventId: "TP-2026-0020"
title: "European Commission Cloud Breach via Trivy Supply Chain"
date: 2026-03-19
attackType: "Supply Chain"
severity: critical
sector: "Government"
geography: "European Union"
threatActor: "TeamPCP"
attributionConfidence: A3
reviewStatus: "under_review"
confidenceGrade: C
generatedBy: "dangermouse-bot"
generatedDate: 2026-04-16
cves:
  - "CVE-2026-33634"
relatedSlugs:
  - "cisco-trivy-supply-chain-breach-2026"
tags:
  - "trivy"
  - "cloud"
  - "government"
  - "eu"
  - "data-exfiltration"
  - "shinyhunters"
  - "supply-chain"
  - "cicd"
sources:
  - url: "https://cert.europa.eu/blog/european-commission-cloud-breach-trivy-supply-chain"
    publisher: "CERT-EU"
    publisherType: government
    reliability: R1
    publicationDate: "2026-04-02"
    accessDate: "2026-04-16"
    archived: false
  - url: "https://www.cisa.gov/known-exploited-vulnerabilities-catalog"
    publisher: "CISA"
    publisherType: government
    reliability: R1
    publicationDate: "2026-03-25"
    accessDate: "2026-04-16"
    archived: false
  - url: "https://www.helpnetsecurity.com/2026/04/03/european-commission-cloud-breach/"
    publisher: "Help Net Security"
    publisherType: media
    reliability: R2
    publicationDate: "2026-04-03"
    accessDate: "2026-04-16"
    archived: false
  - url: "https://www.securityweek.com/european-commission-confirms-data-breach-linked-to-trivy-supply-chain-attack/"
    publisher: "SecurityWeek"
    publisherType: media
    reliability: R2
    publicationDate: "2026-04-03"
    accessDate: "2026-04-16"
    archived: false
  - url: "https://www.csoonline.com/article/4154176/cert-eu-blames-trivy-supply-chain-attack-for-europa-eu-data-breach.html"
    publisher: "CSO Online"
    publisherType: media
    reliability: R2
    publicationDate: "2026-04-03"
    accessDate: "2026-04-16"
    archived: false
mitreMappings:
  - techniqueId: "T1195.002"
    techniqueName: "Supply Chain Compromise: Compromise Software Supply Chain"
    tactic: "Initial Access"
    notes: "CVE-2026-33634 exploitation via compromised Trivy GitHub Actions release pipeline."
  - techniqueId: "T1078"
    techniqueName: "Valid Accounts"
    tactic: "Persistence"
    notes: "Stolen AWS credentials used to authenticate and access EC cloud infrastructure."
  - techniqueId: "T1530"
    techniqueName: "Data from Cloud Storage Object"
    tactic: "Collection"
    notes: "340 GB exfiltrated from S3 buckets containing department communications and inter-institutional data."
  - techniqueId: "T1567"
    techniqueName: "Exfiltration Over Web Service"
    tactic: "Exfiltration"
    notes: "Data transferred to attacker-controlled infrastructure over web service channels."
---

## Executive Summary

On April 2, 2026, CERT-EU publicly disclosed that the European Commission's Europa web hosting platform on AWS had been breached through the Trivy supply chain compromise (CVE-2026-33634), making it the highest-profile governmental victim of the TeamPCP campaign. The attack gained initial access on March 19 and was detected on March 24, resulting in the exfiltration of 340 GB of data including approximately 52,000 email-related files affecting 71 clients: 42 internal European Commission departments plus 29 other EU entities.

TeamPCP exploited a misconfiguration in Trivy's GitHub Actions environment to implant credential-stealing malware via manipulated version tags, forcing CI/CD pipelines to automatically pull compromised code. The stolen data, including 2.22 GB of outbound communications, was published by ShinyHunters on their dark web leak site on March 28, before the official public disclosure.

Mandiant estimates the broader Trivy/TeamPCP campaign affected over 1,000 SaaS environments, with other confirmed victims including Cisco, Checkmarx, LiteLLM, and Sportradar AG. This incident represents one of the most consequential supply chain attacks targeting governmental infrastructure in recent years.

## Technical Analysis

CVE-2026-33634 stemmed from insufficient access controls on Trivy's GitHub Actions runner environment. The release CI/CD pipeline used overly permissive IAM policies granting broad repository access. GitHub Actions secrets were not properly rotated or scoped, and there was no code signing verification for version tags or runtime integrity checks for published container images.

TeamPCP exploited the misconfiguration to inject credential-stealing malware into Trivy's release pipeline. The attacker created or modified version tags (e.g., v0.41.0 through v0.44.2) pointing to repositories containing malicious code. Organizations using Trivy in container scanning pipelines configured for automatic updates received compromised code. Malicious versions executed credential-harvesting scripts during initialization, targeting AWS credentials, GCP service accounts, and cloud environment variables.

The European Commission's AWS infrastructure pulled the compromised Trivy version on March 19. The malware harvested AWS access keys, session tokens, and IAM role credentials. Using stolen credentials, the attacker enumerated and accessed EC AWS resources, downloading 340 GB from S3 buckets over a 5-day period before detection on March 24. The attacker also used TruffleHog to scan for additional secrets.

## Attack Chain

### Stage 1: Supply Chain Manipulation

TeamPCP exploits CVE-2026-33634 in Trivy GitHub Actions to manipulate version tags and inject malicious code into the release pipeline.

### Stage 2: Automated Distribution

Organizations worldwide with automated Trivy updates pull compromised versions. European Commission's Europa platform integrates the malicious version on March 19.

### Stage 3: Credential Harvesting

Malicious Trivy version executes postinstall scripts that harvest AWS access keys, session tokens, and IAM role credentials from EC infrastructure.

### Stage 4: Cloud Infrastructure Access

Using stolen credentials, the attacker gains direct access to EC AWS account. S3 bucket enumeration and resource reconnaissance begins.

### Stage 5: Data Exfiltration

Attacker downloads 340 GB of sensitive data from EC AWS infrastructure over a 5-day period, including 52,000 email files from 71 EU clients.

### Stage 6: Public Leak

ShinyHunters publishes exfiltrated data on dark web leak site on March 28, making the data irrecoverably public.

## Impact Assessment

The 340 GB of exfiltrated data represents the largest known breach of EU institutional data. 71 EU entity clients were affected (42 EC departments plus 29 other organizations). The 52,000 email files (2.22 GB) of sensitive internal and inter-institutional communications were exposed, along with draft legislative materials and strategic policy documents.

The intelligence value of stolen inter-institutional communications is substantial, providing strategic intelligence on EU decision-making processes. Compromised policy documents and draft materials could be exploited in international negotiations. Personnel records exposure creates vulnerabilities for coercion and insider recruitment.

ShinyHunters' publication on March 28 made the data irrecoverably public. The broader Trivy/TeamPCP campaign affected over 1,000 SaaS environments globally across technology, defense, financial services, and government sectors.

## Historical Context

CERT-EU attributed the breach to TeamPCP via the Trivy CVE-2026-33634 supply chain compromise. ShinyHunters (affiliated with TeamPCP) published the stolen data on their dark web leak site. Attribution confidence is moderate (A3) based on CERT-EU official attribution, CVE correlation, and ShinyHunters' public claim.

TeamPCP is a supply chain attack group focused on CI/CD pipeline compromise and cloud credential harvesting. The relationship between TeamPCP and ShinyHunters suggests coordinated operations between supply chain compromise teams and data monetization operations.

## Timeline

### 2026-02 — CVE-2026-33634 Exploitation Begins

TeamPCP begins exploiting the Trivy GitHub Actions misconfiguration.

### 2026-03-19 — EC Infrastructure Compromised

European Commission's AWS infrastructure pulls compromised Trivy version. AWS API keys stolen. Attacker begins reconnaissance.

### 2026-03-19 to 2026-03-24 — Data Exfiltration

Attacker exfiltrates 340 GB from EC AWS account including 52,000 email files from 71 EU clients over a 5-day period.

### 2026-03-24 — Intrusion Detected

EC SOC detects unusual AWS credential usage and data exfiltration. Incident response activated, attacker access revoked.

### 2026-03-25 — CERT-EU Notified, CISA KEV Updated

CERT-EU begins forensic analysis. CVE-2026-33634 added to CISA KEV catalog with April 8 remediation deadline.

### 2026-03-27 — European Commission Press Release

EC issues official press release disclosing the breach.

### 2026-03-28 — ShinyHunters Leak

ShinyHunters publishes 340 GB of exfiltrated data on Tor leak site.

### 2026-04-02 — CERT-EU Public Disclosure

CERT-EU publicly discloses the breach and attributes it to TeamPCP.

## Remediation & Mitigation

Organizations must pin all CI/CD tool versions using specific verified digests and cryptographic hashes rather than mutable "latest" tags. Implement mandatory code signing verification on all CI/CD tools and dependencies. Maintain Software Bill of Materials (SBOM) for all pipeline tools. Use Sigstore and in-toto for cryptographic attestation of build provenance.

Replace long-lived cloud credentials with time-limited workload identity tokens. Apply strict least-privilege IAM policies to all CI/CD tool access. Implement automatic credential rotation with 24-48 hour lifetime limits. Use distinct AWS accounts for CI/CD pipelines to limit blast radius.

Monitor for unexpected version changes in critical dependencies. Detect credential exfiltration patterns and unusual cloud API call sequences. Alert on abnormal data volumes being transferred from cloud infrastructure. Audit CI/CD pipelines for affected Trivy versions (v0.40.0 through v0.44.2) and upgrade to 0.45.0 or later.

## Sources & References

- [CERT-EU: European Commission Cloud Breach via Trivy Supply Chain](https://cert.europa.eu/blog/european-commission-cloud-breach-trivy-supply-chain) — CERT-EU, 2026-04-02
- [CISA: Known Exploited Vulnerabilities Catalog — CVE-2026-33634](https://www.cisa.gov/known-exploited-vulnerabilities-catalog) — CISA, 2026-03-25
- [Help Net Security: Trivy Supply Chain Attack Enabled EC Breach](https://www.helpnetsecurity.com/2026/04/03/european-commission-cloud-breach/) — Help Net Security, 2026-04-03
- [SecurityWeek: EC Confirms Data Breach Linked to Trivy Supply Chain Attack](https://www.securityweek.com/european-commission-confirms-data-breach-linked-to-trivy-supply-chain-attack/) — SecurityWeek, 2026-04-03
- [CSO Online: CERT-EU Blames Trivy Supply Chain Attack for Europa.eu Data Breach](https://www.csoonline.com/article/4154176/cert-eu-blames-trivy-supply-chain-attack-for-europa-eu-data-breach.html) — CSO Online, 2026-04-03
