use serde::Serialize;
use std::fmt;

#[derive(Debug, Clone, PartialEq, Eq, Serialize)]
pub struct LessmarkError {
    pub message: String,
    pub line: usize,
    pub column: usize,
}

impl LessmarkError {
    pub fn new(message: impl Into<String>, line: usize, column: usize) -> Self {
        Self {
            message: message.into(),
            line,
            column,
        }
    }
}

impl fmt::Display for LessmarkError {
    fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
        write!(f, "{} at {}:{}", self.message, self.line, self.column)
    }
}

impl std::error::Error for LessmarkError {}

#[derive(Debug, Clone, PartialEq, Eq, Serialize)]
pub struct ValidationError {
    pub code: String,
    pub message: String,
    pub hint: String,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub line: Option<usize>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub column: Option<usize>,
}

impl ValidationError {
    pub fn message(message: impl Into<String>) -> Self {
        let message = message.into();
        let code = error_code_for_message(&message).to_string();
        Self {
            hint: hint_for_code(&code).to_string(),
            code,
            message,
            line: None,
            column: None,
        }
    }

    pub fn from_parse_error(error: LessmarkError) -> Self {
        let code = error_code_for_message(&error.message).to_string();
        Self {
            hint: hint_for_code(&code).to_string(),
            code,
            message: error.message,
            line: Some(error.line),
            column: Some(error.column),
        }
    }
}

pub fn error_code_for_message(message: &str) -> &'static str {
    if message.contains("paragraph source syntax") {
        return "unsupported_source_syntax";
    }
    if message.contains("Unknown typed block") {
        return "unknown_block";
    }
    if message.contains("does not allow attribute") {
        return "unknown_attribute";
    }
    if message.contains(" requires ") {
        return "missing_required_attribute";
    }
    if message.contains("Duplicate attribute") {
        return "duplicate_attribute";
    }
    if message.contains("raw HTML/JSX-like") {
        return "raw_html";
    }
    if message.contains("raw expression-like") {
        return "raw_expression";
    }
    if message.contains("inline nesting too deep") {
        return "inline_nesting_too_deep";
    }
    if message.contains("Markdown reference definitions")
        || message.contains("Markdown thematic breaks")
        || message.contains("Markdown blockquote markers")
        || message.contains("Markdown list markers")
    {
        return "markdown_legacy_syntax";
    }
    if message.contains("Loose text") {
        return "loose_text";
    }
    if message.contains("Invalid heading") {
        return "invalid_heading";
    }
    if message.contains("Closing heading markers") {
        return "closing_heading_marker";
    }
    if message.contains("Invalid typed block header") {
        return "invalid_block_header";
    }
    if message.contains("Invalid attribute name") {
        return "invalid_attribute_name";
    }
    if message.contains("Expected =") {
        return "expected_attribute_equals";
    }
    if message.contains("double-quoted") {
        return "unquoted_attribute";
    }
    if message.contains("Unsupported escape") {
        return "unsupported_escape";
    }
    if message.contains("Unterminated") || message.contains("unclosed inline function") {
        return "unterminated_syntax";
    }
    if message.contains("Unknown inline function") {
        return "unknown_inline_function";
    }
    if message.contains("inline functions must use") {
        return "invalid_inline_function";
    }
    if message.contains("control whitespace") {
        return "control_whitespace";
    }
    if message.contains("safe relative") || message.contains("executable URL") {
        return "unsafe_link_or_path";
    }
    if message.contains("lowercase slug") {
        return "invalid_slug";
    }
    if message.contains("Unknown local reference target") {
        return "unknown_reference_target";
    }
    if message.contains("Unknown inline local target") {
        return "unknown_inline_target";
    }
    if message.contains("Duplicate local anchor") {
        return "duplicate_local_anchor";
    }
    if message.contains("@list") {
        return "invalid_list_body";
    }
    if message.contains("@table") {
        return "invalid_table_body";
    }
    if message.contains("position") {
        return "invalid_position";
    }
    if message.contains("AST root") {
        return "invalid_ast_root";
    }
    if message.contains("unknown property") || message.contains("missing property") {
        return "invalid_ast_shape";
    }
    if message.contains("must be a string") {
        return "invalid_ast_value";
    }
    "validation_error"
}

pub fn hint_for_code(code: &str) -> &'static str {
    match code {
        "unsupported_source_syntax" => "Use plain prose for paragraphs; escape a leading @ or # with a backslash when it is literal text.",
        "unknown_block" => "Use one of the documented @block names or move custom data into @metadata.",
        "unknown_attribute" => "Remove the attribute or use the documented attribute for this block.",
        "missing_required_attribute" => "Add the required attribute with a non-empty double-quoted value.",
        "duplicate_attribute" => "Keep one value for each attribute.",
        "raw_html" => "Remove raw HTML/JSX and express structure with Lessmark blocks or safe renderer code.",
        "raw_expression" => "Move expressions into literal @code, @example, @math, or @diagram blocks.",
        "inline_nesting_too_deep" => "Reduce nested inline functions.",
        "markdown_legacy_syntax" => "Use the Lessmark block form instead of Markdown legacy syntax.",
        "loose_text" => "Put text in plain paragraphs or inside a typed block body.",
        "invalid_heading" => "Use one to six # characters followed by one space and visible heading text.",
        "closing_heading_marker" => "Remove trailing closing # markers.",
        "invalid_block_header" => "Use @block followed by optional key=\"value\" attributes.",
        "invalid_attribute_name" => "Use lowercase attribute names made of letters, numbers, _ or -.",
        "expected_attribute_equals" => "Write attributes as key=\"value\".",
        "unquoted_attribute" => "Wrap attribute values in double quotes.",
        "unsupported_escape" => "Only escape special syntax where the docs allow it.",
        "unterminated_syntax" => "Close the inline function or quoted attribute before the end of the block.",
        "unknown_inline_function" => "Use a documented inline function such as strong, em, code, link, ref, or footnote.",
        "invalid_inline_function" => "Write inline functions as {{name:value}} or {{name:value|extra}}.",
        "control_whitespace" => "Keep attributes on one line without tabs or newlines.",
        "unsafe_link_or_path" => "Use http, https, mailto, or a safe relative project path.",
        "invalid_slug" => "Use lowercase words separated by hyphens.",
        "unknown_reference_target" => "Point the reference at an existing heading, @decision id, or @footnote id.",
        "unknown_inline_target" => "Point the inline reference at an existing heading, @decision id, or @footnote id.",
        "duplicate_local_anchor" => "Rename one heading or id so every local anchor is unique.",
        "invalid_list_body" => "Use one '- ' item per line and two spaces per nesting level.",
        "invalid_table_body" => "Make every row match the table column count and escape literal pipes as \\|.",
        "invalid_position" => "Use one-based positive line and column numbers.",
        "invalid_ast_root" => "Pass a document AST with type=\"document\" and a children array.",
        "invalid_ast_shape" => "Use only the documented AST properties.",
        "invalid_ast_value" => "Use string values for text and attributes.",
        _ => "Fix the source so it matches the Lessmark syntax and validation contract.",
    }
}
