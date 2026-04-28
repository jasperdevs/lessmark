# Lessmark Docs Profile

The docs profile is the publishing layer for Lessmark. It follows the same rule as the core agent-context profile: one explicit syntax per meaning, no raw HTML, and no global reference resolution.

## Design Rules

- Use typed blocks, not punctuation tricks.
- Render from the AST, not from source text.
- Keep inline markup as explicit functions: `{{strong:text}}`, `{{em:text}}`, `{{code:text}}`, `{{kbd:text}}`, and `{{link:label|href}}`.
- Reject unknown inline functions during rendering.
- Keep links and assets safe: no executable URL schemes, no absolute local paths, and no `..` path traversal.
- Do not add user-defined execution hooks by default.

## Page Metadata

```mu
@page title="Docs Home" output="index.html"
```

`@page` is optional. `title` controls the HTML document title. `output` controls `lessmark build` output and must be a safe relative `.html` path.

## Common Docs Blocks

```mu
@paragraph
Write normal prose with {{strong:explicit}} inline functions.

@image src="assets/diagram.svg" alt="Build pipeline" caption="Static output"

@list kind="unordered"
- Parse strict source.
- Validate typed blocks.
- Render safe HTML.

@table columns="Feature|Status"
Typed blocks|done
Raw HTML|rejected

@quote cite="BGs Labs"
If you want a simple language, stay simple.

@callout kind="tip" title="No hooks by default"
Use built-in blocks before adding execution surfaces.

@toc
```

## CLI

```sh
lessmark render --document docs/index.mu
lessmark build docs public
```

`render` writes HTML to stdout. `build` recursively converts `.mu` and `.lessmark` files to `.html`, copies non-Lessmark static assets, and uses `@page output` when present.

## What This Intentionally Does Not Add

- raw HTML passthrough
- reference-style links
- footnotes
- arbitrary plugin hooks
- expression syntax
- alternate spellings for the same structure
