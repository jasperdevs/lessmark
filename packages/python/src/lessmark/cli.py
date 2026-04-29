import argparse
import json
import sys
from pathlib import Path

from .core import (
    LessmarkError,
    ValidationError,
    error_code_for_message,
    format_lessmark,
    from_markdown,
    get_capabilities,
    parse_lessmark,
    to_markdown,
    validate_source,
)


def main(argv: list[str] | None = None) -> int:
    if hasattr(sys.stdout, "reconfigure"):
        sys.stdout.reconfigure(newline="\n")

    parser = argparse.ArgumentParser(prog="lessmark")
    subparsers = parser.add_subparsers(dest="command", required=True)

    parse_parser = subparsers.add_parser("parse")
    parse_parser.add_argument("file")

    check_parser = subparsers.add_parser("check")
    check_parser.add_argument("file")
    check_parser.add_argument("--json", action="store_true")

    format_parser = subparsers.add_parser("format", aliases=["fix"])
    format_parser.add_argument("file")
    format_parser.add_argument("--write", action="store_true")
    format_parser.add_argument("--check", action="store_true")
    format_parser.add_argument("--json", action="store_true")

    from_markdown_parser = subparsers.add_parser("from-markdown")
    from_markdown_parser.add_argument("file")

    to_markdown_parser = subparsers.add_parser("to-markdown")
    to_markdown_parser.add_argument("file")

    info_parser = subparsers.add_parser("info")
    info_parser.add_argument("--json", action="store_true")

    args = parser.parse_args(argv)

    try:
        if args.command == "info":
            info = get_capabilities()
            if args.json:
                print(json.dumps(info, indent=2))
            else:
                print(f"Lessmark {info['version']}")
                print(f"Blocks: {', '.join(info['blocks'])}")
                print(f"Inline functions: {', '.join(info['inlineFunctions'])}")
            return 0

        if args.command == "parse":
            source = _read_input(args.file)
            print(json.dumps(parse_lessmark(source), indent=2))
            return 0

        if args.command == "check":
            return _check_target(args.file, args.json)

        if args.command in {"format", "fix"}:
            return _format_target(args.file, args.check, args.write, args.json)

        if args.command == "from-markdown":
            source = _read_input(args.file)
            sys.stdout.write(from_markdown(source))
            return 0

        if args.command == "to-markdown":
            source = _read_input(args.file)
            sys.stdout.write(to_markdown(source))
            return 0

    except (LessmarkError, ValueError) as error:
        if args.command in {"check", "format", "fix"} and getattr(args, "json", False):
            errors = [_json_error(error)] if isinstance(error, LessmarkError) else [_message_error(str(error))]
            print(json.dumps({"ok": False, "errors": errors}, indent=2))
            return 1
        print(f"lessmark: {error}", file=sys.stderr)
        return 1

    raise AssertionError(f"Unhandled command: {args.command}")


def _json_error(error: LessmarkError) -> ValidationError:
    return {"code": error_code_for_message(error.message), "message": error.message, "line": error.line, "column": error.column}


def _message_error(message: str) -> ValidationError:
    return {"code": error_code_for_message(message), "message": message}


def _read_input(file: str) -> str:
    if file == "-":
        return sys.stdin.read()
    return Path(file).read_text(encoding="utf-8")


def _source_entries(file: str) -> list[tuple[str, Path | None, str]]:
    if file == "-":
        return [("<stdin>", None, sys.stdin.read())]
    path = Path(file)
    if path.is_dir():
        return [(str(item), item, item.read_text(encoding="utf-8")) for item in _lessmark_files(path)]
    return [(str(path), path, path.read_text(encoding="utf-8"))]


def _lessmark_files(root: Path) -> list[Path]:
    files: list[Path] = []
    for path in sorted(root.iterdir()):
        if path.is_dir():
            if _skip_dir(path.name):
                continue
            files.extend(_lessmark_files(path))
            continue
        if path.is_file() and path.suffix.lower() in {".lmk", ".lessmark"}:
            files.append(path)
    return files


def _skip_dir(name: str) -> bool:
    return name.startswith(".") or name in {"build", "dist", "node_modules", "out", "target"}


def _check_target(file: str, json_output: bool) -> int:
    entries = _source_entries(file)
    results = []
    ok = True
    for label, _path, source in entries:
        errors = validate_source(source)
        results.append({"file": label, "ok": not errors, "errors": errors})
        ok = ok and not errors

    is_directory = file != "-" and Path(file).is_dir()
    if json_output:
        payload: dict[str, object]
        if is_directory:
            payload = {"ok": ok, "files": results}
        else:
            payload = {"ok": ok, "errors": results[0]["errors"] if results else []}
        print(json.dumps(payload, indent=2))
    else:
        for result in results:
            _print_check_result(result)
    return 0 if ok else 1


def _print_check_result(result: dict[str, object]) -> None:
    if result["ok"]:
        print(f"{result['file']}: ok")
        return
    for error in result["errors"]:  # type: ignore[index]
        line = error.get("line")
        column = error.get("column")
        suffix = f" at {line}:{column}" if line is not None and column is not None else ""
        print(f"{result['file']}: error: {error['message']}{suffix}", file=sys.stderr)


def _format_target(file: str, check: bool, write: bool, json_output: bool) -> int:
    if write and file == "-":
        raise ValueError("Cannot use --write with stdin")
    path = Path(file) if file != "-" else None
    if path is not None and path.is_dir() and not check and not write:
        raise ValueError("Directory formatting requires --check or --write")

    entries = _source_entries(file)
    results = []
    ok = True
    for label, path, source in entries:
        formatted = format_lessmark(source)
        changed = formatted != source
        if write and path is not None and changed:
            with path.open("w", encoding="utf-8", newline="\n") as output:
                output.write(formatted)
        results.append({"file": label, "ok": not changed, "changed": changed, "formatted": formatted})
        if check and changed:
            ok = False

    if check:
        if json_output:
            print(json.dumps({"ok": ok, "files": [{key: item[key] for key in ("file", "ok", "changed")} for item in results]}, indent=2))
        else:
            for result in results:
                _print_format_result(result)
        return 0 if ok else 1

    if write:
        for result in results:
            if result["changed"]:
                print(f"{result['file']}: formatted")
        return 0

    sys.stdout.write(results[0]["formatted"] if results else "")
    return 0


def _print_format_result(result: dict[str, object]) -> None:
    if result["changed"]:
        print(f"{result['file']}: needs formatting", file=sys.stderr)
    else:
        print(f"{result['file']}: formatted")


if __name__ == "__main__":
    raise SystemExit(main())
