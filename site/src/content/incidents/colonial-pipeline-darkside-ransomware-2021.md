---
eventId: TP-2021-0001
title: "Colonial Pipeline Ransomware Attack by DarkSide"
date: 2021-05-07
attackType: Ransomware
severity: critical
sector: Energy & Utilities
geography: United States
threatActor: DarkSide
attributionConfidence: A1
reviewStatus: "certified"
confidenceGrade: A
generatedBy: ai_ingestion
generatedDate: 2026-04-14
cves: []
relatedSlugs: []
tags:
  - ransomware
  - darkside
  - critical-infrastructure
  - energy
  - pipeline
  - ransom-payment
  - executive-order
sources:
  - url: https://www.cisa.gov/news-events/cybersecurity-advisories/aa21-131a
    publisher: CISA
    publisherType: government
    reliability: R1
    publicationDate: "2021-05-11"
    archived: false
  - url: https://www.fbi.gov/news/press-releases/fbi-statement-on-compromise-of-colonial-pipeline-networks
    publisher: FBI
    publisherType: government
    reliability: R1
    publicationDate: "2021-05-10"
    archived: false
  - url: https://www.bloomberg.com/news/articles/2021-06-04/hackers-breached-colonial-pipeline-using-compromised-password
    publisher: Bloomberg
    publisherType: media
    reliability: R2
    publicationDate: "2021-06-04"
    archived: false
  - url: https://www.justice.gov/opa/pr/department-justice-seizes-23-million-cryptocurrency-paid-ransomware-extortionists-darkside
    publisher: U.S. Department of Justice
    publisherType: government
    reliability: R1
    publicationDate: "2021-06-07"
    archived: false
  - url: https://www.mandiant.com/resources/blog/shining-a-light-on-darkside-ransomware-operations
    publisher: Mandiant
    publisherType: vendor
    reliability: R1
    publicationDate: "2021-05-11"
    archived: false
mitreMappings:
  - techniqueId: T1133
    techniqueName: External Remote Services
    tactic: Initial Access
    notes: DarkSide affiliates gained initial access through a legacy VPN account on Colonial Pipeline's network. The VPN appliance did not enforce multi-factor authentication, allowing password-only access to the corporate IT environment.
  - techniqueId: T1078
    techniqueName: Valid Accounts
    tactic: Persistence
    notes: The attackers authenticated using a compromised, legitimate employee password found in a batch of leaked credentials on the dark web. The VPN account was no longer in active use but had not been deprovisioned.
  - techniqueId: T1486
    techniqueName: Data Encrypted for Impact
    tactic: Impact
    notes: DarkSide ransomware encrypted critical IT systems across Colonial Pipeline's corporate network. The encryptor was deployed after lateral movement and data exfiltration were complete, locking systems and demanding payment in Bitcoin.
  - techniqueId: T1490
    techniqueName: Inhibit System Recovery
    tactic: Impact
    notes: DarkSide ransomware deleted volume shadow copies and disabled Windows recovery features on encrypted hosts to prevent victims from restoring systems without paying the ransom.
---

## Executive Summary

On May 7, 2021, the DarkSide ransomware-as-a-service (RaaS) group launched a ransomware attack against Colonial Pipeline, the operator of the largest refined products pipeline in the United States. The attackers gained initial access through a compromised password on a legacy VPN account that lacked multi-factor authentication. Colonial Pipeline proactively shut down its 5,500-mile pipeline system, which carries approximately 45% of all fuel consumed on the US East Coast, as a precautionary measure to prevent the malware from spreading to operational technology (OT) systems.

The shutdown triggered widespread fuel shortages, panic buying, and price spikes across the southeastern United States, with average gas prices rising nationally and emergency declarations issued in multiple states and at the federal level. Colonial Pipeline paid a ransom of approximately $4.4 million in Bitcoin to the attackers. The FBI subsequently recovered approximately $2.3 million of the ransom payment through cryptocurrency seizure operations. DarkSide publicly claimed the attack was financially motivated and apolitical before shutting down its operations on May 14, 2021, after its infrastructure was seized. The incident was a catalyst for Executive Order 14028 on Improving the Nation's Cybersecurity and the issuance of TSA Pipeline Security Directives mandating cybersecurity standards for pipeline operators.

## Technical Analysis

The initial intrusion vector was a legacy VPN account on Colonial Pipeline's corporate IT network. According to reporting by Bloomberg citing Mandiant's incident response findings, the compromised password appeared in a batch of leaked credentials on the dark web, suggesting credential stuffing or prior breach reuse. The VPN appliance did not require multi-factor authentication (MFA), allowing the attackers to authenticate with only the compromised username and password. The account was no longer in active use by any employee but had never been disabled or deprovisioned — a common identity lifecycle management failure.

DarkSide operates as a ransomware-as-a-service platform. Under this model, DarkSide developers maintain the ransomware encryptor, leak site, and negotiation infrastructure, while affiliates — independent operators recruited through underground forums — conduct the actual intrusions. Affiliates retain a percentage of ransom payments (typically 75-90%), with the remainder going to DarkSide operators. This division of labor means the technical sophistication of intrusions varies significantly between DarkSide incidents.

The attackers employed a double extortion strategy: they exfiltrated approximately 100 gigabytes of data from Colonial Pipeline's corporate network before deploying the ransomware payload. This exfiltrated data served as additional leverage — if the victim refused to pay for decryption, the attackers threatened to publish the stolen data on DarkSide's leak site. The ransomware encrypted IT systems on the corporate network. Colonial Pipeline made the decision to shut down OT systems controlling pipeline operations preemptively, not because those systems were directly compromised, but because the company could not confirm the extent of the breach and lacked sufficient network segmentation between IT and OT environments to guarantee isolation.

DarkSide's ransomware toolkit included a Linux variant specifically designed to target VMware ESXi hypervisors, enabling the encryption of virtual machine disk files and maximizing the impact on virtualized infrastructure. The Windows variant employed standard ransomware techniques including deletion of volume shadow copies and disabling of Windows recovery mechanisms to inhibit system restoration without paying the ransom.

## Attack Chain

### Stage 1: Credential Compromise

DarkSide affiliates obtained a valid username and password for a Colonial Pipeline VPN account. The credentials were found in a dataset of leaked passwords on the dark web. The account was a legacy account no longer associated with an active employee but still provisioned on the VPN appliance.

### Stage 2: Initial Access via VPN

The attackers authenticated to Colonial Pipeline's corporate VPN using the compromised credentials on or before May 6, 2021. The VPN did not enforce multi-factor authentication, allowing single-factor password-only access to the internal network.

### Stage 3: Lateral Movement and Reconnaissance

Once inside the corporate IT network, the affiliates performed reconnaissance and lateral movement to identify high-value targets, expand access, and position themselves for data exfiltration and ransomware deployment. Specific tools and techniques used during this phase have not been publicly disclosed in detail.

### Stage 4: Data Exfiltration

Approximately 100 gigabytes of corporate data were exfiltrated from Colonial Pipeline's network. This data was staged for use in DarkSide's double extortion scheme — threatening public release if the ransom was not paid.

### Stage 5: Ransomware Deployment

On May 7, 2021, DarkSide ransomware was deployed across Colonial Pipeline's IT infrastructure. The ransomware encrypted files on targeted systems, deleted volume shadow copies, and presented ransom demands. A ransom note demanded payment in Bitcoin.

### Stage 6: Pipeline Shutdown

Upon discovering the ransomware, Colonial Pipeline made the decision to proactively shut down its entire 5,500-mile pipeline system. This decision was driven by uncertainty about whether the attack had spread to OT systems and by insufficient network segmentation between IT and OT environments. The shutdown was precautionary — OT systems were not confirmed compromised.

## MITRE ATT&CK Mapping

### Initial Access

T1133 — External Remote Services: DarkSide affiliates accessed Colonial Pipeline's network through a corporate VPN appliance. The VPN did not require multi-factor authentication, permitting access with a single compromised password.

T1078 — Valid Accounts: The attackers used a legitimate, albeit inactive, employee VPN account with a compromised password sourced from dark web credential dumps.

### Impact

T1486 — Data Encrypted for Impact: DarkSide ransomware encrypted files across Colonial Pipeline's corporate IT systems, rendering them inoperable and disrupting business operations to the point where pipeline operations could not safely continue.

T1490 — Inhibit System Recovery: The ransomware deleted volume shadow copies and disabled Windows recovery mechanisms on compromised hosts, preventing system restoration without the decryption key or complete reimaging.

## Impact Assessment

The Colonial Pipeline shutdown lasted approximately six days and constituted the most disruptive cyberattack on US critical infrastructure at the time. The impact was felt across multiple dimensions:

**Operational impact.** The 5,500-mile pipeline, which transports approximately 2.5 million barrels per day of gasoline, diesel, jet fuel, and heating oil from Gulf Coast refineries to markets across the southeastern and eastern United States, was fully shut down from May 7 through May 12, 2021. This pipeline carries roughly 45% of all fuel consumed on the East Coast.

**Economic impact.** The national average gasoline price rose by approximately $0.06 per gallon, with significantly higher increases in southeastern states directly served by the pipeline. Panic buying exacerbated local shortages — at the peak of the crisis, approximately 16,000 gas stations across the Southeast were completely out of fuel. Colonial Pipeline paid $4.4 million (75 Bitcoin) in ransom and incurred additional millions in incident response, remediation, and system rebuilding costs.

**Public impact.** Governors in Georgia, North Carolina, Virginia, and Florida declared states of emergency. The federal government issued emergency waivers on fuel transport regulations to allow alternative delivery methods. Long lines at gas stations and instances of hoarding were widely reported across the Southeast.

**Policy impact.** The incident directly catalyzed Executive Order 14028 on Improving the Nation's Cybersecurity, signed by President Biden on May 12, 2021. The Transportation Security Administration (TSA) subsequently issued Pipeline Security Directives requiring pipeline operators to report cybersecurity incidents, designate cybersecurity coordinators, and implement specific security measures. These were the first mandatory cybersecurity regulations for the pipeline sector.

**Ransom recovery.** The FBI traced the Bitcoin ransom payment and, on June 7, 2021, the Department of Justice announced the seizure of approximately $2.3 million (63.7 Bitcoin) from the DarkSide-affiliated cryptocurrency wallet, recovering a significant portion of the ransom.

## Timeline

### 2021-05-06 — Data Exfiltration Begins

DarkSide affiliates begin exfiltrating approximately 100 gigabytes of data from Colonial Pipeline's corporate IT network in preparation for double extortion.

### 2021-05-07 — Ransomware Deployed and Pipeline Shut Down

DarkSide ransomware is deployed across Colonial Pipeline's IT systems. Colonial Pipeline discovers the attack and makes the decision to proactively shut down all pipeline operations as a precautionary measure.

### 2021-05-08 — Colonial Pipeline Confirms Shutdown

Colonial Pipeline publicly confirms the cybersecurity incident and pipeline shutdown. The company engages Mandiant for incident response and notifies federal law enforcement.

### 2021-05-09 — Federal Emergency Declaration

The Federal Motor Carrier Safety Administration issues a regional emergency declaration for 17 states and the District of Columbia, relaxing hours-of-service regulations for drivers transporting fuel to alleviate supply disruptions.

### 2021-05-12 — Pipeline Restarts and Executive Order Signed

Colonial Pipeline initiates the restart of pipeline operations, beginning the process of returning to full operational capacity. President Biden signs Executive Order 14028 on Improving the Nation's Cybersecurity, establishing new requirements for federal cybersecurity standards, software supply chain security, and incident response.

### 2021-05-13 — DarkSide Claims Attack Was Apolitical

DarkSide issues a public statement claiming the attack was purely financially motivated and that the group does not engage in geopolitics. The statement attempts to distance the group from the political fallout of the attack.

### 2021-05-14 — DarkSide Infrastructure Seized and Operations Shut Down

DarkSide announces it is ceasing operations after losing access to its infrastructure, including its payment servers and blog. The shutdown followed reported seizure of DarkSide's servers, though the specific actor responsible for the seizure was not officially confirmed.

### 2021-06-07 — DOJ Recovers $2.3 Million in Ransom

The Department of Justice announces the seizure of approximately 63.7 Bitcoin (valued at approximately $2.3 million) from a cryptocurrency wallet used by DarkSide affiliates, recovering a substantial portion of the $4.4 million ransom paid by Colonial Pipeline.

## Remediation & Mitigation

**Enforce multi-factor authentication on all remote access.** The single most impactful control that would have prevented this incident is MFA on VPN and other remote access services. Password-only authentication on internet-facing services is insufficient against credential reuse and credential stuffing attacks.

**Implement identity lifecycle management.** The compromised VPN account was inactive but never deprovisioned. Organizations must implement automated processes to disable or remove accounts when employees leave or accounts are no longer needed. Regular access reviews should identify and remediate orphaned accounts.

**Segment IT and OT networks.** Colonial Pipeline shut down OT systems because it could not confirm the attack had not crossed from IT to OT. Proper network segmentation with monitored, restricted pathways between IT and OT environments allows organizations to contain IT-side incidents without preemptively shutting down operational systems.

**Develop and test ransomware response plans.** Organizations operating critical infrastructure should maintain playbooks specifically addressing ransomware scenarios, including decision criteria for operational shutdowns, communication protocols with federal authorities, and recovery procedures. These plans should be tested through tabletop exercises.

**Comply with TSA Pipeline Security Directives.** Following the Colonial Pipeline incident, TSA issued Security Directives requiring pipeline operators to implement specific cybersecurity measures, including network segmentation, access control, continuous monitoring, and incident response planning. Pipeline operators must meet these mandatory requirements.

**Monitor for credential exposure.** Organizations should actively monitor dark web forums and credential dump databases for exposed corporate credentials. Services that provide alerts on credential compromise can enable rapid password resets before exposed credentials are exploited.

## Indicators of Compromise

### Network Indicators

- DarkSide ransomware command-and-control infrastructure utilized Tor-based communication channels for ransom negotiation and data leak operations.
- DarkSide affiliates commonly used compromised VPN endpoints as initial access points, with connections originating from anonymizing infrastructure.
- CISA Alert AA21-131A documents network-level indicators associated with DarkSide operations, including known C2 domains and IP addresses used in affiliate campaigns.

### File Hashes

- DarkSide ransomware samples (Windows variant) — SHA256: `156335b95ba216456f1ac0894b7b9d6ad7571f13dea9c110d2a7062b13f8e6a2`
- DarkSide ransomware samples (Linux/ESXi variant) — SHA256: `e44e62a041f1f48820cd3ff42baa0e19ab2fdb3dee1a02deb8539a8664b098b5`
- Ransom note file typically named `README.[victim_id].TXT` deposited in encrypted directories.
- For the most current and comprehensive IOC list, refer to CISA Alert AA21-131A and Mandiant's published DarkSide analysis.

## Sources & References

1. CISA. "DarkSide Ransomware: Best Practices for Preventing Business Disruption from Ransomware Attacks (AA21-131A)." Cybersecurity and Infrastructure Security Agency, May 11, 2021. [https://www.cisa.gov/news-events/cybersecurity-advisories/aa21-131a](https://www.cisa.gov/news-events/cybersecurity-advisories/aa21-131a)

2. FBI. "FBI Statement on Compromise of Colonial Pipeline Networks." Federal Bureau of Investigation, May 10, 2021. [https://www.fbi.gov/news/press-releases/fbi-statement-on-compromise-of-colonial-pipeline-networks](https://www.fbi.gov/news/press-releases/fbi-statement-on-compromise-of-colonial-pipeline-networks)

3. Turton, William and Kartikay Mehrotra. "Hackers Breached Colonial Pipeline Using Compromised Password." Bloomberg, June 4, 2021. [https://www.bloomberg.com/news/articles/2021-06-04/hackers-breached-colonial-pipeline-using-compromised-password](https://www.bloomberg.com/news/articles/2021-06-04/hackers-breached-colonial-pipeline-using-compromised-password)

4. U.S. Department of Justice. "Department of Justice Seizes $2.3 Million in Cryptocurrency Paid to the Ransomware Extortionists Darkside." DOJ Office of Public Affairs, June 7, 2021. [https://www.justice.gov/opa/pr/department-justice-seizes-23-million-cryptocurrency-paid-ransomware-extortionists-darkside](https://www.justice.gov/opa/pr/department-justice-seizes-23-million-cryptocurrency-paid-ransomware-extortionists-darkside)

5. Mandiant. "Shining a Light on DARKSIDE Ransomware Operations." Mandiant Blog, May 11, 2021. [https://www.mandiant.com/resources/blog/shining-a-light-on-darkside-ransomware-operations](https://www.mandiant.com/resources/blog/shining-a-light-on-darkside-ransomware-operations)
