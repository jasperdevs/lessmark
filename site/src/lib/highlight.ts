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
      const m = /^@([a-z][a-z0-9_-]*)(.*)$/.exec(raw);
      if (m) {
        const rest = m[2];
        const attrs = highlightAttrs(rest);
        out.push(`<span class="tok-key">@${esc(m[1])}</span>${attrs}`);
        continue;
      }
    }
    out.push(highlightBodyLine(raw));
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

function highlightBodyLine(raw: string): string {
  const list = /^(\s*)(- )(.*)$/.exec(raw);
  if (list) {
    return `${esc(list[1])}<span class="tok-punct">${esc(list[2])}</span>${highlightInline(list[3])}`;
  }

  if (raw.includes("|")) {
    return highlightTableRow(raw);
  }

  return highlightInline(raw);
}

function highlightTableRow(raw: string): string {
  const parts: string[] = [];
  let cell = "";
  let escaping = false;
  for (const ch of raw) {
    if (escaping) {
      cell += ch;
      escaping = false;
      continue;
    }
    if (ch === "\\") {
      cell += ch;
      escaping = true;
      continue;
    }
    if (ch === "|") {
      parts.push(highlightInline(cell));
      parts.push(`<span class="tok-punct">|</span>`);
      cell = "";
      continue;
    }
    cell += ch;
  }
  parts.push(highlightInline(cell));
  return parts.join("");
}

function highlightInline(raw: string): string {
  const tokens = [
    /\{\{[a-z][a-z0-9_-]*:[\s\S]*?\}\}/y,
    /`[^`\n]+`/y,
    /\*\*[^*\n][\s\S]*?[^*\n]\*\*/y,
    /\*[^*\n][^*\n]*\*/y,
    /~~[^~\n]+~~/y,
    /==[^=\n]+==/y,
    /\[[^\]\n]+\]\((?:https?:\/\/|\.{0,2}\/|#)[^)]+\)/y,
    /\[[^\]\n]+\]\[[-a-z0-9_]+\]/iy,
    /\[\^[-a-z0-9_]+\]/iy,
  ];
  let index = 0;
  let out = "";
  while (index < raw.length) {
    let matched = false;
    for (const token of tokens) {
      token.lastIndex = index;
      const match = token.exec(raw);
      if (!match) continue;
      out += renderInlineToken(match[0]);
      index += match[0].length;
      matched = true;
      break;
    }
    if (!matched) {
      out += `<span class="tok-text">${esc(raw[index])}</span>`;
      index += 1;
    }
  }
  return out;
}

function renderInlineToken(token: string): string {
  const fn = /^\{\{([a-z][a-z0-9_-]*)(:)([\s\S]*)(\}\})$/.exec(token);
  if (fn) {
    return `<span class="tok-brace">{{</span><span class="tok-inline">${esc(fn[1])}</span><span class="tok-punct">${esc(fn[2])}</span>${highlightInline(fn[3])}<span class="tok-brace">}}</span>`;
  }
  if (token.startsWith("`")) return `<span class="tok-code">${esc(token)}</span>`;
  if (token.startsWith("[") || token.startsWith("[^")) return `<span class="tok-link">${esc(token)}</span>`;
  if (token.startsWith("**") || token.startsWith("*")) return `<span class="tok-emph">${esc(token)}</span>`;
  if (token.startsWith("~~")) return `<span class="tok-del">${esc(token)}</span>`;
  if (token.startsWith("==")) return `<span class="tok-mark">${esc(token)}</span>`;
  return `<span class="tok-text">${esc(token)}</span>`;
}
