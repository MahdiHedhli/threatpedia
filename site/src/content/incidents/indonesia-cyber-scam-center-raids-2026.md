---
eventId: TP-2026-0337
title: "Indonesia Cyber Scam Center Raids and Arrests, May 2026"
date: 2026-05-06
attackType: Financial
severity: medium
sector: Law Enforcement / Cyber-Enabled Fraud
geography: Indonesia
threatActor: Unknown
attributionConfidence: A6
reviewStatus: draft_ai
confidenceGrade: C
generatedBy: dangermouse-bot
generatedDate: 2026-06-06
generation:
  provider: openai
  model: gpt-5.3-spark
  tool: codex
  agent: dangermouse-bot
  promptProfile: threatpedia-pipeline-article
cves: []
relatedSlugs: []
tags:
  - indonesia
  - cyber-enabled-fraud
  - online-scam
  - online-gambling
  - investment-scam
  - law-enforcement
sources:
  - url: "https://inp.polri.go.id/artikel/batam-immigration-arrests-210-foreigners-in-massive-online-investment-scam-raid"
    publisher: "Indonesian National Police"
    publisherType: government
    reliability: R1
    publicationDate: "2026-05-09"
    accessDate: "2026-06-06"
    archived: false
  - url: "https://en.antaranews.com/amp/news/415123/indonesia-detains-210-foreigners-in-major-online-investment-scam-raid"
    publisher: "ANTARA News"
    publisherType: media
    reliability: R1
    publicationDate: "2026-05-08"
    accessDate: "2026-06-06"
    archived: false
  - url: "https://www.channelnewsasia.com/asia/indonesia-batam-online-scam-raid-foreign-nationals-detained-baloi-6109136"
    publisher: "CNA"
    publisherType: media
    reliability: R2
    publicationDate: "2026-05-08"
    accessDate: "2026-06-06"
    archived: false
  - url: "https://www.pbs.org/newshour/world/indonesian-police-arrest-321-foreigners-in-online-gambling-crackdown"
    publisher: "PBS NewsHour"
    publisherType: media
    reliability: R2
    publicationDate: "2026-05-09"
    accessDate: "2026-06-06"
    archived: false
  - url: "https://jakartaglobe.id/news/bali-police-uncover-alleged-international-cyber-scamming-ring"
    publisher: "Jakarta Globe"
    publisherType: media
    reliability: R2
    publicationDate: "2026-05-16"
    accessDate: "2026-06-06"
    archived: false
mitreMappings:
  - techniqueId: "T1566"
    techniqueName: "Phishing"
    tactic: "Initial Access"
    attack-version: "v19"
    confidence: "probable"
    evidence: "Indonesian National Police and ANTARA described alleged fraudulent trading applications used to target overseas victims; Jakarta Globe reported a separate cyber-scamming ring that used online communications to deceive victims."
  - techniqueId: "T1583.006"
    techniqueName: "Web Services"
    tactic: "Resource Development"
    attack-version: "v19"
    confidence: "probable"
    evidence: "PBS NewsHour reported that Indonesian police described more than 70 online gambling websites and at least 75 betting platforms tied to the Jakarta operation."
---

## Summary

In May 2026, Indonesian authorities reported multiple enforcement actions against alleged cyber-enabled fraud and online gambling operations. The reported activity included a Batam immigration raid involving 210 foreign nationals suspected of operating an international online investment scam, a Jakarta police operation involving 321 foreign nationals suspected of running online gambling websites, and Bali police reporting a separate alleged international cyber-scamming ring.

The cases were geographically and procedurally distinct. The public sources connect them through Indonesian law-enforcement activity against online scams, investment fraud, and illegal digital betting, but they do not establish a single named threat actor or one unified campaign. Attribution therefore remains Unknown.

The most source-supported technical and operational details concern the Batam and Jakarta cases. In Batam, authorities said the suspected operation used fraudulent trading applications and seized computers, laptops, phones, and passports. In Jakarta, police said the suspected operation involved dozens of online gambling websites and seized digital devices, passports, cash, and other equipment.

## Technical Analysis

The Batam case centered on Baloi View Apartments and a nearby residence in Riau Islands province. Indonesian National Police reporting, citing immigration authorities, said 210 foreign nationals were detained after a coordinated raid and that the fifth floor of the apartment complex allegedly functioned as an operational hub. ANTARA reported that the enforcement action followed a month-long intelligence operation after suspicious movements were detected in mid-April 2026.

Authorities described a suspected investment-fraud workflow rather than malware deployment. ANTARA quoted officials saying the alleged operation used fake trading applications offered to overseas communities to take victims' money, with fictitious stock and foreign-exchange investment themes. The reported target geography for that suspected fraud was overseas, specifically Europe and Vietnam.

The Jakarta case involved alleged online gambling infrastructure. PBS NewsHour, carrying Associated Press reporting, said police arrested 321 foreign nationals at a commercial building near Jakarta's Chinatown section and described the location as a hub for more than 70 online gambling websites. The same reporting said police believed the group operated at least 75 betting platforms and targeted players outside Indonesia.

Public reporting on the Bali case is thinner. Jakarta Globe reported that Bali police uncovered an alleged international cyber-scamming ring and framed it as part of broader Indonesian enforcement against cyber-enabled fraud. The available sources do not provide enough technical detail to cluster the Bali case with the Batam and Jakarta operations beyond the shared cyber-scam enforcement context.

## Attack Chain

### Stage 1: Suspected scam infrastructure established

In Batam, authorities said the suspected operation used apartments and a nearby residence as operational space, including a floor described as a command center. In Jakarta, police described a commercial-building site used to support online gambling websites. The public sources do not identify how those locations were obtained or who financed the operations.

### Stage 2: Overseas victims targeted

Batam officials said the suspected investment-fraud operation used fake trading applications and fictitious stock and foreign-exchange themes to target overseas victims. Jakarta police said the suspected online gambling operation targeted players outside Indonesia. The public sources do not provide confirmed victim counts for each operation.

### Stage 3: Enforcement raids conducted

The Batam immigration raid took place on May 6, 2026 after weeks of surveillance. The Jakarta raid took place during the same week, with police publicly describing the arrests on May 9. Bali police separately reported uncovering an alleged cyber-scamming ring later in May.

### Stage 4: Devices and documents seized

In Batam, authorities reported seizing 131 computers, 93 laptops, 492 mobile phones, and 198 passports. In Jakarta, PBS NewsHour reported that police seized computers, mobile phones, passports, cash in multiple currencies, and other equipment believed to have supported gambling operations.

## Impact Assessment

The Batam raid detained 210 foreign nationals: 125 Vietnamese nationals, 84 Chinese nationals, and one Myanmar national, according to Indonesian National Police and ANTARA reporting. Officials said 163 were men and 47 were women. Authorities also reported that 209 of the 210 were using temporary visit stays, raising immigration-law concerns in addition to any suspected criminal conduct.

The Jakarta operation involved 321 foreign nationals, mainly from Vietnam, according to PBS NewsHour. Police said 275 had been formally named as suspects as of the public briefing, while others remained under questioning. Reported nationalities included Vietnamese, Chinese, Lao, Myanmar, Thai, Malaysian, and Cambodian nationals.

The direct victim impact remains uncertain in the public record. Authorities described overseas victims or users as targets of fraudulent trading applications and online gambling platforms, but the cited sources do not provide a confirmed loss amount or verified victim count. The strongest confirmed impact is law-enforcement disruption: hundreds of foreign nationals detained, large volumes of computing equipment seized, and multiple alleged operational sites disrupted.

These cases also raise a labor-risk dimension common to regional scam-center reporting. The public sources for this task do not establish forced labor in the Batam, Jakarta, or Bali cases, so coercion should not be inferred for the detained individuals without further evidence.

## Attribution

No named threat actor has been confirmed. The public sources attribute the cases to suspected online investment fraud, online gambling, or cyber-scamming operations, but they do not identify a single organizer, criminal group, or campaign name covering the reported raids.

The actor field remains Unknown. The cited sources support describing suspected transnational cyber-enabled fraud and online gambling operations, but not a specific actor attribution or relationship between all enforcement actions.

## Timeline

### 2026-04 — Batam surveillance period begins

ANTARA reported that the Batam crackdown began in mid-April 2026 after intelligence detected suspicious movements at Baloi View Apartments.

### 2026-05-06 — Batam immigration raid

A joint task force raided Baloi View Apartments and a nearby residence in Batam. Authorities detained 210 foreign nationals and seized computers, laptops, phones, and passports.

### 2026-05-08 — Batam case publicly reported

ANTARA reported the Batam detention and described the suspected international online investment scam, fake trading applications, and immigration-law concerns.

### 2026-05-09 — Indonesian National Police publishes Batam summary

Indonesian National Police published an English-language summary of the Batam immigration arrests and the suspected investment-scam operation.

### 2026-05-09 — Jakarta online gambling arrests reported

PBS NewsHour reported that Indonesian police arrested 321 foreign nationals in a Jakarta online gambling crackdown and said the suspected operation involved more than 70 online gambling websites.

### 2026-05-16 — Bali cyber-scamming case reported

Jakarta Globe reported that Bali police uncovered an alleged international cyber-scamming ring.

## Remediation & Mitigation

Financial institutions, payment processors, cryptocurrency services, and consumer-protection teams should monitor for fake trading applications and online investment platforms that target overseas users while operating from Southeast Asian hosting, call-center, or apartment-based infrastructure.

Law-enforcement and platform-trust teams should preserve seized-device and server evidence before takedown, including domain registrations, chat accounts, payment rails, betting-platform administration panels, and account credentials found on workstations or mobile devices. Cross-border evidence sharing is likely needed when suspects, victims, operators, and infrastructure span multiple jurisdictions.

Users should treat unsolicited investment offers, foreign-exchange trading applications, and online gambling platforms promoted through direct messages or social channels as high-risk unless independently verified. Victims should report suspected fraud to local law enforcement and financial institutions quickly enough to preserve transaction records.

Immigration and labor authorities should screen detained workers for possible coercion indicators, including confiscated documents, debt bondage, restricted movement, or threats from operators. Public reporting for these specific cases does not confirm forced labor, but regional scam-center investigations often require parallel criminal and victim-protection review.

## Sources & References

- [Indonesian National Police: Batam Immigration Arrests 210 Foreigners in Massive Online Investment Scam Raid](https://inp.polri.go.id/artikel/batam-immigration-arrests-210-foreigners-in-massive-online-investment-scam-raid) — Indonesian National Police, 2026-05-09
- [ANTARA News: Indonesia detains 210 foreigners in major online investment scam raid](https://en.antaranews.com/amp/news/415123/indonesia-detains-210-foreigners-in-major-online-investment-scam-raid) — ANTARA News, 2026-05-08
- [CNA: Around 200 foreigners detained over suspected online scam operation, say Batam authorities](https://www.channelnewsasia.com/asia/indonesia-batam-online-scam-raid-foreign-nationals-detained-baloi-6109136) — CNA, 2026-05-08
- [PBS NewsHour: Indonesian police arrest 321 foreigners in online gambling crackdown](https://www.pbs.org/newshour/world/indonesian-police-arrest-321-foreigners-in-online-gambling-crackdown) — PBS NewsHour, 2026-05-09
- [Jakarta Globe: Bali Police Uncover Alleged International Cyber Scamming Ring](https://jakartaglobe.id/news/bali-police-uncover-alleged-international-cyber-scamming-ring) — Jakarta Globe, 2026-05-16
