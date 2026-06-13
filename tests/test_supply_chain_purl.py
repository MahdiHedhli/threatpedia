from __future__ import annotations

import importlib.util
from pathlib import Path
import unittest


REPO_ROOT = Path(__file__).resolve().parents[1]
PURL_PATH = REPO_ROOT / "scripts" / "supply_chain_purl.py"


def load_purl_module():
    spec = importlib.util.spec_from_file_location("supply_chain_purl", PURL_PATH)
    if spec is None or spec.loader is None:
        raise RuntimeError("failed to load supply_chain_purl")
    module = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(module)
    return module


purl = load_purl_module()


class SupplyChainPurlTests(unittest.TestCase):
    def test_npm_purls_are_canonicalized(self) -> None:
        self.assertEqual(purl.purl_for_package("npm", "Event-Stream"), "pkg:npm/event-stream")
        self.assertEqual(purl.purl_for_package("npm", "@LedgerHQ/Connect-Kit"), "pkg:npm/%40ledgerhq/connect-kit")
        self.assertEqual(
            purl.canonicalize_purl("pkg:npm/%40LedgerHQ/connect-kit", ecosystem="npm", package_name="@ledgerhq/connect-kit"),
            "pkg:npm/%40ledgerhq/connect-kit",
        )

    def test_pypi_names_use_pep_503_style_normalization(self) -> None:
        self.assertEqual(purl.purl_for_package("pypi", "Torch_Trition.Name"), "pkg:pypi/torch-trition-name")

    def test_go_module_purls_preserve_module_path(self) -> None:
        self.assertEqual(
            purl.purl_for_package("go", "github.com/boltdb/bolt", version="v1.3.1"),
            "pkg:golang/github.com/boltdb/bolt@v1.3.1",
        )

    def test_multiple_ecosystem_packages_use_generic_purl(self) -> None:
        self.assertEqual(
            purl.purl_for_package("multiple", "internal dependency names"),
            "pkg:generic/internal-dependency-names",
        )
        self.assertEqual(
            purl.purl_for_package("generic", "internal dependency names"),
            "pkg:generic/internal-dependency-names",
        )
        self.assertEqual(
            purl.canonicalize_purl("pkg:generic/internal-dependency-names", package_name="internal dependency names"),
            "pkg:generic/internal-dependency-names",
        )

    def test_malformed_or_noncanonical_purls_are_rejected(self) -> None:
        with self.assertRaises(purl.PurlError):
            purl.canonicalize_purl("pkg:npm/example package", ecosystem="npm", package_name="example")
        with self.assertRaises(purl.PurlError):
            purl.canonicalize_purl("pkg:pypi/torch_triton", ecosystem="pypi", package_name="torchtriton")
        with self.assertRaises(purl.PurlError):
            purl.canonicalize_purl("pkg:npm/event-stream", ecosystem="pypi", package_name="event-stream")
        with self.assertRaises(purl.PurlError):
            purl.purl_for_package("npm", None)
        with self.assertRaises(purl.PurlError):
            purl.canonicalize_purl("pkg:npm/event-stream", ecosystem=None, package_name=[])


if __name__ == "__main__":
    unittest.main()
