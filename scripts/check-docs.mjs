import assert from "node:assert/strict";
import { existsSync, mkdirSync, mkdtempSync, readdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, extname, join, relative, sep } from "node:path";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import * as jsExports from "../packages/lessmark/src/index.js";
import { getCapabilities, parseLessmark, validateSource } from "../packages/lessmark/src/index.js";

const root = dirname(dirname(fileURLToPath(import.meta.url)));
const docsDir = join(root, "docs");
const siteContentDir = join(root, "site", "src", "content");

assert.equal(existsSync(join(root, "README.lmk")), false, "README.lmk must not exist; README.md is required for platforms");

const markdownFiles = walk(root)
  .filter((file) => extname(file).toLowerCase() === ".md")
  .map((file) => relative(root, file).split(sep).join("/"))
  .filter((file) => !isAllowedMarkdown(file));

assert.deepEqual(markdownFiles, [], `Unexpected Markdown files: ${markdownFiles.join(", ")}`);

const docsMarkdown = existsSync(docsDir)
  ? walk(docsDir)
      .filter((file) => extname(file).toLowerCase() === ".md")
      .map((file) => relative(root, file).split(sep).join("/"))
  : [];

assert.deepEqual(docsMarkdown, [], `docs/ must use Lessmark .lmk files: ${docsMarkdown.join(", ")}`);

for (const contentDir of [docsDir, siteContentDir]) {
  if (!existsSync(contentDir)) continue;
  checkContentDirectory(contentDir);
}

checkReadmeCliExamples();
checkReadmeCliBehavior();
checkApiReference();
checkLessmarkCodeExamples();
checkSiteIsContentBackedByLessmark();
checkStaleDocsText();

console.log("docs ok");

function walk(dir) {
  return readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const path = join(dir, entry.name);
    if (entry.isDirectory()) {
      if ([".git", "node_modules", "target", "dist", ".omx"].includes(entry.name)) return [];
      return walk(path);
    }
    return [path];
  });
}

function isAllowedMarkdown(file) {
  return file === "README.md" || file.endsWith("/README.md");
}

function checkContentDirectory(contentDir) {
  const contentFiles = walk(contentDir);
  const contentMarkdown = contentFiles
    .filter((file) => extname(file).toLowerCase() === ".md")
    .map((file) => relative(root, file).split(sep).join("/"));
  assert.deepEqual(contentMarkdown, [], `${relative(root, contentDir)} must use Lessmark .lmk files: ${contentMarkdown.join(", ")}`);

  for (const file of contentFiles.filter((path) => extname(path).toLowerCase() === ".lmk")) {
    const source = readFileSync(file, "utf8");
    parseLessmark(source);
    const errors = validateSource(source);
    assert.deepEqual(errors, [], `${relative(root, file)} failed validation`);
  }
}

function checkReadmeCliExamples() {
  const readme = readFileSync(join(root, "README.md"), "utf8");
  const knownCommands = new Set(getCapabilities().cli.commands);
  const examples = [];
  for (const block of readme.matchAll(/```sh\n([\s\S]*?)```/g)) {
    for (const line of block[1].split("\n")) {
      const trimmed = line.trim();
      if (trimmed.startsWith("lessmark ")) examples.push(trimmed);
    }
  }
  assert.ok(examples.length > 0, "README.md must include Lessmark CLI examples");
  for (const example of examples) {
    const command = example.split(/\s+/)[1];
    assert.ok(knownCommands.has(command), `README.md documents unknown Lessmark CLI command: ${example}`);
  }
}

function checkReadmeCliBehavior() {
  const temp = mkdtempSync(join(tmpdir(), "lessmark-docs-cli-"));
  try {
    const cli = join(root, "packages", "lessmark", "bin", "lessmark.js");
    const source = join(temp, "file.lmk");
    const markdown = join(temp, "README.md");
    const input = join(temp, "input");
    const output = join(temp, "public");
    writeFileSync(source, "# Notes\n\nPlain prose.\n", "utf8");
    writeFileSync(markdown, "# Notes\n\nPlain prose.\n", "utf8");
    writeFileSync(join(temp, "input.lmk"), '@page title="Home" output="index.html"\n\nHome.\n', "utf8");
    assertCliOk([cli, "parse", source], /"type": "document"/);
    assertCliOk([cli, "check", source], /ok/);
    assertCliOk([cli, "check", "--json", source], /\[\]/);
    assertCliOk([cli, "format", source], /# Notes/);
    assertCliOk([cli, "from-markdown", markdown], /# Notes/);
    assertCliOk([cli, "to-markdown", source], /# Notes/);
    assertCliOk([cli, "info", "--json"], /"language": "lessmark"/);
    assertCliOk([cli, "skill", "init", join(temp, "code-review")], /created/);
    assertCliOk([cli, "skill", "build", join(temp, "code-review"), "--target", "codex"], /SKILL\.md/);
    mkdirSync(input, { recursive: true });
    writeFileSync(join(input, "index.lmk"), '@page title="Home" output="index.html"\n\nHome.\n', "utf8");
    assertCliOk([cli, "build", "--strict", input, output], /.*/);
    assert.ok(existsSync(join(output, "index.html")), "build --strict should write index.html");
  } finally {
    rmSync(temp, { recursive: true, force: true });
  }
}

function assertCliOk(args, stdoutPattern) {
  const result = spawnSync(process.execPath, args, { cwd: root, encoding: "utf8" });
  assert.equal(result.status, 0, `${args.slice(1).join(" ")} failed: ${result.stderr}`);
  assert.match(result.stdout, stdoutPattern, `${args.slice(1).join(" ")} stdout mismatch`);
}

function checkApiReference() {
  const apiSource = readFileSync(join(siteContentDir, "docs", "api.lmk"), "utf8");
  assert.ok(!/Every export from the lessmark packages/.test(apiSource), "API docs must not claim to list every package export");
  const sections = {
    JavaScript: documentedApis(apiSource, "JavaScript", "Python"),
    Python: documentedApis(apiSource, "Python", "Rust"),
    Rust: documentedApis(apiSource, "Rust", "CLI")
  };
  assertDocumentedApisExist("JavaScript", sections.JavaScript, new Set(Object.keys(jsExports)));
  assertDocumentedApisExist("Python", sections.Python, pythonExports());
  assertDocumentedApisExist("Rust", sections.Rust, rustExports());
}

function checkLessmarkCodeExamples() {
  const checkedFiles = walk(siteContentDir)
    .filter((file) => extname(file).toLowerCase() === ".lmk");
  for (const file of checkedFiles) {
    const source = readFileSync(file, "utf8");
    const ast = parseLessmark(source);
    let index = 0;
    for (const node of ast.children) {
      if (node.type !== "block" || node.name !== "code" || node.attrs?.lang !== "lessmark") continue;
      index += 1;
      const body = normalizeIndentedExample(node.text ?? "");
      const errors = validateSource(body);
      assert.deepEqual(errors, [], `${relative(root, file)} lessmark code example ${index} failed validation`);
    }
  }
}

function checkSiteIsContentBackedByLessmark() {
  const contentFiles = walk(siteContentDir)
    .map((file) => relative(siteContentDir, file).split(sep).join("/"));
  const nonLessmarkContent = contentFiles.filter((file) => extname(file).toLowerCase() !== ".lmk");
  assert.deepEqual(nonLessmarkContent, [], `site/src/content must only contain .lmk files: ${nonLessmarkContent.join(", ")}`);

  const index = readFileSync(join(root, "site", "index.html"), "utf8");
  assert.match(index, /<title><\/title>/, "site title must be set from chrome/ui.lmk at runtime");
  assert.match(index, /<meta name="description" content="" \/>/, "site description must be set from chrome/ui.lmk at runtime");

  const sourceFiles = walk(join(root, "site", "src"))
    .filter((file) => [".ts", ".tsx"].includes(extname(file).toLowerCase()))
    .filter((file) => !file.endsWith(`${sep}lessmark.d.ts`));
  for (const file of sourceFiles) {
    const source = readFileSync(file, "utf8");
    assert.ok(!/\|\|\s*"[^"]*[A-Za-z][^"]*"/.test(source), `${relative(root, file)} contains hardcoded UI fallback text`);
  }
}

function normalizeIndentedExample(source) {
  const lines = String(source).split("\n");
  const nonEmpty = lines.filter((line) => line.trim() !== "");
  if (nonEmpty.length > 0 && nonEmpty.every((line) => line.startsWith("  "))) {
    return `${lines.map((line) => line.startsWith("  ") ? line.slice(2) : line).join("\n")}\n`;
  }
  return `${source.replace(/\n?$/, "")}\n`;
}

function documentedApis(source, startHeading, endHeading) {
  const start = source.indexOf(`## ${startHeading}`);
  const end = source.indexOf(`## ${endHeading}`);
  assert.notEqual(start, -1, `Missing ${startHeading} API section`);
  assert.notEqual(end, -1, `Missing ${endHeading} API section`);
  return [...source.slice(start, end).matchAll(/^@api name="([^"]+)"/gm)].map((match) => match[1]);
}

function assertDocumentedApisExist(label, documented, actual) {
  assert.ok(documented.length > 0, `${label} API section must document at least one export`);
  for (const name of documented) {
    assert.ok(actual.has(name), `${label} API docs list missing export: ${name}`);
  }
}

function pythonExports() {
  const source = readFileSync(join(root, "packages", "python", "src", "lessmark", "__init__.py"), "utf8");
  return new Set([...source.matchAll(/"([^"]+)"/g)].map((match) => match[1]));
}

function rustExports() {
  const source = readFileSync(join(root, "crates", "lessmark", "src", "lib.rs"), "utf8");
  const exports = new Set();
  for (const match of source.matchAll(/pub use [^:]+::(?:\{([^}]+)\}|([A-Za-z_][A-Za-z0-9_]*))/g)) {
    const names = match[1] ? match[1].split(",") : [match[2]];
    for (const name of names) {
      const clean = name.trim();
      if (clean) exports.add(clean);
    }
  }
  return exports;
}

function checkStaleDocsText() {
  const checkedFiles = walk(root)
    .filter((file) => [".md", ".lmk"].includes(extname(file).toLowerCase()))
    .filter((file) => !relative(root, file).split(sep).includes("dist"));
  const banned = [
    /Every package ships \{\{code:renderHtml\}\}/,
    /same commands via \{\{code:cargo run -p lessmark\}\}/,
    /Every package ships the same three phases/,
    /render_html is not yet shipped/,
    /from lessmark import parse, render_html/,
    /\{\{ref:#/,
    /level \(1, 2, or 3\)/,
    /CommonMark document/,
    /pre-1\.0/,
    /throwaway syntax/,
    /Every export from the lessmark packages/,
    /The CLI prints a line:column pointer for each error/,
    /CommonMark to lessmark\./,
    /fenced \{\{code:`{3}\}\} blocks/,
    /LessmarkError[\s\S]{0,120}\{\{code:code\}\}/,
    /2\|I\/O error/,
    /\bv0\b/,
    /ast-v0/,
    /language-v0/,
    /profiles-v0/
  ];
  for (const file of checkedFiles) {
    const source = readFileSync(file, "utf8");
    for (const pattern of banned) {
      assert.ok(!pattern.test(source), `${relative(root, file)} contains stale docs text matching ${pattern}`);
    }
  }
}
