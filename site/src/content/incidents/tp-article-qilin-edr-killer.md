---
eventId: TP-2026-0054
title: "Qilin EDR Killer Campaign: BYOVD-Driven Endpoint Defense Evasion"
date: 2026-04-02
attackType: Ransomware
severity: high
sector: Multiple
geography: Global
threatActor: Qilin
attributionConfidence: A2
reviewStatus: draft_ai
confidenceGrade: B
generatedBy: dangermouse-bot
generatedDate: 2026-05-08
cves: []
relatedSlugs:
  - "die-linke-qilin-ransomware-2026"
tags:
  - "ransomware"
  - "qilin"
  - "edr-killer"
  - "byovd"
  - "dll-sideloading"
  - "kernel-callbacks"
  - "etw-suppression"
  - "endpoint-defense-evasion"
sources:
  - url: "https://blog.talosintelligence.com/qilin-edr-killer/"
    publisher: "Cisco Talos Intelligence"
    publisherType: research
    reliability: R1
    publicationDate: "2026-04-02"
    accessDate: "2026-05-08"
    archived: false
  - url: "https://thehackernews.com/2026/04/qilin-and-warlock-ransomware-use.html"
    publisher: "The Hacker News"
    publisherType: media
    reliability: R2
    publicationDate: "2026-04-06"
    accessDate: "2026-05-08"
    archived: false
  - url: "https://socprime.com/active-threats/qilin-edr-killer-infection-chain/"
    publisher: "SOC Prime"
    publisherType: research
    reliability: R1
    publicationDate: "2026-04-06"
    accessDate: "2026-05-08"
    archived: false
  - url: "https://cybersecuritynews.com/qilin-ransomware-kill-edr/"
    publisher: "Cyber Security News"
    publisherType: media
    reliability: R2
    publicationDate: "2026-04-06"
    accessDate: "2026-05-08"
    archived: false
mitreMappings:
  - techniqueId: "T1574.001"
    techniqueName: "DLL"
    tactic: "Defense Evasion"
    notes: "Malicious msimg32.dll placed alongside a legitimate application binary exploits Windows DLL search order to load attacker-controlled code, initiating the multi-stage EDR killer chain."
  - techniqueId: "T1014"
    techniqueName: "Rootkit"
    tactic: "Defense Evasion"
    notes: "The EDR killer component operates at kernel level, locating and overwriting process creation, thread creation, and image load notification callbacks registered by EDR products, rendering endpoint monitoring blind without directly terminating the EDR process."
  - techniqueId: "T1068"
    techniqueName: "Exploitation for Privilege Escalation"
    tactic: "Privilege Escalation"
    notes: "Bring Your Own Vulnerable Driver (BYOVD) — a signed but vulnerable ThrottleStop driver (rwdrv.sys) is loaded to gain kernel execution privileges required for callback erasure."
  - techniqueId: "T1070"
    techniqueName: "Indicator Removal"
    tactic: "Defense Evasion"
    notes: "Event Tracing for Windows (ETW) event generation is suppressed to reduce forensic telemetry and hinder detection by security operations infrastructure."
  - techniqueId: "T1486"
    techniqueName: "Data Encrypted for Impact"
    tactic: "Impact"
    notes: "Qilin ransomware payload is deployed after EDR disablement, encrypting victim files in support of double-extortion operations."
---

## Summary

Cisco Talos Intelligence published detailed technical analysis in April 2026 documenting a multi-stage endpoint detection and response (EDR) evasion capability deployed by the Qilin ransomware group in active campaigns. Referred to as the Qilin EDR Killer, the tooling uses a Bring Your Own Vulnerable Driver (BYOVD) technique combined with DLL side-loading to disable EDR products from more than 300 security vendors at the kernel level before deploying the ransomware payload.

Qilin, also tracked as Agenda, is a ransomware-as-a-service (RaaS) operation active since at least 2022. The EDR killer capability represents a significant escalation in the group's defensive evasion posture, enabling affiliates to neutralize endpoint monitoring before encryption. Warlock ransomware was also observed deploying BYOVD-based EDR disablement using the same general technique and overlapping tooling around the same period, suggesting possible shared development resources or code reuse across RaaS affiliates.

## Technical Analysis

The infection chain is initiated by a malicious Dynamic Link Library named `msimg32.dll`. Windows resolves DLL dependencies by checking the calling application's own directory before system directories; placing a malicious `msimg32.dll` alongside a legitimate application causes that application to load the attacker-controlled library instead of the authentic Windows component upon execution.

Once loaded, the DLL executes a multi-stage payload:

### Stage 1: User-mode preparation

The DLL neutralizes user-mode API hooks maintained by EDR agents to intercept calls to sensitive Windows API functions. It also obfuscates control flow and API invocation patterns to complicate dynamic analysis and sandbox detection.

### Stage 2: Vulnerable driver deployment

The loader drops and installs `rwdrv.sys`, a digitally signed but exploitable driver derived from the ThrottleStop CPU management utility. Because the driver carries a legitimate digital signature, it passes Windows Driver Signature Enforcement checks. The driver provides the kernel execution context required for the subsequent EDR disablement stage.

### Stage 3: Kernel callback erasure

With kernel-level access established, the EDR killer locates the callback notification routine tables that EDR products populate via `PsSetCreateProcessNotifyRoutine`, `PsSetCreateThreadNotifyRoutine`, and `PsSetLoadImageNotifyRoutine`. These callbacks are the primary mechanism by which EDR agents observe process lifecycle events. The component overwrites the registered callback pointers with empty or no-op routines, rendering the EDR blind to process activity without terminating its own process — a deliberate choice that avoids triggering tamper protection mechanisms that monitor for direct EDR process termination attempts.

### Stage 4: ETW suppression

The component suppresses Event Tracing for Windows event generation, reducing telemetry available to both the local agent and downstream security operations tooling.

The main EDR killer payload is decrypted and executed entirely in memory, leaving no on-disk artifact at execution time.

## Attack Chain

Initial access in documented Qilin intrusions typically involves credential theft, phishing, or exploitation of internet-exposed remote services. Following initial compromise, the threat actor conducts reconnaissance and lateral movement before staging the EDR killer tooling.

The `msimg32.dll` side-loader is planted in a directory alongside a legitimate application binary. Execution of the legitimate binary triggers the DLL load, initiating the multi-stage disablement chain described above. Once EDR monitoring is silenced, the Qilin ransomware payload is decrypted and executed. Victim files are encrypted, and data exfiltrated prior to encryption is held for double-extortion: victims who decline to pay face publication of stolen data on the group's leak site.

Talos analysis of at least one intrusion identified an extended pre-encryption dwell period of approximately six days, suggesting deliberate reconnaissance to identify high-value data stores and maximize encryption coverage before detonating the payload.

## Impact Assessment

The EDR killer component is capable of neutralizing monitoring by more than 300 security products, representing coverage across the endpoint security vendor ecosystem. Organizations relying solely on user-space EDR tamper protection as a defense against targeted pre-encryption disablement are exposed to this technique.

Qilin recorded more than 700 ransomware attacks during 2025 according to industry tracking, placing the group among the most prolific ransomware operators globally. The group's campaigns span multiple sectors including healthcare, government, financial services, manufacturing, and critical infrastructure. The deployment of this EDR killer across affiliate operations from mid-2025 onward increased the operational effectiveness and potential impact of each intrusion.

## Attribution

Qilin ransomware, also tracked as Agenda by some vendors, has operated as a RaaS since at least 2022. The group maintains its own dedicated leak site and distributes encryptors written in Go and Rust capable of targeting both Windows and Linux/VMware ESXi environments. Attribution is based on malware family identification, infrastructure overlaps, and victim communications patterns documented across multiple vendor reports. Multiple independent security vendors have attributed this tooling to Qilin with high technical corroboration.

Warlock ransomware affiliates independently deployed BYOVD-based EDR disablement using the same general kernel-callback-erasure technique during the same period, using different vulnerable drivers. Whether this reflects shared tooling, shared development resources, or independent parallel development is not publicly established with certainty.

## Timeline

| Date | Event |
|---|---|
| 2022 | Qilin (Agenda) ransomware first identified; Go and Rust encryptors documented by vendors. |
| 2024-06-03 | Qilin ransomware attack against Synnovis, an NHS pathology services provider, disrupts blood testing capacity across multiple UK hospitals; not attributed to this EDR killer tooling specifically. |
| ~2025-06 | Compilation timestamp for the EDR killer component, indicating development of the capability during this period, per Talos analysis. |
| 2025 H2 | EDR killer component deployed in Qilin affiliate campaigns; Qilin records more than 700 ransomware attacks during 2025. |
| 2026-04-02 | Cisco Talos publishes detailed technical analysis of the Qilin EDR Killer infection chain. |
| 2026-04-06 | Broader media coverage and detection content release from SOC Prime and Cyber Security News. |

## Remediation & Mitigation

Organizations can reduce exposure to this technique through several complementary controls. Enforcing Microsoft's Vulnerable Driver Blocklist via Windows Defender Application Control (WDAC) or a third-party equivalent prevents the known-vulnerable `rwdrv.sys` and related drivers from loading. Hypervisor-level integrity monitoring or kernel telemetry agents operating outside the Windows kernel callback mechanism provide a monitoring layer that the user-space EDR killer cannot reach. Monitoring for unusual DLL loads — specifically `msimg32.dll` loading from non-system directories — can identify staging activity prior to kernel compromise.

At the network level, monitoring for anomalous credential use and lateral movement activity consistent with pre-encryption dwell reduces the window of opportunity before the EDR killer is staged. Maintaining offline or immutable backups provides recovery capability following a ransomware deployment that bypasses endpoint defenses. Organizations should review endpoint protection platform vendor guidance on kernel-mode tamper protection and ensure hypervisor-based behavioral monitoring is active where available.

SOC Prime released detection content mapped to the Qilin EDR killer infection chain. Individual endpoint vendor advisories address the specific callback registration patterns targeted by this tooling.

## Sources & References

- [Cisco Talos Intelligence: Qilin EDR killer infection chain](https://blog.talosintelligence.com/qilin-edr-killer/) — Cisco Talos Intelligence, 2026-04-02
- [The Hacker News: Qilin and Warlock Ransomware Use Vulnerable Drivers to Disable 300+ EDR Tools](https://thehackernews.com/2026/04/qilin-and-warlock-ransomware-use.html) — The Hacker News, 2026-04-06
- [SOC Prime: Qilin EDR Killer — Driver Abuse to Terminate 300+ Tools](https://socprime.com/active-threats/qilin-edr-killer-infection-chain/) — SOC Prime, 2026-04-06
- [Cyber Security News: Qilin Ransomware Uses Malicious DLL to Kill Almost Every Vendor's EDR Solutions](https://cybersecuritynews.com/qilin-ransomware-kill-edr/) — Cyber Security News, 2026-04-06
