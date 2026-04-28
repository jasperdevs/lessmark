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

A block starts with `@name`, followed by optional double-quoted attributes. The block body is every following non-blank line until the next heading, block header, blank line, or end of file.

```lmk
@task status="todo"
Add export settings.
```

Attribute values only support `\"` and `\\` escapes. Attribute values cannot contain tabs or line breaks.

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
