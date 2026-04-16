---
name: "APT1"
aliases:
  - "Comment Crew"
  - "Comment Group"
  - "Comment Panda"
  - "PLA Unit 61398"
  - "Byzantine Candor"
affiliation: "China"
motivation: "Espionage"
status: inactive
country: "China"
firstSeen: "2006"
lastSeen: "2013"
targetSectors:
  - "Information Technology"
  - "Aerospace"
  - "Defense"
  - "Government"
  - "Energy"
  - "Financial"
targetGeographies:
  - "Global"
  - "United States"
  - "United Kingdom"
  - "Canada"
tools:
  - "Hydraq"
  - "Trojan.Aurora"
  - "GETMAIL"
  - "MAPLE"
  - "REASON"
mitreMappings:
  - techniqueId: "T1189"
    techniqueName: "Drive-by Compromise"
    tactic: "Initial Access"
    notes: "Utilized extensively in Operation Aurora using the IE zero-day CVE-2010-0249."
  - techniqueId: "T1059.003"
    techniqueName: "Command and Scripting Interpreter: Windows Command Shell"
    tactic: "Execution"
    notes: "Standard usage of the Windows command shell for initial stage execution and reconnaissance."
  - techniqueId: "T1005"
    techniqueName: "Data from Local System"
    tactic: "Collection"
    notes: "Primary objective was exfiltration of source code and proprietary intellectual property from compromised hosts."
attributionConfidence: A1
attributionRationale: "Formally attributed to PLA Unit 61398 by the U.S. Department of Justice (2014) and documented in the landmark Mandiant APT1 report (2013)."
reviewStatus: "draft_ai"
generatedBy: "penfold-bot"
generatedDate: 2026-04-16
tags:
  - "apt1"
  - "china"
  - "pla"
  - "espionage"
  - "comment-crew"
sources:
  - url: "https://www.mandiant.com/resources/reports/apt1-exposing-one-chinas-cyber-espionage-units"
    publisher: "Mandiant"
    publisherType: vendor
    reliability: R1
    publicationDate: "2013-02-18"
    accessDate: "2026-04-16"
    archived: false
  - url: "https://www.justice.gov/opa/pr/us-charges-five-chinese-military-hackers-cyber-espionage-against-us-corporations-and-labor"
    publisher: "US Department of Justice"
    publisherType: government
    reliability: R1
    publicationDate: "2014-05-19"
    accessDate: "2026-04-16"
    archived: false
  - url: "https://attack.mitre.org/groups/G0006/"
    publisher: "MITRE ATT&CK"
    publisherType: community
    reliability: R1
    publicationDate: "2023-10-21"
    accessDate: "2026-04-16"
    archived: false
  - url: "https://www.cisa.gov/news-events/alerts/2010/01/14/google-china-cyber-attack"
    publisher: "CISA"
    publisherType: government
    reliability: R1
    publicationDate: "2010-01-14"
    accessDate: "2026-04-16"
    archived: false
---

## Executive Summary

APT1 is one of the most historically significant nation-state threat actors, identified as **Unit 61398 of the Chinese People's Liberation Army (PLA)**. Operating out of a high-rise building in Shanghai, the group conducted a massive, sustained cyber-espionage campaign between at least 2006 and 2013, targeting over 140 organizations globally. The group's activities were brought to professional and public light by the landmark **Mandiant APT1 Report** in 2013, which provided unprecedented evidence of state-sponsored hacking.

The group's name, "Comment Crew," was derived from their practice of embedding malicious code in the comment sections of legitimate HTML pages to bypass security filters. APT1 focused heavily on the theft of intellectual property, proprietary technical data, and strategic corporate information from sectors critical to China's economic and military development, particularly in the United States.

## Notable Campaigns

### Operation Aurora (2009-2010)
APT1 gained worldwide notoriety for its role in Operation Aurora, a coordinated attack against Google, Adobe, and dozens of other Fortune 100 companies. The campaign utilized a zero-day exploit in Internet Explorer (CVE-2010-0249) to steal source code and access the communications of human rights activists.

### Multi-Sector Industrial Espionage
Between 2006 and 2013, APT1 compromised 141 companies across 20 major industrial categories. Notable victims included large-scale engineering firms, energy grid operators, and aerospace manufacturers. The group was known to maintain access to victim networks for an average of 356 days, with the longest known intrusion lasting nearly five years.

## Technical Capabilities

APT1 utilized a modular and highly automated toolkit. Their primary malware was a series of custom backdoors dubbed the **"APT1 Malware Suite,"** including **Hydraq** (Trojan.Aurora), **GETMAIL**, and **MAPLE**. These tools were designed to blend into legitimate network traffic using common protocols like HTTP and HTTPS.

Once initial access was achieved through spear-phishing or drive-by downloads, the group used a wide array of utilities for lateral movement and data exfiltration. They frequently utilized the **Windows command shell** for reconnaissance and Batch scripts to automate the collection of specific file types. APT1's infrastructure was vast, utilizing over 900 C2 domains and thousands of IP addresses, with a significant portion of the traffic originating from the Pudong district in Shanghai.

## Attribution

The attribution of APT1 to the Chinese military is among the most well-documented in cybersecurity history. In 2013, Mandiant published a technical dossier that precisely localized the source of APT1's activity to a specific PLA building in Shanghai. The report included screenshots of the attackers' desktops and identified specific social media accounts used by individual operators.

Following the report, the **U.S. Department of Justice** issued a formal indictment in May 2014 against five officers of PLA Unit 61398—Wang Dong, Sun Kailiang, Wen Xinyu, Huang Zhenyu, and Gu Chunhui. The charges included computer hacking, economic espionage, and trade secret theft against U.S. companies. While the group became largely inactive following the indictment and public exposure, they set the precedent for how modern APT groups are investigated and attributed.

## MITRE ATT&CK Profile

APT1's operations are characterized by a disciplined, "nine-to-five" work schedule that aided in their attribution. Their primary techniques involve:

- **T1189 (Drive-by Compromise):** Frequent use of malicious URLs in spear-phishing emails to deliver browser-based zero-day exploits.
- **T1566.001 (Spear-phishing Attachment):** Utilizing malicious RAR archives and PDF documents as entry points.
- **T1005 (Data from Local System):** Methodical search and collection of documents, source code, and strategic communications once administrative access is established.
- **T1071.001 (Web Protocols):** C2 communication masquerading as standard web traffic to common public domains.

## Sources & References

- [Mandiant: APT1 — Exposing One of China's Cyber Espionage Units (Full Report)](https://www.mandiant.com/resources/reports/apt1-exposing-one-chinas-cyber-espionage-units) — Mandiant, 2013-02-18
- [US DOJ: U.S. Charges Five Chinese Military Hackers for Cyber Espionage Against U.S. Corporations](https://www.justice.gov/opa/pr/us-charges-five-chinese-military-hackers-cyber-espionage-against-us-corporations-and-labor) — US Department of Justice, 2014-05-19
- [MITRE ATT&CK: APT1 (Group G0006)](https://attack.mitre.org/groups/G0006/) — MITRE ATT&CK, 2023-10-21
- [CISA: Alert (TA10-014A) — Google and Microsoft Internet Explorer Hub](https://www.cisa.gov/news-events/alerts/2010/01/14/google-china-cyber-attack) — CISA, 2010-01-14
