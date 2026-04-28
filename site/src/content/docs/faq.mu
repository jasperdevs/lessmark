# FAQ

@summary
Common questions about why lessmark exists and where it fits.

## Why not just markdown?

@paragraph
Markdown has no fixed grammar. Two parsers can disagree on the same input,
and the meaning of a paragraph depends on flavor. Lessmark trades that
flexibility for a schema: every block has a name, every attribute has a
type, and every package produces the same tree.

## Why not MDX?

@paragraph
MDX mixes Markdown with JSX. That makes documents executable, tightly
coupled to a JavaScript runtime, and dependent on whichever components the
host project happens to import. Lessmark documents are pure data. They
never execute, never import, and never depend on the renderer.

## Why not AsciiDoc or RST?

@paragraph
AsciiDoc and reStructuredText already have schemas, but the schemas are
huge. Hundreds of directives, two distinct heading styles, a macro layer
on top. Lessmark fits in a single grammar file and a single page of docs.

## Where does it fit?

@list kind="unordered"
- Agent context files an LLM reads to understand a repo.
- API and developer documentation that needs to be machine-checked.
- Long-form prose where the audience is part-human, part-tooling.
- Specs, RFCs, and decision records that need stable anchors.

## Can I use it for blogs and articles?

@paragraph
Yes. The shorthand layer accepts the Markdown forms ({{code:**bold**}},
{{code:[link](url)}}, fenced {{code:```}} blocks) so writing prose is no
slower than writing Markdown. Run {{code:lessmark format}} to canonicalize.

## Does it have a renderer?

@paragraph
Every package ships {{code:renderHtml}}. Output is plain semantic HTML you
style with CSS. There is no React-component layer, no theme system, no
plugin chain.

## Will the language keep growing?

@callout kind="note"
The block list is fixed. New blocks are added rarely, only when the
language genuinely needs them, and every package picks up the change at
the same time. Fewer features, not more.
