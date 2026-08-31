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
positions or translated labels. Required copy accepts only non-blank strings;
numbers, booleans, objects, and whitespace-only strings are not coerced into
interface text.

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
| `Panel(id)` | Stable `id`, non-blank `.title(text)`, and `.content(element)` | `.note(text)` and `.accessory(element)` are omitted by default; `.grow(true)` fills the panel with the content, `.grow(false)` lets the content take its own height. |
| `Toolbar(id)` | Stable `id` | `.leading(element)` and `.trailing(element)` are omitted by default. Unlike `ActionBar` it draws no rule and uses the row inset, so it lines up with the table under it. |
| `Label`, `MutedText`, `Title`, `SectionLabel` | Constructor text or `.text(value)` | `.size(step)`, `.strong(false)`, `.truncate(false)`, and `.tone(color)`. |

The four text roles share one set of builders and differ only in their
defaults: `Label` and `Title` resolve to the foreground token, `MutedText` and
`SectionLabel` to the muted one, and `SectionLabel` is bold at the caption step
while preserving caller casing.

`.size(step)` names one step of the shared type scale — `"caption"`,
`"bodySmall"`, `"body"`, `"subtitle"`, `"title"`, `"heading"`, `"display"`,
`"displayLarge"` — and rejects anything else, including a pixel value.
`.tone(color)` is the one escape hatch for a colour the semantic tokens cannot
carry, such as a rising price or a stale feed; passing `undefined` keeps the
role's own colour, so an optional reading needs no branch at the call site.

Text is required at `build(cx)` like every other required copy, with one
documented exception: `""` is accepted as a deliberate blank line, because a
fixed-height row keeps its second line even when there is nothing to say on it.
Whitespace-only text stays an error.

Named slots preserve semantic order. Falsy optional slots are omitted. Open
containers preserve the order of every `.child(...)` and `.children(...)`
call. Required slots and open-container children accept GPUI elements or
entities, not text primitives or plain objects; use the text classes for copy.
Truthy optional slots follow the same rule while falsy optional slots remain
intentional omissions.

### Controls

| Class | Required before `build(cx)` | Optional builders and defaults |
| --- | --- | --- |
| `Button(id)` | Stable `id` and non-blank `.label(text)` | `.icon(asset)` is omitted by default. `.outlined()`, `.bordered(false)`, `.selected(false)`, `.accent(false)`, `.danger(false)`, `.disabled(false)`, `.loading(false)`, `.loadingLabel(text)`, `.size("medium")`, and `.onClick(callback)`. A non-blank loading label is required while loading. |
| `IconButton(id)` | Stable `id`, `.icon(asset)`, and `.description(text)` | Shares Button's visual-state, loading-label, size, and callback builders. The description supplies the accessible name and tooltip while idle. |
| `GlyphButton(id)` | Stable `id`, `.glyph(text)`, and `.description(text)` | Shares Button's visual-state, loading-label, size, and callback builders. Use only when no icon asset exists. |
| `MenuItem(id)` | Stable `id` and non-blank `.label(text)` | `.detail(text)` and `.icon(asset)` are omitted; `.selected(false)`, `.danger(false)`, `.disabled(false)`, and `.onClick(callback)`. |
| `FieldRow(id)` | Stable `id`, `.label(text)`, and `.control(element)` | No optional fields. |
| `FormField(id)` | Stable `id`, non-blank `.label(text)`, and `.control(element)` | `.helper(text)` and `.error(message)` are omitted by default. A non-empty error replaces helper text; `.error("")` clears it. |
| `AvatarButton(id)` | Stable `id`, `.description(text)`, and one of `.initials(text)` or `.icon(asset)` | `.tint(color)`, `.selected(false)`, `.disabled(false)`, `.size("medium")`, and `.onClick(callback)`. Use where the mark is a subject — an account, a person — rather than an action. |
| `ExternalLink(id)` | Stable `id`, non-blank `.label(text)` and `.href(url)` | No optional fields. Underlined as well as tinted, so the link is not identified by colour alone. |
| `FilterField` | `.state(inputState)` | `.width(value)` and `.size("small")`. The `InputState` stays application-owned; this class supplies the chrome only. |
| `Separator` | None | No configuration. |
| `MenuSeparator` | None | No configuration. |
| `Keycap(value)` | Non-blank key text | `.pressed(false)` draws the key physically down; `.quiet(false)` fades the resting fill for a hint strip. |
| `KeyHints(id)` | Stable `id` | Starts empty; `.hint(key, label)` appends one hint. |

Control sizes are the closed vocabulary `"small"`, `"medium"`, and
`"large"`; `.size(value)` rejects any other value immediately. Required
labels, icons, descriptions, glyphs, and controls are checked at `build(cx)`
with an error that names the component and field. Optional copy must also be
non-blank when configured, except the documented `.error("")` clearing seam.
Every `onClick` builder accepts a function or `undefined` and rejects other
values immediately.

Pass a complete application-root-relative path to `.icon(asset)`, such as
`"assets/icons/project-add.svg"`. Omarchy UI passes that string to gpui-shell
unchanged. The library does not choose an asset, add a prefix, or resolve a
short icon name.

`Button.danger(value)` and `MenuItem.danger(value)` use the active destructive
token for idle, hover, pressed, focus, label, and icon treatment. Disabled
danger controls reduce emphasis with an alpha derived from that token.
When a Button, IconButton, or GlyphButton is loading, `.loadingLabel(text)`
owns the visible and accessible operation copy. Compact controls replace their
idle icon or glyph with a semantic activity marker, so loading stays distinct
even when the idle glyph is `…`. That marker uses gpui-shell's
`progress_indicator` accessibility role.
`FormField.error(message)` renders non-empty validation feedback with an alert
role and the destructive token; call `.error("")` to reveal helper text again.

### Data and feedback

| Class | Required before `build(cx)` | Optional builders and defaults |
| --- | --- | --- |
| `ListRow(id)` | Stable `id` | `.selected(false)`, `.disabled(false)`, and `.onClick(callback)`; `.child(element)` and `.children(elements)` append in order. |
| `Avatar` | One of `.initials(text)` or `.icon(asset)`, never both | `.tint(color)`, `.extent(pixels)`, and `.description(text)`. A square block, not a disc: the kit draws no circles. |
| `Metric(title)` | Non-blank title and `.value(text)` | `.tone(color)`, `.size("subtitle")`, and `.basis(104)`. A basis rather than a width is what makes a row of these rewrap instead of squeezing. |
| `MetricGrid(id)` | Stable `id` | `.child(element)` and `.children(elements)` append in order. |
| `DefinitionList(id)` | Stable `id` | `.entry(title, value, tone)` appends one label-and-value row. |
| `CodeBlock(id)` | Stable `id` and non-blank `.value(text)` | No optional fields. Set large and spaced, because the value exists to be transcribed. |
| `EmptyState` | `.heading(text)` and `.hint(text)` | No optional fields. |
| `StatusLine` | `.label(text)` | `.state("ready")`; valid states are `"ready"`, `"loading"`, and `"error"`. `.loadingLabel(text)` must be non-blank when state is loading. |
| `Badge(id)` | Stable `id` and non-blank `.label(text)` | `.tone("neutral")`, `.color(value)`, `.dot(false)`, `.quiet(false)`, and `.description(text)`. |
| `Alert(id)` | Stable `id` and non-blank `.message(text)` | `.tone("danger")` and `.color(value)`. |
| `Step(index)` | A positive integer index and non-blank `.title(text)` | No optional fields. |

`tone` is the closed vocabulary `"neutral"`, `"accent"`, `"success"`,
`"warning"`, `"danger"`. Only `accent` and `danger` resolve to a semantic
token; `success` and `warning` are readings the seventeen tokens do not carry,
so a caller with a palette for them passes it as `.color(value)` and a caller
without gets the muted foreground rather than an invented green. A `Badge`'s
dot is never the whole signal — the word beside it says the same thing.

### Tables

| Class | Required before `build(cx)` | Optional builders and defaults |
| --- | --- | --- |
| `TableHeaderRow(id)` | Stable `id` | `.column(spec)` and `.columns(specs)` append in order. |
| `TableRow(id, index)` | Stable `id` and a zero-based body index | `.height(pixels)`, `.selected(false)`, `.dimmed(false)`, `.onClick(callback)`, and `.cell(options, element)` appending in order. |
| `CellStack` | None | `.align("start")` and `.child(element)` appending in order. |

A column spec is `{title, width, align, hint}`. `width` is a share of the row
(`"31%"`), a fixed extent (`96`), or omitted to take what the fixed columns
leave; `align` is `"start"`, `"center"` or `"end"`; `hint` is the pointer's
tooltip, for a column abbreviated too far to read. A cell takes the same
`width` and `align`, which is what keeps the header and the body agreeing about
one set of columns rather than two.

Column titles are drawn folded to upper case, the way a terminal writes small
caps, while `title` itself stays as written so a hint, a sort order or a saved
layout still finds the column by name. The header is announced as row one and
`TableRow` adds that offset to the body index itself. `tableHeaderHeight()`
reports the header's drawn height for a virtualized body that has to size
itself against it.

A `TableRow` registers no click handler unless one is given: a virtualized list
rebuilds its rows every scrolled frame, so lists that scroll carry a single
item-click handler and leave the row presentational. `selected` still lights
the row without one.

### Disclosure

| Class | Required before `build(cx)` | Optional builders and defaults |
| --- | --- | --- |
| `AccordionGroup(id)` | Stable `id` | `.child(element)` appends one section. |
| `AccordionSection(id)` | Stable `id`, non-blank `.title(text)`, and `.body(element)` | `.detail(text)`, `.open(false)`, `.level(3)`, `.keepMounted(false)`, `.inset(value)`, and `.onToggle(callback)`. |

`open` and `onToggle` are the application's: a disclosure that remembered its
own state would forget it the next time the data under it changed and the view
rebuilt. `keepMounted` is for a body that is a retained child view — a chart,
an editor — which a collapse that unmounted would tear down and rebuild.

`ListRow` remains a presentation-only row when no callback is supplied: it has
no hover, press, or focus affordance. Adding `onClick` uses the semantic button
boundary and enables token-driven hover, pressed, focus, selected, and disabled
states. Selection remains visible through hover and focus.

`StatusLine.state(value)` validates its closed vocabulary immediately. An error
state uses the active destructive token and a status role. Loading uses the
caller's exact `.loadingLabel(text)` as visible and accessible copy, so the
library does not assemble language or punctuation.

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
