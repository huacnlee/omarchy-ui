// @ts-check

import { div, svg } from "gpui";
import { Button as BaseButton, h_flex, v_flex } from "gpui-base";
import { alpha, style } from "./style.js";

const NO_FILL = /** @type {import("gpui").Color} */ ("#00000000");
const SIZES = /** @type {const} */ (["small", "medium", "large"]);

/** @typedef {typeof SIZES[number]} ControlSize */

/** @param {import("gpui").Context} cx @param {import("gpui").Color} [color] */
function surfaceStates(cx, color) {
  const state = style().state;
  const own = color || cx.theme().colors.foreground;
  return {
    normalFill: alpha(own, state.normalFillAlpha),
    hoverFill: alpha(own, state.hoverFillAlpha),
    selectedFill: alpha(own, state.selectedFillAlpha),
    pressedFill: alpha(own, state.pressedFillAlpha),
    normalBorder: alpha(own, state.normalBorderAlpha),
    hoverBorder: alpha(own, state.hoverBorderAlpha),
    selectedBorder: alpha(own, state.selectedBorderAlpha),
    focusFill: alpha(own, state.focusFillAlpha),
    focusBorder: alpha(cx.theme().colors.ring, state.focusBorderAlpha),
    normalBorderWidth: state.normalBorderWidth,
    hoverBorderWidth: state.hoverBorderWidth,
    selectedBorderWidth: state.selectedBorderWidth,
    focusBorderWidth: state.focusBorderWidth,
  };
}

/** @param {string} component @param {unknown} id @returns {any} */
function stableId(component, id) {
  if (id == null || (typeof id === "string" && id.trim() === "")) {
    throw new Error(`${component} requires a non-blank id`);
  }
  return id;
}

/** @param {string} component @param {string} field @param {unknown} value */
function requireValue(component, field, value) {
  if (value == null || (typeof value === "string" && value.trim() === "")) {
    throw new Error(`${component} requires ${field} before build`);
  }
}

/** @param {string} component @param {string} value @returns {ControlSize} */
function controlSize(component, value) {
  if (!SIZES.includes(/** @type {ControlSize} */ (value))) {
    throw new Error(
      `${component} size must be one of ${SIZES.join(", ")}; received ${JSON.stringify(value)}`,
    );
  }
  return /** @type {ControlSize} */ (value);
}

/** @param {ControlSize} size */
function sizeStyle(size) {
  const tokens = style();
  if (size === "small") {
    return {
      extent: tokens.space(24),
      fontSize: tokens.font.bodySmall,
      iconSize: tokens.font.iconSmall,
      paddingX: tokens.spacing.lg,
    };
  }
  if (size === "large") {
    return {
      extent: tokens.space(32),
      fontSize: tokens.font.title,
      iconSize: tokens.font.iconLarge,
      paddingX: tokens.spacing.xxl,
    };
  }
  return {
    extent: tokens.spacing.controlHeight,
    fontSize: tokens.font.body,
    iconSize: tokens.font.icon,
    paddingX: tokens.spacing.controlPaddingX,
  };
}

/** @param {string | number} value @param {import("gpui").Context} cx */
function labelElement(value, cx) {
  return div()
    .text_size(style().font.body)
    .line_height(1.35)
    .text_color(cx.theme().colors.foreground)
    .child(value);
}

/** @param {string | number} value @param {import("gpui").Context} cx */
function mutedElement(value, cx) {
  return div()
    .text_size(style().font.body)
    .line_height(1.35)
    .text_color(cx.theme().colors.muted_foreground)
    .child(value);
}

/**
 * @param {{id:string, label:string, asset:string, outlined:boolean, bordered:boolean,
 * selected:boolean, disabled:boolean, loading:boolean, size:ControlSize,
 * onClick?: (event: import("gpui").ClickEvent, cx: import("gpui").Context) => void}} config
 * @param {import("gpui").Context} cx
 */
function buildButton(config, cx) {
  const tokens = style();
  const dimensions = sizeStyle(config.size);
  const inactive = config.disabled || config.loading;
  const hasBorder = config.outlined || config.bordered || config.selected;
  const foreground = inactive
    ? cx.theme().colors.muted_foreground
    : cx.theme().colors.foreground;
  const states = surfaceStates(cx, foreground);
  const restBorderWidth = config.selected
    ? states.selectedBorderWidth
    : states.normalBorderWidth;
  const restBorderColor = config.selected
    ? states.selectedBorderWidth > 0
      ? states.selectedBorder
      : NO_FILL
    : hasBorder
      ? states.normalBorder
      : NO_FILL;

  return BaseButton.new(config.id)
    .disabled(inactive)
    .selected(config.selected)
    .flex()
    .items_center()
    .justify_center()
    .gap(tokens.spacing.md)
    .h(dimensions.extent)
    .px(dimensions.paddingX)
    .rounded(tokens.cornerRadius)
    .border(restBorderWidth)
    .border_color(restBorderColor)
    .bg(
      config.selected
        ? states.selectedFill
        : config.bordered && !config.outlined
          ? states.normalFill
          : NO_FILL,
    )
    .text_size(dimensions.fontSize)
    .text_color(foreground)
    .when(config.loading, (element) => element.accessibility_label(config.label))
    .when(Boolean(config.asset) && !config.loading, (element) =>
      element.child(
        svg(config.asset)
          .flex_none()
          .size(dimensions.iconSize)
          .text_color(foreground),
      ),
    )
    .when(!inactive && typeof config.onClick === "function", (element) =>
      element.on_click(config.onClick),
    )
    .when(!inactive, (element) =>
      element.hover((appearance) =>
        appearance
          .bg(config.selected ? states.selectedFill : states.hoverFill)
          .border(
            config.selected
              ? states.selectedBorderWidth
              : states.hoverBorderWidth,
          )
          .border_color(
            config.selected
              ? states.selectedBorderWidth > 0
                ? states.selectedBorder
                : NO_FILL
              : states.hoverBorder,
          ),
      ),
    )
    .when(!inactive, (element) =>
      element.active((appearance) => appearance.bg(states.pressedFill)),
    )
    .focus((appearance) =>
      appearance
        .bg(config.selected ? states.selectedFill : states.focusFill)
        .border(states.focusBorderWidth)
        .border_color(states.focusBorder),
    )
    .child(config.loading ? `${config.label}…` : config.label);
}

/**
 * @param {{id:string, content:any, description:string, outlined:boolean,
 * bordered:boolean, selected:boolean, disabled:boolean, loading:boolean,
 * size:ControlSize, onClick?: (event: import("gpui").ClickEvent,
 * cx: import("gpui").Context) => void}} config
 * @param {import("gpui").Context} cx
 */
function buildCompactCommand(config, cx) {
  const tokens = style();
  const dimensions = sizeStyle(config.size);
  const inactive = config.disabled || config.loading;
  const hasBorder = config.outlined || config.bordered || config.selected;
  const foreground = inactive
    ? cx.theme().colors.muted_foreground
    : cx.theme().colors.foreground;
  const states = surfaceStates(cx, foreground);
  const restBorderWidth = config.selected
    ? states.selectedBorderWidth
    : states.normalBorderWidth;
  const restBorderColor = config.selected
    ? states.selectedBorderWidth > 0
      ? states.selectedBorder
      : NO_FILL
    : hasBorder
      ? states.normalBorder
      : NO_FILL;

  return BaseButton.new(config.id)
    .disabled(inactive)
    .selected(config.selected)
    .accessibility_label(config.description)
    .tooltip(config.description)
    .flex()
    .items_center()
    .justify_center()
    .flex_none()
    .size(dimensions.extent)
    .p(tokens.space(2))
    .rounded(tokens.cornerRadius)
    .border(restBorderWidth)
    .border_color(restBorderColor)
    .bg(
      config.selected
        ? states.selectedFill
        : config.bordered && !config.outlined
          ? states.normalFill
          : NO_FILL,
    )
    .text_size(dimensions.fontSize)
    .text_color(foreground)
    .when(!inactive && typeof config.onClick === "function", (element) =>
      element.on_click(config.onClick),
    )
    .when(!inactive, (element) =>
      element.hover((appearance) =>
        appearance
          .bg(config.selected ? states.selectedFill : states.hoverFill)
          .border(
            config.selected
              ? states.selectedBorderWidth
              : states.hoverBorderWidth,
          )
          .border_color(
            config.selected
              ? states.selectedBorderWidth > 0
                ? states.selectedBorder
                : NO_FILL
              : states.hoverBorder,
          )
          .text_color(foreground),
      ),
    )
    .when(!inactive, (element) =>
      element.active((appearance) => appearance.bg(states.pressedFill)),
    )
    .focus((appearance) =>
      appearance
        .bg(config.selected ? states.selectedFill : states.focusFill)
        .border(states.focusBorderWidth)
        .border_color(states.focusBorder),
    )
    .child(config.loading ? "…" : config.content);
}

export class Button {
  #id;
  #label = "";
  #asset = "";
  #outlined = false;
  #bordered = false;
  #selected = false;
  #disabled = false;
  #loading = false;
  /** @type {ControlSize} */
  #size = "medium";
  /** @type {((event: import("gpui").ClickEvent, cx: import("gpui").Context) => void) | undefined} */
  #onClick;

  /** @param {string} id */
  constructor(id) { this.#id = stableId("Button", id); }
  /** @param {string} text */
  label(text) { this.#label = text; return this; }
  /** @param {string} asset complete application-root-relative asset path */
  icon(asset) { this.#asset = asset; return this; }
  outlined() { this.#outlined = true; return this; }
  /** @param {boolean} [value] */
  bordered(value = true) { this.#bordered = value; return this; }
  /** @param {boolean} [value] */
  selected(value = true) { this.#selected = value; return this; }
  /** @param {boolean} [value] */
  disabled(value = true) { this.#disabled = value; return this; }
  /** @param {boolean} [value] */
  loading(value = true) { this.#loading = value; return this; }
  /** @param {string} value */
  size(value) { this.#size = controlSize("Button", value); return this; }
  /** @param {(event: import("gpui").ClickEvent, cx: import("gpui").Context) => void} callback */
  onClick(callback) { this.#onClick = callback; return this; }

  /** @param {import("gpui").Context} cx */
  build(cx) {
    requireValue("Button", "label", this.#label);
    return buildButton({
      id: this.#id,
      label: this.#label,
      asset: this.#asset,
      outlined: this.#outlined,
      bordered: this.#bordered,
      selected: this.#selected,
      disabled: this.#disabled,
      loading: this.#loading,
      size: this.#size,
      onClick: this.#onClick,
    }, cx);
  }
}

export class IconButton {
  #id;
  #asset = "";
  #description = "";
  #outlined = false;
  #bordered = false;
  #selected = false;
  #disabled = false;
  #loading = false;
  /** @type {ControlSize} */
  #size = "medium";
  /** @type {((event: import("gpui").ClickEvent, cx: import("gpui").Context) => void) | undefined} */
  #onClick;

  /** @param {string} id */
  constructor(id) { this.#id = stableId("IconButton", id); }
  /** @param {string} asset complete application-root-relative asset path */
  icon(asset) { this.#asset = asset; return this; }
  /** @param {string} text */
  description(text) { this.#description = text; return this; }
  outlined() { this.#outlined = true; return this; }
  /** @param {boolean} [value] */
  bordered(value = true) { this.#bordered = value; return this; }
  /** @param {boolean} [value] */
  selected(value = true) { this.#selected = value; return this; }
  /** @param {boolean} [value] */
  disabled(value = true) { this.#disabled = value; return this; }
  /** @param {boolean} [value] */
  loading(value = true) { this.#loading = value; return this; }
  /** @param {string} value */
  size(value) { this.#size = controlSize("IconButton", value); return this; }
  /** @param {(event: import("gpui").ClickEvent, cx: import("gpui").Context) => void} callback */
  onClick(callback) { this.#onClick = callback; return this; }

  /** @param {import("gpui").Context} cx */
  build(cx) {
    requireValue("IconButton", "icon", this.#asset);
    requireValue("IconButton", "description", this.#description);
    return buildCompactCommand({
      id: this.#id,
      content: svg(this.#asset).size(sizeStyle(this.#size).iconSize).flex_none(),
      description: this.#description,
      outlined: this.#outlined,
      bordered: this.#bordered,
      selected: this.#selected,
      disabled: this.#disabled,
      loading: this.#loading,
      size: this.#size,
      onClick: this.#onClick,
    }, cx);
  }
}

export class GlyphButton {
  #id;
  #glyph = "";
  #description = "";
  #outlined = false;
  #bordered = false;
  #selected = false;
  #disabled = false;
  #loading = false;
  /** @type {ControlSize} */
  #size = "medium";
  /** @type {((event: import("gpui").ClickEvent, cx: import("gpui").Context) => void) | undefined} */
  #onClick;

  /** @param {string} id */
  constructor(id) { this.#id = stableId("GlyphButton", id); }
  /** @param {string} text */
  glyph(text) { this.#glyph = text; return this; }
  /** @param {string} text */
  description(text) { this.#description = text; return this; }
  outlined() { this.#outlined = true; return this; }
  /** @param {boolean} [value] */
  bordered(value = true) { this.#bordered = value; return this; }
  /** @param {boolean} [value] */
  selected(value = true) { this.#selected = value; return this; }
  /** @param {boolean} [value] */
  disabled(value = true) { this.#disabled = value; return this; }
  /** @param {boolean} [value] */
  loading(value = true) { this.#loading = value; return this; }
  /** @param {string} value */
  size(value) { this.#size = controlSize("GlyphButton", value); return this; }
  /** @param {(event: import("gpui").ClickEvent, cx: import("gpui").Context) => void} callback */
  onClick(callback) { this.#onClick = callback; return this; }

  /** @param {import("gpui").Context} cx */
  build(cx) {
    requireValue("GlyphButton", "glyph", this.#glyph);
    requireValue("GlyphButton", "description", this.#description);
    return buildCompactCommand({
      id: this.#id,
      content: this.#glyph,
      description: this.#description,
      outlined: this.#outlined,
      bordered: this.#bordered,
      selected: this.#selected,
      disabled: this.#disabled,
      loading: this.#loading,
      size: this.#size,
      onClick: this.#onClick,
    }, cx);
  }
}

export class MenuItem {
  #id;
  #label = "";
  #detail = "";
  #asset = "";
  #selected = false;
  #disabled = false;
  /** @type {((event: import("gpui").ClickEvent, cx: import("gpui").Context) => void) | undefined} */
  #onClick;

  /** @param {string} id */
  constructor(id) { this.#id = stableId("MenuItem", id); }
  /** @param {string} text */
  label(text) { this.#label = text; return this; }
  /** @param {string} text */
  detail(text) { this.#detail = text; return this; }
  /** @param {string} asset complete application-root-relative asset path */
  icon(asset) { this.#asset = asset; return this; }
  /** @param {boolean} [value] */
  selected(value = true) { this.#selected = value; return this; }
  /** @param {boolean} [value] */
  disabled(value = true) { this.#disabled = value; return this; }
  /** @param {(event: import("gpui").ClickEvent, cx: import("gpui").Context) => void} callback */
  onClick(callback) { this.#onClick = callback; return this; }

  /** @param {import("gpui").Context} cx */
  build(cx) {
    requireValue("MenuItem", "label", this.#label);
    const tokens = style();
    const foreground = this.#disabled
      ? cx.theme().colors.muted_foreground
      : cx.theme().colors.foreground;
    const states = surfaceStates(cx, foreground);
    const restBorderWidth = this.#selected
      ? states.selectedBorderWidth
      : states.normalBorderWidth;
    const restBorderColor =
      this.#selected && states.selectedBorderWidth > 0
        ? states.selectedBorder
        : NO_FILL;
    return BaseButton.new(this.#id)
      .role("menu_item")
      .disabled(this.#disabled)
      .selected(this.#selected)
      .accessibility_label(this.#detail ? `${this.#label}, ${this.#detail}` : this.#label)
      .flex()
      .items_center()
      .justify_between()
      .w_full()
      .h(tokens.spacing.popupRowHeight)
      .gap(tokens.spacing.controlGap)
      .px(tokens.space(9))
      .rounded(tokens.cornerRadius)
      .border(restBorderWidth)
      .border_color(restBorderColor)
      .bg(this.#selected ? states.selectedFill : NO_FILL)
      .text_size(tokens.font.bodySmall)
      .text_color(foreground)
      .when(!this.#disabled && typeof this.#onClick === "function", (element) => element.on_click(this.#onClick))
      .when(!this.#disabled, (element) => element.hover((appearance) => appearance
        .bg(this.#selected ? states.selectedFill : states.hoverFill)
        .border(this.#selected ? states.selectedBorderWidth : states.hoverBorderWidth)
        .border_color(
          this.#selected
            ? states.selectedBorderWidth > 0
              ? states.selectedBorder
              : NO_FILL
            : states.hoverBorder,
        )))
      .when(!this.#disabled, (element) => element.active((appearance) => appearance.bg(states.pressedFill)))
      .focus((appearance) => appearance
        .bg(this.#selected ? states.selectedFill : states.focusFill)
        .border(states.focusBorderWidth)
        .border_color(states.focusBorder))
      .child(
        h_flex()
          .items_center()
          .gap(tokens.spacing.md)
          .min_w_0()
          .when(Boolean(this.#asset), (element) => element.child(svg(this.#asset).flex_none().size(tokens.font.iconSmall).text_color(foreground)))
          .child(labelElement(this.#label, cx).text_color(foreground).truncate()),
      )
      .when(Boolean(this.#detail), (element) => element.child(mutedElement(this.#detail, cx).flex_none().text_size(tokens.font.bodySmall)));
  }
}

export class FieldRow {
  #id;
  #label = "";
  #control;

  /** @param {string} id */
  constructor(id) { this.#id = stableId("FieldRow", id); }
  /** @param {string} text */
  label(text) { this.#label = text; return this; }
  /** @param {any} element */
  control(element) { this.#control = element; return this; }

  /** @param {import("gpui").Context} cx */
  build(cx) {
    requireValue("FieldRow", "label", this.#label);
    requireValue("FieldRow", "control", this.#control);
    const tokens = style();
    return h_flex()
      .id(this.#id)
      .flex_none()
      .items_center()
      .gap(tokens.spacing.controlGap)
      .px(tokens.spacing.panelPadding)
      .py(tokens.spacing.xs)
      .border_b(tokens.spacing.hairline)
      .border_color(cx.theme().colors.border)
      .child(h_flex().w(tokens.space(52)).flex_none().child(labelElement(this.#label, cx).text_color(cx.theme().colors.muted_foreground)))
      .child(this.#control);
  }
}

export class FormField {
  #id;
  #label = "";
  #control;
  #helper = "";

  /** @param {string} id */
  constructor(id) { this.#id = stableId("FormField", id); }
  /** @param {string} text */
  label(text) { this.#label = text; return this; }
  /** @param {any} element */
  control(element) { this.#control = element; return this; }
  /** @param {string} text */
  helper(text) { this.#helper = text; return this; }

  /** @param {import("gpui").Context} cx */
  build(cx) {
    requireValue("FormField", "label", this.#label);
    requireValue("FormField", "control", this.#control);
    const tokens = style();
    return v_flex()
      .id(this.#id)
      .min_w_0()
      .gap(tokens.spacing.labelGap)
      .child(labelElement(this.#label, cx))
      .child(this.#control)
      .when(Boolean(this.#helper), (element) => element.child(mutedElement(this.#helper, cx).text_size(tokens.font.bodySmall)));
  }
}

export class Separator {
  /** @param {import("gpui").Context} cx */
  build(cx) {
    return v_flex().flex_none().h(style().spacing.hairline).w_full().bg(alpha(cx.theme().colors.foreground, 0.12));
  }
}

export class MenuSeparator {
  /** @param {import("gpui").Context} cx */
  build(cx) {
    return v_flex().flex_none().h(style().space(7)).w_full().justify_center().child(new Separator().build(cx));
  }
}

export class Keycap {
  #value;
  /** @param {string} value */
  constructor(value) { this.#value = value; }

  /** @param {import("gpui").Context} cx */
  build(cx) {
    requireValue("Keycap", "value", this.#value);
    const tokens = style();
    const states = surfaceStates(cx);
    return h_flex()
      .flex_none()
      .items_center()
      .justify_center()
      .px(tokens.space(3))
      .py(tokens.space(1))
      .rounded(tokens.cornerRadius)
      .border(states.normalBorderWidth)
      .border_color(states.normalBorder)
      .bg(states.normalFill)
      .text_size(tokens.font.caption)
      .text_color(cx.theme().colors.foreground)
      .child(this.#value);
  }
}

export class KeyHints {
  #id;
  /** @type {Array<{key:string, label:string}>} */
  #hints = [];
  /** @param {string} id */
  constructor(id) { this.#id = stableId("KeyHints", id); }
  /** @param {string} key @param {string} label */
  hint(key, label) { this.#hints.push({ key, label }); return this; }

  /** @param {import("gpui").Context} cx */
  build(cx) {
    const tokens = style();
    return h_flex()
      .id(this.#id)
      .flex_none()
      .items_center()
      .gap(tokens.space(7))
      .children(this.#hints.map((hint) => h_flex()
        .items_center()
        .gap(tokens.space(3))
        .child(new Keycap(hint.key).build(cx))
        .child(mutedElement(hint.label, cx).text_size(tokens.font.caption).flex_none())));
  }
}
