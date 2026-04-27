import test from "node:test";
import assert from "node:assert/strict";
import { execFile } from "node:child_process";
import { fileURLToPath } from "node:url";
import { promisify } from "node:util";

const exec = promisify(execFile);
const cli = fileURLToPath(new URL("../bin/lessmark.js", import.meta.url));
const fixture = fileURLToPath(new URL("../../../fixtures/valid/project-context.lmk", import.meta.url));

test("CLI parse prints document AST", async () => {
  const { stdout } = await exec(process.execPath, [cli, "parse", fixture]);
  const ast = JSON.parse(stdout);
  assert.equal(ast.type, "document");
  assert.equal(ast.children[0].text, "Project Context");
});

test("CLI check accepts valid file", async () => {
  const { stdout } = await exec(process.execPath, [cli, "check", fixture]);
  assert.match(stdout, /ok/);
});

test("CLI format prints normalized source", async () => {
  const { stdout } = await exec(process.execPath, [cli, "format", fixture]);
  assert.match(stdout, /^# Project Context/);
  assert.match(stdout, /@task status="todo"/);
});
