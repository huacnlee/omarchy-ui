# Omarchy UI Extraction Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Extract Omamail's Omarchy UI primitives into a polished standalone JavaScript foundation for gpui-shell, with a minimal Git-dependency Hello World.

**Architecture:** Pure style/theme modules underpin generic GPUI components, all exposed through one explicit `src/index.js`. Bun runs dependency-free tests through local GPUI stubs. gpui-shell owns remote acquisition and stores mirrors, locks, and immutable checkouts below `~/.gpui-shell/cache/dependencies/`; neither the library nor example uses `node_modules`.

**Tech Stack:** JavaScript ES modules, gpui-shell built-in `gpui` and `gpui-base`, Bun test runner, Git.

**Spec:** `docs/superpowers/specs/2026-08-30-omarchy-ui-extraction-design.md`

## Global Constraints

- Start from the current `/home/jason/work/omamail/app/lib/omarchy-ui` snapshot without preserving its Git history.
- Put all reusable code under `src/`; include no Rust code in omarchy-ui.
- Keep `package.json` private and use it only for ESM semantics and `bun run` commands.
- Add no registry dependencies, lockfiles, `node_modules`, npm publishing fields, or Node runtime APIs.
- Make `src/index.js` the only stable consumer entry, with explicit named exports.
- Keep consumer domain logic, copy, navigation, IDs, callbacks, and assets outside the library.
- Use `// @ts-check`, JSDoc, two-space indentation, and semicolons.
- Keep the example minimal and import `omarchy-ui` through a manifest Git dependency.

---

### Task 1: Move gpui-shell's Git Dependency Cache

**Files:**
- Modify: `/home/jason/work/gpui-component/.worktrees/shell-git-dependencies/crates/shell/src/dependencies.rs`
- Modify: `/home/jason/work/gpui-component/.worktrees/shell-git-dependencies/crates/shell/README.md`
- Modify: `/home/jason/work/gpui-component/.worktrees/shell-git-dependencies/docs/gpui-shell.md`
- Modify: `/home/jason/work/gpui-component/.worktrees/shell-git-dependencies/website/shell/capabilities.md`
- Modify: `/home/jason/work/gpui-component/.worktrees/shell-git-dependencies/website/zh-CN/shell/capabilities.md`

**Interfaces:**
- Produces: `DependencyCache::for_user()` rooted at `<home>/.gpui-shell/cache/dependencies` on every supported platform.
- Preserves: SHA-256 remote identities, verified origins, per-remote locks, bare mirrors, commit-addressed checkouts, atomic publication, and Git timeouts.

- [ ] Add a failing unit test that supplies a deterministic home path and expects `.gpui-shell/cache/dependencies`.
- [ ] Run the focused dependency test and confirm it fails with the old platform data-directory path.
- [ ] Refactor cache-root construction behind a testable helper and implement the home-relative path without reading `HOME` in tests.
- [ ] Update English and Chinese docs to name `~/.gpui-shell/cache/dependencies/` exactly and state that no `node_modules` directory participates.
- [ ] Run `cargo fmt --all -- --check`, `cargo clippy -p gpui-shell --all-targets -- -D warnings`, and `cargo test -p gpui-shell --lib --locked`.
- [ ] Commit with `git commit -m "fix(shell): store Git dependencies in the shell cache"` and push `feat/shell-git-dependencies` to update PR #2879.

---

### Task 2: Bun Harness and Pure Style Foundation

**Files:**
- Create: `package.json`, `bunfig.toml`
- Create: `tests/setup.js`, `tests/gpui-stub.js`, `tests/style.test.js`, `tests/theme.test.js`
- Create: `src/style.js`, `src/theme.js`

**Interfaces:**
- Style exports: `parseShellToml`, `parseColor`, `formatColor`, `alpha`, `mix`, `capSaturation`, `omarchyStyle`, `style`, `applyOmarchyStyle`, `parseHyprlandColor`, `resolveSurfaceColor`.
- Theme exports: `omarchyBaseColors`, `omarchyStatusColors`, `omarchyRoles`, `omarchyTheme`, `roles`, `role`, `applyOmarchyRoles`.

- [ ] Create a private ESM `package.json` whose only scripts are `"test": "bun test"` and `"check": "bun test"`; declare no dependencies or publishing fields.
- [ ] Configure Bun test preload and a local `Bun.plugin` resolver mapping `gpui` and `gpui-base` to a recording stub.
- [ ] Port current Omamail style/theme assertions using `bun:test`, importing missing `src` modules so the first run fails for the expected resolution reason.
- [ ] Extract `style.js` and `theme.js`, preserving tested behavior and removing redundant `omarchyStyleFrom`.
- [ ] Run `bun test tests/style.test.js tests/theme.test.js` and `bun run check`.
- [ ] Commit with `git commit -m "feat: extract Omarchy style and theme foundation"`.

---

### Task 3: Generic Components and Frozen Public API

**Files:**
- Create: `src/layout.js`, `src/controls.js`, `src/data.js`, `src/feedback.js`, `src/index.js`
- Create: `tests/public-api.test.js`, `tests/render.test.js`

**Interfaces:**
- Layout exports: `label`, `muted`, `title`, `sectionLabel`, `panelHeader`, `appFrame`, `topBar`, `bottomBar`, `actionBar`, `appShell`, `centeredWorkspace`, `pageColumn`, `surface`, `popupSurface`.
- Control exports: `button`, `iconTextButton`, `iconButton`, `glyphButton`, `field`, `fieldRow`, `formField`, `menuItem`, `separator`, `menuSeparator`, `kbd`, `keyHints`.
- Data/feedback exports: `rowShell`, `emptyState`, `statusLine`.
- Icon controls accept complete consumer-owned asset paths; callbacks use ID, content/asset, callback, context, options ordering.

- [ ] Write an exact-key public API test that excludes Omamail-specific `brandLockup`, `actionButton`, fixed icon-path helpers, and `omarchyStyleFrom`.
- [ ] Write a render test composing `appShell`, `centeredWorkspace`, `pageColumn`, `surface`, `title`, controls, rows, and status states through `src/index.js`; verify the first run fails because the modules are absent.
- [ ] Extract the four component modules, remove Omamail/Gmail copy and asset assumptions, and document option/state unions with JSDoc.
- [ ] Write explicit grouped re-exports in `src/index.js`; do not use `export *`.
- [ ] Run focused public API/render tests and `bun run check`.
- [ ] Commit with `git commit -m "feat: expose generic Omarchy UI primitives"`.

---

### Task 4: Minimal Git-Dependency Example and Documentation

**Files:**
- Create: `examples/hello-world/gpui-shell.json`, `examples/hello-world/main.js`, `examples/hello-world/README.md`
- Create: `tests/example.test.js`, `README.md`

**Interfaces:**
- The manifest dependency is named `omarchy-ui`, uses `https://github.com/huacnlee/omarchy-ui`, branch `main`, and entry `src/index.js`.
- `main.js` uses `import { ... } from "omarchy-ui"` and requests no capabilities.

- [ ] Write a failing static test that checks the manifest selector/entry and rejects imports containing `node_modules` or a relative library path.
- [ ] Create the minimal app: one title, one sentence, and one bordered button inside `appShell`, using style tokens instead of raw spacing.
- [ ] Document branch and tag manifest forms, explicit public imports, API layers, consumer-owned assets, Bun commands, and gpui-shell commands.
- [ ] Run `bun test tests/example.test.js`, `bun run check`, and `git diff --check`.
- [ ] Commit with `git commit -m "docs: add gpui-shell Hello World"`.

---

### Task 5: Publish and Verify the Real Remote Dependency

**Files:**
- Modify only files with a defect demonstrated by the integration check.

**Interfaces:**
- Consumes: the feature-build gpui-shell and complete local omarchy-ui `main`.
- Produces: `huacnlee/omarchy-ui:main` with a Hello World that resolves the published library into `~/.gpui-shell/cache/dependencies/`.

- [ ] Run `bun run check`, `git diff --check`, and confirm the worktree contains only planned commits.
- [ ] Push omarchy-ui `main` so its self-referencing example can fetch the library.
- [ ] Run `/home/jason/work/gpui-component/.worktrees/shell-git-dependencies/target/debug/gpui-shell check .` from `examples/hello-world`.
- [ ] Confirm the dependency cache exists under `~/.gpui-shell/cache/dependencies/` and that the example contains no `node_modules`.
- [ ] If integration fails, first add the narrowest Bun regression test, then make the minimal correction and rerun both Bun and gpui-shell checks.
- [ ] Commit and push any verified correction; finish with a clean `main...origin/main` and report test evidence and commit SHAs.
