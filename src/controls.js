// @ts-check

import { svg } from "gpui";
import { Button, Input, h_flex, v_flex } from "gpui-base";
import { label, muted } from "./layout.js";
import { alpha, style } from "./style.js";

const NO_FILL = /** @type {import("gpui").Color} */ ("#00000000");

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
    focusFill: alpha(own, state.focusFillAlpha),
    focusBorder: alpha(cx.theme().colors.ring, state.focusBorderAlpha),
    borderWidth: state.normalBorderWidth,
    focusBorderWidth: state.focusBorderWidth,
  };
}

/**
 * @param {string} id @param {string} caption
 * @param {(event: import("gpui").ClickEvent, cx: import("gpui").Context) => void} onClick
 * @param {import("gpui").Context} cx
 * @param {{variant?: "secondary" | "danger", disabled?: boolean, selected?: boolean, bordered?: boolean, tooltip?: string, fontSize?: number, asset?: string, color?: import("gpui").Color}} [options]
 */
export function button(id, caption, onClick, cx, options = {}) {
  const {
    variant = "secondary",
    disabled = false,
    selected = false,
    bordered = false,
    tooltip = "",
    fontSize,
    asset = "",
    color,
  } = options;
  const tokens = style();
  const foreground = color ?? (variant === "danger" ? cx.theme().colors.destructive : cx.theme().colors.foreground);
  const states = surfaceStates(cx, foreground);
  return Button.new(id)
    .disabled(disabled)
    .selected(selected)
    .flex()
    .items_center()
    .justify_center()
    .gap(tokens.spacing.md)
    .px(tokens.spacing.controlPaddingX)
    .py(tokens.spacing.controlPaddingY)
    .rounded(tokens.cornerRadius)
    .border(states.borderWidth)
    .border_color(selected ? states.hoverBorder : bordered ? states.normalBorder : NO_FILL)
    .bg(selected ? states.selectedFill : bordered ? states.normalFill : NO_FILL)
    .text_size(fontSize ?? tokens.font.body)
    .text_color(foreground)
    .when(Boolean(tooltip), (element) => element.tooltip(tooltip))
    .when(Boolean(asset), (element) => element.child(svg(asset).flex_none().size(tokens.font.iconSmall).text_color(foreground)))
    .when(!disabled, (element) => element.on_click(onClick))
    .when(!disabled, (element) => element.hover((appearance) => appearance.bg(states.hoverFill).border_color(states.hoverBorder)))
    .when(!disabled, (element) => element.active((appearance) => appearance.bg(states.pressedFill)))
    .focus((appearance) => appearance.bg(states.focusFill).border(states.focusBorderWidth).border_color(states.focusBorder))
    .when(disabled, (element) => element.opacity(0.4))
    .child(caption);
}

/**
 * @param {string} id @param {string} asset @param {string} caption
 * @param {(event: import("gpui").ClickEvent, cx: import("gpui").Context) => void} onClick
 * @param {import("gpui").Context} cx
 * @param {{disabled?: boolean, selected?: boolean, bordered?: boolean, tooltip?: string, variant?: "secondary" | "danger", color?: import("gpui").Color}} [options]
 */
export function iconTextButton(id, asset, caption, onClick, cx, options = {}) {
  return button(id, caption, onClick, cx, {
    ...options,
    asset,
    bordered: options.bordered ?? true,
    fontSize: style().font.bodySmall,
  }).h(style().spacing.controlHeight);
}

/**
 * @param {string} id @param {any} content @param {string} description
 * @param {(event: import("gpui").ClickEvent, cx: import("gpui").Context) => void} onClick
 * @param {import("gpui").Context} cx
 * @param {{disabled?: boolean, selected?: boolean, color?: import("gpui").Color, hoverColor?: import("gpui").Color, size?: import("gpui").Length}} options
 */
function compactCommand(id, content, description, onClick, cx, options) {
  const { disabled = false, selected = false, color } = options;
  const hoverColor = options.hoverColor ?? cx.theme().colors.foreground;
  const tokens = style();
  const foreground = color || cx.theme().colors.foreground;
  const states = surfaceStates(cx, foreground);
  const extent = options.size ?? Math.max(tokens.space(24), tokens.font.icon + tokens.spacing.sm * 2);
  return Button.new(id)
    .disabled(disabled)
    .selected(selected)
    .accessibility_label(description)
    .tooltip(description)
    .flex()
    .items_center()
    .justify_center()
    .flex_none()
    .size(extent)
    .p(tokens.space(2))
    .rounded(tokens.cornerRadius)
    .bg(selected ? states.selectedFill : NO_FILL)
    .text_color(selected ? hoverColor : foreground)
    .when(!disabled, (element) => element.on_click(onClick))
    .when(!disabled, (element) => element.hover((appearance) => appearance.bg(states.hoverFill).text_color(hoverColor)))
    .when(!disabled, (element) => element.active((appearance) => appearance.bg(states.pressedFill)))
    .focus((appearance) => appearance.bg(states.focusFill).border(states.focusBorderWidth).border_color(states.focusBorder))
    .when(disabled, (element) => element.opacity(0.4))
    .child(content);
}

/**
 * @param {string} id @param {string} asset @param {string} description
 * @param {(event: import("gpui").ClickEvent, cx: import("gpui").Context) => void} onClick
 * @param {import("gpui").Context} cx
 * @param {{disabled?: boolean, selected?: boolean, color?: import("gpui").Color, hoverColor?: import("gpui").Color, size?: import("gpui").Length, iconSize?: import("gpui").Length}} [options]
 */
export function iconButton(id, asset, description, onClick, cx, options = {}) {
  return compactCommand(id, svg(asset).size(options.iconSize ?? style().font.icon).flex_none(), description, onClick, cx, options);
}

/**
 * @param {string} id @param {string} glyph @param {string} description
 * @param {(event: import("gpui").ClickEvent, cx: import("gpui").Context) => void} onClick
 * @param {import("gpui").Context} cx @param {{disabled?: boolean, selected?: boolean}} [options]
 */
export function glyphButton(id, glyph, description, onClick, cx, options = {}) {
  return compactCommand(id, glyph, description, onClick, cx, options);
}

/** @param {import("gpui-base").InputState} state @param {import("gpui").Context} cx */
export const field = (state, cx) => {
  const tokens = style();
  const states = surfaceStates(cx);
  return Input.new(state)
    .flex_1()
    .h(tokens.spacing.controlHeight)
    .px(tokens.spacing.controlPaddingX)
    .py(tokens.spacing.inputPaddingY)
    .rounded(tokens.cornerRadius)
    .border(states.borderWidth)
    .border_color(states.normalBorder)
    .bg(states.normalFill)
    .text_size(tokens.font.body)
    .text_color(cx.theme().colors.foreground)
    .hover((appearance) => appearance.bg(states.hoverFill).border_color(states.hoverBorder))
    .focus((appearance) => appearance.bg(states.hoverFill).border_color(states.hoverBorder));
};

/** @param {string} id @param {string} caption @param {any} control @param {import("gpui").Context} cx */
export const fieldRow = (id, caption, control, cx) => {
  const tokens = style();
  return h_flex()
    .id(id)
    .flex_none()
    .items_center()
    .gap(tokens.spacing.controlGap)
    .px(tokens.spacing.panelPadding)
    .py(tokens.spacing.xs)
    .border_b(tokens.spacing.hairline)
    .border_color(cx.theme().colors.border)
    .child(h_flex().w(tokens.space(52)).flex_none().child(label(caption, cx).text_color(cx.theme().colors.muted_foreground)))
    .child(control);
};

/** @param {string} id @param {string} caption @param {any} control @param {import("gpui").Context} cx @param {string} [helper] */
export const formField = (id, caption, control, cx, helper = "") => {
  const tokens = style();
  return v_flex()
    .id(id)
    .min_w_0()
    .gap(tokens.spacing.labelGap)
    .child(label(caption, cx))
    .child(control)
    .when(Boolean(helper), (element) => element.child(muted(helper, cx).text_size(tokens.font.bodySmall)));
};

/**
 * @param {string} id @param {string} caption
 * @param {(event: import("gpui").ClickEvent, cx: import("gpui").Context) => void} onClick
 * @param {import("gpui").Context} cx
 * @param {{detail?: string, danger?: boolean, disabled?: boolean, asset?: string, selected?: boolean, cursor?: boolean, dim?: boolean}} [options]
 */
export function menuItem(id, caption, onClick, cx, options = {}) {
  const { detail = "", danger = false, disabled = false, asset = "", selected = false, cursor = false, dim = false } = options;
  const tokens = style();
  const foreground = danger ? cx.theme().colors.destructive : dim ? cx.theme().colors.muted_foreground : cx.theme().colors.foreground;
  const states = surfaceStates(cx, foreground);
  return Button.new(id)
    .role("menu_item")
    .disabled(disabled)
    .flex()
    .items_center()
    .justify_between()
    .w_full()
    .h(tokens.spacing.popupRowHeight)
    .gap(tokens.spacing.controlGap)
    .px(tokens.space(9))
    .rounded(tokens.cornerRadius)
    .bg(selected ? states.selectedFill : cursor ? states.hoverFill : NO_FILL)
    .text_size(tokens.font.bodySmall)
    .text_color(foreground)
    .when(!disabled, (element) => element.on_click(onClick))
    .when(!disabled, (element) => element.hover((appearance) => appearance.bg(states.hoverFill)))
    .focus((appearance) => appearance.bg(states.focusFill).border(states.focusBorderWidth).border_color(states.focusBorder))
    .when(disabled, (element) => element.opacity(0.4))
    .child(h_flex().items_center().gap(tokens.spacing.md).min_w_0().when(Boolean(asset), (element) => element.child(svg(asset).flex_none().size(tokens.font.iconSmall).text_color(foreground))).child(label(caption, cx).text_color(foreground).truncate()))
    .when(Boolean(detail), (element) => element.child(muted(detail, cx).flex_none().text_size(tokens.font.bodySmall)));
}

/** @param {import("gpui").Context} cx */
export const separator = (cx) =>
  v_flex().flex_none().h(style().spacing.hairline).w_full().bg(alpha(cx.theme().colors.foreground, 0.12));

/** @param {import("gpui").Context} cx */
export const menuSeparator = (cx) =>
  v_flex().flex_none().h(style().space(7)).w_full().justify_center().child(separator(cx));

/** @param {string} value @param {import("gpui").Context} cx */
export const kbd = (value, cx) => {
  const tokens = style();
  const states = surfaceStates(cx);
  return h_flex().flex_none().items_center().justify_center().px(tokens.space(3)).py(tokens.space(1)).rounded(tokens.cornerRadius).bg(states.normalFill).text_size(tokens.font.caption).text_color(cx.theme().colors.foreground).child(value);
};

/** @param {Array<{key: string, label: string}>} hints @param {import("gpui").Context} cx */
export const keyHints = (hints, cx) => {
  const tokens = style();
  return h_flex()
    .id("key-hints")
    .flex_none()
    .items_center()
    .gap(tokens.space(7))
    .children(hints.map((hint) => h_flex().items_center().gap(tokens.space(3)).child(kbd(hint.key, cx)).child(muted(hint.label, cx).text_size(tokens.font.caption).flex_none())));
};
