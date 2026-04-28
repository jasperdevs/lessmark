use crate::ast::{Document, Node};
use crate::error::LessmarkError;
use crate::grammar::is_core_block;
use crate::rules::{contains_control_whitespace, contains_html_like_tag, get_block_attr_errors};
use std::collections::BTreeMap;

pub fn parse_lessmark(source: &str) -> Result<Document, LessmarkError> {
    let normalized = normalize_source(source);
    let lines: Vec<&str> = normalized.split('\n').collect();
    let mut children = Vec::new();
    let mut index = 0;

    while index < lines.len() {
        let line = lines[index];
        if line.trim().is_empty() {
            index += 1;
            continue;
        }
        if line.starts_with('#') {
            children.push(parse_heading(line, index + 1)?);
            index += 1;
            continue;
        }
        if line.starts_with('@') {
            let parsed = parse_block(&lines, index)?;
            children.push(parsed.node);
            index = parsed.next_index;
            continue;
        }
        return Err(LessmarkError::new(
            "Loose text is not allowed outside a typed block",
            index + 1,
            1,
        ));
    }

    Ok(Document::new(children))
}

fn normalize_source(source: &str) -> String {
    let source = source.strip_prefix('\u{feff}').unwrap_or(source);
    source.replace("\r\n", "\n").replace('\r', "\n")
}

fn parse_heading(line: &str, line_number: usize) -> Result<Node, LessmarkError> {
    let level = line.chars().take_while(|ch| *ch == '#').count();
    if level == 0 || level > 6 || !line[level..].starts_with(' ') {
        return Err(LessmarkError::new("Invalid heading syntax", line_number, 1));
    }
    let raw_text = &line[level + 1..];
    if raw_text.chars().next().is_none_or(char::is_whitespace) {
        return Err(LessmarkError::new("Invalid heading syntax", line_number, 1));
    }
    if has_closing_heading_markers(raw_text) {
        return Err(LessmarkError::new(
            "Closing heading markers are not supported",
            line_number,
            line.len(),
        ));
    }
    assert_safe_text(raw_text, "heading", line_number, level + 2)?;
    Ok(Node::Heading {
        level: level as u8,
        text: raw_text.trim_end().to_string(),
    })
}

fn has_closing_heading_markers(text: &str) -> bool {
    let trimmed = text.trim_end();
    trimmed.ends_with('#')
        && trimmed
            .rsplit_once(char::is_whitespace)
            .is_some_and(|(_, end)| end.chars().all(|ch| ch == '#'))
}

struct ParsedBlock {
    node: Node,
    next_index: usize,
}

fn parse_block(lines: &[&str], start_index: usize) -> Result<ParsedBlock, LessmarkError> {
    let header = lines[start_index];
    let (name, rest) = read_block_header(header)
        .ok_or_else(|| LessmarkError::new("Invalid typed block header", start_index + 1, 1))?;
    if !is_core_block(name) {
        return Err(LessmarkError::new(
            format!("Unknown typed block \"{}\"", name),
            start_index + 1,
            2,
        ));
    }

    let attrs = parse_attrs(rest, start_index + 1, name.len() + 2)?;
    validate_block_attrs(name, &attrs, start_index + 1)?;

    let mut body = Vec::new();
    let mut index = start_index + 1;
    while index < lines.len() {
        let line = lines[index];
        if line.trim().is_empty() || line.starts_with('#') || line.starts_with('@') {
            break;
        }
        assert_safe_text(line, &format!("@{}", name), index + 1, 1)?;
        body.push(line.trim_end().to_string());
        index += 1;
    }

    Ok(ParsedBlock {
        node: Node::Block {
            name: name.to_string(),
            attrs,
            text: body.join("\n"),
        },
        next_index: index,
    })
}

fn read_block_header(header: &str) -> Option<(&str, &str)> {
    if !header.starts_with('@') {
        return None;
    }
    let bytes = header.as_bytes();
    let first = *bytes.get(1)?;
    if !first.is_ascii_lowercase() {
        return None;
    }
    let mut end = 2;
    while end < bytes.len() {
        let byte = bytes[end];
        if byte.is_ascii_lowercase() || byte.is_ascii_digit() || byte == b'_' || byte == b'-' {
            end += 1;
        } else {
            break;
        }
    }
    Some((&header[1..end], &header[end..]))
}

fn parse_attrs(
    input: &str,
    line_number: usize,
    start_column: usize,
) -> Result<BTreeMap<String, String>, LessmarkError> {
    let mut attrs = BTreeMap::new();
    let bytes = input.as_bytes();
    let mut index = 0;

    while index < bytes.len() {
        if bytes[index].is_ascii_whitespace() {
            index += 1;
            continue;
        }

        let key_start = index;
        if !bytes[index].is_ascii_lowercase() {
            return Err(LessmarkError::new(
                "Invalid attribute name",
                line_number,
                start_column + index,
            ));
        }
        index += 1;
        while index < bytes.len() {
            let byte = bytes[index];
            if byte.is_ascii_lowercase() || byte.is_ascii_digit() || byte == b'_' || byte == b'-' {
                index += 1;
            } else {
                break;
            }
        }
        let key = &input[key_start..index];

        if bytes.get(index) != Some(&b'=') {
            return Err(LessmarkError::new(
                "Expected = after attribute name",
                line_number,
                start_column + index,
            ));
        }
        index += 1;

        if bytes.get(index) != Some(&b'"') {
            return Err(LessmarkError::new(
                "Attribute values must be double-quoted",
                line_number,
                start_column + index,
            ));
        }

        let quote_index = index;
        let parsed = read_quoted(input, quote_index, line_number, start_column)?;
        if attrs.contains_key(key) {
            return Err(LessmarkError::new(
                format!("Duplicate attribute \"{}\"", key),
                line_number,
                start_column + quote_index,
            ));
        }
        assert_safe_attr_value(key, &parsed.value, line_number, start_column + quote_index)?;
        attrs.insert(key.to_string(), parsed.value);
        index = parsed.next_index;
    }

    Ok(attrs)
}

struct ParsedQuoted {
    value: String,
    next_index: usize,
}

fn read_quoted(
    input: &str,
    quote_index: usize,
    line_number: usize,
    start_column: usize,
) -> Result<ParsedQuoted, LessmarkError> {
    let bytes = input.as_bytes();
    let mut value = String::new();
    let mut index = quote_index + 1;

    while index < bytes.len() {
        match bytes[index] {
            b'"' => {
                return Ok(ParsedQuoted {
                    value,
                    next_index: index + 1,
                });
            }
            b'\\' => {
                let Some(next) = bytes.get(index + 1) else {
                    return Err(LessmarkError::new(
                        "Unterminated escape sequence",
                        line_number,
                        start_column + index,
                    ));
                };
                match next {
                    b'"' => value.push('"'),
                    b'\\' => value.push('\\'),
                    other => {
                        return Err(LessmarkError::new(
                            format!("Unsupported escape \\{}", *other as char),
                            line_number,
                            start_column + index,
                        ));
                    }
                }
                index += 2;
            }
            _ => {
                let ch = input[index..]
                    .chars()
                    .next()
                    .expect("index is inside the input");
                value.push(ch);
                index += ch.len_utf8();
            }
        }
    }

    Err(LessmarkError::new(
        "Unterminated quoted attribute",
        line_number,
        start_column + quote_index,
    ))
}

fn validate_block_attrs(
    name: &str,
    attrs: &BTreeMap<String, String>,
    line_number: usize,
) -> Result<(), LessmarkError> {
    if let Some(error) = get_block_attr_errors(name, attrs).into_iter().next() {
        return Err(LessmarkError::new(error, line_number, 1));
    }
    Ok(())
}

fn assert_safe_text(
    text: &str,
    location: &str,
    line_number: usize,
    column: usize,
) -> Result<(), LessmarkError> {
    if contains_html_like_tag(text) {
        return Err(LessmarkError::new(
            format!("{} contains raw HTML/JSX-like syntax", location),
            line_number,
            column,
        ));
    }
    Ok(())
}

fn assert_safe_attr_value(
    key: &str,
    value: &str,
    line_number: usize,
    column: usize,
) -> Result<(), LessmarkError> {
    if contains_control_whitespace(value) {
        return Err(LessmarkError::new(
            format!("Attribute \"{}\" cannot contain control whitespace", key),
            line_number,
            column,
        ));
    }
    assert_safe_text(
        value,
        &format!("attribute \"{}\"", key),
        line_number,
        column,
    )
}
