# lessmark

Python parser, validator, formatter, and CLI for Lessmark.

Lessmark is a strict, agent-readable document format for project context. It rejects raw HTML/JSX, execution hooks, custom block syntax, and undefined attributes.

```py
from lessmark import parse_lessmark

ast = parse_lessmark("@summary\nTyped context for humans and agents.\n")
ast_with_positions = parse_lessmark("@summary\nTyped context.\n", source_positions=True)
```

```sh
lessmark parse file.mu
lessmark check file.mu
lessmark format file.mu
```
