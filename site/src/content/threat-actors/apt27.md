---
name: APT27
aliases:
  - "Emissary Panda"
  - "Lucky Mouse"
  - "HIPPOs"
affiliation: China
motivation: Espionage
status: active
reviewStatus: under_review
generatedBy: dangermouse-bot
generatedDate: 2026-04-13
---
## Overview

APT27 (also known as Emissary Panda, Lucky Mouse, or HIPPOs) is a Chinese state-sponsored advanced persistent threat group attributed to China's Ministry of State Security (MSS). Operating since at least 2010, APT27 conducts sophisticated, targeted espionage campaigns primarily focusing on foreign governments, aerospace contractors, energy companies, and defense establishments. The group is distinguished by their focus on specific high-value targets and their use of watering hole attacks combined with sophisticated exploitation techniques.

                    The group has gained notoriety for their involvement in multiple documented campaigns targeting U.S. government agencies, NATO allies, Indian government networks, and technology companies. APT27 demonstrates advanced tradecraft including custom malware development, zero-day exploitation, and sophisticated command-and-control infrastructure. The group operates with a strategic focus on aerospace, defense, energy, and political intelligence collection supporting China's strategic interests.

                    As of 2025, APT27 continues active operations against government and defense targets with particular focus on aviation, aerospace, and critical infrastructure sectors. The group has demonstrated willingness to adapt tactics in response to defensive measures and public exposure, remaining one of the most persistent and sophisticated Chinese-attributed APT threats.

## Tactics, Techniques & Procedures (TTPs)

MITRE ATT&CK Techniques
                        
                            Initial Access:
                            
                                T1583: Acquire Infrastructure
                                T1589: Gather Victim Identity Information
                                T1598: Phishing for Information
                                T1190: Exploit Public-Facing Application
                            
                            Execution & Persistence:
                            
                                T1059.001: PowerShell
                                T1053.005: Scheduled Task/Job
                                T1547.001: Registry Run Keys
                            
                            Defense Evasion & Lateral Movement:
                            
                                T1036: Masquerading
                                T1070: Indicator Removal
                                T1570: Lateral Tool Transfer
                            
                            Exfiltration:
                            
                                T1041: Exfiltration Over C2 Channel
                                T1020: Automated Exfiltration

                        Common Attack Vectors
                        
                            Watering Hole Attacks: Compromise of industry-specific websites frequented by target organizations to deliver malware via drive-by downloads and exploit code.
                            Spear-Phishing with Malicious Documents: Highly targeted phishing emails with weaponized Office documents exploiting known CVEs in Microsoft Office and Adobe products.
                            Zero-Day Exploitation: Development and deployment of zero-day exploits against widely-deployed enterprise software to establish initial access.
                            Supply Chain Targeting: Compromise of software vendors and service providers to distribute malware to multiple downstream organizations.
                            VPN & Remote Access Exploitation: Targeting of VPN appliances and remote access solutions to gain network access without user interaction.

                        Tools & Malware
                        
                            ICEFOG Backdoor: Custom developed remote access trojan with extensive command execution and data exfiltration capabilities.
                            ScanBox Framework: Reconnaissance framework for victim profiling and information gathering before actual exploitation.
                            Backdoor.APT.C_36: Advanced multi-stage backdoor providing command execution and persistence mechanisms.
                            Custom WebShells: Proprietary web shells deployed on compromised servers for persistent access and lateral movement.
                            Mimikatz & Custom Tools: Credential harvesting and lateral movement tools for privilege escalation and network compromise.

                        Infrastructure Patterns
                        
                            Bulletproof Hosting: Leased infrastructure from bulletproof hosting providers with minimal compliance requirements.
                            Fast Flux Networks: Rapid DNS and IP rotation to evade network-based blocking and signature detection.
                            Compromised Infrastructure: Leveraging of previously compromised servers for C2 communications and malware hosting.
                            Domain Hosting via Chinese Registrars: Registration of C2 domains through Chinese registrars to minimize abuse response.

## Targeted Industries & Organizations

APT27 focuses on high-value government and strategic industry targets:

                                Sector
                                Notable Targets

                                Government & Diplomacy
                                US federal agencies, Indian government networks, NATO allies, diplomatic missions, political parties

                                Aerospace & Aviation
                                Aircraft manufacturers, commercial airlines, aviation authorities, aerospace contractors

                                Defense Industrial Base
                                Defense contractors, military research institutions, weapons system manufacturers

                                Energy & Utilities
                                Oil and gas companies, power generation operators, critical infrastructure

                                Technology
                                Software vendors, IT service providers, semiconductor manufacturers

## Attributable Attacks Timeline

2010-2013
                            
                                Early Operations & ICEFOG Development
                                APT27 initiates targeted espionage campaigns against Indian government and aerospace organizations. Develops ICEFOG backdoor and establishes command-and-control infrastructure.

                            2013-2015
                            
                                Aerospace & Defense Sector Targeting
                                APT27 expands targeting to US aerospace contractors and NATO defense establishments. Conducts multiple watering hole attacks against industry-specific websites.

                            2015-2017
                            
                                ScanBox Framework Deployment
                                APT27 develops and deploys ScanBox reconnaissance framework targeting diplomatic entities and government organizations. Gathers extensive victim intelligence before exploitation.

                            2017-2019
                            
                                Zero-Day Exploitation & Persistence
                            APT27 exploits multiple zero-day vulnerabilities in enterprise applications. Develops advanced persistence mechanisms and command-and-control evasion techniques.

                            2019-2021
                            
                                Supply Chain & SaaS Targeting
                                APT27 begins targeting software vendors and cloud service providers to gain leverage for downstream organization compromise. Expands focus to cloud infrastructure.

                            2021-2023
                            
                                Modern Infrastructure Targeting
                                APT27 adapts to cloud-native environments and modern IT infrastructure. Continues targeting diplomatic and government entities with refined techniques.

                            2023-2025

                                Ongoing Aviation & Aerospace Campaigns Likely
                                APT27 continues active operations against aviation and aerospace sectors. Maintains focus on government espionage with evolved techniques.

## Known Exploits & CVEs

APT27 has exploited numerous known vulnerabilities in enterprise applications:

                                CVE
                                Vulnerability
                                Affected Product
                                CVSS

                                CVE-2012-1856
                                RCE in SharePoint
                                Microsoft SharePoint 2010
                                9.3

                                CVE-2013-1347
                                Privilege Escalation in Windows
                                Microsoft Windows XP-7
                                7.2

                                CVE-2014-1761
                                RCE in Word
                                Microsoft Office 2010-2013
                                9.3

                                CVE-2015-4902
                                Flash Player RCE
                                Adobe Flash (multiple versions)
                                9.8

                                CVE-2018-8373
                                RCE in PowerPoint
                                Microsoft Office 2010-2019
                                8.8

                                CVE-2020-0687
                                Privilege Escalation in Windows
                                Microsoft Windows 10
                                7.8

## Cross-Vendor Naming Reference

Vendor / Organization
                                Name Used

                                Mandiant
                                APT27

                                CrowdStrike
                                Emissary Panda

                                Symantec
                                Lucky Mouse

                                Kaspersky
                                APT27 / Emissary Panda

                                MITRE ATT&CK
                                Group G0027

                                Palo Alto Networks
                                APT27

                                F-Secure
                                HIPPOs

## Related Threat Actors

APT1, APT10, APT40, APT41: Other Chinese-attributed APT groups conducting parallel espionage operations with overlapping targeting profiles.
                        APT31 (Zirconium): Operationally distinct Chinese APT group targeting similar government and defense sectors.

## References & Sources

[1]
                            Mandiant: APT27 (Emissary Panda) Campaign Analysis

                            [2]
                            CrowdStrike: Emissary Panda Threat Intelligence

                            [3]
                            MITRE ATT&CK: APT27 (Group G0027)

                            [4]
                            Symantec: Lucky Mouse (APT27) Research

                            [5]
                            Kaspersky: APT27 Threat Intelligence

                            [6]
                            F-Secure: HIPPOs (APT27) Analysis

                            [7]
                            Palo Alto Networks: APT27 Research Materials

                            [8]
                            Australian ACSC: APT27 Targeting Defence Sector

                Quick Facts

                    Country of Origin
                    
                        🇨🇳
                        China (MSS)

                    Nation-State Sponsored
                    Yes

                    Motivation
                    Espionage

                    First Seen
                    2010

                    Last Seen
                    2025 (Active)

                    Confidence Level
                    Very High

                    Associated Groups
                    China MSS

                    Review Status
                    ⚠ Pending Human Review
