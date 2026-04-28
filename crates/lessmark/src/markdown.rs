use crate::ast::{Document, Node};
use crate::error::LessmarkError;
use crate::format::format_document;
use crate::parser::parse_lessmark;
use crate::rules::{is_safe_resource, split_table_row};
use regex::Regex;
use std::collections::{BTreeMap, BTreeSet};

struct Fence {
    marker: char,
    length: usize,
    lang: String,
}

struct ImageLine {
    alt: String,
    src: String,
    caption: String,
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

        if is_markdown_separator(line) {
            children.push(Node::Block {
                name: "separator".to_string(),
                attrs: BTreeMap::new(),
                text: String::new(),
                position: None,
            });
            first_paragraph = false;
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

        if let Some((node, next_index)) = read_markdown_list(&lines, index) {
            children.push(node);
            first_paragraph = false;
            index = next_index;
            continue;
        }

        if let Some(image) = read_image_line(line) {
            if is_safe_resource(&image.src) {
                let mut attrs = BTreeMap::new();
                attrs.insert(
                    "alt".to_string(),
                    non_empty_or_image(&plain_text(&image.alt)),
                );
                attrs.insert("src".to_string(), image.src);
                if !image.caption.is_empty() {
                    attrs.insert("caption".to_string(), plain_text(&image.caption));
                }
                children.push(Node::Block {
                    name: "image".to_string(),
                    attrs,
                    text: String::new(),
                    position: None,
                });
            } else {
                children.push(Node::Block {
                    name: if first_paragraph { "summary" } else { "note" }.to_string(),
                    attrs: BTreeMap::new(),
                    text: plain_text(&image.alt),
                    position: None,
                });
            }
            first_paragraph = false;
            index += 1;
            continue;
        }

        if let Some((node, next_index)) = read_blockquote(&lines, index) {
            children.push(node);
            first_paragraph = false;
            index = next_index;
            continue;
        }

        if let Some((node, next_index)) = read_table(&lines, index) {
            children.push(node);
            first_paragraph = false;
            index = next_index;
            continue;
        }

        let mut paragraph = Vec::new();
        while index < lines.len() && !lines[index].trim().is_empty() {
            if is_markdown_block_start(&lines, index) {
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
    validate_inline_local_targets(&ast)?;
    let footnote_ids = collect_footnote_ids(&ast);
    let chunks = ast
        .children
        .iter()
        .filter_map(|node| markdown_node(node, &footnote_ids))
        .filter(|chunk| !chunk.is_empty())
        .collect::<Vec<_>>();
    Ok(format!("{}\n", chunks.join("\n\n")))
}

fn collect_footnote_ids(document: &Document) -> BTreeSet<String> {
    document
        .children
        .iter()
        .filter_map(|node| match node {
            Node::Block { name, attrs, .. } if name == "footnote" => attrs.get("id").cloned(),
            _ => None,
        })
        .collect()
}

fn validate_inline_local_targets(document: &Document) -> Result<(), LessmarkError> {
    let ref_re = Regex::new(r"\{\{ref:[^{}|]*\|([^{}]*)\}\}").expect("inline ref regex compiles");
    let footnote_re =
        Regex::new(r"\{\{footnote:([^{}]*)\}\}").expect("inline footnote regex compiles");
    let slug_re = Regex::new(r"^[a-z0-9]+(?:-[a-z0-9]+)*$").expect("slug regex compiles");

    for node in &document.children {
        let mut values: Vec<&str> = Vec::new();
        match node {
            Node::Heading { text, .. } => values.push(text),
            Node::Block {
                name, attrs, text, ..
            } => {
                if name != "code" && name != "example" {
                    values.push(text);
                }
                values.extend(attrs.values().map(String::as_str));
            }
        }
        for value in values {
            validate_inline_local_targets_in_text(value, &ref_re, &footnote_re, &slug_re)?;
        }
    }
    Ok(())
}

fn validate_inline_local_targets_in_text(
    text: &str,
    ref_re: &Regex,
    footnote_re: &Regex,
    slug_re: &Regex,
) -> Result<(), LessmarkError> {
    for captures in ref_re.captures_iter(text) {
        if !slug_re.is_match(captures.get(1).map(|target| target.as_str()).unwrap_or("")) {
            return Err(LessmarkError::new(
                "Inline ref target must be a lowercase slug",
                1,
                1,
            ));
        }
    }
    for captures in footnote_re.captures_iter(text) {
        if !slug_re.is_match(captures.get(1).map(|target| target.as_str()).unwrap_or("")) {
            return Err(LessmarkError::new(
                "Inline footnote target must be a lowercase slug",
                1,
                1,
            ));
        }
    }
    Ok(())
}

fn markdown_node(node: &Node, footnote_ids: &BTreeSet<String>) -> Option<String> {
    match node {
        Node::Heading { level, text, .. } => Some(format!(
            "{} {}",
            "#".repeat(*level as usize),
            inline_to_markdown(text)
        )),
        Node::Block {
            name, attrs, text, ..
        } => match name.as_str() {
            "summary" | "note" | "paragraph" => Some(inline_to_markdown(text)),
            "warning" => Some(format!("> Warning: {}", text)),
            "constraint" => Some(format!("> Constraint: {}", text)),
            "decision" => Some(format!(
                "### {}\n\n**Decision:** {}",
                attrs.get("id").map(String::as_str).unwrap_or(""),
                inline_to_markdown(text)
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
            "separator" => Some("---".to_string()),
            "page" | "toc" => None,
            "nav" => Some(format!(
                "- [{}]({})",
                inline_to_markdown(attrs.get("label").map(String::as_str).unwrap_or("")),
                attrs.get("href").map(String::as_str).unwrap_or("")
            )),
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
            "footnote" => Some(format!(
                "[^{}]: {}",
                attrs.get("id").map(String::as_str).unwrap_or(""),
                inline_to_markdown(text)
            )),
            "definition" => Some(format!(
                "**{}**\n: {}",
                inline_to_markdown(attrs.get("term").map(String::as_str).unwrap_or("")),
                inline_to_markdown(text)
            )),
            "reference" => Some(format!(
                "[{}](#{})",
                inline_to_markdown(
                    attrs
                        .get("label")
                        .map(String::as_str)
                        .filter(|label| !label.is_empty())
                        .unwrap_or(if text.is_empty() {
                            attrs.get("target").map(String::as_str).unwrap_or("")
                        } else {
                            text
                        })
                ),
                reference_anchor(
                    attrs.get("target").map(String::as_str).unwrap_or(""),
                    footnote_ids
                )
            )),
            _ => Some(text.clone()),
        },
    }
}

fn reference_anchor(target: &str, footnote_ids: &BTreeSet<String>) -> String {
    if footnote_ids.contains(target) {
        format!("fn-{}", target)
    } else {
        target.to_string()
    }
}

fn inline_to_markdown(text: &str) -> String {
    let replacements = [
        (r"\{\{strong:([^{}]+)\}\}", "**$1**"),
        (r"\{\{em:([^{}]+)\}\}", "*$1*"),
        (r"\{\{code:([^{}]+)\}\}", "`$1`"),
        (r"\{\{kbd:([^{}]+)\}\}", "`$1`"),
        (r"\{\{del:([^{}]+)\}\}", "~~$1~~"),
        (r"\{\{mark:([^{}]+)\}\}", "==$1=="),
        (r"\{\{sup:([^{}]+)\}\}", "^$1^"),
        (r"\{\{sub:([^{}]+)\}\}", "~$1~"),
        (r"\{\{ref:([^{}|]+)\|([^{}]+)\}\}", "[$1](#$2)"),
        (r"\{\{footnote:([^{}]+)\}\}", "[^$1]"),
        (r"\{\{link:([^{}|]+)\|([^{}]+)\}\}", "[$1]($2)"),
    ];
    let compiled = replacements
        .iter()
        .map(|(pattern, replacement)| {
            (
                Regex::new(pattern).expect("inline export regex compiles"),
                *replacement,
            )
        })
        .collect::<Vec<_>>();
    let mut result = text.to_string();
    let max_passes = result.len().max(1);
    for _ in 0..max_passes {
        let before = result.clone();
        for (pattern, replacement) in &compiled {
            result = pattern.replace_all(&result, *replacement).to_string();
        }
        if result == before {
            return result;
        }
    }
    result
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
        format!("{}\n>\n> Source: {}", quoted, inline_to_markdown(cite))
    }
}

fn callout_to_markdown(kind: &str, title: &str, text: &str) -> String {
    let label = kind.to_uppercase();
    let head = if title.is_empty() {
        format!("> [!{}]", label)
    } else {
        format!("> [!{}] {}", label, inline_to_markdown(title))
    };
    let body = inline_to_markdown(text)
        .lines()
        .map(|line| format!("> {}", line))
        .collect::<Vec<_>>()
        .join("\n");
    format!("{}\n{}", head, body)
}

fn list_to_markdown(kind: &str, text: &str) -> String {
    let mut counters: Vec<usize> = Vec::new();
    text.lines()
        .filter(|line| !line.trim().is_empty())
        .map(|line| {
            let marker_index = line.find("- ").unwrap_or(0);
            let level = marker_index / 2;
            while counters.len() <= level {
                counters.push(0);
            }
            counters[level] += 1;
            counters.truncate(level + 1);
            let item = inline_to_markdown(line[marker_index + 2..].trim());
            if kind == "ordered" {
                format!("{}{}. {}", "  ".repeat(level), counters[level], item)
            } else {
                format!("{}- {}", "  ".repeat(level), item)
            }
        })
        .collect::<Vec<_>>()
        .join("\n")
}

fn table_to_markdown(columns: &str, text: &str) -> String {
    let header = split_table_row(columns)
        .into_iter()
        .map(|cell| escape_markdown_table_cell(&cell))
        .collect::<Vec<_>>();
    let mut table = vec![
        format!("| {} |", header.join(" | ")),
        format!("| {} |", vec!["---"; header.len()].join(" | ")),
    ];
    for row in text.lines().filter(|line| !line.trim().is_empty()) {
        let cells = split_table_row(row)
            .into_iter()
            .map(|cell| escape_markdown_table_cell(&inline_to_markdown(&cell)))
            .collect::<Vec<_>>();
        table.push(format!("| {} |", cells.join(" | ")));
    }
    table.join("\n")
}

fn escape_markdown_table_cell(cell: &str) -> String {
    cell.replace('|', "\\|")
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

fn read_image_line(line: &str) -> Option<ImageLine> {
    let re = Regex::new(r#"^!\[([^\]]*)\]\((\S+?)(?:\s+"([^"]*)")?\)\s*$"#)
        .expect("image regex compiles");
    let captures = re.captures(line.trim())?;
    Some(ImageLine {
        alt: captures
            .get(1)
            .map(|value| value.as_str())
            .unwrap_or("")
            .to_string(),
        src: captures.get(2)?.as_str().to_string(),
        caption: captures
            .get(3)
            .map(|value| value.as_str())
            .unwrap_or("")
            .to_string(),
    })
}

fn read_blockquote(lines: &[&str], start_index: usize) -> Option<(Node, usize)> {
    let quote_re = Regex::new(r"^\s*>\s?").expect("blockquote regex compiles");
    if !quote_re.is_match(lines[start_index]) {
        return None;
    }

    let mut quote_lines = Vec::new();
    let mut index = start_index;
    while index < lines.len() && quote_re.is_match(lines[index]) {
        quote_lines.push(quote_re.replace(lines[index], "").to_string());
        index += 1;
    }

    let first = quote_lines.first().map(|line| line.trim()).unwrap_or("");
    let callout_re = Regex::new(r"(?i)^\[!(NOTE|TIP|WARNING|CAUTION)\]\s*(.*)$")
        .expect("callout regex compiles");
    if let Some(captures) = callout_re.captures(first) {
        let mut attrs = BTreeMap::new();
        attrs.insert(
            "kind".to_string(),
            captures
                .get(1)
                .map(|value| value.as_str())
                .unwrap_or("note")
                .to_ascii_lowercase(),
        );
        let title = captures
            .get(2)
            .map(|value| value.as_str())
            .unwrap_or("")
            .trim();
        if !title.is_empty() {
            attrs.insert("title".to_string(), plain_text(title));
        }
        let text = quote_lines
            .iter()
            .skip(1)
            .map(|line| plain_text(line))
            .filter(|line| !line.is_empty())
            .collect::<Vec<_>>()
            .join("\n");
        return Some((
            Node::Block {
                name: "callout".to_string(),
                attrs,
                text,
                position: None,
            },
            index,
        ));
    }

    let text = quote_lines
        .iter()
        .map(|line| plain_text(line))
        .filter(|line| !line.is_empty())
        .collect::<Vec<_>>()
        .join("\n");
    Some((
        Node::Block {
            name: "quote".to_string(),
            attrs: BTreeMap::new(),
            text,
            position: None,
        },
        index,
    ))
}

fn read_markdown_list(lines: &[&str], start_index: usize) -> Option<(Node, usize)> {
    let first = read_markdown_list_item(lines[start_index])?;
    let kind = first.1;
    let mut items = Vec::new();
    let mut index = start_index;
    while index < lines.len() {
        let Some((level, item_kind, text)) = read_markdown_list_item(lines[index]) else {
            break;
        };
        if item_kind != kind {
            break;
        }
        items.push(format!("{}- {}", "  ".repeat(level), plain_text(text)));
        index += 1;
    }
    let mut attrs = BTreeMap::new();
    attrs.insert("kind".to_string(), kind.to_string());
    Some((
        Node::Block {
            name: "list".to_string(),
            attrs,
            text: items.join("\n"),
            position: None,
        },
        index,
    ))
}

fn read_markdown_list_item(line: &str) -> Option<(usize, &'static str, &str)> {
    let re = Regex::new(r"^( *)(?:([-*+])|(\d+[.)]))\s+(.+?)\s*$")
        .expect("markdown list regex compiles");
    let captures = re.captures(line)?;
    let level = captures.get(1).map_or("", |m| m.as_str()).len() / 2;
    let kind = if captures.get(3).is_some() {
        "ordered"
    } else {
        "unordered"
    };
    let text = captures.get(4).map_or("", |m| m.as_str());
    Some((level, kind, text))
}

fn read_table(lines: &[&str], start_index: usize) -> Option<(Node, usize)> {
    if start_index + 1 >= lines.len() {
        return None;
    }
    let header = split_markdown_table_row(lines[start_index]);
    let separators = split_markdown_table_row(lines[start_index + 1]);
    if header.is_empty()
        || header.len() != separators.len()
        || !separators.iter().all(|cell| is_table_separator(cell))
    {
        return None;
    }

    let mut rows = Vec::new();
    let mut index = start_index + 2;
    while index < lines.len() && !lines[index].trim().is_empty() {
        let cells = split_markdown_table_row(lines[index]);
        if cells.len() != header.len() {
            break;
        }
        rows.push(cells);
        index += 1;
    }

    let columns = header
        .iter()
        .map(|cell| escape_lessmark_table_cell(&plain_text(cell)))
        .collect::<Vec<_>>();
    let body = rows
        .iter()
        .map(|row| {
            row.iter()
                .map(|cell| escape_lessmark_table_cell(&plain_text(cell)))
                .collect::<Vec<_>>()
        })
        .collect::<Vec<_>>();
    if columns.iter().any(String::is_empty) || body.iter().flatten().any(String::is_empty) {
        return None;
    }

    let mut attrs = BTreeMap::new();
    attrs.insert("columns".to_string(), columns.join("|"));
    Some((
        Node::Block {
            name: "table".to_string(),
            attrs,
            text: body
                .iter()
                .map(|row| row.join("|"))
                .collect::<Vec<_>>()
                .join("\n"),
            position: None,
        },
        index,
    ))
}

fn split_markdown_table_row(line: &str) -> Vec<String> {
    let mut row = line.trim();
    if row.starts_with('|') {
        row = &row[1..];
    }
    if row.ends_with('|') && !row.ends_with(r"\|") {
        row = &row[..row.len() - 1];
    }
    split_table_row(row)
}

fn is_table_separator(cell: &str) -> bool {
    let re = Regex::new(r"^:?-{3,}:?$").expect("table separator regex compiles");
    re.is_match(cell.trim())
}

fn escape_lessmark_table_cell(cell: &str) -> String {
    cell.replace('\\', r"\\").replace('|', r"\|")
}

fn is_markdown_block_start(lines: &[&str], index: usize) -> bool {
    read_heading(lines[index]).is_some()
        || read_fence_line(lines[index]).is_some()
        || is_markdown_separator(lines[index])
        || read_task(lines[index]).is_some()
        || read_markdown_list_item(lines[index]).is_some()
        || read_image_line(lines[index]).is_some()
        || Regex::new(r"^\s*>\s?")
            .expect("blockquote regex compiles")
            .is_match(lines[index])
        || read_table(lines, index).is_some()
}

fn is_markdown_separator(line: &str) -> bool {
    let leading_spaces = line.chars().take_while(|char| *char == ' ').count();
    if leading_spaces > 3 {
        return false;
    }
    let rest = line[leading_spaces..].trim_end();
    let mut marker = None;
    let mut count = 0;
    for ch in rest.chars() {
        if ch.is_whitespace() {
            continue;
        }
        if !matches!(ch, '-' | '*' | '_') {
            return false;
        }
        match marker {
            Some(existing) if existing != ch => return false,
            None => marker = Some(ch),
            _ => {}
        }
        count += 1;
    }
    count >= 3
}

fn non_empty_or_image(value: &str) -> String {
    if value.is_empty() {
        "Image".to_string()
    } else {
        value.to_string()
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
