---
eventId: TP-2026-0048
title: Patriot Regional Emergency Communications Center Cyberattack Disrupts Massachusetts Towns
date: 2026-04-01
attackType: ransomware
severity: high
sector: Government / Emergency Services
geography: United States (Massachusetts)
threatActor: Unknown
attributionConfidence: A4
reviewStatus: under_review
confidenceGrade: C
generatedBy: new-threat-intel-automation
generatedDate: 2026-04-01
cves: []
relatedSlugs:
  - "foster-city-ransomware-2026"
  - "winona-county-ransomware-2026"
tags:
  - "ransomware"
  - "emergency-services"
  - "government"
  - "municipal"
  - "massachusetts"
  - "911"
  - "codered"
  - "crisis24"
---
## Executive Summary

A cyberattack on the Patriot Regional Emergency Communications Center in Pepperell, Massachusetts, on April 1, 2026, disrupted emergency and business phone lines for police, fire, and EMS departments serving four regional towns: Pepperell, Dunstable, Townsend, and Ashby. The attack disabled non-emergency telephone services while critical 911 emergency dispatch systems remained operational on separate, protected infrastructure. This incident highlights the critical vulnerability of emergency services infrastructure to cyberattacks and the ongoing risk posed by inadequately secured communications systems.

The Patriot Regional Emergency Communications Center serves as the central dispatch hub for multiple agencies across the region. Emergency notifications are coordinated through the CodeRED platform, whose parent company Crisis24 suffered a significant ransomware attack in November 2025. The April attack on Patriot Regional ECC may represent either a separate incident or a secondary exploitation of vulnerabilities exposed during the November Crisis24 breach.
Public reporting has linked the affected center to CodeRED-connected systems, but it has not established a confirmed causal link between this incident and the prior Crisis24 intrusion. That overlap should therefore be treated as contextual risk, not proven attack lineage.

The attack's impact on non-emergency communications demonstrates a significant gap in emergency services resilience. While 911 remains operational, the inability to receive non-emergency calls, dispatch information, and administrative communications severely hampers response coordination and public service delivery. Law enforcement, fire services, and EMS agencies reverted to manual and backup procedures during the outage.

## Timeline

2025-11-XX — Crisis24 Breach
CodeRED Parent Company Ransomware Attack
Crisis24 (parent company of CodeRED emergency notification platform) suffers ransomware attack. Hackers compromise the platform and steal municipal officials' credentials across dozens of U.S. municipalities. Vulnerabilities or access pathways exposed during this breach potentially extend to connected emergency services networks.

2026-04-01 — 06:00 AM (Approx.)
Cyberattack Begins
Attacker compromises Patriot Regional Emergency Communications Center systems. Attack vector not yet disclosed; possibilities include ransomware deployment, direct intrusion, or exploitation of Crisis24-related vulnerabilities.

2026-04-01 — 08:30 AM (Approx.)
Service Disruption Detected
Emergency and business phone lines go offline. Center personnel detect the outage. 911 systems continue operating on separate infrastructure, preventing public safety crisis. Non-emergency dispatch operations transition to manual procedures and radio communications.

2026-04-01 — Ongoing
Response & Investigation
Incident response teams mobilized. Law enforcement, fire, and EMS agencies operate under manual dispatch procedures. Investigation underway to determine attack vector, scope of compromise, and restoration timeline. Regional emergency services coordination disrupted.

## Technical Analysis

Systems Affected: Patriot Regional Emergency Communications Center telephone exchange and related business/administrative communications systems. 911 emergency dispatch systems operated on separate infrastructure and remained functional. This suggests intentional network segmentation protected critical 911 systems but non-emergency communications infrastructure lacked equivalent protection.

### Possible Attack Vector 1: CodeRED / Crisis24 Credential Leverage

Attacker uses credentials obtained in November 2025 Crisis24 breach to access CodeRED platform or systems connected to it. CodeRED integration with Patriot Regional ECC provides network access pathway. Attacker pivots from CodeRED systems into emergency communications center infrastructure.

### Possible Attack Vector 2: Direct Intrusion / Ransomware

Attacker gains initial access to Patriot Regional ECC systems through unpatched vulnerabilities, exposed services, or compromised credentials. Malware deployed to disrupt or encrypt communications systems. Ransomware infection would render phone systems unavailable.

System Isolation Phase

Telephone and business communication systems taken offline to prevent spread of malware or to comply with ransomware attack protocols. 911 systems, operating on separate infrastructure, remain unaffected. Emergency dispatch continues with reduced efficiency using radio and manual procedures.

Service Degradation

Non-emergency phone lines unavailable. Agencies unable to receive public calls for non-emergency assistance. Administrative communications disrupted. Regional emergency services coordination hampered. Public services requiring telephone access (business licensing, permits, etc.) delayed.

Infrastructure Resilience Observation: The continued operation of 911 systems indicates adequate network segmentation between emergency dispatch infrastructure and administrative/non-emergency communications. However, the non-emergency systems lack equivalent protection, suggesting security investments were prioritized to 911 systems at the expense of broader emergency services communications infrastructure. This creates a single point of failure for non-emergency services.

CodeRED Connection: CodeRED emergency notification platform (Crisis24, parent company) suffered ransomware attack in November 2025. Public reporting on the Patriot Regional incident notes that a system linked to CodeRED was affected, but it has not confirmed whether the April 2026 disruption was caused by reuse of Crisis24-exposed credentials, a separate direct intrusion, or an unrelated system fault triggered during incident response.

Known Attack Indicators

Target: Patriot Regional Emergency Communications Center
Location: Pepperell, Massachusetts
Date: April 1, 2026
Affected Systems: Telephone exchange, business communications
Protected Systems: 911 dispatch (separate infrastructure)
Possible Relationship: Crisis24 breach (November 2025) credential exploitation

## Impact Assessment

Emergency Services Operations: Non-emergency dispatch and communications severely disrupted. Police, fire, and EMS departments unable to receive non-emergency calls from the public. Internal communications affected, requiring emergency service coordination through radio backup systems and manual procedures. While 911 emergency calls continued, response coordination capability was reduced.

Public Safety Risk: Non-emergency calls (welfare checks, minor accidents, traffic violations) could not be routed to appropriate agencies. Public unable to report non-emergency issues through normal phone channels. Backup radio systems and emergency personnel radio frequencies became congested as agencies compensated for phone line loss. Response time to non-emergency calls likely increased significantly.

Administrative Services Disruption: Regional municipalities served by Patriot Regional ECC unable to conduct routine administrative functions dependent on telephone communications. Police desk operations, fire dispatch administration, EMS call-taking systems all affected. Regional mutual aid coordination complicated.

Economic Impact: Emergency services unable to provide full range of services during outage. Regional business and residents unable to contact non-emergency services (animal control, traffic complaints, civil standby requests). Long-term impact depends on restoration timeline.

Critical Infrastructure Vulnerability Exposure: The incident demonstrates a significant vulnerability in emergency services infrastructure. Cyberattacks against regional emergency communications centers can have cascading impacts across multiple towns and agencies. The incident highlights the national vulnerability of emergency services infrastructure to well-resourced threat actors.

## Historical Context

Crisis24 November 2025 Breach: The parent company of CodeRED emergency notification platform suffered a significant ransomware attack in November 2025. The Patriot Regional incident occurred months later, but currently available reporting only supports noting the prior Crisis24 breach as relevant sector context, not as a confirmed parent cause of the April 2026 disruption.

Emergency Services Sector Trend: Attacks against emergency services infrastructure have increased significantly in 2025-2026. Multiple municipalities have experienced ransomware attacks on 911 systems, PSAP (Public Safety Answering Point) communications, and regional dispatch centers. The sector remains undersecured relative to its critical infrastructure status. Federal guidance and funding for emergency services cybersecurity infrastructure remains inadequate.

Supply Chain Risk in Emergency Services: The reliance of emergency services on third-party platforms (CodeRED, dispatch software, communications systems) creates supply chain vulnerability. A breach of a platform provider can enable secondary exploitation of all connected emergency services organizations. Patriot Regional ECC's experience demonstrates the real-world consequences of inadequately secured supply chain relationships.

## Remediation & Mitigation

Immediate Actions (Post-Incident):
1. Isolate affected systems from network to prevent malware spread.
2. Activate emergency backup communications procedures (radio dispatch, manual call logging).
3. Coordinate with state emergency management agency and CISA for incident response support.
4. Preserve forensic evidence from all compromised systems.
5. Coordinate with local law enforcement and FBI for investigation and attribution.

System-Level Hardening:
1. Implement network segmentation to isolate critical 911 systems from non-emergency communications.
2. Require multi-factor authentication for all administrative access to communications systems.
3. Implement endpoint detection and response (EDR) for early threat detection.
4. Deploy intrusion detection systems (IDS) on emergency services networks.
5. Establish immutable backup procedures for all critical emergency communications systems.

Supply Chain Risk Management:
1. Audit all third-party platforms and integrations (CodeRED, dispatch systems, CAD systems).
2. Implement vendor security assessment program requiring regular audits and vulnerability disclosures.
3. Review and restrict API access and integration permissions to minimum necessary.
4. Establish incident response procedures specific to supply chain breaches (third-party platform compromise).
5. Require vendors to implement multi-factor authentication and strong credential management.

Resilience & Redundancy:
1. Implement redundant communications pathways independent of primary telephone system (backup radio channels).
2. Establish mutual aid agreements with neighboring emergency communications centers for dispatch coverage during outages.
3. Test backup procedures quarterly to ensure effectiveness during actual outages.
4. Implement geographic failover systems for critical emergency dispatch functions.
5. Consider regionalized backup dispatch center agreements across state or regional boundaries.

Federal & State Support:
1. Request CISA technical assistance for emergency services infrastructure assessment.
2. Apply for federal FEMA or DHS grants for cybersecurity infrastructure improvements.
3. Seek state emergency management agency support for regional emergency services cybersecurity coordination.
4. Participate in information sharing networks (ISACs) for emergency services threat intelligence.
5. Advocate for increased federal cybersecurity funding for small emergency services organizations.

Sources & References

1.
The Record (Recorded Future) — Patriot Regional Emergency Communications Center Cyberattack Disrupts Massachusetts Towns
https://therecord.media/

2.
Boston 25 News — Emergency Communications Center Suffers Cyberattack in Massachusetts
https://www.boston25news.com/

3.
GovTech — Emergency Services Cyberattack: Regional Dispatch Center Disruption
https://www.govtech.com/

4.
CISA (Cybersecurity and Infrastructure Security Agency) — Emergency Services Sector Guidance and Threat Alerts
https://www.cisa.gov/

5.
FBI — Ransomware Attacks Against Emergency Services Infrastructure
https://www.fbi.gov/

6.
Massachusetts Emergency Management Agency — Regional Emergency Services Cybersecurity Coordination
https://www.mass.gov/

Key Takeaways

Critical Infrastructure Target: Cyberattack on regional emergency communications center serving four Massachusetts towns
Partial Disruption: Non-emergency phone lines down; 911 emergency systems operational (separate infrastructure)
Manual Fallback: Agencies reverted to radio dispatch and manual procedures during outage
Supply Chain Risk: Possible connection to Crisis24 ransomware breach (November 2025) and CodeRED platform compromise
Service Area: Pepperell, Dunstable, Townsend, Ashby, Massachusetts
Investigation: Ongoing; attack vector not yet publicly disclosed

Affected Agencies

Pepperell Police Department
Dunstable Police Department
Townsend Police Department
Ashby Police Department
Regional Fire Departments (EMS)
Regional Emergency Medical Services

Systems Impact

Offline: Telephone exchange (emergency + non-emergency)
Offline: Business communications systems
Offline: Administrative dispatch functions
Protected: 911 emergency systems (separate infrastructure)
Active: Radio dispatch backup systems

Related Incidents
Winona County Ransomware (2026)
Foster City Ransomware Attack
Crisis24 CodeRED Breach (November 2025)
Emergency Services Sector Cybersecurity Trends

Critical Infrastructure Context

CISA Sector: Emergency Services
Infrastructure Type: Regional Dispatch Center
Resilience Status: Partially Protected (911 vs non-emergency gap)
Threat Level: Growing (2025-2026 trend)
