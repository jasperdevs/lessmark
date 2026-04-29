import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { getCapabilities } from "../packages/lessmark/src/index.js";

const root = dirname(dirname(fileURLToPath(import.meta.url)));
const vscodeDir = join(root, "editors", "vscode");
const pkg = readJson(join(vscodeDir, "package.json"));
const grammar = readJson(join(vscodeDir, "syntaxes", "lessmark.tmLanguage.json"));
const languageConfigPath = join(vscodeDir, "language-configuration.json");
const extensionSource = readFileSync(join(vscodeDir, "extension.js"), "utf8");
const capabilities = getCapabilities();

assert.equal(pkg.name, "lessmark-vscode");
assert.equal(pkg.publisher, "JasperDevs");
assert.equal(pkg.displayName, "Lessmark");
assert.deepEqual(languageExtensions(pkg), capabilities.extensions);
assert.equal(pkg.contributes.grammars[0].language, "lessmark");
assert.equal(pkg.contributes.grammars[0].scopeName, "source.lessmark");
assert.equal(pkg.contributes.grammars[0].path, "./syntaxes/lessmark.tmLanguage.json");
assert.ok(existsSync(join(vscodeDir, pkg.icon)), "VS Code extension icon must exist");
assert.ok(existsSync(languageConfigPath), "VS Code language configuration must exist");

const grammarBlocks = blockNamesFromGrammar(grammar);
const sourceBlocks = capabilities.blocks.filter((block) => block !== "paragraph");
assert.deepEqual(grammarBlocks, sourceBlocks, "VS Code grammar block list must match source block grammar");

for (const block of sourceBlocks) {
  assert.match(extensionSource, new RegExp(`\\["${escapeRegExp(block)}",`), `Missing hover docs for @${block}`);
}
for (const inline of capabilities.inlineFunctions) {
  assert.match(extensionSource, new RegExp(`\\["${escapeRegExp(inline)}",`), `Missing hover docs for {{${inline}:...}}`);
}
for (const command of ["lessmark.check", "lessmark.preview"]) {
  assert.ok(pkg.activationEvents.includes(`onCommand:${command}`), `Missing activation event for ${command}`);
  assert.ok(pkg.contributes.commands.some((entry) => entry.command === command), `Missing contributed command ${command}`);
  assert.match(extensionSource, new RegExp(`registerCommand\\("${escapeRegExp(command)}"`), `Extension does not register ${command}`);
}

console.log("editors ok");

function readJson(path) {
  return JSON.parse(readFileSync(path, "utf8"));
}

function languageExtensions(packageJson) {
  const language = packageJson.contributes.languages.find((entry) => entry.id === "lessmark");
  assert.ok(language, "Lessmark language contribution missing");
  assert.equal(language.configuration, "./language-configuration.json");
  return language.extensions;
}

function blockNamesFromGrammar(value) {
  const source = value.repository?.block?.match;
  assert.equal(typeof source, "string", "Block grammar regex missing");
  const match = /^\^@\((.+)\)\\b$/.exec(source);
  assert.ok(match, "Block grammar regex shape changed");
  return match[1].split("|");
}

function escapeRegExp(value) {
  return String(value).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
