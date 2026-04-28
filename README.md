<p align="center">
  <img src="./assets/brand/bannerlong.png" alt="lessmark" width="100%" />
</p>

<h1 align="center">lessmark</h1>

<p align="center">A strict, agent-readable document format for project context.</p>

<p align="center">
  <a href="https://lessmark.org"><img alt="website" src="https://img.shields.io/badge/site-lessmark.org-black?style=flat-square"></a>
  <a href="https://github.com/jasperdevs/lessmark/actions/workflows/ci.yml"><img alt="ci" src="https://img.shields.io/github/actions/workflow/status/jasperdevs/lessmark/ci.yml?branch=main&style=flat-square"></a>
  <img alt="conformance" src="https://img.shields.io/badge/conformance-v0_checked-black?style=flat-square">
  <a href="https://github.com/jasperdevs/lessmark/stargazers"><img alt="GitHub stars" src="https://img.shields.io/github/stars/jasperdevs/lessmark?style=flat-square"></a>
  <a href="https://www.npmjs.com/package/lessmark"><img alt="npm" src="https://img.shields.io/npm/v/lessmark?style=flat-square"></a>
  <a href="https://pypi.org/project/lessmark/"><img alt="PyPI" src="https://img.shields.io/pypi/v/lessmark?style=flat-square"></a>
  <a href="./LICENSE"><img alt="license" src="https://img.shields.io/badge/license-MIT-black?style=flat-square"></a>
</p>

Lessmark is a small Markdown-inspired format built around typed blocks, a stable JSON AST, validation, formatting, safe HTML rendering, and no raw HTML or JSX.
It rejects raw HTML/JSX, execution hooks, custom block syntax, and undefined attributes.
It is intentionally stricter than Markdown and optimized for agent context files.

The Rust crate, npm package, and Python package are conformance-checked for source parsing, formatting, Markdown export, validation errors, and the shared language contract. Safe HTML rendering and static-site builds are npm CLI features.

## Install

```sh
npm install lessmark
```

```sh
pip install lessmark
```

## CLI

```sh
lessmark parse file.mu
lessmark check file.mu
lessmark check --json file.mu
lessmark format file.mu
lessmark format --check file.mu
lessmark fix --write file.mu
lessmark from-markdown README.md
lessmark to-markdown file.mu
lessmark render --document docs/index.mu
lessmark build --strict docs public
lessmark info --json
```

`check --json` returns stable error `code` values for tools. `format --check` exits non-zero when source is not canonical. `info --json` exposes the v0 block set, inline functions, CLI features, and syntax policy.

## Blocks

Lessmark v0 supports agent-context blocks like `summary`, `decision`, `constraint`, `task`, `file`, `code`, `example`, `api`, `metadata`, `risk`, and `depends-on`, plus docs blocks like `page`, `nav`, `paragraph`, `image`, `list`, `table`, `quote`, `callout`, `toc`, `definition`, `reference`, and `footnote`.

Lessmark source files use `.mu`; `.lessmark` is a readable alias. See [`docs/spec.mu`](./docs/spec.mu) for the source format.

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
cargo run -p lessmark -- parse file.mu
cargo run -p lessmark -- check file.mu
cargo run -p lessmark -- format file.mu
```

### Checks

```sh
npm run check
```

</details>

## License

MIT
