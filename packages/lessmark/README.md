# lessmark

The markdown alternative that agents (and humans) love.

Use this package when a JavaScript app or CLI needs to parse, validate,
format, render, or convert Lessmark documents.

```sh
npm install lessmark
```

```js
import { parseLessmark, validateSource, formatLessmark, renderHtml } from "lessmark";

const source = "# Notes\n\nPlain prose becomes a paragraph.\n";
const ast = parseLessmark(source);
const errors = validateSource(source);
const formatted = formatLessmark(source);
const html = renderHtml(ast, { document: true });
```

CLI:

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

Docs: https://lessmark.org
