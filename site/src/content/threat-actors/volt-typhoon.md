---
name: "Volt Typhoon | Threatpedia"
aliases: []
affiliation: Unknown
motivation: Unknown
status: unknown
reviewStatus: under_review
generatedBy: dangermouse-bot
generatedDate: 2026-04-13
---
## Overview

Volt Typhoon is a sophisticated Chinese state-sponsored threat actor attributed to the People's Republic of China's Ministry of State Security (MSS). The group has been operational since at least 2017 and represents one of the most significant threats to US critical infrastructure. Volt Typhoon specializes in establishing persistent footholds in critical infrastructure networks with the strategic goal of enabling potential disruptive or destructive attacks during geopolitical crises.

                    The group operates with extreme patience and operational security discipline, focusing on long-term reconnaissance and network positioning rather than immediate exploitation. Volt Typhoon's activities demonstrate sophisticated understanding of industrial control systems (ICS) and critical infrastructure operations, with targeting encompassing communications, energy, water, transportation, and other essential services across the United States. The CISA has characterized Volt Typhoon's approach as a "pre-positioning" strategy designed to establish command and control access before launching destructive attacks.

                    Volt Typhoon employs living-off-the-land techniques, leveraging legitimate system administration tools and avoiding deployment of custom malware when possible. This approach provides exceptional stealth, as their activities blend with normal administrative traffic. The group has demonstrated willingness to exploit known vulnerabilities in networking equipment, particularly Fortinet FortiGate firewalls and other edge devices, to establish initial access to critical infrastructure networks.

## Tactics, Techniques & Procedures (TTPs)

MITRE ATT&CK Techniques
                        
                            Initial Access:
                            
                                T1190: Exploit Public-Facing Application
                                T1566.002: Phishing - Spearphishing Link
                                T1200: Hardware Additions
                            
                            Persistence:
                            
                                T1098.001: Account Manipulation - Additional Cloud Credentials
                                T1098.002: Account Manipulation - Exchange Email Delegate Permissions
                                T1547.001: Boot or Logon Autostart Execution
                            
                            Defense Evasion:
                            
                                T1078: Valid Accounts
                                T1562.008: Impair Defenses - Disable Logging
                                T1140: Deobfuscate/Decode Files or Information
                            
                            Credential Access:
                            
                                T1110.002: Brute Force - Password Guessing
                                T1187: Forced Authentication
                                T1556: Modify Authentication Process
                            
                            Lateral Movement:
                            
                                T1570: Lateral Tool Transfer
                                T1570: Lateral Tool Transfer
                                T1550.001: Use Alternate Authentication Material - Application Access Token

                        Common Attack Vectors
                        
                            Exploitation of Edge Devices: Systematic exploitation of Fortinet FortiGate firewall vulnerabilities (CVE-2022-42991, CVE-2023-27997) to establish initial network access. These devices provide gateway access to critical infrastructure networks.
                            Living-off-the-Land Techniques: Extensive use of legitimate utilities including SSH, PuTTY, WinSCP, and legitimate remote administration tools to avoid deployment of custom malware and detection by antivirus systems.
                            Credential Harvesting: Use of credential harvesting tools to capture authentication material from compromised systems, enabling lateral movement through networks without suspicious network traffic patterns.
                            HVAC/IT Equipment Access: Reported cases of physical access to HVAC (heating, ventilation, air conditioning) systems and IT equipment closets in critical infrastructure facilities, potentially enabling installation of network access devices.
                            Supply Chain Compromise: Targeting of managed service providers (MSPs) and IT contractors to gain access to multiple critical infrastructure customers through trusted vendor relationships.

                        Tools & Malware
                        
                            Legitimate Administration Tools: PuTTY, WinSCP, SSH clients, PSExec, TeamViewer, and AnyDesk for remote administration and command execution.
                            Living-off-the-Land Utilities: Windows PowerShell, WMI, Task Scheduler, Windows Registry modifications for persistence and lateral movement without custom malware.
                            Credential Harvesting: Mimikatz and similar post-exploitation frameworks for extracting cached credentials and session tokens from compromised systems.
                            Passive Reconnaissance Tools: Network mapping utilities including ping, ipconfig, nslookup, and tracert for network topology discovery.
                            VPN Exploitation: Cisco VPN client exploitation and configuration modification for persistent remote access.

                        Infrastructure Patterns
                        
                            Legitimate Cloud Services: Abuse of Microsoft Teams for command-and-control communications and data exfiltration through normal business channels.
                            SSH and Legitimate Protocols: Use of standard SSH and VPN protocols for command execution, making detection difficult without behavioral analysis.
                            DNS Tunneling: Suspected use of DNS tunneling techniques to exfiltrate data and receive commands through DNS queries and responses.
                            Compromised Legitimate Networks: Use of compromised hosting providers and legitimate cloud infrastructure for staging and intermediate command-and-control.

## Targeted Industries & Organizations

Volt Typhoon's targeting is strategically focused on US critical infrastructure sectors with potential impact during geopolitical crises:

                                Sector
                                Notable Targets / Impact

                                Communications
                                Telecommunications infrastructure, wireless communications providers, backbone networks. Critical for emergency response coordination.

                                Energy
                                Electric utilities, power generation facilities, power transmission networks, oil and gas infrastructure.

                                Water and Wastewater
                                Water treatment facilities, water distribution networks, wastewater systems. Particularly vulnerable due to legacy ICS systems.

                                Transportation
                                Port operations, rail systems, pipeline control systems, aviation infrastructure.

                                Government & Defense
                                Federal civilian agencies, defense industrial base, military contractor networks, research institutions.

                                Healthcare
                                Healthcare facilities, hospital networks, pharmaceutical research institutions.

                    Geographic Focus: Volt Typhoon primarily targets organizations within the United States, with particular concentration in major metropolitan areas and regions with critical infrastructure hubs.

## Attributable Attacks Timeline

2017-2019
                            
                                Initial US Communications Targeting
                                Volt Typhoon begins systematic compromise of US communications infrastructure organizations, establishing initial network footholds through exploitation of edge devices and contractor access.

                            2019-2021
                            
                                Expansion to Multiple Critical Infrastructure Sectors
                                Group expands operations beyond communications to target water treatment, electric utilities, and transportation infrastructure. Demonstrates understanding of OT network architecture and operational constraints.

                            Early 2021
                            
                                FortiGate Firewall Campaign
                                Volt Typhoon exploits CVE-2022-42991 (pre-disclosure) in Fortinet FortiGate firewalls to gain access to critical infrastructure networks. Hundreds of organizations compromised through this vector.

                            Oct 2023
                            
                                CISA Public Advisory
                                CISA and NSA release joint advisory on Volt Typhoon activities, describing group's approach to critical infrastructure compromise and pre-positioning tactics. Attribution to Chinese MSS provided.

                            Nov 2023
                            
                                Communications Infrastructure Deep Dive
                                Investigations reveal Volt Typhoon has established persistent access to major US telecommunications providers, with potential to disrupt emergency communications during crisis scenarios.

                            2024-2025
                            
                                Continued Lateral Movement and Reconnaissance
                                Ongoing operations observed in critical infrastructure networks, with focus on network mapping, credential harvesting, and establishing additional persistence mechanisms. Group patience indicates preparation for future disruption operations.

## Known Exploits & CVEs

Volt Typhoon has demonstrated rapid exploitation of critical infrastructure equipment vulnerabilities:

                                CVE
                                Vulnerability
                                Affected Product
                                CVSS

                                CVE-2022-42991
                                Improper Input Validation in FortiGate
                                Fortinet FortiGate Firewall
                                9.6

                                CVE-2023-27997
                                Authentication Bypass in FortiGate
                                Fortinet FortiGate Firewall
                                9.6

                                CVE-2023-21839
                                Remote Code Execution in Cisco IOS XE
                                Cisco IOS XE Software
                                9.8

                                CVE-2021-44228
                                Log4Shell Remote Code Execution
                                Apache Log4j 2.0-2.14.1
                                10.0

                                CVE-2021-26855
                                SSRF in Exchange Server
                                Microsoft Exchange Server
                                9.8

                                CVE-2023-46805
                                Remote Code Execution in GE Devices
                                GE Industrial Equipment
                                9.8

## Cross-Vendor Naming Reference

Volt Typhoon is tracked by multiple security organizations and government agencies:

                                Vendor / Organization
                                Name Used

                                CISA / NSA
                                Volt Typhoon

                                Microsoft Threat Intelligence
                                Volt Typhoon

                                Mandiant / Google
                                Volt Typhoon

                                CrowdStrike
                                BRONZE SILHOUETTE

                                Palo Alto Networks
                                Volt Typhoon

                                Splunk Threat Intelligence
                                Volt Typhoon

                                Recorded Future
                                Chinese Ministry of State Security

## Related Threat Actors

Salt Typhoon: Fellow Chinese state-sponsored actor with similar targeting of US communications infrastructure. Different operational approach and toolsets suggest separate organizational units.
                        APT40 (Leviathan): Chinese MSS-affiliated group with targeting of maritime and defense sectors. Similar strategic focus on critical infrastructure compromise.
                        APT41: Chinese group conducting both espionage and financially-motivated operations. Different motivation set but shares targeting overlap in critical sectors.

## References & Sources

[1]
                            CISA & NSA Advisory: "People's Republic of China State-Sponsored Cyber Actor Living off the Land to Evade Detection, Strategically Compromises U.S. and Allied Critical Infrastructure"
                            CISA Alert

                            [2]
                            Microsoft Threat Intelligence: "Volt Typhoon targeting critical infrastructure"
                            Microsoft Documentation

                            [3]
                            Mandiant Research: "Volt Typhoon: Deep Dive on Infrastructure Pre-positioning Tactics"
                            Mandiant Intelligence

                            [4]
                            NSA Cybersecurity Advisory: "Volt Typhoon Targeting US Infrastructure"
                            NSA Press Release

                            [5]
                            CrowdStrike Intelligence Report: "BRONZE SILHOUETTE Operations Against Critical Infrastructure"
                            CrowdStrike Threat Reports

                Quick Facts

                    Country of Origin
                    
                        🇨🇳
                        China

                    Nation-State Sponsored
                    Yes, Ministry of State Security (MSS)

                    Motivation
                    Espionage, Strategic Pre-positioning

                    First Seen
                    2017

                    Last Seen
                    2025-Q1

                    Confidence Level
                    High

                    Associated Groups
                    BRONZE SILHOUETTE

                    Status
                    Active

                    Review Status
                    ⚠ Pending Human Review
