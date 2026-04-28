@page title="Docs Home" output="index.html"

@nav label="Home" href="index.html"

@nav label="Spec" href="spec.html"

@nav label="API" href="api.html" slot="footer"

# Docs Home

@toc

@decision id="renderer-contract"
Docs rendering keeps local anchors stable.

@paragraph
Lessmark supports {{strong:explicit}} inline functions, {{mark:marked text}}, {{del:deleted text}}, {{ref:local references|build-system}}, and {{footnote:strict-syntax}}.

@image src="assets/diagram.svg" alt="Build pipeline" caption="Static site output"

@list kind="unordered"
- Parse strict source.
- Validate typed blocks.
- Render safe HTML.

@table columns="Feature|Status"
Typed blocks\|agents|done
Raw HTML|rejected

@quote cite="BGs Labs"
If you want a simple language, stay simple.

@callout kind="tip" title="No hooks by default"
Use built-in blocks before adding execution surfaces.

## Build System

@definition term="Build system"
A deterministic renderer that turns typed Lessmark into static output without raw HTML.

@reference target="build-system" label="Build system section"
Jump to the build-system section.

@reference target="renderer-contract" label="Renderer contract decision"
Jump to the renderer-contract decision.

@reference target="strict-syntax" label="Strict syntax footnote"
Jump to the strict-syntax footnote.

@footnote id="strict-syntax"
Lessmark keeps one explicit spelling for each supported structure.
