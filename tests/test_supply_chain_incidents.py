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

    def test_schema_enums_are_enforced(self) -> None:
        incident = copy.deepcopy(load_json(CORPUS_PATH)[0])
        incident["supply_chain_vectors"] = ["scoring"]
        incident["impact_categories"] = ["risk_engine"]

        errors = validator.validate_incident(incident)

        self.assertTrue(any(".supply_chain_vectors[0]: invalid value" in error for error in errors))
        self.assertTrue(any(".impact_categories[0]: invalid value" in error for error in errors))


if __name__ == "__main__":
    unittest.main()
