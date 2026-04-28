# Lessmark v0 Specification

Status: draft v0

Lessmark is a strict, agent-readable document format for project context, agent instructions, decisions, tasks, constraints, examples, API notes, links, warnings, and file references.

Lessmark is Markdown-inspired and may be positioned as a stricter Markdown 2 for agent context, but it is not Markdown-compatible and is not a drop-in renderer for existing Markdown documents. V0 is a small language with deterministic parsing and one syntax per concept.

## Goals

- Human-readable plain text.
- Agent-readable typed structure.
- Stable JSON AST.
- Deterministic validation and formatting.
- No raw HTML, JSX, embedded scripts, or arbitrary code execution.
- Small conformance fixture set from day one.
- Schema-bound extension model before any custom blocks are accepted.

## Non-Goals

- General blogging.
- Full documentation-site rendering.
- Markdown compatibility.
- MDX-style component execution.
- Multiple equivalent syntaxes for the same feature.
- Preprocessor includes, remote transclusion, or document-time code evaluation.

## Files

- Preferred extension: `.lmk`
- Long-form fallback extension: `.lessmark`
- Encoding: UTF-8
- Newlines: `LF` after formatting

## Document Model

A Lessmark document is an ordered list of nodes:

- `heading`
- `block`

Blank lines separate nodes and have no AST representation.

Loose paragraphs outside typed blocks are invalid in v0.

Lessmark uses a simple pipeline:

```text
source text -> parser -> typed AST -> validator -> formatter -> consumer
```

Rendering is not part of the core language contract. The AST and validation result are the contract.

## Headings

Headings use ATX syntax only:

```lessmark
# Project Context
## Decisions
```

Rules:

- Levels 1 through 6 are supported.
- A heading marker must be followed by one space.
- Closing heading markers are not supported.
- Heading text is plain text.

AST:

```json
{ "type": "heading", "level": 1, "text": "Project Context" }
```

## Typed Blocks

A block starts with `@` followed by a block name and optional attributes:

```lessmark
@decision id="manual-scrolling"
Manual scrolling capture stays because apps scroll differently.
```

The block body is every following non-blank line until the next blank line, heading, or typed block.

Rules:

- Block names are lowercase ASCII identifiers.
- Unknown block names are invalid.
- Attributes are optional unless a block-specific rule requires them.
- Attribute values must be double-quoted strings.
- Attribute names may contain lowercase letters, digits, `_`, and `-`.
- No unquoted attributes.
- No single-quoted attributes.
- Duplicate attributes on one block are invalid.
- Block body text is plain text.

AST:

```json
{
  "type": "block",
  "name": "decision",
  "attrs": { "id": "manual-scrolling" },
  "text": "Manual scrolling capture stays because apps scroll differently."
}
```

## Core Blocks

V0 defines exactly these block names:

- `summary`
- `decision`
- `constraint`
- `task`
- `file`
- `example`
- `note`
- `warning`
- `api`
- `link`

## Block-Specific Validation

- `@file` requires `path`.
- `@link` requires `href`.
- `@task status="..."` must use one of: `todo`, `doing`, `done`, `blocked`.
- `@decision id="..."`, when present, must be a lowercase slug using letters, digits, and `-`.

## Text Safety

V0 source must not contain raw HTML or JSX-like tags. The reference validator rejects `<tag>`, `</tag>`, and JSX-like capitalized tags.

Lessmark does not execute code in documents.

## Formatting

The formatter must:

- Normalize line endings to `LF`.
- Remove trailing whitespace.
- Use one blank line between nodes.
- Sort attributes alphabetically.
- Preserve node order.
- End files with one trailing newline.

## Parser Errors

Parser errors include:

- A short message.
- 1-based line number.
- 1-based column number.

## Stability

The JSON AST is the conformance target for v0. Fixtures in `fixtures/valid` pair `.lmk` inputs with `.ast.json` snapshots.

## Methodology

Every future syntax addition must satisfy these rules:

- It produces a clear typed AST node.
- It has exactly one spelling.
- It can be validated without executing code.
- It can be formatted deterministically.
- It does not require remote IO, local file reads, imports, includes, plugins, or renderer-specific passthrough.
- It improves agent-readable context rather than visual presentation.
