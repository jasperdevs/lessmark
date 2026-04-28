# Hacks

@summary
Every authoring shortcut in lessmark. The parser canonicalizes shortcuts
on the way in, so agents always see the long form. You can type the
short form and run {{code:lessmark format}} to expand it on disk.

## Block aliases

@paragraph
Three block names have a shorter alias. Aliases never carry attributes;
add attributes by writing the full name.

@table columns="Short|Long|Notes"
`@p`|`@paragraph`|prose with full inline syntax
`@ul`|`@list kind="unordered"`|bulleted list
`@ol`|`@list kind="ordered"`|numbered list

@code lang="mu"
  @p
  Plain prose. Same rules as @paragraph.

  @ul
  - first
  - second

  @ol
  - first step
  - second step

## Shorthand attributes

@paragraph
Fifteen blocks accept a single bare value on the header line. The parser
rewrites it to the canonical attribute. The shorthand is the only
accepted second spelling for that exact meaning.

@table columns="Short|Long"
`@task todo`|`@task status="todo"`
`@decision storage-backend`|`@decision id="storage-backend"`
`@callout note`|`@callout kind="note"`
`@code js`|`@code lang="js"`
`@risk medium`|`@risk level="medium"`
`@file src/main.rs`|`@file path="src/main.rs"`
`@api captureWindow`|`@api name="captureWindow"`
`@math tex`|`@math notation="tex"`
`@diagram mermaid`|`@diagram kind="mermaid"`
`@reference storage-backend`|`@reference target="storage-backend"`
`@depends-on storage-backend`|`@depends-on target="storage-backend"`
`@footnote knuth-1974`|`@footnote id="knuth-1974"`
`@definition agent-context`|`@definition term="agent-context"`
`@link https://example.com`|`@link href="https://example.com"`
`@metadata project.stage`|`@metadata key="project.stage"`

@paragraph
Shorthand only fires when the value has no whitespace and no equals
sign. If you need spaces or a second attribute, write the full
{{code:attr="value"}} form.

## Inline shortcuts

@paragraph
Any prose body accepts these. The parser rewrites each into the
canonical {{code:{{name:value}}}} form.

@list kind="unordered"
- Backticks wrap inline code.
- Double asterisks wrap strong text.
- Single asterisks wrap emphasis.
- Double tildes wrap strikethrough.
- Double equals wrap highlights.
- Square brackets followed by parentheses make a link, like the markdown link syntax.
- A square-paren link with a `#anchor` target becomes an in-document reference.
- Square brackets with a caret prefix make a footnote pointer.

@code lang="mu"
  @p
  Press `Ctrl+S` to save. The **bold** survives diffs and so does the
  ==highlight==. Visit [our docs](https://example.com/docs). See
  [Storage](#storage-backend) for the rationale. This claim is
  well-established[^knuth-1974].

## Things that do not have shortcuts

@paragraph
Use the explicit inline function form for anything below.

@list kind="unordered"
- {{code:{{kbd:Ctrl+K}}}} for keyboard keys.
- Nested formatting like bold inside a link.
- Any inline function without a punctuation shortcut. Lessmark keeps the shortcut surface small on purpose.

## Format on save

@paragraph
{{code:lessmark format}} expands every shortcut to the canonical form
and rewrites the file in place. Run it from a pre-commit hook or your
editor's format-on-save and stop thinking about which form you typed.

@code lang="sh"
lessmark format notes.mu
lessmark fix --write notes.mu
