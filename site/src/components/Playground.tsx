import { useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { formatLessmark, parseLessmark, LessmarkError } from "lessmark";
import { Renderer } from "@/components/Renderer";
import { LessmarkEditor } from "@/components/LessmarkEditor";
import { uiString } from "@/lib/content";

type View = "html" | "tree" | "ast";

type Props = {
  initial?: string;
  sample?: string;
  fullHeight?: boolean;
  value?: string;
  onChange?: (next: string) => void;
  previewToolbar?: ReactNode;
};

export function Playground({
  initial = "",
  sample,
  fullHeight,
  value,
  onChange,
  previewToolbar,
}: Props) {
  const controlled = typeof value === "string" && typeof onChange === "function";
  const [local, setLocal] = useState(initial);
  const source = controlled ? (value as string) : local;
  const setSource = (next: string) => {
    if (controlled) onChange!(next);
    else setLocal(next);
  };

  const splitRef = useRef<HTMLDivElement>(null);
  const [leftPct, setLeftPct] = useState(50);
  const [isWide, setIsWide] = useState(true);
  const [view, setView] = useState<View>("html");
  const dragRef = useRef<{ startX: number; startPct: number } | null>(null);
  const cleanupDragRef = useRef<(() => void) | null>(null);

  useEffect(() => {
    const mq = window.matchMedia("(min-width: 768px)");
    setIsWide(mq.matches);
    const onChange = (e: MediaQueryListEvent) => setIsWide(e.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  useEffect(() => {
    return () => {
      cleanupDragRef.current?.();
    };
  }, []);

  const onSplitDown = (e: React.MouseEvent) => {
    if (!splitRef.current) return;
    cleanupDragRef.current?.();
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
    const cleanup = () => {
      document.body.style.cursor = "";
      document.body.style.userSelect = "";
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup", onUp);
      cleanupDragRef.current = null;
    };
    const onUp = () => {
      cleanup();
    };
    cleanupDragRef.current = cleanup;
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);
  };

  const outerHeight = fullHeight ? "h-full" : "h-[620px] md:h-[520px]";
  const resetTarget = sample ?? initial;
  const canReset = typeof resetTarget === "string" && resetTarget !== source;

  const formatted = useMemo(() => {
    try {
      return formatLessmark(source);
    } catch {
      return null;
    }
  }, [source]);

  const leftStyle = isWide ? { width: `${leftPct}%` } : { width: "100%", flex: "1 1 0%" };
  const rightStyle = isWide ? { width: `${100 - leftPct}%` } : { width: "100%", flex: "1 1 0%" };

  const showViewToggle = !previewToolbar;

  return (
    <div
      className={`flex flex-col overflow-hidden rounded-lg border border-border-soft bg-bg shadow-[0_1px_3px_rgba(17,17,17,0.04),0_1px_2px_rgba(17,17,17,0.04)] ${outerHeight}`}
    >
      <div ref={splitRef} className="flex flex-col md:flex-row flex-1 min-h-0 bg-code-bg">
        <div
          className="flex flex-col text-code-fg min-h-[180px] md:min-h-0 min-w-0"
          style={leftStyle}
        >
          <div className="flex items-center justify-start gap-3 h-9 px-4 text-[12px] text-code-faint shrink-0">
            {canReset && (
              <button
                type="button"
                onClick={() => setSource(resetTarget!)}
                className="text-code-faint hover:text-code-fg transition-colors rounded"
              >
                {uiString("playground.reset")}
              </button>
            )}
            <button
              type="button"
              onClick={() => formatted !== null && setSource(formatted)}
              disabled={formatted === null}
              className="text-code-faint hover:text-code-fg transition-colors rounded disabled:opacity-40 disabled:hover:text-code-faint"
            >
                {uiString("playground.format")}
            </button>
          </div>
          <div className="flex-1 min-h-0 flex flex-col overflow-hidden rounded-tl-xl bg-bg">
            <LessmarkEditor value={source} onChange={setSource} className="flex-1 min-h-0" />
          </div>
        </div>

        <div
          role="separator"
          aria-orientation="vertical"
          onMouseDown={onSplitDown}
          className="hidden md:block relative w-px shrink-0 bg-border-soft hover:bg-fg-muted/40 transition-colors cursor-col-resize"
          title={uiString("playground.resize-title")}
        >
          <span className="absolute inset-y-0 -left-1.5 -right-1.5" />
        </div>

        <div
          className="flex flex-col min-h-[180px] md:min-h-0 min-w-0"
          style={rightStyle}
        >
          <div className="flex items-center justify-end gap-3 h-9 px-4 text-[12px] text-fg-faint shrink-0">
            {showViewToggle ? (
              <ViewToggle value={view} onChange={setView} />
            ) : (
              previewToolbar
            )}
          </div>
          <div className="flex-1 min-h-0 overflow-hidden rounded-tr-xl bg-bg">
            <RightPane source={source} view={showViewToggle ? view : "html"} />
          </div>
        </div>
      </div>
    </div>
  );
}

function ViewToggle({ value, onChange }: { value: View; onChange: (v: View) => void }) {
  const items: Array<{ key: View; label: string }> = [
    { key: "html", label: uiString("playground.view-html") },
    { key: "tree", label: uiString("playground.view-tree") },
    { key: "ast", label: uiString("playground.view-ast") },
  ];
  return (
    <div role="tablist" aria-label={uiString("playground.preview-label")} className="flex items-center gap-3">
      {items.map((item) => {
        const active = item.key === value;
        return (
          <button
            key={item.key}
            type="button"
            role="tab"
            aria-selected={active}
            onClick={() => onChange(item.key)}
            className={
              active
                ? "text-fg transition-colors"
                : "text-fg-faint hover:text-fg transition-colors"
            }
          >
            {item.label}
          </button>
        );
      })}
    </div>
  );
}

function RightPane({ source, view }: { source: string; view: View }) {
  if (view === "html") {
    return (
      <div className="lessmark-scrollbar h-full overflow-auto">
        <div className="px-4 py-4 sm:px-6 sm:py-5">
          <Renderer source={source} />
        </div>
      </div>
    );
  }

  let body: { ok: true; text: string } | { ok: false; message: string; line: number; column: number };
  try {
    const ast = parseLessmark(source);
    if (view === "ast") {
      body = { ok: true, text: JSON.stringify(ast, null, 2) };
    } else {
      body = { ok: true, text: renderTree(ast) };
    }
  } catch (e) {
    const err = e instanceof LessmarkError ? e : new LessmarkError(String((e as Error)?.message ?? e));
    body = { ok: false, message: err.message, line: err.line, column: err.column };
  }

  if (!body.ok) {
    return (
      <div className="lessmark-scrollbar h-full overflow-auto px-4 py-4 sm:px-6 sm:py-5">
        <div className="rounded-md border border-border-soft bg-surface px-3 py-2 text-[13px] leading-[1.55] text-fg-muted">
          <div className="font-sans text-fg">{uiString("preview.paused")}</div>
          <div className="mt-1 font-mono text-[12px] text-fg-faint">{body.message}</div>
          <div className="font-mono text-[12px] text-fg-faint">
            {uiString("playground.error-line")} {body.line}, {uiString("playground.error-column")} {body.column}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="lessmark-scrollbar h-full overflow-auto">
      <pre className="m-0 px-4 py-4 sm:px-6 sm:py-5 font-[var(--font-code)] text-[12px] sm:text-[13px] leading-[1.6] text-code-fg whitespace-pre">
        {body.text}
      </pre>
    </div>
  );
}

type AstNodeShape = {
  type: string;
  name?: string;
  text?: string;
  level?: number;
  attrs?: Record<string, string>;
  children?: unknown[];
  items?: Array<{ text?: string; children?: unknown[] }>;
  columns?: string[];
  rows?: string[][];
};

function renderTree(ast: { children: AstNodeShape[] }) {
  const lines: string[] = ["document"];
  for (const child of ast.children) walk(child, 1, lines);
  return lines.join("\n");
}

function walk(node: AstNodeShape, depth: number, lines: string[]) {
  const indent = "  ".repeat(depth);
  let label = node.type;
  if (node.type === "heading" && typeof node.level === "number") label += ` h${node.level}`;
  if (node.name) label += ` ${node.name}`;
  if (node.text) label += `  "${truncate(node.text)}"`;
  const attrs = node.attrs ? Object.keys(node.attrs) : [];
  if (attrs.length > 0) {
    label += ` {${attrs.map((k) => `${k}=${JSON.stringify(node.attrs![k])}`).join(", ")}}`;
  }
  lines.push(indent + label);
  if (Array.isArray(node.children)) {
    for (const c of node.children) walk(c as AstNodeShape, depth + 1, lines);
  }
  if (Array.isArray(node.items)) {
    for (const item of node.items) {
      lines.push("  ".repeat(depth + 1) + `item  "${truncate(item.text ?? "")}"`);
      if (Array.isArray(item.children)) {
        for (const c of item.children) walk(c as AstNodeShape, depth + 2, lines);
      }
    }
  }
}

function truncate(text: string) {
  const flat = text.replace(/\s+/g, " ").trim();
  return flat.length > 80 ? flat.slice(0, 77) + "..." : flat;
}
