# Omarchy UI class API design

## Goal

Replace the extracted positional helper functions with a deliberate JavaScript
component API suitable for long-lived gpui-shell applications. The library
continues to wrap gpui-base behavior and own Omarchy presentation, while
applications own domain state, copy, navigation, stable IDs, callbacks, and
assets.

## API shape

Every reusable visual component is a class with private configuration, valid
defaults, fluent camelCase builders, and one `build(cx)` boundary that returns
the gpui-shell element. Builders mutate the component instance, return `this`,
and may be chained. `build(cx)` may be called again with another render context;
it does not retain GPUI entities or perform side effects.

```js
new Button("save")
  .label("Save")
  .outlined()
  .disabled(false)
  .onClick(() => save())
  .build(cx);
```

Stable identity is supplied at construction for every interactive or repeated
component. Visible labels and accessibility descriptions are required before
building controls that need them; `build(cx)` reports a clear error rather than
creating an inaccessible control. Callback builders describe intent and use
`onClick` only for click-level contracts.

## Public components

The first stable public surface is grouped conceptually but exported explicitly
from `src/index.js`:

- Layout: `AppShell`, `TopBar`, `BottomBar`, `ActionBar`, `PanelHeader`,
  `CenteredWorkspace`, `PageColumn`, `Surface`, `PopupSurface`.
- Text: `Label`, `MutedText`, `Title`, `SectionLabel`.
- Controls: `Button`, `IconButton`, `GlyphButton`, `MenuItem`, `FieldRow`,
  `FormField`, `Separator`, `MenuSeparator`, `Keycap`, `KeyHints`.
- Data and feedback: `ListRow`, `EmptyState`, `StatusLine`.

`Button` supports a text label and an optional consumer-owned icon asset.
`IconButton` is icon-only visually and therefore requires an accessibility
description. `GlyphButton` is reserved for a literal text glyph when no asset
exists. Consumers use gpui-base `Input` directly; `FieldRow` and `FormField`
only arrange a supplied control and do not duplicate input state ownership.
`SectionLabel` applies size and muted-color presentation without changing the
consumer's casing. `FormField.error(message)` replaces helper text with
destructive, semantic validation feedback until cleared.

Variants and behavioral states use domain builders: `outlined()`,
`bordered(bool)`, `selected(bool)`, `danger(bool)`, `disabled(bool)`, `loading(bool)`,
`loadingLabel(text)`, `size(value)`, `icon(asset)`, `detail(value)`, and callback builders such as
`onClick(callback)`. Only builders meaningful to a component are exposed.
Unknown variants or status states fail at the call that sets them.

## Composition and ownership

Named slots are preferred over positional arguments. `AppShell` has `top`,
`content`, and `bottom`; `PanelHeader` has `heading` and `actions`; `ActionBar`
has `actions` and `status`. Container components use `child`/`children` only
where content is genuinely open-ended.

`ListRow` is presentational when it has no callback. Supplying `onClick`
activates its semantic button seam and controlled `disabled` state, including
hover, pressed, and focus treatment with selected-state precedence. Button and
MenuItem danger states derive all presentation from the destructive token,
with disabled danger presentation using a reduced alpha of that token.
Button-family and StatusLine loading states require caller-owned non-blank
loading copy. Standard controls and StatusLine render that exact copy; compact
controls replace their idle content with a semantic activity marker, so
loading remains visibly and accessibly distinct without library-authored text.

Components are presentation values, not retained application state. Stateful
gpui-base models such as `InputState` remain owned by the application. Classes
do not start asynchronous work, read files, install themes, or mutate globals
from `build(cx)`.

All interaction states are visible and token-driven: idle, hover, pressed,
focus, selected, disabled, loading, and error where relevant. There are no raw
application colors, fixed consumer asset paths, or product-specific labels.

## Non-component utilities

Pure style and theme algorithms remain functions because they transform data
rather than represent visual components: `parseShellToml`, `parseColor`,
`formatColor`, `alpha`, `mix`, `capSaturation`, `omarchyStyle`, `style`,
`applyOmarchyStyle`, `parseHyprlandColor`, `resolveSurfaceColor`,
`omarchyBaseColors`, `omarchyStatusColors`, `omarchyRoles`, `omarchyTheme`,
`roles`, `role`, and `applyOmarchyRoles`.

The current lowercase visual helper functions are removed from the public API.
No compatibility aliases are kept because the library has not released this
surface and carrying two construction styles would make documentation and
future evolution ambiguous.

## Errors and validation

Construction validates every application-supplied ID as a non-blank string
through one internal validator before reaching the underlying GPUI component.
Builders validate closed vocabularies such as size and status immediately.
`build(cx)` validates required semantic content, such as a button label or an
icon button description. Error messages name the component, missing field, and
valid alternatives where applicable.

## Testing and migration

The exact-export test freezes class names and pure utilities. Unit tests cover
defaults, builder chaining, validation, repeated builds, consumer asset paths,
callbacks, and all visible interaction states through the recording GPUI stub.
Composition tests build a complete shell through public classes. The Hello
World example and README become the canonical usage reference.

Existing Omamail migration is outside this repository change. Omamail can move
to the class API separately after the standalone library is stable.
