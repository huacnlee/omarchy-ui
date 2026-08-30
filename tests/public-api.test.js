// @ts-check

import { expect, test } from "bun:test";
import * as ui from "../src/index.js";

test("exports exactly the frozen generic Omarchy UI API", () => {
  expect(Object.keys(ui).sort()).toEqual([
    "ActionBar",
    "AppShell",
    "BottomBar",
    "Button",
    "CenteredWorkspace",
    "EmptyState",
    "FieldRow",
    "FormField",
    "GlyphButton",
    "IconButton",
    "KeyHints",
    "Keycap",
    "Label",
    "ListRow",
    "MenuItem",
    "MenuSeparator",
    "MutedText",
    "PageColumn",
    "PanelHeader",
    "PopupSurface",
    "SectionLabel",
    "Separator",
    "StatusLine",
    "Surface",
    "Title",
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
  ]);

  expect(ui).not.toHaveProperty("actionButton");
  expect(ui).not.toHaveProperty("brandLockup");
  expect(ui).not.toHaveProperty("iconAsset");
  expect(ui).not.toHaveProperty("omarchyStyleFrom");
});
