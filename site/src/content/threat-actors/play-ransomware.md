---
name: "Play Ransomware"
aliases:
  - "PLAY"
  - "Playcrypt"
affiliation: "Unknown"
motivation: "Financial"
status: "active"
firstSeen: "2022"
lastSeen: "2026-03"
country: "Unknown"
targetSectors:
  - "Government"
  - "Healthcare"
  - "Education"
  - "Financial"
targetGeographies:
  - "North America"
  - "South America"
  - "Europe"
tools:
  - "Play Ransomware"
  - "Cobalt Strike"
  - "SystemBC"
  - "Mimikatz"
attributionConfidence: "A2"
attributionRationale: "Assessed by CISA and the FBI as a distinct financial syndicate using a custom encryption algorithm and distinctive double-extortion tactics against critical infrastructure."
reviewStatus: "under_review"
generatedBy: "penfold-bot"
generatedDate: 2026-04-14
tags:
  - "financially-motivated"
  - "cybercrime"
  - "ransomware"
sources:
  - url: "https://www.cisa.gov/news-events/cybersecurity-advisories/aa23-352a"
    publisher: "CISA"
    publisherType: "government"
    reliability: "R1"
    publicationDate: "2023-12-18"
    accessDate: "2026-04-14"
    archived: false
  - url: "https://www.trendmicro.com/vinfo/us/security/news/ransomware-spotlight/ransomware-spotlight-play"
    publisher: "Trend Micro"
    publisherType: "vendor"
    reliability: "R1"
    publicationDate: "2023-09-08"
    accessDate: "2026-04-14"
    archived: false
---

## Executive Summary
Play Ransomware (also known as PLAY or Playcrypt) is a highly active ransomware group that emerged in the summer of 2022. Unlike many major ransomware enterprises that operate strict Ransomware-as-a-Service (RaaS) affiliate programs, Play appears to operate as a tightly knit, closed syndicate. The group is notorious for targeting a wide range of industries, particularly state and local governments, healthcare, and educational institutions across the Americas and Europe. They are known for utilizing the double-extortion tactic (stealing data prior to encryption) and leaving incredibly sparse, text-only ransom notes simply containing the word "PLAY" and a dark web contact address.

## Notable Campaigns
- **Rackspace Hosted Exchange Disruption:** In late 2022, Play exploited a zero-day vulnerability in Microsoft Exchange (the ProxyNotShell exploit chain) to severely compromise the Rackspace Hosted Exchange environment, causing massive disruption to downstream customers.
- **City of Oakland Ransomware Attack:** Deployed ransomware across the network of the City of Oakland, California, causing a state of emergency to be declared as IT systems and non-emergency services were severely impacted.
- **Widespread Exploitation Operations:** The group has maintained an incredibly high operational tempo, frequently ranking among the top five most active ransomware groups globally by volume of victims posted to its leak site.

## Technical Capabilities
Play Ransomware heavily favors exploiting known vulnerabilities in internet-facing infrastructure for initial access—specifically widely used enterprise VPNs (like Fortinet) and Microsoft Exchange servers (ProxyNotShell). They actively avoid phishing campaigns. Once inside, they extensively use "Living off the Land" (LOTL) techniques combined with standard offensive security tools, such as **Cobalt Strike**, **SystemBC** (for proxying C2 traffic), and **Mimikatz** (for credential dumping). Their custom ransomware payload is highly obfuscated, utilizes intermittent encryption for speed, and appends the `.play` extension to encrypted files.

## Attribution
Play Ransomware is assessed to be a financially motivated cybercriminal syndicate. There are no definitive ties to state-sponsored actors. The code structure, tooling, and infrastructure management of Play heavily mirror those of the now-defunct Hive and Nokoyawa ransomware families, leading many threat intelligence analysts to assess that Play was formed by former core members or developers of those operations.

## Sources & References
- CISA #StopRansomware Advisory: Play Ransomware
- Trend Micro Threat Profile: Play Ransomware
