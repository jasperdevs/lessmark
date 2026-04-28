# Lessmark File Type Registration

@paragraph
Lessmark source files use .mu. The longer .lessmark extension is reserved as a readable alias.

## Current repo registration

@list kind="unordered"
- .gitattributes normalizes .mu and .lessmark as UTF-8 text with LF line endings.
- .editorconfig gives editors stable whitespace rules for Lessmark files.
- Hosted docs should serve .mu and .lessmark files as text/vnd.lessmark; charset=utf-8.
- scripts/register-windows-filetype.ps1 registers .mu and .lessmark for the current Windows user without changing the default app unless -SetDefaultApp is passed.

## GitHub README limitation

@paragraph
GitHub only renders repository home READMEs through its supported markup pipeline. Lessmark is not currently a supported GitHub Markup format, so README.md remains the required platform README.

@paragraph
The best current setup is:

@list kind="ordered"
- Keep README.md as the GitHub-rendered package and repository README.
- Keep project docs in Lessmark .mu files under docs.
- Add Lessmark to GitHub Linguist and GitHub Markup after a public grammar and renderer are ready.

## Official registration paths

@list kind="unordered"
- {{strong:IANA media type:}} submit the draft in docs/media-type.mu to IANA. text/vnd.lessmark is the practical vendor-tree target now. text/lessmark would need a stronger standards-track story.
- {{strong:GitHub Linguist:}} add Lessmark to languages.yml with .mu and .lessmark, plus samples and grammar data.
- {{strong:GitHub Markup:}} add a Lessmark renderer after the rendering output and security model are stable enough for GitHub's markup pipeline.
- {{strong:Editors:}} publish language extensions for VS Code, JetBrains, Zed, and Sublime when syntax highlighting is worth maintaining.

## Current Public Signals

@list kind="unordered"
- README.md exposes the ci workflow badge.
- README.md exposes the v0 conformance badge.
- docs/conformance.mu defines what the badge means.
- {{strong:Operating systems:}} ship per-user registration scripts or package metadata. Avoid forcing default app associations unless an installed Lessmark viewer/editor exists.

@paragraph
This repository includes starter assets for the first two paths:

@list kind="unordered"
- editors/vscode/
- integrations/github-linguist/
