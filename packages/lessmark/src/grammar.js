export const CORE_BLOCK_NAMES = [
  "summary",
  "page",
  "paragraph",
  "decision",
  "constraint",
  "task",
  "file",
  "code",
  "example",
  "note",
  "warning",
  "quote",
  "callout",
  "list",
  "table",
  "image",
  "toc",
  "api",
  "link",
  "metadata",
  "risk",
  "depends-on"
];

export const CORE_BLOCKS = new Set(CORE_BLOCK_NAMES);

export const TASK_STATUSES = new Set(["todo", "doing", "done", "blocked"]);
export const RISK_LEVELS = new Set(["low", "medium", "high", "critical"]);
export const LIST_KINDS = new Set(["unordered", "ordered"]);
export const CALLOUT_KINDS = new Set(["note", "tip", "warning", "caution"]);

export const BLOCK_ATTRS = {
  summary: { allowed: new Set(), required: new Set() },
  page: { allowed: new Set(["title", "output"]), required: new Set() },
  paragraph: { allowed: new Set(), required: new Set() },
  decision: { allowed: new Set(["id"]), required: new Set(["id"]) },
  constraint: { allowed: new Set(), required: new Set() },
  task: { allowed: new Set(["status"]), required: new Set(["status"]) },
  file: { allowed: new Set(["path"]), required: new Set(["path"]) },
  code: { allowed: new Set(["lang"]), required: new Set() },
  example: { allowed: new Set(), required: new Set() },
  note: { allowed: new Set(), required: new Set() },
  warning: { allowed: new Set(), required: new Set() },
  quote: { allowed: new Set(["cite"]), required: new Set() },
  callout: { allowed: new Set(["kind", "title"]), required: new Set(["kind"]) },
  list: { allowed: new Set(["kind"]), required: new Set(["kind"]) },
  table: { allowed: new Set(["columns"]), required: new Set(["columns"]) },
  image: { allowed: new Set(["src", "alt", "caption"]), required: new Set(["src", "alt"]) },
  toc: { allowed: new Set(), required: new Set() },
  api: { allowed: new Set(["name"]), required: new Set(["name"]) },
  link: { allowed: new Set(["href"]), required: new Set(["href"]) },
  metadata: { allowed: new Set(["key"]), required: new Set(["key"]) },
  risk: { allowed: new Set(["level"]), required: new Set(["level"]) },
  "depends-on": { allowed: new Set(["target"]), required: new Set(["target"]) }
};
