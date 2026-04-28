# Lessmark Media Type Draft

This is an IANA-ready draft for a vendor-tree Lessmark media type. It is not an official registration until submitted to and accepted by IANA.

## Registration Template

Type name: `text`

Subtype name: `vnd.lessmark`

Required parameters: none

Optional parameters: `charset`

Encoding considerations: 8bit. Lessmark files are UTF-8 text. Producers should emit LF line endings; consumers may accept CRLF and normalize to LF before parsing.

Security considerations: Lessmark is a non-executable text format. The v0 grammar rejects raw HTML, JSX-like tags, execution hooks, custom block syntax, undefined blocks, and undefined attributes. Link attributes are restricted to safe schemes. Implementations should still treat file paths and links as untrusted input and should not execute block contents.

Interoperability considerations: Lessmark v0 is line-oriented and parser-compatible across the Rust, JavaScript, and Python implementations in this repository. The stable interchange AST is JSON and is described by `schemas/ast-v0.schema.json`.

Published specification: `docs/spec.md`

Applications that use this media type: Lessmark parsers, validators, formatters, agent-context tooling, and documentation pipelines.

Fragment identifier considerations: No Lessmark-specific fragment identifier semantics are defined. Consumers may use application-defined fragment behavior.

Additional information:

- Deprecated alias names for this type: none
- Magic number(s): none
- File extension(s): `.lmk`, `.lessmark`
- Macintosh file type code(s): none

Person and email address to contact for further information: Jasper

Intended usage: COMMON

Restrictions on usage: none

Author: Jasper

Change controller: Jasper / jasperdevs

## Notes

`text/vnd.lessmark` is the realistic near-term registration because vendor-tree media types can be submitted directly to IANA for expert review. A future `text/lessmark` registration should wait until the format has broader standardization support.
