# Omarchy UI

Omarchy UI is a small, reusable set of ES-module presentation primitives for
gpui-shell applications that follow Omarchy's visual language.

Applications import the public API from the bare `omarchy-ui` module:

```js
import { appShell, button, pageColumn, style, surface, title } from "omarchy-ui";
```

The public API has four layers:

- Style: Omarchy spacing, typography, control-state, and surface tokens.
- Theme: palette projection and semantic color roles.
- Layout and controls: application shells, surfaces, text, fields, and buttons.
- Data and feedback: rows, empty states, and status lines.

Use the primitives' explicit named exports from the package entry; internal
module paths are not consumer APIs. The library owns presentation, while
applications own their copy, IDs, callbacks, navigation, and asset paths. Pass
complete application-root-relative asset paths to icon controls.

## Using it from gpui-shell

Declare the library with Git shorthand in `gpui-shell.json`:

```json
{
  "id": "com.example.application",
  "name": "Example application",
  "entry": "main.js",
  "dependencies": {
    "omarchy-ui": "huacnlee/omarchy-ui"
  }
}
```

`huacnlee/omarchy-ui` expands to
`https://github.com/huacnlee/omarchy-ui`; with no ref it uses that remote's
default branch (currently `main`). Use `owner/repo#ref` to select a branch, tag,
or commit-ish:

```json
"omarchy-ui": "huacnlee/omarchy-ui#v0.1.0"
```

The full URL form remains supported when needed, for example
`"omarchy-ui": "https://github.com/huacnlee/omarchy-ui#main"`.
The legacy object dependency form also remains compatible:

```json
"omarchy-ui": {
  "git": "https://github.com/huacnlee/omarchy-ui",
  "branch": "main",
  "entry": "src/index.js"
}
```

gpui-shell reads the dependency's `package.json` `main` field to find its entry
(`src/index.js` here); if `main` is omitted, it uses `index.js`.
gpui-shell acquires Git dependencies directly and stores them in its Git
dependency cache.

The library's dependency-free checks are:

```bash
bun test
bun run check
```

Run or validate a consumer application from its directory with:

```bash
gpui-shell check .
gpui-shell .
```

See [the Hello World example](examples/hello-world/README.md) for the complete
minimal application.
