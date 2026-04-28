# From Markdown

@summary
Lessmark is stricter than Markdown. The grammar is fixed, every block has a
name, and raw HTML is forbidden. Most Markdown idioms have a direct
lessmark equivalent.

## Paragraphs are typed

@paragraph
There is no implicit paragraph. Every prose block starts with
{{code:@paragraph}} (or the shorthand {{code:@p}}).

@code lang="md"
In Markdown, this paragraph just sits in the document.

@code lang="mu"
  @p
  In lessmark, prose is wrapped in @paragraph.

## Headings

@paragraph
Only ATX-style headings ({{code:#}} through {{code:######}}) are accepted.
Setext-style underlined headings are not. A blank line after every heading
is required.

## Emphasis and inline code

@paragraph
Both the Markdown forms and the typed forms parse identically. Whichever
you write, {{code:lessmark format}} canonicalizes to the typed form.

@code lang="md"
**bold**, *emphasis*, `inline code`

@code lang="mu"
{{strong:bold}}, {{em:emphasis}}, {{code:inline code}}

## Links

@code lang="md"
[Go to docs](https://example.com/docs "Optional title")

@code lang="mu"
{{link:Go to docs|https://example.com/docs}}

@paragraph
Lessmark does not support link titles. URLs must use a safe scheme (https,
http, mailto) or be an in-document anchor like {{code:#section-id}}.

## Lists

@paragraph
Use {{code:@list kind="unordered"}} or {{code:@list kind="ordered"}}. Items
go on separate lines starting with {{code:- }}. Nested items use exactly
two spaces per level.

@code lang="md"
- one
  - nested
- two

@code lang="mu"
  @list kind="unordered"
  - one
    - nested
  - two

## Block quotes

@code lang="md"
> This is a quote.

@code lang="mu"
  @quote cite="Donald Knuth"
  Premature optimization is the root of all evil.

## Code blocks

@paragraph
Lessmark has no indented code blocks. Use {{code:@code}} with an optional
{{code:lang}} attribute.

@code lang="md"
```js
console.log("hello");
```

@code lang="mu"
  @code lang="js"
  console.log("hello");

## Tables

@code lang="md"
| Code | Meaning |
| ---- | ------- |
| 0    | Success |
| 1    | Error   |

@code lang="mu"
  @table columns="Code|Meaning"
  0|Success
  1|Error

## Hard line breaks

@paragraph
Lessmark joins consecutive lines inside a block. There is no trailing-
whitespace or backslash hard break. Start a new block instead.

## Raw HTML

@paragraph
Not allowed. The parser rejects {{code:<}} as the first non-space character
of any block body, and inline HTML is a parse error.
