# Lessmark vs Markdown

This is the current unbiased grade of Lessmark against Markdown/GitHub Flavored Markdown.

## Verdict

Lessmark is not a better Markdown. It is better only for a narrower job: structured agent context where invalid input should fail, blocks should have known meaning, and tools should receive a compact JSON AST.

Markdown is still better for public documentation, broad editor support, GitHub rendering, prose, tables, images, links, lists, and human habit.

Basis:

- Markdown's stated design goal is readable, writable plain text that can become HTML: <https://daringfireball.net/projects/markdown/>
- GFM is the Markdown dialect GitHub supports for user content: <https://github.github.io/gfm/>
- GFM/CommonMark have a large public spec with conformance examples: <https://spec.commonmark.org/>
- GitHub Markup renders Markdown, RST, AsciiDoc, Org, Textile, and several other formats, but not Lessmark today: <https://github.com/github/markup#markups>

## Scorecard

| Area | Markdown/GFM | Lessmark | Winner |
| --- | ---: | ---: | --- |
| Human prose readability | 10 | 7 | Markdown |
| GitHub README support | 10 | 2 | Markdown |
| Ecosystem and editor support | 10 | 2 | Markdown |
| Tables, lists, images, rich docs | 9 | 2 | Markdown |
| Parser maturity | 9 | 6 | Markdown |
| Strict validation | 4 | 9 | Lessmark |
| Agent-readable structure | 5 | 9 | Lessmark |
| Stable compact AST | 6 | 9 | Lessmark |
| Security by default | 6 | 9 | Lessmark |
| Cross-language conformance in this repo | 7 | 8 | Lessmark |
| Specification completeness | 9 | 6 | Markdown |
| File-type/platform recognition | 10 | 3 | Markdown |

Overall:

- Markdown/GFM: **8.3/10**
- Lessmark v0: **6.4/10**
- Lessmark for agent context only: **8.2/10**

## What Lessmark Is Better At

- Known block names instead of ambiguous prose conventions.
- Parser rejects loose text, unknown attributes, raw HTML, JSX-like tags, unsafe file paths, and unsafe link schemes.
- The AST shape is small and stable by default.
- The Rust, JavaScript, and Python implementations are checked against shared fixtures.
- It is harder for an agent to invent unsupported document structure silently.

## What Markdown Is Better At

- GitHub renders it everywhere, including repository home READMEs.
- People already know it.
- Editors, linters, previewers, static-site generators, package registries, and docs systems already support it.
- GFM includes tables, task lists, autolinks, strikethrough, raw HTML handling, and many common documentation patterns.
- CommonMark/GFM have much deeper public test coverage and parser battle history.

## Missing Before Lessmark Can Claim More

1. A formal language spec with more examples and explicit error cases.
2. A public conformance badge and test corpus policy.
3. Editor support, starting with VS Code syntax highlighting.
4. GitHub Linguist support for `.lmk` and `.lessmark`.
5. A real renderer package if Lessmark should become readable docs, not only agent context.
6. A documented Markdown import/export path.
7. More fixtures for edge cases: escapes, line endings, Unicode, long files, and malformed attributes.
8. IANA submission for `text/vnd.lessmark` after the spec URL and contact are stable.

## Best Current Positioning

Use Markdown for documentation humans read.

Use Lessmark for files agents and tools must parse reliably:

- project context
- durable decisions
- constraints
- task state
- code or API notes
- risk notes
- file ownership maps

That position is honest and strong. Claiming Lessmark is generally better than Markdown would be wrong today.
