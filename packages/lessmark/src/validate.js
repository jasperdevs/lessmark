import { LessmarkError, parseLessmark } from "./parser.js";
import {
  CONTROL_WHITESPACE_PATTERN,
  DECISION_ID_PATTERN,
  HTML_TAG_PATTERN,
  MAX_INLINE_DEPTH,
  containsRawExpression,
  getBlockAttrErrors,
  getBlockBodyErrors,
  getLocalAnchorErrors,
  hasBlockAttrSpec,
  isSafeHref
} from "./rules.js";

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
    return [validationError("AST root must be a document with children")];
  }
  validateExactKeys(ast, ["type", "children"], errors, "document");

  for (const node of ast.children) {
    if (!isPlainObject(node)) {
      errors.push(validationError("AST child must be an object"));
      continue;
    }

    if (node.type === "heading") {
      validateExactKeys(node, ["type", "level", "text"], errors, "heading", ["position"]);
      validatePosition(node.position, errors, "heading");
      if (!Number.isInteger(node.level) || node.level < 1 || node.level > 6) {
        errors.push(validationError("heading level must be an integer from 1 to 6"));
      }
      if (typeof node.text !== "string" || node.text.length === 0) {
        errors.push(validationError("heading text must be a non-empty string"));
        continue;
      }
      validateTextSafety(node.text, errors, "heading");
      validateInlineText(node.text, errors, "heading");
      continue;
    }

    if (node.type !== "block") {
      errors.push(validationError(`Unknown AST node type: ${node.type}`));
      continue;
    }

    validateExactKeys(node, ["type", "name", "attrs", "text"], errors, `@${node.name}`, ["position"]);
    validatePosition(node.position, errors, `@${node.name}`);
    if (typeof node.text !== "string") {
      errors.push(validationError(`@${node.name} text must be a string`));
      continue;
    }
    validateTextSafety(node.text, errors, `@${node.name}`, { allowExpressions: isLiteralBlock(node.name) });
    if (!isLiteralBlock(node.name)) {
      validateInlineText(node.text, errors, `@${node.name}`);
    }
    validateBlockBody(node, errors);

    validateAttrs(node, errors);
  }
  for (const message of getLocalAnchorErrors(ast.children)) {
    errors.push(validationError(message));
  }

  return errors;
}

function isLiteralBlock(name) {
  return name === "code" || name === "example" || name === "math" || name === "diagram";
}

function validateBlockBody(node, errors) {
  for (const message of getBlockBodyErrors(node)) errors.push(validationError(message));
}

function validateTextSafety(text, errors, location, options = {}) {
  if (HTML_TAG_PATTERN.test(text)) {
    errors.push(validationError(`${location} contains raw HTML/JSX-like syntax`));
  }
  if (options.allowExpressions !== true && containsRawExpression(text)) {
    errors.push(validationError(`${location} contains raw expression-like syntax`));
  }
}

function validateInlineText(text, errors, location, depth = 0) {
  if (depth > MAX_INLINE_DEPTH) {
    errors.push(validationError(`${location} inline nesting too deep`));
    return;
  }
  const source = String(text);
  let index = 0;
  while (index < source.length) {
    const start = source.indexOf("{{", index);
    if (start === -1) return;
    const end = findInlineFunctionEnd(source, start);
    if (end === -1) {
      errors.push(validationError(`${location} has an unclosed inline function`));
      return;
    }
    validateInlineFunction(source.slice(start + 2, end), errors, location, depth + 1);
    index = end + 2;
  }
}

function findInlineFunctionEnd(source, start) {
  let depth = 1;
  let index = start + 2;
  while (index < source.length) {
    if (source.startsWith("{{", index)) {
      depth += 1;
      index += 2;
      continue;
    }
    if (source.startsWith("}}", index)) {
      depth -= 1;
      if (depth === 0) return index;
      index += 2;
      continue;
    }
    index += 1;
  }
  return -1;
}

function validateInlineFunction(source, errors, location, depth) {
  const separator = source.indexOf(":");
  if (separator <= 0) {
    errors.push(validationError(`${location} inline functions must use {{name:value}}`));
    return;
  }
  const name = source.slice(0, separator).trim();
  const value = source.slice(separator + 1);
  if (["strong", "em", "del", "mark"].includes(name)) {
    validateInlineText(value, errors, location, depth);
    return;
  }
  if (["code", "kbd", "sup", "sub"].includes(name)) return;
  if (name === "ref") {
    const [label, target] = splitOnce(value, "|");
    validateInlineText(label, errors, location, depth);
    if (!DECISION_ID_PATTERN.test(target)) errors.push(validationError("Inline ref target must be a lowercase slug"));
    return;
  }
  if (name === "footnote") {
    if (!DECISION_ID_PATTERN.test(value)) errors.push(validationError("Inline footnote target must be a lowercase slug"));
    return;
  }
  if (name === "link") {
    const [label, href] = splitOnce(value, "|");
    validateInlineText(label, errors, location, depth);
    if (!isSafeHref(href)) errors.push(validationError("Inline link href must not use an executable URL scheme"));
    return;
  }
  errors.push(validationError(`Unknown inline function "${name}"`));
}

function splitOnce(value, delimiter) {
  const index = String(value).indexOf(delimiter);
  if (index === -1) return [String(value), ""];
  return [String(value).slice(0, index).trim(), String(value).slice(index + delimiter.length).trim()];
}

function validateAttrs(node, errors) {
  if (!hasBlockAttrSpec(node.name)) {
    errors.push(validationError(`Unknown typed block "${node.name}"`));
    return;
  }

  const attrs = node.attrs ?? {};
  if (!isPlainObject(attrs)) {
    errors.push(validationError(`@${node.name} attrs must be an object`));
    return;
  }
  for (const key of Object.keys(attrs)) {
    if (typeof attrs[key] !== "string") {
      errors.push(validationError(`Attribute "${key}" must be a string`));
      continue;
    }
    validateTextSafety(String(attrs[key]), errors, `attribute "${key}"`);
    if (["label", "cite", "title", "caption", "term"].includes(key)) {
      validateInlineText(String(attrs[key]), errors, `attribute "${key}"`);
    }
    if (CONTROL_WHITESPACE_PATTERN.test(String(attrs[key]))) {
      errors.push(validationError(`Attribute "${key}" cannot contain control whitespace`));
    }
  }

  for (const message of getBlockAttrErrors(node.name, attrs)) {
    errors.push(validationError(message));
  }
}

function isPlainObject(value) {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}

function validatePosition(position, errors, location) {
  if (position === undefined) return;
  if (!isPlainObject(position) || !isPoint(position.start) || !isPoint(position.end)) {
    errors.push(validationError(`${location} position must have start/end line and column numbers`));
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
      errors.push(validationError(`${location} has unknown property "${key}"`));
    }
  }
  for (const key of expected) {
    if (!Object.hasOwn(value, key)) {
      errors.push(validationError(`${location} is missing property "${key}"`));
    }
  }
}

function toValidationError(error) {
  const result = validationError(error.message);
  if (Number.isInteger(error.line)) result.line = error.line;
  if (Number.isInteger(error.column)) result.column = error.column;
  return result;
}

function validationError(message) {
  return { code: errorCodeForMessage(message), message };
}

export function errorCodeForMessage(message) {
  if (/Unknown typed block/.test(message)) return "unknown_block";
  if (/does not allow attribute/.test(message)) return "unknown_attribute";
  if (/requires /.test(message)) return "missing_required_attribute";
  if (/Duplicate attribute/.test(message)) return "duplicate_attribute";
  if (/raw HTML\/JSX-like/.test(message)) return "raw_html";
  if (/raw expression-like/.test(message)) return "raw_expression";
  if (/inline nesting too deep/.test(message)) return "inline_nesting_too_deep";
  if (/Markdown reference definitions|Markdown thematic breaks|Markdown blockquote markers|Markdown list markers/.test(message)) return "markdown_legacy_syntax";
  if (/Loose text/.test(message)) return "loose_text";
  if (/Invalid heading/.test(message)) return "invalid_heading";
  if (/Closing heading markers/.test(message)) return "closing_heading_marker";
  if (/Invalid typed block header/.test(message)) return "invalid_block_header";
  if (/Invalid attribute name/.test(message)) return "invalid_attribute_name";
  if (/Expected =/.test(message)) return "expected_attribute_equals";
  if (/double-quoted/.test(message)) return "unquoted_attribute";
  if (/Unsupported escape/.test(message)) return "unsupported_escape";
  if (/Unterminated/.test(message)) return "unterminated_syntax";
  if (/unclosed inline function/.test(message)) return "unterminated_syntax";
  if (/Unknown inline function/.test(message)) return "unknown_inline_function";
  if (/inline functions must use/.test(message)) return "invalid_inline_function";
  if (/control whitespace/.test(message)) return "control_whitespace";
  if (/safe relative|safe relative, http|safe relative \.html|executable URL/.test(message)) return "unsafe_link_or_path";
  if (/lowercase slug/.test(message)) return "invalid_slug";
  if (/Unknown local reference target/.test(message)) return "unknown_reference_target";
  if (/Unknown inline local target/.test(message)) return "unknown_inline_target";
  if (/Duplicate local anchor/.test(message)) return "duplicate_local_anchor";
  if (/@list/.test(message)) return "invalid_list_body";
  if (/@table/.test(message)) return "invalid_table_body";
  if (/position/.test(message)) return "invalid_position";
  if (/AST root/.test(message)) return "invalid_ast_root";
  if (/unknown property|missing property/.test(message)) return "invalid_ast_shape";
  if (/must be a string/.test(message)) return "invalid_ast_value";
  return "validation_error";
}
