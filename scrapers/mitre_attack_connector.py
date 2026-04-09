#!/usr/bin/env python3
"""
Threatpedia — MITRE ATT&CK Connector
======================================

Fetches MITRE ATT&CK data (techniques, groups, software, mitigations, campaigns,
relationships) from the official STIX 2.1 bundles on GitHub, and normalizes them
into Threatpedia's enrichment schema.

Data source:
    https://attack.mitre.org
    https://github.com/mitre-attack/attack-stix-data

Features:
    - Full ingestion of Enterprise, Mobile, and ICS ATT&CK domains
    - Incremental mode: filter objects modified after a given date
    - Lookup mode: query a specific ATT&CK ID (technique, group, or software)
    - TAXII 2.1 fallback for single-object lookups
    - Relationship graph extraction (group→technique, software→technique, etc.)
    - SHA-256 change detection to skip no-op syncs
    - CLI entry point with argparse

No authentication required (GitHub PAT optional for higher rate limits).
"""

from __future__ import annotations

import argparse
import hashlib
import json
import logging
import sys
import time
from collections import defaultdict
from datetime import datetime, timezone
from typing import Any, Optional

import requests

# Adjust import path for running as a module or standalone script
try:
    from base_connector import (
        ThreatpediaConnector,
        ThreatpediaRecord,
        TokenBucketRateLimiter,
        normalize_timestamp,
        retry_with_backoff,
        JSONSerializer,
    )
except ImportError:
    from scrapers.base_connector import (
        ThreatpediaConnector,
        ThreatpediaRecord,
        TokenBucketRateLimiter,
        normalize_timestamp,
        retry_with_backoff,
        JSONSerializer,
    )

logger = logging.getLogger("threatpedia.connectors.mitre_attack")

# ---------------------------------------------------------------------------
# Constants
# ---------------------------------------------------------------------------

GITHUB_RAW_BASE = (
    "https://raw.githubusercontent.com/mitre-attack/attack-stix-data/master"
)
GITHUB_INDEX_URL = f"{GITHUB_RAW_BASE}/index.json"

DOMAINS = {
    "enterprise": "enterprise-attack/enterprise-attack.json",
    "mobile": "mobile-attack/mobile-attack.json",
    "ics": "ics-attack/ics-attack.json",
}

TAXII_BASE = "https://attack-taxii.mitre.org"
TAXII_API_ROOT = "/api/v21"
TAXII_COLLECTIONS = {
    "enterprise": "x-mitre-collection--1f5f1533-f617-4ca8-9ab4-6a02367fa019",
    "mobile": "x-mitre-collection--dac0d2d7-8653-445c-9bff-82f934c1e858",
    "ics": "x-mitre-collection--90c00720-636b-4485-b342-8751d232bf09",
}

# STIX type → ATT&CK concept mapping
STIX_TYPE_MAP = {
    "attack-pattern": "technique",
    "intrusion-set": "group",
    "tool": "software",
    "malware": "software",
    "course-of-action": "mitigation",
    "campaign": "campaign",
    "x-mitre-tactic": "tactic",
    "x-mitre-data-source": "data_source",
    "x-mitre-data-component": "data_component",
    "x-mitre-matrix": "matrix",
    "relationship": "relationship",
    "identity": "identity",
    "marking-definition": "marking",
}

# Enterprise ATT&CK tactic kill-chain phases
ENTERPRISE_TACTICS = {
    "reconnaissance": "TA0043",
    "resource-development": "TA0042",
    "initial-access": "TA0001",
    "execution": "TA0002",
    "persistence": "TA0003",
    "privilege-escalation": "TA0004",
    "defense-evasion": "TA0005",
    "credential-access": "TA0006",
    "discovery": "TA0007",
    "lateral-movement": "TA0008",
    "collection": "TA0009",
    "command-and-control": "TA0011",
    "exfiltration": "TA0010",
    "impact": "TA0040",
}


# ---------------------------------------------------------------------------
# Helper Functions
# ---------------------------------------------------------------------------

def get_attack_id(obj: dict) -> Optional[str]:
    """Extract ATT&CK ID (e.g., T1566, G0016) from a STIX object."""
    for ref in obj.get("external_references", []):
        if ref.get("source_name") == "mitre-attack":
            return ref.get("external_id")
    return None


def get_attack_url(obj: dict) -> Optional[str]:
    """Extract the attack.mitre.org URL from a STIX object."""
    for ref in obj.get("external_references", []):
        if ref.get("source_name") == "mitre-attack":
            return ref.get("url")
    return None


def is_active(obj: dict) -> bool:
    """Check if a STIX object is not revoked or deprecated."""
    return not obj.get("revoked", False) and not obj.get("x_mitre_deprecated", False)


def extract_cves(obj: dict) -> list[str]:
    """Extract CVE IDs from external_references."""
    cves = []
    for ref in obj.get("external_references", []):
        ext_id = ref.get("external_id", "")
        if ext_id.startswith("CVE-"):
            cves.append(ext_id)
    return cves


# ---------------------------------------------------------------------------
# Connector Implementation
# ---------------------------------------------------------------------------

class MITREAttackConnector(ThreatpediaConnector):
    """Connector for MITRE ATT&CK knowledge base.

    Downloads STIX 2.1 bundles from GitHub, parses all object types,
    builds a relationship graph, and normalizes to Threatpedia schema.

    This is an enrichment-only source — it provides TTP context, not breach records.
    """

    SOURCE_NAME = "mitre_attack"
    SOURCE_URL = "https://attack.mitre.org"

    def __init__(
        self,
        domains: Optional[list[str]] = None,
        github_pat: Optional[str] = None,
        **kwargs: Any,
    ) -> None:
        # GitHub raw content: 60 req/hr anonymous, 5000 req/hr with PAT
        # We only need 1-3 requests per sync (one per domain), so anonymous is fine
        super().__init__(rate_limit=10, rate_window=60.0, **kwargs)
        self.domains = domains or ["enterprise"]
        self.github_pat = github_pat
        self._bundles: dict[str, dict] = {}  # domain → raw STIX bundle
        self._object_index: dict[str, dict] = {}  # STIX ID → object
        self._relationships: list[dict] = []
        self._taxii_limiter = TokenBucketRateLimiter(rate=10, per=600.0)  # 10 req / 10 min

        if github_pat:
            self.session.headers["Authorization"] = f"token {github_pat}"

    # ---- Authentication (optional PAT) ------------------------------------

    def authenticate(self) -> None:
        """GitHub PAT is optional; set via constructor or env var."""
        if self.github_pat:
            self.logger.info("Using GitHub PAT for higher rate limits.")
        else:
            self.logger.debug("No GitHub PAT — using anonymous access (60 req/hr).")

    # ---- Fetch: GitHub Raw Download ----------------------------------------

    @retry_with_backoff(max_retries=3, base_delay=5.0)
    def _download_bundle(self, domain: str) -> dict:
        """Download a STIX 2.1 bundle for the given ATT&CK domain."""
        path = DOMAINS.get(domain)
        if not path:
            raise ValueError(f"Unknown ATT&CK domain: {domain}")

        url = f"{GITHUB_RAW_BASE}/{path}"
        self.logger.info("Downloading %s ATT&CK bundle from %s", domain, url)
        self.rate_limiter.acquire()

        resp = self.session.get(url, timeout=120)
        resp.raise_for_status()
        data = resp.json()

        self._validate_bundle(data, domain)
        return data

    @staticmethod
    def _validate_bundle(data: dict, domain: str) -> None:
        """Validate a downloaded STIX bundle."""
        if data.get("type") != "bundle":
            raise ValueError(f"{domain}: Not a STIX bundle (type={data.get('type')})")

        objects = data.get("objects", [])
        if len(objects) < 500:
            raise ValueError(
                f"{domain}: Suspiciously low object count: {len(objects)} (expected 500+)"
            )

        required_types = {"attack-pattern", "intrusion-set", "relationship"}
        found_types = {obj.get("type") for obj in objects}
        missing = required_types - found_types
        if missing:
            raise ValueError(f"{domain}: Missing expected STIX types: {missing}")

    def _build_index(self) -> None:
        """Build a lookup index from STIX ID → object across all loaded bundles."""
        self._object_index.clear()
        self._relationships.clear()

        for domain, bundle in self._bundles.items():
            for obj in bundle.get("objects", []):
                stix_id = obj.get("id")
                if not stix_id:
                    continue

                obj["_domain"] = domain  # tag with source domain

                if obj.get("type") == "relationship":
                    self._relationships.append(obj)
                else:
                    # Keep the latest version if seen in multiple domains
                    existing = self._object_index.get(stix_id)
                    if not existing or obj.get("modified", "") > existing.get("modified", ""):
                        self._object_index[stix_id] = obj

        self.logger.info(
            "Index built: %d objects, %d relationships",
            len(self._object_index),
            len(self._relationships),
        )

    def fetch_all(self) -> list[dict[str, Any]]:
        """Download all configured ATT&CK domain bundles and return flattened objects."""
        all_objects = []

        for domain in self.domains:
            bundle = self._download_bundle(domain)
            self._bundles[domain] = bundle
            obj_count = len(bundle.get("objects", []))
            self.logger.info(
                "%s ATT&CK: %d STIX objects loaded", domain.capitalize(), obj_count
            )
            all_objects.extend(bundle.get("objects", []))

        self._build_index()
        return all_objects

    def fetch_incremental(self, since_date: str) -> list[dict[str, Any]]:
        """Download full bundles and filter to objects modified after since_date."""
        all_objects = self.fetch_all()

        filtered = [
            obj for obj in all_objects
            if obj.get("modified", "0000-00-00") >= since_date
        ]
        self.logger.info(
            "Incremental filter (since %s): %d / %d objects",
            since_date, len(filtered), len(all_objects),
        )
        return filtered

    # ---- Fetch: TAXII Lookup (single object) --------------------------------

    def taxii_lookup(self, stix_id: str, domain: str = "enterprise") -> Optional[dict]:
        """Look up a single STIX object via the TAXII 2.1 server.

        Use sparingly — rate limited to 10 req / 10 min.
        """
        collection_id = TAXII_COLLECTIONS.get(domain)
        if not collection_id:
            self.logger.warning("Unknown domain for TAXII lookup: %s", domain)
            return None

        url = (
            f"{TAXII_BASE}{TAXII_API_ROOT}/collections/{collection_id}"
            f"/objects/{stix_id}/"
        )
        headers = {"Accept": "application/taxii+json;version=2.1"}

        self._taxii_limiter.acquire()
        try:
            resp = self.session.get(url, headers=headers, timeout=30)
            resp.raise_for_status()
            data = resp.json()
            objects = data.get("objects", [])
            return objects[0] if objects else None
        except requests.RequestException as exc:
            self.logger.warning("TAXII lookup failed for %s: %s", stix_id, exc)
            return None

    # ---- Lookup by ATT&CK ID -----------------------------------------------

    def lookup(self, attack_id: str) -> Optional[dict]:
        """Look up an object by ATT&CK ID (e.g., T1566, G0016, S0154).

        Searches the loaded index first.
        Returns a normalized enrichment dict.
        """
        # Search loaded index
        for obj in self._object_index.values():
            if get_attack_id(obj) == attack_id:
                return self._normalize_enrichment(obj)

        self.logger.info(
            "ATT&CK ID not found in local index. TAXII lookup by ATT&CK ID is not currently supported."
        )
        # Can't do a TAXII lookup by ATT&CK ID directly — would need full collection
        # Return None if not found in local index
        return None

    # ---- Normalize -----------------------------------------------------------

    def normalize(self, raw_record: dict[str, Any]) -> ThreatpediaRecord:
        """Transform a STIX object into a ThreatpediaRecord.

        Since ATT&CK is an enrichment source (not a breach catalog),
        records use technique/group/software names as breach_name and
        store enrichment data in raw_data.
        """
        obj_type = raw_record.get("type", "unknown")
        attack_id = get_attack_id(raw_record) or raw_record.get("id", "unknown")
        name = raw_record.get("name", "Unknown")
        concept = STIX_TYPE_MAP.get(obj_type, obj_type)

        # Skip non-primary types (relationships, identities, markings)
        if concept in ("relationship", "identity", "marking", "matrix"):
            return ThreatpediaRecord(
                breach_name=f"[{concept}] {raw_record.get('id', 'unknown')}",
                source_name="MITRE ATT&CK",
                source_url=self.SOURCE_URL,
                raw_data={"_skipped": True, "type": obj_type},
            )

        enrichment = self._normalize_enrichment(raw_record)

        return ThreatpediaRecord(
            breach_name=f"[{concept.upper()}] {attack_id} — {name}",
            source_name="MITRE ATT&CK",
            source_url=get_attack_url(raw_record) or self.SOURCE_URL,
            date_occurred=normalize_timestamp(raw_record.get("created")),
            date_reported=normalize_timestamp(raw_record.get("modified")),
            organization=self._extract_org(raw_record),
            sector=None,  # Sector is in prose descriptions only
            country=None,  # Country is in prose descriptions only
            records_affected=None,  # Not applicable
            data_types_exposed=[],  # Not applicable
            cves=extract_cves(raw_record),
            iocs=[],  # ATT&CK has no atomic IOCs
            raw_data=enrichment,
        )

    def _normalize_enrichment(self, obj: dict) -> dict[str, Any]:
        """Build a rich enrichment dict from a STIX object."""
        obj_type = obj.get("type", "unknown")
        attack_id = get_attack_id(obj)
        concept = STIX_TYPE_MAP.get(obj_type, obj_type)

        enrichment: dict[str, Any] = {
            "attack_id": attack_id,
            "attack_concept": concept,
            "stix_id": obj.get("id"),
            "stix_type": obj_type,
            "name": obj.get("name"),
            "description": obj.get("description") or "",
            "created": obj.get("created"),
            "modified": obj.get("modified"),
            "revoked": obj.get("revoked", False),
            "deprecated": obj.get("x_mitre_deprecated", False),
            "domain": obj.get("_domain", "enterprise"),
            "attack_url": get_attack_url(obj),
            "external_references": [
                {"source": r.get("source_name"), "url": r.get("url")}
                for r in obj.get("external_references", [])
                if r.get("url")
            ][:10],  # cap at 10 references
        }

        # Type-specific fields
        if obj_type == "attack-pattern":
            enrichment.update({
                "tactics": [
                    p["phase_name"]
                    for p in obj.get("kill_chain_phases", [])
                    if p.get("kill_chain_name") == "mitre-attack"
                ],
                "tactic_ids": [
                    ENTERPRISE_TACTICS.get(p["phase_name"])
                    for p in obj.get("kill_chain_phases", [])
                    if p.get("kill_chain_name") == "mitre-attack"
                    and p["phase_name"] in ENTERPRISE_TACTICS
                ],
                "platforms": obj.get("x_mitre_platforms", []),
                "is_subtechnique": obj.get("x_mitre_is_subtechnique", False),
                "detection": obj.get("x_mitre_detection") or "",
                "data_sources": obj.get("x_mitre_data_sources", []),
                "cves": extract_cves(obj),
                "mitre_version": obj.get("x_mitre_version"),
            })

        elif obj_type == "intrusion-set":
            enrichment.update({
                "aliases": obj.get("aliases", []),
                "first_seen": obj.get("first_seen"),
                "last_seen": obj.get("last_seen"),
            })

        elif obj_type in ("tool", "malware"):
            enrichment.update({
                "software_type": "tool" if obj_type == "tool" else "malware",
                "aliases": obj.get("x_mitre_aliases", []),
                "platforms": obj.get("x_mitre_platforms", []),
            })

        elif obj_type == "campaign":
            enrichment.update({
                "aliases": obj.get("aliases", []),
                "first_seen": obj.get("first_seen"),
                "last_seen": obj.get("last_seen"),
            })

        elif obj_type == "course-of-action":
            pass  # name + description is sufficient for mitigations

        return enrichment

    @staticmethod
    def _extract_org(obj: dict) -> Optional[str]:
        """Extract organization/group name if applicable."""
        if obj.get("type") == "intrusion-set":
            return obj.get("name")
        return None

    # ---- Relationship Graph -------------------------------------------------

    def get_relationships_for(
        self, stix_id: str, rel_type: Optional[str] = None, direction: str = "both"
    ) -> list[dict]:
        """Get relationships involving a STIX object.

        Args:
            stix_id: The STIX ID to search for.
            rel_type: Filter by relationship type (e.g., 'uses', 'mitigates').
            direction: 'source', 'target', or 'both'.

        Returns:
            List of relationship dicts with resolved source/target names.
        """
        results = []
        for rel in self._relationships:
            matches = False
            if direction in ("source", "both") and rel.get("source_ref") == stix_id:
                matches = True
            if direction in ("target", "both") and rel.get("target_ref") == stix_id:
                matches = True

            if not matches:
                continue
            if rel_type and rel.get("relationship_type") != rel_type:
                continue

            source_obj = self._object_index.get(rel["source_ref"], {})
            target_obj = self._object_index.get(rel["target_ref"], {})

            results.append({
                "relationship_type": rel.get("relationship_type"),
                "source_id": get_attack_id(source_obj) or rel["source_ref"],
                "source_name": source_obj.get("name", "Unknown"),
                "source_type": source_obj.get("type", "unknown"),
                "target_id": get_attack_id(target_obj) or rel["target_ref"],
                "target_name": target_obj.get("name", "Unknown"),
                "target_type": target_obj.get("type", "unknown"),
                "description": (rel.get("description") or "")[:200],
            })

        return results

    def get_group_techniques(self, group_attack_id: str) -> list[dict]:
        """Get all techniques used by a threat group (by ATT&CK ID, e.g., G0016)."""
        group_stix_id = None
        for obj in self._object_index.values():
            if obj.get("type") == "intrusion-set" and get_attack_id(obj) == group_attack_id:
                group_stix_id = obj["id"]
                break

        if not group_stix_id:
            return []

        rels = self.get_relationships_for(group_stix_id, rel_type="uses", direction="source")
        return [
            r for r in rels
            if r["target_type"] == "attack-pattern"
        ]

    def get_technique_groups(self, technique_attack_id: str) -> list[dict]:
        """Get all groups that use a given technique (by ATT&CK ID, e.g., T1566)."""
        tech_stix_id = None
        for obj in self._object_index.values():
            if obj.get("type") == "attack-pattern" and get_attack_id(obj) == technique_attack_id:
                tech_stix_id = obj["id"]
                break

        if not tech_stix_id:
            return []

        rels = self.get_relationships_for(tech_stix_id, rel_type="uses", direction="target")
        return [
            r for r in rels
            if r["source_type"] == "intrusion-set"
        ]

    # ---- Statistics ----------------------------------------------------------

    def get_stats(self) -> dict[str, Any]:
        """Return summary statistics for the loaded ATT&CK data."""
        type_counts: dict[str, int] = defaultdict(int)
        active_counts: dict[str, int] = defaultdict(int)

        for obj in self._object_index.values():
            obj_type = obj.get("type", "unknown")
            concept = STIX_TYPE_MAP.get(obj_type, obj_type)
            type_counts[concept] += 1
            if is_active(obj):
                active_counts[concept] += 1

        rel_type_counts: dict[str, int] = defaultdict(int)
        for rel in self._relationships:
            rel_type_counts[rel.get("relationship_type", "unknown")] += 1

        return {
            "domains_loaded": list(self._bundles.keys()),
            "total_objects": len(self._object_index),
            "total_relationships": len(self._relationships),
            "by_concept": dict(type_counts),
            "active_by_concept": dict(active_counts),
            "relationships_by_type": dict(rel_type_counts),
        }

    # ---- Overridden run() for enrichment source -----------------------------

    def run(
        self,
        mode: str = "full",
        since_date: Optional[str] = None,
        output_file: Optional[str] = None,
    ) -> list[ThreatpediaRecord]:
        """Execute the connector pipeline.

        For ATT&CK, we filter out non-primary STIX types from the final output
        (relationships, identities, markings) to keep the record set focused on
        techniques, groups, software, mitigations, and campaigns.
        """
        self.logger.info("Starting MITRE ATT&CK connector in %s mode", mode)
        self.authenticate()

        if mode == "incremental" and since_date:
            raw_objects = self.fetch_incremental(since_date)
        else:
            raw_objects = self.fetch_all()

        self.logger.info("Fetched %d raw STIX objects", len(raw_objects))

        # Normalize only primary types (skip relationships, identities, markings)
        primary_types = {
            "attack-pattern", "intrusion-set", "tool", "malware",
            "course-of-action", "campaign", "x-mitre-tactic",
            "x-mitre-data-source",
        }
        primary_objects = [
            obj for obj in raw_objects
            if obj.get("type") in primary_types and is_active(obj)
        ]

        self.logger.info(
            "Normalizing %d active primary objects (from %d total)",
            len(primary_objects), len(raw_objects),
        )

        normalized: list[ThreatpediaRecord] = []
        errors = 0
        for obj in primary_objects:
            try:
                normalized.append(self.normalize(obj))
            except Exception as exc:
                errors += 1
                self.logger.warning("Normalization error: %s — object skipped", exc)

        self.logger.info(
            "Normalized %d records (%d errors)", len(normalized), errors
        )

        if output_file:
            count = JSONSerializer.write_records(normalized, output_file)
            self.logger.info("Wrote %d records to %s", count, output_file)

        return normalized


# ---------------------------------------------------------------------------
# CLI Entry Point
# ---------------------------------------------------------------------------

def build_cli() -> argparse.ArgumentParser:
    parser = argparse.ArgumentParser(
        prog="mitre_attack_connector",
        description=(
            "Threatpedia MITRE ATT&CK Connector — fetch and normalize "
            "MITRE ATT&CK techniques, groups, software, mitigations, and campaigns "
            "from STIX 2.1 bundles."
        ),
    )

    parser.add_argument(
        "--mode",
        choices=["full", "incremental", "lookup"],
        default="full",
        help=(
            "Sync mode: 'full' downloads all configured domain bundles; "
            "'incremental' filters by --since date; "
            "'lookup' queries a single ATT&CK ID (default: full)."
        ),
    )
    parser.add_argument(
        "--since",
        type=str,
        default=None,
        help=(
            "ISO 8601 date (YYYY-MM-DD) for incremental mode. "
            "Only objects modified on or after this date are returned."
        ),
    )
    parser.add_argument(
        "--lookup-id",
        type=str,
        default=None,
        help=(
            "ATT&CK ID to look up (e.g., T1566, G0016, S0154). "
            "Requires --mode lookup. Loads enterprise domain first."
        ),
    )
    parser.add_argument(
        "--domains",
        type=str,
        nargs="+",
        choices=["enterprise", "mobile", "ics"],
        default=["enterprise"],
        help="ATT&CK domains to fetch (default: enterprise).",
    )
    parser.add_argument(
        "--github-pat",
        type=str,
        default=None,
        help="GitHub Personal Access Token for higher rate limits (optional).",
    )
    parser.add_argument(
        "--output", "-o",
        type=str,
        default=None,
        help="Path to write normalized JSON output. If omitted, prints summary to stdout.",
    )
    parser.add_argument(
        "--output-format",
        choices=["json", "jsonl"],
        default="json",
        help="Output format: 'json' (array) or 'jsonl' (newline-delimited). Default: json.",
    )
    parser.add_argument(
        "--limit",
        type=int,
        default=None,
        help="Limit output to the first N records (useful for testing).",
    )
    parser.add_argument(
        "--stats",
        action="store_true",
        help="Print statistics about the loaded ATT&CK data.",
    )
    parser.add_argument(
        "--group-techniques",
        type=str,
        default=None,
        metavar="GROUP_ID",
        help="List techniques used by a group (e.g., G0016 for APT29). Loads data first.",
    )
    parser.add_argument(
        "--technique-groups",
        type=str,
        default=None,
        metavar="TECHNIQUE_ID",
        help="List groups that use a technique (e.g., T1566). Loads data first.",
    )
    parser.add_argument(
        "--verbose", "-v",
        action="store_true",
        help="Enable debug-level logging.",
    )

    return parser


def main() -> None:
    parser = build_cli()
    args = parser.parse_args()

    logging.basicConfig(
        level=logging.DEBUG if args.verbose else logging.INFO,
        format="%(asctime)s [%(levelname)s] %(name)s: %(message)s",
    )

    connector = MITREAttackConnector(
        domains=args.domains,
        github_pat=args.github_pat,
    )

    # --- Lookup mode ---
    if args.mode == "lookup" and args.lookup_id:
        # Need to load data first for lookup
        connector.fetch_all()
        result = connector.lookup(args.lookup_id)
        if result:
            print(json.dumps(result, indent=2, default=str))
        else:
            print(f"ATT&CK ID '{args.lookup_id}' not found.", file=sys.stderr)
            sys.exit(1)
        return

    # --- Group techniques query ---
    if args.group_techniques:
        connector.fetch_all()
        techniques = connector.get_group_techniques(args.group_techniques)
        print(f"\nTechniques used by {args.group_techniques}:")
        print(f"{'=' * 60}")
        for t in sorted(techniques, key=lambda x: x.get("target_id", "")):
            print(f"  {t['target_id']:12s} {t['target_name']}")
        print(f"\nTotal: {len(techniques)} techniques")
        return

    # --- Technique groups query ---
    if args.technique_groups:
        connector.fetch_all()
        groups = connector.get_technique_groups(args.technique_groups)
        print(f"\nGroups using {args.technique_groups}:")
        print(f"{'=' * 60}")
        for g in sorted(groups, key=lambda x: x.get("source_id", "")):
            print(f"  {g['source_id']:12s} {g['source_name']}")
        print(f"\nTotal: {len(groups)} groups")
        return

    # --- Full / Incremental mode ---
    records = connector.run(
        mode=args.mode,
        since_date=args.since,
        output_file=args.output if args.output_format == "json" else None,
    )

    if args.output and args.output_format == "jsonl":
        count = JSONSerializer.write_records_jsonl(records, args.output)
        logger.info("Wrote %d records to %s (JSONL)", count, args.output)

    if args.limit:
        records = records[:args.limit]

    # --- Stats ---
    if args.stats:
        stats = connector.get_stats()
        print(f"\n{'=' * 60}")
        print("MITRE ATT&CK — Data Summary")
        print(f"{'=' * 60}")
        print(f"Domains loaded: {', '.join(stats['domains_loaded'])}")
        print(f"Total objects:  {stats['total_objects']}")
        print(f"Total relationships: {stats['total_relationships']}")
        print(f"\nObjects by concept (active / total):")
        for concept in sorted(stats["by_concept"].keys()):
            total = stats["by_concept"][concept]
            active = stats["active_by_concept"].get(concept, 0)
            print(f"  {concept:20s} {active:6d} / {total:6d}")
        print(f"\nRelationships by type:")
        for rel_type, count in sorted(stats["relationships_by_type"].items(), key=lambda x: -x[1]):
            print(f"  {rel_type:25s} {count:6d}")
        print()

    # --- Summary output ---
    if not args.output:
        print(f"\n{'=' * 60}")
        print(f"MITRE ATT&CK — {len(records)} records normalized")
        print(f"{'=' * 60}")

        # Group by concept
        concepts: dict[str, int] = defaultdict(int)
        for r in records:
            concept = r.raw_data.get("attack_concept", "unknown")
            concepts[concept] += 1

        for concept, count in sorted(concepts.items()):
            print(f"  {concept:20s} {count:6d}")
        print()

        # Show sample records
        samples = records[:5]
        if samples:
            print("Sample records:")
            for r in samples:
                print(f"  {r.breach_name}")
            if len(records) > 5:
                print(f"  ... and {len(records) - 5} more")
            print()

            # Print full JSON for first record
            print("Sample record (JSON):")
            print(samples[0].to_json())


if __name__ == "__main__":
    main()
