// @ts-check

import { h_flex } from "gpui-base";

export class ListRow {
  /** @type {string} */
  #id;

  #selected = false;

  /** @type {any[]} */
  #children = [];

  /** @param {string} id */
  constructor(id) {
    this.#id = id;
  }

  /** @param {boolean} [value] */
  selected(value = true) {
    this.#selected = value;
    return this;
  }

  /** @param {any} element */
  child(element) {
    this.#children.push(element);
    return this;
  }

  /** @param {any[]} elements */
  children(elements) {
    this.#children.push(...elements);
    return this;
  }

  /** @param {import("gpui").Context} cx */
  build(cx) {
    return h_flex()
      .id(this.#id)
      .items_center()
      .w_full()
      .min_w_0()
      .gap(cx.theme().spacing.sm)
      .px(cx.theme().spacing.md)
      .py(cx.theme().spacing.md)
      .bg(this.#selected ? cx.theme().colors.accent : cx.theme().colors.surface)
      .text_color(this.#selected ? cx.theme().colors.accent_foreground : cx.theme().colors.foreground)
      .hover((appearance) => appearance.bg(cx.theme().colors.muted))
      .children(this.#children);
  }
}
