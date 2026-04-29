import { parseLessmark } from "lessmark";

type Entry = { slug: string; source: string; title: string; summary: string };
type AstNode = {
  type: string;
  name?: string;
  text?: string;
  attrs?: Record<string, string>;
};

export function readMetadata(source: string): Record<string, string> {
  if (!source) return {};
  try {
    const ast = parseLessmark(source) as { children: AstNode[] };
    const meta: Record<string, string> = {};
    for (const node of ast.children) {
      if (node.type === "block" && node.name === "metadata" && node.attrs?.key) {
        meta[node.attrs.key] = (node.text ?? "").trim();
      }
    }
    return meta;
  } catch {
    return {};
  }
}

function buildIndex(modules: Record<string, string>): Entry[] {
  return Object.entries(modules)
    .map(([path, source]) => {
      const slug = path.split("/").pop()!.replace(/\.lmk$/, "");
      const ast = parseLessmark(source);
      const heading = ast.children.find((n) => n.type === "heading");
      const summary = ast.children.find((n) => n.type === "block" && n.name === "summary");
      return {
        slug,
        source,
        title: heading?.type === "heading" ? heading.text ?? slug : slug,
        summary: summary?.type === "block" ? summary.text ?? "" : "",
      };
    })
    .sort((a, b) => a.slug.localeCompare(b.slug));
}

const docModules = import.meta.glob("../content/docs/*.lmk", {
  query: "?raw",
  import: "default",
  eager: true,
}) as Record<string, string>;

const exampleModules = import.meta.glob("../content/examples/*.lmk", {
  query: "?raw",
  import: "default",
  eager: true,
}) as Record<string, string>;

const homeModules = import.meta.glob("../content/home/*.lmk", {
  query: "?raw",
  import: "default",
  eager: true,
}) as Record<string, string>;

const switchingModules = import.meta.glob("../content/switching/*.lmk", {
  query: "?raw",
  import: "default",
  eager: true,
}) as Record<string, string>;

const chromeModules = import.meta.glob("../content/chrome/*.lmk", {
  query: "?raw",
  import: "default",
  eager: true,
}) as Record<string, string>;

const playgroundModules = import.meta.glob("../content/playground/*.lmk", {
  query: "?raw",
  import: "default",
  eager: true,
}) as Record<string, string>;

function readByName(modules: Record<string, string>, name: string): string {
  for (const [path, src] of Object.entries(modules)) {
    if (path.endsWith(`/${name}.lmk`)) return src;
  }
  return "";
}

const DOCS_ORDER = ["getting-started", "switching", "syntax", "blocks", "validation", "conformance", "render", "phases", "ast", "api", "cli", "shortcuts", "faq"];
const EXAMPLES_ORDER = ["syntax-tour", "blog-maker", "skill", "resume", "changelog"];

function order(entries: Entry[], priority: string[]): Entry[] {
  const rank = (slug: string) => {
    const i = priority.indexOf(slug);
    return i === -1 ? priority.length : i;
  };
  return [...entries].sort((a, b) => rank(a.slug) - rank(b.slug));
}

export const docs = order(buildIndex(docModules), DOCS_ORDER);
export const examples = order(buildIndex(exampleModules), EXAMPLES_ORDER);

export const home: string = readByName(homeModules, "home");
export const footer: string = readByName(chromeModules, "footer");
export const header: string = readByName(chromeModules, "header");
export const ui: string = readByName(chromeModules, "ui");
export const uiText: Record<string, string> = readMetadata(ui);
export function uiString(key: string): string {
  const value = uiText[key];
  if (!value) throw new Error(`Missing UI text: ${key}`);
  return value;
}
export const playgroundDefault: string = readByName(playgroundModules, "default");

const SWITCHING_ORDER = ["markdown", "mdx", "markdoc", "djot", "asciidoc", "rst", "typst", "org", "textile", "wikitext"];
export const switching: { slug: string; label: string; source: string }[] =
  SWITCHING_ORDER.map((slug) => ({
    slug,
    label: uiString(`switching.${slug}`),
    source: readByName(switchingModules, slug),
  })).filter((t) => t.source);

export const sourceId = {
  home: () => `home`,
  doc: (slug: string) => `docs/${slug}`,
  example: (slug: string) => `examples/${slug}`,
  switching: (slug: string) => `switching/${slug}`,
  chrome: (slug: string) => `chrome/${slug}`,
} as const;

export const allSources: Record<string, string> = {
  [sourceId.home()]: home,
  [sourceId.chrome("footer")]: footer,
  [sourceId.chrome("header")]: header,
  [sourceId.chrome("ui")]: ui,
  ...Object.fromEntries(docs.map((d) => [sourceId.doc(d.slug), d.source])),
  ...Object.fromEntries(examples.map((e) => [sourceId.example(e.slug), e.source])),
  ...Object.fromEntries(switching.map((s) => [sourceId.switching(s.slug), s.source])),
};

export function getDoc(slug: string) {
  return docs.find((d) => d.slug === slug);
}
export function getExample(slug: string) {
  return examples.find((e) => e.slug === slug);
}
