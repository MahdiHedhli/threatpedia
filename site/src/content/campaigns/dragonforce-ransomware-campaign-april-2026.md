---
campaignId: "TP-CAMP-2026-0002"
title: "DragonForce Multi-Sector Extortion Campaign - April 2026"
startDate: 2026-04-01
endDate: 2026-04-07
ongoing: false
attackType: "Ransomware / Double Extortion"
severity: high
sector: "Multi-Sector"
geography: "Global"
threatActor: "DragonForce"
attributionConfidence: A4
reviewStatus: "under_review"
confidenceGrade: C
generatedBy: "dangermouse-bot"
generatedDate: 2026-04-18
cves: []
relatedIncidents: []
tags:
  - "dragonforce"
  - "ransomware"
  - "double-extortion"
  - "raas"
  - "multi-sector"
sources:
  - url: "https://www.cisa.gov/sites/default/files/2023-10/StopRansomware-Guide-508C-v3_1.pdf"
    publisher: "CISA"
    publisherType: government
    reliability: R1
    publicationDate: "2023-10-19"
    accessDate: "2026-04-18"
    archived: false
  - url: "https://www.darktrace.com/blog/tracking-a-dragon-investigating-a-dragonforce-affiliated-ransomware-attack-with-darktrace"
    publisher: "Darktrace"
    publisherType: vendor
    reliability: R2
    publicationDate: "2025-11-05"
    accessDate: "2026-05-04"
    archived: false
  - url: "https://www.ransomware.live/group/dragonforce"
    publisher: "Ransomware.live"
    publisherType: research
    reliability: R2
    publicationDate: "2026-05-04"
    accessDate: "2026-05-04"
    archived: false
  - url: "https://www.dexpose.io/dragonforce-strikes-at-packaging-in-latest-ransomware-attack/"
    publisher: "DeXpose"
    publisherType: research
    reliability: R2
    publicationDate: "2026-04-02"
    accessDate: "2026-05-04"
    archived: false
  - url: "https://www.hendryadrian.com/belgian-listed-fountain-hit-by-ransomware-dragonforce-claims-attack-and-data-exfiltration/"
    publisher: "Hendry Adrian"
    publisherType: research
    reliability: R2
    publicationDate: "2026-04-07"
    accessDate: "2026-05-04"
    archived: false
mitreMappings:
  - techniqueId: "T1486"
    techniqueName: "Data Encrypted for Impact"
    tactic: "Impact"
    notes: "DragonForce affiliates deployed ransomware payloads as the final coercive step of the extortion workflow."
  - techniqueId: "T1567.002"
    techniqueName: "Exfiltration Over Web Service: Exfiltration to Cloud Storage"
    tactic: "Exfiltration"
    notes: "Public reporting on the April 2026 cluster described repeated pre-encryption data theft and leak-site pressure."
  - techniqueId: "T1078"
    techniqueName: "Valid Accounts"
    tactic: "Initial Access"
    notes: "Vendor reporting on DragonForce intrusions repeatedly cites compromised credentials and affiliate-sourced access."
  - techniqueId: "T1490"
    techniqueName: "Inhibit System Recovery"
    tactic: "Impact"
    notes: "Ransomware playbooks associated with DragonForce include disabling recovery paths and deleting shadow copies."
---

## Executive Summary

This entry tracks a DragonForce-branded extortion cluster visible in public reporting across early April 2026, when multiple victim claims and secondary reporting tied the same ransomware brand to organizations in different sectors. The coverage is campaign-shaped rather than incident-shaped: the public record is stronger on the repeated use of the DragonForce extortion brand and leak-site workflow than on complete victim-by-victim forensic disclosure.

The strongest public evidence supports DragonForce as the extortion brand behind the cluster, but not every claimed victim detail or leak volume can be independently verified from public reporting alone. For that reason, this page treats the April 2026 wave as a campaign-level record of a multi-victim extortion push and leaves room for victim-specific incident articles to be created separately where evidence is stronger.

## Technical Analysis

DragonForce operates as a ransomware-as-a-service ecosystem. Public reporting from late 2025 into 2026 describes affiliates using common intrusion pathways such as purchased credentials, phishing, exposed remote administration surfaces, and vulnerable edge systems before shifting into credential theft, lateral movement, and data staging. Once inside a victim environment, the operators or affiliates move toward double extortion: steal data first, then encrypt systems and threaten publication on the leak site.

The April 2026 cluster fits that model, but the source base is uneven. Leak-site tracking and victim-specific reporting show DragonForce claims surfacing against multiple organizations in rapid succession, including AT Packaging in the United States and Fountain in Belgium. Darktrace's November 2025 case study helps characterize DragonForce-affiliate tradecraft, but it does not independently verify each April 2026 victim claim. The public record is therefore stronger on the extortion workflow and branding consistency than on low-level per-victim forensic artifacts, which is another reason this belongs in the campaign collection rather than as a single canonical incident.

## Attack Chain

### Stage 1: Access Acquisition

Affiliates obtain access through a mix of compromised credentials, phishing, or exploitation of exposed systems.

### Stage 2: Internal Reconnaissance

The operators map identity infrastructure, business systems, and data stores to identify high-leverage targets.

### Stage 3: Data Theft

Sensitive business and personal information is staged and exfiltrated before encryption so extortion pressure survives even if backups are restored.

### Stage 4: Encryption and Coercion

DragonForce payloads are deployed against reachable systems, followed by ransom demands and leak-site publication threats.

## MITRE ATT&CK Mapping

### Impact

T1486 - Data Encrypted for Impact: DragonForce intrusions culminate in broad ransomware deployment against business systems.

### Exfiltration

T1567.002 - Exfiltration Over Web Service: Exfiltration to Cloud Storage: Public reporting on the April cluster repeatedly described pre-encryption data theft and leak pressure.

### Initial Access

T1078 - Valid Accounts: Access-broker credentials and other valid-account pathways remain common in DragonForce reporting.

### Recovery Inhibition

T1490 - Inhibit System Recovery: Ransomware tradecraft associated with DragonForce includes degrading recovery options before extortion.

## Timeline

### 2026-04-01 to 2026-04-07 - Multi-Victim Claim Wave

DragonForce-linked victim disclosures and secondary reporting surface across a compressed window in early April 2026, indicating a campaign-level extortion burst rather than an isolated single victim event.

### 2026-04-02 - AT Packaging Reporting Surfaces

Open-source reporting on AT Packaging helps anchor the broader cluster in a documented victim disclosure window tied to DragonForce-branded extortion claims.

### 2026-04-07 - Fountain Reporting Surfaces

Secondary reporting on Fountain adds another victim-specific disclosure inside the same early-April period, reinforcing that the campaign record is based on multiple public claims rather than a single company event.

## Historical Context

The campaign's significance lies in breadth and tempo. Manufacturing, packaging, and other sectors appeared in the same public-claim window, suggesting either a highly active affiliate ecosystem or a coordinated announcement cycle under a single extortion brand. Even where victim claims are not independently validated in full, the operational impact for listed organizations can include system outages, breach notification costs, regulatory exposure, and follow-on criminal use of stolen data.

This is also a reminder that extortion clusters should not be flattened into one victim story. A ransomware program can run many parallel intrusions under a single brand and leak-site narrative. Tracking that activity as a campaign helps preserve the distinction between the operator ecosystem and the downstream victim incidents.

By 2025-2026, DragonForce had matured from earlier branding associated with hacktivist or loosely organized activity into a more recognizable ransomware and extortion program. Reporting consistently describes a financially motivated operation with affiliate characteristics, leak-site discipline, and reuse of common post-compromise tooling.

The April 2026 multi-victim burst sits within that broader shift. It is best read as an example of DragonForce operating as a recurring extortion brand rather than as proof that a single tightly controlled core team personally executed every intrusion in the cluster.

## Remediation & Mitigation

Organizations facing DragonForce-style extortion risk should harden the parts of the environment that make affiliate operations cheap: exposed remote access, weak credential hygiene, under-monitored privileged accounts, and flat internal networks. Immutable backups, rapid credential rotation, and rehearsed ransomware response playbooks remain critical, but they are not enough if defenders do not also account for pre-encryption data theft.

Detection should focus on the pre-impact stages as much as the encryption event itself: anomalous remote access, use of newly privileged accounts, unexpected bulk data staging, and sudden attempts to disable recovery controls. The extortion economy rewards actors who can steal data quietly before detonating the loud part of the attack.

## Sources & References

1. [CISA: #StopRansomware Guide](https://www.cisa.gov/sites/default/files/2023-10/StopRansomware-Guide-508C-v3_1.pdf) - CISA, 2023-10-19
2. [Darktrace: Tracking a Dragon - Investigating a DragonForce-Affiliated Ransomware Attack](https://www.darktrace.com/blog/tracking-a-dragon-investigating-a-dragonforce-affiliated-ransomware-attack-with-darktrace) - Darktrace, 2025-11-05
3. [Ransomware.live: DragonForce Group Profile](https://www.ransomware.live/group/dragonforce) - Ransomware.live, accessed 2026-05-04
4. [DeXpose: DragonForce Strikes at Packaging in Latest Ransomware Attack](https://www.dexpose.io/dragonforce-strikes-at-packaging-in-latest-ransomware-attack/) - DeXpose, 2026-04-02
5. [Hendry Adrian: Belgian-listed Fountain Hit by Ransomware; Dragonforce Claims Attack and Data Exfiltration](https://www.hendryadrian.com/belgian-listed-fountain-hit-by-ransomware-dragonforce-claims-attack-and-data-exfiltration/) - Hendry Adrian, 2026-04-07
