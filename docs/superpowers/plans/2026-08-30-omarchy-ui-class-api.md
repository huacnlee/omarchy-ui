# Omarchy UI Class API Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace positional visual helper functions with a deliberate class-based fluent component API while preserving Omarchy presentation and pure theme utilities.

**Architecture:** Each visual module owns independent configuration classes whose camelCase builders return `this` and whose `build(cx)` method creates gpui-base elements without retaining state or causing side effects. Pure style/theme functions stay unchanged. A final integration task freezes explicit exports and migrates the Hello World and documentation.

**Tech Stack:** JavaScript ES modules, gpui-shell `gpui`/`gpui-base`, Bun tests with local recording stubs.

**Spec:** `docs/superpowers/specs/2026-08-30-omarchy-ui-class-api-design.md`

## Global Constraints

- Visual public APIs are classes; lowercase positional visual helpers are not exported.
- Builders are camelCase, mutate the instance, return `this`, and validate closed vocabularies immediately.
- `build(cx)` is repeatable, side-effect free, and validates required semantic content.
- Stable IDs are constructor arguments for interactive/repeated components.
- Consumers own callbacks, domain state, navigation, copy, and complete asset paths.
- Stateful gpui-base models remain consumer-owned; do not duplicate `InputState`.
- All visible states use Omarchy tokens; preserve focus, hover, pressed, selected, disabled, loading, and error treatment where applicable.
- Pure style/theme exports and behavior remain byte-for-byte compatible unless a test-driven API integration requires an import-only change.
- Do not introduce package-manager behavior, dependency installation, generated bundles, or Rust code.

---

### Task 1: Control Classes

**Files:**
- Rewrite: `src/controls.js`
- Create: `tests/controls.test.js`
- Modify only as needed for recording: `tests/gpui-stub.js`

**Interfaces:**
- `new Button(id)`: `.label(text)`, `.icon(asset)`, `.outlined()`, `.bordered(value = true)`, `.selected(value = true)`, `.disabled(value = true)`, `.loading(value = true)`, `.size("small"|"medium"|"large")`, `.onClick(callback)`, `.build(cx)`.
- `new IconButton(id)`: `.icon(asset)`, `.description(text)`, shared state/size/callback builders, `.build(cx)`.
- `new GlyphButton(id)`: `.glyph(text)`, `.description(text)`, shared state/size/callback builders, `.build(cx)`.
- `new MenuItem(id)`: `.label(text)`, `.detail(text)`, `.icon(asset)`, `.selected(value = true)`, `.disabled(value = true)`, `.onClick(callback)`, `.build(cx)`.
- `new FieldRow(id)`: `.label(text)`, `.control(element)`, `.build(cx)`.
- `new FormField(id)`: `.label(text)`, `.control(element)`, `.helper(text)`, `.build(cx)`.
- `Separator`, `MenuSeparator`, `Keycap`, and `KeyHints` are value classes with the minimal semantic constructor/builders described by the spec.

- [ ] Write failing tests for exact class existence, builder chaining identity, required label/icon/description/control validation, size validation, repeated builds, callback wiring, consumer asset paths, and all visible interaction styles.
- [ ] Run `bun test tests/controls.test.js` and confirm failures are due to missing class exports.
- [ ] Rewrite controls around private class configuration and existing gpui-base behavior; consolidate shared internal styling without exporting a base class.
- [ ] Run focused tests and `bun run check`.
- [ ] Commit `feat: add Omarchy control classes`.

---

### Task 2: Layout and Text Classes

**Files:**
- Rewrite: `src/layout.js`
- Create: `tests/layout.test.js`

**Interfaces:**
- `AppShell`: `.top(element)`, `.content(element)`, `.bottom(element)`, `.build(cx)`.
- `TopBar`/`BottomBar`: named builders matching existing semantic slots.
- `ActionBar(id)`: `.actions(element)`, `.status(element)`, `.build(cx)`.
- `PanelHeader(id)`: `.heading(element)`, `.actions(element)`, `.build(cx)`.
- `CenteredWorkspace(id)`: `.content(element)`, `.build(cx)`.
- `PageColumn(id)`: `.child(element)`, `.children(elements)`, width builders matching existing behavior, `.build(cx)`.
- `Surface` and `PopupSurface(id)`: `.child(element)`, `.children(elements)`, `.build(cx)`.
- `Label`, `MutedText`, `Title`, `SectionLabel`: `.text(value)` plus `build(cx)`; constructor may accept initial text.

- [ ] Write failing tests for named slots, child ordering, repeated builds, missing required content, stable IDs, and unchanged resolved layout/style properties.
- [ ] Verify RED with `bun test tests/layout.test.js`.
- [ ] Rewrite layout/text helpers as independent classes; no global or retained state.
- [ ] Run focused tests and `bun run check`.
- [ ] Commit `feat: add Omarchy layout classes`.

---

### Task 3: Data and Feedback Classes

**Files:**
- Rewrite: `src/data.js`
- Rewrite: `src/feedback.js`
- Create: `tests/data-feedback.test.js`

**Interfaces:**
- `ListRow(id)`: `.selected(value = true)`, `.child(element)`, `.children(elements)`, `.build(cx)`.
- `EmptyState`: `.heading(text)`, `.hint(text)`, `.build(cx)`.
- `StatusLine`: `.label(text)`, `.state("ready"|"loading"|"error")`, `.build(cx)`.

- [ ] Write failing tests for defaults, chaining, content order, selected presentation, status vocabulary validation, and ready/loading/error rendering.
- [ ] Verify RED with `bun test tests/data-feedback.test.js`.
- [ ] Implement the three value classes using existing token behavior.
- [ ] Run focused tests and `bun run check`.
- [ ] Commit `feat: add Omarchy data and feedback classes`.

---

### Task 4: Public Entry, Example, and Documentation Migration

**Files:**
- Rewrite: `src/index.js`
- Rewrite: `tests/public-api.test.js`
- Rewrite: `tests/render.test.js`
- Modify: `tests/example.test.js`
- Modify: `examples/hello-world/main.js`
- Modify: `README.md`
- Modify: `examples/hello-world/README.md`

**Interfaces:**
- Explicitly exports every class in Tasks 1-3 and all unchanged pure style/theme functions.
- Exports no lowercase visual helper and uses no `export *`.

- [ ] Update the exact-key API test first and confirm it fails against helper exports.
- [ ] Rewrite the integration render test to compose a complete shell exclusively through public classes and `.build(cx)`.
- [ ] Migrate Hello World to `new AppShell()`, text/surface classes, and `new Button(...).build(cx)` while preserving theme initialization and Git shorthand.
- [ ] Rewrite README API examples and component catalog; document required fields, defaults, builder validation, state ownership, and complete asset paths.
- [ ] Run all focused tests, `bun run check`, terminology scans, and `git diff --check`.
- [ ] Commit `refactor: publish the Omarchy UI class API`.

---

### Task 5: Integration and Review

**Files:**
- Modify only defects demonstrated by review or integration tests.

- [ ] Run `bun run check` and confirm no generated/untracked files.
- [ ] Push the reviewed omarchy-ui commits so the Git dependency resolves the class API.
- [ ] Run the feature-build `gpui-shell check` against `examples/hello-world` and confirm the GitHub shorthand resolves through `~/.gpui-shell/cache/dependencies/`.
- [ ] Request a whole-branch API/design review against both gpui-component guides and the class API spec.
- [ ] Fix Critical/Important findings with focused regression tests, rerun all checks, push, and report final evidence.
