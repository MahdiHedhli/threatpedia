from __future__ import annotations

import copy
import importlib.util
import json
from pathlib import Path
import unittest


REPO_ROOT = Path(__file__).resolve().parents[1]
VALIDATOR_PATH = REPO_ROOT / "scripts" / "validate_supply_chain_incidents.py"
CORPUS_PATH = REPO_ROOT / "data" / "supply-chain-incidents" / "incidents.json"
SCHEMA_PATH = REPO_ROOT / "data" / "supply-chain-incidents" / "schema.json"


def load_validator():
    spec = importlib.util.spec_from_file_location("validate_supply_chain_incidents", VALIDATOR_PATH)
    if spec is None or spec.loader is None:
        raise RuntimeError("failed to load supply-chain incident validator")
    module = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(module)
    return module


validator = load_validator()


def load_json(path: Path):
    return json.loads(path.read_text(encoding="utf-8"))


class SupplyChainIncidentValidationTests(unittest.TestCase):
    def test_current_corpus_validates(self) -> None:
        corpus = load_json(CORPUS_PATH)
        schema = load_json(SCHEMA_PATH)

        self.assertGreaterEqual(len(corpus), 25)
        self.assertEqual(validator.validate_schema_file(schema), [])
        self.assertEqual(validator.validate_corpus(corpus), [])

    def test_duplicate_ids_fail_validation(self) -> None:
        corpus = load_json(CORPUS_PATH)
        duplicate = copy.deepcopy(corpus[:2])
        duplicate[1]["id"] = duplicate[0]["id"]

        errors = validator.validate_corpus(duplicate)

        self.assertTrue(any("duplicate id" in error for error in errors))

    def test_required_fields_dates_and_references_are_enforced(self) -> None:
        incident = copy.deepcopy(load_json(CORPUS_PATH)[0])
        del incident["title"]
        del incident["confidence"]
        incident["disclosed_at"] = "not-a-date"
        incident["references"][0]["url"] = "not a url"

        errors = validator.validate_incident(incident)

        self.assertTrue(any(".title: missing required field" in error for error in errors))
        self.assertTrue(any(".confidence: missing required field" in error for error in errors))
        self.assertTrue(any(".disclosed_at: expected YYYY-MM-DD date" in error for error in errors))
        self.assertTrue(any(".references[0].url: expected http(s) URL" in error for error in errors))

    def test_missing_required_field_reports_once(self) -> None:
        incident = copy.deepcopy(load_json(CORPUS_PATH)[0])
        del incident["title"]

        errors = validator.validate_incident(incident)

        self.assertEqual([error for error in errors if ".title" in error], [f"{incident['id']}.title: missing required field"])

    def test_missing_nested_required_fields_report_once(self) -> None:
        incident = copy.deepcopy(load_json(CORPUS_PATH)[0])
        del incident["affected_components"][0]["ecosystem"]
        del incident["references"][0]["url"]

        errors = validator.validate_incident(incident)

        self.assertEqual(
            [error for error in errors if ".affected_components[0].ecosystem" in error],
            [f"{incident['id']}.affected_components[0].ecosystem: missing required field"],
        )
        self.assertEqual(
            [error for error in errors if ".references[0].url" in error],
            [f"{incident['id']}.references[0].url: missing required field"],
        )

    def test_empty_tags_are_allowed_by_schema_and_validator(self) -> None:
        incident = copy.deepcopy(load_json(CORPUS_PATH)[0])
        incident["tags"] = []

        errors = validator.validate_incident(incident)

        self.assertEqual([error for error in errors if ".tags" in error], [])

    def test_non_string_id_is_reported_without_crashing(self) -> None:
        incident = copy.deepcopy(load_json(CORPUS_PATH)[0])
        incident["id"] = None

        errors = validator.validate_incident(incident)

        self.assertTrue(any("<missing-id>.id: expected SC-YYYY-SLUG identifier" in error for error in errors))

    def test_dates_must_use_hyphenated_full_date_format(self) -> None:
        incident = copy.deepcopy(load_json(CORPUS_PATH)[0])
        incident["first_observed_at"] = "2024-W13-5"
        incident["disclosed_at"] = "20240329"
        incident["references"][0]["published_at"] = "20240329"

        errors = validator.validate_incident(incident)

        self.assertTrue(any(".first_observed_at: expected YYYY-MM-DD date" in error for error in errors))
        self.assertTrue(any(".disclosed_at: expected YYYY-MM-DD date" in error for error in errors))
        self.assertTrue(any(".references[0].published_at: expected YYYY-MM-DD date" in error for error in errors))

    def test_package_url_rejects_whitespace_and_partial_matches(self) -> None:
        incident = copy.deepcopy(load_json(CORPUS_PATH)[0])
        incident["affected_components"][0]["package_url"] = "pkg:npm/example package"

        errors = validator.validate_incident(incident)

        self.assertTrue(any(".affected_components[0].package_url: invalid canonical package URL" in error for error in errors))

    def test_package_components_require_canonical_purls(self) -> None:
        incident = copy.deepcopy(next(item for item in load_json(CORPUS_PATH) if item["id"] == "SC-2018-NPM-EVENT-STREAM"))
        incident["affected_components"][0]["package_url"] = None

        errors = validator.validate_incident(incident)

        self.assertTrue(any(".affected_components[0].package_url: expected canonical package URL" in error for error in errors))

    def test_package_purl_validation_does_not_crash_on_malformed_component_fields(self) -> None:
        incident = copy.deepcopy(next(item for item in load_json(CORPUS_PATH) if item["id"] == "SC-2018-NPM-EVENT-STREAM"))
        incident["affected_components"][0]["name"] = None
        incident["affected_components"][0]["ecosystem"] = None

        errors = validator.validate_incident(incident)

        self.assertTrue(any(".affected_components[0].name: expected non-empty string" in error for error in errors))
        self.assertTrue(any(".affected_components[0].ecosystem: expected non-empty string" in error for error in errors))

    def test_generic_package_purls_require_justification(self) -> None:
        incident = copy.deepcopy(next(item for item in load_json(CORPUS_PATH) if item["id"] == "SC-2021-DEPENDENCY-CONFUSION"))
        del incident["affected_components"][0]["purl_justification"]

        errors = validator.validate_incident(incident)

        self.assertTrue(any(".affected_components[0].purl_justification" in error for error in errors))

    def test_malformed_url_is_rejected_without_crashing(self) -> None:
        incident = copy.deepcopy(load_json(CORPUS_PATH)[0])
        incident["references"][0]["url"] = "https://example.com:bad-port"

        errors = validator.validate_incident(incident)

        self.assertTrue(any(".references[0].url: expected http(s) URL" in error for error in errors))

    def test_schema_enums_are_enforced(self) -> None:
        incident = copy.deepcopy(load_json(CORPUS_PATH)[0])
        incident["supply_chain_vectors"] = ["scoring"]
        incident["impact_categories"] = ["risk_engine"]
        incident["confidence"] = "score-10"
        incident["evidence_level"] = "ai"
        incident["attack_stage"] = "attribution"

        errors = validator.validate_incident(incident)

        self.assertTrue(any(".supply_chain_vectors[0]: invalid value" in error for error in errors))
        self.assertTrue(any(".impact_categories[0]: invalid value" in error for error in errors))
        self.assertTrue(any(".confidence: invalid value" in error for error in errors))
        self.assertTrue(any(".evidence_level: invalid value" in error for error in errors))
        self.assertTrue(any(".attack_stage: invalid value" in error for error in errors))

    def test_structured_depth_fields_are_enforced(self) -> None:
        incident = copy.deepcopy(next(item for item in load_json(CORPUS_PATH) if item["maintainers"]))
        incident["distribution_channels"][0]["name"] = ""
        incident["source_artifact_divergence"] = "yes"
        del incident["maintainers"][0]["id_slug"]

        errors = validator.validate_incident(incident)

        self.assertTrue(any(".distribution_channels[0].name: expected non-empty string" in error for error in errors))
        self.assertTrue(any(".source_artifact_divergence: expected boolean or null" in error for error in errors))
        self.assertTrue(any(".maintainers[0].id_slug: expected non-empty string" in error for error in errors))

    def test_unhashable_enum_items_do_not_crash_validation(self) -> None:
        incident = copy.deepcopy(load_json(CORPUS_PATH)[0])
        incident["supply_chain_vectors"] = [{}]

        errors = validator.validate_incident(incident)

        self.assertTrue(any(".supply_chain_vectors[0]: expected non-empty string" in error for error in errors))

    def test_schema_shape_errors_are_reported_without_crashing(self) -> None:
        self.assertEqual(validator.validate_schema_file({"properties": []}), ["schema.properties: expected object"])
        self.assertEqual(
            validator.validate_schema_file({"properties": {"schema_version": []}}),
            ["schema.properties.schema_version: expected object"],
        )

    def test_schema_required_fields_are_order_insensitive(self) -> None:
        schema = load_json(SCHEMA_PATH)
        schema["required"] = list(reversed(schema["required"]))

        self.assertEqual(validator.validate_schema_file(schema), [])

        schema["required"].pop()
        self.assertEqual(validator.validate_schema_file(schema), ["schema.required: does not match validator required fields"])

    def test_source_artifact_divergence_requires_distribution_channels(self) -> None:
        incident = copy.deepcopy(load_json(CORPUS_PATH)[0])
        incident["source_artifact_divergence"] = True
        incident["distribution_channels"] = []

        errors = validator.validate_incident(incident)

        self.assertTrue(
            any(".source_artifact_divergence: cannot be true when distribution_channels is empty" in error for error in errors)
        )

    def test_featured_incidents_require_editorial_fields(self) -> None:
        incident = copy.deepcopy(next(item for item in load_json(CORPUS_PATH) if item["id"] == "SC-2024-XZ-UTILS"))
        del incident["executive_summary"]

        errors = validator.validate_incident(incident)

        self.assertTrue(any(".executive_summary: missing required featured editorial field" in error for error in errors))

    def test_non_featured_incidents_do_not_require_editorial_fields(self) -> None:
        incident = copy.deepcopy(next(item for item in load_json(CORPUS_PATH) if item["id"] == "SC-2021-CODECOV-BASH-UPLOADER"))

        errors = validator.validate_incident(incident)

        self.assertFalse(any("editorial" in error for error in errors))

    def test_editorial_references_must_resolve(self) -> None:
        incident = copy.deepcopy(next(item for item in load_json(CORPUS_PATH) if item["id"] == "SC-2018-NPM-EVENT-STREAM"))
        incident["executive_summary"][0]["reference_ids"] = ["ref-missing"]

        errors = validator.validate_incident(incident)

        self.assertTrue(any("unknown reference ID 'ref-missing'" in error for error in errors))

    def test_editorial_timeline_dates_are_enforced(self) -> None:
        incident = copy.deepcopy(next(item for item in load_json(CORPUS_PATH) if item["id"] == "SC-2023-THREE-CX-DESKTOP"))
        incident["timeline"][0]["date"] = "2023-04-20/2023-03-22"

        errors = validator.validate_incident(incident)

        self.assertTrue(any(".timeline[0].date: expected YYYY-MM-DD date or YYYY-MM-DD/YYYY-MM-DD range" in error for error in errors))

    def test_editorial_timeline_dates_reject_compact_iso_forms(self) -> None:
        incident = copy.deepcopy(next(item for item in load_json(CORPUS_PATH) if item["id"] == "SC-2024-XZ-UTILS"))
        incident["timeline"][0]["date"] = "20240329"

        errors = validator.validate_incident(incident)

        self.assertTrue(any(".timeline[0].date: expected YYYY-MM-DD date or YYYY-MM-DD/YYYY-MM-DD range" in error for error in errors))


if __name__ == "__main__":
    unittest.main()
