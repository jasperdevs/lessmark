import { useEffect, useState } from "react";
import { LessmarkEditor } from "@/components/LessmarkEditor";
import { useLiveSourceCtx } from "@/lib/live-source";

export type PanelFile = { id: string; name: string };

type Props = {
  open: boolean;
  files: PanelFile[];
  onClose: () => void;
};

export function SourcePanel({ open, files, onClose }: Props) {
  const ctx = useLiveSourceCtx();
  const [activeId, setActiveId] = useState<string>(files[0]?.id ?? "");

  useEffect(() => {
    if (files.length === 0) return;
    const exists = files.some((f) => f.id === activeId);
    if (!exists) setActiveId(files[0].id);
  }, [files, activeId]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  const value = ctx.get(activeId);
  const dirty = ctx.isOverridden(activeId);

  return (
    <aside
      role="dialog"
      aria-label="Edit page source"
      aria-hidden={!open}
      className={`fixed inset-y-0 right-0 z-50 w-[min(560px,100vw)] bg-code-bg text-code-fg border-l border-code-line flex flex-col transition-transform duration-200 ease-out ${
        open ? "translate-x-0" : "translate-x-full"
      }`}
      style={{ paddingTop: "env(safe-area-inset-top, 0px)" }}
    >
      <div className="flex items-center justify-between gap-2 px-3 h-12 border-b border-code-line text-[12px] font-mono">
        <div className="flex items-center gap-1 overflow-x-auto">
          {files.map((f) => (
            <button
              key={f.id}
              type="button"
              onClick={() => setActiveId(f.id)}
              className={`px-2 h-8 rounded-md whitespace-nowrap transition-colors ${
                f.id === activeId
                  ? "bg-code-line/80 text-code-fg"
                  : "text-code-faint hover:text-code-fg hover:bg-code-line/40"
              }`}
            >
              {f.name}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-1">
          {dirty && (
            <button
              type="button"
              onClick={() => ctx.reset(activeId)}
              className="px-2 h-8 rounded-md text-code-faint hover:text-code-fg hover:bg-code-line/40 transition-colors"
            >
              reset
            </button>
          )}
          <button
            type="button"
            onClick={onClose}
            className="px-2 h-8 rounded-md text-code-faint hover:text-code-fg hover:bg-code-line/40 transition-colors"
            aria-label="Close source panel"
          >
            close
          </button>
        </div>
      </div>
      <div className="px-3 py-1.5 border-b border-code-line text-[11px] font-mono text-code-faint flex items-center justify-between">
        <span>edits update the page live</span>
        {dirty && <span className="text-[var(--code-key)]">modified</span>}
      </div>
      <LessmarkEditor value={value} onChange={(next) => ctx.set(activeId, next)} className="flex-1 overflow-hidden" />
    </aside>
  );
}
