import { useState } from "react";
import { Renderer } from "@/components/Renderer";
import { switching, sourceId } from "@/lib/content";
import { useLiveSource } from "@/lib/live-source";

export function SwitchingTabs() {
  const [active, setActive] = useState(switching[0]?.slug ?? "markdown");
  return (
    <section className="mt-8">
      <div
        role="tablist"
        aria-label="source format"
        className="flex flex-wrap gap-1 border-b border-border-soft"
      >
        {switching.map((tab) => {
          const isActive = tab.slug === active;
          return (
            <button
              key={tab.slug}
              role="tab"
              aria-selected={isActive}
              onClick={() => setActive(tab.slug)}
              className={`-mb-px px-4 py-2 text-[13px] font-mono border-b-2 transition-colors ${
                isActive
                  ? "border-fg text-fg"
                  : "border-transparent text-fg-muted hover:text-fg"
              }`}
            >
              {tab.label}
            </button>
          );
        })}
      </div>
      <div className="pt-6">
        {switching.map((tab) =>
          tab.slug === active ? <TabBody key={tab.slug} slug={tab.slug} /> : null,
        )}
      </div>
    </section>
  );
}

function TabBody({ slug }: { slug: string }) {
  const src = useLiveSource(sourceId.switching(slug));
  return <Renderer source={src} />;
}
