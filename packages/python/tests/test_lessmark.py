import json
import unittest
from pathlib import Path

from lessmark import LessmarkError, format_lessmark, parse_lessmark, validate_ast

ROOT = Path(__file__).resolve().parents[3]


class LessmarkPythonTests(unittest.TestCase):
    def test_parses_fixture_ast(self):
        source = (ROOT / "fixtures/valid/project-context.lmk").read_text(encoding="utf-8")
        expected = json.loads((ROOT / "fixtures/valid/project-context.ast.json").read_text(encoding="utf-8"))
        self.assertEqual(parse_lessmark(source), expected)

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


if __name__ == "__main__":
    unittest.main()
