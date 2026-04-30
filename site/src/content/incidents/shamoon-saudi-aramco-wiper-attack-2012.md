---
eventId: TP-2012-0001
title: Shamoon / Saudi Aramco Wiper Attack
date: 2012-08-15
attackType: Sabotage / Wiper
severity: critical
sector: Energy / Oil and Gas
geography: Saudi Arabia, Qatar
threatActor: Cutting Sword of Justice (claimed)
attributionConfidence: A4
reviewStatus: draft_ai
confidenceGrade: A
generatedBy: kernel-k
generatedDate: 2026-04-30
cves: []
relatedSlugs: []
tags:
  - shamoon
  - disttrack
  - saudi-aramco
  - rasgas
  - wiper
  - data-destruction
  - energy-sector
  - cutting-sword-of-justice
sources:
  - url: https://attack.mitre.org/software/S0140/
    publisher: MITRE
    publisherType: research
    reliability: R1
    publicationDate: "2024-11-17"
    accessDate: "2026-04-30"
    archived: false
  - url: https://www.cfr.org/cyber-operations/compromise-of-saudi-aramco-and-rasgas
    publisher: Council on Foreign Relations
    publisherType: research
    reliability: R2
    publicationDate: "2012-08-01"
    accessDate: "2026-04-30"
    archived: false
  - url: https://www.spa.gov.sa/1024835
    publisher: Saudi Press Agency
    publisherType: government
    reliability: R1
    publicationDate: "2012-08-27"
    accessDate: "2026-04-30"
    archived: false
mitreMappings:
  - techniqueId: T1485
    techniqueName: Data Destruction
    tactic: Impact
    notes: CFR reports that Shamoon wiped data from approximately 35,000 Saudi Aramco computers, and MITRE documents the malware family as destructive wiper software.
  - techniqueId: T1561.002
    techniqueName: "Disk Wipe: Disk Structure Wipe"
    tactic: Impact
    notes: MITRE states that Shamoon has been seen overwriting disk structures such as the master boot record, contributing to systems becoming unbootable after the attack.
---

## Summary

The Shamoon attack against Saudi Aramco on August 15, 2012 was a destructive corporate cyber incident documented by multiple public sources. The Council on Foreign Relations states that threat actors wiped data from approximately 35,000 computers belonging to Saudi Aramco, while the Saudi Press Agency later reported that about 30,000 workstations were affected and restored.

The malware involved in the attack is identified as Shamoon, also called Disttrack. MITRE describes Shamoon as wiper malware first used in 2012, while CFR says the malware stole passwords, wiped data, and prevented computers from rebooting. Public reporting also linked a follow-on disruption at RasGas in Qatar less than two weeks later, although the public record is more cautious on whether every technical detail of that later event matched the Saudi Aramco case.

The attack was strategically significant because it showed that destructive malware could impose business disruption even when industrial production systems remained isolated. Saudi Press Agency reported that Saudi Aramco's production plants and hydrocarbon exploration systems were unaffected, but the business network impact still required an extensive internal recovery effort.

## Technical Analysis

MITRE's Shamoon software profile describes the malware as Windows wiper malware used in 2012 and later reappearing in 2016 and 2018. MITRE states that Shamoon attempts to overwrite operating system files and disk structures, including the master boot record, and can reboot systems after wiping is complete. Those characteristics align with CFR's description of a malware event that wiped data and rendered machines unable to boot.

The public record available in the selected sources is stronger on destructive outcome than on the exact 2012 intrusion sequence. CFR says Shamoon stole passwords and wiped data. MITRE separately documents Shamoon as malware that has used HTTP for command-and-control, copied itself to remote machines, and used Windows service or task-based execution in some observed cases, but those family-level behaviors may not directly apply to the Saudi Aramco intrusion itself.

The malware was designed for disruption rather than covert persistence. The incident did not center on ransomware demands or data-theft monetization. It centered on destroying workstation data at scale and forcing a large enterprise to isolate, rebuild, and restore large parts of its business computing environment.

## Attack Chain

### Stage 1: Initial Compromise Remained Publicly Unclear

The selected sources do not provide a definitive, incident-specific public account of the original intrusion vector into Saudi Aramco. No further inference on the entry path is drawn from the available sources.

### Stage 2: Malware Deployment in the Corporate Windows Environment

CFR reports that malware used in the incident stole passwords, wiped data, and prevented computers from rebooting. MITRE describes Shamoon as Windows malware associated with destructive wiping operations, consistent with deployment inside the enterprise workstation environment rather than industrial control systems.

### Stage 3: Coordinated Data and Disk Destruction

MITRE states that Shamoon has been seen overwriting operating system files and disk structures such as the master boot record. CFR's account of the Saudi Aramco incident describes a destructive event that wiped data on tens of thousands of computers and left them unbootable.

### Stage 4: Corporate IT Disruption

As the destructive phase spread, Saudi Aramco isolated electronic systems from outside access. Saudi Press Agency later reported that the virus had impacted about 30,000 workstations but did not affect the company's isolated production and exploration systems.

### Stage 5: Related Regional Follow-on Activity

CFR reports that less than two weeks after the Aramco incident, RasGas in Qatar was also knocked offline by suspected state-sponsored attackers. Public reporting treats the RasGas case as closely related in timing and context, even where the exact technical overlap remained less explicit than in the Saudi Aramco case.

## Impact Assessment

The Saudi Aramco incident caused business IT damage. CFR states that approximately 35,000 computers were wiped. Saudi Press Agency later reported that about 30,000 workstations were affected and that main internal network services had to be restored before employees fully resumed normal business.

The destructive scope mattered because Saudi Aramco was and remains one of the world's largest oil companies. Even though the malware did not affect production plants or hydrocarbon exploration systems, the attack demonstrated that destructive endpoint attacks on business networks could still create operational strain, recovery cost, and reputational impact.

The event also helped define a category of state-linked or state-adjacent destructive cyber operations aimed at commercial infrastructure. CFR characterizes the case as a signal of growing Iranian cyber capability and willingness to use destructive cyber effects in regional competition, while still relying on intelligence-based attribution rather than public technical proof alone.

## Attribution

Attribution should remain explicit but cautious. CFR says hackers calling themselves the "Cutting Sword of Justice" claimed responsibility for the Saudi Aramco incident. The same CFR account states that U.S. intelligence sources attributed the attack to Iran and lists Iran as the suspected state sponsor.

MITRE's Shamoon software page says the malware was first used in 2012 by an Iranian group known as the "Cutting Sword of Justice." That is stronger than a generic unknown attribution, but it does not constitute public judicial proof tying the Saudi Aramco event to a single confirmed state command structure.

The incident is documented as a claimed Cutting Sword of Justice operation with suspected Iran-linked sponsorship or direction based on U.S. intelligence reporting, without independent technical proof in the public record.

## Timeline

### 2012-08-15 — Saudi Aramco Systems Are Hit

Saudi Press Agency later reported that the malicious virus impacted Saudi Aramco on August 15, 2012. CFR places the incident in August 2012 and describes it as the wiping of data from roughly 35,000 computers.

### 2012-08-15 — External Connectivity Is Restricted

Saudi Aramco isolated electronic systems from outside access as a precaution after the disruption was identified. The isolation helped protect production systems but underscored the scale of the workstation compromise.

### 2012-08-Late — RasGas Suffers Related Disruption

CFR reports that less than two weeks after the Aramco incident, RasGas in Qatar was also knocked offline by suspected state-sponsored attackers.

### 2012-08-27 — Saudi Aramco Reports Main Network Recovery

Saudi Press Agency reported that Saudi Aramco had restored all of its main internal network services affected by the virus and that the impacted workstations had been cleaned and returned to service.

### 2017-05-31 — MITRE Creates Shamoon Software Entry

MITRE later formalized Shamoon as ATT&CK software entry S0140, documenting the malware family as destructive wiper software first used in 2012 and later observed again in subsequent Gulf-region attacks.

## Remediation & Mitigation

The Saudi Aramco case reinforced the value of network segregation for industrial organizations. Saudi Press Agency reported that production plants and hydrocarbon exploration systems were unaffected because they operated on isolated network systems. That separation limited the attack's effect to business computing rather than core operational technology.

For Windows enterprise environments, the broader lessons are endpoint hardening, credential protection, privileged-access control, rapid isolation capability, and recovery planning for destructive malware rather than only data theft. MITRE's Shamoon profile shows why organizations also need to plan for disk destruction and unbootable systems, not just file encryption or network outages.

The incident also showed the importance of crisis recovery at scale. Restoring tens of thousands of workstations is a logistics problem as much as a malware problem. Business continuity planning, clean image availability, offline restoration paths, and segmentation between office IT and industrial operations all reduce the blast radius of destructive malware events.

## Sources & References

- [MITRE: Shamoon (S0140)](https://attack.mitre.org/software/S0140/) — MITRE, 2024-11-17
- [Council on Foreign Relations: Compromise of Saudi Aramco and RasGas](https://www.cfr.org/cyber-operations/compromise-of-saudi-aramco-and-rasgas) — Council on Foreign Relations, 2012-08-01
- [Saudi Press Agency: Saudi Aramco Restarts All Main Internal Network Services Impacted By A Malicious Virus](https://www.spa.gov.sa/1024835) — Saudi Press Agency, 2012-08-27
