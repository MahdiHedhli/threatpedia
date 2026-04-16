---
name: "Wizard Spider"
aliases:
  - "UNC1878"
  - "GOLD SPHINX"
  - "GRIM SPIDER"
affiliation: "Unknown"
motivation: "Financial"
status: "active"
firstSeen: "2015"
lastSeen: "2026-03"
country: "Unknown"
targetSectors:
  - "Healthcare"
  - "Government"
  - "Financial"
  - "Manufacturing"
targetGeographies:
  - "Global"
tools:
  - "TrickBot"
  - "Ryuk"
  - "Conti"
  - "BazarLoader"
attributionConfidence: "A1"
attributionRationale: "High-fidelity attribution based on extensive tracking by CrowdStrike and US law enforcement, linking the group to the TrickBot malware botnet and the subsequent Ryuk/Conti ransomware ecosystems."
reviewStatus: "under_review"
generatedBy: "penfold-bot"
generatedDate: 2026-04-14
tags:
  - "financially-motivated"
  - "cybercrime"
  - "ransomware"
sources:
  - url: "https://attack.mitre.org/groups/G0102/"
    publisher: "MITRE ATT&CK"
    publisherType: "research"
    reliability: "R1"
    publicationDate: "2025-10-17"
    accessDate: "2026-04-14"
    archived: false
  - url: "https://www.cisa.gov/news-events/cybersecurity-advisories/aa22-137a"
    publisher: "CISA"
    publisherType: "government"
    reliability: "R1"
    publicationDate: "2022-05-17"
    accessDate: "2026-04-14"
    archived: false
  - url: "https://www.crowdstrike.com/blog/wizard-spider-adversary-update/"
    publisher: "CrowdStrike"
    publisherType: "vendor"
    reliability: "R1"
    publicationDate: "2021-03-31"
    accessDate: "2026-04-14"
    archived: false
---

## Executive Summary
Wizard Spider (also known as GOLD SPHINX and UNC1878) originated as the incredibly successful cybercrime group behind the **TrickBot** banking trojan. Active since at least 2015, the group evolved beyond wire fraud to become one of the most destructive and dominant forces in the ransomware-as-a-service (RaaS) market. Based primarily in Russia, Wizard Spider functioned as a sprawling corporate entity, employing developers, HR, and affiliates to run the highly lucrative **Conti** ransomware cartel until its implosion in 2022.

## Notable Campaigns
- **The TrickBot Botnet:** Operated the massive TrickBot botnet for years, infecting millions of devices globally, primarily used to steal financial credentials and, later, to sell initial access to other crime syndicates.
- **The Conti Ransomware Cartel:** Wizard Spider developers created and managed Conti, which dominated the ransomware landscape from 2020 to 2022. Conti notorious attacked high-profile targets, including the government of Costa Rica, crippling the nation's critical infrastructure.
- **BazarLoader Campaigns:** Deployed sophisticated BazarLoader campaigns to establish stealthy initial access into high-value enterprise targets specifically for follow-on ransomware operations.

## Technical Capabilities
Wizard Spider's early technical dominance stemmed from **TrickBot**, an extremely modular malware family capable of web injection, lateral movement, and credential theft. As they transitioned to purely extortion-based operations, they developed **BazarLoader** to evade detection while setting up **Cobalt Strike** infrastructure. They are highly adept at identifying high-value data repositories within enterprise networks, utilizing custom exfiltration tools before deploying tailored, fast-encrypting ransomware variants (like Ryuk and later Conti) structured specifically to bypass endpoint security products.

## Attribution
Wizard Spider is not directly affiliated with the Russian state apparatus, though they benefit from the tacit safe harbor provided by the Russian government to cybercriminals who abstain from targeting CIS nations. The group suffered a massive intelligence leak in early 2022 (the "Conti Leaks") when internal jabber communications were published online by a pro-Ukrainian researcher. These leaks revealed the internal corporate structure, operational playbook, and identities of key lieutenants within the Wizard Spider organization, leading to the dissolution of the Conti brand and the fracturing of the group into smaller successor syndicates.

## Sources & References
- CISA Alerts on TrickBot and Conti Ransomware
- Mandiant Threat Intelligence: UNC1878
- MITRE ATT&CK Group G0102
