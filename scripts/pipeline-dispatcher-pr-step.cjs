'use strict';

const { execSync } = require('child_process');
const fs = require('fs');

module.exports = async function runDispatcherPrStep({ github, context }) {
  const BRANCH = process.env.DISPATCHER_BRANCH;
  const LABEL = process.env.DISPATCHER_LABEL;
  const { owner, repo } = context.repo;

  let taskPaths = [];
  try {
    const diffOut = execSync(
      `git diff --name-only origin/main...HEAD -- '.github/pipeline/tasks/*.json'`,
      { encoding: 'utf8' }
    );
    taskPaths = diffOut.split('\n').map((s) => s.trim()).filter(Boolean);
  } catch (e) {
    console.log(`Failed to enumerate branch-only task files: ${e.message}`);
    return;
  }

  if (taskPaths.length === 0) {
    console.log('No branch-only task files detected. Skipping PR update.');
    return;
  }

  const tasks = [];
  for (const p of taskPaths) {
    try {
      const t = JSON.parse(fs.readFileSync(p, 'utf8'));
      const history = Array.isArray(t.history) ? t.history : [];
      const lastEntry = history[history.length - 1] || {};
      tasks.push({
        task_id: t.task_id,
        stage: t.stage || '—',
        status: t.status || '—',
        updated: t.updated || '—',
        note: lastEntry.note || '—',
      });
    } catch (e) {
      console.log(`Failed to parse ${p}: ${e.message}`);
    }
  }

  if (tasks.length === 0) {
    console.log('No parseable tasks found on branch. Skipping PR update.');
    return;
  }

  tasks.sort((a, b) => a.task_id.localeCompare(b.task_id));

  try {
    await github.rest.issues.getLabel({ owner, repo, name: LABEL });
  } catch (e) {
    if (e.status === 404) {
      try {
        await github.rest.issues.createLabel({
          owner,
          repo,
          name: LABEL,
          color: '1d76db',
          description: 'Automated dispatcher bookkeeping PRs for pipeline task state updates',
        });
        console.log(`Created label ${LABEL}`);
      } catch (e2) {
        console.log(`Could not create label ${LABEL}: ${e2.message} — continuing without label`);
      }
    }
  }

  const title = `Pipeline dispatcher — ${tasks.length} task update${tasks.length === 1 ? '' : 's'} pending`;
  const nowIso = new Date().toISOString();

  let body = '## Automated Dispatcher state updates\n\n';
  body += 'This PR persists task-state changes produced by ';
  body += `\`.github/workflows/pipeline-dispatcher.yml\` on the \`${BRANCH}\` branch.\n\n`;
  body += 'These updates are bookkeeping only: dispatch notes, stale-lock releases, and dependency blocking.\n';
  body += 'No content is generated on this path.\n\n';
  body += 'Merge this PR to persist dispatcher state. Close it to discard these task-state updates and reset the branch on the next run.\n\n';
  body += '---\n\n';
  body += '| Task | Stage | Status | Last update | Latest note |\n';
  body += '|---|---|---|---|---|\n';
  for (const t of tasks) {
    const noteCell = String(t.note).replace(/\|/g, '\\|');
    body += `| \`${t.task_id}\` | ${t.stage} | ${t.status} | ${t.updated} | ${noteCell} |\n`;
  }
  body += '\n---\n\n';
  body += `_Last updated: ${nowIso} · Run [${context.runId}](${context.serverUrl}/${owner}/${repo}/actions/runs/${context.runId}) · See [docs/PIPELINE.md](${context.serverUrl}/${owner}/${repo}/blob/main/docs/PIPELINE.md) for the end-to-end flow._\n`;

  const { data: existing } = await github.rest.pulls.list({
    owner,
    repo,
    state: 'open',
    head: `${owner}:${BRANCH}`,
    per_page: 5,
  });

  if (existing.length > 0) {
    const pr = existing[0];
    console.log(`Updating existing PR #${pr.number}`);
    await github.rest.pulls.update({
      owner,
      repo,
      pull_number: pr.number,
      title,
      body,
    });
    return;
  }

  console.log('Creating new dispatcher PR');
  const { data: pr } = await github.rest.pulls.create({
    owner,
    repo,
    head: BRANCH,
    base: 'main',
    title,
    body,
  });

  try {
    await github.rest.issues.addLabels({
      owner,
      repo,
      issue_number: pr.number,
      labels: [LABEL],
    });
  } catch (e) {
    console.log(`Could not add label ${LABEL} to PR #${pr.number}: ${e.message}`);
  }

  console.log(`Opened PR #${pr.number}: ${pr.html_url}`);
};
