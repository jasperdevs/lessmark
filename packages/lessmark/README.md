# lessmark

The markdown alternative that agents (and humans) love.

Lessmark is a strict document language with plain prose, typed blocks, a stable JSON AST, canonical formatting, validation, and safe rendering.
It rejects raw HTML, hidden execution surfaces, undefined attributes, and most legacy Markdown ambiguity.

```js
import { parseLessmark, validateSource, formatLessmark, renderHtml } from "lessmark";

const source = "# Notes\n\nPlain prose becomes a paragraph.\n";
const ast = parseLessmark(source);
const astWithPositions = parseLessmark(source, { sourcePositions: true });
const errors = validateSource(source);
const formatted = formatLessmark(source);
const html = renderHtml(source, { document: true });
```

The package also exposes the `lessmark` command:

```sh
lessmark parse file.lmk
lessmark check file.lmk
lessmark check --json file.lmk
lessmark format file.lmk
lessmark format --check file.lmk
lessmark render --document file.lmk
lessmark build --strict input public
lessmark info --json
```

`build --strict` parses and render-checks every page before writing output. `info --json` exposes npm CLI renderer/build capabilities plus the shared v0 language contract exported at `lessmark/schemas/language-v0.contract.json`.
