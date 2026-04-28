pub mod ast;
pub mod error;
pub mod format;
pub mod grammar;
pub mod parser;
pub mod rules;
pub mod validate;

pub const AST_SCHEMA_V0: &str = include_str!("../schemas/ast-v0.schema.json");

pub use ast::{Document, Node, PositionPoint, PositionRange};
pub use error::{LessmarkError, ValidationError};
pub use format::{format_document, format_lessmark};
pub use parser::{parse_lessmark, parse_lessmark_with_positions};
pub use validate::{validate_document, validate_source, validate_value};
