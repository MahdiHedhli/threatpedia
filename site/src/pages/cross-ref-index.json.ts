/**
 * Cross-Reference Index — Build-Time Reverse Index
 *
 * Generates a JSON index mapping entities (CVEs, threat actors, campaigns,
 * zero-days, MITRE techniques) to the articles that reference them.
 *
 * Three tiers:
 *   Tier 1 — Pattern-matchable (CVEs, MITRE techniques): external + internal links
 *   Tier 2 — Cross-collection entities (actors, campaigns): primary page + related
 *   Tier 3 — Glossary terms: definition + glossary link (handled client-side)
 *
 * Output consumed by Base.astro tooltip enhancement script.
 */
import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';

interface ArticleRef {
  title: string;
  url: string;
  type: 'incident' | 'campaign' | 'threat-actor' | 'zero-day';
}

interface CrossRefEntry {
  tier: 1 | 2;
  type: 'cve' | 'mitre' | 'threat-actor' | 'campaign';
  /** External URL (NVD for CVEs, ATT&CK for MITRE) */
  external?: string;
  /** Primary internal article URL (for Tier 2 entities) */
  primary?: string;
  /** Other articles that reference this entity */
  articles: ArticleRef[];
  /** Display label */
  label: string;
}

export const GET: APIRoute = async () => {
  const incidents = await getCollection('incidents');
  const campaigns = await getCollection('campaigns');
  const actors = await getCollection('threat-actors');
  const zeroDays = await getCollection('zero-days');

  const index: Record<string, CrossRefEntry> = {};

  // ── Helper: ensure entry exists ────────────────────────────────────────
  const ensure = (
    key: string,
    tier: 1 | 2,
    type: CrossRefEntry['type'],
    label: string,
    external?: string,
    primary?: string,
  ): CrossRefEntry => {
    const k = key.toLowerCase();
    if (!index[k]) {
      index[k] = { tier, type, label, articles: [], external, primary };
    }
    // Update primary/external if provided and not already set
    if (external && !index[k].external) index[k].external = external;
    if (primary && !index[k].primary) index[k].primary = primary;
    return index[k];
  };

  // ── Helper: add article ref (deduplicated) ─────────────────────────────
  const addRef = (key: string, ref: ArticleRef) => {
    const k = key.toLowerCase();
    const entry = index[k];
    if (!entry) return;
    // Don't add if this URL is the primary page or already listed
    if (entry.primary === ref.url) return;
    if (entry.articles.some(a => a.url === ref.url)) return;
    entry.articles.push(ref);
  };

  // ── Helper: generate external URLs ─────────────────────────────────────
  const cveUrl = (cve: string) => `https://nvd.nist.gov/vuln/detail/${cve}`;
  const mitreUrl = (tid: string) => {
    // T1566.004 → /techniques/T1566/004/
    const parts = tid.replace(/^T/, '').split('.');
    return `https://attack.mitre.org/techniques/T${parts[0]}/${parts.length > 1 ? parts[1] + '/' : ''}`;
  };

  // ══════════════════════════════════════════════════════════════════════════
  // TIER 2: Cross-collection entities — register primary pages
  // ══════════════════════════════════════════════════════════════════════════

  // Threat actors: name + aliases all point to same entry
  for (const a of actors) {
    const url = `/threat-actors/${a.id}/`;
    const name = a.data.name;
    ensure(name, 2, 'threat-actor', name, undefined, url);
    for (const alias of a.data.aliases || []) {
      ensure(alias, 2, 'threat-actor', alias, undefined, url);
    }
  }

  // Campaigns: register by title and threatActor reference
  for (const c of campaigns) {
    const url = `/campaigns/${c.id}/`;
    const title = c.data.title;
    // Use a short label derived from title (before the colon if present)
    const shortLabel = title.includes(':') ? title.split(':')[0].trim() : title;
    ensure(shortLabel, 2, 'campaign', shortLabel, undefined, url);
  }

  // ══════════════════════════════════════════════════════════════════════════
  // TIER 1: Pattern-matchable entities — CVEs and MITRE techniques
  // ══════════════════════════════════════════════════════════════════════════

  // Collect all CVEs from all collections
  const allArticles: { data: any; url: string; type: ArticleRef['type'] }[] = [
    ...incidents.map(i => ({ data: i.data, url: `/incidents/${i.id}/`, type: 'incident' as const })),
    ...campaigns.map(c => ({ data: c.data, url: `/campaigns/${c.id}/`, type: 'campaign' as const })),
    ...zeroDays.map(z => ({ data: z.data, url: `/zero-days/${z.id}/`, type: 'zero-day' as const })),
  ];

  // Register CVEs
  for (const art of allArticles) {
    const cves: string[] = art.data.cves || (art.data.cve ? [art.data.cve] : []);
    for (const cve of cves) {
      ensure(cve, 1, 'cve', cve, cveUrl(cve));
      addRef(cve, { title: art.data.title, url: art.url, type: art.type });
    }
  }

  // Register MITRE techniques from all collections
  const allWithMitre = [
    ...incidents.map(i => ({ data: i.data, url: `/incidents/${i.id}/`, type: 'incident' as const })),
    ...campaigns.map(c => ({ data: c.data, url: `/campaigns/${c.id}/`, type: 'campaign' as const })),
    ...actors.map(a => ({ data: a.data, url: `/threat-actors/${a.id}/`, type: 'threat-actor' as const, title: a.data.name })),
    ...zeroDays.map(z => ({ data: z.data, url: `/zero-days/${z.id}/`, type: 'zero-day' as const })),
  ];

  for (const art of allWithMitre) {
    const mappings = art.data.mitreMappings || [];
    for (const m of mappings) {
      const tid = m.techniqueId;
      const label = `${tid} — ${m.techniqueName}`;
      ensure(tid, 1, 'mitre', label, mitreUrl(tid));
      addRef(tid, {
        title: (art as any).title || art.data.title || art.data.name,
        url: art.url,
        type: art.type,
      });
    }
  }

  // ══════════════════════════════════════════════════════════════════════════
  // Cross-reference: link threat actors to articles that mention them
  // ══════════════════════════════════════════════════════════════════════════

  for (const i of incidents) {
    const actorName = i.data.threatActor;
    if (actorName && actorName !== 'Unknown') {
      const k = actorName.toLowerCase();
      if (index[k]) {
        addRef(actorName, {
          title: i.data.title,
          url: `/incidents/${i.id}/`,
          type: 'incident',
        });
      }
    }
  }

  for (const c of campaigns) {
    const actorName = c.data.threatActor;
    if (actorName && actorName !== 'Unknown') {
      const k = actorName.toLowerCase();
      if (index[k]) {
        addRef(actorName, {
          title: c.data.title,
          url: `/campaigns/${c.id}/`,
          type: 'campaign',
        });
      }
    }
  }

  return new Response(JSON.stringify(index), {
    headers: { 'Content-Type': 'application/json' },
  });
};
