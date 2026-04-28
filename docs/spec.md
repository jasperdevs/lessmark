# Lessmark v0 Source Spec

Lessmark is a strict line-oriented format for project context. A document is a sequence of headings and typed blocks separated by blank lines.

## File Type

- Canonical extension: `.mu`
- Readable alias: `.lessmark`
- Media type target: `text/vnd.lessmark; charset=utf-8`
- Encoding: UTF-8 text

## Document

- Blank lines are ignored between nodes.
- Loose text outside a typed block is invalid.
- Raw HTML or JSX-like tags are invalid in headings, block text, and attributes.
- Unknown blocks and unknown attributes are invalid.
- Unknown inline rendering functions are invalid during HTML rendering.

## Headings

Headings use one to six `#` markers followed by one space and visible text.

```mu
# Project Context
## Capture Flow
```

Closing heading markers are not supported.

## Typed Blocks

A block starts with `@name`, followed by optional double-quoted attributes. Most block bodies run until the next heading, block header, blank line, or end of file. `@code` and `@example` may contain internal blank lines; a blank run followed by the next heading, block header, or end of file still terminates the block.

```mu
@task status="todo"
Add export settings.
```

Attribute values only support `\"` and `\\` escapes. Attribute values cannot contain tabs or line breaks.

Inline docs markup uses explicit functions instead of Markdown delimiters:

```mu
@paragraph
Use {{strong:strong text}}, {{em:emphasis}}, {{code:inline code}}, and {{link:safe links|https://example.com}}.
```

## Grammar

This grammar is intentionally line-oriented. Parsers normalize `CRLF` and bare `CR` to `LF` before parsing.

```ebnf
document        = blank-line* node (blank-line+ node)* blank-line* ;
node            = heading | block ;
heading         = heading-marker space heading-text line-end ;
heading-marker  = "#" | "##" | "###" | "####" | "#####" | "######" ;
heading-text    = visible-text-without-raw-html ;
block           = block-header line-end block-body? ;
block-header    = "@" block-name (space attribute)* ;
block-name      = lowercase-letter (lowercase-letter | digit | "_" | "-")* ;
attribute       = attr-name "=" quoted-value ;
attr-name       = lowercase-letter (lowercase-letter | digit | "_" | "-")* ;
quoted-value    = '"' (escaped-quote | escaped-backslash | safe-attribute-char)* '"' ;
block-body      = body-line (line-end body-line)* ;
body-line       = normal-body-line | literal-blank-line ;
normal-body-line = non-blank-line-not-starting-with-heading-or-block ;
literal-blank-line = blank-line-inside-code-or-example ;
blank-line      = whitespace* line-end ;
```

## Error Rules

Parsers must fail on:

- loose text outside a heading or typed block
- heading markers without visible text
- closing heading markers, such as `# Title #`
- unknown block names
- unknown, missing, duplicate, or semantically invalid attributes
- unquoted attributes
- unsupported escapes in attribute values
- raw HTML or JSX-like tags in headings, block text, or attributes
- absolute paths, URI paths, or `..` segments in `@file path`
- executable URL schemes, absolute local paths, scheme-relative URLs, or `..` traversal in `@link href`

## Markdown Interop

Lessmark is not a Markdown dialect. Markdown import/export is intentionally lossy and only covers safe common shapes:

- headings
- paragraphs
- fenced code blocks, including internal blank lines
- task list items
- standalone safe links

Unsupported Markdown features should degrade to `@note` text or require manual conversion.

## Core Blocks

| Block | Attributes | Purpose |
| --- | --- | --- |
| `@summary` | none | Short document or project summary. |
| `@page` | `title` optional, `output` optional | Static page metadata. |
| `@paragraph` | none | General docs prose. |
| `@decision` | `id` required | Durable decision, referenced by slug. |
| `@constraint` | none | Rule or boundary future agents must preserve. |
| `@task` | `status` required | Work item. Status is `todo`, `doing`, `done`, or `blocked`. |
| `@file` | `path` required | Relative project path and ownership/context. |
| `@code` | `lang` optional | Literal code or command example. |
| `@example` | none | Example input, output, behavior, or scenario. |
| `@note` | none | Non-blocking context. |
| `@warning` | none | Important risk or caveat. |
| `@quote` | `cite` optional | Quotation or quoted reference. |
| `@callout` | `kind` required, `title` optional | Explicit note, tip, warning, or caution. |
| `@list` | `kind` required | Ordered or unordered list. Each item starts with `- `. |
| `@table` | `columns` required | Pipe-separated table columns and rows. |
| `@image` | `src` required, `alt` required, `caption` optional | Safe image or figure. |
| `@toc` | none | Rendered table of contents from local headings. |
| `@api` | `name` required | API, command, function, or symbol name. |
| `@link` | `href` required | Safe external reference. |
| `@metadata` | `key` required | Small machine-readable document metadata. |
| `@risk` | `level` required | Risk note. Level is `low`, `medium`, `high`, or `critical`. |
| `@depends-on` | `target` required | Relationship to a decision or other slugged context. |

## Attribute Rules

- `decision.id` and `depends-on.target`: lowercase slug, such as `manual-scrolling`.
- `file.path`: relative project path only. Absolute paths, URI schemes, and `..` segments are invalid.
- `api.name`: identifier-like value, such as `parseLessmark` or `lessmark.check`.
- `link.href`: `http`, `https`, `mailto`, or safe relative project paths. Absolute local paths, scheme-relative URLs, executable schemes, and `..` traversal are invalid.
- `code.lang`: compact language identifier, such as `ts`, `csharp`, or `shell-session`.
- `metadata.key`: lowercase dotted key, such as `project.stage`.
- `page.output`: safe relative `.html` path.
- `image.src`: safe relative path or `http`/`https` URL.
- `list.kind`: `unordered` or `ordered`.
- `table.columns`: pipe-separated non-empty labels.
- `callout.kind`: `note`, `tip`, `warning`, or `caution`.

## Rendering

The npm CLI includes a safe static renderer:

```sh
lessmark render --document docs/index.mu
lessmark build docs public
```

Rendering escapes text, rejects unknown inline functions, rejects executable link schemes, and never passes raw source text through as HTML.

## Conformance

The conformance contract is:

- `docs/spec.md` for source syntax and behavior.
- `schemas/ast-v0.schema.json` for AST shape.
- `fixtures/valid/` and `fixtures/invalid/` for accepted and rejected examples.
- `scripts/conformance.mjs` for JavaScript, Python, and Rust parity.

Adding syntax requires updating all four surfaces in the same change.

## AST

The default AST is stable JSON:

```json
{
  "type": "document",
  "children": [
    { "type": "heading", "level": 1, "text": "Project Context" },
    { "type": "block", "name": "summary", "attrs": {}, "text": "Typed context." }
  ]
}
```

Parsers may optionally include `position` on nodes. Position fields use one-based line and column numbers and are excluded by default so the v0 AST remains compact.

## Versioning

Lessmark v0 reserves the current block names and AST shape. A future breaking source or AST change must use a new format version and should keep v0 parsers strict rather than silently accepting unknown syntax.
