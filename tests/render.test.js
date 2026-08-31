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
      new ui.StatusLine().label("Sync failed").state("error").build(cx),
    ])
    .build(cx);
  const workspace = new ui.CenteredWorkspace("workspace")
    .content(page)
    .build(cx);
  const shell = new ui.AppShell()
    .top(
      new ui.TopBar()
        .center(new ui.Title("Projects").build(cx))
        .actions(create)
        .build(cx),
    )
    .content(workspace)
    .bottom(
      new ui.BottomBar()
        .status(new ui.StatusLine().label("Ready").build(cx))
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
      new ui.StatusLine().label("Sync failed").state("error").build(cx),
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
