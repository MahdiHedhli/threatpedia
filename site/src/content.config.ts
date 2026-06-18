/**
 * Content collection definitions per DATA-STANDARDS v1.0.
 *
 * Four collections: incidents, campaigns, threat-actors, zero-days.
 * Each collection has a typed frontmatter schema that maps to the
 * corresponding manifest entry format from MANIFEST-SPEC v1.0.
 */
import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';
import {
  ALIAS_STATUSES,
  ATTRIBUTION_CLAIM_TYPES,
  CANONICAL_NAME_SOURCES,
  CLAIM_CONFIDENCE_VALUES,
  ENTITY_KINDS,
  OPERATING_MODELS,
  RELATIONSHIP_PREDICATES,
  RELATIONSHIP_TARGET_TYPES,
  getAdversaryProfileValidationIssues,
} from './lib/adversaryProfileValidation.mjs';

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

const adversaryEntityKind = z.enum(ENTITY_KINDS);

const adversaryOperatingModel = z.union([
  z.enum(OPERATING_MODELS),
  z.string().regex(/^x-[A-Za-z0-9][A-Za-z0-9_-]*$/),
]);

const claimConfidence = z.enum(CLAIM_CONFIDENCE_VALUES);

const canonicalNameSource = z.enum(CANONICAL_NAME_SOURCES);

const generatedBy = z.enum([
  'ai_ingestion',
  'dangermouse-bot',
  'incident-crosslink-gapfill',
  'kernel-k',
  'new-threat-intel',
  'new-threat-intel-automation',
  'penfold-bot',
  'zero-day-tracker',
]);

const generationMetadata = z.object({
  provider: z.string().min(1),
  model: z.string().min(1),
  tool: z.string().min(1).optional(),
  agent: generatedBy.optional(),
  lane: z.string().min(1).optional(),
  surface: z.string().min(1).optional(),
  promptProfile: z.string().min(1).optional(),
}).strict();

const mitreTactic = z.enum([
  'Reconnaissance',
  'Resource Development',
  'Initial Access',
  'Execution',
  'Persistence',
  'Privilege Escalation',
  'Stealth',
  'Defense Impairment',
  'Defense Evasion',
  'Credential Access',
  'Discovery',
  'Lateral Movement',
  'Collection',
  'Command and Control',
  'Exfiltration',
  'Impact',
  'Impair Process Control',
]);

const mappingConfidence = z.enum(['confirmed', 'probable', 'possible']);

/** Source citation schema per SOURCE-SPEC v1.0 */
const sourceSchema = z.object({
  id: z.string().min(1).optional(),
  url: z.string().url(),
  publisher: z.string(),
  publisherType: z.enum(['government', 'vendor', 'media', 'research', 'community']),
  reliability: sourceReliability,
  publicationDate: z.string(),  // Required — for living resources (MITRE ATT&CK, NVD), use last-modified or access date
  accessDate: z.string().optional(),
  archived: z.boolean().default(false),
  archiveUrl: z.string().url().optional(),
});

/** MITRE ATT&CK mapping schema */
const mitreMapping = z.object({
  techniqueId: z.string().regex(/^T\d{4}(?:\.\d{3})?$/),
  techniqueName: z.string(),
  tactic: mitreTactic.optional(),
  'attack-version': z.string().regex(/^v\d+(?:\.\d+)?$/).optional(),
  attackVersion: z.string().regex(/^v\d+(?:\.\d+)?$/).optional(),
  attack_version: z.string().regex(/^v\d+(?:\.\d+)?$/).optional(),
  confidence: mappingConfidence.optional(),
  evidence: z.string().min(1).optional(),
  notes: z.string().optional(),
});

/** MITRE ATLAS mapping schema */
const atlasMapping = z.object({
  techniqueId: z.string().regex(/^AML\.T\d{4}(?:\.\d{3})?$/),
  techniqueName: z.string(),
  tactic: z.string().optional(),
  'atlas-version': z.string().regex(/^\d+\.\d+\.\d+$/).optional(),
  atlasVersion: z.string().regex(/^\d+\.\d+\.\d+$/).optional(),
  atlas_version: z.string().regex(/^\d+\.\d+\.\d+$/).optional(),
  confidence: mappingConfidence.optional(),
  evidence: z.string().min(1).optional(),
  notes: z.string().optional(),
});

/** Generic framework mapping schema; ATLAS is the first supported framework. */
const frameworkMapping = z.object({
  framework: z.enum(['mitre-atlas']),
  version: z.string().regex(/^\d+\.\d+\.\d+$/).optional(),
  'mapping-id': z.string().regex(/^AML\.T\d{4}(?:\.\d{3})?$/),
  'mapping-name': z.string(),
  'tactic-id': z.string().optional(),
  'tactic-name': z.string().optional(),
  confidence: mappingConfidence.optional(),
  evidence: z.string().min(1).optional(),
  notes: z.string().optional(),
});

const adversaryVendorRef = z.object({
  vendor: z.string().min(1),
  name: z.string().min(1).nullable().optional(),
}).strict();

const adversaryAptId = z.string().regex(/^TP-APT-\d{4,}$/);

const adversaryExternalIds = z.object({
  mitreAttackGroup: z.string().regex(/^G\d{4}$/).nullable().optional(),
  mispGalaxyUuid: z.string().uuid().nullable().optional(),
  malpediaActor: z.string().min(1).nullable().optional(),
  etdaSlug: z.string().min(1).nullable().optional(),
  vendorRefs: z.array(adversaryVendorRef).default([]),
}).strict();

const adversaryClaimSourceRef = z.object({
  sourceId: z.string().min(1),
}).strict();

const adversaryAliasRecord = z.object({
  value: z.string().min(1),
  sourceOrg: z.string().min(1),
  sourceRef: z.string().min(1).nullable().optional(),
  status: z.enum(ALIAS_STATUSES),
  confidence: claimConfidence,
  notes: z.string().optional(),
}).strict();

const adversaryAttributionClaim = z.object({
  claimType: z.enum(ATTRIBUTION_CLAIM_TYPES),
  value: z.string().min(1),
  subOrg: z.string().min(1).optional(),
  confidence: claimConfidence,
  basis: z.array(z.string().min(1)).default([]),
  sources: z.array(adversaryClaimSourceRef).min(1),
  importedSourceConfidence: z.number().int().min(0).max(100).optional(),
}).strict();

const adversaryRelationshipExternalRefs = z.object({
  malpediaFamily: z.string().min(1).optional(),
  mitreSoftware: z.string().regex(/^S\d{4}$/).optional(),
}).catchall(z.string().min(1));

const adversaryRelationshipClaim = z.object({
  predicate: z.enum(RELATIONSHIP_PREDICATES),
  targetType: z.enum(RELATIONSHIP_TARGET_TYPES),
  targetId: z.string().min(1).nullable().optional(),
  unresolved: z.boolean().default(false),
  labelIfUnresolved: z.string().min(1).nullable().optional(),
  firstSeen: z.union([z.string().min(1), z.number()]).optional(),
  lastSeen: z.union([z.string().min(1), z.number()]).nullable().optional(),
  asOf: z.string().min(1).optional(),
  lastVerifiedAt: z.string().min(1).optional(),
  externalRefs: adversaryRelationshipExternalRefs.optional(),
  attackVersion: z.string().min(1).optional(),
  confidence: claimConfidence,
  sources: z.array(adversaryClaimSourceRef).min(1),
}).strict();

const adversaryRevision = z.object({
  actor: z.string().min(1),
  provider: z.string().min(1),
  model: z.string().min(1),
  action: z.string().min(1),
  ref: z.string().min(1),
  at: z.string().min(1),
}).strict();

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
    generatedBy: generatedBy,
    generatedDate: z.coerce.date(),
    generation: generationMetadata.optional(),

    // References
    cves: z.array(z.string()).default([]),
    relatedSlugs: z.array(z.string()).default([]),
    tags: z.array(z.string()).default([]),

    // Sources
    sources: z.array(sourceSchema).default([]),

    // MITRE
    mitreMappings: z.array(mitreMapping).default([]),
    atlasMappings: z.array(atlasMapping).default([]),
    'framework-mappings': z.array(frameworkMapping).default([]),
  }),
});

/**
 * Campaigns collection — ongoing multi-event operations or patterns.
 * Maps to campaigns/manifest.json entries.
 */
const campaigns = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/campaigns' }),
  schema: z.object({
    // Identity
    campaignId: z.string().regex(/^TP-CAMP-\d{4}-\d{4}$/),
    title: z.string(),
    startDate: z.coerce.date(),
    endDate: z.coerce.date().optional(),
    ongoing: z.boolean().default(false),

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
    generatedBy: generatedBy,
    generatedDate: z.coerce.date(),
    generation: generationMetadata.optional(),

    // References
    cves: z.array(z.string()).default([]),
    relatedIncidents: z.array(z.string()).default([]),
    tags: z.array(z.string()).default([]),

    // Sources
    sources: z.array(sourceSchema).min(3),

    // MITRE
    mitreMappings: z.array(mitreMapping).min(1),
    atlasMappings: z.array(atlasMapping).default([]),
    'framework-mappings': z.array(frameworkMapping).default([]),
  }).superRefine((data, ctx) => {
    if (data.ongoing && data.endDate) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['endDate'],
        message: 'Ongoing campaigns must not specify endDate.',
      });
    }

    if (!data.ongoing && !data.endDate) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['endDate'],
        message: 'Concluded campaigns must specify endDate.',
      });
    }

    if (data.endDate && data.endDate < data.startDate) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['endDate'],
        message: 'endDate must be on or after startDate.',
      });
    }

    if (!data.sources.some((source) => source.publisherType === 'government')) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['sources'],
        message: 'Campaigns require at least one government source.',
      });
    }
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
    logo: z.string().optional(),
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
    atlasMappings: z.array(atlasMapping).default([]),
    'framework-mappings': z.array(frameworkMapping).default([]),

    // Additive adversary-profile v0.5 fields. These stay optional for legacy
    // records until a reviewed migration makes them corpus-wide requirements.
    aptId: adversaryAptId.optional(),
    entityKind: adversaryEntityKind.optional(),
    isAnalyticConstruct: z.boolean().optional(),
    operatingModels: z.array(adversaryOperatingModel).default([]),
    externalIds: adversaryExternalIds.optional(),
    aliasRecords: z.array(adversaryAliasRecord).optional(),
    attributionClaims: z.array(adversaryAttributionClaim).optional(),
    relationshipClaims: z.array(adversaryRelationshipClaim).optional(),
    importedSourceConfidence: z.number().int().min(0).max(100).optional(),
    notPubliclyEstablished: z.boolean().optional(),
    canonicalNameSource: canonicalNameSource.optional(),
    canonicalNameSourceDetail: z.string().min(1).optional(),
    namingRationale: z.string().min(1).optional(),
    revisions: z.array(adversaryRevision).optional(),

    // Quality
    attributionConfidence: attributionConfidence.optional(),
    attributionRationale: z.string().max(500).optional(),
    reviewStatus: reviewStatus.default('draft_ai'),
    generatedBy: generatedBy.default('dangermouse-bot'),
    generatedDate: z.coerce.date().default(new Date()),
    generation: generationMetadata.optional(),

    tags: z.array(z.string()).default([]),

    // References
    sources: z.array(sourceSchema).default([]),
  }).superRefine((data, ctx) => {
    const { errors } = getAdversaryProfileValidationIssues(data);

    for (const error of errors) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: error.path,
        message: error.message,
      });
    }
  }),
});

/**
 * Zero-days / exploits collection.
 * Maps to zero-days/manifest.json entries.
 */
const zeroDays = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/zero-days' }),
  schema: z.object({
    exploitId: z.string().regex(/^TP-EXP-\d{4}-\d{4}$/).optional(),
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
    generatedBy: generatedBy.default('dangermouse-bot'),
    generatedDate: z.coerce.date().default(new Date()),
    generation: generationMetadata.optional(),

    // Relations
    relatedIncidents: z.array(z.string()).default([]),
    relatedActors: z.array(z.string()).default([]),
    tags: z.array(z.string()).default([]),

    // Sources
    sources: z.array(sourceSchema).default([]),

    // MITRE
    mitreMappings: z.array(mitreMapping).default([]),
    atlasMappings: z.array(atlasMapping).default([]),
    'framework-mappings': z.array(frameworkMapping).default([]),
  }),
});

export const collections = {
  incidents,
  campaigns,
  'threat-actors': threatActors,
  'zero-days': zeroDays,
};
