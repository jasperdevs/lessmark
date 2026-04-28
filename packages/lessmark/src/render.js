import { parseLessmark } from "./parser.js";
import { isSafeHref, isSafeResource } from "./rules.js";

const VOID_BLOCKS = new Set(["metadata", "page"]);

export function renderHtml(lessmark, options = {}) {
  const ast = typeof lessmark === "string" ? parseLessmark(lessmark) : lessmark;
  const body = ast.children.map((node) => renderNode(node, ast)).filter(Boolean).join("\n");
  if (options.document === true) {
    const title = options.title ?? documentTitle(ast);
    return htmlDocument(title, body);
  }
  return body ? `${body}\n` : "";
}

function renderNode(node, ast) {
  if (node.type === "heading") {
    const level = Math.min(Math.max(node.level, 1), 6);
    return `<h${level} id="${escapeAttr(slugify(node.text))}">${renderInline(node.text)}</h${level}>`;
  }
  if (node.type !== "block" || VOID_BLOCKS.has(node.name)) return "";

  switch (node.name) {
    case "summary":
    case "paragraph":
    case "note":
      return `<p>${renderInline(node.text)}</p>`;
    case "warning":
      return `<aside class="lessmark-warning">${renderInline(node.text)}</aside>`;
    case "constraint":
      return `<aside class="lessmark-constraint">${renderInline(node.text)}</aside>`;
    case "decision":
      return `<section class="lessmark-decision" data-id="${escapeAttr(node.attrs.id)}"><p>${renderInline(node.text)}</p></section>`;
    case "task":
      return `<p class="lessmark-task" data-status="${escapeAttr(node.attrs.status)}">${node.attrs.status === "done" ? "[x]" : "[ ]"} ${renderInline(node.text)}</p>`;
    case "file":
      return `<p class="lessmark-file"><code>${escapeHtml(node.attrs.path)}</code> ${renderInline(node.text)}</p>`;
    case "api":
      return `<p class="lessmark-api"><code>${escapeHtml(node.attrs.name)}</code> ${renderInline(node.text)}</p>`;
    case "link":
      assertSafeHref(node.attrs.href);
      return `<p><a href="${escapeAttr(node.attrs.href)}">${renderInline(node.text || node.attrs.href)}</a></p>`;
    case "code":
      return `<pre><code${node.attrs.lang ? ` class="language-${escapeAttr(node.attrs.lang)}"` : ""}>${escapeHtml(node.text)}</code></pre>`;
    case "example":
      return `<figure class="lessmark-example"><pre>${escapeHtml(node.text)}</pre></figure>`;
    case "risk":
      return `<aside class="lessmark-risk" data-level="${escapeAttr(node.attrs.level)}">${renderInline(node.text)}</aside>`;
    case "depends-on":
      return `<p class="lessmark-depends-on">Depends on <code>${escapeHtml(node.attrs.target)}</code>: ${renderInline(node.text)}</p>`;
    case "quote":
      return renderQuote(node);
    case "callout":
      return renderCallout(node);
    case "list":
      return renderList(node);
    case "table":
      return renderTable(node);
    case "image":
      return renderImage(node);
    case "toc":
      return renderToc(ast);
    default:
      return `<p>${renderInline(node.text)}</p>`;
  }
}

function renderToc(ast) {
  const headings = ast.children.filter((node) => node.type === "heading");
  if (headings.length === 0) return "";
  const items = headings
    .map((heading) => `<li class="level-${heading.level}"><a href="#${escapeAttr(slugify(heading.text))}">${renderInline(heading.text)}</a></li>`)
    .join("");
  return `<nav class="lessmark-toc"><ol>${items}</ol></nav>`;
}

function renderQuote(node) {
  const cite = node.attrs.cite ? `<cite>${renderInline(node.attrs.cite)}</cite>` : "";
  return `<blockquote>${renderLinesAsParagraphs(node.text)}${cite}</blockquote>`;
}

function renderCallout(node) {
  const title = node.attrs.title ? `<strong>${renderInline(node.attrs.title)}</strong>` : "";
  return `<aside class="lessmark-callout" data-kind="${escapeAttr(node.attrs.kind)}">${title}${renderLinesAsParagraphs(node.text)}</aside>`;
}

function renderList(node) {
  const tag = node.attrs.kind === "ordered" ? "ol" : "ul";
  const items = node.text
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => {
      if (!line.startsWith("- ")) {
        throw new Error("@list items must use one explicit '- ' item marker per line");
      }
      return `<li>${renderInline(line.slice(2).trim())}</li>`;
    });
  return `<${tag}>${items.join("")}</${tag}>`;
}

function renderTable(node) {
  const columns = splitTableRow(node.attrs.columns);
  const rows = node.text
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)
    .map(splitTableRow);
  for (const row of rows) {
    if (row.length !== columns.length) {
      throw new Error("@table row cell count must match columns");
    }
  }
  const head = `<thead><tr>${columns.map((cell) => `<th>${renderInline(cell)}</th>`).join("")}</tr></thead>`;
  const body = `<tbody>${rows.map((row) => `<tr>${row.map((cell) => `<td>${renderInline(cell)}</td>`).join("")}</tr>`).join("")}</tbody>`;
  return `<table>${head}${body}</table>`;
}

function renderImage(node) {
  if (!isSafeResource(node.attrs.src)) {
    throw new Error("@image src must be a safe relative, http, or https URL");
  }
  const caption = node.attrs.caption || node.text;
  return `<figure><img src="${escapeAttr(node.attrs.src)}" alt="${escapeAttr(node.attrs.alt)}">${caption ? `<figcaption>${renderInline(caption)}</figcaption>` : ""}</figure>`;
}

function renderLinesAsParagraphs(text) {
  return text
    .split(/\n{2,}/)
    .map((part) => part.trim())
    .filter(Boolean)
    .map((part) => `<p>${renderInline(part.replace(/\n/g, " "))}</p>`)
    .join("");
}

export function renderInline(text) {
  const source = String(text);
  let output = "";
  let index = 0;
  while (index < source.length) {
    const start = source.indexOf("{{", index);
    if (start === -1) {
      output += escapeHtml(source.slice(index));
      break;
    }
    output += escapeHtml(source.slice(index, start));
    const end = source.indexOf("}}", start + 2);
    if (end === -1) {
      throw new Error("Unclosed inline function");
    }
    output += renderFunction(source.slice(start + 2, end));
    index = end + 2;
  }
  return output;
}

function renderFunction(source) {
  const separator = source.indexOf(":");
  if (separator <= 0) throw new Error("Inline functions must use {{name:value}}");
  const name = source.slice(0, separator).trim();
  const value = source.slice(separator + 1);

  if (name === "strong") return `<strong>${renderInline(value)}</strong>`;
  if (name === "em") return `<em>${renderInline(value)}</em>`;
  if (name === "code") return `<code>${escapeHtml(value)}</code>`;
  if (name === "kbd") return `<kbd>${escapeHtml(value)}</kbd>`;
  if (name === "link") {
    const [label, href] = splitOnce(value, "|");
    assertSafeHref(href);
    return `<a href="${escapeAttr(href)}">${renderInline(label)}</a>`;
  }
  throw new Error(`Unknown inline function "${name}"`);
}

function splitOnce(value, delimiter) {
  const index = value.indexOf(delimiter);
  if (index === -1) throw new Error(`Expected "${delimiter}" in inline function`);
  return [value.slice(0, index).trim(), value.slice(index + delimiter.length).trim()];
}

function splitTableRow(value) {
  const cells = value.split("|").map((cell) => cell.trim());
  if (cells.some((cell) => cell === "")) throw new Error("@table cells cannot be empty");
  return cells;
}

function assertSafeHref(href) {
  if (!isSafeHref(href)) {
    throw new Error("Inline link href must not use an executable URL scheme");
  }
}

function documentTitle(ast) {
  const page = ast.children.find((node) => node.type === "block" && node.name === "page");
  return page?.attrs?.title || ast.children.find((node) => node.type === "heading")?.text || "Lessmark Document";
}

function htmlDocument(title, body) {
  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${escapeHtml(title)}</title>
</head>
<body>
${body}
</body>
</html>
`;
}

function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, (char) => {
    if (char === "&") return "&amp;";
    if (char === "<") return "&lt;";
    if (char === ">") return "&gt;";
    if (char === '"') return "&quot;";
    return "&#39;";
  });
}

function escapeAttr(value) {
  return escapeHtml(value).replace(/`/g, "&#96;");
}

function slugify(text) {
  return String(text)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "") || "section";
}
