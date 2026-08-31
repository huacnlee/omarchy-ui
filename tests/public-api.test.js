// @ts-check

import { expect, test } from "bun:test";
import * as ui from "../src/index.js";

/**
 * Every builder a caller can reach, including the ones a shared base class
 * supplies. The four text roles differ only in their defaults, so their
 * builders live on one base; a check that looked at the leaf prototype alone
 * would report those roles as having no API at all.
 * @param {Function} value
 */
function builders(value) {
  /** @type {Set<string>} */
  const names = new Set();
  let prototype = value.prototype;
  while (prototype && prototype !== Object.prototype) {
    for (const name of Object.getOwnPropertyNames(prototype)) names.add(name);
    prototype = Object.getPrototypeOf(prototype);
  }
  return [...names].sort();
}

test("exports exactly the frozen generic Omarchy UI API", () => {
  expect(Object.keys(ui).sort()).toEqual([
    "AccordionGroup",
    "AccordionSection",
    "ActionBar",
    "Alert",
    "AppShell",
    "Avatar",
    "Badge",
    "BottomBar",
    "Button",
    "CellStack",
    "CenteredWorkspace",
    "CodeBlock",
    "DefinitionList",
    "EmptyState",
    "ExternalLink",
    "FieldRow",
    "FilterField",
    "FormField",
    "GlyphButton",
    "IconButton",
    "KeyHints",
    "Keycap",
    "Label",
    "ListRow",
    "MenuItem",
    "MenuSeparator",
    "Metric",
    "MetricGrid",
    "MutedText",
    "PageColumn",
    "Panel",
    "PanelHeader",
    "PopupSurface",
    "SectionLabel",
    "Separator",
    "StatusLine",
    "Step",
    "Surface",
    "TableHeaderRow",
    "TableRow",
    "Title",
    "Toolbar",
    "TopBar",
    "alpha",
    "applyOmarchyRoles",
    "applyOmarchyStyle",
    "capSaturation",
    "formatColor",
    "mix",
    "omarchyBaseColors",
    "omarchyRoles",
    "omarchyStatusColors",
    "omarchyStyle",
    "omarchyTheme",
    "parseColor",
    "parseHyprlandColor",
    "parseShellToml",
    "resolveSurfaceColor",
    "role",
    "roles",
    "style",
    "tableHeaderHeight",
  ]);

  expect(ui).not.toHaveProperty("actionButton");
  expect(ui).not.toHaveProperty("brandLockup");
  expect(ui).not.toHaveProperty("iconAsset");
  expect(ui).not.toHaveProperty("omarchyStyleFrom");
});

test("interactive and validation classes expose the exact reviewed builders", () => {
  expect(builders(ui.Button)).toEqual([
    "accent",
    "bordered",
    "build",
    "constructor",
    "danger",
    "disabled",
    "icon",
    "label",
    "loading",
    "loadingLabel",
    "onClick",
    "outlined",
    "selected",
    "size",
  ]);
  expect(builders(ui.IconButton)).toEqual([
    "bordered",
    "build",
    "constructor",
    "description",
    "disabled",
    "icon",
    "loading",
    "loadingLabel",
    "onClick",
    "outlined",
    "selected",
    "size",
  ]);
  expect(builders(ui.GlyphButton)).toEqual([
    "bordered",
    "build",
    "constructor",
    "description",
    "disabled",
    "glyph",
    "loading",
    "loadingLabel",
    "onClick",
    "outlined",
    "selected",
    "size",
  ]);
  expect(builders(ui.MenuItem)).toEqual([
    "build",
    "constructor",
    "danger",
    "detail",
    "disabled",
    "icon",
    "label",
    "onClick",
    "selected",
  ]);
  expect(builders(ui.FormField)).toEqual([
    "build",
    "constructor",
    "control",
    "error",
    "helper",
    "label",
  ]);
  expect(builders(ui.ListRow)).toEqual([
    "build",
    "child",
    "children",
    "constructor",
    "disabled",
    "onClick",
    "selected",
  ]);
  expect(builders(ui.StatusLine)).toEqual([
    "build",
    "constructor",
    "label",
    "loadingLabel",
    "state",
  ]);
  expect(builders(ui.ExternalLink)).toEqual([
    "build",
    "constructor",
    "href",
    "label",
  ]);
  expect(builders(ui.FilterField)).toEqual([
    "build",
    "constructor",
    "size",
    "state",
    "width",
  ]);
});

test("layout, text, and value classes expose only the reviewed builders", () => {
  const text = ["build", "constructor", "size", "strong", "text", "tone", "truncate"];
  const methods = {
    AccordionGroup: ["build", "child", "constructor"],
    AccordionSection: [
      "body",
      "build",
      "constructor",
      "detail",
      "inset",
      "keepMounted",
      "level",
      "onToggle",
      "open",
      "title",
    ],
    ActionBar: ["actions", "build", "constructor", "status"],
    Alert: ["build", "color", "constructor", "message", "tone"],
    AppShell: ["bottom", "build", "constructor", "content", "top"],
    Avatar: [
      "build",
      "constructor",
      "description",
      "extent",
      "icon",
      "initials",
      "tint",
    ],
    Badge: [
      "build",
      "color",
      "constructor",
      "description",
      "dot",
      "label",
      "quiet",
      "tone",
    ],
    BottomBar: ["build", "constructor", "hints", "leadsWithIcon", "status"],
    CellStack: ["align", "build", "child", "constructor"],
    CenteredWorkspace: ["build", "constructor", "content"],
    CodeBlock: ["build", "constructor", "value"],
    DefinitionList: ["build", "constructor", "entry"],
    EmptyState: ["build", "constructor", "heading", "hint"],
    FieldRow: ["build", "constructor", "control", "label"],
    KeyHints: ["build", "constructor", "hint"],
    Keycap: ["build", "constructor", "pressed", "quiet"],
    Label: text,
    MenuSeparator: ["build", "constructor"],
    Metric: ["basis", "build", "constructor", "size", "title", "tone", "value"],
    MetricGrid: ["build", "child", "children", "constructor"],
    MutedText: text,
    PageColumn: ["build", "child", "children", "constructor", "maxWidth"],
    Panel: [
      "accessory",
      "build",
      "constructor",
      "content",
      "grow",
      "note",
      "title",
    ],
    PanelHeader: ["actions", "build", "constructor", "heading"],
    PopupSurface: ["build", "child", "children", "constructor"],
    SectionLabel: text,
    Separator: ["build", "constructor"],
    Step: ["build", "constructor", "title"],
    Surface: ["build", "child", "children", "constructor"],
    TableHeaderRow: ["build", "column", "columns", "constructor"],
    TableRow: [
      "build",
      "cell",
      "constructor",
      "dimmed",
      "height",
      "onClick",
      "selected",
    ],
    Title: text,
    Toolbar: ["build", "constructor", "leading", "trailing"],
    TopBar: ["actions", "brand", "build", "center", "constructor"],
  };

  for (const [name, expected] of Object.entries(methods)) {
    expect(builders(ui[name]), name).toEqual(expected);
  }
});
