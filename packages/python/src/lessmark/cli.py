import argparse
import json
import sys
from pathlib import Path

from .core import LessmarkError, ValidationError, format_lessmark, parse_lessmark, validate_source


def main(argv: list[str] | None = None) -> int:
    parser = argparse.ArgumentParser(prog="lessmark")
    subparsers = parser.add_subparsers(dest="command", required=True)

    parse_parser = subparsers.add_parser("parse")
    parse_parser.add_argument("file")

    check_parser = subparsers.add_parser("check")
    check_parser.add_argument("file")
    check_parser.add_argument("--json", action="store_true")

    format_parser = subparsers.add_parser("format")
    format_parser.add_argument("file")
    format_parser.add_argument("--write", action="store_true")

    args = parser.parse_args(argv)

    try:
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

        if args.command == "format":
            formatted = format_lessmark(source)
            if args.write:
                path.write_text(formatted, encoding="utf-8")
            else:
                print(formatted, end="")
            return 0

    except LessmarkError as error:
        if args.command == "check" and getattr(args, "json", False):
            print(json.dumps({"ok": False, "errors": [_json_error(error)]}, indent=2))
            return 1
        print(f"lessmark: {error}", file=sys.stderr)
        return 1

    raise AssertionError(f"Unhandled command: {args.command}")


def _json_error(error: LessmarkError) -> ValidationError:
    return {"message": error.message, "line": error.line, "column": error.column}


if __name__ == "__main__":
    raise SystemExit(main())
