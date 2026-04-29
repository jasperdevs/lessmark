use lessmark::{
    format_lessmark, from_markdown, parse_lessmark, parse_lessmark_with_positions, to_markdown,
    validate_document, validate_source, validate_value,
};
use serde_json::Value;
use std::fs;
use std::path::{Path, PathBuf};
use std::process::Command;

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
        (
            "@nav label=\"Docs\" href=\"javascript:alert(1)\"\n",
            "safe relative path",
        ),
        (
            "@nav label=\"Docs\" href=\"index.html\" slot=\"sidebar\"\n",
            "primary or footer",
        ),
        (
            "@nav label=\"Docs\" href=\"index.html\" slot=\"\"\n",
            "primary or footer",
        ),
        ("@math notation=\"mathml\"\nE = mc^2\n", "tex, asciimath"),
        (
            "@diagram kind=\"unknown\"\ngraph TD\n",
            "mermaid, graphviz, plantuml",
        ),
        ("@separator style=\"thin\"\n", "does not allow attribute"),
        (
            "@reference target=\"../secret\"\nBad target.\n",
            "lowercase slug",
        ),
        (
            "@reference target=\"missing-section\"\nBad target.\n",
            "Unknown local reference target",
        ),
        ("@definition term=\"Term<T>\"\nBad term.\n", "raw HTML"),
        (
            "@table columns=\"Feature|Status\"\nOnly one cell\n",
            "row cell count",
        ),
        (
            "@list kind=\"unordered\"\n- Parent\n    - Child\n",
            "skip levels",
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
fn validation_errors_include_stable_codes() {
    let errors = validate_source("@summary\nDo not use <script>alert(1)</script> here.\n");
    assert_eq!(errors[0].code, "raw_html");
    assert_eq!(
        errors[0].message,
        "@summary contains raw HTML/JSX-like syntax"
    );
    assert_eq!(errors[0].line, Some(2));
    assert_eq!(errors[0].column, Some(1));
}

#[test]
fn rejects_raw_comments_doctypes_and_expression_like_prose() {
    for source in [
        "<!-- hidden -->\n",
        "<!doctype html>\n",
        "{component}\n",
        "{a+b}\n",
        "{foo()}\n",
        "{...props}\n",
        "${value}\n",
        "@link href=\"{target}\"\nBad href.\n",
    ] {
        let error = parse_lessmark(source).expect_err("raw syntax should reject");
        assert!(
            error.message.contains("raw HTML") || error.message.contains("raw expression"),
            "{}",
            error.message
        );
        assert!(!validate_source(source).is_empty());
    }
    let document = parse_lessmark("@code js\nconst options = {enabled: true};\n")
        .expect("literal code parses");
    let value = serde_json::to_value(document).expect("document serializes");
    assert_eq!(
        value["children"][0]["text"],
        "const options = {enabled: true};"
    );
}

#[test]
fn caps_deeply_nested_inline_validation() {
    let nested = format!("{}x{}", "{{strong:".repeat(140), "}}".repeat(140));
    let errors = validate_source(&format!("{}\n", nested));
    assert_eq!(errors[0].code, "inline_nesting_too_deep");
}

#[test]
fn parses_and_validates_agent_skill_metadata() {
    let source = "@skill name=\"code-review\" description=\"Review code when the user asks for bugs and regressions.\"\n\nSkill instructions.\n";
    let ast = parse_lessmark(source).expect("skill parses");
    let json = serde_json::to_value(ast).expect("skill serializes");
    assert_eq!(json["children"][0]["name"], "skill");
    assert_eq!(json["children"][0]["attrs"]["name"], "code-review");
    assert!(validate_source(source).is_empty());
    assert!(
        parse_lessmark("@skill name=\"Bad--Name\" description=\"Bad.\"\n")
            .expect_err("bad skill name rejects")
            .message
            .contains("@skill name")
    );
}

#[test]
fn cli_info_json_prints_machine_readable_capabilities() {
    let output = Command::new(env!("CARGO_BIN_EXE_lessmark"))
        .args(["info", "--json"])
        .output()
        .expect("lessmark info runs");
    assert!(output.status.success());
    let info: Value = serde_json::from_slice(&output.stdout).expect("info json parses");
    assert_eq!(info["language"], "lessmark");
    assert_eq!(info["astVersion"], "v0");
    assert_eq!(info["syntaxPolicy"]["aliases"], false);
    assert_eq!(info["cli"]["strictBuild"], false);
    assert_eq!(info["cli"]["formatCheck"], true);
    assert_eq!(info["cli"]["sourcePositions"], true);
    assert!(info["cli"]["commands"]
        .as_array()
        .expect("commands")
        .iter()
        .any(|command| command == "init"));
    assert!(info["blocks"]
        .as_array()
        .expect("blocks")
        .contains(&Value::String("summary".into())));
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
fn canonicalizes_documented_human_authoring_conveniences() {
    let source = r#"# Project Context

Use **bold**, *emphasis*, `code`, `**literal**`, [Docs](https://example.com), [Decision](#storage-backend), [^note], ==marked==, and ~~gone~~.

@list unordered
- One
- Two

@list ordered
- First
- Second

@decision storage-backend
Use SQLite.

@task todo
Add docs.

@risk high
Migration risk.

@file src/app.ts
Owns app.

@api parseLessmark
Parser API.

@code ts
const ok = true;

@math tex
E = mc^2

@diagram mermaid
graph TD
  A --> B

@callout warning
Watch this.

@definition API
Application programming interface.

@table Name|Value
Stage|alpha

@separator

@metadata project.stage
alpha

@link https://example.com
Homepage.

@footnote note
Footnote body.
"#;
    let formatted = format_lessmark(source).expect("authoring conveniences format");
    assert!(formatted.contains("Use {{strong:bold}}, {{em:emphasis}}, {{code:code}}, {{code:**literal**}}, {{link:Docs|https://example.com}}, {{ref:Decision|storage-backend}}, {{footnote:note}}, {{mark:marked}}, and {{del:gone}}."));
    assert!(formatted.contains("@list kind=\"unordered\"\n- One\n- Two"));
    assert!(formatted.contains("@list kind=\"ordered\"\n- First\n- Second"));
    assert!(formatted.contains("@decision id=\"storage-backend\""));
    assert!(formatted.contains("@task status=\"todo\""));
    assert!(formatted.contains("@risk level=\"high\""));
    assert!(formatted.contains("@file path=\"src/app.ts\""));
    assert!(formatted.contains("@api name=\"parseLessmark\""));
    assert!(formatted.contains("@code lang=\"ts\"\nconst ok = true;"));
    assert!(formatted.contains("@math notation=\"tex\"\nE = mc^2"));
    assert!(formatted.contains("@diagram kind=\"mermaid\"\ngraph TD\n  A --> B"));
    assert!(formatted.contains("@callout kind=\"warning\"\nWatch this."));
    assert!(formatted.contains("@definition term=\"API\"\nApplication programming interface."));
    assert!(formatted.contains("@table columns=\"Name|Value\"\nStage|alpha"));
    assert!(formatted.contains("@separator"));
    assert!(formatted.contains("@metadata key=\"project.stage\""));
    assert!(formatted.contains("@link href=\"https://example.com\""));
    assert!(formatted.contains("@footnote id=\"note\""));
    assert!(validate_source(&formatted).is_empty());
}

#[test]
fn ignores_leading_blank_lines_inside_body_capable_blocks() {
    let source = "@task done\n\nhey\n\n@metadata rfc.id\n\nRFC-0042\n";
    assert_eq!(
        format_lessmark(source).expect("leading blank body formats"),
        "@task status=\"done\"\nhey\n\n@metadata key=\"rfc.id\"\nRFC-0042\n"
    );
}

#[test]
fn supports_strict_nested_lists() {
    let source = "@list kind=\"unordered\"\n- Parent\n  - Child\n- Sibling\n";
    assert!(validate_source(source).is_empty());
    assert!(format_lessmark(source)
        .expect("nested list formats")
        .contains("  - Child"));
    assert!(
        to_markdown("@list kind=\"ordered\"\n- Parent\n  - Child\n- Sibling\n")
            .expect("exports nested list")
            .contains("1. Parent\n  1. Child\n2. Sibling")
    );
}

#[test]
fn rejects_overly_deep_lists_before_rendering() {
    let source = format!("@list unordered\n{}- too deep\n", "  ".repeat(129));
    let error = parse_lessmark(&source).expect_err("deep list rejects");
    assert!(
        error.message.contains("too deep") || error.message.contains("must start"),
        "{}",
        error.message
    );
    assert!(!validate_source(&source).is_empty());
}

#[test]
fn supports_escaped_pipes_in_table_columns() {
    let source = "@table columns=\"Name\\|Alias|Status\"\nLessmark\\|lmk|done\n";
    assert!(validate_source(source).is_empty());
    assert!(to_markdown(source)
        .expect("exports table")
        .contains("| Name\\|Alias | Status |"));
}

#[test]
fn supports_empty_table_cells() {
    let source = "@table columns=\"Name|Status\"\nLessmark|\n|todo\n";
    assert!(validate_source(source).is_empty());
}

#[test]
fn plain_top_level_prose_parses_as_paragraphs() {
    let document = parse_lessmark("yo\nwant sup\n\nnah\n").expect("plain prose parses");
    let value = serde_json::to_value(document).expect("document serializes");
    assert_eq!(value["children"][0]["name"], "paragraph");
    assert_eq!(value["children"][0]["text"], "yo\nwant sup");
    assert_eq!(value["children"][1]["name"], "paragraph");
    assert_eq!(value["children"][1]["text"], "nah");
    assert_eq!(
        format_lessmark("yo\n\nnah\n").expect("plain paragraph formats"),
        "yo\n\nnah\n"
    );
}

#[test]
fn rejects_removed_block_aliases_to_keep_syntax_one_way() {
    for alias in ["@p", "@ul", "@ol", "@note", "@warning"] {
        let source = format!("{}\nbody\n", alias);
        assert!(parse_lessmark(&source)
            .expect_err("removed alias should fail")
            .message
            .contains("Unknown typed block"));
    }
    let errors = validate_source("@paragraph\nbody\n");
    assert_eq!(errors[0].code, "unsupported_source_syntax");
    assert!(parse_lessmark("@paragraph\nbody\n")
        .expect_err("explicit paragraph block should fail")
        .message
        .contains("Plain prose"));
}

#[test]
fn supports_escaped_leading_block_sigils_inside_prose() {
    let document = parse_lessmark("\\@todo\n\\#internal-note\n").expect("escaped sigils parse");
    let value = serde_json::to_value(document).expect("document serializes");
    assert_eq!(value["children"][0]["name"], "paragraph");
    assert_eq!(value["children"][0]["text"], "@todo\n#internal-note");

    let source = "\\@todo\n\\#internal-note\n\n@summary\n\\@not-a-block\n\\#not-a-heading\n";
    let formatted = format_lessmark(source).expect("escaped sigils format");
    assert_eq!(formatted, source);
    assert_eq!(
        serde_json::to_value(parse_lessmark(&formatted).expect("formatted parses")).unwrap(),
        serde_json::to_value(parse_lessmark(source).expect("source parses")).unwrap()
    );
}

#[test]
fn rejects_legacy_markdown_block_syntax_inside_lessmark_prose() {
    for source in [
        "[docs]: https://example.com\n",
        "---\n",
        "===\n",
        "-*- \n",
        "> quoted text\n",
        "- item\n",
        "* item\n",
        "+ item\n",
        "1. item\n",
        "1) item\n",
    ] {
        let errors = validate_source(source);
        assert_eq!(errors[0].code, "markdown_legacy_syntax");
        assert!(parse_lessmark(source)
            .expect_err("legacy Markdown syntax rejects")
            .message
            .contains("Markdown"));
    }
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
fn rejects_duplicate_local_anchor_slugs_on_direct_ast_input() {
    let ast = serde_json::json!({
        "type": "document",
        "children": [
            { "type": "heading", "level": 1, "text": "Build System" },
            { "type": "block", "name": "decision", "attrs": { "id": "build-system" }, "text": "Collision." }
        ]
    });
    let errors: Vec<String> = validate_value(&ast)
        .into_iter()
        .map(|error| error.message)
        .collect();
    assert_eq!(errors, vec!["Duplicate local anchor slug \"build-system\""]);

    let rendered_footnote_ast = serde_json::json!({
        "type": "document",
        "children": [
            { "type": "heading", "level": 1, "text": "Fn Build System" },
            { "type": "block", "name": "footnote", "attrs": { "id": "build-system" }, "text": "Collision." }
        ]
    });
    let rendered_footnote_errors: Vec<String> = validate_value(&rendered_footnote_ast)
        .into_iter()
        .map(|error| error.message)
        .collect();
    assert_eq!(
        rendered_footnote_errors,
        vec!["Duplicate local anchor slug \"fn-build-system\""]
    );
}

#[test]
fn rejects_unknown_local_reference_targets_on_direct_ast_input() {
    let ast = serde_json::json!({
        "type": "document",
        "children": [
            { "type": "heading", "level": 1, "text": "Build System" },
            { "type": "block", "name": "reference", "attrs": { "target": "missing-section" }, "text": "Bad target." }
        ]
    });
    let errors: Vec<String> = validate_value(&ast)
        .into_iter()
        .map(|error| error.message)
        .collect();
    assert_eq!(
        errors,
        vec!["Unknown local reference target \"missing-section\""]
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
fn imports_markdown_code_fences_without_padding_first_column_block_sigils() {
    let lessmark =
        from_markdown("```py\n@decorator\ndef f(): pass\n```\n\n```c\n#include <stdio.h>\n```\n")
            .expect("markdown imports");
    let ast = parse_lessmark(&lessmark).expect("imported Lessmark parses");
    let json = serde_json::to_value(ast).expect("document serializes");
    assert_eq!(json["children"][0]["text"], "@decorator\ndef f(): pass");
    assert_eq!(json["children"][1]["text"], "#include <stdio.h>");
}

#[test]
fn imports_common_gfm_blocks_into_typed_lessmark_blocks() {
    let lessmark = from_markdown(
        "# Project\n\n\
![Build pipeline](assets/diagram.svg \"Pipeline\")\n\n\
> [!WARNING] Migration\n\
> Check imported content.\n\n\
> Keep source safe.\n\
> Preserve the quote.\n\n\
| Feature | Status |\n\
| --- | --- |\n\
| Images | done |\n\
| Tables \\| escaped | done |\n\n\
---\n",
    )
    .expect("markdown imports");
    assert!(lessmark
        .contains("@image alt=\"Build pipeline\" caption=\"Pipeline\" src=\"assets/diagram.svg\""));
    assert!(
        lessmark.contains("@callout kind=\"warning\" title=\"Migration\"\nCheck imported content.")
    );
    assert!(lessmark.contains("@quote\nKeep source safe.\nPreserve the quote."));
    assert!(lessmark.contains("@table columns=\"Feature|Status\""));
    assert!(lessmark.contains(r"Tables \| escaped|done"));
    assert!(lessmark.contains("@separator"));
    assert!(validate_source(&lessmark).is_empty());
}

#[test]
fn imports_markdown_prose_as_paragraphs() {
    assert_eq!(
        from_markdown("para one\n\npara two\n").expect("imports prose"),
        "para one\n\npara two\n"
    );
}

#[test]
fn imports_normal_markdown_lists() {
    let unordered = from_markdown("- Parent\n  - Child\n- Sibling\n").expect("imports unordered");
    assert!(unordered.contains("@list kind=\"unordered\"\n- Parent\n  - Child\n- Sibling"));
    let ordered = from_markdown("1. First\n   1. Child\n2. Second\n").expect("imports ordered");
    assert!(ordered.contains("@list kind=\"ordered\"\n- First\n  - Child\n- Second"));
    assert!(from_markdown("- One\n* Two\n")
        .expect_err("mixed unordered markers reject")
        .message
        .contains("Mixed Markdown list markers"));
    assert!(from_markdown("1. One\n2) Two\n")
        .expect_err("mixed ordered markers reject")
        .message
        .contains("Mixed Markdown list markers"));
}

#[test]
fn imports_safe_relative_standalone_markdown_links() {
    assert_eq!(
        from_markdown("[Guide](docs/guide.html)\n").expect("imports relative link"),
        "@link href=\"docs/guide.html\"\nGuide\n"
    );
}

#[test]
fn imports_and_exports_math_and_diagram_blocks() {
    let lessmark = from_markdown("$$\nE = mc^2\n$$\n\n```mermaid\ngraph TD\n  A --> B\n```\n")
        .expect("imports math and diagram");
    assert!(lessmark.contains("@math notation=\"tex\"\nE = mc^2"));
    assert!(lessmark.contains("@diagram kind=\"mermaid\"\ngraph TD\n  A --> B"));
    assert!(validate_source(&lessmark).is_empty());
    assert_eq!(
        to_markdown("@math notation=\"tex\"\nE = mc^2\n").expect("exports math"),
        "$$\nE = mc^2\n$$\n"
    );
    assert_eq!(
        to_markdown("@diagram kind=\"mermaid\"\ngraph TD\n  A --> B\n").expect("exports diagram"),
        "```mermaid\ngraph TD\n  A --> B\n```\n"
    );
}

#[test]
fn keeps_math_and_diagram_bodies_literal() {
    assert_eq!(
        format_lessmark("@math notation=\"tex\"\n**not bold**\n").expect("formats math"),
        "@math notation=\"tex\"\n**not bold**\n"
    );
    assert_eq!(
        format_lessmark("@diagram kind=\"mermaid\"\nA[**literal**] --> B\n")
            .expect("formats diagram"),
        "@diagram kind=\"mermaid\"\nA[**literal**] --> B\n"
    );
}

#[test]
fn literal_blocks_keep_first_column_block_sigils_until_blank_separator() {
    let source = "@code lang=\"py\"\n@decorator\ndef f():\n  pass\n\n@code lang=\"c\"\n#include <stdio.h>\nint main() { return 0; }\n";
    let ast = parse_lessmark(source).expect("literal block parses");
    let json = serde_json::to_value(ast).expect("document serializes");
    assert_eq!(json["children"].as_array().expect("children").len(), 2);
    assert_eq!(json["children"][0]["text"], "@decorator\ndef f():\n  pass");
    assert_eq!(
        json["children"][1]["text"],
        "#include <stdio.h>\nint main() { return 0; }"
    );
    assert_eq!(format_lessmark(source).expect("literal formats"), source);
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
    assert_eq!(
        to_markdown("@separator\n").expect("exports separator"),
        "---\n"
    );
}

#[test]
fn exports_docs_blocks_to_markdown() {
    let source = fs::read_to_string(repo_root().join("fixtures/valid/docs-page.lmk"))
        .expect("fixture is readable");
    let markdown = to_markdown(&source).expect("exports markdown");
    assert!(markdown.contains("# Docs Home"));
    assert!(markdown.contains("**explicit**"));
    assert!(markdown.contains("==marked text=="));
    assert!(markdown.contains("[^strict-syntax]: Lessmark keeps one explicit spelling"));
    assert!(markdown.contains("### renderer-contract"));
    assert!(markdown.contains("**Build system**"));
    assert!(markdown.contains("[Build system section](#build-system)"));
    assert!(markdown.contains("[Renderer contract decision](#renderer-contract)"));
    assert!(markdown.contains("[Strict syntax footnote](#fn-strict-syntax)"));
    assert!(markdown.contains("- [Home](index.html)"));
    assert!(markdown.contains("- [API](api.html)"));
    assert!(markdown.contains("> [!TIP] No hooks by default"));
    assert!(markdown.contains("| Feature | Status |"));
    assert!(markdown.contains("| Typed blocks\\|agents | done |"));
    assert!(markdown.contains("![Build pipeline](assets/diagram.svg)"));
    assert_eq!(
        to_markdown("@separator\n").expect("exports separator"),
        "---\n"
    );
}

#[test]
fn rejects_unresolved_inline_local_targets() {
    let ref_errors = validate_source("{{ref:Missing|missing-target}}\n");
    assert_eq!(ref_errors[0].code, "unknown_inline_target");
    assert!(ref_errors[0].message.contains("missing-target"));

    let footnote_errors = validate_source("{{footnote:missing-note}}\n");
    assert_eq!(footnote_errors[0].code, "unknown_inline_target");
    assert!(footnote_errors[0].message.contains("missing-note"));

    parse_lessmark(
        "@decision id=\"known-target\"\nDone.\n\n\
         {{ref:Known|known-target}}\n\n\
         @footnote id=\"known-note\"\nA note.\n\n\
         {{footnote:known-note}}\n",
    )
    .expect("known inline local targets parse");
}

#[test]
fn rejects_invalid_inline_local_targets_during_markdown_export() {
    for source in [
        "{{ref:Build|Build System}}\n",
        "{{footnote:}}\n",
        "# {{ref:Build|Build System}}\n",
    ] {
        let error = to_markdown(source).expect_err("invalid inline target rejects");
        assert!(
            error.message.contains("lowercase slug"),
            "{}",
            error.message
        );
    }
    for source in [
        "{{ref:Build| build-system}}\n",
        "@callout kind=\"note\" title=\"{{footnote: strict-syntax}}\"\nBody.\n",
    ] {
        let error = to_markdown(source).expect_err("unknown inline target rejects");
        assert!(
            error.message.contains("Unknown inline local target"),
            "{}",
            error.message
        );
    }
}

#[test]
fn exports_literal_code_and_example_inline_syntax() {
    let code = to_markdown("@code\n{{ref:Build|Build System}}\n").expect("exports code");
    assert!(code.contains("{{ref:Build|Build System}}"));
    let example = to_markdown("@example\n{{footnote: bad id}}\n").expect("exports example");
    assert!(example.contains("{{footnote: bad id}}"));
}
