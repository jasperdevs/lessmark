import { BLOCK_ATTRS, RISK_LEVELS, TASK_STATUSES } from "./grammar.js";

export const HTML_TAG_PATTERN = /<\/?[A-Za-z][A-Za-z0-9:-]*(?:\s[^>]*)?>/;
export const API_NAME_PATTERN = /^[A-Za-z_][A-Za-z0-9_.-]*$/;
export const CODE_LANG_PATTERN = /^[A-Za-z0-9_.+-]+$/;
export const CONTROL_WHITESPACE_PATTERN = /[\r\n\t]/;
export const DECISION_ID_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
export const METADATA_KEY_PATTERN = /^[a-z][a-z0-9]*(?:[._-][a-z0-9]+)*$/;

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
  return !scheme || ["http", "https", "mailto"].includes(scheme[1].toLowerCase());
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

function getSemanticAttrError(name, attrs) {
  if (name === "task" && typeof attrs.status === "string" && attrs.status && !TASK_STATUSES.has(attrs.status)) {
    return "@task status must be one of: todo, doing, done, blocked";
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
    return "@link href must not use an executable URL scheme";
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
  if (name === "depends-on" && typeof attrs.target === "string" && attrs.target && !DECISION_ID_PATTERN.test(attrs.target)) {
    return "@depends-on target must be a lowercase slug";
  }
  return null;
}
