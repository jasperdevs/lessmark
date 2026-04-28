import assert from "node:assert/strict";
import { existsSync, readFileSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";

const root = process.cwd();

function readJson(path) {
  return JSON.parse(readFileSync(join(root, path), "utf8"));
}

function read(path) {
  return readFileSync(join(root, path), "utf8");
}

function walk(dir, matches = []) {
  for (const entry of readdirSync(join(root, dir))) {
    const rel = join(dir, entry);
    if (rel.includes("node_modules") || rel.includes("target") || rel.includes(".git")) continue;
    const absolute = join(root, rel);
    const stat = statSync(absolute);
    if (stat.isDirectory()) {
      walk(rel, matches);
    } else {
      matches.push(rel.replaceAll("\\", "/"));
    }
  }
  return matches;
}

const packageVersion = readJson("packages/lessmark/package.json").version;
assert.equal(readJson("package.json").version, packageVersion, "workspace package version must match npm package");
assert.match(read("crates/lessmark/Cargo.toml"), new RegExp(`version = "${packageVersion.replaceAll(".", "\\.")}"`));
assert.match(read("packages/python/pyproject.toml"), new RegExp(`version = "${packageVersion.replaceAll(".", "\\.")}"`));
assert.match(read("editors/vscode/package.json"), new RegExp(`"version": "${packageVersion.replaceAll(".", "\\.")}"`));

const sourceFiles = walk(".").filter((path) => !path.startsWith("site/dist/"));
const muFiles = sourceFiles.filter((path) => path.endsWith(".mu"));
assert.deepEqual(muFiles, [], "Lessmark source files must use .lmk or .lessmark, not .mu");

const rootPackage = readJson("package.json");
assert.ok(!rootPackage.dependencies || Object.keys(rootPackage.dependencies).length === 0, "workspace root must not carry runtime dependencies");

const sitePackage = readJson("site/package.json");
const mermaidRender = read("site/src/lib/mermaid-render.ts");
if (mermaidRender.includes('import("mermaid")')) {
  assert.ok(sitePackage.dependencies?.mermaid, "site must declare mermaid because it dynamically imports it");
  assert.equal(sitePackage.overrides?.uuid, "14.0.0", "site must override uuid until mermaid no longer depends on vulnerable uuid versions");
}

for (const path of [
  "schemas/ast-v0.schema.json",
  "packages/lessmark/schemas/ast-v0.schema.json",
  "packages/python/src/lessmark/schemas/ast-v0.schema.json",
  "crates/lessmark/schemas/ast-v0.schema.json"
]) {
  assert.ok(existsSync(join(root, path)), `missing schema: ${path}`);
}

console.log(`readiness ok: version ${packageVersion}, extension policy, dependency ownership, and schema copies verified`);
