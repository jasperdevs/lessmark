import { LessmarkError, parseLessmark } from "./parser.js";
import { CONTROL_WHITESPACE_PATTERN, HTML_TAG_PATTERN, getBlockAttrErrors, hasBlockAttrSpec } from "./rules.js";

export function validateSource(source) {
  try {
    return validateAst(parseLessmark(source));
  } catch (error) {
    if (error instanceof LessmarkError) {
      return [toValidationError(error)];
    }
    throw error;
  }
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
      validateExactKeys(node, ["type", "level", "text"], errors, "heading", ["position"]);
      validatePosition(node.position, errors, "heading");
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

    validateExactKeys(node, ["type", "name", "attrs", "text"], errors, `@${node.name}`, ["position"]);
    validatePosition(node.position, errors, `@${node.name}`);
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
  if (!hasBlockAttrSpec(node.name)) {
    errors.push({ message: `Unknown typed block "${node.name}"` });
    return;
  }

  const attrs = node.attrs ?? {};
  if (!isPlainObject(attrs)) {
    errors.push({ message: `@${node.name} attrs must be an object` });
    return;
  }
  for (const key of Object.keys(attrs)) {
    if (typeof attrs[key] !== "string") {
      errors.push({ message: `Attribute "${key}" must be a string` });
      continue;
    }
    validateTextSafety(String(attrs[key]), errors, `attribute "${key}"`);
    if (CONTROL_WHITESPACE_PATTERN.test(String(attrs[key]))) {
      errors.push({ message: `Attribute "${key}" cannot contain control whitespace` });
    }
  }

  for (const message of getBlockAttrErrors(node.name, attrs)) {
    errors.push({ message });
  }
}

function isPlainObject(value) {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}

function validatePosition(position, errors, location) {
  if (position === undefined) return;
  if (!isPlainObject(position) || !isPoint(position.start) || !isPoint(position.end)) {
    errors.push({ message: `${location} position must have start/end line and column numbers` });
  }
}

function isPoint(value) {
  return (
    isPlainObject(value) &&
    Number.isInteger(value.line) &&
    value.line > 0 &&
    Number.isInteger(value.column) &&
    value.column > 0
  );
}

function validateExactKeys(value, expected, errors, location, optional = []) {
  const allowed = new Set([...expected, ...optional]);
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

function toValidationError(error) {
  const result = { message: error.message };
  if (Number.isInteger(error.line)) result.line = error.line;
  if (Number.isInteger(error.column)) result.column = error.column;
  return result;
}
