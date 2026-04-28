# lessmark

The markdown alternative that agents (and humans) love.

Python parser, validator, formatter, and CLI for the Lessmark language.

```py
from lessmark import parse_lessmark

ast = parse_lessmark("# Notes\n\nPlain prose becomes a paragraph.\n")
ast_with_positions = parse_lessmark("Typed context.\n", source_positions=True)
```

```sh
lessmark parse file.lmk
lessmark check file.lmk
lessmark format file.lmk
```
