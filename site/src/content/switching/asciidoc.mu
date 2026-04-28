# From AsciiDoc

@summary
Most AsciiDoc constructs map cleanly to lessmark. Block-level elements use
{{code:@name}} prefixes instead of square-bracket roles, and inline
formatting uses double-curly-brace functions.

## Headings

@paragraph
AsciiDoc {{code:=}} headings become {{code:#}} headings. Levels still go
one through six, and a blank line is required after every heading.

@code lang="asciidoc"
= Document title
== Section
=== Subsection

@code lang="mu"
  # Document title
  ## Section
  ### Subsection

## Inline formatting

@table columns="AsciiDoc|Lessmark"
*bold*|`{{strong:bold}}` or `**bold**`
_emphasis_|`{{em:emphasis}}` or `*emphasis*`
`monospace`|`{{code:monospace}}` or backticks
[mark]#highlighted#|`{{mark:highlighted}}` or `==highlighted==`
~strikethrough~|`{{del:strikethrough}}` or `~~strikethrough~~`
+++raw+++|not allowed; raw HTML and pass-through macros are rejected

## Lists

@paragraph
AsciiDoc nests with extra asterisks. Lessmark uses two-space indentation
and a single dash per item.

@code lang="asciidoc"
* one
* two
** nested

@code lang="mu"
  @list kind="unordered"
  - one
  - two
    - nested

## Admonitions

@paragraph
AsciiDoc admonitions ({{code:NOTE:}}, {{code:WARNING:}},
{{code:CAUTION:}}) become {{code:@note}}, {{code:@warning}}, or a
{{code:@callout}} with a {{code:kind}}.

@code lang="asciidoc"
NOTE: Generated files live in dist/.

WARNING: Hotkey changes break old workflows.

@code lang="mu"
  @note
  Generated files live in {{code:dist/}}.

  @warning
  Hotkey changes break old workflows.

## Source blocks

@paragraph
AsciiDoc source blocks delimit code with a fenced line. Lessmark uses
{{code:@code}} with an optional {{code:lang}} attribute.

@code lang="asciidoc"
[source,js]
----
console.log("hello");
----

@code lang="mu"
  @code lang="js"
  console.log("hello");

## Cross references

@paragraph
AsciiDoc {{code:‹‹section-id››}} cross references become inline
{{code:{{ref:#section-id}}}} functions. Targets must already exist in the
same document, either as a heading slug or a {{code:@decision}} id.

## Includes

@paragraph
AsciiDoc {{code:include::}} directives have no equivalent. Lessmark does
not include other files at parse time. Compose the final document
upstream and ship it as one source.
