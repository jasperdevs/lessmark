use crate::ast::{Document, Node, PositionPoint, PositionRange};
use crate::error::LessmarkError;
use crate::grammar::is_core_block;
use crate::rules::{
    contains_control_whitespace, contains_html_like_tag, get_block_attr_errors,
    get_block_body_errors, is_local_slug, is_safe_href,
};
use regex::Regex;
use std::collections::{BTreeMap, BTreeSet};

pub fn parse_lessmark(source: &str) -> Result<Document, LessmarkError> {
    parse_source(source, false)
}

pub fn parse_lessmark_with_positions(source: &str) -> Result<Document, LessmarkError> {
    parse_source(source, true)
}

fn parse_source(source: &str, source_positions: bool) -> Result<Document, LessmarkError> {
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
            children.push(parse_heading(line, index + 1, source_positions)?);
            index += 1;
            continue;
        }
        if line.starts_with('@') {
            let parsed = parse_block(&lines, index, source_positions)?;
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

    if let Some(error) = get_local_anchor_errors(&children).into_iter().next() {
        return Err(LessmarkError::new(error, 1, 1));
    }
    Ok(Document::new(children))
}

fn normalize_source(source: &str) -> String {
    let source = source.strip_prefix('\u{feff}').unwrap_or(source);
    source.replace("\r\n", "\n").replace('\r', "\n")
}

fn parse_heading(
    line: &str,
    line_number: usize,
    source_positions: bool,
) -> Result<Node, LessmarkError> {
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
        position: source_positions.then(|| position(line_number, 1, line_number, line.len() + 1)),
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

fn parse_block(
    lines: &[&str],
    start_index: usize,
    source_positions: bool,
) -> Result<ParsedBlock, LessmarkError> {
    let header = lines[start_index];
    let (raw_name, raw_rest) = read_block_header(header)
        .ok_or_else(|| LessmarkError::new("Invalid typed block header", start_index + 1, 1))?;
    let (name, shorthand_attrs, rest) =
        normalize_block_header(raw_name, raw_rest, start_index + 1)?;
    let name = name.as_str();
    if !is_core_block(name) {
        return Err(LessmarkError::new(
            format!("Unknown typed block \"{}\"", name),
            start_index + 1,
            2,
        ));
    }

    let mut attrs = shorthand_attrs;
    attrs.extend(parse_attrs(&rest, start_index + 1, name.len() + 2)?);
    validate_block_attrs(name, &attrs, start_index + 1)?;

    let mut body = Vec::new();
    let mut index = start_index + 1;
    let mut end_line = start_index + 1;
    let mut end_column = header.len() + 1;
    while index < lines.len() {
        let line = lines[index];
        if body.is_empty() && line.trim().is_empty() && !is_literal_block(name) {
            index += 1;
            continue;
        }
        if is_block_terminator(&lines, index, name) {
            break;
        }
        assert_safe_text(line, &format!("@{}", name), index + 1, 1)?;
        body.push(line.trim_end().to_string());
        end_line = index + 1;
        end_column = line.len() + 1;
        index += 1;
    }

    let text = body.join("\n");
    let text = if is_literal_block(name) {
        text
    } else {
        canonicalize_inline_syntax(&text)?
    };
    validate_block_body(name, &attrs, &text, start_index + 1)?;
    Ok(ParsedBlock {
        node: Node::Block {
            name: name.to_string(),
            attrs,
            text,
            position: source_positions.then(|| position(start_index + 1, 1, end_line, end_column)),
        },
        next_index: index,
    })
}

fn is_block_terminator(lines: &[&str], index: usize, name: &str) -> bool {
    let line = lines[index];
    if line.starts_with('#') || line.starts_with('@') {
        return true;
    }
    if !line.trim().is_empty() {
        return false;
    }
    if !is_literal_block(name) {
        return true;
    }

    let mut next = index + 1;
    while next < lines.len() && lines[next].trim().is_empty() {
        next += 1;
    }
    next >= lines.len() || lines[next].starts_with('#') || lines[next].starts_with('@')
}

fn is_literal_block(name: &str) -> bool {
    matches!(name, "code" | "example" | "math" | "diagram")
}

fn position(
    start_line: usize,
    start_column: usize,
    end_line: usize,
    end_column: usize,
) -> PositionRange {
    PositionRange {
        start: PositionPoint {
            line: start_line,
            column: start_column,
        },
        end: PositionPoint {
            line: end_line,
            column: end_column,
        },
    }
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

fn normalize_block_header(
    raw_name: &str,
    raw_rest: &str,
    line_number: usize,
) -> Result<(String, BTreeMap<String, String>, String), LessmarkError> {
    let mut attrs = BTreeMap::new();
    let mut name = raw_name;
    match raw_name {
        "p" | "ul" | "ol" => {
            if !raw_rest.trim().is_empty() {
                return Err(LessmarkError::new(
                    format!("@{} does not accept attributes", raw_name),
                    line_number,
                    1,
                ));
            }
            match raw_name {
                "p" => name = "paragraph",
                "ul" => {
                    name = "list";
                    attrs.insert("kind".to_string(), "unordered".to_string());
                }
                "ol" => {
                    name = "list";
                    attrs.insert("kind".to_string(), "ordered".to_string());
                }
                _ => {}
            }
        }
        _ => {}
    }

    let mut rest = raw_rest.to_string();
    if let Some(attr) = shorthand_attr(name) {
        let value = raw_rest.trim();
        if !value.is_empty() && !value.contains('=') && !value.chars().any(char::is_whitespace) {
            attrs.insert(attr.to_string(), value.to_string());
            rest.clear();
        }
    }

    Ok((name.to_string(), attrs, rest))
}

fn shorthand_attr(name: &str) -> Option<&'static str> {
    match name {
        "api" => Some("name"),
        "callout" => Some("kind"),
        "code" => Some("lang"),
        "diagram" => Some("kind"),
        "decision" => Some("id"),
        "definition" => Some("term"),
        "depends-on" => Some("target"),
        "file" => Some("path"),
        "footnote" => Some("id"),
        "link" => Some("href"),
        "math" => Some("notation"),
        "metadata" => Some("key"),
        "reference" => Some("target"),
        "risk" => Some("level"),
        "table" => Some("columns"),
        "task" => Some("status"),
        _ => None,
    }
}

fn canonicalize_inline_syntax(text: &str) -> Result<String, LessmarkError> {
    let mut output = String::new();
    let mut index = 0;
    while let Some(relative_start) = text[index..].find("{{") {
        let start = index + relative_start;
        output.push_str(&canonicalize_inline_segment(&text[index..start])?);
        if let Some(end) = find_inline_function_end(text, start) {
            output.push_str(&text[start..end]);
            index = end;
        } else {
            output.push_str(&canonicalize_inline_segment(&text[start..])?);
            index = text.len();
        }
    }
    if index < text.len() {
        output.push_str(&canonicalize_inline_segment(&text[index..])?);
    }
    Ok(output)
}

fn canonicalize_inline_segment(segment: &str) -> Result<String, LessmarkError> {
    let code = Regex::new(r"^`([^`\n]+)`").expect("code regex");
    let link = Regex::new(r"^\[([^\]\n]+)\]\(([^)\s]+)\)").expect("link regex");
    let footnote = Regex::new(r"^\[\^([a-z0-9]+(?:-[a-z0-9]+)*)\]").expect("footnote regex");
    let strong = Regex::new(r"^\*\*([^*\n]+)\*\*").expect("strong regex");
    let emphasis = Regex::new(r"^\*([^*\n]+)\*").expect("emphasis regex");
    let deleted = Regex::new(r"^~~([^~\n]+)~~").expect("deleted regex");
    let marked = Regex::new(r"^==([^=\n]+)==").expect("marked regex");

    let mut output = String::new();
    let mut index = 0;
    while index < segment.len() {
        let rest = &segment[index..];
        if Regex::new(r"^\*{3,}")
            .expect("combined emphasis regex compiles")
            .is_match(rest)
        {
            return Err(LessmarkError::new(
                "Combined shortcut emphasis is not supported; use explicit nested inline functions",
                1,
                1,
            ));
        }
        if let Some(captures) = code.captures(rest) {
            output.push_str(&format!(
                "{{{{code:{}}}}}",
                captures.get(1).map_or("", |m| m.as_str())
            ));
            index += captures.get(0).map_or(0, |m| m.as_str().len());
            continue;
        }
        if let Some(captures) = link.captures(rest) {
            let label = captures.get(1).map_or("", |m| m.as_str());
            let href = captures.get(2).map_or("", |m| m.as_str());
            if let Some(target) = href.strip_prefix('#') {
                if !is_local_slug(target) {
                    return Err(LessmarkError::new(
                        "Inline ref target must be a lowercase slug",
                        1,
                        1,
                    ));
                }
                output.push_str(&format!("{{{{ref:{}|{}}}}}", label, target));
            } else {
                if !is_safe_href(href) {
                    return Err(LessmarkError::new(
                        "Inline link href must not use an executable URL scheme",
                        1,
                        1,
                    ));
                }
                output.push_str(&format!("{{{{link:{}|{}}}}}", label, href));
            }
            index += captures.get(0).map_or(0, |m| m.as_str().len());
            continue;
        }
        if let Some(captures) = footnote.captures(rest) {
            output.push_str(&format!(
                "{{{{footnote:{}}}}}",
                captures.get(1).map_or("", |m| m.as_str())
            ));
            index += captures.get(0).map_or(0, |m| m.as_str().len());
            continue;
        }
        if let Some(captures) = strong.captures(rest) {
            output.push_str(&format!(
                "{{{{strong:{}}}}}",
                captures.get(1).map_or("", |m| m.as_str())
            ));
            index += captures.get(0).map_or(0, |m| m.as_str().len());
            continue;
        }
        if let Some(captures) = emphasis.captures(rest) {
            output.push_str(&format!(
                "{{{{em:{}}}}}",
                captures.get(1).map_or("", |m| m.as_str())
            ));
            index += captures.get(0).map_or(0, |m| m.as_str().len());
            continue;
        }
        if let Some(captures) = deleted.captures(rest) {
            output.push_str(&format!(
                "{{{{del:{}}}}}",
                captures.get(1).map_or("", |m| m.as_str())
            ));
            index += captures.get(0).map_or(0, |m| m.as_str().len());
            continue;
        }
        if let Some(captures) = marked.captures(rest) {
            output.push_str(&format!(
                "{{{{mark:{}}}}}",
                captures.get(1).map_or("", |m| m.as_str())
            ));
            index += captures.get(0).map_or(0, |m| m.as_str().len());
            continue;
        }
        if Regex::new(r"^\*\*?\S")
            .expect("ambiguous emphasis regex compiles")
            .is_match(rest)
        {
            return Err(LessmarkError::new(
                "Ambiguous shortcut emphasis is not supported; use explicit nested inline functions",
                1,
                1,
            ));
        }
        let char_len = rest.chars().next().map_or(1, char::len_utf8);
        output.push_str(&rest[..char_len]);
        index += char_len;
    }
    Ok(output)
}

fn find_inline_function_end(source: &str, start: usize) -> Option<usize> {
    let mut depth = 0;
    let mut index = start;
    while index < source.len() {
        let remaining = &source[index..];
        if remaining.starts_with("{{") {
            depth += 1;
            index += 2;
            continue;
        }
        if remaining.starts_with("}}") {
            depth -= 1;
            index += 2;
            if depth == 0 {
                return Some(index);
            }
            continue;
        }
        index += source[index..].chars().next().map_or(1, char::len_utf8);
    }
    None
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

fn validate_block_body(
    name: &str,
    attrs: &BTreeMap<String, String>,
    text: &str,
    line_number: usize,
) -> Result<(), LessmarkError> {
    if let Some(error) = get_block_body_errors(name, attrs, text).into_iter().next() {
        return Err(LessmarkError::new(error, line_number, 1));
    }
    Ok(())
}

fn get_local_anchor_errors(children: &[Node]) -> Vec<String> {
    let mut errors = Vec::new();
    let mut seen = BTreeSet::new();
    let mut targets = BTreeSet::new();
    let mut heading_counts: BTreeMap<String, usize> = BTreeMap::new();
    for node in children {
        let slugs = match node {
            Node::Heading { text, .. } => {
                let base = slugify_local_anchor(text);
                let next = heading_counts.get(&base).copied().unwrap_or(0) + 1;
                heading_counts.insert(base.clone(), next);
                vec![if next == 1 {
                    base
                } else {
                    format!("{}-{}", base, next)
                }]
            }
            Node::Block { name, attrs, .. } if name == "decision" => {
                vec![attrs.get("id").cloned().unwrap_or_default()]
            }
            Node::Block { name, attrs, .. } if name == "footnote" => {
                let id = attrs.get("id").cloned().unwrap_or_default();
                vec![
                    id.clone(),
                    if id.is_empty() {
                        String::new()
                    } else {
                        format!("fn-{}", id)
                    },
                ]
            }
            _ => Vec::new(),
        };
        for slug in slugs {
            if slug.is_empty() {
                continue;
            }
            if !seen.insert(slug.clone()) {
                errors.push(format!("Duplicate local anchor slug \"{}\"", slug));
            } else {
                targets.insert(slug);
            }
        }
    }
    for node in children {
        let Node::Block { name, attrs, .. } = node else {
            continue;
        };
        if name != "reference" {
            continue;
        }
        let target = attrs.get("target").map(String::as_str).unwrap_or("");
        let footnote_target = format!("fn-{}", target);
        if !target.is_empty() && !targets.contains(target) && !targets.contains(&footnote_target) {
            errors.push(format!("Unknown local reference target \"{}\"", target));
        }
    }
    errors
}

fn slugify_local_anchor(text: &str) -> String {
    let mut slug = String::new();
    let mut last_dash = false;
    for ch in text.chars().flat_map(char::to_lowercase) {
        if ch.is_ascii_alphanumeric() {
            slug.push(ch);
            last_dash = false;
        } else if !last_dash {
            slug.push('-');
            last_dash = true;
        }
    }
    let slug = slug.trim_matches('-').to_string();
    if slug.is_empty() {
        "section".to_string()
    } else {
        slug
    }
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
