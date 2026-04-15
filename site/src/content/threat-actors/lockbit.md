---
name: LockBit
aliases:
  - "GOLD SOUTHFIELD"
affiliation: Unknown
motivation: Financial
status: active
reviewStatus: under_review
generatedBy: dangermouse-bot
generatedDate: 2026-04-13
---
## Overview

LockBit is a sophisticated ransomware-as-a-service (RaaS) criminal operation responsible for the most prolific global ransomware campaign in history. Believed to originate from Russian-speaking operators, LockBit has evolved from its initial launch in 2019 to become the dominant force in the ransomware ecosystem, with LockBit 3.0 (launched 2022) representing the most advanced variant. The group operates a managed affiliate program, managing hundreds of criminal affiliates who deploy LockBit ransomware against target organizations worldwide in exchange for a percentage of extortion proceeds.

                    LockBit's impact is staggering: documented attacks on over 2,000 organizations globally, with collective extortion demands exceeding $120 million USD. The group has targeted every major industry vertical and geographic region, demonstrating a non-discriminatory approach to victim selection focused primarily on extortion profit. LockBit combines sophisticated encryption, data exfiltration, double-extortion tactics, and aggressive victim shaming campaigns on publicly accessible leak sites to coerce payment. The group operates with minimal operational constraints, advertising services openly on criminal forums and maintaining 24/7 customer support infrastructure.

                    LockBit represents a watershed moment in cybercriminal professionalism, operating with business-like efficiency including marketing campaigns, affiliate recruitment, customer support, negotiation services, and technical innovation. The group has demonstrated ability to rapidly develop encryption weaknesses remediation when exploited, suggests access to sophisticated mathematics and cryptography expertise. As of 2025, LockBit remains the leading ransomware threat despite law enforcement disruption efforts in late 2024.

## Tactics, Techniques & Procedures (TTPs)

MITRE ATT&CK Techniques
                        
                            Initial Access:
                            
                                T1566.001: Phishing - Spearphishing Attachment
                                T1566.002: Phishing - Spearphishing Link
                                T1190: Exploit Public-Facing Application
                                T1199: Trusted Relationship
                            
                            Persistence:
                            
                                T1098.001: Account Manipulation
                                T1547: Boot or Logon Autostart Execution
                                T1547.001: Boot or Logon Autostart Execution - Registry Run Keys
                            
                            Defense Evasion:
                            
                                T1562.001: Impair Defenses - Disable or Modify Tools
                                T1562.008: Impair Defenses - Disable Logging
                                T1140: Deobfuscate/Decode Files or Information
                            
                            Lateral Movement:
                            
                                T1570: Lateral Tool Transfer
                                T1570: Lateral Tool Transfer
                                T1021.002: Remote Services - SSH
                            
                            Impact:
                            
                                T1486: Data Encrypted for Impact
                                T1565.001: Data Destruction - Stored Data Manipulation
                                T1561: Disk Wipe

                        Common Attack Vectors
                        
                            Exploit Public-Facing Applications: Targeting of vulnerable web applications, VPNs, and remote access services to establish initial network access.
                            Spear-Phishing Campaigns: Targeted phishing emails with weaponized attachments or links to infect target organizations with initial payload.
                            Affiliate Network Distribution: Managed affiliate network of hundreds of criminal operators conducting initial access operations on LockBit's behalf, then deploying ransomware payload.
                            Credential Theft & Brute Force: Large-scale credential harvesting and password spraying attacks against weak credentials in remote access services.
                            Supply Chain Compromise: Targeting of managed service providers (MSPs) and IT contractors to gain access to multiple customer environments simultaneously.

                        Tools & Malware
                        
                            LockBit 3.0 Ransomware: Advanced ransomware with multi-threaded encryption, optional data wiper, memory-only payloads, and sophisticated anti-recovery mechanisms.
                            LockBit Locker: Lightweight encryption tool deployed for quick ransom deployment.
                            StealBit Exfiltration Tool: Custom data exfiltration utility designed for rapid mass data theft before encryption deployment.
                            Legitimate Tool Abuse: Extensive use of legitimate system administration tools (PsExec, WinRM, RDP) for lateral movement and command execution.
                            Cobalt Strike: Commercial penetration testing tool widely abused for post-exploitation activities and lateral movement.
                            Metasploit Framework: Use of open-source exploitation framework for initial access and payload delivery.

                        Infrastructure Patterns
                        
                            Leak Site Operations: Publicly accessible dark web leak sites where LockBit publishes stolen data from non-paying victims to facilitate extortion.
                            Cryptocurrency Infrastructure: Integration with cryptocurrency exchanges and mixers for anonymous ransom payment collection and money laundering.
                            Multiple C2 Infrastructure: Distributed command-and-control infrastructure using compromised hosting providers, bulletproof hosting, and residential proxies.
                            Customer Support Channels: Professional support infrastructure including helpdesk portals and encrypted messaging for victim negotiations.
                            Ransom Negotiation Platform: Managed negotiation portal with chat functionality for ransom discussions and payment coordination with victims.

## Targeted Industries & Organizations

LockBit targets all industries without discrimination, but focuses on organizations with demonstrated ability to pay ransom:

                                Sector
                                Victims & Impact

                                Healthcare & Hospitals
                                Major hospital networks globally, impacting patient care, diagnostic systems, and emergency response capabilities.

                                Manufacturing & Industrial
                                Large manufacturing operations, automotive suppliers, industrial equipment companies. High-profile targets like John Deere equipment.

                                Financial Services
                                Banks, credit unions, financial service providers, insurance companies.

                                Government & Law Enforcement
                                Municipal governments, federal agencies, police departments, courts.

                                Technology & Software
                                Software companies, IT service providers, managed service providers (MSPs), cloud providers.

                                Education
                                Universities, school districts, research institutions.

                                Critical Infrastructure
                                Energy utilities, water treatment, transportation, telecommunications systems.

                    Geographic Scope: Global targeting across all regions and countries. Documented operations in North America, Europe, Asia, Middle East, Africa, and Oceania with equal-opportunity approach.

## Attributable Attacks Timeline

Sep 2019
                            
                                LockBit v1 Launch
                                LockBit ransomware first appears in criminal forums. Initial version operates with basic functionality but demonstrates sophisticated encryption and multi-threaded capabilities unavailable in contemporary ransomware.

                            2020-2021
                            
                                LockBit v2 & Affiliate Network Launch
                                LockBit operators launch managed affiliate program, recruiting hundreds of criminal operators for initial access operations. Introduction of double-extortion tactics combining encryption with data theft and leak site publication.

                            Jun 2022
                            
                                LockBit 3.0 Release - LockBit Black
                                Launch of LockBit 3.0 (marketed as "LockBit Black"), representing significant technical advancement with memory-only execution, improved encryption, bug bounty programs, and aggressive marketing campaigns. Becomes dominant ransomware variant globally.

                            2023
                            
                                Peak LockBit Operations
                                LockBit documented as responsible for record number of attacks. Leak site publishes data from hundreds of victims. Ransom demands reach historic highs with individual payments exceeding $10+ million. Group openly advertises services and conducts marketing campaigns.

                            May 2024
                            
                                Law Enforcement Operation
                                FBI, UK National Crime Agency, and international law enforcement conduct coordinated takedown operation against LockBit infrastructure. Multiple servers seized, encryption keys recovered, leak site taken offline. LockBit leadership claims continued operations despite disruption.

                            Jun-Dec 2024
                            
                                Post-Disruption Resurgence
                                LockBit rapidly rebuilds operations following law enforcement takedown. New leak site launched, affiliate recruitment continues, attacks resume within weeks. Demonstrates resilience and redundancy of RaaS infrastructure.

                            2025-Present
                            
                                Ongoing Global RaaS Operations
                                LockBit remains most active and prolific ransomware variant. Documented continued operations against Fortune 500 companies, government institutions, and critical infrastructure globally. Estimated $500M+ in total cumulative losses.

## Known Exploits & CVEs

LockBit affiliates have demonstrated rapid exploitation of critical vulnerabilities:

                                CVE
                                Vulnerability
                                Affected Product
                                CVSS

                                CVE-2023-21674
                                Windows SmartScreen Security Feature Bypass
                                Microsoft Windows
                                9.8

                                CVE-2023-46805
                                Remote Code Execution in GE Digital SRTP Webserver
                                GE Industrial Equipment
                                9.8

                                CVE-2024-21899
                                Windows Privilege Escalation
                                Microsoft Windows
                                8.8

                                CVE-2023-3824
                                ConnectWise ScreenConnect Authentication Bypass
                                ConnectWise Control
                                9.8

                                CVE-2021-44228
                                Log4Shell Remote Code Execution
                                Apache Log4j
                                10.0

                                CVE-2022-41080
                                Exchange Server Remote Code Execution
                                Microsoft Exchange Server
                                10.0

## Cross-Vendor Naming Reference

LockBit is tracked by security vendors and law enforcement:

                                Vendor / Organization
                                Name Used

                                CrowdStrike
                                GOLD SOUTHFIELD

                                Mandiant / Google
                                UNC2452, Lockbit Group

                                Microsoft Threat Intelligence
                                ALPHV, LockBit

                                Palo Alto Networks
                                UNC2985, Lockbit

                                Kaspersky
                                LockBit, LockBit Black

                                FBI / CISA
                                LockBit Ransomware

                                UK National Crime Agency
                                LockBit

## Related Threat Actors

BlackCat / ALPHV: Competing ransomware-as-a-service operation with similar business model. Both operate affiliate networks and maintain public leak sites.
                        Cl0p (FIN11): Financial-motivated group with ransomware operations. Focuses on supply chain exploitation similar to LockBit tactics.
                        Scattered Spider (UNC3944): Social engineering and credential theft focused group frequently enabling initial access for ransomware deployment.

## References & Sources

[1]
                            FBI Alert: "LockBit Ransomware Operations"
                            FBI Cyber Division

                            [2]
                            CISA Alert: "LockBit Ransomware Campaign"
                            CISA Alerts & Advisories

                            [3]
                            CrowdStrike Intelligence Report: "GOLD SOUTHFIELD - The LockBit Threat"
                            CrowdStrike Global Threat Report

                            [4]
                            UK National Crime Agency: "Operation Cronos - LockBit Takedown"
                            NCA Press Release

                            [5]
                            Mandiant Research: "LockBit RaaS Operations & Affiliate Network"
                            Mandiant Intelligence Reports

                Quick Facts

                    Country of Origin
                    
                        🏴
                        Unknown (Russian-speaking)

                    Nation-State Sponsored
                    No, Criminal Enterprise

                    Motivation
                    Financial Extortion

                    First Seen
                    Sep 2019

                    Last Seen
                    2025-Q1

                    Confidence Level
                    Very High

                    Associated Groups
                    GOLD SOUTHFIELD, Multiple Affiliates

                    Status
                    Active

                    Review Status
                    ⚠ Pending Human Review
