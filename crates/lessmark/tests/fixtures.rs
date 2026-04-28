use lessmark::{
    format_lessmark, from_markdown, parse_lessmark, parse_lessmark_with_positions, to_markdown,
    validate_document, validate_source, validate_value,
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
fn rejects_invalid_docs_attrs() {
    let cases = [
        (
            "@table columns=\"Name|\"\nValue\n",
            "pipe-separated non-empty labels",
        ),
        (
            "@callout kind=\"custom\"\nNo custom callouts.\n",
            "@callout kind",
        ),
        (
            "@page output=\"../index.html\"\n",
            "safe relative .html path",
        ),
        (
            "@image src=\"javascript:alert(1)\" alt=\"Bad\"\n",
            "safe relative, http, or https URL",
        ),
    ];
    for (source, message) in cases {
        let error = parse_lessmark(source).expect_err("invalid docs attr rejects");
        assert!(error.message.contains(message), "{}", error.message);
    }
}

#[test]
fn validates_safe_links() {
    assert!(validate_source("@link href=\"docs/page.html\"\nInternal docs page.\n").is_empty());
    for source in [
        "@link href=\"javascript:alert(1)\"\nExecutable URL schemes are not allowed.\n",
        "@link href=\"//example.com\"\nAmbiguous host.\n",
        "@link href=\"../page.html\"\nParent traversal.\n",
    ] {
        let error = parse_lessmark(source).expect_err("unsafe link rejects");
        assert!(
            error.message.contains("safe relative path"),
            "{}",
            error.message
        );
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

#[test]
fn imports_markdown_code_fences_with_internal_blank_lines() {
    let lessmark = from_markdown("# Project\n\n```js\nconst a = 1;\n\nconst b = 2;\n```\n")
        .expect("markdown imports");
    assert!(validate_source(&lessmark).is_empty());
    let ast = parse_lessmark(&lessmark).expect("imported Lessmark parses");
    let json = serde_json::to_value(ast).expect("document serializes");
    assert_eq!(json["children"][1]["text"], "const a = 1;\n\nconst b = 2;");
}

#[test]
fn rejects_unclosed_markdown_code_fences() {
    let error = from_markdown("```js\nconst a = 1;\n").expect_err("unclosed fence rejects");
    assert!(error.message.contains("Unclosed fenced code block"));
}

#[test]
fn exports_lessmark_to_markdown() {
    let source = fs::read_to_string(repo_root().join("fixtures/valid/project-context.lmk"))
        .expect("fixture is readable");
    let markdown = to_markdown(&source).expect("exports markdown");
    assert!(markdown.starts_with("# Project Context"));
    assert!(markdown.contains("- [ ] Add export settings."));
}

#[test]
fn exports_docs_blocks_to_markdown() {
    let source = fs::read_to_string(repo_root().join("fixtures/valid/docs-page.lmk"))
        .expect("fixture is readable");
    let markdown = to_markdown(&source).expect("exports markdown");
    assert!(markdown.starts_with("# Docs"));
    assert!(markdown.contains("**explicit**"));
    assert!(markdown.contains("> [!TIP] No hooks by default"));
    assert!(markdown.contains("| Feature | Status |"));
    assert!(markdown.contains("![Build pipeline](assets/diagram.svg)"));
}
