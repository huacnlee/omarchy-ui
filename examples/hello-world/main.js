// @ts-check

import { View } from "gpui";
import { appShell, button, muted, pageColumn, style, surface, title } from "omarchy-ui";

export default class HelloWorld extends View {
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
