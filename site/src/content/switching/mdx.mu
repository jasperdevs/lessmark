# From MDX

@summary
MDX mixes Markdown with JSX. Lessmark documents are pure data: no imports,
no expressions, no React. The renderer is a function from tree to HTML,
not a tree of components.

## Replace JSX components with typed blocks

@paragraph
A custom MDX callout component becomes a built-in {{code:@callout}} block.
The {{code:kind}} attribute carries what was previously a prop.

@code lang="mdx"
import { Callout } from "@/components/Callout";

‹Callout type="warning"›
  Hotkey changes break old workflows.
‹/Callout›

@code lang="mu"
  @callout kind="warning"
  Hotkey changes break old workflows.

## Drop imports

@paragraph
Lessmark documents do not import. Every block name and every inline
function is fixed in the grammar, so two documents in different repos
parse to the same tree.

## Drop runtime expressions

@paragraph
There are no JSX expressions, no template substitution, no curly-brace
escapes into JavaScript. If you need a dynamic value, write the document
with the value already inserted, or compose at parse time.

## Match interactive components to typed blocks

@table columns="MDX pattern|Lessmark equivalent"
`‹Tabs /›`|consecutive `@code` blocks with `lang="..."` attributes
`‹CodeGroup /›`|consecutive `@code` blocks with `lang="..."` attributes
`‹Note /›`|`@note` block
`‹Warning /›`|`@warning` or `@callout kind="warning"`
`‹Callout type="info" /›`|`@callout kind="tip"`
custom React component|model the data with a typed block; the renderer wraps it

## Frontmatter

@paragraph
MDX usually relies on a YAML frontmatter block. Lessmark uses a typed
{{code:@metadata}} block at the top of the document with named keys.

@code lang="mdx"
---
title: Switching from MDX
date: 2026-04-28
---

@code lang="mu"
  @metadata title="Switching from MDX" date="2026-04-28"
