---
eventId: TP-2008-0001
title: Conficker Worm
date: 2008-11-21
attackType: Network Worm
severity: high
sector: Cross-Sector
geography: Global
threatActor: Unknown
attributionConfidence: A4
reviewStatus: draft_ai
confidenceGrade: A
generatedBy: kernel-k
generatedDate: 2026-04-30
cves:
  - CVE-2008-4250
relatedSlugs: []
tags:
  - conficker
  - downadup
  - windows
  - ms08-067
  - cve-2008-4250
  - worm
  - botnet
  - removable-media
  - weak-passwords
  - domain-generation-algorithm
  - conficker-working-group
sources:
  - url: https://www.cisa.gov/news-events/alerts/2009/03/29/conficker-worm-targets-microsoft-windows-systems
    publisher: CISA
    publisherType: government
    reliability: R1
    publicationDate: "2009-03-29"
    accessDate: "2026-04-30"
    archived: false
  - url: https://news.microsoft.com/source/2009/02/12/microsoft-collaborates-with-industry-to-disrupt-conficker-worm/
    publisher: Microsoft
    publisherType: vendor
    reliability: R1
    publicationDate: "2009-02-12"
    accessDate: "2026-04-30"
    archived: false
  - url: https://www.icann.org/en/system/files/files/conficker-summary-review-07may10-en.pdf
    publisher: ICANN
    publisherType: research
    reliability: R1
    publicationDate: "2010-05-07"
    accessDate: "2026-04-30"
    archived: false
  - url: https://www.microsoft.com/en-us/wdsi/threats/malware-encyclopedia-description?Name=Win32%2FConficker
    publisher: Microsoft
    publisherType: vendor
    reliability: R1
    publicationDate: "2017-09-15"
    accessDate: "2026-04-30"
    archived: false
  - url: https://learn.microsoft.com/en-us/security-updates/securitybulletins/2008/ms08-067
    publisher: Microsoft
    publisherType: vendor
    reliability: R1
    publicationDate: "2008-10-23"
    accessDate: "2026-04-30"
    archived: false
mitreMappings:
  - techniqueId: T1210
    techniqueName: Exploitation of Remote Services
    tactic: Lateral Movement
    notes: Conficker exploited the Windows Server service vulnerability fixed in MS08-067 to infect reachable Windows systems over the network.
  - techniqueId: T1110
    techniqueName: Brute Force
    tactic: Credential Access
    notes: Microsoft documented Conficker variants spreading through network shares protected by weak or common administrator passwords.
  - techniqueId: T1091
    techniqueName: Replication Through Removable Media
    tactic: Lateral Movement
    notes: CISA and Microsoft documented Conficker spread through thumb drives, removable drives, and mapped drives.
  - techniqueId: T1105
    techniqueName: Ingress Tool Transfer
    tactic: Command and Control
    notes: Microsoft documented Conficker variants downloading files and using HTTP, generated domains, and peer-to-peer communications for updates.
---

## Summary

Conficker, also known as Downadup, was a Windows worm and botnet family first detected in November 2008. It spread by exploiting the Windows Server service vulnerability fixed in Microsoft Security Bulletin MS08-067, then expanded through weak administrator passwords, network shares, mapped drives, and removable media.

CISA described Conficker as an infection of Microsoft Windows systems and warned that unpatched network servers could be infected directly across a corporate network. Microsoft Security Intelligence documented several variants, including Conficker.A, Conficker.B, Conficker.C, Conficker.D, and Conficker.E, with later variants adding weak-password propagation, removable-drive propagation, peer-to-peer update behavior, security-site blocking, and service disruption.

Conficker became an operational case study because the response required coordination across vendors, researchers, ICANN, DNS operators, registries, registrars, and law enforcement. Microsoft's February 2009 announcement described a coordinated global response intended to disable domains targeted by Conficker, while ICANN's later review focused on the nearly year-long containment effort around the worm's domain generation and command-and-control infrastructure.

## Technical Analysis

MS08-067 addressed a remote code execution vulnerability in the Windows Server service. Microsoft rated the issue critical for multiple supported Windows versions and described CVE-2008-4250 as a Server Service vulnerability. Conficker used that vulnerability as a network propagation path on systems where the patch had not been applied.

Microsoft Security Intelligence states that Conficker worms could disable Windows services and security products, download files, and run malicious code when file sharing was enabled. It also documented that some variants spread through removable drives and common passwords, and that Conficker.B used network shares with weak passwords, mapped and removable drives, and scheduled tasks to run worm copies on targeted computers.

Conficker also used DNS and update logic to make containment harder. ICANN's summary states that Conficker used algorithmically generated domain names rather than fixed IP addresses to make its attack networks more resilient against detection and takedown. Microsoft later described countermeasures based on understanding the domain-generation algorithm and proactively disabling or blocking domains that infected systems would try to contact.

## Attack Chain

### Stage 1: Unpatched Windows Exposure

Systems vulnerable to CVE-2008-4250 remained exposed after Microsoft published MS08-067 in October 2008. Conficker used the Windows Server service vulnerability to infect reachable Windows systems over the network.

### Stage 2: Network Worm Propagation

After infection, Conficker variants propagated across networks. CISA reported that the worm could infect systems from a thumb drive, a network share, or directly across a corporate network if network servers lacked the MS08-067 patch.

### Stage 3: Credential and Removable-Media Spread

Later variants added additional propagation paths. Microsoft documented spread through network shares with weak passwords, mapped drives, removable drives, and scheduled tasks that executed worm copies on targeted computers.

### Stage 4: Update and Command Infrastructure

The worm used generated domain names to look for updates and command infrastructure. ICANN's review describes containment measures such as sinkholing and preemptive registration of generated domains to prevent the malware operators from communicating with infected systems.

### Stage 5: Self-Defense and Payload Expansion

Microsoft documented that Conficker variants blocked access to many security-related websites, changed PC settings, stopped system and security services, and added peer-to-peer download behavior. CISA's April 2009 update warned that a newer variant updated earlier infections over a peer-to-peer network and attempted to download additional malicious code.

## Impact Assessment

Conficker affected home and enterprise networks globally. ICANN's review states that estimates of infected host populations varied, but all exceeded millions of personal computers. The same report states that infections were found in home networks, business networks, and large multinational enterprise networks.

The operational impact extended beyond host infection counts. Conficker interfered with security remediation by blocking security-related websites and stopping system or security services. It also forced defenders to coordinate across endpoint protection, patch management, network hygiene, DNS operations, registry operations, and law enforcement.

The response also became a DNS security case study. ICANN's review says the coordinated containment measures did not eradicate the worm or dismantle the botnet, but they disrupted command-and-control communications and forced Conficker operators to change behavior. The incident demonstrated that DNS, registry, registrar, vendor, and research communities could coordinate against malware that used generated domain names.

## Attribution

The public sources used here do not identify a confirmed author, sponsor, or organization behind Conficker. Microsoft characterized the worm as a criminal attack and offered a reward for information leading to the arrest and conviction of those responsible for launching the malware.

The sources support criminal intent and botnet operation, but they do not support state attribution or a named threat actor.

## Timeline

### 2008-10-23 — Microsoft Publishes MS08-067

Microsoft published Security Bulletin MS08-067 for CVE-2008-4250, a critical Windows Server service remote code execution vulnerability later used by Conficker.

### 2008-11-21 — Conficker.A Detected

Microsoft Security Intelligence lists the Conficker.A discovered date as November 21, 2008. This variant exploited the MS08-067 vulnerability and generated 250 URLs daily to check for updates.

### 2008-12-29 — Conficker.B Detected

Microsoft lists the Conficker.B discovered date as December 29, 2008. This variant added weak-password, mapped-drive, and removable-drive propagation and blocked access to many security-related websites.

### 2009-02-12 — Coordinated Industry Response Announced

Microsoft announced a partnership with technology companies, researchers, ICANN, and DNS operators to disrupt domains targeted by Conficker and offered a $250,000 reward for information leading to arrests and convictions.

### 2009-03-29 — CISA Issues Conficker Alert

CISA issued alert TA09-088A warning that Conficker targeted Microsoft Windows systems and could infect systems through thumb drives, network shares, or unpatched corporate networks.

### 2009-04-09 — CISA Updates Alert for New Variant

CISA reported that researchers had discovered a new Conficker variant that updated earlier infections over peer-to-peer communications, resumed scanning unpatched systems, and attempted to download additional malicious code.

### 2010-05-07 — ICANN Publishes Summary and Review

ICANN published its Conficker Summary and Review, documenting the worm's DNS-related behavior and the cross-sector containment effort.

## Remediation & Mitigation

CISA's immediate prevention guidance was to ensure all systems had the MS08-067 patch, disable AutoRun functionality, maintain current antivirus software, and avoid unsolicited links, messages, and untrusted downloads. Microsoft Security Intelligence similarly recommended applying MS08-067, applying the AutoPlay-related KB971029 update, and changing weak passwords.

Enterprise remediation required isolating infected systems, removing the worm with trusted tools, restoring disabled services, and preventing reinfection through patching and credential hygiene. Blocking security websites and disabling update services made it important to use offline or trusted cleanup paths when infected systems could not reach vendor sites.

At the infrastructure level, the Conficker response demonstrated the utility of coordinated domain blocking, sinkholing, and registry or registrar cooperation when malware relies on domain-generation algorithms. ICANN's review emphasized that those measures disrupted command communications even though they did not by themselves eradicate infections from endpoints.

## Sources & References

- [CISA: Conficker Worm Targets Microsoft Windows Systems](https://www.cisa.gov/news-events/alerts/2009/03/29/conficker-worm-targets-microsoft-windows-systems) — CISA, 2009-03-29
- [Microsoft: Microsoft Collaborates With Industry to Disrupt Conficker Worm](https://news.microsoft.com/source/2009/02/12/microsoft-collaborates-with-industry-to-disrupt-conficker-worm/) — Microsoft, 2009-02-12
- [ICANN: Conficker Summary and Review](https://www.icann.org/en/system/files/files/conficker-summary-review-07may10-en.pdf) — ICANN, 2010-05-07
- [Microsoft: Win32/Conficker Threat Description](https://www.microsoft.com/en-us/wdsi/threats/malware-encyclopedia-description?Name=Win32%2FConficker) — Microsoft, 2017-09-15
- [Microsoft: Security Bulletin MS08-067 - Critical](https://learn.microsoft.com/en-us/security-updates/securitybulletins/2008/ms08-067) — Microsoft, 2008-10-23
