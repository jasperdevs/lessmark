# Lessmark Agent Context Profile

This profile defines the strongest current Lessmark use case: compact project context for coding agents.

## Recommended Files

- `AGENTS.lmk`: durable agent instructions for a repository.
- `PROJECT_CONTEXT.lmk`: current project architecture and constraints.
- `RELEASE_CONTEXT.lmk`: release notes, risks, and publish checklist.

## Recommended Order

1. Top-level heading.
2. `@summary`
3. `@metadata key="profile"`
4. `@decision` blocks
5. `@constraint` blocks
6. `@file` ownership/context blocks
7. `@api` blocks
8. `@task` blocks
9. `@risk` blocks
10. `@depends-on` links
11. `@note`, `@warning`, and `@example` supporting context

## Required Agent Rules

- Agents must reject invalid Lessmark instead of repairing it silently.
- Agents must preserve `@decision` ids because other blocks may depend on them.
- Agents must not invent custom block names or attributes.
- Agents must treat `@risk level="high"` and `@risk level="critical"` as review gates.
- Agents must keep file paths relative and must not follow paths outside the repository.

## Minimal Template

```lmk
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
```
