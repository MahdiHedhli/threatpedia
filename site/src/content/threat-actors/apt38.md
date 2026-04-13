---
name: APT38
aliases:
  - "Bluenoroff"
  - "Alluring Pisces"
  - "BRONZE TEMPLE"
affiliation: North Korea
motivation: Financial
status: active
reviewStatus: under_review
generatedBy: dangermouse-bot
generatedDate: 2026-04-13
---
## Overview

APT38 (Bluenoroff) is a financially-motivated North Korean threat actor attributed to the Reconnaissance General Bureau (RGB), North Korea's primary intelligence service. Identified as operating since at least 2014, APT38 specializes in targeting financial institutions, cryptocurrency exchanges, and banking infrastructure for direct monetary theft. The group is responsible for some of the largest financial cybercrimes in history, stealing billions of dollars in currency, cryptocurrency, and other assets.

                    APT38 represents a unique threat actor in that the group's primary motivation is financial gain rather than espionage, with the stolen funds supporting North Korea's regime and sanctions evasion. The group maintains sophisticated banking malware, exploits, and infrastructure to target SWIFT networks, ATM systems, and cryptocurrency exchanges. APT38 demonstrates deep knowledge of banking systems, financial protocols, and operational security measures implemented by financial institutions.

                    As of 2025, APT38 continues active financial theft operations with renewed focus on cryptocurrency theft, DeFi platform exploitation, and emerging financial technologies. The group maintains multiple operational teams targeting different financial verticals and demonstrates rapid adaptation to security controls and anti-fraud measures. Their operations remain a significant threat to global financial infrastructure and cryptocurrency ecosystems.

## Tactics, Techniques & Procedures (TTPs)

MITRE ATT&CK Techniques
                        
                            Initial Access:
                            
                                T1190: Exploit Public-Facing Application
                                T1566: Phishing
                                T1199: Trusted Relationship
                                T1200: Hardware Additions
                            
                            Execution:
                            
                                T1059: Command and Scripting Interpreter
                                T1203: Exploitation for Client Execution
                                T1072: Software Deployment Tools
                            
                            Persistence:
                            
                                T1547: Boot or Logon Autostart Execution
                                T1547.001: Registry Run Keys
                                T1137: Office Application Startup
                            
                            Credential Access:
                            
                                T1056: Input Capture
                                T1110: Brute Force
                                T1056.001: Input Capture - Keylogging
                            
                            Discovery:
                            
                                T1087: Account Discovery
                                T1010: Application Window Discovery
                                T1120: Peripheral Device Discovery
                            
                            Impact:
                            
                                T1491: Defacement
                                T1561: Disk Wipe
                                T1570: Lateral Tool Transfer

                        Common Attack Vectors
                        
                            SWIFT Network Exploitation: Direct targeting of SWIFT interfaces and banking protocols to execute unauthorized transfers from high-value accounts.
                            ATM Malware Deployment: Custom malware targeting ATM operating systems to enable unlimited cash extraction and transaction manipulation.
                            Cryptocurrency Exchange Targeting: Focused operations against digital currency exchanges, hot wallets, and cryptocurrency trading platforms.
                            Spear-phishing & Social Engineering: Highly targeted phishing campaigns against banking employees and cryptocurrency service providers.
                            Vulnerability Exploitation: Rapid exploitation of zero-day and known vulnerabilities in banking systems, exchanges, and financial services.

                        Tools & Malware
                        
                            SWIFT Malware: Custom tools designed to interact with SWIFT systems, enabling unauthorized fund transfers while evading detection.
                            Fastpos: POS malware targeting point-of-sale systems in retail and hospitality sectors for payment card theft.
                            Dolphin: Custom backdoor for banking network reconnaissance and credential harvesting.
                            Riojatch: Loader malware used in early stages of compromise to stage additional tools and implants.
                            Destover: Advanced RAT used for post-compromise network reconnaissance and lateral movement.
                            Custom Cryptocurrency Stealers: Specialized malware targeting cryptocurrency wallets, exchanges, and DeFi platforms.
                            ATM Withdrawal Tools: Custom utilities for ATM network access and cash extraction authorization.

                        Infrastructure Patterns
                        
                            Compromised Banking Networks: Operators maintain persistent access in compromised banking systems and use them as staging points.
                            International Command-and-Control: Distributed C2 infrastructure across multiple countries to evade attribution and tracking.
                            Cryptocurrency Mixing Services: Use of cryptocurrency tumblers and mixing services to launder stolen digital assets.
                            Underground Banking Channels: Exploitation of underground banking networks and informal value transfer systems (hawala, etc.).
                            Tor and VPN Infrastructure: Heavy use of anonymization services to mask communications and malware C2.

## Targeted Industries & Organizations

Sector
                                Notable Targets / Focus

                                Banking & Financial Services
                                Commercial banks, investment banks, central banks, SWIFT participants, ATM operators

                                Cryptocurrency & Digital Assets
                                Cryptocurrency exchanges, crypto trading platforms, DeFi protocols, digital wallet providers

                                Payment Processing
                                Payment processors, POS system providers, payment gateway operators, card networks

                                Financial Technology
                                Fintech startups, mobile banking apps, investment platforms, robo-advisors

                                Money Services
                                Money remittance services, currency exchange, international wire services

                                Cryptocurrency Services
                                Mining operations, staking providers, NFT marketplaces, blockchain platforms

## Attributable Attacks Timeline

2014-2015
                            
                                Early Banking Operations
                                APT38 begins targeted operations against financial institutions in Asia-Pacific region using custom banking malware.

                            Feb 2016
                            
                                Bangladesh Bank SWIFT Heist
                                Historic theft of $81 million from Bangladesh Bank central bank via SWIFT network manipulation, largest bank heist in history at the time.

                            2016-2017
                            
                                Global Bank Targeting Campaign
                                Expansion to target financial institutions across multiple continents using similar SWIFT attack techniques.

                            2018-2019
                            
                                Cryptocurrency Exchange Targeting
                                Shift toward cryptocurrency exchanges and digital asset theft with multiple high-value heists from major exchanges.

                            2020-2021
                            
                                DeFi Platform Focus
                                Operations targeting decentralized finance platforms, stealing tens of millions in cryptocurrency through exploit and theft.

                            2022-2023
                            
                                Bridge Exploit Campaigns
                                Operations targeting cross-chain bridge protocols, extracting hundreds of millions in cryptocurrency.

                            2024-2025
                            
                                Continued Financial Targeting
                            Ongoing operations against financial institutions and cryptocurrency platforms with updated malware toolkits.

## Known Exploits & CVEs

CVE ID
                                Vulnerability
                                Affected Product
                                Year

                                CVE-2013-4806
                                Internet Explorer Use-After-Free
                                Microsoft Internet Explorer
                                2013

                                CVE-2015-0566
                                Adobe Flash Remote Code Execution
                                Adobe Flash Player
                                2015

                                CVE-2016-3714
                                ImageMagick Remote Code Execution
                                ImageMagick
                                2016

                                CVE-2017-0290
                                Windows OLE Remote Code Execution
                                Microsoft Windows
                                2017

                                CVE-2021-21222
                                Telegram Bot API RCE
                                Telegram Platform
                                2021

## Cross-Vendor Naming Reference

Vendor
                                Attribution Name

                                Mandiant
                                APT38

                                CrowdStrike
                                STARDUST CHOLLIMA

                                Kaspersky
                                Bluenoroff

                                Recorded Future
                                BRONZE TEMPLE

                                Symantec
                                Alluring Pisces

                                US-CERT
                                Hidden Cobra

## Related Threat Actors

APT38 operates within the broader North Korean state-sponsored ecosystem. Related groups include:
                    
                        Lazarus Group (APT38 parent) - Broader NK threat actor group
                        APT37 (REAPER) - North Korean espionage group
                        Kimsuky (APT43) - North Korean defense research targeting
                        Andariel - North Korean dual-purpose group
                        Lazarus - Broader North Korean operations

## References & Sources

[1] US FBI/Treasury Report: "APT38 Financial Theft Operations" (2024)
                        [2] Mandiant Intelligence Report: "APT38 - North Korean Financial Cybercrime Operations" (2023)
                        [3] Kaspersky Securelist: "Bluenoroff - Banking Malware Attribution Report" (2022)
                        [4] Recorded Future: "BRONZE TEMPLE Cryptocurrency Theft Campaign" (2021)
                        [5] CrowdStrike Adversary Report: "STARDUST CHOLLIMA Banking Heists" (2020)
                        [6] CISA Alert: "North Korean APT38 Targeting Financial Institutions" (2019)
                        [7] Symantec Threat Report: "Alluring Pisces - Bangladesh Bank Heist Analysis" (2016)
                        [8] Federal Reserve and BIS Report: "SWIFT Attack Methodologies and Attribution to APT38" (2017)

                Quick Facts

                    Country of Origin
                    
                        🇰🇵
                        North Korea (RGB)

                    Nation-State Sponsored
                    Yes - RGB Intelligence

                    Motivation
                    Financial Theft

                    First Seen
                    2014

                    Last Seen
                    2025-Q1

                    Confidence Level
                    Very High

                    Associated Groups
                    North Korean RGB

                    Status
                    ACTIVE

                    Review Status
                    ⚠ Pending Human Review
