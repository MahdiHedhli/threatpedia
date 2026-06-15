from __future__ import annotations

import copy
import importlib.util
import json
from pathlib import Path
import shutil
import tempfile
import unittest


REPO_ROOT = Path(__file__).resolve().parents[1]
ENTITY_DIR = REPO_ROOT / "data" / "supply-chain-entities"
RELATIONSHIP_PATH = REPO_ROOT / "data" / "supply-chain-relationships" / "relationships.json"
SITE_CONTENT_DIR = REPO_ROOT / "site" / "src" / "content"


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
        self.assertEqual(report["dangling_package_edges"], [])
        self.assertEqual(report["dangling_release_edges"], [])
        self.assertEqual(report["invalid_relationship_edges"], [])
        self.assertEqual(report["invalid_package_release_edges"], [])
        self.assertEqual(report["invalid_seeded_by_edges"], [])
        self.assertEqual(report["seeded_by_count"], 1)
        self.assertEqual(report["seeded_by_tier_counts"]["temporal"], 1)
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

    def test_package_release_purl_mismatch_fails_audit(self) -> None:
        relationships = audit.load_json(RELATIONSHIP_PATH)
        broken_relationships = copy.deepcopy(relationships)
        for relationship in broken_relationships:
            if relationship["type"] == "PACKAGE_RELEASE" and relationship["source"] == "pkg-npm-flatmap-stream":
                relationship["source"] = "pkg-npm-event-stream"
                break
        with tempfile.TemporaryDirectory() as tmpdir:
            relationship_path = Path(tmpdir) / "relationships.json"
            relationship_path.write_text(json.dumps(broken_relationships), encoding="utf-8")

            report = audit.build_audit(ENTITY_DIR, relationship_path)

        self.assertEqual(report["status"], "FAIL")
        self.assertTrue(any("PACKAGE_RELEASE PURL mismatch" in error for error in report["invalid_package_release_edges"]))

    def test_release_version_mismatch_fails_audit(self) -> None:
        with tempfile.TemporaryDirectory() as tmpdir:
            entity_dir = Path(tmpdir) / "entities"
            shutil.copytree(ENTITY_DIR, entity_dir)
            releases = audit.load_json(entity_dir / "releases.json")
            releases[0]["version"] = "definitely-not-the-purl-version"
            (entity_dir / "releases.json").write_text(json.dumps(releases), encoding="utf-8")

            report = audit.build_audit(entity_dir, RELATIONSHIP_PATH)

        self.assertEqual(report["status"], "FAIL")
        self.assertTrue(any("version does not match PURL version" in error for error in report["invalid_purls"]))

    def test_seeded_by_edges_require_evidence_tier_and_acyclic_graph(self) -> None:
        relationships = audit.load_json(RELATIONSHIP_PATH)
        broken_relationships = copy.deepcopy(relationships)
        broken_relationships.append(
            {
                "source": "release-npm-ctrl-tinycolor-4-1-2",
                "target": "release-npm-ctrl-tinycolor-4-1-1",
                "type": "SEEDED_BY",
                "tier": "temporal",
                "evidence_refs": ["ref-wiz-shai-hulud"],
            }
        )
        broken_relationships.append(
            {
                "source": "pkg-does-not-exist",
                "target": "release-npm-ctrl-tinycolor-4-1-1",
                "type": "SEEDED_BY",
                "tier": "guessed",
                "evidence_refs": [],
            }
        )
        with tempfile.TemporaryDirectory() as tmpdir:
            relationship_path = Path(tmpdir) / "relationships.json"
            relationship_path.write_text(json.dumps(broken_relationships), encoding="utf-8")

            report = audit.build_audit(ENTITY_DIR, relationship_path)

        self.assertEqual(report["status"], "FAIL")
        self.assertTrue(any("missing SEEDED_BY source" in error for error in report["invalid_seeded_by_edges"]))
        self.assertTrue(any("tier must be causal or temporal" in error for error in report["invalid_seeded_by_edges"]))
        self.assertTrue(any("evidence_refs must be non-empty" in error for error in report["invalid_seeded_by_edges"]))
        self.assertTrue(any("SEEDED_BY cycle detected" in error for error in report["invalid_seeded_by_edges"]))

    def test_seeded_by_rejects_generic_package_endpoint(self) -> None:
        relationships = audit.load_json(RELATIONSHIP_PATH)
        broken_relationships = copy.deepcopy(relationships)
        broken_relationships.append(
            {
                "source": "pkg-multiple-internal-dependency-names",
                "target": "release-npm-ctrl-tinycolor-4-1-1",
                "type": "SEEDED_BY",
                "tier": "temporal",
                "evidence_refs": ["ref-wiz-shai-hulud"],
            }
        )
        with tempfile.TemporaryDirectory() as tmpdir:
            relationship_path = Path(tmpdir) / "relationships.json"
            relationship_path.write_text(json.dumps(broken_relationships), encoding="utf-8")

            report = audit.build_audit(ENTITY_DIR, relationship_path)

        self.assertEqual(report["status"], "FAIL")
        self.assertTrue(any("not release-spine joinable" in error for error in report["invalid_seeded_by_edges"]))

    def test_actor_and_campaign_edges_require_existing_content_pages(self) -> None:
        with tempfile.TemporaryDirectory() as tmpdir:
            entity_dir = Path(tmpdir) / "entities"
            shutil.copytree(ENTITY_DIR, entity_dir)
            actors = audit.load_json(entity_dir / "actors.json")
            campaigns = audit.load_json(entity_dir / "campaigns.json")
            next(actor for actor in actors if actor["id"] == "actor-lazarus-group")["href"] = "/threat-actors/no-such-actor/"
            next(campaign for campaign in campaigns if campaign["id"] == "campaign-tp-camp-2023-0002")["href"] = "/campaigns/no-such-campaign/"
            (entity_dir / "actors.json").write_text(json.dumps(actors), encoding="utf-8")
            (entity_dir / "campaigns.json").write_text(json.dumps(campaigns), encoding="utf-8")

            report = audit.build_audit(entity_dir, RELATIONSHIP_PATH, SITE_CONTENT_DIR)

        self.assertEqual(report["status"], "FAIL")
        self.assertTrue(any("no-such-actor" in error for error in report["dangling_actor_edges"]))
        self.assertTrue(any("no-such-campaign" in error for error in report["dangling_campaign_edges"]))

    def test_actor_and_campaign_hrefs_must_be_routes_not_filenames(self) -> None:
        with tempfile.TemporaryDirectory() as tmpdir:
            entity_dir = Path(tmpdir) / "entities"
            shutil.copytree(ENTITY_DIR, entity_dir)
            actors = audit.load_json(entity_dir / "actors.json")
            campaigns = audit.load_json(entity_dir / "campaigns.json")
            next(actor for actor in actors if actor["id"] == "actor-lazarus-group")["href"] = "/threat-actors/lazarus-group.md/"
            next(campaign for campaign in campaigns if campaign["id"] == "campaign-tp-camp-2023-0002")["href"] = "/campaigns/3cx-supply-chain-compromise.md/"
            (entity_dir / "actors.json").write_text(json.dumps(actors), encoding="utf-8")
            (entity_dir / "campaigns.json").write_text(json.dumps(campaigns), encoding="utf-8")

            report = audit.build_audit(entity_dir, RELATIONSHIP_PATH, SITE_CONTENT_DIR)

        self.assertEqual(report["status"], "FAIL")
        self.assertTrue(any("lazarus-group.md" in error for error in report["dangling_actor_edges"]))
        self.assertTrue(any("3cx-supply-chain-compromise.md" in error for error in report["dangling_campaign_edges"]))

    def test_actor_and_campaign_hrefs_must_be_absolute_routes(self) -> None:
        with tempfile.TemporaryDirectory() as tmpdir:
            entity_dir = Path(tmpdir) / "entities"
            shutil.copytree(ENTITY_DIR, entity_dir)
            actors = audit.load_json(entity_dir / "actors.json")
            campaigns = audit.load_json(entity_dir / "campaigns.json")
            next(actor for actor in actors if actor["id"] == "actor-lazarus-group")["href"] = "threat-actors/lazarus-group/"
            next(campaign for campaign in campaigns if campaign["id"] == "campaign-tp-camp-2023-0002")["href"] = "campaigns/3cx-supply-chain-compromise/"
            (entity_dir / "actors.json").write_text(json.dumps(actors), encoding="utf-8")
            (entity_dir / "campaigns.json").write_text(json.dumps(campaigns), encoding="utf-8")

            report = audit.build_audit(entity_dir, RELATIONSHIP_PATH, SITE_CONTENT_DIR)

        self.assertEqual(report["status"], "FAIL")
        self.assertTrue(any("lazarus-group" in error for error in report["dangling_actor_edges"]))
        self.assertTrue(any("3cx-supply-chain-compromise" in error for error in report["dangling_campaign_edges"]))

    def test_provisional_actor_without_href_passes_audit(self) -> None:
        report = audit.build_audit(ENTITY_DIR, RELATIONSHIP_PATH, SITE_CONTENT_DIR)

        self.assertEqual(report["status"], "PASS")
        self.assertFalse(any("actor-unc-xz-utils-operator" in error for error in report["dangling_actor_edges"]))

    def test_main_creates_report_parent_directory(self) -> None:
        with tempfile.TemporaryDirectory() as tmpdir:
            entity_dir = Path(tmpdir) / "entities"
            relationship_path = Path(tmpdir) / "relationships.json"
            report_path = Path(tmpdir) / "nested" / "audit.md"
            shutil.copytree(ENTITY_DIR, entity_dir)
            relationship_path.write_text(RELATIONSHIP_PATH.read_text(encoding="utf-8"), encoding="utf-8")

            exit_code = audit.main(
                ["--entity-dir", str(entity_dir), "--relationships", str(relationship_path), "--report", str(report_path)]
            )
            report_exists = report_path.exists()

        self.assertEqual(exit_code, 0)
        self.assertTrue(report_exists)


if __name__ == "__main__":
    unittest.main()
