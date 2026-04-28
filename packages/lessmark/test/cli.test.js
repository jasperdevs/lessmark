import test from "node:test";
import assert from "node:assert/strict";
import { execFile } from "node:child_process";
import { mkdir, mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { promisify } from "node:util";

const exec = promisify(execFile);
const cli = fileURLToPath(new URL("../bin/lessmark.js", import.meta.url));
const fixture = fileURLToPath(new URL("../../../fixtures/valid/project-context.mu", import.meta.url));
const markdownFixture = fileURLToPath(new URL("../../../fixtures/valid/markdown-import.md", import.meta.url));
const invalidFixture = fileURLToPath(new URL("../../../fixtures/invalid/raw-html.mu", import.meta.url));

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

test("CLI renders a Lessmark document to HTML", async () => {
  const docsFixture = fileURLToPath(new URL("../../../fixtures/valid/docs-page.mu", import.meta.url));
  const { stdout } = await exec(process.execPath, [cli, "render", "--document", docsFixture]);
  assert.match(stdout, /<!doctype html>/);
  assert.match(stdout, /<table>/);
});

test("CLI builds a directory of Lessmark pages", async () => {
  const temp = await mkdtemp(join(tmpdir(), "lessmark-build-"));
  try {
    const input = join(temp, "src");
    const output = join(temp, "out");
    await mkdir(join(input, "assets"), { recursive: true });
    await writeFile(join(input, "assets", "diagram.svg"), "<svg></svg>\n", "utf8");
    await writeFile(join(input, "index.mu"), '@page title="Home" output="index.html"\n\n# Home\n\n@paragraph\nBuilt page.\n\n@image src="assets/diagram.svg" alt="Diagram"\n', "utf8");
    await writeFile(join(input, "guide.lessmark"), '@page title="Guide" output="guide.html"\n\n# Guide\n\n@paragraph\nAlias page.\n', "utf8");
    await exec(process.execPath, [cli, "build", input, output]);
    const html = await readFile(join(output, "index.html"), "utf8");
    const guide = await readFile(join(output, "guide.html"), "utf8");
    const asset = await readFile(join(output, "assets", "diagram.svg"), "utf8");
    assert.match(html, /<title>Home<\/title>/);
    assert.match(html, /Built page/);
    assert.match(html, /assets\/diagram.svg/);
    assert.match(guide, /<title>Guide<\/title>/);
    assert.match(guide, /Alias page/);
    assert.match(asset, /<svg>/);
  } finally {
    await rm(temp, { recursive: true, force: true });
  }
});
