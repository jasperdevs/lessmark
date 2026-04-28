#!/usr/bin/env node
import { copyFile, mkdir, readdir, readFile, stat, writeFile } from "node:fs/promises";
import { basename, dirname, extname, isAbsolute, join, relative, resolve } from "node:path";
import {
  LessmarkError,
  errorCodeForMessage,
  formatLessmark,
  fromMarkdown,
  getCapabilities,
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

if (!command || command === "help" || command === "--help" || command === "-h") {
  printHelp();
  process.exit(command ? 0 : 1);
}

try {
  if (command === "parse") {
    const file = requireFile(args[1]);
    const source = await readFile(file, "utf8");
    console.log(JSON.stringify(parseLessmark(source), null, 2));
  } else if (command === "check") {
    const json = args.includes("--json");
    const file = requireFile(args.find((arg, index) => index > 0 && arg !== "--json"));
    const source = await readFile(file, "utf8");
    const errors = validateSource(source);
    if (json) {
      console.log(JSON.stringify({ ok: errors.length === 0, errors }, null, 2));
      process.exit(errors.length > 0 ? 1 : 0);
    }
    if (errors.length > 0) {
      for (const error of errors) console.error(`error: ${error.message}`);
      process.exit(1);
    }
    console.log(`${file}: ok`);
  } else if (command === "format" || command === "fix") {
    const write = args.includes("--write");
    const check = args.includes("--check");
    const file = requireFile(args.find((arg, index) => index > 0 && arg !== "--write" && arg !== "--check"));
    const source = await readFile(file, "utf8");
    const formatted = formatLessmark(source);
    if (check) {
      if (formatted !== source) {
        console.error(`${file}: needs formatting`);
        process.exit(1);
      }
      console.log(`${file}: formatted`);
    } else if (write) {
      await writeFile(file, formatted, "utf8");
    } else {
      process.stdout.write(formatted);
    }
  } else if (command === "from-markdown") {
    const file = requireFile(args[1]);
    const source = await readFile(file, "utf8");
    process.stdout.write(fromMarkdown(source));
  } else if (command === "to-markdown") {
    const file = requireFile(args[1]);
    const source = await readFile(file, "utf8");
    process.stdout.write(toMarkdown(source));
  } else if (command === "render") {
    const document = args.includes("--document");
    const file = requireFile(args.find((arg, index) => index > 0 && arg !== "--document"));
    const source = await readFile(file, "utf8");
    process.stdout.write(renderHtml(source, { document }));
  } else if (command === "build") {
    const strict = args.includes("--strict");
    const positional = args.filter((arg, index) => index > 0 && arg !== "--strict");
    const inputDir = requireFile(positional[0]);
    const outputDir = requireFile(positional[1]);
    await buildSite(inputDir, outputDir, { strict });
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
  if (command === "check" && args.includes("--json")) {
    console.log(JSON.stringify({ ok: false, errors: [toJsonError(error)] }, null, 2));
    process.exit(1);
  }
  console.error(`${basename(process.argv[1])}: ${formatError(error)}`);
  process.exit(1);
}

async function buildSite(inputDir, outputDir, options = {}) {
  const inputRoot = resolve(inputDir);
  const outputRoot = resolve(outputDir);
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
  await copyStaticAssets(inputRoot, inputRoot, outputRoot);
  for (const page of pages) {
    const outPath = join(outputRoot, page.relativeOutput);
    await mkdir(dirname(outPath), { recursive: true });
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

async function copyStaticAssets(dir, inputRoot, outputRoot) {
  const entries = await readdir(dir, { withFileTypes: true });
  for (const entry of entries) {
    const path = join(dir, entry.name);
    if (isInsideOrEqual(path, outputRoot)) continue;
    if (entry.isDirectory()) {
      if (shouldSkipStaticDirectory(entry.name)) continue;
      await copyStaticAssets(path, inputRoot, outputRoot);
    } else if (entry.isFile() && isCopyableStaticAsset(path, inputRoot)) {
      const outPath = join(outputRoot, relative(inputRoot, path));
      await mkdir(dirname(outPath), { recursive: true });
      await copyFile(path, outPath);
    }
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

async function listLessmarkFiles(dir, skipRoot) {
  const entries = await readdir(dir, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    const path = join(dir, entry.name);
    if (isInsideOrEqual(path, skipRoot)) continue;
    if (entry.isDirectory()) {
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

function printHelp() {
  console.log(`Lessmark CLI

Usage:
  lessmark parse file.lmk
  lessmark check file.lmk
  lessmark check --json file.lmk
  lessmark format file.lmk
  lessmark format --check file.lmk
  lessmark format --write file.lmk
  lessmark fix --write file.lmk
  lessmark from-markdown README.md
  lessmark to-markdown file.lmk
  lessmark render file.lmk
  lessmark render --document file.lmk
  lessmark build docs out
  lessmark build --strict input out
  lessmark info --json`);
}

function formatError(error) {
  if (error instanceof LessmarkError) {
    return `${error.message} at ${error.line}:${error.column}`;
  }
  return error.message ?? String(error);
}

function toJsonError(error) {
  const message = error instanceof LessmarkError ? error.message : error.message ?? String(error);
  const result = { code: errorCodeForMessage(message), message };
  if (Number.isInteger(error.line)) result.line = error.line;
  if (Number.isInteger(error.column)) result.column = error.column;
  return result;
}
