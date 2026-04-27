# lessmark

Python parser, validator, formatter, and CLI for Lessmark.

Lessmark is a strict, agent-readable document format for project context. The Python package mirrors the v0 JavaScript package surface closely enough for Python tools to parse `.lmk` files into the same JSON AST shape.

```py
from lessmark import parse_lessmark

ast = parse_lessmark("@summary\nTyped context for humans and agents.\n")
```

```sh
lessmark parse file.lmk
lessmark check file.lmk
lessmark format file.lmk
```