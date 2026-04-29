import re
from dataclasses import dataclass
from typing import Callable, Literal, Mapping, TypedDict, Union


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
    code: str
    message: str


class ValidationError(ValidationMessage, total=False):
    line: int
    column: int


class BlockAttrSpec(TypedDict):
    allowed: set[str]
    required: set[str]

CORE_BLOCKS = {
    "summary",
    "page",
    "nav",
    "paragraph",
    "decision",
    "constraint",
    "task",
    "file",
    "code",
    "example",
    "quote",
    "callout",
    "list",
    "table",
    "image",
    "math",
    "diagram",
    "separator",
    "toc",
    "footnote",
    "definition",
    "reference",
    "api",
    "link",
    "metadata",
    "risk",
    "depends-on",
}

CORE_BLOCK_NAMES = [
    "summary",
    "page",
    "nav",
    "paragraph",
    "decision",
    "constraint",
    "task",
    "file",
    "code",
    "example",
    "quote",
    "callout",
    "list",
    "table",
    "image",
    "math",
    "diagram",
    "separator",
    "toc",
    "footnote",
    "definition",
    "reference",
    "api",
    "link",
    "metadata",
    "risk",
    "depends-on",
]

INLINE_FUNCTIONS = [
    "strong",
    "em",
    "code",
    "kbd",
    "del",
    "mark",
    "sup",
    "sub",
    "ref",
    "footnote",
    "link",
]
MAX_INLINE_MARKDOWN_PASSES = 128
MAX_INLINE_DEPTH = 128
MAX_LIST_DEPTH = 128

TASK_STATUSES = {"todo", "doing", "done", "blocked"}
RISK_LEVELS = {"low", "medium", "high", "critical"}
LIST_KINDS = {"unordered", "ordered"}
CALLOUT_KINDS = {"note", "tip", "warning", "caution"}
MATH_NOTATIONS = {"tex", "asciimath"}
DIAGRAM_KINDS = {"mermaid", "graphviz", "plantuml"}
HTML_TAG_PATTERN = re.compile(r"<!--|<!doctype\b|<!\[CDATA\[|<\?|</?[A-Za-z][A-Za-z0-9:-]*(?:\s[^>]*)?>", re.I)
API_NAME_PATTERN = re.compile(r"^[A-Za-z_][A-Za-z0-9_.-]*$")
CODE_LANG_PATTERN = re.compile(r"^[A-Za-z0-9_.+-]+$")
CONTROL_WHITESPACE_PATTERN = re.compile(r"[\r\n\t]")
MARKDOWN_REFERENCE_DEFINITION_PATTERN = re.compile(r"^\s{0,3}\[[^\]\n]+\]:\s+\S")
MARKDOWN_THEMATIC_BREAK_PATTERN = re.compile(r"^(?:(?: {0,3})(?:[-*_]\s*){3,}|(?: {0,3})=+\s*)$")
MARKDOWN_BLOCKQUOTE_PATTERN = re.compile(r"^\s{0,3}>\s?")
MARKDOWN_LIST_MARKER_PATTERN = re.compile(r"^\s{0,3}(?:[-+*]\s+|\d+[.)]\s+)")
DECISION_ID_PATTERN = re.compile(r"^[a-z0-9]+(?:-[a-z0-9]+)*$")
METADATA_KEY_PATTERN = re.compile(r"^[a-z][a-z0-9]*(?:[._-][a-z0-9]+)*$")
DEFINITION_TERM_PATTERN = re.compile(r"^(?=.*\S)[^\r\n\t<>]+$")
BLOCK_ATTRS: dict[str, BlockAttrSpec] = {
    "summary": {"allowed": set(), "required": set()},
    "page": {"allowed": {"title", "output"}, "required": set()},
    "nav": {"allowed": {"label", "href", "slot"}, "required": {"label", "href"}},
    "paragraph": {"allowed": set(), "required": set()},
    "decision": {"allowed": {"id"}, "required": {"id"}},
    "constraint": {"allowed": set(), "required": set()},
    "task": {"allowed": {"status"}, "required": {"status"}},
    "file": {"allowed": {"path"}, "required": {"path"}},
    "code": {"allowed": {"lang"}, "required": set()},
    "example": {"allowed": set(), "required": set()},
    "quote": {"allowed": {"cite"}, "required": set()},
    "callout": {"allowed": {"kind", "title"}, "required": {"kind"}},
    "list": {"allowed": {"kind"}, "required": {"kind"}},
    "table": {"allowed": {"columns"}, "required": {"columns"}},
    "image": {"allowed": {"src", "alt", "caption"}, "required": {"src", "alt"}},
    "math": {"allowed": {"notation"}, "required": {"notation"}},
    "diagram": {"allowed": {"kind"}, "required": {"kind"}},
    "separator": {"allowed": set(), "required": set()},
    "toc": {"allowed": set(), "required": set()},
    "footnote": {"allowed": {"id"}, "required": {"id"}},
    "definition": {"allowed": {"term"}, "required": {"term"}},
    "reference": {"allowed": {"target", "label"}, "required": {"target"}},
    "api": {"allowed": {"name"}, "required": {"name"}},
    "link": {"allowed": {"href"}, "required": {"href"}},
    "metadata": {"allowed": {"key"}, "required": {"key"}},
    "risk": {"allowed": {"level"}, "required": {"level"}},
    "depends-on": {"allowed": {"target"}, "required": {"target"}},
}

BLOCK_ALIASES = {}

SHORTHAND_ATTRS = {
    "api": "name",
    "callout": "kind",
    "code": "lang",
    "diagram": "kind",
    "decision": "id",
    "definition": "term",
    "depends-on": "target",
    "file": "path",
    "footnote": "id",
    "link": "href",
    "list": "kind",
    "math": "notation",
    "metadata": "key",
    "reference": "target",
    "risk": "level",
    "table": "columns",
    "task": "status",
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

        node, next_index = _parse_plain_paragraph(lines, index, source_positions)
        children.append(node)
        index = next_index

    anchor_errors = _get_local_anchor_errors(children)
    if anchor_errors:
        raise LessmarkError(anchor_errors[0], 1, 1)
    return {"type": "document", "children": children}


def _parse_plain_paragraph(lines: list[str], start_index: int, source_positions: bool) -> tuple[BlockNode, int]:
    body: list[str] = []
    index = start_index
    end_line = start_index + 1
    end_column = 1

    while index < len(lines):
        line = lines[index]
        if line.strip() == "" or _starts_block_syntax(line):
            break
        text_line = _decode_leading_block_escape(line)
        _assert_safe_text(text_line, "paragraph", index + 1, 1)
        legacy_error = _legacy_markdown_line_error(text_line)
        if legacy_error is not None:
            raise LessmarkError(legacy_error, index + 1, 1)
        body.append(text_line.rstrip())
        end_line = index + 1
        end_column = len(line) + 1
        index += 1

    node: BlockNode = {
        "type": "block",
        "name": "paragraph",
        "attrs": {},
        "text": _canonicalize_inline_syntax("\n".join(body)),
    }
    _validate_block_body(node, start_index + 1)
    if source_positions:
        node["position"] = _position(start_index + 1, 1, end_line, end_column)
    return node, index


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

    normalized_name, normalized_attrs, normalized_rest = _normalize_block_header(match.group(1), match.group(2), start_index + 1)
    name = normalized_name
    if name == "paragraph":
        raise LessmarkError("Plain prose is the only paragraph source syntax; escape leading @ or # with a backslash", start_index + 1, 1)
    if name not in CORE_BLOCKS:
        raise LessmarkError(f'Unknown typed block "{name}"', start_index + 1, 2)

    attrs = {**normalized_attrs, **_parse_attrs(normalized_rest, start_index + 1, len(name) + 2)}
    _validate_block_attrs(name, attrs, start_index + 1)
    body: list[str] = []
    index = start_index + 1
    end_line = start_index + 1
    end_column = len(header) + 1

    if _is_bodyless_block(name):
        node: BlockNode = {"type": "block", "name": name, "attrs": attrs, "text": ""}
        _validate_block_body(node, start_index + 1)
        if source_positions:
            node["position"] = _position(start_index + 1, 1, end_line, end_column)
        return node, index

    while index < len(lines):
        line = lines[index]
        if len(body) == 0 and line.strip() == "" and not _is_literal_block(name):
            index += 1
            continue
        if _is_block_terminator(lines, index, name):
            break
        text_line = line if _is_literal_block(name) else _decode_leading_block_escape(line)
        _assert_safe_text(text_line, f"@{name}", index + 1, 1, allow_expressions=_is_literal_block(name))
        if not _is_literal_block(name) and name != "list":
            legacy_error = _legacy_markdown_line_error(text_line)
            if legacy_error is not None:
                raise LessmarkError(legacy_error, index + 1, 1)
        body.append(text_line.rstrip())
        end_line = index + 1
        end_column = len(line) + 1
        index += 1

    text = "\n".join(body)
    node: BlockNode = {
        "type": "block",
        "name": name,
        "attrs": attrs,
        "text": text if _is_literal_block(name) else _canonicalize_inline_syntax(text),
    }
    _validate_block_body(node, start_index + 1)
    if source_positions:
        node["position"] = _position(start_index + 1, 1, end_line, end_column)
    return node, index


def _normalize_block_header(raw_name: str, raw_rest: str, line_number: int) -> tuple[str, dict[str, str], str]:
    alias = BLOCK_ALIASES.get(raw_name)
    if alias is not None and raw_rest.strip():
        raise LessmarkError(f"@{raw_name} does not accept attributes", line_number, 1)
    name = str(alias["name"]) if alias is not None else raw_name
    attrs = dict(alias["attrs"]) if alias is not None else {}
    rest = raw_rest
    shorthand_attr = SHORTHAND_ATTRS.get(name)
    shorthand_value = raw_rest.strip()
    if shorthand_attr is not None and shorthand_value and re.search(r"[=\s]", shorthand_value) is None:
        attrs[shorthand_attr] = shorthand_value
        rest = ""
    return name, attrs, rest


def _is_block_terminator(lines: list[str], index: int, name: str) -> bool:
    line = lines[index]
    if not _is_literal_block(name) and _starts_block_syntax(line):
        return True
    if line.strip() != "":
        return False
    if not _is_literal_block(name):
        return True

    next_index = index + 1
    while next_index < len(lines) and lines[next_index].strip() == "":
        next_index += 1
    return next_index >= len(lines) or _starts_block_syntax(lines[next_index])


def _is_literal_block(name: str) -> bool:
    return name in {"code", "example", "math", "diagram"}


def _is_bodyless_block(name: str) -> bool:
    return name in {"image", "nav", "page", "separator", "toc"}


def _starts_block_syntax(line: str) -> bool:
    return line.startswith("#") or line.startswith("@")


def _decode_leading_block_escape(line: str) -> str:
    if line.startswith("\\@") or line.startswith("\\#"):
        return line[1:]
    return line


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

        quote_index = index
        value, index = _read_quoted(input_text, index, line_number, start_column)
        if key in attrs:
            raise LessmarkError(f'Duplicate attribute "{key}"', line_number, start_column + quote_index)
        _assert_safe_attr_value(key, value, line_number, start_column + quote_index)
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
            elif next_char == "|":
                value += "\\|"
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
        return [_validation_message("AST root must be a document with children")]
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
            _validate_inline_text(node.get("text", ""), errors, "heading")
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
        _validate_text_safety(
            node.get("text", ""),
            errors,
            f"@{name}",
            allow_expressions=_is_literal_block(str(name)),
        )
        if not _is_literal_block(str(name)):
            _validate_inline_text(node.get("text", ""), errors, f"@{name}")
        _validate_block_body_ast(node, errors)

        _validate_attrs(node, errors)

    errors.extend({"message": message} for message in _get_local_anchor_errors(ast["children"]))
    return [_with_error_code(error) for error in errors]


def _validate_text_safety(
    text: str,
    errors: list[ValidationError],
    location: str,
    *,
    allow_expressions: bool = False,
) -> None:
    if HTML_TAG_PATTERN.search(text):
        errors.append({"message": f"{location} contains raw HTML/JSX-like syntax"})
    if not allow_expressions and _contains_raw_expression(text):
        errors.append({"message": f"{location} contains raw expression-like syntax"})


def _legacy_markdown_line_error(line: str) -> str | None:
    if MARKDOWN_REFERENCE_DEFINITION_PATTERN.search(line):
        return "Markdown reference definitions are not supported; use @reference or {{ref:label|target}}"
    if MARKDOWN_THEMATIC_BREAK_PATTERN.search(line):
        return "Markdown thematic breaks and setext underlines are not supported; use @separator or # headings"
    if MARKDOWN_BLOCKQUOTE_PATTERN.search(line):
        return "Markdown blockquote markers are not supported in Lessmark source; use @quote or @callout"
    if MARKDOWN_LIST_MARKER_PATTERN.search(line):
        return "Markdown list markers are not supported in Lessmark prose; use @list"
    return None


def _validate_inline_text(
    text: str,
    errors: list[ValidationError],
    location: str,
    depth: int = 0,
) -> None:
    if depth > MAX_INLINE_DEPTH:
        errors.append({"message": f"{location} inline nesting too deep"})
        return
    source = str(text)
    index = 0
    while index < len(source):
        start = source.find("{{", index)
        if start == -1:
            return
        end = _find_inline_function_end(source, start)
        if end == -1:
            errors.append({"message": f"{location} has an unclosed inline function"})
            return
        _validate_inline_function(source[start + 2 : end], errors, location, depth + 1)
        index = end + 2


def _validate_inline_function(source: str, errors: list[ValidationError], location: str, depth: int) -> None:
    separator = source.find(":")
    if separator <= 0:
        errors.append({"message": f"{location} inline functions must use {{{{name:value}}}}"})
        return
    name = source[:separator].strip()
    value = source[separator + 1 :]
    if name in {"strong", "em", "del", "mark"}:
        _validate_inline_text(value, errors, location, depth)
        return
    if name in {"code", "kbd", "sup", "sub"}:
        return
    if name == "ref":
        label, target = _split_once(value, "|")
        _validate_inline_text(label, errors, location, depth)
        if not DECISION_ID_PATTERN.match(target):
            errors.append({"message": "Inline ref target must be a lowercase slug"})
        return
    if name == "footnote":
        if not DECISION_ID_PATTERN.match(value):
            errors.append({"message": "Inline footnote target must be a lowercase slug"})
        return
    if name == "link":
        label, href = _split_once(value, "|")
        _validate_inline_text(label, errors, location, depth)
        if not _is_safe_href(href):
            errors.append({"message": "Inline link href must not use an executable URL scheme"})
        return
    errors.append({"message": f'Unknown inline function "{name}"'})


def _split_once(value: str, delimiter: str) -> tuple[str, str]:
    index = value.find(delimiter)
    if index == -1:
        return value, ""
    return value[:index].strip(), value[index + len(delimiter) :].strip()


def _validate_block_attrs(name: str, attrs: dict[str, str], line_number: int) -> None:
    errors = _get_block_attr_errors(name, attrs)
    if errors:
        raise LessmarkError(errors[0], line_number, 1)


def _validate_block_body(node: BlockNode, line_number: int) -> None:
    errors = _get_block_body_errors(node.get("name"), node.get("attrs", {}), str(node.get("text", "")))
    if errors:
        raise LessmarkError(errors[0], line_number, 1)


def _validate_block_body_ast(node: Mapping[str, object], errors: list[ValidationError]) -> None:
    for message in _get_block_body_errors(node.get("name"), node.get("attrs", {}), str(node.get("text", ""))):
        errors.append({"message": message})


def _assert_safe_text(
    text: str,
    location: str,
    line_number: int,
    column: int,
    *,
    allow_expressions: bool = False,
) -> None:
    if HTML_TAG_PATTERN.search(text):
        raise LessmarkError(f"{location} contains raw HTML/JSX-like syntax", line_number, column)
    if not allow_expressions and _contains_raw_expression(text):
        raise LessmarkError(f"{location} contains raw expression-like syntax", line_number, column)


def _contains_raw_expression(text: str) -> bool:
    source = str(text)
    for index, current in enumerate(source):
        previous = source[index - 1] if index > 0 else ""
        next_char = source[index + 1] if index + 1 < len(source) else ""
        if current == "$" and next_char == "{":
            return True
        if current == "{" and previous != "{" and next_char != "{":
            return True
        if current == "}" and previous != "}" and next_char != "}":
            return True
    return False


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
        if key in {"label", "cite", "title", "caption", "term"}:
            _validate_inline_text(str(value), errors, f'attribute "{key}"')
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
        return "@link href must be http, https, mailto, or a safe relative path"
    if name == "code" and isinstance(attrs.get("lang"), str) and not CODE_LANG_PATTERN.match(attrs["lang"]):
        return "@code lang must be a compact language identifier"
    if name == "metadata" and isinstance(attrs.get("key"), str) and not METADATA_KEY_PATTERN.match(attrs["key"]):
        return "@metadata key must be a lowercase dotted key"
    if name == "risk" and isinstance(attrs.get("level"), str) and attrs["level"] not in RISK_LEVELS:
        return "@risk level must be one of: low, medium, high, critical"
    if name == "callout" and isinstance(attrs.get("kind"), str) and attrs["kind"] not in CALLOUT_KINDS:
        return "@callout kind must be one of: note, tip, warning, caution"
    if name == "list" and isinstance(attrs.get("kind"), str) and attrs["kind"] not in LIST_KINDS:
        return "@list kind must be one of: unordered, ordered"
    if name == "table" and isinstance(attrs.get("columns"), str) and not _is_valid_table_columns(attrs["columns"]):
        return "@table columns must be pipe-separated non-empty labels"
    if name == "image" and isinstance(attrs.get("src"), str) and not _is_safe_resource(attrs["src"]):
        return "@image src must be a safe relative, http, or https URL"
    if name == "math" and isinstance(attrs.get("notation"), str) and attrs["notation"] not in MATH_NOTATIONS:
        return "@math notation must be one of: tex, asciimath"
    if name == "diagram" and isinstance(attrs.get("kind"), str) and attrs["kind"] not in DIAGRAM_KINDS:
        return "@diagram kind must be one of: mermaid, graphviz, plantuml"
    if name == "nav" and isinstance(attrs.get("label"), str) and not DEFINITION_TERM_PATTERN.match(attrs["label"]):
        return "@nav label must be plain single-line text"
    if name == "nav" and isinstance(attrs.get("href"), str) and not _is_safe_href(attrs["href"]):
        return "@nav href must be http, https, mailto, or a safe relative path"
    if name == "nav" and isinstance(attrs.get("slot"), str) and attrs["slot"] not in {"primary", "footer"}:
        return "@nav slot must be primary or footer"
    if name == "footnote" and isinstance(attrs.get("id"), str) and not DECISION_ID_PATTERN.match(attrs["id"]):
        return "@footnote id must be a lowercase slug"
    if name == "definition" and isinstance(attrs.get("term"), str) and not DEFINITION_TERM_PATTERN.match(attrs["term"]):
        return "@definition term must be plain single-line text"
    if name == "reference" and isinstance(attrs.get("target"), str) and not DECISION_ID_PATTERN.match(attrs["target"]):
        return "@reference target must be a lowercase slug"
    if name == "page" and isinstance(attrs.get("output"), str) and not _is_safe_page_output(attrs["output"]):
        return "@page output must be a safe relative .html path"
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
    result = _validation_message(error.message)
    result["line"] = error.line
    result["column"] = error.column
    return result


def _validation_message(message: str) -> ValidationError:
    return {"code": error_code_for_message(message), "message": message}


def _with_error_code(error: ValidationError) -> ValidationError:
    if "code" not in error:
        error = {"code": error_code_for_message(error["message"]), **error}
    return error


def error_code_for_message(message: str) -> str:
    if "paragraph source syntax" in message:
        return "unsupported_source_syntax"
    if "Unknown typed block" in message:
        return "unknown_block"
    if "does not allow attribute" in message:
        return "unknown_attribute"
    if " requires " in message:
        return "missing_required_attribute"
    if "Duplicate attribute" in message:
        return "duplicate_attribute"
    if "raw HTML/JSX-like" in message:
        return "raw_html"
    if "raw expression-like" in message:
        return "raw_expression"
    if "inline nesting too deep" in message:
        return "inline_nesting_too_deep"
    if (
        "Markdown reference definitions" in message
        or "Markdown thematic breaks" in message
        or "Markdown blockquote markers" in message
        or "Markdown list markers" in message
    ):
        return "markdown_legacy_syntax"
    if "Loose text" in message:
        return "loose_text"
    if "Invalid heading" in message:
        return "invalid_heading"
    if "Closing heading markers" in message:
        return "closing_heading_marker"
    if "Invalid typed block header" in message:
        return "invalid_block_header"
    if "Invalid attribute name" in message:
        return "invalid_attribute_name"
    if "Expected =" in message:
        return "expected_attribute_equals"
    if "double-quoted" in message:
        return "unquoted_attribute"
    if "Unsupported escape" in message:
        return "unsupported_escape"
    if "Unterminated" in message or "unclosed inline function" in message:
        return "unterminated_syntax"
    if "Unknown inline function" in message:
        return "unknown_inline_function"
    if "inline functions must use" in message:
        return "invalid_inline_function"
    if "control whitespace" in message:
        return "control_whitespace"
    if "safe relative" in message or "executable URL" in message:
        return "unsafe_link_or_path"
    if "lowercase slug" in message:
        return "invalid_slug"
    if "Unknown local reference target" in message:
        return "unknown_reference_target"
    if "Unknown inline local target" in message:
        return "unknown_inline_target"
    if "Duplicate local anchor" in message:
        return "duplicate_local_anchor"
    if "@list" in message:
        return "invalid_list_body"
    if "@table" in message:
        return "invalid_table_body"
    if "position" in message:
        return "invalid_position"
    if "AST root" in message:
        return "invalid_ast_root"
    if "unknown property" in message or "missing property" in message:
        return "invalid_ast_shape"
    if "must be a string" in message:
        return "invalid_ast_value"
    return "validation_error"


def get_capabilities() -> dict[str, object]:
    return {
        "language": "lessmark",
        "version": "0.1.5",
        "astVersion": "v0",
        "extensions": [".lmk", ".lessmark"],
        "mediaType": "text/vnd.lessmark; charset=utf-8",
        "blocks": CORE_BLOCK_NAMES,
        "inlineFunctions": INLINE_FUNCTIONS,
        "enums": {
            "taskStatus": ["todo", "doing", "done", "blocked"],
            "riskLevel": ["low", "medium", "high", "critical"],
            "listKind": ["unordered", "ordered"],
            "calloutKind": ["note", "tip", "warning", "caution"],
            "mathNotation": ["tex", "asciimath"],
            "diagramKind": ["mermaid", "graphviz", "plantuml"],
        },
        "cli": {
            "commands": ["parse", "check", "format", "fix", "from-markdown", "to-markdown", "info"],
            "jsonCommands": ["check --json", "format --check --json", "info --json"],
            "formatCheck": True,
            "stdin": True,
            "recursiveCheck": True,
            "recursiveFormat": True,
            "strictBuild": False,
        },
        "renderer": {
            "html": False,
            "fullDocument": False,
            "staticSiteBuild": False,
            "strictLinkAssetCheck": False,
            "rawHtml": False,
        },
        "syntaxPolicy": {
            "aliases": False,
            "plainParagraphs": True,
            "canonicalSource": True,
            "documentedConveniencesOnly": True,
            "maxSpellingsPerMeaning": 2,
            "blockAliases": {},
            "aliasAttrs": {},
            "shorthandAttrs": {
                "api": "name",
                "callout": "kind",
                "code": "lang",
                "diagram": "kind",
                "decision": "id",
                "definition": "term",
                "depends-on": "target",
                "file": "path",
                "footnote": "id",
                "link": "href",
                "list": "kind",
                "math": "notation",
                "metadata": "key",
                "reference": "target",
                "risk": "level",
                "table": "columns",
                "task": "status",
            },
            "literalBlocks": ["code", "example", "math", "diagram"],
            "literalBlockTermination": "blank-line-before-next-block",
            "markdownLegacySyntax": False,
            "rawHtml": False,
            "hooks": False,
            "customBlocks": False,
            "nestedLists": True,
        },
    }


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
    if match:
        return match.group(1).lower() in {"http", "https", "mailto"}
    if href.startswith("//"):
        return False
    if href.startswith("/"):
        return ".." not in re.split(r"[\\/]+", href)
    return _is_relative_project_path(href)


def _is_safe_resource(src: str) -> bool:
    match = re.match(r"^([A-Za-z][A-Za-z0-9+.-]*):", src)
    if match:
        return match.group(1).lower() in {"http", "https"}
    return _is_relative_project_path(src)


def _is_valid_table_columns(columns: str) -> bool:
    labels = _split_table_row(columns)
    return len(labels) >= 1 and all(labels)


def _get_block_body_errors(name: object, attrs: object, text: str) -> list[str]:
    if name in {"image", "nav", "page", "separator", "toc"} and text.strip():
        return [f"@{name} must not have a body"]
    if name == "list":
        return _get_list_body_errors(text)
    if name == "table":
        columns = str(attrs.get("columns", "")) if isinstance(attrs, Mapping) else ""
        return _get_table_body_errors(columns, text)
    if name not in {"code", "example", "math", "diagram"}:
        for line in text.splitlines():
            legacy_error = _legacy_markdown_line_error(line)
            if legacy_error is not None:
                return [legacy_error]
    return []


def _get_list_body_errors(text: str) -> list[str]:
    previous_level = 0
    seen_item = False
    for line in (row for row in text.splitlines() if row.strip()):
        match = re.match(r"^( *)- (.*)$", line)
        if match is None:
            return ["@list items must use one explicit '- ' item marker per line"]
        if len(match.group(1)) % 2 != 0:
            return ["@list nesting must use two spaces per level"]
        if not match.group(2).strip():
            return ["@list items cannot be empty"]
        level = len(match.group(1)) // 2
        if not seen_item and level != 0:
            return ["@list must start at the top level"]
        if level > previous_level + 1:
            return ["@list nesting cannot skip levels"]
        if level > MAX_LIST_DEPTH:
            return ["@list nesting is too deep"]
        if "\t" in line:
            return ["@list items must use one explicit '- ' item marker per line"]
        previous_level = level
        seen_item = True
    return []


def _get_table_body_errors(columns: str, text: str) -> list[str]:
    column_count = len(_split_table_row(columns))
    for line in (row for row in text.splitlines() if row.strip()):
        cells = _split_table_row(line)
        if len(cells) != column_count:
            return ["@table row cell count must match columns"]
    return []


def _split_table_row(value: str) -> list[str]:
    cells: list[str] = []
    cell = ""
    escaping = False
    for char in str(value):
        if escaping:
            if char not in {"|", "\\"}:
                cell += "\\"
            cell += char
            escaping = False
            continue
        if char == "\\":
            escaping = True
            continue
        if char == "|":
            cells.append(cell.strip())
            cell = ""
            continue
        cell += char
    if escaping:
        cell += "\\"
    cells.append(cell.strip())
    return cells


def _is_safe_page_output(output: str) -> bool:
    return _is_relative_project_path(output) and output.endswith(".html")


def _get_local_anchor_errors(children: list[object]) -> list[str]:
    errors: list[str] = []
    seen: set[str] = set()
    targets: set[str] = set()
    heading_counts: dict[str, int] = {}
    for node in children:
        if not isinstance(node, dict):
            continue
        slugs: list[str] = []
        if node.get("type") == "heading":
            base = _slugify_local_anchor(str(node.get("text", "")))
            heading_counts[base] = heading_counts.get(base, 0) + 1
            slugs = [base if heading_counts[base] == 1 else f"{base}-{heading_counts[base]}"]
        elif node.get("type") == "block" and node.get("name") == "decision":
            slugs = [str(node.get("attrs", {}).get("id", ""))]
        elif node.get("type") == "block" and node.get("name") == "footnote":
            footnote_id = str(node.get("attrs", {}).get("id", ""))
            slugs = [footnote_id, f"fn-{footnote_id}" if footnote_id else ""]
        for slug in slugs:
            if not slug:
                continue
            if slug in seen:
                errors.append(f'Duplicate local anchor slug "{slug}"')
            else:
                seen.add(slug)
                targets.add(slug)
    for node in children:
        if not isinstance(node, dict):
            continue
        if node.get("type") != "block" or node.get("name") != "reference":
            continue
        target = str(node.get("attrs", {}).get("target", ""))
        footnote_target = f"fn-{target}" if target else ""
        if target and target not in targets and footnote_target not in targets:
            errors.append(f'Unknown local reference target "{target}"')
    for target in _collect_inline_local_targets(children):
        footnote_target = f"fn-{target}" if target else ""
        if target and DECISION_ID_PATTERN.match(target) and target not in targets and footnote_target not in targets:
            errors.append(f'Unknown inline local target "{target}"')
    return errors


def _collect_inline_local_targets(children: list[object]) -> list[str]:
    targets: list[str] = []
    for node in children:
        if not isinstance(node, dict):
            continue
        if node.get("type") == "heading":
            targets.extend(_inline_targets_from_text(str(node.get("text", ""))))
        elif node.get("type") == "block" and node.get("name") not in {"code", "example", "math", "diagram"}:
            targets.extend(_inline_targets_from_text(str(node.get("text", ""))))
            attrs = node.get("attrs", {})
            if isinstance(attrs, Mapping):
                for key in ["label", "cite", "title", "caption", "term"]:
                    value = attrs.get(key)
                    if isinstance(value, str):
                        targets.extend(_inline_targets_from_text(value))
    return targets


def _inline_targets_from_text(text: str, depth: int = 0) -> list[str]:
    if depth > MAX_INLINE_DEPTH:
        return []
    targets: list[str] = []
    index = 0
    while index < len(text):
        start = text.find("{{", index)
        if start == -1:
            break
        end = _find_inline_function_end(text, start)
        if end == -1:
            break
        inner = text[start + 2 : end]
        separator = inner.find(":")
        if separator > 0:
            name = inner[:separator].strip()
            value = inner[separator + 1 :]
            if name == "ref":
                delimiter = value.find("|")
                if delimiter != -1:
                    targets.append(value[delimiter + 1 :].strip())
                    targets.extend(_inline_targets_from_text(value[:delimiter], depth + 1))
            elif name == "footnote":
                targets.append(value.strip())
            elif name in {"strong", "em", "del", "mark", "link"}:
                label = value.split("|", 1)[0] if name == "link" else value
                targets.extend(_inline_targets_from_text(label, depth + 1))
        index = end + 2
    return targets


def _find_inline_function_end(source: str, start: int) -> int:
    depth = 1
    index = start + 2
    while index < len(source):
        if source.startswith("{{", index):
            depth += 1
            index += 2
            continue
        if source.startswith("}}", index):
            depth -= 1
            if depth == 0:
                return index
            index += 2
            continue
        index += 1
    return -1


def _slugify_local_anchor(text: str) -> str:
    slug = re.sub(r"[^a-z0-9]+", "-", text.lower()).strip("-")
    return slug or "section"


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
        if node.get("name") == "paragraph" and not node.get("attrs", {}):
            return _escape_leading_block_sigils(_strip_trailing_whitespace(str(node.get("text", ""))))
        attrs = " ".join(
            f'{key}="{_escape_attr(value)}"' for key, value in sorted(node.get("attrs", {}).items())
        )
        header = f"@{node['name']}" + (f" {attrs}" if attrs else "")
        text = _strip_trailing_whitespace(str(node.get("text", "")))
        body = text if _is_literal_block(str(node.get("name", ""))) else _escape_leading_block_sigils(text)
        return f"{header}\n{body}" if body else header

    raise ValueError(f"Cannot format unknown AST node type: {node.get('type')}")


def _strip_trailing_whitespace(text: str) -> str:
    return "\n".join(line.rstrip() for line in text.replace("\r\n", "\n").replace("\r", "\n").split("\n"))


def _escape_leading_block_sigils(text: str) -> str:
    return "\n".join(f"\\{line}" if line.startswith(("@", "#")) else line for line in str(text).split("\n"))


def _escape_attr(value: str) -> str:
    return str(value).replace("\\", "\\\\").replace('"', '\\"').replace("\n", "\\n").replace("\t", "\\t")


def _canonicalize_inline_syntax(text: str) -> str:
    source = str(text)
    output = ""
    index = 0
    while index < len(source):
        start = source.find("{{", index)
        if start == -1:
            output += _canonicalize_inline_segment(source[index:])
            break
        output += _canonicalize_inline_segment(source[index:start])
        end = _find_inline_function_end(source, start)
        if end == -1:
            output += source[start:]
            break
        output += source[start : end + 2]
        index = end + 2
    return output


def _canonicalize_inline_segment(segment: str) -> str:
    source = str(segment)
    output = ""
    index = 0

    def render_link(match: re.Match[str]) -> str:
        label = match.group(1)
        target = match.group(2)
        if re.match(r"^#[a-z0-9]+(?:-[a-z0-9]+)*$", target):
            return f"{{{{ref:{label}|{target[1:]}}}}}"
        if target.startswith("#") and not DECISION_ID_PATTERN.match(target[1:]):
            raise LessmarkError("Inline ref target must be a lowercase slug")
        if not _is_safe_href(target):
            raise LessmarkError("Inline link href must not use an executable URL scheme")
        return f"{{{{link:{label}|{target}}}}}"

    patterns: list[tuple[re.Pattern[str], Callable[[re.Match[str]], str]]] = [
        (re.compile(r"^`([^`\n]+)`"), lambda match: f"{{{{code:{match.group(1)}}}}}"),
        (re.compile(r"^\[([^\]\n]+)\]\(([^)\s]+)\)"), render_link),
        (re.compile(r"^\[\^([a-z0-9]+(?:-[a-z0-9]+)*)\]"), lambda match: f"{{{{footnote:{match.group(1)}}}}}"),
        (re.compile(r"^\*\*([^*\n]+)\*\*"), lambda match: f"{{{{strong:{match.group(1)}}}}}"),
        (re.compile(r"^\*([^*\n]+)\*"), lambda match: f"{{{{em:{match.group(1)}}}}}"),
        (re.compile(r"^~~([^~\n]+)~~"), lambda match: f"{{{{del:{match.group(1)}}}}}"),
        (re.compile(r"^==([^=\n]+)=="), lambda match: f"{{{{mark:{match.group(1)}}}}}"),
    ]
    while index < len(source):
        rest = source[index:]
        if re.match(r"^\*{3,}", rest):
            raise LessmarkError("Combined shortcut emphasis is not supported; use explicit nested inline functions")
        for pattern, render in patterns:
            match = pattern.match(rest)
            if match:
                output += render(match)
                index += len(match.group(0))
                break
        else:
            if re.match(r"^\*\*\S", rest) or re.match(r"^\*\S", rest):
                raise LessmarkError("Ambiguous shortcut emphasis is not supported; use explicit nested inline functions")
            output += source[index]
            index += 1
    return output


def _find_inline_function_end(source: str, start: int) -> int:
    depth = 1
    index = start + 2
    while index < len(source):
        if source.startswith("{{", index):
            depth += 1
            index += 2
            continue
        if source.startswith("}}", index):
            depth -= 1
            if depth == 0:
                return index
            index += 2
            continue
        index += 1
    return -1


def from_markdown(markdown: str) -> str:
    lines = str(markdown).lstrip("\ufeff").replace("\r\n", "\n").replace("\r", "\n").split("\n")
    children: list[LessmarkNode] = []
    index = 0

    while index < len(lines):
        line = lines[index]

        if line.strip() == "":
            index += 1
            continue

        heading = re.match(r"^(#{1,6})\s+(.+?)\s*$", line)
        if heading:
            children.append({"type": "heading", "level": len(heading.group(1)), "text": _plain_text(heading.group(2))})
            index += 1
            continue

        if _is_markdown_separator(line):
            children.append({"type": "block", "name": "separator", "attrs": {}, "text": ""})
            index += 1
            continue

        if _is_math_fence_line(line):
            body: list[str] = []
            index += 1
            while index < len(lines) and not _is_math_fence_line(lines[index]):
                body.append(lines[index])
                index += 1
            if index >= len(lines):
                raise ValueError("Unclosed math block")
            index += 1
            children.append({"type": "block", "name": "math", "attrs": {"notation": "tex"}, "text": "\n".join(body)})
            continue

        fence = _read_fence_line(line)
        if fence is not None:
            body: list[str] = []
            index += 1
            while index < len(lines) and not _is_closing_fence(lines[index], fence):
                body.append(lines[index])
                index += 1
            if index >= len(lines):
                raise ValueError("Unclosed fenced code block")
            index += 1
            children.append(_fenced_code_node(str(fence["lang"]), body))
            continue

        task = re.match(r"^\s*[-*]\s+\[([ xX])\]\s+(.+?)\s*$", line)
        if task:
            children.append(
                {
                    "type": "block",
                    "name": "task",
                    "attrs": {"status": "done" if task.group(1).lower() == "x" else "todo"},
                    "text": _plain_text(task.group(2)),
                }
            )
            index += 1
            continue

        markdown_list = _read_markdown_list(lines, index)
        if markdown_list is not None:
            children.append(markdown_list["node"])  # type: ignore[arg-type]
            index = int(markdown_list["next_index"])
            continue

        image = _read_image_line(line)
        if image is not None:
            if _is_safe_resource(image["src"]):
                attrs = {"src": image["src"], "alt": _plain_text(image["alt"]) or "Image"}
                if image["caption"]:
                    attrs["caption"] = _plain_text(image["caption"])
                children.append({"type": "block", "name": "image", "attrs": attrs, "text": ""})
            else:
                children.append(
                    {
                        "type": "block",
                        "name": "paragraph",
                        "attrs": {},
                        "text": _plain_text(image["alt"]),
                    }
                )
            index += 1
            continue

        quote = _read_blockquote(lines, index)
        if quote is not None:
            children.append(quote["node"])
            index = quote["next_index"]
            continue

        table = _read_table(lines, index)
        if table is not None:
            children.append(table["node"])
            index = table["next_index"]
            continue

        paragraph: list[str] = []
        while index < len(lines) and lines[index].strip() != "":
            if _is_markdown_block_start(lines, index):
                break
            paragraph.append(lines[index].strip())
            index += 1

        raw_text = " ".join(paragraph)
        text = _plain_text(raw_text)
        link = re.match(r"^\[([^\]]+)\]\(([^)\s]+)\)$", raw_text)
        if link and _is_safe_href(link.group(2)):
            children.append({"type": "block", "name": "link", "attrs": {"href": link.group(2)}, "text": link.group(1)})
        else:
            children.append({"type": "block", "name": "paragraph", "attrs": {}, "text": text})

    return format_ast({"type": "document", "children": children})


def to_markdown(lessmark: str | DocumentNode) -> str:
    ast = parse_lessmark(lessmark) if isinstance(lessmark, str) else lessmark
    footnote_ids = {
        str(node.get("attrs", {}).get("id"))
        for node in ast["children"]
        if node.get("type") == "block" and node.get("name") == "footnote"
    }
    chunks: list[str] = []
    for node in ast["children"]:
        if node.get("type") == "heading":
            chunks.append(f"{'#' * int(node['level'])} {_inline_to_markdown(str(node['text']))}")
            continue
        if node.get("type") != "block":
            continue

        name = str(node["name"])
        attrs = node.get("attrs", {})
        text = str(node.get("text", ""))
        if name in {"summary", "paragraph"}:
            chunks.append(_inline_to_markdown(text))
        elif name == "constraint":
            chunks.append(f"> Constraint: {text}")
        elif name == "decision":
            chunks.append(f"### {attrs.get('id')}\n\n**Decision:** {_inline_to_markdown(text)}")
        elif name == "task":
            chunks.append(f"- [{'x' if attrs.get('status') == 'done' else ' '}] {text}")
        elif name == "file":
            chunks.append(f"**File:** `{attrs.get('path')}`\n\n{text}")
        elif name == "api":
            chunks.append(f"**API:** `{attrs.get('name')}`\n\n{text}")
        elif name == "link":
            chunks.append(f"[{text or attrs.get('href')}]({attrs.get('href')})")
        elif name == "metadata":
            chunks.append(f"<!-- lessmark:{attrs.get('key')}={text} -->")
        elif name == "risk":
            chunks.append(f"> Risk ({attrs.get('level')}): {text}")
        elif name == "depends-on":
            chunks.append(f"> Depends on `{attrs.get('target')}`: {text}")
        elif name == "code":
            chunks.append(f"```{attrs.get('lang', '')}\n{text}\n```")
        elif name == "math":
            chunks.append(_math_to_markdown(str(attrs.get("notation", "")), text))
        elif name == "diagram":
            chunks.append(f"```{attrs.get('kind', '')}\n{text}\n```")
        elif name == "example":
            chunks.append(f"Example:\n\n{text}")
        elif name == "separator":
            chunks.append("---")
        elif name in {"page", "toc"}:
            continue
        elif name == "nav":
            href = str(attrs.get("href", ""))
            if not _is_safe_href(href):
                raise ValueError("@nav href must be http, https, mailto, or a safe relative path")
            chunks.append(f"- [{_inline_to_markdown(str(attrs.get('label', '')))}]({href})")
        elif name == "quote":
            chunks.append(_quote_to_markdown(text, str(attrs.get("cite", ""))))
        elif name == "callout":
            chunks.append(_callout_to_markdown(str(attrs.get("kind", "note")), str(attrs.get("title", "")), text))
        elif name == "list":
            chunks.append(_list_to_markdown(str(attrs.get("kind", "unordered")), text))
        elif name == "table":
            chunks.append(_table_to_markdown(str(attrs.get("columns", "")), text))
        elif name == "image":
            chunks.append(_image_to_markdown(attrs, text))
        elif name == "footnote":
            chunks.append(f"[^{attrs.get('id')}]: {_inline_to_markdown(text)}")
        elif name == "definition":
            chunks.append(f"**{_inline_to_markdown(str(attrs.get('term', '')))}**\n: {_inline_to_markdown(text)}")
        elif name == "reference":
            label = str(attrs.get("label") or text or attrs.get("target", ""))
            target = str(attrs.get("target", ""))
            anchor = f"fn-{target}" if target in footnote_ids else target
            chunks.append(f"[{_inline_to_markdown(label)}](#{anchor})")
        else:
            chunks.append(text)
    return "\n\n".join(chunk for chunk in chunks if chunk) + "\n"


def _fenced_code_node(lang: str, body: list[str]) -> BlockNode:
    text = "\n".join(body)
    if lang in {"math", "tex", "latex"}:
        return {"type": "block", "name": "math", "attrs": {"notation": "tex"}, "text": text}
    if lang == "asciimath":
        return {"type": "block", "name": "math", "attrs": {"notation": "asciimath"}, "text": text}
    if lang in DIAGRAM_KINDS:
        return {"type": "block", "name": "diagram", "attrs": {"kind": lang}, "text": text}
    attrs = {"lang": lang} if lang else {}
    return {"type": "block", "name": "code", "attrs": attrs, "text": text}


def _math_to_markdown(notation: str, text: str) -> str:
    if notation == "tex":
        return f"$$\n{text}\n$$"
    return f"```{notation}\n{text}\n```"


def _inline_to_markdown(text: str) -> str:
    result = str(text)
    _assert_inline_local_targets(result)
    replacements = [
        (r"\{\{strong:([^{}]+)\}\}", r"**\1**"),
        (r"\{\{em:([^{}]+)\}\}", r"*\1*"),
        (r"\{\{code:([^{}]+)\}\}", r"`\1`"),
        (r"\{\{kbd:([^{}]+)\}\}", r"`\1`"),
        (r"\{\{del:([^{}]+)\}\}", r"~~\1~~"),
        (r"\{\{mark:([^{}]+)\}\}", r"==\1=="),
        (r"\{\{sup:([^{}]+)\}\}", r"^\1^"),
        (r"\{\{sub:([^{}]+)\}\}", r"~\1~"),
        (r"\{\{ref:([^{}|]+)\|([^{}]+)\}\}", r"[\1](#\2)"),
        (r"\{\{footnote:([^{}]+)\}\}", r"[^\1]"),
        (r"\{\{link:([^{}|]+)\|([^{}]+)\}\}", r"[\1](\2)"),
    ]
    for _ in range(MAX_INLINE_MARKDOWN_PASSES):
        before = result
        for pattern, replacement in replacements:
            result = re.sub(pattern, replacement, result)
        if result == before:
            return result
    raise ValueError("Inline nesting too deep")


def _assert_inline_local_targets(text: str) -> None:
    for target in re.findall(r"\{\{ref:[^{}|]*\|([^{}]*)\}\}", text):
        if not DECISION_ID_PATTERN.match(target):
            raise ValueError("Inline ref target must be a lowercase slug")
    for target in re.findall(r"\{\{footnote:([^{}]*)\}\}", text):
        if not DECISION_ID_PATTERN.match(target):
            raise ValueError("Inline footnote target must be a lowercase slug")


def _quote_to_markdown(text: str, cite: str) -> str:
    quoted = "\n".join(f"> {line}" for line in _inline_to_markdown(text).splitlines())
    return f"{quoted}\n>\n> Source: {_inline_to_markdown(cite)}" if cite else quoted


def _callout_to_markdown(kind: str, title: str, text: str) -> str:
    label = (kind or "note").upper()
    head = f"> [!{label}] {_inline_to_markdown(title)}" if title else f"> [!{label}]"
    body = "\n".join(f"> {line}" for line in _inline_to_markdown(text).splitlines())
    return f"{head}\n{body}"


def _list_to_markdown(kind: str, text: str) -> str:
    rows: list[str] = []
    counters: list[int] = []
    for line in (row for row in text.splitlines() if row.strip()):
        match = re.match(r"^( *)- (.*)$", line)
        if match is None:
            raise LessmarkError("@list items must use one explicit '- ' item marker per line")
        level = len(match.group(1)) // 2
        while len(counters) <= level:
            counters.append(0)
        counters[level] += 1
        del counters[level + 1 :]
        marker = f"{counters[level]}." if kind == "ordered" else "-"
        item = _inline_to_markdown(match.group(2).strip())
        rows.append(f"{'  ' * level}{marker} {item}")
    return "\n".join(rows)


def _table_to_markdown(columns: str, text: str) -> str:
    header = [_escape_markdown_table_cell(cell) for cell in _split_table_row(columns)]
    rows = [
        [_escape_markdown_table_cell(_inline_to_markdown(cell)) for cell in _split_table_row(row)]
        for row in text.splitlines()
        if row.strip()
    ]
    table = [f"| {' | '.join(header)} |", f"| {' | '.join('---' for _ in header)} |"]
    table.extend(f"| {' | '.join(row)} |" for row in rows)
    return "\n".join(table)


def _escape_markdown_table_cell(cell: str) -> str:
    return str(cell).replace("|", "\\|")


def _image_to_markdown(attrs: Mapping[str, object], text: str) -> str:
    image = f"![{attrs.get('alt', '')}]({attrs.get('src', '')})"
    caption = str(attrs.get("caption") or text)
    return f"{image}\n\n{_inline_to_markdown(caption)}" if caption else image


def _read_image_line(line: str) -> dict[str, str] | None:
    match = re.match(r'^!\[([^\]]*)\]\((\S+?)(?:\s+"([^"]*)")?\)\s*$', line.strip())
    if not match:
        return None
    return {"alt": match.group(1), "src": match.group(2), "caption": match.group(3) or ""}


def _read_blockquote(lines: list[str], start_index: int) -> dict[str, object] | None:
    if not re.match(r"^\s*>\s?", lines[start_index]):
        return None
    quote_lines: list[str] = []
    index = start_index
    while index < len(lines) and re.match(r"^\s*>\s?", lines[index]):
        quote_lines.append(re.sub(r"^\s*>\s?", "", lines[index], count=1))
        index += 1

    first = quote_lines[0].strip() if quote_lines else ""
    callout = re.match(r"^\[!(NOTE|TIP|WARNING|CAUTION)\]\s*(.*)$", first, re.IGNORECASE)
    if callout:
        attrs = {"kind": callout.group(1).lower()}
        if callout.group(2).strip():
            attrs["title"] = _plain_text(callout.group(2))
        return {
            "next_index": index,
            "node": {
                "type": "block",
                "name": "callout",
                "attrs": attrs,
                "text": "\n".join(_plain_text(line) for line in quote_lines[1:] if _plain_text(line)),
            },
        }

    return {
        "next_index": index,
        "node": {
            "type": "block",
            "name": "quote",
            "attrs": {},
            "text": "\n".join(_plain_text(line) for line in quote_lines if _plain_text(line)),
        },
    }


def _read_markdown_list(lines: list[str], start_index: int) -> dict[str, object] | None:
    first = _read_markdown_list_item(lines[start_index])
    if first is None:
        return None
    kind = str(first["kind"])
    marker = str(first["marker"])
    items: list[str] = []
    index = start_index
    while index < len(lines):
        item = _read_markdown_list_item(lines[index])
        if item is None or item["kind"] != kind:
            break
        if str(item["marker"]) != marker:
            raise ValueError("Mixed Markdown list markers are not supported by Lessmark import")
        items.append(f"{'  ' * int(item['level'])}- {_plain_text(str(item['text']))}")
        index += 1
    return {
        "next_index": index,
        "node": {"type": "block", "name": "list", "attrs": {"kind": kind}, "text": "\n".join(items)},
    }


def _read_markdown_list_item(line: str) -> dict[str, object] | None:
    match = re.match(r"^( *)(?:([-*+])|(\d+[.)]))\s+(.+?)\s*$", line)
    if match is None:
        return None
    return {
        "level": len(match.group(1)) // 2,
        "kind": "ordered" if match.group(3) else "unordered",
        "marker": match.group(2) or ("1)" if str(match.group(3)).endswith(")") else "1."),
        "text": match.group(4),
    }


def _read_table(lines: list[str], start_index: int) -> dict[str, object] | None:
    if start_index + 1 >= len(lines):
        return None
    header = _split_markdown_table_row(lines[start_index])
    separators = _split_markdown_table_row(lines[start_index + 1])
    if len(header) < 1 or len(header) != len(separators) or not all(_is_table_separator(cell) for cell in separators):
        return None

    rows: list[list[str]] = []
    index = start_index + 2
    while index < len(lines) and lines[index].strip() != "":
        cells = _split_markdown_table_row(lines[index])
        if len(cells) != len(header):
            break
        rows.append(cells)
        index += 1

    columns = [_escape_lessmark_table_cell(_plain_text(cell)) for cell in header]
    body = [[_escape_lessmark_table_cell(_plain_text(cell)) for cell in row] for row in rows]
    if any(cell == "" for cell in columns) or any(cell == "" for row in body for cell in row):
        return None

    return {
        "next_index": index,
        "node": {
            "type": "block",
            "name": "table",
            "attrs": {"columns": "|".join(columns)},
            "text": "\n".join("|".join(row) for row in body),
        },
    }


def _split_markdown_table_row(line: str) -> list[str]:
    row = line.strip()
    if row.startswith("|"):
        row = row[1:]
    if row.endswith("|") and not row.endswith(r"\|"):
        row = row[:-1]
    return _split_table_row(row)


def _is_table_separator(cell: str) -> bool:
    return bool(re.match(r"^:?-{3,}:?$", cell.strip()))


def _escape_lessmark_table_cell(cell: str) -> str:
    return str(cell).replace("\\", "\\\\").replace("|", r"\|")


def _is_markdown_block_start(lines: list[str], index: int) -> bool:
    return (
        re.match(r"^(#{1,6})\s+", lines[index]) is not None
        or _read_fence_line(lines[index]) is not None
        or _is_math_fence_line(lines[index])
        or _is_markdown_separator(lines[index])
        or re.match(r"^\s*[-*]\s+\[[ xX]\]\s+", lines[index]) is not None
        or _read_markdown_list_item(lines[index]) is not None
        or _read_image_line(lines[index]) is not None
        or re.match(r"^\s*>\s?", lines[index]) is not None
        or _read_table(lines, index) is not None
    )


def _is_markdown_separator(line: str) -> bool:
    return bool(re.match(r"^(?: {0,3})([-*_])(?:\s*\1){2,}\s*$", line))


def _read_fence_line(line: str) -> dict[str, object] | None:
    match = re.match(r"^( {0,3})(`{3,}|~{3,})(.*)$", line)
    if not match:
        return None
    marker = match.group(2)
    info = match.group(3).strip()
    if marker.startswith("`") and "`" in info:
        return None
    first_word = info.split(None, 1)[0] if info else ""
    lang = first_word if CODE_LANG_PATTERN.match(first_word) else ""
    return {"char": marker[0], "length": len(marker), "lang": lang}


def _is_math_fence_line(line: str) -> bool:
    return line.strip() == "$$"


def _is_closing_fence(line: str, fence: Mapping[str, object]) -> bool:
    match = re.match(r"^( {0,3})(`{3,}|~{3,})\s*$", line)
    return bool(match and match.group(2).startswith(str(fence["char"])) and len(match.group(2)) >= int(fence["length"]))


def _plain_text(text: str) -> str:
    result = re.sub(r"!\[([^\]]*)\]\([^)]+\)", r"\1", str(text))
    result = re.sub(r"\[([^\]]+)\]\([^)]+\)", r"\1", result)
    result = re.sub(r"[`*_~]", "", result)
    return result.strip()
