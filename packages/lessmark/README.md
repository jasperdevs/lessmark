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
lessmark parse file.lmk
lessmark check file.lmk
lessmark format file.lmk
lessmark render --document file.lmk
lessmark build docs public
```
