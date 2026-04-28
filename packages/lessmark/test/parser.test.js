import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { parseLessmark, formatLessmark, formatAst, validateAst, validateSource } from "../src/index.js";

const root = new URL("../../../", import.meta.url);

async function read(path) {
  return readFile(new URL(path, root), "utf8");
}

test("parses valid fixture into stable AST", async () => {
  const source = await read("fixtures/valid/project-context.lmk");
  const expected = JSON.parse(await read("fixtures/valid/project-context.ast.json"));
  assert.deepEqual(parseLessmark(source), expected);
});

test("formatter is deterministic and idempotent", async () => {
  const source = await read("fixtures/valid/project-context.lmk");
  const once = formatLessmark(source);
  const twice = formatLessmark(once);
  assert.equal(once, twice);
});

test("preserves indented example text", async () => {
  const source = await read("fixtures/valid/example-code.lmk");
  const expected = JSON.parse(await read("fixtures/valid/example-code.ast.json"));
  assert.deepEqual(parseLessmark(source), expected);
  assert.equal(formatLessmark(source), source);
});

test("rejects empty headings", async () => {
  const source = await read("fixtures/invalid/empty-heading.lmk");
  assert.throws(() => parseLessmark(source), /Invalid heading syntax/);
});

test("rejects loose text outside typed blocks", async () => {
  const source = await read("fixtures/invalid/loose-text.lmk");
  assert.throws(() => parseLessmark(source), /Loose text is not allowed/);
});

test("rejects raw HTML-like text during parsing", async () => {
  const source = await read("fixtures/invalid/raw-html.lmk");
  assert.throws(() => parseLessmark(source), /raw HTML/);
});

test("rejects attributes not defined by the block type", async () => {
  const source = await read("fixtures/invalid/unknown-attribute.lmk");
  assert.throws(() => parseLessmark(source), /does not allow attribute/);
});

test("rejects task statuses outside the fixed set", async () => {
  const source = await read("fixtures/invalid/bad-task-status.lmk");
  assert.throws(() => parseLessmark(source), /@task status must be one of/);
});

test("rejects unsafe file paths, API names, and links", async () => {
  await assert.rejects(async () => parseLessmark(await read("fixtures/invalid/bad-file-path.lmk")), /relative project path/);
  await assert.rejects(async () => parseLessmark(await read("fixtures/invalid/bad-api-name.lmk")), /identifier/);
  await assert.rejects(async () => parseLessmark(await read("fixtures/invalid/bad-link-href.lmk")), /executable URL scheme/);
});

test("validateSource reports parse errors as data", async () => {
  const source = await read("fixtures/invalid/raw-html.lmk");
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
    { message: "@link href must not use an executable URL scheme" }
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
