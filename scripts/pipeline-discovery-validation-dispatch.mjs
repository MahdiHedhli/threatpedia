#!/usr/bin/env node
/**
 * Dispatch task validation for discovery PRs and run a bounded local fallback
 * if the dispatch path is unavailable or does not materialize.
 */

import { spawnSync } from 'node:child_process';
import { existsSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

const DEFAULT_WORKFLOW = 'pipeline-validate-tasks.yml';
const DEFAULT_WAIT_SECONDS = 30;
const FALLBACK_STATUS_CONTEXT = 'Pipeline: Validate Task PR / fallback';

function usage() {
  console.log([
    'Usage:',
    '  node scripts/pipeline-discovery-validation-dispatch.mjs --branch <branch> [--repo owner/name] [--workflow file.yml] [--wait-seconds 30]',
    '',
    'Tries workflow_dispatch first. If no dispatched run appears, validates the',
    'current checkout with scripts/validate-pipeline-tasks.mjs and reports a',
    'deduped PR comment plus a commit status on the discovery PR head.',
  ].join('\n'));
}

function parseArgs(argv) {
  const args = {
    branch: process.env.DISCOVERY_BRANCH || null,
    repo: process.env.GITHUB_REPOSITORY || null,
    workflow: DEFAULT_WORKFLOW,
    waitSeconds: DEFAULT_WAIT_SECONDS,
  };

  for (let i = 2; i < argv.length; i += 1) {
    const token = argv[i];
    const next = argv[i + 1];
    switch (token) {
      case '--branch':
        if (!next) throw new Error('Missing value for --branch');
        args.branch = next;
        i += 1;
        break;
      case '--repo':
        if (!next) throw new Error('Missing value for --repo');
        args.repo = next;
        i += 1;
        break;
      case '--workflow':
        if (!next) throw new Error('Missing value for --workflow');
        args.workflow = next;
        i += 1;
        break;
      case '--wait-seconds':
        if (!next || !/^\d+$/.test(next)) throw new Error('Missing numeric value for --wait-seconds');
        args.waitSeconds = Number(next);
        i += 1;
        break;
      case '--help':
      case '-h':
        usage();
        process.exit(0);
        break;
      default:
        throw new Error(`Unknown argument: ${token}`);
    }
  }

  if (!args.branch) throw new Error('--branch is required');
  if (!args.repo || !/^[^/]+\/[^/]+$/.test(args.repo)) throw new Error('--repo owner/name is required');
  return args;
}

function getToken() {
  const token = process.env.GITHUB_TOKEN || process.env.GH_TOKEN;
  if (!token) throw new Error('GITHUB_TOKEN or GH_TOKEN is required');
  return token;
}

function repoParts(fullName) {
  const [owner, repo] = fullName.split('/');
  return { owner, repo };
}

async function githubRequest(token, path, options = {}) {
  const response = await fetch(`https://api.github.com${path}`, {
    ...options,
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: 'application/vnd.github+json',
      'X-GitHub-Api-Version': '2022-11-28',
      'User-Agent': 'threatpedia-discovery-validation-dispatch',
      ...(options.headers || {}),
    },
  });

  if (response.status === 204) return null;

  const text = await response.text();
  let payload = null;
  if (text) {
    try {
      payload = JSON.parse(text);
    } catch {
      payload = { message: text };
    }
  }

  if (!response.ok) {
    const message = payload?.message || response.statusText;
    const error = new Error(`GitHub API ${response.status}: ${message}`);
    error.status = response.status;
    error.payload = payload;
    throw error;
  }

  return payload;
}

async function findOpenDiscoveryPr({ token, owner, repo, branch }) {
  const head = encodeURIComponent(`${owner}:${branch}`);
  const pulls = await githubRequest(token, `/repos/${owner}/${repo}/pulls?state=open&head=${head}&per_page=5`);
  if (!Array.isArray(pulls) || pulls.length === 0) {
    throw new Error(`No open PR found for ${owner}:${branch}`);
  }
  if (pulls.length > 1) {
    throw new Error(`Multiple open PRs found for ${owner}:${branch}`);
  }
  return pulls[0];
}

async function dispatchValidation({ token, owner, repo, workflow, prNumber, branch }) {
  await githubRequest(token, `/repos/${owner}/${repo}/actions/workflows/${encodeURIComponent(workflow)}/dispatches`, {
    method: 'POST',
    body: JSON.stringify({
      ref: 'main',
      inputs: {
        pr_number: String(prNumber),
        head_ref: branch,
      },
    }),
  });
}

async function getExistingValidationCheck({ token, owner, repo, headSha }) {
  const payload = await githubRequest(
    token,
    `/repos/${owner}/${repo}/commits/${headSha}/check-runs?check_name=validate-tasks&per_page=10`,
  );
  const runs = Array.isArray(payload?.check_runs) ? payload.check_runs : [];
  return runs
    .filter(run => run.name === 'validate-tasks')
    .sort((a, b) => (Date.parse(b.started_at || b.created_at || '') || 0) - (Date.parse(a.started_at || a.created_at || '') || 0))[0] || null;
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function findDispatchedRun({ token, owner, repo, workflow, startedAtMs }) {
  const payload = await githubRequest(
    token,
    `/repos/${owner}/${repo}/actions/workflows/${encodeURIComponent(workflow)}/runs?event=workflow_dispatch&branch=main&per_page=20`,
  );
  const runs = Array.isArray(payload?.workflow_runs) ? payload.workflow_runs : [];
  return runs.find((run) => {
    const createdAt = Date.parse(run.created_at || '');
    if (!Number.isFinite(createdAt) || createdAt < startedAtMs) return false;
    return true;
  }) || null;
}

async function waitForDispatchedRun({ token, owner, repo, workflow, startedAtMs, waitSeconds }) {
  const deadline = Date.now() + waitSeconds * 1000;
  while (Date.now() <= deadline) {
    const run = await findDispatchedRun({ token, owner, repo, workflow, startedAtMs });
    if (run) return run;
    await sleep(5000);
  }
  return null;
}

function run(command, args, options = {}) {
  const result = spawnSync(command, args, {
    encoding: 'utf8',
    stdio: options.stdio || 'pipe',
    env: process.env,
  });
  if (options.allowFailure) return result;
  if (result.status !== 0) {
    throw new Error(`${command} ${args.join(' ')} failed: ${result.stderr || result.stdout || `exit ${result.status}`}`);
  }
  return result;
}

function gitLines(args) {
  const result = run('git', args);
  return result.stdout
    .split(/\r?\n/)
    .map(line => line.trim())
    .filter(Boolean);
}

function runFallbackValidation() {
  run('git', ['fetch', 'origin', 'main', '--quiet']);

  const temp = mkdtempSync(join(tmpdir(), 'threatpedia-task-validation-'));
  try {
    const changedPath = join(temp, 'pipeline_changed_tasks.txt');
    const newPath = join(temp, 'pipeline_new_tasks.txt');
    const reportPath = join(temp, 'pipeline_task_validation.json');

    const changed = gitLines(['diff', '--name-only', '--diff-filter=d', 'origin/main...HEAD', '--', '.github/pipeline/tasks/*.json']);
    const added = gitLines(['diff', '--name-only', '--diff-filter=A', 'origin/main...HEAD', '--', '.github/pipeline/tasks/*.json']);
    writeFileSync(changedPath, `${changed.join('\n')}\n`);
    writeFileSync(newPath, `${added.join('\n')}\n`);

    const result = run(process.execPath, [
      'scripts/validate-pipeline-tasks.mjs',
      '--files-file',
      changedPath,
      '--new-files-file',
      newPath,
      '--json-out',
      reportPath,
    ], { allowFailure: true });

    let payload;
    if (existsSync(reportPath)) {
      payload = JSON.parse(readFileSync(reportPath, 'utf8'));
    } else {
      payload = {
        allPass: false,
        results: [],
        markdown: [
          '## Pipeline Task Validation Report',
          '',
          ':x: Task validator did not produce a report during discovery fallback validation.',
        ].join('\n'),
      };
    }

    return {
      exitStatus: result.status,
      stdout: result.stdout,
      stderr: result.stderr,
      changed,
      added,
      payload,
    };
  } finally {
    rmSync(temp, { recursive: true, force: true });
  }
}

async function upsertValidationComment({ token, owner, repo, prNumber, body }) {
  const comments = await githubRequest(token, `/repos/${owner}/${repo}/issues/${prNumber}/comments?per_page=100`);
  const existing = comments.find(comment =>
    String(comment.body || '').includes('Pipeline Task Validation Report')
  );

  if (existing) {
    await githubRequest(token, `/repos/${owner}/${repo}/issues/comments/${existing.id}`, {
      method: 'PATCH',
      body: JSON.stringify({ body }),
    });
    return { action: 'updated', url: existing.html_url };
  }

  const created = await githubRequest(token, `/repos/${owner}/${repo}/issues/${prNumber}/comments`, {
    method: 'POST',
    body: JSON.stringify({ body }),
  });
  return { action: 'created', url: created.html_url };
}

async function createCommitStatus({ token, owner, repo, sha, state, description, targetUrl }) {
  const body = {
    state,
    context: FALLBACK_STATUS_CONTEXT,
    description: description.slice(0, 140),
  };
  if (targetUrl) body.target_url = targetUrl;

  await githubRequest(token, `/repos/${owner}/${repo}/statuses/${sha}`, {
    method: 'POST',
    body: JSON.stringify(body),
  });
}

function actionRunUrl(owner, repo) {
  const runId = process.env.GITHUB_RUN_ID;
  if (!runId) return null;
  return `https://github.com/${owner}/${repo}/actions/runs/${runId}`;
}

async function main() {
  const args = parseArgs(process.argv);
  const token = getToken();
  const { owner, repo } = repoParts(args.repo);
  const pr = await findOpenDiscoveryPr({ token, owner, repo, branch: args.branch });
  const prNumber = pr.number;
  const headSha = pr.head?.sha;
  if (!headSha) throw new Error(`Could not resolve head SHA for PR #${prNumber}`);

  const summary = {
    pr_number: prNumber,
    pr_url: pr.html_url,
    head_ref: args.branch,
    head_sha: headSha,
    primary_dispatch_status: 'not_attempted',
    primary_run_url: null,
    existing_validation_status: 'not_checked',
    fallback_attempted: false,
    fallback_result: 'not_attempted',
    blocker: null,
  };

  const existingCheck = await getExistingValidationCheck({ token, owner, repo, headSha });
  if (existingCheck) {
    summary.existing_validation_status = `${existingCheck.status}:${existingCheck.conclusion || 'pending'}`;
    if (['queued', 'in_progress', 'waiting', 'pending', 'requested'].includes(existingCheck.status)) {
      summary.primary_dispatch_status = 'existing_validation_in_progress';
      summary.primary_run_url = existingCheck.html_url || existingCheck.details_url || null;
      console.log(JSON.stringify(summary, null, 2));
      return;
    }
    if (existingCheck.status === 'completed' && existingCheck.conclusion === 'success') {
      summary.primary_dispatch_status = 'existing_validation_success';
      summary.primary_run_url = existingCheck.html_url || existingCheck.details_url || null;
      console.log(JSON.stringify(summary, null, 2));
      return;
    }
    summary.primary_dispatch_status = `existing_validation_non_success:${existingCheck.conclusion || existingCheck.status}`;
    summary.blocker = `Existing validate-tasks check is ${summary.existing_validation_status}.`;
  } else {
    summary.existing_validation_status = 'none';
  }

  const startedAtMs = Date.now() - 30000;
  if (!summary.primary_dispatch_status.startsWith('existing_validation_non_success')) {
    try {
      await dispatchValidation({
        token,
        owner,
        repo,
        workflow: args.workflow,
        prNumber,
        branch: args.branch,
      });
      summary.primary_dispatch_status = 'dispatch_api_success';
    } catch (error) {
      summary.primary_dispatch_status = `dispatch_api_failed:${error.message}`;
      summary.blocker = error.message;
    }
  }

  if (summary.primary_dispatch_status === 'dispatch_api_success') {
    const run = await waitForDispatchedRun({
      token,
      owner,
      repo,
      workflow: args.workflow,
      startedAtMs,
      waitSeconds: args.waitSeconds,
    });
    if (run) {
      summary.primary_dispatch_status = 'dispatch_run_detected';
      summary.primary_run_url = run.html_url;
      summary.blocker = null;
      console.log(JSON.stringify(summary, null, 2));
      return;
    }
    summary.primary_dispatch_status = 'dispatch_run_not_detected';
    summary.blocker = `No ${args.workflow} workflow_dispatch run appeared within ${args.waitSeconds}s.`;
  }

  summary.fallback_attempted = true;
  const fallback = runFallbackValidation();
  const fallbackPass = fallback.payload.allPass === true && fallback.exitStatus === 0;
  summary.fallback_result = fallbackPass ? 'success' : 'failure';
  summary.fallback_changed_task_count = fallback.changed.length;
  summary.fallback_new_task_count = fallback.added.length;
  if (!fallbackPass) {
    summary.blocker = `Fallback validation failed for PR #${prNumber}.`;
  }

  const fallbackNote = [
    '',
    '---',
    '',
    '_Discovery validation fallback executed because the primary validation dispatch did not produce a detectable run._',
    `_Primary dispatch status: ${summary.primary_dispatch_status}_`,
    `_Fallback result: ${summary.fallback_result}_`,
  ].join('\n');

  await upsertValidationComment({
    token,
    owner,
    repo,
    prNumber,
    body: `${String(fallback.payload.markdown || '').trim()}\n${fallbackNote}\n`,
  });

  await createCommitStatus({
    token,
    owner,
    repo,
    sha: headSha,
    state: fallbackPass ? 'success' : 'failure',
    description: fallbackPass ? 'Fallback task validation passed' : 'Fallback task validation failed',
    targetUrl: actionRunUrl(owner, repo),
  });

  console.log(JSON.stringify(summary, null, 2));
  if (!fallbackPass) process.exit(1);
}

main().catch((error) => {
  console.error('pipeline-discovery-validation-dispatch failed:', error);
  process.exit(1);
});
