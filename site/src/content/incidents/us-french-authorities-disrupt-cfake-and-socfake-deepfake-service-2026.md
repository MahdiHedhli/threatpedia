---
eventId: TP-2026-0381
title: "U.S. and French Authorities Disrupt CFAKE and SOCFAKE Deepfake Service"
date: 2026-06-12
attackType: Law Enforcement Disruption
severity: high
sector: Online Abuse / Cybercrime Infrastructure
geography: United States / France
threatActor: Unknown
attributionConfidence: A4
reviewStatus: draft_ai
confidenceGrade: B
generatedBy: penfold-bot
generatedDate: 2026-06-18
generation:
  provider: xAI
  model: grok-build
  tool: grok
  agent: penfold-bot
  lane: ernest-penfold-grok-draft
  surface: grok-build
  promptProfile: ernest-penfold-grok-draft-article
cves: []
relatedSlugs: []
tags:
  - deepfake
  - nonconsensual-intimate-images
  - cfake
  - socfake
  - domain-seizure
  - take-it-down-act
  - law-enforcement-disruption
sources:
  - url: "https://www.justice.gov/opa/pr/united-states-seizes-domain-names-publishing-nude-digital-forgeries-famous-women"
    publisher: "U.S. Department of Justice"
    publisherType: government
    reliability: R1
    publicationDate: "2026-06-12"
    accessDate: "2026-06-18"
    archived: false
  - url: "https://www.justice.gov/usao-nj/media/1445611/dl?inline="
    publisher: "U.S. Attorney's Office for the District of New Jersey"
    publisherType: government
    reliability: R1
    publicationDate: "2026-06-12"
    accessDate: "2026-06-18"
    archived: false
  - url: "https://www.tribunal-de-paris.justice.fr/sites/default/files/2026-06/2026-06-12%20-%20CP%20Cfake%20plateforme%20de%20deepfakes.pdf"
    publisher: "Paris Prosecutor's Office"
    publisherType: government
    reliability: R1
    publicationDate: "2026-06-12"
    accessDate: "2026-06-18"
    archived: false
mitreMappings:
  - techniqueId: T1583.001
    techniqueName: Domains
    tactic: Resource Development
    attack-version: v19.0
    confidence: probable
    evidence: U.S. and French authorities said CFAKE.com and SOCFAKE.com were the public-facing domains for the service, and the DOJ seizure order targeted those domain names as the infrastructure used to publish the deepfake content.
atlasMappings: []
framework-mappings: []
---

## Summary

On June 12, 2026, the U.S. Department of Justice and Homeland Security seized the domains CFAKE.com and SOCFAKE.com, which were being used to publish non-consensual nude digital forgeries of women. The DOJ said the sites hosted thousands of forged images and videos and were being taken offline under the TAKE IT DOWN Act.

The Paris prosecutor's office separately reported that it had deferred a man suspected of administering the CFake site. French prosecutors said the platform had existed since 2007, had published more than 300,000 images and 7,000 videos, and had drawn roughly 4 million views per month from 200,000 user accounts. The communiqué said investigators identified the administrator as Cyrille B, arrested him on June 10, 2026, and seized his computer equipment and 34.7 ether.

This incident is best understood as a cyber-enabled abuse and platform-disruption case. The public record supports the seizure of the service's infrastructure and the arrest of an identified operator, but it does not establish a broader criminal group or campaign name.

## Technical Analysis

The official DOJ affidavit describes CFAKE as a pornographic website that published digital forgeries of identifiable individuals without their consent. The affidavit says the domains were used to reach the CFAKE site, which hosted thousands of deepfake images depicting female celebrities nude and in sex acts.

The same affidavit says the site was designed as an interactive computer service and that users could browse content by tags that included terms such as "rape," "forced," and "degradation." It also explains why seizure was necessary: the domain names could otherwise be re-registered or continue supporting the abusive service.

The Paris communiqué adds that the platform had been operating since 2007, publishing about 50 new items per day, and that the service generated roughly 4 million monthly views. Those figures make the case notable not only for the content abuse itself but also for the scale and durability of the underlying web infrastructure.

The DOJ press release frames the seizure as an application of the new TAKE IT DOWN Act. In practice, that makes the event a law-enforcement disruption of a cyber-enabled abuse platform rather than a malware intrusion or a traditional data breach.

## Attack Chain

### Stage 1: Domain-based platform is established

According to the DOJ affidavit, CFAKE.com was registered in 2007 and SOCFAKE.com was registered in 2025. Both domains resolved to the same service and acted as the public entry points for the platform.

### Stage 2: Non-consensual content is published at scale

The French prosecutor's office said the service hosted more than 300,000 images and 7,000 videos and added roughly 50 new uploads per day. The DOJ said the service was used to publish thousands of nude digital forgeries without consent.

### Stage 3: The service is monetized and operated through accounts

French prosecutors said the site had about 200,000 user accounts and generated around 4 million views per month. They also said the operator derived illicit revenue from advertising on the platform.

### Stage 4: Cross-border investigation and seizure

The DOJ said it transmitted information to Paris on May 5, 2026. French prosecutors later said the suspect was arrested on June 10. On June 12, U.S. authorities seized the domains while the Paris prosecutor's office moved forward with its own proceedings.

## Impact Assessment

The confirmed harm in the public record is large. French prosecutors said the service affected 14,000 victims from many countries, and the DOJ affidavit says the content was created without the depicted individuals' consent and with predictable psychological, financial, and reputational harm.

The scale of the platform also matters operationally. Hundreds of thousands of images, thousands of videos, and millions of monthly views indicate a mature abuse service rather than an isolated upload site. The seizure therefore removed a repeatable publishing channel, not just one piece of content.

The financial impact is visible in the French communiqué as well. Prosecutors said they seized 34.7 ether from the operator's residence, describing it as proceeds from the site's advertising revenue.

The incident also has broader policy significance because the DOJ explicitly tied the seizure to the TAKE IT DOWN Act. That makes the case a practical example of how the law can be used against non-consensual intimate imagery infrastructure, not just against individual posts.

## Attribution

The broader threat actor remains Unknown in the corpus. The public sources identify an administrator of the CFake platform, but they do not establish a named criminal group or a larger campaign structure.

The Paris prosecutor's office identified the suspect as Cyrille B and said he was an informatician based in Nice who had not previously been known to the justice system. That identification is enough to describe an operator of the platform, but not enough to convert the event into a group-attributed campaign.

## Timeline

### 2007-04-27 - CFAKE domain registered

The DOJ affidavit says CFAKE.com was registered on or about April 27, 2007.

### 2025-05-14 - SOCFAKE domain registered

The DOJ affidavit says SOCFAKE.com was registered on or about May 14, 2025.

### 2026-05-05 - DOJ sends information to Paris

The Paris prosecutor's office said the DOJ's CCIPS section sent spontaneous information to Paris on May 5, 2026.

### 2026-06-10 - Suspect arrested in Nice

French prosecutors said the identified administrator was arrested in Nice on June 10, 2026.

### 2026-06-12 - Domains seized and case publicly announced

U.S. authorities seized the domains CFAKE.com and SOCFAKE.com, and the Paris prosecutor's office announced its own action against the suspected administrator.

## Remediation & Mitigation

Platform operators should treat non-consensual intimate imagery as an abuse and legal-risk issue, not just a moderation problem. High-volume abuse services need fast takedown paths, domain-level escalation channels, and preservation of server and account records for law-enforcement requests.

Investigators and trust-and-safety teams should preserve evidence on domain registrations, revenue flows, administrator accounts, and hosting relationships as soon as an abuse service is identified. The DOJ affidavit shows why domain seizure matters: the same service can otherwise be re-registered and brought back online.

Victim-support teams should prioritize rapid removal, documentation, and reporting workflows that align with emerging legal authorities such as the TAKE IT DOWN Act. The public record for this case shows that legal seizure and victim harm reduction can move together when the abusive service is still active.

## Sources & References

- [U.S. Department of Justice: United States Seizes Domain Names Publishing Nude Digital Forgeries of Famous Women](https://www.justice.gov/opa/pr/united-states-seizes-domain-names-publishing-nude-digital-forgeries-famous-women) — U.S. Department of Justice, 2026-06-12
- [U.S. Attorney's Office for the District of New Jersey: Seizure affidavit and warrant packet](https://www.justice.gov/usao-nj/media/1445611/dl?inline=) — U.S. Attorney's Office for the District of New Jersey, 2026-06-12
- [Paris Prosecutor's Office: CFake platform communiqué](https://www.tribunal-de-paris.justice.fr/sites/default/files/2026-06/2026-06-12%20-%20CP%20Cfake%20plateforme%20de%20deepfakes.pdf) — Paris Prosecutor's Office, 2026-06-12
