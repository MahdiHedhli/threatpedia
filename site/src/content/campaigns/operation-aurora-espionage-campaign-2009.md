---
campaignId: "TP-CAMP-2009-0001"
title: "Operation Aurora Cyber Espionage Campaign"
startDate: 2009-06-01
endDate: 2010-01-31
ongoing: false
attackType: "Espionage"
severity: critical
sector: "Technology"
geography: "Global"
threatActor: "Unknown"
attributionConfidence: A3
reviewStatus: "draft_human"
confidenceGrade: B
generatedBy: "kernel-k"
generatedDate: 2026-04-17
cves:
  - "CVE-2010-0249"
relatedIncidents: []
tags:
  - "operation-aurora"
  - "china"
  - "google"
  - "adobe"
  - "espionage"
  - "ie-zero-day"
  - "hydraq"
sources:
  - url: "https://googleblog.blogspot.com/2010/01/new-approach-to-china.html"
    publisher: "Google"
    publisherType: vendor
    reliability: R1
    publicationDate: "2010-01-12"
    accessDate: "2026-04-17"
    archived: false
  - url: "https://www.cisa.gov/news-events/alerts/2010/01/14/google-china-cyber-attack"
    publisher: "CISA"
    publisherType: government
    reliability: R1
    publicationDate: "2010-01-14"
    accessDate: "2026-04-17"
    archived: false
  - url: "https://www.mcafee.com/blogs/other-blogs/mcafee-labs/more-details-on-operation-aurora/"
    publisher: "McAfee"
    publisherType: vendor
    reliability: R1
    publicationDate: "2010-01-14"
    accessDate: "2026-04-17"
    archived: false
  - url: "https://attack.mitre.org/groups/G0066/"
    publisher: "MITRE ATT&CK"
    publisherType: research
    reliability: R1
    publicationDate: "2024-11-17"
    accessDate: "2026-04-17"
    archived: false
mitreMappings:
  - techniqueId: "T1566.002"
    techniqueName: "Phishing: Spearphishing Link"
    tactic: "Initial Access"
    notes: "Targets were lured to malicious content through targeted links and related delivery mechanisms."
  - techniqueId: "T1189"
    techniqueName: "Drive-by Compromise"
    tactic: "Initial Access"
    notes: "The campaign relied on web-delivered exploitation tied to the Internet Explorer zero-day."
  - techniqueId: "T1203"
    techniqueName: "Exploitation for Client Execution"
    tactic: "Execution"
    notes: "CVE-2010-0249 enabled arbitrary code execution in victim browsers."
  - techniqueId: "T1005"
    techniqueName: "Data from Local System"
    tactic: "Collection"
    notes: "Attackers pursued source code and other sensitive data from compromised victim networks."
---

## Executive Summary

Operation Aurora was a China-linked espionage campaign disclosed in January 2010 after Google announced that it and more than twenty other companies had been targeted. The intrusions focused on intellectual property theft and access to communications associated with Chinese human-rights activism, making the campaign significant both for what was stolen and for the strategic context around the targeting.

Public reporting consistently tied the campaign to operators based in China, but the exact threat-group label has remained less settled than in cases like SolarWinds or Volt Typhoon. Early reporting centered on the attack mechanics and victim set; later ATT&CK references associated the 2009 Google intrusion with Elderwood-era tooling and activity. For that reason, the campaign is best treated as high-confidence China-linked espionage with moderate confidence on the specific operator cluster.

## Technical Analysis

The campaign's best-documented access vector was exploitation of the Internet Explorer zero-day CVE-2010-0249. Victims were directed to malicious web content through targeted delivery, and successful exploitation installed the Hydraq (also referred to as Aurora) backdoor on compromised systems. That gave the operators remote access, the ability to stage follow-on tooling, and a pathway to internal systems holding valuable code and communications.

What stood out was the focus on source-code repositories and selected Gmail accounts rather than purely opportunistic monetization. The operators moved from the initial endpoint compromise into internal environments and targeted assets with long-term strategic value. Even in public reporting from the time, the activity looked less like smash-and-grab intrusion and more like focused industrial and political espionage.

The public record is less complete than it is for modern cloud-era campaigns, so some infrastructure and post-exploitation details remain contested or incomplete. But the broad technical picture is stable: targeted delivery, Internet Explorer client exploitation, remote access malware, movement toward source-code and communications systems, and quiet data theft aligned with intelligence collection goals.

## Attack Chain

### Stage 1: Targeted Delivery

Operators selected employees at high-value companies and used targeted links and related delivery methods to drive victims toward attacker-controlled content.

### Stage 2: Browser Exploitation

Victim systems were compromised through CVE-2010-0249 in Internet Explorer, giving the operators client-side code execution.

### Stage 3: Backdoor Establishment

Hydraq/Aurora malware provided remote access and enabled the operators to persist long enough to begin internal discovery and tasking.

### Stage 4: Internal Expansion

From the initial foothold, the operators moved toward systems of higher value, especially source-code repositories and communications-related assets.

### Stage 5: Data Collection and Theft

The campaign's operational value came from extracting intellectual property and accessing information tied to dissident and policy-sensitive communications.

## MITRE ATT&CK Mapping

### Initial Access

T1566.002 - Phishing: Spearphishing Link: Targeted delivery drove victims toward malicious content associated with the campaign.

T1189 - Drive-by Compromise: Malicious web content was used to deliver exploitation through the victim browser.

### Execution

T1203 - Exploitation for Client Execution: CVE-2010-0249 in Internet Explorer gave the operators code execution on victim systems.

### Collection

T1005 - Data from Local System: The campaign pursued source code and other high-value data from compromised enterprise environments.

## Timeline

### 2009-06-01 - Campaign Activity Emerges

Public retrospective reporting places the campaign in motion by mid-2009 as operators began targeting major technology firms and related victims.

### 2009-12-01 - Google Detects the Intrusion

Google's internal investigation uncovered the compromise and connected it to broader malicious activity affecting other companies.

### 2010-01-12 - Google Publicly Discloses the Attack

Google's "A new approach to China" post brought the campaign into public view and connected the intrusion to both intellectual property theft and activist-account targeting.

### 2010-01-14 - McAfee Publishes Operation Aurora Analysis

McAfee released technical detail on the campaign and the Internet Explorer exploitation path, helping define the incident for the broader security community.

### 2010-01-21 - Microsoft Issues an Out-of-Band Fix

Microsoft released a security update for CVE-2010-0249, closing the specific client-side exploit chain that had enabled the campaign.

## Remediation & Mitigation

Operation Aurora helped set the modern baseline for defending against targeted espionage at the endpoint and identity layer. The durable lessons remain familiar: reduce browser attack surface, patch aggressively when client-side exploitation is confirmed, segment development infrastructure, and apply stronger monitoring around repository access, privileged identity use, and unusual exfiltration from engineering systems.

For high-risk organizations, targeted-delivery defenses matter as much as perimeter controls. Security teams should pair endpoint hardening with user awareness, tighter browser isolation, strong egress monitoring, and additional scrutiny for environments where source code or politically sensitive communications are stored. The campaign also remains a useful reminder that partial attribution confidence is still enough to drive serious defensive action.

## Sources & References

1. [Google: A new approach to China](https://googleblog.blogspot.com/2010/01/new-approach-to-china.html) - Google, 2010-01-12
2. [CISA: Google China Cyber Attack](https://www.cisa.gov/news-events/alerts/2010/01/14/google-china-cyber-attack) - CISA, 2010-01-14
3. [McAfee: More Details on Operation Aurora](https://www.mcafee.com/blogs/other-blogs/mcafee-labs/more-details-on-operation-aurora/) - McAfee, 2010-01-14
4. [MITRE ATT&CK: Elderwood (G0066)](https://attack.mitre.org/groups/G0066/) - MITRE ATT&CK, 2024-11-17
