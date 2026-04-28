import { Link } from "react-router-dom";
import { examples } from "@/lib/content";
import { ArrowRightIcon } from "@/components/Icons";

export function ExamplesIndex() {
  return (
    <main className="mx-auto max-w-[1080px] px-6 py-12">
      <div className="mb-10">
        <h1 className="text-[36px] leading-[1.1] tracking-[-0.02em] font-semibold">
          <span className="font-mono font-normal text-fg-faint mr-2">#</span>
          examples
        </h1>
        <p className="mt-2 text-fg-muted max-w-[60ch]">
          Real documents written in lessmark. Each example is editable side by side with the rendered output.
        </p>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        {examples.map((e) => (
          <Link
            key={e.slug}
            to={`/examples/${e.slug}`}
            className="group rounded-[14px] border border-border-soft bg-surface p-6 hover:border-border transition-colors"
          >
            <div className="flex items-baseline justify-between gap-3">
              <h2 className="text-[18px] leading-[1.25] tracking-tight font-semibold">
                {e.title}
              </h2>
              <ArrowRightIcon className="size-4 text-fg-faint group-hover:text-fg transition-colors" />
            </div>
            {e.summary && (
              <p className="mt-2 text-[14px] leading-[1.55] text-fg-muted line-clamp-3">
                {e.summary}
              </p>
            )}
            <div className="mt-3 text-[12px] font-mono text-fg-faint">
              {e.slug}.mu
            </div>
          </Link>
        ))}
      </div>
    </main>
  );
}
