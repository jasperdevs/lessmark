#!/usr/bin/env node
import { copyFile, mkdir, readdir, readFile, writeFile } from "node:fs/promises";
import { basename, dirname, isAbsolute, join, relative, resolve } from "node:path";
import { LessmarkError, formatLessmark, fromMarkdown, parseLessmark, renderHtml, toMarkdown, validateSource } from "lessmark";

const args = process.argv.slice(2);
const command = args[0];

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
  } else if (command === "format") {
    const write = args.includes("--write");
    const file = requireFile(args.find((arg, index) => index > 0 && arg !== "--write"));
    const source = await readFile(file, "utf8");
    const formatted = formatLessmark(source);
    if (write) {
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
    const inputDir = requireFile(args[1]);
    const outputDir = requireFile(args[2]);
    await buildSite(inputDir, outputDir);
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

async function buildSite(inputDir, outputDir) {
  const inputRoot = resolve(inputDir);
  const outputRoot = resolve(outputDir);
  await copyStaticAssets(inputRoot, inputRoot, outputRoot);
  const files = await listLessmarkFiles(inputRoot, outputRoot);
  for (const file of files) {
    const source = await readFile(file, "utf8");
    const ast = parseLessmark(source);
    const pageOutput = ast.children.find((node) => node.type === "block" && node.name === "page")?.attrs?.output;
    const relativeOutput = pageOutput || relative(inputRoot, file).replace(/\.lmk$|\.lessmark$/i, ".html");
    const outPath = join(outputRoot, relativeOutput);
    await mkdir(dirname(outPath), { recursive: true });
    await writeFile(outPath, renderHtml(ast, { document: true }), "utf8");
  }
}

async function copyStaticAssets(dir, inputRoot, outputRoot) {
  const entries = await readdir(dir, { withFileTypes: true });
  for (const entry of entries) {
    const path = join(dir, entry.name);
    if (isInsideOrEqual(path, outputRoot)) continue;
    if (entry.isDirectory()) {
      await copyStaticAssets(path, inputRoot, outputRoot);
    } else if (entry.isFile() && !/\.(lmk|lessmark)$/i.test(entry.name)) {
      const outPath = join(outputRoot, relative(inputRoot, path));
      await mkdir(dirname(outPath), { recursive: true });
      await copyFile(path, outPath);
    }
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
  lessmark format --write file.lmk
  lessmark from-markdown README.md
  lessmark to-markdown file.lmk
  lessmark render file.lmk
  lessmark render --document file.lmk
  lessmark build docs out`);
}

function formatError(error) {
  if (error instanceof LessmarkError) {
    return `${error.message} at ${error.line}:${error.column}`;
  }
  return error.message ?? String(error);
}

function toJsonError(error) {
  const result = { message: error instanceof LessmarkError ? error.message : error.message ?? String(error) };
  if (Number.isInteger(error.line)) result.line = error.line;
  if (Number.isInteger(error.column)) result.column = error.column;
  return result;
}
