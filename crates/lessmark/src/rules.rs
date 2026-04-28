use crate::grammar::{BlockAttrSpec, BLOCK_ATTR_SPECS, TASK_STATUSES};
use regex::Regex;
use serde_json::Value;
use std::collections::BTreeMap;
use std::sync::OnceLock;

fn html_tag_pattern() -> &'static Regex {
    static PATTERN: OnceLock<Regex> = OnceLock::new();
    PATTERN.get_or_init(|| Regex::new(r#"</?[A-Za-z][A-Za-z0-9:-]*(?:\s[^>]*)?>"#).unwrap())
}

fn api_name_pattern() -> &'static Regex {
    static PATTERN: OnceLock<Regex> = OnceLock::new();
    PATTERN.get_or_init(|| Regex::new(r#"^[A-Za-z_][A-Za-z0-9_.-]*$"#).unwrap())
}

fn decision_id_pattern() -> &'static Regex {
    static PATTERN: OnceLock<Regex> = OnceLock::new();
    PATTERN.get_or_init(|| Regex::new(r#"^[a-z0-9]+(?:-[a-z0-9]+)*$"#).unwrap())
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
        .is_none_or(|scheme| {
            matches!(
                scheme.as_str().to_ascii_lowercase().as_str(),
                "http" | "https" | "mailto"
            )
        })
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
                return Some("@link href must not use an executable URL scheme".to_string());
            }
        }
    }
    None
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
