import json
import unittest
from contextlib import redirect_stdout
from io import StringIO
from pathlib import Path

from lessmark import (
    LessmarkError,
    format_ast,
    format_lessmark,
    from_markdown,
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
        with self.assertRaisesRegex(LessmarkError, "executable URL scheme"):
            parse_lessmark('@link href="javascript:alert(1)"\nExecutable URL schemes are not allowed.\n')

    def test_rejects_invalid_agent_context_attrs(self):
        with self.assertRaisesRegex(LessmarkError, "compact language identifier"):
            parse_lessmark('@code lang="bad lang"\nLanguage identifiers must be compact.\n')
        with self.assertRaisesRegex(LessmarkError, "lowercase dotted key"):
            parse_lessmark('@metadata key="Project Stage"\nMetadata keys must be lowercase dotted keys.\n')
        with self.assertRaisesRegex(LessmarkError, "risk level"):
            parse_lessmark('@risk level="later"\nRisk levels must stay in the fixed set.\n')
        with self.assertRaisesRegex(LessmarkError, "lowercase slug"):
            parse_lessmark('@depends-on target="../secret"\nDependency targets must be lowercase slugs.\n')

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
            [{"message": "@summary contains raw HTML/JSX-like syntax", "line": 2, "column": 1}],
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
                {"message": "@file path must be a relative project path"},
                {"message": "@api name must be an identifier"},
                {"message": "@link href must not use an executable URL scheme"},
            ],
        )

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
                {"message": 'Attribute "mood" must be a string'},
                {"message": '@summary does not allow attribute "mood"'},
                {"message": 'Attribute "status" must be a string'},
            ],
        )

    def test_validates_exact_ast_shape(self):
        errors = validate_ast(
            {"type": "document", "children": [{"type": "heading", "level": 7, "text": "", "extra": True}], "extra": True}
        )
        self.assertEqual(
            errors,
            [
                {"message": 'document has unknown property "extra"'},
                {"message": 'heading has unknown property "extra"'},
                {"message": "heading level must be an integer from 1 to 6"},
                {"message": "heading text must be a non-empty string"},
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

    def test_rejects_unclosed_markdown_code_fences(self):
        with self.assertRaisesRegex(ValueError, "Unclosed fenced code block"):
            from_markdown("```js\nconst a = 1;\n")

    def test_exports_lessmark_to_markdown(self):
        source = (ROOT / "fixtures/valid/project-context.lmk").read_text(encoding="utf-8")
        markdown = to_markdown(source)
        self.assertTrue(markdown.startswith("# Project Context"))
        self.assertIn("- [ ] Add export settings.", markdown)

    def test_cli_check_json_prints_agent_readable_errors(self):
        output = StringIO()
        path = ROOT / "fixtures/invalid/raw-html.lmk"
        with redirect_stdout(output):
            status = main(["check", str(path), "--json"])
        result = json.loads(output.getvalue())
        self.assertEqual(status, 1)
        self.assertFalse(result["ok"])
        self.assertIn("raw HTML", result["errors"][0]["message"])
        self.assertEqual(result["errors"][0]["line"], 2)
        self.assertEqual(result["errors"][0]["column"], 1)

    def test_cli_converts_markdown_to_lessmark(self):
        output = StringIO()
        path = ROOT / "fixtures/valid/markdown-import.md"
        with redirect_stdout(output):
            status = main(["from-markdown", str(path)])
        self.assertEqual(status, 0)
        self.assertIn("@summary\nMarkdown import fixture.", output.getvalue())

    def test_cli_converts_lessmark_to_markdown(self):
        output = StringIO()
        path = ROOT / "fixtures/valid/project-context.lmk"
        with redirect_stdout(output):
            status = main(["to-markdown", str(path)])
        self.assertEqual(status, 0)
        self.assertIn("- [ ] Add export settings.", output.getvalue())


if __name__ == "__main__":
    unittest.main()
