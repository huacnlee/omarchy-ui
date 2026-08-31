declare const SIZES: readonly ["small", "medium", "large"];
export type ControlSize = typeof SIZES[number];
export declare class Button {
    #private;
    /** @param {string} id */
    constructor(id: string);
    /** @param {string} text */
    label(text: string): this;
    /** @param {string} asset complete application-root-relative asset path */
    icon(asset: string): this;
    outlined(): this;
    /** @param {boolean} [value] */
    bordered(value?: boolean): this;
    /** @param {boolean} [value] */
    selected(value?: boolean): this;
    /** @param {boolean} [value] the one control a screen wants pressed */
    accent(value?: boolean): this;
    /** @param {boolean} [value] */
    danger(value?: boolean): this;
    /** @param {boolean} [value] */
    disabled(value?: boolean): this;
    /** @param {boolean} [value] */
    loading(value?: boolean): this;
    /** @param {string} text */
    loadingLabel(text: string): this;
    /** @param {string} value */
    size(value: string): this;
    /** @param {((event: import("gpui").ClickEvent, cx: import("gpui").Context) => void) | undefined} callback */
    onClick(callback: ((event: import("gpui").ClickEvent, cx: import("gpui").Context) => void) | undefined): this;
    /** @param {import("gpui").Context} cx */
    build(cx: import("gpui").Context): import("gpui").Element;
}
export declare class IconButton {
    #private;
    /** @param {string} id */
    constructor(id: string);
    /** @param {string} asset complete application-root-relative asset path */
    icon(asset: string): this;
    /** @param {string} text */
    description(text: string): this;
    outlined(): this;
    /** @param {boolean} [value] */
    bordered(value?: boolean): this;
    /** @param {boolean} [value] */
    selected(value?: boolean): this;
    /** @param {boolean} [value] supporting chrome: muted until pointed at */
    quiet(value?: boolean): this;
    /** @param {boolean} [value] */
    disabled(value?: boolean): this;
    /** @param {boolean} [value] */
    loading(value?: boolean): this;
    /** @param {string} text */
    loadingLabel(text: string): this;
    /** @param {string} value */
    size(value: string): this;
    /** @param {((event: import("gpui").ClickEvent, cx: import("gpui").Context) => void) | undefined} callback */
    onClick(callback: ((event: import("gpui").ClickEvent, cx: import("gpui").Context) => void) | undefined): this;
    /** @param {import("gpui").Context} cx */
    build(cx: import("gpui").Context): import("gpui").Element;
}
export declare class GlyphButton {
    #private;
    /** @param {string} id */
    constructor(id: string);
    /** @param {string} text */
    glyph(text: string): this;
    /** @param {string} text */
    description(text: string): this;
    outlined(): this;
    /** @param {boolean} [value] */
    bordered(value?: boolean): this;
    /** @param {boolean} [value] */
    selected(value?: boolean): this;
    /** @param {boolean} [value] supporting chrome: muted until pointed at */
    quiet(value?: boolean): this;
    /** @param {boolean} [value] */
    disabled(value?: boolean): this;
    /** @param {boolean} [value] */
    loading(value?: boolean): this;
    /** @param {string} text */
    loadingLabel(text: string): this;
    /** @param {string} value */
    size(value: string): this;
    /** @param {((event: import("gpui").ClickEvent, cx: import("gpui").Context) => void) | undefined} callback */
    onClick(callback: ((event: import("gpui").ClickEvent, cx: import("gpui").Context) => void) | undefined): this;
    /** @param {import("gpui").Context} cx */
    build(cx: import("gpui").Context): import("gpui").Element;
}
export declare class MenuItem {
    #private;
    /** @param {string} id */
    constructor(id: string);
    /** @param {string} text */
    label(text: string): this;
    /** @param {string} text */
    detail(text: string): this;
    /** @param {string} asset complete application-root-relative asset path */
    icon(asset: string): this;
    /** @param {boolean} [value] */
    selected(value?: boolean): this;
    /** @param {boolean} [value] */
    danger(value?: boolean): this;
    /** @param {boolean} [value] */
    disabled(value?: boolean): this;
    /** @param {((event: import("gpui").ClickEvent, cx: import("gpui").Context) => void) | undefined} callback */
    onClick(callback: ((event: import("gpui").ClickEvent, cx: import("gpui").Context) => void) | undefined): this;
    /** @param {import("gpui").Context} cx */
    build(cx: import("gpui").Context): import("gpui").Element;
}
export declare class FieldRow {
    #private;
    /** @param {string} id */
    constructor(id: string);
    /** @param {string} text */
    label(text: string): this;
    /** @param {import("gpui").Element | import("gpui").Entity} element */
    control(element: import("gpui").Element | import("gpui").Entity): this;
    /** @param {import("gpui").Context} cx */
    build(cx: import("gpui").Context): import("gpui").Element;
}
export declare class FormField {
    #private;
    /** @param {string} id */
    constructor(id: string);
    /** @param {string} text */
    label(text: string): this;
    /** @param {import("gpui").Element | import("gpui").Entity} element */
    control(element: import("gpui").Element | import("gpui").Entity): this;
    /** @param {string} text */
    helper(text: string): this;
    /** @param {string} message */
    error(message: string): this;
    /** @param {import("gpui").Context} cx */
    build(cx: import("gpui").Context): import("gpui").Element;
}
export declare class Separator {
    /** @param {import("gpui").Context} cx */
    build(cx: import("gpui").Context): import("gpui").Element;
}
export declare class MenuSeparator {
    /** @param {import("gpui").Context} cx */
    build(cx: import("gpui").Context): import("gpui").Element;
}
export declare class Keycap {
    #private;
    /** @param {string} value */
    constructor(value: string);
    /**
     * The key is physically down. A cap that reports this is reporting the
     * keyboard, not the interface, so it takes the focus chrome rather than the
     * selected chrome: nothing here is selectable.
     * @param {boolean} [value]
     */
    pressed(value?: boolean): this;
    /**
     * Supporting metadata rather than a control — a hint strip along the bottom
     * of a window. Only the resting fill fades; the label and the border stay
     * fully legible, and a pressed cap keeps its full-strength response.
     * @param {boolean} [value]
     */
    quiet(value?: boolean): this;
    /** @param {import("gpui").Context} cx */
    build(cx: import("gpui").Context): import("gpui").Element;
}
export declare class KeyHints {
    #private;
    /** @param {string} id */
    constructor(id: string);
    /** @param {string} key @param {string} label */
    hint(key: string, label: string): this;
    /** @param {import("gpui").Context} cx */
    build(cx: import("gpui").Context): import("gpui").Element;
}
/**
 * A link out of the application.
 *
 * Underlined as well as tinted, because a link identified by colour alone is
 * not a link to a reader who cannot separate it from the body text around it.
 */
export declare class ExternalLink {
    #private;
    /** @param {string} id */
    constructor(id: string);
    /** @param {string} text */
    label(text: string): this;
    /** @param {string} url */
    href(url: string): this;
    /** @param {import("gpui").Context} cx */
    build(cx: import("gpui").Context): import("gpui").Element;
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
export declare class FilterField {
    #private;
    /** @param {import("gpui-base").InputState} value */
    state(value: import("gpui-base").InputState): this;
    /** @param {string | number} value */
    width(value: string | number): this;
    /** @param {string} value */
    size(value: string): this;
    /** @param {import("gpui").Context} cx */
    build(cx: import("gpui").Context): import("gpui").Element;
}
/**
 * The trigger an account menu hangs from: a compact command whose content is
 * an `Avatar` rather than an icon.
 *
 * Distinct from `IconButton` because the mark inside is a *subject* — a person,
 * an account, an organisation — and carries the subject's own initials or
 * tint. A trigger that drew the same glyph for everyone would not need one.
 */
export declare class AvatarButton {
    #private;
    /** @param {string} id */
    constructor(id: string);
    /** @param {string} text one or two characters */
    initials(text: string): this;
    /** @param {string} asset complete application-root-relative asset path */
    icon(asset: string): this;
    /** @param {string} text the accessible name and the tooltip */
    description(text: string): this;
    /** @param {import("gpui").Color | undefined} color */
    tint(color: import("gpui").Color | undefined): this;
    /** @param {boolean} [value] the menu this trigger opens is showing */
    selected(value?: boolean): this;
    /** @param {boolean} [value] supporting chrome: muted until pointed at */
    quiet(value?: boolean): this;
    /** @param {boolean} [value] */
    disabled(value?: boolean): this;
    /** @param {string} value */
    size(value: string): this;
    /** @param {((event: import("gpui").ClickEvent, cx: import("gpui").Context) => void) | undefined} callback */
    onClick(callback: ((event: import("gpui").ClickEvent, cx: import("gpui").Context) => void) | undefined): this;
    /** @param {import("gpui").Context} cx */
    build(cx: import("gpui").Context): import("gpui").Element;
}
export {};
