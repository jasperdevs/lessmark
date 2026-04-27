import re
from dataclasses import dataclass
from typing import Any

CORE_BLOCKS = {
    "summary",
    "decision",
    "constraint",
    "task",
    "file",
    "example",
    "note",
    "warning",
    "api",
    "link",
}

TASK_STATUSES = {"todo", "doing", "done", "blocked"}
HTML_TAG_PATTERN = re.compile(r"</?[A-Za-z][A-Za-z0-9:-]*(?:\s[^>]*)?>")


@dataclass
class LessmarkError(Exception):
    message: str
    line: int = 1
    column: int = 1

    def __str__(self) -> str:
        return f"{self.message} at {self.line}:{self.column}"


def parse_lessmark(source: str) -> dict[str, Any]:
    normalized = str(source).lstrip("\ufeff").replace("\r\n", "\n").replace("\r", "\n")
    lines = normalized.split("\n")
    children: list[dict[str, Any]] = []
    index = 0

    while index < len(lines):
        line = lines[index]

        if line.strip() == "":
            index += 1
            continue

        if line.startswith("#"):
            children.append(_parse_heading(line, index + 1))
            index += 1
            continue

        if line.startswith("@"):
            node, next_index = _parse_block(lines, index)
            children.append(node)
            index = next_index
            continue

        raise LessmarkError("Loose text is not allowed outside a typed block", index + 1, 1)

    return {"type": "document", "children": children}


def _parse_heading(line: str, line_number: int) -> dict[str, Any]:
    match = re.match(r"^(#{1,6}) (.*)$", line)
    if not match:
        raise LessmarkError("Invalid heading syntax", line_number, 1)
    text = match.group(2).rstrip()
    if re.search(r"\s#+\s*$", text):
        raise LessmarkError("Closing heading markers are not supported", line_number, len(line))
    return {"type": "heading", "level": len(match.group(1)), "text": text}


def _parse_block(lines: list[str], start_index: int) -> tuple[dict[str, Any], int]:
    header = lines[start_index]
    match = re.match(r"^@([a-z][a-z0-9_-]*)(.*)$", header)
    if not match:
        raise LessmarkError("Invalid typed block header", start_index + 1, 1)

    name = match.group(1)
    if name not in CORE_BLOCKS:
        raise LessmarkError(f'Unknown typed block "{name}"', start_index + 1, 2)

    attrs = _parse_attrs(match.group(2), start_index + 1, len(name) + 2)
    body: list[str] = []
    index = start_index + 1

    while index < len(lines):
        line = lines[index]
        if line.strip() == "" or line.startswith("#") or line.startswith("@"):
            break
        body.append(line.rstrip())
        index += 1

    return {"type": "block", "name": name, "attrs": attrs, "text": "\n".join(body).strip()}, index


def _parse_attrs(input_text: str, line_number: int, start_column: int) -> dict[str, str]:
    attrs: dict[str, str] = {}
    index = 0

    while index < len(input_text):
        if input_text[index].isspace():
            index += 1
            continue

        key_match = re.match(r"^[a-z][a-z0-9_-]*", input_text[index:])
        if not key_match:
            raise LessmarkError("Invalid attribute name", line_number, start_column + index)

        key = key_match.group(0)
        index += len(key)

        if index >= len(input_text) or input_text[index] != "=":
            raise LessmarkError("Expected = after attribute name", line_number, start_column + index)
        index += 1

        if index >= len(input_text) or input_text[index] != '"':
            raise LessmarkError("Attribute values must be double-quoted", line_number, start_column + index)

        value, index = _read_quoted(input_text, index, line_number, start_column)
        if key in attrs:
            raise LessmarkError(f'Duplicate attribute "{key}"', line_number, start_column + index)
        attrs[key] = value

    return attrs


def _read_quoted(input_text: str, quote_index: int, line_number: int, start_column: int) -> tuple[str, int]:
    value = ""
    index = quote_index + 1

    while index < len(input_text):
        char = input_text[index]
        if char == '"':
            return value, index + 1
        if char == "\\":
            if index + 1 >= len(input_text):
                raise LessmarkError("Unterminated escape sequence", line_number, start_column + index)
            next_char = input_text[index + 1]
            if next_char in {'"', "\\"}:
                value += next_char
            elif next_char == "n":
                value += "\n"
            elif next_char == "t":
                value += "\t"
            else:
                raise LessmarkError(f"Unsupported escape \\{next_char}", line_number, start_column + index)
            index += 2
            continue
        value += char
        index += 1

    raise LessmarkError("Unterminated quoted attribute", line_number, start_column + quote_index)


def validate_source(source: str) -> list[dict[str, str]]:
    return validate_ast(parse_lessmark(source))


def validate_ast(ast: dict[str, Any]) -> list[dict[str, str]]:
    errors: list[dict[str, str]] = []
    if not ast or ast.get("type") != "document" or not isinstance(ast.get("children"), list):
        return [{"message": "AST root must be a document with children"}]

    for node in ast["children"]:
        if node.get("type") == "heading":
            _validate_text_safety(node.get("text", ""), errors, "heading")
            continue

        if node.get("type") != "block":
            errors.append({"message": f"Unknown AST node type: {node.get('type')}"})
            continue

        name = node.get("name")
        attrs = node.get("attrs", {})
        _validate_text_safety(node.get("text", ""), errors, f"@{name}")

        if name == "file" and not attrs.get("path"):
            errors.append({"message": "@file requires path"})
        if name == "link" and not attrs.get("href"):
            errors.append({"message": "@link requires href"})
        if name == "task" and attrs.get("status") and attrs["status"] not in TASK_STATUSES:
            errors.append({"message": "@task status must be one of: todo, doing, done, blocked"})
        if name == "decision" and attrs.get("id") and not re.match(r"^[a-z0-9]+(?:-[a-z0-9]+)*$", attrs["id"]):
            errors.append({"message": "@decision id must be a lowercase slug"})

    return errors


def _validate_text_safety(text: str, errors: list[dict[str, str]], location: str) -> None:
    if HTML_TAG_PATTERN.search(text):
        errors.append({"message": f"{location} contains raw HTML/JSX-like syntax"})


def format_lessmark(source: str) -> str:
    return format_ast(parse_lessmark(source))


def format_ast(ast: dict[str, Any]) -> str:
    return "\n\n".join(_format_node(node) for node in ast.get("children", [])) + "\n"


def _format_node(node: dict[str, Any]) -> str:
    if node.get("type") == "heading":
        return f"{'#' * int(node['level'])} {str(node['text']).strip()}"

    if node.get("type") == "block":
        attrs = " ".join(
            f'{key}="{_escape_attr(value)}"' for key, value in sorted(node.get("attrs", {}).items())
        )
        header = f"@{node['name']}" + (f" {attrs}" if attrs else "")
        text = str(node.get("text", "")).strip()
        return f"{header}\n{_strip_trailing_whitespace(text)}" if text else header

    raise ValueError(f"Cannot format unknown AST node type: {node.get('type')}")


def _strip_trailing_whitespace(text: str) -> str:
    return "\n".join(line.rstrip() for line in text.replace("\r\n", "\n").replace("\r", "\n").split("\n"))


def _escape_attr(value: str) -> str:
    return str(value).replace("\\", "\\\\").replace('"', '\\"').replace("\n", "\\n").replace("\t", "\\t")