import { useMemo, useState } from "react";
import type { ReactNode } from "react";
import { parseLessmark, renderHtml } from "lessmark";
import { ArrowRightIcon } from "@/components/Icons";
import { Link } from "react-router-dom";
import { sourceId } from "@/lib/content";
import { useLiveSource } from "@/lib/live-source";
import { Playground } from "@/components/Playground";

type AstNode = {
  type: string;
  level?: number;
  text?: string;
  name?: string;
  attrs?: Record<string, string>;
};

const HERO_DEMO = `# Project context

@summary
A small CLI for tracking time across projects.

@decision id="storage-backend"
Save entries in a single SQLite file.

@constraint
Do not block the UI while syncing.

@task status="doing"
Migrate hotkey registration off the deprecated win32 path.
`;

type Section = {
  slug: string;
  heading: string;
  intro: AstNode[];
  subsections: { heading: string; nodes: AstNode[] }[];
};

function buildSections(source: string) {
  const ast = parseLessmark(source);
  const heroIdx = ast.children.findIndex((n: AstNode) => n.type === "heading");
  const hero = heroIdx >= 0 ? ast.children[heroIdx] : null;
  const heroTitle = hero?.type === "heading" ? hero.text ?? "" : "";
  const rest = (heroIdx >= 0 ? ast.children.slice(heroIdx + 1) : ast.children) as AstNode[];

  const sections: Section[] = [];
  let currentSection: Section | null = null;
  let currentSub: { heading: string; nodes: AstNode[] } | null = null;

  for (const node of rest) {
    if (node.type === "heading" && node.level === 2) {
      if (currentSection) sections.push(currentSection);
      const heading = node.text ?? "";
      currentSection = {
        slug: heading.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, ""),
        heading,
        intro: [],
        subsections: [],
      };
      currentSub = null;
    } else if (node.type === "heading" && node.level === 3 && currentSection) {
      currentSub = { heading: node.text ?? "", nodes: [] };
      currentSection.subsections.push(currentSub);
    } else if (currentSection) {
      if (currentSub) currentSub.nodes.push(node);
      else currentSection.intro.push(node);
    }
  }
  if (currentSection) sections.push(currentSection);

  return { heroTitle, sections };
}

function renderNodes(nodes: AstNode[]) {
  return renderHtml({ type: "document", children: nodes });
}

function sectionHtml(section: Section) {
  return renderNodes([
    { type: "heading", level: 2, text: section.heading },
    ...section.intro,
    ...section.subsections.flatMap((sub) => [
      { type: "heading", level: 3, text: sub.heading } as AstNode,
      ...sub.nodes,
    ]),
  ]);
}

export function Home() {
  const homeSrc = useLiveSource(sourceId.home());
  const { heroTitle, sections } = useMemo(() => buildSections(homeSrc), [homeSrc]);
  const [demoSource, setDemoSource] = useState(HERO_DEMO);

  return (
    <main className="mx-auto max-w-[880px] px-6 pb-16">
      <section
        data-hero
        className="pt-20 pb-16 grid justify-items-center gap-8 text-center"
      >
        <img
          src="/lessmarklogowhitebackground.svg"
          alt=""
          className="size-[160px] md:size-[200px]"
        />
        <h1 className="font-sans font-extrabold text-[clamp(40px,6.4vw,72px)] leading-[1.05] tracking-[-0.025em] max-w-[20ch] text-fg">
          <HeroTitle text={heroTitle} />
        </h1>
        <div className="mt-2 flex flex-wrap items-center justify-center gap-3 text-[15px]">
          <Link
            to="/docs/getting-started"
            className="inline-flex items-center gap-2 rounded-full bg-fg text-bg px-6 py-3 font-semibold hover:opacity-90 transition-opacity"
          >
            Get started
            <ArrowRightIcon className="size-4" />
          </Link>
          <Link
            to="/playground"
            className="inline-flex items-center gap-2 rounded-full border border-fg text-fg px-6 py-3 font-semibold hover:bg-fg hover:text-bg transition-colors"
          >
            Playground
            <ArrowRightIcon className="size-4" />
          </Link>
        </div>
      </section>

      <Divider />

      <section className="py-8">
        <div className="mb-3 flex items-center justify-between text-[12px] font-mono text-fg-faint">
          <span>edit on the left, see the rendered HTML on the right.</span>
          <Link
            to="/playground"
            className="hover:text-fg transition-colors inline-flex items-center gap-1"
          >
            open full playground
            <ArrowRightIcon className="size-3" />
          </Link>
        </div>
        <div className="h-[420px]">
          <Playground
            value={demoSource}
            onChange={setDemoSource}
            sample={HERO_DEMO}
            fileName="project.mu"
            fullHeight
          />
        </div>
      </section>

      {sections.map((section) => {
        if (section.slug === "features") {
          return (
            <div key={section.slug}>
              <Divider />
              <FeatureTrio section={section} />
            </div>
          );
        }
        return (
          <div key={section.slug}>
            <Divider />
            <ContentSection section={section} />
          </div>
        );
      })}

      <Divider />

      <section className="py-10">
        <h2 className="font-mono font-semibold text-[20px] tracking-[-0.005em] text-fg mb-4">
          Next
        </h2>
        <Link
          to="/docs/getting-started"
          className="group flex items-center justify-between gap-3 rounded-md border border-border-soft bg-surface px-5 py-4 hover:bg-surface-alt transition-colors"
        >
          <div className="flex flex-col">
            <span className="font-mono text-[15px] text-fg">Read the getting-started guide</span>
            <span className="font-mono text-[13px] text-fg-faint">install a package, write your first document</span>
          </div>
          <ArrowRightIcon className="size-4 text-fg-muted group-hover:text-fg transition-colors" />
        </Link>
      </section>
    </main>
  );
}

function ContentSection({ section }: { section: Section }) {
  const html = useMemo(() => sectionHtml(section), [section]);
  return (
    <article
      className="lessmark-output py-8"
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}

function FeatureTrio({ section }: { section: Section }) {
  const items = useMemo(
    () =>
      section.subsections.map((sub) => ({
        heading: sub.heading,
        html: renderNodes(sub.nodes),
      })),
    [section],
  );
  return (
    <section className="py-10">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {items.map((sub, i) => (
          <FeatureCard
            key={sub.heading}
            heading={sub.heading}
            html={sub.html}
            icon={<PixelIcon variant={i} />}
          />
        ))}
      </div>
    </section>
  );
}

function FeatureCard({
  heading,
  html,
  icon,
}: {
  heading: string;
  html: string;
  icon: ReactNode;
}) {
  return (
    <div className="flex flex-col gap-3">
      <div className="text-fg">{icon}</div>
      <h3 className="font-mono font-semibold text-[16px] tracking-[-0.005em] text-fg">
        {heading}
      </h3>
      <div
        className="lessmark-output text-[14px] [&>*]:!mt-0 [&_p]:!leading-[1.6]"
        dangerouslySetInnerHTML={{ __html: html }}
      />
    </div>
  );
}

function HeroTitle({ text }: { text: string }) {
  const target = "(and humans)";
  const idx = text.indexOf(target);
  if (idx < 0) return <>{text}</>;
  return (
    <>
      {text.slice(0, idx)}
      <span className="hero-accent">{target}</span>
      {text.slice(idx + target.length)}
    </>
  );
}

function PixelGrid({ rows }: { rows: string[] }) {
  const size = rows.length;
  const cells: { x: number; y: number }[] = [];
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < rows[y].length; x++) {
      if (rows[y][x] === "#") cells.push({ x, y });
    }
  }
  return (
    <svg
      width={32}
      height={32}
      viewBox={`0 0 ${size} ${size}`}
      aria-hidden="true"
      shapeRendering="crispEdges"
    >
      {cells.map((c) => (
        <rect
          key={`${c.x}-${c.y}`}
          x={c.x}
          y={c.y}
          width={1}
          height={1}
          fill="currentColor"
        />
      ))}
    </svg>
  );
}

function PixelIcon({ variant }: { variant: number }) {
  if (variant === 0) {
    // open source: heart
    return (
      <PixelGrid
        rows={[
          "................",
          "................",
          "..###.....###...",
          ".#####...#####..",
          "###############.",
          "###############.",
          "###############.",
          ".#############..",
          "..###########...",
          "...#########....",
          "....#######.....",
          ".....#####......",
          "......###.......",
          ".......#........",
          "................",
          "................",
        ]}
      />
    );
  }
  if (variant === 1) {
    // agents and humans: smiley face
    return (
      <PixelGrid
        rows={[
          "................",
          "....########....",
          "..############..",
          ".##############.",
          ".##############.",
          "###.########.###",
          "###.########.###",
          "################",
          "################",
          "################",
          "###.########.###",
          ".###.######.###.",
          ".####.####.####.",
          "..############..",
          "....########....",
          "................",
        ]}
      />
    );
  }
  // adopt anywhere: cube/box with depth
  return (
    <PixelGrid
      rows={[
        "................",
        "...##########...",
        "..############..",
        ".####....####...",
        ".####....####...",
        ".####....####...",
        "##############..",
        "##############..",
        "##############..",
        "##.#######.###..",
        "##.#######.###..",
        "##.#######.###..",
        "##.#######.###..",
        "##############..",
        "..############..",
        "................",
      ]}
    />
  );
}

function Divider() {
  return <div aria-hidden className="my-2 h-px w-full bg-border-soft" />;
}
