# Australian OAIC Notifiable Data Breaches — Connector Specification

> **Source**: [OAIC Notifiable Data Breaches](https://www.oaic.gov.au/privacy/notifiable-data-breaches)
> **Data Access**: Web scraping (statistics dashboard + half-yearly PDF reports) — no API
> **Dashboard URL**: `https://www.oaic.gov.au/privacy/notifiable-data-breaches/notifiable-data-breach-statistics-dashboard`
> **Spec Date**: 2026-04-08
> **Author**: Threatpedia Automated Research Agent

---

## 1. Overview

The Office of the Australian Information Commissioner (OAIC) administers Australia's Notifiable Data Breaches (NDB) scheme under the *Privacy Act 1988*. Since the scheme's commencement on **22 February 2018**, organisations and agencies covered by the Privacy Act must report eligible data breaches to the OAIC and notify affected individuals.

**Relevance to Threatpedia**: The OAIC NDB data is the sole authoritative source for Australian data breach notifications. It provides aggregate statistics on breach volumes, causes, affected sectors, and personal information types — critical for understanding the Australian breach landscape and cross-referencing with global breach data.

**Current Scale**: Approximately 500–600 breach notifications per half-year reporting period (527 in H1 2024, 586 in H2 2024). Total cumulative notifications since Feb 2018 are estimated at ~7,500+.

**Update Frequency**: The statistics dashboard and half-yearly reports are published **twice per year** (typically March/April for the H2 report, and September/October for the H1 report).

### 1.1 NDB Scheme Inclusion Criteria

An eligible data breach occurs when ALL of the following are met:
1. There is **unauthorised access to**, **unauthorised disclosure of**, or **loss of** personal information held by an entity
2. The breach is **likely to result in serious harm** to one or more individuals
3. The entity has **not been able to prevent the likely risk** of serious harm with remedial action

### 1.2 Who Must Report

- Australian Government agencies
- Businesses and not-for-profits with annual turnover > AU$3 million
- Private sector health service providers (regardless of turnover)
- Credit reporting bodies and credit providers
- Entities that trade in personal information
- Tax file number (TFN) recipients

---

## 2. Authentication

| Aspect | Detail |
|--------|--------|
| **Method** | **None** — all data is publicly available |
| **API Key** | Not applicable (no API exists) |
| **Rate Limiting** | No documented rate limits; standard web scraping courtesy applies |
| **TLS** | HTTPS required |
| **Robots.txt** | Should be checked before scraping; respectful crawl intervals recommended |
| **License** | Australian Government — Crown copyright; fair use for research/analysis |

The OAIC publishes all NDB statistics publicly. There is no registration, authentication, or API key required. Data is accessed via:
1. The interactive statistics dashboard (web scraping)
2. Half-yearly PDF reports (download and parse)
3. Web page content on the publications pages (web scraping)

---

## 3. Data Access Methods

### 3.1 Statistics Dashboard (Primary — Aggregate Data)

```
URL: https://www.oaic.gov.au/privacy/notifiable-data-breaches/notifiable-data-breach-statistics-dashboard
```

**Characteristics**:
- Interactive dashboard (likely Power BI or similar embedded visualization)
- Covers data from February 2018 to present
- Updated twice yearly
- **Not mobile-friendly** — requires minimum 1080×768 display
- Filters available: timeframe, source of breach, response time, top industry sector

**Scraping Approach**: The dashboard is JavaScript-rendered. Selenium or Playwright with headless browser is required. Alternatively, inspect network traffic to identify the underlying data API calls made by the dashboard widget.

**Recommended Strategy**: Intercept the dashboard's XHR/fetch requests to identify the raw data endpoint. Many government dashboards built on Power BI or Tableau expose their data through predictable API patterns.

### 3.2 Half-Yearly PDF Reports (Secondary — Detailed Breakdowns)

```
Pattern: https://www.oaic.gov.au/privacy/notifiable-data-breaches/notifiable-data-breaches-publications/notifiable-data-breaches-report-{period}
```

**Available Reports** (newest to oldest):

| Period | URL Slug | Notes |
|--------|----------|-------|
| Jul–Dec 2024 | `notifiable-data-breaches-report-july-to-december-2024` | Latest available |
| Jan–Jun 2024 | `notifiable-data-breaches-report-january-to-june-2024` | |
| Jul–Dec 2023 | `notifiable-data-breaches-report-july-to-december-2023` | |
| Jan–Jun 2023 | `notifiable-data-breaches-report-january-to-june-2023` | |
| Jul–Dec 2022 | `notifiable-data-breaches-report-july-to-december-2022` | |
| Jan–Jun 2022 | `notifiable-data-breaches-report-january-to-june-2022` | |
| Jul–Dec 2021 | `notifiable-data-breaches-report-july-to-december-2021` | |
| Jan–Jun 2021 | `notifiable-data-breaches-report-januaryjune-2021` | Note: different slug format |
| Jul–Dec 2020 | `notifiable-data-breaches-report-julydecember-2020` | |
| Jan–Jun 2020 | `notifiable-data-breaches-report-januaryjune-2020` | |
| Jul–Dec 2019 | `notifiable-data-breaches-report-julydecember-2019` | |
| Jan–Jun 2019 | `notifiable-data-breaches-report-januaryjune-2019` | |
| 12-Month Insights | `notifiable-data-breaches-scheme-12-month-insights-report` | Covers Feb 2018–Feb 2019 |
| Apr–Jun 2018 | Quarterly format (early scheme) | |
| Feb–Mar 2018 | Quarterly format (scheme launch) | |

**Scraping Approach**: Each report's HTML page contains structured tables and statistics. Parse with BeautifulSoup. PDF versions (~1 MB each) are also available and can be parsed with `pdfplumber` or `camelot` for table extraction.

### 3.3 Publications Index Page

```
URL: https://www.oaic.gov.au/privacy/notifiable-data-breaches/notifiable-data-breaches-publications
```

Use this page to discover new reports. Scrape the list of report links and compare against previously ingested reports.

---

## 4. Data Schema

### 4.1 Aggregate Statistics Model (Per Half-Year Report)

The OAIC does not publish individual breach notification records. All data is published as **aggregate statistics** for each half-year reporting period.

```json
{
  "reportPeriod": "2024-H2",
  "periodStart": "2024-07-01",
  "periodEnd": "2024-12-31",
  "publishDate": "2025-02-11",
  "totalNotifications": 586,
  "secondaryNotifications": 0,
  "sourceUrl": "https://www.oaic.gov.au/privacy/notifiable-data-breaches/notifiable-data-breaches-publications/notifiable-data-breaches-report-july-to-december-2024",
  "pdfUrl": "...",
  "breachSources": {
    "maliciousOrCriminalAttack": { "count": 404, "percentage": 69 },
    "humanError": { "count": 170, "percentage": 29 },
    "systemFault": { "count": 12, "percentage": 2 }
  },
  "cyberIncidentTypes": {
    "phishingCompromisedCredentials": 84,
    "ransomware": 60,
    "compromisedCredentialsUnknownMethod": 51,
    "hacking": 23,
    "bruteForce": 16,
    "malware": 12,
    "other": 1
  },
  "topSectors": [
    { "sector": "Health service providers", "count": 121, "percentage": 20 },
    { "sector": "Australian Government", "count": 100, "percentage": 17 },
    { "sector": "Finance (incl. superannuation)", "count": 54, "percentage": 9 },
    { "sector": "Legal, accounting, management", "count": 36, "percentage": 6 },
    { "sector": "Retail", "count": 34, "percentage": 6 }
  ],
  "individualsAffected": {
    "1to100": { "percentage": 63 },
    "101to1000": { "percentage": 0 },
    "1001to10000": { "percentage": 0 },
    "10001to100000": { "percentage": 0 },
    "100001plus": { "percentage": 0 }
  },
  "personalInfoTypes": [
    "Contact information",
    "Financial details",
    "Health information",
    "Identity information",
    "Tax file numbers",
    "Other sensitive information"
  ],
  "notificationTimeline": {
    "identifiedWithin30Days": { "percentage": 66 },
    "notifiedOAICWithin10Days": { "percentage": 52 }
  }
}
```

### 4.2 Data Fields Collected via NDB Notification Form

While individual records are not published, the OAIC collects the following via its notification form (at `webform.oaic.gov.au`). Understanding these fields informs what aggregate categories exist:

**Part 1 — Mandatory Statement (Public)**:
| Field | Type | Description |
|-------|------|-------------|
| Entity name | Text | Organisation or agency name |
| Entity contact details | Text | Contact information for affected individuals |
| Description of breach | Text | What happened and circumstances |
| Kinds of personal information involved | Multi-select | Categories of PI compromised |
| Recommended steps for individuals | Text | Actions individuals should take |

**Part 2 — Confidential (Held by OAIC)**:
| Field | Type | Description |
|-------|------|-------------|
| Industry sector | Dropdown | ANZSIC-based sector classification |
| Source/cause of breach | Dropdown | Malicious attack / human error / system fault |
| Breach sub-type | Dropdown | Specific subcategory (e.g., ransomware, phishing) |
| Number of individuals affected | Numeric range | Approximate count of affected people |
| Date breach occurred | Date | When the breach happened |
| Date breach identified | Date | When the entity became aware |
| Date notification to OAIC | Date | When OAIC was notified |
| Remedial actions taken | Text | Steps taken to contain/remediate |
| Notification method to individuals | Dropdown | How individuals were notified |

### 4.3 Industry Sectors (OAIC Classification)

Based on published reports, the OAIC uses the following sector taxonomy (derived from ANZSIC — Australian and New Zealand Standard Industrial Classification):

1. Health service providers
2. Australian Government
3. Finance (including superannuation)
4. Legal, accounting and management services
5. Education
6. Retail
7. Insurance
8. Personal services
9. Professional, scientific and technical services
10. Information media and telecommunications
11. Mining
12. Construction
13. Electricity, gas, water and waste services
14. Transport, postal and warehousing
15. Accommodation and food services
16. Rental, hiring and real estate services
17. Arts and recreation services
18. Not-for-profit organisations
19. Other

### 4.4 Breach Source Taxonomy

**Level 1: Source of Breach**

| Category | Description |
|----------|-------------|
| Malicious or criminal attack | Intentional actions by threat actors |
| Human error | Unintentional actions by employees/contractors |
| System fault | Technology/process failures |

**Level 2: Malicious Attack Subcategories**

| Subcategory | Description |
|-------------|-------------|
| Cyber incident | Digital/network-based attacks |
| Social engineering / impersonation | Deception-based attacks |
| Rogue employee / insider threat | Malicious internal actors |
| Theft of paperwork or data storage device | Physical theft |

**Level 3: Cyber Incident Types**

| Type | Description |
|------|-------------|
| Phishing (compromised credentials) | Credentials obtained via phishing |
| Ransomware | Ransomware deployment |
| Compromised/stolen credentials (method unknown) | Credential theft, vector unknown |
| Hacking | Direct system compromise |
| Brute-force attack | Credential brute-forcing |
| Malware | Non-ransomware malware |
| Other | Other cyber incidents |

**Level 2: Human Error Subcategories**

| Subcategory | Description |
|-------------|-------------|
| PI sent to wrong recipient (email) | Most common human error |
| Unauthorised disclosure / unintended release | Accidental publication |
| Failure to use BCC | Mass email CC/BCC errors |
| Unauthorised disclosure / failure to redact | Incomplete redaction |
| Unauthorised disclosure / verbal | Verbal disclosure |
| Loss of paperwork or data storage device | Physical loss |
| PI sent to wrong recipient (other channels) | Non-email misdirection |
| PI sent to wrong recipient (mail) | Postal misdirection |
| Insecure disposal | Improper destruction |

### 4.5 Personal Information Type Taxonomy

| Category | Includes |
|----------|----------|
| Contact information | Name, email, phone, home address |
| Identity information | Passport number, driver's licence, Medicare number |
| Financial details | Bank account, credit card, superannuation |
| Health information | Medical records, health conditions, prescriptions |
| Tax file number (TFN) | Australian tax identifier |
| Other sensitive information | Sexual orientation, political opinions, religious beliefs, criminal record |

### 4.6 Individuals Affected Ranges

The OAIC reports affected individuals in these brackets:
- 1 individual
- 2–10
- 11–100
- 101–1,000
- 1,001–5,000
- 5,001–10,000
- 10,001–25,000
- 25,001–50,000
- 50,001–100,000
- 100,001–250,000
- 250,001–500,000
- 500,001–1,000,000
- 1,000,001–10,000,000
- 10,000,001 or more

---

## 5. Rate Limits

| Aspect | Detail |
|--------|--------|
| **Rate Limit** | None documented (static web pages) |
| **Throttling** | No known throttling |
| **Best Practice** | 2–5 second delays between page requests |
| **Dashboard** | May have CDN-level rate limiting; use conservative intervals |

### Recommended Connector Behavior

```python
import time
import random

def polite_delay():
    """Respectful delay between scraping requests."""
    time.sleep(2 + random.uniform(0, 3))  # 2-5 second random delay
```

---

## 6. Pagination

**Not applicable.** The OAIC publishes data as:
- A single-page interactive dashboard (all data loaded client-side)
- Individual report pages (one page per half-year report)
- PDF reports (single documents per period)

No pagination is needed for scraping.

---

## 7. Sample Data Extraction

### 7.1 Scraping a Report Page

```bash
# Download the H2 2024 report page
curl -s "https://www.oaic.gov.au/privacy/notifiable-data-breaches/notifiable-data-breaches-publications/notifiable-data-breaches-report-july-to-december-2024" \
  -H "User-Agent: Threatpedia-Connector/1.0" \
  -o oaic_h2_2024.html
```

### 7.2 Downloading the PDF Report

```bash
# PDF reports are linked from the report pages
# Example PDF URL pattern:
curl -s "https://www.oaic.gov.au/__data/assets/pdf_file/XXXX/YYYYY/OAIC-Notifiable-data-breaches-report-Jul-Dec-2024.pdf" \
  -H "User-Agent: Threatpedia-Connector/1.0" \
  -o oaic_h2_2024.pdf
```

### 7.3 Checking for New Reports

```bash
# Scrape the publications index page
curl -s "https://www.oaic.gov.au/privacy/notifiable-data-breaches/notifiable-data-breaches-publications" \
  -H "User-Agent: Threatpedia-Connector/1.0" \
  | python3 -c "
import sys
from html.parser import HTMLParser

class LinkExtractor(HTMLParser):
    def handle_starttag(self, tag, attrs):
        if tag == 'a':
            for name, value in attrs:
                if name == 'href' and 'notifiable-data-breaches-report' in (value or ''):
                    print(value)

LinkExtractor().feed(sys.stdin.read())
"
```

---

## 8. Sample Data

### 8.1 Normalized Half-Year Report Record

```json
{
  "source_id": "oaic-ndb:2024-H2",
  "report_period": "2024-H2",
  "period_start": "2024-07-01",
  "period_end": "2024-12-31",
  "publish_date": "2025-02-11",
  "total_notifications": 586,
  "breach_sources": {
    "malicious_or_criminal_attack": 404,
    "human_error": 170,
    "system_fault": 12
  },
  "top_cyber_incidents": {
    "phishing_compromised_credentials": 84,
    "ransomware": 60,
    "compromised_credentials_unknown": 51,
    "hacking": 23,
    "brute_force": 16,
    "malware": 12
  },
  "top_sectors": [
    {"sector": "Health service providers", "count": 121},
    {"sector": "Australian Government", "count": 100},
    {"sector": "Finance", "count": 54},
    {"sector": "Legal, accounting, management", "count": 36},
    {"sector": "Retail", "count": 34}
  ],
  "identification_within_30_days_pct": 66,
  "notification_within_10_days_pct": 52,
  "data_source": "oaic-ndb",
  "country": "AU"
}
```

### 8.2 Trend Data Point (Cross-Report Comparison)

```json
{
  "trend_metric": "total_notifications",
  "data_points": [
    {"period": "2024-H2", "value": 586},
    {"period": "2024-H1", "value": 527},
    {"period": "2023-H2", "value": 483},
    {"period": "2023-H1", "value": 409},
    {"period": "2022-H2", "value": 393},
    {"period": "2022-H1", "value": 396},
    {"period": "2021-H2", "value": 464},
    {"period": "2021-H1", "value": 446}
  ]
}
```

---

## 9. Normalization Notes — Mapping to Threatpedia Entity Format

### 9.1 Field Mapping

The OAIC data maps differently from other Threatpedia sources because it provides **aggregate statistics** rather than individual breach records.

| OAIC Data | Threatpedia Field | Transform |
|-----------|-------------------|-----------|
| Report period | `source_id` | `oaic-ndb:{YYYY}-H{1\|2}` |
| Report period | `report_period` | Direct |
| `totalNotifications` | `total_notifications` | Direct integer |
| Sector breakdown | `sector_distribution` | Normalize to Threatpedia sector taxonomy |
| Source breakdown | `breach_cause_distribution` | Map to Threatpedia cause taxonomy |
| Cyber incident types | `attack_type_distribution` | Map to Threatpedia attack taxonomy |
| PI types | `data_types_exposed` | Map to Threatpedia data type taxonomy |
| Affected ranges | `impact_distribution` | Direct bracket mapping |
| *(derived)* | `country` | Always `"AU"` |
| *(derived)* | `regulatory_framework` | `"Privacy Act 1988 (Cth) — NDB Scheme"` |
| *(derived)* | `data_source` | `"oaic-ndb"` |
| *(derived)* | `confidence_level` | `"HIGH"` — government-reported data |

### 9.2 Sector Normalization

Map OAIC sectors to Threatpedia's standardized sector taxonomy:

```python
SECTOR_MAP = {
    "Health service providers": "healthcare",
    "Australian Government": "government",
    "Finance (including superannuation)": "financial_services",
    "Finance": "financial_services",
    "Legal, accounting and management services": "professional_services",
    "Legal, accounting, management": "professional_services",
    "Education": "education",
    "Retail": "retail",
    "Insurance": "insurance",
    "Personal services": "personal_services",
    "Professional, scientific and technical services": "technology",
    "Information media and telecommunications": "telecommunications",
    "Mining": "mining",
    "Construction": "construction",
    "Electricity, gas, water and waste services": "utilities",
    "Transport, postal and warehousing": "transportation",
    "Accommodation and food services": "hospitality",
    "Not-for-profit organisations": "nonprofit",
    # Unknown/other pass through
}
```

### 9.3 Breach Cause Normalization

```python
CAUSE_MAP = {
    "Malicious or criminal attack": "malicious_attack",
    "Cyber incident": "cyber_attack",
    "Social engineering / impersonation": "social_engineering",
    "Rogue employee / insider threat": "insider_threat",
    "Theft of paperwork or data storage device": "physical_theft",
    "Human error": "human_error",
    "System fault": "system_fault",
    "Phishing (compromised credentials)": "phishing",
    "Ransomware": "ransomware",
    "Compromised/stolen credentials (method unknown)": "credential_theft",
    "Hacking": "hacking",
    "Brute-force attack": "brute_force",
    "Malware": "malware",
}
```

### 9.4 Cross-Reference Strategy

Since OAIC data is aggregate (not individual breach records), it serves a different role than sources like HIBP or HHS/OCR:

| Use Case | Method |
|----------|--------|
| Country-level trend analysis | Direct — OAIC is the AU authoritative source |
| Sector comparison (AU vs US vs EU) | Cross-reference OAIC sectors with HHS/OCR (US healthcare), EU GDPR tracker |
| Ransomware trend tracking | Cross-reference ransomware counts with CISA KEV, incident reports |
| Enriching known AU breaches | Match by date range + sector + affected count to identify specific incidents |
| Regulatory compliance benchmarking | Compare notification timelines across AU, US, EU jurisdictions |

---

## 10. Incremental Sync Strategy

### 10.1 Report Discovery

Since OAIC publishes twice yearly, the sync strategy is report-based:

```python
import requests
from bs4 import BeautifulSoup

def discover_new_reports(known_reports: set[str]) -> list[dict]:
    """Check for new OAIC NDB reports not yet ingested."""
    url = "https://www.oaic.gov.au/privacy/notifiable-data-breaches/notifiable-data-breaches-publications"
    resp = requests.get(url, headers={"User-Agent": "Threatpedia-Connector/1.0"}, timeout=30)
    soup = BeautifulSoup(resp.text, "html.parser")
    
    new_reports = []
    for link in soup.find_all("a", href=True):
        href = link["href"]
        if "notifiable-data-breaches-report" in href:
            slug = href.rstrip("/").split("/")[-1]
            if slug not in known_reports:
                new_reports.append({
                    "slug": slug,
                    "title": link.get_text(strip=True),
                    "url": f"https://www.oaic.gov.au{href}" if href.startswith("/") else href,
                })
    
    return new_reports
```

### 10.2 Report Parsing

```python
def parse_report_page(url: str) -> dict:
    """Parse an OAIC NDB report page and extract key statistics."""
    resp = requests.get(url, headers={"User-Agent": "Threatpedia-Connector/1.0"}, timeout=30)
    soup = BeautifulSoup(resp.text, "html.parser")
    
    report = {"source_url": url, "raw_html": resp.text}
    
    # Extract statistics from tables and structured content
    tables = soup.find_all("table")
    for table in tables:
        headers = [th.get_text(strip=True) for th in table.find_all("th")]
        rows = []
        for tr in table.find_all("tr"):
            cells = [td.get_text(strip=True) for td in tr.find_all("td")]
            if cells:
                rows.append(cells)
        report.setdefault("tables", []).append({"headers": headers, "rows": rows})
    
    # Extract key figures from text content
    text = soup.get_text()
    # Use regex to find notification counts, percentages, etc.
    import re
    notification_match = re.search(r'(\d{3,4})\s+(?:notifications?|data breach notifications?)', text)
    if notification_match:
        report["total_notifications"] = int(notification_match.group(1))
    
    return report
```

### 10.3 Recommended Sync Frequency

| Action | Frequency | Rationale |
|--------|-----------|-----------|
| Check for new reports | Monthly | Reports published twice yearly; monthly check catches them promptly |
| Re-parse existing reports | Never (immutable once published) | OAIC reports are static after publication |
| Dashboard scrape | Quarterly | Dashboard may update slightly between reports |

---

## 11. Implementation Notes

### 11.1 Recommended Libraries

| Library | Purpose |
|---------|---------|
| `requests` | HTTP requests to report pages |
| `beautifulsoup4` | HTML parsing of report pages |
| `selenium` / `playwright` | Dashboard scraping (JS-rendered) |
| `pdfplumber` | PDF table extraction from report PDFs |
| `camelot-py` | Alternative PDF table extraction |
| `lxml` | Fast HTML/XML parsing |

### 11.2 Gotchas and Special Handling

1. **No individual breach records**: Unlike HHS/OCR or HIBP, the OAIC does **not** publish individual breach notification details. All data is aggregate statistics. This means OAIC data enriches Threatpedia's country-level analytics, not individual incident records.

2. **Dashboard is JavaScript-rendered**: The statistics dashboard requires a headless browser (Selenium/Playwright) to scrape. Inspect network requests to find the underlying data API — it may expose structured JSON.

3. **Inconsistent URL slugs**: Report URL slugs vary in format across years (e.g., `januaryjune-2021` vs `january-to-june-2024`). Build a flexible URL matching pattern.

4. **PDF parsing is fragile**: Report PDFs contain charts and styled tables that are difficult to parse reliably. Prefer HTML scraping of the web report pages where possible. Use PDF parsing as a fallback.

5. **Sector names vary between reports**: The OAIC occasionally adjusts sector naming and grouping. Build a fuzzy-matching normalization layer.

6. **Multi-entity breaches**: The OAIC counts multi-entity breaches as a single "primary notification" to avoid duplication. Be aware of this when comparing notification counts to actual breach events.

7. **Reporting lag**: There is a significant lag between when breaches occur and when the OAIC publishes statistics. The H2 2024 report (covering Jul–Dec 2024) was published on 11 Feb 2025 with data current as of that date.

8. **30-day assessment window**: Entities have 30 days to assess whether a breach meets the notification threshold. This means some breaches occurring near period boundaries appear in subsequent reports.

9. **No CVEs or IOCs**: OAIC data contains no technical indicators. It is purely regulatory/statistical. Enrich with other sources for technical detail.

10. **Consumer Data Right (CDR) breaches**: Since 2024, CDR breaches are reported separately. These follow a different timeline and are noted with a separate "statistics current as of" date.

### 11.3 Error Handling

| Scenario | Action |
|----------|--------|
| HTTP 200 | Parse content |
| HTTP 403 | May be blocked for scraping — adjust User-Agent, add delays |
| HTTP 404 | Report URL has changed — check publications index |
| HTTP 5xx | Government CDN issue — retry with backoff |
| Parse error | HTML structure changed — alert for manual review |
| PDF extraction failure | Fall back to web page scraping |

### 11.4 Caching

- Cache report pages indefinitely once parsed — they are immutable after publication
- Cache the publications index page for 1 day
- Store extracted data in structured JSON for historical trend analysis

---

## 12. Sample Connector Implementation

```python
"""
Threatpedia OAIC NDB Connector — Aggregate Statistics Sync
"""
import requests
import re
import json
import time
import random
import logging
from datetime import datetime
from typing import Optional
from bs4 import BeautifulSoup

logger = logging.getLogger("threatpedia.oaic_ndb")


class OAICNDBConnector:
    BASE_URL = "https://www.oaic.gov.au"
    PUBLICATIONS_URL = f"{BASE_URL}/privacy/notifiable-data-breaches/notifiable-data-breaches-publications"
    DASHBOARD_URL = f"{BASE_URL}/privacy/notifiable-data-breaches/notifiable-data-breach-statistics-dashboard"

    SECTOR_MAP = {
        "Health service providers": "healthcare",
        "Australian Government": "government",
        "Finance (including superannuation)": "financial_services",
        "Finance": "financial_services",
        "Legal, accounting and management services": "professional_services",
        "Legal, accounting, management": "professional_services",
        "Education": "education",
        "Retail": "retail",
        "Insurance": "insurance",
        "Information media and telecommunications": "telecommunications",
        "Not-for-profit organisations": "nonprofit",
    }

    CAUSE_MAP = {
        "Malicious or criminal attack": "malicious_attack",
        "Human error": "human_error",
        "System fault": "system_fault",
    }

    def __init__(self):
        self.session = requests.Session()
        self.session.headers.update({
            "User-Agent": "Threatpedia-Connector/1.0 (threatpedia.wiki)",
        })

    def _polite_delay(self):
        """Respectful delay between requests."""
        time.sleep(2 + random.uniform(0, 3))

    def discover_reports(self) -> list[dict]:
        """Discover all available NDB reports from the publications page."""
        resp = self.session.get(self.PUBLICATIONS_URL, timeout=30)
        resp.raise_for_status()
        soup = BeautifulSoup(resp.text, "html.parser")

        reports = []
        for link in soup.find_all("a", href=True):
            href = link["href"]
            title = link.get_text(strip=True)
            if "notifiable-data-breaches-report" in href or "insights-report" in href:
                slug = href.rstrip("/").split("/")[-1]
                full_url = f"{self.BASE_URL}{href}" if href.startswith("/") else href
                period = self._parse_period_from_slug(slug)
                reports.append({
                    "slug": slug,
                    "title": title,
                    "url": full_url,
                    "period": period,
                })

        return reports

    def _parse_period_from_slug(self, slug: str) -> Optional[str]:
        """Extract reporting period from URL slug."""
        # Match patterns like "july-to-december-2024" or "januaryjune-2021"
        patterns = [
            (r"january-to-june-(\d{4})", lambda m: f"{m.group(1)}-H1"),
            (r"januaryjune-(\d{4})", lambda m: f"{m.group(1)}-H1"),
            (r"july-to-december-(\d{4})", lambda m: f"{m.group(1)}-H2"),
            (r"julydecember-(\d{4})", lambda m: f"{m.group(1)}-H2"),
        ]
        for pattern, formatter in patterns:
            match = re.search(pattern, slug)
            if match:
                return formatter(match)
        return None

    def parse_report(self, url: str) -> dict:
        """Parse an NDB report page and extract key statistics."""
        self._polite_delay()
        resp = self.session.get(url, timeout=30)
        resp.raise_for_status()
        soup = BeautifulSoup(resp.text, "html.parser")
        text = soup.get_text(separator=" ")

        report = {"source_url": url}

        # Extract total notifications
        notif_match = re.search(
            r'(\d{3,4})\s+(?:notifications?|data breach notifications?|breaches?\s+notif)',
            text, re.IGNORECASE
        )
        if notif_match:
            report["total_notifications"] = int(notif_match.group(1))

        # Extract tables
        tables = []
        for table in soup.find_all("table"):
            headers = [th.get_text(strip=True) for th in table.find_all("th")]
            rows = []
            for tr in table.find_all("tr"):
                cells = [td.get_text(strip=True) for td in tr.find_all("td")]
                if cells:
                    rows.append(cells)
            if headers or rows:
                tables.append({"headers": headers, "rows": rows})
        report["tables"] = tables

        # Extract PDF link
        for link in soup.find_all("a", href=True):
            if link["href"].endswith(".pdf"):
                report["pdf_url"] = (
                    f"{self.BASE_URL}{link['href']}"
                    if link["href"].startswith("/") else link["href"]
                )
                break

        return report

    def normalize_report(self, report: dict, period: str) -> dict:
        """Normalize parsed report data to Threatpedia format."""
        return {
            "source_id": f"oaic-ndb:{period}",
            "report_period": period,
            "total_notifications": report.get("total_notifications"),
            "source_url": report.get("source_url"),
            "pdf_url": report.get("pdf_url"),
            "tables": report.get("tables", []),
            "country": "AU",
            "regulatory_framework": "Privacy Act 1988 (Cth) — NDB Scheme",
            "data_source": "oaic-ndb",
            "confidence_level": "HIGH",
            "last_synced": datetime.utcnow().isoformat() + "Z",
        }

    def sync_reports(self, local_store) -> dict:
        """
        Discover and ingest any new OAIC NDB reports.

        Args:
            local_store: Object with methods:
                - has_report(period) -> bool
                - upsert_report(report_dict) -> None

        Returns:
            dict with counts: {"new": int, "skipped": int}
        """
        stats = {"new": 0, "skipped": 0}

        reports = self.discover_reports()
        for report_meta in reports:
            period = report_meta.get("period")
            if not period:
                continue

            if local_store.has_report(period):
                stats["skipped"] += 1
                continue

            try:
                parsed = self.parse_report(report_meta["url"])
                normalized = self.normalize_report(parsed, period)
                local_store.upsert_report(normalized)
                stats["new"] += 1
                logger.info(f"Ingested OAIC NDB report: {period} "
                          f"({normalized.get('total_notifications', '?')} notifications)")
            except Exception as e:
                logger.error(f"Failed to parse report {period}: {e}")

        logger.info(f"OAIC NDB sync complete: {stats}")
        return stats


# --- Usage Example ---
if __name__ == "__main__":
    connector = OAICNDBConnector()

    # Discover available reports
    reports = connector.discover_reports()
    print(f"Found {len(reports)} OAIC NDB reports")

    for r in reports[:5]:
        print(f"  {r['period'] or 'unknown'}: {r['title']}")

    # Parse the latest report
    if reports:
        latest = reports[0]
        parsed = connector.parse_report(latest["url"])
        print(f"\nLatest report: {latest['title']}")
        print(f"  Total notifications: {parsed.get('total_notifications', 'N/A')}")
        print(f"  Tables found: {len(parsed.get('tables', []))}")
        print(f"  PDF: {parsed.get('pdf_url', 'N/A')}")
```

---

## 13. Data Volume & Growth

| Metric | Value (approx. Q1 2026) |
|--------|--------------------------|
| Total cumulative notifications | ~7,500+ (since Feb 2018) |
| Notifications per half-year | ~500–600 (trending upward) |
| Reports available | ~15 (half-yearly + quarterly early reports) |
| Growth rate | ~10% increase H-over-H |
| Ransomware proportion | ~10–12% of all notifications |
| Top sector (consistent) | Health service providers (~19–20%) |
| Data per report | ~20–30 statistical data points |

---

## 14. Gaps & Enrichment Needs

### 14.1 What OAIC Provides Well

- **Australian breach landscape**: Sole authoritative source for AU regulatory breach data
- **Sector analysis**: Detailed sector-level breakdown (ANZSIC-aligned)
- **Cause taxonomy**: Three-tier classification (source → subcategory → type)
- **Temporal trends**: Consistent half-yearly reporting since Feb 2018
- **Ransomware tracking**: Ransomware count as distinct cyber incident type
- **Notification timeline**: How quickly breaches are identified and reported
- **Personal information types**: Categories of data compromised

### 14.2 What OAIC Does NOT Provide

| Gap | Description | Enrichment Source | Priority |
|-----|-------------|-------------------|----------|
| **Individual breach records** | No entity names or specific incidents | News APIs, HIBP, Threatpedia incidents | Critical |
| **CVEs / vulnerabilities** | No technical vulnerability data | NVD, CISA KEV | High |
| **IOCs** | No indicators of compromise | MISP, AlienVault OTX, Abuse.ch | High |
| **Threat actor attribution** | No attacker information | MITRE ATT&CK, threat intel feeds | High |
| **Records affected count** | Only bracket ranges, not exact numbers | HIBP, news sources | Medium |
| **Financial impact** | No breach cost or fine data | EU GDPR tracker (for comparison), news | Medium |
| **Attack techniques** | No ATT&CK technique mapping | MITRE ATT&CK | Medium |
| **Entity-level data** | Anonymized/aggregate only | News scraping, ASIC filings | Medium |
| **Sub-sector granularity** | Broad ANZSIC sectors only | Company databases | Low |
| **State/territory breakdown** | National aggregate only (some reports have limited state data) | State privacy regulators | Low |

### 14.3 Cross-Reference Value

The OAIC NDB data's primary value is as a **regulatory comparison benchmark**:

| Comparison | Sources |
|------------|---------|
| AU vs US healthcare breaches | OAIC (Health sector) ↔ HHS/OCR |
| AU vs EU breach volumes | OAIC ↔ EU GDPR Enforcement Tracker |
| AU ransomware trends | OAIC (ransomware count) ↔ CISA KEV (ransomware flag) |
| Global breach cause analysis | OAIC (cause taxonomy) ↔ VCDB (A4 model) ↔ HIBP (breach metadata) |

---

## 15. References

- [OAIC Notifiable Data Breaches](https://www.oaic.gov.au/privacy/notifiable-data-breaches)
- [OAIC NDB Statistics Dashboard](https://www.oaic.gov.au/privacy/notifiable-data-breaches/notifiable-data-breach-statistics-dashboard)
- [OAIC NDB Publications](https://www.oaic.gov.au/privacy/notifiable-data-breaches/notifiable-data-breaches-publications)
- [About the NDB Scheme](https://www.oaic.gov.au/privacy/notifiable-data-breaches/about-the-notifiable-data-breaches-scheme)
- [Report a Data Breach](https://www.oaic.gov.au/privacy/notifiable-data-breaches/report-a-data-breach)
- [NDB Form (Training Version, PDF)](https://www.oaic.gov.au/__data/assets/pdf_file/0008/2240/oaic-ndb-form-for-training-purposes-only.pdf)
- [Part 4: NDB Scheme Guidance](https://www.oaic.gov.au/privacy/guidance-and-advice/data-breach-preparation-and-response/part-4-notifiable-data-breach-ndb-scheme)
- [Privacy Act 1988 (Cth)](https://www.legislation.gov.au/Series/C2004A03712)
- [OAIC Data and Statistical Information](https://www.oaic.gov.au/about-the-OAIC/access-our-information/data-and-statistical-information)
- [NDB Scheme Overview (PDF)](https://www.oaic.gov.au/__data/assets/pdf_file/0011/5213/the-ndb-scheme-an-overview.pdf)
- [H2 2024 NDB Report](https://www.oaic.gov.au/privacy/notifiable-data-breaches/notifiable-data-breaches-publications/notifiable-data-breaches-report-july-to-december-2024)
- [H1 2024 NDB Report](https://www.oaic.gov.au/privacy/notifiable-data-breaches/notifiable-data-breaches-publications/notifiable-data-breaches-report-january-to-june-2024)
