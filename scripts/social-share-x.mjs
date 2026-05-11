#!/usr/bin/env node
import crypto from 'node:crypto';
import { execFileSync } from 'node:child_process';
import { existsSync } from 'node:fs';
import { readFile, appendFile } from 'node:fs/promises';
import path from 'node:path';
import yaml from 'js-yaml';

const COLLECTIONS = new Map([
  ['incidents', { label: 'incident', route: 'incidents', titleField: 'title' }],
  ['campaigns', { label: 'campaign', route: 'campaigns', titleField: 'title' }],
  ['threat-actors', { label: 'threat actor profile', route: 'threat-actors', titleField: 'name' }],
  ['zero-days', { label: 'zero-day', route: 'zero-days', titleField: 'title' }],
]);

const DEFAULT_SITE_URL = 'https://threatpedia.wiki';
const DEFAULT_SHARE_STATUSES = new Set(['draft_ai', 'draft_human', 'under_review', 'certified']);
const DEFAULT_ENDPOINT = 'https://api.x.com/2/tweets';
const MAX_POST_LENGTH = 280;
const YAML_FRONTMATTER_PATTERN = /^---[ \t]*(?:\r?\n)([\s\S]*?)(?:\r?\n)---[ \t]*(?:\r?\n|$)/;
const REPO_ROOT = findRepoRoot();

function findRepoRoot() {
  let current = process.cwd();
  for (let depth = 0; depth < 6; depth += 1) {
    if (
      existsSync(path.join(current, 'site/src/content.config.ts')) &&
      existsSync(path.join(current, 'scripts/package.json'))
    ) {
      return current;
    }
    const parent = path.dirname(current);
    if (parent === current) break;
    current = parent;
  }
  return process.cwd();
}

function parseArgs(argv) {
  const args = {
    base: '',
    head: '',
    files: [],
    mode: process.env.X_SHARE_MODE || 'dry-run',
    siteUrl: process.env.SITE_URL || DEFAULT_SITE_URL,
    summary: process.env.GITHUB_STEP_SUMMARY || '',
    json: false,
  };

  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];
    const next = () => {
      i += 1;
      if (i >= argv.length) {
        throw new Error(`Missing value for ${arg}`);
      }
      return argv[i];
    };

    if (arg === '--base') args.base = next();
    else if (arg === '--head') args.head = next();
    else if (arg === '--files') args.files.push(...splitFiles(next()));
    else if (arg === '--file') args.files.push(next());
    else if (arg === '--mode') args.mode = next();
    else if (arg === '--site-url') args.siteUrl = next();
    else if (arg === '--summary') args.summary = next();
    else if (arg === '--json') args.json = true;
    else if (arg === '--help' || arg === '-h') {
      printHelp();
      process.exit(0);
    } else {
      throw new Error(`Unknown argument: ${arg}`);
    }
  }

  args.mode = args.mode || 'dry-run';
  if (!['dry-run', 'post'].includes(args.mode)) {
    throw new Error(`Unsupported --mode value: ${args.mode}`);
  }
  args.siteUrl = args.siteUrl.replace(/\/+$/, '');
  args.files = [...new Set(args.files.map(normalizeRepoPath).filter(Boolean))];
  return args;
}

function printHelp() {
  console.log(`Usage:
  node scripts/social-share-x.mjs --base <sha> --head <sha> [--mode dry-run|post]
  node scripts/social-share-x.mjs --files <path[,path...]> [--mode dry-run|post]

Options:
  --base       Base commit for detecting newly added content files.
  --head       Head commit for detecting newly added content files.
  --files      Explicit comma/newline-separated content files to process.
  --file       Explicit content file to process. May be repeated.
  --mode       dry-run (default) or post.
  --site-url   Public site URL. Defaults to ${DEFAULT_SITE_URL}.
  --summary    Markdown summary output path. Defaults to GITHUB_STEP_SUMMARY.
  --json       Print JSON output.
`);
}

function splitFiles(value) {
  return value
    .split(/[\n,]/)
    .map((file) => file.trim())
    .filter(Boolean);
}

function normalizeRepoPath(file) {
  const normalized = file.replace(/\\/g, '/').replace(/^\.\//, '');
  if (!path.isAbsolute(normalized)) return normalized;
  return path.relative(REPO_ROOT, normalized).replace(/\\/g, '/');
}

function getAddedContentFiles(base, head) {
  if (!base || !head) {
    throw new Error('Either --files or both --base and --head are required.');
  }

  const output = execFileSync(
    'git',
    [
      'diff',
      '--name-only',
      '--diff-filter=A',
      base,
      head,
      '--',
      'site/src/content/**/*.md',
      'site/src/content/**/*.mdx',
    ],
    { encoding: 'utf8', cwd: REPO_ROOT },
  );

  return output
    .split('\n')
    .map((file) => file.trim())
    .filter(Boolean)
    .map(normalizeRepoPath);
}

function parseContentPath(file) {
  const match = file.match(/^site\/src\/content\/([^/]+)\/(.+)\.mdx?$/);
  if (!match) return null;

  const [, collection, slug] = match;
  const config = COLLECTIONS.get(collection);
  if (!config) return null;

  return { collection, slug, ...config };
}

async function readFrontmatter(file) {
  const content = await readFile(path.join(REPO_ROOT, file), 'utf8');
  const match = content.match(YAML_FRONTMATTER_PATTERN);
  if (!match) {
    throw new Error(`${file} is missing valid YAML frontmatter delimiters.`);
  }

  return yaml.load(match[1]) || {};
}

function allowedStatuses() {
  const configured = process.env.X_SHARE_REVIEW_STATUSES;
  if (!configured) return DEFAULT_SHARE_STATUSES;
  return new Set(configured.split(',').map((status) => status.trim()).filter(Boolean));
}

function makeArticleUrl(siteUrl, route, slug) {
  const encodedSlug = slug
    .split('/')
    .map((part) => encodeURIComponent(part))
    .join('/');
  return `${siteUrl}/${route}/${encodedSlug}/`;
}

function truncateText(value, limit) {
  const text = String(value || '');
  if (limit <= 0) return '';
  if (text.length <= limit) return text;
  if (limit <= 3) return text.slice(0, limit);
  return `${text.slice(0, limit - 3).trimEnd()}...`;
}

function buildPostText(article) {
  const prefix = `New Threatpedia ${article.label}: `;
  const suffixes = [
    `\n${article.url}\n#Threatpedia #Cybersecurity`,
    `\n${article.url}`,
  ];

  for (const suffix of suffixes) {
    const remaining = MAX_POST_LENGTH - prefix.length - suffix.length;
    if (remaining <= 0) continue;
    const title = truncateText(article.title, remaining);
    return `${prefix}${title}${suffix}`;
  }

  throw new Error(`Cannot build an X post within ${MAX_POST_LENGTH} characters for ${article.url}`);
}

async function buildDraft(file, siteUrl, statuses) {
  const parsed = parseContentPath(file);
  if (!parsed) {
    return { file, skipped: true, reason: 'not a supported content collection path' };
  }

  const data = await readFrontmatter(file);
  const reviewStatus = String(data.reviewStatus || 'draft_ai');
  if (!statuses.has(reviewStatus)) {
    return { file, skipped: true, reason: `reviewStatus ${reviewStatus} is not shareable` };
  }

  const title = String(data[parsed.titleField] || data.title || data.name || parsed.slug).trim();
  const url = makeArticleUrl(siteUrl, parsed.route, parsed.slug);
  const article = {
    file,
    collection: parsed.collection,
    label: parsed.label,
    slug: parsed.slug,
    title,
    reviewStatus,
    url,
  };

  return {
    ...article,
    text: buildPostText(article),
  };
}

function oauthPercent(value) {
  return encodeURIComponent(value)
    .replace(/[!'()*]/g, (char) => `%${char.charCodeAt(0).toString(16).toUpperCase()}`);
}

function buildOAuth1Header(method, endpoint) {
  const consumerKey = process.env.X_API_KEY || '';
  const consumerSecret = process.env.X_API_SECRET || '';
  const token = process.env.X_ACCESS_TOKEN || '';
  const tokenSecret = process.env.X_ACCESS_TOKEN_SECRET || '';

  if (!consumerKey || !consumerSecret || !token || !tokenSecret) {
    return '';
  }

  const oauth = {
    oauth_consumer_key: consumerKey,
    oauth_nonce: crypto.randomBytes(16).toString('hex'),
    oauth_signature_method: 'HMAC-SHA1',
    oauth_timestamp: Math.floor(Date.now() / 1000).toString(),
    oauth_token: token,
    oauth_version: '1.0',
  };

  const parameterString = Object.entries(oauth)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([key, value]) => `${oauthPercent(key)}=${oauthPercent(value)}`)
    .join('&');

  const signatureBase = [
    method.toUpperCase(),
    oauthPercent(endpoint),
    oauthPercent(parameterString),
  ].join('&');
  const signingKey = `${oauthPercent(consumerSecret)}&${oauthPercent(tokenSecret)}`;
  const signature = crypto.createHmac('sha1', signingKey).update(signatureBase).digest('base64');

  return `OAuth ${Object.entries({ ...oauth, oauth_signature: signature })
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([key, value]) => `${oauthPercent(key)}="${oauthPercent(value)}"`)
    .join(', ')}`;
}

function authHeader(endpoint) {
  if (process.env.X_USER_ACCESS_TOKEN) {
    return `Bearer ${process.env.X_USER_ACCESS_TOKEN}`;
  }

  const oauth1Header = buildOAuth1Header('POST', endpoint);
  if (oauth1Header) return oauth1Header;

  throw new Error(
    'Live posting requires X_USER_ACCESS_TOKEN or OAuth 1.0a credentials: X_API_KEY, X_API_SECRET, X_ACCESS_TOKEN, X_ACCESS_TOKEN_SECRET.',
  );
}

function assertPostingAllowed(count) {
  if (process.env.X_POSTING_ENABLED !== 'true') {
    throw new Error('Refusing to post: X_POSTING_ENABLED must be exactly "true".');
  }

  const runAttempt = Number(process.env.GITHUB_RUN_ATTEMPT || '1');
  if (runAttempt > 1 && process.env.X_ALLOW_RERUN_POSTS !== 'true') {
    throw new Error('Refusing to post on a rerun. Set X_ALLOW_RERUN_POSTS=true only after checking duplicate-post risk.');
  }

  const maxPosts = Number(process.env.X_SHARE_MAX_POSTS || '10');
  if (Number.isFinite(maxPosts) && count > maxPosts) {
    throw new Error(`Refusing to post ${count} articles; X_SHARE_MAX_POSTS is ${maxPosts}.`);
  }
}

async function postToX(draft) {
  const endpoint = process.env.X_POST_ENDPOINT || DEFAULT_ENDPOINT;
  const response = await fetch(endpoint, {
    method: 'POST',
    headers: {
      Authorization: authHeader(endpoint),
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ text: draft.text }),
  });

  const responseText = await response.text();
  let payload;
  try {
    payload = responseText ? JSON.parse(responseText) : {};
  } catch {
    payload = { raw: responseText };
  }

  if (!response.ok) {
    throw new Error(`X API post failed for ${draft.file}: HTTP ${response.status} ${JSON.stringify(payload)}`);
  }

  return payload;
}

function markdownSummary(result) {
  const lines = [
    '## X Article Sharing',
    '',
    `- Mode: \`${result.mode}\``,
    `- New content files: \`${result.files.length}\``,
    `- Share drafts: \`${result.drafts.length}\``,
    `- Skipped: \`${result.skipped.length}\``,
    '',
  ];

  if (result.drafts.length) {
    lines.push('### Drafts', '');
    for (const draft of result.drafts) {
      const status = draft.posted ? `posted: ${draft.postId}` : 'not posted';
      lines.push(`- \`${draft.file}\` - ${status}`);
      lines.push('');
      lines.push('```text');
      lines.push(draft.text);
      lines.push('```');
      lines.push('');
    }
  }

  if (result.skipped.length) {
    lines.push('### Skipped', '');
    for (const skipped of result.skipped) {
      lines.push(`- \`${skipped.file}\`: ${skipped.reason}`);
    }
    lines.push('');
  }

  return lines.join('\n');
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  const statuses = allowedStatuses();
  const files = args.files.length ? args.files : getAddedContentFiles(args.base, args.head);
  const draftResults = await Promise.all(files.map((file) => buildDraft(file, args.siteUrl, statuses)));
  const skipped = draftResults.filter((result) => result.skipped);
  const drafts = draftResults.filter((result) => !result.skipped);

  if (args.mode === 'post' && drafts.length) {
    assertPostingAllowed(drafts.length);
    for (const draft of drafts) {
      const response = await postToX(draft);
      draft.posted = true;
      draft.postResponse = response;
      draft.postId = response?.data?.id || 'unknown';
    }
  }

  const result = {
    mode: args.mode,
    base: args.base,
    head: args.head,
    files,
    drafts,
    skipped,
  };

  if (args.summary) {
    await appendFile(args.summary, `${markdownSummary(result)}\n`);
  }

  if (args.json || !args.summary) {
    console.log(JSON.stringify(result, null, 2));
  } else {
    console.log(`Prepared ${drafts.length} X share draft(s); skipped ${skipped.length}.`);
  }
}

main().catch((error) => {
  console.error(error.message);
  process.exit(1);
});
