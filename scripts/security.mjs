import assert from "node:assert/strict";
import { renderHtml, renderInline, validateSource } from "../packages/lessmark/src/index.js";

const rejectedSources = [
  "<script>alert(1)</script>\n",
  "<IMG SRC=x onerror=alert(1)>\n",
  "@link href=\"javascript:alert(1)\"\nRun.\n",
  "@link href=\"data:text/html,evil\"\nRun.\n",
  "@image src=\"file:///etc/passwd\" alt=\"bad\"\n",
  "@image src=\"//evil.example/x.png\" alt=\"bad\"\n",
  "@file path=\"C:\\\\Users\\\\secret.txt\"\nSecret.\n",
  "@file path=\"../secret.txt\"\nSecret.\n",
  "@page output=\"../index.html\"\n"
];

for (const source of rejectedSources) {
  assert.notEqual(validateSource(source).length, 0, `unsafe source validated: ${source}`);
}

const escaped = renderHtml({
  type: "document",
  children: [
    {
      type: "block",
      name: "code",
      attrs: { lang: "html" },
      text: "<img src=x onerror=alert(1)>"
    }
  ]
});
assert.match(escaped, /&lt;img src=x onerror=alert\(1\)&gt;/);
assert.doesNotMatch(escaped, /<img src=x/);

const titleEscaped = renderHtml({
  type: "document",
  children: [
    { type: "block", name: "page", attrs: { title: "<script>alert(1)</script>" }, text: "" },
    { type: "heading", level: 1, text: "Safe" }
  ]
}, { document: true });
assert.match(titleEscaped, /&lt;script&gt;alert\(1\)&lt;\/script&gt;/);
assert.doesNotMatch(titleEscaped, /<script>alert/);

assert.equal(renderInline("{{link:Safe|https://example.com}}"), '<a href="https://example.com">Safe</a>');
assert.throws(() => renderInline("{{link:Bad|javascript:alert(1)}}"), /executable URL/);

console.log("security ok: unsafe source rejected and HTML output escaped");
