# lessmark

The markdown alternative that agents (and humans) love.

Python parser, validator, formatter, Markdown converter, and CLI for the Lessmark language.

```py
from lessmark import parse_lessmark, validate_source, format_lessmark

ast = parse_lessmark("# Notes\n\nPlain prose becomes a paragraph.\n")
errors = validate_source("# Notes\n")
formatted = format_lessmark("Typed context.\n")
```

```sh
lessmark parse file.lmk
lessmark check file.lmk
lessmark format file.lmk
lessmark from-markdown README.md
lessmark to-markdown file.lmk
```
