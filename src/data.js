// @ts-check

import { Button as BaseButton, h_flex } from "gpui-base";
import {
  optionalCallback,
  requiredRenderable,
  requiredRenderables,
  stableId,
} from "./internal.js";
import { alpha, style } from "./style.js";

export class ListRow {
  /** @type {string} */
  #id;

  #selected = false;

  #disabled = false;

  /** @type {((event: import("gpui").ClickEvent, cx: import("gpui").Context) => void) | undefined} */
  #onClick;

  /** @type {Array<import("gpui").Element | import("gpui").Entity>} */
  #children = [];

  /** @param {string} id */
  constructor(id) {
    this.#id = stableId("ListRow", id);
  }

  /** @param {boolean} [value] */
  selected(value = true) {
    this.#selected = value;
    return this;
  }

  /** @param {boolean} [value] */
  disabled(value = true) {
    this.#disabled = value;
    return this;
  }

  /** @param {((event: import("gpui").ClickEvent, cx: import("gpui").Context) => void) | undefined} callback */
  onClick(callback) {
    this.#onClick = optionalCallback("ListRow", "onClick", callback);
    return this;
  }

  /** @param {import("gpui").Element | import("gpui").Entity} element */
  child(element) {
    this.#children.push(requiredRenderable("ListRow", "child", element));
    return this;
  }

  /** @param {Array<import("gpui").Element | import("gpui").Entity>} elements */
  children(elements) {
    this.#children.push(...requiredRenderables("ListRow", "children", elements));
    return this;
  }

  /** @param {import("gpui").Context} cx */
  build(cx) {
    const interactive = typeof this.#onClick === "function";
    const tokens = style();
    const foreground = this.#disabled
      ? cx.theme().colors.muted_foreground
      : this.#selected
        ? cx.theme().colors.accent_foreground
        : cx.theme().colors.foreground;
    const row = interactive
      ? BaseButton.new(this.#id)
          .disabled(this.#disabled)
          .selected(this.#selected)
      : h_flex().id(this.#id);

    return row
      .items_center()
      .w_full()
      .min_w_0()
      .gap(cx.theme().spacing.sm)
      .px(cx.theme().spacing.md)
      .py(cx.theme().spacing.md)
      .bg(this.#selected ? cx.theme().colors.accent : cx.theme().colors.surface)
      .text_color(foreground)
      .when(interactive && !this.#disabled, (element) =>
        element.on_click(this.#onClick),
      )
      .when(interactive && !this.#disabled, (element) =>
        element.hover((appearance) =>
          appearance.bg(
            this.#selected
              ? cx.theme().colors.accent
              : cx.theme().colors.muted,
          ),
        ),
      )
      .when(interactive && !this.#disabled, (element) =>
        element.active((appearance) =>
          appearance.bg(
            this.#selected
              ? cx.theme().colors.accent
              : alpha(foreground, tokens.state.pressedFillAlpha),
          ),
        ),
      )
      .when(interactive && !this.#disabled, (element) =>
        element.focus((appearance) =>
          appearance
            .bg(
              this.#selected
                ? cx.theme().colors.accent
                : alpha(foreground, tokens.state.focusFillAlpha),
            )
            .border(tokens.state.focusBorderWidth)
            .border_color(
              alpha(
                cx.theme().colors.ring,
                tokens.state.focusBorderAlpha,
              ),
            ),
        ),
      )
      .children(this.#children);
  }
}
