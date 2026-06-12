"""PyPI release-event adapter.

PyPI updates RSS is used for change detection. Release facts are confirmed
through the PyPI JSON API before a ReleaseEvent is emitted.
"""

from __future__ import annotations

from datetime import datetime
from email.utils import parsedate_to_datetime
from html import unescape
import json
import re
from typing import Any
from urllib.parse import quote
from urllib.request import Request, urlopen

from .normalizer import ReleaseEvent, parse_datetime, release_event


PYPI_JSON_BASE = "https://pypi.org/pypi"


def project_json_url(project_name: str) -> str:
    return f"{PYPI_JSON_BASE}/{quote(project_name, safe='')}/json"


def fetch_project_json(project_name: str, timeout: int = 20) -> dict[str, Any]:
    request = Request(project_json_url(project_name), headers={"Accept": "application/json"})
    with urlopen(request, timeout=timeout) as response:
        return json.loads(response.read().decode("utf-8"))


def parse_updates_rss(xml_text: str) -> list[dict[str, str]]:
    items: list[dict[str, str]] = []

    def tag_text(item_text: str, tag: str) -> str:
        match = re.search(rf"<{tag}[^>]*>(.*?)</{tag}>", item_text, flags=re.DOTALL | re.IGNORECASE)
        return unescape(match.group(1).strip()) if match else ""

    for match in re.finditer(r"<item\b[^>]*>(.*?)</item>", xml_text, flags=re.DOTALL | re.IGNORECASE):
        item_text = match.group(1)
        title = tag_text(item_text, "title")
        link = tag_text(item_text, "link")
        pub_date = tag_text(item_text, "pubDate")
        if not title or " " not in title:
            continue
        project, version = title.rsplit(" ", 1)
        published_at = parsedate_to_datetime(pub_date).isoformat() if pub_date else ""
        items.append(
            {
                "project": project.strip(),
                "version": version.strip(),
                "published_at": published_at,
                "link": link,
                "cursor": pub_date or link or title,
            }
        )
    return items


def release_event_from_project_json(
    project_json: dict[str, Any],
    *,
    version: str,
    feed_cursor: str,
    observed_at: datetime | None = None,
) -> ReleaseEvent:
    info = project_json.get("info") or {}
    name = info.get("name")
    if not name:
        raise ValueError("PyPI project JSON missing info.name")
    release_files = (project_json.get("releases") or {}).get(version) or []
    if not release_files:
        raise ValueError(f"PyPI project JSON missing release files for {name} {version}")
    upload_times = [
        parse_datetime(file["upload_time_iso_8601"])
        for file in release_files
        if file.get("upload_time_iso_8601")
    ]
    if not upload_times:
        raise ValueError(f"PyPI release files missing upload times for {name} {version}")
    published_at = min(upload_times)
    return release_event(
        ecosystem="pypi",
        name=name,
        version=version,
        published_at=published_at,
        feed_name="pypi-updates-rss",
        feed_cursor=feed_cursor,
        source_url=project_json_url(name),
        observed_facts={
            "summary": info.get("summary"),
            "requires_python": info.get("requires_python"),
            "classifiers": info.get("classifiers", []),
            "files": [
                {
                    "filename": file.get("filename"),
                    "packagetype": file.get("packagetype"),
                    "digests": file.get("digests", {}),
                    "size": file.get("size"),
                    "upload_time_iso_8601": file.get("upload_time_iso_8601"),
                }
                for file in release_files
            ],
        },
        raw_registry_metadata={"info": info, "release_files": release_files},
        observed_at=observed_at,
    )
