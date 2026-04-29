import { BLOCK_ATTRS, CALLOUT_KINDS, DIAGRAM_KINDS, LIST_KINDS, MATH_NOTATIONS, RISK_LEVELS, TASK_STATUSES } from "./grammar.js";

export const HTML_TAG_PATTERN = /<!--|<!doctype\b|<!\[CDATA\[|<\?|<\/?[A-Za-z][A-Za-z0-9:-]*(?:\s[^>]*)?>/i;
export const API_NAME_PATTERN = /^[A-Za-z_][A-Za-z0-9_.-]*$/;
export const CODE_LANG_PATTERN = /^[A-Za-z0-9_.+-]+$/;
export const CONTROL_WHITESPACE_PATTERN = /[\r\n\t]/;
export const MARKDOWN_REFERENCE_DEFINITION_PATTERN = /^\s{0,3}\[[^\]\n]+\]:\s+\S/;
export const MARKDOWN_THEMATIC_BREAK_PATTERN = /^(?:(?: {0,3})(?:[-*_]\s*){3,}|(?: {0,3})=+\s*)$/;
export const MARKDOWN_BLOCKQUOTE_PATTERN = /^\s{0,3}>\s?/;
export const MARKDOWN_LIST_MARKER_PATTERN = /^\s{0,3}(?:[-+*]\s+|\d+[.)]\s+)/;
export const DECISION_ID_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
export const SKILL_NAME_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
export const METADATA_KEY_PATTERN = /^[a-z][a-z0-9]*(?:[._-][a-z0-9]+)*$/;
export const DEFINITION_TERM_PATTERN = /^(?=.*\S)[^\r\n\t<>]+$/;
export const NAV_SLOTS = new Set(["primary", "footer"]);
export const MAX_INLINE_DEPTH = 128;
export const MAX_LIST_DEPTH = 128;

export function containsRawExpression(text) {
  const source = String(text);
  for (let index = 0; index < source.length; index += 1) {
    const current = source[index];
    const previous = source[index - 1] || "";
    const next = source[index + 1] || "";
    if (current === "$" && next === "{") return true;
    if (current === "{" && previous !== "{" && next !== "{") return true;
    if (current === "}" && previous !== "}" && next !== "}") return true;
  }
  return false;
}

export function isRelativeProjectPath(path) {
  return (
    path.length > 0 &&
    !path.startsWith("/") &&
    !path.startsWith("\\") &&
    !/^[A-Za-z]:[\\/]/.test(path) &&
    !/^[A-Za-z][A-Za-z0-9+.-]*:/.test(path) &&
    !path.split(/[\\/]+/).includes("..")
  );
}

export function isSafeHref(href) {
  const scheme = /^([A-Za-z][A-Za-z0-9+.-]*):/.exec(href);
  if (scheme) return ["http", "https", "mailto"].includes(scheme[1].toLowerCase());
  if (href.startsWith("//")) return false;
  if (href.startsWith("/")) return !href.split(/[\\/]+/).includes("..");
  return isRelativeProjectPath(href);
}

export function isSafeResource(src) {
  const scheme = /^([A-Za-z][A-Za-z0-9+.-]*):/.exec(src);
  if (scheme) return ["http", "https"].includes(scheme[1].toLowerCase());
  return isRelativeProjectPath(src);
}

export function hasBlockAttrSpec(name) {
  return Object.hasOwn(BLOCK_ATTRS, name);
}

export function getBlockAttrErrors(name, attrs) {
  const spec = BLOCK_ATTRS[name];
  if (!spec) {
    return [`Unknown typed block "${name}"`];
  }

  const errors = [];
  for (const key of Object.keys(attrs)) {
    if (!spec.allowed.has(key)) {
      errors.push(`@${name} does not allow attribute "${key}"`);
    }
  }

  for (const key of spec.required) {
    if (!Object.hasOwn(attrs, key) || attrs[key] === "") {
      errors.push(`@${name} requires ${key}`);
    }
  }

  const semanticError = getSemanticAttrError(name, attrs);
  if (semanticError) {
    errors.push(semanticError);
  }

  return errors;
}

export function getBlockBodyErrors(node) {
  const attrs = node.attrs ?? {};
  if (["image", "nav", "page", "separator", "toc"].includes(node.name) && node.text.trim() !== "") {
    return [`@${node.name} must not have a body`];
  }
  if (node.name === "list") {
    return getListBodyErrors(node.text);
  }
  if (node.name === "table") {
    return getTableBodyErrors(attrs.columns ?? "", node.text);
  }
  if (!["code", "example", "math", "diagram"].includes(node.name)) {
    const legacyError = getLegacyMarkdownBodyError(node.text);
    if (legacyError) return [legacyError];
  }
  return [];
}

export function getLegacyMarkdownLineError(line) {
  if (MARKDOWN_REFERENCE_DEFINITION_PATTERN.test(line)) {
    return "Markdown reference definitions are not supported; use @reference or {{ref:label|target}}";
  }
  if (MARKDOWN_THEMATIC_BREAK_PATTERN.test(line)) {
    return "Markdown thematic breaks and setext underlines are not supported; use @separator or # headings";
  }
  if (MARKDOWN_BLOCKQUOTE_PATTERN.test(line)) {
    return "Markdown blockquote markers are not supported in Lessmark source; use @quote or @callout";
  }
  if (MARKDOWN_LIST_MARKER_PATTERN.test(line)) {
    return "Markdown list markers are not supported in Lessmark prose; use @list";
  }
  return null;
}

function getLegacyMarkdownBodyError(text) {
  for (const line of String(text).split("\n")) {
    const error = getLegacyMarkdownLineError(line);
    if (error) return error;
  }
  return null;
}

function getSemanticAttrError(name, attrs) {
  if (name === "task" && typeof attrs.status === "string" && attrs.status && !TASK_STATUSES.has(attrs.status)) {
    return "@task status must be one of: todo, doing, done, blocked";
  }
  if (name === "skill" && typeof attrs.name === "string" && attrs.name) {
    if (!SKILL_NAME_PATTERN.test(attrs.name) || attrs.name.length > 64 || attrs.name.includes("--")) {
      return "@skill name must be 1-64 lowercase letters, numbers, and single hyphens";
    }
  }
  if (name === "skill" && typeof attrs.description === "string" && attrs.description && attrs.description.length > 1024) {
    return "@skill description must be 1-1024 characters";
  }
  if (name === "skill" && typeof attrs.compatibility === "string" && attrs.compatibility && attrs.compatibility.length > 500) {
    return "@skill compatibility must be 1-500 characters";
  }
  if (name === "decision" && typeof attrs.id === "string" && attrs.id && !DECISION_ID_PATTERN.test(attrs.id)) {
    return "@decision id must be a lowercase slug";
  }
  if (name === "file" && typeof attrs.path === "string" && attrs.path && !isRelativeProjectPath(attrs.path)) {
    return "@file path must be a relative project path";
  }
  if (name === "api" && typeof attrs.name === "string" && attrs.name && !API_NAME_PATTERN.test(attrs.name)) {
    return "@api name must be an identifier";
  }
  if (name === "link" && typeof attrs.href === "string" && attrs.href && !isSafeHref(attrs.href)) {
    return "@link href must be http, https, mailto, or a safe relative path";
  }
  if (name === "code" && typeof attrs.lang === "string" && attrs.lang && !CODE_LANG_PATTERN.test(attrs.lang)) {
    return "@code lang must be a compact language identifier";
  }
  if (name === "metadata" && typeof attrs.key === "string" && attrs.key && !METADATA_KEY_PATTERN.test(attrs.key)) {
    return "@metadata key must be a lowercase dotted key";
  }
  if (name === "risk" && typeof attrs.level === "string" && attrs.level && !RISK_LEVELS.has(attrs.level)) {
    return "@risk level must be one of: low, medium, high, critical";
  }
  if (name === "callout" && typeof attrs.kind === "string" && attrs.kind && !CALLOUT_KINDS.has(attrs.kind)) {
    return "@callout kind must be one of: note, tip, warning, caution";
  }
  if (name === "list" && typeof attrs.kind === "string" && attrs.kind && !LIST_KINDS.has(attrs.kind)) {
    return "@list kind must be one of: unordered, ordered";
  }
  if (name === "table" && typeof attrs.columns === "string" && attrs.columns && !isValidTableColumns(attrs.columns)) {
    return "@table columns must be pipe-separated non-empty labels";
  }
  if (name === "image" && typeof attrs.src === "string" && attrs.src && !isSafeResource(attrs.src)) {
    return "@image src must be a safe relative, http, or https URL";
  }
  if (name === "math" && typeof attrs.notation === "string" && attrs.notation && !MATH_NOTATIONS.has(attrs.notation)) {
    return "@math notation must be one of: tex, asciimath";
  }
  if (name === "diagram" && typeof attrs.kind === "string" && attrs.kind && !DIAGRAM_KINDS.has(attrs.kind)) {
    return "@diagram kind must be one of: mermaid, graphviz, plantuml";
  }
  if (name === "nav" && typeof attrs.label === "string" && attrs.label && !DEFINITION_TERM_PATTERN.test(attrs.label)) {
    return "@nav label must be plain single-line text";
  }
  if (name === "nav" && typeof attrs.href === "string" && attrs.href && !isSafeHref(attrs.href)) {
    return "@nav href must be http, https, mailto, or a safe relative path";
  }
  if (name === "nav" && Object.hasOwn(attrs, "slot") && typeof attrs.slot === "string" && !NAV_SLOTS.has(attrs.slot)) {
    return "@nav slot must be primary or footer";
  }
  if (name === "footnote" && typeof attrs.id === "string" && attrs.id && !DECISION_ID_PATTERN.test(attrs.id)) {
    return "@footnote id must be a lowercase slug";
  }
  if (name === "definition" && typeof attrs.term === "string" && attrs.term && !DEFINITION_TERM_PATTERN.test(attrs.term)) {
    return "@definition term must be plain single-line text";
  }
  if (name === "reference" && typeof attrs.target === "string" && attrs.target && !DECISION_ID_PATTERN.test(attrs.target)) {
    return "@reference target must be a lowercase slug";
  }
  if (name === "page" && typeof attrs.output === "string" && attrs.output && !isSafePageOutput(attrs.output)) {
    return "@page output must be a safe relative .html path";
  }
  if (name === "depends-on" && typeof attrs.target === "string" && attrs.target && !DECISION_ID_PATTERN.test(attrs.target)) {
    return "@depends-on target must be a lowercase slug";
  }
  return null;
}

export function isSafePageOutput(output) {
  return isRelativeProjectPath(output) && output.endsWith(".html");
}

export function getLocalAnchorErrors(children) {
  const errors = [];
  const seen = new Set();
  const headingCounts = new Map();
  const targets = new Set();
  for (const node of children) {
    if (node === null || typeof node !== "object") continue;
    let slugs = [];
    if (node.type === "heading") {
      const base = slugifyLocalAnchor(node.text);
      const next = (headingCounts.get(base) || 0) + 1;
      headingCounts.set(base, next);
      slugs = [next === 1 ? base : `${base}-${next}`];
    } else if (node.type === "block" && node.name === "decision") {
      slugs = [node.attrs?.id || ""];
    } else if (node.type === "block" && node.name === "footnote") {
      const id = node.attrs?.id || "";
      slugs = [id, id ? `fn-${id}` : ""];
    }
    for (const slug of slugs) {
      if (!slug) continue;
      if (seen.has(slug)) {
        errors.push(`Duplicate local anchor slug "${slug}"`);
      } else {
        seen.add(slug);
        targets.add(slug);
      }
    }
  }
  for (const node of children) {
    if (node?.type !== "block" || node.name !== "reference") continue;
    const target = node.attrs?.target || "";
    const footnoteTarget = target ? `fn-${target}` : "";
    if (target && !targets.has(target) && !targets.has(footnoteTarget)) {
      errors.push(`Unknown local reference target "${target}"`);
    }
  }
  for (const target of collectInlineLocalTargets(children)) {
    const footnoteTarget = target ? `fn-${target}` : "";
    if (target && DECISION_ID_PATTERN.test(target) && !targets.has(target) && !targets.has(footnoteTarget)) {
      errors.push(`Unknown inline local target "${target}"`);
    }
  }
  return errors;
}

function collectInlineLocalTargets(children) {
  const targets = [];
  for (const node of children) {
    if (node?.type === "heading") {
      targets.push(...inlineTargetsFromText(node.text));
    } else if (node?.type === "block" && !["code", "example", "math", "diagram"].includes(node.name)) {
      targets.push(...inlineTargetsFromText(node.text));
      for (const key of ["label", "cite", "title", "caption", "term"]) {
        if (typeof node.attrs?.[key] === "string") targets.push(...inlineTargetsFromText(node.attrs[key]));
      }
    }
  }
  return targets;
}

function inlineTargetsFromText(text, depth = 0) {
  if (depth > MAX_INLINE_DEPTH) return [];
  const source = String(text);
  const targets = [];
  let index = 0;
  while (index < source.length) {
    const start = source.indexOf("{{", index);
    if (start === -1) break;
    const end = findInlineFunctionEnd(source, start);
    if (end === -1) break;
    const inner = source.slice(start + 2, end);
    const separator = inner.indexOf(":");
    if (separator > 0) {
      const name = inner.slice(0, separator).trim();
      const value = inner.slice(separator + 1);
      if (name === "ref") {
        const delimiter = value.indexOf("|");
        if (delimiter !== -1) targets.push(value.slice(delimiter + 1).trim());
        targets.push(...inlineTargetsFromText(value.slice(0, Math.max(0, delimiter)), depth + 1));
      } else if (name === "footnote") {
        targets.push(value.trim());
      } else if (["strong", "em", "del", "mark", "link"].includes(name)) {
        targets.push(...inlineTargetsFromText(name === "link" ? value.split("|", 1)[0] : value, depth + 1));
      }
    }
    index = end + 2;
  }
  return targets;
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

function isValidTableColumns(columns) {
  const labels = splitTableRow(columns);
  return labels.length >= 1 && labels.every(Boolean);
}

function getListBodyErrors(text) {
  const lines = String(text).split("\n").filter((line) => line.trim() !== "");
  let previousLevel = 0;
  let seenItem = false;
  for (const line of lines) {
    const match = /^( *)- (.*)$/.exec(line);
    if (!match) {
      return ["@list items must use one explicit '- ' item marker per line"];
    }
    if (match[1].length % 2 !== 0) {
      return ["@list nesting must use two spaces per level"];
    }
    if (match[2].trim() === "") {
      return ["@list items cannot be empty"];
    }
    const level = match[1].length / 2;
    if (!seenItem && level !== 0) {
      return ["@list must start at the top level"];
    }
    if (level > previousLevel + 1) {
      return ["@list nesting cannot skip levels"];
    }
    if (level > MAX_LIST_DEPTH) {
      return ["@list nesting is too deep"];
    }
    if (/\t/.test(line)) {
      return ["@list items must use one explicit '- ' item marker per line"];
    }
    previousLevel = level;
    seenItem = true;
  }
  return [];
}

function getTableBodyErrors(columns, text) {
  const columnCount = splitTableRow(columns).length;
  for (const line of String(text).split("\n").filter((row) => row.trim() !== "")) {
    const cells = splitTableRow(line);
    if (cells.length !== columnCount) return ["@table row cell count must match columns"];
  }
  return [];
}

export function splitTableRow(value) {
  const cells = [];
  let cell = "";
  let escaping = false;
  for (const char of String(value)) {
    if (escaping) {
      if (char !== "|" && char !== "\\") cell += "\\";
      cell += char;
      escaping = false;
      continue;
    }
    if (char === "\\") {
      escaping = true;
      continue;
    }
    if (char === "|") {
      cells.push(cell.trim());
      cell = "";
      continue;
    }
    cell += char;
  }
  if (escaping) cell += "\\";
  cells.push(cell.trim());
  return cells;
}

function slugifyLocalAnchor(text) {
  return String(text)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "") || "section";
}
