export const CORE_BLOCKS = new Set([
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
]);

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

export class LessmarkError extends Error {
  constructor(message, line = 1, column = 1) {
    super(`${message} at ${line}:${column}`);
    this.name = "LessmarkError";
    this.message = message;
    this.line = line;
    this.column = column;
  }
}

export function parseLessmark(source) {
  const normalized = normalizeSource(source);
  const lines = normalized.split("\n");
  const children = [];
  let index = 0;

  while (index < lines.length) {
    const line = lines[index];

    if (line.trim() === "") {
      index += 1;
      continue;
    }

    if (line.startsWith("#")) {
      children.push(parseHeading(line, index + 1));
      index += 1;
      continue;
    }

    if (line.startsWith("@")) {
      const parsed = parseBlock(lines, index);
      children.push(parsed.node);
      index = parsed.nextIndex;
      continue;
    }

    throw new LessmarkError("Loose text is not allowed outside a typed block", index + 1, 1);
  }

  return { type: "document", children };
}

function normalizeSource(source) {
  return String(source).replace(/^\uFEFF/, "").replace(/\r\n?/g, "\n");
}

function parseHeading(line, lineNumber) {
  const match = /^(#{1,6}) ([^#].*|[^\s].*|.*)$/.exec(line);
  if (!match) {
    throw new LessmarkError("Invalid heading syntax", lineNumber, 1);
  }
  if (/\s#+\s*$/.test(match[2])) {
    throw new LessmarkError("Closing heading markers are not supported", lineNumber, line.length);
  }
  assertSafeText(match[2], "heading", lineNumber, line.indexOf(match[2]) + 1);
  return {
    type: "heading",
    level: match[1].length,
    text: match[2].trimEnd()
  };
}

function parseBlock(lines, startIndex) {
  const header = lines[startIndex];
  const headerMatch = /^@([a-z][a-z0-9_-]*)(.*)$/.exec(header);
  if (!headerMatch) {
    throw new LessmarkError("Invalid typed block header", startIndex + 1, 1);
  }

  const name = headerMatch[1];
  if (!CORE_BLOCKS.has(name)) {
    throw new LessmarkError(`Unknown typed block "${name}"`, startIndex + 1, 2);
  }

  const attrs = parseAttrs(headerMatch[2], startIndex + 1, 1 + name.length + 1);
  validateBlockAttrs(name, attrs, startIndex + 1);
  const body = [];
  let index = startIndex + 1;

  while (index < lines.length) {
    const line = lines[index];
    if (line.trim() === "" || line.startsWith("#") || line.startsWith("@")) {
      break;
    }
    assertSafeText(line, `@${name}`, index + 1, 1);
    body.push(line.trimEnd());
    index += 1;
  }

  return {
    node: {
      type: "block",
      name,
      attrs,
      text: body.join("\n").trim()
    },
    nextIndex: index
  };
}

function parseAttrs(input, lineNumber, startColumn) {
  const attrs = {};
  let index = 0;

  while (index < input.length) {
    if (/\s/.test(input[index])) {
      index += 1;
      continue;
    }

    const keyMatch = /^[a-z][a-z0-9_-]*/.exec(input.slice(index));
    if (!keyMatch) {
      throw new LessmarkError("Invalid attribute name", lineNumber, startColumn + index);
    }

    const key = keyMatch[0];
    index += key.length;

    if (input[index] !== "=") {
      throw new LessmarkError("Expected = after attribute name", lineNumber, startColumn + index);
    }
    index += 1;

    if (input[index] !== '"') {
      throw new LessmarkError("Attribute values must be double-quoted", lineNumber, startColumn + index);
    }

    const parsed = readQuoted(input, index, lineNumber, startColumn);
    if (Object.hasOwn(attrs, key)) {
      throw new LessmarkError(`Duplicate attribute "${key}"`, lineNumber, startColumn + index);
    }
    assertSafeAttrValue(key, parsed.value, lineNumber, startColumn + index);
    attrs[key] = parsed.value;
    index = parsed.nextIndex;
  }

  return attrs;
}

function readQuoted(input, quoteIndex, lineNumber, startColumn) {
  let value = "";
  let index = quoteIndex + 1;

  while (index < input.length) {
    const char = input[index];
    if (char === '"') {
      return { value, nextIndex: index + 1 };
    }
    if (char === "\\") {
      const next = input[index + 1];
      if (next === undefined) {
        throw new LessmarkError("Unterminated escape sequence", lineNumber, startColumn + index);
      }
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

function validateBlockAttrs(name, attrs, lineNumber) {
  const spec = BLOCK_ATTRS[name];
  for (const key of Object.keys(attrs)) {
    if (!spec.allowed.has(key)) {
      throw new LessmarkError(`@${name} does not allow attribute "${key}"`, lineNumber, 1);
    }
  }
  for (const key of spec.required) {
    if (!attrs[key]) {
      throw new LessmarkError(`@${name} requires ${key}`, lineNumber, 1);
    }
  }
  if (name === "task" && !TASK_STATUSES.has(attrs.status)) {
    throw new LessmarkError("@task status must be one of: todo, doing, done, blocked", lineNumber, 1);
  }
  if (name === "decision" && !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(attrs.id)) {
    throw new LessmarkError("@decision id must be a lowercase slug", lineNumber, 1);
  }
}

function assertSafeText(text, location, lineNumber, column) {
  if (HTML_TAG_PATTERN.test(text)) {
    throw new LessmarkError(`${location} contains raw HTML/JSX-like syntax`, lineNumber, column);
  }
}

function assertSafeAttrValue(key, value, lineNumber, column) {
  if (/[\r\n\t]/.test(value)) {
    throw new LessmarkError(`Attribute "${key}" cannot contain control whitespace`, lineNumber, column);
  }
  assertSafeText(value, `attribute "${key}"`, lineNumber, column);
}
