"""
Threatpedia Base Connector
==========================

Abstract base class and shared utilities for all Threatpedia data source connectors.
Provides a consistent interface, retry logic, rate limiting, and a normalized
record schema for the ingestion pipeline.
"""

from __future__ import annotations

import json
import logging
import time
from abc import ABC, abstractmethod
from dataclasses import dataclass, field, asdict
from datetime import datetime, timezone
from functools import wraps
from typing import Any, Generator, Optional

import requests
from requests.adapters import HTTPAdapter
from urllib3.util.retry import Retry

logger = logging.getLogger("threatpedia.connectors")


# ---------------------------------------------------------------------------
# Normalized Record Schema
# ---------------------------------------------------------------------------

@dataclass
class ThreatpediaRecord:
    """Canonical schema for a normalized Threatpedia record.

    Every connector must map its source data into this structure before output.
    """

    breach_name: str
    source_name: str
    source_url: str
    date_occurred: Optional[str] = None          # ISO 8601 date or datetime
    date_reported: Optional[str] = None          # ISO 8601 date or datetime
    organization: Optional[str] = None
    sector: Optional[str] = None
    country: Optional[str] = None
    records_affected: Optional[int] = None
    data_types_exposed: Optional[list[str]] = field(default_factory=list)
    cves: Optional[list[str]] = field(default_factory=list)
    iocs: Optional[list[str]] = field(default_factory=list)
    raw_data: Optional[dict[str, Any]] = field(default_factory=dict)

    def to_dict(self) -> dict[str, Any]:
        """Serialize to a plain dictionary."""
        return asdict(self)

    def to_json(self, indent: int = 2) -> str:
        """Serialize to a JSON string."""
        return json.dumps(self.to_dict(), indent=indent, default=str)


# ---------------------------------------------------------------------------
# Shared Utilities
# ---------------------------------------------------------------------------

class TokenBucketRateLimiter:
    """Simple token-bucket rate limiter.

    Args:
        rate: Maximum number of requests allowed per ``per`` seconds.
        per: Time window in seconds (default 60).
    """

    def __init__(self, rate: int, per: float = 60.0) -> None:
        if rate <= 0:
            raise ValueError(
                f"TokenBucketRateLimiter rate must be a positive integer; got {rate!r}"
            )
        if per <= 0:
            raise ValueError(
                f"TokenBucketRateLimiter per must be a positive number; got {per!r}"
            )
        self.rate = rate
        self.per = per
        self.tokens = float(rate)
        self.max_tokens = float(rate)
        self.last_refill = time.monotonic()

    def _refill(self) -> None:
        now = time.monotonic()
        elapsed = now - self.last_refill
        self.tokens = min(self.max_tokens, self.tokens + elapsed * (self.rate / self.per))
        self.last_refill = now

    def acquire(self) -> None:
        """Block until a token is available, then consume it."""
        while True:
            self._refill()
            if self.tokens >= 1.0:
                self.tokens -= 1.0
                return
            # Sleep for the time needed to accumulate one token
            deficit = 1.0 - self.tokens
            sleep_time = deficit / (self.rate / self.per)
            time.sleep(sleep_time)


def retry_with_backoff(
    max_retries: int = 3,
    base_delay: float = 2.0,
    max_delay: float = 120.0,
    backoff_factor: float = 2.0,
    retryable_exceptions: tuple = (
        requests.exceptions.Timeout,
        requests.exceptions.ConnectionError,
        requests.exceptions.HTTPError,
    ),
):
    """Decorator that retries a function with exponential backoff.

    Args:
        max_retries: Maximum number of retry attempts.
        base_delay: Initial delay in seconds before the first retry.
        max_delay: Cap on the delay between retries.
        backoff_factor: Multiplier applied to the delay after each retry.
        retryable_exceptions: Tuple of exception classes that trigger a retry.
    """

    def decorator(func):
        @wraps(func)
        def wrapper(*args, **kwargs):
            delay = base_delay
            last_exception = None
            for attempt in range(max_retries + 1):
                try:
                    return func(*args, **kwargs)
                except retryable_exceptions as exc:
                    last_exception = exc
                    if attempt == max_retries:
                        break
                    sleep_time = min(delay, max_delay)
                    logger.warning(
                        "Attempt %d/%d for %s failed: %s. Retrying in %.1fs...",
                        attempt + 1,
                        max_retries + 1,
                        func.__name__,
                        exc,
                        sleep_time,
                    )
                    time.sleep(sleep_time)
                    delay *= backoff_factor
            raise RuntimeError(
                f"{func.__name__} failed after {max_retries + 1} attempts"
            ) from last_exception

        return wrapper

    return decorator


def normalize_timestamp(value: Optional[str]) -> Optional[str]:
    """Best-effort normalization of a timestamp string to ISO 8601 UTC.

    Handles common formats: ``YYYY-MM-DD``, ``YYYY-MM-DDTHH:MM:SSZ``,
    ``YYYY-MM-DDTHH:MM:SS.fffZ``, and timezone-aware variants.

    Returns the original string if parsing fails (to avoid data loss).
    """
    if not value:
        return None

    # Already a clean ISO date
    if len(value) == 10:
        try:
            datetime.strptime(value, "%Y-%m-%d")
            return value
        except ValueError:
            pass

    # Try parsing common datetime formats
    for fmt in (
        "%Y-%m-%dT%H:%M:%S.%fZ",
        "%Y-%m-%dT%H:%M:%SZ",
        "%Y-%m-%dT%H:%M:%S.%f",
        "%Y-%m-%dT%H:%M:%S",
        "%Y-%m-%dT%H:%M:%S%z",
        "%Y-%m-%dT%H:%M:%S.%f%z",
    ):
        try:
            dt = datetime.strptime(value, fmt)
            if dt.tzinfo is None:
                dt = dt.replace(tzinfo=timezone.utc)
            return dt.isoformat()
        except ValueError:
            continue

    # Return as-is rather than lose data
    return value


class JSONSerializer:
    """Helper for writing normalized records to JSON files."""

    @staticmethod
    def write_records(records: list[ThreatpediaRecord], filepath: str) -> int:
        """Write a list of records to a JSON file.

        Returns the number of records written.
        """
        data = [r.to_dict() for r in records]
        with open(filepath, "w", encoding="utf-8") as f:
            json.dump(data, f, indent=2, default=str)
        return len(data)

    @staticmethod
    def write_records_jsonl(records: list[ThreatpediaRecord], filepath: str) -> int:
        """Write records as newline-delimited JSON (JSONL)."""
        count = 0
        with open(filepath, "w", encoding="utf-8") as f:
            for r in records:
                f.write(json.dumps(r.to_dict(), default=str) + "\n")
                count += 1
        return count


# ---------------------------------------------------------------------------
# Base Connector
# ---------------------------------------------------------------------------

class ThreatpediaConnector(ABC):
    """Abstract base class for all Threatpedia data source connectors.

    Subclasses must implement:
        - ``authenticate()``
        - ``fetch_all()``
        - ``fetch_incremental(since_date)``
        - ``normalize(raw_record)``

    The ``run()`` method orchestrates the full pipeline.
    """

    SOURCE_NAME: str = "unknown"
    SOURCE_URL: str = ""

    def __init__(
        self,
        rate_limit: int = 60,
        rate_window: float = 60.0,
        request_timeout: int = 30,
    ) -> None:
        self.logger = logging.getLogger(f"threatpedia.connectors.{self.SOURCE_NAME}")
        self.rate_limiter = TokenBucketRateLimiter(rate=rate_limit, per=rate_window)
        self.request_timeout = request_timeout
        self.session = self._build_session()

    def _build_session(self) -> requests.Session:
        """Create an HTTP session with automatic retries on transient errors."""
        session = requests.Session()
        retry_strategy = Retry(
            total=3,
            backoff_factor=1,
            status_forcelist=[429, 500, 502, 503, 504],
            allowed_methods=["GET", "POST"],
        )
        adapter = HTTPAdapter(max_retries=retry_strategy)
        session.mount("https://", adapter)
        session.mount("http://", adapter)
        session.headers.update({
            "User-Agent": "Threatpedia/1.0 (+https://threatpedia.io)",
            "Accept": "application/json",
        })
        return session

    # ---- Abstract interface ------------------------------------------------

    @abstractmethod
    def authenticate(self) -> None:
        """Set up authentication (API keys, tokens, etc.).

        For sources requiring no auth, implement as a no-op.
        """
        ...

    @abstractmethod
    def fetch_all(self) -> list[dict[str, Any]]:
        """Perform a full data pull from the source.

        Returns a list of raw records in the source's native format.
        """
        ...

    @abstractmethod
    def fetch_incremental(self, since_date: str) -> list[dict[str, Any]]:
        """Fetch records added or modified since ``since_date`` (ISO 8601).

        Returns a list of raw records in the source's native format.
        """
        ...

    @abstractmethod
    def normalize(self, raw_record: dict[str, Any]) -> ThreatpediaRecord:
        """Transform a single raw record into a ``ThreatpediaRecord``."""
        ...

    # ---- Orchestration -----------------------------------------------------

    def run(
        self,
        mode: str = "full",
        since_date: Optional[str] = None,
        output_file: Optional[str] = None,
    ) -> list[ThreatpediaRecord]:
        """Execute the connector pipeline.

        Args:
            mode: ``"full"`` for a complete pull, ``"incremental"`` for delta.
            since_date: ISO 8601 date string for incremental mode.
            output_file: Optional path to write results as JSON.

        Returns:
            List of normalized ``ThreatpediaRecord`` objects.
        """
        self.logger.info("Starting %s connector in %s mode", self.SOURCE_NAME, mode)

        # Step 1: Authenticate
        self.authenticate()

        # Step 2: Fetch
        if mode == "incremental" and since_date:
            raw_records = self.fetch_incremental(since_date)
        else:
            raw_records = self.fetch_all()

        self.logger.info("Fetched %d raw records from %s", len(raw_records), self.SOURCE_NAME)

        # Step 3: Normalize
        normalized: list[ThreatpediaRecord] = []
        errors = 0
        for record in raw_records:
            try:
                normalized.append(self.normalize(record))
            except Exception as exc:
                errors += 1
                self.logger.warning("Normalization error: %s — record skipped", exc)

        self.logger.info(
            "Normalized %d records (%d errors) from %s",
            len(normalized),
            errors,
            self.SOURCE_NAME,
        )

        # Step 4: Output
        if output_file:
            count = JSONSerializer.write_records(normalized, output_file)
            self.logger.info("Wrote %d records to %s", count, output_file)

        return normalized
