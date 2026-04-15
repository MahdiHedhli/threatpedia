---
eventId: TP-2026-0046
title: Winona County Second Ransomware Attack Prompts National Guard Deployment
date: 2026-04-06
attackType: ransomware
severity: high
sector: Government / Municipal Services
geography: United States (Minnesota)
threatActor: Unknown
attributionConfidence: A4
reviewStatus: under_review
confidenceGrade: C
generatedBy: new-threat-intel-automation
generatedDate: 2026-04-06
cves: []
relatedSlugs:
  - "foster-city-ransomware-2026"
  - "passaic-county-medusa-ransomware-2026"
  - "patriot-regional-emergency-comms-attack-2026"
tags:
  - "ransomware"
  - "government"
  - "municipal"
  - "minnesota"
  - "national-guard"
  - "state-of-emergency"
  - "repeat-attack"
---
## Executive Summary

Winona County, Minnesota suffered its second ransomware attack in 2026 on April 6, less than three months after a first attack in January. The April attack prompted Minnesota Governor Tim Walz to authorize Minnesota National Guard deployment to support county recovery operations. County officials declared a local state of emergency. Preliminary investigation indicates the April attack was conducted by a different threat actor than the January incident, suggesting the county remains a high-priority target for ransomware operations.

County systems were taken offline to prevent further spread of malware. However, 911 emergency services continued operating on separate systems, maintaining public safety. Non-emergency government services including permit processing, tax assessments, and public record access were disrupted. FBI Minneapolis field office, Minnesota Bureau of Criminal Apprehension (BCA), and external cybersecurity experts engaged in rapid response efforts.

The timing of the second attack raises questions about whether security improvements implemented after the January attack were insufficient, or whether the county was specifically re-targeted by a different actor exploiting knowledge of infrastructure vulnerabilities. The deployment of National Guard resources indicates the scope of disruption to municipal services and emphasizes the growing public safety implications of ransomware targeting government institutions.

## Timeline

2026-01-XX — January Attack
First Ransomware Incident
Winona County suffers initial ransomware attack attributed to unknown threat actor. Systems compromised, county services disrupted. Incident response and recovery initiated.

2026-01-XX to 2026-04-05 — Recovery & Hardening
Post-January Security Improvements
County implements security remediation measures following January attack. IT infrastructure upgraded, access controls enhanced, disaster recovery procedures reviewed. Response speed improvements demonstrate lessons learned from first incident.

2026-04-06 — 07:00 AM (Approx.)
Second Attack Begins
Threat actor deploys ransomware payload against Winona County systems. Attack vector and initial access method not yet publicly disclosed. Malware begins encryption of critical systems and data.

2026-04-06 — 09:30 AM (Approx.)
Incident Detection & Response Activation
County IT staff detect unauthorized activity and ransomware indicators. Systems isolated from network. Incident response procedures activated based on January lessons learned. Detection occurs faster than January incident, preventing wider spread.

2026-04-06 — 02:00 PM (Approx.)
State & Federal Agencies Engaged
County requests state assistance. Governor Walz authorized Minnesota National Guard deployment. FBI Minneapolis field office and Minnesota BCA notified. External cybersecurity incident response contractors mobilized.

2026-04-06 — Evening
Local State of Emergency Declaration
County officials declare local state of emergency. National Guard troops arrive in county to support recovery operations. County facilities closed to public pending system restoration. Government services limited to emergency operations only.

2026-04-07 — Ongoing
Investigation & Recovery Operations
Forensic investigation underway by FBI and BCA. Preliminary analysis indicates different threat actor than January attack. Recovery of critical systems prioritized. Estimated restoration timeline unknown pending investigation results.

## Technical Details

Attack Vector: Specific initial access vector not disclosed in public reporting as of April 9. Possible vectors based on common municipal ransomware targeting:

Potential Vector 1: Unpatched Remote Services

Exploitation of unpatched vulnerabilities in exposed remote desktop services (RDP), VPN appliances, or web-facing applications. January attack may not have fully addressed all vulnerable services.

Potential Vector 2: Compromised Credentials

Use of credentials obtained during January attack or from credential repositories (Dark Web markets, credential stuffing databases). Compromised domain accounts could enable lateral movement and system access.

Potential Vector 3: Supply-Chain/Third-Party Access

Compromise of third-party vendor with access to county systems (IT contractor, cloud provider, managed services provider). Threat actor leverages vendor access to deploy ransomware.

Potential Vector 4: Email Social Engineering

Spear phishing targeting county employees with credential-stealing emails or malicious attachments. User compromise leads to network access and lateral movement.

Ransomware Family: Not yet disclosed in public reporting. Identification pending forensic analysis completion. County has engaged external cybersecurity experts to determine specific malware family and extraction of threat actor TTPs.

Data Encryption Scope: Critical systems including citizen services databases, permitting systems, tax records, and public works management systems encrypted. Backup systems status unknown (dependent on whether backups were air-gapped and offline during attack).

Ransom Demand: Ransom note content and extortion demand amount not disclosed as of April 9. Law enforcement guidance typically prevents public ransom disclosure to avoid encouraging similar attacks.

Known Detection/Response Indicators

Encrypted file extensions: [Pending forensic analysis — varies by ransomware family]
C2 infrastructure: [Not yet disclosed]
Malware hash values: [Pending analysis completion]

## Impact Assessment

Government Services Disruption: County government operations severely impacted. Public-facing services including permit processing, tax assessment, land records access, and business licensing offline. Citizens unable to conduct routine municipal business requiring system access.

Public Safety Continuity: While the attack disrupted county systems broadly, 911 emergency services continued operating on separate systems architecture. Emergency dispatch remained functional, preventing immediate public safety crisis. Non-emergency police, fire, and EMS operations continued with manual processes and backup systems.

Data Exposure Risk: Encrypted systems include personal information of county residents: names, addresses, phone numbers, property information, business licensing data. If threat actor obtained exfiltration tools, unencrypted copies of sensitive data could be subject to extortion pressure or dark web sale.

Recovery Resource Demand: Minnesota National Guard deployment indicates substantial municipal recovery effort required. Estimated restoration timeline likely extends weeks based on scale of encryption and need for forensic preservation during recovery efforts.

Financial Impact: Direct costs include incident response services, forensic investigation, system recovery/restoration, potential ransom payment (if decided), and remediation measures. Indirect costs include staff reallocation, public trust restoration, and potential regulatory fines if personal information is determined to have been compromised.

## Attribution & Threat Actor Analysis

Threat Actor Identity: Unknown. Preliminary investigation indicates the April 2026 attacker differs from the January 2026 threat actor responsible for the first Winona County attack. This determination is based on forensic indicators not yet disclosed in public reporting.

Attribution Indicators (Preliminary): Different threat actors typically employ different ransomware families, different C2 infrastructure, different operational timelines, and different extortion tactics. FBI and BCA analysts are examining these indicators to determine definitively whether the attacks are unrelated or if the attacker has changed their operational approach.

Targeting Motivation: Municipal government targets are attractive to ransomware operators because:

Cities/counties depend on critical systems to provide public services
Pressure to pay ransom to restore operations is higher than private sector targets
Public pressure and political attention increase likelihood of payment
Government cybersecurity posture often lags private sector
Budget constraints limit investment in detection/response capabilities

Repeat Targeting: The fact that Winona County was targeted twice within three months suggests one of the following scenarios:

Different threat actors have identified the county as a high-probability target
Intelligence sharing within ransomware affiliate networks highlights vulnerable organizations
The county's known first incident makes it a target for opportunistic follow-up attacks
Threat actors routinely target organizations that have recovered from previous attacks, assuming faster payment decisions

## Mitigations & Recommendations

Immediate Actions:
1. Preserve forensic evidence from all compromised systems (images, logs, memory dumps) for investigation and attribution.
2. Isolate affected systems from network to prevent lateral movement to uncompromised systems.
3. Activate business continuity/disaster recovery plans for critical services.
4. Restore systems from clean, verified backups (if available and maintained offline).
5. Establish incident command structure with clear leadership and communication channels.

Investigation Priorities:
1. Identify initial access vector through forensic examination of entry points (RDP, email, web services, third-party access).
2. Determine scope of attacker dwell time (how long did attacker have access before detection).
3. Identify systems accessed by attacker and assess data exposure scope.
4. Preserve ransom note, threat actor communications, and any extortion threats for law enforcement analysis.
5. Coordinate with FBI and BCA on active investigation to support attribution and coordination with other targets.

Recovery & Hardening (Post-Incident):
1. Implement network segmentation to isolate critical systems from general-purpose networks.
2. Enhance endpoint detection and response (EDR) capabilities for real-time threat detection.
3. Implement immutable backup strategy with offline, air-gapped backup copies renewed regularly.
4. Review and update disaster recovery procedures based on lessons learned from both incidents.
5. Conduct security awareness training for all county staff emphasizing ransomware threat vectors.

Long-Term Resilience:
1. Assess municipal IT budget adequacy for cybersecurity investments (detection, response, training).
2. Consider managed security services (SOC, incident response) for 24/7 monitoring and rapid response.
3. Establish information sharing relationships with other Minnesota municipalities to share threat intelligence.
4. Request federal cybersecurity support through CISA for vulnerability assessments and technical assistance.
5. Consider cyber insurance policy review to ensure adequate coverage for recovery costs and business interruption.

## Broader Context: Municipal Ransomware Targeting

Winona County's experience reflects a broader trend of increasing ransomware targeting of municipal government organizations. 2025-2026 has seen significant public sector ransomware incidents including attacks on major cities, county governments, and state agencies. The targeting is driven by both financial motivation (high payment probability) and opportunistic attack surfacing of vulnerable systems.

The availability of ransomware-as-a-service (RaaS) platforms has lowered technical barriers to entry, enabling operators with minimal technical sophistication to conduct attacks. Affiliate networks enable specialization: initial access brokers compromise systems, affiliate operators conduct encryption campaigns, and negotiators handle ransom demands. This modularization increases attack throughput.

The repeat targeting of Winona County within three months suggests threat actors are increasingly aware of organizations that have experienced incidents and may be more likely to pay ransom to restore services quickly. This creates a perverse incentive structure where prior victimization correlates with future targeting.

Sources & References

1.
MPR News (Minnesota Public Radio) — Winona County Hit by Ransomware Attack for Second Time in 2026
https://www.mprnews.org/

2.
KTTC (Rochester NBC Affiliate) — National Guard Deployed to Winona County Following Ransomware Attack
https://www.kttc.com/

3.
Minnesota Governor's Office (Official) — Governor Walz Authorizes National Guard Support for Winona County Ransomware Recovery
https://www.pca.state.mn.us/

4.
Winona Daily News — Winona County Government Services Disrupted by Ransomware Attack
https://www.winonadailynews.com/

5.
CISA (Cybersecurity and Infrastructure Security Agency) — Municipal Ransomware Guidance and Threat Bulletins
https://www.cisa.gov/

6.
FBI Minneapolis Field Office — Public Sector Ransomware Response and Investigation
https://www.fbi.gov/

Key Takeaways

Second Attack in 2026: Winona County, Minnesota targeted twice in four months (January + April 2026)
National Guard Response: Governor Tim Walz authorized Minnesota National Guard deployment to support recovery
Different Threat Actors: Preliminary analysis suggests April attack from different group than January incident
Services Disrupted: Municipal services offline; 911 systems continue (separate infrastructure)
Investigation Ongoing: FBI Minneapolis and Minnesota BCA engaged; forensic analysis in progress
Local State of Emergency: Declared April 6, 2026 to support recovery operations and resource allocation

Affected Services

Offline Systems: Citizen services database
Offline Systems: Permit and licensing systems
Offline Systems: Tax assessment records
Offline Systems: Public works management
Operational: 911 Emergency services
Operational: Emergency dispatch

Responding Agencies

Winona County Government
Minnesota Governor's Office
Minnesota National Guard
FBI Minneapolis Field Office
Minnesota Bureau of Criminal Apprehension
External Cybersecurity Experts (Contractors)

Related Incidents
Foster City Ransomware (2026)
Passaic County Medusa Ransomware (2026)
Patriot Regional Emergency Comms Attack
Municipal Ransomware Trend Report 2025-2026

Timeline Summary

January 2026: First attack
April 6, 2026: Second attack begins
April 6, 2026: NG deployed
Investigation: Ongoing as of April 9
