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
  let codeLang: string | null = null;

  for (const raw of lines) {
    if (codeLang && (raw.startsWith("@") || raw.startsWith("#"))) {
      codeLang = null;
    }

    if (raw === "") {
      out.push("");
      continue;
    }

    if (codeLang) {
      out.push(highlightCodeLine(raw, codeLang));
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
        if (m[1] === "code") {
          codeLang = readAttr(rest, "lang") ?? "";
        }
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

function readAttr(rest: string, name: string): string | null {
  const match = new RegExp(`\\b${name}="((?:\\\\["\\\\]|[^"])*)"`).exec(rest);
  return match ? match[1].toLowerCase() : null;
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

function highlightCodeLine(raw: string, lang: string): string {
  if (/^(js|jsx|ts|tsx|javascript|typescript)$/.test(lang)) {
    return tokenizeCode(raw, readScriptToken);
  }
  if (/^(json|jsonc)$/.test(lang)) {
    return tokenizeCode(raw, readJsonToken);
  }
  if (/^(sh|shell|bash|zsh|powershell|ps1)$/.test(lang)) {
    return tokenizeCode(raw, readShellToken);
  }
  return esc(raw);
}

function tokenizeCode(raw: string, readToken: (source: string, index: number) => [string, string] | null): string {
  let index = 0;
  let out = "";
  while (index < raw.length) {
    const token = readToken(raw, index);
    if (token) {
      out += `<span class="tok-${token[0]}">${esc(token[1])}</span>`;
      index += token[1].length;
      continue;
    }
    out += esc(raw[index]);
    index += 1;
  }
  return out;
}

function readScriptToken(source: string, index: number): [string, string] | null {
  const string = readStringToken(source, index, ["'", '"', "`"]);
  if (string) return ["string", string];
  if (source.startsWith("//", index)) return ["comment", source.slice(index)];
  const word = /^[A-Za-z_$][A-Za-z0-9_$]*/.exec(source.slice(index))?.[0];
  if (word && SCRIPT_KEYWORDS.has(word)) return ["key", word];
  const number = /^(?:0x[0-9a-fA-F]+|\d+(?:\.\d+)?)/.exec(source.slice(index))?.[0];
  if (number) return ["number", number];
  return null;
}

function readJsonToken(source: string, index: number): [string, string] | null {
  const string = readStringToken(source, index, ['"']);
  if (string) return ["string", string];
  const keyword = /^(?:true|false|null)\b/.exec(source.slice(index))?.[0];
  if (keyword) return ["key", keyword];
  const number = /^-?\d+(?:\.\d+)?(?:e[+-]?\d+)?/i.exec(source.slice(index))?.[0];
  if (number) return ["number", number];
  return null;
}

function readShellToken(source: string, index: number): [string, string] | null {
  const string = readStringToken(source, index, ["'", '"']);
  if (string) return ["string", string];
  if (source[index] === "#") return ["comment", source.slice(index)];
  const flag = /^--?[A-Za-z0-9][A-Za-z0-9-]*/.exec(source.slice(index))?.[0];
  if (flag) return ["key", flag];
  return null;
}

function readStringToken(source: string, index: number, quotes: string[]): string | null {
  const quote = source[index];
  if (!quotes.includes(quote)) return null;
  let cursor = index + 1;
  let escaping = false;
  while (cursor < source.length) {
    const char = source[cursor];
    cursor += 1;
    if (escaping) {
      escaping = false;
      continue;
    }
    if (char === "\\") {
      escaping = true;
      continue;
    }
    if (char === quote) break;
  }
  return source.slice(index, cursor);
}

const SCRIPT_KEYWORDS = new Set([
  "async", "await", "break", "case", "catch", "class", "const", "continue", "default", "do",
  "else", "export", "extends", "finally", "for", "from", "function", "if", "import", "in",
  "instanceof", "let", "new", "of", "return", "static", "switch", "throw", "try", "typeof",
  "var", "void", "while", "yield", "true", "false", "null", "undefined",
]);
