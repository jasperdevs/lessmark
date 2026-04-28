# Lessmark File Type Registration

Lessmark source files use `.mu`. The longer `.lessmark` extension is reserved as a readable alias.

## Current repo registration

- `.gitattributes` normalizes `.mu` and `.lessmark` as UTF-8 text with LF line endings.
- `.editorconfig` gives editors stable whitespace rules for Lessmark files.
- Hosted docs should serve `.mu` and `.lessmark` files as `text/vnd.lessmark; charset=utf-8`.
- `scripts/register-windows-filetype.ps1` registers `.mu` and `.lessmark` for the current Windows user without changing the default app unless `-SetDefaultApp` is passed.

## GitHub README limitation

GitHub only renders repository home READMEs through its supported markup pipeline. Lessmark is not currently a supported GitHub Markup format, so a root `README.mu` by itself will not replace the rendered `README.md` homepage today.

The best current setup is:

1. Keep `README.mu` as the canonical Lessmark source.
2. Keep `README.md` as the GitHub-rendered mirror.
3. Add Lessmark to GitHub Linguist and GitHub Markup later if a public grammar and renderer are ready.

## Official registration paths

- **IANA media type:** submit the draft in `docs/media-type.md` to IANA. `text/vnd.lessmark` is the practical vendor-tree target now. `text/lessmark` would need a stronger standards-track story.
- **GitHub Linguist:** add Lessmark to `languages.yml` with `.mu` and `.lessmark`, plus samples and grammar data.
- **GitHub Markup:** add a Lessmark renderer after the rendering output and security model are stable enough for GitHub's markup pipeline.
- **Editors:** publish language extensions for VS Code, JetBrains, Zed, and Sublime when syntax highlighting is worth maintaining.
- **Operating systems:** ship per-user registration scripts or package metadata. Avoid forcing default app associations unless an installed Lessmark viewer/editor exists.

This repository includes starter assets for the first two paths:

- `editors/vscode/`
- `integrations/github-linguist/`
