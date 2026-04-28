# Blocks

@summary
Lessmark ships with a fixed set of typed blocks. Each one has a clear job.
The list is small on purpose.

## Prose

@paragraph
The most common block. Holds free prose with full inline syntax support.

@code lang="mu"
  @paragraph
  Lessmark is a {{strong:strict}} markdown alternative built for tooling.

## Agent context

@paragraph
These blocks carry intent that an agent can act on without scraping prose.

@list kind="unordered"
- summary, the one-paragraph "what is this document".
- decision id, a binding choice with a stable slug for citation.
- constraint, a rule that must hold.
- task status, one of todo, doing, done, blocked.
- file path, ties prose to a path on disk.
- api name, ties prose to an exported symbol.
- metadata key, an arbitrary keyed value.
- risk level, one of low, medium, high, critical.
- depends-on target, links one block to another by id.

## Documentation surfaces

@list kind="unordered"
- quote cite, for blockquotes with attribution.
- callout kind, for boxed notes (note, tip, warning, caution).
- list kind, for flat lists with one item per line.
- table columns, for pipe-separated rows.
- image src and alt, for figures.
- code lang, for fenced code with a language tag.
- example, for verbatim sample blocks.
- note and warning, as quick aside surfaces.

## Cross references

@list kind="unordered"
- toc, renders a table of contents for the page's headings.
- definition term, for glossary entries.
- reference target, for explicit backlinks.
- footnote id, for citation-style notes.
- link href, for standalone link blocks.

## Page structure

@paragraph
Two blocks describe how the document fits into a larger site.

@list kind="unordered"
- page, document metadata such as title and output path.
- nav, navigation links a renderer can group into a slot.

@code lang="mu"
  @page title="Getting started" output="getting-started.html"

## Anchors

@paragraph
Every heading and every decision block gets a slug-style anchor. Inline
ref functions point at those anchors and validation rejects broken refs.
