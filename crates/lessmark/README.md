# lessmark

The markdown alternative that agents (and humans) love.

Canonical Rust parser, validator, formatter, JSON AST model, and CLI for the Lessmark language.

```sh
cargo add lessmark
```

Plain top-level prose is parsed as paragraph blocks. Escape leading `@` or `#` with a backslash when prose must start with a reserved sigil.

The default AST stays compact. Use `parse_lessmark_with_positions` when a tool needs one-based source line and column ranges.

```sh
lessmark parse file.lmk
lessmark parse --positions file.lmk
lessmark parse -
lessmark check file.lmk
lessmark check docs
lessmark check --json file.lmk
lessmark format file.lmk
lessmark format --check --json docs
lessmark fix --write docs
lessmark from-markdown README.md
lessmark from-markdown -
lessmark to-markdown file.lmk
lessmark to-markdown -
lessmark init docs
lessmark info --json
```

Use `-` for stdin. `check`, `format --check`, and `fix --write` also accept directories. `parse --positions` includes source ranges. `init` creates a starter `docs/index.lmk` without overwriting.
