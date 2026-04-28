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
        Node::Heading { level, text } => format!("{} {}", "#".repeat(*level as usize), text.trim()),
        Node::Block { name, attrs, text } => {
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
            if text.is_empty() {
                header
            } else {
                format!("{}\n{}", header, text)
            }
        }
    }
}

fn strip_trailing_whitespace(text: &str) -> String {
    text.replace("\r\n", "\n")
        .replace('\r', "\n")
        .split('\n')
        .map(str::trim_end)
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
