---
name: "Cl0p Group | Threatpedia"
aliases: []
affiliation: Unknown
motivation: Unknown
status: unknown
reviewStatus: under_review
generatedBy: dangermouse-bot
generatedDate: 2026-04-13
---
## Overview

Cl0p Group (also known as Cl0p) is a sophisticated financially motivated threat actor specializing in exploiting enterprise file transfer and collaboration platform vulnerabilities for data exfiltration and extortion. Operating since 2019, the group has become one of the most prolific data extortion operations globally, with a particular focus on zero-day exploitation of widely-deployed file transfer solutions. Cl0p is known for their high-impact supply chain compromises, rapid vulnerability exploitation, and aggressive extortion campaigns.

                    The group gained widespread attention through their exploitation of MOVEit Transfer, a critical file transfer platform used by thousands of organizations worldwide. In a single coordinated campaign in 2023, Cl0p exploited MOVEit vulnerabilities to compromise government agencies, Fortune 500 companies, healthcare systems, and educational institutions across multiple countries. The group's operational model combines zero-day exploitation with swift exfiltration and double-extortion tactics, demanding millions in ransom payments.

                    Cl0p's technical capabilities rival state-sponsored adversaries, with demonstrated expertise in vulnerability research, exploit development, and persistence mechanisms. The group maintains a professional public-facing leak site, publishes detailed extortion threats, and communicates directly with victims through customized messages. As of 2025, Cl0p continues active operations with refined tactics and expanded targeting across critical infrastructure, healthcare, and government sectors globally.

## Tactics, Techniques & Procedures (TTPs)

MITRE ATT&CK Techniques
                        
                            Initial Access:
                            
                                T1190: Exploit Public-Facing Application
                                T1195.002: Supply Chain Compromise - Software Supply Chain
                                T1199: Trusted Relationship
                            
                            Execution & Persistence:
                            
                                T1059: Command and Scripting Interpreter
                                T1570: Lateral Tool Transfer
                                T1021: Remote Services
                            
                            Credential Access & Defense Evasion:
                            
                                T1110: Brute Force
                                T1087: Account Discovery
                                T1562: Impair Defenses
                            
                            Exfiltration:
                            
                                T1020: Automated Exfiltration
                                T1030: Data Transfer Size Limits
                                T1041: Exfiltration Over C2 Channel

                        Common Attack Vectors
                        
                            Zero-Day Exploitation: Rapid discovery and weaponization of zero-day vulnerabilities in enterprise file transfer solutions. MOVEit Transfer CVEs exploited within days of discovery for large-scale impact.
                            Unpatched Vulnerabilities: Exploitation of known but unpatched vulnerabilities in widely-deployed platforms. Extended targeting of systems running older versions after patches are released.
                            Supply Chain Compromise: Direct compromise of file transfer platforms and collaboration tools used as trusted intermediaries between organizations, enabling access to customer environments.
                            Web Shell Deployment: Installation of persistent web shells on compromised servers for long-term access and lateral movement.
                            Aggressive Data Exfiltration: High-bandwidth bulk exfiltration of sensitive data from multiple departments and systems within hours of initial compromise.

                        Tools & Malware
                        
                            Custom Web Shells: Proprietary web shells written in multiple languages (PHP, JSP, ASPX) for persistent access and file operations.
                            ClZip: Custom compression tool used for rapid data packaging prior to exfiltration.
                            Golang-based Utilities: Lightweight Go-compiled tools for credential harvesting, lateral movement, and system reconnaissance.
                            Rclone/RSync: Legitimate data transfer tools weaponized for high-speed bulk exfiltration across networks.
                            Custom Reconnaissance Scripts: Python and Bash scripts for network enumeration, privilege escalation, and active directory harvesting.
                            Port Scanning Tools: Custom network mapping tools for identifying accessible systems and data repositories.

                        Infrastructure Patterns
                        
                            Professional Leak Site: Maintains sophisticated, multi-language leak sites with organization lists, exfiltrated data samples, and negotiation portals.
                            Bulletproof Hosting: Uses bulletproof hosting providers and privacy-focused infrastructure to evade takedowns.
                            Tor & I2P Networks: Operates communication channels via Tor hidden services and I2P for anonymity.
                            Cryptocurrency Mixing: Uses mixing services and tumblers to launder ransom payments and extortion proceeds.
                            Compromised Infrastructure Reuse: Leverages compromised servers and hosting accounts for redundancy and persistence.

## Targeted Industries & Organizations

Cl0p targets high-value organizations across critical sectors with preference for large enterprises and public entities:

                                Sector
                                Notable Targets

                                Government & Diplomacy
                                US Federal agencies, State Department, international diplomatic missions, government contractors

                                Healthcare & Pharmaceuticals
                                Hospital systems, health insurance providers, pharmaceutical manufacturers, medical device companies

                                Critical Infrastructure
                                Electricity utilities, water systems, transportation authorities, telecommunications

                                Finance & Banking
                                Financial institutions, investment firms, insurance companies, payment processors

                                Education
                                Universities, research institutions, educational technology providers

                                Technology & Manufacturing
                                Software vendors, IT service providers, aerospace contractors, defense manufacturers

                    Geographic Scope: Global operations with notable impact in USA, Europe, and Asia-Pacific regions. Targets multinational organizations with presence across multiple countries to maximize ransom leverage.

## Attributable Attacks Timeline

2019-2021
                            
                                Clop Ransomware Operations Begin
                                Cl0p emerges as data extortion operator targeting file transfer platforms. Initial campaigns exploit FTA (File Transfer Appliance) vulnerabilities affecting enterprise environments worldwide.

                            Jun 2021
                            
                                Accellion FTA Zero-Day Exploitation
                                Cl0p exploits zero-day vulnerabilities in Accellion FTA file transfer appliance, compromising thousands of organizations globally. Attack impacts Shell, Stanford University, SolarWinds, and US government agencies.

                            May 2023
                            
                                MOVEit Transfer Exploitation Campaign
                                Cl0p exploits critical CVE-2023-34362 zero-day in MOVEit Transfer. Single campaign affects 2,000+ organizations within weeks, including US State Department, healthcare systems, Fortune 500 companies. Estimated 60+ million individuals affected by data theft.

                            Aug 2023
                            
                                Progress Software GoAnywhere Exploitation
                            Cl0p exploits zero-day vulnerabilities in Progress Software GoAnywhere secure file transfer solution. Targets government agencies and healthcare organizations across multiple countries.

                            Q4 2023 - Q1 2024
                            
                                Continued MOVEit & WebSocket Exploitation
                                Cl0p continues targeting MOVEit instances and discovers WebSocket protocol vulnerabilities in file transfer systems. Secondary and tertiary wave of attacks against slower-patching organizations.

                            2024
                            
                                OpenText File Transfer Targeting
                                Cl0p shifts focus to OpenText file transfer platforms and identifies new zero-days. Expands targeting to European government agencies and healthcare systems.

                            Q1 2025
                            
                                Advanced Persistent Infrastructure Likely
                                Security researchers assess Cl0p has evolved beyond opportunistic exploitation to maintain persistent access in critical infrastructure environments for extended intelligence collection prior to data theft.

## Known Exploits & CVEs

Cl0p specializes in rapid zero-day exploitation of enterprise file transfer platforms. The following CVEs have been directly attributed to Cl0p campaigns:

                                CVE
                                Vulnerability
                                Affected Product
                                CVSS

                                CVE-2023-34362
                                Arbitrary File Upload - MOVEit Transfer RCE
                                MOVEit Transfer (all versions)
                                9.8

                                CVE-2023-34539
                                SQL Injection - MOVEit Transfer
                                MOVEit Transfer
                                9.8

                                CVE-2023-38831
                                Arbitrary Code Execution in WinRAR
                                WinRAR (all versions before 6.23)
                                8.8

                                CVE-2023-35078
                                Authentication Bypass - Progress GoAnywhere
                                Progress GoAnywhere Secure File Transfer
                                9.8

                                CVE-2021-25282
                                Remote Code Execution - Accellion FTA
                                Accellion File Transfer Appliance
                                9.8

                                CVE-2024-20669
                                WebSocket Protocol Bypass - OpenText
                                OpenText File Transfer
                                9.6

## Cross-Vendor Naming Reference

Cl0p Group is tracked under multiple designations across the threat intelligence community:

                                Vendor / Organization
                                Name Used

                                CrowdStrike
                                GOLD WELLINGTON

                                Mandiant / Google
                                Cl0p Group

                                Recorded Future
                                Cl0p

                                Trend Micro
                                Cl0p

                                Palo Alto Networks
                                Cl0p Group

                                CISA
                                Cl0p Group

                                Microsoft
                                Cl0p Group

                                Sophos
                                Cl0p / CleverTouch

## Related Threat Actors

LockBit Gang: Similar financially motivated ransomware/extortion operations with overlapping victim selection and ransom negotiation tactics, though distinct operational infrastructure.
                        BlackCat / ALPHV: Competing ransomware-as-a-service operation with comparable targeting profiles and technical sophistication in file transfer exploitation.
                        FIN7: Financially motivated threat group with some tactical overlaps in data exfiltration approaches, though different tool preferences and targeting focuses.

## References & Sources

[1]
                            Mandiant: Cl0p Group MOVEit Zero-Day Exploitation Analysis

                            [2]
                            CISA Alert: MOVEit Transfer Critical Vulnerabilities

                            [3]
                            BleepingComputer: Cl0p Ransomware Group Analysis

                            [4]
                            CrowdStrike: GOLD WELLINGTON (Cl0p) Campaign Deep Dive

                            [5]
                            Microsoft Security Blog: Cl0p Group MOVEit Exploitation Campaign

                            [6]
                            Check Point Research: Cl0p Group File Transfer Exploitation

                            [7]
                            Recorded Future: Cl0p Group Data Exfiltration Operations

                            [8]
                            Sophos: Cl0p Group Threat Analysis and Indicators

                Quick Facts

                    Country of Origin
                    
                        🏴
                        Unknown

                    Nation-State Sponsored
                    No

                    Motivation
                    Financial (Data Extortion)

                    First Seen
                    2019

                    Last Seen
                    2025 (Active)

                    Confidence Level
                    High

                    Associated Groups
                    CleverTouch (Variant)

                    Review Status
                    ⚠ Pending Human Review
