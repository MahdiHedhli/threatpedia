/**
 * Content collection definitions per DATA-STANDARDS v1.0.
 *
 * Three collections: incidents, threat-actors, zero-days.
 * Each collection has a typed frontmatter schema that maps to the
 * corresponding manifest entry format from MANIFEST-SPEC v1.0.
 */
import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

/** Shared enums */
const reviewStatus = z.enum([
  'draft_ai',
  'draft_human',
  'under_review',
  'certified',
  'disputed',
  'deprecated',
]);

const severity = z.enum(['critical', 'high', 'medium', 'low']);

const confidenceGrade = z.enum(['A', 'B', 'C', 'D', 'F']);

const attributionConfidence = z.enum(['A1', 'A2', 'A3', 'A4', 'A5', 'A6']);

const sourceReliability = z.enum(['R1', 'R2', 'R3', 'R4']);

/** Source citation schema per SOURCE-SPEC v1.0 */
const sourceSchema = z.object({
  url: z.string().url(),
  publisher: z.string(),
  publisherType: z.enum(['government', 'vendor', 'media', 'research', 'community']),
  reliability: sourceReliability,
  publicationDate: z.string().optional(),
  accessDate: z.string().optional(),
  archived: z.boolean().default(false),
  archiveUrl: z.string().url().optional(),
});

/** MITRE ATT&CK mapping schema */
const mitreMapping = z.object({
  techniqueId: z.string(),
  techniqueName: z.string(),
  tactic: z.string().optional(),
  notes: z.string().optional(),
});

/**
 * Incidents collection — bounded cybersecurity events.
 * Maps to incidents/manifest.json entries.
 */
const incidents = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/incidents' }),
  schema: z.object({
    // Identity
    eventId: z.string().regex(/^TP-\d{4}-\d{4}$/),
    title: z.string(),
    date: z.coerce.date(),

    // Classification
    attackType: z.string(),
    severity: severity,
    sector: z.string(),
    geography: z.string(),

    // Attribution
    threatActor: z.string().default('Unknown'),
    attributionConfidence: attributionConfidence.default('A4'),

    // Quality
    reviewStatus: reviewStatus,
    confidenceGrade: confidenceGrade.default('C'),
    generatedBy: z.string(),
    generatedDate: z.coerce.date(),

    // References
    cves: z.array(z.string()).default([]),
    relatedSlugs: z.array(z.string()).default([]),
    tags: z.array(z.string()).default([]),

    // Sources
    sources: z.array(sourceSchema).default([]),

    // MITRE
    mitreMappings: z.array(mitreMapping).default([]),
  }),
});

/**
 * Threat actors collection — entity profiles.
 * Maps to threat-actor-index.json canonical entries.
 */
const threatActors = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/threat-actors' }),
  schema: z.object({
    name: z.string(),
    aliases: z.array(z.string()).default([]),
    affiliation: z.string().default('Unknown'),
    motivation: z.string().default('Unknown'),
    status: z.enum(['active', 'inactive', 'unknown']).default('unknown'),

    // Extended fields per DATA-STANDARDS v1.0
    country: z.string().optional(),
    firstSeen: z.string().optional(),
    lastSeen: z.string().optional(),
    targetSectors: z.array(z.string()).default([]),
    targetGeographies: z.array(z.string()).default([]),
    tools: z.array(z.string()).default([]),
    mitreMappings: z.array(mitreMapping).default([]),

    // Quality
    reviewStatus: reviewStatus.default('draft_ai'),
    generatedBy: z.string().default('dangermouse-bot'),
    generatedDate: z.coerce.date().default(new Date()),

    tags: z.array(z.string()).default([]),
  }),
});

/**
 * Zero-days / exploits collection.
 * Maps to zero-days/manifest.json entries.
 */
const zeroDays = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/zero-days' }),
  schema: z.object({
    exploitId: z.string().regex(/^TP-EXP-\d{4}$/).optional(),
    title: z.string(),
    cve: z.string(),
    type: z.string(),
    platform: z.string(),
    severity: severity,
    status: z.enum(['active', 'patched', 'mitigated', 'unknown']).default('unknown'),
    isZeroDay: z.boolean().default(true),
    disclosedDate: z.coerce.date().optional(),
    patchDate: z.coerce.date().optional(),
    researcher: z.string().optional(),
    confirmedBy: z.string().optional(),
    daysInTheWild: z.number().nullable().optional(),
    cisaKev: z.boolean().default(false),

    // Quality
    reviewStatus: reviewStatus.default('draft_ai'),
    generatedBy: z.string().default('dangermouse-bot'),
    generatedDate: z.coerce.date().default(new Date()),

    // Relations
    relatedIncidents: z.array(z.string()).default([]),
    relatedActors: z.array(z.string()).default([]),
    tags: z.array(z.string()).default([]),
  }),
});

export const collections = {
  incidents,
  'threat-actors': threatActors,
  'zero-days': zeroDays,
};
