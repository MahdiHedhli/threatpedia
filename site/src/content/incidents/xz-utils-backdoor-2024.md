---
eventId: TP-2024-0003
title: XZ Utils Backdoor Supply-Chain Compromise (CVE-2024-3094)
date: 2024-03-29
attackType: Supply Chain
severity: critical
sector: Technology
geography: Global
threatActor: Unknown
attributionConfidence: A6
reviewStatus: draft_ai
confidenceGrade: B
generatedBy: new-threat-intel
generatedDate: 2026-05-01
cves:
  - CVE-2024-3094
relatedSlugs: []
tags:
  - supply-chain
  - backdoor
  - open-source
  - linux
  - ssh
  - xz-utils
  - liblzma
  - cve-2024-3094
sources:
  - url: "https://www.cisa.gov/news-events/alerts/2024/03/29/reported-supply-chain-compromise-affecting-xz-utils-data-compression-library-cve-2024-3094"
    publisher: "CISA"
    publisherType: government
    reliability: R1
    publicationDate: "2024-03-29"
  - url: "https://www.openwall.com/lists/oss-security/2024/03/29/4"
    publisher: "Openwall"
    publisherType: research
    reliability: R1
    publicationDate: "2024-03-29"
  - url: "https://www.redhat.com/en/blog/urgent-security-alert-fedora-40-and-rawhide-users"
    publisher: "Red Hat"
    publisherType: vendor
    reliability: R1
    publicationDate: "2024-03-29"
  - url: "https://nvd.nist.gov/vuln/detail/CVE-2024-3094"
    publisher: "National Vulnerability Database"
    publisherType: government
    reliability: R1
    publicationDate: "2024-03-29"
    accessDate: "2026-05-01"
  - url: "https://tukaani.org/xz/"
    publisher: "XZ Utils"
    publisherType: community
    reliability: R1
    publicationDate: "2026-05-01"
    accessDate: "2026-05-01"
mitreMappings:
  - techniqueId: "T1195.001"
    techniqueName: "Supply Chain Compromise: Compromise Software Dependencies and Development Tools"
    tactic: "Initial Access"
    notes: "The attacker inserted a backdoor into XZ Utils versions 5.6.0 and 5.6.1 by compromising the project's maintainer trust over approximately two years."
  - techniqueId: "T1554"
    techniqueName: "Compromise Host Software Binary"
    tactic: "Persistence"
    notes: "The malicious build system modifications caused liblzma to inject a backdoor payload into sshd on affected Linux distributions."
---

## Summary

In late March 2024, Microsoft engineer Andres Freund discovered that versions 5.6.0 and 5.6.1 of XZ Utils — an open-source data compression library — contained a backdoor inserted through the project's build system. The backdoor, tracked as CVE-2024-3094, was designed to interfere with authentication in OpenSSH servers on affected Linux systems by patching the systemd-linked sshd process. The attacker introduced the backdoor through a multi-year social engineering campaign targeting the XZ Utils maintainer, operating under the false identity "Jia Tan" before achieving write access to the project.

CISA issued an alert on March 29, 2024, urging users and administrators to downgrade to an uncompromised version of XZ Utils. Red Hat, Fedora, Debian, openSUSE, and other Linux distributions issued advisories confirming exposure and removing the affected versions from their repositories and package feeds. The backdoor was detected before the affected versions reached stable releases of any distribution, limiting the impact on internet-facing Linux servers using vulnerable package configurations.

The incident showed that multi-year social engineering campaigns targeting open-source project maintainers can introduce backdoors into distributed software. Attribution has not been established publicly and no government has formally identified the responsible actor.

## Technical Analysis

The backdoor was introduced through modifications to the XZ Utils build system rather than directly to the library's C source code, making it harder to detect through standard code review. The malicious payload was embedded in binary test files included in the source distribution and activated via a modified build configuration script (`m4/build-to-host.m4`). This approach injected the backdoor at build time rather than at runtime from source, so users who built the library from source without the malicious test files would not be affected.

On systems where XZ Utils was linked against systemd (a configuration common in several Linux distributions, including Fedora Rawhide and Fedora 40 at the time), the malicious liblzma library was loaded by sshd at process startup through systemd's dependency chain. The backdoor hook in liblzma intercepted the RSA key decryption function used by OpenSSH, enabling a holder of the attacker's private key to authenticate to the affected sshd without a valid user credential. The attack specifically required sshd to be systemd-linked, which is not universal across all Linux distributions.

Freund's discovery was incidental: while investigating slight performance regressions in SSH login times on Debian sid, he identified unusual CPU usage patterns during sshd authentication and traced them to the modified liblzma. The detection occurred before the affected packages reached stable releases in Debian, Ubuntu, or Red Hat Enterprise Linux, which contributed to limiting real-world deployment of the backdoor.

## Attack Chain

### Stage 1: Persona Establishment

Beginning in approximately 2022, an individual using the GitHub identity "Jia Tan" began contributing to XZ Utils. Over roughly two years, Jia Tan submitted legitimate bug fixes and improvements, establishing a credible contributor history within the project.

### Stage 2: Social Engineering of the Maintainer

Jia Tan coordinated with accounts that applied social pressure on the existing XZ Utils maintainer, Lasse Collin, around workload and project management. This social engineering resulted in Jia Tan gradually receiving increased commit access and eventually co-maintainer responsibilities for the project.

### Stage 3: Backdoor Insertion into Build System

With elevated commit rights, Jia Tan modified the XZ Utils build system by altering the `m4/build-to-host.m4` script and including malicious binary content within the project's test file archive (`tests/files/bad-3-corrupt_lzma2.xz` and associated files). The binary payload was obfuscated such that it did not appear in direct source code review.

### Stage 4: Distribution Package Adoption

The compromised versions 5.6.0 (released February 2024) and 5.6.1 (released March 2024) were adopted by several rolling-release and pre-release Linux distribution channels, including Fedora Rawhide, Fedora 40 beta, and some Debian sid and openSUSE Tumbleweed builds.

### Stage 5: Discovery and Response

On March 29, 2024, Andres Freund published findings to the oss-security mailing list documenting the backdoor and its mechanism. CISA, Red Hat, Fedora, Debian, and other vendors issued advisories the same day. Affected packages were removed from distribution repositories and users were directed to downgrade to XZ Utils 5.4.6 or earlier.

## Impact Assessment

The direct operational impact of CVE-2024-3094 was contained by early detection. No confirmed exploitation of the backdoor in production environments has been publicly documented. The affected versions (5.6.0 and 5.6.1) did not reach stable releases of any Linux distribution before discovery, limiting the population of publicly exposed systems.

Had the backdoor reached stable Linux distribution releases, the potential impact would have included silent authentication bypass on SSH servers linked to systemd-enabled XZ Utils. The attacker's private key, held by the unknown actor, would have been the sole mechanism for authentication via the backdoor, making exploitation contingent on the attacker's operational choices.

The incident prompted vendor response and security discussion around maintainer vetting, code review practices, binary artifact verification, and the sustainability of open-source infrastructure maintained by individual volunteers.

## Attribution

No government or law enforcement agency has publicly attributed CVE-2024-3094 to a specific actor or nation-state. The GitHub account "Jia Tan" (also identified as JiaT75) conducted the campaign but no confirmed real-world identity has been established. Researchers and commentators have noted characteristics of the campaign — the multi-year duration and the targeting of SSH authentication infrastructure — that are consistent with state-sponsored adversary tradecraft, but these observations do not constitute confirmed attribution.

The attacker used an email address and timezone patterns noted by some researchers as potentially consistent with Eastern European or Asian working hours; however, such indicators can be manipulated and should not be treated as conclusive.

CISA's alert and NVD's CVE record do not attribute the incident to any specific actor. Freund's original disclosure on the oss-security list similarly presents the technical findings without actor attribution.

## Timeline

### 2022 — Jia Tan Begins Contributing to XZ Utils

The GitHub identity Jia Tan starts submitting patches and improvements to the XZ Utils project, building a legitimate contributor history over time.

### 2024-02-24 — XZ Utils 5.6.0 Released

XZ Utils version 5.6.0, containing the backdoor, is published. The release is adopted by several rolling-release Linux distribution channels.

### 2024-03-09 — XZ Utils 5.6.1 Released

A follow-up release 5.6.1 is published, also containing the backdoor. Some distribution channels that had held back 5.6.0 adopt 5.6.1.

### 2024-03-29 — Discovery and Public Disclosure

Andres Freund publishes his findings to the oss-security mailing list, documenting the backdoor mechanism in detail. CISA, Red Hat, Fedora, Debian, and openSUSE issue advisories the same day. Affected packages are pulled from distribution repositories. CVE-2024-3094 is assigned.

### 2024-03-29 — CISA Alert Published

CISA publishes an alert urging downgrade to XZ Utils 5.4.6 or an earlier unaffected version.

### 2024-03-30 — Coordinated Vendor Response

Ubuntu, Arch Linux, Alpine Linux, Gentoo, and additional distributions confirm their stable releases were not affected. Package maintainers remove the compromised versions from testing and unstable channels across remaining affected distributions.

## Remediation & Mitigation

CISA and all affected Linux distribution vendors directed users and administrators to downgrade XZ Utils to version 5.4.6 or earlier if version 5.6.0 or 5.6.1 was installed. Users should verify the installed version with the command `xz --version` and apply the downgrade through their distribution's package manager.

Systems running Fedora Rawhide, Fedora 40 beta, certain Debian sid builds, or openSUSE Tumbleweed during the affected window should be assessed. On systems where the compromised version was installed and sshd was systemd-linked, the possibility of unauthorized SSH access using the attacker's private key — while not confirmed in any public incident — should be considered in the incident response scoping.

Longer-term mitigations relevant to supply-chain attacks of this type include: verification of binary artifacts against known-good checksums for upstream package releases; reproducible build practices that allow independent verification of compiled output from source; code review policies that scrutinize build-system modifications with the same rigor applied to source code changes; identity verification processes for contributors who gain elevated project access; and monitoring of maintainer activity for anomalous changes to build infrastructure or test artifacts. The Sigstore project and similar tooling for open-source artifact signing provide mechanisms to cryptographically bind artifacts to known identities.

## Sources & References

- [CISA: Reported Supply Chain Compromise Affecting XZ Utils Data Compression Library (CVE-2024-3094)](https://www.cisa.gov/news-events/alerts/2024/03/29/reported-supply-chain-compromise-affecting-xz-utils-data-compression-library-cve-2024-3094) — CISA, 2024-03-29
- [Openwall: Backdoor in upstream xz/liblzma leading to SSH server compromise](https://www.openwall.com/lists/oss-security/2024/03/29/4) — Openwall, 2024-03-29
- [Red Hat: Urgent Security Alert for Fedora 40 and Rawhide Users](https://www.redhat.com/en/blog/urgent-security-alert-fedora-40-and-rawhide-users) — Red Hat, 2024-03-29
- [National Vulnerability Database: CVE-2024-3094](https://nvd.nist.gov/vuln/detail/CVE-2024-3094) — National Vulnerability Database, 2024-03-29
- [XZ Utils: Security issues](https://tukaani.org/xz/) — XZ Utils, 2026-05-01
