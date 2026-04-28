import { parseLessmark } from "lessmark";

type Entry = { slug: string; source: string; title: string; summary: string };

function buildIndex(modules: Record<string, string>): Entry[] {
  return Object.entries(modules)
    .map(([path, source]) => {
      const slug = path.split("/").pop()!.replace(/\.mu$/, "");
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

const docModules = import.meta.glob("../content/docs/*.mu", {
  query: "?raw",
  import: "default",
  eager: true,
}) as Record<string, string>;

const exampleModules = import.meta.glob("../content/examples/*.mu", {
  query: "?raw",
  import: "default",
  eager: true,
}) as Record<string, string>;

const homeModules = import.meta.glob("../content/home/*.mu", {
  query: "?raw",
  import: "default",
  eager: true,
}) as Record<string, string>;

const switchingModules = import.meta.glob("../content/switching/*.mu", {
  query: "?raw",
  import: "default",
  eager: true,
}) as Record<string, string>;

function readByName(modules: Record<string, string>, name: string): string {
  for (const [path, src] of Object.entries(modules)) {
    if (path.endsWith(`/${name}.mu`)) return src;
  }
  return "";
}

const DOCS_ORDER = ["getting-started", "switching", "syntax", "hacks", "blocks", "validation", "cli", "faq"];
const EXAMPLES_ORDER = ["syntax-tour", "skill", "resume", "changelog"];

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

const SWITCHING_ORDER = ["markdown", "mdx", "asciidoc", "rst"];
const SWITCHING_LABELS: Record<string, string> = {
  markdown: "Markdown",
  mdx: "MDX",
  asciidoc: "AsciiDoc",
  rst: "reStructuredText",
};
export const switching: { slug: string; label: string; source: string }[] =
  SWITCHING_ORDER.map((slug) => ({
    slug,
    label: SWITCHING_LABELS[slug] ?? slug,
    source: readByName(switchingModules, slug),
  })).filter((t) => t.source);

export const sourceId = {
  home: () => `home`,
  doc: (slug: string) => `docs/${slug}`,
  example: (slug: string) => `examples/${slug}`,
  switching: (slug: string) => `switching/${slug}`,
} as const;

export const allSources: Record<string, string> = {
  [sourceId.home()]: home,
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
