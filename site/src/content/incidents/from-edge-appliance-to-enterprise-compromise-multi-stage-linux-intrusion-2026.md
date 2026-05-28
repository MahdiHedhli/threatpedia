---
eventId: "TP-2026-0061"
title: "Multi-Stage Linux Intrusion Pivoted from F5 BIG-IP to Confluence"
date: 2026-05-22
attackType: "Intrusion"
severity: high
sector: "Technology"
geography: "Unknown"
threatActor: "Unknown"
attributionConfidence: A4
reviewStatus: "draft_ai"
confidenceGrade: B
generatedBy: "dangermouse-bot"
generatedDate: 2026-05-28
cves:
  - "CVE-2025-33073"
relatedSlugs: []
tags:
  - "linux"
  - "f5-big-ip"
  - "confluence"
  - "credential-theft"
  - "kerberos-relay"
  - "lateral-movement"
sources:
  - url: "https://www.microsoft.com/en-us/security/blog/2026/05/22/from-edge-appliance-to-enterprise-compromise-multi-stage-linux-intrusion-via-f5-and-confluence"
    publisher: "Microsoft"
    publisherType: vendor
    reliability: R1
    publicationDate: "2026-05-22"
    accessDate: "2026-05-28"
    archived: false
  - url: "https://www.cisa.gov/sites/default/files/feeds/known_exploited_vulnerabilities.json"
    publisher: "Cybersecurity and Infrastructure Security Agency"
    publisherType: government
    reliability: R1
    publicationDate: "2026-05-28"
    accessDate: "2026-05-28"
    archived: false
  - url: "https://confluence.atlassian.com/security/cve-2023-22515-broken-access-control-vulnerability-in-confluence-data-center-and-server-1295682276.html"
    publisher: "Atlassian"
    publisherType: vendor
    reliability: R1
    publicationDate: "2023-10-04"
    accessDate: "2026-05-28"
    archived: false
mitreMappings:
  - techniqueId: "T1021.004"
    techniqueName: "SSH"
    tactic: "Lateral Movement"
    confidence: confirmed
    evidence: "Microsoft reported SSH access from the compromised F5 path into Linux systems."
  - techniqueId: "T1083"
    techniqueName: "File and Directory Discovery"
    tactic: "Discovery"
    confidence: confirmed
    evidence: "Microsoft reported file enumeration activity on Linux hosts."
  - techniqueId: "T1557"
    techniqueName: "Adversary-in-the-Middle"
    tactic: "Credential Access"
    confidence: probable
    evidence: "Microsoft reported attempted NTLM/Kerberos relay activity against domain infrastructure."
---

## Summary

Microsoft reported a multi-stage intrusion that began with an exposed F5 BIG-IP edge appliance and later pivoted into internal Linux and identity infrastructure. The reported intrusion path included access to an internal Confluence server, credential theft, and follow-on attempts to abuse authentication flows for broader access.

The report describes both Linux-host activity and domain-focused follow-on activity. The threat actor was not publicly named in the cited sources.

## Technical Analysis

According to Microsoft, the actor gained an initial foothold through a compromised edge path associated with F5 BIG-IP and then used SSH and shell execution across Linux systems. The actor conducted discovery, transferred tools, and moved laterally to an internal Confluence server.

Microsoft described credential theft, subsequent exploitation of CVE-2025-33073, and attempted Kerberos/NTLM relay behavior against domain infrastructure.

For broader defensive context, CISA KEV data and Atlassian’s CVE-2023-22515 advisory provide current vendor/government reference material relevant to edge and Confluence exposure management.

## Attack Chain

### Stage 1: Edge Foothold

Initial access was established through the edge environment associated with F5 BIG-IP.

### Stage 2: Linux Execution and Discovery

The actor used SSH, shell commands, and tooling on Linux hosts to enumerate files and reachable services.

### Stage 3: Internal Pivot to Confluence

The actor moved laterally to an internal Confluence server and performed further execution and credential access activity.

### Stage 4: Authentication Abuse Attempts

After obtaining credentials, the actor attempted relay-style authentication abuse against domain services.

## Impact Assessment

The reported activity shows risk of escalation from perimeter compromise to enterprise identity compromise. Observed behaviors included host execution, tool transfer, internal pivoting, and attempted credential abuse against domain infrastructure.

Public sources do not provide a confirmed victim count for this event.

## Attribution

The threat actor remains unknown for this incident. Available documentation provides behavioral and infrastructure details, but no government-confirmed named actor attribution was identified.

## Timeline

### 2026-05-22 — Microsoft intrusion case published

Microsoft published the multi-stage Linux intrusion case describing compromise flow from edge appliance to internal systems and identity-focused follow-on activity.

## Remediation & Mitigation

Prioritize patching and mitigation for internet-facing edge systems and internal critical applications, including F5 BIG-IP and Confluence instances noted in the cited material. Restrict management-plane exposure and limit reachable admin surfaces.

For identity-layer hardening, apply controls that reduce relay abuse paths, including stronger authentication channel protections and restrictions on legacy authentication paths where operationally feasible. Ensure consistent endpoint telemetry and prevention coverage across Linux servers and investigate signs of compromise before returning affected systems to production trust.

## Sources & References

- [Microsoft: From edge appliance to enterprise compromise: Multi-stage Linux intrusion via F5 and Confluence](https://www.microsoft.com/en-us/security/blog/2026/05/22/from-edge-appliance-to-enterprise-compromise-multi-stage-linux-intrusion-via-f5-and-confluence) — Microsoft, 2026-05-22
- [Cybersecurity and Infrastructure Security Agency: Known Exploited Vulnerabilities Catalog JSON Feed](https://www.cisa.gov/sites/default/files/feeds/known_exploited_vulnerabilities.json) — Cybersecurity and Infrastructure Security Agency, 2026-05-28
- [Atlassian: CVE-2023-22515 - Broken Access Control Vulnerability in Confluence Data Center and Server](https://confluence.atlassian.com/security/cve-2023-22515-broken-access-control-vulnerability-in-confluence-data-center-and-server-1295682276.html) — Atlassian, 2023-10-04
