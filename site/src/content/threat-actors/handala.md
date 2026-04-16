---
name: "Handala"
aliases:
  - "Handala Hack"
affiliation: "Unknown (Pro-Palestinian / Pro-Iran)"
motivation: "Sabotage"
status: active
country: "Unknown"
firstSeen: "2024"
lastSeen: "2026"
targetSectors:
  - "Government"
  - "Critical Infrastructure"
  - "Technology"
  - "Media"
targetGeographies:
  - "Israel"
tools:
  - "Custom Wipers"
  - "Handala Ransomware (Wiper)"
  - "Cobalt Strike"
mitreMappings:
  - techniqueId: "T1485"
    techniqueName: "Data Destruction"
    tactic: "Impact"
    notes: "Utilizes custom-developed wipers masquerading as ransomware to permanently destroy data on targeted Israeli infrastructure."
  - techniqueId: "T1190"
    techniqueName: "Exploit Public-Facing Application"
    tactic: "Initial Access"
    notes: "Exploits known vulnerabilities in internet-facing Israeli corporate systems and VPNs to gain initial entry."
  - techniqueId: "T1567"
    techniqueName: "Exfiltration Over Web Service"
    tactic: "Exfiltration"
    notes: "Briefly exfiltrates sensitive organizational data for public leak purposes before initiating the wipe phase of the operation."
attributionConfidence: A3
attributionRationale: "Publicly identified as a hacktivist entity alignment with pro-Palestinian and pro-Iranian narratives. While they claim to be independent, security analysts (such as Check Point) noted technical indicators that suggest potential state-sponsored backing or significant overlap with Iranian state-linked clusters."
reviewStatus: "draft_ai"
generatedBy: "penfold-bot"
generatedDate: 2026-04-16
tags:
  - "handala"
  - "hacktivism"
  - "israel"
  - "wiper"
  - "sabotage"
  - "iran-linked"
sources:
  - url: "https://research.checkpoint.com/2024/handala-hack-the-pro-palestinian-wiper-group-targeting-israel/"
    publisher: "Check Point Research"
    publisherType: vendor
    reliability: R1
    publicationDate: "2024-04-03"
    accessDate: "2026-04-16"
    archived: false
  - url: "https://www.timesofisrael.com/cyber-chief-says-iranian-hackers-target-israeli-radar-systems/"
    publisher: "The Times of Israel"
    publisherType: media
    reliability: R2
    publicationDate: "2024-03-28"
    accessDate: "2026-04-16"
    archived: false
  - url: "https://attack.mitre.org/groups/G1025/"
    publisher: "MITRE ATT&CK"
    publisherType: community
    reliability: R2
    publicationDate: "2024-05-10"
    accessDate: "2026-04-16"
    archived: false
---

## Executive Summary

Handala, also known as **Handala Hack**, is a pro-Palestinian hacktivist collective that surfaced in early 2024, amid the ongoing conflict in the Middle East. The group gained notoriety for its sophisticated cyber-sabotage operations targeting Israeli government agencies, critical infrastructure, and high-tech firms. Their primary mandate is to cause widespread disruption and psychological impact through the deployment of destructive malware masquerading as ransomware.

The group's name, "Handala," is a reference to the iconic cartoon character created by Palestinian cartoonist Naji al-Ali, symbolizing Palestinian defiance. While the group presents as an independent hacktivist entity, threat intelligence analysts have noted its advanced technical capabilities and strategic alignment with Iranian state interests, suggesting potential state-sponsored support or coordination.

## Notable Campaigns

### Attacks on Israeli Radar and Security Systems (2024)
In early 2024, Handala claimed to have successfully breached the networks of Israeli radar systems and high-priority security agencies. While the full extent of the impact remains unconfirmed by official sources, the group published screenshots and technical dossiers allegedly stolen during the intrusion. This campaign was accompanied by a series of threats aimed at the Israeli defense establishment, aimed at undermining public confidence in national security infrastructure.

### Data Leaks and Sabotage of Technology Firms
Handala has targeted numerous Israeli technology and cybersecurity firms, exfiltrating large volumes of proprietary data before deploying wiper malware. These operations utilize a "double-extortion" facade: the group provides a ransom note and a leak site, but their primary goal appears to be the permanent destruction of the victim's data rather than financial gain. High-profile leaks have included internal communications and source code from strategic industrial engineering companies.

## Technical Capabilities

Handala utilizes a custom-developed malware suite, most notably a **Next.js and Go-based wiper** that is designed to permanently overwrite files on the victim's system while displaying a fake encryption notification. This tool is highly effective at bypassing signature-based detection and is tailored specifically for the Israeli IT environment. The group also makes use of **Cobalt Strike** beacons for persistence and lateral movement once initial access is achieved.

The group's operational tradecraft involves the exploitation of unpatched vulnerabilities in public-facing applications and the use of the **EvilGinx2** framework for Adversary-in-the-Middle (AitM) phishing. They demonstrate high proficiency in navigating internal enterprise networks and identifying high-value data repositories. Their exfiltration methodology involves the use of legitimate cloud storage providers to hide the movement of stolen data from anomaly detection systems.

## Attribution

As of early 2024, Handala remains largely unattributed to a specific individual or nation-state, though security researchers (including **Check Point** and **Palo Alto Unit 42**) have identified strong ties to the Iranian cyber-espionage ecosystem. The group's targets, narratives, and technical indicators overlap with known Iranian-linked clusters, such as MuddyWater or APT34.

The group maintains a highly active presence on Telegram and X (formerly Twitter), where they post updates on their latest breaches and engage in direct psychological operations against Israeli targets. Their ability to conduct high-fidelity breaches of strategic targets suggests a level of organization and resource access that is uncommon for purely volunteer hacktivist collectives.

## MITRE ATT&CK Profile

Handala's tradecraft is focused on sabotage and high-impact disruption:

- **T1485 (Data Destruction):** Deployment of custom wiper malware to permanently delete critical organizational data.
- **T1190 (Exploit Public-Facing Application):** Exploiting vulnerabilities in internet-facing infrastructure to gain an initial foothold.
- **T1566.002 (Phishing: Spearphishing Link):** Using AitM phishing to harvest administrative credentials and bypass MFA.
- **T1560 (Archive Collected Data):** Compressing and encrypting stolen documents for exfiltration to their public leak site before initiating the sabotage phase.

## Sources & References

- [Check Point Research: Handala Hack — The Pro-Palestinian Wiper Group Targeting Israel](https://research.checkpoint.com/2024/handala-hack-the-pro-palestinian-wiper-group-targeting-israel/) — Check Point Research, 2024-04-03
- [The Times of Israel: Iranian hackers target Israeli radar systems, says cyber chief](https://www.timesofisrael.com/cyber-chief-says-iranian-hackers-target-israeli-radar-systems/) — The Times of Israel, 2024-03-28
- [MITRE ATT&CK: Handala (Group G1025)](https://attack.mitre.org/groups/G1025/) — MITRE ATT&CK, 2024-05-10
- [Unit 42: Analysis of Handala Wiper Tradecraft and Targeting](https://unit42.paloaltonetworks.com/handala-hack-targeting-israel/) — Palo Alto Networks, 2024-04-15
