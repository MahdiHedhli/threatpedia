---
name: "BlackSuit"
aliases:
  - "Royal"
  - "Zeon"
  - "Ignoble Scorpius"
affiliation: "Suspected former Conti ransomware members"
motivation: "Financial"
status: "active"
country: "Unknown"
firstSeen: "2022"
lastSeen: "2024"
targetSectors:
  - "Commercial Facilities"
  - "Healthcare"
  - "Government"
  - "Critical Manufacturing"
  - "Communications"
  - "Financial Services"
  - "Emergency Services"
targetGeographies:
  - "United States"
  - "Global"
tools:
  - "Chisel"
  - "Cloudflared"
  - "Cobalt Strike"
  - "Mimikatz"
  - "Nirsoft Credential Tools"
  - "SharpShares"
  - "SoftPerfect NetWorx"
  - "Ursnif/Gozi"
  - "OpenSSH"
  - "MobaXterm"
  - "esxcli"
mitreMappings:
  - techniqueId: "T1566.001"
    techniqueName: "Spearphishing Attachment"
    tactic: "Initial Access"
    notes: "BlackSuit actors commonly gain initial access via phishing emails containing malicious PDF attachments."
  - techniqueId: "T1566.002"
    techniqueName: "Spearphishing Link"
    tactic: "Initial Access"
    notes: "Malvertising campaigns delivering malware via spearphishing links have been observed as a secondary initial-access vector."
  - techniqueId: "T1685"
    techniqueName: "Disable or Modify Tools"
    tactic: "Defense Evasion"
    notes: "After gaining initial access, BlackSuit actors disable antivirus and endpoint security tooling before deploying ransomware, reducing detection likelihood during credential harvesting and encryption phases."
  - techniqueId: "T1003"
    techniqueName: "OS Credential Dumping"
    tactic: "Credential Access"
    notes: "Mimikatz and Nirsoft password harvesting utilities have been found on victim systems, used to collect credentials for lateral movement and privilege escalation."
  - techniqueId: "T1572"
    techniqueName: "Protocol Tunneling"
    tactic: "Command and Control"
    notes: "Chisel, a tunneling tool wrapping traffic over HTTP secured by SSH, and Cloudflared are used to establish covert command-and-control channels and maintain persistent network access."
  - techniqueId: "T1135"
    techniqueName: "Network Share Discovery"
    tactic: "Discovery"
    notes: "SharpShares and SoftPerfect NetWorx enumerate victim network shares and topology, informing lateral movement paths and target selection for the encryption stage."
  - techniqueId: "T1021.004"
    techniqueName: "SSH"
    tactic: "Lateral Movement"
    notes: "BlackSuit actors establish SSH sessions using OpenSSH and MobaXterm to move laterally within victim environments following initial compromise and credential acquisition."
  - techniqueId: "T1567"
    techniqueName: "Exfiltration Over Web Service"
    tactic: "Exfiltration"
    notes: "Cobalt Strike and Ursnif/Gozi derivatives are used to exfiltrate victim data to actor-controlled infrastructure before ransomware deployment, supporting the double-extortion model."
  - techniqueId: "T1486"
    techniqueName: "Data Encrypted for Impact"
    tactic: "Impact"
    notes: "BlackSuit deploys ransomware using a partial-encryption approach via OpenSSL AES, encrypting a configurable percentage of each file to increase speed and evade behavioral detection. Encrypted files receive the .blacksuit extension."
  - techniqueId: "T1489"
    techniqueName: "Service Stop"
    tactic: "Impact"
    notes: "On VMware ESXi environments, actors use the esxcli command-line utility to terminate virtual machine processes before encryption, releasing file locks to enable encryption coverage."
attributionConfidence: "A3"
attributionRationale: "CISA and FBI consolidated the Royal and BlackSuit identities in their August 2024 advisory update, reflecting confirmed code and operational continuity. Trend Micro's May 2023 analysis confirmed payload-level code overlap. Attribution to former Conti members is assessed at moderate confidence; no court filing or formal government designation names specific individuals."
reviewStatus: "draft_ai"
generatedBy: "dangermouse-bot"
generatedDate: "2026-05-09"
tags:
  - "financially-motivated"
  - "cybercrime"
  - "ransomware"
  - "double-extortion"
  - "conti-lineage"
sources:
  - url: "https://www.cisa.gov/news-events/cybersecurity-advisories/aa23-061a"
    publisher: "CISA"
    publisherType: "government"
    reliability: "R1"
    publicationDate: "2024-08-07"
    accessDate: "2026-05-08"
    archived: false
  - url: "https://www.cisa.gov/news-events/alerts/2024/08/07/royal-ransomware-actors-rebrand-blacksuit-fbi-and-cisa-release-update-advisory"
    publisher: "CISA"
    publisherType: "government"
    reliability: "R1"
    publicationDate: "2024-08-07"
    accessDate: "2026-05-08"
    archived: false
  - url: "https://www.trendmicro.com/en_us/research/23/e/investigating-blacksuit-ransomwares-similarities-to-royal.html"
    publisher: "Trend Micro"
    publisherType: "vendor"
    reliability: "R1"
    publicationDate: "2023-05-11"
    accessDate: "2026-05-08"
    archived: false
---

## Executive Summary

BlackSuit is a financially motivated ransomware and extortion group assessed to be composed of former members of the Conti ransomware operation. The group operated under the name Royal from approximately September 2022, and under Zeon before that, before rebranding to BlackSuit in mid-2023. CISA and the FBI updated their advisory in August 2024 to consolidate the Royal and BlackSuit identities under a unified threat profile, reflecting confirmed code and operational continuity between the two variants. BlackSuit employs a double-extortion model — encrypting victim systems while simultaneously exfiltrating data and threatening to publish it on a dedicated leak site — and has targeted organizations across multiple critical infrastructure sectors in the United States and internationally.

## Notable Campaigns

BlackSuit and its Royal predecessor have targeted organizations across critical infrastructure sectors globally. CISA's advisory documents victims in commercial facilities, healthcare, government, critical manufacturing, communications, financial services, and emergency services sectors. Unit 42, which tracks the BlackSuit cluster under the designation Ignoble Scorpius, documented an increase in BlackSuit activity beginning in March 2024, indicating an operational ramp-up. The group's double-extortion leak site has listed victims from North America, Europe, and other regions. Royal-phase activity from September 2022 through mid-2023 included targets across the same sector range, consistent with the group's opportunistic targeting posture rather than a specific sector focus.

## Technical Capabilities

BlackSuit actors enter victim environments primarily via phishing emails containing malicious PDF attachments, with malvertising campaigns serving as a secondary initial-access vector. After achieving access, the group disables antivirus and endpoint security tooling before proceeding to credential collection using Mimikatz and Nirsoft password utilities.

Network reconnaissance uses SharpShares and SoftPerfect NetWorx to enumerate shares and map internal topology. Lateral movement proceeds via SSH connections established through OpenSSH and MobaXterm. For command and control, BlackSuit actors deploy Chisel — a tunneling tool wrapping traffic over HTTP secured with SSH — alongside Cloudflared, which routes traffic through Cloudflare's infrastructure to obscure origin addresses.

Data exfiltration precedes encryption, using Cobalt Strike and Ursnif/Gozi derivatives to stage and transfer victim data to actor-controlled infrastructure. The final ransomware payload uses a partial-encryption approach in which operators configure what percentage of each file is encrypted. Lower percentages reduce encryption time on large files while still rendering them inaccessible, and lower encryption ratios evade behavioral detection thresholds. Encrypted files receive the `.blacksuit` extension. On VMware ESXi targets, the `esxcli` command-line utility terminates virtual machine processes before encryption, releasing file locks to enable coverage.

## Attribution

BlackSuit is assessed with moderate confidence to be operated by former Conti ransomware members, consistent with what CISA and independent researchers have characterized as former "Team One" operators who continued independent activity following Conti's dissolution in mid-2022. Code-level analysis by Trend Micro in May 2023 identified code-level overlap between Royal and BlackSuit ransomware payloads, including shared partial-encryption logic, command-line argument handling, and file enumeration routines. CISA's consolidated August 2024 advisory treats Royal and BlackSuit as a continuous lineage. No public court filing or formal government designation links the group to specific individuals or organizations. Suspected Russia nexus is based on Conti's prior attribution and operational patterns; state direction or sponsorship is not supported by available public evidence.

## MITRE ATT&CK Profile

BlackSuit's documented techniques span the full attack lifecycle from initial access through impact.

**Initial Access**: Phishing with malicious PDF attachments is the primary documented access vector (T1566.001). Malvertising-driven delivery has also been observed (T1566.002).

**Defense Evasion**: Antivirus and endpoint security tooling is disabled immediately following initial access (T1685), reducing detection risk during the credential harvesting and lateral movement phases.

**Credential Access**: Mimikatz and Nirsoft password utilities are deployed to collect credentials (T1003), enabling privilege escalation and authenticated lateral movement across victim environments.

**Discovery**: SharpShares and SoftPerfect NetWorx enumerate network shares and topology (T1135), informing targeting decisions for the encryption staging phase.

**Lateral Movement**: SSH sessions via OpenSSH and MobaXterm (T1021.004) are the primary documented mechanism for moving between systems within victim environments.

**Command and Control**: Chisel provides protocol tunneling over HTTP/SSH (T1572). Cloudflared is used in parallel to proxy traffic through Cloudflare infrastructure, obscuring C2 communications.

**Exfiltration**: Cobalt Strike and Ursnif/Gozi derivatives aggregate and transfer victim data to actor-controlled infrastructure before ransomware deployment (T1567).

**Impact**: BlackSuit deploys its partial-encryption ransomware payload (T1486) and uses `esxcli` to stop virtual machine services on ESXi hypervisors before encryption (T1489).

## Sources & References

- [CISA: #StopRansomware: BlackSuit (Royal) Ransomware (AA23-061A, updated August 2024)](https://www.cisa.gov/news-events/cybersecurity-advisories/aa23-061a) — CISA, 2024-08-07
- [CISA: Royal Ransomware Actors Rebrand as BlackSuit](https://www.cisa.gov/news-events/alerts/2024/08/07/royal-ransomware-actors-rebrand-blacksuit-fbi-and-cisa-release-update-advisory) — CISA, 2024-08-07
- [Trend Micro: Investigating BlackSuit Ransomware's Similarities to Royal](https://www.trendmicro.com/en_us/research/23/e/investigating-blacksuit-ransomwares-similarities-to-royal.html) — Trend Micro, 2023-05-11
