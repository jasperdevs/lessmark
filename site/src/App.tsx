import { useState } from "react";
import { Copy, Check, Github, Terminal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ShapeProvider } from "@/lib/shape-context";
import { Playground } from "@/components/Playground";
import { Features } from "@/components/Features";
import { Docs } from "@/components/Docs";

const SAMPLE = `# Project context

@summary
This repo builds a local Windows screenshot app.

@decision id="manual-scrolling"
Manual scrolling capture stays because apps
scroll differently.

@constraint
Do not auto-scroll or auto-end capture
unless the user explicitly asks.

@task status="todo"
Add export settings.

@file path="src/Capture/Service.cs"
Owns stitching and capture state.

@risk level="medium"
Changing capture flow can break existing workflows.`;

function MarkdownH2({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="text-[26px] leading-[1.25] font-semibold tracking-tight">
      <span className="font-mono font-normal text-fg-faint mr-1">##</span>
      {children}
    </h2>
  );
}

function CopyPill({ label, command }: { label: string; command: string }) {
  const [copied, setCopied] = useState(false);
  const onClick = async () => {
    try {
      await navigator.clipboard.writeText(command);
      setCopied(true);
      setTimeout(() => setCopied(false), 1100);
    } catch {
      /* clipboard blocked under file:// — silently ignore */
    }
  };
  return (
    <Button
      variant="tertiary"
      size="lg"
      onClick={onClick}
      leadingIcon={copied ? Check : Copy}
      className="font-mono text-[13px]"
      aria-label={`Copy ${command}`}
    >
      <span className="text-fg-muted mr-2 px-2 py-0.5 rounded-full bg-surface-alt text-[11px] tracking-wide">
        {label}
      </span>
      {command}
    </Button>
  );
}

function App() {
  return (
    <ShapeProvider defaultShape="pill">
        {/* edge fades */}
        <div aria-hidden className="pointer-events-none fixed inset-x-0 top-0 h-24 z-30 bg-gradient-to-b from-bg via-bg/70 to-transparent" />
        <div aria-hidden className="pointer-events-none fixed inset-x-0 bottom-0 h-24 z-30 bg-gradient-to-t from-bg via-bg/70 to-transparent" />

        <header className="sticky top-0 z-40 py-4">
          <div aria-hidden className="absolute inset-x-0 -top-2 h-[140%] -z-10 bg-gradient-to-b from-bg via-bg to-transparent" />
          <div className="mx-auto max-w-[920px] px-6 flex items-center justify-between">
            <a href="/" className="inline-flex items-center gap-2.5 text-[14px] font-medium">
              <img src="/lessmarklogowhitebackground.svg" alt="" className="size-5" />
              <span>lessmark</span>
            </a>
            <nav className="flex items-center gap-5 text-[14px] text-fg-muted">
              <a href="#playground" className="hover:text-fg transition-colors">playground</a>
              <a href="#features" className="hover:text-fg transition-colors">features</a>
              <a href="#docs" className="hover:text-fg transition-colors">docs</a>
              <a href="#compare" className="hover:text-fg transition-colors">compare</a>
              <a href="https://github.com/jasperdevs/lessmark" rel="noopener" className="hover:text-fg transition-colors inline-flex items-center gap-1.5">
                <Github className="size-4" />
                github
              </a>
            </nav>
          </div>
        </header>

        <main>
          {/* hero */}
          <section className="mx-auto max-w-[920px] px-6 pt-22 pb-14 text-center grid justify-items-center gap-7">
            <img src="/lessmarklogowhitebackground.svg" alt="lessmark" className="size-[120px]" />
            <h1 className="font-serif text-[clamp(44px,7vw,72px)] leading-[1.04] tracking-tight max-w-[18ch]">
              A strict, agent-readable markdown alternative.
            </h1>
            <p className="text-[17px] leading-[1.55] text-fg-muted max-w-[56ch]">
              Typed blocks instead of free-form prose, parsed to a versioned JSON AST. No raw HTML or JSX.
            </p>
            <div className="flex flex-wrap justify-center gap-2.5 pt-1">
              <CopyPill label="npm" command="npm install lessmark" />
              <CopyPill label="pip" command="pip install lessmark" />
            </div>
          </section>

          <div className="mx-auto max-w-[920px] px-6"><Separator /></div>

          {/* features — pixel icons + serif headings */}
          <section id="features" className="mx-auto max-w-[920px] px-6 py-16">
            <Features />
          </section>

          <div className="mx-auto max-w-[920px] px-6"><Separator /></div>

          {/* playground — markdoc-style editor with rendered preview */}
          <section id="playground" className="mx-auto max-w-[920px] px-6 py-14">
            <div className="mb-6">
              <MarkdownH2>playground</MarkdownH2>
              <p className="mt-2 text-fg-muted max-w-[60ch]">
                The same parser the CLI ships with. Edit the source on the left to see the rendered document on the right.
              </p>
            </div>
            <Playground initial={SAMPLE} sample={SAMPLE} />
            <p className="mt-3 text-[12px] text-fg-faint font-mono">
              try changing <code className="bg-surface-alt px-1.5 py-0.5 rounded text-fg">id="manual-scrolling"</code> to <code className="bg-surface-alt px-1.5 py-0.5 rounded text-fg">id="Bad ID"</code>.
            </p>
          </section>

          <div className="mx-auto max-w-[920px] px-6"><Separator /></div>

          {/* docs — basic-syntax style reference */}
          <section id="docs" className="mx-auto max-w-[920px] px-6 py-14">
            <div className="mb-2">
              <MarkdownH2>basic syntax</MarkdownH2>
              <p className="mt-2 text-fg-muted max-w-[60ch]">
                Every block in the language, with its source on the left and how it renders on the right.
              </p>
            </div>
            <Docs />
          </section>

          <div className="mx-auto max-w-[920px] px-6"><Separator /></div>

          {/* compare */}
          <section id="compare" className="mx-auto max-w-[920px] px-6 py-14">
            <div className="mb-6">
              <MarkdownH2>compared</MarkdownH2>
              <p className="mt-2 text-fg-muted max-w-[60ch]">
                Markdown wins for general docs. Lessmark is narrower by design: fewer features, stronger structure.
              </p>
            </div>
            <div className="overflow-x-auto -mx-2 px-2">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="font-mono text-[11px] tracking-wider text-fg-faint">format</TableHead>
                    <TableHead className="font-mono text-[11px] tracking-wider text-fg-faint">best for</TableHead>
                    <TableHead className="font-mono text-[11px] tracking-wider text-fg-faint">structure</TableHead>
                    <TableHead className="font-mono text-[11px] tracking-wider text-fg-faint">github</TableHead>
                    <TableHead className="font-mono text-[11px] tracking-wider text-fg-faint">agent safety</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {COMPARE.map((row) => (
                    <TableRow key={row.name}>
                      <TableCell className={`font-medium ${row.self ? "font-semibold" : ""}`}>{row.name}</TableCell>
                      <TableCell className={row.muted?.[0] ? "text-fg-muted" : ""}>{row.cells[0]}</TableCell>
                      <TableCell className={row.muted?.[1] ? "text-fg-muted" : ""}>{row.cells[1]}</TableCell>
                      <TableCell className={row.muted?.[2] ? "text-fg-muted" : ""}>{row.cells[2]}</TableCell>
                      <TableCell className={row.muted?.[3] ? "text-fg-muted" : ""}>{row.cells[3]}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </section>

          <div className="mx-auto max-w-[920px] px-6"><Separator /></div>

          {/* cli */}
          <section id="cli" className="mx-auto max-w-[920px] px-6 py-14">
            <div className="mb-6">
              <MarkdownH2>cli</MarkdownH2>
              <p className="mt-2 text-fg-muted max-w-[60ch]">
                Identical surface in JavaScript and Python.
              </p>
            </div>
            <div className="flex flex-wrap gap-2.5">
              <Button variant="tertiary" size="lg" leadingIcon={Terminal} className="font-mono text-[13px]">lessmark parse file.lmk</Button>
              <Button variant="tertiary" size="lg" leadingIcon={Terminal} className="font-mono text-[13px]">lessmark check file.lmk</Button>
              <Button variant="tertiary" size="lg" leadingIcon={Terminal} className="font-mono text-[13px]">lessmark format file.lmk</Button>
            </div>
          </section>
        </main>

        <footer className="pb-48 pt-8 text-[13px] text-fg-muted">
          <div className="mx-auto max-w-[920px] px-6 pt-6 border-t border-border-soft flex flex-wrap items-baseline justify-between gap-4">
            <span>lessmark · mit</span>
            <div className="flex items-center gap-5">
              <a href="https://github.com/jasperdevs/lessmark" className="hover:text-fg transition-colors">github</a>
              <a href="#playground" className="hover:text-fg transition-colors">playground</a>
              <a href="#docs" className="hover:text-fg transition-colors">docs</a>
              <a href="#compare" className="hover:text-fg transition-colors">compare</a>
            </div>
          </div>
        </footer>
    </ShapeProvider>
  );
}

const COMPARE: Array<{
  name: string; cells: [string, string, string, string]; muted?: [boolean, boolean, boolean, boolean]; self?: boolean;
}> = [
  { name: "lessmark", cells: ["agent context", "fixed typed blocks", "source only", "strong"], self: true },
  { name: "markdown/gfm", cells: ["human docs", "loose prose", "native", "medium"], muted: [false, true, false, true] },
  { name: "mdx", cells: ["component docs", "jsx/programmatic", "partial", "low"], muted: [false, true, true, false] },
  { name: "markdoc", cells: ["product docs", "schema tags", "source only", "strong"], muted: [false, false, true, false] },
  { name: "asciidoc", cells: ["large manuals", "rich blocks", "native", "medium"], muted: [false, true, false, true] },
  { name: "djot", cells: ["clean markup", "attributes", "source only", "medium"], muted: [false, false, true, true] },
];

export default App;
