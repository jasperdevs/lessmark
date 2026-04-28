# BGs Labs Markdown Critique Alignment

@paragraph
Source: https://bgslabs.org/blog/why-are-we-using-markdown/

## Fixed by Lessmark

@list kind="unordered"
- Multiple spellings for one meaning: Lessmark keeps one heading form and one typed block form.
- Inline HTML as an escape hatch: raw HTML and JSX-like tags are rejected.
- Reference-style global resolution: Lessmark has no implicit reference definitions; notes and references are explicit typed blocks.
- Parser ambiguity from old email-era syntax: Lessmark does not support setext headings, thematic-break collisions, or alternate list markers.
- Undefined extension points: unknown block names, unknown attributes, and unknown inline render functions fail.

## Fixed by This Docs Pass

@list kind="unordered"
- Missing publication path: lessmark render and lessmark build --strict now emit safe static HTML and reject broken page, image, and relative asset targets.
- Missing agent contract: check --json returns stable error codes and info --json exposes the supported syntax and renderer capabilities.
- Missing docs primitives: @page, @paragraph, @image, @separator, @list, @table, @quote, @callout, and @toc cover normal docs/site pages.
- Missing safe inline markup: inline functions provide bold, emphasis, code, keyboard text, and links without Markdown delimiter ambiguity.
- Missing semantic docs primitives: @definition, @reference, @footnote, local {{ref:label\|target}}, and {{footnote:id}} cover glossaries, local navigation, and notes without global reference resolution.
- Missing site chrome foundation: bodyless @nav items cover simple primary/footer navigation without raw HTML, layout directives, or component syntax.
- Missing governance process: docs/governance.mu, docs/conformance.mu, schemas/profiles-v0.contract.json, and the GitHub format-change issue form make stewardship and profile changes explicit.

## Still Intentionally Not Fixed

@list kind="unordered"
- Arbitrary hooks/macros: these can recreate the plugin/security problem. They should only ship as a constrained build API with a separate security model.
- Full Markdown compatibility: Lessmark is a strict alternative, not a CommonMark superset.
- GitHub native rendering: GitHub does not render .mu as repository home content today.

## Practical Grade Against the Article

@list kind="unordered"
- Ambiguity: 9/10
- HTML/XSS surface: 9/10
- Local parseability: 9/10
- Build-system foundation: 8/10
- Full publishing ecosystem: 4/10
- Semantic docs coverage: 8.5/10
- Governance and conformance discipline: 9/10
