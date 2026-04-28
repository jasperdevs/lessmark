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
BLOCK_ATTRS = {
    "summary": {"allowed": set(), "required": set()},
    "decision": {"allowed": {"id"}, "required": {"id"}},
    "constraint": {"allowed": set(), "required": set()},
    "task": {"allowed": {"status"}, "required": {"status"}},
    "file": {"allowed": {"path"}, "required": {"path"}},
    "example": {"allowed": set(), "required": set()},
    "note": {"allowed": set(), "required": set()},
    "warning": {"allowed": set(), "required": set()},
    "api": {"allowed": {"name"}, "required": {"name"}},
    "link": {"allowed": {"href"}, "required": {"href"}},
}


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
    match = re.match(r"^(#{1,6}) ([^\s].*)$", line)
    if not match:
        raise LessmarkError("Invalid heading syntax", line_number, 1)
    text = match.group(2).rstrip()
    if re.search(r"\s#+\s*$", text):
        raise LessmarkError("Closing heading markers are not supported", line_number, len(line))
    _assert_safe_text(text, "heading", line_number, line.find(text) + 1)
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
    _validate_block_attrs(name, attrs, start_index + 1)
    body: list[str] = []
    index = start_index + 1

    while index < len(lines):
        line = lines[index]
        if line.strip() == "" or line.startswith("#") or line.startswith("@"):
            break
        _assert_safe_text(line, f"@{name}", index + 1, 1)
        body.append(line.rstrip())
        index += 1

    return {"type": "block", "name": name, "attrs": attrs, "text": "\n".join(body)}, index


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
        _assert_safe_attr_value(key, value, line_number, start_column + index)
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
    if not isinstance(ast, dict) or ast.get("type") != "document" or not isinstance(ast.get("children"), list):
        return [{"message": "AST root must be a document with children"}]
    _validate_exact_keys(ast, {"type", "children"}, errors, "document")

    for node in ast["children"]:
        if not isinstance(node, dict):
            errors.append({"message": "AST child must be an object"})
            continue

        if node.get("type") == "heading":
            _validate_exact_keys(node, {"type", "level", "text"}, errors, "heading")
            if not isinstance(node.get("level"), int) or node["level"] < 1 or node["level"] > 6:
                errors.append({"message": "heading level must be an integer from 1 to 6"})
            if not isinstance(node.get("text"), str) or len(node["text"]) == 0:
                errors.append({"message": "heading text must be a non-empty string"})
                continue
            _validate_text_safety(node.get("text", ""), errors, "heading")
            continue

        if node.get("type") != "block":
            errors.append({"message": f"Unknown AST node type: {node.get('type')}"})
            continue

        name = node.get("name")
        _validate_exact_keys(node, {"type", "name", "attrs", "text"}, errors, f"@{name}")
        if not isinstance(node.get("text"), str):
            errors.append({"message": f"@{name} text must be a string"})
            continue
        _validate_text_safety(node.get("text", ""), errors, f"@{name}")

        _validate_attrs(node, errors)

    return errors


def _validate_text_safety(text: str, errors: list[dict[str, str]], location: str) -> None:
    if HTML_TAG_PATTERN.search(text):
        errors.append({"message": f"{location} contains raw HTML/JSX-like syntax"})


def _validate_block_attrs(name: str, attrs: dict[str, str], line_number: int) -> None:
    spec = BLOCK_ATTRS[name]
    for key in attrs:
        if key not in spec["allowed"]:
            raise LessmarkError(f'@{name} does not allow attribute "{key}"', line_number, 1)
    for key in spec["required"]:
        if not attrs.get(key):
            raise LessmarkError(f"@{name} requires {key}", line_number, 1)
    if name == "task" and attrs["status"] not in TASK_STATUSES:
        raise LessmarkError("@task status must be one of: todo, doing, done, blocked", line_number, 1)
    if name == "decision" and not re.match(r"^[a-z0-9]+(?:-[a-z0-9]+)*$", attrs["id"]):
        raise LessmarkError("@decision id must be a lowercase slug", line_number, 1)


def _assert_safe_text(text: str, location: str, line_number: int, column: int) -> None:
    if HTML_TAG_PATTERN.search(text):
        raise LessmarkError(f"{location} contains raw HTML/JSX-like syntax", line_number, column)


def _assert_safe_attr_value(key: str, value: str, line_number: int, column: int) -> None:
    if re.search(r"[\r\n\t]", value):
        raise LessmarkError(f'Attribute "{key}" cannot contain control whitespace', line_number, column)
    _assert_safe_text(value, f'attribute "{key}"', line_number, column)


def _validate_attrs(node: dict[str, Any], errors: list[dict[str, str]]) -> None:
    name = node.get("name")
    spec = BLOCK_ATTRS.get(name)
    if spec is None:
        errors.append({"message": f'Unknown typed block "{name}"'})
        return

    attrs = node.get("attrs", {})
    if not isinstance(attrs, dict):
        errors.append({"message": f"@{name} attrs must be an object"})
        return
    for key, value in attrs.items():
        if key not in spec["allowed"]:
            errors.append({"message": f'@{name} does not allow attribute "{key}"'})
        if not isinstance(value, str):
            errors.append({"message": f'Attribute "{key}" must be a string'})
            continue
        _validate_text_safety(str(value), errors, f'attribute "{key}"')
        if re.search(r"[\r\n\t]", str(value)):
            errors.append({"message": f'Attribute "{key}" cannot contain control whitespace'})
    for key in spec["required"]:
        if not attrs.get(key):
            errors.append({"message": f"@{name} requires {key}"})
    if name == "task" and attrs.get("status") and attrs["status"] not in TASK_STATUSES:
        errors.append({"message": "@task status must be one of: todo, doing, done, blocked"})
    if name == "decision" and attrs.get("id") and not re.match(r"^[a-z0-9]+(?:-[a-z0-9]+)*$", attrs["id"]):
        errors.append({"message": "@decision id must be a lowercase slug"})


def _validate_exact_keys(value: dict[str, Any], expected: set[str], errors: list[dict[str, str]], location: str) -> None:
    for key in value.keys() - expected:
        errors.append({"message": f'{location} has unknown property "{key}"'})
    for key in expected - value.keys():
        errors.append({"message": f'{location} is missing property "{key}"'})


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
        text = _strip_trailing_whitespace(str(node.get("text", "")))
        return f"{header}\n{_strip_trailing_whitespace(text)}" if text else header

    raise ValueError(f"Cannot format unknown AST node type: {node.get('type')}")


def _strip_trailing_whitespace(text: str) -> str:
    return "\n".join(line.rstrip() for line in text.replace("\r\n", "\n").replace("\r", "\n").split("\n"))


def _escape_attr(value: str) -> str:
    return str(value).replace("\\", "\\\\").replace('"', '\\"').replace("\n", "\\n").replace("\t", "\\t")
