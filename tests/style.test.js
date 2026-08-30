// @ts-check

import { describe, expect, test } from "bun:test";
import {
  alpha,
  applyOmarchyStyle,
  capSaturation,
  formatColor,
  mix,
  omarchyStyle,
  parseColor,
  parseHyprlandColor,
  parseShellToml,
  resolveSurfaceColor,
  style,
} from "../src/style.js";

describe("Bun harness", () => {
  test("maps gpui and gpui-base imports to the local recording stub", async () => {
    const [gpui, gpuiBase] = await Promise.all([import("gpui"), import("gpui-base")]);
    gpui.reset();
    gpui.record("div", "child");
    expect(gpui.calls).toEqual([{ name: "div", args: ["child"] }]);
    expect(gpuiBase.calls).toBe(gpui.calls);
  });
});

describe("style", () => {
  test("parses shell sections, quoted values, and comments", () => {
    expect(parseShellToml(`ignored = "value"\n[font]\nbase-size = "15" # comment\n[spacing]\nscale = 1.5`)).toEqual({
      "font.base-size": "15",
      "spacing.scale": "1.5",
    });
  });

  test("parses, formats, combines, and caps colors", () => {
    expect(parseColor("#abc")).toEqual({ r: 170 / 255, g: 187 / 255, b: 204 / 255, a: 1 });
    expect(parseColor("invalid")).toBeNull();
    expect(formatColor({ r: 1, g: 0.5, b: 0, a: 0.25 })).toBe("#ff800040");
    expect(alpha("#123456", 0.5)).toBe("#12345680");
    expect(mix("#000000", "#ffffff", 0.25)).toBe("#404040ff");
    expect(capSaturation("#ff0000", 0.5)).toBe("#bf4040ff");
  });

  test("derives shell tokens and replaces the active style", () => {
    const source = `[font]\nbase-size = 15\n[spacing]\nscale = 1.2\nscale-with-font = true\nmd = 9\n[controls]\nhover-cursor-fill-alpha = 2\n[popups]\nbackground = "hyprland.active-border"\nbackground-alpha = 0.4\n[hyprland]\nactive-border = "rgb(336699)"`;
    const tokens = omarchyStyle(source, { cornerRadius: 3, fontFamily: "Iosevka" });

    expect(tokens.spacingScale).toBe(1.5);
    expect(tokens.spacing.md).toBe(9);
    expect(tokens.font.title).toBe(18);
    expect(tokens.cornerRadius).toBe(3);
    expect(tokens.state.hoverFillAlpha).toBe(1);
    expect(tokens.surfaces.popupBackground).toBe("hyprland.active-border");
    expect(applyOmarchyStyle(source, { cornerRadius: 3 })).toBe(style());
  });

  test("uses the first Hyprland gradient stop and resolves configured surfaces", () => {
    expect(parseHyprlandColor("rgba(11223380) 45deg rgb(ffffff)")).toBe("#11223380");
    expect(parseHyprlandColor("0x80112233")).toBe("#11223380");
    const tokens = omarchyStyle(`[hyprland]\nactive-border = "rgba(11223380) 45deg"`);
    expect(resolveSurfaceColor(tokens, "hyprland.active-border", "#000000ff", 0.5)).toBe("#11223380");
    expect(resolveSurfaceColor(tokens, "invalid", "#000000ff")).toBe("#000000ff");
  });
});
