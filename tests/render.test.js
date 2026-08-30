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
  const compose = ui.iconTextButton(
    "compose",
    "assets/compose.svg",
    "Compose",
    onClick,
    cx,
  );
  const list = ui.surface(cx).child(
    ui.rowShell("message-1", true, cx).child(ui.label("A message", cx)),
  );
  const page = ui.pageColumn("settings", cx).children([
    ui.title("Settings", cx),
    ui.formField("name", "Name", ui.field({}, cx), cx, "Shown to teammates"),
    ui.emptyState("Nothing selected", "Choose a message to continue", cx),
    ui.statusLine("Sync failed", "error", cx),
  ]);
  const workspace = ui.centeredWorkspace("workspace", page, cx);
  const shell = ui.appShell(
    {
      top: ui.topBar({ center: ui.title("Mail", cx), actions: compose }, cx),
      content: workspace,
      bottom: ui.bottomBar(
        { status: ui.statusLine("Ready", "ready", cx), hints: ui.keyHints([{ key: "j", label: "next" }], cx) },
        cx,
      ),
    },
    cx,
  );

  expect(callsTo(compose, "child")[0].args[0].args[0]).toBe("assets/compose.svg");
  expect(callsTo(list, "border")[0].args).toEqual([1]);
  expect(callsTo(workspace, "overflow_y_scroll")).toHaveLength(1);
  expect(callsTo(shell, "size_full")).toHaveLength(1);
  expect(callsTo(ui.statusLine("Sync failed", "error", cx), "text_color").at(-1).args).toEqual([
    "#ff3344ff",
  ]);
});
