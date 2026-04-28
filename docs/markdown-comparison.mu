# Lessmark vs Markdown

@paragraph
This is the current unbiased grade of Lessmark against Markdown/GitHub Flavored Markdown. The main grade ignores ecosystem support because the current product goal is strict agent-readable context, not replacing Markdown's existing network effects.

## Verdict

@paragraph
Lessmark is not a better Markdown for the whole existing Markdown ecosystem. It is better for narrower jobs: structured agent context and strict static docs where invalid input should fail, blocks should have known meaning, and tools should receive a compact JSON AST.

@paragraph
Markdown is still better for broad editor support, GitHub rendering, mature publishing integrations, and human habit. Lessmark now has a strict docs profile, structured error codes, capability discovery, and strict static-site checks, but not Markdown's ecosystem.

@paragraph
Basis:

@list kind="unordered"
- Markdown's stated design goal is readable, writable plain text that can become HTML: https://daringfireball.net/projects/markdown/
- GFM is the Markdown dialect GitHub supports for user content: https://github.github.io/gfm/
- GFM/CommonMark have a large public spec with conformance examples: https://spec.commonmark.org/
- GitHub Markup renders Markdown, RST, AsciiDoc, Org, Textile, and several other formats, but not Lessmark today: https://github.com/github/markup#markups

## Scoring Method

@paragraph
Scores are 0-10 estimates based on current checked repo behavior, public platform support, and documented spec coverage. Ecosystem rows score adoption outside this repo; conformance rows score the actual JavaScript, Python, and Rust checks in scripts/conformance.mjs.

## Scorecard

@table columns="Area|Markdown/GFM|Lessmark|Winner"
Human prose readability|10|8|Markdown
GitHub README support|10|2|Markdown
Ecosystem and editor support|10|2|Markdown
Tables, lists, images, rich docs|9|8.8|Markdown
Simple static-site navigation|8|8|Tie
Parser maturity|9|8.3|Markdown
Strict validation|4|9.3|Lessmark
Agent-readable structure|5|9.4|Lessmark
Stable compact AST|6|9|Lessmark
Security by default|6|9|Lessmark
Cross-language conformance in this repo|7|9.2|Lessmark
Specification completeness|9|9|Tie
File-type/platform recognition|10|3|Markdown

@paragraph
Overall, if broad ecosystem support is counted:

@list kind="unordered"
- Markdown/GFM: {{strong:8.3/10}}
- Lessmark v0: {{strong:8.5/10}}
- Lessmark for agent context only: {{strong:9.4/10}}

@paragraph
Overall, if support/network effects are excluded:

@list kind="unordered"
- Markdown/GFM for agent context: {{strong:7.4/10}}
- Lessmark v0 for agent context: {{strong:9.4/10}}
- Lessmark v0 for safe docs/sites: {{strong:9.2/10}}

## What Lessmark Is Better At

@list kind="unordered"
- Known block names instead of ambiguous prose conventions.
- Parser rejects loose text, unknown attributes, raw HTML, JSX-like tags, unsafe file paths, and unsafe link schemes.
- The docs profile renders pages, primary/footer navigation, images, lists, tables, quotes, callouts, TOCs, definitions, explicit references, footnotes, and explicit inline functions without raw HTML.
- Table body cells can include literal pipes with \\|, and malformed list/table bodies are rejected during validation.
- @reference targets are checked against local headings, decisions, and footnotes instead of leaving broken local links for render time.
- Documented human authoring conveniences cover the common typing pain: @p, @ul, @ol, one-token block attributes, `code`, *emphasis*, **bold**, links, local refs, footnotes, marks, and deletion. They format back to canonical source instead of becoming a new dialect.
- The AST shape is small and stable by default.
- check --json returns stable error codes, and info --json tells agents which syntax, commands, and renderer features exist.
- build --strict rejects unsafe inline render links, duplicate outputs, output collisions, and broken page, image, or relative asset links before writing pages.
- The Rust, JavaScript, and Python implementations are checked against shared fixtures, full validation error arrays, deterministic generated valid examples, BOM/CRLF normalization, Markdown import/export parity, a shared language contract manifest, and a shared profile contract manifest.
- Governance docs and the GitHub format-change issue form make language and profile changes explicit before implementation.
- Nested explicit inline functions render and export without Markdown delimiter ambiguity.
- It is harder for an agent to invent unsupported document structure silently.

## What Markdown Is Better At

@list kind="unordered"
- GitHub renders it everywhere, including repository home READMEs.
- People already know it.
- Editors, linters, previewers, static-site generators, package registries, and docs systems already support it.
- GFM includes mature tables, task lists, autolinks, strikethrough, raw HTML handling, and many common documentation patterns.
- CommonMark/GFM have much deeper public test coverage and parser battle history.

## Current Boundaries

@list kind="ordered"
- GitHub does not render Lessmark repository home pages.
- Existing editors, linters, package registries, and docs systems do not broadly support Lessmark.
- Nested lists are intentionally rejected in v0 source to preserve one flat, typed list shape.
- Cross-page link and asset checking is handled by build --strict, not by source parsing.
- Build-time hooks, custom components, style directives, and undocumented shorthand aliases are intentionally outside v0.
- text/vnd.lessmark and GitHub Linguist recognition remain platform adoption work, not language semantics.
- The conformance corpus is strong for this repo but not CommonMark-scale.

## Best Current Positioning

@paragraph
Use Markdown where GitHub-native rendering and existing docs ecosystems matter most.

@paragraph
Use Lessmark for files agents and tools must parse reliably, and for static docs where strictness is more important than Markdown compatibility:

@list kind="unordered"
- project context
- durable decisions
- constraints
- task state
- code or API notes
- risk notes
- file ownership maps
- safe static pages

@paragraph
That position is honest and strong. Claiming Lessmark has replaced Markdown's ecosystem would be wrong today.
