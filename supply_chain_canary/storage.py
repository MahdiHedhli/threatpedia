"""Postgres storage helpers for Phase-0 release ingestion."""

from __future__ import annotations

import json
from pathlib import Path
from typing import Any

from .enrichment import EnrichmentObservation
from .normalizer import ReleaseEvent


SCHEMA_PATH = Path(__file__).with_name("schema.sql")


UPSERT_RELEASE_EVENT_SQL = """
INSERT INTO supply_release_event (
  ecosystem,
  name,
  version,
  purl,
  published_at,
  feed_name,
  feed_cursor,
  source_url,
  observed_facts,
  raw_registry_metadata,
  observed_at
) VALUES (
  %(ecosystem)s,
  %(name)s,
  %(version)s,
  %(purl)s,
  %(published_at)s,
  %(feed_name)s,
  %(feed_cursor)s,
  %(source_url)s,
  %(observed_facts)s::jsonb,
  %(raw_registry_metadata)s::jsonb,
  %(observed_at)s
)
ON CONFLICT (ecosystem, name, version) DO UPDATE SET
  observed_at = EXCLUDED.observed_at
RETURNING id;
"""


INSERT_ENRICHMENT_OBSERVATION_SQL = """
INSERT INTO supply_enrichment_observation (
  release_event_id,
  purl,
  ecosystem,
  name,
  version,
  provider,
  observation_kind,
  observed_at,
  raw_metadata,
  status
) VALUES (
  %(release_event_id)s,
  %(purl)s,
  %(ecosystem)s,
  %(name)s,
  %(version)s,
  %(provider)s,
  %(observation_kind)s,
  %(observed_at)s,
  %(raw_metadata)s::jsonb,
  %(status)s
)
RETURNING id;
"""


UPSERT_FEED_CURSOR_SQL = """
INSERT INTO supply_feed_cursor (
  ecosystem,
  feed_name,
  cursor_value,
  cursor_observed_at,
  boundary,
  updated_at
) VALUES (
  %(ecosystem)s,
  %(feed_name)s,
  %(cursor_value)s,
  %(cursor_observed_at)s,
  %(boundary)s::jsonb,
  NOW()
)
ON CONFLICT (ecosystem, feed_name) DO UPDATE SET
  cursor_value = EXCLUDED.cursor_value,
  cursor_observed_at = EXCLUDED.cursor_observed_at,
  boundary = EXCLUDED.boundary,
  updated_at = NOW();
"""


def load_schema_sql() -> str:
    return SCHEMA_PATH.read_text(encoding="utf-8")


def release_event_params(event: ReleaseEvent) -> dict[str, Any]:
    return {
        "ecosystem": event.ecosystem,
        "name": event.name,
        "version": event.version,
        "purl": event.purl,
        "published_at": event.published_at,
        "feed_name": event.feed_name,
        "feed_cursor": event.feed_cursor,
        "source_url": event.source_url,
        "observed_facts": json.dumps(event.observed_facts, sort_keys=True),
        "raw_registry_metadata": json.dumps(event.raw_registry_metadata, sort_keys=True),
        "observed_at": event.observed_at,
    }


def enrichment_params(observation: EnrichmentObservation) -> dict[str, Any]:
    return {
        "release_event_id": observation.release_event_id,
        "purl": observation.purl,
        "ecosystem": observation.ecosystem,
        "name": observation.name,
        "version": observation.version,
        "provider": observation.provider,
        "observation_kind": observation.observation_kind,
        "observed_at": observation.observed_at,
        "raw_metadata": json.dumps(observation.raw_metadata, sort_keys=True),
        "status": observation.status,
    }


def feed_cursor_params(
    *,
    ecosystem: str,
    feed_name: str,
    cursor_value: str,
    cursor_observed_at: Any,
    boundary: dict[str, Any],
) -> dict[str, Any]:
    return {
        "ecosystem": ecosystem,
        "feed_name": feed_name,
        "cursor_value": cursor_value,
        "cursor_observed_at": cursor_observed_at,
        "boundary": json.dumps(boundary, sort_keys=True),
    }


def upsert_release_event(conn: Any, event: ReleaseEvent) -> int | None:
    with conn.cursor() as cursor:
        cursor.execute(UPSERT_RELEASE_EVENT_SQL, release_event_params(event))
        row = cursor.fetchone()
        return row[0] if row else None


def insert_enrichment_observation(conn: Any, observation: EnrichmentObservation) -> int:
    with conn.cursor() as cursor:
        cursor.execute(INSERT_ENRICHMENT_OBSERVATION_SQL, enrichment_params(observation))
        return cursor.fetchone()[0]


def upsert_feed_cursor(
    conn: Any,
    *,
    ecosystem: str,
    feed_name: str,
    cursor_value: str,
    cursor_observed_at: Any,
    boundary: dict[str, Any],
) -> None:
    with conn.cursor() as cursor:
        cursor.execute(
            UPSERT_FEED_CURSOR_SQL,
            feed_cursor_params(
                ecosystem=ecosystem,
                feed_name=feed_name,
                cursor_value=cursor_value,
                cursor_observed_at=cursor_observed_at,
                boundary=boundary,
            ),
        )
