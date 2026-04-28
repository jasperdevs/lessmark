use std::path::{Path, PathBuf};
use std::process::Command;
use std::{env, fs};

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

#[test]
fn cli_format_check_reports_formatting_status() {
    let temp = env::temp_dir().join(format!("lessmark-format-check-{}", std::process::id()));
    let _ = fs::remove_dir_all(&temp);
    fs::create_dir_all(&temp).expect("temp dir");
    let formatted = temp.join("formatted.lmk");
    let unformatted = temp.join("unformatted.lmk");
    fs::copy(
        repo_root().join("fixtures/valid/project-context.lmk"),
        &formatted,
    )
    .expect("copy fixture");
    fs::write(&unformatted, "@task todo\nDo it.\n").expect("write unformatted fixture");

    let ok_output = Command::new(lessmark_bin())
        .args(["format", "--check", formatted.to_str().expect("utf8 path")])
        .output()
        .expect("lessmark command runs");
    assert!(
        ok_output.status.success(),
        "{}",
        String::from_utf8_lossy(&ok_output.stderr)
    );
    assert!(String::from_utf8_lossy(&ok_output.stdout).contains("formatted"));

    let bad_output = Command::new(lessmark_bin())
        .args([
            "format",
            "--check",
            unformatted.to_str().expect("utf8 path"),
        ])
        .output()
        .expect("lessmark command runs");
    assert!(!bad_output.status.success());
    assert!(String::from_utf8_lossy(&bad_output.stderr).contains("needs formatting"));

    let _ = fs::remove_dir_all(&temp);
}

#[test]
fn cli_fix_is_formatter_alias() {
    let fixture = repo_root().join("fixtures/valid/project-context.lmk");
    let output = Command::new(lessmark_bin())
        .args(["fix", fixture.to_str().expect("utf8 path")])
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

#[test]
fn cli_converts_markdown_to_lessmark() {
    let fixture = repo_root().join("fixtures/valid/markdown-import.fixture");
    let output = Command::new(lessmark_bin())
        .args(["from-markdown", fixture.to_str().expect("utf8 path")])
        .output()
        .expect("lessmark command runs");
    assert!(
        output.status.success(),
        "{}",
        String::from_utf8_lossy(&output.stderr)
    );
    let converted = String::from_utf8(output.stdout).expect("stdout is utf8");
    assert!(converted.starts_with("# Imported Context"));
    assert!(converted.contains("Markdown import fixture."));
}

#[test]
fn cli_converts_lessmark_to_markdown() {
    let fixture = repo_root().join("fixtures/valid/project-context.lmk");
    let output = Command::new(lessmark_bin())
        .args(["to-markdown", fixture.to_str().expect("utf8 path")])
        .output()
        .expect("lessmark command runs");
    assert!(
        output.status.success(),
        "{}",
        String::from_utf8_lossy(&output.stderr)
    );
    let converted = String::from_utf8(output.stdout).expect("stdout is utf8");
    assert!(converted.starts_with("# Project Context"));
    assert!(converted.contains("- [ ] Add export settings."));
}
