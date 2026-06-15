from __future__ import annotations

import copy
import json
from pathlib import Path
import sys
import unittest


REPO_ROOT = Path(__file__).resolve().parents[1]
CORPUS_PATH = REPO_ROOT / "data" / "supply-chain-incidents" / "incidents.json"
SCRIPT_DIR = REPO_ROOT / "scripts"

if str(SCRIPT_DIR) not in sys.path:
    sys.path.insert(0, str(SCRIPT_DIR))

import supply_chain_backtest as backtest


def load_json(path: Path):
    return json.loads(path.read_text(encoding="utf-8"))


class SupplyChainBacktestTests(unittest.TestCase):
    def test_default_backtest_supports_required_incidents(self) -> None:
        report = backtest.build_backtest(load_json(CORPUS_PATH))

        self.assertEqual(report["status"], "PASS")
        self.assertEqual(
            {timeline["incident_id"] for timeline in report["timelines"]},
            {"SC-2024-XZ-UTILS", "SC-2018-NPM-EVENT-STREAM", "SC-2025-GO-BOLTDB-TYPOSQUAT"},
        )

    def test_event_stream_replay_uses_release_publish_date(self) -> None:
        corpus = load_json(CORPUS_PATH)
        event_stream = next(item for item in corpus if item["id"] == "SC-2018-NPM-EVENT-STREAM")

        timeline = backtest.build_timeline(event_stream)

        self.assertEqual(timeline["publish_date"], "2018-09-09")
        self.assertEqual(timeline["publish_date_source"], "release.published_at")
        self.assertEqual(timeline["first_warning_signal_at"], None)
        self.assertEqual(timeline["public_disclosure_at"], "2018-11-26")
        self.assertEqual(timeline["discovery_latency_days"], 78)
        self.assertEqual(timeline["discovery_latency_basis"], "disclosed_at")

    def test_xz_replay_uses_stored_first_observed_anchor_without_release(self) -> None:
        corpus = load_json(CORPUS_PATH)
        xz_utils = next(item for item in corpus if item["id"] == "SC-2024-XZ-UTILS")

        timeline = backtest.build_timeline(xz_utils)

        self.assertEqual(timeline["publish_date"], "2024-02-24")
        self.assertEqual(timeline["publish_date_source"], "incident.first_observed_at")
        self.assertEqual(timeline["first_warning_signal_at"], "2024-03-29")
        self.assertEqual(timeline["discovery_latency_days"], 34)
        self.assertTrue(any("No release entity" in note for note in timeline["notes"]))

    def test_later_evidence_is_separated_from_available_at_time_evidence(self) -> None:
        corpus = load_json(CORPUS_PATH)
        boltdb = copy.deepcopy(next(item for item in corpus if item["id"] == "SC-2025-GO-BOLTDB-TYPOSQUAT"))
        boltdb["references"].append(
            {
                "id": "ref-post-disclosure-analysis",
                "title": "Later analysis",
                "publisher": "Researcher",
                "url": "https://example.com/later-analysis",
                "published_at": "2025-03-01",
            }
        )

        timeline = backtest.build_timeline(boltdb)

        self.assertEqual(timeline["publish_date"], "2021-11-01")
        self.assertIn("ref-socket-boltdb-go", timeline["available_at_the_time"]["reference_ids"])
        self.assertIn("ref-post-disclosure-analysis", timeline["later_discovered_evidence"]["reference_ids"])

    def test_references_without_ids_are_not_silently_dropped(self) -> None:
        corpus = load_json(CORPUS_PATH)
        event_stream = copy.deepcopy(next(item for item in corpus if item["id"] == "SC-2018-NPM-EVENT-STREAM"))
        event_stream["references"].append(
            {
                "title": "Undated reference without ID",
                "publisher": "Researcher",
                "url": "https://example.com/no-id",
                "published_at": None,
            }
        )

        timeline = backtest.build_timeline(event_stream)

        self.assertIn("references[1]", timeline["undated_evidence"]["reference_ids"])

    def test_non_array_corpus_fails_without_crashing(self) -> None:
        report = backtest.build_backtest({"not": "an array"}, ("SC-2024-XZ-UTILS",))

        self.assertEqual(report["status"], "FAIL")
        self.assertEqual(report["input_errors"], ["corpus: expected array"])

    def test_missing_required_replay_incident_fails(self) -> None:
        report = backtest.build_backtest([], ("SC-2024-XZ-UTILS",))

        self.assertEqual(report["status"], "FAIL")
        self.assertEqual(report["missing_incident_ids"], ["SC-2024-XZ-UTILS"])


if __name__ == "__main__":
    unittest.main()
