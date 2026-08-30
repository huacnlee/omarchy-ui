// @ts-check

import { div } from "gpui";
import { v_flex } from "gpui-base";
import { optionalText, requiredText } from "./internal.js";
import { style } from "./style.js";

/** @param {string} value @param {import("gpui").Context} cx */
function headingLabel(value, cx) {
  return div()
    .text_size(style().font.body)
    .line_height(1.35)
    .text_color(cx.theme().colors.foreground)
    .child(value);
}

/** @param {string} value @param {import("gpui").Context} cx */
function mutedLabel(value, cx) {
  return div()
    .text_size(style().font.body)
    .line_height(1.35)
    .text_color(cx.theme().colors.muted_foreground)
    .child(value);
}

export class EmptyState {
  /** @type {string | undefined} */
  #heading;

  /** @type {string | undefined} */
  #hint;

  /** @param {string} value */
  heading(value) {
    this.#heading = value;
    return this;
  }

  /** @param {string} value */
  hint(value) {
    this.#hint = value;
    return this;
  }

  /** @param {import("gpui").Context} cx */
  build(cx) {
    const tokens = style();
    const heading = requiredText("EmptyState", "heading", this.#heading);
    const hint = requiredText("EmptyState", "hint", this.#hint);
    return v_flex()
      .flex_1()
      .items_center()
      .justify_center()
      .gap(tokens.spacing.labelGap)
      .p(tokens.spacing.panelPadding)
      .child(headingLabel(heading, cx))
      .child(mutedLabel(hint, cx));
  }
}

export class StatusLine {
  /** @type {string | undefined} */
  #label;

  /** @type {string | undefined} */
  #loadingLabel;

  /** @type {"ready" | "loading" | "error"} */
  #state = "ready";

  /** @param {string} value */
  label(value) {
    this.#label = value;
    return this;
  }

  /** @param {string} value */
  loadingLabel(value) {
    this.#loadingLabel = value;
    return this;
  }

  /** @param {"ready" | "loading" | "error"} value */
  state(value) {
    if (!["ready", "loading", "error"].includes(value)) {
      throw new Error("StatusLine state must be one of: ready, loading, error.");
    }
    this.#state = value;
    return this;
  }

  /** @param {import("gpui").Context} cx */
  build(cx) {
    const label = requiredText("StatusLine", "label", this.#label);
    if (this.#state !== "loading") {
      optionalText("StatusLine", "loading label", this.#loadingLabel);
    }
    const visibleLabel = this.#state === "loading"
      ? requiredText(
          "StatusLine",
          "loading label",
          this.#loadingLabel,
        )
      : label;
    const element = this.#state === "error"
      ? headingLabel(visibleLabel, cx).text_color(cx.theme().colors.destructive)
      : mutedLabel(visibleLabel, cx);
    return element
      .role("status")
      .text_size(style().font.caption)
      .when(this.#state === "loading", (status) =>
        status.accessibility_label(visibleLabel),
      );
  }
}
