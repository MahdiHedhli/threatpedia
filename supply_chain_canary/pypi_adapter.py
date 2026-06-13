"""PyPI release-event adapter.

PyPI updates RSS is used for change detection. Release facts are confirmed
through the PyPI JSON API before a ReleaseEvent is emitted.
"""

from __future__ import annotations

from datetime import datetime
from email.utils import parsedate_to_datetime
from html import unescape
import json
from html.parser import HTMLParser
from typing import Any
from urllib.parse import quote
from urllib.request import Request, urlopen

from .normalizer import ReleaseEvent, parse_datetime, release_event


PYPI_JSON_BASE = "https://pypi.org/pypi"


class _PyPIUpdatesParser(HTMLParser):
    def __init__(self) -> None:
        super().__init__(convert_charrefs=True)
        self.items: list[dict[str, str]] = []
        self._current_item: dict[str, str] | None = None
        self._current_tag: str | None = None

    def handle_starttag(self, tag: str, attrs: list[tuple[str, str | None]]) -> None:
        if tag.lower() == "item":
            self._current_item = {}
            self._current_tag = None
            return
        if self._current_item is not None and tag.lower() in {"title", "link", "pubdate"}:
            self._current_tag = tag.lower()

    def handle_endtag(self, tag: str) -> None:
        if self._current_item is None:
            return
        if tag.lower() == "item":
            title = self._current_item.get("title", "").strip()
            if title and " " in title:
                project, version = title.rsplit(" ", 1)
                pub_date = self._current_item.get("pubdate", "").strip()
                link = self._current_item.get("link", "").strip()
                published_at = ""
                if pub_date:
                    try:
                        published_at = parsedate_to_datetime(pub_date).isoformat()
                    except (TypeError, ValueError):
                        published_at = ""
                self.items.append(
                    {
                        "project": project.strip(),
                        "version": version.strip(),
                        "published_at": published_at,
                        "link": link,
                        "cursor": pub_date or link or title,
                    }
                )
            self._current_item = None
            self._current_tag = None
            return
        if self._current_tag == tag.lower():
            self._current_tag = None

    def handle_data(self, data: str) -> None:
        if self._current_item is None or self._current_tag is None:
            return
        self._current_item[self._current_tag] = self._current_item.get(self._current_tag, "") + data


def project_json_url(project_name: str) -> str:
    return f"{PYPI_JSON_BASE}/{quote(project_name, safe='')}/json"


def fetch_project_json(project_name: str, timeout: int = 20) -> dict[str, Any]:
    request = Request(project_json_url(project_name), headers={"Accept": "application/json"})
    with urlopen(request, timeout=timeout) as response:
        return json.loads(response.read().decode("utf-8"))


def parse_updates_rss(xml_text: str) -> list[dict[str, str]]:
    parser = _PyPIUpdatesParser()
    parser.feed(xml_text)
    parser.close()
    return [
        {
            "project": unescape(item["project"]),
            "version": unescape(item["version"]),
            "published_at": item["published_at"],
            "link": unescape(item["link"]),
            "cursor": unescape(item["cursor"]),
        }
        for item in parser.items
    ]


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
