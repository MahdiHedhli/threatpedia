---
eventId: TP-2022-0001
title: Viasat KA-SAT AcidRain Satellite Network Attack
date: 2022-02-24
attackType: Sabotage / Wiper
severity: critical
sector: Communications
geography: Ukraine / Europe
threatActor: Russian state-sponsored actors
attributionConfidence: A1
reviewStatus: draft_ai
confidenceGrade: A
generatedBy: kernel-k
generatedDate: 2026-05-17
cves: []
relatedSlugs: []
tags:
  - viasat
  - ka-sat
  - acidrain
  - satellite-communications
  - satcom
  - ukraine
  - russia
  - wiper
  - modem
sources:
  - url: https://www.viasat.com/perspectives/corporate/2022/ka-sat-network-cyber-attack-overview/
    publisher: Viasat
    publisherType: vendor
    reliability: R1
    publicationDate: "2022-03-30"
    accessDate: "2026-05-17"
    archived: false
  - url: https://www.consilium.europa.eu/en/press/press-releases/2022/05/10/russian-cyber-operations-against-ukraine-declaration-by-the-high-representative-on-behalf-of-the-european-union/pdf
    publisher: Council of the European Union
    publisherType: government
    reliability: R1
    publicationDate: "2022-05-10"
    accessDate: "2026-05-17"
    archived: false
  - url: https://www.gov.uk/government/news/russia-behind-cyber-attack-with-europe-wide-impact-an-hour-before-ukraine-invasion
    publisher: UK Government
    publisherType: government
    reliability: R1
    publicationDate: "2022-05-10"
    accessDate: "2026-05-17"
    archived: false
  - url: https://www.sentinelone.com/labs/acidrain-a-modem-wiper-rains-down-on-europe/
    publisher: SentinelOne
    publisherType: vendor
    reliability: R1
    publicationDate: "2022-03-31"
    accessDate: "2026-05-17"
    archived: false
  - url: https://www.nsa.gov/Press-Room/News-Highlights/Article/Article/2910409/nsa-issues-recommendations-to-protect-vsat-communications/
    publisher: National Security Agency
    publisherType: government
    reliability: R1
    publicationDate: "2022-05-10"
    accessDate: "2026-05-17"
    archived: false
  - url: https://www.cisa.gov/news-events/cybersecurity-advisories/aa22-076a
    publisher: CISA
    publisherType: government
    reliability: R1
    publicationDate: "2022-05-10"
    accessDate: "2026-05-17"
    archived: false
  - url: https://attack.mitre.org/software/S1125/
    publisher: MITRE ATT&CK
    publisherType: research
    reliability: R1
    publicationDate: "2026-05-17"
    accessDate: "2026-05-17"
    archived: false
mitreMappings:
  - techniqueId: T1498
    techniqueName: Network Denial of Service
    tactic: Impact
    attackVersion: "v19.0"
    confidence: confirmed
    evidence: Viasat reported high volumes of malicious traffic from SurfBeam2 and SurfBeam 2+ modems that made it difficult for legitimate modems to stay online.
  - techniqueId: T1485
    techniqueName: Data Destruction
    tactic: Impact
    attackVersion: "v19.0"
    confidence: confirmed
    evidence: Viasat reported that targeted management commands overwrote key data in modem flash memory, while MITRE records AcidRain data destruction behavior.
  - techniqueId: T1561.001
    techniqueName: Disk Content Wipe
    tactic: Impact
    attackVersion: "v19.0"
    confidence: confirmed
    evidence: MITRE ATT&CK describes AcidRain as overwriting device files or invoking IOCTLs to erase attached storage.
  - techniqueId: T1083
    techniqueName: File and Directory Discovery
    tactic: Discovery
    attackVersion: "v19.0"
    confidence: confirmed
    evidence: MITRE ATT&CK describes AcidRain identifying Linux files and directories associated with storage devices before wiping.
  - techniqueId: T1529
    techniqueName: System Shutdown/Reboot
    tactic: Impact
    attackVersion: "v19.0"
    confidence: confirmed
    evidence: MITRE ATT&CK states that AcidRain reboots the target system after wiping activity completes.
---

## Summary

The Viasat KA-SAT attack was a satellite communications disruption that began on 2022-02-24, shortly before Russia's full-scale invasion of Ukraine. Viasat reported that a deliberate cyber attack caused a partial interruption of KA-SAT consumer broadband service, affecting several thousand customers in Ukraine and tens of thousands of fixed broadband customers elsewhere in Europe.

The incident was limited to a consumer-oriented partition of the KA-SAT network operated by Skylogic, a Eutelsat subsidiary, on Viasat's behalf. Viasat stated that its directly managed mobility and government users on KA-SAT were not affected, other Viasat networks were not affected, and there was no evidence that end-user data, customer personal devices, the KA-SAT satellite, or supporting satellite ground infrastructure were directly compromised.

European and UK government statements later attributed the activity to Russia. SentinelOne analyzed a modem and router wiper called AcidRain that it associated with the incident, while MITRE ATT&CK records AcidRain as software associated with the KA-SAT outage and linked to Sandworm reporting.

## Technical Analysis

Viasat described the incident as a two-part disruption. At about 03:02 UTC on 2022-02-24, Viasat detected focused malicious traffic from SurfBeam2 and SurfBeam 2+ modems and related customer-premises equipment physically located in Ukraine. Viasat said this traffic made it difficult for legitimate modems to stay online.

During the same period, Viasat and Skylogic observed a decline in modems online in the affected consumer-oriented partition. By about 04:15 UTC, larger numbers of modems across much of Europe exited the network over about 45 minutes and did not attempt to rejoin. Viasat later reported that tens of thousands of modems dropped from the network, affecting most previously active modems in Ukraine and many additional modems elsewhere in Europe.

Viasat's investigation identified a ground-based network intrusion. According to Viasat, the attacker exploited a misconfiguration in a VPN appliance, gained remote access to the trusted management segment of the KA-SAT network, moved laterally to a segment used to manage and operate the network, and issued legitimate targeted management commands to many residential modems. Viasat said those commands overwrote key data in modem flash memory, preventing the modems from accessing the network.

Viasat also stated that impacted modems showed no anomalies in electrical components, no physical or electronic component compromise, no compromise or tampering with standard modem software or firmware images, and no evidence of supply-chain interference. Viasat said modems could be restored through a factory reset, but it also shipped replacement modems to distributors to speed service restoration.

SentinelOne analyzed AcidRain as a MIPS ELF wiper targeting modems and routers. Its analysis described a binary that could enumerate device files and overwrite or erase storage, matching the class of behavior needed to render network devices inoperable. SentinelOne initially framed the malware relationship as an assessment, and later noted that Viasat had stated the analysis was consistent with Viasat's public technical account.

## Attack Chain

### Stage 1: VPN Appliance Misconfiguration Exploitation

Viasat reported that the attacker exploited a misconfiguration in a VPN appliance to gain remote access to a trusted management segment of the KA-SAT network.

### Stage 2: Lateral Movement Into Management Infrastructure

After obtaining remote access, the attacker moved laterally through the trusted management network to a segment used for network management and operation.

### Stage 3: Malicious Traffic From Ukrainian Modems

Viasat observed high volumes of focused malicious traffic from SurfBeam2 and SurfBeam 2+ modems and related equipment in Ukraine. The traffic degraded the ability of legitimate modems to remain online.

### Stage 4: Destructive Modem Commands

The attacker used management access to execute targeted commands against many residential modems. Viasat said the commands overwrote key data in flash memory and left affected modems unable to access the KA-SAT network.

### Stage 5: AcidRain Wiper Assessment

SentinelOne identified AcidRain as a modem and router wiper that could overwrite or erase device storage. MITRE ATT&CK records AcidRain as associated with the KA-SAT outage and documents its data destruction, disk wipe, discovery, and reboot behaviors.

## Impact Assessment

The outage disrupted a consumer broadband service partition of the KA-SAT network. Viasat reported several thousand affected customers in Ukraine and tens of thousands of affected fixed broadband customers elsewhere in Europe. The UK government said the incident also affected wind farms and internet users in central Europe, while describing the primary target as believed to be Ukrainian military communications.

The incident did not affect all KA-SAT users. Viasat stated that most users were unaffected, directly managed mobility and government users on KA-SAT were unaffected, and other Viasat networks worldwide were unaffected.

Restoration required both network stabilization and customer-device recovery. Viasat said the network was largely stabilized within hours and fully stabilized within several days. Viasat also shipped nearly 30,000 replacement modems to distributors where over-the-air recovery was not sufficient or not timely.

The incident showed that satellite communications providers and customers can face disruption risk through management-plane compromise and customer-terminal destruction even when satellite assets are not directly impaired.

## Attribution

The strongest public attribution for the incident is to Russia. The Council of the European Union stated that the Russian Federation conducted malicious cyber activity against Ukraine targeting the KA-SAT network and that the attack took place one hour before Russia's invasion on 2022-02-24. The UK government said UK and US intelligence suggested Russia was behind the operation and that the UK NCSC assessed it was almost certain Russia was responsible for the Viasat attack.

The Sandworm link should be read as a narrower analytic association, not as the same evidentiary statement as the government attribution to Russia. MITRE ATT&CK records AcidRain as associated with the KA-SAT outage, notes overlap with VPNFilter, and lists Sandworm Team among groups linked to the software. Viasat's public account did not name a threat actor.

## Timeline

### 2022-02-24 - Attack Begins Before Russia's Invasion

The KA-SAT disruption began on the morning of 2022-02-24. The Council of the European Union and UK government both placed the cyber activity shortly before Russia's full-scale invasion of Ukraine.

### 2022-02-24 03:02 UTC - Malicious Traffic Detected

Viasat detected focused malicious traffic from SurfBeam2 and SurfBeam 2+ modems and related equipment in Ukraine.

### 2022-02-24 04:15 UTC - Modems Exit The Network

Viasat and Skylogic observed larger numbers of modems across much of Europe exiting the affected network partition over about 45 minutes.

### 2022-03-30 - Viasat Publishes Incident Overview

Viasat published a public overview describing the affected KA-SAT partition, the management-plane intrusion path, destructive modem commands, and restoration actions.

### 2022-03-31 - SentinelOne Publishes AcidRain Analysis

SentinelOne published analysis of AcidRain, a modem and router wiper it assessed as tied to the KA-SAT incident.

### 2022-05-10 - Governments Attribute The Activity

The Council of the European Union and the UK government published statements attributing the KA-SAT activity to Russia.

### 2022-05-10 - NSA Updates VSAT Guidance

NSA updated guidance for protecting VSAT communications, citing public US and EU statements about Russian attacks against commercial satellite communications.

## Remediation & Mitigation

The incident points to controls around SATCOM management networks, customer-terminal administration, and provider-customer trust boundaries. Providers should monitor ingress and egress points around SATCOM equipment, watch for unexpected terminal-to-terminal traffic, suspicious traffic from SATCOM networks to other network segments, unauthorized use of local or backup accounts, and brute-force login attempts across SATCOM segments.

SATCOM providers and customers should use multifactor authentication where possible for accounts used to access or administer SATCOM networks, avoid default credentials and weak passwords, enforce least privilege, and review trust relationships with IT service providers and managed-service partners.

NSA and CISA guidance also emphasizes encryption and resilience. Organizations should encrypt communications before transmission across VSAT links where possible, keep hardware and firmware updated, maintain configuration management and patching programs, integrate SATCOM traffic into monitoring, review logs behind SATCOM terminals, and exercise incident-response and continuity plans for scenarios where communications systems must be isolated or taken offline.

## Sources & References

- [Viasat: KA-SAT Network cyber attack overview](https://www.viasat.com/perspectives/corporate/2022/ka-sat-network-cyber-attack-overview/) — Viasat, 2022-03-30
- [Council of the European Union: Russian cyber operations against Ukraine](https://www.consilium.europa.eu/en/press/press-releases/2022/05/10/russian-cyber-operations-against-ukraine-declaration-by-the-high-representative-on-behalf-of-the-european-union/pdf) — Council of the European Union, 2022-05-10
- [UK Government: Russia behind cyber-attack with Europe-wide impact](https://www.gov.uk/government/news/russia-behind-cyber-attack-with-europe-wide-impact-an-hour-before-ukraine-invasion) — UK Government, 2022-05-10
- [SentinelOne: AcidRain - A Modem Wiper Rains Down on Europe](https://www.sentinelone.com/labs/acidrain-a-modem-wiper-rains-down-on-europe/) — SentinelOne, 2022-03-31
- [National Security Agency: NSA Issues Recommendations to Protect VSAT Communications](https://www.nsa.gov/Press-Room/News-Highlights/Article/Article/2910409/nsa-issues-recommendations-to-protect-vsat-communications/) — National Security Agency, 2022-05-10
- [CISA: Strengthening Cybersecurity of SATCOM Network Providers and Customers](https://www.cisa.gov/news-events/cybersecurity-advisories/aa22-076a) — CISA, 2022-05-10
- [MITRE ATT&CK: AcidRain](https://attack.mitre.org/software/S1125/) — MITRE ATT&CK, 2026-05-17
