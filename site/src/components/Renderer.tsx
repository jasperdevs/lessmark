import { useMemo, useRef } from "react";
import { renderHtml, parseLessmark, LessmarkError } from "lessmark";
import { useCodeCopyButtons } from "@/lib/code-copy";
import { useMermaid } from "@/lib/mermaid-render";

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
      <div className="font-mono text-[13px] leading-[1.6] text-destructive">
        <div>{result.message}</div>
        <div className="text-fg-faint mt-1">line {result.line}, column {result.column}</div>
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
