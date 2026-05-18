export interface GeoPoint {
  label: string;
  lat: number;
  lon: number;
  kind: 'country' | 'region' | 'global' | 'unknown';
}

type GeoCandidate = GeoPoint & {
  patterns: RegExp[];
};

const GEO_CANDIDATES: GeoCandidate[] = [
  candidate('United States', 39.8, -98.6, 'country', /\bunited states\b/i, /\bu\.s\.\b/i, /\bus\b/i, /\busa\b/i),
  candidate('United Kingdom', 55.4, -3.4, 'country', /\bunited kingdom\b/i, /\buk\b/i, /\bbritain\b/i),
  candidate('European Union', 50.8, 10.4, 'region', /\beuropean union\b/i, /\beu\b/i),
  candidate('Europe', 51.0, 10.0, 'region', /\beurope\b/i),
  candidate('Middle East', 29.3, 43.7, 'region', /\bmiddle east\b/i),
  candidate('Southeast Asia', 8.6, 106.6, 'region', /\bsoutheast asia\b/i, /\bsouth-east asia\b/i),
  candidate('North America', 47.1, -101.9, 'region', /\bnorth america\b/i),
  candidate('South America', -14.2, -58.0, 'region', /\bsouth america\b/i),
  candidate('Africa', 1.7, 20.5, 'region', /\bafrica\b/i),
  candidate('Asia', 34.0, 100.0, 'region', /\basia\b/i),
  candidate('Ukraine', 49.0, 31.4, 'country', /\bukraine\b/i),
  candidate('Russia', 61.5, 90.0, 'country', /\brussia\b/i),
  candidate('China', 35.9, 104.2, 'country', /\bchina\b/i),
  candidate('Iran', 32.4, 53.7, 'country', /\biran\b/i),
  candidate('Israel', 31.0, 35.0, 'country', /\bisrael\b/i),
  candidate('Saudi Arabia', 23.9, 45.1, 'country', /\bsaudi arabia\b/i),
  candidate('Qatar', 25.3, 51.2, 'country', /\bqatar\b/i),
  candidate('Netherlands', 52.1, 5.3, 'country', /\bnetherlands\b/i, /\bdutch\b/i),
  candidate('Germany', 51.2, 10.4, 'country', /\bgermany\b/i),
  candidate('France', 46.2, 2.2, 'country', /\bfrance\b/i, /\bfrench\b/i),
  candidate('Italy', 41.9, 12.6, 'country', /\bitaly\b/i, /\bitalian\b/i),
  candidate('Spain', 40.5, -3.7, 'country', /\bspain\b/i),
  candidate('Canada', 56.1, -106.3, 'country', /\bcanada\b/i),
  candidate('Australia', -25.3, 133.8, 'country', /\baustralia\b/i),
  candidate('Japan', 36.2, 138.3, 'country', /\bjapan\b/i),
  candidate('South Korea', 36.5, 127.8, 'country', /\bsouth korea\b/i),
  candidate('North Korea', 40.3, 127.5, 'country', /\bnorth korea\b/i, /\bdprk\b/i),
  candidate('India', 20.6, 78.9, 'country', /\bindia\b/i),
  candidate('Bangladesh', 23.7, 90.4, 'country', /\bbangladesh\b/i),
  candidate('Estonia', 58.6, 25.0, 'country', /\bestonia\b/i),
  candidate('Brazil', -14.2, -51.9, 'country', /\bbrazil\b/i),
  candidate('Vietnam', 14.1, 108.3, 'country', /\bvietnam\b/i),
  candidate('Philippines', 12.9, 121.8, 'country', /\bphilippines\b/i),
  candidate('Taiwan', 23.7, 121.0, 'country', /\btaiwan\b/i),
  candidate('Singapore', 1.35, 103.8, 'country', /\bsingapore\b/i),
  candidate('United Arab Emirates', 24.0, 54.0, 'country', /\bunited arab emirates\b/i, /\buae\b/i),
  candidate('Turkey', 39.0, 35.2, 'country', /\bturkey\b/i),
  candidate('Global', 18.0, 12.0, 'global', /\bglobal\b/i, /\bworldwide\b/i, /\binternational\b/i, /\bmultiple\b/i),
];

function candidate(
  label: string,
  lat: number,
  lon: number,
  kind: GeoPoint['kind'],
  ...patterns: RegExp[]
): GeoCandidate {
  return { label, lat, lon, kind, patterns };
}

export function resolveGeoPoints(rawGeography?: string): GeoPoint[] {
  const geography = (rawGeography || '').trim();
  if (!geography) {
    return [unknownPoint()];
  }

  const matches: GeoPoint[] = [];
  const seen = new Set<string>();

  for (const item of GEO_CANDIDATES) {
    if (item.patterns.some((pattern) => pattern.test(geography))) {
      const key = item.label.toLowerCase();
      if (!seen.has(key)) {
        seen.add(key);
        matches.push(stripPatterns(item));
      }
    }
  }

  if (matches.length === 0) {
    return [unknownPoint(geography)];
  }

  const specificMatches = matches.filter((point) => point.kind !== 'global');
  return specificMatches.length > 0 ? specificMatches.slice(0, 3) : [matches[0]];
}

export function summarizeGeo(points: GeoPoint[], rawGeography?: string): string {
  if (points.length === 0) return rawGeography || 'Unknown';
  if (points.length === 1) {
    return points[0].kind === 'unknown' ? rawGeography || 'Unknown' : points[0].label;
  }
  return points.map((point) => point.label).join(' + ');
}

function stripPatterns(item: GeoCandidate): GeoPoint {
  return {
    label: item.label,
    lat: item.lat,
    lon: item.lon,
    kind: item.kind,
  };
}

function unknownPoint(label = 'Unknown'): GeoPoint {
  return { label, lat: 18.0, lon: 12.0, kind: 'unknown' };
}
