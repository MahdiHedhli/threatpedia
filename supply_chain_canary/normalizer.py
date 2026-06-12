"""Canonical release-event shape and package URL helpers."""

from __future__ import annotations

from dataclasses import dataclass
from datetime import datetime, timezone
import re
from typing import Any
from urllib.parse import quote


SUPPORTED_ECOSYSTEMS = {"npm", "pypi", "go"}


@dataclass(frozen=True)
class ReleaseEvent:
    """Normalized release observation from a package registry.

    The event is intentionally registry-fact focused. Scoring, policy advice,
    malware detection, and graph attribution are downstream concerns.
    """

    ecosystem: str
    name: str
    version: str
    published_at: datetime
    purl: str
    feed_name: str
    feed_cursor: str
    observed_facts: dict[str, Any]
    raw_registry_metadata: dict[str, Any]
    source_url: str
    observed_at: datetime

    def storage_key(self) -> tuple[str, str, str, datetime, str]:
        return (
            self.ecosystem,
            self.name,
            self.version,
            self.published_at,
            self.feed_cursor,
        )


def utc_now() -> datetime:
    return datetime.now(timezone.utc)


def parse_datetime(value: str | datetime) -> datetime:
    if isinstance(value, datetime):
        parsed = value
    else:
        text = value.strip()
        if text.endswith("Z"):
            text = f"{text[:-1]}+00:00"
        text = re.sub(r"(\.\d{6})\d+", r"\1", text)
        parsed = datetime.fromisoformat(text)
    if parsed.tzinfo is None:
        parsed = parsed.replace(tzinfo=timezone.utc)
    return parsed.astimezone(timezone.utc)


def normalize_name(ecosystem: str, name: str) -> str:
    ecosystem = ecosystem.lower()
    if ecosystem not in SUPPORTED_ECOSYSTEMS:
        raise ValueError(f"unsupported ecosystem: {ecosystem}")
    if not name or not name.strip():
        raise ValueError("package name is required")
    name = name.strip()
    if ecosystem == "pypi":
        return re.sub(r"[-_.]+", "-", name).lower()
    if ecosystem == "npm":
        return name.lower()
    return name


def build_purl(ecosystem: str, name: str, version: str) -> str:
    ecosystem = ecosystem.lower()
    if not version or not version.strip():
        raise ValueError("package version is required")
    normalized = normalize_name(ecosystem, name)
    encoded_version = quote(version.strip(), safe="")
    if ecosystem == "npm":
        if normalized.startswith("@") and "/" in normalized:
            scope, pkg_name = normalized[1:].split("/", 1)
            encoded_scope = quote(scope, safe="")
            encoded_pkg_name = quote(pkg_name, safe="")
            return f"pkg:npm/{encoded_scope}/{encoded_pkg_name}@{encoded_version}"
        encoded_name = quote(normalized, safe="")
        return f"pkg:npm/{encoded_name}@{encoded_version}"
    if ecosystem == "pypi":
        encoded_name = quote(normalized, safe="")
        return f"pkg:pypi/{encoded_name}@{encoded_version}"
    if ecosystem == "go":
        encoded_name = quote(normalized, safe="/")
        return f"pkg:golang/{encoded_name}@{encoded_version}"
    raise ValueError(f"unsupported ecosystem: {ecosystem}")


def release_event(
    *,
    ecosystem: str,
    name: str,
    version: str,
    published_at: str | datetime,
    feed_name: str,
    feed_cursor: str,
    observed_facts: dict[str, Any],
    raw_registry_metadata: dict[str, Any],
    source_url: str,
    observed_at: str | datetime | None = None,
) -> ReleaseEvent:
    ecosystem = ecosystem.lower()
    normalized_name = normalize_name(ecosystem, name)
    version = version.strip()
    published = parse_datetime(published_at)
    observed = parse_datetime(observed_at) if observed_at else utc_now()
    return ReleaseEvent(
        ecosystem=ecosystem,
        name=normalized_name,
        version=version,
        published_at=published,
        purl=build_purl(ecosystem, normalized_name, version),
        feed_name=feed_name,
        feed_cursor=feed_cursor,
        observed_facts=observed_facts,
        raw_registry_metadata=raw_registry_metadata,
        source_url=source_url,
        observed_at=observed,
    )
