---
eventId: TP-2026-0334
title: "Scam Disruption Week Industrial Scam Crackdown"
date: 2026-05-18
attackType: Financial
severity: high
sector: Multiple Sectors
geography: "United States; Southeast Asia; Global"
threatActor: "Unknown"
attributionConfidence: A4
reviewStatus: draft_ai
confidenceGrade: B
generatedBy: dangermouse-bot
generatedDate: 2026-06-06
generation:
  provider: "openai"
  model: "Codex GPT-5.3 Spark"
  tool: "codex"
  agent: "dangermouse-bot"
  promptProfile: "Threatpedia Danger Mouse"
cves: []
relatedSlugs: []
tags:
  - "financial-fraud"
  - "scam-centers"
  - "cryptocurrency"
  - "law-enforcement"
  - "southeast-asia"
sources:
  - url: "https://www.justice.gov/opa/pr/scam-center-strike-force-announces-results-us-private-industry-disruption-week"
    publisher: "U.S. Department of Justice"
    publisherType: government
    reliability: R1
    publicationDate: "2026-06-03"
    accessDate: "2026-06-06"
    archived: false
  - url: "https://about.fb.com/news/2026/06/leading-tech-companies-law-enforcement-disrupt-criminal-scam-networks-in-southeast-asia/"
    publisher: "Meta"
    publisherType: vendor
    reliability: R1
    publicationDate: "2026-06-03"
    accessDate: "2026-06-06"
    archived: false
  - url: "https://www.securityweek.com/over-1-4-million-accounts-disrupted-in-cybercrime-crackdown/"
    publisher: "SecurityWeek"
    publisherType: media
    reliability: R2
    publicationDate: "2026-06-04"
    accessDate: "2026-06-06"
    archived: false
mitreMappings:
  - techniqueId: "T1585.001"
    techniqueName: "Social Media Accounts"
    tactic: "Resource Development"
    attack-version: "v19"
    confidence: "confirmed"
    evidence: "DOJ and Meta reported disruption of Facebook, Instagram, email, and other accounts used by scam networks."
  - techniqueId: "T1583.004"
    techniqueName: "Server"
    tactic: "Resource Development"
    attack-version: "v19"
    confidence: "probable"
    evidence: "DOJ and SecurityWeek reported decommissioning of servers, hosting infrastructure, and network connections linked to scam networks."
---

## Summary

On May 18, 2026, the U.S. Department of Justice's Scam Center Strike Force convened Disruption Week, a public-private action aimed at cyber-enabled and cryptocurrency fraud networks operating from Southeast Asia. The event brought federal investigators, foreign law enforcement partners, and technology companies together to exchange information about scam infrastructure used to target people in the United States and elsewhere.

The disruption produced account, infrastructure, and financial actions across multiple platforms. DOJ reported more than 1.4 million social media and email accounts disrupted, over $3.8 million in cryptocurrency frozen, server and hosting infrastructure removed, and seven arrests in Thailand. Meta reported related industry results that included 1.4 million Facebook and Instagram accounts, pages, and groups disabled, about 20,000 Microsoft accounts suspended, thousands of Starlink kits terminated, more than $3 million in cryptocurrency assets frozen by Coinbase, and 63 arrests by law enforcement.

The public sources describe the criminal operators as transnational organized crime networks tied to scam centers in Southeast Asia. No single named threat actor was confirmed across the available reporting, so attribution remains Unknown.

## Technical Analysis

The operation targeted the infrastructure and online resources that support large-scale romance scams, cryptocurrency investment fraud, and related social engineering activity. DOJ described scam centers that use online accounts, internet access, hosting, and fraudulent investment platforms to contact victims, move stolen funds, and maintain access to U.S.-facing services.

Investigators from the FBI, U.S. Secret Service, and Homeland Security Investigations shared target information with private-sector participants during meetings held in Washington from May 18 to May 21. Companies then used that information, alongside their own telemetry, to identify account clusters, IP traffic, internet access, hosting, and financial flows associated with scam networks.

The technical disruption did not depend on a single malware family or vulnerability. It focused on removing adversary-controlled resources: social media accounts, email accounts, Microsoft accounts, Starlink connectivity, malicious IP traffic, servers, hosting environments, and cryptocurrency assets tied to fraud operations.

## Attack Chain

### Stage 1: Scam workforce recruitment

DOJ reported that scam syndicates lure workers to Thailand with promises of technical jobs, seize identification documents, and move some workers into scam compounds in Cambodia, Laos, and Burma.

### Stage 2: Account and infrastructure preparation

The operators use social media accounts, email accounts, internet access, servers, and hosting environments to support fraud activity. Meta and DOJ both reported disruption of account and infrastructure resources tied to these networks.

### Stage 3: Victim contact and grooming

The scams target victims through romance, investment, and other online fraud approaches. DOJ described cryptocurrency investment fraud in which victims are convinced to deposit funds into fraudulent platforms that appear to show returns.

### Stage 4: Fund movement and laundering

After victims deposit funds, DOJ said the money flows to the scammers. During Disruption Week, shared information enabled private-sector participants to freeze cryptocurrency assets linked to laundering of funds stolen from victims.

### Stage 5: Cross-sector disruption

Law enforcement and companies acted against accounts, internet access, hosting, network traffic, and cryptocurrency assets. The Royal Thai Police also opened new cases and made arrests tied to scam activity.

## Impact Assessment

Disruption Week reduced access to infrastructure used by scam networks across multiple online services. DOJ reported disruptions across more than 1.4 million social media and email accounts, interruptions of malicious IP traffic and network connections, decommissioned servers and hosting infrastructure, over $3.8 million in frozen cryptocurrency, and seven arrests in Thailand.

Meta's account of the same joint operation reported more than 1.4 million Facebook and Instagram accounts, pages, and groups disabled; about 20,000 Microsoft accounts suspended; thousands of Starlink kits terminated; more than $3 million in cryptocurrency assets frozen by Coinbase; and 63 arrests connected to scam centers.

The wider victim impact remains broader than the assets disrupted in this action. DOJ cited IC3 figures showing reported U.S. losses from cryptocurrency investment fraud rising from $3.96 billion in 2023 to $5.8 billion in 2024 and over $7.2 billion in 2025.

## Attribution

The available sources attribute the activity to transnational organized crime networks operating scam centers in Southeast Asia. DOJ stated that many such schemes are run from industrial-scale compounds in Cambodia, Laos, and Burma along the border with Thailand.

DOJ also described Chinese organized crime groups behind portions of the scam-center threat, but the public reporting for Disruption Week did not assign the disrupted infrastructure to one named actor. The threat actor remains Unknown and attribution is limited to the source-supported regional and criminal-network description.

## Timeline

### 2025-11-01 - Scam Center Strike Force launched

DOJ said the Scam Center Strike Force was launched in November 2025 to address cryptocurrency investment fraud, cyber-enabled fraud, human trafficking, and money laundering linked to scam centers.

### 2026-05-18 - Disruption Week began

DOJ convened government and private-sector participants for Disruption Week, with meetings held in Washington from May 18 to May 21.

### 2026-05-21 - Operational meetings concluded

The formal meeting period ended after investigators and participating companies exchanged target information for follow-on disruption.

### 2026-06-03 - DOJ and Meta published results

DOJ and Meta announced public results from the operation, including account removals, cryptocurrency freezes, infrastructure actions, and arrests.

### 2026-06-04 - Independent cybersecurity coverage followed

SecurityWeek reported on the operation and summarized the account, infrastructure, cryptocurrency, and arrest outcomes.

## Remediation & Mitigation

- Monitor for account creation and coordinated account behavior tied to romance scams, investment fraud, and impersonation activity.
- Share high-confidence scam-center indicators with law enforcement and trusted platform partners through controlled channels.
- Disrupt attacker resources across the full fraud path, including accounts, hosting, internet access, payment rails, and cryptocurrency wallets.
- Add friction to account registration, recovery, and messaging patterns associated with large-scale scam operations.
- Preserve evidence when removing scam infrastructure so law enforcement can link online activity to real-world operators.
- Educate users that fraudulent investment platforms can display false returns while routing deposits directly to criminals.

## Sources & References

- [U.S. Department of Justice: Scam Center Strike Force Announces Results of U.S. & Private Industry "Disruption Week"](https://www.justice.gov/opa/pr/scam-center-strike-force-announces-results-us-private-industry-disruption-week) — U.S. Department of Justice, 2026-06-03
- [Meta: Leading Tech Companies and Law Enforcement Join Forces to Disrupt Criminal Scam Networks in Southeast Asia](https://about.fb.com/news/2026/06/leading-tech-companies-law-enforcement-disrupt-criminal-scam-networks-in-southeast-asia/) — Meta, 2026-06-03
- [SecurityWeek: Over 1.4 Million Accounts Disrupted in Cybercrime Crackdown](https://www.securityweek.com/over-1-4-million-accounts-disrupted-in-cybercrime-crackdown/) — SecurityWeek, 2026-06-04
