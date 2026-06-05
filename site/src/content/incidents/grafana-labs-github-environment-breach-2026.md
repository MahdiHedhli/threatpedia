---
eventId: TP-2026-0316
title: "Grafana Labs GitHub Environment Breach and Codebase Theft, May 2026"
date: 2026-05-11
attackType: credential theft
severity: high
sector: Technology
geography: Global
threatActor: Unknown
attributionConfidence: A4
reviewStatus: draft_ai
confidenceGrade: C
generatedBy: dangermouse-bot
generatedDate: 2026-06-05
cves: []
relatedSlugs:
  - tanstack-npm-supply-chain-compromise-2026
tags:
  - grafana
  - github
  - source-code-theft
  - credential-theft
  - extortion
  - tanstack
  - supply-chain
sources:
  - url: "https://grafana.com/blog/grafana-labs-security-update-latest-on-tanstack-npm-supply-chain-ransomware-incident/"
    publisher: "Grafana Labs"
    publisherType: vendor
    reliability: R1
    publicationDate: "2026-05-19"
    accessDate: "2026-06-05"
    archived: false
  - url: "https://techcrunch.com/2026/05/18/open-source-tool-maker-grafana-labs-says-hackers-stole-its-code-refuses-to-pay-ransom/"
    publisher: "TechCrunch"
    publisherType: media
    reliability: R2
    publicationDate: "2026-05-18"
    accessDate: "2026-06-05"
    archived: false
  - url: "https://www.securityweek.com/grafana-confirms-breach-after-hackers-claim-they-stole-data/"
    publisher: "SecurityWeek"
    publisherType: media
    reliability: R2
    publicationDate: "2026-05-18"
    accessDate: "2026-06-05"
    archived: false
  - url: "https://www.fbi.gov/how-we-can-help-you/scams-and-safety/common-frauds-and-scams/ransomware"
    publisher: "FBI"
    publisherType: government
    reliability: R1
    publicationDate: "2026-06-05"
    accessDate: "2026-06-05"
    archived: false
mitreMappings:
  - techniqueId: "T1195.001"
    techniqueName: "Compromise Software Dependencies and Development Tools"
    tactic: "Initial Access"
    attack-version: "v19"
    confidence: probable
    evidence: "Grafana Labs stated that the incident originated from the TanStack npm supply-chain attack via the Mini Shai-Hulud campaign."
  - techniqueId: "T1528"
    techniqueName: "Steal Application Access Token"
    tactic: "Credential Access"
    attack-version: "v19"
    confidence: confirmed
    evidence: "Grafana Labs said a missed GitHub workflow token led to attacker access to company GitHub repositories after broader token rotation."
  - techniqueId: "T1213"
    techniqueName: "Data from Information Repositories"
    tactic: "Collection"
    attack-version: "v19"
    confidence: confirmed
    evidence: "Grafana Labs confirmed that attackers accessed GitHub repositories and downloaded its codebase, including public and private source code and internal repository content."
---

## Summary

On May 16, 2026, Grafana Labs confirmed that a cybercrime group had gained unauthorized access to its GitHub repositories and downloaded the company's codebase. Grafana later explained that the breach originated from the May 2026 TanStack npm supply-chain attack, in which malicious packages created credential-exfiltration risk for developer and CI/CD environments. Grafana detected malicious activity on May 11, rotated many GitHub workflow tokens, but later found that one specific workflow token had been missed and could be used to access repositories.

The attacker issued an extortion demand on May 16, threatening disclosure of the downloaded codebase. Grafana declined to pay, citing FBI guidance that ransom payment does not guarantee data return or non-disclosure and can incentivize further criminal activity. As of Grafana's June 1 update, the company said its internal investigation had found no unauthorized access to customer production systems, customer operations, or the Grafana Cloud platform. Grafana also stated that the downloaded codebase was not altered and that no action was required from Grafana Cloud customers or users of its open source projects.

## Technical Analysis

Grafana Labs tied the incident to the broader TanStack npm supply-chain compromise. The TanStack incident involved malicious npm packages and credential-focused theft from affected environments. In Grafana's case, the company said it detected malicious activity on May 11 and immediately began incident response. The initial response included analysis and rapid rotation of many GitHub workflow tokens.

Grafana later determined that one GitHub workflow originally assessed as unaffected had actually been compromised. A token associated with that workflow was not rotated during the initial response, and the attacker used it to gain access to Grafana Labs GitHub repositories. The public record does not identify the precise repository, workflow name, token scope, or credentials used beyond Grafana's description of a missed GitHub workflow token.

The accessed GitHub environment contained public and private source code and internal repositories used by Grafana teams. Grafana said the downloaded internal repository content included operational information and business details, including professional-context business contact names and email addresses. The company distinguished those details from customer data processed through production systems or Grafana Cloud.

## Attack Chain

The first stage was exposure through the TanStack npm supply-chain attack. Grafana said the incident originated from that attack through the Mini Shai-Hulud campaign. Public TanStack reporting separately documented malicious package publication and credential-stealing behavior in the affected ecosystem.

The second stage was token compromise or token exposure in Grafana's GitHub environment. Grafana rotated many workflow tokens after detecting malicious activity, but a later review found that one workflow token remained exposed because the related workflow had been incorrectly assessed as not impacted.

The third stage was repository access. Using the missed token, the attacker accessed Grafana Labs GitHub repositories and downloaded the codebase. Grafana said the code was downloaded but not altered. Public reporting by TechCrunch and SecurityWeek described the access as a compromised token allowing entry into Grafana's GitHub environment rather than access to customer production systems.

The fourth stage was extortion. Grafana received a ransom demand on May 16 under threat of codebase disclosure. The company did not pay and reported the matter to federal law enforcement. Grafana then continued repository review, token rotation, commit auditing, enhanced monitoring, and GitHub hardening.

## Impact Assessment

The confirmed impact was unauthorized access to Grafana Labs GitHub repositories and codebase download. Grafana said the accessed repositories included public and private source code, internal operational information, and some business contact names and email addresses. The company said this information was exchanged in ordinary professional relationship contexts and was not pulled from Grafana Cloud or production systems.

Grafana repeatedly stated that it had no evidence of unauthorized access to customer production systems, customer operations, the Grafana Cloud platform, customer records, or financial data. It also stated that the codebase was not altered. Those statements materially limit the known impact, but the download of private code and internal repository data remains a meaningful confidentiality incident because repository content can contain implementation details, business process context, or security-relevant development metadata.

SecurityWeek reported that Grafana appeared on a Coinbase Cartel leak site on May 15 and that no data appeared to have been leaked at the time of its report. That reporting also described Coinbase Cartel as a data-theft extortion group rather than file-encrypting ransomware. Grafana's own statements did not name the group responsible for the incident.

## Attribution

Grafana Labs attributed the incident origin to the TanStack npm supply-chain attack via the Mini Shai-Hulud campaign, but it did not publicly name the actor that accessed Grafana's repositories and issued the ransom demand. SecurityWeek reported that Grafana appeared to have been targeted by Coinbase Cartel and described claimed links between that extortion brand and ShinyHunters, Scattered Spider, and Lapsus$.

Because the primary victim statement did not confirm an actor name, this draft records the threat actor as `Unknown`. The public evidence supports describing a cybercrime extortion operation and a TanStack/Mini Shai-Hulud supply-chain origin, but not a definitive named-actor attribution for the Grafana GitHub repository access.

## Timeline

### 2026-05-11 - Malicious activity detected

Grafana Labs detected malicious activity associated with the TanStack npm supply-chain attack and began incident response.

### 2026-05-11 - Initial token rotation and investigation

Grafana performed analysis and rotated a significant number of GitHub workflow tokens. A later review found that one specific workflow had been compromised despite initially being assessed as unaffected.

### 2026-05-15 - Leak-site listing reported

SecurityWeek reported that Grafana appeared on the Coinbase Cartel leak site on May 15, before Grafana's public confirmation.

### 2026-05-16 - Grafana confirms attack and receives ransom demand

Grafana confirmed a targeted attack, said its GitHub repositories had been accessed and its codebase downloaded, and received a ransom demand under threat of disclosure.

### 2026-05-18 - Media reports breach and refusal to pay

TechCrunch and SecurityWeek reported that Grafana had confirmed the GitHub environment breach and refused to pay the ransom.

### 2026-05-19 - Grafana publishes incident update

Grafana published a detailed update tying the incident to the TanStack npm supply-chain attack, describing repository access, token rotation, and mitigation work.

### 2026-06-01 - Internal investigation update

Grafana updated its notice to say its internal investigation was complete and confirmed no unauthorized access to customer production systems or the Grafana Cloud platform. The company also said it had engaged Mandiant for an additional audit.

## Remediation & Mitigation

Grafana's response included rotating automation tokens, adding enhanced monitoring, auditing commits since the May 11 incident, hardening GitHub security, notifying federal law enforcement, and continuing post-incident review. The company said it was implementing additional measures to secure CI/CD pipelines and prevent recurrence.

For organizations exposed to similar supply-chain credential theft, the key defensive actions are to assume developer and CI/CD credentials may be in scope, rotate tokens broadly, review workflows initially assessed as unaffected, audit recent commits and repository access logs, and tighten token scopes. Repository access should be treated as a sensitive incident even when production systems are not accessed, because private code and internal operational repositories can contain useful information for follow-on attacks.

The FBI recommends reporting ransomware and extortion incidents through IC3 or a local FBI field office and states that it does not support paying ransom, because payment does not guarantee recovery or non-disclosure and can encourage additional targeting. Grafana's refusal to pay was consistent with that guidance.

## Sources & References

- [Grafana Labs: Grafana Labs security update: Latest on TanStack npm supply chain ransomware incident](https://grafana.com/blog/grafana-labs-security-update-latest-on-tanstack-npm-supply-chain-ransomware-incident/) — Grafana Labs, 2026-05-19
- [TechCrunch: Open source tool maker Grafana Labs says hackers stole its code, refuses to pay ransom](https://techcrunch.com/2026/05/18/open-source-tool-maker-grafana-labs-says-hackers-stole-its-code-refuses-to-pay-ransom/) — TechCrunch, 2026-05-18
- [SecurityWeek: Grafana Confirms Breach After Hackers Claim They Stole Data](https://www.securityweek.com/grafana-confirms-breach-after-hackers-claim-they-stole-data/) — SecurityWeek, 2026-05-18
- [FBI: Ransomware](https://www.fbi.gov/how-we-can-help-you/scams-and-safety/common-frauds-and-scams/ransomware) — FBI, 2026-06-05
