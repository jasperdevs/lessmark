export const HTML_TAG_PATTERN = /<\/?[A-Za-z][A-Za-z0-9:-]*(?:\s[^>]*)?>/;
export const API_NAME_PATTERN = /^[A-Za-z_][A-Za-z0-9_.-]*$/;

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
