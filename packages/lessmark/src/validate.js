import { parseLessmark } from "./parser.js";

const BLOCK_ATTRS = {
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

const TASK_STATUSES = new Set(["todo", "doing", "done", "blocked"]);
const HTML_TAG_PATTERN = /<\/?[A-Za-z][A-Za-z0-9:-]*(?:\s[^>]*)?>/;

export function validateSource(source) {
  const ast = parseLessmark(source);
  return validateAst(ast);
}

export function validateAst(ast) {
  const errors = [];

  if (!ast || ast.type !== "document" || !Array.isArray(ast.children)) {
    return [{ message: "AST root must be a document with children" }];
  }

  for (const node of ast.children) {
    if (node.type === "heading") {
      validateTextSafety(node.text, errors, "heading");
      continue;
    }

    if (node.type !== "block") {
      errors.push({ message: `Unknown AST node type: ${node.type}` });
      continue;
    }

    validateTextSafety(node.text, errors, `@${node.name}`);

    validateAttrs(node, errors);
  }

  return errors;
}

function validateTextSafety(text, errors, location) {
  if (HTML_TAG_PATTERN.test(text)) {
    errors.push({ message: `${location} contains raw HTML/JSX-like syntax` });
  }
}

function validateAttrs(node, errors) {
  const spec = BLOCK_ATTRS[node.name];
  if (!spec) {
    errors.push({ message: `Unknown typed block "${node.name}"` });
    return;
  }

  const attrs = node.attrs ?? {};
  for (const key of Object.keys(attrs)) {
    if (!spec.allowed.has(key)) {
      errors.push({ message: `@${node.name} does not allow attribute "${key}"` });
    }
    validateTextSafety(String(attrs[key]), errors, `attribute "${key}"`);
    if (/[\r\n\t]/.test(String(attrs[key]))) {
      errors.push({ message: `Attribute "${key}" cannot contain control whitespace` });
    }
  }

  for (const key of spec.required) {
    if (!attrs[key]) {
      errors.push({ message: `@${node.name} requires ${key}` });
    }
  }

  if (node.name === "task" && attrs.status && !TASK_STATUSES.has(attrs.status)) {
    errors.push({ message: "@task status must be one of: todo, doing, done, blocked" });
  }
  if (node.name === "decision" && attrs.id && !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(attrs.id)) {
    errors.push({ message: "@decision id must be a lowercase slug" });
  }
}
