---
eventId: TP-2026-0052
title: "Mercor AI Supply Chain Breach via LiteLLM Compromise"
date: 2026-04-08
attackType: supply-chain
severity: high
sector: Technology / AI Services
geography: Global
threatActor: TeamPCP
attributionConfidence: A4
reviewStatus: draft_ai
confidenceGrade: C
generatedBy: dangermouse-bot
generatedDate: 2026-04-21
cves: []
relatedSlugs:
  - "teampcp-supply-chain-campaign-2026"
  - "cisco-trivy-supply-chain-breach-2026"
  - "european-commission-trivy-breach-2026"
tags:
  - "supply-chain"
  - "litellm"
  - "mercor"
  - "ai"
  - "credential-theft"
  - "extortion"
  - "teampcp"
  - "lapsus"
mitreMappings:
  - techniqueId: "T1195.001"
    techniqueName: "Supply Chain Compromise: Compromise Software Dependencies and Development Tools"
    tactic: "Initial Access"
    notes: "Malicious code injected into LiteLLM CI/CD pipeline produced trojanized PyPI releases 1.82.7 and 1.82.8 during a ~40 minute exposure window."
  - techniqueId: "T1199"
    techniqueName: "Trusted Relationship"
    tactic: "Initial Access"
    notes: "Exploited widespread trust in LiteLLM as a privileged dependency across AI/ML applications; downstream pipelines pulled the compromised version automatically."
  - techniqueId: "T1552.001"
    techniqueName: "Unsecured Credentials: Credentials In Files"
    tactic: "Credential Access"
    notes: "Runtime harvesting of API keys, auth tokens, and secrets from environment variables and config files on installations of the trojanized package."
  - techniqueId: "T1567"
    techniqueName: "Exfiltration Over Web Service"
    tactic: "Exfiltration"
    notes: "Harvested credentials and downstream ~4 TB of Mercor data exfiltrated via attacker-controlled web infrastructure."
  - techniqueId: "T1657"
    techniqueName: "Financial Theft"
    tactic: "Impact"
    notes: "Lapsus$ conducted a public extortion campaign against Mercor referencing exfiltrated Slack, source code, and contractor interaction material."
sources:
  - url: "https://techcrunch.com/2026/03/31/mercor-says-it-was-hit-by-cyberattack-tied-to-compromise-of-open-source-litellm-project/"
    publisher: "TechCrunch"
    publisherType: media
    reliability: R1
    publicationDate: "2026-03-31"
    accessDate: "2026-04-21"
    archived: false
  - url: "https://fortune.com/2026/04/02/mercor-ai-startup-security-incident-10-billion/"
    publisher: "Fortune"
    publisherType: media
    reliability: R1
    publicationDate: "2026-04-02"
    accessDate: "2026-04-21"
    archived: false
  - url: "https://www.theregister.com/2026/04/02/mercor_supply_chain_attack/"
    publisher: "The Register"
    publisherType: media
    reliability: R1
    publicationDate: "2026-04-02"
    accessDate: "2026-04-21"
    archived: false
  - url: "https://cybernews.com/security/mercor-data-breach-litelllm-supply-chain-attack/"
    publisher: "Cybernews"
    publisherType: media
    reliability: R2
    publicationDate: "2026-04-02"
    accessDate: "2026-04-21"
    archived: false
  - url: "https://www.bankinfosecurity.com/mercor-breach-linked-to-litellm-supply-chain-attack-a-31340"
    publisher: "BankInfoSecurity"
    publisherType: media
    reliability: R1
    publicationDate: "2026-04-01"
    accessDate: "2026-04-21"
    archived: false
  - url: "https://thenextweb.com/news/meta-mercor-breach-ai-training-secrets-risk"
    publisher: "The Next Web"
    publisherType: media
    reliability: R2
    publicationDate: "2026-04-03"
    accessDate: "2026-04-21"
    archived: false
  - url: "https://www.cisa.gov/news-events/alerts"
    publisher: "CISA"
    publisherType: government
    reliability: R1
    publicationDate: "2026-03-25"
    accessDate: "2026-04-21"
    archived: false
---
## Summary

On March 27, 2026, the TeamPCP threat actor cluster compromised the CI/CD pipeline of **LiteLLM**, an open-source Python library (97 million monthly downloads, present in approximately 36% of cloud AI environments) used as a unified interface across multiple LLM providers. For roughly 40 minutes, trojanized LiteLLM releases `1.82.7` and `1.82.8` were published to PyPI, harvesting API credentials and authentication tokens from every installation that occurred during the exposure window.

Mercor — a USD 10 billion AI startup providing data-annotation and QA services to leading AI companies — was among the organizations compromised via the LiteLLM path. On April 2, 2026, the extortion group **Lapsus$** claimed responsibility for exfiltrating approximately 4 TB of sensitive Mercor data, including Slack communications, internal tickets, proprietary source code, database records, and video recordings of AI-system interactions with contractors.

The breach exposed Mercor's working relationships with Anthropic, OpenAI, and Meta. Meta subsequently paused AI-data work with Mercor following the disclosure, and a class-action lawsuit was filed on April 1, 2026, potentially affecting more than 40,000 individuals. This incident is tracked as the Mercor-specific victim pane of the broader [TeamPCP Multi-Ecosystem Supply Chain Campaign](/campaigns/teampcp-supply-chain-campaign-2026/).

## Technical Analysis

LiteLLM provides a unified API across OpenAI, Anthropic, Cohere, Azure OpenAI, and other LLM vendors and is widely treated as privileged infrastructure by AI applications. TeamPCP gained unauthorised access to the LiteLLM project's CI/CD pipeline — the same technique pattern the actor used against Aqua's Trivy action and Checkmarx's KICS — and used that access to publish two trojanized releases with credential-harvesting payloads.

The malicious package enumerated runner and host environment for API keys, tokens, and secrets; read common credential-bearing config files; and exfiltrated findings to attacker infrastructure. Credential harvesting triggered during package installation and initialisation, before any downstream application-layer security tooling could react. Credentials obtained from Mercor installations were the leverage used to pivot into Mercor's broader environment, from which Lapsus$ extracted the 4 TB dataset referenced in the public extortion campaign.

Scale of exposure: ~97M LiteLLM monthly downloads overall; ~36% cloud-environment presence; the ~40 minute malicious window produced an estimated 2–3 million direct installations of the compromised versions. Mercor is the most prominent named victim to date; many others are affected but undisclosed.

## Attack Chain

### Stage 1: CI/CD access to LiteLLM

TeamPCP obtains credentials or exploits a vulnerability in LiteLLM's build infrastructure. Likely paths (per public reporting): compromised maintainer credentials or GitHub Actions token theft consistent with the wider TeamPCP campaign.

### Stage 2: Malicious payload insertion

Credential-harvesting code is injected into LiteLLM initialisation and dependency-loading paths to ensure execution during install and runtime.

### Stage 3: PyPI publication

Trojanized versions `1.82.7` and `1.82.8` are published to PyPI. Automatic dependency resolvers worldwide begin pulling them.

### Stage 4: Credential harvesting at scale

On installation the payload enumerates environment variables, config files, and local secrets stores; harvested material is exfiltrated to attacker-controlled infrastructure.

### Stage 5: Lateral movement into Mercor

Credentials harvested from Mercor's LiteLLM instances are used to authenticate to internal services, databases, and cloud resources, enabling broader access inside Mercor.

### Stage 6: 4 TB data exfiltration

Slack history, internal tickets, source-code repositories, database exports, and AI-interaction video recordings are exfiltrated from Mercor infrastructure.

### Stage 7: Public extortion by Lapsus$

Lapsus$ publishes proof-of-theft samples on April 1, 2026, and issues a ransom demand. The group explicitly references Mercor's relationships with Anthropic, OpenAI, and Meta to maximize pressure.

## Impact Assessment

**Mercor-direct.** USD 10 billion valuation materially at risk through customer-confidence impact. Meta paused AI-data work pending resolution. 4 TB exfiltrated, including Slack communications, internal architecture, source code, and contractor-interaction recordings. Class-action lawsuit filed on April 1, 2026, with plaintiff class potentially exceeding 40,000 individuals. Significant ongoing incident-response, forensic, legal-defense, and notification costs.

**Ecosystem.** Thousands of organizations are exposed via the LiteLLM dependency path; ~2–3 million direct installations during the exposure window. The compromise is corroborating evidence for the broader argument that privileged AI/ML infrastructure libraries deserve CI/CD hardening equivalent to security tooling.

**AI-sector specific.** Mercor's customers (Anthropic, OpenAI, Meta) face indirect reputational exposure through association with a compromised contractor. The exfiltrated data plausibly includes proprietary prompts, training methodologies, and contractor-interaction material with long-tail analytical value beyond immediate extortion leverage.

**Regulatory and legal.** GDPR / CCPA exposure where the exfiltrated material contains personal information of contractors or end-users. Ongoing investigation activity by federal authorities; Lapsus$ attribution brings the incident within existing DOJ / FBI Lapsus$ case activity.

## Attribution

**Confidence: A4.** Initial-access attribution to the TeamPCP cluster is supported by multi-vendor reporting (Microsoft, Akamai, Wiz, others) tracking the broader campaign of which the LiteLLM compromise is one vector. The Mercor-specific extortion is publicly claimed by Lapsus$, which has a well-documented prior history of aggressive data-theft-plus-publication operations. The exact division of labor between TeamPCP (initial access / pipeline compromise) and Lapsus$ (downstream victim monetization) is consistent with specialized-partnership patterns seen elsewhere in 2025–2026 extortion activity but is not independently confirmed by government source here.

No U.S. or EU government advisory has, at time of writing, named either actor in connection with the Mercor-specific incident.

## Timeline

### 2026-03-27 — LiteLLM CI/CD compromise

TeamPCP gains access to the LiteLLM build pipeline (exact vector not public).

### 2026-03-27 ~14:00 UTC — Trojanized packages published

LiteLLM `1.82.7` and `1.82.8` go live on PyPI; automated downloads begin worldwide.

### 2026-03-27 ~14:40 UTC — Maintainer detection

LiteLLM maintainers identify the rogue releases and issue a security notice; PyPI removes the compromised versions. Exposure window closes at approximately 40 minutes.

### 2026-03-28 – 2026-03-31 — Downstream discovery

Affected organizations begin identifying the malicious versions in installation logs; incident-response and forensic work begins. LiteLLM project hardens its CI/CD posture.

### 2026-03-31 — Mercor internal detection

Mercor traces unauthorised access back to credentials harvested from its LiteLLM installations during the exposure window.

### 2026-04-01 — Lapsus$ claim + lawsuit

Lapsus$ publicly claims the Mercor breach, publishes proof-of-theft samples, and issues a ransom demand. Class-action lawsuit filed the same day.

### 2026-04-02 — Mercor customer notifications

Mercor confirms the breach to customers including Meta, Anthropic, and OpenAI. Meta announces a pause in AI-data work with Mercor.

### 2026-04-08 — Incident reporting stabilises

Wider sector reporting converges on the TeamPCP ↔ LiteLLM ↔ Mercor attribution chain.

## Remediation & Mitigation

**For organizations that installed LiteLLM during the exposure window.**

- Identify exposure via package-install logs for LiteLLM `1.82.7` or `1.82.8` between approximately `2026-03-27 14:00–14:40 UTC`.
- Rotate every API key, auth token, and credential that was reachable from the affected Python process or its environment; revoke rather than simply rotate wherever feasible.
- Pin LiteLLM to a known-safe release (≤ `1.82.6` or ≥ `1.82.9`) and audit dependency manifests for transitive pulls.
- Review access logs for anomalous activity during and after the exposure window for the specific credentials involved.

**Supply-chain hardening (general).**

- Exact version pinning and immutable-commit-SHA pinning for CI/CD actions (lessons carry across the TeamPCP campaign's several vectors).
- Package-signature verification and software bill-of-materials (SBOM) review as part of dependency intake.
- Isolated / sandboxed dependency installation with egress restrictions; egress telemetry on Python processes fetching dependencies.
- SCA tools with behavioral detection, not just signature matching, to catch credential-harvesting code in otherwise-known-good libraries.

**For privileged AI/ML infrastructure owners.** Treat widely-used LLM-integration libraries as privileged dependencies deserving the same CI/CD hygiene and publishing controls as security tooling — the assumption of benign-ness is exactly the trust gradient TeamPCP exploited here.

## Sources & References

- [TechCrunch: Mercor says it was hit by cyberattack tied to compromise of open-source LiteLLM project](https://techcrunch.com/2026/03/31/mercor-says-it-was-hit-by-cyberattack-tied-to-compromise-of-open-source-litellm-project/) — TechCrunch, 2026-03-31
- [Fortune: USD 10 billion Mercor AI startup hit by major data breach](https://fortune.com/2026/04/02/mercor-ai-startup-security-incident-10-billion/) — Fortune, 2026-04-02
- [The Register: LiteLLM supply-chain attack hits Mercor and thousands of others](https://www.theregister.com/2026/04/02/mercor_supply_chain_attack/) — The Register, 2026-04-02
- [Cybernews: Mercor data breach — 4 TB of data stolen in LiteLLM supply-chain attack](https://cybernews.com/security/mercor-data-breach-litelllm-supply-chain-attack/) — Cybernews, 2026-04-02
- [BankInfoSecurity: Mercor Breach Linked to LiteLLM Supply-Chain Attack](https://www.bankinfosecurity.com/mercor-breach-linked-to-litellm-supply-chain-attack-a-31340) — BankInfoSecurity, 2026-04-01
- [The Next Web: Meta pauses Mercor AI work after breach exposes training secrets](https://thenextweb.com/news/meta-mercor-breach-ai-training-secrets-risk) — The Next Web, 2026-04-03
- [CISA: Supply-Chain Compromise Alerts — TeamPCP / Trivy / LiteLLM campaign coverage (corroborating government reference, not Mercor-specific primary)](https://www.cisa.gov/news-events/alerts) — CISA, 2026-03-25
