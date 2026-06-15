#!/usr/bin/env python3
"""Replay stored supply-chain incident dates without scoring or inference."""

from __future__ import annotations

import argparse
from datetime import date, datetime, timezone
import json
from pathlib import Path
from typing import Any


REPO_ROOT = Path(__file__).resolve().parents[1]
DEFAULT_CORPUS_PATH = REPO_ROOT / "data" / "supply-chain-incidents" / "incidents.json"
DEFAULT_INCIDENT_IDS = (
    "SC-2024-XZ-UTILS",
    "SC-2018-NPM-EVENT-STREAM",
    "SC-2025-GO-BOLTDB-TYPOSQUAT",
)


def load_json(path: Path) -> Any:
    return json.loads(path.read_text(encoding="utf-8"))


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


def publish_anchor(incident: dict[str, Any]) -> tuple[date | None, str | None, list[str]]:
    releases = release_publish_dates(incident)
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
        if not isinstance(reference_id, str) or not reference_id:
            url = reference.get("url")
            reference_id = url if isinstance(url, str) and url.strip() else f"references[{index}]"
        published_at = parse_date(reference.get("published_at"))
        if replay_date is None or published_at is None:
            undated.append(reference_id)
        elif published_at <= replay_date:
            available.append(reference_id)
        else:
            later.append(reference_id)
    return sorted(available), sorted(later), sorted(undated)


def build_timeline(incident: dict[str, Any]) -> dict[str, Any]:
    publish_date, publish_source, notes = publish_anchor(incident)
    first_warning = parse_date(incident.get("first_public_warning_at"))
    disclosure = parse_date(incident.get("disclosed_at"))
    discovery_date = first_warning or disclosure
    latency_basis = "first_public_warning_at" if first_warning else "disclosed_at"
    available_refs, later_refs, undated_refs = split_references_by_replay_date(incident, discovery_date)

    releases = [
        {
            "purl": release.get("purl"),
            "version": release.get("version"),
            "published_at": release.get("published_at"),
            "malicious_range": release.get("malicious_range"),
        }
        for _, release in release_publish_dates(incident)
    ]

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
            "release_purls": [release["purl"] for release in releases if release.get("purl")],
        },
        "later_discovered_evidence": {
            "reference_ids": later_refs,
        },
        "undated_evidence": {
            "reference_ids": undated_refs,
        },
        "releases": releases,
        "notes": notes,
    }


def build_backtest(corpus: Any, incident_ids: tuple[str, ...] = DEFAULT_INCIDENT_IDS) -> dict[str, Any]:
    input_errors = []
    if not isinstance(corpus, list):
        input_errors.append("corpus: expected array")
        corpus = []

    incidents_by_id = {
        incident.get("id"): incident
        for incident in corpus
        if isinstance(incident, dict) and isinstance(incident.get("id"), str)
    }
    missing_ids = [incident_id for incident_id in incident_ids if incident_id not in incidents_by_id]
    timelines = [build_timeline(incidents_by_id[incident_id]) for incident_id in incident_ids if incident_id in incidents_by_id]

    return {
        "status": "PASS" if not missing_ids and not input_errors else "FAIL",
        "generated_at": datetime.now(timezone.utc).replace(microsecond=0).isoformat().replace("+00:00", "Z"),
        "model": "stored-fields-only",
        "non_goals": ["scoring", "risk_engine", "automated_attribution", "ai_inference"],
        "incident_ids": list(incident_ids),
        "missing_incident_ids": missing_ids,
        "input_errors": input_errors,
        "timelines": timelines,
    }


def main(argv: list[str] | None = None) -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--corpus", type=Path, default=DEFAULT_CORPUS_PATH)
    parser.add_argument("--incident-id", action="append", dest="incident_ids")
    args = parser.parse_args(argv)

    incident_ids = tuple(args.incident_ids) if args.incident_ids else DEFAULT_INCIDENT_IDS
    report = build_backtest(load_json(args.corpus), incident_ids)
    print(json.dumps(report, indent=2, sort_keys=True))
    return 0 if report["status"] == "PASS" else 1


if __name__ == "__main__":
    raise SystemExit(main())
