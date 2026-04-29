import { formatAst } from "./format.js";
import { parseLessmark } from "./parser.js";
import { DECISION_ID_PATTERN, isSafeHref, isSafeResource, splitTableRow } from "./rules.js";

const MAX_INLINE_MARKDOWN_PASSES = 128;

export function fromMarkdown(markdown) {
  const lines = String(markdown).replace(/^\uFEFF/, "").replace(/\r\n?/g, "\n").split("\n");
  const children = [];
  let index = 0;

  while (index < lines.length) {
    const line = lines[index];

    if (line.trim() === "") {
      index += 1;
      continue;
    }

    const heading = /^(#{1,6})\s+(.+?)\s*$/.exec(line);
    if (heading) {
      children.push({ type: "heading", level: heading[1].length, text: plainText(heading[2]) });
      index += 1;
      continue;
    }

    if (isMarkdownSeparator(line)) {
      children.push({ type: "block", name: "separator", attrs: {}, text: "" });
      index += 1;
      continue;
    }

    if (readMathFenceLine(line)) {
      const body = [];
      index += 1;
      while (index < lines.length && !readMathFenceLine(lines[index])) {
        body.push(lines[index]);
        index += 1;
      }
      if (index >= lines.length) {
        throw new Error("Unclosed math block");
      }
      index += 1;
      children.push({ type: "block", name: "math", attrs: { notation: "tex" }, text: body.join("\n") });
      continue;
    }

    const fence = readFenceLine(line);
    if (fence) {
      const body = [];
      index += 1;
      while (index < lines.length && !isClosingFence(lines[index], fence)) {
        body.push(lines[index]);
        index += 1;
      }
      if (index >= lines.length) {
        throw new Error("Unclosed fenced code block");
      }
      index += 1;
      const fenced = fencedCodeNode(fence.lang, body);
      children.push(fenced);
      continue;
    }

    const task = /^\s*[-*]\s+\[([ xX])\]\s+(.+?)\s*$/.exec(line);
    if (task) {
      children.push({
        type: "block",
        name: "task",
        attrs: { status: task[1].toLowerCase() === "x" ? "done" : "todo" },
        text: plainText(task[2])
      });
      index += 1;
      continue;
    }

    const list = readMarkdownList(lines, index);
    if (list) {
      children.push(list.node);
      index = list.nextIndex;
      continue;
    }

    const image = readImageLine(line);
    if (image) {
      if (isSafeResource(image.src)) {
        const attrs = { src: image.src, alt: plainText(image.alt) || "Image" };
        if (image.caption) attrs.caption = plainText(image.caption);
        children.push({ type: "block", name: "image", attrs, text: "" });
      } else {
        children.push({ type: "block", name: "paragraph", attrs: {}, text: plainText(image.alt) });
      }
      index += 1;
      continue;
    }

    const quote = readBlockquote(lines, index);
    if (quote) {
      children.push(quote.node);
      index = quote.nextIndex;
      continue;
    }

    const table = readTable(lines, index);
    if (table) {
      children.push(table.node);
      index = table.nextIndex;
      continue;
    }

    const paragraph = [];
    while (index < lines.length && lines[index].trim() !== "") {
      if (isMarkdownBlockStart(lines, index)) {
        break;
      }
      paragraph.push(lines[index].trim());
      index += 1;
    }

    const rawText = paragraph.join(" ");
    const text = plainText(rawText);
    const link = /^\[([^\]]+)\]\(([^)\s]+)\)$/.exec(rawText);
    if (link && isSafeHref(link[2])) {
      children.push({ type: "block", name: "link", attrs: { href: link[2] }, text: link[1] });
    } else {
      children.push({ type: "block", name: "paragraph", attrs: {}, text });
    }
  }

  return formatAst({ type: "document", children });
}

export function toMarkdown(lessmark) {
  const ast = typeof lessmark === "string" ? parseLessmark(lessmark) : lessmark;
  const footnoteIds = collectFootnoteIds(ast);
  const chunks = ast.children.map((node) => {
    if (node.type === "heading") return `${"#".repeat(node.level)} ${inlineToMarkdown(node.text)}`;
    if (node.type !== "block") return "";

    if (node.name === "summary" || node.name === "paragraph") return inlineToMarkdown(node.text);
    if (node.name === "skill") return "";
    if (node.name === "constraint") return labelledQuoteToMarkdown("Constraint", node.text);
    if (node.name === "decision") return `### ${node.attrs.id}\n\n**Decision:** ${inlineToMarkdown(node.text)}`;
    if (node.name === "task") return `- [${node.attrs.status === "done" ? "x" : " "}] ${inlineToMarkdown(node.text)}`;
    if (node.name === "file") return `**File:** \`${node.attrs.path}\`\n\n${inlineToMarkdown(node.text)}`;
    if (node.name === "api") return `**API:** \`${node.attrs.name}\`\n\n${inlineToMarkdown(node.text)}`;
    if (node.name === "link") return `[${node.text || node.attrs.href}](${node.attrs.href})`;
    if (node.name === "metadata") return `<!-- lessmark:${node.attrs.key}=${node.text} -->`;
    if (node.name === "risk") return labelledQuoteToMarkdown(`Risk (${node.attrs.level})`, node.text);
    if (node.name === "depends-on") return labelledQuoteToMarkdown(`Depends on \`${node.attrs.target}\``, node.text);
    if (node.name === "code") return `\`\`\`${node.attrs.lang ?? ""}\n${node.text}\n\`\`\``;
    if (node.name === "math") return mathToMarkdown(node.attrs.notation, node.text);
    if (node.name === "diagram") return `\`\`\`${node.attrs.kind}\n${node.text}\n\`\`\``;
    if (node.name === "example") return `Example:\n\n${node.text}`;
    if (node.name === "separator") return "---";
    if (node.name === "page" || node.name === "toc") return "";
    if (node.name === "nav") {
      if (!isSafeHref(node.attrs.href)) throw new Error("@nav href must be http, https, mailto, or a safe relative path");
      return `- [${inlineToMarkdown(node.attrs.label)}](${node.attrs.href})`;
    }
    if (node.name === "quote") return quoteToMarkdown(node.text, node.attrs.cite);
    if (node.name === "callout") return calloutToMarkdown(node.attrs.kind, node.attrs.title, node.text);
    if (node.name === "list") return listToMarkdown(node.attrs.kind, node.text);
    if (node.name === "table") return tableToMarkdown(node.attrs.columns, node.text);
    if (node.name === "image") return imageToMarkdown(node.attrs, node.text);
    if (node.name === "footnote") return `[^${node.attrs.id}]: ${inlineToMarkdown(node.text)}`;
    if (node.name === "definition") return `**${inlineToMarkdown(node.attrs.term)}**\n: ${inlineToMarkdown(node.text)}`;
    if (node.name === "reference") {
      const anchor = footnoteIds.has(node.attrs.target) ? `fn-${node.attrs.target}` : node.attrs.target;
      return `[${inlineToMarkdown(node.attrs.label || node.text || node.attrs.target)}](#${anchor})`;
    }
    return node.text;
  });
  return `${chunks.filter(Boolean).join("\n\n")}\n`;
}

function collectFootnoteIds(ast) {
  return new Set(ast.children
    .filter((node) => node.type === "block" && node.name === "footnote")
    .map((node) => node.attrs.id));
}

function fencedCodeNode(lang, body) {
  const text = body.join("\n");
  if (lang === "math" || lang === "tex" || lang === "latex") {
    return { type: "block", name: "math", attrs: { notation: "tex" }, text };
  }
  if (lang === "asciimath") {
    return { type: "block", name: "math", attrs: { notation: "asciimath" }, text };
  }
  if (["mermaid", "graphviz", "plantuml"].includes(lang)) {
    return { type: "block", name: "diagram", attrs: { kind: lang }, text };
  }
  return { type: "block", name: "code", attrs: lang ? { lang } : {}, text };
}

function mathToMarkdown(notation, text) {
  if (notation === "tex") return `$$\n${text}\n$$`;
  return `\`\`\`${notation}\n${text}\n\`\`\``;
}

function inlineToMarkdown(text) {
  let result = String(text);
  assertInlineLocalTargets(result);
  const replacements = [
    [/\{\{strong:([^{}]+)\}\}/g, "**$1**"],
    [/\{\{em:([^{}]+)\}\}/g, "*$1*"],
    [/\{\{code:([^{}]+)\}\}/g, "`$1`"],
    [/\{\{kbd:([^{}]+)\}\}/g, "`$1`"],
    [/\{\{del:([^{}]+)\}\}/g, "~~$1~~"],
    [/\{\{mark:([^{}]+)\}\}/g, "==$1=="],
    [/\{\{sup:([^{}]+)\}\}/g, "^$1^"],
    [/\{\{sub:([^{}]+)\}\}/g, "~$1~"],
    [/\{\{ref:([^{}|]+)\|([^{}]+)\}\}/g, "[$1](#$2)"],
    [/\{\{footnote:([^{}]+)\}\}/g, "[^$1]"],
    [/\{\{link:([^{}|]+)\|([^{}]+)\}\}/g, "[$1]($2)"]
  ];
  for (let pass = 0; pass < MAX_INLINE_MARKDOWN_PASSES; pass += 1) {
    const before = result;
    for (const [pattern, replacement] of replacements) {
      result = result.replace(pattern, replacement);
    }
    if (result === before) return result;
  }
  throw new Error("Inline nesting too deep");
}

function assertInlineLocalTargets(text) {
  for (const match of text.matchAll(/\{\{ref:[^{}|]*\|([^{}]*)\}\}/g)) {
    if (!DECISION_ID_PATTERN.test(match[1])) {
      throw new Error("Inline ref target must be a lowercase slug");
    }
  }
  for (const match of text.matchAll(/\{\{footnote:([^{}]*)\}\}/g)) {
    if (!DECISION_ID_PATTERN.test(match[1])) {
      throw new Error("Inline footnote target must be a lowercase slug");
    }
  }
}

function quoteToMarkdown(text, cite) {
  const quoted = inlineToMarkdown(text)
    .split("\n")
    .map((line) => `> ${line}`)
    .join("\n");
  return cite ? `${quoted}\n>\n> Source: ${inlineToMarkdown(cite)}` : quoted;
}

function labelledQuoteToMarkdown(label, text) {
  const lines = inlineToMarkdown(text).split("\n");
  const [first = "", ...rest] = lines;
  return [`> ${label}: ${first}`, ...rest.map((line) => `> ${line}`)].join("\n");
}

function calloutToMarkdown(kind, title, text) {
  const label = String(kind || "note").toUpperCase();
  const head = title ? `> [!${label}] ${inlineToMarkdown(title)}` : `> [!${label}]`;
  const body = inlineToMarkdown(text)
    .split("\n")
    .map((line) => `> ${line}`)
    .join("\n");
  return `${head}\n${body}`;
}

function listToMarkdown(kind, text) {
  const counters = [];
  return String(text)
    .split("\n")
    .filter((line) => line.trim() !== "")
    .map((line) => {
      const match = /^( *)- (.*)$/.exec(line);
      if (!match) throw new Error("@list items must use one explicit '- ' item marker per line");
      const level = match[1].length / 2;
      counters[level] = (counters[level] || 0) + 1;
      counters.length = level + 1;
      const marker = kind === "ordered" ? `${counters[level]}.` : "-";
      const item = inlineToMarkdown(match[2].trim());
      return `${"  ".repeat(level)}${marker} ${item}`;
    })
    .join("\n");
}

function tableToMarkdown(columns, text) {
  const header = splitTableRow(columns).map(escapeMarkdownTableCell);
  const rows = String(text)
    .split("\n")
    .filter((line) => line.trim() !== "")
    .map((line) => splitTableRow(line).map((cell) => escapeMarkdownTableCell(inlineToMarkdown(cell))));
  const table = [`| ${header.join(" | ")} |`, `| ${header.map(() => "---").join(" | ")} |`];
  for (const row of rows) table.push(`| ${row.join(" | ")} |`);
  return table.join("\n");
}

function escapeMarkdownTableCell(cell) {
  return String(cell).replace(/\|/g, "\\|");
}

function imageToMarkdown(attrs, text) {
  const image = `![${attrs.alt}](${attrs.src})`;
  return attrs.caption || text ? `${image}\n\n${inlineToMarkdown(attrs.caption || text)}` : image;
}

function readImageLine(line) {
  const match = /^!\[([^\]]*)\]\((\S+?)(?:\s+"([^"]*)")?\)\s*$/.exec(line.trim());
  if (!match) return null;
  return { alt: match[1], src: match[2], caption: match[3] || "" };
}

function readBlockquote(lines, startIndex) {
  if (!/^\s*>\s?/.test(lines[startIndex])) return null;
  const quoteLines = [];
  let index = startIndex;
  while (index < lines.length && /^\s*>\s?/.test(lines[index])) {
    quoteLines.push(lines[index].replace(/^\s*>\s?/, ""));
    index += 1;
  }

  const first = quoteLines[0]?.trim() ?? "";
  const callout = /^\[!(NOTE|TIP|WARNING|CAUTION)\]\s*(.*)$/i.exec(first);
  if (callout) {
    const attrs = { kind: callout[1].toLowerCase() };
    if (callout[2].trim()) attrs.title = plainText(callout[2]);
    return {
      nextIndex: index,
      node: {
        type: "block",
        name: "callout",
        attrs,
        text: quoteLines.slice(1).map(plainText).filter(Boolean).join("\n")
      }
    };
  }

  return {
    nextIndex: index,
    node: {
      type: "block",
      name: "quote",
      attrs: {},
      text: quoteLines.map(plainText).filter(Boolean).join("\n")
    }
  };
}

function readMarkdownList(lines, startIndex) {
  const first = readMarkdownListItem(lines[startIndex]);
  if (!first) return null;
  const kind = first.kind;
  const marker = first.marker;
  const items = [];
  let index = startIndex;
  while (index < lines.length) {
    const item = readMarkdownListItem(lines[index]);
    if (!item || item.kind !== kind) break;
    if (item.marker !== marker) {
      throw new Error("Mixed Markdown list markers are not supported by Lessmark import");
    }
    items.push(`${"  ".repeat(item.level)}- ${plainText(item.text)}`);
    index += 1;
  }
  return {
    nextIndex: index,
    node: {
      type: "block",
      name: "list",
      attrs: { kind },
      text: items.join("\n")
    }
  };
}

function readMarkdownListItem(line) {
  const match = /^( *)(?:([-*+])|(\d+[.)]))\s+(.+?)\s*$/.exec(line);
  if (!match) return null;
  return {
    level: Math.floor(match[1].length / 2),
    kind: match[3] ? "ordered" : "unordered",
    marker: match[2] || match[3].replace(/\d+/g, "1"),
    text: match[4]
  };
}

function readTable(lines, startIndex) {
  if (startIndex + 1 >= lines.length) return null;
  const header = splitMarkdownTableRow(lines[startIndex]);
  const separators = splitMarkdownTableRow(lines[startIndex + 1]);
  if (header.length < 1 || header.length !== separators.length || !separators.every(isTableSeparator)) return null;

  const rows = [];
  let index = startIndex + 2;
  while (index < lines.length && lines[index].trim() !== "") {
    const cells = splitMarkdownTableRow(lines[index]);
    if (cells.length !== header.length) break;
    rows.push(cells);
    index += 1;
  }

  const columns = header.map((cell) => escapeLessmarkTableCell(plainText(cell)));
  const body = rows.map((row) => row.map((cell) => escapeLessmarkTableCell(plainText(cell))));
  if (columns.some((cell) => cell === "") || body.some((row) => row.some((cell) => cell === ""))) return null;

  return {
    nextIndex: index,
    node: {
      type: "block",
      name: "table",
      attrs: { columns: columns.join("|") },
      text: body.map((row) => row.join("|")).join("\n")
    }
  };
}

function splitMarkdownTableRow(line) {
  let row = line.trim();
  if (row.startsWith("|")) row = row.slice(1);
  if (row.endsWith("|") && !row.endsWith("\\|")) row = row.slice(0, -1);
  return splitTableRow(row);
}

function isTableSeparator(cell) {
  return /^:?-{3,}:?$/.test(cell.trim());
}

function escapeLessmarkTableCell(cell) {
  return String(cell).replace(/\\/g, "\\\\").replace(/\|/g, "\\|");
}

function isMarkdownBlockStart(lines, index) {
  return /^(#{1,6})\s+/.test(lines[index]) ||
    readFenceLine(lines[index]) !== null ||
    readMathFenceLine(lines[index]) ||
    isMarkdownSeparator(lines[index]) ||
    /^\s*[-*]\s+\[[ xX]\]\s+/.test(lines[index]) ||
    readMarkdownListItem(lines[index]) !== null ||
    readImageLine(lines[index]) !== null ||
    /^\s*>\s?/.test(lines[index]) ||
    readTable(lines, index) !== null;
}

function isMarkdownSeparator(line) {
  return /^(?: {0,3})([-*_])(?:\s*\1){2,}\s*$/.test(line);
}

function readFenceLine(line) {
  const match = /^( {0,3})(`{3,}|~{3,})(.*)$/.exec(line);
  if (!match) return null;
  const marker = match[2];
  const info = match[3].trim();
  if (marker[0] === "`" && info.includes("`")) return null;
  return {
    char: marker[0],
    length: marker.length,
    lang: /^[A-Za-z0-9_.+-]+$/.test(info.split(/\s+/, 1)[0] ?? "") ? info.split(/\s+/, 1)[0] : ""
  };
}

function readMathFenceLine(line) {
  return line.trim() === "$$";
}

function isClosingFence(line, fence) {
  const match = /^( {0,3})(`{3,}|~{3,})\s*$/.exec(line);
  return Boolean(match && match[2][0] === fence.char && match[2].length >= fence.length);
}

function plainText(text) {
  return String(text)
    .replace(/!\[([^\]]*)\]\([^)]+\)/g, "$1")
    .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
    .replace(/[`*_~]/g, "")
    .trim();
}
