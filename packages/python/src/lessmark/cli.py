import argparse
import json
import sys
from pathlib import Path

from .core import LessmarkError, format_lessmark, parse_lessmark, validate_source


def main(argv: list[str] | None = None) -> int:
    parser = argparse.ArgumentParser(prog="lessmark")
    subparsers = parser.add_subparsers(dest="command", required=True)

    parse_parser = subparsers.add_parser("parse")
    parse_parser.add_argument("file")

    check_parser = subparsers.add_parser("check")
    check_parser.add_argument("file")

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
        print(f"lessmark: {error}", file=sys.stderr)
        return 1

    return 1


if __name__ == "__main__":
    raise SystemExit(main())