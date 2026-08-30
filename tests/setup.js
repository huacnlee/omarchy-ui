// @ts-check

const stubUrl = new URL("./gpui-stub.js", import.meta.url).href;

Bun.plugin({
  name: "local-gpui-stub",
  setup(build) {
    for (const specifier of ["gpui", "gpui-base"]) {
      build.module(specifier, () => ({
        contents: `export * from ${JSON.stringify(stubUrl)};`,
        loader: "js",
      }));
    }
  },
});
