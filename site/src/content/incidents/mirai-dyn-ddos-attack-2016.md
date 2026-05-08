---
eventId: TP-2016-0002
title: Mirai / Dyn DNS DDoS Attack
date: 2016-10-21
attackType: Distributed Denial of Service
severity: critical
sector: Technology
geography: Global
threatActor: Unknown
attributionConfidence: A6
reviewStatus: draft_ai
confidenceGrade: A
generatedBy: kernel-k
generatedDate: 2026-05-08
cves: []
relatedSlugs: []
tags:
  - mirai
  - dyn
  - dns
  - ddos
  - iot
  - botnet
  - internet-infrastructure
sources:
  - url: "https://www.cisa.gov/news-events/alerts/2016/10/14/heightened-ddos-threat-posed-mirai-and-other-botnets"
    publisher: "CISA"
    publisherType: government
    reliability: R1
    publicationDate: "2016-10-14"
    accessDate: "2026-05-08"
    archived: false
  - url: "https://www.justice.gov/archives/opa/pr/justice-department-announces-charges-and-guilty-pleas-three-computer-crime-cases-involving"
    publisher: "U.S. Department of Justice"
    publisherType: government
    reliability: R1
    publicationDate: "2017-12-13"
    accessDate: "2026-05-08"
    archived: false
  - url: "https://www.thousandeyes.com/blog/dyn-dns-ddos-attack/"
    publisher: "ThousandEyes"
    publisherType: vendor
    reliability: R1
    publicationDate: "2016-10-21"
    accessDate: "2026-05-08"
    archived: false
  - url: "https://www.akamai.com/it/newsroom/press-release/akamai-releases-third-quarter-2016-state-of-the-internet-security-report1"
    publisher: "Akamai"
    publisherType: vendor
    reliability: R1
    publicationDate: "2016-11-15"
    accessDate: "2026-05-08"
    archived: false
mitreMappings:
  - techniqueId: T1498
    techniqueName: Network Denial of Service
    tactic: Impact
    notes: The attack used distributed traffic to disrupt Dyn's managed DNS infrastructure, making downstream customer services unreachable for many users.
---

## Summary

On October 21, 2016, a series of distributed denial-of-service attacks targeted Dyn, a managed DNS provider whose customers included multiple internet services. Because Dyn provided authoritative DNS service for many domains, disruption to Dyn's infrastructure made affected customer services difficult or impossible to reach for users in parts of North America and Europe.

The attack paired internet infrastructure dependence with an Internet-of-Things botnet. CISA had warned a week earlier that Mirai and similar IoT botnets could execute DDoS attacks after the Mirai source code was released publicly. ThousandEyes reported that Mirai-infected consumer devices were one source of the Dyn attack traffic, while noting that the exact target and complete traffic composition were not fully known from public evidence.

The incident did not involve public evidence of data theft from Dyn customers. Its impact was availability-focused: DNS resolution failures and packet loss made services intermittently unreachable. The event became a baseline case for IoT device hardening, DNS dependency risk, and the systemic effects of DDoS attacks against shared internet infrastructure.

## Technical Analysis

Dyn's role in the incident was authoritative DNS service. When users attempted to reach a customer domain and did not already have a fresh DNS answer cached, recursive resolvers needed to query Dyn-operated authoritative servers. If those servers were unavailable or unreachable, customer services could appear offline even when their application infrastructure remained operational.

ThousandEyes observed the disruption in multiple phases over roughly 18 hours. The first phase centered on the U.S. East Coast and expanded into other regions. A later phase produced global impact, with monitoring data showing that between 25 and 75 percent of queries to Dyn went unanswered in observed vantage points during parts of the event.

The botnet component came from Mirai and related IoT malware activity. CISA described Mirai as malware that scanned for vulnerable IoT devices and attempted access with a short list of common default usernames and passwords. Affected device classes included routers, cameras, and digital video recorders. Akamai's Q3 2016 reporting described Mirai as driving two high-volume DDoS attacks observed earlier in the quarter, showing that the same malware family had already reached high-volume attack capacity before the Dyn incident.

## Attack Chain

### Stage 1: IoT Device Compromise

Mirai scanned the internet for exposed IoT devices using default or weak credentials. CISA reported that Mirai used a short dictionary of common usernames and passwords and targeted device classes such as routers, network-enabled cameras, and digital video recorders.

### Stage 2: Botnet Assembly

Compromised devices enrolled into a botnet that could receive instructions from its operators. CISA warned that publication of Mirai source code created increased risk that additional actors could generate related botnets.

### Stage 3: DNS Infrastructure Targeting

On October 21, 2016, traffic was directed at Dyn's managed DNS infrastructure. ThousandEyes reported a series of DDoS attacks against Dyn over the course of the day, with Mirai-infected consumer devices identified as one source of attack traffic.

### Stage 4: Authoritative DNS Unavailability

The attack impaired Dyn's ability to answer DNS queries for customer domains. As cached DNS records expired or users made fresh lookups, affected services became unreachable for users whose resolvers could not obtain answers from Dyn.

### Stage 5: Mitigation and Recovery

Dyn and upstream network providers mitigated the attack in phases. ThousandEyes observed that most services were no longer affected after the main mitigation window, although some attack traffic and blackholing effects continued into the following morning.

## Impact Assessment

The incident disrupted access to internet services rather than compromising those services directly. ThousandEyes named affected Dyn customers and monitored services including Spotify, Amazon, HBO Now, Twitter, GitHub, Pinterest, CNN, and others, and observed more than 1,200 impacted domains in its monitored set during one hour of the outage.

The operational impact affected services across multiple sectors because DNS is a shared dependency. A DDoS attack against one managed DNS provider created cascading availability problems for unrelated customer services, including media, software development, social networking, commerce, and SaaS platforms. Users experienced service outages even when the downstream service providers' application stacks were not themselves the primary DDoS target.

The longer-term impact was the security lesson around unmanaged IoT devices. CISA's guidance emphasized replacing default passwords, disabling unnecessary services such as UPnP, monitoring Telnet-related activity, and applying vendor updates. The incident also reinforced the need for DNS redundancy, DDoS mitigation planning, and dependency mapping for internet-facing services.

## Attribution

Public sources do not establish a confirmed actor responsible for launching the Dyn DDoS attack. The attack used Mirai-infected devices, but public reporting did not identify the operator that directed the traffic at Dyn.

The U.S. Department of Justice later announced guilty pleas from Paras Jha, Josiah White, and Dalton Norman for creating and operating Mirai and related botnets. DOJ stated that the original Mirai botnet targeted IoT devices, reached hundreds of thousands of compromised devices at peak, and was used to conduct DDoS attacks before Jha posted Mirai source code on an underground forum in September 2016.

That DOJ case supports attribution for the creation and operation of the original Mirai botnet. It does not, by itself, establish that those defendants launched the Dyn attack. The specific Dyn incident actor remains unknown, though Mirai is identified as the malware and botnet family involved.

## Timeline

### 2016-09 — Mirai Source Code Published

After high-volume Mirai-driven DDoS activity earlier in 2016, Mirai source code was posted publicly, allowing other actors to build or modify related IoT botnets.

### 2016-10-14 — CISA Issues Mirai DDoS Alert

CISA published Alert TA16-288A warning that Mirai and other IoT botnets could execute DDoS attacks and recommending hardening steps for exposed IoT devices.

### 2016-10-21 — Dyn DNS Infrastructure Attacked

Dyn experienced multiple DDoS waves against its managed DNS infrastructure. ThousandEyes observed regional and global availability effects across affected customer domains.

### 2016-11-15 — Akamai Publishes Q3 Mirai Context

Akamai reported that two of the largest DDoS attacks it observed in Q3 2016 used the Mirai botnet and described Mirai as a marker of the growing DDoS risk from internet-connected devices.

### 2017-12-13 — DOJ Announces Mirai Guilty Pleas

The U.S. Department of Justice announced guilty pleas from three defendants for creating and operating Mirai and related botnets that infected hundreds of thousands of IoT devices.

## Remediation & Mitigation

CISA's immediate IoT remediation guidance focused on removing Mirai from infected devices by disconnecting them, rebooting to clear memory-resident malware, changing default passwords before reconnecting, and applying vendor security updates where available.

Preventive controls include eliminating default credentials, disabling unnecessary exposure such as UPnP, monitoring Telnet-related traffic on ports 23/TCP and 2323/TCP, and watching for outbound traffic patterns associated with botnet registration or command-and-control activity. Organizations operating DNS or other internet infrastructure should also maintain DDoS mitigation capacity, upstream coordination paths, and tested incident-response procedures.

For service operators, the Dyn incident remains a dependency-risk case. DNS providers, CDNs, and other shared infrastructure should be included in availability modeling. Customers should understand DNS failover behavior, authoritative-provider concentration, TTL choices, and the operational impact of a provider outage on user-facing availability.

## Sources & References

- [CISA: Heightened DDoS Threat Posed by Mirai and Other Botnets](https://www.cisa.gov/news-events/alerts/2016/10/14/heightened-ddos-threat-posed-mirai-and-other-botnets) — CISA, 2016-10-14
- [U.S. Department of Justice: Justice Department Announces Charges and Guilty Pleas in Three Computer Crime Cases Involving Significant DDoS Attacks](https://www.justice.gov/archives/opa/pr/justice-department-announces-charges-and-guilty-pleas-three-computer-crime-cases-involving) — U.S. Department of Justice, 2017-12-13
- [ThousandEyes: The DDoS Attack on Dyn's DNS Infrastructure](https://www.thousandeyes.com/blog/dyn-dns-ddos-attack/) — ThousandEyes, 2016-10-21
- [Akamai: Akamai Releases Third Quarter 2016 State of the Internet / Security Report](https://www.akamai.com/it/newsroom/press-release/akamai-releases-third-quarter-2016-state-of-the-internet-security-report1) — Akamai, 2016-11-15
