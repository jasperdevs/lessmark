import { parseLessmark } from "./parser.js";

export function formatLessmark(source) {
  return formatAst(parseLessmark(source));
}

export function formatAst(ast) {
  const chunks = ast.children.map(formatNode);
  return `${chunks.join("\n\n")}\n`;
}

function formatNode(node) {
  if (node.type === "heading") {
    return `${"#".repeat(node.level)} ${node.text.trim()}`;
  }

  if (node.type === "block") {
    const attrs = Object.keys(node.attrs)
      .sort()
      .map((key) => `${key}="${escapeAttr(node.attrs[key])}"`)
      .join(" ");
    const header = attrs ? `@${node.name} ${attrs}` : `@${node.name}`;
    const text = node.text.trim();
    return text ? `${header}\n${stripTrailingWhitespace(text)}` : header;
  }

  throw new Error(`Cannot format unknown AST node type: ${node.type}`);
}

function stripTrailingWhitespace(text) {
  return text
    .replace(/\r\n?/g, "\n")
    .split("\n")
    .map((line) => line.trimEnd())
    .join("\n");
}

function escapeAttr(value) {
  return String(value)
    .replace(/\\/g, "\\\\")
    .replace(/"/g, "\\\"")
    .replace(/\n/g, "\\n")
    .replace(/\t/g, "\\t");
}