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
  lineHeight: number;
  from: number;
  items: LessmarkCompletion[];
  active: number;
};

type Hover = {
  x: number;
  y: number;
  text: string;
};

export function LessmarkEditor({ value, onChange, className = "", autoFocus }: Props) {
  const taRef = useRef<HTMLTextAreaElement>(null);
  const preRef = useRef<HTMLPreElement>(null);
  const gutterRef = useRef<HTMLDivElement>(null);
  const wrapRef = useRef<HTMLDivElement>(null);
  const measureRef = useRef<HTMLDivElement>(null);
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

  // Floating popups are positioned in viewport coords. Dismiss on outside
  // scroll/resize so they don't get stranded — but ignore scrolls inside the
  // popup itself so the user can scroll a long completion list.
  useEffect(() => {
    if (!popup && !hover) return;
    const onScroll = (e: Event) => {
      const target = e.target as Node | null;
      if (target instanceof Element && target.closest(".lessmark-completion, .lessmark-hover")) {
        return;
      }
      setPopup(null);
      setHover(null);
    };
    const onResize = () => {
      setPopup(null);
      setHover(null);
    };
    window.addEventListener("scroll", onScroll, true);
    window.addEventListener("resize", onResize);
    return () => {
      window.removeEventListener("scroll", onScroll, true);
      window.removeEventListener("resize", onResize);
    };
  }, [popup, hover]);

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
    const caret = caretPosition(source, ta.selectionStart, ta, measureRef.current);
    setPopup({ ...result, ...caret, active: 0 });
  };

  const applyCompletion = (item: LessmarkCompletion, from: number) => {
    const ta = taRef.current;
    if (!ta) return;
    const cursor = ta.selectionStart;
    const nextCursor = from + (item.cursorOffset ?? item.insert.length);
    // Route through execCommand so the change enters the textarea's native
    // undo stack (ctrl+z / ctrl+shift+z work as expected). Fall back to a
    // controlled-value update if the browser refuses.
    ta.focus();
    ta.setSelectionRange(from, cursor);
    const inserted = document.execCommand("insertText", false, item.insert);
    if (!inserted) {
      const next = value.slice(0, from) + item.insert + value.slice(cursor);
      onChange(next);
    }
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
      // execCommand keeps the indent insertion in the native undo stack.
      const inserted = document.execCommand("insertText", false, "  ");
      if (!inserted) {
        const next = value.slice(0, start) + "  " + value.slice(end);
        onChange(next);
        requestAnimationFrame(() => {
          ta.selectionStart = ta.selectionEnd = start + 2;
        });
      }
    }
  };

  const onMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const ta = taRef.current;
    const wrap = wrapRef.current;
    if (!ta || !wrap) return;
    const metrics = editorMetrics(ta, measureRef.current);
    const rect = ta.getBoundingClientRect();
    const x = e.clientX - rect.left - metrics.paddingLeft + ta.scrollLeft;
    const y = e.clientY - rect.top - metrics.paddingTop + ta.scrollTop;
    const lineIndex = Math.max(0, Math.floor(y / metrics.lineHeight));
    const column = Math.max(0, Math.floor(x / metrics.charWidth));
    const line = value.split("\n")[lineIndex] ?? "";
    const text = docForToken(line, column);
    setHover(text ? { text, x: clamp(e.clientX + 12, 8, window.innerWidth - 360), y: clamp(e.clientY + 12, 8, window.innerHeight - 120) } : null);
  };

  const overlays = portalTarget && (
    <>
      {popup && (
        <div
          className="lessmark-completion"
          style={{ left: popup.x, top: popup.y + popup.lineHeight }}
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
    <div className={`lessmark-editor relative grid grid-cols-[40px_minmax(0,1fr)] min-h-0 min-w-0 ${className}`}>
      <div
        ref={gutterRef}
        aria-hidden
        className="overflow-hidden border-r border-code-line py-3 text-right pr-2 text-code-faint font-[var(--font-code)] text-[13px] leading-[1.6] select-none"
      >
        {Array.from({ length: lineCount }, (_, i) => (
          <div key={i}>{i + 1}</div>
        ))}
      </div>
      <div ref={wrapRef} className="relative isolate min-w-0" onMouseMove={onMouseMove} onMouseLeave={() => setHover(null)}>
        <pre
          ref={preRef}
          aria-hidden
          className="lessmark-editor-code lessmark-scrollbar absolute inset-0 z-0 m-0 p-3 overflow-auto whitespace-pre font-[var(--font-code)] text-[13px] leading-[1.6] text-code-fg pointer-events-none"
          dangerouslySetInnerHTML={{ __html: highlighted + "\n" }}
        />
        <div
          ref={measureRef}
          aria-hidden
          className="lessmark-editor-code lessmark-editor-measure whitespace-pre font-[var(--font-code)] text-[13px] leading-[1.6]"
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
          className="lessmark-editor-code lessmark-scrollbar absolute inset-0 z-10 m-0 p-3 w-full h-full resize-none bg-transparent border-0 outline-none whitespace-pre font-[var(--font-code)] text-[13px] leading-[1.6] text-transparent caret-code-fg selection:bg-code-line"
        />
      </div>
      {overlays ? createPortal(overlays, portalTarget) : null}
    </div>
  );
}

function caretPosition(value: string, cursor: number, ta: HTMLTextAreaElement, measure: HTMLDivElement | null) {
  const rect = ta.getBoundingClientRect();
  const metrics = editorMetrics(ta, measure);
  const before = value.slice(0, cursor);
  const lines = before.split("\n");
  const line = lines.length - 1;
  const column = lines[lines.length - 1].length;
  return {
    x: clamp(rect.left + metrics.paddingLeft + column * metrics.charWidth - ta.scrollLeft, 8, window.innerWidth - 380),
    y: clamp(rect.top + metrics.paddingTop + line * metrics.lineHeight - ta.scrollTop, 8, window.innerHeight - 260),
    lineHeight: metrics.lineHeight,
  };
}

function editorMetrics(ta: HTMLTextAreaElement, measure: HTMLDivElement | null) {
  const style = getComputedStyle(ta);
  const lineHeight = Number.parseFloat(style.lineHeight) || Number.parseFloat(style.fontSize) * 1.6 || 20;
  const paddingLeft = Number.parseFloat(style.paddingLeft) || 0;
  const paddingTop = Number.parseFloat(style.paddingTop) || 0;
  let charWidth = 0;
  if (measure) {
    measure.style.font = style.font;
    measure.style.letterSpacing = style.letterSpacing;
    measure.textContent = "mmmmmmmmmm";
    charWidth = measure.getBoundingClientRect().width / 10;
  }
  return { charWidth: Number.isFinite(charWidth) && charWidth > 0 ? charWidth : 8, lineHeight, paddingLeft, paddingTop };
}

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}
