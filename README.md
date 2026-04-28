<p align="center">
  <img src="./bannerlong.png" alt="lessmark" width="640" />
</p>

<h1 align="center">lessmark</h1>

<p align="center">A strict, agent-readable document format for project context.</p>

Lessmark is a small Markdown-inspired format built around typed blocks, a stable JSON AST, validation, formatting, and no raw HTML or JSX.

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

### Docs

- [V0 spec](./spec/lessmark-v0.md)
- [AST schema](./spec/ast-v0.schema.json)
- [Methodology](./docs/lessmark-methodology.md)
- [Markdown research notes](./docs/markdown-research.md)
- [Design comparison](./docs/design-comparison.md)

</details>

## License

MIT
