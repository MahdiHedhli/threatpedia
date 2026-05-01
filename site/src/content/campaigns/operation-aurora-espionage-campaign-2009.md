---
campaignId: "TP-CAMP-2009-0001"
title: "Operation Aurora Espionage Campaign"
startDate: 2009-06-01
endDate: 2010-01-21
ongoing: false
attackType: "Espionage"
severity: critical
sector: "Technology"
geography: "Global"
threatActor: "Unknown"
attributionConfidence: A3
reviewStatus: "draft_ai"
confidenceGrade: B
generatedBy: "kernel-k"
generatedDate: 2026-05-01
cves:
  - "CVE-2010-0249"
relatedIncidents:
  - "operation-aurora-espionage-2009"
tags:
  - "operation-aurora"
  - "espionage"
  - "china"
  - "google"
  - "adobe"
  - "internet-explorer"
  - "hydraq"
sources:
  - url: "https://googleblog.blogspot.com/2010/01/new-approach-to-china.html"
    publisher: "Google"
    publisherType: vendor
    reliability: R1
    publicationDate: "2010-01-12"
    accessDate: "2026-05-01"
    archived: false
  - url: "https://www.cisa.gov/news-events/alerts/2010/01/14/google-china-cyber-attack"
    publisher: "CISA"
    publisherType: government
    reliability: R1
    publicationDate: "2010-01-14"
    accessDate: "2026-05-01"
    archived: false
  - url: "https://www.mcafee.com/blogs/other-blogs/mcafee-labs/more-details-on-operation-aurora/"
    publisher: "McAfee"
    publisherType: vendor
    reliability: R1
    publicationDate: "2010-01-14"
    accessDate: "2026-05-01"
    archived: false
  - url: "https://attack.mitre.org/groups/G0066/"
    publisher: "MITRE ATT&CK"
    publisherType: research
    reliability: R1
    publicationDate: "2024-11-17"
    accessDate: "2026-05-01"
    archived: false
mitreMappings:
  - techniqueId: "T1566.002"
    techniqueName: "Phishing: Spearphishing Link"
    tactic: "Initial Access"
    notes: "Targeted delivery moved selected users toward malicious content associated with the operation."
  - techniqueId: "T1189"
    techniqueName: "Drive-by Compromise"
    tactic: "Initial Access"
    notes: "The operators used web-delivered exploitation against Internet Explorer to establish initial access."
  - techniqueId: "T1203"
    techniqueName: "Exploitation for Client Execution"
    tactic: "Execution"
    notes: "CVE-2010-0249 enabled client-side code execution in exposed victim browsers."
  - techniqueId: "T1005"
    techniqueName: "Data from Local System"
    tactic: "Collection"
    notes: "The operation pursued source code, intellectual property, and selected communications from compromised environments."
---

## Executive Summary

Operation Aurora was a 2009 espionage operation publicly disclosed by Google in January 2010 after intrusions affected Google and other technology companies. Public reporting described theft of intellectual property and targeting of accounts associated with Chinese human-rights activism, placing the activity at the intersection of industrial espionage and political intelligence collection.

Operation Aurora extended across multiple organizations through a coordinated activity set involving targeted delivery, exploitation of Internet Explorer CVE-2010-0249, Hydraq/Aurora malware, and follow-on access to high-value corporate systems.

Public sources connect the activity to operators in China, but the exact public group label remains less settled than later campaigns with formal government attribution.

## Technical Analysis

The documented technical path involved targeted delivery to employees at high-value technology firms. Victims were directed to malicious web content, and successful exploitation of CVE-2010-0249 in Internet Explorer gave the operators code execution on exposed endpoints. The exploitation chain installed Hydraq, also referred to as Aurora, which provided remote access for follow-on activity.

The operators used that access to pursue systems holding strategic value rather than criminal monetization. Google described theft of intellectual property and attempted access to Gmail accounts tied to Chinese human-rights advocates. McAfee reporting and later ATT&CK references connected the activity to web exploitation, remote access malware, and collection activity against technology-sector victims.

The consistent technical picture is targeted delivery, client-side exploitation, remote access malware, internal discovery, and collection from systems containing source code or sensitive communications.

## Attack Chain

### Stage 1: Target Selection

Operators selected employees and organizations with access to strategic technology, source code, or sensitive communications.

### Stage 2: Targeted Delivery

Selected users were driven toward malicious web content through targeted links and related delivery mechanisms.

### Stage 3: Browser Exploitation

CVE-2010-0249 in Internet Explorer gave the operators client-side execution on vulnerable systems.

### Stage 4: Remote Access Establishment

Hydraq/Aurora malware provided remote access that allowed the operators to continue internal discovery and tasking.

### Stage 5: Internal Collection

The operation focused on intellectual property, source-code repositories, and selected communications rather than opportunistic financial theft.

## MITRE ATT&CK Mapping

### Initial Access

T1566.002 - Phishing: Spearphishing Link: Targeted links and related delivery paths moved victims toward attacker-controlled content.

T1189 - Drive-by Compromise: Malicious web content delivered exploitation through the victim browser.

### Execution

T1203 - Exploitation for Client Execution: CVE-2010-0249 enabled arbitrary code execution in Internet Explorer.

### Collection

T1005 - Data from Local System: Operators pursued source code and other high-value local or enterprise data after gaining access.

## Timeline

### 2009-06-01 — Activity Window Begins

Public retrospective reporting places Operation Aurora activity in motion by mid-2009, before the public disclosure cycle began.

### 2009-12-01 — Google Investigates Intrusion Activity

Google's internal investigation connected its compromise to malicious activity affecting other companies.

### 2010-01-12 — Google Publicly Discloses the Intrusions

Google disclosed the attack activity and described both intellectual property theft and targeting related to Chinese human-rights activism.

### 2010-01-14 — CISA and McAfee Publish Public Guidance

CISA issued an alert on the Google China cyber attack, and McAfee published technical details that helped define the Operation Aurora label.

### 2010-01-21 — Microsoft Releases Out-of-Band Patch

Microsoft issued an out-of-band security update for CVE-2010-0249, closing the Internet Explorer exploit path used in the operation.

## Remediation & Mitigation

Operation Aurora remains relevant because it showed how targeted client-side exploitation can become strategic enterprise access. Defenders should reduce browser attack surface, patch client software when active exploitation is confirmed, and monitor high-value development and communications systems for unusual access, staging, or exfiltration.

The operation also supports controls around source-code environments and politically sensitive communications. Useful controls include browser isolation for high-risk users, egress monitoring, identity protections around repository access, and segmentation between user workstations and systems that store intellectual property.


## Sources & References

- [Google: A new approach to China](https://googleblog.blogspot.com/2010/01/new-approach-to-china.html) — Google, 2010-01-12
- [CISA: Google China Cyber Attack](https://www.cisa.gov/news-events/alerts/2010/01/14/google-china-cyber-attack) — CISA, 2010-01-14
- [McAfee: More Details on Operation Aurora](https://www.mcafee.com/blogs/other-blogs/mcafee-labs/more-details-on-operation-aurora/) — McAfee, 2010-01-14
- [MITRE ATT&CK: Elderwood](https://attack.mitre.org/groups/G0066/) — MITRE ATT&CK, 2024-11-17
