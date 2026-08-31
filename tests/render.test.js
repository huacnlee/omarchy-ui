// @ts-check

import { expect, test } from "bun:test";
import * as ui from "../src/index.js";

const theme = {
  colors: {
    accent: "#2233aaff",
    accent_foreground: "#ffffffff",
    background: "#101010ff",
    border: "#777777ff",
    destructive: "#ff3344ff",
    foreground: "#eeeeeeff",
    muted: "#333333ff",
    muted_foreground: "#999999ff",
    primary: "#2233aaff",
    ring: "#2233aaff",
    surface: "#101010ff",
  },
  spacing: { md: 6, sm: 4 },
};

const cx = { theme: () => theme };
const onClick = () => {};

/** @param {any} element @param {string} method */
function callsTo(element, method) {
  return element.calls.filter((call) => call.method === method);
}

test("composes generic shell, controls, data, and feedback through the public entry", () => {
  const create = new ui.Button("create")
    .label("Create")
    .icon("assets/create.svg")
    .onClick(onClick)
    .build(cx);
  const list = new ui.Surface()
    .child(
      new ui.ListRow("project-1")
        .selected()
        .child(new ui.Label("A project").build(cx))
        .build(cx),
    )
    .build(cx);
  const page = new ui.PageColumn("settings")
    .children([
      new ui.Title("Settings").build(cx),
      new ui.FormField("name")
        .label("Name")
        .control(new ui.Button("edit-name").label("Edit name").build(cx))
        .helper("Shown to teammates")
        .build(cx),
      list,
      new ui.EmptyState()
        .heading("Nothing selected")
        .hint("Choose a project to continue")
        .build(cx),
      new ui.StatusItem().label("Sync failed").state("error").build(cx),
    ])
    .build(cx);
  const workspace = new ui.CenteredWorkspace("workspace")
    .content(page)
    .build(cx);
  const shell = new ui.AppShell()
    .top(
      new ui.TitleBar()
        .center(new ui.Title("Projects").build(cx))
        .actions(create)
        .build(cx),
    )
    .content(workspace)
    .bottom(
      new ui.StatusBar()
        .status(new ui.StatusItem().label("Ready").build(cx))
        .hints(new ui.KeyHints("navigation-hints").hint("j", "Next").build(cx))
        .build(cx),
    )
    .build(cx);

  expect(callsTo(create, "child")[0].args[0].args[0]).toBe("assets/create.svg");
  expect(callsTo(list, "border")[0].args).toEqual([1]);
  expect(callsTo(page, "children")[0].args[0]).toContain(list);
  expect(callsTo(workspace, "overflow_y_scroll")).toHaveLength(1);
  expect(callsTo(shell, "size_full")).toHaveLength(1);
  expect(
    callsTo(
      new ui.StatusItem().label("Sync failed").state("error").build(cx),
      "text_color",
    ).at(-1).args,
  ).toEqual(["#ff3344ff"]);
});

test("button-derived controls render Omarchy keyboard focus treatment", () => {
  const controls = [
    new ui.Button("save").label("Save").onClick(onClick).build(cx),
    new ui.Button("create")
      .label("Create")
      .icon("assets/create.svg")
      .onClick(onClick)
      .build(cx),
    new ui.IconButton("refresh")
      .icon("assets/refresh.svg")
      .description("Refresh")
      .onClick(onClick)
      .build(cx),
    new ui.GlyphButton("more")
      .glyph("…")
      .description("More actions")
      .onClick(onClick)
      .build(cx),
    new ui.MenuItem("rename").label("Rename").onClick(onClick).build(cx),
  ];

  for (const control of controls) {
    const focus = callsTo(control, "focus");
    expect(focus).toHaveLength(1);
    // A neutral control's focus is the theme's own chrome: the muted fill it
    // uses for hover, ringed in the token named for exactly that.
    expect(callsTo(focus[0].style, "bg")[0].args).toEqual([theme.colors.muted]);
    expect(callsTo(focus[0].style, "border")[0].args).toEqual([1]);
    expect(callsTo(focus[0].style, "border_color")[0].args).toEqual([
      theme.colors.ring,
    ]);
  }
});

test("a menu item's tone reaches its text, and disabled still wins", () => {
  const tone = "#00dbb6";

  // The row's colour is the one the label, the icon and the detail are all
  // given, so asserting it here covers the three -- which is the point of
  // resolving it once rather than styling the row and hoping.
  const toned = new ui.MenuItem("buy").label("Buy").tone(tone).build(cx);
  expect(callsTo(toned, "text_color")[0].args).toEqual([tone]);

  // A tone is a reading; danger is a role. When a caller gives both, the
  // reading is the more specific thing it worked out.
  const both = new ui.MenuItem("sell").label("Sell").danger().tone(tone).build(cx);
  expect(callsTo(both, "text_color")[0].args).toEqual([tone]);

  // Disabled outranks either: a row that cannot be pressed has to look like
  // one, whatever it would otherwise have said.
  const off = new ui.MenuItem("buy-off").label("Buy").tone(tone).disabled().build(cx);
  expect(callsTo(off, "text_color")[0].args).toEqual([theme.colors.muted_foreground]);

  // Without a tone nothing changes.
  const plain = new ui.MenuItem("rename").label("Rename").build(cx);
  expect(callsTo(plain, "text_color")[0].args).toEqual([theme.colors.foreground]);
});

test("a button's tone is the colour it resolves once, and disabled still wins", () => {
  const tone = "#00dbb6";

  // One `foreground` reaches the label and the icon together, so asserting the
  // control's own colour covers both -- which is why a tone is a builder here
  // rather than a `.text_color()` on the element the caller gets back.
  const toned = new ui.Button("buy").label("Buy").tone(tone).build(cx);
  expect(callsTo(toned, "text_color")[0].args).toEqual([tone]);

  // `accent` and `danger` are roles the theme owns. A tone is a reading the
  // caller worked out, and a reading is the more specific of the two.
  const overAccent = new ui.Button("buy-accent").label("Buy").accent().tone(tone).build(cx);
  expect(callsTo(overAccent, "text_color")[0].args).toEqual([tone]);
  const overDanger = new ui.Button("sell").label("Sell").danger().tone(tone).build(cx);
  expect(callsTo(overDanger, "text_color")[0].args).toEqual([tone]);

  // Disabled outranks either, and so does loading: a control that cannot be
  // pressed has to look like one, whatever it would otherwise have said.
  const off = new ui.Button("buy-off").label("Buy").tone(tone).disabled().build(cx);
  expect(callsTo(off, "text_color")[0].args).toEqual([theme.colors.muted_foreground]);
  const busy = new ui.Button("buy-busy")
    .label("Buy")
    .tone(tone)
    .loading()
    .loadingLabel("Buying…")
    .build(cx);
  expect(callsTo(busy, "text_color")[0].args).toEqual([theme.colors.muted_foreground]);

  // Without a tone nothing changes.
  const plain = new ui.Button("save").label("Save").build(cx);
  expect(callsTo(plain, "text_color")[0].args).toEqual([theme.colors.foreground]);
});

test("a button carries a tooltip only when one is given", () => {
  const hinted = new ui.Button("send")
    .label("Send")
    .tooltip("Send · Ctrl+Enter")
    .build(cx);
  expect(callsTo(hinted, "tooltip")[0].args).toEqual(["Send · Ctrl+Enter"]);

  // The label is already the accessible name, so a button with nothing further
  // to say draws no tooltip at all rather than one repeating itself.
  expect(callsTo(new ui.Button("send-plain").label("Send").build(cx), "tooltip")).toHaveLength(0);

  expect(() => new ui.Button("send-blank").label("Send").tooltip("  ").build(cx)).toThrow(
    /Button tooltip/,
  );
});

test("a compact command's tone is its full strength, and quiet decides when it arrives", () => {
  const tone = "#e8b339";

  /** @param {any} element */
  const rest = (element) => callsTo(element, "text_color")[0].args;
  /** @param {any} element */
  const pointed = (element) => {
    const hover = callsTo(element, "hover");
    expect(hover).toHaveLength(1);
    return callsTo(hover[0].style, "text_color")[0].args;
  };

  // A tone on its own shows at rest and stays there under the pointer: a
  // starred message is starred whether or not anyone is pointing at it.
  const starred = new ui.IconButton("star-on")
    .icon("assets/star-filled.svg")
    .description("Starred")
    .tone(tone)
    .onClick(onClick)
    .build(cx);
  expect(rest(starred)).toEqual([tone]);
  expect(pointed(starred)).toEqual([tone]);

  // `quiet` governs the resting state only, so the two compose: the mark waits
  // in the muted foreground and arrives at its own colour when pointed at.
  const quietTone = new ui.IconButton("star-off")
    .icon("assets/star.svg")
    .description("Star this message")
    .quiet()
    .tone(tone)
    .onClick(onClick)
    .build(cx);
  expect(rest(quietTone)).toEqual([theme.colors.muted_foreground]);
  expect(pointed(quietTone)).toEqual([tone]);

  // Neither builder changes what the other two states already did.
  const quiet = new ui.IconButton("refresh")
    .icon("assets/refresh.svg")
    .description("Refresh")
    .quiet()
    .onClick(onClick)
    .build(cx);
  expect(rest(quiet)).toEqual([theme.colors.muted_foreground]);
  expect(pointed(quiet)).toEqual([theme.colors.foreground]);

  const plain = new ui.GlyphButton("more")
    .glyph("…")
    .description("More actions")
    .onClick(onClick)
    .build(cx);
  expect(rest(plain)).toEqual([theme.colors.foreground]);
  expect(pointed(plain)).toEqual([theme.colors.foreground]);

  // Disabled outranks a tone here too, and draws no hover state to arrive at.
  const off = new ui.GlyphButton("more-off")
    .glyph("…")
    .description("More actions")
    .tone(tone)
    .disabled()
    .build(cx);
  expect(rest(off)).toEqual([theme.colors.muted_foreground]);
  expect(callsTo(off, "hover")).toHaveLength(0);
});

test("a key-hint strip takes its hints one at a time or as the list it was handed", () => {
  const entries = [
    { key: "j", label: "Next" },
    { key: "k", label: "Previous" },
  ];

  // The pair matches the open containers' `child`/`children`, so a strip built
  // by hand and one rendered from a keymap are the same strip.
  const named = new ui.KeyHints("hints").hint("j", "Next").hint("k", "Previous").build(cx);
  const listed = new ui.KeyHints("hints").hints(entries).build(cx);
  expect(listed.calls).toEqual(named.calls);

  // The list is read, not retained: appending to it afterwards does not reach
  // a strip that has already been given it.
  const strip = new ui.KeyHints("hints").hints(entries);
  entries.push({ key: "x", label: "Never" });
  expect(strip.build(cx).calls).toEqual(named.calls);

  expect(() => new ui.KeyHints("hints").hints({ key: "j", label: "Next" })).toThrow(
    /KeyHints hints must be an array/,
  );
  // A blank key or label is the same error one hint at a time already gives.
  expect(() => new ui.KeyHints("hints").hints([{ key: "", label: "Next" }]).build(cx)).toThrow(
    /KeyHints key/,
  );
});

test("a value field carries its unit inside the field", () => {
  const state = {};

  const priced = new ui.TextField().state(state).suffix("USD").width(200).build(cx);
  // A container, because `Input` is a leaf and takes no children: the field
  // and the unit are siblings, and the unit is drawn over the field's edge.
  const children = callsTo(priced, "child");
  expect(children).toHaveLength(2);
  expect(callsTo(priced, "relative")).toHaveLength(1);

  // Room for the unit comes out of the field's own right padding, so the
  // digits stop before the word rather than running under it.
  const field = children[0].args[0];
  const [leftPad] = callsTo(field, "pl")[0].args;
  const [rightPad] = callsTo(field, "pr")[0].args;
  expect(rightPad).toBeGreaterThan(leftPad);

  // The border and the focus ring stay on the field. It is what takes the
  // keyboard, and there is no `focus_within` a wrapper could have used.
  expect(callsTo(field, "focus")).toHaveLength(1);
  expect(callsTo(priced, "focus")).toHaveLength(0);

  // Without a unit there is nothing to wrap, so there is no wrapper.
  const plain = new ui.TextField().state(state).width(200).build(cx);
  expect(callsTo(plain, "relative")).toHaveLength(0);
  expect(callsTo(plain, "focus")).toHaveLength(1);
  expect(callsTo(plain, "pr")[0].args).toEqual(callsTo(plain, "pl")[0].args);
});

test("a menu row's active state is the pointer's own fill and no edge", () => {
  /** @param {any} element */
  const rest = (element) => callsTo(element, "bg")[0].args[0];
  /** @param {any} element */
  const pointed = (element) =>
    callsTo(callsTo(element, "hover")[0].style, "bg")[0].args[0];

  const plain = new ui.MenuItem("rename").label("Rename").onClick(onClick).build(cx);
  const active = new ui.MenuItem("rename").label("Rename").selected().onClick(onClick).build(cx);

  // A row nothing has reached is unpainted; the row the arrow keys are on
  // draws what the pointer would draw, because they are the same state
  // arrived at two ways. Nothing in a menu is *chosen*, so there is no
  // heavier treatment for a second boolean to carry.
  expect(rest(plain)).toEqual("#00000000");
  expect(rest(active)).toEqual(pointed(plain));

  // No edge in either state: a rule around every row turns an open menu into a
  // stack of buttons with one pressed in it.
  expect(callsTo(active, "border_color")[0].args).toEqual(
    callsTo(plain, "border_color")[0].args,
  );
});
