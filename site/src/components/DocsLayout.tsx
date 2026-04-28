import { NavLink } from "react-router-dom";
import type { ReactNode } from "react";
import { docs } from "@/lib/content";

type Props = { children: ReactNode };

export function DocsLayout({ children }: Props) {
  return (
    <div className="mx-auto max-w-[1080px] px-6 py-10 grid gap-10 md:grid-cols-[220px_1fr]">
      <aside className="md:sticky md:top-20 md:self-start">
        <div className="text-[13px] font-mono text-fg-muted mb-3">
          docs
        </div>
        <nav className="flex flex-col gap-0.5 text-[14px]">
          {docs.map((d) => (
            <NavLink
              key={d.slug}
              to={`/docs/${d.slug}`}
              className={({ isActive }) =>
                `px-3 py-1.5 rounded-md transition-colors ${
                  isActive
                    ? "bg-surface-alt text-fg"
                    : "text-fg-muted hover:text-fg hover:bg-surface-alt/60"
                }`
              }
            >
              {d.title}
            </NavLink>
          ))}
        </nav>
      </aside>
      <div className="min-w-0">{children}</div>
    </div>
  );
}
