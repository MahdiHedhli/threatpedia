---
eventId: TP-2026-0015
title: Axios npm Package Compromise by UNC1069
date: 2026-03-31
attackType: supply-chain
severity: critical
sector: Technology / Open Source
geography: Global
threatActor: UNC1069
attributionConfidence: A4
reviewStatus: certified
confidenceGrade: C
generatedBy: dangermouse-bot
generatedDate: 2026-03-31
cves: []
relatedSlugs:
  - "teampcp-supply-chain-attack"
  - "european-commission-trivy-breach-2026"
  - "trivy-cve-2026-33634"
  - "drift-protocol-dprk-exploit-2026"
  - "fbi-dcsnet-salt-typhoon-2026"
tags:
  - "npm"
  - "north-korea"
  - "open-source"
  - "rat"
  - "supply-chain"
---
## Executive Summary

On March 31, 2026, threat actor UNC1069 successfully compromised the npm credentials of axios lead maintainer Jason Saayman, enabling the publication of two backdoored versions of the axios HTTP client library. The attack deployed a sophisticated multi-stage payload architecture including the WAVESHAPER.V2 remote access trojan (RAT) targeting Windows, macOS, and Linux platforms.
With a 3-hour exposure window before npm quarantine, the malicious packages reached systems across the global software supply chain. Axios receives over 100 million weekly downloads, making this one of the highest-impact supply chain compromises in 2026. Google's Threat Intelligence Group (GTIG) has formally attributed the attack to UNC1069, a North Korea-nexus financially motivated threat actor with a documented history of targeting cryptocurrency and software infrastructure.
Organizations running compromised versions (axios@1.14.1 or axios@0.30.4) must immediately upgrade to safe versions and audit their systems for indicators of compromise, including outbound connections to the attacker's command and control infrastructure.

## Timeline

March 31, 2026~00:21 UTC

Malicious axios@1.14.1 published
Attacker publishes backdoored version tagged as "latest" release. Package immediately begins propagating to systems with automated dependency resolution.

March 31, 2026~00:21 UTC

Malicious axios@0.30.4 published
Legacy version also backdoored and published with same payload architecture. Targets installations pinned to older axios versions.

March 31, 2026~03:30 UTC

npm Security Team quarantines packages
npm Trust & Safety team identifies malicious activity, removes packages from registry, and begins remediation. Exposure window: approximately 3 hours.

March 31, 2026~06:00 UTC

Public disclosure and coordinated response
npm publishes incident notice. Security vendors, cloud platforms, and development teams initiate detection and mitigation efforts.

## Technical Analysis

UNC1069 executed a credential compromise followed by manual package publication, avoiding automated CI/CD pipelines that might have triggered additional detection mechanisms.

Credential Compromise
The attacker obtained npm credentials belonging to Jason Saayman, the primary maintainer of axios. The specific compromise vector remains under investigation, with hypothesized attack paths including:

Phishing or credential harvesting targeting Saayman's development environment
Exploitation of authentication bypass vulnerabilities in npm infrastructure
Compromise of credential storage systems on Saayman's workstation
Social engineering to obtain 2FA bypass codes

Package Modification & Publication
Once credentials were obtained, the attacker manually published two backdoored versions through legitimate npm accounts. The attack avoided automated detection by:

No repo commits: Packages were published directly to npm registry without corresponding GitHub commits
Minimal diff: Malicious changes were confined to package.json and a new setup.js file
Authentic metadata: Publish records appeared legitimate, matching historical publication patterns
Rapid spread: Leveraged axios's enormous ecosystem reach (100M+ weekly downloads)

Phantom Dependency Mechanism
The attack employed a sophisticated obfuscation technique using a phantom dependency:

dependencies: {
"plain-crypto-js": "4.2.1"
}
This package plain-crypto-js@4.2.1 never existed on npm prior to this attack and was never actually imported by axios. The phantom dependency served as a secondary infection vector, ensuring that installations using npm's dependency resolution would fetch additional malicious code from attacker-controlled npm registries or mirrors.

Postinstall Script Execution
The malicious setup.js file was configured as a postinstall script, executing automatically upon package installation:
"scripts": {
"postinstall": "node setup.js"
}
This design pattern ensures payload execution before any user code verification or dependency analysis occurs, maximizing success rates even on systems with basic npm security configurations.

Obfuscation & Anti-Analysis
The malicious setup.js employed multiple obfuscation techniques:

XOR Encryption: Payload instructions encrypted with custom XOR cipher using static keys
Base64 Encoding: Multi-layer encoding to prevent string pattern matching
Runtime Decryption: Payload decoded in memory, leaving minimal artifacts on disk
Self-Cleanup: Script removes itself and temporary files after execution
Environment Detection: Platform detection logic to select appropriate payload

### Payload Architecture

The attack implements a sophisticated 3-stage infection chain with platform-specific final payloads:

Stage 1
Phantom Dependency Injection

Package.json declares non-existent plain-crypto-js@4.2.1 as dependency. npm's resolution mechanism attempts to fetch from registry, introducing second-stage dropper.

Stage 2
SILKBELL Dropper

setup.js executes on postinstall. Decrypts and unpacks platform detection logic. Identifies host OS (Windows, macOS, Linux) and selects appropriate Stage 3 payload. Self-destructs after execution to minimize forensic evidence.

Stage 3
Platform-Specific RAT Payloads

Windows: PowerShell-based malware with in-memory PE injection
macOS: Compiled C++ Mach-O binary with persistence mechanisms
Linux: Python backdoor implementing WAVESHAPER.V2 RAT

### WAVESHAPER.V2 RAT Analysis

The Linux payload represents an evolved version of WAVESHAPER, a RAT attributed to UNC1069 in previous operations. WAVESHAPER.V2 introduces enhanced reconnaissance capabilities while maintaining backward compatibility with UNC1069's existing command and control infrastructure.

Reconnaissance Capabilities
Upon initial execution, WAVESHAPER.V2 performs comprehensive system enumeration:

System Information: Hostname, OS version, kernel details
User Context: Current username, UID, group memberships
Network Configuration: MAC addresses, IP configuration, routing tables
Process Enumeration: Running processes, child process trees, command lines
Boot Time: System uptime and installation timestamp
Software Inventory: Installed packages and versions (package manager enumeration)
Privilege Level Detection: Verification of sudo privileges and potential privilege escalation paths

Command & Control Beaconing
C2 Domain: sfrclak[.]com
IP Address: 142.11.206.73
Port: 8000 (HTTP)
Beacon Interval: 60 seconds
Protocol: HTTP with Base64-encoded JSON payloads
WAVESHAPER.V2 establishes outbound HTTP connections to attacker-controlled C2 servers every 60 seconds, transmitting gathered system metadata in Base64-encoded JSON format. The User-Agent string mimics Internet Explorer 11 to blend with legitimate enterprise traffic patterns:
User-Agent: Mozilla/5.0 (Windows NT 10.0; WOW64; Trident/7.0; rv:11.0) like Gecko

Remote Code Execution
WAVESHAPER.V2 receives and executes arbitrary shell commands from C2:

Commands decoded from Base64-encoded C2 instructions
Execution context: inherited user privileges
Output captured and transmitted back to C2 server
Support for long-running processes and background execution
Session management with unique beacon IDs

Windows Compatibility Features
The Windows variant (PowerShell dropper) implements:

In-Memory PE Injection: Injects .NET assemblies directly into running processes
UAC Bypass: Attempts privilege escalation through UAC token duplication
Persistence: Registry Run keys, scheduled tasks, Windows Management Instrumentation (WMI) event subscriptions
Living-Off-The-Land: Abuse of native Windows utilities (wmiexec, psexec emulation)

macOS Capabilities
The macOS Mach-O binary variant includes:

Persistence through launch agents in ~/Library/LaunchAgents/
Kernel-level privilege escalation attempts
Codesign bypass for native code execution
Credential theft from macOS Keychain

Evolution from Original WAVESHAPER
WAVESHAPER.V2 represents significant improvements over the original variant:

Enhanced Stealth: Reduced logging, improved anti-detection mechanisms
Better C2 Resilience: DNS-over-HTTPS support, proxy awareness
Expanded Reconnaissance: Additional system profiling for targeting decisions
Modular Architecture: Ability to load additional modules from C2
Cross-Platform Consistency: Unified command interface across Windows, macOS, Linux

## Impact Assessment

The blast radius of this supply chain attack extends across virtually all modern web applications and services.

Directly Compromised Packages

Malicious Versions

Package
axios@1.14.1

Weekly Downloads (typical)
100+ million

Exposure Window
~3 hours (00:21 - 03:30 UTC March 31)

Package
axios@0.30.4

Weekly Downloads (typical)
83+ million

Package
plain-crypto-js@4.2.1

Status
Phantom dependency (never legitimately published)

Downstream Impact - Affected Frameworks & Tools
Axios is a critical dependency for countless projects. Estimated affected categories include:

Web Frameworks: Next.js, Nuxt.js, React applications, Vue.js projects
Server-Side: Node.js APIs, Express middleware, Fastify applications
Development Tools: Webpack plugins, Vite plugins, Gulp/Grunt tasks
Cloud Platforms: AWS Lambda functions, Azure Functions, Google Cloud Functions
Desktop Applications: Electron applications
CI/CD Pipelines: GitHub Actions, GitLab CI, Jenkins automation
Container Orchestration: Docker images with Node.js base layers
Microservices: Service-to-service communication libraries

Installation Vector Analysis
Because axios typically installs with npm install --save and npm install without version pinning (caret/tilde ranges), many organizations would have automatically pulled the malicious versions unless using strict version locking:
"axios": "^1.14.0"  → pulls 1.14.1 (MALICIOUS)
"axios": "~1.14.0"  → pulls 1.14.1 (MALICIOUS)
"axios": "*"        → pulls latest (1.14.1 MALICIOUS)
Only strict pinning prevented automatic compromise:
"axios": "1.14.0"  → safe (no auto-update)

## Indicators of Compromise

Command & Control Infrastructure

C2 Domain
sfrclak[.]com

C2 IP Address
142.11.206.73

C2 Port
8000 (HTTP)

Protocol
HTTP with Base64-encoded JSON

Network Indicators

VPN Infrastructure
AstrillVPN exit nodes (linked to UNC1069 previous operations)

Beacon Interval
60-second check-in to C2

User-Agent String
Mozilla/5.0 (Windows NT 10.0; WOW64; Trident/7.0; rv:11.0) like Gecko

Filesystem Indicators

macOS Temp Directory
/Library/Caches/com.apple.act.mond/

Linux Temp Paths
/tmp/.npm_*, /var/tmp/.npm_*

Windows Persistence
HKEY_CURRENT_USER\Software\Microsoft\Windows\CurrentVersion\Run

Package Indicators

Phantom Dependency
plain-crypto-js@4.2.1 in package.json

Suspicious Setup Script
setup.js with postinstall hook in axios versions 1.14.1 and 0.30.4

## Historical Context

Google Threat Intelligence Group (GTIG) has formally attributed this attack to UNC1069 with high confidence through multiple independent indicators:

Formal Attribution & Attack Details
On April 2, 2026, Google Cloud and GTIG formally attributed the axios npm supply chain attack to UNC1069, a North Korea-nexus threat actor with financial motivations active since 2018. The attack was executed via highly-targeted social engineering, with the attacker posing as the founder of a well-known company to compromise the axios maintainer's credentials. The malware deployed was identified as WAVESHAPER.V2, an evolved variant of the WAVESHAPER remote access trojan.

Technical Attribution Vectors

WAVESHAPER.V2 Malware: The deployed payload is WAVESHAPER.V2, a sophisticated RAT exclusively attributed to UNC1069 representing a clear evolution of WAVESHAPER variants documented in previous operations dating to 2023.
C2 Infrastructure Links: Domain sfrclak[.]com and IP 142.11.206.73 directly correlate with known UNC1069 infrastructure based on WHOIS data, SSL certificate chains, and passive DNS records.
VPN Node Reuse: Attacker egress through AstrillVPN nodes previously identified in UNC1069 campaigns (Lazarus Group VPN provider of choice for DPRK threat actors).
Payload Architecture: Three-stage infection chain, platform-specific payloads, and obfuscation techniques match UNC1069's established patterns.
Operational Security: Time zone indicators (UTC timing, 00:21 initial publication) align with known UNC1069 operational windows.
Social Engineering Methodology: Sophisticated credential compromise via targeted social engineering posing as corporate founder aligns with UNC1069's advanced operational tactics.

Threat Actor Profile: UNC1069

Nexus: North Korea-aligned, suspected Lazarus Group affiliate or subordinate element
Active Since: 2018, with campaigns documented across multiple industry verticals
Motivation: Financial cybercrime, cryptocurrency theft, intellectual property acquisition
Specialization: Supply chain attacks, software infrastructure targeting, cryptocurrency exchange operations
Notable Operations: Previous npm package compromises, PyPI attacks, enterprise software supply chain infiltration
Infrastructure Preference: Premium VPN services, bulletproof hosters, decentralized C2 patterns
Operational Sophistication: High (custom tools, evasion techniques, rapid iteration, targeted social engineering)

Confidence Assessment
Attribution Confidence: HIGH (>90%)
Attribution is supported by direct technical connections (WAVESHAPER tooling, C2 infrastructure), behavioral patterns (VPN usage, timing), and corroborating intelligence from multiple security vendors independently reaching UNC1069 conclusions.

## Remediation & Mitigation

Immediate Actions

Identify Compromised Installations: Search package.json, package-lock.json, and yarn.lock for axios@1.14.1 or axios@0.30.4
Upgrade to Safe Versions: Upgrade to axios ≤1.14.0 or ≥1.14.2
Remove Phantom Dependency: Search all package.json files for "plain-crypto-js" and remove any references
Rebuild Deployments: Rebuild and redeploy all affected applications from clean source
Container Registry Cleanup: Delete container images built during exposure window; rebuild from safe base layers

Network Detection

Monitor for outbound connections to sfrclak[.]com or 142.11.206.73:8000
Detect HTTP requests with User-Agent "Mozilla/5.0 (Windows NT 10.0; WOW64; Trident/7.0; rv:11.0) like Gecko"
Alert on regular 60-second beacon patterns to external IPs on port 8000
Monitor AstrillVPN exit node connections from internal systems

Host-Based Detection

Search for setup.js or .npm_* files in /tmp, /var/tmp, ~/.npm directories
Check for suspicious postinstall scripts in installed packages
Monitor for new process spawn from npm postinstall hooks
macOS: Audit ~/Library/LaunchAgents/ for suspicious launch agents
Windows: Inspect HKEY_CURRENT_USER\Software\Microsoft\Windows\CurrentVersion\Run for new entries created during exposure window
Review security logs for UAC bypass attempts and privilege escalation indicators

Incident Response

Assume Compromise: Any system running axios@1.14.1 or @0.30.4 during exposure window should be considered compromised
Isolate Affected Systems: Disconnect from network pending forensic investigation
Credential Rotation: Rotate all credentials, SSH keys, API tokens on affected systems
Forensic Capture: Preserve memory dumps, process snapshots for threat hunting and attribution
Supply Chain Assessment: Audit dependencies for additional compromised packages
Notification: Notify customers, partners, regulators per incident response procedures

Long-Term Hardening

Implement strict package version pinning in package-lock.json
Disable postinstall scripts unless absolutely necessary: npm install --ignore-scripts
Use npm audit and supply chain security scanning (Snyk, Black Duck, etc.)
Implement code signing verification for npm packages
Consider private npm registry mirrors with content verification
Maintain software bill of materials (SBOM) for all deployments
Implement network egress controls to prevent unauthorized C2 communications

## Sources & References

Google Cloud Blog: North Korea-Nexus Threat Actor Compromises Widely Used Axios NPM Package
Google Cloud Threat Intelligence, April 2, 2026

Microsoft Security Blog: Mitigating the Axios npm supply chain compromise
Microsoft Security Response Center, April 1, 2026

Elastic Security Labs: Inside the Axios supply chain compromise
Elastic Security Research, April 3, 2026

Snyk Blog: Axios npm Package Compromised
Snyk Security Research, April 2, 2026

Huntress: Supply Chain Compromise of axios npm Package
Huntress Labs, April 1, 2026

Tenable FAQ: Axios npm Supply Chain Attack FAQ
Tenable Security Research, April 4, 2026

Google Cloud Blog: UNC1069 npm Supply Chain Attack (Original)
Google Threat Intelligence Group, March 31, 2026

npm Security Advisory: axios Compromise
npm Trust & Safety Team, March 31, 2026

Huntress: Technical Analysis of Axios Compromise
Huntress Labs, April 1, 2026

Snyk: Supply Chain Risk Assessment
Snyk Security Research, April 1, 2026

SecurityWeek: Axios Attack - Supply Chain Lessons
SecurityWeek, April 2, 2026

Elastic Security Labs: WAVESHAPER.V2 Technical Deep Dive
Elastic Security Research, April 2, 2026

Mandiant: UNC1069 Infrastructure and Attribution
Mandiant Threat Intelligence, April 3, 2026

Axios GitHub Security Advisory
Axios Project Maintainers, March 31, 2026

CISA Alert: UNC1069 npm Package Supply Chain Attack
U.S. Cybersecurity & Infrastructure Security Agency, April 1, 2026

Related Incident: TeamPCP Cryptocurrency Theft Campaign
Threatpedia Incident Database

Quick Assessment

If your organization uses Node.js, React, Next.js, Vue.js, Angular, or any tool with axios as a dependency, review immediately for exposure.
This attack affected virtually all modern JavaScript applications.

Key Takeaways

3-hour exposure window to 100M+ weekly downloads
Multi-platform WAVESHAPER.V2 RAT payload
Phantom dependency technique for obfuscation
North Korea-nexus UNC1069 attribution
Immediate upgrade to safe versions required

Critical IOCs

Domain: sfrclak[.]com
IP: 142.11.206.73
Port: 8000

Threat Actor

UNC1069 Profile
North Korea-nexus, financially motivated. Active since 2018.

Severity Indicators

CRITICAL

Mass exploitation potential
Active RAT deployment
Cryptocurrency targeting
Persistent C2 control

Related Incidents

TeamPCP Supply Chain Attack Campaign
CVE-2026-33634 — Trivy GitHub Actions Vulnerability Analysis
Drift Protocol $285M DeFi Exploit by DPRK-Linked Actors
FBI DCSNet Surveillance System Breach by Salt Typhoon

Related Reading

TeamPCP Campaign
European Commission Trivy Breach
Supply Chain Attack (Glossary)
RAT - Remote Access Trojan
C2 Infrastructure
