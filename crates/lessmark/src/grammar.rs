use std::collections::{BTreeMap, BTreeSet};
use std::sync::LazyLock;

pub const CORE_BLOCK_NAMES: [&str; 14] = [
    "summary",
    "decision",
    "constraint",
    "task",
    "file",
    "code",
    "example",
    "note",
    "warning",
    "api",
    "link",
    "metadata",
    "risk",
    "depends-on",
];

pub const TASK_STATUSES: [&str; 4] = ["todo", "doing", "done", "blocked"];
pub const RISK_LEVELS: [&str; 4] = ["low", "medium", "high", "critical"];

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
        specs.insert("decision", spec(&["id"], &["id"]));
        specs.insert("constraint", spec(&[], &[]));
        specs.insert("task", spec(&["status"], &["status"]));
        specs.insert("file", spec(&["path"], &["path"]));
        specs.insert("code", spec(&["lang"], &[]));
        specs.insert("example", spec(&[], &[]));
        specs.insert("note", spec(&[], &[]));
        specs.insert("warning", spec(&[], &[]));
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
