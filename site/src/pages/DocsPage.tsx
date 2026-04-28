import { useEffect } from "react";
import { useParams, Navigate, Link } from "react-router-dom";
import { DocsLayout } from "@/components/DocsLayout";
import { Renderer } from "@/components/Renderer";
import { SwitchingTabs } from "@/components/SwitchingTabs";
import { docs, getDoc, sourceId } from "@/lib/content";
import { useLiveSource } from "@/lib/live-source";
import { ArrowRightIcon } from "@/components/Icons";

export function DocsPage() {
  const { slug } = useParams();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "auto" });
  }, [slug]);

  const liveSource = useLiveSource(slug ? sourceId.doc(slug) : "");

  if (!slug) return <Navigate to={`/docs/${docs[0].slug}`} replace />;
  const doc = getDoc(slug);
  if (!doc) return <Navigate to={`/docs/${docs[0].slug}`} replace />;

  const idx = docs.findIndex((d) => d.slug === slug);
  const prev = idx > 0 ? docs[idx - 1] : null;
  const next = idx < docs.length - 1 ? docs[idx + 1] : null;

  return (
    <DocsLayout>
      <article className="max-w-[720px]">
        <Renderer source={liveSource} />
        {slug === "switching" ? <SwitchingTabs /> : null}
      </article>
      <div className="max-w-[720px] mt-12 pt-6 border-t border-border-soft flex justify-between gap-4 text-[14px]">
        {prev ? (
          <Link
            to={`/docs/${prev.slug}`}
            className="text-fg-muted hover:text-fg transition-colors"
          >
            <span className="block text-[12px] text-fg-faint mb-1">previous</span>
            {prev.title}
          </Link>
        ) : (
          <span />
        )}
        {next ? (
          <Link
            to={`/docs/${next.slug}`}
            className="text-fg-muted hover:text-fg transition-colors text-right inline-flex flex-col"
          >
            <span className="text-[12px] text-fg-faint mb-1">next</span>
            <span className="inline-flex items-center gap-1">
              {next.title}
              <ArrowRightIcon className="size-3.5" />
            </span>
          </Link>
        ) : (
          <span />
        )}
      </div>
    </DocsLayout>
  );
}
