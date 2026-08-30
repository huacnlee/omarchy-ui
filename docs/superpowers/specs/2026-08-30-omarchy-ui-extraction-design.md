# Omarchy UI extraction design

## Goal

Extract the reusable `omarchy-ui` JavaScript presentation primitives from
Omamail into a standalone Git dependency for gpui-shell applications. The new
repository starts from the current source snapshot and does not preserve the
Omamail file history.

## Repository structure

The repository uses a conventional JavaScript library layout without a build
step:

```text
src/                    Reusable ES modules
  index.js              Stable public entry point
  style.js              Omarchy structural tokens and color utilities
  theme.js              Omarchy palette to gpui-base theme projection
  layout.js             Shell and page layout primitives
  controls.js           Buttons, fields, menus, and key hints
  data.js               Data-view presentation primitives
  feedback.js           Empty and status states
examples/hello-world/   Minimal runnable gpui-shell application
tests/                  Bun tests and gpui-shell fixture checks
package.json            Private development scripts and ESM mode
README.md               Installation, API, and example documentation
LICENSE                 MIT license
```

There is no Rust code, generated bundle, package-registry integration, or
publishing configuration. `package.json` is private and exists only to provide
ESM semantics and `bun run` commands. It declares no dependencies or
development dependencies and produces no lockfile. gpui-shell runtime
dependencies remain built-in modules or manifest-declared Git dependencies;
library code must not depend on host-runtime APIs or generated dependency
directories.

## Public API

`src/index.js` is the only stable consumer entry point. It exposes named
exports grouped conceptually into style, theme, layout, controls, data, and
feedback. Applications import the library by its manifest dependency name;
internal module paths are not part of the compatibility contract.

Function names, argument ordering, JSDoc, and state option shapes will be made
consistent during extraction. The library owns presentation and interaction
states. Consumers continue to own domain state, copy, navigation, stable IDs,
callbacks, and asset files.

The Git dependency declaration points `entry` to `src/index.js` and selects
exactly one branch or tag.

## Example

`examples/hello-world` is intentionally small. Its manifest declares the
Git dependency, and its entry module renders an Omarchy-styled title, one line
of explanatory text, and a button. It demonstrates bare-package imports and
theme setup without carrying any Omamail business code.

## Quality and verification

The extracted modules retain `// @ts-check`, JSDoc types, two-space
indentation, and semicolons. Formatting, static checks, and tests run through
Bun without registry-installed tooling. Tests cover the
public export surface, style parsing and derivation, theme projection, and
basic component rendering. A gpui-shell check validates the Hello World
application after the Git source is available.

The standard development commands are `bun run check` and `bun run test`.
Documentation includes branch and tag dependency examples, the supported API
layers, asset ownership, and instructions for running the example.
