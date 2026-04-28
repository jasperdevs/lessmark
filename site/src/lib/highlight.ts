// Minimal Lessmark token highlighter for the playground editor.
// Returns HTML where each token is wrapped in a <span class="tok-X">.

const ESC: Record<string, string> = {
  "&": "&amp;",
  "<": "&lt;",
  ">": "&gt;",
  '"': "&quot;",
  "'": "&#39;",
};
function esc(s: string) {
  return s.replace(/[&<>"']/g, (c) => ESC[c]);
}

export function highlightLessmark(src: string): string {
  const lines = src.split("\n");
  const out: string[] = [];

  for (const raw of lines) {
    if (raw === "") {
      out.push("");
      continue;
    }
    if (/^#{1,6}\s/.test(raw)) {
      const m = /^(#{1,6})(\s)(.*)$/.exec(raw)!;
      out.push(
        `<span class="tok-key">${esc(m[1])}</span>${esc(m[2])}<span class="tok-heading">${esc(m[3])}</span>`,
      );
      continue;
    }
    if (raw.startsWith("@")) {
      // @name then optional attrs
      const m = /^@([a-z][a-z0-9_-]*)(.*)$/.exec(raw);
      if (m) {
        const rest = m[2];
        const attrs = highlightAttrs(rest);
        out.push(`<span class="tok-key">@${esc(m[1])}</span>${attrs}`);
        continue;
      }
    }
    out.push(`<span class="tok-text">${esc(raw)}</span>`);
  }
  return out.join("\n");
}

function highlightAttrs(rest: string): string {
  const parts: string[] = [];
  let i = 0;
  while (i < rest.length) {
    const ch = rest[i];
    if (/\s/.test(ch)) {
      parts.push(esc(ch));
      i += 1;
      continue;
    }
    const km = /^([a-z][a-z0-9_-]*)/.exec(rest.slice(i));
    if (km) {
      parts.push(`<span class="tok-attr">${esc(km[1])}</span>`);
      i += km[1].length;
      if (rest[i] === "=") {
        parts.push(`<span class="tok-punct">=</span>`);
        i += 1;
        if (rest[i] === '"') {
          let j = i + 1;
          while (j < rest.length && rest[j] !== '"') j += 1;
          const quoted = rest.slice(i, j + 1);
          parts.push(`<span class="tok-string">${esc(quoted)}</span>`);
          i = j + 1;
          continue;
        }
      }
      continue;
    }
    parts.push(esc(ch));
    i += 1;
  }
  return parts.join("");
}
