---
eventId: "TP-2026-0382"
title: "Photo ZIP Hospitality Intrusion Campaign, April-June 2026"
date: 2026-06-25
attackType: "Phishing and Malware"
severity: high
sector: "Hospitality"
geography: "Europe and Asia"
threatActor: "Unknown"
attributionConfidence: A6
reviewStatus: draft_ai
confidenceGrade: B
generatedBy: kernel-k
generatedDate: 2026-07-09
generation:
  provider: "openai"
  model: "gpt-5"
  tool: "codex"
  agent: kernel-k
  lane: "kernel-k-gpt-draft"
  surface: "codex-desktop"
  promptProfile: "pipeline-task-incident"
cves: []
relatedSlugs: []
tags:
  - "photo-zip"
  - "hospitality"
  - "phishing"
  - "tonrat"
  - "node-js"
  - "powershell"
  - "registry-persistence"
  - "calendly"
  - "the-open-network"
sources:
  - url: "https://www.microsoft.com/en-us/security/blog/2026/06/25/photo-zip-campaign-targeting-hospitality-industry-delivers-node-js-implant-persistent-access"
    publisher: "Microsoft"
    publisherType: vendor
    reliability: R1
    publicationDate: "2026-06-25"
    accessDate: "2026-07-09"
    archived: false
  - url: "https://blog.itochuci.co.jp/entry/2026/06/11/110000"
    publisher: "ITOCHU Cyber & Intelligence"
    publisherType: research
    reliability: R1
    publicationDate: "2026-06-11"
    accessDate: "2026-07-09"
    archived: false
  - url: "https://blog.itochuci.co.jp/entry/2026/06/11/111500"
    publisher: "ITOCHU Cyber & Intelligence"
    publisherType: research
    reliability: R1
    publicationDate: "2026-06-11"
    accessDate: "2026-07-09"
    archived: false
  - url: "https://socprime.com/active-threats/technical-analysis-of-suspicious-emails-targeting-the-hotel-industry/"
    publisher: "SOC Prime"
    publisherType: research
    reliability: R2
    publicationDate: "2026-06-12"
    accessDate: "2026-07-09"
    archived: false
mitreMappings:
  - techniqueId: "T1566.002"
    techniqueName: "Spearphishing Link"
    tactic: "Initial Access"
    attack-version: "v19"
    confidence: confirmed
    evidence: "Microsoft observed hospitality-themed phishing messages that routed recipients through Calendly and Google redirects to attacker-controlled photo-themed download sites."
  - techniqueId: "T1204.002"
    techniqueName: "Malicious File"
    tactic: "Execution"
    attack-version: "v19"
    confidence: confirmed
    evidence: "The infection chain required a recipient to open a fake image shortcut from a browser-downloaded ZIP archive."
  - techniqueId: "T1059.001"
    techniqueName: "PowerShell"
    tactic: "Execution"
    attack-version: "v19"
    confidence: confirmed
    evidence: "Microsoft and ITOCHU documented obfuscated PowerShell that decoded data, retrieved another script, and staged the Node.js implant."
  - techniqueId: "T1547.001"
    techniqueName: "Registry Run Keys / Startup Folder"
    tactic: "Persistence"
    attack-version: "v19"
    confidence: confirmed
    evidence: "Microsoft observed dual HKCU Run and RunOnce entries for the Node.js component and a ProgramData executable, with the RunOnce value refreshed after execution."
  - techniqueId: "T1571"
    techniqueName: "Non-Standard Port"
    tactic: "Command and Control"
    attack-version: "v19"
    confidence: confirmed
    evidence: "Microsoft observed command-and-control traffic on ports 8443, 8445, 8453, 5555, and 56001 through 56003."
---

## Summary

Microsoft Threat Intelligence disclosed an active multi-stage intrusion campaign on June 25, 2026, after observing activity against multiple hospitality and hotel organizations in Europe and Asia since April. The operation used phishing links and photo-themed ZIP archives to deliver fake image shortcut files, obfuscated PowerShell, and a persistent Node.js implant identified as TonRAT.

Beginning in late May, the actor also abused Calendly notification infrastructure and Google redirects to make phishing messages appear more trustworthy and to obscure their final destination. Microsoft observed lures in Japanese, Danish, and Dutch that impersonated booking-related communications, guest complaints, room inquiries, and bedbug reports.

The available reporting establishes a coherent intrusion cluster but does not identify a known threat actor or a confirmed strategic objective. This entry therefore records the bounded incident activity described by the sources without creating a separate canonical campaign or actor profile.

## Technical Analysis

The delivery chain started with links to files named in the pattern `photo-<digits>.zip`. The archives contained shortcut files that appeared to be images, using names such as `IMG-<digits>.png.lnk` in the first observed wave and `PHOTO-<digits>.png.lnk` in the second. ITOCHU also observed a dummy MP4 file alongside the shortcut. Opening the shortcut launched PowerShell, which decoded an obfuscated BigInt payload, used `Invoke-WebRequest` to retrieve another PowerShell script, and staged the next component.

Microsoft divided the activity into two waves. Wave 1 used the IMG filename pattern and a PowerShell-to-Node.js chain. Wave 2, observed from late May into June, changed the shortcut prefix to PHOTO, expanded the use of Cloudflare-fronted `.cfd` domains, and inserted dynamic .NET compilation through `csc.exe` and `cvtres.exe`. Microsoft saw the resulting small DLL created but did not observe it loaded in the available telemetry, so its role remains preparatory or conditional.

The PowerShell stage downloaded a legitimate Node.js runtime from `nodejs.org`, placed it under `C:\Users\<user>\AppData\Local\Nodejs\`, decrypted the malicious JavaScript payload, and launched it with `node.exe`. The legitimate Node.js installer hash reported by Microsoft should not be treated as malicious by itself. Microsoft and ITOCHU identify the JavaScript implant as TonRAT, which can collect system information, execute commands, and download and run additional files.

ITOCHU found that TonRAT could query The Open Network API for a current command-and-control domain and then establish an encrypted WebSocket session. That indirection allowed the operator to change the C2 domain without replacing the implant. Microsoft separately observed fixed-IP beaconing over ports 8443, 8445, 8453, 5555, and 56001 through 56003. Representative infrastructure included `178.16.54[.]27`, `95.217.97[.]121`, `193.202.84[.]32`, `178.16.55[.]179`, `photo-26254[.]cfd`, and `photo-26654[.]cfd`.

Persistence used two user-context registry paths. An HKCU Run entry launched the Node.js implant, while an HKCU RunOnce entry launched a relocated executable under a randomized `C:\ProgramData\` directory. Microsoft observed the RunOnce entry being recreated after execution, effectively forming a recurring loop. On one confirmed device, the Node.js persistence survived Defender blocking of a PE payload and resumed C2 activity about two days later.

The SHA-256 value `04ec44f2618460f5c77c5e56014a512cc03a123c9c5b6b6b1273e2a1681ac2e1` identified the same PE payload across both waves. ITOCHU published additional samples, including ZIP hash `73e12fac74093fa3fdc0aae09dfc61728a6f0ac69a3619a11aae3dd745827650`, LNK hash `f1adf26743807d05d986d0f12bd1e759fb3c473c5946fd1a2fc5c7b5caf3e26d`, and TonRAT JavaScript hash `9a75e798a71c2541f17102128f7c546288bbd3eb30b6b2b4948b17e73873a510`.

## Attack Chain

### Stage 1: Hospitality-themed phishing

The actor sent multilingual booking and guest-complaint lures to hospitality staff. In late May, some messages were relayed through attacker-controlled Calendly workflows and used Calendly and Google redirects before reaching the final download domain.

### Stage 2: Photo archive and shortcut execution

The recipient downloaded a photo-themed ZIP and opened a fake PNG shortcut. The shortcut executed PowerShell rather than displaying an image.

### Stage 3: Script decoding and staging

Obfuscated PowerShell decoded data, fetched another script, and staged the malicious JavaScript. Wave 2 also invoked `csc.exe` and `cvtres.exe` to produce a small DLL before the Node.js deployment stage.

### Stage 4: TonRAT execution

The script installed a legitimate Node.js runtime in a user-writable directory and used it to execute the decrypted TonRAT JavaScript. This avoided dependence on a system-installed runtime and supported reuse of the implant under changing filenames.

### Stage 5: Defense evasion and persistence

The chain added Microsoft Defender process exclusions for temporary executables, moved follow-on PE files into randomized ProgramData paths, and established both Run and self-refreshing RunOnce registry persistence.

### Stage 6: Command and control and follow-on activity

TonRAT established C2 through dynamically resolved domains or fixed infrastructure and supported command execution and additional payload delivery. Microsoft observed beaconing, PE compilation, browser automation, environment lookups, and forced shutdowns on a subset of compromised devices.

## Impact Assessment

Microsoft observed the campaign across multiple hospitality organizations in Europe and Asia, including systems associated with reception, reservations, and other guest-facing workflows. The public sources do not provide a victim count, identify affected organizations, or quantify financial or operational loss.

Confirmed host-level consequences included persistent remote access, command-and-control beaconing, execution of additional PE payloads, changes to Defender exclusions, and forced shutdown commands. The dual persistence design increased remediation risk because blocking or deleting only the ProgramData executable could leave the Node.js implant able to restore access and deliver another payload.

The actor's ultimate objective remains unclear. Although TonRAT provides capabilities for information collection, arbitrary command execution, and additional payload delivery, the reviewed sources do not establish a confirmed theft, ransomware deployment, or monetization outcome for this activity.

## Attribution

Attribution remains Unknown. Microsoft explicitly stated that it had not attributed the campaign to a known threat actor. Its telemetry supported the assessment that both waves were operated as one continuous campaign because they reused a PE hash, Node.js version, infrastructure, execution paths, registry persistence, and lure themes.

ITOCHU noted infrastructure overlap with previously reported Booking.com-themed ClickFix activity and assessed that the observed spam might be related. That relationship is useful for hunting, but it is not sufficient to assign this incident to a named actor or to merge it into a broader canonical campaign without additional corroboration.

## Timeline

### 2026-06-11 - ITOCHU publishes campaign and technical analyses

ITOCHU documented Booking.com-themed email delivery, the PowerShell and Node.js execution chain, TonRAT capabilities, TON API-based C2 resolution, WebSocket communications, and associated indicators. Its reporting described samples observed during May and June.

### 2026-06-12 - SOC Prime publishes defensive analysis

SOC Prime summarized the suspicious-email chain targeting the hotel industry and highlighted monitoring for unusual PowerShell, Node.js, TON API, and WebSocket activity.

### 2026-06-25 - Microsoft discloses the broader intrusion campaign

Microsoft published cross-organization telemetry covering activity since April, the late-May phishing evolution, two attack-chain waves, dual registry persistence, non-standard C2 ports, and observed post-compromise behavior.

## Remediation & Mitigation

1. Quarantine and investigate browser-downloaded archives matching `photo-<digits>.zip` and shortcuts matching `IMG-<digits>.png.lnk` or `PHOTO-<digits>.png.lnk`, especially when followed by PowerShell.
2. Hunt for PowerShell BigInt decoding, `Invoke-WebRequest` from shortcut-driven chains, and unexpected `csc.exe` to `cvtres.exe` activity that creates small DLLs in user-writable paths.
3. Investigate `node.exe` running from `AppData\Local\Nodejs` with randomly named JavaScript files or domain arguments. Do not classify the legitimate Node.js installer hash as malicious without the surrounding execution context.
4. Review both HKCU Run and HKCU RunOnce. Remove the Node.js launch point, the ProgramData executable entry, the user-space runtime, and associated JavaScript only after collecting required forensic evidence.
5. Audit Defender exclusion changes for random executables under `%TEMP%` or `AppData\Local\Temp`, and inspect silent helper processes using `/SL5` or `/VERYSILENT`.
6. Block confirmed malicious infrastructure and monitor outbound traffic on ports 8443, 8445, 8453, 5555, and 56001 through 56003. Treat `tonapi.io` and WebSocket use as contextual signals rather than automatically malicious services.
7. Isolate confirmed compromised devices, preserve process, registry, file, and network telemetry, and reset credentials used on those systems after containment. Confirm that both persistence paths are gone before returning a device to service.

## Sources & References

- [Microsoft: Photo ZIP campaign targeting hospitality industry delivers Node.js implant for persistent access](https://www.microsoft.com/en-us/security/blog/2026/06/25/photo-zip-campaign-targeting-hospitality-industry-delivers-node-js-implant-persistent-access) — Microsoft, 2026-06-25
- [ITOCHU Cyber & Intelligence: Analysis of suspicious emails targeting the hotel industry, part 1](https://blog.itochuci.co.jp/entry/2026/06/11/110000) — ITOCHU Cyber & Intelligence, 2026-06-11
- [ITOCHU Cyber & Intelligence: Analysis of suspicious emails targeting the hotel industry, part 2](https://blog.itochuci.co.jp/entry/2026/06/11/111500) — ITOCHU Cyber & Intelligence, 2026-06-11
- [SOC Prime: Technical analysis of suspicious emails targeting the hotel industry](https://socprime.com/active-threats/technical-analysis-of-suspicious-emails-targeting-the-hotel-industry/) — SOC Prime, 2026-06-12
