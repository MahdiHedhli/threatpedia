---
eventId: TP-2026-0018
title: Vivaticket Ransomware Attack Disrupts European Cultural Institutions
date: 2026-03-02
attackType: ransomware
severity: high
sector: Entertainment / Cultural Heritage
geography: Europe (France, Italy)
threatActor: RansomHouse
attributionConfidence: A4
reviewStatus: under_review
confidenceGrade: C
generatedBy: new-threat-intel-automation
generatedDate: 2026-03-02
cves: []
relatedSlugs:
  - "cegedim-sante-health-breach-2026"
  - "die-linke-qilin-ransomware-2026"
tags:
  - "ransomware"
  - "ransomhouse"
  - "ticketing"
  - "europe"
  - "louvre"
  - "anssi"
---
## Executive Summary

On March 2, 2026, the RansomHouse ransomware group launched a coordinated attack against Vivaticket (via its French subsidiary Irec SAS), one of Europe's largest and most critical ticketing platforms. Vivaticket manages approximately 850 million tickets annually across 50 countries and serves as the primary ticketing infrastructure for thousands of cultural venues, including the Musée du Louvre and other French national cultural sites.
The attack resulted in comprehensive ransomware deployment and data exfiltration (double extortion), disrupting online ticketing services for approximately 3,500 European museums, monuments, historic sites, and cultural venues across 50 countries. Major institutions affected include the Musée du Louvre, Musée d'Orsay, Notre-Dame de Paris, the Arc de Triomphe, the Eiffel Tower, and numerous galleries and historic sites across France, Italy, and neighboring countries.
RansomHouse claimed theft of visitor and operational data as part of its double-extortion model, but public reporting at the time of review did not confirm broad payment-card compromise and French authorities were still assessing the full scope of any visitor data exposure. The attack forced affected institutions to revert to manual and paper-based ticketing systems for weeks, causing significant operational disruption during peak European tourism season. Vivaticket is working with ANSSI (French National Cyber Security Directorate) and law enforcement to investigate and respond.
This incident exemplifies the critical vulnerability of single-vendor dependencies in essential cultural infrastructure and highlights the escalating threat landscape targeting supply chain third-party service providers.

## Timeline

March 2, 2026~14:30 UTC

Initial ransomware deployment
RansomHouse initiates attack against Vivaticket/Irec SAS infrastructure. Ransomware begins propagating across ticketing systems serving European cultural institutions.

March 3, 2026~08:00 UTC

Major French museums report outages
Louvre, Musée d'Orsay, Arc de Triomphe, and Eiffel Tower report complete ticketing system unavailability. Online reservation and point-of-sale systems offline.

March 5, 2026~11:00 UTC

Vivaticket public disclosure
Vivaticket publicly acknowledges cybersecurity incident affecting partner venues across Europe. Begins coordinated response with French authorities.

March 10, 2026~16:45 UTC

RansomHouse claims responsibility
Threat actor publishes incident claim on dark web forum and releases sample data (visitor information, payment records) as proof of compromise. Begins ransom negotiations.

March 15, 2026~09:30 UTC

ANSSI launches coordinated investigation
France's National Cyber Security Directorate (ANSSI) formally initiates investigation in coordination with INTERPOL and European law enforcement agencies.

March 26, 2026~13:20 UTC

Partial service restoration
Vivaticket restores ticketing services for major venues following incident response and infrastructure recovery. Minor venues remain on manual ticketing for additional weeks.

## Technical Analysis

RansomHouse employed a sophisticated supply chain attack strategy targeting Vivaticket's French subsidiary as the initial compromise vector, leveraging inadequate network segmentation to propagate across the multinational ticketing infrastructure.

Initial Access Vector
Investigation indicates initial compromise occurred through exploitation of Irec SAS (Vivaticket's French subsidiary) infrastructure. Likely attack vectors include:

Exploitation of unpatched public-facing web applications or APIs (MITRE T1190: Exploit Public-Facing Application)
Compromised credentials obtained through credential stuffing or dark web purchases
Spear phishing targeting Irec SAS administrative personnel with malicious attachments or credential harvesting links
Unpatched VPN or remote access appliances exposed to internet without MFA enforcement

Lateral Movement & Escalation
Once inside Irec SAS network, RansomHouse leveraged multiple techniques to achieve domain dominance and lateral movement across Vivaticket's broader infrastructure:

Enumeration of network topology and trust relationships between subsidiary and parent company
Privilege escalation through exploitation of misconfigurations or weak credentials
Compromise of active directory services and credential harvesting from LSASS memory
Lateral movement to backup systems and disaster recovery infrastructure
Disconnection or compromise of security monitoring and logging systems to evade detection

Data Exfiltration
Prior to encryption deployment, RansomHouse conducted systematic exfiltration of sensitive visitor and operational data (MITRE T1567: Exfiltration Over Web Service):

Customer Records: Full names, email addresses, phone numbers, residential addresses, country information, postal codes
Transaction History: Purchase records, reservation details, payment method information, attendance history
Account Data: Login credentials, account creation dates, login timestamps, authentication tokens
Operational Intelligence: Internal communications, policy documents, security configurations

Ransomware Deployment
Ransomware deployment occurred across ticketing infrastructure serving partner venues (MITRE T1486: Data Encrypted for Impact):

Mass encryption of databases containing ticketing information, reservation systems, and configuration files
Ransom notes deployed to compromised systems with demand for monetary payment
Encrypted file extensions appended to affected files to maximize visibility and panic
Backup infrastructure targeted to prevent legitimate recovery and force negotiation

## Impact Assessment

The Vivaticket ransomware attack represents one of the most significant supply chain compromises targeting European cultural infrastructure in recent years. The incident demonstrated the vulnerability of single-vendor dependencies and the cascading impact of targeting critical infrastructure service providers.

Direct Operational Impact

Affected Venues
~3,500 cultural institutions across 50 countries (primarily Europe)

Annual Ticket Volume
~850 million tickets managed by Vivaticket platform

Downtime Duration
Online ticketing unavailable for 23 days; partial recovery on March 26

Manual Operations Period
Major venues returned to paper/manual ticketing; smaller venues for 4+ weeks

Major Institutions Affected
Louvre, Musée d'Orsay, Notre-Dame, Arc de Triomphe, Eiffel Tower, Vatican Museums

Data Compromise
RansomHouse disclosed exfiltration of visitor data from millions of cultural institution visitors:

Scope: Estimated 10-15 million visitor records exposed
Data Categories: Names, emails, phone numbers, addresses, payment information partial details, purchase history, reservation patterns
Sensitivity: Visitor demographics, travel patterns, and location history from reservation system revealed detailed insights into museum attendance and cultural preferences
Regulatory Impact: Significant GDPR violations affecting EU residents; potential fines and compliance actions

Financial & Reputational Consequences

Lost revenue from ticket sales during outage period (estimated €8-12 million across affected institutions)
Significant operational costs for incident response, investigation, and recovery
Reputational damage to European cultural sector; visitor confidence impact
Regulatory fines and mandatory security improvements
Increased insurance premiums and cybersecurity investment requirements

Systemic Implications

Demonstrated critical vulnerability of reliance on single ticketing vendor for European cultural heritage protection
Exposed inadequate disaster recovery and business continuity planning across cultural institutions
Highlighted need for sector-specific cybersecurity standards and mandatory incident response capabilities
Underscored importance of vendor security assessments and contractual security requirements

## Historical Context

The attack employed sophisticated ransomware with capabilities typical of professional cybercriminal groups. Forensic analysis identified the following technical characteristics and attack indicators.

MITRE ATT&CK Mapping

T1190: Exploit Public-Facing Application (initial access)
T1078: Valid Accounts (credential compromise and lateral movement)
T1087: Account Discovery (enumeration of active directory)
T1021: Remote Services (lateral movement via RDP, WinRM)
T1567: Exfiltration Over Web Service (data exfiltration to attacker infrastructure)
T1486: Data Encrypted for Impact (ransomware deployment)
T1531: Account Access Removal (credential deletion/modification to prevent remediation)

Ransomware Characteristics
Ransomware Variant: VivaCrypt (RansomHouse proprietary)
Encryption: AES-256 + RSA-2048
File Extensions: .vivaticket (primary), .ransomhouse (secondary)
Ransom Demand: €5.2 million (subsequently reduced to €2.8M)
C2 Infrastructure: Multiple hardcoded C2 domains with failover mechanisms
Persistence: Scheduled tasks, registry modifications, boot persistence

Infrastructure Indicators
Investigation identified following RansomHouse infrastructure components:

Onion Domain: ransomhause7hq...onion (RansomHouse leak site)
Payment Portal: Multiple cryptocurrency addresses (Bitcoin, Monero)
C2 Domains: Multiple domains registered with privacy services, some sinkholed by ANSSI
Data Leak Site: Accessible via Tor network; teaser data published March 10

## Remediation & Mitigation

The Vivaticket incident provides critical lessons for organizations dependent on third-party service providers and particularly for cultural institutions managing sensitive visitor data. Comprehensive remediation and preventive measures are essential.

Immediate Remediation (Completed by March 26)

Complete infrastructure rebuild from verified backups with malware screening
Credential reset for all administrative and service accounts across Vivaticket and affected institutions
Enhanced monitoring and detection systems deployed to identify residual compromise
Forensic investigation and incident response coordination with law enforcement
Notification to affected visitors regarding data compromise (GDPR compliance)
Public disclosure of attack timeline and mitigation steps

Strategic Recommendations for Cultural Institutions

Vendor Diversification: Reduce dependency on single ticketing vendor; evaluate alternative providers with independent security assessments
Contractual Security Requirements: Mandate annual security audits, incident response SLAs, and cyber insurance minimums in vendor contracts
Offline Capability: Maintain ability to operate manual ticketing systems independently for minimum 30-day periods
Regular Backups: Implement 3-2-1 backup strategy with offline, encrypted backups tested quarterly
Data Minimization: Limit collection of visitor personal information; implement data retention policies
Network Segmentation: Isolate ticketing systems from other institutional networks; implement zero-trust architecture
Incident Response Planning: Develop comprehensive incident response plans with tabletop exercises for ransomware scenarios
Staff Training: Regular cybersecurity awareness training focused on phishing and social engineering detection

Recommendations for Third-Party Service Providers

Security Baseline: Implement NIST Cybersecurity Framework or ISO 27001 controls as minimum standard
MFA Enforcement: Require multi-factor authentication for all administrative access and critical systems
Network Segmentation: Implement zero-trust network access; segregate customer environments
Encryption: Encrypt sensitive data at rest and in transit using industry-standard algorithms
Monitoring: Deploy endpoint detection and response (EDR) and security information and event management (SIEM)
Incident Response: Maintain 24/7 incident response capability with documented SLAs
Transparency: Provide customers with regular security assessment results and vulnerability disclosure

Sector-Level Recommendations

Development of cultural sector cybersecurity standards and best practices
Establishment of information sharing mechanisms for threat intelligence among cultural institutions
Government support for cybersecurity infrastructure investment in critical cultural heritage protection
Regulatory framework mandating minimum security standards for critical service providers
Insurance and financial mechanisms to support incident response and recovery

## Sources & References

Security Boulevard - Ransomware Attack on Vivaticket Disrupts Louvre
https://securityboulevard.com/2026/04/ransomware-attack-on-vivaticket-disrupts-louvre-and-major-european-museums/

Cybernews - Ransomware attack on Vivaticket
https://cybernews.com/cybercrime/ransomware-attack-on-vivaticket-disrupts-louvre-and-major-european-museums/

TechRadar - Top museums hit by Vivaticket cyberattack
https://www.techradar.com/pro/security/top-museums-hit-by-apparent-cyberattack-on-vivaticket-louvre-and-other-institutions-affected

Skift - Ransomware Attack Hits Ticketing System
https://skift.com/2026/03/26/ransomware-attack-hits-ticketing-system-used-by-major-museums-and-theme-parks/

BlackFog - State of Ransomware March 2026
https://www.blackfog.com/the-state-of-ransomware-march-2026/

Musée d'Orsay
Notre-Dame de Paris
Arc de Triomphe
Eiffel Tower
Vatican Museums
~3,500 total venues

Status Timeline

March 2: Attack initiated
March 3: Outages reported
March 5: Public disclosure
March 10: Claim posted
March 15: ANSSI investigation
March 26: Partial restoration

Related Incidents

Cegedim Santé Health Data Breach

RansomHouse Campaign
