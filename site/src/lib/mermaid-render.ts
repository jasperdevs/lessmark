import { useEffect, type RefObject } from "react";

let mermaidPromise: Promise<typeof import("mermaid").default> | null = null;

function loadMermaid() {
  if (!mermaidPromise) {
    mermaidPromise = import("mermaid").then((m) => {
      const mermaid = m.default;
      mermaid.initialize({
        startOnLoad: false,
        securityLevel: "strict",
        fontFamily: "Inter, system-ui, sans-serif",
        themeVariables: {
          background: "transparent",
          primaryColor: "#FFFFFF",
          primaryBorderColor: "#111111",
          primaryTextColor: "#111111",
          lineColor: "#3A3A3A",
          textColor: "#111111",
          secondaryColor: "#F4F4F5",
          tertiaryColor: "#FFFFFF",
        },
      });
      return mermaid;
    });
  }
  return mermaidPromise;
}

let counter = 0;

/**
 * Render every <figure class="lessmark-diagram" data-kind="mermaid"> inside
 * the ref'd container. Mermaid is dynamically imported, so the bundle only
 * pays the cost when a diagram is actually present.
 */
export function useMermaid(ref: RefObject<HTMLElement | null>, key: unknown) {
  useEffect(() => {
    const root = ref.current;
    if (!root) return;
    const figures = root.querySelectorAll<HTMLElement>(
      'figure.lessmark-diagram[data-kind="mermaid"]:not([data-mermaid-rendered])',
    );
    if (figures.length === 0) return;

    let cancelled = false;
    loadMermaid().then(async (mermaid) => {
      for (const fig of Array.from(figures)) {
        if (cancelled) return;
        const codeEl = fig.querySelector("code");
        const source = (codeEl?.textContent ?? "").trim();
        if (!source) continue;
        const id = `mermaid-${++counter}`;
        try {
          // Parse first. If invalid, mermaid throws here without injecting any
          // DOM, so the docs page stays clean and the original code stays.
          await mermaid.parse(source);
          const { svg } = await mermaid.render(id, source);
          if (cancelled) return;
          fig.innerHTML = svg;
          fig.setAttribute("data-mermaid-rendered", "true");
        } catch (err) {
          fig.setAttribute("data-mermaid-error", "true");
          // eslint-disable-next-line no-console
          console.warn("mermaid render failed", err);
        }
      }
      // Mermaid leaves transient elements in document.body during render;
      // sweep them so a failed render does not leak a "syntax error" SVG.
      document
        .querySelectorAll("body > [id^='dmermaid-'], body > [id^='mermaid-']")
        .forEach((n) => n.parentElement === document.body && n.remove());
    });

    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ref, key]);
}
