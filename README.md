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

Lessmark is readable markup with typed blocks, canonical formatting, safe rendering, and a stable JSON AST across JavaScript, Python, and Rust.

## Why use Lessmark instead of Markdown?

Markdown is good when a human is the only reader. Lessmark is for documents that humans edit and tools need to trust.

In Markdown, the same-looking document can parse differently across engines, raw HTML can change the output, and malformed structure often gets accepted silently. That is fine for notes and comments, but painful for agent context files, docs pipelines, renderers, and import/export tools that need one predictable tree.

Lessmark keeps the readable parts and removes the guesswork:

| Markdown | Lessmark |
| --- | --- |
| Many equivalent spellings for the same idea | One canonical format |
| Parser-dependent edge cases | Shared grammar and conformance tests |
| Raw HTML and renderer-specific behavior | Safe rendering with no raw HTML |
| Loose structure that tools have to infer | Typed blocks with explicit attributes |
| Formatting is mostly cosmetic | Formatting produces stable source |
| AST shape depends on the parser | Stable JSON AST across JavaScript, Python, and Rust |

Use Markdown for casual prose. Use Lessmark when the file is part of a build, a parser, a validator, a site, or an agent workflow.

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
