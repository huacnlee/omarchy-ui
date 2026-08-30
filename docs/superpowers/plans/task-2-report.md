# Task 2 report: Layout and text classes

## Scope

- Replaced the lowercase visual helpers in `src/layout.js` with the specified
  `AppShell`, bar, workspace, surface, and text value classes.
- Kept configuration private, builders camelCase and identity-preserving, and
  every `build(cx)` repeatable without consuming configuration.
- Preserved the existing stable IDs, child order, semantic roles, live style
  token lookups, theme colors, surface resolution, and layout operations.
- Added focused coverage in `tests/layout.test.js`; no recording-stub or public
  entry changes were needed.

## TDD evidence

- Initial RED: `bun test tests/layout.test.js` failed at module load because
  the named class exports did not exist.
- GREEN: the focused suite passed after the class rewrite.
- A review found three text builder methods were not exercised directly. They
  were removed, the test was expanded, and RED was observed as
  `TypeError: component.text is not a function`; the minimal builders restored
  GREEN.
- The full check then exposed order-dependent default-token assertions after
  `style.test.js` changes the live singleton. Tests were corrected to assert
  mapping to the current live tokens, preserving both isolation and the
  no-hard-coded-style contract.

## Verification

- `bun test tests/layout.test.js`: 8 passed, 0 failed, 187 assertions.
- `git diff --check -- src/layout.js tests/layout.test.js`: clean.
- `bun run check`: 43 runnable tests passed. The only three failures were the
  expected Task 4 module-load errors: stale `src/index.js` still imports the
  removed lowercase `actionBar` export from `src/layout.js` for
  `example.test.js`, `public-api.test.js`, and `render.test.js`.

## Concerns

- Full integration remains intentionally blocked on Task 4 updating the public
  entry and consumers to the class API. No Task 2 focused failure remains.
