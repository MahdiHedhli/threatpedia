---
exploitId: TP-EXP-2026-0001
title: BlueHammer — Microsoft Defender Local Privilege Escalation
cve: CVE-2026-33825
type: LPE
platform: Windows 10 / 11 with Microsoft Defender enabled
severity: high
status: patched
isZeroDay: true
cisaKev: false
reviewStatus: draft_ai
generatedBy: dangermouse-bot
generatedDate: 2026-04-18
relatedIncidents:
  - "bluehammer-windows-defender-zero-day-2026"
  - "chrome-cve-2026-5281-zero-day"
  - "forticlient-ems-cve-2026-35616"
relatedActors: []
tags:
  - "bluehammer"
  - "windows-lpe"
  - "windows-defender"
  - "zero-day"
  - "public-poc"
  - "patched"
  - "toctou"
  - "path-confusion"
disclosedDate: 2026-04-03
patchDate: 2026-04-14
researcher: Chaotic Eclipse / Nightmare-Eclipse (public disclosure); Microsoft credits Zen Dodd and Yuanpei XU (HUST) with Diffract
confirmedBy: Microsoft and NVD; independently described by BleepingComputer and other defenders
sources:
  - url: "https://msrc.microsoft.com/update-guide/vulnerability/CVE-2026-33825"
    publisher: "Microsoft Security Response Center"
    publisherType: vendor
    reliability: R1
    publicationDate: "2026-04-14"
    accessDate: "2026-04-18"
    archived: false
  - url: "https://nvd.nist.gov/vuln/detail/CVE-2026-33825"
    publisher: "National Vulnerability Database"
    publisherType: government
    reliability: R1
    publicationDate: "2026-04-14"
    accessDate: "2026-04-18"
    archived: false
  - url: "https://www.bleepingcomputer.com/news/security/disgruntled-researcher-leaks-bluehammer-windows-zero-day-exploit/"
    publisher: "BleepingComputer"
    publisherType: media
    reliability: R2
    publicationDate: "2026-04-06"
    accessDate: "2026-04-18"
    archived: false
  - url: "https://www.bleepingcomputer.com/news/microsoft/microsoft-april-2026-patch-tuesday-fixes-167-flaws-2-zero-days/"
    publisher: "BleepingComputer"
    publisherType: media
    reliability: R2
    publicationDate: "2026-04-14"
    accessDate: "2026-04-18"
    archived: false
  - url: "https://www.bleepingcomputer.com/news/security/recently-leaked-windows-zero-days-now-exploited-in-attacks/"
    publisher: "BleepingComputer"
    publisherType: media
    reliability: R2
    publicationDate: "2026-04-17"
    accessDate: "2026-04-18"
    archived: false
mitreMappings:
  - techniqueId: "T1068"
    techniqueName: "Exploitation for Privilege Escalation"
    tactic: "Privilege Escalation"
    notes: "BlueHammer is a publicly disclosed local privilege-escalation path in Microsoft Defender."
---

## Severity Assessment

Exploitability

70

Impact

80

Weaponization Risk

75

Patch Urgency

85

Detection Coverage

55

## Summary

BlueHammer is the public name attached to a Microsoft Defender local privilege-escalation vulnerability that Microsoft tracks as CVE-2026-33825. The flaw was publicly exposed before Microsoft shipped a fix, making it a true zero-day during the first half of April 2026. Microsoft addressed it in the April 14, 2026 Patch Tuesday release.

The strongest supportable facts are that a public exploit existed, the underlying issue was a Microsoft Defender elevation-of-privilege flaw, and exploitation in the wild was later reported. Earlier drafts in this corpus treated BlueHammer as permanently unassigned and unpatched; that is no longer accurate.

BlueHammer should be treated as a real operational risk. The existence of a public exploit before patching, followed by later reporting of in-the-wild use, means defenders should assume rapid adversary adoption once local access is obtained. The public record supports active use of BlueHammer-style exploitation but does not yet support naming a specific actor cluster or claiming a universal, vendor-confirmed exploit chain beyond local privilege escalation in Microsoft Defender.

## Exploit Chain

Vendor-confirmed detail on the exploit chain remains limited. Microsoft's public advisory and the NVD record only describe the flaw as insufficient granularity of access control in Microsoft Defender leading to local privilege escalation.

Third-party reporting described the public exploit as a TOCTOU and path-confusion chain that could lead to SYSTEM-level compromise after local execution. That detail is relevant context, but it should be treated as public exploit analysis rather than fully vendor-confirmed root cause language. The MITRE ATT&CK technique T1068 (Exploitation for Privilege Escalation) covers this attack vector.

## Detection Guidance

1. Hunt for suspicious local privilege-escalation activity tied to Microsoft Defender immediately before SYSTEM-level process creation.
2. Investigate systems that showed hands-on-keyboard activity or VPN-derived compromise in the April 2026 window, especially where Huntress-style tradecraft was observed.
3. Confirm that Microsoft Defender platform updates, not only signature updates, are current across the fleet.
4. Install Microsoft Defender Antimalware Platform version 4.18.26030.3011 or later.
5. Verify update health on endpoints rather than assuming Defender auto-updated successfully.
6. Treat systems exposed before the April 14 patch as higher risk if an attacker had any local foothold.
7. Pair patching with retrospective investigation for privilege-escalation activity from April 3 onward.

## Indicators of Compromise

The most reliable public indicators are behavioral rather than static:

- local privilege-escalation behavior involving Microsoft Defender
- unexpected transition from low privilege to SYSTEM on endpoints where attackers already had code execution
- intrusion activity overlapping the public BlueHammer disclosure window in early April 2026

Because the exploit was public and iterated by the community, defenders should avoid overfitting detection to one original binary or one specific proof-of-concept repository.

## Disclosure Timeline

2026-04-03

BlueHammer proof-of-concept code was publicly released under the Nightmare-Eclipse handle after public complaints about Microsoft's disclosure handling.

2026-04-06

BleepingComputer reported the disclosure and independent validation context, including Will Dormann's description of the exploit as a local privilege-escalation issue.

2026-04-14

Microsoft addressed the flaw as CVE-2026-33825 in the April 2026 security updates.

2026-04-17

Public reporting said Huntress had observed BlueHammer exploitation in attacks dating back to April 10.

## Sources & References

- [Microsoft Security Response Center: CVE-2026-33825 — Microsoft Defender Elevation of Privilege Vulnerability](https://msrc.microsoft.com/update-guide/vulnerability/CVE-2026-33825) — Microsoft Security Response Center, 2026-04-14
- [National Vulnerability Database: CVE-2026-33825](https://nvd.nist.gov/vuln/detail/CVE-2026-33825) — National Vulnerability Database, 2026-04-14
- [BleepingComputer: Disgruntled researcher leaks BlueHammer Windows zero-day exploit](https://www.bleepingcomputer.com/news/security/disgruntled-researcher-leaks-bluehammer-windows-zero-day-exploit/) — BleepingComputer, 2026-04-06
- [BleepingComputer: Microsoft April 2026 Patch Tuesday fixes 167 flaws, 2 zero-days](https://www.bleepingcomputer.com/news/microsoft/microsoft-april-2026-patch-tuesday-fixes-167-flaws-2-zero-days/) — BleepingComputer, 2026-04-14
- [BleepingComputer: Recently leaked Windows zero-days now exploited in attacks](https://www.bleepingcomputer.com/news/security/recently-leaked-windows-zero-days-now-exploited-in-attacks/) — BleepingComputer, 2026-04-17
