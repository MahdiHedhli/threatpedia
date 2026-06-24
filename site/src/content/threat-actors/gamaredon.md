---
name: "Gamaredon"
aliases:
  - "Primitive Bear"
  - "ACTINIUM"
  - "Aqua Blizzard"
  - "Armageddon"
  - "Trident Ursa"
  - "Shuckworm"
  - "BlueAlpha"
  - "UAC-0010"
  - "DEV-0157"
  - "IRON TILDEN"
affiliation: "Russia (FSB-linked state-sponsored)"
motivation: "Espionage"
status: active
country: "Russia"
firstSeen: "2013"
lastSeen: "2026"
targetSectors:
  - "Government"
  - "Military"
  - "Defense"
  - "Law Enforcement"
  - "Judiciary"
  - "Non-Governmental Organizations"
  - "Non-Profit"
  - "Critical Infrastructure"
targetGeographies:
  - "Ukraine"
  - "Crimea"
  - "European Union"
  - "NATO Member States"
tools:
  - "Pterodo"
  - "Pteranodon"
  - "GammaLoad"
  - "GammaSteel"
  - "PowerPunch"
  - "QuietSieve"
  - "ObfuBerry"
  - "ObfuMerry"
  - "DinoTrain"
  - "DesertDown"
  - "UltraVNC"
  - "AnyDesk"
  - "USB propagation malware"
mitreMappings:
  - techniqueId: "T1566.001"
    techniqueName: "Spearphishing Attachment"
    tactic: "Initial Access"
    notes: "Uses malicious email attachments, archives, HTM/HTA files, LNK files, and remote-template documents as primary initial access vectors."
  - techniqueId: "T1059.001"
    techniqueName: "PowerShell"
    tactic: "Execution"
    notes: "Uses PowerShell for staging, command execution, document theft, cookie theft, and USB propagation workflows."
  - techniqueId: "T1059.005"
    techniqueName: "Visual Basic"
    tactic: "Execution"
    notes: "Relies heavily on VBScript and VBA payloads, including Outlook and Office macro abuse."
  - techniqueId: "T1053.005"
    techniqueName: "Scheduled Task"
    tactic: "Persistence"
    notes: "Creates scheduled tasks to repeatedly execute scripts and downloaded components."
  - techniqueId: "T1137"
    techniqueName: "Office Application Startup"
    tactic: "Persistence"
    notes: "Injects malicious macros or remote-template references into Office documents and abuses Outlook VBA projects."
  - techniqueId: "T1027.010"
    techniqueName: "Command Obfuscation"
    tactic: "Defense Evasion"
    notes: "Frequently changes obfuscated PowerShell, VBScript, and lightweight payload variants to avoid static detection."
  - techniqueId: "T1005"
    techniqueName: "Data from Local System"
    tactic: "Collection"
    notes: "Uses file stealers such as GammaSteel, QuietSieve, and Pterodo-related components to collect documents and screenshots."
  - techniqueId: "T1025"
    techniqueName: "Data from Removable Media"
    tactic: "Collection"
    notes: "Copies malware to removable media and steals documents from attached USB drives."
  - techniqueId: "T1041"
    techniqueName: "Exfiltration Over C2 Channel"
    tactic: "Exfiltration"
    notes: "Uploads collected documents and host data to actor-controlled infrastructure."
  - techniqueId: "T1568.001"
    techniqueName: "Fast Flux DNS"
    tactic: "Command and Control"
    notes: "Uses frequently changing DNS, third-party DNS resolvers, Telegram, Telegraph, and short-lived infrastructure for C2 resilience."
attributionConfidence: A1
attributionRationale: "CERT-UA reports UAC-0010/Armageddon activity by former Crimea SBU officers serving Russia's FSB, and Microsoft, Unit 42, Symantec, and MITRE consistently describe Gamaredon as an FSB-linked Russian espionage actor focused on Ukraine."
reviewStatus: draft_ai
generatedBy: dangermouse-bot
generatedDate: 2026-06-20
generation:
  provider: "OpenAI"
  model: "gpt-5.5"
  tool: "codex"
  agent: "dangermouse-bot"
  promptProfile: "magrathea-threat-actor-pilot"
tags:
  - "nation-state"
  - "russia"
  - "fsb"
  - "ukraine"
  - "espionage"
  - "gamaredon"
  - "armageddon"
  - "uac-0010"
sources:
  - url: "https://cert.gov.ua/article/5160737"
    publisher: "CERT-UA"
    publisherType: government
    reliability: R1
    publicationDate: "2023-07-13"
    accessDate: "2026-06-20"
    archived: false
  - url: "https://www.microsoft.com/en-us/security/blog/2022/02/04/actinium-targets-ukrainian-organizations/"
    publisher: "Microsoft Security"
    publisherType: vendor
    reliability: R1
    publicationDate: "2022-02-04"
    accessDate: "2026-06-20"
    archived: false
  - url: "https://unit42.paloaltonetworks.com/trident-ursa/"
    publisher: "Unit 42"
    publisherType: vendor
    reliability: R1
    publicationDate: "2022-12-20"
    accessDate: "2026-06-20"
    archived: false
  - url: "https://www.welivesecurity.com/2020/06/11/gamaredon-group-grows-its-game/"
    publisher: "ESET Research"
    publisherType: vendor
    reliability: R1
    publicationDate: "2020-06-11"
    accessDate: "2026-06-20"
    archived: false
  - url: "https://www.security.com/threat-intelligence/shuckworm-russia-ukraine-military"
    publisher: "Symantec"
    publisherType: vendor
    reliability: R1
    publicationDate: "2023-06-15"
    accessDate: "2026-06-20"
    archived: false
  - url: "https://attack.mitre.org/groups/G0047/"
    publisher: "MITRE ATT&CK"
    publisherType: research
    reliability: R1
    publicationDate: "2026-05-12"
    accessDate: "2026-06-20"
    archived: false
---

## Executive Summary

Gamaredon, also tracked as Primitive Bear, ACTINIUM, Aqua Blizzard, Armageddon, Trident Ursa, Shuckworm, BlueAlpha, and UAC-0010, is a Russian state-sponsored cyber-espionage group focused overwhelmingly on Ukraine. Ukrainian government reporting and major security vendors describe the actor as linked to Russia's Federal Security Service (FSB), with CERT-UA identifying UAC-0010 as activity conducted by former Crimea-based Ukrainian security officers who began serving the FSB after Russia's 2014 occupation of Crimea.

The group has been active since at least 2013 or 2014 and is notable less for elite stealth than for persistence, volume, and rapid operational iteration. Microsoft observed ACTINIUM pursuing access to Ukrainian government, military, NGO, judiciary, law enforcement, and non-profit organizations for intelligence collection, persistence, and movement into related organizations. CERT-UA described UAC-0010 as one of Ukraine's most persistent cyber threats, with infections concentrated in Ukrainian government information systems and a primary mission of cyber espionage against security and defense forces.

Gamaredon's tradecraft centers on phishing, malicious documents, HTM/HTA droppers, LNK files, PowerShell, VBScript, Office macro and template abuse, scheduled tasks, and document-stealing malware. Its operations are often noisy and repetitive, but the actor compensates with high tempo, large numbers of infrastructure changes, short-lived payload variants, and aggressive re-compromise patterns.

## Notable Campaigns

### 2014-2021 -- Persistent Ukrainian Government and Security Targeting

Ukrainian and ESET reporting describe Gamaredon as active against Ukrainian institutions over many years, with a focus on state bodies, security and defense organizations, law enforcement, and related personnel. The group used spearphishing lures tied to armed conflict, criminal proceedings, international cooperation, and official correspondence, then deployed tools such as Pterodo/Pteranodon, UltraVNC, droppers, scripts, and file stealers.

ESET documented post-compromise tooling that spread through Outlook contacts, injected malicious macros or remote-template references into Office documents, enumerated files on local, removable, and mapped drives, and uploaded documents to command-and-control servers. This tooling shows the actor's emphasis on document collection, internal propagation, and repeated infection rather than quiet long-term stealth.

### 2022 -- Wartime Phishing and UAC-0010 GammaLoad/GammaSteel Activity

After Russia's full-scale invasion of Ukraine, Gamaredon continued high-volume operations under the UAC-0010/Armageddon tracking cluster. CERT-UA reported multiple 2022 campaigns using HTM droppers, RAR archives, LNK files, and PowerShell chains to deliver GammaLoad and GammaSteel against Ukrainian targets. Microsoft separately reported ACTINIUM targeting Ukrainian organizations and entities related to Ukrainian affairs, including organizations involved in emergency response, territorial security, and humanitarian aid coordination.

Unit 42 observed Trident Ursa activity continuing through the conflict, including more than 500 new domains and 200 samples over a ten-month period in 2022. The same reporting described attempts to broaden collection against Ukraine's allies, including an unsuccessful attempt to compromise a petroleum refining company in a NATO member state.

### 2023 -- Military and Security Intelligence Collection

CERT-UA's July 2023 summary described UAC-0010 as a continuing high-volume threat against Ukrainian security and defense forces, with file theft often occurring within 30 to 50 minutes of initial compromise when the actor is interested in the host. CERT-UA also described infected systems accumulating 80 to 120 or more malicious or infected files over roughly a week, a pattern that makes cleanup difficult if even one infected file or document remains.

Symantec reported Shuckworm intrusions in 2023 against Ukrainian military, security, research, and government organizations. The actor sought reports and documents related to military deaths, engagements, air strikes, arsenal inventories, training, and personnel information, indicating intelligence collection intended to support Russia's wartime objectives.

## Technical Capabilities

Gamaredon relies on simple but frequently refreshed tooling. Initial access commonly uses spearphishing emails, messenger messages, compromised accounts, malicious archives, HTM/HTA files, LNK files, remote-template Office documents, and macro-enabled payloads. The actor frequently stages execution through PowerShell, VBScript, Windows Script Host, mshta.exe, Office macros, and scheduled tasks.

The group's malware and scripts support document theft, screenshots, host profiling, payload download, command execution, persistence, and propagation through removable media or shared Office documents. Publicly documented tools and families include Pterodo/Pteranodon, GammaLoad, GammaSteel, PowerPunch, QuietSieve, ObfuBerry, ObfuMerry, DinoTrain, DesertDown, USB propagation scripts, UltraVNC, and AnyDesk. ESET and Microsoft describe a pattern of lightweight stagers and rapidly changing variants that may be easier to replace than to protect with deep stealth.

For persistence, Gamaredon commonly creates scheduled tasks, Run keys, Startup folder entries, Office macro or template modifications, and Outlook VBA projects. For collection, it searches for office documents, archives, images, scripts, databases, and other files on local disks, network shares, and removable drives. CERT-UA reported GammaSteel use for rapid file theft, while Symantec reported USB propagation and the use of Giddome-like infostealer activity in 2023 operations.

Gamaredon's infrastructure is resilient and disposable. Microsoft observed frequent domain and IP changes, randomized subdomains, and a preference for large pools of operational infrastructure. Unit 42 and CERT-UA described DNS workarounds and C2 discovery through third-party DNS services, Telegram, and Telegraph. Symantec observed short-lived infrastructure and repeated tooling refreshes, including many PowerShell script variants in early 2023.

## Attribution

Attribution to Russia's FSB is supported by Ukrainian government reporting and consistent vendor assessments. CERT-UA described UAC-0010/Armageddon as activity conducted by former Crimea SBU officers who betrayed their oath in 2014 and began serving Russia's FSB. Microsoft reported that the Ukrainian government publicly attributed ACTINIUM/Gamaredon to the FSB and assessed that ACTINIUM operated out of Crimea with cyber-espionage objectives.

Unit 42 described Trident Ursa/Gamaredon/UAC-0010/Primitive Bear/Shuckworm as attributed by Ukraine's Security Service to Russia's FSB and as one of the most pervasive APTs targeting Ukraine. Symantec described Shuckworm/Gamaredon/Armageddon as a Russia-linked group almost exclusively focused on Ukraine since 2014, and noted Ukrainian public statements that the group operates on behalf of the FSB. MITRE ATT&CK tracks the group as G0047 and records Gamaredon as a suspected Russian cyber-espionage group targeting Ukrainian military, law enforcement, judiciary, non-profit, and NGO organizations since at least 2013.

## MITRE ATT&CK Profile

**Initial Access**: Spearphishing attachments (T1566.001), malicious archives, HTM/HTA droppers, LNK files, remote-template Office documents, compromised email or messenger accounts, and lures impersonating Ukrainian government or military topics.

**Execution**: PowerShell (T1059.001), Visual Basic and VBA (T1059.005), Windows Script Host, mshta.exe, command shell scripts, Office macros, and downloaded payload execution.

**Persistence**: Scheduled tasks (T1053.005), Run keys and Startup folder entries, Office Application Startup (T1137), modified Office templates, Outlook VBA projects, and repeated reinfection through infected files or removable media.

**Defense Evasion**: Obfuscated scripts and command lines (T1027.010), frequent payload variation, Base64-encoded content, randomized names, short-lived infrastructure, geofenced payload retrieval, and abuse of legitimate services for C2 discovery.

**Collection and Exfiltration**: Data from local systems (T1005), network shares (T1039), and removable media (T1025), followed by exfiltration over C2 channels (T1041). Collection often prioritizes Ukrainian government, defense, military, law-enforcement, personnel, and operational documents.

**Command and Control**: HTTP/HTTPS, dynamic DNS, fast-flux behavior (T1568.001), randomized subdomains, third-party DNS resolvers, Telegram, Telegraph, and short-lived VPS or registrar-backed infrastructure.

## Sources & References

- [CERT-UA: Зведена інформація щодо діяльності угрупування UAC-0010 станом на липень 2023 року](https://cert.gov.ua/article/5160737) — CERT-UA, 2023-07-13
- [Microsoft Security: ACTINIUM targets Ukrainian organizations](https://www.microsoft.com/en-us/security/blog/2022/02/04/actinium-targets-ukrainian-organizations/) — Microsoft Security, 2022-02-04
- [Unit 42: Russia's Trident Ursa Cyber Conflict Operations Unwavering Since Invasion of Ukraine](https://unit42.paloaltonetworks.com/trident-ursa/) — Unit 42, 2022-12-20
- [ESET Research: Gamaredon group grows its game](https://www.welivesecurity.com/2020/06/11/gamaredon-group-grows-its-game/) — ESET Research, 2020-06-11
- [Symantec: Shuckworm: Inside Russia's Relentless Cyber Campaign Against Ukraine](https://www.security.com/threat-intelligence/shuckworm-russia-ukraine-military) — Symantec, 2023-06-15
- [MITRE ATT&CK: Gamaredon Group](https://attack.mitre.org/groups/G0047/) — MITRE ATT&CK, 2026-05-12
