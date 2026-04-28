# Changelog

@summary
Notable changes to the project, newest first. Versioning follows semver.

## 0.4.0

@list kind="unordered"
- Added build --strict preflight checks for unsafe URLs and duplicate outputs.
- Renderer emits stable anchor ids for headings and decisions.
- Inline footnote requires a matching @footnote block in the same document.

## 0.3.2

@list kind="unordered"
- Fix: tables with a single column no longer reject rows.
- Fix: heading slugs collapse repeated separators correctly.

## 0.3.1

@list kind="unordered"
- Fix: validate that @page output paths are repository-relative.

## 0.3.0

@list kind="unordered"
- Added callout, quote, list, table, and image blocks.
- Added toc, definition, reference, and footnote cross-reference blocks.
- Added inline strong, em, code, link, ref, footnote, kbd, mark, del.

## 0.2.0

@list kind="unordered"
- First Python package.
- Shared test fixtures across packages.

## 0.1.0

@list kind="unordered"
- Initial release. Ten core blocks, JSON tree output, JavaScript package, CLI.
