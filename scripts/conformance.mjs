import assert from "node:assert/strict";
import { readdirSync, readFileSync } from "node:fs";
import { basename, dirname, join } from "node:path";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import { formatLessmark, parseLessmark, validateSource } from "../packages/lessmark/src/index.js";

const root = dirname(dirname(fileURLToPath(import.meta.url)));
const validDir = join(root, "fixtures", "valid");
const invalidDir = join(root, "fixtures", "invalid");

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
}

for (const name of readdirSync(invalidDir).filter((file) => file.endsWith(".lmk")).sort()) {
  const path = join(invalidDir, name);
  const source = readFileSync(path, "utf8");
  assert.notEqual(validateSource(source).length, 0, `js rejects ${name}`);
  assert.notEqual(pythonJson("validate", path).length, 0, `python rejects ${name}`);

  const checked = rust(["check", "--json", path], { allowFailure: true });
  assert.notEqual(checked.status, 0, `rust rejects ${name}`);
  assert.notEqual(JSON.parse(checked.stdout).errors.length, 0, `rust check errors ${name}`);
}

console.log("conformance ok");

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
from lessmark import parse_lessmark, validate_source, format_lessmark
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
