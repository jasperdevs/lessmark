// Inlined Lessmark parser — keeps the page self-contained.
// Mirrors packages/lessmark/src/parser.js.

const CORE_BLOCKS = new Set([
  "summary", "decision", "constraint", "task", "file", "code",
  "example", "note", "warning", "api", "link", "metadata",
  "risk", "depends-on",
]);

type AttrSpec = { allowed: Set<string>; required: Set<string> };
const BLOCK_ATTRS: Record<string, AttrSpec> = {
  summary:    { allowed: new Set(),         required: new Set() },
  decision:   { allowed: new Set(["id"]),   required: new Set(["id"]) },
  constraint: { allowed: new Set(),         required: new Set() },
  task:       { allowed: new Set(["status"]), required: new Set(["status"]) },
  file:       { allowed: new Set(["path"]), required: new Set(["path"]) },
  code:       { allowed: new Set(["lang"]), required: new Set() },
  example:    { allowed: new Set(),         required: new Set() },
  note:       { allowed: new Set(),         required: new Set() },
  warning:    { allowed: new Set(),         required: new Set() },
  api:        { allowed: new Set(["name"]), required: new Set(["name"]) },
  link:       { allowed: new Set(["href"]), required: new Set(["href"]) },
  metadata:   { allowed: new Set(["key"]), required: new Set(["key"]) },
  risk:       { allowed: new Set(["level"]), required: new Set(["level"]) },
  "depends-on": { allowed: new Set(["target"]), required: new Set(["target"]) },
};
const TASK_STATUSES = new Set(["todo", "doing", "done", "blocked"]);
const RISK_LEVELS = new Set(["low", "medium", "high", "critical"]);
const HTML_TAG_PATTERN = /<\/?[A-Za-z][A-Za-z0-9:-]*(?:\s[^>]*)?>/;
const API_NAME_PATTERN = /^[A-Za-z_][A-Za-z0-9_.-]*$/;
const CODE_LANG_PATTERN = /^[A-Za-z0-9_.+-]+$/;
const DECISION_ID_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const METADATA_KEY_PATTERN = /^[a-z][a-z0-9]*(?:[._-][a-z0-9]+)*$/;

export class LessmarkError extends Error {
  line: number;
  column: number;
  constructor(message: string, line = 1, column = 1) {
    super(`${message} at ${line}:${column}`);
    this.name = "LessmarkError";
    this.message = message;
    this.line = line;
    this.column = column;
  }
}

function normalizeSource(source: string): string {
  return String(source).replace(/^﻿/, "").replace(/\r\n?/g, "\n");
}
function assertSafeText(text: string, location: string, lineNumber: number, column: number) {
  if (HTML_TAG_PATTERN.test(text)) {
    throw new LessmarkError(`${location} contains raw HTML/JSX-like syntax`, lineNumber, column);
  }
}
function assertSafeAttrValue(key: string, value: string, lineNumber: number, column: number) {
  if (/[\r\n\t]/.test(value)) {
    throw new LessmarkError(`Attribute "${key}" cannot contain control whitespace`, lineNumber, column);
  }
  assertSafeText(value, `attribute "${key}"`, lineNumber, column);
}
function readQuoted(input: string, quoteIndex: number, lineNumber: number, startColumn: number) {
  let value = "";
  let index = quoteIndex + 1;
  while (index < input.length) {
    const char = input[index];
    if (char === '"') return { value, nextIndex: index + 1 };
    if (char === "\\") {
      const next = input[index + 1];
      if (next === undefined) throw new LessmarkError("Unterminated escape sequence", lineNumber, startColumn + index);
      if (next === '"' || next === "\\") value += next;
      else throw new LessmarkError(`Unsupported escape \\${next}`, lineNumber, startColumn + index);
      index += 2;
      continue;
    }
    value += char;
    index += 1;
  }
  throw new LessmarkError("Unterminated quoted attribute", lineNumber, startColumn + quoteIndex);
}
function parseAttrs(input: string, lineNumber: number, startColumn: number) {
  const attrs: Record<string, string> = {};
  let index = 0;
  while (index < input.length) {
    if (/\s/.test(input[index])) { index += 1; continue; }
    const keyMatch = /^[a-z][a-z0-9_-]*/.exec(input.slice(index));
    if (!keyMatch) throw new LessmarkError("Invalid attribute name", lineNumber, startColumn + index);
    const key = keyMatch[0];
    index += key.length;
    if (input[index] !== "=") throw new LessmarkError("Expected = after attribute name", lineNumber, startColumn + index);
    index += 1;
    if (input[index] !== '"') throw new LessmarkError("Attribute values must be double-quoted", lineNumber, startColumn + index);
    const parsed = readQuoted(input, index, lineNumber, startColumn);
    if (Object.hasOwn(attrs, key)) throw new LessmarkError(`Duplicate attribute "${key}"`, lineNumber, startColumn + index);
    assertSafeAttrValue(key, parsed.value, lineNumber, startColumn + index);
    attrs[key] = parsed.value;
    index = parsed.nextIndex;
  }
  return attrs;
}
function validateBlockAttrs(name: string, attrs: Record<string, string>, lineNumber: number) {
  const spec = BLOCK_ATTRS[name];
  for (const key of Object.keys(attrs)) {
    if (!spec.allowed.has(key)) throw new LessmarkError(`@${name} does not allow attribute "${key}"`, lineNumber, 1);
  }
  for (const key of spec.required) {
    if (!attrs[key]) throw new LessmarkError(`@${name} requires ${key}`, lineNumber, 1);
  }
  if (name === "task" && !TASK_STATUSES.has(attrs.status)) {
    throw new LessmarkError("@task status must be one of: todo, doing, done, blocked", lineNumber, 1);
  }
  if (name === "decision" && !DECISION_ID_PATTERN.test(attrs.id)) {
    throw new LessmarkError("@decision id must be a lowercase slug", lineNumber, 1);
  }
  if (name === "file" && !_isRelativeProjectPath(attrs.path)) {
    throw new LessmarkError("@file path must be a relative project path", lineNumber, 1);
  }
  if (name === "api" && !API_NAME_PATTERN.test(attrs.name)) {
    throw new LessmarkError("@api name must be an identifier", lineNumber, 1);
  }
  if (name === "link" && !_isSafeHref(attrs.href)) {
    throw new LessmarkError("@link href must not use an executable URL scheme", lineNumber, 1);
  }
  if (name === "code" && attrs.lang && !CODE_LANG_PATTERN.test(attrs.lang)) {
    throw new LessmarkError("@code lang must be a compact language identifier", lineNumber, 1);
  }
  if (name === "metadata" && !METADATA_KEY_PATTERN.test(attrs.key)) {
    throw new LessmarkError("@metadata key must be a lowercase dotted key", lineNumber, 1);
  }
  if (name === "risk" && !RISK_LEVELS.has(attrs.level)) {
    throw new LessmarkError("@risk level must be one of: low, medium, high, critical", lineNumber, 1);
  }
  if (name === "depends-on" && !DECISION_ID_PATTERN.test(attrs.target)) {
    throw new LessmarkError("@depends-on target must be a lowercase slug", lineNumber, 1);
  }
}
function _isRelativeProjectPath(path: string) {
  return (
    path.length > 0 &&
    !path.startsWith("/") &&
    !path.startsWith("\\") &&
    !/^[A-Za-z]:[\\/]/.test(path) &&
    !/^[A-Za-z][A-Za-z0-9+.-]*:/.test(path) &&
    !path.split(/[\\/]+/).includes("..")
  );
}
function _isSafeHref(href: string) {
  const scheme = /^([A-Za-z][A-Za-z0-9+.-]*):/.exec(href);
  return !scheme || ["http", "https", "mailto"].includes(scheme[1].toLowerCase());
}
function parseHeading(line: string, lineNumber: number, sourcePositions: boolean) {
  const match = /^(#{1,6}) ([^\s].*)$/.exec(line);
  if (!match) throw new LessmarkError("Invalid heading syntax", lineNumber, 1);
  if (/\s#+\s*$/.test(match[2])) throw new LessmarkError("Closing heading markers are not supported", lineNumber, line.length);
  assertSafeText(match[2], "heading", lineNumber, line.indexOf(match[2]) + 1);
  const node: { type: "heading"; level: number; text: string; position?: PositionRange } = {
    type: "heading",
    level: match[1].length,
    text: match[2].trimEnd(),
  };
  if (sourcePositions) node.position = position(lineNumber, 1, lineNumber, line.length + 1);
  return node;
}
function parseBlock(lines: string[], startIndex: number, sourcePositions: boolean) {
  const header = lines[startIndex];
  const headerMatch = /^@([a-z][a-z0-9_-]*)(.*)$/.exec(header);
  if (!headerMatch) throw new LessmarkError("Invalid typed block header", startIndex + 1, 1);
  const name = headerMatch[1];
  if (!CORE_BLOCKS.has(name)) throw new LessmarkError(`Unknown typed block "${name}"`, startIndex + 1, 2);
  const attrs = parseAttrs(headerMatch[2], startIndex + 1, 1 + name.length + 1);
  validateBlockAttrs(name, attrs, startIndex + 1);
  const body: string[] = [];
  let index = startIndex + 1;
  let endLine = startIndex + 1;
  let endColumn = header.length + 1;
  while (index < lines.length) {
    const line = lines[index];
    if (line.trim() === "" || line.startsWith("#") || line.startsWith("@")) break;
    assertSafeText(line, `@${name}`, index + 1, 1);
    body.push(line.trimEnd());
    endLine = index + 1;
    endColumn = line.length + 1;
    index += 1;
  }
  const node: { type: "block"; name: string; attrs: Record<string, string>; text: string; position?: PositionRange } = {
    type: "block",
    name,
    attrs,
    text: body.join("\n"),
  };
  if (sourcePositions) node.position = position(startIndex + 1, 1, endLine, endColumn);
  return { node, nextIndex: index };
}

function position(startLine: number, startColumn: number, endLine: number, endColumn: number): PositionRange {
  return {
    start: { line: startLine, column: startColumn },
    end: { line: endLine, column: endColumn },
  };
}

export type LessmarkAst = {
  type: "document";
  children: Array<
    | { type: "heading"; level: number; text: string; position?: PositionRange }
    | { type: "block"; name: string; attrs: Record<string, string>; text: string; position?: PositionRange }
  >;
};

type PositionRange = {
  start: { line: number; column: number };
  end: { line: number; column: number };
};

export function parseLessmark(source: string, options: { sourcePositions?: boolean } = {}): LessmarkAst {
  const lines = normalizeSource(source).split("\n");
  const children: LessmarkAst["children"] = [];
  let index = 0;
  const sourcePositions = options.sourcePositions === true;
  while (index < lines.length) {
    const line = lines[index];
    if (line.trim() === "") { index += 1; continue; }
    if (line.startsWith("#")) { children.push(parseHeading(line, index + 1, sourcePositions)); index += 1; continue; }
    if (line.startsWith("@")) { const p = parseBlock(lines, index, sourcePositions); children.push(p.node); index = p.nextIndex; continue; }
    throw new LessmarkError("Loose text is not allowed outside a typed block", index + 1, 1);
  }
  return { type: "document", children };
}
