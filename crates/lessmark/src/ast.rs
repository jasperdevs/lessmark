use serde::{Deserialize, Serialize};
use std::collections::BTreeMap;

#[derive(Debug, Clone, PartialEq, Eq, Serialize, Deserialize)]
pub struct Document {
    #[serde(rename = "type")]
    pub kind: String,
    pub children: Vec<Node>,
}

impl Document {
    pub fn new(children: Vec<Node>) -> Self {
        Self {
            kind: "document".to_string(),
            children,
        }
    }
}

#[derive(Debug, Clone, PartialEq, Eq, Serialize, Deserialize)]
pub struct PositionPoint {
    pub line: usize,
    pub column: usize,
}

#[derive(Debug, Clone, PartialEq, Eq, Serialize, Deserialize)]
pub struct PositionRange {
    pub start: PositionPoint,
    pub end: PositionPoint,
}

#[derive(Debug, Clone, PartialEq, Eq, Serialize, Deserialize)]
#[serde(tag = "type")]
pub enum Node {
    #[serde(rename = "heading")]
    Heading {
        level: u8,
        text: String,
        #[serde(skip_serializing_if = "Option::is_none")]
        position: Option<PositionRange>,
    },
    #[serde(rename = "block")]
    Block {
        name: String,
        attrs: BTreeMap<String, String>,
        text: String,
        #[serde(skip_serializing_if = "Option::is_none")]
        position: Option<PositionRange>,
    },
}
