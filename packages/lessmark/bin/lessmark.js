#!/usr/bin/env node
import { readFile, writeFile } from "node:fs/promises";
import { basename } from "node:path";
import { LessmarkError, formatLessmark, parseLessmark, validateSource } from "lessmark";

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
  lessmark format --write file.lmk`);
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
