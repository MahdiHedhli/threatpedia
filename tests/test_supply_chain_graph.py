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


def find_entity(entities: list[dict], entity_id: str) -> dict:
    for entity in entities:
        if entity.get("id") == entity_id:
            return entity
    raise ValueError(f"entity not found: {entity_id}")


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
        actor_ids = {entity["id"] for entity in graph["actors"]}
        campaign_ids = {entity["id"] for entity in graph["campaigns"]}
        release_ids = {entity["id"] for entity in graph["releases"]}

        self.assertGreaterEqual(len(graph["relationships"]), 100)
        self.assertIn("pkg-npm-event-stream", package_ids)
        self.assertIn("pkg-npm-flatmap-stream", package_ids)
        self.assertIn("pkg-npm-ctrl-tinycolor", package_ids)
        self.assertIn("pkg-golang-github-com-boltdb-go-bolt", package_ids)
        self.assertIn("release-npm-flatmap-stream-0-1-1", release_ids)
        self.assertIn("release-npm-ua-parser-js-0-7-29", release_ids)
        self.assertIn("release-npm-ctrl-tinycolor-4-1-1", release_ids)
        self.assertIn("release-golang-github-com-boltdb-go-bolt-v1-3-1", release_ids)
        self.assertIn("maintainer-jia-tan", maintainer_ids)
        self.assertIn("maintainer-dominictarr", maintainer_ids)
        self.assertIn("org-codecov", organization_ids)
        self.assertIn("org-polyfill-io", organization_ids)
        self.assertIn("repo-github-com-dominictarr-event-stream", repository_ids)
        self.assertIn("build-github-github-actions", build_system_ids)
        self.assertIn("channel-npm-package-registry-npm-registry", channel_ids)
        self.assertIn("account-npm-eslint-scope-npm-maintainer-account", account_ids)
        self.assertIn("actor-unc-xz-utils-operator", actor_ids)
        self.assertIn("actor-lazarus-group", actor_ids)
        self.assertIn("actor-shai-hulud-operator", actor_ids)
        self.assertIn("actor-boltdb-go-operator", actor_ids)
        self.assertIn("campaign-tp-camp-2023-0002", campaign_ids)
        self.assertIn(
            {
                "source": "maintainer-dominictarr",
                "target": "repo-github-com-dominictarr-event-stream",
                "type": "MAINTAINS_REPOSITORY",
            },
            graph["relationships"],
        )
        self.assertIn(
            {
                "source": "release-npm-ctrl-tinycolor-4-1-1",
                "target": "release-npm-ctrl-tinycolor-4-1-2",
                "type": "SEEDED_BY",
                "tier": "temporal",
                "evidence_refs": ["ref-npm-tinycolor-registry", "ref-wiz-shai-hulud"],
                "incident_id": "SC-2025-NPM-SHAI-HULUD",
                "notes": "Same-day malicious release ordering is modeled as temporal precedence only; this edge does not assert direct causation between the two releases.",
            },
            graph["relationships"],
        )

    def test_builder_uses_highest_actor_confidence_across_incidents(self) -> None:
        corpus = copy.deepcopy(load_json(CORPUS_PATH))
        first = next(item for item in corpus if item["id"] == "SC-2024-XZ-UTILS")
        second = copy.deepcopy(first)
        second["id"] = "SC-2024-XZ-UTILS-SIBLING"
        second["threat_actors"][0]["confidence"] = "confirmed"
        graph = builder.build_graph([first, second])
        actor = find_entity(graph["actors"], "actor-unc-xz-utils-operator")

        self.assertEqual(actor["attribution_confidence"], "confirmed")

    def test_actor_and_campaign_aliases_include_canonical_names(self) -> None:
        actors: dict[str, dict] = {}
        campaigns: dict[str, dict] = {}
        actor_id = builder.upsert_actor(
            actors,
            {
                "id": "actor-example",
                "name": "Example Actor",
                "actor_type": "public",
                "confidence": "suspected",
                "aliases": ["Alias Only"],
                "href": "/threat-actors/example/",
            },
            "SC-2024-XZ-UTILS",
        )
        builder.upsert_actor(
            actors,
            {
                "id": "actor-example",
                "name": "Example Actor",
                "actor_type": "public",
                "confidence": "confirmed",
                "aliases": ["Second Alias"],
                "notes": "Later incident adds notes.",
            },
            "SC-2024-XZ-UTILS-SIBLING",
        )
        campaign_id = builder.upsert_campaign(
            campaigns,
            {
                "id": "campaign-example",
                "campaign_id": "TP-CAMP-2024-9999",
                "name": "Example Campaign",
                "slug": "example-campaign",
                "aliases": ["Campaign Alias"],
            },
            "SC-2024-XZ-UTILS",
        )

        self.assertEqual(actor_id, "actor-example")
        self.assertIn("Example Actor", actors["actor-example"]["aliases"])
        self.assertIn("Second Alias", actors["actor-example"]["aliases"])
        self.assertEqual(actors["actor-example"]["href"], "/threat-actors/example/")
        self.assertEqual(actors["actor-example"]["notes"], "Later incident adds notes.")
        self.assertEqual(actors["actor-example"]["attribution_confidence"], "confirmed")
        self.assertEqual(campaign_id, "campaign-example")
        self.assertIn("Example Campaign", campaigns["campaign-example"]["aliases"])
        self.assertIn("TP-CAMP-2024-9999", campaigns["campaign-example"]["aliases"])

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
        event_stream = find_entity(entities_by_type["packages"], "pkg-npm-event-stream")
        flatmap_stream = find_entity(entities_by_type["packages"], "pkg-npm-flatmap-stream")
        event_stream["aliases"].append(flatmap_stream["aliases"][0])
        event_stream["ecosystem"] = flatmap_stream["ecosystem"]

        errors = validator.validate_graph(corpus, entities_by_type, relationships)

        self.assertTrue(any("normalized alias" in error for error in errors))

    def test_package_alias_uniqueness_is_scoped_by_ecosystem(self) -> None:
        corpus = load_json(CORPUS_PATH)
        entities_by_type = validator.load_entities(ENTITY_DIR)
        relationships = load_json(RELATIONSHIP_PATH)
        entities_by_type["packages"] = copy.deepcopy(entities_by_type["packages"])
        first = find_entity(entities_by_type["packages"], "pkg-multiple-internal-dependency-names")
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
        find_entity(entities_by_type["packages"], "pkg-npm-event-stream")["source_incident_ids"] = ["SC-DOES-NOT-EXIST"]

        errors = validator.validate_graph(corpus, entities_by_type, relationships)

        self.assertTrue(any("unknown incident id 'SC-DOES-NOT-EXIST'" in error for error in errors))

    def test_package_entities_require_canonical_purls(self) -> None:
        corpus = load_json(CORPUS_PATH)
        entities_by_type = validator.load_entities(ENTITY_DIR)
        relationships = load_json(RELATIONSHIP_PATH)
        entities_by_type["packages"] = copy.deepcopy(entities_by_type["packages"])
        find_entity(entities_by_type["packages"], "pkg-npm-event-stream")["package_url"] = None

        errors = validator.validate_graph(corpus, entities_by_type, relationships)

        self.assertTrue(any(".package_url: expected non-empty string" in error for error in errors))

    def test_package_purl_validation_does_not_crash_on_malformed_entity_fields(self) -> None:
        corpus = load_json(CORPUS_PATH)
        entities_by_type = validator.load_entities(ENTITY_DIR)
        relationships = load_json(RELATIONSHIP_PATH)
        entities_by_type["packages"] = copy.deepcopy(entities_by_type["packages"])
        package = find_entity(entities_by_type["packages"], "pkg-npm-event-stream")
        package["name"] = None
        package["ecosystem"] = None

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

    def test_release_entities_require_versioned_canonical_purls(self) -> None:
        corpus = load_json(CORPUS_PATH)
        entities_by_type = validator.load_entities(ENTITY_DIR)
        relationships = load_json(RELATIONSHIP_PATH)
        entities_by_type["releases"] = copy.deepcopy(entities_by_type["releases"])
        flatmap_release = find_entity(entities_by_type["releases"], "release-npm-flatmap-stream-0-1-1")
        ua_parser_release = find_entity(entities_by_type["releases"], "release-npm-ua-parser-js-0-7-29")
        flatmap_release["purl"] = "pkg:npm/flatmap-stream"
        ua_parser_release["published_at"] = "2021-99-99"

        errors = validator.validate_graph(corpus, entities_by_type, relationships)

        self.assertTrue(any(".purl: expected versioned package URL" in error for error in errors))
        self.assertTrue(any(".published_at: expected YYYY-MM-DD date" in error for error in errors))

    def test_release_entities_require_disclosed_at_presence(self) -> None:
        corpus = load_json(CORPUS_PATH)
        entities_by_type = validator.load_entities(ENTITY_DIR)
        relationships = load_json(RELATIONSHIP_PATH)
        entities_by_type["releases"] = copy.deepcopy(entities_by_type["releases"])
        del find_entity(entities_by_type["releases"], "release-npm-flatmap-stream-0-1-1")["disclosed_at"]

        errors = validator.validate_graph(corpus, entities_by_type, relationships)

        self.assertTrue(any(".disclosed_at: missing required field" in error for error in errors))

    def test_release_purl_validation_does_not_crash_on_malformed_identity_fields(self) -> None:
        corpus = load_json(CORPUS_PATH)
        entities_by_type = validator.load_entities(ENTITY_DIR)
        relationships = load_json(RELATIONSHIP_PATH)
        entities_by_type["releases"] = copy.deepcopy(entities_by_type["releases"])
        entities_by_type["releases"][0]["package_name"] = None
        entities_by_type["releases"][0]["ecosystem"] = None
        entities_by_type["releases"][0]["published_at"] = "2021-99-99"
        entities_by_type["releases"][0]["malicious_range"] = ""
        entities_by_type["releases"][0]["references"] = []

        errors = validator.validate_graph(corpus, entities_by_type, relationships)

        self.assertTrue(any(".package_name: expected non-empty string" in error for error in errors))
        self.assertTrue(any(".ecosystem: expected non-empty string" in error for error in errors))
        self.assertTrue(any(".published_at: expected YYYY-MM-DD date" in error for error in errors))
        self.assertTrue(any(".malicious_range: expected non-empty string or null" in error for error in errors))
        self.assertTrue(any(".references: expected non-empty list" in error for error in errors))

    def test_release_relationship_sources_are_bounded(self) -> None:
        corpus = load_json(CORPUS_PATH)
        entities_by_type = validator.load_entities(ENTITY_DIR)
        relationships = copy.deepcopy(load_json(RELATIONSHIP_PATH))
        relationships.append(
            {
                "source": "incident-SC-2018-NPM-EVENT-STREAM",
                "target": "release-npm-flatmap-stream-0-1-1",
                "type": "PACKAGE_RELEASE",
            }
        )
        relationships.append(
            {
                "source": "pkg-npm-flatmap-stream",
                "target": "release-npm-flatmap-stream-0-1-1",
                "type": "INCIDENT_AFFECTED_RELEASE",
            }
        )

        errors = validator.validate_graph(corpus, entities_by_type, relationships)

        self.assertTrue(any("PACKAGE_RELEASE must start from a package node" in error for error in errors))
        self.assertTrue(any("INCIDENT_AFFECTED_RELEASE must start from an incident node" in error for error in errors))

    def test_package_release_relationship_purls_must_match(self) -> None:
        corpus = load_json(CORPUS_PATH)
        entities_by_type = validator.load_entities(ENTITY_DIR)
        relationships = copy.deepcopy(load_json(RELATIONSHIP_PATH))
        for relationship in relationships:
            if relationship["type"] == "PACKAGE_RELEASE" and relationship["source"] == "pkg-npm-flatmap-stream":
                relationship["source"] = "pkg-npm-event-stream"
                break

        errors = validator.validate_graph(corpus, entities_by_type, relationships)

        self.assertTrue(any("PACKAGE_RELEASE PURL mismatch" in error for error in errors))

    def test_maintainer_relationship_sources_are_bounded(self) -> None:
        corpus = load_json(CORPUS_PATH)
        entities_by_type = validator.load_entities(ENTITY_DIR)
        relationships = copy.deepcopy(load_json(RELATIONSHIP_PATH))
        relationships.append(
            {
                "source": "incident-SC-2018-NPM-EVENT-STREAM",
                "target": "repo-github-com-dominictarr-event-stream",
                "type": "MAINTAINS_REPOSITORY",
            }
        )
        relationships.append(
            {
                "source": "incident-SC-2018-NPM-EVENT-STREAM",
                "target": "account-npm-eslint-scope-npm-maintainer-account",
                "type": "USES_ACCOUNT",
            }
        )

        errors = validator.validate_graph(corpus, entities_by_type, relationships)

        self.assertTrue(any("MAINTAINS_REPOSITORY must start from a maintainer node" in error for error in errors))
        self.assertTrue(any("USES_ACCOUNT must start from a maintainer node" in error for error in errors))

    def test_maintainer_entities_require_anchor_fields_and_implied_edges(self) -> None:
        corpus = load_json(CORPUS_PATH)
        entities_by_type = validator.load_entities(ENTITY_DIR)
        relationships = copy.deepcopy(load_json(RELATIONSHIP_PATH))
        entities_by_type["maintainers"] = copy.deepcopy(entities_by_type["maintainers"])
        maintainer = find_entity(entities_by_type["maintainers"], "maintainer-dominictarr")
        del maintainer["onboarding_date"]
        maintainer["first_publish_date"] = "2018-99-99"
        maintainer["repositories"] = ["pkg-not-a-repository"]
        maintainer["account_ids"] = ["repo-not-an-account"]
        relationships = [
            relationship
            for relationship in relationships
            if not (
                relationship["source"] == "maintainer-dominictarr"
                and relationship["target"] == "repo-github-com-dominictarr-event-stream"
                and relationship["type"] == "MAINTAINS_REPOSITORY"
            )
        ]

        errors = validator.validate_graph(corpus, entities_by_type, relationships)

        self.assertTrue(any(".onboarding_date: missing required field" in error for error in errors))
        self.assertTrue(any(".first_publish_date: expected YYYY-MM-DD date or null" in error for error in errors))
        self.assertTrue(any(".repositories[0]: expected repo-* entity id" in error for error in errors))
        self.assertTrue(any(".account_ids[0]: expected account-* entity id" in error for error in errors))
        self.assertTrue(any("missing MAINTAINS_REPOSITORY relationship" in error for error in errors))

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

    def test_dangling_actor_and_campaign_edges_fail(self) -> None:
        corpus = load_json(CORPUS_PATH)
        entities_by_type = validator.load_entities(ENTITY_DIR)
        relationships = copy.deepcopy(load_json(RELATIONSHIP_PATH))
        relationships.append(
            {
                "source": "incident-SC-2024-XZ-UTILS",
                "target": "actor-does-not-exist",
                "type": "ATTRIBUTED_TO_ACTOR",
            }
        )
        relationships.append(
            {
                "source": "incident-SC-2023-THREE-CX-DESKTOP",
                "target": "campaign-does-not-exist",
                "type": "RELATED_CAMPAIGN",
            }
        )

        errors = validator.validate_graph(corpus, entities_by_type, relationships)

        self.assertTrue(any("unknown target 'actor-does-not-exist'" in error for error in errors))
        self.assertTrue(any("unknown target 'campaign-does-not-exist'" in error for error in errors))

    def test_actor_and_campaign_relationship_sources_are_bounded(self) -> None:
        corpus = load_json(CORPUS_PATH)
        entities_by_type = validator.load_entities(ENTITY_DIR)
        relationships = copy.deepcopy(load_json(RELATIONSHIP_PATH))
        relationships.append(
            {
                "source": "pkg-npm-event-stream",
                "target": "actor-lazarus-group",
                "type": "ATTRIBUTED_TO_ACTOR",
            }
        )
        relationships.append(
            {
                "source": "maintainer-jia-tan",
                "target": "campaign-tp-camp-2023-0002",
                "type": "RELATED_CAMPAIGN",
            }
        )

        errors = validator.validate_graph(corpus, entities_by_type, relationships)

        self.assertTrue(any("ATTRIBUTED_TO_ACTOR must start from an incident or maintainer node" in error for error in errors))
        self.assertTrue(any("RELATED_CAMPAIGN must start from an incident node" in error for error in errors))

    def test_incident_attribution_links_require_incident_scoped_relationships(self) -> None:
        corpus = load_json(CORPUS_PATH)
        entities_by_type = validator.load_entities(ENTITY_DIR)
        relationships = [
            relationship
            for relationship in copy.deepcopy(load_json(RELATIONSHIP_PATH))
            if not (
                relationship["source"] == "incident-SC-2024-XZ-UTILS"
                and relationship["target"] == "actor-unc-xz-utils-operator"
                and relationship["type"] == "ATTRIBUTED_TO_ACTOR"
            )
            and not (
                relationship["source"] == "incident-SC-2023-THREE-CX-DESKTOP"
                and relationship["target"] == "campaign-tp-camp-2023-0002"
                and relationship["type"] == "RELATED_CAMPAIGN"
            )
        ]

        errors = validator.validate_graph(corpus, entities_by_type, relationships)

        self.assertTrue(
            any("missing ATTRIBUTED_TO_ACTOR relationship for actor-unc-xz-utils-operator" in error for error in errors)
        )
        self.assertTrue(
            any("missing RELATED_CAMPAIGN relationship for campaign-tp-camp-2023-0002" in error for error in errors)
        )

    def test_actor_entity_refs_require_graph_relationships(self) -> None:
        corpus = load_json(CORPUS_PATH)
        entities_by_type = validator.load_entities(ENTITY_DIR)
        relationships = [
            relationship
            for relationship in copy.deepcopy(load_json(RELATIONSHIP_PATH))
            if not (
                relationship["source"] == "maintainer-jia-tan"
                and relationship["target"] == "actor-unc-xz-utils-operator"
                and relationship["type"] == "ATTRIBUTED_TO_ACTOR"
            )
        ]

        errors = validator.validate_graph(corpus, entities_by_type, relationships)

        self.assertTrue(
            any(
                "missing ATTRIBUTED_TO_ACTOR relationship from maintainer-jia-tan to actor-unc-xz-utils-operator" in error
                for error in errors
            )
        )

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

    def test_seeded_by_requires_valid_metadata_and_endpoints(self) -> None:
        corpus = load_json(CORPUS_PATH)
        entities_by_type = validator.load_entities(ENTITY_DIR)
        relationships = copy.deepcopy(load_json(RELATIONSHIP_PATH))
        relationships.append(
            {
                "source": "incident-SC-2025-NPM-SHAI-HULUD",
                "target": "release-npm-ctrl-tinycolor-4-1-1",
                "type": "SEEDED_BY",
                "tier": "guessed",
                "evidence_refs": [],
            }
        )

        errors = validator.validate_graph(corpus, entities_by_type, relationships)

        self.assertTrue(any("SEEDED_BY must start from a package or release node" in error for error in errors))
        self.assertTrue(any(".tier: expected one of" in error for error in errors))
        self.assertTrue(any(".evidence_refs: expected non-empty reference list" in error for error in errors))

    def test_seeded_by_missing_generated_relationship_fails(self) -> None:
        corpus = load_json(CORPUS_PATH)
        entities_by_type = validator.load_entities(ENTITY_DIR)
        relationships = [
            relationship
            for relationship in copy.deepcopy(load_json(RELATIONSHIP_PATH))
            if relationship["type"] != "SEEDED_BY"
        ]

        errors = validator.validate_graph(corpus, entities_by_type, relationships)

        self.assertTrue(any("missing SEEDED_BY relationship" in error for error in errors))

    def test_seeded_by_rejects_generic_package_endpoint(self) -> None:
        corpus = load_json(CORPUS_PATH)
        entities_by_type = validator.load_entities(ENTITY_DIR)
        relationships = copy.deepcopy(load_json(RELATIONSHIP_PATH))
        relationships.append(
            {
                "source": "pkg-multiple-internal-dependency-names",
                "target": "release-npm-ctrl-tinycolor-4-1-1",
                "type": "SEEDED_BY",
                "tier": "temporal",
                "evidence_refs": ["ref-wiz-shai-hulud"],
            }
        )

        errors = validator.validate_graph(corpus, entities_by_type, relationships)

        self.assertTrue(any("SEEDED_BY package endpoint must be release-spine joinable" in error for error in errors))

    def test_seeded_by_cycle_fails(self) -> None:
        corpus = load_json(CORPUS_PATH)
        entities_by_type = validator.load_entities(ENTITY_DIR)
        relationships = copy.deepcopy(load_json(RELATIONSHIP_PATH))
        relationships.append(
            {
                "source": "release-npm-ctrl-tinycolor-4-1-2",
                "target": "release-npm-ctrl-tinycolor-4-1-1",
                "type": "SEEDED_BY",
                "tier": "temporal",
                "evidence_refs": ["ref-wiz-shai-hulud"],
            }
        )

        errors = validator.validate_graph(corpus, entities_by_type, relationships)

        self.assertTrue(any("SEEDED_BY cycle detected" in error for error in errors))


if __name__ == "__main__":
    unittest.main()
