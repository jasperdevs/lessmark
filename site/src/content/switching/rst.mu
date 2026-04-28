# From reStructuredText

@summary
reStructuredText uses underline-style headings and indented directive
blocks. Lessmark uses ATX headings ({{code:#}}) and named typed blocks.

## Headings

@paragraph
RST underline-style headings become ATX-style {{code:#}} headings. There
is no separate document title syntax; the first {{code:#}} heading is the
title.

@code lang="rst"
Document title
==============

Section
-------

@code lang="mu"
  # Document title
  ## Section

## Inline formatting

@paragraph
Drop the underline-and-double-backtick conventions. Lessmark accepts the
Markdown shorthands and the typed form on equal footing.

@code lang="rst"
**bold** *emphasis* ``inline code``
`text ‹url›`_

@code lang="mu"
{{strong:bold}} {{em:emphasis}} {{code:inline code}}
{{link:text|url}}

## Directives

@paragraph
RST directives become typed blocks. The directive name maps to the block
name; directive options become block attributes.

@code lang="rst"
.. note:: Generated files live in dist/.

.. code-block:: js

   console.log("hello");

@code lang="mu"
  @note
  Generated files live in {{code:dist/}}.

  @code lang="js"
  console.log("hello");

## Lists

@paragraph
RST lists allow asterisks, hyphens, or plus signs. Lessmark uses one
form: a dash and a space, with two-space indentation per nesting level.

@code lang="rst"
* one
* two

  * nested

@code lang="mu"
  @list kind="unordered"
  - one
  - two
    - nested

## Cross references

@paragraph
RST {{code::ref:}} roles become explicit {{code:{{ref:#anchor}}}} inline
functions. Targets must already exist in the same document, either as a
heading slug or as a {{code:@decision}} id.

## Substitutions

@paragraph
RST substitutions and the {{code:|name|}} pipe syntax have no
equivalent. Lessmark documents do not interpolate. Bake values into the
document or compose upstream.

## Tables

@paragraph
RST grid tables become {{code:@table}} blocks with a single
{{code:columns}} attribute and pipe-delimited rows.

@code lang="rst"
+------+---------+
| Code | Meaning |
+======+=========+
| 0    | Success |
+------+---------+
| 1    | Error   |
+------+---------+

@code lang="mu"
  @table columns="Code|Meaning"
  0|Success
  1|Error
