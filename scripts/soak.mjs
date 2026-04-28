import assert from "node:assert/strict";
import { performance } from "node:perf_hooks";
import { formatLessmark, parseLessmark, renderHtml, validateSource } from "../packages/lessmark/src/index.js";

const blocks = Number.parseInt(process.env.LESSMARK_SOAK_BLOCKS || "1800", 10);
const repeats = Number.parseInt(process.env.LESSMARK_SOAK_REPEATS || "12", 10);

function makeDocument() {
  const parts = ["# Soak Document"];
  for (let i = 0; i < blocks; i += 1) {
    parts.push(`Plain paragraph ${i} with unicode café Δ${i}, escaped sigils, and {{strong:stable}} inline syntax.\n\\@not-a-block-${i}\n\\#not-a-heading-${i}`);
    parts.push(`@decision id="soak-decision-${i}"\nKeep parse, validate, format, and render deterministic under mixed input ${i}.`);
    parts.push(`@code lang="lessmark"\n@literal-${i}\n# literal heading ${i}\n{{strong:not inline}}`);
    parts.push(`@table columns="Key|Value|Notes"\nname-${i}|value-${i}|pipes stay structural\nempty-${i}||ok`);
    parts.push(`@list kind="${i % 2 === 0 ? "ordered" : "unordered"}"\n- Parent ${i}\n  - Child ${i}\n- Sibling ${i}`);
  }
  return `${parts.join("\n\n")}\n`;
}

function timed(label, fn, maxMs) {
  const start = performance.now();
  const value = fn();
  const duration = performance.now() - start;
  assert.ok(duration < maxMs, `${label} took ${duration.toFixed(1)}ms, expected < ${maxMs}ms`);
  return { value, duration };
}

function assertHostileInputRejected() {
  for (const source of [
    "<script>alert(1)</script>",
    "@summary\n<img src=x onerror=alert(1)>",
    "@link href=\"javascript:alert(1)\"\nunsafe",
    "{{link:bad|javascript:alert(1)}}",
  ]) {
    assert.notEqual(validateSource(source).length, 0, `hostile input unexpectedly passed: ${source}`);
  }
}

assertHostileInputRejected();

const source = makeDocument();
assert.equal(validateSource(source).length, 0);

const startHeap = process.memoryUsage().heapUsed;
const parsed = timed("parse", () => parseLessmark(source), 8000);
assert.equal(parsed.value.children.length, 1 + blocks * 5);

const formatted = timed("format", () => formatLessmark(source), 8000);
assert.equal(validateSource(formatted.value).length, 0);
assert.equal(JSON.stringify(parseLessmark(formatted.value)), JSON.stringify(parseLessmark(formatLessmark(formatted.value))));

const rendered = timed("render", () => renderHtml(parsed.value), 8000);
assert.match(rendered.value, /<h1/);
assert.doesNotMatch(rendered.value, /<script/i);

for (let i = 0; i < repeats; i += 1) {
  const ast = parseLessmark(source);
  assert.equal(validateSource(formatLessmark(source)).length, 0);
  assert.ok(renderHtml(ast).length > source.length * 0.2);
}

const heapDelta = process.memoryUsage().heapUsed - startHeap;
const maxHeapDelta = 256 * 1024 * 1024;
assert.ok(heapDelta < maxHeapDelta, `heap delta ${(heapDelta / 1024 / 1024).toFixed(1)}MiB, expected < 256MiB`);

console.log(`soak ok: ${blocks} groups, ${repeats} repeat passes, parse ${parsed.duration.toFixed(1)}ms, format ${formatted.duration.toFixed(1)}ms, render ${rendered.duration.toFixed(1)}ms, heap +${(heapDelta / 1024 / 1024).toFixed(1)}MiB`);
