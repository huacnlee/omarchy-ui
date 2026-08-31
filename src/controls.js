// @ts-check

import { div, svg } from "gpui";
import { Button as BaseButton, Input, Link, h_flex, v_flex } from "gpui-base";
import {
  optionalCallback,
  optionalText,
  requiredRenderable,
  requiredText,
  stableId,
} from "./internal.js";
import { alpha, style } from "./style.js";
import { Label, MutedText } from "./text.js";
import { role } from "./theme.js";

const NO_FILL = /** @type {import("gpui").Color} */ ("#00000000");
const SIZES = /** @type {const} */ (["small", "medium", "large"]);

/** @typedef {typeof SIZES[number]} ControlSize */

/**
 * @param {import("gpui").Context} cx
 * @param {import("gpui").Color} [color]
 * @param {import("gpui").Color} [focusColor]
 */
function surfaceStates(cx, color, focusColor) {
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
    focusBorder: alpha(
      focusColor || cx.theme().colors.ring,
      state.focusBorderAlpha,
    ),
    normalBorderWidth: state.normalBorderWidth,
    hoverBorderWidth: state.hoverBorderWidth,
    selectedBorderWidth: state.selectedBorderWidth,
    focusBorderWidth: state.focusBorderWidth,
  };
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

/** @param {string} value @param {import("gpui").Context} cx */
function labelElement(value, cx) {
  return new Label(value).build(cx);
}

/** @param {string} value @param {import("gpui").Context} cx */
function mutedElement(value, cx) {
  return new MutedText(value).build(cx);
}

/**
 * @param {{id:string, label:string, asset:string, outlined:boolean, bordered:boolean,
 * selected:boolean, accent:boolean, danger:boolean, disabled:boolean, loading:boolean,
 * loadingLabel:string, size:ControlSize,
 * onClick?: (event: import("gpui").ClickEvent, cx: import("gpui").Context) => void}} config
 * @param {import("gpui").Context} cx
 */
function buildButton(config, cx) {
  const tokens = style();
  const dimensions = sizeStyle(config.size);
  const inactive = config.disabled || config.loading;
  const hasBorder = config.outlined || config.bordered || config.selected;
  // Emphasis is carried by the label and the border, never by a solid block of
  // colour: an Omarchy control is an alpha of a role over the window's own
  // ground, and one filled rectangle in a window of them reads as a different
  // application. `accent` and `danger` are the two roles a control can take.
  const emphasis = config.danger
    ? cx.theme().colors.destructive
    : config.accent
      ? role("accent", cx.theme().colors.primary)
      : undefined;
  const foreground = emphasis
    ? inactive
      ? alpha(emphasis, tokens.state.normalBorderAlpha)
      : emphasis
    : inactive
      ? cx.theme().colors.muted_foreground
      : cx.theme().colors.foreground;
  const states = surfaceStates(cx, foreground, emphasis);
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
    .when(config.loading, (element) =>
      element.accessibility_label(config.loadingLabel),
    )
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
    .child(config.loading ? config.loadingLabel : config.label);
}

/**
 * @param {string} label
 * @param {{iconSize:number}} dimensions
 * @param {import("gpui").Color} foreground
 */
function activityMarker(label, dimensions, foreground) {
  const tokens = style();
  return div()
    .role("progress_indicator")
    .accessibility_label(label)
    .flex_none()
    .size(dimensions.iconSize)
    .rounded(dimensions.iconSize)
    .border(tokens.spacing.hairline)
    .border_color(foreground)
    .bg(alpha(foreground, tokens.state.normalFillAlpha));
}

/**
 * @param {{id:string, content:any, description:string, outlined:boolean,
 * bordered:boolean, selected:boolean, disabled:boolean, loading:boolean,
 * loadingLabel:string, size:ControlSize, onClick?: (event: import("gpui").ClickEvent,
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
    .accessibility_label(
      config.loading ? config.loadingLabel : config.description,
    )
    .tooltip(config.loading ? config.loadingLabel : config.description)
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
    .child(
      config.loading
        ? activityMarker(config.loadingLabel, dimensions, foreground)
        : config.content,
    );
}

export class Button {
  #id;
  #label;
  #asset;
  #outlined = false;
  #bordered = false;
  #selected = false;
  #accent = false;
  #danger = false;
  #disabled = false;
  #loading = false;
  #loadingLabel;
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
  /** @param {boolean} [value] the one control a screen wants pressed */
  accent(value = true) { this.#accent = value; return this; }
  /** @param {boolean} [value] */
  danger(value = true) { this.#danger = value; return this; }
  /** @param {boolean} [value] */
  disabled(value = true) { this.#disabled = value; return this; }
  /** @param {boolean} [value] */
  loading(value = true) { this.#loading = value; return this; }
  /** @param {string} text */
  loadingLabel(text) { this.#loadingLabel = text; return this; }
  /** @param {string} value */
  size(value) { this.#size = controlSize("Button", value); return this; }
  /** @param {((event: import("gpui").ClickEvent, cx: import("gpui").Context) => void) | undefined} callback */
  onClick(callback) {
    this.#onClick = optionalCallback("Button", "onClick", callback);
    return this;
  }

  /** @param {import("gpui").Context} cx */
  build(cx) {
    const label = requiredText("Button", "label", this.#label);
    const asset = optionalText("Button", "icon", this.#asset) ?? "";
    const loadingLabel = this.#loading
      ? requiredText("Button", "loading label", this.#loadingLabel)
      : optionalText("Button", "loading label", this.#loadingLabel) ?? "";
    return buildButton({
      id: this.#id,
      label,
      asset,
      outlined: this.#outlined,
      bordered: this.#bordered,
      selected: this.#selected,
      accent: this.#accent,
      danger: this.#danger,
      disabled: this.#disabled,
      loading: this.#loading,
      loadingLabel,
      size: this.#size,
      onClick: this.#onClick,
    }, cx);
  }
}

export class IconButton {
  #id;
  #asset;
  #description;
  #outlined = false;
  #bordered = false;
  #selected = false;
  #disabled = false;
  #loading = false;
  #loadingLabel;
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
  /** @param {string} text */
  loadingLabel(text) { this.#loadingLabel = text; return this; }
  /** @param {string} value */
  size(value) { this.#size = controlSize("IconButton", value); return this; }
  /** @param {((event: import("gpui").ClickEvent, cx: import("gpui").Context) => void) | undefined} callback */
  onClick(callback) {
    this.#onClick = optionalCallback("IconButton", "onClick", callback);
    return this;
  }

  /** @param {import("gpui").Context} cx */
  build(cx) {
    const asset = requiredText("IconButton", "icon", this.#asset);
    const description = requiredText(
      "IconButton",
      "description",
      this.#description,
    );
    const loadingLabel = this.#loading
      ? requiredText("IconButton", "loading label", this.#loadingLabel)
      : optionalText("IconButton", "loading label", this.#loadingLabel) ?? "";
    return buildCompactCommand({
      id: this.#id,
      content: svg(asset).size(sizeStyle(this.#size).iconSize).flex_none(),
      description,
      outlined: this.#outlined,
      bordered: this.#bordered,
      selected: this.#selected,
      disabled: this.#disabled,
      loading: this.#loading,
      loadingLabel,
      size: this.#size,
      onClick: this.#onClick,
    }, cx);
  }
}

export class GlyphButton {
  #id;
  #glyph;
  #description;
  #outlined = false;
  #bordered = false;
  #selected = false;
  #disabled = false;
  #loading = false;
  #loadingLabel;
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
  /** @param {string} text */
  loadingLabel(text) { this.#loadingLabel = text; return this; }
  /** @param {string} value */
  size(value) { this.#size = controlSize("GlyphButton", value); return this; }
  /** @param {((event: import("gpui").ClickEvent, cx: import("gpui").Context) => void) | undefined} callback */
  onClick(callback) {
    this.#onClick = optionalCallback("GlyphButton", "onClick", callback);
    return this;
  }

  /** @param {import("gpui").Context} cx */
  build(cx) {
    const glyph = requiredText("GlyphButton", "glyph", this.#glyph);
    const description = requiredText(
      "GlyphButton",
      "description",
      this.#description,
    );
    const loadingLabel = this.#loading
      ? requiredText("GlyphButton", "loading label", this.#loadingLabel)
      : optionalText("GlyphButton", "loading label", this.#loadingLabel) ?? "";
    return buildCompactCommand({
      id: this.#id,
      content: glyph,
      description,
      outlined: this.#outlined,
      bordered: this.#bordered,
      selected: this.#selected,
      disabled: this.#disabled,
      loading: this.#loading,
      loadingLabel,
      size: this.#size,
      onClick: this.#onClick,
    }, cx);
  }
}

export class MenuItem {
  #id;
  #label;
  #detail;
  #asset;
  #selected = false;
  #danger = false;
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
  danger(value = true) { this.#danger = value; return this; }
  /** @param {boolean} [value] */
  disabled(value = true) { this.#disabled = value; return this; }
  /** @param {((event: import("gpui").ClickEvent, cx: import("gpui").Context) => void) | undefined} callback */
  onClick(callback) {
    this.#onClick = optionalCallback("MenuItem", "onClick", callback);
    return this;
  }

  /** @param {import("gpui").Context} cx */
  build(cx) {
    const label = requiredText("MenuItem", "label", this.#label);
    const detail = optionalText("MenuItem", "detail", this.#detail) ?? "";
    const asset = optionalText("MenuItem", "icon", this.#asset) ?? "";
    const tokens = style();
    const foreground = this.#danger
      ? this.#disabled
        ? alpha(
            cx.theme().colors.destructive,
            tokens.state.normalBorderAlpha,
          )
        : cx.theme().colors.destructive
      : this.#disabled
        ? cx.theme().colors.muted_foreground
        : cx.theme().colors.foreground;
    const states = surfaceStates(
      cx,
      foreground,
      this.#danger ? cx.theme().colors.destructive : undefined,
    );
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
      .accessibility_label(detail ? `${label}, ${detail}` : label)
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
          .when(Boolean(asset), (element) => element.child(svg(asset).flex_none().size(tokens.font.iconSmall).text_color(foreground)))
          .child(labelElement(label, cx).text_color(foreground).truncate()),
      )
      .when(Boolean(detail), (element) => element.child(
        mutedElement(detail, cx)
          .flex_none()
          .text_size(tokens.font.bodySmall)
          .when(this.#danger, (detail) => detail.text_color(foreground)),
      ));
  }
}

export class FieldRow {
  #id;
  #label;
  #control;

  /** @param {string} id */
  constructor(id) { this.#id = stableId("FieldRow", id); }
  /** @param {string} text */
  label(text) { this.#label = text; return this; }
  /** @param {import("gpui").Element | import("gpui").Entity} element */
  control(element) { this.#control = element; return this; }

  /** @param {import("gpui").Context} cx */
  build(cx) {
    const label = requiredText("FieldRow", "label", this.#label);
    const control = requiredRenderable("FieldRow", "control", this.#control);
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
      .child(h_flex().w(tokens.space(52)).flex_none().child(labelElement(label, cx).text_color(cx.theme().colors.muted_foreground)))
      .child(control);
  }
}

export class FormField {
  #id;
  #label;
  #control;
  #helper;
  #error;

  /** @param {string} id */
  constructor(id) { this.#id = stableId("FormField", id); }
  /** @param {string} text */
  label(text) { this.#label = text; return this; }
  /** @param {import("gpui").Element | import("gpui").Entity} element */
  control(element) { this.#control = element; return this; }
  /** @param {string} text */
  helper(text) { this.#helper = text; return this; }
  /** @param {string} message */
  error(message) { this.#error = message; return this; }

  /** @param {import("gpui").Context} cx */
  build(cx) {
    const label = requiredText("FormField", "label", this.#label);
    const control = requiredRenderable("FormField", "control", this.#control);
    const helper = optionalText("FormField", "helper", this.#helper) ?? "";
    const error = optionalText("FormField", "error", this.#error, {
      allowEmpty: true,
    }) ?? "";
    const tokens = style();
    const hasError = Boolean(error);
    const feedback = hasError ? error : helper;
    return v_flex()
      .id(this.#id)
      .min_w_0()
      .gap(tokens.spacing.labelGap)
      .child(labelElement(label, cx))
      .child(control)
      .when(Boolean(feedback), (element) => element.child(
        mutedElement(feedback, cx)
          .text_size(tokens.font.bodySmall)
          .when(hasError, (message) =>
            message
              .role("alert")
              .text_color(cx.theme().colors.destructive),
          ),
      ));
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
  #pressed = false;
  #quiet = false;

  /** @param {string} value */
  constructor(value) { this.#value = value; }

  /**
   * The key is physically down. A cap that reports this is reporting the
   * keyboard, not the interface, so it takes the focus chrome rather than the
   * selected chrome: nothing here is selectable.
   * @param {boolean} [value]
   */
  pressed(value = true) { this.#pressed = value === true; return this; }

  /**
   * Supporting metadata rather than a control — a hint strip along the bottom
   * of a window. Only the resting fill fades; the label and the border stay
   * fully legible, and a pressed cap keeps its full-strength response.
   * @param {boolean} [value]
   */
  quiet(value = true) { this.#quiet = value === true; return this; }

  /** @param {import("gpui").Context} cx */
  build(cx) {
    const value = requiredText("Keycap", "value", this.#value);
    const tokens = style();
    const states = surfaceStates(cx);
    return h_flex()
      .flex_none()
      .items_center()
      .justify_center()
      .px(tokens.space(3))
      .py(tokens.space(1))
      .rounded(tokens.cornerRadius)
      .border(
        this.#pressed ? states.focusBorderWidth : states.normalBorderWidth,
      )
      .border_color(this.#pressed ? states.focusBorder : states.normalBorder)
      .bg(
        this.#pressed
          ? states.focusFill
          : this.#quiet
            ? alpha(
                cx.theme().colors.foreground,
                tokens.state.normalFillAlpha / 2,
              )
            : states.normalFill,
      )
      .text_size(tokens.font.caption)
      .text_color(
        this.#pressed
          ? cx.theme().colors.foreground
          : this.#quiet
            ? cx.theme().colors.muted_foreground
            : cx.theme().colors.foreground,
      )
      .child(value);
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
      .children(this.#hints.map((hint) => {
        const key = requiredText("KeyHints", "key", hint.key);
        const label = requiredText("KeyHints", "label", hint.label);
        return h_flex()
        .items_center()
        .gap(tokens.space(3))
        .child(new Keycap(key).build(cx))
        .child(mutedElement(label, cx).text_size(tokens.font.caption).flex_none());
      }));
  }
}

/**
 * A link out of the application.
 *
 * Underlined as well as tinted, because a link identified by colour alone is
 * not a link to a reader who cannot separate it from the body text around it.
 */
export class ExternalLink {
  #id;
  #label;
  #href;

  /** @param {string} id */
  constructor(id) { this.#id = stableId("ExternalLink", id); }

  /** @param {string} text */
  label(text) { this.#label = text; return this; }

  /** @param {string} url */
  href(url) { this.#href = url; return this; }

  /** @param {import("gpui").Context} cx */
  build(cx) {
    const label = requiredText("ExternalLink", "label", this.#label);
    const href = requiredText("ExternalLink", "href", this.#href);
    const tokens = style();
    const color = role("link", cx.theme().colors.primary);
    return Link.new(this.#id)
      .href(href)
      .cursor_pointer()
      .text_size(tokens.font.body)
      .text_color(color)
      .border_b(tokens.state.normalBorderWidth)
      .border_color(color)
      .focus((appearance) =>
        appearance
          .bg(alpha(color, tokens.state.focusFillAlpha))
          .border_color(
            alpha(cx.theme().colors.ring, tokens.state.focusBorderAlpha),
          ),
      )
      .child(label);
  }
}

/**
 * The frame around a text field the application owns.
 *
 * `InputState` needs a live host call and belongs to the view that retains it,
 * so this class arranges and styles the control rather than creating it — the
 * same division `FormField` follows. What it adds is the chrome: one height
 * shared with every other control in a title row, and a focus ring drawn on
 * the border, so the field does not resize when the keyboard reaches it.
 */
export class FilterField {
  #state;
  /** @type {string | number | undefined} */
  #width;
  /** @type {ControlSize} */
  #size = "small";

  /** @param {import("gpui-base").InputState} value */
  state(value) { this.#state = value; return this; }

  /** @param {string | number} value */
  width(value) { this.#width = value; return this; }

  /** @param {string} value */
  size(value) { this.#size = controlSize("FilterField", value); return this; }

  /** @param {import("gpui").Context} cx */
  build(cx) {
    if (!this.#state || typeof this.#state !== "object") {
      throw new Error(
        "FilterField state must be an application-owned InputState",
      );
    }
    const tokens = style();
    const dimensions = sizeStyle(this.#size);
    const states = surfaceStates(cx);
    return Input.new(this.#state)
      .when(this.#width !== undefined, (element) =>
        element.w(/** @type {any} */ (this.#width)),
      )
      .h(dimensions.extent)
      .px(tokens.spacing.xs)
      .rounded(tokens.cornerRadius)
      .border(states.normalBorderWidth)
      .border_color(states.normalBorder)
      .bg(states.normalFill)
      .text_size(dimensions.fontSize)
      .text_color(cx.theme().colors.foreground)
      .focus((appearance) =>
        appearance
          .border(states.focusBorderWidth)
          .border_color(states.focusBorder),
      );
  }
}
