export const CORE_BLOCK_NAMES = [
  "summary",
  "decision",
  "constraint",
  "task",
  "file",
  "example",
  "note",
  "warning",
  "api",
  "link"
];

export const CORE_BLOCKS = new Set(CORE_BLOCK_NAMES);

export const TASK_STATUSES = new Set(["todo", "doing", "done", "blocked"]);

export const BLOCK_ATTRS = {
  summary: { allowed: new Set(), required: new Set() },
  decision: { allowed: new Set(["id"]), required: new Set(["id"]) },
  constraint: { allowed: new Set(), required: new Set() },
  task: { allowed: new Set(["status"]), required: new Set(["status"]) },
  file: { allowed: new Set(["path"]), required: new Set(["path"]) },
  example: { allowed: new Set(), required: new Set() },
  note: { allowed: new Set(), required: new Set() },
  warning: { allowed: new Set(), required: new Set() },
  api: { allowed: new Set(["name"]), required: new Set(["name"]) },
  link: { allowed: new Set(["href"]), required: new Set(["href"]) }
};
