---
campaignId: "TP-CAMP-2019-0001"
title: "Operation Triangulation iOS Spyware Campaign"
startDate: 2019-01-01
endDate: 2023-12-31
ongoing: false
attackType: "Mobile Spyware / Zero-Click Exploitation"
severity: high
sector: "Technology / Cross-Sector"
geography: "Global"
threatActor: "Unknown"
attributionConfidence: A4
reviewStatus: "draft_ai"
confidenceGrade: B
generatedBy: "dangermouse-bot"
generatedDate: 2026-05-18
cves:
  - "CVE-2023-32434"
  - "CVE-2023-32435"
  - "CVE-2023-38606"
  - "CVE-2023-41990"
relatedIncidents: []
tags:
  - "operation-triangulation"
  - "ios"
  - "zero-click"
  - "imessage"
  - "spyware"
  - "mobile"
  - "kaspersky"
  - "apple"
sources:
  - url: "https://securelist.com/operation-triangulation/109842/"
    publisher: "Kaspersky Securelist"
    publisherType: vendor
    reliability: R1
    publicationDate: "2023-06-01"
    accessDate: "2026-05-18"
    archived: false
  - url: "https://securelist.com/operation-triangulation-catching-wild-triangle/110916/"
    publisher: "Kaspersky Securelist"
    publisherType: vendor
    reliability: R1
    publicationDate: "2023-10-25"
    accessDate: "2026-05-18"
    archived: false
  - url: "https://usa.kaspersky.com/about/press-releases/connecting-the-dots-kaspersky-reveals-in-depth-insights-into-operation-triangulation"
    publisher: "Kaspersky"
    publisherType: vendor
    reliability: R1
    publicationDate: "2023-12-27"
    accessDate: "2026-05-18"
    archived: false
  - url: "https://support.apple.com/en-us/103837"
    publisher: "Apple"
    publisherType: vendor
    reliability: R1
    publicationDate: "2023-07-24"
    accessDate: "2026-05-18"
    archived: false
  - url: "https://www.cisa.gov/known-exploited-vulnerabilities-catalog?field_cve=CVE-2023-32434"
    publisher: "CISA"
    publisherType: government
    reliability: R1
    publicationDate: "2023-06-23"
    accessDate: "2026-05-18"
    archived: false
mitreMappings:
  - techniqueId: "T1203"
    techniqueName: "Exploitation for Client Execution"
    tactic: "Execution"
    attackVersion: "v19"
    confidence: confirmed
    evidence: "Kaspersky documented that Operation Triangulation used a zero-click iMessage exploit chain, exploiting CVE-2023-41990 in a font processing component and additional vulnerabilities to achieve code execution on target iOS devices without any user interaction."
  - techniqueId: "T1105"
    techniqueName: "Ingress Tool Transfer"
    tactic: "Command and Control"
    attackVersion: "v19"
    confidence: confirmed
    evidence: "Kaspersky reported that after initial exploitation a binary validator and subsequently the TriangleDB implant were downloaded from attacker-controlled infrastructure to the compromised iOS device."
  - techniqueId: "T1082"
    techniqueName: "System Information Discovery"
    tactic: "Discovery"
    attackVersion: "v19"
    confidence: confirmed
    evidence: "Kaspersky described a validator stage in the exploit chain that checks device characteristics including iOS version and jailbreak status before deciding whether to proceed with implant deployment."
  - techniqueId: "T1005"
    techniqueName: "Data from Local System"
    tactic: "Collection"
    attackVersion: "v19"
    confidence: confirmed
    evidence: "Kaspersky documented that the TriangleDB implant collected files, microphone recordings, photographs, geolocation data, and credentials from compromised iOS devices."
  - techniqueId: "T1041"
    techniqueName: "Exfiltration Over C2 Channel"
    tactic: "Exfiltration"
    attackVersion: "v19"
    confidence: confirmed
    evidence: "Kaspersky reported that data collected by TriangleDB was transmitted to attacker-controlled command and control infrastructure."
atlasMappings: []
framework-mappings: []
---

## Executive Summary

Operation Triangulation was a multi-year iOS spyware campaign documented by Kaspersky beginning in June 2023. The campaign used zero-click iMessage exploits to compromise Apple iOS devices without any interaction from the victim. Kaspersky researchers discovered the activity while monitoring their own corporate network traffic and found forensic evidence suggesting infections dating to 2019.

The attack chain exploited four vulnerabilities in iOS: CVE-2023-41990, CVE-2023-32434, CVE-2023-32435, and CVE-2023-38606. Apple issued patches across iOS releases in June and July 2023 that addressed all four. CISA added CVE-2023-32434 to its Known Exploited Vulnerabilities catalog, confirming active exploitation in the wild and directing federal agencies to apply patches.

The campaign deployed an implant called TriangleDB capable of collecting files, geolocation data, microphone recordings, and other sensitive information from compromised devices. Kaspersky described the exploit chain as technically complex on a mobile platform. The actor responsible has not been publicly attributed to any confirmed state, intelligence service, or named threat group.

## Technical Analysis

Operation Triangulation relied on a multi-stage exploit chain that required no user interaction. The initial attack arrived as a malicious iMessage attachment. iOS processed the attachment automatically as part of normal message handling, triggering exploitation without the victim opening or viewing anything. Kaspersky reported that the exploit message was removed from iMessage following successful exploitation, reducing visible traces on the device.

The exploit chain used four vulnerabilities working in sequence. CVE-2023-41990 involved a vulnerability in the ADJUST TrueType font instruction handler in a component present in iOS versions before 16.2, exploitable through iMessage. CVE-2023-32435 is a WebKit vulnerability. CVE-2023-32434 is a kernel integer overflow. CVE-2023-38606 exploited functionality in Apple GPU hardware memory-mapped I/O registers that Kaspersky described as undocumented and not accessible through the public iOS API, potentially intended for internal testing or debugging. Kaspersky identified CVE-2023-38606 as the most notable element of the chain because it relied on hardware-level functionality with no documented public interface.

After achieving initial code execution, the chain downloaded a binary validator from attacker-controlled infrastructure. The validator checked device characteristics -- including iOS version and jailbreak status -- before deciding whether to continue with implant deployment. Devices that did not pass the validator received no further payload.

Devices that passed the validator received the TriangleDB implant. Kaspersky documented TriangleDB as an in-memory implant structured around operator-issued commands delivered through command and control contact. Capabilities include collection of files from the device filesystem, microphone recordings, photographs, geolocation data, and credential material. Kaspersky reported that the implant carried a default lifetime of 30 days, after which it would self-delete unless the operator refreshed it through a C2 interaction.

Kaspersky identified the campaign after observing anomalous network traffic from iOS devices on their corporate Wi-Fi. Victims documented in Kaspersky's investigation included Kaspersky employees, though the researchers noted that the campaign scope appeared to extend beyond that organization.

### Attribution

No cited source establishes confirmed attribution for Operation Triangulation to any state government, intelligence service, or named threat group. Kaspersky described the sophistication of the attack chain and the use of an undocumented hardware feature but did not attribute the campaign in their published research. The actor is recorded as unknown.

## Attack Chain

### Stage 1: Zero-Click iMessage Delivery

The attack begins with a malicious iMessage attachment delivered to the target device. No user action is required. iOS processes the attachment automatically as part of normal message handling. Kaspersky reported that the exploit message was removed from the device following exploitation, limiting post-incident evidence recovery.

### Stage 2: Exploit Chain Execution

Four vulnerabilities are chained in sequence. CVE-2023-41990 exploits the ADJUST TrueType font instruction handler. CVE-2023-32435 exploits a WebKit vulnerability. CVE-2023-32434 exploits an integer overflow in the iOS kernel. CVE-2023-38606 exploits undocumented Apple GPU hardware register functionality to bypass kernel memory protections.

### Stage 3: Validator Deployment

After achieving initial code execution, the chain downloads a binary validator from attacker-controlled infrastructure. The validator performs device checks including iOS version detection and jailbreak status evaluation. Devices that do not meet the operator's criteria receive no further payload.

### Stage 4: Implant Deployment

Devices that pass the validator receive the TriangleDB implant. Kaspersky described TriangleDB as an in-memory implant structured around commands issued by the operator through command and control contact.

### Stage 5: Collection and Exfiltration

TriangleDB collects data from the compromised device according to operator commands. Collected material includes files from the local filesystem, microphone recordings, photographs, geolocation data, and credential material. Collected data is transmitted to attacker-controlled command and control infrastructure.

### Stage 6: Implant Lifecycle and Self-Deletion

The implant carries a default lifetime of 30 days and self-deletes if the operator does not refresh it through a C2 interaction within that window. This behavior limits the forensic artifact window on compromised devices.

## MITRE ATT&CK Mapping

### Execution

T1203 - Exploitation for Client Execution: The attack chain exploited CVE-2023-41990 and three additional iOS vulnerabilities to achieve code execution through iMessage without any user interaction. Kaspersky confirmed that no victim action was required to trigger the exploit.

### Command and Control

T1105 - Ingress Tool Transfer: After initial exploitation, the chain fetched a binary validator and subsequently the TriangleDB implant from attacker-controlled infrastructure. Kaspersky documented this two-stage download as a defined part of the attack sequence.

### Discovery

T1082 - System Information Discovery: Kaspersky documented a validator stage that queries device characteristics including the iOS version and jailbreak status before deciding whether to proceed. This check enables the operator to filter targets before committing the full implant.

### Collection

T1005 - Data from Local System: Kaspersky documented that TriangleDB collected files from the device filesystem, microphone recordings, photographs, geolocation data, and credential material. The implant operated through operator-directed commands delivered over C2.

### Exfiltration

T1041 - Exfiltration Over C2 Channel: Kaspersky reported that data collected by TriangleDB was transmitted to attacker-controlled infrastructure through the same command and control channel used to issue implant commands.

## Timeline

### 2019 -- Earliest Documented Infections

Kaspersky reported that forensic evidence from compromised iOS devices suggested infections dating to 2019, based on artifacts recovered during their 2023 investigation.

### Early 2023 -- Kaspersky Discovers Campaign on Corporate Network

Kaspersky researchers identified anomalous outbound network traffic from iOS devices on their corporate Wi-Fi. Investigation revealed silent connections to attacker-controlled infrastructure, leading to discovery of the exploit chain and implant.

### 2023-06-01 -- Kaspersky Publishes Initial Disclosure

Kaspersky published the initial public report on Operation Triangulation, disclosing the zero-click iMessage attack chain, the four-vulnerability sequence, and the TriangleDB implant.

### 2023-06-21 -- Apple Releases iOS 16.5.1 Patches

Apple released iOS 16.5.1 and iPadOS 16.5.1, addressing CVE-2023-32434 and CVE-2023-32435, two of the four vulnerabilities exploited in the Operation Triangulation chain.

### 2023-06-23 -- CISA Adds CVE-2023-32434 to KEV Catalog

CISA added CVE-2023-32434 to its Known Exploited Vulnerabilities catalog, confirming active exploitation in the wild and requiring federal agencies to apply patches by the mandated deadline.

### 2023-07-24 -- Apple Releases iOS 16.6 Patches

Apple released iOS 16.6 and iPadOS 16.6, addressing CVE-2023-38606 and CVE-2023-41990, completing the patch set for all four vulnerabilities used in the campaign.

### 2023-10-25 -- Kaspersky Publishes Extended Technical Analysis

Kaspersky published additional technical findings on the exploit chain, covering in depth how the four vulnerabilities were combined and how the validator and implant stages functioned.

### 2023-12-27 -- Kaspersky Presents Hardware-Level Findings

Kaspersky published findings on the hardware component of the attack chain, describing the exploitation of undocumented Apple GPU co-processor register functionality (CVE-2023-38606) as a technique for bypassing kernel memory protections.

## Remediation & Mitigation

The primary mitigation for Operation Triangulation is applying available iOS patches. Apple addressed all four vulnerabilities in iOS 16.5.1 (June 2023) and iOS 16.6 (July 2023). CISA directed federal agencies to apply patches for CVE-2023-32434. Organizations and individuals should verify that iOS and iPadOS devices are running versions at or above the patched releases and that automatic updates are enabled across managed device fleets.

For organizations managing mobile devices, enforcing update policies through Mobile Device Management can reduce residual exposure. Reviewing MDM configurations to ensure devices receive timely OS updates is a direct control applicable to this and similar iOS vulnerability chains.

Because the campaign used a zero-click delivery mechanism through iMessage, no user-awareness measure can provide a reliable mitigation. Disabling iMessage or restricting its use on high-risk devices reduces the attack surface for iMessage-based zero-click exploitation. Apple's Lockdown Mode, introduced in iOS 16, restricts certain message attachment processing and may reduce exposure to similar attack patterns, though it was not available for the iOS versions affected by the earliest stages of this campaign.

Network defenders can monitor for anomalous outbound connections from mobile devices to unfamiliar infrastructure. Kaspersky reported discovering the campaign through exactly this type of network anomaly. Retaining DNS query logs and network flow data from environments where managed iOS devices connect provides a detection layer for future campaigns using similar infrastructure patterns.

The use of CVE-2023-38606 to exploit undocumented hardware functionality illustrates a class of vulnerability that organizations cannot mitigate through configuration changes alone. Defense against this type of attack depends on vendor patching. Maintaining devices on current, supported iOS versions is the principal control available to defenders for hardware-level vulnerabilities of this kind.

## Sources & References

- [Kaspersky Securelist: Operation Triangulation - iOS Devices Targeted with Previously Unknown Malware](https://securelist.com/operation-triangulation/109842/) — Kaspersky Securelist, 2023-06-01
- [Kaspersky Securelist: Operation Triangulation: Catching Wild Triangle](https://securelist.com/operation-triangulation-catching-wild-triangle/110916/) — Kaspersky Securelist, 2023-10-25
- [Kaspersky: Connecting the Dots - Kaspersky Reveals In-Depth Insights into Operation Triangulation](https://usa.kaspersky.com/about/press-releases/connecting-the-dots-kaspersky-reveals-in-depth-insights-into-operation-triangulation) — Kaspersky, 2023-12-27
- [Apple: About the security content of iOS 16.6 and iPadOS 16.6](https://support.apple.com/en-us/103837) — Apple, 2023-07-24
- [CISA: Known Exploited Vulnerabilities Catalog - CVE-2023-32434](https://www.cisa.gov/known-exploited-vulnerabilities-catalog?field_cve=CVE-2023-32434) — CISA, 2023-06-23
