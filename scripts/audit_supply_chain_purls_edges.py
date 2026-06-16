#!/usr/bin/env python3
"""Generate a supply-chain PURL and cross-corpus edge audit report."""

from __future__ import annotations

import argparse
from datetime import datetime, timezone
import json
from pathlib import Path
import sys
from typing import Any

SCRIPT_DIR = Path(__file__).resolve().parent
if str(SCRIPT_DIR) not in sys.path:
    sys.path.insert(0, str(SCRIPT_DIR))

from supply_chain_purl import PurlError, canonicalize_purl, emit_purl, parse_purl


REPO_ROOT = Path(__file__).resolve().parents[1]
DEFAULT_ENTITY_DIR = REPO_ROOT / "data" / "supply-chain-entities"
DEFAULT_INCIDENT_PATH = REPO_ROOT / "data" / "supply-chain-incidents" / "incidents.json"
DEFAULT_RELATIONSHIP_PATH = REPO_ROOT / "data" / "supply-chain-relationships" / "relationships.json"
DEFAULT_REPORT_PATH = REPO_ROOT / "docs" / "supply-chain-purl-edge-audit.md"
CONTENT_ROOT = REPO_ROOT / "site" / "src" / "content"
GENERIC_JUSTIFICATION_MIN_LENGTH = 20
INCIDENT_SOURCE_RELATIONSHIP_TYPES = {
    "AFFECTED_MAINTAINER",
    "AFFECTED_ORGANIZATION",
    "AFFECTED_PACKAGE",
    "AFFECTED_REPOSITORY",
    "COMPROMISED_ACCOUNT",
    "INCIDENT_AFFECTED_RELEASE",
    "RELATED_CAMPAIGN",
    "SOURCE_ARTIFACT_DIVERGENCE",
    "USED_BUILD_SYSTEM",
    "USED_DISTRIBUTION_CHANNEL",
}
VALID_RELATIONSHIP_TYPES = INCIDENT_SOURCE_RELATIONSHIP_TYPES | {
    "ATTRIBUTED_TO_ACTOR",
    "MAINTAINS_REPOSITORY",
    "PACKAGE_RELEASE",
    "USES_ACCOUNT",
}


def load_json(path: Path) -> Any:
    return json.loads(path.read_text(encoding="utf-8"))


def canonical_package_result(package: Any, index: int | None = None) -> tuple[str, str] | None:
    label = f"packages[{index}]" if index is not None else "package"
    if not isinstance(package, dict):
        return ("invalid", f"{label}: expected object")
    package_id = package.get("id")
    if not isinstance(package_id, str) or not package_id.strip():
        return ("invalid", f"{label}: missing or invalid id")
    package_url = package.get("package_url")
    if not isinstance(package_url, str) or not package_url.strip():
        return ("missing", f"{package_id}: missing package_url")
    try:
        canonical = canonicalize_purl(
            package_url,
            ecosystem=package.get("ecosystem"),
            package_name=package.get("name"),
        )
    except PurlError as exc:
        return ("invalid", f"{package_id}: invalid package_url: {exc}")
    if canonical != package_url:
        return ("invalid", f"{package_id}: non-canonical package_url, expected {canonical}")
    if parse_purl(canonical).type == "generic":
        justification = package.get("purl_justification")
        if not isinstance(justification, str) or len(justification.strip()) < GENERIC_JUSTIFICATION_MIN_LENGTH:
            return (
                "invalid",
                f"{package_id}: generic package_url requires purl_justification "
                f"with at least {GENERIC_JUSTIFICATION_MIN_LENGTH} characters",
            )
        return ("generic_exception", f"{package_id}: generic package_url is justified but not release-spine joinable")
    return None


def canonical_release_result(release: Any, index: int | None = None) -> tuple[str, str] | None:
    label = f"releases[{index}]" if index is not None else "release"
    if not isinstance(release, dict):
        return ("invalid", f"{label}: expected object")
    release_id = release.get("id")
    if not isinstance(release_id, str) or not release_id.strip():
        return ("invalid", f"{label}: missing or invalid id")
    purl = release.get("purl")
    if not isinstance(purl, str) or not purl.strip():
        return ("missing", f"{release_id}: missing purl")
    try:
        canonical = canonicalize_purl(
            purl,
            ecosystem=release.get("ecosystem"),
            package_name=release.get("package_name"),
        )
    except PurlError as exc:
        return ("invalid", f"{release_id}: invalid purl: {exc}")
    if canonical != purl:
        return ("invalid", f"{release_id}: non-canonical purl, expected {canonical}")
    parsed = parse_purl(canonical)
    if not parsed.version:
        return ("missing", f"{release_id}: missing PURL version")
    if parsed.type == "generic":
        return ("invalid", f"{release_id}: generic release PURL is not joinable")
    version = release.get("version")
    if not isinstance(version, str) or not version.strip():
        return ("invalid", f"{release_id}: missing version")
    if parsed.version != version.strip():
        return (
            "invalid",
            f"{release_id}: PURL version {parsed.version!r} does not match version {version!r}",
        )
    return None


def package_base_purl(package: Any) -> str | None:
    if not isinstance(package, dict):
        return None
    package_url = package.get("package_url")
    if not isinstance(package_url, str):
        return None
    try:
        return canonicalize_purl(package_url, ecosystem=package.get("ecosystem"), package_name=package.get("name"))
    except PurlError:
        return None


def release_base_purl(release: Any) -> str | None:
    if not isinstance(release, dict):
        return None
    purl = release.get("purl")
    if not isinstance(purl, str):
        return None
    try:
        canonical = canonicalize_purl(purl, ecosystem=release.get("ecosystem"), package_name=release.get("package_name"))
        parsed = parse_purl(canonical)
    except PurlError:
        return None
    return emit_purl(parsed._replace(version=None))


def content_href_exists(href: Any) -> bool:
    if not isinstance(href, str) or not href.startswith("/"):
        return False
    path = href.split("?", 1)[0].split("#", 1)[0]
    parts = [part for part in path.strip("/").split("/") if part]
    if len(parts) != 2:
        return False
    collection, slug = parts
    if collection not in {"threat-actors", "campaigns"}:
        return False
    return (CONTENT_ROOT / collection / f"{slug}.md").exists() or (CONTENT_ROOT / collection / f"{slug}.mdx").exists()


def build_audit(entity_dir: Path, relationship_path: Path, incident_path: Path = DEFAULT_INCIDENT_PATH) -> dict[str, Any]:
    packages = load_json(entity_dir / "packages.json")
    releases = load_json(entity_dir / "releases.json")
    actors = load_json(entity_dir / "actors.json")
    campaigns = load_json(entity_dir / "campaigns.json")
    maintainers = load_json(entity_dir / "maintainers.json")
    relationships = load_json(relationship_path)
    incidents = load_json(incident_path)

    purl_results = [
        result
        for result in (
            [canonical_package_result(package, index) for index, package in enumerate(packages)]
            + [canonical_release_result(release, index) for index, release in enumerate(releases)]
        )
        if result is not None
    ]
    missing_purls = [message for category, message in purl_results if category == "missing"]
    invalid_purls = [message for category, message in purl_results if category == "invalid"]
    generic_exceptions = [message for category, message in purl_results if category == "generic_exception"]

    actor_by_id = {actor["id"]: actor for actor in actors if isinstance(actor, dict) and isinstance(actor.get("id"), str)}
    campaign_by_id = {
        campaign["id"]: campaign
        for campaign in campaigns
        if isinstance(campaign, dict) and isinstance(campaign.get("id"), str)
    }
    package_by_id = {
        package["id"]: package for package in packages if isinstance(package, dict) and isinstance(package.get("id"), str)
    }
    release_by_id = {
        release["id"]: release for release in releases if isinstance(release, dict) and isinstance(release.get("id"), str)
    }
    incident_ids = {
        f"incident-{incident['id']}"
        for incident in incidents
        if isinstance(incident, dict) and isinstance(incident.get("id"), str)
    }
    maintainer_ids = {
        maintainer["id"]
        for maintainer in maintainers
        if isinstance(maintainer, dict) and isinstance(maintainer.get("id"), str)
    }
    actor_ids = set(actor_by_id)
    campaign_ids = {
        campaign["id"] for campaign in campaigns if isinstance(campaign, dict) and isinstance(campaign.get("id"), str)
    }
    package_ids = set(package_by_id)
    release_ids = set(release_by_id)
    dangling_actor_edges = []
    dangling_campaign_edges = []
    dangling_incident_edges = []
    broken_actor_hrefs = []
    broken_campaign_hrefs = []
    dangling_package_edges = []
    dangling_release_edges = []
    invalid_relationship_edges = []
    for actor_id, actor in actor_by_id.items():
        href = actor.get("href")
        if isinstance(href, str) and href.strip() and not content_href_exists(href):
            broken_actor_hrefs.append(f"{actor_id}: href does not resolve to content {href!r}")
    for campaign_id, campaign in campaign_by_id.items():
        href = campaign.get("href")
        if isinstance(href, str) and href.strip() and not content_href_exists(href):
            broken_campaign_hrefs.append(f"{campaign_id}: href does not resolve to content {href!r}")
    if not isinstance(relationships, list):
        relationships = []
        invalid_relationship_edges.append("relationships: expected list")
    for index, relationship in enumerate(relationships):
        if not isinstance(relationship, dict):
            invalid_relationship_edges.append(f"relationships[{index}]: expected object")
            continue
        rel_type = relationship.get("type")
        source = relationship.get("source")
        target = relationship.get("target")
        if rel_type not in VALID_RELATIONSHIP_TYPES:
            invalid_relationship_edges.append(f"relationships[{index}]: unknown relationship type {rel_type!r}")
            continue
        if rel_type in INCIDENT_SOURCE_RELATIONSHIP_TYPES:
            if not isinstance(source, str):
                invalid_relationship_edges.append(f"relationships[{index}]: {rel_type} source must be string")
            elif source not in incident_ids:
                dangling_incident_edges.append(f"relationships[{index}]: missing incident source {source!r}")
        if rel_type == "ATTRIBUTED_TO_ACTOR":
            if not isinstance(source, str):
                invalid_relationship_edges.append(f"relationships[{index}]: ATTRIBUTED_TO_ACTOR source must be string")
            elif source not in incident_ids and source not in maintainer_ids:
                invalid_relationship_edges.append(
                    f"relationships[{index}]: ATTRIBUTED_TO_ACTOR source must be an incident or maintainer {source!r}"
                )
        if rel_type == "ATTRIBUTED_TO_ACTOR":
            if not isinstance(target, str):
                invalid_relationship_edges.append(f"relationships[{index}]: ATTRIBUTED_TO_ACTOR target must be string")
            elif target not in actor_ids:
                dangling_actor_edges.append(f"relationships[{index}]: missing actor target {target!r}")
        if rel_type == "RELATED_CAMPAIGN":
            if not isinstance(target, str):
                invalid_relationship_edges.append(f"relationships[{index}]: RELATED_CAMPAIGN target must be string")
            elif target not in campaign_ids:
                dangling_campaign_edges.append(f"relationships[{index}]: missing campaign target {target!r}")
        if rel_type == "AFFECTED_PACKAGE":
            if not isinstance(target, str):
                invalid_relationship_edges.append(f"relationships[{index}]: AFFECTED_PACKAGE target must be string")
            elif target not in package_ids:
                dangling_package_edges.append(f"relationships[{index}]: missing package target {target!r}")
        if rel_type == "PACKAGE_RELEASE":
            if not isinstance(source, str):
                invalid_relationship_edges.append(f"relationships[{index}]: PACKAGE_RELEASE source must be string")
            elif source not in package_ids:
                dangling_package_edges.append(f"relationships[{index}]: missing package source {source!r}")
            if not isinstance(target, str):
                invalid_relationship_edges.append(f"relationships[{index}]: PACKAGE_RELEASE target must be string")
            elif target not in release_ids:
                dangling_release_edges.append(f"relationships[{index}]: missing release target {target!r}")
            elif isinstance(source, str) and source in package_ids:
                package_purl = package_base_purl(package_by_id[source])
                release_purl = release_base_purl(release_by_id[target])
                if package_purl and release_purl and package_purl != release_purl:
                    invalid_relationship_edges.append(
                        f"relationships[{index}]: PACKAGE_RELEASE PURL mismatch {source!r} -> {target!r} "
                        f"({package_purl!r} != {release_purl!r})"
                    )
        if rel_type == "INCIDENT_AFFECTED_RELEASE":
            if not isinstance(target, str):
                invalid_relationship_edges.append(f"relationships[{index}]: INCIDENT_AFFECTED_RELEASE target must be string")
            elif target not in release_ids:
                dangling_release_edges.append(f"relationships[{index}]: missing release target {target!r}")

    failures = (
        missing_purls
        + invalid_purls
        + dangling_actor_edges
        + dangling_campaign_edges
        + dangling_incident_edges
        + broken_actor_hrefs
        + broken_campaign_hrefs
        + dangling_package_edges
        + dangling_release_edges
        + invalid_relationship_edges
    )
    return {
        "status": "PASS" if not failures else "FAIL",
        "generated_at": datetime.now(timezone.utc).replace(microsecond=0).isoformat().replace("+00:00", "Z"),
        "package_count": len(packages),
        "release_count": len(releases),
        "missing_purls": missing_purls,
        "invalid_purls": invalid_purls,
        "generic_purl_exceptions": generic_exceptions,
        "dangling_actor_edges": dangling_actor_edges,
        "dangling_campaign_edges": dangling_campaign_edges,
        "dangling_incident_edges": dangling_incident_edges,
        "broken_actor_hrefs": broken_actor_hrefs,
        "broken_campaign_hrefs": broken_campaign_hrefs,
        "dangling_package_edges": dangling_package_edges,
        "dangling_release_edges": dangling_release_edges,
        "invalid_relationship_edges": invalid_relationship_edges,
        "failures": failures,
    }


def render_report(audit: dict[str, Any]) -> str:
    def bullet_list(items: list[str]) -> str:
        if not items:
            return "- none\n"
        return "".join(f"- {item}\n" for item in items)

    return "\n".join(
        [
            "# Supply Chain PURL and Edge Audit",
            "",
            "Generated by `python3 scripts/audit_supply_chain_purls_edges.py`.",
            "",
            "## Summary",
            "",
            f"- Status: {audit['status']}",
            f"- Generated at: {audit['generated_at']}",
            f"- Package count: {audit['package_count']}",
            f"- Release count: {audit['release_count']}",
            f"- Missing PURLs: {len(audit['missing_purls'])}",
            f"- Invalid PURLs: {len(audit['invalid_purls'])}",
            f"- Generic PURL exceptions: {len(audit['generic_purl_exceptions'])}",
            f"- Dangling actor edges: {len(audit['dangling_actor_edges'])}",
            f"- Dangling campaign edges: {len(audit['dangling_campaign_edges'])}",
            f"- Dangling incident edges: {len(audit['dangling_incident_edges'])}",
            f"- Broken actor hrefs: {len(audit['broken_actor_hrefs'])}",
            f"- Broken campaign hrefs: {len(audit['broken_campaign_hrefs'])}",
            f"- Dangling package edges: {len(audit['dangling_package_edges'])}",
            f"- Dangling release edges: {len(audit['dangling_release_edges'])}",
            f"- Invalid relationship edges: {len(audit['invalid_relationship_edges'])}",
            "",
            "## Missing PURLs",
            "",
            bullet_list(audit["missing_purls"]).rstrip(),
            "",
            "## Invalid PURLs",
            "",
            bullet_list(audit["invalid_purls"]).rstrip(),
            "",
            "## Generic PURL Exceptions",
            "",
            bullet_list(audit["generic_purl_exceptions"]).rstrip(),
            "",
            "## Dangling Actor Edges",
            "",
            bullet_list(audit["dangling_actor_edges"]).rstrip(),
            "",
            "## Dangling Campaign Edges",
            "",
            bullet_list(audit["dangling_campaign_edges"]).rstrip(),
            "",
            "## Dangling Incident Edges",
            "",
            bullet_list(audit["dangling_incident_edges"]).rstrip(),
            "",
            "## Broken Actor Hrefs",
            "",
            bullet_list(audit["broken_actor_hrefs"]).rstrip(),
            "",
            "## Broken Campaign Hrefs",
            "",
            bullet_list(audit["broken_campaign_hrefs"]).rstrip(),
            "",
            "## Dangling Package Edges",
            "",
            bullet_list(audit["dangling_package_edges"]).rstrip(),
            "",
            "## Dangling Release Edges",
            "",
            bullet_list(audit["dangling_release_edges"]).rstrip(),
            "",
            "## Invalid Relationship Edges",
            "",
            bullet_list(audit["invalid_relationship_edges"]).rstrip(),
            "",
        ]
    )


def main(argv: list[str] | None = None) -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--entity-dir", type=Path, default=DEFAULT_ENTITY_DIR)
    parser.add_argument("--incidents", type=Path, default=DEFAULT_INCIDENT_PATH)
    parser.add_argument("--relationships", type=Path, default=DEFAULT_RELATIONSHIP_PATH)
    parser.add_argument("--report", type=Path, default=DEFAULT_REPORT_PATH)
    args = parser.parse_args(argv)

    try:
        audit = build_audit(args.entity_dir, args.relationships, args.incidents)
    except (OSError, json.JSONDecodeError) as exc:
        print(f"Error loading audit data: {exc}", file=sys.stderr)
        return 1
    args.report.parent.mkdir(parents=True, exist_ok=True)
    args.report.write_text(render_report(audit), encoding="utf-8")
    print(
        f"Supply-chain PURL/edge audit: {audit['status']} "
        f"packages={audit['package_count']} releases={audit['release_count']} "
        f"missing_purls={len(audit['missing_purls'])} invalid_purls={len(audit['invalid_purls'])} "
        f"dangling_actor_edges={len(audit['dangling_actor_edges'])} "
        f"dangling_campaign_edges={len(audit['dangling_campaign_edges'])} "
        f"dangling_incident_edges={len(audit['dangling_incident_edges'])} "
        f"broken_actor_hrefs={len(audit['broken_actor_hrefs'])} "
        f"broken_campaign_hrefs={len(audit['broken_campaign_hrefs'])} "
        f"dangling_package_edges={len(audit['dangling_package_edges'])} "
        f"dangling_release_edges={len(audit['dangling_release_edges'])} "
        f"invalid_relationship_edges={len(audit['invalid_relationship_edges'])}"
    )
    return 0 if audit["status"] == "PASS" else 1


if __name__ == "__main__":
    raise SystemExit(main())
