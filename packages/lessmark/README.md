# lessmark

Strict, agent-readable documents for project context.

```js
import { parseLessmark, validateSource, formatLessmark } from "lessmark";

const source = "@summary\nTyped context for humans and agents.\n";
const ast = parseLessmark(source);
const errors = validateSource(source);
const formatted = formatLessmark(source);
```

The package also exposes the `lessmark` command:

```sh
lessmark parse file.lmk
lessmark check file.lmk
lessmark format file.lmk
```
