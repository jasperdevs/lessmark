import { useEffect } from "react";
import { Link, Navigate, useParams } from "react-router-dom";
import { Playground } from "@/components/Playground";
import { examples, getExample, sourceId } from "@/lib/content";
import { useLiveSourceCtx } from "@/lib/live-source";
import { ArrowRightIcon } from "@/components/Icons";

export function ExamplePage() {
  const { slug } = useParams();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "auto" });
  }, [slug]);

  const ctx = useLiveSourceCtx();

  if (!slug) return <Navigate to="/examples" replace />;
  const ex = getExample(slug);
  if (!ex) return <Navigate to="/examples" replace />;

  const id = sourceId.example(slug);
  const liveSource = ctx.get(id);

  const idx = examples.findIndex((e) => e.slug === slug);
  const prev = idx > 0 ? examples[idx - 1] : null;
  const next = idx < examples.length - 1 ? examples[idx + 1] : null;

  return (
    <main className="px-3 pb-3 h-[calc(100vh-72px)] overflow-hidden flex flex-col gap-2">
      <div className="flex items-center justify-between text-[12px] font-mono shrink-0 px-1">
        <div className="flex items-baseline gap-3">
          <Link
            to="/examples"
            className="text-fg-muted hover:text-fg transition-colors"
          >
            ← all examples
          </Link>
          <span className="text-fg-faint">/</span>
          <span className="text-fg-faint">{ex.slug}.mu</span>
        </div>
        <div className="flex items-center gap-4">
          {prev ? (
            <Link
              to={`/examples/${prev.slug}`}
              className="text-fg-muted hover:text-fg transition-colors"
            >
              ← {prev.slug}
            </Link>
          ) : <span />}
          {next ? (
            <Link
              to={`/examples/${next.slug}`}
              className="text-fg-muted hover:text-fg transition-colors inline-flex items-center gap-1"
            >
              {next.slug}
              <ArrowRightIcon className="size-3" />
            </Link>
          ) : <span />}
        </div>
      </div>
      <div className="flex-1 min-h-0">
        <Playground
          value={liveSource}
          onChange={(v) => ctx.set(id, v)}
          sample={ex.source}
          fileName={`${ex.slug}.mu`}
          fullHeight
        />
      </div>
    </main>
  );
}
