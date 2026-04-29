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
lessmark parse --positions file.lmk
lessmark parse -
lessmark check file.lmk
lessmark check docs
lessmark check --json file.lmk
lessmark format file.lmk
lessmark format --check file.lmk
lessmark format --check --json docs
lessmark fix --write docs
lessmark init docs
lessmark skill init code-review
lessmark skill build code-review --target both
lessmark skill install code-review --target codex
lessmark render --document file.lmk
lessmark build --strict input public
lessmark info --json
```

Use `-` for stdin. `check`, `format --check`, and `fix --write` also accept directories. `parse --positions` includes source ranges. `init` creates a starter `docs/index.lmk` without overwriting. `skill` commands author Lessmark skill sources and emit native `SKILL.md` bundles for agents.

Docs: https://lessmark.org
