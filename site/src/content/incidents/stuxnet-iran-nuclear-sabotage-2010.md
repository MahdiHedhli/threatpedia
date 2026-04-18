---
eventId: TP-2010-0001
title: "Stuxnet Attack on Iranian Nuclear Facilities"
date: 2010-06-17
attackType: Sabotage
severity: critical
sector: Energy & Utilities
geography: Iran
threatActor: Unknown (suspected U.S.-Israeli operation)
attributionConfidence: A2
reviewStatus: "under_review"
confidenceGrade: A
generatedBy: dangermouse-bot
generatedDate: 2026-04-16
cves:
  - CVE-2010-2568
  - CVE-2010-2729
  - CVE-2010-3338
  - CVE-2010-3888
relatedSlugs: []
tags:
  - sabotage
  - ics
  - scada
  - nuclear
  - iran
  - zero-day
  - worm
  - nation-state
  - olympic-games
  - stuxnet
sources:
  - url: https://www.cisa.gov/news-events/ics-alerts/ics-alert-10-238-01b
    publisher: CISA
    publisherType: government
    reliability: R1
    publicationDate: "2010-10-14"
    accessDate: "2026-04-16"
    archived: false
  - url: https://www.langner.com/wp-content/uploads/2017/03/to-kill-a-centrifuge.pdf
    publisher: Langner Communications
    publisherType: research
    reliability: R1
    publicationDate: "2013-11-01"
    accessDate: "2026-04-16"
    archived: false
  - url: https://www.symantec.com/content/en/us/enterprise/media/security_response/whitepapers/w32_stuxnet_dossier.pdf
    publisher: Symantec
    publisherType: vendor
    reliability: R1
    publicationDate: "2011-02-01"
    accessDate: "2026-04-16"
    archived: false
  - url: https://www.nytimes.com/2012/06/01/world/middleeast/obama-ordered-wave-of-cyberattacks-against-iran.html
    publisher: The New York Times
    publisherType: media
    reliability: R2
    publicationDate: "2012-06-01"
    accessDate: "2026-04-16"
    archived: false
mitreMappings:
  - techniqueId: T1091
    techniqueName: Replication Through Removable Media
    tactic: Initial Access
    notes: Stuxnet propagated via infected USB drives to cross the air gap between internet-connected networks and the isolated Natanz enrichment facility network.
  - techniqueId: T1203
    techniqueName: Exploitation for Client Execution
    tactic: Execution
    notes: Stuxnet used four zero-day exploits including the Windows Shell LNK vulnerability (CVE-2010-2568) to execute on target systems automatically when a USB drive was browsed.
  - techniqueId: T0831
    techniqueName: Manipulation of Control
    tactic: Impair Process Control
    notes: Stuxnet modified the frequency converter drives controlling IR-1 centrifuge rotor speeds at Natanz, alternating between speeds that caused mechanical stress and eventual physical destruction of the centrifuges.
---

## Executive Summary

Stuxnet was a purpose-built computer worm discovered in June 2010 that targeted Siemens Step 7 industrial control software used in programmable logic controllers (PLCs) managing centrifuge operations at Iran's Natanz uranium enrichment facility. The worm represented the first publicly documented case of a cyberweapon designed to cause physical destruction of industrial equipment.

The malware was designed with precision targeting: while it propagated broadly through Windows systems via multiple zero-day exploits and removable media, its destructive payload activated only when specific Siemens S7-315 and S7-417 PLC configurations matching the Natanz centrifuge cascade architecture were detected. When conditions matched, Stuxnet manipulated the variable-frequency drives controlling centrifuge rotor speeds, alternately accelerating and decelerating the rotors outside their normal operating parameters, causing mechanical stress and physical damage.

The International Atomic Energy Agency (IAEA) reported that Iran decommissioned approximately 1,000 IR-1 centrifuges at Natanz between late 2009 and early 2010, consistent with the timeline of Stuxnet's destructive operations. While no government officially claimed responsibility, reporting by The New York Times and other outlets attributed the operation — codenamed "Olympic Games" — to a joint effort by the United States and Israel.

## Technical Analysis

Stuxnet was approximately 500 kilobytes in size and exhibited a level of engineering complexity not previously observed in malware at the time of its discovery. The worm used four previously unknown zero-day vulnerabilities in Microsoft Windows for propagation: CVE-2010-2568 (Windows Shell LNK vulnerability), CVE-2010-2729 (Windows Print Spooler vulnerability), CVE-2010-3338 (Windows Task Scheduler vulnerability), and CVE-2010-3888 (Windows kernel vulnerability). The use of four zero-days in a single malware sample was considered exceptional.

The worm was digitally signed with stolen certificates from Realtek Semiconductor and JMicron Technology, both Taiwanese hardware manufacturers. These valid digital signatures allowed the malware's drivers to load without triggering Windows security warnings.

Stuxnet's propagation mechanisms included USB removable media (via the LNK vulnerability), network shares, the Windows Print Spooler, and Siemens Step 7 project files. The USB propagation mechanism was designed to cross the air gap between internet-connected networks and the isolated industrial control network at Natanz.

The destructive payload targeted two specific Siemens PLC configurations. The first payload targeted the S7-315 controller managing groups of 164 centrifuges (a cascade), manipulating the frequency converter drives that controlled rotor speeds. The worm periodically changed the rotor frequency from the normal 1,064 Hz to 1,410 Hz and then to 2 Hz, causing the centrifuges to alternately spin too fast and too slowly. The second payload targeted S7-417 controllers managing centrifuge cascade valves.

During the attack, Stuxnet recorded legitimate process data from the PLCs and replayed it to the operator monitoring systems, a man-in-the-middle technique that concealed the physical effects of the sabotage from facility operators. This made diagnosis of the centrifuge failures difficult, as monitoring systems displayed normal operations while the centrifuges were being physically damaged.

## Attack Chain

### Stage 1: Initial Infection via USB

Stuxnet was introduced to networks associated with Iranian nuclear infrastructure through infected USB drives. The worm exploited the Windows Shell LNK vulnerability (CVE-2010-2568) to execute automatically when a user browsed a USB drive's contents in Windows Explorer.

### Stage 2: Network Propagation

Once on a connected network, Stuxnet propagated via network shares, the Windows Print Spooler vulnerability, and by infecting Siemens Step 7 project files stored on shared drives. Each propagation method expanded the worm's reach within the target environment.

### Stage 3: Target Identification

On each infected system, Stuxnet checked for the presence of Siemens Step 7 software and specific PLC configurations matching the Natanz centrifuge cascade architecture. If the target configuration was not found, the worm propagated but did not activate its destructive payload.

### Stage 4: PLC Reprogramming

Upon identifying the target PLC configuration, Stuxnet injected malicious code into the PLC program, replacing legitimate control logic with instructions to manipulate centrifuge rotor speeds. The worm simultaneously recorded and replayed legitimate sensor data to operator workstations.

### Stage 5: Physical Destruction

The manipulated rotor speeds caused mechanical resonance and stress in the IR-1 centrifuges, leading to bearing failures, rotor cracks, and centrifuge destruction. The attacks occurred in periodic cycles, making the failures appear as quality control issues rather than sabotage.

## Impact Assessment

The IAEA reported that Iran removed and replaced approximately 1,000 IR-1 centrifuges at Natanz between late 2009 and early 2010. Iran's enrichment capacity was temporarily reduced, though the precise extent of the setback to Iran's nuclear program remains debated. Estimates range from a few months to two years of delay.

Beyond the physical damage to centrifuges, Stuxnet's discovery had lasting effects on the global cybersecurity landscape. It demonstrated that cyber operations could cause physical destruction of industrial equipment, crossing a threshold that had been theoretical. The incident prompted governments worldwide to reassess the security of their critical infrastructure industrial control systems.

The worm's uncontrolled propagation beyond the intended target — Stuxnet eventually infected an estimated 100,000 computers in over 100 countries — raised questions about the collateral effects of offensive cyber weapons and the risks of uncontrolled malware proliferation.

## Historical Context

No government has officially claimed responsibility for Stuxnet. In June 2012, The New York Times reported that the worm was part of a joint U.S.-Israeli covert operation codenamed "Olympic Games," initiated under the George W. Bush administration and continued under the Obama administration. The reporting was based on interviews with current and former U.S., European, and Israeli officials.

Technical analysis by Symantec, Kaspersky Lab, and independent researchers identified strong circumstantial connections to state-level capabilities. The use of four zero-day exploits, stolen digital certificates, deep knowledge of Siemens S7 PLC programming, and detailed understanding of the Natanz centrifuge cascade architecture indicated a development effort requiring resources and intelligence collection capabilities consistent with nation-state programs.

Kaspersky Lab's analysis identified code similarities between Stuxnet and the Equation Group malware toolkit, which was subsequently linked to the U.S. National Security Agency's Tailored Access Operations unit following the Shadow Brokers leaks in 2016-2017.

Attribution confidence is assessed as A2 (probably true, from a reliable source) based on investigative journalism and vendor technical analysis, in the absence of official government confirmation.

## Timeline

### 2005-01-01 — Development Begins

Analyses of early Stuxnet variants suggest development began as early as 2005, with the first known variant (Stuxnet 0.5) compiled in 2007.

### 2007-11-01 — Stuxnet 0.5 Deployed

The earliest known Stuxnet variant was deployed, targeting the S7-417 valve controllers at Natanz. This version used different propagation methods and a different attack strategy than the later variants.

### 2009-06-01 — Stuxnet 1.0 Deployed

The major revision of Stuxnet was deployed, adding the four Windows zero-day exploits and the S7-315 centrifuge rotor speed manipulation payload. This version exhibited more aggressive propagation behavior.

### 2010-01-01 — Centrifuge Failures Peak

Iran experienced a peak in centrifuge failures at Natanz, decommissioning approximately 1,000 IR-1 units. IAEA inspectors observed the decommissioned centrifuges during verification visits.

### 2010-06-17 — Stuxnet Discovered

Belarusian antivirus company VirusBlokAda identified the malware on Iranian systems after a customer reported repeated rebooting issues. The discovery marked the beginning of public analysis.

### 2010-07-16 — Microsoft Patches LNK Vulnerability

Microsoft released an emergency patch for CVE-2010-2568, the Windows Shell LNK vulnerability used by Stuxnet for USB-based propagation.

### 2010-09-30 — Symantec W32.Stuxnet Dossier Published

Symantec published its comprehensive technical analysis of Stuxnet, detailing the worm's architecture, propagation mechanisms, and PLC payload.

### 2012-06-01 — NYT Reports Olympic Games

The New York Times published a detailed account attributing Stuxnet to a joint U.S.-Israeli operation codenamed Olympic Games.

## Remediation & Mitigation

Following Stuxnet's discovery, Siemens released security updates for the Step 7 software and hardened PLC configurations. Microsoft patched the four zero-day vulnerabilities used by the worm. Organizations operating industrial control systems (ICS) were advised to implement USB device restrictions, network segmentation between IT and OT environments, and application whitelisting on engineering workstations.

The incident catalyzed the development of ICS-specific cybersecurity standards and guidelines. NIST published Special Publication 800-82 (Guide to Industrial Control Systems Security), and ICS-CERT (now CISA) expanded its advisories and vulnerability coordination for industrial control system products. The Stuxnet incident drove investment in ICS security monitoring tools, anomaly detection for industrial protocols, and PLC integrity verification mechanisms.

Organizations operating critical infrastructure should implement defense-in-depth strategies for ICS environments, including: strict removable media policies, network segmentation between corporate IT and OT networks, monitoring of PLC program integrity, application whitelisting on SCADA and engineering workstations, and regular security assessments of industrial control system configurations. The Stuxnet case demonstrated that air-gapped networks provide insufficient protection when removable media is used for data transfer.

## Sources & References

- [CISA: ICS-ALERT-10-238-01B — Stuxnet Malware Mitigation](https://www.cisa.gov/news-events/ics-alerts/ics-alert-10-238-01b) — CISA, 2010-10-14
- [Langner Communications: To Kill a Centrifuge — Technical Analysis of Stuxnet](https://www.langner.com/wp-content/uploads/2017/03/to-kill-a-centrifuge.pdf) — Langner Communications, 2013-11-01
- [Symantec: W32.Stuxnet Dossier](https://www.symantec.com/content/en/us/enterprise/media/security_response/whitepapers/w32_stuxnet_dossier.pdf) — Symantec, 2011-02-01
- [The New York Times: Obama Ordered Wave of Cyberattacks Against Iran](https://www.nytimes.com/2012/06/01/world/middleeast/obama-ordered-wave-of-cyberattacks-against-iran.html) — The New York Times, 2012-06-01
