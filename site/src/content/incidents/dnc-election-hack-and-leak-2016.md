---
eventId: TP-2016-0004
title: "2016 DNC and U.S. Election Hack-and-Leak Operation"
date: 2016-03-01
attackType: "State-Sponsored Hack-and-Leak"
severity: high
sector: "Government & Political Organizations"
geography: "United States"
threatActor: "APT28"
attributionConfidence: A1
reviewStatus: draft_ai
confidenceGrade: A
generatedBy: kernel-k
generatedDate: 2026-05-17
cves: []
relatedSlugs: []
tags:
  - apt28
  - fancy-bear
  - gru
  - russia
  - dnc
  - dccc
  - election-interference
  - spearphishing
  - x-agent
  - x-tunnel
  - dcleaks
  - guccifer-2
  - hack-and-leak
  - unit-26165
  - unit-74455
sources:
  - url: https://www.justice.gov/archives/opa/pr/grand-jury-indicts-12-russian-intelligence-officers-hacking-offenses-related-2016-election
    publisher: "U.S. Department of Justice"
    publisherType: government
    reliability: R1
    publicationDate: "2018-07-13"
    accessDate: "2026-05-17"
    archived: false
  - url: https://www.justice.gov/archives/sco/file/1373816/dl
    publisher: "U.S. Department of Justice"
    publisherType: government
    reliability: R1
    publicationDate: "2019-04-18"
    accessDate: "2026-05-17"
    archived: false
  - url: https://www.cisa.gov/news-events/alerts/2016/12/29/grizzly-steppe-russian-malicious-cyber-activity
    publisher: "CISA"
    publisherType: government
    reliability: R1
    publicationDate: "2016-12-29"
    accessDate: "2026-05-17"
    archived: false
  - url: https://attack.mitre.org/groups/G0007/
    publisher: "MITRE ATT&CK"
    publisherType: research
    reliability: R1
    publicationDate: "2026-05-17"
    accessDate: "2026-05-17"
    archived: false
  - url: https://www.intelligence.senate.gov/wp-content/uploads/2024/08/sites-default-files-documents-report-volume5.pdf
    publisher: "U.S. Senate Select Committee on Intelligence"
    publisherType: government
    reliability: R1
    publicationDate: "2020-08-18"
    accessDate: "2026-05-17"
    archived: false
  - url: https://www.crowdstrike.com/en-us/blog/bears-midst-intrusion-democratic-national-committee/
    publisher: "CrowdStrike"
    publisherType: vendor
    reliability: R1
    publicationDate: "2016-06-15"
    accessDate: "2026-05-17"
    archived: false
mitreMappings:
  - techniqueId: T1566.002
    techniqueName: "Spearphishing Link"
    tactic: "Initial Access"
    attackVersion: v19.0
    confidence: confirmed
    evidence: "The DOJ July 2018 indictment charged GRU Unit 26165 officers with sending spearphishing emails containing malicious links to DCCC, DNC, and Clinton campaign personnel. A March 2016 spearphishing email with a link resulted in the compromise of the Clinton campaign chairman's Google account credentials, per the indictment and the Mueller report."
  - techniqueId: T1056.001
    techniqueName: "Keylogging"
    tactic: "Collection"
    attackVersion: v19.0
    confidence: confirmed
    evidence: "The DOJ indictment states that GRU officers installed X-Agent on DCCC and DNC hosts, and that the malware logged keystrokes and captured data from infected computers. CrowdStrike's DNC intrusion report confirmed FANCY BEAR deployed X-Agent, which includes keylogging functionality, across multiple DNC workstations."
  - techniqueId: T1048
    techniqueName: "Exfiltration Over Alternative Protocol"
    tactic: "Exfiltration"
    attackVersion: v19.0
    confidence: confirmed
    evidence: "The DOJ indictment describes GRU's use of X-Tunnel, a dedicated malware tool that established a separate encrypted channel between compromised DCCC and DNC hosts and GRU-controlled infrastructure, used specifically to transmit stolen data out of victim networks."
---

## Summary

Between approximately March and June 2016, officers of the Russian Federation's Main Intelligence Directorate (GRU) compromised the computer networks of the Democratic Congressional Campaign Committee (DCCC), the Democratic National Committee (DNC), and the 2016 Clinton presidential campaign. GRU Unit 26165 conducted the intrusions using spearphishing emails, credential theft, and purpose-built malware. GRU Unit 74455 subsequently coordinated the public release of stolen materials through the DCLeaks website, the Guccifer 2.0 online persona, and WikiLeaks. The operation exposed internal emails, documents, and communications belonging to Democratic Party organizations and campaign personnel.

A federal grand jury indictment unsealed by the U.S. Department of Justice in July 2018 charged twelve named GRU officers with conspiracy to commit computer intrusion, aggravated identity theft, and related offenses in connection with this operation. The Special Counsel's Report, released publicly in April 2019, provides extensive technical and operational documentation of the intrusions and the subsequent staged-release campaign.

Public sources including the Senate Intelligence Committee's Volume 5 report also describe a separate, earlier presence on the DNC network by a different Russian intelligence element. That prior access and the GRU hack-and-leak operation are treated as distinct activities in the public record. This incident does not encompass compromise of vote-counting systems, election administration infrastructure, or ballot tallying processes, which no public source attributes to this operation.

## Technical Analysis

The intrusion campaign used spearphishing as the primary initial access method. GRU Unit 26165 officers sent targeted emails to DCCC employees, DNC employees, and Clinton campaign staff. Messages were crafted to resemble legitimate security alerts or other plausible pretexts and contained links directing recipients to attacker-controlled infrastructure that harvested Google account credentials or delivered malware.

Once access was established, GRU deployed two primary malware tools documented in the DOJ indictment and confirmed by CrowdStrike's DNC intrusion analysis. The first, X-Agent, provided persistent access with keylogging capability and enabled file collection from infected hosts. The second, X-Tunnel, established a dedicated encrypted communications channel between infected hosts and GRU-controlled servers that was used specifically to route exfiltrated data out of victim networks, separate from the standard X-Agent command-and-control channel.

CrowdStrike's analysis of the DNC intrusion, published in June 2016, attributed intrusion activity to two separate adversary groups operating concurrently on the DNC network. CrowdStrike designated the second group FANCY BEAR and attributed it to GRU based on tooling, infrastructure, and operational signatures. The FANCY BEAR activity was consistent with the GRU Unit 26165 operation documented in the DOJ indictment.

The DOJ indictment describes GRU officers staging stolen files on GRU-controlled computers in the United States before transferring them to other infrastructure for release. Cryptocurrency was used to purchase server infrastructure and domain registrations in an effort to obscure the operational finance trail, per the indictment.

The public record does not document exploitation of unpatched software vulnerabilities as a primary initial access method in this operation. Credential theft via phishing was the documented entry path.

## Attack Chain

### Stage 1: Spearphishing and Credential Harvest

GRU Unit 26165 officers sent targeted spearphishing emails to DCCC, DNC, and Clinton campaign employees. A March 2016 spearphishing email sent to the Clinton campaign chairman included a link to an attacker-controlled page that captured his Google account credentials, resulting in access to approximately fifty thousand emails from that account, per the DOJ indictment and Mueller report.

### Stage 2: Network Intrusion and Malware Deployment

Using harvested credentials and additional access methods, GRU officers established footholds on DCCC and DNC networks. X-Agent was installed on multiple hosts, providing persistent access with keylogging and file collection capability across compromised workstations.

### Stage 3: Internal Reconnaissance and Lateral Movement

X-Agent's keylogging functionality captured credentials of additional DCCC and DNC users. Officers used stolen credentials to access further systems, retrieve communications, and move laterally within the networks, per the DOJ indictment.

### Stage 4: Data Collection and Staging

GRU officers identified and collected targeted data including emails, documents, and opposition research files. The DOJ indictment describes staged files being assembled on GRU-controlled servers located in the United States prior to further transfer and release.

### Stage 5: Exfiltration via X-Tunnel

X-Tunnel was used to establish a dedicated encrypted channel between compromised DCCC and DNC hosts and GRU-controlled infrastructure. This channel was used to transmit collected files out of victim networks, per the DOJ indictment.

### Stage 6: Persona Creation and Public Release

GRU Unit 74455 officers created the DCLeaks website and the Guccifer 2.0 online persona to serve as public-facing release channels. Stolen materials were also provided to WikiLeaks. WikiLeaks published DNC emails in July 2016 and began publishing emails from the Clinton campaign chairman's account in October 2016, per the Mueller report. The Guccifer 2.0 persona directly released selected documents while publicly claiming to be an independent Romanian hacker, as documented in the Mueller report.

## Impact Assessment

The primary documented impact was the public disclosure of internal emails and documents belonging to the DNC, DCCC, and Clinton campaign. The DOJ indictment and Mueller report describe the release of approximately fifty thousand emails from the Clinton campaign chairman's account, along with DNC research files, internal strategy documents, and DCCC materials. The SSCI Volume 5 report assessed that the public release of these materials generated significant media coverage and created operational exposure for the affected organizations during the 2016 campaign period.

The intrusions did not compromise vote-counting systems, election administration infrastructure, or ballot tallying processes. No public source attributes vote-count alteration or election-result manipulation to this operation. The CISA GRIZZLY STEPPE alert described Russian cyber activity affecting political and campaign organizations and did not report compromise of election administration systems.

Financial damage figures for the affected organizations have not been publicly quantified in the available sources. The documented impact is the involuntary public disclosure of internal organizational communications and the reputational and operational consequences that followed.

## Attribution

Attribution to the Russian GRU rests on multiple independent government and private sources with strong convergent evidence.

The U.S. Department of Justice July 2018 indictment named twelve GRU officers assigned to Unit 26165 and Unit 74455, specifying individual roles in the intrusion and release phases of the operation. The indictment identified specific malware (X-Agent, X-Tunnel), GRU-controlled infrastructure, and methods tied to named defendants.

The Special Counsel's Report, released April 2019, provides detailed operational documentation of GRU Unit 26165's intrusion campaign and GRU Unit 74455's public release campaign, including analysis of GRU infrastructure and internal operational data developed during the investigation.

The Senate Intelligence Committee's Volume 5 report, released August 2020, assessed Russian interference in the 2016 election and confirmed the GRU attribution for the hack-and-leak component.

CrowdStrike's June 2016 DNC intrusion report attributed the FANCY BEAR presence at the DNC to GRU based on the use of X-Agent and X-Tunnel, infrastructure patterns, and operational signatures consistent with prior GRU-attributed activity. CrowdStrike also identified a separate adversary group, COZY BEAR, operating concurrently on the DNC network. CrowdStrike attributed COZY BEAR to a different Russian intelligence service. The COZY BEAR presence and the GRU hack-and-leak operation are treated as distinct activities in the public record.

The CISA GRIZZLY STEPPE joint alert, published December 29, 2016, attributed the broader Russian malicious cyber activity affecting the 2016 election cycle to Russian civilian and military intelligence services.

MITRE ATT&CK tracks APT28 (G0007) as a GRU-linked threat group and documents the use of X-Agent, X-Tunnel, and spearphishing techniques consistent with those described in the DOJ indictment, Mueller report, and CrowdStrike analysis.

## Timeline

### March 2016 — GRU Begins Spearphishing Campaign

GRU Unit 26165 officers begin sending spearphishing emails targeting Clinton campaign personnel, DCCC employees, and DNC employees, according to the DOJ indictment and Mueller report.

### 2016-03-19 — Clinton Campaign Chairman's Credentials Compromised

A GRU spearphishing email results in the compromise of the Clinton campaign chairman's Google account credentials, enabling access to approximately fifty thousand of his emails, per the DOJ indictment.

### April 2016 — GRU Penetrates DCCC Network

GRU Unit 26165 establishes access to the DCCC network and begins deploying X-Agent on multiple DCCC computers, per the DOJ indictment.

### May 2016 — GRU Extends Access to DNC Network

GRU officers use access gained through the DCCC to reach the DNC network and install X-Agent on DNC hosts, per the DOJ indictment.

### 2016-06-15 — Guccifer 2.0 Persona Emerges

A persona using the name Guccifer 2.0 publishes a post claiming credit for the DNC breach while presenting as an independent Romanian hacker, beginning a sustained campaign of releasing DNC and DCCC documents, per the Mueller report.

### 2016-06-15 — CrowdStrike Publishes DNC Intrusion Report

CrowdStrike publishes its analysis attributing the FANCY BEAR component of the DNC intrusion to GRU and documenting X-Agent and X-Tunnel use on DNC hosts.

### 2016-07-22 — WikiLeaks Releases DNC Emails

WikiLeaks publishes DNC emails obtained from GRU, days before the opening of the Democratic National Convention, per the Mueller report.

### 2016-10-07 — WikiLeaks Begins Publishing Podesta Emails

WikiLeaks begins a sustained daily release of emails obtained from the Clinton campaign chairman's account, continuing through November 2016, per the Mueller report.

### 2016-12-29 — CISA GRIZZLY STEPPE Alert Published

The Department of Homeland Security and FBI publish the GRIZZLY STEPPE joint analysis report attributing cyber activity affecting the 2016 election cycle to Russian intelligence services.

### 2018-07-13 — DOJ Indicts Twelve GRU Officers

A federal grand jury indicts twelve named GRU officers assigned to Units 26165 and 74455 for their roles in the intrusion and public-release campaign.

### 2019-04-18 — Mueller Report Released Publicly

The Special Counsel's Report is released publicly. Volume 1 provides extensive technical and operational documentation of the GRU intrusion and staged-release campaign.

### 2020-08-18 — SSCI Volume 5 Released

The Senate Intelligence Committee releases Volume 5 of its report on Russian active measures campaigns, including assessment of the GRU hack-and-leak operation and related intelligence activities.

## Remediation & Mitigation

The intrusion relied primarily on spearphishing and credential harvest as the initial access vectors. Phishing-resistant multi-factor authentication — such as hardware security keys implementing the FIDO2/WebAuthn standard — substantially reduces exposure to credential-harvesting spearphishing links. Campaign and party organizations handling sensitive communications should enforce hardware MFA on all email and cloud accounts used by senior personnel and those handling sensitive internal communications.

Email gateway controls capable of detecting and blocking attacker-crafted credential-harvest links, combined with regular phishing recognition training, reduce the probability of initial compromise. Organizations should treat account credential compromise as a high-severity event requiring immediate response including session revocation, credential rotation, and forensic review of account access logs.

Network segmentation and endpoint visibility limit lateral movement after initial access. Detection of tools consistent with X-Agent and X-Tunnel within a network requires endpoint detection capability and network traffic analysis. The CISA GRIZZLY STEPPE alert published indicators of compromise associated with GRU-linked tooling relevant to this and related operations.

Data access monitoring on internal email systems, document repositories, and research stores provides an additional detection layer for the collection and staging phases. Organizations with elevated threat profiles, including political campaigns and party infrastructure, should ensure logging pipelines retain sufficient telemetry to support forensic investigation in the event of an intrusion.

## Sources & References

- [U.S. Department of Justice: Grand Jury Indicts 12 Russian Intelligence Officers for Hacking Offenses Related to the 2016 Election](https://www.justice.gov/archives/opa/pr/grand-jury-indicts-12-russian-intelligence-officers-hacking-offenses-related-2016-election) — U.S. Department of Justice, 2018-07-13
- [U.S. Department of Justice: Report on the Investigation into Russian Interference in the 2016 Presidential Election (Mueller Report)](https://www.justice.gov/archives/sco/file/1373816/dl) — U.S. Department of Justice, 2019-04-18
- [CISA: GRIZZLY STEPPE – Russian Malicious Cyber Activity](https://www.cisa.gov/news-events/alerts/2016/12/29/grizzly-steppe-russian-malicious-cyber-activity) — CISA, 2016-12-29
- [MITRE ATT&CK: APT28 (G0007)](https://attack.mitre.org/groups/G0007/) — MITRE ATT&CK, 2026-05-17
- [U.S. Senate Select Committee on Intelligence: Report on Russian Active Measures Campaigns and Interference in the 2016 U.S. Election, Volume 5](https://www.intelligence.senate.gov/wp-content/uploads/2024/08/sites-default-files-documents-report-volume5.pdf) — U.S. Senate Select Committee on Intelligence, 2020-08-18
- [CrowdStrike: Bears in the Midst: Intrusion into the Democratic National Committee](https://www.crowdstrike.com/en-us/blog/bears-midst-intrusion-democratic-national-committee/) — CrowdStrike, 2016-06-15
