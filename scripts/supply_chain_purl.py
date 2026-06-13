#!/usr/bin/env python3
"""Canonical PURL helpers for Threatpedia supply-chain data."""

from __future__ import annotations

from typing import NamedTuple
import re
from urllib.parse import quote, unquote


VALID_TYPES = {"generic", "golang", "npm", "pypi"}
ECOSYSTEM_TO_TYPE = {
    "generic": "generic",
    "go": "golang",
    "golang": "golang",
    "multiple": "generic",
    "npm": "npm",
    "pypi": "pypi",
}

PYPI_SEPARATOR_PATTERN = re.compile(r"[-_.]+")
GENERIC_SEPARATOR_PATTERN = re.compile(r"[^a-z0-9]+")
NPM_NAME_PATTERN = re.compile(r"^(?:@[a-z0-9][a-z0-9._~-]*/)?[a-z0-9][a-z0-9._~-]*$")


class PurlError(ValueError):
    """Raised when a package URL cannot be parsed or normalized."""


class ParsedPurl(NamedTuple):
    type: str
    name: str
    namespace: str | None = None
    version: str | None = None

    @property
    def package_name(self) -> str:
        if self.namespace:
            return f"{self.namespace}/{self.name}"
        return self.name


def purl_type_for_ecosystem(ecosystem: str | None) -> str | None:
    if not isinstance(ecosystem, str):
        return None
    return ECOSYSTEM_TO_TYPE.get(ecosystem.strip().lower())


def normalize_pypi_name(name: str) -> str:
    normalized = PYPI_SEPARATOR_PATTERN.sub("-", name.strip().lower()).strip("-")
    if not normalized:
        raise PurlError("empty PyPI package name")
    return normalized


def normalize_generic_name(name: str) -> str:
    normalized = GENERIC_SEPARATOR_PATTERN.sub("-", name.strip().lower()).strip("-")
    if not normalized:
        raise PurlError("empty generic package name")
    return normalized


def normalize_npm_name(name: str) -> tuple[str | None, str]:
    normalized = name.strip().lower()
    if normalized.startswith("%40"):
        normalized = "@" + normalized[3:]
    if not normalized or " " in normalized:
        raise PurlError("invalid npm package name")
    if normalized.startswith("@"):
        parts = normalized.split("/")
        if len(parts) != 2 or not parts[0][1:] or not parts[1]:
            raise PurlError("invalid scoped npm package name")
        candidate = f"{parts[0]}/{parts[1]}"
        if not NPM_NAME_PATTERN.fullmatch(candidate):
            raise PurlError("invalid scoped npm package name")
        return parts[0], parts[1]
    if "/" in normalized or not NPM_NAME_PATTERN.fullmatch(normalized):
        raise PurlError("invalid npm package name")
    return None, normalized


def normalize_go_module(name: str) -> str:
    normalized = name.strip()
    if not normalized or any(char.isspace() for char in normalized):
        raise PurlError("invalid Go module path")
    if normalized.startswith("/") or normalized.endswith("/") or "//" in normalized:
        raise PurlError("invalid Go module path")
    if "." not in normalized.split("/", 1)[0]:
        raise PurlError("Go module path must start with an import host")
    return normalized


def parse_purl(value: str) -> ParsedPurl:
    if not isinstance(value, str) or not value.startswith("pkg:") or any(char.isspace() for char in value):
        raise PurlError("expected package URL")
    if "?" in value or "#" in value:
        raise PurlError("qualifiers and subpaths are not supported in canonical corpus PURLs")

    body = value[4:]
    if "/" not in body:
        raise PurlError("package URL missing type or name")
    purl_type, path = body.split("/", 1)
    if not purl_type or purl_type != purl_type.lower() or purl_type not in VALID_TYPES:
        raise PurlError(f"unsupported PURL type {purl_type!r}")
    if not path:
        raise PurlError("package URL missing name")

    version = None
    if "@" in path:
        path, version = path.rsplit("@", 1)
        if not path or not version:
            raise PurlError("invalid package URL version")

    decoded_path = unquote(path)
    if purl_type == "npm":
        namespace, name = normalize_npm_name(decoded_path)
        return ParsedPurl(type=purl_type, namespace=namespace, name=name, version=version)
    if purl_type == "pypi":
        if "/" in decoded_path:
            raise PurlError("PyPI PURL must not include a namespace")
        return ParsedPurl(type=purl_type, name=normalize_pypi_name(decoded_path), version=version)
    if purl_type == "golang":
        return ParsedPurl(type=purl_type, name=normalize_go_module(decoded_path), version=version)
    if "/" in decoded_path:
        raise PurlError("generic PURL must not include a namespace")
    return ParsedPurl(type=purl_type, name=normalize_generic_name(decoded_path), version=version)


def emit_purl(parsed: ParsedPurl) -> str:
    if parsed.type == "npm":
        if parsed.namespace:
            package_path = f"{quote(parsed.namespace, safe='')}/{quote(parsed.name, safe='')}"
        else:
            package_path = quote(parsed.name, safe="")
    elif parsed.type in {"generic", "pypi"}:
        package_path = quote(parsed.name, safe="")
    elif parsed.type == "golang":
        package_path = quote(parsed.name, safe="/")
    else:
        raise PurlError(f"unsupported PURL type {parsed.type!r}")

    version = f"@{parsed.version}" if parsed.version else ""
    return f"pkg:{parsed.type}/{package_path}{version}"


def canonicalize_purl(value: str, *, ecosystem: str | None = None, package_name: str | None = None) -> str:
    parsed = parse_purl(value)
    expected_type = purl_type_for_ecosystem(ecosystem)
    if expected_type and parsed.type != expected_type:
        raise PurlError(f"PURL type {parsed.type!r} does not match ecosystem {ecosystem!r}")
    canonical = emit_purl(parsed)
    if package_name is not None:
        expected = purl_for_package(ecosystem or parsed.type, package_name, version=parsed.version)
        if canonical != expected:
            raise PurlError("PURL does not match package name and ecosystem")
    return canonical


def purl_for_package(ecosystem: str, name: str, *, version: str | None = None) -> str:
    if not isinstance(ecosystem, str):
        raise PurlError(f"unsupported package ecosystem {ecosystem!r}")
    if not isinstance(name, str):
        raise PurlError("package name must be a string")
    purl_type = purl_type_for_ecosystem(ecosystem)
    if purl_type is None:
        raise PurlError(f"unsupported package ecosystem {ecosystem!r}")
    if purl_type == "npm":
        namespace, package_name = normalize_npm_name(name)
        return emit_purl(ParsedPurl(type=purl_type, namespace=namespace, name=package_name, version=version))
    if purl_type == "pypi":
        return emit_purl(ParsedPurl(type=purl_type, name=normalize_pypi_name(name), version=version))
    if purl_type == "golang":
        return emit_purl(ParsedPurl(type=purl_type, name=normalize_go_module(name), version=version))
    return emit_purl(ParsedPurl(type=purl_type, name=normalize_generic_name(name), version=version))
