# Working on Omarchy UI

## Pull request titles

`scope: Capitalised summary`

A lowercase scope naming the component or module that moved, a colon, then a
summary that starts with a capital and reads as an imperative.

```
tabs: Add Segmented Tabs
controls: Let a menu row carry a tone
style: Recognise the shell's own name for macOS
```

Not `Tabs: one choice out of a few, in two shapes`. A title is read in a list
of other titles, where the scope says which part moved and the verb says what
happened to it. The reasoning belongs in the body.

Commit message subjects and bodies keep their own longer, explanatory form.
This rule is about the pull request title line.

## What belongs here, and what belongs to the application

The library owns Omarchy presentation. The application owns copy, stable IDs,
callbacks, navigation, domain state and asset paths — so a component takes
those as arguments and never invents them.

A component is worth adding when an application would otherwise write the same
styling again *and get the same detail wrong*. `Tabs` exists because every
hand-written run of tabs resized itself on hover; `TextField`'s suffix exists
because a unit beside a field is a unit a reader has to attribute.

## Before opening a pull request

```sh
bun test        # runs `bun run types` first
```

`src/*.d.ts` are generated. Regenerate them rather than editing them, and
commit the result — `the committed declarations cover the public API` checks
that they are current.

A new class needs three registrations beyond its own file: the export in
`src/index.js`, its name in the class list in `tests/controls.test.js` or the
matching file for its module, and its builders in `tests/public-api.test.js`.
The surface is asserted exactly, so an unregistered class fails the suite
rather than slipping in.

Anything reached from `gpui` or `gpui-base` needs a declaration in
`typings/gpui.d.ts` and a matching stub in `tests/gpui-stub.js`. That file
names only what `src/` actually uses, so it grows one entry at a time.

## Sizing and state

Every state keeps the same size. Reserve the widest border a control can take
and change its colour, rather than adding one on hover or selection — a
control that grows an edge is a control that resizes, and its neighbours move
with it.

`selectedBorderWidth` defaults to 0 while `normalBorderWidth` and
`hoverBorderWidth` do not, so a control that draws its own border per state
will change width unless it reserves.
