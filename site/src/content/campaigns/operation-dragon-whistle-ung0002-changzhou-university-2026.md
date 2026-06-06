---
campaignId: "TP-CAMP-2026-0349"
title: "Operation Dragon Whistle UNG0002 Spear-Phishing Campaign"
startDate: 2026-04-28
endDate: 2026-05-20
ongoing: false
attackType: "Spear-phishing"
severity: medium
sector: "Education / Higher Education"
geography: "China"
threatActor: "UNG0002"
attributionConfidence: A4
reviewStatus: draft_ai
confidenceGrade: C
generatedBy: dangermouse-bot
generatedDate: 2026-06-06
generation:
  provider: openai
  model: gpt-5.3-spark
  tool: codex
  agent: dangermouse-bot
  promptProfile: threatpedia-pipeline-article
cves: []
relatedIncidents: []
tags:
  - operation-dragon-whistle
  - ung0002
  - spear-phishing
  - cobalt-strike
  - dll-side-loading
  - education-sector
sources:
  - url: "https://www.seqrite.com/blog/operation-dragon-whistle-ung002-targets-chinese-academia-via-weaponized-institutional-lure"
    publisher: "Seqrite"
    publisherType: vendor
    reliability: R1
    publicationDate: "2026-05-20"
    accessDate: "2026-06-06"
    archived: false
  - url: "https://news.risky.biz/risky-bulletin-microsoft-ends-sms-mfa-for-personal-accounts/"
    publisher: "Risky Bulletin"
    publisherType: media
    reliability: R2
    publicationDate: "2026-05-22"
    accessDate: "2026-06-06"
    archived: false
  - url: "https://pe.cczu.edu.cn/2026/0428/c309a414600/page.htm"
    publisher: "Changzhou University"
    publisherType: government
    reliability: R1
    publicationDate: "2026-04-28"
    accessDate: "2026-06-06"
    archived: false
mitreMappings:
  - techniqueId: "T1566.001"
    techniqueName: "Spearphishing Attachment"
    tactic: "Initial Access"
    attack-version: "v19"
    confidence: confirmed
    evidence: "Seqrite reported a spear-phishing email carrying a ZIP attachment named as a final Changzhou University 2026 National Student Physical Fitness and Health Standards testing notice."
  - techniqueId: "T1204.002"
    techniqueName: "Malicious File"
    tactic: Execution
    attack-version: "v19"
    confidence: confirmed
    evidence: "Seqrite described victim execution of a double-extension LNK file masquerading as a PDF document inside the ZIP archive."
  - techniqueId: "T1059.005"
    techniqueName: "Visual Basic"
    tactic: Execution
    attack-version: "v19"
    confidence: confirmed
    evidence: "Seqrite reported that the LNK triggered a VBScript file named chromedo.vbs, which opened the decoy PDF and launched Bandizip.exe."
  - techniqueId: "T1574"
    techniqueName: "Hijack Execution Flow"
    tactic: "Defense Evasion"
    attack-version: "v19"
    confidence: confirmed
    evidence: "Seqrite reported that a legitimate Bandizip.exe instance loaded attacker-controlled ark.x64.dll from the local directory."
  - techniqueId: "T1071.001"
    techniqueName: "Web Protocols"
    tactic: "Command and Control"
    attack-version: "v19"
    confidence: probable
    evidence: "Seqrite reported a Cobalt Strike Beacon and C2 infrastructure resolving to 60.205.186.162 and lysander.asia."
---

## Executive Summary

Operation Dragon Whistle is a May 2026 spear-phishing campaign reported by Seqrite Labs as targeting students and faculty at Changzhou University in China. The lure impersonated university administrative communication about the 2026 National Student Physical Fitness and Health Standards testing cycle, a real institutional process documented by Changzhou University's School of Physical Education and China Sports Industry Institute.

Seqrite reported that the phishing email delivered a ZIP attachment named as a final testing notice. The archive contained a double-extension LNK file masquerading as a PDF, a decoy document, hidden nested folders, a VBScript launcher, a legitimate Bandizip executable, and a malicious DLL. The execution chain used DLL side-loading to load `ark.x64.dll`, then decrypted and executed a Cobalt Strike Beacon in memory.

Seqrite attributed the campaign to UNG0002 with medium-high confidence, citing overlap with its previously documented Operation Cobalt Whisper activity, including LNK and VBScript tradecraft and Chinese cloud infrastructure preferences. No government source in the reviewed set confirms the intrusion activity or attribution; the university source is used only to corroborate the real-world testing notice and lure context.

## Technical Analysis

The lure was built around Changzhou University's 2026 National Student Physical Fitness and Health Standards retesting notice. The university notice, published April 28, 2026, described testing objects, dates, indoor and outdoor test items, documentation expectations, contact details, and a QQ group for student coordination. Seqrite reported that the malicious decoy mirrored these kinds of institutional details to increase credibility.

Seqrite said the spear-phishing email used the sender display name "牛牛 (Cow Cat)" from a 163.com address and carried a ZIP attachment with a Chinese filename corresponding to a Changzhou University testing notice. The ZIP placed a double-extension `.pdf.lnk` file at the root of the archive, while payload files were buried in nested folders that resembled macOS metadata structures.

The LNK file invoked `explorer.exe` to execute a VBScript payload instead of directly launching `wscript.exe` or `cscript.exe`. The VBScript opened the decoy PDF and then launched `Bandizip.exe` from a hidden folder after a short delay, allowing the victim to see plausible document content while the malicious path continued.

The next phase used DLL side-loading. Seqrite reported that the legitimate Bandizip executable loaded attacker-controlled `ark.x64.dll` from its local directory. The DLL export `CreateArk` implemented anti-debugging and analysis-evasion checks, including timing checks, debugger checks, process enumeration, and detection of tools such as Wireshark, Procmon, TCPView, Dumpcap, Fiddler, and Charles.

After the environment checks, the malware decrypted an SFX payload in memory, attempted to interfere with AMSI and ETW telemetry, and then loaded a Cobalt Strike Beacon without writing the final-stage executable to disk. Seqrite listed `60.205.186.162` and `lysander.asia` as infrastructure associated with the campaign.

## Attack Chain

### Stage 1: Institutional lure preparation

The actor prepared a phishing lure around Changzhou University's mandatory physical-fitness testing cycle. The official university notice confirms that the testing program, date ranges, student categories, and administrative context existed independently of the malicious email.

### Stage 2: Spear-phishing delivery

Seqrite reported a targeted email sent from a 163.com account with a ZIP attachment named as a final Changzhou University testing notice. The lure relied on urgency and compliance pressure tied to graduation and missing fitness-test results.

### Stage 3: LNK and VBScript execution

The victim-facing file appeared to be a PDF but was a double-extension LNK file. When opened, it triggered a buried VBScript launcher, which displayed a decoy PDF and launched the next-stage executable from a hidden directory.

### Stage 4: DLL side-loading

The campaign used a legitimate Bandizip executable to side-load `ark.x64.dll`. Running the malicious DLL under a trusted process context reduced visibility and blended the malware path with a legitimate archive-management application.

### Stage 5: In-memory Cobalt Strike loading

Seqrite reported that the DLL decrypted and loaded an SFX payload in memory, bypassed or interfered with AMSI and ETW visibility, and then decrypted and launched a Cobalt Strike Beacon for command-and-control communication.

### Stage 6: Infrastructure and attribution pivots

Seqrite pivoted from Bandizip artifacts, machine IDs in LNK files, shared Cobalt Strike beacon characteristics, and C2 infrastructure to associate the activity with UNG0002. The report cited `60.205.186.162`, `lysander.asia`, Alibaba Cloud hosting, HiChina nameservers, and Feishu MX records as infrastructure or operational signals.

## MITRE ATT&CK Mapping

**T1566.001 - Spearphishing Attachment**: Seqrite reported a targeted spear-phishing email carrying a ZIP attachment impersonating a Changzhou University fitness-testing notice.

**T1204.002 - User Execution: Malicious File**: The infection chain required interaction with a double-extension LNK file presented as the expected PDF notice.

**T1059.005 - Command and Scripting Interpreter: Visual Basic**: The LNK launched `chromedo.vbs`, which orchestrated the decoy display and malicious executable launch.

**T1574.002 - DLL Side-Loading**: The campaign used legitimate `Bandizip.exe` to load attacker-controlled `ark.x64.dll` from the local directory.

**T1622 - Debugger Evasion** and **T1497 - Virtualization/Sandbox Evasion**: Seqrite described debugger and analysis-environment checks before payload execution.

**T1071.001 - Application Layer Protocol: Web Protocols**: Seqrite reported Cobalt Strike Beacon command-and-control behavior after the in-memory loader stage.

## Timeline

### 2026-04-28 - Changzhou University publishes testing notice

Changzhou University's School of Physical Education and China Sports Industry Institute published a 2026 National Student Physical Fitness and Health Standards retesting notice. The notice established the real-world administrative context later mirrored by the phishing lure.

### 2026-05-19 - Infrastructure reported active

Seqrite stated that C2 infrastructure resolving to `lysander.asia` at `60.205.186.162` had been active since April 6, 2026 and remained live as of May 19, 2026.

### 2026-05-20 - Seqrite publishes Operation Dragon Whistle analysis

Seqrite published its technical analysis of the campaign, including the spear-phishing lure, LNK/VBScript execution chain, Bandizip DLL side-loading, anti-analysis checks, in-memory Cobalt Strike loading, IOCs, and UNG0002 attribution.

### 2026-05-22 - Risky Bulletin summarizes the campaign

Risky Bulletin summarized Seqrite's reporting, describing UNG0002 as targeting students and faculty at Changzhou University with a mandatory fitness-assessment lure.

## Remediation & Mitigation

Universities and education-sector organizations should treat institution-specific administrative notices as high-value phishing themes. Security teams should warn students and faculty to verify urgent testing, grading, graduation, financial-aid, and compliance notices through official portals before opening attachments.

Email defenses should inspect archives for double-extension LNK files, nested metadata-like folder structures, and executable content hidden behind document-themed filenames. Attachment handling policies should block or detonate LNK files and scripts delivered in ZIP archives, especially when the email sender uses free webmail rather than an official university domain.

Endpoint detections should monitor for `explorer.exe` launching VBScript, VBScript launching unexpected archive utilities, Bandizip loading `ark.x64.dll` from a nonstandard local directory, and Cobalt Strike Beacon behavior following DLL side-loading. Seqrite-published hashes and infrastructure indicators should be added to detection and retrohunt workflows where applicable.

Network controls should review traffic to `60.205.186.162` and domains associated with the campaign, including `lysander.asia`, while recognizing that infrastructure may rotate. Blocking should be paired with behavioral detections for LNK/VBS/DLL side-loading chains rather than relying only on static indicators.

Incident responders should preserve the original ZIP, LNK, VBScript, DLL, and decoy document artifacts if a suspected infection is found. Those files are useful for confirming lure lineage, infrastructure overlap, and possible relationship to the UNG0002 activity described by Seqrite.

## Sources & References

- [Seqrite: Operation Dragon Whistle: UNG0002 Targets Chinese Academia via Weaponized Institutional Lure](https://www.seqrite.com/blog/operation-dragon-whistle-ung002-targets-chinese-academia-via-weaponized-institutional-lure) — Seqrite, 2026-05-20
- [Risky Bulletin: Microsoft ends SMS MFA for personal accounts](https://news.risky.biz/risky-bulletin-microsoft-ends-sms-mfa-for-personal-accounts/) — Risky Bulletin, 2026-05-22
- [Changzhou University: 2026 National Student Physical Fitness and Health Standards retesting notice](https://pe.cczu.edu.cn/2026/0428/c309a414600/page.htm) — Changzhou University, 2026-04-28
