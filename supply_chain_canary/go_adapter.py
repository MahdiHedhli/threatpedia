"""Go module index release-event adapter."""

from __future__ import annotations

from datetime import datetime
import json
from typing import Any
from urllib.parse import urlencode
from urllib.request import Request, urlopen

from .normalizer import ReleaseEvent, parse_datetime, release_event


INDEX_URL = "https://index.golang.org/index"


def index_url_since(since_rfc3339: str) -> str:
    return f"{INDEX_URL}?{urlencode({'since': since_rfc3339})}"


def fetch_index_since(since_rfc3339: str, timeout: int = 20) -> list[dict[str, Any]]:
    request = Request(
        index_url_since(since_rfc3339),
        headers={
            "Accept": "application/json",
            "User-Agent": "Threatpedia-Canary/0.1.0 (+https://threatpedia.wiki)",
        },
    )
    with urlopen(request, timeout=timeout) as response:
        return parse_index_lines(response.read().decode("utf-8"))


def parse_index_lines(text: str) -> list[dict[str, Any]]:
    rows: list[dict[str, Any]] = []
    for line in text.splitlines():
        line = line.strip()
        if not line:
            continue
        rows.append(json.loads(line))
    return rows


def boundary_key(row: dict[str, Any]) -> str:
    return f"{row.get('Path', '')}\t{row.get('Version', '')}\t{row.get('Timestamp', '')}"


def dedupe_boundary_rows(
    rows: list[dict[str, Any]],
    *,
    seen_boundary_keys: set[str] | None = None,
) -> tuple[list[dict[str, Any]], set[str]]:
    """Drop already-seen Go index boundary rows and return the next boundary.

    index.golang.org can return rows at the cursor edge again. Callers should
    persist the returned boundary keys with supply_feed_cursor.boundary.
    """

    valid_rows = [row for row in rows if row.get("Path") and row.get("Version") and row.get("Timestamp")]
    seen_boundary_keys = seen_boundary_keys or set()
    deduped = [row for row in valid_rows if boundary_key(row) not in seen_boundary_keys]
    if not deduped:
        return [], set(seen_boundary_keys)
    parsed_timestamps = {boundary_key(row): parse_datetime(row["Timestamp"]) for row in valid_rows}
    max_timestamp = max(parsed_timestamps.values())
    next_boundary = {
        boundary_key(row)
        for row in valid_rows
        if parsed_timestamps[boundary_key(row)] == max_timestamp
    }
    return deduped, next_boundary


def release_events_from_index_rows(
    rows: list[dict[str, Any]],
    *,
    observed_at: datetime | None = None,
) -> list[ReleaseEvent]:
    events: list[ReleaseEvent] = []
    for row in rows:
        path = row.get("Path")
        version = row.get("Version")
        timestamp = row.get("Timestamp")
        if not path or not version or not timestamp:
            continue
        events.append(
            release_event(
                ecosystem="go",
                name=path,
                version=version,
                published_at=timestamp,
                feed_name="go-index",
                feed_cursor=timestamp,
                source_url=INDEX_URL,
                observed_facts={
                    "path": path,
                    "version": version,
                    "timestamp": timestamp,
                },
                raw_registry_metadata=row,
                observed_at=observed_at,
            )
        )
    return events
