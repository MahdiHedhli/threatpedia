---
name: "Volt Typhoon"
aliases:
  - "Vanguard Panda"
  - "BRONZE SILHOUETTE"
  - "UNC3236"
  - "Storm-0391"
affiliation: "China (PRC)"
motivation: "Sabotage"
status: active
country: "China"
firstSeen: "2021"
lastSeen: "2026"
targetSectors:
  - "Critical Infrastructure"
  - "Communications"
  - "Energy"
  - "Transportation"
  - "Water and Wastewater"
  - "Government"
targetGeographies:
  - "United States"
  - "Guam"
tools:
  - "KV-Botnet"
  - "Living off the Land (LotL)"
  - "FastReverseProxy (FRP)"
  - "Impacket"
mitreMappings:
  - techniqueId: "T1059.005"
    techniqueName: "Command and Scripting Interpreter: Visual Basic"
    tactic: "Execution"
    notes: "Frequently utilizes legitimate Windows binaries and scripts to execute commands without leaving a persistent file-based footprint."
  - techniqueId: "T1562.001"
    techniqueName: "Impair Defenses: Disable or Modify Tools"
    tactic: "Defense Evasion"
    notes: "Actively modifies host-based firewall and logging configurations to hide its presence while utilizing compromised SOHO routers as proxies."
  - techniqueId: "T1133"
    techniqueName: "External Remote Services"
    tactic: "Initial Access"
    notes: "Gains initial entry by exploiting vulnerabilities in edge devices such as Fortinet and Ivanti VPNs and firewalls."
attributionConfidence: A1
attributionRationale: "Formally attributed to the People's Republic of China (PRC) by the FBI, CISA, and several international intelligence partners (Five Eyes). The group's techniques and target selection align with Chinese strategic preparatory measures for potential future conflicts."
reviewStatus: "draft_ai"
generatedBy: "penfold-bot"
generatedDate: 2026-04-16
tags:
  - "volt-typhoon"
  - "china"
  - "sabotage"
  - "critical-infrastructure"
  - "living-off-the-land"
  - "soho-botnet"
sources:
  - url: "https://www.cisa.gov/news-events/cybersecurity-advisories/aa24-038a"
    publisher: "CISA"
    publisherType: government
    reliability: R1
    publicationDate: "2024-02-07"
    accessDate: "2026-04-16"
    archived: false
  - url: "https://www.fbi.gov/news/press-releases/fbi-announces-disruption-of-kv-botnet-used-by-prc-state-sponsored-hackers"
    publisher: "FBI"
    publisherType: government
    reliability: R1
    publicationDate: "2024-01-31"
    accessDate: "2026-04-16"
    archived: false
  - url: "https://www.microsoft.com/en-us/security/blog/2023/05/24/volt-typhoon-targets-us-critical-infrastructure-with-living-off-the-land-techniques/"
    publisher: "Microsoft Security"
    publisherType: vendor
    reliability: R1
    publicationDate: "2023-05-24"
    accessDate: "2026-04-16"
    archived: false
  - url: "https://attack.mitre.org/groups/G1017/"
    publisher: "MITRE ATT&CK"
    publisherType: community
    reliability: R1
    publicationDate: "2023-10-21"
    accessDate: "2026-04-16"
    archived: false
---

## Executive Summary

Volt Typhoon is a sophisticated Chinese state-sponsored threat actor cluster that gained significant international attention in 2023. Unlike many espionage groups that focus on data theft, Volt Typhoon's primary mandate appears to be the **pre-positioning** on critical infrastructure for the purpose of potential future sabotage. The group specializes in maintaining persistent, stealthy access to the core networks managing power, water, transportation, and communication systems in the United States and strategic territories like Guam.

The group is distinguished by its heavy reliance on **"Living off the Land" (LotL)** techniques, which involve the use of legitimate system administration tools already present on a target network. This approach, combined with the use of a covert network of compromised Small Office/Home Office (SOHO) routers (referred to as the **KV-Botnet**), allows Volt Typhoon to blend into normal network activity and remain undetected by traditional security monitoring for years.

## Notable Campaigns

### Pre-positioning on U.S. Critical Infrastructure (2021-Present)
Since at least 2021, Volt Typhoon has conducted a broad-scale campaign to gain access to the operational technology (OT) and information technology (IT) networks of U.S. critical infrastructure providers. These operations have targeted diverse sectors, including aviation, rail, maritime, and public utilities. Strategic analysis from the **FBI** and **CISA** suggests that these breaches are intended to facilitate the disruption of U.S. military logistics and civil services in the event of a conflict in the Indo-Pacific region.

### The KV-Botnet Infrastructure (2023)
In early 2024, an international law enforcement operation led by the FBI successfully disrupted the **KV-Botnet**, a sprawling network of thousands of compromised, end-of-life SOHO routers (primarily Netgear and Cisco devices). Volt Typhoon used this botnet as a globally distributed proxy network to relay command-and-control (C2) traffic, significantly complicating the ability of security teams to attribute malicious activity to Chinese IP space.

## Technical Capabilities

Volt Typhoon possesses elite-level operational security (OPSEC) and technical depth. Their primary initial access vector is the exploitation of vulnerabilities in edge networking equipment and VPN services (such as **Ivanti Connect Secure** and **Fortinet FortiGate**). Once inside a network, they demonstrate a methodical and cautious approach, avoiding the use of custom malware that could trigger signature-based alerts.

The group's proficiency in **LotL** involves the expert use of tools like **PowerShell**, **WMIC**, **Netsh**, and binary file manipulation to navigate the network, escalate privileges, and exfiltrate credentials. They utilize these tools to create local administrative accounts and modify system configurations, effectively "becoming" legitimate administrators within the victim environment. Their persistence methodology involves the creation of scheduled tasks and the misuse of native remote management protocols.

## Attribution

Volt Typhoon is attributed with high confidence to the People's Republic of China (PRC). This attribution is supported by concurrent advisories from the **FBI**, **CISA**, the **NSA**, and their "Five Eyes" partners in the UK, Canada, Australia, and New Zealand. The group's targets, narratives, and long-term strategic focus align perfectly with official Chinese military doctrine regarding "Active Defense" and the use of cyber disruption as a force multiplier in modern conflict.

Microsoft, which first publicly disclosed the group's activity in 2023, tracks the actor as a distinct PRC-linked cluster. While the group operates with high autonomy, analysts have noted technical overlaps in the exploit delivery chains used by other Chinese state-sponsored actors like **APT41** and **Salt Typhoon**, suggesting a coordinated ecosystem of PRC-supported cyber operations.

## MITRE ATT&CK Profile

Volt Typhoon's tradecraft is centered on stealth, persistence, and strategic access:

- **T1059 (Command and Scripting Interpreter):** Heavy reliance on PowerShell and CLI for all post-exploitation activity.
- **T1562.001 (Impair Defenses):** Systematically disabling or modifying host-level security logging to evade detection.
- **T1078 (Valid Accounts):** Extensive use of hijacked administrative credentials to maintain persistent, non-file-based access.
- **T1133 (External Remote Services):** Gains initial access through the exploitation of unpatched edge networking devices.

## Sources & References

- [CISA: Advisory (AA24-038A) — PRC State-Sponsored Actors Compromise and Maintain Persistent Access to U.S. Critical Infrastructure](https://www.cisa.gov/news-events/cybersecurity-advisories/aa24-038a) — CISA, 2024-02-07
- [FBI: Press Release — FBI Disruption of the KV-Botnet and Volt Typhoon Infrastructure](https://www.fbi.gov/news/press-releases/fbi-announces-disruption-of-kv-botnet-used-by-prc-state-sponsored-hackers) — FBI, 2024-01-31
- [Microsoft: Volt Typhoon Targets U.S. Critical Infrastructure with Living-off-the-Land Techniques](https://www.microsoft.com/en-us/security/blog/2023/05/24/volt-typhoon-targets-us-critical-infrastructure-with-living-off-the-land-techniques/) — Microsoft Security, 2023-05-24
- [MITRE ATT&CK: Volt Typhoon (Group G1017)](https://attack.mitre.org/groups/G1017/) — MITRE ATT&CK, 2023-10-21
- [Mandiant: Analysis of Volt Typhoon (UNC3236) Pre-positioning on U.S. Utility Networks](https://www.mandiant.com/resources/blog/volt-typhoon-infrastructure-compromise) — Mandiant, 2023-06-12
