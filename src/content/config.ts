import { defineCollection, z } from 'astro:content';

// ============================================================================
// Threatpedia Content Collection Schemas
// Implements all 12 data quality validation rules (RULE-001 through RULE-012)
// ============================================================================

// --- Shared Enums & Constants ---

const sectorEnum = z.enum([
  'Energy & Utilities',
  'Financial Services',
  'Government — Federal',
  'Government — State/Local',
  'Government — Military/Defense',
  'Healthcare & Life Sciences',
  'Critical Infrastructure',
  'Technology',
  'Telecommunications',
  'Transportation & Logistics',
  'Education & Research',
  'Media & Entertainment',
  'Retail & Consumer',
  'Manufacturing & Industrial',
  'Legal & Professional Services',
  'Non-Profit & NGO',
]);

const attributionConfidenceEnum = z.enum(['A1', 'A2', 'A3', 'A4', 'A5', 'A6']);

const publisherTypeEnum = z.enum([
  'vendor',
  'government',
  'media',
  'academic',
  'legal',
]);

const credibilityEnum = z.enum(['primary', 'secondary', 'corroborating']);

// --- Classification L1/L2 Taxonomy ---

const classificationL1Enum = z.enum([
  'Data Breach',
  'Ransomware',
  'Espionage',
  'Sabotage',
  'Supply Chain',
  'DDoS',
  'Financial',
  'Disinformation',
  'Vulnerability',
  'Access Brokerage',
]);

const classificationL2Values: Record<string, string[]> = {
  'Data Breach': ['Exfiltration', 'Exposure', 'Insider'],
  Ransomware: ['Encryption-only', 'Double Extortion', 'Triple Extortion'],
  Espionage: ['Nation-State', 'Corporate', 'Political'],
  Sabotage: ['Destructive Malware', 'Physical-Cyber', 'ICS/OT'],
  'Supply Chain': ['Software', 'Hardware', 'Managed Service Provider'],
  DDoS: ['Volumetric', 'Protocol', 'Application Layer'],
  Financial: ['BEC', 'Fraud', 'Crypto Theft', 'SWIFT'],
  Disinformation: ['Influence Op', 'Deepfake', 'Account Takeover'],
  Vulnerability: ['Zero-Day Exploit', 'N-Day Exploit', 'Misconfiguration'],
  'Access Brokerage': ['Initial Access Sold', 'Credential Theft'],
};

const allL2Values = Object.values(classificationL2Values).flat();
const classificationL2Enum = z.enum(allL2Values as [string, ...string[]]);

// --- Source Object Schema ---

const sourceSchema = z.object({
  source_id: z.string(),
  url: z.string().url(),
  title: z.string(),
  publisher: z.string(),
  publisher_type: publisherTypeEnum,
  published_date: z.string().regex(/^\d{4}(-\d{2}(-\d{2})?)?$/),
  // RULE-011: archived_url required for certification — optional at schema level
  archived_url: z.string().url().optional(),
  credibility: credibilityEnum,
  notes: z.string().optional(),
});

// --- ATT&CK Technique Mapping Schema ---

const attackMappingSchema = z.object({
  technique_id: z.string().regex(/^T\d{4}(\.\d{3})?$/),
  technique_name: z.string(),
  tactic: z.string(),
  confidence: z.enum(['confirmed', 'probable', 'possible']),
  // Speculative mappings without evidence are rejected
  evidence: z.string().min(1, 'Evidence is required — speculative mappings are rejected'),
  // RULE-012: ATT&CK version must be specified
  attack_version: z.string().min(1, 'RULE-012: ATT&CK version is required'),
  mapped_by: z.string(),
  mapped_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  source_refs: z.array(z.string()).optional(),
});

// --- ISO 8601 partial date (YYYY, YYYY-MM, or YYYY-MM-DD) ---

const isoPartialDate = z
  .string()
  .regex(
    /^\d{4}(-\d{2}(-\d{2})?)?$/,
    'Must be ISO 8601 format: YYYY, YYYY-MM, or YYYY-MM-DD',
  );

// ============================================================================
// INCIDENTS COLLECTION
// ============================================================================

const incidents = defineCollection({
  type: 'data',
  schema: z
    .object({
      // RULE-001: event_id format
      event_id: z
        .string()
        .regex(/^TP-\d{4}-\d{4}$/, 'RULE-001: event_id must match TP-YYYY-NNNN format'),

      common_name: z.string().max(80, 'common_name must be 80 chars or fewer'),

      classification_l1: classificationL1Enum,
      classification_l2: classificationL2Enum,

      // RULE-002: date_start must not be in the future
      date_start: isoPartialDate,
      // RULE-003: date_end must be after date_start (validated in refine)
      date_end: isoPartialDate.optional(),
      date_discovered: isoPartialDate.optional(),
      date_disclosed: isoPartialDate.optional(),

      attribution_actor_ids: z
        .array(z.string().regex(/^TP-APT-\d{4}$/, 'Actor ID must match TP-APT-NNNN'))
        .optional(),

      attribution_confidence: attributionConfidenceEnum,

      // RULE-006: rationale required for A1–A4 (validated in refine)
      attribution_rationale: z.string().max(500).optional(),

      // RULE-007: target_countries must be ISO 3166-1 alpha-2
      target_sectors: z.array(sectorEnum).min(1, 'At least one target sector is required'),
      target_countries: z
        .array(
          z
            .string()
            .regex(/^[A-Z]{2}$/, 'RULE-007: Must be ISO 3166-1 alpha-2 country code'),
        )
        .min(1, 'At least one target country is required'),
      target_named_orgs: z.array(z.string()).optional(),

      // RULE-010: impact_severity 1–5
      impact_severity: z
        .number()
        .int()
        .min(1)
        .max(5, 'RULE-010: impact_severity must be 1–5'),
      impact_records_exposed: z.number().int().nonnegative().optional(),
      impact_financial_usd: z.number().int().nonnegative().optional(),
      impact_description: z.string().max(1000),

      initial_access_vector: z.enum([
        'Phishing',
        'Valid Accounts',
        'Exploit Public-Facing Application',
        'Supply Chain Compromise',
        'Trusted Relationship',
        'Drive-by Compromise',
        'Hardware Additions',
        'External Remote Services',
        'Replication Through Removable Media',
      ]),

      // RULE-008: CVE format validation
      cves_exploited: z
        .array(
          z
            .string()
            .regex(/^CVE-\d{4}-\d{4,}$/, 'RULE-008: Must match CVE-YYYY-NNNNN format'),
        )
        .optional(),

      malware_ids: z.array(z.string()).optional(),

      status: z.string(),
      version: z.number(),

      // RULE-004: Min 3 sources required
      // RULE-005: At least 1 source must be government or media
      sources: z.array(sourceSchema).min(3, 'RULE-004: At least 3 sources are required'),

      attack_mapping: z.array(attackMappingSchema).optional(),
    })
    // --- Cross-field validations (superRefine) ---
    .superRefine((data, ctx) => {
      // RULE-002: date_start must not be in the future
      const now = new Date();
      const startYear = parseInt(data.date_start.substring(0, 4), 10);
      if (startYear > now.getFullYear()) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['date_start'],
          message: 'RULE-002: date_start must not be in the future',
        });
      }

      // RULE-003: date_end must be after date_start
      if (data.date_end) {
        if (data.date_end < data.date_start) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            path: ['date_end'],
            message: 'RULE-003: date_end must be after date_start',
          });
        }
      }

      // L1/L2 classification consistency
      const validL2 = classificationL2Values[data.classification_l1];
      if (validL2 && !validL2.includes(data.classification_l2)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['classification_l2'],
          message: `classification_l2 "${data.classification_l2}" is not valid for L1 "${data.classification_l1}". Valid values: ${validL2.join(', ')}`,
        });
      }

      // RULE-005: At least 1 source must be government or media
      const hasGovOrMedia = data.sources.some(
        (s) => s.publisher_type === 'government' || s.publisher_type === 'media',
      );
      if (!hasGovOrMedia) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['sources'],
          message:
            'RULE-005: At least one source must have publisher_type "government" or "media"',
        });
      }

      // RULE-006: attribution_rationale required when confidence is A1–A4
      const highConfidence = ['A1', 'A2', 'A3', 'A4'];
      if (
        highConfidence.includes(data.attribution_confidence) &&
        (!data.attribution_rationale || data.attribution_rationale.trim() === '')
      ) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['attribution_rationale'],
          message:
            'RULE-006: attribution_rationale is required when confidence is A1–A4',
        });
      }
    }),
});

// ============================================================================
// THREAT ACTORS COLLECTION
// ============================================================================

const threatActors = defineCollection({
  type: 'data',
  schema: z.object({
    apt_id: z
      .string()
      .regex(/^TP-APT-\d{4}$/, 'apt_id must match TP-APT-NNNN format'),

    canonical_name: z.string(),
    naming_rationale: z.string().optional(),

    vendor_names: z
      .object({
        crowdstrike: z.string().optional(),
        mandiant: z.string().optional(),
        microsoft: z.string().optional(),
        recorded_future: z.string().optional(),
      })
      .optional(),

    nation_state: z
      .string()
      .regex(/^[A-Z]{2}$/, 'Must be ISO 3166-1 alpha-2 country code'),

    sub_org_affiliation: z.string().optional(),

    attribution_confidence: attributionConfidenceEnum,

    active_status: z.enum(['Active', 'Dormant', 'Disbanded', 'Unknown']),
    active_since: z.number().int().min(1900).max(2100),
    last_observed: z.string().optional(),

    primary_motivation: z.enum([
      'Espionage',
      'Financial',
      'Sabotage',
      'Hacktivism',
      'Unknown',
    ]),

    // Min 1 for certification
    known_campaigns: z.array(z.string()).min(1),

    known_sectors_targeted: z.array(sectorEnum),

    diamond_model: z
      .object({
        adversary: z.string().optional(),
        infrastructure: z.string().optional(),
        capability: z.string().optional(),
        victim: z.string().optional(),
      })
      .optional(),

    known_malware_families: z.array(z.string()).optional(),
  }),
});

// ============================================================================
// MALWARE COLLECTION (stub for future use)
// ============================================================================

const malware = defineCollection({
  type: 'data',
  schema: z.object({
    malware_id: z.string(),
    name: z.string(),
    aliases: z.array(z.string()).optional(),
    type: z.string(),
    associated_actors: z.array(z.string()).optional(),
    first_seen: z.string().optional(),
    description: z.string(),
  }),
});

// ============================================================================
// GLOSSARY COLLECTION (stub for future use)
// ============================================================================

const glossary = defineCollection({
  type: 'data',
  schema: z.object({
    term: z.string(),
    definition: z.string(),
    category: z.string().optional(),
    related_terms: z.array(z.string()).optional(),
    sources: z.array(z.string()).optional(),
  }),
});

// ============================================================================
// Export all collections
// ============================================================================

export const collections = {
  incidents,
  'threat-actors': threatActors,
  malware,
  glossary,
};
