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

Use the primitives' explicit named exports from `src/index.js`; internal module
paths are not consumer APIs. The library owns presentation, while applications
own their copy, IDs, callbacks, navigation, and asset paths. Pass complete
application-root-relative asset paths to icon controls.

## Using it from gpui-shell

Declare the library as a Git dependency in `gpui-shell.json`:

```json
{
  "id": "com.example.application",
  "name": "Example application",
  "entry": "main.js",
  "dependencies": {
    "omarchy-ui": {
      "git": "git@github.com:huacnlee/omarchy-ui.git",
      "branch": "main",
      "entry": "src/index.js"
    }
  }
}
```

For a release pin, replace `branch` with a tag:

```json
{
  "git": "git@github.com:huacnlee/omarchy-ui.git",
  "tag": "v0.1.0",
  "entry": "src/index.js"
}
```

Each dependency selects exactly one branch or tag. gpui-shell fetches it before
evaluating the application and stores it in its Git dependency cache; no
`node_modules` directory is used.

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
