// @ts-check

import { expect, test } from "bun:test";
import { resolvedStyle } from "./gpui-stub.js";
import { ListRow } from "../src/data.js";
import { EmptyState, StatusLine } from "../src/feedback.js";

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

/** @param {any} element @param {string} method */
function callsTo(element, method) {
  return element.calls.filter((call) => call.method === method);
}

test("ListRow rejects non-string and blank ids", () => {
  for (const id of [
    undefined,
    null,
    "",
    "   ",
    0,
    42,
    false,
    {},
    [],
    Symbol("id"),
    () => "id",
  ]) {
    expect(() => new ListRow(id)).toThrow(
      "ListRow id must be a non-blank string",
    );
  }
});

test("ListRow keeps appended children in order without a false interactive affordance", () => {
  const row = new ListRow("project-1");

  expect(row.child("name")).toBe(row);
  expect(row.children(["owner", "status"])).toBe(row);

  const element = row.build(cx);

  expect(callsTo(element, "id")[0].args).toEqual(["project-1"]);
  expect(callsTo(element, "bg")[0].args).toEqual(["#101010ff"]);
  expect(callsTo(element, "children")[0].args).toEqual([["name", "owner", "status"]]);
  expect(element.name).toBe("h_flex");
  expect(callsTo(element, "on_click")).toHaveLength(0);
  expect(callsTo(element, "hover")).toHaveLength(0);
  expect(callsTo(element, "active")).toHaveLength(0);
  expect(callsTo(element, "focus")).toHaveLength(0);
});

test("ListRow applies selected presentation and builds a fresh element each time", () => {
  const row = new ListRow("project-1");

  expect(row.selected()).toBe(row);
  const first = row.build(cx);
  const second = row.build(cx);

  expect(first).not.toBe(second);
  expect(callsTo(first, "bg")[0].args).toEqual(["#2233aaff"]);
  expect(callsTo(first, "text_color")[0].args).toEqual(["#ffffffff"]);
  expect(callsTo(second, "id")[0].args).toEqual(["project-1"]);
});

test("ListRow exposes a controlled interactive seam with hover, press, and focus", () => {
  const callback = () => {};
  const row = new ListRow("project-1");

  expect(row.onClick(callback)).toBe(row);
  expect(row.disabled(false)).toBe(row);

  const element = row.build(cx);
  expect(element.name).toBe("Button");
  expect(element.args).toEqual(["project-1"]);
  expect(callsTo(element, "disabled")[0].args).toEqual([false]);
  expect(callsTo(element, "on_click")[0].args).toEqual([callback]);
  expect(resolvedStyle(element, "hover").bg).toBe("#333333ff");
  expect(resolvedStyle(element, "active").bg).toBe("#eeeeee38");
  expect(resolvedStyle(element, "focus")).toMatchObject({
    bg: "#eeeeee14",
    border: 1,
    border_color: "#2233aa40",
  });
});

test("ListRow selection wins over interactive fills and disabled removes activation", () => {
  const callback = () => {};
  const selected = new ListRow("selected")
    .selected()
    .onClick(callback)
    .build(cx);
  const disabled = new ListRow("disabled")
    .disabled()
    .onClick(callback)
    .build(cx);

  expect(resolvedStyle(selected, "hover").bg).toBe("#2233aaff");
  expect(resolvedStyle(selected, "active").bg).toBe("#2233aaff");
  expect(resolvedStyle(selected, "focus")).toMatchObject({
    bg: "#2233aaff",
    border: 1,
    border_color: "#2233aa40",
  });
  expect(callsTo(disabled, "disabled")[0].args).toEqual([true]);
  expect(callsTo(disabled, "text_color")[0].args).toEqual(["#999999ff"]);
  expect(callsTo(disabled, "on_click")).toHaveLength(0);
  expect(callsTo(disabled, "hover")).toHaveLength(0);
  expect(callsTo(disabled, "active")).toHaveLength(0);
  expect(callsTo(disabled, "focus")).toHaveLength(0);
});

test("EmptyState requires both semantic messages before building", () => {
  expect(() => new EmptyState().build(cx)).toThrow("EmptyState requires a heading before build().");
  expect(() => new EmptyState().heading("No projects").build(cx)).toThrow("EmptyState requires a hint before build().");
});

test("EmptyState chains its messages and renders heading before hint", () => {
  const empty = new EmptyState();

  expect(empty.heading("No projects")).toBe(empty);
  expect(empty.hint("Create a project to begin")).toBe(empty);

  const element = empty.build(cx);
  const children = callsTo(element, "child").map((call) => call.args[0]);

  expect(children).toHaveLength(2);
  expect(callsTo(children[0], "child")[0].args).toEqual(["No projects"]);
  expect(callsTo(children[1], "child")[0].args).toEqual(["Create a project to begin"]);
  expect(callsTo(children[0], "text_color")[0].args).toEqual(["#eeeeeeff"]);
  expect(callsTo(children[1], "text_color")[0].args).toEqual(["#999999ff"]);
});

test("StatusLine defaults to ready and validates its closed state vocabulary", () => {
  const status = new StatusLine();

  expect(status.label("Saved")).toBe(status);
  expect(() => status.state("paused")).toThrow("StatusLine state must be one of: ready, loading, error.");

  const element = status.build(cx);
  expect(callsTo(element, "role")[0].args).toEqual(["status"]);
  expect(callsTo(element, "text_color")[0].args).toEqual(["#999999ff"]);
});

test("StatusLine renders ready, loading, and error as distinct semantic states", () => {
  const ready = new StatusLine().label("Ready").state("ready").build(cx);
  const loading = new StatusLine().label("Syncing").state("loading").build(cx);
  const error = new StatusLine().label("Sync failed").state("error").build(cx);

  expect(callsTo(ready, "text_color")[0].args).toEqual(["#999999ff"]);
  expect(callsTo(ready, "child")[0].args).toEqual(["Ready"]);
  expect(callsTo(ready, "accessibility_label")).toHaveLength(0);
  expect(callsTo(loading, "text_color")[0].args).toEqual(["#999999ff"]);
  expect(callsTo(loading, "child")[0].args).toEqual(["Syncing…"]);
  expect(callsTo(loading, "accessibility_label")[0].args).toEqual([
    "Syncing, loading",
  ]);
  expect(callsTo(error, "text_color").at(-1).args).toEqual(["#ff3344ff"]);
  expect(callsTo(error, "child")[0].args).toEqual(["Sync failed"]);
});

test("StatusLine requires a label before building", () => {
  expect(() => new StatusLine().build(cx)).toThrow("StatusLine requires a label before build().");
});
