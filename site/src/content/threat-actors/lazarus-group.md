---
name: "Lazarus Group | Threatpedia"
aliases: []
affiliation: Unknown
motivation: Unknown
status: unknown
reviewStatus: under_review
generatedBy: dangermouse-bot
generatedDate: 2026-04-13
---
## Overview

Lazarus Group is the most prolific and dangerous threat actor attributed to North Korea's primary intelligence agency, the Reconnaissance General Bureau (RGB). Operating since at least 2009, Lazarus Group has perpetrated some of the most impactful and widely publicized cyber attacks globally, including the 2014 Sony Pictures Entertainment breach, the 2016 Bangladesh Bank heist (stealing $81 million), the WannaCry ransomware campaign (2017), and numerous attacks on cryptocurrency exchanges. The group operates with a primary motivation of generating revenue for the isolated North Korean regime while simultaneously conducting sophisticated espionage and sabotage operations.

                    Lazarus Group's capabilities span the full spectrum of cyber warfare, from destructive attacks and financial theft to sophisticated supply chain compromises and espionage. The group demonstrates advanced programming expertise, rapid exploitation of zero-day vulnerabilities, and sophisticated anti-forensic and operational security practices. Lazarus maintains an extensive infrastructure of front companies, cryptocurrency exchanges, and shell organizations to launder stolen funds and evade international sanctions. Recent operations demonstrate the group's evolution toward more sophisticated persistent access techniques and supply chain compromise strategies.

                    As of 2025, Lazarus Group remains highly active with documented ongoing operations targeting financial institutions, cryptocurrency exchanges, defense contractors, and technology companies worldwide. The group's attacks have directly resulted in billions of dollars in losses globally, making them arguably the most financially damaging threat actor to economic security. The group operates with minimal operational constraints due to North Korea's lack of extradition treaties and historical isolation from international cybersecurity enforcement mechanisms.

## Tactics, Techniques & Procedures (TTPs)

MITRE ATT&CK Techniques
                        
                            Initial Access:
                            
                                T1566.001: Phishing - Spearphishing Attachment
                                T1566.002: Phishing - Spearphishing Link
                                T1190: Exploit Public-Facing Application
                                T1199: Trusted Relationship
                            
                            Execution:
                            
                                T1059.001: Command and Scripting Interpreter - PowerShell
                                T1059.003: Command and Scripting Interpreter - Windows Command Shell
                                T1203: Exploitation for Client Execution
                            
                            Defense Evasion:
                            
                                T1036: Masquerading
                                T1562.008: Impair Defenses - Disable Logging
                                T1140: Deobfuscate/Decode Files or Information
                            
                            Impact:
                            
                                T1561: Disk Wipe
                                T1486: Data Encrypted for Impact
                                T1485: Data Destruction
                            
                            Exfiltration:
                            
                                T1005: Data Staged
                                T1020: Automated Exfiltration
                                T1041: Exfiltration Over C2 Channel

                        Common Attack Vectors
                        
                            Spear-Phishing Campaigns: Highly targeted phishing emails with weaponized attachments (Office documents, archives) impersonating government agencies, financial institutions, or cryptocurrency exchanges.
                            Zero-Day Exploitation: Rapid exploitation of previously unknown vulnerabilities in operating systems and applications, often within days or weeks of public disclosure.
                            Watering Hole Attacks: Compromise of legitimate websites and software repositories frequented by target organizations to distribute malware.
                            Supply Chain Compromise: Targeting of software developers and distribution platforms to compromise software before release (e.g., blockchain platforms, cryptocurrency exchange software).
                            Financial Institution Targeting: Direct attacks on banking infrastructure, SWIFT systems, and ATM networks to steal funds directly from financial institutions.

                        Tools & Malware
                        
                            WannaCry/WannaCrypt: Destructive ransomware leveraging EternalBlue exploit, deployed globally in May 2017. Infected hundreds of thousands of systems across 150+ countries.
                            Destover: Custom malware used in Sony Pictures attack. Provides remote access, data destruction, and anti-forensic capabilities.
                            MATA Framework: Sophisticated modular malware framework with multiple payload capabilities including espionage, destruction, and lateral movement.
                            Hermes Ransomware: Ransomware variant used against financial institutions and cryptocurrency exchanges.
                            Silent Chollima / Labyrinth Chollima: Advanced backdoor families used for persistent access and command execution.
                            AppleJeus / Codenotary Backdoor: Supply chain attack malware targeting macOS systems and cryptocurrency developers.
                            Malwarebytes Loader: Custom malware loader for initial access and persistence.

                        Infrastructure Patterns
                        
                            Cryptocurrency Laundering: Extensive use of cryptocurrency exchanges and mixers to launder stolen funds. Operators often attempt to convert stolen funds to Bitcoin/Monero immediately.
                            Compromised Infrastructure: Use of hacked servers and legitimate hosting providers to host malware and command-and-control infrastructure.
                            Proxy Networks: Use of residential proxies and VPN services to obfuscate command-and-control communications and activity origins.
                            Domain Registration Patterns: Use of legitimate registrars with privacy protection to register domains mimicking financial institutions and software companies.
                            Front Company Networks: Extensive use of shell companies and fronts to operate cryptocurrency exchanges, exchange APIs, and trading platforms.

## Targeted Industries & Organizations

Lazarus Group targets a broad range of sectors aligned with revenue generation and strategic intelligence objectives:

                                Sector
                                Notable Targets / Impact

                                Financial Services & Banking
                                Central banks, commercial banks, payment processors. Bangladesh Bank ($81M theft), multiple other heists totaling billions.

                                Cryptocurrency & Exchanges
                                Cryptocurrency exchanges, blockchain platforms, DeFi protocols. Multiple exchange compromises, billions in crypto theft.

                                Entertainment & Media
                                Sony Pictures Entertainment (major destructive attack in 2014). Targeting of media production studios.

                                Defense & Aerospace
                                Defense contractors, military research institutions, aerospace companies.

                                Technology & Software
                                Software developers, blockchain platforms, open-source repositories, cryptocurrency wallets.

                                Government Institutions
                                US government agencies, international financial organizations, research institutions.

                    Geographic Scope: Global targeting with particular focus on US, European, and Asian financial institutions and cryptocurrency exchanges. Recent activity shows expanding targeting of Ukraine, South Korea, and Japan.

## Attributable Attacks Timeline

2009
                            
                                Group Formation
                                Lazarus Group begins operational activities, attributed to North Korea's Reconnaissance General Bureau (RGB). Early operations target South Korean government and military infrastructure.

                            Nov 2014
                            
                                Sony Pictures Entertainment Breach
                                Lazarus Group compromises Sony Pictures Entertainment through spear-phishing and exploit kit. Deploys Destover malware, destroys data, leaks unreleased films and executive communications. Widely attributed to North Korea as retaliation for "The Interview" film.

                            Feb 2016
                            
                                Bangladesh Bank Heist
                                Lazarus Group steals $81 million from Bangladesh Bank's account at US Federal Reserve. Uses legitimate SWIFT credentials and knowledge of banking infrastructure. One of largest bank heists in history, demonstrating group's financial motivations.

                            May 2017
                            
                                WannaCry Global Ransomware Campaign
                                Lazarus Group deploys WannaCry ransomware globally using EternalBlue SMB exploit. Infects 200,000+ computers across 150+ countries. Causes billions in damages, affects hospitals, transportation, and critical infrastructure. Represents watershed moment in global cyber attacks.

                            2018-2019
                            
                                Cryptocurrency Exchange Hacks
                                Lazarus Group targets multiple cryptocurrency exchanges including Bithumb and others, stealing millions in cryptocurrency assets. Demonstrates shift toward cryptocurrency-specific operations for sanctions evasion.

                            2020-2021
                            
                                Supply Chain Compromise Campaign
                            Lazarus Group conducts AppleJeus campaign targeting cryptocurrency developers and blockchain platforms through supply chain compromise. Distributes malware-laden software updates and development tools.

                            2022-2025
                            
                                Ongoing Financial & Espionage Operations
                                Lazarus Group maintains active operations targeting financial institutions globally, with documented theft of billions from cryptocurrency exchanges and continued espionage against technology and defense sectors. Group demonstrates evolution toward more sophisticated persistent access techniques.

                            Apr 2026
                            
                                Drift Protocol $285M DeFi Exploit
                                UNC4736 subgroup (Sapphire Sleet) attributed to the $285M Drift Protocol DeFi exploit on the Solana blockchain. A 6-month social engineering campaign used VSCode/Cursor vulnerability exploitation and a malicious TestFlight app to compromise developer wallets. A durable nonce attack mechanism bypassed multisig governance. Also linked to the $50M Radiant Capital hack. Full Report →

## Known Exploits & CVEs

Lazarus Group has demonstrated sophisticated zero-day exploitation capabilities and rapid adoption of public exploits:

                                CVE
                                Vulnerability
                                Affected Product
                                CVSS

                                CVE-2017-0144
                                EternalBlue SMB Remote Code Execution
                                Microsoft Windows SMB
                                10.0

                                CVE-2018-4878
                                Use-After-Free in Adobe Flash
                                Adobe Flash Player
                                9.8

                                CVE-2020-0601
                                Spoofing in Windows CryptoAPI
                                Microsoft Windows
                                9.8

                                CVE-2021-34527
                                Print Spooler RCE
                                Microsoft Windows Print Spooler
                                10.0

                                CVE-2021-26855
                                Exchange Server SSRF
                                Microsoft Exchange Server
                                9.8

                                CVE-2022-21894
                                Windows ALPC Privilege Escalation
                                Microsoft Windows
                                8.4

## Cross-Vendor Naming Reference

Lazarus Group is tracked under numerous designations by security vendors and government agencies:

                                Vendor / Organization
                                Name Used

                                MITRE ATT&CK
                                APT38, Group G0039

                                CrowdStrike
                                ZINC

                                US Government (FBI/CISA)
                                Hidden Cobra

                                Mandiant / Google
                                Lazarus Group, APT38

                                Kaspersky
                                Guardians of Peace

                                Symantec
                                Lazarus Group

                                Palo Alto Networks
                                Labyrinth Chollima

                                Recorded Future
                                Whiskeybravo, Whiskeyalfa

## Related Threat Actors

APT37 (ScarCruft): Fellow North Korean-attributed group with focus on South Korean government and defense targeting. Different operational patterns and targets suggest separate RGB operational divisions.
                        Andariel: North Korean group with financial and espionage motivations. Suspected to be sub-unit or affiliated with Lazarus Group operations.
                        Kimsuky: North Korean APT43 group focusing on government and research institution espionage. Different operational focus but similar national origin.

## References & Sources

[1]
                            FBI Alert: "Lazarus Group / Hidden Cobra Activities"
                            FBI Cyber Division

                            [2]
                            Mandiant APT Report: "Lazarus Group: Tracking the World's Most Prolific Threat Actor"
                            Mandiant Intelligence Reports

                            [3]
                            CrowdStrike Intelligence: "ZINC: The North Korean Threat Actor"
                            CrowdStrike Global Threat Report

                            [4]
                            Kaspersky Lab Research: "Lazarus Group: The Guardians of Peace"
                            Kaspersky Securelist

                            [5]
                            CISA Alert: "WannaCry Ransomware Campaign Attribution"
                            CISA Alerts & Advisories

                Quick Facts

                    Country of Origin
                    
                        🇰🇵
                        North Korea

                    Nation-State Sponsored
                    Yes, RGB (Reconnaissance General Bureau)

                    Motivation
                    Financial Theft, Espionage, Sabotage

                    First Seen
                    2009

                    Last Seen
                    2025-Q1

                    Confidence Level
                    Very High

                    Associated Groups
                    APT38, ZINC, Hidden Cobra

                    Status
                    Active

                    Review Status
                    ⚠ Pending Human Review
