'use strict';

const fs = require('fs');
const path = require('path');

const TASKS_DIR = '.github/pipeline/tasks';
const DISPATCH_LABEL = 'pipeline/ready';

module.exports = async function runDispatcherDispatchStep({ github, context }) {
  const DEFAULTS = {
    maxEditorial: 50,
    backpressureResume: 40,
    failureThreshold: 3,
    staleLockMinutes: 30,
    cooldownMinutes: 60,
    failureWindowMinutes: 120,
  };

  function loadConfig() {
    try {
      const raw = process.env.CONFIG_JSON || '';
      if (!raw) return { ...DEFAULTS, _source: 'defaults', _reason: 'no-env' };
      const cfg = JSON.parse(raw);
      return {
        maxEditorial: cfg?.queues?.editorial?.max_pending ?? DEFAULTS.maxEditorial,
        backpressureResume: cfg?.queues?.editorial?.backpressure_resume ?? DEFAULTS.backpressureResume,
        failureThreshold: cfg?.circuit_breaker?.failure_threshold ?? DEFAULTS.failureThreshold,
        staleLockMinutes: cfg?.scheduling?.stale_lock_minutes ?? DEFAULTS.staleLockMinutes,
        cooldownMinutes: cfg?.circuit_breaker?.cooldown_minutes ?? DEFAULTS.cooldownMinutes,
        failureWindowMinutes: cfg?.circuit_breaker?.failure_window_minutes ?? DEFAULTS.failureWindowMinutes,
        _source: cfg._source || 'file',
        _reason: cfg._reason,
        _path: cfg._path,
      };
    } catch (e) {
      console.warn(`::warning::Pipeline config parse failed: ${e.message}. Using safe defaults.`);
      return { ...DEFAULTS, _source: 'defaults', _reason: 'parse-error' };
    }
  }

  const config = loadConfig();
  const now = new Date();
  const nowIso = now.toISOString();

  console.log('─── Dispatcher config (active thresholds) ───────────────');
  console.log(`  source:               ${config._source}${config._reason ? ' (' + config._reason + ')' : ''}${config._path ? ' · ' + config._path : ''}`);
  console.log(`  maxEditorial:         ${config.maxEditorial}  (queues.editorial.max_pending)`);
  console.log(`  backpressureResume:   ${config.backpressureResume}  (queues.editorial.backpressure_resume)`);
  console.log(`  failureThreshold:     ${config.failureThreshold}  (circuit_breaker.failure_threshold)`);
  console.log(`  failureWindowMinutes: ${config.failureWindowMinutes}  (circuit_breaker.failure_window_minutes)`);
  console.log(`  cooldownMinutes:      ${config.cooldownMinutes}  (circuit_breaker.cooldown_minutes)`);
  console.log(`  staleLockMinutes:     ${config.staleLockMinutes}  (scheduling.stale_lock_minutes)`);
  console.log('──────────────────────────────────────────────────────────');

  function loadTasks() {
    if (!fs.existsSync(TASKS_DIR)) return [];
    return fs.readdirSync(TASKS_DIR)
      .filter((f) => f.endsWith('.json'))
      .map((f) => {
        const data = JSON.parse(fs.readFileSync(path.join(TASKS_DIR, f), 'utf8'));
        data._file = f;
        return data;
      });
  }

  function saveTask(task) {
    const taskFile = task._file;
    const persisted = { ...task };
    delete persisted._file;
    fs.writeFileSync(
      path.join(TASKS_DIR, taskFile),
      JSON.stringify(persisted, null, 2) + '\n'
    );
  }

  function appendHistory(task, entry) {
    task.history = task.history || [];
    task.history.push(entry);
  }

  function parseTaskIdFromIssue(issue) {
    const titleMatch = String(issue.title || '').match(/\[PIPELINE\]\s+(TASK-\d{4}-\d+):/);
    if (titleMatch) return titleMatch[1];
    const bodyMatch = String(issue.body || '').match(/## Pipeline Task: `([^`]+)`/);
    return bodyMatch ? bodyMatch[1] : null;
  }

  const allTasks = loadTasks();

  async function loadOpenPipelineIssues() {
    const issues = await github.paginate(
      github.rest.issues.listForRepo,
      {
        owner: context.repo.owner,
        repo: context.repo.repo,
        state: 'open',
        labels: DISPATCH_LABEL,
        per_page: 100,
      }
    );
    return issues.filter((issue) => !issue.pull_request);
  }

  const openPipelineIssues = await loadOpenPipelineIssues();
  const taskIndex = new Map(allTasks.map((task) => [task.task_id, task]));

  function removeOpenIssue(issueNumber) {
    const index = openPipelineIssues.findIndex((issue) => issue.number === issueNumber);
    if (index >= 0) openPipelineIssues.splice(index, 1);
  }

  function findOpenPipelineIssue(taskId) {
    return openPipelineIssues.find((issue) =>
      issue.title.includes(`[PIPELINE] ${taskId}:`) ||
      (issue.body || '').includes(`## Pipeline Task: \`${taskId}\``)
    ) || null;
  }

  async function closePipelineIssue(issue, reason) {
    console.log(`Closing Issue #${issue.number}: ${reason}`);
    await github.rest.issues.update({
      owner: context.repo.owner,
      repo: context.repo.repo,
      issue_number: issue.number,
      state: 'closed',
      state_reason: 'completed',
    });
    removeOpenIssue(issue.number);
  }

  async function loadPrForTask(task) {
    if (task.pr_number) {
      try {
        const { data } = await github.rest.pulls.get({
          owner: context.repo.owner,
          repo: context.repo.repo,
          pull_number: task.pr_number,
        });
        return data;
      } catch (error) {
        if (error.status !== 404) throw error;
      }
    }

    const headRef = task.output?.branch;
    if (!headRef) return null;

    const { data } = await github.rest.pulls.list({
      owner: context.repo.owner,
      repo: context.repo.repo,
      state: 'all',
      head: `${context.repo.owner}:${headRef}`,
      sort: 'updated',
      direction: 'desc',
      per_page: 5,
    });
    return data[0] || null;
  }

  async function loadOpenPrForTask(task) {
    const knownPr = await loadPrForTask(task);
    if (knownPr?.state === 'open') return knownPr;

    const headRef = task.output?.branch;
    if (!headRef) return null;

    const { data } = await github.rest.pulls.list({
      owner: context.repo.owner,
      repo: context.repo.repo,
      state: 'open',
      head: `${context.repo.owner}:${headRef}`,
      sort: 'updated',
      direction: 'desc',
      per_page: 5,
    });
    return data[0] || null;
  }

  async function reconcilePrBackedTasks() {
    const prBackedTasks = allTasks.filter((task) => task.status === 'pr_open');

    for (const task of prBackedTasks) {
      const pr = await loadPrForTask(task);
      if (!pr) continue;

      if (pr.state === 'open') {
        let changed = false;
        if (task.pr_number !== pr.number) {
          task.pr_number = pr.number;
          changed = true;
        }
        if (task.pr_url !== pr.html_url) {
          task.pr_url = pr.html_url;
          changed = true;
        }
        if (changed) {
          task.updated = nowIso;
          appendHistory(task, {
            timestamp: nowIso,
            action: 'pr_reconciled',
            from: 'pr_open',
            to: 'pr_open',
            agent: 'dispatcher',
            note: `Synchronized live PR metadata from PR #${pr.number}.`,
          });
          saveTask(task);
        }
        continue;
      }

      const previousStatus = task.status || 'pending';
      task.locked_by = null;
      task.locked_at = null;
      task.updated = nowIso;

      if (pr.merged_at) {
        task.status = 'complete';
        task.pr_number = pr.number;
        task.pr_url = pr.html_url;
        task.merged_at = pr.merged_at;
        appendHistory(task, {
          timestamp: nowIso,
          action: 'merged',
          from: previousStatus,
          to: 'complete',
          agent: 'dispatcher',
          note: `Reconciled merged PR #${pr.number}.`,
        });
      } else {
        task.status = 'pending';
        task.pr_number = null;
        delete task.pr_url;
        delete task.merged_at;
        appendHistory(task, {
          timestamp: nowIso,
          action: 'pr_closed',
          from: previousStatus,
          to: 'pending',
          agent: 'dispatcher',
          note: `Reconciled closed PR #${pr.number} without merge.`,
        });
      }

      saveTask(task);
    }
  }

  async function reconcileOpenPipelineIssues() {
    const issuesByTask = new Map();

    for (const issue of [...openPipelineIssues]) {
      const taskId = parseTaskIdFromIssue(issue);
      if (!taskId) continue;
      const bucket = issuesByTask.get(taskId) || [];
      bucket.push(issue);
      issuesByTask.set(taskId, bucket);
    }

    for (const [taskId, issues] of issuesByTask.entries()) {
      issues.sort((a, b) => a.number - b.number);
      const task = taskIndex.get(taskId);

      if (!task) {
        for (const issue of issues) {
          await closePipelineIssue(issue, `orphaned pipeline issue for missing task ${taskId}`);
        }
        continue;
      }

      const readyForPickup = task.status === 'pending' && task.stage === 'draft';
      const coveringPr = await loadOpenPrForTask(task);

      if (coveringPr?.state === 'open') {
        for (const issue of issues) {
          await closePipelineIssue(
            issue,
            `${taskId} is already covered by open PR #${coveringPr.number}`
          );
        }
        continue;
      }

      if (!readyForPickup) {
        for (const issue of issues) {
          await closePipelineIssue(
            issue,
            `${taskId} is no longer ready for pickup (status=${task.status}, stage=${task.stage})`
          );
        }
        continue;
      }

      const [, ...duplicates] = issues;
      for (const issue of duplicates) {
        await closePipelineIssue(issue, `duplicate pipeline issue for ${taskId}`);
      }
    }
  }

  await reconcilePrBackedTasks();
  await reconcileOpenPipelineIssues();

  const recentFailed = allTasks
    .filter((t) => t.status === 'failed')
    .sort((a, b) => new Date(b.updated) - new Date(a.updated))
    .slice(0, config.failureThreshold);

  if (recentFailed.length >= config.failureThreshold) {
    const allRecent = recentFailed.every((t) => {
      const ago = (Date.now() - new Date(t.updated).getTime()) / 60000;
      return ago < config.failureWindowMinutes;
    });
    if (allRecent) {
      console.log('::warning::Circuit breaker tripped — 3+ consecutive recent failures. Halting dispatch.');
      await github.rest.issues.create({
        owner: context.repo.owner,
        repo: context.repo.repo,
        title: `[PIPELINE ALERT] Circuit breaker tripped — ${config.failureThreshold} consecutive failures`,
        body: `The pipeline dispatcher detected ${config.failureThreshold} consecutive failures within the last ${config.failureWindowMinutes} minutes.\n\nFailed tasks:\n${recentFailed.map((t) => `- \`${t.task_id}\`: ${t.error?.message || 'unknown error'}`).join('\n')}\n\nThe pipeline is paused until this issue is resolved. Cooldown after resume: ${config.cooldownMinutes} minutes. Close this issue to resume.`,
        labels: ['pipeline/alert', 'pipeline/circuit-breaker'],
      });
      return;
    }
  }

  const BP_LABEL = 'pipeline/backpressure';
  const pendingDrafts = allTasks.filter((t) =>
    t.status === 'pr_open' ||
    t.stage === 'validation' ||
    t.stage === 'review'
  ).length;

  async function findBackpressureIssue() {
    const { data } = await github.rest.issues.listForRepo({
      owner: context.repo.owner,
      repo: context.repo.repo,
      state: 'open',
      labels: BP_LABEL,
      per_page: 5,
    });
    return data[0] || null;
  }

  const bpIssue = await findBackpressureIssue();
  const queueInBand = pendingDrafts >= config.backpressureResume;
  const queueAtCap = pendingDrafts >= config.maxEditorial;

  if (queueAtCap && !bpIssue) {
    await github.rest.issues.create({
      owner: context.repo.owner,
      repo: context.repo.repo,
      title: `[PIPELINE BACKPRESSURE] Editorial queue at capacity (${pendingDrafts}/${config.maxEditorial})`,
      body: `The editorial review queue is at or above capacity. Dispatch of new drafts is paused.\n\n**Active thresholds:**\n- Pause at: ${config.maxEditorial}\n- Resume at: ${config.backpressureResume}\n\nThe dispatcher will auto-resume and close this Issue on the first cycle where pending drafts drop below the resume threshold. No operator action required unless the queue stays stuck.`,
      labels: [BP_LABEL, 'pipeline/alert'],
    });
    console.log(`Editorial queue at ${pendingDrafts}/${config.maxEditorial} — backpressure engaged, Issue opened.`);
    return;
  }

  if (bpIssue && queueInBand) {
    console.log(`Backpressure active (Issue #${bpIssue.number}): pendingDrafts=${pendingDrafts} still ≥ resume threshold ${config.backpressureResume}. Staying paused.`);
    return;
  }

  if (bpIssue && !queueInBand) {
    await github.rest.issues.createComment({
      owner: context.repo.owner,
      repo: context.repo.repo,
      issue_number: bpIssue.number,
      body: `Auto-resuming: pendingDrafts=${pendingDrafts} dropped below resume threshold ${config.backpressureResume}. Dispatch continuing.`,
    });
    await github.rest.issues.update({
      owner: context.repo.owner,
      repo: context.repo.repo,
      issue_number: bpIssue.number,
      state: 'closed',
      state_reason: 'completed',
    });
    console.log(`Backpressure cleared (Issue #${bpIssue.number} closed): pendingDrafts=${pendingDrafts} < ${config.backpressureResume}. Resuming dispatch.`);
  }

  for (const task of allTasks) {
    if (task.status === 'locked' && task.locked_at) {
      const lockAge = (now - new Date(task.locked_at)) / 60000;
      if (lockAge > config.staleLockMinutes) {
        console.log(`Releasing stale lock on ${task.task_id} (locked ${Math.round(lockAge)}m ago)`);
        task.status = 'pending';
        task.locked_by = null;
        task.locked_at = null;
        task.updated = nowIso;
        appendHistory(task, {
          timestamp: nowIso,
          action: 'lock_released',
          from: 'locked',
          to: 'pending',
          agent: 'dispatcher',
          note: `Stale lock released after ${Math.round(lockAge)} minutes`,
        });
        saveTask(task);
      }
    }
  }

  function effectiveStage(task) {
    return task.stage || 'draft';
  }

  function effectiveCreatedAt(task) {
    return (
      task.created ||
      task.updated ||
      task.history?.[0]?.timestamp ||
      null
    );
  }

  const priorityOrder = { P0: 0, P1: 1, P2: 2, P3: 3 };
  const pendingTasks = allTasks
    .filter((t) => t.status === 'pending' && effectiveStage(t) === 'draft')
    .sort((a, b) => {
      const pDiff = (priorityOrder[a.priority] || 9) - (priorityOrder[b.priority] || 9);
      if (pDiff !== 0) return pDiff;

      const aCreated = effectiveCreatedAt(a);
      const bCreated = effectiveCreatedAt(b);

      if (aCreated && bCreated) return new Date(aCreated) - new Date(bCreated);
      if (aCreated && !bCreated) return -1;
      if (!aCreated && bCreated) return 1;
      return String(a.task_id || a._file).localeCompare(String(b.task_id || b._file));
    });

  const requestedId = process.env.REQUESTED_TASK_ID || '';
  const tasksToRun = requestedId
    ? pendingTasks.filter((t) => t.task_id === requestedId)
    : pendingTasks.slice(0, 3);

  if (tasksToRun.length === 0) {
    console.log('No pending tasks to dispatch.');
    return;
  }

  for (const task of tasksToRun) {
    const deps = task.depends_on || [];
    const unmet = deps.filter((depId) => {
      const dep = allTasks.find((t) => t.task_id === depId);
      return !dep || dep.status !== 'complete';
    });

    if (unmet.length > 0) {
      console.log(`Task ${task.task_id} blocked by unmet dependencies: ${unmet.join(', ')}`);
      task.status = 'blocked';
      task.updated = nowIso;
      appendHistory(task, {
        timestamp: nowIso,
        action: 'blocked',
        from: 'pending',
        to: 'blocked',
        agent: 'dispatcher',
        note: `Blocked by: ${unmet.join(', ')}`,
      });
      saveTask(task);
      continue;
    }

    const coveringPr = await loadOpenPrForTask(task);
    if (coveringPr?.state === 'open') {
      console.log(`Task ${task.task_id} already has open PR #${coveringPr.number} — skipping dispatch`);
      const existingIssue = findOpenPipelineIssue(task.task_id);
      if (existingIssue) {
        await closePipelineIssue(
          existingIssue,
          `${task.task_id} is already covered by open PR #${coveringPr.number}`
        );
      }

      const alreadyRecorded = task.history?.some((entry) =>
        entry.agent === 'dispatcher' &&
        String(entry.note || '').includes(`open PR #${coveringPr.number}`)
      );
      if (!alreadyRecorded) {
        task.updated = nowIso;
        appendHistory(task, {
          timestamp: nowIso,
          action: 'dispatch_skipped',
          from: 'pending',
          to: 'pending',
          agent: 'dispatcher',
          note: `Dispatch skipped because open PR #${coveringPr.number} already covers this task.`,
        });
        saveTask(task);
      }
      continue;
    }

    console.log(`Dispatching ${task.task_id} (${task.type}, ${task.priority})`);

    const existingIssue = findOpenPipelineIssue(task.task_id);
    if (existingIssue) {
      console.log(`Task ${task.task_id} already has open Issue #${existingIssue.number} — skipping duplicate dispatch`);
      task.history = task.history || [];
      const alreadyRecorded = task.history.some((entry) =>
        entry.agent === 'dispatcher' &&
        String(entry.note || '').includes(`Issue #${existingIssue.number}`)
      );
      if (!alreadyRecorded) {
        task.updated = nowIso;
        appendHistory(task, {
          timestamp: nowIso,
          action: 'dispatch_skipped',
          from: 'pending',
          to: 'pending',
          agent: 'dispatcher',
          note: `Dispatch already open as Issue #${existingIssue.number}`,
        });
        saveTask(task);
      }
      continue;
    }

    const issueBody = [
      `## Pipeline Task: \`${task.task_id}\``,
      '',
      '**This is an automated pipeline task. Any agent (Claude Code, Gemini, human) can execute this.**',
      '',
      '### Instructions',
      '',
      `1. View full brief:  \`node scripts/pipeline-run-task.mjs --task ${task.task_id}\``,
      `2. Lock the task:    \`node scripts/pipeline-run-task.mjs --task ${task.task_id} --lock\``,
      `3. Create branch:    \`git checkout -b ${task.output.branch}\``,
      '4. Write the article using your AI agent or manually (follow the brief)',
      `5. Validate:         \`node scripts/pipeline-run-task.mjs --task ${task.task_id} --validate\``,
      '6. Commit and push your task branch',
      `7. Open + record PR state:  \`node scripts/pipeline-run-task.mjs --task ${task.task_id} --open-pr\``,
      '',
      '### Task Details',
      '',
      '| Field | Value |',
      '|---|---|',
      `| Type | \`${task.type}\` |`,
      `| Priority | \`${task.priority}\` |`,
      `| Topic | ${task.input.topic} |`,
      `| Sources | ${(task.input.sources || []).length} URL(s) |`,
      '',
      '### Acceptance Criteria',
      '',
      '```json',
      JSON.stringify(task.acceptance_criteria || task.acceptance || {}, null, 2),
      '```',
      '',
      '### Source URLs',
      '',
      ...(task.input.sources || []).map((s) => `- ${s}`),
      '',
      task.input.notes ? `### Notes\n\n${task.input.notes}` : '',
    ].join('\n');

    const { data: createdIssue } = await github.rest.issues.create({
      owner: context.repo.owner,
      repo: context.repo.repo,
      title: `[PIPELINE] ${task.task_id}: ${task.input.topic.substring(0, 60)}`,
      body: issueBody,
      labels: ['pipeline/ready', `type/${task.type}`, `priority/${task.priority.toLowerCase()}`],
    });

    task.status = 'pending';
    task.updated = nowIso;
    appendHistory(task, {
      timestamp: nowIso,
      action: 'dispatched',
      from: 'pending',
      to: 'pending',
      agent: 'dispatcher',
      note: `Dispatched as Issue #${createdIssue.number}`,
    });
    saveTask(task);

    openPipelineIssues.push(createdIssue);
  }
};
