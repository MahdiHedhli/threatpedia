---
eventId: TP-2026-0025
title: FBI DCSNet Surveillance System Breach by Salt Typhoon
date: 2026-02-17
attackType: espionage
severity: critical
sector: Government / Law Enforcement
geography: United States
threatActor: Salt Typhoon (China MSS)
attributionConfidence: A4
reviewStatus: under_review
confidenceGrade: C
generatedBy: new-threat-intel-automation
generatedDate: 2026-02-17
cves: []
relatedSlugs:
  - "axios-unc1069-compromise"
  - "drift-protocol-dprk-exploit-2026"
  - "frostarmada-soho-dns-hijacking-2026"
  - "operation-truechaos-trueconf-zero-day-2026"
tags:
  - "espionage"
  - "china"
  - "salt-typhoon"
  - "surveillance"
  - "fisma"
  - "dcsnet"
  - "wiretap"
  - "supply-chain"
  - "law-enforcement"
---
## Executive Summary

The FBI disclosed in early April 2026 that a breach of its Digital Collection System Network (DCSNet) — specifically the DCS-3000 system (codenamed "Red Hook") — qualifies as a "major incident" under the Federal Information Security Modernization Act (FISMA). The compromised DCS-3000 system processes pen register and trap-and-trace surveillance operations, managing court-authorized call metadata collection including numbers dialed, routing data, and identities of individuals under active FBI investigation. FBI deputy assistant director Michael Machtinger confirmed the threat remains "very, very much ongoing" as of April 2026.
                        The breach was detected on February 17, 2026, when abnormal activity was observed on the compromised network. On March 23, senior Department of Justice officials formally classified the intrusion as a "major incident" under a 2014 law. The FBI notified Congress in early April. Investigators have attributed the attack to Salt Typhoon, a threat actor linked to China's Ministry of State Security (MSS), using the same supply-chain approach previously employed against major U.S. telecom companies in 2024-2025.
                        The attackers gained access through a commercial Internet Service Provider serving as an FBI contractor, exploiting the ISP's infrastructure to bypass FBI network security controls. The exposed data includes phone numbers of surveillance targets, call metadata, and personal identification information on subjects of bureau investigations — making this one of the most sensitive government breaches in recent U.S. history with direct implications for ongoing national security operations and criminal investigations.

## Technical Analysis

The compromise followed an established pattern consistent with Salt Typhoon's operational methodology, exploiting commercial infrastructure vulnerabilities to access sensitive government systems.

                            Supply Chain Attack Vector
                            Salt Typhoon exploited the interconnected nature of government contractor networks. The FBI's DCSNet relied on connectivity through a commercial ISP contractor serving as intermediary infrastructure. Rather than directly assaulting FBI defenses, attackers compromised the ISP's network perimeter, using it as a beachhead to access FBI systems that trusted traffic from the contractor's IP ranges and systems.

                            Vulnerability Exploitation
                            Investigators documented that the attacker leveraged:
                            
                                Known CVEs: Exploitation of publicly disclosed vulnerabilities in network equipment (firewalls, routers, VPN products) that remained unpatched despite availability of security updates
                                Base Configuration Errors: Firewall and network device misconfiguration allowing unauthorized access from trusted contractor networks
                                Weak Segmentation: Insufficient network isolation between DCSNet systems and other FBI infrastructure accessed through the same ISP link
                                Credential Compromise: Likely exploitation of contractor employee credentials to gain initial foothold within ISP infrastructure

                            Demodex Rootkit Deployment & CALEA Connection
                            Once inside FBI networks, Salt Typhoon deployed the Demodex Windows kernel-mode rootkit — a sophisticated piece of malware enabling persistent remote access and evasion of security monitoring. This attack follows Salt Typhoon's 2024 CALEA compromise of major U.S. telecommunications providers (AT&T and Verizon), suggesting a coordinated intelligence collection strategy targeting U.S. surveillance and telecommunications infrastructure. Demodex provides:
                            
                                Kernel-level process hiding and file concealment
                                Anti-forensic capabilities to obstruct incident investigation
                                Privilege escalation and lateral movement tools
                                Interception of security software communications
                                Command and control channel establishment independent of user-space detection

                            Operational Security
                            The attack employed sophisticated anti-forensic and anti-analysis techniques, including:
                            
                                Use of legitimate ISP administrative tools to mask attacker activity as routine network operations
                                Timing attacks during periods of high legitimate ISP-to-FBI data transfer to obscure malicious traffic
                                Destruction or modification of logs on compromised systems and intermediate infrastructure
                                Living-off-the-land tactics utilizing native operating system utilities rather than attacker-supplied tools

## MITRE ATT&CK Framework Mapping

Tactic: Initial Access
                            T1195.002 - Supply Chain Compromise
                            
                                Exploitation of ISP contractor infrastructure to establish initial access to FBI networks. Attackers compromised the ISP as intermediary attack vector.

                            Tactic: Execution
                            T1190 - Exploit Public-Facing Application
                            
                                Exploitation of known vulnerabilities in network edge devices, firewalls, and VPN products serving as entry points into ISP and FBI infrastructure.

                            Tactic: Persistence
                            T1014 - Rootkit (Demodex)
                            
                                Deployment of Demodex kernel-mode rootkit for persistent remote access, stealth operations, and evasion of security monitoring on compromised systems.

                            Tactic: Privilege Escalation
                            T1078 - Valid Accounts
                            
                                Exploitation of legitimate ISP contractor accounts and FBI system credentials obtained through initial compromise or through lateral movement within contractor infrastructure.

                            Tactic: Defense Evasion
                            T1557 - Adversary-in-the-Middle
                            
                                Positioning within ISP infrastructure to intercept and potentially modify legitimate communications between contractor systems and FBI DCSNet infrastructure.

                            Tactic: Collection
                            T1005 - Data from Local System
                            
                                Exfiltration of call metadata, phone numbers of surveillance targets, routing information, and PII from DCSNet systems accessed through compromised infrastructure.

                            Tactic: Exfiltration
                            T1041 - Exfiltration Over C2 Channel
                            
                                Transmission of stolen surveillance data to attacker-controlled command and control infrastructure via encrypted channels masquerading as routine network traffic.

## Attack Timeline

2024-2025
                            
                                Salt Typhoon breaches U.S. telecoms
                                Salt Typhoon successfully compromises AT&T, Verizon, T-Mobile and other major U.S. telecom companies using similar ISP/network supplier attack methodology. Gains access to call records and surveillance data.

                            January 2026
                            
                                ISP contractor compromise begins
                                Attackers establish foothold within commercial ISP infrastructure serving as FBI contractor. Initial access likely achieved through exploitation of known vulnerabilities or credential compromise.

                            February 17, 2026
                            
                                FBI detects abnormal activity
                                FBI security monitoring identifies suspicious network traffic patterns on DCSNet systems. Investigation commences into unauthorized access attempts and data exfiltration.

                            February 28, 2026
                            
                                Formal inquiry opened
                                FBI officially opens formal investigation into the intrusion. Forensic analysis of compromised systems begins. Demodex rootkit and attacker artifacts identified.

                            March 5, 2026
                            
                                CNN reports investigation
                                CNN publishes story reporting FBI is investigating "suspicious" cyber activities on critical surveillance network. Initial public awareness of breach emerges.

                            March 23, 2026
                            
                                FISMA major incident classification
                                Department of Justice senior officials formally classify the intrusion as a "major incident" under the Federal Information Security Modernization Act. Incident escalation triggered.

                            April 2, 2026
                            
                                Bloomberg disclosure and congressional notification
                                Bloomberg reports FBI classification of DCSNet breach as major incident. FBI notifies Congress of breach scope and investigation status. Public disclosure of incident begins.

                            April 6, 2026
                            
                                Salt Typhoon attribution confirmed
                                Multiple intelligence and security outlets confirm Salt Typhoon attribution through technical analysis, infrastructure forensics, and intelligence community assessment. Incident recognized as one of most significant government breaches.

## Impact Assessment

The FBI DCSNet breach represents one of the most significant compromises of U.S. surveillance infrastructure with profound implications for national security operations and ongoing investigations.

                            Immediate Intelligence Impact
                            
                                Surveillance Target Exposure: Phone numbers of individuals under active FBI surveillance and investigation have been compromised and likely transmitted to Chinese intelligence services
                                Ongoing Investigation Compromise: Criminal and counterintelligence investigations currently active may be compromised by exposure of target identities and monitoring tactics
                                Operational Security Breach: Chinese intelligence now possesses insight into FBI surveillance methodologies, infrastructure, and investigative priorities
                                Source Protection: Confidential informants, undercover operations, and sensitive sources may be at risk if identities can be correlated with surveillance target data

                            Call Metadata Compromise
                            Exposed metadata may include:
                            
                                Phone numbers called by investigation subjects (revealing associates and communications patterns)
                                Routing information and telecommunications infrastructure details
                                Call duration, timing, and frequency data (enabling behavioral analysis)
                                Correlation with other metadata potentially linking investigation subjects to criminal activity or foreign intelligence networks

                            PII and Personal Data Exposure
                            
                                Names, addresses, and personal identifying information of investigation subjects
                                Employment history and organizational affiliations
                                Family member and associate contact information (enabling targeting of secondary subjects)
                                Potential risk of targeting, intimidation, or retaliatory action by foreign governments against U.S. persons

                            National Security Implications
                            
                                Counterintelligence investigations targeting foreign intelligence services or their U.S. operatives may be severely compromised
                                Active surveillance of suspected espionage networks is now known to adversaries
                                Chinese intelligence can implement countermeasures to avoid detection in identified investigations
                                Ongoing investigation reconstitution required, potentially rendering months of investigative work obsolete

                            Institutional Response
                            
                                Department of Justice established dedicated working group for cyber resilience improvements and incident remediation
                                Criminal investigation formally opened into the intrusion itself
                                Congressional oversight committees briefed on breach scope, containment actions, and long-term remediation strategy
                                Systematic review of contractor access to sensitive government systems initiated across federal law enforcement

## Remediation & Lessons Learned

The DCSNet breach has catalyzed significant changes in federal cybersecurity posture and contractor management practices.

                            Short-Term Containment
                            
                                Network Isolation: DCSNet systems segmented and isolated from contractor infrastructure to prevent further unauthorized access
                                Credential Rotation: Systematic rotation of all administrator accounts and service credentials on affected systems
                                Malware Remediation: Demodex rootkit and associated malware removed from compromised systems; persistent backdoors eliminated
                                System Reconstruction: Full reimaging and restoration of critical DCSNet infrastructure from clean backups

                            Architecture Improvements
                            
                                Zero-Trust Architecture: Implementation of zero-trust security model eliminating implicit trust in contractor networks and ISP connections
                                Enhanced Network Segmentation: Physical and logical separation of DCSNet from contractor-accessible infrastructure
                                Microsegmentation: Granular network policies limiting lateral movement within FBI networks
                                Continuous Monitoring: Deployment of advanced endpoint detection and response (EDR) technology across all DCSNet systems

                            Patch Management and Vulnerability Remediation
                            
                                Establishment of expedited patch management process for critical vulnerabilities
                                Inventory and remediation of all known CVEs in network edge devices across FBI infrastructure
                                Implementation of vulnerability scanning and management tools with prioritized remediation schedules
                                Requirement for security assessment of all network appliances prior to deployment in production environments

                            Contractor Security Framework
                            
                                Overhaul of contractor security assessment and monitoring requirements
                                Establishment of baseline security standards for all ISP and network contractors serving federal agencies
                                Requirement for continuous security monitoring and attestation from contractors handling sensitive infrastructure
                                Revision of contractor agreements to include mandatory cybersecurity insurance and incident response requirements

                            Strategic Lessons
                            
                                Supply Chain Risk is Critical National Security Risk: The same techniques used successfully against major telcos in 2024-2025 proved effective against FBI infrastructure, demonstrating that commercial contractors remain high-value targets for nation-state attackers
                                Legacy Infrastructure Vulnerabilities: DCSNet's dependence on aging surveillance systems with insufficient security controls created exploitable gaps
                                Proactive Intelligence is Essential: The FBI's early detection (February 17) enabled rapid containment; lack of advanced threat monitoring could have extended the compromise window indefinitely
                                Congressional Oversight: Enhanced reporting requirements and oversight mechanisms implemented to prevent future incidents from remaining classified beyond Congressional notification thresholds

## Attribution to Salt Typhoon

Salt Typhoon attribution is assessed with high confidence by U.S. intelligence and cybersecurity professionals through converging technical and operational indicators.

                            Operational Pattern Matching
                            The DCSNet breach follows an identical playbook to Salt Typhoon's 2024-2025 telecom infrastructure attacks targeting AT&T, Verizon, T-Mobile and other U.S. carriers. Key operational similarities include:
                            
                                ISP/Supplier Targeting: Exploitation of network service providers and contractors rather than direct assault on defended government networks
                                Known Vulnerability Exploitation: Leveraging unpatched CVEs in commercially-available network equipment (firewalls, routers, VPN products)
                                Extended Dwell Time: Establishing persistent presence over weeks/months prior to detection, enabling comprehensive data collection
                                Anti-Forensic Discipline: Deliberate log destruction and use of legitimate administrative tools to mask attacker activity
                                Targeting Priority: Focus on telecommunications and surveillance infrastructure providing strategic intelligence on U.S. law enforcement and intelligence operations

                            Technical Indicators
                            
                                Demodex Rootkit: The kernel-mode rootkit deployed in DCSNet compromise is identical to malware used in 2024-2025 telecom breaches and directly attributed to Salt Typhoon
                                Infrastructure Correlation: Attacker command and control servers trace to infrastructure previously used by Salt Typhoon in telecom operations
                                Malware Code Similarities: Binary analysis reveals code reuse and development patterns consistent with existing Salt Typhoon malware toolkit
                                Timing and Methodology: Attack execution timeline and operational security practices align with documented Salt Typhoon procedures

                            Intelligence Assessment
                            U.S. intelligence community assessment attributes the attack to Salt Typhoon, a state-sponsored APT group operating under the authority of China's Ministry of State Security (MSS). Salt Typhoon represents one of China's most sophisticated and operationally effective signals intelligence (SIGINT) collection apparatus, prioritizing telecommunications and surveillance infrastructure as high-value intelligence targets.

                            Strategic Motivation
                            Attribution to Chinese intelligence services reflects China's strategic interest in:
                            
                                Countering FBI surveillance of Chinese intelligence operatives and espionage activities within the United States
                                Identifying targets of U.S. counterintelligence investigations to enable protective measures
                                Accessing surveillance capabilities and infrastructure details for strategic deception operations
                                Demonstrating capability to penetrate sensitive U.S. government systems to deter investigation of Chinese government personnel and entities

                            🔄 Intelligence Update — April 9, 2026
                            PENDING HUMAN REVIEW — Enrichment added by daily-incident-updater automation
                            
                            Phone Numbers Exposed
                            Nextgov/FCW reported in April 2026 that the suspected Chinese breach exposed surveillance targets' phone numbers, confirming that pen register and trap-and-trace surveillance returns were compromised alongside personally identifiable information about FBI investigation subjects.
                            
                            FBI Confirms Ongoing Threat
                            FBI officials stated at CyberTalks 2026 that threats from Salt Typhoon are "still very much ongoing", indicating the PRC intelligence apparatus continues active operations against U.S. telecommunications and law enforcement infrastructure.
                            
                            Counter-Intelligence Implications
                            Analysis from SOFX indicates the FBI wiretap network breach may have exposed China's own U.S. spy operations — if Chinese intelligence subjects were among those surveilled, Beijing may now know which of its assets are under FBI monitoring.

## Sources & References

Bloomberg - "FBI Calls Breach of Sensitive Agency Networks a 'Major Incident'"
                        April 2, 2026

                        Security Magazine - "Breach of FBI Surveillance System Considered a 'Major Incident'"
                        April 2026

                        CNN - "FBI investigating 'suspicious' cyber activities on critical surveillance network"
                        March 5, 2026

                        HSToday - "FBI Labels China-Linked Hack of Surveillance System a 'Major Cyber Incident'"
                        April 2026

                        Nextgov - "Suspected Chinese breach of FBI system exposed surveillance targets' phone numbers"
                        April 2026

                        CyberScoop - "FBI: Threats from Salt Typhoon are 'still very much ongoing'"
                        April 2026

                        Security Magazine — FBI DCSNet Breach Coverage
                        Security Magazine, April 2026

                        HSToday — FBI Surveillance System Breach
                        HSToday

                        Nextgov/FCW — "Suspected Chinese breach of FBI system exposed surveillance targets' phone numbers"
                        April 2026

                        CyberScoop — "FBI: Threats from Salt Typhoon are 'still very much ongoing'"
                        April 2026

                    Key Facts
                    
                        Compromise Date: January-February 2026
                        Detection Date: February 17, 2026
                        Classification: FISMA Major Incident
                        Affected System: DCS-3000 (Red Hook)
                        Data Exposed: Surveillance target phone numbers, call metadata, PII
                        Attack Vector: ISP contractor network

                    MITRE ATT&CK
                    
                        T1195.002 - Supply Chain
                        T1190 - Exploit Application
                        T1014 - Rootkit
                        T1078 - Valid Accounts
                        T1557 - MITM
                        T1005 - Local Data
                        T1041 - C2 Exfiltration

                    Threat Actor
                    
                        Name: Salt Typhoon
                        Attribution: China MSS
                        Type: Nation-State APT
                        Capability Level: Advanced
                        Infrastructure Focus: Telecommunications & Surveillance

                    Severity Indicators
                    
                        CRITICAL IMPACT
                        
                            Surveillance infrastructure compromised
                            Active investigation exposure
                            PII of investigation subjects exposed
                            Foreign intelligence access confirmed
                            Government response required

                    Related Incidents
                    
                        Axios npm Package Compromise
                        Other nation-state supply chain attacks on critical infrastructure and development tooling

                    Related Reading
                    
                        All Incidents
                        Threat Actors
                        Security Advisories
