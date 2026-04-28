# Lessmark Standardization Notes

Source: <https://blog.codinghorror.com/the-future-of-markdown/>

## Lessons to Keep

- A readable text format still needs an unambiguous specification.
- The test suite is part of the language contract, not just repo maintenance.
- Popular variants should be named and documented instead of silently accepted.
- New syntax should be rare. Widespread, boring use cases deserve first-class blocks; everything else should stay invalid until it earns a versioned change.
- Defaults must be explicit. Line endings, raw HTML, links, assets, and inline markup should not depend on renderer taste.

## Lessmark Policy

- `docs/spec.md` is the source contract for v0.
- `schemas/ast-v0.schema.json` is the AST contract.
- `fixtures/valid/` and `fixtures/invalid/` are conformance fixtures.
- `scripts/conformance.mjs` must compare JavaScript, Python, and Rust parsing, formatting, validation, Markdown import, and Markdown export behavior.
- Unknown blocks, unknown attributes, and unknown inline functions remain errors.
- Lessmark does not support private flavors in source syntax. A future profile must be documented as a named profile and backed by fixtures.

## Current Named Profiles

- Agent context profile: structured project context for agents and tools.
- Docs profile: strict static docs and website pages with safe rendering.

## Things Not to Add Casually

- Raw HTML passthrough.
- Global reference resolution.
- Renderer-specific syntax.
- User-defined macros or hooks.
- Multiple spellings for the same document meaning.

Those features are exactly how a simple format becomes hard to parse, hard to test, and hard for agents to trust.
