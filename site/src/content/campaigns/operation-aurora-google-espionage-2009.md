---
campaignId: "TP-CAMP-2009-0001"
title: "Operation Aurora — Google and Fortune 100 Cyber Espionage Campaign (2009-2010)"
startDate: 2009-06-01
endDate: 2010-01-12
ongoing: false
attackType: "Espionage"
severity: critical
sector: "Technology / Finance / Aerospace"
geography: "Global"
threatActor: "APT1"
attributionConfidence: A2
reviewStatus: "draft_ai"
confidenceGrade: A
generatedBy: "penfold-bot"
generatedDate: 2026-04-16
cves:
  - "CVE-2010-0249"
tags:
  - "operation-aurora"
  - "google"
  - "apt1"
  - "pla-unit-61398"
  - "ie-zero-day"
  - "espionage"
sources:
  - url: "https://googleblog.blogspot.com/2010/01/new-approach-to-china.html"
    publisher: "Google"
    publisherType: vendor
    reliability: R1
    publicationDate: "2010-01-12"
    accessDate: "2026-04-16"
    archived: false
  - url: "https://www.cisa.gov/news-events/alerts/2010/01/14/google-china-cyber-attack"
    publisher: "CISA"
    publisherType: government
    reliability: R1
    publicationDate: "2010-01-14"
    accessDate: "2026-04-16"
    archived: false
  - url: "https://www.wired.com/2010/03/source-code-stolen-in-google-attack-found-in-china/"
    publisher: "Wired"
    publisherType: media
    reliability: R1
    publicationDate: "2010-03-03"
    accessDate: "2026-04-16"
    archived: false
  - url: "https://www.mcafee.com/blogs/other-blogs/mcafee-labs/operation-aurora-technical-details-revealed/"
    publisher: "McAfee Labs"
    publisherType: vendor
    reliability: R1
    publicationDate: "2010-01-14"
    accessDate: "2026-04-16"
    archived: false
  - url: "https://www.mandiant.com/resources/reports/apt1-exposing-one-chinas-cyber-espionage-units"
    publisher: "Mandiant"
    publisherType: vendor
    reliability: R1
    publicationDate: "2013-02-18"
    accessDate: "2026-04-16"
    archived: false
mitreMappings:
  - techniqueId: "T1189"
    techniqueName: "Drive-by Compromise"
    tactic: "Initial Access"
    notes: "The campaign utilized a zero-day exploit in Internet Explorer (CVE-2010-0249) delivered via malicious links in spear-phishing emails."
  - techniqueId: "T1059.003"
    techniqueName: "Command and Scripting Interpreter: Windows Command Shell"
    tactic: "Execution"
    notes: "Attackers utilized the Windows shell to execute initial Stage 1 payloads and establish a persistent connection."
  - techniqueId: "T1005"
    techniqueName: "Data from Local System"
    tactic: "Collection"
    notes: "The primary objective was the theft of source code from high-value repositories including Google's Perforce system."
---

## Summary

Operation Aurora was a sophisticated cyber-espionage campaign identified in late 2009 that targeted Google and approximately 30 other Fortune 100 companies, including Adobe, Juniper Networks, and Rackspace. The campaign was characterized by the high-level coordination of its attacks and the specific objective of stealing proprietary source code and accessing the Gmail accounts of Chinese human rights activists.

Disclosed by Google in January 2010, the campaign led to a historic shift in the company's relationship with the Chinese government and its eventually partial withdrawal from the mainland Chinese market. Operation Aurora is widely regarded as a watershed moment in cybersecurity history, as it marked the first time a major multinational corporation publicly attributed a state-sponsored cyberattack and detailed the methodology used in the intrusion.

## Technical Analysis

The campaign relied on a zero-day vulnerability in **Microsoft Internet Explorer** (CVE-2010-0249), specifically a use-after-free vulnerability that allowed for remote code execution. Attackers delivered the exploit through spear-phishing emails containing links to compromised or attacker-controlled websites. Once a victim visited the malicious URL using a vulnerable version of Internet Explorer, the browser's memory was corrupted to execute a Stage 1 shellcode.

The Stage 1 payload established a persistent connection back to a command-and-control (C2) server and downloaded a Stage 2 implant, often a variant of the **Hydraq** (or Trojan.Aurora) malware. This modular backdoor provided the attackers with full administrative control over the compromised workstation, enabling them to move laterally through the internal corporate network, identify source code repositories (such as Perforce and SVN), and bypass internal access controls through stolen credentials.

## Attack Chain

### Stage 1: Spear Phishing and Initial Exploit
The attack began with highly targeted spear-phishing emails sent to specific employees (often developers or sysadmins) at the target organizations. These emails contained links to a website that hosted the IE zero-day exploit code.

### Stage 2: Browser Compromise
When the victim clicked the link, the IE zero-day (CVE-2010-0249) was triggered. The exploit utilized heap spraying techniques to ensure stable execution of shellcode in the browser's process space.

### Stage 3: Payload Deployment and Persistence
Upon successful exploitation, the Stage 1 shellcode downloaded the Hydraq backdoor. The malware typically disguised itself as a legitimate Windows service or DLL to maintain long-term persistence on the system.

### Stage 4: Reconnaissance and Lateral Movement
The attackers used the initial foothold to map the target's internal network. They specifically searched for Active Directory servers and source code management (SCM) systems, leveraging common network management tools to exfiltrate credentials.

### Stage 5: Data Exfiltration
For Google, the primary target was the **Perforce** source code repository and the accounts of specific Gmail users. The stolen data was encrypted and exfiltrated through the established C2 channels to servers located globally.

## Impact Assessment

The impact of Operation Aurora was profound, both technically and politically. Google confirmed that portions of its core intellectual property, including source code, were stolen. Other technology and defense firms reported similar losses, highlighting a systemic vulnerability in the corporate supply chain of the time.

Politically, the disclosure directly contributed to increased tensions between the U.S. and China over state-sponsored hacking. It also prompted a massive industry-wide shift toward the "Zero Trust" security model (later formalized as Google's BeyondCorp) and accelerated the industry's adoption of more robust encryption for data at rest and in transit.

## Attribution

Operation Aurora is attributed with moderate to high confidence to **APT1**, a group identified by security firms and government agencies as **PLA Unit 61398** of the Chinese People's Liberation Army. Mandiant's 2013 report provided extensive evidence linking the TTPs, infrastructure, and operational hours of the campaign to the Shanghai-based unit.

The specific malware used (Hydraq) and the infrastructure utilized were consistent with other APT1 operations conducted during the same period. While the Chinese government has repeatedly denied any involvement, the targets (energy, technology, and human rights activists) perfectly aligned with the strategic intelligence requirements of the Chinese state.

## Timeline

### 2009-06 — Campaign Initiation
Early stages of the campaign begin, with the first spear-phishing lures identified against aerospace and defense targets.

### 2009-12 — Intrusion Detection
Google detects the intrusion in its internal systems and identifies the specific targeting of Gmail accounts and source code repositories.

### 2010-01-12 — Public Disclosure
Google publishes a blog post titled "A new approach to China," disclosing the attack and announcing its decision to no longer censor search results in China.

### 2010-01-14 — CISA/Microsoft Response
CISA issues an alert regarding the IE zero-day, and Microsoft releases an emergency security advisory (979352) to address CVE-2010-0249.

### 2010-03-22 — Google Search Relocation
Google officially redirects its Chinese search service (`google.cn`) to its uncensored infrastructure in Hong Kong (`google.com.hk`).

## Sources & References

- [Google Blog: A new approach to China — Initial Disclosure (2010)](https://googleblog.blogspot.com/2010/01/new-approach-to-china.html) — Google, 2010-01-12
- [CISA: Alert (TA10-014A) — Google and Microsoft Internet Explorer Vulnerabilities](https://www.cisa.gov/news-events/alerts/2010/01/14/google-china-cyber-attack) — CISA, 2010-01-14
- [Wired: Source Code Stolen in Google Attack Found in China](https://www.wired.com/2010/03/source-code-stolen-in-google-attack-found-in-china/) — Wired, 2010-03-03
- [McAfee: Technical Analysis of the Operation Aurora Attacks](https://www.mcafee.com/blogs/other-blogs/mcafee-labs/operation-aurora-technical-details-revealed/) — McAfee Labs, 2010-01-14
- [Mandiant: APT1 — Exposing One of China's Cyber Espionage Units (2013)](https://www.mandiant.com/resources/reports/apt1-exposing-one-chinas-cyber-espionage-units) — Mandiant, 2013-02-18
