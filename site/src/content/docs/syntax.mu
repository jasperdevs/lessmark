# Syntax

@summary
Complete reference for lessmark. Every block, every inline function, with
examples you can copy.

## Document shape

@paragraph
A lessmark document is a sequence of typed blocks separated by blank
lines. Each block starts with an at-sign on its own line, except headings
which start with a hash. Raw HTML and JSX are forbidden everywhere.

## Headings

@paragraph
ATX-style only, levels one through six, single space after the hash.
Always leave a blank line after a heading.

@code lang="mu"
  # Document title
  ## Section
  ### Subsection
  #### Sub-subsection

## Paragraphs

@paragraph
The most common block. Holds prose with full inline syntax.

@code lang="mu"
  @paragraph
  Plain prose. Use {{strong:bold}}, {{em:italic}}, and {{code:inline code}}
  inside any prose body.

@paragraph
The shorthand {{code:@p}} is also accepted and rewrites to
{{code:@paragraph}} on format.

## Inline syntax

@paragraph
Inside any prose body, double curly braces invoke an inline function.
The general shape is {{code:{{name:value}}}} or
{{code:{{name:value|extra}}}}.

@list kind="unordered"
- strong, for bold.
- em, for italic.
- code, for inline code.
- kbd, for keyboard keys.
- mark, for highlights.
- del, for strikethrough.
- sup, for superscript.
- sub, for subscript.
- link, with a label and a safe href.
- ref, with a label and an in-document target.
- footnote, with a footnote id.

@code lang="mu"
  @paragraph
  Press {{kbd:Ctrl+S}} to save. The {{mark:highlight}} survives diffs.
  See {{ref:Storage|storage-backend}} for the rationale. Visit
  {{link:our docs|https://example.com/docs}} for the full list.

## Authoring shortcuts

@paragraph
Lessmark accepts a typing layer that formats back to the canonical form.
Agents always see the canonical tree; humans do not have to type the
longest form every time.

@code lang="mu"
  @p
  Use **bold**, *emphasis*, `code`, ~~strikethrough~~, ==highlight==,
  [Docs](https://example.com), and footnote pointers like [^knuth-1974].

  @task todo
  Add export settings.

  @decision storage-backend
  Use SQLite.

@paragraph
After {{code:lessmark format}}, the document above becomes
{{code:@paragraph}}, {{code:{{strong:bold}}}}, {{code:{{em:emphasis}}}},
{{code:{{code:code}}}}, {{code:{{del:strikethrough}}}},
{{code:{{mark:highlight}}}}, {{code:{{link:Docs|https://example.com}}}},
{{code:{{footnote:knuth-1974}}}}, {{code:@task status="todo"}}, and
{{code:@decision id="storage-backend"}}.

@paragraph
For a full list of authoring shortcuts, see the Hacks page.

## Code blocks

@paragraph
Use {{code:@code}} with an optional language attribute.

@code lang="mu"
  @code lang="js"
  function add(a, b) {
    return a + b;
  }

@paragraph
Indent two spaces if the body itself contains lines that start with an
at-sign or hash, since either would otherwise terminate the block.

## Lists

@paragraph
One item per line, prefixed with {{code:- }}. Nested items use exactly
two spaces per level and cannot skip levels.

@code lang="mu"
  @list kind="unordered"
  - First item
  - Second item
  - Third item

  @list kind="ordered"
  - First step
    - First sub-step
  - Second step
  - Third step

## Tables

@paragraph
Pipe-separated rows. The first row is the header.

@code lang="mu"
  @table columns="Code|Meaning"
  0|Success
  1|Validation error
  2|I/O error

## Quotes

@code lang="mu"
  @quote cite="Donald Knuth"
  Premature optimization is the root of all evil.

## Callouts

@paragraph
Boxed notes with a kind and an optional title.

@code lang="mu"
  @callout kind="note" title="One-time setup"
  Run {{code:lessmark info --json}} to see what your installed version
  supports.

  @callout kind="tip"
  Add {{code:lessmark check}} to your pre-commit hook.

  @callout kind="warning"
  This rewrites the file in place.

  @callout kind="caution"
  Removing a decision id breaks every {{code:{{ref:...}}}} that points at it.

## Notes and warnings

@paragraph
Quick aside surfaces. They render styled but carry no extra metadata.

@code lang="mu"
  @note
  Generated files live in {{code:dist/}} and are gitignored.

  @warning
  Embedding a script tag in any block body is a parse error.

## Images

@paragraph
The image block is body-less. Use the {{code:caption}} attribute for the
figure label.

@code lang="mu"
  @image src="diagrams/flow.png" alt="Capture pipeline overview" caption="Capture pipeline. Each stage runs in its own task."

## Math

@paragraph
Notation is one of {{code:tex}} or {{code:asciimath}}. The body is
preserved verbatim and rendered by your math toolchain downstream.

@code lang="mu"
  @math notation="tex"
  E = mc^2

## Diagrams

@paragraph
Kind is one of {{code:mermaid}}, {{code:graphviz}}, or {{code:plantuml}}.
The body is preserved verbatim.

@code lang="mu"
  @diagram kind="mermaid"
  graph TD
    A --> B
    B --> C

## Separators

@paragraph
A horizontal rule between sections. Body-less.

@code lang="mu"
  @separator

## Agent context blocks

@paragraph
Blocks that carry intent an agent can act on without scraping prose.

### summary

@code lang="mu"
  @summary
  A small CLI for tracking time across projects.

### decision

@paragraph
A binding choice with a stable id. Other blocks can point at the id.

@code lang="mu"
  @decision id="storage-backend"
  Store entries in a single SQLite file, not per-project.

### constraint

@code lang="mu"
  @constraint
  Do not block the UI while syncing.

### task

@paragraph
Status is one of {{code:todo}}, {{code:doing}}, {{code:done}},
{{code:blocked}}.

@code lang="mu"
  @task status="doing"
  Migrate hotkey registration off the deprecated win32 path.

### file

@code lang="mu"
  @file path="src/Capture/Service.cs"
  Owns stitching and capture state.

### api

@code lang="mu"
  @api name="captureWindow"
  Captures a single window by handle. Returns a PNG buffer.

### metadata

@code lang="mu"
  @metadata key="project.stage"
  beta

### risk

@paragraph
Level is one of {{code:low}}, {{code:medium}}, {{code:high}},
{{code:critical}}.

@code lang="mu"
  @risk level="medium"
  Changing capture flow can break workflows users have built around the
  current shortcut behavior.

### depends-on

@code lang="mu"
  @depends-on target="storage-backend"
  Implements the SQLite write path described in the decision.

## Cross-reference blocks

### toc

@paragraph
Renders a table of contents for the page's headings.

@code lang="mu"
  @toc

### definition

@code lang="mu"
  @definition term="agent context"
  A document an LLM reads to understand a project.

### reference

@code lang="mu"
  @reference target="storage-backend"
  See the storage decision for the SQLite rationale.

### footnote

@paragraph
Inline pointers use {{code:{{footnote:id}}}}. The matching definition
block must appear in the same document.

@code lang="mu"
  @paragraph
  This claim is well-established{{footnote:knuth-1974}}.

  @footnote id="knuth-1974"
  Donald Knuth, "Structured Programming with go to Statements", 1974.

### link

@paragraph
A standalone link block. Inline links use {{code:{{link:label|url}}}}
inside any prose body.

@code lang="mu"
  @link href="https://example.com/spec"
  Read the full specification

## Page structure

### page

@code lang="mu"
  @page title="Getting started" output="getting-started.html"

### nav

@paragraph
One nav block per link. Slot is optional and defaults to {{code:primary}}.

@code lang="mu"
  @nav slot="primary" label="Home" href="/"
  @nav slot="primary" label="Docs" href="/docs"
  @nav slot="primary" label="Examples" href="/examples"

## Anchors

@paragraph
Every heading and every {{code:@decision}} block gets a slug-style anchor.
Inline {{code:{{ref:label|target-id}}}} points at those anchors and
validation rejects broken references.

## Safety

@constraint
Lessmark refuses raw HTML, JSX, and unsafe URL schemes. Anything that
looks executable raises a parse error before it ever reaches a renderer.

@warning
Embedding a script tag in any block body is a parse error, not a warning.
The parser stops at the first violation.
