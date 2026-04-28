use crate::ast::{Document, Node};
use crate::error::LessmarkError;
use crate::format::format_document;
use crate::parser::parse_lessmark;
use regex::Regex;
use std::collections::BTreeMap;

struct Fence {
    marker: char,
    length: usize,
    lang: String,
}

pub fn from_markdown(markdown: &str) -> Result<String, LessmarkError> {
    let normalized = markdown
        .trim_start_matches('\u{feff}')
        .replace("\r\n", "\n")
        .replace('\r', "\n");
    let lines = normalized.split('\n').collect::<Vec<_>>();
    let mut children = Vec::new();
    let mut index = 0;
    let mut first_paragraph = true;

    while index < lines.len() {
        let line = lines[index];

        if line.trim().is_empty() {
            index += 1;
            continue;
        }

        if let Some((level, text)) = read_heading(line) {
            children.push(Node::Heading {
                level,
                text: plain_text(text),
                position: None,
            });
            index += 1;
            continue;
        }

        if let Some(fence) = read_fence_line(line) {
            let mut body = Vec::new();
            index += 1;
            while index < lines.len() && !is_closing_fence(lines[index], &fence) {
                body.push(escape_block_line(lines[index]));
                index += 1;
            }
            if index >= lines.len() {
                return Err(LessmarkError::new(
                    "Unclosed fenced code block",
                    lines.len(),
                    1,
                ));
            }
            index += 1;

            let mut attrs = BTreeMap::new();
            if !fence.lang.is_empty() {
                attrs.insert("lang".to_string(), fence.lang);
            }
            children.push(Node::Block {
                name: "code".to_string(),
                attrs,
                text: body.join("\n"),
                position: None,
            });
            first_paragraph = false;
            continue;
        }

        if let Some((done, text)) = read_task(line) {
            let mut attrs = BTreeMap::new();
            attrs.insert(
                "status".to_string(),
                if done { "done" } else { "todo" }.to_string(),
            );
            children.push(Node::Block {
                name: "task".to_string(),
                attrs,
                text: plain_text(text),
                position: None,
            });
            first_paragraph = false;
            index += 1;
            continue;
        }

        let mut paragraph = Vec::new();
        while index < lines.len() && !lines[index].trim().is_empty() {
            if read_heading(lines[index]).is_some()
                || read_fence_line(lines[index]).is_some()
                || read_task(lines[index]).is_some()
            {
                break;
            }
            paragraph.push(lines[index].trim());
            index += 1;
        }

        let raw_text = paragraph.join(" ");
        if let Some((label, href)) = read_standalone_link(&raw_text) {
            let mut attrs = BTreeMap::new();
            attrs.insert("href".to_string(), href.to_string());
            children.push(Node::Block {
                name: "link".to_string(),
                attrs,
                text: label.to_string(),
                position: None,
            });
        } else {
            children.push(Node::Block {
                name: if first_paragraph { "summary" } else { "note" }.to_string(),
                attrs: BTreeMap::new(),
                text: plain_text(&raw_text),
                position: None,
            });
        }
        first_paragraph = false;
    }

    format_document(&Document::new(children)).map_err(|errors| {
        LessmarkError::new(
            errors
                .first()
                .map(|error| error.message.clone())
                .unwrap_or_else(|| "Cannot format imported Markdown".to_string()),
            1,
            1,
        )
    })
}

pub fn to_markdown(lessmark: &str) -> Result<String, LessmarkError> {
    let ast = parse_lessmark(lessmark)?;
    let chunks = ast
        .children
        .iter()
        .filter_map(markdown_node)
        .filter(|chunk| !chunk.is_empty())
        .collect::<Vec<_>>();
    Ok(format!("{}\n", chunks.join("\n\n")))
}

fn markdown_node(node: &Node) -> Option<String> {
    match node {
        Node::Heading { level, text, .. } => {
            Some(format!("{} {}", "#".repeat(*level as usize), text))
        }
        Node::Block {
            name, attrs, text, ..
        } => match name.as_str() {
            "summary" | "note" => Some(text.clone()),
            "warning" => Some(format!("> Warning: {}", text)),
            "constraint" => Some(format!("> Constraint: {}", text)),
            "decision" => Some(format!(
                "**Decision {}:** {}",
                attrs.get("id").map(String::as_str).unwrap_or(""),
                text
            )),
            "task" => Some(format!(
                "- [{}] {}",
                if attrs.get("status").map(String::as_str) == Some("done") {
                    "x"
                } else {
                    " "
                },
                text
            )),
            "file" => Some(format!(
                "**File:** `{}`\n\n{}",
                attrs.get("path").map(String::as_str).unwrap_or(""),
                text
            )),
            "api" => Some(format!(
                "**API:** `{}`\n\n{}",
                attrs.get("name").map(String::as_str).unwrap_or(""),
                text
            )),
            "link" => Some(format!(
                "[{}]({})",
                if text.is_empty() {
                    attrs.get("href").map(String::as_str).unwrap_or("")
                } else {
                    text
                },
                attrs.get("href").map(String::as_str).unwrap_or("")
            )),
            "metadata" => Some(format!(
                "<!-- lessmark:{}={} -->",
                attrs.get("key").map(String::as_str).unwrap_or(""),
                text
            )),
            "risk" => Some(format!(
                "> Risk ({}): {}",
                attrs.get("level").map(String::as_str).unwrap_or(""),
                text
            )),
            "depends-on" => Some(format!(
                "> Depends on `{}`: {}",
                attrs.get("target").map(String::as_str).unwrap_or(""),
                text
            )),
            "code" => Some(format!(
                "```{}\n{}\n```",
                attrs.get("lang").map(String::as_str).unwrap_or(""),
                text
            )),
            "example" => Some(format!("Example:\n\n{}", text)),
            _ => Some(text.clone()),
        },
    }
}

fn read_heading(line: &str) -> Option<(u8, &str)> {
    let marker_count = line.chars().take_while(|char| *char == '#').count();
    if !(1..=6).contains(&marker_count) || line.chars().nth(marker_count) != Some(' ') {
        return None;
    }
    let text = line[marker_count + 1..].trim();
    if text.is_empty() {
        return None;
    }
    Some((marker_count as u8, text))
}

fn read_task(line: &str) -> Option<(bool, &str)> {
    let re = Regex::new(r"^\s*[-*]\s+\[([ xX])\]\s+(.+?)\s*$").expect("task regex compiles");
    let captures = re.captures(line)?;
    Some((
        captures.get(1)?.as_str().eq_ignore_ascii_case("x"),
        captures.get(2)?.as_str(),
    ))
}

fn read_standalone_link(text: &str) -> Option<(&str, &str)> {
    let re = Regex::new(r"^\[([^\]]+)\]\((https?://[^)\s]+|mailto:[^)\s]+)\)$")
        .expect("link regex compiles");
    let captures = re.captures(text)?;
    Some((captures.get(1)?.as_str(), captures.get(2)?.as_str()))
}

fn read_fence_line(line: &str) -> Option<Fence> {
    let leading_spaces = line.chars().take_while(|char| *char == ' ').count();
    if leading_spaces > 3 {
        return None;
    }
    let rest = &line[leading_spaces..];
    let marker = rest.chars().next()?;
    if marker != '`' && marker != '~' {
        return None;
    }
    let length = rest.chars().take_while(|char| *char == marker).count();
    if length < 3 {
        return None;
    }
    let info = rest[length..].trim();
    if marker == '`' && info.contains('`') {
        return None;
    }
    let first_word = info.split_whitespace().next().unwrap_or("");
    let lang_re = Regex::new(r"^[A-Za-z0-9_.+-]+$").expect("language regex compiles");
    Some(Fence {
        marker,
        length,
        lang: if lang_re.is_match(first_word) {
            first_word.to_string()
        } else {
            String::new()
        },
    })
}

fn is_closing_fence(line: &str, fence: &Fence) -> bool {
    let leading_spaces = line.chars().take_while(|char| *char == ' ').count();
    if leading_spaces > 3 {
        return false;
    }
    let rest = &line[leading_spaces..];
    let length = rest
        .chars()
        .take_while(|char| *char == fence.marker)
        .count();
    length >= fence.length && rest[length..].trim().is_empty()
}

fn escape_block_line(line: &str) -> String {
    if line.starts_with('#') || line.starts_with('@') {
        format!("  {}", line)
    } else {
        line.to_string()
    }
}

fn plain_text(text: &str) -> String {
    let image_re = Regex::new(r"!\[([^\]]*)\]\([^)]+\)").expect("image regex compiles");
    let link_re = Regex::new(r"\[([^\]]+)\]\([^)]+\)").expect("link regex compiles");
    let markup_re = Regex::new(r"[`*_~]").expect("markup regex compiles");
    let without_images = image_re.replace_all(text, "$1");
    let without_links = link_re.replace_all(&without_images, "$1");
    markup_re.replace_all(&without_links, "").trim().to_string()
}
