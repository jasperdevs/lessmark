# Markdown research notes

Status: draft, 2026-04-27

This document captures what Lessmark should learn from Markdown criticism, Markdown alternatives, and real user pain.

## Research summary

The recurring criticism is not that Markdown is bad at its original job. Markdown is excellent at lightweight prose that can become HTML. The problem is that Markdown is now used as a structured data language, a docs framework substrate, a notebook format, a prompt format, a component runtime, and an agent memory format.

Lessmark should not compete with all of those. It should own one job: strict, typed project context for humans and agents.

## Original Markdown

The original Markdown docs prioritize readability and describe Markdown as a writing format for the web. They also explicitly allow HTML passthrough for anything Markdown does not cover.

Lessons:

- Keep readability as a core value.
- Do not inherit HTML passthrough.
- Do not inherit optional/cosmetic syntax like closing heading markers.
- Do not inherit multiple bullet markers or lazy continuation rules.

## CommonMark

CommonMark is the strongest lesson in why specs matter. Its spec notes parsing ambiguities and the insufficiency of `Markdown.pl` as a behavioral reference.

Lessons:

- Lessmark needs a spec and fixtures from day one.
- The reference implementation is not enough; the AST snapshots are the contract.
- Avoid compatibility promises that require preserving historical ambiguity.

## GitHub Flavored Markdown and flavor drift

Markdown users often assume flavors are compatible until they hit subtle parser differences. Reddit and Obsidian discussions repeatedly show frustration around ambiguity, incompatibility, and renderer-specific behavior.

Lessons:

- Lessmark must have a declared version.
- Unknown syntax should fail, not degrade into prose.
- A file should not depend on which app opened it.

## MDX

MDX intentionally combines Markdown with JSX, JavaScript expressions, and ESM imports/exports. That is useful for interactive docs, but bad for untrusted agent context.

Lessons:

- Do not import code from a context document.
- Do not support JSX components.
- Do not allow arbitrary expressions.
- Keep documents as data.

## AsciiDoc

AsciiDoc is powerful for serious technical docs, but include directives are preprocessors. They can import files or URLs before parse-time structure exists.

Lessons:

- Do not add include/transclusion to core Lessmark.
- Represent file references as data.
- If future bundling exists, make it a tool command, not document semantics.

## reStructuredText

reStructuredText has directives and raw passthrough. Docutils explicitly warns that raw is a potential security hole and reduces portability.

Lessons:

- Raw passthrough is a design smell.
- Output-format-specific content should not be in `.lmk`.
- If users keep asking for raw output, add a typed data block or reject the use case.

## MyST

MyST brings directives and roles into Markdown and is intentionally extensible. It is useful for scientific/docs workflows, but broad extension behavior makes agent interpretation depend on more context.

Lessons:

- Extension points need schemas.
- Unknown directives should not be treated as valid content.
- Inline roles are probably out of scope for v0.

## Markdoc

Markdoc is the closest positive reference. It has syntax, tags, variables, functions, rendering, and validation. Its validation model is useful. Its runtime variables/functions are less suitable for Lessmark's core.

Lessons:

- Borrow schema validation discipline.
- Avoid runtime functions in source.
- Keep rendering optional and downstream.

## Djot

Djot is a cleaner rethink of Markdown by John MacFarlane. It is valuable as a general markup reference, but it is still prose/layout oriented.

Lessons:

- A cleaner Markdown is possible.
- Lessmark should not become a general prose markup language.
- Agent context benefits more from typed records than rich inline formatting.

## Org mode

Org mode proves that plain text can support tasks, metadata, and literate programming. It also proves that code evaluation becomes a security and reproducibility boundary.

Lessons:

- Task/status metadata is useful.
- Code execution is not acceptable in Lessmark documents.
- Results blocks and cached execution are out of scope.

## Typst

Typst is excellent for programmable typesetting. It is not a model for Lessmark because it includes a scripting language, show rules, plugins, and a broad standard library.

Lessons:

- Do not become a typesetting language.
- Do not add scripting to solve layout problems.
- Keep Lessmark lower-level and more data-like.

## Reddit and community pain points

Community discussions repeatedly point to:

- Ambiguity and redundancy.
- App-specific incompatibility.
- Tables being painful in raw text.
- HTML/CSS/Mermaid causing parser boundary confusion.
- Markdown being good for quick comments but weak for structured docs.

Lessons:

- Lessmark should be app-independent.
- Do not add visual table syntax in v0.
- Do not mix markup languages inline.
- Prioritize structured semantics over visual layout.

## Design consequences for Lessmark

1. Lessmark is AST-first.
2. Lessmark validates before rendering.
3. Lessmark forbids raw HTML/JSX.
4. Lessmark has one syntax per concept.
5. Lessmark uses typed blocks as the main unit.
6. Lessmark keeps file/link references inert.
7. Lessmark avoids includes, imports, plugins, and code evaluation.
8. Lessmark treats unknown syntax as an error.
9. Lessmark uses fixtures as conformance tests.
10. Lessmark does not promise Markdown compatibility.

## Source index

- Original Markdown syntax: https://daringfireball.net/projects/markdown/syntax
- CommonMark spec: https://spec.commonmark.org/0.31.2/
- MDX docs: https://mdxjs.com/docs/what-is-mdx/
- Asciidoctor include directive docs: https://docs.asciidoctor.org/asciidoc/latest/directives/include/
- Docutils reStructuredText directives: https://docutils.sourceforge.io/docs/ref/rst/directives.html
- MyST overview: https://mystmd.org/spec/overview
- Markdoc syntax: https://markdoc.dev/docs/syntax
- Markdoc functions: https://markdoc.dev/docs/functions
- Markdoc validation: https://markdoc.dev/docs/validation
- Djot: https://djot.net/
- Org Babel evaluation: https://orgmode.org/manual/Evaluating-Code-Blocks.html
- Typst syntax: https://typst.app/docs/reference/syntax/
- Wilfred Hughes critique: https://www.wilfred.me.uk/blog/2012/07/30/why-markdown-is-not-my-favourite-language/
- Logic Grimoire critique: https://logicgrimoire.wordpress.com/2015/02/07/why-markdown-is-not-my-favorite-text-markup-language/
- Reddit Obsidian ambiguity discussion: https://www.reddit.com/r/ObsidianMD/comments/128z2ew/why_was_markdown_chosen_with_all_its_ambiguities/
- Reddit Obsidian/CommonMark compatibility discussion: https://www.reddit.com/r/ObsidianMD/comments/1s4zozn/obsidian_markdown_is_incompatible_with_commonmark/
- Reddit Markdown pain discussion: https://www.reddit.com/r/Markdown/comments/1rswts2/whats_the_most_painful_part_of_writing_technical/
- Hacker News discussion on raw HTML and standardization: https://news.ycombinator.com/item?id=42235792
- Theo/daily.dev summary of Markdown critique video: https://app.daily.dev/posts/markdown-is-a-terrible-language-mhemw8eww