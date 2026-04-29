import { useMemo, useRef, useState } from "react";
import { parseLessmark, renderHtml } from "lessmark";
import { ArrowRightIcon } from "@/components/Icons";
import {
  AstIcon,
  PixelHeart,
  PixelMonoDoc,
  PixelMonoPlayground,
  PixelNo,
  PixelOk,
  SourceIcon,
  TerminalIcon,
} from "@/components/PixelIcons";
import { Link } from "react-router-dom";
import { sourceId, playgroundDefault, uiString } from "@/lib/content";
import { useLiveSource } from "@/lib/live-source";
import { useCodeCopyButtons } from "@/lib/code-copy";
import { useMermaid } from "@/lib/mermaid-render";
import { Playground } from "@/components/Playground";

type AstNode = {
  type: string;
  level?: number;
  text?: string;
  name?: string;
  attrs?: Record<string, string>;
};

const HERO_DEMO = playgroundDefault;
type Section = {
  slug: string;
  heading: string;
  intro: AstNode[];
  subsections: { heading: string; nodes: AstNode[] }[];
};
type HomeSections = {
  heroTitle: string;
  sections: Section[];
  error?: boolean;
};

function buildSections(source: string): HomeSections {
  let ast: { children: AstNode[] };
  try {
    ast = parseLessmark(source);
  } catch {
    return { heroTitle: "", sections: [], error: true };
  }
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
  const parsed = useMemo(() => buildSections(homeSrc), [homeSrc]);
  const lastGood = useRef<HomeSections>(parsed);
  if (!parsed.error) {
    lastGood.current = parsed;
  }
  const { heroTitle, sections } = parsed.error ? lastGood.current : parsed;
  const [demoSource, setDemoSource] = useState(HERO_DEMO);

  return (
    <main className="mx-auto max-w-[880px] px-4 sm:px-6 pb-16">
      <section
        data-hero
        className="pt-10 sm:pt-16 pb-10 sm:pb-12 grid justify-items-center gap-6 sm:gap-7 text-center"
      >
        <div className="flex flex-col items-center gap-1">
          <img
            src="/lessmarklogowhitebackground.svg"
            alt=""
            className="size-[136px] sm:size-[172px] md:size-[220px]"
          />
          <span
            className="font-sans font-bold text-[clamp(36px,5vw,56px)] leading-none tracking-[-0.02em] text-fg"
          >
            {uiString("header.brand")}
          </span>
        </div>
        <h1 className="font-sans font-bold text-[clamp(28px,4vw,42px)] leading-[1.15] tracking-[-0.02em] max-w-[24ch] text-fg">
          <HeroTitle text={heroTitle} />
        </h1>
        <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-[15px] text-fg-muted">
          <Link to="/docs/getting-started" className="hover:text-fg transition-colors underline underline-offset-4 decoration-fg-faint hover:decoration-fg">
            <span className="inline-flex items-center gap-1.5">
              <PixelMonoDoc className="size-4 text-current" />
              {uiString("home.docs-link")}
            </span>
          </Link>
          <Link to="/playground" className="hover:text-fg transition-colors underline underline-offset-4 decoration-fg-faint hover:decoration-fg">
            <span className="inline-flex items-center gap-1.5">
              <PixelMonoPlayground className="size-4 text-current" />
              {uiString("home.playground-link")}
            </span>
          </Link>
        </div>
      </section>

      <Divider />

      <section className="py-8">
        <div className="h-[620px] md:h-[460px]">
          <Playground
            value={demoSource}
            onChange={setDemoSource}
            sample={HERO_DEMO}
            fullHeight
            previewToolbar={
              <Link
                to="/playground"
                className="text-fg-faint hover:text-fg transition-colors inline-flex items-center gap-1.5"
              >
                {uiString("home.open-playground")}
                <ArrowRightIcon className="size-3" />
              </Link>
            }
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
        if (section.slug === "why-use-lessmark-instead-of-markdown") {
          return (
            <div key={section.slug}>
              <Divider />
              <ComparisonSection section={section} />
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
        <h2 className="font-sans font-bold text-[20px] tracking-[-0.01em] text-fg mb-3">
          <span className="inline-flex items-center gap-2">
            <PixelHeart className="size-5" />
            {uiString("home.next-heading")}
          </span>
        </h2>
        <Link
          to="/docs/getting-started"
          className="group flex items-baseline gap-2 text-fg hover:text-fg"
        >
          <span className="text-[15px] underline underline-offset-4 decoration-fg-faint group-hover:decoration-fg">
            {uiString("home.next-link")}
          </span>
          <ArrowRightIcon className="size-3.5 text-fg-muted group-hover:text-fg transition-colors" />
        </Link>
        <p className="text-[14px] text-fg-faint mt-1">
          {uiString("home.next-summary")}
        </p>
      </section>
    </main>
  );
}

function ComparisonSection({ section }: { section: Section }) {
  const tableIndex = section.intro.findIndex(
    (node) => node.type === "block" && node.name === "table",
  );
  const table = tableIndex >= 0 ? section.intro[tableIndex] : null;
  const before = tableIndex >= 0 ? section.intro.slice(0, tableIndex) : section.intro;
  const after = tableIndex >= 0 ? section.intro.slice(tableIndex + 1) : [];
  const beforeHtml = useMemo(
    () => renderNodes([{ type: "heading", level: 2, text: section.heading }, ...before]),
    [before, section.heading],
  );
  const afterHtml = useMemo(() => renderNodes(after), [after]);
  const beforeRef = useRef<HTMLDivElement>(null);
  const afterRef = useRef<HTMLDivElement>(null);
  useCodeCopyButtons(beforeRef, beforeHtml);
  useCodeCopyButtons(afterRef, afterHtml);

  if (!table) {
    return <ContentSection section={section} />;
  }

  const columns = (table.attrs?.columns ?? "").split("|");
  const rows = (table.text ?? "")
    .split(/\r?\n/)
    .filter(Boolean)
    .map((row) => row.split("|"));

  return (
    <article className="py-8">
      <div
        ref={beforeRef}
        className="lessmark-output"
        dangerouslySetInnerHTML={{ __html: beforeHtml }}
      />
      <div className="mt-5 overflow-x-auto">
        <table className="w-full min-w-[640px] border-collapse text-[14px]">
          <thead>
            <tr>
              {columns.map((column) => (
                <th
                  key={column}
                  className="border border-border px-4 py-3 text-left font-semibold text-fg"
                >
                  {column}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map(([markdown, lessmark]) => (
              <tr key={`${markdown}|${lessmark}`}>
                <td className="border border-border-soft px-4 py-3 align-top text-fg">
                  <ComparisonCell icon={<PixelNo className="size-4 shrink-0" />} text={markdown} />
                </td>
                <td className="border border-border-soft px-4 py-3 align-top text-fg">
                  <ComparisonCell icon={<PixelOk className="size-4 shrink-0" />} text={lessmark} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {after.length > 0 ? (
        <div
          ref={afterRef}
          className="lessmark-output mt-5"
          dangerouslySetInnerHTML={{ __html: afterHtml }}
        />
      ) : null}
    </article>
  );
}

function ComparisonCell({ icon, text }: { icon: React.ReactNode; text?: string }) {
  return (
    <span className="inline-flex items-start gap-2.5">
      <span className="mt-[0.15em] inline-flex size-4 items-center justify-center">{icon}</span>
      <span>{text}</span>
    </span>
  );
}

function ContentSection({ section }: { section: Section }) {
  const html = useMemo(() => sectionHtml(section), [section]);
  const ref = useRef<HTMLElement>(null);
  useCodeCopyButtons(ref, html);
  useMermaid(ref, html);
  return (
    <article
      ref={ref}
      className="lessmark-output py-8"
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}

const FEATURE_ICONS = [SourceIcon, TerminalIcon, AstIcon];

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
      <div className="grid grid-cols-1 md:grid-cols-3 gap-x-10 gap-y-8">
        {items.map((sub, i) => {
          const Icon = FEATURE_ICONS[i % FEATURE_ICONS.length];
          return (
            <FeatureCard
              key={sub.heading}
              icon={<Icon className="size-8" />}
              heading={sub.heading}
              html={sub.html}
            />
          );
        })}
      </div>
    </section>
  );
}

function FeatureCard({
  icon,
  heading,
  html,
}: {
  icon: React.ReactNode;
  heading: string;
  html: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  useCodeCopyButtons(ref, html);
  return (
    <div className="flex flex-col gap-2">
      <div className="size-8 mb-1 flex items-center justify-start">{icon}</div>
      <h3 className="font-sans font-bold text-[16px] tracking-[-0.01em] text-fg">
        {heading}
      </h3>
      <div
        ref={ref}
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

function Divider() {
  return <div aria-hidden className="my-2 h-px w-full bg-border-soft" />;
}
