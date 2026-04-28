use std::path::{Path, PathBuf};
use std::process::Command;

fn repo_root() -> PathBuf {
    Path::new(env!("CARGO_MANIFEST_DIR")).join("../..")
}

fn lessmark_bin() -> &'static str {
    env!("CARGO_BIN_EXE_lessmark")
}

#[test]
fn cli_parse_prints_document_ast() {
    let fixture = repo_root().join("fixtures/valid/project-context.lmk");
    let output = Command::new(lessmark_bin())
        .args(["parse", fixture.to_str().expect("utf8 path")])
        .output()
        .expect("lessmark command runs");
    assert!(
        output.status.success(),
        "{}",
        String::from_utf8_lossy(&output.stderr)
    );
    let ast: serde_json::Value =
        serde_json::from_slice(&output.stdout).expect("parse output is json");
    assert_eq!(ast["type"], "document");
    assert_eq!(ast["children"][0]["text"], "Project Context");
}

#[test]
fn cli_check_json_reports_parse_errors() {
    let fixture = repo_root().join("fixtures/invalid/raw-html.lmk");
    let output = Command::new(lessmark_bin())
        .args(["check", "--json", fixture.to_str().expect("utf8 path")])
        .output()
        .expect("lessmark command runs");
    assert!(!output.status.success());
    let result: serde_json::Value =
        serde_json::from_slice(&output.stdout).expect("check output is json");
    assert_eq!(result["ok"], false);
    assert!(result["errors"][0]["message"]
        .as_str()
        .unwrap()
        .contains("raw HTML"));
    assert_eq!(result["errors"][0]["line"], 2);
    assert_eq!(result["errors"][0]["column"], 1);
}

#[test]
fn cli_check_text_matches_public_contract() {
    let valid = repo_root().join("fixtures/valid/project-context.lmk");
    let valid_output = Command::new(lessmark_bin())
        .args(["check", valid.to_str().expect("utf8 path")])
        .output()
        .expect("lessmark command runs");
    assert!(valid_output.status.success());
    assert_eq!(
        String::from_utf8(valid_output.stdout).expect("stdout is utf8"),
        format!("{}: ok\n", valid.to_str().expect("utf8 path"))
    );

    let invalid = repo_root().join("fixtures/invalid/raw-html.lmk");
    let invalid_output = Command::new(lessmark_bin())
        .args(["check", invalid.to_str().expect("utf8 path")])
        .output()
        .expect("lessmark command runs");
    assert!(!invalid_output.status.success());
    assert_eq!(
        String::from_utf8(invalid_output.stdout).expect("stdout is utf8"),
        ""
    );
    assert_eq!(
        String::from_utf8(invalid_output.stderr).expect("stderr is utf8"),
        "error: @summary contains raw HTML/JSX-like syntax at 2:1\n"
    );
}

#[test]
fn cli_format_prints_normalized_source() {
    let fixture = repo_root().join("fixtures/valid/project-context.lmk");
    let output = Command::new(lessmark_bin())
        .args(["format", fixture.to_str().expect("utf8 path")])
        .output()
        .expect("lessmark command runs");
    assert!(
        output.status.success(),
        "{}",
        String::from_utf8_lossy(&output.stderr)
    );
    let formatted = String::from_utf8(output.stdout).expect("format output is utf8");
    assert!(formatted.starts_with("# Project Context"));
    assert!(formatted.contains("@task status=\"todo\""));
}
