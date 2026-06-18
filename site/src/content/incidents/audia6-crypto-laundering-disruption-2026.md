---
eventId: TP-2026-0377
title: AudiA6 Crypto Laundering Service Disruption
date: 2026-06-10
attackType: Financial
severity: high
sector: Financial Services / Cybercrime Infrastructure
geography: Europe / Georgia
threatActor: Unknown
attributionConfidence: A6
reviewStatus: draft_ai
confidenceGrade: C
generatedBy: dangermouse-bot
generatedDate: 2026-06-18
generation:
  provider: openai
  model: gpt-5.3-spark
  tool: codex
  agent: dangermouse-bot
  lane: danger-mouse-claude-lane
  surface: codex-desktop
  promptProfile: threatpedia-pipeline-article
cves: []
relatedSlugs: []
tags:
  - audia6
  - cryptocurrency-laundering
  - ransomware
  - cybercrime-infrastructure
  - europol
  - eurojust
  - georgia
sources:
  - url: "https://news.risky.biz/risky-bulletin-in-the-age-of-ai-cisa-changes-federal-patching-rules"
    publisher: "Risky Business News"
    publisherType: media
    reliability: R2
    publicationDate: "2026-06-12"
    accessDate: "2026-06-18"
    archived: false
  - url: "https://www.europol.europa.eu/media-press/newsroom/news/ransomware-gangs-cut-eur-336-million-audia6-crypto-laundering-pipeline"
    publisher: "Europol"
    publisherType: government
    reliability: R1
    publicationDate: "2026-06-11"
    accessDate: "2026-06-18"
    archived: false
  - url: "https://www.eurojust.europa.eu/news/cryptocurrency-money-laundering-site-shut-down-thanks-coordinated-investigation"
    publisher: "Eurojust"
    publisherType: government
    reliability: R1
    publicationDate: "2026-06-11"
    accessDate: "2026-06-18"
    archived: false
  - url: "https://www.trmlabs.com/fr/resources/blog/international-operation-dismantles-eur-336-million-ransomware-laundering-pipeline-audia6"
    publisher: "TRM Labs"
    publisherType: research
    reliability: R2
    publicationDate: "2026-06-12"
    accessDate: "2026-06-18"
    archived: false
mitreMappings:
  - techniqueId: "T1583.006"
    techniqueName: "Web Services"
    tactic: "Resource Development"
    attack-version: "v19"
    confidence: "possible"
    evidence: "Europol and Eurojust reported that AudiA6 operated as a web-based cryptocurrency laundering service, with 25 domains taken down and more than 30 servers seized during the operation."
---

## Summary

On June 10, 2026, authorities in Georgia acted as part of an international investigation that disrupted AudiA6, a cryptocurrency laundering service accused by Europol and Eurojust of processing more than EUR 336 million in criminal cryptocurrency between 2022 and 2025. Europol described the service as a financial pipeline for ransomware actors and other cybercriminal users seeking to convert stolen digital assets into funds while obscuring the trail.

The public law-enforcement record ties the case to a coordinated operation involving Europol, Eurojust, Georgian authorities, and investigators from multiple partner countries. Authorities reported two alleged administrators arrested in Georgia, three properties searched, 25 domains taken down, more than 30 servers seized, and cryptocurrency and physical assets frozen or seized.

This incident is best understood as a disruption of cybercrime financial infrastructure. The sources do not support attribution to one ransomware group, a specific victim set, or a single intrusion campaign. Attribution therefore remains Unknown, with the confirmed scope limited to the AudiA6 service, its suspected laundering role, and the law-enforcement action against its operators and infrastructure.

## Technical Analysis

AudiA6 functioned as a cash-out and laundering service for users who wanted to move cryptocurrency linked to ransomware and other cybercrime activity. Eurojust described the workflow as customers transferring stolen cryptocurrency to wallets controlled by the criminal group and receiving cleaned funds back after a chain of transactions designed to conceal the source of the money. Eurojust also reported that the operators charged commissions between 3 percent and 10 percent.

Europol said its analysis linked AudiA6 to more than 15 international cybercrime investigations. Eurojust stated that the service was suspected of laundering more than EUR 336 million in criminal cryptocurrency between 2022 and 2025. TRM Labs separately framed the case as part of a broader pattern in which a small number of off-ramp services concentrate ransomware cash-out volume.

The infrastructure component of the disruption was domain and server focused. Eurojust reported the takedown of 25 domains and seizure of more than 30 servers. Europol also said Telegram accounts associated with the network were suspended. Those actions indicate that the operation targeted service availability, customer access paths, and backend infrastructure rather than only arresting alleged administrators.

Law-enforcement sources also connect AudiA6 to a separate cybercrime forum known as Dark2Web. Europol and Eurojust described that forum as a marketplace used to advertise illicit services and connect cybercriminal actors. The public sources do not provide enough detail to treat Dark2Web as a separate operation within this incident, but it matters as part of the alleged service ecosystem around AudiA6.

## Attack Chain

### Stage 1: Criminal proceeds enter laundering workflow

Europol and Eurojust reported that AudiA6 was used by ransomware actors and other cybercriminal users to cash out stolen digital assets. Public sources describe this as a laundering service rather than a malware deployment or initial-access operation.

### Stage 2: Funds are transferred to service-controlled wallets

Eurojust stated that customers transferred stolen cryptocurrency to wallets controlled by the criminal group behind the service. The public sources do not identify every wallet, asset type, or customer group.

### Stage 3: Transactions obscure the origin of funds

Eurojust described a complex chain of transactions designed to conceal the origin of the money. TRM Labs reported that ransomware off-ramp activity often uses concentrated services and obfuscation layers, but that broader industry pattern should not be read as a confirmed description of every AudiA6 transaction.

### Stage 4: Cleaned funds are returned to customers

Eurojust said customers could receive cleaned funds within around an hour and that the operators charged commissions between 3 percent and 10 percent. The public record does not identify a full customer list.

### Stage 5: International authorities disrupt the service

On June 10, 2026, authorities searched properties in Georgia, arrested two alleged administrators, took down domains, seized servers, and froze or seized cryptocurrency and other assets. Europol and Eurojust describe the action as the result of coordinated international cooperation.

## Impact Assessment

The disruption removed a suspected laundering path for cybercriminal users and ransomware actors. Europol characterized AudiA6 as a service used to wash hundreds of millions in illicit profits, and Eurojust reported more than EUR 336 million suspected laundering volume between 2022 and 2025.

The immediate enforcement impact included the arrest of two alleged administrators in Georgia, searches of three properties, takedown of 25 domains, seizure of more than 30 servers, freezing of EUR 692,000 in cryptocurrency, seizure of more than EUR 86,000 in cryptocurrency, and seizure of more than 80 vehicles and multiple properties in Georgia, according to Eurojust.

The investigative impact may extend beyond the takedown itself. Europol said its analysis linked the service to more than 15 international cybercrime investigations. Seized infrastructure and financial records may support follow-on investigations, but public sources do not provide a complete list of downstream cases or confirmed customers.

## Attribution

Attribution remains Unknown. Europol and Eurojust identify alleged administrators and describe cybercriminal users of the service, but they do not attribute AudiA6 to a named ransomware operation or state-linked actor in the public material reviewed here.

The public sources do support a narrow attribution statement: AudiA6 is alleged to have been operated by a criminal group that also ran or administered Dark2Web, and the service is suspected of serving ransomware actors and other cybercriminal users. That does not establish that every ransomware actor using the service belonged to one group.

## Timeline

### 2022-01-01 — Suspected laundering window begins

Eurojust reported that AudiA6 was suspected of laundering criminal cryptocurrency between 2022 and 2025. The public source did not provide a more precise start date.

### 2025-09-01 — Investigation-linked arrest in Poland

Europol reported that the investigation was linked to a September 2025 arrest in Poland, which helped investigators build the case against the service.

### 2026-06-10 — Action day in Georgia

Authorities conducted searches in Georgia, arrested two alleged administrators, took down domains, seized servers, and froze or seized assets tied to the service.

### 2026-06-11 — Europol and Eurojust announce the disruption

Europol and Eurojust published public statements describing the coordinated investigation, suspected laundering volume, enforcement actions, and international partners.

### 2026-06-12 — Risky Bulletin and industry reporting summarize the case

Risky Bulletin and TRM Labs covered the operation, with TRM Labs adding industry context on ransomware off-ramp concentration.

## Remediation & Mitigation

For cryptocurrency exchanges, wallet providers, and payment intermediaries, the case reinforces the value of monitoring for exposure to laundering services, sanctioned entities, cybercrime forums, and high-risk off-ramp patterns. Controls should include transaction monitoring, risk scoring, and escalation paths for law-enforcement requests.

For organizations paying or negotiating after ransomware incidents, the disruption is a reminder that payment flows may pass through third-party laundering infrastructure beyond the immediate ransomware operator. Incident response teams should preserve wallet, transaction, and communication artifacts so investigators can link payments to service providers and cash-out paths.

For defenders tracking cybercrime infrastructure, the useful indicators are not limited to malware infrastructure. Domains, servers, Telegram accounts, forum advertisements, wallet clusters, and exchange off-ramps can be part of the same operational ecosystem. The public sources do not provide complete indicator lists for AudiA6, so defensive teams should rely on official notices, exchange compliance feeds, and blockchain-intelligence reporting for current indicators.

## Sources & References

- [Risky Business News: Risky Bulletin: In the age of AI, CISA changes federal patching rules](https://news.risky.biz/risky-bulletin-in-the-age-of-ai-cisa-changes-federal-patching-rules) — Risky Business News, 2026-06-12
- [Europol: Ransomware gangs cut off from EUR 336 million AudiA6 crypto laundering pipeline](https://www.europol.europa.eu/media-press/newsroom/news/ransomware-gangs-cut-eur-336-million-audia6-crypto-laundering-pipeline) — Europol, 2026-06-11
- [Eurojust: Cryptocurrency money laundering site shut down thanks to coordinated investigation](https://www.eurojust.europa.eu/news/cryptocurrency-money-laundering-site-shut-down-thanks-coordinated-investigation) — Eurojust, 2026-06-11
- [TRM Labs: International operation dismantles EUR 336 million ransomware laundering pipeline AudiA6](https://www.trmlabs.com/fr/resources/blog/international-operation-dismantles-eur-336-million-ransomware-laundering-pipeline-audia6) — TRM Labs, 2026-06-12
