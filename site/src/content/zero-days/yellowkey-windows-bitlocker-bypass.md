---
title: "YellowKey — Windows BitLocker Bypass (Pending CVE)"
exploitId: "TP-EXP-2026-0285"
cve: "Pending"
type: "BitLocker / Windows Recovery Environment bypass"
platform: "Microsoft Windows 11 and Windows Server 2022/2025, per public researcher claims"
severity: high
status: active
isZeroDay: true
cisaKev: false
disclosedDate: 2026-05-12
daysInTheWild: null
researcher: "Nightmare Eclipse"
reviewStatus: draft_ai
generatedBy: dangermouse-bot
generatedDate: 2026-05-14
relatedIncidents: []
relatedActors: []
tags:
  - "yellowkey"
  - "bitlocker"
  - "windows-recovery-environment"
  - "physical-access"
  - "public-poc"
  - "cve-pending"
  - "windows-11"
  - "windows-server-2022"
  - "windows-server-2025"
sources:
  - url: "https://nvd.nist.gov/vuln/search/results?form_type=Basic&query=YellowKey&results_type=overview&search_type=all"
    publisher: "National Vulnerability Database"
    publisherType: government
    reliability: R1
    publicationDate: "2026-05-14"
    accessDate: "2026-05-14"
    archived: false
  - url: "https://github.com/Nightmare-Eclipse/YellowKey"
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
  - url: "https://blackfort-tec.de/en/insights/yellowkey-bitlocker-bypass-windows-11-vulnerability"
    publisher: "Blackfort Technology"
    publisherType: research
    reliability: R2
    publicationDate: "2026-05-13"
    accessDate: "2026-05-14"
    archived: false
mitreMappings:
  - techniqueId: "T1200"
    techniqueName: "Hardware Additions"
    tactic: "Initial Access"
    attack-version: "v19"
    confidence: confirmed
    evidence: "The public proof-of-concept reproduction path requires attaching a USB storage device to the target machine to deliver the FsTx folder structure that triggers the WinRE bypass."
framework-mappings: []
---

## Severity Assessment

- Exploitability: 5/10 — A public proof-of-concept exists; however, the demonstrated reproduction path requires physical access to the target device, which limits exploitability at scale.
- Impact: 8/10 — Successful exploitation, if the public claims hold, would yield unrestricted shell access to a BitLocker-protected volume, bypassing full-volume encryption.
- Weaponization Risk: 5/10 — Physical access is a prerequisite for the confirmed reproduction path, limiting weaponization; remote or malware-assisted variations remain unproven at this time.
- Patch Urgency: 7/10 — No vendor patch or official Microsoft advisory has been issued as of 2026-05-14; organizations with high-value, physically accessible devices should prioritize compensating controls.
- Detection Coverage: 3/10 — Activity occurring within Windows Recovery Environment is outside the visibility of standard endpoint detection tools, and no vendor-supplied detections have been released.

## Summary

YellowKey is a publicly disclosed Windows BitLocker bypass vulnerability affecting Windows 11 and Windows Server 2022/2025, per claims by the researcher who goes by Nightmare Eclipse. The public proof-of-concept was released on 2026-05-12, the same day as Microsoft's May 2026 Patch Tuesday, alongside a separate privilege escalation bug named GreenPlasma.

According to the public repository and independent reporting from Risky Bulletin, SecurityWeek, and Blackfort Technology, the demonstrated bypass leverages the Windows Recovery Environment (WinRE) to gain access to a BitLocker-protected volume. The researcher claims that Windows 10 is not affected.

As of 2026-05-14, no CVE has been assigned, no Microsoft MSRC advisory has been published, and no NVD record exists. SecurityWeek reported that it emailed Microsoft for a statement but had not received a response at time of publication. Blackfort Technology similarly noted no official Microsoft confirmation at the time of its coverage. No in-the-wild exploitation has been reported, and no vendor confirmation of the vulnerability's root cause or scope has been issued.

The characterization of this as an intentional backdoor, raised by the researcher, is not treated as an established fact. No credible evidence in public reporting supports that framing.

## Exploit Chain

### Stage 1: Preparation of External Media

The public reproduction path documented in the Nightmare Eclipse repository is a physical-access technique. At a high level, the researcher describes preparing a USB storage device with a specific folder structure under the System Volume Information directory.

### Stage 2: Booting into Recovery Environment

The target BitLocker-protected computer is booted into Windows Recovery Environment. The researcher also describes placing files on the EFI partition as an alternative path.

### Stage 3: Unauthorized Volume Access

The public repository states that a shell becomes available with access to the protected volume. No remote exploitation path has been demonstrated or independently validated. Blackfort Technology's independent summary corroborates that physical access and WinRE are central to the public technique.

Vendor-side confirmation of the underlying mechanism, affected code path, or root cause has not been issued. Details beyond those available in the public repository and secondary reporting should be treated cautiously.

## Detection Guidance

- **Restrict and monitor WinRE access.** Where operationally feasible, configure boot order and UEFI settings to prevent unauthorized boot from external media. Consider requiring administrator authentication to enter recovery environments.
- **Enforce TPM+PIN.** Blackfort Technology recommends enabling BitLocker with TPM plus a PIN rather than TPM-only unlock. TPM-only configurations may be more susceptible to physical-access bypass techniques targeting the pre-boot environment.
- **Harden UEFI and boot order.** Disable booting from USB and external media in UEFI firmware and protect firmware settings with a password. This reduces the likelihood of an attacker reaching WinRE from external media.
- **Apply physical safeguards.** For high-value assets, enforce physical access controls. Devices that are regularly left unattended in accessible locations present elevated risk for physical-access bypass techniques.
- **Audit for unexpected FsTx structures.** Blackfort Technology recommends monitoring for unexpected FsTx folder structures on attached storage, which the public reproduction path uses. This is a behavioral indicator relevant to the described technique rather than a confirmed attacker artifact.
- **Monitor for unusual WinRE activity.** Log and alert on unexpected Windows Recovery Environment invocations, particularly those initiated from external media or at unusual times.
- **Track vendor guidance.** As of 2026-05-14, no Microsoft patch or mitigation advisory exists. Monitor MSRC and NVD for updates.

## Indicators of Compromise

No vendor-confirmed or validated indicators of compromise have been published as of 2026-05-14. The following are behavioral signals derivable from the public reproduction path and should be treated as research-level indicators pending further validation:

- Presence of an `FsTx` folder under `System Volume Information` on a USB storage device connected to a target Windows system.
- Unexpected or unauthorized Windows Recovery Environment sessions on BitLocker-protected devices, particularly those initiated from USB media.
- EFI partition modifications consistent with the alternative reproduction path described in the public repository.

Because no confirmed in-the-wild exploitation has been reported, defenders should not treat absence of these indicators as evidence that a device is uncompromised, nor treat their presence as proof of exploitation.

## Disclosure Timeline

### 2026-05-12 — Public proof-of-concept release

Researcher Nightmare Eclipse published the YellowKey repository, disclosing the BitLocker bypass technique. The release occurred the same day as Microsoft's May 2026 Patch Tuesday, alongside the GreenPlasma privilege escalation disclosure.

### 2026-05-13 — Initial secondary coverage

Risky Bulletin reported the disclosure, noting that a researcher dropped two Windows zero-days shortly after Patch Tuesday; YellowKey was identified as the BitLocker bypass bug and GreenPlasma as a separate privilege escalation bug. Blackfort Technology independently published a summary characterizing YellowKey as a potential BitLocker bypass requiring physical access and WinRE, and confirmed no official Microsoft confirmation or CVE had been issued at that time.

### 2026-05-14 — Continued coverage; no vendor response reported

SecurityWeek reported on the public disclosure of YellowKey and GreenPlasma, confirming physical access is required. SecurityWeek noted it had reached out to Microsoft for comment and would update if a response was received; no Microsoft response was reported in that article. A search of the National Vulnerability Database on 2026-05-14 returned no CVE record for YellowKey, consistent with the pending CVE status.

## Sources & References

- [National Vulnerability Database: YellowKey CVE search](https://nvd.nist.gov/vuln/search/results?form_type=Basic&query=YellowKey&results_type=overview&search_type=all) — National Vulnerability Database, 2026-05-14
- [Nightmare-Eclipse: YellowKey public repository](https://github.com/Nightmare-Eclipse/YellowKey) — Nightmare-Eclipse, 2026-05-12
- [Risky Bulletin: Risky Bulletin — RubyGems disables sign-ups after attack on staff](https://news.risky.biz/risky-bulletin-rubygems-disables-sign-ups-after-attack-on-staff/) — Risky Bulletin, 2026-05-13
- [SecurityWeek: Researcher drops YellowKey, GreenPlasma Windows zero-days](https://www.securityweek.com/researcher-drops-yellowkey-greenplasma-windows-zero-days/) — SecurityWeek, 2026-05-14
- [Blackfort Technology: YellowKey BitLocker bypass Windows 11 vulnerability](https://blackfort-tec.de/en/insights/yellowkey-bitlocker-bypass-windows-11-vulnerability) — Blackfort Technology, 2026-05-13
