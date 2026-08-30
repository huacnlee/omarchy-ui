// @ts-check

import { describe, expect, test } from "bun:test";
import { omarchyStyle } from "../src/style.js";
import {
  applyOmarchyRoles,
  omarchyBaseColors,
  omarchyRoles,
  omarchyStatusColors,
  omarchyTheme,
  role,
  roles,
} from "../src/theme.js";

const palette = `background = "#101010"\nforeground = "#eeeeee"\naccent = "#3366ff"\nred = "#ff3366"\ngreen = "#22cc88"\nyellow = "#ffcc00"\nblue = "#3366ff"\nmagenta = "#bb55dd"\ncyan = "#22ccdd"\nlighter_background = "#202020"\nmode = "light"`;

describe("theme", () => {
  test("selects base and status colors from the palette", () => {
    expect(omarchyBaseColors(palette)).toEqual([
      "#ff3366",
      "#22cc88",
      "#ffcc00",
      "#3366ff",
      "#bb55dd",
      "#22ccdd",
    ]);
    expect(omarchyStatusColors(palette)).toEqual({ danger: "#ff3366", success: "#22cc88", warning: "#ffcc00", info: "#22ccdd" });
  });

  test("derives Omarchy roles and rejects incomplete palettes", () => {
    const derived = omarchyRoles(palette);
    expect(derived).toMatchObject({ background: "#101010", foreground: "#eeeeee", accent: "#3366ff", danger: "#ff3366", separator: "#2b2b2bff" });
    expect(omarchyRoles('background = "#000000"')).toBeNull();
  });

  test("projects complete semantic theme tokens", () => {
    const fallback = { colors: { unexpected: "#abcdef" } };
    const theme = omarchyTheme(palette, fallback, omarchyStyle("", { cornerRadius: 2 }));
    expect(theme).toMatchObject({
      appearance: "light",
      tokens: {
        radius: { sm: 2, full: 9999 },
        colors: { unexpected: "#abcdef", background: "#101010", surface: "#101010", primary: "#3366ff", border: "#696969ff" },
      },
    });
  });

  test("stores and resolves the live derived roles", () => {
    expect(applyOmarchyRoles(palette)).toBe(roles());
    expect(role("link", "#000000ff")).toBe("#617dd1ff");
    applyOmarchyRoles("");
    expect(role("link", "#000000ff")).toBe("#000000ff");
  });
});
