<p align="center">
  <img src="./assets/brand/bannerlong.png" alt="lessmark" width="100%" />
</p>

<h1 align="center">lessmark &lt;M</h1>

<p align="center">The markdown alternative that agents (and humans) love.</p>

<p align="center">
  <strong><a href="https://lessmark.org">lessmark.org</a></strong>
</p>

<p align="center">
  <a href="https://www.npmjs.com/package/lessmark"><img alt="npm" src="https://img.shields.io/npm/v/lessmark?label=npm&labelColor=111111&color=cb3837&style=flat-square"></a>
  <a href="https://pypi.org/project/lessmark/"><img alt="PyPI" src="https://img.shields.io/pypi/v/lessmark?label=pypi&labelColor=111111&color=3775a9&style=flat-square"></a>
  <a href="https://crates.io/crates/lessmark"><img alt="crates.io" src="https://img.shields.io/crates/v/lessmark?label=crates&labelColor=111111&color=de7c00&style=flat-square"></a>
  <a href="https://marketplace.visualstudio.com/items?itemName=JasperDevs.lessmark-vscode"><img alt="VS Code Marketplace" src="https://img.shields.io/badge/vscode-marketplace-0078d4?labelColor=111111&style=flat-square"></a>
</p>

Lessmark is readable markup with typed blocks, canonical formatting, safe rendering, and a stable JSON AST across JavaScript, Python, and Rust.

## <img src="./assets/brand/pixel-spark-color.svg" alt="" width="18" /> Why use Lessmark instead of Markdown?

Markdown is good when a human is the only reader. Lessmark is for documents that humans edit and AI agents need to trust.

In Markdown, the same-looking document can parse differently across engines, raw HTML can change the output, and malformed structure often gets accepted silently. That is fine for notes and comments, but painful for AI agent context files, docs pipelines, renderers, and import/export paths that need one predictable tree.

Lessmark keeps the readable parts and removes the guesswork:

| Markdown | Lessmark |
| --- | --- |
| <img src="./assets/brand/pixel-no-color.svg" alt="" width="14" /> Many equivalent spellings for the same idea | <img src="./assets/brand/pixel-ok-color.svg" alt="" width="14" /> One canonical format |
| <img src="./assets/brand/pixel-no-color.svg" alt="" width="14" /> Parser-dependent edge cases | <img src="./assets/brand/pixel-ok-color.svg" alt="" width="14" /> Shared grammar and conformance tests |
| <img src="./assets/brand/pixel-no-color.svg" alt="" width="14" /> Raw HTML and renderer-specific behavior | <img src="./assets/brand/pixel-ok-color.svg" alt="" width="14" /> Safe rendering with no raw HTML |
| <img src="./assets/brand/pixel-no-color.svg" alt="" width="14" /> Loose structure that AI agents and parsers have to infer | <img src="./assets/brand/pixel-ok-color.svg" alt="" width="14" /> Typed blocks with explicit attributes |
| <img src="./assets/brand/pixel-no-color.svg" alt="" width="14" /> Formatting is mostly cosmetic | <img src="./assets/brand/pixel-ok-color.svg" alt="" width="14" /> Formatting produces stable source |
| <img src="./assets/brand/pixel-no-color.svg" alt="" width="14" /> AST shape depends on the parser | <img src="./assets/brand/pixel-ok-color.svg" alt="" width="14" /> Stable JSON AST across JavaScript, Python, and Rust |

Use Markdown for casual prose. Use Lessmark when the file is part of a build, a parser, a validator, a site, or an agent workflow.

## <img src="./assets/brand/pixel-doc-color.svg" alt="" width="18" /> Install

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
<summary><img src="./assets/brand/pixel-wand-color.svg" alt="" width="14" /> CLI</summary>

```sh
lessmark parse file.lmk
lessmark parse --positions file.lmk
lessmark parse -
lessmark check file.lmk
lessmark check docs
lessmark check --json file.lmk
lessmark format file.lmk
lessmark format --check file.lmk
lessmark format --check --json docs
lessmark fix --write file.lmk
lessmark fix --write docs
lessmark from-markdown README.md
lessmark from-markdown -
lessmark to-markdown file.lmk
lessmark to-markdown -
lessmark init docs
lessmark skill init code-review
lessmark skill check code-review
lessmark skill build code-review --target both
lessmark skill import code-review/SKILL.md --out code-review/skill.lmk
lessmark skill install code-review --target codex
lessmark skill dev code-review
lessmark render --document file.lmk
lessmark build --strict input public
lessmark info --json
```

Use `-` to read from stdin. `check`, `format --check`, and `fix --write` can also walk a directory recursively. `parse --positions` includes source ranges for tooling. `init` creates a starter `docs/index.lmk` without overwriting. `parse`, `check`, `format`, `fix`, `from-markdown`, `to-markdown`, `init`, and `info` are shared by the JavaScript, Python, and Rust packages. HTML rendering, static-site builds, and skill bundle commands are npm CLI features.

</details>

<details>
<summary><img src="./assets/brand/pixel-ok-color.svg" alt="" width="14" /> API</summary>

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
<summary><img src="./assets/brand/pixel-spark-color.svg" alt="" width="14" /> Language</summary>

Lessmark source files use `.lmk`; `.lessmark` is a readable alias. The language includes plain top-level paragraphs, headings, inline functions, typed context blocks, skill metadata, lists, tables, callouts, code, math, diagrams, links, footnotes, and page/navigation metadata.

Conformance is checked across JavaScript, Python, Rust, docs, Markdown conversion, fixtures, schemas, VS Code syntax, and the Tree-sitter starter grammar. See [lessmark.org/docs/conformance](https://lessmark.org/docs/conformance).

</details>

## <img src="./assets/brand/pixel-heart-color.svg" alt="" width="18" /> License

MIT
