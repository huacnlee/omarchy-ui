// @ts-check

import { expect, test } from "bun:test";
import * as ui from "../src/index.js";

test("exports exactly the frozen generic Omarchy UI API", () => {
  expect(Object.keys(ui).sort()).toEqual([
    "actionBar",
    "alpha",
    "appFrame",
    "appShell",
    "applyOmarchyRoles",
    "applyOmarchyStyle",
    "bottomBar",
    "button",
    "capSaturation",
    "centeredWorkspace",
    "emptyState",
    "field",
    "fieldRow",
    "formField",
    "formatColor",
    "glyphButton",
    "iconButton",
    "iconTextButton",
    "kbd",
    "keyHints",
    "label",
    "menuItem",
    "menuSeparator",
    "mix",
    "muted",
    "omarchyBaseColors",
    "omarchyRoles",
    "omarchyStatusColors",
    "omarchyStyle",
    "omarchyTheme",
    "pageColumn",
    "panelHeader",
    "parseColor",
    "parseHyprlandColor",
    "parseShellToml",
    "popupSurface",
    "resolveSurfaceColor",
    "role",
    "roles",
    "rowShell",
    "sectionLabel",
    "separator",
    "statusLine",
    "style",
    "surface",
    "title",
    "topBar",
  ]);

  expect(ui).not.toHaveProperty("actionButton");
  expect(ui).not.toHaveProperty("brandLockup");
  expect(ui).not.toHaveProperty("iconAsset");
  expect(ui).not.toHaveProperty("omarchyStyleFrom");
});
