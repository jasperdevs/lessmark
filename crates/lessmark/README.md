# lessmark

The markdown alternative that agents (and humans) love.

Canonical Rust parser, validator, formatter, JSON AST model, and CLI for the Lessmark language.

```sh
cargo add lessmark
```

Plain top-level prose is parsed as paragraph blocks. Escape leading `@` or `#` with a backslash when prose must start with a reserved sigil.

The default AST stays compact. Use `parse_lessmark_with_positions` when a tool needs one-based source line and column ranges.
