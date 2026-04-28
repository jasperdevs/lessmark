# Lessmark Release Checklist

@paragraph
Use this before publishing npm, PyPI, crates.io, or a GitHub release.

@list kind="ordered"
- Run npm run check.
- Confirm schemas/ast-v0.schema.json matches packaged schema copies.
- Confirm Rust, JavaScript, and Python versions match.
- Run npm pack --workspace lessmark --dry-run.
- Run python -m build packages/python.
- Run cargo package -p lessmark --allow-dirty --list.
- Verify CLI parity for parse, check --json, format, from-markdown, to-markdown, render --document, and build.
- Update changelog/release notes.
- Tag only after package dry-runs and CI pass.
