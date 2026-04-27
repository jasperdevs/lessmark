import json
import unittest
from pathlib import Path

from lessmark import format_lessmark, parse_lessmark, validate_source

ROOT = Path(__file__).resolve().parents[3]


class LessmarkPythonTests(unittest.TestCase):
    def test_parses_fixture_ast(self):
        source = (ROOT / "fixtures/valid/project-context.lmk").read_text(encoding="utf-8")
        expected = json.loads((ROOT / "fixtures/valid/project-context.ast.json").read_text(encoding="utf-8"))
        self.assertEqual(parse_lessmark(source), expected)

    def test_format_is_idempotent(self):
        source = (ROOT / "fixtures/valid/project-context.lmk").read_text(encoding="utf-8")
        self.assertEqual(format_lessmark(source), format_lessmark(format_lessmark(source)))

    def test_validates_html_like_text(self):
        errors = validate_source("@summary\nDo not use <script>alert(1)</script> here.\n")
        self.assertEqual(len(errors), 1)
        self.assertIn("raw HTML", errors[0]["message"])


if __name__ == "__main__":
    unittest.main()