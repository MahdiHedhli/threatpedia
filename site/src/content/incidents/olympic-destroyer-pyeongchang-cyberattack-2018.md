---
eventId: TP-2018-0002
title: Olympic Destroyer PyeongChang Cyberattack
date: 2018-02-09
attackType: Sabotage / Wiper
severity: high
sector: Sports / Event Infrastructure
geography: South Korea
threatActor: Sandworm
attributionConfidence: A1
reviewStatus: draft_ai
confidenceGrade: B
generatedBy: dangermouse-bot
generatedDate: 2026-05-18
cves: []
relatedSlugs: []
tags:
  - olympic-destroyer
  - wiper
  - sandworm
  - russia
  - gru
  - pyeongchang
  - false-flag
  - sports
sources:
  - url: https://www.justice.gov/usao-wdpa/pr/six-russian-gru-officers-charged-connection-worldwide-deployment-destructive-malware
    publisher: U.S. Department of Justice
    publisherType: government
    reliability: R1
    publicationDate: "2020-10-19"
    accessDate: "2026-05-18"
    archived: false
  - url: https://attack.mitre.org/software/S0365/
    publisher: MITRE
    publisherType: research
    reliability: R1
    publicationDate: "2019-10-17"
    accessDate: "2026-05-18"
    archived: false
  - url: https://blog.talosintelligence.com/olympic-destroyer/
    publisher: Cisco Talos
    publisherType: vendor
    reliability: R1
    publicationDate: "2018-02-12"
    accessDate: "2026-05-18"
    archived: false
  - url: https://securelist.com/olympic-destroyer-is-still-alive/86169/
    publisher: Kaspersky
    publisherType: vendor
    reliability: R1
    publicationDate: "2018-06-11"
    accessDate: "2026-05-18"
    archived: false
mitreMappings:
  - techniqueId: T1485
    techniqueName: "Data Destruction"
    tactic: Impact
    attack-version: "v19.0"
    confidence: confirmed
    evidence: "Olympic Destroyer deleted files across infected hosts to render systems inoperable, as documented in MITRE ATT&CK S0365."
  - techniqueId: T1490
    techniqueName: "Inhibit System Recovery"
    tactic: Impact
    attack-version: "v19.0"
    confidence: confirmed
    evidence: "The malware deleted Volume Shadow Copies and modified Boot Configuration Data to disable Windows recovery options, as documented in MITRE ATT&CK S0365."
  - techniqueId: T1555.003
    techniqueName: "Credentials from Web Browsers"
    tactic: Credential Access
    attack-version: "v19.0"
    confidence: confirmed
    evidence: "Olympic Destroyer extracted credentials stored by Internet Explorer and Google Chrome to fuel lateral movement, as documented in MITRE ATT&CK S0365."
  - techniqueId: T1021.002
    techniqueName: "SMB/Windows Admin Shares"
    tactic: Lateral Movement
    attack-version: "v19.0"
    confidence: confirmed
    evidence: "Olympic Destroyer used harvested credentials to access Windows administrative shares and propagate through the target network, as documented in MITRE ATT&CK S0365."
---

## Summary

On 9 February 2018, a destructive cyberattack struck the information technology infrastructure supporting the PyeongChang Winter Olympics opening ceremony in South Korea. The malware, subsequently designated Olympic Destroyer, targeted systems belonging to the Games' organizing committee and its technology partners, causing disruptions to the official website, press-center network access, IPTV broadcasts, and ticketing services during and around the opening ceremony.

Olympic Destroyer was designed to destroy rather than to exfiltrate data. The malware harvested credentials stored in web browsers, spread laterally through the victim environment using those credentials, deleted files, removed Volume Shadow Copies, and disabled Windows boot recovery features to maximize lasting damage. The organizing committee confirmed that IT systems were restored by the following morning.

A distinctive feature of the attack was the deliberate embedding of misleading code artifacts in the malware binary. Cisco Talos analysts who published initial technical findings on 12 February 2018 noted that the malware contained characteristics overlapping with multiple threat clusters, making attribution unusually difficult. Subsequent analysis by Kaspersky researchers identified these overlapping characteristics as fabricated false-flag artifacts intended to obstruct attribution.

In October 2020, the U.S. Department of Justice indicted six officers of Russian military intelligence (GRU) Unit 74455 — the cluster known as Sandworm — for their roles in the Olympic Destroyer attack and other destructive cyber operations. The 2018 private-sector assessment of ambiguous authorship is distinct from the 2020 government attribution, which rested on a formal criminal indictment.

## Technical Analysis

Olympic Destroyer was a purpose-built destructive payload. Upon execution, the malware harvested credentials stored by Internet Explorer and Google Chrome on the infected host. It then used those credentials to spread to additional systems via SMB and Windows administrative shares, replicating the destructive payload across the network before triggering the final destruction phase.

The destructive sequence proceeded in two steps. First, the malware deleted files on infected hosts. Second, it stripped the system's recovery capabilities: Volume Shadow Copies were removed using Windows Management Instrumentation (WMI), and Boot Configuration Data (BCD) was modified to disable Windows Startup Repair, preventing automatic recovery on reboot. The combined effect left affected systems unable to restore data through standard Windows mechanisms.

Cisco Talos documented the malware's behavior in detail following the opening ceremony, noting the credential-harvesting module, the lateral movement via Windows shares, and the destructive wiper functionality. Talos analysts explicitly declined to attribute the attack, noting that the malware contained code characteristics overlapping with multiple threat groups, which complicated forensic analysis.

Kaspersky researchers later reported that overlapping indicators in the Olympic Destroyer binary had been deliberately fabricated to resemble artifacts from other known actors. According to Kaspersky, the deliberate effort invested in this counter-attribution work was among the most elaborate they had encountered, and the fabricated artifacts were constructed with enough precision to mislead initial analysis.

Kaspersky also identified, in June 2018, that tooling with code overlap to Olympic Destroyer had subsequently been used in campaigns targeting biological and chemical threat prevention laboratories in Europe and financial sector organizations, indicating continued operational use of the same codebase beyond the Olympics incident.

## Attack Chain

### Stage 1: Pre-Positioning

Olympic Destroyer was deployed within the PyeongChang organizing committee's IT environment ahead of the opening ceremony on 9 February 2018. The precise initial access vector was not publicly confirmed in the analyzed sources.

### Stage 2: Credential Harvesting

The malware extracted credentials stored by Internet Explorer and Google Chrome on compromised hosts, accumulating network credentials to support lateral movement.

### Stage 3: Lateral Movement via SMB and Admin Shares

Using harvested credentials, Olympic Destroyer accessed Windows administrative shares (ADMIN$, C$) on adjacent systems and copied the payload for execution, propagating through the target network.

### Stage 4: File Deletion

The destructive payload deleted files across infected systems, targeting operational data and rendering affected hosts unable to function normally.

### Stage 5: Volume Shadow Copy Removal

Olympic Destroyer issued WMI commands to delete all Volume Shadow Copies on infected hosts, removing the primary Windows-native mechanism for point-in-time data recovery.

### Stage 6: Boot Recovery Disabled

The malware modified Boot Configuration Data to disable Windows recovery tools, ensuring that affected systems could not self-repair on restart and that manual recovery would be required.

## Impact Assessment

The attack disrupted IT services supporting the PyeongChang Winter Olympics opening ceremony on the evening of 9 February 2018. The official PyeongChang 2018 website became unavailable. Internet connectivity in the main press center was affected, disrupting reporter access during the event. IPTV broadcasting systems used at the venue were taken offline. Ticketing and spectator-facing services experienced failures, affecting the ability of some attendees to retrieve electronic tickets before the ceremony.

The PyeongChang organizing committee confirmed the cyberattack and stated that systems had been restored by the morning of 10 February 2018. The attack did not affect safety systems or cause physical harm, and the opening ceremony proceeded.

The incident demonstrated that major international sporting events represent high-profile, time-bounded targets where disruption during a flagship moment — even if temporary — carries significant reputational and operational consequences for organizing bodies and their technology partners.

## Attribution

The initial technical analysis published by Cisco Talos on 12 February 2018 documented the malware's behavior and explicitly noted attribution uncertainty. The binary contained characteristics overlapping with multiple threat clusters, and Talos declined to assign authorship pending further analysis. This ambiguity was not a failure of analysis but a consequence of deliberate obfuscation embedded in the malware.

Kaspersky researchers subsequently identified the cause of that ambiguity: code artifacts in the Olympic Destroyer binary had been fabricated to resemble forensic fingerprints from other known actors, constituting a false-flag operation intended to implicate a different group. Kaspersky described the false-flag as among the most deliberately constructed counter-attribution efforts they had encountered.

In June 2018, Kaspersky reported that Olympic Destroyer's codebase had survived the Olympics incident and was being used in follow-on operations. Campaigns sharing code overlap with Olympic Destroyer targeted biological and chemical threat prevention laboratories and financial organizations in Europe, suggesting continued use of the toolset by the same operator.

In October 2020, the U.S. Department of Justice unsealed an indictment naming six officers of GRU Unit 74455 for their roles in the Olympic Destroyer attack and other destructive operations, including the NotPetya wiper attack of June 2017. The indictment provided formal government attribution nearly three years after the attack, affirming that the false-flag operation had successfully complicated the initial attribution picture while not preventing eventual identification.

## Timeline

### 2018-02-09 — Opening Ceremony Disruption

Olympic Destroyer executed against PyeongChang organizing committee infrastructure during the opening ceremony, causing outages affecting the official website, press-center connectivity, IPTV systems, and ticketing services.

### 2018-02-12 — Cisco Talos Initial Analysis Published

Cisco Talos published technical analysis of Olympic Destroyer documenting credential harvesting, SMB-based lateral movement, file deletion, and recovery disruption capabilities, while explicitly noting attribution uncertainty due to overlapping code characteristics from multiple threat clusters.

### 2018-02-13 — Organizing Committee Confirms Restoration

The PyeongChang organizing committee publicly confirmed that IT systems had been restored following the previous night's attack.

### 2018-06-11 — Kaspersky Follow-On Analysis Published

Kaspersky published research showing that Olympic Destroyer's false-flag artifacts were deliberately fabricated to resemble Lazarus Group malware, and that tooling with Olympic Destroyer code overlap had been deployed in subsequent campaigns against biological and chemical threat prevention organizations and financial sector targets in Europe.

### 2020-10-19 — DOJ Indictment of GRU Unit 74455 Officers

The U.S. Department of Justice indicted six Russian GRU Unit 74455 officers for their roles in the Olympic Destroyer attack and other destructive cyber operations, providing formal government attribution to Sandworm.

## Remediation & Mitigation

Protecting credential stores limits the effectiveness of credential-harvesting lateral movement. Browser-stored credentials on systems with network access increase attacker reach once a single host is compromised; privileged accounts should enforce multi-factor authentication to reduce the utility of harvested passwords.

Network segmentation and access controls on Windows administrative shares (ADMIN$, C$) prevent SMB-based lateral movement. Hosts that do not require remote administration should have these shares disabled or access-controlled, and SMB traffic should be restricted between network segments.

Offline or immutable backups are the primary recovery defense against wiper payloads that delete shadow copies. Volume Shadow Copy deletion via WMI is a high-fidelity indicator of destructive activity and should generate immediate security alerts.

Modifications to Boot Configuration Data outside of authorized patching windows should generate security alerts. Unauthorized BCD changes are a strong indicator of deliberate recovery disruption.

Organizations operating time-sensitive, high-profile events should increase security monitoring in the period preceding and during those events, as destructive attacks against event infrastructure are designed to achieve maximum impact during the window when disruption is most visible and costly.

## Sources & References

- [U.S. Department of Justice: Six Russian GRU Officers Charged in Connection with Worldwide Deployment of Destructive Malware](https://www.justice.gov/usao-wdpa/pr/six-russian-gru-officers-charged-connection-worldwide-deployment-destructive-malware) — U.S. Department of Justice, 2020-10-19
- [MITRE: Olympic Destroyer (S0365)](https://attack.mitre.org/software/S0365/) — MITRE, 2019-10-17
- [Cisco Talos: Olympic Destroyer Takes Aim at Winter Olympics](https://blog.talosintelligence.com/olympic-destroyer/) — Cisco Talos, 2018-02-12
- [Kaspersky: Olympic Destroyer Is Still Alive](https://securelist.com/olympic-destroyer-is-still-alive/86169/) — Kaspersky, 2018-06-11
