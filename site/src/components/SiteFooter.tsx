import { useMemo, useState } from "react";
import { SourcePanel, type PanelFile } from "@/components/SourcePanel";
import { docs, examples, switching, sourceId } from "@/lib/content";
import { useTheme } from "@/lib/theme";
import { GithubIcon, MoonIcon, SunIcon } from "@/components/Icons";

function allSiteFiles(): PanelFile[] {
  const out: PanelFile[] = [{ id: sourceId.home(), name: "home.mu" }];
  for (const d of docs) {
    out.push({ id: sourceId.doc(d.slug), name: `docs/${d.slug}.mu` });
  }
  for (const e of examples) {
    out.push({ id: sourceId.example(e.slug), name: `examples/${e.slug}.mu` });
  }
  for (const s of switching) {
    out.push({ id: sourceId.switching(s.slug), name: `switching/${s.slug}.mu` });
  }
  return out;
}

export function SiteFooter() {
  const [open, setOpen] = useState(false);
  const [theme, toggleTheme] = useTheme();
  const files = useMemo(() => allSiteFiles(), []);
  const isDark = theme === "dark";

  return (
    <>
      <footer className="mt-auto">
        <div className="mx-auto max-w-[1080px] px-6 py-8 flex flex-col md:flex-row gap-6 md:gap-4 md:items-center md:justify-between text-[13px] font-mono">
          <div className="flex flex-col gap-1.5">
            <div className="flex items-center gap-2 text-fg">
              <img src="/lessmarklogowhitebackground.svg" alt="" className="size-4" />
              <span>lessmark</span>
              <span className="text-fg-faint">·</span>
              <a
                href="https://github.com/jasperdevs/lessmark/blob/main/LICENSE"
                rel="noopener"
                className="text-fg-muted hover:text-fg transition-colors"
              >
                MIT
              </a>
            </div>
            <div className="flex items-center gap-3 text-fg-muted">
              <a
                href="https://github.com/jasperdevs/lessmark"
                rel="noopener"
                className="inline-flex items-center gap-1.5 hover:text-fg transition-colors"
              >
                <GithubIcon className="size-3.5" />
                github
              </a>
              <a
                href="https://x.com/jasperdevs"
                rel="noopener"
                className="hover:text-fg transition-colors"
              >
                @jasperdevs
              </a>
              <a
                href="mailto:jasper.mceligott@gmail.com"
                className="hover:text-fg transition-colors"
              >
                contact
              </a>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={toggleTheme}
              aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
              className="inline-flex items-center gap-2 rounded-md border border-border bg-surface px-3 py-1.5 text-fg hover:bg-surface-alt transition-colors"
            >
              {isDark ? <SunIcon className="size-4" /> : <MoonIcon className="size-4" />}
              <span>{isDark ? "Light" : "Dark"}</span>
            </button>
            <button
              type="button"
              onClick={() => setOpen(true)}
              className="inline-flex items-center gap-2 rounded-md border border-border-soft bg-surface px-3 py-1.5 text-fg hover:bg-surface-alt transition-colors"
            >
              <span>this site was built with lessmark</span>
              <span className="text-fg-faint">→</span>
            </button>
          </div>
        </div>
      </footer>
      <SourcePanel open={open} files={files} onClose={() => setOpen(false)} />
    </>
  );
}
