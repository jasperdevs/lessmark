use std::collections::{BTreeMap, BTreeSet};
use std::sync::LazyLock;

pub const CORE_BLOCK_NAMES: [&str; 22] = [
    "summary",
    "page",
    "paragraph",
    "decision",
    "constraint",
    "task",
    "file",
    "code",
    "example",
    "note",
    "warning",
    "quote",
    "callout",
    "list",
    "table",
    "image",
    "toc",
    "api",
    "link",
    "metadata",
    "risk",
    "depends-on",
];

pub const TASK_STATUSES: [&str; 4] = ["todo", "doing", "done", "blocked"];
pub const RISK_LEVELS: [&str; 4] = ["low", "medium", "high", "critical"];
pub const LIST_KINDS: [&str; 2] = ["unordered", "ordered"];
pub const CALLOUT_KINDS: [&str; 4] = ["note", "tip", "warning", "caution"];

#[derive(Debug, Clone)]
pub struct BlockAttrSpec {
    pub allowed: BTreeSet<&'static str>,
    pub required: BTreeSet<&'static str>,
}

pub fn is_core_block(name: &str) -> bool {
    CORE_BLOCK_NAMES.contains(&name)
}

pub static BLOCK_ATTR_SPECS: LazyLock<BTreeMap<&'static str, BlockAttrSpec>> =
    LazyLock::new(|| {
        let mut specs = BTreeMap::new();
        specs.insert("summary", spec(&[], &[]));
        specs.insert("page", spec(&["title", "output"], &[]));
        specs.insert("paragraph", spec(&[], &[]));
        specs.insert("decision", spec(&["id"], &["id"]));
        specs.insert("constraint", spec(&[], &[]));
        specs.insert("task", spec(&["status"], &["status"]));
        specs.insert("file", spec(&["path"], &["path"]));
        specs.insert("code", spec(&["lang"], &[]));
        specs.insert("example", spec(&[], &[]));
        specs.insert("note", spec(&[], &[]));
        specs.insert("warning", spec(&[], &[]));
        specs.insert("quote", spec(&["cite"], &[]));
        specs.insert("callout", spec(&["kind", "title"], &["kind"]));
        specs.insert("list", spec(&["kind"], &["kind"]));
        specs.insert("table", spec(&["columns"], &["columns"]));
        specs.insert("image", spec(&["src", "alt", "caption"], &["src", "alt"]));
        specs.insert("toc", spec(&[], &[]));
        specs.insert("api", spec(&["name"], &["name"]));
        specs.insert("link", spec(&["href"], &["href"]));
        specs.insert("metadata", spec(&["key"], &["key"]));
        specs.insert("risk", spec(&["level"], &["level"]));
        specs.insert("depends-on", spec(&["target"], &["target"]));
        specs
    });

fn spec(allowed: &[&'static str], required: &[&'static str]) -> BlockAttrSpec {
    BlockAttrSpec {
        allowed: allowed.iter().copied().collect(),
        required: required.iter().copied().collect(),
    }
}
