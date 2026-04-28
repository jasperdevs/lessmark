import assert from "node:assert/strict";
import { formatLessmark, parseLessmark, renderHtml, validateSource } from "../packages/lessmark/src/index.js";

const iterations = Number.parseInt(process.env.LESSMARK_FUZZ_ITERATIONS || "1000", 10);
let seed = Number.parseInt(process.env.LESSMARK_FUZZ_SEED || "12648430", 10) >>> 0;

function random() {
  seed = (seed * 1664525 + 1013904223) >>> 0;
  return seed / 0x100000000;
}

function pick(values) {
  return values[Math.floor(random() * values.length)];
}

function word() {
  return pick(["lessmark", "agent", "docs", "safe", "parser", "block", "format", "stable"]);
}

function sentence() {
  const length = 3 + Math.floor(random() * 8);
  const words = Array.from({ length }, word);
  words[0] = `${words[0][0].toUpperCase()}${words[0].slice(1)}`;
  return `${words.join(" ")}.`;
}

function inlineText() {
  const plain = sentence();
  return pick([
    plain,
    `${plain} {{strong:${word()}}}`,
    `${plain} {{em:${word()}}}`,
    `${plain} {{code:${word()}-${word()}}}`,
    `${plain} {{link:docs|https://example.com/${word()}}}`
  ]);
}

function validBlock(index) {
  const id = `decision-${index}`;
  return pick([
    () => `# ${sentence()}`,
    () => inlineText(),
    () => `@summary\n${inlineText()}`,
    () => `@decision id="${id}"\n${inlineText()}`,
    () => `@task status="${pick(["todo", "doing", "done", "blocked"])}"\n${inlineText()}`,
    () => `@list kind="${pick(["ordered", "unordered"])}"\n- ${sentence()}\n  - ${sentence()}\n- ${sentence()}`,
    () => `@table columns="Name|Status"\n${word()}|${pick(["todo", "done", "blocked"])}`,
    () => `@code lang="${pick(["js", "py", "rs", "txt"])}"\nconst value = "${word()}";\nconsole.log(value);`,
    () => `@math notation="${pick(["tex", "asciimath"])}"\nE = mc^2`,
    () => `@diagram kind="${pick(["mermaid", "graphviz", "plantuml"])}"\ngraph TD\n  A --> B`,
    () => `@callout kind="${pick(["note", "tip", "warning", "caution"])}"\n${inlineText()}`
  ])();
}

function validDocument(index) {
  const blocks = [];
  const count = 1 + Math.floor(random() * 12);
  for (let i = 0; i < count; i += 1) {
    blocks.push(validBlock(index * 100 + i));
  }
  return `${blocks.join("\n\n")}\n`;
}

const dangerousInputs = [
  "<script>alert(1)</script>\n",
  "@paragraph\n<img src=x onerror=alert(1)>\n",
  "@link href=\"javascript:alert(1)\"\nBad.\n",
  "@image src=\"javascript:alert(1)\" alt=\"bad\"\n",
  "@file path=\"../secret.txt\"\nBad.\n",
  "@page output=\"../public/index.html\"\n",
  "@nav label=\"Bad\" href=\"//evil.example\"\n",
  "@paragraph\n[ref]: https://example.com\n",
  "@paragraph\n> hidden markdown quote\n"
];

for (let i = 0; i < iterations; i += 1) {
  const source = validDocument(i);
  const ast = parseLessmark(source);
  const formatted = formatLessmark(source);
  assert.deepEqual(parseLessmark(formatted), parseLessmark(formatLessmark(formatted)), `format is not stable at iteration ${i}`);
  assert.equal(validateSource(formatted).length, 0, `formatted source should validate at iteration ${i}`);
  assert.doesNotThrow(() => renderHtml(ast), `render failed at iteration ${i}`);
}

for (const source of dangerousInputs) {
  assert.notEqual(validateSource(source).length, 0, `dangerous source unexpectedly validated: ${source}`);
  assert.throws(() => parseLessmark(source), `dangerous source unexpectedly parsed: ${source}`);
}

console.log(`fuzz ok: ${iterations} generated documents plus ${dangerousInputs.length} hostile cases`);
