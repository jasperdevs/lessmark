import { Playground } from "@/components/Playground";
import { playgroundDefault } from "@/lib/content";

export function PlaygroundPage() {
  return (
    <main className="px-2 sm:px-3 pb-3 h-[calc(100svh-72px)] min-h-[620px] overflow-hidden">
      <Playground initial={playgroundDefault} sample={playgroundDefault} fullHeight />
    </main>
  );
}
