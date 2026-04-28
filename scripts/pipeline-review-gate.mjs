#!/usr/bin/env node
/**
 * pipeline-review-gate.mjs
 *
 * Fails content/pipeline PRs that are structurally green but not publication
 * ready. This intentionally checks live GitHub state rather than worker
 * status comments, because worker comments can become stale after a push,
 * rebase, or failed AI review attempt.
 */

const DEFAULT_AI_REVIEW_LOGINS = ['gemini-code-assist', 'gemini-code-assist[bot]'];
const CONTENT_FILE_RE = /^site\/src\/content\/(?:incidents|campaigns|threat-actors|zero-days)\/.+\.mdx?$/;
const PUBLIC_SITE_FILE_RE = /^site\/src\/(?:content|pages|components|layouts|data)\//;
const PIPELINE_FILE_RE = /^(?:scripts\/(?:pipeline-|validate-content-corpus|public-prose-guardrails|check-pr-comments)|\.github\/workflows\/pipeline-|\.github\/pipeline\/config\.yml|docs\/PIPELINE\.md|site\/src\/content\.config\.ts)/;

function parseArgs(argv) {
  const parsed = {
    pr: process.env.PR_NUMBER ? Number.parseInt(process.env.PR_NUMBER, 10) : null,
    repo: process.env.GITHUB_REPOSITORY || null,
    json: false,
  };

  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];
    if (arg === '--pr' && argv[i + 1]) parsed.pr = Number.parseInt(argv[++i], 10);
    else if (arg === '--repo' && argv[i + 1]) parsed.repo = argv[++i];
    else if (arg === '--json') parsed.json = true;
    else if (arg === '--help' || arg === '-h') {
      printHelp();
      process.exit(0);
    }
  }

  if (!Number.isInteger(parsed.pr) || parsed.pr <= 0) {
    throw new Error('Missing required PR number. Use --pr <number> or PR_NUMBER.');
  }

  if (!parsed.repo) {
    throw new Error('Missing required repo. Use --repo <owner/name> or GITHUB_REPOSITORY.');
  }

  if (!/^[^/]+\/[^/]+$/.test(parsed.repo)) {
    throw new Error(`Invalid repo "${parsed.repo}". Expected owner/name.`);
  }

  return parsed;
}

function printHelp() {
  console.log(`Usage: node scripts/pipeline-review-gate.mjs --pr <number> [--repo owner/name] [--json]

Environment:
  GITHUB_TOKEN or GITHUB_PAT must be present.
  AI_REVIEW_LOGINS may override the comma-separated AI reviewer login list.
`);
}

function getToken() {
  return process.env.GITHUB_TOKEN || process.env.GITHUB_PAT || null;
}

function getAiLogins() {
  const raw = process.env.AI_REVIEW_LOGINS;
  if (!raw) return new Set(DEFAULT_AI_REVIEW_LOGINS.map((login) => login.toLowerCase()));
  return new Set(raw.split(',').map((login) => login.trim().toLowerCase()).filter(Boolean));
}

function isAiLogin(login, aiLogins) {
  return Boolean(login) && aiLogins.has(login.toLowerCase());
}

function isRelevantFile(path) {
  return CONTENT_FILE_RE.test(path) || PUBLIC_SITE_FILE_RE.test(path) || PIPELINE_FILE_RE.test(path);
}

function isContentFile(path) {
  return CONTENT_FILE_RE.test(path);
}

function isAiReviewError(body) {
  return /encountered an error creating the review/i.test(body || '')
    || /try again by commenting\s+`?\/gemini review`?/i.test(body || '');
}

function hasNoFeedbackBody(body) {
  return /\bno feedback\b/i.test(body || '')
    || /\bno findings\b/i.test(body || '')
    || /\bnothing to add\b/i.test(body || '');
}

async function githubFetch(path, token, options = {}) {
  const url = path.startsWith('https://') ? path : `https://api.github.com${path}`;
  const response = await fetch(url, {
    ...options,
    headers: {
      Accept: 'application/vnd.github+json',
      Authorization: `Bearer ${token}`,
      'User-Agent': 'threatpedia-pipeline-review-gate',
      'X-GitHub-Api-Version': '2022-11-28',
      ...(options.headers || {}),
    },
  });

  if (!response.ok) {
    const body = await response.text();
    throw new Error(`GitHub API ${response.status} for ${path}: ${body.slice(0, 500)}`);
  }

  return response.json();
}

async function githubGraphql(query, variables, token) {
  const response = await fetch('https://api.github.com/graphql', {
    method: 'POST',
    headers: {
      Accept: 'application/vnd.github+json',
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
      'User-Agent': 'threatpedia-pipeline-review-gate',
    },
    body: JSON.stringify({ query, variables }),
  });

  const payload = await response.json();
  if (!response.ok || payload.errors?.length) {
    throw new Error(`GitHub GraphQL error: ${JSON.stringify(payload.errors || payload).slice(0, 800)}`);
  }
  return payload.data;
}

async function listPaginated(path, token) {
  const results = [];
  let page = 1;
  while (true) {
    const separator = path.includes('?') ? '&' : '?';
    const items = await githubFetch(`${path}${separator}per_page=100&page=${page}`, token);
    if (!Array.isArray(items) || items.length === 0) break;
    results.push(...items);
    if (items.length < 100) break;
    page += 1;
  }
  return results;
}

async function getReviewThreadComments(threadId, token) {
  const query = `
    query($threadId: ID!, $after: String) {
      node(id: $threadId) {
        ... on PullRequestReviewThread {
          comments(first: 100, after: $after) {
            pageInfo { hasNextPage endCursor }
            nodes {
              author { login }
              body
              path
              line
              originalLine
              createdAt
            }
          }
        }
      }
    }`;

  const comments = [];
  let after = null;
  while (true) {
    const data = await githubGraphql(query, { threadId, after }, token);
    const connection = data.node?.comments;
    if (!connection) break;
    comments.push(...connection.nodes);
    if (!connection.pageInfo.hasNextPage) break;
    after = connection.pageInfo.endCursor;
  }
  return comments;
}

async function getReviewThreads(owner, repo, prNumber, token) {
  const query = `
    query($owner: String!, $repo: String!, $number: Int!, $after: String) {
      repository(owner: $owner, name: $repo) {
        pullRequest(number: $number) {
          reviewThreads(first: 100, after: $after) {
            pageInfo { hasNextPage endCursor }
            nodes {
              id
              isResolved
              isOutdated
              comments(first: 100) {
                pageInfo { hasNextPage endCursor }
                nodes {
                  author { login }
                  body
                  path
                  line
                  originalLine
                  createdAt
                }
              }
            }
          }
        }
      }
    }`;

  const threads = [];
  let after = null;
  while (true) {
    const data = await githubGraphql(query, { owner, repo, number: prNumber, after }, token);
    const connection = data.repository.pullRequest.reviewThreads;
    for (const thread of connection.nodes) {
      if (thread.comments?.pageInfo?.hasNextPage) {
        thread.comments.nodes = await getReviewThreadComments(thread.id, token);
      }
      threads.push(thread);
    }
    if (!connection.pageInfo.hasNextPage) break;
    after = connection.pageInfo.endCursor;
  }
  return threads;
}

function latestDate(items, getter) {
  const dates = items.map(getter).filter(Boolean).map((value) => new Date(value).getTime()).filter(Number.isFinite);
  if (!dates.length) return null;
  return new Date(Math.max(...dates)).toISOString();
}

async function evaluate({ repo: repoSlug, pr: prNumber }) {
  const token = getToken();
  if (!token) {
    throw new Error('GITHUB_TOKEN or GITHUB_PAT is required. Do not read local secret files for this gate.');
  }

  const [owner, repo] = repoSlug.split('/');
  const aiLogins = getAiLogins();

  const pr = await githubFetch(`/repos/${owner}/${repo}/pulls/${prNumber}`, token);
  const [files, reviews, issueComments, checkRunsPayload, threads] = await Promise.all([
    listPaginated(`/repos/${owner}/${repo}/pulls/${prNumber}/files`, token),
    listPaginated(`/repos/${owner}/${repo}/pulls/${prNumber}/reviews`, token),
    listPaginated(`/repos/${owner}/${repo}/issues/${prNumber}/comments`, token),
    githubFetch(`/repos/${owner}/${repo}/commits/${pr.head.sha}/check-runs?per_page=100`, token),
    getReviewThreads(owner, repo, prNumber, token),
  ]);

  const changedPaths = files.map((file) => file.filename);
  const relevantPaths = changedPaths.filter(isRelevantFile);
  const contentPaths = changedPaths.filter(isContentFile);
  const requiresGate = relevantPaths.length > 0;
  const requiresValidation = contentPaths.length > 0;

  const failures = [];
  const notes = [];

  if (!requiresGate) {
    return {
      pass: true,
      pr: prNumber,
      headSha: pr.head.sha,
      applicable: false,
      summary: 'No public content, site, or pipeline files changed; review gate not applicable.',
      failures,
      notes,
      files: { changed: changedPaths, relevant: relevantPaths, content: contentPaths },
    };
  }

  const validateChecks = (checkRunsPayload.check_runs || []).filter((check) => check.name === 'validate');
  const passingValidate = validateChecks.find((check) => check.status === 'completed' && check.conclusion === 'success');
  if (requiresValidation && !passingValidate) {
    failures.push('No successful Pipeline: Validate Article PR "validate" check exists on the current head SHA.');
  }

  const currentHeadAiReviews = reviews.filter((review) =>
    isAiLogin(review.user?.login, aiLogins)
    && review.commit_id === pr.head.sha
    && !isAiReviewError(review.body)
  );

  const latestAiErrorAt = latestDate(
    [
      ...issueComments
        .filter((comment) => isAiLogin(comment.user?.login, aiLogins) && isAiReviewError(comment.body))
        .map((comment) => ({ createdAt: comment.created_at })),
      ...reviews
        .filter((review) => isAiLogin(review.user?.login, aiLogins) && isAiReviewError(review.body))
        .map((review) => ({ createdAt: review.submitted_at })),
    ],
    (item) => item.createdAt,
  );
  const latestCurrentHeadAiReviewAt = latestDate(currentHeadAiReviews, (review) => review.submitted_at);

  if (!currentHeadAiReviews.length) {
    failures.push('No AI second review exists on the current head SHA.');
  }

  if (latestAiErrorAt && (!latestCurrentHeadAiReviewAt || latestCurrentHeadAiReviewAt < latestAiErrorAt)) {
    failures.push('Latest AI review attempt errored and no later current-head AI review is present.');
  }

  const unresolvedAiThreads = threads.filter((thread) =>
    !thread.isResolved
    && !thread.isOutdated
    && thread.comments.nodes.some((comment) => isAiLogin(comment.author?.login, aiLogins))
  );

  if (unresolvedAiThreads.length > 0) {
    failures.push(`${unresolvedAiThreads.length} unresolved current AI review thread(s) remain.`);
  }

  const currentHeadAiReviewBodies = currentHeadAiReviews.map((review) => review.body || '').filter(Boolean);
  const currentHeadNoFeedback = currentHeadAiReviewBodies.some(hasNoFeedbackBody);
  if (currentHeadAiReviews.length && !currentHeadNoFeedback && unresolvedAiThreads.length === 0) {
    notes.push('Current-head AI review exists and no unresolved AI threads remain; review body was not a no-feedback summary, so top-level disposition should still be checked by the reviewer.');
  }

  const staleMergeReadyComments = issueComments.filter((comment) =>
    /(?:Backlog|Queue|Worker) Status/i.test(comment.body || '')
    && /Outcome:\s*`?merge_ready`?/i.test(comment.body || '')
  );

  if (staleMergeReadyComments.length && failures.length) {
    notes.push('Worker status comments claim merge_ready, but live review gate failed; worker comments are stale/non-authoritative.');
  }

  return {
    pass: failures.length === 0,
    pr: prNumber,
    headSha: pr.head.sha,
    applicable: true,
    summary: failures.length === 0 ? 'Review gate passed.' : 'Review gate failed.',
    failures,
    notes,
    files: {
      changed: changedPaths,
      relevant: relevantPaths,
      content: contentPaths,
    },
    checks: {
      requiresValidation,
      validateChecks: validateChecks.map((check) => ({
        name: check.name,
        status: check.status,
        conclusion: check.conclusion,
        startedAt: check.started_at,
        completedAt: check.completed_at,
      })),
      aiReviewsOnHead: currentHeadAiReviews.map((review) => ({
        author: review.user?.login || 'unknown',
        state: review.state,
        submittedAt: review.submitted_at,
      })),
      latestAiErrorAt,
      unresolvedAiThreadCount: unresolvedAiThreads.length,
    },
  };
}

function printHuman(result) {
  console.log(`Pipeline review gate for PR #${result.pr}`);
  console.log(`Head: ${result.headSha}`);
  console.log(`Applicable: ${result.applicable ? 'yes' : 'no'}`);
  console.log(`Result: ${result.pass ? 'PASS' : 'FAIL'}`);
  console.log('');
  console.log(result.summary);

  if (result.failures.length) {
    console.log('');
    console.log('Failures:');
    for (const failure of result.failures) console.log(`- ${failure}`);
  }

  if (result.notes.length) {
    console.log('');
    console.log('Notes:');
    for (const note of result.notes) console.log(`- ${note}`);
  }

  if (result.files?.relevant?.length) {
    console.log('');
    console.log('Relevant changed files:');
    for (const path of result.files.relevant) console.log(`- ${path}`);
  }
}

try {
  const args = parseArgs(process.argv.slice(2));
  const result = await evaluate(args);
  if (args.json) console.log(JSON.stringify(result, null, 2));
  else printHuman(result);
  if (!result.pass) process.exitCode = 1;
} catch (error) {
  console.error(`pipeline-review-gate: ${error.message}`);
  process.exitCode = 2;
}
