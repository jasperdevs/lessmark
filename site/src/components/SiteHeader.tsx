import { useEffect, useState } from "react";
import { NavLink, Link, useLocation } from "react-router-dom";
import { GithubIcon } from "@/components/Icons";

const navItem = "text-fg-muted hover:text-fg transition-colors";
const navItemActive = "text-fg";

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
          className={`inline-flex items-center gap-2 text-[14px] font-medium transition-all duration-300 ease-out ${
            showLogo
              ? "opacity-100 translate-x-0"
              : "opacity-0 -translate-x-2 pointer-events-none absolute"
          }`}
        >
          <img src="/lessmarklogowhitebackground.svg" alt="" className="size-5" />
          <span>lessmark</span>
        </Link>
        <nav className="flex items-center gap-5 text-[14px]">
          <NavLink
            to="/docs"
            className={({ isActive }) => `${navItem} ${isActive ? navItemActive : ""}`}
          >
            docs
          </NavLink>
          <NavLink
            to="/examples"
            className={({ isActive }) => `${navItem} ${isActive ? navItemActive : ""}`}
          >
            examples
          </NavLink>
          <NavLink
            to="/playground"
            className={({ isActive }) => `${navItem} ${isActive ? navItemActive : ""}`}
          >
            playground
          </NavLink>
          <a
            href="https://github.com/jasperdevs/lessmark"
            rel="noopener"
            className={`${navItem} inline-flex items-center gap-1.5`}
          >
            <GithubIcon className="size-4" />
            github
          </a>
        </nav>
      </div>
    </header>
  );
}
