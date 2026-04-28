# Lessmark v0 Profiles

@paragraph
Profiles are named use cases, not private dialects. A profile can recommend blocks, renderer assumptions, and a security model, but it cannot silently add source syntax.

## Accepted Profiles

@table columns="Profile|Audience|Renderer|Security model"
agent-context|agents and tools reading project context|none required|non-executable source with no raw HTML, hooks, custom blocks, or path traversal
docs|strict static docs and simple documentation sites|npm CLI safe HTML renderer|escaped HTML output with safe links, safe resources, and strict build checks

## Machine Contract

@paragraph
schemas/profiles-v0.contract.json is the machine-readable profile contract. Packaged copies must stay byte-for-byte identical with the root copy.

@paragraph
The profile contract names accepted profiles, recommended blocks, disallowed features, and the minimum change-policy fields for any future profile.

## Profile Rules

@list kind="unordered"
- Profiles may narrow behavior for a use case.
- Profiles may recommend block sets and renderer assumptions.
- Profiles may not add private source syntax.
- Profiles may not enable raw HTML, hooks, custom blocks, or hidden renderer options.
- A new profile requires spec text, fixtures, conformance updates, and a security model.
- A breaking profile change requires a versioned format change or a new named profile.

## Why This Exists

@paragraph
Markdown fragmented because implementations accumulated flavors and extension switches. Lessmark keeps profiles explicit so agents and humans can know which surface they are reading before they parse it.
