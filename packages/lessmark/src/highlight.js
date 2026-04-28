const ESC = {
  "&": "&amp;",
  "<": "&lt;",
  ">": "&gt;",
  '"': "&quot;",
  "'": "&#39;"
};

const SCRIPT_KEYWORDS = new Set([
  "async", "await", "break", "case", "catch", "class", "const", "continue", "default", "do",
  "else", "export", "extends", "finally", "for", "from", "function", "if", "import", "in",
  "instanceof", "let", "new", "of", "return", "static", "switch", "throw", "try", "typeof",
  "var", "void", "while", "yield", "true", "false", "null", "undefined"
]);

export function highlightLessmark(source) {
  const lines = String(source).split("\n");
  const out = [];
  let index = 0;

  while (index < lines.length) {
    const raw = lines[index];
    const block = /^@([a-z][a-z0-9_-]*)(.*)$/.exec(raw);
    if (block) {
      out.push(highlightLessmarkLine(raw, false));
      if (isLiteralBlock(block[1])) {
        const body = [];
        let cursor = index + 1;
        while (cursor < lines.length && !isLiteralTerminator(lines, cursor)) {
          body.push(lines[cursor]);
          cursor += 1;
        }
        const lang = block[1] === "code" ? readAttr(block[2], "lang") ?? "" : "";
        if (body.length > 0) out.push(...highlightCode(body.join("\n"), lang).split("\n"));
        index = cursor;
        continue;
      }
      index += 1;
      continue;
    }

    out.push(highlightLessmarkLine(raw, false));
    index += 1;
  }

  return out.join("\n");
}

export function highlightCode(text, lang = "") {
  const normalized = String(lang).toLowerCase();
  if (normalized === "lmk" || normalized === "lessmark") {
    return String(text).split("\n").map((line) => highlightLessmarkLine(line, true)).join("\n");
  }
  if (["js", "jsx", "ts", "tsx", "javascript", "typescript"].includes(normalized)) return highlightScript(text);
  if (["json", "jsonc"].includes(normalized)) return highlightJson(text);
  if (["sh", "shell", "bash", "zsh", "powershell", "ps1"].includes(normalized)) return highlightShell(text);
  return escapeHtml(text);
}

function highlightLessmarkLine(raw, allowIndentedBlockStart) {
  if (raw === "") return "";
  if (allowIndentedBlockStart) {
    const escaped = /^(\s+)([@#].*)$/.exec(raw);
    if (escaped) return `${escapeHtml(escaped[1])}${highlightLessmarkLine(escaped[2], false)}`;
  }
  if (/^#{1,6}\s/.test(raw)) {
    const match = /^(#{1,6})(\s)(.*)$/.exec(raw);
    return `<span class="tok-key">${escapeHtml(match[1])}</span>${escapeHtml(match[2])}<span class="tok-heading">${escapeHtml(match[3])}</span>`;
  }
  if (raw.startsWith("@")) {
    const match = /^@([a-z][a-z0-9_-]*)(.*)$/.exec(raw);
    if (match) return `<span class="tok-key">@${escapeHtml(match[1])}</span>${highlightAttrs(match[2])}`;
  }
  return highlightBodyLine(raw);
}

function highlightAttrs(rest) {
  const parts = [];
  let index = 0;
  while (index < rest.length) {
    const char = rest[index];
    if (/\s/.test(char)) {
      parts.push(escapeHtml(char));
      index += 1;
      continue;
    }
    const key = /^([a-z][a-z0-9_-]*)/.exec(rest.slice(index));
    if (key) {
      parts.push(`<span class="tok-attr">${escapeHtml(key[1])}</span>`);
      index += key[1].length;
      if (rest[index] === "=") {
        parts.push('<span class="tok-punct">=</span>');
        index += 1;
        if (rest[index] === '"') {
          let end = index + 1;
          while (end < rest.length && rest[end] !== '"') end += 1;
          parts.push(`<span class="tok-string">${escapeHtml(rest.slice(index, end + 1))}</span>`);
          index = end + 1;
          continue;
        }
      }
      continue;
    }
    parts.push(escapeHtml(char));
    index += 1;
  }
  return parts.join("");
}

function highlightBodyLine(raw) {
  const list = /^(\s*)(- )(.*)$/.exec(raw);
  if (list) return `${escapeHtml(list[1])}<span class="tok-punct">${escapeHtml(list[2])}</span>${highlightInline(list[3])}`;
  if (raw.includes("|")) return highlightTableRow(raw);
  return highlightInline(raw);
}

function highlightTableRow(raw) {
  const parts = [];
  let cell = "";
  let escaping = false;
  for (const char of raw) {
    if (escaping) {
      cell += char;
      escaping = false;
      continue;
    }
    if (char === "\\") {
      cell += char;
      escaping = true;
      continue;
    }
    if (char === "|") {
      parts.push(highlightInline(cell));
      parts.push('<span class="tok-punct">|</span>');
      cell = "";
      continue;
    }
    cell += char;
  }
  parts.push(highlightInline(cell));
  return parts.join("");
}

function highlightInline(raw) {
  const tokens = [
    /\{\{[a-z][a-z0-9_-]*:[\s\S]*?\}\}/y,
    /`[^`\n]+`/y,
    /\*\*[^*\n][\s\S]*?[^*\n]\*\*/y,
    /\*[^*\n][^*\n]*\*/y,
    /~~[^~\n]+~~/y,
    /==[^=\n]+==/y,
    /\[[^\]\n]+\]\((?:https?:\/\/|\.{0,2}\/|#)[^)]+\)/y,
    /\[[^\]\n]+\]\[[-a-z0-9_]+\]/iy,
    /\[\^[-a-z0-9_]+\]/iy
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
      out += `<span class="tok-text">${escapeHtml(raw[index])}</span>`;
      index += 1;
    }
  }
  return out;
}

function renderInlineToken(token) {
  const fn = /^\{\{([a-z][a-z0-9_-]*)(:)([\s\S]*)(\}\})$/.exec(token);
  if (fn) {
    return `<span class="tok-brace">{{</span><span class="tok-inline">${escapeHtml(fn[1])}</span><span class="tok-punct">${escapeHtml(fn[2])}</span>${highlightInline(fn[3])}<span class="tok-brace">}}</span>`;
  }
  if (token.startsWith("`")) return `<span class="tok-code">${escapeHtml(token)}</span>`;
  if (token.startsWith("[") || token.startsWith("[^")) return `<span class="tok-link">${escapeHtml(token)}</span>`;
  if (token.startsWith("**") || token.startsWith("*")) return `<span class="tok-emph">${escapeHtml(token)}</span>`;
  if (token.startsWith("~~")) return `<span class="tok-del">${escapeHtml(token)}</span>`;
  if (token.startsWith("==")) return `<span class="tok-mark">${escapeHtml(token)}</span>`;
  return `<span class="tok-text">${escapeHtml(token)}</span>`;
}

function highlightScript(text) {
  return tokenizeCode(text, (source, index) => {
    const string = readStringToken(source, index, ["'", '"', "`"]);
    if (string) return ["string", string];
    if (source.startsWith("//", index)) return ["comment", readUntilNewline(source, index)];
    if (source.startsWith("/*", index)) return ["comment", readBlockComment(source, index)];
    const word = /^[A-Za-z_$][A-Za-z0-9_$]*/.exec(source.slice(index))?.[0];
    if (word && SCRIPT_KEYWORDS.has(word)) return ["key", word];
    const number = /^(?:0x[0-9a-fA-F]+|\d+(?:\.\d+)?)/.exec(source.slice(index))?.[0];
    if (number) return ["number", number];
    return null;
  });
}

function highlightJson(text) {
  return tokenizeCode(text, (source, index) => {
    const string = readStringToken(source, index, ['"']);
    if (string) return ["string", string];
    const keyword = /^(?:true|false|null)\b/.exec(source.slice(index))?.[0];
    if (keyword) return ["key", keyword];
    const number = /^-?\d+(?:\.\d+)?(?:e[+-]?\d+)?/i.exec(source.slice(index))?.[0];
    if (number) return ["number", number];
    return null;
  });
}

function highlightShell(text) {
  return tokenizeCode(text, (source, index) => {
    const string = readStringToken(source, index, ["'", '"']);
    if (string) return ["string", string];
    if (source[index] === "#") return ["comment", readUntilNewline(source, index)];
    const flag = /^--?[A-Za-z0-9][A-Za-z0-9-]*/.exec(source.slice(index))?.[0];
    if (flag) return ["key", flag];
    return null;
  });
}

function tokenizeCode(text, readToken) {
  const source = String(text);
  let index = 0;
  let output = "";
  while (index < source.length) {
    const token = readToken(source, index);
    if (token) {
      const [kind, value] = token;
      output += `<span class="tok-${kind}">${escapeHtml(value)}</span>`;
      index += value.length;
      continue;
    }
    output += escapeHtml(source[index]);
    index += 1;
  }
  return output;
}

function readStringToken(source, index, quotes) {
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

function readUntilNewline(source, index) {
  const end = source.indexOf("\n", index);
  return end === -1 ? source.slice(index) : source.slice(index, end);
}

function readBlockComment(source, index) {
  const end = source.indexOf("*/", index + 2);
  return end === -1 ? source.slice(index) : source.slice(index, end + 2);
}

function readAttr(rest, name) {
  const match = new RegExp(`\\b${name}="((?:\\\\["\\\\]|[^"])*)"`).exec(rest);
  return match ? match[1].toLowerCase() : null;
}

function isLiteralBlock(name) {
  return name === "code" || name === "example" || name === "math" || name === "diagram";
}

function isLiteralTerminator(lines, index) {
  const line = lines[index];
  if (line.startsWith("#") || line.startsWith("@")) return true;
  if (line.trim() !== "") return false;
  let next = index + 1;
  while (next < lines.length && lines[next].trim() === "") next += 1;
  return next >= lines.length || lines[next].startsWith("#") || lines[next].startsWith("@");
}

function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, (char) => ESC[char]);
}
