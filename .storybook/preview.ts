import type { Preview } from "@storybook/nextjs-vite";
import React from "react";
import { FPSMonitor } from "../src/library/utils/FPSMonitor";

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    docs: {
      story: {
        inline: false,
      },
    },
  },
  globalTypes: {
    fpsMonitor: {
      name: "FPS Monitor",
      description: "Show FPS monitor overlay",
      defaultValue: false,
      toolbar: {
        icon: "dashboard",
        items: [
          { value: false, title: "Hide FPS" },
          { value: true, title: "Show FPS" },
        ],
        dynamicTitle: true,
      },
    },
  },
  decorators: [
    (Story, context) => {
      const showFps = context.globals.fpsMonitor;
      return React.createElement(
        React.Fragment,
        null,
        showFps && React.createElement(FPSMonitor, { position: "top-right" }),
        React.createElement(Story)
      );
    },
  ],
};

export default preview;
