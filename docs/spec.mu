# Lessmark v0 Source Spec

@paragraph
Lessmark is a strict line-oriented format for project context. A document is a sequence of headings and typed blocks separated by blank lines.

## File Type

@list kind="unordered"
- Canonical extension: .mu
- Readable alias: .lessmark
- Media type target: text/vnd.lessmark; charset=utf-8
- Encoding: UTF-8 text

## Document

@list kind="unordered"
- Blank lines are ignored between nodes.
- Loose text outside a typed block is invalid.
- Raw HTML or JSX-like tags are invalid in headings, block text, and attributes.
- Unknown blocks and unknown attributes are invalid.
- Unknown inline rendering functions are invalid during HTML rendering.

## Headings

@paragraph
Headings use one to six # markers followed by one space and visible text.

@code lang="mu"
  # Project Context
  ## Capture Flow

@paragraph
Closing heading markers are not supported.

## Typed Blocks

@paragraph
A block starts with @name, followed by optional double-quoted attributes. Most block bodies run until the next heading, block header, blank line, or end of file. @code and @example may contain internal blank lines; a blank run followed by the next heading, block header, or end of file still terminates the block.

@code lang="mu"
  @task status="todo"
Add export settings.

@paragraph
For body-capable blocks, blank lines immediately after the header are ignored before the body starts. This keeps live editors from failing while a user types the first body line. Blank lines after body text still end normal non-literal blocks.

@paragraph
Attribute values only support \" and \\ escapes. Attribute values cannot contain tabs or line breaks.

@paragraph
Inline docs markup uses explicit functions instead of Markdown delimiters:

@code lang="mu"
  @paragraph
Use {{strong:strong text}}, {{em:emphasis}}, {{code:inline code}}, {{mark:highlighted text}}, {{del:removed text}}, {{ref:local references|stable-ast}}, {{footnote:strict-syntax}}, and {{link:safe links|https://example.com}}.

@paragraph
Inline ref and footnote targets must be lowercase slugs. Renderers and Markdown exporters must reject invalid targets instead of normalizing them. Rendered and Markdown-exported prose supports nested explicit inline functions, such as {{strong:Bold {{em:inside}}}}. @code and @example bodies remain literal text.

## Authoring Conveniences

@paragraph
Lessmark has one canonical spelling for every structure, but parsers accept a small human authoring layer that formats back to canonical source. This keeps files easy to type without creating separate dialects for agents.

@table columns="Convenience|Canonical output"
`@p`|`@paragraph`
`@ul`|`@list kind="unordered"`
`@ol`|`@list kind="ordered"`
`@decision slug`|`@decision id="slug"`
`@task todo`|`@task status="todo"`
`@risk high`|`@risk level="high"`
`@file src/app.ts`|`@file path="src/app.ts"`
`@api parseLessmark`|`@api name="parseLessmark"`
`@code ts`|`@code lang="ts"`
`@callout warning`|`@callout kind="warning"`
`@definition API`|`@definition term="API"`
`@table Name\|Value`|`@table columns="Name\|Value"`
`@metadata project.stage`|`@metadata key="project.stage"`
`@depends-on slug`|`@depends-on target="slug"`
`@footnote note`|`@footnote id="note"`
`@reference slug`|`@reference target="slug"`
`@link https://example.com`|`@link href="https://example.com"`

@paragraph
Prose bodies also accept these human shortcuts and canonicalize them before validation and rendering: `code`, *emphasis*, **bold**, ~~deleted~~, ==marked==, [label](https://example.com), [label](#local-slug), and [^footnote-id].

@paragraph
The convenience layer is intentionally small. It only maps to existing block names, existing attributes, and existing inline functions. It never adds raw HTML, implicit global references, custom blocks, style directives, hooks, or alternate AST shapes. @code and @example bodies stay literal and are not canonicalized.

## Grammar

@paragraph
This grammar is intentionally line-oriented. Parsers normalize CRLF and bare CR to LF before parsing.

@code lang="ebnf"
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

## Error Rules

@paragraph
Parsers must fail on:

@list kind="unordered"
- loose text outside a heading or typed block
- heading markers without visible text
- closing heading markers, such as # Title #
- unknown block names
- unknown, missing, duplicate, or semantically invalid attributes
- unquoted attributes
- unsupported escapes in attribute values
- nested or indented @list items
- body text on bodyless @page, @nav, @image, @separator, or @toc blocks
- @table body rows whose cell count does not match columns
- raw HTML or JSX-like tags in headings, block text, or attributes
- absolute paths, URI paths, or .. segments in @file path
- executable URL schemes, absolute local paths, scheme-relative URLs, or .. traversal in @link href

@paragraph
Validation APIs and lessmark check --json return structured errors. Every error has a stable code and message; parse-originated errors also include one-based line and column.

## Markdown Interop

@paragraph
Lessmark is not a Markdown dialect. Markdown import/export is intentionally lossy and only covers safe common shapes:

@list kind="unordered"
- headings
- paragraphs
- fenced code blocks, including internal blank lines
- task list items
- standalone safe links
- standalone safe images
- standard blockquotes
- GFM note, tip, warning, and caution callouts
- well-formed GFM tables with non-empty cells
- standalone Markdown separators, such as ---

@paragraph
Unsupported Markdown features should degrade to @note text or require manual conversion.

## Core Blocks

@table columns="Block|Attributes|Purpose"
summary|none|Short document or project summary.
page|title optional, output optional|Static page metadata.
nav|label required, href required, slot optional|Bodyless site navigation item. slot is primary or footer.
paragraph|none|General docs prose.
decision|id required|Durable decision, referenced by slug.
constraint|none|Rule or boundary future agents must preserve.
task|status required|Work item. Status is todo, doing, done, or blocked.
file|path required|Relative project path and ownership/context.
code|lang optional|Literal code or command example.
example|none|Example input, output, behavior, or scenario.
note|none|Non-blocking context.
warning|none|Important risk or caveat.
quote|cite optional|Quotation or quoted reference.
callout|kind required, title optional|Explicit note, tip, warning, or caution.
list|kind required|Ordered or unordered flat list. Each item starts with - .
table|columns required|Pipe-separated table columns and rows. Body cells may escape a literal pipe as \|.
image|src required, alt required, caption optional|Safe image or figure.
separator|none|Bodyless horizontal separator for docs and rendered pages.
toc|none|Rendered table of contents from local headings.
footnote|id required|Named footnote content referenced by inline text.
definition|term required|Definition-list entry for glossaries and docs.
reference|target required, label optional|Explicit local reference to a heading, decision, or footnote slug.
api|name required|API, command, function, or symbol name.
link|href required|Safe external reference.
metadata|key required|Small machine-readable document metadata.
risk|level required|Risk note. Level is low, medium, high, or critical.
depends-on|target required|Relationship to a decision or other slugged context.

## Attribute Rules

@list kind="unordered"
- decision.id and depends-on.target: lowercase slug, such as manual-scrolling.
- file.path: relative project path only. Absolute paths, URI schemes, and .. segments are invalid.
- api.name: identifier-like value, such as parseLessmark or lessmark.check.
- link.href: http, https, mailto, or safe relative project paths. Absolute local paths, scheme-relative URLs, executable schemes, and .. traversal are invalid.
- code.lang: compact language identifier, such as ts, csharp, or shell-session.
- metadata.key: lowercase dotted key, such as project.stage.
- page.output: safe relative .html path.
- nav.label: plain single-line text.
- nav.href: http, https, mailto, or safe relative project path.
- nav.slot: primary or footer.
- image.src: safe relative path or http/https URL.
- footnote.id: lowercase slug.
- definition.term: plain single-line text.
- reference.target: lowercase slug that resolves to a local heading anchor, @decision id, or @footnote id.
- list.kind: unordered or ordered.
- table.columns: pipe-separated non-empty labels.
- table rows: one row per line, same cell count as columns; use \\| for literal pipes inside body cells.
- callout.kind: note, tip, warning, or caution.

## Rendering

@paragraph
The npm CLI includes a safe static renderer:

@code lang="sh"
lessmark render --document docs/index.mu
lessmark build docs public
lessmark build --strict docs public

@paragraph
Rendering escapes text, rejects unknown inline functions, supports nested explicit inline functions, rejects executable link schemes, and never passes raw source text through as HTML. Rust and Python expose the shared parser, formatter, validator, and Markdown conversion surfaces; they do not advertise HTML rendering or static-site builds in info --json. Heading IDs are generated from heading text. Duplicate heading IDs receive numeric suffixes, such as build-system-2, so rendered HTML does not emit duplicate heading anchors. Generated heading IDs, @decision id values, @footnote id values, and rendered footnote anchors like fn-strict-syntax share one local target namespace and must not collide. @reference target must point at a target in that namespace; broken local references are parser errors. @nav blocks render as grouped primary or footer navigation. @separator renders as a horizontal rule. Navigation, page metadata, images, separators, and TOCs are bodyless so site chrome and visual breaks stay renderer-controlled instead of becoming a layout or component DSL. build --strict parses and render-checks every page before writing output. It rejects unsafe inline render links, duplicate @page output values, page/static output collisions, case-insensitive output collisions, nested output roots, duplicate static asset outputs, @nav links without built page targets, relative @link asset/page misses, and missing local @image assets.

## Formatting

@paragraph
lessmark format file.mu prints canonical source. lessmark format --write file.mu writes it back to disk. lessmark fix is an alias for the same formatter. Documented authoring conveniences are accepted and rewritten to canonical Lessmark; unsupported dialect syntax remains invalid.

## Conformance

@paragraph
The conformance contract is:

@list kind="unordered"
- docs/spec.mu for source syntax and behavior.
- schemas/ast-v0.schema.json for AST shape.
- schemas/language-v0.contract.json for shared language capabilities.
- schemas/profiles-v0.contract.json for accepted named profiles and profile change policy.
- fixtures/valid/ and fixtures/invalid/ for accepted and rejected examples.
- fixtures/site/ for static-site build examples.
- scripts/conformance.mjs for JavaScript, Python, and Rust parity.

@paragraph
Adding syntax requires updating all of these surfaces in the same change.

@paragraph
lessmark info --json is the machine-readable capability report. The shared fields must match schemas/language-v0.contract.json; runtime-specific cli and renderer sections describe what each package can actually do.

## AST

@paragraph
The default AST is stable JSON:

@code lang="json"
{
  "type": "document",
  "children": [
    { "type": "heading", "level": 1, "text": "Project Context" },
    { "type": "block", "name": "summary", "attrs": {}, "text": "Typed context." }
  ]
}

@paragraph
Parsers may optionally include position on nodes. Position fields use one-based line and column numbers and are excluded by default so the v0 AST remains compact.

## Versioning

@paragraph
Lessmark v0 reserves the current block names and AST shape. A future breaking source or AST change must use a new format version and should keep v0 parsers strict rather than silently accepting unknown syntax.
