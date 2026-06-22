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
MALWARE_FAMILY_PATH = REPO_ROOT / "data" / "supply-chain-malware-families" / "families.json"


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
    if not isinstance(entities, list):
        raise ValueError("entities must be a list")
    for entity in entities:
        if not isinstance(entity, dict):
            continue
        if entity.get("id") == entity_id:
            return entity
    raise ValueError(f"entity not found: {entity_id}")


class SupplyChainGraphTests(unittest.TestCase):
    def test_generated_graph_validates(self) -> None:
        corpus = load_json(CORPUS_PATH)
        entities_by_type = validator.load_entities(ENTITY_DIR)
        relationships = load_json(RELATIONSHIP_PATH)
        malware_families = load_json(MALWARE_FAMILY_PATH)

        self.assertEqual(validator.validate_graph(corpus, entities_by_type, relationships, malware_families), [])

    def test_malware_family_lineage_validates_and_rejects_cycles(self) -> None:
        corpus = load_json(CORPUS_PATH)
        entities_by_type = validator.load_entities(ENTITY_DIR)
        entity_ids = {entity["id"] for entities in entities_by_type.values() for entity in entities}
        raw_incident_ids = validator.collect_raw_incident_ids(corpus)
        malware_families = load_json(MALWARE_FAMILY_PATH)

        self.assertEqual(
            validator.validate_malware_families(
                malware_families,
                raw_incident_ids=raw_incident_ids,
                entity_ids=entity_ids,
            ),
            [],
        )

        cyclic = copy.deepcopy(malware_families)
        cyclic[0]["lineage_edges"].append(
            {
                "source": "strain-shai-hulud",
                "target": "strain-hades-shai-hulud",
                "type": "EVOLVED_FROM",
                "evidence_class": "confirmed",
                "confidence": "confirmed",
                "relation_kind": "evolution",
                "mutation_delta": ["cycle fixture"],
                "external_refs": [{"source_ref": "ref-wiz-shai-hulud"}],
                "summary": "Fixture edge that creates a lineage cycle.",
            }
        )

        self.assertTrue(
            any(
                "EVOLVED_FROM cycle detected" in error
                for error in validator.validate_malware_families(
                    cyclic,
                    raw_incident_ids=raw_incident_ids,
                    entity_ids=entity_ids,
                )
            )
        )

    def test_malware_family_validator_rejects_invalid_dates_and_non_list_fields(self) -> None:
        corpus = load_json(CORPUS_PATH)
        entities_by_type = validator.load_entities(ENTITY_DIR)
        entity_ids = {entity["id"] for entities in entities_by_type.values() for entity in entities}
        raw_incident_ids = validator.collect_raw_incident_ids(corpus)
        malware_families = load_json(MALWARE_FAMILY_PATH)
        malformed = copy.deepcopy(malware_families)
        malformed[0]["timeline_ticks"] = "not-a-list"
        malformed[0]["associated_actor_ids"] = "actor-teampcp"
        malformed[0]["strains"][0]["first_seen"] = "2025-99-99"
        malformed[0]["strains"][0]["incident_ids"] = "SC-2025-NPM-SHAI-HULUD"
        malformed[0]["fork_events"] = {"id": "fork-not-a-list"}
        malformed[0]["lineage_edges"][2]["suspected_reason"] = "   "
        malformed[0]["lineage_edges"][2]["external_refs"][0] = "not-an-object"
        malformed[0]["sources"].append(copy.deepcopy(malformed[0]["sources"][0]))

        errors = validator.validate_malware_families(
            malformed,
            raw_incident_ids=raw_incident_ids,
            entity_ids=entity_ids,
        )

        self.assertIn("family-shai-hulud.timeline_ticks: expected list", errors)
        self.assertIn("family-shai-hulud.associated_actor_ids: expected list", errors)
        self.assertIn("strain-shai-hulud.first_seen: expected YYYY-MM-DD or YYYY-MM", errors)
        self.assertIn("strain-shai-hulud.incident_ids: expected list", errors)
        self.assertIn("family-shai-hulud.fork_events: expected list", errors)
        self.assertIn("family-shai-hulud.sources[4].id: duplicate source id 'ref-wiz-shai-hulud'", errors)
        self.assertIn(
            "family-shai-hulud.lineage_edges[2].external_refs[0]: expected object",
            errors,
        )
        self.assertIn(
            "family-shai-hulud.lineage_edges[2].suspected_reason: suspected edges must explain uncertainty",
            errors,
        )

    def test_malware_family_validator_allows_single_strain_without_lineage_edges(self) -> None:
        corpus = load_json(CORPUS_PATH)
        entities_by_type = validator.load_entities(ENTITY_DIR)
        entity_ids = {entity["id"] for entities in entities_by_type.values() for entity in entities}
        raw_incident_ids = validator.collect_raw_incident_ids(corpus)
        malware_families = load_json(MALWARE_FAMILY_PATH)
        single_strain = copy.deepcopy(malware_families)
        single_strain[0]["strains"] = single_strain[0]["strains"][:1]
        single_strain[0]["fork_events"] = []
        single_strain[0].pop("lineage_edges", None)

        errors = validator.validate_malware_families(
            single_strain,
            raw_incident_ids=raw_incident_ids,
            entity_ids=entity_ids,
        )

        self.assertNotIn("family-shai-hulud.lineage_edges: expected non-empty list", errors)
        self.assertEqual(errors, [])

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
        self.assertIn("pkg-generic-x-trader", package_ids)
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
        self.assertNotIn(
            {
                "source": "incident-SC-2023-THREE-CX-DESKTOP",
                "target": "pkg-generic-x-trader",
                "type": "AFFECTED_PACKAGE",
            },
            graph["relationships"],
        )
        self.assertNotIn(
            {
                "source": "incident-SC-2023-THREE-CX-DESKTOP",
                "target": "org-trading-technologies",
                "type": "AFFECTED_ORGANIZATION",
            },
            graph["relationships"],
        )

    def test_builder_preserves_exact_release_versions_when_normalized_slugs_collide(self) -> None:
        corpus = [
            {
                "schema_version": "supply-chain-incident/1",
                "id": "SC-TEST-RELEASE-COLLISION",
                "title": "release collision fixture",
                "affected_components": [
                    {
                        "component_type": "package",
                        "ecosystem": "npm",
                        "name": "example-pkg",
                        "vendor": "example",
                        "package_url": "pkg:npm/example-pkg",
                    }
                ],
                "releases": [
                    {
                        "package_name": "example-pkg",
                        "ecosystem": "npm",
                        "purl": "pkg:npm/example-pkg@1.0.0-alpha.1",
                        "version": "1.0.0-alpha.1",
                        "published_at": "2026-01-01",
                        "malicious_range": "1.0.0-alpha.1",
                        "references": ["ref-example"],
                        "disclosed_at": "2026-01-02",
                    },
                    {
                        "package_name": "example-pkg",
                        "ecosystem": "npm",
                        "purl": "pkg:npm/example-pkg@1.0.0-alpha-1",
                        "version": "1.0.0-alpha-1",
                        "published_at": "2026-01-03",
                        "malicious_range": "1.0.0-alpha-1",
                        "references": ["ref-example"],
                        "disclosed_at": "2026-01-04",
                    },
                ],
                "references": [{"id": "ref-example", "title": "Example", "url": "https://example.com"}],
                "source_artifact_divergence": False,
            }
        ]

        graph = builder.build_graph(corpus)
        reversed_corpus = copy.deepcopy(corpus)
        reversed_corpus[0]["releases"] = list(reversed(reversed_corpus[0]["releases"]))
        reversed_graph = builder.build_graph(reversed_corpus)
        entities_by_type = {entity_type: graph[entity_type] for entity_type in validator.ENTITY_FILES}
        release_ids = {entity["id"] for entity in graph["releases"]}
        reversed_release_ids = {entity["id"] for entity in reversed_graph["releases"]}
        release_versions = {entity["version"] for entity in graph["releases"]}
        base_id = "release-npm-example-pkg-1-0-0-alpha-1"

        self.assertEqual(len(graph["releases"]), 2)
        self.assertEqual(release_versions, {"1.0.0-alpha.1", "1.0.0-alpha-1"})
        self.assertNotIn(base_id, release_ids)
        self.assertIn(f"{base_id}-v{builder.exact_version_suffix('1.0.0-alpha.1')}", release_ids)
        self.assertIn(f"{base_id}-v{builder.exact_version_suffix('1.0.0-alpha-1')}", release_ids)
        self.assertEqual(release_ids, reversed_release_ids)
        self.assertEqual(validator.validate_graph(corpus, entities_by_type, graph["relationships"]), [])

    def test_builder_preserves_seeded_by_context_for_duplicate_endpoint_pairs(self) -> None:
        corpus = load_json(CORPUS_PATH)
        shai_hulud = next(incident for incident in corpus if incident["id"] == "SC-2025-NPM-SHAI-HULUD")
        duplicate = copy.deepcopy(shai_hulud)
        duplicate["id"] = "SC-2099-NPM-SHAI-HULUD-DUPLICATE"
        duplicate["title"] = "Fixture duplicate Shai-Hulud propagation incident"
        edge = shai_hulud["propagation_edges"][0]

        graph = builder.build_graph([*corpus, duplicate])
        entities_by_type = {entity_type: graph[entity_type] for entity_type in validator.ENTITY_FILES}
        matching = [
            relationship
            for relationship in graph["relationships"]
            if relationship["type"] == "SEEDED_BY"
            and relationship["source"] == edge["source"]
            and relationship["target"] == edge["target"]
        ]

        self.assertEqual(
            {relationship["source_incident_id"] for relationship in matching},
            {"SC-2025-NPM-SHAI-HULUD", "SC-2099-NPM-SHAI-HULUD-DUPLICATE"},
        )
        self.assertEqual(validator.validate_graph([*corpus, duplicate], entities_by_type, graph["relationships"]), [])

    def test_builder_rejects_conflicting_duplicate_release_metadata(self) -> None:
        first = {
            "schema_version": "supply-chain-incident/1",
            "id": "SC-TEST-DUPLICATE-RELEASE-A",
            "title": "duplicate release fixture A",
            "affected_components": [
                {
                    "component_type": "package",
                    "ecosystem": "npm",
                    "name": "example-pkg",
                    "vendor": "example",
                    "package_url": "pkg:npm/example-pkg",
                }
            ],
            "releases": [
                {
                    "package_name": "example-pkg",
                    "ecosystem": "npm",
                    "purl": "pkg:npm/example-pkg@1.0.0",
                    "version": "1.0.0",
                    "published_at": "2026-01-01",
                    "malicious_range": "1.0.0",
                    "references": ["ref-example-a"],
                    "disclosed_at": "2026-01-02",
                }
            ],
            "source_artifact_divergence": False,
        }
        second = copy.deepcopy(first)
        second["id"] = "SC-TEST-DUPLICATE-RELEASE-B"
        second["releases"][0]["published_at"] = "2026-01-03"
        second["releases"][0]["references"] = ["ref-example-b"]

        with self.assertRaisesRegex(ValueError, "conflicting release metadata"):
            builder.build_graph([first, second])
        with self.assertRaisesRegex(ValueError, "conflicting release metadata"):
            builder.build_graph([second, first])

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
        flatmap_aliases = flatmap_stream.get("aliases") or []
        self.assertGreater(len(flatmap_aliases), 0)
        event_stream["aliases"].append(flatmap_aliases[0])
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
        tinycolor_release = find_entity(entities_by_type["releases"], "release-npm-ctrl-tinycolor-4-1-1")
        flatmap_release["purl"] = "pkg:npm/flatmap-stream"
        ua_parser_release["published_at"] = "2021-99-99"
        tinycolor_release.pop("disclosed_at", None)

        errors = validator.validate_graph(corpus, entities_by_type, relationships)

        self.assertTrue(any(".purl: expected versioned package URL" in error for error in errors))
        self.assertTrue(any(".published_at: expected YYYY-MM-DD date" in error for error in errors))
        self.assertTrue(any(".disclosed_at: missing required field" in error for error in errors))

    def test_release_entity_references_must_exist_in_source_incidents(self) -> None:
        corpus = load_json(CORPUS_PATH)
        entities_by_type = validator.load_entities(ENTITY_DIR)
        relationships = load_json(RELATIONSHIP_PATH)
        entities_by_type["releases"] = copy.deepcopy(entities_by_type["releases"])
        entities_by_type["releases"][0]["references"] = ["ref-does-not-exist"]

        errors = validator.validate_graph(corpus, entities_by_type, relationships)

        self.assertTrue(any(".references[0]: unknown source reference id 'ref-does-not-exist'" in error for error in errors))

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

    def test_seeded_by_edges_are_evidence_tiered_and_acyclic(self) -> None:
        corpus = load_json(CORPUS_PATH)
        entities_by_type = validator.load_entities(ENTITY_DIR)
        relationships = load_json(RELATIONSHIP_PATH)
        seeded_by = [item for item in relationships if item["type"] == "SEEDED_BY"]

        self.assertEqual(len(seeded_by), 8)
        self.assertTrue(all(item["source"].startswith(("pkg-", "release-")) for item in seeded_by))
        self.assertTrue(all(item["target"].startswith(("pkg-", "release-")) for item in seeded_by))
        self.assertTrue(all(item["propagation_tier"] in {"causal", "temporal"} for item in seeded_by))
        self.assertEqual(validator.validate_graph(corpus, entities_by_type, relationships), [])

    def test_seeded_by_relationship_failures_are_reported(self) -> None:
        corpus = load_json(CORPUS_PATH)
        entities_by_type = validator.load_entities(ENTITY_DIR)
        relationships = copy.deepcopy(load_json(RELATIONSHIP_PATH))
        relationships.append(
            {
                "source": "incident-SC-2025-NPM-SHAI-HULUD",
                "target": "pkg-npm-ctrl-tinycolor",
                "type": "SEEDED_BY",
                "propagation_tier": "inferred",
                "evidence_refs": [],
                "summary": "short",
            }
        )

        errors = validator.validate_graph(corpus, entities_by_type, relationships)

        self.assertTrue(any("SEEDED_BY must start from a package or release node" in error for error in errors))
        self.assertTrue(any(".propagation_tier: expected 'causal' or 'temporal'" in error for error in errors))
        self.assertTrue(any(".evidence_refs: expected non-empty list" in error for error in errors))
        self.assertTrue(any(".summary: expected evidence summary" in error for error in errors))
        self.assertTrue(any(".source_incident_id: expected string" in error for error in errors))

    def test_seeded_by_relationship_refs_must_resolve(self) -> None:
        corpus = load_json(CORPUS_PATH)
        entities_by_type = validator.load_entities(ENTITY_DIR)
        relationships = copy.deepcopy(load_json(RELATIONSHIP_PATH))
        relationships.append(
            {
                "source": "pkg-npm-rxnt-authentication",
                "target": "release-npm-ctrl-tinycolor-4-1-1",
                "type": "SEEDED_BY",
                "propagation_tier": "temporal",
                "evidence_refs": ["ref-does-not-exist"],
                "source_incident_id": "SC-2025-NPM-SHAI-HULUD",
                "summary": "Fixture creates an invalid propagation edge for validator coverage.",
            }
        )
        relationships.append(
            {
                "source": "pkg-npm-rxnt-authentication",
                "target": "release-npm-ctrl-tinycolor-4-1-1",
                "type": "SEEDED_BY",
                "propagation_tier": "temporal",
                "evidence_refs": ["ref-wiz-shai-hulud"],
                "source_incident_id": "SC-2099-NOT-REAL",
                "summary": "Fixture creates an unknown incident reference for validator coverage.",
            }
        )

        errors = validator.validate_graph(corpus, entities_by_type, relationships)

        self.assertTrue(any("unknown reference 'ref-does-not-exist'" in error for error in errors))
        self.assertTrue(any(".source_incident_id: unknown incident 'SC-2099-NOT-REAL'" in error for error in errors))

    def test_seeded_by_relationship_must_preserve_source_incident_context(self) -> None:
        corpus = load_json(CORPUS_PATH)
        entities_by_type = validator.load_entities(ENTITY_DIR)
        relationships = copy.deepcopy(load_json(RELATIONSHIP_PATH))
        seeded_by = next(item for item in relationships if item["type"] == "SEEDED_BY")
        seeded_by["source_incident_id"] = "SC-2018-NPM-EVENT-STREAM"
        seeded_by["evidence_refs"] = ["ref-github-event-stream-116"]

        errors = validator.validate_graph(corpus, entities_by_type, relationships)

        self.assertTrue(any("missing SEEDED_BY relationship" in error and "source_incident_id" in error for error in errors))

    def test_seeded_by_cycle_fails(self) -> None:
        corpus = load_json(CORPUS_PATH)
        entities_by_type = validator.load_entities(ENTITY_DIR)
        relationships = copy.deepcopy(load_json(RELATIONSHIP_PATH))
        relationships.append(
            {
                "source": "release-npm-ctrl-tinycolor-4-1-2",
                "target": "release-npm-ctrl-tinycolor-4-1-1",
                "type": "SEEDED_BY",
                "propagation_tier": "temporal",
                "evidence_refs": ["ref-wiz-shai-hulud"],
                "summary": "Fixture creates a propagation cycle for validator coverage.",
            }
        )

        errors = validator.validate_graph(corpus, entities_by_type, relationships)

        self.assertTrue(any("SEEDED_BY cycle detected" in error for error in errors))

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
        maintainer.pop("onboarding_date", None)
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


if __name__ == "__main__":
    unittest.main()
