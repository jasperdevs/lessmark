# Project Context

@summary
This repo builds a local Windows screenshot app.

@decision id="manual-scrolling"
Manual scrolling capture stays because apps scroll differently.

@constraint
Do not auto-scroll or auto-end capture unless the user explicitly asks.

@task status="todo"
Add export settings.

@file path="src/Capture/ScrollingCaptureService.cs"
Owns stitching and capture state.

@code lang="csharp"
await captureService.StartAsync();

@metadata key="project.stage"
pre-alpha

@risk level="medium"
Changing capture behavior can break user muscle memory.

@depends-on target="manual-scrolling"
Export settings must preserve the manual scrolling decision.
