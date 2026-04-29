import { NavLink } from "react-router-dom";
import type { ReactNode } from "react";
import { docs, uiText } from "@/lib/content";
import { PixelDoc, PixelOk, PixelSpark } from "@/components/PixelIcons";

type Props = { children: ReactNode };

export function DocsLayout({ children }: Props) {
  return (
    <div className="mx-auto max-w-[1080px] px-4 sm:px-6 py-8 sm:py-10 grid gap-8 md:gap-10 md:grid-cols-[220px_1fr]">
      <aside className="md:sticky md:top-20 md:self-start">
        <div className="text-[12px] text-fg-faint mb-3 inline-flex items-center gap-1.5">
          <PixelDoc className="size-4" />
          {uiText["docs.sidebar-label"] || "Docs"}
        </div>
        <nav className="flex flex-wrap gap-x-4 gap-y-1 text-[14px] md:flex-col">
          {docs.map((d, i) => {
            const Mark = i % 3 === 0 ? PixelSpark : i % 3 === 1 ? PixelOk : PixelDoc;
            return (
            <NavLink
              key={d.slug}
              to={`/docs/${d.slug}`}
              className={({ isActive }) =>
                `py-1 transition-colors ${
                  isActive
                    ? "text-fg font-semibold underline underline-offset-4 decoration-fg"
                    : "text-fg-muted hover:text-fg hover:underline underline-offset-4 decoration-fg-faint hover:decoration-fg"
                }`
              }
            >
              <span className="inline-flex items-center gap-1.5">
                <Mark className="size-3.5" />
                {d.title}
              </span>
            </NavLink>
          );
          })}
        </nav>
      </aside>
      <div className="min-w-0">{children}</div>
    </div>
  );
}
