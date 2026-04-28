import { parseLessmark } from "./parser.js";
import { validateAst } from "./validate.js";

export function formatLessmark(source) {
  return formatAst(parseLessmark(source));
}

export function formatAst(ast) {
  const errors = validateAst(ast);
  if (errors.length > 0) {
    throw new Error(`Cannot format invalid AST: ${errors.map((error) => error.message).join("; ")}`);
  }
  const chunks = ast.children.map(formatNode);
  return `${chunks.join("\n\n")}\n`;
}

function formatNode(node) {
  if (node.type === "heading") {
    return `${"#".repeat(node.level)} ${node.text.trim()}`;
  }

  if (node.type === "block") {
    if (node.name === "paragraph" && Object.keys(node.attrs).length === 0) {
      return escapeLeadingBlockSigils(stripTrailingWhitespace(String(node.text ?? "")));
    }
    const attrs = Object.keys(node.attrs)
      .sort()
      .map((key) => `${key}="${escapeAttr(node.attrs[key])}"`)
      .join(" ");
    const header = attrs ? `@${node.name} ${attrs}` : `@${node.name}`;
    const text = stripTrailingWhitespace(String(node.text ?? ""));
    const body = isLiteralBlock(node.name) ? text : escapeLeadingBlockSigils(text);
    return body ? `${header}\n${body}` : header;
  }

  throw new Error(`Cannot format unknown AST node type: ${node.type}`);
}

function isLiteralBlock(name) {
  return name === "code" || name === "example" || name === "math" || name === "diagram";
}

function escapeLeadingBlockSigils(text) {
  return String(text)
    .split("\n")
    .map((line) => (line.startsWith("@") || line.startsWith("#") ? `\\${line}` : line))
    .join("\n");
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
