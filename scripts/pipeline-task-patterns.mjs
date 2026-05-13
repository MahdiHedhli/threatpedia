/**
 * Shared task identifier and task-file path patterns for pipeline tooling.
 *
 * Keep these as string patterns plus RegExp exports so workflow gates and
 * validators can reuse one canonical task JSON shape without duplicating it.
 */

export const PIPELINE_TASK_ID_PATTERN = 'TASK-\\d{4}-\\d+';
export const PIPELINE_TASK_FILE_NAME_PATTERN = `${PIPELINE_TASK_ID_PATTERN}\\.json`;
export const PIPELINE_TASK_FILE_PATH_PATTERN = `\\.github\\/pipeline\\/tasks\\/${PIPELINE_TASK_FILE_NAME_PATTERN}`;

export const PIPELINE_TASK_FILE_PATH_RE = new RegExp(`^${PIPELINE_TASK_FILE_PATH_PATTERN}$`);
