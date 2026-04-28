use lessmark::{
    format_lessmark, parse_lessmark, parse_lessmark_with_positions, validate_document,
    validate_value,
};
use serde_json::Value;
use std::fs;
use std::path::{Path, PathBuf};

fn repo_root() -> PathBuf {
    Path::new(env!("CARGO_MANIFEST_DIR")).join("../..")
}

#[test]
fn parses_all_valid_fixtures_to_stable_ast() {
    let fixtures = repo_root().join("fixtures/valid");
    for entry in fs::read_dir(&fixtures).expect("valid fixtures directory exists") {
        let path = entry.expect("valid fixture entry").path();
        if path.extension().and_then(|ext| ext.to_str()) != Some("lmk") {
            continue;
        }
        let source = fs::read_to_string(&path).expect("fixture is readable");
        let snapshot_path = path.with_extension("ast.json");
        let expected: Value = serde_json::from_str(
            &fs::read_to_string(&snapshot_path).expect("snapshot is readable"),
        )
        .expect("snapshot is valid json");
        let actual = serde_json::to_value(parse_lessmark(&source).expect("valid fixture parses"))
            .expect("document serializes");
        assert_eq!(actual, expected, "{}", path.display());
    }
}

#[test]
fn rejects_all_invalid_fixtures() {
    let fixtures = repo_root().join("fixtures/invalid");
    for entry in fs::read_dir(&fixtures).expect("invalid fixtures directory exists") {
        let path = entry.expect("invalid fixture entry").path();
        if path.extension().and_then(|ext| ext.to_str()) != Some("lmk") {
            continue;
        }
        let source = fs::read_to_string(&path).expect("fixture is readable");
        assert!(parse_lessmark(&source).is_err(), "{}", path.display());
    }
}

#[test]
fn formatter_is_idempotent() {
    let source = fs::read_to_string(repo_root().join("fixtures/valid/project-context.lmk"))
        .expect("fixture is readable");
    let once = format_lessmark(&source).expect("format once");
    let twice = format_lessmark(&once).expect("format twice");
    assert_eq!(once, twice);
}

#[test]
fn formatter_preserves_indented_example_text() {
    let source = fs::read_to_string(repo_root().join("fixtures/valid/example-code.lmk"))
        .expect("fixture is readable");
    assert_eq!(format_lessmark(&source).expect("format example"), source);
}

#[test]
fn can_include_source_positions_without_changing_default_ast() {
    let source = fs::read_to_string(repo_root().join("fixtures/valid/project-context.lmk"))
        .expect("fixture is readable");
    let plain = serde_json::to_value(parse_lessmark(&source).expect("valid fixture parses"))
        .expect("document serializes");
    let positioned = parse_lessmark_with_positions(&source).expect("valid fixture parses");
    let positioned_json = serde_json::to_value(&positioned).expect("document serializes");

    assert!(plain["children"][0].get("position").is_none());
    assert_eq!(
        positioned_json["children"][0]["position"]["start"]["line"],
        1
    );
    assert_eq!(
        positioned_json["children"][0]["position"]["end"]["column"],
        18
    );
    assert!(validate_document(&positioned).is_empty());
}

#[test]
fn validates_non_string_attrs_without_treating_present_values_as_missing() {
    let ast = serde_json::json!({
        "type": "document",
        "children": [
            { "type": "block", "name": "summary", "attrs": { "mood": 1 }, "text": "Bad custom attr." },
            { "type": "block", "name": "task", "attrs": { "status": 1 }, "text": "Bad status type." }
        ]
    });
    let errors: Vec<String> = validate_value(&ast)
        .into_iter()
        .map(|error| error.message)
        .collect();
    assert_eq!(
        errors,
        vec![
            "Attribute \"mood\" must be a string",
            "@summary does not allow attribute \"mood\"",
            "Attribute \"status\" must be a string",
        ]
    );
}
