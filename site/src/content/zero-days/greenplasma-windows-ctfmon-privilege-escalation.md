---
title: GreenPlasma — Windows CTFMON Arbitrary Section Creation Privilege Escalation
cve: Pending
type: Local Privilege Escalation
platform: Microsoft Windows 11 and Windows Server 2022/2026, per public researcher claims
severity: high
status: unknown
isZeroDay: true
cisaKev: false
disclosedDate: 2026-05-12
daysInTheWild: null
researcher: Nightmare Eclipse (Nightmare-Eclipse)
reviewStatus: draft_ai
generatedBy: dangermouse-bot
generatedDate: 2026-05-14
relatedIncidents: []
relatedActors: []
tags:
  - "greenplasma"
  - "windows-lpe"
  - "ctfmon"
  - "arbitrary-section-creation"
  - "privilege-escalation"
  - "zero-day"
  - "public-poc"
  - "pending-cve"
sources:
  - url: "https://nvd.nist.gov/vuln/search/results?form_type=Basic&query=GreenPlasma&results_type=overview&search_type=all"
    publisher: "National Vulnerability Database"
    publisherType: government
    reliability: R1
    publicationDate: "2026-05-14"
    accessDate: "2026-05-14"
    archived: false
  - url: "https://github.com/Nightmare-Eclipse/GreenPlasma"
    publisher: "Nightmare-Eclipse"
    publisherType: community
    reliability: R2
    publicationDate: "2026-05-12"
    accessDate: "2026-05-14"
    archived: false
  - url: "https://news.risky.biz/risky-bulletin-rubygems-disables-sign-ups-after-attack-on-staff/"
    publisher: "Risky Bulletin"
    publisherType: media
    reliability: R2
    publicationDate: "2026-05-13"
    accessDate: "2026-05-14"
    archived: false
  - url: "https://www.securityweek.com/researcher-drops-yellowkey-greenplasma-windows-zero-days/"
    publisher: "SecurityWeek"
    publisherType: media
    reliability: R2
    publicationDate: "2026-05-14"
    accessDate: "2026-05-14"
    archived: false
  - url: "https://www.cybersecurity-help.cz/vdb/SB2026051378"
    publisher: "Cybersecurity Help"
    publisherType: research
    reliability: R2
    publicationDate: "2026-05-13"
    accessDate: "2026-05-14"
    archived: false
mitreMappings:
  - techniqueId: "T1068"
    techniqueName: "Exploitation for Privilege Escalation"
    tactic: "Privilege Escalation"
    attack-version: "v19"
    confidence: confirmed
    evidence: "GreenPlasma is a publicly disclosed local privilege-escalation vulnerability in Windows CTFMON; the public partial proof-of-concept demonstrates elevation toward SYSTEM-level privileges via arbitrary section object creation."
atlasMappings: []
framework-mappings: []
---

## Severity Assessment

- Exploitability: 7/10
- Impact: 8/10
- Weaponization Risk: 6/10
- Patch Urgency: 8/10
- Detection Coverage: 4.5/10

## Summary

GreenPlasma is the public name given to a Windows CTFMON elevation-of-privilege vulnerability publicly disclosed on 2026-05-12 by the researcher known as Nightmare Eclipse. The disclosure occurred on the same day Microsoft released its May 2026 Patch Tuesday updates; the cited sources did not identify a vendor fix for GreenPlasma. A second vulnerability, YellowKey — described as a separate BitLocker bypass — was released alongside it.

The public record characterizes GreenPlasma as an arbitrary section creation vulnerability in the Windows CTFMON subsystem that can allow a local unprivileged user to create arbitrary memory section objects in directory objects that are writable by SYSTEM, enabling escalation to SYSTEM-level privileges. The researcher published a partial proof-of-concept; code required to achieve a functional SYSTEM shell was stated to have been deliberately stripped before release.

As of 2026-05-14, no CVE identifier had been assigned and no NVD record existed for GreenPlasma. The cited sources did not identify a Microsoft Security Response Center advisory or patch, and no in-the-wild exploitation had been reported.

## Exploit Chain

The public information about the exploit chain comes from the researcher's own repository README and third-party reporting, not from a vendor advisory. This section reflects only what is publicly stated.

### Stage 1: Arbitrary Section Object Creation

CTFMON is a Windows component associated with input method management. According to the public GreenPlasma repository, the vulnerability involves creating an arbitrary memory section object in any directory object that SYSTEM can write to. The researcher's partial proof-of-concept demonstrates this object creation step.

### Stage 2: Privilege Escalation to SYSTEM

The code required to progress from that primitive to a functional SYSTEM shell was explicitly removed before public release. Cybersecurity Help bulletin SB2026051378 characterizes the access vector as local, with code execution at SYSTEM privileges as the highest-confidence impact. This aligns with the researcher's description of an elevation-of-privilege path for local unprivileged users.

Affected platforms per the researcher are Windows 11 and Windows Server 2022 and 2026. The researcher listed Windows 10 status as uncertain as of initial disclosure.

## Detection Guidance

1. Apply available Microsoft security updates promptly. As of 2026-05-14, no official patch for GreenPlasma has been released; monitor the Microsoft Security Response Center for advisories and apply any fix as soon as one becomes available.
2. Restrict local user access to sensitive systems, particularly where SYSTEM-writable directory objects may be accessible to low-privileged accounts.
3. Hunt for anomalous section object creation activity associated with CTFMON processes, particularly on Windows 11 and Windows Server 2022/2026 hosts.
4. Monitor for unexpected SYSTEM-level process spawning preceded by low-privilege local process activity on affected platforms.
5. Treat the public repository at Nightmare-Eclipse/GreenPlasma as a reference for the partial proof-of-concept signatures; security teams ingesting threat feeds should watch for indicators derived from that codebase.
6. Given the absence of an official CVE, rely on behavioral and heuristic detection rather than CVE-tagged signature rules until an identifier is assigned.

## Indicators of Compromise

No file hashes, registry keys, or network indicators derived from in-the-wild exploitation have been publicly reported as of 2026-05-14. The most actionable indicators at this stage are behavioral:

- Anomalous creation of memory section objects in SYSTEM-writable Windows object directories by low-privileged processes.
- Unexpected privilege transitions to SYSTEM on Windows 11 or Windows Server 2022/2026 endpoints where no administrative action was expected.
- Process activity associated with CTFMON that precedes SYSTEM-level execution.

Defenders should monitor the public GreenPlasma repository for any updates to the proof-of-concept that could produce more specific static indicators.

## Disclosure Timeline

### 2026-05-12 — Public disclosure by Nightmare Eclipse

The researcher publicly released the GreenPlasma partial proof-of-concept repository alongside YellowKey, a separate BitLocker bypass vulnerability. The release occurred on the same day as Microsoft's May 2026 Patch Tuesday update cycle. The researcher stated that code required for a functional SYSTEM shell had been stripped before publication.

### 2026-05-13 — Third-party reporting

Risky Bulletin and Cybersecurity Help covered the dual disclosure. Risky Bulletin noted that the researcher dropped both zero-days minutes after Patch Tuesday, describing GreenPlasma as a privilege escalation bug and YellowKey as a BitLocker bypass. Cybersecurity Help bulletin SB2026051378 recorded the vulnerability with a local access vector and no patch available.

### 2026-05-14 — Continued coverage; no vendor response reported

SecurityWeek reported on the disclosures, describing GreenPlasma as enabling elevation to SYSTEM. The article noted that SecurityWeek had emailed Microsoft for a statement; no Microsoft response was reported in that article as of publication. No MSRC advisory, CVE assignment, or NVD record was identified at this date.

## Sources & References

- [National Vulnerability Database: GreenPlasma search — no CVE record identified as of 2026-05-14](https://nvd.nist.gov/vuln/search/results?form_type=Basic&query=GreenPlasma&results_type=overview&search_type=all) — National Vulnerability Database, 2026-05-14
- [Nightmare-Eclipse: GreenPlasma public repository](https://github.com/Nightmare-Eclipse/GreenPlasma) — Nightmare-Eclipse, 2026-05-12
- [Risky Bulletin: RubyGems disables sign-ups after attack on staff](https://news.risky.biz/risky-bulletin-rubygems-disables-sign-ups-after-attack-on-staff/) — Risky Bulletin, 2026-05-13
- [SecurityWeek: Researcher drops YellowKey, GreenPlasma Windows zero-days](https://www.securityweek.com/researcher-drops-yellowkey-greenplasma-windows-zero-days/) — SecurityWeek, 2026-05-14
- [Cybersecurity Help: SB2026051378](https://www.cybersecurity-help.cz/vdb/SB2026051378) — Cybersecurity Help, 2026-05-13
