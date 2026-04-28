# Lessmark Conformance

@paragraph
Conformance means an implementation matches the v0 source rules, AST shape, validation behavior, Markdown interop surface, and shared language/profile contracts.

## Current Conformance Command

@code lang="sh"
npm run test:conformance

@paragraph
The full repository gate is:

@code lang="sh"
npm run check

## Required Checks

@list kind="unordered"
- JavaScript, Python, and Rust parse every valid fixture to the same AST.
- JavaScript, Python, and Rust reject every invalid fixture with the same validation error array.
- Format output is identical across runtimes.
- Documented authoring conveniences parse and format to the same canonical output across runtimes.
- Markdown import and Markdown export parity are checked across runtimes.
- Generated valid sources cover deterministic combinations of tasks, risks, decisions, references, tables, escaped pipes, and deep nested inline functions.
- BOM and CRLF normalization are checked across runtimes.
- Packaged AST schema copies match the root schema.
- Packaged language contract copies match the root language contract.
- Packaged profile contract copies match the root profile contract.
- docs files are Lessmark .mu files and parse successfully.

## Public Status

@paragraph
The ci workflow runs npm run check on push and pull request. README.md exposes the ci badge and the v0 conformance badge so users can see whether the current branch is passing.

## What Conformance Does Not Claim

@list kind="unordered"
- It does not claim GitHub renders .mu files.
- It does not claim arbitrary Markdown import compatibility.
- It does not claim support for raw HTML, hooks, custom components, or private source flavors.
- It does not claim every Markdown shortcut is Lessmark syntax; only the documented convenience layer is accepted.
- It does not claim CommonMark-scale test coverage.
