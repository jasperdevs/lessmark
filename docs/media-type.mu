# Lessmark Media Type Draft

@paragraph
This is an IANA-ready draft for a vendor-tree Lessmark media type. It is not an official registration until submitted to and accepted by IANA.

## Registration Template

@paragraph
Type name: text

@paragraph
Subtype name: vnd.lessmark

@paragraph
Required parameters: none

@paragraph
Optional parameters: charset

@paragraph
Encoding considerations: 8bit. Lessmark files are UTF-8 text. Producers should emit LF line endings; consumers may accept CRLF and normalize to LF before parsing.

@paragraph
Security considerations: Lessmark is a non-executable text format. The v0 grammar rejects raw HTML, JSX-like tags, execution hooks, custom block syntax, undefined blocks, and undefined attributes. Link attributes are restricted to safe schemes. Implementations should still treat file paths and links as untrusted input and should not execute block contents.

@paragraph
Interoperability considerations: Lessmark v0 is line-oriented and parser-compatible across the Rust, JavaScript, and Python implementations in this repository. The stable interchange AST is JSON and is described by schemas/ast-v0.schema.json.

@paragraph
Published specification: docs/spec.mu

@paragraph
Applications that use this media type: Lessmark parsers, validators, formatters, agent-context tooling, and documentation pipelines.

@paragraph
Fragment identifier considerations: No Lessmark-specific fragment identifier semantics are defined. Consumers may use application-defined fragment behavior.

@paragraph
Additional information:

@list kind="unordered"
- Deprecated alias names for this type: none
- Magic number(s): none
- File extension(s): .mu, .lessmark
- Macintosh file type code(s): none

@paragraph
Person and email address to contact for further information: Jasper

@paragraph
Intended usage: COMMON

@paragraph
Restrictions on usage: none

@paragraph
Author: Jasper

@paragraph
Change controller: Jasper / jasperdevs

## Notes

@paragraph
text/vnd.lessmark is the realistic near-term registration because vendor-tree media types can be submitted directly to IANA for expert review. A future text/lessmark registration should wait until the format has broader standardization support.
