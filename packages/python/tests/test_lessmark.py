import json
import tempfile
import unittest
from contextlib import redirect_stderr, redirect_stdout
from io import StringIO
from pathlib import Path

from lessmark import (
    LessmarkError,
    format_ast,
    format_lessmark,
    from_markdown,
    get_capabilities,
    parse_lessmark,
    to_markdown,
    validate_ast,
    validate_source,
)
from lessmark.cli import main

ROOT = Path(__file__).resolve().parents[3]


class LessmarkPythonTests(unittest.TestCase):
    def test_parses_fixture_ast(self):
        source = (ROOT / "fixtures/valid/project-context.lmk").read_text(encoding="utf-8")
        expected = json.loads((ROOT / "fixtures/valid/project-context.ast.json").read_text(encoding="utf-8"))
        self.assertEqual(parse_lessmark(source), expected)

    def test_all_valid_fixtures_have_stable_ast_snapshots(self):
        for path in sorted((ROOT / "fixtures/valid").glob("*.lmk")):
            source = path.read_text(encoding="utf-8")
            expected = json.loads(path.with_suffix(".ast.json").read_text(encoding="utf-8"))
            self.assertEqual(parse_lessmark(source), expected, path.name)

    def test_all_invalid_fixtures_are_rejected_by_the_parser(self):
        for path in sorted((ROOT / "fixtures/invalid").glob("*.lmk")):
            with self.subTest(path=path.name):
                with self.assertRaises(LessmarkError):
                    parse_lessmark(path.read_text(encoding="utf-8"))

    def test_format_is_idempotent(self):
        source = (ROOT / "fixtures/valid/project-context.lmk").read_text(encoding="utf-8")
        self.assertEqual(format_lessmark(source), format_lessmark(format_lessmark(source)))

    def test_preserves_indented_example_text(self):
        source = (ROOT / "fixtures/valid/example-code.lmk").read_text(encoding="utf-8")
        expected = json.loads((ROOT / "fixtures/valid/example-code.ast.json").read_text(encoding="utf-8"))
        self.assertEqual(parse_lessmark(source), expected)
        self.assertEqual(format_lessmark(source), source)

    def test_canonicalizes_documented_human_authoring_conveniences(self):
        source = """# Project Context

@p
Use **bold**, *emphasis*, `code`, `**literal**`, [Docs](https://example.com), [Decision](#storage-backend), [^note], ==marked==, and ~~gone~~.

@ul
- One
- Two

@ol
- First
- Second

@decision storage-backend
Use SQLite.

@task todo
Add docs.

@risk high
Migration risk.

@file src/app.ts
Owns app.

@api parseLessmark
Parser API.

@code ts
const ok = true;

@math tex
E = mc^2

@diagram mermaid
graph TD
  A --> B

@warning
Watch this.

@definition API
Application programming interface.

@table Name|Value
Stage|alpha

@separator

@metadata project.stage
alpha

@link https://example.com
Homepage.

@footnote note
Footnote body.
"""
        formatted = format_lessmark(source)
        self.assertIn("Use {{strong:bold}}, {{em:emphasis}}, {{code:code}}, {{code:**literal**}}, {{link:Docs|https://example.com}}, {{ref:Decision|storage-backend}}, {{footnote:note}}, {{mark:marked}}, and {{del:gone}}.", formatted)
        self.assertIn('@list kind="unordered"\n- One\n- Two', formatted)
        self.assertIn('@list kind="ordered"\n- First\n- Second', formatted)
        self.assertIn('@decision id="storage-backend"', formatted)
        self.assertIn('@task status="todo"', formatted)
        self.assertIn('@risk level="high"', formatted)
        self.assertIn('@file path="src/app.ts"', formatted)
        self.assertIn('@api name="parseLessmark"', formatted)
        self.assertIn('@code lang="ts"\nconst ok = true;', formatted)
        self.assertIn('@math notation="tex"\nE = mc^2', formatted)
        self.assertIn('@diagram kind="mermaid"\ngraph TD\n  A --> B', formatted)
        self.assertIn('@callout kind="warning"\nWatch this.', formatted)
        self.assertIn('@definition term="API"\nApplication programming interface.', formatted)
        self.assertIn('@table columns="Name|Value"\nStage|alpha', formatted)
        self.assertIn("@separator", formatted)
        self.assertIn('@metadata key="project.stage"', formatted)
        self.assertIn('@link href="https://example.com"', formatted)
        self.assertIn('@footnote id="note"', formatted)
        self.assertEqual(validate_source(formatted), [])

    def test_ignores_leading_blank_lines_inside_body_capable_blocks(self):
        source = """@task done

hey

@metadata rfc.id

RFC-0042
"""
        self.assertEqual(format_lessmark(source), '@task status="done"\nhey\n\n@metadata key="rfc.id"\nRFC-0042\n')

    def test_rejects_unsafe_shorthand_links_and_ambiguous_shortcut_emphasis(self):
        with self.assertRaisesRegex(Exception, "executable URL"):
            format_lessmark("@paragraph\n[Bad](javascript:alert(1))\n")
        with self.assertRaisesRegex(Exception, "shortcut emphasis"):
            format_lessmark("@paragraph\n**bold *em***\n")
        with self.assertRaisesRegex(Exception, "shortcut emphasis"):
            format_lessmark("@paragraph\n*em **bold***\n")

    def test_rejects_legacy_markdown_block_syntax_inside_lessmark_prose(self):
        for source in [
            "@paragraph\n[docs]: https://example.com\n",
            "@paragraph\n---\n",
            "@paragraph\n===\n",
            "@paragraph\n-*- \n",
            "@paragraph\n> quoted text\n",
        ]:
            with self.subTest(source=source):
                errors = validate_source(source)
                self.assertEqual(errors[0]["code"], "markdown_legacy_syntax")
                with self.assertRaisesRegex(LessmarkError, "Markdown"):
                    parse_lessmark(source)

    def test_supports_strict_nested_lists(self):
        source = "@list kind=\"unordered\"\n- Parent\n  - Child\n- Sibling\n"
        self.assertEqual(validate_source(source), [])
        self.assertIn("  - Child", format_lessmark(source))
        self.assertIn("1. Parent\n  1. Child\n2. Sibling", to_markdown('@list kind="ordered"\n- Parent\n  - Child\n- Sibling\n'))
        with self.assertRaisesRegex(ValueError, "Mixed Markdown list markers"):
            from_markdown("- One\n* Two\n")
        with self.assertRaisesRegex(ValueError, "Mixed Markdown list markers"):
            from_markdown("1. One\n2) Two\n")

    def test_supports_escaped_pipes_in_table_columns(self):
        source = '@table columns="Name\\|Alias|Status"\nLessmark\\|lmk|done\n'
        self.assertEqual(validate_source(source), [])
        self.assertIn("| Name\\|Alias | Status |", to_markdown(source))

    def test_supports_empty_table_cells(self):
        source = '@table columns="Name|Status"\nLessmark|\n|todo\n'
        self.assertEqual(validate_source(source), [])

    def test_plain_top_level_prose_parses_as_paragraphs(self):
        ast = parse_lessmark("yo\nwant sup\n\nnah\n")
        self.assertEqual([(node["name"], node["text"]) for node in ast["children"]], [
            ("paragraph", "yo\nwant sup"),
            ("paragraph", "nah"),
        ])
        self.assertEqual(format_lessmark("@p\nyo\n\nnah\n"), "yo\n\nnah\n")

    def test_supports_escaped_leading_block_sigils_inside_prose(self):
        ast = parse_lessmark("\\@mention\n\\#hashtag\n")
        self.assertEqual([(node["name"], node["text"]) for node in ast["children"]], [
            ("paragraph", "@mention\n#hashtag"),
        ])
        source = "\\@mention\n\\#hashtag\n\n@summary\n\\@not-a-block\n\\#not-a-heading\n"
        formatted = format_lessmark(source)
        self.assertEqual(formatted, source)
        self.assertEqual(parse_lessmark(formatted), parse_lessmark(source))

    def test_literal_blocks_keep_first_column_block_sigils_until_blank_separator(self):
        source = '@code lang="py"\n@decorator\ndef f():\n  pass\n\n@code lang="c"\n#include <stdio.h>\nint main() { return 0; }\n'
        ast = parse_lessmark(source)
        self.assertEqual(len(ast["children"]), 2)
        self.assertEqual(ast["children"][0]["text"], "@decorator\ndef f():\n  pass")
        self.assertEqual(ast["children"][1]["text"], "#include <stdio.h>\nint main() { return 0; }")
        self.assertEqual(format_lessmark(source), source)

    def test_imports_markdown_code_fences_without_padding_first_column_block_sigils(self):
        lessmark = from_markdown("""```py
@decorator
def f(): pass
```

```c
#include <stdio.h>
```
""")
        ast = parse_lessmark(lessmark)
        self.assertEqual(ast["children"][0]["text"], "@decorator\ndef f(): pass")
        self.assertEqual(ast["children"][1]["text"], "#include <stdio.h>")

    def test_imports_safe_relative_standalone_markdown_links(self):
        self.assertEqual(from_markdown("[Guide](docs/guide.html)\n"), '@link href="docs/guide.html"\nGuide\n')

    def test_rejects_empty_headings(self):
        with self.assertRaisesRegex(LessmarkError, "Invalid heading syntax"):
            parse_lessmark("# \n\n@summary\nHeadings need visible text.\n")

    def test_rejects_html_like_text_during_parsing(self):
        with self.assertRaisesRegex(LessmarkError, "raw HTML"):
            parse_lessmark("@summary\nDo not use <script>alert(1)</script> here.\n")

    def test_rejects_unknown_attributes(self):
        with self.assertRaisesRegex(LessmarkError, "does not allow attribute"):
            parse_lessmark('@summary mood="casual"\nAttributes are fixed by block type.\n')

    def test_rejects_bad_task_status(self):
        with self.assertRaisesRegex(LessmarkError, "@task status must be one of"):
            parse_lessmark('@task status="later"\nUse one of the fixed task statuses.\n')

    def test_rejects_unsafe_file_paths_api_names_and_links(self):
        with self.assertRaisesRegex(LessmarkError, "relative project path"):
            parse_lessmark('@file path="../secrets.txt"\nFile paths must stay inside the project.\n')
        with self.assertRaisesRegex(LessmarkError, "identifier"):
            parse_lessmark('@api name="123 invalid"\nAPI names must be identifiers.\n')
        with self.assertRaisesRegex(LessmarkError, "safe relative path"):
            parse_lessmark('@link href="javascript:alert(1)"\nExecutable URL schemes are not allowed.\n')
        self.assertEqual(validate_source('@link href="docs/page.html"\nInternal docs page.\n'), [])
        with self.assertRaisesRegex(LessmarkError, "safe relative path"):
            parse_lessmark('@link href="//example.com"\nAmbiguous host.\n')
        with self.assertRaisesRegex(LessmarkError, "safe relative path"):
            parse_lessmark('@link href="../page.html"\nParent traversal.\n')

    def test_rejects_invalid_agent_context_attrs(self):
        with self.assertRaisesRegex(LessmarkError, "compact language identifier"):
            parse_lessmark('@code lang="bad lang"\nLanguage identifiers must be compact.\n')
        with self.assertRaisesRegex(LessmarkError, "lowercase dotted key"):
            parse_lessmark('@metadata key="Project Stage"\nMetadata keys must be lowercase dotted keys.\n')
        with self.assertRaisesRegex(LessmarkError, "risk level"):
            parse_lessmark('@risk level="later"\nRisk levels must stay in the fixed set.\n')
        with self.assertRaisesRegex(LessmarkError, "lowercase slug"):
            parse_lessmark('@depends-on target="../secret"\nDependency targets must be lowercase slugs.\n')

    def test_rejects_invalid_docs_attrs(self):
        with self.assertRaisesRegex(LessmarkError, "pipe-separated non-empty labels"):
            parse_lessmark('@table columns="Name|"\nValue\n')
        with self.assertRaisesRegex(LessmarkError, "@callout kind"):
            parse_lessmark('@callout kind="custom"\nNo custom callouts.\n')
        with self.assertRaisesRegex(LessmarkError, "safe relative .html path"):
            parse_lessmark('@page output="../index.html"\n')
        with self.assertRaisesRegex(LessmarkError, "safe relative, http, or https URL"):
            parse_lessmark('@image src="javascript:alert(1)" alt="Bad"\n')
        with self.assertRaisesRegex(LessmarkError, "safe relative path"):
            parse_lessmark('@nav label="Docs" href="javascript:alert(1)"\n')
        with self.assertRaisesRegex(LessmarkError, "primary or footer"):
            parse_lessmark('@nav label="Docs" href="index.html" slot="sidebar"\n')
        with self.assertRaisesRegex(LessmarkError, "primary or footer"):
            parse_lessmark('@nav label="Docs" href="index.html" slot=""\n')
        with self.assertRaisesRegex(LessmarkError, "tex, asciimath"):
            parse_lessmark('@math notation="mathml"\nE = mc^2\n')
        with self.assertRaisesRegex(LessmarkError, "mermaid, graphviz, plantuml"):
            parse_lessmark('@diagram kind="unknown"\ngraph TD\n')
        with self.assertRaisesRegex(LessmarkError, "does not allow attribute"):
            parse_lessmark('@separator style="thin"\n')
        with self.assertRaisesRegex(LessmarkError, "lowercase slug"):
            parse_lessmark('@reference target="../secret"\nBad target.\n')
        with self.assertRaisesRegex(LessmarkError, "Unknown local reference target"):
            parse_lessmark('@reference target="missing-section"\nBad target.\n')
        with self.assertRaisesRegex(LessmarkError, "raw HTML"):
            parse_lessmark('@definition term="Term<T>"\nBad term.\n')
        with self.assertRaisesRegex(LessmarkError, "row cell count"):
            parse_lessmark('@table columns="Feature|Status"\nOnly one cell\n')
        with self.assertRaisesRegex(LessmarkError, "skip levels"):
            parse_lessmark('@list kind="unordered"\n- Parent\n    - Child\n')

    def test_can_include_source_positions_without_changing_default_ast(self):
        source = (ROOT / "fixtures/valid/project-context.lmk").read_text(encoding="utf-8")
        plain = parse_lessmark(source)
        positioned = parse_lessmark(source, source_positions=True)
        self.assertNotIn("position", plain["children"][0])
        self.assertEqual(
            positioned["children"][0]["position"],
            {"start": {"line": 1, "column": 1}, "end": {"line": 1, "column": 18}},
        )
        self.assertEqual(validate_ast(positioned), [])

    def test_validate_source_reports_parse_errors_as_data(self):
        errors = validate_source("@summary\nDo not use <script>alert(1)</script> here.\n")
        self.assertEqual(
            errors,
            [{"code": "raw_html", "message": "@summary contains raw HTML/JSX-like syntax", "line": 2, "column": 1}],
        )

    def test_validates_required_attrs_on_direct_ast_input(self):
        errors = validate_ast(
            {"type": "document", "children": [{"type": "block", "name": "file", "attrs": {}, "text": "Owns capture state."}]}
        )
        self.assertEqual(len(errors), 1)
        self.assertEqual(errors[0]["message"], "@file requires path")

    def test_validates_fixed_attrs_on_direct_ast_input(self):
        errors = validate_ast(
            {
                "type": "document",
                "children": [{"type": "block", "name": "summary", "attrs": {"mood": "casual"}, "text": "No custom attrs."}],
            }
        )
        self.assertEqual(len(errors), 1)
        self.assertEqual(errors[0]["message"], '@summary does not allow attribute "mood"')

    def test_validates_semantic_attrs_on_direct_ast_input(self):
        errors = validate_ast(
            {
                "type": "document",
                "children": [
                    {"type": "block", "name": "file", "attrs": {"path": "/tmp/secret.txt"}, "text": "Bad file path."},
                    {"type": "block", "name": "api", "attrs": {"name": "123 invalid"}, "text": "Bad API name."},
                    {"type": "block", "name": "link", "attrs": {"href": "javascript:alert(1)"}, "text": "Bad link."},
                ],
            }
        )
        self.assertEqual(
            errors,
            [
                {"code": "validation_error", "message": "@file path must be a relative project path"},
                {"code": "validation_error", "message": "@api name must be an identifier"},
                {"code": "unsafe_link_or_path", "message": "@link href must be http, https, mailto, or a safe relative path"},
            ],
        )

    def test_rejects_duplicate_local_anchor_slugs_on_direct_ast_input(self):
        errors = validate_ast(
            {
                "type": "document",
                "children": [
                    {"type": "heading", "level": 1, "text": "Build System"},
                    {"type": "block", "name": "decision", "attrs": {"id": "build-system"}, "text": "Collision."},
                ],
            }
        )
        self.assertEqual(errors, [{"code": "duplicate_local_anchor", "message": 'Duplicate local anchor slug "build-system"'}])
        rendered_footnote_errors = validate_ast(
            {
                "type": "document",
                "children": [
                    {"type": "heading", "level": 1, "text": "Fn Build System"},
                    {"type": "block", "name": "footnote", "attrs": {"id": "build-system"}, "text": "Collision."},
                ],
            }
        )
        self.assertEqual(rendered_footnote_errors, [{"code": "duplicate_local_anchor", "message": 'Duplicate local anchor slug "fn-build-system"'}])

    def test_rejects_unknown_local_reference_targets_on_direct_ast_input(self):
        errors = validate_ast(
            {
                "type": "document",
                "children": [
                    {"type": "heading", "level": 1, "text": "Build System"},
                    {"type": "block", "name": "reference", "attrs": {"target": "missing-section"}, "text": "Bad target."},
                ],
            }
        )
        self.assertEqual(errors, [{"code": "unknown_reference_target", "message": 'Unknown local reference target "missing-section"'}])

    def test_validates_non_string_attrs_without_treating_present_values_as_missing(self):
        errors = validate_ast(
            {
                "type": "document",
                "children": [
                    {"type": "block", "name": "summary", "attrs": {"mood": 1}, "text": "Bad custom attr."},
                    {"type": "block", "name": "task", "attrs": {"status": 1}, "text": "Bad status type."},
                ],
            }
        )
        self.assertEqual(
            errors,
            [
                {"code": "invalid_ast_value", "message": 'Attribute "mood" must be a string'},
                {"code": "unknown_attribute", "message": '@summary does not allow attribute "mood"'},
                {"code": "invalid_ast_value", "message": 'Attribute "status" must be a string'},
            ],
        )

    def test_validates_exact_ast_shape(self):
        errors = validate_ast(
            {"type": "document", "children": [{"type": "heading", "level": 7, "text": "", "extra": True}], "extra": True}
        )
        self.assertEqual(
            errors,
            [
                {"code": "invalid_ast_shape", "message": 'document has unknown property "extra"'},
                {"code": "invalid_ast_shape", "message": 'heading has unknown property "extra"'},
                {"code": "validation_error", "message": "heading level must be an integer from 1 to 6"},
                {"code": "validation_error", "message": "heading text must be a non-empty string"},
            ],
        )

    def test_refuses_to_format_invalid_ast(self):
        with self.assertRaisesRegex(ValueError, "Cannot format invalid AST"):
            format_ast({"type": "document", "children": [{"type": "heading", "level": 7, "text": "Too deep"}]})

    def test_imports_markdown_code_fences_with_internal_blank_lines(self):
        lessmark = from_markdown("# Project\n\n```js\nconst a = 1;\n\nconst b = 2;\n```\n")
        self.assertEqual(validate_source(lessmark), [])
        ast = parse_lessmark(lessmark)
        self.assertEqual(ast["children"][1]["text"], "const a = 1;\n\nconst b = 2;")

    def test_imports_common_gfm_blocks_into_typed_lessmark_blocks(self):
        lessmark = from_markdown(
            '# Project\n\n'
            '![Build pipeline](assets/diagram.svg "Pipeline")\n\n'
            '> [!WARNING] Migration\n'
            '> Check imported content.\n\n'
            '> Keep source safe.\n'
            '> Preserve the quote.\n\n'
            '| Feature | Status |\n'
            '| --- | --- |\n'
            '| Images | done |\n'
            '| Tables \\| escaped | done |\n\n'
            '---\n'
        )
        self.assertIn('@image alt="Build pipeline" caption="Pipeline" src="assets/diagram.svg"', lessmark)
        self.assertIn('@callout kind="warning" title="Migration"\nCheck imported content.', lessmark)
        self.assertIn("@quote\nKeep source safe.\nPreserve the quote.", lessmark)
        self.assertIn('@table columns="Feature|Status"', lessmark)
        self.assertIn(r"Tables \| escaped|done", lessmark)
        self.assertIn("@separator", lessmark)
        self.assertEqual(validate_source(lessmark), [])

    def test_imports_markdown_prose_as_paragraphs(self):
        self.assertEqual(from_markdown("para one\n\npara two\n"), "para one\n\npara two\n")

    def test_imports_normal_markdown_lists(self):
        unordered = from_markdown("- Parent\n  - Child\n- Sibling\n")
        self.assertIn('@list kind="unordered"\n- Parent\n  - Child\n- Sibling', unordered)
        ordered = from_markdown("1. First\n   1. Child\n2. Second\n")
        self.assertIn('@list kind="ordered"\n- First\n  - Child\n- Second', ordered)

    def test_imports_and_exports_math_and_diagram_blocks(self):
        lessmark = from_markdown("$$\nE = mc^2\n$$\n\n```mermaid\ngraph TD\n  A --> B\n```\n")
        self.assertIn('@math notation="tex"\nE = mc^2', lessmark)
        self.assertIn('@diagram kind="mermaid"\ngraph TD\n  A --> B', lessmark)
        self.assertEqual(validate_source(lessmark), [])
        self.assertEqual(to_markdown('@math notation="tex"\nE = mc^2\n'), "$$\nE = mc^2\n$$\n")
        self.assertEqual(to_markdown('@diagram kind="mermaid"\ngraph TD\n  A --> B\n'), "```mermaid\ngraph TD\n  A --> B\n```\n")

    def test_keeps_math_and_diagram_bodies_literal(self):
        self.assertEqual(format_lessmark('@math notation="tex"\n**not bold**\n'), '@math notation="tex"\n**not bold**\n')
        self.assertEqual(format_lessmark('@diagram kind="mermaid"\nA[**literal**] --> B\n'), '@diagram kind="mermaid"\nA[**literal**] --> B\n')

    def test_rejects_unclosed_markdown_code_fences(self):
        with self.assertRaisesRegex(ValueError, "Unclosed fenced code block"):
            from_markdown("```js\nconst a = 1;\n")

    def test_exports_lessmark_to_markdown(self):
        source = (ROOT / "fixtures/valid/project-context.lmk").read_text(encoding="utf-8")
        markdown = to_markdown(source)
        self.assertTrue(markdown.startswith("# Project Context"))
        self.assertIn("- [ ] Add export settings.", markdown)
        self.assertEqual(to_markdown("@separator\n"), "---\n")

    def test_exports_docs_blocks_to_markdown(self):
        source = (ROOT / "fixtures/valid/docs-page.lmk").read_text(encoding="utf-8")
        markdown = to_markdown(source)
        self.assertIn("# Docs Home", markdown)
        self.assertIn("**explicit**", markdown)
        self.assertIn("==marked text==", markdown)
        self.assertIn("[^strict-syntax]: Lessmark keeps one explicit spelling", markdown)
        self.assertIn("### renderer-contract", markdown)
        self.assertIn("**Build system**", markdown)
        self.assertIn("[Build system section](#build-system)", markdown)
        self.assertIn("[Renderer contract decision](#renderer-contract)", markdown)
        self.assertIn("[Strict syntax footnote](#fn-strict-syntax)", markdown)
        self.assertIn("- [Home](index.html)", markdown)
        self.assertIn("- [API](api.html)", markdown)
        self.assertIn("> [!TIP] No hooks by default", markdown)
        self.assertIn("| Feature | Status |", markdown)
        self.assertIn("| Typed blocks\\|agents | done |", markdown)
        self.assertIn("![Build pipeline](assets/diagram.svg)", markdown)

    def test_rejects_unresolved_inline_local_targets(self):
        ref_errors = validate_source("@paragraph\n{{ref:Missing|missing-target}}\n")
        self.assertEqual(ref_errors[0]["code"], "unknown_inline_target")
        self.assertIn("missing-target", ref_errors[0]["message"])

        footnote_errors = validate_source("@paragraph\n{{footnote:missing-note}}\n")
        self.assertEqual(footnote_errors[0]["code"], "unknown_inline_target")
        self.assertIn("missing-note", footnote_errors[0]["message"])

        parse_lessmark(
            '@decision id="known-target"\nDone.\n\n'
            "@paragraph\n{{ref:Known|known-target}}\n\n"
            '@footnote id="known-note"\nA note.\n\n'
            "@paragraph\n{{footnote:known-note}}\n"
        )

    def test_rejects_invalid_inline_local_targets_during_markdown_export(self):
        with self.assertRaisesRegex(ValueError, "lowercase slug"):
            to_markdown("@paragraph\n{{ref:Build|Build System}}\n")
        with self.assertRaisesRegex(LessmarkError, "Unknown inline local target"):
            to_markdown("@paragraph\n{{ref:Build| build-system}}\n")
        with self.assertRaisesRegex(ValueError, "lowercase slug"):
            to_markdown("@paragraph\n{{footnote:}}\n")
        with self.assertRaisesRegex(ValueError, "lowercase slug"):
            to_markdown("# {{ref:Build|Build System}}\n")
        with self.assertRaisesRegex(LessmarkError, "Unknown inline local target"):
            to_markdown('@callout kind="note" title="{{footnote: strict-syntax}}"\nBody.\n')

    def test_exports_literal_code_and_example_inline_syntax(self):
        self.assertIn("{{ref:Build|Build System}}", to_markdown("@code\n{{ref:Build|Build System}}\n"))
        self.assertIn("{{footnote: bad id}}", to_markdown("@example\n{{footnote: bad id}}\n"))

    def test_cli_check_json_prints_agent_readable_errors(self):
        output = StringIO()
        path = ROOT / "fixtures/invalid/raw-html.lmk"
        with redirect_stdout(output):
            status = main(["check", str(path), "--json"])
        result = json.loads(output.getvalue())
        self.assertEqual(status, 1)
        self.assertFalse(result["ok"])
        self.assertEqual(result["errors"][0]["code"], "raw_html")
        self.assertIn("raw HTML", result["errors"][0]["message"])
        self.assertEqual(result["errors"][0]["line"], 2)
        self.assertEqual(result["errors"][0]["column"], 1)

    def test_cli_converts_markdown_to_lessmark(self):
        output = StringIO()
        path = ROOT / "fixtures/valid/markdown-import.fixture"
        with redirect_stdout(output):
            status = main(["from-markdown", str(path)])
        self.assertEqual(status, 0)
        self.assertIn("\nMarkdown import fixture.\n", output.getvalue())

    def test_cli_converts_lessmark_to_markdown(self):
        output = StringIO()
        path = ROOT / "fixtures/valid/project-context.lmk"
        with redirect_stdout(output):
            status = main(["to-markdown", str(path)])
        self.assertEqual(status, 0)
        self.assertIn("- [ ] Add export settings.", output.getvalue())

    def test_cli_fix_is_formatter_alias(self):
        output = StringIO()
        path = ROOT / "fixtures/valid/project-context.lmk"
        with redirect_stdout(output):
            status = main(["fix", str(path)])
        self.assertEqual(status, 0)
        self.assertTrue(output.getvalue().startswith("# Project Context"))

    def test_cli_format_check_reports_formatting_status(self):
        with tempfile.TemporaryDirectory(prefix="lessmark-format-check-") as temp:
            formatted = Path(temp) / "formatted.lmk"
            unformatted = Path(temp) / "unformatted.lmk"
            formatted.write_text((ROOT / "fixtures/valid/project-context.lmk").read_text(encoding="utf-8"), encoding="utf-8")
            unformatted.write_text("@task todo\nDo it.\n", encoding="utf-8")

            output = StringIO()
            with redirect_stdout(output):
                status = main(["format", str(formatted), "--check"])
            self.assertEqual(status, 0)
            self.assertIn("formatted", output.getvalue())

            error_output = StringIO()
            with redirect_stderr(error_output):
                status = main(["format", str(unformatted), "--check"])
            self.assertEqual(status, 1)
            self.assertIn("needs formatting", error_output.getvalue())

    def test_capabilities_and_cli_info_are_machine_readable(self):
        info = get_capabilities()
        self.assertEqual(info["language"], "lessmark")
        self.assertEqual(info["astVersion"], "v0")
        self.assertTrue(info["syntaxPolicy"]["aliases"])
        self.assertTrue(info["cli"]["formatCheck"])
        self.assertIn("summary", info["blocks"])

        output = StringIO()
        with redirect_stdout(output):
            status = main(["info", "--json"])
        result = json.loads(output.getvalue())
        self.assertEqual(status, 0)
        self.assertEqual(result["language"], "lessmark")
        self.assertIn("ref", result["inlineFunctions"])

        output = StringIO()
        with redirect_stdout(output):
            status = main(["info"])
        self.assertEqual(status, 0)
        self.assertTrue(output.getvalue().startswith("Lessmark 0.1.5\n"))
        self.assertNotIn("(v", output.getvalue())


if __name__ == "__main__":
    unittest.main()
