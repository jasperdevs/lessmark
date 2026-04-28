import { useMemo, type CSSProperties } from "react";
import { NavLink, Link } from "react-router-dom";
import { parseLessmark } from "lessmark";
import { GithubIcon } from "@/components/Icons";
import { sourceId } from "@/lib/content";
import { useLiveSource } from "@/lib/live-source";

type AstNode = {
  type: string;
  name?: string;
  text?: string;
  attrs?: Record<string, string>;
};

type HeaderModel = {
  brand: string;
  links: { label: string; href: string }[];
};

const NAV_COLORS = [
  "var(--nav-red)",
  "var(--nav-yellow)",
  "var(--nav-green)",
  "var(--nav-blue)",
];

function navStyle(index: number): CSSProperties {
  return { ["--nav-color" as string]: NAV_COLORS[index % NAV_COLORS.length] };
}

function parseHeader(source: string): HeaderModel {
  const fallback: HeaderModel = {
    brand: "lessmark",
    links: [
      { label: "docs", href: "/docs" },
      { label: "examples", href: "/examples" },
      { label: "playground", href: "/playground" },
      { label: "github", href: "https://github.com/jasperdevs/lessmark" },
    ],
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
  };
}

const navBase = "nav-link text-fg hover:text-fg transition-colors";

export function SiteHeader() {
  const source = useLiveSource(sourceId.chrome("header"));
  const model = useMemo(() => parseHeader(source), [source]);

  return (
    <header
      className="sticky top-0 z-40 py-4 bg-bg"
      style={{ paddingTop: "calc(1rem + env(safe-area-inset-top, 0px))" }}
    >
      <div className="mx-auto max-w-[1080px] px-4 sm:px-6 flex items-center justify-between gap-4">
        <Link
          to="/"
          aria-label={`${model.brand} home`}
          className="inline-flex items-center gap-2 text-[15px] font-bold shrink-0"
        >
          <img src="/lessmarklogowhitebackground.svg" alt="" className="size-6" />
          <span className="max-[380px]:hidden">{model.brand}</span>
        </Link>
        <nav className="flex flex-wrap items-center justify-end gap-x-4 gap-y-1 text-[13px] sm:gap-x-6 sm:text-[14px]">
          {model.links.map((link, i) => {
            const isExternal = /^https?:/.test(link.href);
            const className = `${navBase}${link.label === "github" ? " inline-flex items-center gap-1.5" : ""}`;
            const content = (
              <>
                {link.label === "github" ? <GithubIcon className="size-4" /> : null}
                <span className={link.label === "github" ? "max-[520px]:sr-only" : ""}>
                  {link.label}
                </span>
              </>
            );
            if (isExternal) {
              return (
                <a
                  key={link.href}
                  href={link.href}
                  rel="noopener"
                  style={navStyle(i)}
                  className={className}
                >
                  {content}
                </a>
              );
            }
            return (
              <NavLink
                key={link.href}
                to={link.href}
                style={navStyle(i)}
                className={className}
              >
                {content}
              </NavLink>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
