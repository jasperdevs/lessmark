import { useEffect, useMemo, useRef, useState } from "react";
import { parseLessmark } from "lessmark";
import { SourcePanel, type PanelFile } from "@/components/SourcePanel";
import { docs, examples, switching, sourceId } from "@/lib/content";
import { useLiveSource } from "@/lib/live-source";
import { useTheme } from "@/lib/theme";
import { GithubIcon, MailIcon, MoonIcon, SunIcon, VSCodeIcon, XIcon } from "@/components/Icons";
import { FooterMark } from "@/components/PixelIcons";

function iconFor(href: string) {
  if (href.startsWith("mailto:")) return MailIcon;
  try {
    const host = new URL(href).hostname.replace(/^www\./, "");
    if (host === "github.com") return GithubIcon;
    if (host === "x.com" || host === "twitter.com") return XIcon;
    if (host === "marketplace.visualstudio.com" || host === "open-vsx.org") return VSCodeIcon;
  } catch {
    // not a URL — fall through
  }
  return null;
}

type FooterModel = {
  brand: string;
  links: { label: string; href: string }[];
  darkLabel: string;
  lightLabel: string;
  sourceButton: string;
};

type AstNode = {
  type: string;
  name?: string;
  text?: string;
  attrs?: Record<string, string>;
};

function parseFooter(source: string): FooterModel {
  const fallback: FooterModel = {
    brand: "lessmark",
    links: [],
    darkLabel: "dark mode",
    lightLabel: "light mode",
    sourceButton: "this site was built with lessmark →",
  };
  if (!source) return fallback;
  let ast: { children: AstNode[] };
  try {
    ast = parseLessmark(source) as { children: AstNode[] };
  } catch {
    return fallback;
  }
  const meta: Record<string, string> = {};
  const links: { label: string; href: string }[] = [];
  for (const node of ast.children) {
    if (node.type === "block" && node.name === "metadata" && node.attrs?.key) {
      meta[node.attrs.key] = (node.text ?? "").trim();
    } else if (node.type === "block" && node.name === "nav" && node.attrs?.label && node.attrs?.href) {
      links.push({ label: node.attrs.label, href: node.attrs.href });
    }
  }
  return {
    brand: meta.brand || fallback.brand,
    links: links.length ? links : fallback.links,
    darkLabel: meta["dark-label"] || fallback.darkLabel,
    lightLabel: meta["light-label"] || fallback.lightLabel,
    sourceButton: meta["source-button"] || fallback.sourceButton,
  };
}

function allSiteFiles(): PanelFile[] {
  const out: PanelFile[] = [
    { id: sourceId.home(), name: "home.lmk" },
    { id: sourceId.chrome("header"), name: "chrome/header.lmk" },
    { id: sourceId.chrome("footer"), name: "chrome/footer.lmk" },
    { id: sourceId.chrome("ui"), name: "chrome/ui.lmk" },
  ];
  for (const d of docs) {
    out.push({ id: sourceId.doc(d.slug), name: `docs/${d.slug}.lmk` });
  }
  for (const e of examples) {
    out.push({ id: sourceId.example(e.slug), name: `examples/${e.slug}.lmk` });
  }
  for (const s of switching) {
    out.push({ id: sourceId.switching(s.slug), name: `switching/${s.slug}.lmk` });
  }
  return out;
}

export function SiteFooter() {
  const [open, setOpen] = useState(false);
  const [artVisible, setArtVisible] = useState(false);
  const artRef = useRef<HTMLDivElement>(null);
  const [theme, toggleTheme] = useTheme();
  const files = useMemo(() => allSiteFiles(), []);
  const isDark = theme === "dark";
  const source = useLiveSource(sourceId.chrome("footer"));
  const model = useMemo(() => parseFooter(source), [source]);

  useEffect(() => {
    const el = artRef.current;
    if (!el) return;
    if (!("IntersectionObserver" in window)) {
      setArtVisible(true);
      return;
    }
    const observer = new IntersectionObserver(
      ([entry]) => {
        setArtVisible(entry.isIntersecting);
      },
      { rootMargin: "160px 0px", threshold: 0.2 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <>
      <footer className="mt-auto">
        <div ref={artRef} className="mx-auto max-w-[1080px] px-3 sm:px-6 pt-8">
          <FooterMark className="footer-pixel-art w-full h-auto text-fg-faint" animated={artVisible} />
        </div>
        <div className="mx-auto max-w-[1080px] px-4 sm:px-6 pt-4 pb-10 flex flex-col gap-6 md:flex-row md:items-baseline md:justify-between text-[13px] text-fg-muted">
          <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
            {model.links.map((link) => {
              const Icon = iconFor(link.href);
              return (
                <a
                  key={link.href}
                  href={link.href}
                  rel="noopener"
                  className="inline-flex items-center gap-1.5 hover:text-fg transition-colors underline underline-offset-4 decoration-fg-faint hover:decoration-fg"
                >
                  {Icon ? <Icon className="size-3.5" /> : null}
                  {link.label}
                </a>
              );
            })}
          </div>
          <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
            <button
              type="button"
              onClick={toggleTheme}
              aria-label={isDark ? model.lightLabel : model.darkLabel}
              className="inline-flex items-center gap-1.5 hover:text-fg transition-colors underline underline-offset-4 decoration-fg-faint hover:decoration-fg"
            >
              {isDark ? <SunIcon className="size-3.5" /> : <MoonIcon className="size-3.5" />}
              <span>{isDark ? model.lightLabel : model.darkLabel}</span>
            </button>
            <button
              type="button"
              onClick={() => setOpen(true)}
              className="hover:text-fg transition-colors underline underline-offset-4 decoration-fg-faint hover:decoration-fg"
            >
              {model.sourceButton}
            </button>
          </div>
        </div>
      </footer>
      <SourcePanel open={open} files={files} onClose={() => setOpen(false)} />
    </>
  );
}
