// @ts-check

import { expect, test } from "bun:test";
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

test("ListRow keeps appended children in order and starts unselected", () => {
  const row = new ListRow("project-1");

  expect(row.child("name")).toBe(row);
  expect(row.children(["owner", "status"])).toBe(row);

  const element = row.build(cx);

  expect(callsTo(element, "id")[0].args).toEqual(["project-1"]);
  expect(callsTo(element, "bg")[0].args).toEqual(["#101010ff"]);
  expect(callsTo(element, "children")[0].args).toEqual([["name", "owner", "status"]]);
  expect(callsTo(callsTo(element, "hover")[0].style, "bg")[0].args).toEqual(["#333333ff"]);
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

test("StatusLine renders ready, loading, and error states with existing status tokens", () => {
  const ready = new StatusLine().label("Ready").state("ready").build(cx);
  const loading = new StatusLine().label("Syncing").state("loading").build(cx);
  const error = new StatusLine().label("Sync failed").state("error").build(cx);

  expect(callsTo(ready, "text_color")[0].args).toEqual(["#999999ff"]);
  expect(callsTo(loading, "text_color")[0].args).toEqual(["#999999ff"]);
  expect(callsTo(error, "text_color").at(-1).args).toEqual(["#ff3344ff"]);
  expect(callsTo(error, "child")[0].args).toEqual(["Sync failed"]);
});

test("StatusLine requires a label before building", () => {
  expect(() => new StatusLine().build(cx)).toThrow("StatusLine requires a label before build().");
});
