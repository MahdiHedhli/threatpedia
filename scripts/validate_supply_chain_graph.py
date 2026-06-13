#!/usr/bin/env python3
"""Validate supply-chain graph primitive files."""

from __future__ import annotations

import argparse
import json
from pathlib import Path
import re
import sys
from typing import Any


REPO_ROOT = Path(__file__).resolve().parents[1]
DEFAULT_CORPUS_PATH = REPO_ROOT / "data" / "supply-chain-incidents" / "incidents.json"
DEFAULT_ENTITY_DIR = REPO_ROOT / "data" / "supply-chain-entities"
DEFAULT_RELATIONSHIP_PATH = REPO_ROOT / "data" / "supply-chain-relationships" / "relationships.json"

ENTITY_FILES = {
    "maintainers": "maintainers.json",
    "packages": "packages.json",
    "repositories": "repositories.json",
    "organizations": "organizations.json",
}
VALID_RELATIONSHIP_TYPES = {
    "AFFECTED_PACKAGE",
    "AFFECTED_MAINTAINER",
    "AFFECTED_REPOSITORY",
    "AFFECTED_ORGANIZATION",
    "RELATED_INCIDENT",
}
ENTITY_ID_PATTERN = re.compile(r"^(maintainer|pkg|repo|org)-[a-z0-9][a-z0-9-]*$")


def load_json(path: Path) -> Any:
    with path.open("r", encoding="utf-8") as handle:
        return json.load(handle)


def normalize_alias(value: str) -> str:
    return re.sub(r"[^a-z0-9]+", "-", value.strip().lower()).strip("-")


def incident_node_id(incident_id: str) -> str:
    return f"incident-{incident_id}"


def load_entities(entity_dir: Path) -> dict[str, list[dict[str, Any]]]:
    return {entity_type: load_json(entity_dir / filename) for entity_type, filename in ENTITY_FILES.items()}


def collect_incident_ids(corpus: list[dict[str, Any]]) -> set[str]:
    return {incident_node_id(incident["id"]) for incident in corpus if isinstance(incident, dict) and isinstance(incident.get("id"), str)}


def validate_entity_file(errors: list[str], entity_type: str, entities: Any) -> set[str]:
    ids: set[str] = set()
    alias_owners: dict[str, str] = {}
    if not isinstance(entities, list):
        errors.append(f"{entity_type}: expected list")
        return ids
    for index, entity in enumerate(entities):
        path = f"{entity_type}[{index}]"
        if not isinstance(entity, dict):
            errors.append(f"{path}: expected object")
            continue
        entity_id = entity.get("id")
        if not isinstance(entity_id, str) or not ENTITY_ID_PATTERN.match(entity_id):
            errors.append(f"{path}.id: invalid entity id {entity_id!r}")
            continue
        if entity_id in ids:
            errors.append(f"{entity_id}: duplicate id in {entity_type}")
        ids.add(entity_id)
        if not isinstance(entity.get("name"), str) or not entity["name"].strip():
            errors.append(f"{entity_id}.name: expected non-empty string")
        if not isinstance(entity.get("source_incident_ids"), list) or not entity["source_incident_ids"]:
            errors.append(f"{entity_id}.source_incident_ids: expected non-empty list")
        aliases = entity.get("aliases", [])
        if not isinstance(aliases, list) or not aliases:
            errors.append(f"{entity_id}.aliases: expected non-empty list")
            aliases = []
        for alias in aliases:
            if not isinstance(alias, str) or not alias.strip():
                errors.append(f"{entity_id}.aliases: expected non-empty string aliases")
                continue
            normalized = normalize_alias(alias)
            owner = alias_owners.get(normalized)
            if owner and owner != entity_id:
                errors.append(f"{entity_type}: normalized alias {normalized!r} belongs to both {owner} and {entity_id}")
            alias_owners[normalized] = entity_id
    return ids


def validate_relationships(
    relationships: Any,
    *,
    entity_ids: set[str],
    incident_ids: set[str],
) -> list[str]:
    errors: list[str] = []
    if not isinstance(relationships, list):
        return ["relationships: expected list"]

    valid_nodes = entity_ids | incident_ids
    seen_relationships: set[tuple[str, str, str]] = set()
    connected_entities: set[str] = set()
    for index, rel in enumerate(relationships):
        path = f"relationships[{index}]"
        if not isinstance(rel, dict):
            errors.append(f"{path}: expected object")
            continue
        source = rel.get("source")
        target = rel.get("target")
        rel_type = rel.get("type")
        if rel_type not in VALID_RELATIONSHIP_TYPES:
            errors.append(f"{path}.type: invalid relationship type {rel_type!r}")
        if source not in valid_nodes:
            errors.append(f"{path}.source: unknown source {source!r}")
        if target not in valid_nodes:
            errors.append(f"{path}.target: unknown target {target!r}")
        key = (source, target, rel_type)
        if key in seen_relationships:
            errors.append(f"{path}: duplicate relationship {key!r}")
        seen_relationships.add(key)
        if source in entity_ids:
            connected_entities.add(source)
        if target in entity_ids:
            connected_entities.add(target)

    orphan_entities = sorted(entity_ids - connected_entities)
    for entity_id in orphan_entities:
        errors.append(f"{entity_id}: orphan entity with no relationships")
    return errors


def validate_graph(corpus: Any, entities_by_type: dict[str, Any], relationships: Any) -> list[str]:
    errors: list[str] = []
    if not isinstance(corpus, list):
        errors.append("corpus: expected list")
        corpus = []

    incident_ids = collect_incident_ids(corpus)
    all_entity_ids: set[str] = set()
    for entity_type, entities in entities_by_type.items():
        entity_ids = validate_entity_file(errors, entity_type, entities)
        duplicates = all_entity_ids & entity_ids
        for entity_id in sorted(duplicates):
            errors.append(f"{entity_id}: duplicate id across entity files")
        all_entity_ids |= entity_ids

    errors.extend(
        validate_relationships(
            relationships,
            entity_ids=all_entity_ids,
            incident_ids=incident_ids,
        )
    )
    return errors


def main(argv: list[str] | None = None) -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--corpus", type=Path, default=DEFAULT_CORPUS_PATH)
    parser.add_argument("--entity-dir", type=Path, default=DEFAULT_ENTITY_DIR)
    parser.add_argument("--relationships", type=Path, default=DEFAULT_RELATIONSHIP_PATH)
    args = parser.parse_args(argv)

    try:
        corpus = load_json(args.corpus)
        entities_by_type = load_entities(args.entity_dir)
        relationships = load_json(args.relationships)
    except (OSError, json.JSONDecodeError) as exc:
        print(f"failed to load supply-chain graph inputs: {exc}", file=sys.stderr)
        return 2

    errors = validate_graph(corpus, entities_by_type, relationships)
    if errors:
        print("Supply-chain graph validation failed:", file=sys.stderr)
        for error in errors:
            print(f"- {error}", file=sys.stderr)
        return 1

    entity_count = sum(len(entities) for entities in entities_by_type.values())
    print(f"Validated supply-chain graph primitives: entities={entity_count} relationships={len(relationships)}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
