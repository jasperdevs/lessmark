"use strict";

const childProcess = require("node:child_process");
const vscode = require("vscode");

const diagnosticCollection = vscode.languages.createDiagnosticCollection("lessmark");

function activate(context) {
  context.subscriptions.push(diagnosticCollection);
  context.subscriptions.push(vscode.commands.registerCommand("lessmark.check", checkActiveDocument));
  context.subscriptions.push(vscode.commands.registerCommand("lessmark.preview", previewActiveDocument));
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
