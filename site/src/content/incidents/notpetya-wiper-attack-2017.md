---
eventId: "TP-2026-0021"
title: "NotPetya Global Wiper Attack"
date: 2017-06-27
attackType: "Sabotage / Wiper"
severity: critical
sector: "Logistics"
geography: "Global"
threatActor: "Sandworm"
attributionConfidence: A1
reviewStatus: "certified"
confidenceGrade: A
generatedBy: "penfold-bot"
generatedDate: 2026-04-15
cves:
  - "CVE-2017-0144"
relatedSlugs:
  - "sandworm"
  - "eternalblue-ms17-010-cve-2017-0144"
relatedIncidents:
  - "wannacry-ransomware-2017"
tags:
  - "wiper"
  - "notpetya"
  - "sandworm"
  - "eternalblue"
  - "ukraine"
  - "russia"
  - "gru"
  - "supply-chain"
sources:
  - url: "https://www.justice.gov/opa/pr/six-russian-gru-officers-charged-connection-worldwide-deployment-destructive-malware-and-other"
    publisher: "US Department of Justice"
    publisherType: government
    reliability: R1
    publicationDate: "2020-10-19"
    accessDate: "2026-04-15"
    archived: false
  - url: "https://www.ncsc.gov.uk/news/uk-and-allies-attribute-notpetya-cyber-attack-russian-government"
    publisher: "NCSC UK"
    publisherType: government
    reliability: R1
    publicationDate: "2018-02-15"
    accessDate: "2026-04-15"
    archived: false
  - url: "https://www.wired.com/story/notpetya-cyberattack-ukraine-russia-code-crashed-the-world/"
    publisher: "Wired"
    publisherType: media
    reliability: R1
    publicationDate: "2018-08-22"
    accessDate: "2026-04-15"
    archived: false
  - url: "https://trumpwhitehouse.archives.gov/briefings-statements/statement-press-secretary-attribution-notpetya/"
    publisher: "The White House"
    publisherType: government
    reliability: R1
    accessDate: "2026-04-15"
    archived: false
  - url: "https://www.microsoft.com/en-us/security/blog/2017/06/27/new-ransomware-old-techniques-petya-adds-worm-capabilities/"
    publisher: "Microsoft Security"
    publisherType: vendor
    reliability: R1
    accessDate: "2026-04-15"
    archived: false
mitreMappings:
  - techniqueId: "T1195.002"
    techniqueName: "Supply Chain Compromise: Compromise Software Supply Chain"
    tactic: "Initial Access"
    notes: "NotPetya was initially distributed via a trojanized update for the Ukrainian accounting software M.E.Doc."
  - techniqueId: "T1485"
    techniqueName: "Data Destruction"
    tactic: "Impact"
    notes: "The primary function of NotPetya was the irreversible destruction of the Master Boot Record (MBR)."
  - techniqueId: "T1210"
    techniqueName: "Exploitation of Remote Services"
    tactic: "Lateral Movement"
    notes: "Propagated using the EternalBlue and EternalRomance exploits."
---

## Summary

The NotPetya attack, launched on June 27, 2017, was a highly destructive global cyberattack masquerading as ransomware. While it shared code with the Petya ransomware, NotPetya was engineered to be a "wiper"—its encryption of the Master Boot Record (MBR) was permanent and irreversible, with no mechanism for recovery even if a ransom was paid. The attack originated in Ukraine, targeting the software update mechanism of M.E.Doc, a widely used accounting software required for tax filing in the country.

The malware spread rapidly across internal corporate networks using a combination of the **EternalBlue** exploit and credential-harvesting tools like Mimikatz. Within hours, it had paralyzed major international corporations, including Maersk, FedEx (TNT Express), Saint-Gobain, and Merck, causing an estimated $10 billion in total economic damage. The United States, United Kingdom, and Five Eyes allies have attributed the attack to the **Sandworm** team, a cyber warfare unit within the Russian GRU (Unit 74455).

## Technical Analysis

NotPetya's tradecraft combined multiple lethal components into a single automated package. Unlike WannaCry, which relied primarily on internet-facing SMB exploitation, NotPetya used a supply chain compromise of the M.E.Doc "Medoc" update server as its patient zero. Once inside a network, the malware utilized several lateral movement techniques:

1. **EternalBlue & EternalRomance:** Exploited the MS17-010 vulnerability in the SMBv1 protocol.
2. **Credential Harvesting:** Leveraged an integrated version of Mimikatz to extract clear-text passwords from memory.
3. **Administrative Tools:** Used legitimate tools like PsExec and WMI to execute commands on remote systems using the harvested credentials.

The wiper payload overwritten the first 512 bytes of the hard drive (the MBR) with a custom boot loader. It then encrypted the Master File Table (MFT) of NTFS partitions. Because the malware discarded the encryption key and generated a random "installation ID" that was not linked to any decryption process, recovery was mathematically impossible.

## Attack Chain

### Stage 1: Supply Chain Compromise
The attackers compromised the update server of the Ukrainian company Linkos Group. On June 27, a malicious update was pushed to thousands of systems running the M.E.Doc accounting software.

### Stage 2: Immediate Proliferation
The trojanized Medoc process executed the NotPetya binary, which immediately began scanning the local network for other vulnerable systems using ARP tables and active connections.

### Stage 3: Network-Wide Destruction
The malware used the harvested credentials and exploits to spread to every reachable system in the environment. Once a system was infected, it scheduled a reboot task to execute the MBR overwrite.

## Impact Assessment

The impact of NotPetya was catastrophic for global logistics and manufacturing. A.F. Moller-Maersk, the world's largest shipping company, had to reinstall its entire infrastructure—45,000 PCs and 4,000 servers—within ten days after the malware halted operations at 76 port terminals.

Estimated losses for major firms included:
- **Merck:** $870 million
- **FedEx (TNT Express):** $400 million
- **Maersk:** $300 million
- **Saint-Gobain:** $384 million

In Ukraine, the attack crippled the power grid, airports, public transit, and the central bank, representing a massive state-sponsored sabotage operation.

## Attribution

The NotPetya attack is attributed to the Russian General Staff Main Intelligence Directorate (GRU), specifically the **Main Center for Special Technologies (GTsST)**, commonly known as **Sandworm** or Unit 74455. In October 2020, the U.S. Department of Justice indicted six GRU officers for their involvement in the campaign.

The attribution is based on a convergence of evidence, including the infrastructure used for the Medoc compromise, the strategic focus on Ukrainian infrastructure, and technical overlaps with previous Sandworm operations such as the BlackEnergy power grid attacks.

## Timeline

### 2017-06-27 10:00 AM — Initial Outbreak
The malicious update is pushed via the M.E.Doc update server in Ukraine.

### 2017-06-27 12:00 PM — Global Spread
International corporations with offices or partners in Ukraine begin reporting total network failure as the malware spreads via dedicated VPN tunnels.

### 2017-06-28 — Permanent Damage Confirmed
Security researchers confirm that the "ransomware" is a wiper and that the encryption is irreversible.

### 2018-02-15 — Formal Attribution
The US and UK governments officially attribute the attack to the Russian government.

## Sources & References

- [US Department of Justice: Six Russian GRU Officers Charged in Connection with Worldwide Deployment of Destructive Malware](https://www.justice.gov/opa/pr/six-russian-gru-officers-charged-connection-worldwide-deployment-destructive-malware-and-other) — US Department of Justice, 2020-10-19
- [NCSC UK: UK and allies attribute NotPetya cyber attack to Russian Government](https://www.ncsc.gov.uk/news/uk-and-allies-attribute-notpetya-cyber-attack-russian-government) — NCSC UK, 2018-02-15
- [The White House: Statement from the Press Secretary on the Attribution of the NotPetya Cyber-Attack](https://trumpwhitehouse.archives.gov/briefings-statements/statement-press-secretary-attribution-notpetya/) — The White House, 2018
- [Wired: The Untold Story of NotPetya, the Most Devastating Cyberattack in History](https://www.wired.com/story/notpetya-cyberattack-ukraine-russia-code-crashed-the-world/) — Wired, 2018-08-22
- [Microsoft Security: New Ransomware, Old Techniques — Petya Adds Worm Capabilities](https://www.microsoft.com/en-us/security/blog/2017/06/27/new-ransomware-old-techniques-petya-adds-worm-capabilities/) — Microsoft Security, 2017
