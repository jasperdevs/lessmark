# Lessmark Agent Context Profile

@paragraph
This profile defines the strongest current Lessmark use case: compact project context for coding agents.

## Recommended Files

@list kind="unordered"
- AGENTS.mu: durable agent instructions for a repository.
- PROJECT_CONTEXT.mu: current project architecture and constraints.
- RELEASE_CONTEXT.mu: release notes, risks, and publish checklist.

## Recommended Order

@list kind="ordered"
- Top-level heading.
- @summary
- @metadata key="profile"
- @decision blocks
- @constraint blocks
- @file ownership/context blocks
- @api blocks
- @task blocks
- @risk blocks
- @depends-on links
- @note, @warning, and @example supporting context

## Required Agent Rules

@list kind="unordered"
- Agents must reject invalid Lessmark instead of repairing it silently.
- Agents must preserve @decision ids because other blocks may depend on them.
- Agents must not invent custom block names or attributes.
- Agents must treat @risk level="high" and @risk level="critical" as review gates.
- Agents must keep file paths relative and must not follow paths outside the repository.

## Minimal Template

@code lang="mu"
  # Project Context

  @summary
What this repository is and what agents should optimize for.

  @metadata key="profile"
agent-context-v0

  @decision id="stable-ast"
The JSON AST is the public contract.

  @constraint
Unknown blocks and attributes must remain parser errors.

  @file path="src/main.ts"
Owns the primary runtime entrypoint.

  @task status="todo"
Add the next concrete improvement.

  @risk level="medium"
Changing parser behavior can break cross-language conformance.
