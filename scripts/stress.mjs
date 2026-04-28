import assert from "node:assert/strict";
import { performance } from "node:perf_hooks";
import { formatLessmark, parseLessmark, renderHtml, validateSource } from "../packages/lessmark/src/index.js";

const blocks = Number.parseInt(process.env.LESSMARK_STRESS_BLOCKS || "1200", 10);

function makeDocument() {
  const parts = ["# Stress Document"];
  for (let i = 0; i < blocks; i += 1) {
    parts.push(`Plain paragraph ${i} with {{strong:stable}} inline syntax and safe text.`);
    parts.push(`@code js\nconst value${i} = ${i};\nconsole.log(value${i});`);
    parts.push(`@decision id="decision-${i}"\nUse option ${i}.`);
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

const startHeap = process.memoryUsage().heapUsed;
const source = makeDocument();
assert.equal(validateSource(source).length, 0);

const parsed = timed("parse", () => parseLessmark(source), 4000);
assert.equal(parsed.value.children.length, 1 + blocks * 4);

const formatted = timed("format", () => formatLessmark(source), 4000);
assert.ok(formatted.value.length > source.length * 0.8);

const rendered = timed("render", () => renderHtml(parsed.value), 4000);
assert.match(rendered.value, /<h1/);

const heapDelta = process.memoryUsage().heapUsed - startHeap;
const maxHeapDelta = 192 * 1024 * 1024;
assert.ok(heapDelta < maxHeapDelta, `heap delta ${(heapDelta / 1024 / 1024).toFixed(1)}MiB, expected < 192MiB`);

console.log(`stress ok: ${blocks} groups, parse ${parsed.duration.toFixed(1)}ms, format ${formatted.duration.toFixed(1)}ms, render ${rendered.duration.toFixed(1)}ms, heap +${(heapDelta / 1024 / 1024).toFixed(1)}MiB`);
