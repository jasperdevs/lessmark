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

test("rejects empty headings", async () => {
  const source = await read("fixtures/invalid/empty-heading.mu");
  assert.throws(() => parseLessmark(source), /Invalid heading syntax/);
});

test("rejects loose text outside typed blocks", async () => {
  const source = await read("fixtures/invalid/loose-text.mu");
  assert.throws(() => parseLessmark(source), /Loose text is not allowed/);
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
    { message: "@summary contains raw HTML/JSX-like syntax", line: 2, column: 1 }
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
    { message: "@file path must be a relative project path" },
    { message: "@api name must be an identifier" },
    { message: "@link href must be http, https, mailto, or a safe relative path" }
  ]);
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
    { message: 'Attribute "mood" must be a string' },
    { message: '@summary does not allow attribute "mood"' },
    { message: 'Attribute "status" must be a string' }
  ]);
});

test("validates exact AST shape", () => {
  const errors = validateAst({
    type: "document",
    children: [{ type: "heading", level: 7, text: "", extra: true }],
    extra: true
  });
  assert.deepEqual(errors, [
    { message: 'document has unknown property "extra"' },
    { message: 'heading has unknown property "extra"' },
    { message: "heading level must be an integer from 1 to 6" },
    { message: "heading text must be a non-empty string" }
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
`;
  const markdown = toMarkdown(source);
  assert.match(markdown, /^# Project/);
  assert.match(markdown, /Typed context\./);
  assert.match(markdown, /- \[x\] Ship parser\./);
  assert.match(markdown, /\[Homepage\]\(https:\/\/example\.com\)/);
});

test("exports docs blocks to Markdown without losing structure", async () => {
  const markdown = toMarkdown(await read("fixtures/valid/docs-page.mu"));
  assert.match(markdown, /^# Docs/);
  assert.match(markdown, /\*\*explicit\*\*/);
  assert.match(markdown, /> \[!TIP\] No hooks by default/);
  assert.match(markdown, /- Parse strict source\./);
  assert.match(markdown, /\| Feature \| Status \|/);
  assert.match(markdown, /!\[Build pipeline\]\(assets\/diagram.svg\)/);
});

test("renders strict docs blocks to safe HTML", async () => {
  const source = await read("fixtures/valid/docs-page.mu");
  const html = renderHtml(source, { document: true });
  assert.match(html, /<title>Docs Home<\/title>/);
  assert.match(html, /<strong>explicit<\/strong>/);
  assert.match(html, /<a href="https:\/\/example.com">safe links<\/a>/);
  assert.match(html, /<img src="assets\/diagram.svg" alt="Build pipeline">/);
  assert.match(html, /<table>/);
  assert.doesNotMatch(html, /<script/);
});

test("renderer rejects malformed docs functions and tables", () => {
  assert.throws(() => renderHtml("@paragraph\n{{unknown:value}}\n"), /Unknown inline function/);
  assert.throws(() => renderHtml('@table columns="A|B"\nOnly one cell\n'), /row cell count/);
  assert.throws(() => renderHtml('@list kind="unordered"\nNo marker\n'), /item marker/);
});
