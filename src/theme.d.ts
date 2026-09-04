/** @param {string} source */
export declare function omarchyBaseColors(source: string): import("gpui-kit").Color[];
/** @param {string} source */
export declare function omarchyStatusColors(source: string): {
    danger: import("gpui-kit").Color;
    success: import("gpui-kit").Color;
    warning: import("gpui-kit").Color;
    info: import("gpui-kit").Color;
};
/**
 * The four foundational roles plus the ones the app derives from them.
 *
 * Omarchy's palette is deliberately small — background, foreground, accent and
 * urgent — and every other tone in the window is a mix or an alpha of those,
 * which is what lets a theme change propagate without a second palette to keep
 * in sync. These are the same derivations `App.qml` declared at the top of the
 * window and passed down as required properties.
 * @param {string} source
 */
export declare function omarchyRoles(source: string): {
    background: import("gpui-kit").Color;
    foreground: import("gpui-kit").Color;
    accent: import("gpui-kit").Color;
    urgent: import("gpui-kit").Color;
    danger: import("gpui-kit").Color;
    dim: import("gpui-kit").Color;
    dimmer: import("gpui-kit").Color;
    link: import("gpui-kit").Color;
    separator: import("gpui-kit").Color;
    selection: import("gpui-kit").Color;
    lighterBackground: import("gpui-kit").Color;
    darkBackground: import("gpui-kit").Color;
    lightForeground: import("gpui-kit").Color;
    brightForeground: import("gpui-kit").Color;
    mutedForeground: import("gpui-kit").Color;
};
/**
 * Project Omarchy colors into a complete gpui-base semantic theme snapshot.
 *
 * Spacing and radius come from the shell's structural tokens rather than from
 * gpui's own scale: Omarchy is a 12px monospace desktop whose corners follow
 * Hyprland's `decoration:rounding`, and an application window that rounds its own
 * corners or pads at gpui's default rhythm reads as a foreign application on
 * that desktop. `fallback` still supplies any color role Omarchy has no
 * opinion about.
 * @param {string} source
 * @param {any} fallback
 * @param {import("./style.js").OmarchyStyle} [tokens]
 * @returns {{appearance:"light"|"dark",tokens:{colors:any,spacing:any,radius:any}}|null}
 */
export declare function omarchyTheme(source: string, fallback: any, tokens?: import("./style.js").OmarchyStyle): {
    appearance: "light" | "dark";
    tokens: {
        colors: any;
        spacing: any;
        radius: any;
    };
} | null;
/** The derived palette roles. Null until the host has read a theme. */
export declare function roles(): {
    background: import("gpui-kit").Color;
    foreground: import("gpui-kit").Color;
    accent: import("gpui-kit").Color;
    urgent: import("gpui-kit").Color;
    danger: import("gpui-kit").Color;
    dim: import("gpui-kit").Color;
    dimmer: import("gpui-kit").Color;
    link: import("gpui-kit").Color;
    separator: import("gpui-kit").Color;
    selection: import("gpui-kit").Color;
    lighterBackground: import("gpui-kit").Color;
    darkBackground: import("gpui-kit").Color;
    lightForeground: import("gpui-kit").Color;
    brightForeground: import("gpui-kit").Color;
    mutedForeground: import("gpui-kit").Color;
};
/**
 * Resolve one derived role, falling back to a theme token when no Omarchy
 * palette has been read — a test, or a desktop that is not Omarchy.
 * @param {"dim"|"dimmer"|"link"|"urgent"|"danger"|"accent"|"selection"|"separator"} name
 * @param {import("gpui-kit").Color} fallback
 * @returns {import("gpui-kit").Color}
 */
export declare function role(name: "dim" | "dimmer" | "link" | "urgent" | "danger" | "accent" | "selection" | "separator", fallback: import("gpui-kit").Color): import("gpui-kit").Color;
/** @param {string} source */
export declare function applyOmarchyRoles(source: string): {
    background: import("gpui-kit").Color;
    foreground: import("gpui-kit").Color;
    accent: import("gpui-kit").Color;
    urgent: import("gpui-kit").Color;
    danger: import("gpui-kit").Color;
    dim: import("gpui-kit").Color;
    dimmer: import("gpui-kit").Color;
    link: import("gpui-kit").Color;
    separator: import("gpui-kit").Color;
    selection: import("gpui-kit").Color;
    lighterBackground: import("gpui-kit").Color;
    darkBackground: import("gpui-kit").Color;
    lightForeground: import("gpui-kit").Color;
    brightForeground: import("gpui-kit").Color;
    mutedForeground: import("gpui-kit").Color;
};
