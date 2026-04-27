# Publishing

This repo is prepared for these public package names:

- npm: `lessmark`
- npm: `@jasperdevs/lessmark`
- npm: `@jasperdevs/lessmark-cli`
- PyPI: `lessmark`
- crates.io: `lessmark`

Publishing requires registry credentials. Do not publish from an unauthenticated shell.

## Verify First

```sh
npm run check
npm pack --workspaces --dry-run
python -m build packages/python
cargo test --manifest-path crates/lessmark/Cargo.toml
cargo package --manifest-path crates/lessmark/Cargo.toml
```

## npm

Requires `npm login` with publish rights for the `jasperdevs` scope.

```sh
npm publish --workspace lessmark --access public
npm publish --workspace @jasperdevs/lessmark --access public
npm publish --workspace @jasperdevs/lessmark-cli --access public
```

## PyPI

Requires a PyPI API token or trusted publishing.

```sh
python -m build packages/python
python -m twine upload --non-interactive packages/python/dist/*
```

## crates.io

Requires `cargo login` or `CARGO_REGISTRY_TOKEN`.

```sh
cargo publish --manifest-path crates/lessmark/Cargo.toml
```

## Domains

`lessmark.dev` should be the primary domain. `lessmark.org` is the defensive/open-source fallback. Domain registration requires a registrar checkout and payment approval.