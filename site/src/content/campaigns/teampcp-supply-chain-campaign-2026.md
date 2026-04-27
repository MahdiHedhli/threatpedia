---
campaignId: "TP-CAMP-2026-0003"
title: "TeamPCP Multi-Ecosystem Supply Chain Campaign"
startDate: 2026-02-27
endDate: 2026-04-03
ongoing: false
attackType: "Supply Chain Compromise"
severity: critical
sector: "Technology / DevOps / Open Source"
geography: "Global"
threatActor: "TeamPCP"
attributionConfidence: A4
reviewStatus: "draft_ai"
confidenceGrade: C
generatedBy: "dangermouse-bot"
generatedDate: 2026-04-21
cves:
  - "CVE-2026-33634"
relatedIncidents:
  - "mercor-litellm-supply-chain-breach-2026"
  - "cisco-trivy-supply-chain-breach-2026"
  - "european-commission-trivy-breach-2026"
  - "trivy-cve-2026-33634"
tags:
  - "supply-chain"
  - "github-actions"
  - "pypi"
  - "docker-hub"
  - "openvsx"
  - "cicd"
  - "credential-theft"
  - "teampcp"
  - "trivy"
  - "litellm"
  - "canisterworm"
sources:
  - url: "https://www.cisa.gov/news-events/alerts"
    publisher: "CISA"
    publisherType: government
    reliability: R1
    publicationDate: "2026-03-25"
    accessDate: "2026-04-21"
    archived: false
  - url: "https://www.microsoft.com/en-us/security/blog/2026/03/24/detecting-investigating-defending-against-trivy-supply-chain-compromise/"
    publisher: "Microsoft Security Blog"
    publisherType: vendor
    reliability: R1
    publicationDate: "2026-03-24"
    accessDate: "2026-04-21"
    archived: false
  - url: "https://www.akamai.com/blog/security-research/2026/mar/telnyx-pypi-2026-teampcp-supply-chain-attacks"
    publisher: "Akamai Security Intelligence Group"
    publisherType: vendor
    reliability: R1
    publicationDate: "2026-03-27"
    accessDate: "2026-04-21"
    archived: false
  - url: "https://www.wiz.io/blog/tracking-teampcp-investigating-post-compromise-attacks-seen-in-the-wild"
    publisher: "Wiz"
    publisherType: vendor
    reliability: R1
    publicationDate: "2026-03-30"
    accessDate: "2026-04-21"
    archived: false
  - url: "https://techcrunch.com/2026/03/31/mercor-says-it-was-hit-by-cyberattack-tied-to-compromise-of-open-source-litellm-project/"
    publisher: "TechCrunch"
    publisherType: media
    reliability: R2
    publicationDate: "2026-03-31"
    accessDate: "2026-04-21"
    archived: false
  - url: "https://www.theregister.com/2026/04/02/mercor_supply_chain_attack/"
    publisher: "The Register"
    publisherType: media
    reliability: R2
    publicationDate: "2026-04-02"
    accessDate: "2026-04-21"
    archived: false
  - url: "https://www.bankinfosecurity.com/mercor-breach-linked-to-litellm-supply-chain-attack-a-31340"
    publisher: "BankInfoSecurity"
    publisherType: media
    reliability: R2
    publicationDate: "2026-04-01"
    accessDate: "2026-04-21"
    archived: false
mitreMappings:
  - techniqueId: "T1195.002"
    techniqueName: "Supply Chain Compromise: Compromise Software Supply Chain"
    tactic: "Initial Access"
    notes: "Force-pushed malicious commits to trusted version tags in the Aqua trivy-action, setup-trivy, and KICS GitHub Action repositories, plus trojanized releases of LiteLLM on PyPI, to redirect downstream CI/CD pipelines into attacker-controlled payloads."
  - techniqueId: "T1552.001"
    techniqueName: "Unsecured Credentials: Credentials In Files"
    tactic: "Credential Access"
    notes: "TeamPCP Cloud Stealer harvested cloud provider tokens (AWS, GCP, Azure), Kubernetes service accounts, and SSH keys from runner environment variables, workflow logs, and build artefacts."
  - techniqueId: "T1199"
    techniqueName: "Trusted Relationship"
    tactic: "Initial Access"
    notes: "Cascaded access through trusted security tooling (Trivy, KICS, LiteLLM, Checkmarx) into downstream customer environments that treated the tools as privileged CI/CD dependencies."
  - techniqueId: "T1027"
    techniqueName: "Obfuscated Files or Information"
    tactic: "Defense Evasion"
    notes: "Payloads used AES-256 + RSA-4096 layered encryption and staged exfiltration to blend into normal CI/CD egress traffic; C2 infrastructure hosted behind trycloudflare.com tunnels."
---

## Executive Summary

The TeamPCP supply chain campaign was a coordinated multi-ecosystem intrusion operation running from late February through early April 2026, in which the TeamPCP actor cluster (also self-identifying as DeadCatx3, PCPcat, and ShellForce) compromised widely trusted developer security tooling — including Aqua Security's Trivy and setup-trivy GitHub Actions, Checkmarx's KICS GitHub Action, and the LiteLLM PyPI package — and used that access to harvest cloud credentials and secrets from downstream CI/CD environments at scale.

The campaign is distinctive in three respects. First, it targeted **security tools themselves** rather than general-purpose libraries, abusing the privileged CI/CD position those tools occupy. Second, it used **force-pushed version tags** against trusted repositories, so downstream consumers pinning to what they believed were immutable semantic versions silently began executing attacker-controlled code. Third, it cascaded into **multiple independent victim incidents** — Mercor, Cisco, European Commission, and others — that Threatpedia maintains as separate incident pages.

This article is the canonical **campaign-level** record of the TeamPCP operation. The actor itself is profiled at [`/threat-actors/teampcp/`](/threat-actors/teampcp/). The constituent victim events are tracked as individual incident articles linked under Timeline and the related-incident list in frontmatter.

## Technical Analysis

TeamPCP's operation combined three reinforcing techniques:

**Tag-hijack via force-push.** The core technique was obtaining valid GitHub credentials for the `aqua-bot` service account (via exposed environment variables in workflow logs and incomplete token rotation after an initial February 27 disclosure), then force-pushing over 76 of 77 published version tags in `aquasecurity/trivy-action` and all 7 tags in `aquasecurity/setup-trivy` to point at commits containing malicious payloads. Because downstream CI/CD pipelines commonly pin to semantic version tags rather than immutable commit SHAs, any workflow re-resolving the tag silently pulled the attacker's code. The same technique was applied to Checkmarx's `kics-github-action`.

**Trojanized package releases.** In parallel, TeamPCP published malicious versions of the LiteLLM PyPI package (versions `1.82.7` and `1.82.8`) containing credential-harvesting code that activated on runner installations. The releases were later reverted by the LiteLLM maintainers once the compromise was disclosed; consumers who installed during the exposure window retained the payload.

**TeamPCP Cloud Stealer payload.** The payload — tracked across vendor reports under labels including "CanisterWorm" — enumerated the runner environment for cloud-provider credentials (AWS access keys, GCP service-account JSON, Azure client secrets), Kubernetes kubeconfigs, SSH private keys, GitHub PATs, and npm/PyPI publishing tokens. Harvested material was layered-encrypted (AES-256 + RSA-4096), chunked, and exfiltrated to attacker infrastructure hosted behind Cloudflare tunnel domains (including `plug-tab-protective-relay.trycloudflare.com`) and a staging IP at `45.148.10.212`, blending into normal CI/CD egress.

The cascading effect: credentials harvested in one victim's CI/CD environment frequently provided initial access to that victim's cloud-production infrastructure, producing the secondary incidents tracked separately on Threatpedia.

## Attack Chain

### Stage 1: Initial compromise of Aqua Security CI/CD

TeamPCP gains access to the `aqua-bot` service account through exposed environment variables in workflow logs combined with weak PAT rotation. Initial entry point is the `trivy-action` repository. Aqua detects anomalous activity on Feb 28; token rotation is initiated but is not comprehensive.

### Stage 2: Tag-hijack weaponization

With residual PAT access surviving Aqua's initial rotation, TeamPCP force-pushes over trusted version tags in `trivy-action` (76/77 tags) and `setup-trivy` (7/7 tags) on March 19, redirecting any downstream workflow that re-resolves a tag reference. The Checkmarx `kics-github-action` is compromised by the same pattern on March 23.

### Stage 3: LiteLLM PyPI trojanization

Between late March and early April, attacker-controlled releases of the LiteLLM PyPI package are published. Installations during the exposure window deploy the TeamPCP Cloud Stealer payload on target runners. Telnyx is among the public victims affected by the LiteLLM compromise path.

### Stage 4: Credential harvesting at runner scale

Payloads deployed via Stages 2 and 3 enumerate runner environment for cloud credentials, kubeconfigs, SSH keys, PATs, and publishing tokens. Harvested material is encrypted and exfiltrated to attacker infrastructure. Scale estimates across vendor reporting converge on 474+ directly affected public repositories and 1,750+ downstream packages.

### Stage 5: Downstream victim intrusions

Credentials harvested in Stages 2–4 are used to access victim cloud-production infrastructure, producing individually-tracked incidents including the Mercor AI LiteLLM-path breach, the Cisco Trivy-path breach, and the European Commission Trivy-path breach. These are the constituent incidents Threatpedia maintains as separate articles.

## MITRE ATT&CK Mapping

### Initial Access

- **T1195.002 — Supply Chain Compromise: Compromise Software Supply Chain.** Force-push against trusted GitHub Action version tags; trojanized PyPI releases.
- **T1199 — Trusted Relationship.** Exploitation of the privileged CI/CD position that security tools occupy in downstream victim pipelines.

### Credential Access

- **T1552.001 — Unsecured Credentials: Credentials In Files.** Harvesting of cloud tokens, kubeconfigs, SSH keys, PATs, and publishing tokens from runner environments and workflow logs.

### Defense Evasion

- **T1027 — Obfuscated Files or Information.** Layered AES-256 + RSA-4096 encryption of harvested material; Cloudflare-tunnel-fronted C2 infrastructure.

### Impact

- **T1496 — Resource Hijacking (inferred for a subset of downstream compromises)** and further downstream action-on-objectives are tracked on the constituent incident pages.

## Timeline

### 2026-02-27 — Initial Aqua compromise

TeamPCP obtains `aqua-bot` credentials via exposed workflow logs.

### 2026-02-28 — Aqua disclosure and incomplete rotation

Aqua detects anomalous activity, discloses, and rotates tokens — but residual PATs survive, as investigators later confirm.

### 2026-03-19 — Trivy tag-hijack

76 of 77 `trivy-action` version tags and all 7 `setup-trivy` tags are force-pushed over with malicious payloads.

### 2026-03-23 — Checkmarx KICS compromise

Checkmarx's `kics-github-action` is compromised via the same tag-hijack pattern.

### 2026-03-25 — Microsoft Defender disclosure

Microsoft Security publishes the first major cross-vendor analysis of the Trivy supply-chain compromise.

### 2026-03-28 — European Commission data publication

Data exfiltrated via the Trivy path is published on the ShinyHunters leak site, including ~340 GB attributed to the European Commission.

### 2026-03-30 — LiteLLM trojanization

Attacker-controlled LiteLLM PyPI releases are published, triggering runner compromises at Telnyx and Mercor among others.

### 2026-03-31 — Mercor breach disclosure

Mercor publicly discloses a breach tied to the LiteLLM compromise path.

### 2026-04-02 — Kaspersky / Akamai cross-campaign analysis

Vendor cross-analysis establishes the unified TeamPCP campaign envelope spanning Trivy, KICS, LiteLLM, and Telnyx.

### 2026-04-03 — Campaign envelope closes

The public exposure window for the campaign's last active vectors closes; remediation enters sustained phase.

## Remediation & Mitigation

- **Pin GitHub Action references to immutable commit SHAs**, not to version tags. This is the single change that would have broken Stage 2's tag-hijack vector for most downstream consumers.
- **Fully revoke** all cloud credentials, PATs, publishing tokens, and SSH keys that were present in runner environments during the campaign window. Rotation alone is insufficient where exfiltration is confirmed.
- **Audit GitHub logs** during the February 27 – April 3 window for suspicious force-push, branch deletion, tag mutation, and token-creation events.
- **Pin LiteLLM** to a safe version (≤ `1.82.6` or ≥ `1.82.9`) and audit runner logs for installation events in the exposure window.
- **Enable GPG signature enforcement** on protected branches and restrict service-account force-push capabilities.
- **Scan CI/CD egress logs** for outbound connections to `45.148.10.212`, to the typosquatted `scan.aquasecurtiy.org` domain used as a TeamPCP C2 / staging host (note the intentional misspelling of "aquasecurity"), and to `*.trycloudflare.com` hosts associated with TeamPCP C2.
- **Treat security tools as privileged dependencies.** The campaign's novelty is exploiting the trust gradient between application code and security/CI tooling; threat models that assume security tools are inherently trustworthy are the gap the campaign exploited.

## Sources & References

- [CISA: Supply Chain Compromise Alerts — ongoing coverage](https://www.cisa.gov/news-events/alerts) — CISA, 2026-03-25
- [Microsoft Security Blog: Detecting, investigating, and defending against the Trivy supply-chain compromise](https://www.microsoft.com/en-us/security/blog/2026/03/24/detecting-investigating-defending-against-trivy-supply-chain-compromise/) — Microsoft Security Blog, 2026-03-24
- [Akamai Security Intelligence Group: Telnyx / PyPI — 2026 TeamPCP supply-chain attacks](https://www.akamai.com/blog/security-research/2026/mar/telnyx-pypi-2026-teampcp-supply-chain-attacks) — Akamai Security Intelligence Group, 2026-03-27
- [Wiz: Tracking TeamPCP — investigating post-compromise attacks seen in the wild](https://www.wiz.io/blog/tracking-teampcp-investigating-post-compromise-attacks-seen-in-the-wild) — Wiz, 2026-03-30
- [TechCrunch: Mercor says it was hit by cyberattack tied to compromise of open-source LiteLLM project](https://techcrunch.com/2026/03/31/mercor-says-it-was-hit-by-cyberattack-tied-to-compromise-of-open-source-litellm-project/) — TechCrunch, 2026-03-31
- [The Register: Mercor supply chain attack](https://www.theregister.com/2026/04/02/mercor_supply_chain_attack/) — The Register, 2026-04-02
- [BankInfoSecurity: Mercor breach linked to LiteLLM supply-chain attack](https://www.bankinfosecurity.com/mercor-breach-linked-to-litellm-supply-chain-attack-a-31340) — BankInfoSecurity, 2026-04-01
