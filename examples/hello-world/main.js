// @ts-check

import { View } from "gpui";
import { set_theme } from "gpui-base";
import {
  appShell,
  applyOmarchyRoles,
  applyOmarchyStyle,
  button,
  muted,
  omarchyTheme,
  pageColumn,
  style,
  surface,
  title,
} from "omarchy-ui";

const OMARCHY_COLORS = `
mode = "dark"
background = "#1a1b26"
foreground = "#c0caf5"
accent = "#7aa2f7"
red = "#f7768e"
green = "#9ece6a"
yellow = "#e0af68"
blue = "#7aa2f7"
magenta = "#bb9af7"
cyan = "#7dcfff"
`;

const OMARCHY_SHELL = `
[font]
base-size = 12
[spacing]
scale = 1
scale-with-font = true
`;

export default class HelloWorld extends View {
  init(_props, cx) {
    const tokens = applyOmarchyStyle(OMARCHY_SHELL, {
      cornerRadius: 0,
      fontFamily: "monospace",
    });
    applyOmarchyRoles(OMARCHY_COLORS);
    const theme = omarchyTheme(OMARCHY_COLORS, cx.theme(), tokens);
    if (theme) set_theme(theme);
  }

  render(cx) {
    const tokens = style();
    const content = pageColumn("hello-world-page", cx).child(
      surface(cx)
        .p(tokens.spacing.panelPadding)
        .gap(tokens.spacing.md)
        .child(title("Hello, Omarchy UI", cx))
        .child(muted("A minimal gpui-shell application using the shared UI primitives.", cx))
        .child(
          button(
            "hello-world-button",
            "Say hello",
            (_event, context) => context.notify(),
            cx,
            { bordered: true },
          ),
        ),
    );

    return appShell({ content }, cx);
  }
}
