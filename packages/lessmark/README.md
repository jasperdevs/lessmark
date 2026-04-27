# lessmark

Reference parser, validator, formatter, and AST helpers for Lessmark.

Lessmark is a strict, agent-readable document format for project context, agent instructions, decisions, tasks, constraints, examples, API notes, links, warnings, and file references.

```js
import { parseLessmark, validateSource, formatLessmark } from "lessmark";

const ast = parseLessmark("@summary\nTyped context for humans and agents.\n");
const errors = validateSource("@summary\nTyped context for humans and agents.\n");
const formatted = formatLessmark("@summary\nTyped context for humans and agents.\n");
```

See the repository README and `spec/lessmark-v0.md` for the v0 language spec.