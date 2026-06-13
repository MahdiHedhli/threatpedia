from __future__ import annotations

import copy
import importlib.util
import json
from pathlib import Path
import unittest


REPO_ROOT = Path(__file__).resolve().parents[1]
CORPUS_PATH = REPO_ROOT / "data" / "supply-chain-incidents" / "incidents.json"
ENTITY_DIR = REPO_ROOT / "data" / "supply-chain-entities"
RELATIONSHIP_PATH = REPO_ROOT / "data" / "supply-chain-relationships" / "relationships.json"


def load_module(name: str, path: Path):
    spec = importlib.util.spec_from_file_location(name, path)
    if spec is None or spec.loader is None:
        raise RuntimeError(f"failed to load {path}")
    module = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(module)
    return module


builder = load_module("build_supply_chain_entities", REPO_ROOT / "scripts" / "build_supply_chain_entities.py")
validator = load_module("validate_supply_chain_graph", REPO_ROOT / "scripts" / "validate_supply_chain_graph.py")


def load_json(path: Path):
    return json.loads(path.read_text(encoding="utf-8"))


class SupplyChainGraphTests(unittest.TestCase):
    def test_generated_graph_validates(self) -> None:
        corpus = load_json(CORPUS_PATH)
        entities_by_type = validator.load_entities(ENTITY_DIR)
        relationships = load_json(RELATIONSHIP_PATH)

        self.assertEqual(validator.validate_graph(corpus, entities_by_type, relationships), [])

    def test_builder_extracts_expected_entities(self) -> None:
        graph = builder.build_graph(load_json(CORPUS_PATH))

        package_ids = {entity["id"] for entity in graph["packages"]}
        maintainer_ids = {entity["id"] for entity in graph["maintainers"]}
        organization_ids = {entity["id"] for entity in graph["organizations"]}
        repository_ids = {entity["id"] for entity in graph["repositories"]}
        build_system_ids = {entity["id"] for entity in graph["build_systems"]}
        channel_ids = {entity["id"] for entity in graph["distribution_channels"]}
        account_ids = {entity["id"] for entity in graph["accounts"]}

        self.assertGreaterEqual(len(graph["relationships"]), 90)
        self.assertIn("pkg-npm-event-stream", package_ids)
        self.assertIn("pkg-npm-flatmap-stream", package_ids)
        self.assertIn("maintainer-jia-tan", maintainer_ids)
        self.assertIn("maintainer-dominictarr", maintainer_ids)
        self.assertIn("org-codecov", organization_ids)
        self.assertIn("org-polyfill-io", organization_ids)
        self.assertIn("repo-github-com-dominictarr-event-stream", repository_ids)
        self.assertIn("build-github-github-actions", build_system_ids)
        self.assertIn("channel-npm-package-registry-npm-registry", channel_ids)
        self.assertIn("account-npm-eslint-scope-npm-maintainer-account", account_ids)

    def test_source_artifact_divergence_targets_distribution_channels(self) -> None:
        graph = builder.build_graph(load_json(CORPUS_PATH))
        relationships = [
            item
            for item in graph["relationships"]
            if item["type"] == "SOURCE_ARTIFACT_DIVERGENCE"
        ]

        self.assertGreaterEqual(len(relationships), 1)
        self.assertTrue(all(item["target"].startswith("channel-") for item in relationships))

    def test_invalid_relationship_target_fails(self) -> None:
        corpus = load_json(CORPUS_PATH)
        entities_by_type = validator.load_entities(ENTITY_DIR)
        relationships = copy.deepcopy(load_json(RELATIONSHIP_PATH))
        relationships[0]["target"] = "pkg-does-not-exist"

        errors = validator.validate_graph(corpus, entities_by_type, relationships)

        self.assertTrue(any("unknown target" in error for error in errors))

    def test_alias_collision_fails(self) -> None:
        corpus = load_json(CORPUS_PATH)
        entities_by_type = validator.load_entities(ENTITY_DIR)
        relationships = load_json(RELATIONSHIP_PATH)
        entities_by_type["packages"] = copy.deepcopy(entities_by_type["packages"])
        entities_by_type["packages"][0]["aliases"].append(entities_by_type["packages"][1]["aliases"][0])
        entities_by_type["packages"][0]["ecosystem"] = entities_by_type["packages"][1]["ecosystem"]

        errors = validator.validate_graph(corpus, entities_by_type, relationships)

        self.assertTrue(any("normalized alias" in error for error in errors))

    def test_package_alias_uniqueness_is_scoped_by_ecosystem(self) -> None:
        corpus = load_json(CORPUS_PATH)
        entities_by_type = validator.load_entities(ENTITY_DIR)
        relationships = load_json(RELATIONSHIP_PATH)
        entities_by_type["packages"] = copy.deepcopy(entities_by_type["packages"])
        first = entities_by_type["packages"][0]
        sibling = copy.deepcopy(first)
        sibling["id"] = "pkg-pypi-internal-dependency-names"
        sibling["ecosystem"] = "pypi"
        sibling["source_incident_ids"] = first["source_incident_ids"]
        entities_by_type["packages"].append(sibling)
        relationships = copy.deepcopy(relationships)
        relationships.append(
            {
                "source": f"incident-{sibling['source_incident_ids'][0]}",
                "target": sibling["id"],
                "type": "AFFECTED_PACKAGE",
            }
        )

        errors = validator.validate_graph(corpus, entities_by_type, relationships)

        self.assertFalse(any("normalized alias" in error for error in errors))

    def test_entity_source_incident_ids_must_exist(self) -> None:
        corpus = load_json(CORPUS_PATH)
        entities_by_type = validator.load_entities(ENTITY_DIR)
        relationships = load_json(RELATIONSHIP_PATH)
        entities_by_type["packages"] = copy.deepcopy(entities_by_type["packages"])
        entities_by_type["packages"][0]["source_incident_ids"] = ["SC-DOES-NOT-EXIST"]

        errors = validator.validate_graph(corpus, entities_by_type, relationships)

        self.assertTrue(any("unknown incident id 'SC-DOES-NOT-EXIST'" in error for error in errors))

    def test_package_entities_require_canonical_purls(self) -> None:
        corpus = load_json(CORPUS_PATH)
        entities_by_type = validator.load_entities(ENTITY_DIR)
        relationships = load_json(RELATIONSHIP_PATH)
        entities_by_type["packages"] = copy.deepcopy(entities_by_type["packages"])
        entities_by_type["packages"][0]["package_url"] = None

        errors = validator.validate_graph(corpus, entities_by_type, relationships)

        self.assertTrue(any(".package_url: expected non-empty string" in error for error in errors))

    def test_package_purl_validation_does_not_crash_on_malformed_entity_fields(self) -> None:
        corpus = load_json(CORPUS_PATH)
        entities_by_type = validator.load_entities(ENTITY_DIR)
        relationships = load_json(RELATIONSHIP_PATH)
        entities_by_type["packages"] = copy.deepcopy(entities_by_type["packages"])
        entities_by_type["packages"][0]["name"] = None
        entities_by_type["packages"][0]["ecosystem"] = None

        errors = validator.validate_graph(corpus, entities_by_type, relationships)

        self.assertTrue(any(".name: expected non-empty string" in error for error in errors))
        self.assertTrue(any(".ecosystem: expected non-empty string" in error for error in errors))

    def test_generic_package_entities_require_justification(self) -> None:
        corpus = load_json(CORPUS_PATH)
        entities_by_type = validator.load_entities(ENTITY_DIR)
        relationships = load_json(RELATIONSHIP_PATH)
        entities_by_type["packages"] = copy.deepcopy(entities_by_type["packages"])
        generic = next(entity for entity in entities_by_type["packages"] if entity["package_url"].startswith("pkg:generic/"))
        del generic["purl_justification"]

        errors = validator.validate_graph(corpus, entities_by_type, relationships)

        self.assertTrue(any(".purl_justification: expected non-empty generic PURL justification" in error for error in errors))

    def test_relationship_type_must_target_expected_entity_class(self) -> None:
        corpus = load_json(CORPUS_PATH)
        entities_by_type = validator.load_entities(ENTITY_DIR)
        relationships = copy.deepcopy(load_json(RELATIONSHIP_PATH))
        package_id = next(entity["id"] for entity in entities_by_type["packages"])
        for relationship in relationships:
            if relationship["type"] == "AFFECTED_ORGANIZATION":
                relationship["target"] = package_id
                break

        errors = validator.validate_graph(corpus, entities_by_type, relationships)

        self.assertTrue(any("AFFECTED_ORGANIZATION target must start with 'org-'" in error for error in errors))

    def test_github_repository_parser_skips_system_paths_and_normalizes_dot_git(self) -> None:
        self.assertIsNone(builder.github_repository_from_url("https://github.com/orgs/example/packages"))
        self.assertIsNone(builder.github_repository_from_url("https://github.com/advisories/GHSA-xxxx-yyyy-zzzz"))
        self.assertEqual(
            builder.github_repository_from_url("https://github.com/example/project.git/issues/1"),
            {
                "name": "example/project",
                "host": "github.com",
                "url": "https://github.com/example/project",
                "owner": "example",
            },
        )

    def test_unsupported_relationship_type_fails(self) -> None:
        corpus = load_json(CORPUS_PATH)
        entities_by_type = validator.load_entities(ENTITY_DIR)
        relationships = copy.deepcopy(load_json(RELATIONSHIP_PATH))
        relationships[0]["type"] = "SCORED"

        errors = validator.validate_graph(corpus, entities_by_type, relationships)

        self.assertTrue(any("invalid relationship type" in error for error in errors))

    def test_new_entity_type_required_fields_are_validated(self) -> None:
        corpus = load_json(CORPUS_PATH)
        entities_by_type = validator.load_entities(ENTITY_DIR)
        relationships = load_json(RELATIONSHIP_PATH)
        entities_by_type["accounts"] = copy.deepcopy(entities_by_type["accounts"])
        entities_by_type["build_systems"] = copy.deepcopy(entities_by_type["build_systems"])
        entities_by_type["distribution_channels"] = copy.deepcopy(entities_by_type["distribution_channels"])
        del entities_by_type["accounts"][0]["provider"]
        del entities_by_type["build_systems"][0]["category"]
        del entities_by_type["distribution_channels"][0]["ecosystem"]

        errors = validator.validate_graph(corpus, entities_by_type, relationships)

        self.assertTrue(any(".provider: expected non-empty string" in error for error in errors))
        self.assertTrue(any(".category: expected non-empty string" in error for error in errors))
        self.assertTrue(any(".ecosystem: expected non-empty string" in error for error in errors))

    def test_source_artifact_divergence_requires_relationship(self) -> None:
        corpus = load_json(CORPUS_PATH)
        entities_by_type = validator.load_entities(ENTITY_DIR)
        relationships = [
            relationship
            for relationship in load_json(RELATIONSHIP_PATH)
            if relationship["type"] != "SOURCE_ARTIFACT_DIVERGENCE"
        ]

        errors = validator.validate_graph(corpus, entities_by_type, relationships)

        self.assertTrue(any("missing SOURCE_ARTIFACT_DIVERGENCE relationship" in error for error in errors))


if __name__ == "__main__":
    unittest.main()
