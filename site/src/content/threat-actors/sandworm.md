---
name: "Sandworm"
aliases:
  - "IRIDIUM"
  - "TeleBots"
  - "Voodoo Bear"
  - "ELECTRUM"
  - "Iron Viking"
  - "Seashell Blizzard"
affiliation: "Russia (GRU Unit 74455)"
motivation: "Destructive / Espionage"
status: active
country: "Russia"
firstSeen: "2009"
lastSeen: "2025"
targetSectors:
  - "Energy & Utilities"
  - "Government"
  - "Transportation"
  - "Financial Services"
  - "Media"
targetGeographies:
  - "Ukraine"
  - "Europe"
  - "United States"
  - "Global"
tools:
  - "BlackEnergy"
  - "Industroyer"
  - "NotPetya"
  - "Olympic Destroyer"
  - "Cyclops Blink"
  - "AcidRain"
  - "CaddyWiper"
  - "GreyEnergy"
mitreMappings:
  - techniqueId: "T1485"
    techniqueName: "Data Destruction"
    tactic: "Impact"
    notes: "NotPetya and CaddyWiper were designed to irreversibly destroy data on targeted systems."
  - techniqueId: "T1059.001"
    techniqueName: "Command and Scripting Interpreter: PowerShell"
    tactic: "Execution"
    notes: "PowerShell scripts used in multiple campaigns for lateral movement and payload delivery."
  - techniqueId: "T1195.002"
    techniqueName: "Supply Chain Compromise: Compromise Software Supply Chain"
    tactic: "Initial Access"
    notes: "NotPetya distributed via compromised M.E.Doc Ukrainian accounting software."
  - techniqueId: "T1562.001"
    techniqueName: "Impair Defenses: Disable or Modify Tools"
    tactic: "Defense Evasion"
    notes: "Industroyer manipulated ICS protocols to disable safety systems during power grid attacks."
attributionConfidence: A1
attributionRationale: "Attributed to GRU Unit 74455 by a 2020 U.S. DOJ indictment of six officers, corroborated by Five Eyes intelligence agencies and private-sector research from ESET, Mandiant, and Dragos."
reviewStatus: "draft_ai"
generatedBy: "penfold-bot"
generatedDate: 2026-04-16
tags:
  - "nation-state"
  - "russia"
  - "gru"
  - "destructive"
  - "ics"
  - "sandworm"
  - "notpetya"
sources:
  - url: "https://attack.mitre.org/groups/G0034/"
    publisher: "MITRE ATT&CK"
    publicationDate: "2025-10-17"
    publisherType: research
    reliability: R1
    accessDate: "2026-04-16"
    archived: false
  - url: "https://www.cisa.gov/news-events/cybersecurity-advisories/aa22-110a"
    publisher: "CISA"
    publisherType: government
    reliability: R1
    publicationDate: "2022-04-20"
    accessDate: "2026-04-16"
    archived: false
  - url: "https://www.justice.gov/opa/pr/six-russian-gru-officers-charged-connection-worldwide-deployment-destructive-malware-and"
    publisher: "US Department of Justice"
    publisherType: government
    reliability: R1
    publicationDate: "2020-10-19"
    accessDate: "2026-04-16"
    archived: false
  - url: "https://www.mandiant.com/resources/blog/sandworm-disrupts-power-ukraine-operational-technology"
    publisher: "Mandiant"
    publisherType: vendor
    reliability: R1
    publicationDate: "2023-11-09"
    accessDate: "2026-04-16"
    archived: false
  - url: "https://www.welivesecurity.com/2017/06/30/telebots-back-supply-chain-attacks-against-ukraine/"
    publisher: "ESET"
    publisherType: vendor
    reliability: R1
    publicationDate: "2017-06-30"
    accessDate: "2026-04-16"
    archived: false
---

## Executive Summary

Sandworm is a Russian state-sponsored threat actor attributed to **GRU Unit 74455**, the Main Centre for Special Technologies (GTsST) of the Russian military intelligence service. Active since at least 2009, the group is one of the most destructive cyber threat actors documented to date. Sandworm conducts operations ranging from strategic espionage to large-scale destructive attacks against critical infrastructure, with a sustained operational focus on Ukraine.

The group is responsible for the first confirmed cyberattacks against electrical power grids (Ukraine, 2015 and 2016), the NotPetya global wiper attack (2017) that caused an estimated $10 billion in damages, the Olympic Destroyer attack against the 2018 Pyeongchang Winter Olympics, and multiple destructive operations during Russia's 2022 invasion of Ukraine. Sandworm's readiness to deploy destructive capabilities against civilian infrastructure sets it apart from other state-sponsored groups.

## Notable Campaigns

### 2015 -- Ukraine Power Grid Attack (BlackEnergy3)

On December 23, 2015, Sandworm conducted the first confirmed cyberattack to cause a power outage. The group compromised three Ukrainian power distribution companies using BlackEnergy3 malware. Operators manually manipulated SCADA systems to open circuit breakers, cutting power to approximately 225,000 customers for up to six hours.

### 2016 -- Ukraine Power Grid Attack (Industroyer/CrashOverride)

On December 17, 2016, Sandworm deployed Industroyer (CrashOverride), a modular ICS-specific malware framework targeting the Ukrenergo transmission substation in Kyiv. Industroyer directly interfaced with industrial control protocols (IEC 61850, IEC 104, OPC DA) to open circuit breakers, representing an advancement from manual SCADA manipulation to automated ICS exploitation.

### 2017 -- NotPetya Global Destructive Attack

In June 2017, Sandworm deployed the NotPetya wiper via a supply chain compromise of M.E.Doc, a Ukrainian tax accounting application. NotPetya spread globally via EternalBlue (CVE-2017-0144) and Mimikatz credential harvesting, causing an estimated $10 billion in damages to organizations including Maersk, Merck, FedEx/TNT Express, and Mondelez. The malware had no functional decryption mechanism despite appearing as ransomware.

### 2018 -- Olympic Destroyer

Sandworm deployed Olympic Destroyer malware against the 2018 Pyeongchang Winter Olympics opening ceremony IT infrastructure. The attack incorporated multiple false flag indicators designed to mislead attribution toward North Korean or Chinese actors. It disrupted Wi-Fi, ticketing systems, and the official Olympics website.

### 2022 -- AcidRain and Wiper Campaign

In coordination with Russia's February 2022 invasion of Ukraine, Sandworm deployed AcidRain wiper malware against Viasat KA-SAT modems, disrupting satellite communications across Ukraine and parts of Europe. Throughout 2022, the group deployed multiple wiper variants (CaddyWiper, HermeticWiper, IsaacWiper) against Ukrainian government and infrastructure targets.

## Technical Capabilities

Sandworm maintains advanced capabilities across both IT and operational technology (OT) environments. The group develops custom ICS-targeting malware, including **Industroyer/CrashOverride**, which contains modules for multiple industrial communication protocols. **BlackEnergy** evolved through three major versions, from a DDoS toolkit to a full-featured espionage and ICS attack platform.

The group's IT-focused tools include destructive malware (NotPetya, Olympic Destroyer, CaddyWiper), supply chain compromise techniques, and exploitation of network infrastructure. **Cyclops Blink**, disclosed by NCSC/CISA in 2022, was a modular botnet framework targeting WatchGuard and ASUS network devices, replacing the disrupted VPNFilter botnet.

Sandworm employs advanced operational security including false flag techniques (Olympic Destroyer contained code artifacts intended to mislead attribution), living-off-the-land techniques, and multi-stage attack chains combining IT network compromise with OT-specific payloads.

## Attribution

The U.S. Department of Justice indicted six GRU officers of Unit 74455 in October 2020, providing evidence linking Sandworm to the BlackEnergy Ukraine grid attacks, NotPetya, Olympic Destroyer, and operations against the OPCW and Georgian organizations. The named individuals were identified as members of the GTsST.

CISA advisory AA22-110A (April 2022) and joint advisories from Five Eyes intelligence agencies corroborated the attribution. Private-sector research from ESET, Mandiant, Dragos, and Microsoft independently tracked the group's infrastructure, malware development patterns, and operational timelines. Sandworm's targeting patterns are consistent with Russian strategic military objectives.

## MITRE ATT&CK Profile

**Initial Access**: Sandworm uses spearphishing (T1566), supply chain compromise (T1195.002), and exploitation of public-facing applications (T1190) including VPN appliances and web servers.

**Execution**: The group leverages PowerShell (T1059.001), Windows Management Instrumentation (T1047), and custom loaders. ICS-specific tools directly manipulate industrial protocols.

**Persistence**: Scheduled tasks (T1053), web shells (T1505.003), and firmware-level implants on network devices (Cyclops Blink) maintain access.

**Impact**: Sandworm's hallmark is destructive impact through data destruction (T1485), disk wiping (T1561), and manipulation of industrial control systems. NotPetya combined MBR corruption with file encryption using a non-functional key.

**Defense Evasion**: False flag operations (Olympic Destroyer), timestomping, indicator removal, and process injection complicate attribution and evade detection.

## Sources & References

- [MITRE ATT&CK: Sandworm Team](https://attack.mitre.org/groups/G0034/) -- MITRE ATT&CK
- [CISA: Advisory AA22-110A](https://www.cisa.gov/news-events/cybersecurity-advisories/aa22-110a) -- CISA, 2022-04-20
- [US DOJ: Six Russian GRU Officers Charged](https://www.justice.gov/opa/pr/six-russian-gru-officers-charged-connection-worldwide-deployment-destructive-malware-and) -- US Department of Justice, 2020-10-19
- [Mandiant: Sandworm Disrupts Power in Ukraine](https://www.mandiant.com/resources/blog/sandworm-disrupts-power-ukraine-operational-technology) -- Mandiant, 2023-11-09
- [ESET: TeleBots Supply Chain Attacks Against Ukraine](https://www.welivesecurity.com/2017/06/30/telebots-back-supply-chain-attacks-against-ukraine/) -- ESET, 2017-06-30
