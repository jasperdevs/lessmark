# lessmark

Canonical Rust parser, validator, formatter, JSON AST model, and CLI for Lessmark.

This crate is the source of truth for language behavior. The JS and Python packages are distribution surfaces and must stay fixture-compatible with this crate.

The default AST stays compact. Use `parse_lessmark_with_positions` when a tool needs one-based source line and column ranges.
