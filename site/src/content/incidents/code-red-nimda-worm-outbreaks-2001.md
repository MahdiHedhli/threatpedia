---
eventId: TP-2001-0001
title: Code Red and Nimda Worm Outbreaks
date: 2001-07-12
attackType: Internet Worm
severity: high
sector: Cross-Sector
geography: Global
threatActor: Unknown
attributionConfidence: A4
reviewStatus: draft_ai
confidenceGrade: A
generatedBy: kernel-k
generatedDate: 2026-04-30
cves: []
relatedSlugs:
  - iloveyou-worm-outbreak-2000
tags:
  - code-red
  - nimda
  - internet-worm
  - iis
  - windows
  - web-server
  - denial-of-service
  - email-worm
  - caida
  - cert-cc
sources:
  - url: https://www.caida.org/archive/code-red/
    publisher: CAIDA
    publisherType: research
    reliability: R1
    publicationDate: "2001-07-24"
    accessDate: "2026-04-30"
    archived: false
  - url: https://news.microsoft.com/2001/07/30/government-and-industry-groups-warn-code-red-internet-worm-ready-for-serious-strike-urge-preventative-measures/
    publisher: Microsoft
    publisherType: vendor
    reliability: R2
    publicationDate: "2001-07-30"
    accessDate: "2026-04-30"
    archived: false
  - url: https://www.sei.cmu.edu/documents/508/2001_019_001_496192.pdf
    publisher: Carnegie Mellon Software Engineering Institute
    publisherType: research
    reliability: R1
    publicationDate: "2001-12-31"
    accessDate: "2026-04-30"
    archived: false
  - url: https://georgewbush-whitehouse.archives.gov/pcipb/
    publisher: The White House
    publisherType: government
    reliability: R1
    publicationDate: "2003-02-01"
    accessDate: "2026-04-30"
    archived: false
mitreMappings:
  - techniqueId: T1190
    techniqueName: Exploit Public-Facing Application
    tactic: Initial Access
    notes: Code Red exploited a Microsoft IIS Indexing Service buffer overflow, and Nimda exploited IIS directory traversal vulnerabilities and earlier web-server backdoors.
  - techniqueId: T1566.001
    techniqueName: "Phishing: Spearphishing Attachment"
    tactic: Initial Access
    notes: CERT/CC reported that Nimda propagated by email with a MIME message carrying an executable attachment named readme.exe.
  - techniqueId: T1498
    techniqueName: Network Denial of Service
    tactic: Impact
    notes: Code Red generated worm traffic and a timed denial-of-service phase, while CERT/CC reported denial-of-service effects from Nimda scanning and email propagation.
---

## Summary

The Code Red and Nimda worm outbreaks were a sequence of Internet-scale malware events in 2001 that targeted Microsoft IIS and Windows environments. Code Red began infecting unpatched IIS servers in July 2001, with later Code Red variants and Code Red II continuing to exploit the same IIS Indexing Service vulnerability. Nimda appeared in September 2001 and combined email, network-share, compromised-web-site, and IIS exploitation paths.

CAIDA measured Code Red version 2 infecting more than 359,000 machines in less than 14 hours on July 19, 2001. Microsoft's July 30, 2001 joint government-industry warning said Code Red had infected more than 350,000 systems between July 12 and July 19 and slowed Internet performance by 40% on July 19. CERT/CC later described Nimda as a multi-vector worm affecting Windows clients and servers through email, open network shares, compromised websites, IIS directory traversal exploitation, and backdoors left by earlier worms.

The outbreaks were not a single malware family. Code Red, Code Red II, and Nimda used different code and propagation logic, but together they marked an early period when unpatched web servers, email clients, and exposed Windows services allowed worms to create global operational disruption within hours.

## Technical Analysis

Code Red exploited Microsoft IIS systems susceptible to the IIS Indexing Service buffer overflow described in CERT advisory CA-2001-13. CAIDA reported that the first Code Red incarnation began infecting hosts on July 12, 2001 and used a static seed for random address generation. A July 19 variant used a random seed and spread faster because each infected host probed a different set of addresses.

The worm's behavior varied by version. CAIDA reported that Code Red version 1 and version 2 were memory-resident and could be removed by rebooting, though unpatched systems could be reinfected. Code Red version 1 could deface pages on English-language systems and had a timed denial-of-service phase targeting `www1.whitehouse.gov`. Code Red II appeared on August 4, 2001, used the same IIS vulnerability, and installed a backdoor that allowed remote root-level access on infected systems.

Nimda broadened the propagation model. CERT/CC reported that Nimda spread by email, open network shares, browsing compromised websites, active scanning for IIS directory traversal vulnerabilities, and scanning for backdoors left by Code Red II and sadmind/IIS. CERT/CC also reported that Nimda modified web documents and executable files and created many copies of itself under different names.

The shared technical lesson was patch latency. Microsoft's joint warning said the Code Red worm exploited a flaw discovered in June 2001 and that Microsoft had already published a remedy. CERT/CC's Nimda advisory linked Nimda's IIS exploitation to known vulnerabilities and earlier backdoors. The outbreaks showed how exposed services and already-patched vulnerabilities could still drive global compromise when vulnerable systems remained online.

## Attack Chain

### Stage 1: Vulnerable IIS Exposure

Code Red scanned TCP port 80 and attempted to exploit IIS hosts vulnerable to the Indexing Service buffer overflow. Nimda also targeted IIS servers, including systems vulnerable to directory traversal and systems already carrying backdoors from earlier worms.

### Stage 2: Automated Exploitation

Code Red sent crafted HTTP requests to trigger the IIS vulnerability. Nimda used multiple delivery paths, including active web-server scanning and email delivery of an executable attachment.

### Stage 3: Worm Execution and Local Changes

Code Red executed in memory on vulnerable IIS systems and could deface web pages depending on host language and variant. Code Red II installed a backdoor. Nimda modified web documents and executable files and created copies of itself under multiple names.

### Stage 4: Self-Propagation

Infected systems scanned for additional targets. CAIDA reported that the July 19 Code Red variant used randomized address generation and reached peak infection rates above 2,000 new hosts per minute. Nimda propagated through email, file shares, compromised websites, IIS exploitation, and existing backdoors.

### Stage 5: Network and Service Impact

Scanning, email propagation, web defacement, and backdoor installation created operational disruption. Microsoft reported Internet slowdown during Code Red, and CERT/CC reported denial-of-service effects from Nimda network scanning and email propagation.

## Impact Assessment

Code Red's measured spread was rapid. CAIDA reported more than 359,000 infected machines in less than 14 hours on July 19, 2001. It also reported that 43% of infected hosts were in the United States, followed by Korea, China, and Taiwan, and that infected hosts included `.MIL` and `.GOV` systems.

Microsoft's July 30 warning framed Code Red as an Internet-infrastructure risk rather than only a web-server incident. The warning said the worm could slow Internet use for businesses and home users, that the flooding of probes could make transactions fail, and that some sites could become unreachable as networks or routers were overwhelmed.

Nimda created a different kind of scale problem by combining client and server propagation. CERT/CC reported that Nimda affected Windows 95, 98, ME, NT, and 2000 clients and Windows NT and 2000 servers. Its ability to move through email, open shares, compromised websites, vulnerable IIS servers, and earlier worm backdoors made cleanup and containment broader than a single patch action on web servers.

The combined event showed that Internet worms could move faster than many enterprise patch cycles. Systems for alerting, patch deployment, perimeter filtering, email attachment handling, and exposed-service inventory became central lessons from the 2001 outbreak sequence. The White House's later National Strategy to Secure Cyberspace framed national cyber defense as a coordinated effort across federal, state, local, private-sector, and individual participants.

## Attribution

The sources used here do not identify a confirmed author or sponsor for Code Red, Code Red II, or Nimda. CAIDA noted that Code Red defaced some pages with the phrase "Hacked by Chinese," but also stated that there was no evidence supporting or refuting the involvement of Chinese hackers with Code Red.

The available record supports unknown authorship. It does not support state attribution, organized-crime attribution, or a named individual actor.

## Timeline

### 2001-06-18 — IIS Indexing Service Vulnerability Disclosed

CAIDA reported that eEye released information on June 18, 2001 about the IIS `.ida` buffer-overflow vulnerability later used by Code Red.

### 2001-07-12 — Code Red Version 1 Begins Spreading

CAIDA reported that the first Code Red incarnation began infecting unpatched IIS web servers on July 12, 2001.

### 2001-07-19 — Code Red Version 2 Rapid Spread

CAIDA reported that a random-seed variant appeared around 10:00 UTC on July 19 and infected more than 359,000 machines in less than 14 hours.

### 2001-07-30 — Joint Code Red Warning

Microsoft published a joint government-industry warning urging IIS operators to take preventative action before the worm's next propagation window.

### 2001-08-04 — Code Red II Appears

CAIDA reported that Code Red II began exploiting the same IIS vulnerability on August 4, 2001 and installed a backdoor on infected systems.

### 2001-09-18 — CERT/CC Issues Nimda Advisory

CERT/CC issued CA-2001-26 for the Nimda worm, describing its email, network-share, compromised-web-site, IIS exploitation, and backdoor-scanning propagation mechanisms.

## Remediation & Mitigation

The immediate Code Red mitigation was to patch IIS systems vulnerable to the Indexing Service buffer overflow and remove infections from compromised hosts. Microsoft's joint warning emphasized that there was no master switch for Code Red and that affected IIS operators needed to apply the published remedy.

CERT/CC's Nimda guidance centered on patching vulnerable systems, filtering hostile traffic where feasible, updating anti-virus tools, disabling unnecessary services, and removing both the worm and backdoors left by previous malware. Because Nimda used email, file shares, web browsing, IIS exploitation, and existing backdoors, mitigation required endpoint, server, and network controls together.

Modern controls for similar outbreaks include exposed-service inventory, emergency patch deployment, attachment and script filtering, egress controls for worm scanning, web-server hardening, and detection for rapid scanning from internal hosts. The 2001 sequence also supports separating eradication from vulnerability removal: rebooting or deleting worm files is insufficient when the original exposed vulnerability remains reachable.

## Sources & References

- [CAIDA: CAIDA Analysis of Code-Red](https://www.caida.org/archive/code-red/) — CAIDA, 2001-07-24
- [Microsoft: Government and Industry Groups Warn "Code Red" Internet Worm Ready for Serious Strike; Urge Preventative Measures](https://news.microsoft.com/2001/07/30/government-and-industry-groups-warn-code-red-internet-worm-ready-for-serious-strike-urge-preventative-measures/) — Microsoft, 2001-07-30
- [Carnegie Mellon Software Engineering Institute: 2001 CERT Advisories](https://www.sei.cmu.edu/documents/508/2001_019_001_496192.pdf) — Carnegie Mellon Software Engineering Institute, 2001-12-31
- [The White House: The National Strategy to Secure Cyberspace](https://georgewbush-whitehouse.archives.gov/pcipb/) — The White House, 2003-02-01
