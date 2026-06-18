from __future__ import annotations

import copy
import contextlib
import importlib.util
import io
import json
from pathlib import Path
import shutil
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
        self.assertEqual(report["package_count"], len(audit.load_json(ENTITY_DIR / "packages.json")))
        self.assertEqual(report["release_count"], len(audit.load_json(ENTITY_DIR / "releases.json")))
        self.assertEqual(report["missing_purls"], [])
        self.assertEqual(report["invalid_purls"], [])
        self.assertEqual(report["dangling_actor_edges"], [])
        self.assertEqual(report["dangling_campaign_edges"], [])
        self.assertEqual(report["dangling_incident_edges"], [])
        self.assertEqual(report["broken_actor_hrefs"], [])
        self.assertEqual(report["broken_campaign_hrefs"], [])
        self.assertEqual(report["dangling_package_edges"], [])
        self.assertEqual(report["dangling_release_edges"], [])
        self.assertEqual(report["invalid_relationship_edges"], [])
        self.assertGreaterEqual(len(report["generic_purl_exceptions"]), 0)

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
        self.assertEqual(audit.canonical_package_result({"name": "bad", "ecosystem": "npm", "package_url": "pkg:npm/bad"})[0], "invalid")
        self.assertEqual(
            audit.canonical_release_result(
                {"package_name": "bad", "ecosystem": "npm", "purl": "pkg:npm/bad@1.0.0", "version": "1.0.0"}
            )[0],
            "invalid",
        )

    def test_generic_package_purls_require_justification(self) -> None:
        self.assertEqual(
            audit.canonical_package_result(
                {
                    "id": "pkg-generic",
                    "name": "internal dependency names",
                    "ecosystem": "generic",
                    "package_url": "pkg:generic/internal-dependency-names",
                }
            )[0],
            "invalid",
        )
        self.assertEqual(
            audit.canonical_package_result(
                {
                    "id": "pkg-generic",
                    "name": "internal dependency names",
                    "ecosystem": "generic",
                    "package_url": "pkg:generic/internal-dependency-names",
                    "purl_justification": "Internal package names have no public registry namespace.",
                }
            )[0],
            "generic_exception",
        )

    def test_release_purl_version_mismatch_fails_audit(self) -> None:
        result = audit.canonical_release_result(
            {
                "id": "release-mismatch",
                "package_name": "left-pad",
                "ecosystem": "npm",
                "purl": "pkg:npm/left-pad@1.0.0",
                "version": "2.0.0",
            }
        )

        self.assertEqual(result[0], "invalid")
        self.assertIn("does not match version", result[1])

    def test_malformed_package_and_release_rows_fail_audit(self) -> None:
        with tempfile.TemporaryDirectory() as tmpdir:
            entity_dir = Path(tmpdir) / "entities"
            shutil.copytree(ENTITY_DIR, entity_dir)
            packages = audit.load_json(entity_dir / "packages.json")
            releases = audit.load_json(entity_dir / "releases.json")
            packages.append("not-an-object")
            releases.append("not-an-object")
            (entity_dir / "packages.json").write_text(json.dumps(packages), encoding="utf-8")
            (entity_dir / "releases.json").write_text(json.dumps(releases), encoding="utf-8")

            report = audit.build_audit(entity_dir, RELATIONSHIP_PATH)

        self.assertEqual(report["status"], "FAIL")
        self.assertTrue(any("packages[" in error and "expected object" in error for error in report["invalid_purls"]))
        self.assertTrue(any("releases[" in error and "expected object" in error for error in report["invalid_purls"]))

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

    def test_dangling_incident_source_fails_audit(self) -> None:
        relationships = audit.load_json(RELATIONSHIP_PATH)
        broken_relationships = copy.deepcopy(relationships)
        broken_relationships.append(
            {
                "source": "incident-SC-DOES-NOT-EXIST",
                "target": "pkg-npm-event-stream",
                "type": "AFFECTED_PACKAGE",
            }
        )
        with tempfile.TemporaryDirectory() as tmpdir:
            relationship_path = Path(tmpdir) / "relationships.json"
            relationship_path.write_text(json.dumps(broken_relationships), encoding="utf-8")

            report = audit.build_audit(ENTITY_DIR, relationship_path)

        self.assertEqual(report["status"], "FAIL")
        self.assertTrue(any("SC-DOES-NOT-EXIST" in error for error in report["dangling_incident_edges"]))

    def test_dangling_package_and_release_edges_fail_audit(self) -> None:
        relationships = audit.load_json(RELATIONSHIP_PATH)
        broken_relationships = copy.deepcopy(relationships)
        broken_relationships.extend(
            [
                {
                    "source": "incident-SC-2018-NPM-EVENT-STREAM",
                    "target": "pkg-does-not-exist",
                    "type": "AFFECTED_PACKAGE",
                },
                {
                    "source": "pkg-does-not-exist",
                    "target": "release-npm-flatmap-stream-0-1-1",
                    "type": "PACKAGE_RELEASE",
                },
                {
                    "source": "incident-SC-2018-NPM-EVENT-STREAM",
                    "target": "release-does-not-exist",
                    "type": "INCIDENT_AFFECTED_RELEASE",
                },
            ]
        )
        with tempfile.TemporaryDirectory() as tmpdir:
            relationship_path = Path(tmpdir) / "relationships.json"
            relationship_path.write_text(json.dumps(broken_relationships), encoding="utf-8")

            report = audit.build_audit(ENTITY_DIR, relationship_path)

        self.assertEqual(report["status"], "FAIL")
        self.assertTrue(any("pkg-does-not-exist" in error for error in report["dangling_package_edges"]))
        self.assertTrue(any("release-does-not-exist" in error for error in report["dangling_release_edges"]))

    def test_package_release_purl_mismatch_fails_audit(self) -> None:
        relationships = audit.load_json(RELATIONSHIP_PATH)
        broken_relationships = copy.deepcopy(relationships)
        broken_relationships.append(
            {
                "source": "pkg-npm-event-stream",
                "target": "release-npm-ctrl-tinycolor-4-1-1",
                "type": "PACKAGE_RELEASE",
            }
        )
        with tempfile.TemporaryDirectory() as tmpdir:
            relationship_path = Path(tmpdir) / "relationships.json"
            relationship_path.write_text(json.dumps(broken_relationships), encoding="utf-8")

            report = audit.build_audit(ENTITY_DIR, relationship_path)

        self.assertEqual(report["status"], "FAIL")
        self.assertTrue(any("PACKAGE_RELEASE PURL mismatch" in error for error in report["invalid_relationship_edges"]))

    def test_non_string_relationship_endpoints_fail_audit(self) -> None:
        relationships = audit.load_json(RELATIONSHIP_PATH)
        broken_relationships = copy.deepcopy(relationships)
        broken_relationships.append(
            {
                "source": ["pkg-npm-event-stream"],
                "target": ["release-npm-flatmap-stream-0-1-1"],
                "type": "PACKAGE_RELEASE",
            }
        )
        with tempfile.TemporaryDirectory() as tmpdir:
            relationship_path = Path(tmpdir) / "relationships.json"
            relationship_path.write_text(json.dumps(broken_relationships), encoding="utf-8")

            report = audit.build_audit(ENTITY_DIR, relationship_path)

        self.assertEqual(report["status"], "FAIL")
        self.assertTrue(any("PACKAGE_RELEASE source must be string" in error for error in report["invalid_relationship_edges"]))
        self.assertTrue(any("PACKAGE_RELEASE target must be string" in error for error in report["invalid_relationship_edges"]))

    def test_malformed_relationships_data_fails_audit(self) -> None:
        with tempfile.TemporaryDirectory() as tmpdir:
            relationship_path = Path(tmpdir) / "relationships.json"
            relationship_path.write_text(json.dumps({"not": "a list"}), encoding="utf-8")

            report = audit.build_audit(ENTITY_DIR, relationship_path)

        self.assertEqual(report["status"], "FAIL")
        self.assertIn("relationships: expected list", report["invalid_relationship_edges"])

    def test_malformed_relationship_rows_fail_audit(self) -> None:
        relationships = audit.load_json(RELATIONSHIP_PATH)
        broken_relationships = copy.deepcopy(relationships)
        broken_relationships.append("not-an-object")
        with tempfile.TemporaryDirectory() as tmpdir:
            relationship_path = Path(tmpdir) / "relationships.json"
            relationship_path.write_text(json.dumps(broken_relationships), encoding="utf-8")

            report = audit.build_audit(ENTITY_DIR, relationship_path)

        self.assertEqual(report["status"], "FAIL")
        self.assertTrue(any("expected object" in error for error in report["invalid_relationship_edges"]))

    def test_unknown_relationship_type_fails_audit(self) -> None:
        relationships = audit.load_json(RELATIONSHIP_PATH)
        broken_relationships = copy.deepcopy(relationships)
        broken_relationships.append(
            {
                "source": "pkg-npm-event-stream",
                "target": "release-npm-flatmap-stream-0-1-1",
                "type": "UNKNOWN_RELATIONSHIP_TYPE",
            }
        )
        with tempfile.TemporaryDirectory() as tmpdir:
            relationship_path = Path(tmpdir) / "relationships.json"
            relationship_path.write_text(json.dumps(broken_relationships), encoding="utf-8")

            report = audit.build_audit(ENTITY_DIR, relationship_path)

        self.assertEqual(report["status"], "FAIL")
        self.assertTrue(any("unknown relationship type" in error for error in report["invalid_relationship_edges"]))

    def test_seeded_by_edges_are_counted_and_validated(self) -> None:
        report = audit.build_audit(ENTITY_DIR, RELATIONSHIP_PATH)

        self.assertEqual(report["status"], "PASS")
        self.assertEqual(report["seeded_by_edge_count"], 8)
        self.assertEqual(report["invalid_seeded_by_edges"], [])

    def test_seeded_by_edge_requires_tier_and_evidence(self) -> None:
        relationships = audit.load_json(RELATIONSHIP_PATH)
        broken_relationships = copy.deepcopy(relationships)
        broken_relationships.append(
            {
                "source": "pkg-npm-rxnt-authentication",
                "target": "release-npm-ctrl-tinycolor-4-1-1",
                "type": "SEEDED_BY",
                "propagation_tier": "guessed",
                "evidence_refs": ["ref-does-not-exist"],
                "source_incident_id": "SC-2025-NPM-SHAI-HULUD",
                "summary": "Fixture creates an invalid propagation edge for audit coverage.",
            }
        )
        with tempfile.TemporaryDirectory() as tmpdir:
            relationship_path = Path(tmpdir) / "relationships.json"
            relationship_path.write_text(json.dumps(broken_relationships), encoding="utf-8")

            report = audit.build_audit(ENTITY_DIR, relationship_path)

        self.assertEqual(report["status"], "FAIL")
        self.assertTrue(any("propagation_tier" in error for error in report["invalid_seeded_by_edges"]))
        self.assertTrue(any("ref-does-not-exist" in error for error in report["invalid_seeded_by_edges"]))

    def test_seeded_by_edge_reports_unknown_source_incident(self) -> None:
        relationships = audit.load_json(RELATIONSHIP_PATH)
        broken_relationships = copy.deepcopy(relationships)
        broken_relationships.append(
            {
                "source": "pkg-npm-rxnt-authentication",
                "target": "release-npm-ctrl-tinycolor-4-1-1",
                "type": "SEEDED_BY",
                "propagation_tier": "temporal",
                "evidence_refs": ["ref-wiz-shai-hulud"],
                "source_incident_id": "SC-2099-NOT-REAL",
                "summary": "Fixture creates an invalid source incident for audit coverage.",
            }
        )
        with tempfile.TemporaryDirectory() as tmpdir:
            relationship_path = Path(tmpdir) / "relationships.json"
            relationship_path.write_text(json.dumps(broken_relationships), encoding="utf-8")

            report = audit.build_audit(ENTITY_DIR, relationship_path)

        self.assertEqual(report["status"], "FAIL")
        self.assertTrue(any("SC-2099-NOT-REAL" in error for error in report["invalid_seeded_by_edges"]))

    def test_seeded_by_cycle_fails_audit(self) -> None:
        relationships = audit.load_json(RELATIONSHIP_PATH)
        broken_relationships = copy.deepcopy(relationships)
        broken_relationships.append(
            {
                "source": "release-npm-ctrl-tinycolor-4-1-2",
                "target": "release-npm-ctrl-tinycolor-4-1-1",
                "type": "SEEDED_BY",
                "propagation_tier": "temporal",
                "evidence_refs": ["ref-wiz-shai-hulud"],
                "source_incident_id": "SC-2025-NPM-SHAI-HULUD",
                "summary": "Fixture creates a propagation cycle for audit coverage.",
            }
        )
        with tempfile.TemporaryDirectory() as tmpdir:
            relationship_path = Path(tmpdir) / "relationships.json"
            relationship_path.write_text(json.dumps(broken_relationships), encoding="utf-8")

            report = audit.build_audit(ENTITY_DIR, relationship_path)

        self.assertEqual(report["status"], "FAIL")
        self.assertTrue(any("SEEDED_BY cycle detected" in error for error in report["invalid_seeded_by_edges"]))

    def test_broken_actor_and_campaign_hrefs_fail_audit(self) -> None:
        with tempfile.TemporaryDirectory() as tmpdir:
            entity_dir = Path(tmpdir) / "entities"
            shutil.copytree(ENTITY_DIR, entity_dir)
            actors = audit.load_json(entity_dir / "actors.json")
            campaigns = audit.load_json(entity_dir / "campaigns.json")
            actors[0]["href"] = "/threat-actors/not-a-real-actor/"
            campaigns[0]["href"] = "/campaigns/not-a-real-campaign/"
            (entity_dir / "actors.json").write_text(json.dumps(actors), encoding="utf-8")
            (entity_dir / "campaigns.json").write_text(json.dumps(campaigns), encoding="utf-8")

            report = audit.build_audit(entity_dir, RELATIONSHIP_PATH)

        self.assertEqual(report["status"], "FAIL")
        self.assertTrue(any("not-a-real-actor" in error for error in report["broken_actor_hrefs"]))
        self.assertTrue(any("not-a-real-campaign" in error for error in report["broken_campaign_hrefs"]))

    def test_content_href_resolver_accepts_query_and_fragment(self) -> None:
        self.assertTrue(audit.content_href_exists("/threat-actors/sandworm/#timeline"))
        self.assertTrue(audit.content_href_exists("/campaigns/lazarus-3cx-supply-chain-compromise-2023/?view=graph"))

    def test_main_creates_report_parent_directory(self) -> None:
        with tempfile.TemporaryDirectory() as tmpdir:
            entity_dir = Path(tmpdir) / "entities"
            relationship_path = Path(tmpdir) / "relationships.json"
            report_path = Path(tmpdir) / "nested" / "audit.md"
            entity_dir.mkdir()
            for name in ("packages", "releases", "actors", "campaigns", "maintainers"):
                (entity_dir / f"{name}.json").write_text("[]", encoding="utf-8")
            incidents_path = Path(tmpdir) / "incidents.json"
            incidents_path.write_text("[]", encoding="utf-8")
            relationship_path.write_text("[]", encoding="utf-8")

            exit_code = audit.main(
                [
                    "--entity-dir",
                    str(entity_dir),
                    "--incidents",
                    str(incidents_path),
                    "--relationships",
                    str(relationship_path),
                    "--report",
                    str(report_path),
                ]
            )
            report_exists = report_path.exists()

        self.assertEqual(exit_code, 0)
        self.assertTrue(report_exists)

    def test_main_reports_invalid_json_without_traceback(self) -> None:
        with tempfile.TemporaryDirectory() as tmpdir:
            entity_dir = Path(tmpdir) / "entities"
            entity_dir.mkdir()
            for name in ("packages", "releases", "actors", "campaigns", "maintainers"):
                (entity_dir / f"{name}.json").write_text("[]", encoding="utf-8")
            incidents_path = Path(tmpdir) / "incidents.json"
            incidents_path.write_text("{bad-json", encoding="utf-8")
            relationship_path = Path(tmpdir) / "relationships.json"
            relationship_path.write_text("[]", encoding="utf-8")
            report_path = Path(tmpdir) / "audit.md"
            stderr = io.StringIO()

            with contextlib.redirect_stderr(stderr):
                exit_code = audit.main(
                    [
                        "--entity-dir",
                        str(entity_dir),
                        "--incidents",
                        str(incidents_path),
                        "--relationships",
                        str(relationship_path),
                        "--report",
                        str(report_path),
                    ]
                )

        self.assertEqual(exit_code, 1)
        self.assertIn("Error loading audit data", stderr.getvalue())


if __name__ == "__main__":
    unittest.main()
