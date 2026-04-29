import { useEffect } from "react";
import { useParams, Navigate, Link } from "react-router-dom";
import { DocsLayout, getDocMark } from "@/components/DocsLayout";
import { Renderer } from "@/components/Renderer";
import { SwitchingTabs } from "@/components/SwitchingTabs";
import { docs, getDoc, sourceId, uiText } from "@/lib/content";
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
  const PrevMark = prev ? getDocMark(prev.slug) : null;
  const NextMark = next ? getDocMark(next.slug) : null;

  return (
    <DocsLayout>
      <article className="max-w-[720px]">
        <Renderer source={liveSource} />
        {slug === "switching" ? <SwitchingTabs /> : null}
      </article>
      <div className="max-w-[720px] mt-12 pt-6 border-t border-border-soft flex flex-wrap justify-between gap-4 text-[14px]">
        {prev ? (
          <Link
            to={`/docs/${prev.slug}`}
            className="text-fg-muted hover:text-fg transition-colors inline-flex flex-col"
          >
            <span className="text-[12px] text-fg-faint mb-1 inline-flex items-center gap-1">
              {PrevMark ? <PrevMark className="size-3.5" /> : null}
              {uiText["docs.previous"] || "previous"}
            </span>
            <span>{prev.title}</span>
          </Link>
        ) : (
          <span />
        )}
        {next ? (
          <Link
            to={`/docs/${next.slug}`}
            className="text-fg-muted hover:text-fg transition-colors text-right inline-flex flex-col"
          >
            <span className="text-[12px] text-fg-faint mb-1 inline-flex items-center justify-end gap-1">
              {NextMark ? <NextMark className="size-3.5" /> : null}
              {uiText["docs.next"] || "next"}
            </span>
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
