#!/usr/bin/env python3
"""
Threatpedia — HHS/OCR Breach Portal Connector
================================================

Scrapes the U.S. Department of Health & Human Services, Office for Civil Rights
(OCR) Breach Portal — the authoritative HIPAA "Wall of Shame" registry of
healthcare data breaches affecting ≥500 individuals.

Data source:
    https://ocrportal.hhs.gov/ocr/breach/breach_report.jsf  (active investigations)
    https://ocrportal.hhs.gov/ocr/breach/breach_report_hip.jsf  (archive)

Features:
    - Full mode: scrape both active-investigation and archive portal pages
    - Incremental mode: scrape active-investigation page only, filter by date
    - Lookup mode: search for a specific entity name across both portals
    - Dual scraping backend: Selenium (primary) with requests+ViewState fallback
    - Deterministic source_id via SHA-256 of entity+date+state
    - Multi-value field parsing (breach types, locations)
    - Threatpedia normalized schema output (JSON/JSONL)
    - CLI entry point with argparse

No authentication required — public government data.
"""

from __future__ import annotations

import argparse
import hashlib
import html as html_module
import json
import logging
import re
import sys
import time
from datetime import datetime, timezone
from pathlib import Path
from typing import Any, Optional

import requests as req_lib
from bs4 import BeautifulSoup

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

logger = logging.getLogger("threatpedia.connectors.hhs_ocr")

# ---------------------------------------------------------------------------
# Constants
# ---------------------------------------------------------------------------

PORTAL_URLS = {
    "investigation": "https://ocrportal.hhs.gov/ocr/breach/breach_report.jsf",
    "archive": "https://ocrportal.hhs.gov/ocr/breach/breach_report_hip.jsf",
}

PORTAL_WEB_URL = "https://ocrportal.hhs.gov/ocr/breach/breach_report.jsf"

# Courteous pacing for a government .gov JSF application
REQUEST_DELAY_SECONDS = 3
PAGE_LOAD_TIMEOUT = 30
MAX_PAGES_PER_PORTAL = 200

# Breach type mapping: HHS/OCR → Threatpedia taxonomy
BREACH_TYPE_MAP = {
    "Hacking/IT Incident": "cyber_attack",
    "Unauthorized Access/Disclosure": "unauthorized_access",
    "Theft": "physical_theft",
    "Loss": "physical_loss",
    "Improper Disposal": "improper_disposal",
    "Other": "other",
    "Unknown": "unknown",
}

# Covered entity type taxonomy
VALID_ENTITY_TYPES = {
    "Healthcare Provider",
    "Health Plan",
    "Healthcare Clearing House",
    "Business Associate",
}

# US state/territory codes for validation
US_STATES = {
    "AL", "AK", "AZ", "AR", "CA", "CO", "CT", "DE", "FL", "GA",
    "HI", "ID", "IL", "IN", "IA", "KS", "KY", "LA", "ME", "MD",
    "MA", "MI", "MN", "MS", "MO", "MT", "NE", "NV", "NH", "NJ",
    "NM", "NY", "NC", "ND", "OH", "OK", "OR", "PA", "RI", "SC",
    "SD", "TN", "TX", "UT", "VT", "VA", "WA", "WV", "WI", "WY",
    "DC", "PR", "GU", "VI", "AS", "MP",
}

USER_AGENT = (
    "Mozilla/5.0 (compatible; Threatpedia/1.0; "
    "+https://github.com/MahdiHedhli/threatpedia)"
)


# ---------------------------------------------------------------------------
# Helper Functions
# ---------------------------------------------------------------------------

def parse_int(val: str) -> Optional[int]:
    """Parse an integer from a string, removing commas and whitespace."""
    if not val:
        return None
    try:
        return int(val.replace(",", "").strip())
    except (ValueError, AttributeError):
        return None


def parse_date_mmddyyyy(val: str) -> Optional[str]:
    """Parse MM/DD/YYYY date string to ISO 8601 (YYYY-MM-DD)."""
    if not val or not val.strip():
        return None
    val = val.strip()
    try:
        dt = datetime.strptime(val, "%m/%d/%Y")
        return dt.strftime("%Y-%m-%d")
    except ValueError:
        # Try alternate formats
        for fmt in ("%m-%d-%Y", "%Y-%m-%d", "%m/%d/%y"):
            try:
                dt = datetime.strptime(val, fmt)
                return dt.strftime("%Y-%m-%d")
            except ValueError:
                continue
    return val  # Return as-is rather than lose data


def generate_source_id(entity_name: str, submission_date: str, state: str) -> str:
    """Generate a deterministic source_id from entity+date+state."""
    id_str = f"{entity_name}|{submission_date}|{state}"
    return hashlib.sha256(id_str.encode("utf-8")).hexdigest()[:16]


def decode_html_entities(text: str) -> str:
    """Decode HTML entities in text (&amp;, &#39;, etc.)."""
    if not text:
        return text
    return html_module.unescape(text)


def split_multi_value(val: str) -> list[str]:
    """Split a comma-separated multi-value field into a list."""
    if not val:
        return []
    parts = [p.strip() for p in val.split(",")]
    return [p for p in parts if p]


# ---------------------------------------------------------------------------
# Scraping Backend: requests + ViewState (lightweight, no browser needed)
# ---------------------------------------------------------------------------

class HHSOCRRequestsScraper:
    """Scrape the HHS OCR portal using requests + BeautifulSoup.

    This approach extracts JSF ViewState tokens and replays pagination
    via POST requests. Lighter than Selenium but more brittle if the
    portal's form field IDs change.
    """

    def __init__(self, request_delay: float = REQUEST_DELAY_SECONDS):
        self.delay = request_delay
        self.session = req_lib.Session()
        self.session.headers.update({
            "User-Agent": USER_AGENT,
            "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
            "Accept-Language": "en-US,en;q=0.5",
        })

    def _get_viewstate(self, html: str) -> Optional[str]:
        """Extract javax.faces.ViewState from page HTML."""
        soup = BeautifulSoup(html, "html.parser")
        vs_input = soup.find("input", {"name": "javax.faces.ViewState"})
        if vs_input and vs_input.get("value"):
            return vs_input["value"]
        # Fallback: regex search
        match = re.search(
            r'name="javax\.faces\.ViewState"\s+value="([^"]+)"', html
        )
        return match.group(1) if match else None

    def _find_form_id(self, html: str) -> Optional[str]:
        """Discover the main JSF form ID from the page."""
        soup = BeautifulSoup(html, "html.parser")
        form = soup.find("form")
        return form.get("id") if form else None

    def _parse_table(self, html: str, page_type: str = "investigation") -> list[dict]:
        """Parse breach records from the HTML table."""
        soup = BeautifulSoup(html, "html.parser")
        records = []

        # Find the data table — prefer specific selectors, then fall back
        # to the table with the most rows (the breach data table is always
        # the largest on the page).
        table = None
        for selector in [
            "table.responsiveTable",
            'table[role="grid"]',
            "table.dataTable",
        ]:
            table = soup.select_one(selector)
            if table and len(table.find_all("tr")) > 3:
                break
            table = None

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
            if best_table and best_count > 1:
                table = best_table

        if not table:
            logger.warning("No breach table found on page")
            return records

        rows = table.find_all("tr")
        if not rows:
            return records

        # Find header row to determine column indices
        header_row = rows[0]
        headers = [th.get_text(strip=True).lower() for th in header_row.find_all(["th", "td"])]

        # Map known header texts to field names — order matters: more
        # specific patterns first to avoid greedy matches (e.g., "covered
        # entity type" must match before bare "entity" or "name").
        col_map = {}
        header_patterns = [
            ("covered entity type", "covered_entity_type"),
            ("name of covered entity", "entity_name"),
            ("individuals affected", "individuals_affected"),
            ("individual", "individuals_affected"),
            ("breach submission date", "breach_submission_date"),
            ("submission date", "breach_submission_date"),
            ("type of breach", "type_of_breach"),
            ("breach type", "type_of_breach"),
            ("location of breached", "location_of_breached_info"),
            ("location", "location_of_breached_info"),
            ("business associate", "business_associate_present"),
            ("web description", "web_description"),
            ("description", "web_description"),
            ("summary", "summary"),
            ("state", "state"),
        ]

        # Capture scrape timestamp once for the entire batch
        batch_timestamp = datetime.now(timezone.utc).isoformat()

        # Skip known non-data columns
        skip_headers = {"expand", "expand all", ""}

        for idx, h in enumerate(headers):
            if h in skip_headers:
                continue
            for pattern, field_name in header_patterns:
                if pattern in h and field_name not in col_map:
                    col_map[field_name] = idx
                    break

        # If header discovery failed, use positional fallback
        if len(col_map) < 4:
            logger.info("Header discovery found %d cols, using positional fallback", len(col_map))
            col_map = {
                "entity_name": 0,
                "state": 1,
                "covered_entity_type": 2,
                "individuals_affected": 3,
                "breach_submission_date": 4,
                "type_of_breach": 5,
                "location_of_breached_info": 6,
                "business_associate_present": 7,
            }

        # Parse data rows (skip header)
        for row in rows[1:]:
            cells = row.find_all("td")
            if len(cells) < 4:
                continue

            def get_cell(field: str) -> str:
                idx = col_map.get(field)
                if idx is not None and idx < len(cells):
                    return decode_html_entities(cells[idx].get_text(strip=True))
                return ""

            entity_name = get_cell("entity_name")
            state = get_cell("state")
            submission_date = get_cell("breach_submission_date")

            if not entity_name:
                continue

            record = {
                "entity_name": entity_name,
                "state": state,
                "covered_entity_type": get_cell("covered_entity_type"),
                "individuals_affected": parse_int(get_cell("individuals_affected")),
                "breach_submission_date": submission_date,
                "type_of_breach": get_cell("type_of_breach"),
                "location_of_breached_info": get_cell("location_of_breached_info"),
                "business_associate_present": get_cell("business_associate_present"),
                "web_description": get_cell("web_description"),
                "source_id": generate_source_id(entity_name, submission_date, state),
                "source": "hhs_ocr",
                "page_type": page_type,
                "scraped_at": batch_timestamp,
            }

            # Archive pages may have resolution fields
            if page_type == "archive":
                record["summary"] = get_cell("summary")

            records.append(record)

        return records

    def _find_pagination_links(self, html: str, form_id: str) -> dict:
        """Discover pagination control IDs from the page HTML."""
        soup = BeautifulSoup(html, "html.parser")
        pagination = {}

        # Look for common JSF paginator patterns
        for link in soup.find_all("a", href=True):
            onclick = link.get("onclick", "")
            text = link.get_text(strip=True).lower()
            if "next" in text or ">" == text:
                # Extract the JSF action source from onclick
                match = re.search(r"source:'([^']+)'", onclick)
                if match:
                    pagination["next_source"] = match.group(1)
            elif "last" in text or ">>" == text:
                match = re.search(r"source:'([^']+)'", onclick)
                if match:
                    pagination["last_source"] = match.group(1)

        # Also check for PrimeFaces-style paginator
        for elem in soup.select(".ui-paginator-next, .ui-paginator-last"):
            classes = elem.get("class", [])
            if "ui-state-disabled" not in classes:
                pagination["pf_next"] = elem.get("id")

        return pagination

    def _try_selenium_scrape(self, url: str, page_type: str) -> Optional[str]:
        """Attempt to load the portal page using Selenium (headless Chrome).

        Returns the rendered page HTML, or None if Selenium is not available.
        Selenium is the recommended approach for the investigation portal,
        which requires JavaScript rendering for its JSF-based interface.
        """
        try:
            from selenium import webdriver
            from selenium.webdriver.chrome.options import Options
            from selenium.webdriver.common.by import By
            from selenium.webdriver.support.ui import WebDriverWait
            from selenium.webdriver.support import expected_conditions as EC
        except ImportError:
            logger.debug("Selenium not available, falling back to requests")
            return None

        try:
            options = Options()
            options.add_argument("--headless=new")
            options.add_argument("--no-sandbox")
            options.add_argument("--disable-dev-shm-usage")
            options.add_argument("--disable-gpu")
            options.add_argument(f"user-agent={USER_AGENT}")

            driver = webdriver.Chrome(options=options)
            driver.set_page_load_timeout(PAGE_LOAD_TIMEOUT)

            try:
                logger.info("Loading %s portal via Selenium...", page_type)
                driver.get(url)
                time.sleep(self.delay)

                # For investigation page: click "View HIPAA Breach Reports"
                try:
                    view_link = WebDriverWait(driver, 10).until(
                        EC.element_to_be_clickable(
                            (By.XPATH, "//a[contains(text(), 'View HIPAA Breach')]")
                        )
                    )
                    view_link.click()
                    time.sleep(self.delay)
                except Exception:
                    pass  # Archive page goes directly to data

                # Wait for data table to appear
                try:
                    WebDriverWait(driver, PAGE_LOAD_TIMEOUT).until(
                        EC.presence_of_element_located((By.CSS_SELECTOR, "table tr td"))
                    )
                except Exception:
                    logger.warning("No data table loaded via Selenium for %s", page_type)

                html = driver.page_source
                logger.info("Selenium page loaded: %d bytes", len(html))
                return html

            finally:
                driver.quit()

        except Exception as exc:
            logger.debug("Selenium scrape failed: %s", exc)
            return None

    def _navigate_frontpage(self, url: str) -> Optional[str]:
        """Navigate past the HHS OCR front page via JSF form submission.

        The investigation portal (breach_report.jsf) shows a landing page
        first. We need to POST the JSF form to reach the breach data view.
        The archive portal (breach_report_hip.jsf) shows data directly.

        Returns the HTML of the data page, or None if navigation failed.
        """
        resp = self.session.get(url, timeout=PAGE_LOAD_TIMEOUT)
        resp.raise_for_status()

        soup = BeautifulSoup(resp.text, "html.parser")

        # Check if this page already has a data table (archive page)
        for t in soup.find_all("table"):
            if len(t.find_all("tr")) > 3:
                logger.info("Page already has data table, no navigation needed")
                return resp.text

        # Extract ViewState and look for JSF action links
        vs_input = soup.find("input", {"name": "javax.faces.ViewState"})
        if not vs_input:
            return resp.text

        viewstate = vs_input["value"]

        # Find all JSF command links (mojarra.jsfcljs calls)
        jsf_links = []
        for a in soup.find_all("a"):
            onclick = a.get("onclick", "") or ""
            text = a.get_text(strip=True).lower()
            match = re.search(r"'([^']+)':'([^']+)'", onclick)
            if match and "mojarra" in onclick:
                jsf_links.append({
                    "text": text,
                    "field_name": match.group(1),
                    "field_value": match.group(2),
                })

        # Find the "View HIPAA Breach Reports" action
        target_link = None
        for link in jsf_links:
            if "view" in link["text"] and "breach" in link["text"]:
                target_link = link
                break

        # Fallback: try all JSF links with "view" or "report"
        if not target_link:
            for link in jsf_links:
                if "view" in link["text"] or "report" in link["text"]:
                    target_link = link
                    break

        if not target_link:
            logger.warning("Could not find JSF navigation link on front page")
            return resp.text

        # Submit JSF form to navigate
        form_id = self._find_form_id(resp.text) or "ocrForm"
        form_data = {
            form_id: form_id,
            "javax.faces.ViewState": viewstate,
            target_link["field_name"]: target_link["field_value"],
        }

        logger.info("Navigating via JSF: %s", target_link["text"])
        time.sleep(self.delay)
        nav_resp = self.session.post(url, data=form_data, timeout=PAGE_LOAD_TIMEOUT)
        nav_resp.raise_for_status()

        # Check if we got a data page
        nav_soup = BeautifulSoup(nav_resp.text, "html.parser")
        for t in nav_soup.find_all("table"):
            if len(t.find_all("tr")) > 3:
                return nav_resp.text

        # If still no data, the page may need JS rendering (Selenium required)
        logger.warning(
            "No data table after JSF navigation — %s page likely requires "
            "Selenium for JavaScript rendering. Returning empty result. "
            "Install selenium and webdriver-manager for full portal support.",
            "investigation" if "breach_report.jsf" in url else "archive",
        )
        return nav_resp.text

    @retry_with_backoff(
        max_retries=3,
        base_delay=5.0,
        max_delay=300.0,
        retryable_exceptions=(
            req_lib.exceptions.Timeout,
            req_lib.exceptions.ConnectionError,
            req_lib.exceptions.HTTPError,
        ),
    )
    def scrape_portal(
        self,
        page_type: str = "investigation",
        max_pages: int = MAX_PAGES_PER_PORTAL,
        since_date: Optional[str] = None,
    ) -> list[dict]:
        """Scrape all pages from a portal view.

        Args:
            page_type: 'investigation' or 'archive'
            max_pages: Safety limit on number of pages to scrape
            since_date: Optional ISO date to filter records (client-side)

        Returns:
            List of raw breach record dicts
        """
        url = PORTAL_URLS[page_type]
        logger.info("Scraping %s portal: %s", page_type, url)

        # Try Selenium first if available, fall back to requests
        selenium_html = self._try_selenium_scrape(url, page_type)
        if selenium_html:
            # Selenium returns the full page HTML after JS rendering
            initial_html = selenium_html
        else:
            # Requests-based: navigate past front page if needed
            initial_html = self._navigate_frontpage(url)
            if not initial_html:
                return []

        time.sleep(self.delay)

        all_records = []
        seen_ids: set[str] = set()
        page_num = 1
        current_html = initial_html

        while page_num <= max_pages:
            logger.info("Parsing %s page %d...", page_type, page_num)

            records = self._parse_table(current_html, page_type)
            if not records:
                logger.info("No records found on page %d, stopping.", page_num)
                break

            # Dedup within this scrape session
            new_records = []
            for r in records:
                if r["source_id"] not in seen_ids:
                    seen_ids.add(r["source_id"])
                    new_records.append(r)

            # Apply date filter if incremental
            if since_date:
                new_records = [
                    r for r in new_records
                    if self._record_after_date(r, since_date)
                ]

            all_records.extend(new_records)
            logger.info(
                "Page %d: %d new records (total: %d)",
                page_num, len(new_records), len(all_records),
            )

            # Check for pagination overlap (same page repeating)
            if len(new_records) == 0 and len(records) > 0:
                logger.info("All records on page %d already seen, stopping.", page_num)
                break

            # Attempt to navigate to next page
            viewstate = self._get_viewstate(current_html)
            form_id = self._find_form_id(current_html)
            pagination = self._find_pagination_links(current_html, form_id or "")

            if not viewstate or not pagination.get("next_source"):
                # If we can't find pagination controls, check for PrimeFaces
                if pagination.get("pf_next"):
                    logger.info("Found PrimeFaces pagination, attempting AJAX POST")
                    next_html = self._ajax_paginate(
                        url, viewstate, form_id, pagination["pf_next"]
                    )
                else:
                    logger.info("No pagination controls found, stopping after page %d.", page_num)
                    break
            else:
                next_html = self._jsf_paginate(
                    url, viewstate, form_id, pagination["next_source"]
                )

            if next_html is None:
                break

            current_html = next_html
            page_num += 1
            time.sleep(self.delay)

        logger.info(
            "Finished scraping %s portal: %d records across %d pages",
            page_type, len(all_records), page_num,
        )
        return all_records

    def _jsf_paginate(
        self,
        url: str,
        viewstate: Optional[str],
        form_id: Optional[str],
        next_source: str,
    ) -> Optional[str]:
        """Navigate to the next page via JSF AJAX POST."""
        if not viewstate:
            return None

        form_data = {
            "javax.faces.ViewState": viewstate,
            "javax.faces.partial.ajax": "true",
            "javax.faces.source": next_source,
            "javax.faces.partial.execute": "@all",
            "javax.faces.partial.render": "@all",
        }
        if form_id:
            form_data[form_id] = form_id

        try:
            resp = self.session.post(
                url,
                data=form_data,
                timeout=PAGE_LOAD_TIMEOUT,
                headers={"Faces-Request": "partial/ajax"},
            )
            resp.raise_for_status()

            # JSF AJAX responses may contain partial updates or full HTML
            content = resp.text
            if "<table" in content.lower() or "responsiveTable" in content:
                return content
            # If partial AJAX, re-GET the page to get full rendered state
            time.sleep(self.delay)
            full_resp = self.session.get(url, timeout=PAGE_LOAD_TIMEOUT)
            full_resp.raise_for_status()
            return full_resp.text

        except req_lib.RequestException as exc:
            logger.warning("Pagination POST failed: %s", exc)
            return None

    def _ajax_paginate(
        self,
        url: str,
        viewstate: Optional[str],
        form_id: Optional[str],
        paginator_id: str,
    ) -> Optional[str]:
        """Navigate via PrimeFaces-style paginator AJAX."""
        if not viewstate:
            return None

        form_data = {
            "javax.faces.ViewState": viewstate,
            "javax.faces.partial.ajax": "true",
            "javax.faces.source": paginator_id,
            "javax.faces.partial.execute": paginator_id,
            "javax.faces.partial.render": "@all",
        }
        if form_id:
            form_data[form_id] = form_id

        try:
            resp = self.session.post(
                url,
                data=form_data,
                timeout=PAGE_LOAD_TIMEOUT,
                headers={"Faces-Request": "partial/ajax"},
            )
            resp.raise_for_status()

            # Re-GET to get the full rendered page after AJAX update
            time.sleep(self.delay)
            full_resp = self.session.get(url, timeout=PAGE_LOAD_TIMEOUT)
            full_resp.raise_for_status()
            return full_resp.text

        except req_lib.RequestException as exc:
            logger.warning("PrimeFaces pagination failed: %s", exc)
            return None

    @staticmethod
    def _record_after_date(record: dict, since_date: str) -> bool:
        """Check if a record's submission date is on or after since_date."""
        raw_date = record.get("breach_submission_date", "")
        iso_date = parse_date_mmddyyyy(raw_date)
        if not iso_date:
            return True  # Keep records with unparseable dates
        return iso_date >= since_date


# ---------------------------------------------------------------------------
# Connector Implementation
# ---------------------------------------------------------------------------

class HHSOCRConnector(ThreatpediaConnector):
    """Connector for the HHS/OCR HIPAA Breach Portal.

    Scrapes the federal government's public registry of healthcare data
    breaches affecting ≥500 individuals. Two portal pages are available:
    active investigations (last 24 months) and archive (resolved cases).

    No authentication required. Conservative rate limiting applied as
    courtesy to the government server.
    """

    SOURCE_NAME = "hhs_ocr"
    SOURCE_URL = PORTAL_WEB_URL

    def __init__(self, **kwargs: Any) -> None:
        # Conservative rate: ~20 requests per minute for courteous gov scraping
        super().__init__(rate_limit=20, rate_window=60.0, **kwargs)
        self._scraper = HHSOCRRequestsScraper(request_delay=REQUEST_DELAY_SECONDS)
        self._raw_records: list[dict] = []

    # ---- Authentication (none required) ------------------------------------

    def authenticate(self) -> None:
        """No authentication needed for the HHS OCR Breach Portal."""
        self.logger.debug("HHS OCR Breach Portal requires no authentication.")

    # ---- Fetch -------------------------------------------------------------

    def fetch_all(self) -> list[dict[str, Any]]:
        """Perform a full scrape of both portal views (investigation + archive).

        Returns a list of raw breach record dicts.
        """
        all_records = []

        # Scrape active investigations
        investigation_records = self._scraper.scrape_portal("investigation")
        self.logger.info(
            "Investigation portal: %d records", len(investigation_records)
        )
        all_records.extend(investigation_records)

        # Scrape archive
        archive_records = self._scraper.scrape_portal("archive")
        self.logger.info("Archive portal: %d records", len(archive_records))
        all_records.extend(archive_records)

        # Dedup across portals (same breach may appear in both during transition)
        seen: set[str] = set()
        deduped = []
        for r in all_records:
            sid = r["source_id"]
            if sid not in seen:
                seen.add(sid)
                deduped.append(r)
            else:
                self.logger.debug("Dedup: skipping duplicate source_id %s", sid)

        self.logger.info(
            "Total records: %d (investigation=%d, archive=%d, after dedup=%d)",
            len(all_records),
            len(investigation_records),
            len(archive_records),
            len(deduped),
        )
        self._raw_records = deduped
        return deduped

    def fetch_incremental(self, since_date: str) -> list[dict[str, Any]]:
        """Fetch records added on or after *since_date* from the active portal.

        Only scrapes the investigation page (breach_report.jsf), since new
        breaches appear there first. Archive is not scraped in incremental
        mode to save time.

        Args:
            since_date: ISO 8601 date string (YYYY-MM-DD).
        """
        records = self._scraper.scrape_portal(
            "investigation",
            since_date=since_date,
        )
        self.logger.info(
            "Incremental fetch (since %s): %d records from investigation portal",
            since_date,
            len(records),
        )
        self._raw_records = records
        return records

    def fetch_lookup(self, query: str) -> list[dict[str, Any]]:
        """Search for a specific entity name across both portals.

        This performs a full scrape and filters client-side by entity name,
        since the portal doesn't expose a direct search API.

        Args:
            query: Entity name or partial name to search for (case-insensitive).
        """
        all_records = self.fetch_all()
        query_lower = query.lower()
        matches = [
            r for r in all_records
            if query_lower in r.get("entity_name", "").lower()
        ]
        self.logger.info(
            "Lookup for '%s': %d matches out of %d total records",
            query, len(matches), len(all_records),
        )
        return matches

    # ---- Normalize ---------------------------------------------------------

    def normalize(self, raw_record: dict[str, Any]) -> ThreatpediaRecord:
        """Map a single HHS/OCR breach record to the Threatpedia normalized schema."""

        entity_name = raw_record.get("entity_name", "")
        breach_type_raw = raw_record.get("type_of_breach", "")
        submission_date = raw_record.get("breach_submission_date", "")
        iso_date = parse_date_mmddyyyy(submission_date)

        # Extract year for breach_name composition (iso_date is YYYY-MM-DD)
        year = iso_date[:4] if iso_date and len(iso_date) >= 4 else ""

        # Map breach types (handle multi-value)
        breach_types_raw = split_multi_value(breach_type_raw)
        tp_breach_types = [
            BREACH_TYPE_MAP.get(bt.strip(), "other") for bt in breach_types_raw
        ]
        primary_breach_type = tp_breach_types[0] if tp_breach_types else "unknown"

        # Parse location into data_types_exposed list
        locations = split_multi_value(
            raw_record.get("location_of_breached_info", "")
        )

        # Business associate flag
        ba_raw = raw_record.get("business_associate_present", "")
        ba_involved = ba_raw.strip().lower() in ("yes", "y", "true")

        # Compose breach name
        if year:
            breach_name = f"{entity_name} {breach_type_raw} ({year})"
        else:
            breach_name = entity_name

        return ThreatpediaRecord(
            breach_name=breach_name,
            source_name="HHS OCR Breach Portal",
            source_url=PORTAL_URLS.get(
                raw_record.get("page_type", "investigation"),
                PORTAL_WEB_URL,
            ),
            date_occurred=None,  # Not available from portal
            date_reported=iso_date,
            organization=entity_name,
            sector="Healthcare",
            country="United States",
            records_affected=raw_record.get("individuals_affected"),
            data_types_exposed=locations,
            cves=[],  # Not available; requires cross-enrichment
            iocs=[],  # Not available; requires cross-enrichment
            raw_data={
                "source_id": raw_record.get("source_id"),
                "state": raw_record.get("state"),
                "covered_entity_type": raw_record.get("covered_entity_type"),
                "type_of_breach": breach_type_raw,
                "breach_types_mapped": tp_breach_types,
                "primary_breach_type": primary_breach_type,
                "location_of_breached_info": raw_record.get("location_of_breached_info"),
                "business_associate_involved": ba_involved,
                "web_description": raw_record.get("web_description", ""),
                "resolution_summary": raw_record.get("summary", ""),
                "page_type": raw_record.get("page_type"),
                "breach_submission_date_raw": submission_date,
                "scraped_at": raw_record.get("scraped_at"),
            },
        )


# ---------------------------------------------------------------------------
# CLI Entry Point
# ---------------------------------------------------------------------------

def build_cli() -> argparse.ArgumentParser:
    parser = argparse.ArgumentParser(
        prog="hhs_ocr_connector",
        description=(
            "Threatpedia HHS/OCR Breach Portal Connector — scrape and normalize "
            "the U.S. HIPAA 'Wall of Shame' healthcare breach registry."
        ),
    )
    parser.add_argument(
        "--mode",
        choices=["full", "incremental", "lookup"],
        default="full",
        help=(
            "Sync mode: 'full' scrapes both portals (investigation + archive); "
            "'incremental' scrapes investigation portal only, filtered by --since; "
            "'lookup' searches for a specific entity name (default: full)."
        ),
    )
    parser.add_argument(
        "--since",
        type=str,
        default=None,
        help=(
            "ISO 8601 date (YYYY-MM-DD) for incremental mode. "
            "Only records submitted on or after this date are returned."
        ),
    )
    parser.add_argument(
        "--query", "-q",
        type=str,
        default=None,
        help="Entity name to search for in lookup mode (case-insensitive).",
    )
    parser.add_argument(
        "--output", "-o",
        type=str,
        default=None,
        help="Path to write normalized JSON output.",
    )
    parser.add_argument(
        "--format", "-f",
        choices=["json", "jsonl"],
        default="json",
        help="Output format: 'json' (array) or 'jsonl' (newline-delimited) (default: json).",
    )
    parser.add_argument(
        "--limit",
        type=int,
        default=None,
        help="Limit output to the first N records (useful for testing).",
    )
    parser.add_argument(
        "--portal",
        choices=["investigation", "archive", "both"],
        default="both",
        help="Which portal page to scrape in full mode (default: both).",
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

    connector = HHSOCRConnector()

    if args.mode == "lookup":
        if not args.query:
            parser.error("--query is required in lookup mode")
        connector.authenticate()
        raw_records = connector.fetch_lookup(args.query)
        records = []
        errors = 0
        for r in raw_records:
            try:
                records.append(connector.normalize(r))
            except Exception as exc:
                errors += 1
                logger.warning("Normalization error: %s — record skipped", exc)
        logger.info("Lookup: %d records normalized (%d errors)", len(records), errors)
    else:
        records = connector.run(
            mode=args.mode,
            since_date=args.since,
            output_file=None,  # We handle output below for format support
        )

    if args.limit:
        records = records[: args.limit]

    # Output handling
    if args.output:
        if args.format == "jsonl":
            count = JSONSerializer.write_records_jsonl(records, args.output)
        else:
            count = JSONSerializer.write_records(records, args.output)
        logger.info("Wrote %d records to %s (%s format)", count, args.output, args.format)
    else:
        # Print summary and sample to stdout
        print(f"\n{'=' * 70}")
        print(f"HHS/OCR Breach Portal — {len(records)} records normalized")
        print(f"{'=' * 70}")

        if records:
            for r in records[:5]:
                affected = r.records_affected or "N/A"
                print(
                    f"  [{r.raw_data.get('source_id', '?')[:8]}] "
                    f"{r.organization} — {affected} affected "
                    f"(reported: {r.date_reported or 'N/A'})"
                )
            if len(records) > 5:
                print(f"  ... and {len(records) - 5} more")
            print()

            # Print full JSON for the first record as a schema example
            print("Sample record (JSON):")
            print(records[0].to_json())


if __name__ == "__main__":
    main()
