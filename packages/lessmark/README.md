# lessmark

Strict, agent-readable documents and safe static docs pages.

Lessmark rejects raw HTML/JSX, execution hooks, custom block syntax, and undefined attributes.

```js
import { parseLessmark, validateSource, formatLessmark, renderHtml } from "lessmark";

const source = "@summary\nTyped context for humans and agents.\n";
const ast = parseLessmark(source);
const astWithPositions = parseLessmark(source, { sourcePositions: true });
const errors = validateSource(source);
const formatted = formatLessmark(source);
const html = renderHtml(source, { document: true });
```

The package also exposes the `lessmark` command:

```sh
lessmark parse file.mu
lessmark check file.mu
lessmark check --json file.mu
lessmark format file.mu
lessmark render --document file.mu
lessmark build --strict docs public
lessmark info --json
```

`build --strict` parses and render-checks every page before writing output. `info --json` exposes npm CLI renderer/build capabilities plus the shared v0 language contract exported at `lessmark/schemas/language-v0.contract.json`.
