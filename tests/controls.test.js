// @ts-check

import { beforeEach, expect, test } from "bun:test";
import { element, resolvedStyle } from "./gpui-stub.js";
import * as controls from "../src/controls.js";
import { applyOmarchyStyle } from "../src/style.js";

const theme = {
  colors: {
    border: "#777777ff",
    destructive: "#ff3344ff",
    foreground: "#eeeeeeff",
    muted_foreground: "#999999ff",
    ring: "#2233aaff",
  },
};

const cx = { theme: () => theme };

beforeEach(() => {
  applyOmarchyStyle("");
});

/** @param {any} value @param {string} method */
function callsTo(value, method) {
  return value.calls.filter((call) => call.method === method);
}

/** @param {any} value @param {string} method */
function oneCall(value, method) {
  const calls = callsTo(value, method);
  expect(calls, `expected one ${method} call`).toHaveLength(1);
  return calls[0];
}

test("exports exactly the control value classes", () => {
  expect(Object.keys(controls).sort()).toEqual([
    "Button",
    "FieldRow",
    "FormField",
    "GlyphButton",
    "IconButton",
    "KeyHints",
    "Keycap",
    "MenuItem",
    "MenuSeparator",
    "Separator",
  ]);

  for (const name of Object.keys(controls)) {
    expect(typeof controls[name]).toBe("function");
  }
});

test("every ID-bearing component rejects a missing or blank stable id", () => {
  const factories = [
    ["Button", (id) => new controls.Button(id)],
    ["IconButton", (id) => new controls.IconButton(id)],
    ["GlyphButton", (id) => new controls.GlyphButton(id)],
    ["MenuItem", (id) => new controls.MenuItem(id)],
    ["FieldRow", (id) => new controls.FieldRow(id)],
    ["FormField", (id) => new controls.FormField(id)],
    ["KeyHints", (id) => new controls.KeyHints(id)],
  ];

  for (const [name, create] of factories) {
    for (const id of [undefined, null, "", "   "]) {
      expect(() => create(id)).toThrow(`${name} requires a non-blank id`);
    }
  }
});

test("fluent builders mutate private configuration and return the same value", () => {
  const callback = () => {};
  const button = new controls.Button("save");
  expect(button.label("Save")).toBe(button);
  expect(button.icon("consumer/icons/save.svg")).toBe(button);
  expect(button.outlined()).toBe(button);
  expect(button.bordered()).toBe(button);
  expect(button.selected()).toBe(button);
  expect(button.disabled(false)).toBe(button);
  expect(button.loading(false)).toBe(button);
  expect(button.size("large")).toBe(button);
  expect(button.onClick(callback)).toBe(button);

  for (const compact of [
    new controls.IconButton("refresh")
      .icon("consumer/icons/refresh.svg")
      .description("Refresh"),
    new controls.GlyphButton("more").glyph("…").description("More actions"),
  ]) {
    expect(compact.outlined()).toBe(compact);
    expect(compact.bordered()).toBe(compact);
    expect(compact.selected()).toBe(compact);
    expect(compact.disabled(false)).toBe(compact);
    expect(compact.loading(false)).toBe(compact);
    expect(compact.size("small")).toBe(compact);
    expect(compact.onClick(callback)).toBe(compact);
  }

  const menuItem = new controls.MenuItem("rename");
  expect(menuItem.label("Rename")).toBe(menuItem);
  expect(menuItem.detail("Return")).toBe(menuItem);
  expect(menuItem.icon("consumer/icons/rename.svg")).toBe(menuItem);
  expect(menuItem.selected()).toBe(menuItem);
  expect(menuItem.disabled(false)).toBe(menuItem);
  expect(menuItem.onClick(callback)).toBe(menuItem);

  const field = new controls.FieldRow("name");
  expect(field.label("Name")).toBe(field);
  expect(field.control(element("Input"))).toBe(field);

  const formField = new controls.FormField("email");
  expect(formField.label("Email")).toBe(formField);
  expect(formField.control(element("Input"))).toBe(formField);
  expect(formField.helper("Used for notifications")).toBe(formField);

  expect(Object.keys(button)).toEqual([]);
  expect(Object.keys(menuItem)).toEqual([]);
  expect(Object.keys(field)).toEqual([]);
});

test("build reports each missing semantic field", () => {
  expect(() => new controls.Button("save").build(cx)).toThrow(
    "Button requires label before build",
  );
  expect(() => new controls.IconButton("refresh").description("Refresh").build(cx)).toThrow(
    "IconButton requires icon before build",
  );
  expect(() =>
    new controls.IconButton("refresh").icon("consumer/icons/refresh.svg").build(cx),
  ).toThrow("IconButton requires description before build");
  expect(() => new controls.GlyphButton("more").description("More actions").build(cx)).toThrow(
    "GlyphButton requires glyph before build",
  );
  expect(() => new controls.GlyphButton("more").glyph("…").build(cx)).toThrow(
    "GlyphButton requires description before build",
  );
  expect(() => new controls.MenuItem("rename").build(cx)).toThrow(
    "MenuItem requires label before build",
  );
  expect(() => new controls.FieldRow("name").control(element("Input")).build(cx)).toThrow(
    "FieldRow requires label before build",
  );
  expect(() => new controls.FieldRow("name").label("Name").build(cx)).toThrow(
    "FieldRow requires control before build",
  );
  expect(() => new controls.FormField("email").control(element("Input")).build(cx)).toThrow(
    "FormField requires label before build",
  );
  expect(() => new controls.FormField("email").label("Email").build(cx)).toThrow(
    "FormField requires control before build",
  );
  expect(() => new controls.Keycap("").build(cx)).toThrow(
    "Keycap requires value before build",
  );
});

test("size rejects unknown values at the builder call", () => {
  for (const control of [
    new controls.Button("save"),
    new controls.IconButton("refresh"),
    new controls.GlyphButton("more"),
  ]) {
    expect(() => control.size("giant")).toThrow(
      `${control.constructor.name} size must be one of small, medium, large; received "giant"`,
    );
  }
});

test("build is repeatable and preserves stable identity and callbacks", () => {
  const callback = () => {};
  const value = new controls.Button("save").label("Save").onClick(callback);

  const first = value.build(cx);
  const second = value.build(cx);

  expect(first).not.toBe(second);
  expect(first.args).toEqual(["save"]);
  expect(second.args).toEqual(["save"]);
  expect(oneCall(first, "on_click").args).toEqual([callback]);
  expect(oneCall(second, "on_click").args).toEqual([callback]);
  expect(oneCall(first, "child").args).toEqual(["Save"]);
  expect(oneCall(second, "child").args).toEqual(["Save"]);
});

test("buttons wire callbacks only while actionable", () => {
  const callback = () => {};
  const enabled = new controls.Button("enabled").label("Save").onClick(callback).build(cx);
  const disabled = new controls.Button("disabled")
    .label("Save")
    .disabled()
    .onClick(callback)
    .build(cx);
  const loading = new controls.Button("loading")
    .label("Save")
    .loading()
    .onClick(callback)
    .build(cx);

  expect(oneCall(enabled, "on_click").args).toEqual([callback]);
  expect(callsTo(disabled, "on_click")).toHaveLength(0);
  expect(callsTo(loading, "on_click")).toHaveLength(0);
  expect(oneCall(disabled, "disabled").args).toEqual([true]);
  expect(oneCall(loading, "disabled").args).toEqual([true]);
  expect(oneCall(loading, "accessibility_label").args).toEqual(["Save"]);
  expect(oneCall(loading, "child").args).toEqual(["Save…"]);
});

test("icon, glyph, and menu callbacks survive repeated builds and stay disabled when inactive", () => {
  const callback = () => {};
  const values = [
    new controls.IconButton("refresh")
      .icon("consumer/icons/refresh.svg")
      .description("Refresh")
      .onClick(callback),
    new controls.GlyphButton("more")
      .glyph("…")
      .description("More actions")
      .onClick(callback),
    new controls.MenuItem("rename").label("Rename").onClick(callback),
  ];

  for (const value of values) {
    const first = value.build(cx);
    const second = value.build(cx);
    expect(first).not.toBe(second);
    expect(oneCall(first, "on_click").args).toEqual([callback]);
    expect(oneCall(second, "on_click").args).toEqual([callback]);
  }

  const inactive = [
    new controls.IconButton("disabled-icon")
      .icon("consumer/icons/refresh.svg")
      .description("Refresh")
      .disabled()
      .onClick(callback)
      .build(cx),
    new controls.GlyphButton("loading-glyph")
      .glyph("…")
      .description("More actions")
      .loading()
      .onClick(callback)
      .build(cx),
    new controls.MenuItem("disabled-menu")
      .label("Rename")
      .disabled()
      .onClick(callback)
      .build(cx),
  ];

  for (const control of inactive) {
    expect(callsTo(control, "on_click")).toHaveLength(0);
  }
});

test("consumer asset paths pass through unchanged", () => {
  const button = new controls.Button("save")
    .label("Save")
    .icon("consumer/brand/save-mark.svg")
    .build(cx);
  const iconButton = new controls.IconButton("refresh")
    .icon("plugins/calendar/refresh.svg")
    .description("Refresh")
    .build(cx);
  const menuItem = new controls.MenuItem("rename")
    .label("Rename")
    .icon("outside-the-library/rename.svg")
    .build(cx);

  expect(callsTo(button, "child")[0].args[0].args).toEqual([
    "consumer/brand/save-mark.svg",
  ]);
  expect(oneCall(iconButton, "child").args[0].args).toEqual(["plugins/calendar/refresh.svg"]);
  const leading = oneCall(menuItem, "child").args[0];
  expect(callsTo(leading, "child")[0].args[0].args).toEqual([
    "outside-the-library/rename.svg",
  ]);
});

test("composed selected hover and focus preserve selection while using exact state tokens", () => {
  applyOmarchyStyle(`
[controls]
normal-border-width = 1
hover-cursor-border-width = 2
selected-border-width = 3
focus-border-width = 4
selected-border-alpha = 0.6
hover-cursor-border-alpha = 0.25
focus-fill-alpha = 0.12
focus-border-alpha = 0.7
`);

  const selected = new controls.Button("save").label("Save").selected().build(cx);
  expect(oneCall(selected, "selected").args).toEqual([true]);
  expect(oneCall(selected, "bg").args).toEqual(["#eeeeee2e"]);
  expect(oneCall(selected, "border").args).toEqual([3]);
  expect(oneCall(selected, "border_color").args).toEqual(["#eeeeee99"]);

  expect(resolvedStyle(selected, "hover")).toMatchObject({
    bg: "#eeeeee2e",
    border: 3,
    border_color: "#eeeeee99",
  });
  expect(resolvedStyle(selected, "focus")).toMatchObject({
    bg: "#eeeeee2e",
    border: 4,
    border_color: "#2233aab3",
  });
  expect(resolvedStyle(selected, "active").bg).toBe("#eeeeee38");

  const unselected = new controls.Button("edit").label("Edit").build(cx);
  expect(resolvedStyle(unselected, "hover")).toMatchObject({
    bg: "#eeeeee14",
    border: 2,
    border_color: "#eeeeee40",
  });
  expect(resolvedStyle(unselected, "focus")).toMatchObject({
    bg: "#eeeeee1f",
    border: 4,
    border_color: "#2233aab3",
  });

  const selectedControls = [
    new controls.IconButton("refresh")
      .icon("consumer/icons/refresh.svg")
      .description("Refresh")
      .selected()
      .build(cx),
    new controls.GlyphButton("more")
      .glyph("…")
      .description("More actions")
      .selected()
      .build(cx),
    new controls.MenuItem("rename").label("Rename").selected().build(cx),
  ];

  for (const control of selectedControls) {
    expect(resolvedStyle(control, "hover").bg).toBe("#eeeeee2e");
    expect(resolvedStyle(control, "focus")).toMatchObject({
      bg: "#eeeeee2e",
      border: 4,
      border_color: "#2233aab3",
    });
  }
});

test("outlined, disabled, and loading states remain visibly distinct", () => {
  const outlined = new controls.Button("outlined").label("Edit").outlined().build(cx);
  const disabled = new controls.Button("disabled").label("Edit").disabled().build(cx);
  const loading = new controls.IconButton("loading")
    .icon("consumer/icons/sync.svg")
    .description("Sync")
    .loading()
    .build(cx);

  expect(oneCall(outlined, "border_color").args).toEqual(["#eeeeee66"]);
  expect(oneCall(outlined, "bg").args).toEqual(["#00000000"]);
  expect(oneCall(disabled, "text_color").args).toEqual(["#999999ff"]);
  expect(callsTo(disabled, "opacity")).toHaveLength(0);
  expect(callsTo(disabled, "hover")).toHaveLength(0);
  expect(callsTo(disabled, "active")).toHaveLength(0);
  expect(oneCall(loading, "accessibility_label").args).toEqual(["Sync"]);
  expect(oneCall(loading, "text_color").args).toEqual(["#999999ff"]);
  expect(callsTo(loading, "opacity")).toHaveLength(0);
  expect(oneCall(loading, "child").args).toEqual(["…"]);
});

test("compact commands and menu items expose focus, hover, press, selection, and disabled states", () => {
  const compact = new controls.GlyphButton("more")
    .glyph("…")
    .description("More actions")
    .selected()
    .build(cx);
  const menuItem = new controls.MenuItem("rename").label("Rename").selected().build(cx);
  const disabledMenuItem = new controls.MenuItem("remove")
    .label("Remove")
    .disabled()
    .build(cx);

  expect(oneCall(compact, "selected").args).toEqual([true]);
  expect(oneCall(compact, "bg").args).toEqual(["#eeeeee2e"]);
  expect(oneCall(compact, "hover").style).toBeDefined();
  expect(oneCall(compact, "active").style).toBeDefined();
  expect(oneCall(compact, "focus").style).toBeDefined();

  expect(oneCall(menuItem, "selected").args).toEqual([true]);
  expect(oneCall(menuItem, "bg").args).toEqual(["#eeeeee2e"]);
  expect(oneCall(menuItem, "hover").style).toBeDefined();
  expect(oneCall(menuItem, "active").style).toBeDefined();
  expect(oneCall(menuItem, "focus").style).toBeDefined();

  expect(oneCall(disabledMenuItem, "text_color").args).toEqual(["#999999ff"]);
  expect(callsTo(disabledMenuItem, "opacity")).toHaveLength(0);
  expect(callsTo(disabledMenuItem, "hover")).toHaveLength(0);
  expect(callsTo(disabledMenuItem, "active")).toHaveLength(0);
});

test("semantic sizes change the complete control frame", () => {
  const small = new controls.Button("small").label("Small").size("small").build(cx);
  const medium = new controls.Button("medium").label("Medium").build(cx);
  const large = new controls.Button("large").label("Large").size("large").build(cx);
  const compactSmall = new controls.IconButton("compact-small")
    .icon("consumer/icons/a.svg")
    .description("Small")
    .size("small")
    .build(cx);
  const compactLarge = new controls.IconButton("compact-large")
    .icon("consumer/icons/a.svg")
    .description("Large")
    .size("large")
    .build(cx);

  expect(oneCall(small, "h").args).toEqual([24]);
  expect(oneCall(medium, "h").args).toEqual([28]);
  expect(oneCall(large, "h").args).toEqual([32]);
  expect(oneCall(small, "text_size").args).toEqual([11]);
  expect(oneCall(medium, "text_size").args).toEqual([12]);
  expect(oneCall(large, "text_size").args).toEqual([14]);
  expect(oneCall(compactSmall, "size").args).toEqual([24]);
  expect(oneCall(compactLarge, "size").args).toEqual([32]);
});

test("field wrappers retain supplied controls, labels, helper copy, and stable ids", () => {
  const rowControl = element("Input", ["row-state"]);
  const formControl = element("Input", ["form-state"]);
  const row = new controls.FieldRow("name").label("Name").control(rowControl).build(cx);
  const form = new controls.FormField("email")
    .label("Email")
    .control(formControl)
    .helper("Used for notifications")
    .build(cx);

  expect(oneCall(row, "id").args).toEqual(["name"]);
  expect(callsTo(row, "child").at(-1).args).toEqual([rowControl]);
  expect(oneCall(form, "id").args).toEqual(["email"]);
  expect(callsTo(form, "child").at(1).args).toEqual([formControl]);
  expect(callsTo(form, "child").at(2).args[0].name).toBe("div");
});

test("separator and keyboard hint values build fresh token-driven descriptions", () => {
  const separator = new controls.Separator();
  const menuSeparator = new controls.MenuSeparator();
  const keycap = new controls.Keycap("Return");
  const hints = new controls.KeyHints("editor-hints")
    .hint("j", "next")
    .hint("k", "previous");

  expect(separator.build(cx)).not.toBe(separator.build(cx));
  expect(oneCall(menuSeparator.build(cx), "child").args[0].name).toBe("v_flex");
  expect(oneCall(keycap.build(cx), "child").args).toEqual(["Return"]);

  const builtHints = hints.build(cx);
  expect(oneCall(builtHints, "id").args).toEqual(["editor-hints"]);
  expect(oneCall(builtHints, "children").args[0]).toHaveLength(2);
});
