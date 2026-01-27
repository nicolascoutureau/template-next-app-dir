import type { Meta, StoryObj } from "@storybook/react";
import { RemotionPreview } from "./RemotionPreview";
import { TunnelBackground, Noise } from "../index";
import type { TunnelBackgroundProps } from "../index";
import { AbsoluteFill } from "remotion";

const meta: Meta<TunnelBackgroundProps> = {
  title: "Motion Library/Background/TunnelBackground",
  component: TunnelBackground,
  parameters: {
    layout: "centered",
  },
  argTypes: {
    tunnelStyle: {
      control: "select",
      options: ["warp", "vortex", "grid", "neon", "starfield", "digital"],
    },
    speed: { control: { type: "range", min: 0.1, max: 3, step: 0.1 } },
    depth: { control: { type: "range", min: 0.5, max: 3, step: 0.1 } },
    segments: { control: { type: "range", min: 5, max: 50, step: 5 } },
    rotation: { control: { type: "range", min: 0, max: 2, step: 0.1 } },
    glow: { control: { type: "range", min: 0.5, max: 2, step: 0.1 } },
    centerX: { control: { type: "range", min: -1, max: 1, step: 0.1 } },
    centerY: { control: { type: "range", min: -1, max: 1, step: 0.1 } },
  },
};

export default meta;
type Story = StoryObj<TunnelBackgroundProps>;

export const HyperspaceWarp: Story = {
  args: {
    tunnelStyle: "warp",
    color1: "#0070f3",
    color2: "#00ffff",
    speed: 1.5,
    depth: 1,
    segments: 20,
  },
  render: (args: TunnelBackgroundProps) => (
    <RemotionPreview durationInFrames={120} width={800} height={450}>
      <AbsoluteFill>
        <TunnelBackground {...args} width={800} height={450} />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-4xl font-bold text-white drop-shadow-lg">
            HYPERSPACE
          </div>
        </div>
        <Noise opacity={0.02} width={800} height={450} />
      </AbsoluteFill>
    </RemotionPreview>
  ),
};

export const SpiralingVortex: Story = {
  args: {
    tunnelStyle: "vortex",
    color1: "#ff0080",
    color2: "#7928ca",
    speed: 1,
    rotation: 0.5,
    segments: 15,
  },
  render: (args: TunnelBackgroundProps) => (
    <RemotionPreview durationInFrames={120} width={800} height={450}>
      <AbsoluteFill>
        <TunnelBackground {...args} width={800} height={450} />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-4xl font-bold text-white drop-shadow-lg">
            VORTEX
          </div>
        </div>
        <Noise opacity={0.02} width={800} height={450} />
      </AbsoluteFill>
    </RemotionPreview>
  ),
};

export const RetroGrid: Story = {
  args: {
    tunnelStyle: "grid",
    color1: "#00ff00",
    color2: "#00ff88",
    backgroundColor: "#0a0a0a",
    speed: 1,
    segments: 30,
    rotation: 0.1,
  },
  render: (args: TunnelBackgroundProps) => (
    <RemotionPreview durationInFrames={120} width={800} height={450}>
      <AbsoluteFill>
        <TunnelBackground {...args} width={800} height={450} />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-4xl font-bold text-green-400 drop-shadow-lg" style={{ fontFamily: "monospace" }}>
            GRID_TUNNEL
          </div>
        </div>
        <Noise opacity={0.03} width={800} height={450} />
      </AbsoluteFill>
    </RemotionPreview>
  ),
};

export const NeonRings: Story = {
  args: {
    tunnelStyle: "neon",
    color1: "#ff00ff",
    color2: "#00ffff",
    speed: 1,
    segments: 25,
    glow: 1.5,
    rotation: 0.3,
  },
  render: (args: TunnelBackgroundProps) => (
    <RemotionPreview durationInFrames={120} width={800} height={450}>
      <AbsoluteFill>
        <TunnelBackground {...args} width={800} height={450} />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-4xl font-bold text-white drop-shadow-lg">
            NEON
          </div>
        </div>
        <Noise opacity={0.02} width={800} height={450} />
      </AbsoluteFill>
    </RemotionPreview>
  ),
};

export const StarWarp: Story = {
  args: {
    tunnelStyle: "starfield",
    color1: "#ffffff",
    color2: "#88ccff",
    backgroundColor: "#000011",
    speed: 2,
    depth: 1.5,
  },
  render: (args: TunnelBackgroundProps) => (
    <RemotionPreview durationInFrames={120} width={800} height={450}>
      <AbsoluteFill>
        <TunnelBackground {...args} width={800} height={450} />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-4xl font-bold text-white drop-shadow-lg">
            LIGHTSPEED
          </div>
        </div>
      </AbsoluteFill>
    </RemotionPreview>
  ),
};

export const DigitalMatrix: Story = {
  args: {
    tunnelStyle: "digital",
    color1: "#00ff88",
    color2: "#00ffcc",
    backgroundColor: "#000a05",
    speed: 1,
    segments: 20,
    rotation: 0.2,
  },
  render: (args: TunnelBackgroundProps) => (
    <RemotionPreview durationInFrames={120} width={800} height={450}>
      <AbsoluteFill>
        <TunnelBackground {...args} width={800} height={450} />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-4xl font-bold text-green-400 drop-shadow-lg" style={{ fontFamily: "monospace" }}>
            DIGITAL
          </div>
        </div>
        <Noise opacity={0.02} width={800} height={450} />
      </AbsoluteFill>
    </RemotionPreview>
  ),
};

export const OffCenterWarp: Story = {
  args: {
    tunnelStyle: "warp",
    color1: "#f97316",
    color2: "#eab308",
    backgroundColor: "#1c1917",
    speed: 1.2,
    centerX: -0.3,
    centerY: 0.15,
  },
  render: (args: TunnelBackgroundProps) => (
    <RemotionPreview durationInFrames={120} width={800} height={450}>
      <AbsoluteFill>
        <TunnelBackground {...args} width={800} height={450} />
        <div className="absolute inset-0 flex items-end justify-start p-8">
          <div className="text-4xl font-bold text-white drop-shadow-lg">
            Off-Center
          </div>
        </div>
        <Noise opacity={0.02} width={800} height={450} />
      </AbsoluteFill>
    </RemotionPreview>
  ),
};
