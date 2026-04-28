import type { LessmarkAst } from "@/lib/lessmark";

const blockMeta: Record<string, { label: string; tone: "default" | "warn" | "info" }> = {
  summary: { label: "summary", tone: "default" },
  decision: { label: "decision", tone: "default" },
  constraint: { label: "constraint", tone: "default" },
  task: { label: "task", tone: "default" },
  file: { label: "file", tone: "default" },
  code: { label: "code", tone: "default" },
  example: { label: "example", tone: "default" },
  note: { label: "note", tone: "info" },
  warning: { label: "warning", tone: "warn" },
  api: { label: "api", tone: "default" },
  link: { label: "link", tone: "default" },
  metadata: { label: "metadata", tone: "info" },
  risk: { label: "risk", tone: "warn" },
  "depends-on": { label: "depends-on", tone: "default" },
};

const taskTone: Record<string, string> = {
  todo: "bg-surface-alt text-fg",
  doing: "bg-[#FFEFB0] text-[#3a2a00]",
  done: "bg-[#A6E3A1]/40 text-[#1f3a1f]",
  blocked: "bg-[#fecaca] text-[#7f1d1d]",
};

export function Renderer({ ast }: { ast: LessmarkAst }) {
  return (
    <div className="space-y-5">
      {ast.children.map((node, i) => {
        if (node.type === "heading") {
          const Tag = `h${Math.min(node.level + 1, 6)}` as "h2";
          const sizes: Record<number, string> = {
            1: "text-[28px] leading-[1.2] font-serif",
            2: "text-[22px] leading-[1.25] font-serif",
            3: "text-[18px] font-medium",
            4: "text-[16px] font-medium",
            5: "text-[15px] font-medium",
            6: "text-[14px] font-medium",
          };
          return (
            <Tag key={i} className={`${sizes[node.level]} text-fg tracking-tight mt-2`}>
              {node.text}
            </Tag>
          );
        }
        const meta = blockMeta[node.name] ?? { label: node.name, tone: "default" as const };
        const ring =
          meta.tone === "warn"
            ? "border-[#fecaca]"
            : meta.tone === "info"
            ? "border-[#bfdbfe]"
            : "border-border";

        if (node.name === "task") {
          const status = node.attrs.status;
          return (
            <div key={i} className="flex items-start gap-3">
              <span className={`mt-0.5 inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-mono ${taskTone[status] ?? "bg-surface-alt text-fg"}`}>
                {status}
              </span>
              <p className="text-fg leading-[1.55]">{node.text}</p>
            </div>
          );
        }

        if (node.name === "link") {
          return (
            <p key={i} className="text-fg leading-[1.55]">
              <a className="underline decoration-fg-faint underline-offset-2 hover:decoration-fg" href={node.attrs.href}>
                {node.text || node.attrs.href}
              </a>
            </p>
          );
        }

        if (node.name === "code") {
          return (
            <div key={i} className="rounded-[12px] overflow-hidden border border-border-soft bg-code-bg">
              <div className="px-3 py-2 border-b border-code-line font-mono text-[11px] text-code-faint">
                {node.attrs.lang || "text"}
              </div>
              <pre className="m-0 p-4 overflow-auto whitespace-pre-wrap text-code-fg font-mono text-[13px] leading-[1.55]">
                {node.text}
              </pre>
            </div>
          );
        }

        return (
          <div key={i} className={`rounded-[12px] border ${ring} bg-surface p-4`}>
            <div className="flex items-baseline gap-2 mb-1">
              <span className="font-mono text-[11px] tracking-wide text-fg-muted">@{meta.label}</span>
              {Object.entries(node.attrs).map(([k, v]) => (
                <span key={k} className="font-mono text-[11px] text-fg-faint">
                  {k}=<span className="text-fg">{`"${v}"`}</span>
                </span>
              ))}
            </div>
            <p className="text-fg leading-[1.55] whitespace-pre-wrap">{node.text}</p>
          </div>
        );
      })}
    </div>
  );
}
