import { useEffect, useMemo, useRef, useState } from "react";
import { parseLessmark, LessmarkError, type LessmarkAst } from "@/lib/lessmark";
import { highlightLessmark } from "@/lib/highlight";
import { Renderer } from "@/components/Renderer";

type ParseResult =
  | { ok: true; ast: LessmarkAst }
  | { ok: false; message: string; line: number; column: number };

export function Playground({ initial, sample }: { initial: string; sample: string }) {
  const [source, setSource] = useState(initial);
  const taRef = useRef<HTMLTextAreaElement>(null);
  const preRef = useRef<HTMLPreElement>(null);
  const gutterRef = useRef<HTMLDivElement>(null);

  const result = useMemo<ParseResult>(() => {
    try {
      return { ok: true, ast: parseLessmark(source) };
    } catch (e) {
      const err = e instanceof LessmarkError ? e : new LessmarkError(String((e as Error).message ?? e));
      return { ok: false, message: err.message, line: err.line, column: err.column };
    }
  }, [source]);

  const lineCount = useMemo(() => source.split("\n").length, [source]);
  const highlighted = useMemo(() => highlightLessmark(source), [source]);

  useEffect(() => {
    const ta = taRef.current;
    if (!ta) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Tab") return;
      e.preventDefault();
      const start = ta.selectionStart, end = ta.selectionEnd;
      const v = ta.value;
      const next = v.slice(0, start) + "  " + v.slice(end);
      ta.value = next;
      ta.selectionStart = ta.selectionEnd = start + 2;
      setSource(next);
    };
    ta.addEventListener("keydown", onKey);
    return () => ta.removeEventListener("keydown", onKey);
  }, []);

  const onScroll = () => {
    const ta = taRef.current, pre = preRef.current, g = gutterRef.current;
    if (!ta || !pre || !g) return;
    pre.scrollTop = ta.scrollTop;
    pre.scrollLeft = ta.scrollLeft;
    g.scrollTop = ta.scrollTop;
  };

  return (
    <div className="grid gap-3 md:grid-cols-2">
      {/* editor */}
      <div className="rounded-[12px] overflow-hidden bg-code-bg text-code-fg border border-border-soft">
        <div className="flex items-center justify-between px-3 py-2 border-b border-code-line text-[12px] font-mono text-code-faint">
          <span>input.lmk</span>
          <button
            type="button"
            onClick={() => setSource(sample)}
            className="px-2 py-1 rounded-md text-code-faint hover:text-code-fg hover:bg-code-line/60 transition-colors"
          >
            reset
          </button>
        </div>
        <div className="relative grid grid-cols-[40px_1fr] h-[420px]">
          <div
            ref={gutterRef}
            aria-hidden
            className="overflow-hidden border-r border-code-line py-3 text-right pr-2 text-code-faint font-mono text-[12px] leading-[1.6] select-none"
          >
            {Array.from({ length: lineCount }, (_, i) => (
              <div key={i}>{i + 1}</div>
            ))}
          </div>
          <div className="relative">
            <pre
              ref={preRef}
              aria-hidden
              className="absolute inset-0 m-0 p-3 overflow-auto whitespace-pre font-mono text-[13px] leading-[1.6] text-code-fg pointer-events-none"
              dangerouslySetInnerHTML={{ __html: highlighted + "\n" }}
            />
            <textarea
              ref={taRef}
              value={source}
              onChange={(e) => setSource(e.target.value)}
              onScroll={onScroll}
              spellCheck={false}
              className="absolute inset-0 m-0 p-3 w-full h-full resize-none bg-transparent border-0 outline-none whitespace-pre font-mono text-[13px] leading-[1.6] text-transparent caret-code-fg selection:bg-code-line"
            />
          </div>
        </div>
      </div>

      {/* rendered preview */}
      <div className="rounded-[12px] overflow-hidden bg-surface border border-border-soft">
        <div className="flex items-center justify-between px-3 py-2 border-b border-border-soft text-[12px] font-mono">
          <span className={result.ok ? "text-fg-muted" : "text-destructive"}>
            {result.ok ? "rendered" : "error"}
          </span>
        </div>
        <div className="p-5 max-h-[420px] overflow-auto">
          {result.ok ? (
            <Renderer ast={result.ast} />
          ) : (
            <div className="font-mono text-[13px] leading-[1.6] text-destructive">
              <div>{result.message}</div>
              <div className="text-fg-faint mt-1">line {result.line}, column {result.column}</div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
