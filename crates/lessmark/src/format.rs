use crate::ast::{Document, Node};
use crate::error::{LessmarkError, ValidationError};
use crate::parser::parse_lessmark;
use crate::validate::validate_document;

pub fn format_lessmark(source: &str) -> Result<String, LessmarkError> {
    let document = parse_lessmark(source)?;
    Ok(render_document(&document))
}

pub fn format_document(document: &Document) -> Result<String, Vec<ValidationError>> {
    let errors = validate_document(document);
    if !errors.is_empty() {
        return Err(errors);
    }
    Ok(render_document(document))
}

fn render_document(document: &Document) -> String {
    let chunks = document
        .children
        .iter()
        .map(format_node)
        .collect::<Vec<_>>()
        .join("\n\n");
    format!("{}\n", chunks)
}

fn format_node(node: &Node) -> String {
    match node {
        Node::Heading { level, text, .. } => {
            format!("{} {}", "#".repeat(*level as usize), text.trim())
        }
        Node::Block {
            name, attrs, text, ..
        } => {
            if name == "paragraph" && attrs.is_empty() {
                return escape_leading_block_sigils(&strip_trailing_whitespace(text));
            }
            let attrs = attrs
                .iter()
                .map(|(key, value)| format!("{}=\"{}\"", key, escape_attr(value)))
                .collect::<Vec<_>>()
                .join(" ");
            let header = if attrs.is_empty() {
                format!("@{}", name)
            } else {
                format!("@{} {}", name, attrs)
            };
            let text = strip_trailing_whitespace(text);
            let body = if is_literal_block(name) {
                text
            } else {
                escape_leading_block_sigils(&text)
            };
            if body.is_empty() {
                header
            } else {
                format!("{}\n{}", header, body)
            }
        }
    }
}

fn is_literal_block(name: &str) -> bool {
    matches!(name, "code" | "example" | "math" | "diagram")
}

fn strip_trailing_whitespace(text: &str) -> String {
    text.replace("\r\n", "\n")
        .replace('\r', "\n")
        .split('\n')
        .map(str::trim_end)
        .collect::<Vec<_>>()
        .join("\n")
}

fn escape_leading_block_sigils(text: &str) -> String {
    text.split('\n')
        .map(|line| {
            if line.starts_with('@') || line.starts_with('#') {
                format!("\\{}", line)
            } else {
                line.to_string()
            }
        })
        .collect::<Vec<_>>()
        .join("\n")
}

fn escape_attr(value: &str) -> String {
    value
        .replace('\\', "\\\\")
        .replace('"', "\\\"")
        .replace('\n', "\\n")
        .replace('\t', "\\t")
}
