#!/usr/bin/env python3
"""Build supply-chain entity and relationship primitives from the incident corpus."""

from __future__ import annotations

import argparse
import hashlib
import json
from pathlib import Path
import re
import sys
from typing import Any
from urllib.parse import urlparse

SCRIPT_DIR = Path(__file__).resolve().parent
if str(SCRIPT_DIR) not in sys.path:
    sys.path.insert(0, str(SCRIPT_DIR))

from supply_chain_purl import PurlError, canonicalize_purl, parse_purl, purl_for_package


REPO_ROOT = Path(__file__).resolve().parents[1]
DEFAULT_CORPUS_PATH = REPO_ROOT / "data" / "supply-chain-incidents" / "incidents.json"
DEFAULT_ENTITY_DIR = REPO_ROOT / "data" / "supply-chain-entities"
DEFAULT_RELATIONSHIP_DIR = REPO_ROOT / "data" / "supply-chain-relationships"

ENTITY_FILES = {
    "accounts": "accounts.json",
    "actors": "actors.json",
    "build_systems": "build_systems.json",
    "campaigns": "campaigns.json",
    "distribution_channels": "distribution_channels.json",
    "maintainers": "maintainers.json",
    "packages": "packages.json",
    "releases": "releases.json",
    "repositories": "repositories.json",
    "organizations": "organizations.json",
}
RELATIONSHIP_TYPES = {
    "AFFECTED_PACKAGE",
    "AFFECTED_MAINTAINER",
    "AFFECTED_REPOSITORY",
    "AFFECTED_ORGANIZATION",
    "ATTRIBUTED_TO_ACTOR",
    "COMPROMISED_ACCOUNT",
    "RELATED_INCIDENT",
    "RELATED_CAMPAIGN",
    "SOURCE_ARTIFACT_DIVERGENCE",
    "USED_BUILD_SYSTEM",
    "USED_DISTRIBUTION_CHANNEL",
    "PACKAGE_RELEASE",
    "INCIDENT_AFFECTED_RELEASE",
    "MAINTAINS_REPOSITORY",
    "SEEDED_BY",
    "USES_ACCOUNT",
}
GENERIC_VENDOR_NAMES = {
    "malicious publisher",
    "multiple npm maintainers",
    "multiple open source maintainers",
    "multiple organizations",
    "multiple repository owners",
    "open source maintainer",
    "open source maintainers",
    "riaevangelist",
    "right9ctrl",
}
GITHUB_SYSTEM_PATHS = {
    "advisories",
    "collections",
    "explore",
    "features",
    "login",
    "marketplace",
    "notifications",
    "orgs",
    "search",
    "settings",
    "sponsors",
    "topics",
    "trending",
}
ATTRIBUTION_CONFIDENCE_PRIORITY = {
    "confirmed": 4,
    "likely": 3,
    "suspected": 2,
    "disputed": 1,
    "unknown": 0,
}
RELEASE_METADATA_FIELDS = ("published_at", "malicious_range", "disclosed_at")

def load_json(path: Path) -> Any:
    return json.loads(path.read_text(encoding="utf-8"))


def write_json(path: Path, payload: Any) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(json.dumps(payload, indent=2, sort_keys=True) + "\n", encoding="utf-8")


def normalize_alias(value: str) -> str:
    return re.sub(r"[^a-z0-9]+", "-", value.strip().lower()).strip("-")


def stable_id(prefix: str, *parts: str) -> str:
    slug = "-".join(filter(None, (normalize_alias(part) for part in parts)))
    return f"{prefix}-{slug}"


def same_release_identity(entity: dict[str, Any], ecosystem: str, package_name: str, version: str) -> bool:
    return (
        entity.get("ecosystem") == ecosystem
        and entity.get("package_name") == package_name
        and entity.get("version") == version
    )


def exact_version_suffix(version: str) -> str:
    return hashlib.sha256(version.encode("utf-8")).hexdigest()[:12]


def release_entity_id(collision_base_ids: set[str], ecosystem: str, package_name: str, version: str) -> str:
    base_id = stable_id("release", ecosystem, package_name, version)
    if base_id not in collision_base_ids:
        return base_id

    return f"{base_id}-v{exact_version_suffix(version)}"


def release_collision_base_ids(corpus: list[dict[str, Any]]) -> set[str]:
    identities_by_base_id: dict[str, set[tuple[str, str, str]]] = {}
    for incident in corpus:
        if not isinstance(incident, dict):
            continue
        for release in incident.get("releases") or []:
            if not isinstance(release, dict):
                continue
            ecosystem = release.get("ecosystem")
            package_name = release.get("package_name")
            version = release.get("version")
            if all(isinstance(value, str) for value in (ecosystem, package_name, version)):
                base_id = stable_id("release", ecosystem, package_name, version)
                identities_by_base_id.setdefault(base_id, set()).add((ecosystem, package_name, version))
    return {base_id for base_id, identities in identities_by_base_id.items() if len(identities) > 1}


def incident_node_id(incident_id: str) -> str:
    return f"incident-{incident_id}"


def github_repository_from_url(url: str) -> dict[str, str] | None:
    parsed = urlparse(url)
    if parsed.netloc.lower() != "github.com":
        return None
    parts = [part for part in parsed.path.split("/") if part]
    if len(parts) < 2 or parts[0].lower() in GITHUB_SYSTEM_PATHS:
        return None
    owner, repo = parts[0], parts[1].removesuffix(".git")
    if not repo:
        return None
    return {
        "name": f"{owner}/{repo}",
        "host": "github.com",
        "url": f"https://github.com/{owner}/{repo}",
        "owner": owner,
    }


def is_generic_vendor(name: str) -> bool:
    return normalize_alias(name).replace("-", " ") in GENERIC_VENDOR_NAMES


def add_source(entity: dict[str, Any], incident_id: str) -> None:
    sources = set(entity.get("source_incident_ids", []))
    sources.add(incident_id)
    entity["source_incident_ids"] = sorted(sources)


def earliest_date(current: Any, candidate: Any) -> Any:
    if not isinstance(candidate, str) or not candidate:
        return current
    if not isinstance(current, str) or not current:
        return candidate
    return min(current, candidate)


def upsert_package(packages: dict[str, dict[str, Any]], component: dict[str, Any], incident_id: str) -> str:
    ecosystem = component["ecosystem"]
    name = component["name"]
    package_url = component.get("package_url")
    purl_justification = component.get("purl_justification")
    if package_url:
        try:
            package_url = canonicalize_purl(package_url, ecosystem=ecosystem, package_name=name)
        except PurlError as exc:
            raise ValueError(f"{incident_id}: invalid package_url for {ecosystem}/{name}: {exc}") from exc
    else:
        package_url = purl_for_package(ecosystem, name)
    parsed_purl = parse_purl(package_url)
    is_generic_purl = parsed_purl.type == "generic"
    if is_generic_purl and (
        not isinstance(purl_justification, str) or len(purl_justification.strip()) < 20
    ):
        raise ValueError(f"{incident_id}: generic package_url for {ecosystem}/{name} requires purl_justification")
    entity_id = stable_id("pkg", ecosystem, name)
    entity = packages.setdefault(
        entity_id,
        {
            "id": entity_id,
            "name": name,
            "ecosystem": ecosystem,
            "package_url": package_url,
            **({"purl_justification": purl_justification} if is_generic_purl else {}),
            "aliases": sorted({name}),
            "source_incident_ids": [],
        },
    )
    if package_url and not entity.get("package_url"):
        entity["package_url"] = package_url
    if is_generic_purl:
        entity["purl_justification"] = purl_justification
    add_source(entity, incident_id)
    return entity_id


def upsert_release(
    releases: dict[str, dict[str, Any]],
    item: dict[str, Any],
    incident_id: str,
    collision_base_ids: set[str],
) -> str:
    ecosystem = item["ecosystem"]
    package_name = item["package_name"]
    version = item["version"]
    purl = canonicalize_purl(item["purl"], ecosystem=ecosystem, package_name=package_name)
    parsed = parse_purl(purl)
    if parsed.version != version:
        raise ValueError(f"{incident_id}: release version {version!r} does not match PURL {purl!r}")
    entity_id = release_entity_id(collision_base_ids, ecosystem, package_name, version)
    existing = releases.get(entity_id)
    if existing is not None and not same_release_identity(existing, ecosystem, package_name, version):
        raise ValueError(f"{incident_id}: release id collision for {ecosystem}/{package_name}@{version}: {entity_id}")
    if existing is not None:
        for field in RELEASE_METADATA_FIELDS:
            if existing.get(field) != item.get(field):
                raise ValueError(
                    f"{incident_id}: conflicting release metadata for {ecosystem}/{package_name}@{version}: {field}"
                )
    name = f"{package_name}@{version}"
    entity = releases.setdefault(
        entity_id,
        {
            "id": entity_id,
            "name": name,
            "purl": purl,
            "package_name": package_name,
            "version": version,
            "published_at": item["published_at"],
            "ecosystem": ecosystem,
            "malicious_range": item.get("malicious_range"),
            "references": sorted(item.get("references") or []),
            "disclosed_at": item.get("disclosed_at"),
            "aliases": sorted({name, purl}),
            "source_incident_ids": [],
        },
    )
    entity["references"] = sorted(set(entity.get("references", []) + (item.get("references") or [])))
    add_source(entity, incident_id)
    return entity_id


def upsert_organization(organizations: dict[str, dict[str, Any]], name: str, incident_id: str) -> str | None:
    if is_generic_vendor(name):
        return None
    entity_id = stable_id("org", name)
    entity = organizations.setdefault(
        entity_id,
        {
            "id": entity_id,
            "name": name,
            "aliases": sorted({name}),
            "source_incident_ids": [],
        },
    )
    add_source(entity, incident_id)
    return entity_id


def upsert_repository(repositories: dict[str, dict[str, Any]], repo: dict[str, str], incident_id: str) -> str:
    entity_id = stable_id("repo", repo["host"], repo["name"])
    entity = repositories.setdefault(
        entity_id,
        {
            "id": entity_id,
            "name": repo["name"],
            "host": repo["host"],
            "url": repo["url"],
            "owner": repo["owner"],
            "aliases": sorted({repo["name"]}),
            "source_incident_ids": [],
        },
    )
    add_source(entity, incident_id)
    return entity_id


def upsert_maintainer(maintainers: dict[str, dict[str, Any]], hint: dict[str, Any], incident_id: str) -> str:
    name = hint["name"]
    aliases = sorted(set((hint.get("aliases") or []) + [name]))
    entity_id = stable_id("maintainer", hint["id_slug"])
    repositories = sorted(set(hint.get("repositories") or []))
    account_ids = sorted(set(hint.get("account_ids") or []))
    entity = maintainers.setdefault(
        entity_id,
        {
            "id": entity_id,
            "name": name,
            "aliases": aliases,
            "onboarding_date": hint.get("onboarding_date"),
            "first_publish_date": hint.get("first_publish_date"),
            "repositories": repositories,
            "account_ids": account_ids,
            "source_incident_ids": [],
        },
    )
    entity["aliases"] = sorted(set(entity.get("aliases", []) + aliases))
    entity["onboarding_date"] = earliest_date(entity.get("onboarding_date"), hint.get("onboarding_date"))
    entity["first_publish_date"] = earliest_date(entity.get("first_publish_date"), hint.get("first_publish_date"))
    entity["repositories"] = sorted(set(entity.get("repositories", []) + repositories))
    entity["account_ids"] = sorted(set(entity.get("account_ids", []) + account_ids))
    add_source(entity, incident_id)
    return entity_id


def upsert_build_system(build_systems: dict[str, dict[str, Any]], item: dict[str, str], incident_id: str) -> str:
    entity_id = stable_id("build", item["provider"], item["name"])
    entity = build_systems.setdefault(
        entity_id,
        {
            "id": entity_id,
            "name": item["name"],
            "provider": item["provider"],
            "category": item["category"],
            "aliases": sorted({item["name"]}),
            "source_incident_ids": [],
        },
    )
    add_source(entity, incident_id)
    return entity_id


def upsert_distribution_channel(channels: dict[str, dict[str, Any]], item: dict[str, str], incident_id: str) -> str:
    entity_id = stable_id("channel", item["ecosystem"], item["channel_type"], item["name"])
    entity = channels.setdefault(
        entity_id,
        {
            "id": entity_id,
            "name": item["name"],
            "channel_type": item["channel_type"],
            "ecosystem": item["ecosystem"],
            "aliases": sorted({item["name"]}),
            "source_incident_ids": [],
        },
    )
    add_source(entity, incident_id)
    return entity_id


def upsert_account(accounts: dict[str, dict[str, Any]], item: dict[str, str], incident_id: str) -> str:
    entity_id = stable_id("account", item["provider"], item["name"])
    entity = accounts.setdefault(
        entity_id,
        {
            "id": entity_id,
            "name": item["name"],
            "provider": item["provider"],
            "account_type": item["account_type"],
            "role": item["role"],
            "aliases": sorted({item["name"]}),
            "source_incident_ids": [],
        },
    )
    add_source(entity, incident_id)
    return entity_id


def upsert_actor(actors: dict[str, dict[str, Any]], item: dict[str, Any], incident_id: str) -> str:
    entity_id = item["id"]
    item_aliases = (item.get("aliases") or []) + [item["name"]]
    entity = actors.setdefault(
        entity_id,
        {
            "id": entity_id,
            "name": item["name"],
            "actor_type": item["actor_type"],
            "attribution_confidence": item["confidence"],
            "aliases": sorted(set(item_aliases)),
            "source_incident_ids": [],
        },
    )
    entity["aliases"] = sorted(set(entity.get("aliases", []) + item_aliases))
    if "href" not in entity and item.get("href"):
        entity["href"] = item["href"]
    if "notes" not in entity and item.get("notes"):
        entity["notes"] = item["notes"]
    if ATTRIBUTION_CONFIDENCE_PRIORITY.get(item["confidence"], 0) > ATTRIBUTION_CONFIDENCE_PRIORITY.get(
        entity["attribution_confidence"],
        0,
    ):
        entity["attribution_confidence"] = item["confidence"]
    add_source(entity, incident_id)
    return entity_id


def upsert_campaign(campaigns: dict[str, dict[str, Any]], item: dict[str, Any], incident_id: str) -> str:
    entity_id = item["id"]
    item_aliases = (item.get("aliases") or []) + [item["name"], item["campaign_id"]]
    entity = campaigns.setdefault(
        entity_id,
        {
            "id": entity_id,
            "name": item["name"],
            "campaign_id": item["campaign_id"],
            "slug": item["slug"],
            "aliases": sorted(set(item_aliases)),
            "source_incident_ids": [],
            "href": f"/campaigns/{item['slug']}/",
        },
    )
    entity["aliases"] = sorted(set(entity.get("aliases", []) + item_aliases))
    add_source(entity, incident_id)
    return entity_id


def relationship(source: str, target: str, relationship_type: str, **metadata: Any) -> dict[str, Any]:
    if relationship_type not in RELATIONSHIP_TYPES:
        raise ValueError(f"invalid relationship type: {relationship_type}")
    return {"source": source, "target": target, "type": relationship_type, **metadata}


def build_graph(corpus: list[dict[str, Any]]) -> dict[str, Any]:
    accounts: dict[str, dict[str, Any]] = {}
    actors: dict[str, dict[str, Any]] = {}
    build_systems: dict[str, dict[str, Any]] = {}
    campaigns: dict[str, dict[str, Any]] = {}
    distribution_channels: dict[str, dict[str, Any]] = {}
    maintainers: dict[str, dict[str, Any]] = {}
    packages: dict[str, dict[str, Any]] = {}
    releases: dict[str, dict[str, Any]] = {}
    repositories: dict[str, dict[str, Any]] = {}
    organizations: dict[str, dict[str, Any]] = {}
    relationships: dict[tuple[str, str, str, str], dict[str, Any]] = {}
    collision_base_ids = release_collision_base_ids(corpus)

    def relationship_key(item: dict[str, Any]) -> tuple[str, str, str, str]:
        source_incident_id = item.get("source_incident_id") if item.get("type") == "SEEDED_BY" else ""
        return (item["source"], item["target"], item["type"], source_incident_id or "")

    def add_relationship(item: dict[str, Any]) -> None:
        relationships[relationship_key(item)] = item

    for incident in corpus:
        incident_id = incident["id"]
        source = incident_node_id(incident_id)

        for component in incident.get("affected_components", []):
            component_role = component.get("component_role", "affected")
            if component.get("component_type") == "package":
                package_id = upsert_package(packages, component, incident_id)
                if component_role != "upstream_seed":
                    add_relationship(relationship(source, package_id, "AFFECTED_PACKAGE"))
            if component_role != "upstream_seed":
                org_id = upsert_organization(organizations, component["vendor"], incident_id)
                if org_id:
                    add_relationship(relationship(source, org_id, "AFFECTED_ORGANIZATION"))

        for item in incident.get("releases") or []:
            release_id = upsert_release(releases, item, incident_id, collision_base_ids)
            package_id = stable_id("pkg", item["ecosystem"], item["package_name"])
            add_relationship(relationship(package_id, release_id, "PACKAGE_RELEASE"))
            add_relationship(relationship(source, release_id, "INCIDENT_AFFECTED_RELEASE"))

        divergence_channel_targets: list[str] = []
        for maintainer in incident.get("maintainers") or []:
            maintainer_id = upsert_maintainer(maintainers, maintainer, incident_id)
            add_relationship(relationship(source, maintainer_id, "AFFECTED_MAINTAINER"))
            for repo_id in maintainer.get("repositories") or []:
                add_relationship(relationship(maintainer_id, repo_id, "MAINTAINS_REPOSITORY"))
            for account_id in maintainer.get("account_ids") or []:
                add_relationship(relationship(maintainer_id, account_id, "USES_ACCOUNT"))

        for repo in incident.get("repositories") or []:
            repo_id = upsert_repository(repositories, repo, incident_id)
            add_relationship(relationship(source, repo_id, "AFFECTED_REPOSITORY"))

        for item in incident.get("build_systems") or []:
            build_system_id = upsert_build_system(build_systems, item, incident_id)
            add_relationship(relationship(source, build_system_id, "USED_BUILD_SYSTEM"))

        for item in incident.get("distribution_channels") or []:
            channel_id = upsert_distribution_channel(distribution_channels, item, incident_id)
            divergence_channel_targets.append(channel_id)
            add_relationship(relationship(source, channel_id, "USED_DISTRIBUTION_CHANNEL"))

        for item in incident.get("compromised_accounts") or []:
            account_id = upsert_account(accounts, item, incident_id)
            add_relationship(relationship(source, account_id, "COMPROMISED_ACCOUNT"))

        for item in incident.get("threat_actors") or []:
            actor_id = upsert_actor(actors, item, incident_id)
            add_relationship(relationship(source, actor_id, "ATTRIBUTED_TO_ACTOR"))
            for entity_ref in item.get("entity_refs") or []:
                add_relationship(relationship(entity_ref, actor_id, "ATTRIBUTED_TO_ACTOR"))

        for item in incident.get("campaigns") or []:
            campaign_id = upsert_campaign(campaigns, item, incident_id)
            add_relationship(relationship(source, campaign_id, "RELATED_CAMPAIGN"))

        if incident.get("source_artifact_divergence") is True:
            for channel_id in divergence_channel_targets:
                add_relationship(relationship(source, channel_id, "SOURCE_ARTIFACT_DIVERGENCE"))

        for item in incident.get("propagation_edges") or []:
            add_relationship(
                relationship(
                    item["source"],
                    item["target"],
                    "SEEDED_BY",
                    propagation_tier=item["propagation_tier"],
                    evidence_refs=sorted(item["evidence_refs"]),
                    source_incident_id=incident_id,
                    summary=item["summary"],
                )
            )

    return {
        "accounts": sorted(accounts.values(), key=lambda item: item["id"]),
        "actors": sorted(actors.values(), key=lambda item: item["id"]),
        "build_systems": sorted(build_systems.values(), key=lambda item: item["id"]),
        "campaigns": sorted(campaigns.values(), key=lambda item: item["id"]),
        "distribution_channels": sorted(distribution_channels.values(), key=lambda item: item["id"]),
        "maintainers": sorted(maintainers.values(), key=lambda item: item["id"]),
        "packages": sorted(packages.values(), key=lambda item: item["id"]),
        "releases": sorted(releases.values(), key=lambda item: item["id"]),
        "repositories": sorted(repositories.values(), key=lambda item: item["id"]),
        "organizations": sorted(organizations.values(), key=lambda item: item["id"]),
        "relationships": sorted(relationships.values(), key=lambda item: (item["source"], item["type"], item["target"])),
    }


def write_graph(graph: dict[str, Any], entity_dir: Path, relationship_dir: Path) -> None:
    for key, filename in ENTITY_FILES.items():
        write_json(entity_dir / filename, graph[key])
    write_json(relationship_dir / "relationships.json", graph["relationships"])


def main(argv: list[str] | None = None) -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--corpus", type=Path, default=DEFAULT_CORPUS_PATH)
    parser.add_argument("--entity-dir", type=Path, default=DEFAULT_ENTITY_DIR)
    parser.add_argument("--relationship-dir", type=Path, default=DEFAULT_RELATIONSHIP_DIR)
    args = parser.parse_args(argv)

    corpus = load_json(args.corpus)
    graph = build_graph(corpus)
    write_graph(graph, args.entity_dir, args.relationship_dir)
    print(
        "Built supply-chain graph primitives: "
        f"maintainers={len(graph['maintainers'])} "
        f"actors={len(graph['actors'])} "
        f"campaigns={len(graph['campaigns'])} "
        f"packages={len(graph['packages'])} "
        f"releases={len(graph['releases'])} "
        f"repositories={len(graph['repositories'])} "
        f"organizations={len(graph['organizations'])} "
        f"build_systems={len(graph['build_systems'])} "
        f"distribution_channels={len(graph['distribution_channels'])} "
        f"accounts={len(graph['accounts'])} "
        f"relationships={len(graph['relationships'])}"
    )
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
