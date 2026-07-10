#!/usr/bin/env node
'use strict';

const assert = require('node:assert/strict');
const fs = require('fs');
const os = require('os');
const path = require('path');

const runDispatcher = require('./pipeline-dispatcher-dispatch-step.cjs');

const ORIGINAL_CWD = process.cwd();
const ORIGINAL_CONFIG_JSON = process.env.CONFIG_JSON;

function isoMinutesAgo(minutes) {
  return new Date(Date.now() - minutes * 60000).toISOString();
}

function baseTask(overrides = {}) {
  return {
    task_id: 'TASK-2026-9999',
    type: 'zero-day',
    priority: 'P0',
    status: 'pending',
    stage: 'draft',
    created: isoMinutesAgo(180),
    updated: isoMinutesAgo(180),
    locked_by: null,
    locked_at: null,
    input: {
      topic: 'Synthetic stale ready issue test',
      sources: ['https://example.com/a', 'https://example.com/b', 'https://example.com/c'],
    },
    output: {
      branch: 'pipeline/TASK-2026-9999',
      path: 'site/src/content/zero-days/synthetic.md',
    },
    acceptance_criteria: { min_sources: 3 },
    history: [
      {
        timestamp: isoMinutesAgo(180),
        action: 'created',
        from: 'none',
        to: 'pending',
        agent: 'test',
      },
    ],
    ...overrides,
  };
}

function readyIssue(overrides = {}) {
  return {
    number: 4001,
    title: '[PIPELINE] TASK-2026-9999: Synthetic stale ready issue test',
    body: '## Pipeline Task: `TASK-2026-9999`',
    html_url: 'https://github.com/example/repo/issues/4001',
    state: 'open',
    created_at: isoMinutesAgo(120),
    updated_at: isoMinutesAgo(120),
    assignees: [],
    ...overrides,
  };
}

function alertIssue(overrides = {}) {
  return {
    number: 5001,
    title: '[PIPELINE ALERT] Stalled ready issue — TASK-2026-9999',
    body: '`TASK-2026-9999` is stale',
    html_url: 'https://github.com/example/repo/issues/5001',
    state: 'open',
    created_at: isoMinutesAgo(90),
    updated_at: isoMinutesAgo(90),
    assignees: [],
    ...overrides,
  };
}

function writeTaskFixture(task) {
  fs.mkdirSync(path.join(process.cwd(), '.github', 'pipeline', 'tasks'), { recursive: true });
  fs.writeFileSync(
    path.join(process.cwd(), '.github', 'pipeline', 'tasks', `${task.task_id}.json`),
    `${JSON.stringify(task, null, 2)}\n`
  );
}

function createMockGithub({ readyIssues = [], alertIssues = [], openPrs = [] } = {}) {
  const calls = {
    createdIssues: [],
    updatedIssues: [],
    comments: [],
    issueLists: [],
    pullsListed: [],
  };

  const state = {
    readyIssues: [...readyIssues],
    alertIssues: [...alertIssues],
    openPrs: [...openPrs],
  };

  function findIssue(number) {
    return [...state.readyIssues, ...state.alertIssues, ...calls.createdIssues]
      .find((issue) => issue.number === number);
  }

  const github = {
    paginate: async (method, params) => {
      const result = await method(params);
      return result.data;
    },
    rest: {
      issues: {
        listForRepo: async ({ labels }) => {
          calls.issueLists.push(labels);
          if (labels === 'pipeline/ready') {
            return { data: state.readyIssues.filter((issue) => issue.state === 'open') };
          }
          if (labels === 'pipeline/stalled-ready-issue') {
            const createdAlerts = calls.createdIssues.filter((issue) =>
              issue.labels?.includes('pipeline/stalled-ready-issue')
            );
            return {
              data: [...state.alertIssues, ...createdAlerts].filter((issue) => issue.state === 'open'),
            };
          }
          if (labels === 'pipeline/backpressure') return { data: [] };
          return { data: [] };
        },
        create: async (params) => {
          const issue = {
            number: 9000 + calls.createdIssues.length,
            html_url: `https://github.com/example/repo/issues/${9000 + calls.createdIssues.length}`,
            state: 'open',
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
            assignees: [],
            ...params,
          };
          calls.createdIssues.push(issue);
          return { data: issue };
        },
        update: async (params) => {
          calls.updatedIssues.push(params);
          const issue = findIssue(params.issue_number);
          if (issue) Object.assign(issue, params);
          return { data: issue || params };
        },
        createComment: async (params) => {
          calls.comments.push(params);
          return { data: params };
        },
      },
      pulls: {
        get: async ({ pull_number }) => {
          const pr = state.openPrs.find((candidate) => candidate.number === pull_number);
          if (!pr) {
            const error = new Error('not found');
            error.status = 404;
            throw error;
          }
          return { data: pr };
        },
        list: async (params) => {
          calls.pullsListed.push(params);
          return { data: state.openPrs };
        },
      },
    },
  };

  return { github, calls, state };
}

async function runScenario({ task = baseTask(), tasks = null, mock }) {
  const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'threatpedia-dispatcher-test-'));
  process.chdir(tempDir);
  process.env.CONFIG_JSON = JSON.stringify({
    ready_issue: {
      warn_minutes: 30,
      stall_minutes: 90,
      stall_minutes_by_priority: { P0: 60 },
    },
  });

  try {
    for (const item of tasks || [task]) {
      writeTaskFixture(item);
    }
    await runDispatcher({
      github: mock.github,
      context: { repo: { owner: 'example', repo: 'repo' } },
      core: { warning: () => {} },
    });
  } finally {
    process.chdir(ORIGINAL_CWD);
    if (ORIGINAL_CONFIG_JSON === undefined) delete process.env.CONFIG_JSON;
    else process.env.CONFIG_JSON = ORIGINAL_CONFIG_JSON;
    fs.rmSync(tempDir, { recursive: true, force: true });
  }
}

async function testStaleUnassignedReadyIssueCreatesAlert() {
  const mock = createMockGithub({ readyIssues: [readyIssue()] });

  await runScenario({ mock });

  const alert = mock.calls.createdIssues.find((issue) =>
    issue.labels?.includes('pipeline/stalled-ready-issue')
  );
  assert.ok(alert, 'expected a stalled-ready alert to be created');
  assert.match(alert.title, /TASK-2026-9999/);
  assert.match(alert.body, /no worker has consumed it/);
}

async function testStalledReadyIssueLookupIsCachedPerRun() {
  const firstTask = baseTask({ task_id: 'TASK-2026-9999' });
  const secondTask = baseTask({
    task_id: 'TASK-2026-9998',
    output: {
      branch: 'pipeline/TASK-2026-9998',
      path: 'site/src/content/zero-days/synthetic-2.md',
    },
  });
  const mock = createMockGithub({
    readyIssues: [
      readyIssue(),
      readyIssue({
        number: 4002,
        title: '[PIPELINE] TASK-2026-9998: Synthetic stale ready issue test',
        body: '## Pipeline Task: `TASK-2026-9998`',
      }),
    ],
  });

  await runScenario({ tasks: [firstTask, secondTask], mock });

  const stalledListCalls = mock.calls.issueLists.filter((label) => label === 'pipeline/stalled-ready-issue');
  assert.equal(stalledListCalls.length, 1, 'stalled-ready alerts should be listed once per dispatcher run');
  assert.equal(
    mock.calls.createdIssues.filter((issue) => issue.labels?.includes('pipeline/stalled-ready-issue')).length,
    2,
    'both stale ready issues should still create alerts from the cached list'
  );
}

async function testRecentlyAssignedReadyIssueClosesAlertImmediately() {
  const existingAlert = alertIssue();
  const mock = createMockGithub({
    readyIssues: [
      readyIssue({
        assignees: [{ login: 'human-owner' }],
        updated_at: isoMinutesAgo(5),
      }),
    ],
    alertIssues: [existingAlert],
  });

  await runScenario({ mock });

  const newAlerts = mock.calls.createdIssues.filter((issue) =>
    issue.labels?.includes('pipeline/stalled-ready-issue')
  );
  assert.equal(newAlerts.length, 0, 'assigned ready issue should not create a new stalled alert');
  assert.equal(existingAlert.state, 'closed', 'existing stalled alert should close after ownership appears');
}

async function testCoveringPrClosesReadyIssueAndAlert() {
  const primaryIssue = readyIssue();
  const existingAlert = alertIssue();
  const mock = createMockGithub({
    readyIssues: [primaryIssue],
    alertIssues: [existingAlert],
    openPrs: [
      {
        number: 7001,
        state: 'open',
        html_url: 'https://github.com/example/repo/pull/7001',
      },
    ],
  });

  await runScenario({ mock });

  assert.equal(primaryIssue.state, 'closed', 'ready issue should close when a covering PR exists');
  assert.equal(existingAlert.state, 'closed', 'stalled alert should close when a covering PR exists');
  assert.ok(
    mock.calls.updatedIssues.some((update) => update.issue_number === primaryIssue.number),
    'expected the ready issue close to call issues.update'
  );
}

async function testPrBackedTaskClosesAlertWithoutReadyIssue() {
  const existingAlert = alertIssue();
  const mock = createMockGithub({
    alertIssues: [existingAlert],
    openPrs: [
      {
        number: 7001,
        state: 'open',
        html_url: 'https://github.com/example/repo/pull/7001',
      },
    ],
  });

  await runScenario({
    task: baseTask({
      status: 'pr_open',
      pr_number: 7001,
      pr_url: 'https://github.com/example/repo/pull/7001',
    }),
    mock,
  });

  assert.equal(existingAlert.state, 'closed', 'pr_open task should close stale alert even without a ready issue');
  assert.ok(
    mock.calls.comments.some((comment) => comment.issue_number === existingAlert.number),
    'expected stale alert close to leave an explanatory comment'
  );
}

async function main() {
  await testStaleUnassignedReadyIssueCreatesAlert();
  await testStalledReadyIssueLookupIsCachedPerRun();
  await testRecentlyAssignedReadyIssueClosesAlertImmediately();
  await testCoveringPrClosesReadyIssueAndAlert();
  await testPrBackedTaskClosesAlertWithoutReadyIssue();
  console.log('pipeline-dispatcher stall tests passed');
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
