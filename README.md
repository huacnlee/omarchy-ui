# Omarchy UI

Omarchy UI provides class-based presentation components and pure theme
utilities for gpui-shell applications. The library owns Omarchy presentation;
the application owns copy, stable IDs, callbacks, navigation, domain state,
and asset paths.

## Example

<img width="1232" height="872" alt="image" src="https://github.com/user-attachments/assets/4153505d-fc4b-4179-bd8b-3bd32253e0b4" />

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

## Types

The library is JavaScript; its types are the JSDoc in `src/`, emitted as
declaration files beside the sources and committed. gpui-shell fetches this
repository as a Git dependency and runs no build step in it, so what an
application can see is exactly what is checked in. `package.json` names the
public entry twice for that reason:

```json
{
  "main": "src/index.js",
  "types": "src/index.d.ts"
}
```

An application needs no `paths` entry. Every load — and `gpui-shell types` —
links each resolved Git dependency into `<application>/node_modules` under the
name the manifest gave it, so a bare `import { style } from "omarchy-ui"`
resolves the same way for the editor as it does for the runtime, and reads the
declarations through `types`.

The declarations sit beside the sources rather than in a directory of their own
because that is where both forms of that link look. A symlinked checkout reads
`package.json`; where a platform refuses a symlink, gpui-shell writes a small
package that re-exports `src/index.js` by path, and an editor answers a path
with the declaration file next to it.

They also keep the library's own diagnostics out of the application. Without
them an editor loads `src/*.js` to read its JSDoc, and reports every
implicit-`any` in a private field of this library against the application that
imported it. A declaration file is read instead of the source, so an
application sees only its own.

The declarations name `import("gpui").Element`, `import("gpui").Color` and
`import("gpui").Context` instead of carrying copies of them. Those resolve
against the `gpui.d.ts` gpui-shell writes beside the application's own sources,
so `build(cx)` answers the same `Element` every other element in that window
is, and a role reads as a `Color` rather than as a string.

One type is named as well as the values: `import("omarchy-ui").OmarchyStyle` is
what `style()` answers and what `resolveSurfaceColor` takes, so a view that
holds the tokens between renders can say what it is holding.

`bun test` regenerates them first, so the committed declarations cannot fall
behind the sources they describe. To emit them alone:

```bash
bun run types
```

`typings/gpui.d.ts` supplies the gpui names during that run, which is what
makes the emit identical on a machine with no gpui-shell installed. It is not
shipped: two `declare module "gpui"` blocks in one program collide.

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
| `TitleBar` | None | `.brand(element)`, `.center(element)`, and `.actions(element)` are omitted by default. Its leading edge yields to the host's own window buttons where there are any — see **Window controls** below. |
| `StatusBar` | None | `.status(element)` and `.hints(element)` are omitted; `.leadsWithIcon(false)` controls the leading inset. |
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
| `Button(id)` | Stable `id` and non-blank `.label(text)` | `.icon(asset)` and `.tooltip(text)` are omitted by default. `.outlined()`, `.bordered(false)`, `.selected(false)`, `.accent(false)`, `.danger(false)`, `.tone(color)`, `.disabled(false)`, `.loading(false)`, `.loadingLabel(text)`, `.size("medium")`, and `.onClick(callback)`. A non-blank loading label is required while loading. |
| `IconButton(id)` | Stable `id`, `.icon(asset)`, and `.description(text)` | Shares Button's visual-state, tone, loading-label, size, and callback builders, plus `.quiet(false)`. The description supplies the accessible name and tooltip while idle. |
| `GlyphButton(id)` | Stable `id`, `.glyph(text)`, and `.description(text)` | Shares Button's visual-state, tone, loading-label, size, and callback builders, plus `.quiet(false)`. Use only when no icon asset exists. |
| `MenuItem(id)` | Stable `id` and non-blank `.label(text)` | `.detail(text)` and `.icon(asset)` are omitted; `.selected(false)`, `.danger(false)`, `.tone(color)`, `.disabled(false)`, and `.onClick(callback)`. |
| `FieldRow(id)` | Stable `id`, `.label(text)`, and `.control(element)` | No optional fields. |
| `FormField(id)` | Stable `id`, non-blank `.label(text)`, and `.control(element)` | `.helper(text)` and `.error(message)` are omitted by default. A non-empty error replaces helper text; `.error("")` clears it. |
| `AvatarButton(id)` | Stable `id`, `.description(text)`, and one of `.initials(text)` or `.icon(asset)` | `.tint(color)`, `.selected(false)`, `.quiet(false)`, `.disabled(false)`, `.size("medium")`, and `.onClick(callback)`. Use where the mark is a subject — an account, a person — rather than an action. |

`.quiet()` marks a compact command as supporting chrome — the marks in a
window's title row or a panel's heading. It rests in the muted foreground and
comes up to full strength when pointed at, focused or selected, so two icons
beside a heading do not read as the point of the panel.

`.tone(color)` is what full strength *is*. `accent` and `danger` are roles
whose colours the theme owns; a tone is a reading the caller worked out that no
token can name — a direction, a category, a mark that is on. It is resolved
once and reaches the label and the icon together, which is why it is a builder
rather than a `.text_color()` on the element you get back: that colours the
control and leaves every piece of text inside it in the theme's own.

The two are orthogonal, and compose. A tone alone shows at rest and stays there
under the pointer — a starred message is starred whether or not anyone is
pointing at it. `quiet` governs the resting state only, so a quiet toned
command waits in the muted foreground and arrives at its own colour when
pointed at. Disabled outranks both: a control that cannot be pressed has to
look like one.

`MenuItem.selected()` is the active row: where the arrow keys have got to. A
menu row has one such state and not two — nothing in a menu is *chosen*, a row
is activated and the menu closes — so it draws what the pointer draws and no
edge at all. A rule around every row turns an open menu into a stack of buttons
with one pressed in it.

`TextField.suffix(text)` is the unit the value is in — a currency, `shares`,
`ms`. It sits *inside* the field's own edge, because beside it a reader has to
work out whether the word belongs to this control or labels the next one, and
the answer moves with the width of whatever column they are in:

```
Price                      Price
[ 141.500        ] USD  →  [ 141.500    USD ]
```

`Input` is a leaf and takes no children, so the unit is drawn over the field's
trailing edge and the field is given room for it out of its trailing padding —
the digits stop before the word rather than running under it. The room a word
needs is its length times `style().font.advance`, because the window is
monospaced. The border and the focus ring stay on the `Input`: it is what
actually takes the keyboard, and a wrapper carrying them would have to know
when its child was focused, which there is no `focus_within` to ask. With no
suffix there is nothing to wrap, so nothing is wrapped.

`NumberInput` is the one control here that must supply a part rather than a
look. gpui-base builds both step buttons and styles neither — no size, no
content — so a number input that fills those two slots with nothing has a
decrement control that can be neither seen nor pressed. Their marks stack at
the trailing edge rather than sitting one on each side of the value, which
keeps the figure where the eye returns to it between presses and keeps the
control inside the width the shell reserved for a number field.

The two labels are required for the same reason a compact command's
`.description(text)` is: a step button draws a mark and announces nothing on
its own, and the library does not write the words. Everything numeric about it
— what one step moves, what it clamps to, what the mask allows — is set on the
`InputState` by whoever owns it, the way the value is.

`.tooltip(text)` on `Button` is what the label alone cannot say — most often
the keyboard route to the same action. A compact command carries this in
`.description(text)`, which is also its accessible name; a labelled button
already has an accessible name and needs only the hint, so a button with
nothing further to say draws no tooltip rather than one repeating its label.
| `ExternalLink(id)` | Stable `id`, non-blank `.label(text)` and `.href(url)` | No optional fields. Underlined as well as tinted, so the link is not identified by colour alone. |
| `TextField` | `.state(inputState)` | `.suffix(text)` is omitted by default; `.width(value)` and `.size("medium")`. The `InputState` stays application-owned; this class supplies the chrome only. |
| `NumberInput` | `.state(inputState)`, `.incrementLabel(text)` and `.decrementLabel(text)` | `.suffix(text)` is omitted by default; `.width(value)` defaults to `style().spacing.numberFieldWidth` and `.size("medium")`. The step, the bounds and the mask are fields on the application's `InputState`. |
| `Separator` | None | No configuration. |
| `MenuSeparator` | None | No configuration. |
| `Keycap(value)` | Non-blank key text | `.pressed(false)` draws the key physically down; `.quiet(false)` fades the resting fill for a hint strip. |
| `KeyHints(id)` | Stable `id` | Starts empty; `.hint(key, label)` appends one hint and `.hints(entries)` appends a whole strip, in order — the same pair as an open container's `child`/`children`. |

Control sizes are the closed vocabulary `"xsmall"`, `"small"`, `"medium"`, and
`"large"`; `.size(value)` rejects any other value immediately. Each step is
strictly smaller than the next in both type and height. `"small"` is one step
of the type scale under the body, which is the right ramp for a row of
controls; `"xsmall"` reaches the caption, for a control that sits *inside* a
run of text — a segmented picker, a chip on an attachment, the toggle at the
end of a caption — and would otherwise stand taller than the words around it. Required
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
| `StatusItem` | None | `.label(text)` and `.state("ready")`; valid states are `"ready"`, `"loading"`, and `"error"`. At rest the label may be blank — a window with nothing to report keeps its bar; loading and error must say something, and `.loadingLabel(text)` must be non-blank when state is loading. |
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

`StatusItem.state(value)` validates its closed vocabulary immediately. An error
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

### Window controls

`omarchyStyle(shellSource, host)` and `applyOmarchyStyle(shellSource, host)`
take the facts only the host knows: `cornerRadius` from Hyprland's
`decoration:rounding`, the `fontFamily` it resolved from fontconfig, and
`platform` — a `process.platform` value.

`platform` decides `style().spacing.windowControlsInset`: how much of the
window's leading edge the host draws its own controls over. macOS puts close,
minimise and zoom inside the window, at a fixed place the application does not
choose, so a title row that started at its own inset would start underneath
them. Omarchy's own desktop has no client-side decorations and reserves
nothing, and a host that does not say is treated as one that draws nothing.

`TitleBar` already yields that edge. An application drawing its own band at the
top of the window — a compose header, a back bar — should read the same token
rather than repeating the number:

```js
.pl(Math.max(tokens.space(14), tokens.spacing.windowControlsInset))
```

Unlike every other measurement here it does not move with the spacing scale:
the buttons stay where the system draws them however large the interface is
set. Only the leading edge is known; a host that draws its controls at the
trailing edge is not described yet.
