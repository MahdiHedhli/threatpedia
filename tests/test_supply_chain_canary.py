from __future__ import annotations

from datetime import datetime, timedelta, timezone
import json
from pathlib import Path
import unittest

from supply_chain_canary import go_adapter, npm_adapter, pypi_adapter, storage
from supply_chain_canary.enrichment import (
    ENRICHMENT_PROVIDERS,
    build_enrichment_placeholders,
    build_osv_repoll_placeholder,
    osv_repoll_due,
)
from supply_chain_canary.normalizer import build_purl, normalize_name


FIXTURE_DIR = Path(__file__).parent / "fixtures" / "supply_chain_canary"


def load_json(name: str) -> dict:
    return json.loads((FIXTURE_DIR / name).read_text(encoding="utf-8"))


class SupplyChainCanaryTests(unittest.TestCase):
    def test_purl_builder_normalizes_supported_ecosystems(self) -> None:
        self.assertEqual(normalize_name("pypi", "Demo_Pkg"), "demo-pkg")
        self.assertEqual(build_purl("npm", "@Scope/Demo", "1.2.3"), "pkg:npm/scope/demo@1.2.3")
        self.assertEqual(build_purl("pypi", "Demo_Pkg", "1.2.3"), "pkg:pypi/demo-pkg@1.2.3")
        self.assertEqual(
            build_purl("go", "github.com/acme/lib", "v1.2.3"),
            "pkg:golang/github.com/acme/lib@v1.2.3",
        )

    def test_npm_adapter_confirms_release_from_package_metadata(self) -> None:
        metadata = load_json("npm_package.json")
        events = npm_adapter.release_events_from_package_metadata(
            metadata,
            versions=["1.2.3"],
            feed_cursor="seq:123",
            observed_at=datetime(2026, 6, 10, 13, tzinfo=timezone.utc),
        )

        self.assertEqual(len(events), 1)
        event = events[0]
        self.assertEqual(event.ecosystem, "npm")
        self.assertEqual(event.name, "@scope/demo")
        self.assertEqual(event.purl, "pkg:npm/scope/demo@1.2.3")
        self.assertEqual(event.feed_name, "npm-registry-change-trigger")
        self.assertEqual(event.feed_cursor, "seq:123")
        self.assertEqual(event.observed_facts["dependencies"], {"left-pad": "^1.3.0"})
        self.assertIn("version", event.raw_registry_metadata)

    def test_pypi_adapter_uses_rss_trigger_and_json_confirmation(self) -> None:
        rss = (FIXTURE_DIR / "pypi_updates.xml").read_text(encoding="utf-8")
        updates = pypi_adapter.parse_updates_rss(rss)
        self.assertEqual(updates[0]["project"], "Demo_Pkg")
        self.assertEqual(updates[0]["version"], "1.2.3")

        malformed = pypi_adapter.parse_updates_rss(
            """
            <rss><channel><item>
              <title>Broken_Pkg 1.2.4</title>
              <link>https://example.invalid/broken</link>
              <pubDate>not-a-date</pubDate>
            </item></channel></rss>
            """
        )
        self.assertEqual(malformed[0]["published_at"], "")

        project_json = load_json("pypi_project.json")
        event = pypi_adapter.release_event_from_project_json(
            project_json,
            version=updates[0]["version"],
            feed_cursor=updates[0]["cursor"],
            observed_at=datetime(2026, 6, 10, 13, tzinfo=timezone.utc),
        )

        self.assertEqual(event.name, "demo-pkg")
        self.assertEqual(event.purl, "pkg:pypi/demo-pkg@1.2.3")
        self.assertEqual(event.feed_name, "pypi-updates-rss")
        self.assertEqual(event.observed_facts["files"][0]["filename"], "demo_pkg-1.2.3-py3-none-any.whl")
        self.assertIn("release_files", event.raw_registry_metadata)

    def test_go_adapter_parses_index_rows_and_dedupes_boundary(self) -> None:
        rows = go_adapter.parse_index_lines((FIXTURE_DIR / "go_index.jsonl").read_text(encoding="utf-8"))
        events = go_adapter.release_events_from_index_rows(
            rows,
            observed_at=datetime(2026, 6, 10, 13, tzinfo=timezone.utc),
        )

        self.assertEqual(len(events), 2)
        self.assertEqual(events[0].purl, "pkg:golang/github.com/acme/lib@v1.2.3")
        self.assertEqual(events[0].feed_name, "go-index")

        deduped, next_boundary = go_adapter.dedupe_boundary_rows(rows)
        self.assertEqual(len(deduped), 2)
        self.assertEqual(next_boundary, {go_adapter.boundary_key(rows[1])})

        repeated, _ = go_adapter.dedupe_boundary_rows(rows, seen_boundary_keys={go_adapter.boundary_key(rows[1])})
        self.assertEqual([row["Version"] for row in repeated], ["v1.2.3"])

    def test_go_adapter_preserves_boundary_keys_when_all_rows_are_seen_or_invalid(self) -> None:
        rows = [
            {"Path": "github.com/acme/lib", "Version": "v1.2.4", "Timestamp": "2026-06-10T12:35:56.000000Z"},
            {"Path": "", "Version": "broken", "Timestamp": "2026-06-10T12:35:56.000000Z"},
        ]
        deduped, next_boundary = go_adapter.dedupe_boundary_rows(
            rows,
            seen_boundary_keys={go_adapter.boundary_key(rows[0])},
        )

        self.assertEqual(deduped, [])
        self.assertEqual(next_boundary, {go_adapter.boundary_key(rows[0])})

    def test_go_adapter_keeps_seen_keys_when_boundary_grows(self) -> None:
        rows = [
            {"Path": "github.com/acme/lib", "Version": "v1.2.4", "Timestamp": "2026-06-10T12:35:56Z"},
            {"Path": "github.com/acme/extra", "Version": "v1.2.5", "Timestamp": "2026-06-10T12:35:56Z"},
        ]
        deduped, next_boundary = go_adapter.dedupe_boundary_rows(
            rows,
            seen_boundary_keys={go_adapter.boundary_key(rows[0])},
        )

        self.assertEqual([row["Version"] for row in deduped], ["v1.2.5"])
        self.assertEqual(
            next_boundary,
            {go_adapter.boundary_key(rows[0]), go_adapter.boundary_key(rows[1])},
        )

    def test_parse_datetime_truncates_excess_fractional_precision(self) -> None:
        event = go_adapter.release_events_from_index_rows(
            [
                {
                    "Path": "github.com/acme/lib",
                    "Version": "v1.2.5",
                    "Timestamp": "2026-06-10T12:35:56.123456789Z",
                }
            ]
        )[0]
        self.assertEqual(event.published_at.isoformat(), "2026-06-10T12:35:56.123456+00:00")

    def test_enrichment_placeholders_and_osv_repoll_window(self) -> None:
        event = go_adapter.release_events_from_index_rows(
            go_adapter.parse_index_lines((FIXTURE_DIR / "go_index.jsonl").read_text(encoding="utf-8"))
        )[0]
        observed_at = event.published_at + timedelta(days=7)
        placeholders = build_enrichment_placeholders(event, observed_at=observed_at)

        self.assertEqual([item.provider for item in placeholders], list(ENRICHMENT_PROVIDERS))
        self.assertTrue(all(item.status == "pending" for item in placeholders))
        self.assertTrue(all(item.release_event_id is None for item in placeholders))
        self.assertTrue(osv_repoll_due(event, now=observed_at))
        self.assertIsNotNone(build_osv_repoll_placeholder(event, observed_at=observed_at))
        self.assertFalse(osv_repoll_due(event, now=event.published_at + timedelta(days=31)))

    def test_storage_sql_declares_phase_zero_postgres_tables(self) -> None:
        schema_sql = storage.load_schema_sql()
        self.assertIn("CREATE TABLE IF NOT EXISTS supply_release_event", schema_sql)
        self.assertIn("CREATE TABLE IF NOT EXISTS supply_enrichment_observation", schema_sql)
        self.assertIn("CREATE TABLE IF NOT EXISTS supply_label_observation", schema_sql)
        self.assertIn("CREATE TABLE IF NOT EXISTS supply_feed_cursor", schema_sql)
        self.assertIn(
            "ON CONFLICT (ecosystem, name, version) DO UPDATE",
            storage.UPSERT_RELEASE_EVENT_SQL,
        )
        self.assertIn("release_event_id", storage.INSERT_ENRICHMENT_OBSERVATION_SQL)
        self.assertIn("ON CONFLICT (ecosystem, feed_name) DO UPDATE", storage.UPSERT_FEED_CURSOR_SQL)
        cursor_params = storage.feed_cursor_params(
            ecosystem="go",
            feed_name="go-index",
            cursor_value="2026-06-10T12:35:56.000000Z",
            cursor_observed_at=datetime(2026, 6, 10, 12, 35, 56, tzinfo=timezone.utc),
            boundary={"keys": ["github.com/acme/lib\tv1.2.4\t2026-06-10T12:35:56.000000Z"]},
        )
        self.assertIn("github.com/acme/lib", cursor_params["boundary"])


if __name__ == "__main__":
    unittest.main()
