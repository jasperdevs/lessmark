import assert from "node:assert/strict";
import { existsSync, readdirSync, readFileSync } from "node:fs";
import { dirname, extname, join, relative, sep } from "node:path";
import { fileURLToPath } from "node:url";
import { parseLessmark } from "../packages/lessmark/src/index.js";

const root = dirname(dirname(fileURLToPath(import.meta.url)));
const docsDir = join(root, "docs");

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

if (existsSync(docsDir)) {
  for (const file of walk(docsDir).filter((path) => extname(path).toLowerCase() === ".lmk")) {
    parseLessmark(readFileSync(file, "utf8"));
  }
}

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
