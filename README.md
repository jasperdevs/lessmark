# Lessmark

Lessmark is a strict, agent-readable document format inspired by Markdown.

It is human-readable plain text, but designed for the agent era: typed blocks, deterministic parsing, a stable JSON AST, validation, formatting, and no raw inline HTML/JSX execution.

Lessmark is not Markdown 2. It is not a general blogging engine, docs platform, MDX replacement, or HTML shortcut layer. The v0 scope is deliberately narrow: project context, agent instructions, decisions, tasks, constraints, examples, API notes, links, warnings, and file references.

## Example

```lessmark
# Project Context

@summary
This repo builds a local Windows screenshot app.

@decision id="manual-scrolling"
Manual scrolling capture stays because apps scroll differently.

@constraint
Do not auto-scroll or auto-end capture unless the user explicitly asks.

@task status="todo"
Add export settings.

@file path="src/Capture/ScrollingCaptureService.cs"
Owns stitching and capture state.
```

## Install Locally

```sh
npm install
npm test
npm run build
```

Run the CLI from the workspace:

```sh
npm exec lessmark parse examples/project-context.lmk
npm exec lessmark check examples/project-context.lmk
npm exec lessmark format examples/project-context.lmk
```

## CLI

```sh
lessmark parse file.lmk
lessmark check file.lmk
lessmark format file.lmk
lessmark format --write file.lmk
```

- `parse` prints the JSON AST.
- `check` validates syntax and v0 semantic rules.
- `format` prints deterministic Lessmark.
- `format --write` updates the file in place.

## V0 Rules

Lessmark v0 supports:

- ATX headings: `#` through `######`
- Typed blocks: `@summary`, `@decision`, `@constraint`, `@task`, `@file`, `@example`, `@note`, `@warning`, `@api`, `@link`
- Double-quoted attributes on block headers
- Plain text block bodies
- Deterministic JSON AST output
- Deterministic formatting

Lessmark v0 rejects:

- Raw HTML
- JSX
- Arbitrary code execution
- Loose paragraphs outside typed blocks
- Multiple spellings for the same concept
- Unknown block names
- Unquoted attributes

## AST Shape

```json
{
  "type": "document",
  "children": [
    {
      "type": "heading",
      "level": 1,
      "text": "Project Context"
    },
    {
      "type": "block",
      "name": "summary",
      "attrs": {},
      "text": "This repo builds a local Windows screenshot app."
    }
  ]
}
```

## Packages

- `packages/lessmark`: reference parser, validator, formatter, and AST helpers.
- `packages/cli`: `lessmark` command-line interface.

## Name Status

As of 2026-04-27, local availability checks showed:

- GitHub `jasprcodess/lessmark`: not found.
- GitHub `jasperdevs/lessmark`: not found.
- npm `lessmark`: not found.
- npm `@jasperdevs/lessmark`: not found.
- PyPI `lessmark`: HTTP 404.
- crates.io `lessmark`: HTTP 404.
- RDAP/DNS `lessmark.dev`: no registration found.
- RDAP/DNS `lessmark.org`: no registration found.

Domain availability is only final at registrar checkout. The best primary domain is `lessmark.dev`: it is short, obvious, and fits a developer-facing format. `lessmark.org` is the best defensive/open-source fallback. I would avoid novelty TLDs for the canonical domain because the format should feel stable, not gimmicky.

## License

MIT