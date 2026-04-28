# Validation

@summary
Lessmark separates parsing from validation. Parsing fails on anything outside
the grammar. Validation enforces deeper rules: required attributes, safe URLs,
unique anchors, and language-rule conformance.

## Same checks in every package

@paragraph
Lessmark ships JavaScript, Python, and Rust packages. They share the same
test fixtures and produce the same JSON tree for the same source.

## Errors are typed

@callout kind="tip" title="Use --json for tooling"
The {{code:check}} command emits stable error codes when called with
{{code:--json}}. Editor extensions and CI scripts depend on those codes
remaining stable across versions.

@code lang="sh"
lessmark check --json notes.mu

## What validation checks

@list kind="unordered"
- Required attributes are present and non-empty.
- Attributes are limited to those each block defines.
- Decision ids are lowercase slugs.
- Task statuses are one of todo, doing, done, blocked.
- Risk levels are one of low, medium, high, critical.
- Inline references point at existing anchors.
- URLs use safe schemes only.
- No raw HTML, JSX, or expression syntax appears anywhere.

## When checks fail

@warning
A failed check exits non-zero. CI should treat this as a build failure.
The CLI prints a line:column pointer for each error.
