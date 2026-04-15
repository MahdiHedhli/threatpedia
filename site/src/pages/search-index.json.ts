import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';

export const GET: APIRoute = async () => {
  const incidents = await getCollection('incidents');
  const campaigns = await getCollection('campaigns');
  const actors = await getCollection('threat-actors');
  const zeroDays = await getCollection('zero-days');

  const index: Record<string, unknown>[] = [];

  for (const i of incidents) {
    index.push({
      type: 'incident',
      title: i.data.title,
      url: `/incidents/${i.id}/`,
      severity: i.data.severity,
      attackType: i.data.attackType,
      sector: i.data.sector,
      threatActor: i.data.threatActor,
      date: i.data.date.toISOString().slice(0, 10),
      tags: i.data.tags || [],
    });
  }

  for (const c of campaigns) {
    index.push({
      type: 'campaign',
      title: c.data.title,
      url: `/campaigns/${c.id}/`,
      severity: c.data.severity,
      attackType: c.data.attackType,
      sector: c.data.sector,
      threatActor: c.data.threatActor,
      ongoing: c.data.ongoing,
      startDate: c.data.startDate.toISOString().slice(0, 10),
      tags: c.data.tags || [],
    });
  }

  for (const a of actors) {
    index.push({
      type: 'threat-actor',
      name: a.data.name,
      url: `/threat-actors/${a.id}/`,
      aliases: a.data.aliases,
      affiliation: a.data.affiliation,
      motivation: a.data.motivation,
      tags: a.data.tags || [],
    });
  }

  for (const z of zeroDays) {
    index.push({
      type: 'zero-day',
      title: z.data.title,
      url: `/zero-days/${z.id}/`,
      cve: z.data.cve,
      platform: z.data.platform,
      severity: z.data.severity,
      tags: z.data.tags || [],
    });
  }

  return new Response(JSON.stringify(index), {
    headers: { 'Content-Type': 'application/json' },
  });
};
