---
name: "Conti"
aliases:
  - "Conti Ransomware Group"
affiliation: "Russia-aligned"
motivation: "Financial / Ransomware Extortion"
status: "inactive"
country: "Russia"
firstSeen: "2020"
lastSeen: "2022"
targetSectors:
  - "Healthcare"
  - "Emergency Services"
  - "Government"
  - "Critical Infrastructure"
  - "Financial Services"
  - "Education"
targetGeographies:
  - "United States"
  - "Ireland"
  - "International"
tools:
  - "Conti ransomware"
  - "Cobalt Strike"
  - "BazarLoader"
  - "TrickBot"
  - "Mimikatz"
  - "Rclone"
  - "AnyDesk"
mitreMappings:
  - techniqueId: "T1566.001"
    techniqueName: "Spearphishing Attachment"
    tactic: "Initial Access"
    notes: "Used spearphishing attachments and malicious links to deliver BazarLoader and TrickBot as initial access vectors into target networks."
  - techniqueId: "T1486"
    techniqueName: "Data Encrypted for Impact"
    tactic: "Impact"
    notes: "Deployed Conti ransomware to encrypt files across compromised networks using ChaCha20 and RSA-4096 encryption."
  - techniqueId: "T1490"
    techniqueName: "Inhibit System Recovery"
    tactic: "Impact"
    notes: "Deleted volume shadow copies and disabled backup mechanisms to prevent recovery without paying the ransom."
  - techniqueId: "T1021.002"
    techniqueName: "SMB/Windows Admin Shares"
    tactic: "Lateral Movement"
    notes: "Propagated across target networks using SMB and Windows Admin Shares to spread the ransomware payload."
  - techniqueId: "T1219"
    techniqueName: "Remote Access Tools"
    tactic: "Command and Control"
    notes: "Used Cobalt Strike and legitimate remote access tools including AnyDesk for persistent command and control and operator access."
  - techniqueId: "T1003.001"
    techniqueName: "LSASS Memory"
    tactic: "Credential Access"
    notes: "Used Mimikatz and similar tooling to dump credentials from LSASS memory to support lateral movement."
  - techniqueId: "T1027"
    techniqueName: "Obfuscated Files or Information"
    tactic: "Defense Evasion"
    notes: "Used obfuscation techniques in tooling and scripts to evade detection by endpoint security products during intrusion operations."
attributionConfidence: "A2"
attributionRationale: "CISA, FBI, and NSA jointly assessed Conti as operated by Russia-based cybercriminals. The group's operational patterns and infrastructure are consistent with a Russia-based criminal operation. The specific organizational relationship to Russian state intelligence services is not established in available public reporting."
reviewStatus: "draft_ai"
generatedBy: "dangermouse-bot"
generatedDate: 2026-05-12
tags:
  - "ransomware"
  - "raas"
  - "russia"
  - "double-extortion"
  - "healthcare"
  - "critical-infrastructure"
sources:
  - url: "https://www.cisa.gov/news-events/alerts/2021/09/22/conti-ransomware"
    publisher: "CISA"
    publisherType: "government"
    reliability: "R1"
    publicationDate: "2021-09-22"
    accessDate: "2026-05-12"
    archived: false
  - url: "https://www.cisa.gov/news-events/news/updated-conti-ransomware"
    publisher: "CISA"
    publisherType: "government"
    reliability: "R1"
    publicationDate: "2022-03-09"
    accessDate: "2026-05-12"
    archived: false
  - url: "https://www.chainalysis.com/blog/2022-crypto-crime-report-preview-ransomware/"
    publisher: "Chainalysis"
    publisherType: "research"
    reliability: "R2"
    publicationDate: "2022-01-20"
    accessDate: "2026-05-12"
    archived: false
---

## Executive Summary

Conti was a Russia-aligned ransomware-as-a-service (RaaS) operation active from approximately 2020 through early 2022. CISA, FBI, and NSA jointly documented the group in advisory AA21-265A as responsible for over 400 attacks against organizations worldwide. MITRE ATT&CK tracks associated activity under G0098.

The group operated a double-extortion model: encrypting victim data while simultaneously threatening to publish exfiltrated files on a dedicated leak site ("Conti News") if ransom demands were not met. Conti functioned as a ransomware-as-a-service platform, with a core team providing tooling, infrastructure, and negotiation support to a network of affiliates who conducted intrusions independently.

## Notable Campaigns

A Conti attack targeted Ireland's Health Service Executive (HSE) in May 2021. The attack disrupted hospital IT systems across Ireland, forcing the cancellation of outpatient appointments and diagnostic services. The Irish government declined to pay the ransom; the decryption key was subsequently provided.

CISA advisory AA21-265A documented over 400 attacks globally against organizations in healthcare, emergency services, law enforcement, emergency medical services, and 911 dispatch centers. Ransom demands in documented cases ranged up to $25 million. The advisory noted a targeting pattern against healthcare and first-responder networks.

## Technical Capabilities

Conti's intrusion chain typically began with phishing-delivered malware — primarily BazarLoader and TrickBot — or exploitation of internet-facing vulnerabilities. Post-access activity consistently followed a pattern documented across the CISA advisory and corroborating incident reporting: Cobalt Strike deployment for command and control, credential harvesting via Mimikatz, lateral movement using Windows administrative tools and SMB shares, and bulk data staging and exfiltration using Rclone or similar utilities prior to ransomware deployment.

The ransomware payload used a combination of ChaCha20 for file encryption and RSA-4096 for key protection. Deployment followed a structured affiliate playbook, as documented in CISA advisory AA21-265A, covering disabling security software, deleting shadow copies, and deploying the encryptor across the network. The group maintained support infrastructure including negotiation teams, leak site operators, and technical staff, consistent with its RaaS operating model.

## Attribution

CISA, FBI, and NSA jointly attributed Conti activity to Russia-based cybercriminals in advisory AA21-265A and subsequent updates. The advisory did not identify specific individuals or organizational sponsors. The Russia-based assessment is supported by operational patterns, infrastructure, and the group's own February 2022 public statement expressing support for the Russian government.

The relationship between Conti and Russian state intelligence services is not established in available public reporting. The group operated as a criminal enterprise; its public alignment statement and operational geography are consistent with a Russia-based criminal operation that is tolerated or not actively suppressed by Russian authorities, which is a distinct assessment from state direction or sponsorship.

## MITRE ATT&CK Profile

T1566.001 - Spearphishing Attachment: Initial access relied primarily on phishing with malicious attachments delivering BazarLoader or TrickBot.

T1003.001 - LSASS Memory: Credential access used LSASS memory dumping via Mimikatz.

T1021.002 - SMB/Windows Admin Shares: Operators moved laterally through compromised environments using SMB and Windows Admin Shares.

T1027 - Obfuscated Files or Information: Intrusion activity relied on obfuscated tooling and scripts designed to evade endpoint detection.

T1219 - Remote Access Tools: Operators used Cobalt Strike and legitimate remote access tools including AnyDesk.

T1486 - Data Encrypted for Impact: The ransomware deployment phase encrypted data across compromised networks.

T1490 - Inhibit System Recovery: Operators inhibited recovery by deleting shadow copies and disabling backup mechanisms.

## Sources & References

- [CISA: Advisory AA21-265A — Conti Ransomware](https://www.cisa.gov/news-events/alerts/2021/09/22/conti-ransomware) — CISA, 2021-09-22
- [CISA: Updated Conti Ransomware Advisory](https://www.cisa.gov/news-events/news/updated-conti-ransomware) — CISA, 2022-03-09
- [Chainalysis: 2022 Crypto Crime Report — Ransomware](https://www.chainalysis.com/blog/2022-crypto-crime-report-preview-ransomware/) — Chainalysis, 2022-01-20
