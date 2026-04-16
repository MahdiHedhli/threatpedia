---
campaignId: "TP-CAMP-2009-0001"
title: "Operation Aurora — Google and Fortune 100 Cyber Espionage"
startDate: 2009-06-01
endDate: 2010-01-31
ongoing: false
attackType: "Espionage"
severity: critical
sector: "Technology"
geography: "Global"
threatActor: "APT17"
attributionConfidence: A2
reviewStatus: "draft_ai"
confidenceGrade: A
generatedBy: "penfold-bot"
generatedDate: 2026-04-15
cves:
  - "CVE-2010-0249"
relatedSlugs:
  - "apt17"
tags:
  - "operation-aurora"
  - "google"
  - "espionage"
  - "apt17"
  - "china"
  - "zero-day"
  - "cve-2010-0249"
  - "intellectual-property"
sources:
  - url: "https://googleblog.blogspot.com/2010/01/new-approach-to-china.html"
    publisher: "Google"
    publisherType: vendor
    reliability: R1
    publicationDate: "2010-01-12"
    accessDate: "2026-04-15"
    archived: false
  - url: "https://www.cisa.gov/news-events/bulletins/sb10-025"
    publisher: "CISA"
    publisherType: government
    reliability: R1
    publicationDate: "2010-01-25"
    accessDate: "2026-04-15"
    archived: false
  - url: "https://www.mcafee.com/blogs/other-blogs/mcafee-labs/operation-aurora-hit-google-others/"
    publisher: "McAfee"
    publisherType: vendor
    reliability: R1
    publicationDate: "2010-01-14"
    accessDate: "2026-04-15"
    archived: false
  - url: "https://attack.mitre.org/groups/G0025/"
    publisher: "MITRE ATT&CK"
    publisherType: research
    reliability: R1
    publicationDate: "2022-06-09"
    accessDate: "2026-04-15"
    archived: false
  - url: "https://www.wired.com/2010/01/google-adobe-hack/"
    publisher: "Wired"
    publisherType: media
    reliability: R1
    publicationDate: "2010-01-14"
    accessDate: "2026-04-15"
    archived: false
mitreMappings:
  - techniqueId: "T1190"
    techniqueName: "Exploit Public-Facing Application"
    tactic: "Initial Access"
    notes: "Attackers leveraged a zero-day vulnerability in Internet Explorer (CVE-2010-0249) to compromise targets."
  - techniqueId: "T1566.002"
    techniqueName: "Phishing: Spearphishing Link"
    tactic: "Initial Access"
    notes: "Compromise often began with a targeted spearphishing link sent to employees."
  - techniqueId: "T1005"
    techniqueName: "Data from Local System"
    tactic: "Collection"
    notes: "Primary objective was the theft of intellectual property and source code from high-technology firms."
---

## Summary

Operation Aurora was a highly coordinated and sophisticated cyber-espionage campaign identified in late 2009 that targeted Google and approximately 30 other major corporations, including Adobe Systems, Juniper Networks, Rackspace, and Northrop Grumman. The campaign was publicly disclosed by Google in a landmark January 2010 blog post, which detailed the theft of intellectual property and the observation of unauthorized access to the Gmail accounts of Chinese human rights activists.

The attack utilized a variety of advanced TTPs, including a then-unpatched zero-day vulnerability in Internet Explorer. The disclosure of Operation Aurora marked a pivotal moment in the history of cybersecurity, as it was one of the first times a major corporation publicly attributed a state-sponsored attack to China and fundamentally altered the relationship between the Western technology sector and the Chinese government.

## Technical Analysis

The technical core of Operation Aurora centered on the exploitation of **CVE-2010-0249**, an invalid pointer reference vulnerability in how Internet Explorer handled certain HTML objects. When a target user clicked a malicious link (delivered via spearphishing), the vulnerability allowed the attackers to achieve remote code execution (RCE) without user interaction on the machine beyond the initial click.

The campaign's tradecraft was exceptionally disciplined. The attackers established encrypted command-and-control (C2) channels that masqueraded as legitimate web traffic. Once inside a network, they moved laterally with extreme speed, often gaining access to internal source code management (SCM) systems like Perforce within days of the initial infection. Their primary goal appeared to be the theft of source code—specifically for core search algorithms and proprietary security software—and the monitoring of specific activist communications.

## Attack Chain

### Stage 1: Reconnaissance and Spearphishing
Attackers identified specific high-value employees at target firms and sent them personalized messages containing links to a compromised or malicious website hosting the Internet Explorer exploit.

### Stage 2: Zero-Day Exploitation
The victim's browser executed the malicious code in the background, exploiting CVE-2010-0249 to install a backdoor on the system with the privileges of the logged-in user.

### Stage 3: Lateral Movement
Using the initial foothold, the attackers deployed additional credential-harvesting tools and moved across the internal network, targeting administrative servers and source code repositories.

### Stage 4: Intellectual Property Exfiltration
Identified source code and internal company data were compressed, encrypted, and exfiltrated to offshore C2 servers controlled by the threat actor.

## Impact Assessment

The impact of Operation Aurora was profound, both technically and geopolitically. Technically, many corporations realized that their internal "protected" networks were highly vulnerable to sophisticated persistent threats. This led to the wide-scale adoption of "Zero Trust" architectures and the professionalization of internal security operations centers (SOCs).

Geopolitically, the attack caused Google to partially withdraw from the Chinese market and stop censoring search results on `Google.cn`, which ultimately led to the closure of their mainland search engine. The campaign highlighted the risk of supply chain and intellectual property theft as a primary instrument of national strategy.

## Attribution

Operation Aurora is attributed with high confidence to a China-linked threat actor, consistently identified as **APT17** (also known as Elderwood, Hidden Lynx, or Deputy Dog). This attribution is based on technical indicators including code overlaps with previous Chinese espionage campaigns, the strategic alignment of the targets, and the infrastructure utilized for C2.

The U.S. government and several private security firms have formally linked the campaign to the General Staff of the People's Liberation Army (PLA) and regional technology firms acting as contractors for the Chinese government.

## Timeline

### 2009-06 — Campaign Commences
Initial reconnaissance and spearphishing activities are observed targeting the first wave of corporate victims.

### 2009-12-15 — Google Discovery
Google security teams identify the compromise within their corporate infrastructure and beginning a massive internal investigation.

### 2010-01-12 — Public Disclosure
Google publishes "A new approach to China," disclosing the attack and threatening to exit the Chinese market.

### 2010-01-21 — U.S. Formal Response
Secretary of State Hillary Clinton delivers a major speech on internet freedom, specifically referencing the Aurora attacks and calling for an investigation by Chinese authorities.

## Sources & References

- [Google: A new approach to China](https://googleblog.blogspot.com/2010/01/new-approach-to-china.html) — Google, 2010-01-12
- [CISA: Cyber Security Bulletin SB10-025](https://www.cisa.gov/news-events/bulletins/sb10-025) — CISA, 2010-01-25
- [McAfee: Operation Aurora Hit Google and Others](https://www.mcafee.com/blogs/other-blogs/mcafee-labs/operation-aurora-hit-google-others/) — McAfee, 2010-01-14
- [MITRE ATT&CK: Operation Aurora Campaign (C0003)](https://attack.mitre.org/campaigns/C0003/) — MITRE ATT&CK
- [Wired: Google Hackers Also Hit Adobe, Rackspace and Many Others](https://www.wired.com/2010/01/operation-aurora/) — Wired, 2010
