import { Playground } from "@/components/Playground";
import { playgroundDefault, sourceId } from "@/lib/content";
import { useLiveSourceCtx } from "@/lib/live-source";

export function PlaygroundPage() {
  const ctx = useLiveSourceCtx();
  const id = sourceId.playground("default");
  const source = ctx.get(id);

  return (
    <main className="px-2 sm:px-3 pb-3 h-[calc(100svh-72px)] min-h-[620px] overflow-hidden">
      <Playground
        value={source}
        onChange={(next) => ctx.set(id, next)}
        sample={playgroundDefault}
        fullHeight
      />
    </main>
  );
}
