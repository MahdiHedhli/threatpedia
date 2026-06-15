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
DEFAULT_SITE_CONTENT_DIR = REPO_ROOT / "site" / "src" / "content"
VALID_PROPAGATION_TIERS = {"causal", "temporal"}


def load_json(path: Path) -> Any:
    return json.loads(path.read_text(encoding="utf-8"))


def purl_identity(value: str) -> tuple[str, str | None, str]:
    parsed = parse_purl(value)
    return parsed.type, parsed.namespace, parsed.name


def href_exists(site_content_dir: Path, href: str, expected_collection: str) -> bool:
    if not href.startswith("/") or href.startswith("//"):
        return False
    normalized = href[1:].rstrip("/")
    if not normalized:
        return False
    parts = normalized.split("/")
    if any(part in {"", ".", ".."} for part in parts):
        return False
    if Path(normalized).suffix:
        return False
    if not normalized.startswith(f"{expected_collection}/"):
        return False
    path = site_content_dir / normalized
    return path.with_suffix(".md").is_file() or path.with_suffix(".mdx").is_file()


def seeded_by_cycle_errors(edges: list[tuple[str, str]]) -> list[str]:
    graph: dict[str, list[str]] = {}
    for source, target in edges:
        graph.setdefault(source, []).append(target)

    errors: list[str] = []
    visiting: set[str] = set()
    visited: set[str] = set()

    def visit(node: str, path_stack: list[str]) -> None:
        if node in visiting:
            cycle_start = path_stack.index(node) if node in path_stack else 0
            cycle = " -> ".join(path_stack[cycle_start:] + [node])
            errors.append(f"SEEDED_BY cycle detected: {cycle}")
            return
        if node in visited:
            return
        visiting.add(node)
        for target in graph.get(node, []):
            visit(target, path_stack + [target])
        visiting.remove(node)
        visited.add(node)

    for node in sorted(graph):
        visit(node, [node])
    return errors


def is_generic_package_entity(entity: dict[str, Any] | None) -> bool:
    if not isinstance(entity, dict):
        return False
    package_url = entity.get("package_url")
    if not isinstance(package_url, str):
        return False
    try:
        return parse_purl(package_url).type == "generic"
    except PurlError:
        return False


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
    if canonical != purl:
        return ("invalid", f"{release_id}: non-canonical purl, expected {canonical}")
    parsed = parse_purl(canonical)
    if not parsed.version:
        return ("missing", f"{release_id}: missing PURL version")
    if parsed.version != release.get("version"):
        return ("invalid", f"{release_id}: version does not match PURL version {parsed.version!r}")
    if parsed.type == "generic":
        return ("invalid", f"{release_id}: generic release PURL is not joinable")
    return None


def build_audit(entity_dir: Path, relationship_path: Path, site_content_dir: Path = DEFAULT_SITE_CONTENT_DIR) -> dict[str, Any]:
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
    packages_by_id = {
        package["id"]: package for package in packages if isinstance(package, dict) and isinstance(package.get("id"), str)
    }
    releases_by_id = {
        release["id"]: release for release in releases if isinstance(release, dict) and isinstance(release.get("id"), str)
    }
    actors_by_id = {
        actor["id"]: actor for actor in actors if isinstance(actor, dict) and isinstance(actor.get("id"), str)
    }
    campaigns_by_id = {
        campaign["id"]: campaign for campaign in campaigns if isinstance(campaign, dict) and isinstance(campaign.get("id"), str)
    }
    dangling_actor_edges = []
    dangling_campaign_edges = []
    dangling_package_edges = []
    dangling_release_edges = []
    invalid_relationship_edges = []
    invalid_package_release_edges = []
    invalid_seeded_by_edges = []
    seeded_by_edges = []
    seeded_by_tier_counts = {"causal": 0, "temporal": 0}
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
        if rel_type == "ATTRIBUTED_TO_ACTOR":
            if not isinstance(target, str):
                invalid_relationship_edges.append(f"relationships[{index}]: ATTRIBUTED_TO_ACTOR target must be string")
            elif target not in actor_ids:
                dangling_actor_edges.append(f"relationships[{index}]: missing actor target {target!r}")
            else:
                actor = actors_by_id.get(target)
                href = actor.get("href") if isinstance(actor, dict) else None
                actor_type = actor.get("actor_type") if isinstance(actor, dict) else None
                if isinstance(href, str) and href.strip():
                    if not href_exists(site_content_dir, href, "threat-actors"):
                        dangling_actor_edges.append(f"relationships[{index}]: actor target {target!r} href {href!r} has no page")
                elif actor_type != "provisional":
                    dangling_actor_edges.append(f"relationships[{index}]: actor target {target!r} has no href")
        if rel_type == "RELATED_CAMPAIGN":
            if not isinstance(target, str):
                invalid_relationship_edges.append(f"relationships[{index}]: RELATED_CAMPAIGN target must be string")
            elif target not in campaign_ids:
                dangling_campaign_edges.append(f"relationships[{index}]: missing campaign target {target!r}")
            else:
                campaign = campaigns_by_id.get(target)
                href = campaign.get("href") if isinstance(campaign, dict) else None
                if not isinstance(href, str) or not href.strip():
                    dangling_campaign_edges.append(f"relationships[{index}]: campaign target {target!r} has no href")
                elif not href_exists(site_content_dir, href, "campaigns"):
                    dangling_campaign_edges.append(f"relationships[{index}]: campaign target {target!r} href {href!r} has no page")
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
            if isinstance(source, str) and isinstance(target, str) and source in packages_by_id and target in releases_by_id:
                package_url = packages_by_id[source].get("package_url")
                release_purl = releases_by_id[target].get("purl")
                if isinstance(package_url, str) and isinstance(release_purl, str):
                    try:
                        package_identity = purl_identity(package_url)
                        release_identity = purl_identity(release_purl)
                    except PurlError as exc:
                        invalid_package_release_edges.append(
                            f"relationships[{index}]: failed to compare package/release PURLs: {exc}"
                        )
                    else:
                        if package_identity != release_identity:
                            invalid_package_release_edges.append(
                                f"relationships[{index}]: PACKAGE_RELEASE PURL mismatch {package_url!r} -> {release_purl!r}"
                            )
        if rel_type == "INCIDENT_AFFECTED_RELEASE":
            if not isinstance(target, str):
                invalid_relationship_edges.append(f"relationships[{index}]: INCIDENT_AFFECTED_RELEASE target must be string")
            elif target not in release_ids:
                dangling_release_edges.append(f"relationships[{index}]: missing release target {target!r}")
        if rel_type == "SEEDED_BY":
            valid_endpoint_ids = package_ids | release_ids
            if not isinstance(source, str):
                invalid_seeded_by_edges.append(f"relationships[{index}]: SEEDED_BY source must be string")
            elif source not in valid_endpoint_ids:
                invalid_seeded_by_edges.append(f"relationships[{index}]: missing SEEDED_BY source {source!r}")
            elif source in packages_by_id and is_generic_package_entity(packages_by_id.get(source)):
                invalid_seeded_by_edges.append(
                    f"relationships[{index}]: SEEDED_BY source package {source!r} is not release-spine joinable"
                )
            if not isinstance(target, str):
                invalid_seeded_by_edges.append(f"relationships[{index}]: SEEDED_BY target must be string")
            elif target not in valid_endpoint_ids:
                invalid_seeded_by_edges.append(f"relationships[{index}]: missing SEEDED_BY target {target!r}")
            elif target in packages_by_id and is_generic_package_entity(packages_by_id.get(target)):
                invalid_seeded_by_edges.append(
                    f"relationships[{index}]: SEEDED_BY target package {target!r} is not release-spine joinable"
                )
            if isinstance(source, str) and isinstance(target, str):
                if source == target:
                    invalid_seeded_by_edges.append(f"relationships[{index}]: SEEDED_BY source and target must differ")
                seeded_by_edges.append((source, target))
            tier = relationship.get("tier")
            if tier not in VALID_PROPAGATION_TIERS:
                invalid_seeded_by_edges.append(f"relationships[{index}]: SEEDED_BY tier must be causal or temporal")
            else:
                seeded_by_tier_counts[tier] += 1
            evidence_refs = relationship.get("evidence_refs")
            if not isinstance(evidence_refs, list) or not evidence_refs:
                invalid_seeded_by_edges.append(f"relationships[{index}]: SEEDED_BY evidence_refs must be non-empty")
            elif not all(isinstance(ref, str) and ref.strip() for ref in evidence_refs):
                invalid_seeded_by_edges.append(f"relationships[{index}]: SEEDED_BY evidence_refs must be strings")

    invalid_seeded_by_edges.extend(seeded_by_cycle_errors(seeded_by_edges))

    failures = (
        missing_purls
        + invalid_purls
        + dangling_actor_edges
        + dangling_campaign_edges
        + dangling_package_edges
        + dangling_release_edges
        + invalid_relationship_edges
        + invalid_package_release_edges
        + invalid_seeded_by_edges
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
        "invalid_relationship_edges": invalid_relationship_edges,
        "invalid_package_release_edges": invalid_package_release_edges,
        "invalid_seeded_by_edges": invalid_seeded_by_edges,
        "seeded_by_count": len(seeded_by_edges),
        "seeded_by_tier_counts": seeded_by_tier_counts,
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
            f"- Invalid relationship edges: {len(audit['invalid_relationship_edges'])}",
            f"- Invalid package-release edges: {len(audit['invalid_package_release_edges'])}",
            f"- SEEDED_BY edges: {audit['seeded_by_count']}",
            f"- SEEDED_BY causal edges: {audit['seeded_by_tier_counts']['causal']}",
            f"- SEEDED_BY temporal edges: {audit['seeded_by_tier_counts']['temporal']}",
            f"- Invalid SEEDED_BY edges: {len(audit['invalid_seeded_by_edges'])}",
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
            "## Invalid Relationship Edges",
            "",
            bullet_list(audit["invalid_relationship_edges"]).rstrip(),
            "",
            "## Invalid Package-Release Edges",
            "",
            bullet_list(audit["invalid_package_release_edges"]).rstrip(),
            "",
            "## Invalid SEEDED_BY Edges",
            "",
            bullet_list(audit["invalid_seeded_by_edges"]).rstrip(),
            "",
        ]
    )


def main(argv: list[str] | None = None) -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--entity-dir", type=Path, default=DEFAULT_ENTITY_DIR)
    parser.add_argument("--relationships", type=Path, default=DEFAULT_RELATIONSHIP_PATH)
    parser.add_argument("--report", type=Path, default=DEFAULT_REPORT_PATH)
    parser.add_argument("--site-content-dir", type=Path, default=DEFAULT_SITE_CONTENT_DIR)
    args = parser.parse_args(argv)

    audit = build_audit(args.entity_dir, args.relationships, args.site_content_dir)
    args.report.parent.mkdir(parents=True, exist_ok=True)
    args.report.write_text(render_report(audit), encoding="utf-8")
    print(
        f"Supply-chain PURL/edge audit: {audit['status']} "
        f"packages={audit['package_count']} releases={audit['release_count']} "
        f"missing_purls={len(audit['missing_purls'])} invalid_purls={len(audit['invalid_purls'])} "
        f"dangling_actor_edges={len(audit['dangling_actor_edges'])} "
        f"dangling_campaign_edges={len(audit['dangling_campaign_edges'])} "
        f"dangling_package_edges={len(audit['dangling_package_edges'])} "
        f"dangling_release_edges={len(audit['dangling_release_edges'])} "
        f"invalid_relationship_edges={len(audit['invalid_relationship_edges'])} "
        f"invalid_package_release_edges={len(audit['invalid_package_release_edges'])} "
        f"seeded_by_edges={audit['seeded_by_count']} "
        f"invalid_seeded_by_edges={len(audit['invalid_seeded_by_edges'])}"
    )
    return 0 if audit["status"] == "PASS" else 1


if __name__ == "__main__":
    raise SystemExit(main())
