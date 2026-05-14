---
campaignId: "TP-CAMP-2026-0008"
title: "China-Nexus Covert Proxy Networks Campaign"
startDate: 2024-01-01
ongoing: true
attackType: "Covert Proxy Infrastructure / Botnet Routing"
severity: high
sector: "Critical Infrastructure / Multi-Sector"
geography: "Global"
threatActor: "China-nexus threat actors"
attributionConfidence: A3
reviewStatus: "draft_ai"
confidenceGrade: B
generatedBy: "dangermouse-bot"
generatedDate: 2026-05-13
cves: []
relatedIncidents: []
tags:
  - china-nexus
  - covert-networks
  - botnet
  - proxy-infrastructure
  - soho-routers
  - iot
  - edge-devices
sources:
  - url: "https://www.ncsc.gov.uk/news/defending-against-china-nexus-covert-networks-of-compromised-devices"
    publisher: "NCSC"
    publisherType: government
    reliability: R1
    publicationDate: "2026-04-23"
    accessDate: "2026-05-13"
    archived: false
  - url: "https://www.ncsc.gov.uk/news/international-cyber-agencies-fresh-advice-defend-against-china-linked-covert-networks"
    publisher: "NCSC"
    publisherType: government
    reliability: R1
    publicationDate: "2026-04-23"
    accessDate: "2026-05-13"
    archived: false
  - url: "https://www.cyber.gc.ca/en/news-events/joint-guidance-defending-against-peoples-republic-china-linked-covert-networks"
    publisher: "Canadian Centre for Cyber Security"
    publisherType: government
    reliability: R1
    publicationDate: "2026-04-23"
    accessDate: "2026-05-13"
    archived: false
  - url: "https://news.risky.biz/risky-bulletin-there-are-now-sim-farm-as-a-service-providers"
    publisher: "Risky Business"
    publisherType: media
    reliability: R2
    publicationDate: "2026-04-24"
    accessDate: "2026-05-13"
    archived: false
mitreMappings:
  - techniqueId: "T1090.003"
    techniqueName: "Multi-hop Proxy"
    tactic: "Command and Control"
    "attack-version": "v19"
    confidence: confirmed
    evidence: "The NCSC April 2026 advisory explicitly maps China-nexus actors' covert network routing activity to T1090.003 Multi-hop Proxy, describing networks of compromised SOHO routers, IoT devices, and edge devices used to route malicious cyber activity and obscure the actors' true origin."
  - techniqueId: "T1595"
    techniqueName: "Active Scanning"
    tactic: "Reconnaissance"
    "attack-version": "v19"
    confidence: probable
    evidence: "The NCSC April 2026 advisory states that China-nexus actors use covert networks to perform reconnaissance scans against targets, consistent with T1595 Active Scanning. Attribution is to the covert infrastructure class rather than to a single named intrusion set."
---

## Executive Summary

Since at least 2024, China-nexus threat actors have operated networks of compromised edge devices to route malicious cyber activity against critical sector targets globally. On April 23, 2026, the U.K. National Cyber Security Centre (NCSC), U.K. industry partners, and 15 international partner agencies published joint guidance describing this infrastructure class and providing defenders with tools to identify and respond to it.

The advisory describes a shift in operational tradecraft: rather than procuring dedicated infrastructure individually, China-nexus actors have moved toward externally provisioned networks of compromised devices, built and maintained by Chinese information security companies. Multiple such networks are in use simultaneously, they are continuously updated, and a single network may be used by more than one threat actor. The advisory notes that the majority of tracked China-nexus actors are now using this type of covert infrastructure.

Public evidence supports a China-nexus infrastructure pattern rather than a single intrusion set controlling a single network. Named examples in the public record include the KV Botnet, associated with Volt Typhoon activity against critical national infrastructure, and the Raptor Train botnet, which infected more than 200,000 devices worldwide in 2024 and was publicly attributed to Integrity Technology Group, a Chinese information security company assessed by the FBI to be responsible for activity associated with Flax Typhoon.

## Technical Analysis

The covert networks described in the April 2026 advisory are primarily composed of compromised small-office/home-office (SOHO) routers, Internet of Things (IoT) devices, smart devices, and other edge devices. These devices are attractive targets for compromise because they are frequently end-of-life, out of date, or no longer receiving security patches, and they are often lightly monitored or unmanaged compared to enterprise-class infrastructure.

The advisory describes these networks as externally provisioned: they are created and maintained by Chinese information security companies, which manage the infrastructure and make it available to China-nexus threat actors as operational routing infrastructure. The network operators and the threat actors using the networks may be distinct entities, and individual networks may serve multiple actor groups simultaneously. Multiple networks are constantly updated, reducing their traceability and increasing the difficulty of sustained blocking by defenders.

China-nexus actors use the covert networks for a range of operational tasks: routing cyber activity to obscure origin, performing reconnaissance scans against targets, delivering malware, supporting malware command-and-control communication, exfiltrating stolen data, and conducting deniable browsing or victim research. The breadth of uses means that a single compromised device in one of these networks may have served multiple purposes across multiple operations.

A significant defensive challenge highlighted in the April 2026 advisory is what it describes as "IOC extinction": network indicators of compromise for covert network nodes disappear as quickly as they are discovered, because the networks are continuously updated and rotated. This dynamic makes static indicator lists a weak primary defense and requires defenders to adopt adaptive, intelligence-driven approaches rather than relying on point-in-time blocklists. The Canadian Centre for Cyber Security's parallel guidance echoes the same warning.

The Raptor Train botnet is the largest publicly documented example of this infrastructure class. It infected more than 200,000 devices worldwide in 2024. The FBI publicly assessed that Integrity Technology Group controlled and managed the Raptor Train botnet and was responsible for activity attributed to Flax Typhoon. U.K. authorities sanctioned Integrity Technology Group and another China-based information security company in December 2025.

The KV Botnet is a separate documented example, primarily composed of vulnerable Cisco and NetGear routers. Public reporting has associated it with Volt Typhoon activity, including pre-positioning of offensive capabilities against critical national infrastructure.

## Attack Chain

### Stage 1: Device Identification

Actors or their infrastructure providers identify SOHO routers, IoT devices, smart devices, and other edge devices that are reachable and exploitable, prioritizing devices that are end-of-life, unpatched, or otherwise vulnerable. Reconnaissance scanning of exposed network surfaces is used to build candidate target lists.

### Stage 2: Device Compromise and Enrollment

Vulnerable devices are compromised through exploitation of known security weaknesses. Once access is established, the device is enrolled in the covert network and configured to route traffic on behalf of the controlling infrastructure.

### Stage 3: Network Provisioning and Multi-Hop Routing

The compromised device becomes a node in a multi-hop proxy chain. Traffic from threat actor operations is routed through one or more of these nodes to obscure the origin of the activity. The network is maintained and updated by the provisioning entity, cycling devices in and out to limit exposure of individual nodes.

### Stage 4: Operational Use Against Targets

The covert network is used for operational tasks against intended targets: reconnaissance scans, malware delivery, command-and-control communication, data exfiltration, and victim research. The origin of this activity appears to defenders as coming from residential or small-business IP addresses rather than from dedicated attacker infrastructure.

### Stage 5: Indicator Rotation and Persistence

As network nodes are identified and blocked by defenders, the provisioning entity updates the network with new devices and retires flagged nodes. This continuous rotation limits the useful life of any specific indicator and extends the operational life of the network as a whole.

## MITRE ATT&CK Mapping

T1090.003 - Multi-hop Proxy: The NCSC April 2026 advisory explicitly maps China-nexus covert network routing activity to T1090.003 Multi-hop Proxy. China-nexus actors route malicious cyber activity through networks of compromised SOHO routers, IoT devices, and edge devices, chaining these nodes together to obscure the true origin of operations. The multi-hop structure makes attribution more difficult and allows a single network to serve multiple actor groups and operational tasks simultaneously.

T1595 - Active Scanning: The NCSC April 2026 advisory states that China-nexus actors use covert networks to perform reconnaissance scans against targets. Routing scan traffic through compromised edge devices limits the traceability of scanning activity back to actor-controlled infrastructure.

## Timeline

### 2024-01 - Documented Campaign Period Begins

Public reporting and the April 2026 joint advisory place the documented activity of covert proxy networks used by China-nexus actors within the 2024 period. The KV Botnet and Raptor Train botnet were both active at scale during this period, targeting critical sectors globally.

### 2024-09 - Public Attribution of Integrity Technology Group and Raptor Train Botnet

In September 2024, public attribution identified Integrity Technology Group as controlling and managing a botnet used for activity associated with Flax Typhoon. The Raptor Train botnet, which infected more than 200,000 devices worldwide in 2024, was identified as part of this infrastructure. The FBI assessed that Integrity Technology Group was responsible for the associated activity.

### 2025-12 - UK Sanctions Against Chinese Information Security Companies

In December 2025, U.K. authorities sanctioned Integrity Technology Group and another China-based information security company in connection with their role in building and maintaining covert network infrastructure used by China-nexus threat actors.

### 2026-04-23 - Joint Advisory Published by NCSC and International Partners

The U.K. NCSC, U.K. industry, and 15 international partner agencies published joint guidance on April 23, 2026, providing defenders with tools to identify and defend against China-nexus covert networks of compromised devices. The advisory described the infrastructure class, named documented examples including the KV Botnet and Raptor Train, and outlined the IOC extinction challenge and recommended adaptive defenses.

### 2026-04-24 - Risky Business Bulletin Covers Residential Proxy Ecosystem

Risky Business published a bulletin on April 24, 2026, noting the residential proxy botnet ecosystem and observing that proxy mesh infrastructure is used by a range of actors to mask attack origin and command-and-control traffic.

## Remediation & Mitigation

Defenders should map and establish baselines for edge device network traffic across their environments. Traffic anomalies on SOHO routers, IoT devices, firewalls, and other edge infrastructure can indicate unauthorized use as covert network nodes. Unexpected outbound connections, unusual data volumes, or traffic to unfamiliar external addresses warrant investigation.

Monitor and restrict VPN and remote access paths, including third-party and vendor remote access. Covert network routing can make malicious traffic appear to originate from legitimate-looking residential or commercial IP space. Behavioral monitoring of remote sessions, coupled with anomaly detection on authentication and access patterns, provides detection coverage that is not defeated by IP-based indicators alone.

Replace or patch end-of-life edge devices. The April 2026 advisory identifies devices that are end-of-life, out of date, or no longer receiving patches as the primary target class for covert network enrollment. Organizations should maintain an accurate inventory of edge devices, enforce upgrade paths for devices approaching end-of-support, and remove or isolate devices for which vendor patches are no longer available.

Apply network segmentation to limit the impact of a compromised edge device. Devices that do not require direct access to sensitive systems or network segments should not have it. Segmentation reduces the operational value of a compromised edge node and can limit the scope of reconnaissance or lateral movement that an actor can conduct through it.

Implement centralized logging and security monitoring for edge device activity. Many SOHO and IoT devices are not included in enterprise log collection, creating blind spots that covert network operators exploit. Where devices support logging or syslog forwarding, include them in monitoring pipelines.

Deploy host-based intrusion detection on endpoints and servers that may be reachable from edge device segments. Host-level visibility can detect post-routing malicious behavior even when network-level indicators are masked by proxy rotation.

Apply lateral movement controls, including privileged access management and strong authentication requirements, to limit attacker progression from an initial foothold obtained through covert network routing. Lateral movement controls determine what access through the covert network can reach within the environment.

Integrate dynamic threat intelligence feeds into network filtering and conditional access controls. Because static indicator lists lose value quickly under IOC extinction conditions, threat intelligence feeds that are continuously updated with fresh covert network indicators provide more durable protection than point-in-time blocklists. The April 2026 joint advisory explicitly recommends adaptive, intelligence-driven defense as the primary response to the IOC extinction challenge.

## Sources & References

- [NCSC: Defending against China-nexus covert networks of compromised devices](https://www.ncsc.gov.uk/news/defending-against-china-nexus-covert-networks-of-compromised-devices) — NCSC, 2026-04-23
- [NCSC: International cyber agencies share fresh advice to defend against China-linked covert networks](https://www.ncsc.gov.uk/news/international-cyber-agencies-fresh-advice-defend-against-china-linked-covert-networks) — NCSC, 2026-04-23
- [Canadian Centre for Cyber Security: Joint guidance on defending against the People's Republic of China-linked covert networks](https://www.cyber.gc.ca/en/news-events/joint-guidance-defending-against-peoples-republic-china-linked-covert-networks) — Canadian Centre for Cyber Security, 2026-04-23
- [Risky Business: Risky Bulletin: There are now SIM-Farm-as-a-Service providers](https://news.risky.biz/risky-bulletin-there-are-now-sim-farm-as-a-service-providers) — Risky Business, 2026-04-24
