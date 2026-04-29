use lessmark::{
    format_lessmark, from_markdown, parse_lessmark, parse_lessmark_with_positions, to_markdown,
    validate_source, ValidationError,
};
use serde_json::json;
use std::env;
use std::fs;
use std::io::{self, Read};
use std::path::{Path, PathBuf};
use std::process;

fn main() {
    let status = run(env::args().skip(1).collect());
    process::exit(status);
}

fn run(args: Vec<String>) -> i32 {
    if args.is_empty() || args.iter().any(|arg| arg == "--help" || arg == "-h") {
        print_help();
        return if args.is_empty() { 1 } else { 0 };
    }

    match args[0].as_str() {
        "parse" => parse_command(&args[1..]),
        "check" => check_command(&args[1..]),
        "format" | "fix" => format_command(&args[1..]),
        "from-markdown" => from_markdown_command(&args[1..]),
        "to-markdown" => to_markdown_command(&args[1..]),
        "init" => init_command(&args[1..]),
        "info" => info_command(&args[1..]),
        command => {
            eprintln!("Unknown command: {}", command);
            print_help();
            1
        }
    }
}

fn info_command(args: &[String]) -> i32 {
    let info = json!({
        "language": "lessmark",
        "version": env!("CARGO_PKG_VERSION"),
        "astVersion": "v0",
        "extensions": [".lmk", ".lessmark"],
        "mediaType": "text/vnd.lessmark; charset=utf-8",
        "blocks": [
            "summary",
            "page",
            "nav",
            "paragraph",
            "decision",
            "constraint",
            "task",
            "file",
            "code",
            "example",
            "quote",
            "callout",
            "list",
            "table",
            "image",
            "math",
            "diagram",
            "separator",
            "toc",
            "footnote",
            "definition",
            "reference",
            "api",
            "link",
            "metadata",
            "risk",
            "depends-on"
        ],
        "inlineFunctions": ["strong", "em", "code", "kbd", "del", "mark", "sup", "sub", "ref", "footnote", "link"],
        "enums": {
            "taskStatus": ["todo", "doing", "done", "blocked"],
            "riskLevel": ["low", "medium", "high", "critical"],
            "listKind": ["unordered", "ordered"],
            "calloutKind": ["note", "tip", "warning", "caution"],
            "mathNotation": ["tex", "asciimath"],
            "diagramKind": ["mermaid", "graphviz", "plantuml"]
        },
        "cli": {
            "commands": ["parse", "check", "format", "fix", "from-markdown", "to-markdown", "init", "info"],
            "jsonCommands": ["check --json", "format --check --json", "info --json"],
            "formatCheck": true,
            "sourcePositions": true,
            "stdin": true,
            "recursiveCheck": true,
            "recursiveFormat": true,
            "strictBuild": false
        },
        "renderer": {
            "html": false,
            "fullDocument": false,
            "staticSiteBuild": false,
            "strictLinkAssetCheck": false,
            "rawHtml": false
        },
        "syntaxPolicy": {
            "aliases": false,
            "plainParagraphs": true,
            "canonicalSource": true,
            "documentedConveniencesOnly": true,
            "maxSpellingsPerMeaning": 2,
            "blockAliases": {},
            "aliasAttrs": {},
            "shorthandAttrs": {
                "api": "name",
                "callout": "kind",
                "code": "lang",
                "diagram": "kind",
                "decision": "id",
                "definition": "term",
                "depends-on": "target",
                "file": "path",
                "footnote": "id",
                "link": "href",
                "list": "kind",
                "math": "notation",
                "metadata": "key",
                "reference": "target",
                "risk": "level",
                "table": "columns",
                "task": "status"
            },
            "literalBlocks": ["code", "example", "math", "diagram"],
            "literalBlockTermination": "blank-line-before-next-block",
            "markdownLegacySyntax": false,
            "rawHtml": false,
            "hooks": false,
            "customBlocks": false,
            "nestedLists": true
        }
    });
    if args.iter().any(|arg| arg == "--json") {
        println!(
            "{}",
            serde_json::to_string_pretty(&info).expect("info serializes")
        );
    } else {
        println!("Lessmark {}", env!("CARGO_PKG_VERSION"));
        println!(
            "Blocks: {}",
            info["blocks"]
                .as_array()
                .expect("blocks array")
                .iter()
                .map(|item| item.as_str().expect("block string"))
                .collect::<Vec<_>>()
                .join(", ")
        );
        println!(
            "Inline functions: {}",
            info["inlineFunctions"]
                .as_array()
                .expect("inline array")
                .iter()
                .map(|item| item.as_str().expect("inline string"))
                .collect::<Vec<_>>()
                .join(", ")
        );
    }
    0
}

fn from_markdown_command(args: &[String]) -> i32 {
    let Some(path) = first_path_arg(args) else {
        eprintln!("Usage: lessmark from-markdown <file.md|->");
        return 1;
    };
    let source = match read_input(path) {
        Ok(source) => source,
        Err(status) => return status,
    };
    match from_markdown(&source) {
        Ok(converted) => {
            print!("{}", converted);
            0
        }
        Err(error) => {
            eprintln!("lessmark: {}", error);
            1
        }
    }
}

fn to_markdown_command(args: &[String]) -> i32 {
    let Some(path) = first_path_arg(args) else {
        eprintln!("Usage: lessmark to-markdown <file.lmk|->");
        return 1;
    };
    let source = match read_input(path) {
        Ok(source) => source,
        Err(status) => return status,
    };
    match to_markdown(&source) {
        Ok(converted) => {
            print!("{}", converted);
            0
        }
        Err(error) => {
            eprintln!("lessmark: {}", error);
            1
        }
    }
}

fn parse_command(args: &[String]) -> i32 {
    let positions = args.iter().any(|arg| arg == "--positions");
    let Some(path) = first_path_arg(args) else {
        eprintln!("Usage: lessmark parse [--positions] <file.lmk|->");
        return 1;
    };
    let source = match read_input(path) {
        Ok(source) => source,
        Err(status) => return status,
    };
    let parsed = if positions {
        parse_lessmark_with_positions(&source)
    } else {
        parse_lessmark(&source)
    };
    match parsed {
        Ok(document) => {
            println!(
                "{}",
                serde_json::to_string_pretty(&document).expect("document serializes")
            );
            0
        }
        Err(error) => {
            eprintln!("lessmark: {}", error);
            1
        }
    }
}

fn check_command(args: &[String]) -> i32 {
    let json_output = args.iter().any(|arg| arg == "--json");
    let Some(path) = first_path_arg(args) else {
        eprintln!("Usage: lessmark check [--json] <file.lmk|dir|->");
        return 1;
    };
    let entries = match source_entries(path) {
        Ok(entries) => entries,
        Err(status) => return status,
    };
    let results = entries
        .iter()
        .map(|entry| CheckResult {
            file: entry.label.clone(),
            errors: validate_source(&entry.source),
        })
        .collect::<Vec<_>>();
    let ok = results.iter().all(CheckResult::ok);
    if json_output {
        let payload = if path != "-" && Path::new(path).is_dir() {
            json!({ "ok": ok, "files": results.iter().map(CheckResult::to_json).collect::<Vec<_>>() })
        } else {
            json!({ "ok": ok, "errors": results.first().map(|result| &result.errors).cloned().unwrap_or_default() })
        };
        println!(
            "{}",
            serde_json::to_string_pretty(&payload).expect("check result serializes")
        );
    } else {
        for result in &results {
            print_check_result(result);
        }
    }
    if ok {
        0
    } else {
        1
    }
}

fn format_command(args: &[String]) -> i32 {
    let write = args.iter().any(|arg| arg == "--write" || arg == "-w");
    let check = args.iter().any(|arg| arg == "--check");
    let json_output = args.iter().any(|arg| arg == "--json");
    let Some(path) = first_path_arg(args) else {
        eprintln!("Usage: lessmark format [--write|--check] [--json] <file.lmk|dir|->");
        return 1;
    };
    if write && path == "-" {
        eprintln!("lessmark: Cannot use --write with stdin");
        return 1;
    }
    if path != "-" && Path::new(path).is_dir() && !check && !write {
        eprintln!("lessmark: Directory formatting requires --check or --write");
        return 1;
    }
    let entries = match source_entries(path) {
        Ok(entries) => entries,
        Err(status) => return status,
    };
    let mut results = Vec::new();
    for entry in entries {
        let formatted = match format_lessmark(&entry.source) {
            Ok(formatted) => formatted,
            Err(error) => {
                eprintln!("lessmark: {}", error);
                return 1;
            }
        };
        let changed = formatted != entry.source;
        if write && changed {
            let Some(path) = entry.path.as_ref() else {
                eprintln!("lessmark: Cannot use --write with stdin");
                return 1;
            };
            if let Err(error) = fs::write(path, &formatted) {
                eprintln!("Failed to write {}: {}", path.display(), error);
                return 1;
            }
        }
        results.push(FormatResult {
            file: entry.label,
            changed,
            formatted,
        });
    }
    if check {
        let ok = results.iter().all(|result| !result.changed);
        if json_output {
            let payload = json!({
                "ok": ok,
                "files": results.iter().map(FormatResult::to_json).collect::<Vec<_>>()
            });
            println!(
                "{}",
                serde_json::to_string_pretty(&payload).expect("format result serializes")
            );
        } else {
            for result in &results {
                print_format_result(result);
            }
        }
        return if ok { 0 } else { 1 };
    }
    if write {
        for result in &results {
            if result.changed {
                println!("{}: formatted", result.file);
            }
        }
        return 0;
    }
    if let Some(result) = results.first() {
        print!("{}", result.formatted);
    }
    0
}

const INIT_DOCS_TEMPLATE: &str = r#"# Project docs

@page title="Project docs" output="index.html"

@summary
Replace this with a short description of the project.

## Next steps

@list kind="unordered"
- Run {{code:lessmark check docs}} before committing.
- Run {{code:lessmark format --check docs}} in CI.
- Add decisions, constraints, tasks, and source-file ownership as the project grows.
"#;

fn init_command(args: &[String]) -> i32 {
    let Some(target_dir) = first_path_arg(args) else {
        eprintln!("Usage: lessmark init <dir>");
        return 1;
    };
    let root = PathBuf::from(target_dir);
    let target = root.join("index.lmk");
    if target.exists() {
        eprintln!("lessmark: {} already exists", target.display());
        return 1;
    }
    if let Err(error) = fs::create_dir_all(&root) {
        eprintln!("lessmark: Failed to create {}: {}", root.display(), error);
        return 1;
    }
    if let Err(error) = fs::write(&target, INIT_DOCS_TEMPLATE) {
        eprintln!("lessmark: Failed to write {}: {}", target.display(), error);
        return 1;
    }
    println!("created {}", target.display());
    0
}

fn read_input(path: &str) -> Result<String, i32> {
    if path == "-" {
        let mut source = String::new();
        return io::stdin()
            .read_to_string(&mut source)
            .map(|_| source)
            .map_err(|error| {
                eprintln!("lessmark: Failed to read stdin: {}", error);
                1
            });
    }
    fs::read_to_string(path).map_err(|error| {
        eprintln!("lessmark: Failed to read {}: {}", path, error);
        1
    })
}

struct SourceEntry {
    label: String,
    path: Option<PathBuf>,
    source: String,
}

struct CheckResult {
    file: String,
    errors: Vec<ValidationError>,
}

impl CheckResult {
    fn ok(&self) -> bool {
        self.errors.is_empty()
    }

    fn to_json(&self) -> serde_json::Value {
        json!({ "file": self.file, "ok": self.ok(), "errors": self.errors })
    }
}

struct FormatResult {
    file: String,
    changed: bool,
    formatted: String,
}

impl FormatResult {
    fn to_json(&self) -> serde_json::Value {
        json!({ "file": self.file, "ok": !self.changed, "changed": self.changed })
    }
}

fn source_entries(path: &str) -> Result<Vec<SourceEntry>, i32> {
    if path == "-" {
        let source = read_input(path)?;
        return Ok(vec![SourceEntry {
            label: "<stdin>".to_string(),
            path: None,
            source,
        }]);
    }
    let path_buf = PathBuf::from(path);
    if path_buf.is_dir() {
        let files = match lessmark_files(&path_buf) {
            Ok(files) => files,
            Err(status) => return Err(status),
        };
        return files
            .into_iter()
            .map(|file| {
                let source = fs::read_to_string(&file).map_err(|error| {
                    eprintln!("lessmark: Failed to read {}: {}", file.display(), error);
                    1
                })?;
                Ok(SourceEntry {
                    label: file.display().to_string(),
                    path: Some(file),
                    source,
                })
            })
            .collect();
    }
    Ok(vec![SourceEntry {
        label: path.to_string(),
        path: Some(path_buf),
        source: read_input(path)?,
    }])
}

fn lessmark_files(root: &Path) -> Result<Vec<PathBuf>, i32> {
    let mut files = Vec::new();
    collect_lessmark_files(root, &mut files)?;
    files.sort();
    Ok(files)
}

fn collect_lessmark_files(path: &Path, files: &mut Vec<PathBuf>) -> Result<(), i32> {
    let entries = fs::read_dir(path).map_err(|error| {
        eprintln!("lessmark: Failed to read {}: {}", path.display(), error);
        1
    })?;
    for entry in entries {
        let entry = entry.map_err(|error| {
            eprintln!("lessmark: Failed to read directory entry: {}", error);
            1
        })?;
        let path = entry.path();
        let file_name = entry.file_name();
        let name = file_name.to_string_lossy();
        if path.is_dir() {
            if should_skip_dir(&name) {
                continue;
            }
            collect_lessmark_files(&path, files)?;
        } else if is_lessmark_file(&path) {
            files.push(path);
        }
    }
    Ok(())
}

fn should_skip_dir(name: &str) -> bool {
    name.starts_with('.') || matches!(name, "build" | "dist" | "node_modules" | "out" | "target")
}

fn is_lessmark_file(path: &Path) -> bool {
    matches!(
        path.extension().and_then(|ext| ext.to_str()).map(str::to_ascii_lowercase),
        Some(ext) if ext == "lmk" || ext == "lessmark"
    )
}

fn print_check_result(result: &CheckResult) {
    if result.errors.is_empty() {
        println!("{}: ok", result.file);
        return;
    }
    for error in &result.errors {
        if let (Some(line), Some(column)) = (error.line, error.column) {
            eprintln!(
                "{}: error: {} at {}:{}",
                result.file, error.message, line, column
            );
        } else {
            eprintln!("{}: error: {}", result.file, error.message);
        }
    }
}

fn print_format_result(result: &FormatResult) {
    if result.changed {
        eprintln!("{}: needs formatting", result.file);
    } else {
        println!("{}: formatted", result.file);
    }
}

fn first_path_arg(args: &[String]) -> Option<&str> {
    args.iter()
        .find(|arg| arg.as_str() == "-" || !arg.starts_with('-'))
        .map(String::as_str)
}

fn print_help() {
    eprintln!(
        "Usage: lessmark <parse|check|format|fix|from-markdown|to-markdown|init|info> [options] <file|dir|->\n  lessmark parse [--positions] <file.lmk|->"
    );
}
