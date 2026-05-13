---
name: "Transparent Tribe / APT36"
aliases:
  - "APT36"
  - "COPPER FIELDSTONE"
  - "Mythic Leopard"
  - "ProjectM"
affiliation: "Pakistan (suspected)"
motivation: "Espionage"
status: active
country: "Pakistan"
firstSeen: "2013"
targetSectors:
  - "Government"
  - "Defense"
  - "Diplomatic"
  - "Education"
  - "Research"
targetGeographies:
  - "India"
  - "Afghanistan"
  - "South Asia"
tools:
  - "Crimson"
  - "ObliqueRAT"
  - "DarkComet"
  - "njRAT"
mitreMappings:
  - techniqueId: "T1566.001"
    techniqueName: "Spearphishing Attachment"
    tactic: "Initial Access"
    attackVersion: "v19"
    confidence: confirmed
    evidence: "MITRE ATT&CK documents Transparent Tribe using spearphishing attachments as a primary initial access technique. Cisco Talos documented the group delivering malicious documents to students and educational institution targets in the 2022 Indian subcontinent campaign."
  - techniqueId: "T1059.005"
    techniqueName: "Visual Basic"
    tactic: "Execution"
    attackVersion: "v19"
    confidence: confirmed
    evidence: "MITRE ATT&CK documents Transparent Tribe using Visual Basic as an execution technique, consistent with macro-enabled lure document delivery observed across the group's spearphishing operations."
  - techniqueId: "T1583.001"
    techniqueName: "Domains"
    tactic: "Resource Development"
    attackVersion: "v19"
    confidence: confirmed
    evidence: "MITRE ATT&CK documents Transparent Tribe registering domains to support attack infrastructure. Cisco Talos documented the group registering domains designed to appear relevant to student targets in the 2022 education-sector campaign, mapped to MITRE campaign C0011."
  - techniqueId: "T1189"
    techniqueName: "Drive-by Compromise"
    tactic: "Initial Access"
    attackVersion: "v19"
    confidence: confirmed
    evidence: "MITRE ATT&CK documents Transparent Tribe using drive-by compromise as an initial access technique, supported by the group's documented staging of drive-by target infrastructure (T1608.004)."
  - techniqueId: "T1204.002"
    techniqueName: "Malicious File"
    tactic: "Execution"
    attackVersion: "v19"
    confidence: confirmed
    evidence: "MITRE ATT&CK documents Transparent Tribe using malicious files as an execution technique. Cisco Talos documented malicious file delivery in the 2022 education campaign and in the group's operations targeting Indian government officials using new bespoke malware."
  - techniqueId: "T1608.001"
    techniqueName: "Upload Malware"
    tactic: "Resource Development"
    attackVersion: "v19"
    confidence: confirmed
    evidence: "MITRE ATT&CK documents Transparent Tribe uploading malware to attacker-controlled staging infrastructure. MITRE campaign C0011 maps Crimson RAT installation to upload malware activity in the education-targeting campaign reported by Cisco Talos in 2022."
attributionConfidence: A4
attributionRationale: "MITRE ATT&CK (G0134) assesses Transparent Tribe as a suspected Pakistan-based threat group active since at least 2013. The Pakistan-linked assessment remains unconfirmed in the cited sources and rests on vendor and research reporting about targeting and tradecraft. No cited government source confirms state sponsorship."
reviewStatus: "draft_ai"
generatedBy: "dangermouse-bot"
generatedDate: 2026-05-13
tags:
  - "nation-state"
  - "pakistan"
  - "espionage"
  - "apt36"
  - "transparent-tribe"
  - "south-asia"
  - "india"
  - "afghanistan"
  - "government"
  - "education"
sources:
  - url: "https://attack.mitre.org/groups/G0134/"
    publisher: "MITRE ATT&CK"
    publisherType: research
    reliability: R1
    publicationDate: "2024-04-10"
    accessDate: "2026-05-13"
    archived: false
  - url: "https://blog.talosintelligence.com/transparent-tribe-targets-education/"
    publisher: "Cisco Talos"
    publisherType: vendor
    reliability: R1
    publicationDate: "2022-07-13"
    accessDate: "2026-05-13"
    archived: false
  - url: "https://blog.talosintelligence.com/transparent-tribe-new-campaign/"
    publisher: "Cisco Talos"
    publisherType: vendor
    reliability: R1
    publicationDate: "2022-03-29"
    accessDate: "2026-05-13"
    archived: false
  - url: "https://www.cisa.gov/eviction-strategies-tool/info-attack/T1583.001"
    publisher: "CISA"
    publisherType: government
    reliability: R1
    publicationDate: "2026-05-13"
    accessDate: "2026-05-13"
    archived: false
---

## Executive Summary

Transparent Tribe, also tracked as APT36, is a suspected Pakistan-based cyber-espionage group that MITRE ATT&CK (G0134) places as active since at least 2013. The group primarily targets diplomatic, defense, and research organizations in India and Afghanistan, with documented expansion into educational targets in the Indian subcontinent. MITRE ATT&CK also tracks the group under the aliases COPPER FIELDSTONE, Mythic Leopard, and ProjectM.

The group's tradecraft centers on spearphishing operations delivering malicious documents and links to establish footholds on Windows systems. Crimson RAT is the most prominently documented implant associated with Transparent Tribe activity. Cisco Talos has reported multiple campaigns attributing new malware development and shifting target sets to the group, including a 2022 campaign that deviated from the group's typical government and military focus to target students and educational institutions.

## Notable Campaigns

### 2022 — Education Sector Targeting in the Indian Subcontinent

Cisco Talos researchers Asheer Malhotra and Nick Biasini published findings in July 2022 documenting a Transparent Tribe campaign directed at educational institutions and students in the Indian subcontinent. The campaign represented a notable departure from the adversary's typical focus on government and defense entities. Attackers used malicious documents and registered domains designed to appear relevant to student audiences, ultimately delivering Crimson RAT to compromised hosts. MITRE campaign C0011 maps this activity to registered domains, malicious links, malicious file delivery, upload malware staging, and Crimson installation.

### Ongoing — Indian Government Officials Targeting

Cisco Talos has reported a Transparent Tribe campaign deploying new bespoke Windows malware against Indian government officials, demonstrating continued investment in custom tooling beyond the group's established Crimson RAT implant. This campaign is consistent with the group's long-standing focus on Indian government and defense entities documented by MITRE ATT&CK.

## Technical Capabilities

Transparent Tribe conducts intrusion operations primarily through spearphishing, using macro-enabled Office documents and malicious links as delivery mechanisms. The group registers attacker-controlled domains to host lure pages and stage payloads, and has demonstrated the ability to tailor lure content to target audiences, including using student-relevant themes when targeting educational institutions.

**Crimson** is the most frequently documented remote access tool associated with Transparent Tribe. It provides standard RAT capabilities and is delivered via spearphishing attachments and malicious links. MITRE ATT&CK and MITRE campaign C0011 both reference Crimson installations as an outcome of the group's delivery chain.

**ObliqueRAT** is an additional Windows implant documented by MITRE in association with Transparent Tribe operations. The group also uses commodity tools including **DarkComet** and **njRAT**, indicating a mixed toolkit of custom and off-the-shelf malware.

Cisco Talos reporting on a subsequent Indian government officials campaign documents the group deploying new bespoke malware, indicating ongoing tooling development alongside continued use of established implants. Visual Basic execution via macro-enabled documents is a documented delivery technique, and the group uses drive-by compromise as an alternative initial access vector alongside phishing operations.

## Attribution

MITRE ATT&CK classifies Transparent Tribe as group G0134 and describes it as a suspected Pakistan-based threat group. Targeting has focused on diplomatic, defense, and research organizations in India and Afghanistan, consistent with collection priorities associated with Pakistani state intelligence interests. The group has been observed operating since at least 2013.

The suspected Pakistan-based assessment is based on targeting alignment and technical indicators across vendor reporting rather than a formal government attribution. MITRE's use of "suspected" reflects the absence of definitive confirming evidence such as a government indictment or official advisory explicitly linking the group to the Pakistani state. No such formal government attribution is present in the sources used for this profile.

Alias diversity across tracking designations (APT36, Transparent Tribe, COPPER FIELDSTONE, Mythic Leopard, ProjectM) reflects independent vendor discovery of overlapping intrusion activity sets. Different organizations may scope this cluster differently; claims specific to one vendor's reporting should not be generalized across all aliases unless the source explicitly supports the connection.

## MITRE ATT&CK Profile

T1583.001 - Domains: Transparent Tribe registers attacker-controlled domains to support phishing infrastructure and payload staging. Cisco Talos documented domain registration with student-relevant naming conventions for the 2022 education-sector campaign, mapped to MITRE campaign C0011.

T1566.001 - Spearphishing Attachment: Spearphishing via malicious document attachments is the group's primary documented initial access vector. MITRE ATT&CK and Cisco Talos both document malicious document delivery as a core Transparent Tribe technique across government, defense, and education targeting.

T1566.002 - Spearphishing Link: MITRE ATT&CK documents Transparent Tribe using spearphishing links as an initial access technique alongside attachment-based delivery. MITRE campaign C0011 maps malicious link delivery to the education campaign documented by Cisco Talos.

T1189 - Drive-by Compromise: MITRE ATT&CK documents Transparent Tribe using drive-by compromise as an initial access technique, supported by the group's documented infrastructure preparation activity including drive-by target staging (T1608.004).

T1059.005 - Visual Basic: MITRE ATT&CK documents Visual Basic as an execution technique for Transparent Tribe, consistent with macro-enabled document lures delivering implants including Crimson RAT.

T1204.002 - Malicious File: MITRE ATT&CK documents Transparent Tribe using malicious files for execution. Cisco Talos documented malicious file delivery in the 2022 education campaign and in subsequent operations targeting Indian government officials with new bespoke malware.

T1608.001 - Upload Malware: MITRE ATT&CK documents Transparent Tribe uploading malware to attacker-controlled infrastructure to prepare delivery chains. MITRE campaign C0011 maps this technique to Crimson RAT staging in the education campaign reported by Cisco Talos.

## Sources & References

- [MITRE ATT&CK: Transparent Tribe (G0134)](https://attack.mitre.org/groups/G0134/) — MITRE ATT&CK, 2024-04-10
- [Cisco Talos: Transparent Tribe Targets Education Sector Amid Continued Threat Actor Evolution](https://blog.talosintelligence.com/transparent-tribe-targets-education/) — Cisco Talos, 2022-07-13
- [Cisco Talos: Transparent Tribe New Campaign Using New Bespoke Malware](https://blog.talosintelligence.com/transparent-tribe-new-campaign/) — Cisco Talos, 2022-03-29
- [CISA: T1583.001 Domains](https://www.cisa.gov/eviction-strategies-tool/info-attack/T1583.001) — CISA, 2026-05-13
