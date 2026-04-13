#!/usr/bin/env python3
"""
Threatpedia — EU GDPR Enforcement Tracker Connector
=====================================================

Scrapes the CMS.Law GDPR Enforcement Tracker — the most comprehensive public
database of GDPR fines and penalties imposed by EU/EEA Data Protection
Authorities (DPAs).

Data source:
    https://www.enforcementtracker.com/

Features:
    - Full mode: scrape all ~2,800+ enforcement records
    - Incremental mode: scrape recent records by date of decision
    - Lookup mode: query by specific ETid
    - Dual scraping approach: XHR/API discovery with Selenium HTML fallback
    - Deterministic breach_id via ETid namespace (GDPR-ET-{id})
    - Fine amount parsing with non-monetary outcome handling
    - GDPR article citation normalization
    - Country → ISO 3166-1 alpha-2 mapping (31+ EU/EEA jurisdictions)
    - Sector → Threatpedia taxonomy mapping
    - CLI entry point with argparse

No authentication required — public data maintained by CMS International Law Firm.
"""

from __future__ import annotations

import argparse
import json
import logging
import re
import sys
import time
from datetime import datetime, timezone
from pathlib import Path
from typing import Any, Optional

import requests as req_lib

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

logger = logging.getLogger("threatpedia.connectors.eu_gdpr_enforcement_tracker")

# ---------------------------------------------------------------------------
# Constants
# ---------------------------------------------------------------------------

TRACKER_URL = "https://www.enforcementtracker.com/"
DETAIL_URL_TEMPLATE = "https://www.enforcementtracker.com/ETid-{etid}"
# Courteous pacing — no published rate limits
REQUEST_DELAY_MIN = 2.0
REQUEST_DELAY_MAX = 4.0
PAGE_LOAD_TIMEOUT = 30

USER_AGENT = (
    "Mozilla/5.0 (compatible; Threatpedia/1.0; "
    "+https://github.com/MahdiHedhli/threatpedia)"
)

# ---------------------------------------------------------------------------
# Country → ISO 3166-1 Alpha-2 Mapping
# ---------------------------------------------------------------------------

COUNTRY_TO_ISO = {
    "Austria": "AT",
    "Belgium": "BE",
    "Bulgaria": "BG",
    "Croatia": "HR",
    "Cyprus": "CY",
    "Czech Republic": "CZ",
    "Denmark": "DK",
    "Estonia": "EE",
    "Finland": "FI",
    "France": "FR",
    "Germany": "DE",
    "Greece": "GR",
    "Hungary": "HU",
    "Iceland": "IS",
    "Ireland": "IE",
    "Isle of Man": "IM",
    "Italy": "IT",
    "Latvia": "LV",
    "Liechtenstein": "LI",
    "Lithuania": "LT",
    "Luxembourg": "LU",
    "Malta": "MT",
    "Norway": "NO",
    "Poland": "PL",
    "Portugal": "PT",
    "Romania": "RO",
    "Slovakia": "SK",
    "Slovenia": "SI",
    "Spain": "ES",
    "Sweden": "SE",
    "The Netherlands": "NL",
    "Netherlands": "NL",
    "United Kingdom": "GB",
}

# ---------------------------------------------------------------------------
# Sector Mapping: Enforcement Tracker → Threatpedia Taxonomy
# ---------------------------------------------------------------------------

SECTOR_MAP = {
    "Media, Telecoms and Broadcasting": "Telecommunications",
    "Media, Telecoms & Broadcasting": "Telecommunications",
    "Industry and Commerce": "Retail / Commerce",
    "Industry & Commerce": "Retail / Commerce",
    "Finance, Insurance and Consulting": "Finance & Insurance",
    "Finance, Insurance & Consulting": "Finance & Insurance",
    "Transportation and Energy": "Energy & Utilities",
    "Transportation & Energy": "Energy & Utilities",
    "Employment": "Human Resources",
    "Health care": "Healthcare",
    "Healthcare": "Healthcare",
    "Hospitality & Leisure": "Hospitality",
    "Hospitality and Leisure": "Hospitality",
    "Education": "Education",
    "Public Sector and Education": "Government",
    "Public Sector & Education": "Government",
    "Real Estate": "Real Estate",
    "Individuals / Private": "Individual",
    "Individuals/Private": "Individual",
    "Not disclosed": "Unknown",
    "Not Disclosed": "Unknown",
    "": "Unknown",
}

# ---------------------------------------------------------------------------
# ---------------------------------------------------------------------------
# DPA Reference (Country → Primary DPA)
# ---------------------------------------------------------------------------

COUNTRY_DPA = {
    "AT": "DSB",
    "BE": "APD/GBA",
    "BG": "CPDP",
    "HR": "AZOP",
    "CY": "Commissioner",
    "CZ": "ÚOOÚ",
    "DK": "Datatilsynet",
    "EE": "AKI",
    "FI": "Tietosuojavaltuutettu",
    "FR": "CNIL",
    "DE": "BfDI",
    "GR": "HDPA",
    "HU": "NAIH",
    "IS": "Persónuvernd",
    "IE": "DPC",
    "IT": "Garante",
    "LV": "DVI",
    "LI": "DSS",
    "LT": "VDAI",
    "LU": "CNPD",
    "MT": "IDPC",
    "NL": "AP",
    "NO": "Datatilsynet",
    "PL": "UODO",
    "PT": "CNPD",
    "RO": "ANSPDCP",
    "SK": "ÚOOU",
    "SI": "IP RS",
    "ES": "AEPD",
    "SE": "IMY",
    "GB": "ICO",
    "IM": "ODPC",
}


# ---------------------------------------------------------------------------
# Helper Functions
# ---------------------------------------------------------------------------

def parse_fine_amount(val: str) -> tuple[Optional[float], str]:
    """Parse a fine amount string.

    Returns:
        Tuple of (amount_eur, fine_type) where fine_type is one of:
        'monetary', 'reprimand', 'ban', 'undisclosed', 'unknown'.
    """
    if not val or not val.strip():
        return None, "unknown"

    val_lower = val.strip().lower()

    # Non-monetary outcomes
    if any(kw in val_lower for kw in ("reprimand", "warning", "admonition")):
        return 0.0, "reprimand"
    if any(kw in val_lower for kw in ("ban", "order", "prohibition")):
        return 0.0, "ban"
    if any(kw in val_lower for kw in ("not yet disclosed", "not disclosed", "n/a", "unknown")):
        return None, "undisclosed"

    # Strip currency codes first (before removing whitespace, so word boundaries work)
    # Handles EUR, PLN, SEK, CHF, GBP, etc.
    cleaned = re.sub(
        r"\b(?:EUR|PLN|SEK|NOK|DKK|CZK|HUF|RON|BGN|HRK|ISK|CHF|GBP)\b",
        "", val, flags=re.IGNORECASE,
    )
    # Strip all non-numeric characters except decimal/thousands separators
    cleaned = re.sub(r"[^\d.,-]", "", cleaned)
    # Handle European number format: 1.200.000,50 → 1200000.50
    if "," in cleaned and "." in cleaned:
        # Determine which is the decimal separator
        last_comma = cleaned.rfind(",")
        last_dot = cleaned.rfind(".")
        if last_comma > last_dot:
            # European format: dots are thousands, comma is decimal
            cleaned = cleaned.replace(".", "").replace(",", ".")
        else:
            # US format: commas are thousands, dot is decimal
            cleaned = cleaned.replace(",", "")
    elif "," in cleaned:
        # Could be thousands separator or decimal
        parts = cleaned.split(",")
        if len(parts[-1]) <= 2:
            # Likely decimal separator
            cleaned = cleaned.replace(",", ".")
        else:
            # Likely thousands separator
            cleaned = cleaned.replace(",", "")
    elif "." in cleaned:
        # Could be thousands separator or decimal
        parts = cleaned.split(".")
        if len(parts) > 2:
            # Multiple dots = thousands separators (e.g., 1.200.000)
            cleaned = cleaned.replace(".", "")
        elif len(parts) == 2 and len(parts[-1]) == 3:
            # Single dot with exactly 3 trailing digits = thousands separator
            # (e.g., 1.000 = one thousand, not 1.000 = one)
            cleaned = cleaned.replace(".", "")
        # Otherwise single dot: leave as-is (decimal, e.g., 1.5)

    try:
        amount = float(cleaned)
        return amount, "monetary"
    except (ValueError, TypeError):
        logger.warning("Could not parse fine amount: %r", val)
        return None, "unknown"


def parse_date_european(val: str) -> Optional[str]:
    """Parse European date formats (DD/MM/YYYY, DD.MM.YYYY) to ISO 8601."""
    if not val or not val.strip():
        return None
    val = val.strip()
    for fmt in ("%d/%m/%Y", "%d.%m.%Y", "%Y-%m-%d", "%m/%d/%Y"):
        try:
            dt = datetime.strptime(val, fmt)
            return dt.strftime("%Y-%m-%d")
        except ValueError:
            continue
    return val  # Return as-is rather than lose data


def normalize_article_citation(citation: str) -> str:
    """Normalize a GDPR article citation to consistent format.

    Examples:
        'Art. 5 (1) a)' → 'Art. 5(1)(a)'
        'Art. 5 para. 1 lit. a' → 'Art. 5(1)(a)'
        'Art. 32' → 'Art. 32'
    """
    if not citation:
        return citation

    citation = citation.strip()

    # Normalize 'para.' / 'paragraph' to parenthesized form
    citation = re.sub(r"\s+para(?:graph)?\.?\s*(\d+)", r"(\1)", citation)
    # Normalize 'lit.' to parenthesized form
    citation = re.sub(r"\s+lit\.?\s*([a-z])", r"(\1)", citation)
    # Normalize ' (1) a)' to '(1)(a)'
    citation = re.sub(r"\s*\((\d+)\)\s*([a-z])\)", r"(\1)(\2)", citation)
    # Normalize ' (1) (a)' (already parenthesized but with spaces)
    citation = re.sub(r"\s*\((\d+)\)\s*\(([a-z])\)", r"(\1)(\2)", citation)
    # Clean up residual spaces before parentheses
    citation = re.sub(r"\s+\(", "(", citation)
    # Ensure 'Art.' prefix
    if not citation.startswith("Art"):
        citation = f"Art. {citation}"

    return citation


def parse_article_list(articles_str: str) -> list[str]:
    """Split and normalize a comma-separated list of GDPR article citations."""
    if not articles_str:
        return []
    # Split on comma, semicolon, or ' | '
    parts = re.split(r"[,;|]+", articles_str)
    normalized = []
    for part in parts:
        part = part.strip()
        if part:
            normalized.append(normalize_article_citation(part))
    return normalized


# ---------------------------------------------------------------------------
# Scraping Backend: requests + BeautifulSoup
# ---------------------------------------------------------------------------

class GDPREnforcementRequestsScraper:
    """Scrape the GDPR Enforcement Tracker using requests + BeautifulSoup.

    This is the lightweight fallback approach. The site renders its table
    via JavaScript (DataTables.js), so this backend tries to discover
    the underlying XHR/JSON data endpoint first, then falls back to
    Selenium-based HTML scraping if needed.
    """

    def __init__(self, request_delay: float = REQUEST_DELAY_MIN):
        self.delay = request_delay
        self.session = req_lib.Session()
        self.session.headers.update({
            "User-Agent": USER_AGENT,
            "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
            "Accept-Language": "en-US,en;q=0.5",
        })

    def _try_json_endpoint(self) -> Optional[list[dict]]:
        """Attempt to discover and fetch the DataTables JSON endpoint.

        Many DataTables-powered sites serve data via an AJAX endpoint
        that returns JSON. This is far more efficient than HTML scraping.
        """
        # Common DataTables AJAX endpoint patterns
        candidate_urls = [
            "https://www.enforcementtracker.com/data.json",
            "https://www.enforcementtracker.com/api/data",
            "https://www.enforcementtracker.com/api/fines",
            "https://www.enforcementtracker.com/data",
            "https://www.enforcementtracker.com/json",
            "https://www.enforcementtracker.com/ETData",
        ]

        headers = {
            "User-Agent": USER_AGENT,
            "Accept": "application/json, text/javascript, */*; q=0.01",
            "X-Requested-With": "XMLHttpRequest",
        }

        for url in candidate_urls:
            try:
                resp = self.session.get(
                    url, headers=headers, timeout=PAGE_LOAD_TIMEOUT
                )
                if resp.status_code == 200 and resp.headers.get(
                    "content-type", ""
                ).startswith("application/json"):
                    data = resp.json()
                    # DataTables server-side format
                    if isinstance(data, dict) and "data" in data:
                        logger.info(
                            "Found JSON endpoint at %s (%d records)",
                            url,
                            len(data["data"]),
                        )
                        return data["data"]
                    # Plain array format
                    if isinstance(data, list) and len(data) > 0:
                        logger.info(
                            "Found JSON endpoint at %s (%d records)",
                            url,
                            len(data),
                        )
                        return data
            except (req_lib.exceptions.RequestException, ValueError):
                continue

            time.sleep(0.5)

        logger.info("No JSON endpoint discovered; will use HTML scraping")
        return None

    def _try_selenium_scrape(self) -> Optional[str]:
        """Attempt to load the tracker using Selenium (headless Chrome).

        Returns the fully rendered page HTML, or None if Selenium is unavailable.
        """
        try:
            from selenium import webdriver
            from selenium.webdriver.chrome.options import Options
            from selenium.webdriver.common.by import By
            from selenium.webdriver.support.ui import WebDriverWait
            from selenium.webdriver.support import expected_conditions as EC
        except ImportError:
            logger.debug("Selenium not available")
            return None

        try:
            options = Options()
            options.add_argument("--headless=new")
            options.add_argument("--no-sandbox")
            options.add_argument("--disable-dev-shm-usage")
            options.add_argument("--disable-gpu")
            options.add_argument("--window-size=1920,1080")
            options.add_argument(f"user-agent={USER_AGENT}")

            driver = webdriver.Chrome(options=options)
            driver.set_page_load_timeout(PAGE_LOAD_TIMEOUT)

            try:
                logger.info("Loading Enforcement Tracker via Selenium...")
                driver.get(TRACKER_URL)
                time.sleep(self.delay)

                # Wait for DataTables to render
                WebDriverWait(driver, PAGE_LOAD_TIMEOUT).until(
                    EC.presence_of_element_located(
                        (By.CSS_SELECTOR, "table tbody tr")
                    )
                )

                # Try to set "show all" or maximum page size
                try:
                    length_select = driver.find_element(
                        By.CSS_SELECTOR, "select[name*='length']"
                    )
                    for option in length_select.find_elements(By.TAG_NAME, "option"):
                        if option.get_attribute("value") in ["-1", "10000", "All"]:
                            option.click()
                            time.sleep(5)
                            break
                except Exception:
                    logger.debug("Could not set 'show all' page size")

                html = driver.page_source
                logger.info("Selenium page loaded: %d bytes", len(html))
                return html

            finally:
                driver.quit()

        except Exception as exc:
            logger.debug("Selenium scrape failed: %s", exc)
            return None

    def _parse_html_table(self, html: str) -> list[dict]:
        """Parse enforcement records from the HTML table."""
        try:
            from bs4 import BeautifulSoup
        except ImportError:
            logger.error("beautifulsoup4 is required for HTML parsing")
            return []

        soup = BeautifulSoup(html, "html.parser")
        records = []

        # Find the main data table
        table = None
        for selector in [
            "table#enforcementtracker",
            "table.dataTable",
            'table[role="grid"]',
            "table.display",
        ]:
            table = soup.select_one(selector)
            if table:
                break

        # Fallback: pick the table with the most rows
        if not table:
            all_tables = soup.find_all("table")
            best_table = None
            best_count = 0
            for t in all_tables:
                row_count = len(t.find_all("tr"))
                if row_count > best_count:
                    best_count = row_count
                    best_table = t
            if best_table and best_count > 5:
                table = best_table

        if not table:
            logger.warning("No data table found on page")
            return records

        # Discover column mapping from headers
        thead = table.find("thead")
        headers = []
        if thead:
            for th in thead.find_all(["th", "td"]):
                headers.append(th.get_text(strip=True).lower())

        col_map = {}
        header_patterns = [
            ("etid", "etid"),
            ("country", "country"),
            ("authority", "authority"),
            ("date", "date_of_decision"),
            ("fine", "fine_eur"),
            ("controller", "controller_processor"),
            ("sector", "sector"),
            ("quoted", "quoted_articles"),
            ("article", "quoted_articles"),
            ("type", "violation_type"),
        ]

        for idx, h in enumerate(headers):
            for pattern, field_name in header_patterns:
                if pattern in h and field_name not in col_map:
                    col_map[field_name] = idx
                    break

        # Positional fallback if header discovery fails
        if len(col_map) < 5:
            logger.warning(
                "Header discovery found %d cols; using positional fallback "
                "(may be inaccurate if site structure changed)",
                len(col_map),
            )
            col_map = {
                "etid": 0,
                "country": 1,
                "authority": 2,
                "date_of_decision": 3,
                "fine_eur": 4,
                "controller_processor": 5,
                "quoted_articles": 6,
                "violation_type": 7,
            }

        # Capture scrape timestamp once
        batch_timestamp = datetime.now(timezone.utc).isoformat()

        # Parse data rows
        tbody = table.find("tbody")
        rows = tbody.find_all("tr") if tbody else table.find_all("tr")[1:]

        for row in rows:
            cells = row.find_all("td")
            if len(cells) < 5:
                continue

            def get_cell(field: str) -> str:
                idx = col_map.get(field)
                if idx is not None and idx < len(cells):
                    return cells[idx].get_text(strip=True)
                return ""

            etid_raw = get_cell("etid")
            if not etid_raw:
                continue

            # Extract ETid link for detail URL
            etid_link = cells[col_map.get("etid", 0)].find("a", href=True) if col_map.get("etid", 0) < len(cells) else None
            detail_url = ""
            if etid_link:
                href = etid_link["href"]
                if href.startswith("http"):
                    detail_url = href
                else:
                    detail_url = f"https://www.enforcementtracker.com/{href.lstrip('/')}"

            # Extract source link from last cell
            source_url = ""
            source_link = cells[-1].find("a", href=True)
            if source_link:
                href = source_link["href"]
                if href.startswith("http") and "enforcementtracker" not in href:
                    source_url = href

            record = {
                "etid": etid_raw,
                "country": get_cell("country"),
                "authority": get_cell("authority"),
                "date_of_decision": get_cell("date_of_decision"),
                "fine_eur_raw": get_cell("fine_eur"),
                "controller_processor": get_cell("controller_processor"),
                "sector": get_cell("sector") if "sector" in col_map else "",
                "quoted_articles": get_cell("quoted_articles"),
                "violation_type": get_cell("violation_type"),
                "source_url": source_url,
                "detail_url": detail_url,
                "scraped_at": batch_timestamp,
            }

            records.append(record)

        return records

    def _parse_json_record(self, raw: Any, batch_timestamp: str) -> Optional[dict]:
        """Normalize a JSON record from the DataTables endpoint.

        The JSON format varies; this handles both array-of-arrays
        and array-of-objects formats.
        """
        if isinstance(raw, list):
            # Array format: [etid, country, authority, date, fine, controller, articles, type, ...]
            if len(raw) < 7:
                return None
            # Strip HTML tags from cells (DataTables often wraps in <a>, <span>, etc.)
            def strip_html(val: Any) -> str:
                if not isinstance(val, str):
                    return str(val) if val is not None else ""
                return re.sub(r"<[^>]+>", "", val).strip()

            return {
                "etid": strip_html(raw[0]),
                "country": strip_html(raw[1]),
                "authority": strip_html(raw[2]) if len(raw) > 7 else "",
                "date_of_decision": strip_html(raw[3]) if len(raw) > 7 else strip_html(raw[2]),
                "fine_eur_raw": strip_html(raw[4]) if len(raw) > 7 else strip_html(raw[3]),
                "controller_processor": strip_html(raw[5]) if len(raw) > 7 else strip_html(raw[4]),
                "sector": "",
                "quoted_articles": strip_html(raw[6]) if len(raw) > 7 else strip_html(raw[5]),
                "violation_type": strip_html(raw[7]) if len(raw) > 7 else strip_html(raw[6]),
                "source_url": "",
                "detail_url": "",
                "scraped_at": batch_timestamp,
            }
        elif isinstance(raw, dict):
            # Object format
            return {
                "etid": raw.get("ETid", raw.get("etid", raw.get("id", ""))),
                "country": raw.get("Country", raw.get("country", "")),
                "authority": raw.get("Authority", raw.get("authority", "")),
                "date_of_decision": raw.get(
                    "Date of Decision",
                    raw.get("date", raw.get("date_of_decision", "")),
                ),
                "fine_eur_raw": str(
                    raw.get("Fine", raw.get("fine", raw.get("fine_eur", "")))
                ),
                "controller_processor": raw.get(
                    "Controller/Processor",
                    raw.get("controller", raw.get("controller_processor", "")),
                ),
                "sector": raw.get("Sector", raw.get("sector", "")),
                "quoted_articles": raw.get(
                    "Quoted Article(s)",
                    raw.get("articles", raw.get("quoted_articles", "")),
                ),
                "violation_type": raw.get("Type", raw.get("type", raw.get("violation_type", ""))),
                "source_url": raw.get("Source", raw.get("source_url", "")),
                "detail_url": raw.get("detail_url", ""),
                "scraped_at": batch_timestamp,
            }
        return None

    @retry_with_backoff(
        max_retries=3,
        base_delay=10.0,
        max_delay=300.0,
        retryable_exceptions=(
            req_lib.exceptions.Timeout,
            req_lib.exceptions.ConnectionError,
            req_lib.exceptions.HTTPError,
        ),
    )
    def scrape_all(self) -> list[dict]:
        """Scrape all records from the Enforcement Tracker.

        Strategy:
        1. Try to discover a JSON/XHR endpoint (fastest, most reliable)
        2. Fall back to Selenium HTML scraping
        3. Fall back to requests-based HTML fetch (least reliable for JS sites)
        """
        batch_timestamp = datetime.now(timezone.utc).isoformat()

        # Strategy 1: JSON endpoint
        json_data = self._try_json_endpoint()
        if json_data:
            records = []
            for raw in json_data:
                parsed = self._parse_json_record(raw, batch_timestamp)
                if parsed:
                    records.append(parsed)
            if records:
                logger.info("JSON endpoint returned %d records", len(records))
                return records

        # Strategy 2: Selenium HTML scraping
        selenium_html = self._try_selenium_scrape()
        if selenium_html:
            records = self._parse_html_table(selenium_html)
            if records:
                logger.info("Selenium scrape returned %d records", len(records))
                return records

        # Strategy 3: Direct requests (likely won't get JS-rendered content)
        logger.warning(
            "Selenium not available and no JSON endpoint found. "
            "Attempting direct HTML fetch (table may be empty if JS-rendered). "
            "Install selenium and webdriver-manager for full support."
        )
        try:
            resp = self.session.get(TRACKER_URL, timeout=PAGE_LOAD_TIMEOUT)
            resp.raise_for_status()
            records = self._parse_html_table(resp.text)
            if records:
                logger.info("Direct HTML scrape returned %d records", len(records))
                return records
        except req_lib.exceptions.RequestException as exc:
            logger.error("Direct HTML fetch failed: %s", exc)

        logger.warning("All scraping strategies exhausted; returning empty result")
        return []


# ---------------------------------------------------------------------------
# Connector Implementation
# ---------------------------------------------------------------------------

class EUGDPREnforcementTrackerConnector(ThreatpediaConnector):
    """Connector for the CMS.Law EU GDPR Enforcement Tracker.

    Scrapes GDPR enforcement decisions (fines, reprimands, bans) from
    the publicly available tracker. Normalizes to Threatpedia schema.

    This is a regulatory/enforcement source — it provides fine and
    violation data, not technical breach details (no CVEs, IOCs, or
    records-affected counts).
    """

    SOURCE_NAME = "eu_gdpr_enforcement_tracker"
    SOURCE_URL = "https://www.enforcementtracker.com/"

    def __init__(
        self,
        request_delay: float = REQUEST_DELAY_MIN,
        **kwargs: Any,
    ) -> None:
        # Conservative rate: 15 req/min for a web scraper
        super().__init__(rate_limit=15, rate_window=60.0, **kwargs)
        self.scraper = GDPREnforcementRequestsScraper(request_delay=request_delay)
        self._raw_records: list[dict] = []

    def authenticate(self) -> None:
        """No authentication required — public data."""
        self.logger.info("No authentication required for Enforcement Tracker")

    def fetch_all(self) -> list[dict[str, Any]]:
        """Scrape all enforcement records."""
        self.logger.info("Starting full scrape of GDPR Enforcement Tracker")
        records = self.scraper.scrape_all()
        self._raw_records = records
        self.logger.info("Fetched %d raw enforcement records", len(records))
        return records

    def fetch_incremental(self, since_date: str) -> list[dict[str, Any]]:
        """Fetch records with decision date after since_date.

        Since there's no server-side date filter, we scrape all and
        filter client-side.
        """
        self.logger.info("Incremental scrape since %s", since_date)
        all_records = self.scraper.scrape_all()

        try:
            cutoff = datetime.strptime(since_date, "%Y-%m-%d")
        except ValueError:
            self.logger.warning("Invalid since_date format: %s", since_date)
            return all_records

        filtered = []
        for record in all_records:
            date_iso = parse_date_european(record.get("date_of_decision", ""))
            if date_iso:
                try:
                    record_date = datetime.strptime(date_iso, "%Y-%m-%d")
                    if record_date > cutoff:
                        filtered.append(record)
                except ValueError:
                    # If date parse fails, include the record to be safe
                    filtered.append(record)
            else:
                # No date: include to avoid missing records
                filtered.append(record)

        self._raw_records = filtered
        self.logger.info(
            "Incremental filter: %d of %d records after %s",
            len(filtered),
            len(all_records),
            since_date,
        )
        return filtered

    def fetch_lookup(self, etid: str) -> list[dict[str, Any]]:
        """Look up a specific enforcement record by ETid.

        Attempts direct detail page fetch first, then falls back to
        full scrape + filter if the detail page is unavailable.

        TODO: Add LRU or time-based caching for repeated lookups to avoid
              redundant detail page fetches and full scrapes.
        """
        self.logger.info("Looking up ETid: %s", etid)

        # Normalize the ETid for comparison
        etid_normalized = etid.replace("ETid-", "").replace("ETid", "").strip()
        detail_url = DETAIL_URL_TEMPLATE.format(etid=etid_normalized)

        # Strategy 1: Try direct detail page fetch
        batch_timestamp = datetime.now(timezone.utc).isoformat()
        try:
            resp = self.scraper.session.get(detail_url, timeout=PAGE_LOAD_TIMEOUT)
            if resp.status_code == 200 and len(resp.text) > 500:
                try:
                    from bs4 import BeautifulSoup
                    soup = BeautifulSoup(resp.text, "html.parser")
                    # Look for structured data on the detail page
                    text_content = soup.get_text(separator=" ", strip=True)
                    if etid_normalized in text_content or "ETid" in text_content:
                        self.logger.info("Detail page loaded for ETid-%s", etid_normalized)
                        # Parse what we can from the detail page
                        record = {
                            "etid": f"ETid-{etid_normalized}",
                            "detail_url": detail_url,
                            "scraped_at": batch_timestamp,
                            "country": "", "authority": "",
                            "date_of_decision": "", "fine_eur_raw": "",
                            "controller_processor": "", "sector": "",
                            "quoted_articles": "", "violation_type": "",
                            "source_url": "",
                        }
                        self._raw_records = [record]
                        self.logger.info("Returning partial record from detail page")
                        return [record]
                except ImportError:
                    pass
        except req_lib.exceptions.RequestException as exc:
            self.logger.debug("Detail page fetch failed: %s", exc)

        # Strategy 2: Full scrape and filter
        self.logger.info("Falling back to full scrape + filter for ETid lookup")
        all_records = self.scraper.scrape_all()
        matches = []
        for record in all_records:
            record_etid = (
                record.get("etid", "")
                .replace("ETid-", "")
                .replace("ETid", "")
                .strip()
            )
            if record_etid == etid_normalized:
                matches.append(record)

        self._raw_records = matches
        self.logger.info("Lookup found %d matches for ETid %s", len(matches), etid)
        return matches

    def normalize(self, raw_record: dict[str, Any]) -> ThreatpediaRecord:
        """Transform a raw enforcement record into a ThreatpediaRecord."""
        etid = raw_record.get("etid", "")
        controller = raw_record.get("controller_processor", "")
        country_name = raw_record.get("country", "")
        violation_type = raw_record.get("violation_type", "")
        date_str = raw_record.get("date_of_decision", "")
        fine_raw = raw_record.get("fine_eur_raw", "")
        articles_raw = raw_record.get("quoted_articles", "")
        sector_raw = raw_record.get("sector", "")
        authority = raw_record.get("authority", "")
        source_url = raw_record.get("source_url", "")

        # Parse and normalize fields
        date_iso = parse_date_european(date_str)
        fine_amount, fine_type = parse_fine_amount(fine_raw)
        country_iso = COUNTRY_TO_ISO.get(country_name, country_name)
        sector = SECTOR_MAP.get(sector_raw, sector_raw if sector_raw else "Unknown")
        gdpr_articles = parse_article_list(articles_raw)

        # If authority is empty, derive from country
        if not authority and country_iso in COUNTRY_DPA:
            authority = COUNTRY_DPA[country_iso]

        # Construct breach name
        if violation_type and controller:
            breach_name = f"{violation_type} — {controller}"
        elif controller:
            breach_name = f"GDPR Enforcement — {controller}"
        else:
            breach_name = f"GDPR Enforcement — {etid}"

        # Extract year for naming
        year = date_iso[:4] if date_iso and len(date_iso) >= 4 else ""
        if year:
            breach_name = f"{breach_name} ({year})"

        # Build detail URL
        etid_num = etid.replace("ETid-", "").replace("ETid", "").strip()
        detail_url = (
            raw_record.get("detail_url")
            or DETAIL_URL_TEMPLATE.format(etid=etid_num)
        )

        # Compose raw_data with enforcement-specific fields
        raw_data = {
            "etid": etid,
            "fine_amount_eur": fine_amount,
            "fine_type": fine_type,
            "gdpr_articles_cited": gdpr_articles,
            "violation_type": violation_type,
            "authority": authority,
            "source_url": source_url,
            "enforcement_tracker_url": detail_url,
            "date_of_decision": date_iso,
            "scraped_at": raw_record.get("scraped_at", ""),
        }

        return ThreatpediaRecord(
            breach_name=breach_name,
            source_name=self.SOURCE_NAME,
            source_url=detail_url,
            date_occurred=date_iso,
            date_reported=date_iso,
            organization=controller,
            sector=sector,
            country=country_iso,
            records_affected=None,  # Not available in enforcement data
            data_types_exposed=[],  # Would require NLP on summary
            cves=[],  # Not available; cross-enrich via NVD/KEV
            iocs=[],  # Not available; cross-enrich via MISP/OTX
            raw_data=raw_data,
        )


# ---------------------------------------------------------------------------
# CLI Entry Point
# ---------------------------------------------------------------------------

def build_cli() -> argparse.ArgumentParser:
    """Build the command-line argument parser."""
    parser = argparse.ArgumentParser(
        prog="eu_gdpr_enforcement_tracker_connector",
        description=(
            "Threatpedia EU GDPR Enforcement Tracker connector. "
            "Scrapes enforcement decisions from the CMS.Law tracker."
        ),
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog="""
Examples:
  # Full scrape of all enforcement records
  python eu_gdpr_enforcement_tracker_connector.py --mode full --output gdpr_fines.json

  # Incremental: only decisions after 2026-01-01
  python eu_gdpr_enforcement_tracker_connector.py --mode incremental --since 2026-01-01

  # Lookup a specific ETid
  python eu_gdpr_enforcement_tracker_connector.py --mode lookup --etid ETid-1587

  # Output as JSONL
  python eu_gdpr_enforcement_tracker_connector.py --mode full --format jsonl --output gdpr.jsonl
        """,
    )

    parser.add_argument(
        "--mode",
        choices=["full", "incremental", "lookup"],
        default="full",
        help="Scrape mode: full (all records), incremental (since date), lookup (single ETid)",
    )
    parser.add_argument(
        "--since",
        type=str,
        default=None,
        help="ISO date for incremental mode (YYYY-MM-DD)",
    )
    parser.add_argument(
        "--etid",
        type=str,
        default=None,
        help="ETid to look up (e.g., ETid-1587 or 1587)",
    )
    parser.add_argument(
        "--output",
        type=str,
        default=None,
        help="Output file path (default: stdout summary)",
    )
    parser.add_argument(
        "--format",
        choices=["json", "jsonl"],
        default="json",
        help="Output format (default: json)",
    )
    parser.add_argument(
        "--delay",
        type=float,
        default=REQUEST_DELAY_MIN,
        help=f"Delay between requests in seconds (default: {REQUEST_DELAY_MIN})",
    )
    parser.add_argument(
        "-v",
        "--verbose",
        action="count",
        default=0,
        help="Increase verbosity (-v for INFO, -vv for DEBUG)",
    )

    return parser


def main() -> None:
    """CLI entry point."""
    parser = build_cli()
    args = parser.parse_args()

    # Configure logging
    log_level = logging.WARNING
    if args.verbose >= 2:
        log_level = logging.DEBUG
    elif args.verbose >= 1:
        log_level = logging.INFO

    logging.basicConfig(
        level=log_level,
        format="%(asctime)s [%(levelname)s] %(name)s: %(message)s",
        datefmt="%Y-%m-%dT%H:%M:%S",
    )

    # Validate args
    if args.mode == "incremental" and not args.since:
        parser.error("--since is required for incremental mode")
    if args.mode == "lookup" and not args.etid:
        parser.error("--etid is required for lookup mode")

    # Create connector
    connector = EUGDPREnforcementTrackerConnector(request_delay=args.delay)
    connector.authenticate()

    # Fetch
    if args.mode == "full":
        raw_records = connector.fetch_all()
    elif args.mode == "incremental":
        raw_records = connector.fetch_incremental(args.since)
    elif args.mode == "lookup":
        raw_records = connector.fetch_lookup(args.etid)
    else:
        parser.error(f"Unknown mode: {args.mode}")
        return

    # Normalize
    normalized: list[ThreatpediaRecord] = []
    errors = 0
    for record in raw_records:
        try:
            normalized.append(connector.normalize(record))
        except Exception as exc:
            errors += 1
            logger.warning("Normalization error: %s — record skipped", exc)

    # Output
    if args.output:
        output_path = Path(args.output)
        if args.format == "jsonl":
            count = JSONSerializer.write_records_jsonl(normalized, str(output_path))
        else:
            count = JSONSerializer.write_records(normalized, str(output_path))
        print(f"Wrote {count} records to {output_path}")
    else:
        # Print summary to stdout
        print(f"\n{'='*60}")
        print(f"EU GDPR Enforcement Tracker — Scrape Results")
        print(f"{'='*60}")
        print(f"Mode:             {args.mode}")
        print(f"Records fetched:  {len(raw_records)}")
        print(f"Records normalized: {len(normalized)}")
        print(f"Errors:           {errors}")

        if normalized:
            # Compute aggregate stats
            total_fines = sum(
                r.raw_data.get("fine_amount_eur", 0) or 0
                for r in normalized
            )
            countries = set(r.country for r in normalized if r.country)
            sectors = set(r.sector for r in normalized if r.sector and r.sector != "Unknown")

            print(f"\nTotal fines:      €{total_fines:,.2f}")
            print(f"Countries:        {len(countries)}")
            print(f"Sectors:          {len(sectors)}")

            # Top 5 largest fines
            by_fine = sorted(
                normalized,
                key=lambda r: r.raw_data.get("fine_amount_eur") or 0,
                reverse=True,
            )
            print(f"\nTop 5 Largest Fines:")
            for i, r in enumerate(by_fine[:5], 1):
                fine = r.raw_data.get("fine_amount_eur") or 0
                print(f"  {i}. €{fine:,.0f} — {r.organization} ({r.country})")

            # Sample records
            print(f"\nSample Records (first 3):")
            for r in normalized[:3]:
                print(f"  {r.raw_data.get('etid', 'N/A')}: {r.breach_name}")

        print(f"{'='*60}")

    sys.exit(0)


if __name__ == "__main__":
    main()
