---
name: "Mr. Raccoon"
aliases:
  - "Raccoon"
affiliation: "Criminal persona (extortion)"
motivation: "Data Theft / Extortion"
status: active
country: "Unknown"
firstSeen: "2026"
lastSeen: "2026"
targetSectors:
  - "Technology"
  - "Business Process Outsourcing (BPO)"
  - "Professional Services"
targetGeographies:
  - "Global"
tools:
  - "Extortion messaging via public channels"
  - "Reposting of exfiltrated corporate documents"
mitreMappings:
  - techniqueId: "T1657"
    techniqueName: "Financial Theft"
    tactic: "Impact"
    notes: "Public extortion of named corporate victims referencing previously-exfiltrated documents and customer-support data, demanding payment to avoid further release."
  - techniqueId: "T1213"
    techniqueName: "Data from Information Repositories"
    tactic: "Collection"
    notes: "Publicly-released material attributed to the persona includes internal corporate documents and helpdesk-adjacent data consistent with exfiltration from enterprise information repositories rather than direct endpoint compromise."
  - techniqueId: "T1589"
    techniqueName: "Gather Victim Identity Information"
    tactic: "Reconnaissance"
    notes: "Messaging tied to the persona demonstrates pre-collected victim-organisation context (named employees, department structure) used to substantiate extortion claims publicly."
attributionConfidence: A5
attributionRationale: "Public extortion persona tied to the Adobe BPO breach disclosures and adjacent 2026 victim claims. Ankura CTIX corroborates the posture; GTIG's UNC6783 reporting notes a possible but unproven overlap. Held as a persona, not merged into UNC6783, pending stronger primary evidence."
reviewStatus: "draft_ai"
generatedBy: "dangermouse-bot"
generatedDate: 2026-04-21
relatedSlugs:
  - "unc6783"
  - "adobe-mr-raccoon-breach-2026"
tags:
  - "persona"
  - "extortion"
  - "bpo"
  - "unc6783-link-unconfirmed"
  - "adobe-breach-2026"
sources:
  - url: "https://ankura.com/insights/ankura-ctix-flash-update-april-10-2026/"
    publisher: "Ankura CTIX"
    publisherType: vendor
    reliability: R1
    publicationDate: "2026-04-10"
    accessDate: "2026-04-21"
    archived: false
  - url: "https://www.securityweek.com/google-warns-of-new-campaign-targeting-bpos-to-steal-corporate-data/"
    publisher: "SecurityWeek"
    publisherType: media
    reliability: R1
    publicationDate: "2026-04-09"
    accessDate: "2026-04-21"
    archived: false
  - url: "https://www.bleepingcomputer.com/news/security/google-new-unc6783-hackers-steal-corporate-zendesk-support-tickets/"
    publisher: "BleepingComputer"
    publisherType: media
    reliability: R1
    publicationDate: "2026-04-09"
    accessDate: "2026-04-21"
    archived: false
  - url: "https://www.cisa.gov/news-events/cybersecurity-advisories/aa23-320a"
    publisher: "CISA"
    publisherType: government
    reliability: R1
    publicationDate: "2023-11-16"
    accessDate: "2026-04-21"
    archived: false
---

## Executive Summary

"Mr. Raccoon" is a criminal handle / persona that surfaced publicly in 2026 in connection with the Adobe BPO-data breach disclosures and adjacent corporate-victim extortion activity. The persona's observed operational posture is extortion-centric: public messaging against named victim organisations referencing exfiltrated corporate documents and helpdesk-adjacent data, with implicit or explicit demands tied to the prospect of further release.

Threatpedia holds Mr. Raccoon at the **persona level** rather than treating it as a distinct named threat actor. Adjacent reporting — specifically Google Threat Intelligence Group's April 2026 naming of the [UNC6783 cluster](/threat-actors/unc6783/) — has been summarised in secondary media alongside Mr. Raccoon mentions, but no primary source currently establishes identity between the two. The persona may represent a front handle for UNC6783 operators, a cooperating handle, an affiliate, or an independent extortion persona who happens to be trafficking overlapping data. Attribution confidence is **A5**: identity behind the persona is speculative.

This profile treats the persona as a provenance artefact — useful for tracking specific public claims and follow-on victim correspondence — rather than as a cluster profile in its own right.

## Notable Campaigns

### Adobe BPO breach extortion (2026)

The persona is most prominently associated with the Adobe BPO-data breach claims that surfaced in early 2026. Public posts attributed to Mr. Raccoon referenced internal corporate material and demanded payment against onward release. Threatpedia's [adobe-mr-raccoon-breach-2026](/incidents/adobe-mr-raccoon-breach-2026/) incident page is the canonical record of that event; this actor page exists to capture the persona-level provenance that complements it.

### Possible UNC6783 adjacency (2026)

SecurityWeek and BleepingComputer's coverage of GTIG's UNC6783 disclosure note that Mr. Raccoon has been linked by some observers to the same activity cluster. The link is not asserted by GTIG in the primary disclosure summarised in those reports and is not treated as confirmed here.

## Technical Capabilities

Little can be said about Mr. Raccoon's technical capability set directly:

- **Public-channel extortion.** Operational visibility is concentrated in the persona's public messaging, not in observed intrusion tradecraft. Extortion operations reference previously-exfiltrated material rather than demonstrating ongoing intrusion capability.
- **Pre-collected victim context.** Messaging tied to the persona demonstrates knowledge of named employees, departmental structure, and internal document conventions for at least one corporate victim — consistent with genuine access to exfiltrated data of non-trivial depth.
- **No attributed intrusion toolset.** No malware family, implant, exploitation capability, or infrastructure cluster has been publicly attributed to the persona itself. If Mr. Raccoon is a front for UNC6783 or an adjacent crew, the underlying intrusion capability would be that group's; see the UNC6783 profile for what is currently documented on the intrusion side.

## Attribution

Attribution confidence is **A5 (speculative)**. The persona is real in the sense that public messaging under the handle has been observed and corroborated in Ankura CTIX reporting and secondary coverage of the Adobe breach. What is not established:

- Whether Mr. Raccoon is a distinct individual or a group handle.
- Whether the persona is operated by the same people responsible for the underlying intrusion(s).
- Whether Mr. Raccoon is identical with, a front for, a cooperating handle of, or independent from [UNC6783](/threat-actors/unc6783/).

Per the TASK-2026-0192 brief and Threatpedia's attribution hygiene, the two profiles are preserved as distinct until primary evidence justifies a merge. If future disclosure establishes identity between the persona and UNC6783 (or a different underlying cluster), the correct action is a canonicalisation PR that consolidates the two — not a silent edit to either profile.

The Mr. Raccoon persona sits alongside a broader class of extortion-first handles that have surfaced around high-profile corporate data-breach disclosures since 2023. The operational pattern — pre-collected victim context, public extortion messaging, selective document release — is consistent with the extortion economy around BPO-mediated and helpdesk-mediated intrusions tracked by multiple vendors. Whether Mr. Raccoon is a durable identity or an ephemeral handle that will be superseded by the next extortion campaign's branding is itself an open question; that uncertainty is the reason this profile is held at persona level rather than named-actor level.

## MITRE ATT&CK Profile

Mapped techniques reflect the persona's observed public posture rather than a full intrusion chain:

- **T1657 — Financial Theft** (Impact): the defining observed behaviour.
- **T1213 — Data from Information Repositories** (Collection): inferred from the nature of material publicly referenced.
- **T1589 — Gather Victim Identity Information** (Reconnaissance): inferred from the depth of victim-org context visible in persona messaging.

This mapping should be extended only as primary evidence surfaces. The persona is not a substitute for the underlying intrusion actor's profile (if they are distinct) and no intrusion-side techniques are asserted here.

## Sources & References

- [Ankura CTIX: Flash Update — April 10, 2026 (Adobe BPO breach and Mr. Raccoon extortion context)](https://ankura.com/insights/ankura-ctix-flash-update-april-10-2026/) — Ankura CTIX, 2026-04-10
- [SecurityWeek: Google Warns of New Campaign Targeting BPOs to Steal Corporate Data](https://www.securityweek.com/google-warns-of-new-campaign-targeting-bpos-to-steal-corporate-data/) — SecurityWeek, 2026-04-09
- [BleepingComputer: Google — New UNC6783 hackers steal corporate Zendesk support tickets](https://www.bleepingcomputer.com/news/security/google-new-unc6783-hackers-steal-corporate-zendesk-support-tickets/) — BleepingComputer, 2026-04-09
- [CISA: Joint Advisory AA23-320A — Scattered Spider helpdesk social engineering tradecraft (corroborating TTP source for the BPO-extortion ecosystem; not Mr. Raccoon-specific)](https://www.cisa.gov/news-events/cybersecurity-advisories/aa23-320a) — CISA, 2023-11-16
