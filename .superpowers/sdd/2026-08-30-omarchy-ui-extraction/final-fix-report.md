# Final Review Fix Report

## Scope and findings

The final review findings were reproduced against the extracted library and
the `feat/shell-git-dependencies` worktree. All were genuine:

- `button`, its icon/glyph variants, and `menuItem` relied on hover/active
  presentation and did not declare a focused presentation through gpui-shell's
  supported `.focus(...)` state-style API.
- Hello World rendered Omarchy UI primitives but never called the style, role,
  theme projection, or gpui-base theme installation APIs.
- `GitDependencyStore::for_user` silently used the shared temporary directory
  when both home variables were unavailable and accepted a relative selected
  home, allowing a cache root below the process working directory.
- Review-only fixture debt remained: mail-specific vocabulary survived in
  generic production comments/tests, a declared list subtree was never attached
  to the render composition, and several style fixture declarations had no
  meaningful assertion.
- The final remote contract changed from SSH-with-`.git` to the exact URL
  `https://github.com/huacnlee/omarchy-ui`.

## Omarchy UI corrections

- Extended the recording GPUI stub to execute and retain detached hover,
  active, and focus style refinements.
- Added render regressions for labeled, icon-text, icon-only, glyph, and menu
  controls. Each asserts the focus fill, focus border width, and focus border
  color produced from `focusFillAlpha`, `focusBorderWidth`,
  `focusBorderAlpha`, and the semantic `ring` token.
- Applied that focus presentation through gpui-shell's real `.focus(...)` API
  in the shared labeled-button path, compact icon/glyph path, and menu-item
  path. Disabled controls remain non-focusable through gpui-base's Button
  behavior.
- Added a real Hello World initialization test. It instantiates the example,
  runs `init`, observes one built-in `set_theme` call, verifies projected
  background/foreground/ring colors, and confirms the live Omarchy style and
  derived roles were initialized before rendering.
- Kept the example minimal and capability-free by embedding a small
  demonstration palette and shell-style source. `init` passes those sources
  through `applyOmarchyStyle`, `applyOmarchyRoles`, and `omarchyTheme`, then
  installs the complete projection with gpui-base's built-in `set_theme`.
  There are no host-runtime APIs, registry dependencies, lockfiles, or
  generated dependency directories.
- Updated the manifest, root/example READMEs, extraction plan, and exact static
  assertion to use `https://github.com/huacnlee/omarchy-ui` without `.git`.
- Replaced mail-specific example/test terminology with generic projects and
  application surfaces; replaced production comments about reader/mail/unread
  UI with generic panel/status language.
- Attached the list surface to the page's actual `children` input and asserted
  that attachment. Removed unused `[bar]`, control-color, and popup-background
  fixture declarations, then directly asserted the remaining configured
  control widths and Hyprland/popup surface keys.

## gpui-shell corrections

- Changed `GitDependencyStore::for_user` and its environment seam to return
  `Result`, propagating failure through `ShellRuntime::new_isolated`.
- The first non-empty `HOME` or `USERPROFILE` remains authoritative. Missing or
  empty values now return a clear error instead of choosing `temp_dir`; a
  relative selected value returns an error naming the variable, requirement,
  and unsafe value instead of falling through or joining it.
- Preserved deterministic normal `HOME`, fallback `USERPROFILE`, and
  empty-`HOME`/valid-`USERPROFILE` coverage. Added deterministic missing,
  both-empty, and relative-selected-home coverage.
- Updated the existing branch dependency parser regression to use and assert
  the exact HTTPS Omarchy UI URL without `.git`. No parser change was required;
  the existing Git URL contract already accepts it.
- Local shell commit:
  `9704a4ebe36ea92da962981fdfd4520a752e8f72` (`fix(shell): reject unsafe dependency cache roots`).

## TDD evidence

- Omarchy focus/example red run:
  `bun test tests/render.test.js tests/example.test.js` failed in exactly two
  places: no `.focus(...)` call was recorded and `HelloWorld.init` did not
  exist.
- Omarchy green targeted run:
  `bun test tests/render.test.js tests/example.test.js tests/style.test.js tests/theme.test.js`
  passed 21 tests with 151 assertions.
- Shell cache red run:
  `cargo test -p gpui-shell --lib --locked dependencies::tests::for_user`
  failed to compile because the old seam returned `GitDependencyStore`, so the
  new success/error assertions could not call `expect`/`err`.
- Shell green targeted runs passed all five `for_user` tests and the exact
  HTTPS manifest dependency test.

## Final verification

- `bun run check`: 22 passed, 0 failed, 156 assertions.
- `git diff --check` in `omarchy-ui`: clean.
- `cargo fmt --all -- --check`: clean.
- `cargo check -p gpui-shell --all-targets --locked`: passed.
- `cargo clippy -p gpui-shell --all-targets --locked -- -D warnings`: passed.
- `cargo test -p gpui-shell --lib --locked`: 578 passed, 0 failed, 1 ignored.
- `git diff --check` in the shell worktree: clean.

## Concerns

- The Hello World palette is deliberately embedded because stock gpui-shell
  exposes `set_theme` but does not expose Omarchy's desktop files as a built-in
  module, and the example must request zero capabilities. A production host
  can supply current Omarchy color/shell sources through the same three library
  APIs.
- The real remote dependency check is left to the parent workflow after the
  local commits, as requested. No branch was pushed.
- This report is contained in the Omarchy UI final-review commit; that commit's
  SHA is reported by the parent handoff rather than self-recorded here.
