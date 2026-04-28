# lessmark

The markdown alternative that agents (and humans) love.

Canonical Rust parser, validator, formatter, JSON AST model, and CLI for the Lessmark language.

Plain top-level prose is parsed as paragraph blocks. Explicit `@p` and `@paragraph` remain accepted aliases.

The default AST stays compact. Use `parse_lessmark_with_positions` when a tool needs one-based source line and column ranges.
