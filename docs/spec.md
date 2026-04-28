# Lessmark v0 Source Spec

Lessmark is a strict line-oriented format for project context. A document is a sequence of headings and typed blocks separated by blank lines.

## File Type

- Canonical extension: `.lmk`
- Readable alias: `.lessmark`
- Media type target: `text/vnd.lessmark; charset=utf-8`
- Encoding: UTF-8 text

## Document

- Blank lines are ignored between nodes.
- Loose text outside a typed block is invalid.
- Raw HTML or JSX-like tags are invalid in headings, block text, and attributes.
- Unknown blocks and unknown attributes are invalid.

## Headings

Headings use one to six `#` markers followed by one space and visible text.

```lmk
# Project Context
## Capture Flow
```

Closing heading markers are not supported.

## Typed Blocks

A block starts with `@name`, followed by optional double-quoted attributes. Most block bodies run until the next heading, block header, blank line, or end of file. `@code` and `@example` may contain internal blank lines; a blank run followed by the next heading, block header, or end of file still terminates the block.

```lmk
@task status="todo"
Add export settings.
```

Attribute values only support `\"` and `\\` escapes. Attribute values cannot contain tabs or line breaks.

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
- executable URL schemes in `@link href`

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
| `@decision` | `id` required | Durable decision, referenced by slug. |
| `@constraint` | none | Rule or boundary future agents must preserve. |
| `@task` | `status` required | Work item. Status is `todo`, `doing`, `done`, or `blocked`. |
| `@file` | `path` required | Relative project path and ownership/context. |
| `@code` | `lang` optional | Literal code or command example. |
| `@example` | none | Example input, output, behavior, or scenario. |
| `@note` | none | Non-blocking context. |
| `@warning` | none | Important risk or caveat. |
| `@api` | `name` required | API, command, function, or symbol name. |
| `@link` | `href` required | Safe external reference. |
| `@metadata` | `key` required | Small machine-readable document metadata. |
| `@risk` | `level` required | Risk note. Level is `low`, `medium`, `high`, or `critical`. |
| `@depends-on` | `target` required | Relationship to a decision or other slugged context. |

## Attribute Rules

- `decision.id` and `depends-on.target`: lowercase slug, such as `manual-scrolling`.
- `file.path`: relative project path only. Absolute paths, URI schemes, and `..` segments are invalid.
- `api.name`: identifier-like value, such as `parseLessmark` or `lessmark.check`.
- `link.href`: no executable URL schemes. `http`, `https`, and `mailto` are allowed.
- `code.lang`: compact language identifier, such as `ts`, `csharp`, or `shell-session`.
- `metadata.key`: lowercase dotted key, such as `project.stage`.

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
