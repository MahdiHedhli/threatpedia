---
eventId: TP-2026-0052
title: "Mercor AI Supply Chain Breach via LiteLLM Compromise"
date: 2026-04-08
attackType: supply-chain
severity: high
sector: Technology / AI Services
geography: Global
threatActor: Unknown
attributionConfidence: A4
reviewStatus: under_review
confidenceGrade: C
generatedBy: new-threat-intel
generatedDate: 2026-04-08
cves: []
relatedSlugs:
  - "teampcp-supply-chain-attack"
  - "cisco-trivy-supply-chain-breach-2026"
  - "european-commission-trivy-breach-2026"
tags:
  - "supply-chain"
  - "litellm"
  - "mercor"
  - "ai"
  - "credential-theft"
  - "extortion"
  - "lapsus"
---
## Executive Summary

On March 27, 2026, the threat actor group TeamPCP compromised the CI/CD pipeline of LiteLLM, an open-source Python library with 97 million monthly downloads used in approximately 36% of cloud environments globally. For approximately 40 minutes, malicious versions of LiteLLM (1.82.7 and 1.82.8) were published to the PyPI package repository, designed to harvest API credentials and authentication tokens from downstream applications.
Among thousands of affected organizations, Mercor — a $10 billion AI startup providing data annotation and quality assurance services for leading AI companies — was compromised. On April 2, 2026, the extortion group Lapsus$ claimed responsibility for exfiltrating 4 terabytes of sensitive data from Mercor, including internal Slack communications, development tickets, proprietary source code, database records, and video recordings of AI system interactions with contractors.
The breach exposed Mercor's relationships with major tech companies including Anthropic, OpenAI, and Meta. Meta subsequently paused AI data work with Mercor following the exposure of training methodologies and proprietary techniques. A class action lawsuit was filed on April 1, 2026, potentially affecting 40,000+ individuals. TeamPCP has publicly stated its intention to partner with ransomware and extortion groups, signaling a concerning shift in supply chain threat tactics.

## Technical Analysis

LiteLLM is a widely-adopted open-source Python library that provides a unified interface for integrating multiple large language models (LLMs) across cloud platforms. The library abstracts API compatibility differences between OpenAI, Anthropic, Cohere, Azure OpenAI, and other LLM providers, making it essential infrastructure for AI applications at scale.

Compromise Vector
TeamPCP gained unauthorized access to the LiteLLM project's CI/CD (Continuous Integration/Continuous Deployment) pipeline, likely through compromised credentials or a vulnerability in the build infrastructure. The attackers were able to:

Inject malicious code into the build pipeline
Generate and publish unsigned or insufficiently verified Python packages to PyPI
Bypass automated security scanning and code review processes
Maintain access for approximately 40 minutes before detection

Malicious Payload

LiteLLM versions 1.82.7 and 1.82.8 contained credential-harvesting functionality that:
- Enumerated environment variables for API keys and tokens
- Harvested authentication credentials from config files
- Exfiltrated credentials to attacker-controlled servers
- Maintained persistent backdoor capability via callback hooks
- Obfuscated malicious code within legitimate library functions

The malicious payload was designed to operate silently without triggering alerts in typical application monitoring systems. Credential harvesting occurred during package installation and initialization, before security scanning tools could detect the exfiltration.

Scale of Exposure

Metric
Impact

Monthly LiteLLM Downloads
97 million

Cloud Environment Usage
~36% globally

Malicious Package Window
~40 minutes (March 27, 2026)

Estimated Direct Downloads
2-3 million during window

Organizations Potentially Affected
Thousands

## Attack Chain

Stage 1: Initial Access
CI/CD Pipeline Compromise
TeamPCP obtained credentials or exploited a vulnerability to gain access to LiteLLM's build infrastructure. Attack vectors likely included: compromised developer credentials, GitHub Actions token theft, or unpatched CI/CD vulnerabilities.

Stage 2: Code Injection
Malicious Payload Insertion
Attackers injected credential-harvesting code into the LiteLLM codebase, specifically within initialization functions and dependency loading mechanisms to ensure execution during package setup and runtime.

Stage 3: Distribution
PyPI Package Publication
Malicious versions 1.82.7 and 1.82.8 were published to PyPI, the official Python package repository. Automatic dependency resolution systems worldwide began downloading and installing the compromised packages.

Stage 4: Credential Harvesting
Exfiltration via Compromised Instances
Upon installation, the malicious packages enumerated environment variables, configuration files, and secrets management systems for API keys, tokens, and authentication credentials. Data was exfiltrated to attacker infrastructure.

Stage 5: Lateral Movement (Mercor-Specific)
Compromised Credentials Used for Access
Harvested LiteLLM API credentials and internal tokens from Mercor's systems were used to authenticate to internal services, databases, and cloud resources. Attackers moved laterally throughout the Mercor infrastructure.

Stage 6: Data Exfiltration
4TB of Sensitive Data Stolen
Lapsus$ (coordinating with or purchasing data from TeamPCP) exfiltrated 4 terabytes of data including Slack communications, internal tickets, source code repositories, database exports, and video recordings of AI system interactions.

Stage 7: Extortion
Ransom Demand and Threat Publication
Lapsus$ published proof of data theft and demanded ransom. Threatened to release data to competitors and regulatory authorities. Exposed Mercor's relationships with Anthropic, OpenAI, and Meta, triggering business consequences.

## MITRE ATT&CK Mapping

The incident demonstrates sophisticated supply chain attack and data exfiltration techniques, with emphasis on trusted relationships and valid account compromise:

Tactics & Techniques

T1195.001 — Supply Chain Compromise: Compromise Software Dependencies — Malicious code injection into open-source library CI/CD pipeline
T1199 — Trusted Relationship — Exploitation of trust in LiteLLM as widely-used open-source dependency
T1078 — Valid Accounts — Harvesting and use of legitimate API credentials and authentication tokens
T1530 — Data from Cloud Storage — Exfiltration of databases and cloud-stored configuration files
T1567 — Exfiltration Over Web Service — Data transmission to attacker infrastructure and extortion platform
T1657 — Financial Theft — Extortion and ransom demand campaign by Lapsus$

## Impact Assessment

Direct Impact on Mercor

Valuation Impact: $10 billion startup valuation at immediate risk due to breach disclosure and customer confidence erosion
Customer Loss: Meta paused AI data work with Mercor following exposure of proprietary training methodologies
Data Exposure: 4TB of sensitive data including Slack communications, internal architecture, source code, and contractor interaction videos
Legal Liability: Class action lawsuit filed April 1, 2026, potentially affecting 40,000+ individuals
Operational Disruption: Incident response costs, forensics, notification, and remediation efforts

Ecosystem Impact

Supply Chain Vulnerability: Thousands of organizations were compromised through LiteLLM dependency. Estimated 2-3 million installations during the ~40 minute window.
Open Source Trust Crisis: Demonstrates vulnerability of widely-used open-source libraries to CI/CD compromise, undermining trust in OSS security
Cloud Infrastructure Risk: Credentials harvested from compromised systems could enable subsequent attacks on cloud environments using those credentials
AI Industry Exposure: LiteLLM's role as critical infrastructure for LLM deployments means this attack affected core AI development pipelines across the industry

Financial & Reputational Harm

Mercor's major customers (Anthropic, OpenAI, Meta) facing reputational risk from association with compromised contractor
Estimated remediation costs: $100M+ for incident response, legal defense, and customer notification
Long-term revenue loss as customers shift data annotation work to competing vendors
Regulatory fines and compliance violations (GDPR, CCPA for data containing personal information)

## Timeline

March 27, 2026 - Unknown Time
TeamPCP gains access to LiteLLM CI/CD pipeline (likely through compromised credentials or infrastructure vulnerability)

March 27, 2026 - ~14:00 UTC (estimated)
Malicious LiteLLM versions 1.82.7 and 1.82.8 published to PyPI; automatic downloads begin worldwide

March 27, 2026 - ~14:40 UTC (estimated)
LiteLLM maintainers detect suspicious package versions and publish security alert; PyPI removes malicious versions

March 28-31, 2026
Compromised organizations discover malicious packages in logs; incident response and forensics begin; LiteLLM CI/CD pipeline hardening occurs

March 31, 2026 - Evening
Mercor discovers breach through forensic investigation; credentials harvested from their LiteLLM instances traced to unauthorized access

April 1, 2026
Lapsus$ publicly claims responsibility for Mercor breach; publishes proof-of-concept data samples; ransom demand issued; class action lawsuit filed by affected individuals

April 2, 2026
Mercor confirms breach to customers including Meta, Anthropic, OpenAI; Meta announces pause in AI data work with Mercor

April 8, 2026
Threatpedia publishes incident report (TP-2026-0037); ongoing law enforcement investigation and civil litigation

## Historical Context

TeamPCP — Supply Chain Specialists
TeamPCP is a sophisticated threat actor group specializing in CI/CD pipeline compromise and software supply chain attacks. This incident represents a significant capability demonstration:

Specialization: CI/CD infrastructure compromise, open-source library manipulation, credential harvesting
Sophistication Level: Advanced — demonstrated understanding of Python packaging, PyPI mechanisms, automated build systems, and secure credential storage bypass
Infrastructure: Command-and-control infrastructure for credential exfiltration; likely coordination with extortion groups for monetization
Intent Shift: TeamPCP has publicly stated intention to partner with ransomware and extortion groups, suggesting evolution from pure supply chain theft to ransomware-as-a-service coordination
Motivation: Financial — likely receives percentage of ransom/extortion payments from downstream threat actors like Lapsus$

Lapsus$ — Data Extortion Group
Lapsus$ is a well-known extortion group known for aggressive data theft and publication tactics. In this incident, they acquired Mercor data either through direct compromise or from TeamPCP through partnership/purchase:

Methodology: Data exfiltration followed by public proof-of-concept publication and ransom demands
Tactics: Leverage relationship exposure (Anthropic, OpenAI, Meta) to amplify pressure on victim organization
Success Rate: Known for high ransom payment rates through aggressive publication of sensitive data samples
Operational Pattern: Rapid data analysis to identify highest-value information (customer lists, source code, proprietary methodologies) for maximum negotiation leverage

Threat Actor Coordination Model
This incident illustrates a concerning trend: specialized division of labor in cybercriminal ecosystems. TeamPCP focuses on supply chain compromise and initial access; Lapsus$ specializes in data exfiltration and extortion. This partnership model allows each group to focus on their operational strengths while maximizing financial returns through coordinated attacks.

## Remediation & Mitigation

Immediate Response (For Affected Organizations)

Identify Exposure: Check package installation logs for LiteLLM versions 1.82.7 or 1.82.8 (PyPI timestamps ~March 27, 14:00-14:40 UTC)
Credential Rotation: Immediately rotate all API keys, authentication tokens, and credentials that may have been exposed to compromised systems
Access Review: Audit access logs for suspicious activity during and after the ~40 minute malicious package window and in subsequent days
Package Remediation: Uninstall LiteLLM 1.82.7/1.82.8; update to patched version 1.82.9+ from verified PyPI source
Dependency Scanning: Scan codebase and dependency trees for other potentially compromised packages

Supply Chain Security Hardening

Dependency Pinning: Use exact version pinning in dependency specifications to avoid automatic minor/patch version updates that could pull malicious packages
Package Verification: Implement cryptographic signature verification for all package downloads; verify source and maintainer identity
Build Isolation: Run dependency installation in isolated, sandboxed environments with network restrictions
SCA Tools: Deploy software composition analysis (SCA) tools with behavioral detection capabilities to identify credential-harvesting or exfiltration code
Vendor Security Assessment: Require open-source projects to implement CI/CD security best practices: 2FA, IP whitelisting, code review enforcement, signed commits

Detection & Monitoring

Monitor for outbound connections from Python/LiteLLM processes to unknown or unexpected IP addresses
Alert on environment variable enumeration or file system scanning by application processes
Log and monitor credential access patterns; detect anomalous credential usage (geographic inconsistency, unusual service access)
Implement network segmentation to limit lateral movement if credentials are compromised
Deploy endpoint detection and response (EDR) tools with behavioral analysis to identify credential harvesting

Long-Term Supply Chain Resilience

Open Source CI/CD Standards: Advocate for and implement SLSA Framework (Supply Chain Levels for Software Artifacts) to harden build pipelines
Attestation & Provenance: Use cryptographic attestation to verify package origin, build environment integrity, and maintainer identity
PyPI Security Enhancements: Require mandatory 2FA, implement package signature verification at repository level, and automated malware scanning
Vendor Relationship Management: Monitor security posture of critical open-source projects; establish SLAs requiring rapid security response
Secrets Management: Use environment-based secrets injection rather than credentials in config files or code; implement vault-based access controls

## Sources & References

TechCrunch — Mercor says it was hit by cyberattack tied to compromise of open-source LiteLLM project
https://techcrunch.com/2026/03/31/mercor-says-it-was-hit-by-cyberattack-tied-to-compromise-of-open-source-litellm-project/

Fortune — $10 billion Mercor AI startup hit by major data breach
https://fortune.com/2026/04/02/mercor-ai-startup-security-incident-10-billion/

The Register — LiteLLM supply chain attack hits Mercor and thousands of others
https://www.theregister.com/2026/04/02/mercor_supply_chain_attack/

Cybernews — Mercor data breach: 4TB of data stolen in LiteLLM supply chain attack
https://cybernews.com/security/mercor-data-breach-litelllm-supply-chain-attack/

Bank Info Security — Mercor Breach Linked to LiteLLM Supply Chain Attack
https://www.bankinfosecurity.com/mercor-breach-linked-to-litellm-supply-chain-attack-a-31340

The Next Web — Meta pauses Mercor AI work after breach exposes training secrets
https://thenextweb.com/news/meta-mercor-breach-ai-training-secrets-risk

Key Takeaways

Supply chain attack via LiteLLM CI/CD compromise exposed 4TB of sensitive data from $10B AI startup Mercor. TeamPCP demonstrated advanced supply chain capability; Lapsus$ executed extortion campaign. This incident signals dangerous trend of specialized threat actor partnerships targeting open-source infrastructure.
Critical Actions:

Check logs for LiteLLM 1.82.7/1.82.8
Rotate all exposed credentials immediately
Update to patched LiteLLM 1.82.9+
Implement SCA tools with behavioral detection
Audit access logs for unauthorized activity

Related Incidents

TeamPCP Supply Chain Attack
Broader context on TeamPCP's CI/CD compromise tactics and partnerships with extortion groups.
Axios UNC1069 Compromise
Another high-profile supply chain attack demonstrating vulnerability of trusted platforms.
European Commission Trivy Breach
Open-source supply chain vulnerability affecting government and enterprise infrastructure.

Affected Customers

Known Customers of Mercor:

Anthropic
OpenAI
Meta

Thousands of organizations using LiteLLM also compromised during ~40 minute malicious package window.

Data Exfiltrated

4 TB Total

Slack communications
Internal development tickets
Proprietary source code
Database records
AI system interaction videos
Customer data & training methodologies

Severity & Metrics

CRITICAL
Severity

$10B
Mercor Valuation at Risk

~2-3M
Compromised Installs (LiteLLM)

4 TB
Data Exfiltrated

40 Minutes
Malicious Package Window

40K+
Class Action Plaintiffs

// Hamburger menu functionality
