import { useEffect } from "react";
import { Link, Navigate, useParams } from "react-router-dom";
import { Playground } from "@/components/Playground";
import { examples, getExample, sourceId, uiText } from "@/lib/content";
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
    <main className="px-2 sm:px-3 pb-3 h-[calc(100svh-72px)] min-h-[620px] overflow-hidden flex flex-col gap-2">
      <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1 text-[13px] shrink-0 px-1">
        <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
          <Link
            to="/examples"
            className="text-fg-muted hover:text-fg transition-colors underline underline-offset-4 decoration-fg-faint hover:decoration-fg"
          >
            ← {uiText["examples.back"] || "all examples"}
          </Link>
          <span className="text-fg-faint italic">{ex.slug}.lmk</span>
        </div>
        <div className="flex flex-wrap items-baseline justify-end gap-x-4 gap-y-1">
          {prev ? (
            <Link
              to={`/examples/${prev.slug}`}
              className="text-fg-muted hover:text-fg transition-colors underline underline-offset-4 decoration-fg-faint hover:decoration-fg"
            >
              ← {prev.slug}
            </Link>
          ) : <span />}
          {next ? (
            <Link
              to={`/examples/${next.slug}`}
              className="text-fg-muted hover:text-fg transition-colors inline-flex items-baseline gap-1 underline underline-offset-4 decoration-fg-faint hover:decoration-fg"
            >
              {next.slug}
              <ArrowRightIcon className="size-3 self-center" />
            </Link>
          ) : <span />}
        </div>
      </div>
      <div className="flex-1 min-h-0">
        <Playground
          value={liveSource}
          onChange={(v) => ctx.set(id, v)}
          sample={ex.source}
          fullHeight
        />
      </div>
    </main>
  );
}
