from __future__ import annotations

import copy
import importlib.util
import json
from pathlib import Path
import tempfile
import unittest


REPO_ROOT = Path(__file__).resolve().parents[1]
ENTITY_DIR = REPO_ROOT / "data" / "supply-chain-entities"
RELATIONSHIP_PATH = REPO_ROOT / "data" / "supply-chain-relationships" / "relationships.json"


def load_module(name: str, path: Path):
    spec = importlib.util.spec_from_file_location(name, path)
    if spec is None or spec.loader is None:
        raise RuntimeError(f"failed to load {path}")
    module = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(module)
    return module


audit = load_module("audit_supply_chain_purls_edges", REPO_ROOT / "scripts" / "audit_supply_chain_purls_edges.py")


class SupplyChainPurlEdgeAuditTests(unittest.TestCase):
    def test_current_audit_passes_with_expected_counts(self) -> None:
        report = audit.build_audit(ENTITY_DIR, RELATIONSHIP_PATH)

        self.assertEqual(report["status"], "PASS")
        self.assertEqual(report["package_count"], 19)
        self.assertEqual(report["release_count"], 7)
        self.assertEqual(report["missing_purls"], [])
        self.assertEqual(report["invalid_purls"], [])
        self.assertEqual(report["dangling_actor_edges"], [])
        self.assertEqual(report["dangling_campaign_edges"], [])
        self.assertEqual(len(report["generic_purl_exceptions"]), 1)

    def test_package_and_release_purl_checks_detect_failures(self) -> None:
        self.assertEqual(
            audit.canonical_package_result({"id": "pkg-bad", "name": "bad", "ecosystem": "npm", "package_url": None})[0],
            "missing",
        )
        self.assertEqual(
            audit.canonical_release_result(
                {
                    "id": "release-bad",
                    "package_name": "bad",
                    "ecosystem": "npm",
                    "purl": "pkg:npm/bad",
                    "version": "1.0.0",
                }
            )[0],
            "missing",
        )

    def test_dangling_cross_corpus_edge_fails_audit(self) -> None:
        relationships = audit.load_json(RELATIONSHIP_PATH)
        broken_relationships = copy.deepcopy(relationships)
        broken_relationships.append(
            {
                "source": "incident-SC-2025-NPM-SHAI-HULUD",
                "target": "actor-does-not-exist",
                "type": "ATTRIBUTED_TO_ACTOR",
            }
        )
        with tempfile.TemporaryDirectory() as tmpdir:
            relationship_path = Path(tmpdir) / "relationships.json"
            relationship_path.write_text(json.dumps(broken_relationships), encoding="utf-8")

            report = audit.build_audit(ENTITY_DIR, relationship_path)

        self.assertEqual(report["status"], "FAIL")
        self.assertTrue(any("actor-does-not-exist" in error for error in report["dangling_actor_edges"]))


if __name__ == "__main__":
    unittest.main()
