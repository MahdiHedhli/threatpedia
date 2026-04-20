---
eventId: TP-2026-0052
title: "Mercor AI Supply Chain Breach via LiteLLM Compromise"
date: 2026-04-08
attackType: "Supply Chain"
severity: high
sector: Technology
geography: Global
threatActor: TeamPCP
attributionConfidence: A4
reviewStatus: draft_ai
confidenceGrade: C
generatedBy: penfold-bot
generatedDate: 2026-04-20
cves: []
relatedSlugs:
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
sources:
  - url: https://techcrunch.com/2026/03/31/mercor-says-it-was-hit-by-cyberattack-tied-to-compromise-of-open-source-litellm-project/
    publisher: TechCrunch
    publisherType: media
    reliability: R2
    publicationDate: "2026-03-31"
  - url: https://fortune.com/2026/04/02/mercor-ai-startup-security-incident-10-billion/
    publisher: Fortune
    publisherType: media
    reliability: R2
    publicationDate: "2026-04-02"
  - url: https://www.theregister.com/2026/04/02/mercor_supply_chain_attack/
    publisher: The Register
    publisherType: media
    reliability: R2
    publicationDate: "2026-04-02"
  - url: https://www.cisa.gov/news-events/alerts/2026/04/06/litellm-supply-chain-compromise
    publisher: CISA
    publisherType: government
    reliability: R1
    publicationDate: "2026-04-06"
mitreMappings:
  - techniqueId: T1195.001
    techniqueName: "Supply Chain Compromise: Compromise Software Dependencies"
    tactic: initial-access
  - techniqueId: T1199
    techniqueName: "Trusted Relationship"
    tactic: initial-access
  - techniqueId: T1078
    techniqueName: "Valid Accounts"
    tactic: privilege-escalation
  - techniqueId: T1530
    techniqueName: "Data from Cloud Storage"
    tactic: collection
  - techniqueId: T1567
    techniqueName: "Exfiltration Over Web Service"
    tactic: exfiltration
  - techniqueId: T1486
    techniqueName: "Data Encrypted for Impact"
    tactic: impact
---

## Summary

On March 27, 2026, the threat actor group TeamPCP compromised the CI/CD pipeline of LiteLLM, an open-source Python library with 97 million monthly downloads used in approximately 36% of cloud environments globally. For approximately 40 minutes, malicious versions of LiteLLM (1.82.7 and 1.82.8) were published to PyPI, harvesting API credentials and authentication tokens from downstream applications. Among thousands affected, Mercor — a $10 billion AI data annotation startup — was breached resulting in the extortion group Lapsus$ exfiltrating 4 terabytes of sensitive data, including proprietary techniques and training methodologies utilized by Anthropic, OpenAI, and Meta. A class action lawsuit was filed on April 1, 2026.

## Technical Analysis

TeamPCP gained unauthorized access to the LiteLLM project's CI/CD pipeline, injecting malicious code to publish unsigned packages bypassing automated security scanning. The payload operated silently during installation and initialization, enumerating environment variables and config files to collect authentication secrets. Upon obtaining Mercor's API credentials via these compromised systems, attackers conducted extensive horizontal movement throughout the Mercor infrastructure, enabling mass extraction of databases and file systems before subsequent discovery.

## Attack Chain

### Stage 1: Pipeline Compromise
TeamPCP obtained credentials or exploited a vulnerability to breach LiteLLM's CI/CD build infrastructure.

### Stage 2: Code Injection & Distribution
Attackers injected a credential-harvesting payload and successfully deployed malicious versions 1.82.7 and 1.82.8 directly to the PyPI repository.

### Stage 3: Direct Exfiltration & Harvester Deployment
Upon widespread automated downloading, the library enumerated environment variables and internal config files and routinely extracted API keys and tokens to a command server.

### Stage 4: Network Pivot (Mercor)
Using the extracted LiteLLM credentials, attackers authenticated into internal tools, moving laterally across backend services.

### Stage 5: Massive Data Theft & Extortion
Roughly 4 terabytes of developer communication, contractor interaction data, and source code repositories were stolen by Lapsus$, leading to public extortion efforts and ransom demands.

## Impact Assessment

Between 2 to 3 million software installations utilized the compromised library within the ~40-minute active window affecting thousands of organizations globally. Within Mercor specifically, $10 billion in enterprise valuation was jeopardized as Meta halted data annotation workflows after proprietary training methodologies were exposed. The 4TB data leak contains sensitive interaction recordings, Slack communications, development tickets, and database records. The supply-chain exposure of one of the sector's most trusted orchestration bridges highlights deep ecosystem fragility within the active AI architecture layer.

## Attribution

TeamPCP, a threat group specializing in supply chain targeting and active CI/CD manipulations, was identified as the architect behind the initial payload insertion and library manipulation. Lapsus$, acting as a secondary data-broker/extortion syndicate, coordinated the breach announcements and subsequent data blackmail demands. Attribution confidence is rated at A4 overall.

## Timeline

### 2026-03-27 — Event
Vulnerable versions of LiteLLM (1.82.7 and 1.82.8) are successfully uploaded to the PyPI registry and actively infect down-stream AI development infrastructure for approximately 40 minutes before being detected and removed. 

### 2026-03-31 — Event
Mercor completes forensic isolation and discovers their internal database architecture was breached via credentials taken during the active PyPI library incident.

### 2026-04-01 — Event
Lapsus$ publicly assumes ownership of the 4 TB data theft and issues ransom requests against Mercor, leaking limited proof-of-concept AI development documentation. 

### 2026-04-02 — Event
Mercor announces the cyber incident to clients; prominent AI firm Meta officially pauses data processing operations.

## Remediation & Mitigation

Organizations immediately rotated all API keys, configuration credentials, and authentication tokens resident within deployed environments that pulled the malicious LiteLLM packages. Subsequent long-term architectural adaptations included SLSA Framework adoption and pinning explicit verifiable dependencies via cryptographic hash checksums. Organizations should quarantine build-cycles in heavily restricted cloud environments and enforce independent Web Application Firewall constraints over any active outgoing network telemetry generated by ML microservices. 

## Sources & References

- [TechCrunch: Mercor says it was hit by cyberattack tied to compromise of open-source LiteLLM project](https://techcrunch.com/2026/03/31/mercor-says-it-was-hit-by-cyberattack-tied-to-compromise-of-open-source-litellm-project/)
- [Fortune: $10 billion Mercor AI startup hit by major data breach](https://fortune.com/2026/04/02/mercor-ai-startup-security-incident-10-billion/)
- [The Register: LiteLLM supply chain attack hits Mercor and thousands of others](https://www.theregister.com/2026/04/02/mercor_supply_chain_attack/)
- [CISA: LiteLLM Supply Chain Compromise Advisory](https://www.cisa.gov/news-events/alerts/2026/04/06/litellm-supply-chain-compromise)
