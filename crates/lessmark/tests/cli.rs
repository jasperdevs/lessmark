use std::path::{Path, PathBuf};
use std::process::{Command, Stdio};
use std::{env, fs};

fn repo_root() -> PathBuf {
    Path::new(env!("CARGO_MANIFEST_DIR")).join("../..")
}

fn lessmark_bin() -> &'static str {
    env!("CARGO_BIN_EXE_lessmark")
}

fn run_with_input(args: &[&str], input: &str) -> std::process::Output {
    let mut child = Command::new(lessmark_bin())
        .args(args)
        .stdin(Stdio::piped())
        .stdout(Stdio::piped())
        .stderr(Stdio::piped())
        .spawn()
        .expect("lessmark command starts");
    use std::io::Write;
    child
        .stdin
        .as_mut()
        .expect("stdin available")
        .write_all(input.as_bytes())
        .expect("write stdin");
    child.wait_with_output().expect("lessmark command runs")
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
fn cli_info_text_hides_internal_ast_label() {
    let output = Command::new(lessmark_bin())
        .args(["info"])
        .output()
        .expect("lessmark info runs");
    assert!(
        output.status.success(),
        "{}",
        String::from_utf8_lossy(&output.stderr)
    );
    let stdout = String::from_utf8(output.stdout).expect("stdout is utf8");
    assert!(stdout.starts_with("Lessmark 0.1.5\n"));
    assert!(!stdout.contains("(v"));
    assert!(stdout.contains("Blocks: "));
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
        format!(
            "{}: error: @summary contains raw HTML/JSX-like syntax at 2:1\n",
            invalid.to_str().expect("utf8 path")
        )
    );
}

#[test]
fn cli_check_walks_lessmark_files_in_a_directory() {
    let temp = env::temp_dir().join(format!("lessmark-check-dir-{}", std::process::id()));
    let _ = fs::remove_dir_all(&temp);
    fs::create_dir_all(temp.join("nested")).expect("temp nested dir");
    fs::create_dir_all(temp.join("node_modules")).expect("temp ignored dir");
    fs::write(temp.join("valid.lmk"), "# Valid\n\nplain text\n").expect("write valid");
    fs::write(temp.join("nested/invalid.lessmark"), "<script></script>\n").expect("write invalid");
    fs::write(temp.join("node_modules/ignored.lmk"), "<script></script>\n").expect("write ignored");

    let output = Command::new(lessmark_bin())
        .args(["check", "--json", temp.to_str().expect("utf8 path")])
        .output()
        .expect("lessmark command runs");
    assert!(!output.status.success());
    let result: serde_json::Value =
        serde_json::from_slice(&output.stdout).expect("check output is json");
    assert_eq!(result["ok"], false);
    assert_eq!(result["files"].as_array().expect("files array").len(), 2);
    assert!(result["files"]
        .as_array()
        .expect("files array")
        .iter()
        .any(|file| file["ok"] == true));
    assert!(result["files"]
        .as_array()
        .expect("files array")
        .iter()
        .any(|file| file["ok"] == false));
    let _ = fs::remove_dir_all(&temp);
}

#[test]
fn cli_check_reads_stdin() {
    let output = run_with_input(&["check", "-"], "# From stdin\n");
    assert!(
        output.status.success(),
        "{}",
        String::from_utf8_lossy(&output.stderr)
    );
    assert_eq!(
        String::from_utf8(output.stdout).expect("stdout is utf8"),
        "<stdin>: ok\n"
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
fn cli_format_check_json_reports_directory_formatting() {
    let temp = env::temp_dir().join(format!("lessmark-format-json-{}", std::process::id()));
    let _ = fs::remove_dir_all(&temp);
    fs::create_dir_all(temp.join("nested")).expect("temp nested dir");
    fs::write(temp.join("formatted.lmk"), "# Ready\n").expect("write formatted");
    fs::write(temp.join("nested/unformatted.lmk"), "@task todo\nDo it.\n")
        .expect("write unformatted");

    let output = Command::new(lessmark_bin())
        .args([
            "format",
            "--check",
            "--json",
            temp.to_str().expect("utf8 path"),
        ])
        .output()
        .expect("lessmark command runs");
    assert!(!output.status.success());
    let result: serde_json::Value =
        serde_json::from_slice(&output.stdout).expect("format output is json");
    assert_eq!(result["ok"], false);
    assert_eq!(result["files"].as_array().expect("files array").len(), 2);
    assert!(result["files"]
        .as_array()
        .expect("files array")
        .iter()
        .any(|file| file["changed"] == true));
    let _ = fs::remove_dir_all(&temp);
}

#[test]
fn cli_fix_write_formats_a_directory() {
    let temp = env::temp_dir().join(format!("lessmark-fix-dir-{}", std::process::id()));
    let _ = fs::remove_dir_all(&temp);
    fs::create_dir_all(temp.join("nested")).expect("temp nested dir");
    let target = temp.join("nested/task.lmk");
    fs::write(&target, "@task todo\nDo it.\n").expect("write unformatted");

    let output = Command::new(lessmark_bin())
        .args(["fix", "--write", temp.to_str().expect("utf8 path")])
        .output()
        .expect("lessmark command runs");
    assert!(
        output.status.success(),
        "{}",
        String::from_utf8_lossy(&output.stderr)
    );
    assert!(String::from_utf8_lossy(&output.stdout).contains("formatted"));
    assert_eq!(
        fs::read_to_string(&target).expect("read target"),
        "@task status=\"todo\"\nDo it.\n"
    );
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
fn cli_parse_format_and_convert_inputs_read_stdin() {
    let parse = run_with_input(&["parse", "-"], "# From stdin\n");
    assert!(
        parse.status.success(),
        "{}",
        String::from_utf8_lossy(&parse.stderr)
    );
    let ast: serde_json::Value =
        serde_json::from_slice(&parse.stdout).expect("parse output is json");
    assert_eq!(ast["children"][0]["text"], "From stdin");

    let format = run_with_input(&["format", "-"], "@task todo\nDo it.\n");
    assert!(
        format.status.success(),
        "{}",
        String::from_utf8_lossy(&format.stderr)
    );
    assert!(String::from_utf8_lossy(&format.stdout).contains("@task status=\"todo\""));

    let from_markdown = run_with_input(&["from-markdown", "-"], "# Imported\n");
    assert!(
        from_markdown.status.success(),
        "{}",
        String::from_utf8_lossy(&from_markdown.stderr)
    );
    assert!(String::from_utf8_lossy(&from_markdown.stdout).contains("# Imported"));

    let to_markdown = run_with_input(&["to-markdown", "-"], "@task status=\"todo\"\nDo it.\n");
    assert!(
        to_markdown.status.success(),
        "{}",
        String::from_utf8_lossy(&to_markdown.stderr)
    );
    assert!(String::from_utf8_lossy(&to_markdown.stdout).contains("- [ ] Do it."));
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
