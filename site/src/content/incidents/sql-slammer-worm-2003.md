---
eventId: TP-2003-0001
title: SQL Slammer Worm Outbreak
date: 2003-01-25
attackType: Network Worm
severity: critical
sector: Cross-Sector
geography: Global
threatActor: Unknown
attributionConfidence: A4
reviewStatus: draft_ai
confidenceGrade: A
generatedBy: kernel-k
generatedDate: 2026-04-30
cves:
  - CVE-CAN-2002-0649
  - CVE-CAN-2002-0650
relatedSlugs: []
tags:
  - sql-slammer
  - sapphire
  - sql-server
  - msde
  - udp-1434
  - worm
  - random-scanning
  - network-congestion
sources:
  - url: https://www.caida.org/catalog/papers/2003_sapphire2/sapphire
    publisher: CAIDA
    publisherType: research
    reliability: R1
    publicationDate: "2021-12-15"
    accessDate: "2026-04-30"
    archived: false
  - url: https://news.microsoft.com/2003/01/25/microsoft-statement-on-the-slammer-worm-attack/
    publisher: Microsoft
    publisherType: vendor
    reliability: R1
    publicationDate: "2003-01-25"
    accessDate: "2026-04-30"
    archived: false
  - url: https://learn.microsoft.com/en-us/security-updates/securitybulletins/2002/ms02-039
    publisher: Microsoft
    publisherType: vendor
    reliability: R1
    publicationDate: "2002-07-24"
    accessDate: "2026-04-30"
    archived: false
  - url: https://www.nsf.gov/news/network-telescope-offers-global-view-internets
    publisher: U.S. National Science Foundation
    publisherType: government
    reliability: R1
    publicationDate: "2004-10-13"
    accessDate: "2026-04-30"
    archived: false
mitreMappings:
  - techniqueId: T1210
    techniqueName: "Exploitation of Remote Services"
    tactic: Lateral Movement
    notes: SQL Slammer propagated by exploiting the SQL Server Resolution Service on UDP port 1434.
  - techniqueId: T1046
    techniqueName: "Network Service Discovery"
    tactic: Discovery
    notes: The worm used random scanning to find additional reachable SQL Server and MSDE systems.
  - techniqueId: T1498
    techniqueName: "Network Denial of Service"
    tactic: Impact
    notes: The worm's scan traffic saturated links and disrupted network-dependent services worldwide.
---

## Summary

The SQL Slammer worm outbreak began shortly before 05:30 UTC on January 25, 2003. Also referred to as Sapphire, the worm targeted Microsoft SQL Server 2000 and Microsoft Desktop Engine 2000 systems by exploiting the SQL Server Resolution Service on UDP port 1434.

CAIDA described Slammer as the fastest computer worm observed at the time. It doubled in size every 8.5 seconds during its earliest spread, reached an aggregate scanning rate of more than 55 million scans per second in under three minutes, and infected more than 90 percent of vulnerable hosts within 10 minutes.

The worm did not carry a destructive payload aimed at corrupting stored data. Its harm came from propagation speed and traffic volume. Microsoft stated that there was no data corruption on affected customer systems, while CAIDA and the NSF both described extensive business and network disruption caused by congestion, service outages, and overloaded links.

## Technical Analysis

Microsoft's MS02-039 bulletin states that SQL Server 2000 and MSDE 2000 exposed the SQL Server Resolution Service on UDP port 1434 to help clients locate instance-specific endpoints. The bulletin described unchecked buffers in Resolution Service functions that allowed a carefully crafted packet to overwrite memory and potentially execute code in the SQL Server service context.

CAIDA reported that Slammer used a single 376-byte worm body carried in a single 404-byte UDP packet with headers. Because exploitation required only a single packet to UDP port 1434 and no response from the target, the worm was limited by available bandwidth rather than by connection latency.

That design made propagation unusually fast. CAIDA contrasted Slammer with Code Red, which used threaded TCP connections and therefore spread far more slowly. Once a host was compromised, Slammer generated random destination addresses and immediately resumed scanning for additional vulnerable systems.

Microsoft's January 25, 2003 statement said the exploited vulnerability had already been addressed by a July 2002 patch and later cumulative updates, most recently in October 2002, and that Microsoft had re-released the latest patch in a form intended to simplify deployment. The worm therefore spread through systems that remained unpatched months after the fix was available.

## Attack Chain

### Stage 1: Exposure of Vulnerable SQL Services

Internet-reachable systems running Microsoft SQL Server 2000 or MSDE 2000 exposed the SQL Server Resolution Service on UDP port 1434. MS02-039 identified that service as the component containing the relevant buffer overrun weaknesses.

### Stage 2: Single-Packet Remote Exploitation

The worm sent a crafted UDP packet to port 1434. According to Microsoft's bulletin, such a packet could overwrite memory in the Resolution Service and allow code execution in the SQL Server service context.

### Stage 3: In-Memory Worm Execution

After compromise, Slammer executed from memory and immediately began scanning for more targets. CAIDA reported that the worm body was only 376 bytes, allowing high transmission speed and low overhead.

### Stage 4: Random Scanning Propagation

Each infected system generated random IP targets and sent exploit traffic without waiting for replies. CAIDA reported that the worm reached more than 55 million scans per second across the Internet in under three minutes.

### Stage 5: Network Saturation and Service Disruption

As scan traffic multiplied, local links and upstream providers absorbed large volumes of UDP traffic. CAIDA reported network outages and backbone disruption, while Microsoft acknowledged widespread business disruption and advised immediate defensive action.

## Impact Assessment

CAIDA reported that Slammer infected at least 75,000 hosts and likely more. The NSF later summarized the same event as a 10-minute infection of at least 75,000 computers, representing roughly 90 percent of vulnerable systems.

The effects were operational and cross-sector. CAIDA reported canceled airline flights, ATM failures, election interference, and loss of connectivity at many sites whose access bandwidth was saturated by worm traffic. Microsoft described a dramatic increase in worldwide network traffic and business disruption across affected customers.

Even though the worm did not aim to destroy files, it took database services and network-dependent operations out of service. CAIDA emphasized that the incident demonstrated how severe the outcome could be even without a destructive payload, and warned that a similar worm against a more common service or broader vulnerability would likely be worse.

## Attribution

The available sources in this task describe the propagation mechanism, affected software, operational impact, and vendor response. They do not provide a confirmed author or government attribution.

Microsoft characterized the release of the worm as a criminal act and stated that it was working with law enforcement authorities. On the current source record, the appropriate attribution remains unknown.

## Timeline

### 2002-07-24 — Microsoft Publishes MS02-039

Microsoft published security bulletin MS02-039 for SQL Server 2000 and MSDE 2000, warning that buffer overruns in the SQL Server Resolution Service could enable code execution and recommending immediate patching.

### 2003-01-25 — Slammer Outbreak Begins

CAIDA reported that Slammer began infecting hosts shortly before 05:30 UTC on Saturday, January 25, 2003.

### 2003-01-25 — Microsoft Issues Public Statement

Microsoft stated that it had become aware of the attack the evening of January 24 Pacific Time, confirmed that the exploited vulnerability was already known and patched, and began publishing defensive guidance and support information.

### 2003-01-25 — Global Scan Rate Peaks Within Minutes

CAIDA reported that Slammer achieved more than 55 million scans per second across the Internet in under three minutes and infected most vulnerable hosts within 10 minutes.

### 2004-10-13 — NSF Highlights Patch-Management Lessons

The U.S. National Science Foundation summarized Slammer as one of the incidents showing that vendors had released patches but thousands of systems still remained exposed.

## Remediation & Mitigation

Microsoft's guidance was direct: install the SQL Server patch immediately. MS02-039 also noted that blocking UDP port 1434 at firewalls could reduce exposure where that service was not required.

CAIDA observed that many networks began filtering UDP traffic to port 1434 within an hour, which helped reduce unnecessary bandwidth consumption from infected hosts. It also stressed that filtering after the outbreak began did not meaningfully slow the initial spread because the worm had already infected most susceptible systems by then.

The durable mitigation lessons are patch deployment discipline, service minimization, and network exposure control. Systems that did not require Internet-reachable SQL discovery traffic should not have exposed UDP 1434, and systems running vulnerable SQL components should have received the July 2002 patch or later cumulative updates well before the January 2003 outbreak.

## Sources & References

- [CAIDA: The Spread of the Sapphire/Slammer Worm](https://www.caida.org/catalog/papers/2003_sapphire2/sapphire) — CAIDA, 2021-12-15
- [Microsoft: Microsoft Statement on the "Slammer" Worm Attack](https://news.microsoft.com/2003/01/25/microsoft-statement-on-the-slammer-worm-attack/) — Microsoft, 2003-01-25
- [Microsoft: Security Bulletin MS02-039 - Critical](https://learn.microsoft.com/en-us/security-updates/securitybulletins/2002/ms02-039) — Microsoft, 2002-07-24
- [U.S. National Science Foundation: Network Telescope Offers Global View of Internet's Dark Side](https://www.nsf.gov/news/network-telescope-offers-global-view-internets) — U.S. National Science Foundation, 2004-10-13
