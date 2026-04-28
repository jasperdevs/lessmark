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
            "summary" | "note" | "paragraph" => Some(inline_to_markdown(text)),
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
            "page" | "toc" => None,
            "quote" => Some(quote_to_markdown(
                text,
                attrs.get("cite").map(String::as_str).unwrap_or(""),
            )),
            "callout" => Some(callout_to_markdown(
                attrs.get("kind").map(String::as_str).unwrap_or("note"),
                attrs.get("title").map(String::as_str).unwrap_or(""),
                text,
            )),
            "list" => Some(list_to_markdown(
                attrs.get("kind").map(String::as_str).unwrap_or("unordered"),
                text,
            )),
            "table" => Some(table_to_markdown(
                attrs.get("columns").map(String::as_str).unwrap_or(""),
                text,
            )),
            "image" => Some(image_to_markdown(attrs, text)),
            _ => Some(text.clone()),
        },
    }
}

fn inline_to_markdown(text: &str) -> String {
    let replacements = [
        (r"\{\{strong:([^{}]+)\}\}", "**$1**"),
        (r"\{\{em:([^{}]+)\}\}", "*$1*"),
        (r"\{\{code:([^{}]+)\}\}", "`$1`"),
        (r"\{\{kbd:([^{}]+)\}\}", "`$1`"),
        (r"\{\{link:([^{}|]+)\|([^{}]+)\}\}", "[$1]($2)"),
    ];
    replacements
        .iter()
        .fold(text.to_string(), |current, (pattern, replacement)| {
            Regex::new(pattern)
                .expect("inline export regex compiles")
                .replace_all(&current, *replacement)
                .to_string()
        })
}

fn quote_to_markdown(text: &str, cite: &str) -> String {
    let quoted = inline_to_markdown(text)
        .lines()
        .map(|line| format!("> {}", line))
        .collect::<Vec<_>>()
        .join("\n");
    if cite.is_empty() {
        quoted
    } else {
        format!("{}\n>\n> Source: {}", quoted, cite)
    }
}

fn callout_to_markdown(kind: &str, title: &str, text: &str) -> String {
    let label = kind.to_uppercase();
    let head = if title.is_empty() {
        format!("> [!{}]", label)
    } else {
        format!("> [!{}] {}", label, title)
    };
    let body = inline_to_markdown(text)
        .lines()
        .map(|line| format!("> {}", line))
        .collect::<Vec<_>>()
        .join("\n");
    format!("{}\n{}", head, body)
}

fn list_to_markdown(kind: &str, text: &str) -> String {
    text.lines()
        .filter(|line| !line.trim().is_empty())
        .enumerate()
        .map(|(index, line)| {
            let item = inline_to_markdown(line.trim_start().trim_start_matches("- ").trim());
            if kind == "ordered" {
                format!("{}. {}", index + 1, item)
            } else {
                format!("- {}", item)
            }
        })
        .collect::<Vec<_>>()
        .join("\n")
}

fn table_to_markdown(columns: &str, text: &str) -> String {
    let header = columns.split('|').collect::<Vec<_>>();
    let mut table = vec![
        format!("| {} |", header.join(" | ")),
        format!("| {} |", vec!["---"; header.len()].join(" | ")),
    ];
    for row in text.lines().filter(|line| !line.trim().is_empty()) {
        let cells = row
            .split('|')
            .map(|cell| inline_to_markdown(cell.trim()))
            .collect::<Vec<_>>();
        table.push(format!("| {} |", cells.join(" | ")));
    }
    table.join("\n")
}

fn image_to_markdown(attrs: &BTreeMap<String, String>, text: &str) -> String {
    let image = format!(
        "![{}]({})",
        attrs.get("alt").map(String::as_str).unwrap_or(""),
        attrs.get("src").map(String::as_str).unwrap_or("")
    );
    let caption = attrs
        .get("caption")
        .map(String::as_str)
        .unwrap_or(text)
        .trim();
    if caption.is_empty() {
        image
    } else {
        format!("{}\n\n{}", image, inline_to_markdown(caption))
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
