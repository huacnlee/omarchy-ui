// @ts-check

import { div } from "gpui";
import { h_flex, v_flex } from "gpui-base";
import { stableId } from "./internal.js";
import { resolveSurfaceColor, style } from "./style.js";
import { role } from "./theme.js";

/** @param {string} component @param {string} field @param {unknown} value */
function requireContent(component, field, value) {
  if (value === undefined || value === null) {
    throw new Error(`${component} requires ${field} before build()`);
  }
}

/** @param {unknown[]} values */
function optionalSlots(values) {
  return values.filter(Boolean);
}

export class AppShell {
  #top;
  #content;
  #bottom;

  /** @param {any} element */
  top(element) {
    this.#top = element;
    return this;
  }

  /** @param {any} element */
  content(element) {
    this.#content = element;
    return this;
  }

  /** @param {any} element */
  bottom(element) {
    this.#bottom = element;
    return this;
  }

  /** @param {import("gpui").Context} cx */
  build(cx) {
    requireContent("AppShell", "content", this.#content);
    const content = v_flex()
      .id("application-content")
      .flex_1()
      .min_w_0()
      .min_h_0()
      .overflow_hidden()
      .child(this.#content);

    return v_flex()
      .id("application-frame")
      .size_full()
      .min_w_0()
      .min_h_0()
      .font_family(style().fontFamily)
      .text_size(style().font.body)
      .bg(cx.theme().colors.background)
      .text_color(cx.theme().colors.foreground)
      .children(optionalSlots([this.#top]))
      .child(content)
      .children(optionalSlots([this.#bottom]));
  }
}

export class TopBar {
  #brand;
  #center;
  #actions;

  /** @param {any} element */
  brand(element) {
    this.#brand = element;
    return this;
  }

  /** @param {any} element */
  center(element) {
    this.#center = element;
    return this;
  }

  /** @param {any} element */
  actions(element) {
    this.#actions = element;
    return this;
  }

  /** @param {import("gpui").Context} cx */
  build(cx) {
    return h_flex()
      .id("application-top-bar")
      .h(style().space(48))
      .flex_none()
      .items_center()
      .justify_between()
      .gap(style().space(14))
      .px(style().space(14))
      .border_b(style().spacing.hairline)
      .border_color(role("separator", cx.theme().colors.border))
      .bg(cx.theme().colors.background)
      .children(optionalSlots([this.#brand, this.#center, this.#actions]));
  }
}

export class BottomBar {
  #status;
  #hints;
  #leadsWithIcon = false;

  /** @param {any} element */
  status(element) {
    this.#status = element;
    return this;
  }

  /** @param {any} element */
  hints(element) {
    this.#hints = element;
    return this;
  }

  /** @param {boolean} [value] */
  leadsWithIcon(value = true) {
    this.#leadsWithIcon = value;
    return this;
  }

  /** @param {import("gpui").Context} cx */
  build(cx) {
    return h_flex()
      .id("application-bottom-bar")
      .h(style().space(28))
      .flex_none()
      .items_center()
      .justify_between()
      .gap(style().spacing.controlGap)
      .pl(style().space(this.#leadsWithIcon === true ? 8 : 14))
      .pr(style().space(12))
      .border_t(style().spacing.hairline)
      .border_color(role("separator", cx.theme().colors.border))
      .bg(cx.theme().colors.background)
      .children(optionalSlots([this.#status, this.#hints]));
  }
}

export class ActionBar {
  #id;
  #actions;
  #status;

  /** @param {string} id */
  constructor(id) {
    this.#id = stableId("ActionBar", id);
  }

  /** @param {any} element */
  actions(element) {
    this.#actions = element;
    return this;
  }

  /** @param {any} element */
  status(element) {
    this.#status = element;
    return this;
  }

  /** @param {import("gpui").Context} cx */
  build(cx) {
    return h_flex()
      .id(this.#id)
      .role("toolbar")
      .flex_none()
      .items_center()
      .gap(style().spacing.controlGap)
      .px(style().spacing.panelPadding)
      .py(style().spacing.sm)
      .border_t(style().spacing.hairline)
      .border_color(role("separator", cx.theme().colors.border))
      .children(optionalSlots([this.#actions]))
      .child(div().flex_1())
      .children(optionalSlots([this.#status]));
  }
}

export class PanelHeader {
  #id;
  #heading;
  #actions;

  /** @param {string} id */
  constructor(id) {
    this.#id = stableId("PanelHeader", id);
  }

  /** @param {any} element */
  heading(element) {
    this.#heading = element;
    return this;
  }

  /** @param {any} element */
  actions(element) {
    this.#actions = element;
    return this;
  }

  /** @param {import("gpui").Context} cx */
  build(cx) {
    requireContent("PanelHeader", "heading", this.#heading);
    return h_flex()
      .id(this.#id)
      .role("section_header")
      .flex_none()
      .items_center()
      .justify_between()
      .gap(style().spacing.controlGap)
      .h(style().space(34))
      .px(style().spacing.rowPaddingX)
      .border_b(style().spacing.hairline)
      .border_color(role("separator", cx.theme().colors.border))
      .child(this.#heading)
      .children(optionalSlots([this.#actions]));
  }
}

export class CenteredWorkspace {
  #id;
  #content;

  /** @param {string} id */
  constructor(id) {
    this.#id = stableId("CenteredWorkspace", id);
  }

  /** @param {any} element */
  content(element) {
    this.#content = element;
    return this;
  }

  /** @param {import("gpui").Context} _cx */
  build(_cx) {
    requireContent("CenteredWorkspace", "content", this.#content);
    return h_flex()
      .id(this.#id)
      .items_start()
      .size_full()
      .min_w_0()
      .min_h_0()
      .justify_center()
      .overflow_y_scroll()
      .child(this.#content);
  }
}

export class PageColumn {
  #id;
  #children = [];
  #maxWidth;

  /** @param {string} id */
  constructor(id) {
    this.#id = stableId("PageColumn", id);
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

  /** @param {import("gpui").DefiniteLength} value */
  maxWidth(value) {
    this.#maxWidth = value;
    return this;
  }

  /** @param {import("gpui").Context} _cx */
  build(_cx) {
    return v_flex()
      .id(this.#id)
      .w_full()
      .max_w(this.#maxWidth ?? style().space(560))
      .gap(style().spacing.panelGap)
      .p(style().spacing.panelPadding)
      .children([...this.#children]);
  }
}

export class Surface {
  #children = [];

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
    return v_flex()
      .min_w_0()
      .min_h_0()
      .bg(cx.theme().colors.surface)
      .border(style().spacing.hairline)
      .border_color(cx.theme().colors.border)
      .rounded(style().cornerRadius)
      .overflow_hidden()
      .children([...this.#children]);
  }
}

export class PopupSurface {
  #id;
  #children = [];

  /** @param {string} id */
  constructor(id) {
    this.#id = stableId("PopupSurface", id);
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
    const tokens = style();
    return v_flex()
      .id(this.#id)
      .flex_none()
      .p(tokens.space(4))
      .gap(tokens.space(2))
      .rounded(tokens.cornerRadius)
      .bg(
        resolveSurfaceColor(
          tokens,
          tokens.surfaces.popupBackground,
          cx.theme().colors.background,
          tokens.surfaces.popupBackgroundAlpha,
        ),
      )
      .border(tokens.state.normalBorderWidth)
      .border_color(
        resolveSurfaceColor(
          tokens,
          tokens.surfaces.popupBorder,
          cx.theme().colors.ring,
          tokens.surfaces.popupBorderAlpha,
        ),
      )
      .text_color(
        resolveSurfaceColor(
          tokens,
          tokens.surfaces.popupText,
          cx.theme().colors.foreground,
        ),
      )
      .children([...this.#children]);
  }
}

export class Label {
  #text;

  /** @param {string | number} [value] */
  constructor(value) {
    this.#text = value;
  }

  /** @param {string | number} value */
  text(value) {
    this.#text = value;
    return this;
  }

  /** @param {import("gpui").Context} cx */
  build(cx) {
    requireContent("Label", "text", this.#text);
    return div()
      .text_size(style().font.body)
      .line_height(1.35)
      .text_color(cx.theme().colors.foreground)
      .child(this.#text);
  }
}

export class MutedText {
  #text;

  /** @param {string | number} [value] */
  constructor(value) {
    this.#text = value;
  }

  /** @param {string | number} value */
  text(value) {
    this.#text = value;
    return this;
  }

  /** @param {import("gpui").Context} cx */
  build(cx) {
    requireContent("MutedText", "text", this.#text);
    return div()
      .text_size(style().font.body)
      .line_height(1.35)
      .text_color(cx.theme().colors.muted_foreground)
      .child(this.#text);
  }
}

export class Title {
  #text;

  /** @param {string} [value] */
  constructor(value) {
    this.#text = value;
  }

  /** @param {string} value */
  text(value) {
    this.#text = value;
    return this;
  }

  /** @param {import("gpui").Context} cx */
  build(cx) {
    requireContent("Title", "text", this.#text);
    return div()
      .text_size(style().font.title)
      .text_color(cx.theme().colors.foreground)
      .child(this.#text);
  }
}

export class SectionLabel {
  #text;

  /** @param {string} [value] */
  constructor(value) {
    this.#text = value;
  }

  /** @param {string} value */
  text(value) {
    this.#text = value;
    return this;
  }

  /** @param {import("gpui").Context} cx */
  build(cx) {
    requireContent("SectionLabel", "text", this.#text);
    return div()
      .text_size(style().font.caption)
      .text_color(cx.theme().colors.muted_foreground)
      .child(this.#text);
  }
}
