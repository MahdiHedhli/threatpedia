---
name: DragonForce
aliases:
  - "DragonForce RaaS"
affiliation: Criminal (Malaysian origin)
motivation: Financial
status: active
reviewStatus: under_review
generatedBy: dangermouse-bot
generatedDate: 2026-04-13
---
## Overview

DragonForce is a financially motivated ransomware group that evolved from Malaysian hacktivist origins into a sophisticated Ransomware-as-a-Service (RaaS) cartel. First observed in August 2023, the group initially positioned itself as a pro-Palestinian hacktivist collective before pivoting to profit-driven operations. By 2026, DragonForce operates one of the most aggressive RaaS platforms in the threat landscape, with monthly victim counts surging to 650+ — up from approximately 450 per month in 2024.

                    DragonForce employs a double extortion model, encrypting victim data with AES-256 while simultaneously exfiltrating up to 1TB per victim. The group operates "white-label" affiliate portals with customizable branding and payloads, and introduced a novel "data analysis service" in August 2025 that generates extortion call scripts and legal analysis reports to increase pressure on victims. By January 2026, DragonForce had claimed 363 victims across diverse sectors.

                    In April 2026, DragonForce claimed 13+ victims across manufacturing, packaging, hospitality, and utilities sectors. The group's evolving tactics — from hacktivism to financial extortion to cartel-style operations — demonstrate a mature threat actor with significant operational capability. Notable earlier targets include UK retail giants Marks & Spencer, Co-op, and Harrods in 2025.

## Tactics, Techniques & Procedures (TTPs)

MITRE ATT&CK Techniques
                        
                            Initial Access:
                            
                                T1566: Phishing
                                T1078: Valid Accounts
                                T1133: External Remote Services
                                T1190: Exploit Public-Facing Application
                            
                            Execution:
                            
                                T1059: Command and Scripting Interpreter
                            
                            Persistence:
                            
                                T1547: Boot or Logon Autostart Execution
                                T1543: Create or Modify System Process
                            
                            Credential Access:
                            
                                T1003: OS Credential Dumping (Mimikatz)
                            
                            Lateral Movement:
                            
                                T1021: Remote Services (Cobalt Strike, SystemBC)
                            
                            Defense Evasion:
                            
                                T1027: Obfuscated Files or Information
                                T1562: Impair Defenses (BYOVD)
                            
                            Impact:
                            
                                T1486: Data Encrypted for Impact (AES-256)
                                T1567: Exfiltration Over Web Service

                        Common Attack Vectors
                        
                            Credential Theft & Social Engineering: Phishing campaigns and credential theft for initial access into victim environments.
                            BYOVD (Bring Your Own Vulnerable Driver): Deployment of vulnerable kernel drivers to disable endpoint security products before ransomware execution.
                            Exposed Remote Services: Exploitation of exposed RDP, VPN, and other remote access services with brute-forced or stolen credentials.
                            Affiliate Model: White-label affiliate portals allow diverse operators to deploy DragonForce payloads with customized branding and negotiation infrastructure.

                        Tools & Malware
                        
                            DragonForce Ransomware: Custom AES-256 encryption payload available through the RaaS platform with customizable branding via RansomBay builder service.
                            Cobalt Strike: Command-and-control framework used for post-exploitation, lateral movement, and payload delivery.
                            SystemBC: Backdoor proxy tool used for maintaining persistent access and facilitating C2 communications.
                            Mimikatz: Credential harvesting tool for extracting passwords and authentication tokens from Windows systems.
                            Data Analysis Service: Novel capability generating extortion call scripts and legal analysis reports to maximize victim compliance (launched August 2025).

                        Infrastructure Patterns
                        
                            RaaS Cartel Platform: White-label affiliate portals with customizable payloads, branding, and multi-extortion management.
                            Dark Web Leak Site: Tor-hosted platform for publishing stolen data and managing victim negotiations.
                            Bulletproof Hosting: Infrastructure designed to resist takedown efforts and law enforcement action.

## Targeted Industries & Organizations

DragonForce targets organizations across diverse sectors globally:

                            SectorNotable Targets / Impact

                            RetailMarks & Spencer, Co-op, Harrods (UK, 2025) — high-profile attacks on major retailers
                            Manufacturing13+ victims in April 2026 across manufacturing and packaging sectors
                            HospitalityMultiple hotel and hospitality organizations targeted in 2026
                            UtilitiesEnergy and utilities infrastructure targeted for high-value ransom demands
                            Financial ServicesFinancial institutions across North America and Europe
                            EducationFGV Brazil (March 2026) and other educational institutions
                            HealthcareHealthcare organizations targeted for sensitive data value

## Attributable Attacks Timeline

Aug 2023
                            
                                Group Emergence
                                DragonForce appears from Malaysian hacktivist origins, initially positioning as pro-Palestinian collective conducting website defacements and DDoS attacks.

                            2024
                            
                                Pivot to Ransomware
                                Transitions from hacktivism to financially motivated ransomware operations. Scales to approximately 450 victims per month through growing affiliate network.

                            2025
                            
                                UK Retail Campaign
                                Aggressive targeting of major UK retailers including Marks & Spencer, Co-op, and Harrods. Establishes reputation for high-profile attacks.

                            Aug 2025
                            
                                Data Analysis Service
                                Introduces novel 'data analysis service' generating extortion call scripts and legal analysis reports to increase victim pressure.

                            Jan 2026
                            
                                363+ Cumulative Victims
                                Claims 363+ total victims. Monthly victim counts surge to 650+ as cartel model attracts more affiliates.

                            Apr 2026
                            
                                April Campaign
                                Claims 13+ new victims across manufacturing, packaging, hospitality, and utilities in early April 2026.

## Known Exploits & CVEs

DragonForce primarily relies on credential theft, social engineering, and BYOVD techniques rather than specific CVE exploitation. The group leverages Cobalt Strike and SystemBC for post-exploitation rather than targeting specific software vulnerabilities for initial access.

## Cross-Vendor Naming Reference

Vendor / Organization
                                Name Used

                                Trend Micro
                                DragonForce Ransomware

                                Group-IB
                                DragonForce

                                Bitdefender
                                DragonForce Ransomware Cartel

                                SentinelOne
                                DragonForce

                                CrowdStrike
                                DragonForce

## Related Threat Actors

LockBit: Major RaaS competitor. Some DragonForce affiliates are suspected of cross-platform operations with LockBit infrastructure.
                        BlackCat/ALPHV: Another RaaS operation with overlapping affiliate networks and similar targeting patterns.
                        DragonForce Malaysia: Malaysian hacktivist group that denies involvement in ransomware operations, despite sharing the DragonForce name. Relationship disputed.

## References & Sources

[1]
                            Trend Micro: Ransomware Spotlight — DragonForce
                            Trend Micro

                            [2]
                            Group-IB: DragonForce Ransomware Analysis
                            Group-IB

                            [3]
                            Bitdefender: DragonForce Ransomware Cartel
                            Bitdefender

                            [4]
                            SentinelOne: From Hacktivists to High Street Extortionists
                            SentinelOne

                Quick Facts

                    Country of Origin
                    
                        🇲🇾
                        Malaysia (origin)

                    Nation-State Sponsored
                    No — Criminal Enterprise (RaaS Cartel)

                    Motivation
                    Financial (Ransomware & Double Extortion)

                    First Seen
                    August 2023

                    Last Seen
                    2026-Q2

                    Confidence Level
                    High

                    Associated Groups
                    DragonForce Malaysia (disputed)

                    Status
                    ACTIVE

                    Review Status
                    ⚠ Pending Human Review
