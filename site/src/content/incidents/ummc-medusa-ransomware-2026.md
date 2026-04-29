---
eventId: TP-2026-0043
title: University of Mississippi Medical Center Medusa Ransomware Attack
date: 2026-02-19
attackType: ransomware
severity: critical
sector: Healthcare
geography: United States (Mississippi)
threatActor: Medusa (claimed)
attributionConfidence: A4
reviewStatus: under_review
confidenceGrade: C
generatedBy: kernel-k
generatedDate: 2026-04-29
cves: []
relatedSlugs:
  - "passaic-county-medusa-ransomware-2026"
  - "cegedim-sante-health-breach-2026"
  - "conduent-data-breach-2026"
  - "chipsoft-ransomware-dutch-healthcare-2026"
tags:
  - "ransomware"
  - "medusa"
  - "healthcare"
  - "mississippi"
  - "clinic-shutdown"
  - "epic-ehr"
  - "manual-operations"
sources:
  - url: "https://umc.edu/news/VCNotes/2026/February/20.html"
    publisher: "University of Mississippi Medical Center"
    publisherType: community
    reliability: R1
    publicationDate: "2026-02-20"
    accessDate: "2026-04-29"
    archived: false
  - url: "https://umc.edu/news/VCNotes/2026/February/27.html"
    publisher: "University of Mississippi Medical Center"
    publisherType: community
    reliability: R1
    publicationDate: "2026-02-27"
    accessDate: "2026-04-29"
    archived: false
  - url: "https://umc.edu/news/News_Articles/2026/03/Cyberattack.html"
    publisher: "University of Mississippi Medical Center"
    publisherType: community
    reliability: R1
    publicationDate: "2026-03-02"
    accessDate: "2026-04-29"
    archived: false
  - url: "https://apnews.com/article/cyberattack-university-mississippi-clinics-hospital-4b27a578a5e095c5a7d25c90768a5312"
    publisher: "AP News"
    publisherType: media
    reliability: R2
    publicationDate: "2026-02-20"
    accessDate: "2026-04-29"
    archived: false
  - url: "https://therecord.media/medusa-ransomware-mississippi-cyber"
    publisher: "The Record"
    publisherType: media
    reliability: R2
    publicationDate: "2026-03-17"
    accessDate: "2026-04-29"
    archived: false
  - url: "https://www.fbi.gov/file-repository/cyber-alerts/stopransomware-medusa-ransomware-031225.pdf/view"
    publisher: "Federal Bureau of Investigation"
    publisherType: government
    reliability: R1
    publicationDate: "2025-03-12"
    accessDate: "2026-04-29"
    archived: false
  - url: "https://www.microsoft.com/en-us/security/blog/2026/04/06/storm-1175-focuses-gaze-on-vulnerable-web-facing-assets-in-high-tempo-medusa-ransomware-operations/"
    publisher: "Microsoft Threat Intelligence"
    publisherType: research
    reliability: R1
    publicationDate: "2026-04-06"
    accessDate: "2026-04-29"
    archived: false
mitreMappings:
  - techniqueId: "T1486"
    techniqueName: "Data Encrypted for Impact"
    tactic: "Impact"
    notes: "UMMC and AP described the incident as a ransomware attack that disrupted the electronic health record platform and forced manual operations."
---

## Summary

On February 19, 2026, the University of Mississippi Medical Center (UMMC) disclosed a ransomware attack that disrupted its electronic health record platform, phone systems, and other connected operations. UMMC canceled clinic operations statewide and elective procedures while moving hospitals and emergency departments to paper-based downtime procedures.

Public reporting and later UMMC updates show that the disruption lasted through the end of February. Clinics resumed normal operations on March 2, 2026, after what UMMC described as a nine-day ordeal. Hospitals and emergency departments remained open during the response, and UMMC prioritized time-sensitive care such as chemotherapy as systems were restored.

## Technical Analysis

UMMC's public statements identify the event as ransomware, but they do not disclose the initial access vector, the specific malware execution path, or the full scope of affected systems beyond the operational impact. Vice Chancellor LouAnn Woodward said on February 20 that the electronic health record platform and phone systems were not operational, and that the medical center took additional systems offline to test whether they were safe to use.

A February 27 UMMC update said the organization had shut down its network and connected systems to contain the damage and had switched hospitals and emergency departments to downtime procedures. AP reported that the attack affected the electronic health record platform and forced staff to document care manually. Later UMMC reporting showed that clinicians rebuilt parts of care delivery with paper charts and offline coordination while recovery continued.

## Attack Chain

### Stage 1: Ransomware disrupted core clinical and communications systems

UMMC said the incident was a ransomware attack and that the electronic health record platform and phone systems were not operational by February 20. Public reporting also described the outage as affecting many connected systems used for day-to-day care delivery.

### Stage 2: UMMC shut down connected systems and moved to downtime procedures

According to UMMC, the medical center took systems offline to test their safety and contain the damage. Hospitals and emergency departments stayed open, but care teams shifted to paper documentation, manual orders, and other downtime procedures.

### Stage 3: Outpatient operations were curtailed while urgent care was triaged

UMMC canceled statewide clinic operations and elective procedures at the start of the incident. Time-sensitive treatments were prioritized, and UMMC later said the Cancer Center and Research Institute restarted chemotherapy on February 23 while staff continued scheduling other urgent needs during the outage.

### Stage 4: Operations were restored before a later public claim by Medusa

UMMC said clinics resumed normal operations on March 2 after nine days of disruption. On March 17, The Record reported that Medusa had claimed responsibility for the earlier attack and had threatened to leak allegedly stolen data, but UMMC did not publicly confirm that claim.

## Impact Assessment

The confirmed impact was operational. AP reported that the ransomware attack forced UMMC to close roughly three dozen clinics across Mississippi and cancel elective procedures. UMMC's own statements confirm that the organization had to rely on manual care workflows, paper documentation, and improvised communications while network systems were unavailable.

The disruption also affected time-sensitive clinical services. AP and UMMC both said cancer care required special triage during the outage, and UMMC later reported that chemotherapy services restarted on February 23 before the broader return to normal clinic operations on March 2. While Medusa later claimed to have exfiltrated data, the public sources cited here do not independently confirm the volume or type of any data stolen from UMMC. The confirmed impact remains a care-delivery disruption with unresolved questions about the scope of any data compromise.

## Attribution

UMMC publicly described the event as ransomware but did not attribute it to a specific threat actor. The Record reported that the Medusa ransomware group later claimed responsibility, demanded $800,000, and threatened to leak allegedly stolen data. UMMC did not publicly confirm the identity of the attackers or the validity of the exfiltration claims.

## Timeline

### 2026-02-19 - UMMC begins downtime operations after the attack

UMMC later identified February 19 as the day of the cyberattack. Clinics closed, hospitals and emergency departments stayed open, and staff began shifting care delivery to manual processes.

### 2026-02-20 - UMMC confirms a ransomware attack

UMMC said it had experienced a ransomware attack, that the electronic health record and phone systems were not operational, and that statewide clinics and elective procedures had been canceled while urgent care was prioritized.

### 2026-02-27 - UMMC reports progress toward restoration

UMMC said it had shut down network and connected systems to contain the damage, had continued hospital-based care through downtime procedures, and had started seeing urgent clinic patients with a goal of partial normal scheduling on the following Monday.

### 2026-03-02 - Clinics resume normal operations

UMMC said clinics resumed normal operations on March 2 after nine days of disruption. The same update described ongoing manual care work during the outage and said chemotherapy had resumed on February 23.

### 2026-03-17 - Medusa publicly claims responsibility

The Record reported that Medusa claimed responsibility for the incident and threatened to leak allegedly stolen data if a ransom was not paid. UMMC declined to comment on the threat.

## Remediation & Mitigation

UMMC's public response centered on containment and continuity of care: shutting down connected systems, keeping hospitals and emergency departments open, using downtime procedures, and prioritizing time-sensitive patients until clinics fully reopened. These steps highlight the importance of tested manual workflows and recovery plans for healthcare environments that require continuous operation.

For broader defense against Medusa activity, Microsoft said in April 2026 that organizations should harden web-facing systems, enforce MFA on approved remote-management tools, turn on tamper protection for security tooling, and use controls that help block credential theft and ransomware behavior. For healthcare operators, the UMMC incident also reinforces the need to rehearse downtime procedures for electronic health record outages and to maintain restoration paths that can support urgent care before full system normalization.

## Sources & References

- [University of Mississippi Medical Center: We Press On](https://umc.edu/news/VCNotes/2026/February/20.html) — University of Mississippi Medical Center, 2026-02-20
- [University of Mississippi Medical Center: #UMMCStrong, Always](https://umc.edu/news/VCNotes/2026/February/27.html) — University of Mississippi Medical Center, 2026-02-27
- [University of Mississippi Medical Center: This has pulled us together: UMMC prioritizes care, learning during cyberattack](https://umc.edu/news/News_Articles/2026/03/Cyberattack.html) — University of Mississippi Medical Center, 2026-03-02
- [AP News: Mississippi hospital system closes all clinics after ransomware attack](https://apnews.com/article/cyberattack-university-mississippi-clinics-hospital-4b27a578a5e095c5a7d25c90768a5312) — AP News, 2026-02-20
- [The Record: Medusa ransomware gang claims attacks on prominent Mississippi hospital, New Jersey county](https://therecord.media/medusa-ransomware-mississippi-cyber) — The Record, 2026-03-17
- [Federal Bureau of Investigation: #StopRansomware: Medusa Ransomware](https://www.fbi.gov/file-repository/cyber-alerts/stopransomware-medusa-ransomware-031225.pdf/view) — Federal Bureau of Investigation, 2025-03-12
- [Microsoft Threat Intelligence: Storm-1175 focuses gaze on vulnerable web-facing assets in high-tempo Medusa ransomware operations](https://www.microsoft.com/en-us/security/blog/2026/04/06/storm-1175-focuses-gaze-on-vulnerable-web-facing-assets-in-high-tempo-medusa-ransomware-operations/) — Microsoft Threat Intelligence, 2026-04-06
