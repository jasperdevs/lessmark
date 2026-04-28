@page title="Docs Home" output="index.html"

# Docs Home

@toc

@paragraph
Lessmark supports {{strong:explicit}} inline functions and {{link:safe links|https://example.com}}.

@image src="assets/diagram.svg" alt="Build pipeline" caption="Static site output"

@list kind="unordered"
- Parse strict source.
- Validate typed blocks.
- Render safe HTML.

@table columns="Feature|Status"
Typed blocks|done
Raw HTML|rejected

@quote cite="BGs Labs"
If you want a simple language, stay simple.

@callout kind="tip" title="No hooks by default"
Use built-in blocks before adding execution surfaces.
