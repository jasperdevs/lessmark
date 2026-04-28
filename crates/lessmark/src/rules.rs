use crate::grammar::{
    BlockAttrSpec, BLOCK_ATTR_SPECS, CALLOUT_KINDS, DIAGRAM_KINDS, LIST_KINDS, MATH_NOTATIONS,
    RISK_LEVELS, TASK_STATUSES,
};
use regex::Regex;
use serde_json::Value;
use std::collections::BTreeMap;
use std::sync::OnceLock;

fn html_tag_pattern() -> &'static Regex {
    static PATTERN: OnceLock<Regex> = OnceLock::new();
    PATTERN.get_or_init(|| Regex::new(r#"</?[A-Za-z][A-Za-z0-9:-]*(?:\s[^>]*)?>"#).unwrap())
}

fn markdown_reference_definition_pattern() -> &'static Regex {
    static PATTERN: OnceLock<Regex> = OnceLock::new();
    PATTERN.get_or_init(|| Regex::new(r"^\s{0,3}\[[^\]\n]+\]:\s+\S").unwrap())
}

fn markdown_thematic_break_pattern() -> &'static Regex {
    static PATTERN: OnceLock<Regex> = OnceLock::new();
    PATTERN.get_or_init(|| Regex::new(r"^(?:(?: {0,3})(?:[-*_]\s*){3,}|(?: {0,3})=+\s*)$").unwrap())
}

fn markdown_blockquote_pattern() -> &'static Regex {
    static PATTERN: OnceLock<Regex> = OnceLock::new();
    PATTERN.get_or_init(|| Regex::new(r"^\s{0,3}>\s?").unwrap())
}

fn api_name_pattern() -> &'static Regex {
    static PATTERN: OnceLock<Regex> = OnceLock::new();
    PATTERN.get_or_init(|| Regex::new(r#"^[A-Za-z_][A-Za-z0-9_.-]*$"#).unwrap())
}

fn code_lang_pattern() -> &'static Regex {
    static PATTERN: OnceLock<Regex> = OnceLock::new();
    PATTERN.get_or_init(|| Regex::new(r#"^[A-Za-z0-9_.+-]+$"#).unwrap())
}

fn decision_id_pattern() -> &'static Regex {
    static PATTERN: OnceLock<Regex> = OnceLock::new();
    PATTERN.get_or_init(|| Regex::new(r#"^[a-z0-9]+(?:-[a-z0-9]+)*$"#).unwrap())
}

fn metadata_key_pattern() -> &'static Regex {
    static PATTERN: OnceLock<Regex> = OnceLock::new();
    PATTERN.get_or_init(|| Regex::new(r#"^[a-z][a-z0-9]*(?:[._-][a-z0-9]+)*$"#).unwrap())
}

fn definition_term_pattern() -> &'static Regex {
    static PATTERN: OnceLock<Regex> = OnceLock::new();
    PATTERN.get_or_init(|| Regex::new(r#"^[^\r\n\t<>]+$"#).unwrap())
}

fn windows_drive_pattern() -> &'static Regex {
    static PATTERN: OnceLock<Regex> = OnceLock::new();
    PATTERN.get_or_init(|| Regex::new(r#"^[A-Za-z]:[\\/]"#).unwrap())
}

fn uri_scheme_pattern() -> &'static Regex {
    static PATTERN: OnceLock<Regex> = OnceLock::new();
    PATTERN.get_or_init(|| Regex::new(r#"^([A-Za-z][A-Za-z0-9+.-]*):"#).unwrap())
}

pub fn contains_html_like_tag(text: &str) -> bool {
    html_tag_pattern().is_match(text)
}

pub fn contains_control_whitespace(text: &str) -> bool {
    text.chars().any(|ch| matches!(ch, '\r' | '\n' | '\t'))
}

pub fn get_legacy_markdown_line_error(line: &str) -> Option<&'static str> {
    if markdown_reference_definition_pattern().is_match(line) {
        return Some(
            "Markdown reference definitions are not supported; use @reference or {{ref:label|target}}",
        );
    }
    if markdown_thematic_break_pattern().is_match(line) {
        return Some(
            "Markdown thematic breaks and setext underlines are not supported; use @separator or # headings",
        );
    }
    if markdown_blockquote_pattern().is_match(line) {
        return Some(
            "Markdown blockquote markers are not supported in Lessmark source; use @quote or @callout",
        );
    }
    None
}

pub fn get_block_attr_errors(name: &str, attrs: &BTreeMap<String, String>) -> Vec<String> {
    let Some(spec) = BLOCK_ATTR_SPECS.get(name) else {
        return vec![format!("Unknown typed block \"{}\"", name)];
    };

    let mut errors = Vec::new();
    for key in attrs.keys() {
        if !spec.allowed.contains(key.as_str()) {
            errors.push(format!("@{} does not allow attribute \"{}\"", name, key));
        }
    }
    for key in &spec.required {
        if attrs.get(*key).is_none_or(String::is_empty) {
            errors.push(format!("@{} requires {}", name, key));
        }
    }
    if let Some(error) = semantic_attr_error(name, attrs) {
        errors.push(error);
    }
    errors
}

pub fn get_block_attr_errors_from_value(
    name: &str,
    attrs: &serde_json::Map<String, Value>,
) -> Vec<String> {
    let Some(spec) = BLOCK_ATTR_SPECS.get(name) else {
        return vec![format!("Unknown typed block \"{}\"", name)];
    };

    let mut errors = attr_shape_errors(name, attrs.keys().map(String::as_str), spec);
    for key in &spec.required {
        match attrs.get(*key) {
            None => errors.push(format!("@{} requires {}", name, key)),
            Some(Value::String(value)) if value.is_empty() => {
                errors.push(format!("@{} requires {}", name, key));
            }
            _ => {}
        }
    }
    if let Some(error) = semantic_attr_error_from_value(name, attrs) {
        errors.push(error);
    }
    errors
}

pub fn get_block_body_errors(
    name: &str,
    attrs: &BTreeMap<String, String>,
    text: &str,
) -> Vec<String> {
    if matches!(name, "image" | "nav" | "page" | "separator" | "toc") && !text.trim().is_empty() {
        return vec![format!("@{} must not have a body", name)];
    }
    if name == "list" {
        return get_list_body_errors(text);
    }
    if name == "table" {
        return get_table_body_errors(attrs.get("columns").map(String::as_str).unwrap_or(""), text);
    }
    if !matches!(name, "code" | "example" | "math" | "diagram") {
        if let Some(error) = text.lines().find_map(get_legacy_markdown_line_error) {
            return vec![error.to_string()];
        }
    }
    Vec::new()
}

pub fn get_block_body_errors_from_value(
    name: &str,
    attrs: Option<&serde_json::Map<String, Value>>,
    text: &str,
) -> Vec<String> {
    let string_attrs: BTreeMap<String, String> = attrs
        .into_iter()
        .flat_map(|attrs| attrs.iter())
        .filter_map(|(key, value)| value.as_str().map(|text| (key.clone(), text.to_string())))
        .collect();
    get_block_body_errors(name, &string_attrs, text)
}

fn attr_shape_errors<'a>(
    name: &str,
    keys: impl Iterator<Item = &'a str>,
    spec: &BlockAttrSpec,
) -> Vec<String> {
    keys.filter(|key| !spec.allowed.contains(*key))
        .map(|key| format!("@{} does not allow attribute \"{}\"", name, key))
        .collect()
}

pub fn is_relative_project_path(path: &str) -> bool {
    !path.is_empty()
        && !path.starts_with('/')
        && !path.starts_with('\\')
        && !windows_drive_pattern().is_match(path)
        && !uri_scheme_pattern().is_match(path)
        && !path.split(['/', '\\']).any(|part| part == "..")
}

pub fn is_safe_href(href: &str) -> bool {
    uri_scheme_pattern()
        .captures(href)
        .and_then(|captures| captures.get(1))
        .map_or_else(
            || is_relative_project_path(href),
            |scheme| {
                matches!(
                    scheme.as_str().to_ascii_lowercase().as_str(),
                    "http" | "https" | "mailto"
                )
            },
        )
}

pub fn is_local_slug(value: &str) -> bool {
    decision_id_pattern().is_match(value)
}

pub fn is_safe_resource(src: &str) -> bool {
    uri_scheme_pattern()
        .captures(src)
        .and_then(|captures| captures.get(1))
        .map_or_else(
            || is_relative_project_path(src),
            |scheme| {
                matches!(
                    scheme.as_str().to_ascii_lowercase().as_str(),
                    "http" | "https"
                )
            },
        )
}

fn semantic_attr_error(name: &str, attrs: &BTreeMap<String, String>) -> Option<String> {
    if name == "task" {
        if let Some(status) = attrs.get("status") {
            if !TASK_STATUSES.contains(&status.as_str()) {
                return Some("@task status must be one of: todo, doing, done, blocked".to_string());
            }
        }
    }
    if name == "decision" {
        if let Some(id) = attrs.get("id") {
            if !decision_id_pattern().is_match(id) {
                return Some("@decision id must be a lowercase slug".to_string());
            }
        }
    }
    if name == "file" {
        if let Some(path) = attrs.get("path") {
            if !is_relative_project_path(path) {
                return Some("@file path must be a relative project path".to_string());
            }
        }
    }
    if name == "api" {
        if let Some(api_name) = attrs.get("name") {
            if !api_name_pattern().is_match(api_name) {
                return Some("@api name must be an identifier".to_string());
            }
        }
    }
    if name == "link" {
        if let Some(href) = attrs.get("href") {
            if !is_safe_href(href) {
                return Some(
                    "@link href must be http, https, mailto, or a safe relative path".to_string(),
                );
            }
        }
    }
    if name == "code" {
        if let Some(lang) = attrs.get("lang") {
            if !code_lang_pattern().is_match(lang) {
                return Some("@code lang must be a compact language identifier".to_string());
            }
        }
    }
    if name == "metadata" {
        if let Some(key) = attrs.get("key") {
            if !metadata_key_pattern().is_match(key) {
                return Some("@metadata key must be a lowercase dotted key".to_string());
            }
        }
    }
    if name == "risk" {
        if let Some(level) = attrs.get("level") {
            if !RISK_LEVELS.contains(&level.as_str()) {
                return Some("@risk level must be one of: low, medium, high, critical".to_string());
            }
        }
    }
    if name == "callout" {
        if let Some(kind) = attrs.get("kind") {
            if !CALLOUT_KINDS.contains(&kind.as_str()) {
                return Some(
                    "@callout kind must be one of: note, tip, warning, caution".to_string(),
                );
            }
        }
    }
    if name == "list" {
        if let Some(kind) = attrs.get("kind") {
            if !LIST_KINDS.contains(&kind.as_str()) {
                return Some("@list kind must be one of: unordered, ordered".to_string());
            }
        }
    }
    if name == "table" {
        if let Some(columns) = attrs.get("columns") {
            if !is_valid_table_columns(columns) {
                return Some("@table columns must be pipe-separated non-empty labels".to_string());
            }
        }
    }
    if name == "image" {
        if let Some(src) = attrs.get("src") {
            if !is_safe_resource(src) {
                return Some("@image src must be a safe relative, http, or https URL".to_string());
            }
        }
    }
    if name == "math" {
        if let Some(notation) = attrs.get("notation") {
            if !MATH_NOTATIONS.contains(&notation.as_str()) {
                return Some("@math notation must be one of: tex, asciimath".to_string());
            }
        }
    }
    if name == "diagram" {
        if let Some(kind) = attrs.get("kind") {
            if !DIAGRAM_KINDS.contains(&kind.as_str()) {
                return Some(
                    "@diagram kind must be one of: mermaid, graphviz, plantuml".to_string(),
                );
            }
        }
    }
    if name == "nav" {
        if let Some(label) = attrs.get("label") {
            if label.trim().is_empty() || !definition_term_pattern().is_match(label) {
                return Some("@nav label must be plain single-line text".to_string());
            }
        }
        if let Some(href) = attrs.get("href") {
            if !is_safe_href(href) {
                return Some(
                    "@nav href must be http, https, mailto, or a safe relative path".to_string(),
                );
            }
        }
        if let Some(slot) = attrs.get("slot") {
            if slot != "primary" && slot != "footer" {
                return Some("@nav slot must be primary or footer".to_string());
            }
        }
    }
    if name == "footnote" {
        if let Some(id) = attrs.get("id") {
            if !decision_id_pattern().is_match(id) {
                return Some("@footnote id must be a lowercase slug".to_string());
            }
        }
    }
    if name == "definition" {
        if let Some(term) = attrs.get("term") {
            if term.trim().is_empty() || !definition_term_pattern().is_match(term) {
                return Some("@definition term must be plain single-line text".to_string());
            }
        }
    }
    if name == "reference" {
        if let Some(target) = attrs.get("target") {
            if !decision_id_pattern().is_match(target) {
                return Some("@reference target must be a lowercase slug".to_string());
            }
        }
    }
    if name == "page" {
        if let Some(output) = attrs.get("output") {
            if !is_safe_page_output(output) {
                return Some("@page output must be a safe relative .html path".to_string());
            }
        }
    }
    if name == "depends-on" {
        if let Some(target) = attrs.get("target") {
            if !decision_id_pattern().is_match(target) {
                return Some("@depends-on target must be a lowercase slug".to_string());
            }
        }
    }
    None
}

fn is_valid_table_columns(columns: &str) -> bool {
    let labels = columns.split('|').map(str::trim).collect::<Vec<_>>();
    !labels.is_empty() && labels.iter().all(|column| !column.is_empty())
}

fn get_list_body_errors(text: &str) -> Vec<String> {
    let mut previous_level = 0usize;
    let mut seen_item = false;
    for line in text.lines().filter(|line| !line.trim().is_empty()) {
        if line.contains('\t') {
            return vec!["@list items must use one explicit '- ' item marker per line".to_string()];
        }
        let Some(marker_index) = line.find("- ") else {
            return vec!["@list items must use one explicit '- ' item marker per line".to_string()];
        };
        if !line[..marker_index].chars().all(|ch| ch == ' ') || marker_index % 2 != 0 {
            return vec!["@list nesting must use two spaces per level".to_string()];
        }
        if line[marker_index + 2..].trim().is_empty() {
            return vec!["@list items cannot be empty".to_string()];
        }
        let level = marker_index / 2;
        if !seen_item && level != 0 {
            return vec!["@list must start at the top level".to_string()];
        }
        if level > previous_level + 1 {
            return vec!["@list nesting cannot skip levels".to_string()];
        }
        previous_level = level;
        seen_item = true;
    }
    Vec::new()
}

fn get_table_body_errors(columns: &str, text: &str) -> Vec<String> {
    let column_count = split_table_row(columns).len();
    for line in text.lines().filter(|line| !line.trim().is_empty()) {
        let cells = split_table_row(line);
        if cells.iter().any(String::is_empty) {
            return vec!["@table cells cannot be empty".to_string()];
        }
        if cells.len() != column_count {
            return vec!["@table row cell count must match columns".to_string()];
        }
    }
    Vec::new()
}

pub fn split_table_row(value: &str) -> Vec<String> {
    let mut cells = Vec::new();
    let mut cell = String::new();
    let mut escaping = false;
    for ch in value.chars() {
        if escaping {
            if ch != '|' && ch != '\\' {
                cell.push('\\');
            }
            cell.push(ch);
            escaping = false;
            continue;
        }
        if ch == '\\' {
            escaping = true;
            continue;
        }
        if ch == '|' {
            cells.push(cell.trim().to_string());
            cell.clear();
            continue;
        }
        cell.push(ch);
    }
    if escaping {
        cell.push('\\');
    }
    cells.push(cell.trim().to_string());
    cells
}

fn is_safe_page_output(output: &str) -> bool {
    is_relative_project_path(output) && output.ends_with(".html")
}

fn semantic_attr_error_from_value(
    name: &str,
    attrs: &serde_json::Map<String, Value>,
) -> Option<String> {
    let string_attrs: BTreeMap<String, String> = attrs
        .iter()
        .filter_map(|(key, value)| value.as_str().map(|text| (key.clone(), text.to_string())))
        .collect();
    semantic_attr_error(name, &string_attrs)
}
