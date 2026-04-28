import assert from "node:assert/strict";
import { existsSync, readdirSync, readFileSync } from "node:fs";
import { dirname, extname, join, relative, sep } from "node:path";
import { fileURLToPath } from "node:url";
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
    /throwaway syntax/
  ];
  for (const file of checkedFiles) {
    const source = readFileSync(file, "utf8");
    for (const pattern of banned) {
      assert.ok(!pattern.test(source), `${relative(root, file)} contains stale docs text matching ${pattern}`);
    }
  }
}
