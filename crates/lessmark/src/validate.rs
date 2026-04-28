use crate::ast::Document;
use crate::error::ValidationError;
use crate::parser::parse_lessmark;
use crate::rules::{
    contains_control_whitespace, contains_html_like_tag, get_block_attr_errors_from_value,
};
use serde_json::Value;

pub fn validate_source(source: &str) -> Vec<ValidationError> {
    match parse_lessmark(source) {
        Ok(document) => validate_document(&document),
        Err(error) => vec![ValidationError::from_parse_error(error)],
    }
}

pub fn validate_document(document: &Document) -> Vec<ValidationError> {
    match serde_json::to_value(document) {
        Ok(value) => validate_value(&value),
        Err(error) => vec![ValidationError::message(error.to_string())],
    }
}

pub fn validate_value(value: &Value) -> Vec<ValidationError> {
    let mut errors = Vec::new();
    let Some(root) = value.as_object() else {
        return vec![ValidationError::message(
            "AST root must be a document with children",
        )];
    };
    if root.get("type") != Some(&Value::String("document".to_string()))
        || !root.get("children").is_some_and(Value::is_array)
    {
        return vec![ValidationError::message(
            "AST root must be a document with children",
        )];
    }
    validate_exact_keys(root, &["type", "children"], &mut errors, "document");

    if let Some(children) = root.get("children").and_then(Value::as_array) {
        for child in children {
            validate_child(child, &mut errors);
        }
    }
    errors
}

fn validate_child(value: &Value, errors: &mut Vec<ValidationError>) {
    let Some(node) = value.as_object() else {
        errors.push(ValidationError::message("AST child must be an object"));
        return;
    };

    match node.get("type").and_then(Value::as_str) {
        Some("heading") => validate_heading(node, errors),
        Some("block") => validate_block(node, errors),
        other => errors.push(ValidationError::message(format!(
            "Unknown AST node type: {}",
            other.unwrap_or("null")
        ))),
    }
}

fn validate_heading(node: &serde_json::Map<String, Value>, errors: &mut Vec<ValidationError>) {
    validate_exact_keys(node, &["type", "level", "text"], errors, "heading");
    if !node
        .get("level")
        .and_then(Value::as_i64)
        .is_some_and(|level| (1..=6).contains(&level))
    {
        errors.push(ValidationError::message(
            "heading level must be an integer from 1 to 6",
        ));
    }
    let Some(text) = node.get("text").and_then(Value::as_str) else {
        errors.push(ValidationError::message(
            "heading text must be a non-empty string",
        ));
        return;
    };
    if text.is_empty() {
        errors.push(ValidationError::message(
            "heading text must be a non-empty string",
        ));
        return;
    }
    validate_text_safety(text, errors, "heading");
}

fn validate_block(node: &serde_json::Map<String, Value>, errors: &mut Vec<ValidationError>) {
    let name = node.get("name").and_then(Value::as_str).unwrap_or("null");
    validate_exact_keys(
        node,
        &["type", "name", "attrs", "text"],
        errors,
        &format!("@{}", name),
    );

    let Some(text) = node.get("text").and_then(Value::as_str) else {
        errors.push(ValidationError::message(format!(
            "@{} text must be a string",
            name
        )));
        return;
    };
    validate_text_safety(text, errors, &format!("@{}", name));
    validate_attrs(name, node.get("attrs"), errors);
}

fn validate_attrs(name: &str, value: Option<&Value>, errors: &mut Vec<ValidationError>) {
    let Some(attrs) = value.and_then(Value::as_object) else {
        errors.push(ValidationError::message(format!(
            "@{} attrs must be an object",
            name
        )));
        return;
    };

    for (key, value) in attrs {
        let Some(text) = value.as_str() else {
            errors.push(ValidationError::message(format!(
                "Attribute \"{}\" must be a string",
                key
            )));
            continue;
        };
        validate_text_safety(text, errors, &format!("attribute \"{}\"", key));
        if contains_control_whitespace(text) {
            errors.push(ValidationError::message(format!(
                "Attribute \"{}\" cannot contain control whitespace",
                key
            )));
        }
    }

    for message in get_block_attr_errors_from_value(name, attrs) {
        errors.push(ValidationError::message(message));
    }
}

fn validate_text_safety(text: &str, errors: &mut Vec<ValidationError>, location: &str) {
    if contains_html_like_tag(text) {
        errors.push(ValidationError::message(format!(
            "{} contains raw HTML/JSX-like syntax",
            location
        )));
    }
}

fn validate_exact_keys(
    object: &serde_json::Map<String, Value>,
    expected: &[&str],
    errors: &mut Vec<ValidationError>,
    location: &str,
) {
    for key in object.keys() {
        if !expected.contains(&key.as_str()) {
            errors.push(ValidationError::message(format!(
                "{} has unknown property \"{}\"",
                location, key
            )));
        }
    }
    for key in expected {
        if !object.contains_key(*key) {
            errors.push(ValidationError::message(format!(
                "{} is missing property \"{}\"",
                location, key
            )));
        }
    }
}
