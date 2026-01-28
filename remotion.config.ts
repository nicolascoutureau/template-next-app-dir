// See all configuration options: https://remotion.dev/docs/config
// Each option also is available as a CLI flag: https://remotion.dev/docs/cli

// Note: When using the Node.JS APIs, the config file doesn't apply. Instead, pass options directly to the APIs

import { Config } from "@remotion/cli/config";
import { enableTailwind } from "@remotion/tailwind-v4";

// Use ANGLE for WebGL rendering (required for R3F)
Config.setChromiumOpenGlRenderer("angle");
Config.setVideoImageFormat("jpeg");

Config.overrideWebpackConfig((currentConfiguration) => {
  return enableTailwind(currentConfiguration);
});

// Enable experimental client-side rendering in the Studio
Config.setExperimentalClientSideRenderingEnabled(true);
