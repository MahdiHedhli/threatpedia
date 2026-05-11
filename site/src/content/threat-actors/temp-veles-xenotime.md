---
name: "TEMP.Veles / XENOTIME"
aliases:
  - "TEMP.Veles"
  - "XENOTIME"
  - "DYMALLOY"
  - "TRITON Activity Group"
affiliation: "Russia-aligned"
motivation: "Sabotage / Safety-System Disruption"
status: "active"
country: "Russia"
firstSeen: "2014"
lastSeen: "2019"
targetSectors:
  - "Energy"
  - "Oil and Gas"
  - "Industrial Control Systems"
targetGeographies:
  - "Middle East"
  - "United States"
  - "Europe"
tools:
  - "TRITON"
  - "TRISIS"
  - "HatMan"
  - "PLINK"
  - "Impacket"
mitreMappings:
  - techniqueId: "T1566.001"
    techniqueName: "Spearphishing Attachment"
    tactic: "Initial Access"
    attack-version: "v19"
    notes: "Group used spearphishing attachments for initial access to target networks."
  - techniqueId: "T1078"
    techniqueName: "Valid Accounts"
    tactic: "Persistence"
    attack-version: "v19"
    notes: "Leveraged valid VPN and remote-access credentials to maintain access and blend with legitimate activity."
  - techniqueId: "T1036"
    techniqueName: "Masquerading"
    tactic: "Stealth"
    attack-version: "v19"
    notes: "TRITON malware components used filenames resembling legitimate Triconex software and Windows components."
  - techniqueId: "T1059"
    techniqueName: "Command and Scripting Interpreter"
    tactic: "Execution"
    attack-version: "v19"
    notes: "Used Python-based frameworks and scripting for communication with Triconex controllers."
  - techniqueId: "T1003"
    techniqueName: "OS Credential Dumping"
    tactic: "Credential Access"
    attack-version: "v19"
    notes: "Harvested credentials to facilitate lateral movement within target environments."
  - techniqueId: "T1489"
    techniqueName: "Service Stop"
    tactic: "Impact"
    attack-version: "v19"
    notes: "TRITON was designed to stop or disable Triconex Safety Instrumented System services, removing safety protections from the targeted industrial process."
attributionConfidence: "A2"
attributionRationale: "Multiple independent vendor and government assessments link this actor to the Russian Central Scientific Research Institute of Chemistry and Physics (TsNIIKhM). Evidence includes infrastructure overlap, code artifacts, and operational patterns corroborated by CISA, Dragos, and Mandiant reporting."
reviewStatus: "draft_ai"
generatedBy: "dangermouse-bot"
generatedDate: 2026-05-10
tags:
  - "ics"
  - "ot"
  - "safety-systems"
  - "triton"
  - "trisis"
  - "hatman"
  - "russia"
  - "energy"
  - "sabotage"
sources:
  - url: "https://attack.mitre.org/groups/G0088/"
    publisher: "MITRE"
    publisherType: "research"
    reliability: "R1"
    publicationDate: "2021-01-13"
    accessDate: "2026-05-10"
    archived: false
  - url: "https://www.cisa.gov/sites/default/files/documents/MAR-17-352-01%20HatMan%20-%20Safety%20System%20Targeted%20Malware%20%28Update%20B%29.pdf"
    publisher: "CISA / DHS"
    publisherType: "government"
    reliability: "R1"
    publicationDate: "2018-12-18"
    accessDate: "2026-05-10"
    archived: false
  - url: "https://cloud.google.com/blog/topics/threat-intelligence/attackers-deploy-new-ics-attack-framework-triton"
    publisher: "Google / Mandiant"
    publisherType: "vendor"
    reliability: "R1"
    publicationDate: "2017-12-14"
    accessDate: "2026-05-10"
    archived: false
  - url: "https://www.dragos.com/threat/xenotime/"
    publisher: "Dragos"
    publisherType: "vendor"
    reliability: "R1"
    publicationDate: "2019-01-01"
    accessDate: "2026-05-10"
    archived: false
---

## Executive Summary

TEMP.Veles (Mandiant designation) and XENOTIME (Dragos designation) refer to the same threat activity cluster responsible for developing and deploying TRITON — also known as TRISIS and HatMan — a malware framework engineered to attack Triconex Safety Instrumented Systems (SIS). The group is responsible for known attacks on industrial control systems, targeting safety mechanisms whose failure could permit uncontrolled physical processes. MITRE ATT&CK tracks the cluster as G0088.

The actor is assessed as Russia-aligned based on corroborating evidence from multiple independent vendor and government investigations. Dragos observed the group expanding its targeting beyond the initial incident scope to cover additional geographies and sectors through at least 2019.

## Attribution

Multiple independent assessments — from CISA, Mandiant, and Dragos — attribute TEMP.Veles / XENOTIME to the Russian Central Scientific Research Institute of Chemistry and Physics (TsNIIKhM). The CISA HatMan Malware Analysis Report (MAR-17-352-01, Update B) represents the primary U.S. government technical corroboration.

Attribution evidence includes infrastructure and IP address overlap linked to TsNIIKhM, malware artifacts consistent with Russian development patterns, and operational security lapses during the intrusion that exposed supporting infrastructure. Attribution of TsNIIKhM to a specific Russian government ministry or intelligence sponsor is not definitively established in available public reporting and should not be assumed.

## Technical Capabilities

The group's primary capability is the TRITON framework, which communicates directly with Triconex Safety Instrumented Systems via Triconex's proprietary TriStation protocol. TRITON is designed to reprogram SIS controller logic, disable safety instrumentation, or cause controllers to enter a fail state — any of which could remove safety protections from an industrial process.

Supporting capabilities include use of legitimate remote access tools (PLINK) and VPN sessions to blend with normal IT traffic, Python-based scripting for controller interaction and operational tooling, credential harvesting using Impacket and custom tooling, and multi-stage pre-positioning within corporate IT networks prior to OT environment access. The tool development quality and operational tradecraft are consistent with state-linked operators.

## Notable Campaigns

The most publicly documented incident attributed to this group targeted a petrochemical facility in Saudi Arabia in 2017. The attackers gained access to Triconex SIS controllers and deployed TRITON. A logic error in the malware caused the controllers to enter a fail-safe state, which triggered an unplanned process shutdown and surfaced the intrusion to defenders before physical damage occurred.

Dragos subsequently tracked XENOTIME conducting reconnaissance against targets beyond the initial Saudi Arabian target set, including entities in the United States, Europe, and the Middle East, with particular interest noted in the electrical sector. This expansion is documented in Dragos's XENOTIME threat profile. No additional confirmed destructive incidents attributable to this group have been disclosed in open-source reporting within the source coverage used to produce this profile.

## MITRE ATT&CK Profile

The group's technique coverage spans initial access through impact. Spearphishing attachment delivery (T1566.001) is the assessed initial access vector. Valid account abuse (T1078) supported continued VPN and remote-service access, while masquerading (T1036) reflects stealth through filenames that resembled legitimate Triconex and Windows components. OS credential dumping (T1003) supports lateral movement into OT environments. Command and scripting interpreter use (T1059) reflects the Python-centered toolkit. Service Stop (T1489) captures the intended final effect: disabling Triconex SIS processes to remove safety barriers from the targeted industrial process. Full technique coverage for G0088 is maintained in MITRE ATT&CK.

## Sources & References

Coverage of this actor is concentrated in the 2017–2019 period. Post-2019 operational activity has not been confirmed in open-source reporting. The attribution assessment to TsNIIKhM is corroborated across independent government and vendor sources. Attribution to a higher-level Russian state principal beyond TsNIIKhM remains plausible but is not definitively established in the open-source record. The three names for the malware — TRITON, TRISIS, HatMan — and the two names for the group — TEMP.Veles, XENOTIME — reflect independent discovery threads and do not indicate distinct toolsets or activity clusters.

- [MITRE: ATT&CK Group G0088 — TEMP.Veles](https://attack.mitre.org/groups/G0088/) — MITRE, 2021-01-13
- [CISA / DHS: HatMan — Safety System Targeted Malware (Update B)](https://www.cisa.gov/sites/default/files/documents/MAR-17-352-01%20HatMan%20-%20Safety%20System%20Targeted%20Malware%20%28Update%20B%29.pdf) — CISA / DHS, 2018-12-18
- [Google / Mandiant: Attackers Deploy New ICS Attack Framework TRITON](https://cloud.google.com/blog/topics/threat-intelligence/attackers-deploy-new-ics-attack-framework-triton) — Google / Mandiant, 2017-12-14
- [Dragos: XENOTIME Threat Profile](https://www.dragos.com/threat/xenotime/) — Dragos, 2019-01-01
