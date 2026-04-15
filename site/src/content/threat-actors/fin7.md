---
name: "FIN7"
aliases:
  - "GOLD NIAGARA"
  - "ITG14"
  - "CARBONSPIDER"
  - "ELBRUS"
affiliation: "Unknown"
motivation: "Financial"
status: "active"
firstSeen: "2013"
lastSeen: "2026-03"
country: "Unknown"
targetSectors:
  - "Retail"
  - "Restaurant"
  - "Hospitality"
  - "Financial"
  - "Healthcare"
targetGeographies:
  - "United States"
  - "Europe"
  - "Global"
tools:
  - "Carbanak"
  - "GRIFFON"
  - "DICELOADER"
  - "DarkSide"
attributionConfidence: "A1"
attributionRationale: "High-fidelity attribution based on multi-government indictments and consistent technical overlaps between Combi Security front operations and FIN7/Indrik Spider infrastructure."
reviewStatus: "under_review"
generatedBy: "penfold-bot"
generatedDate: 2026-04-14
tags:
  - "financially-motivated"
  - "cybercrime"
  - "ransomware"
sources:
  - url: "https://attack.mitre.org/groups/G0046/"
    publisher: "MITRE ATT&CK"
    publisherType: "research"
    reliability: "R1"
    accessDate: "2026-04-14"
    archived: false
  - url: "https://www.justice.gov/opa/pr/high-level-organizer-fin7-hacking-group-sentenced-ten-years-prison"
    publisher: "US Department of Justice"
    publisherType: "government"
    reliability: "R1"
    publicationDate: "2021-04-16"
    accessDate: "2026-04-14"
    archived: false
  - url: "https://www.mandiant.com/resources/blog/fin7-restarting-the-engine"
    publisher: "Mandiant"
    publisherType: "vendor"
    reliability: "R1"
    publicationDate: "2019-05-08"
    accessDate: "2026-04-14"
    archived: false
---

## Executive Summary
FIN7 (also tracked as GOLD NIAGARA, CARBONSPIDER, and ELBRUS) is a sophisticated, highly prolific, financially motivated threat group that has been active since at least 2013. Believed to operate primarily out of Eastern Europe and Russia, FIN7 acts like a mature enterprise, even utilizing front companies (like "Combi Security" and "Bastion Secure") to recruit unwitting IT specialists. Historically focused on point-of-sale (POS) malware to steal payment card data from the retail and restaurant sectors, the group has since pivoted heavily into digital extortion and ransomware, frequently acting as an initial access broker (IAB) or operating their own RaaS programs (such as DarkSide and BlackMatter).

## Notable Campaigns
- **Restaurant and Retail POS Breaches (2015-2019):** Executed massive, sustained campaigns against major US restaurant chains (e.g., Chipotle, Chili's, Arby's) and retailers, successfully compromising hundreds of thousands of payment card records.
- **DarkSide Ransomware via Pipeline:** FIN7 developers were instrumental in the creation of the DarkSide ransomware payload, which was notoriously deployed against Colonial Pipeline in 2021, prompting massive US government intervention.
- **Bastion Secure Fake Company:** Identified operating a fake cybersecurity company to recruit penetration testers, whom they unwittingly used to conduct reconnaissance and map networks for ransomware extortion.

## Technical Capabilities
FIN7 is renowned for its highly polished spear-phishing campaigns, which often involve extensive reconnaissance on the target and sometimes even follow-up phone calls to build rapport. They heavily utilize malicious Office macros (often VBScript or JavaScript payloads) to deploy their primary backdoors, which historically included the **Carbanak** backdoor and **GRIFFON** JavaScript implants. More recently, they rely on **DICELOADER** and heavily customized instances of Cobalt Strike. The group has deep technical expertise in pivoting through complex active directory environments to reach high-value payment processing enclaves or rapidly stage ransomware.

## Attribution
FIN7 is a purely financially motivated criminal enterprise. While the majority of its known members and operational fronts trace back to Russia and Ukraine, there are no definitive ties to state-sponsored intelligence requirements. Extensive collaboration with US law enforcement led to the arrest and imprisonment of several high-ranking FIN7 leadership figures between 2018 and 2022, though the group reorganized and continues to operate.

## Sources & References
- US DOJ Press Releases regarding FIN7 indictments
- Mandiant Threat Intelligence: FIN7 Evaluation
- MITRE ATT&CK Group G0046
