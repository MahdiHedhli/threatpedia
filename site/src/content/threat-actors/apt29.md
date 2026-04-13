---
name: APT29
aliases:
  - "Cozy Bear"
  - "NOBELIUM"
  - "Midnight Blizzard"
  - "IRON HEMLOCK"
  - "UNC2452"
affiliation: Russia
motivation: Espionage
status: active
reviewStatus: under_review
generatedBy: dangermouse-bot
generatedDate: 2026-04-13
---
## Overview

APT29 is a sophisticated threat actor attributed to Russia's Foreign Intelligence Service (SVR) and has been operational since at least 2008. The group is known for targeting high-profile organizations across government, diplomatic, research, defense, and technology sectors, primarily in Europe and North America. APT29 is widely recognized for their advanced tradecraft, persistent engagement, and ability to remain undetected in victim environments for extended periods.

                    The group operates with a strategic focus on espionage objectives, conducting long-term intelligence collection campaigns against NATO member states, European governments, diplomatic missions, think tanks, and research institutions. APT29 is particularly notable for their involvement in several major incidents, including the 2020 SolarWinds supply chain compromise (via the SUNBURST malware) and ongoing phishing campaigns targeting European diplomacy and cloud infrastructure.

                    APT29's operational approach combines spear-phishing with weaponized attachments, supply chain compromises, cloud exploitation, and credential theft. The group is known for rapid adaptation of tactics, particularly in response to public disclosures of their tools and techniques. As of 2024-2025, APT29 continues to conduct high-volume phishing campaigns against European governments, with new malware families such as GRAPELOADER and WINELOADER emerging as part of their ongoing arsenal.

## Tactics, Techniques & Procedures (TTPs)

MITRE ATT&CK Techniques
                        
                            Initial Access:
                            
                                T1566.002: Phishing - Spearphishing Link
                                T1566.001: Phishing - Spearphishing Attachment
                                T1199: Trusted Relationship
                                T1195: Supply Chain Compromise
                                T1078.004: Valid Accounts - Cloud Accounts
                            
                            Execution:
                            
                                T1059.001: Command and Scripting Interpreter - PowerShell
                                T1059.003: Command and Scripting Interpreter - Windows Command Shell
                                T1203: Exploitation for Client Execution
                            
                            Defense Evasion:
                            
                                T1550: Use Alternate Authentication Material
                                T1656: Impersonation
                                T1562.008: Impair Defenses - Disable Logging
                                T1140: Deobfuscate/Decode Files or Information
                            
                            Credential Access:
                            
                                T1110.004: Brute Force - Credential Stuffing
                                T1556: Modify Authentication Process
                                T1187: Forced Authentication
                            
                            Exfiltration:
                            
                                T1041: Exfiltration Over C2 Channel
                                T1020: Automated Exfiltration

                        Common Attack Vectors
                        
                            Spear-phishing Campaigns: Highly targeted phishing emails impersonating government entities, diplomatic services, or trusted partners. Email attachments often contain weaponized documents (Office, PDF, WinRAR) or links to malicious infrastructure.
                            Password Spraying & Credential Compromise: Large-scale password spray attacks against cloud environments (Azure, Office 365) to identify valid credentials and weak passwords, often combined with MFA bypass techniques.
                            Supply Chain Exploitation: Compromise of software development pipelines and legitimate software vendors to distribute malware at scale (e.g., SolarWinds SUNBURST).
                            Cloud Infrastructure Targeting: Exploitation of cloud tenant enumeration, device enrollment, federation services (ADFS), and token abuse to gain access to cloud environments.
                            Exploitation of Public Vulnerabilities: Rapid exploitation of zero-days and publicly disclosed CVEs (ProxyLogon, ProxyShell, Exchange RCEs, WinRAR CVE-2023-38831).

                        Tools & Malware
                        
                            SUNBURST: Sophisticated backdoor deployed via SolarWinds Orion updates. Designed for stealthy command-and-control communication and lateral movement.
                            SUNSHELL/CORESHELL: Second-stage payloads deployed post-SUNBURST compromise for deeper access and data exfiltration.
                            GRAPELOADER: New backdoor family identified in 2025 phishing campaigns targeting European diplomats. Delivered via weaponized attachments.
                            WINELOADER: Infostealer malware used in recent campaigns to harvest credentials and system information.
                            FOGGYWEB: Custom ADFS-focused malware for federation exploitation and token theft.
                            MAGICWEB: Malware targeting Microsoft ADFS infrastructure to intercept and manipulate authentication tokens.
                            Custom C# Backdoors: Lightweight, custom-compiled backdoors for command execution and lateral movement.
                            Living-off-the-Land Tools: Extensive use of PowerShell, WMI, PsExec, and native Windows utilities for post-compromise activities.

                        Infrastructure Patterns
                        
                            Residential Proxies: Use of residential proxy infrastructure to obfuscate command-and-control communications and make attribution more difficult.
                            Legitimate Cloud Services: Abuse of Microsoft Teams, SharePoint, and other cloud collaboration platforms for C2 communications.
                            Domain Fronting: Leveraging legitimate web services and CDNs to hide malicious traffic.
                            Email-based C2: Use of compromised email accounts and OAuth application permissions for command-and-control.
                            Fast Flux Networks: Rapid rotation of DNS records and IP addresses to evade network-based detection.

## Targeted Industries & Organizations

APT29 targets a broad range of sectors aligned with Russian strategic intelligence interests:

                                Sector
                                Notable Targets / Geographic Focus

                                Government & Diplomacy
                                European foreign ministries, NATO member states, US federal agencies, diplomatic missions. Heavy targeting of EU and NATO countries.

                                Research & Academia
                                Think tanks, universities, research institutions (particularly policy research focused on Russia, energy security, defense).

                                Defense & Aerospace
                                Defense contractors, military research institutions, aerospace companies.

                                Energy
                                Utilities, energy research organizations, strategic infrastructure.

                                Technology & Cloud
                                Cloud service providers, software vendors, SaaS platforms (Salesforce, Snowflake), open-source ecosystems.

                                Healthcare
                                Limited targeting; primarily during COVID-19 pandemic for intelligence on vaccine research.

                    Geographic Preference: Primary targeting of NATO members and EU states (particularly Germany, Poland, Czech Republic), as well as North American government and research institutions.

## Attributable Attacks Timeline

Dec 2013
                            
                                US State Department Network Breach
                                APT29 compromised US State Department networks, maintaining access for months. Significant espionage operation targeting diplomatic communications.

                            2015-2016
                            
                                Democratic National Committee (DNC) Compromise
                                APT29 breached DNC networks alongside APT28. Conducted targeted espionage of Democratic Party communications and opposition research.

                            2019-2020
                            
                                COVID-19 Vaccine Research Targeting
                                NCSC, CISA, and FBI confirmed APT29 targeted US and UK vaccine research institutions and health organizations during pandemic response.

                            Mar 2020
                            
                                SolarWinds Supply Chain Compromise (SUNBURST)
                                APT29 compromised SolarWinds software development pipeline, embedding SUNBURST backdoor in Orion updates. Affected 18,000+ customers including US government, Fortune 500 companies, and critical infrastructure. Described as "most sophisticated attack the world has ever seen."

                            Oct 2024
                            
                                RDP Configuration Distribution Campaign
                                Microsoft reported APT29 distributed signed Remote Desktop Protocol (RDP) configuration files to thousands of individuals across 100+ organizations in government, academia, defense, and NGOs.

                            Jan-Mar 2025
                            
                                GRAPELOADER / WINELOADER Phishing Campaign
                                Check Point Research identified new wave of targeted phishing attacks against European governments and diplomatic entities. Attackers impersonated major EU foreign ministry wine tasting invitations, leading to deployment of GRAPELOADER backdoor and WINELOADER infostealer.

                            Feb 2025 - Present
                            
                                European Government Cloud Infrastructure Targeting Suspected - Not Confirmed
                                Based on tactics alignment and targeting patterns, APT29 is suspected of conducting ongoing campaigns to compromise European government cloud environments via token theft, MFA bypass, and federation exploitation techniques. Attribution pending official confirmation.

## Known Exploits & CVEs

APT29 has demonstrated rapid exploitation of both zero-days and publicly disclosed vulnerabilities:

                                CVE
                                Vulnerability
                                Affected Product
                                CVSS

                                CVE-2021-26855
                                Server-Side Request Forgery (SSRF) in Exchange Server
                                Microsoft Exchange Server 2010-2019
                                9.8

                                CVE-2021-27065
                                Remote Code Execution via Exchange Server
                                Microsoft Exchange Server 2010-2019
                                9.8

                                CVE-2021-34473
                                ProxyShell: Remote Code Execution via Exchange
                                Microsoft Exchange Server 2010-2019
                                9.8

                                CVE-2021-34523
                                ProxyShell: Elevation of Privilege in Exchange
                                Microsoft Exchange Server 2010-2019
                                9.8

                                CVE-2021-31207
                                ProxyShell: RCE via Exchange Unauth
                                Microsoft Exchange Server 2010-2019
                                9.8

                                CVE-2023-38831
                                Arbitrary Code Execution in WinRAR
                                WinRAR (all versions before 6.23)
                                8.8

                                CVE-2023-0640
                                Remote Code Execution in Adobe Reader/Acrobat
                                Adobe Acrobat Reader / Acrobat
                                8.8

                                CVE-2023-42793
                                Authentication Bypass in JetBrains TeamCity
                                JetBrains TeamCity
                                9.8

                                CVE-2021-36934
                                Elevation of Privilege in Windows SAM
                                Microsoft Windows
                                7.0

## Cross-Vendor Naming Reference

APT29 is tracked by numerous threat intelligence vendors and government agencies under various designations:

                                Vendor / Organization
                                Name Used

                                MITRE ATT&CK
                                Group G0016

                                CrowdStrike
                                COZY BEAR

                                Microsoft
                                Midnight Blizzard, YTTRIUM

                                Mandiant / Google
                                APT29, Dark Halo

                                Kaspersky
                                The Dukes

                                Symantec
                                IRON RITUAL, IRON HEMLOCK

                                F-Secure
                                NobleBaron

                                Recorded Future
                                UNC2452, NOBELIUM

                                Palo Alto Networks
                                UNC3524

                                Cybereason
                                Blue Kitsune

                                US Government (CISA/NSA)
                                NOBELIUM

## Related Threat Actors

APT28 (Fancy Bear): Fellow Russian-attributed APT group. While operationally distinct, both groups have targeted overlapping victim sets (e.g., DNC in 2016). Different operational patterns and capabilities suggest separate organizational structures within Russian intelligence.
                        Turla/Snake: Another Russian-attributed APT with similar strategic focus on government and research sectors. Less direct overlap in recent operations but comparable target profiles.

## References & Sources

[1]
                            MITRE ATT&CK: APT29 (Group G0016)

                            [2]
                            Microsoft Security Blog: Midnight Blizzard (APT29) Guidance

                            [3]
                            CISA Advisory: SVR Cyber Actors Adapt Tactics for Initial Cloud Access

                            [4]
                            Check Point Research: APT29 Phishing Campaign Targeting European Diplomacy

                            [5]
                            Check Point Research: Renewed APT29 Phishing Campaign (2025)

                            [6]
                            Huntress: Cozy Bear (APT29) Threat Actor Profile

                            [7]
                            Picus Security: APT29 Evolution, Techniques, and Cyber Attacks

                            [8]
                            Dark Relay: APT29 Operations, IOCs, and Detection Strategies

                            [9]
                            Malpedia: APT29 Threat Actor Profile

                Quick Facts

                    Country of Origin
                    
                        🇷🇺
                        Russia (SVR)

                    Nation-State Sponsored
                    Yes

                    Motivation
                    Espionage

                    First Seen
                    2008

                    Last Seen
                    2025 (Active)

                    Confidence Level
                    High

                    Associated Groups
                    NOBELIUM (Recorded Future)

                    Status
                    ACTIVE
