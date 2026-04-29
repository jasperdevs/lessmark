"use strict";

const childProcess = require("node:child_process");
const vscode = require("vscode");

const diagnosticCollection = vscode.languages.createDiagnosticCollection("lessmark");
const BLOCK_DOCS = new Map([
  ["summary", "Document summary. Body is plain inline text."],
  ["decision", "Decision block. Required: id=\"lowercase-slug\". The id becomes a local reference target."],
  ["constraint", "Constraint body. Use for rules the document must preserve."],
  ["task", "Task block. Required: status=\"todo|doing|done|blocked\"."],
  ["file", "File block. Required: path. Body describes or annotates that file."],
  ["risk", "Risk block. Required: level=\"low|medium|high|critical\"."],
  ["depends-on", "Dependency block. Required: target=\"decision-id\"."],
  ["code", "Literal code block. Optional: lang=\"js\". Inline syntax is not parsed inside the body."],
  ["example", "Literal example block. Inline syntax is not parsed inside the body."],
  ["list", "List block. Required: kind=\"unordered|ordered\". Body uses one '- ' marker per item; nest with two spaces."],
  ["table", "Table block. Required: columns=\"Name|Value\". Body rows must match the column count."],
  ["image", "Image block. Required: src and alt. Optional: caption."],
  ["math", "Math block. Required: notation=\"tex|asciimath\". Body is literal."],
  ["diagram", "Diagram block. Required: kind=\"mermaid|graphviz|plantuml\". Body is literal."],
  ["footnote", "Footnote block. Required: id=\"lowercase-slug\". Can be referenced with {{footnote:id}}."],
  ["reference", "Reference block. Required: target=\"local-anchor\". Target must resolve."],
  ["link", "Standalone link block. Required: href. Body is the label."],
  ["callout", "Callout block. Required: kind=\"note|tip|warning|caution\". Optional: title."],
  ["quote", "Quote block. Optional: cite."],
  ["definition", "Definition block. Required: term."],
  ["metadata", "Metadata block. Required: key."],
  ["page", "Page metadata. Optional: title, output. Body is not allowed."],
  ["nav", "Navigation block. Required: label, href. Body is not allowed."],
  ["api", "API block. Required: name."],
  ["separator", "Separator block. No attributes or body."],
  ["toc", "Table of contents marker. No body."]
]);
const INLINE_DOCS = new Map([
  ["strong", "{{strong:text}} makes text strong."],
  ["em", "{{em:text}} emphasizes text."],
  ["code", "{{code:text}} marks inline code."],
  ["kbd", "{{kbd:key}} marks keyboard input."],
  ["del", "{{del:text}} marks deleted text."],
  ["mark", "{{mark:text}} highlights text."],
  ["sup", "{{sup:text}} marks superscript text."],
  ["sub", "{{sub:text}} marks subscript text."],
  ["ref", "{{ref:Label|target}} links to a local heading, @decision id, or @footnote id."],
  ["footnote", "{{footnote:id}} links to a matching @footnote id."],
  ["link", "{{link:Label|href}} creates a safe external or project-relative link."]
]);

function activate(context) {
  context.subscriptions.push(diagnosticCollection);
  context.subscriptions.push(vscode.commands.registerCommand("lessmark.check", checkActiveDocument));
  context.subscriptions.push(vscode.commands.registerCommand("lessmark.preview", previewActiveDocument));
  context.subscriptions.push(vscode.languages.registerHoverProvider("lessmark", { provideHover }));
  context.subscriptions.push(vscode.workspace.onDidSaveTextDocument((document) => {
    if (document.languageId === "lessmark") void checkDocument(document);
  }));
  if (vscode.window.activeTextEditor?.document.languageId === "lessmark") {
    void checkDocument(vscode.window.activeTextEditor.document);
  }
}

function deactivate() {
  diagnosticCollection.dispose();
}

async function checkActiveDocument() {
  const document = getActiveLessmarkDocument();
  if (!document) return;
  await checkDocument(document);
}

async function previewActiveDocument() {
  const document = getActiveLessmarkDocument();
  if (!document) return;
  if (document.isDirty) await document.save();

  const panel = vscode.window.createWebviewPanel(
    "lessmarkPreview",
    `Preview: ${document.fileName.split(/[\\/]/).pop()}`,
    vscode.ViewColumn.Beside,
    { enableScripts: false }
  );

  try {
    const html = await runLessmark(["render", "--document", document.fileName]);
    panel.webview.html = html;
  } catch (error) {
    panel.webview.html = errorDocument(error.message || String(error));
  }
}

async function checkDocument(document) {
  if (document.isUntitled) return;
  try {
    const stdout = await runLessmark(["check", "--json", document.fileName]);
    const result = JSON.parse(stdout);
    diagnosticCollection.set(document.uri, diagnosticsFromResult(result));
  } catch (error) {
    const stdout = error.stdout || "";
    try {
      diagnosticCollection.set(document.uri, diagnosticsFromResult(JSON.parse(stdout)));
    } catch {
      diagnosticCollection.set(document.uri, [
        new vscode.Diagnostic(new vscode.Range(0, 0, 0, 1), error.message || String(error), vscode.DiagnosticSeverity.Error)
      ]);
    }
  }
}

function diagnosticsFromResult(result) {
  return (result.errors || []).map((error) => {
    const line = Math.max(0, Number(error.line || 1) - 1);
    const column = Math.max(0, Number(error.column || 1) - 1);
    const diagnostic = new vscode.Diagnostic(
      new vscode.Range(line, column, line, column + 1),
      error.message || "Lessmark validation error",
      vscode.DiagnosticSeverity.Error
    );
    diagnostic.code = error.code;
    diagnostic.source = "lessmark";
    return diagnostic;
  });
}

function provideHover(document, position) {
  const line = document.lineAt(position.line).text;
  const inlineName = inlineFunctionAt(line, position.character);
  if (inlineName && INLINE_DOCS.has(inlineName)) {
    return new vscode.Hover(new vscode.MarkdownString(INLINE_DOCS.get(inlineName)));
  }

  const block = /^@([a-z][a-z0-9-]*)\b/.exec(line);
  if (block && position.character <= block[0].length && BLOCK_DOCS.has(block[1])) {
    return new vscode.Hover(new vscode.MarkdownString(BLOCK_DOCS.get(block[1])));
  }
  return undefined;
}

function inlineFunctionAt(line, character) {
  let index = 0;
  while (index < line.length) {
    const start = line.indexOf("{{", index);
    if (start === -1) return null;
    const nameStart = start + 2;
    const separator = line.indexOf(":", nameStart);
    if (separator === -1) return null;
    const name = line.slice(nameStart, separator).trim();
    if (character >= nameStart && character <= separator) return name;
    index = separator + 1;
  }
  return null;
}

function getActiveLessmarkDocument() {
  const editor = vscode.window.activeTextEditor;
  if (!editor || editor.document.languageId !== "lessmark") {
    void vscode.window.showInformationMessage("Open a Lessmark file first.");
    return null;
  }
  return editor.document;
}

function runLessmark(args) {
  return new Promise((resolve, reject) => {
    childProcess.execFile("lessmark", args, { windowsHide: true }, (error, stdout, stderr) => {
      if (error) {
        error.stdout = stdout;
        error.message = stderr.trim() || error.message;
        reject(error);
        return;
      }
      resolve(stdout);
    });
  });
}

function errorDocument(message) {
  return `<!doctype html>
<html lang="en">
<head><meta charset="utf-8"><title>Lessmark Preview Error</title></head>
<body><pre>${escapeHtml(message)}</pre></body>
</html>`;
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

module.exports = { activate, deactivate };
