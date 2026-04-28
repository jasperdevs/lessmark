<p align="center">
  <img src="./assets/brand/bannerlong.png" alt="lessmark" width="100%" />
</p>

<h1 align="center">lessmark</h1>

<p align="center">A strict, agent-readable document format for project context.</p>

<p align="center">
  <a href="https://lessmark.org"><img alt="website" src="https://img.shields.io/badge/site-lessmark.org-black?style=flat-square"></a>
  <a href="https://github.com/jasperdevs/lessmark/stargazers"><img alt="GitHub stars" src="https://img.shields.io/github/stars/jasperdevs/lessmark?style=flat-square"></a>
  <a href="https://www.npmjs.com/package/lessmark"><img alt="npm" src="https://img.shields.io/npm/v/lessmark?style=flat-square"></a>
  <a href="https://pypi.org/project/lessmark/"><img alt="PyPI" src="https://img.shields.io/pypi/v/lessmark?style=flat-square"></a>
  <a href="./LICENSE"><img alt="license" src="https://img.shields.io/badge/license-MIT-black?style=flat-square"></a>
</p>

Lessmark is a small Markdown-inspired format built around typed blocks, a stable JSON AST, validation, formatting, safe HTML rendering, and no raw HTML or JSX.
It rejects raw HTML/JSX, execution hooks, custom block syntax, and undefined attributes.
It is intentionally stricter than Markdown and optimized for agent context files.

The canonical implementation is the Rust crate. The npm and Python packages stay fixture-compatible with it.

## Install

```sh
npm install lessmark
```

```sh
pip install lessmark
```

## CLI

```sh
lessmark parse file.lmk
lessmark check file.lmk
lessmark format file.lmk
lessmark from-markdown README.md
lessmark to-markdown file.lmk
lessmark render --document docs/index.lmk
lessmark build docs public
```

## Blocks

Lessmark v0 supports agent-context blocks like `summary`, `decision`, `constraint`, `task`, `file`, `code`, `example`, `api`, `metadata`, `risk`, and `depends-on`, plus docs blocks like `page`, `paragraph`, `image`, `list`, `table`, `quote`, `callout`, and `toc`.

See [`docs/spec.md`](./docs/spec.md) and [`schemas/ast-v0.schema.json`](./schemas/ast-v0.schema.json) for the source and AST contracts.

Lessmark source files use `.lmk`; `.lessmark` is a readable alias. See [`docs/agent-context-profile.md`](./docs/agent-context-profile.md), [`docs/docs-profile.md`](./docs/docs-profile.md), [`docs/file-type-registration.md`](./docs/file-type-registration.md), [`docs/markdown-comparison.md`](./docs/markdown-comparison.md), [`docs/article-alignment.md`](./docs/article-alignment.md), [`docs/standardization.md`](./docs/standardization.md), and [`docs/markdown-chaos-timeline.md`](./docs/markdown-chaos-timeline.md).

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
