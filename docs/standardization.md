# Lessmark Standardization Notes

Sources:

- <https://blog.codinghorror.com/responsible-open-source-code-parenting/>
- <https://blog.codinghorror.com/the-future-of-markdown/>
- <https://blog.codinghorror.com/standard-flavored-markdown/>
- <https://blog.codinghorror.com/standard-markdown-is-now-common-markdown/>
- <https://www.metafilter.com/142475/Standard-flavored-Markdown>
- <https://arstechnica.com/information-technology/2014/10/markdown-throwdown-what-happens-when-foss-software-gets-corporate-backing/>
- <https://news.ycombinator.com/item?id=4700160>
- <https://www.osnews.com/story/143128/markdown-is-a-disaster-why-and-what-to-do-instead/>

## Lessons to Keep

- A readable text format still needs an unambiguous specification.
- The test suite is part of the language contract, not just repo maintenance.
- Popular variants should be named and documented instead of silently accepted.
- New syntax should be rare. Widespread, boring use cases deserve first-class blocks; everything else should stay invalid until it earns a versioned change.
- Defaults must be explicit. Line endings, raw HTML, links, assets, and inline markup should not depend on renderer taste.
- Naming is governance. Do not imply that Lessmark is the standard for Markdown, a blessed Markdown successor, or a compatible Markdown dialect.
- Stewardship cannot be implied. If the project wants community adoption, it must publish where decisions happen, how compatibility is tested, and who can approve a format change.
- Drama usually starts where ownership, names, compatibility, and authority are vague. Lessmark should make those boundaries boring.

## Lessmark Policy

- `docs/spec.md` is the source contract for v0.
- `schemas/ast-v0.schema.json` is the AST contract.
- `fixtures/valid/` and `fixtures/invalid/` are conformance fixtures.
- `scripts/conformance.mjs` must compare JavaScript, Python, and Rust parsing, formatting, validation, Markdown import, and Markdown export behavior.
- Unknown blocks, unknown attributes, and unknown inline functions remain errors.
- Lessmark does not support private flavors in source syntax. A future profile must be documented as a named profile and backed by fixtures.
- Lessmark is Markdown-inspired, not Markdown-compatible by default. Marketing and docs should not call it Standard Markdown, Common Markdown, Better Markdown, or a Markdown replacement.
- Any breaking syntax or AST change needs a new format version. Do not silently repurpose v0 syntax.
- Every accepted profile must state its audience, renderer assumptions, and security model.

## Stewardship Policy

- The repository is the project home for source, spec, fixtures, schemas, and release notes.
- A format change must include rationale, spec text, schema updates when AST shape changes, valid fixtures, invalid fixtures when relevant, and cross-runtime conformance.
- Compatibility claims must name the exact surface: source parser, AST, Markdown import, Markdown export, renderer, CLI, or package format.
- If the project becomes multi-maintainer, format changes should be reviewed in public issues or pull requests before release.
- Security-sensitive rendering changes must default to rejecting input rather than sanitizing ambiguous source after the fact.

## Current Named Profiles

- Agent context profile: structured project context for agents and tools.
- Docs profile: strict static docs and website pages with safe rendering.

## Things Not to Add Casually

- Raw HTML passthrough.
- Global reference resolution.
- Renderer-specific syntax.
- User-defined macros or hooks.
- Multiple spellings for the same document meaning.
- Unreviewed dialect switches or hidden renderer options.
- Name changes that imply external endorsement.

Those features are exactly how a simple format becomes hard to parse, hard to test, and hard for agents to trust.
