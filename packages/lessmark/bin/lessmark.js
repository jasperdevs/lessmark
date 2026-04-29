#!/usr/bin/env node
import { watch } from "node:fs";
import { copyFile, lstat, mkdir, readdir, readFile, realpath, rm, stat, writeFile } from "node:fs/promises";
import { basename, dirname, extname, isAbsolute, join, relative, resolve } from "node:path";
import {
  LessmarkError,
  errorCodeForMessage,
  formatLessmark,
  fromMarkdown,
  getCapabilities,
  hintForCode,
  parseLessmark,
  renderHtml,
  toMarkdown,
  validateSource
} from "lessmark";

const args = process.argv.slice(2);
const command = args[0];
const STATIC_ASSET_ROOTS = new Set(["assets", "public", "static"]);
const STATIC_ASSET_EXTS = new Set([
  ".avif",
  ".css",
  ".gif",
  ".html",
  ".ico",
  ".jpeg",
  ".jpg",
  ".js",
  ".json",
  ".mjs",
  ".otf",
  ".pdf",
  ".png",
  ".svg",
  ".ttf",
  ".txt",
  ".webmanifest",
  ".webp",
  ".woff",
  ".woff2",
  ".xml"
]);
const SKIP_STATIC_DIRS = new Set([".git", ".hg", ".svn", "build", "dist", "node_modules", "out", "target"]);
const SKILL_TARGETS = new Set(["codex", "claude", "both"]);
const SKILL_RESOURCE_DIRS = ["scripts", "references", "assets"];
const INIT_DOCS_TEMPLATE = `# Project docs

@page title="Project docs" output="index.html"

@summary
Replace this with a short description of the project.

## Next steps

@list kind="unordered"
- Run {{code:lessmark check docs}} before committing.
- Run {{code:lessmark format --check docs}} in CI.
- Add decisions, constraints, tasks, and source-file ownership as the project grows.
`;
const INIT_SKILL_TEMPLATE = (name) => `@skill name="${name}" description="Describe what this skill does and when an agent should use it."

Write the main instructions here. Keep this file focused; move long details into references/.

@constraint
Keep changes scoped to the user's request.

@task status="todo"
Replace this starter task with the workflow the agent should follow.
`;

if (!command || command === "help" || command === "--help" || command === "-h") {
  printHelp();
  process.exit(command ? 0 : 1);
}

try {
  if (command === "parse") {
    const positions = args.includes("--positions");
    const file = requireFile(args.find((arg, index) => index > 0 && arg !== "--positions"));
    const source = await readInput(file);
    console.log(JSON.stringify(parseLessmark(source, { sourcePositions: positions }), null, 2));
  } else if (command === "check") {
    const json = args.includes("--json");
    const file = requireFile(args.find((arg, index) => index > 0 && arg !== "--json"));
    const result = await checkTarget(file);
    printCheckResult(result, { json });
    process.exit(result.ok ? 0 : 1);
  } else if (command === "format" || command === "fix") {
    const write = args.includes("--write");
    const check = args.includes("--check");
    const json = args.includes("--json");
    const file = requireFile(args.find((arg, index) => index > 0 && !["--write", "--check", "--json"].includes(arg)));
    const result = await formatTarget(file, { write, check, json });
    printFormatResult(result, { write, check, json });
    if (check) process.exit(result.ok ? 0 : 1);
  } else if (command === "from-markdown") {
    const file = requireFile(args[1]);
    const source = await readInput(file);
    process.stdout.write(fromMarkdown(source));
  } else if (command === "to-markdown") {
    const file = requireFile(args[1]);
    const source = await readInput(file);
    process.stdout.write(toMarkdown(source));
  } else if (command === "render") {
    const document = args.includes("--document");
    const file = requireFile(args.find((arg, index) => index > 0 && arg !== "--document"));
    const source = await readInput(file);
    process.stdout.write(renderHtml(source, { document }));
  } else if (command === "build") {
    const strict = args.includes("--strict");
    const positional = args.filter((arg, index) => index > 0 && arg !== "--strict");
    const inputDir = requireFile(positional[0]);
    const outputDir = requireFile(positional[1]);
    await buildSite(inputDir, outputDir, { strict });
  } else if (command === "init") {
    const targetDir = requireFile(args[1]);
    await initDocs(targetDir);
  } else if (command === "skill") {
    await skillCommand(args.slice(1));
  } else if (command === "info") {
    if (args.includes("--json")) {
      console.log(JSON.stringify(getCapabilities(), null, 2));
    } else {
      const info = getCapabilities();
      console.log(`Lessmark ${info.version}`);
      console.log(`Blocks: ${info.blocks.join(", ")}`);
      console.log(`Inline functions: ${info.inlineFunctions.join(", ")}`);
    }
  } else {
    throw new Error(`Unknown command: ${command}`);
  }
} catch (error) {
  if ((command === "check" || command === "format" || command === "fix") && args.includes("--json")) {
    console.log(JSON.stringify({ ok: false, errors: [toJsonError(error)] }, null, 2));
    process.exit(1);
  }
  console.error(`${basename(process.argv[1])}: ${formatError(error)}`);
  process.exit(1);
}

async function checkTarget(target) {
  const targetInfo = target === "-" ? null : await stat(target);
  const entries = await readSourceEntries(target, targetInfo);
  const files = entries.map((entry) => {
    const errors = validateSource(entry.source);
    return { file: entry.file, ok: errors.length === 0, errors };
  });
  return { ok: files.every((file) => file.ok), files, directory: Boolean(targetInfo?.isDirectory()) };
}

function printCheckResult(result, options = {}) {
  if (options.json) {
    const payload = !result.directory && result.files.length === 1
      ? { ok: result.ok, errors: result.files[0].errors }
      : { ok: result.ok, files: result.files };
    console.log(JSON.stringify(payload, null, 2));
    return;
  }
  for (const file of result.files) {
    if (file.ok) {
      console.log(`${file.file}: ok`);
    } else {
      for (const error of file.errors) {
        const where = Number.isInteger(error.line) ? ` at ${error.line}:${error.column}` : "";
        console.error(`${file.file}: error: ${error.message}${where}`);
      }
    }
  }
}

async function formatTarget(target, options = {}) {
  if (target === "-" && options.write) {
    throw new Error("Cannot use --write with stdin");
  }
  const targetInfo = target === "-" ? null : await stat(target);
  if (targetInfo?.isDirectory() && !options.check && !options.write) {
    throw new Error("Directory formatting requires --check or --write");
  }
  const entries = await readSourceEntries(target, targetInfo);
  const files = [];
  let stdout = "";
  for (const entry of entries) {
    const formatted = formatLessmark(entry.source);
    const changed = formatted !== entry.source;
    if (options.write && changed) {
      await writeFile(entry.file, formatted, "utf8");
    } else if (!options.check && !options.write) {
      stdout += formatted;
    }
    files.push({ file: entry.file, ok: !changed, changed });
  }
  return { ok: files.every((file) => file.ok), files, stdout };
}

function printFormatResult(result, options = {}) {
  if (options.json) {
    console.log(JSON.stringify({ ok: result.ok, files: result.files }, null, 2));
    return;
  }
  if (!options.check && !options.write) {
    process.stdout.write(result.stdout);
    return;
  }
  for (const file of result.files) {
    if (options.check) {
      if (file.changed) console.error(`${file.file}: needs formatting`);
      else console.log(`${file.file}: formatted`);
    } else if (options.write && file.changed) {
      console.log(`${file.file}: formatted`);
    }
  }
}

async function readSourceEntries(target, targetInfo = null) {
  if (target === "-") {
    return [{ file: "<stdin>", source: await readStdin() }];
  }
  const info = targetInfo ?? await stat(target);
  if (info.isDirectory()) {
    const files = await listLessmarkFiles(resolve(target));
    return Promise.all(files.map(async (file) => ({ file, source: await readFile(file, "utf8") })));
  }
  if (!info.isFile()) {
    throw new Error(`${target} is not a file or directory`);
  }
  return [{ file: target, source: await readFile(target, "utf8") }];
}

async function readInput(target) {
  if (target === "-") return readStdin();
  return readFile(target, "utf8");
}

function readStdin() {
  return new Promise((resolve, reject) => {
    let source = "";
    process.stdin.setEncoding("utf8");
    process.stdin.on("data", (chunk) => {
      source += chunk;
    });
    process.stdin.on("end", () => resolve(source));
    process.stdin.on("error", reject);
    process.stdin.resume();
  });
}

async function buildSite(inputDir, outputDir, options = {}) {
  const inputRoot = resolve(inputDir);
  const outputRoot = resolve(outputDir);
  await mkdir(outputRoot, { recursive: true });
  const safeOutputRoot = await realpath(outputRoot);
  const files = await listLessmarkFiles(inputRoot, outputRoot);
  const pages = [];
  for (const file of files) {
    const source = await readFile(file, "utf8");
    const ast = parseLessmark(source);
    const pageOutput = ast.children.find((node) => node.type === "block" && node.name === "page")?.attrs?.output;
    const relativeOutput = pageOutput || relative(inputRoot, file).replace(/\.lmk$|\.lessmark$/i, ".html");
    pages.push({ file, ast, relativeOutput: normalizeRelativePath(relativeOutput) });
  }
  if (options.strict) {
    const errors = await getStrictBuildErrors(inputRoot, outputRoot, pages);
    if (errors.length > 0) {
      const error = new Error(`Strict build failed:\n${errors.map((item) => `- ${item}`).join("\n")}`);
      error.strictBuildErrors = errors;
      throw error;
    }
  }
  await copyStaticAssets(inputRoot, inputRoot, outputRoot, safeOutputRoot);
  for (const page of pages) {
    const outPath = join(outputRoot, page.relativeOutput);
    await mkdir(dirname(outPath), { recursive: true });
    await assertSafeOutputPath(safeOutputRoot, outPath);
    await writeFile(outPath, renderHtml(page.ast, { document: true }), "utf8");
  }
}

async function getStrictBuildErrors(inputRoot, outputRoot, pages) {
  const errors = [];
  const outputs = new Map();
  for (const page of pages) {
    const outputKey = outputCollisionKey(page.relativeOutput);
    if (outputs.has(outputKey)) {
      errors.push(`${page.file}: duplicate @page output "${page.relativeOutput}" also used by ${outputs.get(outputKey)}`);
    } else {
      outputs.set(outputKey, page.file);
    }
  }
  const staticAssets = await listStaticAssets(inputRoot, inputRoot, outputRoot);
  const assetOutputs = new Map();
  for (const asset of staticAssets) {
    const outputKey = outputCollisionKey(asset.relativeOutput);
    if (outputs.has(outputKey)) {
      errors.push(`${asset.file}: static asset output "${asset.relativeOutput}" conflicts with generated page ${outputs.get(outputKey)}`);
    }
    if (assetOutputs.has(outputKey)) {
      errors.push(`${asset.file}: duplicate static asset output "${asset.relativeOutput}" also used by ${assetOutputs.get(outputKey)}`);
    } else {
      assetOutputs.set(outputKey, asset.file);
    }
  }

  for (const page of pages) {
    const sourceDir = dirname(page.file);
    try {
      renderHtml(page.ast, { document: true });
    } catch (error) {
      errors.push(`${page.file}: render failed: ${error.message ?? String(error)}`);
    }
    for (const node of page.ast.children) {
      if (node.type !== "block") continue;
      if (node.name === "image") {
        await checkAsset(inputRoot, sourceDir, page.file, node.attrs.src, "@image src", errors);
      }
      if (node.name === "nav") {
        await checkBuildHref(page.file, node.attrs.href, "@nav href", outputs, inputRoot, errors, { pageOnly: true });
      }
      if (node.name === "link") {
        await checkBuildHref(page.file, node.attrs.href, "@link href", outputs, inputRoot, errors);
      }
    }
  }
  return errors;
}

async function checkAsset(inputRoot, sourceDir, file, value, label, errors) {
  if (isExternalHref(value)) return;
  const pathPart = stripTargetSuffix(value);
  if (!pathPart) return;
  const assetPath = resolve(sourceDir, pathPart);
  if (!isInsideOrEqual(assetPath, inputRoot)) {
    errors.push(`${file}: ${label} "${value}" points outside the input directory`);
    return;
  }
  try {
    const info = await stat(assetPath);
    if (!info.isFile()) errors.push(`${file}: ${label} "${value}" is not a file`);
    pushNonPublicStaticAssetError(assetPath, inputRoot, file, label, value, errors);
  } catch {
    errors.push(`${file}: ${label} "${value}" does not exist`);
  }
}

async function checkBuildHref(file, value, label, outputs, inputRoot, errors, options = {}) {
  if (isExternalHref(value)) return;
  const pathPart = stripTargetSuffix(value);
  if (!pathPart) return;
  const normalized = normalizeRelativePath(pathPart);
  if (normalized.startsWith("../") || isAbsolute(normalized)) {
    errors.push(`${file}: ${label} "${value}" points outside the built site`);
    return;
  }
  if (extname(normalized).toLowerCase() === ".html") {
    if (!outputs.has(outputCollisionKey(normalized))) errors.push(`${file}: ${label} "${value}" has no built page target`);
    return;
  }
  if (options.pageOnly) {
    errors.push(`${file}: ${label} "${value}" must point to a built .html page`);
    return;
  }
  const assetPath = resolve(inputRoot, normalized);
  if (!isInsideOrEqual(assetPath, inputRoot)) {
    errors.push(`${file}: ${label} "${value}" points outside the input directory`);
    return;
  }
  try {
    const info = await stat(assetPath);
    if (!info.isFile()) errors.push(`${file}: ${label} "${value}" is not a file`);
    pushNonPublicStaticAssetError(assetPath, inputRoot, file, label, value, errors);
  } catch {
    errors.push(`${file}: ${label} "${value}" does not exist`);
  }
}

function isExternalHref(value) {
  return /^(https?|mailto):/i.test(String(value));
}

function stripTargetSuffix(value) {
  return String(value).split(/[?#]/, 1)[0];
}

function normalizeRelativePath(path) {
  return String(path).replace(/\\/g, "/").replace(/^\.\//, "");
}

function outputCollisionKey(path) {
  return normalizeRelativePath(path).toLowerCase();
}

async function copyStaticAssets(dir, inputRoot, outputRoot, safeOutputRoot) {
  const entries = await readdir(dir, { withFileTypes: true });
  for (const entry of entries) {
    const path = join(dir, entry.name);
    if (isInsideOrEqual(path, outputRoot)) continue;
    if (entry.isDirectory()) {
      if (shouldSkipStaticDirectory(entry.name)) continue;
      await copyStaticAssets(path, inputRoot, outputRoot, safeOutputRoot);
    } else if (entry.isFile() && isCopyableStaticAsset(path, inputRoot)) {
      const outPath = join(outputRoot, relative(inputRoot, path));
      await mkdir(dirname(outPath), { recursive: true });
      await assertSafeOutputPath(safeOutputRoot, outPath);
      await copyFile(path, outPath);
    }
  }
}

async function assertSafeOutputPath(outputRoot, outPath) {
  const parent = await realpath(dirname(outPath));
  if (!isInsideOrEqual(parent, outputRoot)) {
    throw new Error(`Refusing to write through symlinked output path: ${outPath}`);
  }
  const existing = await lstat(outPath).catch((error) => {
    if (error?.code === "ENOENT") return null;
    throw error;
  });
  if (existing?.isSymbolicLink()) {
    throw new Error(`Refusing to overwrite symlinked output path: ${outPath}`);
  }
}

async function listStaticAssets(dir, inputRoot, skipRoot) {
  const entries = await readdir(dir, { withFileTypes: true });
  const assets = [];
  for (const entry of entries) {
    const path = join(dir, entry.name);
    if (isInsideOrEqual(path, skipRoot)) continue;
    if (entry.isDirectory()) {
      if (shouldSkipStaticDirectory(entry.name)) continue;
      assets.push(...await listStaticAssets(path, inputRoot, skipRoot));
    } else if (entry.isFile() && isCopyableStaticAsset(path, inputRoot)) {
      assets.push({ file: path, relativeOutput: normalizeRelativePath(relative(inputRoot, path)) });
    }
  }
  return assets.sort((left, right) => left.relativeOutput.localeCompare(right.relativeOutput));
}

function shouldSkipStaticDirectory(name) {
  return name.startsWith(".") || SKIP_STATIC_DIRS.has(name);
}

function isCopyableStaticAsset(path, inputRoot) {
  const rel = normalizeRelativePath(relative(inputRoot, path));
  const [rootSegment] = rel.split("/");
  return STATIC_ASSET_ROOTS.has(rootSegment) && STATIC_ASSET_EXTS.has(extname(path).toLowerCase());
}

function pushNonPublicStaticAssetError(path, inputRoot, file, label, value, errors) {
  if (!isCopyableStaticAsset(path, inputRoot)) {
    errors.push(`${file}: ${label} "${value}" must point to a public asset under assets/, public/, or static/`);
  }
}

async function listLessmarkFiles(dir, skipRoot = null) {
  const entries = (await readdir(dir, { withFileTypes: true })).sort((a, b) => a.name.localeCompare(b.name));
  const files = [];
  for (const entry of entries) {
    const path = join(dir, entry.name);
    if (skipRoot && isInsideOrEqual(path, skipRoot)) continue;
    if (entry.isDirectory()) {
      if (shouldSkipStaticDirectory(entry.name)) continue;
      files.push(...await listLessmarkFiles(path, skipRoot));
    } else if (entry.isFile() && /\.(lmk|lessmark)$/i.test(entry.name)) {
      files.push(path);
    }
  }
  return files.sort();
}

function isInsideOrEqual(path, root) {
  const relativePath = relative(root, path);
  return relativePath === "" || (!relativePath.startsWith("..") && !isAbsolute(relativePath));
}

function requireFile(file) {
  if (!file) {
    throw new Error(`Usage: lessmark ${command} file.lmk`);
  }
  return file;
}

async function initDocs(targetDir) {
  const target = join(targetDir, "index.lmk");
  try {
    await stat(target);
    throw new Error(`${target} already exists`);
  } catch (error) {
    if (error.code !== "ENOENT") throw error;
  }
  await mkdir(targetDir, { recursive: true });
  await writeFile(target, INIT_DOCS_TEMPLATE, "utf8");
  console.log(`created ${target}`);
}

async function skillCommand(args) {
  const subcommand = args[0];
  if (!subcommand || subcommand === "help" || subcommand === "--help" || subcommand === "-h") {
    printSkillHelp();
    return;
  }
  if (subcommand === "init") {
    await skillInit(requireFile(args[1]));
    return;
  }
  if (subcommand === "check") {
    const result = await checkSkill(requireFile(args[1]));
    console.log(`${result.source.file}: ok`);
    return;
  }
  if (subcommand === "build") {
    const result = await buildSkill(requireFile(args[1]), skillOptions(args.slice(2)));
    for (const file of result.files) console.log(`created ${file}`);
    return;
  }
  if (subcommand === "import") {
    await importSkill(requireFile(args[1]), skillOptions(args.slice(2)));
    return;
  }
  if (subcommand === "install") {
    const result = await installSkill(requireFile(args[1]), skillOptions(args.slice(2)));
    for (const file of result.files) console.log(`installed ${file}`);
    return;
  }
  if (subcommand === "dev") {
    await devSkill(requireFile(args[1]), skillOptions(args.slice(2)));
    return;
  }
  throw new Error(`Unknown skill command: ${subcommand}`);
}

function skillOptions(args) {
  const option = (name) => {
    const index = args.indexOf(name);
    return index === -1 ? undefined : args[index + 1];
  };
  return {
    out: option("--out"),
    target: option("--target") || "both",
    repo: option("--repo") || process.cwd(),
    once: args.includes("--once")
  };
}

async function skillInit(targetDir) {
  const root = resolve(targetDir);
  const name = basename(root);
  assertSkillName(name);
  const target = join(root, "skill.lmk");
  if (await exists(target)) throw new Error(`${target} already exists`);
  await mkdir(root, { recursive: true });
  await mkdir(join(root, "references"), { recursive: true });
  await mkdir(join(root, "scripts"), { recursive: true });
  await writeFile(target, INIT_SKILL_TEMPLATE(name), "utf8");
  console.log(`created ${target}`);
}

async function checkSkill(input) {
  const sourceInfo = await readSkillSource(input);
  const skill = parseSkillSource(sourceInfo.source, sourceInfo);
  await assertReferencedSkillFiles(skill, sourceInfo.root);
  return { source: sourceInfo, root: sourceInfo.root, skill };
}

async function buildSkill(input, options = {}) {
  const { skill, source, root } = await checkSkill(input);
  const targets = targetList(options.target);
  const files = [];
  for (const target of targets) {
    const outDir = resolve(options.out ? (targets.length > 1 ? join(options.out, target) : options.out) : join(root, "build", target));
    const outFile = join(outDir, "SKILL.md");
    await writeSkillOutput({ skill, source, root, outDir, outFile });
    files.push(outFile);
  }
  return { files };
}

async function importSkill(input, options = {}) {
  const markdown = await readFile(input, "utf8");
  const imported = skillFromMarkdown(markdown);
  const out = resolve(options.out || join(dirname(input), "skill.lmk"));
  if (await exists(out)) throw new Error(`${out} already exists`);
  await mkdir(dirname(out), { recursive: true });
  await writeFile(out, imported, "utf8");
  console.log(`created ${out}`);
}

async function installSkill(input, options = {}) {
  const { skill, source, root } = await checkSkill(input);
  const repo = resolve(options.repo || process.cwd());
  const files = [];
  for (const target of targetList(options.target)) {
    const installRoot = target === "codex"
      ? join(repo, ".agents", "skills", skill.attrs.name)
      : join(repo, ".claude", "skills", skill.attrs.name);
    await writeSkillOutput({ skill, source, root, outDir: installRoot, outFile: join(installRoot, "SKILL.md") });
    files.push(join(installRoot, "SKILL.md"));
  }
  return { files };
}

async function devSkill(input, options = {}) {
  await buildSkill(input, options);
  if (options.once) return;
  const sourceInfo = await readSkillSource(input);
  console.log(`watching ${sourceInfo.root}`);
  let timer;
  const watcher = watch(sourceInfo.root, { recursive: true }, () => {
    clearTimeout(timer);
    timer = setTimeout(async () => {
      try {
        await buildSkill(input, options);
        console.log("rebuilt skill");
      } catch (error) {
        console.error(`skill dev: ${formatError(error)}`);
      }
    }, 100);
  });
  process.on("SIGINT", () => {
    watcher.close();
    process.exit(0);
  });
}

async function writeSkillOutput({ skill, source, root, outDir, outFile }) {
  await rm(outDir, { recursive: true, force: true });
  await mkdir(outDir, { recursive: true });
  await writeFile(outFile, skillMarkdown(skill, source), "utf8");
  for (const dir of SKILL_RESOURCE_DIRS) {
    const from = join(root, dir);
    if (await exists(from)) await copyDir(from, join(outDir, dir));
  }
}

async function readSkillSource(input) {
  const resolved = resolve(input);
  const info = await stat(resolved);
  if (info.isDirectory()) {
    const file = join(resolved, "skill.lmk");
    if (await exists(file)) return { root: resolved, file, source: await readFile(file, "utf8") };
    throw new Error(`${resolved} does not contain skill.lmk`);
  }
  return { root: dirname(resolved), file: resolved, source: await readFile(resolved, "utf8") };
}

function parseSkillSource(source, sourceInfo) {
  const errors = validateSource(source);
  if (errors.length > 0) {
    throw new Error(errors.map((error) => `${error.message}${error.line ? ` at ${error.line}:${error.column}` : ""}`).join("; "));
  }
  const ast = parseLessmark(source);
  const skillBlocks = ast.children.filter((node) => node.type === "block" && node.name === "skill");
  if (skillBlocks.length !== 1) throw new Error("Skill source must contain exactly one @skill block");
  const skill = skillBlocks[0];
  assertSkillName(skill.attrs.name);
  return { attrs: skill.attrs, ast };
}

function skillMarkdown(skill, source) {
  const children = [];
  for (const node of skill.ast.children) {
    if (node.type === "block" && node.name === "skill") {
      const text = String(node.text || "").trim();
      if (text) children.push({ type: "block", name: "paragraph", attrs: {}, text });
    } else {
      children.push(node);
    }
  }
  const bodyAst = {
    type: "document",
    children
  };
  const frontmatter = [
    "---",
    `name: ${yamlString(skill.attrs.name)}`,
    `description: ${yamlString(skill.attrs.description)}`
  ];
  for (const key of ["license", "compatibility", "allowed-tools"]) {
    if (skill.attrs[key]) frontmatter.push(`${key}: ${yamlString(skill.attrs[key])}`);
  }
  frontmatter.push("---", "", `<!-- Generated from ${basename(source.file)}. Edit the Lessmark source, then run lessmark skill build. -->`, "");
  return `${frontmatter.join("\n")}${toMarkdown(bodyAst)}`;
}

function skillFromMarkdown(markdown) {
  const source = String(markdown).replace(/^\uFEFF/, "").replace(/\r\n?/g, "\n");
  const match = /^---\n([\s\S]*?)\n---\n?([\s\S]*)$/.exec(source);
  if (!match) throw new Error("SKILL.md must start with YAML frontmatter");
  const attrs = readSkillFrontmatter(match[1]);
  const body = match[2].replace(/<!-- Generated from .*? -->\n*/g, "");
  const header = `@skill${Object.entries(attrs).map(([key, value]) => ` ${key}="${escapeSkillAttr(value)}"`).join("")}`;
  return `${header}\n\n${skillBodyFromMarkdown(body)}`;
}

function skillBodyFromMarkdown(markdown) {
  const lines = String(markdown).replace(/^\uFEFF/, "").replace(/\r\n?/g, "\n").split("\n");
  const chunks = [];
  let index = 0;
  while (index < lines.length) {
    if (lines[index].trim() === "") {
      index += 1;
      continue;
    }

    const metadata = /^<!--\s*lessmark:([a-z][a-z0-9]*(?:[._-][a-z0-9]+)*)=(.*?)\s*-->\s*$/.exec(lines[index].trim());
    if (metadata) {
      chunks.push(`@metadata key="${escapeSkillAttr(metadata[1])}"\n${markdownText(metadata[2])}`);
      index += 1;
      continue;
    }

    const quote = readSkillQuote(lines, index);
    if (quote) {
      chunks.push(quote.chunk);
      index = quote.nextIndex;
      continue;
    }

    const decision = readSkillDecision(lines, index);
    if (decision) {
      chunks.push(decision.chunk);
      index = decision.nextIndex;
      continue;
    }

    const labelled = readSkillLabelledBlock(lines, index);
    if (labelled) {
      chunks.push(labelled.chunk);
      index = labelled.nextIndex;
      continue;
    }

    const generic = [];
    while (index < lines.length && lines[index].trim() !== "") {
      generic.push(lines[index]);
      index += 1;
    }
    const converted = fromMarkdown(generic.join("\n")).trim();
    if (converted) chunks.push(converted);
  }
  return `${chunks.join("\n\n")}\n`;
}

function readSkillQuote(lines, index) {
  if (!/^\s*>\s?/.test(lines[index])) return null;
  const quoted = [];
  while (index < lines.length && /^\s*>\s?/.test(lines[index])) {
    quoted.push(lines[index].replace(/^\s*>\s?/, ""));
    index += 1;
  }
  while (index < lines.length && lines[index].trim() !== "") {
    quoted.push(lines[index]);
    index += 1;
  }
  const first = quoted[0]?.trim() || "";
  const constraint = /^Constraint:\s*(.*)$/.exec(first);
  if (constraint) return { nextIndex: index, chunk: `@constraint\n${quoteText([constraint[1], ...quoted.slice(1)])}` };
  const risk = /^Risk \((low|medium|high|critical)\):\s*(.*)$/.exec(first);
  if (risk) return { nextIndex: index, chunk: `@risk level="${risk[1]}"\n${quoteText([risk[2], ...quoted.slice(1)])}` };
  const dependsOn = /^Depends on `([^`]+)`:\s*(.*)$/.exec(first);
  if (dependsOn) return { nextIndex: index, chunk: `@depends-on target="${escapeSkillAttr(dependsOn[1])}"\n${quoteText([dependsOn[2], ...quoted.slice(1)])}` };
  return null;
}

function readSkillDecision(lines, index) {
  const heading = /^###\s+([a-z0-9]+(?:-[a-z0-9]+)*)\s*$/.exec(lines[index]);
  if (!heading) return null;
  let next = index + 1;
  while (next < lines.length && lines[next].trim() === "") next += 1;
  const decision = /^\*\*Decision:\*\*\s*(.*)$/.exec(lines[next] || "");
  if (!decision) return null;
  const body = [decision[1]];
  next += 1;
  while (next < lines.length && lines[next].trim() !== "") {
    body.push(lines[next]);
    next += 1;
  }
  return { nextIndex: next, chunk: `@decision id="${heading[1]}"\n${body.map(markdownText).join("\n")}` };
}

function readSkillLabelledBlock(lines, index) {
  const label = /^\*\*(File|API):\*\*\s+`([^`]+)`\s*$/.exec(lines[index]);
  if (!label) return null;
  let next = index + 1;
  while (next < lines.length && lines[next].trim() === "") next += 1;
  const body = [];
  while (next < lines.length && lines[next].trim() !== "") {
    body.push(lines[next]);
    next += 1;
  }
  const blockName = label[1] === "File" ? "file" : "api";
  const attrName = label[1] === "File" ? "path" : "name";
  return {
    nextIndex: next,
    chunk: `@${blockName} ${attrName}="${escapeSkillAttr(label[2])}"\n${body.map(markdownText).join("\n")}`
  };
}

function quoteText(lines) {
  return lines.map(markdownText).filter(Boolean).join("\n");
}

function markdownText(text) {
  return markdownInlineToLessmark(text).trim();
}

function markdownInlineToLessmark(text) {
  return String(text)
    .replace(/!\[([^\]]*)\]\([^)]+\)/g, "$1")
    .replace(/\[([^\]\n]+)\]\(([^)\s]+)\)/g, (_match, label, href) => `{{link:${label}|${href}}}`)
    .replace(/`([^`\n]+)`/g, (_match, value) => `{{code:${value}}}`)
    .replace(/\*\*([^*\n]+)\*\*/g, (_match, value) => `{{strong:${value}}}`)
    .replace(/\*([^*\n]+)\*/g, (_match, value) => `{{em:${value}}}`)
    .replace(/~~([^~\n]+)~~/g, (_match, value) => `{{del:${value}}}`);
}

function readSkillFrontmatter(frontmatter) {
  const attrs = {};
  for (const line of frontmatter.split("\n")) {
    const match = /^([A-Za-z][A-Za-z0-9-]*):\s*(.*)$/.exec(line.trim());
    if (!match) continue;
    const key = match[1];
    if (["name", "description", "license", "compatibility", "allowed-tools"].includes(key)) {
      attrs[key] = unquoteYamlString(match[2]);
    }
  }
  if (!attrs.name || !attrs.description) throw new Error("SKILL.md frontmatter requires name and description");
  assertSkillName(attrs.name);
  return attrs;
}

async function assertReferencedSkillFiles(skill, root) {
  for (const node of skill.ast.children) {
    if (node.type !== "block" || node.name !== "file") continue;
    const path = node.attrs.path;
    if (!SKILL_RESOURCE_DIRS.some((dir) => path === dir || path.startsWith(`${dir}/`))) continue;
    if (!(await exists(join(root, path)))) throw new Error(`Referenced skill file does not exist: ${path}`);
  }
}

function targetList(target) {
  if (!SKILL_TARGETS.has(target)) throw new Error("--target must be codex, claude, or both");
  return target === "both" ? ["codex", "claude"] : [target];
}

async function copyDir(from, to) {
  await mkdir(to, { recursive: true });
  for (const entry of await readdir(from, { withFileTypes: true })) {
    const source = join(from, entry.name);
    const target = join(to, entry.name);
    if (entry.isDirectory()) {
      await copyDir(source, target);
    } else if (entry.isFile()) {
      await copyFile(source, target);
    }
  }
}

async function exists(path) {
  try {
    await stat(path);
    return true;
  } catch (error) {
    if (error.code === "ENOENT") return false;
    throw error;
  }
}

function assertSkillName(name) {
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(name) || name.length > 64 || name.includes("--")) {
    throw new Error("Skill name must be 1-64 lowercase letters, numbers, and single hyphens");
  }
}

function yamlString(value) {
  return JSON.stringify(String(value));
}

function unquoteYamlString(value) {
  const trimmed = String(value).trim();
  if ((trimmed.startsWith("\"") && trimmed.endsWith("\"")) || (trimmed.startsWith("'") && trimmed.endsWith("'"))) {
    return trimmed.slice(1, -1).replace(/\\"/g, "\"");
  }
  return trimmed;
}

function escapeSkillAttr(value) {
  return String(value).replace(/\\/g, "\\\\").replace(/"/g, "\\\"");
}

function printHelp() {
  console.log(`Lessmark CLI

Usage:
  lessmark parse file.lmk
  lessmark parse --positions file.lmk
  lessmark parse -
  lessmark check file.lmk
  lessmark check docs
  lessmark check --json file.lmk
  lessmark format file.lmk
  lessmark format --check file.lmk
  lessmark format --check --json docs
  lessmark format --write file.lmk
  lessmark fix --write file.lmk
  lessmark fix --write docs
  lessmark from-markdown README.md
  lessmark from-markdown -
  lessmark to-markdown file.lmk
  lessmark to-markdown -
  lessmark render file.lmk
  lessmark render --document file.lmk
  lessmark render --document -
  lessmark build docs out
  lessmark build --strict input out
  lessmark init docs
  lessmark skill init code-review
  lessmark skill check code-review
  lessmark skill build code-review --target both
  lessmark skill import code-review/SKILL.md --out code-review/skill.lmk
  lessmark skill install code-review --target codex
  lessmark skill dev code-review
  lessmark info --json`);
}

function printSkillHelp() {
  console.log(`Lessmark skill commands

Usage:
  lessmark skill init <skill-dir>
  lessmark skill check <skill-dir|skill.lmk>
  lessmark skill build <skill-dir|skill.lmk> [--target codex|claude|both] [--out dir]
  lessmark skill import <SKILL.md> [--out skill.lmk]
  lessmark skill install <skill-dir|skill.lmk> [--target codex|claude|both] [--repo dir]
  lessmark skill dev <skill-dir|skill.lmk> [--target codex|claude|both] [--once]`);
}

function formatError(error) {
  if (error instanceof LessmarkError) {
    return `${error.message} at ${error.line}:${error.column}`;
  }
  return error.message ?? String(error);
}

function toJsonError(error) {
  const message = error instanceof LessmarkError ? error.message : error.message ?? String(error);
  const code = errorCodeForMessage(message);
  const result = { code, message, hint: hintForCode(code) };
  if (Number.isInteger(error.line)) result.line = error.line;
  if (Number.isInteger(error.column)) result.column = error.column;
  return result;
}
