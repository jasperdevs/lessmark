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

  if (!isPlainObject(ast) || ast.type !== "document" || !Array.isArray(ast.children)) {
    return [{ message: "AST root must be a document with children" }];
  }
  validateExactKeys(ast, ["type", "children"], errors, "document");

  for (const node of ast.children) {
    if (!isPlainObject(node)) {
      errors.push({ message: "AST child must be an object" });
      continue;
    }

    if (node.type === "heading") {
      validateExactKeys(node, ["type", "level", "text"], errors, "heading");
      if (!Number.isInteger(node.level) || node.level < 1 || node.level > 6) {
        errors.push({ message: "heading level must be an integer from 1 to 6" });
      }
      if (typeof node.text !== "string" || node.text.length === 0) {
        errors.push({ message: "heading text must be a non-empty string" });
        continue;
      }
      validateTextSafety(node.text, errors, "heading");
      continue;
    }

    if (node.type !== "block") {
      errors.push({ message: `Unknown AST node type: ${node.type}` });
      continue;
    }

    validateExactKeys(node, ["type", "name", "attrs", "text"], errors, `@${node.name}`);
    if (typeof node.text !== "string") {
      errors.push({ message: `@${node.name} text must be a string` });
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
  if (!isPlainObject(attrs)) {
    errors.push({ message: `@${node.name} attrs must be an object` });
    return;
  }
  for (const key of Object.keys(attrs)) {
    if (!spec.allowed.has(key)) {
      errors.push({ message: `@${node.name} does not allow attribute "${key}"` });
    }
    if (typeof attrs[key] !== "string") {
      errors.push({ message: `Attribute "${key}" must be a string` });
      continue;
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

function isPlainObject(value) {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}

function validateExactKeys(value, expected, errors, location) {
  const allowed = new Set(expected);
  for (const key of Object.keys(value)) {
    if (!allowed.has(key)) {
      errors.push({ message: `${location} has unknown property "${key}"` });
    }
  }
  for (const key of expected) {
    if (!Object.hasOwn(value, key)) {
      errors.push({ message: `${location} is missing property "${key}"` });
    }
  }
}
