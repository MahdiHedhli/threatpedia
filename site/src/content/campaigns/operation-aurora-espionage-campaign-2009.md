---
title: "Operation Aurora: Google and Fortune 100 Cyber Espionage Campaign"
startDate: 2009-06-01
endDate: 2010-01-12
ongoing: false
attackType: "Espionage"
severity: critical
sector: "Technology"
geography: "Global"
threatActor: "APT1 / Comment Crew"
attributionConfidence: A2
reviewStatus: "draft_ai"
confidenceGrade: B
generatedBy: "penfold-bot"
generatedDate: 2026-04-16
cves:
  - "CVE-2010-0249"
tags:
  - "operation-aurora"
  - "espionage"
  - "china"
  - "google"
  - "zero-day"
  - "ie-exploit"
sources:
  - url: "https://googleblog.blogspot.com/2010/01/new-approach-to-china.html"
    publisher: "Google"
    publisherType: vendor
    reliability: R1
    publicationDate: "2010-01-12"
    accessDate: "2026-04-16"
    archived: false
  - url: "https://www.cisa.gov/news-events/alerts/2010/01/14/google-china-cyber-attack"
    publisher: "CISA"
    publisherType: government
    reliability: R1
    publicationDate: "2010-01-14"
    accessDate: "2026-04-16"
    archived: false
  - url: "https://www.mcafee.com/blogs/other-blogs/mcafee-labs/protecting-your-critical-assets-lessons-from-operation-aurora/"
    publisher: "McAfee"
    publisherType: vendor
    reliability: R1
    publicationDate: "2010-01-14"
    accessDate: "2026-04-16"
    archived: false
mitreMappings:
  - techniqueId: "T1189"
    techniqueName: "Drive-by Compromise"
    tactic: "Initial Access"
    notes: "Used an Internet Explorer zero-day (CVE-2010-0249) to compromise targets via malicious websites."
  - techniqueId: "T1203"
    techniqueName: "Exploitation for Client Execution"
    tactic: "Execution"
    notes: "IE zero-day enabled arbitrary code execution on victim systems."
---

## Summary

Operation Aurora was a multi-month cyber-espionage campaign originating from China that targeted Google, Adobe, Juniper Networks, and approximately 30 other Fortune 100 companies between June 2009 and January 2010. The campaign exploited a zero-day vulnerability in Internet Explorer (CVE-2010-0249) to gain initial access to victim networks.

The campaign was publicly disclosed by Google on January 12, 2010, when the company announced that it had been targeted by a "highly sophisticated and targeted attack" originating from China. Google stated that the attackers had accessed Gmail accounts of Chinese human rights activists and had stolen intellectual property. The incident led to Google's partial withdrawal from the Chinese market and a diplomatic confrontation between the United States and China.

McAfee named the campaign "Operation Aurora" after a file path string ("Aurora") found in the malware samples.

## Technical Analysis

The primary attack vector was a zero-day exploit for Internet Explorer 6 (CVE-2010-0249), a use-after-free vulnerability that enabled remote code execution. Victims were directed to malicious websites through spearphishing emails or watering hole attacks. The exploit delivered a custom backdoor (known as Hydraq/Aurora) that provided persistent remote access.

Once inside target networks, the attackers used the Hydraq backdoor for command and control, credential harvesting for lateral movement, and targeted data exfiltration. At Google, the attackers specifically targeted the source code management systems and accessed Gmail accounts of individuals involved in human rights activities related to China.

The malware communicated with C2 servers using encrypted HTTP connections. Multiple C2 domains were registered using falsified registration information traced to Chinese IP ranges.

## Attack Chain

### Stage 1: Spearphishing and Watering Hole

Targeted employees received spearphishing emails containing links to websites hosting the IE zero-day exploit. Some attacks used watering hole techniques against websites frequented by target personnel.

### Stage 2: Zero-Day Exploitation

CVE-2010-0249 enabled arbitrary code execution through Internet Explorer, downloading and installing the Hydraq backdoor without user awareness.

### Stage 3: Backdoor Installation and Persistence

The Hydraq trojan established persistent C2 communications and provided remote access capabilities including file transfer, command execution, and keystroke logging.

### Stage 4: Lateral Movement and Data Exfiltration

Attackers moved laterally through corporate networks using harvested credentials, targeting source code repositories and email systems containing sensitive intellectual property and communications.

## Impact Assessment

Operation Aurora affected over 30 major technology and defense companies. Google disclosed the theft of intellectual property and the compromise of Gmail accounts belonging to Chinese human rights activists. Adobe, Juniper Networks, Rackspace, and other companies confirmed they were targeted.

The geopolitical impact was substantial. Google announced it would stop censoring search results in China and ultimately redirected google.cn to its Hong Kong servers. The U.S. Secretary of State issued a formal statement calling for an investigation. The incident became a watershed moment in the public awareness of state-sponsored cyber-espionage.

## Attribution

Attribution to Chinese state-sponsored actors was based on the origin of the attacks (Chinese IP addresses), the targeting of Chinese dissident Gmail accounts (indicating intelligence-agency interest), and subsequent research linking the tools and infrastructure to known Chinese APT groups. McAfee, Mandiant, and other security firms traced the activity to China.

The specific unit responsible has been debated. Early reporting linked the campaign to APT1/PLA Unit 61398 based on tooling, while later analysis suggested possible involvement of the Elderwood Group (a separate Chinese-nexus cluster). The U.S. government did not issue a formal indictment specific to Operation Aurora.

## Timeline

### 2009-06 -- Campaign Begins
Initial compromises of target organizations begin using the IE zero-day exploit.

### 2009-12 -- Google Detects Intrusion
Google's security team identifies unauthorized access to its infrastructure.

### 2010-01-12 -- Google Public Disclosure
Google publicly discloses the attack and announces intent to stop censoring search results in China.

### 2010-01-14 -- CISA Alert and McAfee Analysis
CISA issues an alert on the attacks. McAfee names the campaign "Operation Aurora" and publishes technical analysis.

### 2010-01-21 -- Microsoft Patches CVE-2010-0249
Microsoft releases an out-of-band security update for Internet Explorer.

### 2010-03-22 -- Google Redirects to Hong Kong
Google stops censoring search results in China and redirects google.cn to google.com.hk.

## Sources & References

- [Google: A New Approach to China](https://googleblog.blogspot.com/2010/01/new-approach-to-china.html) -- Google, 2010-01-12
- [CISA: Google China Cyber Attack Alert](https://www.cisa.gov/news-events/alerts/2010/01/14/google-china-cyber-attack) -- CISA, 2010-01-14
- [McAfee: Lessons from Operation Aurora](https://www.mcafee.com/blogs/other-blogs/mcafee-labs/protecting-your-critical-assets-lessons-from-operation-aurora/) -- McAfee, 2010-01-14
