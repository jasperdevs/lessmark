# CLI

@summary
The {{code:lessmark}} command ships in the npm and pip packages with the same
surface. The Rust crate exposes the same commands via {{code:cargo run -p lessmark}}.

## Commands

@code lang="sh"
lessmark parse file.mu
lessmark check file.mu
lessmark check --json file.mu
lessmark format file.mu
lessmark format --check file.mu
lessmark fix --write file.mu
lessmark from-markdown README.md
lessmark to-markdown file.mu
lessmark render --document docs/index.mu
lessmark build --strict docs public
lessmark info --json

## What each does

@list kind="unordered"
- parse prints the JSON tree.
- check validates source. With --json it returns stable error codes.
- format prints canonical lessmark to stdout.
- format --check returns a failure when the file is not canonical.
- fix --write rewrites the file in place when format diverges.
- from-markdown converts safe common markdown shapes into typed lessmark blocks.
- to-markdown converts lessmark into safe markdown.
- render --document produces a complete HTML document.
- build --strict walks a directory and writes a static site.
- info --json reports the supported blocks, inline functions, and CLI features.

## Exit codes

@table columns="Code|Meaning"
0|Success
1|Validation or parse error
2|I/O error
