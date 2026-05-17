---
eventId: TP-2017-0004
title: "TRITON / TRISIS Safety-System Attack"
date: 2017-12-14
attackType: Sabotage
severity: critical
sector: Energy & Utilities
geography: Middle East
threatActor: "TsNIIKhM-linked Russian actors"
attributionConfidence: A2
reviewStatus: "draft_ai"
confidenceGrade: A
generatedBy: dangermouse-bot
generatedDate: 2026-05-17
cves: []
relatedSlugs: []
tags:
  - triton
  - trisis
  - hatman
  - industrial-control-systems
  - safety-instrumented-systems
  - triconex
  - energy-sector
  - operational-technology
sources:
  - url: https://www.cisa.gov/news-events/cybersecurity-advisories/aa22-083a
    publisher: CISA
    publisherType: government
    reliability: R1
    publicationDate: "2022-03-24"
    archived: false
  - url: https://www.ic3.gov/CSA/2022/220325.pdf
    publisher: FBI IC3
    publisherType: government
    reliability: R1
    publicationDate: "2022-03-24"
    archived: false
  - url: https://www.cisa.gov/sites/default/files/documents/MAR-17-352-01%20HatMan%20-%20Safety%20System%20Targeted%20Malware%20%28Update%20B%29.pdf
    publisher: CISA / DHS
    publisherType: government
    reliability: R1
    publicationDate: "2019-03-05"
    archived: false
  - url: https://cloud.google.com/blog/topics/threat-intelligence/attackers-deploy-new-ics-attack-framework-triton
    publisher: Google / Mandiant
    publisherType: vendor
    reliability: R1
    publicationDate: "2017-12-14"
    archived: false
  - url: https://attack.mitre.org/software/S1009/
    publisher: MITRE ATT&CK
    publisherType: research
    reliability: R1
    publicationDate: "2026-05-12"
    accessDate: "2026-05-17"
    archived: false
mitreMappings:
  - techniqueId: T1059.006
    techniqueName: Python
    tactic: Execution
    attackVersion: v19.0
    confidence: confirmed
    evidence: "CISA describes TRITON as using a custom Python script and four Python modules, and Mandiant describes trilog.exe as a Py2EXE-compiled Python script."
  - techniqueId: T1036
    techniqueName: Masquerading
    tactic: Stealth
    attackVersion: v19.0
    confidence: confirmed
    evidence: "Mandiant and MITRE describe TRITON as using the name trilog.exe to resemble legitimate Triconex software, while MITRE also describes inject.bin as masquerading as a standard compiled PowerPC program."
  - techniqueId: T1018
    techniqueName: Remote System Discovery
    tactic: Discovery
    attackVersion: v19.0
    confidence: confirmed
    evidence: "MITRE describes TRITON as capable of detecting Triconex controllers on the network by sending a UDP broadcast packet over port 1502."
  - techniqueId: T1495
    techniqueName: Firmware Corruption
    tactic: Impact
    attackVersion: v19.0
    confidence: confirmed
    evidence: "CISA and MITRE describe TRITON as injecting payloads into Triconex controller firmware memory and enabling code execution or memory modification in the firmware region."
---

## Summary

In 2017, attackers deployed TRITON, also known as TRISIS and HatMan, against safety systems at a Middle East-based energy-sector facility. Mandiant said the attackers gained remote access to a safety instrumented system engineering workstation and deployed malware designed to interact with Schneider Electric Triconex Tricon safety controllers. Some controllers entered a failed safe state, which automatically shut down the industrial process and led the asset owner to investigate.

TRITON is distinct from ordinary enterprise malware because it targeted the safety layer that helps keep industrial processes within safe operating limits. CISA, the FBI, and the Department of Energy later stated that Russian cyber actors tied to TsNIIKhM gained access to and used TRITON to manipulate a foreign oil refinery's ICS controllers. Public sources do not identify the victim organization by name in the cited material, and they do not report physical damage or casualties from the 2017 shutdown.

## Technical Analysis

TRITON was built to interact with Triconex Safety Instrumented System controllers through the TriStation protocol. Mandiant described the main executable as `trilog.exe`, a Py2EXE-compiled Python script that depended on a library archive containing standard Python libraries, open-source libraries, and attacker-developed components for Triconex controller interaction. CISA described the malware as including a custom Python script, four Python modules, and malicious shellcode with an injector and payload.

The malware could read and write programs, query controller state, and append attacker-provided payloads into controller memory and the execution table. MITRE ATT&CK describes TRITON as capable of halting or running a program through TriStation, triggering program download and program change APIs, detecting controllers over UDP broadcast on port 1502, and reading, writing, or executing code in the safety-controller firmware region.

CISA stated that TRITON affected Triconex Tricon safety programmable logic controllers by modifying in-memory firmware to add programming. That extra functionality allowed an attacker to read or modify memory contents and execute custom code, which could disable safety-system behavior. In the observed incident, Mandiant assessed that a validation failure between redundant processing units caused some controllers to fail safe and shut down the industrial process.

## Attack Chain

### Stage 1: Access to the Safety Engineering Workstation

Mandiant reported that the attacker gained remote access to an SIS engineering workstation. Public reporting in the cited sources does not provide enough detail to state the initial access vector.

### Stage 2: Deployment of TRITON

The attacker deployed TRITON on the Windows-based engineering workstation. The executable name, `trilog.exe`, resembled a legitimate Triconex TriStation application used for log review.

### Stage 3: Controller Interaction Through TriStation

The malware used attacker-developed Python modules to communicate with Triconex controllers through TriStation. The tool could check controller state, read configuration information exposed by the protocol, and pass payload files to communication libraries for insertion into controller memory.

### Stage 4: Payload Placement in Controller Memory

Mandiant said the sample added an attacker-provided program to the Triconex controller execution table while leaving legitimate programs in place. CISA later described the malware as modifying in-memory firmware and enabling custom code execution on the safety controller.

### Stage 5: Failed Safe State and Process Shutdown

Some SIS controllers entered a failed safe state after application code between redundant processing units failed a validation check. The shutdown surfaced the intrusion before public sources documented any resulting physical damage.

## Impact Assessment

The confirmed operational impact was a shutdown of the affected industrial process. CISA stated that the 2017 TRITON use resulted in the refinery shutting down for several days. Mandiant reported that some SIS controllers entered a failed safe state, triggering an automatic process shutdown and prompting an investigation by the asset owner.

The potential impact was broader than the observed outage. Safety instrumented systems are designed to bring industrial processes back to a safe state when hazardous conditions arise. Mandiant assessed with moderate confidence that the attacker was developing the capability to cause a physical consequence, based on the choice to target the SIS and the capability to reprogram safety controllers.

The cited public sources do not report casualties, environmental damage, confirmed equipment damage, or a public financial loss figure for the 2017 event. CISA also stated that it had no information indicating that the same actors intentionally disrupted U.S. energy-sector infrastructure.

## Attribution

Mandiant did not attribute the activity to a tracked actor when it publicly described the incident in December 2017. It assessed with moderate confidence that the actor was sponsored by a nation state, citing the safety-system target, absence of a clear monetary goal, and the resources needed to build and test the attack framework.

In March 2022, CISA, the FBI, and the Department of Energy linked the 2017 TRITON deployment to Russian cyber actors with ties to TsNIIKhM. The same advisory stated that a TsNIIKhM cyber actor was a co-conspirator in the 2017 deployment. This attribution is bounded to the public U.S. government statements and does not identify the victim organization by name in the cited material.

## Timeline

### 2017 — TRITON Deployment and Process Shutdown

Attackers deployed TRITON against safety systems at a Middle East-based energy-sector facility. Some safety controllers entered a failed safe state and the industrial process shut down.

### 2017-12-14 — Mandiant Public Disclosure

Mandiant publicly described the TRITON malware and the safety-system incident, including the remote access to an SIS engineering workstation and the automatic shutdown caused by failed safe controller behavior.

### 2019-03-05 — CISA / DHS HatMan Analysis

CISA / DHS published the HatMan malware analysis, documenting TRITON components and controller-interaction behavior.

### 2022-03-24 — U.S. Government Energy-Sector Advisory

CISA, the FBI, and the Department of Energy published an advisory describing indicted Russian state-sponsored activity against the energy sector and linking the 2017 TRITON deployment to Russian actors tied to TsNIIKhM.

## Remediation & Mitigation

Safety-system networks should be segmented from process-control and enterprise networks wherever technically feasible. Mandiant recommended that engineering workstations capable of programming SIS controllers should not be dual-homed to other process-control or information-system networks.

Organizations should restrict who can program safety controllers and should use hardware key-switch controls where available. Triconex controller keys should not remain in program mode outside planned programming events, and key-state changes should be covered by change-management and audit procedures.

Asset owners should use strict access control, application allowlisting, host logging, and network monitoring on systems that can reach safety controllers. CISA also recommends protocol filtering, risk-based patch management, centralized log review for critical ICS hosts, and avoiding unnecessary vendor device connections to ICS networks.

For Schneider Electric Triconex environments, defenders should review CISA and vendor guidance for TRITON-related mitigations and patches. Public sources state that Schneider Electric issued a patch for the attack vector described in the U.S. government advisory.

## Sources & References

- [CISA: Tactics, Techniques, and Procedures of Indicted State-Sponsored Russian Cyber Actors Targeting the Energy Sector](https://www.cisa.gov/news-events/cybersecurity-advisories/aa22-083a) — CISA, 2022-03-24
- [FBI IC3: Tactics, Techniques, and Procedures of Indicted State-Sponsored Russian Cyber Actors Targeting the Energy Sector](https://www.ic3.gov/CSA/2022/220325.pdf) — FBI IC3, 2022-03-24
- [CISA / DHS: MAR-17-352-01 HatMan - Safety System Targeted Malware (Update B)](https://www.cisa.gov/sites/default/files/documents/MAR-17-352-01%20HatMan%20-%20Safety%20System%20Targeted%20Malware%20%28Update%20B%29.pdf) — CISA / DHS, 2019-03-05
- [Google / Mandiant: Attackers Deploy New ICS Attack Framework TRITON and Cause Operational Disruption to Critical Infrastructure](https://cloud.google.com/blog/topics/threat-intelligence/attackers-deploy-new-ics-attack-framework-triton) — Google / Mandiant, 2017-12-14
- [MITRE ATT&CK: Triton, Software S1009](https://attack.mitre.org/software/S1009/) — MITRE ATT&CK, 2026-05-12
