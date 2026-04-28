import re
from dataclasses import dataclass
from typing import Literal, Mapping, TypedDict, Union


class PositionPoint(TypedDict):
    line: int
    column: int


class PositionRange(TypedDict):
    start: PositionPoint
    end: PositionPoint


class HeadingNode(TypedDict, total=False):
    type: Literal["heading"]
    level: int
    text: str
    position: PositionRange


class BlockNode(TypedDict, total=False):
    type: Literal["block"]
    name: str
    attrs: dict[str, str]
    text: str
    position: PositionRange


LessmarkNode = Union[HeadingNode, BlockNode]


class DocumentNode(TypedDict):
    type: Literal["document"]
    children: list[LessmarkNode]


class ValidationMessage(TypedDict):
    message: str


class ValidationError(ValidationMessage, total=False):
    line: int
    column: int


class BlockAttrSpec(TypedDict):
    allowed: set[str]
    required: set[str]

CORE_BLOCKS = {
    "summary",
    "decision",
    "constraint",
    "task",
    "file",
    "code",
    "example",
    "note",
    "warning",
    "api",
    "link",
    "metadata",
    "risk",
    "depends-on",
}

TASK_STATUSES = {"todo", "doing", "done", "blocked"}
RISK_LEVELS = {"low", "medium", "high", "critical"}
HTML_TAG_PATTERN = re.compile(r"</?[A-Za-z][A-Za-z0-9:-]*(?:\s[^>]*)?>")
API_NAME_PATTERN = re.compile(r"^[A-Za-z_][A-Za-z0-9_.-]*$")
CODE_LANG_PATTERN = re.compile(r"^[A-Za-z0-9_.+-]+$")
CONTROL_WHITESPACE_PATTERN = re.compile(r"[\r\n\t]")
DECISION_ID_PATTERN = re.compile(r"^[a-z0-9]+(?:-[a-z0-9]+)*$")
METADATA_KEY_PATTERN = re.compile(r"^[a-z][a-z0-9]*(?:[._-][a-z0-9]+)*$")
BLOCK_ATTRS: dict[str, BlockAttrSpec] = {
    "summary": {"allowed": set(), "required": set()},
    "decision": {"allowed": {"id"}, "required": {"id"}},
    "constraint": {"allowed": set(), "required": set()},
    "task": {"allowed": {"status"}, "required": {"status"}},
    "file": {"allowed": {"path"}, "required": {"path"}},
    "code": {"allowed": {"lang"}, "required": set()},
    "example": {"allowed": set(), "required": set()},
    "note": {"allowed": set(), "required": set()},
    "warning": {"allowed": set(), "required": set()},
    "api": {"allowed": {"name"}, "required": {"name"}},
    "link": {"allowed": {"href"}, "required": {"href"}},
    "metadata": {"allowed": {"key"}, "required": {"key"}},
    "risk": {"allowed": {"level"}, "required": {"level"}},
    "depends-on": {"allowed": {"target"}, "required": {"target"}},
}


@dataclass
class LessmarkError(Exception):
    message: str
    line: int = 1
    column: int = 1

    def __str__(self) -> str:
        return f"{self.message} at {self.line}:{self.column}"


def parse_lessmark(source: str, source_positions: bool = False) -> DocumentNode:
    normalized = str(source).lstrip("\ufeff").replace("\r\n", "\n").replace("\r", "\n")
    lines = normalized.split("\n")
    children: list[LessmarkNode] = []
    index = 0

    while index < len(lines):
        line = lines[index]

        if line.strip() == "":
            index += 1
            continue

        if line.startswith("#"):
            children.append(_parse_heading(line, index + 1, source_positions))
            index += 1
            continue

        if line.startswith("@"):
            node, next_index = _parse_block(lines, index, source_positions)
            children.append(node)
            index = next_index
            continue

        raise LessmarkError("Loose text is not allowed outside a typed block", index + 1, 1)

    return {"type": "document", "children": children}


def _parse_heading(line: str, line_number: int, source_positions: bool) -> HeadingNode:
    match = re.match(r"^(#{1,6}) ([^\s].*)$", line)
    if not match:
        raise LessmarkError("Invalid heading syntax", line_number, 1)
    text = match.group(2).rstrip()
    if re.search(r"\s#+\s*$", text):
        raise LessmarkError("Closing heading markers are not supported", line_number, len(line))
    _assert_safe_text(text, "heading", line_number, line.find(text) + 1)
    node: HeadingNode = {"type": "heading", "level": len(match.group(1)), "text": text}
    if source_positions:
        node["position"] = _position(line_number, 1, line_number, len(line) + 1)
    return node


def _parse_block(lines: list[str], start_index: int, source_positions: bool) -> tuple[BlockNode, int]:
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
    end_line = start_index + 1
    end_column = len(header) + 1

    while index < len(lines):
        line = lines[index]
        if line.strip() == "" or line.startswith("#") or line.startswith("@"):
            break
        _assert_safe_text(line, f"@{name}", index + 1, 1)
        body.append(line.rstrip())
        end_line = index + 1
        end_column = len(line) + 1
        index += 1

    node: BlockNode = {"type": "block", "name": name, "attrs": attrs, "text": "\n".join(body)}
    if source_positions:
        node["position"] = _position(start_index + 1, 1, end_line, end_column)
    return node, index


def _position(start_line: int, start_column: int, end_line: int, end_column: int) -> PositionRange:
    return {
        "start": {"line": start_line, "column": start_column},
        "end": {"line": end_line, "column": end_column},
    }


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


def validate_source(source: str) -> list[ValidationError]:
    try:
        return validate_ast(parse_lessmark(source))
    except LessmarkError as error:
        return [_validation_error(error)]


def validate_ast(ast: object) -> list[ValidationError]:
    errors: list[ValidationError] = []
    if not isinstance(ast, dict) or ast.get("type") != "document" or not isinstance(ast.get("children"), list):
        return [{"message": "AST root must be a document with children"}]
    _validate_exact_keys(ast, {"type", "children"}, errors, "document")

    for node in ast["children"]:
        if not isinstance(node, dict):
            errors.append({"message": "AST child must be an object"})
            continue

        if node.get("type") == "heading":
            _validate_exact_keys(node, {"type", "level", "text"}, errors, "heading", {"position"})
            _validate_position(node.get("position"), errors, "heading")
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
        _validate_exact_keys(node, {"type", "name", "attrs", "text"}, errors, f"@{name}", {"position"})
        _validate_position(node.get("position"), errors, f"@{name}")
        if not isinstance(node.get("text"), str):
            errors.append({"message": f"@{name} text must be a string"})
            continue
        _validate_text_safety(node.get("text", ""), errors, f"@{name}")

        _validate_attrs(node, errors)

    return errors


def _validate_text_safety(text: str, errors: list[ValidationError], location: str) -> None:
    if HTML_TAG_PATTERN.search(text):
        errors.append({"message": f"{location} contains raw HTML/JSX-like syntax"})


def _validate_block_attrs(name: str, attrs: dict[str, str], line_number: int) -> None:
    errors = _get_block_attr_errors(name, attrs)
    if errors:
        raise LessmarkError(errors[0], line_number, 1)


def _assert_safe_text(text: str, location: str, line_number: int, column: int) -> None:
    if HTML_TAG_PATTERN.search(text):
        raise LessmarkError(f"{location} contains raw HTML/JSX-like syntax", line_number, column)


def _assert_safe_attr_value(key: str, value: str, line_number: int, column: int) -> None:
    if CONTROL_WHITESPACE_PATTERN.search(value):
        raise LessmarkError(f'Attribute "{key}" cannot contain control whitespace', line_number, column)
    _assert_safe_text(value, f'attribute "{key}"', line_number, column)


def _validate_attrs(node: Mapping[str, object], errors: list[ValidationError]) -> None:
    name = node.get("name")
    spec = BLOCK_ATTRS.get(name) if isinstance(name, str) else None
    if spec is None:
        errors.append({"message": f'Unknown typed block "{name}"'})
        return

    attrs = node.get("attrs", {})
    if not isinstance(attrs, dict):
        errors.append({"message": f"@{name} attrs must be an object"})
        return
    for key, value in attrs.items():
        if not isinstance(value, str):
            errors.append({"message": f'Attribute "{key}" must be a string'})
            continue
        _validate_text_safety(str(value), errors, f'attribute "{key}"')
        if CONTROL_WHITESPACE_PATTERN.search(str(value)):
            errors.append({"message": f'Attribute "{key}" cannot contain control whitespace'})
    for message in _get_block_attr_errors(name, attrs):
        errors.append({"message": message})


def _get_block_attr_errors(name: str, attrs: Mapping[str, object]) -> list[str]:
    spec = BLOCK_ATTRS.get(name)
    if spec is None:
        return [f'Unknown typed block "{name}"']

    errors: list[str] = []
    for key in attrs:
        if key not in spec["allowed"]:
            errors.append(f'@{name} does not allow attribute "{key}"')
    for key in spec["required"]:
        if key not in attrs or attrs.get(key) == "":
            errors.append(f"@{name} requires {key}")

    semantic_error = _get_semantic_attr_error(name, attrs)
    if semantic_error is not None:
        errors.append(semantic_error)
    return errors


def _get_semantic_attr_error(name: str, attrs: Mapping[str, object]) -> str | None:
    if name == "task" and isinstance(attrs.get("status"), str) and attrs["status"] not in TASK_STATUSES:
        return "@task status must be one of: todo, doing, done, blocked"
    if name == "decision" and isinstance(attrs.get("id"), str) and not DECISION_ID_PATTERN.match(attrs["id"]):
        return "@decision id must be a lowercase slug"
    if name == "file" and isinstance(attrs.get("path"), str) and not _is_relative_project_path(attrs["path"]):
        return "@file path must be a relative project path"
    if name == "api" and isinstance(attrs.get("name"), str) and not API_NAME_PATTERN.match(attrs["name"]):
        return "@api name must be an identifier"
    if name == "link" and isinstance(attrs.get("href"), str) and not _is_safe_href(attrs["href"]):
        return "@link href must not use an executable URL scheme"
    if name == "code" and isinstance(attrs.get("lang"), str) and not CODE_LANG_PATTERN.match(attrs["lang"]):
        return "@code lang must be a compact language identifier"
    if name == "metadata" and isinstance(attrs.get("key"), str) and not METADATA_KEY_PATTERN.match(attrs["key"]):
        return "@metadata key must be a lowercase dotted key"
    if name == "risk" and isinstance(attrs.get("level"), str) and attrs["level"] not in RISK_LEVELS:
        return "@risk level must be one of: low, medium, high, critical"
    if name == "depends-on" and isinstance(attrs.get("target"), str) and not DECISION_ID_PATTERN.match(attrs["target"]):
        return "@depends-on target must be a lowercase slug"
    return None


def _validate_exact_keys(
    value: Mapping[str, object],
    expected: set[str],
    errors: list[ValidationError],
    location: str,
    optional: set[str] | None = None,
) -> None:
    allowed = expected | (optional or set())
    for key in value.keys() - allowed:
        errors.append({"message": f'{location} has unknown property "{key}"'})
    for key in expected - value.keys():
        errors.append({"message": f'{location} is missing property "{key}"'})


def _validate_position(value: object, errors: list[ValidationError], location: str) -> None:
    if value is None:
        return
    if not (
        isinstance(value, dict)
        and _is_position_point(value.get("start"))
        and _is_position_point(value.get("end"))
    ):
        errors.append({"message": f"{location} position must have start/end line and column numbers"})


def _is_position_point(value: object) -> bool:
    return (
        isinstance(value, dict)
        and isinstance(value.get("line"), int)
        and value["line"] > 0
        and isinstance(value.get("column"), int)
        and value["column"] > 0
    )


def _validation_error(error: LessmarkError) -> ValidationError:
    return {"message": error.message, "line": error.line, "column": error.column}


def _is_relative_project_path(path: str) -> bool:
    parts = re.split(r"[\\/]+", path)
    return (
        len(path) > 0
        and not path.startswith(("/", "\\"))
        and not re.match(r"^[A-Za-z]:[\\/]", path)
        and not re.match(r"^[A-Za-z][A-Za-z0-9+.-]*:", path)
        and ".." not in parts
    )


def _is_safe_href(href: str) -> bool:
    match = re.match(r"^([A-Za-z][A-Za-z0-9+.-]*):", href)
    return match is None or match.group(1).lower() in {"http", "https", "mailto"}


def format_lessmark(source: str) -> str:
    return format_ast(parse_lessmark(source))


def format_ast(ast: DocumentNode) -> str:
    errors = validate_ast(ast)
    if errors:
        messages = "; ".join(error["message"] for error in errors)
        raise ValueError(f"Cannot format invalid AST: {messages}")
    return "\n\n".join(_format_node(node) for node in ast.get("children", [])) + "\n"


def _format_node(node: LessmarkNode) -> str:
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
