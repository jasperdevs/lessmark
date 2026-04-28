# Syntax tour

@summary
A single document that exercises every block and every inline function
in the language. Useful as a renderer torture-test.

## Prose with inline syntax

@paragraph
Lessmark supports {{strong:bold}}, {{em:italic}}, {{code:inline code}},
{{kbd:Ctrl+S}}, {{mark:highlight}}, and {{del:strikethrough}} inside any
prose body. Press {{kbd:Cmd+K}} to open the search bar. Visit
{{link:our docs|https://example.com/docs}} for the full list. See
{{ref:Storage|storage-backend}} for the rationale. This claim is
well-established{{footnote:knuth-1974}}.

## Agent-context blocks

@summary
Local Windows screenshot app. The agent reading this should treat every
constraint as binding and every decision as already settled.

@metadata key="project.stage"
beta

@metadata key="project.owner"
capture-team

@decision id="storage-backend"
Save captures as PNG plus a sidecar JSON for metadata. No proprietary
container format.

@decision id="single-window"
The app runs as a single window. No tray icon, no background mode.

@constraint
Never upload a capture to a remote service without an opt-in dialog.

@constraint
Do not require admin privileges. The app must work for a standard user.

@task status="todo"
Add export settings.

@task status="doing"
Migrate hotkey registration off the deprecated win32 path.

@task status="done"
Switch from BMP to PNG by default.

@task status="blocked"
Add cloud sync. Blocked on the storage decision.

@file path="src/Capture/Service.cs"
Owns stitching and capture state. The state machine is documented inline.

@api name="captureWindow"
Captures a single window by handle. Returns a PNG buffer.

@risk level="low"
Touching the icon tray code is mostly cosmetic.

@risk level="medium"
Changing capture flow can break workflows users have built around the
current shortcut behavior.

@risk level="high"
The hotkey migration changes the registration order at startup.

@risk level="critical"
A bad migration of the SQLite schema would lose every saved capture.

@depends-on target="storage-backend"
Implements the SQLite write path described in the decision.

## Documentation surfaces

### Quotes

@quote cite="Donald Knuth"
Premature optimization is the root of all evil.

@quote
A short un-attributed quote also works.

### Callouts

@callout kind="note" title="One-time setup"
Run {{code:lessmark info --json}} to see what your installed version
supports.

@callout kind="tip"
Add {{code:lessmark check}} to your pre-commit hook to keep CI green.

@callout kind="warning"
The {{code:fix --write}} command rewrites files in place.

@callout kind="caution"
Removing a decision id breaks every {{code:{{ref:...}}}} that points at
it across the project.

### Quick asides

@note
Generated files live in {{code:dist/}} and are gitignored.

@warning
Embedding a script tag in any block body is a parse error.

### Lists

@list kind="unordered"
- First item with {{strong:bold}} text.
- Second item with {{code:inline code}}.
- Third item with a {{link:link|https://example.com}}.

@list kind="ordered"
- First step.
- Second step.
- Third step.

### Tables

@table columns="Code|Meaning|Exit"
0|Success|exits 0
1|Validation or parse error|exits 1
2|I/O error|exits 2

### Code blocks

@code lang="js"
function add(a, b) {
  return a + b;
}

@code lang="py"
def add(a, b):
    return a + b

@code lang="sh"
lessmark parse notes.mu
lessmark check --json notes.mu

### Images

@image src="https://placehold.co/600x300" alt="Placeholder diagram" caption="A figure caption rendered below the image."

## Cross references

@toc

@definition term="agent context"
A document an LLM reads to understand a project.

@definition term="lessmark"
A strict markdown alternative with typed blocks and a stable JSON tree.

@reference target="storage-backend"
See the storage decision for the SQLite rationale.

@footnote id="knuth-1974"
Donald Knuth, "Structured Programming with go to Statements", 1974.

@link href="https://example.com/spec"
Read the full specification
