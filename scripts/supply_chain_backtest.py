#!/usr/bin/env python3
"""Replay stored supply-chain incident dates without scoring or inference."""

from __future__ import annotations

import argparse
from collections import Counter, defaultdict
from datetime import date, datetime, timedelta, timezone
import json
from pathlib import Path
from typing import Any


REPO_ROOT = Path(__file__).resolve().parents[1]
DEFAULT_CORPUS_PATH = REPO_ROOT / "data" / "supply-chain-incidents" / "incidents.json"
DEFAULT_ENTITY_DIR = REPO_ROOT / "data" / "supply-chain-entities"
DEFAULT_RELATIONSHIP_PATH = REPO_ROOT / "data" / "supply-chain-relationships" / "relationships.json"
DEFAULT_INCIDENT_IDS = (
    "SC-2024-XZ-UTILS",
    "SC-2018-NPM-EVENT-STREAM",
    "SC-2025-GO-BOLTDB-TYPOSQUAT",
)
ENTITY_FILES = (
    "accounts.json",
    "actors.json",
    "build_systems.json",
    "campaigns.json",
    "distribution_channels.json",
    "maintainers.json",
    "organizations.json",
    "packages.json",
    "releases.json",
    "repositories.json",
)
SIGNAL_RELATIONSHIP_TYPES = {
    "ATTRIBUTED_TO_ACTOR": "actor",
    "RELATED_CAMPAIGN": "campaign",
    "AFFECTED_MAINTAINER": "maintainer",
    "COMPROMISED_ACCOUNT": "account",
    "AFFECTED_PACKAGE": "package",
    "INCIDENT_AFFECTED_RELEASE": "release",
}


def load_json(path: Path) -> Any:
    return json.loads(path.read_text(encoding="utf-8"))


def load_entities(entity_dir: Path) -> dict[str, dict[str, Any]]:
    entities: dict[str, dict[str, Any]] = {}
    for filename in ENTITY_FILES:
        path = entity_dir / filename
        if not path.exists():
            continue
        data = load_json(path)
        if not isinstance(data, list):
            continue
        for entity in data:
            if isinstance(entity, dict) and isinstance(entity.get("id"), str):
                entities[entity["id"]] = entity
    return entities


def error_report(message: str) -> dict[str, Any]:
    return {
        "status": "FAIL",
        "generated_at": datetime.now(timezone.utc).replace(microsecond=0).isoformat().replace("+00:00", "Z"),
        "model": "stored-fields-only",
        "non_goals": ["scoring", "risk_engine", "automated_attribution", "ai_inference"],
        "incident_ids": [],
        "missing_incident_ids": [],
        "input_errors": [message],
        "timelines": [],
    }


def parse_date(value: Any) -> date | None:
    if not isinstance(value, str) or not value.strip():
        return None
    try:
        return date.fromisoformat(value)
    except ValueError:
        return None


def iso(value: date | None) -> str | None:
    return value.isoformat() if value else None


def days_between(start: date | None, end: date | None) -> int | None:
    if start is None or end is None:
        return None
    return (end - start).days


def incident_node_id(incident_id: str) -> str:
    return f"incident-{incident_id}"


def raw_incident_id(node_id: str) -> str:
    return node_id.removeprefix("incident-")


def incident_availability_date(incident: dict[str, Any]) -> tuple[date | None, str | None]:
    first_warning = parse_date(incident.get("first_public_warning_at"))
    if first_warning:
        return first_warning, "first_public_warning_at"
    disclosure = parse_date(incident.get("disclosed_at"))
    if disclosure:
        return disclosure, "disclosed_at"
    return None, None


def incident_cutoff(incident: dict[str, Any]) -> date | None:
    disclosure = parse_date(incident.get("disclosed_at"))
    if not disclosure:
        return None
    return disclosure - timedelta(days=1)


def release_publish_dates(incident: dict[str, Any]) -> list[tuple[date, dict[str, Any]]]:
    releases = incident.get("releases")
    if not isinstance(releases, list):
        return []
    dated_releases = []
    for release in releases:
        if not isinstance(release, dict):
            continue
        published_at = parse_date(release.get("published_at"))
        if published_at:
            dated_releases.append((published_at, release))
    return sorted(dated_releases, key=lambda item: item[0])


def publish_anchor(dated_releases: list[tuple[date, dict[str, Any]]], incident: dict[str, Any]) -> tuple[date | None, str | None, list[str]]:
    releases = dated_releases
    if releases:
        return releases[0][0], "release.published_at", []

    first_observed = parse_date(incident.get("first_observed_at"))
    if first_observed:
        return (
            first_observed,
            "incident.first_observed_at",
            ["No release entity is modeled; using stored first_observed_at as the artifact availability anchor."],
        )

    return None, None, ["No stored release published_at or first_observed_at is available."]


def split_references_by_replay_date(
    incident: dict[str, Any],
    replay_date: date | None,
) -> tuple[list[str], list[str], list[str]]:
    available = []
    later = []
    undated = []
    references = incident.get("references")
    if not isinstance(references, list):
        return available, later, undated

    for index, reference in enumerate(references):
        if not isinstance(reference, dict):
            continue
        reference_id = reference.get("id")
        if isinstance(reference_id, str) and reference_id.strip():
            reference_id = reference_id.strip()
        else:
            url = reference.get("url")
            reference_id = url.strip() if isinstance(url, str) and url.strip() else f"references[{index}]"
        published_at = parse_date(reference.get("published_at"))
        if replay_date is None or published_at is None:
            undated.append(reference_id)
        elif published_at <= replay_date:
            available.append(reference_id)
        else:
            later.append(reference_id)
    return sorted(available), sorted(later), sorted(undated)


def build_timeline(incident: dict[str, Any]) -> dict[str, Any]:
    dated_releases = release_publish_dates(incident)
    publish_date, publish_source, notes = publish_anchor(dated_releases, incident)
    first_warning = parse_date(incident.get("first_public_warning_at"))
    disclosure = parse_date(incident.get("disclosed_at"))
    discovery_date = first_warning or disclosure
    latency_basis = "first_public_warning_at" if first_warning else "disclosed_at"
    available_refs, later_refs, undated_refs = split_references_by_replay_date(incident, discovery_date)

    available_release_purls = []
    later_release_purls = []
    undated_release_purls = []
    releases = []
    for published_at, release in dated_releases:
        purl = release.get("purl")
        if purl:
            if discovery_date is None or published_at is None:
                undated_release_purls.append(purl)
            elif published_at <= discovery_date:
                available_release_purls.append(purl)
            else:
                later_release_purls.append(purl)
        releases.append(
            {
                "purl": purl,
                "version": release.get("version"),
                "published_at": release.get("published_at"),
                "malicious_range": release.get("malicious_range"),
            }
        )

    return {
        "incident_id": incident.get("id"),
        "title": incident.get("title"),
        "publish_date": iso(publish_date),
        "publish_date_source": publish_source,
        "first_warning_signal_at": iso(first_warning),
        "public_disclosure_at": iso(disclosure),
        "discovery_latency_days": days_between(publish_date, discovery_date),
        "discovery_latency_basis": latency_basis if discovery_date else None,
        "available_at_the_time": {
            "as_of": iso(discovery_date),
            "reference_ids": available_refs,
            "release_purls": available_release_purls,
        },
        "later_discovered_evidence": {
            "reference_ids": later_refs,
            "release_purls": later_release_purls,
        },
        "undated_evidence": {
            "reference_ids": undated_refs,
            "release_purls": undated_release_purls,
        },
        "releases": releases,
        "notes": notes,
    }


def relationship_index(
    relationships: Any,
) -> tuple[dict[str, list[dict[str, Any]]], dict[str, list[dict[str, Any]]], list[str]]:
    errors = []
    by_source: dict[str, list[dict[str, Any]]] = defaultdict(list)
    seeded_by_incident: dict[str, list[dict[str, Any]]] = defaultdict(list)
    if relationships is None:
        return by_source, seeded_by_incident, errors
    if not isinstance(relationships, list):
        return by_source, seeded_by_incident, ["relationships: expected array"]
    for index, relationship in enumerate(relationships):
        if not isinstance(relationship, dict):
            errors.append(f"relationships[{index}]: expected object")
            continue
        source = relationship.get("source")
        if not isinstance(source, str) or not source.strip():
            errors.append(f"relationships[{index}].source: expected non-empty string")
            continue
        by_source[source].append(relationship)
        if relationship.get("type") == "SEEDED_BY" and isinstance(relationship.get("source_incident_id"), str):
            seeded_by_incident[relationship["source_incident_id"]].append(relationship)
    return by_source, seeded_by_incident, errors


def entity_label(entity_id: str, entities_by_id: dict[str, dict[str, Any]]) -> str:
    entity = entities_by_id.get(entity_id)
    if isinstance(entity, dict) and isinstance(entity.get("name"), str):
        return entity["name"]
    return entity_id


def reference_dates_by_id(incident: dict[str, Any]) -> dict[str, date]:
    dates = {}
    references = incident.get("references")
    if not isinstance(references, list):
        return dates
    for reference in references:
        if not isinstance(reference, dict):
            continue
        reference_id = reference.get("id")
        published_at = parse_date(reference.get("published_at"))
        if isinstance(reference_id, str) and published_at:
            dates[reference_id] = published_at
    return dates


def source_refs_for_entity_in_incident(entity_id: str, incident: dict[str, Any]) -> list[str]:
    refs = []
    for field in ("threat_actors", "campaigns"):
        values = incident.get(field)
        if not isinstance(values, list):
            continue
        for value in values:
            if not isinstance(value, dict) or value.get("id") != entity_id:
                continue
            source_refs = value.get("source_refs")
            if isinstance(source_refs, list):
                refs.extend(ref for ref in source_refs if isinstance(ref, str) and ref.strip())
    return refs


def evidence_date_for_refs(incident: dict[str, Any], reference_ids: list[str]) -> date | None:
    reference_dates = reference_dates_by_id(incident)
    dates = [reference_dates[reference_id] for reference_id in reference_ids if reference_id in reference_dates]
    return min(dates) if dates else None


def current_relationship_is_public(
    incident: dict[str, Any],
    relationship: dict[str, Any],
    target: str,
    cutoff: date,
) -> bool:
    evidence_refs = []
    raw_evidence_refs = relationship.get("evidence_refs")
    if isinstance(raw_evidence_refs, list):
        evidence_refs.extend(ref for ref in raw_evidence_refs if isinstance(ref, str) and ref.strip())
    evidence_refs.extend(source_refs_for_entity_in_incident(target, incident))
    if not evidence_refs:
        return False
    evidence_date = evidence_date_for_refs(incident, evidence_refs)
    return bool(evidence_date and evidence_date <= cutoff)


def prior_public_incidents_for_entity(
    entity: dict[str, Any],
    entity_id: str,
    current_incident_id: str,
    cutoff: date,
    incidents_by_id: dict[str, dict[str, Any]],
) -> tuple[date | None, str | None, list[str]]:
    signal_date = None
    signal_basis = None
    prior_incident_ids = []
    source_incident_ids = entity.get("source_incident_ids")
    if not isinstance(source_incident_ids, list):
        return None, None, []

    for source_incident_id in source_incident_ids:
        if not isinstance(source_incident_id, str) or source_incident_id == current_incident_id:
            continue
        incident = incidents_by_id.get(source_incident_id)
        if not incident:
            continue
        evidence_date = evidence_date_for_refs(incident, source_refs_for_entity_in_incident(entity_id, incident))
        if evidence_date:
            availability_date = evidence_date
            basis = "entity_source_refs.published_at"
        else:
            availability_date, basis = incident_availability_date(incident)
        if availability_date and availability_date <= cutoff:
            prior_incident_ids.append(source_incident_id)
            if signal_date is None or availability_date < signal_date:
                signal_date = availability_date
                signal_basis = f"prior_incident.{basis}"
    return signal_date, signal_basis, sorted(prior_incident_ids)


def maintainer_anchor_signal(entity: dict[str, Any], cutoff: date) -> tuple[date | None, str | None]:
    anchors = []
    for field in ("onboarding_date", "first_publish_date"):
        value = parse_date(entity.get(field))
        if value and value <= cutoff:
            anchors.append((value, field))
    if not anchors:
        return None, None
    return sorted(anchors, key=lambda item: item[0])[0]


def release_anchor_signal(entity: dict[str, Any], cutoff: date) -> tuple[date | None, str | None]:
    published_at = parse_date(entity.get("published_at"))
    if published_at and published_at <= cutoff:
        return published_at, "release.published_at"
    return None, None


def entity_prior_signal(
    *,
    entity_id: str,
    current_incident_id: str,
    cutoff: date,
    incidents_by_id: dict[str, dict[str, Any]],
    entities_by_id: dict[str, dict[str, Any]],
    category: str,
    basis_prefix: str,
) -> dict[str, Any] | None:
    entity = entities_by_id.get(entity_id)
    if not isinstance(entity, dict):
        return None

    signal_date, signal_basis, prior_incident_ids = prior_public_incidents_for_entity(
        entity,
        entity_id,
        current_incident_id,
        cutoff,
        incidents_by_id,
    )
    if signal_date is None and category == "maintainer":
        signal_date, signal_basis = maintainer_anchor_signal(entity, cutoff)
    if signal_date is None and category == "release":
        signal_date, signal_basis = release_anchor_signal(entity, cutoff)
    if signal_date is None:
        return None

    incident = incidents_by_id[current_incident_id]
    disclosure = parse_date(incident.get("disclosed_at"))
    return {
        "signal_type": category,
        "entity_id": entity_id,
        "entity_label": entity_label(entity_id, entities_by_id),
        "signal_date": iso(signal_date),
        "lead_time_days": days_between(signal_date, disclosure),
        "basis": f"{basis_prefix}.{signal_basis}" if signal_basis else basis_prefix,
        "prior_incident_ids": prior_incident_ids,
    }


def collect_prior_signals(
    incident: dict[str, Any],
    relationships_by_source: dict[str, list[dict[str, Any]]],
    seeded_by_incident: dict[str, list[dict[str, Any]]],
    incidents_by_id: dict[str, dict[str, Any]],
    entities_by_id: dict[str, dict[str, Any]],
) -> tuple[list[dict[str, Any]], list[str]]:
    incident_id = incident.get("id")
    if not isinstance(incident_id, str):
        return [], ["incident missing string id"]
    cutoff = incident_cutoff(incident)
    if cutoff is None:
        return [], ["missing disclosed_at; prior-signal replay skipped"]

    signals = []
    notes = []
    seen = set()
    for relationship in relationships_by_source.get(incident_node_id(incident_id), []):
        relationship_type = relationship.get("type")
        target = relationship.get("target")
        if relationship_type not in SIGNAL_RELATIONSHIP_TYPES or not isinstance(target, str):
            continue
        if not current_relationship_is_public(incident, relationship, target, cutoff):
            continue
        category = SIGNAL_RELATIONSHIP_TYPES[relationship_type]
        signal = entity_prior_signal(
            entity_id=target,
            current_incident_id=incident_id,
            cutoff=cutoff,
            incidents_by_id=incidents_by_id,
            entities_by_id=entities_by_id,
            category=category,
            basis_prefix=f"relationship.{relationship_type}",
        )
        if signal:
            key = (signal["signal_type"], signal["entity_id"], signal["basis"])
            if key not in seen:
                seen.add(key)
                signals.append(signal)

    for relationship in seeded_by_incident.get(incident_id, []):
        if relationship.get("type") != "SEEDED_BY":
            continue
        for endpoint_field, role in (("source", "seed_source"), ("target", "seed_target")):
            endpoint = relationship.get(endpoint_field)
            if not isinstance(endpoint, str) or endpoint.startswith("incident-"):
                continue
            if not current_relationship_is_public(incident, relationship, endpoint, cutoff):
                continue
            signal = entity_prior_signal(
                entity_id=endpoint,
                current_incident_id=incident_id,
                cutoff=cutoff,
                incidents_by_id=incidents_by_id,
                entities_by_id=entities_by_id,
                category=f"seeded_by_{role}",
                basis_prefix=f"relationship.SEEDED_BY.{endpoint_field}",
            )
            if signal:
                signal["propagation_tier"] = relationship.get("propagation_tier")
                signal["evidence_refs"] = relationship.get("evidence_refs", [])
                key = (signal["signal_type"], signal["entity_id"], signal["basis"])
                if key not in seen:
                    seen.add(key)
                    signals.append(signal)

    signals.sort(key=lambda item: (item.get("signal_date") or "9999-99-99", item["signal_type"], item["entity_id"]))
    return signals, notes


def build_prior_signal_result(
    incident: dict[str, Any],
    relationships_by_source: dict[str, list[dict[str, Any]]],
    seeded_by_incident: dict[str, list[dict[str, Any]]],
    incidents_by_id: dict[str, dict[str, Any]],
    entities_by_id: dict[str, dict[str, Any]],
) -> dict[str, Any]:
    signals, notes = collect_prior_signals(
        incident,
        relationships_by_source,
        seeded_by_incident,
        incidents_by_id,
        entities_by_id,
    )
    disclosure = parse_date(incident.get("disclosed_at"))
    lead_times = [
        signal["lead_time_days"]
        for signal in signals
        if isinstance(signal.get("lead_time_days"), int) and signal["lead_time_days"] >= 0
    ]
    strongest_lead = max(lead_times) if lead_times else None
    return {
        "incident_id": incident.get("id"),
        "title": incident.get("title"),
        "disclosed_at": iso(disclosure),
        "replay_cutoff": iso(incident_cutoff(incident)),
        "prior_signal": bool(signals),
        "strongest_lead_time_days": strongest_lead,
        "signals": signals,
        "notes": notes,
    }


def aggregate_results(timelines: list[dict[str, Any]], prior_signal_results: list[dict[str, Any]]) -> dict[str, Any]:
    evaluated = [result for result in prior_signal_results if result.get("replay_cutoff")]
    with_signal = [result for result in evaluated if result.get("prior_signal")]
    latency_values = [
        timeline["discovery_latency_days"]
        for timeline in timelines
        if isinstance(timeline.get("discovery_latency_days"), int)
    ]
    signal_type_counts = Counter(
        signal["signal_type"]
        for result in prior_signal_results
        for signal in result.get("signals", [])
        if isinstance(signal.get("signal_type"), str)
    )
    return {
        "incident_count": len(prior_signal_results),
        "evaluated_incident_count": len(evaluated),
        "missing_disclosure_count": len(prior_signal_results) - len(evaluated),
        "prior_signal_count": len(with_signal),
        "no_prior_signal_count": len(evaluated) - len(with_signal),
        "prior_signal_rate": round(len(with_signal) / len(evaluated), 3) if evaluated else None,
        "average_discovery_latency_days": round(sum(latency_values) / len(latency_values), 1) if latency_values else None,
        "signal_type_counts": dict(sorted(signal_type_counts.items())),
    }


def build_backtest(
    corpus: Any,
    incident_ids: tuple[str, ...] | None = None,
    *,
    relationships: Any = None,
    entities_by_id: dict[str, dict[str, Any]] | None = None,
) -> dict[str, Any]:
    input_errors = []
    if not isinstance(corpus, list):
        input_errors.append("corpus: expected array")
        corpus = []

    incidents_by_id = {
        incident.get("id"): incident
        for incident in corpus
        if isinstance(incident, dict) and isinstance(incident.get("id"), str)
    }
    selected_incident_ids = tuple(incident_ids) if incident_ids is not None else tuple(sorted(incidents_by_id))
    if not selected_incident_ids:
        input_errors.append("backtest: expected at least one incident")
    missing_ids = [incident_id for incident_id in selected_incident_ids if incident_id not in incidents_by_id]
    timelines = [
        build_timeline(incidents_by_id[incident_id])
        for incident_id in selected_incident_ids
        if incident_id in incidents_by_id
    ]
    relationships_by_source, seeded_by_incident, relationship_errors = relationship_index(relationships)
    input_errors.extend(relationship_errors)
    entities_by_id = entities_by_id or {}
    prior_signal_results = [
        build_prior_signal_result(
            incidents_by_id[incident_id],
            relationships_by_source,
            seeded_by_incident,
            incidents_by_id,
            entities_by_id,
        )
        for incident_id in selected_incident_ids
        if incident_id in incidents_by_id
    ]

    return {
        "status": "PASS" if not missing_ids and not input_errors else "FAIL",
        "generated_at": datetime.now(timezone.utc).replace(microsecond=0).isoformat().replace("+00:00", "Z"),
        "model": "stored-fields-only",
        "non_goals": ["scoring", "risk_engine", "automated_attribution", "ai_inference"],
        "incident_ids": list(selected_incident_ids),
        "missing_incident_ids": missing_ids,
        "input_errors": input_errors,
        "aggregate": aggregate_results(timelines, prior_signal_results),
        "prior_signal_results": prior_signal_results,
        "timelines": timelines,
    }


def main(argv: list[str] | None = None) -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--corpus", type=Path, default=DEFAULT_CORPUS_PATH)
    parser.add_argument("--relationships", type=Path, default=DEFAULT_RELATIONSHIP_PATH)
    parser.add_argument("--entity-dir", type=Path, default=DEFAULT_ENTITY_DIR)
    parser.add_argument("--incident-id", action="append", dest="incident_ids")
    parser.add_argument(
        "--legacy-required-incidents",
        action="store_true",
        help="Replay only the three initial Phase 2G incidents.",
    )
    args = parser.parse_args(argv)

    incident_ids = tuple(args.incident_ids) if args.incident_ids else (DEFAULT_INCIDENT_IDS if args.legacy_required_incidents else None)
    try:
        corpus = load_json(args.corpus)
        relationships = load_json(args.relationships)
        entities_by_id = load_entities(args.entity_dir)
    except OSError as exc:
        report = error_report(f"backtest input: failed to read file: {exc}")
    except json.JSONDecodeError as exc:
        report = error_report(f"backtest input: invalid JSON: {exc}")
    else:
        report = build_backtest(corpus, incident_ids, relationships=relationships, entities_by_id=entities_by_id)
    print(json.dumps(report, indent=2, sort_keys=True))
    return 0 if report["status"] == "PASS" else 1


if __name__ == "__main__":
    raise SystemExit(main())
