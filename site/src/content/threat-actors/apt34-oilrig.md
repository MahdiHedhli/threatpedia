---
name: "APT34 / OilRig"
aliases:
  - "APT34"
  - "OilRig"
  - "Helix Kitten"
  - "Hazel Sandstorm"
  - "EUROPIUM"
  - "ITG13"
  - "Earth Simnavaz"
  - "Crambus"
  - "TA452"
affiliation: "Iran (suspected)"
motivation: "Espionage"
status: active
country: "Iran"
firstSeen: "2014"
targetSectors:
  - "Government"
  - "Financial"
  - "Energy"
  - "Chemical"
  - "Telecommunications"
targetGeographies:
  - "Middle East"
  - "United States"
  - "Europe"
tools:
  - "POWRUNER"
  - "POWERSTATS"
mitreMappings:
  - techniqueId: "T1566.001"
    techniqueName: "Spearphishing Attachment"
    tactic: "Initial Access"
    attack-version: "v19"
    confidence: "confirmed"
    evidence: "Mandiant reported APT34 delivering malicious Microsoft Office documents via spearphishing as a primary initial access vector in Middle East targeting operations."
    notes: "Mandiant documented spearphishing with malicious Office documents exploiting CVE-2017-11882 in APT34 intrusion chains."
  - techniqueId: "T1059.001"
    techniqueName: "PowerShell"
    tactic: "Execution"
    attack-version: "v19"
    confidence: "confirmed"
    evidence: "Mandiant describes POWRUNER and POWERSTATS as custom PowerShell-based implants central to the APT34 delivery and C2 chain."
    notes: "Custom PowerShell implants POWRUNER and POWERSTATS are documented by Mandiant as core components of APT34 intrusion activity."
  - techniqueId: "T1071.001"
    techniqueName: "Web Protocols"
    tactic: "Command and Control"
    attack-version: "v19"
    confidence: "probable"
    evidence: "MITRE ATT&CK documents APT34/OilRig tooling using HTTP-based communications for command-and-control."
    notes: "APT34 malware families documented by MITRE use HTTP and HTTPS channels for operator C2 communications."
  - techniqueId: "T1105"
    techniqueName: "Ingress Tool Transfer"
    tactic: "Command and Control"
    attack-version: "v19"
    confidence: "probable"
    evidence: "MITRE ATT&CK documents transfer of additional payloads and tooling to compromised systems as part of APT34/OilRig post-compromise activity."
    notes: "Post-compromise staging and transfer of additional tools is documented by MITRE as part of APT34 operational tradecraft."
atlasMappings: []
attributionConfidence: A3
attributionRationale: "MITRE ATT&CK (G0049) describes APT34/OilRig as a suspected Iranian threat group active since at least 2014, and Mandiant assesses APT34 as a suspected Iranian threat group targeting entities in the Middle East and internationally. No formal government indictment or specific unit designation for APT34/OilRig has been publicly reported."
reviewStatus: "draft_ai"
generatedBy: "dangermouse-bot"
generatedDate: 2026-05-13
tags:
  - "nation-state"
  - "iran"
  - "espionage"
  - "apt34"
  - "oilrig"
  - "middle-east"
  - "energy"
  - "government"
sources:
  - url: "https://attack.mitre.org/groups/G0049/"
    publisher: "MITRE ATT&CK"
    publicationDate: "2026-05-12"
    publisherType: research
    reliability: R1
    accessDate: "2026-05-13"
    archived: false
  - url: "https://cloud.google.com/blog/topics/threat-intelligence/targeted-attack-in-middle-east-by-apt34/"
    publisher: "Mandiant"
    publicationDate: "2018-01-10"
    publisherType: vendor
    reliability: R1
    accessDate: "2026-05-13"
    archived: false
  - url: "https://www.cisa.gov/topics/cyber-threats-and-advisories/nation-state-cyber-actors"
    publisher: "CISA"
    publicationDate: "2026-05-13"
    publisherType: government
    reliability: R1
    accessDate: "2026-05-13"
    archived: false
---

## Executive Summary

APT34 (also tracked as OilRig) is a suspected Iranian threat group that MITRE ATT&CK assesses as active since at least 2014. The group targets organizations in the Middle East and internationally, with documented victim sectors including government, financial, energy, chemical, and telecommunications. MITRE notes the group appears to carry out supply-chain attacks leveraging organizational trust relationships.

APT34 and OilRig were previously tracked as separate activity sets by different vendors. MITRE ATT&CK combined them following reporting that gave higher confidence about the overlap between the two clusters. The group is tracked under multiple designations across the security research community, reflecting independent vendor analysis of overlapping intrusion activity.

## Notable Campaigns

### 2017–2018 — Middle East Targeted Intrusions

Mandiant documented targeted attack activity against Middle Eastern organizations attributed to APT34. The reported delivery chain used spearphishing emails containing malicious Microsoft Office documents exploiting CVE-2017-11882, a Microsoft Office memory corruption vulnerability. The intrusion chain incorporated POWRUNER and POWERSTATS, custom PowerShell-based implants used for command-and-control and post-compromise operations.

## Technical Capabilities

APT34 has used custom PowerShell-based implant tooling across documented intrusion chains. Mandiant reported the POWRUNER and POWERSTATS malware families as part of the group's delivery chain in Middle East targeting operations. These tools used PowerShell for execution and HTTP-based channels for command-and-control communications.

MITRE ATT&CK documents APT34 using spearphishing attachments as a primary initial access vector, typically leveraging malicious Microsoft Office documents. The group is reported to conduct supply-chain attacks that exploit organizational trust relationships to gain footholds in target environments, per MITRE's assessment.

## Attribution

MITRE ATT&CK categorizes this group as G0049 and describes it as a suspected Iranian threat group. Mandiant has assessed APT34 as a suspected Iranian threat group targeting entities in the Middle East and internationally, with victim profiles consistent with state intelligence collection priorities.

MITRE ATT&CK lists aliases including Hazel Sandstorm and EUROPIUM for G0049. Cross-vendor naming conventions can reflect overlapping but potentially distinct intrusion sets.

MITRE and Mandiant independently assess Iranian state affiliation based on targeting patterns, tooling, and operational focus. No formal government indictment or specific Iranian government unit designation for APT34/OilRig has been publicly issued.

## MITRE ATT&CK Profile

APT34 employs a range of techniques documented across MITRE ATT&CK v19.

**Initial Access**: Spearphishing with malicious attachments (T1566.001) is the primary documented delivery method, with Mandiant reporting use of Office document exploits including CVE-2017-11882 against Middle Eastern targets.

**Execution**: Custom PowerShell implants (T1059.001), specifically POWRUNER and POWERSTATS, are core to documented APT34 intrusion chains per Mandiant reporting, providing payload execution and C2 interaction.

**Command and Control**: Web protocol-based C2 (T1071.001) over HTTP and HTTPS is documented in APT34 malware tooling per MITRE. Ingress tool transfer (T1105) is documented for staging additional payloads following initial compromise.

## Sources & References

- [MITRE ATT&CK: APT34/OilRig (G0049)](https://attack.mitre.org/groups/G0049/) — MITRE ATT&CK, 2026-05-12
- [Mandiant: Targeted Attack in Middle East by APT34](https://cloud.google.com/blog/topics/threat-intelligence/targeted-attack-in-middle-east-by-apt34/) — Mandiant, 2018-01-10
- [CISA: Nation-State Cyber Actors](https://www.cisa.gov/topics/cyber-threats-and-advisories/nation-state-cyber-actors) — CISA, 2026-05-13
