#!/usr/bin/env python3
"""Validate supply-chain graph primitive files."""

from __future__ import annotations

import argparse
from datetime import date
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
    "releases": "releases.json",
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
    "PACKAGE_RELEASE",
    "INCIDENT_AFFECTED_RELEASE",
    "MAINTAINS_REPOSITORY",
    "SEEDED_BY",
    "USES_ACCOUNT",
}
ENTITY_ID_PATTERN = re.compile(r"^(account|actor|build|campaign|channel|maintainer|pkg|release|repo|org)-[a-z0-9][a-z0-9-]*$")
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
    "PACKAGE_RELEASE": "release-",
    "INCIDENT_AFFECTED_RELEASE": "release-",
    "MAINTAINS_REPOSITORY": "repo-",
    "SEEDED_BY": ("pkg-", "release-"),
    "USES_ACCOUNT": "account-",
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
    "releases": ["purl", "package_name", "version", "published_at", "ecosystem"],
    "repositories": ["host", "url", "owner"],
}
DATE_PATTERN = re.compile(r"^\d{4}-\d{2}-\d{2}$")
VALID_PROPAGATION_TIERS = {"causal", "temporal"}


def load_json(path: Path) -> Any:
    with path.open("r", encoding="utf-8") as handle:
        return json.load(handle)


def normalize_alias(value: str) -> str:
    return re.sub(r"[^a-z0-9]+", "-", value.strip().lower()).strip("-")


def parse_date(value: Any) -> date | None:
    if not isinstance(value, str) or not DATE_PATTERN.fullmatch(value):
        return None
    try:
        return date.fromisoformat(value)
    except ValueError:
        return None


def incident_node_id(incident_id: str) -> str:
    return f"incident-{incident_id}"


def purl_identity(value: str) -> tuple[str, str | None, str]:
    parsed = parse_purl(value)
    return parsed.type, parsed.namespace, parsed.name


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
        if entity_type == "releases":
            purl = entity.get("purl")
            ecosystem = entity.get("ecosystem")
            package_name = entity.get("package_name")
            if isinstance(purl, str) and isinstance(ecosystem, str) and isinstance(package_name, str):
                try:
                    canonical = canonicalize_purl(
                        purl,
                        ecosystem=ecosystem,
                        package_name=package_name,
                    )
                except PurlError as exc:
                    errors.append(f"{entity_id}.purl: invalid canonical release PURL: {exc}")
                else:
                    parsed = parse_purl(canonical)
                    if purl != canonical:
                        errors.append(f"{entity_id}.purl: expected canonical release PURL {canonical!r}")
                    if not parsed.version:
                        errors.append(f"{entity_id}.purl: expected versioned package URL")
                    elif parsed.version != entity.get("version"):
                        errors.append(f"{entity_id}.version: does not match PURL version {parsed.version!r}")
                    if parsed.type == "generic":
                        errors.append(f"{entity_id}.purl: generic release PURLs are not joinable")
            if parse_date(entity.get("published_at")) is None:
                errors.append(f"{entity_id}.published_at: expected YYYY-MM-DD date")
            if "disclosed_at" not in entity:
                errors.append(f"{entity_id}.disclosed_at: missing required field")
            elif entity.get("disclosed_at") is not None and parse_date(entity.get("disclosed_at")) is None:
                errors.append(f"{entity_id}.disclosed_at: expected YYYY-MM-DD date or null")
            if "malicious_range" not in entity:
                errors.append(f"{entity_id}.malicious_range: missing required field")
            elif entity.get("malicious_range") is not None and (
                not isinstance(entity.get("malicious_range"), str) or not entity["malicious_range"].strip()
            ):
                errors.append(f"{entity_id}.malicious_range: expected non-empty string or null")
            references = entity.get("references")
            if not isinstance(references, list) or not references:
                errors.append(f"{entity_id}.references: expected non-empty list")
            elif not all(isinstance(ref, str) and ref.strip() for ref in references):
                errors.append(f"{entity_id}.references: expected non-empty string references")
        if entity_type == "maintainers":
            for field in ["onboarding_date", "first_publish_date"]:
                if field not in entity:
                    errors.append(f"{entity_id}.{field}: missing required field")
                elif entity.get(field) is not None and parse_date(entity.get(field)) is None:
                    errors.append(f"{entity_id}.{field}: expected YYYY-MM-DD date or null")
            repositories = entity.get("repositories")
            if not isinstance(repositories, list):
                errors.append(f"{entity_id}.repositories: expected list")
                repositories = []
            for repo_index, repo_id in enumerate(repositories):
                if not isinstance(repo_id, str) or not repo_id.startswith("repo-"):
                    errors.append(f"{entity_id}.repositories[{repo_index}]: expected repo-* entity id")
            account_ids = entity.get("account_ids")
            if not isinstance(account_ids, list):
                errors.append(f"{entity_id}.account_ids: expected list")
                account_ids = []
            for account_index, account_id in enumerate(account_ids):
                if not isinstance(account_id, str) or not account_id.startswith("account-"):
                    errors.append(f"{entity_id}.account_ids[{account_index}]: expected account-* entity id")
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
    entities_by_id: dict[str, dict[str, Any]],
) -> list[str]:
    errors: list[str] = []
    if not isinstance(relationships, list):
        return ["relationships: expected list"]

    valid_nodes = entity_ids | incident_ids
    seen_relationships: set[tuple[str, str, str]] = set()
    connected_entities: set[str] = set()
    seeded_by_edges: list[tuple[str, str, str]] = []
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
            if rel_type == "PACKAGE_RELEASE" and not source.startswith("pkg-"):
                errors.append(f"{path}.source: PACKAGE_RELEASE must start from a package node")
            if rel_type == "PACKAGE_RELEASE" and source.startswith("pkg-") and target.startswith("release-"):
                package = entities_by_id.get(source)
                release = entities_by_id.get(target)
                if isinstance(package, dict) and isinstance(release, dict):
                    package_url = package.get("package_url")
                    release_purl = release.get("purl")
                    if isinstance(package_url, str) and isinstance(release_purl, str):
                        try:
                            package_identity = purl_identity(package_url)
                            release_identity = purl_identity(release_purl)
                        except PurlError as exc:
                            errors.append(f"{path}: failed to compare package/release PURLs: {exc}")
                        else:
                            if package_identity != release_identity:
                                errors.append(
                                    f"{path}: PACKAGE_RELEASE PURL mismatch {package_url!r} -> {release_purl!r}"
                                )
            if rel_type == "INCIDENT_AFFECTED_RELEASE" and not source.startswith("incident-"):
                errors.append(f"{path}.source: INCIDENT_AFFECTED_RELEASE must start from an incident node")
            if rel_type == "MAINTAINS_REPOSITORY" and not source.startswith("maintainer-"):
                errors.append(f"{path}.source: MAINTAINS_REPOSITORY must start from a maintainer node")
            if rel_type == "USES_ACCOUNT" and not source.startswith("maintainer-"):
                errors.append(f"{path}.source: USES_ACCOUNT must start from a maintainer node")
            if rel_type == "SEEDED_BY":
                if not source.startswith(("pkg-", "release-")):
                    errors.append(f"{path}.source: SEEDED_BY must start from a package or release node")
                elif source.startswith("pkg-") and is_generic_package_entity(entities_by_id.get(source)):
                    errors.append(f"{path}.source: SEEDED_BY package endpoint must be release-spine joinable")
                if target.startswith("pkg-") and is_generic_package_entity(entities_by_id.get(target)):
                    errors.append(f"{path}.target: SEEDED_BY package endpoint must be release-spine joinable")
                if source == target:
                    errors.append(f"{path}: SEEDED_BY source and target must differ")
                tier = rel.get("tier")
                if tier not in VALID_PROPAGATION_TIERS:
                    errors.append(f"{path}.tier: expected one of {sorted(VALID_PROPAGATION_TIERS)!r}")
                evidence_refs = rel.get("evidence_refs")
                if not isinstance(evidence_refs, list) or not evidence_refs:
                    errors.append(f"{path}.evidence_refs: expected non-empty reference list")
                elif not all(isinstance(ref, str) and ref.strip() for ref in evidence_refs):
                    errors.append(f"{path}.evidence_refs: expected non-empty string references")
                seeded_by_edges.append((source, target, path))
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
    errors.extend(validate_seeded_by_acyclic(seeded_by_edges))
    return errors


def validate_seeded_by_acyclic(edges: list[tuple[str, str, str]]) -> list[str]:
    graph: dict[str, list[tuple[str, str]]] = {}
    for source, target, path in edges:
        graph.setdefault(source, []).append((target, path))

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
        for target, _edge_path in graph.get(node, []):
            visit(target, path_stack + [target])
        visiting.remove(node)
        visited.add(node)

    for node in sorted(graph):
        visit(node, [node])
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
    relationships_by_key = {
        (relationship.get("source"), relationship.get("target"), relationship.get("type")): relationship
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
        for maintainer in incident.get("maintainers") or []:
            if not isinstance(maintainer, dict) or not isinstance(maintainer.get("id_slug"), str):
                continue
            maintainer_id = f"maintainer-{normalize_alias(maintainer['id_slug'])}"
            for repo_id in maintainer.get("repositories") or []:
                if isinstance(repo_id, str) and (maintainer_id, repo_id, "MAINTAINS_REPOSITORY") not in relationship_keys:
                    errors.append(f"{source}: missing MAINTAINS_REPOSITORY relationship from {maintainer_id} to {repo_id}")
            for account_id in maintainer.get("account_ids") or []:
                if isinstance(account_id, str) and (maintainer_id, account_id, "USES_ACCOUNT") not in relationship_keys:
                    errors.append(f"{source}: missing USES_ACCOUNT relationship from {maintainer_id} to {account_id}")
        for release in incident.get("releases") or []:
            if not isinstance(release, dict):
                continue
            ecosystem = release.get("ecosystem")
            package_name = release.get("package_name")
            version = release.get("version")
            if all(isinstance(value, str) for value in (ecosystem, package_name, version)):
                package_id = f"pkg-{normalize_alias(ecosystem)}-{normalize_alias(package_name)}"
                release_id = f"release-{normalize_alias(ecosystem)}-{normalize_alias(package_name)}-{normalize_alias(version)}"
                if (package_id, release_id, "PACKAGE_RELEASE") not in relationship_keys:
                    errors.append(f"{source}: missing PACKAGE_RELEASE relationship for {release_id}")
                if (source, release_id, "INCIDENT_AFFECTED_RELEASE") not in relationship_keys:
                    errors.append(f"{source}: missing INCIDENT_AFFECTED_RELEASE relationship for {release_id}")
        for propagation_edge in incident.get("propagation_edges") or []:
            if not isinstance(propagation_edge, dict):
                continue
            edge_source = propagation_edge.get("source")
            edge_target = propagation_edge.get("target")
            if isinstance(edge_source, str) and isinstance(edge_target, str):
                key = (edge_source, edge_target, "SEEDED_BY")
                if key not in relationship_keys:
                    errors.append(f"{source}: missing SEEDED_BY relationship from {edge_source} to {edge_target}")
                    continue
                relationship = relationships_by_key.get(key) or {}
                expected_tier = propagation_edge.get("tier")
                if relationship.get("tier") != expected_tier:
                    errors.append(
                        f"{source}: SEEDED_BY relationship from {edge_source} to {edge_target} has tier "
                        f"{relationship.get('tier')!r}; expected {expected_tier!r}"
                    )
                expected_incident_id = incident["id"]
                if relationship.get("incident_id") != expected_incident_id:
                    errors.append(
                        f"{source}: SEEDED_BY relationship from {edge_source} to {edge_target} has incident_id "
                        f"{relationship.get('incident_id')!r}; expected {expected_incident_id!r}"
                    )
                expected_evidence_refs = sorted(ref for ref in propagation_edge.get("evidence_refs") or [] if isinstance(ref, str))
                relationship_evidence_refs = sorted(ref for ref in relationship.get("evidence_refs") or [] if isinstance(ref, str))
                if relationship_evidence_refs != expected_evidence_refs:
                    errors.append(
                        f"{source}: SEEDED_BY relationship from {edge_source} to {edge_target} has evidence_refs "
                        f"{relationship_evidence_refs!r}; expected {expected_evidence_refs!r}"
                    )
    return errors


def validate_graph(corpus: Any, entities_by_type: dict[str, Any], relationships: Any) -> list[str]:
    errors: list[str] = []
    if not isinstance(corpus, list):
        errors.append("corpus: expected list")
        corpus = []

    raw_incident_ids = collect_raw_incident_ids(corpus)
    incident_ids = collect_incident_ids(corpus)
    all_entity_ids: set[str] = set()
    entities_by_id: dict[str, dict[str, Any]] = {}
    for entity_type, entities in entities_by_type.items():
        entity_ids = validate_entity_file(errors, entity_type, entities, raw_incident_ids)
        if isinstance(entities, list):
            for entity in entities:
                if isinstance(entity, dict) and isinstance(entity.get("id"), str):
                    entities_by_id[entity["id"]] = entity
        duplicates = all_entity_ids & entity_ids
        for entity_id in sorted(duplicates):
            errors.append(f"{entity_id}: duplicate id across entity files")
        all_entity_ids |= entity_ids

    errors.extend(
        validate_relationships(
            relationships,
            entity_ids=all_entity_ids,
            incident_ids=incident_ids,
            entities_by_id=entities_by_id,
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
