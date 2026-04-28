# BGs Labs Markdown Critique Alignment

Source: <https://bgslabs.org/blog/why-are-we-using-markdown/>

## Fixed by Lessmark

- Multiple spellings for one meaning: Lessmark keeps one heading form and one typed block form.
- Inline HTML as an escape hatch: raw HTML and JSX-like tags are rejected.
- Reference-style global resolution: Lessmark has no reference definitions or footnotes.
- Parser ambiguity from old email-era syntax: Lessmark does not support setext headings, thematic-break collisions, or alternate list markers.
- Undefined extension points: unknown block names, unknown attributes, and unknown inline render functions fail.

## Fixed by This Docs Pass

- Missing publication path: `lessmark render` and `lessmark build` now emit safe static HTML.
- Missing docs primitives: `@page`, `@paragraph`, `@image`, `@list`, `@table`, `@quote`, `@callout`, and `@toc` cover normal docs/site pages.
- Missing safe inline markup: inline functions provide bold, emphasis, code, keyboard text, and links without Markdown delimiter ambiguity.

## Still Intentionally Not Fixed

- Arbitrary hooks/macros: these can recreate the plugin/security problem. They should only be added later as a constrained build API.
- Full Markdown compatibility: Lessmark is a strict alternative, not a CommonMark superset.
- GitHub native rendering: GitHub does not render `.mu` as repository home content today.

## Practical Grade Against the Article

- Ambiguity: 9/10
- HTML/XSS surface: 9/10
- Local parseability: 9/10
- Build-system foundation: 7/10
- Full publishing ecosystem: 4/10
