---
exploitId: TP-EXP-2026-0001
title: BlueHammer — Windows Defender LPE via VSS Race Condition
cve: UNASSIGNED
type: LPE
platform: Windows 10 / 11
severity: critical
status: active
isZeroDay: true
cisaKev: false
reviewStatus: certified
generatedBy: manual-zero-day-ingestion
generatedDate: 2026-04-03
relatedIncidents:
  - "bluehammer-windows-defender-zero-day-2026"
  - "chrome-cve-2026-5281-zero-day"
  - "forticlient-ems-cve-2026-35616"
relatedActors: []
tags:
  - "bluehammer"
  - "windows-lpe"
  - "toctou"
  - "vss-abuse"
  - "windows-defender"
  - "cloud-files-api"
  - "sam-dump"
  - "ntlm-hash"
  - "zero-day"
  - "public-poc"
  - "unpatched"
  - "race-condition"
  - "full-disclosure"
  - "mitre-attack"
  - "sigma-rules"
  - "yara-rules"
  - "detection-engineering"
  - "snek-fork"
  - "sans-isc"
disclosedDate: 2026-04-03
researcher: Chaotic Eclipse / Nightmare-Eclipse
confirmedBy: Will Dormann (Tharros)
daysInTheWild: 5
---
## Executive Summary

BlueHammer is an unpatched Windows zero-day that allows a low-privileged local user to escalate to NT AUTHORITY\SYSTEM on fully updated Windows 10 and 11. The exploit chains Microsoft Defender's signature update workflow, Volume Shadow Copy Service, the Cloud Files API, and opportunistic locks to freeze Defender at exactly the wrong moment, then reads the SAM registry hive from the snapshot Defender itself created.

No kernel exploit. No memory corruption. No code execution inside Defender. Exploitation verified end-to-end by Cyderes Howler Cell in under 60 seconds on patched systems. Defender's static signature detects the original binary; the underlying technique does not.

🔍

## Technical Metadata

Exploit Type
Local Privilege Escalation (LPE)

CVE Identifier
UNASSIGNED

CISA KEV Listed
No

Exploit Primitive
TOCTOU + Path Confusion

Public Disclosure
2026-04-03

Patch Status
NONE (Unpatched)

Researcher / Team
Chaotic Eclipse / Nightmare-Eclipse

Confirmed By
Will Dormann (Tharros)

Affected Systems
Windows 10 / 11 (fully patched)

PoC Status
Public / Active Iteration

Weaponization
Moderate-to-High Risk

Initial Report Date
2026-03-26 (blog)

⛓️

## 7-Step Exploit Chain

1

Gate: Check for Pending Defender Signature Update

Queries Windows Update COM interfaces for "Microsoft Defender Antivirus" + "Definition Updates." Chain halts if no pending update.

API: IUpdateSearcher → IUpdateSession → IUpdateCollection

2

Download & Stage the Real Update Package

Fetches legitimate Defender update PE from Microsoft CDN, extracts CAB from .rsrc, unpacks in memory, stages for spoofed RPC via NTFS junctions.

API: go.microsoft.com/fwlink/?LinkID=121721&arch=x64 → FDICopy

3

Trigger Defender Scan via EICAR + Oplock Tripwire

Drops EICAR test file (foo.exe), places batch oplock on RstrtMgr.dll. When Defender accesses it during remediation, oplock breaks — confirming VSS creation.

API: BatchOplock on RstrtMgr.dll · NtQueryDirectoryObject watching HarddiskVolumeShadowCopy*

4

Register Cloud Files Sync Root + Set Timing Trap

Registers working directory as Cloud Files sync root, drops .lock placeholder. When Defender enumerates it, CfCallbackFetchPlaceholders fires, confirms WinDefend PID, acquires batch oplock and holds it.

API: CfRegisterSyncRoot · CfConnectSyncRoot · CfCallbackFetchPlaceholders · GetOverlappedResult (blocks indefinitely)

5

Read SAM / SYSTEM / SECURITY From Mounted Snapshot

With Defender frozen and VSS snapshot mounted, reads registry hives directly from shadow copy path.

API: \Device\HarddiskVolumeShadowCopy[N]\Windows\System32\Config\{SAM,SYSTEM,SECURITY}

6

Reconstruct Boot Key + Decrypt NTLM Hashes

Reads JD, Skew1, GBG, Data from Control\Lsa for 16-byte boot key. Decrypts LSA secret key, extracts Password Encryption Key, AES+DES decrypts NTLM hashes.

API: Impacket-style extraction · offreg.h offline registry library

7

Pivot to SYSTEM + Self-Cleaning Shell Spawn

SamiChangePasswordUser resets local Admin to $PWNed666!!!WDFAIL. LogonUserEx authenticates. Token duplicated + SYSTEM integrity. CreateService spawns cmd.exe as SYSTEM. Then restores original hash.

API: SamiChangePasswordUser · LogonUserEx · CreateService · DuplicateToken → SYSTEM integrity

🎯

## Detection Guidance

HIGH CONFIDENCE
VSS ENUMERATION

Monitor for NtQueryDirectoryObject targeting HarddiskVolumeShadowCopy* from non-system processes. This is highly specific to BlueHammer's timing confirmation mechanism.

HIGH CONFIDENCE
CLOUD FILES REGISTRATION

Alert on CfRegisterSyncRoot called by non-sync software (non-OneDrive, non-SharePoint Sync), especially with empty or .lock placeholders.

HIGH CONFIDENCE
SERVICE CREATION FROM LOW-PRIVILEGE CONTEXT

Flag CreateService or acquisition of SYSTEM token from standard user context. BlueHammer's final stage spawns cmd.exe as a service.

MEDIUM CONFIDENCE
PASSWORD CYCLE ANOMALY

Monitor Event ID 4723 + 4724 on the same local Admin account in rapid succession (<60 seconds). BlueHammer resets and restores the Admin password to pivot.

MEDIUM CONFIDENCE
STATIC SIGNATURE (BINARY ONLY)

Exploit:Win32/DfndrPEBluHmr.BB detects the compiled original PoC. Bypassed by recompile. Recommended only as temporal hedge; build behavioral detection as priority.

🔎

## Indicators of Compromise

Type
Value
Severity
Notes

String
$PWNed666!!!WDFAIL
Critical
Hardcoded pivot password in PoC

String
IHATEMICROSOFT
Critical
Cloud Files provider name in PoC

RPC UUID
c503f532-443a-4c69-8300-ccd1fbdb3839
Medium
IMpService RPC interface GUID

LRPC Endpoint
IMpService77BDAF73-B396-481F-9042-AD358843EC24
Medium
RPC endpoint name spoofed in Chain Step 2

RPC Method
Proc42_ServerMpUpdateEngineSignature
Medium
Hooked RPC method for signature injection

URL
go.microsoft.com/fwlink/?LinkID=121721&arch=x64
Info
Legitimate Defender update CDN (used for staging)

Defender Sig
Exploit:Win32/DfndrPEBluHmr.BB
Info
Static signature; binary detection only

Filename
FunnyApp.cpp / FunnyApp.exe
Info
PoC source and compiled binary

🛡️

## Mitigations & Defenses

1. Audit Local Administrator Accounts

BlueHammer requires at least one enabled local admin with recoverable hash. Identify and document all local admins; disable unused accounts and enforce strong password policies.

2. Enforce Least Privilege

Exploit begins from standard user context. Implement role-based access control (RBAC), remove users from local admin groups unless functionally required, and audit group membership quarterly.

3. Deploy Behavioral EDR Coverage

Static detection won't hold once PoC is modified. Prioritize EDR agents with VSS enumeration monitoring, oplock tracking, and Cloud Files API introspection. Require AMSI + script block logging for PowerShell.

4. Enable Event IDs 4723 / 4724

Monitor for two password changes in quick succession on the same local Admin account. This is a high-confidence indicator of BlueHammer's pivot-and-restore phase.

5. Keep Defender Signatures Updated

Current static signature (Exploit:Win32/DfndrPEBluHmr.BB) detects the unmodified PoC binary. Enforce automatic updates and monitor signature age across the fleet.

📅

## Disclosure Timeline

2026-03-26

First blog post by Chaotic Eclipse — Researcher publicly teases BlueHammer, announces PGP key forthcoming.

2026-04-02

PGP key published — Chaotic Eclipse releases public key; full disclosure imminent.

2026-04-03

Full drop — BlueHammer PoC published to GitHub — Complete exploit source code, documentation, and build instructions released to github.com/Nightmare-Eclipse/BlueHammer.

2026-04-04

Community validation begins — Researchers from vx-underground, Will Dormann (Tharros), and others independently verify end-to-end exploitation on patched systems.

2026-04-06

Wide media coverage — BleepingComputer, Security Affairs, CyberSecurityNews, SecurityOnline publish analysis and threat assessments.

2026-04-07

Microsoft Defender signature released — Exploit:Win32/DfndrPEBluHmr.BB static detection deployed. Cyderes Howler Cell publishes technical breakdown. First SNEK fork appears on GitHub.

2026-04-07

SANS ISC Stormcast podcast covers BlueHammer — Episode 9882 includes BlueHammer analysis alongside redirect phishing, Internet Bug Bounty suspension, and Keycloak MFA bypass.

2026-04-07

BlueHammerFix detection engineering repo published — technoherder releases 7 Sigma rules, 4 YARA rules, 9 bug fixes, and MITRE ATT&CK-mapped technical report on GitHub.

2026-04-08

Exploit Pack publishes independent analysis — Assesses BlueHammer as "research-grade PoC with unreliable post-exploitation chains." Local SAM extraction confirmed; final SYSTEM escalation failed in their testing due to account state assumptions.

2026-04-08

Day 5 in the wild: UNPATCHED. No CVE. No CISA KEV. — Exploit remains viable on all patched Windows 10/11 systems. Microsoft has not assigned a CVE or released a patch. Not listed in CISA KEV catalog. Variant development continues via SNEK fork. Detection engineering resources now available from community.

🗺️

## MITRE ATT&CK Mapping

Technique ID
Technique Name
Exploit Chain Stage

T1068
Exploitation for Privilege Escalation
Stages 3–5

T1543.003
Create or Modify System Process: Windows Service
Stage 7

T1562.001
Impair Defenses: Disable or Modify Tools
Stage 4

T1574.005
Hijack Execution Flow: Executable Installer File Permissions Abuse
Stage 5

T1003.002
OS Credential Dumping: SAM
Stage 6

T1552.002
Unsecured Credentials: Credentials in Registry
Stage 6

T1098
Account Manipulation
Stage 6

T1569.002
System Services: Service Execution
Stage 7

T1005
Data from Local System
Stage 5

Source: BlueHammerFix detection engineering repository

🔬

## Community Detection Engineering

Sigma Rules (8 rules — BlueHammerFix)

SIGMA
bluehammer_samlib_load.yml — Non-LSASS process loading samlib.dll

SIGMA
bluehammer_rapid_password_change.yml — Password change-logon-restore cycle (Event IDs 4723/4724)

SIGMA
bluehammer_junction_basenamed.yml — Junction to BaseNamedObjects

SIGMA
bluehammer_temp_service_creation.yml — GUID-named temporary service creation

SIGMA
bluehammer_oplock_rstrtmgr.yml — Exclusive handle on RstrtMgr.dll

SIGMA
bluehammer_cloudfiles_abuse.yml — Cloud Files API by non-provider

SIGMA
bluehammer_lsa_bootkey_access.yml — LSA boot key registry access

SIGMA
bluehammer_defender_rpc_call.yml — Non-Defender RPC to IMpService

YARA Rules (4 rules — BlueHammerFix)

YARA
bluehammer.yar — Exact match rule for original PoC binary + 3 variant detection patterns for modified/recompiled builds

All rules available at: github.com/technoherder/BlueHammerFix

⚠️

## Weaponization Assessment

Current assessment: Research-grade PoC — not yet production-ready for red team use.

Exploit Pack (April 8): Independent testing confirmed local SAM hive extraction succeeds, but final SYSTEM escalation failed due to account state assumptions. Assessed as "tightly coupled to Defender update timing, Microsoft-hosted signature content, local account state." Not added to Exploit Pack toolkit.

Variant Risk: The SNEK fork (SNEK_Blue-War-Hammer) provides a reimplementation with documentation. Because the weakness lives in how Windows components interact (not a single file), recompiling from modified source bypasses the static Defender signature entirely. The BlueHammerFix repo includes 9 bug fixes that improve reliability of the original PoC.

Threat Actor Adoption: No confirmed threat actor usage as of April 8, 2026. No integration into known exploit kits or frameworks. However, the combination of public PoC, community-fixed reliability issues, and lack of a vendor patch increases weaponization risk over time.

📚

## Sources & References

PRIMARY
github.com/Nightmare-Eclipse/BlueHammer
Original PoC source code and documentation

PRIMARY
deadeclipse666.blogspot.com
Researcher disclosure blog and technical writeup

ANALYSIS
cyderes.com/howler-cell/windows-zero-day-bluehammer
Cyderes Howler Cell technical breakdown and verification

ANALYSIS
bleepingcomputer.com
Will Dormann (Tharros) interview and threat context

COVERAGE
securityaffairs.com
General coverage and threat assessment

COVERAGE
securityonline.info
Community perspective and industry reaction

COVERAGE
cybersecuritynews.com
Incident timeline and background

SECONDARY
github.com/atroubledsnake/SNEK_Blue-War-Hammer
Community fork and variant implementations

ANALYSIS
github.com/technoherder/BlueHammerFix
Detection engineering: 7 Sigma rules, 4 YARA rules, 9 bug fixes, MITRE ATT&CK mapping

ANALYSIS
exploitpack.com
Independent reliability assessment and weaponization analysis

COVERAGE
SANS ISC Stormcast — Episode 9882
April 7 podcast covering BlueHammer alongside other current threats

COVERAGE
securityboulevard.com
Disclosure dispute context and Microsoft response analysis

COVERAGE
cyberinsider.com
Community and industry reaction

BlueHammer
Windows LPE
TOCTOU
VSS Abuse
Windows Defender
Cloud Files API
SAM Dump
NTLM Hash
Zero-Day
Public PoC
Unpatched
IMpService RPC
Opportunistic Lock
Race Condition
Windows 11
Full Disclosure
MSRC
Chaotic Eclipse
MITRE ATT&CK
Sigma Rules
YARA Rules
BlueHammerFix
SNEK Fork
SANS ISC

{
"sources": [
{
"source_id": "SRC-BH-001",
"url": "https://github.com/Nightmare-Eclipse/BlueHammer",
"title": "Original BlueHammer PoC — Source code, documentation, and build instructions",
"publisher": "Chaotic Eclipse / Nightmare-Eclipse",
"publisher_type": "academic",
"published_date": "2026-03-29",
"credibility": "primary",
"notes": "Full exploit source code with build scripts and documentation"
},
{
"source_id": "SRC-BH-002",
"url": "https://deadeclipse666.blogspot.com",
"title": "Researcher disclosure blog — Technical writeup and initial announcement",
"publisher": "Chaotic Eclipse",
"publisher_type": "academic",
"published_date": "2026-03-26",
"credibility": "primary",
"notes": "First public disclosure of BlueHammer vulnerability"
},
{
"source_id": "SRC-BH-003",
"url": "https://cyderes.com/howler-cell/windows-zero-day-bluehammer",
"title": "Cyderes Howler Cell — Technical breakdown and independent verification",
"publisher": "Cyderes",
"publisher_type": "vendor",
"published_date": "2026-04-01",
"credibility": "primary",
"notes": "Independent reproduction and technical analysis of exploit chain"
},
{
"source_id": "SRC-BH-004",
"url": "https://bleepingcomputer.com",
"title": "Will Dormann (Tharros) interview — Independent confirmation and threat context",
"publisher": "BleepingComputer",
"publisher_type": "media",
"published_date": "2026-04-03",
"credibility": "corroborating",
"notes": "Interview with Will Dormann confirming exploit viability"
},
{
"source_id": "SRC-BH-005",
"url": "https://github.com/technoherder/BlueHammerFix",
"title": "BlueHammerFix — 8 Sigma rules, 4 YARA rules, MITRE ATT&CK-mapped report",
"publisher": "technoherder",
"publisher_type": "academic",
"published_date": "2026-04-07",
"credibility": "corroborating",
"notes": "Community detection engineering repo with 9 bug fixes improving PoC reliability"
},
{
"source_id": "SRC-BH-006",
"url": "https://www.exploitpack.com/blogs/news/blue-hammer-analysis-ms-defender-lpe",
"title": "Exploit Pack — Independent reliability assessment and weaponization analysis",
"publisher": "Exploit Pack",
"publisher_type": "vendor",
"published_date": "2026-04-06",
"credibility": "corroborating",
"notes": "Rated as research-grade PoC, not production-ready"
},
{
"source_id": "SRC-BH-007",
"url": "https://isc.sans.edu/podcastdetail/9882",
"title": "SANS ISC Stormcast Episode 9882 — BlueHammer analysis segment",
"publisher": "SANS Internet Storm Center",
"publisher_type": "academic",
"published_date": "2026-04-07",
"credibility": "corroborating",
"notes": "Podcast analysis alongside redirect phishing, IBB suspension, Keycloak MFA bypass"
},
{
"source_id": "SRC-BH-008",
"url": "https://securityboulevard.com/2026/04/bluehammer-windows-zero-day-exploit-leaked-after-microsoft-disclosure-dispute/",
"title": "Security Boulevard — Disclosure dispute context and Microsoft response",
"publisher": "Security Boulevard",
"publisher_type": "media",
"published_date": "2026-04-05",
"credibility": "corroborating"
},
{
"source_id": "SRC-BH-009",
"url": "https://cyberinsider.com/disgruntled-researcher-drops-bluehammer-windows-zero-day-lpe-exploit/",
"title": "CyberInsider — Researcher motivation and community reaction",
"publisher": "CyberInsider",
"publisher_type": "media",
"published_date": "2026-04-04",
"credibility": "corroborating"
},
{
"source_id": "SRC-BH-010",
"url": "https://securityaffairs.com",
"title": "Security Affairs — General coverage and threat assessment",
"publisher": "Security Affairs",
"publisher_type": "media",
"published_date": "2026-04-03",
"credibility": "corroborating"
},
{
"source_id": "SRC-BH-011",
"url": "https://securityonline.info",
"title": "Security Online — Community perspective and industry reaction",
"publisher": "Security Online",
"publisher_type": "media",
"published_date": "2026-04-04",
"credibility": "corroborating"
},
{
"source_id": "SRC-BH-012",
"url": "https://cybersecuritynews.com",
"title": "Cybersecurity News — Incident timeline and background",
"publisher": "Cybersecurity News",
"publisher_type": "media",
"published_date": "2026-04-03",
"credibility": "corroborating"
},
{
"source_id": "SRC-BH-013",
"url": "https://github.com/atroubledsnake/SNEK_Blue-War-Hammer",
"title": "SNEK Fork — Community reimplementation with variant documentation",
"publisher": "atroubledsnake",
"publisher_type": "academic",
"published_date": "2026-04-05",
"credibility": "secondary",
"notes": "Reimplementation with documentation; 9 bug fixes increase variant risk"
}
]
}
