# Lessmark vs Markdown

This is the current unbiased grade of Lessmark against Markdown/GitHub Flavored Markdown. The main grade ignores ecosystem support because the current product goal is strict agent-readable context, not replacing Markdown's existing network effects.

## Verdict

Lessmark is not a better Markdown for the whole existing Markdown ecosystem. It is better for narrower jobs: structured agent context and strict static docs where invalid input should fail, blocks should have known meaning, and tools should receive a compact JSON AST.

Markdown is still better for broad editor support, GitHub rendering, mature publishing integrations, and human habit. Lessmark now has a strict docs profile for safe static sites, but not Markdown's ecosystem.

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
| Tables, lists, images, rich docs | 9 | 7 | Markdown |
| Parser maturity | 9 | 7 | Markdown |
| Strict validation | 4 | 9 | Lessmark |
| Agent-readable structure | 5 | 9 | Lessmark |
| Stable compact AST | 6 | 9 | Lessmark |
| Security by default | 6 | 9 | Lessmark |
| Cross-language conformance in this repo | 7 | 8 | Lessmark |
| Specification completeness | 9 | 8 | Markdown |
| File-type/platform recognition | 10 | 3 | Markdown |

Overall, if broad ecosystem support is counted:

- Markdown/GFM: **8.3/10**
- Lessmark v0: **7.2/10**
- Lessmark for agent context only: **8.7/10**

Overall, if support/network effects are excluded:

- Markdown/GFM for agent context: **7.4/10**
- Lessmark v0 for agent context: **8.8/10**
- Lessmark v0 for safe docs/sites: **7.4/10**

## What Lessmark Is Better At

- Known block names instead of ambiguous prose conventions.
- Parser rejects loose text, unknown attributes, raw HTML, JSX-like tags, unsafe file paths, and unsafe link schemes.
- The docs profile renders pages, images, lists, tables, quotes, callouts, TOCs, and explicit inline functions without raw HTML.
- The AST shape is small and stable by default.
- The Rust, JavaScript, and Python implementations are checked against shared fixtures.
- It is harder for an agent to invent unsupported document structure silently.

## What Markdown Is Better At

- GitHub renders it everywhere, including repository home READMEs.
- People already know it.
- Editors, linters, previewers, static-site generators, package registries, and docs systems already support it.
- GFM includes mature tables, task lists, autolinks, strikethrough, raw HTML handling, and many common documentation patterns.
- CommonMark/GFM have much deeper public test coverage and parser battle history.

## Missing Before Lessmark Can Claim More

1. A formal language spec with more examples and explicit error cases.
2. A public conformance badge and test corpus policy.
3. More fixtures for edge cases: escapes, line endings, Unicode, long files, malformed docs blocks, and renderer failures.
4. A constrained extension API if build-time hooks are ever added.
5. IANA submission for `text/vnd.lessmark` after the spec URL and contact are stable.
6. Editor and GitHub recognition when the language surface settles.

## Best Current Positioning

Use Markdown where GitHub-native rendering and existing docs ecosystems matter most.

Use Lessmark for files agents and tools must parse reliably, and for static docs where strictness is more important than Markdown compatibility:

- project context
- durable decisions
- constraints
- task state
- code or API notes
- risk notes
- file ownership maps
- safe static pages

That position is honest and strong. Claiming Lessmark has replaced Markdown's ecosystem would be wrong today.
