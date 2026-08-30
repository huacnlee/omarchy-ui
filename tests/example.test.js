// @ts-check

import { afterEach, expect, test } from "bun:test";
import HelloWorld from "../examples/hello-world/main.js";
import { calls, reset } from "./gpui-stub.js";
import { applyOmarchyRoles, roles, style } from "../src/index.js";

const exampleRoot = new URL("../examples/hello-world/", import.meta.url);

afterEach(() => {
  applyOmarchyRoles("");
});

test("Hello World resolves omarchy-ui from the Git shorthand dependency", async () => {
  const manifest = JSON.parse(
    await Bun.file(new URL("gpui-shell.json", exampleRoot)).text(),
  );
  const packageManifest = JSON.parse(
    await Bun.file(new URL("../package.json", import.meta.url)).text(),
  );

  expect(manifest.dependencies).toEqual({
    "omarchy-ui": "huacnlee/omarchy-ui",
  });
  expect(manifest.dependencies["omarchy-ui"]).toBe("huacnlee/omarchy-ui");
  expect(manifest).not.toHaveProperty("capabilities");
  expect(packageManifest.main).toBe("src/index.js");
  expect(packageManifest).not.toHaveProperty("dependencies");
  expect(packageManifest).not.toHaveProperty("devDependencies");
});

test("Hello World imports omarchy-ui as a bare module without local package paths", async () => {
  const source = await Bun.file(new URL("main.js", exampleRoot)).text();

  expect(source).toMatch(/from\s+["']omarchy-ui["']/);
  expect(source).not.toMatch(/from\s+["'][^"']*node_modules[^"']*["']/);
  expect(source).not.toMatch(/from\s+["'](?:\.\/|\.\.\/)[^"']*(?:omarchy-ui|src\/index\.js)[^"']*["']/);
});

test("Hello World initializes and installs an Omarchy theme before rendering", () => {
  reset();
  const fallback = {
    colors: {
      background: "fallback-background",
      foreground: "fallback-foreground",
    },
  };
  const cx = { theme: () => fallback, notify: () => {} };
  const view = new HelloWorld();

  view.init({}, cx);

  const installed = calls.filter((call) => call.name === "set_theme");
  expect(installed).toHaveLength(1);
  expect(installed[0].args[0]).toMatchObject({
    appearance: "dark",
    tokens: {
      colors: {
        background: "#1a1b26",
        foreground: "#c0caf5",
        ring: "#7aa2f7",
      },
    },
  });
  expect(style().font.baseSize).toBe(12);
  expect(roles()).toMatchObject({
    background: "#1a1b26",
    foreground: "#c0caf5",
    accent: "#7aa2f7",
  });
  expect(view.render(cx).name).toBe("v_flex");
});

test("Hello World's generated gpui.d.ts is ignored by Git", async () => {
  const result = Bun.spawnSync([
    "git",
    "check-ignore",
    "-q",
    "examples/hello-world/gpui.d.ts",
  ]);

  expect(result.exitCode).toBe(0);
});
