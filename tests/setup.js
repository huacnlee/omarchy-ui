// @ts-check

const stubUrl = new URL("./gpui-stub.js", import.meta.url).href;
const libraryUrl = new URL("../src/index.js", import.meta.url).href;

Bun.plugin({
  name: "local-gpui-stub",
  setup(build) {
    for (const specifier of ["gpui-kit", "gpui-base"]) {
      build.module(specifier, () => ({
        contents: `export * from ${JSON.stringify(stubUrl)};`,
        loader: "js",
      }));
    }
    build.module("omarchy-ui", () => ({
      contents: `export * from ${JSON.stringify(libraryUrl)};`,
      loader: "js",
    }));
  },
});
