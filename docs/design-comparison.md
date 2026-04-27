# Lessmark comparison and design grade

Status: draft, 2026-04-27

Lessmark should be a Markdown successor only for one narrow job: agent-readable project context. It should not try to replace every README, blog post, book, or typesetting workflow.

## Current grade

Lessmark v0 is a **B- today** and has a credible path to **A** for agent context.

Why not A yet:

- The syntax is intentionally tiny, but the spec still needs a formal grammar and conformance runner.
- The AST is stable for the implemented subset, but versioning rules need to be explicit before v1.
- Python packaging exists, but the JavaScript implementation is still the reference implementation.
- There is no renderer story yet, which is fine for v0 but needs a stated non-goal/extension model.

Why it is already stronger than Markdown for agents:

- Every semantic unit is typed.
- Unknown blocks fail validation instead of silently degrading.
- There is one syntax for each v0 concept.
- Raw HTML/JSX and arbitrary code execution are excluded.
- The formatter is part of the base tool, not a later ecosystem patch.

## Scorecard

| Format | Grade for human prose | Grade for agent context | Main strength | Main mistake Lessmark must avoid |
| --- | ---: | ---: | --- | --- |
| Markdown | A | C | Ubiquitous, readable, low ceremony | Underspecified variants, raw HTML, many equivalent forms |
| CommonMark | A- | B- | Stronger spec and test culture | Still inherits Markdown's HTML and prose-first model |
| MDX | B | D+ | Interactive docs and components | Blends Markdown with JSX/JavaScript concerns |
| AsciiDoc | B+ | C+ | Powerful technical docs | Preprocessor/includes/macros create pipeline complexity |
| reStructuredText | B | C+ | Directives and mature Python docs ecosystem | Directives are parser constructs, raw/include security knobs |
| MyST | B+ | C+ | Brings directives/roles to Markdown/Sphinx | Superset strategy makes extension behavior broad and contextual |
| Markdoc | A- | B | Declarative tags, schema validation, AST tooling | Still documentation-site oriented; variables/functions add runtime decisions |
| Djot | A- | B | Coherent CommonMark rethink, better parsing discipline | Still a general prose markup language with broad feature scope |
| Org mode | A for Emacs users | C | Literate workflows and task metadata | Code evaluation/tangling is too powerful for untrusted agent context |
| Typst | A for typesetting | D for agent context | Modern programmable typesetting | Scripting/show rules are a language runtime, not safe context data |
| Lessmark v0 | C+ | B- | Typed context blocks, stable AST, no execution | Too young; must resist feature creep |

## Lessons

### 1. Do not inherit Markdown compatibility debt

CommonMark fixes a lot by specifying Markdown behavior and providing a reference strategy, but it still has raw HTML blocks and Markdown's prose-first assumptions. Lessmark should borrow the readability, not compatibility.

Rule for Lessmark: no "also valid Markdown" promise. `.lmk` is its own format.

### 2. Do not let raw HTML or JSX into source

MDX is useful when documents are React components, but official MDX docs describe it as Markdown plus JSX and JavaScript syntax. That is the opposite of an agent context file: agents need stable data, not frontend component execution risk.

Rule for Lessmark: typed blocks can describe links/files/APIs, but cannot execute components or embed JSX.

### 3. Avoid preprocessor magic

AsciiDoc includes are useful, but official docs describe include as a preprocessor directive that is replaced before parsing and may include files or URLs. That makes meaning depend on external IO and processor settings.

Rule for Lessmark: file references are data (`@file path="..."`), not transclusion.

### 4. Keep extensions typed and schema-bound

reStructuredText and MyST prove that directives are powerful, but they also create a broad extension surface. Markdoc's strongest idea is schema validation around custom tags and a content-as-data AST.

Rule for Lessmark: future custom blocks must be declared in a schema before they parse as valid.

### 5. No document-time code execution

Org mode is powerful because Babel can evaluate code blocks and insert results. That is wrong for untrusted agent instructions. Typst is excellent for programmable typesetting, but its scripting mode and show rules are too broad for an agent-readable context file.

Rule for Lessmark: Lessmark files are data only. Tools may read them; documents do not run.

### 6. Keep the base language boring

Djot is the best general "Markdown, but more coherent" reference. It shows that a cleaner Markdown-family language is possible, but it is still a general markup language. Lessmark should be narrower and more semantic.

Rule for Lessmark: no tables, footnotes, math, smart typography, embedded diagrams, or prose-layout features in v0.

## Design standard for v1

Lessmark should only add a feature if it passes all checks:

- It gives agents a clearer typed AST.
- It has exactly one syntax.
- It can be formatted deterministically.
- It validates without executing code or loading remote content.
- It does not require a renderer to understand the document.
- It works as plain text in any editor.
- It has conformance fixtures before release.

## Markdown 2 positioning

Lessmark can be described as **Markdown 2 for agent context**, but not as a drop-in Markdown replacement.

Use this wording:

> Lessmark is a Markdown-inspired context format for humans and agents: stricter than Markdown, simpler than MDX, and built around a stable typed AST.

Avoid this wording:

> Lessmark replaces Markdown.

That claim would force Lessmark into blogs, docs engines, rendering themes, tables, images, math, extensions, plugins, and compatibility promises. That is exactly how the previous formats grew complexity.

## Sources

- CommonMark spec: https://spec.commonmark.org/
- MDX docs: https://mdxjs.com/docs/what-is-mdx/
- Asciidoctor include directive docs: https://docs.asciidoctor.org/asciidoc/latest/directives/include/
- Docutils reStructuredText directives: https://docutils.sourceforge.io/docs/ref/rst/directives.html
- MyST overview: https://mystmd.org/docs/spec/overview
- Markdoc design article: https://stripe.com/blog/markdoc
- Djot overview by John MacFarlane: https://johnmacfarlane.net/tools.html
- Org Babel evaluation docs: https://orgmode.org/manual/Evaluating-Code-Blocks.html
- Typst syntax docs: https://typst.app/docs/reference/syntax/