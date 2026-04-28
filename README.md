<p align="center">
  <img src="./assets/brand/bannerlong.png" alt="lessmark" width="100%" />
</p>

<h1 align="center">lessmark &lt;M</h1>

<p align="center">The markdown alternative that agents (and humans) love.</p>

<p align="center">
  <strong><a href="https://lessmark.org">lessmark.org</a></strong>
  ·
  <a href="https://marketplace.visualstudio.com/items?itemName=JasperDevs.lessmark-vscode">VS Code extension</a>
</p>

<p align="center">
  <a href="https://github.com/jasperdevs/lessmark/actions/workflows/ci.yml"><img alt="ci" src="https://img.shields.io/github/actions/workflow/status/jasperdevs/lessmark/ci.yml?branch=main&style=flat-square"></a>
  <a href="https://github.com/jasperdevs/lessmark/stargazers"><img alt="GitHub stars" src="https://img.shields.io/github/stars/jasperdevs/lessmark?style=flat-square"></a>
  <a href="./LICENSE"><img alt="license" src="https://img.shields.io/badge/license-MIT-black?style=flat-square"></a>
</p>

Lessmark is a document language for readable source, typed blocks, stable JSON ASTs, canonical formatting, validation, and safe rendering.
It keeps prose simple while giving tools a fixed grammar and predictable tree.

## Install

```sh
npm install lessmark
```

```sh
pip install lessmark
```

```sh
cargo add lessmark
```

## CLI

```sh
lessmark parse file.lmk
lessmark check file.lmk
lessmark check --json file.lmk
lessmark format file.lmk
lessmark format --check file.lmk
lessmark fix --write file.lmk
lessmark from-markdown README.md
lessmark to-markdown file.lmk
lessmark render --document file.lmk
lessmark build --strict input public
lessmark info --json
```

`parse`, `check`, `format`, `fix`, `from-markdown`, `to-markdown`, and `info` are shared by the JavaScript, Python, and Rust packages. HTML rendering and static-site builds are npm CLI features.

## API

```js
import { parseLessmark, validateSource, formatLessmark, renderHtml } from "lessmark";

const source = "# Notes\n\nPlain prose becomes a paragraph.\n";
const ast = parseLessmark(source);
const errors = validateSource(source);
const formatted = formatLessmark(source);
const html = renderHtml(ast, { document: true });
```

```py
from lessmark import parse_lessmark, validate_source, format_lessmark
```

```rust
use lessmark::{parse_lessmark, validate_source, format_lessmark};
```

## Language

Lessmark source files use `.lmk`; `.lessmark` is a readable alias. The v0 language includes plain top-level paragraphs, headings, inline functions, typed context blocks, lists, tables, callouts, code, math, diagrams, links, footnotes, and page/navigation metadata.

Read the docs at [lessmark.org](https://lessmark.org). Install [Lessmark for VS Code](https://marketplace.visualstudio.com/items?itemName=JasperDevs.lessmark-vscode) for syntax highlighting, diagnostics, hover docs, completion, and preview.

## License

MIT
