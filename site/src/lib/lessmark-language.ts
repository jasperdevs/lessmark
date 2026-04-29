import { uiString } from "@/lib/content";

export type LessmarkCompletion = {
  label: string;
  detail: string;
  insert: string;
  cursorOffset?: number;
};

export const BLOCK_DOCS = new Map<string, string>([
  ["summary", uiString("editor.block.summary")],
  ["decision", uiString("editor.block.decision")],
  ["constraint", uiString("editor.block.constraint")],
  ["task", uiString("editor.block.task")],
  ["risk", uiString("editor.block.risk")],
  ["depends-on", uiString("editor.block.depends-on")],
  ["code", uiString("editor.block.code")],
  ["example", uiString("editor.block.example")],
  ["list", uiString("editor.block.list")],
  ["table", uiString("editor.block.table")],
  ["image", uiString("editor.block.image")],
  ["math", uiString("editor.block.math")],
  ["diagram", uiString("editor.block.diagram")],
  ["footnote", uiString("editor.block.footnote")],
  ["reference", uiString("editor.block.reference")],
  ["link", uiString("editor.block.link")],
  ["callout", uiString("editor.block.callout")],
  ["quote", uiString("editor.block.quote")],
  ["definition", uiString("editor.block.definition")],
  ["metadata", uiString("editor.block.metadata")],
  ["page", uiString("editor.block.page")],
  ["nav", uiString("editor.block.nav")],
  ["api", uiString("editor.block.api")],
  ["separator", uiString("editor.block.separator")],
  ["toc", uiString("editor.block.toc")],
]);

export const INLINE_DOCS = new Map<string, string>([
  ["strong", uiString("editor.inline.strong")],
  ["em", uiString("editor.inline.em")],
  ["code", uiString("editor.inline.code")],
  ["kbd", uiString("editor.inline.kbd")],
  ["del", uiString("editor.inline.del")],
  ["mark", uiString("editor.inline.mark")],
  ["sup", uiString("editor.inline.sup")],
  ["sub", uiString("editor.inline.sub")],
  ["ref", uiString("editor.inline.ref")],
  ["footnote", uiString("editor.inline.footnote")],
  ["link", uiString("editor.inline.link")],
]);

const BLOCK_ATTRS = new Map<string, string[]>([
  ["api", ["name"]],
  ["callout", ["kind", "title"]],
  ["code", ["lang"]],
  ["decision", ["id"]],
  ["definition", ["term"]],
  ["depends-on", ["target"]],
  ["diagram", ["kind"]],
  ["file", ["path"]],
  ["footnote", ["id"]],
  ["image", ["src", "alt", "caption"]],
  ["link", ["href"]],
  ["list", ["kind"]],
  ["math", ["notation"]],
  ["metadata", ["key"]],
  ["nav", ["label", "href", "slot"]],
  ["page", ["title", "output"]],
  ["reference", ["target", "label"]],
  ["risk", ["level"]],
  ["table", ["columns"]],
  ["task", ["status"]],
]);

const BLOCK_SNIPPETS = new Map<string, string>([
  ["api", '@api name=""\n'],
  ["callout", '@callout kind="note"\n'],
  ["code", '@code lang=""\n'],
  ["decision", '@decision id=""\n'],
  ["definition", '@definition term=""\n'],
  ["depends-on", '@depends-on target=""\n'],
  ["diagram", '@diagram kind="mermaid"\n'],
  ["file", '@file path=""\n'],
  ["footnote", '@footnote id=""\n'],
  ["image", '@image src="" alt=""\n'],
  ["link", '@link href=""\n'],
  ["list", '@list kind="unordered"\n- '],
  ["math", '@math notation="tex"\n'],
  ["metadata", '@metadata key=""\n'],
  ["nav", '@nav label="" href=""\n'],
  ["page", '@page title="" output=""\n'],
  ["reference", '@reference target=""\n'],
  ["risk", '@risk level="medium"\n'],
  ["table", '@table columns="Name|Value"\n'],
  ["task", '@task status="todo"\n'],
]);

export const BLOCK_NAMES = [...BLOCK_DOCS.keys()];
export const INLINE_NAMES = [...INLINE_DOCS.keys()];

export function docForToken(line: string, column: number): string | null {
  const block = /^@([a-z][a-z0-9-]*)\b/.exec(line);
  if (block && column >= 0 && column <= block[0].length) {
    return BLOCK_DOCS.get(block[1]) ?? null;
  }

  const inline = inlineFunctionAt(line, column);
  return inline ? INLINE_DOCS.get(inline) ?? null : null;
}

export function completionsFor(value: string, cursor: number): { from: number; items: LessmarkCompletion[] } | null {
  const lineStart = value.lastIndexOf("\n", cursor - 1) + 1;
  const lineEnd = value.indexOf("\n", cursor);
  const line = value.slice(lineStart, lineEnd === -1 ? value.length : lineEnd);
  const before = value.slice(lineStart, cursor);

  const inlineStart = before.lastIndexOf("{{");
  if (inlineStart !== -1) {
    const inlinePrefix = before.slice(inlineStart + 2);
    if (!inlinePrefix.includes("}") && !inlinePrefix.includes(":")) {
      const prefix = inlinePrefix.trim();
      return {
        from: lineStart + inlineStart,
        items: INLINE_NAMES
          .filter((name) => name.startsWith(prefix))
          .map((name) => ({
            label: name,
            detail: INLINE_DOCS.get(name) ?? "",
            insert: `{{${name}:}}`,
            cursorOffset: name.length + 3,
          })),
      };
    }
  }

  const blockMatch = /^@([a-z][a-z0-9_-]*)?$/.exec(before);
  if (blockMatch) {
    const prefix = blockMatch[1] ?? "";
    return {
      from: lineStart,
      items: BLOCK_NAMES
        .filter((name) => name.startsWith(prefix))
        .map((name) => {
          const insert = BLOCK_SNIPPETS.get(name) ?? `@${name}\n`;
          return {
            label: `@${name}`,
            detail: BLOCK_DOCS.get(name) ?? "",
            insert,
            cursorOffset: firstEmptyQuoteOffset(insert) ?? insert.length,
          };
        }),
    };
  }

  const header = /^@([a-z][a-z0-9_-]*)\b/.exec(line);
  const attrMatch = /(?:^|\s)([a-z][a-z0-9_-]*)?$/.exec(before);
  if (header && attrMatch && before.trimEnd() === before) {
    const attrs = BLOCK_ATTRS.get(header[1]) ?? [];
    const prefix = attrMatch[1] ?? "";
    const used = new Set([...line.matchAll(/\b([a-z][a-z0-9_-]*)=/g)].map((match) => match[1]));
    const items = attrs
      .filter((attr) => !used.has(attr) && attr.startsWith(prefix))
      .map((attr) => ({
        label: attr,
        detail: `${header[1]} ${uiString("editor.attribute-detail")}`,
        insert: `${attr}=""`,
        cursorOffset: attr.length + 2,
      }));
    if (items.length > 0) {
      return { from: cursor - prefix.length, items };
    }
  }

  return null;
}

function inlineFunctionAt(line: string, column: number): string | null {
  let index = 0;
  while (index < line.length) {
    const start = line.indexOf("{{", index);
    if (start === -1) return null;
    const nameStart = start + 2;
    const separator = line.indexOf(":", nameStart);
    if (separator === -1) return null;
    const name = line.slice(nameStart, separator).trim();
    if (column >= nameStart && column <= separator) return name;
    index = separator + 1;
  }
  return null;
}

function firstEmptyQuoteOffset(value: string): number | null {
  const index = value.indexOf('""');
  return index === -1 ? null : index + 1;
}
