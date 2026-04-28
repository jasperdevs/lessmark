# Lessmark Release Checklist

Use this before publishing npm, PyPI, crates.io, or a GitHub release.

1. Run `npm run check`.
2. Confirm `schemas/ast-v0.schema.json` matches packaged schema copies.
3. Confirm Rust, JavaScript, and Python versions match.
4. Run package dry-runs:
   - `npm pack --workspace lessmark --dry-run`
   - `python -m build packages/python`
   - `cargo package -p lessmark --allow-dirty --list`
5. Verify CLI parity:
   - `lessmark parse`
   - `lessmark check --json`
   - `lessmark format`
   - `lessmark from-markdown`
   - `lessmark to-markdown`
6. Update changelog/release notes.
7. Tag only after package dry-runs and CI pass.
