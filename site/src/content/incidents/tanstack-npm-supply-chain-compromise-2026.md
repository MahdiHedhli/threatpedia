---
eventId: TP-2026-0054
title: "TanStack npm Supply-Chain Compromise via GitHub Actions OIDC Token Theft, May 2026"
date: 2026-05-11
attackType: supply-chain
severity: critical
sector: Open-source software / developer tooling
geography: Global
threatActor: Unknown
attributionConfidence: A4
reviewStatus: draft_ai
confidenceGrade: C
generatedBy: dangermouse-bot
generatedDate: 2026-05-12
cves: []
relatedSlugs: []
tags:
  - supply-chain
  - npm
  - tanstack
  - github-actions
  - oidc
  - cache-poisoning
  - credential-theft
  - worm
sources:
  - url: "https://socket.dev/blog/tanstack-npm-packages-compromised-mini-shai-hulud-supply-chain-attack"
    publisher: "Socket Research Team"
    publisherType: vendor
    reliability: R1
    publicationDate: "2026-05-11"
    accessDate: "2026-05-12"
    archived: false
  - url: "https://tanstack.com/blog/npm-supply-chain-compromise-postmortem"
    publisher: "TanStack"
    publisherType: vendor
    reliability: R1
    publicationDate: "2026-05-11"
    accessDate: "2026-05-12"
    archived: false
  - url: "https://github.com/TanStack/router/security/advisories/GHSA-g7cv-rxg3-hmpx"
    publisher: "TanStack / GitHub Security"
    publisherType: vendor
    reliability: R1
    publicationDate: "2026-05-11"
    accessDate: "2026-05-12"
    archived: false
  - url: "https://github.com/TanStack/router/issues/7383"
    publisher: "TanStack / GitHub"
    publisherType: community
    reliability: R2
    publicationDate: "2026-05-11"
    accessDate: "2026-05-12"
    archived: false
  - url: "https://www.stepsecurity.io/blog/mini-shai-hulud-is-back-a-self-spreading-supply-chain-attack-hits-the-npm-ecosystem"
    publisher: "StepSecurity"
    publisherType: vendor
    reliability: R1
    publicationDate: "2026-05-11"
    accessDate: "2026-05-12"
    archived: false
  - url: "https://socket.dev/supply-chain-attacks/mini-shai-hulud"
    publisher: "Socket"
    publisherType: vendor
    reliability: R1
    publicationDate: "2026-05-12"
    accessDate: "2026-05-12"
    archived: false
  - url: "https://www.cisa.gov/news-events/alerts/2025/09/23/widespread-supply-chain-compromise-impacting-npm-ecosystem"
    publisher: "CISA"
    publisherType: government
    reliability: R1
    publicationDate: "2025-09-23"
    accessDate: "2026-05-12"
    archived: false
mitreMappings:
  - techniqueId: "T1195.001"
    techniqueName: "Compromise Software Dependencies and Development Tools"
    tactic: "Initial Access"
    attack-version: "v19"
    confidence: confirmed
    evidence: "Attacker exploited TanStack/router's GitHub Actions release pipeline via chained pull_request_target misconfiguration, cache poisoning, and OIDC token extraction to publish 84 malicious versions across 42 @tanstack/* npm packages."
  - techniqueId: "T1552.001"
    techniqueName: "Credentials In Files"
    tactic: "Credential Access"
    attack-version: "v19"
    confidence: confirmed
    evidence: "Payload router_init.js scanned over 100 file paths on compromised hosts - including ~/.npmrc, SSH private-key files, cloud-provider credential configs, and IDE credential stores - to harvest authentication material at install time."
  - techniqueId: "T1567"
    techniqueName: "Exfiltration Over Web Service"
    tactic: "Exfiltration"
    attack-version: "v19"
    confidence: confirmed
    evidence: "Harvested credentials were exfiltrated to Session/Oxen messenger-network CDN endpoints (filev2.getsession.org, seed1-3.getsession.org) over end-to-end encrypted channels."
---

## Summary

On May 11, 2026, 84 malicious versions across 42 `@tanstack/*` npm packages were published to the npm registry through the TanStack project's own GitHub Actions release pipeline. The publish window lasted approximately six minutes — 19:20:39 to roughly 19:26 UTC — before an external researcher detected the malicious releases and TanStack maintainers engaged npm security. All 84 versions were subsequently deprecated and tarballs pulled server-side.

The attacker chained three weaknesses in the TanStack/router GitHub Actions configuration: a `pull_request_target` workflow misconfiguration that allowed untrusted fork code to execute in a privileged context; GitHub Actions cache poisoning that injected attacker-controlled binaries into the base-repository build environment; and runtime extraction of a GitHub Actions OIDC token via Linux process memory reads, which provided the trusted-publisher credential required to publish npm packages under the TanStack namespace without modifying any project secret or long-lived credential.

The malicious packages delivered `router_init.js`, an approximately 2.3 MB obfuscated JavaScript credential stealer, executed via an npm lifecycle hook at install time. The payload harvested credentials from over 100 file paths and exfiltrated them to Session Protocol CDN endpoints. A worm-propagation routine used stolen npm and GitHub credentials to republish infected versions of packages maintained by compromised accounts, extending the attack surface beyond the initial `@tanstack/*` namespace to include packages in `@uipath/*`, `@opensearch-project/opensearch`, and others.

Vendor analysis by Socket Research Team and StepSecurity links this attack pattern to the Mini Shai-Hulud npm worm and the TeamPCP threat cluster. This attribution is vendor-assessed only; no U.S. or international government authority had confirmed it at time of writing.

## Technical Analysis

The attack exploited three chained weaknesses in the TanStack/router GitHub Actions configuration:

**`pull_request_target` misconfiguration.** The `bundle-size.yml` workflow was triggered by `pull_request_target` events and checked out code from the pull-request head without requiring maintainer approval. Because `pull_request_target` runs in the context of the base repository — with access to repository secrets and write permissions — this allowed the attacker, operating as GitHub account `voicproducoes` (ID 269549300, created March 19, 2026), to execute arbitrary code in a privileged context by opening a pull request from a fork.

**GitHub Actions cache poisoning.** Code executed via the misconfigured `bundle-size.yml` workflow wrote a corrupted pnpm dependency store (approximately 1.1 GB) to the GitHub Actions cache service across the fork-to-base trust boundary. When the legitimate `release.yml` workflow subsequently ran, it restored this poisoned cache, injecting attacker-controlled binaries into the release build environment.

**OIDC token extraction via process memory.** The attacker-controlled binaries in the poisoned cache included a Python script that read the GitHub Actions Runner.Worker process memory via `/proc/<pid>/mem` on the Linux-hosted runner. This extracted the short-lived GitHub Actions OIDC token provisioned for the npm publish step before it was consumed by the legitimate workflow. The attacker used this token to authenticate directly to npm's trusted-publisher endpoint and publish packages under the TanStack namespace — without requiring access to any stored secret.

The malicious packages each included `router_init.js` in their tarball root, loaded via a fictitious `@tanstack/setup` package referenced through an `optionalDependencies` field that resolved to an orphan commit in the attacker's fork network. Execution was triggered at install time by a `prepare` lifecycle hook in `package.json`. The payload (approximately 2.3 MB) uses three layers of obfuscation: an obfuscator.io string-array rotation dispatcher, a Fisher-Yates substitution cipher with PBKDF2 key derivation, and AES-256-GCM encrypted inner payloads requiring Bun runtime decompression. At runtime the payload daemonizes itself using a `__DAEMONIZED` re-entrancy guard, enumerates and harvests credentials across more than 100 file paths, exfiltrates collected material to Session/Oxen CDN endpoints, and then attempts worm propagation by enumerating packages maintained by the compromised account via the npm registry API and republishing them with injected payload code.

StepSecurity researchers noted that the malicious packages carried valid SLSA Build Level 3 provenance attestations, because they were published through the project's own OIDC-trusted GitHub Actions pipeline after token theft. This demonstrates that valid provenance attestation alone does not guarantee pipeline integrity when the pipeline itself is the attack target.

## Attack Chain

### Stage 1: Fork and payload staging (May 10, 2026)

GitHub account `voicproducoes` (ID 269549300) forked `TanStack/router` on May 10 at approximately 17:16 UTC. A malicious commit (SHA `79ac49eedf774dd4b0cfa308722bc463cfe5885c`) was authored under the forged identity `claude <claude@users.noreply.github.com>` — not affiliated with Anthropic — and staged a fictitious `@tanstack/setup` package containing `router_init.js` and `tanstack_runner.js`, referenced as `optionalDependencies` for the main TanStack router packages. A second attacker-controlled account, `zblgg` (ID 127806521), was used for associated repository infrastructure.

### Stage 2: Workflow trigger and cache poisoning (May 11, ~10:49–11:29 UTC)

The attacker opened pull request #7378 against `TanStack/router`. The `pull_request_target`-triggered `bundle-size.yml` workflow executed checkout and ran attacker-controlled code from the fork. A subsequent force-push landing commit `65bf499d` caused `bundle-size.yml` to execute the full payload, which wrote a corrupted pnpm dependency store (~1.1 GB) to the GitHub Actions cache at approximately 11:29 UTC.

### Stage 3: OIDC token extraction and npm publish (May 11, 19:20–19:26 UTC)

When the `release.yml` workflow ran, it restored the poisoned cache. Attacker-controlled binaries read the GitHub Actions Runner.Worker process memory via `/proc/<pid>/mem`, extracting the OIDC token provisioned for the npm publish step. The attacker used this token to publish 84 malicious versions across 42 `@tanstack/*` packages to the npm registry between 19:20:39 and approximately 19:26 UTC — two malicious versions per package.

### Stage 4: External detection and response (May 11, ~19:50 UTC onward)

Researcher ashishkurmi of StepSecurity detected the malicious releases within approximately 30 minutes of the first publish and reported via GitHub issue #7383. TanStack maintainers engaged npm security. All 84 versions were deprecated; npm security pulled tarballs server-side where standard `npm unpublish` was unavailable due to the 72-hour unpublish restriction. Socket's AI scanner reported flagging the malicious artifacts within six minutes of publication.

## Impact Assessment

**Directly affected packages.** 84 malicious versions across 42 `@tanstack/*` packages were available for installation for approximately 30 minutes. `@tanstack/react-router` alone reports over 12 million weekly downloads. Any developer or CI environment that ran an install command against an affected version during the exposure window should be treated as potentially compromised.

**Credential exposure scope.** The payload targeted over 100 credential file paths per compromised host, including AWS IMDS and Secrets Manager tokens, GCP metadata service credentials, Kubernetes service-account tokens, HashiCorp Vault tokens, npm authentication tokens, GitHub personal access tokens, SSH private keys, and credentials stored in IDE and AI tooling configuration directories. All credentials accessible to the affected process environment should be considered potentially harvested regardless of whether exfiltration is confirmed for a given host.

**Worm propagation.** Using credentials stolen from compromised accounts, the payload republished infected versions of other packages maintained by those accounts. Reported downstream namespaces include `@uipath/*` (60+ packages per StepSecurity reporting), `@opensearch-project/opensearch`, the PyPI packages `mistralai` and `guardrails-ai`, and others. The total number of affected downstream packages was still being established at time of writing.

**Developer workstation persistence.** The payload attempted to install persistence hooks into Claude Code configuration files (`.claude/router_runtime.js`, `.claude/settings.json`) and VS Code task configuration (`.vscode/tasks.json`), and to establish OS-level service persistence via LaunchAgents on macOS and systemd unit files on Linux. Developers who installed an affected version on a workstation should inspect these locations in addition to rotating credentials.

**SLSA attestation scope.** The malicious packages carried valid SLSA Build Level 3 provenance attestations produced by the project's own trusted-publisher pipeline after OIDC token theft. Provenance attestation verifies that artifacts were built by the recorded pipeline; it does not detect pipeline compromise upstream of the publish step.

No public information on confirmed exfiltration volume or the precise number of distinct victims was available at time of writing.

## Attribution

Vendor analysis by Socket Research Team and StepSecurity attributes this attack to the Mini Shai-Hulud npm worm and the TeamPCP threat cluster. Supporting artefacts cited in vendor reporting include: an in-payload attacker message reading "We've been online over 2 hours now stealing creds...With Love TeamPCP"; Dune universe-themed branch naming in the attacker's fork (references to fremen, harkonnen, melange, sandworm); repository infrastructure consistent with prior Mini Shai-Hulud campaign tooling; an npm token description containing a wiper-action threat on revocation, consistent with prior TeamPCP operational style; and attack methodology overlapping with the broader pattern of GitHub Actions trusted-publisher abuse documented in prior Mini Shai-Hulud activity. StepSecurity additionally identified this as the first documented npm worm producing validly-attested SLSA Build Level 3 provenance.

This attribution is vendor-assessed only. No U.S. or international government authority had publicly confirmed attribution of this May 2026 TanStack incident to TeamPCP or any other specific actor at time of writing. The CISA advisory from September 2025 addresses an earlier Shai-Hulud npm worm pattern and does not speak to this event.

## Timeline

### 2026-03-19 — Attacker account created

GitHub account `voicproducoes` (ID 269549300) is registered.

### 2026-05-10, 17:16 UTC — Repository fork

`voicproducoes` forks `TanStack/router`, renaming the fork to `github.com/zblgg/configuration`.

### 2026-05-10, 23:29 UTC — Malicious commit authored

Commit `79ac49ee` staged in the fork under the forged committer identity `claude <claude@users.noreply.github.com>`, staging payload files including `router_init.js`.

### 2026-05-11, ~10:49 UTC — Pull request opened

Pull request #7378 opened against `TanStack/router`; the `pull_request_target`-triggered `bundle-size.yml` workflow executes untrusted fork code.

### 2026-05-11, ~11:11 UTC — Force-push and payload execution

Force-push lands malicious commit `65bf499d`; `bundle-size.yml` executes the full payload.

### 2026-05-11, ~11:29 UTC — Actions cache poisoned

Corrupted pnpm dependency store (~1.1 GB) saved to GitHub Actions cache.

### 2026-05-11, 19:20:39 UTC — First malicious npm publish

`release.yml` restores poisoned cache; OIDC token extracted via `/proc/<pid>/mem`; first malicious package published to npm.

### 2026-05-11, ~19:26 UTC — Publish window closes

All 84 malicious versions across 42 `@tanstack/*` packages published.

### 2026-05-11, ~19:50 UTC — External detection

Researcher ashishkurmi (StepSecurity) detects malicious releases and reports via GitHub issue #7383.

### 2026-05-11 — Deprecation and response

TanStack maintainers engage npm security; all 84 affected versions deprecated; tarballs pulled server-side where standard unpublish is unavailable.

## Remediation & Mitigation

**Immediate actions for affected environments.**

Any developer or CI environment that installed affected `@tanstack/*` versions on May 11, 2026 should treat the host as potentially compromised. Vendor analysis notes the payload includes a wiper routine — do not revoke credentials before isolating the affected machine from the network.

- Delete `node_modules` and lockfiles; reinstall from a clean state pinned to pre-May 11 19:00 UTC versions, then upgrade to patched releases listed in the GitHub Security Advisory (GHSA-g7cv-rxg3-hmpx).
- Rotate all credentials accessible to the affected process environment: AWS access keys and IAM tokens, GCP service-account credentials, Kubernetes service-account tokens, HashiCorp Vault tokens, GitHub personal access tokens, npm tokens, and SSH private keys.
- Inspect `.claude/settings.json`, `.claude/router_runtime.js`, `.vscode/tasks.json`, macOS LaunchAgent plists, and Linux systemd unit directories for persistence artifacts.
- Audit Git history in maintained repositories for commits attributed to `claude@users.noreply.github.com`.
- Check `package.json` files in affected projects for `optionalDependencies` entries referencing `github:tanstack/router#79ac49eedf774dd4b0cfa308722bc463cfe5885c`.
- Block or alert on egress to reported C2 infrastructure: `filev2.getsession.org`, `seed1.getsession.org`, `seed2.getsession.org`, `seed3.getsession.org`, `api.masscan.cloud`, `git-tanstack.com`.

**For projects publishing via GitHub Actions OIDC trusted publishers.**

- Audit every `pull_request_target` workflow: any such workflow that checks out PR-head code should require explicit maintainer approval before executing any step with write permissions or access to secrets.
- Prevent cross-fork cache restoration in release-path workflows; use cache keys scoped to the base branch and restrict cache write permissions on workflows triggered by external contributors.
- Scope OIDC token permissions to the minimum required for publishing and treat OIDC-provisioned tokens with the same discipline as long-lived secrets.
- Pin all GitHub Actions references to full commit SHAs; review third-party action usage in release-path workflows.

**For downstream npm consumers.**

SLSA Build Level 3 attestation verifies that an artifact was produced by the attested pipeline; it does not detect that the pipeline's build environment was compromised upstream of the publish step. End-to-end pipeline integrity — including cache isolation, workflow-trigger scoping, and build-environment provenance — requires controls beyond artifact-level attestation.

## Sources & References

- [Socket Research Team: TanStack npm Packages Compromised — Mini Shai-Hulud Supply-Chain Attack](https://socket.dev/blog/tanstack-npm-packages-compromised-mini-shai-hulud-supply-chain-attack) — Socket Research Team, 2026-05-11
- [TanStack: npm Supply-Chain Compromise Postmortem](https://tanstack.com/blog/npm-supply-chain-compromise-postmortem) — TanStack, 2026-05-11
- [TanStack / GitHub Security: GHSA-g7cv-rxg3-hmpx — Malicious npm packages published via GitHub Actions OIDC token theft](https://github.com/TanStack/router/security/advisories/GHSA-g7cv-rxg3-hmpx) — TanStack / GitHub Security, 2026-05-11
- [TanStack / GitHub: Issue #7383 — Initial malicious package detection report](https://github.com/TanStack/router/issues/7383) — TanStack / GitHub, 2026-05-11
- [StepSecurity: Mini Shai-Hulud Is Back — A Self-Spreading Supply-Chain Attack Hits the npm Ecosystem](https://www.stepsecurity.io/blog/mini-shai-hulud-is-back-a-self-spreading-supply-chain-attack-hits-the-npm-ecosystem) — StepSecurity, 2026-05-11
- [Socket: Mini Shai-Hulud Supply-Chain Attack Tracker](https://socket.dev/supply-chain-attacks/mini-shai-hulud) — Socket, 2026-05-12
- [CISA: Widespread Supply-Chain Compromise Impacting the npm Ecosystem (September 2025 advisory covering earlier Shai-Hulud worm pattern; not specific to this May 2026 TanStack event)](https://www.cisa.gov/news-events/alerts/2025/09/23/widespread-supply-chain-compromise-impacting-npm-ecosystem) — CISA, 2025-09-23
