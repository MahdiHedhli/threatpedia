"""npm release-event adapter.

npm registry changes are only a trigger. Package/version facts are confirmed
from https://registry.npmjs.org/<package> package metadata.
"""

from __future__ import annotations

from datetime import datetime
import json
from typing import Any, Iterable
from urllib.parse import quote
from urllib.request import Request, urlopen

from .normalizer import ReleaseEvent, release_event


REGISTRY_BASE = "https://registry.npmjs.org"


def package_metadata_url(package_name: str) -> str:
    return f"{REGISTRY_BASE}/{quote(package_name, safe='')}"


def fetch_package_metadata(package_name: str, timeout: int = 20) -> dict[str, Any]:
    request = Request(
        package_metadata_url(package_name),
        headers={"Accept": "application/json"},
    )
    with urlopen(request, timeout=timeout) as response:
        return json.loads(response.read().decode("utf-8"))


def release_events_from_package_metadata(
    metadata: dict[str, Any],
    *,
    versions: Iterable[str] | None = None,
    feed_cursor: str,
    observed_at: datetime | None = None,
) -> list[ReleaseEvent]:
    name = metadata.get("name")
    if not name:
        raise ValueError("npm package metadata missing name")
    available_versions = metadata.get("versions") or {}
    selected_versions = list(versions) if versions is not None else list(available_versions)
    events: list[ReleaseEvent] = []
    times = metadata.get("time") or {}
    for version in selected_versions:
        version_metadata = available_versions.get(version)
        if not version_metadata:
            continue
        published_at = times.get(version)
        if not published_at:
            continue
        events.append(
            release_event(
                ecosystem="npm",
                name=name,
                version=version,
                published_at=published_at,
                feed_name="npm-registry-change-trigger",
                feed_cursor=feed_cursor,
                source_url=package_metadata_url(name),
                observed_facts={
                    "dist": version_metadata.get("dist", {}),
                    "dependencies": version_metadata.get("dependencies", {}),
                    "deprecated": version_metadata.get("deprecated"),
                    "integrity": (version_metadata.get("dist") or {}).get("integrity"),
                    "shasum": (version_metadata.get("dist") or {}).get("shasum"),
                },
                raw_registry_metadata={
                    "package": {
                        "name": metadata.get("name"),
                        "dist-tags": metadata.get("dist-tags", {}),
                        "time": {version: published_at},
                    },
                    "version": version_metadata,
                },
                observed_at=observed_at,
            )
        )
    return events
