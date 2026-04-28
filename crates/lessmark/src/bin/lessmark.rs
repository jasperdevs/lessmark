use lessmark::{format_lessmark, from_markdown, parse_lessmark, to_markdown, validate_source};
use serde_json::json;
use std::env;
use std::fs;
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
            "commands": ["parse", "check", "format", "fix", "from-markdown", "to-markdown", "info"],
            "jsonCommands": ["check --json", "info --json"],
            "formatCheck": true,
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
        eprintln!("Usage: lessmark from-markdown <file.md>");
        return 1;
    };
    let source = match read_file(path) {
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
        eprintln!("Usage: lessmark to-markdown <file.lmk>");
        return 1;
    };
    let source = match read_file(path) {
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
    let Some(path) = first_path_arg(args) else {
        eprintln!("Usage: lessmark parse <file.lmk>");
        return 1;
    };
    let source = match read_file(path) {
        Ok(source) => source,
        Err(status) => return status,
    };
    match parse_lessmark(&source) {
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
        eprintln!("Usage: lessmark check [--json] <file.lmk>");
        return 1;
    };
    let source = match read_file(path) {
        Ok(source) => source,
        Err(status) => return status,
    };
    let errors = validate_source(&source);
    if json_output {
        println!(
            "{}",
            serde_json::to_string_pretty(&json!({ "ok": errors.is_empty(), "errors": errors }))
                .expect("check result serializes")
        );
    } else if errors.is_empty() {
        println!("{}: ok", path);
    } else {
        for error in &errors {
            if let (Some(line), Some(column)) = (error.line, error.column) {
                eprintln!("error: {} at {}:{}", error.message, line, column);
            } else {
                eprintln!("error: {}", error.message);
            }
        }
    }
    if errors.is_empty() {
        0
    } else {
        1
    }
}

fn format_command(args: &[String]) -> i32 {
    let write = args.iter().any(|arg| arg == "--write" || arg == "-w");
    let check = args.iter().any(|arg| arg == "--check");
    let Some(path) = first_path_arg(args) else {
        eprintln!("Usage: lessmark format [--write|--check] <file.lmk>");
        return 1;
    };
    let source = match read_file(path) {
        Ok(source) => source,
        Err(status) => return status,
    };
    match format_lessmark(&source) {
        Ok(formatted) => {
            if check {
                if formatted != source {
                    eprintln!("{}: needs formatting", path);
                    return 1;
                }
                println!("{}: formatted", path);
            } else if write {
                if let Err(error) = fs::write(path, formatted) {
                    eprintln!("Failed to write {}: {}", path, error);
                    return 1;
                }
            } else {
                print!("{}", formatted);
            }
            0
        }
        Err(error) => {
            eprintln!("lessmark: {}", error);
            1
        }
    }
}

fn read_file(path: &str) -> Result<String, i32> {
    fs::read_to_string(path).map_err(|error| {
        eprintln!("lessmark: Failed to read {}: {}", path, error);
        1
    })
}

fn first_path_arg(args: &[String]) -> Option<&str> {
    args.iter()
        .find(|arg| !arg.starts_with('-'))
        .map(String::as_str)
}

fn print_help() {
    eprintln!(
        "Usage: lessmark <parse|check|format|fix|from-markdown|to-markdown|info> [options] <file>"
    );
}
