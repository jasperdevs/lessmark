# Lessmark Governance

@paragraph
Lessmark governance is designed to avoid the Markdown failure modes: unclear ownership, hidden dialects, ambiguous compatibility claims, and social arguments over naming.

## Project Home

@paragraph
The repository is the source of truth for v0. The current contract surfaces are docs/spec.mu, schemas/ast-v0.schema.json, schemas/language-v0.contract.json, schemas/profiles-v0.contract.json, fixtures, and scripts/conformance.mjs.

## Change Classes

@table columns="Class|Examples|Required evidence"
Patch|wording, docs, non-semantic test cleanup|docs parse and npm run check
Compatible language change|new block, new attribute, new inline function|spec, schemas, fixtures, all runtimes, conformance, profile review
Profile change|new named use case, changed renderer assumption|profiles contract, profile docs, fixtures, security model, conformance
Breaking change|changed parse result, removed syntax, changed AST shape|new version or explicit migration plan

## Format Change Process

@list kind="ordered"
- Open a format-change issue with the affected surface.
- State the use case and why existing blocks cannot cover it.
- Name every changed contract surface.
- Add valid fixtures and invalid fixtures when rejection behavior matters.
- Update JavaScript, Python, and Rust behavior together.
- Update schemas and profile contracts if the accepted surface changes.
- Run npm run check and keep CI green.
- Do not merge private dialects or renderer-only source syntax.

## Compatibility Claim Rules

@list kind="unordered"
- Say source parser when only source parsing is compatible.
- Say AST when the JSON shape is compatible.
- Say Markdown import or Markdown export when only that direction is compatible.
- Say npm renderer or npm build when the feature only exists in the npm CLI.
- Do not claim Markdown compatibility, GitHub compatibility, or ecosystem replacement without direct support.

## Naming Rules

@list kind="unordered"
- Lessmark is Markdown-inspired, not Markdown.
- Lessmark must not call itself Standard Markdown, Common Markdown, or official Markdown.
- Lessmark should compare against Markdown factually and avoid personal framing.
- New profiles need plain descriptive names, not names that imply outside endorsement.

## Stewardship

@paragraph
If Lessmark gains multiple maintainers, language and profile changes should be reviewed in public issues or pull requests before release. Security-sensitive rendering changes must default to rejecting input rather than accepting ambiguous source.
