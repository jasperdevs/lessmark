module.exports = grammar({
  name: "lessmark",

  extras: ($) => [/[ \t]/],

  rules: {
    document: ($) => repeat(choice(
      $.blank_line,
      $.heading,
      $.block,
      $.paragraph,
    )),

    heading: ($) => seq($.heading_marker, /[ \t]+/, $.line_text, optional("\n")),
    heading_marker: () => /#{1,6}/,

    block: ($) => seq(
      "@",
      $.block_name,
      repeat(seq(/[ \t]+/, $.attribute)),
      optional("\n"),
      repeat(choice($.indented_line, $.body_line, $.blank_line)),
    ),

    block_name: () => choice(
      "summary",
      "page",
      "nav",
      "skill",
      "decision",
      "constraint",
      "task",
      "file",
      "code",
      "example",
      "quote",
      "callout",
      "list",
      "table",
      "image",
      "math",
      "diagram",
      "separator",
      "toc",
      "footnote",
      "definition",
      "reference",
      "api",
      "link",
      "metadata",
      "risk",
      "depends-on",
    ),

    attribute: ($) => seq($.attribute_name, "=", $.attribute_value),
    attribute_name: () => /[a-z][a-z0-9_-]*/,
    attribute_value: () => /"([^"\\]|\\["\\|])*"/,

    paragraph: ($) => seq($.paragraph_line, repeat(seq("\n", $.paragraph_line)), optional("\n")),
    paragraph_line: () => /[^#@\n][^\n]*/,
    body_line: () => /[^#@\n][^\n]*/,
    indented_line: () => /[ \t]+[^\n]*/,
    line_text: () => /[^\n]+/,
    blank_line: () => /\n/,
  },
});
