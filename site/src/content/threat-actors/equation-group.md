---
name: "Equation Group"
aliases:
  - "EQUATION"
affiliation: "United States (assessed)"
motivation: "Espionage"
status: unknown
country: "United States"
firstSeen: "2001"
lastSeen: "2016"
targetSectors:
  - "Government"
  - "Diplomatic"
  - "Telecommunications"
  - "Aerospace"
  - "Energy"
  - "Nuclear Research"
  - "Oil and Gas"
  - "Military"
  - "Financial Services"
  - "Media"
targetGeographies:
  - "Iran"
  - "Russia"
  - "Pakistan"
  - "Afghanistan"
  - "India"
  - "Syria"
  - "Mali"
  - "China"
tools:
  - "GrayFish"
  - "EquationDrug"
  - "EQUATIONLASER"
  - "DoubleFantasy"
  - "TripleFantasy"
  - "Fanny"
mitreMappings:
  - techniqueId: "T1189"
    techniqueName: "Drive-by Compromise"
    tactic: "Initial Access"
    attackVersion: "v19"
    confidence: "confirmed"
    notes: "Kaspersky Lab documented Equation Group delivering DoubleFantasy and other initial-stage implants through watering-hole attacks, redirecting targeted visitors of compromised legitimate websites to attacker-controlled infrastructure."
  - techniqueId: "T1542.002"
    techniqueName: "Component Firmware"
    tactic: "Persistence"
    attackVersion: "v19"
    confidence: "confirmed"
    notes: "Equation Group is documented by Kaspersky Lab as having the capability to overwrite the firmware of hard-disk drives across at least twelve major manufacturers, achieving persistence that survives disk reformats and OS reinstallation. MITRE ATT&CK v19 maps this capability to Component Firmware."
  - techniqueId: "T1564.005"
    techniqueName: "Hidden File System"
    tactic: "Defense Evasion"
    attackVersion: "v19"
    confidence: "confirmed"
    notes: "Both EquationDrug and GrayFish use encrypted virtual file systems stored in the Windows Registry, documented by Kaspersky Lab to conceal malicious modules and collected data from host-based analysis. MITRE ATT&CK v19 maps this to the Hidden File System sub-technique."
  - techniqueId: "T1052.001"
    techniqueName: "Exfiltration over USB"
    tactic: "Exfiltration"
    attackVersion: "v19"
    confidence: "confirmed"
    notes: "The Fanny worm documented by Kaspersky Lab uses USB removable media as both a propagation vector and a covert command-and-control channel in air-gapped network environments, storing data and commands in a hidden area of the drive."
  - techniqueId: "T1014"
    techniqueName: "Rootkit"
    tactic: "Defense Evasion"
    attackVersion: "v19"
    confidence: "confirmed"
    notes: "Kaspersky Lab describes EquationDrug and GrayFish as incorporating kernel-level rootkit functionality to conceal files, processes, and registry entries from host-based detection."
attributionConfidence: A3
attributionRationale: "Kaspersky Lab's 2015 analysis identified targeting patterns and technical depth consistent with a well-resourced state intelligence capability, without attributing to a named government. The 2016 Shadow Brokers dump of purported Equation Group tools led independent researchers to identify code overlaps with previously published descriptions of NSA-linked capabilities, as reported by Ars Technica. No government has formally confirmed or denied this attribution."
reviewStatus: "draft_ai"
generatedBy: "dangermouse-bot"
generatedDate: 2026-05-13
tags:
  - "nation-state"
  - "united-states"
  - "espionage"
  - "apt"
  - "equation-group"
  - "firmware"
  - "air-gap"
  - "shadow-brokers"
sources:
  - url: "https://attack.mitre.org/groups/G0020/"
    publisher: "MITRE ATT&CK"
    publisherType: research
    reliability: R1
    publicationDate: "2025-04-25"
    accessDate: "2026-05-13"
    archived: false
  - url: "https://securelist.com/equation-the-death-star-of-malware-galaxy/68750/"
    publisher: "Kaspersky Lab"
    publisherType: vendor
    reliability: R1
    publicationDate: "2015-02-16"
    accessDate: "2026-05-13"
    archived: false
  - url: "https://arstechnica.com/information-technology/2016/08/code-dumped-online-came-from-omnipotent-nsa-tied-hacking-group/"
    publisher: "Ars Technica"
    publisherType: media
    reliability: R2
    publicationDate: "2016-08-16"
    accessDate: "2026-05-13"
    archived: false
  - url: "https://csrc.nist.gov/publications/detail/sp/800-193/final"
    publisher: "NIST"
    publisherType: government
    reliability: R1
    publicationDate: "2018-05-01"
    accessDate: "2026-05-13"
    archived: false
---

## Executive Summary

Equation Group is a threat actor first publicly documented by Kaspersky Lab in February 2015, with observed activity dating to at least 2001. The group targeted government agencies, diplomatic institutions, telecommunications operators, aerospace companies, energy firms, nuclear research organizations, oil and gas companies, military entities, financial institutions, and media organizations across Iran, Russia, Pakistan, Afghanistan, India, Syria, Mali, China, and other countries.

Kaspersky Lab's 2015 report identified capabilities that were not previously documented in commercial security research at the time of disclosure: malware engineered to reprogram the firmware of hard-disk drives across at least twelve major manufacturers, a worm designed to bridge air-gapped networks using USB removable media as a relay channel, and a multi-generational implant platform spanning more than a decade of continuous development. In August 2016, a group calling itself the Shadow Brokers released files it claimed to have obtained from Equation Group; independent researchers subsequently identified code overlaps with previously published descriptions of NSA-linked tools, as reported by Ars Technica.

## Notable Campaigns

### Hard-Disk Drive Firmware Modification

Kaspersky Lab documented a firmware-level persistence capability: Equation Group malware could reprogram the firmware of hard-disk drives from at least twelve major manufacturers. Once installed in drive firmware, the implant persisted across all software-level erasure, including full disk wipes and operating system reinstallation, and created a concealed storage area not accessible to the operating system. NIST SP 800-193 (Platform Firmware Resiliency Guidelines) identifies firmware-layer persistence as a category of threat for which standard OS-level security controls provide no protection, consistent with the defensive challenge this capability presents.

### Air-Gap Operations via USB

The Fanny worm was designed to operate in environments with no internet connectivity. Kaspersky Lab documented that infected USB drives carried commands from the operator into isolated networks and returned collected reconnaissance data when the drives were later connected to internet-accessible machines. This architecture gave Equation Group the ability to gather information from targets with no direct internet connection.

### Watering-Hole Delivery

Kaspersky Lab documented Equation Group's use of watering-hole attacks to deliver initial-stage implants. Targeted visitors of compromised websites were redirected to attacker-controlled infrastructure. The DoubleFantasy validator checked the identity of each victim before proceeding to full compromise, limiting exposure of later-stage tooling.

### Physical Media Interception

Kaspersky Lab documented at least one instance in which a conference CD-ROM was assessed to have been intercepted and remastered with Equation Group malware before reaching its intended recipient, indicating access to physical supply-chain interception alongside digital vectors.

## Technical Capabilities

Equation Group's documented technical portfolio spans multiple capability areas, with a consistent investment in implant architecture that operates at or below the operating system level.

**DoubleFantasy** and **TripleFantasy** are first-stage validator implants that conduct host reconnaissance and confirm victim identity before delivering further payloads. Their use reflects a selective targeting approach in which full implant deployment is withheld unless the victim matches operational criteria.

**EQUATIONLASER** is an older first-generation implant documented by Kaspersky Lab as having been deployed in earlier operations before being replaced by more advanced tooling.

**EquationDrug** is a modular malware platform capable of loading and unloading individual plugins on demand. Its architecture allows the operator to deploy only the capabilities needed for a specific operation. Kaspersky Lab documented kernel-level rootkit components within EquationDrug that conceal files, processes, and registry entries from the host operating system.

**GrayFish** is the most advanced implant in the documented set. Kaspersky Lab documented GrayFish as achieving deep persistence on victim systems, with the capability to reprogram the firmware of hard-disk drives from at least twelve major manufacturers — persistence that survives disk reformats and operating system reinstallation. GrayFish maintains an encrypted virtual file system stored in the Windows Registry to conceal operator-managed modules and collected data.

**Fanny** is a worm that uses USB removable drives as both a propagation vector and a command-and-control channel in air-gapped environments. Kaspersky Lab documented that Fanny stores reconnaissance data and received commands in a hidden area of the USB drive's file system, enabling bidirectional communication with isolated networks.

The multi-generational tool timeline — from EQUATIONLASER in the early 2000s through EquationDrug, GrayFish, and Fanny — reflects a capability development program maintained over more than a decade. Kaspersky Lab noted that two zero-day vulnerabilities later identified in the Stuxnet malware were also observed in Equation Group operations, suggesting shared exploit resources or coordinated capability development with the actors behind Stuxnet.

## Attribution

Equation Group attribution is assessed rather than confirmed by any government. Kaspersky Lab's 2015 report identified technical characteristics — implant depth, operational longevity, infrastructure scale, and targeting precision — consistent with a well-resourced state intelligence capability, without attributing the group to a named government.

In August 2016, the Shadow Brokers released files purportedly obtained from Equation Group. Security researchers analyzed the released tools and identified overlaps with characteristics previously described in reporting on NSA-linked offensive capabilities; Ars Technica reported on this analysis and the connection to NSA-attributed tooling that researchers assessed from the dump. Neither the United States government nor any other government has issued a formal statement confirming or denying this attribution. The A3 confidence assessment reflects multi-source technical assessment — Kaspersky Lab's initial analysis and subsequent independent research on the Shadow Brokers materials — without government-level confirmation.

## MITRE ATT&CK Profile

**Initial Access**: Equation Group used drive-by compromise (T1189) via watering-hole attacks to deliver DoubleFantasy validators to targeted visitors of compromised websites.

**Persistence**: Equation Group is documented to have the capability to overwrite the firmware of hard-disk drives from major manufacturers (T1542.002), achieving persistence that survives disk reformats and OS reinstallation. This firmware persistence capability is a defining characteristic of the group's long-term access strategy.

**Defense Evasion**: Both EquationDrug and GrayFish use encrypted virtual file systems stored in the Windows Registry (T1564.005) to conceal malicious modules and data from host-based analysis. Kernel-level rootkit components (T1014) in both platforms conceal processes, files, and registry artifacts.

**Exfiltration**: The Fanny worm exfiltrates data over USB physical media (T1052.001), using removable drives as a relay to extract collected information from air-gapped networks.

## Sources & References

- [MITRE ATT&CK: Equation Group (G0020)](https://attack.mitre.org/groups/G0020/) — MITRE ATT&CK, 2025-04-25
- [Kaspersky Lab: Equation — The Death Star of Malware Galaxy](https://securelist.com/equation-the-death-star-of-malware-galaxy/68750/) — Kaspersky Lab, 2015-02-16
- [Ars Technica: Code Dumped Online Came from Omnipotent NSA-Tied Hacking Group](https://arstechnica.com/information-technology/2016/08/code-dumped-online-came-from-omnipotent-nsa-tied-hacking-group/) — Ars Technica, 2016-08-16
- [NIST: SP 800-193 Platform Firmware Resiliency Guidelines](https://csrc.nist.gov/publications/detail/sp/800-193/final) — NIST, 2018-05-01
