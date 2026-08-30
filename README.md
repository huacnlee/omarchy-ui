# Omarchy UI

Omarchy UI provides class-based presentation components and pure theme
utilities for gpui-shell applications. The library owns Omarchy presentation;
the application owns copy, stable IDs, callbacks, navigation, domain state,
and asset paths.

## Start with the public entry

Declare the Git shorthand in `gpui-shell.json`:

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

The repository keeps `"main": "src/index.js"` in `package.json`, so the
shorthand resolves the public entry without an application-supplied entry
override.

Import classes and utilities explicitly from `omarchy-ui`. Build every
component with the current render context:

```js
import {
  AppShell,
  Button,
  CenteredWorkspace,
  MutedText,
  PageColumn,
  Surface,
  Title,
} from "omarchy-ui";

export function render(cx) {
  const card = new Surface()
    .children([
      new Title("Projects").build(cx),
      new MutedText("Choose a project to continue").build(cx),
      new Button("project-create")
        .label("Create project…")
        .icon("assets/icons/project-add.svg")
        .onClick((_event, context) => context.notify())
        .build(cx),
    ])
    .build(cx);

  const page = new PageColumn("projects-page").child(card).build(cx);
  const workspace = new CenteredWorkspace("projects-workspace")
    .content(page)
    .build(cx);

  return new AppShell().content(workspace).build(cx);
}
```

Builders mutate the configuration value and return that same instance, so they
can be chained. `build(cx)` creates a fresh element on every call and resolves
the active theme from the supplied context. It does not retain GPUI state or
perform application side effects.

## Component catalog

Constructors marked with `id` require a stable, non-blank application ID. Use
domain identity for repeated controls and rows; do not derive IDs from mutable
positions or translated labels.

### Layout and text

| Class | Required before `build(cx)` | Optional builders and defaults |
| --- | --- | --- |
| `AppShell` | `.content(element)` | `.top(element)` and `.bottom(element)` are omitted by default. |
| `TopBar` | None | `.brand(element)`, `.center(element)`, and `.actions(element)` are omitted by default. |
| `BottomBar` | None | `.status(element)` and `.hints(element)` are omitted; `.leadsWithIcon(false)` controls the leading inset. |
| `ActionBar(id)` | Stable `id` | `.actions(element)` and `.status(element)` are omitted by default. |
| `PanelHeader(id)` | Stable `id` and `.heading(element)` | `.actions(element)` is omitted by default. |
| `CenteredWorkspace(id)` | Stable `id` and `.content(element)` | No optional fields. |
| `PageColumn(id)` | Stable `id` | `.child(element)` and `.children(elements)` append in order. `.maxWidth(value)` defaults to `style().space(560)`. |
| `Surface` | None | `.child(element)` and `.children(elements)` append in order; an empty surface is valid. |
| `PopupSurface(id)` | Stable `id` | `.child(element)` and `.children(elements)` append in order; an empty popup surface is valid. |
| `Label`, `MutedText` | Constructor text or `.text(value)` | Text may be a string or number. |
| `Title`, `SectionLabel` | Constructor text or `.text(value)` | `SectionLabel` applies the Omarchy section-label presentation. |

Named slots preserve semantic order. Falsy optional slots are omitted. Open
containers preserve the order of every `.child(...)` and `.children(...)`
call.

### Controls

| Class | Required before `build(cx)` | Optional builders and defaults |
| --- | --- | --- |
| `Button(id)` | Stable `id` and `.label(text)` | `.icon(asset)` is optional. `.outlined()`, `.bordered(false)`, `.selected(false)`, `.danger(false)`, `.disabled(false)`, `.loading(false)`, `.size("medium")`, and `.onClick(callback)`. |
| `IconButton(id)` | Stable `id`, `.icon(asset)`, and `.description(text)` | Shares Button's visual-state, size, and callback builders. The description supplies the accessible name and tooltip. |
| `GlyphButton(id)` | Stable `id`, `.glyph(text)`, and `.description(text)` | Shares Button's visual-state, size, and callback builders. Use only when no icon asset exists. |
| `MenuItem(id)` | Stable `id` and `.label(text)` | `.detail(text)` and `.icon(asset)` are empty; `.selected(false)`, `.danger(false)`, `.disabled(false)`, and `.onClick(callback)`. |
| `FieldRow(id)` | Stable `id`, `.label(text)`, and `.control(element)` | No optional fields. |
| `FormField(id)` | Stable `id`, `.label(text)`, and `.control(element)` | `.helper(text)` and `.error(message)` are empty by default. A non-empty error replaces helper text. |
| `Separator` | None | No configuration. |
| `MenuSeparator` | None | No configuration. |
| `Keycap(value)` | Non-blank key text | No optional fields. |
| `KeyHints(id)` | Stable `id` | Starts empty; `.hint(key, label)` appends one hint. |

Control sizes are the closed vocabulary `"small"`, `"medium"`, and
`"large"`; `.size(value)` rejects any other value immediately. Required
labels, icons, descriptions, glyphs, and controls are checked at `build(cx)`
with an error that names the component and missing field.

Pass a complete application-root-relative path to `.icon(asset)`, such as
`"assets/icons/project-add.svg"`. Omarchy UI passes that string to gpui-shell
unchanged. The library does not choose an asset, add a prefix, or resolve a
short icon name.

`Button.danger(value)` and `MenuItem.danger(value)` use the active destructive
token for idle, hover, pressed, focus, disabled, label, and icon treatment.
`FormField.error(message)` renders non-empty validation feedback with an alert
role and the destructive token; call `.error("")` to reveal helper text again.

### Data and feedback

| Class | Required before `build(cx)` | Optional builders and defaults |
| --- | --- | --- |
| `ListRow(id)` | Stable `id` | `.selected(false)`, `.disabled(false)`, and `.onClick(callback)`; `.child(element)` and `.children(elements)` append in order. |
| `EmptyState` | `.heading(text)` and `.hint(text)` | No optional fields. |
| `StatusLine` | `.label(text)` | `.state("ready")`; valid states are `"ready"`, `"loading"`, and `"error"`. |

`ListRow` remains a presentation-only row when no callback is supplied: it has
no hover, press, or focus affordance. Adding `onClick` uses the semantic button
boundary and enables token-driven hover, pressed, focus, selected, and disabled
states. Selection remains visible through hover and focus.

`StatusLine.state(value)` validates its closed vocabulary immediately. An error
state uses the active destructive token and a status role. Loading uses muted
presentation, appends `…` to the visible label, and exposes a loading-specific
accessible label, so it differs from ready without relying on color.

## State and callback ownership

These classes are presentational configuration values, not retained models.
The application owns selected, disabled, and loading values and supplies them
again when rendering changes. A Button, MenuItem, or interactive ListRow
`onClick` callback reports activation; the application performs the domain
operation, updates its owner, and calls the appropriate GPUI notification
method.

Stateful gpui-base controls remain application-owned. For example, create and
retain an `InputState` in the view, build its `Input`, and pass that element to
`new FormField(id).control(input)`. Omarchy UI arranges the supplied control and
does not duplicate its focus, editing, or lifecycle state.

## Theme and style utilities

The unchanged pure utilities are exported alongside the classes:

- Style: `parseShellToml`, `parseColor`, `formatColor`, `alpha`, `mix`,
  `capSaturation`, `omarchyStyle`, `style`, `applyOmarchyStyle`,
  `parseHyprlandColor`, and `resolveSurfaceColor`.
- Theme: `omarchyBaseColors`, `omarchyStatusColors`, `omarchyRoles`,
  `omarchyTheme`, `roles`, `role`, and `applyOmarchyRoles`.

Install the theme once during application initialization, before rendering the
class-built shell. See [Hello World](examples/hello-world/README.md) for the
complete theme setup and consumer example.
