---
name: "FIN12"
aliases:
  - "GOLD GALLANT"
affiliation: "Unknown"
motivation: "Financial"
status: "active"
firstSeen: "2015"
lastSeen: "2026-03"
country: "Unknown"
targetSectors:
  - "Healthcare"
  - "Education"
  - "Government"
targetGeographies:
  - "North America"
  - "Europe"
  - "Global"
knownTools:
  - "Cobalt Strike"
  - "Ryuk"
  - "Conti"
  - "Hive"
tags:
  - "financially-motivated"
  - "cybercrime"
  - "ransomware"
---

## Executive Summary
FIN12 (also tracked as GOLD GALLANT) is a hyper-aggressive, financially motivated threat actor active since at least 2015. Functioning primarily as an initial access broker and ransomware deployment specialist, FIN12 is highly distinctive in the cybercrime ecosystem for its ruthless targeting of the healthcare sector, showing a blatant disregard for patient safety in pursuit of financial extortion. Unlike affiliates who typically steal data for double-extortion (naming and shaming), FIN12 historically relies heavily on rapid, catastrophic deployment of ransomware across an entire enterprise to force immediate payment based purely on operational disruption.

## Notable Campaigns
- **Healthcare Ransomware Barrage (2019-2021):** FIN12 was a primary affiliate deploying the **Ryuk** ransomware against hundreds of hospitals and medical facilities across North America and Europe, causing systemic operational outages, diverting ambulances, and crippling patient care systems.
- **Conti and Hive Transitions:** Following the decline of Ryuk, FIN12 operators smoothly transitioned to deploying the increasingly aggressive **Conti** and **Hive** ransomware variants against similar critical infrastructure targets to maximize payout leverage.
- **Rapid Exploitation Operations:** FIN12 is notorious for its "time-to-ransom" (TTR) metrics. In some incidents, the group pivoted from initial network access to enterprise-wide ransomware deployment in fewer than three days.

## Technical Capabilities
FIN12 rarely conducts its own initial phishing campaigns. Instead, they operate as a highly specialized intrusion team that purchases access from other initial access brokers (IABs) who have already compromised a target via commodity loaders (like Trickbot, Emotet, or BazarLoader). Once FIN12 receives access, they act as rapid-deployment specialists. They rely almost exclusively on aggressive usage of **Cobalt Strike** and heavily customized PowerShell scripts to bypass endpoint detection, map the Active Directory domain, escalate to Domain Admin, and leverage legitimate management tools (like PsExec) for the mass automated distribution of their preferred ransomware payload.

## Attribution
Mandiant formally designated FIN12 as a distinct threat group due to its highly specialized role in the ransomware supply chain. While they operate using Russian-language forums and adhere to operational security practices common among CIS-based cybercriminals (such as avoiding domains within the former Soviet Union), they remain an independent syndicate. Their operations reflect a mature, business-like approach to cybercrime, utilizing contracted specialists for distinct phases of the infection lifecycle.

## Sources & References
- Mandiant Threat Research on FIN12
- MITRE ATT&CK Group G0147
