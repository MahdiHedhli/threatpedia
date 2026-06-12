"""Phase-0 enrichment placeholders.

These helpers create append-only observation intents only. They do not score,
detect malware, or recommend policy.
"""

from __future__ import annotations

from dataclasses import dataclass
from datetime import datetime, timedelta, timezone
from typing import Any

from .normalizer import ReleaseEvent, utc_now


ENRICHMENT_PROVIDERS = ("osv", "deps.dev", "openssf-scorecard")
OSV_REPOLL_DAYS = 30


@dataclass(frozen=True)
class EnrichmentObservation:
    purl: str
    ecosystem: str
    name: str
    version: str
    provider: str
    observation_kind: str
    observed_at: datetime
    raw_metadata: dict[str, Any]
    status: str


def build_enrichment_placeholders(
    event: ReleaseEvent,
    *,
    observed_at: datetime | None = None,
) -> list[EnrichmentObservation]:
    observed = observed_at or utc_now()
    return [
        EnrichmentObservation(
            purl=event.purl,
            ecosystem=event.ecosystem,
            name=event.name,
            version=event.version,
            provider=provider,
            observation_kind="placeholder",
            observed_at=observed,
            raw_metadata={"reason": "phase-0 async enrichment placeholder"},
            status="pending",
        )
        for provider in ENRICHMENT_PROVIDERS
    ]


def osv_repoll_due(event: ReleaseEvent, *, now: datetime | None = None) -> bool:
    now = now or utc_now()
    if now.tzinfo is None:
        now = now.replace(tzinfo=timezone.utc)
    return event.published_at <= now <= event.published_at + timedelta(days=OSV_REPOLL_DAYS)


def build_osv_repoll_placeholder(
    event: ReleaseEvent,
    *,
    observed_at: datetime | None = None,
) -> EnrichmentObservation | None:
    observed = observed_at or utc_now()
    if not osv_repoll_due(event, now=observed):
        return None
    return EnrichmentObservation(
        purl=event.purl,
        ecosystem=event.ecosystem,
        name=event.name,
        version=event.version,
        provider="osv",
        observation_kind="trailing-repoll-placeholder",
        observed_at=observed,
        raw_metadata={"repoll_window_days": OSV_REPOLL_DAYS, "reason": "capture delayed MAL labels"},
        status="pending",
    )
