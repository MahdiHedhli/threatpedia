#!/usr/bin/env python3
"""Validate supply-chain graph primitive files."""

from __future__ import annotations

import argparse
import json
from pathlib import Path
import re
import sys
from typing import Any

SCRIPT_DIR = Path(__file__).resolve().parent
if str(SCRIPT_DIR) not in sys.path:
    sys.path.insert(0, str(SCRIPT_DIR))

from supply_chain_purl import PurlError, canonicalize_purl, parse_purl


REPO_ROOT = Path(__file__).resolve().parents[1]
DEFAULT_CORPUS_PATH = REPO_ROOT / "data" / "supply-chain-incidents" / "incidents.json"
DEFAULT_ENTITY_DIR = REPO_ROOT / "data" / "supply-chain-entities"
DEFAULT_RELATIONSHIP_PATH = REPO_ROOT / "data" / "supply-chain-relationships" / "relationships.json"

ENTITY_FILES = {
    "accounts": "accounts.json",
    "actors": "actors.json",
    "build_systems": "build_systems.json",
    "campaigns": "campaigns.json",
    "distribution_channels": "distribution_channels.json",
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
    "ATTRIBUTED_TO_ACTOR",
    "COMPROMISED_ACCOUNT",
    "RELATED_INCIDENT",
    "RELATED_CAMPAIGN",
    "SOURCE_ARTIFACT_DIVERGENCE",
    "USED_BUILD_SYSTEM",
    "USED_DISTRIBUTION_CHANNEL",
}
ENTITY_ID_PATTERN = re.compile(r"^(account|actor|build|campaign|channel|maintainer|pkg|repo|org)-[a-z0-9][a-z0-9-]*$")
RELATIONSHIP_TARGET_PREFIXES = {
    "AFFECTED_PACKAGE": "pkg-",
    "AFFECTED_MAINTAINER": "maintainer-",
    "AFFECTED_REPOSITORY": "repo-",
    "AFFECTED_ORGANIZATION": "org-",
    "ATTRIBUTED_TO_ACTOR": "actor-",
    "COMPROMISED_ACCOUNT": "account-",
    "RELATED_INCIDENT": "incident-",
    "RELATED_CAMPAIGN": "campaign-",
    "SOURCE_ARTIFACT_DIVERGENCE": ("repo-", "channel-"),
    "USED_BUILD_SYSTEM": "build-",
    "USED_DISTRIBUTION_CHANNEL": "channel-",
}
ENTITY_TYPE_REQUIRED_FIELDS = {
    "accounts": ["provider", "account_type", "role"],
    "actors": ["actor_type", "attribution_confidence"],
    "build_systems": ["provider", "category"],
    "campaigns": ["campaign_id", "slug"],
    "distribution_channels": ["channel_type", "ecosystem"],
    "maintainers": [],
    "organizations": [],
    "packages": ["ecosystem", "package_url"],
    "repositories": ["host", "url", "owner"],
}


def load_json(path: Path) -> Any:
    with path.open("r", encoding="utf-8") as handle:
        return json.load(handle)


def normalize_alias(value: str) -> str:
    return re.sub(r"[^a-z0-9]+", "-", value.strip().lower()).strip("-")


def incident_node_id(incident_id: str) -> str:
    return f"incident-{incident_id}"


def load_entities(entity_dir: Path) -> dict[str, list[dict[str, Any]]]:
    return {entity_type: load_json(entity_dir / filename) for entity_type, filename in ENTITY_FILES.items()}


def collect_raw_incident_ids(corpus: list[dict[str, Any]]) -> set[str]:
    return {incident["id"] for incident in corpus if isinstance(incident, dict) and isinstance(incident.get("id"), str)}


def collect_incident_ids(corpus: list[dict[str, Any]]) -> set[str]:
    return {incident_node_id(incident["id"]) for incident in corpus if isinstance(incident, dict) and isinstance(incident.get("id"), str)}


def validate_entity_file(errors: list[str], entity_type: str, entities: Any, incident_ids: set[str]) -> set[str]:
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
        for field in ENTITY_TYPE_REQUIRED_FIELDS.get(entity_type, []):
            if not isinstance(entity.get(field), str) or not entity[field].strip():
                errors.append(f"{entity_id}.{field}: expected non-empty string")
        if entity_type == "packages" and isinstance(entity.get("package_url"), str):
            try:
                canonical = canonicalize_purl(
                    entity["package_url"],
                    ecosystem=entity.get("ecosystem"),
                    package_name=entity.get("name"),
                )
            except PurlError as exc:
                errors.append(f"{entity_id}.package_url: invalid canonical package URL: {exc}")
            else:
                if entity["package_url"] != canonical:
                    errors.append(f"{entity_id}.package_url: expected canonical package URL {canonical!r}")
                if parse_purl(canonical).type == "generic":
                    if not isinstance(entity.get("purl_justification"), str) or len(entity["purl_justification"].strip()) < 20:
                        errors.append(f"{entity_id}.purl_justification: expected non-empty generic PURL justification")
        source_incident_ids = entity.get("source_incident_ids")
        if not isinstance(source_incident_ids, list) or not source_incident_ids:
            errors.append(f"{entity_id}.source_incident_ids: expected non-empty list")
            source_incident_ids = []
        for source_index, source_id in enumerate(source_incident_ids):
            if not isinstance(source_id, str):
                errors.append(f"{entity_id}.source_incident_ids[{source_index}]: expected string")
            elif source_id not in incident_ids:
                errors.append(f"{entity_id}.source_incident_ids[{source_index}]: unknown incident id {source_id!r}")
        aliases = entity.get("aliases", [])
        if not isinstance(aliases, list) or not aliases:
            errors.append(f"{entity_id}.aliases: expected non-empty list")
            aliases = []
        for alias in aliases:
            if not isinstance(alias, str) or not alias.strip():
                errors.append(f"{entity_id}.aliases: expected non-empty string aliases")
                continue
            normalized = normalize_alias(alias)
            alias_key = f"{entity.get('ecosystem', '')}:{normalized}" if entity_type == "packages" else normalized
            owner = alias_owners.get(alias_key)
            if owner and owner != entity_id:
                errors.append(f"{entity_type}: normalized alias {normalized!r} belongs to both {owner} and {entity_id}")
            alias_owners[alias_key] = entity_id
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
        elif isinstance(source, str) and isinstance(target, str):
            expected_prefix = RELATIONSHIP_TARGET_PREFIXES[rel_type]
            if rel_type.startswith("AFFECTED_") and not source.startswith("incident-"):
                errors.append(f"{path}.source: {rel_type} must start from an incident node")
            if rel_type == "ATTRIBUTED_TO_ACTOR" and not (source.startswith("incident-") or source.startswith("maintainer-")):
                errors.append(f"{path}.source: ATTRIBUTED_TO_ACTOR must start from an incident or maintainer node")
            if not target.startswith(expected_prefix):
                errors.append(f"{path}.target: {rel_type} target must start with {expected_prefix!r}")
            if rel_type == "RELATED_INCIDENT" and not source.startswith("incident-"):
                errors.append(f"{path}.source: RELATED_INCIDENT must start from an incident node")
            if rel_type == "RELATED_CAMPAIGN" and not source.startswith("incident-"):
                errors.append(f"{path}.source: RELATED_CAMPAIGN must start from an incident node")
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


def validate_corpus_implied_relationships(corpus: list[dict[str, Any]], relationships: Any) -> list[str]:
    errors: list[str] = []
    if not isinstance(relationships, list):
        return errors
    relationships_by_source_type = {
        (relationship.get("source"), relationship.get("type"))
        for relationship in relationships
        if isinstance(relationship, dict)
    }
    relationship_keys = {
        (relationship.get("source"), relationship.get("target"), relationship.get("type"))
        for relationship in relationships
        if isinstance(relationship, dict)
    }
    for incident in corpus:
        if not isinstance(incident, dict) or not isinstance(incident.get("id"), str):
            continue
        source = incident_node_id(incident["id"])
        if incident.get("source_artifact_divergence") is True and (source, "SOURCE_ARTIFACT_DIVERGENCE") not in relationships_by_source_type:
            errors.append(f"{source}: missing SOURCE_ARTIFACT_DIVERGENCE relationship")
        for actor in incident.get("threat_actors") or []:
            if isinstance(actor, dict) and isinstance(actor.get("id"), str):
                key = (source, actor["id"], "ATTRIBUTED_TO_ACTOR")
                if key not in relationship_keys:
                    errors.append(f"{source}: missing ATTRIBUTED_TO_ACTOR relationship for {actor['id']}")
                for entity_ref in actor.get("entity_refs") or []:
                    if isinstance(entity_ref, str):
                        key = (entity_ref, actor["id"], "ATTRIBUTED_TO_ACTOR")
                        if key not in relationship_keys:
                            errors.append(f"{source}: missing ATTRIBUTED_TO_ACTOR relationship from {entity_ref} to {actor['id']}")
        for campaign in incident.get("campaigns") or []:
            if isinstance(campaign, dict) and isinstance(campaign.get("id"), str):
                key = (source, campaign["id"], "RELATED_CAMPAIGN")
                if key not in relationship_keys:
                    errors.append(f"{source}: missing RELATED_CAMPAIGN relationship for {campaign['id']}")
    return errors


def validate_graph(corpus: Any, entities_by_type: dict[str, Any], relationships: Any) -> list[str]:
    errors: list[str] = []
    if not isinstance(corpus, list):
        errors.append("corpus: expected list")
        corpus = []

    raw_incident_ids = collect_raw_incident_ids(corpus)
    incident_ids = collect_incident_ids(corpus)
    all_entity_ids: set[str] = set()
    for entity_type, entities in entities_by_type.items():
        entity_ids = validate_entity_file(errors, entity_type, entities, raw_incident_ids)
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
    errors.extend(validate_corpus_implied_relationships(corpus, relationships))
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
