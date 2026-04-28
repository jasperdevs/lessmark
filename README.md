<p align="center">
  <img src="./assets/brand/bannerlong.png" alt="lessmark" width="100%" />
</p>

<h1 align="center">lessmark &lt;M</h1>

<p align="center">The markdown alternative that agents (and humans) love.</p>

<p align="center">
  <a href="https://lessmark.org"><img alt="website" src="https://img.shields.io/badge/site-lessmark.org-black?style=flat-square"></a>
  <a href="https://github.com/jasperdevs/lessmark/actions/workflows/ci.yml"><img alt="ci" src="https://img.shields.io/github/actions/workflow/status/jasperdevs/lessmark/ci.yml?branch=main&style=flat-square"></a>
  <img alt="conformance" src="https://img.shields.io/badge/conformance-v0_checked-black?style=flat-square">
  <a href="https://github.com/jasperdevs/lessmark/stargazers"><img alt="GitHub stars" src="https://img.shields.io/github/stars/jasperdevs/lessmark?style=flat-square"></a>
  <a href="https://www.npmjs.com/package/lessmark"><img alt="npm" src="https://img.shields.io/npm/v/lessmark?style=flat-square"></a>
  <a href="https://pypi.org/project/lessmark/"><img alt="PyPI" src="https://img.shields.io/pypi/v/lessmark?style=flat-square"></a>
  <a href="./LICENSE"><img alt="license" src="https://img.shields.io/badge/license-MIT-black?style=flat-square"></a>
</p>

Lessmark is a strict document language with plain prose, typed blocks, a stable JSON AST, canonical formatting, validation, and safe rendering.
It rejects raw HTML, hidden execution surfaces, undefined attributes, and most legacy Markdown ambiguity.

JavaScript, Python, and Rust stay fixture-compatible for parsing, formatting, Markdown conversion, validation, and the shared language contract. HTML rendering and static docs builds are part of the npm CLI.

## Install

```sh
npm install lessmark
```

```sh
pip install lessmark
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

`check --json` returns stable error `code` values for tools. `format --check` exits non-zero when source is not canonical. `info --json` exposes the v0 block set, inline functions, CLI features, and syntax policy.

</details>

<details>
<summary>Blocks</summary>

Lessmark v0 supports plain top-level paragraphs, agent-context blocks like `summary`, `decision`, `constraint`, `task`, `file`, `code`, `example`, `api`, `metadata`, `risk`, and `depends-on`, plus docs blocks like `page`, `nav`, `image`, `list`, `table`, `quote`, `callout`, `toc`, `definition`, `reference`, and `footnote`.

Lessmark source files use `.lmk`; `.lessmark` is a readable alias. See [lessmark.org](https://lessmark.org) for docs.

Editor support: [Lessmark for VS Code](https://marketplace.visualstudio.com/items?itemName=JasperDevs.lessmark-vscode).
</details>

<details>
<summary>API and docs</summary>

### API

```js
import { parseLessmark } from "lessmark";
```

```py
from lessmark import parse_lessmark
```

### Rust

```sh
cargo run -p lessmark -- parse file.lmk
cargo run -p lessmark -- check file.lmk
cargo run -p lessmark -- format file.lmk
```

### Checks

```sh
npm run check
```

</details>

## License

MIT
