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
    /**
     * What the label alone cannot say -- most often the keyboard route to the
     * same action. A compact command carries this in its `description`, which is
     * also its accessible name; a labelled button already has an accessible name
     * and needs only the hint.
     * @param {string} text
     */
    tooltip(text: string): this;
    /**
     * A colour this control is a *reading* in, rather than an interface role.
     *
     * `accent` and `danger` are roles and the theme owns their colours. A tone
     * is a meaning the caller worked out -- a direction, a category, a mark that
     * is on -- that no token can name. It reaches the label and the icon
     * together, because a control half in one colour reads as a rendering bug.
     *
     * Disabled still wins: a control that cannot be pressed has to look like one.
     *
     * @param {import("gpui").Color | undefined} color
     */
    tone(color: import("gpui").Color | undefined): this;
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
    /**
     * A colour this command is a *reading* in, rather than an interface role.
     *
     * It is the command's full strength, and `quiet` decides when the command
     * reaches it: on its own the tone shows at rest, and with `quiet` the mark
     * rests muted and arrives at its own colour under the pointer. A starred
     * message keeps its mark lit; the star on every other row does not.
     *
     * Disabled still wins: a command that cannot be pressed has to look like one.
     *
     * @param {import("gpui").Color | undefined} color
     */
    tone(color: import("gpui").Color | undefined): this;
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
    /**
     * A colour this command is a *reading* in, rather than an interface role.
     *
     * It is the command's full strength, and `quiet` decides when the command
     * reaches it: on its own the tone shows at rest, and with `quiet` the mark
     * rests muted and arrives at its own colour under the pointer. A starred
     * message keeps its mark lit; the star on every other row does not.
     *
     * Disabled still wins: a command that cannot be pressed has to look like one.
     *
     * @param {import("gpui").Color | undefined} color
     */
    tone(color: import("gpui").Color | undefined): this;
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
    /**
     * A colour this row's text is a *reading* in, rather than an interface role.
     *
     * `danger` is a role and the theme owns its colour. A tone is a meaning the
     * caller worked out -- a direction, a rising or falling value -- that no
     * token can name. It reaches the label, the icon and the detail together,
     * because a row half in one colour reads as a rendering bug.
     *
     * Disabled still wins: a row that cannot be pressed has to look like one.
     *
     * @param {import("gpui").Color | undefined} color
     */
    tone(color: import("gpui").Color | undefined): this;
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
    /**
     * Append a whole strip at once, in order.
     *
     * The pair matches the open containers' `child`/`children`: a caller
     * building a strip by hand names each hint, and one rendering a strip it was
     * handed -- a keymap, a table of routes -- passes the list it already has
     * rather than reducing over it at every call site.
     *
     * @param {Array<{key: string, label: string}>} entries
     */
    hints(entries: Array<{
        key: string;
        label: string;
    }>): this;
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
 * A field whose value carries a unit: a price in USD, a size in shares.
 *
 * The unit belongs to the value, so it sits *inside* the field rather than
 * beside it. Beside it, a reader has to decide whether the word is part of
 * this control or the label of the next one, and the answer changes with how
 * wide the surrounding column happens to be.
 *
 * `Input` is a leaf and takes no children, so the unit is drawn over the
 * field's own right edge and the field is given room for it. The border and
 * the focus ring stay on the `Input`, which is what actually takes the
 * keyboard -- a wrapper carrying them would have to know when its child was
 * focused, and there is no `focus_within` to ask.
 */
export declare class ValueField {
    #private;
    /** @param {import("gpui-base").InputState} value */
    state(value: import("gpui-base").InputState): this;
    /** @param {string} text the unit this field's value is in */
    suffix(text: string): this;
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
