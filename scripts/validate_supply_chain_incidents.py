#!/usr/bin/env python3
"""Validate the Threatpedia supply-chain incident corpus."""

from __future__ import annotations

import argparse
from datetime import date
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
DEFAULT_SCHEMA_PATH = REPO_ROOT / "data" / "supply-chain-incidents" / "schema.json"
SCHEMA_VERSION = "supply-chain-incident/1"
ID_PATTERN = re.compile(r"^SC-[0-9]{4}-[A-Z0-9-]+$")
FULL_DATE_PATTERN = re.compile(r"^\d{4}-\d{2}-\d{2}$")
REFERENCE_ID_PATTERN = re.compile(r"^ref-[a-z0-9-]+$")
DATE_PATTERN = re.compile(r"^[0-9]{4}-[0-9]{2}-[0-9]{2}$")
DATE_RANGE_PATTERN = re.compile(r"^([0-9]{4}-[0-9]{2}-[0-9]{2})/([0-9]{4}-[0-9]{2}-[0-9]{2})$")

REQUIRED_FIELDS = [
    "schema_version",
    "id",
    "title",
    "summary",
    "status",
    "first_observed_at",
    "disclosed_at",
    "affected_ecosystems",
    "affected_components",
    "supply_chain_vectors",
    "impact_categories",
    "references",
    "tags",
    "confidence",
    "evidence_level",
    "attack_stage",
    "source_artifact_divergence",
    "maintainers",
    "repositories",
    "build_systems",
    "distribution_channels",
    "compromised_accounts",
]

REQUIRED_COMPONENT_FIELDS = ["component_type", "ecosystem", "name", "vendor"]
REQUIRED_REFERENCE_FIELDS = ["title", "publisher", "url", "published_at"]
REQUIRED_REPOSITORY_FIELDS = ["name", "host", "owner", "url"]
REQUIRED_BUILD_SYSTEM_FIELDS = ["name", "provider", "category"]
REQUIRED_DISTRIBUTION_CHANNEL_FIELDS = ["name", "channel_type", "ecosystem"]
REQUIRED_COMPROMISED_ACCOUNT_FIELDS = ["name", "provider", "account_type", "role"]
REQUIRED_RELEASE_FIELDS = [
    "package_name",
    "ecosystem",
    "purl",
    "version",
    "published_at",
    "malicious_range",
    "references",
    "disclosed_at",
]
REQUIRED_THREAT_ACTOR_FIELDS = ["id", "name", "actor_type", "confidence", "source_refs"]
REQUIRED_CAMPAIGN_FIELDS = ["id", "campaign_id", "name", "slug", "confidence", "source_refs"]
REQUIRED_ATTRIBUTION_EVIDENCE_FIELDS = ["target", "relationship_type", "source_refs", "summary"]
FEATURED_INCIDENT_IDS = {
    "SC-2018-NPM-EVENT-STREAM",
    "SC-2020-SOLARWINDS-ORION",
    "SC-2021-UA-PARSER-JS",
    "SC-2023-THREE-CX-DESKTOP",
    "SC-2024-XZ-UTILS",
}
EDITORIAL_FIELDS = [
    "executive_summary",
    "timeline",
    "attack_chain",
    "affected_ecosystem",
    "defensive_lessons",
    "detection_notes",
    "open_questions",
]
EDITORIAL_CLAIM_FIELDS = [
    "executive_summary",
    "affected_ecosystem",
    "defensive_lessons",
    "detection_notes",
    "open_questions",
]
REQUIRED_EDITORIAL_ITEM_FIELDS = ["text", "reference_ids"]
REQUIRED_TIMELINE_FIELDS = ["date", "title", "text", "reference_ids"]
REQUIRED_ATTACK_CHAIN_FIELDS = ["stage", "text", "reference_ids"]
VALID_STATUS = {"confirmed"}
VALID_CONFIDENCE = {"high", "medium", "low"}
VALID_EVIDENCE_LEVELS = {"primary", "vendor", "researcher", "media", "inferred"}
VALID_ATTACK_STAGES = {
    "source_compromise",
    "build_compromise",
    "account_compromise",
    "package_publish",
    "dependency_resolution",
    "distribution_compromise",
    "ci_cd_compromise",
}
VALID_COMPONENT_TYPES = {"package", "project", "software", "service", "update_channel", "website"}
VALID_VECTORS = {
    "build_system_compromise",
    "cdn_script_compromise",
    "ci_cd_action_compromise",
    "dependency_confusion",
    "distribution_site_compromise",
    "maintainer_account_compromise",
    "malicious_dependency",
    "package_repository_compromise",
    "protestware",
    "signed_update_compromise",
    "source_repository_compromise",
    "vendor_update_compromise",
}
VALID_IMPACTS = {
    "backdoor",
    "credential_theft",
    "crypto_theft",
    "cryptomining",
    "data_exfiltration",
    "destructive_payload",
    "developer_workstation_compromise",
    "downstream_customer_compromise",
    "malware_distribution",
    "protest_payload",
    "ransomware_delivery",
}
VALID_ATTRIBUTION_CONFIDENCE = {"confirmed", "likely", "suspected", "disputed", "unknown"}
VALID_ACTOR_TYPES = {"public", "provisional"}
VALID_ATTRIBUTION_RELATIONSHIPS = {"ATTRIBUTED_TO_ACTOR", "RELATED_CAMPAIGN"}
VALID_PROPAGATION_TIERS = {"causal", "temporal"}
PROPAGATION_ENDPOINT_PATTERN = re.compile(r"^(pkg|release)-[a-z0-9][a-z0-9-]*$")


def load_json(path: Path) -> Any:
    with path.open("r", encoding="utf-8") as handle:
        return json.load(handle)


def parse_date(value: Any) -> date | None:
    if not isinstance(value, str) or not DATE_PATTERN.fullmatch(value):
        return None
    try:
        return date.fromisoformat(value)
    except ValueError:
        return None


def parse_date_or_range(value: Any) -> bool:
    if parse_date(value) is not None:
        return True
    if not isinstance(value, str):
        return False
    match = DATE_RANGE_PATTERN.match(value)
    if not match:
        return False
    start = parse_date(match.group(1))
    end = parse_date(match.group(2))
    return start is not None and end is not None and start <= end


def is_valid_url(value: Any) -> bool:
    if not isinstance(value, str) or any(char.isspace() for char in value):
        return False
    parsed = urlparse(value)
    try:
        parsed.port
    except ValueError:
        return False
    return parsed.scheme in {"http", "https"} and bool(parsed.netloc)


def require_string(errors: list[str], path: str, value: Any, *, min_length: int = 1) -> None:
    if not isinstance(value, str) or len(value.strip()) < min_length:
        errors.append(f"{path}: expected non-empty string")


def require_string_list(errors: list[str], path: str, value: Any, *, allow_empty: bool = False) -> None:
    if not isinstance(value, list) or (not value and not allow_empty):
        errors.append(f"{path}: expected non-empty list")
        return
    for index, item in enumerate(value):
        if not isinstance(item, str) or not item.strip():
            errors.append(f"{path}[{index}]: expected non-empty string")


def require_enum_list(errors: list[str], path: str, value: Any, allowed: set[str]) -> None:
    require_string_list(errors, path, value)
    if not isinstance(value, list):
        return
    for index, item in enumerate(value):
        if not isinstance(item, str) or not item.strip():
            errors.append(f"{path}[{index}]: expected non-empty string")
        elif item not in allowed:
            errors.append(f"{path}[{index}]: invalid value {item!r}")


def validate_component(errors: list[str], incident_id: str, index: int, component: Any) -> None:
    path = f"{incident_id}.affected_components[{index}]"
    if not isinstance(component, dict):
        errors.append(f"{path}: expected object")
        return
    for field in REQUIRED_COMPONENT_FIELDS:
        if field not in component:
            errors.append(f"{path}.{field}: missing required field")
    if "ecosystem" in component:
        require_string(errors, f"{path}.ecosystem", component.get("ecosystem"))
    if "name" in component:
        require_string(errors, f"{path}.name", component.get("name"))
    if "vendor" in component:
        require_string(errors, f"{path}.vendor", component.get("vendor"))
    if component.get("component_type") not in VALID_COMPONENT_TYPES:
        errors.append(f"{path}.component_type: invalid value {component.get('component_type')!r}")
    package_url = component.get("package_url")
    if component.get("component_type") == "package" and package_url is None:
        errors.append(f"{path}.package_url: expected canonical package URL for package component")
    if package_url is not None:
        if not isinstance(package_url, str):
            errors.append(f"{path}.package_url: expected canonical package URL")
            return
        try:
            canonical = canonicalize_purl(package_url, ecosystem=component.get("ecosystem"), package_name=component.get("name"))
        except PurlError as exc:
            errors.append(f"{path}.package_url: invalid canonical package URL: {exc}")
        else:
            if package_url != canonical:
                errors.append(f"{path}.package_url: expected canonical package URL {canonical!r}")
            if parse_purl(canonical).type == "generic":
                require_string(errors, f"{path}.purl_justification", component.get("purl_justification"), min_length=20)


def validate_release(
    errors: list[str],
    incident_id: str,
    index: int,
    release: Any,
    valid_reference_ids: set[str],
    package_components: set[tuple[str, str]],
) -> None:
    path = f"{incident_id}.releases[{index}]"
    if not isinstance(release, dict):
        errors.append(f"{path}: expected object")
        return
    for field in REQUIRED_RELEASE_FIELDS:
        if field not in release:
            errors.append(f"{path}.{field}: missing required field")

    for field in ["package_name", "ecosystem", "purl", "version"]:
        if field in release:
            require_string(errors, f"{path}.{field}", release.get(field))

    if "published_at" in release and parse_date(release.get("published_at")) is None:
        errors.append(f"{path}.published_at: expected YYYY-MM-DD date")
    if "disclosed_at" in release and release.get("disclosed_at") is not None and parse_date(release.get("disclosed_at")) is None:
        errors.append(f"{path}.disclosed_at: expected YYYY-MM-DD date or null")
    if "malicious_range" in release and release.get("malicious_range") is not None:
        require_string(errors, f"{path}.malicious_range", release.get("malicious_range"))

    if "references" in release:
        validate_reference_id_list(errors, incident_id, f"{path}.references", release.get("references"), valid_reference_ids)

    package_name = release.get("package_name")
    ecosystem = release.get("ecosystem")
    purl = release.get("purl")
    version = release.get("version")
    release_identity_fields_are_strings = isinstance(package_name, str) and isinstance(ecosystem, str)
    if release_identity_fields_are_strings:
        if (ecosystem, package_name) not in package_components:
            errors.append(f"{path}: release package must match an affected package component")
    if isinstance(purl, str) and release_identity_fields_are_strings:
        try:
            canonical = canonicalize_purl(purl, ecosystem=ecosystem, package_name=package_name)
        except PurlError as exc:
            errors.append(f"{path}.purl: invalid canonical release PURL: {exc}")
        else:
            parsed = parse_purl(canonical)
            if purl != canonical:
                errors.append(f"{path}.purl: expected canonical release PURL {canonical!r}")
            if not parsed.version:
                errors.append(f"{path}.purl: expected versioned package URL")
            elif isinstance(version, str) and parsed.version != version:
                errors.append(f"{path}.version: does not match PURL version {parsed.version!r}")
            if parsed.type == "generic":
                errors.append(f"{path}.purl: generic release PURLs are not joinable")


def validate_reference(errors: list[str], incident_id: str, index: int, reference: Any) -> None:
    path = f"{incident_id}.references[{index}]"
    if not isinstance(reference, dict):
        errors.append(f"{path}: expected object")
        return
    for field in REQUIRED_REFERENCE_FIELDS:
        if field not in reference:
            errors.append(f"{path}.{field}: missing required field")
    if "id" in reference:
        if not isinstance(reference["id"], str) or not REFERENCE_ID_PATTERN.match(reference["id"]):
            errors.append(f"{path}.id: expected ref-* identifier")
    if "title" in reference:
        require_string(errors, f"{path}.title", reference.get("title"))
    if "publisher" in reference:
        require_string(errors, f"{path}.publisher", reference.get("publisher"))
    if "url" in reference and not is_valid_url(reference.get("url")):
        errors.append(f"{path}.url: expected http(s) URL")
    if "published_at" in reference and parse_date(reference.get("published_at")) is None:
        errors.append(f"{path}.published_at: expected YYYY-MM-DD date")


def reference_ids_for(incident: dict[str, Any]) -> set[str]:
    refs = incident.get("references")
    if not isinstance(refs, list):
        return set()
    return {ref["id"] for ref in refs if isinstance(ref, dict) and isinstance(ref.get("id"), str)}


def validate_reference_id_list(
    errors: list[str],
    incident_id: str,
    path: str,
    value: Any,
    valid_reference_ids: set[str],
) -> None:
    if not isinstance(value, list) or not value:
        errors.append(f"{path}: expected non-empty reference ID list")
        return
    for index, ref_id in enumerate(value):
        if not isinstance(ref_id, str) or not ref_id.strip():
            errors.append(f"{path}[{index}]: expected non-empty reference ID")
        elif ref_id not in valid_reference_ids:
            errors.append(f"{path}[{index}]: unknown reference ID {ref_id!r}")


def validate_editorial_claim_items(
    errors: list[str],
    incident_id: str,
    field_name: str,
    value: Any,
    valid_reference_ids: set[str],
) -> None:
    if not isinstance(value, list) or not value:
        errors.append(f"{incident_id}.{field_name}: expected non-empty editorial item list")
        return
    for index, item in enumerate(value):
        path = f"{incident_id}.{field_name}[{index}]"
        if not isinstance(item, dict):
            errors.append(f"{path}: expected object")
            continue
        for field in REQUIRED_EDITORIAL_ITEM_FIELDS:
            if field not in item:
                errors.append(f"{path}.{field}: missing required field")
        require_string(errors, f"{path}.text", item.get("text"), min_length=20)
        validate_reference_id_list(errors, incident_id, f"{path}.reference_ids", item.get("reference_ids"), valid_reference_ids)


def validate_editorial_timeline(
    errors: list[str],
    incident_id: str,
    value: Any,
    valid_reference_ids: set[str],
) -> None:
    if not isinstance(value, list) or not value:
        errors.append(f"{incident_id}.timeline: expected non-empty timeline list")
        return
    for index, item in enumerate(value):
        path = f"{incident_id}.timeline[{index}]"
        if not isinstance(item, dict):
            errors.append(f"{path}: expected object")
            continue
        for field in REQUIRED_TIMELINE_FIELDS:
            if field not in item:
                errors.append(f"{path}.{field}: missing required field")
        if not parse_date_or_range(item.get("date")):
            errors.append(f"{path}.date: expected YYYY-MM-DD date or YYYY-MM-DD/YYYY-MM-DD range")
        require_string(errors, f"{path}.title", item.get("title"), min_length=4)
        require_string(errors, f"{path}.text", item.get("text"), min_length=20)
        validate_reference_id_list(errors, incident_id, f"{path}.reference_ids", item.get("reference_ids"), valid_reference_ids)


def validate_editorial_attack_chain(
    errors: list[str],
    incident_id: str,
    value: Any,
    valid_reference_ids: set[str],
) -> None:
    if not isinstance(value, list) or not value:
        errors.append(f"{incident_id}.attack_chain: expected non-empty attack-chain list")
        return
    for index, item in enumerate(value):
        path = f"{incident_id}.attack_chain[{index}]"
        if not isinstance(item, dict):
            errors.append(f"{path}: expected object")
            continue
        for field in REQUIRED_ATTACK_CHAIN_FIELDS:
            if field not in item:
                errors.append(f"{path}.{field}: missing required field")
        require_string(errors, f"{path}.stage", item.get("stage"), min_length=4)
        require_string(errors, f"{path}.text", item.get("text"), min_length=20)
        validate_reference_id_list(errors, incident_id, f"{path}.reference_ids", item.get("reference_ids"), valid_reference_ids)


def validate_editorial_fields(errors: list[str], incident: dict[str, Any]) -> None:
    incident_id = incident.get("id") if isinstance(incident.get("id"), str) else "<missing-id>"
    is_featured = incident_id in FEATURED_INCIDENT_IDS
    present_fields = [field for field in EDITORIAL_FIELDS if field in incident]
    if not is_featured and not present_fields:
        return
    if not is_featured and present_fields:
        errors.append(f"{incident_id}: editorial fields are reserved for featured incidents in Phase 1F")
        return

    for field in EDITORIAL_FIELDS:
        if field not in incident:
            errors.append(f"{incident_id}.{field}: missing required featured editorial field")

    valid_reference_ids = reference_ids_for(incident)
    if not valid_reference_ids:
        errors.append(f"{incident_id}.references: featured editorial incidents require reference IDs")

    for field in EDITORIAL_CLAIM_FIELDS:
        if field in incident:
            validate_editorial_claim_items(errors, incident_id, field, incident[field], valid_reference_ids)
    if "timeline" in incident:
        validate_editorial_timeline(errors, incident_id, incident["timeline"], valid_reference_ids)
    if "attack_chain" in incident:
        validate_editorial_attack_chain(errors, incident_id, incident["attack_chain"], valid_reference_ids)


def validate_maintainer(errors: list[str], incident_id: str, index: int, maintainer: Any) -> None:
    path = f"{incident_id}.maintainers[{index}]"
    if not isinstance(maintainer, dict):
        errors.append(f"{path}: expected object")
        return
    required_fields = [
        "name",
        "aliases",
        "id_slug",
        "onboarding_date",
        "first_publish_date",
        "repositories",
        "account_ids",
    ]
    for field in required_fields:
        if field not in maintainer:
            errors.append(f"{path}.{field}: missing required field")
    if "name" in maintainer:
        require_string(errors, f"{path}.name", maintainer.get("name"))
    if "id_slug" in maintainer:
        require_string(errors, f"{path}.id_slug", maintainer.get("id_slug"))
    if "aliases" in maintainer:
        aliases = maintainer.get("aliases")
        if not isinstance(aliases, list):
            errors.append(f"{path}.aliases: expected list")
        else:
            for alias_index, alias in enumerate(aliases):
                if not isinstance(alias, str) or not alias.strip():
                    errors.append(f"{path}.aliases[{alias_index}]: expected non-empty string")
    for field in ["onboarding_date", "first_publish_date"]:
        if field in maintainer and maintainer.get(field) is not None and parse_date(maintainer.get(field)) is None:
            errors.append(f"{path}.{field}: expected YYYY-MM-DD date or null")
    if "repositories" in maintainer:
        require_string_list(errors, f"{path}.repositories", maintainer.get("repositories"), allow_empty=True)
        if isinstance(maintainer.get("repositories"), list):
            for repo_index, repo_id in enumerate(maintainer["repositories"]):
                if isinstance(repo_id, str) and not repo_id.startswith("repo-"):
                    errors.append(f"{path}.repositories[{repo_index}]: expected repo-* entity id")
    if "account_ids" in maintainer:
        require_string_list(errors, f"{path}.account_ids", maintainer.get("account_ids"), allow_empty=True)
        if isinstance(maintainer.get("account_ids"), list):
            for account_index, account_id in enumerate(maintainer["account_ids"]):
                if isinstance(account_id, str) and not account_id.startswith("account-"):
                    errors.append(f"{path}.account_ids[{account_index}]: expected account-* entity id")


def validate_repository(errors: list[str], incident_id: str, index: int, repository: Any) -> None:
    path = f"{incident_id}.repositories[{index}]"
    if not isinstance(repository, dict):
        errors.append(f"{path}: expected object")
        return
    for field in REQUIRED_REPOSITORY_FIELDS:
        if field not in repository:
            errors.append(f"{path}.{field}: missing required field")
        elif field != "url":
            require_string(errors, f"{path}.{field}", repository[field])
    if "url" in repository and not is_valid_url(repository["url"]):
        errors.append(f"{path}.url: expected http(s) URL")


def validate_named_fields(
    errors: list[str],
    incident_id: str,
    field_name: str,
    required_fields: list[str],
    records: Any,
) -> None:
    if not isinstance(records, list):
        errors.append(f"{incident_id}.{field_name}: expected list")
        return
    for index, record in enumerate(records):
        path = f"{incident_id}.{field_name}[{index}]"
        if not isinstance(record, dict):
            errors.append(f"{path}: expected object")
            continue
        for field in required_fields:
            if field not in record:
                errors.append(f"{path}.{field}: missing required field")
            else:
                require_string(errors, f"{path}.{field}", record[field])


def validate_attribution_link(
    errors: list[str],
    incident_id: str,
    field_name: str,
    required_fields: list[str],
    record: Any,
    index: int,
    valid_reference_ids: set[str],
) -> tuple[str, str] | None:
    path = f"{incident_id}.{field_name}[{index}]"
    if not isinstance(record, dict):
        errors.append(f"{path}: expected object")
        return None
    for field in required_fields:
        if field not in record:
            errors.append(f"{path}.{field}: missing required field")
    if "id" in record:
        require_string(errors, f"{path}.id", record.get("id"))
    if "name" in record:
        require_string(errors, f"{path}.name", record.get("name"))
    if "confidence" in record and record.get("confidence") not in VALID_ATTRIBUTION_CONFIDENCE:
        errors.append(f"{path}.confidence: invalid value {record.get('confidence')!r}")
    if "source_refs" in record:
        validate_reference_id_list(errors, incident_id, f"{path}.source_refs", record.get("source_refs"), valid_reference_ids)
    if field_name == "threat_actors":
        if "actor_type" in record and record.get("actor_type") not in VALID_ACTOR_TYPES:
            errors.append(f"{path}.actor_type: invalid value {record.get('actor_type')!r}")
        if isinstance(record.get("id"), str) and not record["id"].startswith("actor-"):
            errors.append(f"{path}.id: expected actor-* identifier")
        entity_refs = record.get("entity_refs", [])
        if not isinstance(entity_refs, list):
            errors.append(f"{path}.entity_refs: expected list")
        else:
            for entity_index, entity_ref in enumerate(entity_refs):
                if not isinstance(entity_ref, str) or not entity_ref.strip():
                    errors.append(f"{path}.entity_refs[{entity_index}]: expected non-empty string")
                elif not (entity_ref.startswith("maintainer-") or entity_ref.startswith("incident-")):
                    errors.append(f"{path}.entity_refs[{entity_index}]: expected maintainer-* or incident-* identifier")
        return ("ATTRIBUTED_TO_ACTOR", record.get("id")) if isinstance(record.get("id"), str) else None
    if field_name == "campaigns":
        if "campaign_id" in record:
            require_string(errors, f"{path}.campaign_id", record.get("campaign_id"))
        if "slug" in record:
            require_string(errors, f"{path}.slug", record.get("slug"))
        if isinstance(record.get("id"), str) and not record["id"].startswith("campaign-"):
            errors.append(f"{path}.id: expected campaign-* identifier")
        return ("RELATED_CAMPAIGN", record.get("id")) if isinstance(record.get("id"), str) else None
    return None


def validate_attribution_fields(errors: list[str], incident: dict[str, Any]) -> None:
    incident_id = incident.get("id") if isinstance(incident.get("id"), str) else "<missing-id>"
    valid_reference_ids = reference_ids_for(incident)
    expected_evidence: set[tuple[str, str]] = set()

    if "attribution_confidence" in incident and incident.get("attribution_confidence") not in VALID_ATTRIBUTION_CONFIDENCE:
        errors.append(f"{incident_id}.attribution_confidence: invalid value {incident.get('attribution_confidence')!r}")

    for field_name, required_fields in (
        ("threat_actors", REQUIRED_THREAT_ACTOR_FIELDS),
        ("campaigns", REQUIRED_CAMPAIGN_FIELDS),
    ):
        records = incident.get(field_name, [])
        if not isinstance(records, list):
            errors.append(f"{incident_id}.{field_name}: expected list")
            continue
        for index, record in enumerate(records):
            expected = validate_attribution_link(
                errors,
                incident_id,
                field_name,
                required_fields,
                record,
                index,
                valid_reference_ids,
            )
            if expected:
                expected_evidence.add(expected)

    if expected_evidence and "attribution_confidence" not in incident:
        errors.append(f"{incident_id}.attribution_confidence: required when threat_actors or campaigns are present")

    attribution_evidence = incident.get("attribution_evidence", [])
    if not isinstance(attribution_evidence, list):
        errors.append(f"{incident_id}.attribution_evidence: expected list")
        attribution_evidence = []
    seen_evidence: set[tuple[str, str]] = set()
    for index, record in enumerate(attribution_evidence):
        path = f"{incident_id}.attribution_evidence[{index}]"
        if not isinstance(record, dict):
            errors.append(f"{path}: expected object")
            continue
        for field in REQUIRED_ATTRIBUTION_EVIDENCE_FIELDS:
            if field not in record:
                errors.append(f"{path}.{field}: missing required field")
        if "target" in record:
            require_string(errors, f"{path}.target", record.get("target"))
        if "summary" in record:
            require_string(errors, f"{path}.summary", record.get("summary"), min_length=20)
        if "relationship_type" in record:
            relationship_type = record.get("relationship_type")
            if relationship_type not in VALID_ATTRIBUTION_RELATIONSHIPS:
                errors.append(f"{path}.relationship_type: invalid value {relationship_type!r}")
        if "source_refs" in record:
            validate_reference_id_list(errors, incident_id, f"{path}.source_refs", record.get("source_refs"), valid_reference_ids)
        if isinstance(record.get("target"), str) and isinstance(record.get("relationship_type"), str):
            seen_evidence.add((record["relationship_type"], record["target"]))

    for relationship_type, target in sorted(expected_evidence - seen_evidence):
        errors.append(f"{incident_id}.attribution_evidence: missing {relationship_type} evidence for {target}")
    for relationship_type, target in sorted(seen_evidence - expected_evidence):
        errors.append(f"{incident_id}.attribution_evidence: unexpected {relationship_type} evidence for {target} without matching link")


def validate_propagation_edges(errors: list[str], incident: dict[str, Any]) -> None:
    incident_id = incident.get("id") if isinstance(incident.get("id"), str) else "<missing-id>"
    valid_reference_ids = reference_ids_for(incident)
    edges = incident.get("propagation_edges", [])
    if not isinstance(edges, list):
        errors.append(f"{incident_id}.propagation_edges: expected list")
        return
    for index, edge in enumerate(edges):
        path = f"{incident_id}.propagation_edges[{index}]"
        if not isinstance(edge, dict):
            errors.append(f"{path}: expected object")
            continue
        for field in ["source", "target", "tier", "evidence_refs"]:
            if field not in edge:
                errors.append(f"{path}.{field}: missing required field")
        for field in ["source", "target"]:
            if field in edge:
                value = edge.get(field)
                if not isinstance(value, str) or not PROPAGATION_ENDPOINT_PATTERN.fullmatch(value):
                    errors.append(f"{path}.{field}: expected pkg-* or release-* entity id")
        if isinstance(edge.get("source"), str) and edge.get("source") == edge.get("target"):
            errors.append(f"{path}: source and target must differ")
        if "tier" in edge and edge.get("tier") not in VALID_PROPAGATION_TIERS:
            errors.append(f"{path}.tier: invalid value {edge.get('tier')!r}")
        if "evidence_refs" in edge:
            validate_reference_id_list(errors, incident_id, f"{path}.evidence_refs", edge.get("evidence_refs"), valid_reference_ids)
        if "notes" in edge:
            require_string(errors, f"{path}.notes", edge.get("notes"), min_length=20)


def validate_incident(incident: Any) -> list[str]:
    errors: list[str] = []
    if not isinstance(incident, dict):
        return ["incident: expected object"]

    incident_id = incident.get("id") if isinstance(incident.get("id"), str) else "<missing-id>"
    for field in REQUIRED_FIELDS:
        if field not in incident:
            errors.append(f"{incident_id}.{field}: missing required field")

    if incident.get("schema_version") != SCHEMA_VERSION:
        errors.append(f"{incident_id}.schema_version: expected {SCHEMA_VERSION!r}")
    if not isinstance(incident.get("id"), str) or not ID_PATTERN.match(incident["id"]):
        errors.append(f"{incident_id}.id: expected SC-YYYY-SLUG identifier")
    if "title" in incident:
        require_string(errors, f"{incident_id}.title", incident.get("title"), min_length=8)
    if "summary" in incident:
        require_string(errors, f"{incident_id}.summary", incident.get("summary"), min_length=40)
    if incident.get("status") not in VALID_STATUS:
        errors.append(f"{incident_id}.status: invalid value {incident.get('status')!r}")
    if incident.get("confidence") not in VALID_CONFIDENCE:
        errors.append(f"{incident_id}.confidence: invalid value {incident.get('confidence')!r}")
    if incident.get("evidence_level") not in VALID_EVIDENCE_LEVELS:
        errors.append(f"{incident_id}.evidence_level: invalid value {incident.get('evidence_level')!r}")
    if incident.get("attack_stage") not in VALID_ATTACK_STAGES:
        errors.append(f"{incident_id}.attack_stage: invalid value {incident.get('attack_stage')!r}")
    if incident.get("source_artifact_divergence") is not None and not isinstance(incident.get("source_artifact_divergence"), bool):
        errors.append(f"{incident_id}.source_artifact_divergence: expected boolean or null")
    distribution_channels = incident.get("distribution_channels")
    if incident.get("source_artifact_divergence") is True and (
        not isinstance(distribution_channels, list) or not distribution_channels
    ):
        errors.append(f"{incident_id}.source_artifact_divergence: cannot be true when distribution_channels is empty")
    if "notes" in incident:
        require_string(errors, f"{incident_id}.notes", incident.get("notes"), min_length=8)

    first_observed_at = parse_date(incident.get("first_observed_at"))
    disclosed_at = parse_date(incident.get("disclosed_at"))
    if first_observed_at is None:
        errors.append(f"{incident_id}.first_observed_at: expected YYYY-MM-DD date")
    if disclosed_at is None:
        errors.append(f"{incident_id}.disclosed_at: expected YYYY-MM-DD date")
    if first_observed_at and disclosed_at and disclosed_at < first_observed_at:
        errors.append(f"{incident_id}.disclosed_at: cannot be before first_observed_at")
    if "first_public_warning_at" in incident and incident.get("first_public_warning_at") is not None:
        first_public_warning_at = parse_date(incident.get("first_public_warning_at"))
        if first_public_warning_at is None:
            errors.append(f"{incident_id}.first_public_warning_at: expected YYYY-MM-DD date or null")
        elif first_observed_at and first_public_warning_at < first_observed_at:
            errors.append(f"{incident_id}.first_public_warning_at: cannot be before first_observed_at")

    require_string_list(errors, f"{incident_id}.affected_ecosystems", incident.get("affected_ecosystems"))
    require_enum_list(errors, f"{incident_id}.supply_chain_vectors", incident.get("supply_chain_vectors"), VALID_VECTORS)
    require_enum_list(errors, f"{incident_id}.impact_categories", incident.get("impact_categories"), VALID_IMPACTS)
    require_string_list(errors, f"{incident_id}.tags", incident.get("tags"), allow_empty=True)

    components = incident.get("affected_components")
    if not isinstance(components, list) or not components:
        errors.append(f"{incident_id}.affected_components: expected non-empty list")
    else:
        for index, component in enumerate(components):
            validate_component(errors, incident_id, index, component)

    references = incident.get("references")
    if not isinstance(references, list) or not references:
        errors.append(f"{incident_id}.references: expected non-empty list")
    else:
        for index, reference in enumerate(references):
            validate_reference(errors, incident_id, index, reference)
    valid_reference_ids = reference_ids_for(incident)

    releases = incident.get("releases", [])
    package_components = {
        (component.get("ecosystem"), component.get("name"))
        for component in (components if isinstance(components, list) else [])
        if isinstance(component, dict) and component.get("component_type") == "package"
    }
    if not isinstance(releases, list):
        errors.append(f"{incident_id}.releases: expected list")
    else:
        for index, release in enumerate(releases):
            validate_release(errors, incident_id, index, release, valid_reference_ids, package_components)

    maintainers = incident.get("maintainers")
    if not isinstance(maintainers, list):
        errors.append(f"{incident_id}.maintainers: expected list")
    else:
        for index, maintainer in enumerate(maintainers):
            validate_maintainer(errors, incident_id, index, maintainer)

    repositories = incident.get("repositories")
    if not isinstance(repositories, list):
        errors.append(f"{incident_id}.repositories: expected list")
    else:
        for index, repository in enumerate(repositories):
            validate_repository(errors, incident_id, index, repository)

    validate_named_fields(errors, incident_id, "build_systems", REQUIRED_BUILD_SYSTEM_FIELDS, incident.get("build_systems"))
    validate_named_fields(
        errors,
        incident_id,
        "distribution_channels",
        REQUIRED_DISTRIBUTION_CHANNEL_FIELDS,
        incident.get("distribution_channels"),
    )
    validate_named_fields(
        errors,
        incident_id,
        "compromised_accounts",
        REQUIRED_COMPROMISED_ACCOUNT_FIELDS,
        incident.get("compromised_accounts"),
    )
    validate_attribution_fields(errors, incident)
    validate_propagation_edges(errors, incident)
    validate_editorial_fields(errors, incident)

    return errors


def validate_corpus(corpus: Any) -> list[str]:
    errors: list[str] = []
    if not isinstance(corpus, list):
        return ["corpus: expected top-level array"]
    if len(corpus) < 25:
        errors.append(f"corpus: expected at least 25 incidents, found {len(corpus)}")

    seen_ids: set[str] = set()
    for index, incident in enumerate(corpus):
        incident_errors = validate_incident(incident)
        errors.extend(incident_errors)
        if isinstance(incident, dict):
            incident_id = incident.get("id")
            if isinstance(incident_id, str):
                if incident_id in seen_ids:
                    errors.append(f"{incident_id}: duplicate id")
                seen_ids.add(incident_id)
            else:
                errors.append(f"corpus[{index}].id: missing valid id")
    return errors


def validate_schema_file(schema: Any) -> list[str]:
    errors: list[str] = []
    if not isinstance(schema, dict):
        return ["schema: expected object"]
    properties = schema.get("properties")
    if not isinstance(properties, dict):
        return ["schema.properties: expected object"]
    schema_version = properties.get("schema_version")
    if not isinstance(schema_version, dict):
        errors.append("schema.properties.schema_version: expected object")
        return errors
    if schema_version.get("const") != SCHEMA_VERSION:
        errors.append("schema.schema_version.const: does not match validator schema version")
    required = schema.get("required")
    if not isinstance(required, list) or set(required) != set(REQUIRED_FIELDS):
        errors.append("schema.required: does not match validator required fields")
    defs = schema.get("$defs")
    affected_component = defs.get("affected_component") if isinstance(defs, dict) else None
    if not isinstance(affected_component, dict):
        errors.append("schema.$defs.affected_component: expected object")
        return errors
    component_properties = affected_component.get("properties")
    if not isinstance(component_properties, dict):
        errors.append("schema.$defs.affected_component.properties: expected object")
        return errors
    purl_justification = component_properties.get("purl_justification")
    if not isinstance(purl_justification, dict) or purl_justification.get("minLength") != 20:
        errors.append("schema.$defs.affected_component.properties.purl_justification.minLength: expected 20")
    generic_if = affected_component.get("if")
    generic_then = affected_component.get("then")
    generic_pattern = None
    generic_required = None
    if isinstance(generic_if, dict):
        generic_required = generic_if.get("required")
        if_properties = generic_if.get("properties")
        if isinstance(if_properties, dict):
            package_url = if_properties.get("package_url")
            if isinstance(package_url, dict):
                generic_pattern = package_url.get("pattern")
    if generic_pattern != "^pkg:generic/" or generic_required != ["package_url"]:
        errors.append("schema.$defs.affected_component.if: must match generic package URLs")
    if not isinstance(generic_then, dict) or generic_then.get("required") != ["purl_justification"]:
        errors.append("schema.$defs.affected_component.then: must require purl_justification")
    for def_name in ["attribution_confidence", "threat_actor_link", "campaign_link", "attribution_evidence", "propagation_edge"]:
        if def_name not in defs:
            errors.append(f"schema.$defs.{def_name}: missing required Phase 2B definition")
    attribution_confidence = defs.get("attribution_confidence") if isinstance(defs, dict) else None
    if not isinstance(attribution_confidence, dict) or set(attribution_confidence.get("enum", [])) != VALID_ATTRIBUTION_CONFIDENCE:
        errors.append("schema.$defs.attribution_confidence.enum: does not match validator")
    propagation_edge = defs.get("propagation_edge") if isinstance(defs, dict) else None
    if not isinstance(propagation_edge, dict):
        errors.append("schema.$defs.propagation_edge: expected object")
    else:
        required_fields = propagation_edge.get("required")
        if not isinstance(required_fields, list) or set(required_fields) != {"source", "target", "tier", "evidence_refs"}:
            errors.append("schema.$defs.propagation_edge.required: does not match validator")
        propagation_properties = propagation_edge.get("properties")
        tier = propagation_properties.get("tier") if isinstance(propagation_properties, dict) else None
        tier_enum = tier.get("enum") if isinstance(tier, dict) else None
        if not isinstance(tier_enum, list) or set(tier_enum) != VALID_PROPAGATION_TIERS:
            errors.append("schema.$defs.propagation_edge.properties.tier.enum: does not match validator")
    return errors


def main(argv: list[str] | None = None) -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--corpus", type=Path, default=DEFAULT_CORPUS_PATH)
    parser.add_argument("--schema", type=Path, default=DEFAULT_SCHEMA_PATH)
    args = parser.parse_args(argv)

    errors: list[str] = []
    try:
        corpus = load_json(args.corpus)
        schema = load_json(args.schema)
    except (OSError, json.JSONDecodeError) as exc:
        print(f"failed to load supply-chain incident inputs: {exc}", file=sys.stderr)
        return 2

    errors.extend(validate_schema_file(schema))
    errors.extend(validate_corpus(corpus))

    if errors:
        print("Supply-chain incident validation failed:", file=sys.stderr)
        for error in errors:
            print(f"- {error}", file=sys.stderr)
        return 1

    print(f"Validated {len(corpus)} supply-chain incidents from {args.corpus}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
