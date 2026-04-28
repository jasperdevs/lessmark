import { Playground } from "@/components/Playground";

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
Changing capture flow can break existing workflows.
`;

export function PlaygroundPage() {
  return (
    <main className="px-3 pb-3 h-[calc(100vh-72px)] overflow-hidden">
      <Playground initial={SAMPLE} sample={SAMPLE} fullHeight />
    </main>
  );
}
