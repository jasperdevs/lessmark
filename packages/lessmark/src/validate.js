import { parseLessmark } from "./parser.js";

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

    if (node.name === "file" && !node.attrs.path) {
      errors.push({ message: "@file requires path" });
    }

    if (node.name === "link" && !node.attrs.href) {
      errors.push({ message: "@link requires href" });
    }

    if (node.name === "task" && node.attrs.status && !TASK_STATUSES.has(node.attrs.status)) {
      errors.push({ message: "@task status must be one of: todo, doing, done, blocked" });
    }

    if (node.name === "decision" && node.attrs.id && !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(node.attrs.id)) {
      errors.push({ message: "@decision id must be a lowercase slug" });
    }
  }

  return errors;
}

function validateTextSafety(text, errors, location) {
  if (HTML_TAG_PATTERN.test(text)) {
    errors.push({ message: `${location} contains raw HTML/JSX-like syntax` });
  }
}