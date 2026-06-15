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

from supply_chain_purl import PurlError, canonicalize_purl, parse_purl


REPO_ROOT = Path(__file__).resolve().parents[1]
DEFAULT_ENTITY_DIR = REPO_ROOT / "data" / "supply-chain-entities"
DEFAULT_RELATIONSHIP_PATH = REPO_ROOT / "data" / "supply-chain-relationships" / "relationships.json"
DEFAULT_REPORT_PATH = REPO_ROOT / "docs" / "supply-chain-purl-edge-audit.md"


def load_json(path: Path) -> Any:
    return json.loads(path.read_text(encoding="utf-8"))


def canonical_package_result(package: Any, index: int | None = None) -> tuple[str, str] | None:
    label = f"packages[{index}]" if index is not None else "package"
    if not isinstance(package, dict):
        return ("invalid", f"{label}: expected object")
    package_id = package.get("id", "<missing-id>")
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
        return ("generic_exception", f"{package_id}: generic package_url is justified but not release-spine joinable")
    return None


def canonical_release_result(release: Any, index: int | None = None) -> tuple[str, str] | None:
    label = f"releases[{index}]" if index is not None else "release"
    if not isinstance(release, dict):
        return ("invalid", f"{label}: expected object")
    release_id = release.get("id", "<missing-id>")
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
    parsed = parse_purl(canonical)
    if canonical != purl:
        return ("invalid", f"{release_id}: non-canonical purl, expected {canonical}")
    if not parsed.version:
        return ("missing", f"{release_id}: missing PURL version")
    if parsed.type == "generic":
        return ("invalid", f"{release_id}: generic release PURL is not joinable")
    return None


def build_audit(entity_dir: Path, relationship_path: Path) -> dict[str, Any]:
    packages = load_json(entity_dir / "packages.json")
    releases = load_json(entity_dir / "releases.json")
    actors = load_json(entity_dir / "actors.json")
    campaigns = load_json(entity_dir / "campaigns.json")
    relationships = load_json(relationship_path)

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

    actor_ids = {actor["id"] for actor in actors if isinstance(actor, dict) and isinstance(actor.get("id"), str)}
    campaign_ids = {
        campaign["id"] for campaign in campaigns if isinstance(campaign, dict) and isinstance(campaign.get("id"), str)
    }
    package_ids = {
        package["id"] for package in packages if isinstance(package, dict) and isinstance(package.get("id"), str)
    }
    release_ids = {
        release["id"] for release in releases if isinstance(release, dict) and isinstance(release.get("id"), str)
    }
    dangling_actor_edges = []
    dangling_campaign_edges = []
    dangling_package_edges = []
    dangling_release_edges = []
    for index, relationship in enumerate(relationships):
        if not isinstance(relationship, dict):
            continue
        rel_type = relationship.get("type")
        source = relationship.get("source")
        target = relationship.get("target")
        if rel_type == "ATTRIBUTED_TO_ACTOR" and target not in actor_ids:
            dangling_actor_edges.append(f"relationships[{index}]: missing actor target {target!r}")
        if rel_type == "RELATED_CAMPAIGN" and target not in campaign_ids:
            dangling_campaign_edges.append(f"relationships[{index}]: missing campaign target {target!r}")
        if rel_type == "AFFECTED_PACKAGE" and target not in package_ids:
            dangling_package_edges.append(f"relationships[{index}]: missing package target {target!r}")
        if rel_type == "PACKAGE_RELEASE":
            if source not in package_ids:
                dangling_package_edges.append(f"relationships[{index}]: missing package source {source!r}")
            if target not in release_ids:
                dangling_release_edges.append(f"relationships[{index}]: missing release target {target!r}")
        if rel_type == "INCIDENT_AFFECTED_RELEASE" and target not in release_ids:
            dangling_release_edges.append(f"relationships[{index}]: missing release target {target!r}")

    failures = (
        missing_purls
        + invalid_purls
        + dangling_actor_edges
        + dangling_campaign_edges
        + dangling_package_edges
        + dangling_release_edges
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
        "dangling_package_edges": dangling_package_edges,
        "dangling_release_edges": dangling_release_edges,
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
            f"- Dangling package edges: {len(audit['dangling_package_edges'])}",
            f"- Dangling release edges: {len(audit['dangling_release_edges'])}",
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
            "## Dangling Package Edges",
            "",
            bullet_list(audit["dangling_package_edges"]).rstrip(),
            "",
            "## Dangling Release Edges",
            "",
            bullet_list(audit["dangling_release_edges"]).rstrip(),
            "",
        ]
    )


def main(argv: list[str] | None = None) -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--entity-dir", type=Path, default=DEFAULT_ENTITY_DIR)
    parser.add_argument("--relationships", type=Path, default=DEFAULT_RELATIONSHIP_PATH)
    parser.add_argument("--report", type=Path, default=DEFAULT_REPORT_PATH)
    args = parser.parse_args(argv)

    audit = build_audit(args.entity_dir, args.relationships)
    args.report.write_text(render_report(audit), encoding="utf-8")
    print(
        f"Supply-chain PURL/edge audit: {audit['status']} "
        f"packages={audit['package_count']} releases={audit['release_count']} "
        f"missing_purls={len(audit['missing_purls'])} invalid_purls={len(audit['invalid_purls'])} "
        f"dangling_actor_edges={len(audit['dangling_actor_edges'])} "
        f"dangling_campaign_edges={len(audit['dangling_campaign_edges'])} "
        f"dangling_package_edges={len(audit['dangling_package_edges'])} "
        f"dangling_release_edges={len(audit['dangling_release_edges'])}"
    )
    return 0 if audit["status"] == "PASS" else 1


if __name__ == "__main__":
    raise SystemExit(main())
