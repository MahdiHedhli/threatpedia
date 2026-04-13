#!/usr/bin/env python3
"""
Threatpedia — Australian OAIC Notifiable Data Breaches Connector
=================================================================

Scrapes the Office of the Australian Information Commissioner (OAIC)
Notifiable Data Breaches (NDB) scheme publications — the sole authoritative
source for Australian data breach notification statistics.

Data source:
    https://www.oaic.gov.au/privacy/notifiable-data-breaches

Features:
    - Full mode: discover and parse all available half-yearly NDB reports
    - Incremental mode: parse only reports published after a given date
    - Lookup mode: fetch a specific report by period (e.g. "2024-H2")
    - HTML report page scraping with table extraction
    - Regex-based statistic extraction (total notifications, percentages)
    - PDF link discovery for archival
    - Sector normalization (ANZSIC → Threatpedia taxonomy)
    - Breach cause normalization (3-tier taxonomy)
    - CLI entry point with argparse
    - Polite scraping with randomized delays

Note: OAIC publishes *aggregate statistics* only — no individual breach records.
This connector produces one record per half-yearly reporting period.

No authentication required — all data is publicly available.
"""

from __future__ import annotations

import argparse
import json
import logging
import os
import random
import re
import sys
import time
import unittest
from datetime import datetime, timezone
from pathlib import Path
from typing import Any, Optional
from urllib.parse import urljoin

import requests
from requests.adapters import HTTPAdapter
from urllib3.util.retry import Retry

# Note: base_connector imports are available but not directly used in this
# connector because OAIC publishes aggregate statistics (not individual
# ThreatpediaRecord entries). The base classes are retained as optional
# imports for future integration with the unified ingestion pipeline.

try:
    from bs4 import BeautifulSoup
except ImportError:
    BeautifulSoup = None  # type: ignore[assignment,misc]

logger = logging.getLogger("threatpedia.connectors.australian_oaic")

# ---------------------------------------------------------------------------
# Constants
# ---------------------------------------------------------------------------

BASE_URL = "https://www.oaic.gov.au"
PUBLICATIONS_URL = (
    f"{BASE_URL}/privacy/notifiable-data-breaches/"
    "notifiable-data-breaches-publications"
)
DASHBOARD_URL = (
    f"{BASE_URL}/privacy/notifiable-data-breaches/"
    "notifiable-data-breach-statistics-dashboard"
)

USER_AGENT = (
    "Mozilla/5.0 (compatible; Threatpedia/1.0; "
    "+https://github.com/MahdiHedhli/threatpedia)"
)

# Polite scraping delays (seconds)
DELAY_MIN = 2.0
DELAY_MAX = 5.0

# ---------------------------------------------------------------------------
# Known Report Slugs (fallback for discovery failures)
# ---------------------------------------------------------------------------

KNOWN_REPORT_SLUGS: list[dict[str, str]] = [
    {"period": "2024-H2", "slug": "notifiable-data-breaches-report-july-to-december-2024"},
    {"period": "2024-H1", "slug": "notifiable-data-breaches-report-january-to-june-2024"},
    {"period": "2023-H2", "slug": "notifiable-data-breaches-report-july-to-december-2023"},
    {"period": "2023-H1", "slug": "notifiable-data-breaches-report-january-to-june-2023"},
    {"period": "2022-H2", "slug": "notifiable-data-breaches-report-july-to-december-2022"},
    {"period": "2022-H1", "slug": "notifiable-data-breaches-report-january-to-june-2022"},
    {"period": "2021-H2", "slug": "notifiable-data-breaches-report-july-to-december-2021"},
    {"period": "2021-H1", "slug": "notifiable-data-breaches-report-januaryjune-2021"},
    {"period": "2020-H2", "slug": "notifiable-data-breaches-report-julydecember-2020"},
    {"period": "2020-H1", "slug": "notifiable-data-breaches-report-januaryjune-2020"},
    {"period": "2019-H2", "slug": "notifiable-data-breaches-report-julydecember-2019"},
    {"period": "2019-H1", "slug": "notifiable-data-breaches-report-januaryjune-2019"},
    {"period": "2018-FULL", "slug": "notifiable-data-breaches-scheme-12-month-insights-report"},
]

# ---------------------------------------------------------------------------
# Sector Mapping: OAIC / ANZSIC → Threatpedia Taxonomy
# ---------------------------------------------------------------------------

SECTOR_MAP: dict[str, str] = {
    "Health service providers": "healthcare",
    "Health Service Providers": "healthcare",
    "Australian Government": "government",
    "Australian government": "government",
    "Finance (including superannuation)": "financial_services",
    "Finance": "financial_services",
    "Finance, including superannuation": "financial_services",
    "Legal, accounting and management services": "professional_services",
    "Legal, accounting, management": "professional_services",
    "Legal, Accounting and Management Services": "professional_services",
    "Education": "education",
    "Retail": "retail",
    "Retail trade": "retail",
    "Insurance": "insurance",
    "Personal services": "personal_services",
    "Professional, scientific and technical services": "technology",
    "Information media and telecommunications": "telecommunications",
    "Mining": "mining",
    "Construction": "construction",
    "Electricity, gas, water and waste services": "utilities",
    "Transport, postal and warehousing": "transportation",
    "Accommodation and food services": "hospitality",
    "Rental, hiring and real estate services": "real_estate",
    "Arts and recreation services": "arts_recreation",
    "Not-for-profit organisations": "nonprofit",
    "Not-for-profit": "nonprofit",
    "Other": "other",
}

# ---------------------------------------------------------------------------
# Breach Cause Mapping: OAIC Taxonomy → Threatpedia Taxonomy
# ---------------------------------------------------------------------------

CAUSE_MAP: dict[str, str] = {
    # Level 1
    "Malicious or criminal attack": "malicious_attack",
    "Malicious or Criminal Attack": "malicious_attack",
    "Human error": "human_error",
    "Human Error": "human_error",
    "System fault": "system_fault",
    "System Fault": "system_fault",
    # Level 2 — Malicious attack subcategories
    "Cyber incident": "cyber_attack",
    "Social engineering / impersonation": "social_engineering",
    "Social engineering/impersonation": "social_engineering",
    "Rogue employee / insider threat": "insider_threat",
    "Rogue employee/insider threat": "insider_threat",
    "Theft of paperwork or data storage device": "physical_theft",
    # Level 3 — Cyber incident types
    "Phishing (compromised credentials)": "phishing",
    "Phishing": "phishing",
    "Ransomware": "ransomware",
    "Compromised/stolen credentials (method unknown)": "credential_theft",
    "Compromised or stolen credentials (method unknown)": "credential_theft",
    "Hacking": "hacking",
    "Brute-force attack": "brute_force",
    "Brute force attack": "brute_force",
    "Malware": "malware",
    # Level 2 — Human error subcategories
    "PI sent to wrong recipient (email)": "misdirected_email",
    "Unauthorised disclosure / unintended release": "accidental_disclosure",
    "Failure to use BCC": "misdirected_email",
    "Loss of paperwork or data storage device": "physical_loss",
    "Insecure disposal": "insecure_disposal",
}

# ---------------------------------------------------------------------------
# Period Parsing Utilities
# ---------------------------------------------------------------------------

# Patterns to extract period from URL slugs
_SLUG_PERIOD_PATTERNS: list[tuple[str, str]] = [
    (r"january-to-june-(\d{4})", "{}-H1"),
    (r"januaryjune-(\d{4})", "{}-H1"),
    (r"january-june-(\d{4})", "{}-H1"),
    (r"jan-jun-(\d{4})", "{}-H1"),
    (r"july-to-december-(\d{4})", "{}-H2"),
    (r"julydecember-(\d{4})", "{}-H2"),
    (r"july-december-(\d{4})", "{}-H2"),
    (r"jul-dec-(\d{4})", "{}-H2"),
]

# Known publish dates for historical reports (period → approximate publish date)
KNOWN_PUBLISH_DATES: dict[str, str] = {
    "2024-H2": "2025-02-11",
    "2024-H1": "2024-09-10",
    "2023-H2": "2024-02-22",
    "2023-H1": "2023-09-14",
    "2022-H2": "2023-02-22",
    "2022-H1": "2022-09-13",
    "2021-H2": "2022-02-22",
    "2021-H1": "2021-10-26",
    "2020-H2": "2021-02-23",
    "2020-H1": "2020-10-27",
    "2019-H2": "2020-02-25",
    "2019-H1": "2019-11-06",
    "2018-FULL": "2019-04-09",
}


def parse_period_from_slug(slug: str) -> Optional[str]:
    """Extract reporting period from a URL slug.

    Returns a string like '2024-H2' or None if no pattern matches.
    """
    for pattern, fmt in _SLUG_PERIOD_PATTERNS:
        match = re.search(pattern, slug, re.IGNORECASE)
        if match:
            return fmt.format(match.group(1))

    # Handle special slugs
    if "12-month-insights" in slug or "insights-report" in slug:
        return "2018-FULL"

    return None


def period_to_date_range(period: str) -> tuple[str, str]:
    """Convert a period like '2024-H2' to (start_date, end_date) ISO strings."""
    if period == "2018-FULL":
        return ("2018-02-22", "2019-02-21")

    match = re.match(r"(\d{4})-H([12])", period)
    if not match:
        return ("", "")

    year = int(match.group(1))
    half = int(match.group(2))

    if half == 1:
        return (f"{year}-01-01", f"{year}-06-30")
    else:
        return (f"{year}-07-01", f"{year}-12-31")


# ---------------------------------------------------------------------------
# HTTP Session Builder
# ---------------------------------------------------------------------------

def _build_session() -> requests.Session:
    """Create a requests session with courteous headers and retry logic."""
    session = requests.Session()
    session.headers.update({
        "User-Agent": USER_AGENT,
        "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
        "Accept-Language": "en-AU,en;q=0.9",
    })
    retry_strategy = Retry(
        total=3,
        backoff_factor=1,
        status_forcelist=[429, 500, 502, 503, 504],
        allowed_methods=["GET"],
    )
    adapter = HTTPAdapter(max_retries=retry_strategy)
    session.mount("https://", adapter)
    session.mount("http://", adapter)
    return session


def _polite_delay() -> None:
    """Random delay between requests to be courteous to the OAIC servers."""
    time.sleep(DELAY_MIN + random.uniform(0, DELAY_MAX - DELAY_MIN))


# ---------------------------------------------------------------------------
# Report Discovery
# ---------------------------------------------------------------------------

def discover_reports(session: requests.Session) -> list[dict[str, Any]]:
    """Discover all available NDB reports from the OAIC publications page.

    Returns a list of dicts with keys: slug, title, url, period.
    Falls back to KNOWN_REPORT_SLUGS if page scraping fails.
    """
    if BeautifulSoup is None:
        logger.warning(
            "beautifulsoup4 not installed — using known report slugs as fallback"
        )
        return _fallback_known_reports()

    try:
        logger.info("Discovering OAIC NDB reports from publications page...")
        resp = session.get(PUBLICATIONS_URL, timeout=30)
        resp.raise_for_status()
    except requests.RequestException as exc:
        logger.warning(
            "Failed to fetch publications page: %s — using known slugs fallback",
            exc,
        )
        return _fallback_known_reports()

    soup = BeautifulSoup(resp.text, "html.parser")
    reports: list[dict[str, Any]] = []
    seen_slugs: set[str] = set()

    for link in soup.find_all("a", href=True):
        href = link["href"]
        title = link.get_text(strip=True)

        # Filter to NDB report links
        if "notifiable-data-breaches-report" not in href and "insights-report" not in href:
            continue

        slug = href.rstrip("/").split("/")[-1]
        if slug in seen_slugs:
            continue
        seen_slugs.add(slug)

        full_url = urljoin(BASE_URL, href)
        period = parse_period_from_slug(slug)

        reports.append({
            "slug": slug,
            "title": title,
            "url": full_url,
            "period": period,
        })

    if not reports:
        logger.warning("No reports discovered from page — using known slugs fallback")
        return _fallback_known_reports()

    # Supplement with any known reports not found on the page
    discovered_slugs = {r["slug"] for r in reports}
    for known in KNOWN_REPORT_SLUGS:
        if known["slug"] not in discovered_slugs:
            reports.append({
                "slug": known["slug"],
                "title": f"OAIC NDB Report — {known['period']}",
                "url": f"{BASE_URL}/privacy/notifiable-data-breaches/"
                       f"notifiable-data-breaches-publications/{known['slug']}",
                "period": known["period"],
            })

    # Sort by period descending (newest first)
    reports.sort(key=lambda r: r.get("period") or "", reverse=True)
    logger.info("Discovered %d OAIC NDB reports", len(reports))
    return reports


def _fallback_known_reports() -> list[dict[str, Any]]:
    """Return a list of reports from the hardcoded known slugs."""
    return [
        {
            "slug": k["slug"],
            "title": f"OAIC NDB Report — {k['period']}",
            "url": f"{BASE_URL}/privacy/notifiable-data-breaches/"
                   f"notifiable-data-breaches-publications/{k['slug']}",
            "period": k["period"],
        }
        for k in KNOWN_REPORT_SLUGS
    ]


# ---------------------------------------------------------------------------
# Report Parsing
# ---------------------------------------------------------------------------

def parse_report_page(session: requests.Session, url: str) -> dict[str, Any]:
    """Fetch and parse an OAIC NDB report page.

    Extracts:
        - total_notifications (from text patterns)
        - tables (all HTML tables with headers and rows)
        - pdf_url (link to the PDF version if found)
        - key_statistics (regex-matched metrics from page text)
    """
    if BeautifulSoup is None:
        logger.warning("beautifulsoup4 not installed — cannot parse report HTML")
        return {"source_url": url, "parse_error": "beautifulsoup4 not available"}

    _polite_delay()

    try:
        resp = session.get(url, timeout=30)
        resp.raise_for_status()
    except requests.RequestException as exc:
        logger.error("Failed to fetch report page %s: %s", url, exc)
        return {"source_url": url, "parse_error": str(exc)}

    soup = BeautifulSoup(resp.text, "html.parser")
    text = soup.get_text(separator=" ")
    report: dict[str, Any] = {"source_url": url}

    # --- Extract total notifications ---
    notif_patterns = [
        r"(\d[\d,]*)\s+(?:notifications?\s+were\s+received|notifications?\s+under)",
        r"received\s+(\d[\d,]*)\s+(?:notifications?|breach\s+notifications?)",
        r"(\d[\d,]*)\s+(?:data\s+breach\s+)?notifications?",
        r"total\s+(?:of\s+)?(\d[\d,]*)\s+notifications?",
    ]
    for pat in notif_patterns:
        match = re.search(pat, text, re.IGNORECASE)
        if match:
            count_str = match.group(1).replace(",", "")
            count = int(count_str)
            # Sanity: OAIC half-yearly reports should be 100–2000 range
            if 50 <= count <= 5000:
                report["total_notifications"] = count
                break

    # --- Extract breach source percentages ---
    source_patterns = {
        "malicious_or_criminal_attack_pct": [
            r"malicious\s+or\s+criminal\s+attack[s]?\s*[\-–—:]*\s*(\d+)\s*%",
            r"(\d+)\s*%\s*(?:were?\s+)?(?:the\s+result\s+of\s+)?malicious\s+or\s+criminal\s+attack",
        ],
        "human_error_pct": [
            r"human\s+error[s]?\s*[\-–—:]*\s*(\d+)\s*%",
            r"(\d+)\s*%\s*(?:were?\s+)?(?:the\s+result\s+of\s+)?human\s+error",
        ],
        "system_fault_pct": [
            r"system\s+fault[s]?\s*[\-–—:]*\s*(\d+)\s*%",
            r"(\d+)\s*%\s*(?:were?\s+)?(?:the\s+result\s+of\s+)?system\s+fault",
        ],
    }
    for key, patterns in source_patterns.items():
        for pat in patterns:
            match = re.search(pat, text, re.IGNORECASE)
            if match:
                report[key] = int(match.group(1))
                break

    # --- Extract ransomware count ---
    rw_patterns = [
        r"(\d+)\s+(?:notifications?\s+)?(?:involved?\s+)?ransomware",
        r"ransomware[:\s]+(\d+)",
    ]
    for pat in rw_patterns:
        match = re.search(pat, text, re.IGNORECASE)
        if match:
            report["ransomware_count"] = int(match.group(1))
            break

    # --- Extract identification/notification timeline percentages ---
    timeline_patterns = {
        "identified_within_30_days_pct": [
            r"(\d+)\s*%\s*(?:of\s+)?(?:entities?\s+)?identified.*?(?:within|in)\s+30\s+days",
            r"identified.*?(?:within|in)\s+30\s+days.*?(\d+)\s*%",
        ],
        "notified_oaic_within_30_days_pct": [
            r"(\d+)\s*%\s*(?:of\s+)?(?:entities?\s+)?notified.*?OAIC.*?(?:within|in)\s+30\s+days",
            r"notified.*?OAIC.*?(?:within|in)\s+30\s+days.*?(\d+)\s*%",
        ],
    }
    for key, patterns in timeline_patterns.items():
        for pat in patterns:
            match = re.search(pat, text, re.IGNORECASE)
            if match:
                report[key] = int(match.group(1))
                break

    # --- Extract all HTML tables ---
    tables = _extract_tables(soup)
    if tables:
        report["tables"] = tables

    # --- Try to classify tables into semantic categories ---
    for tbl in tables:
        _classify_table(tbl, report)

    # --- Extract PDF link ---
    for link in soup.find_all("a", href=True):
        href = link["href"]
        if href.lower().endswith(".pdf"):
            report["pdf_url"] = urljoin(BASE_URL, href)
            break

    return report


def _extract_tables(soup: "BeautifulSoup") -> list[dict[str, Any]]:
    """Extract all tables from a BeautifulSoup document."""
    tables = []
    for table in soup.find_all("table"):
        headers: list[str] = []
        rows: list[list[str]] = []

        # Try thead first
        thead = table.find("thead")
        if thead:
            for th in thead.find_all(["th", "td"]):
                headers.append(th.get_text(strip=True))

        # Fallback: first row with th elements
        if not headers:
            first_row = table.find("tr")
            if first_row:
                ths = first_row.find_all("th")
                if ths:
                    headers = [th.get_text(strip=True) for th in ths]

        # Extract data rows — include both td and th elements, since many
        # government report tables use th for the first column of data rows.
        # Skip the header row if it was already captured.
        all_trs = table.find_all("tr")
        for i, tr in enumerate(all_trs):
            # Skip the first row if it was used for headers
            if i == 0 and headers:
                header_text = [th.get_text(strip=True) for th in tr.find_all(["th", "td"])]
                if header_text == headers:
                    continue
            cells = tr.find_all(["td", "th"])
            if cells:
                row = [cell.get_text(strip=True) for cell in cells]
                # Skip rows that exactly duplicate the headers
                if row != headers:
                    rows.append(row)

        if headers or rows:
            tables.append({"headers": headers, "rows": rows})

    return tables


def _classify_table(table: dict[str, Any], report: dict[str, Any]) -> None:
    """Attempt to classify a table and extract structured data from it.

    Checks headers and content to identify sector breakdowns, breach source
    breakdowns, cyber incident types, and individuals-affected distributions.
    """
    headers_lower = [h.lower() for h in table.get("headers", [])]
    rows = table.get("rows", [])

    if not rows:
        return

    # Sector breakdown table
    if any("sector" in h or "industry" in h for h in headers_lower):
        sectors = []
        for row in rows:
            if len(row) >= 2:
                sector_name = row[0].strip()
                count_str = re.sub(r"[^\d]", "", row[1]) if row[1] else ""
                count = int(count_str) if count_str else None
                pct_str = re.sub(r"[^\d.]", "", row[2]) if len(row) > 2 and row[2] else None
                pct = float(pct_str) if pct_str else None
                tp_sector = SECTOR_MAP.get(sector_name, _fuzzy_sector_match(sector_name))
                sectors.append({
                    "sector": sector_name,
                    "tp_sector": tp_sector,
                    "count": count,
                    "percentage": pct,
                })
        if sectors:
            report.setdefault("sector_distribution", sectors)

    # Breach source breakdown
    elif any("source" in h or "cause" in h for h in headers_lower):
        sources = []
        for row in rows:
            if len(row) >= 2:
                cause_name = row[0].strip()
                count_str = re.sub(r"[^\d]", "", row[1]) if row[1] else ""
                count = int(count_str) if count_str else None
                tp_cause = CAUSE_MAP.get(cause_name, cause_name.lower().replace(" ", "_"))
                sources.append({
                    "cause": cause_name,
                    "tp_cause": tp_cause,
                    "count": count,
                })
        if sources:
            report.setdefault("breach_source_distribution", sources)

    # Individuals affected distribution
    elif any("individual" in h or "affected" in h for h in headers_lower):
        brackets = []
        for row in rows:
            if len(row) >= 2:
                bracket = row[0].strip()
                val_str = re.sub(r"[^\d.]", "", row[1]) if row[1] else ""
                val = float(val_str) if val_str else None
                brackets.append({"bracket": bracket, "value": val})
        if brackets:
            report.setdefault("individuals_affected_distribution", brackets)


def _fuzzy_sector_match(sector_name: str) -> str:
    """Attempt fuzzy matching against known sectors."""
    name_lower = sector_name.lower()
    for key, value in SECTOR_MAP.items():
        if key.lower() in name_lower or name_lower in key.lower():
            return value
    return sector_name.lower().replace(" ", "_").replace(",", "")


# ---------------------------------------------------------------------------
# Normalization
# ---------------------------------------------------------------------------

def normalize_report(
    parsed: dict[str, Any],
    period: str,
    report_meta: dict[str, Any],
) -> dict[str, Any]:
    """Normalize a parsed report into Threatpedia's aggregate record format."""
    start_date, end_date = period_to_date_range(period)
    publish_date = KNOWN_PUBLISH_DATES.get(period, "")

    record: dict[str, Any] = {
        "source_id": f"oaic-ndb:{period}",
        "data_source": "oaic-ndb",
        "report_period": period,
        "period_start": start_date,
        "period_end": end_date,
        "publish_date": publish_date,
        "country": "AU",
        "regulatory_framework": "Privacy Act 1988 (Cth) — NDB Scheme",
        "confidence_level": "HIGH",
        "source_url": parsed.get("source_url", report_meta.get("url", "")),
        "title": report_meta.get("title", f"OAIC NDB Report — {period}"),
    }

    # Core metrics
    if "total_notifications" in parsed:
        record["total_notifications"] = parsed["total_notifications"]

    # Breach source percentages
    breach_sources: dict[str, Any] = {}
    total = parsed.get("total_notifications")
    for key, label in [
        ("malicious_or_criminal_attack_pct", "malicious_or_criminal_attack"),
        ("human_error_pct", "human_error"),
        ("system_fault_pct", "system_fault"),
    ]:
        if key in parsed:
            pct = parsed[key]
            breach_sources[label] = {"percentage": pct}
            if total:
                breach_sources[label]["count"] = round(total * pct / 100)
    if breach_sources:
        record["breach_sources"] = breach_sources

    # Ransomware count
    if "ransomware_count" in parsed:
        record["ransomware_count"] = parsed["ransomware_count"]

    # Timeline metrics
    if "identified_within_30_days_pct" in parsed:
        record["identified_within_30_days_pct"] = parsed["identified_within_30_days_pct"]
    if "notified_oaic_within_30_days_pct" in parsed:
        record["notified_oaic_within_30_days_pct"] = parsed["notified_oaic_within_30_days_pct"]

    # Structured distributions from table parsing
    if "sector_distribution" in parsed:
        record["sector_distribution"] = parsed["sector_distribution"]
    if "breach_source_distribution" in parsed:
        record["breach_source_distribution"] = parsed["breach_source_distribution"]
    if "individuals_affected_distribution" in parsed:
        record["individuals_affected_distribution"] = parsed["individuals_affected_distribution"]

    # PDF link
    if "pdf_url" in parsed:
        record["pdf_url"] = parsed["pdf_url"]

    # Raw tables for reference
    if "tables" in parsed:
        record["raw_tables"] = parsed["tables"]

    record["last_synced"] = datetime.now(timezone.utc).isoformat()

    return record


# ---------------------------------------------------------------------------
# Main Connector Class
# ---------------------------------------------------------------------------

class AustralianOAICConnector:
    """Connector for the Australian OAIC Notifiable Data Breaches scheme.

    Modes:
        - full: discover and parse all available half-yearly reports
        - incremental: parse only reports published after a given date
        - lookup: fetch a specific report by period (e.g. '2024-H2')
    """

    SOURCE_NAME = "australian-oaic-ndb"
    SOURCE_URL = PUBLICATIONS_URL

    def __init__(self) -> None:
        self.session = _build_session()
        self._reports_cache: Optional[list[dict[str, Any]]] = None

    def discover(self) -> list[dict[str, Any]]:
        """Discover all available NDB reports."""
        if self._reports_cache is None:
            self._reports_cache = discover_reports(self.session)
        return self._reports_cache

    def fetch_full(self) -> list[dict[str, Any]]:
        """Fetch and parse all available reports (full mode)."""
        reports = self.discover()
        results = []
        errors = 0

        for meta in reports:
            period = meta.get("period")
            if not period:
                logger.warning("Skipping report with unknown period: %s", meta.get("slug"))
                continue

            try:
                logger.info("Parsing report: %s (%s)", period, meta["url"])
                parsed = parse_report_page(self.session, meta["url"])
                if "parse_error" in parsed:
                    errors += 1
                    logger.error("Parse error for %s: %s", period, parsed["parse_error"])
                    continue
                normalized = normalize_report(parsed, period, meta)
                results.append(normalized)
                logger.info(
                    "  → %s: %s notifications",
                    period,
                    normalized.get("total_notifications", "N/A"),
                )
            except Exception as exc:
                errors += 1
                logger.error("Failed to parse report %s: %s", period, exc)

        logger.info(
            "Full sync complete: %d reports parsed, %d errors", len(results), errors
        )
        return results

    def fetch_incremental(self, since_date: str) -> list[dict[str, Any]]:
        """Fetch reports published after since_date (incremental mode).

        Args:
            since_date: ISO 8601 date string (e.g. '2024-06-01').
                        Reports with a known publish_date after this are included.
                        If publish_date is unknown, the report is included.
        """
        reports = self.discover()
        results = []
        errors = 0

        for meta in reports:
            period = meta.get("period")
            if not period:
                continue

            # Check if this report was published after since_date
            pub_date = KNOWN_PUBLISH_DATES.get(period, "")
            if pub_date and pub_date < since_date:
                logger.debug("Skipping %s (published %s, before %s)", period, pub_date, since_date)
                continue

            try:
                logger.info("Parsing report: %s (%s)", period, meta["url"])
                parsed = parse_report_page(self.session, meta["url"])
                if "parse_error" in parsed:
                    errors += 1
                    logger.error("Parse error for %s: %s", period, parsed["parse_error"])
                    continue
                normalized = normalize_report(parsed, period, meta)
                results.append(normalized)
                logger.info(
                    "  → %s: %s notifications",
                    period,
                    normalized.get("total_notifications", "N/A"),
                )
            except Exception as exc:
                errors += 1
                logger.error("Failed to parse report %s: %s", period, exc)

        logger.info(
            "Incremental sync complete: %d reports parsed, %d errors",
            len(results),
            errors,
        )
        return results

    def fetch_lookup(self, period: str) -> Optional[dict[str, Any]]:
        """Fetch a specific report by period identifier.

        Args:
            period: Report period (e.g. '2024-H2', '2023-H1', '2018-FULL').
        """
        reports = self.discover()
        target = None

        # Find matching report
        for meta in reports:
            if meta.get("period") == period:
                target = meta
                break

        if not target:
            # Try matching by slug substring
            period_lower = period.lower().replace("-", "")
            for meta in reports:
                if period_lower in (meta.get("slug") or "").lower().replace("-", ""):
                    target = meta
                    break

        if not target:
            logger.error("No report found for period: %s", period)
            return None

        logger.info("Looking up report: %s (%s)", period, target["url"])
        parsed = parse_report_page(self.session, target["url"])
        return normalize_report(parsed, target["period"] or period, target)


# ---------------------------------------------------------------------------
# Unit Tests
# ---------------------------------------------------------------------------

class TestOAICConnectorUtils(unittest.TestCase):
    """Unit tests for helper functions."""

    def test_parse_period_from_slug_h1(self) -> None:
        self.assertEqual(
            parse_period_from_slug("notifiable-data-breaches-report-january-to-june-2024"),
            "2024-H1",
        )

    def test_parse_period_from_slug_h2(self) -> None:
        self.assertEqual(
            parse_period_from_slug("notifiable-data-breaches-report-july-to-december-2024"),
            "2024-H2",
        )

    def test_parse_period_from_slug_old_format_h1(self) -> None:
        self.assertEqual(
            parse_period_from_slug("notifiable-data-breaches-report-januaryjune-2021"),
            "2021-H1",
        )

    def test_parse_period_from_slug_old_format_h2(self) -> None:
        self.assertEqual(
            parse_period_from_slug("notifiable-data-breaches-report-julydecember-2020"),
            "2020-H2",
        )

    def test_parse_period_from_slug_insights(self) -> None:
        self.assertEqual(
            parse_period_from_slug("notifiable-data-breaches-scheme-12-month-insights-report"),
            "2018-FULL",
        )

    def test_parse_period_from_slug_unknown(self) -> None:
        self.assertIsNone(parse_period_from_slug("some-random-page"))

    def test_period_to_date_range_h1(self) -> None:
        start, end = period_to_date_range("2024-H1")
        self.assertEqual(start, "2024-01-01")
        self.assertEqual(end, "2024-06-30")

    def test_period_to_date_range_h2(self) -> None:
        start, end = period_to_date_range("2024-H2")
        self.assertEqual(start, "2024-07-01")
        self.assertEqual(end, "2024-12-31")

    def test_period_to_date_range_full(self) -> None:
        start, end = period_to_date_range("2018-FULL")
        self.assertEqual(start, "2018-02-22")
        self.assertEqual(end, "2019-02-21")

    def test_period_to_date_range_invalid(self) -> None:
        start, end = period_to_date_range("invalid")
        self.assertEqual(start, "")
        self.assertEqual(end, "")

    def test_sector_map_exact(self) -> None:
        self.assertEqual(SECTOR_MAP.get("Health service providers"), "healthcare")
        self.assertEqual(SECTOR_MAP.get("Australian Government"), "government")
        self.assertEqual(SECTOR_MAP.get("Education"), "education")

    def test_fuzzy_sector_match(self) -> None:
        result = _fuzzy_sector_match("Health service providers (private sector)")
        self.assertEqual(result, "healthcare")

    def test_cause_map(self) -> None:
        self.assertEqual(CAUSE_MAP.get("Ransomware"), "ransomware")
        self.assertEqual(CAUSE_MAP.get("Human error"), "human_error")
        self.assertEqual(CAUSE_MAP.get("Phishing (compromised credentials)"), "phishing")

    def test_fallback_known_reports(self) -> None:
        reports = _fallback_known_reports()
        self.assertGreater(len(reports), 0)
        self.assertTrue(all("period" in r for r in reports))
        self.assertTrue(all("url" in r for r in reports))

    def test_normalize_report_basic(self) -> None:
        parsed = {
            "source_url": "https://example.com/report",
            "total_notifications": 586,
            "malicious_or_criminal_attack_pct": 69,
            "human_error_pct": 29,
            "system_fault_pct": 2,
            "ransomware_count": 60,
        }
        meta = {"title": "Test Report", "url": "https://example.com/report"}
        result = normalize_report(parsed, "2024-H2", meta)

        self.assertEqual(result["source_id"], "oaic-ndb:2024-H2")
        self.assertEqual(result["country"], "AU")
        self.assertEqual(result["total_notifications"], 586)
        self.assertEqual(result["ransomware_count"], 60)
        self.assertIn("breach_sources", result)
        self.assertEqual(result["breach_sources"]["malicious_or_criminal_attack"]["percentage"], 69)
        # 586 * 69% ≈ 404
        self.assertEqual(result["breach_sources"]["malicious_or_criminal_attack"]["count"], 404)

    def test_normalize_report_minimal(self) -> None:
        """Test normalization with minimal data."""
        parsed = {"source_url": "https://example.com"}
        meta = {"url": "https://example.com"}
        result = normalize_report(parsed, "2023-H1", meta)

        self.assertEqual(result["source_id"], "oaic-ndb:2023-H1")
        self.assertEqual(result["period_start"], "2023-01-01")
        self.assertEqual(result["period_end"], "2023-06-30")
        self.assertNotIn("total_notifications", result)

    def test_known_publish_dates_coverage(self) -> None:
        """Verify all known report slugs have a publish date."""
        for kr in KNOWN_REPORT_SLUGS:
            self.assertIn(
                kr["period"],
                KNOWN_PUBLISH_DATES,
                f"Missing publish date for {kr['period']}",
            )

    def test_classify_table_sectors(self) -> None:
        """Test table classification for sector data."""
        table = {
            "headers": ["Industry Sector", "Count", "Percentage"],
            "rows": [
                ["Health service providers", "121", "20%"],
                ["Australian Government", "100", "17%"],
            ],
        }
        report: dict[str, Any] = {}
        _classify_table(table, report)
        self.assertIn("sector_distribution", report)
        self.assertEqual(len(report["sector_distribution"]), 2)
        self.assertEqual(report["sector_distribution"][0]["tp_sector"], "healthcare")

    def test_classify_table_breach_sources(self) -> None:
        """Test table classification for breach source data."""
        table = {
            "headers": ["Source of breach", "Count"],
            "rows": [
                ["Malicious or criminal attack", "404"],
                ["Human error", "170"],
                ["System fault", "12"],
            ],
        }
        report: dict[str, Any] = {}
        _classify_table(table, report)
        self.assertIn("breach_source_distribution", report)
        self.assertEqual(len(report["breach_source_distribution"]), 3)
        self.assertEqual(
            report["breach_source_distribution"][0]["tp_cause"],
            "malicious_attack",
        )

    def test_classify_table_individuals(self) -> None:
        """Test table classification for individuals affected data."""
        table = {
            "headers": ["Individuals affected", "Percentage"],
            "rows": [
                ["1-100", "63%"],
                ["101-1,000", "22%"],
            ],
        }
        report: dict[str, Any] = {}
        _classify_table(table, report)
        self.assertIn("individuals_affected_distribution", report)
        self.assertEqual(len(report["individuals_affected_distribution"]), 2)


# ---------------------------------------------------------------------------
# CLI Entry Point
# ---------------------------------------------------------------------------

def _write_output(
    records: list[dict[str, Any]] | dict[str, Any],
    output_path: Optional[str],
    fmt: str,
) -> None:
    """Write records to a file or stdout."""
    if isinstance(records, dict):
        records = [records]

    if fmt == "jsonl":
        lines = [json.dumps(r, default=str) for r in records]
        text = "\n".join(lines) + "\n"
    else:
        text = json.dumps(records, indent=2, default=str)

    if output_path:
        Path(output_path).write_text(text, encoding="utf-8")
        logger.info("Wrote %d records to %s", len(records), output_path)
    else:
        print(text)


def main() -> None:
    """CLI entry point."""
    parser = argparse.ArgumentParser(
        description="Threatpedia — Australian OAIC NDB Connector",
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog="""
Examples:
  # List all discoverable reports
  python australian_oaic_connector.py --mode full --dry-run

  # Full sync — parse all reports
  python australian_oaic_connector.py --mode full --output oaic_ndb.json

  # Incremental — only reports published after a date
  python australian_oaic_connector.py --mode incremental --since 2024-06-01

  # Lookup a specific report period
  python australian_oaic_connector.py --mode lookup --period 2024-H2

  # Run unit tests
  python australian_oaic_connector.py --test
        """,
    )
    parser.add_argument(
        "--mode",
        choices=["full", "incremental", "lookup"],
        default="full",
        help="Sync mode (default: full)",
    )
    parser.add_argument(
        "--since",
        type=str,
        default=None,
        help="ISO date for incremental mode (e.g. 2024-06-01)",
    )
    parser.add_argument(
        "--period",
        type=str,
        default=None,
        help="Report period for lookup mode (e.g. 2024-H2, 2023-H1, 2018-FULL)",
    )
    parser.add_argument(
        "--output",
        type=str,
        default=None,
        help="Output file path (default: stdout)",
    )
    parser.add_argument(
        "--format",
        choices=["json", "jsonl"],
        default="json",
        help="Output format (default: json)",
    )
    parser.add_argument(
        "--dry-run",
        action="store_true",
        help="Only discover reports, don't parse them",
    )
    parser.add_argument(
        "--test",
        action="store_true",
        help="Run unit tests",
    )
    parser.add_argument(
        "--verbose",
        "-v",
        action="store_true",
        help="Enable verbose logging",
    )

    args = parser.parse_args()

    # Configure logging
    log_level = logging.DEBUG if args.verbose else logging.INFO
    logging.basicConfig(
        level=log_level,
        format="%(asctime)s [%(levelname)s] %(name)s: %(message)s",
        datefmt="%Y-%m-%dT%H:%M:%S",
    )

    # Run tests if requested
    if args.test:
        loader = unittest.TestLoader()
        suite = loader.loadTestsFromTestCase(TestOAICConnectorUtils)
        runner = unittest.TextTestRunner(verbosity=2)
        result = runner.run(suite)
        sys.exit(0 if result.wasSuccessful() else 1)

    # Validate arguments
    if args.mode == "incremental" and not args.since:
        parser.error("--since is required for incremental mode")
    if args.mode == "lookup" and not args.period:
        parser.error("--period is required for lookup mode")

    connector = AustralianOAICConnector()

    if args.dry_run:
        reports = connector.discover()
        print(f"Discovered {len(reports)} OAIC NDB reports:")
        for r in reports:
            pub_date = KNOWN_PUBLISH_DATES.get(r.get("period", ""), "unknown")
            period_str = r.get("period") or "N/A"
            print(f"  {period_str:>10}  published: {pub_date}  {r['title']}")
        return

    if args.mode == "full":
        records = connector.fetch_full()
        _write_output(records, args.output, args.format)

    elif args.mode == "incremental":
        records = connector.fetch_incremental(args.since)
        _write_output(records, args.output, args.format)

    elif args.mode == "lookup":
        record = connector.fetch_lookup(args.period)
        if record:
            _write_output(record, args.output, args.format)
        else:
            logger.error("No report found for period: %s", args.period)
            sys.exit(1)


if __name__ == "__main__":
    main()
