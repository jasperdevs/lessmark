import { formatAst } from "./format.js";
import { parseLessmark } from "./parser.js";

export function fromMarkdown(markdown) {
  const lines = String(markdown).replace(/^\uFEFF/, "").replace(/\r\n?/g, "\n").split("\n");
  const children = [];
  let index = 0;
  let firstParagraph = true;

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

    const fence = /^```([A-Za-z0-9_.+-]+)?\s*$/.exec(line);
    if (fence) {
      const body = [];
      index += 1;
      while (index < lines.length && !/^```\s*$/.test(lines[index])) {
        body.push(lines[index]);
        index += 1;
      }
      if (index < lines.length) index += 1;
      children.push({
        type: "block",
        name: "code",
        attrs: fence[1] ? { lang: fence[1] } : {},
        text: body.map(escapeBlockLine).join("\n")
      });
      firstParagraph = false;
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
      firstParagraph = false;
      index += 1;
      continue;
    }

    const paragraph = [];
    while (index < lines.length && lines[index].trim() !== "") {
      if (/^(#{1,6})\s+/.test(lines[index]) || /^```/.test(lines[index]) || /^\s*[-*]\s+\[[ xX]\]\s+/.test(lines[index])) {
        break;
      }
      paragraph.push(lines[index].trim());
      index += 1;
    }

    const rawText = paragraph.join(" ");
    const text = plainText(rawText);
    const link = /^\[([^\]]+)\]\((https?:\/\/[^)\s]+|mailto:[^)\s]+)\)$/.exec(rawText);
    if (link) {
      children.push({ type: "block", name: "link", attrs: { href: link[2] }, text: link[1] });
    } else {
      children.push({ type: "block", name: firstParagraph ? "summary" : "note", attrs: {}, text });
    }
    firstParagraph = false;
  }

  return formatAst({ type: "document", children });
}

export function toMarkdown(lessmark) {
  const ast = typeof lessmark === "string" ? parseLessmark(lessmark) : lessmark;
  const chunks = ast.children.map((node) => {
    if (node.type === "heading") return `${"#".repeat(node.level)} ${node.text}`;
    if (node.type !== "block") return "";

    if (node.name === "summary" || node.name === "note") return node.text;
    if (node.name === "warning") return `> Warning: ${node.text}`;
    if (node.name === "constraint") return `> Constraint: ${node.text}`;
    if (node.name === "decision") return `**Decision ${node.attrs.id}:** ${node.text}`;
    if (node.name === "task") return `- [${node.attrs.status === "done" ? "x" : " "}] ${node.text}`;
    if (node.name === "file") return `**File:** \`${node.attrs.path}\`\n\n${node.text}`;
    if (node.name === "api") return `**API:** \`${node.attrs.name}\`\n\n${node.text}`;
    if (node.name === "link") return `[${node.text || node.attrs.href}](${node.attrs.href})`;
    if (node.name === "metadata") return `<!-- lessmark:${node.attrs.key}=${node.text} -->`;
    if (node.name === "risk") return `> Risk (${node.attrs.level}): ${node.text}`;
    if (node.name === "depends-on") return `> Depends on \`${node.attrs.target}\`: ${node.text}`;
    if (node.name === "code") return `\`\`\`${node.attrs.lang ?? ""}\n${node.text}\n\`\`\``;
    if (node.name === "example") return `Example:\n\n${node.text}`;
    return node.text;
  });
  return `${chunks.filter(Boolean).join("\n\n")}\n`;
}

function escapeBlockLine(line) {
  if (line.startsWith("#") || line.startsWith("@")) return `  ${line}`;
  return line;
}

function plainText(text) {
  return String(text)
    .replace(/!\[([^\]]*)\]\([^)]+\)/g, "$1")
    .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
    .replace(/[`*_~]/g, "")
    .trim();
}
