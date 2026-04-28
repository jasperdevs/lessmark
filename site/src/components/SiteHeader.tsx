import { useEffect, useState, type CSSProperties } from "react";
import { NavLink, Link, useLocation } from "react-router-dom";
import { GithubIcon } from "@/components/Icons";

const navBase = "nav-link text-fg hover:text-fg transition-colors";

const navColors = {
  docs: "var(--nav-red)",
  examples: "var(--nav-yellow)",
  playground: "var(--nav-green)",
  github: "var(--nav-blue)",
} as const;

function navStyle(key: keyof typeof navColors): CSSProperties {
  return { ["--nav-color" as string]: navColors[key] };
}

export function SiteHeader() {
  const { pathname } = useLocation();
  const isHome = pathname === "/" || pathname === "";
  const [pastHero, setPastHero] = useState(false);

  useEffect(() => {
    if (!isHome) {
      setPastHero(true);
      return;
    }
    setPastHero(false);
    const target = document.querySelector("[data-hero]") as HTMLElement | null;
    if (!target) return;
    const io = new IntersectionObserver(
      ([entry]) => setPastHero(!entry.isIntersecting),
      { rootMargin: "-40px 0px 0px 0px", threshold: 0 },
    );
    io.observe(target);
    return () => io.disconnect();
  }, [isHome, pathname]);

  const showLogo = !isHome || pastHero;

  return (
    <header
      className="sticky top-0 z-40 py-4 bg-bg"
      style={{ paddingTop: "calc(1rem + env(safe-area-inset-top, 0px))" }}
    >
      <div
        className={`mx-auto max-w-[1080px] px-6 flex items-center transition-all duration-300 ease-out ${
          showLogo ? "justify-between" : "justify-center"
        }`}
      >
        <Link
          to="/"
          aria-label="lessmark home"
          className={`inline-flex items-center gap-2 text-[15px] font-bold transition-all duration-300 ease-out ${
            showLogo
              ? "opacity-100 translate-x-0"
              : "opacity-0 -translate-x-2 pointer-events-none absolute"
          }`}
        >
          <img src="/lessmarklogowhitebackground.svg" alt="" className="size-6" />
          <span>lessmark</span>
        </Link>
        <nav className="flex items-center gap-6 text-[14px]">
          <NavLink
            to="/docs"
            style={navStyle("docs")}
            className={({ isActive }) => `${navBase} ${isActive ? "is-active" : ""}`}
          >
            docs
          </NavLink>
          <NavLink
            to="/examples"
            style={navStyle("examples")}
            className={({ isActive }) => `${navBase} ${isActive ? "is-active" : ""}`}
          >
            examples
          </NavLink>
          <NavLink
            to="/playground"
            style={navStyle("playground")}
            className={({ isActive }) => `${navBase} ${isActive ? "is-active" : ""}`}
          >
            playground
          </NavLink>
          <a
            href="https://github.com/jasperdevs/lessmark"
            rel="noopener"
            style={navStyle("github")}
            className={`${navBase} inline-flex items-center gap-1.5`}
          >
            <GithubIcon className="size-4" />
            github
          </a>
        </nav>
      </div>
    </header>
  );
}
