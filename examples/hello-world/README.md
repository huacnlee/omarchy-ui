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
Its `init` method uses gpui-shell's built-in `set_theme` together with
`applyOmarchyStyle`, `applyOmarchyRoles`, and `omarchyTheme` to install a small
embedded Omarchy palette before the first render. A host integration can pass
the user's current Omarchy color and shell sources through the same APIs.

For a moving development dependency, select a branch:

```json
{
  "git": "https://github.com/huacnlee/omarchy-ui",
  "branch": "main",
  "entry": "src/index.js"
}
```

For a reproducible release dependency, select a tag instead:

```json
{
  "git": "https://github.com/huacnlee/omarchy-ui",
  "tag": "v0.1.0",
  "entry": "src/index.js"
}
```
