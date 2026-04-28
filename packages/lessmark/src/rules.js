import { BLOCK_ATTRS, TASK_STATUSES } from "./grammar.js";

export const HTML_TAG_PATTERN = /<\/?[A-Za-z][A-Za-z0-9:-]*(?:\s[^>]*)?>/;
export const API_NAME_PATTERN = /^[A-Za-z_][A-Za-z0-9_.-]*$/;
export const CONTROL_WHITESPACE_PATTERN = /[\r\n\t]/;
export const DECISION_ID_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

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
    if (!attrs[key]) {
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
  if (name === "task" && attrs.status && !TASK_STATUSES.has(attrs.status)) {
    return "@task status must be one of: todo, doing, done, blocked";
  }
  if (name === "decision" && attrs.id && !DECISION_ID_PATTERN.test(attrs.id)) {
    return "@decision id must be a lowercase slug";
  }
  if (name === "file" && attrs.path && !isRelativeProjectPath(attrs.path)) {
    return "@file path must be a relative project path";
  }
  if (name === "api" && attrs.name && !API_NAME_PATTERN.test(attrs.name)) {
    return "@api name must be an identifier";
  }
  if (name === "link" && attrs.href && !isSafeHref(attrs.href)) {
    return "@link href must not use an executable URL scheme";
  }
  return null;
}
