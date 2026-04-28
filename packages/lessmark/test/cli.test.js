import test from "node:test";
import assert from "node:assert/strict";
import { execFile } from "node:child_process";
import { fileURLToPath } from "node:url";
import { promisify } from "node:util";

const exec = promisify(execFile);
const cli = fileURLToPath(new URL("../bin/lessmark.js", import.meta.url));
const fixture = fileURLToPath(new URL("../../../fixtures/valid/project-context.lmk", import.meta.url));
const markdownFixture = fileURLToPath(new URL("../../../fixtures/valid/markdown-import.md", import.meta.url));
const invalidFixture = fileURLToPath(new URL("../../../fixtures/invalid/raw-html.lmk", import.meta.url));

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

test("CLI check --json prints agent-readable errors", async () => {
  await assert.rejects(
    exec(process.execPath, [cli, "check", "--json", invalidFixture]),
    (error) => {
      const result = JSON.parse(error.stdout);
      assert.equal(result.ok, false);
      assert.match(result.errors[0].message, /raw HTML/);
      assert.equal(result.errors[0].line, 2);
      assert.equal(result.errors[0].column, 1);
      return true;
    }
  );
});

test("CLI format prints normalized source", async () => {
  const { stdout } = await exec(process.execPath, [cli, "format", fixture]);
  assert.match(stdout, /^# Project Context/);
  assert.match(stdout, /@task status="todo"/);
});

test("CLI converts Markdown to Lessmark", async () => {
  const { stdout } = await exec(process.execPath, [cli, "from-markdown", markdownFixture]);
  assert.match(stdout, /^# Imported Context/);
  assert.match(stdout, /@summary\nMarkdown import fixture\./);
});

test("CLI converts Lessmark to Markdown", async () => {
  const { stdout } = await exec(process.execPath, [cli, "to-markdown", fixture]);
  assert.match(stdout, /^# Project Context/);
  assert.match(stdout, /- \[ \] Add export settings\./);
});
