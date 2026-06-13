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
        incident["disclosed_at"] = "not-a-date"
        incident["references"][0]["url"] = "not a url"

        errors = validator.validate_incident(incident)

        self.assertTrue(any(".title: missing required field" in error for error in errors))
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

        self.assertTrue(any(".affected_components[0].package_url: expected null or package URL" in error for error in errors))

    def test_malformed_url_is_rejected_without_crashing(self) -> None:
        incident = copy.deepcopy(load_json(CORPUS_PATH)[0])
        incident["references"][0]["url"] = "https://example.com:bad-port"

        errors = validator.validate_incident(incident)

        self.assertTrue(any(".references[0].url: expected http(s) URL" in error for error in errors))

    def test_schema_enums_are_enforced(self) -> None:
        incident = copy.deepcopy(load_json(CORPUS_PATH)[0])
        incident["supply_chain_vectors"] = ["scoring"]
        incident["impact_categories"] = ["risk_engine"]

        errors = validator.validate_incident(incident)

        self.assertTrue(any(".supply_chain_vectors[0]: invalid value" in error for error in errors))
        self.assertTrue(any(".impact_categories[0]: invalid value" in error for error in errors))

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


if __name__ == "__main__":
    unittest.main()
