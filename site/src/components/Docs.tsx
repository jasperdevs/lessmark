import { useMemo } from "react";
import { parseLessmark, LessmarkError } from "@/lib/lessmark";
import { Renderer } from "./Renderer";
import { highlightLessmark } from "@/lib/highlight";

type Row = { name: string; source: string };

const ROWS: Row[] = [
  { name: "heading", source: "# Top heading\n## Subheading" },
  { name: "summary", source: "@summary\nOne-paragraph description of what\nthis document is about." },
  { name: "decision", source: '@decision id="manual-scrolling"\nKeep manual scrolling capture.' },
  { name: "constraint", source: "@constraint\nDo not auto-scroll or auto-end\nthe capture." },
  { name: "task", source: '@task status="todo"\nAdd export settings.' },
  { name: "file", source: '@file path="src/Capture/Service.cs"\nOwns stitching and capture state.' },
  { name: "example", source: "@example\nGiven a 1080p screen, capture\nthe top half only." },
  { name: "note", source: "@note\nThe parser ignores trailing\nwhitespace inside block bodies." },
  { name: "warning", source: "@warning\nUnknown block names fail the\nparser; they don't pass through." },
  { name: "api", source: '@api name="parseLessmark"\nTakes a string, returns the AST.' },
  { name: "link", source: '@link href="https://example.com"\nExample homepage' },
];

function Pair({ row }: { row: Row }) {
  const result = useMemo(() => {
    try {
      return { ok: true as const, ast: parseLessmark(row.source) };
    } catch (e) {
      const err = e instanceof LessmarkError ? e : new LessmarkError(String((e as Error).message ?? e));
      return { ok: false as const, message: err.message };
    }
  }, [row.source]);

  return (
    <div className="grid gap-3 md:grid-cols-2 py-6 border-b border-border-soft">
      <div className="grid gap-2">
        <div className="font-mono text-[11px] tracking-wider text-fg-faint">@{row.name}</div>
        <pre
          className="m-0 rounded-[10px] bg-code-bg text-code-fg p-3 font-mono text-[12.5px] leading-[1.6] whitespace-pre overflow-auto"
          dangerouslySetInnerHTML={{ __html: highlightLessmark(row.source) }}
        />
      </div>
      <div className="grid gap-2">
        <div className="font-mono text-[11px] tracking-wider text-fg-faint">rendered</div>
        <div className="rounded-[10px] bg-surface border border-border-soft p-4">
          {result.ok ? <Renderer ast={result.ast} /> : (
            <div className="font-mono text-[12px] text-destructive">{result.message}</div>
          )}
        </div>
      </div>
    </div>
  );
}

export function Docs() {
  return (
    <div>
      {ROWS.map((row) => (
        <Pair key={row.name} row={row} />
      ))}
    </div>
  );
}
