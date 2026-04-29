# tree-sitter-lessmark

Starter Tree-sitter grammar metadata for Lessmark editor integrations.

The grammar recognizes `.lmk` and `.lessmark` files, headings, typed block headers, attributes, body lines, and plain paragraphs. It is intentionally small so editor integrations can build highlighting and navigation without inventing another dialect.

The canonical parser, formatter, validator, and AST live in the main JavaScript, Python, and Rust packages.
