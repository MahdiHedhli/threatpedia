---
eventId: TP-2026-0045
title: "Operation TrueChaos: TrueConf Update Hijack Against Southeast Asian Government Networks"
date: 2026-03-31
attackType: supply-chain
severity: critical
sector: Government / International
geography: Southeast Asia
threatActor: Chinese-nexus (unattributed)
attributionConfidence: A4
reviewStatus: under_review
confidenceGrade: C
generatedBy: dangermouse-bot
generatedDate: 2026-04-18
cves:
  - "CVE-2026-3502"
relatedSlugs: []
tags:
  - "zero-day"
  - "supply-chain"
  - "trueconf"
  - "china"
  - "government"
  - "southeast-asia"
  - "update-mechanism"
  - "havoc-c2"
  - "dll-sideloading"
  - "cisa-kev"
sources:
  - url: "https://research.checkpoint.com/2026/operation-truechaos-0-day-exploitation-against-southeast-asian-government-targets/"
    publisher: "Check Point Research"
    publisherType: vendor
    reliability: R1
    publicationDate: "2026-03-31"
    accessDate: "2026-04-18"
    archived: false
  - url: "https://nvd.nist.gov/vuln/detail/CVE-2026-3502"
    publisher: "National Vulnerability Database"
    publisherType: government
    reliability: R1
    publicationDate: "2026-03-30"
    accessDate: "2026-04-18"
    archived: false
  - url: "https://trueconf.com/blog/update/trueconf-8-5-3"
    publisher: "TrueConf"
    publisherType: vendor
    reliability: R1
    publicationDate: "2026-04-01"
    accessDate: "2026-04-18"
    archived: false
  - url: "https://www.bleepingcomputer.com/news/security/hackers-exploit-trueconf-zero-day-to-push-malicious-software-updates/"
    publisher: "BleepingComputer"
    publisherType: media
    reliability: R2
    publicationDate: "2026-04-02"
    accessDate: "2026-04-18"
    archived: false
mitreMappings:
  - techniqueId: "T1195.002"
    techniqueName: "Supply Chain Compromise: Compromise Software Supply Chain"
    tactic: "Initial Access"
    notes: "Attackers abused the trusted TrueConf on-premises update relationship to distribute a trojanized client package."
  - techniqueId: "T1574.002"
    techniqueName: "Hijack Execution Flow: DLL Side-Loading"
    tactic: "Defense Evasion"
    notes: "Check Point observed the malicious update dropping files used for DLL sideloading through PowerISO and the iSCSI control panel path."
---
## Executive Summary

Operation TrueChaos is the name Check Point Research gave to a targeted espionage campaign that abused the TrueConf Windows client update flow in Southeast Asian government environments. The core vulnerability, tracked as CVE-2026-3502, allowed an attacker who controlled an on-premises TrueConf server to replace the expected client update with an arbitrary executable because the client did not verify the integrity or authenticity of the downloaded package.

In the observed intrusions, attackers replaced the legitimate update with a weaponized installer that still upgraded the client version while also dropping malicious components used for DLL sideloading and post-exploitation activity. Check Point assessed with moderate confidence that the activity was associated with a Chinese-nexus threat actor based on victimology, infrastructure, and tradecraft. TrueConf addressed the flaw in version 8.5.3, and CISA later added CVE-2026-3502 to the Known Exploited Vulnerabilities catalog.

This article is the canonical incident entry for the TrueConf / Operation TrueChaos exploitation cluster. The duplicate incident variant that previously focused only on the CVE has been retired behind a legacy redirect.

## Timeline

Early 2026
Check Point Research observed targeted activity affecting Southeast Asian government networks that relied on on-premises TrueConf infrastructure.

March 2026
TrueConf released desktop app version 8.5.3, which included the vendor's security fixes for March 2026.

2026-03-31
Check Point Research publicly disclosed Operation TrueChaos and CVE-2026-3502, describing both the root cause and the in-the-wild exploitation chain.

2026-04-02
CISA added CVE-2026-3502 to the Known Exploited Vulnerabilities catalog with a remediation deadline of April 16, 2026 for federal agencies.

## Technical Analysis

### Root Cause

According to Check Point Research and the NVD description, the TrueConf Windows client compared its local version to the version exposed by the connected on-premises server and then offered to download `trueconf_client.exe` from the server if the server advertised a newer build. The client trusted that server-supplied update package without performing adequate integrity or authenticity verification. That made the update path vulnerable to tampering once an attacker gained control of the on-premises TrueConf server.

### Observed Delivery Chain

Check Point reported that the malicious package was built to look like a normal client update and successfully upgraded the victim systems to the then-current TrueConf version. Alongside the legitimate application components, the trojanized package dropped `poweriso.exe` and a malicious `7z-x64.dll` payload into `C:\\ProgramData\\PowerISO\\`, creating a DLL sideloading path that blended into normal-looking software execution.

The attacker then used the dropped components to perform hands-on-keyboard follow-on activity, including reconnaissance, archive retrieval, and UAC bypass by abusing the auto-elevated `iscsicpl.exe` binary with a malicious `iscsiexe.dll`. Check Point did not recover the exact final payload from the original chain, but it observed communications to attacker infrastructure and linked the activity to Havoc command-and-control infrastructure with high confidence.

### Scope and Constraints

This was not a vendor-wide SolarWinds-style global build compromise. The public reporting instead supports a narrower but still high-impact attack in which the adversary compromised a customer-operated, on-premises TrueConf server that served many downstream government users. That distinction matters: the incident still had supply-chain characteristics, but the trust relationship that was abused lived inside the victim deployment rather than the vendor's central build pipeline.

## Impact Assessment

The observed victim environment was operated by a governmental IT department that served dozens of government entities across one Southeast Asian country. Because all of those users depended on the same TrueConf server for updates, compromising a single update source gave the attacker a scalable path into many downstream government endpoints.

The operational impact was therefore twofold. First, the attacker obtained a malware delivery channel into trusted government systems. Second, the post-exploitation tooling created the possibility of reconnaissance, persistence, credential access, and broader espionage activity across agencies that shared the compromised communications platform.

## Historical Context

Check Point Research assessed with moderate confidence that Operation TrueChaos was associated with a Chinese-nexus threat actor. That assessment was based on the campaign's regional victimology, the observed use of Alibaba Cloud and Tencent-hosted infrastructure, and tradecraft overlaps such as DLL sideloading and hands-on-keyboard espionage behavior.

That is stronger than pure "unknown actor" reporting, but it still falls short of naming a specific public APT cluster with confidence. The safest framing for the public corpus is therefore "Chinese-nexus (unattributed)" rather than a precise actor name.

## MITRE ATT&CK Mapping

T1195.002 — Supply Chain Compromise: Compromise Software Supply Chain
The attacker abused the trusted update relationship between the TrueConf server and connected clients to distribute a malicious update package.

T1574.002 — Hijack Execution Flow: DLL Side-Loading
The malicious update dropped files used for DLL sideloading, including `7z-x64.dll` loaded via `poweriso.exe`.

## Remediation & Mitigation

1. Upgrade all TrueConf Windows clients to version 8.5.3 or later.
2. Audit on-premises TrueConf servers for unauthorized changes in `ClientInstFiles` and any unsigned or unexpected update binaries.
3. Hunt for the file and infrastructure indicators published by Check Point, including `22e32bcf113326e366ac480b077067cf`, `9b435ad985b733b64a6d5f39080f4ae0`, `248a4d7d4c48478dcbeade8f7dba80b3`, `43.134.90[.]60`, `43.134.52[.]221`, and `47.237.15[.]197`.
4. Investigate any system where `C:\\ProgramData\\PowerISO\\poweriso.exe` appeared unexpectedly or where the `UpdateCheck` autorun path was modified.
5. Treat affected environments as potential espionage intrusions and rotate credentials, preserve forensic evidence, and expand hunting to related tooling such as Havoc or ShadowPad if compromise indicators are present.

## Sources & References

- [Check Point Research — Operation TrueChaos: 0-Day Exploitation Against Southeast Asian Government Targets](https://research.checkpoint.com/2026/operation-truechaos-0-day-exploitation-against-southeast-asian-government-targets/)
- [National Vulnerability Database — CVE-2026-3502](https://nvd.nist.gov/vuln/detail/CVE-2026-3502)
- [TrueConf — TrueConf 8.5.3: Useful Changes and Improvements](https://trueconf.com/blog/update/trueconf-8-5-3)
- [BleepingComputer — Hackers Exploit TrueConf Zero-Day to Push Malicious Software Updates](https://www.bleepingcomputer.com/news/security/hackers-exploit-trueconf-zero-day-to-push-malicious-software-updates/)
