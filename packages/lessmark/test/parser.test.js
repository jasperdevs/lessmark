import test from "node:test";
import assert from "node:assert/strict";
import { readdir, readFile } from "node:fs/promises";
import {
  LessmarkError,
  parseLessmark,
  formatLessmark,
  formatAst,
  fromMarkdown,
  renderHtml,
  toMarkdown,
  validateAst,
  validateSource
} from "../src/index.js";

const root = new URL("../../../", import.meta.url);

async function read(path) {
  return readFile(new URL(path, root), "utf8");
}

test("parses valid fixture into stable AST", async () => {
  const source = await read("fixtures/valid/project-context.mu");
  const expected = JSON.parse(await read("fixtures/valid/project-context.ast.json"));
  assert.deepEqual(parseLessmark(source), expected);
});

test("all valid fixtures have stable AST snapshots", async () => {
  const names = await readdir(new URL("fixtures/valid/", root));
  const fixtures = names.filter((name) => name.endsWith(".mu")).sort();

  for (const fixture of fixtures) {
    const source = await read(`fixtures/valid/${fixture}`);
    const expected = JSON.parse(await read(`fixtures/valid/${fixture.replace(/\.mu$/, ".ast.json")}`));
    assert.deepEqual(parseLessmark(source), expected, fixture);
  }
});

test("all invalid fixtures are rejected by the parser", async () => {
  const names = await readdir(new URL("fixtures/invalid/", root));
  const fixtures = names.filter((name) => name.endsWith(".mu")).sort();

  for (const fixture of fixtures) {
    const source = await read(`fixtures/invalid/${fixture}`);
    assert.throws(() => parseLessmark(source), LessmarkError, fixture);
  }
});

test("packaged schema stays in sync with repository schema", async () => {
  const rootSchema = JSON.parse(await read("schemas/ast-v0.schema.json"));
  for (const path of [
    "packages/lessmark/schemas/ast-v0.schema.json",
    "packages/python/src/lessmark/schemas/ast-v0.schema.json",
    "crates/lessmark/schemas/ast-v0.schema.json"
  ]) {
    assert.deepEqual(JSON.parse(await read(path)), rootSchema, path);
  }
});

test("schema href patterns match safe link rules", async () => {
  const rootSchema = JSON.parse(await read("schemas/ast-v0.schema.json"));
  for (const block of [rootSchema.$defs.navBlock, rootSchema.$defs.linkBlock]) {
    const pattern = block.properties.attrs.properties.href.allOf.find((rule) => typeof rule.pattern === "string").pattern;
    const href = new RegExp(pattern);
    assert.equal(href.test("index.html"), true);
    assert.equal(href.test("https://example.com"), true);
    assert.equal(href.test("mailto:team@example.com"), true);
    assert.equal(href.test("javascript:alert(1)"), false);
    assert.equal(href.test("/abs.html"), false);
    assert.equal(href.test("../up.html"), false);
    assert.equal(href.test("docs/../up.html"), false);
    assert.equal(href.test("//example.com"), false);
  }
});

test("formatter is deterministic and idempotent", async () => {
  const source = await read("fixtures/valid/project-context.mu");
  const once = formatLessmark(source);
  const twice = formatLessmark(once);
  assert.equal(once, twice);
});

test("preserves indented example text", async () => {
  const source = await read("fixtures/valid/example-code.mu");
  const expected = JSON.parse(await read("fixtures/valid/example-code.ast.json"));
  assert.deepEqual(parseLessmark(source), expected);
  assert.equal(formatLessmark(source), source);
});

test("canonicalizes documented human authoring conveniences", () => {
  const source = `# Project Context

@p
Use **bold**, *emphasis*, \`code\`, \`**literal**\`, [Docs](https://example.com), [Decision](#storage-backend), [^note], ==marked==, and ~~gone~~.

@ul
- One
- Two

@ol
- First
- Second

@decision storage-backend
Use SQLite.

@task todo
Add docs.

@risk high
Migration risk.

@file src/app.ts
Owns app.

@api parseLessmark
Parser API.

@code ts
const ok = true;

@math tex
E = mc^2

@diagram mermaid
graph TD
  A --> B

@callout warning
Watch this.

@definition API
Application programming interface.

@table Name|Value
Stage|alpha

@separator

@metadata project.stage
alpha

@link https://example.com
Homepage.

@footnote note
Footnote body.
`;
  const formatted = formatLessmark(source);
  assert.match(formatted, /@paragraph\nUse \{\{strong:bold\}\}, \{\{em:emphasis\}\}, \{\{code:code\}\}, \{\{code:\*\*literal\*\*\}\}, \{\{link:Docs\|https:\/\/example\.com\}\}, \{\{ref:Decision\|storage-backend\}\}, \{\{footnote:note\}\}, \{\{mark:marked\}\}, and \{\{del:gone\}\}\./);
  assert.match(formatted, /@list kind="unordered"\n- One\n- Two/);
  assert.match(formatted, /@list kind="ordered"\n- First\n- Second/);
  assert.match(formatted, /@decision id="storage-backend"/);
  assert.match(formatted, /@task status="todo"/);
  assert.match(formatted, /@risk level="high"/);
  assert.match(formatted, /@file path="src\/app\.ts"/);
  assert.match(formatted, /@api name="parseLessmark"/);
  assert.match(formatted, /@code lang="ts"\nconst ok = true;/);
  assert.match(formatted, /@math notation="tex"\nE = mc\^2/);
  assert.match(formatted, /@diagram kind="mermaid"\ngraph TD\n  A --> B/);
  assert.match(formatted, /@callout kind="warning"\nWatch this\./);
  assert.match(formatted, /@definition term="API"\nApplication programming interface\./);
  assert.match(formatted, /@table columns="Name\|Value"\nStage\|alpha/);
  assert.match(formatted, /@separator/);
  assert.match(formatted, /@metadata key="project\.stage"/);
  assert.match(formatted, /@link href="https:\/\/example\.com"/);
  assert.match(formatted, /@footnote id="note"/);
  assert.equal(validateSource(formatted).length, 0);
  assert.match(renderHtml(source), /<strong>bold<\/strong>/);
});

test("ignores leading blank lines inside body-capable blocks", () => {
  const source = `@task done

hey

@metadata rfc.id

RFC-0042
`;
  assert.equal(formatLessmark(source), '@task status="done"\nhey\n\n@metadata key="rfc.id"\nRFC-0042\n');
});

test("rejects unsafe shorthand links and ambiguous shortcut emphasis", () => {
  assert.throws(() => formatLessmark("@paragraph\n[Bad](javascript:alert(1))\n"), /executable URL/);
  assert.throws(() => formatLessmark("@paragraph\n**bold *em***\n"), /shortcut emphasis/);
  assert.throws(() => formatLessmark("@paragraph\n*em **bold***\n"), /shortcut emphasis/);
});

test("rejects legacy Markdown block syntax inside Lessmark prose", () => {
  for (const source of [
    "@paragraph\n[docs]: https://example.com\n",
    "@paragraph\n---\n",
    "@paragraph\n===\n",
    "@paragraph\n-*- \n",
    "@paragraph\n> quoted text\n"
  ]) {
    const errors = validateSource(source);
    assert.equal(errors[0].code, "markdown_legacy_syntax");
    assert.throws(() => parseLessmark(source), /Markdown/);
  }
});

test("supports strict nested lists", () => {
  const source = `@list kind="unordered"
- Parent
  - Child
- Sibling
`;
  assert.equal(validateSource(source).length, 0);
  assert.match(renderHtml(source), /<ul><li>Parent<ul><li>Child<\/li><\/ul><\/li><li>Sibling<\/li><\/ul>/);
  assert.match(toMarkdown('@list kind="ordered"\n- Parent\n  - Child\n- Sibling\n'), /1\. Parent\n  1\. Child\n2\. Sibling/);
});

test("supports escaped pipes in table columns", () => {
  const source = '@table columns="Name\\|Alias|Status"\nLessmark\\|mu|done\n';
  assert.equal(validateSource(source).length, 0);
  assert.match(toMarkdown(source), /\| Name\\\|Alias \| Status \|/);
  assert.match(renderHtml(source), /<th>Name\|Alias<\/th>/);
});

test("loose text error explains new blocks", () => {
  assert.throws(() => parseLessmark("@p\nyo\n\nnah\n"), /start a new block such as @p/);
});

test("rejects empty headings", async () => {
  const source = await read("fixtures/invalid/empty-heading.mu");
  assert.throws(() => parseLessmark(source), /Invalid heading syntax/);
});

test("rejects loose text outside typed blocks", async () => {
  const source = await read("fixtures/invalid/loose-text.mu");
  assert.throws(() => parseLessmark(source), /start a new block such as @p/);
});

test("rejects raw HTML-like text during parsing", async () => {
  const source = await read("fixtures/invalid/raw-html.mu");
  assert.throws(() => parseLessmark(source), /raw HTML/);
});

test("rejects attributes not defined by the block type", async () => {
  const source = await read("fixtures/invalid/unknown-attribute.mu");
  assert.throws(() => parseLessmark(source), /does not allow attribute/);
});

test("rejects task statuses outside the fixed set", async () => {
  const source = await read("fixtures/invalid/bad-task-status.mu");
  assert.throws(() => parseLessmark(source), /@task status must be one of/);
});

test("rejects unsafe file paths, API names, and links", async () => {
  await assert.rejects(async () => parseLessmark(await read("fixtures/invalid/bad-file-path.mu")), /relative project path/);
  await assert.rejects(async () => parseLessmark(await read("fixtures/invalid/bad-api-name.mu")), /identifier/);
  await assert.rejects(async () => parseLessmark(await read("fixtures/invalid/bad-link-href.mu")), /safe relative path/);
  assert.equal(validateSource('@link href="docs/page.html"\nInternal docs page.\n').length, 0);
  assert.throws(() => parseLessmark('@link href="//example.com"\nAmbiguous host.\n'), /safe relative path/);
  assert.throws(() => parseLessmark('@link href="../page.html"\nParent traversal.\n'), /safe relative path/);
});

test("rejects invalid agent-context attrs", async () => {
  await assert.rejects(async () => parseLessmark(await read("fixtures/invalid/bad-code-lang.mu")), /compact language identifier/);
  await assert.rejects(async () => parseLessmark(await read("fixtures/invalid/bad-metadata-key.mu")), /lowercase dotted key/);
  await assert.rejects(async () => parseLessmark(await read("fixtures/invalid/bad-risk-level.mu")), /risk level/);
  await assert.rejects(async () => parseLessmark(await read("fixtures/invalid/bad-depends-on-target.mu")), /lowercase slug/);
});

test("rejects invalid docs attrs", () => {
  assert.throws(() => parseLessmark('@table columns="Name|"\nValue\n'), /pipe-separated non-empty labels/);
  assert.throws(() => parseLessmark('@callout kind="custom"\nNo custom callouts.\n'), /@callout kind/);
  assert.throws(() => parseLessmark('@page output="../index.html"\n'), /safe relative .html path/);
  assert.throws(() => parseLessmark('@image src="javascript:alert(1)" alt="Bad"\n'), /safe relative, http, or https URL/);
  assert.throws(() => parseLessmark('@nav label="Docs" href="javascript:alert(1)"\n'), /safe relative path/);
  assert.throws(() => parseLessmark('@nav label="Docs" href="index.html" slot="sidebar"\n'), /primary or footer/);
  assert.throws(() => parseLessmark('@nav label="Docs" href="index.html" slot=""\n'), /primary or footer/);
  assert.throws(() => parseLessmark('@nav label="Docs" href="index.html"\nBody.\n'), /must not have a body/);
  assert.throws(() => parseLessmark('@page output="index.html"\nBody.\n'), /must not have a body/);
  assert.throws(() => parseLessmark("@toc\nBody.\n"), /must not have a body/);
  assert.throws(() => parseLessmark('@image src="assets/diagram.svg" alt="Diagram"\nBody.\n'), /must not have a body/);
  assert.throws(() => parseLessmark('@math notation="mathml"\nE = mc^2\n'), /tex, asciimath/);
  assert.throws(() => parseLessmark('@diagram kind="unknown"\ngraph TD\n'), /mermaid, graphviz, plantuml/);
  assert.throws(() => parseLessmark("@separator\nBody.\n"), /must not have a body/);
  assert.throws(() => parseLessmark('@separator style="thin"\n'), /does not allow attribute/);
  assert.throws(() => parseLessmark('@reference target="../secret"\nBad target.\n'), /lowercase slug/);
  assert.throws(() => parseLessmark('@reference target="missing-section"\nBad target.\n'), /Unknown local reference target/);
  assert.throws(() => parseLessmark('@definition term="Term<T>"\nBad term.\n'), /raw HTML/);
});

test("can include source positions without changing the default AST", async () => {
  const source = await read("fixtures/valid/project-context.mu");
  const plain = parseLessmark(source);
  const positioned = parseLessmark(source, { sourcePositions: true });
  assert.equal(Object.hasOwn(plain.children[0], "position"), false);
  assert.deepEqual(positioned.children[0].position, {
    start: { line: 1, column: 1 },
    end: { line: 1, column: 18 }
  });
  assert.equal(validateAst(positioned).length, 0);
});

test("validateSource reports parse errors as data", async () => {
  const source = await read("fixtures/invalid/raw-html.mu");
  assert.deepEqual(validateSource(source), [
    { code: "raw_html", message: "@summary contains raw HTML/JSX-like syntax", line: 2, column: 1 }
  ]);
});

test("validates required attrs on direct AST input", () => {
  const errors = validateAst({
    type: "document",
    children: [{ type: "block", name: "file", attrs: {}, text: "Owns capture state." }]
  });
  assert.equal(errors.length, 1);
  assert.equal(errors[0].message, "@file requires path");
});

test("validates fixed attrs on direct AST input", () => {
  const errors = validateAst({
    type: "document",
    children: [{ type: "block", name: "summary", attrs: { mood: "casual" }, text: "No custom attrs." }]
  });
  assert.equal(errors.length, 1);
  assert.equal(errors[0].message, '@summary does not allow attribute "mood"');
});

test("validates semantic attrs on direct AST input", () => {
  const errors = validateAst({
    type: "document",
    children: [
      { type: "block", name: "file", attrs: { path: "/tmp/secret.txt" }, text: "Bad file path." },
      { type: "block", name: "api", attrs: { name: "123 invalid" }, text: "Bad API name." },
      { type: "block", name: "link", attrs: { href: "javascript:alert(1)" }, text: "Bad link." }
    ]
  });
  assert.deepEqual(errors, [
    { code: "validation_error", message: "@file path must be a relative project path" },
    { code: "validation_error", message: "@api name must be an identifier" },
    { code: "unsafe_link_or_path", message: "@link href must be http, https, mailto, or a safe relative path" }
  ]);
});

test("rejects duplicate local anchor slugs on direct AST input", () => {
  const errors = validateAst({
    type: "document",
    children: [
      { type: "heading", level: 1, text: "Build System" },
      { type: "block", name: "decision", attrs: { id: "build-system" }, text: "Collision." }
    ]
  });
  assert.deepEqual(errors, [{ code: "duplicate_local_anchor", message: 'Duplicate local anchor slug "build-system"' }]);

  const renderedFootnoteErrors = validateAst({
    type: "document",
    children: [
      { type: "heading", level: 1, text: "Fn Build System" },
      { type: "block", name: "footnote", attrs: { id: "build-system" }, text: "Collision." }
    ]
  });
  assert.deepEqual(renderedFootnoteErrors, [{ code: "duplicate_local_anchor", message: 'Duplicate local anchor slug "fn-build-system"' }]);
});

test("rejects unknown local reference targets on direct AST input", () => {
  const errors = validateAst({
    type: "document",
    children: [
      { type: "heading", level: 1, text: "Build System" },
      { type: "block", name: "reference", attrs: { target: "missing-section" }, text: "Bad target." }
    ]
  });
  assert.deepEqual(errors, [{ code: "unknown_reference_target", message: 'Unknown local reference target "missing-section"' }]);
});

test("validates non-string attrs without treating present values as missing", () => {
  const errors = validateAst({
    type: "document",
    children: [
      { type: "block", name: "summary", attrs: { mood: 1 }, text: "Bad custom attr." },
      { type: "block", name: "task", attrs: { status: 1 }, text: "Bad status type." }
    ]
  });
  assert.deepEqual(errors, [
    { code: "invalid_ast_value", message: 'Attribute "mood" must be a string' },
    { code: "unknown_attribute", message: '@summary does not allow attribute "mood"' },
    { code: "invalid_ast_value", message: 'Attribute "status" must be a string' }
  ]);
});

test("validates exact AST shape", () => {
  const errors = validateAst({
    type: "document",
    children: [{ type: "heading", level: 7, text: "", extra: true }],
    extra: true
  });
  assert.deepEqual(errors, [
    { code: "invalid_ast_shape", message: 'document has unknown property "extra"' },
    { code: "invalid_ast_shape", message: 'heading has unknown property "extra"' },
    { code: "validation_error", message: "heading level must be an integer from 1 to 6" },
    { code: "validation_error", message: "heading text must be a non-empty string" }
  ]);
});

test("refuses to format invalid AST", () => {
  assert.throws(
    () => formatAst({ type: "document", children: [{ type: "heading", level: 7, text: "Too deep" }] }),
    /Cannot format invalid AST/
  );
});

test("imports a safe Markdown subset into Lessmark", () => {
  const source = `# Project

Short project summary.

- [ ] Add export settings.
- [x] Ship parser.

\`\`\`js
console.log("ok");
\`\`\`

[Homepage](https://example.com)
`;
  const lessmark = fromMarkdown(source);
  assert.match(lessmark, /^# Project/);
  assert.match(lessmark, /@summary\nShort project summary\./);
  assert.match(lessmark, /@task status="todo"\nAdd export settings\./);
  assert.match(lessmark, /@task status="done"\nShip parser\./);
  assert.match(lessmark, /@code lang="js"\nconsole\.log/);
  assert.match(lessmark, /@link href="https:\/\/example\.com"\nHomepage/);
  assert.equal(validateSource(lessmark).length, 0);
});

test("imports Markdown code fences with internal blank lines", () => {
  const lessmark = fromMarkdown(`# Project

\`\`\`js
const a = 1;

const b = 2;
\`\`\`
`);
  assert.equal(validateSource(lessmark).length, 0);
  const ast = parseLessmark(lessmark);
  assert.equal(ast.children[1].text, "const a = 1;\n\nconst b = 2;");
});

test("imports common GFM blocks into typed Lessmark blocks", () => {
  const lessmark = fromMarkdown(`# Project

![Build pipeline](assets/diagram.svg "Pipeline")

> [!WARNING] Migration
> Check imported content.

> Keep source safe.
> Preserve the quote.

| Feature | Status |
| --- | --- |
| Images | done |
| Tables \\| escaped | done |

---
`);
  assert.match(lessmark, /@image alt="Build pipeline" caption="Pipeline" src="assets\/diagram.svg"/);
  assert.match(lessmark, /@callout kind="warning" title="Migration"\nCheck imported content\./);
  assert.match(lessmark, /@quote\nKeep source safe\.\nPreserve the quote\./);
  assert.match(lessmark, /@table columns="Feature\|Status"\nImages\|done\nTables \\\\?\| escaped\|done/);
  assert.match(lessmark, /@separator/);
  assert.equal(validateSource(lessmark).length, 0);
});

test("imports and exports math and diagram blocks", () => {
  const lessmark = fromMarkdown(`$$
E = mc^2
$$

\`\`\`mermaid
graph TD
  A --> B
\`\`\`
`);
  assert.match(lessmark, /@math notation="tex"\nE = mc\^2/);
  assert.match(lessmark, /@diagram kind="mermaid"\ngraph TD\n  A --> B/);
  assert.equal(validateSource(lessmark).length, 0);
  assert.match(toMarkdown('@math notation="tex"\nE = mc^2\n'), /^\$\$\nE = mc\^2\n\$\$\n$/);
  assert.match(toMarkdown('@diagram kind="mermaid"\ngraph TD\n  A --> B\n'), /^```mermaid\ngraph TD\n  A --> B\n```\n$/);
  assert.match(renderHtml('@math notation="tex"\nE = mc^2\n'), /class="lessmark-math"/);
  assert.match(renderHtml('@diagram kind="mermaid"\ngraph TD\n'), /class="lessmark-diagram"/);
});

test("keeps math and diagram bodies literal", () => {
  assert.equal(formatLessmark('@math notation="tex"\n**not bold**\n'), '@math notation="tex"\n**not bold**\n');
  assert.equal(formatLessmark('@diagram kind="mermaid"\nA[**literal**] --> B\n'), '@diagram kind="mermaid"\nA[**literal**] --> B\n');
});

test("imports normal Markdown lists into typed Lessmark lists", () => {
  const unordered = fromMarkdown(`- Parent
  - Child
- Sibling
`);
  assert.match(unordered, /@list kind="unordered"\n- Parent\n  - Child\n- Sibling/);

  const ordered = fromMarkdown(`1. First
   1. Child
2. Second
`);
  assert.match(ordered, /@list kind="ordered"\n- First\n  - Child\n- Second/);
  assert.throws(() => fromMarkdown("- One\n* Two\n"), /Mixed Markdown list markers/);
  assert.throws(() => fromMarkdown("1. One\n2) Two\n"), /Mixed Markdown list markers/);
});

test("imports safe relative standalone Markdown links", () => {
  assert.equal(fromMarkdown("[Guide](docs/guide.html)\n"), '@link href="docs/guide.html"\nGuide\n');
});

test("rejects unclosed Markdown code fences", () => {
  assert.throws(() => fromMarkdown("```js\nconst a = 1;\n"), /Unclosed fenced code block/);
});

test("exports Lessmark to Markdown", () => {
  const source = `# Project

@summary
Typed context.

@task status="done"
Ship parser.

@link href="https://example.com"
Homepage

@separator
`;
  const markdown = toMarkdown(source);
  assert.match(markdown, /^# Project/);
  assert.match(markdown, /Typed context\./);
  assert.match(markdown, /- \[x\] Ship parser\./);
  assert.match(markdown, /\[Homepage\]\(https:\/\/example\.com\)/);
  assert.match(markdown, /^---$/m);
});

test("exports docs blocks to Markdown without losing structure", async () => {
  const markdown = toMarkdown(await read("fixtures/valid/docs-page.mu"));
  assert.match(markdown, /# Docs Home/);
  assert.match(markdown, /\*\*explicit\*\*/);
  assert.match(markdown, /==marked text==/);
  assert.match(markdown, /\[\^strict-syntax\]: Lessmark keeps one explicit spelling/);
  assert.match(markdown, /### renderer-contract/);
  assert.match(markdown, /\*\*Build system\*\*/);
  assert.match(markdown, /\[Build system section\]\(#build-system\)/);
  assert.match(markdown, /\[Renderer contract decision\]\(#renderer-contract\)/);
  assert.match(markdown, /\[Strict syntax footnote\]\(#fn-strict-syntax\)/);
  assert.match(markdown, /- \[Home\]\(index\.html\)/);
  assert.match(markdown, /- \[API\]\(api\.html\)/);
  assert.match(markdown, /> \[!TIP\] No hooks by default/);
  assert.match(markdown, /- Parse strict source\./);
  assert.match(markdown, /\| Feature \| Status \|/);
  assert.match(markdown, /\| Typed blocks\\\|agents \| done \|/);
  assert.match(markdown, /!\[Build pipeline\]\(assets\/diagram.svg\)/);
  assert.match(toMarkdown("@separator\n"), /^---\n$/);
});

test("rejects unresolved inline local targets", () => {
  const refErrors = validateSource("@paragraph\n{{ref:Missing|missing-target}}\n");
  assert.equal(refErrors[0].code, "unknown_inline_target");
  assert.match(refErrors[0].message, /missing-target/);

  const footnoteErrors = validateSource("@paragraph\n{{footnote:missing-note}}\n");
  assert.equal(footnoteErrors[0].code, "unknown_inline_target");
  assert.match(footnoteErrors[0].message, /missing-note/);

  assert.doesNotThrow(() =>
    parseLessmark("@decision id=\"known-target\"\nDone.\n\n@paragraph\n{{ref:Known|known-target}}\n\n@footnote id=\"known-note\"\nA note.\n\n@paragraph\n{{footnote:known-note}}\n")
  );
});

test("renders strict docs blocks to safe HTML", async () => {
  const source = await read("fixtures/valid/docs-page.mu");
  const html = renderHtml(source, { document: true });
  assert.match(html, /<title>Docs Home<\/title>/);
  assert.match(html, /<nav class="lessmark-nav" aria-label="Primary"><a href="index.html">Home<\/a><a href="spec.html">Spec<\/a><\/nav>/);
  assert.match(html, /<nav class="lessmark-nav" aria-label="Footer"><a href="api.html">API<\/a><\/nav>/);
  assert.match(html, /<strong>explicit<\/strong>/);
  assert.match(html, /<mark>marked text<\/mark>/);
  assert.match(html, /<del>deleted text<\/del>/);
  assert.match(html, /<a href="#build-system">local references<\/a>/);
  assert.match(html, /<section class="lessmark-decision" id="renderer-contract" data-id="renderer-contract">/);
  assert.match(html, /<a href="#renderer-contract">Renderer contract decision<\/a>/);
  assert.match(html, /<a href="#fn-strict-syntax">Strict syntax footnote<\/a>/);
  assert.match(html, /id="fn-strict-syntax"/);
  assert.match(html, /<dl class="lessmark-definition">/);
  assert.match(html, /<img src="assets\/diagram.svg" alt="Build pipeline">/);
  assert.match(html, /<table>/);
  assert.match(html, /<td>Typed blocks\|agents<\/td>/);
  assert.doesNotMatch(html, /<script/);
  assert.match(renderHtml("@separator\n"), /<hr class="lessmark-separator">/);
});

test("renders code blocks with safe lightweight highlighting", () => {
  const html = renderHtml('@code lang="ts"\nconst ok = "yes";\n// safe\n', { document: true });
  assert.match(html, /<span class="tok-key">const<\/span>/);
  assert.match(html, /<span class="tok-string">&quot;yes&quot;<\/span>/);
  assert.match(html, /<span class="tok-comment">\/\/ safe<\/span>/);
});

test("renders and exports nested explicit inline functions", async () => {
  const source = await read("fixtures/valid/nested-inline.mu");
  const html = renderHtml(source, { document: true });
  const markdown = toMarkdown(source);
  assert.match(html, /<strong>Bold <em>inside<\/em><\/strong>/);
  assert.match(html, /<a href="https:\/\/example.com">docs<\/a>/);
  assert.match(markdown, /\*\*Bold \*inside\*\*\*/);
  assert.match(markdown, /\[docs\]\(https:\/\/example.com\)/);
  assert.match(markdown, /\[\*\*Renderer\*\* decision\]\(#renderer\)/);
});

test("renderer emits deterministic unique heading ids", () => {
  const html = renderHtml("# Intro\n\n# Intro\n", { document: true });
  assert.match(html, /<h1 id="intro">Intro<\/h1>/);
  assert.match(html, /<h1 id="intro-2">Intro<\/h1>/);
});

test("rejects invalid inline local targets during render and export", () => {
  assert.throws(() => renderHtml("@paragraph\n{{ref:Build|Build System}}\n"), /lowercase slug/);
  assert.throws(() => renderHtml("@paragraph\n{{ref:Build| build-system}}\n"), /Unknown inline local target/);
  assert.throws(() => renderHtml("@paragraph\n{{footnote:}}\n"), /lowercase slug/);
  assert.throws(() => toMarkdown("@paragraph\n{{ref:Build|Build System}}\n"), /lowercase slug/);
  assert.throws(() => toMarkdown("@paragraph\n{{footnote: strict-syntax}}\n"), /Unknown inline local target/);
  assert.throws(() => toMarkdown("# {{ref:Build|Build System}}\n"), /lowercase slug/);
  assert.throws(() => toMarkdown('@callout kind="note" title="{{footnote: strict-syntax}}"\nBody.\n'), /Unknown inline local target/);
});

test("renderer rejects unclosed inline functions", () => {
  assert.throws(() => renderHtml("@paragraph\n{{strong:open\n"), /Unclosed inline function/);
});

test("renderer rejects unknown inline functions", () => {
  assert.throws(() => renderHtml("@paragraph\n{{frobnicate:value}}\n"), /Unknown inline function/);
});

test("exports literal code and example inline syntax without validating it", () => {
  assert.match(toMarkdown("@code\n{{ref:Build|Build System}}\n"), /\{\{ref:Build\|Build System\}\}/);
  assert.match(toMarkdown("@example\n{{footnote: bad id}}\n"), /\{\{footnote: bad id\}\}/);
});

test("renderer rejects malformed docs functions and tables", () => {
  assert.throws(() => renderHtml("@paragraph\n{{unknown:value}}\n"), /Unknown inline function/);
  assert.throws(() => parseLessmark('@table columns="A|B"\nOnly one cell\n'), /row cell count/);
  assert.throws(() => parseLessmark('@list kind="unordered"\nNo marker\n'), /item marker/);
  assert.throws(() => parseLessmark('@list kind="unordered"\n- Parent\n    - Child\n'), /skip levels/);
});
