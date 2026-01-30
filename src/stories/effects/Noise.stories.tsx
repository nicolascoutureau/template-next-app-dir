import type { Meta, StoryObj } from "@storybook/react";
import { Noise } from "../../remotion/library/components/effects/Noise";
import { RemotionWrapper } from "../helpers/RemotionWrapper";

const meta: Meta<typeof Noise> = {
  title: "Effects/Noise",
  component: Noise,
  decorators: [
    (Story) => (
      <RemotionWrapper durationInFrames={120}>
        <Story />
      </RemotionWrapper>
    ),
  ],
  parameters: {
    layout: "fullscreen",
  },
};

export default meta;
type Story = StoryObj<typeof Noise>;

export const FilmGrain: Story = {
  args: {
    opacity: 0.08,
    scale: 1,
    speed: 1,
    children: (
      <div
        style={{
          width: "100%",
          height: "100%",
          background: "linear-gradient(45deg, #222, #444)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "white",
          fontSize: 40,
          fontWeight: "bold",
        }}
      >
        Film Grain Texture
      </div>
    ),
  },
};

export const ChromaticNoise: Story = {
  args: {
    opacity: 0.15,
    scale: 2,
    speed: 0.5,
    chromatic: true,
    blendMode: "screen",
    children: (
      <div
        style={{
          width: "100%",
          height: "100%",
          backgroundColor: "#111",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "white",
          fontSize: 40,
          fontWeight: "bold",
        }}
      >
        Chromatic Aberration
      </div>
    ),
  },
};

export const StaticTexture: Story = {
  args: {
    opacity: 0.2,
    scale: 0.5,
    speed: 0,
    baseFrequencyX: 0.02,
    baseFrequencyY: 0.8,
    children: (
      <div
        style={{
          width: "100%",
          height: "100%",
          backgroundColor: "#e0e0e0",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "#333",
          fontSize: 40,
          fontWeight: "bold",
        }}
      >
        Paper Texture
      </div>
    ),
  },
};
