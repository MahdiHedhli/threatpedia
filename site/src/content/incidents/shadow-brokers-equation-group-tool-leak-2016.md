---
eventId: TP-2016-0005
title: "Shadow Brokers Equation Group Tool Leak"
date: 2016-08-13

attackType: "Exploit Toolkit Disclosure"
severity: high
sector: "Multi-Sector"
geography: "Global"

threatActor: "Unknown"
attributionConfidence: "A5"

reviewStatus: draft_ai
confidenceGrade: B
generatedBy: dangermouse-bot
generatedDate: 2026-05-17

cves:
  - CVE-2017-0144
  - CVE-2017-0145
  - CVE-2017-0146
  - CVE-2017-0148

relatedSlugs:
  - eternalblue-ms17-010-cve-2017-0144
  - wannacry-ransomware-2017

tags:
  - shadow-brokers
  - equation-group
  - exploit-toolkit
  - smb
  - eternalblue
  - doublepulsar
  - tool-leak
  - vulnerability-disclosure
  - ms17-010

sources:
  - url: "https://www.cisa.gov/news-events/alerts/2017/04/15/microsoft-addresses-shadow-brokers-exploits"
    publisher: "CISA"
    publisherType: government
    reliability: R1
    publicationDate: "2017-04-15"
  - url: "https://www.cisa.gov/ncas/alerts/TA17-132A"
    publisher: "CISA"
    publisherType: government
    reliability: R1
    publicationDate: "2017-05-12"
  - url: "https://www.microsoft.com/en-us/msrc/blog/2017/04/protecting-customers-and-evaluating-risk"
    publisher: "Microsoft"
    publisherType: vendor
    reliability: R1
    publicationDate: "2017-04-14"
  - url: "https://blogs.cisco.com/security/talos/2017-04-14-shadow-brokers"
    publisher: "Cisco Talos"
    publisherType: vendor
    reliability: R1
    publicationDate: "2017-04-14"
  - url: "https://arstechnica.com/information-technology/2016/08/code-dumped-online-came-from-omnipotent-nsa-tied-hacking-group/"
    publisher: "Ars Technica"
    publisherType: media
    reliability: R2
    publicationDate: "2016-08-16"
  - url: "https://media.kasperskycontenthub.com/wp-content/uploads/sites/43/2018/03/07183248/KL_Q3_Malware_Report_ENG.pdf"
    publisher: "Kaspersky"
    publisherType: vendor
    reliability: R2
    publicationDate: "2017-10-31"
    accessDate: "2026-05-17"
  - url: "https://www.microsoft.com/en-us/security/blog/2017/05/12/wannacrypt-ransomware-worm-targets-out-of-date-systems"
    publisher: "Microsoft"
    publisherType: vendor
    reliability: R1
    publicationDate: "2017-05-12"

mitreMappings:
  - techniqueId: T1210
    techniqueName: "Exploitation of Remote Services"
    tactic: "Lateral Movement"
    attackVersion: "v19"
    confidence: confirmed
    evidence: "Cisco Talos and Microsoft analysis of the April 2017 Shadow Brokers release confirmed that the included tools, particularly EternalBlue (MS17-010 / CVE-2017-0144), exploit SMB services for unauthenticated remote code execution, enabling lateral movement across networks of unpatched Windows systems."
---

## Summary

On August 13, 2016, an actor operating under the name "Shadow Brokers" publicly released a collection of exploitation tools and implants, claiming the material had been taken from a group they called "Equation Group." Security researchers at Kaspersky and other firms assessed that code patterns and tooling characteristics in the released material matched previously documented Equation Group artifacts.

Additional releases followed through early 2017. On April 14, 2017, Shadow Brokers published a second major archive—referred to publicly as "Lost in Translation"—containing Windows-targeted exploits including EternalBlue, EternalChampion, EternalSynergy, and the DoublePulsar kernel-mode backdoor implant. Microsoft confirmed that the SMB vulnerabilities targeted by EternalBlue and related tools in the April dump had been addressed by security update MS17-010, issued on March 14, 2017. CISA issued advisory TA17-132A on May 12, 2017, reiterating patch guidance and the risk posed to unpatched systems.

The publicly released exploit code subsequently contributed to downstream campaigns, most directly the WannaCry ransomware outbreak in May 2017 and the NotPetya destructive event in June 2017.

## Technical Analysis

The August 2016 initial release contained exploitation frameworks and implants. Ars Technica reported that independent security researchers analyzed the dumped code and identified overlaps with tooling previously attributed to Equation Group, including shared code characteristics and operational patterns consistent with prior Kaspersky research on that actor.

The April 14, 2017 "Lost in Translation" release contained a set of Windows-focused exploits analyzed publicly within hours of release. Cisco Talos documented the following tools in that archive:

- **EternalBlue** (CVE-2017-0144): exploits a flaw in the SMBv1 protocol's transaction handling, allowing unauthenticated remote code execution on vulnerable Windows systems exposed on TCP port 445.
- **EternalChampion** (CVE-2017-0146): targets a race condition in SMBv1 transaction processing.
- **EternalSynergy** (CVE-2017-0148): exploits an SMBv1 write-what-where condition.
- **DoublePulsar**: a kernel-mode backdoor implant delivered as a second-stage payload after successful SMB exploitation; provides a persistent listening channel for follow-on activity.

Microsoft's MSRC confirmed that these vulnerabilities were covered by MS17-010, released March 14, 2017—approximately one month before the Shadow Brokers dump made exploit code publicly available. CISA's April 15, 2017 alert directed organizations to the Microsoft advisory and available mitigations.

Kaspersky's threat intelligence reporting documented the code-level similarities between released material and Equation Group tooling from prior campaigns.

## Attack Chain

1. **Acquisition (date unknown):** Shadow Brokers claimed to have obtained an archive of exploitation tools. No public source has confirmed the mechanism, date, or origin of that acquisition.

2. **Initial public release (2016-08-13):** Shadow Brokers posted a partial tool archive via online forums, accompanied by claims of Equation Group origin. The release included functional exploit code and documentation fragments assessed by researchers as consistent with Equation Group tooling.

3. **Researcher analysis (August–September 2016):** Security firms analyzed the released material. Ars Technica reported researcher findings of code overlaps with Equation Group artifacts. Kaspersky documented these characteristics in subsequent threat intelligence output.

4. **Continued staged releases (late 2016–early 2017):** Shadow Brokers made additional releases over subsequent months, expanding the publicly available toolset.

5. **MS17-010 patch (2017-03-14):** Microsoft issued security update MS17-010, addressing the SMBv1 vulnerabilities that EternalBlue and related tools exploit. Systems that applied this update before the April 14 release were protected.

6. **"Lost in Translation" release (2017-04-14):** Shadow Brokers published a second major archive containing EternalBlue, DoublePulsar, and related Windows exploits. The archive reached a broad audience and was analyzed publicly within hours.

7. **Vendor and government triage (2017-04-14 to 2017-04-15):** Cisco Talos published analysis of the April release on April 14. Microsoft MSRC published guidance confirming existing patch coverage and urging organizations to apply MS17-010. CISA issued an alert on April 15 directing attention to the release and available mitigations.

8. **Downstream exploitation (May–June 2017):** EternalBlue was incorporated into attack tooling used in the WannaCry ransomware campaign beginning May 12, 2017, and in the NotPetya destructive event in June 2017. Microsoft and CISA both documented EternalBlue's role in WannaCry propagation.

## Impact Assessment

The public release of functional SMB exploit code lowered the barrier for actors seeking to target unpatched Windows systems at scale. Microsoft's MSRC guidance confirmed that systems running SMBv1 without the MS17-010 patch remained vulnerable after the April 2017 dump. CISA's TA17-132A advisory described the risk to critical infrastructure and enterprise environments from unpatched SMB port exposure.

The time window between the April 14, 2017 release and the May 12 WannaCry outbreak was approximately four weeks. Organizations that had not applied MS17-010 by that date were exposed to exploitation via publicly available EternalBlue code.

CISA's TA17-132A advisory, published coincident with the WannaCry campaign launch, documented the downstream impact on organizations running unpatched systems across multiple sectors and geographies. Microsoft's analysis of WannaCry confirmed that the ransomware used EternalBlue to propagate laterally without requiring user interaction on vulnerable hosts.

## Attribution

The identity of the actor or group responsible for the Shadow Brokers releases has not been publicly confirmed by any government or authoritative source cited in open reporting. The leaker's mechanism for acquiring the tools, and whether any third party directed or facilitated the releases, remains unverified.

Researchers at Kaspersky and other security firms assessed, based on code characteristics, tooling patterns, and infrastructure overlaps, that the released material was linked to the threat actor tracked as Equation Group. This is a vendor-level research assessment; no government source reviewed makes a formal attribution statement linking the released tools to a specific operational owner or confirming NSA custody.

Cisco Talos confirmed the technical capabilities of the released tools without making an attribution claim regarding their origin or the identity of Shadow Brokers.

## Timeline

| Date | Event |
|------|-------|
| 2016-08-13 | Shadow Brokers publishes initial tool archive publicly, claiming Equation Group origin |
| 2016-08 | Independent researchers analyze dump; Ars Technica reports code overlaps with Equation Group tooling |
| 2016–2017 | Shadow Brokers makes additional staged releases of tools and documentation |
| 2017-03-14 | Microsoft issues MS17-010 security update covering EternalBlue and related SMB vulnerabilities |
| 2017-04-14 | Shadow Brokers releases "Lost in Translation" archive containing EternalBlue, DoublePulsar, and related tools |
| 2017-04-14 | Cisco Talos publishes analysis of the April release; Microsoft MSRC confirms patch coverage |
| 2017-04-15 | CISA issues alert on Microsoft's response to the Shadow Brokers exploit release |
| 2017-05-12 | CISA issues TA17-132A advisory; WannaCry ransomware campaign begins exploiting EternalBlue |

## Remediation & Mitigation

Microsoft and CISA guidance at the time of the April 2017 release identified the following mitigations:

- **Apply MS17-010:** Microsoft released the security update on March 14, 2017, covering EternalBlue (CVE-2017-0144) and related SMB vulnerabilities. CISA's April 2017 alert and TA17-132A both identified this as the primary remediation step for exposed systems.
- **Disable SMBv1:** Microsoft MSRC recommended disabling the SMBv1 protocol as a defense-in-depth measure, since EternalBlue and related tools target SMBv1-specific behavior that is absent in SMBv2 and SMBv3.
- **Block SMB at network boundaries:** CISA advised blocking inbound SMB traffic (TCP port 445 and related NetBIOS ports) at perimeter firewalls to limit exposure of internal systems to external exploitation.
- **Segment internal networks:** Limiting lateral SMB connectivity between network segments reduces the propagation potential of tools designed for host-to-host lateral movement.
- **Monitor for DoublePulsar indicators:** CISA and Cisco Talos documented network and behavioral indicators associated with the DoublePulsar backdoor implant for detection and response purposes.

## Sources & References

- [CISA: Microsoft Addresses Shadow Brokers Exploits](https://www.cisa.gov/news-events/alerts/2017/04/15/microsoft-addresses-shadow-brokers-exploits) — CISA, 2017-04-15
- [CISA: Alert TA17-132A — Indicators Associated with WannaCry Ransomware](https://www.cisa.gov/ncas/alerts/TA17-132A) — CISA, 2017-05-12
- [Microsoft: Protecting Customers and Evaluating Risk](https://www.microsoft.com/en-us/msrc/blog/2017/04/protecting-customers-and-evaluating-risk) — Microsoft, 2017-04-14
- [Cisco Talos: Shadow Brokers April 2017 Release Analysis](https://blogs.cisco.com/security/talos/2017-04-14-shadow-brokers) — Cisco Talos, 2017-04-14
- [Ars Technica: Code Dumped Online Came From Omnipotent NSA-Tied Hacking Group](https://arstechnica.com/information-technology/2016/08/code-dumped-online-came-from-omnipotent-nsa-tied-hacking-group/) — Ars Technica, 2016-08-16
- [Kaspersky: Q3 2017 Malware Report](https://media.kasperskycontenthub.com/wp-content/uploads/sites/43/2018/03/07183248/KL_Q3_Malware_Report_ENG.pdf) — Kaspersky, 2017-10-31
- [Microsoft: WannaCrypt Ransomware Worm Targets Out-of-Date Systems](https://www.microsoft.com/en-us/security/blog/2017/05/12/wannacrypt-ransomware-worm-targets-out-of-date-systems) — Microsoft, 2017-05-12
