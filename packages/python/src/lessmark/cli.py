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

        path = Path(args.file)
        source = path.read_text(encoding="utf-8")

        if args.command == "parse":
            print(json.dumps(parse_lessmark(source), indent=2))
            return 0

        if args.command == "check":
            errors = validate_source(source)
            if args.json:
                print(json.dumps({"ok": len(errors) == 0, "errors": errors}, indent=2))
                return 1 if errors else 0
            if errors:
                for error in errors:
                    print(f"error: {error['message']}", file=sys.stderr)
                return 1
            print(f"{path}: ok")
            return 0

        if args.command in {"format", "fix"}:
            formatted = format_lessmark(source)
            if args.check:
                if formatted != source:
                    print(f"{path}: needs formatting", file=sys.stderr)
                    return 1
                print(f"{path}: formatted")
            elif args.write:
                with path.open("w", encoding="utf-8", newline="\n") as file:
                    file.write(formatted)
            else:
                sys.stdout.write(formatted)
            return 0

        if args.command == "from-markdown":
            sys.stdout.write(from_markdown(source))
            return 0

        if args.command == "to-markdown":
            sys.stdout.write(to_markdown(source))
            return 0

    except (LessmarkError, ValueError) as error:
        if args.command == "check" and getattr(args, "json", False):
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


if __name__ == "__main__":
    raise SystemExit(main())
