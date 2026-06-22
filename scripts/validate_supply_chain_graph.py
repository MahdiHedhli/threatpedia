#!/usr/bin/env python3
"""Validate supply-chain graph primitive files."""

from __future__ import annotations

import argparse
from datetime import date
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

from supply_chain_purl import PurlError, canonicalize_purl, parse_purl


REPO_ROOT = Path(__file__).resolve().parents[1]
DEFAULT_CORPUS_PATH = REPO_ROOT / "data" / "supply-chain-incidents" / "incidents.json"
DEFAULT_ENTITY_DIR = REPO_ROOT / "data" / "supply-chain-entities"
DEFAULT_RELATIONSHIP_PATH = REPO_ROOT / "data" / "supply-chain-relationships" / "relationships.json"
DEFAULT_MALWARE_FAMILY_PATH = REPO_ROOT / "data" / "supply-chain-malware-families" / "families.json"

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
MONTH_PATTERN = re.compile(r"^\d{4}-\d{2}$")
VALID_LINEAGE_EDGE_TYPES = {"EVOLVED_FROM", "VARIANT_OF"}
VALID_LINEAGE_CONFIDENCE = {"confirmed", "suspected"}
VALID_RELATION_KIND = {"descendant", "evolution", "cosmetic_clone", "playbook_adoption", "sibling_fork"}
VALID_STRAIN_CONFIDENCE = {"origin", "confirmed", "suspected"}
VALID_STRAIN_SEVERITY = {"low", "medium", "high", "critical"}
VALID_ATTRIBUTION_CONFIDENCE = {"unknown", "suspected", "likely", "confirmed"}


def load_json(path: Path) -> Any:
    with path.open("r", encoding="utf-8") as handle:
        return json.load(handle)


def normalize_alias(value: str) -> str:
    return re.sub(r"[^a-z0-9]+", "-", value.strip().lower()).strip("-")


def stable_id(prefix: str, *parts: str) -> str:
    slug = "-".join(filter(None, (normalize_alias(part) for part in parts)))
    return f"{prefix}-{slug}"


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


def parse_date(value: Any) -> date | None:
    if not isinstance(value, str) or not DATE_PATTERN.fullmatch(value):
        return None
    try:
        return date.fromisoformat(value)
    except ValueError:
        return None


def is_date_or_month(value: Any) -> bool:
    if not isinstance(value, str):
        return False
    if DATE_PATTERN.fullmatch(value):
        return parse_date(value) is not None
    if MONTH_PATTERN.fullmatch(value):
        try:
            date.fromisoformat(f"{value}-01")
            return True
        except ValueError:
            return False
    return False


def validate_layout(errors: list[str], path: str, layout: Any) -> None:
    if not isinstance(layout, dict):
        errors.append(f"{path}.layout: expected object with numeric x/y")
        return
    for axis in ("x", "y"):
        value = layout.get(axis)
        if not isinstance(value, (int, float)) or isinstance(value, bool):
            errors.append(f"{path}.layout.{axis}: expected number")


def is_http_url(value: Any) -> bool:
    if not isinstance(value, str) or not value.strip():
        return False
    try:
        parsed = urlparse(value)
        _ = parsed.port
    except ValueError:
        return False
    return parsed.scheme in {"http", "https"} and bool(parsed.netloc)


def incident_node_id(incident_id: str) -> str:
    return f"incident-{incident_id}"


def load_entities(entity_dir: Path) -> dict[str, list[dict[str, Any]]]:
    return {entity_type: load_json(entity_dir / filename) for entity_type, filename in ENTITY_FILES.items()}


def collect_raw_incident_ids(corpus: list[dict[str, Any]]) -> set[str]:
    return {incident["id"] for incident in corpus if isinstance(incident, dict) and isinstance(incident.get("id"), str)}


def collect_incident_ids(corpus: list[dict[str, Any]]) -> set[str]:
    return {incident_node_id(incident["id"]) for incident in corpus if isinstance(incident, dict) and isinstance(incident.get("id"), str)}


def collect_reference_ids_by_incident(corpus: list[dict[str, Any]]) -> dict[str, set[str]]:
    references_by_incident: dict[str, set[str]] = {}
    for incident in corpus:
        if not isinstance(incident, dict) or not isinstance(incident.get("id"), str):
            continue
        reference_ids = {
            reference["id"]
            for reference in incident.get("references") or []
            if isinstance(reference, dict) and isinstance(reference.get("id"), str)
        }
        references_by_incident[incident["id"]] = reference_ids
    return references_by_incident


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
            if entity_type == "packages":
                alias_key = f"{entity.get('ecosystem', '')}:{normalized}"
            elif entity_type == "releases":
                alias_key = (
                    f"{entity.get('ecosystem', '')}:"
                    f"{entity.get('package_name', '')}:"
                    f"{entity.get('version', '')}:"
                    f"{normalized}"
                )
            else:
                alias_key = normalized
            owner = alias_owners.get(alias_key)
            if owner and owner != entity_id:
                errors.append(f"{entity_type}: normalized alias {normalized!r} belongs to both {owner} and {entity_id}")
            alias_owners[alias_key] = entity_id
    return ids


def validate_release_references(
    errors: list[str],
    releases: Any,
    references_by_incident: dict[str, set[str]],
) -> None:
    if not isinstance(releases, list):
        return
    for index, release in enumerate(releases):
        if not isinstance(release, dict):
            continue
        entity_id = release.get("id", f"releases[{index}]")
        source_incident_ids = release.get("source_incident_ids")
        references = release.get("references")
        if not isinstance(source_incident_ids, list) or not isinstance(references, list):
            continue
        allowed_references: set[str] = set()
        for source_id in source_incident_ids:
            if isinstance(source_id, str):
                allowed_references.update(references_by_incident.get(source_id, set()))
        for reference_index, reference in enumerate(references):
            if isinstance(reference, str) and reference not in allowed_references:
                errors.append(f"{entity_id}.references[{reference_index}]: unknown source reference id {reference!r}")


def validate_relationships(
    relationships: Any,
    *,
    entity_ids: set[str],
    incident_ids: set[str],
    references_by_incident: dict[str, set[str]],
) -> list[str]:
    errors: list[str] = []
    if not isinstance(relationships, list):
        return ["relationships: expected list"]

    valid_nodes = entity_ids | incident_ids
    seen_relationships: set[tuple[Any, Any, Any, Any]] = set()
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
            if rel_type == "INCIDENT_AFFECTED_RELEASE" and not source.startswith("incident-"):
                errors.append(f"{path}.source: INCIDENT_AFFECTED_RELEASE must start from an incident node")
            if rel_type == "MAINTAINS_REPOSITORY" and not source.startswith("maintainer-"):
                errors.append(f"{path}.source: MAINTAINS_REPOSITORY must start from a maintainer node")
            if rel_type == "USES_ACCOUNT" and not source.startswith("maintainer-"):
                errors.append(f"{path}.source: USES_ACCOUNT must start from a maintainer node")
            if rel_type == "SEEDED_BY":
                if not source.startswith(("pkg-", "release-")):
                    errors.append(f"{path}.source: SEEDED_BY must start from a package or release node")
                if source == target:
                    errors.append(f"{path}: source and target cannot be the same")
                tier = rel.get("propagation_tier")
                if tier not in {"causal", "temporal"}:
                    errors.append(f"{path}.propagation_tier: expected 'causal' or 'temporal'")
                evidence_refs = rel.get("evidence_refs")
                if not isinstance(evidence_refs, list) or not evidence_refs:
                    errors.append(f"{path}.evidence_refs: expected non-empty list")
                elif not all(isinstance(ref, str) and ref.strip() for ref in evidence_refs):
                    errors.append(f"{path}.evidence_refs: expected non-empty string references")
                summary = rel.get("summary")
                if not isinstance(summary, str) or len(summary.strip()) < 20:
                    errors.append(f"{path}.summary: expected evidence summary")
                source_incident_id = rel.get("source_incident_id")
                if not isinstance(source_incident_id, str):
                    errors.append(f"{path}.source_incident_id: expected string")
                elif source_incident_id not in references_by_incident:
                    errors.append(f"{path}.source_incident_id: unknown incident {source_incident_id!r}")
                elif isinstance(evidence_refs, list):
                    valid_refs = references_by_incident[source_incident_id]
                    for ref in evidence_refs:
                        if isinstance(ref, str) and ref not in valid_refs:
                            errors.append(f"{path}.evidence_refs: unknown reference {ref!r} for {source_incident_id}")
                seeded_by_edges.append((source, target, path))
        if source not in valid_nodes:
            errors.append(f"{path}.source: unknown source {source!r}")
        if target not in valid_nodes:
            errors.append(f"{path}.target: unknown target {target!r}")
        source_incident_context = rel.get("source_incident_id") if rel_type == "SEEDED_BY" else ""
        key = (source, target, rel_type, source_incident_context or "")
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
    stack: list[str] = []

    def visit(node: str) -> None:
        if node in visited:
            return
        if node in visiting:
            cycle = " -> ".join(stack[stack.index(node) :] + [node]) if node in stack else node
            errors.append(f"SEEDED_BY cycle detected: {cycle}")
            return
        visiting.add(node)
        stack.append(node)
        for target, _path in graph.get(node, []):
            visit(target)
        stack.pop()
        visiting.remove(node)
        visited.add(node)

    for source in graph:
        visit(source)
    return errors


def validate_directed_acyclic_edges(edges: list[tuple[str, str, str]], label: str) -> list[str]:
    graph: dict[str, list[str]] = {}
    for source, target, _path in edges:
        graph.setdefault(source, []).append(target)

    errors: list[str] = []
    visiting: set[str] = set()
    visited: set[str] = set()
    stack: list[str] = []

    def visit(node: str) -> None:
        if node in visited:
            return
        if node in visiting:
            cycle = " -> ".join(stack[stack.index(node) :] + [node]) if node in stack else node
            errors.append(f"{label} cycle detected: {cycle}")
            return
        visiting.add(node)
        stack.append(node)
        for target in graph.get(node, []):
            visit(target)
        stack.pop()
        visiting.remove(node)
        visited.add(node)

    for source in graph:
        visit(source)
    return errors


def validate_malware_families(
    malware_families: Any,
    *,
    raw_incident_ids: set[str],
    entity_ids: set[str],
) -> list[str]:
    errors: list[str] = []
    if not isinstance(malware_families, list):
        return ["malware_families: expected list"]

    family_ids: set[str] = set()
    all_strain_ids: set[str] = set()
    all_fork_event_ids: set[str] = set()
    lineage_edges: list[tuple[str, str, str]] = []

    for family_index, family in enumerate(malware_families):
        path = f"malware_families[{family_index}]"
        if not isinstance(family, dict):
            errors.append(f"{path}: expected object")
            continue
        family_id = family.get("id")
        if not isinstance(family_id, str) or not family_id.startswith("family-"):
            errors.append(f"{path}.id: expected family-* id")
            continue
        if family_id in family_ids:
            errors.append(f"{family_id}: duplicate malware family id")
        family_ids.add(family_id)
        if not isinstance(family.get("name"), str) or not family["name"].strip():
            errors.append(f"{family_id}.name: expected non-empty string")
        schema_version = family.get("schema_version")
        if not isinstance(schema_version, str) or not schema_version.strip():
            errors.append(f"{family_id}.schema_version: expected non-empty string")
        if not isinstance(family.get("summary"), str) or not family["summary"].strip():
            errors.append(f"{family_id}.summary: expected non-empty string")
        if not is_date_or_month(family.get("first_seen")):
            errors.append(f"{family_id}.first_seen: expected YYYY-MM-DD or YYYY-MM")
        aliases = family.get("aliases")
        if aliases is not None:
            if not isinstance(aliases, list):
                errors.append(f"{family_id}.aliases: expected list")
            else:
                for alias_index, alias in enumerate(aliases):
                    if not isinstance(alias, str) or not alias.strip():
                        errors.append(f"{family_id}.aliases[{alias_index}]: expected non-empty string")
        root_actor_id = family.get("root_actor_id")
        if root_actor_id is not None:
            if not isinstance(root_actor_id, str) or root_actor_id not in entity_ids:
                errors.append(f"{family_id}.root_actor_id: unknown actor/entity id {root_actor_id!r}")
        associated_actor_ids = family.get("associated_actor_ids")
        if associated_actor_ids is not None:
            if not isinstance(associated_actor_ids, list):
                errors.append(f"{family_id}.associated_actor_ids: expected list")
            else:
                for actor_index, actor_id in enumerate(associated_actor_ids):
                    if not isinstance(actor_id, str) or actor_id not in entity_ids:
                        errors.append(f"{family_id}.associated_actor_ids[{actor_index}]: unknown actor/entity id {actor_id!r}")

        sources = family.get("sources")
        source_ids: set[str] = set()
        if not isinstance(sources, list) or not sources:
            errors.append(f"{family_id}.sources: expected non-empty list")
            sources = []
        for source_index, source in enumerate(sources):
            if not isinstance(source, dict):
                errors.append(f"{family_id}.sources[{source_index}]: expected object")
                continue
            source_id = source.get("id")
            if not isinstance(source_id, str) or not source_id.strip():
                errors.append(f"{family_id}.sources[{source_index}].id: expected non-empty string")
                continue
            if source_id in source_ids:
                errors.append(f"{family_id}.sources[{source_index}].id: duplicate source id {source_id!r}")
            source_ids.add(source_id)
            for field in ("title", "publisher"):
                if not isinstance(source.get(field), str) or not source[field].strip():
                    errors.append(f"{family_id}.sources[{source_index}].{field}: expected non-empty string")
            if not is_http_url(source.get("url")):
                errors.append(f"{family_id}.sources[{source_index}].url: expected valid HTTP/HTTPS URL")
            if not is_date_or_month(source.get("published_at")):
                errors.append(f"{family_id}.sources[{source_index}].published_at: expected YYYY-MM-DD or YYYY-MM")
        if not source_ids:
            errors.append(f"{family_id}.sources: expected at least one source")

        timeline_ticks = family.get("timeline_ticks")
        if not isinstance(timeline_ticks, list) or not timeline_ticks:
            errors.append(f"{family_id}.timeline_ticks: expected non-empty list")
            timeline_ticks = []
        for tick_index, tick in enumerate(timeline_ticks):
            if not isinstance(tick, dict):
                errors.append(f"{family_id}.timeline_ticks[{tick_index}]: expected object")
                continue
            if not isinstance(tick.get("label"), str) or not tick["label"].strip():
                errors.append(f"{family_id}.timeline_ticks[{tick_index}].label: expected non-empty string")
            tick_x = tick.get("x")
            if not isinstance(tick_x, (int, float)) or isinstance(tick_x, bool):
                errors.append(f"{family_id}.timeline_ticks[{tick_index}].x: expected number")

        strain_ids: set[str] = set()
        strains = family.get("strains")
        if not isinstance(strains, list) or not strains:
            errors.append(f"{family_id}.strains: expected non-empty list")
            strains = []
        for strain_index, strain in enumerate(strains):
            strain_path = f"{family_id}.strains[{strain_index}]"
            if not isinstance(strain, dict):
                errors.append(f"{strain_path}: expected object")
                continue
            strain_id = strain.get("id")
            if not isinstance(strain_id, str) or not strain_id.startswith("strain-"):
                errors.append(f"{strain_path}.id: expected strain-* id")
                continue
            if strain_id in strain_ids or strain_id in all_strain_ids:
                errors.append(f"{strain_id}: duplicate malware strain id")
            strain_ids.add(strain_id)
            all_strain_ids.add(strain_id)
            if not isinstance(strain.get("name"), str) or not strain["name"].strip():
                errors.append(f"{strain_id}.name: expected non-empty string")
            if not is_date_or_month(strain.get("first_seen")):
                errors.append(f"{strain_id}.first_seen: expected YYYY-MM-DD or YYYY-MM")
            if strain.get("lineage_confidence") not in VALID_STRAIN_CONFIDENCE:
                errors.append(f"{strain_id}.lineage_confidence: expected one of {sorted(VALID_STRAIN_CONFIDENCE)}")
            if strain.get("severity") not in VALID_STRAIN_SEVERITY:
                errors.append(f"{strain_id}.severity: expected low, medium, high, or critical")
            if not isinstance(strain.get("mutation_summary"), str) or len(strain["mutation_summary"].strip()) < 20:
                errors.append(f"{strain_id}.mutation_summary: expected descriptive mutation summary")
            ecosystems = strain.get("ecosystems")
            if not isinstance(ecosystems, list) or not ecosystems:
                errors.append(f"{strain_id}.ecosystems: expected non-empty list")
            else:
                for ecosystem_index, ecosystem in enumerate(ecosystems):
                    if not isinstance(ecosystem, str) or not ecosystem.strip():
                        errors.append(f"{strain_id}.ecosystems[{ecosystem_index}]: expected non-empty string")
            if not isinstance(strain.get("key_mutation"), str) or not strain["key_mutation"].strip():
                errors.append(f"{strain_id}.key_mutation: expected non-empty string")
            if not isinstance(strain.get("provenance_abuse"), str) or not strain["provenance_abuse"].strip():
                errors.append(f"{strain_id}.provenance_abuse: expected non-empty string")
            retained_features = strain.get("retained_features")
            if retained_features is not None:
                if not isinstance(retained_features, list):
                    errors.append(f"{strain_id}.retained_features: expected list")
                else:
                    for feature_index, feature in enumerate(retained_features):
                        if not isinstance(feature, str) or not feature.strip():
                            errors.append(f"{strain_id}.retained_features[{feature_index}]: expected non-empty string")
            strain_aliases = strain.get("aliases")
            if strain_aliases is not None:
                if not isinstance(strain_aliases, list):
                    errors.append(f"{strain_id}.aliases: expected list")
                else:
                    for alias_index, alias in enumerate(strain_aliases):
                        if not isinstance(alias, str) or not alias.strip():
                            errors.append(f"{strain_id}.aliases[{alias_index}]: expected non-empty string")
            validate_layout(errors, strain_id, strain.get("layout"))
            attribution = strain.get("attribution")
            if not isinstance(attribution, dict):
                errors.append(f"{strain_id}.attribution: expected object")
            else:
                actor_id = attribution.get("actor_id")
                if actor_id is not None:
                    if not isinstance(actor_id, str) or actor_id not in entity_ids:
                        errors.append(f"{strain_id}.attribution.actor_id: unknown actor/entity id {actor_id!r}")
                if not isinstance(attribution.get("label"), str) or not attribution["label"].strip():
                    errors.append(f"{strain_id}.attribution.label: expected non-empty string")
                if attribution.get("confidence") not in VALID_ATTRIBUTION_CONFIDENCE:
                    errors.append(f"{strain_id}.attribution.confidence: expected unknown, suspected, likely, or confirmed")
            incident_ids = strain.get("incident_ids")
            if incident_ids is not None:
                if not isinstance(incident_ids, list):
                    errors.append(f"{strain_id}.incident_ids: expected list")
                else:
                    for incident_index, incident_id in enumerate(incident_ids):
                        if not isinstance(incident_id, str) or incident_id not in raw_incident_ids:
                            errors.append(f"{strain_id}.incident_ids[{incident_index}]: unknown incident id {incident_id!r}")

        fork_event_ids: set[str] = set()
        fork_events = family.get("fork_events")
        if fork_events is not None:
            if not isinstance(fork_events, list):
                errors.append(f"{family_id}.fork_events: expected list")
            else:
                for event_index, event in enumerate(fork_events):
                    event_path = f"{family_id}.fork_events[{event_index}]"
                    if not isinstance(event, dict):
                        errors.append(f"{event_path}: expected object")
                        continue
                    event_id = event.get("id")
                    if not isinstance(event_id, str) or not event_id.startswith("fork-"):
                        errors.append(f"{event_path}.id: expected fork-* id")
                        continue
                    if event_id in fork_event_ids or event_id in all_fork_event_ids:
                        errors.append(f"{event_id}: duplicate fork event id")
                    fork_event_ids.add(event_id)
                    all_fork_event_ids.add(event_id)
                    if not isinstance(event.get("name"), str) or not event["name"].strip():
                        errors.append(f"{event_id}.name: expected non-empty string")
                    if not is_date_or_month(event.get("date")):
                        errors.append(f"{event_id}.date: expected YYYY-MM-DD or YYYY-MM")
                    if not isinstance(event.get("summary"), str) or len(event["summary"].strip()) < 20:
                        errors.append(f"{event_id}.summary: expected descriptive summary")
                    validate_layout(errors, event_id, event.get("layout"))
                    source_refs = event.get("source_refs")
                    if source_refs is not None:
                        if not isinstance(source_refs, list):
                            errors.append(f"{event_id}.source_refs: expected list")
                        else:
                            for ref_index, source_ref in enumerate(source_refs):
                                if not isinstance(source_ref, str) or source_ref not in source_ids:
                                    errors.append(f"{event_id}.source_refs[{ref_index}]: unknown family source ref {source_ref!r}")

        lineage_edge_items = family.get("lineage_edges")
        if lineage_edge_items is None:
            lineage_edge_items = []
        elif not isinstance(lineage_edge_items, list):
            errors.append(f"{family_id}.lineage_edges: expected list")
            lineage_edge_items = []
        for edge_index, edge in enumerate(lineage_edge_items):
            edge_path = f"{family_id}.lineage_edges[{edge_index}]"
            if not isinstance(edge, dict):
                errors.append(f"{edge_path}: expected object")
                continue
            edge_type = edge.get("type")
            source = edge.get("source")
            target = edge.get("target")
            if edge_type not in VALID_LINEAGE_EDGE_TYPES:
                errors.append(f"{edge_path}.type: expected EVOLVED_FROM or VARIANT_OF")
            if not isinstance(source, str) or source not in strain_ids:
                errors.append(f"{edge_path}.source: unknown strain id {source!r}")
            if not isinstance(target, str) or target not in strain_ids:
                errors.append(f"{edge_path}.target: unknown strain id {target!r}")
            if source == target:
                errors.append(f"{edge_path}: source and target cannot be the same")
            if edge.get("confidence") not in VALID_LINEAGE_CONFIDENCE:
                errors.append(f"{edge_path}.confidence: expected confirmed or suspected")
            if edge.get("evidence_class") not in VALID_LINEAGE_CONFIDENCE:
                errors.append(f"{edge_path}.evidence_class: expected confirmed or suspected")
            if edge.get("relation_kind") not in VALID_RELATION_KIND:
                errors.append(f"{edge_path}.relation_kind: expected one of {sorted(VALID_RELATION_KIND)}")
            mutation_delta = edge.get("mutation_delta")
            if not isinstance(mutation_delta, list) or not mutation_delta:
                errors.append(f"{edge_path}.mutation_delta: expected non-empty list")
            elif not all(isinstance(item, str) and item.strip() for item in mutation_delta):
                errors.append(f"{edge_path}.mutation_delta: expected non-empty string entries")
            external_refs = edge.get("external_refs")
            if not isinstance(external_refs, list) or not external_refs:
                errors.append(f"{edge_path}.external_refs: expected non-empty list")
            else:
                for ref_index, ref in enumerate(external_refs):
                    if not isinstance(ref, dict):
                        errors.append(f"{edge_path}.external_refs[{ref_index}]: expected object")
                        continue
                    source_ref = ref.get("source_ref")
                    if not isinstance(source_ref, str) or source_ref not in source_ids:
                        errors.append(f"{edge_path}.external_refs[{ref_index}].source_ref: unknown family source ref {source_ref!r}")
            suspected_reason = edge.get("suspected_reason")
            if (edge.get("confidence") == "suspected" or edge.get("evidence_class") == "suspected") and (
                not isinstance(suspected_reason, str) or not suspected_reason.strip()
            ):
                errors.append(f"{edge_path}.suspected_reason: suspected edges must explain uncertainty")
            fork_event_id = edge.get("fork_event_id")
            if fork_event_id is not None:
                if not isinstance(fork_event_id, str) or fork_event_id not in fork_event_ids:
                    errors.append(f"{edge_path}.fork_event_id: unknown fork event {fork_event_id!r}")
            if isinstance(source, str) and isinstance(target, str):
                lineage_edges.append((source, target, edge_path))

    errors.extend(validate_directed_acyclic_edges(lineage_edges, "EVOLVED_FROM"))
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
    seeded_by_relationships = [
        relationship
        for relationship in relationships
        if isinstance(relationship, dict) and relationship.get("type") == "SEEDED_BY"
    ]
    collision_base_ids = release_collision_base_ids(corpus)
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
                package_id = stable_id("pkg", ecosystem, package_name)
                release_id = release_entity_id(collision_base_ids, ecosystem, package_name, version)
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
                matches = [
                    relationship
                    for relationship in seeded_by_relationships
                    if relationship.get("source") == edge_source
                    and relationship.get("target") == edge_target
                    and relationship.get("source_incident_id") == incident["id"]
                ]
                if not matches:
                    errors.append(
                        f"{source}: missing SEEDED_BY relationship {edge_source} -> {edge_target} "
                        f"for source_incident_id {incident['id']}"
                    )
                    continue
                expected_tier = propagation_edge.get("propagation_tier")
                expected_refs = set(propagation_edge.get("evidence_refs") or [])
                if not any(
                    relationship.get("propagation_tier") == expected_tier
                    and set(relationship.get("evidence_refs") or []) == expected_refs
                    for relationship in matches
                ):
                    errors.append(
                        f"{source}: SEEDED_BY relationship {edge_source} -> {edge_target} "
                        "does not preserve propagation_tier/evidence_refs"
                    )
    return errors


def validate_graph(
    corpus: Any,
    entities_by_type: dict[str, Any],
    relationships: Any,
    malware_families: Any | None = None,
) -> list[str]:
    errors: list[str] = []
    if not isinstance(corpus, list):
        errors.append("corpus: expected list")
        corpus = []

    raw_incident_ids = collect_raw_incident_ids(corpus)
    references_by_incident = collect_reference_ids_by_incident(corpus)
    incident_ids = collect_incident_ids(corpus)
    all_entity_ids: set[str] = set()
    for entity_type, entities in entities_by_type.items():
        entity_ids = validate_entity_file(errors, entity_type, entities, raw_incident_ids)
        duplicates = all_entity_ids & entity_ids
        for entity_id in sorted(duplicates):
            errors.append(f"{entity_id}: duplicate id across entity files")
        all_entity_ids |= entity_ids

    validate_release_references(errors, entities_by_type.get("releases"), references_by_incident)
    errors.extend(
        validate_relationships(
            relationships,
            entity_ids=all_entity_ids,
            incident_ids=incident_ids,
            references_by_incident=references_by_incident,
        )
    )
    errors.extend(validate_corpus_implied_relationships(corpus, relationships))
    if malware_families is not None:
        errors.extend(
            validate_malware_families(
                malware_families,
                raw_incident_ids=raw_incident_ids,
                entity_ids=all_entity_ids,
            )
        )
    return errors


def main(argv: list[str] | None = None) -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--corpus", type=Path, default=DEFAULT_CORPUS_PATH)
    parser.add_argument("--entity-dir", type=Path, default=DEFAULT_ENTITY_DIR)
    parser.add_argument("--relationships", type=Path, default=DEFAULT_RELATIONSHIP_PATH)
    parser.add_argument("--malware-families", type=Path, default=DEFAULT_MALWARE_FAMILY_PATH)
    args = parser.parse_args(argv)

    try:
        corpus = load_json(args.corpus)
        entities_by_type = load_entities(args.entity_dir)
        relationships = load_json(args.relationships)
        malware_families = load_json(args.malware_families)
    except (OSError, json.JSONDecodeError) as exc:
        print(f"failed to load supply-chain graph inputs: {exc}", file=sys.stderr)
        return 2

    errors = validate_graph(corpus, entities_by_type, relationships, malware_families)
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
