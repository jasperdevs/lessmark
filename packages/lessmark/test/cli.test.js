import test from "node:test";
import assert from "node:assert/strict";
import { execFile } from "node:child_process";
import { mkdir, mkdtemp, readFile, readdir, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { promisify } from "node:util";

const exec = promisify(execFile);
const cli = fileURLToPath(new URL("../bin/lessmark.js", import.meta.url));
const fixture = fileURLToPath(new URL("../../../fixtures/valid/project-context.lmk", import.meta.url));
const siteFixture = fileURLToPath(new URL("../../../fixtures/site/basic", import.meta.url));
const markdownFixture = fileURLToPath(new URL("../../../fixtures/valid/markdown-import.fixture", import.meta.url));
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
      assert.equal(result.errors[0].code, "raw_html");
      assert.match(result.errors[0].message, /raw HTML/);
      assert.equal(result.errors[0].line, 2);
      assert.equal(result.errors[0].column, 1);
      return true;
    }
  );
});

test("CLI info --json prints machine-readable capabilities", async () => {
  const { stdout } = await exec(process.execPath, [cli, "info", "--json"]);
  const info = JSON.parse(stdout);
  assert.equal(info.language, "lessmark");
  assert.equal(info.astVersion, "v0");
  assert.equal(info.cli.strictBuild, true);
  assert.equal(info.cli.formatCheck, true);
  assert.equal(info.syntaxPolicy.aliases, false);
  assert.ok(info.blocks.includes("summary"));
  assert.ok(info.inlineFunctions.includes("ref"));
});

test("CLI info prints human-readable capabilities without internal labels", async () => {
  const { stdout } = await exec(process.execPath, [cli, "info"]);
  assert.match(stdout, /^Lessmark 0\.1\.5\n/);
  assert.doesNotMatch(stdout, /\(v/);
  assert.match(stdout, /Blocks: /);
});

test("CLI format prints normalized source", async () => {
  const { stdout } = await exec(process.execPath, [cli, "format", fixture]);
  assert.match(stdout, /^# Project Context/);
  assert.match(stdout, /@task status="todo"/);
});

test("CLI format --check reports formatting status", async () => {
  const temp = await mkdtemp(join(tmpdir(), "lessmark-format-check-"));
  try {
    const formatted = join(temp, "formatted.lmk");
    const unformatted = join(temp, "unformatted.lmk");
    await writeFile(formatted, await readFile(fixture, "utf8"), "utf8");
    await writeFile(unformatted, "@task todo\nDo it.\n", "utf8");
    const { stdout } = await exec(process.execPath, [cli, "format", "--check", formatted]);
    assert.match(stdout, /formatted/);
    await assert.rejects(
      exec(process.execPath, [cli, "format", "--check", unformatted]),
      (error) => {
        assert.match(error.stderr, /needs formatting/);
        return true;
      }
    );
  } finally {
    await rm(temp, { recursive: true, force: true });
  }
});

test("CLI fix is a formatter alias", async () => {
  const { stdout } = await exec(process.execPath, [cli, "fix", fixture]);
  assert.match(stdout, /^# Project Context/);
  assert.match(stdout, /@task status="todo"/);
});

test("CLI converts Markdown to Lessmark", async () => {
  const { stdout } = await exec(process.execPath, [cli, "from-markdown", markdownFixture]);
  assert.match(stdout, /^# Imported Context/);
  assert.match(stdout, /\nMarkdown import fixture\.\n/);
});

test("CLI converts Lessmark to Markdown", async () => {
  const { stdout } = await exec(process.execPath, [cli, "to-markdown", fixture]);
  assert.match(stdout, /^# Project Context/);
  assert.match(stdout, /- \[ \] Add export settings\./);
});

test("CLI renders a Lessmark document to HTML", async () => {
  const docsFixture = fileURLToPath(new URL("../../../fixtures/valid/docs-page.lmk", import.meta.url));
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
    await writeFile(join(input, "index.lmk"), '@page title="Home" output="index.html"\n\n@nav label="Home" href="index.html"\n\n@nav label="Guide" href="guide.html"\n\n# Home\n\n@paragraph\nBuilt page.\n\n@image src="assets/diagram.svg" alt="Diagram"\n', "utf8");
    await writeFile(join(input, "guide.lessmark"), '@page title="Guide" output="guide.html"\n\n# Guide\n\n@paragraph\nAlias page.\n', "utf8");
    await exec(process.execPath, [cli, "build", "--strict", input, output]);
    const html = await readFile(join(output, "index.html"), "utf8");
    const guide = await readFile(join(output, "guide.html"), "utf8");
    const asset = await readFile(join(output, "assets", "diagram.svg"), "utf8");
    assert.match(html, /<title>Home<\/title>/);
    assert.match(html, /<nav class="lessmark-nav" aria-label="Primary"><a href="index.html">Home<\/a><a href="guide.html">Guide<\/a><\/nav>/);
    assert.match(html, /Built page/);
    assert.match(html, /assets\/diagram.svg/);
    assert.match(guide, /<title>Guide<\/title>/);
    assert.match(guide, /Alias page/);
    assert.match(asset, /<svg>/);
  } finally {
    await rm(temp, { recursive: true, force: true });
  }
});

test("CLI build --strict rejects broken site references before writing", async () => {
  const temp = await mkdtemp(join(tmpdir(), "lessmark-build-strict-"));
  try {
    const input = join(temp, "src");
    const output = join(temp, "out");
    await mkdir(input, { recursive: true });
    await writeFile(join(input, "index.lmk"), '@page title="Home" output="index.html"\n\n@nav label="Missing" href="missing.html"\n\n@link href="assets/missing.pdf"\nMissing asset.\n\n@image src="assets/missing.svg" alt="Missing"\n', "utf8");
    await writeFile(join(input, "again.lmk"), '@page title="Again" output="index.html"\n\n@paragraph\nDuplicate output.\n', "utf8");
    await assert.rejects(
      exec(process.execPath, [cli, "build", "--strict", input, output]),
      (error) => {
        assert.match(error.stderr, /Strict build failed/);
        assert.match(error.stderr, /duplicate @page output/);
        assert.match(error.stderr, /has no built page target/);
        assert.match(error.stderr, /does not exist/);
        return true;
      }
    );
    await assert.rejects(readFile(join(output, "index.html"), "utf8"));
  } finally {
    await rm(temp, { recursive: true, force: true });
  }
});

test("CLI build --strict rejects unsafe inline links before writing", async () => {
  const temp = await mkdtemp(join(tmpdir(), "lessmark-build-inline-link-"));
  try {
    const input = join(temp, "src");
    const output = join(temp, "out");
    await mkdir(input, { recursive: true });
    await writeFile(join(input, "index.lmk"), '@page title="Home" output="index.html"\n\n@paragraph\n{{link:Docs|javascript:alert(1)}}\n', "utf8");
    await assert.rejects(
      exec(process.execPath, [cli, "build", "--strict", input, output]),
      (error) => {
        assert.match(error.stderr, /Strict build failed/);
        assert.match(error.stderr, /render failed/);
        assert.match(error.stderr, /executable URL scheme/);
        return true;
      }
    );
    await assert.rejects(readFile(join(output, "index.html"), "utf8"));
  } finally {
    await rm(temp, { recursive: true, force: true });
  }
});

test("CLI build copies only explicit public assets", async () => {
  const temp = await mkdtemp(join(tmpdir(), "lessmark-build-public-assets-"));
  try {
    const input = join(temp, "src");
    const output = join(temp, "out");
    await mkdir(join(input, "assets"), { recursive: true });
    await mkdir(join(input, ".git"), { recursive: true });
    await mkdir(join(input, "node_modules", "pkg"), { recursive: true });
    await writeFile(join(input, "index.lmk"), '@page title="Home" output="index.html"\n\n@image src="assets/logo.svg" alt="Logo"\n', "utf8");
    await writeFile(join(input, "assets", "logo.svg"), "<svg></svg>\n", "utf8");
    await writeFile(join(input, ".env"), "TOKEN=secret\n", "utf8");
    await writeFile(join(input, ".git", "config"), "secret\n", "utf8");
    await writeFile(join(input, "node_modules", "pkg", "index.js"), "secret\n", "utf8");
    await exec(process.execPath, [cli, "build", "--strict", input, output]);
    assert.match(await readFile(join(output, "assets", "logo.svg"), "utf8"), /<svg>/);
    await assert.rejects(readFile(join(output, ".env"), "utf8"));
    await assert.rejects(readFile(join(output, ".git", "config"), "utf8"));
    await assert.rejects(readFile(join(output, "node_modules", "pkg", "index.js"), "utf8"));
  } finally {
    await rm(temp, { recursive: true, force: true });
  }
});

test("CLI build --strict rejects links to non-public assets", async () => {
  const temp = await mkdtemp(join(tmpdir(), "lessmark-build-private-asset-"));
  try {
    const input = join(temp, "src");
    const output = join(temp, "out");
    await mkdir(input, { recursive: true });
    await writeFile(join(input, "index.lmk"), '@page title="Home" output="index.html"\n\n@link href=".env"\nSecret.\n', "utf8");
    await writeFile(join(input, ".env"), "TOKEN=secret\n", "utf8");
    await assert.rejects(
      exec(process.execPath, [cli, "build", "--strict", input, output]),
      (error) => {
        assert.match(error.stderr, /must point to a public asset/);
        return true;
      }
    );
    await assert.rejects(readFile(join(output, "index.html"), "utf8"));
  } finally {
    await rm(temp, { recursive: true, force: true });
  }
});

test("CLI build --strict rejects generated page and static asset output collisions", async () => {
  const temp = await mkdtemp(join(tmpdir(), "lessmark-build-collision-"));
  try {
    const input = join(temp, "src");
    const output = join(temp, "out");
    await mkdir(join(input, "assets"), { recursive: true });
    await writeFile(join(input, "index.lmk"), '@page title="Home" output="assets/index.html"\n\n@paragraph\nHome.\n', "utf8");
    await writeFile(join(input, "assets", "index.html"), "<!doctype html>\n<title>asset</title>\n", "utf8");
    await assert.rejects(
      exec(process.execPath, [cli, "build", "--strict", input, output]),
      (error) => {
        assert.match(error.stderr, /Strict build failed/);
        assert.match(error.stderr, /static asset output "assets\/index.html" conflicts with generated page/);
        return true;
      }
    );
    await assert.rejects(readFile(join(output, "assets", "index.html"), "utf8"));
  } finally {
    await rm(temp, { recursive: true, force: true });
  }
});

test("CLI build --strict rejects case-insensitive output collisions", async () => {
  const temp = await mkdtemp(join(tmpdir(), "lessmark-build-case-collision-"));
  try {
    const input = join(temp, "src");
    const output = join(temp, "out");
    await mkdir(join(input, "assets"), { recursive: true });
    await writeFile(join(input, "index.lmk"), '@page title="Home" output="assets/index.html"\n\n@paragraph\nHome.\n', "utf8");
    await writeFile(join(input, "assets", "Index.html"), "<!doctype html>\n<title>asset</title>\n", "utf8");
    await assert.rejects(
      exec(process.execPath, [cli, "build", "--strict", input, output]),
      (error) => {
        assert.match(error.stderr, /static asset output "assets\/Index.html" conflicts with generated page/);
        return true;
      }
    );
  } finally {
    await rm(temp, { recursive: true, force: true });
  }
});

test("CLI build --strict rejects case-insensitive static asset collisions", async (t) => {
  const temp = await mkdtemp(join(tmpdir(), "lessmark-build-asset-case-collision-"));
  try {
    const input = join(temp, "src");
    const output = join(temp, "out");
    await mkdir(join(input, "assets"), { recursive: true });
    await writeFile(join(input, "index.lmk"), '@page title="Home" output="index.html"\n\n@paragraph\nHome.\n', "utf8");
    await writeFile(join(input, "assets", "logo.svg"), "<svg></svg>\n", "utf8");
    await writeFile(join(input, "assets", "Logo.svg"), "<svg></svg>\n", "utf8");
    const rootEntries = await readdir(input);
    const assetEntries = await readdir(join(input, "assets"));
    if (!rootEntries.includes("assets") || !assetEntries.includes("logo.svg") || !assetEntries.includes("Logo.svg")) {
      t.skip("filesystem is case-insensitive");
      return;
    }
    await assert.rejects(
      exec(process.execPath, [cli, "build", "--strict", input, output]),
      (error) => {
        assert.match(error.stderr, /duplicate static asset output "assets\/logo.svg" also used by|duplicate static asset output "assets\/Logo.svg" also used by/);
        return true;
      }
    );
  } finally {
    await rm(temp, { recursive: true, force: true });
  }
});

test("CLI build --strict ignores nested output directory on rebuild", async () => {
  const temp = await mkdtemp(join(tmpdir(), "lessmark-build-nested-output-"));
  try {
    const input = join(temp, "src");
    const output = join(input, "public");
    await mkdir(input, { recursive: true });
    await writeFile(join(input, "index.lmk"), '@page title="Home" output="index.html"\n\n@paragraph\nGenerated page.\n', "utf8");
    await exec(process.execPath, [cli, "build", "--strict", input, output]);
    await exec(process.execPath, [cli, "build", "--strict", input, output]);
    const html = await readFile(join(output, "index.html"), "utf8");
    assert.match(html, /Generated page/);
  } finally {
    await rm(temp, { recursive: true, force: true });
  }
});

test("CLI build without --strict preserves legacy page-over-asset behavior", async () => {
  const temp = await mkdtemp(join(tmpdir(), "lessmark-build-legacy-collision-"));
  try {
    const input = join(temp, "src");
    const output = join(temp, "out");
    await mkdir(join(input, "docs"), { recursive: true });
    await writeFile(join(input, "index.lmk"), '@page title="Home" output="docs/index.html"\n\n@paragraph\nGenerated page.\n', "utf8");
    await writeFile(join(input, "docs", "index.html"), "<!doctype html>\n<title>asset</title>\n", "utf8");
    await exec(process.execPath, [cli, "build", input, output]);
    const html = await readFile(join(output, "docs", "index.html"), "utf8");
    assert.match(html, /Generated page/);
  } finally {
    await rm(temp, { recursive: true, force: true });
  }
});

test("CLI build --strict accepts the multi-page site fixture", async () => {
  const temp = await mkdtemp(join(tmpdir(), "lessmark-site-fixture-"));
  try {
    const output = join(temp, "out");
    await exec(process.execPath, [cli, "build", "--strict", siteFixture, output]);
    const index = await readFile(join(output, "index.html"), "utf8");
    const guide = await readFile(join(output, "guide.html"), "utf8");
    const asset = await readFile(join(output, "assets", "diagram.svg"), "utf8");
    assert.match(index, /Typed docs site fixture/);
    assert.match(index, /href="guide.html"/);
    assert.match(guide, /Multi-page Lessmark docs/);
    assert.match(asset, /<svg/);
  } finally {
    await rm(temp, { recursive: true, force: true });
  }
});
