---
name: "Conti"
aliases:
  - "Conti Ransomware Group"
  - "Wizard Spider" 
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
  - "Costa Rica"
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
attributionRationale: "CISA, FBI, and NSA jointly assessed Conti as operated by Russia-based cybercriminals. The group's operational patterns, infrastructure, and the content of the 2022 Conti leaks are consistent with a Russia-based criminal operation. The specific organizational relationship to Russian state intelligence services is not established in available public sources."
reviewStatus: "draft_ai"
generatedBy: "dangermouse-bot"
generatedDate: 2026-05-12
tags:
  - "ransomware"
  - "raas"
  - "russia"
  - "double-extortion"
  - "conti-leaks"
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

Conti was a Russia-aligned ransomware-as-a-service (RaaS) operation active from approximately 2020 through May 2022. CISA, FBI, and NSA jointly documented the group in advisory AA21-265A as responsible for over 400 attacks against organizations worldwide, making it one of the most prolific ransomware operations during its period of activity. MITRE ATT&CK tracks associated activity under G0098.

The group operated a double-extortion model: encrypting victim data while simultaneously threatening to publish exfiltrated files on a dedicated leak site ("Conti News") if ransom demands were not met. Conti functioned as a ransomware-as-a-service platform, with a core team providing tooling, infrastructure, and negotiation support to a network of affiliates who conducted intrusions independently.

In February and March 2022, an anonymous source leaked a substantial volume of internal Conti communications and source code following the group's public declaration of support for Russia in the context of the war in Ukraine. The group publicly announced its dissolution in May 2022. Former Conti affiliates and operators are assessed to have dispersed into multiple successor ransomware operations; those successor operations should not be attributed to Conti absent independent evidence.

## Notable Campaigns

The most widely reported Conti attack targeted Ireland's Health Service Executive (HSE) in May 2021. The attack disrupted hospital IT systems across Ireland, forcing the cancellation of outpatient appointments and diagnostic services. The Irish government declined to pay the ransom; the decryption key was subsequently provided. The incident is one of the most extensively documented ransomware attacks on a national healthcare system.

In April and May 2022, Conti launched attacks against multiple Costa Rican government ministries, prompting the Costa Rican government to declare a national emergency. The attack disrupted finance and customs operations and represented one of the first ransomware attacks to prompt a formal national emergency declaration by a sovereign government.

CISA advisory AA21-265A documented over 400 attacks globally against organizations in healthcare, emergency services, law enforcement, emergency medical services, and 911 dispatch centers. Ransom demands in documented cases ranged up to $25 million. The advisory noted a particular targeting pattern against healthcare and first-responder networks.

## Technical Capabilities

Conti's intrusion chain typically began with phishing-delivered malware — primarily BazarLoader and TrickBot — or exploitation of internet-facing vulnerabilities. Post-access activity consistently followed a pattern documented across the CISA advisory and corroborating incident reporting: Cobalt Strike deployment for command and control, credential harvesting via Mimikatz, lateral movement using Windows administrative tools and SMB shares, and bulk data staging and exfiltration using Rclone or similar utilities prior to ransomware deployment.

The ransomware payload used a combination of ChaCha20 for file encryption and RSA-4096 for key protection. Deployment was designed for speed: Conti affiliates were provided internal playbooks (later exposed in the 2022 leaks) that detailed step-by-step procedures for disabling security software, deleting shadow copies, and deploying the encryptor across the network. The group maintained a professional support infrastructure including negotiation teams, leak site operators, and technical staff, consistent with its RaaS operating model.

The 2022 Conti leaks exposed internal chat logs, source code, and operational documentation, providing an unusually detailed public record of the group's internal structure and tradecraft. That material is not reflected in the cited sources and should be treated as supplementary context rather than a primary source basis for claims in the article body.

## Attribution

CISA, FBI, and NSA jointly attributed Conti activity to Russia-based cybercriminals in advisory AA21-265A and subsequent updates. The advisory did not identify specific individuals or organizational sponsors. The Russia-based assessment is supported by operational patterns, infrastructure, and the group's own February 2022 public statement expressing support for the Russian government.

The relationship between Conti and Russian state intelligence services is not established in the cited sources. The group operated as a criminal enterprise; its public alignment statement and operational geography are consistent with a Russia-based criminal operation that is tolerated or not actively suppressed by Russian authorities, which is a distinct assessment from state direction or sponsorship.

Conti is frequently associated with the Wizard Spider threat cluster, a designation used by some vendors to describe the broader criminal ecosystem from which Conti emerged. That vendor-specific designation is not reflected in CISA or MITRE primary sources and is noted here only as a known alias, not as an established canonical identity.

## MITRE ATT&CK Profile

Initial access relied primarily on phishing with malicious attachments delivering BazarLoader or TrickBot (T1566.001). Credential access used LSASS memory dumping via Mimikatz (T1003.001) to support lateral movement via SMB/Admin Shares (T1021.002). Defense evasion relied on obfuscated tooling and scripts designed to evade endpoint detection (T1027). Command and control used Cobalt Strike and legitimate remote access tools including AnyDesk (T1219). The ransomware deployment phase encrypted data (T1486) and inhibited recovery by deleting shadow copies and disabling backups (T1490). Full technique coverage for G0098 is maintained in MITRE ATT&CK.

## Sources & References

Coverage of Conti in open-source reporting is concentrated in the 2021–2022 period. The group publicly announced its dissolution in May 2022; no confirmed Conti-branded attacks have been documented since. Post-Conti successor operations should not be attributed to Conti without independent evidence linking them to the same infrastructure or operators. The 2022 Conti leaks represent a significant but unsourced body of supplementary material not reflected in the cited government and research sources.

- [CISA: Advisory AA21-265A — Conti Ransomware](https://www.cisa.gov/news-events/alerts/2021/09/22/conti-ransomware) — CISA, 2021-09-22
- [CISA: Updated Conti Ransomware Advisory](https://www.cisa.gov/news-events/news/updated-conti-ransomware) — CISA, 2022-03-09
- [Chainalysis: 2022 Crypto Crime Report — Ransomware](https://www.chainalysis.com/blog/2022-crypto-crime-report-preview-ransomware/) — Chainalysis, 2022-01-20
