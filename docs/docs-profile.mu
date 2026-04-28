# Lessmark Docs Profile

@paragraph
The docs profile is the publishing layer for Lessmark. It follows the same rule as the core agent-context profile: one explicit syntax per meaning, no raw HTML, and no global reference resolution.

## Design Rules

@list kind="unordered"
- Use typed blocks, not punctuation tricks.
- Render from the AST, not from source text.
- Keep one canonical source spelling per structure. Documented authoring conveniences are allowed only when they format back to canonical blocks, attributes, or inline functions.
- Keep inline markup as explicit functions: {{strong:text}}, {{em:text}}, {{code:text}}, {{kbd:text}}, {{del:text}}, {{mark:text}}, {{sup:text}}, {{sub:text}}, {{ref:label\|target}}, {{footnote:id}}, and {{link:label\|href}}.
- Reject unknown inline functions during rendering.
- Keep links and assets safe: no executable URL schemes, no absolute local paths, and no .. path traversal.
- Do not add user-defined execution hooks by default.

## Authoring Convenience Rule

@paragraph
Conveniences are not a second language. They are typing helpers that must compile into the canonical AST and formatter output. The accepted block conveniences are @p, @ul, @ol, and one-token attributes such as @task todo, @decision storage-backend, @risk high, @file src/app.ts, @api parseLessmark, @code ts, @callout warning, @definition API, @table Name\|Value, @metadata project.stage, @link https://example.com, @reference slug, @footnote note, and @depends-on slug.

@paragraph
The accepted prose shortcuts are `code`, *emphasis*, **bold**, ~~deleted~~, ==marked==, [label](https://example.com), [label](#local-slug), and [^footnote-id]. @code and @example bodies stay literal. Anything outside that list is invalid or plain text.

## Page Metadata

@code lang="mu"
  @page title="Docs Home" output="index.html"

@paragraph
The page block is optional. title controls the HTML document title. output controls lessmark build output and must be a safe relative .html path.

## Site Navigation

@paragraph
Use one bodyless @nav block per navigation item. Renderers group primary and footer items into site chrome.

@code lang="mu"
  @nav label="Home" href="index.html"
  @nav label="Spec" href="spec.html"
  @nav label="GitHub" href="https://github.com/jasperdevs/lessmark" slot="footer"

@paragraph
href uses the same safe-link rules as @link. slot is optional and must be primary or footer; if omitted, the item is primary. Active/current state is renderer-derived, not authored.

## Local References

@paragraph
Local targets use lowercase slugs. Heading anchors are generated from heading text; duplicate generated anchors receive -2, -3, and later suffixes. @reference target must resolve to a local heading anchor, @decision id, or @footnote id; broken local references are invalid. @reference and {{ref:label\|target}} are explicit local links only, not global reference definitions.

## Common Docs Blocks

@code lang="mu"
  @paragraph
Write normal prose with {{strong:explicit}} inline functions, {{mark:highlights}}, {{ref:local references|build-system}}, and {{footnote:strict-syntax}}.

  @nav label="Home" href="index.html"

  @nav label="Spec" href="spec.html"

  @nav label="GitHub" href="https://github.com/jasperdevs/lessmark" slot="footer"

  @image src="assets/diagram.svg" alt="Build pipeline" caption="Static output"

  @separator

  @list kind="unordered"
- Parse strict source.
- Validate typed blocks.
- Render safe HTML.

  @table columns="Feature|Status"
Typed blocks\|agents|done
Raw HTML|rejected

  @quote cite="BGs Labs"
If you want a simple language, stay simple.

  @callout kind="tip" title="No hooks by default"
Use built-in blocks before adding execution surfaces.

  @toc

  ## Build System

  @definition term="Build system"
A deterministic renderer that turns typed Lessmark into static output without raw HTML.

  @reference target="build-system" label="Build system section"
Jump to the build-system section.

  @footnote id="strict-syntax"
Lessmark keeps one explicit spelling for each supported structure.

## CLI

@code lang="sh"
lessmark render --document docs/index.mu
lessmark build docs public
lessmark build --strict docs public
lessmark fix --write docs/index.mu
lessmark info --json

@paragraph
render writes HTML to stdout. build recursively converts .mu and .lessmark files to .html, copies non-Lessmark static assets, and uses @page output when present. build --strict parses and render-checks every page, rejects duplicate outputs and output collisions, checks built page links, relative linked assets, and image assets, then writes pages only after preflight passes. info --json exposes the supported syntax and renderer capabilities for agents. fix is the canonical formatter alias; it rewrites documented authoring conveniences and rejects unsupported shorthand syntax.

## What This Intentionally Does Not Add

@list kind="unordered"
- raw HTML passthrough
- reference-style links
- implicit/global footnote syntax
- implicit reference resolution
- layout, component, class, or style directives
- arbitrary plugin hooks
- expression syntax
- undocumented alternate spellings for the same structure
- nested list syntax in current source
