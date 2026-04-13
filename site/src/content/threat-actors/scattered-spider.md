---
name: "Scattered Spider | Threatpedia"
aliases: []
affiliation: Unknown
motivation: Unknown
status: unknown
reviewStatus: under_review
generatedBy: dangermouse-bot
generatedDate: 2026-04-13
---
## Overview

Scattered Spider is a financially motivated threat group composed of young, English-speaking cybercriminals known for their sophisticated social engineering tactics and adaptability. First identified in 2022, the group quickly emerged as a high-impact threat targeting major hospitality, healthcare, telecom, and technology organizations. Unlike traditional APT groups, Scattered Spider combines technical expertise with exceptional social engineering skills, often deploying initial access through compromised credentials rather than malware.

                    The group is particularly notable for their brazen operational style, including publicly threatening victims on social media, using personal information gathering to manipulate target employees, and leveraging legitimate remote access tools (RDP, AnyDesk, RattyRAT) to maintain persistence. Scattered Spider has demonstrated rapid escalation capabilities, moving from initial access to sensitive data theft in hours, and has successfully breached some of the world's largest casino, hotel, and healthcare operations.

                    Operating with financial motivation, Scattered Spider has been observed launching extortion campaigns, stealing high-value data including payment card information, customer databases, and proprietary intellectual property. The group's youthful profile, aggressive public communications, and willingness to take operational risks distinguish them from established nation-state actors. As of 2025, Scattered Spider continues to conduct active operations against major US enterprises with increasing technical sophistication.

## Tactics, Techniques & Procedures (TTPs)

MITRE ATT&CK Techniques
                        
                            Initial Access:
                            
                                T1566: Phishing
                                T1589: Gather Victim Identity Information
                                T1598: Phishing for Information
                                T1110: Brute Force
                                T1078: Valid Accounts
                            
                            Execution & Lateral Movement:
                            
                                T1570: Lateral Tool Transfer
                                T1021.001: Remote Services - RDP
                                T1021: Remote Services
                                T1570: Lateral Tool Transfer
                            
                            Persistence & Access:
                            
                                T1133: External Remote Services
                                T1547: Boot or Logon Autostart Execution
                                T1087: Account Discovery
                            
                            Exfiltration:
                            
                                T1020: Automated Exfiltration
                                T1030: Data Transfer Size Limits
                                T1041: Exfiltration Over C2 Channel

                        Common Attack Vectors
                        
                            Social Engineering via Phone/SMS: Targeted calls impersonating IT staff, help desk, or vendors to trick employees into revealing credentials or installing remote access software. SMS phishing with credential harvesting.
                            SIM Swapping & Phone Takeover: Coordination with telecom insiders or social engineering to hijack phone numbers and bypass SMS-based 2FA protections.
                            Credential Stuffing: Use of leaked credentials from previous breaches to gain initial access to corporate systems and cloud environments.
                            Legitimate Remote Access Tools: Installation of AnyDesk, RDP, RattyRAT, and DragonForce for persistent remote access and lateral movement without triggering alerts.
                            Public Social Media Reconnaissance: Extensive OSINT gathering of company employees through LinkedIn, Twitter, and other platforms to craft convincing social engineering narratives.

                        Tools & Malware
                        
                            AnyDesk: Legitimate remote desktop software abused for persistence and command execution without generating suspicious logs.
                            RattyRAT: Custom remote access trojan used for command execution and lateral movement across compromised networks.
                            DragonForce: Custom RAT deployed in recent campaigns for persistent access and data exfiltration.
                            Mimikatz: Credential harvesting tool for extracting plaintext credentials from memory and LSASS process.
                            Windows Terminal / PowerShell: Living-off-the-land tools for command execution and persistence.
                            Custom VPN/Proxy Tools: Self-developed tools for tunneling traffic and maintaining encrypted communications.

                        Infrastructure Patterns
                        
                            Bulletproof Hosting: Leased infrastructure from bulletproof hosters with minimal abuse response.
                            Residential Proxies: Rotating residential IP addresses to obfuscate source of attacks and evade IP-based detection.
                            Fast Flux Techniques: Rapid DNS changes and IP rotation for command-and-control infrastructure.
                            Legitimate Cloud Services: Abuse of free cloud storage (Mega, Mediafire) for exfiltration and C2 communications.
                            Public Extortion Channels: Use of public Twitter accounts, Tor-hosted leak sites, and messaging platforms for victim communications and extortion threats.

## Targeted Industries & Organizations

Scattered Spider has demonstrated a preference for high-value targets in entertainment, hospitality, healthcare, and telecommunications:

                                Sector
                                Notable Targets

                                Hospitality & Gaming
                                Caesars Entertainment (2022), MGM Resorts (2023), major hotel chains, Las Vegas casinos

                                Healthcare
                                Healthcare providers, medical centers, health insurance companies nationwide

                                Telecommunications
                                Major US telecom providers, ISPs, mobile carrier customers

                                Technology
                                SaaS providers, software development companies, tech consultancies

                                Retail & Commerce
                                E-commerce platforms, point-of-sale systems, retail chains

                                Financial Services
                                Payment processors, financial institutions, cryptocurrency exchanges

                    Geographic Focus: Primarily US-based organizations, with secondary targeting of Canadian and European companies. Group composition and public communications suggest English-speaking operators, likely based in North America or UK.

## Attributable Attacks Timeline

Aug 2022
                            
                                Caesars Entertainment Breach
                                Scattered Spider breached Caesars Entertainment systems using social engineering and compromised credentials. Stole customer data and demanded ransom. Group boasted of success on social media.

                            Sep 2023
                            
                                MGM Resorts Ransomware Attack
                                Scattered Spider compromised MGM Resorts systems, disrupting operations at 31 properties worldwide. Attack linked to credential compromise and persistence via remote access tools. Estimated financial impact $100M+.

                            Oct 2023
                            
                                Healthcare Sector Campaign
                                Scattered Spider targeted multiple US healthcare organizations in coordinated campaign. Conducted credential harvesting and lateral movement across hospital networks.

                            Q4 2023 - Q1 2024
                            
                                Telecom Provider Targeting
                                Identified targeting of major US telecommunications companies. Attackers gained access to customer data systems and call records through social engineering of service provider employees.

                            Q1 2025
                            
                                SIM Swap Infrastructure Attack
                                CISA and law enforcement reported Scattered Spider's coordination with telecom insiders for large-scale SIM swapping operations targeting executives and financial services personnel.

                            Mar 2025
                            
                                DragonForce Malware Campaign
                            Threat intelligence identified new DragonForce RAT deployment in ongoing Scattered Spider attacks. Malware provides command execution, data exfiltration, and persistence capabilities.

                            Q2 2025
                            
                                Enterprise SaaS Targeting Suspected
                                Security researchers report ongoing campaigns against major cloud SaaS providers. Tactics consistent with Scattered Spider operational patterns, though attribution pending confirmation.

## Known Exploits & CVEs

Scattered Spider primarily leverages compromised credentials and social engineering rather than zero-day exploits. However, the group has weaponized publicly available CVEs:

                                CVE
                                Vulnerability
                                Affected Product
                                CVSS

                                CVE-2023-46805
                                Authentication Bypass in Okta
                                Okta Identity Platform
                                8.6

                                CVE-2023-39664
                                Remote Code Execution in Ivanti Connect Secure
                                Ivanti Connect Secure VPN
                                9.8

                                CVE-2023-47548
                                Fortinet FortiOS Authentication Bypass
                                Fortinet FortiGate Firewalls
                                9.6

                                CVE-2024-1086
                                Privilege Escalation in Linux Kernel
                                Linux Kernel (multiple versions)
                                7.8

                                CVE-2023-22518
                                RCE in Atlassian Confluence
                                Atlassian Confluence Server
                                9.8

                                CVE-2024-21887
                                Privilege Escalation in Citrix NetScaler
                                Citrix ADC & NetScaler
                                8.8

## Cross-Vendor Naming Reference

Scattered Spider is tracked under multiple identifiers across the threat intelligence community:

                                Vendor / Organization
                                Name Used

                                Mandiant / Google
                                UNC3944

                                Microsoft
                                Storm-0875

                                CrowdStrike
                                Octo Tempest

                                Recorded Future
                                LUCR-3

                                Secureworks
                                0ktapus

                                Trend Micro
                                Scattered Spider

                                BlackBerry / Cylance
                                Scattered Swine

                                Sophos
                                Scattered Spider

## Related Threat Actors

LockBit Group: Financial cybercriminal organization with overlapping victim profiles and operational similarities, though distinct organizational structures and specializations.
                        FIN7: Similar financially motivated profile targeting hospitality and retail sectors, but with different tooling and geographic focus patterns.
                        Wizard Spider: Ransomware-focused group operating in similar verticals, though with more traditional malware-first approach compared to Scattered Spider's social engineering focus.

## References & Sources

[1]
                            Mandiant: UNC3944 (Scattered Spider) Analysis and Recommendations

                            [2]
                            Microsoft Threat Intelligence: Storm-0875 Analysis

                            [3]
                            CrowdStrike: Octo Tempest Campaign Analysis

                            [4]
                            CISA & FBI Alert: Scattered Spider Campaign

                            [5]
                            Recorded Future: LUCR-3 Operational Overview

                            [6]
                            Secureworks: 0ktapus Social Engineering Tactics

                            [7]
                            Trend Micro: Scattered Spider DragonForce Malware Analysis

                            [8]
                            CISA Advisory: SIM Swapping and Scattered Spider Operations

                Quick Facts

                    Country of Origin
                    
                        🏴
                        Unknown (English-speaking)

                    Nation-State Sponsored
                    No

                    Motivation
                    Financial (Extortion & Data Theft)

                    First Seen
                    2022

                    Last Seen
                    2025 (Active)

                    Confidence Level
                    High

                    Associated Groups
                    Independent / Unaffiliated

                    Review Status
                    ⚠ Pending Human Review
