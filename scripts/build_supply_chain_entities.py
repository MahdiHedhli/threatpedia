#!/usr/bin/env python3
"""Build supply-chain entity and relationship primitives from the incident corpus."""

from __future__ import annotations

import argparse
import json
from pathlib import Path
import re
from typing import Any
from urllib.parse import urlparse


REPO_ROOT = Path(__file__).resolve().parents[1]
DEFAULT_CORPUS_PATH = REPO_ROOT / "data" / "supply-chain-incidents" / "incidents.json"
DEFAULT_ENTITY_DIR = REPO_ROOT / "data" / "supply-chain-entities"
DEFAULT_RELATIONSHIP_DIR = REPO_ROOT / "data" / "supply-chain-relationships"

ENTITY_FILES = {
    "maintainers": "maintainers.json",
    "packages": "packages.json",
    "repositories": "repositories.json",
    "organizations": "organizations.json",
}
RELATIONSHIP_TYPES = {
    "AFFECTED_PACKAGE",
    "AFFECTED_MAINTAINER",
    "AFFECTED_REPOSITORY",
    "AFFECTED_ORGANIZATION",
    "RELATED_INCIDENT",
}
GENERIC_VENDOR_NAMES = {
    "malicious publisher",
    "multiple open source maintainers",
    "multiple organizations",
    "open source maintainer",
    "open source maintainers",
}
GITHUB_SYSTEM_PATHS = {
    "about",
    "advisories",
    "blog",
    "collections",
    "explore",
    "features",
    "login",
    "marketplace",
    "notifications",
    "orgs",
    "pricing",
    "search",
    "security",
    "settings",
    "sponsors",
    "topics",
    "trending",
}

# Explicit human/entity hints are used only where the Phase 1A corpus does not
# yet carry first-class maintainer/repository fields.
INCIDENT_ENTITY_HINTS: dict[str, dict[str, list[dict[str, Any]]]] = {
    "SC-2018-NPM-EVENT-STREAM": {
        "maintainers": [
            {"name": "Dominic Tarr", "aliases": ["dominictarr"], "id_slug": "dominictarr"},
        ],
        "repositories": [
            {
                "name": "dominictarr/event-stream",
                "host": "github.com",
                "url": "https://github.com/dominictarr/event-stream",
                "owner": "dominictarr",
            }
        ],
    },
    "SC-2022-COLORS-FAKER": {
        "maintainers": [
            {"name": "Marak Squires", "aliases": ["Marak"]},
        ],
        "repositories": [
            {
                "name": "Marak/colors.js",
                "host": "github.com",
                "url": "https://github.com/Marak/colors.js",
                "owner": "Marak",
            }
        ],
    },
    "SC-2022-NODE-IPC": {
        "maintainers": [
            {"name": "RIAEvangelist", "aliases": ["Brandon Nozaki Miller"]},
        ]
    },
    "SC-2024-XZ-UTILS": {
        "maintainers": [
            {"name": "Jia Tan", "aliases": ["JiaT75"]},
        ],
        "repositories": [
            {
                "name": "tukaani-project/xz",
                "host": "github.com",
                "url": "https://github.com/tukaani-project/xz",
                "owner": "tukaani-project",
            }
        ],
    },
}


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


def incident_node_id(incident_id: str) -> str:
    return f"incident-{incident_id}"


def is_generic_vendor(name: str) -> bool:
    return normalize_alias(name).replace("-", " ") in GENERIC_VENDOR_NAMES


def github_repository_from_url(url: str) -> dict[str, str] | None:
    parsed = urlparse(url)
    if parsed.netloc.lower() != "github.com":
        return None
    parts = [part for part in parsed.path.split("/") if part]
    if len(parts) < 2 or parts[0].lower() in GITHUB_SYSTEM_PATHS:
        return None
    owner, repo = parts[0], parts[1]
    if repo.lower().endswith(".git"):
        repo = repo[:-4]
    if not repo:
        return None
    return {
        "name": f"{owner}/{repo}",
        "host": "github.com",
        "url": f"https://github.com/{owner}/{repo}",
        "owner": owner,
    }


def add_source(entity: dict[str, Any], incident_id: str) -> None:
    sources = set(entity.get("source_incident_ids", []))
    sources.add(incident_id)
    entity["source_incident_ids"] = sorted(sources)


def upsert_package(packages: dict[str, dict[str, Any]], component: dict[str, Any], incident_id: str) -> str:
    ecosystem = component["ecosystem"]
    name = component["name"]
    package_url = component.get("package_url")
    entity_id = stable_id("pkg", ecosystem, name)
    entity = packages.setdefault(
        entity_id,
        {
            "id": entity_id,
            "name": name,
            "ecosystem": ecosystem,
            "package_url": package_url,
            "aliases": sorted({name}),
            "source_incident_ids": [],
        },
    )
    if package_url and not entity.get("package_url"):
        entity["package_url"] = package_url
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
    aliases = sorted(set(hint.get("aliases", []) + [name]))
    entity_id = stable_id("maintainer", hint.get("id_slug", name))
    entity = maintainers.setdefault(
        entity_id,
        {
            "id": entity_id,
            "name": name,
            "aliases": aliases,
            "source_incident_ids": [],
        },
    )
    entity["aliases"] = sorted(set(entity.get("aliases", []) + aliases))
    add_source(entity, incident_id)
    return entity_id


def relationship(source: str, target: str, relationship_type: str) -> dict[str, str]:
    if relationship_type not in RELATIONSHIP_TYPES:
        raise ValueError(f"invalid relationship type: {relationship_type}")
    return {"source": source, "target": target, "type": relationship_type}


def build_graph(corpus: list[dict[str, Any]]) -> dict[str, Any]:
    maintainers: dict[str, dict[str, Any]] = {}
    packages: dict[str, dict[str, Any]] = {}
    repositories: dict[str, dict[str, Any]] = {}
    organizations: dict[str, dict[str, Any]] = {}
    relationships: dict[tuple[str, str, str], dict[str, str]] = {}

    def add_relationship(item: dict[str, str]) -> None:
        relationships[(item["source"], item["target"], item["type"])] = item

    for incident in corpus:
        incident_id = incident["id"]
        source = incident_node_id(incident_id)

        for component in incident.get("affected_components", []):
            if component.get("component_type") == "package":
                package_id = upsert_package(packages, component, incident_id)
                add_relationship(relationship(source, package_id, "AFFECTED_PACKAGE"))
            org_id = upsert_organization(organizations, component["vendor"], incident_id)
            if org_id:
                add_relationship(relationship(source, org_id, "AFFECTED_ORGANIZATION"))

        for reference in incident.get("references", []):
            repo = github_repository_from_url(reference.get("url", ""))
            if repo:
                repo_id = upsert_repository(repositories, repo, incident_id)
                add_relationship(relationship(source, repo_id, "AFFECTED_REPOSITORY"))

        hints = INCIDENT_ENTITY_HINTS.get(incident_id, {})
        for hint in hints.get("maintainers", []):
            maintainer_id = upsert_maintainer(maintainers, hint, incident_id)
            add_relationship(relationship(source, maintainer_id, "AFFECTED_MAINTAINER"))
        for hint in hints.get("repositories", []):
            repo_id = upsert_repository(repositories, hint, incident_id)
            add_relationship(relationship(source, repo_id, "AFFECTED_REPOSITORY"))

    return {
        "maintainers": sorted(maintainers.values(), key=lambda item: item["id"]),
        "packages": sorted(packages.values(), key=lambda item: item["id"]),
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
        f"packages={len(graph['packages'])} "
        f"repositories={len(graph['repositories'])} "
        f"organizations={len(graph['organizations'])} "
        f"relationships={len(graph['relationships'])}"
    )
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
