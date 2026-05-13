---
name: "APT35 / Charming Kitten"
aliases:
  - "APT35"
  - "Charming Kitten"
  - "Phosphorus"
  - "Newscaster"
  - "TA453"
  - "Mint Sandstorm"
  - "Yellow Garuda"
  - "ITG18"
affiliation: "Iran (assessed)"
motivation: "Espionage"
status: active
country: "Iran"
firstSeen: "2014"
targetSectors:
  - "Government"
  - "Defense"
  - "Media"
  - "Academia"
  - "Civil Society"
  - "Technology"
targetGeographies:
  - "United States"
  - "Middle East"
  - "Europe"
  - "Israel"
tools:
  - "HYPERSCRAPE"
  - "POWERSTAR"
mitreMappings:
  - techniqueId: "T1566.002"
    techniqueName: "Spearphishing Link"
    tactic: "Initial Access"
    attack-version: "v19"
    confidence: "confirmed"
    evidence: "MITRE ATT&CK documents APT35 using spearphishing links delivering credential-harvesting pages as a primary initial access technique."
    notes: "Phishing links pointing to attacker-controlled credential-harvesting infrastructure are a documented core technique per MITRE G0059."
  - techniqueId: "T1078"
    techniqueName: "Valid Accounts"
    tactic: "Defense Evasion"
    attack-version: "v19"
    confidence: "confirmed"
    evidence: "MITRE ATT&CK documents APT35 using compromised credentials following successful phishing to access target accounts and services."
    notes: "Use of harvested credentials to access victim email and cloud accounts is documented by MITRE for APT35."
  - techniqueId: "T1114.002"
    techniqueName: "Remote Email Collection"
    tactic: "Collection"
    attack-version: "v19"
    confidence: "confirmed"
    evidence: "MITRE ATT&CK documents APT35 collecting email from remote email servers using compromised credentials and purpose-built tooling including HYPERSCRAPE."
    notes: "Remote email collection using stolen credentials and HYPERSCRAPE is documented by MITRE as a core APT35 collection capability."
  - techniqueId: "T1071.001"
    techniqueName: "Web Protocols"
    tactic: "Command and Control"
    attack-version: "v19"
    confidence: "probable"
    evidence: "MITRE ATT&CK documents APT35 using HTTP-based channels for command-and-control in post-compromise operations."
    notes: "HTTP/HTTPS-based C2 is documented by MITRE for APT35 malware families."
  - techniqueId: "T1583.001"
    techniqueName: "Domains"
    tactic: "Resource Development"
    attack-version: "v19"
    confidence: "confirmed"
    evidence: "MITRE ATT&CK documents APT35 registering domains to support phishing infrastructure and credential-harvesting operations."
    notes: "Domain acquisition for phishing and credential harvesting infrastructure is a documented APT35 resource development technique per MITRE."
atlasMappings: []
attributionConfidence: A3
attributionRationale: "MITRE ATT&CK (G0059) assesses APT35 as an Iranian threat group. Microsoft has tracked overlapping activity under the designations Phosphorus and Mint Sandstorm, assessing the actor as Iran-linked. Google's Threat Analysis Group has tracked related credential-phishing campaigns consistent with Iranian state interests. No formal public indictment specifically naming APT35 has been issued as of the sources reviewed for this profile. The alias cluster — Charming Kitten, Phosphorus, Mint Sandstorm, Newscaster, TA453 — reflects independent vendor tracking of overlapping activity sets and should not be read as confirmation of a single, precisely bounded organizational unit."
reviewStatus: "draft_ai"
generatedBy: "dangermouse-bot"
generatedDate: 2026-05-13
tags:
  - "nation-state"
  - "iran"
  - "espionage"
  - "apt35"
  - "charming-kitten"
  - "credential-phishing"
  - "government"
  - "media"
sources:
  - url: "https://attack.mitre.org/groups/G0059/"
    publisher: "MITRE ATT&CK"
    publisherType: research
    reliability: R1
    publicationDate: "2024-04-19"
    accessDate: "2026-05-13"
    archived: false
  - url: "https://www.microsoft.com/en-us/security/blog/2021/10/11/iran-linked-dev-0343-targeting-defense-gis-and-maritime-sectors/"
    publisher: "Microsoft"
    publisherType: vendor
    reliability: R1
    publicationDate: "2021-10-11"
    accessDate: "2026-05-13"
    archived: false
  - url: "https://blog.google/threat-analysis-group/how-were-tackling-evolving-online-threats/"
    publisher: "Google"
    publisherType: vendor
    reliability: R1
    publicationDate: "2021-10-07"
    accessDate: "2026-05-13"
    archived: false
  - url: "https://www.cisa.gov/topics/cyber-threats-and-advisories/nation-state-cyber-actors"
    publisher: "CISA"
    publisherType: government
    reliability: R1
    publicationDate: "2026-05-13"
    accessDate: "2026-05-13"
    archived: false
---

## Executive Summary

APT35, widely tracked as Charming Kitten, is an Iranian threat group that MITRE ATT&CK (G0059) assesses as conducting espionage operations consistent with Iranian government intelligence collection priorities. The group is known for sustained credential-phishing campaigns targeting journalists, academics, human rights advocates, government officials, and defense-sector personnel. Microsoft has tracked overlapping activity under the Phosphorus and Mint Sandstorm designations; Google's Threat Analysis Group has separately tracked related campaigns.

The group's primary operational method is large-scale, tailored social-engineering and phishing operations designed to harvest credentials, gain access to email accounts, and collect intelligence on targets of interest to the Iranian state. MITRE ATT&CK places the group's known activity beginning at least as early as 2014.

## Notable Campaigns

### 2021 — Defense, GIS, and Maritime Sector Targeting

Microsoft documented a campaign attributed to the actor it tracked as Dev-0343 (later associated with the Phosphorus/Mint Sandstorm cluster) targeting organizations in the defense, geographic information system, and maritime sectors. The campaign used password-spray techniques against Office 365 accounts to gain unauthorized access to target organizations. Microsoft observed targeting consistent with Iranian government collection interests in defense contracting and maritime operations.

### Ongoing — Journalist, Academic, and Civil Society Targeting

MITRE ATT&CK documents sustained APT35 operations targeting media professionals, academics, and civil society members with connections to Iran policy and regional affairs. The group uses credential-harvesting infrastructure, social-engineering lures impersonating journalists or conference organizers, and purpose-built email collection tooling to gain long-term access to target accounts. Google's Threat Analysis Group has documented the group's persistence in targeting high-value individuals through multi-phase social engineering.

## Technical Capabilities

APT35 is primarily a credential-phishing and collection actor. The group's documented technical approach centers on large-scale acquisition of valid credentials through phishing infrastructure, followed by account access and email collection using those credentials.

**HYPERSCRAPE** is a purpose-built email exfiltration tool documented by MITRE that allows the group to download email content from victim accounts, including content from Gmail, Yahoo, and Microsoft Outlook environments. The tool is designed for operational use against accounts where credentials have already been compromised.

**POWERSTAR** (also documented in MITRE's APT35 profile) is a PowerShell-based backdoor used for post-compromise access in cases where the group has achieved code execution beyond credential collection.

The group registers attacker-controlled domains to support credential-harvesting pages that impersonate legitimate services. Password-spray attacks against cloud-hosted email platforms — including Office 365 — are documented by Microsoft as part of the group's targeting methodology against defense-sector organizations.

## Attribution

MITRE ATT&CK categorizes APT35 as G0059 and assesses it as an Iranian threat group. Microsoft has tracked overlapping activity under Phosphorus (legacy designation) and Mint Sandstorm (current Microsoft designation), assessing the cluster as Iran-linked and consistent with Iranian government intelligence interests. Google's Threat Analysis Group has documented related credential-targeting campaigns targeting high-profile individuals.

The large alias cluster associated with this actor — Charming Kitten, APT35, Phosphorus, Mint Sandstorm, Newscaster, TA453, Yellow Garuda, ITG18 — reflects independent vendor discovery and tracking of overlapping intrusion activity sets. Different vendors may scope this cluster differently; attribution claims specific to one vendor track should not be generalized across all aliases unless the relevant source explicitly connects them.

CISA's nation-state cyber actor overview provides broader government context for Iranian-linked cyber operations. No formal public cybersecurity indictment or advisory specifically naming APT35 by that designation appears in the source set reviewed for this profile. The Iran-linked assessment rests on convergent private-sector analysis and targeting alignment corroborated by the general government record on Iranian state cyber activity.

## MITRE ATT&CK Profile

APT35 employs techniques documented across MITRE ATT&CK v19, with a strong emphasis on initial access through social engineering and credential theft.

**Resource Development**: The group registers attacker-controlled domains (T1583.001) to host credential-harvesting infrastructure, impersonating legitimate email providers and organizational login pages.

**Initial Access**: Spearphishing links (T1566.002) delivered via email are the primary documented entry vector, directing targets to attacker-controlled credential-harvesting pages. Microsoft documented password-spray attacks (T1110.003) against Office 365 environments as an additional access technique in the defense-sector campaign.

**Defense Evasion and Persistence**: Compromised valid accounts (T1078) are used for ongoing access following successful credential theft, allowing the group to operate within legitimate account sessions and blend with authorized activity.

**Collection**: Remote email collection (T1114.002) using HYPERSCRAPE and compromised credentials is documented as a core APT35 collection capability per MITRE, enabling bulk exfiltration of target email content.

**Command and Control**: Post-compromise implants including POWERSTAR use HTTP-based channels (T1071.001) for operator communication.

## Sources & References

- [MITRE ATT&CK: APT35 (G0059)](https://attack.mitre.org/groups/G0059/) — MITRE ATT&CK, 2024-04-19
- [Microsoft: Iran-linked DEV-0343 Targeting Defense, GIS, and Maritime Sectors](https://www.microsoft.com/en-us/security/blog/2021/10/11/iran-linked-dev-0343-targeting-defense-gis-and-maritime-sectors/) — Microsoft, 2021-10-11
- [Google: How We're Tackling Evolving Online Threats](https://blog.google/threat-analysis-group/how-were-tackling-evolving-online-threats/) — Google, 2021-10-07
- [CISA: Nation-State Cyber Actors](https://www.cisa.gov/topics/cyber-threats-and-advisories/nation-state-cyber-actors) — CISA, 2026-05-13
