import { highlightCode } from "./highlight.js";
import { parseLessmark } from "./parser.js";
import { DECISION_ID_PATTERN, MAX_INLINE_DEPTH, MAX_LIST_DEPTH, isSafeHref, isSafeResource, splitTableRow } from "./rules.js";

const VOID_BLOCKS = new Set(["metadata", "page", "nav"]);

export function renderHtml(lessmark, options = {}) {
  const ast = typeof lessmark === "string" ? parseLessmark(lessmark) : lessmark;
  const context = { headingIds: assignHeadingIds(ast), footnoteIds: collectFootnoteIds(ast), nav: collectNav(ast) };
  const body = [
    renderNav(context.nav.primary, "Primary"),
    ...ast.children.map((node) => renderNode(node, ast, context)).filter(Boolean),
    renderNav(context.nav.footer, "Footer")
  ].filter(Boolean).join("\n");
  if (options.document === true) {
    const title = options.title ?? documentTitle(ast);
    return htmlDocument(title, body);
  }
  return body ? `${body}\n` : "";
}

function renderNode(node, ast, context) {
  if (node.type === "heading") {
    const level = Math.min(Math.max(node.level, 1), 6);
    return `<h${level} id="${escapeAttr(context.headingIds.get(node) || slugify(node.text))}">${renderInline(node.text)}</h${level}>`;
  }
  if (node.type !== "block" || VOID_BLOCKS.has(node.name)) return "";

  switch (node.name) {
    case "summary":
    case "paragraph":
      return `<p>${renderInline(node.text)}</p>`;
    case "constraint":
      return `<aside class="lessmark-constraint">${renderInline(node.text)}</aside>`;
    case "decision":
      return `<section class="lessmark-decision" id="${escapeAttr(node.attrs.id)}" data-id="${escapeAttr(node.attrs.id)}"><p>${renderInline(node.text)}</p></section>`;
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
      return `<pre><code${node.attrs.lang ? ` class="language-${escapeAttr(node.attrs.lang)}"` : ""}>${highlightCode(node.text, node.attrs.lang)}</code></pre>`;
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
    case "math":
      return `<figure class="lessmark-math" data-notation="${escapeAttr(node.attrs.notation)}"><pre><code class="language-math-${escapeAttr(node.attrs.notation)}">${escapeHtml(node.text)}</code></pre></figure>`;
    case "diagram":
      return `<figure class="lessmark-diagram" data-kind="${escapeAttr(node.attrs.kind)}"><pre><code class="language-${escapeAttr(node.attrs.kind)}">${escapeHtml(node.text)}</code></pre></figure>`;
    case "separator":
      return `<hr class="lessmark-separator">`;
    case "toc":
      return renderToc(ast, context);
    case "footnote":
      return renderFootnote(node);
    case "definition":
      return renderDefinition(node);
    case "reference":
      return renderReference(node, context);
    default:
      return `<p>${renderInline(node.text)}</p>`;
  }
}

function collectNav(ast) {
  const groups = { primary: [], footer: [] };
  for (const node of ast.children) {
    if (node.type !== "block" || node.name !== "nav") continue;
    assertSafeHref(node.attrs.href);
    groups[node.attrs.slot === "footer" ? "footer" : "primary"].push(node);
  }
  return groups;
}

function collectFootnoteIds(ast) {
  return new Set(ast.children
    .filter((node) => node.type === "block" && node.name === "footnote")
    .map((node) => node.attrs.id));
}

function renderNav(items, label) {
  if (items.length === 0) return "";
  const links = items
    .map((item) => `<a href="${escapeAttr(item.attrs.href)}">${renderInline(item.attrs.label)}</a>`)
    .join("");
  return `<nav class="lessmark-nav" aria-label="${escapeAttr(label)}">${links}</nav>`;
}

function renderToc(ast, context) {
  const headings = ast.children.filter((node) => node.type === "heading");
  if (headings.length === 0) return "";
  const items = headings
    .map((heading) => `<li class="level-${heading.level}"><a href="#${escapeAttr(context.headingIds.get(heading) || slugify(heading.text))}">${renderInline(heading.text)}</a></li>`)
    .join("");
  return `<nav class="lessmark-toc"><ol>${items}</ol></nav>`;
}

function assignHeadingIds(ast) {
  const counts = new Map();
  const ids = new WeakMap();
  for (const heading of ast.children.filter((node) => node.type === "heading")) {
    const base = slugify(heading.text);
    const next = (counts.get(base) || 0) + 1;
    counts.set(base, next);
    ids.set(heading, next === 1 ? base : `${base}-${next}`);
  }
  return ids;
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
  const items = parseListItems(node.text);
  if (items.length === 0) return `<${tag}></${tag}>`;
  const state = { index: 0 };
  return renderListLevel(items, tag, 0, state);
}

function parseListItems(text) {
  return String(text)
    .split("\n")
    .filter(Boolean)
    .map((line) => {
      const match = /^( *)- (.*)$/.exec(line);
      if (!match || match[1].length % 2 !== 0 || match[2].trim() === "") {
        throw new Error("@list items must use one explicit '- ' item marker per line");
      }
      return { level: match[1].length / 2, text: match[2].trim() };
    });
}

function renderListLevel(items, tag, level, state) {
  if (level > MAX_LIST_DEPTH) {
    throw new Error("List nesting too deep");
  }
  const rendered = [];
  while (state.index < items.length) {
    const item = items[state.index];
    if (item.level < level) break;
    if (item.level > level) {
      throw new Error("@list nesting cannot skip levels");
    }
    state.index += 1;
    let nested = "";
    if (state.index < items.length && items[state.index].level > level) {
      nested = renderListLevel(items, tag, level + 1, state);
    }
    rendered.push(`<li>${renderInline(item.text)}${nested}</li>`);
  }
  return `<${tag}>${rendered.join("")}</${tag}>`;
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

function renderFootnote(node) {
  const id = node.attrs.id;
  return `<aside class="lessmark-footnote" id="fn-${escapeAttr(id)}"><sup>${escapeHtml(node.attrs.id)}</sup> ${renderInline(node.text)}</aside>`;
}

function renderDefinition(node) {
  return `<dl class="lessmark-definition"><dt>${renderInline(node.attrs.term)}</dt><dd>${renderLinesAsParagraphs(node.text)}</dd></dl>`;
}

function renderReference(node, context) {
  const anchor = context.footnoteIds.has(node.attrs.target) ? `fn-${node.attrs.target}` : node.attrs.target;
  const target = `#${anchor}`;
  const label = node.attrs.label || node.text || node.attrs.target;
  return `<p class="lessmark-reference"><a href="${escapeAttr(target)}">${renderInline(label)}</a></p>`;
}

function renderLinesAsParagraphs(text) {
  return text
    .split(/\n{2,}/)
    .map((part) => part.trim())
    .filter(Boolean)
    .map((part) => `<p>${renderInline(part.replace(/\n/g, " "))}</p>`)
    .join("");
}

export function renderInline(text, depth = 0) {
  if (depth > MAX_INLINE_DEPTH) {
    throw new Error("Inline nesting too deep");
  }
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
    const end = findInlineFunctionEnd(source, start);
    if (end === -1) {
      throw new Error("Unclosed inline function");
    }
    output += renderFunction(source.slice(start + 2, end), depth);
    index = end + 2;
  }
  return output;
}

function findInlineFunctionEnd(source, start) {
  let depth = 1;
  let index = start + 2;
  while (index < source.length) {
    if (source.startsWith("{{", index)) {
      depth += 1;
      index += 2;
      continue;
    }
    if (source.startsWith("}}", index)) {
      depth -= 1;
      if (depth === 0) return index;
      index += 2;
      continue;
    }
    index += 1;
  }
  return -1;
}

function renderFunction(source, depth) {
  const separator = source.indexOf(":");
  if (separator <= 0) throw new Error("Inline functions must use {{name:value}}");
  const name = source.slice(0, separator).trim();
  const value = source.slice(separator + 1);

  if (name === "strong") return `<strong>${renderInline(value, depth + 1)}</strong>`;
  if (name === "em") return `<em>${renderInline(value, depth + 1)}</em>`;
  if (name === "code") return `<code>${escapeHtml(value)}</code>`;
  if (name === "kbd") return `<kbd>${escapeHtml(value)}</kbd>`;
  if (name === "del") return `<del>${renderInline(value, depth + 1)}</del>`;
  if (name === "mark") return `<mark>${renderInline(value, depth + 1)}</mark>`;
  if (name === "sup") return `<sup>${escapeHtml(value)}</sup>`;
  if (name === "sub") return `<sub>${escapeHtml(value)}</sub>`;
  if (name === "ref") {
    const [label, target] = splitInlineRef(value);
    assertLocalTarget(target, "Inline ref target");
    return `<a href="#${escapeAttr(target)}">${renderInline(label, depth + 1)}</a>`;
  }
  if (name === "footnote") {
    assertLocalTarget(value, "Inline footnote target");
    return `<sup><a href="#fn-${escapeAttr(value)}">${escapeHtml(value)}</a></sup>`;
  }
  if (name === "link") {
    const [label, href] = splitOnce(value, "|");
    assertSafeHref(href);
    return `<a href="${escapeAttr(href)}">${renderInline(label, depth + 1)}</a>`;
  }
  throw new Error(`Unknown inline function "${name}"`);
}

function splitInlineRef(value) {
  const index = value.indexOf("|");
  if (index === -1) throw new Error('Expected "|" in inline ref function');
  return [value.slice(0, index), value.slice(index + 1)];
}

function splitOnce(value, delimiter) {
  const index = value.indexOf(delimiter);
  if (index === -1) throw new Error(`Expected "${delimiter}" in inline function`);
  return [value.slice(0, index).trim(), value.slice(index + delimiter.length).trim()];
}

function assertLocalTarget(target, label) {
  if (!DECISION_ID_PATTERN.test(target)) {
    throw new Error(`${label} must be a lowercase slug`);
  }
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
