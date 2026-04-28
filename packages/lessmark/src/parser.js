import { CORE_BLOCKS } from "./grammar.js";
import { CONTROL_WHITESPACE_PATTERN, DECISION_ID_PATTERN, HTML_TAG_PATTERN, getBlockAttrErrors, getBlockBodyErrors, getLegacyMarkdownLineError, getLocalAnchorErrors, isSafeHref } from "./rules.js";

const BLOCK_ALIASES = {
  p: { name: "paragraph", attrs: {} },
  note: { name: "callout", attrs: { kind: "note" } },
  warning: { name: "callout", attrs: { kind: "warning" } },
  ul: { name: "list", attrs: { kind: "unordered" } },
  ol: { name: "list", attrs: { kind: "ordered" } }
};

const SHORTHAND_ATTRS = {
  api: "name",
  callout: "kind",
  code: "lang",
  diagram: "kind",
  decision: "id",
  definition: "term",
  "depends-on": "target",
  file: "path",
  footnote: "id",
  link: "href",
  math: "notation",
  metadata: "key",
  reference: "target",
  risk: "level",
  table: "columns",
  task: "status"
};

export class LessmarkError extends Error {
  constructor(message, line = 1, column = 1) {
    super(`${message} at ${line}:${column}`);
    this.name = "LessmarkError";
    this.message = message;
    this.line = line;
    this.column = column;
  }
}

export function parseLessmark(source, options = {}) {
  const normalized = normalizeSource(source);
  const lines = normalized.split("\n");
  const children = [];
  let index = 0;
  const sourcePositions = options.sourcePositions === true;

  while (index < lines.length) {
    const line = lines[index];

    if (line.trim() === "") {
      index += 1;
      continue;
    }

    if (line.startsWith("#")) {
      children.push(parseHeading(line, index + 1, sourcePositions));
      index += 1;
      continue;
    }

    if (line.startsWith("@")) {
      const parsed = parseBlock(lines, index, sourcePositions);
      children.push(parsed.node);
      index = parsed.nextIndex;
      continue;
    }

    const parsed = parsePlainParagraph(lines, index, sourcePositions);
    children.push(parsed.node);
    index = parsed.nextIndex;
  }

  const [anchorError] = getLocalAnchorErrors(children);
  if (anchorError) {
    throw new LessmarkError(anchorError, 1, 1);
  }
  return { type: "document", children };
}

function parsePlainParagraph(lines, startIndex, sourcePositions) {
  const body = [];
  let index = startIndex;
  let endLine = startIndex + 1;
  let endColumn = 1;

  while (index < lines.length) {
    const line = lines[index];
    if (line.trim() === "" || startsBlockSyntax(line)) {
      break;
    }
    const textLine = decodeLeadingBlockEscape(line);
    assertSafeText(textLine, "paragraph", index + 1, 1);
    const legacyError = getLegacyMarkdownLineError(textLine);
    if (legacyError) throw new LessmarkError(legacyError, index + 1, 1);
    body.push(textLine.trimEnd());
    endLine = index + 1;
    endColumn = line.length + 1;
    index += 1;
  }

  const node = {
    type: "block",
    name: "paragraph",
    attrs: {},
    text: canonicalizeInlineSyntax(body.join("\n"), startIndex + 1)
  };
  validateBlockBody(node, startIndex + 1);
  if (sourcePositions) {
    node.position = position(startIndex + 1, 1, endLine, endColumn);
  }
  return { node, nextIndex: index };
}

function normalizeSource(source) {
  return String(source).replace(/^\uFEFF/, "").replace(/\r\n?/g, "\n");
}

function parseHeading(line, lineNumber, sourcePositions) {
  const match = /^(#{1,6}) ([^\s].*)$/.exec(line);
  if (!match) {
    throw new LessmarkError("Invalid heading syntax", lineNumber, 1);
  }
  if (/\s#+\s*$/.test(match[2])) {
    throw new LessmarkError("Closing heading markers are not supported", lineNumber, line.length);
  }
  assertSafeText(match[2], "heading", lineNumber, line.indexOf(match[2]) + 1);
  const node = {
    type: "heading",
    level: match[1].length,
    text: match[2].trimEnd()
  };
  if (sourcePositions) {
    node.position = position(lineNumber, 1, lineNumber, line.length + 1);
  }
  return node;
}

function parseBlock(lines, startIndex, sourcePositions) {
  const header = lines[startIndex];
  const headerMatch = /^@([a-z][a-z0-9_-]*)(.*)$/.exec(header);
  if (!headerMatch) {
    throw new LessmarkError("Invalid typed block header", startIndex + 1, 1);
  }

  const normalized = normalizeBlockHeader(headerMatch[1], headerMatch[2], startIndex + 1);
  const name = normalized.name;
  if (!CORE_BLOCKS.has(name)) {
    throw new LessmarkError(`Unknown typed block "${name}"`, startIndex + 1, 2);
  }

  const attrs = { ...normalized.attrs, ...parseAttrs(normalized.rest, startIndex + 1, 1 + name.length + 1) };
  validateBlockAttrs(name, attrs, startIndex + 1);
  const body = [];
  let index = startIndex + 1;
  let endLine = startIndex + 1;
  let endColumn = header.length + 1;

  if (isBodylessBlock(name)) {
    const node = { type: "block", name, attrs, text: "" };
    validateBlockBody(node, startIndex + 1);
    if (sourcePositions) {
      node.position = position(startIndex + 1, 1, endLine, endColumn);
    }
    return { node, nextIndex: index };
  }

  while (index < lines.length) {
    const line = lines[index];
    if (body.length === 0 && line.trim() === "" && !isLiteralBlock(name)) {
      index += 1;
      continue;
    }
    if (isBlockTerminator(lines, index, name)) {
      break;
    }
    const textLine = isLiteralBlock(name) ? line : decodeLeadingBlockEscape(line);
    assertSafeText(textLine, `@${name}`, index + 1, 1);
    if (!isLiteralBlock(name)) {
      const legacyError = getLegacyMarkdownLineError(textLine);
      if (legacyError) throw new LessmarkError(legacyError, index + 1, 1);
    }
    body.push(textLine.trimEnd());
    endLine = index + 1;
    endColumn = line.length + 1;
    index += 1;
  }

  const text = body.join("\n");
  const node = {
    type: "block",
    name,
    attrs,
    text: isLiteralBlock(name) ? text : canonicalizeInlineSyntax(text, startIndex + 1)
  };
  validateBlockBody(node, startIndex + 1);
  if (sourcePositions) {
    node.position = position(startIndex + 1, 1, endLine, endColumn);
  }

  return {
    node,
    nextIndex: index
  };
}

function normalizeBlockHeader(rawName, rawRest, lineNumber) {
  const alias = BLOCK_ALIASES[rawName];
  if (alias && rawRest.trim() !== "") {
    throw new LessmarkError(`@${rawName} does not accept attributes`, lineNumber, 1);
  }
  const name = alias?.name || rawName;
  const attrs = { ...(alias?.attrs || {}) };
  let rest = rawRest;
  const shorthandAttr = SHORTHAND_ATTRS[name];
  const shorthandValue = rawRest.trim();
  if (shorthandAttr && shorthandValue && !/[=\s]/.test(shorthandValue)) {
    attrs[shorthandAttr] = shorthandValue;
    rest = "";
  }
  return { name, attrs, rest };
}

function isBlockTerminator(lines, index, name) {
  const line = lines[index];
  if (startsBlockSyntax(line)) return true;
  if (line.trim() !== "") return false;
  if (!isLiteralBlock(name)) return true;

  let next = index + 1;
  while (next < lines.length && lines[next].trim() === "") {
    next += 1;
  }
  return next >= lines.length || startsBlockSyntax(lines[next]);
}

function isLiteralBlock(name) {
  return name === "code" || name === "example" || name === "math" || name === "diagram";
}

function isBodylessBlock(name) {
  return name === "image" || name === "nav" || name === "page" || name === "separator" || name === "toc";
}

function startsBlockSyntax(line) {
  return line.startsWith("#") || line.startsWith("@");
}

function decodeLeadingBlockEscape(line) {
  if (line.startsWith("\\@") || line.startsWith("\\#")) {
    return line.slice(1);
  }
  return line;
}

function position(startLine, startColumn, endLine, endColumn) {
  return {
    start: { line: startLine, column: startColumn },
    end: { line: endLine, column: endColumn }
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
      else if (next === "|") value += "\\|";
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
  const [firstError] = getBlockAttrErrors(name, attrs);
  if (firstError) {
    throw new LessmarkError(firstError, lineNumber, 1);
  }
}

function validateBlockBody(node, lineNumber) {
  const [firstError] = getBlockBodyErrors(node);
  if (firstError) {
    throw new LessmarkError(firstError, lineNumber, 1);
  }
}

function assertSafeText(text, location, lineNumber, column) {
  if (HTML_TAG_PATTERN.test(text)) {
    throw new LessmarkError(`${location} contains raw HTML/JSX-like syntax`, lineNumber, column);
  }
}

function assertSafeAttrValue(key, value, lineNumber, column) {
  if (CONTROL_WHITESPACE_PATTERN.test(value)) {
    throw new LessmarkError(`Attribute "${key}" cannot contain control whitespace`, lineNumber, column);
  }
  assertSafeText(value, `attribute "${key}"`, lineNumber, column);
}

function canonicalizeInlineSyntax(text, lineNumber) {
  const source = String(text);
  let output = "";
  let index = 0;
  while (index < source.length) {
    const start = source.indexOf("{{", index);
    if (start === -1) {
      output += canonicalizeInlineSegment(source.slice(index), lineNumber);
      break;
    }
    output += canonicalizeInlineSegment(source.slice(index, start), lineNumber);
    const end = findInlineFunctionEnd(source, start);
    if (end === -1) {
      output += source.slice(start);
      break;
    }
    output += source.slice(start, end + 2);
    index = end + 2;
  }
  return output;
}

function canonicalizeInlineSegment(segment, lineNumber) {
  const source = String(segment);
  let output = "";
  let index = 0;
  const patterns = [
    {
      regex: /^`([^`\n]+)`/,
      render: (match) => `{{code:${match[1]}}}`
    },
    {
      regex: /^\[([^\]\n]+)\]\(([^)\s]+)\)/,
      render: (match) => {
        if (/^#[a-z0-9]+(?:-[a-z0-9]+)*$/.test(match[2])) {
          return `{{ref:${match[1]}|${match[2].slice(1)}}}`;
        }
        if (match[2].startsWith("#") && !DECISION_ID_PATTERN.test(match[2].slice(1))) {
          throw new LessmarkError("Inline ref target must be a lowercase slug", lineNumber, 1);
        }
        if (!isSafeHref(match[2])) {
          throw new LessmarkError("Inline link href must not use an executable URL scheme", lineNumber, 1);
        }
        return `{{link:${match[1]}|${match[2]}}}`;
      }
    },
    {
      regex: /^\[\^([a-z0-9]+(?:-[a-z0-9]+)*)\]/,
      render: (match) => `{{footnote:${match[1]}}}`
    },
    {
      regex: /^\*\*([^*\n]+)\*\*/,
      render: (match) => `{{strong:${match[1]}}}`
    },
    {
      regex: /^\*([^*\n]+)\*/,
      render: (match) => `{{em:${match[1]}}}`
    },
    {
      regex: /^~~([^~\n]+)~~/,
      render: (match) => `{{del:${match[1]}}}`
    },
    {
      regex: /^==([^=\n]+)==/,
      render: (match) => `{{mark:${match[1]}}}`
    }
  ];
  while (index < source.length) {
    const rest = source.slice(index);
    if (/^\*{3,}/.test(rest)) {
      throw new LessmarkError("Combined shortcut emphasis is not supported; use explicit nested inline functions", lineNumber, 1);
    }
    const matched = patterns.map((pattern) => [pattern, pattern.regex.exec(rest)]).find(([, match]) => match);
    if (matched) {
      const [pattern, match] = matched;
      output += pattern.render(match);
      index += match[0].length;
      continue;
    }
    if (/^\*\*\S/.test(rest) || /^\*\S/.test(rest)) {
      throw new LessmarkError("Ambiguous shortcut emphasis is not supported; use explicit nested inline functions", lineNumber, 1);
    }
    output += source[index];
    index += 1;
  }
  return output;
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
