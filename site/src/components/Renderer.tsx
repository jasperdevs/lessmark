import { useMemo, useRef } from "react";
import { renderHtml, parseLessmark, LessmarkError } from "lessmark";
import { useCodeCopyButtons } from "@/lib/code-copy";
import { useMermaid } from "@/lib/mermaid-render";
import { uiString } from "@/lib/content";

type Props = { source: string; className?: string };

export function Renderer({ source, className }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const result = useMemo(() => {
    try {
      const ast = parseLessmark(source);
      return { ok: true as const, html: renderHtml(ast) };
    } catch (e) {
      const err = e instanceof LessmarkError ? e : new LessmarkError(String((e as Error)?.message ?? e));
      return { ok: false as const, message: err.message, line: err.line, column: err.column };
    }
  }, [source]);

  useCodeCopyButtons(ref, result.ok ? result.html : null);
  useMermaid(ref, result.ok ? result.html : null);

  if (!result.ok) {
    return (
      <div className="rounded-md border border-border-soft bg-surface px-3 py-2 text-[13px] leading-[1.55] text-fg-muted">
        <div className="font-sans text-fg">{uiString("preview.paused")}</div>
        <div className="mt-1 font-mono text-[12px] text-fg-faint">{result.message}</div>
        <div className="font-mono text-[12px] text-fg-faint">
          {uiString("playground.error-line")} {result.line}, {uiString("playground.error-column")} {result.column}
        </div>
      </div>
    );
  }

  return (
    <div
      ref={ref}
      className={`lessmark-output ${className ?? ""}`}
      dangerouslySetInnerHTML={{ __html: result.html }}
    />
  );
}
