CREATE TABLE IF NOT EXISTS supply_release_event (
  id BIGSERIAL PRIMARY KEY,
  ecosystem TEXT NOT NULL CHECK (ecosystem IN ('npm', 'pypi', 'go')),
  name TEXT NOT NULL,
  version TEXT NOT NULL,
  purl TEXT NOT NULL,
  published_at TIMESTAMPTZ NOT NULL,
  feed_name TEXT NOT NULL,
  feed_cursor TEXT NOT NULL,
  source_url TEXT NOT NULL,
  observed_facts JSONB NOT NULL,
  raw_registry_metadata JSONB NOT NULL,
  observed_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (ecosystem, name, version)
);

CREATE INDEX IF NOT EXISTS idx_supply_release_event_purl
  ON supply_release_event (purl);

CREATE INDEX IF NOT EXISTS idx_supply_release_event_published_at
  ON supply_release_event (published_at DESC);

CREATE TABLE IF NOT EXISTS supply_enrichment_observation (
  id BIGSERIAL PRIMARY KEY,
  release_event_id BIGINT REFERENCES supply_release_event(id) ON DELETE SET NULL,
  purl TEXT NOT NULL,
  ecosystem TEXT NOT NULL CHECK (ecosystem IN ('npm', 'pypi', 'go')),
  name TEXT NOT NULL,
  version TEXT NOT NULL,
  provider TEXT NOT NULL CHECK (provider IN ('osv', 'deps.dev', 'openssf-scorecard')),
  observation_kind TEXT NOT NULL,
  observed_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  raw_metadata JSONB NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('pending', 'complete', 'error'))
);

CREATE INDEX IF NOT EXISTS idx_supply_enrichment_observation_lookup
  ON supply_enrichment_observation (provider, purl, observed_at DESC);

CREATE TABLE IF NOT EXISTS supply_label_observation (
  id BIGSERIAL PRIMARY KEY,
  release_event_id BIGINT REFERENCES supply_release_event(id) ON DELETE SET NULL,
  purl TEXT NOT NULL,
  ecosystem TEXT NOT NULL CHECK (ecosystem IN ('npm', 'pypi', 'go')),
  name TEXT NOT NULL,
  version TEXT NOT NULL,
  provider TEXT NOT NULL,
  label_type TEXT NOT NULL,
  label TEXT NOT NULL,
  source_id TEXT,
  observed_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  raw_metadata JSONB NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_supply_label_observation_lookup
  ON supply_label_observation (provider, label_type, purl, observed_at DESC);

CREATE TABLE IF NOT EXISTS supply_feed_cursor (
  ecosystem TEXT NOT NULL CHECK (ecosystem IN ('npm', 'pypi', 'go')),
  feed_name TEXT NOT NULL,
  cursor_value TEXT NOT NULL,
  cursor_observed_at TIMESTAMPTZ,
  boundary JSONB NOT NULL DEFAULT '{}'::jsonb,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  PRIMARY KEY (ecosystem, feed_name)
);
