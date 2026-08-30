# Omarchy UI Hello World

This is the smallest `gpui-shell` application that consumes `omarchy-ui` as a
Git dependency. It requests no capabilities.

Run it from this directory with a gpui-shell checkout:

```bash
gpui-shell check .
gpui-shell .
```

`gpui-shell.json` uses the `"omarchy-ui": "huacnlee/omarchy-ui"` shorthand.
It expands to `https://github.com/huacnlee/omarchy-ui` and, with no ref, uses
the remote default branch (currently `main`). gpui-shell reads the dependency
`package.json` `main` field to find its entry (`src/index.js`); if `main` is
omitted, it uses `index.js`. Its `init` method uses gpui-shell's built-in
`set_theme` together with `applyOmarchyStyle`, `applyOmarchyRoles`, and
`omarchyTheme` to install a small embedded Omarchy palette before the first
render. A host integration can pass the user's current Omarchy color and shell
sources through the same APIs.

Use `owner/repo#ref` to select another branch, tag, or commit-ish:

```json
"omarchy-ui": "huacnlee/omarchy-ui#v0.1.0"
```

The full URL form is also supported, for example
`"omarchy-ui": "https://github.com/huacnlee/omarchy-ui#main"`.
The legacy object dependency form remains compatible:

```json
"omarchy-ui": {
  "git": "https://github.com/huacnlee/omarchy-ui",
  "branch": "main",
  "entry": "src/index.js"
}
```

gpui-shell acquires Git dependencies directly and stores them in its Git
dependency cache.
