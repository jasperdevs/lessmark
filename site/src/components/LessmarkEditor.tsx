import { useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { highlightLessmark } from "@/lib/highlight";
import { completionsFor, docForToken, type LessmarkCompletion } from "@/lib/lessmark-language";

type Props = {
  value: string;
  onChange: (next: string) => void;
  className?: string;
  autoFocus?: boolean;
};

type Popup = {
  x: number;
  y: number;
  from: number;
  items: LessmarkCompletion[];
  active: number;
};

type Hover = {
  x: number;
  y: number;
  text: string;
};

const LINE_HEIGHT = 20.8;
const CHAR_WIDTH = 7.85;

export function LessmarkEditor({ value, onChange, className = "", autoFocus }: Props) {
  const taRef = useRef<HTMLTextAreaElement>(null);
  const preRef = useRef<HTMLPreElement>(null);
  const gutterRef = useRef<HTMLDivElement>(null);
  const wrapRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const highlighted = useMemo(() => highlightLessmark(value), [value]);
  const lineCount = useMemo(() => value.split("\n").length, [value]);
  const [popup, setPopup] = useState<Popup | null>(null);
  const [hover, setHover] = useState<Hover | null>(null);
  const portalTarget = typeof document === "undefined" ? null : document.body;

  useEffect(() => {
    if (autoFocus) taRef.current?.focus();
  }, [autoFocus]);

  useEffect(() => {
    if (!popup) return;
    itemRefs.current[popup.active]?.scrollIntoView({ block: "nearest" });
  }, [popup]);

  const syncScroll = () => {
    const ta = taRef.current, pre = preRef.current, gutter = gutterRef.current;
    if (!ta || !pre || !gutter) return;
    pre.scrollTop = ta.scrollTop;
    pre.scrollLeft = ta.scrollLeft;
    gutter.scrollTop = ta.scrollTop;
  };

  const updateCompletion = () => {
    const ta = taRef.current;
    const wrap = wrapRef.current;
    if (!ta || !wrap) return;
    const source = ta.value;
    const result = completionsFor(source, ta.selectionStart);
    if (!result || result.items.length === 0) {
      setPopup(null);
      return;
    }
    const rect = wrap.getBoundingClientRect();
    const caret = caretPosition(source, ta.selectionStart, ta.scrollLeft, ta.scrollTop, rect);
    setPopup({ ...result, ...caret, active: 0 });
  };

  const applyCompletion = (item: LessmarkCompletion, from: number) => {
    const ta = taRef.current;
    if (!ta) return;
    const cursor = ta.selectionStart;
    const next = value.slice(0, from) + item.insert + value.slice(cursor);
    const nextCursor = from + (item.cursorOffset ?? item.insert.length);
    onChange(next);
    setPopup(null);
    requestAnimationFrame(() => {
      ta.focus();
      ta.selectionStart = ta.selectionEnd = nextCursor;
      syncScroll();
    });
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (popup && (e.key === "ArrowDown" || e.key === "ArrowUp")) {
      e.preventDefault();
      const direction = e.key === "ArrowDown" ? 1 : -1;
      setPopup({ ...popup, active: (popup.active + direction + popup.items.length) % popup.items.length });
      return;
    }
    if (popup && (e.key === "Enter" || e.key === "Tab")) {
      e.preventDefault();
      applyCompletion(popup.items[popup.active], popup.from);
      return;
    }
    if (popup && e.key === "Escape") {
      e.preventDefault();
      setPopup(null);
      return;
    }
    if (e.key === "Tab") {
      e.preventDefault();
      const ta = e.currentTarget;
      const start = ta.selectionStart, end = ta.selectionEnd;
      const next = value.slice(0, start) + "  " + value.slice(end);
      onChange(next);
      requestAnimationFrame(() => {
        ta.selectionStart = ta.selectionEnd = start + 2;
      });
    }
  };

  const onMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const ta = taRef.current;
    const wrap = wrapRef.current;
    if (!ta || !wrap) return;
    const rect = wrap.getBoundingClientRect();
    const x = e.clientX - rect.left - 12 + ta.scrollLeft;
    const y = e.clientY - rect.top - 12 + ta.scrollTop;
    const lineIndex = Math.max(0, Math.floor(y / LINE_HEIGHT));
    const column = Math.max(0, Math.floor(x / CHAR_WIDTH));
    const line = value.split("\n")[lineIndex] ?? "";
    const text = docForToken(line, column);
    setHover(text ? { text, x: clamp(e.clientX + 12, 8, window.innerWidth - 360), y: clamp(e.clientY + 12, 8, window.innerHeight - 120) } : null);
  };

  const overlays = portalTarget && (
    <>
      {popup && (
        <div
          className="lessmark-completion"
          style={{ left: popup.x, top: popup.y + LINE_HEIGHT }}
          role="listbox"
        >
          {popup.items.map((item, index) => (
            <button
              key={item.label}
              type="button"
              ref={(node) => {
                itemRefs.current[index] = node;
              }}
              className={index === popup.active ? "active" : ""}
              role="option"
              aria-selected={index === popup.active}
              onMouseDown={(e) => {
                e.preventDefault();
                applyCompletion(item, popup.from);
              }}
            >
              <span>{item.label}</span>
              <small>{item.detail}</small>
            </button>
          ))}
        </div>
      )}
      {hover && (
        <div className="lessmark-hover" style={{ left: hover.x, top: hover.y }}>
          {hover.text}
        </div>
      )}
    </>
  );

  return (
    <div className={`relative grid grid-cols-[40px_1fr] min-h-0 ${className}`}>
      <div
        ref={gutterRef}
        aria-hidden
        className="overflow-hidden border-r border-code-line py-3 text-right pr-2 text-code-faint font-[var(--font-code)] text-[12px] leading-[1.6] select-none"
      >
        {Array.from({ length: lineCount }, (_, i) => (
          <div key={i}>{i + 1}</div>
        ))}
      </div>
      <div ref={wrapRef} className="relative" onMouseMove={onMouseMove} onMouseLeave={() => setHover(null)}>
        <pre
          ref={preRef}
          aria-hidden
          className="absolute inset-0 m-0 p-3 overflow-auto whitespace-pre font-[var(--font-code)] text-[13px] leading-[1.6] text-code-fg pointer-events-none"
          dangerouslySetInnerHTML={{ __html: highlighted + "\n" }}
        />
        <textarea
          ref={taRef}
          value={value}
          onChange={(e) => {
            onChange(e.target.value);
            requestAnimationFrame(updateCompletion);
          }}
          onClick={() => {
            requestAnimationFrame(updateCompletion);
          }}
          onKeyDown={onKeyDown}
          onKeyUp={(e) => {
            if (e.key === "ArrowDown" || e.key === "ArrowUp" || e.key === "Enter" || e.key === "Tab" || e.key === "Escape") return;
            requestAnimationFrame(updateCompletion);
          }}
          onScroll={syncScroll}
          spellCheck={false}
          className="absolute inset-0 m-0 p-3 w-full h-full resize-none bg-transparent border-0 outline-none whitespace-pre font-[var(--font-code)] text-[13px] leading-[1.6] text-transparent caret-code-fg selection:bg-code-line"
        />
      </div>
      {overlays ? createPortal(overlays, portalTarget) : null}
    </div>
  );
}

function caretPosition(value: string, cursor: number, scrollLeft: number, scrollTop: number, rect: DOMRect) {
  const before = value.slice(0, cursor);
  const lines = before.split("\n");
  const line = lines.length - 1;
  const column = lines[lines.length - 1].length;
  return {
    x: clamp(rect.left + 12 + column * CHAR_WIDTH - scrollLeft, 8, window.innerWidth - 380),
    y: clamp(rect.top + 12 + line * LINE_HEIGHT - scrollTop, 8, window.innerHeight - 260),
  };
}

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}
