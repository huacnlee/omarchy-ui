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
  const create = ui.iconTextButton(
    "create",
    "assets/create.svg",
    "Create",
    onClick,
    cx,
  );
  const list = ui.surface(cx).child(
    ui.rowShell("project-1", true, cx).child(ui.label("A project", cx)),
  );
  const page = ui.pageColumn("settings", cx).children([
    ui.title("Settings", cx),
    ui.formField("name", "Name", ui.field({}, cx), cx, "Shown to teammates"),
    list,
    ui.emptyState("Nothing selected", "Choose a project to continue", cx),
    ui.statusLine("Sync failed", "error", cx),
  ]);
  const workspace = ui.centeredWorkspace("workspace", page, cx);
  const shell = ui.appShell(
    {
      top: ui.topBar({ center: ui.title("Projects", cx), actions: create }, cx),
      content: workspace,
      bottom: ui.bottomBar(
        { status: ui.statusLine("Ready", "ready", cx), hints: ui.keyHints([{ key: "j", label: "next" }], cx) },
        cx,
      ),
    },
    cx,
  );

  expect(callsTo(create, "child")[0].args[0].args[0]).toBe("assets/create.svg");
  expect(callsTo(list, "border")[0].args).toEqual([1]);
  expect(callsTo(page, "children")[0].args[0]).toContain(list);
  expect(callsTo(workspace, "overflow_y_scroll")).toHaveLength(1);
  expect(callsTo(shell, "size_full")).toHaveLength(1);
  expect(callsTo(ui.statusLine("Sync failed", "error", cx), "text_color").at(-1).args).toEqual([
    "#ff3344ff",
  ]);
});

test("button-derived controls render Omarchy keyboard focus treatment", () => {
  const controls = [
    ui.button("save", "Save", onClick, cx),
    ui.iconTextButton("create", "assets/create.svg", "Create", onClick, cx),
    ui.iconButton("refresh", "assets/refresh.svg", "Refresh", onClick, cx),
    ui.glyphButton("more", "…", "More actions", onClick, cx),
    ui.menuItem("rename", "Rename", onClick, cx),
  ];

  for (const control of controls) {
    const focus = callsTo(control, "focus");
    expect(focus).toHaveLength(1);
    expect(callsTo(focus[0].style, "bg")[0].args).toEqual(["#eeeeee14"]);
    expect(callsTo(focus[0].style, "border")[0].args).toEqual([1]);
    expect(callsTo(focus[0].style, "border_color")[0].args).toEqual([
      "#2233aa40",
    ]);
  }
});
