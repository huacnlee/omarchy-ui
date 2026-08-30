# Omarchy UI Hello World

This is the smallest `gpui-shell` application that consumes `omarchy-ui` as a
Git dependency. It requests no capabilities.

Run it from this directory with a gpui-shell checkout:

```bash
gpui-shell check .
gpui-shell .
```

`gpui-shell.json` maps the bare `omarchy-ui` import to the repository's public
`src/index.js` entry. The example does not install or use `node_modules`.

For a moving development dependency, select a branch:

```json
{
  "git": "git@github.com:huacnlee/omarchy-ui.git",
  "branch": "main",
  "entry": "src/index.js"
}
```

For a reproducible release dependency, select a tag instead:

```json
{
  "git": "git@github.com:huacnlee/omarchy-ui.git",
  "tag": "v0.1.0",
  "entry": "src/index.js"
}
```
