import { useEffect, type RefObject } from "react";

const COPY_SVG = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="9" y="9" width="11" height="11" rx="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>`;
const CHECK_SVG = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="20 6 9 17 4 12"></polyline></svg>`;

async function copyText(text: string): Promise<boolean> {
  try {
    if (navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(text);
      return true;
    }
  } catch {
    // fall through to the legacy path
  }
  try {
    const ta = document.createElement("textarea");
    ta.value = text;
    ta.setAttribute("readonly", "");
    ta.style.position = "fixed";
    ta.style.left = "-9999px";
    ta.style.top = "0";
    document.body.appendChild(ta);
    ta.select();
    const ok = document.execCommand("copy");
    document.body.removeChild(ta);
    return ok;
  } catch {
    return false;
  }
}

/**
 * Attach a "copy" button to every <pre> element inside the ref'd container.
 * Site-level decoration only; the lessmark grammar/parser is unaffected.
 */
export function useCodeCopyButtons(
  ref: RefObject<HTMLElement | null>,
  key: unknown,
) {
  useEffect(() => {
    const root = ref.current;
    if (!root) return;
    const cleanups: Array<() => void> = [];
    root.querySelectorAll<HTMLPreElement>("pre").forEach((pre) => {
      if (pre.querySelector(":scope > .code-copy-btn")) return;
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "code-copy-btn";
      btn.setAttribute("aria-label", "Copy code");
      btn.innerHTML = COPY_SVG;
      let timer: number | undefined;
      const onClick = async (e: MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        const codeEl = pre.querySelector("code");
        const code = (codeEl?.textContent ?? pre.textContent ?? "").replace(/\n+$/, "");
        const ok = await copyText(code);
        if (!ok) return;
        btn.classList.add("code-copy-btn--copied");
        btn.innerHTML = CHECK_SVG;
        if (timer) window.clearTimeout(timer);
        timer = window.setTimeout(() => {
          btn.classList.remove("code-copy-btn--copied");
          btn.innerHTML = COPY_SVG;
        }, 1400);
      };
      btn.addEventListener("click", onClick);
      cleanups.push(() => {
        btn.removeEventListener("click", onClick);
        if (timer) window.clearTimeout(timer);
        btn.remove();
      });
      pre.appendChild(btn);
    });
    return () => {
      for (const cleanup of cleanups) cleanup();
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ref, key]);
}
