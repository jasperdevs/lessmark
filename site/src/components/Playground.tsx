import { useEffect, useMemo, useRef, useState } from "react";
import { Renderer } from "@/components/Renderer";
import { LessmarkEditor } from "@/components/LessmarkEditor";
import { parseLessmark, LessmarkError } from "lessmark";

type View = "html" | "tree" | "ast";

type Props = {
  initial?: string;
  sample?: string;
  fullHeight?: boolean;
  fileName?: string;
  value?: string;
  onChange?: (next: string) => void;
};

export function Playground({
  initial = "",
  sample,
  fullHeight,
  fileName = "input.mu",
  value,
  onChange,
}: Props) {
  const controlled = typeof value === "string" && typeof onChange === "function";
  const [local, setLocal] = useState(initial);
  const source = controlled ? (value as string) : local;
  const setSource = (next: string) => {
    if (controlled) onChange!(next);
    else setLocal(next);
  };

  const splitRef = useRef<HTMLDivElement>(null);

  const [view, setView] = useState<View>("html");
  const [leftPct, setLeftPct] = useState(50);
  const [isWide, setIsWide] = useState(true);
  const dragRef = useRef<{ startX: number; startPct: number } | null>(null);

  useEffect(() => {
    const mq = window.matchMedia("(min-width: 768px)");
    setIsWide(mq.matches);
    const onChange = (e: MediaQueryListEvent) => setIsWide(e.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  const onSplitDown = (e: React.MouseEvent) => {
    if (!splitRef.current) return;
    e.preventDefault();
    dragRef.current = { startX: e.clientX, startPct: leftPct };
    document.body.style.cursor = "col-resize";
    document.body.style.userSelect = "none";
    const onMove = (m: MouseEvent) => {
      const w = splitRef.current?.clientWidth ?? 1;
      const dx = m.clientX - dragRef.current!.startX;
      const next = Math.min(85, Math.max(15, dragRef.current!.startPct + (dx / w) * 100));
      setLeftPct(next);
    };
    const onUp = () => {
      document.body.style.cursor = "";
      document.body.style.userSelect = "";
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup", onUp);
    };
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);
  };

  const outerHeight = fullHeight ? "h-full" : "h-[520px]";
  const resetTarget = sample ?? initial;
  const canReset = typeof resetTarget === "string" && resetTarget !== source;

  const leftStyle = isWide ? { width: `${leftPct}%` } : { width: "100%", flex: "1 1 0%" };
  const rightStyle = isWide ? { width: `${100 - leftPct}%` } : { width: "100%", flex: "1 1 0%" };

  return (
    <div
      ref={splitRef}
      className={`flex flex-col md:flex-row gap-2 md:gap-0 ${outerHeight} min-h-0`}
    >
      <div
        className="flex flex-col rounded-[12px] md:rounded-r-none overflow-hidden bg-code-bg text-code-fg border border-border-soft min-h-[180px] md:min-h-0"
        style={leftStyle}
      >
        <div className="flex items-center justify-between px-3 py-2 border-b border-code-line text-[12px] font-mono text-code-faint shrink-0">
          <span>{fileName}</span>
          {canReset && (
            <button
              type="button"
              onClick={() => setSource(resetTarget!)}
              className="px-2 py-1 rounded-md text-code-faint hover:text-code-fg hover:bg-code-line/60 transition-colors"
            >
              reset
            </button>
          )}
        </div>
        <LessmarkEditor value={source} onChange={setSource} className="flex-1" />
      </div>

      <div
        role="separator"
        aria-orientation="vertical"
        onMouseDown={onSplitDown}
        className="hidden md:flex w-2 cursor-col-resize group items-center justify-center shrink-0 bg-border-soft hover:bg-border transition-colors"
        title="drag to resize"
      >
        <span className="flex flex-col gap-0.5 opacity-50 group-hover:opacity-100 transition-opacity">
          <span className="block size-[3px] rounded-full bg-fg-muted" />
          <span className="block size-[3px] rounded-full bg-fg-muted" />
          <span className="block size-[3px] rounded-full bg-fg-muted" />
          <span className="block size-[3px] rounded-full bg-fg-muted" />
        </span>
      </div>

      <div
        className="flex flex-col rounded-[12px] md:rounded-l-none overflow-hidden bg-surface border border-border-soft min-h-[180px] md:min-h-0"
        style={rightStyle}
      >
        <div className="flex items-center justify-end gap-1 px-2 py-1.5 border-b border-border-soft shrink-0">
          <ViewTab active={view === "html"} onClick={() => setView("html")}>
            HTML
          </ViewTab>
          <ViewTab active={view === "tree"} onClick={() => setView("tree")}>
            Renderable tree
          </ViewTab>
          <ViewTab active={view === "ast"} onClick={() => setView("ast")}>
            AST
          </ViewTab>
        </div>
        <div className="flex-1 min-h-0 overflow-auto">
          {view === "html" && (
            <div className="p-5">
              <Renderer source={source} />
            </div>
          )}
          {view === "tree" && <TreeView source={source} withPositions={false} />}
          {view === "ast" && <TreeView source={source} withPositions={true} />}
        </div>
      </div>
    </div>
  );
}

function ViewTab({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`px-2.5 py-1 rounded-md text-[12px] font-mono transition-colors ${
        active
          ? "bg-surface-alt text-fg"
          : "text-fg-faint hover:text-fg hover:bg-surface-alt"
      }`}
    >
      {children}
    </button>
  );
}

function TreeView({ source, withPositions }: { source: string; withPositions: boolean }) {
  const result = useMemo(() => {
    try {
      const ast = parseLessmark(source, withPositions ? { sourcePositions: true } : undefined);
      return { ok: true as const, json: JSON.stringify(ast, null, 2) };
    } catch (e) {
      const err = e instanceof LessmarkError ? e : new LessmarkError(String((e as Error)?.message ?? e));
      return { ok: false as const, message: err.message, line: err.line, column: err.column };
    }
  }, [source, withPositions]);
  if (!result.ok) {
    return (
      <div className="p-5 font-mono text-[13px] leading-[1.6] text-destructive">
        <div>{result.message}</div>
        <div className="text-fg-faint mt-1">line {result.line}, column {result.column}</div>
      </div>
    );
  }
  return (
    <pre className="m-0 p-5 font-mono text-[12px] leading-[1.6] text-fg whitespace-pre-wrap break-words">
      {result.json}
    </pre>
  );
}
