import { Link } from "react-router-dom";
import { examples, uiText } from "@/lib/content";

export function ExamplesIndex() {
  return (
    <main className="mx-auto max-w-[880px] px-4 sm:px-6 py-10 sm:py-12">
      <div className="mb-10">
        <h1 className="font-bold text-[clamp(32px,4.5vw,44px)] leading-[1.1] tracking-[-0.02em] text-fg">
          {uiText["examples.index-heading"] || "Examples"}
        </h1>
      </div>
      <ul className="flex flex-col">
        {examples.map((e) => (
          <li key={e.slug} className="border-t border-border-soft py-5">
            <Link to={`/examples/${e.slug}`} className="group block">
              <h2 className="font-bold text-[18px] tracking-[-0.01em] text-fg group-hover:underline underline-offset-4 decoration-fg-faint group-hover:decoration-fg">
                {e.title}
              </h2>
              {e.summary && (
                <p className="mt-1 text-[14px] leading-[1.55] text-fg-muted">
                  {e.summary}
                </p>
              )}
              <div className="mt-1.5 text-[12px] text-fg-faint italic">
                {e.slug}.lmk
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </main>
  );
}
