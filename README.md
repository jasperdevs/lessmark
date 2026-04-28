<p align="center">
  <img src="./bannerlong.png" alt="lessmark" width="100%" />
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

Lessmark is a small Markdown-inspired format built around typed blocks, a stable JSON AST, validation, formatting, and no raw HTML or JSX.
It rejects raw HTML/JSX, execution hooks, custom block syntax, and undefined attributes.

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
```

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

> This project also dogfoods its own format: see [`README.lmk`](./README.lmk) for the same content as a real lessmark document. GitHub only renders `.md` for the repo homepage, so this `.md` stays as the rendered copy.
