import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { parseLessmark, formatLessmark, validateSource } from "../src/index.js";

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

test("validates raw HTML-like text", () => {
  const errors = validateSource("@summary\nDo not use <script>alert(1)</script> here.\n");
  assert.equal(errors.length, 1);
  assert.match(errors[0].message, /raw HTML/);
});

test("validates required file path", () => {
  const errors = validateSource("@file\nOwns capture state.\n");
  assert.equal(errors.length, 1);
  assert.equal(errors[0].message, "@file requires path");
});