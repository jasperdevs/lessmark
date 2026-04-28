# Getting started

@summary
Install lessmark, write a first document, parse it, and run a check.
You will be productive in five minutes.

## Install

@code lang="sh"
npm install lessmark

@code lang="sh"
pip install lessmark

## Write your first document

@paragraph
Lessmark documents are made of typed blocks. Every block starts with an
at-sign on its own line. Save this as notes.mu:

@code lang="mu"
  # Project context

  @summary
  A small CLI for tracking time across projects.

  @decision id="storage-backend"
  Store entries in a single SQLite file, not per-project.

  @constraint
  Do not block the UI while syncing.

## Parse it

@code lang="sh"
lessmark parse notes.mu

@paragraph
You get a stable JSON tree describing every block. The same call works
in JavaScript, Python, and Rust and returns the same output.

## Validate it

@callout kind="tip" title="Use check before committing"
The check command catches missing required attributes, unknown block
names, broken cross-references, and unsafe URLs. Add it to your
pre-commit hook.

@code lang="sh"
lessmark check notes.mu

## Where to go next

@list kind="unordered"
- Read the syntax reference for headings, blocks, and inline functions.
- Read the block reference for every block in the language.
- Browse examples to see real documents (resumes, RFCs, postmortems).
- Open the playground to edit live in the browser.
