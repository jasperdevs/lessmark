# Lessmark methodology

Status: draft, 2026-04-27

Lessmark should not start from Markdown's pipeline. Markdown's implicit model is:

```text
plain text prose -> Markdown parser -> HTML-ish output -> sanitizer/renderer/plugin pipeline
```

Lessmark's model should be:

```text
plain text records -> parser -> typed AST -> validator -> formatter -> tool-specific consumers
```

The difference matters. Markdown optimizes for casual writing that can be published. Lessmark optimizes for stable context that humans can edit and agents can trust.

## Core thesis

Lessmark is Markdown 2 only for agent context. It keeps Markdown's plain-text readability, but rejects Markdown's "anything can become HTML later" model.

A `.lmk` file is not a mini webpage, not a component tree, not a notebook, and not a build script. It is a typed context document.

## What Markdown got right

Markdown won because it made the source readable. John Gruber's original docs explicitly put readability first and describe Markdown as writing format, not HTML replacement. Lessmark should keep that.

Rules to keep:

- Plain text must be readable without rendering.
- Common writing operations should be obvious.
- The source should not look like XML, JSON, or a programming language.
- Editing in a plain text editor must stay comfortable.

## What Markdown got wrong for agents

### 1. Output-first semantics

Markdown source usually matters because of what it renders to. Agents need the opposite: the source must parse into a stable AST before any rendering choice exists.

Lessmark rule: the AST is the product. Rendering is optional downstream behavior.

### 2. Raw HTML escape hatch

Original Markdown allows inline and block HTML. That solved missing features cheaply, but it means the document can suddenly switch grammar, security model, and renderer assumptions.

Lessmark rule: no raw HTML, JSX, script tags, component tags, or passthrough markup in source.

### 3. Multiple spellings for one concept

Markdown has two heading styles, optional closing heading markers, multiple bullet markers, lazy blockquotes, lazy list continuation, and several horizontal-rule spellings. Those are friendly for humans but expensive for deterministic parser behavior and AST equality.

Lessmark rule: one syntax per concept. If two inputs mean the same thing, the formatter should converge them, or one should be invalid.

### 4. Invisible syntax

Trailing spaces for line breaks, indentation-sensitive code/list behavior, and implicit continuation rules make meaning depend on invisible or fragile whitespace.

Lessmark rule: structural syntax must be visible at line starts. Whitespace can separate nodes, but it should not hide semantics.

### 5. Flavor drift

CommonMark exists because Markdown needed a spec. GitHub Flavored Markdown, Obsidian, MyST, MDX, Quarto, and many site-specific renderers then extend it differently. Users call all of it Markdown, but tools disagree.

Lessmark rule: no flavor without a declared schema version. Unknown blocks fail closed.

### 6. Plugin-driven semantics

Markdown ecosystems often bolt on frontmatter, callouts, Mermaid, math, directives, includes, shortcodes, JSX, and custom transforms. Once that happens, the file is no longer self-describing.

Lessmark rule: extensions must be schema-bound data, not executable plugins hidden in the document.

## Better pipeline

### Stage 1: Decode

- Input is UTF-8 text.
- Normalize line endings to LF.
- Strip BOM.
- Track line and column for every parser error.

### Stage 2: Parse

- Parse only the base grammar.
- Produce a JSON AST.
- Do not validate project-specific rules here.
- Do not read files, fetch URLs, expand includes, evaluate expressions, or render output.

### Stage 3: Validate

- Validate known block names.
- Validate required attributes.
- Validate attribute enums and slugs.
- Reject raw HTML/JSX-like tags.
- Reject unknown blocks unless a schema explicitly declares them.

### Stage 4: Format

- Sort attributes deterministically.
- Normalize blank lines between nodes.
- Strip trailing whitespace.
- Preserve node order.
- End files with one trailing newline.

### Stage 5: Consume

Consumers can be agents, CLIs, editors, docs tools, or renderers. Consumers should treat the AST as canonical and should not reinterpret source text independently.

## Syntax methodology

Every new syntax proposal must answer:

- What AST node does this create?
- Why is this not already expressible with a typed block?
- Can it be validated without executing code?
- Can it be formatted deterministically?
- Does it keep source readable without rendering?
- Does it avoid remote IO and filesystem reads?
- Does it have exactly one spelling?
- Does it have fixtures before release?

If the answer is weak, reject the feature.

## Block methodology

Blocks are records, not visual widgets.

Good:

```lessmark
@decision id="manual-scrolling"
Manual scrolling capture stays because apps scroll differently.
```

Bad:

```lessmark
@blue-callout icon="sparkles" animate="true"
Manual scrolling capture stays because apps scroll differently.
```

The first is durable context. The second is presentation mixed into context.

## Extension methodology

V0 should not implement custom extensions yet. V1 should only add extensions if they are declared outside the document or in a non-executable schema header.

A future extension system should look like data:

```lessmark
@schema name="project-context" version="1"
```

It should not look like code:

```lessmark
import Widget from "./Widget.jsx"
```

Extension rules:

- No imports.
- No executable expressions.
- No includes.
- No raw renderer output.
- No network access.
- Unknown schemas fail closed.
- Schema validation must run before consumers trust the file.

## Agent methodology

Agents need stable context, not pretty rendering.

A good agent-readable format should make these operations trivial:

- Find all decisions.
- Find all constraints.
- Find all tasks by status.
- Find referenced files.
- Diff two ASTs.
- Format before commit.
- Reject unsafe or unknown content.

Markdown makes agents infer these from headings, bullets, prose, and conventions. Lessmark should encode them directly.

## Human methodology

Lessmark still has to feel writable.

Rules:

- Block headers should be short.
- Attribute syntax should be boring and predictable.
- No nested punctuation puzzles.
- No hidden indentation rules.
- No required JSON frontmatter for basic files.
- The source should explain itself when pasted into chat.

## Security methodology

Lessmark's security stance is fail-closed data parsing.

- Documents cannot execute code.
- Documents cannot import components.
- Documents cannot include files.
- Documents cannot fetch URLs.
- Documents cannot contain raw HTML/JSX passthrough.
- Links and file paths are inert strings until a consumer chooses to act on them.
- Consumers must make clickable/open behavior explicit and safe.

## Compatibility methodology

Lessmark should not be compatible with Markdown. It should be easy to migrate selected Markdown content into Lessmark records.

Good compatibility promise:

> Lessmark is easy to read if you know Markdown.

Bad compatibility promise:

> Lessmark renders Markdown correctly.

## Versioning methodology

- Every AST should have a version before v1.
- Breaking grammar changes require a major version.
- New core block names require spec updates and fixtures.
- Deprecated syntax should be rejected by the formatter, not silently preserved forever.

## Product methodology

Do not build the website/docs engine first. Build the durable core:

1. Spec.
2. Parser.
3. AST schema.
4. Validator.
5. Formatter.
6. Fixtures.
7. CLI.
8. Editor tooling.
9. Optional renderers.

The trap is becoming another docs framework. The opportunity is becoming the boring context layer agents can rely on.