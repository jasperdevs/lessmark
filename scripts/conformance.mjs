import assert from "node:assert/strict";
import { mkdtempSync, readdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { basename, dirname, join } from "node:path";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import { formatLessmark, fromMarkdown, getCapabilities, parseLessmark, toMarkdown, validateSource } from "../packages/lessmark/src/index.js";

const root = dirname(dirname(fileURLToPath(import.meta.url)));
const validDir = join(root, "fixtures", "valid");
const invalidDir = join(root, "fixtures", "invalid");
const rootSchema = readFileSync(join(root, "schemas", "ast-v0.schema.json"), "utf8");
const rootLanguageContract = readFileSync(join(root, "schemas", "language-v0.contract.json"), "utf8");
const rootProfilesContract = readFileSync(join(root, "schemas", "profiles-v0.contract.json"), "utf8");
const languageContract = JSON.parse(readFileSync(join(root, "schemas", "language-v0.contract.json"), "utf8"));
const profilesContract = JSON.parse(readFileSync(join(root, "schemas", "profiles-v0.contract.json"), "utf8"));

for (const name of readdirSync(validDir).filter((file) => file.endsWith(".lmk")).sort()) {
  const path = join(validDir, name);
  const source = readFileSync(path, "utf8");
  const expected = JSON.parse(readFileSync(path.replace(/\.lmk$/, ".ast.json"), "utf8"));

  assert.deepEqual(parseLessmark(source), expected, `js parse ${name}`);
  assert.deepEqual(pythonJson("parse", path), expected, `python parse ${name}`);
  assert.deepEqual(rustJson(["parse", path]), expected, `rust parse ${name}`);

  const formatted = formatLessmark(source);
  assert.equal(pythonText("format", path), formatted, `python format ${name}`);
  assert.equal(rustText(["format", path]), formatted, `rust format ${name}`);

  const exported = toMarkdown(source);
  assert.equal(pythonText("to-markdown", path), exported, `python to-markdown ${name}`);
  assert.equal(rustText(["to-markdown", path]), exported, `rust to-markdown ${name}`);
}

for (const name of readdirSync(invalidDir).filter((file) => file.endsWith(".lmk")).sort()) {
  const path = join(invalidDir, name);
  const source = readFileSync(path, "utf8");
  const jsErrors = validateSource(source);
  const pyErrors = pythonJson("validate", path);
  assert.notEqual(jsErrors.length, 0, `js rejects ${name}`);
  assert.notEqual(pyErrors.length, 0, `python rejects ${name}`);
  assert.deepEqual(pyErrors, jsErrors, `python validation errors ${name}`);

  const checked = rust(["check", "--json", path], { allowFailure: true });
  assert.notEqual(checked.status, 0, `rust rejects ${name}`);
  const rustResult = JSON.parse(checked.stdout);
  assert.notEqual(rustResult.errors.length, 0, `rust check errors ${name}`);
  assert.deepEqual(rustResult.errors, jsErrors, `rust validation errors ${name}`);
}

for (const schemaPath of [
  join(root, "packages", "lessmark", "schemas", "ast-v0.schema.json"),
  join(root, "packages", "python", "src", "lessmark", "schemas", "ast-v0.schema.json"),
  join(root, "crates", "lessmark", "schemas", "ast-v0.schema.json")
]) {
  assert.equal(readFileSync(schemaPath, "utf8"), rootSchema, `schema copy ${schemaPath}`);
}

for (const contractPath of [
  join(root, "packages", "lessmark", "schemas", "language-v0.contract.json"),
  join(root, "packages", "python", "src", "lessmark", "schemas", "language-v0.contract.json"),
  join(root, "crates", "lessmark", "schemas", "language-v0.contract.json")
]) {
  assert.equal(readFileSync(contractPath, "utf8"), rootLanguageContract, `language contract copy ${contractPath}`);
}

for (const contractPath of [
  join(root, "packages", "lessmark", "schemas", "profiles-v0.contract.json"),
  join(root, "packages", "python", "src", "lessmark", "schemas", "profiles-v0.contract.json"),
  join(root, "crates", "lessmark", "schemas", "profiles-v0.contract.json")
]) {
  assert.equal(readFileSync(contractPath, "utf8"), rootProfilesContract, `profiles contract copy ${contractPath}`);
}

assertProfileContract(profilesContract);

const markdownFixture = join(validDir, "markdown-import.fixture");
const markdownSource = readFileSync(markdownFixture, "utf8");
const imported = fromMarkdown(markdownSource);
assert.equal(pythonText("from-markdown", markdownFixture), imported, "python from-markdown parity");
assert.equal(rustText(["from-markdown", markdownFixture]), imported, "rust from-markdown parity");

const jsInfo = getCapabilities();
const pyInfo = pythonJson("info", markdownFixture);
const rustInfo = rustJson(["info", "--json"]);
for (const [label, info] of [["python", pyInfo], ["rust", rustInfo]]) {
  assertLanguageContract(info, label);
}
assertLanguageContract(jsInfo, "js");

const generatedDir = mkdtempSync(join(tmpdir(), "lessmark-generated-conformance-"));
try {
  for (const [index, source] of generatedValidSources().entries()) {
    const path = join(generatedDir, `valid-${index}.lmk`);
    writeFileSync(path, source, "utf8");
    const expected = parseLessmark(source);
    assert.deepEqual(pythonJson("parse", path), expected, `python generated parse ${index}`);
    assert.deepEqual(rustJson(["parse", path]), expected, `rust generated parse ${index}`);
    assert.equal(validateSource(source).length, 0, `js generated validates ${index}`);
    assert.equal(pythonText("format", path), formatLessmark(source), `python generated format ${index}`);
    assert.equal(rustText(["format", path]), formatLessmark(source), `rust generated format ${index}`);
    assert.equal(pythonText("to-markdown", path), toMarkdown(source), `python generated markdown ${index}`);
    assert.equal(rustText(["to-markdown", path]), toMarkdown(source), `rust generated markdown ${index}`);
  }
  const crlfPath = join(generatedDir, "bom-crlf.lmk");
  const crlfSource = "\uFEFF# Project\r\n\r\n@summary\r\nBody.\r\n";
  writeFileSync(crlfPath, crlfSource, "utf8");
  const expected = parseLessmark(crlfSource);
  assert.deepEqual(pythonJson("parse", crlfPath), expected, "python bom crlf parse");
  assert.deepEqual(rustJson(["parse", crlfPath]), expected, "rust bom crlf parse");
  assert.equal(pythonText("format", crlfPath), formatLessmark(crlfSource), "python bom crlf format");
  assert.equal(rustText(["format", crlfPath]), formatLessmark(crlfSource), "rust bom crlf format");
} finally {
  rmSync(generatedDir, { recursive: true, force: true });
}

console.log("conformance ok");

function generatedValidSources() {
  const statuses = ["todo", "doing", "done", "blocked"];
  const risks = ["low", "medium", "high", "critical"];
  const sources = [];
  for (let index = 0; index < 16; index += 1) {
    const slug = `case-${index}`;
    sources.push(`# Generated ${index}

@summary
Generated conformance case ${index} with {{strong:typed}} context.

@task status="${statuses[index % statuses.length]}"
Complete generated case ${index}.

@risk level="${risks[index % risks.length]}"
Risk stays explicit.

@decision id="${slug}"
Decision target.

@reference target="${slug}" label="{{strong:Decision}} ${index}"

@table columns="Key|Value"
name|case-${index}
pipe|escaped\\|value
`);
  }
  let nested = "deep";
  for (let index = 0; index < 24; index += 1) {
    nested = `{{strong:${nested}}}`;
  }
  sources.push(`# Deep Inline

${nested}
`);
  sources.push(`# Authoring Conveniences

Use **bold**, *emphasis*, \`code\`, \`**literal**\`, [Docs](https://example.com), [Decision](#storage-backend), [^note], ==marked==, and ~~gone~~.

@list unordered
- One
- Two

@list ordered
- First
- Second

@decision storage-backend
Use SQLite.

@task todo
Add docs.

@risk high
Migration risk.

@file src/app.ts
Owns app.

@api parseLessmark
Parser API.

@code ts
const ok = true;

@callout warning
Watch this.

@definition API
Application programming interface.

@table Name|Value
Stage|alpha

@separator

@metadata project.stage
alpha

@link https://example.com
Homepage.

@footnote note
Footnote body.
`);
  return sources;
}

function assertLanguageContract(info, label) {
  for (const key of ["language", "astVersion", "extensions", "mediaType", "blocks", "inlineFunctions", "enums", "syntaxPolicy"]) {
    assert.deepEqual(info[key], languageContract[key], `${label} language contract ${key}`);
  }
  assert.equal(typeof info.version, "string", `${label} capability version`);
  assert.equal(typeof info.cli, "object", `${label} capability cli`);
  assert.equal(typeof info.renderer, "object", `${label} capability renderer`);
}

function assertProfileContract(contract) {
  assert.equal(contract.language, "lessmark", "profile contract language");
  assert.equal(contract.version, "v0", "profile contract version");
  const expectedProfiles = {
    "agent-context": {
      requiredBlocks: ["summary"],
      recommendedBlocks: ["metadata", "decision", "constraint", "file", "api", "task", "risk", "depends-on", "callout", "example"],
      disallowedFeatures: ["rawHtml", "hooks", "customBlocks", "privateFlavors", "rendererSpecificSyntax"]
    },
    docs: {
      requiredBlocks: [],
      recommendedBlocks: ["page", "nav", "paragraph", "image", "math", "diagram", "separator", "list", "table", "quote", "callout", "toc", "definition", "reference", "footnote"],
      disallowedFeatures: ["rawHtml", "hooks", "customComponents", "styleDirectives", "layoutDirectives", "privateFlavors"]
    }
  };
  assert.deepEqual(contract.profiles.map((profile) => profile.name).sort(), Object.keys(expectedProfiles).sort(), "accepted profile names");
  for (const profile of contract.profiles) {
    const expected = expectedProfiles[profile.name];
    assert.equal(profile.status, "accepted", `${profile.name} profile status`);
    assert.equal(typeof profile.audience, "string", `${profile.name} profile audience`);
    assert.equal(typeof profile.renderer, "string", `${profile.name} profile renderer`);
    assert.equal(typeof profile.securityModel, "string", `${profile.name} profile security model`);
    assert.deepEqual(profile.requiredBlocks, expected.requiredBlocks, `${profile.name} required blocks`);
    assert.deepEqual(profile.recommendedBlocks, expected.recommendedBlocks, `${profile.name} recommended blocks`);
    assert.deepEqual(profile.disallowedFeatures, expected.disallowedFeatures, `${profile.name} disallowed features`);
    for (const block of [...profile.requiredBlocks, ...profile.recommendedBlocks]) {
      assert.equal(languageContract.blocks.includes(block), true, `${profile.name} block exists in language contract: ${block}`);
    }
  }
  assert.deepEqual(contract.changePolicy.newProfileRequires, ["profileName", "audience", "renderer", "securityModel", "validFixtures", "invalidFixtures", "specUpdate", "conformanceUpdate"], "new profile required evidence");
  assert.equal(contract.changePolicy.privateFlavorsAllowed, false, "private flavors disallowed");
  assert.equal(contract.changePolicy.silentDialectSwitchesAllowed, false, "silent dialect switches disallowed");
}

function rustJson(args) {
  return JSON.parse(rustText(args));
}

function rustText(args) {
  return rust(args).stdout;
}

function rust(args, options = {}) {
  const result = spawnSync("cargo", ["run", "-q", "-p", "lessmark", "--", ...args], {
    cwd: root,
    encoding: "utf8"
  });
  if (!options.allowFailure && result.status !== 0) {
    throw new Error(`rust ${args.join(" ")} failed: ${result.stderr}`);
  }
  return result;
}

function pythonJson(command, path) {
  return JSON.parse(pythonText(command, path));
}

function pythonText(command, path) {
  const code = String.raw`
import json, sys
from pathlib import Path
from lessmark import parse_lessmark, validate_source, format_lessmark, from_markdown, to_markdown, get_capabilities
if hasattr(sys.stdout, "reconfigure"):
    sys.stdout.reconfigure(newline="\n")
command, path = sys.argv[1], Path(sys.argv[2])
source = path.read_text(encoding="utf-8")
if command == "parse":
    print(json.dumps(parse_lessmark(source), indent=2))
elif command == "validate":
    print(json.dumps(validate_source(source), indent=2))
elif command == "format":
    sys.stdout.write(format_lessmark(source))
elif command == "from-markdown":
    sys.stdout.write(from_markdown(source))
elif command == "to-markdown":
    sys.stdout.write(to_markdown(source))
elif command == "info":
    print(json.dumps(get_capabilities(), indent=2))
else:
    raise SystemExit(f"unknown command: {command}")
`;
  const env = { ...process.env, PYTHONPATH: join(root, "packages", "python", "src") };
  const result = spawnSync("python", ["-c", code, command, path], { cwd: root, env, encoding: "utf8" });
  if (result.status !== 0) {
    throw new Error(`python ${command} ${basename(path)} failed: ${result.stderr}`);
  }
  return result.stdout;
}
