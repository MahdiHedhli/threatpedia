---
name: "DarkHotel"
aliases:
  - "DUBNIUM"
  - "Zigzag Hail"
  - "Tapaoux"
  - "Group 1"
  - "Pioneer"
affiliation: "South Korea (assessed)"
motivation: "Espionage"
status: active
country: "South Korea"
firstSeen: "2007"
targetSectors:
  - "Defense"
  - "Automotive"
  - "Electronics"
  - "Pharmaceuticals"
  - "Manufacturing"
  - "Financial Services"
  - "Government"
  - "Non-Governmental Organizations"
targetGeographies:
  - "Japan"
  - "South Korea"
  - "China"
  - "Taiwan"
  - "Russia"
  - "Germany"
  - "United States"
  - "Asia-Pacific"
tools:
  - "Karba"
  - "Tapaoux"
  - "BBSRAT"
  - "custom keyloggers"
  - "trojanized software installers"
mitreMappings:
  - techniqueId: "T1566.001"
    techniqueName: "Spearphishing Attachment"
    tactic: "Initial Access"
    confidence: "confirmed"
    notes: "DarkHotel delivers malicious attachments exploiting zero-day vulnerabilities in Adobe Reader, Flash, and Microsoft Office to compromise targeted executives."
  - techniqueId: "T1189"
    techniqueName: "Drive-by Compromise"
    tactic: "Initial Access"
    confidence: "confirmed"
    notes: "Signature technique: DarkHotel compromises hotel Wi-Fi networks to serve fake software update packages (Adobe Flash, Windows Messenger) to targeted guests."
  - techniqueId: "T1203"
    techniqueName: "Exploitation for Client Execution"
    tactic: "Execution"
    confidence: "confirmed"
    notes: "Exploits zero-day vulnerabilities in client-side applications including Adobe Flash (CVE-2015-5119, sourced from Hacking Team leak) and Internet Explorer."
  - techniqueId: "T1027"
    techniqueName: "Obfuscated Files or Information"
    tactic: "Defense Evasion"
    confidence: "confirmed"
    notes: "DarkHotel malware components are consistently obfuscated; signed with counterfeit or stolen code-signing certificates to evade detection."
  - techniqueId: "T1547.001"
    techniqueName: "Registry Run Keys / Startup Folder"
    tactic: "Persistence"
    confidence: "confirmed"
    notes: "The Karba backdoor establishes persistence via Windows Registry Run keys, surviving reboots across targeted hotel stays."
attributionConfidence: A3
attributionRationale: "Kaspersky Lab and Microsoft research attributes DarkHotel to South Korean-speaking threat actors based on language artifacts, targeting patterns, and operational infrastructure. No government indictment has been issued; attribution is assessed, not confirmed."
reviewStatus: "draft_ai"
generatedBy: "dangermouse-bot"
generatedDate: 2026-05-14
tags:
  - "nation-state"
  - "south-korea"
  - "espionage"
  - "apt"
  - "hotel"
  - "zero-day"
  - "spearphishing"
  - "darkhotel"
sources:
  - url: "https://attack.mitre.org/groups/G0012/"
    publisher: "MITRE ATT&CK"
    publisherType: research
    reliability: R1
    publicationDate: "2026-05-13"
    accessDate: "2026-05-14"
    archived: false
  - url: "https://media.defense.gov/2021/Jul/29/2002815141/-1/-1/0/CSI_SECURING_WIRELESS_DEVICES_IN_PUBLIC_SETTINGS.PDF"
    publisher: "NSA Cybersecurity"
    publisherType: government
    reliability: R1
    publicationDate: "2021-07-29"
    accessDate: "2026-05-14"
    archived: false
  - url: "https://securelist.com/the-darkhotel-apt/66779/"
    publisher: "Kaspersky Lab"
    publisherType: vendor
    reliability: R1
    publicationDate: "2014-11-10"
    accessDate: "2026-05-14"
    archived: false
  - url: "https://securelist.com/darkhotel-attacks-in-2015/71713/"
    publisher: "Kaspersky Lab"
    publisherType: vendor
    reliability: R1
    publicationDate: "2015-11-09"
    accessDate: "2026-05-14"
    archived: false
---

## Executive Summary

DarkHotel is a South Korean-attributed advanced persistent threat (APT) group active since at least 2007, specializing in targeted espionage against senior business executives. The group is best known for a signature tactic: compromising hotel Wi-Fi networks to intercept and redirect corporate guests toward trojanized software installers, earning the group its name from Kaspersky Lab's landmark 2014 disclosure.

Operating across Asia-Pacific and beyond, DarkHotel has targeted executives from the defense, automotive, electronics, pharmaceutical, and manufacturing sectors with a high degree of operational precision. The group demonstrates patient, multi-stage targeting — researching victims before hotel stays and staging attacks to coincide with confirmed bookings — alongside an aggressive zero-day exploitation capability, including documented use of Adobe Flash and Internet Explorer vulnerabilities sourced from the 2015 Hacking Team breach.

## Notable Campaigns

### 2007–2014 — Hotel Wi-Fi Network Intrusions

Kaspersky Lab's November 2014 report documented a sustained campaign spanning at least seven years in which DarkHotel compromised hotel networks across Japan, Taiwan, China, Russia, and Germany. The group maintained persistent access to hotel network infrastructure and selectively targeted guests who matched executive profiles. Victims were presented with fake update prompts for legitimate software — Adobe Flash, Windows Messenger — that delivered the Karba backdoor or a custom keylogger. The targeting was highly selective: only specific guests were served malicious content while other hotel traffic passed unaffected.

### 2015 — Zero-Day Exploitation Surge

Following the July 2015 breach of Italian spyware vendor Hacking Team, DarkHotel rapidly weaponized leaked zero-day exploit code for Adobe Flash (CVE-2015-5119), incorporating it into both spearphishing campaigns and watering-hole attacks within days of public disclosure. Kaspersky's follow-up 2015 report documented the group's use of this and additional Flash and Internet Explorer zero-days, demonstrating a sustained investment in client-side exploitation capability beyond the hotel-network vector.

### 2019–2020 — COVID-19 Research Targeting

Multiple security vendors reported DarkHotel-attributed activity targeting organizations involved in COVID-19 vaccine and pharmaceutical research, consistent with the group's historic focus on technology and IP theft from high-value corporate targets. This activity demonstrated the group's operational continuity and adaptability to high-priority collection requirements.

## Technical Capabilities

DarkHotel's technical toolkit spans social engineering, network-level interception, and custom malware, with a track record of rapid zero-day incorporation.

**Karba** is the group's primary backdoor, providing keylogging, screen capture, file system enumeration, and remote command execution. It establishes persistence through Windows Registry Run keys and communicates with command-and-control infrastructure over standard web protocols to blend with legitimate traffic.

**Tapaoux** (also called the DarkHotel downloader) serves as a first-stage implant, delivered through malicious attachments or hotel-network injection. It performs host reconnaissance and retrieves second-stage payloads from attacker-controlled servers.

**BBSRAT** is a modular backdoor sharing functional overlap with Karba, capable of process injection, file management, and remote shell access. Its use in DarkHotel operations has been assessed by multiple vendors.

The group's network interception technique requires prior compromise of hotel IT infrastructure — typically via exploitation of hotel network management systems or router firmware — which the group maintains as persistent footholds between targeted operations. Code-signing with counterfeit certificates is consistently used to reduce endpoint detection friction.

## Attribution

DarkHotel attribution to South Korean-linked actors rests on corroborating evidence across multiple vendor investigations. Language artifacts in malware binaries and decoy documents show Korean-language content. Operational targeting aligns with South Korean national intelligence interests: the group prioritizes executives from countries and industries relevant to Korean economic and strategic competition. Infrastructure patterns, code reuse across campaigns, and the sustained operational tempo over more than a decade are consistent with a state-sponsored or state-tolerated actor.

Microsoft tracks the group as **DUBNIUM** and CrowdStrike as **Zigzag Hail**. Neither the South Korean government nor any foreign government has issued a formal indictment or public attribution statement. The A3 assessment reflects vendor-level consensus without government confirmation — a weaker evidentiary basis than formally indicted groups such as APT41.

## MITRE ATT&CK Profile

**Initial Access**: DarkHotel employs two primary vectors: spearphishing with malicious attachments (T1566.001) exploiting zero-days in Adobe Reader, Flash, and Office; and drive-by compromise via compromised hotel Wi-Fi networks (T1189) delivering trojanized software update packages to targeted guests.

**Execution**: Client-side zero-day exploitation (T1203) is a hallmark of DarkHotel operations, with documented use of Adobe Flash vulnerabilities including CVE-2015-5119 from the Hacking Team breach, as well as multiple Internet Explorer zero-days.

**Persistence**: Karba and Tapaoux establish persistence through Windows Registry Run keys and Startup folder entries (T1547.001), ensuring survival across reboots and enabling long-duration access.

**Defense Evasion**: Malware components are consistently obfuscated (T1027) and signed with counterfeit or stolen code-signing certificates, reducing detection rates on both endpoint and network controls.

**Collection**: The Karba backdoor includes screen capture and keylogging capabilities, enabling credential theft and document exfiltration from targeted executives.

## Sources & References

- [MITRE ATT&CK: DarkHotel (G0012)](https://attack.mitre.org/groups/G0012/) — MITRE ATT&CK, 2026-05-13
- [NSA Cybersecurity: Securing Wireless Devices in Public Settings](https://media.defense.gov/2021/Jul/29/2002815141/-1/-1/0/CSI_SECURING_WIRELESS_DEVICES_IN_PUBLIC_SETTINGS.PDF) — NSA Cybersecurity, 2021-07-29
- [Kaspersky Lab: The DarkHotel APT](https://securelist.com/the-darkhotel-apt/66779/) — Kaspersky Lab, 2014-11-10
- [Kaspersky Lab: DarkHotel Attacks in 2015](https://securelist.com/darkhotel-attacks-in-2015/71713/) — Kaspersky Lab, 2015-11-09
