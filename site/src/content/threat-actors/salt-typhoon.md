---
name: "Salt Typhoon | Threatpedia"
aliases: []
affiliation: Unknown
motivation: Unknown
status: unknown
reviewStatus: under_review
generatedBy: dangermouse-bot
generatedDate: 2026-04-13
---
## Overview

Salt Typhoon is a sophisticated Chinese state-sponsored threat actor attributed to China's Ministry of State Security (MSS). Operating since at least 2022, Salt Typhoon has become one of the most significant threats to US telecommunications infrastructure, conducting widespread espionage operations targeting major US telecom providers. The group's focus on communications infrastructure signals strategic intent to gather signals intelligence (SIGINT) and potentially enable future offensive operations during geopolitical crises.

                    Salt Typhoon specializes in targeting Internet Service Providers (ISPs) and telecommunications companies to harvest metadata, intercept communications, and establish persistent backdoors within critical communications networks. The group has demonstrated sophisticated understanding of telecom network architecture, billing systems, and customer databases. In 2024, it was revealed that Salt Typhoon had compromised multiple major US telecom carriers, gaining access to customer call records, location data, and potential wiretapping capabilities.

                    The group operates with a patient, methodical approach, establishing deep network access and maintaining low visibility. Salt Typhoon's toolset includes custom backdoors (GhostSpider, Masol RAT) and reliance on legitimate remote access tools. The group's activities represent a critical national security concern, as telecommunications infrastructure forms the backbone of US emergency communications, financial systems, and government operations.

## Tactics, Techniques & Procedures (TTPs)

MITRE ATT&CK Techniques
                        
                            Initial Access:
                            
                                T1566.002: Phishing - Spearphishing Link
                                T1190: Exploit Public-Facing Application
                                T1199: Trusted Relationship
                                T1195: Supply Chain Compromise
                            
                            Persistence:
                            
                                T1098.001: Account Manipulation
                                T1547.001: Boot or Logon Autostart Execution
                                T1547.011: Plist Modification
                            
                            Defense Evasion:
                            
                                T1078: Valid Accounts
                                T1562.008: Impair Defenses - Disable Logging
                                T1140: Deobfuscate/Decode Files or Information
                            
                            Collection:
                            
                                T1557.002: ARP Cache Poisoning
                                T1040: Network Sniffing
                                T1123: Audio Capture
                            
                            Exfiltration:
                            
                                T1041: Exfiltration Over C2 Channel
                                T1020: Automated Exfiltration

                        Common Attack Vectors
                        
                            ISP/Telecom Targeting: Direct targeting of Internet Service Provider infrastructure through exploitation of public-facing applications and supply chain compromises affecting telecom equipment vendors.
                            Vendor Relationship Exploitation: Compromise of trusted vendors and managed service providers serving telecom providers, enabling access to multiple customer networks simultaneously.
                            Credential Harvesting: Large-scale credential theft targeting telecom employee accounts, enabling lateral movement within carrier networks and access to sensitive customer data systems.
                            Billing System Compromise: Targeting of telecom billing and customer database systems to harvest call detail records (CDRs), location data, and customer information.
                            Network Access Device Exploitation: Exploitation of routers, switches, and load balancers within telecom networks to establish persistent backdoor access.

                        Tools & Malware
                        
                            GhostSpider: Custom web shell deployed on compromised telecom infrastructure. Provides persistent remote access and command execution capabilities.
                            Masol RAT: Remote access trojan used for lateral movement and system reconnaissance within victim networks. Supports command execution and file transfer.
                            Custom Backdoors: Various custom-developed backdoors designed to maintain persistent access to telecom network infrastructure with minimal detection.
                            Legitimate Remote Access Tools: Abuse of TeamViewer, AnyDesk, and similar remote desktop tools for persistent access to compromised systems.
                            Network Credential Harvesting: Mimikatz and similar tools for credential extraction from compromised telecom employee systems.
                            Data Exfiltration Tools: Custom tools designed to extract call detail records and customer location data from telecom databases.

                        Infrastructure Patterns
                        
                            Compromised Telecom Infrastructure: Use of compromised infrastructure within telecom networks for C2 communications, leveraging legitimate telecom network paths.
                            Legitimate Cloud Services Abuse: Potential use of legitimate cloud services for C2 and data exfiltration, blending malicious traffic with normal business communications.
                            Domain Hijacking: Suspected hijacking of legitimate ISP domains and subdomain creation to host malicious infrastructure.
                            DNS Tunneling: Suspected DNS-based command-and-control communications, difficult to detect within legitimate DNS traffic.

## Targeted Industries & Organizations

Salt Typhoon's targeting strategy focuses on critical US telecommunications infrastructure:

                                Sector
                                Notable Targets / Impact

                                Telecommunications
                                Major US telecom carriers (AT&T, Verizon, T-Mobile, others), ISPs, telecommunications equipment vendors.

                                Internet Service Providers
                                Regional and national ISPs, backbone providers, network infrastructure companies.

                                Equipment Vendors
                                Telecom equipment manufacturers, managed service providers serving telecom sector.

                                Government Communications
                                US government agencies leveraging commercial telecom infrastructure, Federal law enforcement communications networks.

                                Defense Industrial Base
                                Defense contractors relying on telecommunications infrastructure, secure communications providers.

                                Financial Services
                                Financial institutions dependent on telecommunications networks for trading and transaction systems.

                    Geographic Focus: Primary targeting of United States telecommunications infrastructure, with particular concentration in major metropolitan areas and backbone network providers serving government and military facilities.

## Attributable Attacks Timeline

2022
                            
                                Initial ISP Targeting Campaign
                                Salt Typhoon begins systematic compromise of US ISP infrastructure, establishing initial network footholds through public-facing application exploitation and supply chain attacks.

                            2022-2023
                            
                                Expansion to Major Telecom Carriers
                                Group successfully compromises multiple major US telecommunications carriers, establishing persistent backdoor access to network infrastructure and billing systems.

                            2023
                            
                                Call Detail Record Harvesting
                                Investigations reveal Salt Typhoon harvested extensive call detail records from compromised telecom infrastructure, including calls to government agencies and military installations.

                            Oct 2024
                            
                                Public Disclosure of Telecom Breach
                                US government agencies publicly disclose that Salt Typhoon has compromised major US telecom providers, affecting millions of customers. Group had access to location data, call records, and text messages.

                            Nov-Dec 2024
                            
                                Continued Infrastructure Access
                                Authorities confirm Salt Typhoon maintains persistent access to compromised telecom networks despite notification and remediation efforts. Group continues harvesting metadata and communications data.

                            2025
                            
                                Ongoing Espionage Operations
                                Salt Typhoon remains embedded within US telecommunications infrastructure, actively harvesting signals intelligence from government communications, law enforcement, and military personnel.

                            Feb 2026
                            
                                FBI DCSNet Surveillance System Breach
                                Salt Typhoon breaches the FBI's DCSNet (DCS-3000/Red Hook) surveillance system via an ISP vendor supply chain compromise. Classified as a FISMA major incident, the breach compromised one of the most sensitive law enforcement communications intercept systems in the United States. Full Report →

## Known Exploits & CVEs

Salt Typhoon has exploited vulnerabilities in telecommunications and networking equipment:

                                CVE
                                Vulnerability
                                Affected Product
                                CVSS

                                CVE-2024-21887
                                Authentication Bypass in Ivanti Connect Secure
                                Ivanti Connect Secure VPN
                                9.8

                                CVE-2021-44228
                                Remote Code Execution in Log4j
                                Apache Log4j 2.0-2.14.1
                                10.0

                                CVE-2023-46805
                                Remote Code Execution in GE Devices
                                GE Industrial Equipment
                                9.8

                                CVE-2022-3236
                                SQL Injection in Telecom Management Systems
                                Multiple Telecom Vendors
                                9.8

                                CVE-2023-21839
                                Remote Code Execution in Cisco IOS XE
                                Cisco IOS XE Software
                                9.8

                                CVE-2024-21540
                                Privilege Escalation in Cisco Wireless Controllers
                                Cisco Catalyst 9100 Series
                                8.8

## Cross-Vendor Naming Reference

Salt Typhoon is tracked by multiple security organizations:

                                Vendor / Organization
                                Name Used

                                CISA / US Government
                                Salt Typhoon

                                Microsoft Threat Intelligence
                                Salt Typhoon

                                CrowdStrike
                                BRONZE CASUAL

                                Mandiant / Google
                                Salt Typhoon

                                Palo Alto Networks
                                LUCKYDOOR

                                Recorded Future
                                Chinese Ministry of State Security

                                FBI / NSA
                                Salt Typhoon

## Related Threat Actors

Volt Typhoon: Fellow Chinese MSS-affiliated actor with similar targeting of US critical infrastructure. Different operational focus (energy/water vs. telecommunications) suggests separate operational units.
                        APT40 (Leviathan): Chinese MSS group targeting maritime and defense sectors. Similar strategic focus on signals intelligence collection.
                        APT41: Chinese group with both espionage and financial motivations. Shares some targeting overlap in technology and telecommunications sectors.

## References & Sources

[1]
                            CISA & FBI Advisory: "Salt Typhoon Targeting U.S. Telecommunications Infrastructure"
                            CISA Alerts

                            [2]
                            FBI Public Service Announcement: "Chinese State-Sponsored Cyber Actor Salt Typhoon Compromises US Telecom Networks"
                            FBI Public Affairs

                            [3]
                            CrowdStrike Intelligence Report: "BRONZE CASUAL Telecom Infrastructure Operations"
                            CrowdStrike Threat Reports

                            [4]
                            Mandiant Research: "Salt Typhoon Targeting ISPs and Telecom Providers"
                            Mandiant Intelligence

                            [5]
                            NSA Cybersecurity Advisory: "Chinese MSS Targeting Telecom Infrastructure"
                            NSA Press Releases

                Quick Facts

                    Country of Origin
                    
                        🇨🇳
                        China

                    Nation-State Sponsored
                    Yes, Ministry of State Security (MSS)

                    Motivation
                    Espionage, Signals Intelligence

                    First Seen
                    2022

                    Last Seen
                    2026-Q1

                    Confidence Level
                    High

                    Associated Groups
                    LUCKYDOOR, BRONZE CASUAL

                    Status
                    Active

                    Review Status
                    ⚠ Pending Human Review
