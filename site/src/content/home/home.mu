# The markdown alternative that agents (and humans) love.

## What is lessmark?

@paragraph
Lessmark is a strict alternative to Markdown. Every document is a sequence of
typed blocks. Every package parses the same source into the same JSON tree.

@callout kind="note"
Lessmark is open-source. The grammar, the parsers, and this site live on
{{link:GitHub|https://github.com/jasperdevs/lessmark}}.

## How is lessmark different?

@paragraph
Markdown is a presentation format. Lessmark is a structure format. A
{{code:@decision}} block is a decision, a {{code:@constraint}} block is a
constraint, and an LLM reading the file does not have to guess.

@paragraph
There is no raw HTML, no JSX, and no template engine. The parser stops at the
first violation, so a broken document never reaches a renderer.

## features

### Open source

@paragraph
MIT licensed packages for JavaScript, Python, and Rust. One grammar, one tree
shape, one CLI. Same parser output across every runtime.

### Built for agents and humans

@paragraph
Typed blocks like {{code:@decision}} and {{code:@task}} carry intent an
agent can act on. The source still reads cleanly to a human reviewer.

### Adopt anywhere

@paragraph
Drop a {{code:.mu}} file into any project, parse it with any package, and
get the same tree. Swap the runtime, keep the documents.

## Get started

@paragraph
Install one of the packages.

@code lang="sh"
npm install lessmark

@code lang="sh"
pip install lessmark

@paragraph
Save this as {{code:project.mu}}.

@code lang="mu"
  # Project context

  @summary
  Local Windows screenshot app.

  @decision id="storage-backend"
  Save captures as PNG plus a JSON sidecar.

  @constraint
  Do not upload a capture without an opt-in dialog.

  @task status="todo"
  Add export settings.

@paragraph
Parse it, validate it, ship the tree.

@code lang="sh"
lessmark parse project.mu
lessmark check project.mu
