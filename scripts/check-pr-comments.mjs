#!/usr/bin/env node
/**
 * check-pr-comments.mjs — PR Comment Feedback Loop
 *
 * Checks the most recent open PR (or a specific PR) for review comments
 * from gemini-code-assist, collaborators, and bots. Reports unresolved
 * comments that need attention.
 *
 * Usage:
 *   node scripts/check-pr-comments.mjs                  # Check latest open PR
 *   node scripts/check-pr-comments.mjs --pr 37          # Check specific PR
 *   node scripts/check-pr-comments.mjs --watch           # Check at 2, 5, 10 min intervals
 *   node scripts/check-pr-comments.mjs --pr 37 --watch   # Watch specific PR
 *
 * Environment:
 *   Reads GITHUB_PAT from ../../.env.dmbot (relative to repo root)
 *   or from GITHUB_PAT environment variable.
 */

import { readFileSync, existsSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '..');

// ── Load PAT ───────────────────────────────────────────────────────────────
function loadPat() {
  // Try environment variable first
  if (process.env.GITHUB_PAT) return process.env.GITHUB_PAT;

  // Try .env.dmbot
  const envPath = resolve(ROOT, '..', '.env.dmbot');
  if (existsSync(envPath)) {
    const content = readFileSync(envPath, 'utf8');
    const match = content.match(/GITHUB_PAT=["']?([^\s"']+)/);
    if (match) return match[1];
  }

  return null;
}

const PAT = loadPat();
const REPO = 'MahdiHedhli/threatpedia';
const API = 'https://api.github.com';

// ── API helper ─────────────────────────────────────────────────────────────
async function ghApi(endpoint) {
  const headers = {
    'Accept': 'application/vnd.github+json',
    'User-Agent': 'threatpedia-pr-checker',
  };
  if (PAT) headers['Authorization'] = `token ${PAT}`;

  const res = await fetch(`${API}${endpoint}`, { headers });
  if (!res.ok) {
    const body = await res.text();
    throw new Error(`GitHub API ${res.status}: ${body.substring(0, 200)}`);
  }
  return res.json();
}

// ── CLI ────────────────────────────────────────────────────────────────────
function parseArgs() {
  const args = process.argv.slice(2);
  const parsed = { pr: null, watch: false };

  for (let i = 0; i < args.length; i++) {
    if (args[i] === '--pr' && args[i + 1]) parsed.pr = parseInt(args[++i], 10);
    if (args[i] === '--watch') parsed.watch = true;
  }

  return parsed;
}

// ── Find latest open PR ───────────────────────────────────────────────────
async function getLatestPr() {
  const prs = await ghApi(`/repos/${REPO}/pulls?state=open&sort=created&direction=desc&per_page=5`);
  if (prs.length === 0) return null;
  return prs[0];
}

// ── Get PR review comments ────────────────────────────────────────────────
async function getPrComments(prNumber) {
  // Review comments (inline on code)
  const reviewComments = await ghApi(`/repos/${REPO}/pulls/${prNumber}/comments?per_page=100`);
  // Issue comments (general PR discussion)
  const issueComments = await ghApi(`/repos/${REPO}/issues/${prNumber}/comments?per_page=100`);
  // PR reviews (approve/request changes)
  const reviews = await ghApi(`/repos/${REPO}/pulls/${prNumber}/reviews?per_page=100`);

  return { reviewComments, issueComments, reviews };
}

// ── Categorize and display ─────────────────────────────────────────────────
function categorizeComment(comment) {
  const author = comment.user?.login || 'unknown';

  if (author === 'gemini-code-assist[bot]' || author === 'gemini-code-assist') {
    return { source: 'gemini', priority: 'medium', icon: '🤖' };
  }
  if (author.includes('bot')) {
    return { source: 'bot', priority: 'low', icon: '⚙️' };
  }
  if (author === 'MahdiHedhli') {
    return { source: 'kernel-k', priority: 'high', icon: '👑' };
  }
  return { source: 'collaborator', priority: 'medium', icon: '👤' };
}

function extractSeverity(body) {
  if (body.includes('high-priority') || body.includes('critical')) return 'HIGH';
  if (body.includes('medium-priority') || body.includes('medium')) return 'MED';
  if (body.includes('low-priority') || body.includes('nit')) return 'LOW';
  return 'MED';
}

// ── Check a single PR ─────────────────────────────────────────────────────
async function checkPr(prNumber) {
  const pr = await ghApi(`/repos/${REPO}/pulls/${prNumber}`);
  const { reviewComments, issueComments, reviews } = await getPrComments(prNumber);

  const timestamp = new Date().toLocaleTimeString();

  console.log(`\n  ── PR #${prNumber}: ${pr.title} ──`);
  console.log(`  State: ${pr.state} | Mergeable: ${pr.mergeable ?? '?'} | Head: ${pr.head.sha.substring(0, 8)}`);
  console.log(`  Checked at: ${timestamp}\n`);

  let hasActionItems = false;

  // Review comments (inline code comments)
  if (reviewComments.length > 0) {
    const grouped = {};
    for (const c of reviewComments) {
      const cat = categorizeComment(c);
      const key = cat.source;
      if (!grouped[key]) grouped[key] = [];
      grouped[key].push({ ...c, cat });
    }

    for (const [source, comments] of Object.entries(grouped)) {
      console.log(`  ${comments[0].cat.icon} ${source.toUpperCase()} — ${comments.length} inline comment(s):`);
      for (const c of comments) {
        const severity = extractSeverity(c.body);
        const file = c.path ? `${c.path}:${c.line || c.original_line || '?'}` : '(general)';
        const preview = c.body
          .replace(/!\[.*?\]\(.*?\)/g, '') // strip image badges
          .replace(/```[\s\S]*?```/g, '[code]') // collapse code blocks
          .replace(/\n+/g, ' ')
          .trim()
          .substring(0, 120);
        console.log(`    [${severity}] ${file}`);
        console.log(`          ${preview}`);
      }
      console.log();
      hasActionItems = true;
    }
  }

  // Issue comments (general discussion)
  const nonBotIssueComments = issueComments.filter(c =>
    !c.user?.login?.includes('github-actions') &&
    c.user?.login !== 'github-merge-queue[bot]'
  );

  if (nonBotIssueComments.length > 0) {
    console.log(`  💬 DISCUSSION — ${nonBotIssueComments.length} comment(s):`);
    for (const c of nonBotIssueComments) {
      const cat = categorizeComment(c);
      const preview = c.body.replace(/\n+/g, ' ').trim().substring(0, 120);
      const age = timeSince(new Date(c.created_at));
      console.log(`    ${cat.icon} ${c.user.login} (${age} ago): ${preview}`);
    }
    console.log();
    hasActionItems = true;
  }

  // Reviews (approve / request changes)
  const actionableReviews = reviews.filter(r =>
    r.state === 'CHANGES_REQUESTED' || r.state === 'COMMENTED'
  );

  if (actionableReviews.length > 0) {
    console.log(`  📋 REVIEWS:`);
    for (const r of actionableReviews) {
      const cat = categorizeComment(r);
      const stateIcon = r.state === 'CHANGES_REQUESTED' ? '❌' : '💬';
      console.log(`    ${stateIcon} ${r.user.login}: ${r.state}`);
      if (r.body) {
        console.log(`       ${r.body.replace(/\n+/g, ' ').trim().substring(0, 120)}`);
      }
    }
    console.log();
    hasActionItems = true;
  }

  // Approved reviews
  const approved = reviews.filter(r => r.state === 'APPROVED');
  if (approved.length > 0) {
    console.log(`  ✅ APPROVED by: ${approved.map(r => r.user.login).join(', ')}`);
    console.log();
  }

  if (!hasActionItems) {
    console.log(`  ✅ No unresolved comments or review requests.\n`);
  }

  return { hasActionItems, commentCount: reviewComments.length + nonBotIssueComments.length };
}

// ── Watch mode ─────────────────────────────────────────────────────────────
async function watchPr(prNumber) {
  const intervals = [2, 5, 10]; // minutes

  console.log(`\n  Threatpedia PR Comment Watcher`);
  console.log(`  Monitoring PR #${prNumber} at ${intervals.join(', ')} minute intervals\n`);

  // Immediate check
  console.log(`  ── Check 1/4 (immediate) ──────────────────────────────`);
  await checkPr(prNumber);

  for (let i = 0; i < intervals.length; i++) {
    const mins = intervals[i];
    console.log(`  ⏳ Next check in ${mins} minute(s)...`);
    await sleep(mins * 60 * 1000);
    console.log(`  ── Check ${i + 2}/4 (${mins}min) ──────────────────────────────`);
    await checkPr(prNumber);
  }

  console.log(`  ── Watch complete ─────────────────────────────────────\n`);
}

// ── Helpers ────────────────────────────────────────────────────────────────
function sleep(ms) {
  return new Promise(r => setTimeout(r, ms));
}

function timeSince(date) {
  const seconds = Math.floor((new Date() - date) / 1000);
  if (seconds < 60) return `${seconds}s`;
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h`;
  return `${Math.floor(hours / 24)}d`;
}

// ── Main ───────────────────────────────────────────────────────────────────
async function main() {
  const opts = parseArgs();

  console.log(`\n  Threatpedia PR Comment Checker\n`);

  if (!PAT) {
    console.error('  ERROR: No GITHUB_PAT found. Set GITHUB_PAT env var or ensure ../.env.dmbot exists.');
    process.exit(1);
  }

  let prNumber = opts.pr;

  if (!prNumber) {
    const latest = await getLatestPr();
    if (!latest) {
      console.log('  No open PRs found.\n');
      return;
    }
    prNumber = latest.number;
    console.log(`  Auto-detected latest open PR: #${prNumber}\n`);
  }

  if (opts.watch) {
    await watchPr(prNumber);
  } else {
    await checkPr(prNumber);
  }
}

main().catch(err => {
  console.error(`\n  FATAL: ${err.message}\n`);
  process.exit(1);
});
