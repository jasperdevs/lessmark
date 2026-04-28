# Lessmark VS Code Extension

Local extension scaffold for Lessmark syntax highlighting, diagnostics, and preview.

The check and preview commands call the `lessmark` CLI from your PATH. Install the workspace CLI first with `npm install` from the repository root.

Install from this folder during development:

```sh
code --install-extension lessmark-vscode-0.1.0.vsix
```

Package it with `vsce package` once the grammar is ready to publish.
