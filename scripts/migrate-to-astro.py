#!/usr/bin/env python3
"""Migrate existing Threatpedia HTML content to Astro content collections.

Reads existing manifest files and HTML articles, extracts content,
normalizes metadata to spec, and outputs MDX files with typed frontmatter
for Astro content collections.

Fixes applied during migration:
- Normalize review-status to DATA-STANDARDS v1.0 §3.4 vocabulary
- Assign missing event IDs
- Remove macOS duplicate files
- Reconcile orphan HTML files with manifest
- Strip inline CSS/JS (Astro layouts handle this)

Usage:
    python3 scripts/migrate-to-astro.py
"""

import json
import re
import sys
from datetime import datetime, timezone
from html.parser import HTMLParser
from pathlib import Path

REPO_ROOT = Path(__file__).parent.parent
SITE_DIR = REPO_ROOT / "site"
CONTENT_DIR = SITE_DIR / "src" / "content"

# Legacy review status → spec-compliant mapping
REVIEW_STATUS_MAP = {
    "approved": "certified",
    "pending": "under_review",
    "pending human review": "under_review",
    "draft": "draft_ai",
    "draft_ai": "draft_ai",
    "draft_human": "draft_human",
    "under_review": "under_review",
    "certified": "certified",
    "disputed": "disputed",
    "deprecated": "deprecated",
}

# Severity normalization
SEVERITY_MAP = {
    "critical": "critical",
    "high": "high",
    "medium": "medium",
    "low": "low",
    "": "medium",
}


class HTMLContentExtractor(HTMLParser):
    """Extract text content and sections from HTML articles."""

    def __init__(self):
        super().__init__()
        self.sections: dict[str, str] = {}
        self.current_section = None
        self.current_text = []
        self.in_h2 = False
        self.meta_tags: dict[str, str] = {}
        self.title = ""
        self.in_title = False

    def handle_starttag(self, tag, attrs):
        attrs_dict = dict(attrs)
        if tag == "meta" and "name" in attrs_dict and "content" in attrs_dict:
            self.meta_tags[attrs_dict["name"]] = attrs_dict["content"]
        elif tag == "h2":
            if self.current_section:
                self.sections[self.current_section] = "".join(self.current_text).strip()
            self.current_text = []
            self.in_h2 = True
        elif tag == "title":
            self.in_title = True

    def handle_endtag(self, tag):
        if tag == "h2":
            self.in_h2 = False
            section_name = "".join(self.current_text).strip()
            self.current_section = section_name
            self.current_text = []
        elif tag == "title":
            self.in_title = False

    def handle_data(self, data):
        if self.in_h2:
            self.current_text.append(data)
        elif self.in_title:
            self.title = data.replace(" — Threatpedia", "").strip()
        elif self.current_section:
            self.current_text.append(data)

    def finalize(self):
        if self.current_section:
            self.sections[self.current_section] = "".join(self.current_text).strip()


def migrate_incidents():
    """Migrate incident HTML files to Astro content collection."""
    manifest_file = REPO_ROOT / "incidents" / "manifest.json"
    manifest = json.loads(manifest_file.read_text())
    entries = manifest.get("incidents", manifest.get("entries", []))

    output_dir = CONTENT_DIR / "incidents"
    output_dir.mkdir(parents=True, exist_ok=True)

    # Build slug→entry map
    entry_map = {e["slug"]: e for e in entries}

    # Find all HTML files (excluding index, duplicates)
    html_dir = REPO_ROOT / "incidents"
    html_files = sorted(html_dir.glob("*.html"))
    html_files = [f for f in html_files if f.name != "index.html" and " 2" not in f.name]

    # Track next ID for assignment
    existing_ids = [e.get("incidentId") for e in entries if e.get("incidentId")]
    max_seq = 0
    for eid in existing_ids:
        if eid and eid.startswith("TP-2026-"):
            try:
                max_seq = max(max_seq, int(eid.split("-")[-1]))
            except ValueError:
                pass
    next_seq = max_seq + 1

    migrated = 0
    for html_file in html_files:
        slug = html_file.stem
        entry = entry_map.get(slug, {})

        # Parse HTML
        extractor = HTMLContentExtractor()
        try:
            extractor.feed(html_file.read_text())
            extractor.finalize()
        except Exception as e:
            print(f"  WARN: Failed to parse {html_file.name}: {e}")
            continue

        # Resolve event ID
        event_id = entry.get("incidentId")
        if not event_id or not event_id.startswith("TP-"):
            event_id = f"TP-2026-{next_seq:04d}"
            next_seq += 1
            print(f"  Assigned {event_id} to {slug}")

        # Fix wrong prefix (e.g., TP-TA-0008)
        if event_id and not re.match(r"^TP-\d{4}-\d{4}$", event_id):
            event_id = f"TP-2026-{next_seq:04d}"
            next_seq += 1
            print(f"  Reassigned {event_id} to {slug} (was {entry.get('incidentId')})")

        # Normalize review status
        raw_status = (
            extractor.meta_tags.get("review-status", "")
            or entry.get("reviewStatus", "pending")
        ).lower().strip()
        review_status = REVIEW_STATUS_MAP.get(raw_status, "under_review")

        # Normalize severity
        raw_severity = (entry.get("severity") or "medium").lower()
        sev = SEVERITY_MAP.get(raw_severity, "medium")

        # Title
        title = entry.get("title") or extractor.title or slug.replace("-", " ").title()

        # Date
        date = entry.get("date") or extractor.meta_tags.get("generated-date", "2026-04-01")

        # Generated by
        generated_by = (
            extractor.meta_tags.get("generated-by")
            or entry.get("generatedBy")
            or "dangermouse-bot"
        )

        # Build frontmatter
        frontmatter = {
            "eventId": event_id,
            "title": title,
            "date": date,
            "attackType": entry.get("attackType", "unknown"),
            "severity": sev,
            "sector": entry.get("sector", "Unknown"),
            "geography": entry.get("geography", "Unknown"),
            "threatActor": entry.get("threatActor", "Unknown"),
            "attributionConfidence": "A4",
            "reviewStatus": review_status,
            "confidenceGrade": extractor.meta_tags.get("confidence-grade", "C"),
            "generatedBy": generated_by,
            "generatedDate": date,
            "cves": entry.get("cves", []),
            "relatedSlugs": entry.get("relatedSlugs", []),
            "tags": entry.get("tags", []),
        }

        # Build markdown body from sections
        body_parts = []
        for section_name, section_content in extractor.sections.items():
            clean = _clean_html_content(section_content)
            if clean:
                body_parts.append(f"## {section_name}\n\n{clean}")

        body = "\n\n".join(body_parts) if body_parts else f"## Executive Summary\n\n{title}."

        # Write MDX file
        mdx_content = _build_frontmatter_yaml(frontmatter) + "\n" + body + "\n"
        output_file = output_dir / f"{slug}.mdx"
        output_file.write_text(mdx_content)
        migrated += 1

    print(f"Incidents: migrated {migrated} articles to {output_dir}")
    return migrated


def migrate_threat_actors():
    """Migrate threat actor HTML files to Astro content collection."""
    index_file = REPO_ROOT / "threat-actor-index.json"
    index_data = json.loads(index_file.read_text())
    actors = index_data.get("actors", {})

    output_dir = CONTENT_DIR / "threat-actors"
    output_dir.mkdir(parents=True, exist_ok=True)

    html_dir = REPO_ROOT / "threat-actors"
    html_files = sorted(html_dir.glob("*.html"))
    html_files = [f for f in html_files if f.name != "TEMPLATE.html" and " 2" not in f.name]

    migrated = 0
    for html_file in html_files:
        slug = html_file.stem

        # Look up in index
        actor_data = actors.get(slug, {})
        if actor_data.get("isAlias"):
            continue  # Skip alias entries

        # Parse HTML
        extractor = HTMLContentExtractor()
        try:
            extractor.feed(html_file.read_text())
            extractor.finalize()
        except Exception as e:
            print(f"  WARN: Failed to parse {html_file.name}: {e}")
            continue

        name = actor_data.get("name", extractor.title or slug.replace("-", " ").title())

        frontmatter = {
            "name": name,
            "aliases": actor_data.get("aliases", []),
            "affiliation": actor_data.get("affiliation", "Unknown"),
            "motivation": actor_data.get("motivation", "Unknown"),
            "status": actor_data.get("status", "unknown"),
            "reviewStatus": "under_review",
            "generatedBy": "dangermouse-bot",
            "generatedDate": "2026-04-13",
        }

        # Build body from sections
        body_parts = []
        for section_name, section_content in extractor.sections.items():
            clean = _clean_html_content(section_content)
            if clean:
                body_parts.append(f"## {section_name}\n\n{clean}")

        body = "\n\n".join(body_parts) if body_parts else f"## Overview\n\n{name} threat actor profile."

        mdx_content = _build_frontmatter_yaml(frontmatter) + "\n" + body + "\n"
        output_file = output_dir / f"{slug}.mdx"
        output_file.write_text(mdx_content)
        migrated += 1

    print(f"Threat actors: migrated {migrated} profiles to {output_dir}")
    return migrated


def migrate_zero_days():
    """Migrate zero-day HTML files to Astro content collection."""
    manifest_file = REPO_ROOT / "zero-days" / "manifest.json"
    manifest = json.loads(manifest_file.read_text())
    entries = manifest.get("exploits", manifest.get("entries", []))

    output_dir = CONTENT_DIR / "zero-days"
    output_dir.mkdir(parents=True, exist_ok=True)

    entry_map = {e["slug"]: e for e in entries}

    html_dir = REPO_ROOT / "zero-days"
    html_files = sorted(html_dir.glob("*.html"))
    html_files = [f for f in html_files if f.name not in ("index.html", "TEMPLATE.html") and " 2" not in f.name]

    migrated = 0
    for html_file in html_files:
        slug = html_file.stem
        entry = entry_map.get(slug, {})

        extractor = HTMLContentExtractor()
        try:
            extractor.feed(html_file.read_text())
            extractor.finalize()
        except Exception as e:
            print(f"  WARN: Failed to parse {html_file.name}: {e}")
            continue

        raw_severity = (entry.get("severity") or "high").lower()
        sev = SEVERITY_MAP.get(raw_severity, "high")

        raw_status = (entry.get("reviewStatus") or "pending").lower()
        review_status = REVIEW_STATUS_MAP.get(raw_status, "under_review")

        frontmatter = {
            "exploitId": entry.get("exploitId", ""),
            "title": entry.get("title", extractor.title or slug),
            "cve": entry.get("cve", "Unknown"),
            "type": entry.get("type", "unknown"),
            "platform": entry.get("platform", "unknown"),
            "severity": sev,
            "status": entry.get("status", "unknown"),
            "isZeroDay": entry.get("isZeroDay", True),
            "cisaKev": entry.get("cisaKev", False),
            "reviewStatus": review_status,
            "generatedBy": entry.get("generatedBy", "dangermouse-bot"),
            "generatedDate": entry.get("disclosedDate", "2026-04-01"),
            "relatedIncidents": entry.get("relatedIncidents", []),
            "relatedActors": entry.get("relatedActors", []),
            "tags": entry.get("tags", []),
        }

        if entry.get("disclosedDate"):
            frontmatter["disclosedDate"] = entry["disclosedDate"]
        if entry.get("patchDate"):
            frontmatter["patchDate"] = entry["patchDate"]
        if entry.get("researcher"):
            frontmatter["researcher"] = entry["researcher"]
        if entry.get("confirmedBy"):
            frontmatter["confirmedBy"] = entry["confirmedBy"]
        if entry.get("daysInTheWild") is not None:
            frontmatter["daysInTheWild"] = entry["daysInTheWild"]

        body_parts = []
        for section_name, section_content in extractor.sections.items():
            clean = _clean_html_content(section_content)
            if clean:
                body_parts.append(f"## {section_name}\n\n{clean}")

        body = "\n\n".join(body_parts) if body_parts else f"## Overview\n\n{entry.get('title', slug)}."

        mdx_content = _build_frontmatter_yaml(frontmatter) + "\n" + body + "\n"
        output_file = output_dir / f"{slug}.mdx"
        output_file.write_text(mdx_content)
        migrated += 1

    print(f"Zero-days: migrated {migrated} exploits to {output_dir}")
    return migrated


def _clean_html_content(text: str) -> str:
    """Strip HTML tags and clean up text content."""
    # Remove HTML tags
    clean = re.sub(r"<[^>]+>", "", text)
    # Collapse whitespace
    clean = re.sub(r"\n\s*\n\s*\n+", "\n\n", clean)
    clean = clean.strip()
    return clean


def _build_frontmatter_yaml(data: dict) -> str:
    """Build YAML frontmatter from a dict."""
    lines = ["---"]
    for key, value in data.items():
        if value is None:
            continue
        if isinstance(value, bool):
            lines.append(f"{key}: {str(value).lower()}")
        elif isinstance(value, (int, float)):
            lines.append(f"{key}: {value}")
        elif isinstance(value, list):
            if not value:
                lines.append(f"{key}: []")
            else:
                lines.append(f"{key}:")
                for item in value:
                    # Escape YAML special chars in strings
                    escaped = str(item).replace('"', '\\"')
                    lines.append(f'  - "{escaped}"')
        elif isinstance(value, str):
            # Quote strings that might cause YAML issues
            if any(c in str(value) for c in ":#{}[]|>&*!%@`'\"") or value == "":
                escaped = value.replace('"', '\\"')
                lines.append(f'{key}: "{escaped}"')
            else:
                lines.append(f"{key}: {value}")
        else:
            lines.append(f"{key}: {value}")
    lines.append("---")
    return "\n".join(lines)


def main():
    print("Threatpedia → Astro Content Collection Migration")
    print("=" * 50)

    total = 0
    total += migrate_incidents()
    total += migrate_threat_actors()
    total += migrate_zero_days()

    print(f"\nTotal: {total} files migrated")
    print(f"Output: {CONTENT_DIR}")


if __name__ == "__main__":
    main()
