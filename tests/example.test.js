// @ts-check

import { expect, test } from "bun:test";

const exampleRoot = new URL("../examples/hello-world/", import.meta.url);

test("Hello World resolves omarchy-ui from its main-branch Git dependency", async () => {
  const manifest = JSON.parse(
    await Bun.file(new URL("gpui-shell.json", exampleRoot)).text(),
  );

  expect(manifest.dependencies).toEqual({
    "omarchy-ui": {
      git: "git@github.com:huacnlee/omarchy-ui.git",
      branch: "main",
      entry: "src/index.js",
    },
  });
  expect(manifest).not.toHaveProperty("capabilities");
});

test("Hello World imports omarchy-ui as a bare module without local package paths", async () => {
  const source = await Bun.file(new URL("main.js", exampleRoot)).text();

  expect(source).toMatch(/from\s+["']omarchy-ui["']/);
  expect(source).not.toMatch(/from\s+["'][^"']*node_modules[^"']*["']/);
  expect(source).not.toMatch(/from\s+["'](?:\.\/|\.\.\/)[^"']*(?:omarchy-ui|src\/index\.js)[^"']*["']/);
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
