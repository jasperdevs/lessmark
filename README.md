<p align="center">
  <img src="./assets/brand/bannerlong.png" alt="lessmark" width="100%" />
</p>

<h1 align="center">lessmark &lt;M</h1>

<p align="center">The markdown alternative that agents (and humans) love.</p>

<p align="center">
  <strong><a href="https://lessmark.org">lessmark.org</a></strong>
</p>

<p align="center">
  <a href="https://github.com/jasperdevs/lessmark/actions/workflows/ci.yml"><img alt="ci" src="https://img.shields.io/github/actions/workflow/status/jasperdevs/lessmark/ci.yml?branch=main&style=flat-square"></a>
  <a href="https://marketplace.visualstudio.com/items?itemName=JasperDevs.lessmark-vscode"><img alt="VS Code" src="https://img.shields.io/visual-studio-marketplace/v/JasperDevs.lessmark-vscode?label=vscode&style=flat-square"></a>
  <a href="https://github.com/jasperdevs/lessmark/stargazers"><img alt="GitHub stars" src="https://img.shields.io/github/stars/jasperdevs/lessmark?style=flat-square"></a>
  <a href="./LICENSE"><img alt="license" src="https://img.shields.io/badge/license-MIT-black?style=flat-square"></a>
</p>

Write normal prose. Add typed blocks when structure matters. Parse the same `.lmk` file in JavaScript, Python, or Rust.

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

<details>
<summary>CLI</summary>

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

</details>

<details>
<summary>API</summary>

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

</details>

<details>
<summary>Language</summary>

Lessmark source files use `.lmk`; `.lessmark` is a readable alias. The language includes plain top-level paragraphs, headings, inline functions, typed context blocks, lists, tables, callouts, code, math, diagrams, links, footnotes, and page/navigation metadata.

</details>

## License

MIT
