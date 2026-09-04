/** The container one or more `AccordionSection`s sit in. */
export declare class AccordionGroup {
    #private;
    /** @param {string} id */
    constructor(id: string);
    /** @param {import("gpui-kit").Element | import("gpui-kit").Entity} element */
    child(element: import("gpui-kit").Element | import("gpui-kit").Entity): this;
    /** @param {import("gpui-kit").Context} _cx */
    build(_cx: import("gpui-kit").Context): import("gpui-kit").Element;
}
/**
 * One collapsible section.
 *
 * `open` and `onToggle` are the application's, not the section's: a disclosure
 * that remembered its own state would forget it the next time the data under
 * it changed and the view rebuilt.
 *
 * `keepMounted` is for a body that is a retained child view — a chart, an
 * editor — which a collapse that unmounted would tear down and rebuild.
 *
 * `inset` is the trigger row's horizontal padding, so a disclosure can line its
 * chevron up with whatever content it sits under rather than with whatever this
 * module happened to choose.
 */
export declare class AccordionSection {
    #private;
    /** @param {string} id */
    constructor(id: string);
    /** @param {string} text */
    title(text: string): this;
    /** @param {string} text a reading that belongs with the title, not under it */
    detail(text: string): this;
    /** @param {boolean} [value] */
    open(value?: boolean): this;
    /** @param {number} value the heading level this section announces */
    level(value: number): this;
    /** @param {boolean} [value] */
    keepMounted(value?: boolean): this;
    /** @param {number} value */
    inset(value: number): this;
    /** @param {import("gpui-kit").Element | import("gpui-kit").Entity} element */
    body(element: import("gpui-kit").Element | import("gpui-kit").Entity): this;
    /** @param {((open: boolean, cx: import("gpui-kit").Context) => void) | undefined} callback */
    onToggle(callback: ((open: boolean, cx: import("gpui-kit").Context) => void) | undefined): this;
    /** @param {import("gpui-kit").Context} cx */
    build(cx: import("gpui-kit").Context): import("gpui-kit").Element;
}
