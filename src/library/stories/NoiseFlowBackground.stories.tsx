import type { Meta, StoryObj } from "@storybook/react";
import { RemotionPreview } from "./RemotionPreview";
import { NoiseFlowBackground, Noise } from "../index";
import type { NoiseFlowBackgroundProps } from "../index";
import { AbsoluteFill } from "remotion";

const meta: Meta<NoiseFlowBackgroundProps> = {
  title: "Motion Library/Background/NoiseFlowBackground",
  component: NoiseFlowBackground,
  parameters: {
    layout: "centered",
  },
  argTypes: {
    pattern: {
      control: "select",
      options: ["flow", "turbulence", "ridged", "billowy", "warp", "cells"],
    },
    scale: { control: { type: "range", min: 1, max: 10, step: 0.5 } },
    octaves: { control: { type: "range", min: 1, max: 8, step: 1 } },
    persistence: { control: { type: "range", min: 0.1, max: 0.9, step: 0.1 } },
    speed: { control: { type: "range", min: 0.1, max: 3, step: 0.1 } },
    flowAngle: { control: { type: "range", min: 0, max: 360, step: 15 } },
    contrast: { control: { type: "range", min: 0.5, max: 2, step: 0.1 } },
  },
};

export default meta;
type Story = StoryObj<NoiseFlowBackgroundProps>;

export const FlowingNoise: Story = {
  args: {
    pattern: "flow",
    color1: "#0070f3",
    color2: "#7928ca",
    scale: 3,
    octaves: 4,
    speed: 1,
    flowAngle: 45,
  },
  render: (args: NoiseFlowBackgroundProps) => (
    <RemotionPreview durationInFrames={180} width={800} height={450}>
      <AbsoluteFill>
        <NoiseFlowBackground {...args} width={800} height={450} />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-4xl font-bold text-white drop-shadow-lg">
            Flowing Noise
          </div>
        </div>
        <Noise opacity={0.02} width={800} height={450} />
      </AbsoluteFill>
    </RemotionPreview>
  ),
};

export const TurbulentStorm: Story = {
  args: {
    pattern: "turbulence",
    color1: "#1a1a2e",
    color2: "#4a00e0",
    backgroundColor: "#0a0a0f",
    scale: 4,
    octaves: 6,
    speed: 1.2,
  },
  render: (args: NoiseFlowBackgroundProps) => (
    <RemotionPreview durationInFrames={180} width={800} height={450}>
      <AbsoluteFill>
        <NoiseFlowBackground {...args} width={800} height={450} />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-4xl font-bold text-white drop-shadow-lg">
            Turbulence
          </div>
        </div>
        <Noise opacity={0.03} width={800} height={450} />
      </AbsoluteFill>
    </RemotionPreview>
  ),
};

export const RidgedMountains: Story = {
  args: {
    pattern: "ridged",
    color1: "#2d3436",
    color2: "#74b9ff",
    backgroundColor: "#0a0a0a",
    scale: 3,
    octaves: 5,
    contrast: 1.3,
    speed: 0.8,
  },
  render: (args: NoiseFlowBackgroundProps) => (
    <RemotionPreview durationInFrames={180} width={800} height={450}>
      <AbsoluteFill>
        <NoiseFlowBackground {...args} width={800} height={450} />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-4xl font-bold text-white drop-shadow-lg">
            Ridged
          </div>
        </div>
        <Noise opacity={0.02} width={800} height={450} />
      </AbsoluteFill>
    </RemotionPreview>
  ),
};

export const BillowyClouds: Story = {
  args: {
    pattern: "billowy",
    color1: "#e0e7ff",
    color2: "#818cf8",
    backgroundColor: "#1e1b4b",
    scale: 4,
    octaves: 4,
    speed: 0.5,
  },
  render: (args: NoiseFlowBackgroundProps) => (
    <RemotionPreview durationInFrames={180} width={800} height={450}>
      <AbsoluteFill>
        <NoiseFlowBackground {...args} width={800} height={450} />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-4xl font-bold text-white drop-shadow-lg">
            Billowy Clouds
          </div>
        </div>
        <Noise opacity={0.02} width={800} height={450} />
      </AbsoluteFill>
    </RemotionPreview>
  ),
};

export const DomainWarp: Story = {
  args: {
    pattern: "warp",
    color1: "#ff6b6b",
    color2: "#feca57",
    backgroundColor: "#1a1a2e",
    scale: 2,
    octaves: 4,
    speed: 0.5,
  },
  render: (args: NoiseFlowBackgroundProps) => (
    <RemotionPreview durationInFrames={240} width={800} height={450}>
      <AbsoluteFill>
        <NoiseFlowBackground {...args} width={800} height={450} />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-4xl font-bold text-white drop-shadow-lg">
            Domain Warp
          </div>
        </div>
        <Noise opacity={0.02} width={800} height={450} />
      </AbsoluteFill>
    </RemotionPreview>
  ),
};

export const CellularPattern: Story = {
  args: {
    pattern: "cells",
    color1: "#10b981",
    color2: "#34d399",
    backgroundColor: "#022c22",
    scale: 3,
    octaves: 3,
    speed: 0.7,
  },
  render: (args: NoiseFlowBackgroundProps) => (
    <RemotionPreview durationInFrames={180} width={800} height={450}>
      <AbsoluteFill>
        <NoiseFlowBackground {...args} width={800} height={450} />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-4xl font-bold text-white drop-shadow-lg">
            Cellular
          </div>
        </div>
        <Noise opacity={0.02} width={800} height={450} />
      </AbsoluteFill>
    </RemotionPreview>
  ),
};
