---
name: "APT37 / Reaper"
aliases:
  - "APT37"
  - "Reaper"
  - "ScarCruft"
  - "InkySquid"
  - "Group123"
  - "TEMP.Reaper"
  - "Ricochet Chollima"
affiliation: "North Korea (assessed)"
motivation: "Espionage"
status: active
country: "North Korea"
firstSeen: "2012"
targetSectors:
  - "Government"
  - "Defense"
  - "Chemicals"
  - "Electronics"
  - "Manufacturing"
  - "Aerospace"
  - "Automotive"
  - "Healthcare"
targetGeographies:
  - "South Korea"
  - "Japan"
  - "Vietnam"
  - "Russia"
  - "Nepal"
  - "China"
  - "India"
  - "Romania"
  - "Kuwait"
  - "Middle East"
tools: []
mitreMappings:
  - techniqueId: "T1566.001"
    techniqueName: "Spearphishing Attachment"
    tactic: "Initial Access"
    attackVersion: "v19"
    confidence: "confirmed"
    evidence: "MITRE ATT&CK (G0067) documents APT37 using spearphishing attachments, including malicious HWP documents, as a primary initial access technique."
    notes: "Mandiant (FireEye) corroborates tailored spearphishing using HWP lures aligned to Korean-language targets."
  - techniqueId: "T1189"
    techniqueName: "Drive-by Compromise"
    tactic: "Initial Access"
    attackVersion: "v19"
    confidence: "confirmed"
    evidence: "MITRE ATT&CK (G0067) documents APT37 using drive-by compromise. Google Cloud / Mandiant describes strategic web compromises and torrent file-sharing sites as additional infection vectors."
    notes: "Strategic web compromises extend the group's reach beyond direct spearphishing targets."
  - techniqueId: "T1203"
    techniqueName: "Exploitation for Client Execution"
    tactic: "Execution"
    attackVersion: "v19"
    confidence: "confirmed"
    evidence: "MITRE ATT&CK (G0067) documents APT37 exploiting vulnerabilities in client applications. Google Cloud / Mandiant reported exploitation of HWP and Adobe Flash vulnerabilities, including zero-day Flash vulnerabilities."
    notes: "Zero-day Flash exploitation and HWP document exploitation are both documented for this group."
  - techniqueId: "T1059.003"
    techniqueName: "Windows Command Shell"
    tactic: "Execution"
    attackVersion: "v19"
    confidence: "confirmed"
    evidence: "MITRE ATT&CK (G0067) documents APT37 using the Windows Command Shell for post-exploitation command execution."
    notes: "Windows Command Shell use is documented by MITRE as part of APT37's post-compromise execution capability."
  - techniqueId: "T1005"
    techniqueName: "Data from Local System"
    tactic: "Collection"
    attackVersion: "v19"
    confidence: "confirmed"
    evidence: "MITRE ATT&CK (G0067) documents APT37 collecting data from local systems on compromised hosts."
    notes: "Local data collection is consistent with the group's intelligence-gathering mission profile."
  - techniqueId: "T1123"
    techniqueName: "Audio Capture"
    tactic: "Collection"
    attackVersion: "v19"
    confidence: "confirmed"
    evidence: "MITRE ATT&CK (G0067) documents APT37 capturing audio from compromised hosts."
    notes: "Audio capture capability reflects a persistent collection posture targeting sensitive communications."
  - techniqueId: "T1120"
    techniqueName: "Peripheral Device Discovery"
    tactic: "Discovery"
    attackVersion: "v19"
    confidence: "confirmed"
    evidence: "MITRE ATT&CK (G0067) documents APT37 performing peripheral device discovery. Kaspersky documented a Bluetooth device harvester attributed to the ScarCruft cluster capable of enumerating paired Bluetooth devices."
    notes: "The Kaspersky-documented Bluetooth harvester extends peripheral discovery to wireless device enumeration."
  - techniqueId: "T1071.001"
    techniqueName: "Web Protocols"
    tactic: "Command and Control"
    attackVersion: "v19"
    confidence: "confirmed"
    evidence: "MITRE ATT&CK (G0067) documents APT37 using HTTP-based web protocols for command-and-control communications."
    notes: "HTTP-based C2 is a documented core command-and-control technique for this group."
  - techniqueId: "T1102.002"
    techniqueName: "Bidirectional Communication"
    tactic: "Command and Control"
    attackVersion: "v19"
    confidence: "confirmed"
    evidence: "MITRE ATT&CK (G0067) documents APT37 using bidirectional communication via web services for operator interaction."
    notes: "Use of web services for two-way C2 interaction is documented by MITRE for this group."
  - techniqueId: "T1105"
    techniqueName: "Ingress Tool Transfer"
    tactic: "Command and Control"
    attackVersion: "v19"
    confidence: "confirmed"
    evidence: "MITRE ATT&CK (G0067) documents APT37 transferring tools and payloads to compromised hosts over established C2 channels."
    notes: "Ingress tool transfer supports staged payload delivery following initial compromise."
atlasMappings: []
attributionConfidence: A2
attributionRationale: "MITRE ATT&CK (G0067) documents APT37 as a North Korean state-sponsored group active since at least 2012. Google Cloud / Mandiant assessed with high confidence that activity is conducted on behalf of the North Korean government. APT37 is a distinct cluster from Lazarus (G0032) and APT38 (G0082); alias diversity reflects independent vendor tracking. No public indictment specifically names APT37 operators."
reviewStatus: "draft_ai"
generatedBy: "dangermouse-bot"
generatedDate: 2026-05-13
tags:
  - "nation-state"
  - "north-korea"
  - "espionage"
  - "apt37"
  - "reaper"
  - "scarcruft"
  - "inky-squid"
  - "government"
  - "south-korea"
  - "zero-day"
sources:
  - url: "https://attack.mitre.org/groups/G0067/"
    publisher: "MITRE ATT&CK"
    publisherType: research
    reliability: R1
    publicationDate: "2026-05-13"
    accessDate: "2026-05-13"
    archived: false
  - url: "https://cloud.google.com/blog/topics/threat-intelligence/apt37-overlooked-north-korean-actor/"
    publisher: "Google Cloud"
    publisherType: vendor
    reliability: R1
    publicationDate: "2018-02-20"
    accessDate: "2026-05-13"
    archived: false
  - url: "https://securelist.com/scarcruft-continues-to-evolve-introduces-bluetooth-harvester/90729/"
    publisher: "Kaspersky"
    publisherType: vendor
    reliability: R1
    publicationDate: "2019-05-13"
    accessDate: "2026-05-13"
    archived: false
  - url: "https://www.cisa.gov/news-events/alerts/2019/05/09/north-korean-malicious-cyber-activity"
    publisher: "CISA"
    publisherType: government
    reliability: R1
    publicationDate: "2019-05-09"
    accessDate: "2026-05-13"
    archived: false
---

## Executive Summary

APT37, tracked under aliases including Reaper, ScarCruft, InkySquid, Group123, TEMP.Reaper, and Ricochet Chollima, is a North Korean state-sponsored cyber espionage group that MITRE ATT&CK (G0067) documents as active since at least 2012. Google Cloud / Mandiant (formerly FireEye) assessed with high confidence that the group's operations are conducted on behalf of the North Korean government.

South Korea is the group's primary target, with documented targeting extending to Japan, Vietnam, Russia, Nepal, China, India, Romania, Kuwait, and other Middle East locations. Sector focus spans chemicals, electronics, manufacturing, aerospace, automotive, and healthcare, alongside government and defense entities. APT37 employs tailored social engineering, strategic web compromises, and exploitation of application vulnerabilities — including HWP (Hangul Word Processor) and Adobe Flash vulnerabilities — as its principal intrusion methods. Google Cloud / Mandiant reported that the group has obtained and deployed zero-day exploits and wiper malware, indicating capabilities beyond standard espionage tooling.

APT37 is a distinct tracked cluster from Lazarus Group (G0032) and APT38 (G0082). MITRE notes that some researchers use "Lazarus Group" as a blanket label for all North Korean state-sponsored activity, which can obscure meaningful distinctions between operationally separate groups; APT37 should not be conflated with those clusters.

## Notable Campaigns

### South Korean Espionage Operations (2012–present)

MITRE ATT&CK documents APT37 targeting South Korean entities as a sustained operational focus beginning at least as early as 2012. Google Cloud / Mandiant identified a pattern of operations against South Korean government, defense, and civilian sector targets using Korean-language lure documents — particularly HWP files exploiting Hangul Word Processor vulnerabilities — delivered through tailored spearphishing. The consistency of South Korean targeting over more than a decade reflects the group's alignment with North Korean state intelligence priorities toward the Korean peninsula.

### Strategic Web Compromises and Torrent-Based Delivery

Google Cloud / Mandiant documented APT37 using strategic web compromises (watering hole attacks) and torrent file-sharing sites as infection vectors, supplementing direct spearphishing. These methods extended the group's reach to South Korean users researching North Korean affairs and regional topics who might not otherwise be reachable by targeted spearphishing, broadening potential victim populations without requiring individualized targeting.

### Expanded Geographic and Sector Targeting

Google Cloud / Mandiant reported APT37 activity beyond South Korea targeting Japan, Vietnam, and the Middle East, spanning chemicals, electronics, manufacturing, aerospace, automotive, and healthcare sectors. These campaigns included exploitation of Adobe Flash zero-day vulnerabilities alongside continued HWP exploitation. The group's demonstrated access to zero-day vulnerabilities during this period indicated a level of resourcing and operational sophistication beyond a narrowly opportunistic actor.

## Technical Capabilities

APT37 employs a multi-method initial access strategy combining spearphishing attachments, strategic web compromises, and exploitation of client-side application vulnerabilities. Google Cloud / Mandiant reported that the group weaponized HWP (Hangul Word Processor) vulnerabilities in tailored documents targeting Korean-language audiences, and separately exploited Adobe Flash vulnerabilities — including zero-day vulnerabilities — during broader targeting campaigns.

Post-compromise collection focuses on intelligence gathering from local systems and audio capture from compromised hosts. Kaspersky documented a Bluetooth device harvester attributed to the ScarCruft cluster — one of the alias designations overlapping with APT37 — capable of enumerating Bluetooth devices paired with compromised Windows hosts. This capability extends peripheral reconnaissance beyond standard host-based discovery.

Google Cloud / Mandiant noted the group's possession of wiper malware in its toolkit, establishing a destructive capability alongside its primary espionage mission. Post-exploitation command-and-control uses HTTP-based web protocols and bidirectional web service communication. Tool delivery to compromised hosts relies on ingress tool transfer over established C2 channels.

The alias diversity associated with this group — including ScarCruft (used heavily by Kaspersky) and InkySquid (used by Volexity) — reflects independent vendor tracking and does not necessarily indicate distinct organizational units. Operational overlaps between these designations are documented; attribution claims specific to one vendor's alias scope should not be assumed to extend uniformly across all designations.

## Attribution

MITRE ATT&CK categorizes APT37 as G0067 and documents it as a North Korean state-sponsored cyber espionage group active since at least 2012. Google Cloud / Mandiant assessed with high confidence that APT37 activity is conducted on behalf of the North Korean government, grounding that assessment in targeting patterns aligned with North Korean state intelligence interests, infrastructure analysis, and operational tradecraft.

CISA and DHS/FBI use the designation HIDDEN COBRA to refer to North Korean government malicious cyber activity broadly. That designation is not a specific attribution to APT37 as a bounded cluster and should not be read as government confirmation of APT37's operational identity.

APT37 is tracked as distinct from Lazarus Group (G0032) and APT38 (G0082). MITRE explicitly notes that some researchers apply the Lazarus Group label to all North Korean state-sponsored cyber activity; doing so collapses meaningfully separate groups. APT37 activity and tooling are tracked separately in MITRE ATT&CK from both Lazarus and APT38 profiles.

The alias cluster — APT37, Reaper, ScarCruft, InkySquid, Group123, TEMP.Reaper, Ricochet Chollima — reflects independent vendor discovery and naming conventions applied to overlapping observed intrusion sets. No public indictment has specifically named APT37 operators, and the government attribution record supports a North Korean state nexus without identifying a specific unit or command structure.

## MITRE ATT&CK Profile

APT37 employs techniques documented across MITRE ATT&CK v19, spanning initial access, execution, collection, discovery, and command and control.

**Initial Access**: Spearphishing Attachment (T1566.001) delivers malicious HWP documents and other lure files to targeted individuals. Drive-by Compromise (T1189) via strategic web compromises and torrent file-sharing sites provides population-level access supplementing direct spearphishing.

**Execution**: Exploitation for Client Execution (T1203) weaponizes HWP and Adobe Flash vulnerabilities — including documented zero-days — to achieve code execution on victim hosts following delivery of malicious content. Windows Command Shell (T1059.003) supports post-exploitation command execution.

**Collection**: Data from Local System (T1005) supports intelligence gathering from compromised hosts. Audio Capture (T1123) records audio from victim systems, indicating a persistent collection posture targeting sensitive communications. Peripheral Device Discovery (T1120) is documented via the Kaspersky-described Bluetooth device harvester attributed to the ScarCruft cluster, enabling enumeration of Bluetooth devices paired with compromised hosts.

**Command and Control**: Web Protocols (T1071.001) underpin HTTP-based C2 communications. Bidirectional Communication (T1102.002) reflects the use of web services for two-way operator interaction. Ingress Tool Transfer (T1105) delivers additional tooling and payloads to compromised hosts over established C2 channels.

## Sources & References

- [MITRE ATT&CK: APT37 (G0067)](https://attack.mitre.org/groups/G0067/) — MITRE ATT&CK, 2026-05-13
- [Google Cloud: APT37 — An Overlooked North Korean Actor](https://cloud.google.com/blog/topics/threat-intelligence/apt37-overlooked-north-korean-actor/) — Google Cloud, 2018-02-20
- [Kaspersky: ScarCruft Continues to Evolve, Introduces Bluetooth Harvester](https://securelist.com/scarcruft-continues-to-evolve-introduces-bluetooth-harvester/90729/) — Kaspersky, 2019-05-13
- [CISA: North Korean Malicious Cyber Activity](https://www.cisa.gov/news-events/alerts/2019/05/09/north-korean-malicious-cyber-activity) — CISA, 2019-05-09
