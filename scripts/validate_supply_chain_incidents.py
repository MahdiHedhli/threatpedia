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


REPO_ROOT = Path(__file__).resolve().parents[1]
DEFAULT_CORPUS_PATH = REPO_ROOT / "data" / "supply-chain-incidents" / "incidents.json"
DEFAULT_SCHEMA_PATH = REPO_ROOT / "data" / "supply-chain-incidents" / "schema.json"
SCHEMA_VERSION = "supply-chain-incident/1"
ID_PATTERN = re.compile(r"^SC-[0-9]{4}-[A-Z0-9-]+$")
FULL_DATE_PATTERN = re.compile(r"^\d{4}-\d{2}-\d{2}$")
PURL_PATTERN = re.compile(r"^pkg:[a-z0-9.+-]+/[^\s]+$")

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
]

REQUIRED_COMPONENT_FIELDS = ["component_type", "ecosystem", "name", "vendor"]
REQUIRED_REFERENCE_FIELDS = ["title", "publisher", "url", "published_at"]
VALID_STATUS = {"confirmed"}
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


def load_json(path: Path) -> Any:
    with path.open("r", encoding="utf-8") as handle:
        return json.load(handle)


def parse_date(value: Any) -> date | None:
    if not isinstance(value, str) or not FULL_DATE_PATTERN.fullmatch(value):
        return None
    try:
        return date.fromisoformat(value)
    except ValueError:
        return None


def is_valid_url(value: Any) -> bool:
    if not isinstance(value, str) or any(char.isspace() for char in value):
        return False
    try:
        parsed = urlparse(value)
        parsed.port
        return parsed.scheme in {"http", "https"} and bool(parsed.netloc)
    except ValueError:
        return False


def require_string(errors: list[str], path: str, value: Any, *, min_length: int = 1) -> None:
    if not isinstance(value, str) or len(value.strip()) < min_length:
        errors.append(f"{path}: expected non-empty string")


def require_string_list(errors: list[str], path: str, value: Any) -> None:
    if not isinstance(value, list) or not value:
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
        if isinstance(item, str) and item not in allowed:
            errors.append(f"{path}[{index}]: invalid value {item!r}")


def validate_component(errors: list[str], incident_id: str, index: int, component: Any) -> None:
    path = f"{incident_id}.affected_components[{index}]"
    if not isinstance(component, dict):
        errors.append(f"{path}: expected object")
        return
    for field in REQUIRED_COMPONENT_FIELDS:
        if field not in component:
            errors.append(f"{path}.{field}: missing required field")
    require_string(errors, f"{path}.ecosystem", component.get("ecosystem"))
    require_string(errors, f"{path}.name", component.get("name"))
    require_string(errors, f"{path}.vendor", component.get("vendor"))
    if component.get("component_type") not in VALID_COMPONENT_TYPES:
        errors.append(f"{path}.component_type: invalid value {component.get('component_type')!r}")
    package_url = component.get("package_url")
    if package_url is not None and not (isinstance(package_url, str) and PURL_PATTERN.fullmatch(package_url)):
        errors.append(f"{path}.package_url: expected null or package URL")


def validate_reference(errors: list[str], incident_id: str, index: int, reference: Any) -> None:
    path = f"{incident_id}.references[{index}]"
    if not isinstance(reference, dict):
        errors.append(f"{path}: expected object")
        return
    for field in REQUIRED_REFERENCE_FIELDS:
        if field not in reference:
            errors.append(f"{path}.{field}: missing required field")
    require_string(errors, f"{path}.title", reference.get("title"))
    require_string(errors, f"{path}.publisher", reference.get("publisher"))
    if not is_valid_url(reference.get("url")):
        errors.append(f"{path}.url: expected http(s) URL")
    if parse_date(reference.get("published_at")) is None:
        errors.append(f"{path}.published_at: expected YYYY-MM-DD date")


def validate_incident(incident: Any) -> list[str]:
    errors: list[str] = []
    if not isinstance(incident, dict):
        return ["incident: expected object"]

    raw_id = incident.get("id")
    incident_id = raw_id if isinstance(raw_id, str) else "<missing-id>"
    for field in REQUIRED_FIELDS:
        if field not in incident:
            errors.append(f"{incident_id}.{field}: missing required field")

    if "schema_version" in incident and incident.get("schema_version") != SCHEMA_VERSION:
        errors.append(f"{incident_id}.schema_version: expected {SCHEMA_VERSION!r}")
    if "id" in incident:
        if not isinstance(raw_id, str) or not ID_PATTERN.match(raw_id):
            errors.append(f"{incident_id}.id: expected SC-YYYY-SLUG identifier")
    if "title" in incident:
        require_string(errors, f"{incident_id}.title", incident.get("title"), min_length=8)
    if "summary" in incident:
        require_string(errors, f"{incident_id}.summary", incident.get("summary"), min_length=40)
    if "status" in incident and incident.get("status") not in VALID_STATUS:
        errors.append(f"{incident_id}.status: invalid value {incident.get('status')!r}")

    first_observed_at = None
    if "first_observed_at" in incident:
        first_observed_at = parse_date(incident.get("first_observed_at"))
        if first_observed_at is None:
            errors.append(f"{incident_id}.first_observed_at: expected YYYY-MM-DD date")
    disclosed_at = None
    if "disclosed_at" in incident:
        disclosed_at = parse_date(incident.get("disclosed_at"))
        if disclosed_at is None:
            errors.append(f"{incident_id}.disclosed_at: expected YYYY-MM-DD date")
    if first_observed_at and disclosed_at and disclosed_at < first_observed_at:
        errors.append(f"{incident_id}.disclosed_at: cannot be before first_observed_at")

    if "affected_ecosystems" in incident:
        require_string_list(errors, f"{incident_id}.affected_ecosystems", incident.get("affected_ecosystems"))
    if "supply_chain_vectors" in incident:
        require_enum_list(errors, f"{incident_id}.supply_chain_vectors", incident.get("supply_chain_vectors"), VALID_VECTORS)
    if "impact_categories" in incident:
        require_enum_list(errors, f"{incident_id}.impact_categories", incident.get("impact_categories"), VALID_IMPACTS)
    if "tags" in incident:
        require_string_list(errors, f"{incident_id}.tags", incident.get("tags"))

    if "affected_components" in incident:
        components = incident.get("affected_components")
        if not isinstance(components, list) or not components:
            errors.append(f"{incident_id}.affected_components: expected non-empty list")
        else:
            for index, component in enumerate(components):
                validate_component(errors, incident_id, index, component)

    if "references" in incident:
        references = incident.get("references")
        if not isinstance(references, list) or not references:
            errors.append(f"{incident_id}.references: expected non-empty list")
        else:
            for index, reference in enumerate(references):
                validate_reference(errors, incident_id, index, reference)

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
    properties = schema.get("properties", {})
    if not isinstance(properties, dict):
        return ["schema.properties: expected object"]
    schema_version = properties.get("schema_version", {})
    if not isinstance(schema_version, dict):
        return ["schema.properties.schema_version: expected object"]
    if schema_version.get("const") != SCHEMA_VERSION:
        errors.append("schema.schema_version.const: does not match validator schema version")
    required = schema.get("required")
    if not isinstance(required, list) or set(required) != set(REQUIRED_FIELDS):
        errors.append("schema.required: does not match validator required fields")
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
