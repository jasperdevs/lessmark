import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { parseLessmark, formatLessmark, validateAst } from "../src/index.js";

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
