---
name: APT1
aliases:
  - "Comment Crew"
  - "PLA Unit 61398"
  - "STUXNET"
  - "GhostNet"
affiliation: China
motivation: Espionage
status: active
reviewStatus: under_review
generatedBy: dangermouse-bot
generatedDate: 2026-04-13
---
## Overview

APT1 is one of the earliest publicly attributed advanced persistent threat groups, publicly identified by Mandiant in February 2013 as being based in Shanghai, China and operating under the direct authority of China's People's Liberation Army (PLA) Unit 61398. The group represents the first major instance of a threat actor being unambiguously attributed to a specific country's military apparatus by a private security firm. APT1 operates with strategic focus on long-term espionage objectives against United States government agencies, defense contractors, and multinational corporations.

                    Operating since at least 2006, APT1 has conducted some of the most extensive documented espionage campaigns targeting intellectual property theft, government secrets, and strategic business information. The group's campaigns have affected organizations in dozens of countries, with particular concentration on the US defense industrial base. APT1 is known for sophisticated operational security, use of public exploit code, and ability to maintain persistence in victim networks for extended periods (6+ months).

                    As of 2025, APT1 continues active operations with evolved capabilities and refined operational tradecraft. The group has adapted to increased attribution and defensive measures, employing more sophisticated persistence mechanisms and lateral movement techniques. APT1 represents a sustained campaign of intelligence collection supporting China's military-industrial advancement and strategic competitive advantage against the United States.

## Tactics, Techniques & Procedures (TTPs)

MITRE ATT&CK Techniques
                        
                            Initial Access:
                            
                                T1566.002: Phishing - Spearphishing Attachment
                                T1566.001: Phishing - Spearphishing Link
                                T1199: Trusted Relationship
                                T1190: Exploit Public-Facing Application
                            
                            Execution & Persistence:
                            
                                T1059.001: Command Shell - PowerShell
                                T1059.003: Command Shell - Windows Command Shell
                                T1547.001: Boot Autostart - Registry Run Keys
                                T1546.007: Hook Registry
                            
                            Defense Evasion & Credential Access:
                            
                                T1036: Masquerading
                                T1110.001: Brute Force - Password Guessing
                                T1055: Process Injection
                                T1134: Process Hollowing
                            
                            Exfiltration:
                            
                                T1041: Exfiltration Over C2 Channel
                                T1020: Automated Exfiltration
                                T1030: Data Transfer Size Limits

                        Common Attack Vectors
                        
                            Targeted Spear-Phishing: Highly personalized phishing emails to engineers, scientists, and executives. Attachments often exploit known vulnerabilities (CVE-2010-3740, CVE-2012-0003) in Office applications and PDF readers.
                            Watering Hole Attacks: Compromise of industry-specific websites frequented by target organizations to distribute malware via drive-by downloads.
                            VPN Exploitation: Targeting of remote access VPN solutions to gain foothold in corporate networks without requiring user interaction.
                            Supply Chain Compromise: Compromise of software vendors and service providers to distribute malware to multiple target organizations.
                            Exploitation of Public Vulnerabilities: Rapid weaponization of disclosed CVEs in widely-deployed enterprise software (Adobe Reader, Windows, Internet Explorer).

                        Tools & Malware
                        
                            Poison Ivy RAT: Remote access trojan frequently deployed for command execution and interactive sessions with victim systems.
                            Ghost RAT (Gh0st RAT): Chinese-developed remote access trojan providing extensive command execution and data exfiltration capabilities.
                            Derusbi Backdoor: Sophisticated multi-platform malware providing rootkit-like capabilities and deep system access.
                            3102 Malware: File transfer trojan used specifically for bulk data exfiltration from compromised systems.
                            Custom Encoding/Decoding Tools: Proprietary tools for obfuscating malware communications and evading IDS detection.
                            Web Shells: Custom-developed web shells for persistent access to compromised web servers and file transfer capabilities.

                        Infrastructure Patterns
                        
                            Chinese-based Command & Control: C2 servers predominantly located in China or hosted by Chinese ISPs, registrations via Chinese registrars.
                            Proxied Communications: Use of compromised third-party servers and proxies to obfuscate the origin of C2 traffic.
                            Public Exploit Code: Leveraging of publicly available exploit code and publicly released malware families (rather than exclusively custom tools).
                            Fast Flux Domains: Use of dynamic DNS and rapid IP rotation to evade network-based blocking and signature detection.
                            SSL Certificate Abuse: Acquisition of valid SSL certificates for C2 domains to evade traffic inspection and content filtering.

## Targeted Industries & Organizations

APT1 targets organizations aligned with US government interests and strategic national security concerns:

                                Sector
                                Notable Targets

                                Defense Industrial Base
                                Lockheed Martin, Northrop Grumman, Raytheon, Boeing, General Dynamics, Booz Allen Hamilton

                                Government Agencies
                                US DoD, State Department, Commerce Department, FBI, diplomatic missions

                                Aerospace & Satellite
                                Space agencies, satellite manufacturers, launch providers, orbital mechanics companies

                                Energy & Utilities
                                Oil and gas companies, power generation facilities, grid operators

                                Technology & IT
                                Software vendors, semiconductor companies, IT service providers, research institutions

                                International Organizations
                                Companies and agencies in Europe, India, Canada, Australia, Japan, and South Korea

                    Strategic Focus: Intellectual property theft supporting PLA Unit 61398's research priorities. Targeting designed to provide China with advanced technology insights and competitive intelligence across military-relevant sectors.

## Attributable Attacks Timeline

2006-2009
                            
                                Early Operations and Capability Development
                                APT1 (Comment Crew) initiates targeted espionage operations. Group develops expertise in spear-phishing and malware deployment. Infrastructure established in Guangdong Province, Shanghai, China.

                            2009-2010
                            
                                Lockheed Martin & Defense Contractor Targeting
                                APT1 conducts extensive campaigns targeting Lockheed Martin, Northrop Grumman, and other defense contractors. Steals technical data on military systems, advanced weapons platforms, and cyber defense capabilities.

                            2011-2012
                            
                                Global Expansion - Multi-Sector Targeting
                                APT1 broadens operations to target multinational corporations, research institutions, and government agencies across Europe, Japan, South Korea, India, and Canada. Focusing on technology transfer and competitive intelligence.

                            Feb 2013
                            
                                Mandiant Attribution Report - Public Disclosure
                                Mandiant publishes comprehensive attribution report formally identifying APT1 as PLA Unit 61398 based in Shanghai. Report details infrastructure, malware analysis, and operational patterns. Represents first major public attribution of cyber espionage to nation-state military unit.

                            2013-2015
                            
                                Operational Adaptation Post-Attribution
                            Following Mandiant attribution, APT1 evolves tactics and infrastructure. Operations continue but with refined operational security and new malware variants. Maintains persistent presence in compromised environments.

                            2015-2018
                            
                                Continued Strategic Espionage
                                APT1 remains active targeting defense contractors and government agencies. Shifts some operations to use more sophisticated persistence mechanisms including kernel-level rootkits and legitimate administrative tools.

                            2018-2025
                            
                                Modern Era Operations - Continued Threat
                            APT1 continues strategic espionage operations with evolved techniques. Integration of supply chain compromise, cloud targeting, and advanced persistence mechanisms. Remains one of most prolific state-sponsored espionage groups.

## Known Exploits & CVEs

APT1 has exploited numerous known vulnerabilities, often rapidly weaponizing newly disclosed CVEs:

                                CVE
                                Vulnerability
                                Affected Product
                                CVSS

                                CVE-2010-3740
                                Stack Buffer Overflow in Adobe Reader
                                Adobe Reader (versions 8.x through 10.x)
                                9.3

                                CVE-2012-0003
                                MSXML Remote Code Execution
                                Microsoft Windows, Internet Explorer
                                9.3

                                CVE-2011-1255
                                Unsafe HTML Parsing - Internet Explorer
                                Internet Explorer 6-9
                                9.3

                                CVE-2013-0156
                                YAML Deserialization RCE - Ruby on Rails
                                Ruby on Rails (versions 2.3-3.2)
                                9.8

                                CVE-2012-2109
                                Privilege Escalation in Windows
                                Microsoft Windows XP-7
                                7.2

                                CVE-2013-2465
                                Arbitrary Code Execution in Java
                                Java Runtime Environment (versions 6-7)
                                10.0

## Cross-Vendor Naming Reference

APT1 is tracked under multiple designations across security vendors:

                                Vendor / Organization
                                Name Used

                                Mandiant
                                APT1

                                FireEye
                                APT1, Comment Crew

                                Symantec
                                Shifu

                                Kaspersky
                                APT1, Comment Crew

                                CrowdStrike
                                Comment Crew

                                MITRE ATT&CK
                                Group G0006

                                US Government (DoD)
                                PLA Unit 61398

                                Palo Alto Networks
                                APT1 / Comment Crew

## Related Threat Actors

APT10 (MenuPass): Fellow Chinese APT group attributed to PLA/MSS. Operates in parallel alongside APT1 with some tactical overlap but distinct organizational structures and specializations.
                        APT27 (Emissary Panda): Chinese-attributed APT group operating with similar strategic objectives but different operational patterns and preferred targeting.
                        APT31 (Zirconium): Chinese-attributed group conducting parallel espionage operations against overlapping target sets including US government and defense sectors.
                        APT40 (Leviathan): MSS-affiliated Chinese APT group with similar targeting focus on critical infrastructure and strategic sectors.

## References & Sources

[1]
                            Mandiant: APT1 - Exposing One of China's Cyber Espionage Units

                            [2]
                            MITRE ATT&CK: APT1 (Group G0006)

                            [3]
                            US Department of Justice: Indictment of PLA Unit 61398 Members

                            [4]
                            CrowdStrike: Comment Crew Analysis and Tactics

                            [5]
                            Kaspersky: APT1 Threat Research

                            [6]
                            FireEye: APT1 Comprehensive Report

                            [7]
                            Palo Alto Networks: APT1 Research Materials

                            [8]
                            White House: Statement on Chinese Military Hacking Indictment

                Quick Facts

                    Country of Origin
                    
                        🇨🇳
                        China (PLA Unit 61398)

                    Nation-State Sponsored
                    Yes

                    Motivation
                    Espionage

                    First Seen
                    2006

                    Last Seen
                    2025 (Active)

                    Confidence Level
                    Very High

                    Associated Groups
                    PLA Unit 61398

                    Review Status
                    ⚠ Pending Human Review
