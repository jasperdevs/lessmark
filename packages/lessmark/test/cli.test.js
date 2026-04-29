import test from "node:test";
import assert from "node:assert/strict";
import { execFile, spawn } from "node:child_process";
import { mkdir, mkdtemp, readFile, readdir, rm, symlink, writeFile } from "node:fs/promises";
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

function execInput(args, input) {
  return new Promise((resolve, reject) => {
    const child = spawn(process.execPath, [cli, ...args], { stdio: ["pipe", "pipe", "pipe"] });
    let stdout = "";
    let stderr = "";
    child.stdout.setEncoding("utf8");
    child.stderr.setEncoding("utf8");
    child.stdout.on("data", (chunk) => {
      stdout += chunk;
    });
    child.stderr.on("data", (chunk) => {
      stderr += chunk;
    });
    child.on("error", reject);
    child.on("close", (code) => {
      const result = { stdout, stderr };
      if (code === 0) resolve(result);
      else {
        const error = new Error(`command failed: lessmark ${args.join(" ")}`);
        error.stdout = stdout;
        error.stderr = stderr;
        error.code = code;
        reject(error);
      }
    });
    child.stdin.end(input);
  });
}

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
      assert.match(result.errors[0].hint, /Remove raw HTML/);
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
  assert.equal(info.cli.sourcePositions, true);
  assert.ok(info.cli.commands.includes("init"));
  assert.equal(info.syntaxPolicy.aliases, false);
  assert.ok(info.blocks.includes("summary"));
  assert.ok(info.inlineFunctions.includes("ref"));
});

test("CLI check walks Lessmark files in a directory", async () => {
  const temp = await mkdtemp(join(tmpdir(), "lessmark-check-dir-"));
  try {
    const docs = join(temp, "docs");
    await mkdir(join(docs, "nested"), { recursive: true });
    await writeFile(join(docs, "index.lmk"), "# Index\n\nValid.\n", "utf8");
    await writeFile(join(docs, "nested", "guide.lessmark"), "# Guide\n\nValid.\n", "utf8");
    const { stdout } = await exec(process.execPath, [cli, "check", docs]);
    assert.match(stdout, /index\.lmk: ok/);
    assert.match(stdout, /guide\.lessmark: ok/);
  } finally {
    await rm(temp, { recursive: true, force: true });
  }
});

test("CLI check reads stdin", async () => {
  const { stdout } = await execInput(["check", "-"], "# Stdin\n\nValid.\n");
  assert.match(stdout, /<stdin>: ok/);
});

test("CLI info prints human-readable capabilities without internal labels", async () => {
  const { stdout } = await exec(process.execPath, [cli, "info"]);
  assert.match(stdout, /^Lessmark 0\.1\.6\n/);
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

test("CLI format --check --json reports directory formatting", async () => {
  const temp = await mkdtemp(join(tmpdir(), "lessmark-format-dir-json-"));
  try {
    const docs = join(temp, "docs");
    await mkdir(docs, { recursive: true });
    const formatted = join(docs, "formatted.lmk");
    const unformatted = join(docs, "unformatted.lmk");
    await writeFile(formatted, "# Done\n\nPlain.\n", "utf8");
    await writeFile(unformatted, "@task todo\nDo it.\n", "utf8");
    await assert.rejects(
      exec(process.execPath, [cli, "format", "--check", "--json", docs]),
      (error) => {
        const result = JSON.parse(error.stdout);
        assert.equal(result.ok, false);
        assert.equal(result.files.length, 2);
        assert.equal(result.files.find((file) => file.file.endsWith("formatted.lmk")).changed, false);
        assert.equal(result.files.find((file) => file.file.endsWith("unformatted.lmk")).changed, true);
        return true;
      }
    );
  } finally {
    await rm(temp, { recursive: true, force: true });
  }
});

test("CLI fix --write formats a directory", async () => {
  const temp = await mkdtemp(join(tmpdir(), "lessmark-fix-dir-"));
  try {
    const docs = join(temp, "docs");
    await mkdir(docs, { recursive: true });
    const file = join(docs, "task.lmk");
    await writeFile(file, "@task todo\nDo it.\n", "utf8");
    const { stdout } = await exec(process.execPath, [cli, "fix", "--write", docs]);
    assert.match(stdout, /task\.lmk: formatted/);
    assert.match(await readFile(file, "utf8"), /@task status="todo"/);
  } finally {
    await rm(temp, { recursive: true, force: true });
  }
});

test("CLI parse, format, convert, and render read stdin", async () => {
  const source = "# Stdin\n\nPlain prose.\n";
  const parsed = await execInput(["parse", "-"], source);
  assert.equal(JSON.parse(parsed.stdout).children[0].text, "Stdin");

  const formatted = await execInput(["format", "-"], "@task todo\nDo it.\n");
  assert.match(formatted.stdout, /@task status="todo"/);

  const imported = await execInput(["from-markdown", "-"], "# Imported\n\nText.\n");
  assert.match(imported.stdout, /^# Imported/);

  const markdown = await execInput(["to-markdown", "-"], source);
  assert.match(markdown.stdout, /^# Stdin/);

  const rendered = await execInput(["render", "--document", "-"], source);
  assert.match(rendered.stdout, /<!doctype html>/);
});

test("CLI parse --positions includes source ranges", async () => {
  const { stdout } = await exec(process.execPath, [cli, "parse", "--positions", fixture]);
  const ast = JSON.parse(stdout);
  assert.deepEqual(ast.children[0].position.start, { line: 1, column: 1 });
});

test("CLI init creates a starter docs file without overwriting", async () => {
  const temp = await mkdtemp(join(tmpdir(), "lessmark-init-"));
  try {
    const docs = join(temp, "docs");
    const { stdout } = await exec(process.execPath, [cli, "init", docs]);
    assert.match(stdout, /created/);
    const source = await readFile(join(docs, "index.lmk"), "utf8");
    assert.match(source, /@summary/);
    await assert.rejects(exec(process.execPath, [cli, "init", docs]), /already exists/);
  } finally {
    await rm(temp, { recursive: true, force: true });
  }
});

test("CLI skill workflow creates, validates, builds, imports, installs, and dev-builds skills", async () => {
  const temp = await mkdtemp(join(tmpdir(), "lessmark-skill-"));
  try {
    const skill = join(temp, "code-review");
    const repo = join(temp, "repo");
    await mkdir(repo, { recursive: true });

    const init = await exec(process.execPath, [cli, "skill", "init", skill]);
    assert.match(init.stdout, /created/);

    await writeFile(join(skill, "references", "checklist.lmk"), "# Checklist\n\nRead the diff.\n", "utf8");
    await writeFile(join(skill, "skill.lmk"), [
      '@skill name="code-review" description="Review code for bugs, regressions, security issues, and missing tests."',
      "",
      "When reviewing code, lead with findings.",
      "",
      "@constraint",
      "Do not rewrite unrelated files.",
      "Report missing tests separately.",
      "",
      '@decision id="review-order"',
      "Lead with bugs.",
      "Then mention test gaps.",
      "",
      '@file path="references/checklist.lmk"',
      "Use this reference for deeper reviews.",
      "Keep {{code:checklist.lmk}} and {{link:docs|https://example.com}} close while reading diffs.",
      "",
      '@api name="review.findings"',
      "Return {{strong:findings}} before summaries.",
      "Include file and line when possible.",
      ""
    ].join("\n"), "utf8");

    const checked = await exec(process.execPath, [cli, "skill", "check", skill]);
    assert.match(checked.stdout, /ok/);

    const built = await exec(process.execPath, [cli, "skill", "build", skill, "--target", "codex"]);
    assert.match(built.stdout, /SKILL\.md/);
    const generated = await readFile(join(skill, "build", "codex", "SKILL.md"), "utf8");
    assert.match(generated, /name: "code-review"/);
    assert.match(generated, /Generated from skill\.lmk/);
    assert.match(generated, /When reviewing code/);
    assert.match(generated, /> Report missing tests separately\./);
    assert.match(generated, /Keep `checklist\.lmk` and \[docs\]\(https:\/\/example\.com\) close while reading diffs\./);
    assert.match(generated, /Return \*\*findings\*\* before summaries\./);
    assert.match(await readFile(join(skill, "build", "codex", "references", "checklist.lmk"), "utf8"), /Checklist/);

    const customOut = join(temp, "custom-build");
    await exec(process.execPath, [cli, "skill", "build", skill, "--target", "both", "--out", customOut]);
    assert.match(await readFile(join(customOut, "codex", "SKILL.md"), "utf8"), /code-review/);
    assert.match(await readFile(join(customOut, "claude", "SKILL.md"), "utf8"), /code-review/);

    const imported = join(temp, "imported.lmk");
    await exec(process.execPath, [cli, "skill", "import", join(skill, "build", "codex", "SKILL.md"), "--out", imported]);
    const importedSource = await readFile(imported, "utf8");
    assert.match(importedSource, /@skill name="code-review"/);
    assert.match(importedSource, /@constraint\nDo not rewrite unrelated files\.\nReport missing tests separately\./);
    assert.match(importedSource, /@decision id="review-order"\nLead with bugs\.\nThen mention test gaps\./);
    assert.match(importedSource, /@file path="references\/checklist\.lmk"/);
    assert.match(importedSource, /Keep \{\{code:checklist\.lmk\}\} and \{\{link:docs\|https:\/\/example\.com\}\} close while reading diffs\./);
    assert.match(importedSource, /@api name="review\.findings"\nReturn \{\{strong:findings\}\} before summaries\.\nInclude file and line when possible\./);

    const installed = await exec(process.execPath, [cli, "skill", "install", skill, "--target", "codex", "--repo", repo]);
    assert.match(installed.stdout, /installed/);
    assert.match(await readFile(join(repo, ".agents", "skills", "code-review", "SKILL.md"), "utf8"), /code-review/);

    await rm(join(skill, "build"), { recursive: true, force: true });
    await exec(process.execPath, [cli, "skill", "dev", skill, "--target", "claude", "--once"]);
    assert.match(await readFile(join(skill, "build", "claude", "SKILL.md"), "utf8"), /code-review/);
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
    await writeFile(join(input, "index.lmk"), '@page title="Home" output="index.html"\n\n@nav label="Home" href="index.html"\n\n@nav label="Guide" href="guide.html"\n\n# Home\n\nBuilt page.\n\n@image src="assets/diagram.svg" alt="Diagram"\n', "utf8");
    await writeFile(join(input, "guide.lessmark"), '@page title="Guide" output="guide.html"\n\n# Guide\n\nAlias page.\n', "utf8");
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
    await writeFile(join(input, "again.lmk"), '@page title="Again" output="index.html"\n\nDuplicate output.\n', "utf8");
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
    await writeFile(join(input, "index.lmk"), '@page title="Home" output="index.html"\n\n{{link:Docs|javascript:alert(1)}}\n', "utf8");
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

test("CLI build refuses symlinked output destinations", async (t) => {
  const temp = await mkdtemp(join(tmpdir(), "lessmark-build-symlink-output-"));
  try {
    const input = join(temp, "src");
    const output = join(temp, "out");
    const outside = join(temp, "outside.html");
    await mkdir(input, { recursive: true });
    await mkdir(output, { recursive: true });
    await writeFile(join(input, "index.lmk"), '@page title="Home" output="index.html"\n\nHome.\n', "utf8");
    await writeFile(outside, "outside\n", "utf8");
    try {
      await symlink(outside, join(output, "index.html"));
    } catch (error) {
      if (["EPERM", "EACCES", "ENOSYS"].includes(error?.code)) {
        t.skip(`filesystem does not allow symlink creation: ${error.code}`);
        return;
      }
      throw error;
    }
    await assert.rejects(
      exec(process.execPath, [cli, "build", input, output]),
      (error) => {
        assert.match(error.stderr, /Refusing to overwrite symlinked output path/);
        return true;
      }
    );
    assert.equal(await readFile(outside, "utf8"), "outside\n");
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
    await writeFile(join(input, "index.lmk"), '@page title="Home" output="assets/index.html"\n\nHome.\n', "utf8");
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
    await writeFile(join(input, "index.lmk"), '@page title="Home" output="assets/index.html"\n\nHome.\n', "utf8");
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
    await writeFile(join(input, "index.lmk"), '@page title="Home" output="index.html"\n\nHome.\n', "utf8");
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
    await writeFile(join(input, "index.lmk"), '@page title="Home" output="index.html"\n\nGenerated page.\n', "utf8");
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
    await writeFile(join(input, "index.lmk"), '@page title="Home" output="docs/index.html"\n\nGenerated page.\n', "utf8");
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
