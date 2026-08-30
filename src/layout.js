// @ts-check

import { div } from "gpui";
import { h_flex, v_flex } from "gpui-base";
import { resolveSurfaceColor, style } from "./style.js";
import { role } from "./theme.js";

/** @param {string | number} value @param {import("gpui").Context} cx */
export const label = (value, cx) =>
  div()
    .text_size(style().font.body)
    .line_height(1.35)
    .text_color(cx.theme().colors.foreground)
    .child(value);

/** @param {string | number} value @param {import("gpui").Context} cx */
export const muted = (value, cx) =>
  div()
    .text_size(style().font.body)
    .line_height(1.35)
    .text_color(cx.theme().colors.muted_foreground)
    .child(value);

/** @param {string} value @param {import("gpui").Context} cx */
export const title = (value, cx) =>
  div()
    .text_size(style().font.title)
    .text_color(cx.theme().colors.foreground)
    .child(value);

/** @param {string} value @param {import("gpui").Context} cx */
export const sectionLabel = (value, cx) =>
  div()
    .text_size(style().font.caption)
    .text_color(cx.theme().colors.muted_foreground)
    .child(String(value).toUpperCase());

/**
 * @param {string} id @param {any} heading @param {any} actions
 * @param {import("gpui").Context} cx
 */
export const panelHeader = (id, heading, actions, cx) =>
  h_flex()
    .id(id)
    .role("section_header")
    .flex_none()
    .items_center()
    .justify_between()
    .gap(style().spacing.controlGap)
    .h(style().space(34))
    .px(style().spacing.rowPaddingX)
    .border_b(style().spacing.hairline)
    .border_color(role("separator", cx.theme().colors.border))
    .children([heading, actions].filter(Boolean));

/** @param {import("gpui").Context} cx */
export const appFrame = (cx) =>
  v_flex()
    .id("application-frame")
    .size_full()
    .min_w_0()
    .min_h_0()
    .font_family(style().fontFamily)
    .text_size(style().font.body)
    .bg(cx.theme().colors.background)
    .text_color(cx.theme().colors.foreground);

/** @param {{brand?: any, center?: any, actions?: any}} options @param {import("gpui").Context} cx */
export const topBar = (options, cx) =>
  h_flex()
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
    .children([options.brand, options.center, options.actions].filter(Boolean));

/** @param {{status?: any, hints?: any, leadsWithIcon?: boolean}} options @param {import("gpui").Context} cx */
export const bottomBar = (options, cx) =>
  h_flex()
    .id("application-bottom-bar")
    .h(style().space(28))
    .flex_none()
    .items_center()
    .justify_between()
    .gap(style().spacing.controlGap)
    .pl(style().space(options.leadsWithIcon === true ? 8 : 14))
    .pr(style().space(12))
    .border_t(style().spacing.hairline)
    .border_color(role("separator", cx.theme().colors.border))
    .bg(cx.theme().colors.background)
    .children([options.status, options.hints].filter(Boolean));

/**
 * @param {string} id @param {{actions?: any, status?: any, hints?: any}} options
 * @param {import("gpui").Context} cx
 */
export const actionBar = (id, options, cx) =>
  h_flex()
    .id(id)
    .role("toolbar")
    .flex_none()
    .items_center()
    .gap(style().spacing.controlGap)
    .px(style().spacing.panelPadding)
    .py(style().spacing.sm)
    .border_t(style().spacing.hairline)
    .border_color(role("separator", cx.theme().colors.border))
    .children([options.actions].filter(Boolean))
    .child(div().flex_1())
    .children([options.status, options.hints].filter(Boolean));

/** @param {{top?: any, content: any, bottom?: any}} options @param {import("gpui").Context} cx */
export const appShell = (options, cx) =>
  appFrame(cx)
    .children([options.top].filter(Boolean))
    .child(
      v_flex()
        .id("application-content")
        .flex_1()
        .min_w_0()
        .min_h_0()
        .overflow_hidden()
        .child(options.content),
    )
    .children([options.bottom].filter(Boolean));

/** @param {string} id @param {any} content @param {import("gpui").Context} cx */
export const centeredWorkspace = (id, content, cx) =>
  h_flex()
    .id(id)
    .items_start()
    .size_full()
    .min_w_0()
    .min_h_0()
    .justify_center()
    .overflow_y_scroll()
    .child(content);

/** @param {string} id @param {import("gpui").Context} cx @param {{maxWidth?: import("gpui").DefiniteLength}} [options] */
export const pageColumn = (id, cx, options = {}) =>
  v_flex()
    .id(id)
    .w_full()
    .max_w(options.maxWidth ?? style().space(560))
    .gap(style().spacing.panelGap)
    .p(style().spacing.panelPadding);

/** @param {import("gpui").Context} cx */
export const surface = (cx) =>
  v_flex()
    .min_w_0()
    .min_h_0()
    .bg(cx.theme().colors.surface)
    .border(style().spacing.hairline)
    .border_color(cx.theme().colors.border)
    .rounded(style().cornerRadius)
    .overflow_hidden();

/** @param {string} id @param {import("gpui").Context} cx */
export const popupSurface = (id, cx) => {
  const tokens = style();
  return v_flex()
    .id(id)
    .flex_none()
    .p(tokens.space(4))
    .gap(tokens.space(2))
    .rounded(tokens.cornerRadius)
    .bg(resolveSurfaceColor(tokens, tokens.surfaces.popupBackground, cx.theme().colors.background, tokens.surfaces.popupBackgroundAlpha))
    .border(tokens.state.normalBorderWidth)
    .border_color(resolveSurfaceColor(tokens, tokens.surfaces.popupBorder, cx.theme().colors.ring, tokens.surfaces.popupBorderAlpha))
    .text_color(resolveSurfaceColor(tokens, tokens.surfaces.popupText, cx.theme().colors.foreground));
};
